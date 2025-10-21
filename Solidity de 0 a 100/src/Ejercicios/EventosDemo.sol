// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EventosDemo {
    event Deposito1(string indexed nombre);
    event Deposito2(string indexed nombre, uint256 cantidad);
    event Deposito3(string, uint256, address indexed, bytes32);

    function depositar(string calldata _nombre) external {
        emit Deposito1(_nombre);
    }

    function depositar2(string calldata _nombre, uint256 _cantidad) external {
        emit Deposito2(_nombre, _cantidad);
    }

    function depositar3(string calldata _nom, uint256 _eda) external {
        bytes32 h = keccak256(abi.encodePacked(_nom, _eda, msg.sender));
        emit Deposito3(_nom, _eda, msg.sender, h);
    }
}
