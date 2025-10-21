// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library ArrayRemove {
    function removeShift(uint256[] storage a, uint256 i) internal {
        require(i < a.length, "out of bounds");
        for (uint256 j = i; j < a.length - 1; j++) {
            a[j] = a[j + 1];
        }
        a.pop();
    }

    function removeSwap(uint256[] storage a, uint256 i) internal {
        require(i < a.length, "out of bounds");
        a[i] = a[a.length - 1];
        a.pop();
    }
}
