<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { withBase } from 'vitepress'
import { getStats, getQuestions, getCategory } from '../composables/useQuestionStore'

const stats = ref({ total: 0, mastered: 0, categories: 0 })
const recent = ref<{ title: string; category: string }[]>([])

function refresh() {
  stats.value = getStats()
  recent.value = getQuestions()
    .slice(0, 3)
    .map((q) => ({
      title: q.title,
      category: getCategory(q.categoryId)?.name || '未分类',
    }))
}

onMounted(() => {
  refresh()
  window.addEventListener('question-store-updated', refresh)
})

onUnmounted(() => {
  window.removeEventListener('question-store-updated', refresh)
})
</script>

<template>
  <div class="home-user-bank">
    <div class="hub-header">
      <h3>✏️ 我的题库</h3>
      <span class="hub-count">{{ stats.total }} 题</span>
    </div>

    <div v-if="stats.total === 0" class="hub-empty">
      <p>还没有自定义题目，直接在网页里添加</p>
      <div class="hub-btns">
        <a :href="withBase('/add')" class="qb-btn primary">+ 添加题目</a>
        <a :href="withBase('/my')" class="qb-btn ghost">查看题库</a>
      </div>
    </div>

    <div v-else class="hub-content">
      <p class="hub-meta">已掌握 {{ stats.mastered }} / {{ stats.total }} 题</p>
      <ul v-if="recent.length" class="hub-recent">
        <li v-for="(r, i) in recent" :key="i">
          <a :href="withBase('/my')">{{ r.title }}</a>
          <span>{{ r.category }}</span>
        </li>
      </ul>
      <div class="hub-btns">
        <a :href="withBase('/my')" class="qb-btn primary">进入我的题库</a>
        <a :href="withBase('/add')" class="qb-btn ghost">+ 继续添加</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-user-bank {
  padding: 24px;
  border-radius: 16px;
  border: 2px dashed #14b8a6;
  background: rgba(20, 184, 166, 0.05);
}

.hub-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.hub-header h3 {
  margin: 0;
  font-size: 18px;
}

.hub-count {
  padding: 3px 10px;
  border-radius: 999px;
  background: #14b8a6;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
}

.hub-empty p,
.hub-meta {
  color: var(--vp-c-text-2);
  font-size: 14px;
  margin: 0 0 16px;
}

.hub-recent {
  list-style: none;
  padding: 0;
  margin: 0 0 16px;
}

.hub-recent li {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed var(--vp-c-divider);
  font-size: 14px;
}

.hub-recent a {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.hub-recent a:hover {
  color: var(--vp-c-brand-1);
}

.hub-recent span {
  color: var(--vp-c-text-3);
  font-size: 12px;
}

.hub-btns {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
