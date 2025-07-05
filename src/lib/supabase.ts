import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export type Profile = {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  location?: string;
  role: 'USER' | 'ADMIN';
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type Asset = {
  id: string;
  name: string;
  type: 'CAR' | 'GENERATOR' | 'APPLIANCE' | 'OTHER';
  brand?: string;
  model?: string;
  purchaseDate?: string | null;
  imageUrl?: string;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type Reminder = {
  id: string;
  title: string;
  description?: string | null;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  frequency: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  nextDue: string;
  isActive: boolean;
  completedAt?: string | null;
  snoozedUntil?: string | null;
  assetId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

// Custom type to include the joined asset data
export type ReminderWithAsset = Reminder & {
  asset: Asset | null;
};