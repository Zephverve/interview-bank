---
title: 01 · Agent 基础概念
titleTemplate: false
pageClass: guides-doc
outline: [2, 3]
aside: true
---

<p class="guide-chapter-badge">01 · Agent 基础概念</p>

> 本章是 Agent 面试的地基。学习建议：先建立「闭环」直觉——Agent 不是一次性聊天，而是感知→思考→行动→再看反馈。
> 
> 类比：ChatBot 像前台接话；Chain 像固定流水线；Agent 像会拆任务、查资料、记笔记的项目经理。
> 
> 每道题下方有「老师讲解」：像上课一样把答案拆开讲；「深度扩写」补面试加分项；「口播参考」可直接出声练。对照本站 LangGraph / AI100 等题库效果更好。

01 AI Agent 基础概念（面试八股文）

  面向零基础读者的系统梳理：每个知识点均包含「概念 + 原理 + 面试问答 + 追问 + 代码
  （如适用）」。建议配合动手写一个小 Agent 循环加深理解。

#### 1. 什么是 AI Agent

#### 2. Agent vs LLM Chain vs ChatBot

#### 3. Agent 的核心组成

#### 4. Agent 的工作流程

#### 5. Agent 的分类

#### 6. Agent 的应用场景

#### 7. Agent 的挑战与局限

#### 8. 综合面试题库（15+ 题）

## 1. 什么是 AI Agent

### 1.1 概念解释（通俗易懂，带类比）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「概念解释」学习三步：① 用生活类比讲清是什么；② 说解决什么痛点；③ 落到技术词（LLM/规划/记忆/工具）。</p><p>不要一上来堆英文缩写——面试官要的是你能让非技术同学也听懂。</p></div>

AI Agent（智能体）可以类比为：一位能上网、能记笔记、会拆任务的「数字员工」。
它不只「接一句话、回一段话」，而是能在多步任务里自己决定下一步做什么：先想清楚计划，再
查资料、调工具，把中间结果记下来，最后汇总成答案。
业界常用一句概括：
  Agent ≈ LLM + Planning（规划）+ Memory（记忆）+ Tools（工具）
  LLM：大脑，负责理解、推理、生成自然语言与结构化计划。
 Planning：把模糊目标拆成可执行步骤，并在执行中动态调整。
 Memory：短期上下文 + 长期知识，避免「说完就忘」或重复劳动。
 Tools：手脚，如搜索、数据库、代码执行、API 调用等。
### 1.2 原理详解（技术细节）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「原理详解」按「输入 → 处理 → 输出 → 失败怎么办」四步理解。</p><p>每看到一个组件，顺手想：它挂了/agent 走偏了，系统怎么兜底？这会让你的回答立刻有工程感。</p></div>

#### 1. 与「普通 LLM 单次调用」的区别

     普通调用：输入 Prompt → 模型输出文本，没有与外部环境闭环。
     Agent：输出往往是 「下一步动作」（例如：调用某工具、更新记忆、结束），环境返回
     Observation（观察结果），再进入下一轮推理，形成 多轮控制循环。
#### 2. 自主决策能力体现在哪里

     在动作空间中选下一步（选哪个工具、传什么参数、是否结束）。
     在信息不完整时决定先澄清还是先假设再验证。
     在失败时重试、换策略或请求人工介入（视系统设计而定）。
#### 3. 核心循环（典型 ReAct / Tool-use 范式）

   抽象为：Thought（推理）→ Action（行动）→ Observation（观察）→ … → Final
   Answer。
   实现上常由「编排层（Orchestrator）」驱动：解析模型输出、执行工具、把结果写回上下文，
   直到满足停止条件。
### 1.3 面试问题（Q）与标准答案（A）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>本节面试题：每题下方有 **老师讲解**（像上课一样拆答案）、**深度扩写**（加分项）、**口播参考**（60～90 秒）。</p><p>建议流程：先读标准答案 → 读老师讲解 → 关屏用自己的话讲一遍 → 对照口播修正。</p></div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q1</span><span class="guide-q-text">一句话说明什么是 AI Agent？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>AI Agent 是以大模型为认知核心，结合规划、记忆与工具调用，能在多步交互中根据环境反馈持续决策并完成任务的系统；其本质是 闭环的感知—思考—行动 循环，而不仅是单次文本生成。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】AI Agent = 大模型 + 规划 + 记忆 + 工具，形成「感知—思考—行动」闭环，不是一次性文本生成。</p><p>【为什么考这个】这是 Agent 面试的「第一题」，考你能不能用一句话说清本质。背定义不够，要说和普通 Chat 的区别。</p><p>【拆开理解】</p><p>1. 大模型：负责理解、推理、生成计划</p><p>2. 规划：把模糊目标拆成可执行步骤，执行中可调整</p><p>3. 记忆：短期上下文 + 长期知识，避免重复劳动</p><p>4. 工具：搜索、数据库、代码执行——没有工具只能「空谈」</p><p>【类比记忆】像一位数字员工：能思考、能查资料、能记笔记、能操作系统，而不是只会接话的前台。</p><p>【常见误区】</p><p>1. 把「接 API 的 ChatBot」说成 Agent——关键看有没有多步自主决策闭环</p><p>2. 只背英文缩写，没有闭环概念</p><p>【面试怎么答】15 秒定义 + 20 秒四组件 + 15 秒举例（如：查订单→调退款 API→更新记忆）</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 架构：步数上限、停止条件、死循环检测、Plan+ReAct 混合、画拓扑图。</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 记忆：事实 vs 推断分开存、写入时机、冲突合并、跨会话权限。</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 延伸阅读：解释 Agent 的核心组件：感知、推理、行动、记忆、了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我先给定义：Agent 是以大模型为大脑，结合规划、记忆和工具，在多步交互里根据环境反馈持续决策的系统。</p><p>【主体】和普通 Chat 的区别在于闭环——不是问一句答一句，而是会自己拆任务、调工具、看结果、再决定下一步。比如用户说「帮我查订单并申请退款」，Agent 会先查订单工具，再根据结果决定是否调退款 API，全程多步决策。</p><p>【收尾】核心是四组件形成闭环：LLM 思考、Planning 拆任务、Memory 记状态、Tools 执行动作。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q2</span><span class="guide-q-text">为什么说 Agent = LLM + Planning + Memory + Tools？缺一块会怎样？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>缺 Planning：容易变成「只会接话」的聊天，长任务易跑偏或一步登天完不成。缺 Memory：长对话会丢线索，多会话无法延续用户偏好与任务状态。缺 Tools：只能「空谈」，无法查实时信息、执行代码、改系统状态。LLM 仍是中枢，但单靠 LLM 没有外环则不是完整 Agent。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】Agent = LLM + Planning + Memory + Tools，四者缺一不可；缺任何一块都会「降级」成某种弱形态。</p><p>【拆开理解】</p><p>· 缺 Planning：变聊天机器人，长任务容易跑偏或一步登天</p><p>· 缺 Memory：多轮对话丢线索，无法跨会话记住用户偏好</p><p>· 缺 Tools：只能空谈，无法查实时数据、改系统状态</p><p>· 只有 LLM + Prompt：增强 ChatBot，不算完整 Agent</p><p>【类比记忆】LLM 是大脑，Planning 是项目经理，Memory 是笔记本，Tools 是手和脚——缺脚只能动嘴，缺记忆每次见面像陌生人。</p><p>【面试怎么答】先给公式 → 逐个说缺了会怎样 → 补一句：生产还有编排层（路由、观测、安全护栏）</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 记忆：事实 vs 推断分开存、写入时机、冲突合并、跨会话权限。</p><p>· 本题 2 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：Agent 架构模式详解：ReAct、Plan-and-Execute、LATS、P…、了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>我会先给公式：Agent = LLM + 规划 + 记忆 + 工具。然后逐个举例——规划像项目经理拆任务，记忆像笔记本，工具像手和脚。缺 Planning 就只会聊天；缺 Memory 长对话就丢上下文；缺 Tools 就没法查实时信息。最后强调：四者形成闭环才是 Agent，不是给 ChatBot 接个插件那么简单。</p></div>
</div></div>
</div>

### 1.4 可能的追问及应对

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>追问通常考边界与取舍。推荐模板：承认限制（不装完美）→ 给工程兜底（规则/人工/降级）→ 一句业务影响（延迟、成本、体验）。</p><p>下面每题的扩写里也会提示常见追问方向。</p></div>

<p class="guide-followup"><span class="guide-followup-label">追问</span>Agent 的「自主」是不是不受控？</p>
<p class="guide-followup guide-followup-a"><span class="guide-followup-label">应对</span>强调 策略与护栏：工具白名单、参数校验、人在回路（HITL）、预算与步数上限、输出审核；自主是在约束空间内的决策。</p>
<p class="guide-followup"><span class="guide-followup-label">追问</span>和 AutoGPT 那种有什么区别？</p>
<p class="guide-followup guide-followup-a"><span class="guide-followup-label">应对</span>AutoGPT 是早期「目标导向 + 工具」的一种产品形态；面试应抽象到 循环架构与组件（规划/记忆/工具），避免绑定单一产品名。</p>
### 1.5 代码示例：最小「思考—行动—观察」循环（Python 伪代码）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>代码示例的目标不是背语法，而是理解：循环怎么转、状态存哪、停止条件是什么、工具 Schema 长什么样。</p><p>面试时说清输入/输出/停止条件即可；若被追问，能指出「哪一行是 Observation 写回上下文」。</p></div>

