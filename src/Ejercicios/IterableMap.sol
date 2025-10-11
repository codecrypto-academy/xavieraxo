// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract IterableMap {
    mapping(address => uint) public balance;
    mapping(address => bool) public inserted;
    address[] public keys;

    function set(address k, uint v) external {
        balance[k] = v;
        if (!inserted[k]) { inserted[k] = true; keys.push(k); }
    }
    function size() external view returns (uint) { return keys.length; }
    function at(uint i) external view returns (address k, uint v) {
        k = keys[i]; v = balance[k];
    }
}
