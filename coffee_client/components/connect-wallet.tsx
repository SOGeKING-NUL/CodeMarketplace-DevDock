"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ConnectWallet() {
  const [account, setAccount] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    checkIfWalletIsConnected()
  }, [])

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window as any
      if (!ethereum) return

      const accounts = await ethereum.request({ method: "eth_accounts" })
      if (accounts.length > 0) {
        setAccount(accounts[0])
      }
    } catch (error) {
      console.error("Error checking if wallet is connected:", error)
    }
  }

  const connectWallet = async () => {
    try {
      setIsConnecting(true)
      const { ethereum } = window as any

      if (!ethereum) {
        alert("Please install MetaMask or another Ethereum wallet")
        setIsConnecting(false)
        return
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" })
      setAccount(accounts[0])
      setIsConnecting(false)
    } catch (error) {
      console.error("Error connecting wallet:", error)
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setAccount(null)
  }

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  if (!mounted) {
    return null
  }

  return (
    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {account ? (
        <Button variant="outline" onClick={disconnectWallet} className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          {formatAddress(account)}
        </Button>
      ) : (
        <Button onClick={connectWallet} disabled={isConnecting} className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      )}
    </motion.div>
  )
}

