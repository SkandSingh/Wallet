interface AppLayoutProps {
  children: React.ReactNode;
  showLogout?: boolean;
  onLogout?: () => void;
}

export default function AppLayout({ children, showLogout = false, onLogout }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className={`${showLogout ? 'flex justify-between items-center' : 'text-center'} mb-8`}>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Web3 HD Wallet</h1>
            <p className="text-gray-300">Secure multi-blockchain wallet management</p>
          </div>
          {showLogout && onLogout && (
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Logout
            </button>
          )}
        </div>
        
        {children}
      </div>
    </div>
  );
}
