'use client';

import { useState } from 'react';
import PasswordSetup from './components/PasswordSetup';
import SeedPhraseDisplay from './components/SeedPhraseDisplay';
import WalletSelection from './components/WalletSelection';
import WalletDashboard from './components/WalletDashboard';

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

export default function Home() {
  const [step, setStep] = useState<'password' | 'seedPhrase' | 'walletSelect' | 'dashboard'>('password');
  const [userId, setUserId] = useState<string>('');
  const [seedPhrase, setSeedPhrase] = useState<string>('');
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);

  const handlePasswordSetup = (id: string, phrase: string) => {
    setUserId(id);
    setSeedPhrase(phrase);
    setStep('seedPhrase');
  };

  const handleSeedPhraseConfirmed = () => {
    setStep('walletSelect');
  };

  const handleWalletSelected = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    setStep('dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Web3 HD Wallet</h1>
          <p className="text-gray-300">Secure multi-blockchain wallet management</p>
        </div>
        
        {step === 'password' && (
          <PasswordSetup onSetupComplete={handlePasswordSetup} />
        )}
        
        {step === 'seedPhrase' && (
          <SeedPhraseDisplay 
            seedPhrase={seedPhrase} 
            onConfirmed={handleSeedPhraseConfirmed} 
          />
        )}
        
        {step === 'walletSelect' && (
          <WalletSelection 
            userId={userId} 
            onWalletSelected={handleWalletSelected} 
          />
        )}
        
        {step === 'dashboard' && selectedWallet && (
          <WalletDashboard 
            wallet={selectedWallet} 
            seedPhrase={seedPhrase}
          />
        )}
      </div>
    </div>
  );
}
