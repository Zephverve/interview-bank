<template>
  <div v-if="show" class="reading-progress" :style="{ width: progress + '%' }" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const progress = ref(0)
const show = ref(false)

function onScroll() {
  const doc = document.documentElement
  const scrollTop = doc.scrollTop
  const height = doc.scrollHeight - doc.clientHeight
  progress.value = height > 0 ? (scrollTop / height) * 100 : 0
}

onMounted(() => {
  show.value = !!document.querySelector('.question-card, .section-card')
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), #8b5cf6);
  z-index: 100;
  transition: width 0.1s linear;
  box-shadow: 0 0 8px var(--vp-c-brand-1);
}
</style>
