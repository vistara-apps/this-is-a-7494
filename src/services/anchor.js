/**
 * Service for interacting with the SolVote Anchor program
 */
import * as anchor from '@project-serum/anchor';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Buffer } from 'buffer';
import { formatError } from '../utils/errors';
import toast from 'react-hot-toast';

// Default program ID (will be replaced with the actual deployed program ID)
const PROGRAM_ID = new PublicKey(
  process.env.REACT_APP_PROGRAM_ID || 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS'
);

// Default network (can be 'mainnet-beta', 'devnet', 'testnet', or a custom RPC URL)
const NETWORK = process.env.REACT_APP_NETWORK || 'devnet';

class AnchorService {
  constructor() {
    this.program = null;
    this.provider = null;
    this.connection = new Connection(
      process.env.REACT_APP_RPC_ENDPOINT || clusterApiUrl(NETWORK),
      'confirmed'
    );
  }

  /**
   * Initialize the Anchor program with a wallet
   * @param {Object} wallet - Wallet adapter
   * @param {Object} idl - Program IDL
   */
  initializeProgram(wallet, idl) {
    try {
      // Create the provider
      this.provider = new anchor.AnchorProvider(
        this.connection,
        wallet,
        { preflightCommitment: 'confirmed' }
      );
      
      // Create the program
      this.program = new anchor.Program(idl, PROGRAM_ID, this.provider);
      
      console.log('Anchor program initialized');
      return this.program;
    } catch (error) {
      console.error('Error initializing Anchor program:', error);
      toast.error(formatError(error));
      return null;
    }
  }

  /**
   * Find the community PDA for a given admin
   * @param {PublicKey} adminPublicKey - Admin's public key
   * @returns {[PublicKey, number]} - Community PDA and bump
   */
  async findCommunityAddress(adminPublicKey) {
    if (!this.program) {
      console.error('Program not initialized');
      return null;
    }
    
    return await PublicKey.findProgramAddress(
      [Buffer.from('community'), adminPublicKey.toBuffer()],
      this.program.programId
    );
  }

  /**
   * Find the proposal PDA for a given community and proposal ID
   * @param {PublicKey} communityPublicKey - Community's public key
   * @param {number} proposalId - Proposal ID
   * @returns {[PublicKey, number]} - Proposal PDA and bump
   */
  async findProposalAddress(communityPublicKey, proposalId) {
    if (!this.program) {
      console.error('Program not initialized');
      return null;
    }
    
    const proposalIdBuffer = Buffer.alloc(8);
    proposalIdBuffer.writeBigUInt64LE(BigInt(proposalId));
    
    return await PublicKey.findProgramAddress(
      [
        Buffer.from('proposal'),
        communityPublicKey.toBuffer(),
        proposalIdBuffer
      ],
      this.program.programId
    );
  }

  /**
   * Find the vote record PDA for a given proposal and voter
   * @param {PublicKey} proposalPublicKey - Proposal's public key
   * @param {PublicKey} voterPublicKey - Voter's public key
   * @returns {[PublicKey, number]} - Vote record PDA and bump
   */
  async findVoteRecordAddress(proposalPublicKey, voterPublicKey) {
    if (!this.program) {
      console.error('Program not initialized');
      return null;
    }
    
    return await PublicKey.findProgramAddress(
      [
        Buffer.from('vote'),
        proposalPublicKey.toBuffer(),
        voterPublicKey.toBuffer()
      ],
      this.program.programId
    );
  }

