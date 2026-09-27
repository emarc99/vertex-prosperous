// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title NovaVault
 * @notice ERC-4626 Yield Vault for Paxos USDG on Robinhood Chain with Instant T+0 Liquidity
 *         and Autonomous Yield Harvesting.
 * @dev Aligned with Robinhood Earn rails and composable DeFi lending protocols.
 */
contract NovaVault is ERC4626, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Total net USDG principal deposited across all users (6 decimals)
    uint256 public totalPrincipalDeposited;

    // Authorized YieldStreamer contract allowed to harvest excess yield
    address public yieldStreamer;

    // Target liquidity buffer in basis points (e.g. 1500 = 15% kept in vault for T+0 instant redemptions)
    uint256 public liquidityBufferBps = 1500;
    uint256 public constant BPS_DENOMINATOR = 10000;

    // Total yield harvested over lifetime of vault
    uint256 public totalYieldHarvested;

    event YieldStreamerUpdated(address indexed newStreamer);
    event YieldHarvested(address indexed recipient, uint256 amount);
    event YieldSimulated(uint256 amountAdded, uint256 newTotalYield);
    event LiquidityBufferUpdated(uint256 newBufferBps);

    error OnlyYieldStreamer();
    error InsufficientYield(uint256 requested, uint256 available);
    error PrincipalProtected();

    modifier onlyYieldStreamer() {
        if (msg.sender != yieldStreamer && msg.sender != owner()) {
            revert OnlyYieldStreamer();
        }
        _;
    }

    /**
     * @param _usdg Address of the Paxos USDG token (6 decimals)
     * @param _initialOwner Owner / admin of the vault
     */
    constructor(
        IERC20 _usdg,
        address _initialOwner
    )
        ERC20("NovaWealth Smart Cash Vault", "nvUSDG")
        ERC4626(_usdg)
        Ownable(_initialOwner)
    {}

    /**
     * @notice Set the authorized YieldStreamer address
     */
    function setYieldStreamer(address _streamer) external onlyOwner {
        require(_streamer != address(0), "Invalid streamer address");
        yieldStreamer = _streamer;
        emit YieldStreamerUpdated(_streamer);
    }

    /**
     * @notice Update target instant liquidity buffer in basis points
     */
    function setLiquidityBufferBps(uint256 _bps) external onlyOwner {
        require(_bps <= 5000, "Buffer cannot exceed 50%");
        liquidityBufferBps = _bps;
        emit LiquidityBufferUpdated(_bps);
    }

    /**
     * @notice Returns total accrued excess yield available for streaming (in USDG, 6 decimals)
     */
    function accruedYield() public view returns (uint256) {
        uint256 total = totalAssets();
        if (total > totalPrincipalDeposited) {
            return total - totalPrincipalDeposited;
        }
        return 0;
    }

    /**
     * @notice Harvest accrued yield for autonomous streaming into Stock Tokens.
     * @dev Strictly restricted to accrued yield; cannot touch principal!
     * @param amount Amount of USDG yield to harvest (6 decimals)
     * @param recipient Destination address to receive harvested USDG (typically YieldStreamer)
     */
    function harvestYield(
        uint256 amount,
        address recipient
    ) external onlyYieldStreamer nonReentrant returns (uint256) {
        uint256 available = accruedYield();
        if (amount > available) {
            revert InsufficientYield(amount, available);
        }

        totalYieldHarvested += amount;
        IERC20(asset()).safeTransfer(recipient, amount);

        emit YieldHarvested(recipient, amount);
        return amount;
    }

    /**
     * @notice Simulates or deposits external protocol yield (e.g. from Morpho lending or testnet liquidity)
     * @param amount Amount of USDG to inject as pure yield without increasing principal
     */
    function injectYield(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        IERC20(asset()).safeTransferFrom(msg.sender, address(this), amount);
        emit YieldSimulated(amount, accruedYield());
    }

    // --- Overrides for Principal Accounting ---

    function _deposit(
        address caller,
        address receiver,
        uint256 assets,
        uint256 shares
    ) internal override {
        super._deposit(caller, receiver, assets, shares);
        totalPrincipalDeposited += assets;
    }

    function _withdraw(
        address caller,
        address receiver,
        address owner,
        uint256 assets,
        uint256 shares
    ) internal override {
        super._withdraw(caller, receiver, owner, assets, shares);
        if (totalPrincipalDeposited >= assets) {
            totalPrincipalDeposited -= assets;
        } else {
            totalPrincipalDeposited = 0;
        }
    }

    /**
     * @notice Returns the decimals of the underlying asset (6 for Paxos USDG)
     */
    function decimals() public view virtual override(ERC4626) returns (uint8) {
        return 6;
    }
}
