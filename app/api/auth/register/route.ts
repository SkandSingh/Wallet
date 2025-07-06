import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { WalletService } from '@/lib/wallet';

export async function POST(request: NextRequest) {
  try {
    const { password, confirmPassword } = await request.json();

    if (!password || !confirmPassword) {
      return NextResponse.json(
        { error: 'Password and confirm password are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Generate seed phrase and hash password
    const seedPhrase = WalletService.generateSeedPhrase();
    const hashedPassword = await WalletService.hashPassword(password);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        password: hashedPassword,
        seedPhrase: seedPhrase,
      },
    });

    return NextResponse.json({
      success: true,
      userId: user.id,
      seedPhrase: seedPhrase,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
