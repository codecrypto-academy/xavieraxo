// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Desordenado {
    uint256 public number; //espacios extra

    function setNumber(uint256 _newNumber) public {
        number = _newNumber;
    }

    function getNumber() public view returns (uint256) {
        return number;
    }
}
