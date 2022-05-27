// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

contract PsalmToken {
    string public name = "Psalm Token";

    string public symbol = "PST";

    uint256 public totalSupply;

    mapping (address=>uint256) public balanceOf;

    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed sender, address indexed recipient,uint256 _value);
    event Approval(address indexed ownder, address indexed spender, uint256 _value);

    constructor(uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success){
       require(balanceOf[msg.sender] >= _value);
       balanceOf[msg.sender] -= _value;
       balanceOf[_to]+= _value;

       emit Transfer(msg.sender, _to, _value);
       return true;
    }


    function approve(address spender, uint256 _value) public returns (bool success){
        allowance[msg.sender][spender] = _value;
        emit Approval(msg.sender,spender, _value);
        return true;
    }


    function transferFrom(address from, address to, uint256 _value) public returns (bool success){
       require(allowance[from][msg.sender] >= _value);
       require(balanceOf[from] >= _value);
       balanceOf[from] -= _value;
       balanceOf[to] += _value;
       allowance[from][msg.sender] -= _value;

       emit Transfer(from, to, _value);
       return true;
    }
}