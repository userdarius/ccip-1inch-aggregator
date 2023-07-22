// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {OwnerIsCreator} from "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.0/token/ERC20/IERC20.sol";
import {Swap} from "./Swap.sol";

contract tokenRouter is CCIPReceiver, OwnerIsCreator {
    error NoMessageReceived(); // Used when trying to access a message but no messages have been received.
    error IndexOutOfBound(uint256 providedIndex, uint256 maxIndex); // Used when the provided index is out of bounds.
    error MessageIdNotExist(bytes32 messageId); // Used when the provided message ID does not exist.
    error NothingToWithdraw(); // Used when trying to withdraw Ether but there's nothing to withdraw.
    error FailedToWithdrawEth(address owner, address target, uint256 value); // Used when the withdrawal of Ether fails.

    Swap public swapper;

    event MessageSent(
        bytes32 indexed messageId,
        uint64 indexed destinationChainSelector,
        address receiver,
        bytes message,
        Client.EVMTokenAmount tokenAmount,
        uint256 fees
    );

    event MessageReceived(
        bytes32 indexed messageId,
        uint64 indexed sourceChainSelector,
        address sender,
        string message,
        Client.EVMTokenAmount tokenAmount
    );

    event SwapCompletedOnDestinationChain(string message);

    struct Message {
        address user;
        uint64 sourceChainSelector;
        address sender;
        bytes message;
        address token;
        uint256 amount;
    }

    bytes32[] public receivedMessages;
    mapping(bytes32 => Message) public messageDetail;
    uint256 eth_BnM_rate = 10_000;

    constructor(address router) CCIPReceiver(router) {}

    // Swap on destination chain tokenX for tokenY
    function sendToSwap(
        address tokenX,
        address tokenY,
        uint256 _tokenAmount,
        uint64 _destinationChainSelector,
        address receiver
    ) external {
         IERC20 token = IERC20(tokenX);
        token.transferFrom(msg.sender, address(this), _tokenAmount);
        uint256 amount = _swapTokenforBnM(_tokenAmount);
        // Encode the token to swap to once on the other chain
        bytes memory message = abi.encode(tokenY);
        // Send the message to the other chain
        _sendMessage(_destinationChainSelector, receiver, message, tokenX, amount);
    }

    //1 BnM = 10 000 ETH  -- 1 ETH = 0.0001 BnM
    // 10 000 * 10^18 = 1 * 10^18
    //1 * 10^18 ETH = 1 * 10^14 BnM
    function _swapTokenforBnM(uint256 amount) internal view returns (uint256) {
        return amount / eth_BnM_rate;
    }

    function _sendMessage(
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
        emit MessageSent(messageId, destinationChainSelector, receiver, message, tokenAmount, fees);

        // Return the message ID
        return messageId;
    }

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
       
        // Proceed to swap on destination chain
        swapper.swap(amount);
        emit SwapCompletedOnDestinationChain("Swap Completed, proceeding to send back the tokens");
        getLastReceivedMessageDetails();
        // Send back the tokens to the source chain
        //_sendMessage(sourceChainSelector, sender, bytesMessage, token, amount);
    }

    receive() external payable {}

    function withdraw(address _beneficiary) public onlyOwner {
        // Retrieve the balance of this contract
        uint256 amount = address(this).balance;

        // Revert if there is nothing to withdraw
        if (amount == 0) revert NothingToWithdraw();

        // Attempt to send the funds, capturing the success status and discarding any return data
        (bool sent,) = _beneficiary.call{value: amount}("");

        // Revert if the send failed, with information about the attempted transfer
        if (!sent) revert FailedToWithdrawEth(msg.sender, _beneficiary, amount);
    }

    /// @notice Allows the owner of the contract to withdraw all tokens of a specific ERC20 token.
    /// @dev This function reverts with a 'NothingToWithdraw' error if there are no tokens to withdraw.
    /// @param _beneficiary The address to which the tokens will be sent.
    /// @param _token The contract address of the ERC20 token to be withdrawn.
    function withdrawToken(address _beneficiary, address _token) public onlyOwner {
        // Retrieve the balance of this contract
        uint256 amount = IERC20(_token).balanceOf(address(this));

        // Revert if there is nothing to withdraw
        if (amount == 0) revert NothingToWithdraw();

        IERC20(_token).transfer(_beneficiary, amount);
    }

    function getReceivedMessageDetails(bytes32 messageId)
        public
        view
        returns (uint64 sourceChainSelector, address sender, bytes memory message, address token, uint256 amount)
    {
        Message memory detail = messageDetail[messageId];
        if (detail.sender == address(0)) revert MessageIdNotExist(messageId);
        return (detail.sourceChainSelector, detail.sender, detail.message, detail.token, detail.amount);
    }

    function getLastReceivedMessageDetails()
        public
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
}
