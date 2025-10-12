import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Solvote } from "../target/types/solvote";
import { expect } from "chai";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";

describe("solvote", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Solvote as Program<Solvote>;
  const wallet = provider.wallet;

  // Test community and proposal
  const communityName = "Test Community";
  const proposalTitle = "Test Proposal";
  const proposalDescription = "This is a test proposal";
  
  // Generate a keypair for a test user
  const testUser = Keypair.generate();
  
  // PDAs
  let communityPda: PublicKey;
  let communityBump: number;
  let proposalPda: PublicKey;
  let proposalBump: number;
  let voteRecordPda: PublicKey;
  let voteRecordBump: number;

  before(async () => {
    // Airdrop SOL to test user
    const airdropSignature = await provider.connection.requestAirdrop(
      testUser.publicKey,
      1 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropSignature);
    
    // Find PDAs
    [communityPda, communityBump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("community"), wallet.publicKey.toBuffer()],
      program.programId
    );
    
    // Proposal ID will be 1 (first proposal)
    const proposalId = new anchor.BN(1);
    
    [proposalPda, proposalBump] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("proposal"),
        communityPda.toBuffer(),
        proposalId.toArrayLike(Buffer, "le", 8)
      ],
      program.programId
    );
    
    [voteRecordPda, voteRecordBump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("vote"), proposalPda.toBuffer(), wallet.publicKey.toBuffer()],
      program.programId
    );
  });

  it("Initializes a community", async () => {
    // Initialize community
    await program.methods
      .initializeCommunity(communityName)
      .accounts({
        community: communityPda,
        admin: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    
    // Fetch the community account
    const communityAccount = await program.account.community.fetch(communityPda);
    
    // Verify the community was created correctly
    expect(communityAccount.admin.toString()).to.equal(wallet.publicKey.toString());
    expect(communityAccount.name).to.equal(communityName);
    expect(communityAccount.proposalCount.toNumber()).to.equal(0);
    expect(communityAccount.bump).to.equal(communityBump);
  });

  it("Creates a proposal", async () => {
    // Current timestamp
    const now = Math.floor(Date.now() / 1000);
    // End time is 7 days from now
    const endTime = new anchor.BN(now + 7 * 24 * 60 * 60);
    
    // Create proposal
    await program.methods
      .createProposal(proposalTitle, proposalDescription, endTime)
      .accounts({
        community: communityPda,
        proposal: proposalPda,
        creator: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    
    // Fetch the proposal account
    const proposalAccount = await program.account.proposal.fetch(proposalPda);
    
    // Verify the proposal was created correctly
    expect(proposalAccount.id.toNumber()).to.equal(1);
    expect(proposalAccount.creator.toString()).to.equal(wallet.publicKey.toString());
    expect(proposalAccount.title).to.equal(proposalTitle);
    expect(proposalAccount.description).to.equal(proposalDescription);
    expect(proposalAccount.endTime.toNumber()).to.equal(endTime.toNumber());
    expect(proposalAccount.yesVotes.toNumber()).to.equal(0);
    expect(proposalAccount.noVotes.toNumber()).to.equal(0);
    expect(proposalAccount.community.toString()).to.equal(communityPda.toString());
    expect(proposalAccount.bump).to.equal(proposalBump);
  });

  it("Votes on a proposal", async () => {
    // Vote yes on the proposal
    await program.methods
      .vote(true) // Vote yes
      .accounts({
        proposal: proposalPda,
        voter: wallet.publicKey,
        voteAccount: voteRecordPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    
    // Fetch the updated proposal account
    const proposalAccount = await program.account.proposal.fetch(proposalPda);
    
    // Verify the vote was counted
    expect(proposalAccount.yesVotes.toNumber()).to.equal(1);
    expect(proposalAccount.noVotes.toNumber()).to.equal(0);
    
    // Fetch the vote record account
    const voteRecordAccount = await program.account.voteRecord.fetch(voteRecordPda);
    
    // Verify the vote record was created correctly
    expect(voteRecordAccount.voter.toString()).to.equal(wallet.publicKey.toString());
    expect(voteRecordAccount.proposal.toString()).to.equal(proposalPda.toString());
    expect(voteRecordAccount.voteYes).to.be.true;
    expect(voteRecordAccount.hasVoted).to.be.true;
    expect(voteRecordAccount.bump).to.equal(voteRecordBump);
  });

  it("Prevents double voting", async () => {
    try {
      // Try to vote again
      await program.methods
        .vote(false) // Try to vote no this time
        .accounts({
          proposal: proposalPda,
          voter: wallet.publicKey,
          voteAccount: voteRecordPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      
      // If we get here, the test failed
      expect.fail("Should have thrown an error for double voting");
    } catch (error) {
      // Verify it's the expected error
      expect(error.toString()).to.include("already voted");
    }
  });

  it("Allows another user to vote", async () => {
    // Find the vote record PDA for the test user
    const [testUserVoteRecordPda, testUserVoteRecordBump] = 
      await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from("vote"), proposalPda.toBuffer(), testUser.publicKey.toBuffer()],
        program.programId
      );
    
    // Vote no on the proposal as the test user
    await program.methods
      .vote(false) // Vote no
      .accounts({
        proposal: proposalPda,
        voter: testUser.publicKey,
        voteAccount: testUserVoteRecordPda,
        systemProgram: SystemProgram.programId,
      })
      .signers([testUser])
      .rpc();
    
    // Fetch the updated proposal account
    const proposalAccount = await program.account.proposal.fetch(proposalPda);
    
    // Verify both votes were counted
    expect(proposalAccount.yesVotes.toNumber()).to.equal(1);
    expect(proposalAccount.noVotes.toNumber()).to.equal(1);
  });
});

