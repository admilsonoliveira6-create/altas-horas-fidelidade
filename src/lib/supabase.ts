import { createClient } from '@supabase/supabase-js'
import config from './config'

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

// Prêmios vêm do config — não precisa editar aqui
export const REWARDS = config.premios
