---
custom: true
partTitle: LangGraph 面经题库 · LangGraph · 基础概念
partColor: #6366f1
---

<div class="part-hero custom-hero chapter-hero" style="--part-color: #6366f1">

# 🕸️ LangGraph · 基础概念

<p class="part-desc">LangGraph 面经题库 · 第 1/8 章 · 12 题</p>
<span class="part-round custom-tag">面试问答</span>

</div>

<div class="chapter-nav">

<a class="chapter-nav-link" href="../">📑 总览</a>

<a class="chapter-nav-link chapter-nav-next" href="state">📦 LangGraph · 状态管理 →</a>

</div>

<div class="question-card ai100-card interview-card compact-card" id="001-what-is-langgraph">

<h2 class="question-title"><span class="q-badge ai100-badge">Q1</span><span class="question-text">LangGraph 是什么？为什么它适合做 Agent？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐ · 标签：LangGraph, 基础 · 考察点：核心定位</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：LangGraph 是 LangChain 生态里的图编排框架，把 Agent 工作流建模成有状态的状态机，原生支持循环、分支、持久化和人机协同，适合需要多步决策和纠错的复杂 Agent。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和 LangChain 具体差在哪？ · 简单任务会不会过度设计？ · 执行模型是什么？</div>
</div>

**优先级**：P0 · 6+ 篇面经

#### 🗣️ 先用大白话说

LangGraph 可以理解成「给 AI Agent 用的流程编排工具」。普通问答像走直线：问一句、答一句就结束；但 Agent 往往要反复想、调工具、看结果、再调整，像走迷宫一样会绕圈。LangGraph 把这套流程画成一张图：每个步骤是一个节点，箭头决定下一步去哪，还能在中途暂停、存档、等人确认。所以它特别适合「要想好几步才能完成任务」的场景，比如科研文献问答、代码调试助手，而不是简单的单次翻译。

#### 📖 面试展开（详细版）

**① 是什么**

LangGraph 是 LangChain 生态里的图编排框架，底层把 Agent 工作流建模成「有状态的状态机」：全局 State 在各 Node 之间流转，Edge 决定跳转方向，Conditional Edge 还能根据当前状态动态选路。它不是 LLM 本身，而是 Agent 的「运行时引擎」——负责循环、分支、持久化和人机协同。

**② 为什么重要**

真实 Agent 任务很少「一次推断就结束」。科研 RAG Agent 典型流程是：检索 → 评估相关性 → 不够就改写 query 再检索 → 生成答案 → 检查引用是否靠谱，任何一步失败都可能要回退重试。用普通 Chain 写这种带环流程，逻辑会散落在嵌套 try-except 里，难以测试和观测。LangGraph 把控制流显式化，每个节点可单独单测，整条链路可 trace。

**③ 怎么用 / 执行流程**

典型用法：定义 AgentState（TypedDict）→ 用 StateGraph 注册节点和边 → compile 注入 checkpointer → invoke/stream 执行。每个 super-step 里，所有就绪节点并行跑，跑完通过 reducer 合并 state，再进入下一步。ReAct 闭环就是 agent 节点和 tool 节点之间加回边，条件边判断「继续调工具」还是 END。

**④ 项目例子（科研 RAG Agent）**

在 EvoAgent 科研问答场景里，用户问「某论文的方法论缺陷是什么」，图可能是：intent_node 识别需要深度检索 → rag_node 拉取相关段落 → grade_node 评估检索质量 → 不合格走 rewrite_node 改 query 回 rag_node → generate_node 生成带引用的回答 → citation_check_node 校验引用，不通过回 generate_node。这种多轮纠错用 LangGraph 一张图讲清楚，还能在 citation_check 前 interrupt 等人确认敏感结论。

**⑤ 常见坑**

简单 RAG 问答（检索→生成→结束）硬上 LangGraph 是过度设计；每请求重复 compile 图会拖慢延迟；没配 reducer 的列表字段在并发节点下会被覆盖；没设 recursion_limit 的 ReAct 环可能死循环。

#### 💡 核心要点
- 本质是状态机引擎：State 共享、Node 转移、Edge 路由
- 相比 DAG Chain，原生支持 Cycles（ReAct 闭环、重试、审批挂起）
- 适合「思考→行动→观察→再思考」的多轮 Agent，不适合一次性问答

#### 📝 代码/配置示例

```python
from langgraph.graph import StateGraph, START, END

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]

graph = StateGraph(AgentState)
graph.add_node("agent", call_model)
graph.add_node("tools", run_tools)
graph.add_conditional_edges("agent", should_continue, {"tools": "tools", "end": END})
graph.add_edge("tools", "agent")  # ReAct 回边
app = graph.compile()
```

#### 🔁 追问怎么接

