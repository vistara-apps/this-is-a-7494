import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import ProposalList from './components/ProposalList'
import CreateProposal from './components/CreateProposal'
import { WalletProvider } from './context/WalletContext'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />
      case 'proposals':
        return <ProposalList />
      case 'create':
        return <CreateProposal />
      default:
        return <Dashboard />
    }
  }

  return (
    <WalletProvider>
      <div className="min-h-screen gradient-bg">
        <Navbar currentView={currentView} setCurrentView={setCurrentView} />
        <main className="container mx-auto px-6 py-8 max-w-7xl">
          {renderView()}
        </main>
      </div>
    </WalletProvider>
  )
}

export default App