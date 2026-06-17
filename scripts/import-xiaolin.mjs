/**
 * 从小林面试笔记 (xiaolinnote.com) 抓取题目，写入 custom/xiaolin-*/
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const CUSTOM = path.resolve(ROOT, 'custom')

const TOPICS = {
  'xiaolin-agent': {
    index: 'https://xiaolinnote.com/ai/agent/',
    prefix: '/ai/agent/',
    title: '小林 · Agent 面试题',
    icon: '🤖',
    color: '#8b5cf6',
    desc: 'Agent 概念 · 范式 · 记忆 · Multi-Agent',
    order: 10,
    tags: ['Agent', '小林笔记'],
  },
  'xiaolin-rag': {
    index: 'https://xiaolinnote.com/ai/rag/',
    prefix: '/ai/rag/',
    title: '小林 · RAG 面试题',
    icon: '🔍',
    color: '#0ea5e9',
    desc: 'RAG 原理 · 切分 · 检索优化 · 落地',
    order: 11,
    tags: ['RAG', '小林笔记'],
  },
  'xiaolin-tools': {
    index: 'https://xiaolinnote.com/ai/tools/',
    prefix: '/ai/tools/',
    title: '小林 · 工具调用面试题',
    icon: '🔧',
    color: '#f59e0b',
    desc: 'Function Calling · MCP · Skill · A2A',
    order: 12,
    tags: ['工具调用', 'MCP', '小林笔记'],
  },
  'xiaolin-llm': {
    index: 'https://xiaolinnote.com/ai/llm/',
    prefix: '/ai/llm/',
    title: '小林 · 大模型工程面试题',
    icon: '🧠',
    color: '#6366f1',
    desc: 'Transformer · 微调 · 推理 · 部署',
    order: 13,
    tags: ['LLM', '小林笔记'],
  },
}

// 与已有题库高度重合、跳过导入的题（按题干预匹配）
const SKIP_PATTERNS = [
  /多\s*Agent/i,
  /RAG.*切分|文档切分|Chunking/i,
  /Function Calling.*设计|工具.*设计.*稳定/i,
  /幻觉.*产生|为什么会出现幻觉/i,
  /Prompt Engineering|如何写好 Prompt/i,
  /向量数据库.*选|FAISS.*Milvus/i,
  /长上下文|记忆管理|context window/i,
  /QLoRA|灾难性遗忘/i,
  /LangGraph.*LangChain/i,
]

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/h3>/gi, '\n\n')
    .replace(/<h3[^>]*>/gi, '\n\n### ')
    .replace(/<\/h[12]>/gi, '\n\n')
    .replace(/<h[12][^>]*>/gi, '\n\n## ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li[^>]*>/gi, '- ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function extractMain(html) {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)
  return m ? m[1] : html
}

function extractTitle(mainHtml) {
  const m = mainHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  if (!m) return ''
  let t = stripHtml(m[1])
  t = t.replace(/\s*\|\s*小林面试笔记.*$/, '').trim()
  // 去掉题号前缀 "1. "
  return t.replace(/^\d+\.\s*/, '')
}

function findHeadingStart(html, fromIdx, text) {
  const re = /<h[23][^>]*>[\s\S]*?<\/h[23]>/gi
  let m
  while ((m = re.exec(html))) {
    if (m.index < fromIdx) continue
    const inner = m[0].replace(/<\/?h[23][^>]*>/gi, '')
    if (stripHtml(inner).includes(text)) return m.index
  }
  return -1
}

function headingContentEnd(html, startIdx) {
  const close = html.indexOf('</h', startIdx)
  return html.indexOf('>', close) + 1
}

function extractBetweenHeadings(mainHtml, startText, endText) {
  const startIdx = findHeadingStart(mainHtml, 0, startText)
  if (startIdx === -1) return ''

  const afterHeading = headingContentEnd(mainHtml, startIdx)
  let endIdx = mainHtml.length

  if (endText) {
    const endStart = findHeadingStart(mainHtml, afterHeading, endText)
    if (endStart !== -1) endIdx = endStart
  }

  return cleanContent(stripHtml(mainHtml.slice(afterHeading, endIdx)))
}

function extractSection(mainHtml, headingText, endBefore) {
  if (endBefore) return extractBetweenHeadings(mainHtml, headingText, endBefore)
  const escaped = headingText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(
    `<h[23][^>]*>(?:[\\s\\S]*?)${escaped}(?:[\\s\\S]*?)<\\/h[23]>([\\s\\S]*?)(?=<h[23][^>]*>|$)`,
    'i'
  )
  const m = mainHtml.match(re)
  return m ? cleanContent(stripHtml(m[1])) : ''
}

function cleanContent(text) {
  return text
    .replace(/上一页[\s\S]*?下一页[\s\S]*$/m, '')
    .replace(/对了，[\s\S]*?别错过最新干货哦！/g, '')
    .replace(/公众号@小林面试笔记[\s\S]*?$/m, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function extractInterviewSummary(mainHtml) {
  return cleanContent(extractSection(mainHtml, '面试总结'))
}

function extractDialogue(mainHtml) {
  const re = /<h2[^>]*>(?:[\s\S]*?)<\/h2>([\s\S]*?)(?=<h2[^>]*>(?:[\s\S]*?)简要回答)/i
  const m = mainHtml.match(re)
  if (!m) return ''
  const text = stripHtml(m[1])
  const lines = text.split('\n').filter((l) => /^(👔|🙋)/.test(l.trim()))
  return lines.slice(0, 8).join('\n\n')
}

function slugify(text) {
  return (
    text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fff-]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 48) || 'question'
  )
}

