import { z } from 'zod'

export const assetSchema = z.object({
  name: z.string().min(1, { message: 'Asset name is required' }),
  type: z.enum(['CAR', 'GENERATOR', 'APPLIANCE', 'OTHER']),
  brand: z.string().optional(),
  model: z.string().optional(),
  purchaseDate: z.string().datetime().optional().or(z.literal('')), // Allow empty string or valid datetime
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
})

export type AssetCreationRequest = z.infer<typeof assetSchema>
