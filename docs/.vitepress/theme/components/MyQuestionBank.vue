<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { withBase } from 'vitepress'
import {
  getCategories,
  getQuestions,
  getCategory,
  deleteQuestion,
  toggleMastered,
  exportJSON,
  importJSON,
  questionToMarkdown,
  getStats,
  type Question,
  type Category,
} from '../composables/useQuestionStore'

const categories = ref<Category[]>([])
const questions = ref<Question[]>([])
const activeCategory = ref('all')
const search = ref('')
const showMastered = ref(true)
const toast = ref('')
const importText = ref('')
const showImport = ref(false)

function refresh() {
  categories.value = getCategories()
  questions.value = getQuestions()
}

const stats = computed(() => getStats())

const filtered = computed(() => {
  let list = questions.value
  if (activeCategory.value !== 'all') {
    list = list.filter((q) => q.categoryId === activeCategory.value)
  }
  if (!showMastered.value) {
    list = list.filter((q) => !q.mastered)
  }
  const kw = search.value.trim().toLowerCase()
  if (kw) {
    list = list.filter(
      (q) =>
        q.title.toLowerCase().includes(kw) ||
        q.question.toLowerCase().includes(kw) ||
        q.answer.toLowerCase().includes(kw) ||
        q.tags.some((t) => t.toLowerCase().includes(kw))
    )
  }
  return list
})

function catOf(q: Question) {
  return getCategory(q.categoryId)
}

function onDelete(id: string) {
  if (confirm('确定删除这道题目？')) {
    deleteQuestion(id)
    refresh()
    showToast('已删除')
  }
}

function onToggleMastered(id: string) {
  toggleMastered(id)
  refresh()
}

function showToast(msg: string) {
  toast.value = msg
  setTimeout(() => (toast.value = ''), 2000)
}

function handleExport() {
  const blob = new Blob([exportJSON()], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `interview-bank-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
  showToast('已导出 JSON')
}

function handleImport() {
  const result = importJSON(importText.value)
  if (result.ok) {
    refresh()
    showImport.value = false
    importText.value = ''
    showToast(`成功导入 ${result.count} 道题`)
  } else {
    showToast(result.error || '导入失败')
  }
}

function copyMarkdown(q: Question) {
  const md = questionToMarkdown(q, catOf(q))
  navigator.clipboard.writeText(md).then(() => showToast('已复制 Markdown'))
}

function onStoreUpdate() {
  refresh()
}

onMounted(() => {
  refresh()
  window.addEventListener('question-store-updated', onStoreUpdate)
})

onUnmounted(() => {
  window.removeEventListener('question-store-updated', onStoreUpdate)
})
</script>

<template>
  <div class="qb-my-page">
    <div class="qb-my-header">
      <div>
        <h2>我的题库</h2>
        <p class="qb-stats">
          共 <strong>{{ stats.total }}</strong> 题 · 已掌握
          <strong>{{ stats.mastered }}</strong> 题 · 数据保存在本机浏览器
        </p>
      </div>
      <div class="qb-my-actions">
        <a :href="withBase('/add')" class="qb-btn primary">+ 添加题目</a>
        <button class="qb-btn ghost" @click="handleExport">导出备份</button>
        <button class="qb-btn ghost" @click="showImport = !showImport">导入</button>
      </div>
    </div>

    <div v-if="showImport" class="qb-import-box">
      <textarea v-model="importText" class="qb-textarea" rows="4" placeholder="粘贴 JSON 备份内容" />
      <button class="qb-btn primary sm" @click="handleImport">确认导入</button>
    </div>

    <div class="qb-toolbar">
      <div class="qb-tabs">
        <button
          :class="['qb-tab', { active: activeCategory === 'all' }]"
          @click="activeCategory = 'all'"
        >
          全部
        </button>
        <button
          v-for="c in categories"
          :key="c.id"
          :class="['qb-tab', { active: activeCategory === c.id }]"
          @click="activeCategory = c.id"
        >
          {{ c.icon }} {{ c.name }}
        </button>
      </div>
      <div class="qb-search-row">
        <input v-model="search" class="qb-input" placeholder="搜索题目…" />
        <label class="qb-check">
          <input v-model="showMastered" type="checkbox" />
          显示已掌握
        </label>
      </div>
    </div>

    <div v-if="!filtered.length" class="qb-empty">
      <p v-if="!questions.length">还没有题目，点击上方「添加题目」开始</p>
      <p v-else>没有匹配的题目</p>
      <a :href="withBase('/add')" class="qb-btn primary">+ 添加第一道题</a>
    </div>

    <div v-else class="qb-list">
      <div
        v-for="q in filtered"
        :key="q.id"
        :class="['question-card', 'custom-card', 'compact-card', { mastered: q.mastered }]"
      >
        <div class="qb-card-top">
          <h2 class="question-title">
            <span class="q-badge custom-badge">✦</span>
            <span class="question-text">{{ q.question || q.title }}</span>
            <span v-if="q.mastered" class="mastered-tag">已掌握</span>
          </h2>
          <div class="qb-card-actions">
            <button class="qb-icon-btn" :title="q.mastered ? '标记未掌握' : '标记已掌握'" @click="onToggleMastered(q.id)">
              {{ q.mastered ? '↩' : '✓' }}
            </button>
            <a :href="withBase(`/add?edit=${q.id}`)" class="qb-icon-btn" title="编辑">✎</a>
            <button class="qb-icon-btn danger" title="删除" @click="onDelete(q.id)">×</button>
          </div>
        </div>

        <details class="answer-reveal">
          <summary>展开答案</summary>
          <div class="answer-body">
            <div v-if="q.round || q.conclusion || q.followups || catOf(q)" class="answer-extras">
              <div v-if="q.round" class="q-meta">
                <strong>轮次</strong>：{{ q.round }} · 难度：{{ q.difficulty }}
                <span v-if="q.point"> · 考察点：{{ q.point }}</span>
                <span v-if="q.tags.length"> · 标签：{{ q.tags.join(', ') }}</span>
                <span v-if="catOf(q)"> · {{ catOf(q)?.icon }} {{ catOf(q)?.name }}</span>
              </div>
              <div v-if="q.conclusion" class="q-conclusion">
                💡 <strong>15 秒结论</strong>：{{ q.conclusion }}
              </div>
              <div v-if="q.followups" class="q-followups">🔁 <strong>追问方向</strong>：{{ q.followups }}</div>
            </div>
            {{ q.answer }}
          </div>
        </details>

        <button class="qb-copy-btn" @click="copyMarkdown(q)">复制为 Markdown</button>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="toast" class="qb-toast">{{ toast }}</div>
    </Transition>
  </div>
</template>

<style scoped>
.qb-card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.qb-card-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.qb-icon-btn {
  width: 32px;
  height: 32px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  font-size: 14px;
  color: var(--vp-c-text-2);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.qb-icon-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.qb-icon-btn.danger:hover {
  border-color: #ef4444;
  color: #ef4444;
}

.mastered-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  font-weight: 600;
  margin-left: 8px;
}

.question-card.mastered {
  opacity: 0.72;
}

.qb-copy-btn {
  margin-top: 12px;
  padding: 6px 12px;
  border: none;
  background: none;
  color: var(--vp-c-text-3);
  font-size: 12px;
  cursor: pointer;
}

.qb-copy-btn:hover {
  color: var(--vp-c-brand-1);
}

.answer-body {
  white-space: pre-wrap;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
