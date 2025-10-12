import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatsCard from '../components/StatsCard';
import ErrorBoundary from '../components/ErrorBoundary';

// Mock components that might cause issues in tests
vi.mock('@solana/wallet-adapter-react', () => ({
  useWallet: () => ({
    publicKey: null,
    connected: false,
    connecting: false,
    disconnect: vi.fn(),
    connect: vi.fn(),
  }),
}));

describe('StatsCard Component', () => {
  it('renders correctly with props', () => {
    render(
      <StatsCard
        title="Test Title"
        value={123}
        icon="🔥"
        trend="+10%"
      />
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('🔥')).toBeInTheDocument();
    expect(screen.getByText('+10%')).toBeInTheDocument();
  });
  
  it('renders without trend', () => {
    render(
      <StatsCard
        title="No Trend"
        value={456}
        icon="📊"
      />
    );
    
    expect(screen.getByText('No Trend')).toBeInTheDocument();
    expect(screen.getByText('456')).toBeInTheDocument();
    expect(screen.queryByText('+10%')).not.toBeInTheDocument();
  });
});

describe('ErrorBoundary Component', () => {
  // Save the original console.error
  const originalConsoleError = console.error;
  
  beforeEach(() => {
    // Mock console.error to avoid noisy test output
    console.error = vi.fn();
  });
  
  afterEach(() => {
    // Restore original console.error
    console.error = originalConsoleError;
  });
  
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div data-testid="test-child">Test Child</div>
      </ErrorBoundary>
    );
    
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });
  
  it('renders fallback UI when there is an error', () => {
    // Create a component that will throw an error
    const ThrowError = () => {
      throw new Error('Test error');
      return null;
    };
    
    // Suppress the error boundary warning in test output
    const originalError = console.error;
    console.error = vi.fn();
    
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    
    // Restore console.error
    console.error = originalError;
    
    // Check that the error boundary rendered the fallback UI
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Refresh Page')).toBeInTheDocument();
  });
});

