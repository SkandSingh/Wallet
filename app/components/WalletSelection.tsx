'use client';

import { useState } from 'react';

interface Account {
  id: string;
  name: string;
  publicKey: string;
  accountIndex: number;
}

interface Wallet {
  id: string;
  name: string;
  blockchain: string;
  accounts: Account[];
}

interface WalletSelectionProps {
  userId: string;
  onWalletSelected: (wallet: Wallet) => void;
}

export default function WalletSelection({ userId, onWalletSelected }: WalletSelectionProps) {
  const [selectedBlockchain, setSelectedBlockchain] = useState<'solana' | 'ethereum'>('solana');
  const [walletName, setWalletName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateWallet = async () => {
    if (!walletName.trim()) {
      setError('Please enter a wallet name');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          name: walletName,
          blockchain: selectedBlockchain,
        }),
      });

      const data = await response.json();

      if (data.success) {
        onWalletSelected(data.wallet);
      } else {
        setError(data.error || 'Failed to create wallet');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Choose Your Blockchain</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Blockchain Network
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedBlockchain('solana')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedBlockchain === 'solana'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="font-semibold text-gray-800">Solana</span>
                <p className="text-xs text-gray-600 mt-1">Fast & Low Cost</p>
              </div>
            </button>
            
            <button
              onClick={() => setSelectedBlockchain('ethereum')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedBlockchain === 'ethereum'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <span className="font-semibold text-gray-800">Ethereum</span>
                <p className="text-xs text-gray-600 mt-1">DeFi Ecosystem</p>
              </div>
            </button>
          </div>
        </div>
        
        <div>
          <label htmlFor="walletName" className="block text-sm font-medium text-gray-700 mb-2">
            Wallet Name
          </label>
          <input
            type="text"
            id="walletName"
            value={walletName}
            onChange={(e) => setWalletName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            placeholder="My Wallet"
            required
          />
        </div>
        
        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}
        
        <div className="space-x-3">
          <button
            onClick={handleCreateWallet}
            disabled={loading || !walletName.trim()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Wallet...' : `Create ${selectedBlockchain} Wallet`}
          </button>
        </div>
      </div>
    </div>
  );
}
