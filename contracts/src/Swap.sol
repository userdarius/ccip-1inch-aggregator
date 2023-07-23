// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "openzeppelin/token/ERC20/IERC20.sol";
import "openzeppelin/security/ReentrancyGuard.sol";
import "openzeppelin/access/Ownable.sol";

contract Swap is ReentrancyGuard, Ownable {

    IERC20 public immutable tokenX;
    IERC20 public immutable tokenY;

    constructor(IERC20 _tokenX, IERC20 _tokenY) {
        tokenX = _tokenX;
        tokenY = _tokenY;
    }
    
    receive() external payable {}


    function swap(IERC20 token, uint256 amount) public nonReentrant returns (uint256) {
        require(amount > 0, "Swap amount should be greater than 0");

        (IERC20 tokenIn, IERC20 tokenOut) = token == tokenX ? (tokenX, tokenY) : (tokenY, tokenX);

        require(tokenOut.balanceOf(address(this)) >= amount, "Not enough Token in the contract");

        // Transfer Token from user to this contract
        tokenIn.transferFrom(msg.sender, address(this), amount);

        // Send the equivalent amount of Token back to the user
        tokenOut.transfer(msg.sender, amount);

        return amount;
    }
}