import { createClient } from '@supabase/supabase-js'
import type { User, Session } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Waitlist will not work.')
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Auth functions
export async function signIn(email: string, password: string): Promise<{ user: User | null; error?: string }> {
  if (!supabase) {
    return { user: null, error: 'Service not configured' }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { user: null, error: error.message }
  }

  return { user: data.user }
}

export async function signOut(): Promise<{ error?: string }> {
  if (!supabase) {
    return { error: 'Service not configured' }
  }

  const { error } = await supabase.auth.signOut()
  if (error) {
    return { error: error.message }
  }

  return {}
}

export async function getSession(): Promise<{ session: Session | null; error?: string }> {
  if (!supabase) {
    return { session: null, error: 'Service not configured' }
  }

  const { data, error } = await supabase.auth.getSession()
  if (error) {
    return { session: null, error: error.message }
  }

  return { session: data.session }
}

export function onAuthStateChange(callback: (session: Session | null) => void) {
  if (!supabase) {
    return { unsubscribe: () => {} }
  }

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session)
  })

  return { unsubscribe: subscription.unsubscribe }
}

export async function addToWaitlist(email: string, honeypot?: string): Promise<{ success: boolean; error?: string }> {
  // Honeypot check - if filled, it's a bot
  if (honeypot) {
    // Pretend success to not alert the bot
    return { success: true }
  }

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
        return { success: false, error: 'already_exists' }
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
