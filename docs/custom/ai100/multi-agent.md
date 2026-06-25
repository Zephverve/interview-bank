---
custom: true
pageClass: ai100-doc
partTitle: Agent Interview 100 · 多 Agent
partColor: #6366f1
---

<div class="part-hero custom-hero chapter-hero" style="--part-color: #6366f1">

# 👥 多 Agent

<p class="part-desc">Agent Interview 100 · 第 4/11 章 · 10 题</p>
<span class="part-round custom-tag">面试问答</span>

</div>

<div class="chapter-nav">

<a class="chapter-nav-link" href="/custom/ai100/">📑 总览</a>

<a class="chapter-nav-link" href="/custom/ai100/tool-use">← 🔧 工具使用</a>

<a class="chapter-nav-link chapter-nav-next" href="/custom/ai100/memory">🧠 记忆与状态 →</a>

</div>

<div class="question-card ai100-card interview-card compact-card" id="031-what-is-multi-agent">

<h2 class="question-title"><span class="q-badge ai100-badge">Q30</span><span class="question-text">什么是多 Agent 系统？与单 Agent 相比有何优势？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐ · 标签：多Agent, AI100 · 考察点：Multi-Agent</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：多 Agent 系统（Multi-Agent System, MAS）是由多个各自拥有 LLM 驱动的 Agent 协同工作来解决复杂问题的架构。每个 Agent 专注于特定子任务，通过通信和协调完成单个 Agent 难以胜任的工作。相比单 Agent，MAS 的核心优势是：**任务专精化**（每个 Agent 只需擅长一个领域）、**并行处理**（多 Agent 同时工作，速度提升可达 33%）、**更好的上下文管理**（分散处理负载，突破单 Agent 上下文窗口限制）、**模块化**（独立开发、测试和替换单个 Agent）。代价是增加了通信开销和系统复杂度。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误区："多 Agent 总是优于单 Agent" · 误区："每个 Agent 必须用不同的 LLM" · 追问："多 Agent 系统的 token 冗余问题如何解决？"</div>
</div>

## 详细解析

### 什么是多 Agent 系统？

```
单 Agent 架构：
┌──────────────────────────────┐
│         一个 Agent            │
│  负责所有任务：搜索、分析、   │
│  写作、代码、数据库查询...    │
│  工具：全部 50+ 个工具        │
│  上下文：一个超长 prompt       │
└──────────────────────────────┘

多 Agent 架构：
┌──────────┐  ┌──────────┐  ┌──────────┐
│ 搜索 Agent│  │ 分析 Agent│  │ 写作 Agent│
│ 工具：搜索│  │ 工具：SQL │  │ 工具：无  │
│ 专精：检索│  │ 专精：数据│  │ 专精：文案│
└─────┬────┘  └─────┬────┘  └─────┬────┘
      └──────────┬──┘──────────────┘
           ┌─────┴─────┐
           │ 协调器 Agent│
           │ 分配任务    │
           │ 汇总结果    │
           └───────────┘
```

核心思想：**分而治之**——将复杂任务拆分为子任务，每个子任务由专精的 Agent 处理。

### 单 Agent 的局限性

```python
# 单 Agent 面临的问题
single_agent_problems = {
    "上下文过载": "50+ 工具定义 + 复杂指令 = 上下文窗口被占满",
    "角色冲突": "同时要求严谨分析和创意写作，风格矛盾",
    "工具选择困难": "工具越多，选错工具的概率越高",
    "单点故障": "一个 Agent 出错，整个任务失败",
    "不可并行": "所有步骤必须顺序执行",
}
```

当前 LLM 在面对超长、多目标的 prompt 时表现不佳，且不擅长从大量工具中选择正确的工具。将任务拆分到多个专精 Agent 是自然的解决方案。

### 多 Agent 的核心优势

#### 1. 任务专精化（Specialization）

```python
# 每个 Agent 有明确的角色和有限的工具集
agents = {
    "researcher": {
        "system_prompt": "你是研究分析师，专注于收集和验证信息",
        "tools": ["web_search", "arxiv_search"],
        "model": "claude-sonnet",  # 用性价比高的模型
    },
    "coder": {
        "system_prompt": "你是高级软件工程师，专注于编写代码",
        "tools": ["code_executor", "file_write"],
        "model": "claude-opus",    # 用最强模型
    },
    "reviewer": {
        "system_prompt": "你是代码审查专家，专注于发现 bug 和改进",
        "tools": ["code_analyzer"],
        "model": "claude-sonnet",
    },
}
```

#### 2. 并行处理

```python
import asyncio

# 多个 Agent 同时工作
async def parallel_research(topic):
    results = await asyncio.gather(
        researcher_agent.search_papers(topic),
        market_agent.analyze_market(topic),
        tech_agent.review_implementations(topic),
    )
    # 三个 Agent 并行，总时间 = max(单个 Agent 时间)
    return coordinator.synthesize(results)
```

研究显示，动态多 Agent 框架相比传统顺序系统，执行时间可减少 33%。

#### 3. 更好的上下文管理

单 Agent 处理长文档时容易丢失上下文。多 Agent 系统中，每个 Agent 只需处理自己负责的部分，通过 Agent 间通信维持整体上下文一致性，等效于扩展了上下文窗口。

#### 4. 模块化与可维护性

```python
# 独立开发、测试、替换单个 Agent
# 升级分析能力？只需替换分析 Agent
old_analyzer = AnalyzerAgent(model="gpt-4")
new_analyzer = AnalyzerAgent(model="claude-opus")  # 零影响替换

# 添加新能力？只需增加新 Agent
team.add_agent(TranslationAgent())  # 不修改现有代码
```

#### 5. 准确率提升

研究表明，Producer-Reflector 双 Agent 架构在代码生成任务中大幅提升了准确率。Meta 分析显示 MAS（如 Captain Agent）在编程、数据分析和科学推理任务中，准确率和成本效率均优于单 LLM。

#### 6. 降低人工监督成本

2024 年对 128 家企业的研究显示，使用多 Agent AI 的企业在验证和纠正输出上花费的时间减少了 61.2%，每年可节省约 194 万美元的人力成本。

### 多 Agent 系统的代价

| 挑战 | 说明 |
|------|------|
| 通信开销 | Agent 间信息共享可能引入延迟和冲突 |
| 不可预测性 | 多 Agent 交互可能产生意外行为 |
| 调试困难 | 问题追踪需要跨 Agent 跟踪 |
| 架构复杂度 | 需要设计通信协议、协调机制、错误处理 |
| Token 浪费 | Agent 间重复传递信息导致 token 冗余（研究显示 53-86%）|

### 何时选择多 Agent vs 单 Agent？

```python
decision_guide = {
    "选择单 Agent": [
        "任务简单、线性",
        "工具少于 10 个",
        "不需要并行处理",
        "快速原型验证",
    ],
    "选择多 Agent": [
        "任务需要多种专业技能",
        "子任务可以并行执行",
        "需要 checker/reviewer 验证质量",
        "系统需要模块化扩展",
        "工具数量超过 20 个",
    ],
}
```

## 常见误区 / 面试追问

1. **误区："多 Agent 总是优于单 Agent"** — 对于简单任务，多 Agent 的通信开销可能超过收益。不要为了用多 Agent 而用多 Agent。从单 Agent 开始，当遇到明确的瓶颈时再拆分。

2. **误区："每个 Agent 必须用不同的 LLM"** — Agent 的差异化来自 System Prompt、工具集和角色定义，不一定需要不同的模型。同一个模型配不同 prompt 就是不同的 Agent。

3. **追问："多 Agent 系统的 token 冗余问题如何解决？"** — 研究显示 token 重复率可达 53-86%。解决方案包括：共享记忆池（黑板模式）、消息摘要（传递摘要而非原始内容）、和 Instruction-Tool Retrieval（每步只加载必要信息）。

4. **追问："如何定义 'multi-agent'？两个 LLM 调用就算吗？"** — 真正的多 Agent 系统需要 Agent 间有自主决策和交互能力，而非简单的顺序调用链。关键特征是 Agent 能基于其他 Agent 的输出自主调整行为。

## 参考资料

