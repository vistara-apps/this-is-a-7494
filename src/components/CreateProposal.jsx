import React, { useState } from 'react'
import { useWallet } from '../context/WalletContext'

const CreateProposal = () => {
  const { isConnected } = useWallet()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '7', // days
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isConnected) return

    setIsSubmitting(true)
    
    // Simulate proposal creation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setShowSuccess(true)
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      duration: '7',
    })

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000)
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="glass-effect rounded-2xl p-8 max-w-md">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-white/70">
            Please connect your Phantom wallet to create proposals.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Create Proposal
        </h1>
        <p className="text-white/70 text-lg">
          Submit a new proposal for the community to vote on.
        </p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center animate-fade-in">
          <div className="text-2xl mb-2">🎉</div>
          <h3 className="text-green-400 font-semibold mb-1">Proposal Created Successfully!</h3>
          <p className="text-green-300/80 text-sm">Your proposal has been submitted to the blockchain.</p>
        </div>
      )}

      {/* Form */}
      <div className="glass-effect rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
              Proposal Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter a clear, concise title for your proposal"
              className="input-field w-full"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Provide detailed information about your proposal. What are you proposing? Why should the community support it?"
              rows={6}
              className="input-field w-full resize-none"
              required
            />
          </div>

          {/* Duration */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-white mb-2">
              Voting Duration
            </label>
            <select
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className="input-field w-full"
            >
              <option value="3">3 days</option>
              <option value="7">7 days</option>
              <option value="14">14 days</option>
              <option value="30">30 days</option>
            </select>
          </div>

          {/* Guidelines */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="text-blue-400 font-semibold mb-2">📋 Proposal Guidelines</h4>
            <ul className="text-blue-300/80 text-sm space-y-1">
              <li>• Be clear and specific about what you're proposing</li>
              <li>• Explain the benefits to the community</li>
              <li>• Consider potential risks or drawbacks</li>
              <li>• Proposals cannot be edited after submission</li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !formData.title.trim() || !formData.description.trim()}
            className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>Creating Proposal...</span>
              </div>
            ) : (
              <>
                <span className="mr-2">🚀</span>
                Create Proposal
              </>
            )}
          </button>
        </form>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card-bg rounded-xl p-4">
          <div className="text-2xl mb-2">⛽</div>
          <h4 className="font-semibold text-white mb-1">Transaction Fee</h4>
          <p className="text-white/60 text-sm">
            Creating a proposal requires a small SOL transaction fee (~0.001 SOL)
          </p>
        </div>
        <div className="card-bg rounded-xl p-4">
          <div className="text-2xl mb-2">🔒</div>
          <h4 className="font-semibold text-white mb-1">On-Chain Storage</h4>
          <p className="text-white/60 text-sm">
            Your proposal will be permanently stored on the Solana blockchain
          </p>
        </div>
      </div>
    </div>
  )
}

export default CreateProposal