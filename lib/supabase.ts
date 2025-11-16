import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type InvoiceEntry = {
  id?: number
  description: string
  amount: number
  vat_rate: number
  vat_amount: number
  total: number
}

export type InvoiceSheet = {
  id?: string
  user_id: string
  sheet_name: string
  vat_rate: number
  entries: InvoiceEntry[]
  total_amount: number
  total_vat: number
  grand_total: number
  created_at?: string
  updated_at?: string
}