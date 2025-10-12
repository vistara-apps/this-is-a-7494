# SolVote Deployment Guide

This guide provides step-by-step instructions for deploying the SolVote application, including both the Solana program and the frontend.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Solana Program Deployment](#solana-program-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Verifying the Deployment](#verifying-the-deployment)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying SolVote, ensure you have the following:

- Node.js (v16 or later)
- Rust and Cargo
- Solana CLI (v1.14 or later)
- Anchor CLI (v0.26 or later)
- A Solana keypair with SOL for deployment
- Git

## Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/solvote.git
   cd solvote
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   ANCHOR_WALLET=/path/to/your/keypair.json
   REACT_APP_NETWORK=devnet  # or mainnet-beta for production
   ```

## Solana Program Deployment

### Building the Program

1. Build the Solana program with the verifiable flag:
   ```bash
   npm run build:program
   ```

   This runs `anchor build --verifiable`, which creates a verifiable build of the program.

### Deploying to Devnet (Testing)

1. Deploy the program to Solana devnet:
   ```bash
   npm run deploy:program -- devnet
   ```

   This script will:
   - Deploy the program to devnet
   - Update Anchor.toml with the program ID
   - Output the program ID for reference

2. Fund your account if needed:
   ```bash
   node scripts/keypair.js fund ./keypair.json devnet 2
   ```

### Deploying to Mainnet (Production)

1. Ensure your keypair has sufficient SOL for deployment:
   ```bash
   node scripts/keypair.js info ./keypair.json
   ```

2. Deploy to mainnet:
   ```bash
   npm run deploy:program -- mainnet-beta
   ```

   **Note**: Mainnet deployments cost SOL for storage rent.

3. Verify the program after deployment:
   ```bash
   npm run verify:program -- mainnet-beta
   ```

## Frontend Deployment

### Configuration

1. Update the program ID in the frontend:
   ```bash
   # The deploy script should have updated Anchor.toml
   # Extract the program ID and update the frontend config
   PROGRAM_ID=$(grep "solvote =" Anchor.toml | cut -d '"' -f2)
   echo "REACT_APP_PROGRAM_ID=$PROGRAM_ID" >> .env
   ```

### Building the Frontend

1. Build the frontend for production:
   ```bash
   npm run build
   ```

   This creates optimized production files in the `dist` directory.

### Deployment Options

#### Option 1: Static Hosting (Vercel, Netlify, etc.)

1. Deploy using your preferred static hosting provider:
   ```bash
   # Example for Vercel
   vercel --prod
   
   # Example for Netlify
   netlify deploy --prod
   ```

#### Option 2: Manual Deployment

1. Upload the contents of the `dist` directory to your web server.

#### Option 3: GitHub Pages

1. Configure GitHub Pages in your repository settings.

2. Deploy to GitHub Pages:
   ```bash
   # If using gh-pages package
   npx gh-pages -d dist
   ```

## Verifying the Deployment

### Verifying the Solana Program

1. Verify that the program is deployed correctly:
   ```bash
   solana program show $PROGRAM_ID --output json
   ```

2. Verify the program matches the source code:
   ```bash
   npm run verify:program
   ```

### Verifying the Frontend

1. Open the deployed frontend in a browser.

2. Connect your wallet and ensure it can interact with the program:
   - Create a community
   - Create a proposal
   - Vote on a proposal

3. Check the browser console for any errors.

## Troubleshooting

### Common Issues

#### Program Deployment Failures

- **Insufficient funds**: Ensure your keypair has enough SOL.
  ```bash
  solana balance -k ./keypair.json
  ```

- **RPC errors**: Try a different RPC endpoint.
  ```bash
  solana config set --url https://api.mainnet-beta.solana.com
  ```

#### Frontend Connection Issues

- **RPC rate limiting**: If you see RPC errors, consider using a paid RPC provider.

- **Wallet connection issues**: Ensure the wallet adapter is configured correctly.

#### Verification Failures

- **Build mismatch**: Ensure you're using the same version of Anchor and Solana for building and verification.

- **Source code changes**: Any changes to the source code after building will cause verification to fail.

### Getting Help

If you encounter issues not covered here:

1. Check the Solana and Anchor documentation.
2. Review the logs for specific error messages.
3. Reach out to the community for support.

