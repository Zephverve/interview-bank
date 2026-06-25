import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const SOURCE_CANDIDATES = [
  path.resolve(ROOT, 'data', '面试35问-完整合集.md'),
  path.resolve(ROOT, '..', '面试35问-完整合集.md'),
]
const SOURCE = SOURCE_CANDIDATES.find((p) => fs.existsSync(p)) || SOURCE_CANDIDATES[0]
const CUSTOM = path.resolve(ROOT, 'custom')
const DOCS = path.resolve(ROOT, 'docs')
const NOTES = path.resolve(ROOT, 'notes')

/** Hermes 笔记分章：小章合并，大章独立 */
const HERMES_CHAPTER_GROUPS = [
  { slug: 'prelude', sidebar: '前导课', patterns: [/^🎓 前导课/] },
  { slug: 'basics', sidebar: '第一~三章 · 入门', patterns: [/^第一章/, /^第二章/, /^第三章/] },
  { slug: 'architecture', sidebar: '第四章 · 整体架构', patterns: [/^第四章/] },
  { slug: 'memory', sidebar: '第五章 · 记忆系统', patterns: [/^第五章/] },
  { slug: 'skills', sidebar: '第六章 · 技能系统', patterns: [/^第六章/] },
  { slug: 'evolution', sidebar: '第七章 · 自进化闭环', patterns: [/^第七章/] },
  { slug: 'context', sidebar: '第八章 · 上下文压缩', patterns: [/^第八章/] },
  { slug: 'tools', sidebar: '第九章 · 工具系统', patterns: [/^第九章/] },
  { slug: 'models', sidebar: '第十章 · 模型无关', patterns: [/^第十章/] },
  { slug: 'runtime', sidebar: '第十一~十二章 · 运行与接入', patterns: [/^第十一章/, /^第十二章/] },
  { slug: 'loop', sidebar: '第十三章 · 主循环', patterns: [/^第十三章/] },
  { slug: 'delegate-cron', sidebar: '第十四~十五章 · 委派与定时', patterns: [/^第十四章/, /^第十五章/] },
  { slug: 'mcp-rl', sidebar: '第十六~十七章 · MCP 与 RL', patterns: [/^第十六章/, /^第十七章/] },
  { slug: 'security-deploy', sidebar: '第十八~十九章 · 安全与部署', patterns: [/^第十八章/, /^第十九章/] },
  { slug: 'compare-summary', sidebar: '第二十~二十一章 · 对比与讲解', patterns: [/^第二十章/, /^第二十一章/] },
  {
    slug: 'interview-core',
    sidebar: '第二十二~二十四章 · 面试题',
    patterns: [/^第二十二章/, /^第二十三章/, /^第二十四章/],
  },
  {
    slug: 'interview-practice',
    sidebar: '第二十五~二十六章 · 设计与话术',
    patterns: [/^第二十五章/, /^第二十六章/],
  },
  { slug: 'advanced', sidebar: '第二十七章 · 进阶与附录', patterns: [/^第二十七章/, /^附录/] },
]

/** 学习笔记：原文完整拷贝到 docs/notes/，不做题目卡片转换 */
const NOTE_ENTRIES = [
  {
    slug: 'hermes-agent',
    title: 'Hermes Agent 学习笔记',
    desc: '通俗详解 · 架构 · 记忆 · 技能 · 面试题',
    icon: '📖',
    color: '#7c3aed',
    splitChapters: HERMES_CHAPTER_GROUPS,
    sourceCandidates: [
      path.join(NOTES, 'hermes-agent.md'),
      path.join(ROOT, 'Hermes_Agent_学习笔记.md'),
      path.join(ROOT, 'Hermes_Agent_学习笔记_副本.md'),
    ],
  },
]

const PART_META = [
  { slug: 'part-0', title: 'Part 0 · 开场准备', desc: '项目介绍 · 典型问题', round: '开场必背', color: '#6366f1', icon: '🎯' },
  { slug: 'part-1', title: 'Part 1 · RAG 深挖', desc: 'Embedding · 切片 · 混合检索 · 微调', round: '一面核心', color: '#0ea5e9', icon: '🔍' },
  { slug: 'part-2', title: 'Part 2 · Agent 架构', desc: 'ReAct · 工具 · 记忆 · 安全', round: '一面/二面', color: '#8b5cf6', icon: '🤖' },
  { slug: 'part-3', title: 'Part 3 · 系统设计', desc: '架构设计 · 多 Agent · 工程落地', round: '二面', color: '#f59e0b', icon: '🏗️' },
  { slug: 'part-4', title: 'Part 4 · 行业视野', desc: '竞品对比 · OpenClaw · Hermes', round: '二面加分', color: '#10b981', icon: '🌐' },
  { slug: 'part-5', title: 'Part 5 · 行为面', desc: 'STAR · 职业规划 · 反问', round: '三面/HR', color: '#ec4899', icon: '💬' },
  { slug: 'part-6', title: 'Part 6 · 补充题库', desc: '评测 · LangGraph · 简历深挖', round: '高频追问', color: '#ef4444', icon: '📌' },
]

const DEFAULT_CUSTOM_COLOR = '#14b8a6'

