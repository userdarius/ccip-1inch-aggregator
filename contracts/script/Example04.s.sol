// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "./Helper.sol";
import {TokenRouter} from "../src/TokenRouter.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.0/token/ERC20/IERC20.sol";

contract DeployProgrammableTokenTransfers is Script, Helper {
    function run(SupportedNetworks network) external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        (address router,,,) = getConfigFromNetwork(network);

        TokenRouter programmableTokenTransfers = new TokenRouter(
                router
            );

        console.log(
            "ProgrammableTokenTransfers contract deployed on ",
            networks[network],
            "with address: ",
            address(programmableTokenTransfers)
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
        vm.label(tokenX, "tokenX");
        IERC20(tokenX).approve(sender, amount);
        TokenRouter(sender).sendToSwap(tokenX, tokenY, amount, destinationChainId, receiver);

        console.log(
            "You can now monitor the status of your Chainlink CCIP Message via https://ccip.chain.link using CCIP Message ID: "
        );

        vm.stopBroadcast();
    }
}
