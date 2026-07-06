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

**📖 核心要点**
- 本质是状态机引擎：State 共享、Node 转移、Edge 路由
- 相比 DAG Chain，原生支持 Cycles（ReAct 闭环、重试、审批挂起）
- 适合「思考→行动→观察→再思考」的多轮 Agent，不适合一次性问答

**🗣️ 标准口语答案**

LangGraph 是建立在 LangChain 核心之上的一款编排库，专门构建有状态、多参与者的循环计算图。底层可以看成状态机：全局 State 在各 Node 之间流转，Conditional Edge 决定下一步去哪。

它适合做 Agent，因为真实 Agent 任务很少是一次性推断。比如研究型 Agent 要走 ReAct：思考、调工具、看结果、再思考。传统 Chain 是 DAG，中间失败往往直接崩或幻觉；LangGraph 允许重试、换参数再调工具、危险操作前挂起等人确认。

我会强调它不是「更高级的 LangChain」，而是补上了 Chain 缺的循环、显式状态和生产级 checkpoint。简单 RAG 问答仍用 Chain 更合适；一旦流程有环、有审批、有跨请求恢复，LangGraph 的优势才明显。
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

**📖 核心要点**
- LangChain：无状态/外部管记忆，A→B→C 单向
- LangGraph：显式 State + reducer，可回边形成循环
- LangGraph 独有：interrupt、checkpointer、thread_id 会话隔离

**🗣️ 标准口语答案**

LangChain 核心是 Chain 和 LCEL，用管道把 retriever、prompt、LLM 串起来，适合标准化 RAG 和单次问答。它的控制流基本是静态的，一旦你要 loop、回退、等人审批，外面得套 while 或把逻辑塞进 prompt。

LangGraph 把流程建成有向图：Node 是步骤，Edge 是跳转，State 是显式 schema，每步可 checkpoint。我的科研问答就是典型 Graph：Retrieve → Grade → 不够就 Rewrite 回 Retrieve → Generate → Citation check，不通过再回 Generate。这种带环流程用 Chain 要写大量嵌套 try-except，用 Graph 一张图讲清楚，还能按 node 单测。

选型上：固定三四步用 Chain；有循环依赖、要持久化中间状态、要人机协同中断点，三个占一个就该上 LangGraph。工程上我常混用——编排用 LangGraph，底层组件用 langchain_core 的 message、retriever。
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

**📖 核心要点**
- 价值：把分支、状态、人机协同从业务代码抽成一层
- 缺点：简单线性三步场景反而更重；版本升级要跟进
- 过度设计：条件边是否映射真实分支？checkpoint 有无 TTL？

**🗣️ 标准口语答案**

我选 LangGraph 不是因为追新，而是业务确实需要图编排。比如有条件路由、失败重试、审批挂起——用 Chain 写会把分支和恢复散落在各处，难维护也难 debug。LangGraph 把 checkpoint 和 interrupt 做成一等公民，用在审批或补全流程里，省掉的胶水代码很实在。

缺点我也承认：学习曲线比 Chain 陡，团队得统一理解 State、reducer、compile；前期要先画状态演化再写代码。如果图退化成「调模型→调工具→再调模型」三步直线，框架复杂度就不划算。

过度设计不是道德问题，是可量化问题：每条条件边对应真实业务分支吗？checkpoint 里存的东西有生命周期策略吗？图内 state 和外置记忆划界了吗？答不上来可能确实用重了。面试时我会先讲业务因果链，再引出 LangGraph 作为承载工具，顺序不能反。
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

**📖 核心要点**
- 有向图：节点是计算单元，边是路由逻辑
- 条件边让 LLM/规则动态决定下一步
- 编译期检查孤立节点，运行期 super-step 同步状态

**🗣️ 标准口语答案**

被称为图状工作流，是因为它不把 Agent 当成黑盒循环，而是把执行流程建模成有向图。State 是共享数据结构，Node 是读 state、写 partial update 的函数，Edge 定义逻辑流向——普通边固定跳转，条件边根据 state 动态路由。

