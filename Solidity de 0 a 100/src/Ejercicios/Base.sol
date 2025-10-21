// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title HolaMundo
contract HolaMundo {
    string private mensaje;

    constructor() {
        mensaje = "Hola Mundo";
    }

    function getMensaje() public view returns (string memory) {
        return mensaje;
    }

    function setMensaje(string memory _nuevo) public {
        mensaje = _nuevo;
    }
}
