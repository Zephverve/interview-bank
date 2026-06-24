---
custom: true
partTitle: AI100 · 框架选型
partColor: #64748b
---

<div class="part-hero custom-hero" style="--part-color: #64748b">

# 🧰 AI100 · 框架选型

<p class="part-desc">LangGraph · 自研 vs 框架 · 共 6 题</p>
<span class="part-round custom-tag">我的题库</span>

</div>

<div class="custom-hint">

📝 **本分类源文件**：`custom/ai100-frameworks/` · 新增题目后运行 `npm run prepare` 即可刷新。

</div>

<div class="question-card compact-card" id="096-framework-overview-1">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">详细解析</span></h2>

### 三大框架对比

```
┌──────────────┬─────────────┬──────────────┬──────────────┐
│ 维度         │ LangChain   │ LlamaIndex   │ Haystack     │
├──────────────┼─────────────┼──────────────┼──────────────┤
│ 定位         │ 通用 LLM 编排│ 数据+RAG 专家│ 生产级 NLP   │
│ GitHub Stars │ 100k+       │ 40k+         │ 18k+         │  ← 截至 2025 年
│ 语言         │ Python + TS │ Python + TS  │ Python       │
│ 核心抽象     │ Chain/Agent │ Index/Query  │ Pipeline/    │
│              │ /Tool       │ Engine       │ Component    │
├──────────────┼─────────────┼──────────────┼──────────────┤
│ Agent 能力   │ ★★★★★      │ ★★★☆☆       │ ★★★★☆       │
│ RAG 能力     │ ★★★★☆      │ ★★★★★       │ ★★★★☆       │
│ 生产就绪     │ ★★★☆☆      │ ★★★☆☆       │ ★★★★★       │
│ 学习曲线     │ 陡峭         │ 中等         │ 平缓         │
│ 灵活性       │ 极高         │ 高           │ 中高         │
├──────────────┼─────────────┼──────────────┼──────────────┤
│ 数据连接器   │ 多（社区驱动）│ 160+ 官方    │ 少（精选）   │
│ 模型支持     │ 最广泛       │ 广泛         │ 广泛         │
│ 监控/追踪    │ LangSmith   │ 内置追踪     │ Pipeline 日志│
│ 部署方式     │ LangServe   │ 自行部署     │ Hayhooks API │
└──────────────┴─────────────┴──────────────┴──────────────┘
```

### LangChain 核心架构

> **注意**：LangChain **1.0 已 GA**（2025-10），官方推荐使用 `langchain.agents.create_agent` 构建 Agent；旧版 `create_tool_calling_agent` + `AgentExecutor` 以及 LangGraph 的 `create_react_agent` 都已 deprecated。下方示例使用 1.0 API。

```python
# LangChain 1.0：create_agent + 中间件架构（推荐 2025-10+）
from langchain.agents import create_agent
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool

# 定义工具
@tool
def search_database(query: str) -> str:
    """搜索产品数据库"""
    return f"找到关于 {query} 的 3 条结果"

# 创建 Agent（1.0 API，单行即可）
agent = create_agent(
    model=ChatOpenAI(model="gpt-4o"),
    tools=[search_database],
    system_prompt="你是一个智能助手。",
)

# 调用
result = agent.invoke({"messages": [("human", "搜索 RAG 框架")]})

# LangChain 优势：
# 1. 生态最大——几乎所有 LLM、向量数据库、工具都有集成
# 2. LangGraph 扩展——支持复杂的有状态 Agent 工作流
# 3. LangSmith——完整的追踪、评估、监控平台
# 4. 社区活跃——问题和示例最多

# LangChain 劣势：
# 1. 抽象层过多，调试困难（"框架深度"问题）
# 2. API 变更频繁，升级成本高
# 3. 过度封装导致性能损耗
# 4. 简单任务也需要理解大量概念
```

### LlamaIndex 核心架构

```python
# LlamaIndex：数据连接 + 索引 + 查询引擎
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.core.agent import ReActAgent
from llama_index.core.tools import QueryEngineTool

# 加载数据并创建索引
documents = SimpleDirectoryReader("./data").load_data()
index = VectorStoreIndex.from_documents(documents)

# 创建查询引擎
query_engine = index.as_query_engine(similarity_top_k=5)

# 将查询引擎包装为工具
tool = QueryEngineTool.from_defaults(
    query_engine=query_engine,
    name="knowledge_base",
    description="搜索内部知识库",
)

# 创建 Agent
agent = ReActAgent.from_tools([tool], verbose=True)
response = agent.chat("最新的产品定价是多少？")

# LlamaIndex 优势：
# 1. 160+ 数据连接器（PDF、数据库、API、Notion 等）
# 2. 多种索引类型（向量、关键词、知识图谱、树状）
# 3. 检索性能最优——专为数据查询场景优化
# 4. 与 LangChain 互操作——可作为其检索后端

# LlamaIndex 劣势：
# 1. Agent 能力相对弱（依赖外部框架）
# 2. 复杂编排能力不如 LangChain
# 3. 社区规模较小
```

### Haystack 核心架构

```python
# Haystack：Pipeline 架构——组件化 + 生产优先
from haystack import Pipeline
from haystack.components.generators import OpenAIGenerator
from haystack.components.builders import PromptBuilder
from haystack.components.retrievers.in_memory import InMemoryBM25Retriever

# 定义 Pipeline（DAG 结构）
pipeline = Pipeline()
pipeline.add_component("retriever", InMemoryBM25Retriever(document_store=store))
pipeline.add_component("prompt", PromptBuilder(template=template))
pipeline.add_component("llm", OpenAIGenerator(model="gpt-4o"))

# 连接组件
pipeline.connect("retriever", "prompt")
pipeline.connect("prompt", "llm")

# 运行
result = pipeline.run({"retriever": {"query": "什么是 RAG？"}})

# Haystack 优势：
# 1. Pipeline 架构清晰——DAG 图式编排，易于理解和调试
# 2. 类型安全——组件间的输入输出有严格类型检查
# 3. 生产成熟——deepset Cloud 提供企业级托管
# 4. 序列化——Pipeline 可导出为 YAML，支持版本控制

# Haystack 劣势：
# 1. 生态较小，第三方集成少
# 2. 仅支持 Python
# 3. Agent 能力发展较晚
```

### 选择决策树

```
需要构建什么类型的应用？
│
├── 复杂 Agent（多步推理、工具编排）
│   └── → LangChain + LangGraph
│
├── 知识密集型（RAG、文档问答、数据检索）
│   └── → LlamaIndex（可搭配 LangChain）
│
├── 生产部署优先（企业级、高可用）
│   └── → Haystack
│
├── 多 Agent 协作
│   └── → CrewAI 或 AutoGen
│
├── 微软生态
│   └── → Semantic Kernel
│
└── 极致性能 + 轻量
    └── → Agno（前 Phidata，号称最快）
```

</div>

---

<div class="question-card compact-card" id="096-framework-overview-2">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">常见误区 / 面试追问</span></h2>

1. **误区："LangChain 是唯一选择"** — LangChain 生态最大但不一定最适合。对于 RAG 专项任务，LlamaIndex 更专业；对于生产稳定性，Haystack 更成熟。框架选择应该基于具体需求，而非社区热度。

2. **误区："框架越全能越好"** — 全能框架意味着更多抽象层和更高复杂度。如果只需要一个 RAG Pipeline，使用 LangChain 全家桶就是杀鸡用牛刀。选择最小够用的框架可以降低维护成本。

3. **追问："这些框架可以混用吗？"** — 可以，且推荐。典型组合：LlamaIndex 处理数据索引和检索 → LangChain/LangGraph 编排 Agent 逻辑 → Haystack Pipeline 处理特定流程。框架间通常通过工具接口互操作。

4. **追问："2025 年有什么新兴框架值得关注？"** — (1) **CrewAI**：多 Agent 角色扮演，简单直观；(2) **Agno**：号称最快的 Agent 框架，模型无关；(3) **Semantic Kernel**：微软出品，企业级 .NET/Python 支持；(4) **Google ADK**：Google Agent Development Kit，集成 Gemini 生态；(5) **OpenAI Agents SDK**：轻量级，原生 OpenAI 集成。

</div>

---

<div class="question-card compact-card" id="096-framework-overview-3">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">参考资料</span></h2>

