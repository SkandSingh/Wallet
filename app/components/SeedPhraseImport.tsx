'use client';

import { useState } from 'react';

interface Wallet {
  id: string;
  name: string;
  blockchain: string;
  accounts: Account[];
}

interface Account {
  id: string;
  name: string;
  publicKey: string;
  accountIndex: number;
}

interface SeedPhraseImportProps {
  onImportSuccess: (seedPhrase: string, existingWallets: Wallet[], userId?: string) => void;
}

export default function SeedPhraseImport({ onImportSuccess }: SeedPhraseImportProps) {
  const [seedPhrase, setSeedPhrase] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedPhrase = seedPhrase.trim();
    
    if (!trimmedPhrase) {
      setError('Please enter your seed phrase');
      return;
    }

    const words = trimmedPhrase.split(/\s+/);
    if (words.length !== 12) {
      setError('Seed phrase must be exactly 12 words');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // First validate the seed phrase
      const validateResponse = await fetch('/api/seed-phrase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ seedPhrase: trimmedPhrase }),
      });

      if (!validateResponse.ok) {
        const data = await validateResponse.json();
        setError(data.error || 'Invalid seed phrase');
        return;
      }

      // Then check for existing wallets derived from this seed phrase
      const walletsResponse = await fetch('/api/wallet/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ seedPhrase: trimmedPhrase }),
      });

      const walletsData = await walletsResponse.json();

      if (walletsResponse.ok) {
        onImportSuccess(trimmedPhrase, walletsData.wallets || [], walletsData.userId);
      } else {
        setError(walletsData.error || 'Failed to import wallets');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const paste = e.clipboardData.getData('text');
    setSeedPhrase(paste);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Import Wallet</h2>
          <p className="text-gray-300">Enter your 12-word recovery phrase to restore your wallet</p>
        </div>

        <form onSubmit={handleImport} className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">
              Seed Phrase (12 words)
            </label>
            <textarea
              value={seedPhrase}
              onChange={(e) => setSeedPhrase(e.target.value)}
              onPaste={handlePaste}
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 
                       text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                       focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Enter your 12-word seed phrase separated by spaces..."
              required
            />
            <p className="text-gray-400 text-sm mt-2">
              Word count: {seedPhrase.trim().split(/\s+/).filter(word => word.length > 0).length}/12
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-600/20 border border-red-400/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="p-4 bg-amber-600/20 border border-amber-400/30 rounded-lg">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h4 className="text-amber-400 font-semibold text-sm">Security Warning</h4>
                <p className="text-amber-200 text-xs mt-1">
                  Never share your seed phrase with anyone. Make sure you&apos;re on the correct website and no one is watching your screen.
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || seedPhrase.trim().split(/\s+/).filter(word => word.length > 0).length !== 12}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 
                     text-white font-semibold py-3 px-4 rounded-lg transition-colors 
                     duration-200 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Importing...' : 'Import Wallet'}
          </button>
        </form>
      </div>
    </div>
  );
}
