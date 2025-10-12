/**
 * Service for interacting with the Solana blockchain
 */
import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { formatError } from '../utils/errors';
import toast from 'react-hot-toast';

// Default network (can be 'mainnet-beta', 'devnet', 'testnet', or a custom RPC URL)
const NETWORK = process.env.REACT_APP_NETWORK || 'devnet';

class SolanaService {
  constructor() {
    this.connection = new Connection(
      process.env.REACT_APP_RPC_ENDPOINT || clusterApiUrl(NETWORK),
      'confirmed'
    );
  }

  /**
   * Get the current Solana connection
   * @returns {Connection} - Solana connection
   */
  getConnection() {
    return this.connection;
  }

  /**
   * Set a new endpoint for the Solana connection
   * @param {string} endpoint - RPC endpoint URL
   */
  setEndpoint(endpoint) {
    this.connection = new Connection(endpoint, 'confirmed');
  }

  /**
   * Get the balance of a wallet in SOL
   * @param {PublicKey} publicKey - Wallet public key
   * @returns {Promise<number>} - Balance in SOL
   */
  async getBalance(publicKey) {
    try {
      const balance = await this.connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Error getting balance:', error);
      toast.error(formatError(error));
      return 0;
    }
  }

  /**
   * Request an airdrop of SOL (devnet/testnet only)
   * @param {PublicKey} publicKey - Wallet public key
   * @param {number} amount - Amount in SOL
   * @returns {Promise<string>} - Transaction signature
   */
  async requestAirdrop(publicKey, amount = 1) {
    if (NETWORK === 'mainnet-beta') {
      console.error('Airdrops are not available on mainnet');
      toast.error('Airdrops are not available on mainnet');
      return null;
    }
    
    try {
      const signature = await this.connection.requestAirdrop(
        publicKey,
        amount * LAMPORTS_PER_SOL
      );
      
      // Wait for confirmation
      await this.connection.confirmTransaction(signature, 'confirmed');
      
      console.log('Airdrop successful:', signature);
      return signature;
    } catch (error) {
      console.error('Error requesting airdrop:', error);
      toast.error(formatError(error));
      return null;
    }
  }

  /**
   * Get transaction details
   * @param {string} signature - Transaction signature
   * @returns {Promise<Object>} - Transaction details
   */
  async getTransaction(signature) {
    try {
      return await this.connection.getTransaction(signature, {
        commitment: 'confirmed',
      });
    } catch (error) {
      console.error('Error getting transaction:', error);
      toast.error(formatError(error));
      return null;
    }
  }

  /**
   * Get account information
   * @param {PublicKey} publicKey - Account public key
   * @returns {Promise<Object>} - Account information
   */
  async getAccountInfo(publicKey) {
    try {
      return await this.connection.getAccountInfo(publicKey);
    } catch (error) {
      console.error('Error getting account info:', error);
      toast.error(formatError(error));
      return null;
    }
  }
}

// Create and export a singleton instance
export const solanaService = new SolanaService();

