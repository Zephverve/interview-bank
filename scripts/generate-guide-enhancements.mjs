#!/usr/bin/env node
/**
 * 从章节 Markdown 提取 Q/A 与小节，生成 enhancements/*.mjs
 * 运行：node scripts/generate-guide-enhancements.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const SRC = path.join(ROOT, 'guides/ai-agent-interview-guide')
const OUT = path.join(SRC, 'enhancements')

const CHAPTERS = [
  'mod-01-basics',
  'mod-02-frameworks',
  'mod-03-rag',
  'mod-04-tools',
  'mod-05-memory',
  'mod-06-multi-agent',
  'mod-07-llm',
  'mod-08-engineering',
  'mod-09-prompt',
  'project-qa',
  'hiring-analysis',
  'resume-guide',
  'star-guide',
  'opensource-notes',
]

const LEAD_TIPS = {
  'mod-01-basics':
    '本章是 Agent 面试的地基。记住一个类比：ChatBot 像前台接话，Chain 像流水线，Agent 像会自己拆任务、查资料、记笔记的项目经理。面试时先讲「闭环」，再讲四组件（LLM/规划/记忆/工具）。',
  'mod-02-frameworks':
    '框架章考「你怎么组织多步推理」。ReAct 是高频必考：想一步、做一步、看反馈。Plan-and-Execute 适合步骤清晰的任务；Reflexion 加自我纠错；LangGraph 用图把流程写清楚。别背名词，要能画循环。',
  'mod-03-rag':
    'RAG 是 Agent 的「外接硬盘」。核心链路：切文档 → 向量化 → 检索 →（可选）重排 → 拼进 Prompt。面试常问怎么降幻觉、怎么评测、Hybrid 检索为什么比纯向量稳。',
  'mod-04-tools':
    '工具调用是 Agent 的「手」。Function Calling 让模型输出结构化参数；MCP 把工具标准化成可复用服务。安全三板斧：白名单、鉴权、参数校验。',
  'mod-05-memory':
    '记忆解决「说完就忘」。短期靠上下文窗口，长期靠向量库/结构化存储。关键工程点：写什么、何时写、怎么检索、怎么冲突合并。',
  'mod-06-multi-agent':
    '多 Agent 像一个小团队：Researcher 查、Writer 写、Reviewer 审。难点在分工边界、消息格式、冲突仲裁，不是 Agent 越多越好。',
  'mod-07-llm':
    '大模型基础是 Agent 的「发动机」。Attention 决定看哪里，KV Cache 决定推理快不快，LoRA 决定怎么便宜微调，RLHF/DPO 决定对齐人类偏好。',
  'mod-08-engineering':
    '工程化决定 Demo 能不能上生产：路由选模型、熔断防雪崩、Token 优化省成本、Trace 可回放排障。面试官想听「你怎么保证稳定上线」。',
  'mod-09-prompt':
    'Prompt 是 Agent 的「工作说明书」。结构清晰、示例具体、输出格式可解析，比堆形容词重要。还要会防注入：系统指令与用户输入分层隔离。',
  'project-qa':
    '项目问答集用 STAR 讲真实落地：背景→目标→你的动作→量化结果。92 题覆盖架构、RAG、工具、观测、性能、故障处理，建议挑 5 个故事练到能脱稿。',
}

function extractSections(text) {
  const tips = {}
  for (const line of text.split('\n')) {
    const m = line.match(/^### (\d+\.\d+)\s+(.+)$/)
    if (!m) continue
    const key = m[1]
    const title = m[2].replace(/（.+）/, '').trim()
    tips[key] = sectionTipFor(key, title)
  }
  return tips
}

function sectionTipFor(key, title) {
  if (/概念|类比|解释/.test(title)) {
    return `「${title}」先用生活类比讲清「是什么、解决什么痛点」，再落到技术词。面试官要的是你能让非技术同学也听懂。`
  }
  if (/原理|详解|逐步|映射/.test(title)) {
    return `「${title}」建议按「输入→处理→输出→边界条件」四步讲。提到组件时顺带说一句失败时怎么办，显得有工程经验。`
  }
  if (/面试|Q\)/.test(title)) {
    return `本节面试题：先给 15 秒结论，再补 1 个例子或数字。下面每题附了扩写与口播参考，建议出声练一遍。`
  }
  if (/代码|示例/.test(title)) {
    return `代码示例不是让你背语法，而是说明「循环/状态/Schema 如何落地」。面试时说清输入输出和停止条件即可。`
  }
  if (/追问/.test(title)) {
    return `追问通常考边界与取舍。回答模板：承认限制 → 给出工程兜底（规则/人工/降级）→ 一句业务影响。`
  }
  return `读「${title}」时抓住一个关键词，想想对应到你项目里是哪一块；没有项目就用「假如做客服 Agent」来举例。`
}

function normalizeText(s) {
  return String(s)
    .replace(/\u200b/g, '')
    .replace(/([^\x00-\xff])\s+([^\x00-\xff])/g, '$1$2')
    .replace(/\s+/g, ' ')
    .trim()
}

function isMajorHeading(line) {
  const t = line.trim()
  if (/^### /.test(t)) return true
  if (/^## /.test(t) && !/^## \d+\./.test(t)) return true
  return false
}

function extractQa(text, { sequential = false } = {}) {
  const qa = {}
  const qaList = []
  const lines = text.split('\n')
  let i = 0
  while (i < lines.length) {
    const trimmed = lines[i].trim()
    const m =
      trimmed.match(/^\*\*(Q\d+)[：:]\s*(.+?)\*\*$/) ||
      trimmed.match(/^\*\*(Q\d+)[：:]\s*(.+)$/)
    if (!m) {
      i++
      continue
    }
    const id = m[1]
    const question = m[2].replace(/\*\*$/, '').trim()
    i++
    const ans = []
    while (i < lines.length) {
      const t = lines[i].trim()
      if (/^\*\*Q\d+[：:]/.test(t) || isMajorHeading(lines[i])) break
      if (/^第[一二三四五六七八九十]+类/.test(t)) break
      if (/^---+$/.test(t)) break
      ans.push(lines[i])
      i++
    }
    const answerText = normalizeText(
      ans.join('\n').replace(/^\*\*A[：:]?\*\*[:：]?\s*/m, '')
    )
    const item = buildQaEnhancement(id, question, answerText)
    item.question = question
    if (sequential) {
      qaList.push(item)
    } else {
      qa[id] = item
    }
  }
  return sequential ? { qaList } : { qa }
}

