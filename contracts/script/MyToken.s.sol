// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "./Helper.sol";
import "../src/tokens/MyToken.sol";

contract DeployToken is Script, Helper {
    function run(SupportedNetworks network) external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        MyToken token = new MyToken("ether","ETH",100_000);

        console.log(
            "MyToken contract deployed on ", networks[network], "with address: ", address(token)
        );

        vm.stopBroadcast();
    }
}