```python
 def run_agent(user_goal: str, tools: dict, llm, max_steps: int = 8):
     messages = [{"role": "system", "content": "  你是可调用工具的 Agent。"},
                {"role": "user", "content": user_goal}]
     for _ in range(max_steps):
        plan = llm.chat(messages)   #模型决定：结束 or 调用某工具
        action = parse_tool_call(plan) # 从模型输出解析结构化动作
        if action.name == "finish":
            return action.args["answer"]
        obs = tools[action.name](**action.args)
        messages.append({"role": "assistant", "content": plan})
        messages.append({"role": "user", "content": f" 工具结果：{obs}"})
     return "超过最大步数，未完成。"

```

## 2. Agent vs LLM Chain vs ChatBot

### 2.1 概念解释（通俗易懂，带类比）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「概念解释」学习三步：① 用生活类比讲清是什么；② 说解决什么痛点；③ 落到技术词（LLM/规划/记忆/工具）。</p><p>不要一上来堆英文缩写——面试官要的是你能让非技术同学也听懂。</p></div>

 ChatBot（聊天机器人）：像 前台接待——以对话为主，核心是「接话与回复」，通常不强调多
 步任务闭环与工具编排。
 LLM Chain（链）：像 流水线工人——人（开发者）预先写好步骤顺序：A 做完接 B，再接
 C；路径相对固定。
 Agent：像 项目经理——步骤不是完全写死的，模型根据当前观察决定下一步，可分支、可重
 试、可换工具。
### 2.2 原理详解（技术细节）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「原理详解」按「输入 → 处理 → 输出 → 失败怎么办」四步理解。</p><p>每看到一个组件，顺手想：它挂了/agent 走偏了，系统怎么兜底？这会让你的回答立刻有工程感。</p></div>

| 维度 | ChatBot | LLM Chain | Agent |
| --- | --- | --- | --- |
| 控制流 | 多为线性对话 | 开发者定义的DAG/序列 | 模型驱动的分支与循环 |
| 工具 | 可有可无 | 可嵌入固定节点 | 动态选择与多轮调用 |
| 状态 | 主要会话上下文 | 链各节点显式传递 | 记忆 + 环境观察 |
| 适用 | 问答、闲聊、简单引导 | ETL 式固定流程 | 开放问题、研究、自动化任务 |

本质区别一句话：
 Chain：控制流在代码里。
 Agent：控制流在模型决策 + 环境反馈里（仍可由代码设边界）。
### 2.3 面试问题（Q）与标准答案（A）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>本节面试题：每题下方有 **老师讲解**（像上课一样拆答案）、**深度扩写**（加分项）、**口播参考**（60～90 秒）。</p><p>建议流程：先读标准答案 → 读老师讲解 → 关屏用自己的话讲一遍 → 对照口播修正。</p></div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q3</span><span class="guide-q-text">Agent 和 Prompt Chain 有什么本质区别？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>Prompt Chain 的拓扑与顺序主要由工程侧固定；Agent 在运行时在动作空间中做选择，并依赖 Observation 更新信念，适合输入与路径不确定的任务。二者可结合：链负责稳定流程，Agent 负责链内某段的灵活分支。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】Prompt Chain 的拓扑与顺序主要由工程侧固定。</p><p>【为什么考这个】对比题考「边界感」：什么场景用 A、什么场景用 B、能不能混合。背差异表不够，要说控制流在谁手里。</p><p>【拆开理解】</p><p>1. Prompt Chain 的拓扑与顺序主要由工程侧固定；Agent 在运行时在动… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】可以把 Agent 想成「会自己查资料、记笔记、调系统的数字员工」，比普通 ChatBot 多了闭环和多步决策。</p><p>【常见误区】</p><p>1. 只说 A 好 B 不好，没有说混合方案或选型条件。</p><p>【面试怎么答】15 秒结论（谁适合什么）→ 各 30 秒说 A/B 特点 → 20 秒混合方案 → 10 秒业务例子。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Prompt Chaining：多步骤 Prompt 的设计与编排」（/custom/ai100-prompt/063-prompt-chaining） — 要点：Prompt Chaining（提示链）是将复杂任务分解为多个顺序执行的 LLM 调用，每个调用的输出作为下一个调用的输入。它是 Agentic AI 中最基础的设计模式，也被称为 Pipeline …</p><p>· 「跨模型 Prompt 迁移：如何编写模型无关的 Prompt？」（/custom/ai100-prompt/068-cross-model-prompt-portability） — 要点：跨模型 Prompt 迁移（Cross-Model Prompt Portability）是指让同一个 Prompt 在不同 LLM（GPT-4、Claude、Gemini、Llama 等）上都能有效…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 延伸阅读：Prompt Chaining：多步骤 Prompt 的设计与编排、跨模型 Prompt 迁移：如何编写模型无关的 Prompt？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】这类对比题我会先说选型结论，再分点讲两者差异，最后说怎么混合用。</p><p>【主体】Prompt Chain 的拓扑与顺序主要由工程侧固定；Agent 在运行时在动作空间中做选择，并依赖 Observation 更新信念，适合输入与路径不确定的任务。二者可结合：链负责稳定流程， Agent 负责链内某段的灵活分支。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「Prompt Chaining：多步骤 Prompt 的设计与编排」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q4</span><span class="guide-q-text">ChatBot 加上插件是不是就变成 Agent 了？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>不一定。若插件调用由固定规则触发（例如关键词路由），更像「带工具的 Bot」。若由模型在多步推理中自主选择工具与参数，并形成闭环迭代，则更贴近 Agent。关键在是否具备多步自主决策与反馈闭环。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】核心围绕「ChatBot 加上插件是不是就变成 Agent 了」：把标准答案里的每个要点都能用自己的话展开 2～3 句。</p><p>【为什么考这个】这题和 Tool、Engineering 都相关，属于 Agent 面试的高频交叉点。</p><p>【拆开理解】</p><p>1. 不一定。若插件调用由固定规则触发（例如关键词路由），更像「带工具的 Bot」。若… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像给员工配电脑和系统账号：没有工具只能动嘴，有了工具才能查库存、下单、跑代码。</p><p>【常见误区】</p><p>1. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】结论 → 原理 → 例子 → 边界/兜底。控制在 60～90 秒，留时间给追问。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」（/custom/xiaolin-agent/patterns） — 要点：我理解 Agent 和 Workflow 最核心的区别是「谁来决定下一步」…</p><p>· 「说说 Single-Agent 和 Multi-Agent 的设计方案？」（/custom/xiaolin-agent/single_multi） — 要点：Single-Agent 适合任务流程清晰、复杂度适中的场景，实现简单、好维护；Multi-Agent 适合需要专业分工、任务量大或者需要并行执行的复杂场景…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 延伸阅读：了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…、说说 Single-Agent 和 Multi-Agent 的设计方案？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我尽量用你能直接复述的结构来答，先结论后展开。</p><p>【主体】不一定。若插件调用由固定规则触发（例如关键词路由），更像「带工具的 Bot」。若由模型在多步推理中自主选择工具与参数，并形成闭环迭代，则更贴近 Agent。关键在是否具备多步自主决策与反馈闭环。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

### 2.4 可能的追问及应对

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>追问通常考边界与取舍。推荐模板：承认限制（不装完美）→ 给工程兜底（规则/人工/降级）→ 一句业务影响（延迟、成本、体验）。</p><p>下面每题的扩写里也会提示常见追问方向。</p></div>

<p class="guide-followup"><span class="guide-followup-label">追问</span>RAG + Chat 算不算 Agent？</p>
<p class="guide-followup guide-followup-a"><span class="guide-followup-label">应对</span>单次检索再回答，偏「增强型 Chat」。若有多轮检索策略（查不到换查询、分解子问题、交叉验证），则具备 Agent 特征。名称不重要，讲清架构即可。</p>
### 2.5 架构差异图（文字描述）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>读「架构差异图」时抓住一个关键词，联想你的项目或「假如做企业客服 Agent」场景。</p><p>想不出项目经历很正常——用假设场景把流程串起来，同样能答得漂亮。</p></div>

```text
[用户]
   │
   ▼
┌──────────────────────────────────────┐
│ ChatBot：对话管理 +（可选）知识检索        │
│ 输出：自然语言回复                        │
└──────────────────────────────────────┘
```

```text
[用户]
   │
   ▼
┌───步骤1 ───►┌─── 步骤2 ───►┌─── 步骤3 ───► 输出
│ LLM/解析    │ LLM/转换     │ 工具/API     │
└─────────────┴─────────────┴──────────────┘
            （控制流在代码中编排）
            LLM Chain
```

```text
[用户]
   │
   ▼
┌──────────────────────────────────────┐
│ Agent 编排器                          │
│   loop: LLM规划 → 选工具 → 环境反馈     │
│         → 写入记忆 → 直到终止条件          │
└──────────────────────────────────────┘
   │                  ▲
   ▼                  │
[工具/API/数据库/浏览器/代码执行环境]
```

## 3. Agent 的核心组成

### 3.1 概念解释（各部分做什么）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「概念解释」学习三步：① 用生活类比讲清是什么；② 说解决什么痛点；③ 落到技术词（LLM/规划/记忆/工具）。</p><p>不要一上来堆英文缩写——面试官要的是你能让非技术同学也听懂。</p></div>

#### 1. 感知（Perception）

   把多模态输入（文本、文件、接口返回、页面结构等）转成模型可用的表示，并抽取任务相关
   状态。
#### 2. 规划（Planning）

   把目标拆成子目标与步骤；可以是 一次性计划 或 每步重规划（re-plan）。
