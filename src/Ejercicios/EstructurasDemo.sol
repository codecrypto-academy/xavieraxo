// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EstructurasDemo {
    struct Carro { string nombre; uint ano; bool nuevo; }
    Carro[] public lista;

    function agregarCarro(string memory n, uint a, bool x) external {
        lista.push(Carro(n, a, x));
    }
    function getCarro(uint i) external view returns (string memory, uint, bool) {
        Carro storage c = lista[i];
        return (c.nombre, c.ano, c.nuevo);
    }

    struct Sujeto { uint id; string nombre; int8 edad; }
    mapping(address => Sujeto) private padron;

    function setSujeto(uint id, string memory nom, int8 ed) external {
        padron[msg.sender] = Sujeto(id, nom, ed);
    }
    function me() external view returns (uint, string memory, int8) {
        Sujeto storage s = padron[msg.sender];
        return (s.id, s.nombre, s.edad);
    }
}
