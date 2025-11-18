import React, { FC, useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { getProgram, purchaseOption, formatLamportsToSol, formatTimestamp, getOptionTypeLabel, getStatusLabel } from '../utils/anchorClient';

interface OptionData {
  publicKey: PublicKey;
  account: any;
}

const OptionsList: FC = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  
  const [options, setOptions] = useState<OptionData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);

  const fetchOptions = async () => {
    if (!wallet.publicKey) return;

    setLoading(true);
    try {
      const program = getProgram(connection, wallet as any);
      const allOptions = await program.account.optionContract.all();
      
      // Filter for listed options only
      const listedOptions = allOptions.filter(opt => opt.account.status.listed);
      setOptions(listedOptions as OptionData[]);
    } catch (error) {
      console.error('Error fetching options:', error);
      setMessage({ type: 'error', text: 'Failed to fetch options' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (wallet.publicKey) {
      fetchOptions();
    }
  }, [wallet.publicKey]);

  const handlePurchase = async (option: OptionData) => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      setMessage({ type: 'error', text: 'Please connect your wallet' });
      return;
    }

    setPurchasing(option.publicKey.toString());
    setMessage(null);

    try {
      const program = getProgram(connection, wallet as any);
      const tx = await purchaseOption(
        program,
        option.publicKey,
        wallet.publicKey,
        option.account.seller
      );

      setMessage({ 
        type: 'success', 
        text: `Option purchased successfully! Transaction: ${tx.slice(0, 8)}...${tx.slice(-8)}` 
      });
      
      // Refresh options list
      await fetchOptions();
    } catch (error: any) {
      console.error('Error purchasing option:', error);
      setMessage({ 
        type: 'error', 
        text: `Failed to purchase option: ${error.message || 'Unknown error'}` 
      });
    } finally {
      setPurchasing(null);
    }
  };

  if (!wallet.publicKey) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <p>Please connect your wallet to view available options</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0 }}>Available Options</h2>
            <p style={{ color: '#666', margin: '8px 0 0 0' }}>
              Browse and purchase listed option contracts
            </p>
          </div>
          <button
            className="btn-secondary"
            onClick={fetchOptions}
            disabled={loading}
          >
            {loading ? 'Loading...' : '🔄 Refresh'}
          </button>
        </div>

        {message && (
          <div className={`message message-${message.type}`} style={{ marginTop: '16px' }}>
            {message.text}
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading">Loading options...</div>
      ) : options.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h3 style={{ color: '#666' }}>No options available</h3>
          <p style={{ color: '#999' }}>Be the first to create an option contract!</p>
        </div>
      ) : (
        <div className="options-grid">
          {options.map((option) => (
            <div key={option.publicKey.toString()} className="option-card">
              <div className="option-header">
                <div className="option-type">
                  {getOptionTypeLabel(option.account.optionType)} Option
                </div>
                <span className={`status-badge status-${getStatusLabel(option.account.status).toLowerCase()}`}>
                  {getStatusLabel(option.account.status)}
                </span>
              </div>

              <div style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: '#333', 
                marginBottom: '16px' 
              }}>
                {option.account.underlying}
              </div>

              <div className="option-details">
                <div className="option-detail">
                  <span className="detail-label">Premium</span>
                  <span className="detail-value">
                    {formatLamportsToSol(option.account.price)} SOL
                  </span>
                </div>
                <div className="option-detail">
                  <span className="detail-label">Strike Ratio</span>
                  <span className="detail-value">
                    {formatLamportsToSol(option.account.strike)}
                  </span>
                </div>
                <div className="option-detail">
                  <span className="detail-label">Margin Required</span>
                  <span className="detail-value">
                    {formatLamportsToSol(option.account.initialMargin)} SOL
                  </span>
                </div>
                <div className="option-detail">
                  <span className="detail-label">Expiry Date</span>
                  <span className="detail-value" style={{ fontSize: '12px' }}>
                    {formatTimestamp(option.account.expiryDate)}
                  </span>
                </div>
                <div className="option-detail">
                  <span className="detail-label">Seller</span>
                  <span className="detail-value" style={{ fontSize: '11px' }}>
                    {option.account.seller.toString().slice(0, 4)}...
                    {option.account.seller.toString().slice(-4)}
                  </span>
                </div>
              </div>

              <button
                className="btn-primary"
                onClick={() => handlePurchase(option)}
                disabled={purchasing === option.publicKey.toString() || wallet.publicKey?.equals(option.account.seller)}
                style={{ width: '100%', marginTop: '16px' }}
              >
                {purchasing === option.publicKey.toString() 
                  ? 'Purchasing...' 
                  : wallet.publicKey?.equals(option.account.seller)
                  ? 'You own this'
                  : '💰 Purchase Option'}
              </button>

              <div style={{ 
                marginTop: '12px', 
                padding: '8px', 
                background: '#f8f9fa', 
                borderRadius: '4px',
                fontSize: '12px',
                color: '#666'
              }}>
                <strong>Total Cost:</strong> {
                  formatLamportsToSol(
                    option.account.price.add(option.account.initialMargin)
                  )
                } SOL (Premium + Margin)
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OptionsList;