- 追问「和 LangChain 差在哪」：强调 Chain 是线性 DAG，LangGraph 原生支持环 + checkpoint
- 追问「是否过度设计」：用「有没有真实分支/循环/审批」三问自证
- 追问「执行模型」：提 super-step 并行 + reducer 同步
- 追问「简单任务」：承认固定三步用 Chain 更合适，不必炫技
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="002-vs-langchain">

<h2 class="question-title"><span class="q-badge ai100-badge">Q2</span><span class="question-text">LangChain 和 LangGraph 有什么区别？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 标签：LangGraph, 基础 · 考察点：框架对比</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：LangChain 是线性 DAG 流水线，适合固定步骤 RAG；LangGraph 是图状态机，支持循环、条件分支、显式 State 和 checkpoint，适合复杂 Agent。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：什么场景必须用 LangGraph？ · 和纯 while 循环比优势？ · 能否混用？</div>
</div>

**优先级**：P0 · 6+ 篇面经

#### 🗣️ 先用大白话说

LangChain 擅长把「检索、拼 prompt、调模型」串成一条直线，适合标准化 RAG 和单次问答。LangGraph 在 LangChain 之上，把流程画成有向图，节点之间共享 State，边可以是条件跳转，还能走回边形成循环。最大的差别有三：控制流（能不能绕圈）、状态管理（有没有显式 schema 和 reducer）、生产特性（checkpoint 和 interrupt）。选型不看热度，看任务是否需要重试、回溯或人工审批。

#### 📖 面试展开（详细版）

**① 是什么**

LangChain 核心是 Chain 和 LCEL（LangChain Expression Language），用管道把 retriever、prompt template、LLM 串起来，本质是单向 DAG。LangGraph 是编排层，把流程建成 StateGraph：Node 是计算单元，Edge 是路由，State 是显式 schema，每步可 checkpoint。

**② 为什么重要**

阿里、字节、百度 Agent 岗一面几乎必问这题，考察你是否理解「什么时候该上图」。答不好会显得只会调 API、不懂工程取舍。面试官想听的是：你能根据业务特征选型，而不是追框架热度。

**③ 怎么用 / 执行流程**

LangChain 典型：retriever | prompt | llm 管道，一次 invoke 走完。LangGraph 典型：定义 State → add_node/add_edge → compile → 多次 super-step 循环直到 END。两者可混用：编排用 LangGraph，底层 retriever、message、tool 仍用 langchain_core 组件。

**④ 项目例子**

科研 RAG Agent 用 LangGraph：Retrieve → Grade → Rewrite 回 Retrieve → Generate → Citation check，不通过再回 Generate。这种带环流程用 Chain 要写大量嵌套 try-except 和手动状态变量；用 Graph 一张图可审计，每个 node 可单测。固定「检索→生成→格式化」三步则 Chain 二十行搞定。

**⑤ 常见坑**

有循环/审批/持久化需求却坚持用 Chain 套 while；反过来，固定线性三步硬上 LangGraph 增加团队学习成本；以为两者互斥——实际工程里常混用。

#### 💡 核心要点
- LangChain：无状态/外部管记忆，A→B→C 单向
- LangGraph：显式 State + reducer，可回边形成循环
- LangGraph 独有：interrupt、checkpointer、thread_id 会话隔离

#### 📝 代码/配置示例

```python
# LangChain：线性管道
chain = retriever | prompt | llm
result = chain.invoke({"question": q})

# LangGraph：带环图
graph.add_conditional_edges("grade", route, {"rewrite": "rewrite", "generate": "generate"})
graph.add_edge("rewrite", "retrieve")  # 回边
```

#### 🔁 追问怎么接

- 「必须用 LangGraph」：循环、HITL、多 Agent 协作，占一个就该上
- 「和 while 循环比」：LangGraph 有 reducer、checkpoint、可观测，while 只是裸循环
- 「能否混用」：能，编排 Graph + 组件 Chain 是常见实践
- 「缺点」：学习曲线陡、简单场景更重
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="003-why-choose-langgraph">

<h2 class="question-title"><span class="q-badge ai100-badge">Q3</span><span class="question-text">为什么选 LangGraph？有什么缺点？是否过度设计？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 基础 · 考察点：技术选型</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：选 LangGraph 是因为业务需要分支+状态+持久化；缺点是学习曲线陡、前期设计成本高；过度设计的判断标准是图的边是否对应真实业务分支。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么不直接用 Cursor/现成 Agent？ · 重做还会选吗？ · checkpoint 生命周期有规划吗？</div>
</div>

**优先级**：P0 · 5+ 篇面经

#### 🗣️ 先用大白话说

选 LangGraph 通常不是因为「新」，而是业务确实需要：条件路由、失败重试、审批挂起、跨请求恢复。它把分支逻辑、状态合并、断点续跑从业务代码里抽成一层，checkpoint 和 interrupt 是生产 Agent 的刚需。缺点也实在：学习曲线陡、要先画状态演化再写代码，简单三步直线反而更重。过度设计不是道德问题，是可量化问题——每条条件边是否对应真实业务分支？checkpoint 有没有生命周期策略？

