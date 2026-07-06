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

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

LangGraph 是 LangChain 生态里的图编排框架，底层把 Agent 工作流建模成「有状态的状态机」：全局 State 在各 Node 之间流转，Edge 决定跳转方向，Conditional Edge 还能根据当前状态动态选路。它不是 LLM 本身，而是 Agent 的「运行时引擎」——负责循环、分支、持久化和人机协同。

真实 Agent 任务很少「一次推断就结束」。科研 RAG Agent 典型流程是：检索 → 评估相关性 → 不够就改写 query 再检索 → 生成答案 → 检查引用是否靠谱，任何一步失败都可能要回退重试。用普通 Chain 写这种带环流程，逻辑会散落在嵌套 try-except 里，难以测试和观测。LangGraph 把控制流显式化，每个节点可单独单测，整条链路可 trace。

典型用法：定义 AgentState（TypedDict）→ 用 StateGraph 注册节点和边 → compile 注入 checkpointer → invoke/stream 执行。每个 super-step 里，所有就绪节点并行跑，跑完通过 reducer 合并 state，再进入下一步。ReAct 闭环就是 agent 节点和 tool 节点之间加回边，条件边判断「继续调工具」还是 END。

在 EvoAgent 科研问答场景里，用户问「某论文的方法论缺陷是什么」，图可能是：intent_node 识别需要深度检索 → rag_node 拉取相关段落 → grade_node 评估检索质量 → 不合格走 rewrite_node 改 query 回 rag_node → generate_node 生成带引用的回答 → citation_check_node 校验引用，不通过回 generate_node。这种多轮纠错用 LangGraph 一张图讲清楚，还能在 citation_check 前 interrupt 等人确认敏感结论。

简单 RAG 问答（检索→生成→结束）硬上 LangGraph 是过度设计；每请求重复 compile 图会拖慢延迟；没配 reducer 的列表字段在并发节点下会被覆盖；没设 recursion_limit 的 ReAct 环可能死循环。
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

**🗣️ 标准口语答案**

我会先把它们定位说清楚：LangChain 的核心是 Chain 和 LCEL，本质是单向流水线，A 到 B 到 C，适合标准化 RAG、单次问答这类确定性流程。LangGraph 是在 LangChain 生态上的编排层，把 Agent 工作流建模成有向图，每个节点读写共享 State，边可以是条件边，还支持回边形成循环。

最大的差异有三点：第一是控制流，LangGraph 原生支持循环和条件跳转，比如代码生成→运行→报错→修改代码这种 ReAct 闭环，在 LangChain 里写起来很别扭；第二是状态管理，LangGraph 有显式 State 和 reducer，节点之间自动合并更新，LangChain 要么无状态要么自己管记忆；第三是生产特性，LangGraph 有 checkpoint 和 interrupt，能做断点续跑和人工审批，这是做严肃 Agent 系统的关键。

我的选型原则是：如果流程是固定的三四步，用 LangChain Workflow 就够了；一旦出现循环、多 Agent 协作、或者需要中途挂起等人工输入，就上 LangGraph。【替换点：可以举一个你项目里的具体场景，比如审批流或重试流】
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

**🗣️ 标准口语答案**

我选 LangGraph 不是因为它是新框架，而是因为业务上确实需要图编排的能力。具体来说，我的场景有【替换点：条件路由/多步审批/失败重试】，如果用普通 Chain 写，分支逻辑和状态恢复会散落在各个函数里，很难维护和调试。LangGraph 的价值在于把分支、状态、可持久化的人机协同从业务代码里抽成一层，checkpoint 和 interrupt 一旦用在审批或补全流程里，省掉的胶水代码是实打实的。

缺点我也很清楚：第一，学习曲线比 Chain 陡，State、reducer、compile 这些概念需要团队统一理解；第二，前期设计成本高，要先画清楚状态演化再写代码；第三，如果图退化成线性三步——调模型、调工具、再调模型——那框架带来的复杂度就不划算。

至于过度设计，我的判断标准是：每一条条件边是否对应真实的业务分支？checkpoint 里存的东西有没有生命周期策略？如果答不上来，那可能确实用重了。我当时的取舍是【替换点：描述你的实际分支数和持久化需求】。
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

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

