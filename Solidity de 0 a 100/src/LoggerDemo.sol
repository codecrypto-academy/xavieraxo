// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/console.sol";

contract LoggerDemo {
    uint256 private total;

    function sum(uint256 a, uint256 b) external returns (uint256) {
        uint256 r = a + b;

        console.log("sum called width:", a, b);
        console.logUint(r);
        total += r;
        return r;
    }

    function getTotal() external view returns (uint256) {
        return total;
    }
}
