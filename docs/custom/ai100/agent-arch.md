---
custom: true
pageClass: ai100-doc
partTitle: Agent Interview 100 · Agent 架构
partColor: #6366f1
---

<div class="part-hero custom-hero chapter-hero" style="--part-color: #6366f1">

# 🏛️ Agent 架构

<p class="part-desc">Agent Interview 100 · 第 1/11 章 · 10 题</p>
<span class="part-round custom-tag">面试问答</span>

</div>

<div class="chapter-nav">

<a class="chapter-nav-link" href="/custom/ai100/">📑 总览</a>

<a class="chapter-nav-link chapter-nav-next" href="/custom/ai100/rag">🔍 RAG →</a>

</div>

<div class="question-card ai100-card interview-card compact-card" id="001-what-is-llm-agent">

<h2 class="question-title"><span class="q-badge ai100-badge">Q1</span><span class="question-text">什么是 LLM Agent？与传统 LLM 应用有何区别？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐ · 标签：Agent, AI100 · 考察点：Agent 架构</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：LLM Agent 是以大语言模型为核心推理引擎、能够自主感知环境、制定计划、调用工具并执行多步任务的智能系统。与传统 LLM 应用（单轮问答、文本生成）最大的区别在于：Agent 是有状态的、目标驱动的、能与外部世界交互的自主系统，而传统 LLM 应用是无状态的、被动响应式的文本处理器。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误区："有了 Function Calling 就是 Agent" · 误区："Agent 比传统 LLM 应用总是更好" · 追问："Agent 调试比传统 LLM 应用难在哪里？"</div>
</div>

## 详细解析

### 传统 LLM 应用

传统 LLM 应用本质上是一个"高级文本处理器"。用户输入 Prompt，模型返回文本输出，整个交互是单轮、无状态的。典型场景包括：文案生成、文本摘要、翻译、代码补全等。

核心特征：
- **被动响应**：完全依赖用户输入，不会主动发起行为
- **无状态**：每次调用独立，不保留先前交互的记忆
- **纯文本**：输入输出都是文本，无法直接操作外部系统
- **单步完成**：一次调用生成最终结果，没有多步推理过程

### LLM Agent

LLM Agent 将 LLM 从"文本生成器"升级为"决策引擎"。Agent 接收一个高层目标，然后自主分解任务、选择工具、执行操作、根据反馈调整策略，直到目标完成。

核心特征：
- **自主性（Autonomy）**：定义目标后，Agent 自主决定"如何做"
- **有状态（Stateful）**：维护短期记忆（当前任务上下文）和长期记忆（跨会话知识）
- **工具使用（Tool Use）**：能调用 API、查询数据库、执行代码、操作文件系统
- **多步推理（Multi-step Reasoning）**：通过循环迭代完成复杂任务
- **自适应（Adaptive）**：根据中间结果和错误反馈动态调整策略

### 关键区别对照表

| 维度 | 传统 LLM 应用 | LLM Agent |
|------|-------------|-----------|
| 交互模式 | 单轮问答 | 多轮循环（Loop） |
| 状态管理 | 无状态 | 有状态（记忆系统） |
| 外部交互 | 仅文本 I/O | 工具调用、API、数据库 |
| 任务复杂度 | 单步任务 | 多步复合任务 |
| 自主程度 | 被动响应 | 目标驱动的自主执行 |
| 错误处理 | 无 | 自我纠正、重试、回退 |
| 可观测性 | Prompt → Response | Trace（思考→行动→观察循环） |

### 自主性光谱

AI 系统并非"传统 LLM"或"Agent"的二元分类，而是存在一个自主性光谱：

1. **Level 0 — 纯 LLM**：直接调用模型 API，无任何额外逻辑
2. **Level 1 — Chain/Pipeline**：多个 LLM 调用串联，但流程固定
3. **Level 2 — Router**：根据输入路由到不同的处理分支
4. **Level 3 — Tool-augmented LLM**：LLM 可以调用工具，但流程仍由人控制
5. **Level 4 — Autonomous Agent**：LLM 自主决策、规划、执行，人仅定义目标
6. **Level 5 — Multi-Agent System**：多个自主 Agent 协作完成复杂任务

大多数实际生产应用处于 Level 2-4 之间。

## 代码示例

```python
# 传统 LLM 应用：单轮文本生成
from anthropic import Anthropic

client = Anthropic()
response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[{"role": "user", "content": "总结这篇文章"}]
)
print(response.content[0].text)

# LLM Agent：多步自主执行
# Agent 接收目标 → 规划 → 调用工具 → 观察结果 → 继续或结束
import anthropic

client = anthropic.Anthropic()

tools = [
    {
        "name": "search_web",
        "description": "Search the web for information",
        "input_schema": {
            "type": "object",
            "properties": {"query": {"type": "string"}},
            "required": ["query"]
        }
    }
]

messages = [{"role": "user", "content": "调研 2026 年 AI Agent 市场规模并写一份报告"}]

# Agent Loop: 持续运行直到任务完成
while True:
    response = client.messages.create(
        model="claude-sonnet-4-5-20250929",
        max_tokens=4096,
        tools=tools,
        messages=messages
    )
    # 如果模型选择使用工具，执行工具并继续循环
    if response.stop_reason == "tool_use":
        # 关键：tool_result 必须包装为 content block，且 tool_use_id 与 tool_use 一一对应
        tool_results = [
            {
                "type": "tool_result",
                "tool_use_id": block.id,
                "content": run_tool(block.name, block.input),  # 返回 string
            }
            for block in response.content
            if block.type == "tool_use"
        ]
        messages.append({"role": "assistant", "content": response.content})
        messages.append({"role": "user", "content": tool_results})
    else:
        # 模型认为任务完成，退出循环
        print(response.content[0].text)
        break
```

## 常见误区 / 面试追问

1. **误区："有了 Function Calling 就是 Agent"** — Function Calling 只是 Agent 的一个能力组件。真正的 Agent 需要自主决策循环（Agent Loop），包括规划、执行、观察、反思的完整闭环。

2. **误区："Agent 比传统 LLM 应用总是更好"** — Agent 引入了额外的复杂性、延迟和成本。简单任务用传统 LLM 应用更高效。选择 Agent 的信号是：任务需要多步推理、外部交互、或动态决策。

3. **追问："Agent 调试比传统 LLM 应用难在哪里？"** — 传统 LLM 应用失败时只需检查 Prompt。Agent 失败可能源于规划逻辑错误、工具调用失败、记忆损坏、或无限循环，调试需要分析完整的执行 Trace。

4. **追问："如何决定一个任务是否需要 Agent？"** — 问自己：这个任务能用单次 LLM 调用完成吗？如果需要多步操作、外部数据获取、或根据中间结果做决策，就考虑用 Agent。

## 参考资料

