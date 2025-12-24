// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract StorageBox {
    //Variables de estado (storage)
    uint256 private value; //un numero guardado en storage
    string private note; //una nota guardada en storage
    uint256[] private items; //array dinamico storage

    //setter de valor
    function setValue(uint256 v) external {
        value = v;
    }

    //getter de valor (view: no modifica estado)
    function getValue() external view returns (uint256) {
        return value;
    }

    // guardar una nota
    function setNote(string calldata n) external {
        note = n;
    }

    //leer una nota
    function getNote() external view returns (string memory) {
        return note;
    }

    //Agregar item al array
    function pushItem(uint256 x) external {
        items.push(x);
    }

    //leer item por indice
    function getItem(uint256 i) external view returns (uint256) {
        return items[i];
    }

    // largo del array
    function length() external view returns (uint256) {
        return items.length;
    }
}