  /**
   * Initialize a new community
   * @param {string} name - Community name
   * @returns {Promise<string>} - Transaction signature
   */
  async initializeCommunity(name) {
    if (!this.program || !this.provider.wallet.publicKey) {
      console.error('Program not initialized or wallet not connected');
      return null;
    }
    
    try {
      const [communityPda] = await this.findCommunityAddress(
        this.provider.wallet.publicKey
      );
      
      const tx = await this.program.methods
        .initializeCommunity(name)
        .accounts({
          community: communityPda,
          admin: this.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      
      console.log('Community initialized:', tx);
      return tx;
    } catch (error) {
      console.error('Error initializing community:', error);
      toast.error(formatError(error));
      return null;
    }
  }

  /**
   * Create a new proposal
   * @param {string} title - Proposal title
   * @param {string} description - Proposal description
   * @param {number} durationDays - Voting duration in days
   * @returns {Promise<string>} - Transaction signature
   */
  async createProposal(title, description, durationDays) {
    if (!this.program || !this.provider.wallet.publicKey) {
      console.error('Program not initialized or wallet not connected');
      return null;
    }
    
    try {
      const [communityPda] = await this.findCommunityAddress(
        this.provider.wallet.publicKey
      );
      
      // Get community data
      const community = await this.program.account.community.fetch(communityPda);
      
      // Calculate proposal ID and find PDA
      const proposalId = community.proposalCount.toNumber() + 1;
      const [proposalPda] = await this.findProposalAddress(communityPda, proposalId);
      
      // Calculate end time (current time + duration in seconds)
      const now = Math.floor(Date.now() / 1000);
      const endTime = new anchor.BN(now + (durationDays * 24 * 60 * 60));
      
      const tx = await this.program.methods
        .createProposal(title, description, endTime)
        .accounts({
          community: communityPda,
          proposal: proposalPda,
          creator: this.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      
      console.log('Proposal created:', tx);
      return tx;
    } catch (error) {
      console.error('Error creating proposal:', error);
      toast.error(formatError(error));
      return null;
    }
  }

  /**
   * Vote on a proposal
   * @param {PublicKey} proposalPublicKey - Proposal's public key
   * @param {boolean} voteYes - True for yes, false for no
   * @returns {Promise<string>} - Transaction signature
   */
  async vote(proposalPublicKey, voteYes) {
    if (!this.program || !this.provider.wallet.publicKey) {
      console.error('Program not initialized or wallet not connected');
      return null;
    }
    
    try {
      const [voteRecordPda] = await this.findVoteRecordAddress(
        proposalPublicKey,
        this.provider.wallet.publicKey
      );
      
      const tx = await this.program.methods
        .vote(voteYes)
        .accounts({
          proposal: proposalPublicKey,
          voter: this.provider.wallet.publicKey,
          voteAccount: voteRecordPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      
      console.log('Vote recorded:', tx);
      return tx;
    } catch (error) {
      console.error('Error voting:', error);
      toast.error(formatError(error));
      return null;
    }
  }

  /**
   * Get all proposals for a community
   * @param {PublicKey} communityPublicKey - Community's public key
   * @returns {Promise<Array>} - Array of proposals
   */
  async getProposals(communityPublicKey) {
    if (!this.program) {
      console.error('Program not initialized');
      return [];
    }
    
    try {
      // Get all proposals where the community field matches
      const proposals = await this.program.account.proposal.all([
        {
          memcmp: {
            offset: 8 + 8 + 32, // discriminator + id + creator
            bytes: communityPublicKey.toBase58(),
          },
        },
      ]);
      
      return proposals;
    } catch (error) {
      console.error('Error getting proposals:', error);
      toast.error(formatError(error));
      return [];
    }
  }

  /**
   * Check if a user has voted on a proposal
   * @param {PublicKey} proposalPublicKey - Proposal's public key
   * @param {PublicKey} voterPublicKey - Voter's public key
   * @returns {Promise<boolean>} - True if voted, false otherwise
   */
  async hasVoted(proposalPublicKey, voterPublicKey) {
    if (!this.program) {
      console.error('Program not initialized');
      return false;
    }
    
    try {
      const [voteRecordPda] = await this.findVoteRecordAddress(
        proposalPublicKey,
        voterPublicKey
      );
      
      // Try to fetch the vote record
      const voteRecord = await this.program.account.voteRecord.fetch(voteRecordPda);
      
      // If we get here, the vote record exists
      return voteRecord.hasVoted;
    } catch (error) {
      // If the account doesn't exist, the user hasn't voted
      return false;
    }
  }
}

// Create and export a singleton instance
export const anchorService = new AnchorService();

