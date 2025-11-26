import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xhiabeyxhqheixgrpnpm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoaWFiZXl4aHFoZWl4Z3JwbnBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMjE1MTEsImV4cCI6MjA3OTY5NzUxMX0.ICrK77AgRyQT9gbskyDGqmW9tMYVrPFK0o34Q1kR-2g'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
