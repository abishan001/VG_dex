// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function approve(address spender, uint amount) external payable returns (bool);
    function approve(address owner,address spender, uint amount) external payable returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external payable returns (bool);
    function transfer(address recipient, uint256 amount) external payable returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract Swap {
    uint8 public decimals = 18;

    address public immutable token1;
    address public immutable token2;
    uint256 public reserve1 = 0;
    uint256 public reserve2 = 0;

    event LiquidityAdded(address indexed _provider,uint256 _amountToken1, uint256 _amountToken2);

    constructor(address _token1,address _token2){
        token1 = _token1;
        token2 = _token2;
    }

    // Addition function with overflow check
    function safeAdd(uint256 a, uint256 b) public pure returns (uint256 c) {
        require((c = a+b) >= a, "Addition overflow");
    }

    function safeSub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "Subtraction underflow");
        uint256 c = a - b;
        return c;
    }

    function addLiquidity(uint256 _amountToken1, uint256 _amountToken2) external payable {

        require(_amountToken1 > 0 && _amountToken2 > 0,"Token amount should be greater than 0.");
        require(IERC20(token1).balanceOf(msg.sender) > _amountToken1,"You do not have sufficient tokens.");
        require(IERC20(token2).balanceOf(msg.sender) > _amountToken2,"You do not have sufficient tokens.");

        require(IERC20(token1).approve(msg.sender,address(this),_amountToken1),"Allowance denied");
        require(IERC20(token2).approve(msg.sender,address(this),_amountToken2),"Allowance denied");

        require(IERC20(token1).transferFrom(msg.sender,address(this),_amountToken1), "Transfer failed.");
        require(IERC20(token2).transferFrom(msg.sender,address(this),_amountToken2), "Transfer failed.");

        reserve1 = safeAdd( reserve1  , _amountToken1 );
        reserve2 = safeAdd( reserve2 , _amountToken2 );

        emit LiquidityAdded(msg.sender, _amountToken1, _amountToken2);
    }

    // Function to calculate the amount of one token that can be obtained for a given amount of the other token
    function getAmountOut(uint256 _amountIn, uint256 _reserveIn, uint256 _reserveOut) internal pure returns (uint256) {
        require(_amountIn > 0, "Amount must be greater than zero");
        return (_amountIn * _reserveOut) / ( _reserveIn + _amountIn);
    }

    event Transfer(address indexed from, address indexed to, uint256 value);

    function swap(address _inputToken, address _outputToken, uint256 _amountIn) external payable {
        require( _amountIn > 0, "Amount should be greater than 0.");
        
        require(_inputToken == token1 || _inputToken == token2, "Invalid input token");
        require(_outputToken == token1 || _outputToken == token2, "Invalid output token");
        require(_inputToken != _outputToken, "Tokens must be different");

        require(IERC20(_inputToken).balanceOf(msg.sender) > _amountIn, "You do not have insufficient balance.");

        uint256 amountOut;
        uint256 amountInReserve;
        uint256 amountOutReserve;
        if (_inputToken == token1) {
            amountInReserve = reserve1;
            amountOutReserve = reserve2;
        } else {
            amountInReserve = reserve2;
            amountOutReserve = reserve1;
        }

        amountOut = getAmountOut(_amountIn, amountInReserve, amountOutReserve);
        require(IERC20(_outputToken).balanceOf(msg.sender) > amountOut, "You do not have insufficient balance.");

        IERC20(_inputToken).approve(msg.sender,address(this),_amountIn);
        IERC20(_inputToken).transferFrom(msg.sender, address(this), _amountIn);
        IERC20(_outputToken).transfer(address(this), amountOut);
    
    // Update reserves
        if (_inputToken == token1) {
            reserve1 += _amountIn;
            reserve2 -= amountOut;
        } else {
            reserve2 += _amountIn;
            reserve1 -= amountOut;
        }
    }

    function approveToken(address _token, uint256 _tm) external payable {
        IERC20(_token).approve(address(this),_tm);
    }


    function buyTokens(address _token, uint256 _numberOfTokens) external payable {
        require(_numberOfTokens > 0 , "Token number should be greater than 0.");
        if(_token == token1){
            require(reserve1 > _numberOfTokens, "Liqidity pool lacks token to buy.");
        }else{
            require(reserve2 > _numberOfTokens, "Liqidity pool lacks token to buy.");
        }
        IERC20(_token).approve(address(this),msg.sender,_numberOfTokens);
        IERC20(_token).transferFrom(address(this),msg.sender,_numberOfTokens);
        
        //Update reserves
        if(_token == token1){
            reserve1 -= _numberOfTokens;
        }else{
            reserve2 -= _numberOfTokens;
        }

    }

    // function getExchangeRate(address _token1, address _token2, uint256 _tokenAmount) public view returns(uint256){
    //     uint256 reserveOut = this.balanceOf(_token1);
    //     uint256 reserveIn = this.balanceOf(_token2);
    //     uint256 exchangeRate = (_tokenAmount * reserveOut) / ( reserveIn + _tokenAmount);
    //     return exchangeRate;
    // }
}