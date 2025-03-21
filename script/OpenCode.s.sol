// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {OpenCode} from "../src/OpenCode.sol";

contract DeployOpenCode is Script {
    function run() external {
        vm.startBroadcast();
        
        OpenCode openCode = new OpenCode();
        console.log("OpenCode deployed at:", address(openCode));
        
        vm.stopBroadcast();
    }
}
