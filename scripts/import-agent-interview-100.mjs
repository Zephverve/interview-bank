/**
 * 从 BigKunLun/Agent-Interview-100 导入 100 题到 custom/ai100-*/
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const CUSTOM = path.resolve(ROOT, 'custom')
const REPO = 'https://github.com/BigKunLun/Agent-Interview-100.git'
const CACHE = path.resolve(ROOT, '.cache', 'agent-interview-100')

const CATEGORIES = {
  '01-agent-architecture': {
    slug: 'ai100-agent-arch',
    title: 'AI100 · Agent 架构',
    icon: '🏛️',
    color: '#6366f1',
    desc: 'ReAct · Agent Loop · 生产架构',
    order: 30,
    tags: ['Agent', 'AI100'],
  },
  '02-rag': {
    slug: 'ai100-rag',
    title: 'AI100 · RAG',
    icon: '🔍',
    color: '#0ea5e9',
    desc: '分块 · 检索 · Agentic RAG · 评估',
    order: 31,
    tags: ['RAG', 'AI100'],
  },
  '03-tool-use': {
    slug: 'ai100-tool-use',
    title: 'AI100 · 工具使用',
    icon: '🔧',
    color: '#14b8a6',
    desc: 'Function Calling · MCP · Tool Gateway',
    order: 32,
    tags: ['工具', 'AI100'],
  },
  '04-multi-agent': {
    slug: 'ai100-multi-agent',
    title: 'AI100 · 多 Agent',
    icon: '👥',
    color: '#8b5cf6',
    desc: '协作 · 通信 · 编排',
    order: 33,
    tags: ['多Agent', 'AI100'],
  },
  '05-memory-and-state': {
    slug: 'ai100-memory',
    title: 'AI100 · 记忆与状态',
    icon: '🧠',
    color: '#a855f7',
    desc: '短期/长期记忆 · 上下文管理',
    order: 34,
    tags: ['记忆', 'AI100'],
  },
  '06-planning-and-reasoning': {
    slug: 'ai100-planning',
    title: 'AI100 · 规划与推理',
    icon: '🧩',
    color: '#f59e0b',
    desc: 'CoT · ToT · Plan-and-Solve · RL',
    order: 35,
    tags: ['推理', 'AI100'],
  },
  '07-prompt-engineering': {
    slug: 'ai100-prompt',
    title: 'AI100 · 提示工程',
    icon: '✍️',
    color: '#ec4899',
    desc: 'System Prompt · 结构化输出 · 防注入',
    order: 36,
    tags: ['Prompt', 'AI100'],
  },
  '08-evaluation': {
    slug: 'ai100-evaluation',
    title: 'AI100 · 评估',
    icon: '📊',
    color: '#10b981',
    desc: 'Agent 评测 · Benchmark · 指标',
    order: 37,
    tags: ['评估', 'AI100'],
  },
  '09-safety-and-alignment': {
    slug: 'ai100-safety',
    title: 'AI100 · 安全对齐',
    icon: '🛡️',
    color: '#ef4444',
    desc: 'Guardrails · 沙箱 · 红队',
    order: 38,
    tags: ['安全', 'AI100'],
  },
  '10-production-and-deployment': {
    slug: 'ai100-production',
    title: 'AI100 · 生产部署',
    icon: '🚀',
    color: '#f97316',
    desc: 'LLMOps · 成本 · 监控 · 扩缩容',
    order: 39,
    tags: ['生产', 'AI100'],
  },
  '11-frameworks': {
    slug: 'ai100-frameworks',
    title: 'AI100 · 框架选型',
    icon: '🧰',
    color: '#64748b',
    desc: 'LangGraph · 自研 vs 框架',
    order: 40,
    tags: ['框架', 'AI100'],
  },
}

const DIFFICULTY_MAP = {
  基础: '⭐⭐',
  中级: '⭐⭐⭐',
  高级: '⭐⭐⭐⭐',
}

function ensureRepo() {
  if (fs.existsSync(path.join(CACHE, '.git'))) {
    execSync('git pull --ff-only', { cwd: CACHE, stdio: 'inherit' })
    return CACHE
  }
  fs.mkdirSync(path.dirname(CACHE), { recursive: true })
  execSync(`git clone --depth 1 ${REPO} "${CACHE}"`, { stdio: 'inherit' })
  return CACHE
}

