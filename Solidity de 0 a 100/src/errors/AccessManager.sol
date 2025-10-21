// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AccessManager {
    error NotOwner();
    error ZeroAddress();

    address public owner;

    event OwnerChanges(address indexed previousOwner, address indexed newOwner);

    constructor() {
        owner = msg.sender;
        emit OwnerChanges(address(0), owner);
    }

    function setOwner(address nuevo) external {
        if (msg.sender != owner) revert NotOwner();
        if (nuevo == address(0)) revert ZeroAddress();

        address prev = owner;
        owner = nuevo;
        emit OwnerChanges(prev, nuevo);
    }
}
