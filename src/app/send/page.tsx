'use client'
import React, { useContext, useState } from 'react'
import { DownOutlined } from '@ant-design/icons'
import { Tokens } from '@/tokenlist';
import { useWriteContract } from 'wagmi';
import { config } from '../layout';
import toast from 'react-hot-toast';
import { ContractAbi } from '@/contract_abi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { Address } from 'viem';
import { WalletContext } from '../context/wallet.context';
import { FadeLoader } from 'react-spinners';

function Send() {
  const [isActive, setIsActive] = useState(false);
  const [selected, setSelected] = useState("")
  const [walletAddress,setWalletAddress] = useState("");
  const [tokenAddress,setTokenAddress] = useState('');
  const [cryptoAmount,setCryptoAmount] = useState(0);
  const [showProgressBar,setShowProgressBar] = useState(false);
  const [loading,setLoading]= useState(false);
  const { address } = useContext(WalletContext);

  const {
    writeContractAsync: readContract,
} = useWriteContract();

  const changeWalletAddress = (event : any) => {
    setWalletAddress(event.target.value);
  }

  const changeAmount = (event : any) => {
    setCryptoAmount(event.target.value);
  }

  const handleSend = async() =>{
    try{
        setShowProgressBar(true);
        const amount: BigInt = BigInt(cryptoAmount) * BigInt("1000000000000000000");
        const cryptoInEther = amount.toString();

        const swapResult = await readContract({
            address:tokenAddress as Address,
            abi: ContractAbi,
            functionName: 'transfer',
            args:[walletAddress,cryptoInEther]
          });
      const swapTransactionReceipt = await waitForTransactionReceipt(
        config,
        {
            hash: swapResult,
        });
  
        if(swapTransactionReceipt.status == 'success')
        toast.success("Token sent successfully.")
  
        } catch(err){
            console.log('Errr',err)
            toast.error("Something went wrong.")
        }finally{
            setShowProgressBar(false);
            setLoading(false);
            setCryptoAmount(0);
            setWalletAddress("");
        } 
  }

  return (
    <>
    <div className='progress'>
    { showProgressBar && <FadeLoader loading={loading} color='green'/> }
    </div>
    <div className='buyContainer'>
      <div className='buyInput' style={{paddingTop:"20px"}}>
        <input placeholder='Wallet Address' value={walletAddress} onChange={changeWalletAddress} type='text' style={{ borderRadius: "10px", paddingLeft: "10px", color: "black", fontWeight: "bold", outline: "none" }}></input>
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
                  setIsActive(false);
                  setTokenAddress(token.address)
                }}>
                  {token.symbol}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <input placeholder='Crypto Amount' value={cryptoAmount} onChange={changeAmount} type='text' style={{ borderRadius: "10px", padding: "20px", color: "black", fontWeight: "bold", outline: "none", margin:"20px auto", width:"250px"}}></input>
      <button className='buyButton' disabled={false} onClick={handleSend}>Send Token</button>
    </div>
    </>
  )
}

export default Send