#### 📖 面试展开（详细版）

**① 是什么**

这题考的是技术选型的因果链：先讲业务需求，再引出框架，顺序不能反。LangGraph 的价值在于把「分支 + 状态 + 持久化 + 人机协同」从散落各处的胶水代码，收敛到图编排层。

**② 为什么重要**

百度、阿里 Agent 岗高频追问「是不是过度设计」，区分「调过 demo」和「上过线」。能讲清取舍说明你有工程判断力，不是追新框架。

**③ 怎么用 / 判断标准**

选型三问：流程有没有环（重试/反思）？要不要中途挂起等人输入？要不要跨请求恢复中间状态？三个占一个值得考虑 LangGraph。过度设计三问：每条条件边对应真实业务分支吗？checkpoint 存的东西有 TTL/裁剪策略吗？图内 state 和外置记忆划界了吗？答不上来可能确实用重了。

**④ 项目例子**

EvoAgent 科研 Agent 有条件路由（深度检索 vs 快速回答）、失败重试（检索为空走 query rewrite）、审批挂起（敏感结论 citation_check 前 interrupt）。用 Chain 写会把分支和恢复散落在各处；LangGraph 把 checkpoint 和 interrupt 做成一等公民，省掉大量胶水代码。

**⑤ 常见坑**

图退化成「调模型→调工具→再调模型」三步直线仍用 Graph；没规划 checkpoint 生命周期导致膨胀；面试只讲框架不讲业务因果链。

#### 💡 核心要点
- 价值：把分支、状态、人机协同从业务代码抽成一层
- 缺点：简单线性三步场景反而更重；版本升级要跟进
- 过度设计：条件边是否映射真实分支？checkpoint 有无 TTL？

#### 📝 代码/配置示例

```python
# 编译时注入持久化和 interrupt
app = graph.compile(
    checkpointer=PostgresSaver(conn),
    interrupt_before=["human_review"],
)
```

#### 🔁 追问怎么接

- 「为什么不直接用 Cursor/现成产品」：要可控、可审计、可嵌入业务系统
- 「重做还会选吗」：按实际分支数和持久化需求诚实回答
- 「checkpoint 生命周期」：主动提 TTL、里程碑裁剪、外置记忆
- 「缺点」：学习成本、前期设计、简单场景不划算
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="004-graph-workflow-framework">

<h2 class="question-title"><span class="q-badge ai100-badge">Q4</span><span class="question-text">为什么 LangGraph 被称为图状工作流框架？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐ · 标签：LangGraph, 基础 · 考察点：图编排本质</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：因为它用 Node+Edge+State 显式建模控制流，支持条件分支、并行、循环，比隐式 Chain 更可审计、可测试。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和普通 Workflow 引擎差在哪？ · 图灵完备意味着什么？</div>
</div>

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

被称为「图状工作流」，是因为 LangGraph 不把 Agent 当成黑盒循环，而是把执行流程显式画成有向图：State 是共享数据，Node 是读 state、写更新的函数，Edge 决定下一步去哪。普通边固定跳转，条件边根据 state 动态路由。这和传统 Workflow 的差别在于：原生支持环（ReAct、重试）、状态自动合并（reducer）、compile 时可注入 checkpointer 变成可暂停的状态机。

#### 📖 面试展开（详细版）

**① 是什么**

「图状工作流框架」指用 Node + Edge + State 三元组建模控制流，而非隐式的函数嵌套或 prompt 内规划。每个节点是计算单元，边是路由逻辑，条件边让 LLM 或规则动态决定下一跳。

**② 为什么重要**

显式图比黑盒 Agent 更可审计、可测试、可观测。面试官加分点：能说出 super-step 执行模型——每个 super-step 里所有就绪节点并行跑，跑完同步 state，类似 Pregel/Bulk Synchronous Parallel。

**③ 怎么用 / 执行流程**

构建：StateGraph(AgentState) → add_node → add_edge / add_conditional_edges → compile。运行：从 START 出发，按边跳转，遇到回边形成循环，直到路由到 END。compile 期做结构检查（孤立节点等）。

**④ 项目例子**

科研 Agent 的 grade_node 用条件边：检索质量够 → generate，不够 → rewrite → 回 retrieve。整张图可视化后，新人能一眼看懂流程，比读嵌套 Python 快得多。

**⑤ 常见坑**

条件边路由不稳定（LLM 返回意外 key）导致跑飞；没画 END 出口；不理解 super-step 导致并发写 state 冲突。

#### 💡 核心要点
- 有向图：节点是计算单元，边是路由逻辑
- 条件边让 LLM/规则动态决定下一步
- 编译期检查孤立节点，运行期 super-step 同步状态

