// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/HolaMundo.sol";

contract HolaMundoTest is Test {
    HolaMundo public hola;
    address nonOwner;

    function setUp() public {
        hola = new HolaMundo();
        nonOwner = address(0xBEEF);
    }

    function testMensajeInicial() public {
        assertEq(hola.obtenerMensaje(), "Hola mundo desde foundry");
    }

    function testOwnerPuedeActualizar() public {
        hola.actualizarMensaje("Nuevo");
        assertEq(hola.obtenerMensaje(), "Nuevo");
    }

    function testNoOwnerNoPuedeActualizar() public {
        vm.prank(nonOwner);
        vm.expectRevert(); // revert de Ownable
        hola.actualizarMensaje("hack");
    }
}
