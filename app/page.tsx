'use client';

import { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import SeedPhraseImport from './components/SeedPhraseImport';
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
  const [step, setStep] = useState<'welcome' | 'import' | 'seedPhrase' | 'walletSelect' | 'dashboard'>('welcome');
  const [userId, setUserId] = useState<string>('');
  const [seedPhrase, setSeedPhrase] = useState<string>('');
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [importedWallets, setImportedWallets] = useState<Wallet[]>([]);

  const handleWelcomeChoice = (choice: 'import' | 'create') => {
    if (choice === 'create') {
      setStep('seedPhrase');
    } else {
      setStep(choice);
    }
  };

  const handleImportSuccess = (phrase: string, existingWallets: Wallet[], userId?: string) => {
    setSeedPhrase(phrase);
    setImportedWallets(existingWallets);
    
    if (userId) {
      setUserId(userId);
    }
    
    if (existingWallets.length > 0) {
      // If wallets exist, go directly to dashboard with the first wallet
      setSelectedWallet(existingWallets[0]);
      setStep('dashboard');
    } else {
      // If no existing wallets, go to wallet selection to create new ones
      setStep('walletSelect');
    }
  };

  const handleSeedPhraseConfirmed = (userId: string, phrase: string) => {
    setUserId(userId);
    setSeedPhrase(phrase);
    setStep('walletSelect');
  };

  const handleWalletSelected = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    setStep('dashboard');
  };

  const handleWalletChange = (wallet: Wallet) => {
    setSelectedWallet(wallet);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Web3 HD Wallet</h1>
          <p className="text-gray-300">Secure multi-blockchain wallet management</p>
        </div>
        
        {step === 'welcome' && (
          <WelcomeScreen onChoice={handleWelcomeChoice} />
        )}
        
        {step === 'import' && (
          <SeedPhraseImport 
            onImportSuccess={handleImportSuccess} 
          />
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
            availableWallets={importedWallets.length > 0 ? importedWallets : undefined}
            onWalletChange={handleWalletChange}
          />
        )}
      </div>
    </div>
  );
}
