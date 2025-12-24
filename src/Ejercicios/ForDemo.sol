// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ForDemo {
    address[] private direcciones;

    function suma100(int numero) external pure returns (int s) {
        for (int i = numero; i < numero + 100; i++) { s += i; }
    }

    function asociar() external { direcciones.push(msg.sender); }

    function comprobarAsociacion() external view returns (bool estado, address dir) {
        for (uint i = 0; i < direcciones.length; i++) {
            if (direcciones[i] == msg.sender) return (true, msg.sender);
        }
        return (false, address(0));
    }
}
