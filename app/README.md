# Solana Options Escrow Frontend

A user-friendly React frontend for the Solana Options Escrow decentralized application. This interface allows users to create, trade, and manage options contracts on the Solana blockchain.

## Features

- **Wallet Connection**: Connect with Phantom wallet for secure transactions
- **Create Options**: Create new Call or Put option contracts with customizable parameters
- **Browse Options**: View and purchase available option contracts
- **Manage Options**: Exercise, settle, and delist your options
- **Real-time Updates**: Automatic refresh of option data
- **User-friendly Interface**: Clean, modern UI with clear status indicators

## Prerequisites

- Node.js v18 or higher
- npm or yarn
- A Solana wallet (Phantom recommended)
- SOL tokens on Devnet (for testing)

## Installation

1. Navigate to the app directory:
   ```bash
   cd app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Development Mode

Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

### Production Build

Create an optimized production build:
```bash
npm run build
```

The build artifacts will be in the `build/` directory.

To serve the production build:
```bash
npm install -g serve
serve -s build
```

## Usage

### 1. Connect Wallet

Click the "Select Wallet" button in the header to connect your Phantom wallet.

### 2. Browse Options

- Navigate to the "Browse Options" tab
- View all available option contracts
- See details including premium, strike price, expiry date, and margin requirements
- Click "Purchase Option" to buy an option (requires premium + margin deposit)

### 3. Create Option

- Navigate to the "Create Option" tab
- Select option type (Call or Put)
- Enter underlying asset symbol (e.g., AAPL/SOL, ETH/SOL)
- Set premium price in SOL
- Set strike price ratio
- Set initial margin requirement
- Optionally enable test mode for testing purposes
- Click "Create Option Contract"

### 4. Manage Your Options

Navigate to "My Options" tab to:

**As a Buyer:**
- View options you've purchased
- Exercise options at expiry
- Perform daily settlements
- Monitor margin levels

**As a Seller:**
- View options you've created
- Delist unsold options
- Monitor sold options

## Configuration

### Network Selection

By default, the app connects to Solana Devnet. To change networks, edit `src/App.tsx`:

```typescript
// For Devnet (testing)
const network = WalletAdapterNetwork.Devnet;

// For Mainnet (production)
const network = WalletAdapterNetwork.Mainnet;
```

### Program ID

The program ID is automatically loaded from the IDL file at `src/idl/escrow.json`.

## Project Structure

```
app/
├── public/
│   └── index.html          # HTML entry point
├── src/
│   ├── components/
│   │   ├── OptionsTrading.tsx  # Main trading interface
│   │   ├── CreateOption.tsx    # Create option form
│   │   ├── OptionsList.tsx     # Browse available options
│   │   └── MyOptions.tsx       # Manage owned options
│   ├── utils/
│   │   └── anchorClient.ts     # Anchor program interactions
│   ├── idl/
│   │   └── escrow.json         # Program IDL
│   ├── types/
│   │   └── escrow.ts           # TypeScript types
│   ├── App.tsx                 # Main app component
│   ├── App.css                 # Application styles
│   ├── index.tsx               # React entry point
│   └── index.css               # Global styles
├── config-overrides.js         # Webpack configuration
├── package.json                # Dependencies and scripts
└── tsconfig.json               # TypeScript configuration
```

## Key Components

### OptionsTrading
Main component that manages tabs and navigation between different views.

### CreateOption
Form for creating new option contracts with validation and error handling.

### OptionsList
Displays all available (listed) options with filtering and purchase functionality.

### MyOptions
Manages options owned by the connected wallet, including exercise and settlement operations.

## Troubleshooting

### Wallet Not Connecting

- Ensure Phantom wallet extension is installed
- Check that you're on the correct network (Devnet/Mainnet)
- Try refreshing the page

### Transaction Failed

- Check you have sufficient SOL for gas fees
- Verify you have enough SOL for premium + margin
- Ensure the option hasn't expired
- Check console for detailed error messages

### Build Errors

If you encounter build errors related to node polyfills:
- Ensure all dependencies are installed
- Try clearing node_modules and reinstalling: `rm -rf node_modules && npm install`

## Technologies Used

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Anchor**: Solana framework
- **@solana/web3.js**: Solana web3 library
- **@solana/wallet-adapter**: Wallet integration
- **react-app-rewired**: Custom webpack configuration

## Contributing

Contributions are welcome! Please follow the existing code style and include tests for new features.

## License

MIT License - see LICENSE file for details
