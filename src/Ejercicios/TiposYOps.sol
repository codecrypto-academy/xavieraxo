// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
contract TiposYOps {
    uint256 public total;
    struct Ticket { uint64 id; uint64 qty; bool vip; }
    mapping(address => Ticket) public tix;
    function add(uint256 a, uint256 b) external pure returns (uint256) { return a + b; } // checked
    function addFast(uint256 a, uint256 b) external pure returns (uint256 r) { unchecked { r = a + b; } }
}