#### 3. 记忆（Memory）

    短期：当前会话上下文、工具轨迹。
    长期：用户画像、文档知识、向量库、图数据库等。
#### 4. 工具（Tools）

   对外部世界可执行的操作抽象：需有清晰 schema（名称、描述、参数 JSON Schema）。
#### 5. 执行（Action）

   真正调用工具或触发环境变化，并处理超时、重试、幂等等工程问题。
#### 6. 反思（Reflection）

   对失败或质量不佳的结果进行自省：纠错、换策略、生成检查清单（常与「自我批评 / 验证器」
   配合）。
### 3.2 原理详解（技术细节）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「原理详解」按「输入 → 处理 → 输出 → 失败怎么办」四步理解。</p><p>每看到一个组件，顺手想：它挂了/agent 走偏了，系统怎么兜底？这会让你的回答立刻有工程感。</p></div>

 感知常与 结构化抽取、OCR、HTML 解析、日志解析 结合；关键是减少噪声进上下文。
 规划常见实现：CoT / ReAct、Planner-Executor 双模块、树搜索（LATS）、任务图。
 记忆工程要点：摘要压缩、引用溯源、记忆冲突解决、权限与隐私。
 工具要点：最小权限、参数校验、错误信息回灌模型。
 反思可做成独立子调用：「列出本次推理的三处风险并修正」。
### 3.3 面试问题（Q）与标准答案（A）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>本节面试题：每题下方有 **老师讲解**（像上课一样拆答案）、**深度扩写**（加分项）、**口播参考**（60～90 秒）。</p><p>建议流程：先读标准答案 → 读老师讲解 → 关屏用自己的话讲一遍 → 对照口播修正。</p></div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q5</span><span class="guide-q-text">Agent 的记忆一般怎么设计？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>分层设计最常见：工作记忆（当前轨迹与关键结论）+ 会话记忆（摘要滚动）+ 长期记忆（向量检索/结构化库）。写入要区分「事实」与「推断」，并带时间戳与来源，便于更新与撤销。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】分层设计最常见：工作记忆（当前轨迹与关键结论）+ 会话记忆（摘要滚动）+ 长期记忆（向量检索/结构化库）。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 分层设计最常见：工作记忆（当前轨迹与关键结论）+ 会话记忆（摘要滚动）+ 长期记… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>【面试怎么答】目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Agent 记忆的类型：短期记忆、长期记忆、工作记忆」（/custom/ai100-memory/040-memory-types） — 要点：LLM Agent 的记忆系统借鉴认知科学，分为三种核心类型：**短期记忆（Short-Term Memory）**——当前会话的对话历史，存在于 LLM 的上下文窗口中，会话结束即丢失；**长期记忆…</p><p>· 「说说 Single-Agent 和 Multi-Agent 的设计方案？」（/custom/xiaolin-agent/single_multi） — 要点：Single-Agent 适合任务流程清晰、复杂度适中的场景，实现简单、好维护；Multi-Agent 适合需要专业分工、任务量大或者需要并行执行的复杂场景…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 记忆：事实 vs 推断分开存、写入时机、冲突合并、跨会话权限。</p><p>· 延伸阅读：Agent 记忆的类型：短期记忆、长期记忆、工作记忆、说说 Single-Agent 和 Multi-Agent 的设计方案？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。</p><p>【主体】分层设计最常见：工作记忆（当前轨迹与关键结论）+ 会话记忆（摘要滚动）+ 长期记忆（向量检索/结构化库）。写入要区分「事实」与「推断」，并带时间戳与来源，便于更新与撤销。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「Agent 记忆的类型：短期记忆、长期记忆、工作记忆」里有更完整的口播示范，建议对照练一遍。</p><p>如果追问为什么不用纯向量，我会说：编号、专有名词、精确匹配 BM25 更稳，所以 Hybrid + 重排是常态。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q6</span><span class="guide-q-text">规划和执行要不要拆开两个模型？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>视任务而定。Planner-Executor 拆分可提升可控性（强模型规划、快模型执行）；单模型端到端更简单但易在长链路漂移。可混合：规划用强模型，执行层做确定性校验。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】核心围绕「规划和执行要不要拆开两个模型」：把标准答案里的每个要点都能用自己的话展开 2～3 句。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 视任务而定。Planner-Executor 拆分可提升可控性（强模型规划、快模… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像装修：先出施工图（Plan），再按步骤施工（Execute）；中途发现问题可以改图纸（Replan）。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>【面试怎么答】目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Agent 架构模式详解：ReAct、Plan-and-Execute、LATS、P…」（/custom/ai100-agent-arch/003-agent-architecture-patterns） — 要点：主流 Agent 架构模式各有侧重：**ReAct** 交替推理与行动，灵活且可解释性强，但 token 消耗高；**Plan-and-Execute** 先规划后执行，高效但适应性低；**LATS*…</p><p>· 「Plan-and-Solve 与动态重规划」（/custom/ai100-planning/052-plan-and-solve-replanning） — 要点：Plan-and-Solve (PS) 是 Wang et al. (2023, ACL) 提出的零样本 Prompting 策略，核心思想是将任务执行分为"先制定计划、再逐步执行"两个阶段，解决了 …</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 架构：步数上限、停止条件、死循环检测、Plan+ReAct 混合、画拓扑图。</p><p>· 延伸阅读：Agent 架构模式详解：ReAct、Plan-and-Execute、LATS、P…、Plan-and-Solve 与动态重规划。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。</p><p>【主体】视任务而定。Planner-Executor 拆分可提升可控性（强模型规划、快模型执行）；单模型端到端更简单但易在长链路漂移。可混合：规划用强模型，执行层做确定性校验。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「Agent 架构模式详解：ReAct、Plan-and-Execute、LATS、P…」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

### 3.4 可能的追问及应对

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>追问通常考边界与取舍。推荐模板：承认限制（不装完美）→ 给工程兜底（规则/人工/降级）→ 一句业务影响（延迟、成本、体验）。</p><p>下面每题的扩写里也会提示常见追问方向。</p></div>

<p class="guide-followup"><span class="guide-followup-label">追问</span>反思是不是必须？</p>
<p class="guide-followup guide-followup-a"><span class="guide-followup-label">应对</span>不是必须，但对高 stakes 或易错工具场景收益大；成本是额外延迟与 Token。</p>
### 3.5 代码示例：工具 Schema（OpenAI 风格示意）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>代码示例的目标不是背语法，而是理解：循环怎么转、状态存哪、停止条件是什么、工具 Schema 长什么样。</p><p>面试时说清输入/输出/停止条件即可；若被追问，能指出「哪一行是 Observation 写回上下文」。</p></div>

```python
 tools = [
     {
         "type": "function",
         "function": {
             "name": "search_kb",
             "description": "     在公司知识库中按关键词搜索",
             "parameters": {
                 "type": "object",
                 "properties": {
                      "query": {"type": "string"},
                      "top_k": {"type": "integer", "default": 5}
                 },
                 "required": ["query"]
             }
         }
     }
 ]

```

### 4. Agent 的工作流程

### 4.1 概念解释

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「概念解释」学习三步：① 用生活类比讲清是什么；② 说解决什么痛点；③ 落到技术词（LLM/规划/记忆/工具）。</p><p>不要一上来堆英文缩写——面试官要的是你能让非技术同学也听懂。</p></div>

可理解为：听懂 → 拆活 → 动手 → 对账 → 交卷。
### 4.2 原理详解（逐步）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>ReAct 循环记「想→做→看→再想」四拍。</p><p>Thought：模型推理下一步；Action：调用工具/检索；Observation：环境返回结果，写回上下文；循环直到 Final Answer 或达到 max_steps。</p><p>Observation 从哪来？工具 JSON 返回、RAG 检索片段、API 响应——不是模型自己编的。停止条件：任务完成、步数上限、超时、连续无进展。</p><p>对照 langgraph-advanced/077：Plan 适合步骤可预知的任务；ReAct 适合环境不确定、需频繁调工具的场景；生产常混合。</p></div>

#### 1. 输入处理

   意图识别、指代消解、安全过滤、加载相关记忆与文档。
#### 2. 任务分解

   生成子任务列表或决策树；复杂任务可配合 Human-in-the-loop 确认里程碑。
#### 3. 工具选择与调用

   由模型或路由模块选择工具；执行器做鉴权、限流与结果规范化。
#### 4. 结果整合

   合并多源信息，解决冲突（例如时间更新的数据优先）。
#### 5. 输出生成

   面向用户的自然语言答案 + 可选 引用与操作轨迹（便于审计）。
### 4.3 面试问题（Q）与标准答案（A）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>本节面试题：每题下方有 **老师讲解**（像上课一样拆答案）、**深度扩写**（加分项）、**口播参考**（60～90 秒）。</p><p>建议流程：先读标准答案 → 读老师讲解 → 关屏用自己的话讲一遍 → 对照口播修正。</p></div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q7</span><span class="guide-q-text">如何避免 Agent 在工具调用间「迷失」？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>明确 停止条件 与 最大步数；维护 任务清单（todo） 与 当前子目标；对每步输出要求 结构化（JSON）；关键步骤 强制验证（单元测试式检查、二次 LLM 审核）。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】Agent「迷失」= 多步工具调用后忘了最初目标，在错误路径上反复横跳。</p><p>【为什么考这个】ReAct 生产落地必考题——面试官想听你有没有工程护栏，不是只会讲 Thought-Action-Observation。</p><p>【拆开理解】</p><p>1. 硬性限制：max_steps、超时、Token 预算</p><p>2. 任务清单（todo）：显式维护子目标，每步勾选</p><p>3. 结构化输出：JSON Schema，便于校验</p><p>4. 步进验证：关键步骤二次检查或 LLM 审核</p><p>5. Observation 摘要：工具返回写进 scratchpad，避免原始 JSON 淹没上下文</p><p>【类比记忆】像导航——每走一段要看一眼「目的地还有多远」，不能只看当前路口。</p><p>【题库延伸】对照 langgraph-flow/033（stuck agent）和 langgraph-flow/025（避免死循环）。</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 延伸阅读：了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…、说说 Single-Agent 和 Multi-Agent 的设计方案？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>这题我会先说「迷失」的本质：模型不知道离最终目标还有多远。解法三板斧：第一，max_steps 和超时硬上限；第二，维护 todo 清单显式跟踪子目标；第三，每步结构化 JSON 输出并做校验。工具返回要做摘要写回上下文，避免被海量 Observation 淹没。复杂任务可以 Planner 先拆粗步，每步内部用 ReAct 执行。</p></div>
</div></div>
</div>

