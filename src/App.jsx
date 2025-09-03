import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ProposalList from './components/ProposalList';
import CreateProposal from './components/CreateProposal';
import ErrorBoundary from './components/ErrorBoundary';
import { WalletProvider } from './context/WalletContext';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading the app (in a real app, this would load the IDL, etc.)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'proposals':
        return <ProposalList />;
      case 'create':
        return <CreateProposal />;
      default:
        return <Dashboard />;
    }
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white">Loading SolVote</h2>
          <p className="text-white/70 mt-2">Connecting to Solana network...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <WalletProvider>
        <div className="min-h-screen gradient-bg">
          <Navbar currentView={currentView} setCurrentView={setCurrentView} />
          <main className="container mx-auto px-6 py-8 max-w-7xl">
            {renderView()}
          </main>
        </div>
      </WalletProvider>
    </ErrorBoundary>
  );
}

export default App;
