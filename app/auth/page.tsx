'use client';

import { useState } from 'react';
import WelcomeScreen from '../components/WelcomeScreen';
import SeedPhraseImport from '../components/SeedPhraseImport';
import SeedPhraseDisplay from '../components/SeedPhraseDisplay';
import WalletSelection from '../components/WalletSelection';
import WalletDashboard from '../components/WalletDashboard';
import AppLayout from '../components/AppLayout';

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

export default function AuthFlow() {
  const [step, setStep] = useState<'welcome' | 'import' | 'create' | 'walletSelect' | 'dashboard'>('welcome');
  const [seedPhrase, setSeedPhrase] = useState('');
  const [userId, setUserId] = useState('');
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [importedWallets, setImportedWallets] = useState<Wallet[]>([]);

  const handleWelcomeChoice = (choice: 'import' | 'create') => {
    setStep(choice);
  };

  const handleImportSuccess = (phrase: string, existingWallets: Wallet[], userId?: string) => {
    setSeedPhrase(phrase);
    setImportedWallets(existingWallets);
    
    if (userId) {
      setUserId(userId);
    }
    
    if (existingWallets.length > 0) {
      // If wallets exist, go directly to dashboard with first wallet
      setSelectedWallet(existingWallets[0]);
      setStep('dashboard');
    } else {
      // No existing wallets, proceed to wallet creation
      setStep('walletSelect');
    }
  };

  const handleSeedPhraseConfirmed = (userId: string, phrase: string) => {
    setUserId(userId);
    setSeedPhrase(phrase);
    setStep('walletSelect');
  };

  const handleWalletSelected = (wallet: Wallet) => {
    // Go to dashboard with selected wallet
    setSelectedWallet(wallet);
    setStep('dashboard');
  };

  const handleWalletChange = (wallet: Wallet) => {
    setSelectedWallet(wallet);
  };

  const handleLogout = () => {
    // Reset all state and go back to welcome
    setSeedPhrase('');
    setUserId('');
    setSelectedWallet(null);
    setImportedWallets([]);
    setStep('welcome');
  };

  return (
    <AppLayout>
      {step === 'welcome' && (
        <WelcomeScreen onChoice={handleWelcomeChoice} />
      )}
      
      {step === 'import' && (
        <SeedPhraseImport onImportSuccess={handleImportSuccess} />
      )}
      
      {step === 'create' && (
        <SeedPhraseDisplay 
          seedPhrase="" 
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
          availableWallets={importedWallets}
          onWalletChange={handleWalletChange}
          onLogout={handleLogout}
        />
      )}
    </AppLayout>
  );
}
