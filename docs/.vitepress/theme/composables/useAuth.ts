import { ref } from 'vue'
import type { Session, User } from '@supabase/supabase-js'
import { getSupabase, isSupabaseConfigured } from './useSupabase'

export const authSession = ref<Session | null>(null)
export const authUser = ref<User | null>(null)
export const authReady = ref(false)
export const authError = ref('')

let initialized = false

export function isLoggedIn(): boolean {
  return !!authSession.value
}

export async function initAuth(): Promise<void> {
  if (initialized || typeof window === 'undefined') return
  initialized = true

  if (!isSupabaseConfigured()) {
    authReady.value = true
    return
  }

  const supabase = getSupabase()
  const { data } = await supabase.auth.getSession()
  authSession.value = data.session
  authUser.value = data.session?.user ?? null
  authReady.value = true

  supabase.auth.onAuthStateChange(async (event, session) => {
    authSession.value = session
    authUser.value = session?.user ?? null
    authError.value = ''

    if (event === 'SIGNED_IN' && session) {
      const { pullFromCloud, pushToCloud } = await import('./useCloudSync')
      await pullFromCloud()
      await pushToCloud()
    }
    if (event === 'SIGNED_OUT') {
      authUser.value = null
    }
  })
}

export async function signInWithEmail(email: string, password: string) {
  authError.value = ''
  const supabase = getSupabase()
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
  if (error) {
    authError.value = error.message
    return { ok: false, error: error.message }
  }
  return { ok: true }
}

export async function signUpWithEmail(email: string, password: string) {
  authError.value = ''
  const supabase = getSupabase()
  const { error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: { emailRedirectTo: window.location.href },
  })
  if (error) {
    authError.value = error.message
    return { ok: false, error: error.message }
  }
  return { ok: true, message: '注册成功，请查收确认邮件（若已关闭邮件验证则可直接登录）' }
}

export async function signInWithGitHub() {
  authError.value = ''
  const supabase = getSupabase()
  const redirectTo = window.location.origin + window.location.pathname
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo },
  })
  if (error) {
    authError.value = error.message
    return { ok: false, error: error.message }
  }
  return { ok: true }
}

export async function signOut() {
  authError.value = ''
  const supabase = getSupabase()
  await supabase.auth.signOut()
  authSession.value = null
  authUser.value = null
}

export function userLabel(): string {
  const u = authUser.value
  if (!u) return ''
  return u.user_metadata?.user_name || u.user_metadata?.name || u.email || '已登录'
}