「图状工作流框架」指用 Node + Edge + State 三元组建模控制流，而非隐式的函数嵌套或 prompt 内规划。每个节点是计算单元，边是路由逻辑，条件边让 LLM 或规则动态决定下一跳。

显式图比黑盒 Agent 更可审计、可测试、可观测。面试官加分点：能说出 super-step 执行模型——每个 super-step 里所有就绪节点并行跑，跑完同步 state，类似 Pregel/Bulk Synchronous Parallel。

构建：StateGraph(AgentState) → add_node → add_edge / add_conditional_edges → compile。运行：从 START 出发，按边跳转，遇到回边形成循环，直到路由到 END。compile 期做结构检查（孤立节点等）。

科研 Agent 的 grade_node 用条件边：检索质量够 → generate，不够 → rewrite → 回 retrieve。整张图可视化后，新人能一眼看懂流程，比读嵌套 Python 快得多。

条件边路由不稳定（LLM 返回意外 key）导致跑飞；没画 END 出口；不理解 super-step 导致并发写 state 冲突。
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

**🗣️ 标准口语答案**

我先说结论，再展开原因。

StateGraph 是 LangGraph 的图构建器（Builder），不是运行时本身。它接收 State schema，提供 add_node、add_edge、add_conditional_edges 等 API 组装图，compile 后产出 LangChain Runnable。

这是写 LangGraph 的第一步，面试常结合「State 怎么设计」一起考。理解 StateGraph 等于理解「声明式构图 + 编译执行」的两阶段模型。

1. 定义 AgentState（TypedDict + Annotated reducer）
2. graph = StateGraph(AgentState)
3. graph.add_node("name", fn) 注册节点
4. graph.add_edge(START, "first") / add_conditional_edges 连边
5. app = graph.compile(checkpointer=...) 编译
6. app.invoke(initial_state, config={"configurable": {"thread_id": "..."}})

EvoAgent 里 StateGraph 注册 intent、rag、grade、rewrite、generate、citation_check 六个节点，条件边连接，compile 时注入 PostgresSaver 和 interrupt_before=["citation_check"]。

每请求 compile 一次（应启动时全局单例）；State schema 和节点返回字段不一致；忘记 set_entry_point 或 START 边。
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

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

Node：(state) -> partial_update dict，不应直接 mutate state。Edge：固定跳转 add_edge("A", "B")。Conditional Edge：add_conditional_edges("A", route_fn, path_map)，route_fn 是纯函数，只读 state 返回 key。

三要素是构图的基本词汇，阿里淘天一面爱结合「状态流转」考。条件边是 ReAct Agent「继续调工具 vs 结束」的核心机制。

ReAct 典型：agent_node 调 LLM → 条件边看 response 有没有 tool_calls → 有则去 tools_node → 普通边回 agent_node → 循环直到条件边路由到 END。

科研 Agent 的 grade_node 后条件边：quality_score >= 0.7 → generate，否则 → rewrite。路由函数只读 retrieval_docs 和 score，便于单测。

节点内直接改 state 而非返回 update；条件边路由函数不稳定（LLM 输出飘）；路由 map 漏 key 导致 KeyError；节点里做不可重试的副作用（发邮件）无幂等。
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

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

compile 是构建期到运行期的桥梁：StateGraph（声明式定义）→ CompiledGraph（Runnable 实例）。编译时固化图拓扑和运行时配置，运行时不再改结构。

区分「调过 demo」和「上过线」的细节：生产必须单例 compile；图变更需考虑旧 thread 迁移。百度面经爱追问 checkpoint 与 compile 的关系。

启动时：app = graph.compile(checkpointer=saver, interrupt_before=[...]) 编译一次。请求时：app.invoke(input, config) 复用同一 app。图定义变更后需重新 compile，旧 thread 的 state schema 要向后兼容。

EvoAgent FastAPI 服务在 lifespan 里 compile 一次，注入 PostgresSaver；每个请求只传不同 thread_id，不重复 compile。延迟从 ~200ms 降到个位数 ms。

每请求 compile；compile 后才 add_node（无效，需重新 compile）；state schema 变更无迁移策略导致旧 checkpoint 读失败。
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

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

END 是 LangGraph 内置的特殊节点，路由到 END 表示图执行终止，返回最终 state。从 START 到 END 是一条合法执行路径。

ReAct Agent 若无明确 END 路径，会在 agent↔tools 环里转直到 GraphRecursionError。用户体验差，且浪费 token 和 API 费用。

