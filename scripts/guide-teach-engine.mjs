/**
 * 老师视角的讲解生成 + 自定义题库交叉引用
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

let _refIndex = null

function normalizeText(s) {
  return String(s)
    .replace(/\u200b/g, '')
    .replace(/([^\x00-\xff])\s+([^\x00-\xff])/g, '$1$2')
    .replace(/\s+/g, ' ')
    .trim()
}

function walkMd(dir, out = []) {
  if (!fs.existsSync(dir)) return out
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    const st = fs.statSync(p)
    if (st.isDirectory()) walkMd(p, out)
    else if (name.endsWith('.md')) out.push(p)
  }
  return out
}

function extractOralSnippet(text) {
  const m = text.match(/\*\*🗣️\s*标准口语答案\*\*\s*([\s\S]*?)(?=\n###|\n---|\n\*\*题目|$)/)
  if (m) return normalizeText(m[1]).slice(0, 600)
  const m2 = text.match(/\*\*结论句[^*]*\*\*\s*([^\n]+)/)
  if (m2) return normalizeText(m2[1])
  return ''
}

function extractTitle(text, filePath) {
  const fm = text.match(/^---[\s\S]*?title:\s*["']?([^"'\n]+)["']?/m)
  if (fm) return fm[1].trim()
  const q = text.match(/\*\*题目\*\*[：:]\s*(.+)/)
  if (q) return q[1].trim()
  return path.basename(filePath, '.md')
}

function extractTags(text) {
  const m = text.match(/tags:\s*\[([^\]]+)\]/)
  if (!m) return []
  return m[1].split(',').map((t) => t.trim().replace(/["']/g, ''))
}

export function loadReferenceIndex() {
  if (_refIndex) return _refIndex
  const index = []
  for (const file of walkMd(path.join(ROOT, 'custom'))) {
    const text = fs.readFileSync(file, 'utf-8')
    const title = extractTitle(text, file)
    const oral = extractOralSnippet(text)
    const tags = extractTags(text)
    const rel = path.relative(ROOT, file).replace(/\\/g, '/')
    const slug = rel.replace(/^custom\//, '').replace(/\.md$/, '')
    const keywords = [
      ...tags,
      ...title.split(/[\s，、？?：:（）()\-/]+/).filter((w) => w.length >= 2),
    ]
    index.push({ title, slug, oral, keywords, rel })
  }
  _refIndex = index
  return index
}

const TOPIC_KEYWORDS = [
  ['ReAct', ['ReAct', 'Reasoning', 'Acting', '思考', '行动', '观察']],
  ['Plan-and-Execute', ['Plan-and-Execute', 'Plan and Execute', 'Planner', 'Executor', '计划执行']],
  ['LangGraph', ['LangGraph', '状态图', 'StateGraph', 'checkpoint']],
  ['RAG', ['RAG', '检索', '向量', 'BM25', 'Hybrid', '重排', 'embedding']],
  ['Memory', ['Memory', '记忆', '上下文', '会话摘要', '长期记忆']],
  ['Tool', ['工具', 'Function Calling', 'MCP', 'Schema', '插件']],
  ['MultiAgent', ['多 Agent', '多Agent', '协作', 'Supervisor', '分工']],
  ['Safety', ['安全', '注入', '权限', '护栏', '合规', '审计', 'HITL']],
  ['Eval', ['评估', '指标', '测试', 'RAGAS', '压测', 'QPS']],
  ['Engineering', ['熔断', '路由', 'Token', '成本', '延迟', '灰度', '部署']],
  ['LLM', ['Attention', 'Transformer', 'LoRA', 'RLHF', 'DPO', 'KV Cache']],
  ['Prompt', ['Prompt', '提示词', 'few-shot', 'CoT']],
]

function detectTopics(text) {
  const found = []
  for (const [name, kws] of TOPIC_KEYWORDS) {
    if (kws.some((k) => text.includes(k))) found.push(name)
  }
  return found
}

function scoreRef(item, text) {
  let score = 0
  for (const kw of item.keywords) {
    if (kw.length >= 2 && text.includes(kw)) score += kw.length >= 4 ? 3 : 1
  }
  if (item.oral && text.split('').filter((c) => item.oral.includes(c)).length > 20) score += 1
  return score
}

export function findReferences(question, answer, limit = 2) {
  const text = question + ' ' + answer
  const index = loadReferenceIndex()
  return index
    .map((item) => ({ item, score: scoreRef(item, text) }))
    .filter((x) => x.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.item)
}

function classifyQuestion(question) {
  if (/是什么|定义|一句话|简述|代表什么/.test(question)) return 'define'
  if (/区别|对比|差异|vs|VS|还是|而不是|和.*不同/.test(question)) return 'compare'
  if (/怎么|如何|怎样|为什么|要不要|是否/.test(question)) return 'how'
  if (/优缺点|挑战|风险|局限|问题/.test(question)) return 'procon'
  if (/举例|案例|场景/.test(question)) return 'example'
  return 'general'
}

function splitAnswerPoints(answer) {
  const clean = normalizeText(answer)
  if (!clean) return []
  const parts = clean
    .split(/(?:^|\s)(?=(?:缺 |缺Planning|缺 Memory|缺 Tools|\d+[.、]|[①②③④⑤]))/u)
    .flatMap((p) => p.split(/[；;。]\s+/))
    .map((p) => p.trim())
    .filter((p) => p.length > 8)
  if (parts.length >= 2) return parts.slice(0, 6)
  return clean.length > 20 ? [clean] : []
}

function extractConclusion(question, answer) {
  const a = normalizeText(answer)
  if (/Situation|Task|Action|Result/.test(a)) {
    return '这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。'
  }
  const first = a.split(/[。；]/)[0]
  if (first && first.length > 15 && first.length < 180) return first + '。'
  return `核心围绕「${question.replace(/[？?]$/, '')}」：把标准答案里的每个要点都能用自己的话展开 2～3 句。`
}

function whyItMatters(question, qType, topics) {
  const topicNote = topics.length
    ? `这题和 ${topics.slice(0, 3).join('、')} 都相关，属于 Agent 面试的高频交叉点。`
    : '这题在真实面试里出现频率不低，不能只背结论。'
  const byType = {
    define: '定义题考你能不能「用类比 + 结构」讲清楚，而不是堆术语。面试官想确认你真的理解，而不是背过。',
    compare: '对比题考「边界感」：什么场景用 A、什么场景用 B、能不能混合。背差异表不够，要说控制流在谁手里。',
    how: '方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。',
    procon: '权衡题不要一边倒。先承认局限，再给配套护栏，最后说在什么业务条件下仍然值得做。',
    example: '举例题要把抽象概念落到具体场景，最好带一个你熟悉或能想象的业务流程。',
    general: topicNote,
  }
  return byType[qType] || topicNote
}

function explainPoints(answer) {
  const points = splitAnswerPoints(answer)
  if (!points.length) return '把标准答案逐句读一遍，每句问自己「为什么？」——能答上来，面试就不会卡壳。'
  return points
    .map((p, i) => {
      const head = p.slice(0, 40) + (p.length > 40 ? '…' : '')
      return `${i + 1}. ${head} → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。`
    })
    .join('\n')
}

const ANALOGIES = {
  ReAct: '像侦探办案：先推理（Thought），再行动查线索（Action），看结果（Observation），循环直到破案。',
  'Plan-and-Execute': '像装修：先出施工图（Plan），再按步骤施工（Execute）；中途发现问题可以改图纸（Replan）。',
  RAG: '像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。',
  Memory: '像员工的笔记本 + 公司 Wiki：笔记本记当前任务，Wiki 记长期规则和客户档案。',
  Tool: '像给员工配电脑和系统账号：没有工具只能动嘴，有了工具才能查库存、下单、跑代码。',
  MultiAgent: '像项目组：Researcher 查资料、Writer 写稿、Reviewer 挑错——分工清楚比一个人包办更稳。',
  LangGraph: '像流程图软件：每个节点是一步，边是跳转条件，checkpoint 是存档点，断了可以续玩。',
}

function getAnalogy(topics) {
  for (const t of topics) {
    if (ANALOGIES[t]) return ANALOGIES[t]
  }
  return '可以把 Agent 想成「会自己查资料、记笔记、调系统的数字员工」，比普通 ChatBot 多了闭环和多步决策。'
}

function commonMistakes(question, qType, topics) {
  const mistakes = []
  if (qType === 'define') mistakes.push('只背一句定义，没有说「和普通 LLM 单次调用差在哪」。')
  if (qType === 'compare') mistakes.push('只说 A 好 B 不好，没有说混合方案或选型条件。')
  if (qType === 'how') mistakes.push('只讲理想路径，不说失败兜底、步数上限、观测指标。')
  if (topics.includes('ReAct')) mistakes.push('把 ReAct 说成「想一步做一步」但说不清 Observation 从哪来、何时停止。')
  if (topics.includes('RAG')) mistakes.push('只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。')
  if (topics.includes('Tool')) mistakes.push('忽略工具 Schema 描述、鉴权、超时重试和参数校验。')
  if (topics.includes('Safety')) mistakes.push('空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。')
  if (!mistakes.length) mistakes.push('答案太短，缺少例子或数字；或者只会概念，不会落到工程实践。')
  return mistakes.map((m, i) => `${i + 1}. ${m}`).join('\n')
}

function interviewFlow(question, answer, qType) {
  if (/Situation|Task|Action|Result/.test(answer)) {
    return [
      '口播结构（约 90 秒）：',
      '① Situation：1 句业务背景（谁、什么系统、什么痛点）。',
      '② Task：你的目标指标（延迟、准确率、成本、完成率）。',
      '③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。',
      '④ Result：至少 2 个数字（前后对比或百分比提升）。',
      '⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。',
    ].join('\n')
  }
  const flows = {
    define: '15 秒定义 → 30 秒展开组件/流程 → 15 秒举例 → 10 秒和 ChatBot/Chain 的区别。',
    compare: '15 秒结论（谁适合什么）→ 各 30 秒说 A/B 特点 → 20 秒混合方案 → 10 秒业务例子。',
    how: '目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。',
    procon: '先承认局限 → 再给缓解手段 → 最后说适用场景。',
    example: '场景 1 句 → 流程走一遍 → 哪一步是 Agent 价值所在。',
    general: '结论 → 原理 → 例子 → 边界/兜底。控制在 60～90 秒，留时间给追问。',
  }
  return flows[qType] || flows.general
}

function refSection(refs) {
  if (!refs.length) return ''
  const lines = refs.map((r) => {
    const hint = r.oral
      ? `要点：${r.oral.replace(/^[：:]+/, '').slice(0, 100)}…`
      : ''
    return `· 「${r.title}」（/custom/${r.slug}）${hint ? ' — ' + hint : ''}`
  })
  return `本题还可对照本站其他题库加深理解：\n${lines.join('\n')}`
}

function refOralHint(refs) {
  if (!refs.length) return ''
  const r = refs[0]
  return `你也可以补充：本站题库「${r.title}」里有更完整的口播示范，建议对照练一遍。`
}

export function buildTeach(question, answer, refs = null) {
  refs = refs ?? findReferences(question, answer)
  const topics = detectTopics(question + answer)
  const qType = classifyQuestion(question)
  const parts = [
    `【结论先说】${extractConclusion(question, answer)}`,
    `【为什么考这个】${whyItMatters(question, qType, topics)}`,
    `【拆开理解】\n${explainPoints(answer)}`,
    `【类比记忆】${getAnalogy(topics)}`,
    `【常见误区】\n${commonMistakes(question, qType, topics)}`,
    `【面试怎么答】${interviewFlow(question, answer, qType)}`,
  ]
  const ref = refSection(refs)
  if (ref) parts.push(`【题库延伸】\n${ref}`)
  return parts.join('\n\n')
}

export function buildExpandRich(question, answer, refs = null) {
  refs = refs ?? findReferences(question, answer)
  const topics = detectTopics(question + answer)
  const points = splitAnswerPoints(answer)
  const lines = ['在标准答案基础上，面试还可以主动补这些「加分项」：']

  if (topics.includes('RAG')) {
    lines.push('· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。')
  }
  if (topics.includes('ReAct') || topics.includes('Plan-and-Execute')) {
    lines.push('· 架构：步数上限、停止条件、死循环检测、Plan+ReAct 混合、画拓扑图。')
  }
  if (topics.includes('Tool')) {
    lines.push('· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。')
  }
  if (topics.includes('Memory')) {
    lines.push('· 记忆：事实 vs 推断分开存、写入时机、冲突合并、跨会话权限。')
  }
  if (topics.includes('Safety')) {
    lines.push('· 安全：最小权限、审计日志、注入防护、输出审核。')
  }
  if (topics.includes('Eval')) {
    lines.push('· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。')
  }
  if (topics.includes('Engineering')) {
    lines.push('· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。')
  }
  if (points.length >= 2) {
    lines.push(`· 本题 ${points.length} 个要点，建议每点各准备一个 15 秒小例子。`)
  }
  if (refs.length) {
    lines.push(`· 延伸阅读：${refs.map((r) => r.title).join('、')}。`)
  }
  if (lines.length === 1) {
    lines.push('· 补一个反例：什么情况下这个方案不适用，你会怎么降级。')
    lines.push('· 补一个数字或指标：怎么证明方案有效。')
    lines.push('· 补一个失败案例：出过什么问题、怎么修的。')
  }
  return lines.join('\n')
}

export function buildOralRich(question, answer, refs = null) {
  refs = refs ?? findReferences(question, answer)
  const qType = classifyQuestion(question)
  const a = normalizeText(answer)
  const topics = detectTopics(question + answer)

  if (/Situation|Task|Action|Result/.test(a)) {
    return [
      '面试官好，这题我按 STAR 来答。',
      '',
      'Situation：' + (a.match(/Situation[：:]\s*([^T]+?)(?=Task|$)/i)?.[1]?.slice(0, 150) || '先交代业务背景和系统规模'),
      '',
      'Task：' + (a.match(/Task[：:]\s*([^A]+?)(?=Action|$)/i)?.[1]?.slice(0, 120) || '说清要优化的目标指标'),
      '',
      'Action：我重点做了三件事——' + splitAnswerPoints(a).slice(0, 3).join('；') || '列 2～3 个关键决策',
      '',
      'Result：' + (a.match(/Result[：:]\s*(.+)/i)?.[1]?.slice(0, 150) || '给量化结果，如延迟降 X%、准确率升 Y%'),
      '',
      refOralHint(refs),
    ]
      .filter(Boolean)
      .join('\n')
  }

  const intro = {
    define: '我先给一个清晰定义，再用类比帮你建立直觉，最后说和生产的关系。',
    compare: '这类对比题我会先说选型结论，再分点讲两者差异，最后说怎么混合用。',
    how: '我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。',
    procon: '我先承认局限，因为面试官更想听你怎么控制风险，而不是吹完美方案。',
    example: '我结合一个具体业务场景，把流程走一遍，让你看到 Agent 在哪一步创造价值。',
    general: '我尽量用你能直接复述的结构来答，先结论后展开。',
  }[qType]

  const body = a.length > 30 ? a.slice(0, 380) + (a.length > 380 ? '…' : '') : ''
  const topicClose = topics.includes('ReAct')
    ? '\n\n如果追问 Plan-and-Execute，我会说：步骤可预知用 Plan，环境不确定用 ReAct，生产里常混合——粗计划 + 每步 ReAct。'
    : topics.includes('RAG')
      ? '\n\n如果追问为什么不用纯向量，我会说：编号、专有名词、精确匹配 BM25 更稳，所以 Hybrid + 重排是常态。'
      : ''

  return [
    `【开场】${intro}`,
    '',
    `【主体】${body || '（把标准答案用自己的话展开，每点 2～3 句）'}`,
    '',
    '【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。',
    refOralHint(refs) + topicClose,
  ]
    .filter(Boolean)
    .join('\n')
}
