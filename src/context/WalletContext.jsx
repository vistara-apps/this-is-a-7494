import React, { createContext, useContext, useState, useEffect } from 'react'

const WalletContext = createContext()

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

export const WalletProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [publicKey, setPublicKey] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)

  // Mock wallet data for demo
  const mockWalletAddress = "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"

  const connectWallet = async () => {
    setIsConnecting(true)
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    try {
      // In a real app, this would connect to Phantom wallet
      // if (window?.solana?.isPhantom) {
      //   const response = await window.solana.connect()
      //   setPublicKey(response.publicKey.toString())
      //   setIsConnected(true)
      // }
      
      // Mock connection for demo
      setPublicKey(mockWalletAddress)
      setIsConnected(true)
    } catch (error) {
      console.error('Error connecting wallet:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setPublicKey(null)
  }

  const value = {
    isConnected,
    publicKey,
    isConnecting,
    connectWallet,
    disconnectWallet,
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}