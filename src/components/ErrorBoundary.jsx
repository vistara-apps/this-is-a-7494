import React, { Component } from 'react';

/**
 * ErrorBoundary component to catch and display errors in the React component tree
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI when an error occurs
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
          <div className="glass-effect rounded-2xl p-8 max-w-md">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
            <p className="text-white/70 mb-4">
              An error occurred in the application. Please try refreshing the page.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 text-left">
                <p className="text-red-400 font-medium mb-2">Error details:</p>
                <pre className="bg-white/10 p-3 rounded-lg text-white/70 text-xs overflow-auto max-h-40">
                  {this.state.error && this.state.error.toString()}
                </pre>
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-6 btn-primary"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;

