// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract WhileDemo {
    function sumaImpares() external pure returns (int s) {
        int i = 1; while (i <= 100) { if (i % 2 != 0) s += i; i++; }
    }
    function sumarNaturales(uint n) external pure returns (uint s) {
        uint i = 1; while (i <= n) { s += i; i++; }
    }
    function contarDigitos(uint n) external pure returns (uint c) {
        if (n == 0) return 1; while (n != 0) { n /= 10; c++; }
    }
    function invertirNumero(uint n) external pure returns (uint inv) {
        while (n != 0) { inv = inv * 10 + (n % 10); n /= 10; }
    }
}
