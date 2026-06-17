<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import ProgressBar from './components/ProgressBar.vue'
import FloatingAddBtn from './components/FloatingAddBtn.vue'

const { Layout: ParentLayout } = DefaultTheme
</script>

<template>
  <ParentLayout>
    <template #layout-top>
      <ProgressBar />
    </template>
    <template #layout-bottom>
      <FloatingAddBtn />
    </template>
  </ParentLayout>
</template>
