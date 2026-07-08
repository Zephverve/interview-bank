#!/usr/bin/env node
/**
 * 从章节 Markdown 提取 Q/A 与小节，生成 enhancements/*.mjs
 * 运行：node scripts/generate-guide-enhancements.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  buildTeach,
  buildExpandRich,
  buildOralRich,
  findReferences,
} from './guide-teach-engine.mjs'

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
    '本章是 Agent 面试的地基。学习建议：先建立「闭环」直觉——Agent 不是一次性聊天，而是感知→思考→行动→再看反馈。\n\n类比：ChatBot 像前台接话；Chain 像固定流水线；Agent 像会拆任务、查资料、记笔记的项目经理。\n\n每道题下方有「老师讲解」：像上课一样把答案拆开讲；「深度扩写」补面试加分项；「口播参考」可直接出声练。对照本站 LangGraph / AI100 等题库效果更好。',
  'mod-02-frameworks':
    '框架章考「你怎么组织多步推理」。ReAct = 想一步、做一步、看反馈；Plan-and-Execute = 先列计划再执行；LangGraph = 用图把流程写清楚。\n\n别只背名词——要能画循环/拓扑，并说出何时用哪种、怎么混合。建议对照本站 langgraph-advanced 第 077 题（ReAct vs Plan-and-Execute）。',
  'mod-03-rag':
    'RAG 是 Agent 的「外接硬盘」。链路：解析文档 → 分块 → 向量化 → 检索 →（重排）→ 拼进 Prompt → 生成。\n\n面试高频：为什么 Hybrid 比纯向量稳？怎么降幻觉？怎么评测？每题的老师讲解会把标准答案拆成你能复述的段落。',
  'mod-04-tools':
    '工具是 Agent 的「手和脚」。Function Calling 让模型输出结构化参数；MCP 把工具标准化。\n\n安全三板斧：白名单、鉴权、参数校验。工具描述（Schema）写得好不好，直接决定模型会不会选错工具。',
  'mod-05-memory':
    '记忆解决「说完就忘」。短期 = 上下文窗口；长期 = 向量库/结构化存储。\n\n关键工程点：写什么（事实 vs 推断）、何时写、怎么检索、冲突怎么合并。读每题讲解时想：如果做客服 Agent，哪些该进长期记忆？',
  'mod-06-multi-agent':
    '多 Agent 像小团队：Researcher 查、Writer 写、Reviewer 审。难点在分工边界、消息协议、冲突仲裁——不是 Agent 越多越好。\n\n建议对照 langgraph-multi 题库的 Supervisor / Handoff 模式。',
  'mod-07-llm':
    '大模型是 Agent 的「发动机」。Attention 决定看哪里；KV Cache 影响推理速度；LoRA 是便宜微调；RLHF/DPO 是对齐人类偏好。\n\n这些题偏八股，但老师讲解会帮你建立「和 Agent 的关系」，避免孤立背概念。',
  'mod-08-engineering':
    '工程化决定 Demo 能不能上生产：模型路由、熔断、Token 优化、Trace 回放、灰度回滚。\n\n面试官想听：你怎么保证稳定上线、出了问题怎么排查。STAR 类项目题尤其要准备数字。',
  'mod-09-prompt':
    'Prompt 是 Agent 的「工作说明书」。结构清晰、示例具体、输出格式可解析，比堆形容词重要。\n\n还要会防注入：系统指令与用户输入分层隔离；工具输出也要当不可信输入处理。',
  'project-qa':
    '92 道项目题全部用 STAR：Situation 背景 → Task 目标 → Action 你的决策 → Result 数字。\n\n题号每类从 Q1 重新开始，但讲解按出现顺序匹配。建议挑架构/RAG/故障各 1～2 题练到脱稿；老师讲解会帮你拆每段该怎么讲、数字怎么记。',
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
    return `「${title}」学习三步：① 用生活类比讲清是什么；② 说解决什么痛点；③ 落到技术词（LLM/规划/记忆/工具）。\n\n不要一上来堆英文缩写——面试官要的是你能让非技术同学也听懂。`
  }
  if (/原理|详解|逐步|映射|流程/.test(title)) {
    return `「${title}」按「输入 → 处理 → 输出 → 失败怎么办」四步理解。\n\n每看到一个组件，顺手想：它挂了/agent 走偏了，系统怎么兜底？这会让你的回答立刻有工程感。`
  }
  if (/面试|Q\)/.test(title)) {
    return `本节面试题：每题下方有 **老师讲解**（像上课一样拆答案）、**深度扩写**（加分项）、**口播参考**（60～90 秒）。\n\n建议流程：先读标准答案 → 读老师讲解 → 关屏用自己的话讲一遍 → 对照口播修正。`
  }
  if (/代码|示例/.test(title)) {
    return `代码示例的目标不是背语法，而是理解：循环怎么转、状态存哪、停止条件是什么、工具 Schema 长什么样。\n\n面试时说清输入/输出/停止条件即可；若被追问，能指出「哪一行是 Observation 写回上下文」。`
  }
  if (/追问/.test(title)) {
    return `追问通常考边界与取舍。推荐模板：承认限制（不装完美）→ 给工程兜底（规则/人工/降级）→ 一句业务影响（延迟、成本、体验）。\n\n下面每题的扩写里也会提示常见追问方向。`
  }
  return `读「${title}」时抓住一个关键词，联想你的项目或「假如做企业客服 Agent」场景。\n\n想不出项目经历很正常——用假设场景把流程串起来，同样能答得漂亮。`
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
  const refs = findReferences(question, answer)
  return {
    teach: buildTeach(question, answer, refs),
    expand: buildExpandRich(question, answer, refs),
    oral: buildOralRich(question, answer, refs),
  }
}

/** 人工精修覆盖（优先级高于自动生成） */
const SECTION_OVERRIDES = {
  'mod-01-basics': {
    '4.2':
      'ReAct 循环记「想→做→看→再想」四拍。\n\nThought：模型推理下一步；Action：调用工具/检索；Observation：环境返回结果，写回上下文；循环直到 Final Answer 或达到 max_steps。\n\nObservation 从哪来？工具 JSON 返回、RAG 检索片段、API 响应——不是模型自己编的。停止条件：任务完成、步数上限、超时、连续无进展。\n\n对照 langgraph-advanced/077：Plan 适合步骤可预知的任务；ReAct 适合环境不确定、需频繁调工具的场景；生产常混合。',
  },
}

