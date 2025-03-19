"use client";

import React, { useState } from "react";
import { BrowserProvider, JsonRpcProvider } from "ethers";

const WalletConnector = () => {
  // State accepts both BrowserProvider and JsonRpcProvider types
  const [provider, setProvider] = useState<BrowserProvider | JsonRpcProvider | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  // Connect with MetaMask (Browser wallet)
  const connectWallet = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const browserProvider = new BrowserProvider((window as any).ethereum);
        await browserProvider.send("eth_requestAccounts", []);
        const signer = await browserProvider.getSigner();
        const userAddress = await signer.getAddress();
        setProvider(browserProvider);
        setAccount(userAddress);
        console.log("Connected Wallet:", userAddress);
      } catch (err) {
        console.error("Error connecting wallet:", err);
      }
    } else {
      alert("MetaMask not found!");
    }
  };

  // Connect using RPC Provider (example: Infura or Alchemy)
  const connectRpcProvider = () => {
    const rpcUrl = "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"; // Replace with your RPC URL
    const rpcProvider = new JsonRpcProvider(rpcUrl);
    setProvider(rpcProvider);
    console.log("Connected to RPC Provider");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Wallet Connection Example</h1>
      <button
        onClick={connectWallet}
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
      >
        Connect MetaMask
      </button>
      <button
        onClick={connectRpcProvider}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Connect RPC Provider
      </button>
      {account && <p className="mt-4">Connected Account: {account}</p>}
    </div>
  );
};

export default WalletConnector;
