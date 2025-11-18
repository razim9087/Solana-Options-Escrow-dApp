# Solana Options Escrow - Frontend Application

A modern, futuristic frontend for the Solana Options Escrow decentralized application featuring a vibrant neon color scheme and seamless blockchain integration.

## 🎨 Features

### Visual Design
- **Neon Futuristic Theme**: Vibrant cyan, magenta, purple, and green neon colors
- **Glassmorphism Effects**: Semi-transparent cards with backdrop blur
- **Animated Gradients**: Smooth color transitions and glow effects
- **Dark Base Theme**: Deep purple/black background for optimal contrast
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Functionality
- **Wallet Integration**: Support for Phantom, Solflare, and Torus wallets
- **Dashboard**: Overview of features and quick start guide
- **Marketplace**: Browse and purchase available options
- **Create Options**: Form to list new Call or Put options
- **Portfolio Management**: View, exercise, resell, or delist your options
- **Real-time Updates**: Fetch on-chain data and display option status

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- npm or yarn
- A Solana wallet (Phantom, Solflare, or Torus)

### Installation

1. Navigate to the app directory:
```bash
cd app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

### Building for Production

To create an optimized production build:
```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## 📁 Project Structure

```
app/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx       # Landing page with features
│   │   ├── CreateOption.tsx    # Form to create new options
│   │   ├── OptionsList.tsx     # Marketplace view
│   │   └── MyOptions.tsx       # Portfolio management
│   ├── App.tsx                 # Main application component
│   ├── App.css                 # Neon-themed styles
│   ├── index.tsx               # Entry point
│   └── escrow.json             # Program IDL
├── config-overrides.js         # Webpack configuration
├── package.json                # Dependencies
└── tsconfig.json              # TypeScript configuration
```

## 🎯 Usage Guide

### Connecting Your Wallet
1. Click the "SELECT WALLET" button in the top right
2. Choose your preferred wallet (Phantom, Solflare, or Torus)
3. Approve the connection in your wallet extension

### Creating an Option
1. Navigate to "Create Option" in the menu
2. Select option type (Call or Put)
3. Enter underlying asset (e.g., AAPL/SOL)
4. Set premium, strike price, and initial margin
5. Click "Create Option" and approve the transaction

### Browsing the Marketplace
1. Go to "Marketplace" to view available options
2. Filter by All, Call, or Put options
3. Click "Purchase Option" on any listing
4. Approve the transaction with premium + margin

### Managing Your Portfolio
1. Visit "My Portfolio" to see your options
2. View owned options and created listings
3. Exercise options at expiry
4. Resell options on the secondary market
5. Delist options that haven't been purchased

## 🛠️ Technology Stack

- **React 18.2.0**: UI framework
- **TypeScript**: Type-safe development
- **@solana/web3.js**: Solana blockchain interaction
- **@coral-xyz/anchor**: Anchor framework integration
- **@solana/wallet-adapter**: Multi-wallet support
- **react-app-rewired**: Webpack customization for polyfills

## ⚙️ Configuration

### Network Settings
The app connects to Solana Devnet by default. To change networks, edit `App.tsx`:

```typescript
const network = WalletAdapterNetwork.Devnet; // or Testnet, Mainnet-Beta
```

### Program ID
The Solana program ID is defined in each component:
```typescript
const PROGRAM_ID = new PublicKey('E5ijR9ex1qWRQGXBSQ7ZiRbP72xtqzxrNXvQRB9PaTYL');
```

## 🎨 Customizing the Theme

The neon color scheme can be customized in `src/App.css`:

```css
:root {
  --neon-cyan: #00ffff;
  --neon-magenta: #ff00ff;
  --neon-purple: #8b00ff;
  --neon-green: #00ff41;
  --neon-pink: #ff006e;
  --neon-blue: #0080ff;
  --dark-bg: #0a0a0f;
  --dark-card: #1a1a2e;
}
```

## 🔧 Troubleshooting

### Wallet Connection Issues
- Ensure your wallet extension is installed and unlocked
- Check that you're on the correct network (Devnet)
- Try refreshing the page

### Transaction Failures
- Verify you have sufficient SOL for gas fees
- Check that the program is deployed on your network
- Ensure all required accounts are properly set up

### Build Errors
If you encounter module resolution errors:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📸 Screenshots

### Dashboard
![Dashboard](https://github.com/user-attachments/assets/9be78442-846d-4f00-8da7-ecf12c7c19af)

### Create Option
![Create Option](https://github.com/user-attachments/assets/29442c7e-a1b3-49c7-bd51-e0c0ad958415)

### Marketplace
![Marketplace](https://github.com/user-attachments/assets/60b64a9c-1271-4885-b240-a510bc1550db)

### Portfolio
![Portfolio](https://github.com/user-attachments/assets/2782c270-10db-4a0b-b9d5-ee5246a473cc)

## 🔐 Security Considerations

- Never share your private keys or seed phrases
- Always verify transaction details before signing
- Test on Devnet before using on Mainnet
- Keep your wallet software up to date
- Monitor margin levels to avoid margin calls

## 📝 License

This project is licensed under the MIT License - see the main repository LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🌟 Acknowledgments

- Built for the Solana blockchain ecosystem
- Uses Anchor framework for smart contract interaction
- Inspired by modern DeFi trading platforms
- Neon design inspired by cyberpunk aesthetics

---

**For more information about the backend smart contract, see the main repository README.**
