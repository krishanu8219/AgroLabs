import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
)

// Database Types
export interface ChatMessage {
  id: string
  user_id: string
  role: 'user' | 'assistant'
  content: string
  thinking?: string
  created_at: string
}

export interface Field {
  id: string
  user_id: string
  name: string
  size_acres: number
  crop_type?: string
  location?: {
    lat: number
    lng: number
  }
  created_at: string
  updated_at: string
}

export interface SatelliteData {
  id: string
  field_id: string
  ndvi_value: number
  date: string
  image_url?: string
  created_at: string
}

export interface Alert {
  id: string
  user_id: string
  field_id?: string
  type: 'irrigation' | 'weather' | 'pest' | 'disease' | 'general'
  severity: 'low' | 'medium' | 'high'
  title: string
  message: string
  read: boolean
  created_at: string
}