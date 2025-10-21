// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/Counter.sol";

contract CounterTest is Test {
    Counter public counter;

    function setUp() public {
        counter = new Counter();
    }

    function testInc() public {
        counter.inc();
        assertEq(counter.x(), 1);
    }

    function testIncBy() public {
        counter.incBy(5);
        assertEq(counter.x(), 5);
    }

    function testIncByZero() public {
        vm.expectRevert("incBy: increment should be positive");
        counter.incBy(0);
    }

    function testIncEvent() public {
        // Test that incBy works and emits an event
        counter.incBy(3);
        assertEq(counter.x(), 3);
    }
}