#### 📝 代码/配置示例

```python
graph.add_conditional_edges(
    "router",
    lambda s: s["next_step"],  # 纯函数读 state
    {"rag": "rag", "tool": "tool", "end": END},
)
```

#### 🔁 追问怎么接

- 「和普通 Workflow 差在哪」：原生环 + reducer + checkpoint
- 「图灵完备」：条件边 + 回边可表达任意控制流，但应克制使用
- 加分：提 super-step 并行同步模型
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="005-stategraph">

<h2 class="question-title"><span class="q-badge ai100-badge">Q5</span><span class="question-text">StateGraph 是什么？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐ · 标签：LangGraph, 基础 · 考察点：核心 API</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：StateGraph 是 LangGraph 的图构建器，规定 State schema，注册 Node 和 Edge，compile 后变成可执行的 Runnable。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：compile 做什么检查？ · StateGraph 和 MessageGraph 区别？</div>
</div>

**优先级**：P0 · 4+ 篇

#### 🗣️ 先用大白话说

StateGraph 是 LangGraph 里「搭图」的核心类。你先用 TypedDict 定义 AgentState，告诉框架有哪些字段、哪些用 reducer 合并。然后 add_node 注册步骤，add_edge 连边，set_entry_point 定入口。最后 compile 把图变成可执行对象，会做结构检查并注入 checkpointer、interrupt 等配置。编译后的 app 支持 invoke、stream、get_state。

#### 📖 面试展开（详细版）

**① 是什么**

StateGraph 是 LangGraph 的图构建器（Builder），不是运行时本身。它接收 State schema，提供 add_node、add_edge、add_conditional_edges 等 API 组装图，compile 后产出 LangChain Runnable。

**② 为什么重要**

这是写 LangGraph 的第一步，面试常结合「State 怎么设计」一起考。理解 StateGraph 等于理解「声明式构图 + 编译执行」的两阶段模型。

**③ 怎么用 / 执行流程**

1. 定义 AgentState（TypedDict + Annotated reducer）
2. graph = StateGraph(AgentState)
3. graph.add_node("name", fn) 注册节点
4. graph.add_edge(START, "first") / add_conditional_edges 连边
5. app = graph.compile(checkpointer=...) 编译
6. app.invoke(initial_state, config={"configurable": {"thread_id": "..."}})

**④ 项目例子**

EvoAgent 里 StateGraph 注册 intent、rag、grade、rewrite、generate、citation_check 六个节点，条件边连接，compile 时注入 PostgresSaver 和 interrupt_before=["citation_check"]。

**⑤ 常见坑**

每请求 compile 一次（应启动时全局单例）；State schema 和节点返回字段不一致；忘记 set_entry_point 或 START 边。

#### 💡 核心要点
- StateGraph(AgentState) 初始化，State 是全部节点的输入输出 schema
- add_node / add_edge / add_conditional_edges 组装图
- compile(checkpointer=...) 固化图并注入持久化

#### 📝 代码/配置示例

```python
from langgraph.graph import StateGraph, START

graph = StateGraph(AgentState)
graph.add_node("retrieve", retrieve_node)
graph.add_edge(START, "retrieve")
graph.add_conditional_edges("retrieve", route_fn, path_map)
app = graph.compile(checkpointer=memory)
```

#### 🔁 追问怎么接

- 「compile 检查什么」：孤立节点、入口/出口可达性
- 「和 MessageGraph」：MessageGraph 是 messages-only 特例
- 「compile 后能否改图」：不能，改定义需重新 compile
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="006-node-edge-conditional">

<h2 class="question-title"><span class="q-badge ai100-badge">Q6</span><span class="question-text">Node、Edge、Conditional Edge 分别是什么？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐ · 标签：LangGraph, 基础 · 考察点：图三要素</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Node 是处理 state 的函数；Edge 是固定跳转；Conditional Edge 用路由函数根据 state 动态选择下一节点。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：Node 能放什么逻辑？ · 条件边不稳定怎么办？</div>
</div>

**优先级**：P0 · 4+ 篇

#### 🗣️ 先用大白话说

Node 是图里的工作单元，本质就是 Python 函数：接收当前 state，返回要合并的更新字典，可以是 LLM 调用、工具执行或规则判断。普通 Edge 表示 A 跑完一定去 B。Conditional Edge 是 A 跑完后调用路由函数读 state，返回值查表决定下一跳——这是 Agent 动态决策的关键，比如看最后一条 message 有没有 tool_calls。START 和 END 是虚拟入口和终止节点。

#### 📖 面试展开（详细版）

**① 是什么**

Node：(state) -> partial_update dict，不应直接 mutate state。Edge：固定跳转 add_edge("A", "B")。Conditional Edge：add_conditional_edges("A", route_fn, path_map)，route_fn 是纯函数，只读 state 返回 key。

