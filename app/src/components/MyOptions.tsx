import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import * as anchor from '@coral-xyz/anchor';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import idl from '../escrow.json';

const PROGRAM_ID = new PublicKey('E5ijR9ex1qWRQGXBSQ7ZiRbP72xtqzxrNXvQRB9PaTYL');

interface OptionAccount {
  publicKey: string;
  optionType: number;
  underlying: string;
  price: number;
  strike: number;
  seller: string;
  owner: string;
  status: string;
  initiationDate: number;
  expiryDate: number;
  initialMargin: number;
  sellerMargin: number;
  buyerMargin: number;
  lastSettlementPrice: number;
}

const MyOptions: React.FC = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [myOptions, setMyOptions] = useState<OptionAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [selectedOption, setSelectedOption] = useState<OptionAccount | null>(null);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showResellModal, setShowResellModal] = useState(false);
  const [resellPrice, setResellPrice] = useState('');
  const [assetPrice, setAssetPrice] = useState('');
  const [solPrice, setSolPrice] = useState('');

  const fetchMyOptions = async () => {
    if (!wallet.publicKey) return;

    setLoading(true);
    try {
      const provider = new AnchorProvider(
        connection,
        wallet as any,
        { commitment: 'confirmed' }
      );
      
      const program: any = new Program(idl as any, provider);
      
      const accounts = await program.account.optionContract.all();
      
      const myOptionsList = accounts
        .filter((account: any) => 
          account.account.owner.toString() === wallet.publicKey?.toString() ||
          account.account.seller.toString() === wallet.publicKey?.toString()
        )
        .map((account: any) => ({
          publicKey: account.publicKey.toString(),
          optionType: account.account.optionType,
          underlying: account.account.underlying,
          price: account.account.price.toNumber() / 1e9,
          strike: account.account.strike.toNumber() / 1e9,
          seller: account.account.seller.toString(),
          owner: account.account.owner.toString(),
          status: Object.keys(account.account.status)[0],
          initiationDate: account.account.initiationDate.toNumber(),
          expiryDate: account.account.expiryDate.toNumber(),
          initialMargin: account.account.initialMargin.toNumber() / 1e9,
          sellerMargin: account.account.sellerMargin.toNumber() / 1e9,
          buyerMargin: account.account.buyerMargin.toNumber() / 1e9,
          lastSettlementPrice: account.account.lastSettlementPrice.toNumber() / 1e9,
        }));

      setMyOptions(myOptionsList);
    } catch (error) {
      console.error('Error fetching my options:', error);
      setMessage({ type: 'error', text: 'Failed to fetch your options' });
    } finally {
      setLoading(false);
    }
  };

  const delistOption = async (optionPubkey: string) => {
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

      const tx = await program.methods
        .delistOption()
        .accounts({
          option: new PublicKey(optionPubkey),
          seller: wallet.publicKey,
        })
        .rpc();

      setMessage({ 
        type: 'success', 
        text: `Option delisted successfully! Transaction: ${tx.slice(0, 8)}...` 
      });
      
      setTimeout(() => {
        fetchMyOptions();
      }, 2000);

    } catch (error: any) {
      console.error('Error delisting option:', error);
      setMessage({ 
        type: 'error', 
        text: `Failed to delist option: ${error.message || 'Unknown error'}` 
      });
    } finally {
      setLoading(false);
    }
  };

  const exerciseOption = async () => {
    if (!selectedOption || !wallet.publicKey || !wallet.signTransaction) return;

    setLoading(true);
    setMessage(null);

    try {
      const provider = new AnchorProvider(
        connection,
        wallet as any,
        { commitment: 'confirmed' }
      );
      
      const program = new Program(idl as any, provider);

      const assetPriceUsd = new anchor.BN(parseFloat(assetPrice) * 1e6);
      const solPriceUsd = new anchor.BN(parseFloat(solPrice) * 1e6);

      const tx = await program.methods
        .exerciseOption(assetPriceUsd, solPriceUsd)
        .accounts({
          option: new PublicKey(selectedOption.publicKey),
          owner: wallet.publicKey,
        })
        .rpc();

      setMessage({ 
        type: 'success', 
        text: `Option exercised successfully! Transaction: ${tx.slice(0, 8)}...` 
      });
      
      setShowExerciseModal(false);
      setSelectedOption(null);
      
      setTimeout(() => {
        fetchMyOptions();
      }, 2000);

    } catch (error: any) {
      console.error('Error exercising option:', error);
      setMessage({ 
        type: 'error', 
        text: `Failed to exercise option: ${error.message || 'Unknown error'}` 
      });
    } finally {
      setLoading(false);
    }
  };

  const resellOption = async () => {
    if (!selectedOption || !wallet.publicKey || !wallet.signTransaction) return;

    setMessage({ type: 'info', text: 'Resell functionality requires a new buyer to sign the transaction' });
    setShowResellModal(false);
  };

  useEffect(() => {
    if (wallet.connected) {
      fetchMyOptions();
    }
  }, [wallet.connected]);

  if (!wallet.connected) {
    return (
      <div className="fade-in">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">My Portfolio</h2>
          </div>
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)' }}>
              Please connect your wallet to view your portfolio
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
          <h2 className="card-title">My Portfolio</h2>
          <button 
            onClick={fetchMyOptions} 
            className="btn btn-secondary"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {message && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        {loading && !message ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : myOptions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.6)' }}>
            <p style={{ fontSize: '1.2rem' }}>You don't have any options yet</p>
            <p style={{ marginTop: '1rem' }}>Create or purchase options to get started!</p>
          </div>
        ) : (
          <div className="grid">
            {myOptions.map((option) => {
              const isOwner = option.owner === wallet.publicKey?.toString();
              const isSeller = option.seller === wallet.publicKey?.toString();
              const daysUntilExpiry = Math.ceil((option.expiryDate * 1000 - Date.now()) / (1000 * 60 * 60 * 24));
              
              return (
                <div key={option.publicKey} className="option-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span className={`option-type ${option.optionType === 0 ? 'call' : 'put'}`}>
                      {option.optionType === 0 ? 'CALL' : 'PUT'}
                    </span>
                    <span className={`status-badge status-${option.status.toLowerCase()}`}>
                      {option.status.toUpperCase()}
                    </span>
                  </div>

                  <h3 style={{ 
                    color: 'var(--neon-cyan)', 
                    marginBottom: '0.5rem',
                    fontSize: '1.5rem',
                    fontFamily: 'Orbitron, monospace'
                  }}>
                    {option.underlying}
                  </h3>

                  <p style={{ 
                    color: isOwner ? 'var(--neon-green)' : 'var(--neon-magenta)', 
                    fontSize: '0.9rem',
                    marginBottom: '1rem',
                    fontWeight: 600
                  }}>
                    {isOwner ? '● You Own This Option' : '● You Sold This Option'}
                  </p>

                  <div className="option-details">
                    <div className="option-row">
                      <span className="option-label">Premium Paid:</span>
                      <span className="option-value">{option.price.toFixed(3)} SOL</span>
                    </div>
                    <div className="option-row">
                      <span className="option-label">Strike Ratio:</span>
                      <span className="option-value">{option.strike.toFixed(3)}</span>
                    </div>
                    <div className="option-row">
                      <span className="option-label">Days Until Expiry:</span>
                      <span className="option-value" style={{ 
                        color: daysUntilExpiry < 7 ? '#ff0066' : '#ffffff' 
                      }}>
                        {daysUntilExpiry} days
                      </span>
                    </div>
                    {isOwner && (
                      <>
                        <div className="option-row">
                          <span className="option-label">Your Margin:</span>
                          <span className="option-value">{option.buyerMargin.toFixed(3)} SOL</span>
                        </div>
                      </>
                    )}
                    {isSeller && (
                      <>
                        <div className="option-row">
                          <span className="option-label">Your Margin:</span>
                          <span className="option-value">{option.sellerMargin.toFixed(3)} SOL</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                    {option.status === 'listed' && isSeller && (
                      <button
                        className="btn btn-danger"
                        onClick={() => delistOption(option.publicKey)}
                        disabled={loading}
                        style={{ width: '100%' }}
                      >
                        Delist Option
                      </button>
                    )}
                    
                    {option.status === 'owned' && isOwner && (
                      <>
                        <button
                          className="btn btn-success"
                          onClick={() => {
                            setSelectedOption(option);
                            setShowExerciseModal(true);
                          }}
                          disabled={loading || daysUntilExpiry > 0}
                          style={{ width: '100%' }}
                        >
                          {daysUntilExpiry > 0 ? `Exercise in ${daysUntilExpiry} days` : 'Exercise Option'}
                        </button>
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            setSelectedOption(option);
                            setShowResellModal(true);
                          }}
                          disabled={loading}
                          style={{ width: '100%' }}
                        >
                          Resell Option
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Exercise Modal */}
      {showExerciseModal && selectedOption && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '1rem'
        }}>
          <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
            <h3 style={{ color: 'var(--neon-cyan)', marginBottom: '1.5rem' }}>
              Exercise Option
            </h3>
            
            <div className="form-group">
              <label className="form-label">Asset Price (USD with 6 decimals)</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g., 228.75"
                value={assetPrice}
                onChange={(e) => setAssetPrice(e.target.value)}
                step="0.000001"
              />
            </div>

            <div className="form-group">
              <label className="form-label">SOL Price (USD with 6 decimals)</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g., 152.50"
                value={solPrice}
                onChange={(e) => setSolPrice(e.target.value)}
                step="0.000001"
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button
                className="btn btn-success"
                onClick={exerciseOption}
                disabled={loading || !assetPrice || !solPrice}
                style={{ flex: 1 }}
              >
                {loading ? 'Processing...' : 'Confirm Exercise'}
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  setShowExerciseModal(false);
                  setSelectedOption(null);
                }}
                disabled={loading}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resell Modal */}
      {showResellModal && selectedOption && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '1rem'
        }}>
          <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
            <h3 style={{ color: 'var(--neon-cyan)', marginBottom: '1.5rem' }}>
              Resell Option
            </h3>
            
            <div className="alert alert-info">
              Reselling requires coordination with a new buyer who must sign the transaction.
            </div>

            <div className="form-group">
              <label className="form-label">Resell Price (SOL)</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g., 2.5"
                value={resellPrice}
                onChange={(e) => setResellPrice(e.target.value)}
                step="0.01"
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button
                className="btn btn-primary"
                onClick={resellOption}
                disabled={loading || !resellPrice}
                style={{ flex: 1 }}
              >
                List for Resale
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  setShowResellModal(false);
                  setSelectedOption(null);
                }}
                disabled={loading}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOptions;
