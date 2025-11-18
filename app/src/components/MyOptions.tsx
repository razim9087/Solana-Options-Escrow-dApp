import React, { FC, useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { 
  getProgram, 
  exerciseOption, 
  delistOption,
  dailySettlement,
  formatLamportsToSol, 
  formatTimestamp, 
  getOptionTypeLabel, 
  getStatusLabel 
} from '../utils/anchorClient';

interface OptionData {
  publicKey: PublicKey;
  account: any;
}

const MyOptions: FC = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  
  const [ownedOptions, setOwnedOptions] = useState<OptionData[]>([]);
  const [createdOptions, setCreatedOptions] = useState<OptionData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
  const [showSettlementForm, setShowSettlementForm] = useState<string | null>(null);
  const [assetPrice, setAssetPrice] = useState<string>('');
  const [solPrice, setSolPrice] = useState<string>('');

  const fetchMyOptions = async () => {
    if (!wallet.publicKey) return;

    setLoading(true);
    try {
      const program = getProgram(connection, wallet as any);
      const allOptions = await program.account.optionContract.all();
      
      // Options owned by user (as buyer)
      const owned = allOptions.filter(opt => 
        opt.account.owner.equals(wallet.publicKey!) && opt.account.status.owned
      );
      
      // Options created by user (as seller)
      const created = allOptions.filter(opt => 
        opt.account.seller.equals(wallet.publicKey!)
      );
      
      setOwnedOptions(owned as OptionData[]);
      setCreatedOptions(created as OptionData[]);
    } catch (error) {
      console.error('Error fetching options:', error);
      setMessage({ type: 'error', text: 'Failed to fetch your options' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (wallet.publicKey) {
      fetchMyOptions();
    }
  }, [wallet.publicKey]);

  const handleExercise = async (option: OptionData) => {
    if (!wallet.publicKey || !wallet.signTransaction) return;

    // Show settlement form to get prices
    setShowSettlementForm(option.publicKey.toString());
  };

  const handleExerciseSubmit = async (option: OptionData) => {
    if (!wallet.publicKey || !wallet.signTransaction) return;
    if (!assetPrice || !solPrice) {
      setMessage({ type: 'error', text: 'Please enter both asset and SOL prices' });
      return;
    }

    setActionLoading(option.publicKey.toString());
    setMessage(null);

    try {
      const program = getProgram(connection, wallet as any);
      const assetPriceUsd = new BN(parseFloat(assetPrice) * 1e6); // 6 decimals
      const solPriceUsd = new BN(parseFloat(solPrice) * 1e6); // 6 decimals

      const tx = await exerciseOption(
        program,
        option.publicKey,
        assetPriceUsd,
        solPriceUsd,
        wallet.publicKey
      );

      setMessage({ 
        type: 'success', 
        text: `Option exercised! Transaction: ${tx.slice(0, 8)}...${tx.slice(-8)}` 
      });
      
      setShowSettlementForm(null);
      setAssetPrice('');
      setSolPrice('');
      await fetchMyOptions();
    } catch (error: any) {
      console.error('Error exercising option:', error);
      setMessage({ 
        type: 'error', 
        text: `Failed to exercise: ${error.message || 'Unknown error'}` 
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelist = async (option: OptionData) => {
    if (!wallet.publicKey || !wallet.signTransaction) return;

    setActionLoading(option.publicKey.toString());
    setMessage(null);

    try {
      const program = getProgram(connection, wallet as any);
      const tx = await delistOption(program, option.publicKey, wallet.publicKey);

      setMessage({ 
        type: 'success', 
        text: `Option delisted! Transaction: ${tx.slice(0, 8)}...${tx.slice(-8)}` 
      });
      
      await fetchMyOptions();
    } catch (error: any) {
      console.error('Error delisting option:', error);
      setMessage({ 
        type: 'error', 
        text: `Failed to delist: ${error.message || 'Unknown error'}` 
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleSettlement = async (option: OptionData) => {
    setShowSettlementForm(option.publicKey.toString());
  };

  const handleSettlementSubmit = async (option: OptionData) => {
    if (!wallet.publicKey || !wallet.signTransaction) return;
    if (!assetPrice || !solPrice) {
      setMessage({ type: 'error', text: 'Please enter both asset and SOL prices' });
      return;
    }

    setActionLoading(option.publicKey.toString());
    setMessage(null);

    try {
      const program = getProgram(connection, wallet as any);
      const assetPriceUsd = new BN(parseFloat(assetPrice) * 1e6);
      const solPriceUsd = new BN(parseFloat(solPrice) * 1e6);

      const tx = await dailySettlement(
        program,
        option.publicKey,
        assetPriceUsd,
        solPriceUsd,
        wallet.publicKey
      );

      setMessage({ 
        type: 'success', 
        text: `Settlement completed! Transaction: ${tx.slice(0, 8)}...${tx.slice(-8)}` 
      });
      
      setShowSettlementForm(null);
      setAssetPrice('');
      setSolPrice('');
      await fetchMyOptions();
    } catch (error: any) {
      console.error('Error settling:', error);
      setMessage({ 
        type: 'error', 
        text: `Failed to settle: ${error.message || 'Unknown error'}` 
      });
    } finally {
      setActionLoading(null);
    }
  };

  if (!wallet.publicKey) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <p>Please connect your wallet to view your options</p>
      </div>
    );
  }

  const renderOptionCard = (option: OptionData, isOwned: boolean) => (
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
        {isOwned && (
          <>
            <div className="option-detail">
              <span className="detail-label">Your Margin</span>
              <span className="detail-value">
                {formatLamportsToSol(option.account.buyerMargin)} SOL
              </span>
            </div>
            <div className="option-detail">
              <span className="detail-label">Seller Margin</span>
              <span className="detail-value">
                {formatLamportsToSol(option.account.sellerMargin)} SOL
              </span>
            </div>
          </>
        )}
        <div className="option-detail">
          <span className="detail-label">Expiry Date</span>
          <span className="detail-value" style={{ fontSize: '12px' }}>
            {formatTimestamp(option.account.expiryDate)}
          </span>
        </div>
      </div>

      {showSettlementForm === option.publicKey.toString() ? (
        <div style={{ marginTop: '16px', padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 12px 0' }}>Enter Prices</h4>
          <input
            type="number"
            placeholder="Asset Price (USD)"
            value={assetPrice}
            onChange={(e) => setAssetPrice(e.target.value)}
            style={{ marginBottom: '8px' }}
            step="0.01"
          />
          <input
            type="number"
            placeholder="SOL Price (USD)"
            value={solPrice}
            onChange={(e) => setSolPrice(e.target.value)}
            style={{ marginBottom: '8px' }}
            step="0.01"
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn-success"
              onClick={() => isOwned ? handleExerciseSubmit(option) : handleSettlementSubmit(option)}
              disabled={actionLoading === option.publicKey.toString()}
              style={{ flex: 1 }}
            >
              {actionLoading === option.publicKey.toString() ? 'Processing...' : 'Submit'}
            </button>
            <button
              className="btn-secondary"
              onClick={() => {
                setShowSettlementForm(null);
                setAssetPrice('');
                setSolPrice('');
              }}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexDirection: 'column' }}>
          {isOwned && option.account.status.owned && (
            <>
              <button
                className="btn-success"
                onClick={() => handleExercise(option)}
                disabled={actionLoading === option.publicKey.toString()}
                style={{ width: '100%' }}
              >
                ⚡ Exercise Option
              </button>
              <button
                className="btn-info"
                onClick={() => handleSettlement(option)}
                disabled={actionLoading === option.publicKey.toString()}
                style={{ width: '100%' }}
              >
                📊 Daily Settlement
              </button>
            </>
          )}
          {!isOwned && option.account.status.listed && (
            <button
              className="btn-danger"
              onClick={() => handleDelist(option)}
              disabled={actionLoading === option.publicKey.toString()}
              style={{ width: '100%' }}
            >
              {actionLoading === option.publicKey.toString() ? 'Delisting...' : '🗑️ Delist Option'}
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0 }}>My Options</h2>
            <p style={{ color: '#666', margin: '8px 0 0 0' }}>
              Manage your owned and created options
            </p>
          </div>
          <button
            className="btn-secondary"
            onClick={fetchMyOptions}
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
        <div className="loading">Loading your options...</div>
      ) : (
        <>
          <div className="card">
            <h3>Owned Options (as Buyer)</h3>
            {ownedOptions.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
                You haven't purchased any options yet
              </p>
            ) : (
              <div className="options-grid">
                {ownedOptions.map(option => renderOptionCard(option, true))}
              </div>
            )}
          </div>

          <div className="card">
            <h3>Created Options (as Seller)</h3>
            {createdOptions.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
                You haven't created any options yet
              </p>
            ) : (
              <div className="options-grid">
                {createdOptions.map(option => renderOptionCard(option, false))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MyOptions;
