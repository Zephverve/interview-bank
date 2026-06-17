export interface Category {
  id: string
  name: string
  icon: string
  color: string
}

export interface Question {
  id: string
  categoryId: string
  title: string
  question: string
  conclusion: string
  followups: string
  answer: string
  round: string
  difficulty: string
  tags: string[]
  point: string
  mastered: boolean
  createdAt: string
  updatedAt: string
}

export interface QuestionStore {
  categories: Category[]
  questions: Question[]
}

const STORAGE_KEY = 'interview-bank-v1'

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'general', name: '通用', icon: '📋', color: '#6366f1' },
  { id: 'backend', name: '后端', icon: '⚙️', color: '#0ea5e9' },
  { id: 'frontend', name: '前端', icon: '🎨', color: '#8b5cf6' },
  { id: 'ai', name: 'AI/Agent', icon: '🤖', color: '#10b981' },
  { id: '3d', name: '3D感知', icon: '📡', color: '#14b8a6' },
  { id: 'algo', name: '算法', icon: '🧮', color: '#f59e0b' },
  { id: 'behavior', name: '行为面', icon: '💬', color: '#ec4899' },
]

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function load(): QuestionStore {
  if (typeof localStorage === 'undefined') {
    return { categories: [...DEFAULT_CATEGORIES], questions: [] }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { categories: [...DEFAULT_CATEGORIES], questions: [] }
    const data = JSON.parse(raw) as QuestionStore
    if (!data.categories?.length) data.categories = [...DEFAULT_CATEGORIES]
    if (!data.questions) data.questions = []
    return data
  } catch {
    return { categories: [...DEFAULT_CATEGORIES], questions: [] }
  }
}

function save(data: QuestionStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  window.dispatchEvent(new CustomEvent('question-store-updated'))
}

export function getStore(): QuestionStore {
  return load()
}

export function getCategories(): Category[] {
  return load().categories
}

export function getQuestions(categoryId?: string): Question[] {
  const qs = load().questions.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
  return categoryId ? qs.filter((q) => q.categoryId === categoryId) : qs
}

export function getQuestion(id: string): Question | undefined {
  return load().questions.find((q) => q.id === id)
}

export function getCategory(id: string): Category | undefined {
  return load().categories.find((c) => c.id === id)
}

export function addCategory(name: string, icon = '✏️', color = '#14b8a6'): Category {
  const data = load()
  const cat: Category = { id: uid(), name, icon, color }
  data.categories.push(cat)
  save(data)
  return cat
}

export function addQuestion(input: Omit<Question, 'id' | 'createdAt' | 'updatedAt' | 'mastered'>): Question {
  const data = load()
  const now = new Date().toISOString()
  const q: Question = { ...input, id: uid(), mastered: false, createdAt: now, updatedAt: now }
  data.questions.push(q)
  save(data)
  return q
}

export function updateQuestion(id: string, patch: Partial<Question>): Question | null {
  const data = load()
  const idx = data.questions.findIndex((q) => q.id === id)
  if (idx === -1) return null
  data.questions[idx] = {
    ...data.questions[idx],
    ...patch,
    id,
    updatedAt: new Date().toISOString(),
  }
  save(data)
  return data.questions[idx]
}

export function deleteQuestion(id: string) {
  const data = load()
  data.questions = data.questions.filter((q) => q.id !== id)
  save(data)
}

export function toggleMastered(id: string) {
  const q = getQuestion(id)
  if (q) updateQuestion(id, { mastered: !q.mastered })
}

export function exportJSON(): string {
  return JSON.stringify(load(), null, 2)
}

export function importJSON(json: string): { ok: boolean; count: number; error?: string } {
  try {
    const incoming = JSON.parse(json) as QuestionStore
    if (!incoming.questions || !Array.isArray(incoming.questions)) {
      return { ok: false, count: 0, error: '格式不正确' }
    }
    const data = load()
    const existingIds = new Set(data.questions.map((q) => q.id))
    let added = 0
    for (const q of incoming.questions) {
      if (!existingIds.has(q.id)) {
        data.questions.push(q)
        added++
      }
    }
    if (incoming.categories) {
      for (const c of incoming.categories) {
        if (!data.categories.find((x) => x.id === c.id)) {
          data.categories.push(c)
        }
      }
    }
    save(data)
    return { ok: true, count: added }
  } catch {
    return { ok: false, count: 0, error: 'JSON 解析失败' }
  }
}

export function questionToMarkdown(q: Question, cat?: Category): string {
  const tags = q.tags.length ? `[${q.tags.join(', ')}]` : '[]'
  return `---
title: ${q.title}
round: ${q.round}
difficulty: ${q.difficulty}
tags: ${tags}
point: ${q.point}
---

**题目**：${q.question}

**结论句（15 秒）**：${q.conclusion}

**追问方向**：${q.followups}

### 回答

${q.answer}
`
}

export function getStats() {
  const data = load()
  return {
    total: data.questions.length,
    mastered: data.questions.filter((q) => q.mastered).length,
    categories: data.categories.length,
  }
}

export { DEFAULT_CATEGORIES }
