import React, { useState } from 'react'
import { useWallet } from '../context/WalletContext'
import ProposalCard from './ProposalCard'
import { mockProposals } from '../data/mockData'

const ProposalList = () => {
  const { isConnected } = useWallet()
  const [filter, setFilter] = useState('all')
  const [proposals, setProposals] = useState(mockProposals)

  const filteredProposals = proposals.filter(proposal => {
    if (filter === 'all') return true
    if (filter === 'active') return proposal.status === 'active'
    if (filter === 'completed') return proposal.status === 'completed'
    if (filter === 'my-votes') return proposal.hasVoted
    return true
  })

  const handleVote = (proposalId, voteType) => {
    setProposals(prev => prev.map(proposal => {
      if (proposal.id === proposalId && !proposal.hasVoted) {
        return {
          ...proposal,
          hasVoted: true,
          userVote: voteType,
          yesVotes: voteType === 'yes' ? proposal.yesVotes + 1 : proposal.yesVotes,
          noVotes: voteType === 'no' ? proposal.noVotes + 1 : proposal.noVotes,
        }
      }
      return proposal
    }))
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="glass-effect rounded-2xl p-8 max-w-md">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-white/70">
            Please connect your Phantom wallet to view and vote on proposals.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Proposals
        </h1>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          Browse and vote on community proposals. Your voice matters in shaping the future.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 justify-center">
        {[
          { key: 'all', label: 'All Proposals', count: proposals.length },
          { key: 'active', label: 'Active', count: proposals.filter(p => p.status === 'active').length },
          { key: 'completed', label: 'Completed', count: proposals.filter(p => p.status === 'completed').length },
          { key: 'my-votes', label: 'My Votes', count: proposals.filter(p => p.hasVoted).length },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filter === key
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'
            }`}
          >
            {label} ({count})
          </button>
        ))}
      </div>

      {/* Proposals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProposals.map((proposal) => (
          <ProposalCard
            key={proposal.id}
            proposal={proposal}
            onVote={handleVote}
          />
        ))}
      </div>

      {filteredProposals.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-white mb-2">No proposals found</h3>
          <p className="text-white/60">Try adjusting your filters or create a new proposal.</p>
        </div>
      )}
    </div>
  )
}

export default ProposalList