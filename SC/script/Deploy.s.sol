// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {SupplyChainTracker} from "../src/SupplyChainTracker.sol";

contract DeployScript is Script {
    function run() external returns (SupplyChainTracker) {
        vm.startBroadcast();

        SupplyChainTracker tracker = new SupplyChainTracker();
        
        console.log("SupplyChainTracker desplegado en:", address(tracker));
        console.log("Admin:", tracker.admin());

        vm.stopBroadcast();
        return tracker;
    }
}

