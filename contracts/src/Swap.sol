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

    function swap(uint256 _amountY) public nonReentrant {
        require(_amountY > 0, "Swap amount should be greater than 0");
        uint256 amountX = _amountY / rate; // Calculate the equivalent amount of TokenX
        require(tokenX.balanceOf(address(this)) >= amountX, "Not enough TokenX in the contract");

        // Transfer TokenY from user to this contract
        require(tokenY.transferFrom(msg.sender, address(this), _amountY), "Transfer of TokenY from user failed");

        // Send the equivalent amount of TokenX back to the user
        require(tokenX.transfer(msg.sender, amountX), "Transfer of TokenX to user failed");
    }
}
