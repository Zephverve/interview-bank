/**
 * 教程 Markdown 结构修复：表格 / 伪代码 / ASCII 图
 */

const LANGS = 'text|python|bash|java|go|sql|json|yaml|typescript|javascript'
const STANDALONE_LANG_RE = new RegExp(`^\\s{6,}(${LANGS})\\s*$`, 'i')
const SECTION_RE = /^#{1,4}\s/
const Q_RE = /^\*\*Q\d+[：:]/
const ASCII_RE = /[┌┐└┘│─├┤▼►◄═╔╗╚╝║]/
const TABLE_HEADER_RE = /维度|对比项|特性|框架|维度\s/
const ROW_LABEL_RE = /^(控制|工具|状态|适用|流|维度|对比|特性|模块|优点|缺点)/
const PROSE_START_RE =
  /^(解析要点|设计要点|下面是一|本质区别|若采用|Few-shot|面试|注意|总结|说明|推荐|常见|典型|例如|比如|因此|所以|综上)/
const CODE_LINE_RE =
  /^\s*(def |class |for |if |return |import |from |async |await |#|\/\/|\w+\s*=\s*|输入:|初始化:|for step|while |print\(|function |const |let |var |public |private |You are|Use the following|Question:|Thought:|Action:|Observation:|Final Answer:|Begin!|\.\.\.)/i

export function splitTableCols(line) {
  return line
    .trim()
    .split(/\s{2,}/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function isAsciiLine(line) {
  return ASCII_RE.test(line)
}

function isFlowDiagramLine(line) {
  const t = line.trim()
  return (t.includes('→') || t.includes('->')) && t.length < 120
}

function isProseLine(line) {
  const t = line.trim()
  if (!t) return false
  if (SECTION_RE.test(t)) return true
  if (Q_RE.test(t)) return true
  if (PROSE_START_RE.test(t)) return true
  if (/^[\u4e00-\u9fff].*[：。！？]$/.test(t) && !/^\s{2,}/.test(line)) return true
  if (/^[^|\s].*[，,]\s*如/.test(t) && !/^\s{2,}/.test(line)) return true
  return false
}

function isCodeLikeLine(line) {
  const t = line.trim()
  if (!t) return false
  if (SECTION_RE.test(t)) return false
  if (Q_RE.test(t)) return false
  if (STANDALONE_LANG_RE.test(line)) return false
  if (isAsciiLine(line)) return true
  if (isFlowDiagramLine(line)) return true
  if (CODE_LINE_RE.test(line)) return true
  if (/^\s{2,}\S/.test(line) && /[:=]|->|→|\.\.|in |#|\{|\}/.test(t)) return true
  return false
}

function isTableStart(line) {
  const cols = splitTableCols(line)
  if (cols.length >= 3 && TABLE_HEADER_RE.test(cols[0])) return true
  if (cols.length >= 3 && /ChatBot|LLM Chain|Agent|ReAct|LangGraph/i.test(line)) return true
  return false
}

function looksLikeCodeLine(line) {
  const t = line.trim()
  if (!t) return false
  if (CODE_LINE_RE.test(line)) return true
  if (/[=(){}[\];]|->|#\s+\w|\w+\(/.test(t)) return true
  if (/^\s{2,}\S/.test(line) && /[:=]|->|→/.test(t)) return true
  return false
}

function isTableRowLine(line) {
  if (looksLikeCodeLine(line)) return false
  const cols = splitTableCols(line)
  if (cols.length >= 3) {
    const first = cols[0]
    if (first.length > 14) return false
    if (/[a-z_.=]/.test(first) && !/^[\u4e00-\u9fff]+$/.test(first)) return false
    return true
  }
  if (cols.length >= 2 && ROW_LABEL_RE.test(cols[0])) return true
  return false
}

function isTableWrapLine(line) {
  const cols = splitTableCols(line)
  if (!cols.length) return false
  if (looksLikeCodeLine(line)) return false
  if (cols.length >= 3) return false
  if (cols.every((c) => c.length <= 4)) return true
  if (cols.length === 1 && cols[0].length <= 6) return true
  if (/^\s{4,}/.test(line) && cols.length <= 2) return true
  return false
}

function mergeTableRows(rawRows) {
  const rows = []

  for (const line of rawRows) {
    const cols = splitTableCols(line)

    if (!rows.length) {
      rows.push([...cols])
      continue
    }

    if (isTableWrapLine(line)) {
      const last = rows[rows.length - 1]
      if (cols.length === 2 && cols[0].length <= 2 && cols[1].length <= 4) {
        if (/^\s{4,}/.test(line) && !ROW_LABEL_RE.test(cols[0])) {
          if (last[1] !== undefined) last[1] = (last[1] + cols[0]).replace(/\s+/g, '')
          if (last.length > 3 && cols[1]) last[3] = (last[3] + cols[1]).replace(/\s+/g, '')
          else if (cols[1] && last[2] !== undefined) last[2] = (last[2] + cols[1]).replace(/\s+/g, '')
        } else {
          last[0] = (last[0] + cols[0]).replace(/\s+/g, '')
          if (last.length > 2 && cols[1]) last[2] = (last[2] + cols[1]).replace(/\s+/g, '')
          else if (last[1] !== undefined) last[1] = (last[1] + cols[1]).replace(/\s+/g, '')
        }
      } else if (cols.length === 1) {
        const idx = last.length - 1
        last[idx] = (last[idx] + cols[0]).replace(/\s+/g, '')
      } else {
        for (let j = 0; j < cols.length; j++) {
          const idx = last.length - cols.length + j
          if (idx >= 0 && idx < last.length) {
            last[idx] = (last[idx] + cols[j]).replace(/\s+/g, '')
          }
        }
      }
      continue
    }

    rows.push([...cols])
  }

  const width = Math.max(...rows.map((r) => r.length))
  return rows.map((r) => {
    while (r.length < width) r.push('')
    return r
  })
}

function rowsToMarkdownTable(rows) {
  if (rows.length < 2) return null
  const width = Math.max(...rows.map((r) => r.length))
  if (width < 2) return null

  const escape = (c) => String(c || '').replace(/\|/g, '\\|').replace(/\n/g, ' ').trim()
  const header = rows[0]
  const body = rows.slice(1)

  return [
    `| ${header.map(escape).join(' | ')} |`,
    `| ${header.map(() => '---').join(' | ')} |`,
    ...body.map((r) => `| ${r.map(escape).join(' | ')} |`),
  ].join('\n')
}

function tryExtractTable(lines, start) {
  if (!isTableStart(lines[start]) && !isTableRowLine(lines[start])) return null

  const rawRows = [lines[start]]
  let i = start + 1

  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) break
    if (SECTION_RE.test(line.trim())) break
    if (Q_RE.test(line.trim())) break
    if (STANDALONE_LANG_RE.test(line)) break
    if (isProseLine(line)) break
    if (isAsciiLine(line)) break
    if (isTableRowLine(line) || isTableWrapLine(line)) {
      rawRows.push(line)
      i++
      continue
    }
    break
  }

  if (rawRows.length < 2) return null
  const merged = mergeTableRows(rawRows)
  const md = rowsToMarkdownTable(merged)
  if (!md) return null
  return { md, next: i }
}

function skipBlankRun(lines, i) {
  let j = i
  while (j < lines.length && !lines[j].trim()) j++
  return j
}

function canContinueCode(lines, i) {
  const j = skipBlankRun(lines, i)
  if (j >= lines.length) return false
  const next = lines[j]
  if (STANDALONE_LANG_RE.test(next)) return false
  if (SECTION_RE.test(next.trim())) return false
  if (Q_RE.test(next.trim())) return false
  if (isProseLine(next) && !/^\s/.test(next)) return false
  return isCodeLikeLine(next) || /^\s/.test(next) || STANDALONE_LANG_RE.test(next)
}

function tryExtractLangCodeBlock(lines, start) {
  const match = lines[start].match(STANDALONE_LANG_RE)
  if (!match) return null

  const lang = match[1].toLowerCase()
  const block = []
  let i = start + 1

  while (i < lines.length) {
    const line = lines[i]
    if (SECTION_RE.test(line.trim())) break
    if (Q_RE.test(line.trim())) break
    if (STANDALONE_LANG_RE.test(line)) break
    if (isProseLine(line) && !/^\s/.test(line)) break
    if (isTableStart(line) || isTableRowLine(line)) break

    if (!line.trim()) {
      if (canContinueCode(lines, i)) {
        block.push('')
        i = skipBlankRun(lines, i)
        continue
      }
      break
    }

    if (/^\s/.test(line) || CODE_LINE_RE.test(line.trim())) {
      block.push(line.replace(/^\s{1,4}/, ''))
      i++
      continue
    }
    break
  }

  if (block.length === 0) return null
  return { md: '```' + lang + '\n' + block.join('\n').trimEnd() + '\n```', next: i }
}

function tryExtractIndentedCodeBlock(lines, start) {
  if (!isCodeLikeLine(lines[start])) return null
  if (STANDALONE_LANG_RE.test(lines[start])) return null
  if (lines[start].trim().startsWith('```')) return null

  const block = []
  let i = start

  while (i < lines.length) {
    const line = lines[i]
    if (SECTION_RE.test(line.trim())) break
    if (Q_RE.test(line.trim())) break
    if (STANDALONE_LANG_RE.test(line)) break
    if (isProseLine(line) && !/^\s/.test(line)) break
    if (isTableStart(line)) break

    if (!line.trim()) {
      if (canContinueCode(lines, i)) {
        block.push('')
        i = skipBlankRun(lines, i)
        continue
      }
      break
    }

    if (isCodeLikeLine(line) || isFlowDiagramLine(line) || /^\s{2,}/.test(line)) {
      block.push(line.replace(/^\s{2,4}/, ''))
      i++
      continue
    }
    break
  }

  if (block.length < 3) return null
  const lang = block.some((l) => /def |import |class /.test(l)) ? 'python' : 'text'
  return { md: '```' + lang + '\n' + block.join('\n').trimEnd() + '\n```', next: i }
}

function tryExtractAsciiBlock(lines, start) {
  if (!isAsciiLine(lines[start])) return null

  const block = []
  let i = start
  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) break
    if (SECTION_RE.test(line.trim())) break
    if (Q_RE.test(line.trim())) break
    if (isAsciiLine(line) || /^\s*[\[{(│─└┌]/.test(line)) {
      block.push(line.replace(/^\s{2,4}/, ''))
      i++
      continue
    }
    break
  }

  if (block.length < 2) return null
  return { md: '```text\n' + block.join('\n').trimEnd() + '\n```', next: i }
}

/** 主入口：修复表格、伪代码、ASCII 图 */
export function formatGuideMarkdown(text) {
  const lines = text.split('\n')
  const out = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.trim().startsWith('```') || line.includes('class="guide-')) {
      out.push(line)
      i++
      continue
    }

    const table = tryExtractTable(lines, i)
    if (table) {
      out.push('', table.md, '')
      i = table.next
      continue
    }

    const langCode = tryExtractLangCodeBlock(lines, i)
    if (langCode) {
      out.push('', langCode.md, '')
      i = langCode.next
      continue
    }

    const ascii = tryExtractAsciiBlock(lines, i)
    if (ascii) {
      out.push('', ascii.md, '')
      i = ascii.next
      continue
    }

    const code = tryExtractIndentedCodeBlock(lines, i)
    if (code) {
      out.push('', code.md, '')
      i = code.next
      continue
    }

    out.push(line)
    i++
  }

  return out.join('\n').replace(/\n{3,}/g, '\n\n')
}
