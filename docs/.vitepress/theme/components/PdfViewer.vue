<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'

const props = defineProps<{
  pdf: string
  title?: string
  version?: string
  date?: string
  pages?: number
}>()

const pdfUrl = computed(() => withBase(props.pdf))
</script>

<template>
  <div class="pdf-viewer">
    <div class="pdf-viewer-toolbar">
      <div class="pdf-viewer-meta">
        <strong>{{ title || 'PDF 教程' }}</strong>
        <span v-if="version || date || pages" class="pdf-viewer-tags">
          <span v-if="version">{{ version }}</span>
          <span v-if="date">{{ date }}</span>
          <span v-if="pages">约 {{ pages }} 页</span>
        </span>
      </div>
      <div class="pdf-viewer-actions">
        <a class="pdf-btn" :href="pdfUrl" target="_blank" rel="noopener">新窗口打开</a>
        <a class="pdf-btn primary" :href="pdfUrl" download>下载 PDF</a>
      </div>
    </div>
    <iframe
      class="pdf-frame"
      :src="pdfUrl"
      :title="title || 'PDF 教程'"
      loading="lazy"
    />
  </div>
</template>