**② 为什么重要**

三要素是构图的基本词汇，阿里淘天一面爱结合「状态流转」考。条件边是 ReAct Agent「继续调工具 vs 结束」的核心机制。

**③ 怎么用 / 执行流程**

ReAct 典型：agent_node 调 LLM → 条件边看 response 有没有 tool_calls → 有则去 tools_node → 普通边回 agent_node → 循环直到条件边路由到 END。

**④ 项目例子**

科研 Agent 的 grade_node 后条件边：quality_score >= 0.7 → generate，否则 → rewrite。路由函数只读 retrieval_docs 和 score，便于单测。

**⑤ 常见坑**

节点内直接改 state 而非返回 update；条件边路由函数不稳定（LLM 输出飘）；路由 map 漏 key 导致 KeyError；节点里做不可重试的副作用（发邮件）无幂等。

#### 💡 核心要点
- Node：同步/异步 Python 函数，返回 partial state dict
- 普通 Edge：A 执行完必定去 B
- Conditional Edge：path_function(state) 返回 key，映射到目标节点

#### 📝 代码/配置示例

```python
def route(state) -> str:
    last = state["messages"][-1]
    if last.tool_calls:
        return "tools"
    return "end"

graph.add_conditional_edges("agent", route, {"tools": "tools", "end": END})
graph.add_edge("tools", "agent")
```

#### 🔁 追问怎么接

- 「Node 能放什么」：LLM、工具、规则、任意 Python，但副作用要幂等
- 「条件边不稳定」：加 fallback 边、step_count 上限、规则兜底
- 「多个出口」：路由 map 里多个 key 指向 END 或不同分支
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="007-compile-graph">

<h2 class="question-title"><span class="q-badge ai100-badge">Q7</span><span class="question-text">compile 编译图的作用是什么？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐ · 标签：LangGraph, 基础 · 考察点：编译机制</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：compile 做结构校验、注入 checkpointer/interrupt 配置，产出可复用的 Runnable；生产环境应全局单例编译，不要每请求 compile。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：编译后能改图吗？ · 图迁移怎么做？</div>
</div>

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

compile 是把「图定义」变成「可运行实例」的步骤。它会检查图结构是否合法（比如有没有够不着的节点），并在编译参数里绑定 checkpointer、interrupt 点、recursion_limit 等运行时配置。编译后得到 LangChain Runnable，可以 invoke、stream、batch。生产里图应该在应用启动时 compile 一次、全局复用——每个 HTTP 请求都 compile 是常见性能坑。

#### 📖 面试展开（详细版）

**① 是什么**

compile 是构建期到运行期的桥梁：StateGraph（声明式定义）→ CompiledGraph（Runnable 实例）。编译时固化图拓扑和运行时配置，运行时不再改结构。

**② 为什么重要**

区分「调过 demo」和「上过线」的细节：生产必须单例 compile；图变更需考虑旧 thread 迁移。百度面经爱追问 checkpoint 与 compile 的关系。

**③ 怎么用 / 执行流程**

启动时：app = graph.compile(checkpointer=saver, interrupt_before=[...]) 编译一次。请求时：app.invoke(input, config) 复用同一 app。图定义变更后需重新 compile，旧 thread 的 state schema 要向后兼容。

**④ 项目例子**

EvoAgent FastAPI 服务在 lifespan 里 compile 一次，注入 PostgresSaver；每个请求只传不同 thread_id，不重复 compile。延迟从 ~200ms 降到个位数 ms。

**⑤ 常见坑**

每请求 compile；compile 后才 add_node（无效，需重新 compile）；state schema 变更无迁移策略导致旧 checkpoint 读失败。

#### 💡 核心要点
- 检查图结构合法性（无孤立节点等）
- 注入 checkpointer、interrupt_before/after
- 编译一次全局复用，避免每请求开销

#### 📝 代码/配置示例

```python
# 应用启动时 compile 一次
app = workflow.compile(
    checkpointer=PostgresSaver.from_conn_string(DB_URL),
    interrupt_before=["human_review"],
)

# 每个请求复用 app，只换 thread_id
config = {"configurable": {"thread_id": session_id}}
```

#### 🔁 追问怎么接

- 「编译后能改图吗」：不能，改定义需重新 compile 新 app
- 「图迁移」：state schema 向后兼容，新增字段给默认值，灰度新旧并行
- 「性能」：强调全局单例，给出延迟对比
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="008-end-node">

<h2 class="question-title"><span class="q-badge ai100-badge">Q8</span><span class="question-text">END 节点为什么重要？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐ · 标签：LangGraph, 基础 · 考察点：图终止</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：END 是显式终止符，条件边必须能路由到 END，否则图可能无限循环或无法判断完成。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：怎么判断 Agent 该结束了？ · 多个出口怎么设计？</div>
</div>

**优先级**：P2 · 1 篇

