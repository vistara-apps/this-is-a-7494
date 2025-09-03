import React, { useState } from 'react'

const ProposalCard = ({ proposal, onVote, compact = false }) => {
  const [isVoting, setIsVoting] = useState(false)

  const totalVotes = proposal.yesVotes + proposal.noVotes
  const yesPercentage = totalVotes > 0 ? (proposal.yesVotes / totalVotes) * 100 : 0
  const noPercentage = totalVotes > 0 ? (proposal.noVotes / totalVotes) * 100 : 0

  const handleVote = async (voteType) => {
    if (proposal.hasVoted || proposal.status !== 'active') return
    
    setIsVoting(true)
    // Simulate voting delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    onVote?.(proposal.id, voteType)
    setIsVoting(false)
  }

  const formatTimeRemaining = (endTime) => {
    const now = new Date()
    const end = new Date(endTime)
    const diff = end - now
    
    if (diff <= 0) return 'Ended'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days}d ${hours}h left`
    return `${hours}h left`
  }

  return (
    <div className={`card-bg rounded-xl p-6 hover:bg-white/10 transition-all duration-200 ${compact ? 'max-w-sm' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              proposal.status === 'active' 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-gray-500/20 text-gray-400'
            }`}>
              {proposal.status === 'active' ? '🔥 Active' : '✅ Completed'}
            </span>
            <span className="text-white/60 text-xs">
              #{proposal.id}
            </span>
          </div>
          <h3 className={`font-bold text-white ${compact ? 'text-lg' : 'text-xl'} line-clamp-2`}>
            {proposal.title}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p className={`text-white/70 mb-4 ${compact ? 'text-sm line-clamp-2' : 'line-clamp-3'}`}>
        {proposal.description}
      </p>

      {/* Voting Progress */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-white/60">Voting Progress</span>
          <span className="text-white">{totalVotes} votes</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-400">Yes ({proposal.yesVotes})</span>
            <span className="text-green-400">{yesPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-green-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${yesPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-red-400">No ({proposal.noVotes})</span>
            <span className="text-red-400">{noPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-red-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${noPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-white/60">
          {formatTimeRemaining(proposal.endTime)}
        </div>

        {!compact && (
          <div className="flex space-x-2">
            {proposal.hasVoted ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-white/60">
                  You voted: 
                </span>
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  proposal.userVote === 'yes' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {proposal.userVote === 'yes' ? '👍 Yes' : '👎 No'}
                </span>
              </div>
            ) : proposal.status === 'active' ? (
              <>
                <button
                  onClick={() => handleVote('yes')}
                  disabled={isVoting}
                  className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
                >
                  {isVoting ? '...' : '👍 Yes'}
                </button>
                <button
                  onClick={() => handleVote('no')}
                  disabled={isVoting}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
                >
                  {isVoting ? '...' : '👎 No'}
                </button>
              </>
            ) : (
              <span className="text-white/60 text-sm">Voting ended</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProposalCard