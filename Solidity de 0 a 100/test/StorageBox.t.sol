// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/StorageBox.sol";

contract StorageBoxTest is Test {
    StorageBox public storageBox;

    function setUp() public {
        storageBox = new StorageBox();
    }

    function testSetAndGetValue() public {
        storageBox.setValue(42);
        assertEq(storageBox.getValue(), 42);
    }

    function testSetAndGetNote() public {
        string memory testNote = "Esta es una nota de prueba";
        storageBox.setNote(testNote);
        assertEq(storageBox.getNote(), testNote);
    }

    function testPushItem() public {
        storageBox.pushItem(100);
        assertEq(storageBox.getItem(0), 100);
        assertEq(storageBox.length(), 1);
    }

    function testMultipleItems() public {
        storageBox.pushItem(1);
        storageBox.pushItem(2);
        storageBox.pushItem(3);

        assertEq(storageBox.length(), 3);
        assertEq(storageBox.getItem(0), 1);
        assertEq(storageBox.getItem(1), 2);
        assertEq(storageBox.getItem(2), 3);
    }
}
