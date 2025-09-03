# Keypair Management for SolVote

This document provides guidance on securely managing keypairs for the SolVote application, particularly for program deployment and administration.

## Table of Contents

1. [Introduction](#introduction)
2. [Keypair Types](#keypair-types)
3. [Secure Storage Options](#secure-storage-options)
4. [Environment Setup](#environment-setup)
5. [Keypair Rotation](#keypair-rotation)
6. [Best Practices](#best-practices)

## Introduction

Solana programs require keypairs for deployment and upgrades. Proper management of these keypairs is critical for security, as they control access to the program and its funds.

## Keypair Types

SolVote uses several types of keypairs:

### Program Keypair

The program keypair is used to deploy and upgrade the Solana program. This keypair is critical and should be stored with the highest security.

### Admin Keypair

The admin keypair is used to initialize communities and perform administrative actions. This keypair should be controlled by the community administrator.

### User Keypairs

User keypairs are used by community members to create proposals and vote. These are typically managed by users through wallets like Phantom.

## Secure Storage Options

Several options are available for securely storing keypairs:

### Hardware Wallets

Hardware wallets like Ledger provide the highest level of security for keypairs. They store private keys in a secure element and never expose them to the computer.

**Recommended for**: Program keypair, Admin keypair

### Paper Wallets

Paper wallets involve printing or writing down the keypair and storing it in a secure physical location.

**Recommended for**: Backup of Program keypair

### Encrypted Files

Keypairs can be stored in encrypted files, protected by strong passwords.

**Recommended for**: Development environments

### Environment Variables

For automated deployments, keypairs can be stored as environment variables or in secure CI/CD systems.

**Recommended for**: CI/CD pipelines with proper security controls

## Environment Setup

### Local Development

For local development, create a keypair using the provided script:

```bash
node scripts/keypair.js generate ./keypair.json
```

Then set the environment variable:

```bash
export ANCHOR_WALLET=./keypair.json
```

### CI/CD Environment

For CI/CD environments, use encrypted secrets to store the keypair:

1. Convert the keypair to a base58 string:
   ```bash
   cat keypair.json | jq -r '.' | tr -d '\\n[]' | base58
   ```

2. Store this string as a secret in your CI/CD system

3. In the CI/CD workflow, convert it back to a keypair file:
   ```bash
   echo "[$(echo $SECRET_KEYPAIR | base58 -d | tr -d '\\n' | sed 's/./&,/g' | sed 's/,$//')]" > keypair.json
   ```

## Keypair Rotation

Regularly rotating keypairs is a security best practice:

1. Generate a new keypair
2. Transfer authority from the old keypair to the new one
3. Securely delete the old keypair

For the program keypair, this involves:
1. Deploying a new version of the program with the new keypair
2. Updating all references to the program ID

## Best Practices

1. **Never share private keys** or commit them to version control
2. Use **different keypairs** for different environments (development, staging, production)
3. Implement **multi-signature** for critical operations when possible
4. **Regularly audit** access to keypairs
5. Have a **secure backup strategy** for keypairs
6. Use **environment variables** instead of hardcoded paths
7. **Limit access** to production keypairs to essential personnel only
8. **Document the process** for keypair management and recovery
9. **Use the principle of least privilege** when assigning keypair permissions
10. **Regularly rotate** keypairs, especially after personnel changes

## Using the Keypair Management Script

SolVote includes a script for managing keypairs:

```bash
# Generate a new keypair
node scripts/keypair.js generate [output_path]

# View keypair information
node scripts/keypair.js info [keypair_path]

# Fund a keypair with an airdrop (devnet/testnet only)
node scripts/keypair.js fund [keypair_path] [network] [amount]
```

This script provides a convenient way to manage keypairs for development and testing.

