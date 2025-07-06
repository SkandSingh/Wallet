import { NextRequest, NextResponse } from 'next/server';
import * as bip39 from 'bip39';

export async function POST(request: NextRequest) {
  try {
    const { seedPhrase } = await request.json();

    if (!seedPhrase) {
      return NextResponse.json(
        { error: 'Seed phrase is required' },
        { status: 400 }
      );
    }

    // Validate seed phrase
    const words = seedPhrase.trim().split(/\s+/);
    if (words.length !== 12) {
      return NextResponse.json(
        { error: 'Seed phrase must be exactly 12 words' },
        { status: 400 }
      );
    }

    // Validate that it's a valid BIP39 mnemonic
    if (!bip39.validateMnemonic(seedPhrase)) {
      return NextResponse.json(
        { error: 'Invalid seed phrase. Please check your words and try again.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Seed phrase validated successfully'
    });

  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