这和传统 Workflow 的差别在于：第一，原生支持环，ReAct、重试、反思都是回边；第二，状态在节点间自动合并，有 reducer 语义；第三，compile 时可注入 checkpointer，整个图变成可暂停、可恢复的状态机。

面试加分点是能说出 super-step 执行模型：每个 super-step 里所有就绪节点并行跑，跑完同步 state，再进入下一步。类似 Pregel，所以能处理并行分支又保证一致性。
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

**📖 核心要点**
- StateGraph(AgentState) 初始化，State 是全部节点的输入输出 schema
- add_node / add_edge / add_conditional_edges 组装图
- compile(checkpointer=...) 固化图并注入持久化

**🗣️ 标准口语答案**

StateGraph 是 LangGraph 里定义图的核心类。你先用 TypedDict 或 Pydantic 定义 AgentState，告诉框架有哪些 channel、哪些字段用什么 reducer 合并。然后通过 add_node 注册计算单元，add_edge 和 add_conditional_edges 连边，set_entry_point 或 add_edge(START, ...) 定入口。

最后 compile 把图编译成可执行对象。编译会做结构检查，比如有没有孤立节点，同时在这里注入 checkpointer、interrupt 配置。编译后的 app 支持 invoke、stream、get_state 等 API。

和 MessageGraph 比，StateGraph 更通用——State 可以是任意 TypedDict；MessageGraph 是 messages 列表的特例，底层仍基于 StateGraph，只是帮你预置了 add_messages reducer。
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

**📖 核心要点**
- Node：同步/异步 Python 函数，返回 partial state dict
- 普通 Edge：A 执行完必定去 B
- Conditional Edge：path_function(state) 返回 key，映射到目标节点

**🗣️ 标准口语答案**

Node 是图里的工作单元，本质就是 Python 函数，接收当前 state，返回要合并的更新字典。可以是 LLM 调用、工具执行、规则判断，任何逻辑都行。注意节点不应直接 mutate state，只返回 update。

Edge 分两种。普通边 add_edge("A", "B") 表示 A 跑完一定去 B。条件边 add_conditional_edges("A", route_fn, {"tools": "tools", "end": END}) 表示 A 跑完后调用 route_fn 读 state，返回值查表决定下一跳。这是 Agent 动态决策的关键——比如看最后一条 message 有没有 tool_calls。

START 和 END 是虚拟节点，标记入口和终止。条件路由不稳定是常见坑，我会加 fallback 边和超时计数，避免 LLM 路由飘到错误分支。
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

**📖 核心要点**
- 检查图结构合法性（无孤立节点等）
- 注入 checkpointer、interrupt_before/after
- 编译一次全局复用，避免每请求开销

**🗣️ 标准口语答案**

compile 是把图定义变成可运行实例的步骤。它会做基本结构检查，比如有没有 unreachable 节点，然后在编译参数里绑定 checkpointer、interrupt 点、recursion_limit 等运行时配置。

编译后得到的是 LangChain Runnable，可以 invoke、stream、batch。生产实践里图应该在应用启动时 compile 一次，全局单例复用。每来一个 HTTP 请求就 compile 是常见性能坑，延迟会明显上去。

图定义变更后，启用 checkpointer 的 thread 可能需要迁移策略——state schema 向后兼容、新增字段给默认值、灰度期间新旧图并行。
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

**📖 核心要点**
- END 标记图执行终止，触发最终 state 返回
- 条件边应包含到 END 的路径
- 结合 recursion_limit 和业务完成标志双重保险

**🗣️ 标准口语答案**

END 是 LangGraph 的虚拟终止节点。条件边路由函数可以返回 END，表示任务完成、不再继续。显式终止很重要，因为 Agent 循环里「什么时候停」是核心问题——不能全靠 recursion_limit 硬砍。

我的做法是条件边同时看两个信号：LLM 是否不再请求工具（任务完成），以及 state 里的 step_count 或业务标志位。路由映射里一定要有到 END 的路径，否则图可能一直在环里转直到抛 GraphRecursionError，用户体验是 500 而不是优雅结束。
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

