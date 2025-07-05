'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/auth'
import { authSchema, TAuthSchema } from '@/lib/validators/auth'

export async function login(credentials: TAuthSchema) {
  const result = authSchema.safeParse(credentials)
  if (!result.success) {
    return { error: 'Invalid credentials provided.' }
  }

  const supabase = createClient()
  const { error } = await supabase.auth.signInWithPassword(credentials)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(credentials: TAuthSchema) {
  const result = authSchema.safeParse(credentials)
  if (!result.success) {
    return { error: 'Invalid credentials provided.' }
  }

  const supabase = createClient()

  const { error } = await supabase.auth.signUp(credentials)

  if (error) {
    return { error: error.message }
  }

  // For now, we'll just redirect. In a real app, you'd want to show a "Check your email" message.
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
