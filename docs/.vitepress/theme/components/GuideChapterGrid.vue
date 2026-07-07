<script setup lang="ts">
import { withBase } from 'vitepress'

export interface GuideChapterItem {
  slug: string
  title: string
  desc?: string
  accent?: string
}

const ACCENTS = ['#f97316', '#6366f1', '#0ea5e9', '#8b5cf6', '#10b981', '#ec4899', '#14b8a6', '#f59e0b']

const props = defineProps<{
  base: string
  chapters: GuideChapterItem[]
}>()

function href(slug: string) {
  return withBase(`${props.base.replace(/\/?$/, '/')}${slug}`)
}

function chapterAccent(i: number) {
  return ACCENTS[i % ACCENTS.length]
}

function chapterIndex(title: string, i: number) {
  const m = title.match(/^(\d{2})/)
  if (m) return m[1]
  if (title.includes('总目录')) return 'TOC'
  if (title.includes('问答')) return 'Q&A'
  return String(i + 1).padStart(2, '0')
}

function chapterLabel(title: string) {
  return title.replace(/^\d{2}\s*·\s*/, '').trim()
}
</script>

<template>
  <div class="guide-chapter-grid">
    <a
      v-for="(item, i) in chapters"
      :key="item.slug"
      class="guide-chapter-card"
      :href="href(item.slug)"
      :style="{ '--card-accent': item.accent || chapterAccent(i) }"
    >
      <span class="guide-chapter-index">{{ chapterIndex(item.title, i) }}</span>
      <span class="guide-chapter-name">{{ chapterLabel(item.title) }}</span>
      <span v-if="item.desc" class="guide-chapter-desc">{{ item.desc }}</span>
    </a>
  </div>
</template>
