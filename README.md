# 🌟 Web3 HD Wallet Application

A modern, secure hierarchical deterministic (HD) wallet application built with Next.js, supporting both Solana and Ethereum blockchains. Features a hybrid navigation architecture optimized for security and user experience.

## 🚀 Key Features

### 🔐 Security-First Design
- **Seed Phrase Authentication**: Industry-standard BIP39 12-word mnemonic (no passwords)
- **Memory-Safe**: Sensitive data stays in memory during auth flow
- **HD Key Derivation**: BIP44 standard for generating multiple accounts
- **Secure Storage**: Minimal persistent data, maximum security

### 🌐 Multi-Blockchain Support
- **Solana**: Fast, low-cost transactions with ed25519 cryptography
- **Ethereum**: Rich DeFi ecosystem with secp256k1 key pairs
- **Account Management**: Unlimited accounts per blockchain
- **Key Display**: View and copy addresses with one-click

### 🎯 Hybrid Navigation Architecture
- **Conditional Rendering**: Smooth auth flow without page reloads
- **Page Routing**: Proper browser navigation for main app features
- **Smart Redirects**: Automatic routing based on authentication state
- **State Management**: Secure data flow between components

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Glass Morphism**: Beautiful gradient backgrounds and effects
- **Interactive Elements**: Smooth transitions and hover effects
- **Copy Feedback**: Visual confirmation for all copy operations

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Database**: PostgreSQL (Neon.tech) + Prisma ORM
- **Cryptography**: bip39, ed25519-hd-key, @solana/web3.js, ethers.js
- **Navigation**: Hybrid conditional rendering + page routing

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (Neon.tech recommended)

## ⚡ Quick Start

### 1. **Clone and Install**
```bash
git clone <your-repo-url>
cd wallet
npm install
```

### 2. **Database Setup**
```bash
# Copy environment template
cp .env.example .env

# Update .env with your database URL from neon.tech
# DATABASE_URL="postgresql://..."

# Initialize database
npx prisma migrate dev --name init
```

### 3. **Start Development**
```bash
npm run dev
```

### 4. **Open Application**
Visit [http://localhost:3000](http://localhost:3000)

## 🔄 User Journey

### Authentication Flow (Conditional Rendering)
```
Welcome → Import/Create → Wallet Setup → Dashboard
```

1. **Welcome**: Choose to import existing wallet or create new
2. **Import**: Enter 12-word seed phrase to restore wallets
3. **Create**: Generate and confirm new seed phrase
4. **Wallet Setup**: Create blockchain wallets (Solana/Ethereum)
5. **Dashboard**: Manage accounts and transactions

## 🏗️ Architecture

### Route Structure
```
/ (Smart redirect)
├── /auth (Complete auth flow - conditional rendering)
│   ├── Welcome screen
│   ├── Seed phrase import/create
│   ├── Wallet selection
│   └── → Redirect to dashboard
└── /dashboard (Main app - page routing)
    ├── Account management
    ├── Transaction interface
    └── Secure logout
```

### State Management Strategy
| Storage | Purpose | Data |
|---------|---------|------|
| **Memory** | Runtime state | Seed phrases, wallets, user data |
| **Database** | Persistence | Wallet metadata and accounts |

*Note: No browser storage (localStorage/sessionStorage) is used for security.*

## 📁 Project Structure

```
app/
├── auth/
│   └── page.tsx         # Complete authentication & wallet management flow
├── components/          # Reusable React components
│   ├── AppLayout.tsx    # Shared layout component
│   ├── WelcomeScreen.tsx
│   ├── SeedPhraseImport.tsx
│   ├── SeedPhraseDisplay.tsx
│   ├── WalletSelection.tsx
│   └── WalletDashboard.tsx
├── api/                 # Backend API routes
│   ├── seed-phrase/     # BIP39 validation
│   ├── wallet/         # Wallet creation & import
│   └── account/        # Account management
├── globals.css
├── layout.tsx
└── page.tsx            # Smart redirect entry point

lib/
├── prisma.ts           # Database client
└── wallet.ts           # Cryptographic utilities

prisma/
├── schema.prisma       # Database schema
└── migrations/         # Database migrations
```

## �️ Database Schema

```sql
User {
  id          String   @id @default(cuid())
  seedPhrase  String   @unique
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  wallets     Wallet[]
}

Wallet {
  id         String    @id @default(cuid())
  userId     String
  name       String
  blockchain String
  user       User      @relation(fields: [userId], references: [id])
  accounts   Account[]
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
}

Account {
  id           String   @id @default(cuid())
  walletId     String
  name         String
  publicKey    String
  privateKey   String
  accountIndex Int
  wallet       Wallet   @relation(fields: [walletId], references: [id])
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

## 🔐 Security Features

### ✅ **Implemented**
- Seed phrase-only authentication (no passwords)
- BIP39 mnemonic validation
- Memory-safe secret handling
- Automatic session cleanup
- Protected route access control
- Secure API endpoints

### 🚨 **Production Considerations**
- Implement private key encryption at rest
- Add session token management
- Use HTTPS in production
- Implement rate limiting
- Add comprehensive input validation
- Consider hardware security modules (HSMs)

## 🌟 Key Innovations

### Hybrid Navigation
- **Auth Flow**: Conditional rendering for smooth UX and security
- **Main App**: Page routing for proper browser navigation
- **Smart Routing**: Automatic redirection based on user state

### Crypto Implementation
- **Solana**: Ed25519 key generation with proper derivation paths
- **Ethereum**: Secp256k1 with ethers.js integration
- **BIP Standards**: Full BIP39/BIP44 compliance

### State Architecture
- Minimal persistent storage for maximum security
- Clean separation between auth and app state
- Automatic cleanup on logout

## 🚀 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is for educational and demonstration purposes. Use responsibly and add appropriate security measures for production deployments.

## 🆘 Support

For issues or questions:
1. Check the database connection in `.env`
2. Ensure Prisma migrations are applied
3. Verify Node.js version compatibility (18+)
4. Review browser console for client-side errors