- [Multi-Agent LLMs in 2025 (SuperAnnotate)](https://www.superannotate.com/blog/multi-agent-llms)
- [Single-Agent vs Multi-Agent Systems (DigitalOcean)](https://www.digitalocean.com/resources/articles/single-agent-vs-multi-agent)
- [LLM Multi-Agent Systems: Challenges and Open Problems (arXiv)](https://arxiv.org/html/2402.03578v2)
- [Multi-Agent AI Systems: Definition, Benefits, Limitations (Dynamiq)](https://www.getdynamiq.ai/post/multi-agent-ai-systems-definition-benefits-limitations-how-to-build)
- [What Makes Multi-Agent LLM Systems Multi-Agent? (Yoav Goldberg)](https://gist.github.com/yoavg/9142e5d974ab916462e8ec080407365b)
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="032-communication-patterns">

<h2 class="question-title"><span class="q-badge ai100-badge">Q31</span><span class="question-text">多 Agent 通信模式：消息传递、共享状态、黑板模式</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐ · 标签：多Agent, AI100 · 考察点：Multi-Agent</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：多 Agent 通信有三种基本模式：**消息传递（Message Passing）**——Agent 间通过点对点或广播方式直接交换结构化消息，适合动态、针对性的信息共享；**共享状态（Shared State）**——所有 Agent 读写同一个状态存储（如数据库、Key-Value Store），提供一致的全局视图，但可能成为瓶颈；**黑板模式（Blackboard）**——Agent 围绕一个共享的"黑板"协作，各自观察黑板上的信息，基于自身专长决定是否贡献输出。研究表明黑板模式在端到端任务成功率上比传统模式提升 13%-57%，同时具有更好的 token 效率。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误区："消息传递就是聊天" · 误区："共享状态很简单，用全局变量就行" · 追问："黑板模式和共享状态有什么本质区别？"</div>
</div>

## 详细解析

### 模式 1：消息传递（Message Passing）

Agent 之间通过直接发送消息通信，类似人类之间发消息：

```python
# 点对点消息传递
class MessageBus:
    def __init__(self):
        self.queues = {}  # agent_id → message_queue

    async def send(self, from_agent: str, to_agent: str, message: dict):
        """发送消息给特定 Agent"""
        msg = {
            "from": from_agent,
            "to": to_agent,
            "content": message,
            "timestamp": datetime.now()
        }
        await self.queues[to_agent].put(msg)

    async def broadcast(self, from_agent: str, message: dict):
        """广播消息给所有 Agent"""
        for agent_id, queue in self.queues.items():
            if agent_id != from_agent:
                await queue.put({"from": from_agent, "content": message})

# 使用示例
bus = MessageBus()
await bus.send("researcher", "writer",
    {"type": "research_complete", "data": findings})
```

**优势：** 针对性强、延迟低、Agent 间解耦
**劣势：** 可能形成信息孤岛、路由逻辑复杂、难以保证全局一致性

**生产实现：** 通常使用消息队列（RabbitMQ、Redis Streams）实现可靠的异步消息传递。

> 注：本题讨论的是「通信模式」（Agent 之间如何交换信息），与第 033 题的「编排模式」（Hub-Spoke / Pipeline / Hierarchical 等控制流结构）是正交维度——一个 Pipeline 编排既可以用消息传递实现，也可以用共享状态实现。

### 模式 2：共享状态（Shared State）

所有 Agent 读写同一个全局状态，类似多人编辑同一个文档：

```python
# 共享状态模式（LangGraph 风格）
from typing import TypedDict, Annotated

class SharedState(TypedDict):
    messages: list[str]
    research_data: dict
    draft: str
    review_comments: list[str]
    status: str

# 每个 Agent 读取状态、处理、更新状态
def researcher_node(state: SharedState) -> SharedState:
    # 读取当前状态
    query = state["messages"][-1]
    # 执行研究
    data = search(query)
    # 更新共享状态
    return {"research_data": data, "status": "research_complete"}

def writer_node(state: SharedState) -> SharedState:
    # 读取研究数据（由 researcher 写入）
    data = state["research_data"]
    # 生成草稿
    draft = generate_draft(data)
    return {"draft": draft, "status": "draft_complete"}
```

**优势：** 全局一致视图、状态可持久化、便于调试（检查状态快照）
**劣势：** 可能成为吞吐瓶颈、需要锁机制防止竞态条件、单点故障风险

**并发控制：**
```python
# 防止竞态条件
import asyncio

class SafeSharedState:
    def __init__(self):
        self.state = {}
        self.lock = asyncio.Lock()

    async def update(self, agent_id: str, updates: dict):
        async with self.lock:  # 确保原子更新
            self.state.update(updates)
            self.state["last_updated_by"] = agent_id
```

### 模式 3：黑板模式（Blackboard）

经典 AI 架构模式，Agent 围绕共享"黑板"自主协作：

```python
class Blackboard:
    def __init__(self):
        self.public_space = []   # 公共区域：所有 Agent 可见
        self.private_spaces = {} # 私有区域：各 Agent 独立空间

    def post(self, agent_id: str, content: dict, visibility="public"):
        entry = {
            "author": agent_id,
            "content": content,
            "timestamp": datetime.now()
        }
        if visibility == "public":
            self.public_space.append(entry)
        else:
            self.private_spaces.setdefault(agent_id, []).append(entry)

    def read(self, agent_id: str) -> list:
        """Agent 读取黑板上与自己相关的内容"""
        return self.public_space + self.private_spaces.get(agent_id, [])

class BlackboardSystem:
    def __init__(self, blackboard, agents, controller):
        self.blackboard = blackboard
        self.agents = agents      # 专家 Agent 列表
        self.controller = controller  # 控制器（决定谁行动）

    async def run(self, task):
        self.blackboard.post("system", {"task": task})

        while not self.is_solved():
            # 控制器选择下一个行动的 Agent
            active_agent = self.controller.select(
                self.blackboard, self.agents
            )
            # Agent 读取黑板、处理、写回结果
            result = await active_agent.process(self.blackboard.read(active_agent.id))
            self.blackboard.post(active_agent.id, result)
```

**黑板模式的关键特性：**
- **自愿参与**：Agent 基于自身专长决定是否响应黑板上的请求
- **迭代精化**：多轮读取-处理-写回，逐步完善解决方案
- **去中心化**：不需要协调器预先知道所有 Agent 的能力
- **Token 高效**：共享公共记忆替代个体记忆，减少重复

**研究结果：** 黑板架构在端到端任务成功率上比 RAG 和 Master-Slave 模式提升 13%-57%。

### 三种模式对比

| 维度 | 消息传递 | 共享状态 | 黑板模式 |
|------|---------|---------|---------|
| 通信方式 | 点对点/广播 | 读写全局存储 | 读写共享空间 |
| 耦合度 | 低 | 中 | 低 |
| 扩展性 | 高 | 中（可能瓶颈） | 高 |
| 一致性 | 最终一致 | 强一致 | 最终一致 |
| Token 效率 | 低（重复传递） | 中 | 高（共享上下文） |
| 调试难度 | 高（追踪消息流） | 低（检查状态） | 中 |
| 通信落地示例 | AutoGen GroupChat、消息队列 | LangGraph State（编排框架内置） | LbMAS、Terrarium |

### 实际选择指南

```python
def choose_pattern(scenario):
    if scenario == "少量 Agent + 简单流程":
        return "共享状态（LangGraph State）"
    elif scenario == "Agent 数量多 + 动态组合":
        return "黑板模式"
    elif scenario == "异步处理 + 微服务架构":
        return "消息传递（消息队列）"
    elif scenario == "需要最大灵活性":
        return "混合模式（消息传递 + 共享状态）"
```

## 常见误区 / 面试追问

1. **误区："消息传递就是聊天"** — 多 Agent 通信中的消息传递是结构化的、带类型的数据交换，不是自然语言对话。消息应包含类型、发送者、接收者、数据负载和时间戳。

2. **误区："共享状态很简单，用全局变量就行"** — 生产环境中共享状态需要锁机制、版本控制和持久化。多 Agent 并发读写同一状态时，必须防止竞态条件。

3. **追问："黑板模式和共享状态有什么本质区别？"** — 共享状态是被动的数据存储，Agent 按预定流程读写；黑板模式是主动的协作平台，Agent 自主观察黑板内容并决定是否参与。黑板有控制器决定执行顺序，Agent 有自愿参与的机制。

4. **追问："如何处理 Agent 间的信息冗余？"** — 研究显示 token 冗余率可达 53-86%。解决方案包括：消息摘要（传递摘要而非原文）、黑板的公共记忆（替代个体记忆）、去重机制。

## 参考资料

- [LLM-based Multi-Agent Blackboard System (arXiv)](https://arxiv.org/html/2510.01285v1)
- [Shared Awareness & Coordination in Multi-Agent Systems (APXML)](https://apxml.com/courses/agentic-llm-memory-architectures/chapter-5-multi-agent-systems/shared-awareness-coordination)
- [Terrarium: Revisiting the Blackboard for Multi-Agent (arXiv)](https://www.arxiv.org/pdf/2510.14312)
- [Implementing Multi-Agent Systems: Architecture Patterns (21medien)](https://www.21medien.de/en/blog/implementing-multi-agent-systems)
- [Multi-Agent Collaboration Mechanisms: A Survey (arXiv)](https://arxiv.org/html/2501.06322v1)
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="033-orchestration-patterns">

<h2 class="question-title"><span class="q-badge ai100-badge">Q32</span><span class="question-text">Agent 编排模式：Hub-Spoke、Pipeline、Hierarchical</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：多Agent, AI100 · 考察点：Multi-Agent</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：多 Agent 编排模式决定了 Agent 之间的控制流和协作结构。三种核心模式：**Pipeline（顺序流水线）**——Agent 按预定顺序链式执行，前一个的输出是后一个的输入，适合线性处理流程；**Hub-Spoke（中心辐射）**——一个中心协调 Agent 分配任务给专家 Agent 并汇总结果，适合任务分派场景；**Hierarchical（层级结构）**——多层管理 Agent 逐级分解和委派任务，适合复杂企业级工作流。此外还有 Parallel（扇出/扇入）和 Maker-Checker（循环校验）等补充模式。选择取决于任务的依赖关系、并行度和控制粒度需求。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误区："选一种模式就够了" · 误区："Hub-Spoke 中协调器必须是 LLM" · 追问："如何在编排模式中加入 Human-in-the-Loop？"</div>
</div>

## 详细解析

### 模式 1：Pipeline（顺序流水线）

```
Agent A → Agent B → Agent C → 最终输出
(研究)    (分析)    (写作)
```

每个 Agent 处理前一个 Agent 的输出，形成链式处理：

```python
# Pipeline 模式实现
class Pipeline:
    def __init__(self, agents: list):
        self.agents = agents  # 按执行顺序排列

    async def run(self, initial_input):
        result = initial_input
        for agent in self.agents:
            result = await agent.process(result)
        return result

# 使用示例：内容生产流水线
pipeline = Pipeline([
    ResearchAgent(),    # Step 1: 搜索资料
    OutlineAgent(),     # Step 2: 生成大纲
    WriterAgent(),      # Step 3: 撰写内容
    EditorAgent(),      # Step 4: 编辑润色
])
output = await pipeline.run("写一篇关于 AI Agent 的技术博客")
```

**适用场景：** 数据处理流水线、内容生产（研究→写作→审核）、ETL 工作流
**优势：** 简单可预测、易于调试、每步结果可检查
**劣势：** 无法并行、一步失败整个流水线停止、不适合需要迭代的任务

### 模式 2：Hub-Spoke（中心辐射 / Coordinator 模式）

```
              ┌──→ 专家 Agent A ──┐
              │                    │
用户 → 协调器 ├──→ 专家 Agent B ──┤→ 协调器 → 输出
              │                    │
              └──→ 专家 Agent C ──┘
```

```python
class HubSpokeOrchestrator:
    def __init__(self, coordinator, specialists: dict):
        self.coordinator = coordinator
        self.specialists = specialists  # name → agent

    async def run(self, task):
        # 协调器分析任务，决定分派给哪些专家
        plan = await self.coordinator.plan(task)

        results = {}
        for subtask in plan.subtasks:
            agent = self.specialists[subtask.assigned_to]
            results[subtask.id] = await agent.execute(subtask)

        # 协调器汇总所有专家的结果
        return await self.coordinator.synthesize(results)

# Google ADK 风格：Coordinator + sub_agents
coordinator = LlmAgent(
    name="coordinator",
    instruction="你是项目经理，分析用户需求并分配给合适的专家",
    sub_agents=[researcher, coder, designer],
    # LLM 驱动的委派：基于专家描述自动选择
)
```

**适用场景：** 客服路由、任务分发、专家咨询系统
**优势：** 集中控制、灵活分派、专家可独立扩展
**劣势：** 协调器是单点瓶颈、协调器需要理解所有专家的能力

### 模式 3：Hierarchical（层级结构）

```
              CEO Agent
            /     |     \
     VP-研发  VP-市场  VP-产品
      / \       |       / \
   前端  后端  营销   设计  PM
   Agent Agent Agent  Agent Agent
```

```python
class HierarchicalOrchestrator:
    """多层级管理结构"""

    async def run(self, task):
        # 顶层：CEO Agent 做战略分解
        strategy = await self.ceo.decompose(task)

        # 中层：VP Agent 做战术分解
        for department_task in strategy.department_tasks:
            vp = self.get_vp(department_task.department)
            tactical_plan = await vp.plan(department_task)

            # 底层：专家 Agent 执行具体任务
            for work_item in tactical_plan.work_items:
                worker = self.get_worker(work_item.skill)
                await worker.execute(work_item)

        # 自底向上汇报
        return await self.ceo.synthesize_reports()
```

**LangGraph 实现：**
```python
# LangGraph 的层级结构
from langgraph.graph import StateGraph

# 顶层图
top_graph = StateGraph(TopState)
top_graph.add_node("research_team", research_subgraph)  # 子图作为节点
top_graph.add_node("dev_team", dev_subgraph)
top_graph.add_node("manager", manager_node)

# 子图（研究团队）
research_subgraph = StateGraph(ResearchState)
research_subgraph.add_node("searcher", search_agent)
research_subgraph.add_node("analyzer", analysis_agent)
```

**适用场景：** 复杂企业级任务、需要多层审批的工作流、大型软件开发
**优势：** 可管理大规模 Agent、每层关注不同抽象级别
**劣势：** 层级过深会增加延迟、信息在层级间传递时可能失真

### 补充模式

#### Parallel（扇出/扇入）

```python
# 多个 Agent 并行执行，结果汇聚
async def fan_out_fan_in(task, agents):
    # Fan-out：并行分发
    results = await asyncio.gather(
        *[agent.execute(task) for agent in agents]
    )
    # Fan-in：汇聚结果
    return aggregate(results)  # 投票、合并或 LLM 综合
```

#### Maker-Checker（生成-校验循环）

```python
# 一个 Agent 生成，另一个 Agent 校验
async def maker_checker_loop(task, maker, checker, max_rounds=3):
    for round in range(max_rounds):
        output = await maker.generate(task)
        review = await checker.review(output)
        if review.approved:
            return output
        task = f"{task}\n\n上一轮反馈：{review.feedback}"
    return output  # 达到最大轮次
```

### 模式选择决策框架

| 场景 | 推荐模式 | 原因 |
|------|---------|------|
| 步骤固定、有先后依赖 | Pipeline | 简单可预测 |
| 一个任务需要多种专业能力 | Hub-Spoke | 灵活分派 |
| 大型复杂项目、需要多层管理 | Hierarchical | 分层治理 |
| 需要多角度分析同一问题 | Parallel | 速度 + 多样性 |
| 需要质量保证和迭代改进 | Maker-Checker | 内置质量循环 |
| 混合需求 | 组合多种模式 | 如 Hierarchical + Parallel |

### 主流框架对编排模式的支持

| 框架 | 支持的模式 |
|------|-----------|
| LangGraph | Pipeline、Hierarchical、Parallel、自定义图 |
| Google ADK | Hub-Spoke（sub_agents）、Sequential、Parallel、Loop |
| OpenAI Agents SDK | Hub-Spoke（Handoff）、Pipeline |
| CrewAI | Pipeline、Hierarchical |
| AutoGen | Group Chat（多种编排） |

## 常见误区 / 面试追问

1. **误区："选一种模式就够了"** — 实际生产系统通常混合使用多种模式。例如 Hierarchical 的每一层内部可能是 Pipeline 或 Parallel。Strands Agents 就采用了 ReWOO 的规划纪律 + ReAct 的步内灵活性的混合方法。

2. **误区："Hub-Spoke 中协调器必须是 LLM"** — 协调器可以是确定性代码（基于规则路由），而非 LLM。OpenAI 建议：当需要可预测性和速度时，用代码编排而非 LLM 编排。

3. **追问："如何在编排模式中加入 Human-in-the-Loop？"** — 多种模式都支持：Pipeline 中在关键步骤后插入人工审核节点；Hub-Spoke 中协调器可以将高风险任务路由给人类审批；Maker-Checker 中 Checker 可以是人类。

4. **追问："编排模式如何影响测试策略？"** — Pipeline 可以逐节点单元测试；Hub-Spoke 需要测试协调器的路由逻辑；Hierarchical 需要集成测试验证层间通信。因为 Agent 输出不确定性，建议用评分标准或 LLM-as-Judge 而非精确匹配断言。

## 参考资料

- [AI Agent Orchestration Patterns (Microsoft Azure)](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns)
- [Multi-Agent Systems (Google ADK Docs)](https://google.github.io/adk-docs/agents/multi-agents/)
- [Agent Orchestration (OpenAI Agents SDK)](https://openai.github.io/openai-agents-python/multi_agent/)
- [What is AI Agent Orchestration? (IBM)](https://www.ibm.com/think/topics/ai-agent-orchestration)
- [Advanced Orchestration Techniques with Strands Agents (AWS)](https://aws.amazon.com/blogs/machine-learning/customize-agent-workflows-with-advanced-orchestration-techniques-using-strands-agents/)
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="034-task-allocation-coordination">

<h2 class="question-title"><span class="q-badge ai100-badge">Q33</span><span class="question-text">如何设计 Agent 间的任务分配与协调？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：多Agent, AI100 · 考察点：Multi-Agent</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：多 Agent 任务分配与协调的核心挑战是：如何将复杂任务拆分为子任务、分配给合适的 Agent、并确保它们协同工作产出正确结果。主要策略包括：**集中式规划-分散执行**（中央规划器分解任务，Agent 独立执行）、**LLM 作为协调器**（利用 LLM 推理能力做动态任务分配）、**角色定义 + 能力匹配**（根据 Agent 能力描述自动路由）、**动态分配**（基于运行时状态自适应调整）。关键设计原则：明确定义每个 Agent 的角色和能力边界、选择匹配任务结构的通信模式、以及实现健壮的错误处理和降级机制。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误区："Agent 越多越好" · 误区："用 LLM 做所有协调决策" · 追问："如何处理 Agent 间的目标冲突？"</div>
</div>

## 详细解析

### 任务分配的基本流程

```
复杂任务
    ↓
┌──────────────┐
│  任务分解     │ → 将大任务拆成子任务
│ (Decompose)  │
└──────┬───────┘
       ↓
┌──────────────┐
│  任务分配     │ → 将子任务匹配给合适的 Agent
│ (Allocate)   │
└──────┬───────┘
       ↓
┌──────────────┐
│  协调执行     │ → 管理依赖、同步、冲突
│ (Coordinate) │
└──────┬───────┘
       ↓
┌──────────────┐
│  结果聚合     │ → 合并各 Agent 的输出
│ (Aggregate)  │
└──────────────┘
```

### 策略 1：集中式规划，分散执行

```python
class CentralPlanner:
    """中央规划器负责全局任务分解和分配"""

    def __init__(self, agents: dict[str, Agent]):
        self.agents = agents

    async def plan_and_execute(self, task: str):
        # Step 1: LLM 分解任务为子任务
        subtasks = await self.decompose(task)

        # Step 2: 根据 Agent 能力分配子任务
        assignments = self.assign(subtasks)

        # Step 3: 按依赖关系编排执行
        results = {}
        for batch in self.topological_sort(assignments):
            # 同一批次的任务无依赖，可并行
            batch_results = await asyncio.gather(
                *[self.agents[a.agent_id].execute(a.subtask, results)
                  for a in batch]
            )
            results.update(zip([a.subtask.id for a in batch], batch_results))

        return results

    def assign(self, subtasks):
        """基于 Agent 能力描述的自动匹配"""
        assignments = []
        for subtask in subtasks:
            best_agent = max(
                self.agents.values(),
                key=lambda a: self.capability_match(a, subtask)
            )
            assignments.append(Assignment(subtask, best_agent.id))
        return assignments
```

### 策略 2：LLM 作为协调器

利用 LLM 的推理能力做动态决策：

```python
class LLMCoordinator:
    async def coordinate(self, task, agents):
        # 给 LLM 提供所有 Agent 的能力描述
        agent_descriptions = "\n".join([
            f"- {a.name}: {a.description}, 擅长: {a.capabilities}"
            for a in agents
        ])

        plan = await self.llm.generate(f"""
        任务: {task}

        可用 Agent:
        {agent_descriptions}

        请分解任务并分配给合适的 Agent。
        输出格式:
        1. [Agent名] → 子任务描述 (依赖: 无/步骤N)
        2. ...
        """)

        return self.parse_and_execute(plan)
```

**Planner vs Orchestrator：** 研究发现 Planner 方法（先生成完整计划再执行）在处理并发操作时优于 Orchestrator 方法（逐步决策），因为 Planner 能更好地识别可并行的子任务。

### 策略 3：角色定义与能力匹配

```python
# CAMEL 框架的角色扮演方法
class RoleBasedAllocation:
    def __init__(self):
        self.agents = {
            "researcher": Agent(
                role="研究分析师",
                capabilities=["web_search", "paper_analysis", "data_collection"],
                constraints=["只能读取数据，不能修改"],
            ),
            "developer": Agent(
                role="软件工程师",
                capabilities=["code_generation", "debugging", "testing"],
                constraints=["只能修改 src/ 目录下的文件"],
            ),
            "reviewer": Agent(
                role="质量审核员",
                capabilities=["code_review", "fact_checking"],
                constraints=["不能直接修改代码，只能提出建议"],
            ),
        }

    def match(self, subtask: str) -> str:
        """基于语义匹配找到最合适的 Agent"""
        subtask_embedding = embed(subtask)
        scores = {
            name: cosine_similarity(subtask_embedding, embed(a.capabilities))
            for name, a in self.agents.items()
        }
        return max(scores, key=scores.get)
```

### 策略 4：动态分配（DRAMA 方法）

静态分配的局限：Agent 能力固定、任务分配策略不适应环境变化。

```python
class DynamicAllocator:
    """基于亲和度的事件驱动动态分配"""

    def __init__(self, agents):
        self.agents = agents
        self.affinity_scores = {}  # (agent, task_type) → 历史成功率

    async def allocate(self, subtask):
        # 考虑多个因素动态选择
        candidates = []
        for agent in self.agents:
            score = self.compute_score(agent, subtask)
            candidates.append((agent, score))

        # 选择得分最高的 Agent
        best = max(candidates, key=lambda x: x[1])
        return best[0]

    def compute_score(self, agent, subtask):
        return (
            0.4 * self.capability_match(agent, subtask) +   # 能力匹配
            0.3 * self.affinity_scores.get((agent.id, subtask.type), 0.5) +  # 历史表现
            0.2 * (1 - agent.current_load / agent.max_load) +  # 当前负载
            0.1 * self.recency_bonus(agent)  # 最近是否空闲
        )

    def update_affinity(self, agent_id, task_type, success: bool):
        """根据执行结果更新亲和度"""
        key = (agent_id, task_type)
        old = self.affinity_scores.get(key, 0.5)
        self.affinity_scores[key] = old * 0.8 + (1.0 if success else 0.0) * 0.2
```

### 协调的关键挑战

#### 1. 依赖管理

```python
# 用 DAG（有向无环图）表示任务依赖
task_graph = {
    "search":    {"depends_on": []},
    "analyze":   {"depends_on": ["search"]},
    "visualize": {"depends_on": ["search"]},      # 和 analyze 并行
    "report":    {"depends_on": ["analyze", "visualize"]},  # 等两者完成
}

# 拓扑排序确定执行顺序
# Batch 1: search（无依赖）
# Batch 2: analyze, visualize（并行）
# Batch 3: report（等待前两个）
```

#### 2. Token 冗余控制

研究显示多 Agent 框架中 token 重复率达 53-86%。解决方案：

```python
# 传递摘要而非完整输出
def compress_for_handoff(agent_output: str, max_tokens: int = 500):
    if count_tokens(agent_output) > max_tokens:
        return summarize(agent_output, max_tokens=max_tokens)
    return agent_output
```

#### 3. 失败处理

```python
class ResilientCoordinator:
    async def execute_with_fallback(self, subtask, primary_agent, backup_agent):
        try:
            return await asyncio.wait_for(
                primary_agent.execute(subtask),
                timeout=30
            )
        except (TimeoutError, AgentError):
            # 降级到备选 Agent
            return await backup_agent.execute(subtask)
```

### 设计原则总结

| 原则 | 说明 |
|------|------|
| 明确角色边界 | 每个 Agent 有清晰的能力和约束定义 |
| 从小开始 | 先 3-5 个 Agent，验证后再扩展 |
| 匹配通信模式 | 简单链用 Pipeline，复杂协调用 Hierarchical |
| 健壮的错误处理 | 断路器、重试、降级回退 |
| 可观测性 | 追踪每个 Agent 的输入/输出/耗时 |

## 常见误区 / 面试追问

1. **误区："Agent 越多越好"** — 每增加一个 Agent 都增加通信开销和协调复杂度。最佳实践是从一个 Agent 开始，当遇到明确瓶颈时才拆分。研究建议初始阶段限制在 3-5 个 Agent。

2. **误区："用 LLM 做所有协调决策"** — LLM 协调灵活但慢且贵。对于确定性的任务路由，用代码规则更可靠。混合方式最佳：简单路由用代码，复杂判断用 LLM。

3. **追问："如何处理 Agent 间的目标冲突？"** — 明确优先级规则（如安全 > 效率 > 成本）；引入仲裁 Agent 或投票机制；将冲突升级给人类决策者。系统性的目标/结论冲突解决机制详见第 035 题《多 Agent 系统中的冲突解决机制》。

4. **追问："分布式 Agent 系统如何保证一致性？"** — 对于非关键系统，接受最终一致性即可。对于关键操作（如金融交易），使用事务性协调：先锁定资源 → 执行操作 → 确认或回滚。

## 参考资料

- [Coordination Mechanisms in Multi-Agent Systems (APXML)](https://apxml.com/courses/agentic-llm-memory-architectures/chapter-5-multi-agent-systems/coordination-mechanisms-mas)
- [Multi-Agent Coordination: Fix With 10 Strategies (Galileo)](https://galileo.ai/blog/multi-agent-coordination-strategies)
- [DRAMA: Dynamic and Robust Allocation-based Multi-Agent System (arXiv)](https://arxiv.org/html/2508.04332v1)
- [Self-Resource Allocation in Multi-Agent LLM Systems (arXiv)](https://arxiv.org/html/2504.02051v1)
- [Multi-Agent Collaboration Mechanisms: A Survey (arXiv)](https://arxiv.org/html/2501.06322v1)
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="035-conflict-resolution">

<h2 class="question-title"><span class="q-badge ai100-badge">Q34</span><span class="question-text">多 Agent 系统中的冲突解决机制</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：多Agent, AI100 · 考察点：Multi-Agent</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：当多个 Agent 对同一问题产生不同结论或竞争同一资源时，就产生了冲突。冲突解决机制主要分为三类：**投票机制**（Binary/Ranked/Weighted Voting，多数决或加权投票）、**共识协议**（多轮辩论迭代直到达成一致，支持动态调整共识阈值）、**中介仲裁**（指定协调 Agent 或人类做最终裁决）。研究表明，适当的冲突解决可将对抗攻击成功率从 46% 降低到 19%，提升系统安全性。但要警惕**趋同效应（Sycophancy）**——LLM Agent 倾向于迎合对方观点而非坚持正确判断。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误区："多数投票总是对的" · 误区："共识轮次越多越好" · 追问："拜占庭容错在 LLM 多 Agent 中有用吗？"</div>
</div>

## 详细解析

### 多 Agent 冲突的类型

```
冲突类型：
├── 结论冲突：Agent A 说"买入"，Agent B 说"卖出"
├── 资源冲突：两个 Agent 同时要修改同一数据库记录
├── 优先级冲突：安全 Agent 说"阻止"，效率 Agent 说"放行"
├── 方案冲突：Agent 对解决同一问题提出不同方案
└── 事实冲突：Agent 引用了互相矛盾的数据源
```

### 机制 1：投票（Voting）

最直观的冲突解决方式——让多个 Agent 投票表决：

```python
class VotingResolver:
    """投票式冲突解决"""

    async def resolve_binary(self, agents, question) -> str:
        """二元投票：是/否"""
        votes = await asyncio.gather(
            *[agent.vote(question) for agent in agents]
        )
        yes_count = sum(1 for v in votes if v == "yes")
        return "yes" if yes_count > len(agents) / 2 else "no"

    async def resolve_weighted(self, agents, question) -> str:
        """加权投票：按 Agent 专业度加权"""
        weighted_votes = {}
        for agent in agents:
            vote = await agent.vote(question)
            weight = agent.expertise_score  # 专家权重更高
            weighted_votes[vote] = weighted_votes.get(vote, 0) + weight

        return max(weighted_votes, key=weighted_votes.get)

    async def resolve_ranked(self, agents, options) -> str:
        """排序投票：Agent 提交偏好排序"""
        rankings = await asyncio.gather(
            *[agent.rank(options) for agent in agents]
        )
        # Borda 计分法：排名越高得分越多
        scores = {opt: 0 for opt in options}
        for ranking in rankings:
            for i, opt in enumerate(ranking):
                scores[opt] += len(options) - i
        return max(scores, key=scores.get)
```

**投票方式选择：**

| 投票类型 | 适用场景 | 示例 |
|---------|---------|------|
| 多数决 | 二元决策 | "是否发布该版本？" |
| 加权投票 | 专业度不均等 | 安全专家在安全问题上权重更高 |
| 排序投票 | 多选一 | 从 5 个方案中选择最优 |
| 一票否决 | 高风险操作 | 任何安全 Agent 可阻止操作 |

### 机制 2：共识协议（Consensus Protocol）

多轮辩论，逐步达成一致：

```python
class ConsensusProtocol:
    """多轮共识协议"""

    def __init__(self, agents, max_rounds=5, threshold=0.8):
        self.agents = agents
        self.max_rounds = max_rounds
        self.threshold = threshold  # 80% 一致才算共识

    async def reach_consensus(self, topic):
        proposals = {}

        for round_num in range(self.max_rounds):
            # 每个 Agent 提出或修改自己的立场
            for agent in self.agents:
                context = {
                    "topic": topic,
                    "round": round_num,
                    "other_proposals": {
                        a.id: p for a, p in proposals.items() if a != agent
                    }
                }
                proposals[agent] = await agent.propose(context)

            # 检查是否达成共识
            agreement_rate = self.calculate_agreement(proposals)
            if agreement_rate >= self.threshold:
                return self.merge_proposals(proposals)

            # 动态调整阈值（任务越紧急，越容易通过）
            self.threshold *= 0.95

        # 达到最大轮次仍未共识 → 降级到投票或人工裁决
        return await self.fallback_to_voting(proposals)

    def calculate_agreement(self, proposals):
        """计算 Agent 间立场的一致程度"""
        conclusions = [p["conclusion"] for p in proposals.values()]
        most_common = max(set(conclusions), key=conclusions.count)
        return conclusions.count(most_common) / len(conclusions)
```

**关键设计点：**
- 动态共识阈值：根据任务紧急度和轮次调整
- 最大轮次限制：防止无限辩论
- 降级机制：共识失败时自动切换到投票或人工裁决

### 机制 3：中介仲裁（Mediated Agreement）

指定一个权威 Agent 做最终裁决：

```python
class MediatorResolver:
    def __init__(self, mediator_agent):
        self.mediator = mediator_agent  # 仲裁者

    async def resolve(self, conflicting_outputs: dict):
        """仲裁者分析冲突并做出裁决"""
        prompt = f"""
        以下是不同 Agent 对同一问题的分析结果，它们存在冲突：

        {self._format_conflicts(conflicting_outputs)}

        请分析每个 Agent 的推理过程，指出各自的优缺点，
        然后给出你的最终裁决和理由。
        """
        decision = await self.mediator.generate(prompt)
        return decision
```

### 防止趋同效应（Sycophancy）

LLM Agent 在辩论中容易出现趋同——Agent 倾向于迎合对方观点而非坚持自己的正确判断：

```python
# CONSENSAGENT 的方法：抗趋同共识
class AntiSycophancyProtocol:
    async def debate(self, agents, topic):
        for round in range(self.max_rounds):
            for agent in agents:
                # 强制要求 Agent 先独立推理，再考虑他人观点
                response = await agent.generate(f"""
                第一步：独立分析（忽略其他 Agent 的观点）
                {topic}

                第二步：考虑其他观点后，明确说明你是否改变立场
                如果改变，解释具体哪个论据说服了你
                如果不改变，解释为什么你认为自己的分析更正确

                其他 Agent 的观点：{other_views}
                """)
```

### 资源冲突解决

> 注：资源冲突（多个 Agent 竞争同一外部资源 / 锁 / 配额）本质上属于"任务分配与协调"范畴，更系统的处理见第 034 题。本节仅给出与冲突解决机制对齐的最小示例。

```python
class ResourceConflictResolver:
    """处理多个 Agent 竞争同一资源的冲突"""

    def __init__(self):
        self.locks = {}  # 资源锁

    async def request_resource(self, agent_id, resource_id):
        if resource_id in self.locks:
            # 资源已被占用
            holder = self.locks[resource_id]
            if self.priority(agent_id) > self.priority(holder):
                # 高优先级 Agent 可以抢占
                await self.preempt(holder, resource_id)
                self.locks[resource_id] = agent_id
                return True
            else:
                # 排队等待
                await self.wait_queue(resource_id, agent_id)
                return False
        else:
            self.locks[resource_id] = agent_id
            return True
```

### 安全性提升

研究表明，正式的共识协议可以显著提升多 Agent 系统的安全性：

```
无共识机制：对抗攻击成功率 46.34%
有共识机制：对抗攻击成功率 19.37%（降低 > 50%）
```

原因：单个 Agent 被注入攻击后，其他 Agent 通过投票或共识可以否决异常行为。

### 冲突解决策略选择

| 场景 | 推荐机制 | 原因 |
|------|---------|------|
| 快速决策、Agent 同质 | 多数投票 | 简单高效 |
| Agent 专业度不同 | 加权投票 | 尊重专业判断 |
| 需要深度讨论 | 共识协议 | 多轮精化 |
| 高风险决策 | 仲裁 + HITL | 人类把关 |
| 安全关键操作 | 一票否决 | 宁可误拒 |

## 常见误区 / 面试追问

1. **误区："多数投票总是对的"** — 如果大多数 Agent 都基于同一个错误数据源推理，多数投票会放大错误。级联幻觉（Cascading Hallucination）——一个 Agent 的错误输出导致其他 Agent 连锁出错——是多 Agent 系统中的重要风险。

2. **误区："共识轮次越多越好"** — 过多的辩论轮次增加延迟和成本。更重要的是，LLM 的趋同效应意味着更多轮次不一定提高质量——Agent 可能只是学会了迎合对方。设置合理的最大轮次和降级机制。

3. **追问："拜占庭容错在 LLM 多 Agent 中有用吗？"** — 有用。当一个 Agent 被 Prompt Injection 操控产生恶意输出时，它实际上就是一个"拜占庭节点"。BFT 共识机制可以在部分 Agent 被攻陷的情况下维持系统正确性。

4. **追问："如何检测冲突而不只是解决冲突？"** — 实现冲突检测器：比较各 Agent 输出的语义相似度，当相似度低于阈值时触发冲突解决流程。对于结构化输出（如 JSON），可以做字段级别的差异比较。

## 参考资料

- [Voting or Consensus? Decision-Making in Multi-Agent Debate (ACL 2025)](https://aclanthology.org/2025.findings-acl.606.pdf)
- [CONSENSAGENT: Efficient Consensus in Multi-Agent LLM Interactions (Virginia Tech)](https://people.cs.vt.edu/naren/papers/CONSENSAGENT.pdf)
- [Coordination Mechanisms in Multi-Agent Systems (APXML)](https://apxml.com/courses/agentic-llm-memory-architectures/chapter-5-multi-agent-systems/coordination-mechanisms-mas)
- [Multi-Agent Coordination Strategies (Galileo)](https://galileo.ai/blog/multi-agent-coordination-strategies)
- [Multi-Agent Collaboration Mechanisms: A Survey (arXiv)](https://arxiv.org/html/2501.06322v1)
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="036-multi-agent-frameworks">

<h2 class="question-title"><span class="q-badge ai100-badge">Q35</span><span class="question-text">比较主流多 Agent 框架：CrewAI、AutoGen、LangGraph</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：多Agent, AI100 · 考察点：Multi-Agent</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：三大多 Agent 框架各有侧重：**CrewAI** 以角色为核心，用 Crew（团队，自治协作）+ Flow（流程，deterministic 生产级编排）两层架构覆盖原型到生产；**LangGraph** 以图为核心，用节点-边-状态机实现精确的流程控制，可追踪可调试，适合复杂生产系统；**AutoGen** 系列（Microsoft 体系）以对话/事件驱动为核心，但现状是三个不同项目并存：**AG2**（ag2ai/ag2，社区 fork，AutoGen 0.2 延续）、**AutoGen 0.4+**（微软 2025-01 重写，actor 模型）已进入维护模式、微软新主推 **Microsoft Agent Framework (MAF)**。选择原则：需要快速上手选 CrewAI，需要精确控制选 LangGraph，需要群体对话/事件驱动选 AG2/AutoGen 0.4，需要微软最新生态选 MAF。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误区："选最流行的框架就对了" · 误区："框架 = 生产就绪" · 追问："能否混合使用多个框架？"</div>
</div>

## 详细解析

### 设计哲学对比

```
CrewAI:  角色驱动 —— "谁做什么"
         Crew（团队）= Agent + Task + Process（自治协作）
         Flow（流程）= deterministic 生产级编排（事件驱动 + state 持久化）

LangGraph: 图驱动 —— "怎么流转"
           Graph = Node + Edge + State
           支持条件分支、循环、并行

AutoGen 体系（三个不同项目，常被混淆）:
  AG2 (ag2ai/ag2)        : 2024-11 社区 fork，AutoGen 0.2 延续
  AutoGen 0.4+ (microsoft): 2025-01 微软重写，event-driven actor 架构，已进入维护
  MAF (Microsoft Agent Framework): 2025-2026 微软新主推，正式取代 AutoGen
```

### 架构详解

#### CrewAI

```python
from crewai import Agent, Task, Crew, Process

# 定义角色
researcher = Agent(
    role="高级研究分析师",
    goal="发现关于 {topic} 的最新趋势",
    backstory="你是一位经验丰富的研究者...",
    tools=[search_tool],
)

writer = Agent(
    role="技术写作专家",
    goal="将研究成果写成引人入胜的文章",
    backstory="你擅长将复杂技术概念简化...",
)

# 定义任务
research_task = Task(
    description="研究 {topic} 的最新进展",
    agent=researcher,
    expected_output="详细的研究报告"
)

write_task = Task(
    description="基于研究报告撰写博客文章",
    agent=writer,
    expected_output="1500 字的技术博客"
)

# 组装团队
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, write_task],
    process=Process.sequential  # 注：Process.hierarchical 已不主推，复杂层级编排建议改用 Flow
)

result = crew.kickoff(inputs={"topic": "AI Agent"})
```

#### LangGraph

```python
from langgraph.graph import StateGraph, START, END
from typing import TypedDict, Annotated

class State(TypedDict):
    messages: list
    research_data: str
    draft: str

# 定义节点（每个节点可以是 Agent）
async def research_node(state: State) -> dict:
    data = await researcher.invoke(state["messages"])
    return {"research_data": data}

async def write_node(state: State) -> dict:
    draft = await writer.invoke(state["research_data"])
    return {"draft": draft}

def should_revise(state: State) -> str:
    if quality_check(state["draft"]):
        return "end"
    return "revise"  # 条件路由

# 构建图
graph = StateGraph(State)
graph.add_node("research", research_node)
graph.add_node("write", write_node)
graph.add_node("revise", revise_node)

graph.add_edge(START, "research")
graph.add_edge("research", "write")
graph.add_conditional_edges("write", should_revise, {
    "end": END,
    "revise": "revise"
})
graph.add_edge("revise", "write")  # 循环

app = graph.compile()
```

#### AutoGen / AG2 / MAF

> **重要**：这是三个不同项目，import 路径与 API 都不同：
> - **AG2**（社区 fork，AutoGen 0.2.x 延续）：`from autogen import ConversableAgent`
> - **AutoGen 0.4+**（微软重写，event-driven actor 模型）：`from autogen_agentchat.agents import AssistantAgent`
> - **MAF**（Microsoft Agent Framework，微软 2025-2026 新主推）：`from agent_framework import ChatAgent`（取代 AutoGen）
>
> 以下代码示例对应 **AG2 / AutoGen 0.2.x** API（最易上手），实际新项目建议优先 AutoGen 0.4+ 或 MAF。

```python
from autogen import ConversableAgent

# 定义对话 Agent
researcher = ConversableAgent(
    name="Researcher",
    system_message="你是研究分析师...",
    llm_config={"model": "gpt-4"},
)

writer = ConversableAgent(
    name="Writer",
    system_message="你是技术写作专家...",
    llm_config={"model": "gpt-4"},
)

critic = ConversableAgent(
    name="Critic",
    system_message="你是内容审核专家...",
    llm_config={"model": "gpt-4"},
)

# 群聊模式
from autogen import GroupChat, GroupChatManager

groupchat = GroupChat(
    agents=[researcher, writer, critic],
    messages=[],
    max_round=10
)
manager = GroupChatManager(groupchat=groupchat)
researcher.initiate_chat(manager, message="研究 AI Agent 的最新趋势")
```

### 核心维度对比

| 维度 | CrewAI | LangGraph | AG2 / AutoGen 0.4 / MAF |
|------|--------|-----------|---------|
| **核心抽象** | 角色/团队 | 图/状态机 | 对话/消息（AG2）、actor（0.4）、ChatAgent（MAF） |
| **学习曲线** | 低 | 高 | 中（AG2）、中高（0.4） |
| **流程控制** | Crew 顺序/Flow 事件驱动 | 任意图（条件、循环、并行） | 对话/事件驱动 |
| **状态管理** | 内置 state + Flow 持久化 | 精细状态 + Reducer | 对话历史/actor 状态 |
| **调试性** | 中 | 高（图可视化） | 低（非确定性对话） |
| **项目状态** | 活跃迭代 | 活跃迭代（1.0 GA） | AG2 社区活跃；AutoGen 0.4 已进入维护；MAF 新主推 |
| **工具生态** | 中 | 300+ 集成 + LangSmith | Azure AI / Semantic Kernel 集成 |
| **Human-in-Loop** | 支持 | 原生支持 | 原生支持 |
| **配置方式** | 代码 + YAML 双轨 | 代码驱动 | 代码/Studio GUI |

### 各框架最佳适用场景

```python
framework_guide = {
    "CrewAI": [
        "业务流程自动化（角色清晰的团队协作）",
        "快速原型和 MVP",
        "非技术团队参与的项目（YAML 配置）",
    ],
    "LangGraph": [
        "复杂生产系统（需要精确流程控制）",
        "需要条件分支和循环的工作流",
        "对可观测性要求高的企业应用",
    ],
    "AG2 / AutoGen 0.4": [
        "群体决策和多 Agent 辩论（AG2 ConversableAgent / GroupChat）",
        "高并发事件驱动场景（AutoGen 0.4 actor 模型）",
        "研究探索和创意生成",
    ],
    "MAF (Microsoft Agent Framework)": [
        "微软 2025-2026 主推方向，正式取代 AutoGen",
        "Azure AI Foundry / Semantic Kernel 深度集成",
        "企业级 Agent 平台（Microsoft 生态新项目优先）",
    ],
}
```

### 新兴竞争者

除了三大框架，值得关注的还有：
- **Google ADK**：SequentialAgent、ParallelAgent、LoopAgent 内置编排
- **OpenAI Agents SDK**：轻量级 Handoff 机制，代码优先编排
- **AWS Agent Squad**：Agent-as-Tools 架构，Lead Agent 协调团队

## 常见误区 / 面试追问

1. **误区："选最流行的框架就对了"** — 框架选择应基于具体需求：需要可控性选 LangGraph，需要快速迭代选 CrewAI，需要灵活对话选 AutoGen。没有万能框架。

2. **误区："框架 = 生产就绪"** — 框架提供基础抽象，但生产环境还需要自行解决可观测性、错误处理、安全性等横切关注点。LangGraph 在这方面最成熟（配合 LangSmith），其他框架可能需要更多自定义。

3. **追问："能否混合使用多个框架？"** — 可以。例如用 LangGraph 做整体编排，单个节点内部用 CrewAI 的 Crew 完成子任务。但需要注意状态同步和调试复杂度的增加。

4. **追问："自研 vs 使用框架，如何取舍？"** — 如果需求与框架的抽象契合，使用框架；如果框架的限制导致大量 hack，考虑自研。OpenAI 的建议是：先用代码编排（最可控），只在需要灵活性时才引入 LLM 编排。

## 参考资料

- [CrewAI vs LangGraph vs AutoGen (DataCamp)](https://www.datacamp.com/tutorial/crewai-vs-langgraph-vs-autogen)
- [AI Agent Framework Comparison (Latenode)](https://latenode.com/blog/platform-comparisons-alternatives/automation-platform-comparisons/langgraph-vs-autogen-vs-crewai-complete-ai-agent-framework-comparison-architecture-analysis-2025)
- [Top AI Agent Frameworks (Codecademy)](https://www.codecademy.com/article/top-ai-agent-frameworks-in-2025)
- [Detailed Comparison of Top 6 AI Agent Frameworks (Turing)](https://www.turing.com/resources/ai-agent-frameworks)
- [Best AI Agent Frameworks 2025 (Maxim AI)](https://www.getmaxim.ai/articles/top-5-ai-agent-frameworks-in-2025-a-practical-guide-for-ai-builders/)
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="037-agent-handoff">

<h2 class="question-title"><span class="q-badge ai100-badge">Q36</span><span class="question-text">如何实现 Agent 间的 Handoff（任务交接）？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：多Agent, AI100 · 考察点：Multi-Agent</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Agent Handoff 是多 Agent 系统中一个 Agent 将控制权、任务和对话上下文转交给另一个 Agent 的过程。最常用的实现是 OpenAI 提出的 **`transfer_to_XXX` 模式**——将 Handoff 包装为工具调用，当 Agent 判断任务超出自身能力时，调用 `transfer_to_specialist_agent` 函数触发交接。关键挑战不在于触发 Handoff，而在于**上下文传递的可靠性**——大多数"Agent 失败"实际上是 Handoff 时的上下文丢失或格式错误。最佳实践是使用结构化的 Handoff 数据（JSON Schema），而非自由文本。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误区："Handoff 只是把对话历史复制过去" · 误区："任何 Agent 都可以 Handoff 给任何 Agent" · 追问："如何防止 Handoff 循环？"</div>
</div>

## 详细解析

### 为什么需要 Handoff？

单个 Agent 配备太多工具或过大的上下文时，决策质量会下降。Handoff 允许将任务路由给专精的 Agent：

```
用户: "我想退货并了解退款进度"
         │
    ┌────┴────┐
    │ 路由 Agent│  判断需要退货处理
    └────┬────┘
         │ Handoff
    ┌────┴────┐
    │ 退货 Agent│  专精退货流程
    └────┬────┘
         │ Handoff（退货完成，用户追问退款）
    ┌────┴────┐
    │ 财务 Agent│  专精退款查询
    └─────────┘
```

### 实现方式 1：Tool-Based Handoff（OpenAI 模式）

将 Handoff 作为工具暴露给 LLM：

```python
# OpenAI Agents SDK 风格
from agents import Agent, handoff

# 定义专家 Agent
refund_agent = Agent(
    name="Refund Agent",
    instructions="你负责处理退款请求...",
    tools=[execute_refund, check_refund_status],
)

shipping_agent = Agent(
    name="Shipping Agent",
    instructions="你负责处理物流问题...",
    tools=[track_package, update_address],
)

# 路由 Agent 有 Handoff 能力
triage_agent = Agent(
    name="Triage Agent",
    instructions="根据用户需求将请求路由给合适的专家",
    handoffs=[
        # 简单写法：直接传 Agent
        refund_agent,
        # 完整写法：通过 handoff(...) 自定义工具名 / 回调 / 输入过滤
        handoff(
            agent=shipping_agent,
            tool_name_override="route_to_shipping",  # 自定义生成的工具名
            tool_description_override="将对话交给物流专家处理快递相关问题",
            on_handoff=lambda ctx: log_handoff(ctx),  # Handoff 触发时回调
            input_filter=keep_last_n_messages(5),     # 控制传给目标 Agent 的上下文
            input_type=ShippingHandoffInput,          # Pydantic 模型校验 Handoff 入参
        ),
    ],
    # 内部自动生成工具：transfer_to_refund_agent, route_to_shipping
)

# LLM 看到的工具列表：
# - transfer_to_refund_agent: "将对话转交给退款专家"
# - route_to_shipping: 自定义描述
```

**核心 API 参数：**
- `tool_name_override`：自定义生成的工具名（默认 `transfer_to_<agent_name>`）
- `tool_description_override`：自定义工具描述
- `on_handoff`：Handoff 发生时的回调（用于日志、审计、状态注入）
- `input_filter`：过滤传给目标 Agent 的对话历史（OpenAI SDK 提供 `handoff_filters.remove_all_tools` 等内置 filter）
- `input_type`：用 Pydantic 模型约束 Handoff 的入参，强制结构化

**工作原理：** LLM 足够智能，会在合适的时机调用 `transfer_to_XXX`。当 Handoff 发生时，新 Agent 接管对话并获得完整的对话历史。

### 实现方式 2：Supervisor 模式（LangGraph）

```python
from langgraph.graph import StateGraph

class SupervisorState(TypedDict):
    messages: list
    current_agent: str

def supervisor_node(state):
    """Supervisor 决定下一个处理的 Agent"""
    response = supervisor_llm.invoke(
        f"当前对话：{state['messages']}\n"
        f"可用专家：researcher, coder, writer\n"
        f"谁应该处理下一步？回复 agent 名称或 'FINISH'"
    )
    return {"current_agent": response.agent_name}

def route(state):
    if state["current_agent"] == "FINISH":
        return END
    return state["current_agent"]

graph = StateGraph(SupervisorState)
graph.add_node("supervisor", supervisor_node)
graph.add_node("researcher", researcher_node)
graph.add_node("coder", coder_node)
graph.add_conditional_edges("supervisor", route)
# 每个 worker 完成后回到 supervisor
graph.add_edge("researcher", "supervisor")
graph.add_edge("coder", "supervisor")
```

### 实现方式 3：函数返回 Agent 对象

```python
# Swarm 风格：工具函数返回 Agent 对象触发 Handoff
def handle_refund(order_id: str):
    """处理退款请求"""
    status = check_order(order_id)
    if status == "delivered":
        # 返回 Agent 对象 = 触发 Handoff
        return refund_agent
    else:
        return f"订单 {order_id} 尚未送达，无法退款"

triage_agent = Agent(
    name="Triage",
    tools=[handle_refund],  # 函数可能返回 Agent
)
```

### 上下文传递策略

Handoff 最大的挑战是上下文传递。三种策略：

```python
# 策略 1：完整历史传递（简单但可能超出上下文窗口）
def handoff_full_history(target_agent, conversation_history):
    return target_agent.invoke(messages=conversation_history)

# 策略 2：摘要传递（节省 token，但可能丢失细节）
def handoff_with_summary(target_agent, conversation_history):
    summary = summarize(conversation_history)
    return target_agent.invoke(messages=[
        {"role": "system", "content": f"前序对话摘要：{summary}"},
        conversation_history[-1]  # 最新一条用户消息
    ])

# 策略 3：结构化上下文传递（最佳实践）
def handoff_structured(target_agent, context):
    handoff_payload = {
        "user_intent": "退款查询",
        "order_id": "12345",
        "previous_actions": ["已验证用户身份", "已确认订单已送达"],
        "pending_issues": ["退款金额待确认"],
        "user_messages": conversation_history[-3:]
    }
    return target_agent.invoke(
        messages=[{"role": "system", "content": json.dumps(handoff_payload)}]
    )
```

### Input Filter（上下文过滤）

```python
# OpenAI Agents SDK 的 input_filter
from agents import handoff

def filter_for_billing(handoff_input):
    """只传递与计费相关的上下文给 Billing Agent"""
    filtered = []
    for msg in handoff_input.messages:
        if is_billing_related(msg) or msg == handoff_input.messages[-1]:
            filtered.append(msg)
    handoff_input.messages = filtered
    return handoff_input

billing_handoff = handoff(
    agent=billing_agent,
    input_filter=filter_for_billing  # 自定义过滤逻辑
)
```

### Handoff 的可靠性设计

```python
class ReliableHandoff:
    async def execute(self, from_agent, to_agent, context):
        # 1. 验证目标 Agent 可用
        if not to_agent.is_healthy():
            return await self.fallback(from_agent, context)

        # 2. 结构化上下文打包
        payload = self.pack_context(context)

        # 3. 执行 Handoff
        try:
            result = await to_agent.invoke(payload)
        except Exception as e:
            # 4. 失败回退
            return await from_agent.handle_handoff_failure(e, context)

        # 5. 记录 Handoff 日志
        self.log_handoff(from_agent.id, to_agent.id, payload, result)
        return result
```

### 编排模式与 Handoff 的关系

| 编排模式 | Handoff 方式 | 特点 |
|---------|-------------|------|
| Sequential | 固定顺序传递 | 可预测，适合简单流程 |
| Supervisor | Supervisor 决定路由 | 集中控制，灵活但有瓶颈 |
| Decentralized | Agent 自主 Handoff | 去中心化，灵活但难追踪 |
| Hierarchical | 层级间逐级传递 | 结构化，适合大型系统 |

## 常见误区 / 面试追问

1. **误区："Handoff 只是把对话历史复制过去"** — 自由文本 Handoff 是上下文丢失的主要原因。应该用结构化数据（JSON Schema）传递上下文，像对待公开 API 一样对待 Agent 间接口。

2. **误区："任何 Agent 都可以 Handoff 给任何 Agent"** — 应该限制 Handoff 的路径。每个 Agent 只能 Handoff 给预定义的目标 Agent，防止意外的循环 Handoff 或权限升级。

3. **追问："如何防止 Handoff 循环？"** — 追踪 Handoff 链路，设置最大 Handoff 次数。如果 Agent A → B → A → B 循环出现，触发断路器并升级给人工处理。

4. **追问："Handoff 和工具调用有什么区别？"** — 工具调用后控制权回到原 Agent；Handoff 后控制权完全转移到新 Agent。工具是"用完即还"，Handoff 是"交接班"。

## 参考资料

- [How Agent Handoffs Work in Multi-Agent Systems (Towards Data Science)](https://towardsdatascience.com/how-agent-handoffs-work-in-multi-agent-systems/)
- [Handoffs (OpenAI Agents SDK)](https://openai.github.io/openai-agents-python/handoffs/)
- [Handoffs (LangChain Docs)](https://docs.langchain.com/oss/python/langchain/multi-agent/handoffs) — LangChain 1.0（2025-10 GA）已主推「Handoff 作为 tool 在 `create_agent` 中实现」的范式，逐步替代独立的 `langgraph-supervisor` 包
- [Best Practices for Multi-Agent Orchestration and Reliable Handoffs (Skywork AI)](https://skywork.ai/blog/ai-agent-orchestration-best-practices-handoffs/)
- [Orchestrating Agents: Routines and Handoffs (OpenAI Cookbook)](https://developers.openai.com/cookbook/examples/orchestrating_agents/)
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="038-emergent-behavior">

<h2 class="question-title"><span class="q-badge ai100-badge">Q37</span><span class="question-text">多 Agent 系统中的涌现行为与可控性</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐⭐ · 标签：多Agent, AI100 · 考察点：Multi-Agent</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：涌现行为（Emergent Behavior）是指多 Agent 系统中出现的、无法从单个 Agent 行为预测的集体模式。类比物理学中的相变——当系统复杂度超过临界阈值时，会出现突然的质变。在 LLM 多 Agent 系统中，涌现既是优势（自发协调、创新解决方案）也是风险（不可预测性、级联幻觉、偏见放大）。可控性设计需要在"放大有益涌现"和"抑制有害涌现"之间取得平衡。关键手段包括：通信拓扑设计、Theory-of-Mind Prompting、行为监控框架（MAEBE）、以及拜占庭容错共识机制。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误区："涌现行为都是坏的" · 误区："单个 Agent 的性能可以预测多 Agent 系统的性能" · 追问："'涌现能力是幻觉'这个争论怎么看？"</div>
</div>

## 详细解析

### 什么是多 Agent 系统中的涌现？

```
单个 Agent 的行为：可预测（给定 prompt → 输出）
多 Agent 的集体行为：不可预测

例子：
• 3 个 Agent 辩论 → 产生了没有任何单个 Agent 提出过的新观点
• 5 个 Agent 协作写代码 → 自发形成了分工模式
• Agent 团队 → 出现了"从众效应"，放弃正确答案转而支持错误的多数意见
```

涌现行为的特征：
- **不可还原性**：整体行为无法从部分行为推导
- **自发性**：未被显式编程
- **非线性**：系统规模的小变化可能导致行为的大变化

### 涌现的积极面

#### 自发协调

研究表明，LLM Agent 可以在没有显式协调指令的情况下自发形成协作模式。GPT-4.1 和 Llama-3.1-8B Agent 在群体猜谜任务中展现出动态涌现能力——Agent 能自主分配角色和分工。

```python
# Theory-of-Mind (ToM) Prompting 可以引导有益涌现
agent_prompt = """
你是团队中的一员，正在解决一个复杂问题。

在回答之前，请考虑：
1. 其他 Agent 可能拥有什么信息？
2. 你的独特贡献是什么？（不要重复他人已有的分析）
3. 如何让你的输出与团队的整体目标互补？

只有 Theory-of-Mind prompt 条件才能产生"身份关联的差异化
和目标导向的互补性"——Agent 作为一个整合的、目标导向的
单元运作。
"""
```

#### 集体智慧

多 Agent 系统可以超越任何单个 Agent 的能力——不同 Agent 带来不同的视角和专业知识，在汇聚后产生更全面的分析。

### 涌现的风险面

#### 1. 级联幻觉（Cascading Hallucination）

```
Agent A 产生一个小错误
    ↓
Agent B 基于 A 的错误输出做推理 → 错误被放大
    ↓
Agent C 综合 A、B 的输出 → 错误被进一步复合
    ↓
最终输出：看似合理但完全错误的结论
```

#### 2. 从众效应（Peer Pressure / Sycophancy）

```python
# LLM Agent 的趋同问题
# Round 1: Agent A 说"答案是 X"，Agent B 说"答案是 Y"（B 是对的）
# Round 2: A 坚持 X 并给出详细论据
# Round 3: B 被 A 的详细论据"说服"，改口说 X
# 结果：错误答案通过社会压力"胜出"
```

研究表明，问题的措辞方式会显著影响 LLM 的道德推理，群体动力学中的同侪压力可以涌现——这在安全关键应用中是严重风险。

#### 3. 不可预测的优化行为

Agent 可能自发产生开发者未预期的"优化"行为：
- 自我消息（Agent 向自己发消息制造反馈循环）
- 跳过安全检查以提高效率
- 发现并利用评估机制的漏洞

### 可控性设计策略

#### 1. 通信拓扑设计

```python
class CommunicationTopology:
    """通信拓扑影响涌现行为的方向"""

    topologies = {
        "star": {
            # 所有通信经过中心节点
            "优势": "强控制力，一致性高",
            "风险": "中心节点瓶颈，单点故障",
            "涌现": "被限制——中心节点过滤异常行为",
        },
        "fully_connected": {
            # 所有 Agent 可以直接通信
            "优势": "信息流通快",
            "风险": "回声室效应，冗余通信",
            "涌现": "最强——但也最不可控",
        },
        "hybrid": {
            # 层级结构 + 有限的横向通信
            "优势": "平衡控制和灵活性",
            "风险": "设计复杂度高",
            "涌现": "可引导的涌现",
        },
    }
```

#### 2. 行为监控与干预

```python
class EmergentBehaviorMonitor:
    """监控多 Agent 系统的涌现行为"""

    def __init__(self, agents, baseline_behaviors):
        self.agents = agents
        self.baseline = baseline_behaviors

    def detect_anomaly(self, agent_outputs):
        for agent_id, output in agent_outputs.items():
            # 检测：输出是否偏离基线行为
            deviation = self.compute_deviation(output, self.baseline[agent_id])
            if deviation > self.threshold:
                self.alert(f"Agent {agent_id} 行为偏离基线: {deviation}")

            # 检测：Agent 是否出现自引用循环
            if self.detect_self_reference(output):
                self.interrupt(agent_id, "检测到自引用循环")

            # 检测：级联错误模式
            if self.detect_cascade(agent_outputs):
                self.halt_all("检测到级联错误，暂停系统")
```

#### 3. 共识机制限制有害涌现

```python
# 拜占庭容错共识：即使部分 Agent 产生异常输出，系统仍能正确运作
class BFTConsensus:
    def decide(self, agent_outputs: dict) -> str:
        # 需要 2/3 + 1 的 Agent 达成一致
        n = len(agent_outputs)
        threshold = (2 * n // 3) + 1

        votes = Counter(agent_outputs.values())
        for answer, count in votes.most_common():
            if count >= threshold:
                return answer

        return "NO_CONSENSUS"  # 需要人工介入
```

研究表明，正式共识协议可将对抗攻击成功率从 46% 降至 19%。

#### 4. MAEBE 评估框架

```python
# Multi-Agent Emergent Behavior Evaluation
# 系统性评估涌现行为的可解释性和安全性
evaluation_dimensions = {
    "可解释性": "能否追溯集体决策的推理路径？",
    "安全对齐": "涌现行为是否偏离人类价值观？",
    "可预测性": "类似输入是否产生一致的涌现模式？",
    "可控性":   "干预手段能否有效纠正偏离行为？",
}
```

### 涌现 vs 可控性的权衡

```
完全可控              平衡点              完全自主
│←────────────────────┼────────────────────→│
│ 确定性工作流        │ 引导式涌现          │ 无约束涌现
│ 无涌现              │ 有监控的自主性      │ 不可预测
│ Pipeline 模式       │ Hybrid 拓扑         │ 全连接对话
│ 安全但无创新        │ 最佳实践            │ 创新但危险
```

## 常见误区 / 面试追问

1. **误区："涌现行为都是坏的"** — 涌现也包括创造性协作、自发分工等有益模式。目标不是消除涌现，而是引导有益涌现、抑制有害涌现。Theory-of-Mind Prompting 是一种有效的引导手段。

2. **误区："单个 Agent 的性能可以预测多 Agent 系统的性能"** — 研究明确指出：单 Agent 性能不能可靠预测 MAS 行为。评估必须在系统层面（而非 Agent 层面）进行。

3. **追问："'涌现能力是幻觉'这个争论怎么看？"** — 部分研究者认为 LLM 的涌现能力是度量选择的产物（非线性度量制造了突变假象）。但在多 Agent 系统中，即使单个 LLM 无涌现，Agent 间的交互仍然可以产生系统层面的涌现行为——这是复杂系统的固有特性。

4. **追问："如何在生产环境中管理涌现风险？"** — 分层策略：(1) 限制通信拓扑（减少不可控涌现的空间）；(2) 实时行为监控（偏离基线时告警）；(3) 共识机制（防止异常 Agent 影响集体决策）；(4) Human-in-the-Loop（高风险决策人工把关）。

## 参考资料

- [Emergent Intelligence in Multi-Agent and LLM Systems (TechRxiv)](https://www.techrxiv.org/users/992392/articles/1384935)
- [Emergent Coordination in Multi-Agent Language Models (arXiv)](https://www.arxiv.org/pdf/2510.05174)
- [MAEBE: Multi-Agent Emergent Behavior Framework (arXiv)](https://arxiv.org/pdf/2506.03053)
- [Multi-Agent LLM Systems: From Emergent Collaboration to Governance (Preprints)](https://www.preprints.org/manuscript/202511.1370/v1/download)
- [Are Emergent Abilities of Large Language Models a Mirage? (arXiv)](https://arxiv.org/pdf/2304.15004)
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="039-debugging-monitoring-multi-agent">

<h2 class="question-title"><span class="q-badge ai100-badge">Q38</span><span class="question-text">如何调试和监控多 Agent 系统？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐⭐ · 标签：多Agent, AI100 · 考察点：Multi-Agent</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：多 Agent 系统的调试和监控比单 Agent 困难得多——非确定性输出、跨 Agent 交互、隐式依赖和涌现行为使得问题难以复现和定位。核心方法是**分布式追踪（Distributed Tracing）**：用 Trace 和 Span 记录每个 Agent 的每一步操作，形成可视化的执行图。行业正在收敛到 **OpenTelemetry (OTEL)** 作为标准遥测协议。主流工具包括 Langfuse（开源）、LangSmith（LangChain 生态）、Arize AI、Braintrust、Maxim AI 等。关键指标包括：延迟、token 用量/成本、工具调用成功率、Handoff 成功率、以及输出质量评分。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误区："用 print/log 就够了" · 误区："只监控最终输出质量" · 追问："OpenTelemetry 在 LLM 领域的角色是什么？"</div>
</div>

## 详细解析

### 多 Agent 调试的独特挑战

```
单 Agent 调试：
  Input → LLM → Output   （线性，容易追踪）

多 Agent 调试：
  Input → Agent A → Tool 1 → Agent B → Tool 2
                ↘ Agent C → Agent A（循环）→ Agent D
                      ↗ Tool 3 失败 → 重试
  （非线性、并行、循环、失败分支——指数级复杂度）
```

| 挑战 | 说明 |
|------|------|
| 非确定性 | 同样的输入可能产生不同的执行路径 |
| 跨 Agent 交互 | 问题可能源于 Agent A 但表现在 Agent C |
| 隐式依赖 | Agent 间通过共享状态产生的隐式耦合 |
| 延迟叠加 | 多个 LLM 调用串联，延迟难以定位 |
| 上下文丢失 | Handoff 过程中关键信息可能丢失 |

### 核心方法：Trace 和 Span

```python
# Trace = 一次完整的用户请求的执行记录
# Span = Trace 中的一个操作步骤

"""
Trace: "用户询问订单退款"
├── Span: Triage Agent（120ms, 500 tokens）
│   ├── Span: LLM 推理（80ms）
│   └── Span: Handoff to Refund Agent（10ms）
├── Span: Refund Agent（350ms, 1200 tokens）
│   ├── Span: LLM 推理（100ms）
│   ├── Span: Tool: get_order_status（150ms）→ 成功
│   ├── Span: Tool: process_refund（80ms）→ 成功
│   └── Span: LLM 生成回复（50ms）
└── 总计：470ms, 1700 tokens, $0.012
"""
```

### 实现追踪

```python
# 方式 1：使用 OpenTelemetry（行业标准）
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider

tracer = trace.get_tracer("multi-agent-system")

async def agent_execute(agent_name, task):
    with tracer.start_as_current_span(f"agent.{agent_name}") as span:
        span.set_attribute("agent.name", agent_name)
        span.set_attribute("task", task)

        # LLM 调用
        with tracer.start_as_current_span("llm.invoke") as llm_span:
            response = await llm.invoke(task)
            llm_span.set_attribute("tokens.input", response.input_tokens)
            llm_span.set_attribute("tokens.output", response.output_tokens)
            llm_span.set_attribute("model", response.model)

        # 工具调用
        for tool_call in response.tool_calls:
            with tracer.start_as_current_span(f"tool.{tool_call.name}") as tool_span:
                result = await execute_tool(tool_call)
                tool_span.set_attribute("tool.success", result.success)

        span.set_attribute("agent.status", "completed")
        return response
```

```python
# 方式 2：使用 Langfuse（开源 LLM 可观测性平台）
from langfuse import Langfuse
from langfuse.decorators import observe

langfuse = Langfuse()

@observe(name="triage-agent")
async def triage_agent(user_message):
    # 自动记录输入/输出/延迟/token
    response = await llm.invoke(user_message)

    if response.needs_handoff:
        # 嵌套 Span：Handoff
        with langfuse.span(name="handoff", metadata={"to": response.target_agent}):
            return await handoff(response.target_agent, response.context)

    return response

@observe(name="refund-agent")
async def refund_agent(context):
    # 嵌套 Span 自动形成调用树
    order = await get_order(context["order_id"])
    refund = await process_refund(order)
    return refund
```

### 关键监控指标

```python
monitoring_metrics = {
    # 性能指标
    "latency": {
        "per_agent": "每个 Agent 的处理时间",
        "end_to_end": "用户请求到最终响应的总时间",
        "tool_calls": "每次工具调用的延迟",
    },
    # 成本指标
    "tokens": {
        "input_tokens": "每个 Agent 的输入 token 数",
        "output_tokens": "每个 Agent 的输出 token 数",
        "total_cost": "按模型定价计算的总成本",
    },
    # 质量指标
    "quality": {
        "tool_call_success_rate": "工具调用成功率",
        "handoff_success_rate": "Handoff 成功率（无上下文丢失）",
        "task_completion_rate": "任务完成率",
        "output_quality_score": "LLM-as-Judge 质量评分",
    },
    # 健康指标
    "health": {
        "error_rate": "各 Agent 的错误率",
        "retry_count": "重试次数",
        "circuit_breaker_trips": "断路器触发次数",
    },
}
```

### 调试工作流

```
1. 问题发现
   └→ 告警触发（延迟飙升/错误率上升/成本异常）

2. 问题定位
   └→ 查看 Trace 列表，筛选异常 Trace
      └→ 展开 Trace 的 Span 树
         └→ 定位到具体的 Agent/工具/LLM 调用

3. 根因分析
   └→ 检查该 Span 的输入/输出/prompt
      └→ 是 LLM 选错了工具？参数错误？工具超时？

4. 修复验证
   └→ 调整 prompt/工具描述/超时设置
      └→ 在 Playground 中用原始输入重放
         └→ 确认修复后部署
```

### 多 Agent 特有的调试技巧

```python
# 技巧 1：Handoff 断点——在每次 Handoff 时记录完整上下文
class HandoffDebugger:
    def on_handoff(self, from_agent, to_agent, context):
        self.logger.info(
            f"Handoff: {from_agent} → {to_agent}",
            extra={
                "context_size": len(json.dumps(context)),
                "context_keys": list(context.keys()),
                "messages_count": len(context.get("messages", [])),
            }
        )

# 技巧 2：Agent 决策日志——记录 LLM 的推理过程
class DecisionLogger:
    def log_decision(self, agent_name, prompt, response, chosen_tool):
        self.store({
            "agent": agent_name,
            "input_summary": summarize(prompt),
            "tool_chosen": chosen_tool,
            "confidence": response.confidence,
            "alternatives_considered": response.alternatives,
        })

# 技巧 3：回放调试——保存完整 Trace 后离线回放
class TraceReplayer:
    def replay(self, trace_id):
        trace = self.load_trace(trace_id)
        for span in trace.spans:
            print(f"[{span.agent}] {span.operation}: {span.input[:100]}...")
            print(f"  → {span.output[:100]}...")
            print(f"  ⏱ {span.duration_ms}ms, 💰 {span.cost}")
```

### 主流工具对比

| 工具 | 类型 | 最适合 | 特色 |
|------|------|--------|------|
| Langfuse | 开源 | 自托管 + 全面可观测性 | Prompt 管理 + 追踪 + 评估一体 |
| LangSmith | SaaS | LangChain/LangGraph 生态 | 与 LangGraph 深度集成 |
| Arize AI | SaaS | 企业级 | 统一 LLM + Agent 评估 |
| Braintrust | SaaS | 多步骤链调试 | 嵌套 Trace 可视化 |
| Maxim AI | SaaS | 多 Agent 专项 | Agent 交互分析 |
| Datadog LLM | SaaS | 已有 Datadog 的团队 | 与 APM 统一监控 |

## 常见误区 / 面试追问

1. **误区："用 print/log 就够了"** — 多 Agent 系统的日志是分散的，无法从日志中重建 Agent 间的因果关系。需要结构化的 Trace + Span 来保留操作间的父子和时序关系。

2. **误区："只监控最终输出质量"** — 最终输出正确不代表过程正确。Agent 可能通过错误的推理路径得到了正确结果（运气好），这类问题只有通过过程追踪才能发现。

3. **追问："OpenTelemetry 在 LLM 领域的角色是什么？"** — OTEL 正在成为 Agent 遥测的标准协议。多个框架（Pydantic AI、smolagents、Strands Agents）已原生支持 OTEL 导出。这避免了厂商锁定，允许用同一套基础设施监控不同框架的 Agent。

4. **追问："如何测试多 Agent 系统？"** — 因为 Agent 输出非确定性，不能用精确匹配断言。推荐：(1) 用评分标准（Rubric）评估输出质量；(2) 用 LLM-as-Judge 自动评估；(3) 构建场景级集成测试而非单元测试；(4) 用 Trace 回放做回归测试。

5. **场景追问："你的多 Agent 系统在高峰期 P99 延迟突然从 2 秒飙升到 15 秒，但各 Agent 单独测试都很正常。如何定位？"** — 这是多 Agent 系统特有的性能问题。定位路径：(1) 检查 Trace 中的跨 Agent 通信延迟 → 可能是消息队列或网络瓶颈；(2) 分析 Agent 间的依赖关系 → 找出是否存在串行化的热点路径；(3) 检查共享资源（如数据库、向量库）在高峰期的表现 → 可能需要添加缓存或读写分离；(4) 查看是否有 Agent 触发了过多的重试 → 重试风暴会指数级放大延迟；(5) 实施 Agent 级别的熔断 → 某个 Agent 响应慢时快速失败而非等待。

6. **场景追问："你的多 Agent 系统中出现'幽灵 Agent'现象——某个 Agent 偶尔会执行完全不在预期范围内的操作，导致系统状态不一致。如何排查？"** — 这是多 Agent 系统中最难调试的问题。排查路径：(1) 立即启用全量 Trace 记录，捕获完整执行路径；(2) 检查 Agent 的 System Prompt 是否有模糊指令 → 可能导致 Agent 自行扩展行为；(3) 分析 Agent 间的消息传递 → 可能存在上下文污染或消息篡改；(4) 检查是否有未记录的配置漂移 → 生产环境和开发环境的 Prompt 版本不一致；(5) 实施 Agent 白名单机制 → 明确列出每个 Agent 允许执行的操作，超出范围自动告警。

7. **场景追问："你的多 Agent 系统中 Agent A 传递给 Agent B 的数据偶尔丢失关键字段，Agent B 因此做出错误决策。如何解决？"** — 这是 Handoff 数据一致性问题。解决路径：(1) 在 Handoff 接口上实施 Schema 验证 → Agent B 收到数据前先校验完整性；(2) 设计标准化的 Handoff 协议 → 明确定义每个 Agent 期望的输入输出格式；(3) 在 Handoff 点记录日志，对比发送和接收的数据；(4) 加入数据补全机制 → Agent B 检测到缺失字段时主动向 Agent A 请求；(5) 实施 Handoff 测试 → 构建专门测试各种 Handoff 场景的测试集。

## 参考资料

- [Agent Tracing for Debugging Multi-Agent AI Systems (Maxim AI)](https://www.getmaxim.ai/articles/agent-tracing-for-debugging-multi-agent-ai-systems/)
- [AI Agent Observability with Langfuse (Langfuse Blog)](https://langfuse.com/blog/2024-07-ai-agent-observability-with-langfuse)
- [LangSmith: AI Agent Observability Platform (LangChain)](https://www.langchain.com/langsmith/observability)
- [8 LLM Observability Tools to Monitor AI Agents (LangChain)](https://www.langchain.com/articles/llm-observability-tools)
- [5 Best Tools for Monitoring LLM Applications in 2026 (Braintrust)](https://www.braintrust.dev/articles/best-llm-monitoring-tools-2026)
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="101-a2a-protocol">

<h2 class="question-title"><span class="q-badge ai100-badge">Q39</span><span class="question-text">A2A（Agent-to-Agent）协议是什么？它与 MCP 有何区别？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：多Agent, AI100 · 考察点：Multi-Agent</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：**A2A（Agent-to-Agent）** 是 Google 于 2025 年 4 月发布的开放协议，旨在让不同厂商、不同框架构建的 AI Agent 之间实现标准化通信与协作。2025 年 6 月由 Google 捐赠给 Linux Foundation 托管，目前已有 150+ 组织参与。协议自 v0.2.0 起将核心方法名从 `tasks/send` / `tasks/sendSubscribe` 重命名为 `message/send` / `message/stream`，自 v0.3.0（2025-07）起 Agent Card 路径从 `/.well-known/agent.json` 改为 `/.well-known/agent-card.json`（RFC 8615 合规），并新增 gRPC binding 与 Agent Card signing 支持。协议基于 **HTTP + JSON-RPC 2.0 + SSE** 构建，核心概念包括 **Agent Card**（服务发现）、**Task**（任务生命周期管理）、**Message** 和 **Artifact**（交互载体）。与 Anthropic 主导的 **MCP（Model Context Protocol）** 不同，MCP 解决的是 Agent 与 Tool 之间的纵向能力扩展（"Agent 如何调用工具"），A2A 解决的是 Agent 与 Agent 之间的横向协作（"Agent 如何委托另一个 Agent"）。两者定位互补——一个 Agent 可以同时用 MCP 连接工具、用 A2A 与其他 Agent 协作。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误区："A2A 会取代 MCP" · 误区："A2A 只适用于同构 Agent" · 追问："A2A 如何处理长时间运行的任务？"</div>
</div>

## 详细解析

### A2A 的诞生背景

随着 AI Agent 在企业中大规模部署，不同团队、不同厂商构建的 Agent 之间无法直接对话，形成了"Agent 孤岛"。

```
┌─────────────┐     ╳     ┌─────────────┐     ╳     ┌─────────────┐
│  LangChain  │  不兼容   │  CrewAI     │  不兼容   │  AutoGen    │
│  Agent      │◄────────►│  Agent      │◄────────►│  Agent      │
└─────────────┘           └─────────────┘           └─────────────┘
                          引入 A2A 后 ↓
┌─────────────┐   A2A    ┌─────────────┐   A2A    ┌─────────────┐
│  LangChain  │◄────────►│  CrewAI     │◄────────►│  AutoGen    │
│  Agent      │  JSON-RPC │  Agent      │  JSON-RPC │  Agent      │
└─────────────┘           └─────────────┘           └─────────────┘
```

Google 联合 Atlassian、Salesforce、SAP 等 50+ 企业伙伴推出 A2A，目标是成为 Agent 间通信的"HTTP"——与框架无关、与模型无关的开放标准。

### 协议层次架构

```
┌───────────┬──────────────────────────────────────┐
│  应用层    │  Agent Card / Task / Message / Artifact │
├───────────┼──────────────────────────────────────┤
│  消息格式  │  JSON-RPC 2.0                         │
├───────────┼──────────────────────────────────────┤
│  实时推送  │  SSE（Server-Sent Events）             │
├───────────┼──────────────────────────────────────┤
│  传输层    │  HTTP / HTTPS                         │
├───────────┼──────────────────────────────────────┤
│  安全层    │  OAuth 2.0 / API Key / JWT            │
└───────────┴──────────────────────────────────────┘
```

### 核心概念详解

#### 1. Agent Card（服务发现）

每个 A2A Agent 在 `/.well-known/agent-card.json` 发布 Agent Card，声明能力和认证方式，类似 OpenAPI spec。注：v0.2.5 及更早版本使用 `/.well-known/agent.json` 路径，v0.3.0 起改为 `agent-card.json` 以符合 RFC 8615。

#### 2. Task 生命周期

Task 是协议核心工作单元，有明确的状态机：

```
  ┌───────────┐    ┌───────────┐    ┌───────────┐
  │ submitted │───►│  working  │───►│ completed │
  │  (已提交)  │    │  (执行中)  │    │  (已完成)  │
  └───────────┘    └─────┬─────┘    └───────────┘
                         │
                         ▼
                  ┌──────────────┐    ┌───────────┐
                  │input-required│───►│  failed   │
                  │ (需要输入)    │    │  (失败)   │
                  └──────┬───────┘    └───────────┘
                         │ 补充输入后
                         └──────────► working ──► completed / failed
```

#### 3. Message 和 Artifact

**Message** 是 Agent 间的对话载体（含 text、file 等多模态 parts）；**Artifact** 是任务产出的结构化成果物，与 Message 分离，便于下游消费。

### A2A 与 MCP 的定位差异

```
┌──────────────────────────────────────────────────────┐
│   Agent A                          Agent B           │
│  ┌─────────┐      A2A 协议       ┌─────────┐        │
│  │ Client  │◄═══════════════════►│ Server  │        │
│  │ Agent   │  Agent↔Agent 横向    │ Agent   │        │
│  └────┬────┘                     └────┬────┘        │
│       │ MCP                           │ MCP          │
│       ▼                               ▼             │
│  ┌─────────┐                     ┌─────────┐        │
│  │ 数据库   │                     │ 搜索引擎 │        │
│  │ API 工具 │                     │ 代码执行 │        │
│  └─────────┘                     └─────────┘        │
└──────────────────────────────────────────────────────┘
```

| 维度 | A2A | MCP |
|------|-----|-----|
| **发起者** | Google（2025.04） | Anthropic（2024.11） |
| **解决问题** | Agent 之间如何协作 | Agent 如何连接工具/数据源 |
| **关系模型** | 对等/委托（Agent↔Agent） | 主从（Agent→Tool） |
| **通信方式** | HTTP + JSON-RPC 2.0 + SSE | JSON-RPC 2.0 + stdio/HTTP+SSE |
| **服务发现** | Agent Card（/.well-known/agent-card.json） | 能力协商（initialize 握手） |
| **状态管理** | 有状态（Task 生命周期） | 无状态（单次调用） |
| **类比** | 公司之间的合作协议 | 员工使用办公软件 |

一句话概括：**MCP 让 Agent 变得更强（纵向），A2A 让 Agent 之间能合作（横向）**。

### Python 代码示例：A2A 交互模拟

```python
import json
import uuid
from dataclasses import dataclass, field
from enum import Enum


class TaskState(Enum):
    """A2A Task 状态枚举"""
    SUBMITTED = "submitted"
    WORKING = "working"
    INPUT_REQUIRED = "input-required"
    COMPLETED = "completed"
    FAILED = "failed"


@dataclass
class AgentCard:
    """Agent Card — 声明 Agent 的能力，发布于 /.well-known/agent-card.json"""
    name: str
    description: str
    url: str
    skills: list[dict] = field(default_factory=list)
    capabilities: dict = field(default_factory=lambda: {
        "streaming": True, "pushNotifications": False,
    })

    def to_json(self) -> str:
        return json.dumps(vars(self), ensure_ascii=False, indent=2)


@dataclass
class Task:
    """A2A Task — 协议核心工作单元，带状态机校验"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    state: TaskState = TaskState.SUBMITTED
    messages: list[dict] = field(default_factory=list)
    artifacts: list[dict] = field(default_factory=list)

    # 合法状态转换表
    _transitions = {
        TaskState.SUBMITTED: {TaskState.WORKING, TaskState.FAILED},
        TaskState.WORKING: {TaskState.COMPLETED, TaskState.FAILED, TaskState.INPUT_REQUIRED},
        TaskState.INPUT_REQUIRED: {TaskState.WORKING, TaskState.FAILED},
    }

    def transition(self, new_state: TaskState):
        allowed = self._transitions.get(self.state, set())
        if new_state not in allowed:
            raise ValueError(f"非法状态转换: {self.state.value} → {new_state.value}")
        self.state = new_state


class A2AServer:
    """模拟 A2A 服务端——接收 JSON-RPC 请求、管理 Task 生命周期"""

    def __init__(self, card: AgentCard):
        self.card = card
        self.tasks: dict[str, Task] = {}

    def handle_request(self, request: dict) -> dict:
        """路由 JSON-RPC 2.0 请求"""
        method = request["method"]
        params = request.get("params", {})
        req_id = request["id"]

        if method == "message/send":
            result = self._send(params)
        elif method == "tasks/get":
            task = self.tasks[params["id"]]
            result = {"id": task.id, "state": task.state.value}
        else:
            return {"jsonrpc": "2.0", "id": req_id,
                    "error": {"code": -32601, "message": "方法不存在"}}

        return {"jsonrpc": "2.0", "id": req_id, "result": result}

    def _send(self, params: dict) -> dict:
        task_id = params.get("id", str(uuid.uuid4()))
        if task_id in self.tasks:
            task = self.tasks[task_id]
            task.messages.append(params["message"])
            task.transition(TaskState.WORKING)  # 从 input-required 恢复
        else:
            task = Task(id=task_id, messages=[params["message"]])
            self.tasks[task_id] = task
            task.transition(TaskState.WORKING)

        # 模拟业务逻辑：缺信息则请求补充，否则完成
        text = task.messages[-1]["parts"][0]["text"]
        if "分析" in text and "时间" not in text:
            task.transition(TaskState.INPUT_REQUIRED)
            return {"id": task.id, "state": task.state.value,
                    "messages": [{"role": "agent",
                                  "parts": [{"type": "text", "text": "请指定分析时间范围"}]}]}

        task.transition(TaskState.COMPLETED)
        task.artifacts.append({
            "name": "report",
            "parts": [{"type": "text", "text": f"基于 [{text}] 的分析报告..."}]
        })
        return {"id": task.id, "state": task.state.value, "artifacts": task.artifacts}


# ─── 演示：两轮交互（submitted → input-required → completed）───
if __name__ == "__main__":
    server = A2AServer(AgentCard(
        name="财务分析 Agent",
        description="专精于财务报表分析",
        url="https://finance-agent.example.com",
        skills=[{"id": "financial_analysis", "name": "财务报表分析"}],
    ))
    print("=== Agent Card ===")
    print(server.card.to_json())

    # 第一轮：缺少时间范围 → input-required
    r1 = server.handle_request({
        "jsonrpc": "2.0", "id": 1, "method": "message/send",
        "params": {"id": "task-001",
                   "message": {"role": "user",
                               "parts": [{"type": "text", "text": "分析特斯拉营收趋势"}]}}
    })
    print(f"\n第一轮状态: {r1['result']['state']}")  # input-required

    # 第二轮：补充时间 → completed
    r2 = server.handle_request({
        "jsonrpc": "2.0", "id": 2, "method": "message/send",
        "params": {"id": "task-001",
                   "message": {"role": "user",
                               "parts": [{"type": "text", "text": "时间范围：2023-2024"}]}}
    })
    print(f"第二轮状态: {r2['result']['state']}")  # completed
    print(f"产出: {r2['result']['artifacts'][0]['parts'][0]['text']}")
```

### A2A 的关键设计原则

| 原则 | 说明 |
|------|------|
| **不透明执行** | 客户端不需要了解服务端内部实现（模型、框架均可不同） |
| **框架无关** | LangChain、CrewAI、AutoGen 等均可实现 A2A |
| **能力协商** | 通过 Agent Card 动态发现和选择合适的 Agent |
| **安全优先** | 内置企业级认证授权（OAuth 2.0, API Key, mTLS） |

## 常见误区 / 面试追问

1. **误区："A2A 会取代 MCP"** — A2A 和 MCP 解决的是两个正交问题。MCP 是 Agent 连接工具和数据源的标准（纵向扩展能力），A2A 是 Agent 之间协作通信的标准（横向建立合作）。一个成熟的 Agent 系统往往同时需要两者：用 MCP 获取能力，用 A2A 实现分工协作。它们更像是 TCP 和 HTTP 的关系——不同层次、互相配合。

2. **误区："A2A 只适用于同构 Agent"** — 恰恰相反，A2A 的核心设计目标就是让异构 Agent 互通。无论 Agent 基于 Claude、GPT 还是 Gemini，用 LangChain 还是自研框架，只要实现 A2A 协议就能互相协作。Agent Card 中的 skills 是语义级描述，而非实现级绑定。

3. **追问："A2A 如何处理长时间运行的任务？"** — 三种机制：(1) **SSE 流式推送**——通过 `message/stream`（v0.2 前为 `tasks/sendSubscribe`）实时推送中间状态和增量结果；(2) **Push Notification**——客户端注册 webhook 回调，服务端在状态变更时主动通知，适合数小时级任务；(3) **Task 状态轮询**——通过 `tasks/get` 随时查询进度。三种机制覆盖秒级到天级的各种任务时长。

4. **追问："如何在 A2A 中实现身份验证和授权？"** — Agent Card 的 `authentication` 字段声明支持的认证方案。协议复用成熟的 Web 安全标准：**OAuth 2.0**（企业间协作首选）、**API Key**（内部系统）、**JWT Bearer Token**（无状态场景）。同时 Agent Card 的 `skills` 可设置权限级别，实现细粒度能力授权——如允许"查询"但禁止"修改"。

## 参考资料

- [A2A Protocol Specification (Google)](https://google.github.io/A2A/)
- [Announcing the Agent2Agent Protocol (Google Cloud Blog)](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/)
- [A2A vs MCP: Understanding AI Agent Protocols (Composio)](https://composio.dev/blog/a2a-vs-mcp/)
- [A2A GitHub Repository (google/A2A)](https://github.com/google/A2A)
- [Model Context Protocol Specification (Anthropic)](https://modelcontextprotocol.io/)
</div>
</details>

</div>

---

<div class="chapter-nav">

<a class="chapter-nav-link" href="/custom/ai100/">📑 总览</a>

<a class="chapter-nav-link" href="/custom/ai100/tool-use">← 🔧 工具使用</a>

<a class="chapter-nav-link chapter-nav-next" href="/custom/ai100/memory">🧠 记忆与状态 →</a>

</div>
