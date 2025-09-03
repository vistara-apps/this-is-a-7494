/**
 * Script to verify the SolVote Anchor program on Solana
 * 
 * Usage:
 * node scripts/verify.js [network]
 * 
 * Where network is one of: devnet, testnet, mainnet-beta
 * Default is devnet
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get network from command line args or default to devnet
const args = process.argv.slice(2);
const network = args[0] || 'devnet';
const validNetworks = ['devnet', 'testnet', 'mainnet-beta'];

if (!validNetworks.includes(network)) {
  console.error(`Error: Invalid network "${network}". Must be one of: ${validNetworks.join(', ')}`);
  process.exit(1);
}

// Read program ID from Anchor.toml
let programId;
try {
  const anchorToml = fs.readFileSync('./Anchor.toml', 'utf8');
  const match = anchorToml.match(new RegExp(`solvote = "([^"]*)"`, 'g'));
  if (!match) {
    throw new Error('Program ID not found in Anchor.toml');
  }
  
  // Extract program ID from the matched line
  programId = match[0].split('"')[1];
} catch (error) {
  console.error('Error reading program ID:', error.message);
  process.exit(1);
}

console.log(`Verifying SolVote program on ${network}...`);
console.log(`Program ID: ${programId}`);

try {
  // Verify the program
  console.log('Running verification...');
  execSync(`anchor verify ${programId} --provider.cluster ${network}`, { stdio: 'inherit' });
  
  console.log('\nVerification successful!');
  console.log('The program deployed on-chain matches the source code.');
  
  // Suggest next steps
  console.log('\nNext steps:');
  console.log('1. Share the verification URL with your community');
  console.log('2. Update the frontend to use the verified program ID');
  
} catch (error) {
  console.error('Verification failed:', error.message);
  console.error('\nPossible reasons:');
  console.error('- The program was not built with the --verifiable flag');
  console.error('- The program ID is incorrect');
  console.error('- The program was modified after deployment');
  process.exit(1);
}

