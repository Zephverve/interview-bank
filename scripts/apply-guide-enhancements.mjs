/**
 * 将章节增强包（通俗理解 / 口播 / 扩写）注入教程 Markdown 源文
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ENHANCE_DIR = path.resolve(__dirname, '../guides/ai-agent-interview-guide/enhancements')

export function formatGuideTip(text) {
  const lines = String(text).trim().split('\n')
  return ['> **💡 通俗理解**', ...lines.map((l) => `> ${l.trim()}`)].join('\n')
}

function isMajorHeading(line) {
  const t = line.trim()
  if (/^### /.test(t)) return true
  if (/^## /.test(t) && !/^## \d+\./.test(t)) return true
  return false
}

function injectSectionTips(text, sectionTips) {
  if (!sectionTips) return text
  const lines = text.split('\n')
  const out = []
  for (let i = 0; i < lines.length; i++) {
    out.push(lines[i])
    const m = lines[i].match(/^### (\d+\.\d+)\s/)
    if (!m) continue
    const key = m[1]
    const tip = sectionTips[key]
    if (!tip) continue
    // 避免重复注入
    const next = lines[i + 1] || ''
    if (next.includes('💡 通俗理解')) continue
    out.push('')
    out.push(formatGuideTip(tip))
    out.push('')
  }
  return out.join('\n')
}

function injectQaEnhancements(text, qa, qaList) {
  if (!qa && !qaList?.length) return text
  const lines = text.split('\n')
  const out = []
  let listIdx = 0
  let i = 0
  while (i < lines.length) {
    const trimmed = lines[i].trim()
    const qMatch = trimmed.match(/^\*\*(Q\d+)[：:]/)
    if (!qMatch) {
      out.push(lines[i])
      i++
      continue
    }
    const qid = qMatch[1]
    out.push(lines[i])
    i++
    const block = []
    while (i < lines.length) {
      const t = lines[i].trim()
      if (/^\*\*Q\d+[：:]/.test(t) || /^追问[：:]/.test(t)) break
      if (isMajorHeading(lines[i])) break
      if (/^第[一二三四五六七八九十]+类/.test(t)) break
      if (/^附录[：:]/.test(t)) break
      if (t.startsWith('**口播') || t.startsWith('**扩写')) break
      block.push(lines[i])
      i++
    }
    const enh = qaList ? qaList[listIdx++] : qa?.[qid]
    if (enh && block.some((l) => /^\*\*A[：:]/.test(l.trim()) || /^Situation[：:]/.test(l.trim()))) {
      if (enh.expand) block.push('', `**扩写：** ${enh.expand}`, '')
      if (enh.oral) block.push(`**口播：** ${enh.oral}`, '')
    } else if (enh && qaList) {
      if (enh.expand) block.push('', `**扩写：** ${enh.expand}`, '')
      if (enh.oral) block.push(`**口播：** ${enh.oral}`, '')
    }
    out.push(...block)
  }
  return out.join('\n')
}

export function loadChapterEnhancements(slug) {
  const file = path.join(ENHANCE_DIR, `${slug}.mjs`)
  if (!fs.existsSync(file)) return null
  return fs.readFileSync(file, 'utf-8') // sync import below
}

export async function applyGuideEnhancements(text, slug) {
  const file = path.join(ENHANCE_DIR, `${slug}.mjs`)
  if (!fs.existsSync(file)) return text
  const mod = await import(`${file}?t=${Date.now()}`)
  const data = mod.default || mod.enhancements
  if (!data) return text
  let result = text
  if (data.sectionTips) result = injectSectionTips(result, data.sectionTips)
  if (data.qa || data.qaList) result = injectQaEnhancements(result, data.qa, data.qaList)
  if (data.leadTip) {
    const lines = result.split('\n')
    const h1 = lines.findIndex((l) => l.startsWith('# '))
    if (h1 >= 0) {
      let insertAt = h1 + 1
      while (insertAt < lines.length && !lines[insertAt].trim()) insertAt++
      if (!lines[insertAt]?.includes('💡 通俗理解')) {
        lines.splice(insertAt, 0, '', formatGuideTip(data.leadTip), '')
        result = lines.join('\n')
      }
    }
  }
  return result
}
