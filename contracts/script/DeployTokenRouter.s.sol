// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "./Helper.sol";
import {tokenRouter} from "../src/TokenRouter.sol";

contract DeployTokenRouter is Script, Helper {
    function run(SupportedNetworks network) external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        (address router,,,) = getConfigFromNetwork(network);

        tokenRouter tokenRouterFujiToSepolia = new tokenRouter(
                router
            );

        console.log(
            "ProgrammableTokenTransfers contract deployed on ",
            networks[network],
            "with address: ",
            address(tokenRouterFujiToSepolia)
        );

        vm.stopBroadcast();
    }
}

contract SendTokensAndData is Script, Helper {
    function run(
        address payable sender,
        SupportedNetworks destination,
        address receiver,
        address tokenX,
        address tokenY,
        uint256 amount
    ) external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        (,,, uint64 destinationChainId) = getConfigFromNetwork(destination);
        console.log("wesh");
        tokenRouter(sender).sendToSwap(tokenX, tokenY, amount, destinationChainId, receiver);

        console.log(
            "You can now monitor the status of your Chainlink CCIP Message via https://ccip.chain.link using CCIP Message ID: "
        );

        vm.stopBroadcast();
    }
}
