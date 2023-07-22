// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "openzeppelin/token/ERC20/ERC20.sol";
import "openzeppelin/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    constructor() ERC20("USD Coin", "USDC") {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
