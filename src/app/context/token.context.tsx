'use client'

import React, { useState } from "react";

interface TokenContextType {
    token: number;
    setToken: React.Dispatch<React.SetStateAction<number>>;
}

const defaultContextValue: TokenContextType = {
    token: 0,
    setToken: () => {},
};

interface TokenContextProviderProps {
    children: React.ReactNode;
}
const TokenContext = React.createContext<TokenContextType>(defaultContextValue);

const TokenContextProvider = ({children}:TokenContextProviderProps) =>{
    const [token,setToken] = useState(0); 

    return (
        <TokenContext.Provider value={{token, setToken}}>
            {children}
        </TokenContext.Provider>
    )
}

export { TokenContext, TokenContextProvider };