function loadExistingQuestions() {
  const existing = []
  const dirs = [path.resolve(ROOT, 'data'), CUSTOM]
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue
    const walk = (d) => {
      for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
        if (ent.name.startsWith('_') || ent.name.startsWith('xiaolin')) continue
        const p = path.join(d, ent.name)
        if (ent.isDirectory()) walk(p)
        else if (ent.name.endsWith('.md')) {
          const raw = fs.readFileSync(p, 'utf-8')
          const q = raw.match(/\*\*题目\*\*：(.+)/)?.[1] || raw.match(/title:\s*(.+)/)?.[1] || ''
          if (q) existing.push(q.trim())
        }
      }
    }
    walk(dir)
  }
  return existing
}

function shouldSkip(question) {
  return SKIP_PATTERNS.some((p) => p.test(question))
}

function firstSentence(text, maxLen = 120) {
  const s = text.split(/[。！？\n]/).find((x) => x.trim().length > 10) || text
  const t = s.trim()
  return t.length > maxLen ? t.slice(0, maxLen) + '…' : t
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'interview-bank-import/1.0 (personal study)' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`)
  return res.text()
}

async function discoverLinks(indexUrl, prefix) {
  const html = await fetchHtml(indexUrl)
  const re = new RegExp(`href="${prefix.replace(/\//g, '\\/')}([^"]+\\.html)"`, 'g')
  const links = new Set()
  let m
  while ((m = re.exec(html))) {
    const file = m[1]
    if (file.includes('_info')) continue
    links.add(`https://xiaolinnote.com${prefix}${file}`)
  }
  return [...links].sort()
}

function buildMarkdown({ title, question, brief, detail, summary, dialogue, meta }) {
  const conclusion = firstSentence(brief || summary || detail)
  const parts = []

  parts.push('---')
  parts.push(`title: ${title}`)
  parts.push('round: 一面/二面')
  parts.push('difficulty: ⭐⭐⭐')
  parts.push(`tags: [${meta.tags.join(', ')}]`)
  parts.push(`point: ${title.slice(0, 30)}`)
  parts.push('source: 小林面试笔记')
  parts.push('---')
  parts.push('')
  parts.push(`**题目**：${question}`)
  parts.push('')
  if (conclusion) {
    parts.push(`**结论句（15 秒）**：${conclusion}`)
    parts.push('')
  }
  parts.push('**追问方向**：结合项目经历举例 · 优缺点与适用场景')
  parts.push('')
  parts.push('### 回答')
  parts.push('')
  if (dialogue) {
    parts.push('**面试现场复盘**')
    parts.push('')
    parts.push(dialogue)
    parts.push('')
  }
  if (brief) {
    parts.push('**简要回答**')
    parts.push('')
    parts.push(brief)
    parts.push('')
  }
  if (detail) {
    parts.push('**详细解析**')
    parts.push('')
    parts.push(detail)
    parts.push('')
  }
  if (summary) {
    parts.push('**面试总结**')
    parts.push('')
    parts.push(summary)
  }

  return parts.join('\n')
}

async function importTopic(slug, config, existing) {
  const outDir = path.join(CUSTOM, slug)
  fs.mkdirSync(outDir, { recursive: true })

  fs.writeFileSync(
    path.join(outDir, '_category.yaml'),
    `title: ${config.title}\nicon: ${config.icon}\ncolor: "${config.color}"\ndesc: ${config.desc}\norder: ${config.order}\n`,
    'utf-8'
  )

  const links = await discoverLinks(config.index, config.prefix)
  console.log(`\n📂 ${slug}: 发现 ${links.length} 道题`)

  let imported = 0
  let skipped = 0

  for (const url of links) {
    const fileSlug = path.basename(url, '.html').replace(/^\d+_/, '')
    const html = await fetchHtml(url)
    const main = extractMain(html)
    let fullTitle = extractTitle(main)
    if (!fullTitle) {
      const tm = html.match(/<title>([^<|]+)/)
      fullTitle = tm ? tm[1].replace(/^\d+\.\s*/, '').trim() : fileSlug
    }

    const question = fullTitle.includes('？') || fullTitle.includes('?') ? fullTitle : fullTitle
    const title = fullTitle.length > 40 ? fullTitle.slice(0, 40) + '…' : fullTitle

    if (shouldSkip(question) || shouldSkip(title)) {
      console.log(`  ⏭ 跳过（已有类似题）: ${title}`)
      skipped++
      continue
    }

    const brief = cleanContent(extractSection(main, '简要回答'))
    const detail = extractSection(main, '详细解析', '面试总结')
    const summary = extractInterviewSummary(main)
    const dialogue = extractDialogue(main)

    if (!brief && !detail && !summary) {
      console.log(`  ⚠ 内容为空，跳过: ${url}`)
      skipped++
      continue
    }

    const md = buildMarkdown({
      title,
      question,
      brief,
      detail,
      summary,
      dialogue,
      meta: config,
    })

    const outFile = path.join(outDir, `${fileSlug}.md`)
    fs.writeFileSync(outFile, md, 'utf-8')
    console.log(`  ✓ ${fileSlug}.md — ${title}`)
    imported++

    await new Promise((r) => setTimeout(r, 300))
  }

  return { imported, skipped, total: links.length }
}

async function main() {
  const existing = loadExistingQuestions()
  console.log(`已有题库 ${existing.length} 道题，开始抓取小林笔记…`)

  let totalImported = 0
  let totalSkipped = 0

  for (const [slug, config] of Object.entries(TOPICS)) {
    const r = await importTopic(slug, config, existing)
    totalImported += r.imported
    totalSkipped += r.skipped
  }

  console.log(`\n✅ 完成：导入 ${totalImported} 题，跳过 ${totalSkipped} 题`)
  console.log('下一步: npm run prepare')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
