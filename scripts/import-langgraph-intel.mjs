/**
 * 从 langgraph-questions/*.mjs 导入 LangGraph 面经题库到 custom/langgraph-*
 * 用法: npm run import-langgraph
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildSlugOralMap } from './parse-langgraph-intel-oral.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const CUSTOM = path.resolve(ROOT, 'custom')
const DATA_DIR = path.resolve(__dirname, 'langgraph-questions')
const INTEL_MD = path.resolve(ROOT, '../interview-intel/langgraph-2026-07-06.md')

let intelOralMap = {}
try {
  intelOralMap = buildSlugOralMap(fs.readFileSync(INTEL_MD, 'utf-8'))
} catch {
  console.warn('⚠ 未找到面经原文，将使用题库内置口语答案')
}

const CATEGORIES = {
  'langgraph-basics': {
    slug: 'langgraph-basics',
    title: 'LangGraph · 基础概念',
    icon: '🕸️',
    color: '#6366f1',
    desc: '定位 · LangChain 对比 · 选型 · 核心组件',
    order: 50,
    tags: ['LangGraph', '基础'],
  },
  'langgraph-state': {
    slug: 'langgraph-state',
    title: 'LangGraph · 状态管理',
    icon: '📦',
    color: '#0ea5e9',
    desc: 'State · AgentState · reducer · 并发写',
    order: 51,
    tags: ['LangGraph', '状态'],
  },
  'langgraph-flow': {
    slug: 'langgraph-flow',
    title: 'LangGraph · 控制流',
    icon: '🔀',
    color: '#8b5cf6',
    desc: '循环 · 条件边 · 重试 · fallback',
    order: 52,
    tags: ['LangGraph', '控制流'],
  },
  'langgraph-hitl': {
    slug: 'langgraph-hitl',
    title: 'LangGraph · 持久化与 HITL',
    icon: '⏸️',
    color: '#f59e0b',
    desc: 'checkpoint · interrupt · thread_id · 流式',
    order: 53,
    tags: ['LangGraph', 'HITL'],
  },
  'langgraph-multi': {
    slug: 'langgraph-multi',
    title: 'LangGraph · 多 Agent',
    icon: '👥',
    color: '#10b981',
    desc: 'Supervisor · 子图 · Handoff · 编排模式',
    order: 54,
    tags: ['LangGraph', '多Agent'],
  },
  'langgraph-production': {
    slug: 'langgraph-production',
    title: 'LangGraph · 工程实践',
    icon: '🚀',
    color: '#ef4444',
    desc: '踩坑 · 监控 · 测试 · 部署 · RAG 集成',
    order: 55,
    tags: ['LangGraph', '工程'],
  },
  'langgraph-real': {
    slug: 'langgraph-real',
    title: 'LangGraph · 真实面经',
    icon: '📋',
    color: '#ec4899',
    desc: '阿里 · 字节 · 百度 · 高德 · 系统设计',
    order: 56,
    tags: ['LangGraph', '面经'],
  },
  'langgraph-advanced': {
    slug: 'langgraph-advanced',
    title: 'LangGraph · 进阶扩展',
    icon: '🔬',
    color: '#64748b',
    desc: 'GitHub 100 题覆盖 · 安全 · 成本 · 版本',
    order: 57,
    tags: ['LangGraph', '进阶'],
  },
}

function yamlQuote(s) {
  return JSON.stringify(String(s))
}

/** 将 detailAnswer 的①②③结构压成连贯口播稿 */
function flattenDetailToOral(text) {
  return text
    .replace(/\*\*[①②③④⑤⑥][^*]+\*\*\n\n?/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/** 将 detailAnswer 改写成面经口播风格 */
function toIntelStyle(q, detail) {
  const flat = flattenDetailToOral(detail)
  if (!flat) return ''

  if (/^我(会|选|踩|按|设计|习惯|同意|认为|先)/.test(flat)) return flat

  const title = q.title || ''
  let opener = ''

  if (/区别|对比|vs|VS/.test(title)) {
    opener = '我会先把定位说清楚：'
  } else if (/为什么选|过度设计|缺点/.test(title)) {
    opener = '我选 LangGraph 不是因为追新，而是业务上确实需要这套能力。'
  } else if (/踩坑|坑/.test(title)) {
    opener = '结合我实际做 Agent 项目的经验，我踩过几个比较典型的坑。'
  } else if (/checkpoint|持久化|thread/i.test(title)) {
    opener = '我会从 checkpoint 解决什么问题讲起。'
  } else if (/State|state|reducer|全局/i.test(title)) {
    opener = '我先说结论，再展开原因。'
  } else if (/interrupt|HITL|人工/i.test(title)) {
    opener = 'Human-in-the-loop 在 LangGraph 里主要靠 interrupt 机制落地。'
  } else if (/重试|fallback|retry/i.test(title)) {
    opener = '我一般会按分层来设计重试，而不是在一个 try-except 里兜一切。'
  } else if (/循环|死循环|recursion/i.test(title)) {
    opener = '循环在 LangGraph 里靠回边实现，防死循环要设好几道保险。'
  } else if (/Supervisor|多 Agent|子图|Handoff/i.test(title)) {
    opener = '多 Agent 编排我最常见的是 Supervisor 模式，复杂场景再拆子图。'
  } else if (/部署|生产|监控|测试/i.test(title)) {
    opener = '上线 Agent 图时，我会把可观测性和失败路径放在和主流程同一优先级。'
  } else {
    opener = '这道题我会这样回答面试官：'
  }

  if (flat.startsWith(opener)) return flat
  return `${opener}\n\n${flat}`
}

/** 标准口语答案：面经原文优先，否则改写成面经口播风格 */
function standardOralAnswer(q) {
  if (intelOralMap[q.slug]) return intelOralMap[q.slug]

  const oral = (q.oralAnswer || '').trim()
  const detail = (q.detailAnswer || '').trim()

  if (detail && detail.length > oral.length + 80) {
    return toIntelStyle(q, detail)
  }
  if (oral && /^我(会|选|踩|按|设计|习惯)/.test(oral)) return oral
  if (oral) return toIntelStyle(q, oral)
  return toIntelStyle(q, detail)
}

function buildQuestionMd(q, meta) {
  const displayTitle = q.title.length > 48 ? `${q.title.slice(0, 48)}…` : q.title
  const tags = [...new Set([...(q.tags || []), ...meta.tags])]
  const oral = standardOralAnswer(q)

  const body = [
    '---',
    `title: ${yamlQuote(displayTitle)}`,
    `round: ${q.round || '一面/二面'}`,
    `difficulty: ${q.difficulty || '⭐⭐⭐'}`,
    `tags: [${tags.join(', ')}]`,
    `point: ${yamlQuote(q.point || meta.title)}`,
    `source: ${q.source || 'LangGraph 面经整理'}`,
    q.sourceUrl ? `sourceUrl: ${q.sourceUrl}` : null,
    '---',
    '',
    `**题目**：${q.title}`,
    '',
    `**结论句（15 秒）**：${q.conclusion}`,
    '',
    `**追问方向**：${q.followups}`,
    '',
    '### 回答',
    '',
    q.priority ? `**优先级**：${q.priority}${q.freq ? ` · ${q.freq}` : ''}` : null,
    '',
    '**🗣️ 标准口语答案**',
    '',
    oral,
    '',
    q.extra ? `**🔍 补充追问**\n\n${q.extra}` : null,
    '',
  ]
    .filter((line) => line !== null)
    .join('\n')

  return body
}

function writeCategoryYaml(dir, meta) {
  const yaml = [
    `title: ${meta.title}`,
    `icon: ${meta.icon}`,
    `color: "${meta.color}"`,
    `desc: ${meta.desc}`,
    `order: ${meta.order}`,
    '',
  ].join('\n')
  fs.writeFileSync(path.join(dir, '_category.yaml'), yaml, 'utf-8')
}

async function main() {
  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.mjs'))
  let total = 0
  const summary = []

  for (const file of files) {
    const categoryKey = file.replace('.mjs', '')
    const meta = CATEGORIES[categoryKey]
    if (!meta) {
      console.warn(`⚠ 跳过未知分类: ${file}`)
      continue
    }

    const mod = await import(path.join(DATA_DIR, file))
    const questions = mod.default || []
    const outDir = path.join(CUSTOM, meta.slug)
    fs.mkdirSync(outDir, { recursive: true })

    for (const q of questions) {
      const md = buildQuestionMd(q, meta)
      fs.writeFileSync(path.join(outDir, `${q.slug}.md`), md, 'utf-8')
      total++
    }

    writeCategoryYaml(outDir, meta)
    summary.push(`✓ ${meta.slug} (${questions.length} 题)`)
  }

  console.log('\n' + summary.join('\n'))
  console.log(`\n✅ 共导入 ${total} 题 → custom/langgraph-*`)
  console.log('下一步: npm run prepare')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