条件边 path_map 必须包含到 END 的映射，如 {"end": END, "tools": "tools"}。路由函数判断：无 tool_calls → "end"；或 step_count >= max → "end"；或业务标志 task_done → "end"。recursion_limit 作为最后防线。

科研 Agent 在 generate 后 citation_check 通过 → END；不通过且 retry_count < 3 → 回 generate；retry 耗尽 → fallback_node → END。

路由 map 无 END 路径；只靠 recursion_limit 不设业务终止条件；多个出口未区分「成功 END」和「失败 END」（应用不同 fallback 节点再 END）。
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

**🗣️ 标准口语答案**

我会先把定位说清楚：

MessageGraph：预置 messages channel + add_messages reducer，API 更短。StateGraph：通用构建器，State 可以是任意 TypedDict，支持多 channel 和多 reducer。

选型影响后续扩展成本。从 MessageGraph 迁到 StateGraph 要改 schema 和所有节点签名，早选型省重构。

简单聊天：MessageGraph() → add_node → compile，节点只读写 messages。复杂 Agent：StateGraph(AgentState) 定义多字段，节点按需更新不同 channel。

EvoAgent 最初用 MessageGraph 原型，加 retrieval_docs、quality_score、citation_status 后迁 StateGraph，否则这些字段无处安放。

复杂 Agent 仍用 MessageGraph 把业务字段塞进 message content；迁移时 checkpoint 旧 schema 不兼容。
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

**🗣️ 标准口语答案**

必须用 LangGraph 的三种情况：需要循环（代码生成-运行-修复）、需要人工介入（生成方案-用户确认）、多 Agent 协作有依赖关系。

不必用的场景：固定三步流程，比如检索→生成→格式化，普通 Workflow 或 LCEL 二十行搞定，上 LangGraph 反而增加复杂度。我的经验是先 Workflow 跑通功能，遇到循环或回溯痛点再迁移，不要为了炫技提前上图编排。
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

**🗣️ 标准口语答案**

我会先把定位说清楚：

LangGraph：显式状态机编排，LangChain 生态。CrewAI：角色（Role）+ 任务（Task）+ Crew 抽象，YAML 式配置多 Agent。AutoGen：对话式多 Agent，GroupChat 驱动协作。

字节、独角兽面经爱问框架对比，考察广度与深度。不必装全用过，但要讲清哲学差异和选型依据。

生产长链路 + checkpoint + HITL → LangGraph。快速多 Agent 原型 → CrewAI。研究/实验性对话协作 → AutoGen。团队无图编排经验：先用 CrewAI 验证需求，复杂度上来再迁 LangGraph。

EvoAgent 选 LangGraph 因为 citation 校验失败要回环、敏感结论要 interrupt，需要可审计的节点级 trace。同团队另一个内部提效 demo 用 CrewAI 三天出原型。

生产系统用 AutoGen 难控行为；复杂链路用 CrewAI 后期难维护；选 LangGraph 但团队无人懂 reducer/checkpoint。
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

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

Agent = LLM + 工具 + 记忆 + 规划循环（感知→决策→行动）。LangGraph = 编排引擎，提供循环（回边）、路由（条件边）、持久化（checkpoint）、人机协同（interrupt）的运行时。

高德面经原题，考察概念清晰度。把 LangGraph 等同于 Agent 会显得基础不牢；说 LangGraph 只是 Workflow 又忽略了 Agent 编排能力。

LangGraph 不生成答案，它组织「谁什么时候调 LLM、什么时候调工具、失败了从哪重试」。用固定边 + 无 LLM 路由 → 确定性 Workflow。用条件边 + ReAct 回边 → Agent。

EvoAgent：Agent 能力由 LLM+检索工具+引用校验组成；LangGraph 编排 intent→rag→grade→generate→check 的流程，并在 check 前 interrupt 等人确认。

以为 LangGraph 替代 LLM；黑盒 AgentExecutor 和 LangGraph 白盒图混为一谈；用 LangGraph 但所有决策仍塞 prompt 里（图退化为直线）。
</div>
</details>

</div>

---

<div class="chapter-nav">

<a class="chapter-nav-link" href="../">📑 总览</a>

<a class="chapter-nav-link chapter-nav-next" href="state">📦 LangGraph · 状态管理 →</a>

</div>
