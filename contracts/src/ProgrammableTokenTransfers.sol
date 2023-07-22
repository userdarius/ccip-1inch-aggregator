// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {OwnerIsCreator} from "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.0/token/ERC20/IERC20.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

/// @title - A simple messenger contract for sending/receiving messages and tokens across chains.
/// Pay using native tokens (e.g, ETH in Ethereum)
contract ProgrammableTokenTransfers is CCIPReceiver, OwnerIsCreator {
    // Custom errors to provide more descriptive revert messages.
    error NoMessageReceived(); // Used when trying to access a message but no messages have been received.
    error IndexOutOfBound(uint256 providedIndex, uint256 maxIndex); // Used when the provided index is out of bounds.
    error MessageIdNotExist(bytes32 messageId); // Used when the provided message ID does not exist.
    error NothingToWithdraw(); // Used when trying to withdraw Ether but there's nothing to withdraw.
    error FailedToWithdrawEth(address owner, address target, uint256 value); // Used when the withdrawal of Ether fails.

    // Event emitted when a message is sent to another chain.
    // The address of the sender so we can index the requests.
    // The unique ID of the message.
    // The chain selector of the destination chain.
    // The address of the receiver on the destination chain.
    // The message being sent.
    // The token amount that was sent.
    // The fees paid for sending the message.
    event MessageSent(
        address indexed sender,
        bytes32 indexed messageId,
        uint64 indexed destinationChainSelector,
        address receiver,
        bytes message,
        Client.EVMTokenAmount tokenAmount,
        uint256 fees
    );

    // Event emitted when a message is received from another chain.
    // The chain selector of the source chain.
    // The address of the sender from the source chain.
    // The message that was received.
    // The token amount that was received.
    event MessageReceived( // The unique ID of the message.
        bytes32 indexed messageId,
        uint64 indexed sourceChainSelector,
        address sender,
        string message,
        Client.EVMTokenAmount tokenAmount
    );

    // Struct to hold details of a message.
    struct Message {
        address user; // the user who sent the message.
        uint64 sourceChainSelector; // The chain selector of the source chain.
        address sender; // The address of the sender.
        bytes message; // The content of the message.
        address token; // received token.
        uint256 amount; // received amount.
    }

    // Storage variables.
    bytes32[] public receivedMessages; // Array to keep track of the IDs of received messages.
    mapping(bytes32 => Message) public messageDetail; // Mapping from message ID to Message struct, storing details of each received message.

    uint256 eth_BnM_rate = 1e4;
    //address on sepolia
    address wethAddr = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    IERC20 WETH = IERC20(wethAddr);
    // address on Sepolia
    address BnMAddr = 0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05;
    IERC20 BnM = IERC20(BnMAddr);

    /// @notice Constructor initializes the contract with the router address.
    /// @param router The address of the router contract.
    constructor(address router) CCIPReceiver(router) {}

    function initSwap(address tokenAddress, uint256 _tokenAmount, uint64 _destinationChainSelector, address receiver)
        external
    {
        WETH.transferFrom(msg.sender, address(this), _tokenAmount);
        uint256 amount = _swapETHforBnM(_tokenAmount);
        bytes memory bytesAddress = abi.encode(tokenAddress);
        _sendMessage(msg.sender, _destinationChainSelector, receiver, bytesAddress, BnMAddr, amount);
    }

    /// @notice Sends data to receiver on the destination chain.
    /// @dev Assumes your contract has sufficient native asset (e.g, ETH on Ethereum, MATIC on Polygon...). Internal
    /// function because we must swap ETH for BnM before calling the function
    /// @param destinationChainSelector The identifier (aka selector) for the destination blockchain.
    /// @param receiver The address of the recipient on the destination blockchain.
    /// @param message The bytes message to be sent.
    /// @param token token address.
    /// @param amount token amount.
    /// @return messageId The ID of the message that was sent.
    function _sendMessage(
        address caller,
        uint64 destinationChainSelector,
        address receiver,
        bytes memory message,
        address token,
        uint256 amount
    ) internal returns (bytes32 messageId) {
        // set the tokent amounts
        Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](1);
        Client.EVMTokenAmount memory tokenAmount = Client.EVMTokenAmount({token: token, amount: amount});
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
        messageId = router.ccipSend{value: fees}(destinationChainSelector, evm2AnyMessage);

        // Emit an event with message details
        emit MessageSent(caller, messageId, destinationChainSelector, receiver, message, tokenAmount, fees);

        // Return the message ID
        return messageId;
    }

    //1 BnM = 10 000 ETH  -- 1 ETH = 0.0001 BnM
    // 10 000 * 10^18 = 1 * 10^18
    //1 * 10^18 = 1 * 10^14
    function _swapETHforBnM(uint256 amount) internal view returns (uint256) {
        return amount / eth_BnM_rate;
    }

    /// handle a received message
    function _ccipReceive(Client.Any2EVMMessage memory any2EvmMessage) internal override {
        bytes32 messageId = any2EvmMessage.messageId; // fetch the messageId
        uint64 sourceChainSelector = any2EvmMessage.sourceChainSelector; // fetch the source chain identifier (aka selector)
        address sender = abi.decode(any2EvmMessage.sender, (address)); // abi-decoding of the sender address
        Client.EVMTokenAmount[] memory tokenAmounts = any2EvmMessage.destTokenAmounts;
        address token = tokenAmounts[0].token; // we expect one token to be transfered at once but of course, you can transfer several tokens.
        uint256 amount = tokenAmounts[0].amount; // we expect one token to be transfered at once but of course, you can transfer several tokens.
        bytes memory bytesMessage = abi.decode(any2EvmMessage.data, (bytes)); // abi-decoding of the sent bytes message
        receivedMessages.push(messageId);
        Message memory detail = Message(msg.sender, sourceChainSelector, sender, bytesMessage, token, amount);
        messageDetail[messageId] = detail;

        string memory message = abi.decode(bytesMessage, (string)); // abi-decoding of the sent bytes message
        emit MessageReceived(messageId, sourceChainSelector, sender, message, tokenAmounts[0]);
    }

    /// @notice Get the total number of received messages.
    /// @return number The total number of received messages.
    function getNumberOfReceivedMessages() external view returns (uint256 number) {
        return receivedMessages.length;
    }

    /// @notice Fetches details of a received message by message ID.
    /// @dev Reverts if the message ID does not exist.
    /// @param messageId The ID of the message whose details are to be fetched.
    /// @return sourceChainSelector The source chain identifier (aka selector).
    /// @return sender The address of the sender.
    /// @return message The received message.
    /// @return token The received token.
    /// @return amount The received token amount.
    function getReceivedMessageDetails(bytes32 messageId)
        external
        view
        returns (uint64 sourceChainSelector, address sender, bytes memory message, address token, uint256 amount)
    {
        Message memory detail = messageDetail[messageId];
        if (detail.sender == address(0)) revert MessageIdNotExist(messageId);
        return (detail.sourceChainSelector, detail.sender, detail.message, detail.token, detail.amount);
    }

    /// @notice Fetches details of a received message by its position in the received messages list.
    /// @dev Reverts if the index is out of bounds.
    /// @param index The position in the list of received messages.
    /// @return messageId The ID of the message.
    /// @return sourceChainSelector The source chain identifier (aka selector).
    /// @return sender The address of the sender.
    /// @return message The received message.
    /// @return token The received token.
    /// @return amount The received token amount.
    function getReceivedMessageAt(uint256 index)
        external
        view
        returns (
            bytes32 messageId,
            uint64 sourceChainSelector,
            address sender,
            bytes memory message,
            address token,
            uint256 amount
        )
    {
        if (index >= receivedMessages.length) {
            revert IndexOutOfBound(index, receivedMessages.length - 1);
        }
        messageId = receivedMessages[index];
        Message memory detail = messageDetail[messageId];
        return (messageId, detail.sourceChainSelector, detail.sender, detail.message, detail.token, detail.amount);
    }

    /// @notice Fetches the details of the last received message.
    /// @dev Reverts if no messages have been received yet.
    /// @return messageId The ID of the last received message.
    /// @return sourceChainSelector The source chain identifier (aka selector) of the last received message.
    /// @return sender The address of the sender of the last received message.
    /// @return message The last received message.
    /// @return token The last transferred token.
    /// @return amount The last transferred token amount.
    function getLastReceivedMessageDetails()
        external
        view
        returns (
            bytes32 messageId,
            uint64 sourceChainSelector,
            address sender,
            bytes memory message,
            address token,
            uint256 amount
        )
    {
        // Revert if no messages have been received
        if (receivedMessages.length == 0) revert NoMessageReceived();

        // Fetch the last received message ID
        messageId = receivedMessages[receivedMessages.length - 1];

        // Fetch the details of the last received message
        Message memory detail = messageDetail[messageId];

        return (messageId, detail.sourceChainSelector, detail.sender, detail.message, detail.token, detail.amount);
    }

    /// @notice Fallback function to allow the contract to receive Ether.
    /// @dev This function has no function body, making it a default function for receiving Ether.
    /// It is automatically called when Ether is sent to the contract without any data.
    receive() external payable {}

    /// @notice Allows the contract owner to withdraw the entire balance of Ether from the contract.
    /// @dev This function reverts if there are no funds to withdraw or if the transfer fails.
    /// It should only be callable by the owner of the contract.
    /// @param beneficiary The address to which the Ether should be sent.
    function withdraw(address beneficiary) public onlyOwner {
        // Retrieve the balance of this contract
        uint256 amount = address(this).balance;

        // Revert if there is nothing to withdraw
        if (amount == 0) revert NothingToWithdraw();

        // Attempt to send the funds, capturing the success status and discarding any return data
        (bool sent,) = beneficiary.call{value: amount}("");

        // Revert if the send failed, with information about the attempted transfer
        if (!sent) revert FailedToWithdrawEth(msg.sender, beneficiary, amount);
    }

    /// @notice Allows the owner of the contract to withdraw all tokens of a specific ERC20 token.
    /// @dev This function reverts with a 'NothingToWithdraw' error if there are no tokens to withdraw.
    /// @param beneficiary The address to which the tokens will be sent.
    /// @param token The contract address of the ERC20 token to be withdrawn.
    function withdrawToken(address beneficiary, address token) public onlyOwner {
        // Retrieve the balance of this contract
        uint256 amount = IERC20(token).balanceOf(address(this));

        // Revert if there is nothing to withdraw
        if (amount == 0) revert NothingToWithdraw();

        IERC20(token).transfer(beneficiary, amount);
    }
}
