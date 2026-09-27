// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../interfaces/IERC8056.sol";

/**
 * @title MockStockToken
 * @notice Mock implementation of a Robinhood Stock Token with 18 decimals and ERC-8056 multiplier.
 */
contract MockStockToken is ERC20, IERC8056 {
    uint256 private _multiplier = 1e18; // 1.0 initial multiplier (1e18 standard)

    constructor(
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) {
        _mint(msg.sender, 100_000 * 10 ** 18);
    }

    function uiMultiplier() external view override returns (uint256) {
        return _multiplier;
    }

    function setUIMultiplier(uint256 newMultiplier) external {
        _multiplier = newMultiplier;
        emit UIMultiplierUpdated(newMultiplier, block.timestamp);
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
