import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Waitlist will not work.')
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export async function addToWaitlist(email: string): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    console.error('Supabase not configured')
    return { success: false, error: 'Service temporarily unavailable' }
  }

  try {
    const { error } = await supabase
      .from('waitlist')
      .insert([{ email }])

    if (error) {
      // Duplicate email
      if (error.code === '23505') {
        return { success: true } // Treat as success, they're already on the list
      }
      console.error('Supabase error:', error)
      return { success: false, error: 'Failed to join waitlist' }
    }

    return { success: true }
  } catch (err) {
    console.error('Waitlist error:', err)
    return { success: false, error: 'Something went wrong' }
  }
}
