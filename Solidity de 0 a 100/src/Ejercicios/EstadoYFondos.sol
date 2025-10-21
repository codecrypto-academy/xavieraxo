// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EstadosYFondos {
    string[] public nombres; // storage
    uint256 public x = 10;

    function agregarNombres(string calldata _n) external {
        nombres.push(_n);
    } // modifica estado

    function verNombre(uint256 i) external view returns (string memory) {
        return nombres[i];
    } // view

    function sumarAyX(uint256 a) external view returns (uint256) {
        return a + x;
    } // view

    function multiplicar(uint256 a, uint256 b) external pure returns (uint256) {
        return a * b;
    } // pure

    struct Cartera {
        string nombre;
        address direccion;
        uint256 saldo;
    }

    mapping(address => Cartera) public saldoCartera;

    function agregarSaldo(string calldata _nombre) external payable {
        // payable
        saldoCartera[msg.sender] = Cartera(_nombre, msg.sender, msg.value);
    }
}