- [LLMs vs AI Agents: What Is The Actual Difference (Medium)](https://medium.com/@speaktoharisudhan/llms-vs-ai-agents-what-is-the-actual-difference-cebd4cb789cd)
- [Understanding AI Agents vs LLMs: Key Differences Explained (EMA)](https://www.ema.ai/additional-blogs/addition-blogs/ai-agent-vs-llm-key-differences)
- [AI Agent vs LLM: Everything You Need to Know (Kanerika)](https://kanerika.com/blogs/ai-agents-vs-llm/)
- [What Are AI Agents? (IBM)](https://www.ibm.com/think/topics/ai-agents)
- [Agentic AI vs LLM: Comparing What Scales Better (Lyzr AI)](https://www.lyzr.ai/blog/agentic-ai-vs-llm/)
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="002-agent-core-components">

<h2 class="question-title"><span class="q-badge ai100-badge">Q2</span><span class="question-text">解释 Agent 的核心组件：感知、推理、行动、记忆</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐ · 标签：Agent, AI100 · 考察点：Agent 架构</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：一个完整的 LLM Agent 由四大核心组件构成：**感知模块**（接收和解析输入）、**推理模块**（LLM 作为"大脑"进行思考和规划）、**行动模块**（调用工具执行操作）、**记忆模块**（存储和检索上下文信息）。这四个模块形成一个持续运转的认知闭环：感知→推理→行动→记忆→感知...</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误区："LLM 就是 Agent 的全部" · 误区："记忆就是对话历史" · 追问："如果推理模块（LLM）出错了怎么办？"</div>
</div>

## 详细解析

### 1. 感知模块（Perception）

感知模块是 Agent 的"感官系统"，负责接收和预处理来自环境的各种信号。

**职责：**
- 接收用户自然语言输入
- 解析多模态数据（文本、图像、音频、视频）
- 处理工具返回的结果（Observation）
- 解析外部事件和通知（如 Webhook、消息队列）

**关键设计要点：**
- 感知不是被动接收，而是主动过滤和转换。原始数据需要被结构化为 Agent 可理解的格式
- 感知质量直接影响下游所有决策。如果 Agent 误解了用户意图或错误解析了工具输出，后续的推理和行动都会出错
- 现代 Agent 通常支持多模态感知：文本（NLP）、视觉（Computer Vision）、结构化数据（API Response Parsing）

```python
# 感知模块示例：解析用户输入并提取意图
class PerceptionModule:
    def process_input(self, raw_input: dict) -> dict:
        """将原始输入转化为结构化的感知数据"""
        return {
            "user_query": raw_input.get("text", ""),
            "images": raw_input.get("images", []),
            "tool_results": raw_input.get("observations", []),
            "context": self._extract_context(raw_input)
        }
```

### 2. 推理模块（Reasoning / Cognitive Core）

推理模块是 Agent 的"大脑"，通常由 LLM 担任，负责理解任务、制定计划、做出决策。

**核心能力：**
- **任务理解**：解析用户目标，理解隐含需求
- **任务分解**：将复杂任务拆解为可执行的子任务
- **规划**：制定行动序列，确定工具使用顺序
- **决策**：在多个可选方案中选择最优路径
- **反思**：评估中间结果，判断是否需要调整策略

**主流推理范式：**

| 范式 | 描述 | 适用场景 |
|------|------|---------|
| ReAct | 交替进行思考和行动 | 需要动态探索的任务 |
| Plan-and-Execute | 先完整规划，再逐步执行 | 结构化的多步任务 |
| Chain-of-Thought | 逐步推理，但不执行行动 | 纯推理问题 |
| Tree-of-Thought | 探索多条推理路径 | 需要回溯的复杂问题 |
| ReWOO | 一次性生成完整计划，减少 LLM 调用 | 成本敏感场景 |

```python
# 推理模块：LLM 作为决策核心
class ReasoningModule:
    def think(self, perception: dict, memory: dict) -> dict:
        """基于感知和记忆进行推理"""
        prompt = self._build_prompt(perception, memory)
        response = self.llm.generate(prompt)
        return {
            "thought": response.reasoning,      # 思考过程
            "plan": response.plan,              # 行动计划
            "next_action": response.action,     # 下一步行动
            "should_stop": response.is_final    # 是否完成
        }
```

### 3. 行动模块（Action / Execution）

行动模块是 Agent 与外部世界交互的"手脚"，负责执行推理模块做出的决策。

**行动类型：**
- **工具调用**：执行 Function Calling（搜索、计算、API 请求）
- **代码执行**：在沙箱中运行代码
- **数据操作**：读写数据库、文件系统
- **通信**：发送消息、邮件、触发通知
- **最终输出**：向用户返回最终答案

**关键设计考量：**
- 行动需要有明确的成功/失败反馈，作为下一轮推理的 Observation
- 工具调用应有超时、重试和降级机制
- 危险操作（删除数据、发送邮件）需要 Human-in-the-Loop 确认

```python
# 行动模块：执行工具调用
class ActionModule:
    def execute(self, action: dict) -> dict:
        """执行推理模块决定的行动"""
        tool_name = action["tool"]
        tool_input = action["input"]

        try:
            result = self.tools[tool_name].run(tool_input)
            return {"status": "success", "observation": result}
        except ToolError as e:
            return {"status": "error", "observation": str(e)}
```

### 4. 记忆模块（Memory）

记忆模块为 Agent 提供跨步骤和跨会话的上下文保持能力。

**记忆类型：**

| 类型 | 类比 | 实现 | 生命周期 |
|------|------|------|---------|
| 工作记忆 | 当前任务的"便签纸" | LLM Context Window | 单次任务 |
| 短期记忆 | 对话上下文 | 对话历史 + 摘要 | 单次会话 |
| 长期记忆 | 经验知识库 | 向量数据库 / 知识图谱 | 持久化 |

**关键设计要点：**
- 上下文窗口有限，需要摘要和压缩策略
- 长期记忆的检索质量（Recall + Precision）直接影响 Agent 表现
- 需要遗忘机制来处理过时信息

```python
# 记忆模块：管理不同层次的记忆
class MemoryModule:
    def __init__(self):
        self.working_memory = []      # 当前任务步骤
        self.conversation_history = [] # 对话历史
        self.vector_store = VectorDB() # 长期记忆

    def store(self, entry: dict):
        """存储新记忆"""
        self.working_memory.append(entry)
        if entry.get("persist"):
            self.vector_store.upsert(entry)

    def recall(self, query: str, k: int = 5) -> list:
        """检索相关记忆"""
        return self.vector_store.search(query, top_k=k)
```

### 四大模块的协作闭环

```
用户输入 → [感知] → 结构化信息
                        ↓
              [记忆] ← [推理] → 决策
                        ↓
              [行动] → 执行结果（Observation）
                        ↓
              反馈回 [感知]，开始下一轮循环
```

这个闭环持续运转，直到推理模块判断任务已完成（或达到最大步数限制）。四个模块的集成质量决定了 Agent 的整体能力——推理依赖记忆提供上下文，记忆依赖感知获取新信息，行动依赖推理做决策，感知处理行动的结果。

## 常见误区 / 面试追问

1. **误区："LLM 就是 Agent 的全部"** — LLM 只是推理模块的核心，一个完整的 Agent 还需要感知、行动、记忆模块的协同工作。

2. **误区："记忆就是对话历史"** — 对话历史只是短期记忆的一部分。完整的记忆系统还包括工作记忆（当前任务状态）和长期记忆（持久化知识库）。

3. **追问："如果推理模块（LLM）出错了怎么办？"** — 需要 Guardrails（安全护栏）+ 自我反思机制 + 人工审核介入。好的 Agent 设计应该假设 LLM 会犯错，并在架构层面做好容错。

4. **追问："四个模块的耦合度应该怎么设计？"** — 模块间应该通过标准化接口通信（如统一的消息格式），实现松耦合。这样可以独立替换某个模块（比如换一个 LLM、换一个向量数据库），不影响其他部分。

## 参考资料

- [AI Agent Core Components (IBM)](https://www.ibm.com/think/topics/components-of-ai-agents)
- [Traditional Agent Architecture: Perceive, Reason, Act (AWS)](https://docs.aws.amazon.com/prescriptive-guidance/latest/agentic-ai-foundations/traditional-agents.html)
- [The Architecture of Autonomous AI Agents (Deepak Gupta)](https://guptadeepak.com/the-rise-of-autonomous-ai-agents-a-comprehensive-guide-to-their-architecture-applications-and-impact/)
- [Agentic AI Architecture: Types, Components, Best Practices (Exabeam)](https://www.exabeam.com/explainers/agentic-ai/agentic-ai-architecture-types-components-best-practices/)
- [A Survey of Agent Architectures (arXiv:2308.11432) — Wang et al.](https://arxiv.org/abs/2308.11432)
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="003-agent-architecture-patterns">

<h2 class="question-title"><span class="q-badge ai100-badge">Q3</span><span class="question-text">Agent 架构模式详解：ReAct、Plan-and-Execute、LATS、Proactive</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：Agent, AI100 · 考察点：Agent 架构</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：主流 Agent 架构模式各有侧重：**ReAct** 交替推理与行动，灵活且可解释性强，但 token 消耗高；**Plan-and-Execute** 先规划后执行，高效但适应性低；**LATS** 用树搜索探索多条路径，质量最高但成本是 ReAct 的 3-5 倍；**Proactive Agent** 主动预测用户需求，提前执行操作，提升用户体验但实现复杂度高。实际生产中，大多数系统采用混合模式：先生成粗略计划，再以 ReAct 方式逐步执行，保留偏离计划的自由度。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误区："ReAct 就是 Function Calling" · 误区："ReAct 是最先进的，应该总是使用" · 误区："Plan-and-Execute 无法处理变化"</div>
</div>

## 详细解析

### 1. ReAct（Reason + Act）

ReAct（Reasoning + Acting）是由 Yao et al. (2022) 提出的 LLM Agent 框架，核心思想是让 LLM 交替进行推理（Thought）和行动（Action），并根据外部环境的反馈（Observation）动态调整下一步。与纯推理（Chain-of-Thought）不同，ReAct 通过工具调用获取真实信息，有效减少幻觉；与纯行动（直接调用工具）不同，ReAct 通过显式推理提升了可解释性和决策质量。

#### 核心循环：Thought -> Action -> Observation

ReAct 的运行机制是一个迭代循环：

1. **Thought（思考）**：LLM 分析当前状态，思考下一步应该做什么
2. **Action（行动）**：基于思考结果，选择并执行一个工具/操作
3. **Observation（观察）**：接收工具的执行结果作为新的上下文
4. 重复上述过程，直到 LLM 认为已有足够信息给出最终答案

```
Thought 1: 我需要查找某公司的最新财报数据
Action 1: search_web("Company X Q4 2025 earnings report")
Observation 1: Company X reported revenue of $5.2B in Q4 2025...

Thought 2: 现在我有了财报数据，需要计算同比增长率
Action 2: calculator("(5.2 - 4.8) / 4.8 * 100")
Observation 2: 8.33

Thought 3: 我现在有了足够信息来回答问题
Final Answer: Company X 的 Q4 2025 营收为 $5.2B，同比增长 8.33%。
```

#### 为什么不用纯推理（CoT）？

Chain-of-Thought (CoT) 让 LLM 逐步推理，但完全依赖模型的内部知识。问题在于：

- **幻觉（Hallucination）**：模型可能"编造"看似合理但实际错误的事实
- **知识过时**：模型的训练数据有截止日期，无法获取最新信息
- **错误传播**：一步推理出错，后续步骤全部基于错误前提

ReAct 通过在推理过程中引入工具调用（Action），让模型能够从外部环境获取真实、最新的信息，形成"事实锚点"（Ground Truth Anchor），有效缓解这些问题。

#### 为什么不用纯行动（直接工具调用）？

直接让 LLM 调用工具，跳过推理步骤，问题在于：

- **缺乏规划**：不知道"为什么"调用这个工具，调用顺序可能不合理
- **不可解释**：无法追踪决策逻辑
- **无法纠错**：没有反思机制，一旦选错工具就无法调整

ReAct 的 Thought 步骤提供了显式的推理 trace，使得决策过程透明、可调试、可审计。

#### ReAct 的 Prompt 结构

一个典型的 ReAct Prompt 模板：

```
Answer the following questions as best you can. You have access to the following tools:

{tool_descriptions}

Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Observation cycle can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question
```

#### Python 实现（简化版）

```python
import re
import anthropic

client = anthropic.Anthropic()

TOOLS = {
    "search": lambda q: web_search(q),
    "calculate": lambda expr: str(eval(expr)),  # ⚠️ 安全警告：生产环境不应使用 eval()，应使用安全的数学解析库（如 numexpr 或 asteval）
}

SYSTEM_PROMPT = """You are a helpful assistant. You can use these tools:
- search: Search the web. Input: search query string.
- calculate: Do math. Input: math expression.

Use this format:
Thought: <your reasoning>
Action: <tool_name>
Action Input: <input>

When you have the final answer:
Thought: I now know the final answer
Final Answer: <answer>
"""

def react_agent(question: str, max_steps: int = 10) -> str:
    """简化版 ReAct Agent"""
    prompt = f"Question: {question}\n"

    for step in range(max_steps):
        response = client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": prompt}]
        )
        text = response.content[0].text
        prompt += text + "\n"

        # 检查是否有最终答案
        if "Final Answer:" in text:
            return text.split("Final Answer:")[-1].strip()

        # 解析并执行 Action
        action_match = re.search(r"Action: (\w+)\nAction Input: (.+)", text)
        if action_match:
            tool, tool_input = action_match.groups()
            observation = TOOLS[tool](tool_input.strip())
            prompt += f"Observation: {observation}\n"

    return "达到最大步数限制，未能得出结论。"
```

#### ReAct 的实际效果

原始论文（Yao et al., 2022）的实验结果表明：
- 在 **HotpotQA**（多跳问答）上，ReAct 通过与 Wikipedia API 交互，显著超越纯 CoT，减少了幻觉和错误传播
- 在 **Fever**（事实验证）上，ReAct 的事实核查能力优于基线方法
- ReAct 生成的执行轨迹（Trajectory）更接近人类的问题解决方式，可解释性更强

#### 主流框架中的 ReAct

ReAct 已成为 Agent 框架的默认模式：
- **LangChain/LangGraph**：`create_react_agent()` 直接创建 ReAct Agent
- **CrewAI**：Agent 默认使用 ReAct 范式交替推理和行动
- **Anthropic Claude**：通过 Tool Use API 天然支持 ReAct 模式（模型自动在思考和工具调用间交替）

#### ReAct 优劣势总结

**优势：**
- 高度灵活，能根据中间结果动态调整策略
- 可解释性强，每步都有显式的推理 trace
- 适合探索性、不确定性高的任务

**劣势：**
- 每步都需要完整的 LLM 调用（携带全部上下文），token 消耗高
- 8 步任务可能消耗 50K-100K tokens
- 无法并行执行，所有步骤严格顺序
- 可能陷入推理循环

**适用场景：** 需要动态探索、中间结果不可预测的任务，如开放域问答、研究调查、交互式调试。

### 2. Plan-and-Execute

**核心机制：** 将任务分为两个阶段——Planner（规划器）生成完整的行动计划，Executor（执行器）逐步执行计划中的每一步。

```
阶段 1 — 规划:
  Plan:
    Step 1: 搜索 X 的最新数据
    Step 2: 从结果中提取关键指标
    Step 3: 计算同比增长率
    Step 4: 生成分析报告

阶段 2 — 执行:
  Execute Step 1 → Result 1
  Execute Step 2 → Result 2
  Execute Step 3 → Result 3
  Execute Step 4 → Final Output
```

**优势：**
- LLM 调用次数少（规划一次 + 每步执行一次，执行可用更小的模型）
- 成本显著低于 ReAct
- 强制 LLM 预先想清楚完整步骤，减少遗漏
- 每步执行可以并行化（如果步骤间无依赖）

**劣势：**
- 初始计划的质量是瓶颈——计划错了，后续全错
- 适应性差，面对意外情况难以偏离原计划
- 需要额外的 Replanning 机制来应对执行中的变化
- 不适合高度动态、不确定的任务

**适用场景：** 结构明确的多步任务，如数据处理流水线、报告生成、自动化测试。

### 3. Proactive Agent（主动式 Agent）

**核心机制：** 不同于 Reactive Agent（被动响应用户指令），Proactive Agent 会主动预测用户需求、提前执行相关操作，在用户明确要求之前就做好准备。

```
Reactive Agent:
  用户: "帮我查一下明天的天气"
  Agent: [查询] "明天是晴天"

Proactive Agent:
  用户: "我明天要去上海出差"
  Agent: [自动] "我来帮你准备出差所需信息：明天上海天气、航班信息、酒店推荐、会议安排..."
```

**核心特性：**

1. **需求预测**
   - 从对话上下文推断用户潜在需求
   - 利用用户历史行为模式
   - 结合时间、地点、角色等上下文信息

2. **主动行动**
   - 无需用户明确指令即可执行
   - 提前获取可能需要的资源
   - 预加载相关数据以减少延迟

3. **适度性判断**
   - 判断何时应该主动，何时需要确认
   - 避免过度打扰用户
   - 在效率和用户体验间取得平衡

```python
class ProactiveAgent:
    def __init__(self, llm, tools, user_profile):
        self.llm = llm
        self.tools = tools
        self.user_profile = user_profile  # 用户偏好、历史行为等

    def process(self, user_input: str, context: dict) -> str:
        # 1. 理解用户显式需求
        explicit_needs = self._parse_needs(user_input)

        # 2. 预测潜在需求
        implicit_needs = self._predict_needs(user_input, context)

        # 3. 判断哪些潜在需求值得主动处理
        proactive_actions = []
        for need in implicit_needs:
            if self._should_be_proactive(need):
                proactive_actions.append(need)

        # 4. 执行主动操作（可并行）
        proactive_results = self._execute_proactively(proactive_actions)

        # 5. 组合响应
        response = self._generate_response(
            explicit_needs,
            proactive_results,
            show_what=self._decide_visibility(proactive_actions)
        )
        return response

    def _predict_needs(self, user_input: str, context: dict) -> list[Need]:
        """基于上下文预测潜在需求"""
        prompt = f"""
        用户说：{user_input}
        当前时间：{context.get('time')}
        用户位置：{context.get('location')}
        用户角色：{self.user_profile.role}

        预测用户可能需要的额外信息（不要过度推断）：
        """
        return parse_needs(self.llm.generate(prompt))

    def _should_be_proactive(self, need: Need) -> bool:
        """判断是否值得主动处理"""
        criteria = {
            'relevance': need.confidence > 0.8,  # 高相关性
            'cost': need.execution_cost < 0.5,  # 低执行成本
            'privacy': not need.sensitive,       # 不涉及隐私
            'frequency': self.user_profile.likes_proactive,  # 用户喜欢主动服务
        }
        return all(criteria.values())
```

**优势：**
- 显著提升用户体验，减少用户操作步骤
- 更接近人类助手的自然交互方式
- 可以在后台预加载，减少感知延迟
- 适合长期陪伴式场景（如个人助理、客服）

**劣势：**
- 需求预测准确度难以保证，可能误判
- 过度主动可能打扰用户
- 消耗更多资源（执行了用户未明确要求的操作）
- 对隐私敏感的操作需要谨慎

**应用场景：**
1. **个人助理** - 检测到用户要出差时，主动准备天气、交通、酒店信息
2. **客服系统** - 用户咨询产品时，主动展示相关文档、使用教程
3. **代码助手** - 检测到用户在调试时，主动加载相关错误文档
4. **数据分析师** - 用户选择某个指标时，自动展示相关趋势和对比

**关键设计原则：**

| 原则 | 说明 |
|------|------|
| **透明化** | 让用户知道 Agent 主动做了什么，以及为什么 |
| **可撤销** | 主动操作的结果应能被用户轻松取消或忽略 |
| **渐进式** | 初期保守，随着用户信任建立逐渐增加主动性 |
| **学习性** | 根据用户反馈（接受/拒绝）调整主动策略 |

**与 Reactive Agent 的对比：**

| 维度 | Reactive Agent | Proactive Agent |
|------|---------------|-----------------|
| **触发方式** | 用户指令 | 指令 + 上下文预测 |
| **用户体验** | 明确但需要多步 | 高效但可能意外 |
| **资源消耗** | 按需消耗 | 可能有冗余消耗 |
| **实现复杂度** | 中等 | 高（需预测和适度性判断） |
| **适用场景** | 任务执行工具 | 陪伴式服务 |

**实现模式：**

```python
# 模式 1：置信度阈值
if predicted_need.confidence > 0.9:
    execute_immediately()
elif predicted_need.confidence > 0.7:
    ask_user("我检测到可能需要 X，是否处理？")
else:
    ignore()

# 模式 2：异步预加载
execute_async(predicted_needs)  # 后台执行
if user_explicitly_requests():
    return_cached_result()
```

### 4. LATS（Language Agent Tree Search）

**核心机制：** 借鉴蒙特卡洛树搜索（MCTS），将 Agent 的行动空间建模为一棵树，同时探索多条路径，评估每条路径的质量，在死胡同时回溯尝试其他分支。

```
                     根节点（初始状态）
                    /        |         \
              Action A    Action B    Action C
              /    \         |         /    \
           A1      A2      B1       C1      C2
           ✗      ✓        ✓        ✗       ✓
                   ↓        ↓                ↓
                  展开     展开             展开
                   ↓
                最优路径
```

**优势：**
- 通过并行探索多条路径，找到更高质量的解
- 具备回溯能力，不会被单一错误路径困死
- Zhou et al. (2023) 的论文表明 LATS 在多步推理任务上超越 ReAct
- 特别适合有多种可行方案需要比较的场景

**劣势：**
- 成本极高：通常是 ReAct 的 3-5 倍
- 延迟更大：需要并行生成和评估多个分支
- 实现复杂度高
- 对简单任务过度设计

**适用场景：** 复杂推理、代码生成（需要探索多种实现方案）、数学证明、需要高可靠性的关键决策。

### 综合对比

| 维度 | ReAct | Plan-and-Execute | Proactive | LATS |
|------|-------|-------------------|----------|------|
| **核心思路** | 边想边做 | 想好再做 | 主动预测需求 | 多条路同时探索 |
| **灵活性** | 高 | 低（无 replanning 时） | 高（主动适应） | 极高 |
| **成本** | 中高 | 低 | 中（含冗余预测） | 极高（3-5x ReAct） |
| **延迟** | 中 | 低 | 低（预加载） | 高 |
| **结果质量** | 良好 | 结构化任务优秀 | 优秀（用户体验佳） | 最高 |
| **可解释性** | 强（每步有 Thought） | 中（有计划但执行不透明） | 中（需说明主动行为原因） | 中（有树结构但复杂） |
| **并行能力** | 无 | 部分（独立步骤） | 强（预加载并行） | 强（多分支并行） |
| **错误恢复** | 动态调整 | 需要显式 replanning | 需用户反馈调整 | 自动回溯 |
| **实现难度** | 低 | 中 | 中高（需适度性判断） | 高 |

### 混合模式：生产实践中的最佳选择

实际生产中，大多数团队不会只用一种模式，而是组合使用：

```python
# 混合模式：Plan-and-Execute + ReAct
class HybridAgent:
    def run(self, task: str):
        # 阶段 1：用强模型生成粗略计划
        plan = self.planner.generate_plan(task)

        # 阶段 2：用 ReAct 方式逐步执行
        # 每步都可以根据实际情况偏离计划
        results = []
        for step in plan.steps:
            result = self.react_executor.execute_with_reasoning(
                step=step,
                context=results,
                allow_deviation=True  # 允许偏离计划
            )
            results.append(result)

            # 如果偏离过大，触发 replanning
            if result.deviated_significantly:
                plan = self.planner.replan(task, results)

        return self.synthesizer.combine(results)
```

**常见混合策略：**
1. **ReAct + Reflexion**：在 ReAct 失败后加入反思，从失败中学习
2. **Plan-and-Execute + ReAct**：先计划，再用 ReAct 执行每一步，允许动态调整
3. **LATS + Plan-and-Execute**：用 LATS 探索多种计划方案，选最优计划后执行
4. **分层混合**：高层用 Plan-and-Execute 做战略规划，低层用 ReAct 做战术执行

### 选择决策树

```
任务是否结构明确？
├── 是 → 步骤间是否有依赖关系？
│        ├── 大量依赖 → Plan-and-Execute
│        └── 独立步骤 → Plan-and-Execute（并行执行）
└── 否 → 是否需要高可靠性？
         ├── 是 → 预算允许高成本？
         │        ├── 是 → LATS
         │        └── 否 → ReAct + Reflexion
         └── 否 → ReAct
```

## 常见误区 / 面试追问

1. **误区："ReAct 就是 Function Calling"** — Function Calling 是底层能力（让 LLM 生成结构化的工具调用请求），ReAct 是上层模式（在推理和行动之间交替的决策框架）。ReAct 可以基于 Function Calling 实现，但两者不是一回事。

2. **误区："ReAct 是最先进的，应该总是使用"** — ReAct 适合探索性任务，但对结构明确的任务来说，Plan-and-Execute 更高效、更便宜。没有通用最优架构。

3. **误区："Plan-and-Execute 无法处理变化"** — 加入 Replanning 机制后，Plan-and-Execute 也能应对执行中的意外。关键是设计好触发 replan 的条件。

4. **追问："ReAct 的主要缺陷是什么？"** — (1) 高 token 消耗和延迟；(2) 可能陷入推理循环（反复调用同一工具）；(3) 无法并行执行多个独立操作，因为每步都是顺序的。

5. **追问："如何改进 ReAct？"** — (1) 加入 Reflexion 机制让 Agent 从失败中学习；(2) 混合 Plan-and-Execute，先生成粗略计划再 ReAct 执行；(3) 设置最大步数和重复检测来防止死循环。

6. **追问："如何在成本和质量间取舍？"** — 从 ReAct 开始建立 baseline，如果质量不够再考虑 LATS。用 Model Routing 对简单任务用 ReAct + 小模型，复杂任务用 LATS + 强模型。

7. **追问："Proactive Agent 的核心挑战是什么？"** — 适度性判断：太主动会打扰用户，太保守又失去意义。需要建立反馈循环，学习用户的接受度阈值。

8. **追问："Gartner 预测 40% 的企业应用将包含 Agent，主流模式是什么？"** — 混合模式（Planning Preamble + ReAct Execution），因为它在灵活性和成本间取得了最佳平衡。

## 参考资料

- [ReAct: Synergizing Reasoning and Acting in Language Models (arXiv:2210.03629)](https://arxiv.org/abs/2210.03629)
- [ReAct Prompting (Prompt Engineering Guide)](https://www.promptingguide.ai/techniques/react)
- [What is a ReAct Agent? (IBM)](https://www.ibm.com/think/topics/react-agent)
- [A Simple Python Implementation of the ReAct Pattern (Simon Willison)](https://til.simonwillison.net/llms/python-react-pattern)
- [ReAct Pattern: Interleaving Reasoning and Action (Michael Brenndoerfer)](https://mbrenndoerfer.com/writing/react-pattern-llm-reasoning-action-agents)
- [ReAct vs Plan-and-Execute: A Practical Comparison (DEV Community)](https://dev.to/jamesli/react-vs-plan-and-execute-a-practical-comparison-of-llm-agent-patterns-4gh9)
- [Navigating Modern LLM Agent Architectures (Wollen Labs)](https://www.wollenlabs.com/blog-posts/navigating-modern-llm-agent-architectures-multi-agents-plan-and-execute-rewoo-tree-of-thoughts-and-react)
- [Agent Architectures: ReAct, Self-Ask, Plan-and-Execute (APXML)](https://apxml.com/courses/langchain-production-llm/chapter-2-sophisticated-agents-tools/agent-architectures)
- [How to Build a Plan-and-Execute AI Agent (EMA)](https://www.ema.ai/additional-blogs/addition-blogs/build-plan-execute-agents)
- [LATS: Language Agent Tree Search (Zhou et al., 2023)](https://arxiv.org/abs/2310.04406)
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="005-layered-agent-architecture">

<h2 class="question-title"><span class="q-badge ai100-badge">Q4</span><span class="question-text">如何设计一个分层 Agent 架构（Orchestrator / Worker 模式）？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：Agent, AI100 · 考察点：Agent 架构</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：分层 Agent 架构（Orchestrator-Worker 模式）是一种将复杂任务分解为"指挥"和"执行"两个层次的设计模式。Orchestrator（编排器）负责理解目标、分解任务、分配工作、综合结果；Worker（工作者）是专业化的子 Agent，各自擅长特定领域的任务执行。这种架构的核心优势是可扩展性和专业化分工，适合问题结构在运行时动态涌现的复杂场景。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误区："越多层越好" · 误区："Orchestrator 必须是 LLM" · 追问："Orchestrator-Worker 和微服务架构有什么关系？"</div>
</div>

## 详细解析

### 什么是 Orchestrator-Worker 模式？

Orchestrator-Worker 是一种集中式任务管理架构：一个智能控制器（Orchestrator）保持对整体系统的全局视野，负责将复杂问题分解为可管理的子任务，分发给专业化的 Worker Agent 执行，再将各 Worker 的局部结果综合为完整的解决方案。

与固定的 Prompt Chaining 或工具路由不同，Orchestrator-Worker 的假设是：**子任务的数量和类型取决于输入的特性，而非预定义的流程。**

### 核心架构

```
                    ┌──────────────────┐
                    │   Orchestrator   │
                    │  (强模型 / 规划)  │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │ Worker A │  │ Worker B │  │ Worker C │
        │ (搜索)   │  │ (分析)   │  │ (写作)   │
        └──────────┘  └──────────┘  └──────────┘
```

### Orchestrator 的职责

1. **任务理解**：解析用户的高层目标
2. **任务分解**：将目标拆解为具体的子任务
3. **任务分配**：根据 Worker 的能力选择最合适的 Worker
4. **进度追踪**：监控各 Worker 的执行状态
5. **结果综合**：将各 Worker 的结果整合为最终输出
6. **动态调整**：根据中间结果决定下一步——是继续分解、重新分配、还是结束

```python
class Orchestrator:
    def __init__(self, workers: dict[str, Worker], llm):
        self.workers = workers  # {"search": SearchWorker, "analyze": AnalyzeWorker, ...}
        self.llm = llm

    def run(self, task: str) -> str:
        # 1. 分解任务
        subtasks = self._decompose(task)
        results = {}

        while subtasks:
            # 2. 分配可并行执行的任务
            batch = self._get_parallel_batch(subtasks)

            # 3. 并行执行
            for subtask in batch:
                worker = self._select_worker(subtask)
                results[subtask.id] = worker.execute(subtask)

            # 4. 根据结果动态决定下一步
            subtasks = self._replan_if_needed(task, results)

        # 5. 综合结果
        return self._synthesize(task, results)

    def _decompose(self, task: str) -> list[SubTask]:
        """用 LLM 将高层任务分解为子任务"""
        response = self.llm.generate(
            f"将以下任务分解为具体的子任务，说明每个子任务需要的专业能力：\n{task}"
        )
        return parse_subtasks(response)

    def _select_worker(self, subtask: SubTask) -> Worker:
        """根据子任务类型选择合适的 Worker"""
        return self.workers[subtask.required_skill]
```

### Worker 的设计原则

每个 Worker 是一个专业化的 Agent，具备特定领域的能力：

```python
class SearchWorker(Worker):
    """专门负责信息检索的 Worker"""
    def __init__(self):
        self.tools = [web_search, database_query, document_retrieval]
        self.system_prompt = "你是信息检索专家，负责查找和整理相关信息。"

    def execute(self, subtask: SubTask) -> WorkerResult:
        # Worker 内部可以使用 ReAct 模式自主完成子任务
        agent = ReactAgent(
            llm=self.llm,  # 可以用更小、更便宜的模型
            tools=self.tools,
            system_prompt=self.system_prompt
        )
        return agent.run(subtask.description)

class AnalyzeWorker(Worker):
    """专门负责数据分析的 Worker"""
    def __init__(self):
        self.tools = [calculator, chart_generator, statistics_engine]
        self.system_prompt = "你是数据分析专家，负责处理和分析数据。"
```

### 层次化架构（Hierarchical）

对于超复杂任务，可以将 Orchestrator-Worker 模式递归应用，形成多层架构：

```
                      顶层 Orchestrator
                     /        |         \
              中层 Orch A  中层 Orch B  中层 Orch C
              /    \         |         /    \
         Worker  Worker   Worker  Worker  Worker
```

每个中层节点既是上层的 Worker，又是下层的 Orchestrator。这种递归结构适合企业级多团队协作场景。

```python
class HierarchicalOrchestrator(Orchestrator):
    """递归的层次化编排器"""
    def _select_worker(self, subtask: SubTask) -> Worker:
        if subtask.complexity > THRESHOLD:
            # 复杂子任务交给子 Orchestrator 进一步分解
            return SubOrchestrator(workers=self._get_sub_workers(subtask))
        else:
            # 简单子任务直接交给 Worker 执行
            return self.workers[subtask.required_skill]
```

### Orchestrator-Worker vs 其他多 Agent 模式

| 模式 | 特点 | 适用场景 |
|------|------|---------|
| **Orchestrator-Worker** | 集中控制，动态分解 | 问题结构在运行时涌现 |
| **Pipeline** | 固定顺序，前一步输出是后一步输入 | 结构确定的顺序处理 |
| **Peer-to-Peer** | Agent 间平等通信，无中心 | 协商、辩论、头脑风暴 |
| **Blackboard** | 共享状态空间，Agent 自主读写 | 知识密集型协作 |

### 设计中的关键考量

**1. Orchestrator 的模型选择**
- Orchestrator 需要强大的规划和推理能力，通常使用前沿模型（如 Claude Opus、GPT-4o）
- Worker 可以使用更小、更便宜的模型（如 Claude Haiku、GPT-4o-mini），因为它们只需在特定领域表现好

**2. 任务分配策略**
```python
# 静态路由：基于规则
if subtask.type == "search":
    return search_worker
elif subtask.type == "code":
    return code_worker

# 动态路由：让 LLM 选择
worker_selection = llm.generate(
    f"Given subtask '{subtask}' and available workers {worker_descriptions}, "
    f"which worker is most suitable?"
)
```

**3. 错误处理与容错**
- Worker 失败时，Orchestrator 应能检测并重新分配任务
- 设置 Worker 的超时和最大重试次数
- 某个 Worker 持续失败时，考虑降级或换用替代方案

**4. 状态管理**
- Orchestrator 维护全局状态（所有子任务的进度和结果）
- Worker 维护局部状态（自己的执行上下文）
- 考虑使用事件驱动架构使系统异步化，提高容错性

### 实际案例

**案例：自动化市场研究报告**

```
用户目标："分析 2026 年 AI Agent 市场，写一份报告"

Orchestrator 分解：
├── SubTask 1 → SearchWorker: 搜索市场规模数据
├── SubTask 2 → SearchWorker: 搜索主要玩家和竞争格局
├── SubTask 3 → AnalyzeWorker: 分析市场增长趋势
├── SubTask 4 → AnalyzeWorker: SWOT 分析
└── SubTask 5 → WriterWorker: 综合所有数据生成报告

执行流程：
1. SubTask 1 和 2 并行执行（都是搜索任务，互不依赖）
2. SubTask 3 和 4 依赖 1/2 的结果，在 1/2 完成后并行执行
3. SubTask 5 依赖所有前置任务，最后执行
```

## 常见误区 / 面试追问

1. **误区："越多层越好"** — 每增加一层都引入协调开销、延迟和成本。应使用满足需求的最简架构。如果单个 ReAct Agent 能完成任务，不要引入 Orchestrator-Worker。

2. **误区："Orchestrator 必须是 LLM"** — 对于结构确定的任务，Orchestrator 可以是确定性代码（if-else 路由、DAG 引擎），不必每次都调用 LLM。只有当任务分解需要理解自然语言语义时，才需要 LLM 做 Orchestrator。

3. **追问："Orchestrator-Worker 和微服务架构有什么关系？"** — 概念类似：Orchestrator 像 API Gateway + 业务编排层，Worker 像独立微服务。可以借鉴微服务的设计原则：单一职责、松耦合、独立部署、容错机制。

4. **追问："如何避免 Orchestrator 成为单点故障？"** — (1) Orchestrator 本身做无状态设计，状态存外部存储；(2) 设置 Orchestrator 超时，支持任务恢复；(3) 对关键任务可以引入多个 Orchestrator 做冗余。

## 参考资料

- [AI Agent Orchestration Patterns (Microsoft Azure)](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns)
- [Choose a Design Pattern for Your Agentic AI System (Google Cloud)](https://docs.cloud.google.com/architecture/choose-design-pattern-agentic-ai-system)
- [Supervisor-Worker Pattern (Agentic Design)](https://agentic-design.ai/patterns/multi-agent/supervisor-worker-pattern)
- [Four Design Patterns for Event-Driven Multi-Agent Systems (Confluent)](https://www.confluent.io/blog/event-driven-multi-agent-systems/)
- [Orchestrator-Worker Agents: A Practical Comparison (Arize AI)](https://arize.com/blog/orchestrator-worker-agents-a-practical-comparison-of-common-agent-frameworks/)
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="006-agent-loop-and-error-recovery">

<h2 class="question-title"><span class="q-badge ai100-badge">Q5</span><span class="question-text">Agent Loop 设计：循环控制、终止条件与错误恢复</span></h2>

循环终止设计的核心原则是**外部强制（External Enforcement）**：由系统而非 Agent 自身保证终止。常用策略包括最大迭代次数限制、语义完成检测、重复输出检测、资源预算监控，以及达到上限后的优雅降级。

容错设计采用四层防御模型：带指数退避的重试机制（应对瞬态错误）→ 模型降级链（应对服务商故障）→ 错误分类路由（匹配正确的处理策略）→ 检查点恢复（应对崩溃）。正常终止与异常恢复共同构成生产级 Agent 的完整闭环。



<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：Agent, AI100 · 考察点：Agent 架构</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Agent Loop 是 Agent 与普通 LLM 调用的核心区别——Agent 通过"推理→行动→观察"的循环迭代完成任务。完整的 Agent Loop 设计包含两大关键维度：**正常流程的循环终止控制**和**异常情况的错误恢复机制**。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误区："设大一点的 max_iterations 就行" · 误区："让 LLM 自己决定什么时候停" · 追问："如何设定合理的 max_iterations？"</div>
</div>

## 详细解析

### 一、Agent Loop 的本质

Agent 的定义特征就是循环（Loop）。它使用 LLM 推理、执行工具、观察结果，然后重复，直到目标达成。这与单次 LLM 调用有本质区别：

```python
# 单次 LLM 调用
response = llm.generate(prompt)

# Agent Loop
while not done:
    thought = llm.reason(state)        # 推理
    action_result = execute(thought)    # 行动
    state = observe(action_result)      # 观察
    done = check_termination(state)     # 终止检查
```

### 二、为什么需要终止控制？

与传统代码中显而易见的死循环不同，Agent 的循环陷阱更加微妙：
- LLM 的概率性本质可能导致它**误解终止信号**
- 模糊的目标（如"研究 X"）没有明确的完成定义，会引发"无限好奇心"
- 工具调用失败后反复重试同一操作
- 工具过多或描述模糊导致选择混乱

### 三、五种终止策略

#### 1. 最大迭代次数（最基础也最关键）

```python
class AgentLoop:
    def __init__(self, max_iterations: int = 15):
        self.max_iterations = max_iterations

    def run(self, task: str) -> str:
        for i in range(self.max_iterations):
            result = self.step(task)
            if result.is_final:
                return result.answer
        # 达到上限：优雅降级
        return self.graceful_degradation()
```

不同框架的默认值：LangChain `AgentExecutor` 默认 15 次，Google ADK `LoopAgent` 可自定义上限。

#### 2. 语义完成检测

让 Agent 输出明确的终止标记：

```
"当你确信已回答问题时，以 'FINAL_ANSWER: ...' 结尾"
```

或通过结构化输出：
```python
class AgentResponse(BaseModel):
    thought: str
    action: Optional[ToolCall]
    final_answer: Optional[str]  # 非 None 时表示完成
```

#### 3. 重复输出检测

```python
def detect_loop(history: list[str], window: int = 3) -> bool:
    """检测 Agent 是否在重复相同的操作"""
    recent = history[-window:]
    return len(set(recent)) < len(recent)  # 有重复则判定为循环
```

#### 4. 资源预算监控

```python
class ResourceBudget:
    def __init__(self, max_tokens: int = 100_000, max_cost: float = 1.0):
        self.max_tokens = max_tokens
        self.max_cost = max_cost
        self.used_tokens = 0
        self.used_cost = 0.0

    def check(self) -> bool:
        return self.used_tokens < self.max_tokens and self.used_cost < self.max_cost
```

#### 5. 子 Agent 信号终止

在多 Agent 系统中，子 Agent 可以通过事件、标志或特定返回值向 Orchestrator 发出终止信号。

### 四、不同架构的终止机制对比

| 架构 | 终止方式 | 特点 |
|------|---------|------|
| **ReAct** | LLM 在 response 中生成终止 token（如 "Final Answer:"） | 默认继续，主动终止 |
| **MemGPT** | `request_heartbeat` 默认为 False | 默认终止，主动继续 |
| **Plan-and-Execute** | 计划中的所有步骤执行完毕 | 确定性终止 |
| **现代 Agent** | 多步工具调用 + 自导向终止条件 | 混合策略 |

"默认终止 vs 默认继续"是一个关键的设计决策。MemGPT 的设计哲学是默认终止更安全——Agent 必须显式请求继续执行，而非依赖 LLM 判断何时停止。

### 五、达到上限后的优雅降级

当 Agent 达到迭代上限时，不应简单地崩溃或返回空结果：

```python
def graceful_degradation(self):
    """优雅降级：总结已有进度，而非直接失败"""
    return self.llm.generate(
        f"你已达到最大步数限制。基于以下已完成的工作，"
        f"给出你目前能提供的最佳答案：\n{self.state.summary()}"
    )
```

关键策略：
- **进度总结**：汇报已完成和未完成的部分
- **状态检查点**：保存当前状态以便后续恢复
- **模型降级**：切换到更便宜的模型完成剩余工作
- **人工升级**：通知人类介入处理

### 六、根因分析：为什么反复达到上限？

迭代上限是**症状检测器，不是疾病本身**。如果 Agent 反复触及上限，真正的问题通常是：

1. **目标模糊**：缺少明确的完成标准
2. **工具签名不清**：工具描述有歧义，LLM 不知道选哪个
3. **停止条件弱**：没有教会 LLM 识别"已完成"
4. **Prompt 设计差**：没有在 System Prompt 中定义终止规则

### 七、Agent 错误的特殊性

Agent 的错误比传统应用更难处理，因为：
- **级联放大**：一次工具调用失败会影响后续所有决策
- **语义错误**：LLM 生成的代码可能通过编译但执行错误操作（如删除而非更新）
- **状态失同步**：Agent 对环境的内部认知与实际状态不一致
- **概率性**：同样的输入可能产生不同的错误

### 八、四层容错模型

#### 第一层：重试 + 指数退避 + 抖动

处理最常见的瞬态错误（网络超时、API 限流）：

```python
import random
import time

class RetryWithBackoff:
    def __init__(self, max_retries=3, base_delay=1.0, max_delay=60.0):
        self.max_retries = max_retries
        self.base_delay = base_delay
        self.max_delay = max_delay

    def execute(self, func, *args):
        for attempt in range(self.max_retries):
            try:
                return func(*args)
            except TransientError as e:
                if attempt == self.max_retries - 1:
                    raise
                delay = min(
                    self.base_delay * (2 ** attempt) + random.uniform(0, 1),
                    self.max_delay
                )
                time.sleep(delay)
```

**关键设计决策**：重试中间件应放在降级中间件**之前**。先重试主模型几次，再降级到备用模型，避免主模型短暂不可用就过早降级。

#### 第二层：模型降级链

当主模型持续不可用时，切换到备用模型：

```python
class ModelFallbackChain:
    def __init__(self):
        self.chain = [
            {"provider": "anthropic", "model": "claude-sonnet-4-5-20250929"},
            {"provider": "anthropic", "model": "claude-haiku-4-5-20251001"},
            {"provider": "openai", "model": "gpt-4o-mini"},  # 跨供应商降级
        ]

    def call(self, prompt: str) -> str:
        for model_config in self.chain:
            try:
                return self._call_model(model_config, prompt)
            except (RateLimitError, ServiceUnavailableError):
                continue
        raise AllModelsFailedError("所有模型均不可用")
```

最佳实践：每个供应商至少定义一个备选模型，并设置跨供应商降级（如 Anthropic → OpenAI）。

#### 第三层：错误分类与路由

**不是所有错误都应该重试。** 正确分类错误是高效容错的关键：

```python
class ErrorClassifier:
    def classify(self, error: Exception) -> ErrorType:
        if isinstance(error, (TimeoutError, RateLimitError)):
            return ErrorType.TRANSIENT      # → 重试
        elif isinstance(error, ToolOutputError):
            return ErrorType.LLM_RECOVERABLE  # → 让 LLM 换个方式调用
        elif isinstance(error, AuthorizationError):
            return ErrorType.HUMAN_REQUIRED   # → 通知人类
        elif isinstance(error, InvalidToolInput):
            return ErrorType.PROMPT_FIXABLE   # → 重新格式化输入
        else:
            return ErrorType.FATAL            # → 终止并报告

class ErrorHandler:
    def handle(self, error: Exception, context: AgentState):
        error_type = self.classifier.classify(error)

        if error_type == ErrorType.TRANSIENT:
            return self.retry_with_backoff(context)
        elif error_type == ErrorType.LLM_RECOVERABLE:
            return self.ask_llm_to_reformulate(context)
        elif error_type == ErrorType.HUMAN_REQUIRED:
            return self.escalate_to_human(context)
        elif error_type == ErrorType.PROMPT_FIXABLE:
            return self.fix_and_retry(context)
        else:
            return self.abort_with_summary(context)
```

#### 第四层：检查点与状态恢复

对于长时间运行的 Agent 任务，定期保存状态：

```python
class CheckpointManager:
    def __init__(self, storage):
        self.storage = storage

    def save(self, thread_id: str, state: AgentState):
        """在每步完成后保存检查点"""
        self.storage.save({
            "thread_id": thread_id,
            "step": state.current_step,
            "completed_actions": state.history,
            "partial_results": state.results,
            "timestamp": time.time()
        })

    def restore(self, thread_id: str) -> AgentState:
        """从最近的检查点恢复"""
        checkpoint = self.storage.load(thread_id)
        return AgentState.from_checkpoint(checkpoint)
```

### 九、级联失败预防

Agent 系统中的单点故障不只影响一个功能——它会在每次工具调用、每次重试、每个 token 中放大。防止级联失败的核心原则：**假设 LLM、Agent 组件和外部数据源都可能不可用。**

**断路器模式（Circuit Breaker）**：

```python
class CircuitBreaker:
    def __init__(self, failure_threshold=5, recovery_timeout=60):
        self.failures = 0
        self.threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.state = "CLOSED"  # CLOSED → OPEN → HALF_OPEN
        self.last_failure_time = None

    def call(self, func, *args):
        if self.state == "OPEN":
            if time.time() - self.last_failure_time > self.recovery_timeout:
                self.state = "HALF_OPEN"
            else:
                raise CircuitOpenError("服务不可用，快速失败")

        try:
            result = func(*args)
            self._on_success()
            return result
        except Exception as e:
            self._on_failure()
            raise

    def _on_failure(self):
        self.failures += 1
        self.last_failure_time = time.time()
        if self.failures >= self.threshold:
            self.state = "OPEN"

    def _on_success(self):
        self.failures = 0
        self.state = "CLOSED"
```

### 十、容错机制的推荐实施顺序

1. **重试策略先行**：用最少代码处理最常见的故障
2. **模型降级其次**：定义备选模型和跨供应商回退
3. **错误分类第三**：区分瞬态错误、LLM 可恢复错误、需人工错误
4. **检查点最后**：生产环境用持久化存储，通过 thread_id 支持恢复

## 常见误区 / 面试追问

### 循环终止相关

1. **误区："设大一点的 max_iterations 就行"** — 盲目增大上限只会增加成本和延迟。应该先分析为什么达到上限，修复根因（目标不清、工具不当、Prompt 不佳）。

2. **误区："让 LLM 自己决定什么时候停"** — LLM 可能无法可靠判断任务完成。必须在系统层面设置硬性终止条件作为兜底。

3. **追问："如何设定合理的 max_iterations？"** — 根据任务类型估算：简单问答 3-5 步，多步研究 10-15 步，复杂分析 20-30 步。建议从小值开始，通过观测实际使用情况逐步调整。

4. **追问："Agent 的两个循环（Inner Loop / Outer Loop）是什么？"** — Inner Loop 是单次任务内的"思考-行动-观察"循环。Outer Loop 是跨任务的"执行-评估-改进"循环（如 Reflexion 的自我反思机制）。

### 错误恢复相关

5. **误区："所有错误都重试就行"** — 限流需要重试，但工具返回垃圾数据需要让 LLM 重新构造查询，权限错误需要人工介入。错误分类是高效容错的前提。

6. **误区："Agent 自己能处理所有错误"** — 语义错误（生成的代码逻辑错误）和状态失同步（Agent 的认知与实际不符）需要外部验证机制。不能完全依赖 Agent 自我纠错。

7. **追问："如何处理 Agent 的'幻觉式修复'？"** — Agent 可能声称修复了问题但实际没有。解决方案：(1) 工具调用结果做独立验证；(2) 关键操作后检查状态一致性；(3) Human-in-the-Loop 审核关键修复。

8. **追问："容错机制本身的成本如何控制？"** — 重试和降级会增加延迟和费用。设置总预算（token 上限 + 金额上限 + 时间上限），达到任一上限就优雅终止。

### 场景追问

9. **"你的 Agent 在调用工具时陷入无限循环，反复调用同一个工具参数略有不同但总是失败。如何修复？"** — 这是最危险的 Agent 故障模式。修复路径：(1) 立即设置 `max_tool_retries` 限制单工具重试次数；(2) 工具返回明确错误信息，说明为什么失败（而非模糊的"失败"）；(3) 错误分类：识别这是 TRANSIENT 错误还是需要 LLM 调整策略的错误；(4) 检查工具 Schema 是否清晰，LLM 是否理解了参数约束；(5) 加入重复检测模式，当检测到连续 N 次调用同一工具时强制停止或请求人类干预。

10. **"你的多 Agent 系统中 Agent A 和 Agent B 陷入死循环，反复互相传递任务而无法进展。如何修复？"** — 这是多 Agent 系统特有的故障。修复路径：(1) 限制 Handoff 次数，超过阈值强制终止或转给 Supervisor Agent；(2) 每次传递时要求携带"进展状态"，如果状态无变化则中断；(3) 加入超时机制，单次任务总时长超过限制则终止；(4) 在 Handoff 点记录完整 Trace，复现时检查是哪个 Agent 的决策导致死循环；(5) 设计"逃生路由"：遇到异常情况转给兜底 Agent 或直接返回用户友好错误。

11. **"你的 Agent 在生产环境突然开始频繁产生幻觉，输出中包含不存在的引用和数据。如何快速定位和修复？"** — 这是 prompt 漂移或模型更新的典型症状。修复路径：(1) 立即检查是否有模型/ prompt 版本最近更新 → 如有，紧急回滚；(2) 对比最近 24 小时和正常时期的 Trace，找出变化的模式（如新增了某类查询导致 prompt 触发不同分支）；(3) 检查检索系统的输出质量，可能是检索失效导致 Agent 只能依赖自身知识；(4) 加入幻觉检测护栏，对引用来源进行验证；(5) 启用人工审核通道，高风险输出转人工确认。

12. **"你的 RAG 系统检索结果与用户查询完全无关，检索指标显示 Recall 接近 0。如何修复？"** — 这是检索系统失效的典型场景。修复路径：(1) 检查 embedding 模型是否匹配语料语言（如用英文模型检索中文文档）→ 重新选择/训练适配的 embedding 模型；(2) 检查分块策略是否破坏了语义完整性（如按固定字符切分导致上下文丢失）→ 调整为语义分块或重叠分块；(3) 检查向量数据库索引是否损坏 → 重建索引；(4) 检查查询是否包含领域术语未在语料中出现 → 加入查询扩展或同义词映射；(5) 加入混合检索（BM25 + 向量）兜底。

## 参考资料

- [The Two Agentic Loops: How to Design and Scale Agentic Apps (Plano)](https://planoai.dev/blog/the-two-agentic-loops-how-to-design-and-scale-agentic-apps)
- [Agent Loop Definition: How AI Agents Use Iterative Processes (Glean)](https://www.glean.com/ai-glossary/agent-loop)
- [Cap the Max Number of Iterations (LangChain)](https://python.langchain.com/v0.1/docs/modules/agents/how_to/max_iterations/)
- [Rearchitecting Letta's Agent Loop: Lessons from ReAct, MemGPT, & Claude Code (Letta)](https://www.letta.com/blog/letta-v1-agent)
- [Loop Agents (Google ADK)](https://google.github.io/adk-docs/agents/workflow-agents/loop-agents/)
- [4 Fault Tolerance Patterns Every AI Agent Needs in Production (DEV Community)](https://dev.to/klement_gunndu/4-fault-tolerance-patterns-every-ai-agent-needs-in-production-jih)
- [Error Recovery and Fallback Strategies in AI Agent Development (GoCodeo)](https://www.gocodeo.com/post/error-recovery-and-fallback-strategies-in-ai-agent-development)
- [Preventing Cascading Failures in AI Agents (Will Velida)](https://www.willvelida.com/posts/preventing-cascading-failures-ai-agents)
- [Mastering Retry Logic Agents: 2025 Best Practices (SparkCo)](https://sparkco.ai/blog/mastering-retry-logic-agents-a-deep-dive-into-2025-best-practices)
- [Error Handling in Distributed Systems (Temporal)](https://temporal.io/blog/error-handling-in-distributed-systems)
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="007-workflow-vs-agent">

<h2 class="question-title"><span class="q-badge ai100-badge">Q6</span><span class="question-text">Workflow vs Agent：什么时候用确定性工作流，什么时候用自主 Agent？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：Agent, AI100 · 考察点：Agent 架构</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：确定性工作流和自主 Agent 不是二选一，而是一个连续光谱。工作流适合结构明确、需要可预测性和合规性的场景；Agent 适合开放性、需要动态判断的场景。实际生产中，最常见的模式是混合架构——用确定性工作流保证核心流程的可靠性，在需要灵活判断的环节嵌入 Agent。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误区："Agent 比 Workflow 更先进，应该总用 Agent" · 误区："用了 LLM 就是 Agent" · 追问："如何让 Agent 在混合架构中保持可控？"</div>
</div>

## 详细解析

### 核心区别

| 维度 | 确定性工作流（Workflow） | 自主 Agent |
|------|------------------------|-----------|
| **控制方式** | 预定义代码路径 | LLM 自主决策 |
| **执行路径** | 固定、可预测 | 动态、运行时涌现 |
| **适应性** | 低（按规则执行） | 高（根据反馈调整） |
| **可审计性** | 高（每步可追踪） | 中（决策过程不透明） |
| **成本** | 低（可控） | 高（不确定的 LLM 调用次数） |
| **风险** | 低（行为可预测） | 高（可能做出意外决策） |
| **调试** | 简单 | 困难 |

### 什么时候用确定性工作流

适合工作流的场景特征：

1. **流程固定且已知**：每次执行的步骤相同，只是输入数据不同
2. **需要合规审计**：如果流程必须能逐步解释（如金融、医疗），不适合 Agent
3. **高可靠性要求**：不容许意外行为的关键路径
4. **简单任务**：表单处理、数据 ETL、基础提取——Agent 是过度设计

```python
# 确定性工作流示例：文档处理流水线
def document_pipeline(doc: Document) -> Report:
    text = extract_text(doc)           # 步骤 1：提取文本
    entities = extract_entities(text)   # 步骤 2：实体识别
    summary = summarize(text)           # 步骤 3：生成摘要
    report = format_report(entities, summary)  # 步骤 4：格式化输出
    return report
    # 每次执行路径完全相同，可预测、可审计
```

### 什么时候用自主 Agent

适合 Agent 的场景特征：

1. **问题结构不确定**：子任务的数量和类型取决于输入，无法预定义
2. **需要动态判断**：基于中间结果做决策，路径不可预知
3. **开放域探索**：如研究调查、自主诊断、个性化推荐
4. **多步推理**：需要跨多个工具、数据源进行综合推理

```python
# 自主 Agent 示例：客户问题诊断
# 不知道要查几个系统、问几个问题，完全取决于具体情况
agent = DiagnosticAgent(tools=[
    check_order_status,
    query_payment_system,
    search_knowledge_base,
    escalate_to_human,
])
result = agent.run("客户说付款了但订单状态没更新")
# Agent 自主决定：先查订单 → 再查支付 → 发现不一致 → 触发修复
```

### 光谱模型：从确定性到自主性

deepset 提出的光谱模型清晰地展示了这个连续体：

```
完全确定性 ←──────────────────────────→ 完全自主
   │                                       │
   │  1. 固定流水线                         │
   │  2. 条件分支（if-else 路由）           │
   │  3. LLM 辅助路由                      │
   │  4. 工具增强的 LLM                    │
   │  5. ReAct Agent                       │
   │  6. 自主多 Agent 系统                  │
   │                                       │
低风险/低成本                     高灵活性/高成本
```

大多数生产系统处于光谱的中间位置（Level 3-4）。

### 混合架构：最佳实践

实际生产中最常见的模式是混合架构：

```python
# 混合架构：确定性工作流 + Agent 嵌入
class HybridPipeline:
    def process_customer_request(self, request):
        # 步骤 1：确定性——验证身份（规则驱动）
        user = self.auth_service.verify(request.token)

        # 步骤 2：Agent——理解意图（需要 LLM 判断）
        intent = self.intent_agent.classify(request.message)

        # 步骤 3：确定性——路由到对应处理器
        if intent == "refund":
            handler = self.refund_workflow  # 固定流程
        elif intent == "technical_issue":
            handler = self.diagnostic_agent  # 需要 Agent 灵活处理
        else:
            handler = self.general_agent

        # 步骤 4：执行
        result = handler.run(request)

        # 步骤 5：确定性——日志和审计（固定流程）
        self.audit_log.record(request, result)
        return result
```

**核心原则**：确定性步骤处理可靠性关键的工作（验证、审计、合规），Agent 驱动的步骤处理需要判断、例外和个性化的工作。

### 决策框架

回答以下问题来选择方案：

```
1. 任务是否复杂到需要自适应决策？
   否 → 确定性工作流
   是 → 继续 ↓

2. 简单的 RAG 或工具调用能否解决？
   是 → 不需要 Agent，用工具增强的 LLM
   否 → 继续 ↓

3. 流程是否涉及不确定性和多步推理？
   是 → Agent
   否 → 确定性工作流 + LLM 辅助

4. 给 Agent 自主权的风险是否可接受？
   是 → 自主 Agent
   否 → 混合架构（Agent + Human-in-the-Loop）
```

### 关键洞察

> "区别不在于使用了多少 AI，而在于流程的治理方式和执行期间由谁做决策。"

工作流由开发者预先决定执行路径，Agent 在运行时自主决定。这个区别决定了可预测性、可审计性和风险水平。

## 常见误区 / 面试追问

1. **误区："Agent 比 Workflow 更先进，应该总用 Agent"** — Agent 引入了不可预测性、高成本和调试困难。简单任务用 Agent 是过度设计，反而降低了可靠性。

2. **误区："用了 LLM 就是 Agent"** — 在固定流水线中嵌入 LLM 调用（如用 LLM 做文本分类）仍然是工作流，不是 Agent。Agent 的标志是 LLM 自主决定执行路径。

3. **追问："如何让 Agent 在混合架构中保持可控？"** — (1) 限制 Agent 的工具权限；(2) 设置 Human-in-the-Loop 审批关键操作；(3) 用 Guardrails 约束输出；(4) 设置最大步数和成本上限。

4. **追问："Anthropic 和 Google 对这个问题的观点是什么？"** — 两家都建议从最简架构开始。Anthropic 建议"从 Prompt 开始，只在必要时才升级到 Agent"。Google Cloud 的架构指南提供了从简单到复杂的渐进式设计模式选择。

## 参考资料

- [AI Agents and Deterministic Workflows: A Spectrum, Not a Binary Choice (deepset)](https://www.deepset.ai/blog/ai-agents-and-deterministic-workflows-a-spectrum)
- [Agentic Workflows vs AI Agents (Couchbase)](https://www.couchbase.com/blog/agentic-workflows-vs-ai-agents/)
- [Agentic AI Explained: Workflows vs Agents (Orkes)](https://orkes.io/blog/agentic-ai-explained-agents-vs-workflows/)
- [Deterministic Workflows vs Autonomous Agents vs Hybrid Models (Medium)](https://medium.com/@jmfloreszazo/deterministic-workflows-vs-autonomous-agents-vs-hybrid-models-when-to-use-each-approach-in-ai-c7327bea43a1)
- [What Are Agentic Workflows? (IBM)](https://www.ibm.com/think/topics/agentic-workflows)
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="009-self-reflection-correction">

<h2 class="question-title"><span class="q-badge ai100-badge">Q7</span><span class="question-text">如何实现 Agent 的自我反思（Self-Reflection）和自我纠正？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐⭐ · 标签：Agent, AI100 · 考察点：Agent 架构</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Agent 自我反思的核心框架是 Reflexion（Shinn et al., 2023），它将环境反馈转化为语言化的自我反思，存入长期记忆，供下一轮迭代参考——本质上是一种"语言化的强化学习"。除 Reflexion 外，还有 Self-Refine（迭代自我改进）、Self-Debug（自动调试代码）、Self-RAG（自我评估检索质量）等变体。关键争议在于：LLM 能否在没有外部反馈的情况下真正自我纠正推理？</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误区："让 LLM 反思就能提升效果" · 误区："反思越多轮越好" · 追问："Reflexion 的记忆如何管理？"</div>
</div>

## 详细解析

### 为什么需要自我反思？

传统 Agent 执行失败后通常只是简单重试，不会从失败中学习。自我反思赋予 Agent "元认知"能力——它不仅执行任务，还能回顾自己的表现、识别错误原因、生成改进建议，并在后续尝试中应用这些经验。

类比人类学习：
- **无反思**：做错题 → 重做一遍 → 可能还是错
- **有反思**：做错题 → 分析为什么错 → 总结规律 → 下次避免同类错误

### Reflexion 框架详解

Reflexion 是最有影响力的 Agent 自我反思框架，核心思想是用**语言反馈代替梯度更新**。

#### 三个核心组件

```
┌─────────────┐
│    Actor     │ ←── 执行任务，生成行动轨迹（Trajectory）
└──────┬──────┘
       │ 轨迹 + 结果
       ▼
┌─────────────┐
│  Evaluator   │ ←── 评估执行结果（成功/失败/部分成功）
└──────┬──────┘
       │ 评估信号
       ▼
┌─────────────┐
│ Self-Reflect │ ←── 基于评估生成语言化的反思
└──────┬──────┘     "我在第 3 步选错了工具，应该用 X 而非 Y"
       │ 反思文本
       ▼
┌─────────────┐
│ Long-term   │ ←── 存储反思，供下次迭代参考
│   Memory    │
└─────────────┘
```

#### 执行流程

```python
class ReflexionAgent:
    def __init__(self, actor_llm, evaluator, reflector_llm):
        self.actor = actor_llm
        self.evaluator = evaluator
        self.reflector = reflector_llm
        self.memory = []  # 长期反思记忆

    def run(self, task: str, max_trials: int = 3) -> str:
        for trial in range(max_trials):
            # 1. Actor 执行任务（带上历史反思作为上下文）
            trajectory = self.actor.execute(
                task=task,
                past_reflections=self.memory
            )

            # 2. Evaluator 评估结果
            score, feedback = self.evaluator.evaluate(task, trajectory)

            if score >= THRESHOLD:
                return trajectory.final_answer

            # 3. Self-Reflect 生成反思
            reflection = self.reflector.generate(
                f"任务: {task}\n"
                f"你的执行轨迹: {trajectory}\n"
                f"评估反馈: {feedback}\n"
                f"分析你的错误原因，总结改进策略。"
            )

            # 4. 存入记忆
            self.memory.append(reflection)

        return trajectory.final_answer  # 返回最后一次尝试的结果
```

#### 实验结果

- **AlfWorld**（顺序决策任务）：ReAct + Reflexion 完成 130/134 任务，显著优于纯 ReAct
- **HumanEval / MBPP**（代码生成）：Reflexion 超越先前 SOTA
- **LeetCode Hard**：Reflexion 在困难编程题上展现出从失败中学习的能力

### 实现自我反思的多种模式

#### 模式 1：内置反思循环

在单次任务内加入反思步骤：

```python
# Agent 完成初稿后自我审查
draft = agent.generate(task)
critique = agent.reflect(
    f"审查你的输出：\n{draft}\n"
    f"列出可能的问题、遗漏或改进点。"
)
final = agent.revise(draft, critique)
```

#### 模式 2：双 Agent 反思（Andrew Ng 推荐）

用两个 Agent 实现：一个生成，一个批评：

```python
# Generator Agent + Critic Agent
generator = Agent(system_prompt="生成高质量的代码实现")
critic = Agent(system_prompt="你是严格的代码审查者，找出所有问题")

output = generator.run(task)
for round in range(max_rounds):
    criticism = critic.review(output)
    if criticism.no_issues:
        break
    output = generator.revise(output, criticism)
```

#### 模式 3：基于测试的自我纠正（Self-Debug）

特别适合代码生成场景：

```python
def self_debug_loop(task: str, max_attempts: int = 3) -> str:
    code = llm.generate_code(task)
    for attempt in range(max_attempts):
        test_result = run_tests(code)
        if test_result.all_passed:
            return code
        # 将错误信息反馈给 LLM，让它修复
        code = llm.debug(
            f"代码:\n{code}\n"
            f"测试失败:\n{test_result.errors}\n"
            f"修复这些问题。"
        )
    return code
```

### 关键争议：LLM 能真正自我纠正吗？

Huang et al. (2023) 的研究《Large Language Models Cannot Self-Correct Reasoning Yet》指出：

- **没有外部反馈时**，LLM 的"自我纠正"可能反而把正确答案改错
- **有外部反馈时**（如测试结果、搜索结果），自我纠正才真正有效
- 关键区别："intrinsic self-correction"（纯内省）vs "extrinsic self-correction"（基于外部信号）

**实践建议**：不要依赖 LLM 凭空反思。确保反思环节有外部信号输入——测试结果、评估分数、工具返回值、人工反馈。

### Self-Reflection vs Self-Correction 的区别

| 概念 | 定义 | 实现 |
|------|------|------|
| **Self-Reflection** | Agent 回顾执行过程，生成语言化的经验总结 | Reflexion 框架 |
| **Self-Correction** | Agent 检测并修复输出中的错误 | Self-Debug、Self-Refine |
| **Self-Evaluation** | Agent 评估自己输出的质量 | Self-RAG、LLM-as-Judge |

三者互补：先 Self-Evaluation（发现问题）→ Self-Reflection（分析原因）→ Self-Correction（修复问题）。

## 常见误区 / 面试追问

1. **误区："让 LLM 反思就能提升效果"** — 无外部信号的纯内省可能适得其反。Reflexion 的效果来源于环境反馈（Evaluator），不是 LLM 凭空反思。

2. **误区："反思越多轮越好"** — 过多反思轮次增加成本且可能引入过度修正。通常 2-3 轮反思就够，设置反思轮次上限。

3. **追问："Reflexion 的记忆如何管理？"** — 论文使用滑动窗口保留最近的反思。生产中可用向量数据库存储，按相关性检索历史反思。

4. **追问："如何区分'值得反思的失败'和'不可恢复的失败'？"** — 工具不存在、权限不足等结构性问题不需要反思，直接报错。逻辑错误、策略选择错误才适合反思。结合错误分类（详见第 006 题《Agent Loop 设计与错误恢复》中的错误分类与路由章节）来决定。

5. **场景追问："你的 Agent 在反思后反而把正确答案改错了，用户反馈'你之前是对的，为什么要改'。如何防止？"** — 这是"过度反思"问题。解决路径：(1) 加入置信度阈值，当 Agent 对初始答案很有信心时跳过反思；(2) 反思后对比新旧答案，如果差异过大需要理由说明；(3) 实施"反思审查"——用另一个 LLM 评估反思是否合理；(4) 限制反思轮次，通常 1-2 轮足够；(5) 在用户反馈"改错了"时记录为负面样本，训练模型识别何时不应反思。

6. **场景追问："你的代码生成 Agent 反复修复代码但每次都有新 bug，测试通过率始终低于 30%。如何优化？"** — 这是"修复引入新错误"问题。优化路径：(1) 实施测试驱动的修复流程 → Agent 必须先看测试失败原因再修改；(2) 加入局部修改原则 → 只修改与失败测试相关的代码段，避免大范围改动；(3) 使用更强的模型进行反思和修复，代码生成和验证用不同模型；(4) 实施增量验证 → 每次修复后只运行相关测试子集，快速验证；(5) 当连续修复失败时转人工介入，避免浪费时间。

7. **场景追问："你的 Agent 面对复杂问题时反思轮次过多，用户等待时间超过 30 秒。如何提升响应速度？"** — 这是"反思效率"问题。优化路径：(1) 并行化反思 → 在 Agent 执行主任务的同时，后台启动一个"反思 Agent"预判可能的问题；(2) 缓存反思结果 → 对相似的历史查询直接复用之前的反思；(3) 设置反思时间预算 → 单次反思不超过 X 秒；(4) 采用快速反思模式 → 用小模型快速扫描，只在必要时用大模型深度分析；(5) 流式输出 → 先给出初步答案，同时后台反思并在需要时更新答案。

## 参考资料

- [Reflexion: Language Agents with Verbal Reinforcement Learning (arXiv:2303.11366)](https://arxiv.org/abs/2303.11366)
- [Self-Reflection in LLM Agents: Effects on Problem-Solving Performance (arXiv:2405.06682)](https://arxiv.org/abs/2405.06682)
- [Reflexion (Prompt Engineering Guide)](https://www.promptingguide.ai/techniques/reflexion)
- [Agentic Design Patterns Part 2: Reflection (Andrew Ng / DeepLearning.AI)](https://www.deeplearning.ai/the-batch/agentic-design-patterns-part-2-reflection/)
- [How Do Agents Learn from Their Own Mistakes? (HuggingFace Blog)](https://huggingface.co/blog/Kseniase/reflection)
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="010-production-agent-system-design">

<h2 class="question-title"><span class="q-badge ai100-badge">Q8</span><span class="question-text">生产级 Agent 系统设计（含智能客服实战案例）</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐⭐ · 标签：Agent, AI100 · 考察点：Agent 架构</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：生产级 Agent 系统远不止一个 LLM + 工具的 Demo。它需要在架构层面解决五大挑战：可靠的 Agent Loop 设计、上下文工程（Context Engineering）、成本与延迟控制、全链路可观测性、以及安全护栏。核心原则是"right-size your architecture"——用满足需求的最简架构，避免过度设计。本文先阐述通用的生产级 Agent 系统设计原则和架构，然后以**日均 10 万对话的智能客服系统**为实战案例，完整演练从需求澄清到成本估算的系统设计全流程。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误区："先做 Demo 再考虑生产化" · 误区："静态 Benchmark 高分 = 生产好用" · 误区："直接用一个大模型处理所有请求就行了"</div>
</div>

## 详细解析


### 第一部分：通用生产级 Agent 系统设计原则


#### 从原型到生产的鸿沟

> "构建一个 LLM 原型极其简单，但构建一个在生产中可靠运行的 LLM 系统是完全不同的挑战——它需要严格的工程、谨慎的系统设计和运维成熟度。"

原型和生产的关键差异：

| 维度 | 原型 | 生产系统 |
|------|------|---------|
| 可靠性 | "大多数时候能用" | 99.9% 可用性 |
| 成本 | 无预算约束 | 每次调用有成本上限 |
| 延迟 | 等几秒没关系 | P95 < 目标延迟 |
| 安全 | 信任 LLM 输出 | 假设 LLM 会犯错 |
| 可观测性 | print 调试 | 全链路 Trace |
| 扩展性 | 单用户 | 高并发多用户 |

#### 生产级架构全景

```
┌───────────────────────────────────────────────────────┐
│                     API Gateway                       │
│              (认证、限流、负载均衡)                      │
├───────────────────────────────────────────────────────┤
│                   Agent Orchestrator                  │
│         (状态机 + 路由 + 循环控制 + 重规划)              │
├──────────┬──────────┬──────────┬──────────────────────┤
│ Tool     │ RAG      │ Memory   │ Safety/Policy        │
│ Gateway  │ Service  │ Service  │ Engine               │
│ (工具权限 │ (检索+   │ (短期+   │ (Guardrails +        │
│  + 执行)  │  重排序)  │  长期)   │  Human-in-the-Loop)  │
├──────────┴──────────┴──────────┴──────────────────────┤
│                  Observability Layer                   │
│          (Tracing + Logging + Metrics + Alerts)        │
└───────────────────────────────────────────────────────┘
```

#### 挑战 1：上下文工程（Context Engineering）

随着 Agent 运行时间增长，需要追踪的信息爆炸式增长——对话历史、工具输出、检索文档、中间推理。简单地把所有内容塞进上下文窗口不可持续。

Google ADK 的三个设计原则：

```python
# 原则 1：存储与展示分离
class ContextManager:
    def __init__(self):
        self.session_store = SessionStore()    # 持久化状态
        self.working_context = WorkingContext() # 每次调用的视图

    def build_context(self, session_id: str, current_task: str) -> str:
        """从持久化状态构建当前调用的上下文"""
        session = self.session_store.get(session_id)

        return self.working_context.compile(
            system_prompt=session.system_prompt,
            relevant_memory=session.memory.search(current_task, top_k=5),
            recent_history=session.history[-10:],  # 最近 10 轮
            current_task=current_task
        )

# 原则 2：显式转换（不是 ad-hoc 字符串拼接）
class ContextPipeline:
    processors = [
        SystemPromptProcessor(),
        MemoryRetrievalProcessor(),
        HistorySummarizationProcessor(),  # 旧历史自动摘要
        ToolResultProcessor(),
        CurrentTaskProcessor(),
    ]

    def compile(self, raw_state: dict) -> str:
        context = ""
        for processor in self.processors:
            context = processor.process(context, raw_state)
        return context

# 原则 3：最小上下文原则
# 每次模型调用和子 Agent 只看到必要的最小上下文
```

上下文工程的四个策略：
1. **写出窗口外**：便签簿（Scratchpad）、长期记忆
2. **选择相关上下文**：RAG、记忆检索
3. **压缩上下文**：摘要、修剪
4. **隔离上下文**：多 Agent 系统、沙箱

#### 挑战 2：成本与延迟控制

Agent 的多步性质导致级联 LLM 调用，成本和延迟可能失控。

##### 模型路由（Model Routing）

```python
class ModelRouter:
    def route(self, task: str, complexity: float) -> str:
        """根据任务复杂度选择最经济的模型"""
        if complexity < 0.3:
            return "claude-haiku-4-5-20251001"   # 简单任务用小模型
        elif complexity < 0.7:
            return "claude-sonnet-4-5-20250929"  # 中等任务用中等模型
        else:
            return "claude-opus-4-7-20251015"    # 复杂任务用强模型
```

##### 语义缓存

根据 GPTCache 等项目的实测数据，语义缓存可以显著减少 LLM API 调用（部分场景可达 60-70%）：

```python
class SemanticCache:
    def __init__(self, similarity_threshold=0.95):
        self.cache = VectorStore()
        self.threshold = similarity_threshold

    def get_or_compute(self, query: str, compute_fn):
        # 检查是否有语义相似的缓存结果
        cached = self.cache.search(query, top_k=1)
        if cached and cached[0].similarity > self.threshold:
            return cached[0].result  # 缓存命中：15x 更快，70% 成本节省
        # 缓存未命中：计算并缓存
        result = compute_fn(query)
        self.cache.store(query, result)
        return result
```

#### 挑战 3：可观测性

```python
# 使用 OpenTelemetry 风格的 Trace/Span
class AgentTracer:
    def trace_step(self, step_name: str):
        span = self.tracer.start_span(step_name)
        span.set_attributes({
            "agent.step": step_name,
            "agent.model": self.current_model,
            "agent.tokens_used": 0,
            "agent.tool_calls": [],
        })
        return span

# 生产中的典型 Trace 结构：
# Trace: "用户请求 → Agent 执行"
#   ├── Span: "规划" (model=opus, tokens=2000, latency=3s)
#   ├── Span: "工具调用: search" (latency=1.2s)
#   ├── Span: "工具调用: database" (latency=0.3s)
#   ├── Span: "推理 + 生成" (model=sonnet, tokens=1500, latency=2s)
#   └── Span: "安全检查" (latency=0.1s)
```

关键监控指标：
- **成功率**：任务完成率、工具调用成功率
- **成本**：每任务 token 消耗、API 费用
- **延迟**：端到端延迟、各步骤延迟分布
- **质量**：幻觉率、用户反馈（点赞/点踩）

#### 挑战 4：安全与护栏

```python
class SafetyLayer:
    def __init__(self):
        self.input_guardrail = InputGuardrail()   # 输入过滤
        self.output_guardrail = OutputGuardrail()  # 输出过滤
        self.action_guardrail = ActionGuardrail()  # 行动审批

    def check_action(self, action: ToolCall) -> bool:
        """高风险操作需要人工审批"""
        if action.risk_level == "high":
            return self.human_approval(action)  # Human-in-the-Loop
        if action.risk_level == "medium":
            return self.automated_review(action) # 自动审查
        return True  # 低风险直接放行
```

#### 挑战 5：选择正确的架构级别

> "用满足需求的最简架构。"

```
简单单步任务              → 不需要 Agent，用 LLM + Prompt
结构明确的多步任务        → Plan-and-Execute
动态探索性任务            → ReAct
复杂多领域问题            → 多 Agent 系统（但协调开销必须物有所值）
```

#### 生产检查清单

- [ ] Agent Loop 有最大步数限制和超时
- [ ] 错误处理：重试 + 降级 + 错误分类 + 检查点
- [ ] 上下文管理：摘要 + 检索 + 最小上下文原则
- [ ] 成本控制：模型路由 + 语义缓存 + 预算上限
- [ ] 可观测性：Trace + 日志 + 指标 + 告警
- [ ] 安全：输入/输出过滤 + 行动审批 + 权限最小化
- [ ] 评估：上线前基准测试 + 上线后持续评估
- [ ] 降级方案：Agent 失败时的回退策略


### 第二部分：实战案例——设计日均 10 万对话的智能客服 Agent 系统


> **面试场景**：请设计一个日均 10 万对话的智能客服 Agent 系统，支持多渠道接入、FAQ 自动回答、工单处理和人工转接，峰值流量为日均的 5 倍。

**系统概述**：核心是构建**四层架构**——用户接入层、**Agent 编排层**、LLM 推理层和数据层。Agent 编排层是系统的大脑，通过**意图路由器**（轻量分类模型 + LLM fallback）分发请求，结合**对话状态机**管理多轮交互。知识问答走 **RAG 管道**（Embedding → 向量检索 → Re-ranking），工单和投诉类走结构化流程。系统必须内置 **Human Handoff** 机制，在置信度低、情绪激动或多轮失败时自动转人工。扩展性上，通过**无状态服务 + 消息队列**实现水平扩展，用**语义缓存**降低 LLM 调用成本，并设计**降级方案**应对模型服务不可用的场景。峰值 5 倍流量意味着系统需要支撑约 **58 QPS** 的并发处理能力，同时将端到端延迟控制在 **3 秒以内**。

#### Step 1: 需求澄清

在面试中，第一步永远是明确需求边界，而不是直接画架构图。

**功能需求（Functional Requirements）：**

| 需求项 | 说明 |
|--------|------|
| 多渠道接入 | Web、App、微信公众号 / 小程序，统一消息协议 |
| 意图识别 | 识别用户意图：FAQ 咨询、工单提交、投诉、闲聊等 |
| FAQ 回答 | 基于知识库的检索增强生成（RAG） |
| 工单处理 | 结构化信息收集 → 自动创建工单 → 状态追踪 |
| 人工转接 | 低置信度 / 敏感话题 / 用户主动要求时平滑切换 |
| 多轮对话 | 支持上下文连续对话，最长 50 轮 |

**非功能需求（Non-Functional Requirements）：**

| 指标 | 目标值 | 推导 |
|------|--------|------|
| 日均对话量 | 100,000 | 业务给定 |
| 峰值倍数 | 5x | 促销 / 故障期间的流量峰值 |
| 平均 QPS | ~1.16（100K / 86400） | 日均换算 |
| 峰值 QPS | ~58（5x × 100K / 86400） | 需要扩容的目标 |
| 端到端延迟 | < 3 秒（P95） | 用户体验要求 |
| 可用性 | 99.9%（年停机 < 8.76h） | SLA 承诺 |
| 每次对话轮数 | 平均 8 轮 | 行业经验值 |

#### Step 2: 高层架构

```
┌─────────────────────────────────────────────────────────────────────┐
│                        用户接入层 (Gateway)                          │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐     │
│   │   Web     │    │   App    │    │  微信     │    │  API     │     │
│   │ WebSocket │    │  SDK     │    │ 公众号    │    │ 开放接口  │     │
│   └────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘     │
│        └───────────────┼───────────────┼───────────────┘           │
│                        ↓               ↓                           │
│              ┌─────────────────────────────┐                       │
│              │   统一消息协议 (Protobuf)     │                       │
│              └──────────┬──────────────────┘                       │
└─────────────────────────┼───────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    Agent 编排层 (Orchestrator)                       │
│                                                                     │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐         │
│   │  意图路由器   │───→│  对话状态机   │───→│  工具调度器   │         │
│   │ IntentRouter │    │ StateMachine │    │ ToolDispatch │         │
│   └──────┬───────┘    └──────┬───────┘    └──────┬───────┘         │
│          │                   │                   │                  │
│   ┌──────┴───────┐    ┌──────┴───────┐    ┌──────┴───────┐         │
│   │ Human Handoff│    │  Session Mgr │    │  Guard Rails │         │
│   │   判断器      │    │  会话管理     │    │  安全护栏     │         │
│   └──────────────┘    └──────────────┘    └──────────────┘         │
└─────────────────────────┼───────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────────┐
│                     LLM 推理层 (Inference)                          │
│                                                                     │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐         │
│   │  模型路由器   │    │  语义缓存     │    │  Rate Limiter│         │
│   │ ModelRouter  │    │ SemanticCache│    │  限流器       │         │
│   └──────┬───────┘    └──────────────┘    └──────────────┘         │
│          ↓                                                          │
│   ┌──────────────┐    ┌──────────────┐                              │
│   │  GPT-4 级别  │    │  轻量模型     │                              │
│   │  复杂推理     │    │  简单 FAQ     │                              │
│   └──────────────┘    └──────────────┘                              │
└─────────────────────────┼───────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────────┐
│                       数据层 (Data Store)                           │
│                                                                     │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐         │
│   │  向量知识库   │    │  工单系统     │    │  用户画像     │         │
│   │  Milvus/PG   │    │  MySQL/PG    │    │  Redis/ES    │         │
│   └──────────────┘    └──────────────┘    └──────────────┘         │
│                                                                     │
│   ┌──────────────┐    ┌──────────────┐                              │
│   │  对话日志     │    │  分析数据仓库 │                              │
│   │  MongoDB     │    │  ClickHouse  │                              │
│   └──────────────┘    └──────────────┘                              │
└─────────────────────────────────────────────────────────────────────┘
```

#### Step 3: 核心组件设计

##### 3.1 意图路由器（Intent Router）

意图路由器采用**两级架构**：第一级是轻量分类模型（如 BERT-base fine-tuned），延迟 < 20ms，处理 80% 的常见意图；第二级是 LLM fallback，处理分类模型无法识别的长尾意图。

```
┌────────────────────────────────────────────┐
│              用户输入                        │
└─────────────────┬──────────────────────────┘
                  ↓
┌─────────────────────────────────────────────┐
│  第一级：轻量分类模型 (BERT fine-tuned)       │
│  延迟 < 20ms | 覆盖 80% 常见意图              │
└─────────┬────────────────┬──────────────────┘
          ↓                ↓
    confidence ≥ 0.85   confidence < 0.85
          ↓                ↓
    直接路由         ┌──────────────────┐
                     │ 第二级：LLM 分类  │
                     │ 延迟 ~500ms       │
                     └────────┬─────────┘
                              ↓
                         路由到对应处理流程
```

```python
from enum import Enum
from dataclasses import dataclass
from typing import Optional
import numpy as np


class Intent(Enum):
    """客服系统支持的意图类型"""
    FAQ = "faq"                    # 常见问题咨询
    ORDER_QUERY = "order_query"    # 订单查询
    TICKET_CREATE = "ticket_create"  # 工单创建
    COMPLAINT = "complaint"        # 投诉
    CHITCHAT = "chitchat"          # 闲聊
    UNKNOWN = "unknown"            # 未知意图


@dataclass
class IntentResult:
    """意图识别结果"""
    intent: Intent
    confidence: float
    source: str  # "classifier" 或 "llm_fallback"


class IntentRouter:
    """两级意图路由器：轻量分类模型 + LLM fallback"""

    CONFIDENCE_THRESHOLD = 0.85  # 分类模型置信度阈值

    def __init__(self, classifier_model, llm_client):
        self.classifier = classifier_model   # 轻量 BERT 分类模型
        self.llm_client = llm_client         # LLM 客户端
        self._intent_cache = {}              # 意图缓存

    async def route(self, user_input: str, session_context: dict) -> IntentResult:
        """
        两级意图识别：
        1. 先用轻量分类模型（< 20ms）
        2. 置信度不足时 fallback 到 LLM（~500ms）
        """
        # 第一级：轻量分类模型
        intent, confidence = await self.classifier.predict(user_input)

        if confidence >= self.CONFIDENCE_THRESHOLD:
            return IntentResult(
                intent=intent,
                confidence=confidence,
                source="classifier"
            )

        # 第二级：LLM fallback — 带上下文的精细分类
        llm_intent = await self._llm_classify(user_input, session_context)
        return IntentResult(
            intent=llm_intent,
            confidence=0.90,  # LLM 分类默认置信度
            source="llm_fallback"
        )

    async def _llm_classify(self, user_input: str, context: dict) -> Intent:
        """使用 LLM 进行意图分类，处理长尾场景"""
        prompt = f"""你是一个意图分类器。根据用户输入和对话上下文，判断用户意图。
只返回以下类别之一：faq, order_query, ticket_create, complaint, chitchat

对话历史：{context.get('history', '无')}
用户输入：{user_input}

意图类别："""
        response = await self.llm_client.complete(prompt, max_tokens=10)
        return Intent(response.strip())
```

##### 3.2 知识库 RAG 管道

RAG（Retrieval-Augmented Generation）管道负责从企业知识库中检索相关文档并生成回答。

```
┌──────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────┐
│ 用户问题  │───→│ Query 改写    │───→│ Embedding    │───→│ 向量检索  │
└──────────┘    │ + 扩展       │    │ text-embed-3 │    │ Top-K=20 │
                └──────────────┘    └──────────────┘    └─────┬────┘
                                                              ↓
┌──────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────┐
│ 流式响应  │←───│ LLM 生成      │←───│ Prompt 组装  │←───│ Re-rank  │
│ 返回用户  │    │ with Citation │    │ Top-5 文档   │    │ Top-5    │
└──────────┘    └──────────────┘    └──────────────┘    └──────────┘
```

```python
from dataclasses import dataclass, field


@dataclass
class RetrievedDoc:
    """检索到的知识库文档"""
    doc_id: str
    content: str
    score: float
    metadata: dict = field(default_factory=dict)


class RAGPipeline:
    """知识库 RAG 管道：Embedding → 向量检索 → Re-ranking → 生成"""

    def __init__(self, embedder, vector_store, reranker, llm_client):
        self.embedder = embedder        # Embedding 模型
        self.vector_store = vector_store  # 向量数据库 (Milvus / pgvector)
        self.reranker = reranker         # Re-ranking 模型 (cross-encoder)
        self.llm_client = llm_client     # LLM 生成模型

    async def answer(self, query: str, session_context: dict) -> str:
        """端到端 RAG 回答流程"""
        # 1. Query 改写：利用对话上下文补全指代
        rewritten_query = await self._rewrite_query(query, session_context)

        # 2. Embedding + 向量检索：召回 Top-20
        query_embedding = await self.embedder.encode(rewritten_query)
        candidates = await self.vector_store.search(
            vector=query_embedding,
            top_k=20,
            filter={"status": "published"}  # 只检索已发布文档
        )

        # 3. Re-ranking：精排到 Top-5
        reranked = await self.reranker.rerank(
            query=rewritten_query,
            documents=[c.content for c in candidates],
            top_k=5
        )

        # 4. 生成回答（带引用来源）
        context_text = "\n\n".join(
            f"[文档{i+1}] {doc.content}" for i, doc in enumerate(reranked)
        )
        prompt = f"""基于以下知识库文档回答用户问题。如果文档中没有相关信息，请诚实说明。
回答末尾请标注引用来源编号。

知识库文档：
{context_text}

用户问题：{rewritten_query}

回答："""
        return await self.llm_client.complete(prompt, max_tokens=500)

    async def _rewrite_query(self, query: str, context: dict) -> str:
        """基于对话上下文改写查询，解决指代消歧"""
        history = context.get("history", [])
        if not history:
            return query
        prompt = f"""将用户最新的问题改写为独立完整的查询语句。

对话历史：
{chr(10).join(history[-4:])}

最新问题：{query}

改写后的查询："""
        return await self.llm_client.complete(prompt, max_tokens=100)
```

##### 3.3 Human Handoff 判断逻辑

Human Handoff 是智能客服系统的关键安全机制。判断维度包含四个方面：

| 触发条件 | 阈值 | 说明 |
|---------|------|------|
| 置信度低 | < 0.6 | 意图识别或回答生成的置信度过低 |
| 敏感话题 | 关键词命中 | 法律纠纷、人身安全、资金损失等 |
| 用户情绪 | 负面 ≥ 0.8 | 用户明显愤怒或不满 |
| 多轮失败 | ≥ 3 次 | 连续多轮未能解决用户问题 |

```python
@dataclass
class HandoffDecision:
    """Human Handoff 决策结果"""
    should_handoff: bool
    reason: str
    priority: str  # "high", "medium", "low"
    suggested_skill_group: str  # 建议转接的客服技能组


class HumanHandoffJudge:
    """Human Handoff 判断器：多维度评估是否需要转人工"""

    # 敏感话题关键词（实际生产中应使用分类模型）
    SENSITIVE_TOPICS = {"法律", "律师", "报警", "投诉到工信部", "人身安全", "资金被盗"}

    def __init__(self, sentiment_model):
        self.sentiment_model = sentiment_model

    async def evaluate(
        self,
        user_input: str,
        intent_result: IntentResult,
        session_context: dict
    ) -> HandoffDecision:
        """
        多维度评估是否需要转人工：
        1. 意图识别置信度
        2. 敏感话题检测
        3. 用户情绪分析
        4. 多轮失败计数
        """
        reasons = []

        # 维度 1：置信度检查
        if intent_result.confidence < 0.6:
            reasons.append(f"意图置信度过低: {intent_result.confidence:.2f}")

        # 维度 2：敏感话题检测
        if any(kw in user_input for kw in self.SENSITIVE_TOPICS):
            reasons.append("触发敏感话题关键词")

        # 维度 3：用户情绪分析
        sentiment_score = await self.sentiment_model.analyze(user_input)
        if sentiment_score.negative >= 0.8:
            reasons.append(f"用户情绪负面: {sentiment_score.negative:.2f}")

        # 维度 4：多轮失败计数
        fail_count = session_context.get("consecutive_failures", 0)
        if fail_count >= 3:
            reasons.append(f"连续 {fail_count} 轮未解决")

        # 用户主动要求转人工
        if self._user_requests_human(user_input):
            reasons.append("用户主动要求转人工")

        if not reasons:
            return HandoffDecision(
                should_handoff=False, reason="", priority="low",
                suggested_skill_group=""
            )

        # 根据触发原因确定优先级和技能组
        priority = "high" if "敏感话题" in str(reasons) else "medium"
        skill_group = self._select_skill_group(intent_result.intent, reasons)

        return HandoffDecision(
            should_handoff=True,
            reason=" | ".join(reasons),
            priority=priority,
            suggested_skill_group=skill_group
        )

    def _user_requests_human(self, text: str) -> bool:
        """检测用户是否主动要求转人工"""
        keywords = {"转人工", "人工客服", "真人", "找人", "不想跟机器人"}
        return any(kw in text for kw in keywords)

    def _select_skill_group(self, intent: Intent, reasons: list) -> str:
        """根据意图和原因选择客服技能组"""
        skill_map = {
            Intent.COMPLAINT: "投诉处理组",
            Intent.ORDER_QUERY: "订单服务组",
            Intent.TICKET_CREATE: "技术支持组",
        }
        return skill_map.get(intent, "综合服务组")
```

##### 3.4 多轮对话状态管理

使用 Redis 存储 Session 状态，通过对话摘要控制上下文长度：

```python
import json
import time
from typing import Optional


class SessionManager:
    """多轮对话 Session 管理器：Redis 存储 + 对话摘要"""

    SESSION_TTL = 3600  # Session 过期时间：1 小时
    MAX_HISTORY_TURNS = 20  # 保留的最大对话轮数
    SUMMARIZE_THRESHOLD = 10  # 触发摘要的轮数阈值

    def __init__(self, redis_client, llm_client):
        self.redis = redis_client
        self.llm_client = llm_client

    async def get_session(self, session_id: str) -> dict:
        """获取 Session，不存在则创建"""
        data = await self.redis.get(f"session:{session_id}")
        if data:
            return json.loads(data)
        return {
            "session_id": session_id,
            "history": [],
            "summary": "",
            "state": "active",
            "created_at": time.time(),
            "consecutive_failures": 0,
            "metadata": {}
        }

    async def update_session(self, session_id: str, user_msg: str, bot_msg: str):
        """更新 Session：追加对话 + 按需摘要"""
        session = await self.get_session(session_id)
        session["history"].append({"role": "user", "content": user_msg})
        session["history"].append({"role": "assistant", "content": bot_msg})

        # 对话轮数超过阈值时触发摘要压缩
        if len(session["history"]) > self.SUMMARIZE_THRESHOLD * 2:
            session = await self._compress_history(session)

        await self.redis.set(
            f"session:{session_id}",
            json.dumps(session, ensure_ascii=False),
            ex=self.SESSION_TTL
        )

    async def _compress_history(self, session: dict) -> dict:
        """压缩对话历史：前半部分生成摘要，保留最近对话"""
        history = session["history"]
        # 保留最近 6 轮（12 条消息），其余生成摘要
        to_summarize = history[:-12]
        to_keep = history[-12:]

        history_text = "\n".join(
            f"{msg['role']}: {msg['content']}" for msg in to_summarize
        )
        prompt = f"""请将以下客服对话摘要为 3-5 句话，保留关键信息（用户问题、已提供的解决方案、待处理事项）。

对话内容：
{history_text}

摘要："""
        new_summary = await self.llm_client.complete(prompt, max_tokens=200)
        session["summary"] = (session.get("summary", "") + "\n" + new_summary).strip()
        session["history"] = to_keep
        return session
```

#### Step 4: 数据流设计

一次完整请求从用户发出到收到回复的全链路：

```
用户发送消息
     │
     ↓
┌─────────────────────────┐
│ 1. Gateway 接收          │  统一协议转换，鉴权，限流
│    延迟 ~5ms             │
└────────┬────────────────┘
         ↓
┌─────────────────────────┐
│ 2. 加载 Session          │  从 Redis 读取对话上下文
│    延迟 ~3ms             │
└────────┬────────────────┘
         ↓
┌─────────────────────────┐
│ 3. 意图路由              │  BERT 分类 (~15ms)
│    延迟 15-500ms         │  或 LLM fallback (~500ms)
└────────┬────────────────┘
         ↓
┌─────────────────────────┐
│ 4. Handoff 判断          │  多维度评估是否转人工
│    延迟 ~20ms            │
└────────┬────────────────┘
         ↓ (不转人工)
┌─────────────────────────┐
│ 5. 语义缓存查询          │  相似问题命中率约 30%
│    延迟 ~10ms            │
└────────┬────────────────┘
    命中 ↓         未命中 ↓
  直接返回   ┌─────────────────────────┐
             │ 6. RAG / LLM 生成       │
             │    延迟 800-2000ms       │
             └────────┬────────────────┘
                      ↓
         ┌─────────────────────────┐
         │ 7. Guard Rails 检查      │  安全过滤 + 质量校验
         │    延迟 ~50ms            │
         └────────┬────────────────┘
                  ↓
         ┌─────────────────────────┐
         │ 8. 更新 Session + 异步   │  写 Redis + 异步写日志
         │    延迟 ~5ms             │
         └────────┬────────────────┘
                  ↓
            返回响应给用户
        总延迟 P95 < 2500ms
```

#### Step 5: 扩展性设计

##### 5.1 水平扩展

```
                    ┌──────────────┐
                    │  负载均衡器   │
                    │   (Nginx)    │
                    └──────┬───────┘
            ┌──────────────┼──────────────┐
            ↓              ↓              ↓
    ┌──────────────┐┌──────────────┐┌──────────────┐
    │ Orchestrator ││ Orchestrator ││ Orchestrator │
    │   Pod #1     ││   Pod #2     ││   Pod #N     │
    │  (无状态)     ││  (无状态)     ││  (无状态)     │
    └──────┬───────┘└──────┬───────┘└──────┬───────┘
           └───────────────┼───────────────┘
                           ↓
                ┌──────────────────────┐
                │   消息队列 (Kafka)    │  ← 削峰填谷
                └──────────┬───────────┘
                           ↓
                ┌──────────────────────┐
                │  LLM Worker Pool     │  ← 独立扩缩容
                │  (GPU / API 调用)     │
                └──────────────────────┘
```

关键设计点：

- **无状态编排服务**：Session 存储在 Redis，编排器本身无状态，可水平扩缩容
- **消息队列削峰**：Kafka 缓冲请求，LLM Worker 按能力消费，避免模型过载
- **独立扩缩容**：接入层、编排层、推理层分别根据各自指标自动扩缩

##### 5.2 语义缓存策略（生产实现）

```python
class CustomerServiceSemanticCache:
    """语义缓存：相似问题复用已有回答，降低 LLM 调用成本"""

    SIMILARITY_THRESHOLD = 0.92  # 语义相似度阈值

    def __init__(self, embedder, vector_store, redis_client):
        self.embedder = embedder
        self.vector_store = vector_store  # 缓存专用向量库
        self.redis = redis_client

    async def get(self, query: str) -> Optional[str]:
        """查询语义缓存，命中则返回缓存回答"""
        query_vec = await self.embedder.encode(query)
        results = await self.vector_store.search(vector=query_vec, top_k=1)

        if results and results[0].score >= self.SIMILARITY_THRESHOLD:
            cached = await self.redis.get(f"cache:{results[0].doc_id}")
            if cached:
                return json.loads(cached)["answer"]
        return None

    async def put(self, query: str, answer: str, ttl: int = 86400):
        """写入语义缓存，默认保留 24 小时"""
        query_vec = await self.embedder.encode(query)
        doc_id = f"q_{hash(query) % (10**12)}"
        await self.vector_store.upsert(doc_id=doc_id, vector=query_vec, content=query)
        await self.redis.set(
            f"cache:{doc_id}",
            json.dumps({"query": query, "answer": answer}, ensure_ascii=False),
            ex=ttl
        )
```

##### 5.3 降级方案

当 LLM 服务不可用时，系统不能完全瘫痪：

| 降级级别 | 触发条件 | 策略 |
|---------|---------|------|
| Level 1 | LLM 延迟 > 5s | 切换到轻量模型（如 GPT-3.5 级别） |
| Level 2 | LLM 完全不可用 | 切换到 FAQ 关键词匹配模式 |
| Level 3 | FAQ 也不可用 | 自动转人工 + 排队提示 |

#### Step 6: 成本估算

以使用 GPT-4o 级别模型为例：

| 项目 | 计算 | 每日成本 |
|------|------|---------|
| 日均对话数 | 100,000 | — |
| 每次对话平均轮数 | 8 轮 | — |
| 每轮平均 Input Token | ~800 tokens（含上下文） | — |
| 每轮平均 Output Token | ~200 tokens | — |
| 总 Input Token / 日 | 100K × 8 × 800 = 6.4 亿 | — |
| 总 Output Token / 日 | 100K × 8 × 200 = 1.6 亿 | — |
| Input 成本（$2.5/1M tokens） | 640M × $2.5 / 1M | $1,600 |
| Output 成本（$10/1M tokens） | 160M × $10 / 1M | $1,600 |
| **LLM 日成本合计** | — | **$3,200** |
| 语义缓存命中率 30% | 节省 30% | -$960 |
| 轻量模型分流 40% FAQ | FAQ 用 $0.15/1M 模型 | -$1,200（约） |
| **优化后日成本** | — | **~$1,040** |
| **月成本** | × 30 | **~$31,200** |

加上基础设施（Redis、向量数据库、Kafka、K8s 集群等），月总成本约 **$40,000 - $50,000**。

#### 核心编排器：整合所有组件

```python
class CustomerServiceOrchestrator:
    """智能客服 Agent 编排器：串联所有核心组件"""

    def __init__(
        self,
        intent_router: IntentRouter,
        rag_pipeline: RAGPipeline,
        handoff_judge: HumanHandoffJudge,
        session_manager: SessionManager,
        semantic_cache: CustomerServiceSemanticCache,
    ):
        self.intent_router = intent_router
        self.rag_pipeline = rag_pipeline
        self.handoff_judge = handoff_judge
        self.session_manager = session_manager
        self.semantic_cache = semantic_cache

    async def handle_message(self, session_id: str, user_input: str) -> dict:
        """
        处理一条用户消息的完整流程：
        Session 加载 → 意图识别 → Handoff 判断 → 缓存查询 → 生成回答 → Session 更新
        """
        # 1. 加载 Session
        session = await self.session_manager.get_session(session_id)

        # 2. 意图识别
        intent_result = await self.intent_router.route(user_input, session)

        # 3. Human Handoff 判断
        handoff = await self.handoff_judge.evaluate(user_input, intent_result, session)
        if handoff.should_handoff:
            return {
                "type": "handoff",
                "message": "正在为您转接人工客服，请稍候...",
                "reason": handoff.reason,
                "priority": handoff.priority,
                "skill_group": handoff.suggested_skill_group,
            }

        # 4. 查询语义缓存
        cached_answer = await self.semantic_cache.get(user_input)
        if cached_answer:
            await self.session_manager.update_session(
                session_id, user_input, cached_answer
            )
            return {"type": "answer", "message": cached_answer, "source": "cache"}

        # 5. 根据意图分发处理
        if intent_result.intent == Intent.FAQ:
            answer = await self.rag_pipeline.answer(user_input, session)
        elif intent_result.intent == Intent.ORDER_QUERY:
            answer = await self._handle_order_query(user_input, session)
        elif intent_result.intent == Intent.TICKET_CREATE:
            answer = await self._handle_ticket_create(user_input, session)
        else:
            answer = await self.rag_pipeline.answer(user_input, session)

        # 6. 写入缓存 + 更新 Session
        await self.semantic_cache.put(user_input, answer)
        await self.session_manager.update_session(session_id, user_input, answer)

        return {"type": "answer", "message": answer, "source": "generated"}

    async def _handle_order_query(self, user_input: str, session: dict) -> str:
        """订单查询：提取订单号 → 调用订单 API → 生成回答"""
        # 实际实现中会调用订单系统 API
        return "正在为您查询订单信息..."

    async def _handle_ticket_create(self, user_input: str, session: dict) -> str:
        """工单创建：收集必要信息 → 创建工单 → 返回工单号"""
        # 实际实现中会调用工单系统 API
        return "正在为您创建工单..."
```

## 常见误区 / 面试追问

1. **误区："先做 Demo 再考虑生产化"** — 生产化不是在 Demo 上打补丁。延迟、成本、可观测性应该在设计初期就考虑（"design for latency upfront"）。

2. **误区："静态 Benchmark 高分 = 生产好用"** — 95% 的静态 Benchmark 准确率在生产中可能"完全崩溃"。原因是静态 Benchmark 基于预录制的轨迹评估，但生产环境是动态的。

3. **误区："直接用一个大模型处理所有请求就行了"** — 日均 10 万对话如果全部走 GPT-4 级别模型，月成本将超过 $10 万，且延迟无法保证。正确做法是分层处理：80% 的简单 FAQ 走轻量模型或语义缓存，只有复杂场景才调用强模型。单一模型也无法处理工单创建等需要调用外部 API 的结构化任务，必须结合 Tool Use 和状态机设计。

4. **误区："智能客服不需要 Human Handoff，AI 可以处理一切"** — 在生产环境中，Human Handoff 是不可或缺的安全兜底机制。无论模型多强大，总有它无法可靠处理的场景：涉及法律责任的投诉、情绪极度激动的用户、需要越权操作的请求等。缺少 Human Handoff 的系统会导致用户满意度急剧下降，甚至引发舆情危机。业界经验是 AI 自主处理率达到 70-85% 即为优秀，剩余的必须有人工兜底。

5. **追问："市场数据如何？"** — AI Agent 市场从 2024 年的 $54 亿增长到 2025 年的 $76 亿，预计 2030 年达 $503 亿（CAGR 45.8%）。McKinsey 数据显示 23% 的组织已在规模化部署 Agent 系统。

6. **追问："Context Engineering 是什么新概念？"** — 它是 2025-2026 年出现的新学科，将上下文视为一等公民——有自己的架构、生命周期和约束，而非简单的字符串拼接。

7. **追问："如何处理高峰期 5 倍流量？"** — 三层防护：第一层是 Gateway 限流 + 排队机制，保护下游服务不被压垮；第二层是 Kafka 消息队列削峰填谷，LLM Worker 按自身能力消费；第三层是弹性扩缩容（K8s HPA），根据 QPS 和队列积压自动扩容编排器 Pod。同时，高峰期应自动提升语义缓存的复用阈值（如从 0.92 降到 0.88），并将更多请求分流到轻量模型，在回答质量和系统可用性之间做动态平衡。

8. **追问："如何衡量这套系统的效果？"** — 建立多层指标体系。**业务指标**：自主解决率（目标 > 75%）、用户满意度 CSAT（目标 > 4.2/5）、平均对话轮数（越少越好）、人工转接率（目标 < 25%）。**技术指标**：P95 延迟（< 3s）、系统可用性（> 99.9%）、RAG 检索准确率（> 85%）、意图识别 F1-score（> 0.90）。**成本指标**：单次对话成本（目标 < $0.05）、缓存命中率（目标 > 30%）。建议搭建 A/B 实验平台，持续迭代 Prompt、检索策略和模型选型。

## 参考资料

- [LLM Agents in Production: Architectures, Challenges, and Best Practices (ZenML)](https://www.zenml.io/blog/llm-agents-in-production-architectures-challenges-and-best-practices)
- [Architecting Efficient Context-Aware Multi-Agent Framework for Production (Google Developers Blog)](https://developers.googleblog.com/architecting-efficient-context-aware-multi-agent-framework-for-production/)
- [AI Agent Architecture: Build Systems That Work in 2026 (Redis)](https://redis.io/blog/ai-agent-architecture/)
- [Building Production-Ready AI Agents (Diagrid)](https://www.diagrid.io/blog/building-production-ready-ai-agents-what-your-framework-needs)
- [Engineering Production-Ready LLM Systems (Medium)](https://medium.com/@eng.fadishaar/building-large-language-model-llm-systems-that-work-in-production-7292d675b80b)
- [Building LLM-Powered Customer Service Agents (LangChain Blog)](https://blog.langchain.dev/building-llm-powered-customer-service-agents/)
- [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (Lewis et al., 2020)](https://arxiv.org/abs/2005.11401)
- [Designing AI-First Customer Service Architectures (AWS Architecture Blog)](https://aws.amazon.com/blogs/architecture/designing-ai-first-customer-service-architectures/)
- [Large Language Model based Long-tail Query Rewriting in Taobao Search (Alibaba, 2023)](https://arxiv.org/abs/2311.03758)
- [Semantic Caching for LLM Applications (GPTCache Documentation)](https://gptcache.readthedocs.io/en/latest/)
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="108-interview-deep-dive-chain">

<h2 class="question-title"><span class="q-badge ai100-badge">Q9</span><span class="question-text">面试追问链：从「什么是 Agent」到系统设计的 10 层递进追问</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：Agent, AI100 · 考察点：Agent 架构</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：面试追问链（Interview Deep-Dive Chain）是一种结构化面试技术：面试官从基础问题出发，根据候选人回答逐层深入，最终触达系统设计层面。在 AI Agent 领域，一条典型追问链从"什么是 **LLM Agent**"起步，经过 **Agent Loop**、**终止条件**、**错误恢复**、**Self-Reflection**、**Reflection 局限性**、**RAG 集成**、**Multi-Agent 协作**、**生产部署**，最终落到 **安全与 Guardrails**。追问链的核心价值不在于"难倒候选人"，而在于**找到候选人的能力天花板并评估其思维深度**。好的追问链具备三个特征：**逻辑连贯**（每个问题自然承接上一个回答）、**难度递进**（从记忆型到分析型再到创造型）、**可调节**（面试官可根据候选人水平跳过或展开某些层级）。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误区："背答案就够了，追问链上的每个答案我都背下来就能过面试" · 误区："面试追问就是刁难候选人，问到答不出来为止" · 追问："如果候选人在 L5 卡住了，你作为面试官会怎么引导？"</div>
</div>

## 详细解析

### 追问链全景图

```
L1  什么是 LLM Agent？         ←── 基础
 ↓  候选人提到"循环"
L2  Agent 核心循环是怎样的？     ←── 基础
 ↓  候选人描述了 Loop
L3  循环什么时候终止？           ←── 中级
 ↓  候选人提到"出错"
L4  第一步就选错工具怎么办？     ←── 中级
 ↓  候选人提到"自我修正"
L5  如何让 Agent 自我修正？      ←── 中级
 ↓  面试官追问局限性
L6  Reflection 有什么局限？     ←── 高级
 ↓  候选人提到"外部知识"
L7  如何用外部知识辅助决策？     ←── 高级
 ↓  面试官提高复杂度
L8  多个 Agent 如何协作？       ←── 高级
 ↓  候选人描述了架构
L9  这套系统如何部署到生产？     ←── 高级
 ↓  面试官关注风险
L10 如何保证系统安全？          ←── 高级
```

### 难度分层与能力映射

| 层级 | 难度 | 考察维度 | Bloom 认知层级 | 对应职级 |
|------|------|---------|---------------|---------|
| L1-L2 | 基础 | 概念记忆与理解 | 记忆 / 理解 | 初级工程师 |
| L3-L5 | 中级 | 分析与应用 | 应用 / 分析 | 中级工程师 |
| L6-L8 | 高级 | 评价与权衡 | 评价 | 高级工程师 |
| L9-L10 | 高级 | 系统设计与创造 | 创造 | Staff+ |


### L1（基础）—— 什么是 LLM Agent？

**面试官问：** "什么是 LLM Agent？它和普通 LLM 应用有什么区别？"

**期望答案要点：**
- Agent 是以 LLM 为推理引擎、能自主完成多步任务的系统
- 核心区别：感知（Perceive）→ 推理（Reason）→ 行动（Act）的循环
- 传统 LLM 应用是无状态单轮文本处理器；Agent 是有状态、目标驱动的自主系统
- Agent 具备工具使用（Tool Use）能力，能与外部世界交互

**评分标准：**
- **优秀：** 清晰区分 Agent 与传统 LLM 应用，提到自主性、状态管理、工具调用，并给出具体例子
- **合格：** 知道 Agent 能调用工具、多步执行，但底层机制描述模糊
- **不足：** 将 Agent 等同于"加了 System Prompt 的 ChatGPT"

**过渡逻辑：** 候选人提到"循环"或"多步"时，面试官追问循环的具体机制。


### L2（基础）—— Agent 的核心循环是怎样的？

**面试官问：** "你提到 Agent 会循环执行，这个循环具体是怎么工作的？"

**期望答案要点：**
- Agent Loop 四阶段：Observe → Think → Act → Observe
- Think 阶段由 LLM 完成推理，Act 阶段调用工具并获取结果
- 每次循环更新上下文（Context），积累到下一轮推理
- 典型实现模式：ReAct（Reasoning + Acting）

```python
class AgentLoop:
    def __init__(self, llm, tools, max_steps=10):
        self.llm, self.tools, self.max_steps = llm, tools, max_steps

    def run(self, goal: str) -> str:
        context = [{"role": "user", "content": goal}]
        for step in range(self.max_steps):
            response = self.llm.chat(context)           # Think
            if response.is_final_answer:
                return response.content
            result = self.tools.execute(                 # Act
                response.tool_call.name, response.tool_call.arguments
            )
            context.append({"role": "assistant", "content": response})
            context.append({"role": "tool", "content": result})  # Observe
        return "达到最大步数限制，任务未完成"
```

**评分标准：**
- **优秀：** 能画出循环流程，提到 ReAct 模式，理解上下文如何在循环间传递
- **合格：** 知道"LLM 调用 → 工具执行 → 再调用"的基本流程
- **不足：** 无法描述循环结构，认为 Agent 只是"调用一次 LLM 然后执行"

**过渡逻辑：** 候选人描述了循环后，面试官追问关键工程问题——循环不能无限跑，什么时候停？


### L3（中级）—— 循环什么时候终止？

**面试官问：** "这个循环不能永远跑下去吧？怎么决定什么时候该停？"

**期望答案要点：**
- **Max Steps 限制：** 硬性上限，防止无限循环
- **目标达成检测：** LLM 判断任务完成（如生成 `final_answer`）
- **收敛判断：** 检测连续几轮输出是否重复或无实质进展
- **资源预算：** Token 消耗、时间、API 调用次数达到上限

```
开始循环 → 超过 Max Steps? ──是──→ 优雅降级返回
              │ 否
              ↓
         LLM 输出终止? ──是──→ 返回最终结果
              │ 否
              ↓
         检测到死循环? ──是──→ 强制终止 + 告警
              │ 否
              ↓
         继续下一轮循环
```

**评分标准：**
- **优秀：** 提到多种终止策略并能分析 trade-off，理解"由系统而非 Agent 保证终止"的原则
- **合格：** 知道 Max Steps 和目标检测，但对死循环检测和优雅降级缺乏认识
- **不足：** 只知道 Max Steps，不理解为什么仅靠 LLM 自行判断终止是不可靠的

**过渡逻辑：** 终止是"正常结束"，但如果 Agent 执行过程中犯错了呢？面试官引入错误处理话题。


### L4（中级）—— 如果 Agent 在第一步就选错了工具怎么办？

**面试官问：** "假设 Agent 需要查数据库，但第一步却调了不相关的 API，怎么办？"

**期望答案要点：**
- **错误信息回传：** 将错误作为 Observation 反馈给 LLM，让它重新决策
- **重试策略：** 指数退避重试、限制同一工具连续重试次数
- **Self-Correction：** LLM 阅读错误信息后调整行动计划
- **Fallback 机制：** 工具不可用时切换备选工具或人工接管
- **预防措施：** 工具描述（Tool Description）要精准，减少选错概率

```python
def execute_with_recovery(self, tool_name, tool_args, max_retries=3):
    for attempt in range(max_retries):
        try:
            return {"status": "success", "result": self.tools.execute(tool_name, tool_args)}
        except ToolNotFoundError:
            return {"status": "error", "message": f"工具不存在，可用: {self.tools.list()}"}
        except ToolExecutionError as e:
            if attempt < max_retries - 1:
                return {"status": "error", "message": f"第{attempt+1}次失败: {e}，请换方案"}
    return {"status": "fatal", "message": "多次重试失败，请人工介入"}
```

**评分标准：**
- **优秀：** 区分"选错工具"和"工具执行失败"，提出预防 + 恢复的完整策略
- **合格：** 知道把错误信息反馈给 LLM 让它重试
- **不足：** 认为"选错工具就失败了"，不理解 Agent 的自我纠错能力

**过渡逻辑：** 候选人提到"自我纠错"时，面试官追问——怎么让这种能力更系统化？


### L5（中级）—— 如何让 Agent 有自我修正能力？

**面试官问：** "除了简单的重试，有没有更系统的方法让 Agent 反思并修正错误？"

**期望答案要点：**
- **Self-Reflection：** Agent 行动后显式评估自己的输出质量
- **Reflexion 框架：** Actor（执行）→ Evaluator（评估）→ Self-Reflection（反思改进）
- **外部验证器：** 单元测试、代码执行、规则校验等客观验证手段
- **经验记忆：** 将反思结论存入 Memory，避免重复犯错

```
Actor(执行者) ──行动──→ 环境/工具 ──反馈──→ Evaluator(评估者)
                                              │
                                         评估结果
                                              ↓
                                      Self-Reflection(反思者)
                                              │
                                         改进建议
                                              ↓
                                       经验记忆(Memory)
```

**评分标准：**
- **优秀：** 能描述 Reflexion 框架，区分内部反思与外部验证，理解经验记忆的价值
- **合格：** 知道"让 LLM 反思自己的输出"，但缺乏框架级认知
- **不足：** 将自我修正等同于"重试"，不理解反思与简单重试的本质区别

**过渡逻辑：** 候选人对 Reflection 有了解后，面试官切换到挑战模式——这方法有什么问题？


### L6（高级）—— Reflection 有什么局限？

**面试官问：** "Reflection 听起来很好，但它有什么局限性？什么场景会失效？"

**期望答案要点：**
- **推理幻觉：** LLM 可能"反思"出错误结论，越反思越偏
- **额外 Token 成本：** 每次反思需要额外 LLM 调用，成本线性增长
- **收敛不保证：** 没有数学证明反思一定改善结果，可能震荡
- **自我认知盲区：** LLM 难以发现自身系统性偏差
- **验证器依赖：** 没有可靠外部验证器的领域（如开放式创意任务），反思效果有限

| 维度 | Self-Reflection | 外部验证器 | 人工审核 |
|------|----------------|-----------|---------|
| 速度 | 快（秒级） | 中（秒~分钟） | 慢（分钟~小时） |
| 成本 | Token 费用 | 计算资源 | 人力成本 |
| 可靠性 | 低（可能幻觉） | 高（客观标准） | 最高 |
| 扩展性 | 好 | 好 | 差 |

**评分标准：**
- **优秀：** 指出 3 个以上局限，并提出缓解策略（如"反思 + 外部验证"组合）
- **合格：** 意识到 Token 成本和幻觉风险，但无法深入分析
- **不足：** 认为 Reflection 是万能的，未考虑过失败场景

**过渡逻辑：** 候选人提到"外部知识"或"验证器"不足时，面试官引导至 RAG 话题。


### L7（高级）—— 如何用外部知识辅助 Agent 决策？

**面试官问：** "Agent 自身知识有限，如何引入外部知识辅助决策？"

**期望答案要点：**
- **RAG 集成：** Agent 在推理前检索相关文档，增强上下文
- **Knowledge Graph：** 结构化知识图谱提供实体关系，辅助推理
- **动态上下文注入：** 根据任务阶段动态选择注入哪些知识
- **工具即知识：** 将数据库查询、API 调用作为知识获取手段
- **上下文窗口管理：** 知识太多挤占推理空间，需要 Relevance Ranking

```python
class RAGEnhancedAgent:
    def __init__(self, llm, tools, retriever):
        self.llm, self.tools, self.retriever = llm, tools, retriever

    def think(self, context: list) -> str:
        query = self._extract_search_query(context)
        docs = self.retriever.search(query, top_k=5)        # 检索
        augmented = [{"role": "system", "content": self._format(docs)}, *context]
        return self.llm.chat(augmented)                      # 增强推理
```

**评分标准：**
- **优秀：** 能描述 RAG 在 Agent Loop 中的集成位置，理解上下文窗口管理挑战
- **合格：** 知道 RAG 基本概念，但不清楚如何与 Agent Loop 结合
- **不足：** 将 RAG 等同于"把所有文档塞进 Prompt"

**过渡逻辑：** 当任务复杂到一个 Agent 无法胜任时，面试官引入 Multi-Agent 话题。


### L8（高级）—— 如果一个 Agent 不够，多个 Agent 如何协作？

**面试官问：** "任务太复杂一个 Agent 处理不了，你怎么设计多 Agent 协作？"

**期望答案要点：**
- **Multi-Agent 模式：** Orchestrator-Worker、Hierarchical、Peer-to-Peer
- **Handoff 机制：** Agent 间任务交接，包括上下文传递和责任转移
- **编排器（Orchestrator）：** 中央调度器分配任务、收集结果、处理冲突
- **专业化分工：** 每个 Agent 有独立 System Prompt、工具集和知识库

```
            ┌──────────────┐
            │ Orchestrator │
            └──┬───┬───┬──┘
     分配任务 │   │   │ 收集结果
       ┌──────┘   │   └──────┐
       ↓          ↓          ↓
  ┌────────┐ ┌────────┐ ┌────────┐
  │Worker-1│ │Worker-2│ │Worker-3│
  │代码生成 │ │测试验证 │ │文档撰写 │
  └────────┘ └────────┘ └────────┘
```

**评分标准：**
- **优秀：** 对比多种协作模式的 trade-off，理解 Handoff 的上下文传递挑战
- **合格：** 知道"拆分成多个 Agent"，但对编排机制描述不清
- **不足：** 认为"多个 Agent 就是多线程调同一个 LLM"

**过渡逻辑：** 架构设计完成后，面试官关注工程落地——这套系统怎么上生产？


### L9（高级）—— 这套多 Agent 系统如何部署到生产？

**面试官问：** "要把这套多 Agent 系统部署到生产环境，需要考虑哪些问题？"

**期望答案要点：**
- **架构设计：** Agent 作为微服务、消息队列解耦、状态持久化
- **可扩展性：** 水平扩展 Worker Agent、任务队列负载均衡
- **可观测性：** 每步 LLM 调用和工具执行都需 Trace（LangSmith / OpenTelemetry）
- **成本控制：** Token 监控、缓存策略、模型分级（简单任务用小模型）
- **容错设计：** Checkpoint 机制、崩溃恢复、幂等性保证

```python
production_config = {
    "agent":        {"max_steps": 25, "timeout_seconds": 300, "checkpoint": "redis"},
    "llm":          {"primary": "claude-sonnet-4", "fallback": "claude-haiku-4", "temperature": 0.0},
    "observability": {"trace_backend": "opentelemetry", "metrics": ["token_usage", "latency", "error_rate"]},
    "cost_control":  {"max_tokens_per_session": 100000, "cache": "semantic",
                      "model_routing": {"simple": "haiku", "complex": "sonnet"}},
}
```

**评分标准：**
- **优秀：** 覆盖可观测性、成本控制、容错、扩展四个维度，能给出具体技术选型
- **合格：** 知道需要监控和日志，但对 Trace 粒度和成本优化缺乏具体方案
- **不足：** 只关注功能实现，未考虑运维层面的挑战

**过渡逻辑：** 系统上了生产就面临安全风险，面试官最终追问安全性。


### L10（高级）—— 如何保证系统安全？

**面试官问：** "这套 Agent 系统直接与外部 API 和数据库交互，怎么保证它不会做出危险操作？"

**期望答案要点：**
- **Guardrails（护栏）：** 输入过滤（Prompt Injection 检测）、输出校验（敏感信息过滤）
- **权限最小化（Least Privilege）：** 每个 Agent 只拥有完成任务所需最小权限
- **沙箱执行：** 代码执行和文件操作在隔离环境中运行
- **Human-in-the-Loop：** 高风险操作（删除数据、转账）必须人工确认
- **Red Teaming：** 定期对 Agent 进行对抗性测试，发现安全漏洞

```
Layer 1 输入层:    Prompt Injection 检测 → 输入校验
       ↓
Layer 2 推理层:    System Prompt 防护 → 输出格式约束
       ↓
Layer 3 执行层:    权限检查 → 沙箱隔离 → 操作审计日志
       ↓
Layer 4 人工审核:  高风险操作拦截 → Human-in-the-Loop
```

**评分标准：**
- **优秀：** 能描述多层防护架构，理解 Prompt Injection 威胁，提到 Red Teaming 实践
- **合格：** 知道需要权限控制和人工确认，但安全思维不够系统化
- **不足：** 认为"限制工具权限就够了"，未考虑 Prompt Injection 和对抗性攻击


### 面试官视角：如何动态使用追问链

追问链不是死板题库，而是动态导航工具。面试官应根据候选人回答实时调整：

```python
class InterviewNavigator:
    LEVELS = {
        "junior": {"start": 1, "target": 3, "max": 5},
        "mid":    {"start": 2, "target": 5, "max": 7},
        "senior": {"start": 3, "target": 7, "max": 10},
        "staff":  {"start": 5, "target": 9, "max": 10},
    }

    def decide_next(self, current_level, answer_quality, candidate_level):
        cfg = self.LEVELS[candidate_level]
        if answer_quality == "excellent":
            return min(current_level + 2, cfg["max"])   # 跳级追问
        elif answer_quality == "good":
            return min(current_level + 1, cfg["max"])   # 正常递进
        elif answer_quality == "struggling":
            return current_level                        # 停留并引导
        else:
            return f"能力边界在 L{current_level}，建议结束追问"
```

## 常见误区 / 面试追问

1. **误区："背答案就够了，追问链上的每个答案我都背下来就能过面试"** — 追问链的核心价值在于考察思维过程而非记忆力。优秀的面试官会根据候选人回答动态调整追问方向，背诵标准答案的候选人在面试官稍微变换角度时就会暴露。真正有效的准备是理解每层问题之间的逻辑关联——为什么 L3 的终止条件自然引出 L4 的错误恢复？因为终止是"正常结束"，错误是"异常情况"，二者共同构成 Agent Loop 的健壮性要求。

2. **误区："面试追问就是刁难候选人，问到答不出来为止"** — 追问链的目标不是"难倒"候选人，而是精确定位其能力边界。好的追问过程应让候选人感到"被引导着思考"而非"被拷问"。面试官在候选人卡住时应提供线索（如"你有没有想过错误信息可以作为反馈？"），帮助其展示最佳水平。找到天花板后应及时停止，而非继续施压。

3. **追问："如果候选人在 L5 卡住了，你作为面试官会怎么引导？"** — 候选人卡住通常有两种情况。第一种是知道"重试"但不知道如何系统化，可引导："如果让 Agent 不仅重试，还要先分析为什么失败了，你会怎么设计？"——帮助候选人想到 Evaluator 概念。第二种是完全没接触过 Reflection，可降维引导："你自己写代码犯了错，思考过程是什么？先看报错、再分析原因、再修改——能不能让 Agent 也这样做？"如果引导后仍无法回答，说明能力边界在 L4-L5 之间，对应中级水平。

4. **追问："这条追问链如何适配不同级别（初级/中级/高级）的候选人？"** — 核心是调整"起点"和"天花板"。初级候选人从 L1 起，目标 L3，达到 L5 即超预期；中级从 L2 起，目标 L5-L6；高级从 L3 甚至 L5 起，目标 L8-L9；Staff 级别直接从 L5 起，期望完整回答到 L10。同一层级也可调整深度：对初级问"Agent Loop 是什么"，对高级问"你在生产中遇到过 Agent Loop 的哪些坑"——同是 L2 的问题，考察维度完全不同。

## 参考资料

- [Reflexion: Language Agents with Verbal Reinforcement Learning (Shinn et al., 2023)](https://arxiv.org/abs/2303.11366)
- [ReAct: Synergizing Reasoning and Acting in Language Models (Yao et al., 2023)](https://arxiv.org/abs/2210.03629)
- [Building Effective Agents (Anthropic Blog)](https://www.anthropic.com/engineering/building-effective-agents)
- [LLM Powered Autonomous Agents (Lilian Weng Blog)](https://lilianweng.github.io/posts/2023-06-23-agent/)
- [OWASP Top 10 for LLM Applications (OWASP Foundation)](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="109-what-is-agent-harness">

<h2 class="question-title"><span class="q-badge ai100-badge">Q10</span><span class="question-text">什么是 Agent Harness？与 Framework / Runtime 三层抽象有何区别？</span></h2>

**Cheat sheet**：
- **三层抽象（自下而上）**：LLM → Framework（积木） → Runtime（持久化执行） → Harness（装配好的代码 Agent）
- **Harness ≠ Framework**：opinionated vs unopinionated；前者只让你 customize 四件事（system prompt / tools / context / subagents）
- **Harness 最小抽象 6+1**：Loop / State / Tool / Memory / Hook / Skill +（Observability）
- **核心数据点**：Terminal Bench 2.0「harness > 模型」杠杆 —— 同模型不同 harness 排名差异 28 位
- **Post-training Coupling**：Codex 模型权重已绑定 `apply_patch` 工具签名，换 harness 等于丢能力



<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：Agent, AI100 · 考察点：AI100 · Agent 架构</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Agent Harness 是 2025-2026 年新晋的行业术语，指**"模型之外的一切"**——围绕固定 LLM 构建的、有强意见的运行壳：默认 system prompt、Tool Registry、Context 工程、Hook 生命周期、沙箱与权限模型全套打包。LangChain 官方在 2025-10 提出的三层抽象很好地厘清了边界：**Framework**（LangChain / CrewAI / OpenAI Agents SDK）给你"积木"；**Runtime**（LangGraph / Temporal / Inngest）给你"durable execution"；**Harness**（Claude Code / Codex CLI / Cline / Devin）给你"一辆装配好的车"。Parallel.ai 的实证数据点出 harness 大约决定 Agent 70% 的实战表现，Terminal Bench 2.0 上同一个 Claude Opus 4.6 换 harness 可从 #33 跳到 ~#5——这就是为什么 Devin 和 Claude Code 都不用 LangGraph 而要自研。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：- **误区 1：「Harness 就是另一种框架」** — 表面上都是"模型外面的代码"，但本质完全不同。Framework 是"unopinionated</div>
</div>

## 详细解析

### 一、三层抽象：从 LangChain 官方说起

LangChain 官方博文（2025-10）首次系统化提出 Agent 软件栈的三层分类，迅速成为 2026 业界共识：

```
┌──────────────────────────────────────────────────────────────┐
│ Harness (Claude Code / Codex CLI / Cline / Devin)            │
│ ──────────────────────────────────────────────────────────── │
│ Opinionated defaults: prompts / tools / context / sandbox    │
│ "拿来就能跑的代码 Agent"                                       │
├──────────────────────────────────────────────────────────────┤
│ Runtime (LangGraph / Temporal / Inngest)                     │
│ ──────────────────────────────────────────────────────────── │
│ Durable execution / streaming / HITL / 跨线程状态             │
│ "保证 Agent 不丢状态"                                          │
├──────────────────────────────────────────────────────────────┤
│ Framework (LangChain / CrewAI / OpenAI Agents SDK)           │
│ ──────────────────────────────────────────────────────────── │
│ Abstraction primitives / Agent / Tool / Chain / Handoff      │
│ "造 Agent 的积木"                                             │
├──────────────────────────────────────────────────────────────┤
│ LLM (Claude / GPT / Gemini)                                  │
└──────────────────────────────────────────────────────────────┘
```

**一句话区分**：
- Framework 教你"如何拼装 Agent"
- Runtime 让你"Agent 拼装好后跑得稳"
- Harness 直接给你"拼装好且调好性格的 Agent"

### 二、Harness 的最小完整抽象（6+1）

社区收敛出的 Harness 通用抽象（Addy Osmani、HumanLayer、atalupadhyay 三方一致）：

| 模块 | 职责 | Claude Code 中的实现 |
|------|------|---------------------|
| **Loop** | ReAct 主循环：reason → tool call → observe → repeat；终止条件 / 超时 / 用户中断 | 内置 agent loop，max_turns 可配 |
| **State / Context** | 消息历史 + token 预算 + compaction 策略 | 75% 自动 compact + Memory tool |
| **Tool** | 工具注册表 + schema + 执行沙箱 | 内置工具 + MCP server + Skill bash |
| **Memory** | 会话/项目级 append-only 日志 + flush/replay | CLAUDE.md + `~/.claude/projects/<id>/memory/` |
| **Hook** | 生命周期事件 pre/post 拦截 → 策略执行 | 12+ 事件，5 种 handler，PreToolUse 可硬拦 |
| **Skill** | Progressive disclosure 的领域知识包 | 三级懒加载（metadata / body / resources） |
| **Observability** | trace / replay / cost-latency 度量 | trace JSON + Anthropic Console |

**关键判断**：MCP 不是 Harness 的核心抽象（它是 Tool 层的一个 *实现* 选项），Slash Command 也不是（它是 Skill 的简化形式）。Harness 设计要回答的本质问题是：**用户能扩展什么、不能扩展什么？**

### 三、为什么 Devin / Claude Code 不用 LangGraph 而自研？

这是 2026 年最常被问的"反框架"问题，背后有四个硬约束：

#### 1. Post-training Coupling（模型权重绑死工具签名）

OpenCode 团队在适配 Codex 模型时发现一个关键事实：**Codex 模型在 post-training 阶段已经被 *绑定* 到 `apply_patch` 工具的语法**（HumanLayer / Cline 同步证实）。要让 Codex 在自家 harness 里发挥水平，必须 *模仿* Codex 的 `apply_patch` 签名。换句话说——**模型对 harness 工具签名的"偏好"会被冻进权重**。这就是"harness 不可随便换"的根本原因。

#### 2. 延迟敏感（每步 < 100ms 是产品底线）

ReAct 主循环每步开销 < 100ms 是代码 Agent 体验的硬标准。LangGraph 的多层抽象（state graph 序列化 / checkpointer 写盘 / event bus）很难压到这个水位，对话感会变"卡"。

#### 3. Hook / Sandbox 不可让渡

生产 Agent 必须：
- 拦截 `rm -rf` / `git push --force` 这类 destructive command（Hook）
- 隔离 `apply_patch` 执行避免污染主机（Sandbox）

这两类能力是"开箱即用"还是"自己写"，直接决定 Agent 能不能上生产。框架很难做到 opinionated 的 lifecycle hook + 多平台 sandbox。

#### 4. Trace 数据是核心 IP

Harness 厂商把 trace 数据用来 fine-tune 自家模型（Claude Code 之于 Anthropic、Codex CLI 之于 OpenAI、Cline 之于 Cline.bot）。这些数据是"模型与 harness 协同进化"的飞轮，没人愿意走第三方框架把数据让出去。

#### 实证数据：Terminal Bench 2.0 的「harness > 模型」杠杆

| 配置 | 排名 |
|------|------|
| Claude Opus 4.6 + 通用框架 | #33 |
| Claude Opus 4.6 + Claude Code | ~#5 |
| Claude Opus 4.7 + Cline CLI | 74.2%（超过 Claude Code 同模型 69.4%） |

**HumanLayer 金句**："**It's not a model problem. It's a configuration problem.**"

### 四、Framework vs Harness 的可视化对照

```
Framework（LangChain/CrewAI/Agents SDK）        Harness（Claude Code/Codex)
──────────────────────────────────────────      ─────────────────────────────────
- 给 abstraction primitives                     - 给 opinionated runtime
- 你自己写 loop / memory / hook / sandbox       - 你只 customize 4 件事:
- 学习曲线 = "如何用框架 API"                     · system prompt
- 适合 custom 工作流编排                          · tools
- 模型无关（理论上）                              · context (CLAUDE.md/AGENTS.md)
- 输出 = SDK 代码                                 · subagents
                                                - 学习曲线 = "如何调 harness"
                                                - 适合通用 Agent 任务
                                                - 模型耦合（post-training coupling）
                                                - 输出 = CLI / IDE 扩展
```

### 五、何时该用 Framework、Runtime、Harness？

```
我要解决什么问题？
│
├── 想给业务系统加点 LLM 能力（chatbot / 表单解析 / 路由）
│   └── 直接调 API 或用 Framework（LangChain Expression Language）
│
├── 想构建一个特定领域的 custom Agent（金融 / 医疗 / 自家产品）
│   └── Framework + Runtime（LangGraph 给 durable execution）
│
├── 想做"代码 Agent"或"通用电脑 Agent"
│   └── 套 Harness（Claude Code / Codex / Cline），按需扩展
│       Skill / Hook / Subagent，不要自己造轮子
│
└── 想做下一代 Harness（Cursor 那种产品级）
    └── 自研，但要回答：你的"opinionated default"是什么？
        差异化在哪？（参考 Cline SDK 2026-05 把 runtime 从 IDE 剥离的范式）
```

### 六、代码示例：感受 Harness 与 Framework 的"opinionated"差异

```python
# Framework 风格（LangGraph）：自己拼装一切
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.sqlite import SqliteSaver
from typing import TypedDict

class AgentState(TypedDict):
    messages: list
    next_step: str

def reason_node(state):
    # 自己决定怎么调 LLM、怎么解析输出、怎么决定下一步
    ...
    return {"messages": state["messages"] + [...], "next_step": "tool"}

def tool_node(state):
    # 自己实现工具调度、参数解析、错误处理
    ...

graph = StateGraph(AgentState)
graph.add_node("reason", reason_node)
graph.add_node("tool", tool_node)
graph.add_conditional_edges("reason", lambda s: s["next_step"])
# ... 你还要自己写: compaction / hook / sandbox / memory / observability


# Harness 风格（Claude Code，伪代码视角）：只配置 + 启动
# 用户视角：在项目根放一个 CLAUDE.md + .claude/ 目录
#
# .claude/
# ├── settings.json        # permission allowlist / hooks
# ├── hooks/
# │   └── pre-commit.sh    # 必须每次跑的 lint
# ├── skills/
# │   └── testing/SKILL.md # 写测试时按需加载
# └── agents/
#     └── reviewer.md      # subagent 定义
#
# 然后:
#   $ claude
# 即得到一个"懂你 repo、懂你工具、懂你流程"的代码 Agent
# loop / memory / sandbox / observability 全部 opinionated 内置
```

**核心洞察**：Framework 让你"造 Agent"；Harness 让你"开 Agent"。Harness 的"opinionated default"反过来是约束，但也是让你少写 80% 基建代码的捷径。

## 常见误区 / 面试追问

- **误区 1：「Harness 就是另一种框架」** — 表面上都是"模型外面的代码"，但本质完全不同。Framework 是"unopinionated 积木箱"，需要你自己拼装 loop / memory / hook；Harness 是"opinionated 装配好的车"，loop / memory / hook 全部内置，你只能在框架预留的扩展点（CLAUDE.md / Hook / Skill / Subagent）做定制。换言之，**Framework 给自由 + 责任，Harness 给约束 + 默认值**。

- **误区 2：「自研 Harness 是过度设计，直接用 LangGraph 就行」** — 对一般业务系统确实是过度设计，但对"代码 Agent / 通用电脑 Agent"这类需要 opinionated default + post-training coupling 的产品，框架抽象层会成为天花板。Devin / Claude Code / Codex / Cline 这些 SOTA 产品全部自研 harness 不是偶然。

- **误区 3：「换模型不需要换 harness」** — Post-training coupling 让模型与 harness 形成深度绑定。Codex 模型脱离 `apply_patch` 签名性能会掉，Claude Sonnet 在 Claude Code 与在通用 chat 中表现是两个性格。**模型与 harness 是一对深度耦合的系统**。

- **追问 1：「LangChain / OpenAI Agents SDK 算 Framework 还是 Harness？」** → 答：都是 Framework（LangChain 自家文档明确）。判断标准：是否给出 opinionated 默认 prompt + tool + sandbox + hook 全套？是否拿来就能跑出一个"有性格的 Agent"？LangChain / Agents SDK 不给默认 prompt 与默认 tool，所以是 Framework。DeepAgents（LangChain 2025-11 推出的 harness）才算 Harness。

- **追问 2：「Harness 与 SDK 是什么关系？」** → 答：SDK 是"客户端库"层面的概念（OpenAI Agents SDK、Claude Agent SDK），描述的是"如何调用 API 的 Python/TS 类库"；Harness 是"应用形态"层面的概念，描述的是"装配好的 Agent 产品"。Claude Code = harness，但底层用 Claude Agent SDK；Cursor = harness，底层有自家 Composer SDK。SDK 是 harness 的实现砖块之一。

- **追问 3：「『Harness > 模型』杠杆数据点出自哪里？怎么验证？」** → 答：出自 Terminal Bench 2.0（2026-Q1）。同一个 Claude Opus 4.6 在不同 harness 中跑分差距 28 个排名位次。可参考 Artificial Analysis 的 Coding Agents Leaderboard 持续追踪。这背后的机制是：harness 的 system prompt + tool 选择 + context 工程 + retry 策略 + sandbox 隔离五者协同作用，对单步 ReAct 的正确率有乘法效应。

- **追问 4：「Cline SDK 2026-05 为什么把 runtime 从 IDE 剥离？这意味着什么？」** → 答：意味着 Harness 进入"runtime 独立化"阶段。`@cline/sdk` 把 agent loop 从 VS Code 插件里彻底拆出，可在 CLI / Web / CI 任意 surface 上调用。这预示 2026-2027 行业方向：**Harness 从"单一产品形态"演化为"runtime + 多 surface 适配器"**——同一份 agent runtime 跑 IDE、跑终端、跑 CI、跑 Kanban。

## 参考资料

- [LangChain Blog — Agent Frameworks, Runtimes, and Harnesses](https://www.langchain.com/blog/agent-frameworks-runtimes-and-harnesses-oh-my) — 三层抽象的官方定义出处
- [Parallel.ai — What Is an Agent Harness?](https://parallel.ai/articles/what-is-an-agent-harness) — "everything except the LLM itself" 经典定义 + 70% 性能数据点
- [HumanLayer — Skill Issue: Harness Engineering for Coding Agents](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents) — "It's not a model problem. It's a configuration problem." 出处 + Post-training coupling 详解
- [Addy Osmani — Agent Harness Engineering](https://addyosmani.com/blog/agent-harness-engineering/) — Harness 6+1 抽象 + Ralph Loop / Sprint Contracts 高级模式
- [Cline Blog — Introducing the Cline SDK](https://cline.bot/blog/introducing-cline-sdk-the-upgraded-agent-runtime) — 2026-05 Runtime 与 IDE 解耦范式
- [atalupadhyay — The Agent Harness: What It Is, Why It Matters](https://atalupadhyay.wordpress.com/2026/05/02/the-agent-harness-what-it-is-why-it-matters-and-how-to-build-one-from-scratch/) — 从零构建 harness 的工程视角
- [Anthropic — Equipping Agents for the Real World with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) — Progressive Disclosure 与 Harness 中 Skill 抽象的关系
- [Artificial Analysis — Coding Agents Leaderboard](https://artificialanalysis.ai/agents/coding) — Terminal Bench 实时排行，「Harness > 模型」杠杆的持续证据
</div>
</details>

</div>

---

<div class="chapter-nav">

<a class="chapter-nav-link" href="/custom/ai100/">📑 总览</a>

<a class="chapter-nav-link chapter-nav-next" href="/custom/ai100/rag">🔍 RAG →</a>

</div>
