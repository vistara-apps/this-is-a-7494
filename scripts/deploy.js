/**
 * Script to deploy the SolVote Anchor program to Solana
 * 
 * Usage:
 * node scripts/deploy.js [network]
 * 
 * Where network is one of: localnet, devnet, testnet, mainnet-beta
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
const validNetworks = ['localnet', 'devnet', 'testnet', 'mainnet-beta'];

if (!validNetworks.includes(network)) {
  console.error(`Error: Invalid network "${network}". Must be one of: ${validNetworks.join(', ')}`);
  process.exit(1);
}

// Check if keypair exists
const keypairPath = process.env.ANCHOR_WALLET || '~/.config/solana/id.json';
if (!fs.existsSync(path.resolve(keypairPath.replace('~', process.env.HOME)))) {
  console.error(`Error: Keypair not found at ${keypairPath}`);
  console.error('Please create a keypair using: solana-keygen new -o path/to/keypair.json');
  process.exit(1);
}

console.log(`Deploying SolVote program to ${network}...`);

try {
  // Build the program with verifiable flag
  console.log('Building program...');
  execSync('anchor build --verifiable', { stdio: 'inherit' });
  
  // Deploy the program
  console.log(`Deploying to ${network}...`);
  execSync(`anchor deploy --provider.cluster ${network}`, { stdio: 'inherit' });
  
  // Get program ID
  const idlPath = path.resolve('./target/idl/solvote.json');
  const idl = JSON.parse(fs.readFileSync(idlPath, 'utf8'));
  const programId = idl.metadata.address;
  
  console.log(`\nDeployment successful!`);
  console.log(`Program ID: ${programId}`);
  
  // Update Anchor.toml with the program ID
  console.log('\nUpdating Anchor.toml with program ID...');
  let anchorToml = fs.readFileSync('./Anchor.toml', 'utf8');
  anchorToml = anchorToml.replace(
    new RegExp(`solvote = "[^"]*"`, 'g'),
    `solvote = "${programId}"`
  );
  fs.writeFileSync('./Anchor.toml', anchorToml);
  
  console.log('Anchor.toml updated successfully.');
  
  // Suggest next steps
  console.log('\nNext steps:');
  console.log('1. Verify the program using: node scripts/verify.js');
  console.log('2. Update the frontend to use the new program ID');
  
} catch (error) {
  console.error('Deployment failed:', error.message);
  process.exit(1);
}

