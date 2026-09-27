// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IERC8056.sol";
import "./interfaces/AggregatorV3Interface.sol";

/**
 * @title StockTokenAdapter
 * @notice Normalizes onchain pricing, decimal conversion, and corporate action multipliers
 *         for Robinhood Chain Stock Tokens.
 * @dev Connects 6-decimal USDG to 18-decimal Stock Tokens and 8-decimal Chainlink feeds.
 */
contract StockTokenAdapter is Ownable {
    // Mapping from stock token address => Chainlink price feed address
    mapping(address => address) public priceFeeds;
    
    // Mapping from stock token address => maximum allowed oracle staleness in seconds
    mapping(address => uint256) public maxStaleness;

    event PriceFeedUpdated(address indexed stockToken, address indexed feed, uint256 maxStaleness);

    error InvalidPrice(address stockToken, int256 price);
    error StalePriceFeed(address stockToken, uint256 updatedAt, uint256 currentTimestamp);
    error FeedNotConfigured(address stockToken);

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Configure or update the Chainlink price feed for a stock token
     * @param stockToken Address of the ERC-20 Stock Token (e.g. TSLA, AMZN, AMD)
     * @param feed Address of the Chainlink AggregatorV3 price feed
     * @param _maxStaleness Maximum seconds before feed is considered stale (e.g. 86400 for 1 day, or custom for weekend session)
     */
    function setPriceFeed(address stockToken, address feed, uint256 _maxStaleness) external onlyOwner {
        require(stockToken != address(0) && feed != address(0), "Zero address");
        priceFeeds[stockToken] = feed;
        maxStaleness[stockToken] = _maxStaleness > 0 ? _maxStaleness : 86400; // default 24h
        emit PriceFeedUpdated(stockToken, feed, maxStaleness[stockToken]);
    }

    /**
     * @notice Get the latest normalized price for a stock token in USD (8 decimals, Chainlink standard)
     * @param stockToken The stock token address
     * @return price Price in 8 decimals (e.g. $250.00 = 25000000000)
     */
    function getLatestPrice(address stockToken) public view returns (uint256 price) {
        address feedAddress = priceFeeds[stockToken];
        if (feedAddress == address(0)) revert FeedNotConfigured(stockToken);

        AggregatorV3Interface feed = AggregatorV3Interface(feedAddress);
        (
            ,
            int256 answer,
            ,
            uint256 updatedAt,
            
        ) = feed.latestRoundData();

        if (answer <= 0) revert InvalidPrice(stockToken, answer);

        // Staleness check
        uint256 stalenessLimit = maxStaleness[stockToken];
        if (block.timestamp > updatedAt + stalenessLimit) {
            revert StalePriceFeed(stockToken, updatedAt, block.timestamp);
        }

        return uint256(answer);
    }

    /**
     * @notice Calculate how many stock token units (18 decimals) can be bought with a given USDG amount (6 decimals)
     * @param stockToken The target stock token address
     * @param usdgAmount Amount of USDG (6 decimals) to spend
     * @return stockAmount Amount of stock tokens to receive (18 decimals)
     */
    function calculateStockAmount(
        address stockToken,
        uint256 usdgAmount
    ) external view returns (uint256 stockAmount) {
        uint256 priceUSD = getLatestPrice(stockToken); // 8 decimals

        // usdgAmount (6 decimals) * 1e8 = USD equivalent in 8 decimals * 1e6
        // Price is in 8 decimals.
        // stockAmount should be in 18 decimals.
        // Formula: (usdgAmount [6] * 1e18 * 1e8) / (priceUSD [8] * 1e6) = (usdgAmount * 1e20) / (priceUSD)
        stockAmount = (usdgAmount * 1e20) / priceUSD;

        // Apply ERC-8056 UI Multiplier if supported by contract
        try IERC8056(stockToken).uiMultiplier() returns (uint256 multiplier) {
            if (multiplier > 0 && multiplier != 1e18) {
                // Effective shares are scaled by multiplier / 1e18
                stockAmount = (stockAmount * 1e18) / multiplier;
            }
        } catch {
            // Standard ERC-20 without multiplier, keep calculated amount
        }
    }

    /**
     * @notice Calculate how much USDG (6 decimals) is needed to buy a specific amount of stock tokens (18 decimals)
     * @param stockToken The stock token address
     * @param stockAmount Amount of stock tokens desired (18 decimals)
     * @return usdgAmount Amount of USDG (6 decimals) required
     */
    function calculateUSDGAmount(
        address stockToken,
        uint256 stockAmount
    ) external view returns (uint256 usdgAmount) {
        uint256 priceUSD = getLatestPrice(stockToken); // 8 decimals

        // Invert calculation:
        // usdgAmount [6] = (stockAmount [18] * priceUSD [8]) / 1e20
        usdgAmount = (stockAmount * priceUSD) / 1e20;
    }
}
