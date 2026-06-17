#!/usr/bin/env node
/**
 * 快速添加自定义面试题
 * 用法: npm run new-question -- <分类> "<题目标题>"
 * 示例: npm run new-question -- 3d-lidar "PointNet 如何处理点云无序性"
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const CUSTOM = path.resolve(ROOT, 'custom')

const [categoryArg, titleArg, ...rest] = process.argv.slice(2)

if (!categoryArg || !titleArg) {
  console.log(`
用法: npm run new-question -- <分类文件夹名> "<题目标题>"

示例:
  npm run new-question -- 3d-lidar "PointNet 如何处理点云无序性"
  npm run new-question -- backend "Redis 缓存穿透怎么解决"

分类文件夹会自动创建在 custom/<分类>/ 下。
`)
  process.exit(1)
}

const category = categoryArg.toLowerCase().replace(/[^\w\u4e00-\u9fff-]+/g, '-')
const title = titleArg
const slug = title
  .toLowerCase()
  .replace(/[^\w\u4e00-\u9fff]+/g, '-')
  .replace(/^-|-$/g, '')
  .slice(0, 40) || 'question'

const categoryDir = path.join(CUSTOM, category)
fs.mkdirSync(categoryDir, { recursive: true })

const categoryYaml = path.join(categoryDir, '_category.yaml')
if (!fs.existsSync(categoryYaml)) {
  const displayName = category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  fs.writeFileSync(
    categoryYaml,
    `title: ${displayName}\nicon: ✏️\ncolor: "#14b8a6"\ndesc: 自定义面试题\norder: 1\n`,
    'utf-8'
  )
  console.log(`✓ 创建分类配置: custom/${category}/_category.yaml`)
  console.log(`  → 可编辑 title / icon / color / desc`)
}

let filePath = path.join(categoryDir, `${slug}.md`)
let counter = 1
while (fs.existsSync(filePath)) {
  filePath = path.join(categoryDir, `${slug}-${counter}.md`)
  counter++
}

const content = `---
title: ${title}
round: 一面
difficulty: ⭐⭐⭐
tags: []
point:
---

**题目**：${title}

**结论句（15 秒）**：（先用一句话概括核心答案）

**追问方向**：（面试官可能追问什么？）

### 回答

（在此填写完整回答，口语化、可直接背诵）

`

fs.writeFileSync(filePath, content, 'utf-8')

console.log(`✓ 创建题目: custom/${category}/${path.basename(filePath)}`)
console.log(`\n下一步:`)
console.log(`  1. 编辑上述文件，填写结论句和答案`)
console.log(`  2. 运行 npm run prepare 刷新站点`)
console.log(`  3. 运行 npm run dev 预览`)
