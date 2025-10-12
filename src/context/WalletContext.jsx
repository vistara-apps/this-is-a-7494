import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  ConnectionProvider, 
  WalletProvider as SolanaWalletProvider,
  useWallet as useSolanaWallet
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { anchorService } from '../services/anchor';
import { formatError } from '../utils/errors';
import toast from 'react-hot-toast';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

// Create context for our custom wallet functionality
const WalletContext = createContext();

// Custom hook to use the wallet context
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

// Internal component that uses the Solana wallet adapter
const WalletContextProvider = ({ children }) => {
  // Get wallet state from Solana wallet adapter
  const { 
    publicKey, 
    connecting, 
    connected, 
    disconnect,
    connect,
    wallet,
    signTransaction,
    signAllTransactions
  } = useSolanaWallet();

  // Initialize Anchor program when wallet is connected
  useEffect(() => {
    if (connected && wallet && publicKey) {
      try {
        // We'll load the IDL dynamically in a real app
        // For now, we'll just initialize with a placeholder
        // This would be replaced with the actual IDL in production
        const mockIdl = { /* IDL would be loaded here */ };
        
        // Create an Anchor wallet adapter from the Solana wallet
        const anchorWallet = {
          publicKey: publicKey,
          signTransaction: signTransaction,
          signAllTransactions: signAllTransactions,
        };
        
        // Initialize the Anchor program
        // anchorService.initializeProgram(anchorWallet, mockIdl);
        
        console.log('Wallet connected:', publicKey.toString());
      } catch (error) {
        console.error('Error initializing Anchor program:', error);
        toast.error('Error initializing program');
      }
    }
  }, [connected, wallet, publicKey, signTransaction, signAllTransactions]);

  // Handle connection errors
  const connectWallet = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error(formatError(error));
    }
  };

  // Handle disconnection
  const disconnectWallet = () => {
    try {
      disconnect();
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  // Create the context value
  const value = {
    isConnected: connected,
    publicKey: publicKey ? publicKey.toString() : null,
    isConnecting: connecting,
    connectWallet,
    disconnectWallet,
    signTransaction,
    signAllTransactions,
    wallet
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

// Main wallet provider that sets up the Solana wallet adapter
export const WalletProvider = ({ children }) => {
  // You can change the network to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Devnet;
  
  // RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  
  // Wallets that are supported
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletContextProvider>
            {children}
          </WalletContextProvider>
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};