### 4.4 可能的追问及应对

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>追问通常考边界与取舍。推荐模板：承认限制（不装完美）→ 给工程兜底（规则/人工/降级）→ 一句业务影响（延迟、成本、体验）。</p><p>下面每题的扩写里也会提示常见追问方向。</p></div>

<p class="guide-followup"><span class="guide-followup-label">追问</span>结果冲突怎么整合？</p>
<p class="guide-followup guide-followup-a"><span class="guide-followup-label">应对</span>优先级规则（权威源 &gt; 时间新 &gt; 多源一致）、让模型显式输出「冲突说明」、必要时触发人工。</p>
### 4.5 代码示例：简单「任务清单」状态

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>代码示例的目标不是背语法，而是理解：循环怎么转、状态存哪、停止条件是什么、工具 Schema 长什么样。</p><p>面试时说清输入/输出/停止条件即可；若被追问，能指出「哪一行是 Observation 写回上下文」。</p></div>

```python
 state = {
     "goal": "  生成上季度销售报告",
     "todos": [
          {"id": 1, "task": "拉取销售数据", "done": False},
          {"id": 2, "task": "计算同比", "done": False},
          {"id": 3, "task": "写成摘要", "done": False},
     ],
     "notes": []
 }

```

## 5. Agent 的分类

### 5.1 概念解释（经典 AI 教材视角）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「概念解释」学习三步：① 用生活类比讲清是什么；② 说解决什么痛点；③ 落到技术词（LLM/规划/记忆/工具）。</p><p>不要一上来堆英文缩写——面试官要的是你能让非技术同学也听懂。</p></div>

分类来自智能体理论，可与 LLM Agent 对照理解：
                类型                                通俗理解
 反应式（Reactive）                  类似反射：输入→动作，几乎不维护复杂内部模型。
 基于模型（Model-based）              脑中有「世界模型」，能预测行动后果。
 基于目标（Goal-based）               明确要达成什么状态，能选路径。
 基于效用（Utility-based）            多目标权衡，选期望效用最大的行动。
 学习型（Learning）                  从反馈中更新策略或模型。

### 5.2 原理详解（与 LLM Agent 的映射）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「原理详解」按「输入 → 处理 → 输出 → 失败怎么办」四步理解。</p><p>每看到一个组件，顺手想：它挂了/agent 走偏了，系统怎么兜底？这会让你的回答立刻有工程感。</p></div>

 反应式：适合低延迟、规则清晰；LLM 只做轻量分类/路由。
 基于模型：显式维护状态机、仿真环境或知识图谱。
 目标 / 效用：用 奖励函数、约束优化、多指标打分 指导规划。
 学习型：RLHF、在线反馈、Bandit 选工具；注意样本效率与安全。
### 5.3 面试问题（Q）与标准答案（A）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>本节面试题：每题下方有 **老师讲解**（像上课一样拆答案）、**深度扩写**（加分项）、**口播参考**（60～90 秒）。</p><p>建议流程：先读标准答案 → 读老师讲解 → 关屏用自己的话讲一遍 → 对照口播修正。</p></div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q8</span><span class="guide-q-text">基于效用的 Agent 和基于目标的有什么区别？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>目标型关注「是否达成」；效用型在多个冲突目标间做权衡（成本、时延、风险、用户偏好），选综合最优而非单点达成。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】核心围绕「基于效用的 Agent 和基于目标的有什么区别」：把标准答案里的每个要点都能用自己的话展开 2～3 句。</p><p>【为什么考这个】对比题考「边界感」：什么场景用 A、什么场景用 B、能不能混合。背差异表不够，要说控制流在谁手里。</p><p>【拆开理解】</p><p>1. 目标型关注「是否达成」；效用型在多个冲突目标间做权衡（成本、时延、风险、用户偏好… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】可以把 Agent 想成「会自己查资料、记笔记、调系统的数字员工」，比普通 ChatBot 多了闭环和多步决策。</p><p>【常见误区】</p><p>1. 只说 A 好 B 不好，没有说混合方案或选型条件。</p><p>【面试怎么答】15 秒结论（谁适合什么）→ 各 30 秒说 A/B 特点 → 20 秒混合方案 → 10 秒业务例子。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「1. LLM 和 Agent 有什么区别？」（/custom/kama-agent/agent_interview-q1） — 要点：# Agent大厂面试题汇总：ReAct、Function Calling、MCP、RAG高频问题现在无论是什么岗位，都要求了解一些AI，Agent相关的内容…</p><p>· 「2. Agent 和 Workflow 有什么区别？」（/custom/kama-agent/agent_interview-q2） — 要点：面试官会追问：&amp;quot;你说你用了 Agent，为什么不用 Workflow…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 延伸阅读：1. LLM 和 Agent 有什么区别？、2. Agent 和 Workflow 有什么区别？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】这类对比题我会先说选型结论，再分点讲两者差异，最后说怎么混合用。</p><p>【主体】目标型关注「是否达成」；效用型在多个冲突目标间做权衡（成本、时延、风险、用户偏好），选综合最优而非单点达成。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「1. LLM 和 Agent 有什么区别？」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q9</span><span class="guide-q-text">反应式 Agent 有什么优缺点？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>优点：快、可解释、易测试。缺点：对长程依赖与复杂推理弱；遇到未见输入可能失效。常与分层架构结合。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】核心围绕「反应式 Agent 有什么优缺点」：把标准答案里的每个要点都能用自己的话展开 2～3 句。</p><p>【为什么考这个】权衡题不要一边倒。先承认局限，再给配套护栏，最后说在什么业务条件下仍然值得做。</p><p>【拆开理解】</p><p>1. 优点：快、可解释、易测试。缺点：对长程依赖与复杂推理弱；遇到未见输入可能失效。常… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】可以把 Agent 想成「会自己查资料、记笔记、调系统的数字员工」，比普通 ChatBot 多了闭环和多步决策。</p><p>【常见误区】</p><p>1. 答案太短，缺少例子或数字；或者只会概念，不会落到工程实践。</p><p>【面试怎么答】先承认局限 → 再给缓解手段 → 最后说适用场景。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「解释 Agent 的核心组件：感知、推理、行动、记忆」（/custom/ai100-agent-arch/002-agent-core-components） — 要点：一个完整的 LLM Agent 由四大核心组件构成：**感知模块**（接收和解析输入）、**推理模块**（LLM 作为"大脑"进行思考和规划）、**行动模块**（调用工具执行操作）、**记忆模块**（…</p><p>· 「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」（/custom/xiaolin-agent/patterns） — 要点：我理解 Agent 和 Workflow 最核心的区别是「谁来决定下一步」…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 延伸阅读：解释 Agent 的核心组件：感知、推理、行动、记忆、了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我先承认局限，因为面试官更想听你怎么控制风险，而不是吹完美方案。</p><p>【主体】优点：快、可解释、易测试。缺点：对长程依赖与复杂推理弱；遇到未见输入可能失效。常与分层架构结合。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「解释 Agent 的核心组件：感知、推理、行动、记忆」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

### 5.4 可能的追问及应对

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>追问通常考边界与取舍。推荐模板：承认限制（不装完美）→ 给工程兜底（规则/人工/降级）→ 一句业务影响（延迟、成本、体验）。</p><p>下面每题的扩写里也会提示常见追问方向。</p></div>

<p class="guide-followup"><span class="guide-followup-label">追问</span>LLM Agent 一般算哪一类？</p>
<p class="guide-followup guide-followup-a"><span class="guide-followup-label">应对</span>常是混合型：底层是模型推理，上层可接目标/效用（打分选路径）+ 记忆（世界状态）+ 学习（反馈更新）。</p>

## 6. Agent 的应用场景

### 6.1 概念解释

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「概念解释」学习三步：① 用生活类比讲清是什么；② 说解决什么痛点；③ 落到技术词（LLM/规划/记忆/工具）。</p><p>不要一上来堆英文缩写——面试官要的是你能让非技术同学也听懂。</p></div>

结合「高频、可工具化、可评估」的场景优先落地。
### 6.2 原理详解（场景与要点）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「原理详解」按「输入 → 处理 → 输出 → 失败怎么办」四步理解。</p><p>每看到一个组件，顺手想：它挂了/agent 走偏了，系统怎么兜底？这会让你的回答立刻有工程感。</p></div>

#### 1. 智能客服

   工单查询、订单状态、退换货政策；需 知识库对齐、身份鉴权、升级人工 策略。
#### 2. 代码助手

   读仓库、跑测试、提 PR；需 沙箱、diff 审查、最小权限。
