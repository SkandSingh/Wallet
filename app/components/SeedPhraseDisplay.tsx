'use client';

import { useState, useEffect } from 'react';
import { WalletService } from '../../lib/wallet';

interface SeedPhraseDisplayProps {
  seedPhrase: string;
  onConfirmed: (userId: string, seedPhrase: string) => void;
}

export default function SeedPhraseDisplay({ seedPhrase, onConfirmed }: SeedPhraseDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [displayPhrase, setDisplayPhrase] = useState(seedPhrase);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Generate seed phrase if not provided
  useEffect(() => {
    if (!seedPhrase) {
      const newSeedPhrase = WalletService.generateSeedPhrase();
      setDisplayPhrase(newSeedPhrase);
    }
  }, [seedPhrase]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(displayPhrase);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy seed phrase:', err);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError('');

    try {
      // Create user with the seed phrase
      const response = await fetch('/api/wallet/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          seedPhrase: displayPhrase,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setConfirmed(true);
        onConfirmed(data.userId, displayPhrase);
      } else {
        setError(data.error || 'Failed to create wallet');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const words = displayPhrase.split(' ');

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Seed Phrase</h2>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-center mb-2">
          <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="font-semibold text-yellow-800">Important Security Information</span>
        </div>
        <p className="text-yellow-700 text-sm">
          This seed phrase is the key to your wallet. Store it safely and never share it with anyone. 
          If you lose this phrase, you will lose access to your wallet permanently.
        </p>
      </div>

      <div 
        className="grid grid-cols-3 gap-3 bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors mb-6"
        onClick={copyToClipboard}
        title="Click anywhere to copy"
      >
        {words.map((word, index) => (
          <div key={index} className="bg-white p-3 rounded-md shadow-sm text-center">
            <span className="text-xs text-gray-500 block">{index + 1}</span>
            <span className="font-mono text-gray-800">{word}</span>
          </div>
        ))}
      </div>

      <div className="text-center mb-6">
        <button
          onClick={copyToClipboard}
          className={`px-4 py-2 rounded-md transition-colors ${
            copied 
              ? 'bg-green-600 text-white' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {copied ? '✓ Copied!' : '📋 Copy to Clipboard'}
        </button>
      </div>

      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-600/20 border border-red-400/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700">
            I have safely stored my seed phrase and understand that losing it means losing access to my wallet.
          </span>
        </label>
        
        <div className="space-x-3">
          <button
            onClick={handleConfirm}
            disabled={!confirmed || loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Wallet...' : 'Continue to Wallet Selection'}
          </button>
        </div>
      </div>
    </div>
  );
}
