<script setup lang="ts">
import { withBase, useRoute } from 'vitepress'

const route = useRoute()
const path = (route as { path?: string }).path || ''
const hidden = path === '/add' || path === '/my'
</script>

<template>
  <a v-if="!hidden" :href="withBase('/add')" class="fab-add" title="添加题目">+</a>
</template>

<style scoped>
.fab-add {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 50;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  font-size: 28px;
  font-weight: 300;
  line-height: 52px;
  text-align: center;
  text-decoration: none;
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.45);
  transition: transform 0.2s, box-shadow 0.2s;
}

.fab-add:hover {
  transform: scale(1.08);
  box-shadow: 0 8px 28px rgba(99, 102, 241, 0.55);
}

@media (max-width: 640px) {
  .fab-add {
    right: 16px;
    bottom: 16px;
    width: 48px;
    height: 48px;
    line-height: 48px;
    font-size: 26px;
  }
}
</style>
