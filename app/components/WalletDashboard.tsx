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

interface WalletDashboardProps {
  wallet: Wallet;
  seedPhrase: string;
  availableWallets?: Wallet[];
  onWalletChange?: (wallet: Wallet) => void;
  onLogout?: () => void;
}

export default function WalletDashboard({ wallet, seedPhrase, availableWallets, onWalletChange, onLogout }: WalletDashboardProps) {
  const [accounts, setAccounts] = useState<Account[]>(wallet.accounts || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newAccountName, setNewAccountName] = useState('');
  const [copiedKey, setCopiedKey] = useState<string>('');

  const copyToClipboard = async (text: string, keyId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(keyId);
      setTimeout(() => setCopiedKey(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const addAccount = async () => {
    if (!newAccountName.trim()) {
      setError('Please enter an account name');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletId: wallet.id,
          name: newAccountName,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAccounts([...accounts, data.account]);
        setNewAccountName('');
      } else {
        setError(data.error || 'Failed to create account');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (accountId: string) => {
    if (!confirm('Are you sure you want to delete this account?')) {
      return;
    }

    try {
      const response = await fetch(`/api/account?accountId=${accountId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setAccounts(accounts.filter(account => account.id !== accountId));
      } else {
        setError(data.error || 'Failed to delete account');
      }
    } catch {
      setError('Network error. Please try again.');
    }
  };

  const getBlockchainIcon = () => {
    return wallet.blockchain === 'solana' ? '🟣' : '🔷';
  };

  const formatPublicKey = (key: string) => {
    if (key.length <= 12) return key;
    return `${key.slice(0, 6)}...${key.slice(-6)}`;
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            {getBlockchainIcon()} {wallet.name}
          </h2>
          <p className="text-gray-600 capitalize">{wallet.blockchain} Wallet</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Accounts</p>
            <p className="text-2xl font-bold text-blue-600">{accounts.length}</p>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Wallet Switcher - only show if multiple wallets available */}
      {availableWallets && availableWallets.length > 1 && (
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Switch Wallet</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableWallets.map((availableWallet) => (
              <button
                key={availableWallet.id}
                onClick={() => onWalletChange?.(availableWallet)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  availableWallet.id === wallet.id
                    ? 'border-blue-500 bg-blue-100'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {availableWallet.blockchain === 'solana' ? '🟣' : '🔷'}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-800">{availableWallet.name}</p>
                    <p className="text-sm text-gray-600 capitalize">
                      {availableWallet.blockchain} • {availableWallet.accounts.length} accounts
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add New Account Section */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Add New Account</h3>
        <div className="flex space-x-3">
          <input
            type="text"
            value={newAccountName}
            onChange={(e) => setNewAccountName(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            placeholder="Account name (e.g., Main Account)"
          />
          <button
            onClick={addAccount}
            disabled={loading || !newAccountName.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : '+ Add'}
          </button>
        </div>
        {error && (
          <div className="text-red-600 text-sm mt-2">{error}</div>
        )}
      </div>

      {/* Accounts List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Your Accounts</h3>
        
        {accounts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No accounts yet. Create your first account above!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {accounts.map((account) => (
              <div key={account.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h4 className="text-lg font-medium text-gray-800">{account.name}</h4>
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Account #{account.accountIndex}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Public Key / Address
                        </label>
                        <div 
                          className="flex items-center space-x-2 p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                          onClick={() => copyToClipboard(account.publicKey, account.id)}
                          title="Click to copy"
                        >
                          <code className="text-sm font-mono text-gray-800 flex-1">
                            {formatPublicKey(account.publicKey)}
                          </code>
                          <button className="text-blue-600 hover:text-blue-800">
                            {copiedKey === account.id ? '✓' : '📋'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => deleteAccount(account.id)}
                    className="ml-4 text-red-600 hover:text-red-800 text-sm"
                    title="Delete account"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Seed Phrase Section */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Backup Information</h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <span className="text-yellow-600 mr-2">⚠️</span>
            <span className="font-semibold text-yellow-800">Your Seed Phrase</span>
          </div>
          <p className="text-yellow-700 text-sm mb-3">
            Keep this seed phrase safe. It&apos;s the master key to all your accounts.
          </p>
          <div 
            className="bg-white p-3 rounded border cursor-pointer hover:bg-gray-50"
            onClick={() => copyToClipboard(seedPhrase, 'seedPhrase')}
            title="Click to copy"
          >
            <code className="text-sm font-mono text-gray-800">
              {seedPhrase}
            </code>
            <span className="ml-2 text-blue-600">
              {copiedKey === 'seedPhrase' ? '✓ Copied!' : '📋 Click to copy'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
