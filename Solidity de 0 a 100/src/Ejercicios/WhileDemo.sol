// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract WhileDemo {
    function sumaImpares() external pure returns (int256 s) {
        int256 i = 1;
        while (i <= 100) {
            if (i % 2 != 0) s += i;
            i++;
        }
    }

    function sumarNaturales(uint256 n) external pure returns (uint256 s) {
        uint256 i = 1;
        while (i <= n) {
            s += i;
            i++;
        }
    }

    function contarDigitos(uint256 n) external pure returns (uint256 c) {
        if (n == 0) return 1;
        while (n != 0) {
            n /= 10;
            c++;
        }
    }

    function invertirNumero(uint256 n) external pure returns (uint256 inv) {
        while (n != 0) {
            inv = inv * 10 + (n % 10);
            n /= 10;
        }
    }
}
