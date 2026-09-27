// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title IERC8056
 * @notice ERC-8056 Scaled UI Amount Extension implemented by Robinhood Stock Tokens
 * @dev Defines the corporate-action multiplier (uiMultiplier) for stock splits, dividends, etc.
 * Fixed-point with 18 decimals (1e18 = 1.0).
 */
interface IERC8056 is IERC20 {
    /**
     * @notice Returns the corporate action multiplier.
     * @return Multiplier formatted with 18 decimals (1e18 = 1.0)
     */
    function uiMultiplier() external view returns (uint256);

    /**
     * @notice Emitted when a corporate action updates the multiplier.
     */
    event UIMultiplierUpdated(uint256 newMultiplier, uint256 effectiveTimestamp);
}
