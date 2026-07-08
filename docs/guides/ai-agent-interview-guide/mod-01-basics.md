---
title: 01 · Agent 基础概念
titleTemplate: false
pageClass: guides-doc
outline: [2, 3]
aside: true
---

<p class="guide-chapter-badge">01 · Agent 基础概念</p>

<p class="guide-lead">面向零基础读者的系统梳理：每个知识点均包含「概念 + 原理 + 面试问答 + 追问 + 代码 （如适用）」。建议配合动手写一个小 Agent 循环加深理解。</p>

## 1. 什么是 AI Agent

### 1.1 概念解释（通俗易懂，带类比）

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

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q1</span><span class="guide-q-text">一句话说明什么是 AI Agent？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>AI Agent 是以大模型为认知核心，结合规划、记忆与工具调用，能在多步交互中根据环境反馈持续决策并完成任务的系统；其本质是 闭环的感知—思考—行动 循环，而不仅是单次文本生成。</p>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q2</span><span class="guide-q-text">为什么说 Agent = LLM + Planning + Memory + Tools？缺一块会怎样？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>缺 Planning：容易变成「只会接话」的聊天，长任务易跑偏或一步登天完不成。缺 Memory：长对话会丢线索，多会话无法延续用户偏好与任务状态。缺 Tools：只能「空谈」，无法查实时信息、执行代码、改系统状态。LLM 仍是中枢，但单靠 LLM 没有外环则不是完整 Agent。</p>
</div></div>
</div>

### 1.4 可能的追问及应对

<p class="guide-followup"><span class="guide-followup-label">追问</span>Agent 的「自主」是不是不受控？</p>
<p class="guide-followup guide-followup-a"><span class="guide-followup-label">应对</span>强调 策略与护栏：工具白名单、参数校验、人在回路（HITL）、预算与步数上限、输出审核；自主是在约束空间内的决策。</p>
<p class="guide-followup"><span class="guide-followup-label">追问</span>和 AutoGPT 那种有什么区别？</p>
<p class="guide-followup guide-followup-a"><span class="guide-followup-label">应对</span>AutoGPT 是早期「目标导向 + 工具」的一种产品形态；面试应抽象到 循环架构与组件（规划/记忆/工具），避免绑定单一产品名。</p>
### 1.5 代码示例：最小「思考—行动—观察」循环（Python 伪代码）

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

 ChatBot（聊天机器人）：像 前台接待——以对话为主，核心是「接话与回复」，通常不强调多
 步任务闭环与工具编排。
 LLM Chain（链）：像 流水线工人——人（开发者）预先写好步骤顺序：A 做完接 B，再接
 C；路径相对固定。
 Agent：像 项目经理——步骤不是完全写死的，模型根据当前观察决定下一步，可分支、可重
 试、可换工具。
### 2.2 原理详解（技术细节）

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

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q3</span><span class="guide-q-text">Agent 和 Prompt Chain 有什么本质区别？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>Prompt Chain 的拓扑与顺序主要由工程侧固定；Agent 在运行时在动作空间中做选择，并依赖 Observation 更新信念，适合输入与路径不确定的任务。二者可结合：链负责稳定流程，Agent 负责链内某段的灵活分支。</p>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q4</span><span class="guide-q-text">ChatBot 加上插件是不是就变成 Agent 了？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>不一定。若插件调用由固定规则触发（例如关键词路由），更像「带工具的 Bot」。若由模型在多步推理中自主选择工具与参数，并形成闭环迭代，则更贴近 Agent。关键在是否具备多步自主决策与反馈闭环。</p>
</div></div>
</div>

### 2.4 可能的追问及应对

<p class="guide-followup"><span class="guide-followup-label">追问</span>RAG + Chat 算不算 Agent？</p>
<p class="guide-followup guide-followup-a"><span class="guide-followup-label">应对</span>单次检索再回答，偏「增强型 Chat」。若有多轮检索策略（查不到换查询、分解子问题、交叉验证），则具备 Agent 特征。名称不重要，讲清架构即可。</p>
### 2.5 架构差异图（文字描述）

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

 感知常与 结构化抽取、OCR、HTML 解析、日志解析 结合；关键是减少噪声进上下文。
 规划常见实现：CoT / ReAct、Planner-Executor 双模块、树搜索（LATS）、任务图。
 记忆工程要点：摘要压缩、引用溯源、记忆冲突解决、权限与隐私。
 工具要点：最小权限、参数校验、错误信息回灌模型。
 反思可做成独立子调用：「列出本次推理的三处风险并修正」。
