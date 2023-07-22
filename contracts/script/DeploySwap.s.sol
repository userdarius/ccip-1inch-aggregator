// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "./Helper.sol";
import "../src/Swap.sol";
import "openzeppelin/token/ERC20/IERC20.sol";
import "../src/USDC.sol";

contract DeploySwapOnSepolia is Script, Helper {
    function run(SupportedNetworks network) external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        MyToken usdc = new MyToken();
        address link = 0x779877A7B0D9E8603169DdbD7836e478b4624789;

        Swap swap = new Swap(
                IERC20(link), usdc
            );

        console.log("Swap contract deployed on ", networks[network], "with address: ", address(swap));

        vm.stopBroadcast();
    }
}
