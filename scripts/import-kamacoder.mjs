/**
 * 从卡码笔记 (notes.kamacoder.com) 抓取大模型面经，写入 custom/kama-*/
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const CUSTOM = path.resolve(ROOT, 'custom')
const BASE = 'https://notes.kamacoder.com/interview/llm/'

const ARTICLES = [
  'vibe_coding_interview.html',
  'claude_code_deep_dive.html',
  'ai_enhanced_development_openspec_superpowers_gstack.html',
  'claude_code_grep_rag_interview.html',
  'claude_code_context_window_interview.html',
  'rag_interview.html',
  'rag_hardest_parts_interview.html',
  'graphrag_interview.html',
  'finetuning_sft_rlhf_interview.html',
  'agent_interview.html',
  'harness_interview.html',
  'multi_agent_communication_interview.html',
  'multi_agent_harness_interview.html',
  'agent_harness_observability_interview.html',
  'agent_skill_interview.html',
  'agent_framework_comparison.html',
  'agent_hybrid_routing_interview.html',
  'agent_drift_hallucination_interview.html',
  'agent_hallucination_control_interview.html',
  'transformer_interview.html',
  '20260506bytedance.html',
]

const CATEGORIES = {
  'kama-ai-coding': {
    title: '卡码 · AI 编程',
    icon: '💻',
    color: '#06b6d4',
    desc: 'Vibe Coding · Claude Code · 上下文工程',
    order: 20,
    tags: ['AI编程', '卡码笔记'],
    match: (f) =>
      /vibe_coding|claude_code|ai_enhanced/.test(f),
  },
  'kama-rag': {
    title: '卡码 · RAG',
    icon: '🔍',
    color: '#0ea5e9',
    desc: 'RAG 汇总 · 落地难点 · GraphRAG',
    order: 21,
    tags: ['RAG', '卡码笔记'],
    match: (f) => /^rag_|graphrag/.test(f),
  },
  'kama-finetune': {
    title: '卡码 · 模型微调',
    icon: '🎯',
    color: '#f97316',
    desc: 'SFT · RLHF · DPO · 微调取舍',
    order: 22,
    tags: ['微调', '卡码笔记'],
    match: (f) => /finetuning/.test(f),
  },
  'kama-agent': {
    title: '卡码 · Agent',
    icon: '🤖',
    color: '#8b5cf6',
    desc: 'Agent · Harness · 多Agent · Skill',
    order: 23,
    tags: ['Agent', '卡码笔记'],
    match: (f) =>
      /agent_|multi_agent|harness/.test(f) && !/bytedance/.test(f),
  },
  'kama-transformer': {
    title: '卡码 · Transformer',
    icon: '🧠',
    color: '#6366f1',
    desc: 'Self-Attention · 架构 · 复杂度',
    order: 24,
    tags: ['Transformer', '卡码笔记'],
    match: (f) => /transformer/.test(f),
  },
  'kama-real': {
    title: '卡码 · 真实面经',
    icon: '📋',
    color: '#ec4899',
    desc: '字节等大厂真实面试题',
    order: 25,
    tags: ['面经', '卡码笔记'],
    match: (f) => /bytedance/.test(f),
  },
}

function stripInline(html) {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/#/g, '')
    .trim()
}

function htmlBlockToText(html) {
  let s = html
  s = s.replace(/<script[\s\S]*?<\/script>/gi, '')
  s = s.replace(/<style[\s\S]*?<\/style>/gi, '')
  s = s.replace(/<br\s*\/?>/gi, '\n')
  s = s.replace(/<\/p>/gi, '\n\n')
  s = s.replace(/<\/li>/gi, '\n')
  s = s.replace(/<li[^>]*>/gi, '- ')
  s = s.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, inner) => `\n\n### ${stripInline(inner)}\n\n`)
  s = s.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, inner) => `\n\n#### ${stripInline(inner)}\n\n`)
  s = s.replace(/<[^>]+>/g, '')
  s = s.replace(/\n{3,}/g, '\n\n')
  return s.trim()
}

function slugify(text) {
  return (
    text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fff-]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 56) || 'question'
  )
}

function isQuestionHeading(text) {
  if (!text || text === '目录') return false
  if (/^\d+\.\s/.test(text)) return true
  if (/[？?]$/.test(text) && text.length > 12) return true
  return false
}

function isSectionOnlyArticle(questions) {
  return questions.length === 0
}

function firstSentence(text, maxLen = 120) {
  const s = text.split(/[。！？\n]/).find((x) => x.trim().length > 10) || text
  const t = s.trim()
  return t.length > maxLen ? t.slice(0, maxLen) + '…' : t
}

function extractPage(html) {
  const titleM = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  const pageTitle = titleM ? stripInline(titleM[1]) : ''
  const bodyM = html.match(
    /class="theme-default-content content__default"[^>]*>([\s\S]*?)<\/div>\s*<footer/i
  )
  if (!bodyM) return { pageTitle, blocks: [], fullBody: '' }
  const body = bodyM[1]

  const parts = body.split(/(?=<h2[^>]*>)/i).filter((p) => /^<h2/i.test(p))
  const blocks = []

  for (const part of parts) {
    const hm = part.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i)
    if (!hm) continue
    const heading = stripInline(hm[1])
    const contentHtml = part.replace(/<h2[^>]*>[\s\S]*?<\/h2>/i, '')
    const content = htmlBlockToText(contentHtml)
    blocks.push({ heading, content })
  }

  const introM = body.match(/^([\s\S]*?)(?=<h2)/i)
  const intro = introM ? htmlBlockToText(introM[1]) : ''

  return { pageTitle, blocks, intro, fullBody: htmlBlockToText(body) }
}

