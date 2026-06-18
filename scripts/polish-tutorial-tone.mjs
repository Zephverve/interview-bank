/**
 * 去掉小林笔记「教程腔」段落，并限制回答长度
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CUSTOM = path.resolve(__dirname, '..', 'custom')

const TUTORIAL_RE =
  /回顾开头|回到开头|第一个雷|踩了.*雷|面试时答|面试官就知道|面试官问「|回到开头那段|第二个雷|第三个雷/

const MAX_CHARS = 580

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!m) return null
  return { meta: m[1], body: m[2].trim() }
}

function polishAnswer(text) {
  let paras = text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)
  paras = paras.filter((p) => !TUTORIAL_RE.test(p))
  // 去掉以「第N个雷」开头的列表式教程段
  paras = paras.filter((p) => !/^第[一二三四五]个雷/.test(p))

  let out = paras.join('\n\n')
  if (out.length > MAX_CHARS) {
    const kept = []
    let n = 0
    for (const p of paras) {
      if (n + p.length > MAX_CHARS && kept.length >= 3) break
      kept.push(p)
      n += p.length + 2
    }
    out = kept.join('\n\n')
  }
  return out.trim()
}

function processFile(fp) {
  const raw = fs.readFileSync(fp, 'utf-8')
  const parsed = parseFrontmatter(raw)
  if (!parsed) return false

  const idx = parsed.body.indexOf('### 回答')
  if (idx === -1) return false

  const head = parsed.body.slice(0, idx)
  const rest = parsed.body.slice(idx)
  const m = rest.match(/^### 回答\s*\n([\s\S]*)$/)
  if (!m) return false

  const polished = polishAnswer(m[1])
  if (polished === m[1].trim()) return false

  const newBody = `${head}### 回答\n\n${polished}\n`
  fs.writeFileSync(fp, `---\n${parsed.meta}\n---\n\n${newBody}`, 'utf-8')
  return true
}

let n = 0
for (const dir of fs.readdirSync(CUSTOM, { withFileTypes: true })) {
  if (!dir.isDirectory() || dir.name.startsWith('_')) continue
  for (const file of fs.readdirSync(path.join(CUSTOM, dir.name))) {
    if (!file.endsWith('.md')) continue
    if (processFile(path.join(CUSTOM, dir.name, file))) {
      n++
      console.log(`✓ ${dir.name}/${file}`)
    }
  }
}
console.log(`\n清理教程腔：${n} 个文件`)
