/**
 * 从 interview-intel/langgraph-2026-07-06.md 解析标准口语答案
 * 用法: node scripts/parse-langgraph-intel-oral.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const INTEL = path.resolve(
  __dirname,
  '../../interview-intel/langgraph-2026-07-06.md'
)

/** 面经标题 → question slug */
export const TITLE_TO_SLUG = {
  'LangChain 和 LangGraph 有什么区别？': '002-vs-langchain',
  '为什么选 LangGraph？有什么缺点？': '003-why-choose-langgraph',
  '为什么选 LangGraph？有什么缺点？是否过度设计？': '003-why-choose-langgraph',
  'AgentState 是什么？为什么不用全局变量？': '014-agentstate-vs-global',
  'LangGraph 踩过什么坑？': '053-pitfalls',
  'checkpoint 是什么？如何防止膨胀？': '035-checkpointer',
  '节点间状态流转怎么设计？': '018-state-flow-between-nodes',
  '如何实现 Human-in-the-loop？': '037-human-in-the-loop',
  'LangGraph 如何实现 Human-in-the-loop？': '037-human-in-the-loop',
  '失败重试机制怎么设计？': '032-retry-mechanism',
  'LangGraph 如何实现循环？如何避免死循环？': '024-implement-cycle',
  '多 Agent / Supervisor 模式怎么设计？': '045-supervisor-pattern',
  'LangGraph vs Workflow，什么时候不必用 LangGraph？': '010-vs-workflow',
  'LangGraph 相比普通 Workflow 的最大价值是什么？': '010-vs-workflow',
  'Send API / Map-Reduce 并行': '029-send-api-parallel',
  '图定义变更后旧 thread 怎么办？': '059-graph-migration',
  'A2A 多 Agent 协议': '070-a2a-protocol',
}

export function parseIntelOralAnswers(md) {
  const results = []
  const headerRe = /P[012]-\d+\s*·\s*(.+?)(?:\s*`|\n)/g
  const headers = []
  let match

  while ((match = headerRe.exec(md)) !== null) {
    headers.push({ title: match[1].trim(), index: match.index })
  }

  for (let i = 0; i < headers.length; i++) {
    const start = headers[i].index
    const end = i + 1 < headers.length ? headers[i + 1].index : md.length
    const block = md.slice(start, end)

    const oralIdx = block.indexOf('🗣️ 标准口语答案')
    if (oralIdx === -1) continue

    let oral = block.slice(oralIdx)
    oral = oral.replace(/^🗣️ 标准口语答案\s*\n+/, '')
    const stopMarkers = ['🔍 追问方向', '\n---\n', '\n## ']
    for (const m of stopMarkers) {
      const idx = oral.indexOf(m)
      if (idx !== -1) oral = oral.slice(0, idx)
    }
    oral = oral.trim()
    if (oral.startsWith('"') && oral.endsWith('"')) {
      oral = oral.slice(1, -1).trim()
    } else if (oral.startsWith('"')) {
      oral = oral.slice(1).trim()
    }

    if (oral.length < 50) continue
    results.push({ title: headers[i].title, oral })
  }

  return results
}

export function buildSlugOralMap(md) {
  const map = {}
  for (const { title, oral } of parseIntelOralAnswers(md)) {
    const slug = TITLE_TO_SLUG[title]
    if (slug) map[slug] = oral
  }
  return map
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const md = fs.readFileSync(INTEL, 'utf-8')
  const map = buildSlugOralMap(md)
  console.log(JSON.stringify(map, null, 2))
  console.error(`\n✅ 解析 ${Object.keys(map).length} 条面经口语答案`)
}