#### 3. 数据分析

   NL2SQL、制图、解读；需 数据治理、行级权限、结果校验。
#### 4. 自动化运维

   查日志、重启服务、开单；需 审批流、灰度、回滚。
#### 5. 知识管理

   摘要、标签、关联检索；需 溯源、版本、权限。
### 6.3 面试问题（Q）与标准答案（A）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>本节面试题：每题下方有 **老师讲解**（像上课一样拆答案）、**深度扩写**（加分项）、**口播参考**（60～90 秒）。</p><p>建议流程：先读标准答案 → 读老师讲解 → 关屏用自己的话讲一遍 → 对照口播修正。</p></div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q10</span><span class="guide-q-text">企业内部落地 Agent，你最先关心哪三个非功能需求？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>安全与合规（权限、审计）、可控性（人在回路、工具白名单）、可观测性（轨迹、指标、回放）。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】安全与合规（权限、审计）、可控性（人在回路、工具白名单）、可观测性（轨迹、指标、回放）。</p><p>【为什么考这个】这题和 Tool、Safety、Eval 都相关，属于 Agent 面试的高频交叉点。</p><p>【拆开理解】</p><p>1. 安全与合规（权限、审计）、可控性（人在回路、工具白名单）、可观测性（轨迹、指标、… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像给员工配电脑和系统账号：没有工具只能动嘴，有了工具才能查库存、下单、跑代码。</p><p>【常见误区】</p><p>1. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>2. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】结论 → 原理 → 例子 → 边界/兜底。控制在 60～90 秒，留时间给追问。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」（/custom/xiaolin-agent/patterns） — 要点：我理解 Agent 和 Workflow 最核心的区别是「谁来决定下一步」…</p><p>· 「说说 Single-Agent 和 Multi-Agent 的设计方案？」（/custom/xiaolin-agent/single_multi） — 要点：Single-Agent 适合任务流程清晰、复杂度适中的场景，实现简单、好维护；Multi-Agent 适合需要专业分工、任务量大或者需要并行执行的复杂场景…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 延伸阅读：了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…、说说 Single-Agent 和 Multi-Agent 的设计方案？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我尽量用你能直接复述的结构来答，先结论后展开。</p><p>【主体】安全与合规（权限、审计）、可控性（人在回路、工具白名单）、可观测性（轨迹、指标、回放）。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

### 6.4 可能的追问及应对

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>追问通常考边界与取舍。推荐模板：承认限制（不装完美）→ 给工程兜底（规则/人工/降级）→ 一句业务影响（延迟、成本、体验）。</p><p>下面每题的扩写里也会提示常见追问方向。</p></div>

<p class="guide-followup"><span class="guide-followup-label">追问</span>客服场景如何降低幻觉？</p>
<p class="guide-followup guide-followup-a"><span class="guide-followup-label">应对</span>强 RAG 溯源、禁止无引用断言、模板化答复、未知则转人工。</p>

## 7. Agent 的挑战与局限

### 7.1 概念解释

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「概念解释」学习三步：① 用生活类比讲清是什么；② 说解决什么痛点；③ 落到技术词（LLM/规划/记忆/工具）。</p><p>不要一上来堆英文缩写——面试官要的是你能让非技术同学也听懂。</p></div>

Agent 把能力做强的同时，把 错误放大 到多步；工程上要「限步、限权、可观测、可回滚」。
### 7.2 原理详解

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「原理详解」按「输入 → 处理 → 输出 → 失败怎么办」四步理解。</p><p>每看到一个组件，顺手想：它挂了/agent 走偏了，系统怎么兜底？这会让你的回答立刻有工程感。</p></div>

#### 1. 幻觉

   模型编造事实或工具参数；对策：检索 grounding、约束解码、验证器。

#### 2. 安全性

   Prompt 注入、工具滥用、数据外泄；对策：分层信任域、输出过滤、秘密不入模型上下文。
#### 3. 成本控制

   长链路 × 大上下文；对策：摘要、小模型路由、缓存、批处理工具。
#### 4. 可解释性

   提供 轨迹、引用、决策日志；关键操作 可回放。
#### 5. 评估困难

   单轮 BLEU 不适用；需 过程指标（工具是否正确）、结果指标（任务是否完成）、人工抽检。
### 7.3 面试问题（Q）与标准答案（A）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>本节面试题：每题下方有 **老师讲解**（像上课一样拆答案）、**深度扩写**（加分项）、**口播参考**（60～90 秒）。</p><p>建议流程：先读标准答案 → 读老师讲解 → 关屏用自己的话讲一遍 → 对照口播修正。</p></div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q11</span><span class="guide-q-text">怎么评估一个 Agent 的好坏？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>分层评估：任务成功率、平均步数/成本、工具错误率、用户满意度、安全事件数；基准可包括静态数据集 + 仿真环境 + 线上 A/B。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】分层评估：任务成功率、平均步数/成本、工具错误率、用户满意度、安全事件数。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 分层评估：任务成功率、平均步数/成本、工具错误率、用户满意度、安全事件数；基准可… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像给员工配电脑和系统账号：没有工具只能动嘴，有了工具才能查库存、下单、跑代码。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>3. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「说说 Single-Agent 和 Multi-Agent 的设计方案？」（/custom/xiaolin-agent/single_multi） — 要点：Single-Agent 适合任务流程清晰、复杂度适中的场景，实现简单、好维护；Multi-Agent 适合需要专业分工、任务量大或者需要并行执行的复杂场景…</p><p>· 「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」（/custom/xiaolin-agent/patterns） — 要点：我理解 Agent 和 Workflow 最核心的区别是「谁来决定下一步」…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 延伸阅读：说说 Single-Agent 和 Multi-Agent 的设计方案？、了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。</p><p>【主体】分层评估：任务成功率、平均步数/成本、工具错误率、用户满意度、安全事件数；基准可包括静态数据集 + 仿真环境 + 线上 A/B。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「说说 Single-Agent 和 Multi-Agent 的设计方案？」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q12</span><span class="guide-q-text">Agent 的最大风险是什么？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>复合错误与权限滥用——单步小错在多步放大，或工具被诱导执行高危操作；因此必须 最小权限 + 强审计 + 人在回路。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】复合错误与权限滥用——单步小错在多步放大，或工具被诱导执行高危操作。</p><p>【为什么考这个】定义题考你能不能「用类比 + 结构」讲清楚，而不是堆术语。面试官想确认你真的理解，而不是背过。</p><p>【拆开理解】</p><p>1. 复合错误与权限滥用——单步小错在多步放大，或工具被诱导执行高危操作；因此必须最小… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像给员工配电脑和系统账号：没有工具只能动嘴，有了工具才能查库存、下单、跑代码。</p><p>【常见误区】</p><p>1. 只背一句定义，没有说「和普通 LLM 单次调用差在哪」。</p><p>2. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>3. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】15 秒定义 → 30 秒展开组件/流程 → 15 秒举例 → 10 秒和 ChatBot/Chain 的区别。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「说说 Single-Agent 和 Multi-Agent 的设计方案？」（/custom/xiaolin-agent/single_multi） — 要点：Single-Agent 适合任务流程清晰、复杂度适中的场景，实现简单、好维护；Multi-Agent 适合需要专业分工、任务量大或者需要并行执行的复杂场景…</p><p>· 「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」（/custom/xiaolin-agent/patterns） — 要点：我理解 Agent 和 Workflow 最核心的区别是「谁来决定下一步」…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 延伸阅读：说说 Single-Agent 和 Multi-Agent 的设计方案？、了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我先给一个清晰定义，再用类比帮你建立直觉，最后说和生产的关系。</p><p>【主体】复合错误与权限滥用——单步小错在多步放大，或工具被诱导执行高危操作；因此必须最小权限 + 强审计 + 人在回路。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「说说 Single-Agent 和 Multi-Agent 的设计方案？」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

### 7.4 可能的追问及应对

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>追问通常考边界与取舍。推荐模板：承认限制（不装完美）→ 给工程兜底（规则/人工/降级）→ 一句业务影响（延迟、成本、体验）。</p><p>下面每题的扩写里也会提示常见追问方向。</p></div>

<p class="guide-followup"><span class="guide-followup-label">追问</span>如何防止 Prompt 注入？</p>
<p class="guide-followup guide-followup-a"><span class="guide-followup-label">应对</span>工具层鉴权与用户身份绑定、结构化分隔用户内容与指令、敏感操作二次确认、输出侧DLP。</p>

#### 8. 综合面试题库（15+ 题）

