import { NextRequest, NextResponse } from 'next/server';
import { WalletService } from '../../../../lib/wallet';
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

    // Validate the seed phrase
    if (!WalletService.validateSeedPhrase(seedPhrase)) {
      return NextResponse.json(
        { error: 'Invalid seed phrase' },
        { status: 400 }
      );
    }

    // Check if user already exists with this seed phrase
    const existingUser = await prisma.user.findFirst({
      where: {
        seedPhrase: seedPhrase
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Wallet with this seed phrase already exists' },
        { status: 409 }
      );
    }

    // Create new user without password
    const user = await prisma.user.create({
      data: {
        password: '', // Empty password since we're not using it
        seedPhrase: seedPhrase,
      },
    });

    return NextResponse.json({
      success: true,
      userId: user.id,
      message: 'Wallet created successfully'
    });

  } catch (error) {
    console.error('Wallet creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
