import React, { useState, useEffect } from 'react'
import { useWallet } from '../context/WalletContext'
import StatsCard from './StatsCard'
import ProposalCard from './ProposalCard'
import { mockProposals } from '../data/mockData'

const Dashboard = () => {
  const { isConnected } = useWallet()
  const [stats, setStats] = useState({
    totalProposals: 0,
    activeProposals: 0,
    totalVotes: 0,
    userVotes: 0,
  })

  useEffect(() => {
    // Calculate stats from mock data
    const totalProposals = mockProposals.length
    const activeProposals = mockProposals.filter(p => p.status === 'active').length
    const totalVotes = mockProposals.reduce((sum, p) => sum + p.yesVotes + p.noVotes, 0)
    const userVotes = mockProposals.filter(p => p.hasVoted).length

    setStats({
      totalProposals,
      activeProposals,
      totalVotes,
      userVotes,
    })
  }, [])

  const recentProposals = mockProposals.slice(0, 3)

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="glass-effect rounded-2xl p-8 max-w-md">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🦄</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Welcome to SolVote</h2>
          <p className="text-white/70 mb-6">
            Connect your Phantom wallet to start participating in community governance and creating proposals.
          </p>
          <div className="text-sm text-white/60">
            <p>✨ Secure on-chain voting</p>
            <p>🏛️ Community governance</p>
            <p>🔒 Verifiable results</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Dashboard
        </h1>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          Track your community's governance activity and participate in on-chain voting.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Proposals"
          value={stats.totalProposals}
          icon="📋"
          trend="+12%"
        />
        <StatsCard
          title="Active Proposals"
          value={stats.activeProposals}
          icon="🔥"
          trend="+5%"
        />
        <StatsCard
          title="Total Votes"
          value={stats.totalVotes}
          icon="🗳️"
          trend="+18%"
        />
        <StatsCard
          title="Your Votes"
          value={stats.userVotes}
          icon="✅"
          trend="+2"
        />
      </div>

      {/* Recent Proposals */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Recent Proposals</h2>
          <button className="text-blue-400 hover:text-blue-300 font-medium">
            View All →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentProposals.map((proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} compact />
          ))}
        </div>
      </div>

      {/* Activity Chart Placeholder */}
      <div className="glass-effect rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Voting Activity</h2>
        <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">📊</div>
            <p className="text-white/60">Activity chart coming soon</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard