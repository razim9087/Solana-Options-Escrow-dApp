import React, { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import CreateOption from './CreateOption';
import OptionsList from './OptionsList';
import MyOptions from './MyOptions';

const OptionsTrading: FC = () => {
  const { connected } = useWallet();
  const [activeTab, setActiveTab] = useState<'create' | 'browse' | 'my-options'>('browse');

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <header style={{
        background: 'white',
        borderRadius: '12px',
        padding: '20px 32px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ margin: 0, color: '#667eea', fontSize: '28px' }}>
            🚀 Solana Options Escrow DApp
          </h1>
          <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '14px' }}>
            Decentralized Options Trading Platform
          </p>
        </div>
        <WalletMultiButton />
      </header>

      {!connected ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h2 style={{ marginBottom: '16px' }}>Welcome to Solana Options Escrow</h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            Connect your Solana wallet to start trading options
          </p>
          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            justifyContent: 'center',
            flexWrap: 'wrap',
            margin: '32px 0'
          }}>
            <div style={{ 
              padding: '24px', 
              background: '#f8f9fa', 
              borderRadius: '8px',
              minWidth: '200px'
            }}>
              <h3 style={{ color: '#667eea', marginBottom: '12px' }}>📊 Create Options</h3>
              <p style={{ fontSize: '14px', color: '#666' }}>
                List Call and Put options for others to purchase
              </p>
            </div>
            <div style={{ 
              padding: '24px', 
              background: '#f8f9fa', 
              borderRadius: '8px',
              minWidth: '200px'
            }}>
              <h3 style={{ color: '#667eea', marginBottom: '12px' }}>💰 Trade Options</h3>
              <p style={{ fontSize: '14px', color: '#666' }}>
                Browse and purchase available options contracts
              </p>
            </div>
            <div style={{ 
              padding: '24px', 
              background: '#f8f9fa', 
              borderRadius: '8px',
              minWidth: '200px'
            }}>
              <h3 style={{ color: '#667eea', marginBottom: '12px' }}>⚡ Manage</h3>
              <p style={{ fontSize: '14px', color: '#666' }}>
                Exercise, resell, or monitor your options
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div style={{ 
            background: 'white',
            borderRadius: '12px',
            padding: '12px',
            marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            gap: '12px'
          }}>
            <button
              onClick={() => setActiveTab('browse')}
              style={{
                flex: 1,
                padding: '16px',
                background: activeTab === 'browse' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8f9fa',
                color: activeTab === 'browse' ? 'white' : '#666',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              📈 Browse Options
            </button>
            <button
              onClick={() => setActiveTab('create')}
              style={{
                flex: 1,
                padding: '16px',
                background: activeTab === 'create' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8f9fa',
                color: activeTab === 'create' ? 'white' : '#666',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              ➕ Create Option
            </button>
            <button
              onClick={() => setActiveTab('my-options')}
              style={{
                flex: 1,
                padding: '16px',
                background: activeTab === 'my-options' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8f9fa',
                color: activeTab === 'my-options' ? 'white' : '#666',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              💼 My Options
            </button>
          </div>

          {activeTab === 'create' && <CreateOption />}
          {activeTab === 'browse' && <OptionsList />}
          {activeTab === 'my-options' && <MyOptions />}
        </>
      )}
    </div>
  );
};

export default OptionsTrading;
