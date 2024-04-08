'use client'
import React from 'react'
import "@/app/styles/app.css"
import { Input } from 'antd'
import { ArrowDownOutlined, DownOutlined } from '@ant-design/icons'
import { useState, useContext, useEffect } from 'react'
import toast from 'react-hot-toast'
import {Tokens} from "../../tokenlist"
import { WalletContext } from '../context/wallet.context'
import { SwapAbi, ContractAbi } from '@/contract_abi'
import { FadeLoader } from 'react-spinners'
import { useWriteContract } from 'wagmi'
import { config } from '../layout'
import { useReadContract } from 'wagmi';
import { TokenContext } from '../context/token.context'
import { waitForTransactionReceipt } from 'wagmi/actions'

function Swap() {
    // const [token, settoken] = useState(0);
    const { token,setToken} = useContext(TokenContext);
    const [tokenTwoAmount, setTokenTwoAmount] = useState(0);
    const [tokenOne, setTokenOne] = useState(Tokens[0]);
    const [tokenTwo, setTokenTwo] = useState(Tokens[1]);
    // const [isConnected,setIsConnected] = useState(false);
    const [changeToken, setChangeToken] = useState(1);
    const {address,isConnected} = useContext(WalletContext);
    const [ showProgressBar, setShowProgressBar ] = useState(false);
    const [ loading, setLoading ] = useState(true);

    const {
        data: swapHash,
        error: swapError,
        isPending: swapPending,
        status: swapStatus,
        writeContractAsync: swap,
    } = useWriteContract();
    
    const changeAmount = (event : any) => {
        setToken(event.target.value);
    }

    const ans = useReadContract({
        config,
        abi: ContractAbi,
        address: '0xfaf135A183E55f266132e47E6d731A3E7E720f11',
        functionName: 'totalSupply',
      });
    //   console.log("here",ans.isSuccess)

    async function readSwapFunction(){
        try{
            const ans = useReadContract({
                config,
                abi: ContractAbi,
                address: '0xfaf135A183E55f266132e47E6d731A3E7E720f11',
                functionName: 'totalSupply',
              });
        }catch{
            toast.error("Sth went wrong");
        }

    }

    function switchTokens(){
        const one = tokenOne;
        const two = tokenTwo;
        setTokenOne(two);
        setTokenTwo(one);
    }

    const handleSwap = async() =>{
        try{
            setShowProgressBar(true);
            const cryptoAmount: BigInt = BigInt(token) * BigInt("1000000000000000000");
            const cryptoInEther = cryptoAmount.toString();
            const swapResult = await swap({
                address:"0xe6bc6233DE048882F44Ac60E6f634E2424a7eC1e",
                abi: SwapAbi,
                functionName: 'swap',
                args:[Tokens[0].address,Tokens[1].address,cryptoInEther]
              });
          const swapTransactionReceipt = await waitForTransactionReceipt(
            config,
            {
                hash: swapResult,
            });

            if(swapStatus)
            toast.success("Token swapped successfully.")

            } catch(err){
                console.log('Errr',err)
                toast.error("Something went wrong.")
            }finally{
                setShowProgressBar(false);
                setLoading(false);
                setToken(0);
                setTokenTwoAmount(0);
            } 
    }
    
    // const [swap,setSwap] = useState<string>('');
    // useEffect(():any=>{const result = useSwapContract(tokenOne.address,tokenTwo.address,"10")},[swap])
    useEffect(()=>{setToken(token)},[token]);

   
    return (
        <>
        <div className='progress'>
        { showProgressBar && <FadeLoader loading={loading} color='green'/> }
        </div>
        <div className='tradeBox'>
            <div className='tradeBoxHeader'>
                <h4>Swap</h4>
                <div className='inputs'>
                    <Input placeholder='0' value={token} onChange={changeAmount} />
                    <Input placeholder='You get.' value={token} disabled={true} />
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
        </>
    )
}


export default Swap