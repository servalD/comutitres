// SPDX-License-Identifier: MIT
pragma solidity ^0.8.35;

import {Script} from "forge-std/Script.sol";

import {SmartTicketRegistry} from "../src/SmartTicketRegistry.sol";

contract Deploy is Script {
    function run() external returns (SmartTicketRegistry registry) {
        address admin = vm.envOr("REGISTRY_ADMIN", msg.sender);
        address registrar = vm.envOr("REGISTRY_REGISTRAR", admin);

        vm.startBroadcast();
        registry = new SmartTicketRegistry(admin, registrar);
        vm.stopBroadcast();
    }
}

