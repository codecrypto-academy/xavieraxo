// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MiModifier {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Solo owner");
        _;
    }

    function mensaje() public view onlyOwner returns (string memory) {
        return "ok";
    }
}