function buildQaEnhancement(id, question, answer) {
  const expand = buildExpand(question, answer)
  const oral = buildOral(question, answer)
  return { expand, oral }
}

function buildExpand(question, answer) {
  if (!answer) {
    return `除结论外，可补充适用场景与反例：什么情况下这个方案不适用，你会怎么降级或换方案。`
  }
  const hints = []
  if (/RAG|检索|混合检索|BM25|重排/.test(answer + question)) hints.push('可提 Recall@K、引用溯源或 Hybrid 检索')
  if (/工具|Function|MCP|Schema/.test(answer + question)) hints.push('可提 Schema 描述、鉴权与超时重试')
  if (/记忆|Memory|上下文|会话/.test(answer + question)) hints.push('可提分层记忆与写入策略（事实 vs 推断）')
  if (/ReAct|规划|Plan|步骤|循环/.test(answer + question)) hints.push('可提步数上限、停止条件与任务清单防迷失')
  if (/安全|权限|注入|合规|审计/.test(answer + question)) hints.push('可提最小权限、审计日志与人在回路')
  if (/评估|指标|测试|压测|QPS/.test(answer + question)) hints.push('可提离线集 + 在线监控 + 人工抽检')
  if (/多 Agent|协作|分工/.test(answer + question)) hints.push('可提角色边界、消息协议与冲突仲裁')
  if (/Token|成本|延迟|熔断|路由/.test(answer + question)) hints.push('可提缓存、模型路由、批量与流式')
  const extra = hints.length ? hints[0] + '。' : '可补一句你在项目里如何验证该方案有效（指标或案例）。'
  return `标准答案覆盖了要点；面试时可再补边界条件：${extra}`
}

function buildOral(question, answer) {
  const qShort = question.replace(/[？?]$/, '').slice(0, 48)
  const aShort = normalizeText(answer).slice(0, 200)
  if (/Situation|Task|Action|Result|STAR/.test(answer)) {
    return `这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：${aShort.slice(0, 120) || qShort}。`
  }
  if (/是什么|定义|一句话|简述/.test(question)) {
    return `这题我会先给定义：${aShort || qShort}。然后补一句和普通 LLM 单次调用的区别——Agent 有闭环，会根据工具反馈多步决策，不是一次性生成就结束。`
  }
  if (/区别|对比|差异|vs|VS|还是|而不是/.test(question)) {
    return `对比题我习惯用「控制流在谁手里」来切入。${aShort}。最后补一句两者怎么结合，显得不是非黑即白。`
  }
  if (/怎么|如何|怎样|为什么/.test(question)) {
    return `我会按「目标→方案→关键细节→兜底」来说。${aShort}。最后加一句上线后怎么观测、怎么发现做得不好。`
  }
  if (/优缺点|挑战|风险|局限/.test(question)) {
    return `我会先承认限制，再给工程解法。${aShort}。强调不是不能用，而是要知道在什么场景用、配套哪些护栏。`
  }
  return `关于「${qShort}」，我的回答是：${aShort}。如果面试官追问，我会举一个简短场景把流程串起来。`
}

