// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract IfDemo {
    function numeroGanador(int256 n) external pure returns (string memory) {
        return n == 7 ? "Has ganado" : "Has perdido";
    }

    function valorAbsoluto(int256 n) external pure returns (int256) {
        return n < 0 ? -n : n;
    }

    function esParDeTres(uint256 n) external pure returns (bool) {
        return n % 2 == 0 && n >= 100 && n <= 999;
    }

    function _eq(string memory a, string memory b) internal pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

    function votar(string memory c) external pure returns (string memory) {
        if (_eq(c, "Ronaldinho")) return "Has votado a Ronaldinho";
        else if (_eq(c, "Messi")) return "Has votado a Messi";
        else if (_eq(c, "Cristiano")) return "Has votado a Cristiano";
        return "No has votado a ningún candidato";
    }
}
