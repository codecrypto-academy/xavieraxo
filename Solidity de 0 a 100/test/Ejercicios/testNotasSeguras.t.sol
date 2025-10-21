// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../../src/Ejercicios/NotasSeguras.sol";

contract NotasSegurasTest is Test {
    NotasSeguras ns;
    address alice = address(0xA11CE);
    address bob = address(0xB0B);

    function setUp() public {
        ns = new NotasSeguras();
    }

    function test_Add_And_Exists() public {
        vm.prank(alice);
        ns.addNote("Hola");

        vm.startPrank(alice);
        ns.addNote("Solidity");
        assertTrue(ns.exists("Hola"));
        assertFalse(ns.exists("hola")); // distinto por mayúscula
        vm.stopPrank();
    }

    function test_GetNote_OwnIndexOnly() public {
        vm.prank(alice);
        ns.addNote("Privada de Alice");
        vm.prank(bob);
        vm.expectRevert(bytes("idx out of range")); // Bob no tiene notas => idx 0 inválido
        ns.getNote(0);
    }
}
