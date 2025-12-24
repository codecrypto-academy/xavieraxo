// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract NotasSeguras {
    mapping(address => string[]) private notas;
    event NoteAdded(address indexed who, bytes32 hash);

    modifier onlyOwnerOf(uint256 idx) {
        require(idx < notas[msg.sender].length, "idx out of range");
        _;
    }

    function addNote(string memory s) external {
        notas[msg.sender].push(s);
        emit NoteAdded(msg.sender, keccak256(abi.encodePacked(s)));
    }

    function getNote(uint256 idx) external view onlyOwnerOf(idx) returns (string memory) {
        return notas[msg.sender][idx];
    }

    function exists(string memory s) external view returns (bool) {
        bytes32 h = keccak256(abi.encodePacked(s));
        string[] storage mine = notas[msg.sender];
        for (uint256 i = 0; i < mine.length; i++) {
            if (keccak256(abi.encodePacked(mine[i])) == h) return true;
        }
        return false;
    }

    // (opcional) cantidad de notas propias
    function myCount() external view returns (uint256) { return notas[msg.sender].length; }
}