#### 🗣️ 先用大白话说

END 是 LangGraph 的虚拟终止节点。条件边路由函数可以返回 END，表示任务完成、不再继续。显式终止很重要，因为 Agent 循环里「什么时候停」是核心难题——不能全靠 recursion_limit 硬砍，否则用户看到的是 500 错误而不是优雅结束。好的做法是条件边同时看：LLM 是否不再请求工具，以及 step_count 或业务标志位是否达标。

#### 📖 面试展开（详细版）

**① 是什么**

END 是 LangGraph 内置的特殊节点，路由到 END 表示图执行终止，返回最终 state。从 START 到 END 是一条合法执行路径。

**② 为什么重要**

ReAct Agent 若无明确 END 路径，会在 agent↔tools 环里转直到 GraphRecursionError。用户体验差，且浪费 token 和 API 费用。

**③ 怎么用 / 执行流程**

条件边 path_map 必须包含到 END 的映射，如 {"end": END, "tools": "tools"}。路由函数判断：无 tool_calls → "end"；或 step_count >= max → "end"；或业务标志 task_done → "end"。recursion_limit 作为最后防线。

**④ 项目例子**

科研 Agent 在 generate 后 citation_check 通过 → END；不通过且 retry_count < 3 → 回 generate；retry 耗尽 → fallback_node → END。

**⑤ 常见坑**

路由 map 无 END 路径；只靠 recursion_limit 不设业务终止条件；多个出口未区分「成功 END」和「失败 END」（应用不同 fallback 节点再 END）。

#### 💡 核心要点
- END 标记图执行终止，触发最终 state 返回
- 条件边应包含到 END 的路径
- 结合 recursion_limit 和业务完成标志双重保险

#### 📝 代码/配置示例

```python
from langgraph.graph import END

def should_continue(state):
    if state.get("step_count", 0) >= 10:
        return "end"
    if not state["messages"][-1].tool_calls:
        return "end"
    return "tools"

graph.add_conditional_edges("agent", should_continue, {"tools": "tools", "end": END})
```

#### 🔁 追问怎么接

- 「怎么判断该结束」：无 tool_calls + 业务标志 + step 上限三重
- 「多个出口」：成功 END vs fallback→END，state 里记录 exit_reason
- 「和 recursion_limit」：END 是优雅终止，recursion_limit 是硬兜底
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="009-messagegraph-vs-stategraph">

<h2 class="question-title"><span class="q-badge ai100-badge">Q9</span><span class="question-text">MessageGraph 和 StateGraph 的区别？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐ · 标签：LangGraph, 基础 · 考察点：图类型</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：MessageGraph 是仅管理 messages 列表的特例，预置 add_messages；StateGraph 可定义任意 State 字段，更灵活。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：聊天 Agent 用哪个？ · 多字段 state 何时必须 StateGraph？</div>
</div>

**优先级**：P2 · 1 篇

#### 🗣️ 先用大白话说

MessageGraph 是 StateGraph 的简化版，state 主要就是 messages 列表，内置 add_messages 做消息追加和去重，适合快速搭简单聊天 Agent。StateGraph 允许定义任意字段：current_intent、retrieval_context、approval_status 等，每个字段可配不同 reducer。一旦 Agent 不只有对话，还要管检索结果、路由标志、审批状态，就必须用 StateGraph。

#### 📖 面试展开（详细版）

**① 是什么**

MessageGraph：预置 messages channel + add_messages reducer，API 更短。StateGraph：通用构建器，State 可以是任意 TypedDict，支持多 channel 和多 reducer。

**② 为什么重要**

选型影响后续扩展成本。从 MessageGraph 迁到 StateGraph 要改 schema 和所有节点签名，早选型省重构。

**③ 怎么用 / 执行流程**

简单聊天：MessageGraph() → add_node → compile，节点只读写 messages。复杂 Agent：StateGraph(AgentState) 定义多字段，节点按需更新不同 channel。

**④ 项目例子**

EvoAgent 最初用 MessageGraph 原型，加 retrieval_docs、quality_score、citation_status 后迁 StateGraph，否则这些字段无处安放。

**⑤ 常见坑**

复杂 Agent 仍用 MessageGraph 把业务字段塞进 message content；迁移时 checkpoint 旧 schema 不兼容。

#### 💡 核心要点
- MessageGraph：messages channel + add_messages reducer
- StateGraph：自定义 TypedDict，支持多业务字段
- 复杂 Agent 几乎都用 StateGraph

#### 📝 代码/配置示例

```python
# MessageGraph：仅 messages
from langgraph.graph import MessageGraph
mg = MessageGraph()
mg.add_node("chat", call_model)

# StateGraph：多字段
class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    retrieval_docs: Annotated[list, operator.add]
    current_intent: str
```

#### 🔁 追问怎么接

