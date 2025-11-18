import React, { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import * as anchor from '@coral-xyz/anchor';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import idl from '../escrow.json';

const PROGRAM_ID = new PublicKey('E5ijR9ex1qWRQGXBSQ7ZiRbP72xtqzxrNXvQRB9PaTYL');

const CreateOption: React.FC = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  
  const [optionType, setOptionType] = useState<'0' | '1'>('0'); // 0 = Call, 1 = Put
  const [underlying, setUnderlying] = useState('AAPL/SOL');
  const [premium, setPremium] = useState('2');
  const [strike, setStrike] = useState('1.5');
  const [initialMargin, setInitialMargin] = useState('1');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const createOption = async () => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      setMessage({ type: 'error', text: 'Please connect your wallet first' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const provider = new AnchorProvider(
        connection,
        wallet as any,
        { commitment: 'confirmed' }
      );
      
      const program = new Program(idl as any, provider);

      const currentTimestamp = Math.floor(Date.now() / 1000);
      const premiumLamports = new anchor.BN(parseFloat(premium) * 1e9);
      const strikeLamports = new anchor.BN(parseFloat(strike) * 1e9);
      const marginLamports = new anchor.BN(parseFloat(initialMargin) * 1e9);

      // Derive PDA for the option account
      const [optionPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('option'),
          wallet.publicKey.toBuffer(),
          Buffer.from(underlying),
        ],
        program.programId
      );

      const tx = await program.methods
        .initializeOption(
          parseInt(optionType),
          underlying,
          new anchor.BN(currentTimestamp),
          premiumLamports,
          strikeLamports,
          marginLamports,
          false // production mode
        )
        .accounts({
          option: optionPda,
          seller: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      setMessage({ 
        type: 'success', 
        text: `Option created successfully! Transaction: ${tx.slice(0, 8)}...` 
      });
      
      // Reset form
      setTimeout(() => {
        setUnderlying('AAPL/SOL');
        setPremium('2');
        setStrike('1.5');
        setInitialMargin('1');
      }, 2000);

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

  if (!wallet.connected) {
    return (
      <div className="fade-in">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Create New Option</h2>
          </div>
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)' }}>
              Please connect your wallet to create options
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Create New Option</h2>
        </div>

        {message && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); createOption(); }}>
          <div className="form-group">
            <label className="form-label">Option Type</label>
            <select 
              className="form-select"
              value={optionType}
              onChange={(e) => setOptionType(e.target.value as '0' | '1')}
              disabled={loading}
            >
              <option value="0">Call Option</option>
              <option value="1">Put Option</option>
            </select>
            <small style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem', display: 'block' }}>
              Call: Right to buy at strike price | Put: Right to sell at strike price
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">Underlying Asset</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., AAPL/SOL, BTC/SOL"
              value={underlying}
              onChange={(e) => setUnderlying(e.target.value)}
              disabled={loading}
              required
            />
            <small style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem', display: 'block' }}>
              Format: ASSET/SOL (e.g., AAPL/SOL for Apple stock priced in SOL)
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">Premium (SOL)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="form-input"
              placeholder="e.g., 2.0"
              value={premium}
              onChange={(e) => setPremium(e.target.value)}
              disabled={loading}
              required
            />
            <small style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem', display: 'block' }}>
              The upfront cost buyers pay to acquire this option
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">Strike Price Ratio (SOL)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="form-input"
              placeholder="e.g., 1.5"
              value={strike}
              onChange={(e) => setStrike(e.target.value)}
              disabled={loading}
              required
            />
            <small style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem', display: 'block' }}>
              The ratio at which the option can be exercised (Asset Price / SOL Price)
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">Initial Margin (SOL per party)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="form-input"
              placeholder="e.g., 1.0"
              value={initialMargin}
              onChange={(e) => setInitialMargin(e.target.value)}
              disabled={loading}
              required
            />
            <small style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem', display: 'block' }}>
              Collateral required from both seller and buyer to cover potential losses
            </small>
          </div>

          <div style={{ 
            background: 'rgba(0, 255, 255, 0.05)', 
            border: '1px solid rgba(0, 255, 255, 0.2)',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <h4 style={{ color: 'var(--neon-cyan)', marginBottom: '0.8rem' }}>Summary</h4>
            <div className="option-row">
              <span className="option-label">Type:</span>
              <span className="option-value">{optionType === '0' ? 'Call' : 'Put'} Option</span>
            </div>
            <div className="option-row">
              <span className="option-label">Term:</span>
              <span className="option-value">30 Days (European Style)</span>
            </div>
            <div className="option-row">
              <span className="option-label">Total Seller Deposit:</span>
              <span className="option-value" style={{ color: 'var(--neon-magenta)' }}>
                {(parseFloat(initialMargin) || 0).toFixed(2)} SOL (margin)
              </span>
            </div>
            <div className="option-row">
              <span className="option-label">Buyer Will Pay:</span>
              <span className="option-value" style={{ color: 'var(--neon-green)' }}>
                {(parseFloat(premium) + parseFloat(initialMargin) || 0).toFixed(2)} SOL (premium + margin)
              </span>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Creating Option...' : 'Create Option'}
          </button>
        </form>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ 
          color: 'var(--neon-purple)', 
          marginBottom: '1rem',
          fontFamily: 'Orbitron, monospace'
        }}>
          Important Information
        </h3>
        <div style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.8' }}>
          <div style={{ marginBottom: '1rem' }}>
            <strong style={{ color: 'var(--neon-cyan)' }}>• European Style:</strong> Options can only be exercised on the expiration date (30 days from creation).
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong style={{ color: 'var(--neon-green)' }}>• Dual Margins:</strong> Both seller and buyer must post collateral to manage risk.
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong style={{ color: 'var(--neon-magenta)' }}>• Daily Settlement:</strong> Mark-to-market adjustments occur daily based on price movements.
          </div>
          <div>
            <strong style={{ color: 'var(--neon-purple)' }}>• Margin Calls:</strong> If margin drops below 20% of initial, automatic margin call protection kicks in.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOption;
