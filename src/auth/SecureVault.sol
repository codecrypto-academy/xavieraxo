// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SecureVault {
    address payable public owner;
    uint256 public bumps;

    error NotOwner();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor() {
        owner = payable(msg.sender);
    }

    receive() external payable {}

    function setOwner(address newOwner) external onlyOwner {
        owner = payable(newOwner);
    }

    function withdraw(uint256 amount) external onlyOwner {
        payable(msg.sender).transfer(amount);
    }

    function bump() external onlyOwner {
        unchecked { bumps++; }
    }
}