import React, { FC, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { BN } from '@coral-xyz/anchor';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getProgram, initializeOption } from '../utils/anchorClient';

const CreateOption: FC = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  
  const [optionType, setOptionType] = useState<number>(0); // 0 = Call, 1 = Put
  const [underlying, setUnderlying] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [strike, setStrike] = useState<string>('');
  const [initialMargin, setInitialMargin] = useState<string>('');
  const [isTest, setIsTest] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);

  const handleCreateOption = async () => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      setMessage({ type: 'error', text: 'Please connect your wallet first' });
      return;
    }

    if (!underlying || !price || !strike || !initialMargin) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const program = getProgram(connection, wallet as any);
      const initiationDate = new BN(Math.floor(Date.now() / 1000));
      const priceInLamports = new BN(parseFloat(price) * LAMPORTS_PER_SOL);
      const strikeInLamports = new BN(parseFloat(strike) * LAMPORTS_PER_SOL);
      const marginInLamports = new BN(parseFloat(initialMargin) * LAMPORTS_PER_SOL);

      const { tx, optionPda } = await initializeOption(
        program,
        optionType,
        underlying,
        initiationDate,
        priceInLamports,
        strikeInLamports,
        marginInLamports,
        isTest,
        wallet.publicKey
      );

      setMessage({ 
        type: 'success', 
        text: `Option created successfully! Transaction: ${tx.slice(0, 8)}...${tx.slice(-8)}` 
      });
      
      // Reset form
      setUnderlying('');
      setPrice('');
      setStrike('');
      setInitialMargin('');
    } catch (error: any) {
      console.error('Error creating option:', error);
      setMessage({ 
        type: 'error', 
        text: `Failed to create option: ${error.message || 'Unknown error'}` 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Create New Option Contract</h2>
      <p style={{ color: '#666', marginBottom: '24px' }}>
        Create a new Call or Put option contract for others to purchase
      </p>

      {message && (
        <div className={`message message-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="form-group">
        <label>Option Type</label>
        <select 
          value={optionType} 
          onChange={(e) => setOptionType(parseInt(e.target.value))}
          disabled={loading}
        >
          <option value={0}>Call Option</option>
          <option value={1}>Put Option</option>
        </select>
        <small style={{ display: 'block', marginTop: '4px', color: '#666' }}>
          Call: Right to buy at strike price | Put: Right to sell at strike price
        </small>
      </div>

      <div className="form-group">
        <label>Underlying Asset (Symbol)</label>
        <input
          type="text"
          placeholder="e.g., AAPL/SOL, ETH/SOL, BTC/SOL"
          value={underlying}
          onChange={(e) => setUnderlying(e.target.value)}
          disabled={loading}
          maxLength={32}
        />
        <small style={{ display: 'block', marginTop: '4px', color: '#666' }}>
          Max 32 characters. Use format: ASSET/SOL
        </small>
      </div>

      <div className="form-group">
        <label>Premium (SOL)</label>
        <input
          type="number"
          placeholder="e.g., 2.5"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          disabled={loading}
          step="0.01"
          min="0.01"
        />
        <small style={{ display: 'block', marginTop: '4px', color: '#666' }}>
          The price a buyer pays to purchase this option
        </small>
      </div>

      <div className="form-group">
        <label>Strike Price Ratio (SOL)</label>
        <input
          type="number"
          placeholder="e.g., 1.5"
          value={strike}
          onChange={(e) => setStrike(e.target.value)}
          disabled={loading}
          step="0.01"
          min="0.01"
        />
        <small style={{ display: 'block', marginTop: '4px', color: '#666' }}>
          The ratio at which the option can be exercised (asset_price / SOL_price)
        </small>
      </div>

      <div className="form-group">
        <label>Initial Margin (SOL per party)</label>
        <input
          type="number"
          placeholder="e.g., 1.0"
          value={initialMargin}
          onChange={(e) => setInitialMargin(e.target.value)}
          disabled={loading}
          step="0.1"
          min="0.1"
        />
        <small style={{ display: 'block', marginTop: '4px', color: '#666' }}>
          Collateral required from both buyer and seller. Helps manage risk.
        </small>
      </div>

      <div className="form-group">
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={isTest}
            onChange={(e) => setIsTest(e.target.checked)}
            disabled={loading}
            style={{ marginRight: '8px', width: 'auto', cursor: 'pointer' }}
          />
          Test Mode (allows past dates)
        </label>
        <small style={{ display: 'block', marginTop: '4px', color: '#666' }}>
          Enable for testing purposes. Allows contracts with past initiation dates.
        </small>
      </div>

      <button
        className="btn-primary"
        onClick={handleCreateOption}
        disabled={loading || !wallet.publicKey}
        style={{ width: '100%', marginTop: '8px' }}
      >
        {loading ? 'Creating...' : 'Create Option Contract'}
      </button>

      <div style={{ 
        marginTop: '24px', 
        padding: '16px', 
        background: '#f8f9fa', 
        borderRadius: '8px',
        borderLeft: '4px solid #667eea'
      }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#667eea' }}>ℹ️ About Options</h4>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#666', fontSize: '14px' }}>
          <li>All options are European-style with a 30-day term</li>
          <li>Both buyer and seller deposit margins for risk management</li>
          <li>Daily settlements adjust margins based on price movements</li>
          <li>Options can be resold before expiry on secondary market</li>
          <li>Margin call occurs if margin drops below 20% threshold</li>
        </ul>
      </div>
    </div>
  );
};

export default CreateOption;
