// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../../src/auth/SecureVault.sol";

contract SecureVaultTest is Test {
    SecureVault private vault;
    address alice = address(0xA11CE);
    address bob   = address(0xB0B);

    function setUp() public {
        vault = new SecureVault();
    }

    function testOwnerInicialEsDeployer() public {
        assertEq(vault.owner(), address(this));
    }

    function testPrank_SoloUnaLlamada() public {
        // deployer transfiere propiedad a ALICE
        vault.setOwner(alice);
        assertEq(vault.owner(), alice);

        // BOB intenta cambiar el owner: debe revertir (sólo esa llamada)
        vm.prank(bob);
        vm.expectRevert(SecureVault.NotOwner.selector);
        vault.setOwner(bob);
    }

    function testStartPrank_MultiplesLlamadas() public {
        // setear owner en ALICE
        vault.setOwner(alice);

        vm.startPrank(alice);        // todas las llamadas siguientes son de ALICE
        vault.bump();                // ok
        vault.bump();                // ok
        assertEq(vault.bumps(), 2);
        vm.stopPrank();

        // fuera del rango de start/stop, vuelve a ser address(this)
        vm.expectRevert(SecureVault.NotOwner.selector);
        vault.bump();
    }

    function testWithdraw_ConFondos() public {
        // fondeamos el contrato directamente
        vm.deal(address(vault), 2 ether);

        // dueño pasa a ser ALICE
        vault.setOwner(alice);

        // medimos balances antes/después
        uint256 aliceBefore = alice.balance;
        uint256 vaultBefore = address(vault).balance;

        vm.startPrank(alice);
        vault.withdraw(1 ether);
        vm.stopPrank();

        assertEq(address(vault).balance, vaultBefore - 1 ether);
        assertEq(alice.balance, aliceBefore + 1 ether);
    }
}