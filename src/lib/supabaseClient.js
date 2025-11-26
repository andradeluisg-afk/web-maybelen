import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xhiabeyxhqheixgrpnpm.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoaWFiZXl4aHFoZWl4Z3JwbnBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMjE1MTEsImV4cCI6MjA3OTY5NzUxMX0.ICrK77AgRyQT9gbskyDGqmW9tMYVrPFK0o34Q1kR-2g'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