const QA_OVERRIDES = {
  'mod-01-basics': {
    Q1: {
      teach:
        '【结论先说】AI Agent = 大模型 + 规划 + 记忆 + 工具，形成「感知—思考—行动」闭环，不是一次性文本生成。\n\n【为什么考这个】这是 Agent 面试的「第一题」，考你能不能用一句话说清本质。背定义不够，要说和普通 Chat 的区别。\n\n【拆开理解】\n1. 大模型：负责理解、推理、生成计划\n2. 规划：把模糊目标拆成可执行步骤，执行中可调整\n3. 记忆：短期上下文 + 长期知识，避免重复劳动\n4. 工具：搜索、数据库、代码执行——没有工具只能「空谈」\n\n【类比记忆】像一位数字员工：能思考、能查资料、能记笔记、能操作系统，而不是只会接话的前台。\n\n【常见误区】\n1. 把「接 API 的 ChatBot」说成 Agent——关键看有没有多步自主决策闭环\n2. 只背英文缩写，没有闭环概念\n\n【面试怎么答】15 秒定义 + 20 秒四组件 + 15 秒举例（如：查订单→调退款 API→更新记忆）',
      oral:
        '【开场】我先给定义：Agent 是以大模型为大脑，结合规划、记忆和工具，在多步交互里根据环境反馈持续决策的系统。\n\n【主体】和普通 Chat 的区别在于闭环——不是问一句答一句，而是会自己拆任务、调工具、看结果、再决定下一步。比如用户说「帮我查订单并申请退款」，Agent 会先查订单工具，再根据结果决定是否调退款 API，全程多步决策。\n\n【收尾】核心是四组件形成闭环：LLM 思考、Planning 拆任务、Memory 记状态、Tools 执行动作。',
    },
    Q2: {
      teach:
        '【结论先说】Agent = LLM + Planning + Memory + Tools，四者缺一不可；缺任何一块都会「降级」成某种弱形态。\n\n【拆开理解】\n· 缺 Planning：变聊天机器人，长任务容易跑偏或一步登天\n· 缺 Memory：多轮对话丢线索，无法跨会话记住用户偏好\n· 缺 Tools：只能空谈，无法查实时数据、改系统状态\n· 只有 LLM + Prompt：增强 ChatBot，不算完整 Agent\n\n【类比记忆】LLM 是大脑，Planning 是项目经理，Memory 是笔记本，Tools 是手和脚——缺脚只能动嘴，缺记忆每次见面像陌生人。\n\n【面试怎么答】先给公式 → 逐个说缺了会怎样 → 补一句：生产还有编排层（路由、观测、安全护栏）',
      oral:
        '我会先给公式：Agent = LLM + 规划 + 记忆 + 工具。然后逐个举例——规划像项目经理拆任务，记忆像笔记本，工具像手和脚。缺 Planning 就只会聊天；缺 Memory 长对话就丢上下文；缺 Tools 就没法查实时信息。最后强调：四者形成闭环才是 Agent，不是给 ChatBot 接个插件那么简单。',
    },
    Q7: {
      teach:
        '【结论先说】Agent「迷失」= 多步工具调用后忘了最初目标，在错误路径上反复横跳。\n\n【为什么考这个】ReAct 生产落地必考题——面试官想听你有没有工程护栏，不是只会讲 Thought-Action-Observation。\n\n【拆开理解】\n1. 硬性限制：max_steps、超时、Token 预算\n2. 任务清单（todo）：显式维护子目标，每步勾选\n3. 结构化输出：JSON Schema，便于校验\n4. 步进验证：关键步骤二次检查或 LLM 审核\n5. Observation 摘要：工具返回写进 scratchpad，避免原始 JSON 淹没上下文\n\n【类比记忆】像导航——每走一段要看一眼「目的地还有多远」，不能只看当前路口。\n\n【题库延伸】对照 langgraph-flow/033（stuck agent）和 langgraph-flow/025（避免死循环）。',
      oral:
        '这题我会先说「迷失」的本质：模型不知道离最终目标还有多远。解法三板斧：第一，max_steps 和超时硬上限；第二，维护 todo 清单显式跟踪子目标；第三，每步结构化 JSON 输出并做校验。工具返回要做摘要写回上下文，避免被海量 Observation 淹没。复杂任务可以 Planner 先拆粗步，每步内部用 ReAct 执行。',
    },
  },
  'mod-02-frameworks': {
    Q1: {
      teach:
        '【结论先说】ReAct = Reasoning + Acting，交替进行推理与行动，用 Observation 锚定真实环境。\n\n【拆开理解】\n· Thought：模型显式推理「下一步做什么」\n· Action：调用工具（搜索/代码/API）\n· Observation：工具返回，写回上下文\n· 循环直到 Final Answer\n\n【和 Plan-and-Execute 对比】\n· ReAct：环境不确定、需频繁调工具、用户意图可能变（如客服）\n· Plan：步骤可预知（写研报、数据流水线）\n· 混合：粗 Plan + 每步 ReAct（生产最常见）\n\n【题库延伸】langgraph-advanced/077 有完整口播和拓扑对比，建议对照练习。',
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
  const writeItem = (item) => {
    lines.push('    {')
    if (item.question) lines.push(`      question: ${JSON.stringify(item.question)},`)
    if (item.teach) lines.push(`      teach: ${JSON.stringify(item.teach)},`)
    lines.push(`      expand: ${JSON.stringify(item.expand)},`)
    lines.push(`      oral: ${JSON.stringify(item.oral)},`)
    lines.push('    },')
  }
  if (data.qaList) {
    lines.push('  qaList: [')
    for (const item of data.qaList) writeItem(item)
    lines.push('  ],')
  } else {
    lines.push('  qa: {')
    for (const [k, v] of Object.entries(data.qa || {})) {
      lines.push(`    ${JSON.stringify(k)}: {`)
      if (v.teach) lines.push(`      teach: ${JSON.stringify(v.teach)},`)
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
    const leadTip =
      LEAD_TIPS[slug] ||
      '阅读本章时建议：先读标准答案 → 读老师讲解 → 关屏用自己的话讲一遍 → 对照口播修正。'
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