### 3.3 面试问题（Q）与标准答案（A）

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q5</span><span class="guide-q-text">Agent 的记忆一般怎么设计？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>分层设计最常见：工作记忆（当前轨迹与关键结论）+ 会话记忆（摘要滚动）+ 长期记忆（向量检索/结构化库）。写入要区分「事实」与「推断」，并带时间戳与来源，便于更新与撤销。</p>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q6</span><span class="guide-q-text">规划和执行要不要拆开两个模型？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>视任务而定。Planner-Executor 拆分可提升可控性（强模型规划、快模型执行）；单模型端到端更简单但易在长链路漂移。可混合：规划用强模型，执行层做确定性校验。</p>
</div></div>
</div>

### 3.4 可能的追问及应对

<p class="guide-followup"><span class="guide-followup-label">追问</span>反思是不是必须？</p>
<p class="guide-followup guide-followup-a"><span class="guide-followup-label">应对</span>不是必须，但对高 stakes 或易错工具场景收益大；成本是额外延迟与 Token。</p>
### 3.5 代码示例：工具 Schema（OpenAI 风格示意）

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

可理解为：听懂 → 拆活 → 动手 → 对账 → 交卷。
### 4.2 原理详解（逐步）

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

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q7</span><span class="guide-q-text">如何避免 Agent 在工具调用间「迷失」？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>明确 停止条件 与 最大步数；维护 任务清单（todo） 与 当前子目标；对每步输出要求 结构化（JSON）；关键步骤 强制验证（单元测试式检查、二次 LLM 审核）。</p>
</div></div>
</div>

### 4.4 可能的追问及应对

<p class="guide-followup"><span class="guide-followup-label">追问</span>结果冲突怎么整合？</p>
<p class="guide-followup guide-followup-a"><span class="guide-followup-label">应对</span>优先级规则（权威源 &gt; 时间新 &gt; 多源一致）、让模型显式输出「冲突说明」、必要时触发人工。</p>
### 4.5 代码示例：简单「任务清单」状态

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

分类来自智能体理论，可与 LLM Agent 对照理解：
                类型                                通俗理解
 反应式（Reactive）                  类似反射：输入→动作，几乎不维护复杂内部模型。
 基于模型（Model-based）              脑中有「世界模型」，能预测行动后果。
 基于目标（Goal-based）               明确要达成什么状态，能选路径。
 基于效用（Utility-based）            多目标权衡，选期望效用最大的行动。
 学习型（Learning）                  从反馈中更新策略或模型。

### 5.2 原理详解（与 LLM Agent 的映射）

 反应式：适合低延迟、规则清晰；LLM 只做轻量分类/路由。
 基于模型：显式维护状态机、仿真环境或知识图谱。
 目标 / 效用：用 奖励函数、约束优化、多指标打分 指导规划。
 学习型：RLHF、在线反馈、Bandit 选工具；注意样本效率与安全。
### 5.3 面试问题（Q）与标准答案（A）

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q8</span><span class="guide-q-text">基于效用的 Agent 和基于目标的有什么区别？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>目标型关注「是否达成」；效用型在多个冲突目标间做权衡（成本、时延、风险、用户偏好），选综合最优而非单点达成。</p>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q9</span><span class="guide-q-text">反应式 Agent 有什么优缺点？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>优点：快、可解释、易测试。缺点：对长程依赖与复杂推理弱；遇到未见输入可能失效。常与分层架构结合。</p>
</div></div>
</div>

### 5.4 可能的追问及应对

<p class="guide-followup"><span class="guide-followup-label">追问</span>LLM Agent 一般算哪一类？</p>
<p class="guide-followup guide-followup-a"><span class="guide-followup-label">应对</span>常是混合型：底层是模型推理，上层可接目标/效用（打分选路径）+ 记忆（世界状态）+ 学习（反馈更新）。</p>

## 6. Agent 的应用场景

### 6.1 概念解释

结合「高频、可工具化、可评估」的场景优先落地。
### 6.2 原理详解（场景与要点）

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

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q10</span><span class="guide-q-text">企业内部落地 Agent，你最先关心哪三个非功能需求？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>安全与合规（权限、审计）、可控性（人在回路、工具白名单）、可观测性（轨迹、指标、回放）。</p>
</div></div>
</div>

### 6.4 可能的追问及应对

<p class="guide-followup"><span class="guide-followup-label">追问</span>客服场景如何降低幻觉？</p>
<p class="guide-followup guide-followup-a"><span class="guide-followup-label">应对</span>强 RAG 溯源、禁止无引用断言、模板化答复、未知则转人工。</p>

## 7. Agent 的挑战与局限

### 7.1 概念解释

Agent 把能力做强的同时，把 错误放大 到多步；工程上要「限步、限权、可观测、可回滚」。
### 7.2 原理详解

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

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q11</span><span class="guide-q-text">怎么评估一个 Agent 的好坏？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>分层评估：任务成功率、平均步数/成本、工具错误率、用户满意度、安全事件数；基准可包括静态数据集 + 仿真环境 + 线上 A/B。</p>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q12</span><span class="guide-q-text">Agent 的最大风险是什么？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>复合错误与权限滥用——单步小错在多步放大，或工具被诱导执行高危操作；因此必须 最小权限 + 强审计 + 人在回路。</p>
</div></div>
</div>

