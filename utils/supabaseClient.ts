import { createClient } from '@supabase/supabase-js'
import { Database } from '../supabasetypes'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const supabaseTyped = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
)
