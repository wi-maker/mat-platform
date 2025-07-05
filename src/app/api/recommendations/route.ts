import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// In a real app, this data would be in a database (e.g., Supabase)
let mockRecommendations: MaintenanceRecommendation[] = [];

// Define the detailed recommendation structure
export type RecommendationPriority = 'High' | 'Medium' | 'Low';
export type RecommendationStatus = 'Pending' | 'Done' | 'Dismissed';

export interface MaintenanceRecommendation {
  id: string;
  assetId: string;
  title: string;
  description: string;
  priority: RecommendationPriority;
  estimatedCost: string;
  estimatedTime: string;
  status: RecommendationStatus;
  suggestedProvider?: {
    name: string;
    contact: string;
    location: string;
  };
}

// Mock function to simulate AI generation with context
const generateMockRecommendations = (assetId: string, assetType: string): MaintenanceRecommendation[] => {
  const baseRecs = [
    {
      id: uuidv4(),
      assetId,
      title: 'Check brake fluid - Lagos traffic increases brake wear by 40%',
      description: 'Constant stop-and-go traffic in cities like Lagos puts extra strain on your braking system. Ensure fluid is topped up and clean.',
      priority: 'High' as RecommendationPriority,
      estimatedCost: '₦5,000 - ₦10,000',
      estimatedTime: '1 hour',
      status: 'Pending' as RecommendationStatus,
      suggestedProvider: { name: 'AutoJoe Garage', contact: '08012345678', location: 'Ikeja, Lagos' },
    },
    {
      id: uuidv4(),
      assetId,
      title: 'Service air conditioning before dry season peaks',
      description: 'The hot, dry season requires your AC to work overtime. A pre-season service can prevent costly failures.',
      priority: 'Medium' as RecommendationPriority,
      estimatedCost: '₦15,000 - ₦25,000',
      estimatedTime: '2-3 hours',
      status: 'Pending' as RecommendationStatus,
    },
    {
      id: uuidv4(),
      assetId,
      title: 'Clean fuel injectors - dirty fuel is common',
      description: 'Fuel quality can be inconsistent. Cleaning injectors ensures optimal performance and fuel efficiency for your generator.',
      priority: 'High' as RecommendationPriority,
      estimatedCost: '₦10,000 - ₦15,000',
      estimatedTime: '1.5 hours',
      status: 'Pending' as RecommendationStatus,
      suggestedProvider: { name: 'PowerHouse Generators', contact: '09087654321', location: 'Abuja FCT' },
    },
  ];
  // Filter recs based on a simplified asset type
  return assetType === 'CAR' ? baseRecs.slice(0, 2) : baseRecs.slice(2, 3);
};

/**
 * GET /api/recommendations
 * Fetches all recommendations.
 */
export async function GET() {
  // In a real app, you'd fetch from your DB, likely for a specific user.
  // Initialize with some data if empty
  if (mockRecommendations.length === 0) {
    mockRecommendations.push(...generateMockRecommendations('asset-1', 'CAR'));
  }
  return NextResponse.json(mockRecommendations);
}

/**
 * POST /api/recommendations
 * Generates new recommendations for an asset.
 */
export async function POST(request: Request) {
  const { assetId, assetType } = await request.json();
  if (!assetId || !assetType) {
    return NextResponse.json({ error: 'assetId and assetType are required' }, { status: 400 });
  }

  // TODO: Replace with actual Google AI API call
  const newRecs = generateMockRecommendations(assetId, assetType);
  mockRecommendations.push(...newRecs);
  
  return NextResponse.json(newRecs, { status: 201 });
}

/**
 * PUT /api/recommendations
 * Updates the status of a recommendation.
 */
export async function PUT(request: Request) {
  const { recommendationId, status } = await request.json();
  if (!recommendationId || !status) {
    return NextResponse.json({ error: 'recommendationId and status are required' }, { status: 400 });
  }

  const recIndex = mockRecommendations.findIndex(r => r.id === recommendationId);
  if (recIndex === -1) {
    return NextResponse.json({ error: 'Recommendation not found' }, { status: 404 });
  }

  mockRecommendations[recIndex].status = status;
  return NextResponse.json(mockRecommendations[recIndex]);
}
