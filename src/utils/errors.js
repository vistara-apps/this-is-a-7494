/**
 * Error handling utilities for SolVote
 */

// Error codes from the Solana program
export const ERROR_CODES = {
  PROPOSAL_ENDED: 6000,
  ALREADY_VOTED: 6001,
  INVALID_END_TIME: 6002,
};

// Error messages for user-friendly display
export const ERROR_MESSAGES = {
  [ERROR_CODES.PROPOSAL_ENDED]: 'This proposal has already ended.',
  [ERROR_CODES.ALREADY_VOTED]: 'You have already voted on this proposal.',
  [ERROR_CODES.INVALID_END_TIME]: 'The proposal end time is invalid.',
  
  // Wallet errors
  WALLET_NOT_CONNECTED: 'Please connect your wallet to continue.',
  WALLET_DISCONNECTED: 'Your wallet has been disconnected.',
  WALLET_CONNECTION_REJECTED: 'Wallet connection was rejected.',
  
  // Transaction errors
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
  INSUFFICIENT_FUNDS: 'Insufficient funds for transaction.',
  
  // Network errors
  NETWORK_ERROR: 'Network error. Please check your connection.',
  RPC_ERROR: 'Error connecting to Solana network.',
  
  // General errors
  UNKNOWN_ERROR: 'An unknown error occurred. Please try again.',
};

/**
 * Parse Anchor program error from error object
 * @param {Error} error - The error object
 * @returns {Object} Parsed error with code and message
 */
export function parseAnchorError(error) {
  // Default error response
  const defaultError = {
    code: 'UNKNOWN_ERROR',
    message: ERROR_MESSAGES.UNKNOWN_ERROR,
  };
  
  if (!error) return defaultError;
  
  // Check if it's an Anchor error
  if (error.logs && Array.isArray(error.logs)) {
    // Look for program error in logs
    const programErrorLog = error.logs.find(log => 
      log.includes('Program log: Error:')
    );
    
    if (programErrorLog) {
      // Extract error code
      const errorCodeMatch = programErrorLog.match(/Error: (\\d+)/);
      if (errorCodeMatch && errorCodeMatch[1]) {
        const errorCode = parseInt(errorCodeMatch[1]);
        return {
          code: errorCode,
          message: ERROR_MESSAGES[errorCode] || `Program error: ${errorCode}`,
        };
      }
    }
  }
  
  // Check for wallet errors
  if (error.message) {
    if (error.message.includes('User rejected')) {
      return {
        code: 'WALLET_CONNECTION_REJECTED',
        message: ERROR_MESSAGES.WALLET_CONNECTION_REJECTED,
      };
    }
    
    if (error.message.includes('insufficient funds')) {
      return {
        code: 'INSUFFICIENT_FUNDS',
        message: ERROR_MESSAGES.INSUFFICIENT_FUNDS,
      };
    }
  }
  
  // Return original error message if we can't parse it
  return {
    code: 'UNKNOWN_ERROR',
    message: error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
  };
}

/**
 * Format error for display to user
 * @param {Error|string} error - Error object or message
 * @returns {string} User-friendly error message
 */
export function formatError(error) {
  if (!error) return ERROR_MESSAGES.UNKNOWN_ERROR;
  
  // If it's just a string, return it
  if (typeof error === 'string') return error;
  
  // Parse Anchor errors
  if (error.logs || error.message) {
    const parsedError = parseAnchorError(error);
    return parsedError.message;
  }
  
  // Fallback to error message or unknown error
  return error.message || ERROR_MESSAGES.UNKNOWN_ERROR;
}

