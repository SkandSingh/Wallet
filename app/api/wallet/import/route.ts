import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { seedPhrase } = await request.json();

    if (!seedPhrase) {
      return NextResponse.json(
        { error: 'Seed phrase is required' },
        { status: 400 }
      );
    }

    // First, find the user with this seed phrase
    const existingUser = await prisma.user.findFirst({
      where: {
        seedPhrase: seedPhrase
      },
      include: {
        wallets: {
          include: {
            accounts: true
          }
        }
      }
    });

    if (!existingUser) {
      // No user found with this seed phrase
      return NextResponse.json({
        success: true,
        wallets: [],
        message: 'No existing wallets found for this seed phrase'
      });
    }

    // Convert database wallets to the expected format
    const wallets = existingUser.wallets.map(wallet => ({
      id: wallet.id,
      name: wallet.name,
      blockchain: wallet.blockchain,
      accounts: wallet.accounts.map(account => ({
        id: account.id,
        name: account.name,
        publicKey: account.publicKey,
        accountIndex: account.accountIndex
      }))
    }));

    return NextResponse.json({
      success: true,
      wallets: wallets,
      userId: existingUser.id,
      message: `Found ${wallets.length} wallet${wallets.length !== 1 ? 's' : ''} with ${wallets.reduce((total, w) => total + w.accounts.length, 0)} accounts`
    });

  } catch (error) {
    console.error('Wallet import error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
