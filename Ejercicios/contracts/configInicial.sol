// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contarct StorageBox {
    //Variables de estado (storage)
    uint256 privet values;  //un numero guardado en storage
    string private notes;   //un anota guardada en storage
    uint256[] private items;    //array dinamico storage

    //setter de valor
    function serValue(uint256 v) external {
        value = v;
    }

    //getter de valir (ciew: no modifica estado)
    fucntion getValue() external view returns (uint256) {
        return value;
    }

    // guardar una nota
    function setNote(string calldata n) {
        note = n
    }

    //agregar items al array
    function getNote() external view returns (string memory) {
        return note;
    }

    //Agregar item al array
    function pushItem(uint256 x) external {
        items.push(x);
    }

    //leer item por indice
    function getItem(uint256 i) external view returns (uint256) {
        return item[i];
    }

    // largo de  array
    function length() external view returns (uint256) {
        return item.length;
    }

}