/** 合并展示：多个 custom 子目录合成一个页面 */
const CUSTOM_MERGE_GROUPS = [
  {
    prefix: 'ai100-',
    slug: 'ai100',
    title: 'Agent Interview 100',
    icon: '🤖',
    color: '#6366f1',
    desc: 'AI Agent 面试 100 题 · 11 主题',
    order: 20,
    pageClass: 'ai100-doc',
    interviewFormat: true,
  },
  {
    prefix: 'kama-',
    slug: 'kama',
    title: '卡码笔记',
    icon: '📚',
    color: '#06b6d4',
    desc: '卡码大模型面经合集',
    order: 21,
  },
  {
    prefix: 'xiaolin-',
    slug: 'xiaolin',
    title: '小林面试笔记',
    icon: '📝',
    color: '#10b981',
    desc: '小林 Agent / RAG / LLM 面经',
    order: 22,
  },
]

function getBase() {
  const b = process.env.VP_BASE || '/'
  return b.endsWith('/') ? b : `${b}/`
}

// ─── Markdown 转换工具 ───────────────────────────────────────────

function wrapAnswers(content, extrasBlock = '') {
  const marker = /### 回答[^\n]*\n/
  const idx = content.search(marker)
  if (idx === -1) return content
  const head = content.slice(0, idx)
  const body = content.slice(idx).replace(marker, '')
  const summary = extrasBlock.includes('q-conclusion') ? '展开面试回答' : '展开答案'
  return `${head}<details class="answer-reveal">\n<summary>${summary}</summary>\n<div class="answer-body">\n${extrasBlock}${body.trim()}\n</div>\n</details>\n`
}

function extractMetaBlock(content) {
  let metaHtml = ''
  const cleaned = content.replace(/^> \*\*轮次\*\*：(.+)$/gm, (_, text) => {
    metaHtml = `<div class="q-meta"><strong>轮次</strong>：${text.replace(/\*\*([^*]+)\*\*/g, '$1')}</div>`
    return ''
  })
  return { cleaned, metaHtml }
}

function extractConclusionBlock(content) {
  let html = ''
  const cleaned = content.replace(/\*\*结论句[^*]*\*\*：([^\n]+)/g, (_, text) => {
    html = `<div class="q-conclusion">💡 <strong>15 秒结论</strong>：${text.trim()}</div>`
    return ''
  })
  return { cleaned, html }
}

function extractFollowupsBlock(content) {
  let html = ''
  const cleaned = content.replace(/\*\*追问方向\*\*：([^\n]+)/g, (_, text) => {
    html = `<div class="q-followups">🔁 <strong>追问方向</strong>：${text.trim()}</div>`
    return ''
  })
  return { cleaned, html }
}

function buildAnswerExtras(...parts) {
  const inner = parts.filter(Boolean).join('\n')
  if (!inner) return ''
  return `<div class="answer-extras">\n${inner}\n</div>\n\n`
}

function transformBody(body, frontmatterMetaHtml = '') {
  let content = body.replace(/\n---\n/g, '\n')
  let questionText = ''

  content = content.replace(/\*\*(题目|面试官)\*\*：([^\n]+)/, (_, _label, q) => {
    questionText = q.trim()
    return ''
  })

  const meta = extractMetaBlock(content)
  content = meta.cleaned
  const conclusion = extractConclusionBlock(content)
  content = conclusion.cleaned
  const followups = extractFollowupsBlock(content)
  content = followups.cleaned

  const extrasBlock = buildAnswerExtras(
    frontmatterMetaHtml || meta.metaHtml,
    conclusion.html,
    followups.html
  )

  if (/### 回答/.test(content)) {
    content = wrapAnswers(content, extrasBlock)
  } else if (extrasBlock) {
    content =
      `<details class="answer-reveal">\n<summary>展开详情</summary>\n<div class="answer-body">\n${extrasBlock}\n</div>\n</details>\n` +
      content
  }

  return { content: content.trim(), questionText }
}

function metaFromFrontmatter(meta) {
  const parts = []
  if (meta.round) parts.push(`<strong>轮次</strong>：${meta.round}`)
  if (meta.difficulty) parts.push(`难度：${meta.difficulty}`)
  if (meta.tags) parts.push(`标签：${meta.tags}`)
  if (meta.point) parts.push(`考察点：${meta.point}`)
  if (!parts.length) return ''
  return `<div class="q-meta">${parts.join(' · ')}</div>`
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff-]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48) || 'question'
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return { meta: {}, body: raw.trim() }

  const meta = {}
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let val = line.slice(idx + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .join(', ')
    }
    meta[key] = val
  }
  return { meta, body: match[2].trim() }
}

function parseYamlSimple(raw) {
  const meta = {}
  for (const line of raw.split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let val = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '')
    meta[key] = val
  }
  return meta
}

function extractQuestionId(heading) {
  const m = heading.match(/Q(\d+)/i)
  return m ? `q${m[1]}` : null
}

