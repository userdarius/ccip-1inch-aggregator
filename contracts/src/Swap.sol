// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "openzeppelin/token/ERC20/IERC20.sol";
import "openzeppelin/security/ReentrancyGuard.sol";
import "openzeppelin/access/Ownable.sol";

contract Swap is ReentrancyGuard, Ownable {
    IERC20 public tokenX;
    IERC20 public tokenY;

    uint256 public rate = 1000; // 1 TokenX equals 1000 TokenY

    constructor(IERC20 _tokenX, IERC20 _tokenY) {
        tokenX = _tokenX;
        tokenY = _tokenY;
    }

    function swap(uint256 _amountX) public nonReentrant returns (uint256){
        require(_amountX > 0, "Swap amount should be greater than 0");
        uint256 amountY = _amountX / rate; // Calculate the equivalent amount of TokenX
        require(tokenX.balanceOf(address(this)) >= amountY, "Not enough TokenY in the contract");

        // Transfer TokenX from user to this contract
        require(tokenX.transferFrom(msg.sender, address(this), _amountX), "Transfer of TokenY from user failed");

        // Send the equivalent amount of TokenX back to the user
        require(tokenY.transfer(msg.sender, amountY), "Transfer of TokenY to user failed");

        return amountY;
    }
}
