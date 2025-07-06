import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { WalletService } from '@/lib/wallet';

export async function POST(request: NextRequest) {
  try {
    const { walletId, name } = await request.json();

    if (!walletId || !name) {
      return NextResponse.json(
        { error: 'Wallet ID and name are required' },
        { status: 400 }
      );
    }

    // Get wallet and user information
    const wallet = await prisma.wallet.findUnique({
      where: { id: walletId },
      include: {
        user: true,
        accounts: true,
      },
    });

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      );
    }

    // Calculate next account index
    const accountIndex = wallet.accounts.length;

    // Generate account based on blockchain type
    let accountData;
    if (wallet.blockchain === 'solana') {
      accountData = WalletService.generateSolanaAccount(wallet.user.seedPhrase, accountIndex);
    } else if (wallet.blockchain === 'ethereum') {
      accountData = WalletService.generateEthereumAccount(wallet.user.seedPhrase, accountIndex);
    } else {
      return NextResponse.json(
        { error: 'Unsupported blockchain' },
        { status: 400 }
      );
    }

    // Create account in database
    const account = await prisma.account.create({
      data: {
        walletId,
        name,
        publicKey: accountData.publicKey,
        privateKey: accountData.privateKey, // In production, encrypt this
        accountIndex,
      },
    });

    // Return account without private key for security
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { privateKey, ...safeAccount } = account;

    return NextResponse.json({
      success: true,
      account: safeAccount,
    });
  } catch (error) {
    console.error('Create account error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');

    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      );
    }

    await prisma.account.delete({
      where: { id: accountId },
    });

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
