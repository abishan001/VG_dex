"use client"
import React from 'react'
import "@/app/styles/app.css"
import Link from 'next/link'
import { useContext } from 'react'
import { WalletContext } from '../context/wallet.context'
import toast from 'react-hot-toast'
import { Connector, useConnect } from 'wagmi'

function Header() {
    const { address, setAddress, isConnected , setIsConnected } = useContext(WalletContext);
    const { connectors } = useConnect();

    const connectMetaMask = async() => {
                await connectors[0].connect()
                .then(
                    ()=>{
                        setIsConnected(true);
                        toast.success("Wallet connected successfully.")
                    })
                .catch(()=>{
                    toast.error("Something went wrong while connecting wallet.")
                })
                 const walletAddress = (await connectors[0].getAccounts()).at(0) || "Connect";
                 setAddress(walletAddress);
        } 

    return (
        <header>
            <div className='leftH'>
                <Link href="/swap">
                <div className='headerItem'>Swap</div>
                </Link>
                <Link href="/token">
                <div className='headerItem'>Tokens</div>
                </Link>
                <Link href="/send">
                <div className='headerItem'>Send</div>
                </Link>
                <Link href="/buy">
                <div className='headerItem'>Buy</div>
                </Link>
            </div>
            <div className='rightH'>
                <div className='headerItem'>
                    <img src="/ethereum.png" width={20} alt="blockchain" className='logo'/>
                    Ethereum
                </div>
                <div className='connectButton' onClick= {isConnected ? ()=>{toast.error("Already connected.")} : connectMetaMask }>
                    {isConnected ? (address.slice(0,4) +"..." +address.slice(38)) : "Connect"}
                </div>
            </div>
        </header>
    )
}

export default Header