**📖 核心要点**
- MessageGraph：messages channel + add_messages reducer
- StateGraph：自定义 TypedDict，支持多业务字段
- 复杂 Agent 几乎都用 StateGraph

**🗣️ 标准口语答案**

MessageGraph 可以理解为 StateGraph 的简化版，state 主要就是 messages 列表，内置 add_messages 做消息追加和去重。适合简单聊天 Agent，代码更短。

StateGraph 允许你定义任意字段：current_intent、retrieval_context、tool_results、approval_status 等，每个字段可配不同 reducer。一旦 Agent 不只有对话，还要管检索结果、路由标志、审批状态，就必须用 StateGraph。

面试时可以说：MessageGraph 是快速原型，StateGraph 是生产级定制。
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

**📖 核心要点**
- Workflow：无状态、线性、难中断
- LangGraph：可循环、可回溯、可人工介入
- 固定三步任务 Workflow 20 行搞定，不必上图

**🗣️ 标准口语答案**

普通 Workflow 或 LCEL Chain 是线性的：检索、生成、格式化三步走完。中间某步失败，通常只能整链重试，没有「回到某步换策略」的能力，也没有跨请求的 state 持久化。

LangGraph 把流程变成有向图，每个节点是一个 step，边可以是条件跳转。价值体现在三方面：执行方式从线性变成可循环可跳转；状态管理有 State 对象跨节点共享；人工介入可以在任意节点 interrupt 等人审批。

我同意高德面经里的观点：先用 Workflow 跑通功能，真正遇到循环/回溯痛点再迁 LangGraph。比如保存草稿这种固定三步，Workflow 够用；代码生成→运行→改错循环才需要图。
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

**📖 核心要点**
- LangGraph：显式状态机，学习曲线陡，链路最稳
- CrewAI：角色+任务快速成型，中等复杂度
- AutoGen：对话式协作表达强，行为更动态难控

**🗣️ 标准口语答案**

这三个框架哲学不同。LangGraph 把 Agent 系统当状态机建，你先定义状态、节点、边、终止条件，可控性和可恢复性最好，适合长链路、要审计、要 HITL 的生产系统，代价是前期设计重。

CrewAI 用角色和任务描述快速搭多 Agent，上手快，适合原型和任务型协作，但精细控制不如 LangGraph。AutoGen 强调 Agent 间对话协作，表达力强，适合研究实验，生产里行为较难约束。

我的决策树：怕失控、要 checkpoint、链路复杂 → LangGraph；今天就要 demo → CrewAI；研究多 Agent 对话 → AutoGen。长期跑的生产系统，LangGraph 优势会随复杂度上升而放大。
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

**📖 核心要点**
- Agent = LLM + 工具 + 记忆 + 规划循环
- LangGraph 提供循环、路由、状态持久化的运行时
- 可用 LangGraph 实现 Workflow（固定边）或 Agent（条件边）

**🗣️ 标准口语答案**

Agent 是系统能力：能根据目标自主调用工具、多轮推理、处理反馈。LangGraph 不负责「让 LLM 变聪明」，它负责把 Agent 的执行流程搭成可观测、可恢复的状态机。

关系上 LangGraph 解决 Agent 落地里的工程问题：循环怎么写、状态怎么传、失败了从哪重试、什么时候等人审批。早期 LangChain Agent 是黑盒——给工具和目标它自己跑，中间步骤难控；LangGraph 是白盒——每个节点、每条边你都显式定义。

两者都可以做：固定边就是 Workflow，LLM 决策的条件边就是 Agent。这也是 LangGraph 比早期 Agent 抽象更受欢迎的原因——控制权在你手里。
</div>
</details>

</div>

---

<div class="chapter-nav">

<a class="chapter-nav-link" href="../">📑 总览</a>

<a class="chapter-nav-link chapter-nav-next" href="state">📦 LangGraph · 状态管理 →</a>

</div>
