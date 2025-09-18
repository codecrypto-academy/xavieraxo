//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract HolaMundo is Ownable {
    string private mensaje;
    constructor() Ownable(msg.sender){
        mensaje = "Hola mundo desde foundry";
    }
    function obtenerMensaje() public view returns (string memory){
        return mensaje;
    } 

    function actualizarMensaje(string memory _nuevo) public onlyOwner {
        mensaje = _nuevo;
    }
    
}