import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

const Dashboard: React.FC = () => {
  const { connected, publicKey } = useWallet();

  return (
    <div className="fade-in">
      <div className="hero">
        <h1>DECENTRALIZED OPTIONS TRADING</h1>
        <p>
          Trade European-style Call and Put options on Solana with automated margin management,
          daily settlements, and secondary market liquidity.
        </p>
      </div>

      {!connected ? (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Welcome to Solana Options</h2>
          </div>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: 'rgba(255,255,255,0.8)' }}>
              Connect your wallet to start trading options on Solana
            </p>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '1rem', 
              flexWrap: 'wrap',
              marginTop: '2rem'
            }}>
              <div style={{ 
                padding: '1.5rem', 
                background: 'rgba(0,255,255,0.1)', 
                borderRadius: '10px',
                border: '1px solid rgba(0,255,255,0.3)',
                flex: '1',
                minWidth: '200px'
              }}>
                <h3 style={{ color: 'var(--neon-cyan)', marginBottom: '0.5rem' }}>✓ Secure</h3>
                <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)' }}>
                  PDA-based accounts with built-in protections
                </p>
              </div>
              <div style={{ 
                padding: '1.5rem', 
                background: 'rgba(138,0,255,0.1)', 
                borderRadius: '10px',
                border: '1px solid rgba(138,0,255,0.3)',
                flex: '1',
                minWidth: '200px'
              }}>
                <h3 style={{ color: 'var(--neon-purple)', marginBottom: '0.5rem' }}>✓ Transparent</h3>
                <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)' }}>
                  On-chain settlements and margin tracking
                </p>
              </div>
              <div style={{ 
                padding: '1.5rem', 
                background: 'rgba(255,0,255,0.1)', 
                borderRadius: '10px',
                border: '1px solid rgba(255,0,255,0.3)',
                flex: '1',
                minWidth: '200px'
              }}>
                <h3 style={{ color: 'var(--neon-magenta)', marginBottom: '0.5rem' }}>✓ Liquid</h3>
                <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)' }}>
                  Resell options on secondary market
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Your Wallet</h2>
            </div>
            <div style={{ padding: '1rem' }}>
              <div className="option-row">
                <span className="option-label">Connected Address:</span>
                <span className="option-value" style={{ fontSize: '0.9rem', wordBreak: 'break-all' }}>
                  {publicKey?.toString()}
                </span>
              </div>
            </div>
          </div>

          <div className="grid">
            <div className="card">
              <h3 style={{ 
                color: 'var(--neon-cyan)', 
                marginBottom: '1rem',
                fontSize: '1.5rem',
                fontFamily: 'Orbitron, monospace'
              }}>
                How It Works
              </h3>
              <div style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.8' }}>
                <p style={{ marginBottom: '1rem' }}>
                  <strong style={{ color: 'var(--neon-green)' }}>1. Create Options:</strong> Sellers create Call or Put options by specifying the underlying asset, strike price, premium, and margin requirements.
                </p>
                <p style={{ marginBottom: '1rem' }}>
                  <strong style={{ color: 'var(--neon-cyan)' }}>2. Purchase Options:</strong> Buyers pay the premium and post margin to acquire options from the marketplace.
                </p>
                <p style={{ marginBottom: '1rem' }}>
                  <strong style={{ color: 'var(--neon-magenta)' }}>3. Daily Settlement:</strong> Mark-to-market settlements adjust margins based on price movements with 20% margin call protection.
                </p>
                <p>
                  <strong style={{ color: 'var(--neon-purple)' }}>4. Exercise or Resell:</strong> At expiry, exercise options for profit, or resell them on the secondary market before expiration.
                </p>
              </div>
            </div>

            <div className="card">
              <h3 style={{ 
                color: 'var(--neon-magenta)', 
                marginBottom: '1rem',
                fontSize: '1.5rem',
                fontFamily: 'Orbitron, monospace'
              }}>
                Features
              </h3>
              <div style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.8' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <span style={{ color: 'var(--neon-green)', marginRight: '0.5rem' }}>●</span>
                  <span>European Call & Put Options (30-day term)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <span style={{ color: 'var(--neon-cyan)', marginRight: '0.5rem' }}>●</span>
                  <span>Dual Margin System for risk management</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <span style={{ color: 'var(--neon-magenta)', marginRight: '0.5rem' }}>●</span>
                  <span>Automated Margin Calls (20% threshold)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <span style={{ color: 'var(--neon-purple)', marginRight: '0.5rem' }}>●</span>
                  <span>Daily Mark-to-Market Settlements</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <span style={{ color: 'var(--neon-pink)', marginRight: '0.5rem' }}>●</span>
                  <span>Secondary Market Trading</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: 'var(--neon-blue)', marginRight: '0.5rem' }}>●</span>
                  <span>Multiple Underlying Assets Support</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ 
              color: 'var(--neon-purple)', 
              marginBottom: '1rem',
              fontSize: '1.5rem',
              fontFamily: 'Orbitron, monospace'
            }}>
              Quick Start Guide
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '1.5rem',
              marginTop: '1.5rem'
            }}>
              <div style={{ 
                padding: '1.5rem', 
                background: 'rgba(0,255,255,0.05)', 
                borderRadius: '10px',
                border: '1px solid rgba(0,255,255,0.2)'
              }}>
                <h4 style={{ color: 'var(--neon-cyan)', marginBottom: '0.8rem' }}>
                  Browse Marketplace
                </h4>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
                  View available options, filter by type (Call/Put), and analyze strike prices and premiums.
                </p>
              </div>
              <div style={{ 
                padding: '1.5rem', 
                background: 'rgba(0,255,65,0.05)', 
                borderRadius: '10px',
                border: '1px solid rgba(0,255,65,0.2)'
              }}>
                <h4 style={{ color: 'var(--neon-green)', marginBottom: '0.8rem' }}>
                  Create Your Option
                </h4>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
                  Set up new options with custom parameters including asset pair, strike, and margin.
                </p>
              </div>
              <div style={{ 
                padding: '1.5rem', 
                background: 'rgba(255,0,255,0.05)', 
                borderRadius: '10px',
                border: '1px solid rgba(255,0,255,0.2)'
              }}>
                <h4 style={{ color: 'var(--neon-magenta)', marginBottom: '0.8rem' }}>
                  Manage Portfolio
                </h4>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
                  Track your options, monitor P&L, exercise at expiry, or resell on the market.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
