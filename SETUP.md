# Web3 HD Wallet Setup Instructions

## Database Setup with Neon.tech

1. **Create a Neon Account**
   - Go to [neon.tech](https://neon.tech)
   - Sign up for a free account
   - Create a new project

2. **Get Database Connection String**
   - In your Neon dashboard, go to your project
   - Navigate to "Connection Details"
   - Copy the connection string that looks like:
     ```
     postgresql://username:password@hostname:5432/database_name?sslmode=require
     ```

3. **Update Environment Variables**
   - Open the `.env` file in your project root
   - Replace the DATABASE_URL with your actual Neon connection string:
     ```
     DATABASE_URL="your_actual_neon_connection_string_here"
     ```

4. **Run Database Migration**
   ```bash
   npx prisma migrate dev --name init
   ```

## Features Included

### ✅ Password Setup & Security
- User creates and confirms password
- Password is hashed using bcrypt before storage
- Minimum 8 character requirement

### ✅ Seed Phrase Generation & Display
- Automatically generates 12-word BIP39 mnemonic
- Beautiful grid display with word numbers
- Click anywhere to copy functionality
- Security warning and confirmation checkbox

### ✅ Blockchain Selection
- Choose between Solana and Ethereum
- Visual selection interface
- Custom wallet naming

### ✅ Account Management
- Create multiple accounts per wallet
- HD derivation (BIP44 standard)
- Add/delete accounts dynamically
- Display public keys/addresses
- Copy to clipboard functionality

### ✅ Database Integration
- PostgreSQL with Prisma ORM
- User, Wallet, and Account models
- Secure data storage
- Relationship management

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your Neon database URL in `.env`

3. Run database migration:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Security Notes

⚠️ **Important**: This is a demonstration application. For production use:

- Implement proper private key encryption
- Add authentication/session management
- Use HTTPS in production
- Consider hardware security modules
- Implement proper key derivation security
- Add rate limiting and other security measures

## Supported Blockchains

- **Solana**: Fast and low-cost transactions
- **Ethereum**: Rich DeFi ecosystem

## Technical Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Neon.tech) with Prisma ORM
- **Crypto**: bip39, @solana/web3.js, ethers.js
- **Security**: bcryptjs for password hashing
