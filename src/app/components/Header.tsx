"use client"
import React from 'react'
import "@/app/styles/app.css"
import Link from 'next/link'
import { useContext } from 'react'
import { WalletContext } from '../context/wallet.context'
import Web3 from 'web3'
import toast from 'react-hot-toast'

interface WindowWithEthereum extends Window {
    ethereum?: any;
}

function Header() {
    const win = window as WindowWithEthereum;
    const { address, setAddress, isConnected , setIsConnected } = useContext(WalletContext);

    const connectMetaMask = async() => {
        // Check if MetaMask is installed
        if (typeof win.ethereum !== 'undefined') {
            try {
                // Request account access
                await win.ethereum.request({ method: 'eth_requestAccounts' });
                // Initialize Web3 with MetaMask's provider
                const web3 = new Web3(win.ethereum);
                // Use Web3 to interact with Ethereum
                const accounts = await web3.eth.getAccounts();
                setAddress(accounts[0]);
                setIsConnected(true);
                toast.success("Wallet connected successfully.")
            } catch (error) {
                toast.error("User denied account access")
            }
        } else {
            toast.error("Metamask not installed.")
        }
    }
    return (
        <header>
            <div className='leftH'>
                <Link href="./swap">
                <div className='headerItem'>Swap</div>
                </Link>
                <Link href="./token">
                <div className='headerItem'>Tokens</div>
                </Link>
                <Link href="./send">
                <div className='headerItem'>Send</div>
                </Link>
                <Link href="./buy">
                <div className='headerItem'>Buy</div>
                </Link>
            </div>
            <div className='rightH'>
                <div className='headerItem'>
                    <img src="/ethereum.png" width={20} alt="blockchain" className='logo'/>
                    Ethereum
                </div>
                <div className='connectButton' onClick= {isConnected ? ()=>{toast.error("Alread connected.")} : connectMetaMask }>
                    {isConnected ? (address.slice(0,4) +"..." +address.slice(38)) : "Connect"}
                </div>
            </div>
        </header>
    )
}

export default Header