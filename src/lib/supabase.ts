import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Customer = {
  id: string
  phone: string
  name: string
  points: number
  created_at: string
}

export type Transaction = {
  id: string
  customer_id: string
  points: number
  description: string
  created_at: string
}

export const REWARDS = [
  {
    id: 'cerveja',
    name: 'Cerveja Grátis',
    description: '1 long neck gelada na hora',
    points: 200,
    emoji: '🍺',
  },
  {
    id: 'fardo',
    name: 'Fardo Grátis',
    description: 'Fardo 12 latas da sua escolha',
    points: 500,
    emoji: '📦',
  },
]
