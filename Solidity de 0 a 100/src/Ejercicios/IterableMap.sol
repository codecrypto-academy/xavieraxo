// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract IterableMap {
    mapping(address => uint256) public balance;
    mapping(address => bool) public inserted;
    address[] public keys;

    function set(address k, uint256 v) external {
        balance[k] = v;
        if (!inserted[k]) {
            inserted[k] = true;
            keys.push(k);
        }
    }

    function size() external view returns (uint256) {
        return keys.length;
    }

    function at(uint256 i) external view returns (address k, uint256 v) {
        k = keys[i];
        v = balance[k];
    }
}