const SECTION_OVERRIDES = {
  'mod-01-basics': {
    '4.2': 'ReAct 循环可以记成「想→做→看→再想」四拍。面试别只背名词：要说清 Observation 从哪来（工具返回/检索结果）、什么时候停（任务完成或达到 max_steps）、错了怎么纠（换工具或改计划）。',
  },
}

const QA_OVERRIDES = {
  'mod-01-basics': {
    Q2: {
      expand:
        '除四组件外，可补「编排层」：谁负责路由、谁负责观测、谁负责安全护栏。再提一个反例：只有 LLM + Prompt、没有工具与记忆，只能算增强 ChatBot，不算完整 Agent。',
      oral:
        '我会先给一句话定义：Agent = LLM + 规划 + 记忆 + 工具，四者形成闭环。然后逐个用一句话举例——规划像项目经理拆任务，记忆像笔记本，工具像手和脚。最后强调：缺一环就只能聊天，不能自主完成任务。',
    },
    Q7: {
      expand:
        '可补充：用「子目标 checklist + 当前步验证」防止模型忘记最初任务；Observation 摘要写进 scratchpad，避免上下文被 tool output 淹没。',
      oral:
        '这题我会先说「迷失」的本质：模型不知道离最终目标还有多远。解法三板斧：max_steps 硬上限、维护 todo 清单、每步结构化 JSON 输出并做校验。最后提一句：复杂任务可以 Planner 先拆步，ReAct 逐步执行。',
    },
  },
}

function applyOverrides(slug, sectionTips, qa, qaList) {
  const sec = SECTION_OVERRIDES[slug]
  if (sec) {
    for (const [k, v] of Object.entries(sec)) sectionTips[k] = v
  }
  const qo = QA_OVERRIDES[slug]
  if (!qo) return
  if (qaList) {
    let qNum = 0
    for (const item of qaList) {
      qNum++
      const id = `Q${qNum}`
      if (qo[id]) Object.assign(item, qo[id])
    }
  } else if (qa) {
    for (const [k, v] of Object.entries(qo)) {
      if (qa[k]) Object.assign(qa[k], v)
    }
  }
}

function serializeModule(slug, data) {
  const lines = ['/** 自动生成 + 可人工润色 */', 'export default {']
  lines.push(`  leadTip: ${JSON.stringify(data.leadTip)},`)
  lines.push('  sectionTips: {')
  for (const [k, v] of Object.entries(data.sectionTips)) {
    lines.push(`    ${JSON.stringify(k)}: ${JSON.stringify(v)},`)
  }
  lines.push('  },')
  if (data.qaList) {
    lines.push('  qaList: [')
    for (const item of data.qaList) {
      lines.push('    {')
      lines.push(`      question: ${JSON.stringify(item.question)},`)
      lines.push(`      expand: ${JSON.stringify(item.expand)},`)
      lines.push(`      oral: ${JSON.stringify(item.oral)},`)
      lines.push('    },')
    }
    lines.push('  ],')
  } else {
    lines.push('  qa: {')
    for (const [k, v] of Object.entries(data.qa || {})) {
      lines.push(`    ${JSON.stringify(k)}: {`)
      lines.push(`      expand: ${JSON.stringify(v.expand)},`)
      lines.push(`      oral: ${JSON.stringify(v.oral)},`)
      lines.push('    },')
    }
    lines.push('  },')
  }
  lines.push('}')
  lines.push('')
  return lines.join('\n')
}

function main() {
  fs.mkdirSync(OUT, { recursive: true })
  let totalQ = 0
  for (const slug of CHAPTERS) {
    const file = path.join(SRC, `${slug}.md`)
    if (!fs.existsSync(file)) {
      console.warn(`skip ${slug}: no source`)
      continue
    }
    const text = fs.readFileSync(file, 'utf-8')
    const sectionTips = extractSections(text)
    const qaData =
      slug === 'project-qa'
        ? extractQa(text, { sequential: true })
        : extractQa(text)
    applyOverrides(slug, sectionTips, qaData.qa, qaData.qaList)
    const leadTip = LEAD_TIPS[slug] || `阅读本章时建议先画一张心智图，再把每节面试题出声答一遍。`
    const outPath = path.join(OUT, `${slug}.mjs`)
    fs.writeFileSync(
      outPath,
      serializeModule(slug, { leadTip, sectionTips, ...qaData }),
      'utf-8'
    )
    const qCount = qaData.qaList?.length || Object.keys(qaData.qa || {}).length
    totalQ += qCount
    console.log(`✓ ${slug}.mjs — ${qCount} 题, ${Object.keys(sectionTips).length} 小节`)
  }
  console.log(`\n✅ 共 ${totalQ} 题增强包 → ${path.relative(ROOT, OUT)}/`)
}

main()
