import { getStore, type QuestionStore } from './useQuestionStore'
import { getSupabase, isSupabaseConfigured } from './useSupabase'
import { authSession } from './useAuth'

const STORAGE_KEY = 'interview-bank-v1'

export interface SyncState {
  status: 'idle' | 'syncing' | 'ok' | 'error'
  message: string
  lastSyncAt: string | null
}

let pushTimer: ReturnType<typeof setTimeout> | null = null
let syncStateListeners: Array<(s: SyncState) => void> = []

const syncState: SyncState = {
  status: 'idle',
  message: '',
  lastSyncAt: null,
}

function readLastSyncAt(): string | null {
  if (typeof localStorage === 'undefined') return null
  return localStorage.getItem('interview-bank-last-sync')
}

if (typeof window !== 'undefined') {
  syncState.lastSyncAt = readLastSyncAt()
}

function emitSyncState() {
  for (const fn of syncStateListeners) fn({ ...syncState })
}

function setSyncState(patch: Partial<SyncState>) {
  Object.assign(syncState, patch)
  if (patch.lastSyncAt && typeof localStorage !== 'undefined') {
    localStorage.setItem('interview-bank-last-sync', patch.lastSyncAt)
  }
  emitSyncState()
}

export function getSyncState(): SyncState {
  return { ...syncState }
}

export function onSyncStateChange(fn: (s: SyncState) => void) {
  syncStateListeners.push(fn)
  fn({ ...syncState })
  return () => {
    syncStateListeners = syncStateListeners.filter((x) => x !== fn)
  }
}

export function isCloudSyncActive(): boolean {
  return isSupabaseConfigured() && !!authSession.value
}

export function mergeStores(local: QuestionStore, remote: QuestionStore): QuestionStore {
  const questionMap = new Map<string, QuestionStore['questions'][0]>()
  for (const q of remote.questions || []) questionMap.set(q.id, q)
  for (const q of local.questions || []) {
    const existing = questionMap.get(q.id)
    if (!existing || new Date(q.updatedAt) > new Date(existing.updatedAt)) {
      questionMap.set(q.id, q)
    }
  }

  const categoryMap = new Map<string, QuestionStore['categories'][0]>()
  for (const c of remote.categories || []) categoryMap.set(c.id, c)
  for (const c of local.categories || []) {
    if (!categoryMap.has(c.id)) categoryMap.set(c.id, c)
  }

  return {
    categories: Array.from(categoryMap.values()),
    questions: Array.from(questionMap.values()),
    storeUpdatedAt: new Date().toISOString(),
  }
}

function applyStoreLocal(store: QuestionStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  window.dispatchEvent(new CustomEvent('question-store-updated'))
}

export async function pullFromCloud(): Promise<{ ok: boolean; merged?: number; error?: string }> {
  if (!isCloudSyncActive()) return { ok: false, error: '未登录' }

  setSyncState({ status: 'syncing', message: '正在从云端拉取…' })

  try {
    const supabase = getSupabase()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { ok: false, error: '未登录' }

    const { data, error } = await supabase
      .from('user_banks')
      .select('data, updated_at')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      setSyncState({ status: 'error', message: error.message })
      return { ok: false, error: error.message }
    }

    if (!data?.data) {
      setSyncState({ status: 'ok', message: '云端暂无数据' })
      return { ok: true, merged: 0 }
    }

    const remote = data.data as QuestionStore
    const local = getStore()
    const before = local.questions.length
    const merged = mergeStores(local, remote)
    applyStoreLocal(merged)

    const added = merged.questions.length - before
    const now = new Date().toISOString()
    setSyncState({
      status: 'ok',
      message: added > 0 ? `已合并 ${added} 道新题` : '已与云端对齐',
      lastSyncAt: now,
    })
    return { ok: true, merged: Math.max(0, added) }
  } catch (e) {
    const msg = e instanceof Error ? e.message : '网络错误'
    setSyncState({ status: 'error', message: msg })
    return { ok: false, error: msg }
  }
}

export async function pushToCloud(): Promise<{ ok: boolean; error?: string }> {
  if (!isCloudSyncActive()) return { ok: false, error: '未登录' }

  setSyncState({ status: 'syncing', message: '正在上传到云端…' })

  try {
    const supabase = getSupabase()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { ok: false, error: '未登录' }

    const store = getStore()
    const { error } = await supabase.from('user_banks').upsert({
      user_id: user.id,
      data: store,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      setSyncState({ status: 'error', message: error.message })
      return { ok: false, error: error.message }
    }

    const now = new Date().toISOString()
    setSyncState({ status: 'ok', message: '已同步到云端', lastSyncAt: now })
    return { ok: true }
  } catch (e) {
    const msg = e instanceof Error ? e.message : '网络错误'
    setSyncState({ status: 'error', message: msg })
    return { ok: false, error: msg }
  }
}

export async function syncNow(): Promise<void> {
  await pullFromCloud()
  await pushToCloud()
}

export function scheduleCloudPush(delayMs = 1500) {
  if (!isCloudSyncActive()) return
  if (pushTimer) clearTimeout(pushTimer)
  pushTimer = setTimeout(() => {
    pushToCloud()
  }, delayMs)
}

export async function scheduleSyncPush() {
  if (isCloudSyncActive()) {
    scheduleCloudPush()
    return
  }
  const { scheduleSyncPush: gistPush, isSyncEnabled } = await import('./useGistSync')
  if (isSyncEnabled()) gistPush()
}
