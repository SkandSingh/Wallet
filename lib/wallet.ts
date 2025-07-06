import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import { Keypair } from '@solana/web3.js';
import { ethers } from 'ethers';
import bcrypt from 'bcryptjs';

export interface WalletAccount {
  publicKey: string;
  privateKey: string;
  accountIndex: number;
}

export class WalletService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateSeedPhrase(): string {
    return bip39.generateMnemonic();
  }

  static validateSeedPhrase(seedPhrase: string): boolean {
    return bip39.validateMnemonic(seedPhrase);
  }

  static generateSolanaAccount(seedPhrase: string, accountIndex: number): WalletAccount {
    const seed = bip39.mnemonicToSeedSync(seedPhrase);
    const derivationPath = `m/44'/501'/${accountIndex}'/0'`;
    const derivedSeed = derivePath(derivationPath, seed.toString('hex')).key;
    const keypair = Keypair.fromSeed(derivedSeed);

    return {
      publicKey: keypair.publicKey.toBase58(),
      privateKey: Buffer.from(keypair.secretKey).toString('hex'),
      accountIndex
    };
  }

  static generateEthereumAccount(seedPhrase: string, accountIndex: number): WalletAccount {
    const seed = bip39.mnemonicToSeedSync(seedPhrase);
    const hdNode = ethers.HDNodeWallet.fromSeed(seed);
    const derivationPath = `m/44'/60'/0'/0/${accountIndex}`;
    const wallet = hdNode.derivePath(derivationPath);

    return {
      publicKey: wallet.address,
      privateKey: wallet.privateKey,
      accountIndex
    };
  }

  static encryptPrivateKey(privateKey: string, password: string): string {
    // In a production environment, use more robust encryption like AES-256
    // This is a simplified version for demonstration
    const combined = privateKey + ':' + password;
    return Buffer.from(combined).toString('base64');
  }

  static decryptPrivateKey(encryptedKey: string): string {
    // In a production environment, use more robust decryption
    // This is a simplified version for demonstration
    const decoded = Buffer.from(encryptedKey, 'base64').toString();
    const [privateKey] = decoded.split(':');
    return privateKey;
  }
}
