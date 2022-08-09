// SPDX-License-Identifier: MIT
pragma solidity >=0.8.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SLABS is ERC20, Ownable {

    uint public initialSupply = 1000000000 ether;
    
    constructor() ERC20("SLABS", "SLABS") {
        _mint(_msgSender(),initialSupply);
    }

    function mintTokens(uint amount) public onlyOwner {
        _mint(_msgSender(), amount);
    }
    
    function burnTokens(uint amount) external onlyOwner {
        _burn(_msgSender(), amount);
    }

}