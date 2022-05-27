// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "./PsalmToken.sol";

contract PsalmTokenSale {
    address admin;
    PsalmToken public psalmToken;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(address buyer, uint256 numOfToken);

    constructor(PsalmToken _psalmToken,uint256 _tokenPrice) public {
      admin = msg.sender;
      psalmToken = _psalmToken;
      tokenPrice = _tokenPrice;
    }

    function buyToken(uint256 _numOfToken) public payable {
        require(msg.value == (_numOfToken * tokenPrice),"Not enough ether to buy token");
        require(psalmToken.balanceOf(address(this)) >= _numOfToken,"Checking the balance of the 'token sale' contract");
        require(psalmToken.transfer(msg.sender, _numOfToken));
        tokensSold+= _numOfToken;

       emit Sell(msg.sender, _numOfToken);
    }

    modifier onlyAdmin {
       require(msg.sender == admin,'Only Admin can end sale');
       _;
    }

    function endSale() public onlyAdmin {
       require(psalmToken.transfer(msg.sender, psalmToken.balanceOf(address(this))));
       selfdestruct(msg.sender);
    }
}