- [LangChain vs Haystack vs LlamaIndex: RAG Showdown 2025 (Medium)](https://mayur-ds.medium.com/langchain-vs-haystack-vs-llamaindex-rag-showdown-2025-28c222d34b0a)
- [We Tested 14 AI Agent Frameworks. Here's How to Choose (Softcery)](https://softcery.com/lab/top-14-ai-agent-frameworks-of-2025-a-founders-guide-to-building-smarter-systems)
- [Best 10 AI Agent Frameworks for 2025 (Deepchecks)](https://deepchecks.com/best-ai-agent-frameworks/)
- [AI Agent Frameworks Compared: LangChain, CrewAI, and More (Arsum)](https://arsum.com/blog/posts/ai-agent-frameworks/)
- [Compare the Top 7 RAG Frameworks in 2025 (Pathway)](https://pathway.com/rag-frameworks)

</div>

---

<div class="question-card compact-card" id="097-langgraph-concepts-1">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">详细解析</span></h2>

### 核心架构图

```
LangGraph 核心概念：

┌─────────────────────────────────────────┐
│              StateGraph                  │
│                                          │
│  State (共享状态 - TypedDict)            │
│  ┌─────────────────────────────────┐    │
│  │ messages: list[BaseMessage]     │    │
│  │ current_step: str               │    │
│  │ tool_results: dict              │    │
│  └─────────────────────────────────┘    │
│                                          │
│  Nodes (节点 - Python 函数)              │
│  ┌──────┐    ┌──────┐    ┌──────┐      │
│  │ plan │───→│ act  │───→│ check│      │
│  └──────┘    └──────┘    └──┬───┘      │
│                              │          │
│  Edges (边 - 路由逻辑)       ▼          │
│              ┌──────────────────┐       │
│              │ 条件边：         │       │
│              │ done? → END      │       │
│              │ retry? → act     │       │
│              └──────────────────┘       │
│                                          │
│  Checkpointer (持久化)                   │
│  ├── MemorySaver (开发)                  │
│  ├── PostgresSaver (生产)                │
│  └── 支持 interrupt() + resume           │
└─────────────────────────────────────────┘
```

### State：图的共享记忆

```python
from typing import Annotated, TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langchain_core.messages import BaseMessage

# 定义 State：所有节点共享的数据结构
class AgentState(TypedDict):
    # Annotated + add_messages = Reducer 模式
    # 新消息追加到列表，而非覆盖
    messages: Annotated[list[BaseMessage], add_messages]

    # 普通字段：新值直接覆盖旧值
    current_task: str
    step_count: int
    final_answer: str

# State 设计原则：
# 1. 只放需要跨节点共享的数据
# 2. 用 Reducer 处理需要"累加"的字段（如消息历史）
# 3. 默认行为是覆盖（最后写入的值生效）
# 4. State 是不可变的——节点返回更新字典，由框架合并

# Reducer 示例：自定义合并逻辑
def merge_tool_results(existing: dict, new: dict) -> dict:
    """工具结果合并：新结果追加到已有结果"""
    merged = {**existing, **new}
    return merged

class AdvancedState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]
    tool_results: Annotated[dict, merge_tool_results]
```

### Node：图中的工作单元

```python
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage

llm = ChatOpenAI(model="gpt-4o")

# 节点 1：调用 LLM
def call_llm(state: AgentState) -> dict:
    """每个节点接收 State，返回 State 更新"""
    response = llm.invoke(state["messages"])
    # 返回的字典会与当前 State 合并
    return {"messages": [response]}

# 节点 2：执行工具
def execute_tools(state: AgentState) -> dict:
    """执行 LLM 请求的工具调用"""
    last_message = state["messages"][-1]
    results = []
    for tool_call in last_message.tool_calls:
        result = run_tool(tool_call)
        results.append(result)
    return {"messages": results}

# 节点 3：检查是否完成
def should_continue(state: AgentState) -> str:
    """条件边的路由函数——返回下一个节点的名称"""
    last_message = state["messages"][-1]
    if last_message.tool_calls:
        return "tools"      # 有工具调用 → 去执行工具
    else:
        return END           # 无工具调用 → 结束

# 节点的本质：
# - 就是普通的 Python 函数
# - 输入：当前 State
# - 输出：State 更新字典（不是完整 State）
# - 可以包含任何逻辑：LLM 调用、API 请求、数据处理
```

### Edge：连接节点的路由器

```python
# 构建完整的 Graph
graph = StateGraph(AgentState)

# 添加节点
graph.add_node("llm", call_llm)
graph.add_node("tools", execute_tools)

# 普通边：固定路由（A → B）
graph.add_edge(START, "llm")        # 入口 → LLM
graph.add_edge("tools", "llm")      # 工具执行后 → 回到 LLM

# 条件边：动态路由（基于 State 决定去哪）
graph.add_conditional_edges(
    "llm",                           # 从 LLM 节点出发
    should_continue,                  # 路由函数
    {
        "tools": "tools",            # 返回 "tools" → 去 tools 节点
        END: END,                     # 返回 END → 结束
    }
)

# 编译图
app = graph.compile()

# 边的类型：
# 1. 普通边 add_edge(A, B)：A 执行后一定去 B
# 2. 条件边 add_conditional_edges(A, func, mapping)：
#    A 执行后，由 func(state) 返回值决定去哪
# 3. START：虚拟入口节点
# 4. END：虚拟终止节点
```

### Checkpointer：状态持久化与 Human-in-the-Loop

```python
from langgraph.checkpoint.memory import MemorySaver
from langgraph.checkpoint.postgres import PostgresSaver

# 开发环境：内存检查点
checkpointer = MemorySaver()

# 生产环境：PostgreSQL 检查点
# checkpointer = PostgresSaver(conn_string="postgresql://...")

# 编译时注入 Checkpointer
app = graph.compile(checkpointer=checkpointer)

# 使用 thread_id 管理对话
config = {"configurable": {"thread_id": "user-123"}}
result = app.invoke(
    {"messages": [HumanMessage(content="帮我查一下订单")]},
    config=config,
)

# 同一个 thread_id 的后续调用会自动加载历史 State
result2 = app.invoke(
    {"messages": [HumanMessage(content="退款怎么操作？")]},
    config=config,  # 自动携带之前的对话历史
)

# Human-in-the-Loop：interrupt() 暂停等待人工
from langgraph.types import interrupt

def sensitive_action(state: AgentState) -> dict:
    """执行敏感操作前暂停，等待人工确认"""
    approval = interrupt(
        {"question": "是否批准执行此操作？", "details": state["current_task"]}
    )
    if approval == "yes":
        return {"messages": [AIMessage(content="操作已执行")]}
    else:
        return {"messages": [AIMessage(content="操作已取消")]}

# Checkpointer 使能的能力：
# 1. 对话持久化——跨请求保持状态
# 2. 错误恢复——从最后一个检查点重试
# 3. Human-in-the-Loop——暂停/恢复执行
# 4. 时间旅行——回滚到任意历史状态
```

### 完整 ReAct Agent 示例

```python
# LangChain 1.0 GA（2025-10）：推荐 langchain.agents.create_agent
# langgraph.prebuilt.create_react_agent 已 deprecated
from langchain.agents import create_agent
from langgraph.checkpoint.memory import MemorySaver
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool

@tool
def get_weather(city: str) -> str:
    """获取城市天气"""
    return f"{city}：晴天，25°C"

@tool
def search_flights(origin: str, destination: str) -> str:
    """搜索航班"""
    return f"{origin}→{destination}：找到 3 个航班"

# 一行创建完整的 ReAct Agent（v1.0 GA 推荐方式）
agent = create_agent(
    model=ChatOpenAI(model="gpt-4o"),
    tools=[get_weather, search_flights],
    checkpointer=MemorySaver(),
)

# 执行
result = agent.invoke(
    {"messages": [("human", "我想去北京，先查天气再搜航班")]},
    config={"configurable": {"thread_id": "trip-1"}},
)

# 注：create_agent 底层仍是 LangGraph 图；旧版 create_react_agent 在 v1.x 仍可用
# 但官方明确建议新代码使用 langchain.agents.create_agent
```

</div>

---

<div class="question-card compact-card" id="097-langgraph-concepts-2">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">常见误区 / 面试追问</span></h2>

1. **误区："LangGraph 就是 LangChain 的升级版"** — LangGraph 不是 LangChain 的替代品，而是补充。LangChain 处理单步链式调用（Prompt → LLM → Parser），LangGraph 处理多步有状态工作流（循环、分支、人工审核）。简单任务用 LangChain，复杂 Agent 用 LangGraph。

2. **误区："State 就是全局变量"** — State 不是可变的全局变量。节点不能直接修改 State，只能返回更新字典，由框架通过 Reducer 合并。这种设计保证了状态变更的可追踪性和一致性。

3. **追问："LangGraph 的执行模型是什么？"** — "超步骤（Super-step）"模型：每个超步骤中，所有没有未满足依赖的节点并行执行，执行完毕后同步 State，然后进入下一个超步骤。这类似于 Pregel 图计算模型（Google 的大规模图处理框架）。

4. **追问："LangGraph 如何处理错误？"** — 三层错误处理：(1) 节点内 try/catch 处理预期错误；(2) Checkpointer 支持从失败点重试（不丢失已完成步骤）；(3) Graph 级别的 `retry_policy` 配置自动重试策略。结合 `interrupt()` 还可以在错误时暂停并请求人工介入。

</div>

---

<div class="question-card compact-card" id="097-langgraph-concepts-3">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">参考资料</span></h2>

- [LangGraph Overview (Official Docs)](https://docs.langchain.com/oss/python/langgraph/overview)
- [A Beginner's Guide to LangGraph: Core Concepts (Medium)](https://medium.com/@ajaykumargajula7/a-beginners-guide-to-langgraph-understanding-the-core-concepts-bc2b1011d675)
- [Mastering AI Agent Systems with LangGraph in 2025 (Towards AI)](https://pub.towardsai.net/from-single-brains-to-team-intelligence-mastering-ai-agent-systems-with-langgraph-in-2025-3520af4fc758)
- [Understanding Core Concepts of LangGraph Deep Dive (Dev.to)](https://dev.to/raunaklallala/understanding-core-concepts-of-langgraph-deep-dive-1d7h)
- [LangGraph Basics: Understanding State, Schema, Nodes, and Edges (Medium)](https://medium.com/@vivekvjnk/langgraph-basics-understanding-state-schema-nodes-and-edges-77f2fd17cae5)

</div>

---

<div class="question-card compact-card" id="098-framework-vs-custom-1">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">详细解析</span></h2>

### 决策矩阵

```
用框架 vs 自研的决策维度：

┌────────────────┬──────────────────┬──────────────────┐
│ 维度           │ 选择框架         │ 选择自研         │
├────────────────┼──────────────────┼──────────────────┤
│ 项目阶段       │ PoC / MVP        │ 成熟产品         │
│ 团队经验       │ LLM 新手         │ LLM 老手         │
│ 定制需求       │ 标准流程         │ 深度定制         │
│ 性能要求       │ 延迟不敏感       │ 毫秒级优化       │
│ 可调试性       │ 黑箱可接受       │ 需要完全透明     │
│ 开发速度       │ 急需上线         │ 可以慢一点       │
│ 维护成本       │ 能接受框架升级   │ 想控制依赖       │
│ 生态需求       │ 需要大量集成     │ 集成点有限       │
│ 团队规模       │ 小团队（1-3人）  │ 有专人维护基建   │
└────────────────┴──────────────────┴──────────────────┘

决策流程图：
需要多少 LLM 调用？
├── 单次调用 → 直接用 API（不需要框架）
├── 2-5 步链式 → 轻量封装或框架
└── 复杂多步 Agent →
    ├── 标准 ReAct/RAG 模式 → 用框架
    └── 高度定制流程 → 自研
```

### 框架的价值与代价

```python
# 框架带来的价值
framework_benefits = {
    "快速启动": "几行代码实现 RAG/Agent，开发速度 3-5x",
    "最佳实践": "内置 ReAct、Plan-and-Execute 等成熟模式",
    "生态集成": "几十种 LLM、向量数据库、工具的预集成",
    "可观测性": "LangSmith/Langfuse 等追踪工具的原生支持",
    "社区支持": "问题容易找到答案，示例丰富",
}

# 框架带来的代价
framework_costs = {
    "抽象税": "多层封装导致调试困难，错误信息不直观",
    "性能损耗": "额外的序列化/反序列化、中间层开销",
    "升级风险": "API 频繁变更，升级可能破坏现有代码",
    "灵活性限制": "框架假设的流程可能不符合业务需求",
    "依赖锁定": "深度使用后难以迁移到其他方案",
    "过度工程": "简单需求也要遵循框架的复杂模式",
}

# 关键信号：何时从框架迁移到自研
migration_signals = [
    "频繁绕过框架限制（monkey patch / 自定义 callback）",
    "调试时间 > 开发时间",
    "框架升级导致回归问题",
    "需要的功能框架不支持，但又不能脱离框架实现",
    "性能瓶颈来自框架抽象层",
]
```

### 自研 Agent 框架的核心组件

```python
# 从第一性原理构建 Agent——只需要几个核心组件

import json
from openai import OpenAI

class MinimalAgent:
    """最小可用的自研 Agent 框架"""

    def __init__(self, model="gpt-4o", tools=None, system_prompt=""):
        self.client = OpenAI()
        self.model = model
        self.tools = {t["function"]["name"]: t for t in (tools or [])}
        self.tool_functions = {}
        self.system_prompt = system_prompt

    def register_tool(self, name, func, schema):
        """注册工具：函数 + JSON Schema"""
        self.tool_functions[name] = func
        self.tools[name] = schema

    def run(self, user_message, max_steps=10):
        """Agent 执行循环——这就是 Agent 的本质"""
        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": user_message},
        ]

        for step in range(max_steps):
            # 1. 调用 LLM
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                tools=list(self.tools.values()) if self.tools else None,
            )
            msg = response.choices[0].message
            messages.append(msg)

            # 2. 检查是否需要调用工具
            if not msg.tool_calls:
                return msg.content  # 无工具调用 → 返回最终答案

            # 3. 执行工具
            for tool_call in msg.tool_calls:
                func = self.tool_functions[tool_call.function.name]
                args = json.loads(tool_call.function.arguments)
                result = func(**args)
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": str(result),
                })

        return "达到最大步数限制"

# 核心洞察：Agent 本质上就是一个 while 循环
# LLM 调用 → 检查工具调用 → 执行工具 → 循环
# 不需要框架也能实现
```

### 渐进式策略：最佳实践

```python
# 推荐的渐进式方法：

stages = {
    "阶段 1：原型验证（1-2 周）": {
        "方法": "使用框架（LangChain/LangGraph）",
        "目标": "验证 Agent 方案可行性",
        "产出": "可演示的原型",
        "代码": "大量使用框架预构建组件",
    },
    "阶段 2：需求明确（2-4 周）": {
        "方法": "框架 + 自定义组件",
        "目标": "明确生产需求和性能瓶颈",
        "产出": "性能基线、需求文档",
        "代码": "开始替换框架中的瓶颈组件",
    },
    "阶段 3：核心自研（1-3 月）": {
        "方法": "核心路径自研 + 非核心保留框架",
        "目标": "优化性能、提高可控性",
        "产出": "自研 Agent 核心 + 框架辅助模块",
        "代码": "Agent Loop 自研，RAG/工具可保留框架",
    },
    "阶段 4：完全自主（可选）": {
        "方法": "完全自研",
        "条件": "只有当框架的存在确实造成显著问题时",
        "注意": "大多数项目在阶段 3 就够了",
    },
}

# 关键原则：
# 1. 不要一开始就自研——先用框架验证方向
# 2. 不要永远依赖框架——根据需求逐步自主化
# 3. 可以混用——核心路径自研，辅助功能用框架
# 4. 抽象边界——即使用框架，也要隔离框架依赖
```

### 自研时的架构建议

```python
# 自研 Agent 框架的分层架构

architecture = {
    "Layer 1: LLM 接口层": {
        "职责": "封装 LLM API 调用，支持多提供商",
        "设计": "适配器模式——统一接口，底层可切换",
        "示例": "LLMClient(provider='openai'|'anthropic'|'google')",
    },
    "Layer 2: 工具层": {
        "职责": "工具注册、Schema 生成、执行",
        "设计": "装饰器模式——@tool 自动生成 JSON Schema",
        "示例": "@tool def search(query: str) -> str: ...",
    },
    "Layer 3: Agent Loop": {
        "职责": "核心执行循环——推理、行动、观察",
        "设计": "策略模式——可插拔的推理策略",
        "示例": "AgentLoop(strategy='react'|'plan_execute')",
    },
    "Layer 4: 状态管理": {
        "职责": "会话状态、检查点、记忆",
        "设计": "仓库模式——可插拔的存储后端",
        "示例": "StateStore(backend='memory'|'redis'|'postgres')",
    },
    "Layer 5: 可观测性": {
        "职责": "日志、追踪、指标",
        "设计": "中间件模式——非侵入式",
        "示例": "agent.use(TracingMiddleware())",
    },
}
```

</div>

---

<div class="question-card compact-card" id="098-framework-vs-custom-2">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">常见误区 / 面试追问</span></h2>

1. **误区："自研总是更好"** — 自研意味着你要维护 Agent Loop、错误处理、状态管理、工具集成、可观测性等所有组件。小团队可能无法承受这个维护成本。框架把这些"无差别劳动"打包好了，让你专注于业务逻辑。

2. **误区："框架性能太差"** — 框架的额外开销通常在毫秒级，而 LLM API 调用在秒级。在大多数场景下，框架不是性能瓶颈。只有在极高并发或极低延迟的场景下，框架开销才值得关注。

3. **追问："如何隔离框架依赖？"** — 使用**端口-适配器模式（Hexagonal Architecture）**：定义自己的接口（Port），用框架实现这些接口（Adapter）。业务代码只依赖自己的接口，切换框架只需替换 Adapter。这是"用框架但不被框架绑定"的关键。

4. **追问："Anthropic/OpenAI 自己推荐怎么做？"** — Anthropic 的建议："Start with the simplest solution"——先用原生 API，只在确实需要时引入框架。OpenAI Agents SDK 的设计哲学是"最小抽象"——只封装 Agent Loop 和工具调用，其他交给开发者。这反映了行业趋势：框架在变轻，而非变重。

</div>

---

<div class="question-card compact-card" id="098-framework-vs-custom-3">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">参考资料</span></h2>

- [Building AI Agents Without Frameworks: What LangChain Won't Teach You (Medium)](https://medium.com/@candemir13/building-ai-agents-without-frameworks-what-langchain-wont-teach-you-035a11d9d80c)
- [LangChain, LangGraph, or Custom? Choosing the Right Agentic Framework (Turgon AI)](https://www.turgon.ai/post/langchain-langgraph-or-custom-choosing-the-right-agentic-framework)
- [The Complete Guide to Choosing an AI Agent Framework in 2025 (Langflow)](https://www.langflow.org/blog/the-complete-guide-to-choosing-an-ai-agent-framework-in-2025)
- [AI Agent Frameworks Compared: Architecture Patterns and Trade-offs (Arsum)](https://arsum.com/blog/posts/ai-agent-frameworks/)
- [Stop Using Frameworks: Build an AI Agent From First Principles (YouTube)](https://www.youtube.com/watch?v=TdcAslNDCGc)

</div>

---

<div class="question-card compact-card" id="099-assistants-api-vs-claude-sdk-1">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">详细解析</span></h2>

### 核心对比

```
┌──────────────────┬───────────────────┬───────────────────┐
│ 维度             │ OpenAI Agents SDK │ Claude Agent SDK  │
├──────────────────┼───────────────────┼───────────────────┤
│ 发布时间         │ 2025-03           │ 2025-09 (重命名)  │
│ 包名             │ openai-agents /   │ claude-agent-sdk  │
│                  │ @openai/agents    │                   │
│ 设计哲学         │ 最小抽象          │ 工具优先+MCP      │
│ 核心概念         │ Agent/Handoff/    │ ClaudeAgentOptions│
│                  │ Guardrails        │ /query/Subagent   │
│ 底层 API         │ Responses API     │ Messages API+MCP  │
│ 模型支持         │ OpenAI 优先       │ Claude 专属       │
│ 工具协议         │ Function Calling  │ MCP（开放标准）   │
│ 状态管理         │ Responses API     │ Hooks + 文件      │
│                  │ （云端托管）      │ 检查点            │
│ 多 Agent         │ Handoff 模式      │ Subagent 派生     │
│ Human-in-the-Loop│ 需自行实现        │ permission_mode   │
│ 追踪/可观测      │ 内置 Tracing      │ Hooks 钩子        │
│ 语言支持         │ Python+TypeScript │ Python+TypeScript │
│ 开源             │ 是                │ 是                │
│ 适用场景         │ 通用 Agent        │ Coding/工具密集   │
└──────────────────┴───────────────────┴───────────────────┘
```

### OpenAI Agents SDK

```python
# OpenAI Agents SDK：最小抽象，三个核心概念
from agents import Agent, Runner, handoff, GuardrailFunctionOutput
from agents import input_guardrail

# 核心概念 1：Agent — 带指令和工具的 LLM
triage_agent = Agent(
    name="Triage Agent",
    instructions="根据用户问题类型，转接到合适的专家。",
    handoffs=[sales_agent, support_agent],  # 可以交接给谁
)

sales_agent = Agent(
    name="Sales Agent",
    instructions="处理销售相关问题。",
    tools=[lookup_pricing, create_quote],
)

support_agent = Agent(
    name="Support Agent",
    instructions="处理技术支持问题。",
    tools=[search_kb, create_ticket],
)

# 核心概念 2：Handoff — Agent 间的任务交接
# LLM 自动决定何时交接，交接时携带上下文

# 核心概念 3：Guardrails — 输入/输出安全检查
@input_guardrail
async def check_injection(ctx, agent, input):
    """检查 Prompt 注入"""
    result = await Runner.run(
        injection_detector,
        input,
        context=ctx.context,
    )
    return GuardrailFunctionOutput(
        output_info=result,
        tripwire_triggered=result.is_injection,
    )

# 运行 Agent
result = await Runner.run(triage_agent, "我想了解企业版定价")

# Agents SDK 特点：
# 1. 极简 API——三个概念覆盖大部分场景
# 2. 内置追踪——自动记录每步执行
# 3. 类型安全——Pydantic 模型验证输出
# 4. Agent Loop 内置——自动处理工具调用循环
```

### Anthropic Claude Agent SDK

```python
# Claude Agent SDK（pip install claude-agent-sdk，2025-09 从 claude-code-sdk 重命名）
# 核心 API：ClaudeAgentOptions + 异步 query() 函数
# 详见：https://docs.anthropic.com/en/api/agent-sdk

import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

# 1. 最简用法：直接 query()
async def simple_example():
    options = ClaudeAgentOptions(
        model="claude-sonnet-4-5",
        system_prompt="你是一个数据分析助手。",
    )
    async for msg in query(prompt="分析 sales.csv 并给出 Top 3 趋势", options=options):
        print(msg)

# 2. 配置 MCP 工具服务器（真实 dict 结构，非 URL 列表）
options = ClaudeAgentOptions(
    model="claude-sonnet-4-5",
    mcp_servers={
        # stdio 子进程式（最常见）
        "filesystem": {
            "type": "stdio",
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-filesystem", "/workspace"],
        },
        # HTTP 远程
        "github": {
            "type": "http",
            "url": "https://mcp.github.com/v1",
            "headers": {"Authorization": "Bearer $GITHUB_TOKEN"},
        },
    },
    # 允许哪些工具，可精确到工具名
    allowed_tools=["Read", "Write", "Bash", "mcp__filesystem__read_file"],
)

# 3. Permission Mode（细粒度授权控制——这是真正的 HITL 机制）
options = ClaudeAgentOptions(
    model="claude-sonnet-4-5",
    permission_mode="acceptEdits",  # 自动接受文件编辑
    # 可选值: "default" | "acceptEdits" | "bypassPermissions" | "plan"
    # plan 模式下 Agent 只规划不执行，必须人工 confirm 后才能 run
)

# 4. Hooks 机制：在工具调用前后注入逻辑（这是真实可观测/HITL 的方式）
async def pre_tool_hook(tool_name: str, tool_input: dict):
    if tool_name == "Bash" and "rm" in tool_input.get("command", ""):
        return {"deny": True, "reason": "Dangerous command blocked"}
    return {"deny": False}

options = ClaudeAgentOptions(
    model="claude-sonnet-4-5",
    hooks={"PreToolUse": pre_tool_hook},
)

# 5. Subagent 模式（多 Agent 编排）：通过 Task 工具派生子 Agent
# Claude SDK 没有静态的"sub_agents 列表"参数，而是运行时由主 Agent 决定派生
# 主 Agent 调用 Task 工具时，会启动一个独立上下文的子 Claude 实例
options = ClaudeAgentOptions(
    model="claude-sonnet-4-5",
    system_prompt="你是项目经理，可通过 Task 工具委派 researcher/coder/reviewer 子 Agent",
    allowed_tools=["Task", "Read", "Write"],
)

# Claude SDK 真实特性：
# 1. MCP 原生集成——配置即工具发现
# 2. Permission Mode + Hooks——细粒度的 HITL 和安全护栏
# 3. Subagent via Task 工具——主 Agent 运行时派生子 Agent，非静态声明
# 4. 文件系统检查点——基于 .claude/ 目录的状态持久化
```

### 关键差异深度分析

```python
key_differences = {
    "工具生态策略": {
        "OpenAI": "Function Calling — 工具定义在 Agent 代码中，静态",
        "Anthropic": "MCP — 工具由独立服务提供，动态发现",
        "影响": "MCP 更灵活但增加了基础设施复杂度",
    },
    "状态管理": {
        "OpenAI": "Responses API 在云端托管对话状态和文件",
        "Anthropic": "SDK 内置检查点，可用本地或云端存储",
        "影响": "OpenAI 更省心但锁定其云服务；Anthropic 更灵活",
    },
    "多 Agent 模式": {
        "OpenAI": "Handoff — 扁平化交接，Agent A 把控制权给 Agent B",
        "Anthropic": "Orchestrator — 层级化，主 Agent 调度子 Agent",
        "影响": "Handoff 更简单直观；Orchestrator 更适合复杂任务",
    },
    "模型绑定": {
        "OpenAI": "SDK 设计为模型无关（但实际优化 OpenAI 模型）",
        "Anthropic": "明确绑定 Claude 模型",
        "影响": "如果需要多模型支持，OpenAI SDK 更容易适配",
    },
    "开放性": {
        "OpenAI": "SDK 开源，但生态围绕 OpenAI API",
        "Anthropic": "SDK 绑定 Claude，但 MCP 是完全开放的标准",
        "影响": "MCP 的长期价值可能超过任何单一 SDK",
    },
}
```

### 第三方替代方案

```
除了官方 SDK，还有模型无关的选择：

┌──────────────────┬───────────────────────────────────┐
│ 方案             │ 特点                              │
├──────────────────┼───────────────────────────────────┤
│ Vercel AI SDK    │ 真正模型无关，支持 OpenAI/Claude/ │
│                  │ Gemini，TypeScript 优先           │
├──────────────────┼───────────────────────────────────┤
│ LangChain/       │ 最大生态，支持所有主流模型，      │
│ LangGraph        │ 但抽象层较重                      │
├──────────────────┼───────────────────────────────────┤
│ Semantic Kernel  │ 微软出品，.NET/Python，            │
│                  │ 企业级，Azure 集成                 │
├──────────────────┼───────────────────────────────────┤
│ 自研             │ 完全控制，无依赖，                 │
│                  │ 但需要自己处理所有细节             │
└──────────────────┴───────────────────────────────────┘

选择决策：
├── 绑定 OpenAI → OpenAI Agents SDK
├── 绑定 Claude + 需要 MCP → Claude Agent SDK
├── 需要多模型 + TypeScript → Vercel AI SDK
├── 需要复杂工作流 → LangGraph
└── 需要完全控制 → 自研
```

### 实际选型建议

```
项目类型 → 推荐方案：

1. 客服 Bot（单模型）
   └── OpenAI Agents SDK（Handoff 模式天然适合客服分流）

2. 知识密集型 Agent（RAG + 多数据源）
   └── Claude Agent SDK + MCP（工具自动发现 + 上下文注入）

3. 代码助手（需要文件系统/终端访问）
   └── Claude Agent SDK + MCP（Claude Code 就是这么构建的）

4. 多模型策略（成本优化）
   └── Vercel AI SDK 或 LiteLLM + 自研 Agent Loop

5. 企业级部署（Azure 基础设施）
   └── Semantic Kernel + Azure OpenAI
```

</div>

---

<div class="question-card compact-card" id="099-assistants-api-vs-claude-sdk-2">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">常见误区 / 面试追问</span></h2>

1. **误区："Assistants API 和 Agents SDK 是一回事"，或"Agents SDK 是 Assistants API 的直接替代者"** — 实际三者关系是：(1) **Assistants API**（2023）是云端托管的有状态 API（Thread/Message/Run 模型），OpenAI 于 **2025-08 正式标记 deprecated**，**计划于 2026-08-26 关闭**；(2) **Responses API**（2025-03）才是 Assistants API 的**直接替代者**——同样云端管理状态，但 API 设计更现代；(3) **Agents SDK**（2025-03）是**基于 Responses API 的上层轻量级编排框架**，提供 Agent/Handoff/Guardrails 抽象。三者是分层关系：Assistants → Responses（API 层替代）→ Agents SDK（SDK 层编排）。

2. **误区："选了一个 SDK 就不能用其他模型"** — OpenAI Agents SDK 的 `model_settings` 可以配置兼容 OpenAI API 格式的任何提供商。Claude Agent SDK 绑定 Claude，但 MCP 服务器可以被任何客户端使用。关键是区分"SDK 绑定"和"协议绑定"。

3. **追问："MCP 会成为行业标准吗？"** — MCP 正在快速获得采纳：OpenAI、Google、微软都已宣布支持或兼容 MCP。它解决了"每个 Agent 框架都要自己实现工具集成"的 N×M 问题。但标准化需要时间，2025 年仍处于早期采纳阶段。

4. **追问："如果需要同时用 GPT 和 Claude 怎么办？"** — 推荐架构：(1) 使用 LiteLLM 或 Portkey 作为 Model Gateway，统一 API 接口；(2) 自研轻量 Agent Loop，不绑定任何特定 SDK；(3) MCP 作为工具层标准，与模型层解耦。核心思想是**模型层和工具层分离**。

</div>

---

<div class="question-card compact-card" id="099-assistants-api-vs-claude-sdk-3">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">参考资料</span></h2>

- [Claude Agent SDK vs OpenAI Agent SDK vs Vercel AI SDK (Reddit)](https://www.reddit.com/r/vercel/comments/1r5meu6/claude_agent_sdk_vs_openai_agent_sdk_vs_vercel_ai/)
- [OpenAI's Agents SDK and Anthropic's MCP (PromptHub)](https://www.prompthub.us/blog/openais-agents-sdk-and-anthropics-model-context-protocol-mcp)
- [Compare Claude API with OpenAI Agent API (Top AI Product)](https://topaiproduct.com/2025/03/12/compare-claude-api-with-openai-agent-api-for-building-an-ai-agent/)
- [Winning in the Autonomous AI Agents Race: Anthropic vs OpenAI (Medium)](https://rabot.medium.com/winning-in-the-autonomous-ai-agents-race-a0c03d52acad)

</div>

---

<div class="question-card compact-card" id="100-testable-extensible-framework-1">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">详细解析</span></h2>

### 分层架构设计

```
可测试 Agent 框架的分层架构：

┌─────────────────────────────────────────────┐
│            应用层 (Application)              │
│  具体的业务 Agent（客服、代码助手等）        │
├─────────────────────────────────────────────┤
│            编排层 (Orchestration)            │
│  Agent Loop / 多 Agent 协调 / 工作流引擎    │
├─────────────────────────────────────────────┤
│            核心层 (Core)                     │
│  接口定义 / 数据模型 / 事件系统             │
├─────────────────────────────────────────────┤
│            适配器层 (Adapters)               │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│  │ LLM     │ │ Tools   │ │ Storage │      │
│  │ Adapter │ │ Adapter │ │ Adapter │      │
│  └─────────┘ └─────────┘ └─────────┘      │
├─────────────────────────────────────────────┤
│            中间件层 (Middleware)             │
│  Logging / Tracing / Guardrails / Caching  │
└─────────────────────────────────────────────┘

关键原则：
- 依赖方向：外层依赖内层，内层不依赖外层
- 核心层只定义接口（Protocol），不包含实现
- 适配器可独立替换，不影响其他层
```

### 核心接口定义（Port）

```python
from abc import ABC, abstractmethod
from typing import Protocol, AsyncIterator
from dataclasses import dataclass

# ===== 数据模型 =====
@dataclass
class Message:
    role: str  # "system" | "user" | "assistant" | "tool"
    content: str
    tool_calls: list["ToolCall"] | None = None

@dataclass
class ToolCall:
    id: str
    name: str
    arguments: dict

@dataclass
class ToolResult:
    tool_call_id: str
    content: str
    success: bool

# ===== 核心接口（Port）=====

class LLMPort(Protocol):
    """LLM 接口——所有 LLM 实现必须满足此协议"""
    async def complete(
        self, messages: list[Message], tools: list[dict] | None = None
    ) -> Message: ...

    async def stream(
        self, messages: list[Message], tools: list[dict] | None = None
    ) -> AsyncIterator[str]: ...

class ToolPort(Protocol):
    """工具接口"""
    @property
    def name(self) -> str: ...
    @property
    def schema(self) -> dict: ...
    async def execute(self, arguments: dict) -> ToolResult: ...

class StatePort(Protocol):
    """状态存储接口"""
    async def load(self, session_id: str) -> dict | None: ...
    async def save(self, session_id: str, state: dict) -> None: ...
    async def delete(self, session_id: str) -> None: ...

class MiddlewarePort(Protocol):
    """中间件接口"""
    async def before_llm_call(self, messages: list[Message]) -> list[Message]: ...
    async def after_llm_call(self, response: Message) -> Message: ...
    async def before_tool_call(self, tool_call: ToolCall) -> ToolCall: ...
    async def after_tool_call(self, result: ToolResult) -> ToolResult: ...
```

### 可插拔的适配器实现

```python
# ===== LLM 适配器 =====

class OpenAIAdapter:
    """OpenAI LLM 适配器"""
    def __init__(self, model: str = "gpt-4o", api_key: str = None):
        from openai import AsyncOpenAI
        self.client = AsyncOpenAI(api_key=api_key)
        self.model = model

    async def complete(self, messages, tools=None):
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[m.to_openai_format() for m in messages],
            tools=tools,
        )
        return Message.from_openai(response.choices[0].message)


class AnthropicAdapter:
    """Anthropic LLM 适配器"""
    def __init__(self, model: str = "claude-sonnet-4-5"):
        import anthropic
        self.client = anthropic.AsyncAnthropic()
        self.model = model

    async def complete(self, messages, tools=None):
        response = await self.client.messages.create(
            model=self.model,
            messages=[m.to_anthropic_format() for m in messages],
            tools=tools,
        )
        return Message.from_anthropic(response)


class MockLLMAdapter:
    """Mock LLM 适配器——用于测试"""
    def __init__(self, responses: list[Message]):
        self.responses = iter(responses)

    async def complete(self, messages, tools=None):
        return next(self.responses)

# ===== 状态存储适配器 =====

class InMemoryStateStore:
    """内存状态存储——用于测试和开发"""
    def __init__(self):
        self._store = {}

    async def load(self, session_id):
        return self._store.get(session_id)

    async def save(self, session_id, state):
        self._store[session_id] = state

class RedisStateStore:
    """Redis 状态存储——用于生产"""
    def __init__(self, redis_url: str):
        import redis.asyncio as redis
        self.redis = redis.from_url(redis_url)

    async def load(self, session_id):
        data = await self.redis.get(f"agent:state:{session_id}")
        return json.loads(data) if data else None

    async def save(self, session_id, state):
        await self.redis.set(f"agent:state:{session_id}", json.dumps(state))
```

### Agent Loop 与依赖注入

```python
class AgentLoop:
    """核心 Agent 执行循环——通过依赖注入实现可测试性"""

    def __init__(
        self,
        llm: LLMPort,                          # 注入 LLM
        tools: list[ToolPort] = None,           # 注入工具
        state_store: StatePort = None,          # 注入状态存储
        middlewares: list[MiddlewarePort] = None,# 注入中间件
        max_steps: int = 10,
        strategy: "ReasoningStrategy" = None,   # 注入推理策略
    ):
        self.llm = llm
        self.tool_registry = {t.name: t for t in (tools or [])}
        self.state_store = state_store or InMemoryStateStore()
        self.middlewares = middlewares or []
        self.max_steps = max_steps
        self.strategy = strategy or ReactStrategy()
        self.event_bus = EventBus()  # 事件系统

    async def run(self, user_input: str, session_id: str = None) -> str:
        """执行 Agent"""
        # 加载或初始化状态
        state = await self.state_store.load(session_id) if session_id else None
        messages = state["messages"] if state else []
        messages.append(Message(role="user", content=user_input))

        for step in range(self.max_steps):
            # 中间件：前处理
            for mw in self.middlewares:
                messages = await mw.before_llm_call(messages)

            # 发出事件
            self.event_bus.emit("before_llm_call", {"step": step, "messages": messages})

            # 调用 LLM
            tool_schemas = [t.schema for t in self.tool_registry.values()]
            response = await self.llm.complete(messages, tools=tool_schemas or None)

            # 中间件：后处理
            for mw in self.middlewares:
                response = await mw.after_llm_call(response)

            messages.append(response)
            self.event_bus.emit("after_llm_call", {"step": step, "response": response})

            # 检查是否需要工具调用
            if not response.tool_calls:
                # 保存状态
                if session_id:
                    await self.state_store.save(session_id, {"messages": messages})
                return response.content

            # 执行工具
            for tc in response.tool_calls:
                tool = self.tool_registry[tc.name]
                result = await tool.execute(tc.arguments)
                messages.append(Message(role="tool", content=result.content))
                self.event_bus.emit("tool_executed", {"tool": tc.name, "result": result})

        return "达到最大步数限制"
```

### 中间件模式

```python
# 中间件：横切关注点的可组合实现

class LoggingMiddleware:
    """日志中间件"""
    async def before_llm_call(self, messages):
        logger.info(f"LLM 调用：{len(messages)} 条消息")
        return messages

    async def after_llm_call(self, response):
        logger.info(f"LLM 响应：{response.content[:100]}...")
        return response

    async def before_tool_call(self, tool_call):
        logger.info(f"工具调用：{tool_call.name}")
        return tool_call

    async def after_tool_call(self, result):
        logger.info(f"工具结果：{result.success}")
        return result


class GuardrailMiddleware:
    """安全护栏中间件"""
    async def before_llm_call(self, messages):
        last_msg = messages[-1].content
        if self.detect_injection(last_msg):
            raise SecurityError("检测到 Prompt 注入")
        return messages

    async def after_llm_call(self, response):
        if self.contains_pii(response.content):
            response.content = self.redact_pii(response.content)
        return response


class CachingMiddleware:
    """缓存中间件"""
    def __init__(self, cache: dict = None):
        self.cache = cache or {}

    async def before_llm_call(self, messages):
        key = self._hash(messages)
        if key in self.cache:
            raise CacheHit(self.cache[key])  # 跳过 LLM 调用
        return messages

    async def after_llm_call(self, response):
        # 缓存响应
        return response


# 中间件组合：按顺序执行
agent = AgentLoop(
    llm=OpenAIAdapter(),
    middlewares=[
        GuardrailMiddleware(),   # 1. 先检查安全
        CachingMiddleware(),     # 2. 再检查缓存
        LoggingMiddleware(),     # 3. 最后记录日志
    ],
)
```

### 测试策略

```python
import pytest

class TestAgentLoop:
    """Agent Loop 的单元测试——使用 Mock"""

    @pytest.mark.asyncio
    async def test_simple_response(self):
        """测试：LLM 直接返回答案（无工具调用）"""
        mock_llm = MockLLMAdapter(responses=[
            Message(role="assistant", content="答案是 42"),
        ])
        agent = AgentLoop(llm=mock_llm)
        result = await agent.run("生命的意义是什么？")
        assert result == "答案是 42"

    @pytest.mark.asyncio
    async def test_tool_call_flow(self):
        """测试：LLM 调用工具后给出答案"""
        mock_llm = MockLLMAdapter(responses=[
            # 第一轮：请求调用工具
            Message(role="assistant", content="",
                    tool_calls=[ToolCall(id="1", name="search", arguments={"q": "test"})]),
            # 第二轮：基于工具结果给出答案
            Message(role="assistant", content="搜索结果是..."),
        ])
        mock_tool = MockTool(name="search", result="找到 3 条结果")

        agent = AgentLoop(llm=mock_llm, tools=[mock_tool])
        result = await agent.run("搜索 test")
        assert "搜索结果" in result

    @pytest.mark.asyncio
    async def test_max_steps_limit(self):
        """测试：达到最大步数时停止"""
        # 模拟 LLM 无限循环调用工具
        mock_llm = MockLLMAdapter(responses=[
            Message(role="assistant", content="",
                    tool_calls=[ToolCall(id=str(i), name="search", arguments={})])
            for i in range(20)
        ])
        agent = AgentLoop(llm=mock_llm, tools=[MockTool("search")], max_steps=3)
        result = await agent.run("test")
        assert "最大步数" in result

    @pytest.mark.asyncio
    async def test_state_persistence(self):
        """测试：状态在会话间持久化"""
        store = InMemoryStateStore()
        mock_llm = MockLLMAdapter(responses=[
            Message(role="assistant", content="你好！"),
        ])
        agent = AgentLoop(llm=mock_llm, state_store=store)
        await agent.run("hi", session_id="s1")

        state = await store.load("s1")
        assert len(state["messages"]) == 2  # user + assistant

    @pytest.mark.asyncio
    async def test_middleware_execution_order(self):
        """测试：中间件按正确顺序执行"""
        order = []

        class TrackingMiddleware:
            def __init__(self, name):
                self.name = name
            async def before_llm_call(self, msgs):
                order.append(f"{self.name}:before")
                return msgs
            async def after_llm_call(self, resp):
                order.append(f"{self.name}:after")
                return resp

        agent = AgentLoop(
            llm=MockLLMAdapter([Message(role="assistant", content="ok")]),
            middlewares=[TrackingMiddleware("A"), TrackingMiddleware("B")],
        )
        await agent.run("test")
        assert order == ["A:before", "B:before", "A:after", "B:after"]
```

</div>

---

<div class="question-card compact-card" id="100-testable-extensible-framework-2">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">常见误区 / 面试追问</span></h2>

1. **误区："可测试性意味着 100% 覆盖率"** — Agent 系统中，LLM 输出的非确定性使得 100% 确定性测试不现实。正确的测试策略是分层的：单元测试 Mock LLM（验证逻辑）→ 集成测试用真实 API（验证集成）→ 评估测试用 LLM-as-Judge（验证质量）。每层覆盖不同的风险。

2. **误区："接口越多越好"** — 过度抽象和不够抽象一样有害。只为真正需要替换的组件定义接口。如果你的项目永远不会换 LLM 提供商，一个简单的封装函数就够了，不需要 Port/Adapter 全套架构。**YAGNI 原则同样适用于框架设计**。

3. **追问："如何处理 LLM 响应的非确定性测试？"** — 三种方法：(1) **Mock**——固定 LLM 输出，测试围绕它的逻辑；(2) **快照测试**——记录真实 LLM 输出作为基线，后续对比偏差；(3) **属性测试**——不测具体输出内容，测输出的属性（如"返回的 JSON 必须包含 name 字段"、"不包含 PII"）。

4. **追问："事件驱动 vs 回调 vs 中间件，怎么选？"** — (1) **回调（Callback）**适合简单的钩子（on_start/on_end）；(2) **中间件（Middleware）**适合可组合的请求/响应处理管线；(3) **事件驱动（Event Bus）**适合松耦合的观测和扩展，多个监听器互不影响。生产框架通常三者结合：中间件处理核心管线，事件驱动处理观测，回调提供简单的用户扩展点。

</div>

---

<div class="question-card compact-card" id="100-testable-extensible-framework-3">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">参考资料</span></h2>

- [Building Extensible AI Agents: Middleware Patterns (FlowHunt)](https://www.flowhunt.io/blog/building-extensible-ai-agents-with-langchain-1-0/)
- [Dependency Injection Patterns for Agent Architectures (Moltbook)](https://www.moltbook.com/post/d5b5d112-35b4-4317-bc98-cc97682b3962)
- [A Practical Guide for Designing, Developing, and Deploying Agentic AI (arXiv)](https://arxiv.org/html/2512.08769v1)
- [Architectures for Building Agentic AI (arXiv)](https://arxiv.org/html/2512.09458v1)
- [Architecting Multi-Agent Systems: Evolving Proven Patterns (Medium)](https://medium.com/@chris.p.hughes10/architecting-multi-agent-systems-evolving-proven-patterns-to-agentic-systems-01b2b74e1fa5df)

</div>

---

<div class="question-card compact-card" id="110-coding-agent-harness-comparison-1">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">详细解析</span></h2>

### 一、五大 Coding Agent Harness 形态总览

| Harness | 形态 | 模型策略 | 标志特征 | SWE-bench Verified 2026-Q1 |
|---------|------|---------|---------|---------------------------|
| **Claude Code** | 全屏 CLI + IDE 集成 | 锁定 Claude（Opus 4.7 / Sonnet 4.6 / Haiku 4.5） | Hook + Skill + MCP + Subagent + Plugin 五件套；75% auto-compact | Opus 4.7 87.6% / Sonnet 4.5 80.9% |
| **Cursor** | VS Code Fork + Composer | 自家 Composer 模型 + 多模型可选 | Cursor 3（2026-04）引入 Agents Window（云端 VM） | Composer 78.4%（Cursor 3 发布数据） |
| **Aider** | Git-first 终端 | BYOM（OpenAI / Claude / 本地） | tree-sitter + PageRank repo map | 70%+（Sonnet 4.6 配置） |
| **Cline** | VS Code 扩展 + 2026-05 独立 SDK | BYOM（任意） | Plan/Act 显式分离；checkpoint 每步可回滚 | Cline CLI + Opus 4.7 = Terminal Bench 2.0 74.2% |
| **Codex CLI** | Rust 终端 App | OpenAI（gpt-5 / o5 / codex models） | OS 原生 Seatbelt/bubblewrap 沙箱 + AGENTS.md 标准 | gpt-5-codex ~85% |

> Devin / Replit Agent 因为是"云端容器 VM + 浏览器入口"而非"本地 harness"，本题不作主比较对象，仅作为云端 sandbox 路线的参照。

### 二、四维对比详表

#### 维度 1：Context 管理

| Harness | 策略 | 关键机制 | Token 经济 |
|---------|------|---------|-----------|
| **Claude Code** | 全塞 + 自动 compact | 75% 利用率时 compact；Memory tool 持久化；Skill progressive disclosure | 200K 窗口，compact 后基本不丢；CLAUDE.md 自动 re-inject |
| **Cursor** | 云端 Composer 上下文池 | @-mention 文件、Composer 自动 retrieve；Cursor 3 多窗口并发 | 自家模型适配，不公开具体策略 |
| **Aider** | 外部检索 + 显式控制 | tree-sitter AST 解析全 repo → PageRank 排序 → token 预算内塞入 | 默认 `--map-tokens=1024`，无 chat 文件时膨胀 8x |
| **Cline** | IDE 上下文 + 文件批准 | 显式 add file / read file；每步全 transcript 可见 | 用户完全可控，配 BYOM 模型选 |
| **Codex CLI** | AGENTS.md + workdir 文件读取 | 自动读 monorepo 嵌套 AGENTS.md；32 KiB 硬上限静默截断 | AGENTS.md 是核心 context 入口 |

**关键对比 — Claude Code 的 "全塞 + compact" vs Aider 的 "检索式 repo map"**：

```
Claude Code 流派（全塞 + 智能压缩）          Aider 流派（外部检索）
─────────────────────────────────           ─────────────────────────
+ context 不丢，cross-file 推理强            + 小窗口模型也能在大 repo 工作
+ 模型直接看到原文                            + 显式控制，可解释
- 200K 窗口 + compact 算法依赖               - tree-sitter 不支持的语言失效
- 长 trajectory 可能丢早期细节                - 仅给 outline 不给原文
```

#### 维度 2：Tool Registry & Discovery

| Harness | 工具协议 | Discovery | 扩展机制 |
|---------|---------|-----------|---------|
| **Claude Code** | 内置 + MCP（开放） + Skill（按需加载） | MCP server 自动发现；Skill metadata 启动时常驻 | MCP / Skill / Subagent / Hook / Plugin 五件套 |
| **Cursor** | 内置 + MCP（2025-10 起支持） | 编辑器 UI 配 MCP | Cursor Rules（`.cursor/rules/*.mdc`） |
| **Aider** | git + 终端 + LLM-driven file edit | 无插件机制，靠 prompt 触发 | 几乎不可扩展（哲学：保持简单） |
| **Cline** | 内置 read/write/exec + MCP | MCP marketplace；2026-05 SDK 后开放 plugin | `@cline/sdk` plugin 注册 tool / 监听事件 |
| **Codex CLI** | `shell_command` + `apply_patch`（深度耦合模型权重） | AGENTS.md / 自家 cookbook | Custom tools via `[tools.<name>]` 配置 |

**关键观察 — `apply_patch` 的 post-training coupling**：

Codex 模型在 post-training 阶段被 *绑定* 到 `apply_patch` 工具的语法（OpenCode 团队 + HumanLayer 双重证实）。要让 Codex 在自家 harness 里发挥水平，必须模仿 Codex 的 `apply_patch` 签名。**Claude Code 模型类似——Claude Opus 4.x / Sonnet 4.x 对 `str_replace_based_edit_tool` 与 `bash` 工具的偏好已写进权重**。这就是 SDK / harness / 模型三者深度耦合的本质。

#### 维度 3：Permission & Approval

| Harness | 默认审批策略 | 升级机制 | "硬拦"能力 |
|---------|------------|---------|-----------|
| **Claude Code** | Permission allowlist（`settings.json`） | `--dangerously-skip-permissions` 跳过 | **PreToolUse Hook `deny` 即使 bypass 模式也强拦** |
| **Cursor** | 编辑器内"Apply / Reject" diff | Composer 自动模式可批量批准 | 无强制硬拦 |
| **Aider** | 自动 commit（git audit trail） | `--yes` 跳过批准 | 无（靠 git revert） |
| **Cline** | **每动作弹批准框（Plan / Act 模式）** | Auto-approve / YOLO mode | Checkpoint 每步快照可回滚 |
| **Codex CLI** | 三档：`read-only` / `auto`（默认） / `full access` | `:workspace` / `:danger-full-access` profile | 沙箱内不需要硬拦（隔离） |

**关键观察 — Hook 的确定性 vs 提示词的概率性**（深刻教训）：

Claude Code 的 Hook 系统是 2026 业界讨论最多的设计点。在 prompt 里写"提交前必须跑 lint"——模型可能跳过（概率性）；写成 PreToolUse Hook（shell 脚本）——保证执行（确定性）。**HumanLayer 总结**："success is silent, failures are verbose"——成功不污染 context，失败把错误注入 agent loop 让模型修。这是把 Coding Agent 从"玩具"变成"生产工具"的关键。

#### 维度 4：Sandbox & Runtime

| Harness | 沙箱路线 | 实现 | 真实 CVE / 风险 |
|---------|---------|------|---------------|
| **Claude Code** | **无沙箱**（靠 permission allowlist + Hook） | host 直接执行；推荐配合 macOS Sandbox Manager | CVE-2025-66479（BashTool 空白 allowlist）/ SOCKS5 null-byte 注入（v2.0.24-v2.1.89） |
| **Cursor** | 本地无沙箱；Cursor 3 起 Agents Window = 云端 VM | 默认本地直接跑 | 与 Claude Code 类似风险面 |
| **Aider** | **无沙箱**（git 是唯一防线） | host 直接执行 | 依赖 git diff review 习惯 |
| **Cline** | **无沙箱**（靠 Plan/Act 显式批准 + checkpoint） | host 直接执行 | 显式批准是首要防线 |
| **Codex CLI** | **OS 原生沙箱** | macOS Seatbelt 框架 / Linux/WSL2 bubblewrap / Windows Restricted Token+ACL | `workspace-write` 默认网络关；`danger-full-access` 等于无 |

**三种沙箱路线的本质权衡**：

```
OS 原生（Codex）                    云端 VM（Devin/Replit/Cursor 3）         无沙箱（Claude Code/Cline/Aider）
─────────────────────              ───────────────────────────────         ───────────────────────────────
+ 本地零成本                        + 极致隔离（VM 级别）                    + 零延迟、零基础设施
+ 文件直接 share                    + 可异步长跑（200 分钟自治）             + 用户拥有完整 host 能力
- 平台差异（macOS ≠ Linux）         - 需要 cold start（10-60s）              - 必须配 permission + Hook 防线
- 复杂规则维护                       - egress / data exfil 风险              - 用户审批疲劳是大问题
```

### 三、Claude Code 扩展生态深度剖析（五机制协同）

Claude Code 的扩展生态是 2026 最完整、最值得深入的 harness 设计范本。社区已总结的发布时间线：

```
2024-11  MCP (Model Context Protocol)            外部工具协议
2025-07  Subagents                                Context 隔离与并行
2025-09  Hooks                                    生命周期确定性触发
2025-10  Plugins                                  分发与打包
2025-10  Skills                                   Progressive Disclosure 知识包
2026-02  Agent Teams                              多 Subagent 编排
```

#### 五种机制的设计对照表

| 维度 | Slash Command | Skill | MCP | Subagent | Hook |
|------|--------------|-------|-----|----------|------|
| **触发** | 用户显式 `/cmd` | 模型自动判断 | 模型 tool_call | 任务委派（Agent tool） | 生命周期事件 |
| **加载成本** | ≈0（模板） | ~30-50 tokens metadata | 1k-50k+ tokens 起步 | 独立 context 隔离 | 注册时几乎为零 |
| **主要用途** | 重复 prompt 模板 | 流程化领域知识 | 外部世界访问 | 并行/隔离子任务 | 强制行为 |
| **文件结构** | 单 `.md` 文件 | 目录 + SKILL.md + 资源 | server 进程 | `.claude/agents/*.md` + frontmatter | `.claude/settings.json` hooks 字段 |
| **加载粒度** | 整体 | 三级渐进 | 全部 schema | 独立 system prompt | 不进 context |
| **确定性** | 用户主动（确定性） | 模型判断（概率性） | 模型决策（概率性） | 父 agent 决策（概率性） | **强制执行（确定性）** |

**记忆口诀**：
> **MCP = plumbing（管道）**
> **Skill = how to（手册）**
> **Slash = manual trigger（按钮）**
> **Subagent = isolation（隔间）**
> **Hook = guardrail（护栏）**

#### Skill 的 Progressive Disclosure 三级架构

Anthropic 把 Skill 拆为三层加载（官方文档明确）：

| 级别 | 加载时机 | Token 成本 | 内容 |
|------|---------|-----------|------|
| **L1 Metadata** | 启动时常驻 | ~50-100 tokens / Skill | YAML frontmatter 的 `name` + `description` |
| **L2 Instructions** | Claude 判断相关时读取 | ~275-8000 tokens | SKILL.md body 主体 |
| **L3 Resources** | bash 按需读取 | 无上限（不进 context） | bundled scripts / reference files |

**经济性证据**：17 个官方 skill 全加载只需 ~1700 token，等价于"知道几十种能力但只为一种付费"。

```yaml
# SKILL.md 必填字段示例
name: pdf-processing  # ≤64字符，小写/数字/连字符，禁用 "anthropic"/"claude"
description: Extract text and tables from PDF files. Use when working with PDFs.  # ≤1024字符

</div>

---

<div class="question-card compact-card" id="110-coding-agent-harness-comparison-2">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">Workflow</span></h2>

1. Use `python scripts/extract.py <file>` to extract text
2. ...
```

**核心机制**：Skill 不是把全部内容塞进 system prompt，而是 Claude 在 VM 中通过 bash `read SKILL.md` 显式读取。Script 文件在执行时只把 stdout 注入 context，代码本身不消耗 token。这是 2026 跨厂商采纳的第一个开放标准（OpenAI / Google / GitHub / Cursor 在两个月内集成）。

#### Hook 的 12+ 生命周期事件

Claude Code 官方支持的 hook 事件按 cadence 分类：

```
Per session:    SessionStart / SessionEnd / Setup
Per turn:       UserPromptSubmit / Stop / StopFailure
Per tool call:  PreToolUse / PostToolUse / PostToolBatch
Agent-related:  SubagentStart / SubagentStop / TaskCreated
MCP-related:    PermissionRequest / PermissionDenied / Elicitation
Async:          FileChanged / CwdChanged / PreCompact / PostCompact
```

5 种 handler 类型：`command`（shell） / `http`（POST 端点） / `mcp_tool` / `prompt`（单轮 LLM 评估） / `agent`（带工具的子 agent，实验性）。

**权限决策模型（PreToolUse 独有）**：

```json
// .claude/settings.json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "node /path/to/check-destructive.js"
          }
        ]
      }
    ]
  }
}
```

```javascript
// check-destructive.js — 示例 hook 输出
const input = JSON.parse(require('fs').readFileSync(0, 'utf-8'));
if (input.tool_input.command.match(/rm -rf|git push --force/)) {
  console.log(JSON.stringify({
    permissionDecision: "deny",  // 即使 --dangerously-skip-permissions 也硬拦
    reason: "Destructive command blocked by project policy"
  }));
  process.exit(0);
}
process.exit(0);  // allow
```

**Exit code 约定**（极易踩坑）：
- `0` = 成功（解析 stdout JSON）
- **`2` = blocking error（阻止动作）**
- 其他 = 非阻塞错误
- **注意**：`exit 1` 不阻断，必须 `exit 2` 才阻断

**Permission Decision 四值**：`allow` / `deny`（强拦） / `ask`（强制升级用户审批） / `defer`（走正常权限流程）。

#### Subagent vs MCP server 的边界

这是面试官最爱挖的细节问题：

| 维度 | Subagent | MCP server |
|------|---------|-----------|
| **本质** | Claude 的另一个实例 + 独立 context | 进程 / HTTP 服务 + 工具 schema |
| **解决的问题** | Context 隔离（防 poisoning）；并行探索 | 外部资源访问标准化（N×M 问题） |
| **数据传递** | 父发 prompt → 子返回 string | model `tool_call` → server response |
| **状态** | 子完整 context 不进父 context | server 自己管 state（HTTP）或 stdio |
| **典型用例** | 多文件代码重构、深度调研、并行验证 | 数据库查询、文件系统、GitHub、Sentry |
| **配置** | `.claude/agents/<name>.md` | `.claude/settings.json` 的 `mcpServers` |

**Subagent 的两种语义**：
- **默认 fresh-context**：每次启全新 200k 窗口，子任务跑完只返回最终 string，中间 tool_call 不进父 context
- **`CLAUDE_CODE_FORK_SUBAGENT=1` fork**：继承当前对话历史（基于已有上下文继续探索），代价是 fork 子 context 随父增长，且与 `--print` headless 模式不兼容

#### 实战例子：「提交前自动跑 lint + 写测试时按需加载测试规范」

这是 Scout-A Q3 的经典场景题，五机制如何协同：

```
需求拆解
├── lint 必须每次都跑                  → Hook（确定性）
│   └── PreToolUse on git commit / PostToolUse on Edit
├── 测试规范按需加载                   → Skill（progressive disclosure）
│   └── .claude/skills/testing-conventions/
├── 测试要跨多文件分析                  → Subagent（隔离）
│   └── .claude/agents/test-reviewer.md
├── 查 Sentry 报错                     → MCP（外部世界访问）
│   └── mcpServers: { sentry: { command: "...", args: [...] } }
└── 用户显式入口                       → Slash Command
    └── .claude/commands/run-tests.md → /run-tests
```

**错误用法（常见踩坑）**：
- 把 commit message format 做成 Skill → 应放 CLAUDE.md / AGENTS.md（频繁触发，不是按需）
- 指望 Skill 访问 GitHub → 应用 MCP（Skill 没工具能力，只有 bash 内 stdout）
- 把简单 prompt 模板做成 Skill → 应用 Slash Command（Skill 太重，过度设计）
- 在 prompt 里写"提交前必须跑 lint" → 应该是 Hook（模型可能跳过）

### 四、横向对比小结：选哪个 Harness？

```
团队选型决策树
│
├── 想要"最完整生态 + 深度可扩展"
│   └── Claude Code（五机制协同；锁 Claude 模型）
│
├── 想要"VS Code 原生体验 + 多窗口并发"
│   └── Cursor（Composer 自家模型 + Cursor 3 Agents Window）
│
├── 想要"git-first + 极简 + 多模型"
│   └── Aider（学习曲线最平，repo map 算法精妙）
│
├── 想要"显式 HITL + checkpoint 安全网"
│   └── Cline（Plan/Act 一等公民 + 2026-05 独立 SDK 跨 surface）
│
└── 想要"原生 OS 沙箱 + AGENTS.md 标准"
    └── Codex CLI（Rust 重写，Seatbelt/bubblewrap 隔离）
```

**SWE-bench Verified ≠ 唯一指标**：harness 的产品体验差异远大于跑分差异。Cursor 在交互流畅度上领先，Aider 在 git 集成与可解释性上领先，Claude Code 在生态深度上领先，Codex CLI 在沙箱安全上领先，Cline 在显式可控性上领先。**先问"我的场景看重哪个维度"，再选 harness**。

</div>

---

<div class="question-card compact-card" id="110-coding-agent-harness-comparison-3">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">常见误区 / 面试追问</span></h2>

- **误区 1：「Claude Code 五机制可以互相替代」** — 错。MCP / Skill / Slash / Subagent / Hook 各管一个独立的 context 问题，强行替代会过度设计或失效。常见错误：把 commit format 写成 Skill（应在 CLAUDE.md）、指望 Hook 给模型加知识（Hook 不进 context，应该是 Skill）、用 Skill 调 GitHub（应该用 MCP）。

- **误区 2：「Hook 和 Prompt 是一回事，反正都是让模型做什么」** — 这是 Coding Agent 从"玩具"到"生产工具"的核心分水岭。**Hook = 确定性（regardless of model behavior） / Prompt = 概率性（model may skip）**。在 CLAUDE.md 写"提交前必须跑 lint"——模型可能跳过；写成 PreToolUse hook——保证执行。这层分工不理解就做不出可靠的代码 Agent。

- **误区 3：「Cursor 3 的 Agents Window 让 Cursor 变成了 Devin」** — 不完全。Cursor 3 引入云端 sandbox VM，但**仍然以编辑器为主入口**；Devin 则是"全自治长跑"（200 分钟自治再交付）。两者形态不同：Cursor 是"IDE + 异步 agent 加成"，Devin 是"独立 SWE 代理"。

- **误区 4：「OpenAI Codex 模型可以无缝放到任何 harness 里」** — 错。Codex 模型在 post-training 阶段被绑定到 `apply_patch` 工具签名，OpenCode 团队发现脱离这个签名性能会掉。**Post-training coupling 是 2026 行业的硬约束**——模型与 harness 是深度耦合系统。

- **追问 1：「Aider 的 repo map 算法核心是什么？」** → 答：tree-sitter 解析所有源文件成 AST → 提取 `name.definition.*` 和 `name.reference.*` 两类 tag → NetworkX 构建文件依赖图（A 引用 B 定义的符号 → 有向边） → PageRank 排序（chat-mentioned files 50x 权重，well-named identifiers 10x 权重） → token 预算下二分查找最大塞入量。默认 `--map-tokens=1024`，无 chat 文件时膨胀 8x。这是"小窗口模型在大 repo 上能工作"的核心算法。

- **追问 2：「为什么 Claude Code 的 PreToolUse Hook `deny` 决策能强拦 `--dangerously-skip-permissions`？」** → 答：因为 Hook 是项目级别的**配置约束**而非"用户偏好"。Anthropic 的设计哲学是：项目所有者可以设置"用户即使加了 bypass flag 也不能越的红线"，这对企业 / 团队 / 开源项目至关重要。具体到代码，PreToolUse Hook 的 `permissionDecision: "deny"` 在 permission system 层面短路了所有 upstream 判断。

- **追问 3：「Skill 的 Progressive Disclosure 与 RAG 的检索式有什么区别？」** → 答：表面相似，本质不同。
  - **RAG**：query → embedding 检索 → top-k chunks 进 context；触发由"用户 query"驱动，粒度是 chunk
  - **Skill**：模型读到 frontmatter description → 自主判断 → bash 读 SKILL.md；触发由"模型判断"驱动，粒度是"完整流程文档 + scripts"
  - Skill 的关键创新是 **"模型选择加载什么知识"**，而 RAG 是"系统选择灌什么知识给模型"。前者更适合"流程性知识"（工作流、规范、检查清单），后者更适合"事实性知识"（文档、代码、数据）。

- **追问 4：「Cline 2026-05 把 runtime 从 IDE 剥离成 `@cline/sdk`，对行业意味着什么？」** → 答：意味着 Harness 进入"**runtime 独立化 + 多 surface 适配**"阶段。同一份 agent runtime 可跑 IDE / CLI / Web / CI，session 跨 surface 迁移（VSCode 启动的会话可在终端继续）。这预示 2026-2027 Harness 演进方向：**与产品形态解耦，与模型/工具/protocol 协同**。Claude Code 同期也在做类似分层（Claude Agent SDK 与 Claude Code CLI 解耦）。

- **追问 5：「Devin 与 Replit Agent 这种『云端长跑型』为什么没纳入横评？」** → 答：因为它们不是"本地 harness"而是"云端 agent 产品"，比较维度完全不同。Devin/Replit 的核心权衡是"自治长度 vs 失败重试经济学"（Devin 用 ACU 计费、Replit 200 分钟自治），而本题五个 harness 的核心权衡是"context / tool / permission / sandbox 四维选择"。两类产品形态适合两个不同问题：本地协作开发（Claude Code / Cursor / Aider / Cline / Codex CLI） vs 异步 SWE 代理（Devin / Replit）。

</div>

---

<div class="question-card compact-card" id="110-coding-agent-harness-comparison-4">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">参考资料</span></h2>

### 综合横评
- [Requesty — Agentic Coding Tools Compared 2026](https://www.requesty.ai/blog/agentic-coding-tools-compared-2026-claude-code-cursor-codex-aider) — 五大 harness 详细产品对比
- [thoughts.jock.pl — AI Coding Harness Agents 2026](https://thoughts.jock.pl/p/ai-coding-harness-agents-2026) — 行业评论与排名
- [Artificial Analysis — Coding Agents Leaderboard](https://artificialanalysis.ai/agents/coding) — Terminal Bench / SWE-bench 实时跑分
- [htek.dev — All Agent Harnesses: The Live Comparison](https://htek.dev/articles/all-agent-harnesses-live-comparison) — 持续更新的对比表

### Claude Code 五机制深度
- [Anthropic — Equipping Agents for the Real World with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) — Progressive Disclosure 官方源头
- [alexop.dev — Understanding Claude Code's Full Stack](https://alexop.dev/posts/understanding-claude-code-full-stack/) — 七层扩展全栈梳理
- [code.claude.com/docs/en/hooks](https://code.claude.com/docs/en/hooks) — Hook 官方文档（12+ 事件、5 种 handler、Exit code 约定）
- [code.claude.com/docs/en/sub-agents](https://code.claude.com/docs/en/sub-agents) — Subagent 官方文档
- [SwirlAI Newsletter — Agent Skills Progressive Disclosure](https://www.newsletter.swirlai.com/p/agent-skills-progressive-disclosure) — 17 个官方 skill 的 token 经济实证
- [Morph — Claude Code Skills vs MCP vs Plugins](https://www.morphllm.com/claude-code-skills-mcp-plugins) — 三件套实战对比

### Aider Repo Map 算法
- [Aider — Building a Better Repo Map with Tree-Sitter](https://aider.chat/2023/10/22/repomap.html) — tree-sitter + PageRank 算法原文
- [DeepWiki — Aider Repository Mapping System](https://deepwiki.com/Aider-AI/aider/4.1-repository-mapping-system)

### Codex CLI 与 Sandbox
- [developers.openai.com/codex/concepts/sandboxing](https://developers.openai.com/codex/concepts/sandboxing) — Seatbelt / bubblewrap / Restricted Token 官方说明
- [developers.openai.com/codex/cli/features](https://developers.openai.com/codex/cli/features) — 三档 approval mode + permission profile
- [developers.openai.com/codex/guides/agents-md](https://developers.openai.com/codex/guides/agents-md) — AGENTS.md 标准

### Cline SDK 与 Plan/Act
- [Cline Blog — Introducing the Cline SDK (2026-05-13)](https://cline.bot/blog/introducing-cline-sdk-the-upgraded-agent-runtime) — Runtime 与 IDE 解耦
- [GitHub — cline/cline](https://github.com/cline/cline) — 5M+ 安装的 VS Code 扩展
- [MarkTechPost — Cline SDK Coverage](https://www.marktechpost.com/2026/05/14/cline-releases-cline-sdk-an-open-source-agent-runtime-now-powering-its-cli-and-kanban-with-ide-extensions-being-migrated/)

### Harness Engineering 理论
- [HumanLayer — Skill Issue: Harness Engineering for Coding Agents](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents) — "It's not a model problem. It's a configuration problem."
- [Addy Osmani — Agent Harness Engineering](https://addyosmani.com/blog/agent-harness-engineering/) — Ralph Loop / Sprint Contracts / Planner-Generator-Evaluator split

### Cursor & Devin & Replit 参照
- [Cognition — Devin's 2025 Performance Review](https://cognition.ai/blog/devin-annual-performance-review-2025)
- [Replit — Introducing Agent 3](https://blog.replit.com/introducing-agent-3-our-most-autonomous-agent-yet) — 200 分钟自治

</div>