- 「聊天 Agent 用哪个」：纯聊天 MessageGraph 够；要带 RAG/工具状态用 StateGraph
- 「何时必须 StateGraph」：除 messages 外有任何跨节点共享字段
- 「迁移成本」：schema 变更 + 节点改造 + checkpoint 兼容
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="010-vs-workflow">

<h2 class="question-title"><span class="q-badge ai100-badge">Q10</span><span class="question-text">LangGraph 相比普通 Workflow 的最大价值是什么？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 标签：LangGraph, 基础 · 考察点：Workflow 对比</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Workflow 线性 A→B→C，卡住只能整体重试；LangGraph 有环、有共享 State、有 checkpoint 和 HITL，适合多轮决策任务。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：什么时候不必用 LangGraph？ · 迁移成本多大？</div>
</div>

**优先级**：P0 · 3+ 篇

#### 🗣️ 先用大白话说

普通 Workflow 或 LCEL Chain 是线性的：检索、生成、格式化三步走完，中间某步失败通常只能整链重试，不能「回到某步换策略」，也没有跨请求 state 持久化。LangGraph 把流程变成有向图，价值在三方面：可循环可跳转（代码生成→运行→改错）、显式 State 跨节点共享、interrupt 任意节点等人审批。高德面经观点：先用 Workflow 跑通，遇到循环/回溯痛点再迁 LangGraph。

#### 📖 面试展开（详细版）

**① 是什么**

Workflow（含 LCEL Chain、Airflow 式线性 DAG）：A→B→C 单向，无原生环和 checkpoint。LangGraph：有向图 + State + checkpointer + interrupt，是「可暂停的状态机 Workflow」。

**② 为什么重要**

高德、CSDN 面经高频题，考察「不必用 LangGraph」的判断力。答「什么都用 LangGraph」和答「永远不用」都不好。

**③ 怎么用 / 选型**

必须用 LangGraph：循环（ReAct/代码修复）、HITL（审批）、多 Agent 有依赖。不必用：固定三步（检索→生成→格式化），Workflow 二十行搞定。迁移：先 Workflow 跑通 MVP，痛点出现再逐步节点化。

**④ 项目例子**

保存草稿：上传→解析→存库，Workflow 够用。科研 Agent：检索→评估→改写→再检索→生成→校验，必须 LangGraph。EvoAgent 先做线性 RAG Chain，加 citation 校验失败后重生成时才迁 Graph。

**⑤ 常见坑**

固定流程硬上图；该用 Graph 时用 while 裸循环；迁移时不做 state schema 设计直接翻译代码。

#### 💡 核心要点
- Workflow：无状态、线性、难中断
- LangGraph：可循环、可回溯、可人工介入
- 固定三步任务 Workflow 20 行搞定，不必上图

#### 📝 代码/配置示例

```python
# Workflow：线性，无环
chain = retriever | grader | generator

# LangGraph：带环 + checkpoint
graph.add_edge("run_code", "agent")  # 失败回 agent 改代码
app = graph.compile(checkpointer=saver)
```

#### 🔁 追问怎么接

- 「不必用」：固定三步、无环、无审批、无跨请求恢复
- 「迁移成本」：重构图结构 + 定义 State + 配 checkpointer，1-3 天视复杂度
- 「能否用 Graph 做确定性 Workflow」：能，固定边即可，但简单场景过重
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="011-vs-autogen-crewai">

<h2 class="question-title"><span class="q-badge ai100-badge">Q11</span><span class="question-text">LangGraph vs AutoGen vs CrewAI 怎么选？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 基础 · 考察点：框架选型</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：LangGraph 强在可控、可审计、可恢复，适合严肃生产系统；CrewAI 快速原型；AutoGen 多 Agent 协作实验。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：团队没有图编排经验怎么办？ · 长期维护哪个成本低？</div>
</div>

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

三个框架哲学不同。LangGraph 把 Agent 当状态机建，显式定义状态、节点、边，可控性和可恢复性最好，适合长链路、要审计、要 HITL 的生产系统，代价是前期设计重。CrewAI 用角色和任务描述快速搭多 Agent，上手快，适合原型。AutoGen 强调 Agent 间对话协作，适合研究实验，生产里行为较难约束。决策树：怕失控、要 checkpoint、链路复杂 → LangGraph；今天要 demo → CrewAI；研究多 Agent 对话 → AutoGen。

#### 📖 面试展开（详细版）

**① 是什么**

LangGraph：显式状态机编排，LangChain 生态。CrewAI：角色（Role）+ 任务（Task）+ Crew 抽象，YAML 式配置多 Agent。AutoGen：对话式多 Agent，GroupChat 驱动协作。

**② 为什么重要**

字节、独角兽面经爱问框架对比，考察广度与深度。不必装全用过，但要讲清哲学差异和选型依据。

**③ 怎么用 / 决策树**