下列题目覆盖定义、对比、架构、工程与治理；每题含 标准答案 与 追问提示。

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q13</span><span class="guide-q-text">请用你自己的话定义 LLM Agent，并说明与单次调用的差异。</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>LLM Agent 是以大语言模型为推理核心，在 多轮 中与外部环境交互，通过 规划、记忆与工具 完成复杂任务的系统。与单次调用的差异在于：单次调用是 开环生成；Agent 是 闭环决策，每步可依据工具返回更新状态，直到终止条件。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】LLM Agent 是以大语言模型为推理核心，在多轮中与外部环境交互，通过规划、记忆与工具完成复杂任务的系统。</p><p>【为什么考这个】定义题考你能不能「用类比 + 结构」讲清楚，而不是堆术语。面试官想确认你真的理解，而不是背过。</p><p>【拆开理解】</p><p>1. LLM Agent 是以大语言模型为推理核心，在多轮中与外部环境交互，通过规划、… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像侦探办案：先推理（Thought），再行动查线索（Action），看结果（Observation），循环直到破案。</p><p>【常见误区】</p><p>1. 只背一句定义，没有说「和普通 LLM 单次调用差在哪」。</p><p>2. 把 ReAct 说成「想一步做一步」但说不清 Observation 从哪来、何时停止。</p><p>3. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】15 秒定义 → 30 秒展开组件/流程 → 15 秒举例 → 10 秒和 ChatBot/Chain 的区别。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「解释 Agent 的核心组件：感知、推理、行动、记忆」（/custom/ai100-agent-arch/002-agent-core-components） — 要点：一个完整的 LLM Agent 由四大核心组件构成：**感知模块**（接收和解析输入）、**推理模块**（LLM 作为"大脑"进行思考和规划）、**行动模块**（调用工具执行操作）、**记忆模块**（…</p><p>· 「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」（/custom/xiaolin-agent/patterns） — 要点：我理解 Agent 和 Workflow 最核心的区别是「谁来决定下一步」…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 架构：步数上限、停止条件、死循环检测、Plan+ReAct 混合、画拓扑图。</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 记忆：事实 vs 推断分开存、写入时机、冲突合并、跨会话权限。</p><p>· 延伸阅读：解释 Agent 的核心组件：感知、推理、行动、记忆、了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我先给一个清晰定义，再用类比帮你建立直觉，最后说和生产的关系。</p><p>【主体】LLM Agent 是以大语言模型为推理核心，在多轮中与外部环境交互，通过规划、记忆与工具完成复杂任务的系统。与单次调用的差异在于：单次调用是开环生成；Agent 是闭环决策，每步可依据工具返回更新状态，直到终止条件。追问：若没有外部工具，还能叫 Agent 吗？应对：可称为「弱环境」Agent，仅有对话记忆与推理；但仍可有内环多步 CoT 与 **自我验证」。面试中强调是否存在「行动—观察」循环更清晰。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「解释 Agent 的核心组件：感知、推理、行动、记忆」里有更完整的口播示范，建议对照练一遍。</p><p>如果追问 Plan-and-Execute，我会说：步骤可预知用 Plan，环境不确定用 ReAct，生产里常混合——粗计划 + 每步 ReAct。</p></div>
</div></div>
</div>

