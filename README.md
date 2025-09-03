# SolVote

![SolVote Banner](https://i.imgur.com/41c8e24a.jpeg)

**SolVote** is an effortless on-chain voting platform for Solana communities. It enables transparent governance through secure, verifiable voting on the Solana blockchain.

## Features

- **Secure Anchor Program**: Robust on-chain voting program built with the Anchor framework
- **Intuitive React Frontend**: User-friendly interface for creating and voting on proposals
- **Phantom Wallet Integration**: Seamless connection with the popular Solana wallet
- **Verifiable Deployment**: Transparent build and verification process for community trust
- **On-Chain Proposal Creation**: Create proposals directly on the Solana blockchain
- **Real-time Voting**: Vote on proposals with immediate on-chain confirmation

## Quick Start

### Prerequisites

- Node.js (v16 or later)
- Rust and Cargo
- Solana CLI (v1.14 or later)
- Anchor CLI (v0.26 or later)
- Phantom wallet or other Solana wallet

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/solvote.git
   cd solvote
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building the Solana Program

1. Build the Anchor program:
   ```bash
   npm run build:program
   ```

2. Deploy to devnet (for testing):
   ```bash
   npm run deploy:program -- devnet
   ```

## Documentation

Comprehensive documentation is available in the `docs` directory:

- [API Documentation](docs/api.md): Detailed API reference
- [Program Documentation](docs/program.md): Solana program architecture and instructions
- [Deployment Guide](docs/deployment.md): Step-by-step deployment instructions
- [Keypair Management](docs/keypair-management.md): Security best practices for keypairs
- [User Guide](docs/user-guide.md): End-user documentation

## Architecture

SolVote consists of two main components:

### Solana Program (Backend)

The on-chain program is built with Anchor and provides:
- Community management
- Proposal creation
- Secure voting
- Result tabulation

### React Frontend

The web interface provides:
- Wallet connection
- Proposal browsing and creation
- Voting interface
- Real-time results

## Development

### Project Structure

```
solvote/
├── docs/                 # Documentation
├── programs/             # Solana programs
│   └── solvote/          # Main Anchor program
├── scripts/              # Deployment and utility scripts
├── src/                  # Frontend source code
│   ├── components/       # React components
│   ├── context/          # React context providers
│   ├── services/         # API services
│   └── utils/            # Utility functions
├── tests/                # Test files
├── Anchor.toml           # Anchor configuration
└── package.json          # Node.js dependencies
```

### Available Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the frontend for production
- `npm run build:program`: Build the Solana program
- `npm run deploy:program`: Deploy the Solana program
- `npm run verify:program`: Verify the deployed program
- `npm test`: Run tests

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Solana](https://solana.com/) - The blockchain platform
- [Anchor](https://project-serum.github.io/anchor/) - The Solana development framework
- [Phantom](https://phantom.app/) - The Solana wallet

---

Built with ❤️ for the Solana community