function transformQuestionBlock(block, fallbackId) {
  const lines = block.split('\n')
  const heading = lines[0].replace(/^## /, '')
  const qid = extractQuestionId(heading) || fallbackId

  const { content, questionText } = transformBody(lines.slice(1).join('\n'))
  const badge =
    qid.startsWith('q') && /^q\d+$/.test(qid)
      ? `<span class="q-badge">${qid.toUpperCase()}</span>`
      : `<span class="q-badge custom-badge">✦</span>`
  const display = questionText || heading.replace(/^Q\d+ · /, '')

  return `<div class="question-card compact-card" id="${qid}">

<h2 class="question-title">${badge}<span class="question-text">${display}</span></h2>

${content}

</div>`
}

function transformSingleQuestion(meta, body, anchorId, options = {}) {
  const metaHtml = metaFromFrontmatter(meta)
  const { content, questionText } = transformBody(body, metaHtml)
  const display = questionText || meta.question || meta.title || '未命名题目'
  const badgeClass = options.interviewFormat ? 'q-badge ai100-badge' : 'q-badge custom-badge'
  const badgeLabel = options.qNum ? `Q${options.qNum}` : '✦'
  const cardClass = options.interviewFormat
    ? 'question-card ai100-card interview-card compact-card'
    : 'question-card custom-card compact-card'

  return `<div class="${cardClass}" id="${anchorId}">

<h2 class="question-title"><span class="${badgeClass}">${badgeLabel}</span><span class="question-text">${display}</span></h2>

${options.interviewFormat ? content.replace(/展开答案/g, '展开面试回答') : content}

</div>`
}

function transformCustomFileContent(meta, body, fileSlug, options = {}) {
  const isSingleQuestion = /\*\*(题目|面试官)\*\*：/.test(body)
  if (!isSingleQuestion && /\n## /.test(body)) {
    const blocks = body.split(/\n(?=## )/).filter((b) => b.startsWith('## '))
    return blocks
      .map((block, i) => {
        const title = block.match(/^## (.+)/)?.[1] || `题目 ${i + 1}`
        return transformQuestionBlock(block, `${fileSlug}-${i + 1}`)
      })
      .join('\n\n---\n\n')
  }
  return transformSingleQuestion(meta, body, fileSlug, options)
}

function transformPart0(content) {
  let body = content.replace(/^#\s+[^\n]+\n?/, '').trim()
  const sections = body.split(/\n(?=## )/)

  return sections
    .map((section) => {
      if (!section.startsWith('## ')) return section
      const title = section.match(/^## (.+)/)?.[1] || ''
      let inner = transformBody(section.replace(/^## .+\n?/, '')).content

      return `<div class="section-card">

<h2 class="section-title">${title}</h2>

${inner}

</div>`
    })
    .join('\n\n---\n\n')
}

function transformPartContent(content, partIndex) {
  const meta = PART_META[partIndex]
  let body = content.replace(/^#\s+[^\n]+\n?/, '').trim()

  const introEnd = body.search(/\n## /)
  const intro = introEnd > 0 ? body.slice(0, introEnd).trim() : ''
  const main = introEnd > 0 ? body.slice(introEnd).trim() : body

  let transformed
  if (partIndex === 0) {
    transformed = transformPart0(main)
  } else if (main.includes('## 📌')) {
    const [questions, memo] = main.split(/\n## 📌/)
    const blocks = questions.split(/\n(?=## Q\d+)/).filter((b) => b.match(/^## Q\d+/))
    transformed =
      blocks.map((b) => transformQuestionBlock(b)).join('\n\n---\n\n') +
      `\n\n---\n\n<div class="memo-card">\n\n## 📌${memo}\n\n</div>`
  } else {
    const blocks = main.split(/\n(?=## Q\d+)/).filter((b) => b.match(/^## Q\d+/))
    transformed = blocks.map((b) => transformQuestionBlock(b)).join('\n\n---\n\n')
  }

  return `---
part: ${partIndex}
partTitle: ${meta.title}
partColor: ${meta.color}
---

<div class="part-hero" style="--part-color: ${meta.color}">

# ${meta.title}

<p class="part-desc">${meta.desc}</p>
<span class="part-round">${meta.round}</span>

</div>

${intro ? `<div class="part-intro">\n\n${intro}\n\n</div>\n\n---\n\n` : ''}

${transformed}
`
}

function splitParts(raw) {
  const regex = /^# Part (\d+) ·[^\n]*/gm
  const matches = [...raw.matchAll(regex)]
  return matches.map((m, i) => {
    const start = m.index
    const end = i + 1 < matches.length ? matches[i + 1].index : raw.length
    return raw.slice(start, end).trim()
  })
}

// ─── 自定义题库扫描 ───────────────────────────────────────────────

function loadCategoryMeta(dir, slug) {
  const yamlPath = path.join(dir, '_category.yaml')
  if (fs.existsSync(yamlPath)) {
    return { slug, ...parseYamlSimple(fs.readFileSync(yamlPath, 'utf-8')) }
  }
  return {
    slug,
    title: slug.replace(/-/g, ' '),
    icon: '✏️',
    color: DEFAULT_CUSTOM_COLOR,
    desc: '自定义题目',
    order: 99,
  }
}

function scanCustomCategories() {
  if (!fs.existsSync(CUSTOM)) return []

  const categories = []

  for (const entry of fs.readdirSync(CUSTOM, { withFileTypes: true })) {
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue

    if (entry.isDirectory()) {
      const dir = path.join(CUSTOM, entry.name)
      const meta = loadCategoryMeta(dir, entry.name)
      const files = fs
        .readdirSync(dir)
        .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
        .sort()

      const questions = files.map((file) => {
        const raw = fs.readFileSync(path.join(dir, file), 'utf-8')
        const { meta: qMeta, body } = parseFrontmatter(raw)
        const fileSlug = path.basename(file, '.md')
        return {
          file,
          fileSlug,
          meta: qMeta,
          body,
          title: qMeta.title || fileSlug.replace(/-/g, ' '),
          anchor: fileSlug,
        }
      })

      if (questions.length) {
        categories.push({ ...meta, dir, questions })
      }
    }
  }

  return categories.sort((a, b) => Number(a.order || 99) - Number(b.order || 99))
}

function stripGroupPrefix(title) {
  return title.replace(/^(AI100 · |卡码 · |小林 · )/, '')
}

function getChapterSlug(groupSlug, subSlug) {
  const prefix = `${groupSlug}-`
  return subSlug.startsWith(prefix) ? subSlug.slice(prefix.length) : subSlug
}

function buildChapterQuestionsHtml(category, subgroup) {
  const opts = { interviewFormat: category.interviewFormat }
  const sectionQuestions = category.questions.filter((q) => q.subSlug === subgroup.slug)
  return sectionQuestions
    .map((q) =>
      transformCustomFileContent(q.meta, q.body, q.anchor, {
        ...opts,
        qNum: q.qNum,
      })
    )
    .join('\n\n---\n\n')
}

function buildMergedToc(category, linkPrefix = '') {
  if (!category.subgroups?.length) return ''
  const links = category.subgroups
    .map((sg) => {
      const chSlug = getChapterSlug(category.slug, sg.slug)
      const href = linkPrefix ? `${linkPrefix}${chSlug}` : `./${chSlug}`
      return `<a class="merged-toc-link" href="${href}">${sg.icon || '📌'} ${sg.title}<span class="merged-toc-count">${sg.questions.length}</span></a>`
    })
    .join('\n')

  return `<div class="merged-toc${category.interviewFormat ? ' ai100-toc' : ''}">

**章节目录** · 共 ${category.questions.length} 题 · ${category.subgroups.length} 章

<div class="merged-toc-grid">

${links}

</div>

</div>`
}

function buildChapterNav(category, subgroup) {
  const idx = category.subgroups.findIndex((sg) => sg.slug === subgroup.slug)
  const prev = category.subgroups[idx - 1]
  const next = category.subgroups[idx + 1]
  const base = `/custom/${category.slug}/`
  const parts = []

  parts.push(`<a class="chapter-nav-link" href="${base}">📑 总览</a>`)
  if (prev) {
    parts.push(
      `<a class="chapter-nav-link" href="${base}${getChapterSlug(category.slug, prev.slug)}">← ${prev.icon || ''} ${prev.title}</a>`
    )
  }
  if (next) {
    parts.push(
      `<a class="chapter-nav-link chapter-nav-next" href="${base}${getChapterSlug(category.slug, next.slug)}">${next.icon || ''} ${next.title} →</a>`
    )
  }

  return `<div class="chapter-nav">\n\n${parts.join('\n\n')}\n\n</div>`
}

function buildMergedIndexPage(category) {
  const color = category.color || DEFAULT_CUSTOM_COLOR
  const pageClassLine = category.pageClass ? `pageClass: ${category.pageClass}\n` : ''
  const tagLabel = category.interviewFormat ? '面试问答' : '我的题库'
  const sourceHint = category.sourceSlugs?.length
    ? `源文件：\`${category.sourceSlugs.map((s) => `custom/${s}/`).join('` · `')}\``
    : `源文件：\`custom/${category.slug}/\``

  return `---
custom: true
${pageClassLine}partTitle: ${category.title}
partColor: ${color}
---

<div class="part-hero custom-hero" style="--part-color: ${color}">

# ${category.icon || '✏️'} ${category.title}

<p class="part-desc">${category.desc || ''} · 共 ${category.questions.length} 题 · ${category.subgroups.length} 章</p>
<span class="part-round custom-tag">${tagLabel}</span>

</div>

<div class="custom-hint">

📝 **${sourceHint}** · 按章节分页阅读，点击下方主题进入各章。

</div>

${buildMergedToc(category, './')}
`
}

function buildChapterPage(category, subgroup) {
  const color = category.color || DEFAULT_CUSTOM_COLOR
  const pageClassLine = category.pageClass ? `pageClass: ${category.pageClass}\n` : ''
  const chapterSlug = getChapterSlug(category.slug, subgroup.slug)
  const chapterIdx = category.subgroups.findIndex((sg) => sg.slug === subgroup.slug) + 1
  const sectionQuestions = category.questions.filter((q) => q.subSlug === subgroup.slug)
  const tagLabel = category.interviewFormat ? '面试问答' : '我的题库'

  return `---
custom: true
${pageClassLine}partTitle: ${category.title} · ${subgroup.title}
partColor: ${color}
---

<div class="part-hero custom-hero chapter-hero" style="--part-color: ${color}">

# ${subgroup.icon || '📌'} ${subgroup.title}

<p class="part-desc">${category.title} · 第 ${chapterIdx}/${category.subgroups.length} 章 · ${sectionQuestions.length} 题</p>
<span class="part-round custom-tag">${tagLabel}</span>

</div>

${buildChapterNav(category, subgroup)}

${buildChapterQuestionsHtml(category, subgroup)}

---

${buildChapterNav(category, subgroup)}
`
}

function mergeCustomCategories(categories) {
  const consumed = new Set()
  const merged = []

  for (const group of CUSTOM_MERGE_GROUPS) {
    const subs = categories
      .filter((c) => c.slug.startsWith(group.prefix))
      .sort((a, b) => Number(a.order || 99) - Number(b.order || 99))
    if (!subs.length) continue
    subs.forEach((s) => consumed.add(s.slug))

    const subgroups = subs.map((s) => ({
      slug: s.slug,
      title: stripGroupPrefix(s.title),
      icon: s.icon,
      color: s.color,
      questions: s.questions.map((q) => ({ ...q, subSlug: s.slug })),
    }))

    let qNum = 0
    const questions = subgroups.flatMap((sg) =>
      sg.questions.map((q) => {
        if (group.interviewFormat) qNum += 1
        return { ...q, qNum: group.interviewFormat ? qNum : undefined }
      })
    )

    merged.push({
      slug: group.slug,
      title: group.title,
      icon: group.icon,
      color: group.color,
      desc: group.desc,
      order: group.order,
      pageClass: group.pageClass,
      interviewFormat: group.interviewFormat,
      subgroups,
      questions,
      sourceSlugs: subs.map((s) => s.slug),
    })
  }

  const standalone = categories.filter((c) => !consumed.has(c.slug))
  return [...merged, ...standalone].sort((a, b) => Number(a.order || 99) - Number(b.order || 99))
}

function buildCustomPage(category) {
  const color = category.color || DEFAULT_CUSTOM_COLOR
  const sourceHint = `源文件：\`custom/${category.slug}/\``
  const questionsHtml = category.questions
    .map((q) => transformCustomFileContent(q.meta, q.body, q.anchor))
    .join('\n\n---\n\n')

  return `---
custom: true
partTitle: ${category.title}
partColor: ${color}
---

<div class="part-hero custom-hero" style="--part-color: ${color}">

# ${category.icon || '✏️'} ${category.title}

<p class="part-desc">${category.desc || ''} · 共 ${category.questions.length} 题</p>
<span class="part-round custom-tag">我的题库</span>

</div>

<div class="custom-hint">

📝 **${sourceHint}** · 新增题目后运行 \`npm run prepare\` 即可刷新。

</div>

${questionsHtml}
`
}

function buildCustomSidebarItems(categories) {
  if (!categories.length) {
    return [
      {
        text: '➕ 添加题目',
        link: '/guide#自定义题目',
      },
    ]
  }

  return categories.map((cat) => ({
    text: `${cat.icon || '✏️'} ${cat.title}`,
    collapsed: false,
    items: [
      { text: '📄 全部题目', link: `/custom/${cat.slug}` },
      ...cat.questions.map((q) => ({
        text: q.title.length > 22 ? q.title.slice(0, 22) + '…' : q.title,
        link: `/custom/${cat.slug}#${q.anchor}`,
      })),
      { text: '➕ 添加题目', link: '/guide#自定义题目' },
    ],
  }))
}

function buildSidebarItems(customCategories, notePages = []) {
  const items = [
    { text: '🏠 首页', link: '/' },
    { text: '✏️ 我的题库', link: '/my' },
    { text: '➕ 添加题目', link: '/add' },
    { text: '📋 复习指南', link: '/guide' },
    { text: '── 内置题库 ──', link: '/parts/part-0' },
    ...PART_META.map((p) => ({
      text: `${p.icon} ${p.title.split(' · ')[0]}`,
      link: `/parts/${p.slug}`,
    })),
  ]

  if (notePages.length) {
    const firstNote = notePages[0]
    items.push({
      text: '── 学习笔记 ──',
      link: firstNote.chapters?.length ? `/notes/${firstNote.slug}/` : `/notes/${firstNote.slug}`,
    })
    for (const note of notePages) {
      if (note.chapters?.length) {
        items.push({
          text: `${note.icon || '📖'} ${note.title}`,
          collapsed: false,
          items: [
            { text: '📑 总览', link: `/notes/${note.slug}/` },
            ...note.chapters.map((ch) => ({
              text: ch.sidebar,
              link: `/notes/${note.slug}/${ch.slug}`,
            })),
          ],
        })
      } else {
        items.push({
          text: `${note.icon || '📖'} ${note.title}`,
          link: `/notes/${note.slug}`,
        })
      }
    }
  }

  items.push({ text: '── 文件题库 ──', link: customCategories.length ? `/custom/${customCategories[0].slug}` : '/guide#文件题库' })

  if (customCategories.length) {
    for (const cat of customCategories) {
      if (cat.subgroups?.length) {
        items.push({
          text: `${cat.icon || '✏️'} ${cat.title}`,
          collapsed: false,
          items: [
            { text: '📑 总览', link: `/custom/${cat.slug}/` },
            ...cat.subgroups.map((sg) => ({
              text: `${sg.icon || '·'} ${sg.title} (${sg.questions.length})`,
              link: `/custom/${cat.slug}/${getChapterSlug(cat.slug, sg.slug)}`,
            })),
          ],
        })
      } else {
        items.push({
          text: `${cat.icon || '✏️'} ${cat.title}`,
          link: `/custom/${cat.slug}`,
        })
      }
    }
  }

  return items
}

function buildHomePage(customCategories, notePages = []) {
  const base = getBase()
  const builtInCards = PART_META.map(
    (p) => `
<a class="part-card" href="${base}parts/${p.slug}" style="--card-accent: ${p.color}">
  <span class="part-card-icon">${p.icon}</span>
  <h3>${p.title}</h3>
  <p>${p.desc}</p>
  <span class="part-card-round">${p.round}</span>
</a>`
  ).join('\n')

  const noteCards = notePages.length
    ? notePages
        .map(
          (n) => `
<a class="part-card notes-part-card" href="${base}notes/${n.slug}${n.chapters?.length ? '/' : ''}" style="--card-accent: ${n.color || '#7c3aed'}">
  <span class="part-card-icon">${n.icon || '📖'}</span>
  <h3>${n.title}</h3>
  <p>${n.desc || '学习笔记'}${n.chapters?.length ? ` · ${n.chapters.length} 章` : ' · 完整原文'}</p>
  <span class="part-card-round">学习笔记</span>
</a>`
        )
        .join('\n')
    : ''

  const customCards = customCategories.length
    ? customCategories
        .map(
          (c) => `
<a class="part-card custom-part-card" href="${base}custom/${c.slug}${c.subgroups?.length ? '/' : ''}" style="--card-accent: ${c.color || DEFAULT_CUSTOM_COLOR}">
  <span class="part-card-icon">${c.icon || '✏️'}</span>
  <h3>${c.title}</h3>
  <p>${c.desc || '自定义题目'} · ${c.questions.length} 题${c.subgroups?.length ? ` · ${c.subgroups.length} 章` : ''}</p>
  <span class="part-card-round">我的题库</span>
</a>`
        )
        .join('\n')
    : `
<a class="part-card custom-part-card add-new-card" href="${base}add" style="--card-accent: ${DEFAULT_CUSTOM_COLOR}">
  <span class="part-card-icon">➕</span>
  <h3>添加我的题目</h3>
  <p>点击导航栏「添加题目」，在网页表单里直接填写</p>
  <span class="part-card-round">开始添加</span>
</a>`

  return `---
layout: home
hero:
  name: 面试题库
  text: 大模型应用工程师 · Agent 方向
  tagline: 内置 39 问 + 网页交互添加 · 结论句 + 完整答案 · 按轮次复习
  actions:
    - theme: brand
      text: 开始刷题 · Part 0
      link: /parts/part-0
    - theme: alt
      text: 我的题库
      link: /my
features:
  - icon: ✏️
    title: 网页添加题目
    details: 表单填写即可保存，支持编辑、删除、标记已掌握，数据存在浏览器本地。
  - icon: 📂
    title: 分 Part 目录
    details: Part 0–6 按面试轮次组织，从项目介绍到行为面一网打尽。
  - icon: 💡
    title: 15 秒结论句
    details: 每题先背结论句，再按需展开完整回答，模拟真实面试节奏。
  - icon: 👁
    title: 答案折叠
    details: 默认隐藏完整回答，点击展开自测，适合反复背诵。
---

<div class="home-parts custom-section">

<HomeUserBank />

</div>

<div class="home-parts">

## 内置题库

<p class="section-note">👇 点击下方卡片进入各 Part，每 Part 含多道面试题（题目 + 结论句 + 折叠答案）</p>

<div class="part-grid">

${builtInCards}

</div>

</div>

<div class="home-parts notes-section">

## 学习笔记

<p class="section-note">完整 Markdown 原文收录，分章展示，支持章节目录导航</p>

<div class="part-grid">

${noteCards || '<p class="section-note">暂无笔记，将 Markdown 放入 <code>notes/</code> 后运行 <code>npm run prepare</code></p>'}

</div>

</div>

<div class="home-parts custom-section">

## 文件题库

<p class="section-note">以下分类来自 <code>custom/</code> 文件夹，适合批量维护</p>

<div class="part-grid">

${customCards}

</div>

</div>
`
}

function buildGuidePage(customCategories) {
  const categoryList = customCategories.length
    ? customCategories
        .map((c) => {
          if (c.sourceSlugs?.length) {
            return `- \`custom/${c.sourceSlugs[0]}/\` 等 ${c.sourceSlugs.length} 个子目录 — **${c.title}**（${c.questions.length} 题）`
          }
          return `- \`custom/${c.slug}/\` — ${c.title}（${c.questions.length} 题）`
        })
        .join('\n')
    : '- （暂无，按下方步骤添加第一个分类）'

  return `# 复习指南

<div class="guide-banner">

按 **Part 0 → 6** 顺序背诵；每题先讲「结论句（15 秒）」，再按需展开完整回答。

</div>

## 按轮次速查

| 轮次 | 覆盖范围 |
|------|----------|
| **一面** | Part 0 全 + Part 1 全 + Q3/Q4/Q7 + Q40 |
| **二面** | Part 2 + Part 3 + Part 4 选 2–3 题 |
| **HR/三面** | Part 5 全 + Part 0 项目介绍段 |

## 使用技巧

1. **第一遍**：通读结论句，建立框架
2. **第二遍**：折叠答案，自己先说一遍，再展开对照
3. **第三遍**：按轮次模拟，一面只练 Part 0+1，二面加 Part 2+3

---

<h2 id="网页添加">✏️ 网页交互添加（推荐）</h2>

<div class="guide-banner custom-guide">

点击导航栏 **「添加题目」** 或右下角 **+** 按钮，在表单里填写即可。在 **我的题库** 登录账号后自动云同步，换设备也能看到。

</div>

<h3 id="云同步">☁️ 登录与跨设备同步</h3>

1. 进入 **我的题库** → 展开 **账号**
2. **邮箱注册/登录**，或点 **GitHub 登录**
3. 登录后添加的题目自动上传；其他设备用同一账号登录即可

> 站长需在 Supabase 配置云登录，详见仓库 supabase/SETUP.md。未配置时仍可用 Gist 手动同步。

| 功能 | 说明 |
|------|------|
| 添加 / 编辑 | 表单填写题目、结论句、完整答案 |
| 分类管理 | 支持新建分类（后端、算法等） |
| 标记已掌握 | 复习过的题目标记，过滤已掌握 |
| 搜索 | 在我的题库页按关键词搜索 |
| 导出备份 | 导出 JSON，换设备可导入 |
| 复制 Markdown | 一键复制为 md 格式 |

<h2 id="文件题库">📁 文件方式添加（可选）</h2>

### 当前自定义分类

${categoryList}

### 方法一：命令行快速添加（推荐）

\`\`\`bash
cd interview-bank

# 新建一题：分类名 + 题目标题
npm run new-question -- 3d-lidar "PointNet 如何处理点云无序性"

# 编辑生成的文件，填写结论句和答案
# 然后刷新
npm run prepare
\`\`\`

### 方法二：手动创建文件

1. 在 \`custom/\` 下新建分类文件夹，例如 \`custom/3d-lidar/\`
2. （可选）创建 \`_category.yaml\` 设置分类名称和颜色
3. 复制 \`custom/_template.md\` 为新文件，例如 \`pointnet-order.md\`
4. 填写 frontmatter 和答案内容
5. 运行 \`npm run prepare\`

### 单题文件格式

\`\`\`markdown
---
title: PointNet 如何处理点云无序性
round: 一面
difficulty: ⭐⭐⭐
tags: [点云, 3D]
point: PointNet 原理
---

**题目**：PointNet 如何处理点云的无序性？

**结论句（15 秒）**：用共享 MLP + 对称聚合函数（max pooling）保证置换不变性。

**追问方向**：PointNet++ 做了什么改进？

### 回答

你的完整回答写在这里……
\`\`\`

### 一文件多题格式

同一文件里用 \`##\` 标题分隔多道题，格式与内置题库相同：

\`\`\`markdown
---
title: 3D 感知合集
---

## 点云分割

**题目**：……
### 回答
……

## 目标检测

**题目**：……
### 回答
……
\`\`\`

### 分类配置 _category.yaml

\`\`\`yaml
title: 3D 激光感知
icon: 📡
color: "#14b8a6"
desc: LiDAR · 点云 · 分割
order: 1
\`\`\`
`
}

function processBuiltinParts() {
  if (!fs.existsSync(SOURCE)) {
    console.warn('⚠ 内置源文件不存在，跳过:', SOURCE)
    return
  }

  const raw = fs.readFileSync(SOURCE, 'utf-8')
  const parts = splitParts(raw)
  const partsDir = path.join(DOCS, 'parts')
  fs.mkdirSync(partsDir, { recursive: true })

  parts.forEach((content, i) => {
    const slug = PART_META[i]?.slug
    if (!slug) return
    fs.writeFileSync(path.join(partsDir, `${slug}.md`), transformPartContent(content, i), 'utf-8')
    console.log(`✓ parts/${slug}.md`)
  })
}

function processCustomCategories(categories) {
  const outDir = path.join(DOCS, 'custom')
  fs.mkdirSync(outDir, { recursive: true })

  if (!categories.length) {
    fs.writeFileSync(
      path.join(outDir, 'index.md'),
      `---
title: 我的题库
---

<div class="part-hero custom-hero" style="--part-color: ${DEFAULT_CUSTOM_COLOR}">

# ✏️ 我的题库

<p class="part-desc">还没有自定义题目，按下方步骤添加</p>

</div>

<div class="custom-hint">

运行 \`npm run new-question -- 分类名 "题目标题"\` 快速添加第一道题。

[查看添加教程](/guide#自定义题目)

</div>
`,
      'utf-8'
    )
    console.log('✓ custom/index.md (empty)')
    return
  }

  for (const cat of categories) {
    if (cat.subgroups?.length) {
      const catDir = path.join(outDir, cat.slug)
      fs.rmSync(catDir, { recursive: true, force: true })
      fs.mkdirSync(catDir, { recursive: true })
      fs.writeFileSync(path.join(catDir, 'index.md'), buildMergedIndexPage(cat), 'utf-8')
      for (const sg of cat.subgroups) {
        const chSlug = getChapterSlug(cat.slug, sg.slug)
        fs.writeFileSync(path.join(catDir, `${chSlug}.md`), buildChapterPage(cat, sg), 'utf-8')
      }
      console.log(`✓ custom/${cat.slug}/ (${cat.subgroups.length} 章, ${cat.questions.length} 题)`)
    } else {
      fs.writeFileSync(path.join(outDir, `${cat.slug}.md`), buildCustomPage(cat), 'utf-8')
      console.log(`✓ custom/${cat.slug}.md (${cat.questions.length} 题)`)
    }
  }

  const activeSlugs = new Set(categories.map((c) => c.slug))
  for (const entry of fs.readdirSync(outDir)) {
    const full = path.join(outDir, entry)
    if (entry === 'index.md') continue
    if (fs.statSync(full).isDirectory()) {
      if (!activeSlugs.has(entry)) {
        fs.rmSync(full, { recursive: true, force: true })
        console.log(`✗ 移除旧目录 custom/${entry}/`)
      }
    } else if (entry.endsWith('.md')) {
      const slug = entry.replace(/\.md$/, '')
      const hasDir =
        fs.existsSync(path.join(outDir, slug)) &&
        fs.statSync(path.join(outDir, slug)).isDirectory()
      if (!activeSlugs.has(slug) || hasDir) {
        fs.unlinkSync(full)
        console.log(`✗ 移除旧页面 custom/${entry}`)
      }
    }
  }
}

function parseMarkdownSections(content) {
  const lines = content.split('\n')
  let inCode = false
  const preamble = []
  const sections = []
  let current = null

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      inCode = !inCode
      if (current) current.lines.push(line)
      else preamble.push(line)
      continue
    }
    if (!inCode && line.startsWith('## ')) {
      if (current) sections.push(current)
      current = { title: line.slice(3).trim(), lines: [line] }
      continue
    }
    if (current) current.lines.push(line)
    else preamble.push(line)
  }
  if (current) sections.push(current)

  return { preamble: preamble.join('\n').trim(), sections }
}

function matchHermesGroup(title, patterns) {
  return patterns.some((re) => re.test(title))
}

function groupHermesSections(sections, groups) {
  const contentSections = sections.filter((s) => s.title !== '目录')
  const chapters = groups.map((group) => ({
    ...group,
    sections: contentSections.filter((s) => matchHermesGroup(s.title, group.patterns)),
  }))

  const assigned = new Set(chapters.flatMap((ch) => ch.sections))
  const unassigned = contentSections.filter((s) => !assigned.has(s))
  if (unassigned.length) {
    console.warn(`⚠ Hermes 笔记有 ${unassigned.length} 个章节未匹配分组: ${unassigned.map((s) => s.title).join(' | ')}`)
  }

  return chapters.filter((ch) => ch.sections.length)
}

function writeNotePage(outPath, title, body) {
  const page = `---
title: ${title}
pageClass: notes-doc
outline: [2, 3]
aside: true
---

${body.trim()}
`
  fs.writeFileSync(outPath, page, 'utf-8')
}

function buildHermesIndexBody(preamble, chapters) {
  const nav = chapters
    .map(
      (ch) =>
        `- [${ch.sidebar}](./${ch.slug}.md)${ch.sections.length > 1 ? `（${ch.sections.map((s) => s.title.replace(/^第.+章\s*/, '').slice(0, 12)).join(' · ')}）` : ''}`
    )
    .join('\n')

  const intro = preamble.replace(/\n---\s*$/, '').trim()

  return `${intro}

## 章节目录

${nav}

<p class="section-note">左侧边栏可快速跳转；小章节已合并，长章节独立成页。</p>
`
}

function publishSplitNote(note, src, body) {
  const outDir = path.join(DOCS, 'notes', note.slug)
  const legacyFile = path.join(DOCS, 'notes', `${note.slug}.md`)
  if (fs.existsSync(legacyFile)) fs.unlinkSync(legacyFile)
  fs.rmSync(outDir, { recursive: true, force: true })
  fs.mkdirSync(outDir, { recursive: true })

  const { preamble, sections } = parseMarkdownSections(body)
  const chapters = groupHermesSections(sections, note.splitChapters)

  writeNotePage(path.join(outDir, 'index.md'), note.title, buildHermesIndexBody(preamble, chapters))

  let totalLines = preamble.split('\n').length
  for (const ch of chapters) {
    const chBody = ch.sections.map((s) => s.lines.join('\n').trim()).join('\n\n')
    totalLines += chBody.split('\n').length
    writeNotePage(path.join(outDir, `${ch.slug}.md`), `${note.title} · ${ch.sidebar}`, chBody)
  }

  console.log(
    `✓ notes/${note.slug}/（${chapters.length} 章，${body.length} 字，源: ${path.relative(ROOT, src)}）`
  )

  return {
    ...note,
    charCount: body.length,
    chapters: chapters.map(({ slug, sidebar, sections: secs }) => ({
      slug,
      sidebar,
      sectionCount: secs.length,
    })),
  }
}

function processNotes() {
  const outDir = path.join(DOCS, 'notes')
  fs.mkdirSync(outDir, { recursive: true })
  const published = []

  for (const note of NOTE_ENTRIES) {
    const src = note.sourceCandidates.find((p) => fs.existsSync(p))
    if (!src) {
      console.warn(`⚠ 笔记源不存在，跳过: ${note.slug}`)
      continue
    }
    const body = fs.readFileSync(src, 'utf-8').trim()

    if (note.splitChapters?.length) {
      published.push(publishSplitNote(note, src, body))
      continue
    }

    const page = `---
title: ${note.title}
pageClass: notes-doc
outline: [2, 3]
aside: true
---

${body}
`
    fs.writeFileSync(path.join(outDir, `${note.slug}.md`), page, 'utf-8')
    console.log(`✓ notes/${note.slug}.md（${body.length} 字，源: ${path.relative(ROOT, src)}）`)
    published.push({ ...note, charCount: body.length })
  }

  return published
}

function main() {
  fs.mkdirSync(CUSTOM, { recursive: true })
  fs.mkdirSync(NOTES, { recursive: true })

  const customCategories = mergeCustomCategories(scanCustomCategories())
  const notePages = processNotes()

  processBuiltinParts()
  processCustomCategories(customCategories)

  fs.writeFileSync(path.join(DOCS, 'index.md'), buildHomePage(customCategories, notePages), 'utf-8')
  fs.writeFileSync(path.join(DOCS, 'guide.md'), buildGuidePage(customCategories), 'utf-8')
  fs.writeFileSync(path.join(DOCS, 'add.md'), '---\ntitle: 添加题目\nsidebar: false\n---\n\n<QuestionForm />\n', 'utf-8')
  fs.writeFileSync(path.join(DOCS, 'my.md'), '---\ntitle: 我的题库\nsidebar: false\n---\n\n<MyQuestionBank />\n', 'utf-8')
  fs.writeFileSync(
    path.join(DOCS, '.vitepress', 'sidebar.json'),
    JSON.stringify(buildSidebarItems(customCategories, notePages), null, 2),
    'utf-8'
  )

  const noteInfo = notePages.length ? `，笔记 ${notePages.length} 篇` : ''
  console.log(`\n✅ Content prepared. 自定义分类: ${customCategories.length} 个，共 ${customCategories.reduce((n, c) => n + c.questions.length, 0)} 题${noteInfo}`)
}

main()
