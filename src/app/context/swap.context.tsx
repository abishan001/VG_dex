'use client'
import React, { useState } from "react";

interface SwapContextType {
    swap: boolean;
    setSwap: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultContextValue: SwapContextType = {
    swap: false,
    setSwap: () => {},
};

interface SwapContextProviderProps {
    children: React.ReactNode;
}
const SwapContext = React.createContext<SwapContextType>(defaultContextValue);

const SwapContextProvider = ({children}:SwapContextProviderProps) =>{
    const [swap,setSwap] = useState(false); 

    return (
        <SwapContext.Provider value={{swap, setSwap}}>
            {children}
        </SwapContext.Provider>
    )
}

export { SwapContext, SwapContextProvider };