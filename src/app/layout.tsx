"use client"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import ToasterProvider from "./provider/ToasterProvider";
import { WalletContextProvider } from "./context/wallet.context";
import { http, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { metaMask } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { SwapContextProvider } from "./context/swap.context";
import { TokenContextProvider } from "./context/token.context";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "VG Dex",
  description: "Moving to decentralized workflow.",
};


export const config = createConfig({
  chains: [sepolia],
  connectors: [metaMask()],
  transports: {
    [sepolia.id]: http(process.env.ALCHEMY_HTTPS)
  }
});

const queryClinet = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClinet}>
            {/* <SwapContextProvider> */}
            <TokenContextProvider>
            <WalletContextProvider>
              <Header />
              <ToasterProvider />
              {children}
            </WalletContextProvider>
            </TokenContextProvider>
            {/* </SwapContextProvider> */}
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
