// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library ArrayRemove {
    function removeShift(uint[] storage a, uint i) internal {
        require(i < a.length, "out of bounds");
        for (uint j = i; j < a.length - 1; j++) a[j] = a[j+1];
        a.pop();
    }
    function removeSwap(uint[] storage a, uint i) internal {
        require(i < a.length, "out of bounds");
        a[i] = a[a.length - 1];
        a.pop();
    }
}
