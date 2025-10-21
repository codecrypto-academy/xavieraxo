// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/LoggerDemo.sol";

contract LoggerDemoTest is Test {
    LoggerDemo private demo;

    function steUp() public {
        demo = new LoggerDemo();
    }

    function testSumLogs() public {
        console.log("Antes de sumar:", 5, 7);
        uint256 r = demo.sum(5, 7);
        console.log("Resultado devuelto: ", r);

        assertEq(r, 12);

        uint256 tot = demo.getTotal();
        console.logUint(tot);
        assertEq(tot, 12);
    }

    function testLogTipos() public {
        address who = address(this);
        string memory msgx = "Debug de string";
        int256 neg = -42;

        console.log("Llamado por:", who);
        console.logString(msgx);
        console.logInt(neg); // para enteros con signo
        assertTrue(true); // placeholder
    }
}
