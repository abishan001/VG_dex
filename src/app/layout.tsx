"use client"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import ToasterProvider from "./provider/ToasterProvider";
import { WalletContextProvider } from "./context/wallet.context";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "VG Dex",
  description: "Moving to decentralized workflow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletContextProvider>
        <Header/>
        <ToasterProvider/>
        {children}
        </WalletContextProvider>
        </body>
    </html>
  );
}
