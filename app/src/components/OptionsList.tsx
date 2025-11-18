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
}

const OptionsList: React.FC = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [options, setOptions] = useState<OptionAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'call' | 'put'>('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const fetchOptions = async () => {
    if (!wallet.publicKey) return;

    setLoading(true);
    try {
      const provider = new AnchorProvider(
        connection,
        wallet as any,
        { commitment: 'confirmed' }
      );
      
      const program: any = new Program(idl as any, provider);
      
      // Fetch all option accounts
      const accounts = await program.account.optionContract.all();
      
      const optionsList = accounts.map((account: any) => ({
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
      }));

      setOptions(optionsList);
    } catch (error) {
      console.error('Error fetching options:', error);
      setMessage({ type: 'error', text: 'Failed to fetch options from blockchain' });
    } finally {
      setLoading(false);
    }
  };

  const purchaseOption = async (optionPubkey: string, seller: string, price: number, margin: number) => {
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
        .purchaseOption()
        .accounts({
          option: new PublicKey(optionPubkey),
          buyer: wallet.publicKey,
          seller: new PublicKey(seller),
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      setMessage({ 
        type: 'success', 
        text: `Option purchased successfully! Transaction: ${tx.slice(0, 8)}...` 
      });
      
      // Refresh the list
      setTimeout(() => {
        fetchOptions();
      }, 2000);

    } catch (error: any) {
      console.error('Error purchasing option:', error);
      setMessage({ 
        type: 'error', 
        text: `Failed to purchase option: ${error.message || 'Unknown error'}` 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (wallet.connected) {
      fetchOptions();
    }
  }, [wallet.connected]);

  const filteredOptions = options.filter(option => {
    if (filter === 'all') return option.status === 'listed';
    if (filter === 'call') return option.optionType === 0 && option.status === 'listed';
    if (filter === 'put') return option.optionType === 1 && option.status === 'listed';
    return false;
  });

  if (!wallet.connected) {
    return (
      <div className="fade-in">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Options Marketplace</h2>
          </div>
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)' }}>
              Please connect your wallet to view available options
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
          <h2 className="card-title">Options Marketplace</h2>
          <button 
            onClick={fetchOptions} 
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

        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
          <button
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('all')}
            style={{ flex: 1 }}
          >
            All Options
          </button>
          <button
            className={`btn ${filter === 'call' ? 'btn-success' : 'btn-secondary'}`}
            onClick={() => setFilter('call')}
            style={{ flex: 1 }}
          >
            Call Options
          </button>
          <button
            className={`btn ${filter === 'put' ? 'btn-danger' : 'btn-secondary'}`}
            onClick={() => setFilter('put')}
            style={{ flex: 1 }}
          >
            Put Options
          </button>
        </div>

        {loading && !message ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : filteredOptions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.6)' }}>
            <p style={{ fontSize: '1.2rem' }}>No options available in the marketplace</p>
            <p style={{ marginTop: '1rem' }}>Be the first to create an option!</p>
          </div>
        ) : (
          <div className="grid">
            {filteredOptions.map((option) => (
              <div key={option.publicKey} className="option-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className={`option-type ${option.optionType === 0 ? 'call' : 'put'}`}>
                    {option.optionType === 0 ? 'CALL' : 'PUT'}
                  </span>
                  <span className="status-badge status-listed">
                    {option.status.toUpperCase()}
                  </span>
                </div>

                <h3 style={{ 
                  color: 'var(--neon-cyan)', 
                  marginBottom: '1rem',
                  fontSize: '1.5rem',
                  fontFamily: 'Orbitron, monospace'
                }}>
                  {option.underlying}
                </h3>

                <div className="option-details">
                  <div className="option-row">
                    <span className="option-label">Premium:</span>
                    <span className="option-value">{option.price.toFixed(3)} SOL</span>
                  </div>
                  <div className="option-row">
                    <span className="option-label">Strike Ratio:</span>
                    <span className="option-value">{option.strike.toFixed(3)}</span>
                  </div>
                  <div className="option-row">
                    <span className="option-label">Margin Required:</span>
                    <span className="option-value">{option.initialMargin.toFixed(3)} SOL</span>
                  </div>
                  <div className="option-row">
                    <span className="option-label">Total Cost:</span>
                    <span className="option-value" style={{ color: 'var(--neon-magenta)' }}>
                      {(option.price + option.initialMargin).toFixed(3)} SOL
                    </span>
                  </div>
                  <div className="option-row">
                    <span className="option-label">Expiry:</span>
                    <span className="option-value">
                      {new Date(option.expiryDate * 1000).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <button
                  className={`btn ${option.optionType === 0 ? 'btn-success' : 'btn-danger'}`}
                  onClick={() => purchaseOption(option.publicKey, option.seller, option.price, option.initialMargin)}
                  disabled={loading || option.seller === wallet.publicKey?.toString()}
                  style={{ width: '100%', marginTop: '1rem' }}
                >
                  {option.seller === wallet.publicKey?.toString() 
                    ? 'Your Option' 
                    : 'Purchase Option'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OptionsList;
