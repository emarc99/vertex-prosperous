// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./NovaVault.sol";
import "./StockTokenAdapter.sol";

/**
 * @title YieldStreamer
 * @notice Autonomous DCA & Rebalancing Engine for NovaWealth on Robinhood Chain.
 * @dev Harvests excess USDG yield from NovaVault and streams it into user-selected
 *      Robinhood Stock Tokens (TSLA, AMZN, AMD, NFLX, PLTR) with session-key authorization.
 */
contract YieldStreamer is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    NovaVault public vault;
    StockTokenAdapter public adapter;
    IERC20 public usdg;

    // Basis points denominator (10000 = 100%)
    uint256 public constant BPS_DENOMINATOR = 10000;

    // Stock target allocation item
    struct AllocationItem {
        address stockToken;
        uint256 weightBps; // In basis points (e.g. 3000 = 30%)
    }

    // User's target allocation basket
    mapping(address => AllocationItem[]) public userBaskets;

    // Session key permissions: user => executor => isAuthorized
    mapping(address => mapping(address => bool)) public authorizedExecutors;

    // Daily spend tracking for session keys: user => dayTimestamp => spentUSDG
    mapping(address => mapping(uint256 => uint256)) public dailyYieldSpent;
    mapping(address => uint256) public userMaxDailySpend; // in USDG (6 decimals)

    // Secondary market liquidity provider or swap router
    address public liquiditySource;

    event BasketUpdated(address indexed user, uint256 itemCount);
    event ExecutorAuthorized(address indexed user, address indexed executor, bool authorized);
    event DailyLimitSet(address indexed user, uint256 maxUSDG);
    event YieldStreamed(
        address indexed user,
        address indexed stockToken,
        uint256 usdgSpent,
        uint256 stockAmountPurchased
    );
    event LiquiditySourceUpdated(address indexed newSource);

    error InvalidWeights();
    error UnauthorizedExecutor();
    error DailyLimitExceeded(uint256 requested, uint256 allowed);
    error NoAllocationConfigured();

    modifier onlyAuthorizedExecutor(address user) {
        if (msg.sender != user && !authorizedExecutors[user][msg.sender] && msg.sender != owner()) {
            revert UnauthorizedExecutor();
        }
        _;
    }

    constructor(
        NovaVault _vault,
        StockTokenAdapter _adapter,
        IERC20 _usdg,
        address _initialOwner
    ) Ownable(_initialOwner) {
        vault = _vault;
        adapter = _adapter;
        usdg = _usdg;
    }

    function setLiquiditySource(address _source) external onlyOwner {
        liquiditySource = _source;
        emit LiquiditySourceUpdated(_source);
    }

    /**
     * @notice Set user's target Stock Token allocation basket
     * @param tokens Array of Robinhood Stock Token addresses (e.g. TSLA, AMZN, AMD, etc.)
     * @param weightsBps Array of weights in basis points (sum must equal 10,000)
     */
    function setAllocationBasket(
        address[] calldata tokens,
        uint256[] calldata weightsBps
    ) external {
        require(tokens.length == weightsBps.length, "Length mismatch");
        require(tokens.length > 0, "Empty basket");

        delete userBaskets[msg.sender];
        uint256 totalWeight = 0;

        for (uint256 i = 0; i < tokens.length; i++) {
            require(tokens[i] != address(0), "Zero address token");
            require(weightsBps[i] > 0, "Weight must be > 0");
            totalWeight += weightsBps[i];
            userBaskets[msg.sender].push(AllocationItem({
                stockToken: tokens[i],
                weightBps: weightsBps[i]
            }));
        }

        if (totalWeight != BPS_DENOMINATOR) revert InvalidWeights();
        emit BasketUpdated(msg.sender, tokens.length);
    }

    /**
     * @notice Authorize an autonomous Copilot / Session Key to execute DCA on behalf of user
     */
    function authorizeExecutor(address executor, bool isAuthorized) external {
        authorizedExecutors[msg.sender][executor] = isAuthorized;
        emit ExecutorAuthorized(msg.sender, executor, isAuthorized);
    }

    /**
     * @notice Set maximum daily USDG yield the copilot can stream
     */
    function setMaxDailySpend(uint256 maxUSDG) external {
        userMaxDailySpend[msg.sender] = maxUSDG;
        emit DailyLimitSet(msg.sender, maxUSDG);
    }

    /**
     * @notice Get user's current allocation basket
     */
    function getUserBasket(address user) external view returns (AllocationItem[] memory) {
        return userBaskets[user];
    }

    /**
     * @notice Harvest accrued yield and execute DCA into the user's Stock Token basket
     * @dev Called either by the user directly or by their authorized AI Copilot session key
     * @param user Target user whose yield is being streamed into stock tokens
     * @param usdgAmount Total USDG yield (6 decimals) to harvest and distribute
     */
    function streamYield(
        address user,
        uint256 usdgAmount
    ) external onlyAuthorizedExecutor(user) nonReentrant {
        require(usdgAmount > 0, "Amount must be > 0");
        AllocationItem[] memory basket = userBaskets[user];
        if (basket.length == 0) revert NoAllocationConfigured();

        // Check daily limit if called by delegated session key
        if (msg.sender != user && userMaxDailySpend[user] > 0) {
            uint256 today = block.timestamp / 1 days;
            uint256 currentSpend = dailyYieldSpent[user][today];
            if (currentSpend + usdgAmount > userMaxDailySpend[user]) {
                revert DailyLimitExceeded(currentSpend + usdgAmount, userMaxDailySpend[user]);
            }
            dailyYieldSpent[user][today] += usdgAmount;
        }

        // Harvest strictly accrued yield from NovaVault (principal is safe)
        vault.harvestYield(usdgAmount, address(this));

        // Distribute yield according to basket weights
        for (uint256 i = 0; i < basket.length; i++) {
            uint256 sliceUSDG = (usdgAmount * basket[i].weightBps) / BPS_DENOMINATOR;
            if (sliceUSDG == 0) continue;

            // Calculate expected stock token units using Chainlink + ERC-8056 normalizer
            uint256 stockAmount = adapter.calculateStockAmount(basket[i].stockToken, sliceUSDG);

            // Execute acquisition:
            // If liquiditySource is configured, swap USDG for stock tokens from liquidity source;
            // Otherwise, deliver stock tokens directly from streamer pool to user
            address stockToken = basket[i].stockToken;
            if (liquiditySource != address(0)) {
                usdg.safeTransfer(liquiditySource, sliceUSDG);
                IERC20(stockToken).safeTransferFrom(liquiditySource, user, stockAmount);
            } else {
                // Direct transfer to user
                IERC20(stockToken).safeTransfer(user, stockAmount);
            }

            emit YieldStreamed(user, stockToken, sliceUSDG, stockAmount);
        }
    }
}
