'use client'
import React, { useContext, useEffect, useState } from 'react'
import "@/app/styles/app.css"
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { ContractAbi } from '@/contract_abi';
import { Contract } from 'ethers';
import TableBody from '../components/TableBody';
import { BodyContent } from '@/types';
import { readContract, waitForTransactionReceipt } from 'wagmi/actions';
import { useWriteContract } from 'wagmi';
import { Address } from 'viem';
import { WalletContext } from '../context/wallet.context';
import { config } from '../layout';

interface WindowWithEthereum extends Window {
  ethereum?: any;
}

interface TokenResponse{
  status: number,
  message: string,
  result :any[],
}

const data: BodyContent[] = [
  {
    imgUrl : "./ethereum-wallet.png",
    isTopic: true,
    topic1: "Token",
    topic2: "Symbol",
    topic3: "Balance",
  },
  {
    imgUrl : "./ethereum-wallet.png",
    isTopic: false,
    topic1: "ESToken",
    address: "0xDfD1302539B1b2A84879B407f22C3CB8AAc3765C",
    topic2: "EST",
    topic3: "---"
  },
  {
    imgUrl : "./ethereum-wallet.png",
    isTopic: false,
    topic1: "VGToken",
    address:"0xB440B8d3269235C60Ba1043d161A4843845364dC",
    topic2: "VGT",
    topic3: "---"
  },
]


function Token() {
  const win = window as WindowWithEthereum;
  const { address, isConnected } = useContext(WalletContext);
  const [fetchData,setFetchData] = useState(false);

  const {
    data: swapHash,
    status: swapStatus,
    writeContractAsync: readContract,
} = useWriteContract();

  const getTokenList = async() =>{
    try{
    const provider = new ethers.BrowserProvider(win.ethereum);
    const response = await fetch(`https://api-sepolia.etherscan.io/api?module=account&action=tokentx&address=0x05DA95E41a6ac4aABE37867444A7A8A2a140857e&page=1&offset=100&sort=asc&apikey=${process.env.ETHERSCAN_APIKEY}`)
    
    if(!response.ok){
      toast.error("Something went wrong.")
    }

    // const tokenList:TokenResponse = await response.json();
  //   const seen : any = new Set();
  //   const uniqueToken = tokenList.result.map((tx: any) =>{
  //     if(!seen.has(tx.to)){
  //       seen.add(tx.to);
  //     }
  //     if(!seen.has(tx.from)) seen.add(tx.from)
  //     if(!seen.has(tx.contractAddress)) seen.add(tx.contractAddress)
  //   })
  // const tokens : any = Array.from(seen);
  if(isConnected){
    let load = false;
    for(let i = 1;i<data.length;i++){
      const contract = new Contract(data[i].address as Address,ContractAbi,provider)
      const balance = await contract.balanceOf(address);
      if(parseInt(balance)/1000000000000000000 != parseInt(data[i].topic3)){
        load = true;
      }
      data[i].topic3 = (parseInt(balance)/1000000000000000000).toString();
    }
    if(load) setFetchData(!fetchData)
  }

  }catch(err){
    toast.error("Sth went wrong.")
  }
  }
  const getTokenListWagmi = async() =>{
    for(let i =1;i<data.length;i++){
      const swapResult = await readContract({
        address:data[i].address as Address,
        abi: ContractAbi,
        functionName: 'balanceOf',
        args:[address]
      });
      const swapTransactionReceipt = await waitForTransactionReceipt(
        config,
        {
            hash: swapResult,
        });
      console.log("here",swapTransactionReceipt)
    }
  }
  useEffect(()=>{getTokenList()},[fetchData])
  return (
    <div className="tokenContainer">
      <div className='tokenHeader'>
        <img src='./ethereum-wallet.png' height={50} width={50}></img>
        <h1 style={{marginLeft:"10px", fontWeight:'bold'}}>Wallet</h1>
      </div>
      <div>
          {data.map((dat)=>(<TableBody topic1={dat.topic1} topic2={dat.topic2} topic3={dat.topic3} address={dat.address ? dat.address : ""} isTopic={dat.isTopic} imgUrl={dat.imgUrl}/>))}
      </div>
    </div>
  )
}

export default Token