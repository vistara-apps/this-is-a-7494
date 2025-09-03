# SolVote API Documentation

This document provides comprehensive documentation for the SolVote API, including both the Solana program instructions and client-side interactions.

## Table of Contents

1. [Solana Program Instructions](#solana-program-instructions)
2. [Client-Side API](#client-side-api)
3. [Data Models](#data-models)
4. [Error Handling](#error-handling)

## Solana Program Instructions

The SolVote Solana program provides the following instructions:

### Initialize Community

Creates a new community for governance.

**Accounts Required:**
- `community`: PDA derived from "community" and admin's public key
- `admin`: Signer who will be the community admin
- `system_program`: System program

**Parameters:**
- `name`: String - The name of the community

**Example:**
```javascript
const tx = await program.methods
  .initializeCommunity("My DAO")
  .accounts({
    community: communityPda,
    admin: wallet.publicKey,
    systemProgram: SystemProgram.programId,
  })
  .rpc();
```

### Create Proposal

Creates a new proposal for voting.

**Accounts Required:**
- `community`: The community PDA
- `proposal`: PDA derived from "proposal", community key, and proposal ID
- `creator`: Signer who is creating the proposal
- `system_program`: System program

**Parameters:**
- `title`: String - The title of the proposal
- `description`: String - Detailed description of the proposal
- `end_time`: i64 - Unix timestamp when voting ends

**Example:**
```javascript
const tx = await program.methods
  .createProposal(
    "Implement Feature X",
    "This proposal aims to implement Feature X which will...",
    new BN(endTimestamp)
  )
  .accounts({
    community: communityPda,
    proposal: proposalPda,
    creator: wallet.publicKey,
    systemProgram: SystemProgram.programId,
  })
  .rpc();
```

### Vote

Casts a vote on a proposal.

**Accounts Required:**
- `proposal`: The proposal PDA
- `voter`: Signer who is voting
- `vote_account`: PDA derived from "vote", proposal key, and voter key
- `system_program`: System program

**Parameters:**
- `vote_yes`: boolean - True for a "yes" vote, false for a "no" vote

**Example:**
```javascript
const tx = await program.methods
  .vote(true) // Vote "yes"
  .accounts({
    proposal: proposalPda,
    voter: wallet.publicKey,
    voteAccount: voteAccountPda,
    systemProgram: SystemProgram.programId,
  })
  .rpc();
```

## Client-Side API

The client-side API provides convenient methods for interacting with the Solana program.

### SolanaService

Provides utility functions for interacting with the Solana blockchain.

#### Methods

- `getConnection()`: Returns the current Solana connection
- `setEndpoint(endpoint)`: Sets a new endpoint for the Solana connection
- `getBalance(publicKey)`: Gets the balance of a wallet in SOL
- `requestAirdrop(publicKey, amount)`: Requests an airdrop of SOL (devnet/testnet only)
- `getTransaction(signature)`: Gets transaction details
- `getAccountInfo(publicKey)`: Gets account information

### AnchorService

Provides methods for interacting with the SolVote Anchor program.

#### Methods

- `initializeProgram(wallet, idl)`: Initializes the Anchor program with a wallet provider
- `findCommunityAddress(adminPublicKey)`: Gets the community PDA for a given admin
- `findProposalAddress(communityPublicKey, proposalId)`: Gets the proposal PDA
- `findVoteRecordAddress(proposalPublicKey, voterPublicKey)`: Gets the vote record PDA
- `initializeCommunity(name)`: Initializes a new community
- `createProposal(title, description, durationDays)`: Creates a new proposal
- `vote(proposalPublicKey, voteYes)`: Votes on a proposal
- `getProposals(communityPublicKey)`: Gets all proposals for a community
- `hasVoted(proposalPublicKey, voterPublicKey)`: Checks if a user has voted on a proposal

## Data Models

### Community

```typescript
interface Community {
  admin: PublicKey;
  name: string;
  proposalCount: number;
  bump: number;
}
```

### Proposal

```typescript
interface Proposal {
  id: number;
  creator: PublicKey;
  title: string;
  description: string;
  startTime: number;
  endTime: number;
  yesVotes: number;
  noVotes: number;
  community: PublicKey;
  bump: number;
}
```

### VoteRecord

```typescript
interface VoteRecord {
  voter: PublicKey;
  proposal: PublicKey;
  voteYes: boolean;
  hasVoted: boolean;
  bump: number;
}
```

## Error Handling

The SolVote program defines the following error codes:

- `ProposalEnded (6000)`: Returned when trying to vote on a proposal that has ended
- `AlreadyVoted (6001)`: Returned when a user tries to vote on a proposal they've already voted on
- `InvalidEndTime (6002)`: Returned when creating a proposal with an invalid end time

Client-side error handling is provided by the `parseAnchorError` and `formatError` functions in `utils/errors.js`.

