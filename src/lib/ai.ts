import { GoogleGenerativeAI } from '@google/generative-ai'

// Types
export interface MaintenanceRecommendation {
  id: string
  title: string
  description: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  estimatedCost?: string
  timeframe: string
  category: 'PREVENTIVE' | 'ROUTINE' | 'URGENT' | 'SEASONAL'
  assetId: string
  completed: boolean
  dismissed: boolean
  createdAt: string
}

export interface ServiceProvider {
  name: string
  location: string
  services: string[]
  contact?: string
  rating?: number
}

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')

// Generate maintenance recommendations using Google AI
export async function generateRecommendations(asset: {
  id: string
  name: string
  type: string
  brand?: string
  model?: string
  purchaseDate?: string
}): Promise<MaintenanceRecommendation[]> {
  
  if (!process.env.GOOGLE_AI_API_KEY) {
    console.warn('Google AI API key not found, returning mock recommendations')
    return getMockRecommendations(asset)
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const prompt = `
    Generate 3-4 specific maintenance recommendations for this asset in African context:
    
    Asset: ${asset.name}
    Type: ${asset.type}
    Brand: ${asset.brand || 'Generic'}
    Model: ${asset.model || 'Standard'}
    Purchase Date: ${asset.purchaseDate || 'Unknown'}
    
    Context: African climate (hot, dusty, variable power), Lagos/Nigerian conditions, limited parts availability.
    
    For each recommendation, provide:
    1. Title (short, actionable)
    2. Description (specific to African conditions)
    3. Priority (HIGH/MEDIUM/LOW)
    4. Estimated cost in Naira (₦)
    5. Timeframe (when to do it)
    6. Category (PREVENTIVE/ROUTINE/URGENT/SEASONAL)
    
    Format as JSON array with this structure:
    [
      {
        "title": "Check brake pads",
        "description": "Lagos traffic increases brake wear by 40%. Check for dust buildup from harmattan.",
        "priority": "HIGH",
        "estimatedCost": "₦15,000 - ₦25,000",
        "timeframe": "Within 2 weeks",
        "category": "URGENT"
      }
    ]
    
    Make recommendations specific to ${asset.type.toLowerCase()} and African operating conditions.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Parse AI response
    const jsonMatch = text.match(/[\[\s\S]*\]/)
    if (jsonMatch) {
      const aiRecommendations = JSON.parse(jsonMatch[0])
      
      return aiRecommendations.map((rec: any, index: number) => ({
        id: `ai-${asset.id}-${index}`,
        title: rec.title,
        description: rec.description,
        priority: rec.priority,
        estimatedCost: rec.estimatedCost,
        timeframe: rec.timeframe,
        category: rec.category,
        assetId: asset.id,
        completed: false,
        dismissed: false,
        createdAt: new Date().toISOString()
      }))
    }
    
    // Fallback to mock if AI response isn't parseable
    return getMockRecommendations(asset)
    
  } catch (error) {
    console.error('AI generation failed:', error)
    return getMockRecommendations(asset)
  }
}

// Alternative function name for compatibility
export const getMaintenanceRecommendations = generateRecommendations

// Mock recommendations for development/fallback
function getMockRecommendations(asset: {
  id: string
  name: string
  type: string
  brand?: string
}): MaintenanceRecommendation[] {
  
  const baseRecommendations: Record<string, MaintenanceRecommendation[]> = {
    CAR: [
      {
        id: `mock-${asset.id}-1`,
        title: 'Check Brake System',
        description: 'Lagos traffic increases brake wear. Inspect brake pads and fluid levels due to frequent stop-and-go driving.',
        priority: 'HIGH',
        estimatedCost: '₦15,000 - ₦25,000',
        timeframe: 'Within 2 weeks',
        category: 'URGENT',
        assetId: asset.id,
        completed: false,
        dismissed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: `mock-${asset.id}-2`,
        title: 'Service Air Conditioning',
        description: 'Pre-dry season AC service. Clean filters and check refrigerant levels before harmattan peak.',
        priority: 'MEDIUM',
        estimatedCost: '₦8,000 - ₦12,000',
        timeframe: 'Next month',
        category: 'SEASONAL',
        assetId: asset.id,
        completed: false,
        dismissed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: `mock-${asset.id}-3`,
        title: 'Tire Rotation & Pressure',
        description: 'Rotate tires every 10,000km. Check pressure weekly due to temperature variations.',
        priority: 'LOW',
        estimatedCost: '₦2,000 - ₦5,000',
        timeframe: 'Next service',
        category: 'ROUTINE',
        assetId: asset.id,
        completed: false,
        dismissed: false,
        createdAt: new Date().toISOString()
      }
    ],
    GENERATOR: [
      {
        id: `mock-${asset.id}-1`,
        title: 'Clean Fuel System',
        description: 'Nigerian fuel quality varies. Clean fuel injectors and replace fuel filter to prevent clogging.',
        priority: 'HIGH',
        estimatedCost: '₦20,000 - ₦35,000',
        timeframe: 'Within 1 week',
        category: 'URGENT',
        assetId: asset.id,
        completed: false,
        dismissed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: `mock-${asset.id}-2`,
        title: 'Check Voltage Regulator',
        description: 'Power grid fluctuations stress voltage regulators. Test and calibrate during harmattan season.',
        priority: 'MEDIUM',
        estimatedCost: '₦10,000 - ₦18,000',
        timeframe: 'This month',
        category: 'PREVENTIVE',
        assetId: asset.id,
        completed: false,
        dismissed: false,
        createdAt: new Date().toISOString()
      }
    ],
    APPLIANCE: [
      {
        id: `mock-${asset.id}-1`,
        title: 'Clean Refrigerator Coils',
        description: 'Dust buildup reduces efficiency by 25%. Clean coils monthly during harmattan season.',
        priority: 'MEDIUM',
        estimatedCost: '₦1,000 - ₦3,000',
        timeframe: 'This week',
        category: 'ROUTINE',
        assetId: asset.id,
        completed: false,
        dismissed: false,
        createdAt: new Date().toISOString()
      }
    ]
  }

  return baseRecommendations[asset.type] || baseRecommendations.CAR
}

// Get local service providers (mock data for now)
export function getLocalServiceProviders(location: string, serviceType: string): ServiceProvider[] {
  const providers: ServiceProvider[] = [
    {
      name: 'AutoCare Lagos',
      location: 'Victoria Island, Lagos',
      services: ['Brake Service', 'AC Repair', 'General Maintenance'],
      contact: '+234 801 234 5678',
      rating: 4.5
    },
    {
      name: 'Generator Masters',
      location: 'Ikeja, Lagos',
      services: ['Generator Repair', 'Fuel System Cleaning', 'Parts Supply'],
      contact: '+234 803 456 7890',
      rating: 4.2
    },
    {
      name: 'Home Appliance Pro',
      location: 'Lekki, Lagos',
      services: ['Refrigerator Repair', 'AC Service', 'Appliance Maintenance'],
      contact: '+234 805 678 9012',
      rating: 4.7
    }
  ]

  return providers.filter(provider => 
    provider.services.some(service => 
      service.toLowerCase().includes(serviceType.toLowerCase())
    )
  )
}

// Seasonal maintenance advice
export function getSeasonalAdvice(assetType: string, currentSeason: 'DRY' | 'WET' | 'HARMATTAN'): string[] {
  const advice: Record<string, Record<string, string[]>> = {
    CAR: {
      DRY: ['Check tire pressure frequently', 'Monitor engine cooling system', 'Clean air filter monthly'],
      WET: ['Check brake performance', 'Inspect windshield wipers', 'Monitor battery terminals'],
      HARMATTAN: ['Replace cabin air filter', 'Check AC system', 'Protect paint from dust']
    },
    GENERATOR: {
      DRY: ['Monitor cooling system', 'Check fuel quality', 'Clean air intake'],
      WET: ['Protect from moisture', 'Check electrical connections', 'Monitor exhaust system'],
      HARMATTAN: ['Change air filter frequently', 'Check voltage regulator', 'Clean cooling fins']
    },
    APPLIANCE: {
      DRY: ['Clean refrigerator coils', 'Check AC refrigerant', 'Monitor power consumption'],
      WET: ['Check for moisture damage', 'Inspect electrical connections', 'Clean drainage systems'],
      HARMATTAN: ['Replace air filters', 'Clean fan blades', 'Check seals and gaskets']
    }
  }

  return advice[assetType]?.[currentSeason] || advice.CAR.DRY
}

