import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const sidebar = JSON.parse(fs.readFileSync(path.join(__dirname, 'sidebar.json'), 'utf-8'))

export default defineConfig({
  title: '面试题库',
  description: '大模型应用工程师 Agent 方向 · 39 问完整答案',
  lang: 'zh-CN',
  base: process.env.VP_BASE || '/',
  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
      },
    ],
  ],
  themeConfig: {
    logo: '📚',
    nav: [
      { text: '首页', link: '/' },
      { text: '学习笔记', link: '/notes/hermes-agent' },
      { text: '我的题库', link: '/my' },
      { text: '添加题目', link: '/add' },
      { text: '复习指南', link: '/guide' },
    ],
    sidebar: [{ text: '目录', items: sidebar }],
    socialLinks: [],
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索题目', buttonAriaLabel: '搜索题目' },
          modal: {
            noResultsText: '没有找到相关题目',
            resetButtonTitle: '清除',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            },
          },
        },
      },
    },
    outline: false,
    aside: false,
    docFooter: { prev: '上一章', next: '下一章' },
    darkModeSwitchLabel: '主题',
    sidebarMenuLabel: '目录',
    returnToTopLabel: '回到顶部',
  },
  markdown: {
    lineNumbers: false,
  },
})
