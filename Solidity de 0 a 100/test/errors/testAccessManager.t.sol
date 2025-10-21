// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../errors/AccessManager.sol"; // o: import "src/errors/AccessManager.sol";

contract AccessManagerTest is Test {
    AccessManager private am;
    address alice = address(0xA11CE);
    address bob = address(0xB0B);

    function setUp() public {
        am = new AccessManager(); // owner = address(this)
    }

    // 1) Un no-dueño no puede cambiar el owner → NotOwner()
    function test_SetOwner_Revert_NotOwner() public {
        vm.prank(alice);
        vm.expectRevert(AccessManager.NotOwner.selector);
        am.setOwner(bob);
    }

    // 2) Owner válido, pero intenta setear address(0) → ZeroAddress()
    function test_SetOwner_Revert_ZeroAddress() public {
        vm.expectRevert(AccessManager.ZeroAddress.selector);
        am.setOwner(address(0));
    }

    // 3) Flujo feliz: el owner cambia correctamente y emite el evento
    function test_SetOwner_Success() public {
        // (Opcional) verificar evento
        vm.expectEmit(true, true, false, false, address(am));
        emit AccessManager.OwnerChanged(address(this), alice);

        am.setOwner(alice);
        assertEq(am.owner(), alice, "owner debe ser alice");
    }
}
