/**
 * Script to manage keypairs for the SolVote Anchor program
 * 
 * Usage:
 * node scripts/keypair.js [command]
 * 
 * Commands:
 * - generate: Generate a new keypair
 * - info: Display information about the current keypair
 * - fund: Request an airdrop to the keypair (devnet/testnet only)
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Keypair, LAMPORTS_PER_SOL, Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';

// Load environment variables
dotenv.config();

// Get command from command line args
const args = process.argv.slice(2);
const command = args[0];
const validCommands = ['generate', 'info', 'fund'];

if (!command || !validCommands.includes(command)) {
  console.error(`Error: Invalid command "${command}". Must be one of: ${validCommands.join(', ')}`);
  console.error('\nUsage: node scripts/keypair.js [command]');
  process.exit(1);
}

// Default keypair path
const defaultKeypairPath = process.env.ANCHOR_WALLET || '~/.config/solana/id.json';
const resolvedKeypairPath = path.resolve(defaultKeypairPath.replace('~', process.env.HOME));

// Generate a new keypair
async function generateKeypair() {
  const outputPath = args[1] || './keypair.json';
  const resolvedOutputPath = path.resolve(outputPath);
  
  console.log(`Generating new keypair at ${resolvedOutputPath}...`);
  
  // Generate a new keypair
  const keypair = Keypair.generate();
  const secretKey = Array.from(keypair.secretKey);
  
  // Save to file
  fs.writeFileSync(resolvedOutputPath, JSON.stringify(secretKey));
  
  console.log('Keypair generated successfully!');
  console.log(`Public key: ${keypair.publicKey.toString()}`);
  console.log(`Secret key saved to: ${resolvedOutputPath}`);
  console.log('\nIMPORTANT: Keep your secret key safe and never share it!');
}

// Display information about a keypair
async function keypairInfo() {
  const keypairPath = args[1] || resolvedKeypairPath;
  
  try {
    // Read keypair from file
    const keypairData = fs.readFileSync(keypairPath, 'utf8');
    const secretKey = Uint8Array.from(JSON.parse(keypairData));
    const keypair = Keypair.fromSecretKey(secretKey);
    
    console.log('Keypair Information:');
    console.log(`Public key: ${keypair.publicKey.toString()}`);
    console.log(`Keypair path: ${keypairPath}`);
    
    // Get balance (devnet)
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const balance = await connection.getBalance(keypair.publicKey);
    console.log(`Devnet balance: ${balance / LAMPORTS_PER_SOL} SOL`);
    
  } catch (error) {
    console.error(`Error reading keypair: ${error.message}`);
    process.exit(1);
  }
}

// Fund a keypair with an airdrop
async function fundKeypair() {
  const keypairPath = args[1] || resolvedKeypairPath;
  const network = args[2] || 'devnet';
  const amount = parseFloat(args[3] || '1');
  
  if (network !== 'devnet' && network !== 'testnet') {
    console.error('Error: Airdrops are only available on devnet or testnet');
    process.exit(1);
  }
  
  try {
    // Read keypair from file
    const keypairData = fs.readFileSync(keypairPath, 'utf8');
    const secretKey = Uint8Array.from(JSON.parse(keypairData));
    const keypair = Keypair.fromSecretKey(secretKey);
    
    console.log(`Requesting ${amount} SOL airdrop on ${network} for ${keypair.publicKey.toString()}...`);
    
    // Request airdrop
    const connection = new Connection(clusterApiUrl(network), 'confirmed');
    const signature = await connection.requestAirdrop(
      keypair.publicKey,
      amount * LAMPORTS_PER_SOL
    );
    
    console.log(`Airdrop requested. Transaction signature: ${signature}`);
    console.log('Waiting for confirmation...');
    
    // Wait for confirmation
    await connection.confirmTransaction(signature, 'confirmed');
    
    // Get updated balance
    const balance = await connection.getBalance(keypair.publicKey);
    console.log(`Airdrop successful! New balance: ${balance / LAMPORTS_PER_SOL} SOL`);
    
  } catch (error) {
    console.error(`Error funding keypair: ${error.message}`);
    process.exit(1);
  }
}

// Execute the requested command
switch (command) {
  case 'generate':
    generateKeypair();
    break;
  case 'info':
    keypairInfo();
    break;
  case 'fund':
    fundKeypair();
    break;
}

