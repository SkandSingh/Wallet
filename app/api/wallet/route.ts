import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId, name, blockchain } = await request.json();

    if (!userId || !name || !blockchain) {
      return NextResponse.json(
        { error: 'User ID, name, and blockchain are required' },
        { status: 400 }
      );
    }

    if (!['solana', 'ethereum'].includes(blockchain)) {
      return NextResponse.json(
        { error: 'Blockchain must be either solana or ethereum' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create wallet
    const wallet = await prisma.wallet.create({
      data: {
        userId,
        name,
        blockchain,
      },
      include: {
        accounts: true,
      },
    });

    return NextResponse.json({
      success: true,
      wallet,
    });
  } catch (error) {
    console.error('Create wallet error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const wallets = await prisma.wallet.findMany({
      where: { userId },
      include: {
        accounts: true,
      },
    });

    return NextResponse.json({
      success: true,
      wallets,
    });
  } catch (error) {
    console.error('Get wallets error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