### 7.4 可能的追问及应对

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
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q15</span><span class="guide-q-text">你会如何设计 Agent 的停止条件？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>组合使用：模型声明 finish、任务清单全部完成、达到步数/预算上限、超时、连续无进展检测、外部成功信号（如测试通过）。生产环境必须有 硬上限 防止死循环。</p>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q16</span><span class="guide-q-text">工具描述（tool description）为什么非常重要？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>模型靠描述做 工具选择；描述不清会导致 选错工具、参数幻觉。好的描述包含：何时用、何时不用、参数含义、错误示例、返回格式。</p>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q17</span><span class="guide-q-text">Memory 用向量库就够了吗？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>不够。向量检索擅长相似度，但弱于精确约束与关系推理。工程上常见 向量 + 关键词/结构化库 + 图谱（按需），并维护 元数据与权限。</p>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q18</span><span class="guide-q-text">多 Agent 协作和单 Agent 多工具怎么选？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>单 Agent 多工具：实现简单、延迟低，适合任务边界清晰。多 Agent：角色分工、并行探索、对抗审查（如「批评者 Agent」）；但带来 协调成本与一致性问题。选型看 任务分解结构、组织边界、延迟与成本。</p>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q19</span><span class="guide-q-text">如何做「人在回路」又不打断体验？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>分级：低风险自动执行；中风险 异步审批；高风险 实时确认。产品上 预授权（例如仅本次会话可读某目录）、可撤销、默认最小权限。</p>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q20</span><span class="guide-q-text">Agent 日志应记录什么？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>用户输入（脱敏）、模型原始输出、解析后的工具调用、工具返回摘要、耗时与 Token、版本号（模型与 Prompt）、追踪 ID，便于复盘与合规审计。</p>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q21</span><span class="guide-q-text">为什么「让模型自己选工具」可能不如「路由器 + 规则」？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>在 域窄、路径稳定 的场景，路由器更 省成本、可测试、行为确定；全模型路由在 开放域 更灵活。最佳实践常是 混合：易分类走规则，难例走模型。</p>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q22</span><span class="guide-q-text">简述 Planner-Executor 架构及优缺点。</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>Planner 产出步骤或 DAG；Executor 逐步执行并可把结果反馈给 Planner 重规划。优点：结构清晰、易加校验；缺点：规划一次可能不准，需 迭代重规划；两阶段可能增加延迟。</p>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q23</span><span class="guide-q-text">Agent 如何做版本管理与灰度？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>Prompt/工具/schema 版本化；影子模式（只记录建议不执行）；金丝雀 用户群；关键指标对比（成功率、成本、违规数）；一键回滚。</p>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q24</span><span class="guide-q-text">举一个「不是 Agent 但常被误认为 Agent」的例子。</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>固定三步的 RAG 流水线（query 改写 → 检索 → 生成），若无 基于观察的再决策循环，更像Chain；若加入 多轮检索策略与失败分支 则接近 Agent。</p>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q25</span><span class="guide-q-text">你如何向非技术经理解释 Agent 的风险？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>用 「能办事的实习生」 类比：能力强但可能 记错、被误导、误操作；所以我们要 权限卡、审批、监控录像（日志），重要操作 双人复核——对应最小权限、人在回路、审计。</p>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q26</span><span class="guide-q-text">上下文窗口越来越大，还需要外部记忆吗？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>需要。长窗口 ≠ 低成本，也不等于 可检索、可治理、可遗忘。外部记忆解决 跨会话持久化、结构化权限、版本与溯源；窗口内更适合 热工作集。</p>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q27</span><span class="guide-q-text">如何测试 Agent？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>单元测工具、模拟环境、回归集（固定任务与期望轨迹范围）、对抗用例（注入、越权）、线上金丝雀；避免只测最终答案而忽略 过程正确性。附：知识点速查表主题                     一句话定义           LLM + 规划 + 记忆 + 工具，闭环决策vs Chain     控制流在代码 vs 在模型+环境反馈vs ChatBot   对话为主 vs 任务闭环与工具编排组成           感知、规划、记忆、工具、执行、反思流程           输入→分解→调用→整合→输出分类           反应式、模型、目标、效用、学习场景           客服、代码、数据、运维、知识管理挑战           幻觉、安全、成本、可解释、评估学习建议： 读完本文后，尝试用 200 行内实现一个「带假工具」的循环 Agent，并刻意制造 工具失败 与 注入攻击 用例，观察系统行为，再对照本文的治理手段逐项加约束。</p>
</div></div>
</div>
