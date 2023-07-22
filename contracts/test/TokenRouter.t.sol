//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import {BurnMintERC677Helper} from "./IDrip.sol";
import "../src/TokenRouter.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";

contract tokenRouterTest is Test {

    address BnMAddress = 0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05;
    IERC20 BnM = IERC20(BnMAddress);
    //address fujiRouterAddress = 0x554472a2720E5E7D5D3C817529aBA05EEd5F82D8;
    //IERC20 link = IERC20(0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846);
    //tokenRouter tokenRouterInit = new tokenRouter(fujiRouterAddress);

    TokenRouter public tokenRouter;
    address sepoliaRouterAddress = 0xD0daae2231E9CB96b94C8512223533293C3693Bf;
    //address on sepolia
    address wethAddr = 0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9;
    IERC20 WETH = IERC20(wethAddr);
    address facticeUser1;
    string SEPOLIA_RPC_URL =
        "https://eth-sepolia.g.alchemy.com/v2/rSzq1mBkglecUjABcZVUsqElDDh591ds";

    function setUp() public {
        uint256 sepolia = vm.createSelectFork(SEPOLIA_RPC_URL); // eth mainnet at block 16_153_817
        tokenRouter = new TokenRouter(sepoliaRouterAddress);

        // Deploy the contract
        //give to tokenRouter for fees
        deal(wethAddr,address(tokenRouter), 5e18);
        console.log("tokenRouter WETH balance: ", WETH.balanceOf(address(tokenRouter)));
        //give BnM for the artificial swap
        deal(BnMAddress, address(tokenRouter),10e18);
        console.log(
            "tokenRouter BnM balance: ",
            BnM.balanceOf(address(tokenRouter))
        );

        //create the factice user that calls the tokenRouter
        facticeUser1 = makeAddr("facticeUser1");
        vm.startPrank(facticeUser1);
        deal(wethAddr, facticeUser1, 10_000 ether);
        vm.stopPrank();
        vm.label(facticeUser1, "factice User 1");
    }

    function testSendToSwap() public {
        console.log(
            "tokenRouter balance: ",
            BnM.balanceOf(address(tokenRouter))
        );
        console.log(
            "tokenRouter balance: ",
            WETH.balanceOf(address(tokenRouter))
        );

        tokenRouter.sendToSwap(
            address(BnM),
            address(WETH),
            1 * 10 ** 18,
            14767482510784806043,
            address(this)
        );
    }

    function testInitSwap() public {
        vm.startPrank(facticeUser1);
        WETH.approve(address(tokenRouter), 10_000 ether);
        // assertEq(
        //     tokenRouter.initSwap(
        //         wethAddr,
        //         1,
        //         14767482510784806043,
        //         0xf49c3931e3D978f7833BBFC99FC2793DcbF8d85E
        //     ),
        //     0
        // );
        vm.stopPrank();
    }

    function testRecieverFunction() public {
         vm.startPrank(facticeUser1);
        WETH.approve(address(tokenRouter), 10_000 ether);

    }
}
