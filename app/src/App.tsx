import React, { useMemo, useState } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import {
  WalletModalProvider,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import Dashboard from './components/Dashboard';
import CreateOption from './components/CreateOption';
import OptionsList from './components/OptionsList';
import MyOptions from './components/MyOptions';
import './App.css';
import '@solana/wallet-adapter-react-ui/styles.css';

type Page = 'dashboard' | 'create' | 'marketplace' | 'portfolio';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
    ],
    []
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'create':
        return <CreateOption />;
      case 'marketplace':
        return <OptionsList />;
      case 'portfolio':
        return <MyOptions />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="app-container">
            <header className="header">
              <div className="logo">SOLANA OPTIONS</div>
              <nav>
                <ul className="nav-links">
                  <li>
                    <span
                      className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
                      onClick={() => setCurrentPage('dashboard')}
                    >
                      Dashboard
                    </span>
                  </li>
                  <li>
                    <span
                      className={`nav-link ${currentPage === 'marketplace' ? 'active' : ''}`}
                      onClick={() => setCurrentPage('marketplace')}
                    >
                      Marketplace
                    </span>
                  </li>
                  <li>
                    <span
                      className={`nav-link ${currentPage === 'create' ? 'active' : ''}`}
                      onClick={() => setCurrentPage('create')}
                    >
                      Create Option
                    </span>
                  </li>
                  <li>
                    <span
                      className={`nav-link ${currentPage === 'portfolio' ? 'active' : ''}`}
                      onClick={() => setCurrentPage('portfolio')}
                    >
                      My Portfolio
                    </span>
                  </li>
                </ul>
              </nav>
              <WalletMultiButton />
            </header>
            <main className="main-content">
              {renderPage()}
            </main>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;