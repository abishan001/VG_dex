'use client'
import React from 'react'
import "@/app/styles/app.css"
import { Input } from 'antd'
import { ArrowDownOutlined, DownOutlined, SettingOutlined } from '@ant-design/icons'
import { useState, useContext } from 'react'
import toast from 'react-hot-toast'
import tokenList from "../tokenlist.json"
import { WalletContext } from './context/wallet.context'
import { Contract, ethers, formatEther, parseUnits } from "ethers";
import { SwapAbi, ContractAbi } from '@/contract_abi'
import { CircularProgressbar } from 'react-circular-progressbar'

interface WindowWithEthereum extends Window {
    ethereum?: any;
}
export default function Home() {
  const [tokenOneAmount, setTokenOneAmount] = useState(0);
  const [tokenTwoAmount, setTokenTwoAmount] = useState(0);
  const [tokenOne, setTokenOne] = useState(tokenList[0]);
  const [tokenTwo, setTokenTwo] = useState(tokenList[1]);
  // const [isConnected,setIsConnected] = useState(false);
  const [isOpen, setIsOpen ] = useState(false);
  const [changeToken, setChangeToken] = useState(1);
  const {address,isConnected} = useContext(WalletContext);

  const win = window as WindowWithEthereum;


  const changeAmount = (event : any) => {
      setTokenOneAmount(event.target.value);
  }

  function switchTokens(){
      const one = tokenOne;
      const two = tokenTwo;
      setTokenOne(two);
      setTokenTwo(one);
  }

  const handleSwap = async() =>{
      try{

      const cryptoAmount: BigInt = BigInt(tokenOneAmount) * BigInt("1000000000000000000");
      const cryptoInEther = cryptoAmount.toString();

      const provider = await new ethers.BrowserProvider(win.ethereum, "sepolia");
      const signer = await provider.getSigner();

      const ESToken = new Contract(tokenOne.address,ContractAbi,signer);

      const approveToken = await ESToken.approve("0x9d5909140DaBC214c71be9185dbE6f8AbeD97487",cryptoInEther);
      await approveToken.wait();

      const swapContract = new Contract("0x9d5909140DaBC214c71be9185dbE6f8AbeD97487",SwapAbi,signer);
      const swapToken = await swapContract.swap(tokenOne.address,tokenTwo.address,cryptoInEther);
      await swapToken.wait();
      toast.success("Token swapped successfully.")
      } catch(err){
          toast.error("Something went wrong.")
      }finally{
          setTokenOneAmount(0);
          setTokenTwoAmount(0);
      }     
  }

  // useEffect(()=>{handleSwap()},[])
  return (
      <div className='tradeBox'>
          <div className='tradeBoxHeader'>
              <h4>Swap</h4>
              <div className='inputs'>
                  <Input placeholder='0' value={tokenOneAmount} onChange={changeAmount} />
                  <Input placeholder='You get.' value={tokenOneAmount} disabled={true} />
                  <div className='switchButton' onClick={switchTokens}>
                      <ArrowDownOutlined className='switchArrow' />
                  </div>
                  <div className='assetOne' onClick={()=> {}}>
                      {tokenOne.symbol}
                      <DownOutlined />
                  </div>
                  <div className='assetTwo' onClick={()=> {}}>
                      {tokenTwo.symbol}
                      <DownOutlined />
                  </div>
              </div>
              <button className='swapButton' disabled={!isConnected} onClick={handleSwap}>Swap</button>
          </div>
      </div>
  )
}
