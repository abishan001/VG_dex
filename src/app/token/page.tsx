'use client'
import React, { useEffect } from 'react'
import "@/app/styles/app.css"
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { ContractAbi } from '@/contract_abi';
import { Contract } from 'ethers';

interface WindowWithEthereum extends Window {
  ethereum?: any;
}

interface TokenResponse{
  status: number,
  message: string,
  result :any[],
}

function Token() {
  const win = window as WindowWithEthereum;

  const getTokenList = async() =>{
    try{
    const provider = new ethers.BrowserProvider(win.ethereum);
    const response = await fetch(`https://api-sepolia.etherscan.io/api?module=account&action=tokentx&address=0x05DA95E41a6ac4aABE37867444A7A8A2a140857e&page=1&offset=100&sort=asc&apikey=${process.env.ETHERSCAN_APIKEY}`)
    
    if(!response.ok){
      toast.error("Something went wrong.")
    }

    const tokenList:TokenResponse = await response.json();
    const seen : any = new Set();
    const uniqueToken = tokenList.result.map((tx: any) =>{
      if(!seen.has(tx.to)){
        seen.add(tx.to);
      }
      if(!seen.has(tx.from)) seen.add(tx.from)
      if(!seen.has(tx.contractAddress)) seen.add(tx.contractAddress)
    })
  const tokens : any = Array.from(seen);
  for(let i = 0;i<tokens.length;i++){
    const contract = new Contract(tokens[i],ContractAbi,provider)
    console.log("ahahha",await contract.getBalanceOf("0x05DA95E41a6ac4aABE37867444A7A8A2a140857e"))
  }

    console.log("here",uniqueToken)
  }catch(err){
    console.log("here",err)
    toast.error("Sth went wrong.")
  }
  }
  useEffect(()=>{getTokenList()},[])
  return (
    <div>Token list</div>
  )
}

export default Token