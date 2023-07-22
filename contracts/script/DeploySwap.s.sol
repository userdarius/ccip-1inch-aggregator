// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "forge-std/Script.sol";
import "./Helper.sol";
import "../src/Swap.sol";

contract DeploySwapOnSepolia is Script, Helper {
    function run(SupportedNetworks network) external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        Swap swap = new Swap(
                IERC20(0x779877A7B0D9E8603169DdbD7836e478b4624789), IERC20(0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05)
            );

        console.log(
            "ProgrammableTokenTransfers contract deployed on ", networks[network], "with address: ", address(swap)
        );

        vm.stopBroadcast();
    }
}
