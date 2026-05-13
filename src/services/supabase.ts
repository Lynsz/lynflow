import { createClient } from "@supabase/supabase-js"
import type { SupabaseDatabase } from "../types/supabase"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseEnabled =
    Boolean(supabaseUrl) && Boolean(supabaseAnonKey)

export const supabase = isSupabaseEnabled
    ? createClient<SupabaseDatabase>(supabaseUrl, supabaseAnonKey)
    : null
