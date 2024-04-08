// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TokenContract {
    string public name = "ES";
    string public symbol = "EST";
    uint8 public decimals = 18;
    uint256 public totalSupply = 1000000 * (10 ** uint256(decimals));
    uint public soldTokens = 0;
    address public owner;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    modifier onlyOwner() {
        require(owner == msg.sender, "Not owner");
        _;
    }

    constructor() {
        balanceOf[msg.sender] = totalSupply;
    }

    function safeAdd(uint256 a, uint256 b) internal  pure returns (uint256 c) {
        require((c = a+b) >= a, "Addition overflow");
    }

    function safeSub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "Subtraction underflow");
        uint256 c = a - b;
        return c;
    }

    function transfer(address _to, uint256 _value) public payable returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "Not enough balance");
        balanceOf[msg.sender] = safeSub(balanceOf[msg.sender], _value);
        balanceOf[_to] = safeAdd(balanceOf[_to],_value);
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public payable returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function approve(address _owner,address _spender, uint256 _value) public payable returns (bool success) {
        allowance[_owner][_spender] = _value;
        emit Approval(_owner, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public payable returns (bool success) {
        require(_value <= allowance[_from][_to], "Allowance exceeded");
        require(_value <= balanceOf[_from], "Not enough balance");
        balanceOf[_from] = safeSub(balanceOf[_from] , _value);
        balanceOf[_to] = safeAdd(balanceOf[_to], _value);
        allowance[_from][_to] = safeSub(allowance[_from][_to], _value);
        emit Transfer(_from, _to, _value);
        return true;
    }

    // function buyTokens(uint256 _numberOfTokens) public payable returns (bool success){
    //     require(this.balanceOf(owner) <= _numberOfTokens,"Token shortage.");
    //     this.approve(owner, _numberOfTokens);
    //     this.transferFrom(owner, msg.sender, _numberOfTokens );

    //     soldTokens = safeAdd(soldTokens, _numberOfTokens);
    //     return true;
    // }
}