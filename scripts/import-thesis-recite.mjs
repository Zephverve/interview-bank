#!/usr/bin/env node
/**
 * 从「答辩问题（背诵版）.docx」导入通俗背诵回答，写入 custom/thesis-defense 对应题目。
 * 不覆盖 ### 回答（面试版），追加 ### 背诵回答。
 *
 * 用法: node scripts/import-thesis-recite.mjs [docx路径]
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const CUSTOM = path.join(ROOT, 'custom')
const DEFAULT_DOCX =
  '/Users/yuyu/WorkBuddy/2026-06-30-10-22-21/答辩问题（背诵版）.docx'

/** 背诵版模块顺序 → (目录, q编号) */
const MODULE_MAP = [
  {
    module: '一、医学背景 —— 先搞清楚我们要干什么',
    targets: [
      'thesis-defense-framework/q01',
      'thesis-defense-framework/q02',
      'thesis-defense-framework/q03',
      'thesis-defense-framework/q04',
      'thesis-defense-framework/q05',
      'thesis-defense-framework/q06',
      'thesis-defense-framework/q08',
    ],
  },
  {
    module: '二、数据处理 —— 把原始数据变成模型能吃的',
    targets: [
      'thesis-defense-preprocess/q01',
      'thesis-defense-preprocess/q02',
      'thesis-defense-preprocess/q03',
      'thesis-defense-preprocess/q04',
      'thesis-defense-preprocess/q05',
      'thesis-defense-preprocess/q06',
      'thesis-defense-preprocess/q07',
      'thesis-defense-preprocess/q08',
      'thesis-defense-preprocess/q09',
      'thesis-defense-preprocess/q10',
      'thesis-defense-preprocess/q11',
      'thesis-defense-preprocess/q13',
    ],
  },
  {
    module: '三、GMM聚类 —— 数据自己告诉我们该分几类',
    targets: [
      'thesis-defense-gmm/q01',
      'thesis-defense-gmm/q03',
      'thesis-defense-gmm/q04',
      'thesis-defense-gmm/q06',
      'thesis-defense-gmm/q07',
    ],
  },
  {
    module: '四、基础概念 —— 模型用到的基本零件',
    targets: [
      'thesis-defense-dl-basics/q01',
      'thesis-defense-dl-basics/q02',
      'thesis-defense-dl-basics/q03',
      'thesis-defense-dl-basics/q04',
      'thesis-defense-dl-basics/q05',
      'thesis-defense-dl-basics/q06',
    ],
  },
  {
    module: '五、核心模型 —— SPADE、MoE和四种策略大对决',
    targets: [
      'thesis-defense-model/q01',
      'thesis-defense-model/q02',
      'thesis-defense-model/q03',
      'thesis-defense-model/q04',
      'thesis-defense-model/q06',
      'thesis-defense-model/q07',
      'thesis-defense-model/q08',
      'thesis-defense-model/q10',
      'thesis-defense-model/q11',
      'thesis-defense-model/q12',
      'thesis-defense-model/q14',
      'thesis-defense-model/q16',
    ],
  },
  {
    module: '六、评价指标 —— 怎么判断模型好不好',
    targets: [
      'thesis-defense-metrics/q01',
      'thesis-defense-metrics/q02',
      'thesis-defense-metrics/q03',
      'thesis-defense-metrics/q05',
      'thesis-defense-metrics/q06',
      'thesis-defense-metrics/q07',
    ],
  },
  {
    module: '七、不足与改进 —— 诚实面对短板',
    targets: [
      'thesis-defense-deploy/q02',
      'thesis-defense-deploy/q03',
      'thesis-defense-deploy/q04',
    ],
  },
  {
    module: '八、创新与展望 —— 我们的贡献和未来',
    targets: [
      'thesis-defense-innovation/q01',
      'thesis-defense-innovation/q02',
      'thesis-defense-innovation/q03',
      'thesis-defense-innovation/q04',
      'thesis-defense-innovation/q05',
      'thesis-defense-innovation/q06',
      'thesis-defense-supplement/q01',
      'thesis-defense-supplement/q03',
      'thesis-defense-supplement/q04',
    ],
  },
]

function parseDocx(docxPath) {
  const pyScript = path.join(__dirname, 'parse-recite-docx.py')
  const out = execSync(`python3 "${pyScript}" "${docxPath}"`, { encoding: 'utf-8' })
  return JSON.parse(out.trim())
}

function findMdFile(prefix) {
  const dir = path.join(CUSTOM, prefix.split('/')[0])
  const num = prefix.split('/')[1]
  const files = fs.readdirSync(dir).filter((f) => f.startsWith(`${num}-`) && f.endsWith('.md'))
  if (!files.length) throw new Error(`找不到 ${prefix}`)
  return path.join(dir, files[0])
}

function upsertReciteSection(body, reciteAnswer) {
  const marker = /### 背诵回答[^\n]*\n[\s\S]*?(?=\n### 回答|\n*$)/
  const block = `### 背诵回答\n\n${reciteAnswer.trim()}\n\n`
  if (marker.test(body)) {
    return body.replace(marker, block)
  }
  const interviewMarker = /### 回答/
  if (!interviewMarker.test(body)) {
    throw new Error('缺少 ### 回答 段落')
  }
  return body.replace(interviewMarker, `${block}### 回答`)
}

function main() {
  const docxPath = process.argv[2] || DEFAULT_DOCX
  if (!fs.existsSync(docxPath)) {
    console.error(`找不到 docx: ${docxPath}`)
    process.exit(1)
  }

  const items = parseDocx(docxPath)
  const byModule = new Map()
  for (const item of items) {
    if (!byModule.has(item.module)) byModule.set(item.module, [])
    byModule.get(item.module).push(item)
  }

  let updated = 0
  for (const { module, targets } of MODULE_MAP) {
    const qs = byModule.get(module) || []
    if (qs.length !== targets.length) {
      console.warn(`⚠ ${module}: 背诵 ${qs.length} 题，映射 ${targets.length} 题`)
    }
    for (let i = 0; i < Math.min(qs.length, targets.length); i++) {
      const filePath = findMdFile(targets[i])
      const raw = fs.readFileSync(filePath, 'utf-8')
      const match = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n([\s\S]*)$/)
      if (!match) throw new Error(`frontmatter 解析失败: ${filePath}`)
      const newBody = upsertReciteSection(match[1], qs[i].answer)
      const frontmatter = raw.slice(0, raw.length - match[1].length)
      fs.writeFileSync(filePath, frontmatter + newBody, 'utf-8')
      updated += 1
      console.log(`✓ ${targets[i]} ← ${qs[i].question.slice(0, 36)}…`)
    }
  }

  console.log(`\n✅ 已写入 ${updated} 道题的背诵回答`)
}

main()
