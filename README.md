# Web3 HD Wallet Application

A comprehensive hierarchical deterministic (HD) wallet application built with Next.js, supporting both Solana and Ethereum blockchains.

## 🚀 Features

### 🔐 Security & Authentication
- **Password Protection**: Users create and confirm passwords with bcrypt hashing
- **Seed Phrase Generation**: Automatic BIP39 12-word mnemonic generation
- **Click-to-Copy**: Easy copying of seed phrases and public keys
- **HD Key Derivation**: BIP44 standard for generating multiple accounts

### 🌐 Multi-Blockchain Support
- **Solana**: Fast, low-cost transactions
- **Ethereum**: Rich DeFi ecosystem and smart contracts
- **Account Management**: Create unlimited accounts per blockchain
- **Key Display**: View public keys/addresses with easy copying

### 💾 Database Integration
- **PostgreSQL**: Using Neon.tech cloud database
- **Prisma ORM**: Type-safe database operations
- **Data Models**: Users, Wallets, and Accounts with proper relationships

### 🎨 Modern UI/UX
- **Responsive Design**: Works on desktop and mobile
- **Gradient Backgrounds**: Beautiful visual design
- **Interactive Elements**: Hover effects and smooth transitions
- **Copy Feedback**: Visual confirmation when copying to clipboard

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Neon.tech) + Prisma ORM
- **Cryptography**: bip39, ed25519-hd-key, @solana/web3.js, ethers.js
- **Security**: bcryptjs for password hashing

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Neon.tech account (free tier available)

## ⚡ Quick Start

1. **Clone and Install**
   ```bash
   git clone <your-repo>
   cd wallet
   npm install
   ```

2. **Set Up Environment Variables**
   ```bash
   cp .env.example .env
   ```
   - Create account at [neon.tech](https://neon.tech)
   - Create new project and get connection string
   - Update `.env` file with your actual DATABASE_URL

3. **Initialize Database**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open Application**
   Visit [http://localhost:3000](http://localhost:3000)

## 🔄 User Flow

1. **Password Setup**: Create and confirm a secure password
2. **Seed Phrase**: View and safely store your 12-word recovery phrase
3. **Blockchain Selection**: Choose between Solana and Ethereum
4. **Account Management**: Create, view, and manage multiple accounts
5. **Key Management**: Copy public keys and manage your accounts

## 📁 Project Structure

```
app/
├── api/
│   ├── auth/register/     # User registration
│   ├── wallet/           # Wallet management
│   └── account/          # Account operations
├── components/           # React components
│   ├── PasswordSetup.tsx
│   ├── SeedPhraseDisplay.tsx
│   ├── WalletSelection.tsx
│   └── WalletDashboard.tsx
├── globals.css          # Global styles
├── layout.tsx           # App layout
└── page.tsx            # Main page

lib/
├── prisma.ts           # Prisma client
└── wallet.ts           # Crypto utilities

prisma/
└── schema.prisma       # Database schema
```

## 🔒 Security Considerations

⚠️ **Development Note**: This is a demonstration application. For production:

- Implement proper private key encryption (AES-256)
- Add session management and authentication
- Use HTTPS in production
- Implement rate limiting
- Consider hardware security modules
- Add comprehensive input validation
- Implement proper error handling

## 🌟 Key Features Explained

### HD Wallet Generation
- Uses BIP39 for mnemonic generation
- BIP44 derivation path for account generation
- Supports multiple accounts per wallet

### Blockchain Integration
- **Solana**: Uses `@solana/web3.js` for key pair generation
- **Ethereum**: Uses `ethers.js` for wallet creation
- Proper derivation paths for each blockchain

### Database Schema
```sql
User (id, password, seedPhrase, createdAt, updatedAt)
Wallet (id, userId, name, blockchain, createdAt, updatedAt)
Account (id, walletId, name, publicKey, privateKey, accountIndex, createdAt, updatedAt)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is for educational purposes. Use at your own risk in production environments.

## 🆘 Support

For setup help, see [SETUP.md](./SETUP.md) for detailed instructions.
