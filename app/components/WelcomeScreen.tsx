'use client';

interface WelcomeScreenProps {
  onChoice: (choice: 'import' | 'create') => void;
}

export default function WelcomeScreen({ onChoice }: WelcomeScreenProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Welcome to Web3 Wallet</h2>
          <p className="text-gray-300 text-lg">
            Choose how you&apos;d like to get started
          </p>
        </div>

        <div className="space-y-4">
          {/* Import from Seed Phrase */}
          <button
            onClick={() => onChoice('import')}
            className="w-full p-6 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-400/30 
                     rounded-xl transition-all duration-300 hover:scale-105 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-white group-hover:text-purple-300">
                  Import from Seed Phrase
                </h3>
                <p className="text-gray-400 text-sm">
                  Restore your wallet using your 12-word recovery phrase
                </p>
              </div>
            </div>
          </button>

          {/* Create New Wallet */}
          <button
            onClick={() => onChoice('create')}
            className="w-full p-6 bg-green-600/20 hover:bg-green-600/30 border border-green-400/30 
                     rounded-xl transition-all duration-300 hover:scale-105 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-white group-hover:text-green-300">
                  Create New Wallet
                </h3>
                <p className="text-gray-400 text-sm">
                  Generate a new wallet with a fresh seed phrase
                </p>
              </div>
            </div>
          </button>
        </div>

        <div className="mt-8 p-4 bg-amber-600/20 border border-amber-400/30 rounded-lg">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h4 className="text-amber-400 font-semibold text-sm">Security Notice</h4>
              <p className="text-amber-200 text-xs mt-1">
                Always keep your seed phrase secure and never share it with anyone. 
                We recommend writing it down and storing it in a safe place.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
