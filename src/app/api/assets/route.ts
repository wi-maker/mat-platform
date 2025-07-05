import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const mockAssets = [
      {
        id: 'asset-1',
        name: 'Toyota Hilux',
        type: 'CAR',
        brand: 'Toyota',
        model: 'Hilux',
        user_id: 'user-1'
      },
      {
        id: 'asset-2',
        name: 'Perkins Generator',
        type: 'GENERATOR',
        brand: 'Perkins',
        model: '1104A-44',
        user_id: 'user-1'
      }
    ];

    // In a real app, you'd fetch this from your database
    // For now, we wrap it to match the expected frontend structure
    return NextResponse.json({ assets: mockAssets });

  } catch (error) {
    console.error('Failed to fetch assets:', error);
    return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 });
  }
}
