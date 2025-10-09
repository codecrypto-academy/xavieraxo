// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EstadosYFondos {
    string[] public nombres;           // storage
    uint public x = 10;

    function agregarNombres(string calldata _n) external {
         nombres.push(_n); 
         }          // modifica estado

    function verNombre(uint i) external view returns (string memory) { 
        return nombres[i]; 
        } // view

    function sumarAyX(uint a) external view returns (uint) { 
        return a + x; 
        }            // view

    function multiplicar(uint a, uint b) external pure returns (uint) { 
        return a * b; 
        } // pure

    struct Cartera { 
        string nombre;
        address direccion; 
        uint saldo; 
        }
        
    mapping(address => Cartera) public saldoCartera;

    function agregarSaldo(string calldata _nombre) external payable {                   // payable
        saldoCartera[msg.sender] = Cartera(_nombre, msg.sender, msg.value);
    }
}
