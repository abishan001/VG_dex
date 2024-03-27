'use client'
import React, { useState, useEffect } from "react";

interface WalletContextType {
    address: string;
    setAddress: React.Dispatch<React.SetStateAction<string>>;
    isConnected: boolean;
    setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
}


  interface WindowWithEthereum extends Window {
    ethereum?: any;
}

const defaultContextValue: WalletContextType = {
    address: "",
    setAddress: () => {},
    isConnected: false,
    setIsConnected: () => {}
};

interface WalletContextProviderProps {
    children: React.ReactNode;
}
const WalletContext = React.createContext<WalletContextType>(defaultContextValue);

const WalletContextProvider = ({children}:WalletContextProviderProps) =>{
    const [isConnected,setIsConnected] = useState(false);
    const [address,setAddress] = useState("") 

    return (
        <WalletContext.Provider value={{address, setAddress, isConnected, setIsConnected}}>
            {children}
        </WalletContext.Provider>
    )
}

export { WalletContext, WalletContextProvider };