生产长链路 + checkpoint + HITL → LangGraph。快速多 Agent 原型 → CrewAI。研究/实验性对话协作 → AutoGen。团队无图编排经验：先用 CrewAI 验证需求，复杂度上来再迁 LangGraph。

**④ 项目例子**

EvoAgent 选 LangGraph 因为 citation 校验失败要回环、敏感结论要 interrupt，需要可审计的节点级 trace。同团队另一个内部提效 demo 用 CrewAI 三天出原型。

**⑤ 常见坑**

生产系统用 AutoGen 难控行为；复杂链路用 CrewAI 后期难维护；选 LangGraph 但团队无人懂 reducer/checkpoint。

#### 💡 核心要点
- LangGraph：显式状态机，学习曲线陡，链路最稳
- CrewAI：角色+任务快速成型，中等复杂度
- AutoGen：对话式协作表达强，行为更动态难控

#### 📝 代码/配置示例

```python
# LangGraph：显式图
graph.add_node("researcher", research)
graph.add_conditional_edges("supervisor", route, {...})

# CrewAI：角色驱动
# researcher = Agent(role="Researcher", goal="...")
# crew = Crew(agents=[...], tasks=[...])
```

#### 🔁 追问怎么接

- 「团队无经验」：先 CrewAI 验证，再迁 LangGraph；或招/培一个图编排 owner
- 「长期维护」：LangGraph 随复杂度上升优势放大，CrewAI 中等复杂度性价比最高
- 「能否混用」：可以，LangGraph 编排 + 调用 CrewAI 子任务
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="012-langgraph-and-agent">

<h2 class="question-title"><span class="q-badge ai100-badge">Q12</span><span class="question-text">LangGraph 和 Agent 的关系是什么？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐ · 标签：LangGraph, 基础 · 考察点：概念关系</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Agent 是「能感知、决策、行动」的系统；LangGraph 是编排 Agent 循环、工具调用和分支的引擎，不是 Agent 本身。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：能否用 LangGraph 实现确定性 Workflow？ · 黑盒 Agent 和白盒图区别？</div>
</div>

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

Agent 是系统能力：能根据目标自主调用工具、多轮推理、处理反馈。LangGraph 不负责「让 LLM 变聪明」，它负责把 Agent 的执行流程搭成可观测、可恢复的状态机。早期 LangChain Agent 是黑盒——给工具和目标它自己跑，中间难控；LangGraph 是白盒——每个节点、每条边你都显式定义。固定边就是 Workflow，LLM 决策的条件边就是 Agent。

#### 📖 面试展开（详细版）

**① 是什么**

Agent = LLM + 工具 + 记忆 + 规划循环（感知→决策→行动）。LangGraph = 编排引擎，提供循环（回边）、路由（条件边）、持久化（checkpoint）、人机协同（interrupt）的运行时。

**② 为什么重要**

高德面经原题，考察概念清晰度。把 LangGraph 等同于 Agent 会显得基础不牢；说 LangGraph 只是 Workflow 又忽略了 Agent 编排能力。

**③ 怎么用 / 关系**

LangGraph 不生成答案，它组织「谁什么时候调 LLM、什么时候调工具、失败了从哪重试」。用固定边 + 无 LLM 路由 → 确定性 Workflow。用条件边 + ReAct 回边 → Agent。

**④ 项目例子**

EvoAgent：Agent 能力由 LLM+检索工具+引用校验组成；LangGraph 编排 intent→rag→grade→generate→check 的流程，并在 check 前 interrupt 等人确认。

**⑤ 常见坑**

以为 LangGraph 替代 LLM；黑盒 AgentExecutor 和 LangGraph 白盒图混为一谈；用 LangGraph 但所有决策仍塞 prompt 里（图退化为直线）。

#### 💡 核心要点
- Agent = LLM + 工具 + 记忆 + 规划循环
- LangGraph 提供循环、路由、状态持久化的运行时
- 可用 LangGraph 实现 Workflow（固定边）或 Agent（条件边）

#### 📝 代码/配置示例

```python
# Agent 循环：条件边 + 回边
graph.add_node("agent", call_llm_with_tools)
graph.add_node("tools", execute_tools)
graph.add_conditional_edges("agent", has_tool_calls, {"yes": "tools", "no": END})
graph.add_edge("tools", "agent")
```

#### 🔁 追问怎么接

- 「确定性 Workflow」：能，全部用普通边、无 LLM 路由即可
- 「黑盒 vs 白盒」：AgentExecutor 黑盒；LangGraph 每步可见可测
- 「LangGraph 是 Agent 吗」：不是，是 Agent 的运行时/编排层
</div>
</details>

</div>

---

<div class="chapter-nav">

<a class="chapter-nav-link" href="../">📑 总览</a>

<a class="chapter-nav-link chapter-nav-next" href="state">📦 LangGraph · 状态管理 →</a>

</div>
