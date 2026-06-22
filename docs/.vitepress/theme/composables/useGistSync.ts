import { getStore, type QuestionStore } from './useQuestionStore'

const TOKEN_KEY = 'interview-bank-gist-token'
const GIST_ID_KEY = 'interview-bank-gist-id'
const GIST_FILENAME = 'interview-bank-sync.json'
const GIST_DESCRIPTION = 'Interview Bank · 我的题库云同步'

export interface SyncConfig {
  token: string
  gistId: string
}

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

export function getSyncConfig(): SyncConfig | null {
  if (typeof localStorage === 'undefined') return null
  const token = localStorage.getItem(TOKEN_KEY)
  const gistId = localStorage.getItem(GIST_ID_KEY)
  if (!token || !gistId) return null
  return { token, gistId }
}

export function setSyncConfig(config: SyncConfig) {
  localStorage.setItem(TOKEN_KEY, config.token)
  localStorage.setItem(GIST_ID_KEY, config.gistId)
}

export function clearSyncConfig() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(GIST_ID_KEY)
  setSyncState({ status: 'idle', message: '已关闭云同步' })
}

export function isSyncEnabled(): boolean {
  return !!getSyncConfig()
}

function ghHeaders(token: string) {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  }
}

function mergeStores(local: QuestionStore, remote: QuestionStore): QuestionStore {
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

async function findExistingGist(token: string): Promise<string | null> {
  const res = await fetch('https://api.github.com/gists', { headers: ghHeaders(token) })
  if (!res.ok) return null
  const gists = (await res.json()) as Array<{ id: string; description: string; files: Record<string, unknown> }>
  const hit = gists.find(
    (g) => g.description === GIST_DESCRIPTION || Object.keys(g.files || {}).includes(GIST_FILENAME)
  )
  return hit?.id || null
}

export async function initGistSync(token: string): Promise<{ ok: boolean; gistId?: string; error?: string }> {
  const trimmed = token.trim()
  if (!trimmed) return { ok: false, error: '请填写 GitHub Token' }

  setSyncState({ status: 'syncing', message: '正在连接 GitHub…' })

  try {
    let gistId = await findExistingGist(trimmed)

    if (!gistId) {
      const store = getStore()
      const res = await fetch('https://api.github.com/gists', {
        method: 'POST',
        headers: ghHeaders(trimmed),
        body: JSON.stringify({
          description: GIST_DESCRIPTION,
          public: false,
          files: {
            [GIST_FILENAME]: {
              content: JSON.stringify(store, null, 2),
            },
          },
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        const msg = (err as { message?: string }).message || `HTTP ${res.status}`
        setSyncState({ status: 'error', message: msg })
        return { ok: false, error: `创建 Gist 失败：${msg}` }
      }
      const data = (await res.json()) as { id: string }
      gistId = data.id
    }

    setSyncConfig({ token: trimmed, gistId })
    setSyncState({
      status: 'ok',
      message: '云同步已启用',
      lastSyncAt: new Date().toISOString(),
    })
    return { ok: true, gistId }
  } catch (e) {
    const msg = e instanceof Error ? e.message : '网络错误'
    setSyncState({ status: 'error', message: msg })
    return { ok: false, error: msg }
  }
}

export async function pushStoreToGist(): Promise<{ ok: boolean; error?: string }> {
  const config = getSyncConfig()
  if (!config) return { ok: false, error: '未配置云同步' }

  setSyncState({ status: 'syncing', message: '正在上传…' })

  try {
    const store = getStore()
    const res = await fetch(`https://api.github.com/gists/${config.gistId}`, {
      method: 'PATCH',
      headers: ghHeaders(config.token),
      body: JSON.stringify({
        files: {
          [GIST_FILENAME]: {
            content: JSON.stringify(store, null, 2),
          },
        },
      }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      const msg = (err as { message?: string }).message || `HTTP ${res.status}`
      setSyncState({ status: 'error', message: msg })
      return { ok: false, error: msg }
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

export async function pullStoreFromGist(): Promise<{ ok: boolean; merged?: number; error?: string }> {
  const config = getSyncConfig()
  if (!config) return { ok: false, error: '未配置云同步' }

  setSyncState({ status: 'syncing', message: '正在拉取云端数据…' })

  try {
    const res = await fetch(`https://api.github.com/gists/${config.gistId}`, {
      headers: ghHeaders(config.token),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      const msg = (err as { message?: string }).message || `HTTP ${res.status}`
      setSyncState({ status: 'error', message: msg })
      return { ok: false, error: msg }
    }
    const gist = (await res.json()) as {
      files: Record<string, { content: string }>
    }
    const raw = gist.files?.[GIST_FILENAME]?.content
    if (!raw) {
      setSyncState({ status: 'ok', message: '云端暂无数据' })
      return { ok: true, merged: 0 }
    }

    const remote = JSON.parse(raw) as QuestionStore
    const local = getStore()
    const before = local.questions.length
    const merged = mergeStores(local, remote)

    localStorage.setItem('interview-bank-v1', JSON.stringify(merged))
    window.dispatchEvent(new CustomEvent('question-store-updated'))

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

export async function syncNow(): Promise<void> {
  await pullStoreFromGist()
  await pushStoreToGist()
}

export function scheduleSyncPush(delayMs = 1500) {
  if (!isSyncEnabled()) return
  if (pushTimer) clearTimeout(pushTimer)
  pushTimer = setTimeout(() => {
    pushStoreToGist()
  }, delayMs)
}
