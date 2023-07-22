//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "forge-std/Test.sol";
import "../src/TokenRouter.sol";
import {BurnMintERC677Helper} from "./IDrip.sol";

contract tokenRouterTest is Test {
    BurnMintERC677Helper BnM = BurnMintERC677Helper(0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4);
    address fujiRouterAddress = 0x554472a2720E5E7D5D3C817529aBA05EEd5F82D8;
    IERC20 link = IERC20(0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846);
    tokenRouter tokenRouterInit = new tokenRouter(
                fujiRouterAddress
            );

    function setUp() public {
        // Deploy the contract
        vm.deal(address(tokenRouterInit), 5e18);
        console.log("tokenRouter balance: ", address(tokenRouterInit).balance);
        BnM.drip(address(tokenRouterInit));
        console.log("tokenRouter balance: ", BnM.balanceOf(address(tokenRouterInit)));
    }

    function testSendToSwap() public {
        console.log("tokenRouter balance: ", BnM.balanceOf(address(tokenRouterInit)));
        console.log("tokenRouter balance: ", link.balanceOf(address(tokenRouterInit)));

        tokenRouterInit.sendToSwap(address(BnM), address(link), 1 * 10 ** 18, 14767482510784806043, address(this));
        // Send 1 LINK to the contract
        // link.transfer(address(tokenRouter), 1 * 10**18);

        // Send 1 LINK to the contract
        // link.transfer(address(tokenRouter), 1 * 10**18);

        // Send 1 LINK to the contract
        // link.transfer(address(tokenRouter), 1 * 10**18);

        // Send 1 LINK to the contract
        // link.transfer(address(tokenRouter), 1 * 10**18);

        // Send 1 LINK to the contract
        // link.transfer(address(tokenRouter), 1 * 10**18);

        // Send 1 LINK to the contract
        // link.transfer(address(tokenRouter), 1 * 10**18);

        // Send 1 LINK to the contract
        // link.transfer(address(tokenRouter), 1 * 10**18);

        // Send 1 LINK to the contract
        // link.transfer(address(tokenRouter), 1 * 10**18);

        // Send 1 LINK to the contract
        // link.transfer(address(tokenRouter), 1 * 10**18);
    }
}
