import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const mockReminders = [
      {
        id: '1',
        title: 'Change Engine Oil',
        description: 'Regular maintenance for Toyota Hilux',
        priority: 'MEDIUM',
        frequency: 'MONTHLY',
        nextDue: '2025-07-15T00:00:00Z',
        isActive: true,
        assetId: 'asset-1',
        asset: {
          id: 'asset-1',
          name: 'Toyota Hilux',
          type: 'CAR'
        }
      },
      {
        id: '2',
        title: 'Generator Fuel Check',
        description: 'Check and replace fuel filter',
        priority: 'HIGH',
        frequency: 'WEEKLY',
        nextDue: '2025-07-02T00:00:00Z',
        isActive: true,
        assetId: 'asset-2',
        asset: {
          id: 'asset-2',
          name: 'Perkins Generator',
          type: 'GENERATOR'
        }
      }
    ];

    return NextResponse.json({ reminders: mockReminders });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch reminders' }, { status: 500 });
  }
}