function pickCategory(file) {
  for (const [slug, meta] of Object.entries(CATEGORIES)) {
    if (meta.match(file)) return slug
  }
  return 'kama-agent'
}

function buildQuestionMd({ title, question, answer, meta, sourceUrl, articleTitle }) {
  const conclusion = firstSentence(answer)
  const lines = [
    '---',
    `title: ${title}`,
    'round: 一面/二面',
    'difficulty: ⭐⭐⭐',
    `tags: [${meta.tags.join(', ')}]`,
    `point: ${title.slice(0, 28)}`,
    'source: 卡码笔记',
    `sourceUrl: ${sourceUrl}`,
    '---',
    '',
    `**题目**：${question}`,
    '',
    `**结论句（15 秒）**：${conclusion}`,
    '',
    '**追问方向**：结合项目经历举例 · 优缺点与工程取舍',
    '',
    '### 回答',
    '',
    answer.trim(),
  ]
  if (articleTitle && articleTitle !== question) {
    lines.splice(8, 0, '', `> 来源文章：${articleTitle}`, '')
  }
  return lines.join('\n')
}

function buildArticleMd({ title, body, meta, sourceUrl }) {
  const conclusion = firstSentence(body)
  const sections = body.split(/\n(?=## )/).filter(Boolean)
  if (sections.length <= 1) {
    return buildQuestionMd({
      title: title.length > 40 ? title.slice(0, 40) + '…' : title,
      question: title,
      answer: body,
      meta,
      sourceUrl,
    })
  }

  const lines = [
    '---',
    `title: ${title.length > 40 ? title.slice(0, 40) + '…' : title}`,
    'round: 一面/二面',
    'difficulty: ⭐⭐⭐',
    `tags: [${meta.tags.join(', ')}]`,
    `point: ${title.slice(0, 28)}`,
    'source: 卡码笔记',
    `sourceUrl: ${sourceUrl}`,
    '---',
    '',
    ...sections.flatMap((sec) => {
      const m = sec.match(/^## (.+)/)
      if (!m) return [sec, '']
      const qTitle = m[1].trim()
      const ans = sec.replace(/^## .+\n?/, '').trim()
      return [
        `## ${qTitle}`,
        '',
        `**题目**：${qTitle}`,
        '',
        `**结论句（15 秒）**：${firstSentence(ans)}`,
        '',
        '### 回答',
        '',
        ans,
        '',
        '---',
        '',
      ]
    }),
  ]
  return lines.join('\n').replace(/\n---\n\n$/, '')
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'interview-bank-import/1.0 (personal study)' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`)
  return res.text()
}

async function main() {
  const written = {}

  for (const file of ARTICLES) {
    const url = BASE + file
    const catSlug = pickCategory(file)
    const meta = CATEGORIES[catSlug]
    const outDir = path.join(CUSTOM, catSlug)
    fs.mkdirSync(outDir, { recursive: true })

    console.log(`\n📄 ${file} → ${catSlug}`)
    const html = await fetchHtml(url)
    const { pageTitle, blocks, intro, fullBody } = extractPage(html)
    const articleSlug = file.replace(/\.html$/, '')

    const questions = blocks.filter((b) => isQuestionHeading(b.heading))

    if (isSectionOnlyArticle(questions)) {
      let body = fullBody
      if (intro) body = intro + '\n\n' + blocks.map((b) => `## ${b.heading}\n\n${b.content}`).join('\n\n')
      const md = buildArticleMd({
        title: pageTitle || articleSlug,
        body,
        meta,
        sourceUrl: url,
      })
      const outFile = path.join(outDir, `${articleSlug}.md`)
      fs.writeFileSync(outFile, md, 'utf-8')
      written[catSlug] = (written[catSlug] || 0) + 1
      console.log(`  ✓ ${articleSlug}.md（整篇 ${body.length} 字）`)
    } else {
      for (const [i, q] of questions.entries()) {
        const numM = q.heading.match(/^(\d+)\./)
        const fileSlug = numM
          ? `${articleSlug}-q${numM[1]}`
          : `${articleSlug}-${slugify(q.heading)}`
        const title =
          q.heading.length > 42 ? q.heading.slice(0, 42) + '…' : q.heading
        let answer = q.content
        if (i === 0 && intro) answer = intro + '\n\n' + answer

        const md = buildQuestionMd({
          title,
          question: q.heading,
          answer,
          meta,
          sourceUrl: url,
          articleTitle: pageTitle,
        })
        fs.writeFileSync(path.join(outDir, `${fileSlug}.md`), md, 'utf-8')
        written[catSlug] = (written[catSlug] || 0) + 1
        console.log(`  ✓ ${fileSlug}.md (${answer.length} 字)`)
      }
    }

    await new Promise((r) => setTimeout(r, 400))
  }

  for (const [slug, meta] of Object.entries(CATEGORIES)) {
    const dir = path.join(CUSTOM, slug)
    if (!fs.existsSync(dir)) continue
    fs.writeFileSync(
      path.join(dir, '_category.yaml'),
      `title: ${meta.title}\nicon: ${meta.icon}\ncolor: "${meta.color}"\ndesc: ${meta.desc}\norder: ${meta.order}\n`,
      'utf-8'
    )
  }

  const total = Object.values(written).reduce((a, b) => a + b, 0)
  console.log(`\n✅ 完成：共 ${total} 题/篇`)
  for (const [k, v] of Object.entries(written)) {
    console.log(`   ${k}: ${v}`)
  }
  console.log('下一步: npm run prepare')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
