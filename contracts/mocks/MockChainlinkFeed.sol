// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../interfaces/AggregatorV3Interface.sol";

/**
 * @title MockChainlinkFeed
 * @notice Mock implementation of Chainlink AggregatorV3Interface with 8 decimals.
 */
contract MockChainlinkFeed is AggregatorV3Interface {
    uint8 public override decimals = 8;
    string public override description;
    uint256 public override version = 1;

    int256 private _price;
    uint256 private _updatedAt;
    uint80 private _roundId = 1;

    constructor(string memory _desc, int256 initialPrice) {
        description = _desc;
        _price = initialPrice;
        _updatedAt = block.timestamp;
    }

    function setPrice(int256 newPrice) external {
        _price = newPrice;
        _updatedAt = block.timestamp;
        _roundId++;
    }

    function setUpdatedAt(uint256 timestamp) external {
        _updatedAt = timestamp;
    }

    function latestRoundData()
        external
        view
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (_roundId, _price, _updatedAt, _updatedAt, _roundId);
    }

    function getRoundData(
        uint80 _requestedRoundId
    )
        external
        view
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (_requestedRoundId, _price, _updatedAt, _updatedAt, _requestedRoundId);
    }
}
