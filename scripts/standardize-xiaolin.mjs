/**
 * 将小林笔记题压缩为大厂面试口述风格：保留简要回答 + 面试总结，去掉教程式长文
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CUSTOM = path.resolve(__dirname, '..', 'custom')

const XIAOLIN_DIRS = ['xiaolin-agent', 'xiaolin-rag', 'xiaolin-tools', 'xiaolin-llm']

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!m) return { meta: raw, body: '' }
  return { meta: m[1], body: m[2].trim() }
}

function extractBlock(text, startLabel, endLabels) {
  const startRe = new RegExp(`\\*\\*${startLabel}\\*\\*\\s*\\n`, 'i')
  const sm = text.match(startRe)
  if (!sm) return ''
  const start = sm.index + sm[0].length
  let end = text.length
  for (const label of endLabels) {
    const re = new RegExp(`\\n\\*\\*${label}\\*\\*`, 'i')
    const em = text.slice(start).match(re)
    if (em) end = Math.min(end, start + em.index)
  }
  return text.slice(start, end).trim()
}

function cleanText(t) {
  return t
    .replace(/```[\s\S]*?```/g, '')
    .replace(/对了，[\s\S]*?别错过最新干货哦！/g, '')
    .replace(/公众号@小林面试笔记[\s\S]*$/m, '')
    .replace(/上一页[\s\S]*?下一页[\s\S]*$/m, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function polishConclusion(meta, brief, summary) {
  const m = meta.match(/\*\*结论句[^*]*\*\*：(.+)/)
  if (m && m[1].trim().length > 15) return m[1].trim()
  const first = brief.split(/[。！？\n]/).find((s) => s.trim().length > 12)
  if (first) return first.trim().slice(0, 120)
  return summary.split(/[。！？\n]/)[0]?.trim().slice(0, 120) || ''
}

function standardizeBody(body, meta) {
  const answerMatch = body.match(/### 回答\s*\n([\s\S]*)$/)
  if (!answerMatch) return body

  const answerRaw = answerMatch[1]
  const brief = cleanText(extractBlock(answerRaw, '简要回答', ['详细解析', '面试总结']))
  const summary = cleanText(extractBlock(answerRaw, '面试总结', []))

  let answer = brief
  if (summary && !brief.includes(summary.slice(0, 40))) {
    answer = answer ? `${answer}\n\n${summary}` : summary
  }
  if (!answer) {
    // 无分段时取 ### 回答 下全文，截断到合理长度
    answer = cleanText(answerRaw.replace(/\*\*[^*]+\*\*\s*\n/g, ''))
    if (answer.length > 900) {
      const parts = answer.split(/\n\n+/)
      answer = parts.slice(0, 4).join('\n\n')
    }
  }

  // 过长再压：保留前 4 段
  const paras = answer.split(/\n\n+/).filter(Boolean)
  if (paras.length > 5) answer = paras.slice(0, 5).join('\n\n')

  const conclusion = polishConclusion(body, brief, summary)
  let header = body.slice(0, body.indexOf('### 回答')).trimEnd()
  if (conclusion && /\*\*结论句/.test(header)) {
    header = header.replace(/\*\*结论句[^*]*\*\*：[^\n]+/, `**结论句（15 秒）**：${conclusion}`)
  }

  return `${header}\n\n### 回答\n\n${answer.trim()}\n`
}

function main() {
  let count = 0
  for (const dir of XIAOLIN_DIRS) {
    const full = path.join(CUSTOM, dir)
    if (!fs.existsSync(full)) continue
    for (const file of fs.readdirSync(full).filter((f) => f.endsWith('.md'))) {
      const fp = path.join(full, file)
      const raw = fs.readFileSync(fp, 'utf-8')
      const { meta, body } = parseFrontmatter(raw)
      const newBody = standardizeBody(body, meta)
      if (newBody === body) continue
      fs.writeFileSync(fp, `---\n${meta}\n---\n\n${newBody}`, 'utf-8')
      count++
      console.log(`✓ ${dir}/${file}`)
    }
  }
  console.log(`\n压缩完成：${count} 个文件`)
}

main()