<p class="guide-followup"><span class="guide-followup-label">追问</span>若没有外部工具，还能叫 Agent 吗？</p>
<p class="guide-followup guide-followup-a"><span class="guide-followup-label">应对</span>可称为「弱环境」Agent，仅有对话记忆与推理；但仍可有 内环多步 CoT 与 **自我验证」。面试中强调 是否存在「行动—观察」循环 更清晰。</p>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q14</span><span class="guide-q-text">ReAct 框架里三个字母代表什么？解决什么问题？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>Reasoning + Acting：在生成中交替进行 推理（Thought） 与 行动（Action），并接收 观察（Observation）。它解决的是：模型仅「空想」容易偏离事实；通过 显式推理 + 工具反馈 把推理锚定在真实环境上。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】定义题考你能不能「用类比 + 结构」讲清楚，而不是堆术语。面试官想确认你真的理解，而不是背过。</p><p>【拆开理解】</p><p>1. Reasoning + Acting：在生成中交替进行推理（Thought）与行… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像侦探办案：先推理（Thought），再行动查线索（Action），看结果（Observation），循环直到破案。</p><p>【常见误区】</p><p>1. 只背一句定义，没有说「和普通 LLM 单次调用差在哪」。</p><p>2. 把 ReAct 说成「想一步做一步」但说不清 Observation 从哪来、何时停止。</p><p>3. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「推理策略详解：Chain-of-Thought 与 Tree-of-Thought」（/custom/ai100-planning/049-cot-and-tot） — 要点：Chain-of-Thought (CoT) 和 Tree-of-Thought (ToT) 是两种主流的 LLM 推理策略。**CoT 是线性推理**——通过引导模型"一步步思考"而非直接给出答案，…</p><p>· 「Reasoning 模型（o1/o3/DeepSeek-R1）vs 标准模型：架构差…」（/custom/ai100-planning/055-reasoning-models） — 要点：Reasoning 模型（又称 Large Reasoning Models, LRMs）与标准 LLM 的核心区别是**测试时计算扩展（Test-Time Compute Scaling）**：标准…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 架构：步数上限、停止条件、死循环检测、Plan+ReAct 混合、画拓扑图。</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 延伸阅读：推理策略详解：Chain-of-Thought 与 Tree-of-Thought、Reasoning 模型（o1/o3/DeepSeek-R1）vs 标准模型：架构差…。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：说清要优化的目标指标</p><p>Action：我重点做了三件事——Reasoning + Acting：在生成中交替进行推理（Thought）与行动（Action），并接收观察（Observation）。它解决的是：模型仅「空想」容易偏离事实；通过显式推理 + 工具反馈把推理锚定在真实环境上。</p><p>Result：给量化结果，如延迟降 X%、准确率升 Y%</p><p>你也可以补充：本站题库「推理策略详解：Chain-of-Thought 与 Tree-of-Thought」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q15</span><span class="guide-q-text">你会如何设计 Agent 的停止条件？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>组合使用：模型声明 finish、任务清单全部完成、达到步数/预算上限、超时、连续无进展检测、外部成功信号（如测试通过）。生产环境必须有 硬上限 防止死循环。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】组合使用：模型声明 finish、任务清单全部完成、达到步数/预算上限、超时、连续无进展检测、外部成功信号（如测试通过）。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 组合使用：模型声明 finish、任务清单全部完成、达到步数/预算上限、超时、连… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】可以把 Agent 想成「会自己查资料、记笔记、调系统的数字员工」，比普通 ChatBot 多了闭环和多步决策。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>【面试怎么答】目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「说说 Single-Agent 和 Multi-Agent 的设计方案？」（/custom/xiaolin-agent/single_multi） — 要点：Single-Agent 适合任务流程清晰、复杂度适中的场景，实现简单、好维护；Multi-Agent 适合需要专业分工、任务量大或者需要并行执行的复杂场景…</p><p>· 「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」（/custom/xiaolin-agent/patterns） — 要点：我理解 Agent 和 Workflow 最核心的区别是「谁来决定下一步」…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 延伸阅读：说说 Single-Agent 和 Multi-Agent 的设计方案？、了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。</p><p>【主体】组合使用：模型声明 finish、任务清单全部完成、达到步数/预算上限、超时、连续无进展检测、外部成功信号（如测试通过）。生产环境必须有硬上限防止死循环。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「说说 Single-Agent 和 Multi-Agent 的设计方案？」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q16</span><span class="guide-q-text">工具描述（tool description）为什么非常重要？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>模型靠描述做 工具选择；描述不清会导致 选错工具、参数幻觉。好的描述包含：何时用、何时不用、参数含义、错误示例、返回格式。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】核心围绕「工具描述（tool description）为什么非常重要」：把标准答案里的每个要点都能用自己的话展开 2～3 句。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 模型靠描述做工具选择；描述不清会导致选错工具、参数幻觉。好的描述包含：何时用、何… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像给员工配电脑和系统账号：没有工具只能动嘴，有了工具才能查库存、下单、跑代码。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。</p><p>【主体】模型靠描述做工具选择；描述不清会导致选错工具、参数幻觉。好的描述包含：何时用、何时不用、参数含义、错误示例、返回格式。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q17</span><span class="guide-q-text">Memory 用向量库就够了吗？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>不够。向量检索擅长相似度，但弱于精确约束与关系推理。工程上常见 向量 + 关键词/结构化库 + 图谱（按需），并维护 元数据与权限。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】核心围绕「Memory 用向量库就够了吗」：把标准答案里的每个要点都能用自己的话展开 2～3 句。</p><p>【为什么考这个】这题和 RAG、Memory、Safety 都相关，属于 Agent 面试的高频交叉点。</p><p>【拆开理解】</p><p>1. 不够。向量检索擅长相似度，但弱于精确约束与关系推理。工程上常见向量 + 关键词/… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>2. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】结论 → 原理 → 例子 → 边界/兜底。控制在 60～90 秒，留时间给追问。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「如何实现 Agent 的持久化记忆（Persistent Memory）？」（/custom/ai100-memory/043-persistent-memory） — 要点：持久化记忆使 Agent 能跨会话保留知识——用户下周回来时，Agent 仍记得之前的对话和偏好。核心架构是**双层存储**：短期记忆（上下文窗口）+ 长期记忆（外部持久存储）。实现方式包括：**向量…</p><p>· 「长期记忆存储介质选型：向量 / 结构化 / 图谱」（/custom/ai100-memory/046-long-term-memory-storage） — 要点：Agent 长期记忆有三种主要存储介质，各擅其长：(1) **向量记忆**（Embedding + 向量数据库）擅长**语义相似度检索**，基于"意思相近"找到相关记忆，适合非结构化文本和模糊查询；(…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 记忆：事实 vs 推断分开存、写入时机、冲突合并、跨会话权限。</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 延伸阅读：如何实现 Agent 的持久化记忆（Persistent Memory）？、长期记忆存储介质选型：向量 / 结构化 / 图谱。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我尽量用你能直接复述的结构来答，先结论后展开。</p><p>【主体】不够。向量检索擅长相似度，但弱于精确约束与关系推理。工程上常见向量 + 关键词/结构化库 + 图谱（按需），并维护元数据与权限。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「如何实现 Agent 的持久化记忆（Persistent Memory）？」里有更完整的口播示范，建议对照练一遍。</p><p>如果追问为什么不用纯向量，我会说：编号、专有名词、精确匹配 BM25 更稳，所以 Hybrid + 重排是常态。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q18</span><span class="guide-q-text">多 Agent 协作和单 Agent 多工具怎么选？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>单 Agent 多工具：实现简单、延迟低，适合任务边界清晰。多 Agent：角色分工、并行探索、对抗审查（如「批评者 Agent」）；但带来 协调成本与一致性问题。选型看 任务分解结构、组织边界、延迟与成本。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】单 Agent 多工具：实现简单、延迟低，适合任务边界清晰。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 单 Agent 多工具：实现简单、延迟低，适合任务边界清晰。多 Agent：角色… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像给员工配电脑和系统账号：没有工具只能动嘴，有了工具才能查库存、下单、跑代码。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」（/custom/xiaolin-agent/patterns） — 要点：我理解 Agent 和 Workflow 最核心的区别是「谁来决定下一步」…</p><p>· 「说说 Single-Agent 和 Multi-Agent 的设计方案？」（/custom/xiaolin-agent/single_multi） — 要点：Single-Agent 适合任务流程清晰、复杂度适中的场景，实现简单、好维护；Multi-Agent 适合需要专业分工、任务量大或者需要并行执行的复杂场景…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 延伸阅读：了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…、说说 Single-Agent 和 Multi-Agent 的设计方案？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。</p><p>【主体】单 Agent 多工具：实现简单、延迟低，适合任务边界清晰。多 Agent：角色分工、并行探索、对抗审查（如「批评者 Agent」）；但带来协调成本与一致性问题。选型看任务分解结构、组织边界、延迟与成本。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q19</span><span class="guide-q-text">如何做「人在回路」又不打断体验？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>分级：低风险自动执行；中风险 异步审批；高风险 实时确认。产品上 预授权（例如仅本次会话可读某目录）、可撤销、默认最小权限。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】核心围绕「如何做「人在回路」又不打断体验」：把标准答案里的每个要点都能用自己的话展开 2～3 句。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 分级：低风险自动执行；中风险异步审批；高风险实时确认。产品上预授权（例如仅本次会… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】可以把 Agent 想成「会自己查资料、记笔记、调系统的数字员工」，比普通 ChatBot 多了闭环和多步决策。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。</p><p>【主体】分级：低风险自动执行；中风险异步审批；高风险实时确认。产品上预授权（例如仅本次会话可读某目录）、可撤销、默认最小权限。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q20</span><span class="guide-q-text">Agent 日志应记录什么？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>用户输入（脱敏）、模型原始输出、解析后的工具调用、工具返回摘要、耗时与 Token、版本号（模型与 Prompt）、追踪 ID，便于复盘与合规审计。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】用户输入（脱敏）、模型原始输出、解析后的工具调用、工具返回摘要、耗时与 Token、版本号（模型与 Prompt）、追踪 ID，便于复盘与合规审计。</p><p>【为什么考这个】这题和 Tool、Safety、Engineering 都相关，属于 Agent 面试的高频交叉点。</p><p>【拆开理解】</p><p>1. 用户输入（脱敏）、模型原始输出、解析后的工具调用、工具返回摘要、耗时与 Toke… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像给员工配电脑和系统账号：没有工具只能动嘴，有了工具才能查库存、下单、跑代码。</p><p>【常见误区】</p><p>1. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>2. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】结论 → 原理 → 例子 → 边界/兜底。控制在 60～90 秒，留时间给追问。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Prompt Chaining：多步骤 Prompt 的设计与编排」（/custom/ai100-prompt/063-prompt-chaining） — 要点：Prompt Chaining（提示链）是将复杂任务分解为多个顺序执行的 LLM 调用，每个调用的输出作为下一个调用的输入。它是 Agentic AI 中最基础的设计模式，也被称为 Pipeline …</p><p>· 「跨模型 Prompt 迁移：如何编写模型无关的 Prompt？」（/custom/ai100-prompt/068-cross-model-prompt-portability） — 要点：跨模型 Prompt 迁移（Cross-Model Prompt Portability）是指让同一个 Prompt 在不同 LLM（GPT-4、Claude、Gemini、Llama 等）上都能有效…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 延伸阅读：Prompt Chaining：多步骤 Prompt 的设计与编排、跨模型 Prompt 迁移：如何编写模型无关的 Prompt？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我尽量用你能直接复述的结构来答，先结论后展开。</p><p>【主体】用户输入（脱敏）、模型原始输出、解析后的工具调用、工具返回摘要、耗时与 Token、版本号（模型与 Prompt）、追踪 ID，便于复盘与合规审计。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「Prompt Chaining：多步骤 Prompt 的设计与编排」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q21</span><span class="guide-q-text">为什么「让模型自己选工具」可能不如「路由器 + 规则」？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>在 域窄、路径稳定 的场景，路由器更 省成本、可测试、行为确定；全模型路由在 开放域 更灵活。最佳实践常是 混合：易分类走规则，难例走模型。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】在域窄、路径稳定的场景，路由器更省成本、可测试、行为确定。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 在域窄、路径稳定的场景，路由器更省成本、可测试、行为确定；全模型路由在开放域更灵… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像给员工配电脑和系统账号：没有工具只能动嘴，有了工具才能查库存、下单、跑代码。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「模型路由（Model Routing）：如何根据任务复杂度选择模型？」（/custom/ai100-production/089-model-routing） — 要点：模型路由（Model Routing）是在运行时根据每个请求的特征（复杂度、类型、延迟要求、成本约束）**动态选择最合适的 LLM** 的技术。核心思想：不用一个模型处理所有任务——简单问答用 GPT…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 延伸阅读：模型路由（Model Routing）：如何根据任务复杂度选择模型？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。</p><p>【主体】在域窄、路径稳定的场景，路由器更省成本、可测试、行为确定；全模型路由在开放域更灵活。最佳实践常是混合：易分类走规则，难例走模型。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「模型路由（Model Routing）：如何根据任务复杂度选择模型？」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q22</span><span class="guide-q-text">简述 Planner-Executor 架构及优缺点。</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>Planner 产出步骤或 DAG；Executor 逐步执行并可把结果反馈给 Planner 重规划。优点：结构清晰、易加校验；缺点：规划一次可能不准，需 迭代重规划；两阶段可能增加延迟。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】Planner 产出步骤或 DAG。</p><p>【为什么考这个】定义题考你能不能「用类比 + 结构」讲清楚，而不是堆术语。面试官想确认你真的理解，而不是背过。</p><p>【拆开理解】</p><p>1. Planner 产出步骤或 DAG；Executor 逐步执行并可把结果反馈给 … → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像装修：先出施工图（Plan），再按步骤施工（Execute）；中途发现问题可以改图纸（Replan）。</p><p>【常见误区】</p><p>1. 只背一句定义，没有说「和普通 LLM 单次调用差在哪」。</p><p>【面试怎么答】15 秒定义 → 30 秒展开组件/流程 → 15 秒举例 → 10 秒和 ChatBot/Chain 的区别。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Agent 架构模式详解：ReAct、Plan-and-Execute、LATS、P…」（/custom/ai100-agent-arch/003-agent-architecture-patterns） — 要点：主流 Agent 架构模式各有侧重：**ReAct** 交替推理与行动，灵活且可解释性强，但 token 消耗高；**Plan-and-Execute** 先规划后执行，高效但适应性低；**LATS*…</p><p>· 「Plan-and-Solve 与动态重规划」（/custom/ai100-planning/052-plan-and-solve-replanning） — 要点：Plan-and-Solve (PS) 是 Wang et al. (2023, ACL) 提出的零样本 Prompting 策略，核心思想是将任务执行分为"先制定计划、再逐步执行"两个阶段，解决了 …</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 架构：步数上限、停止条件、死循环检测、Plan+ReAct 混合、画拓扑图。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 延伸阅读：Agent 架构模式详解：ReAct、Plan-and-Execute、LATS、P…、Plan-and-Solve 与动态重规划。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我先给一个清晰定义，再用类比帮你建立直觉，最后说和生产的关系。</p><p>【主体】Planner 产出步骤或 DAG；Executor 逐步执行并可把结果反馈给 Planner 重规划。优点：结构清晰、易加校验；缺点：规划一次可能不准，需迭代重规划；两阶段可能增加延迟。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「Agent 架构模式详解：ReAct、Plan-and-Execute、LATS、P…」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q23</span><span class="guide-q-text">Agent 如何做版本管理与灰度？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>Prompt/工具/schema 版本化；影子模式（只记录建议不执行）；金丝雀 用户群；关键指标对比（成功率、成本、违规数）；一键回滚。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】Prompt/工具/schema 版本化。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Prompt/工具/schema 版本化；影子模式（只记录建议不执行）；金丝雀用… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像给员工配电脑和系统账号：没有工具只能动嘴，有了工具才能查库存、下单、跑代码。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Prompt Chaining：多步骤 Prompt 的设计与编排」（/custom/ai100-prompt/063-prompt-chaining） — 要点：Prompt Chaining（提示链）是将复杂任务分解为多个顺序执行的 LLM 调用，每个调用的输出作为下一个调用的输入。它是 Agentic AI 中最基础的设计模式，也被称为 Pipeline …</p><p>· 「Prompt 版本管理与 A/B 测试」（/custom/ai100-prompt/066-prompt-versioning-ab-testing） — 要点：在生产 LLM 应用中，Prompt 等同于代码——需要版本控制、测试和渐进式发布。**Prompt 版本管理**核心原则：(1) Prompt 与代码分离（解耦），支持独立部署和回滚；(2) 不可变…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 延伸阅读：Prompt Chaining：多步骤 Prompt 的设计与编排、Prompt 版本管理与 A/B 测试。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。</p><p>【主体】Prompt/工具/schema 版本化；影子模式（只记录建议不执行）；金丝雀用户群；关键指标对比（成功率、成本、违规数）；一键回滚。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「Prompt Chaining：多步骤 Prompt 的设计与编排」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q24</span><span class="guide-q-text">举一个「不是 Agent 但常被误认为 Agent」的例子。</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>固定三步的 RAG 流水线（query 改写 → 检索 → 生成），若无 基于观察的再决策循环，更像Chain；若加入 多轮检索策略与失败分支 则接近 Agent。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】固定三步的 RAG 流水线（query 改写→检索→生成），若无基于观察的再决策循环，更像 Chain。</p><p>【为什么考这个】这题和 ReAct、RAG 都相关，属于 Agent 面试的高频交叉点。</p><p>【拆开理解】</p><p>1. 固定三步的 RAG 流水线（query 改写→检索→生成），若无基于观察的再决策… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像侦探办案：先推理（Thought），再行动查线索（Action），看结果（Observation），循环直到破案。</p><p>【常见误区】</p><p>1. 把 ReAct 说成「想一步做一步」但说不清 Observation 从哪来、何时停止。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>【面试怎么答】结论 → 原理 → 例子 → 边界/兜底。控制在 60～90 秒，留时间给追问。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」（/custom/xiaolin-agent/patterns） — 要点：我理解 Agent 和 Workflow 最核心的区别是「谁来决定下一步」…</p><p>· 「说说 Single-Agent 和 Multi-Agent 的设计方案？」（/custom/xiaolin-agent/single_multi） — 要点：Single-Agent 适合任务流程清晰、复杂度适中的场景，实现简单、好维护；Multi-Agent 适合需要专业分工、任务量大或者需要并行执行的复杂场景…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 架构：步数上限、停止条件、死循环检测、Plan+ReAct 混合、画拓扑图。</p><p>· 延伸阅读：了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…、说说 Single-Agent 和 Multi-Agent 的设计方案？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我尽量用你能直接复述的结构来答，先结论后展开。</p><p>【主体】固定三步的 RAG 流水线（query 改写→检索→生成），若无基于观察的再决策循环，更像 Chain；若加入多轮检索策略与失败分支则接近 Agent。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」里有更完整的口播示范，建议对照练一遍。</p><p>如果追问 Plan-and-Execute，我会说：步骤可预知用 Plan，环境不确定用 ReAct，生产里常混合——粗计划 + 每步 ReAct。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q25</span><span class="guide-q-text">你如何向非技术经理解释 Agent 的风险？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>用 「能办事的实习生」 类比：能力强但可能 记错、被误导、误操作；所以我们要 权限卡、审批、监控录像（日志），重要操作 双人复核——对应最小权限、人在回路、审计。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】用「能办事的实习生」类比：能力强但可能记错、被误导、误操作。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 用「能办事的实习生」类比：能力强但可能记错、被误导、误操作；所以我们要权限卡、审… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】可以把 Agent 想成「会自己查资料、记笔记、调系统的数字员工」，比普通 ChatBot 多了闭环和多步决策。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「说说 Single-Agent 和 Multi-Agent 的设计方案？」（/custom/xiaolin-agent/single_multi） — 要点：Single-Agent 适合任务流程清晰、复杂度适中的场景，实现简单、好维护；Multi-Agent 适合需要专业分工、任务量大或者需要并行执行的复杂场景…</p><p>· 「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」（/custom/xiaolin-agent/patterns） — 要点：我理解 Agent 和 Workflow 最核心的区别是「谁来决定下一步」…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 延伸阅读：说说 Single-Agent 和 Multi-Agent 的设计方案？、了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。</p><p>【主体】用「能办事的实习生」类比：能力强但可能记错、被误导、误操作；所以我们要权限卡、审批、监控录像（日志），重要操作双人复核——对应最小权限、人在回路、审计。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「说说 Single-Agent 和 Multi-Agent 的设计方案？」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q26</span><span class="guide-q-text">上下文窗口越来越大，还需要外部记忆吗？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>需要。长窗口 ≠ 低成本，也不等于 可检索、可治理、可遗忘。外部记忆解决 跨会话持久化、结构化权限、版本与溯源；窗口内更适合 热工作集。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】核心围绕「上下文窗口越来越大，还需要外部记忆吗」：把标准答案里的每个要点都能用自己的话展开 2～3 句。</p><p>【为什么考这个】这题和 RAG、Memory、Safety 都相关，属于 Agent 面试的高频交叉点。</p><p>【拆开理解】</p><p>1. 需要。长窗口≠低成本，也不等于可检索、可治理、可遗忘。外部记忆解决跨会话持久化、… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>2. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】结论 → 原理 → 例子 → 边界/兜底。控制在 60～90 秒，留时间给追问。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「长期记忆存储介质选型：向量 / 结构化 / 图谱」（/custom/ai100-memory/046-long-term-memory-storage） — 要点：Agent 长期记忆有三种主要存储介质，各擅其长：(1) **向量记忆**（Embedding + 向量数据库）擅长**语义相似度检索**，基于"意思相近"找到相关记忆，适合非结构化文本和模糊查询；(…</p><p>· 「长上下文处理与记忆管理」（/custom/today-interview/context-memory-management） — 要点：不是无限塞，是分层管理——热数据进 prompt、温数据进检索库、冷数据压缩归档；检索结果做去重和重要性排序后再入 context；历史对话滚动摘要而非全量堆。…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 记忆：事实 vs 推断分开存、写入时机、冲突合并、跨会话权限。</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 延伸阅读：长期记忆存储介质选型：向量 / 结构化 / 图谱、长上下文处理与记忆管理。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我尽量用你能直接复述的结构来答，先结论后展开。</p><p>【主体】需要。长窗口≠低成本，也不等于可检索、可治理、可遗忘。外部记忆解决跨会话持久化、结构化权限、版本与溯源；窗口内更适合热工作集。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「长期记忆存储介质选型：向量 / 结构化 / 图谱」里有更完整的口播示范，建议对照练一遍。</p><p>如果追问为什么不用纯向量，我会说：编号、专有名词、精确匹配 BM25 更稳，所以 Hybrid + 重排是常态。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q27</span><span class="guide-q-text">如何测试 Agent？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>单元测工具、模拟环境、回归集（固定任务与期望轨迹范围）、对抗用例（注入、越权）、线上金丝雀；避免只测最终答案而忽略 过程正确性。附：知识点速查表主题                     一句话定义           LLM + 规划 + 记忆 + 工具，闭环决策vs Chain     控制流在代码 vs 在模型+环境反馈vs ChatBot   对话为主 vs 任务闭环与工具编排组成           感知、规划、记忆、工具、执行、反思流程           输入→分解→调用→整合→输出分类           反应式、模型、目标、效用、学习场景           客服、代码、数据、运维、知识管理挑战           幻觉、安全、成本、可解释、评估学习建议： 读完本文后，尝试用 200 行内实现一个「带假工具」的循环 Agent，并刻意制造 工具失败 与 注入攻击 用例，观察系统行为，再对照本文的治理手段逐项加约束。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】单元测工具、模拟环境、回归集（固定任务与期望轨迹范围）、对抗用例（注入、越权）、线上金丝雀。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 单元测工具、模拟环境、回归集（固定任务与期望轨迹范围）、对抗用例（注入、越权）、… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像侦探办案：先推理（Thought），再行动查线索（Action），看结果（Observation），循环直到破案。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 把 ReAct 说成「想一步做一步」但说不清 Observation 从哪来、何时停止。</p><p>3. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>4. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「解释 Agent 的核心组件：感知、推理、行动、记忆」（/custom/ai100-agent-arch/002-agent-core-components） — 要点：一个完整的 LLM Agent 由四大核心组件构成：**感知模块**（接收和解析输入）、**推理模块**（LLM 作为"大脑"进行思考和规划）、**行动模块**（调用工具执行操作）、**记忆模块**（…</p><p>· 「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」（/custom/xiaolin-agent/patterns） — 要点：我理解 Agent 和 Workflow 最核心的区别是「谁来决定下一步」…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 架构：步数上限、停止条件、死循环检测、Plan+ReAct 混合、画拓扑图。</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 记忆：事实 vs 推断分开存、写入时机、冲突合并、跨会话权限。</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 延伸阅读：解释 Agent 的核心组件：感知、推理、行动、记忆、了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。</p><p>【主体】单元测工具、模拟环境、回归集（固定任务与期望轨迹范围）、对抗用例（注入、越权）、线上金丝雀；避免只测最终答案而忽略过程正确性。附：知识点速查表主题一句话定义 LLM + 规划 + 记忆 + 工具，闭环决策 vs Chain 控制流在代码 vs 在模型+环境反馈 vs ChatBot 对话为主 vs 任务闭环与工具编排组成感知、规划、记忆、工具、执行、反思流程输入→分解→调用→整合→输出分类反应式、模型、目标、效用、学习场景客服、代码、数据、运维、知识管理挑战幻觉、安全、成本、可解释、评估学习建议：读完本文后，尝试用 200 行内实现一个「带假工具」的循环 Agent，并刻意制造工具失败与注入攻击用例，观察系统行为，再对照本文的治理手段逐项加约束。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「解释 Agent 的核心组件：感知、推理、行动、记忆」里有更完整的口播示范，建议对照练一遍。</p><p>如果追问 Plan-and-Execute，我会说：步骤可预知用 Plan，环境不确定用 ReAct，生产里常混合——粗计划 + 每步 ReAct。</p></div>
</div></div>
</div>
