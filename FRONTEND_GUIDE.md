# Frontend User Guide

## Overview

The Solana Options Escrow Frontend provides a complete web interface for trading options contracts on the Solana blockchain. The application features a modern, intuitive design that makes it easy for users to create, browse, and manage options.

## Main Features

### 1. Wallet Connection
- Click "Select Wallet" button in the top-right corner
- Connect your Phantom wallet
- The app displays your wallet address once connected
- All transactions require wallet approval

### 2. Browse Options Tab
The Browse Options tab allows you to:
- View all available (listed) option contracts
- See detailed information for each option:
  - Option type (Call or Put)
  - Underlying asset (e.g., AAPL/SOL, ETH/SOL)
  - Premium price in SOL
  - Strike price ratio
  - Margin requirement
  - Expiry date
  - Seller address
- Purchase options by clicking "Purchase Option" button
- Filter and refresh the options list

**What you see:**
- Grid layout of option cards
- Each card shows complete option details
- Status badges (Listed, Owned, Expired, etc.)
- Total cost calculation (Premium + Margin)

### 3. Create Option Tab
The Create Option tab provides a form to create new options:
- Select option type: Call or Put
- Enter underlying asset symbol (max 32 chars)
- Set premium price in SOL
- Set strike price ratio
- Set initial margin per party
- Toggle test mode for testing
- Submit to create the option contract

**Form Fields:**
- Option Type dropdown: Call or Put
- Underlying Asset: Text input (e.g., "AAPL/SOL")
- Premium: Number input in SOL
- Strike Price Ratio: Number input
- Initial Margin: Number input in SOL
- Test Mode: Checkbox

**Helper Text:**
Each field includes helpful descriptions explaining what it means and how to use it.

**Information Box:**
At the bottom, an info box explains:
- European-style options with 30-day terms
- Dual margin system
- Daily settlements
- Resale capability
- Margin call mechanism

### 4. My Options Tab
The My Options tab has two sections:

#### Owned Options (as Buyer)
Shows options you've purchased with actions:
- **Exercise Option**: Execute the option at expiry (requires asset and SOL prices)
- **Daily Settlement**: Perform mark-to-market settlement
- View your margin and seller margin
- Monitor option status

#### Created Options (as Seller)
Shows options you've created with actions:
- **Delist Option**: Cancel and remove unlisted options
- View option status and details
- Monitor sold vs. unsold options

**Settlement/Exercise Flow:**
1. Click "Exercise Option" or "Daily Settlement"
2. Enter current asset price in USD
3. Enter current SOL price in USD
4. Click Submit to execute
5. Transaction is sent to blockchain
6. View success/error message

## User Interface Elements

### Header
- App title: "🚀 Solana Options Escrow DApp"
- Subtitle: "Decentralized Options Trading Platform"
- Wallet connection button

### Tab Navigation
Three prominent tabs:
- 📈 Browse Options
- ➕ Create Option
- 💼 My Options

### Option Cards
Each option card displays:
- Header with option type and status badge
- Large asset symbol
- Detail rows with labels and values
- Action buttons at the bottom
- Total cost information (for purchase)

### Status Badges
Color-coded badges:
- **Listed** (blue): Available for purchase
- **Owned** (green): Active option owned by buyer
- **Expired** (pink): Past expiry date
- **Margin Called** (orange): Margin threshold breached

### Messages
Success/error messages appear at the top:
- **Success** (green): Transaction completed
- **Error** (red): Transaction failed
- **Info** (blue): General information

### Buttons
Color-coded action buttons:
- **Primary** (purple gradient): Main actions
- **Secondary** (gray): Secondary actions
- **Success** (green): Positive actions
- **Danger** (red): Destructive actions
- **Info** (blue): Information actions

## Typical User Workflows

### Workflow 1: Purchasing an Option
1. Connect wallet
2. Navigate to "Browse Options"
3. Review available options
4. Click "Purchase Option" on desired option
5. Approve transaction in wallet
6. Wait for confirmation
7. View in "My Options" → "Owned Options"

### Workflow 2: Creating an Option
1. Connect wallet
2. Navigate to "Create Option"
3. Fill in all form fields
4. Click "Create Option Contract"
5. Approve transaction in wallet
6. Wait for confirmation
7. View in "My Options" → "Created Options"

### Workflow 3: Exercising an Option
1. Connect wallet
2. Navigate to "My Options"
3. Find option in "Owned Options" section
4. Click "⚡ Exercise Option"
5. Enter current asset and SOL prices
6. Click Submit
7. Approve transaction in wallet
8. Receive settlement

### Workflow 4: Daily Settlement
1. Connect wallet
2. Navigate to "My Options"
3. Find active option
4. Click "📊 Daily Settlement"
5. Enter current prices
6. Submit and approve transaction
7. Margins are adjusted based on P&L

## Design Features

### Responsive Layout
- Works on desktop and tablet devices
- Cards automatically adjust to screen size
- Mobile-friendly interface

### Visual Feedback
- Loading states on buttons
- Disabled states for invalid actions
- Hover effects on interactive elements
- Smooth transitions and animations

### Color Scheme
- Primary: Purple gradient (#667eea to #764ba2)
- Background: Gradient purple background
- Cards: White with subtle shadows
- Status-based colors for badges

### Typography
- Clear hierarchy with different font sizes
- Bold headers and labels
- Monospace for addresses and hashes
- Readable body text

## Technical Details

### Network
- Default: Solana Devnet (for testing)
- Can be configured for Mainnet

### Program ID
- E5ijR9ex1qWRQGXBSQ7ZiRbP72xtqzxrNXvQRB9PaTYL
- Automatically loaded from IDL

### Supported Wallets
- Phantom (primary)
- Other Solana wallet adapters available

### Transaction Confirmation
- Uses "processed" commitment level
- Real-time feedback
- Transaction signature displayed

## Tips for Users

1. **Always start on Devnet**: Test the application thoroughly before using real funds
2. **Check your balance**: Ensure you have enough SOL for gas fees and margins
3. **Understand options**: Read the information boxes and documentation
4. **Monitor margins**: Keep track of your margin levels to avoid margin calls
5. **Set realistic prices**: Use real market data for accurate settlements
6. **Save transaction IDs**: Keep records of important transactions
7. **Refresh regularly**: Click refresh to see updated option data

## Troubleshooting

### Wallet won't connect
- Install Phantom wallet extension
- Refresh the page
- Check browser console for errors

### Transaction fails
- Check you have sufficient SOL
- Verify option hasn't expired
- Ensure you're on the correct network
- Check margin requirements

### Options not showing
- Click the refresh button
- Check your network connection
- Verify you're connected to the right network

### Can't exercise option
- Options can only be exercised at expiry
- Ensure you're the owner
- Provide valid price data

## Security Notes

- Never share your private keys
- Always verify transaction details before approving
- Start with small amounts on Devnet
- Understand the risks of options trading
- The app never stores your private keys

## Support

For issues or questions:
- Check the README.md files
- Review the DOCUMENTATION.md
- Open an issue on GitHub
- Check Solana and Anchor documentation

---

**Remember**: This is a decentralized application. You are in full control of your funds and actions. Always trade responsibly and within your means.