function parseSourceFile(content) {
  const lines = content.split('\n')
  let title = ''
  let difficulty = '⭐⭐⭐'
  let category = ''
  let inCode = false
  const sections = {}
  let currentSection = null
  let buffer = []

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      inCode = !inCode
      if (currentSection) buffer.push(line)
      continue
    }
    if (!inCode && line.startsWith('# ') && !title) {
      title = line.slice(2).trim()
      continue
    }
    if (!inCode && line.startsWith('> 难度：')) {
      const level = line.replace('> 难度：', '').trim()
      difficulty = DIFFICULTY_MAP[level] || '⭐⭐⭐'
      continue
    }
    if (!inCode && line.startsWith('> 分类：')) {
      category = line.replace('> 分类：', '').trim()
      continue
    }
    if (!inCode && line.startsWith('## ')) {
      if (currentSection) sections[currentSection] = buffer.join('\n').trim()
      currentSection = line.slice(3).trim()
      buffer = []
      continue
    }
    if (currentSection) buffer.push(line)
  }
  if (currentSection) sections[currentSection] = buffer.join('\n').trim()

  return { title, difficulty, category, sections }
}

function extractFollowups(text = '') {
  const items = [...text.matchAll(/^\d+\.\s+\*\*(.+?)\*\*/gm)].map((m) => m[1].trim())
  if (items.length) return items.slice(0, 3).join(' · ')
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
  return lines[0]?.slice(0, 80) || '结合项目举例 · 工程取舍与最佳实践'
}

function buildAnswer(sections) {
  const parts = []
  if (sections['详细解析']) parts.push(`## 详细解析\n\n${sections['详细解析']}`)
  if (sections['代码示例']) parts.push(`## 代码示例\n\n${sections['代码示例']}`)
  if (sections['常见误区 / 面试追问']) {
    parts.push(`## 常见误区 / 面试追问\n\n${sections['常见误区 / 面试追问']}`)
  }
  if (sections['参考资料']) parts.push(`## 参考资料\n\n${sections['参考资料']}`)
  return parts.join('\n\n').trim()
}

function yamlQuote(s) {
  return JSON.stringify(String(s))
}

function buildQuestionMd({ title, difficulty, category, sections, meta, sourceUrl, fileSlug }) {
  const shortAnswer = sections['简短回答']?.trim() || ''
  const followups = extractFollowups(sections['常见误区 / 面试追问'])
  const answer = buildAnswer(sections)
  const displayTitle = title.length > 42 ? `${title.slice(0, 42)}…` : title

  return [
    '---',
    `title: ${yamlQuote(displayTitle)}`,
    'round: 一面/二面',
    `difficulty: ${difficulty}`,
    `tags: [${meta.tags.join(', ')}]`,
    `point: ${yamlQuote(category || meta.title)}`,
    'source: Agent Interview 100',
    `sourceUrl: ${sourceUrl}`,
    '---',
    '',
    `**题目**：${title}`,
    '',
    `**结论句（15 秒）**：${shortAnswer}`,
    '',
    `**追问方向**：${followups}`,
    '',
    '### 回答',
    '',
    answer,
    '',
  ].join('\n')
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
  const localArg = process.argv.find((a) => a.startsWith('--local='))
  const repoRoot = localArg ? path.resolve(localArg.slice(8)) : ensureRepo()

  let total = 0
  const summary = []

  for (const [folder, meta] of Object.entries(CATEGORIES)) {
    const srcDir = path.join(repoRoot, folder)
    if (!fs.existsSync(srcDir)) {
      console.warn(`⚠ 跳过缺失目录: ${folder}`)
      continue
    }

    const outDir = path.join(CUSTOM, meta.slug)
    fs.mkdirSync(outDir, { recursive: true })

    const files = fs
      .readdirSync(srcDir)
      .filter((f) => f.endsWith('.md'))
      .sort()

    for (const file of files) {
      const raw = fs.readFileSync(path.join(srcDir, file), 'utf-8')
      const parsed = parseSourceFile(raw)
      const fileSlug = file.replace(/\.md$/, '')
      const sourceUrl = `${REPO.replace('.git', '')}/blob/main/${folder}/${file}`
      const md = buildQuestionMd({
        ...parsed,
        meta,
        sourceUrl,
        fileSlug,
      })
      fs.writeFileSync(path.join(outDir, `${fileSlug}.md`), md, 'utf-8')
      total++
    }

    writeCategoryYaml(outDir, meta)
    summary.push(`✓ ${meta.slug} (${files.length} 题)`)
  }

  console.log('\n' + summary.join('\n'))
  console.log(`\n✅ 共导入 ${total} 题 → custom/ai100-*`)
  console.log('下一步: npm run prepare')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
