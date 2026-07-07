<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  version?: string
  date?: string
  chapters?: number
  words?: string
  pages?: number
}>()
</script>

<template>
  <div class="guide-hero">
    <div class="guide-hero-badge">教程文档 · 全文收录</div>
    <h1 class="guide-hero-title">{{ title }}</h1>
    <p v-if="subtitle" class="guide-hero-subtitle">{{ subtitle }}</p>
    <div class="guide-hero-stats">
      <span v-if="chapters" class="guide-stat"><em>{{ chapters }}</em> 章</span>
      <span v-if="words" class="guide-stat"><em>{{ words }}</em> 字</span>
      <span v-if="pages" class="guide-stat"><em>{{ pages }}</em> 页 PDF</span>
      <span v-if="version" class="guide-stat">{{ version }}</span>
      <span v-if="date" class="guide-stat">{{ date }}</span>
    </div>
  </div>
</template>
