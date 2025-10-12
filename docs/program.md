# SolVote Solana Program Documentation

This document provides detailed documentation for the SolVote Solana program, including its architecture, account structure, and instructions.

## Table of Contents

1. [Program Overview](#program-overview)
2. [Account Structure](#account-structure)
3. [Instructions](#instructions)
4. [PDAs and Seeds](#pdas-and-seeds)
5. [Security Considerations](#security-considerations)
6. [Deployment and Verification](#deployment-and-verification)

## Program Overview

SolVote is a Solana program built with the Anchor framework that enables on-chain voting for community governance. The program allows communities to create proposals and members to vote on them in a transparent and verifiable way.

### Key Features

- Community-based governance structure
- On-chain proposal creation and voting
- Transparent and verifiable results
- Time-bound voting periods

## Account Structure

The program defines three main account types:

### Community

The Community account represents a governance community and stores information about the community and its proposals.

```rust
#[account]
pub struct Community {
    pub admin: Pubkey,
    pub name: String,
    pub proposal_count: u64,
    pub bump: u8,
}
```

- `admin`: The public key of the community administrator
- `name`: The name of the community
- `proposal_count`: The number of proposals created in the community
- `bump`: The bump seed used to derive the PDA

### Proposal

The Proposal account represents a specific proposal that community members can vote on.

```rust
#[account]
pub struct Proposal {
    pub id: u64,
    pub creator: Pubkey,
    pub title: String,
    pub description: String,
    pub start_time: i64,
    pub end_time: i64,
    pub yes_votes: u64,
    pub no_votes: u64,
    pub community: Pubkey,
    pub bump: u8,
}
```

- `id`: The unique identifier for the proposal within the community
- `creator`: The public key of the proposal creator
- `title`: The title of the proposal
- `description`: A detailed description of the proposal
- `start_time`: The Unix timestamp when the proposal was created
- `end_time`: The Unix timestamp when voting ends
- `yes_votes`: The number of "yes" votes
- `no_votes`: The number of "no" votes
- `community`: The public key of the community the proposal belongs to
- `bump`: The bump seed used to derive the PDA

### VoteRecord

The VoteRecord account tracks a user's vote on a specific proposal.

```rust
#[account]
pub struct VoteRecord {
    pub voter: Pubkey,
    pub proposal: Pubkey,
    pub vote_yes: bool,
    pub has_voted: bool,
    pub bump: u8,
}
```

- `voter`: The public key of the voter
- `proposal`: The public key of the proposal
- `vote_yes`: Whether the vote was "yes" (true) or "no" (false)
- `has_voted`: Whether the user has voted (always true for initialized records)
- `bump`: The bump seed used to derive the PDA

## Instructions

The program provides the following instructions:

### Initialize Community

Creates a new community for governance.

```rust
pub fn initialize_community(
    ctx: Context<InitializeCommunity>,
    name: String,
) -> Result<()>
```

### Create Proposal

Creates a new proposal for voting.

```rust
pub fn create_proposal(
    ctx: Context<CreateProposal>,
    title: String,
    description: String,
    end_time: i64,
) -> Result<()>
```

### Vote

Casts a vote on a proposal.

```rust
pub fn vote(
    ctx: Context<Vote>,
    vote_yes: bool,
) -> Result<()>
```

## PDAs and Seeds

The program uses Program Derived Addresses (PDAs) with the following seeds:

### Community PDA

```
["community", admin_pubkey]
```

### Proposal PDA

```
["proposal", community_pubkey, proposal_id]
```

### VoteRecord PDA

```
["vote", proposal_pubkey, voter_pubkey]
```

## Security Considerations

The SolVote program implements several security measures:

1. **Time-bound Voting**: Proposals have an end time after which voting is no longer allowed.

2. **One Vote Per User**: Each user can only vote once on a proposal, enforced by the VoteRecord PDA.

3. **Admin Controls**: Only the community admin can perform certain administrative actions.

4. **Input Validation**: All inputs are validated before processing.

5. **PDA Ownership**: All PDAs are owned by the program, ensuring only the program can modify them.

## Deployment and Verification

The SolVote program is designed to be deployed in a verifiable manner, allowing users to verify that the on-chain program matches the published source code.

### Verifiable Build

To build the program with verification enabled:

```bash
anchor build --verifiable
```

### Deployment

To deploy the program to Solana:

```bash
anchor deploy --provider.cluster [network]
```

### Verification

To verify the deployed program:

```bash
anchor verify [program_id] --provider.cluster [network]
```

This verification process ensures that the deployed program bytecode matches the compiled source code, providing transparency and trust for users.

