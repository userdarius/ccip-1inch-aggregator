// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

//TODO: get the info from frontend (eth + message + chain), message is not mandatory, in that case, we only do a swap on another chain
//TODO: swap eth for CCIP-BnM - 1 ETH = 1 CCIP-BnM
//TODO: call the sendMessage function from the ProgrammableTokenTransfer contract
/// Pay using native tokens (e.g, ETH in Ethereum)

import {ProgrammableTokenTransfers} from "./ProgrammableTokenTransfers.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {OwnerIsCreator} from "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.0/token/ERC20/IERC20.sol";

contract SourceSender is OwnerIsCreator{
    uint256 public number;

    // Event emitted when a message is sent to another chain.
    event MessageSent(
        bytes32 indexed messageId, // The unique ID of the message.
        uint64 indexed destinationChainSelector, // The chain selector of the destination chain.
        address receiver, // The address of the receiver on the destination chain.
        bytes message, // The message being sent.
        Client.EVMTokenAmount tokenAmount, // The token amount that was sent.
        uint256 fees // The fees paid for sending the message.
    );

    // Struct to hold details of a message.
    struct Message {
        uint64 sourceChainSelector; // The chain selector of the source chain.
        address sender; // The address of the sender.
        string message; // The content of the message.
        address token; // received token.
        uint256 amount; // received amount.
    }

    address immutable i_router;
    address immutable i_link;
    uint16 immutable i_maxTokensLength;
    uint256 eth_BnM_rate = 1e4;
    //address on sepolia
    address wethAddr = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    IERC20 WETH = IERC20(wethAddr);
    // address on Sepolia
    address BnMAddr = 0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05;
    IERC20 BnM = IERC20(BnMAddr);

    /// @notice Constructor initializes the contract with the router address.
    /// @param router The address of the router contract.
    constructor(address router, address link) {
        i_router = router;
        i_link = link;
        i_maxTokensLength = 5;
    }


    function initSwap(uint256 _tokenAmount, uint64 _destinationChainSelector, address receiver ) external {
        WETH.transferFrom(msg.sender, address(this), _tokenAmount);
        uint256 amount = _swapETHforBnM(_tokenAmount);

        _sendMessage(_destinationChainSelector, receiver," ", BnMAddr, amount);

    }


    /// @notice Sends data to receiver on the destination chain.
    /// @dev Assumes your contract has sufficient native asset (e.g, ETH on Ethereum, MATIC on Polygon...). Internal
    /// function because we must swap ETH for BnM before calling the function
    /// @param destinationChainSelector The identifier (aka selector) for the destination blockchain.
    /// @param receiver The address of the recipient on the destination blockchain.
    /// @param message The string message to be sent.
    /// @param token token address.
    /// @param amount token amount.
    /// @return messageId The ID of the message that was sent.
    function _sendMessage(
        uint64 destinationChainSelector,
        address receiver,
        bytes memory message,
        address token,
        uint256 amount
    ) internal returns (bytes32 messageId) {
        // set the tokent amounts
        Client.EVMTokenAmount[]
            memory tokenAmounts = new Client.EVMTokenAmount[](1);
        Client.EVMTokenAmount memory tokenAmount = Client.EVMTokenAmount({
            token: token,
            amount: amount
        });
        tokenAmounts[0] = tokenAmount;
        // Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
        Client.EVM2AnyMessage memory evm2AnyMessage = Client.EVM2AnyMessage({
            receiver: abi.encode(receiver), // ABI-encoded receiver address
            data: abi.encode(message), // ABI-encoded string message
            tokenAmounts: tokenAmounts, // Tokens amounts
            extraArgs: Client._argsToBytes(
                Client.EVMExtraArgsV1({gasLimit: 200_000, strict: false}) // Additional arguments, setting gas limit and non-strict sequency mode
            ),
            feeToken: address(0) // Setting feeToken to zero address, indicating native asset will be used for fees
        });

        // Initialize a router client instance to interact with cross-chain router
        IRouterClient router = IRouterClient(i_router);

        // approve the Router to spend tokens on contract's behalf. I will spend the amount of the given token
        IERC20(token).approve(address(router), amount);

        // Get the fee required to send the message
        uint256 fees = router.getFee(destinationChainSelector, evm2AnyMessage);

        // Send the message through the router and store the returned message ID
        messageId = router.ccipSend{value: fees}(
            destinationChainSelector,
            evm2AnyMessage
        );

        // Emit an event with message details
        emit MessageSent(
            messageId,
            destinationChainSelector,
            receiver,
            message,
            tokenAmount,
            fees
        );

        // Return the message ID
        return messageId;
    }

    //1 BnM = 10 000 ETH  -- 1 ETH = 0.0001 BnM
    // 10 000 * 10^18 = 1 * 10^18
    //1 * 10^18 = 1 * 10^14
    function _swapETHforBnM(uint256 amount) internal view returns (uint256){
        return amount / eth_BnM_rate;
    }
}
