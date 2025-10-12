use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod solvote {
    use super::*;

    /// Initialize a new community
    pub fn initialize_community(
        ctx: Context<InitializeCommunity>,
        name: String,
    ) -> Result<()> {
        let community = &mut ctx.accounts.community;
        let admin = &ctx.accounts.admin;

        // Initialize community data
        community.admin = admin.key();
        community.name = name;
        community.proposal_count = 0;
        community.bump = *ctx.bumps.get("community").unwrap();

        msg!("Community initialized: {}", name);
        Ok(())
    }

    /// Create a new proposal
    pub fn create_proposal(
        ctx: Context<CreateProposal>,
        title: String,
        description: String,
        end_time: i64,
    ) -> Result<()> {
        let community = &mut ctx.accounts.community;
        let proposal = &mut ctx.accounts.proposal;
        let creator = &ctx.accounts.creator;
        let clock = Clock::get()?;

        // Validate end time
        if end_time <= clock.unix_timestamp {
            return err!(ErrorCode::InvalidEndTime);
        }

        // Increment proposal count
        community.proposal_count += 1;

        // Initialize proposal data
        proposal.id = community.proposal_count;
        proposal.creator = creator.key();
        proposal.title = title;
        proposal.description = description;
        proposal.start_time = clock.unix_timestamp;
        proposal.end_time = end_time;
        proposal.yes_votes = 0;
        proposal.no_votes = 0;
        proposal.community = community.key();
        proposal.bump = *ctx.bumps.get("proposal").unwrap();

        msg!("Proposal created: {}", title);
        Ok(())
    }

    /// Vote on a proposal
    pub fn vote(
        ctx: Context<Vote>,
        vote_yes: bool,
    ) -> Result<()> {
        let proposal = &mut ctx.accounts.proposal;
        let vote_account = &mut ctx.accounts.vote_account;
        let voter = &ctx.accounts.voter;
        let clock = Clock::get()?;

        // Check if proposal has ended
        if clock.unix_timestamp > proposal.end_time {
            return err!(ErrorCode::ProposalEnded);
        }

        // Check if user has already voted
        if vote_account.has_voted {
            return err!(ErrorCode::AlreadyVoted);
        }

        // Record the vote
        vote_account.voter = voter.key();
        vote_account.proposal = proposal.key();
        vote_account.vote_yes = vote_yes;
        vote_account.has_voted = true;
        vote_account.bump = *ctx.bumps.get("vote_account").unwrap();

        // Update vote counts
        if vote_yes {
            proposal.yes_votes += 1;
        } else {
            proposal.no_votes += 1;
        }

        msg!("Vote recorded: {}", if vote_yes { "Yes" } else { "No" });
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeCommunity<'info> {
    #[account(
        init,
        payer = admin,
        space = Community::LEN,
        seeds = [b"community", admin.key().as_ref()],
        bump
    )]
    pub community: Account<'info, Community>,
    
    #[account(mut)]
    pub admin: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateProposal<'info> {
    #[account(
        mut,
        seeds = [b"community", community.admin.as_ref()],
        bump = community.bump
    )]
    pub community: Account<'info, Community>,
    
    #[account(
        init,
        payer = creator,
        space = Proposal::LEN,
        seeds = [
            b"proposal",
            community.key().as_ref(),
            &(community.proposal_count + 1).to_le_bytes()
        ],
        bump
    )]
    pub proposal: Account<'info, Proposal>,
    
    #[account(mut)]
    pub creator: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Vote<'info> {
    #[account(
        mut,
        seeds = [
            b"proposal",
            proposal.community.as_ref(),
            &proposal.id.to_le_bytes()
        ],
        bump = proposal.bump
    )]
    pub proposal: Account<'info, Proposal>,
    
    #[account(mut)]
    pub voter: Signer<'info>,
    
    #[account(
        init,
        payer = voter,
        space = VoteRecord::LEN,
        seeds = [b"vote", proposal.key().as_ref(), voter.key().as_ref()],
        bump
    )]
    pub vote_account: Account<'info, VoteRecord>,
    
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Community {
    pub admin: Pubkey,
    pub name: String,
    pub proposal_count: u64,
    pub bump: u8,
}

impl Community {
    pub const LEN: usize = 8 + // discriminator
        32 + // admin: Pubkey
        4 + 50 + // name: String (max 50 chars)
        8 + // proposal_count: u64
        1; // bump: u8
}

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

impl Proposal {
    pub const LEN: usize = 8 + // discriminator
        8 + // id: u64
        32 + // creator: Pubkey
        4 + 100 + // title: String (max 100 chars)
        4 + 500 + // description: String (max 500 chars)
        8 + // start_time: i64
        8 + // end_time: i64
        8 + // yes_votes: u64
        8 + // no_votes: u64
        32 + // community: Pubkey
        1; // bump: u8
}

#[account]
pub struct VoteRecord {
    pub voter: Pubkey,
    pub proposal: Pubkey,
    pub vote_yes: bool,
    pub has_voted: bool,
    pub bump: u8,
}

impl VoteRecord {
    pub const LEN: usize = 8 + // discriminator
        32 + // voter: Pubkey
        32 + // proposal: Pubkey
        1 + // vote_yes: bool
        1 + // has_voted: bool
        1; // bump: u8
}

#[error_code]
pub enum ErrorCode {
    #[msg("Voting has ended for this proposal")]
    ProposalEnded = 6000,
    
    #[msg("You have already voted on this proposal")]
    AlreadyVoted = 6001,
    
    #[msg("End time must be in the future")]
    InvalidEndTime = 6002,
}

