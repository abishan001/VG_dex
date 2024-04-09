'use client'
import React, { useState } from 'react'
import { DownOutlined } from '@ant-design/icons'
import {Tokens} from '../../tokenlist';
import { useWriteContract } from 'wagmi';
import toast from 'react-hot-toast';
import { SwapAbi } from '@/contract_abi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { config } from '../layout';
import { FadeLoader } from 'react-spinners';
import { message } from 'antd';

function Buy() {
  const [isActive, setIsActive] = useState(false);
  const [selected, setSelected] = useState("");
  const [ showProgressBar, setShowProgressBar ] = useState(false);
  const [cryptoAmount, setCryptoAmount] = useState(0);
  const [ loading, setLoading ] = useState(true);
  const [tokenAddress,setTokenAddress ] = useState("");

  const {
    writeContractAsync: buy,
} = useWriteContract();

const changeAmount = (event : any) => {
  setCryptoAmount(event.target.value);
}

const handleBuy = async() =>{
  try{
      setShowProgressBar(true);
      const amount: BigInt = BigInt(cryptoAmount) * BigInt("1000000000000000000");
      const cryptoInEther = amount.toString();
      const swapResult = await buy({
          address:"0xe6bc6233DE048882F44Ac60E6f634E2424a7eC1e",
          abi: SwapAbi,
          functionName: 'buyTokens',
          args:[tokenAddress,cryptoInEther]
        });
    const swapTransactionReceipt = await waitForTransactionReceipt(
      config,
      {
          hash: swapResult,
      });

      if(swapTransactionReceipt.status == 'success')
      toast.success("Token bought successfully.")

      } catch(err){
          console.log('Errr',err)
          toast.error(`${err}`)
      }finally{
          setShowProgressBar(false);
          setLoading(false);
          setCryptoAmount(0);
      } 
}

  return (
    <>
    <div className='progress'>
    { showProgressBar && <FadeLoader loading={loading} color='green'/> }
    </div>
    <div className='buyContainer'>
      <h1 style={{ color: "red", paddingBottom: "10px", margin: "auto auto" }}>For testing purpose you can buy tokens for free.</h1>
      <div className='buyInput'>
        <input placeholder='Token Amount' value={cryptoAmount} onChange={changeAmount} type='text' style={{ borderRadius: "10px", paddingLeft: "10px", color: "black", fontWeight: "bold", outline: "none" }}></input>
        <div className='dropdown'>
          <div className='dropdown-btn' onClick={(e) => setIsActive(!isActive)}>
            {selected || "Choose Token"}
            <DownOutlined />
          </div>
          {isActive && (
            <div className='dropdown-content'>
              {Tokens.map((token) => (
                <div className='dropdown-item' onClick={(e) => {
                  setSelected(token.symbol);
                  setTokenAddress(token.address);
                  setIsActive(false);
                }}>
                  {token.symbol}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <button className='buyButton' disabled={false} onClick={handleBuy}>Get Token</button>
    </div>
    </>
  )
}

export default Buy