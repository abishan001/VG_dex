'use client'
import { useEffect, useState, useContext } from "react";
import { useReadContract } from "wagmi";
import { config } from "../layout";
import { ContractAbi, SwapAbi } from "@/contract_abi";
import {Tokens} from "../../tokenlist"
import { SwapContext } from "../context/swap.context";
import { TokenContext } from "../context/token.context";

// interface SwapContractResult {
//     swapResult: boolean;
//     swapToken: (tokenOne: string, tokenTwo: string, crypto: string) => void;
// }

// const useSwapContract = (): SwapContractResult => {
//     const [swapResult, setSwapResult] = useState(false);

//     useEffect(() => {
//         const swapToken = async (tokenOne: string, tokenTwo: string, crypto: string) => {
//             try {
//                 const result = await useReadContract({
//                     config,
//                     abi: SwapAbi,
//                     address: '0x9d5909140DaBC214c71be9185dbE6f8AbeD97487',
//                     functionName: 'swap',
//                     args: [tokenOne, tokenTwo, crypto]
//                 });
//                 console.log("result", result)
//                 if (result.isSuccess) {
//                     setSwapResult(true)
//                 } else {
//                     setSwapResult(false)
//                 }
//             } catch (err) {
//                 console.error("Error", err);
//                 setSwapResult(false)
//             }
//         }
//         // Export swapToken if needed
//         return swapToken;
//     }, []);

//     return { swapResult, swapToken };
// }

const useSwapContract = (crypto: number, dependency: any) => {
    const [swap,setSwap] = useState(false)
    const { token, setToken } = useContext(TokenContext)

    const swapResult = useReadContract({
            config,
            abi: SwapAbi,
            address: '0xDfD1302539B1b2A84879B407f22C3CB8AAc3765C',
            functionName: 'swap',
            args:[Tokens[0].address,Tokens[1].address,1000]
          });

    // const swapResult = useReadContract({
    //     config,
    //     abi: ContractAbi,
    //     address: '0xDfD1302539B1b2A84879B407f22C3CB8AAc3765C',
    //     functionName: 'totalSupply',
    //   });
    console.log("Chekc",swapResult)

      console.log("Crypto",token)
      console.log("I got called",swapResult.isSuccess)

      useEffect(()=>{
        if(swapResult.isSuccess) setSwap(true);
        else setSwap(false)
      },[...dependency])

      return {swap};
    }

export default useSwapContract;