---
custom: true
partTitle: LangGraph 面经题库 · LangGraph · 控制流
partColor: #6366f1
---

<div class="part-hero custom-hero chapter-hero" style="--part-color: #6366f1">

# 🔀 LangGraph · 控制流

<p class="part-desc">LangGraph 面经题库 · 第 3/8 章 · 11 题</p>
<span class="part-round custom-tag">面试问答</span>

</div>

<div class="chapter-nav">

<a class="chapter-nav-link" href="../">📑 总览</a>

<a class="chapter-nav-link" href="state">← 📦 LangGraph · 状态管理</a>

<a class="chapter-nav-link chapter-nav-next" href="hitl">⏸️ LangGraph · 持久化与 HITL →</a>

</div>

<div class="question-card ai100-card interview-card compact-card" id="024-implement-cycle">

<h2 class="question-title"><span class="q-badge ai100-badge">Q24</span><span class="question-text">LangGraph 怎么实现循环？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 标签：LangGraph, 控制流 · 考察点：循环</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：通过回边 add_edge("tool", "agent") 形成 ReAct 闭环，条件边 should_continue 决定是否继续或 END。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和 while True 区别？ · 多出口循环怎么画？</div>
</div>

**优先级**：P0 · 3+ 篇

**🗣️ 标准口语答案**

循环靠回边实现：tool_node 执行完后 add_edge 回到 agent_node，形成 ReAct 闭环。条件边 should_continue 判断是继续调工具还是 END。

防死循环三道防线：recursion_limit 设置最大 superstep 数；条件边里加 iteration 计数器，超过阈值走 fallback；业务层限制工具调用次数和 token 预算。开发时用 stream_mode='values' 观察每步 state 变化，LangSmith 追踪完整轨迹。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="025-avoid-infinite-loop">

<h2 class="question-title"><span class="q-badge ai100-badge">Q25</span><span class="question-text">LangGraph 怎么避免死循环？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 标签：LangGraph, 控制流 · 考察点：死循环</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：recursion_limit + state 内 step_count + 语义级查重（如重复 tool call）+ 平滑 fallback 而非抛 500。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：工具一直返回空怎么办？ · 人类如何介入终止？</div>
</div>

**优先级**：P0 · 3+ 篇

**🗣️ 标准口语答案**

循环在 LangGraph 里靠回边实现，防死循环要设好几道保险。

**是什么**：死循环指图在环里无限执行，super-step 不断增长直到触发 recursion_limit 或耗尽 token/时间预算。ReAct Agent 里最常见诱因是工具返回空/错误，LLM 换汤不换药地重试。

**为什么危险**：生产环境直接抛 GraphRecursionError 给用户是灾难体验；更隐蔽的是 token 和 API 费用持续燃烧，P99 延迟飙升，监控才发现已经跑了几十轮。

**三道防线**：第一，recursion_limit 在 invoke config 里显式设小（如 15-25），这是框架硬上限。第二，state 维护 step_count，每轮 +1，条件边里超过阈值走 fallback 而非硬砍。第三，语义查重：记录 last_tool_call，如果连续 N 次相同参数调同一失败工具，直接路由到 human_fallback。

**项目例子**：RAG Agent 检索一直为空，LLM 反复调 search 工具。我们在 smart_router 里加规则：同一 query 检索 2 次仍为空，走 query_rewrite 节点换关键词；rewrite 2 次还不行，fallback 返回「未找到相关资料，建议换个问法」。

**踩坑**：只依赖 recursion_limit 不设 fallback，用户看到 500；step_count 忘了在节点里递增导致软路由失效；语义查重太严误杀合理重试。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="026-recursion-limit">

<h2 class="question-title"><span class="q-badge ai100-badge">Q26</span><span class="question-text">recursion_limit 是什么？怎么配置？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐ · 标签：LangGraph, 控制流 · 考察点：递归限制</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：限制图 super-step 最大次数，超限抛 GraphRecursionError；可在 compile 或 invoke 时设置。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和 step_count 区别？ · 合理值怎么定？</div>
</div>

**优先级**：P1 · 2 篇

**🗣️ 标准口语答案**

循环在 LangGraph 里靠回边实现，防死循环要设好几道保险。

**是什么**：recursion_limit 限制图执行的最大 super-step 数。一个 super-step 可能包含一个或多个并行节点的执行。超过限制，框架抛出 GraphRecursionError 终止执行。

**为什么需要**：Agent 天然有循环，没有上限就像 while True 没有 break。这是框架级安全网，防止 bug 或模型异常导致无限消耗。

**怎么配置**：invoke/ainvoke 时传 config={"recursion_limit": 25}；也可以在 compile 时设默认值。建议按业务场景显式配置，不要依赖默认 1000。

**和 step_count 区别**：recursion_limit 是框架硬限制，触顶直接抛异常；step_count 是业务字段，在条件边里判断后路由到 fallback，用户体验更好。两者应配合使用。

**合理值怎么定**：简单问答 5-10 轮；标准 ReAct 10-15 轮；代码生成-运行-修复循环 15-20 轮。要结合 token 预算、单次 LLM 延迟和 P99 SLA 一起调，上线后根据监控数据迭代。

**踩坑**：只设 recursion_limit 不设 fallback，用户看到裸异常；设太小导致正常复杂任务被误杀；不同业务场景共用一个值，要么浪费要么不够。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="027-conditional-vs-normal-edge">

<h2 class="question-title"><span class="q-badge ai100-badge">Q27</span><span class="question-text">条件边和普通边的区别？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐ · 标签：LangGraph, 控制流 · 考察点：边类型</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：普通边固定跳转；条件边每次执行路由函数，根据 state 动态选下一节点，是 Agent 决策核心。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：路由函数能调 LLM 吗？ · 多条件映射怎么写？</div>
</div>

**优先级**：P0 · 3+ 篇

**🗣️ 标准口语答案**

我会先把定位说清楚：

**普通边（add_edge）**：确定性跳转，源节点执行完必然进入目标节点。适合固定流水线，如 retrieve → generate → format。

**条件边（add_conditional_edges）**：动态路由，签名是 add_conditional_edges(source, path_fn, mapping)。path_fn 接收 state，返回字符串 key；框架查 mapping 找下一节点。可以映射到 END 结束执行。

**为什么 Agent 离不开条件边**：Agent 的「决策」本质是「根据当前状态选择下一步行动」。有没有 tool_calls、检索分数够不够、用户意图是查询还是投诉——这些都是运行时才能知道的，必须用条件边。

**路由函数能调 LLM 吗**：可以，但建议把 LLM 分类逻辑拆成独立 router 节点，条件边只做简单查表。这样 router 节点可单独测试，路由函数保持纯函数。

**多条件映射**：mapping 里定义多个出口，如 {"retry": "retrieve", "fallback": "fallback", "continue": "generate", END: END}。path_fn 返回对应 key。

**踩坑**：在路由函数里写副作用（发请求、改数据库）；路由函数过于复杂难以测试；mapping 漏了 path_fn 可能返回的 key 导致运行时错误。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="028-command-pattern">

<h2 class="question-title"><span class="q-badge ai100-badge">Q28</span><span class="question-text">Command 模式是什么？resume 怎么用？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 控制流 · 考察点：Command</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Command 用于 interrupt 后恢复执行，可携带人工输入或强制跳转节点，替代旧 breakpoint API。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和 update_state 区别？ · 拒绝审批后走哪？</div>
</div>

**优先级**：P1 · 2 篇

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

**是什么**：Command 是 LangGraph 1.0 引入的执行控制原语，用于表达「从 interrupt 点如何继续」的意图。可以携带 resume 值（人工输入）、指定 goto 目标节点、或组合使用。

**为什么取代 breakpoint**：旧 breakpoint API 语义不够清晰，Command 把「恢复」「跳转」「更新」统一成一等公民，和 interrupt() 函数配合更自然。

**resume 怎么用**：图在 interrupt 点挂起后，checkpoint 已保存当前 state。应用层展示中间结果，用户操作后调用 app.stream(Command(resume=user_input), config) 或 astream 继续执行。resume 的值会传回 interrupt 调用处。

**和 update_state 区别**：update_state 只改 checkpoint 里的 state 快照，不表达执行意图；Command 同时表达「从哪继续、往哪走、带什么输入」。审批拒绝场景可以 Command(resume={"approved": False}) 让条件边路由到 apology 节点。

**项目例子**：生成 SQL 后 interrupt 让人审核，人改了 SQL 用 Command(resume=modified_sql) 继续；人拒绝用 Command(goto="apology") 直接跳转。

**踩坑**：resume 后 pending 边可能重跑节点，涉及副作用要幂等；混淆 Command 和 update_state 导致状态改了但执行流不对。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="029-send-api-parallel">

<h2 class="question-title"><span class="q-badge ai100-badge">Q29</span><span class="question-text">Send API 如何实现并行执行？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 控制流 · 考察点：并行</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：节点返回多个 Send(target, arg) 实现 dynamic fan-out，各 worker 并行跑，结果经 reducer 合并。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和静态并行边区别？ · 结果冲突怎么处理？</div>
</div>

**优先级**：P1 · 2 篇

**🗣️ 标准口语答案**

Send API 用于动态 fan-out：一个节点可以返回多个 Send 对象，每个指向不同 worker 节点并行处理，结果通过 reducer 合并回 state。适合批量文档处理、多源检索等场景。Map-Reduce 模式就是 map 阶段 Send 分发，reduce 阶段汇总。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="030-map-reduce">

<h2 class="question-title"><span class="q-badge ai100-badge">Q30</span><span class="question-text">LangGraph 里 Map-Reduce 工作流怎么实现？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 控制流 · 考察点：Map-Reduce</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Map 阶段 Send fan-out 到 worker 节点，Reduce 阶段汇总节点合并结果进 state。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：部分 worker 失败怎么办？ · 适合什么业务？</div>
</div>

**优先级**：P1 · 2 篇

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

**Map 阶段**：splitter 节点将输入拆分为子任务列表，通过 Send API fan-out 到 worker 节点。每个 worker 独立处理一个子任务，写回 state 的对应字段（需 reducer 合并）。

**Reduce 阶段**：专门的 reduce 节点读取所有 worker 输出，做合并——文本拼接、结构化聚合、或再调 LLM 生成综合摘要。

**部分失败处理**：worker 节点 catch 异常，返回 {"results": [{"status": "error", "chunk_id": id}]} 而非抛异常。reduce 节点统计成功率，低于阈值走 fallback 或重试失败的 chunk。

**适合什么业务**：批量文档入库摘要、多源并行检索（向量库+关键词+知识图谱）、大规模 eval 跑批、长文档分段翻译。

**和 Hadoop Map-Reduce 对比**：思想一致（分而治之再汇总），但粒度是 Agent 节点而非机器节点，调度由 LangGraph runtime 管理。

**踩坑**：worker 抛异常导致整图失败；reduce 节点等所有 worker 但某个永远不回；合并时 token 超限要分段 reduce。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="031-fallback-node">

<h2 class="question-title"><span class="q-badge ai100-badge">Q31</span><span class="question-text">fallback 节点怎么设计和实现？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 控制流 · 考察点：降级</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：条件边在失败/超限/低置信时路由到 fallback，返回友好提示或转人工，避免抛裸异常。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：fallback 和 retry 边界？ · 用户看到什么？</div>
</div>

**优先级**：P1 · 3+ 篇面经

**🗣️ 标准口语答案**

我一般会按分层来设计重试，而不是在一个 try-except 里兜一切。

**是什么**：fallback 是图中的一个专用节点，负责在无法正常完成任务时返回降级响应，是条件边的一个出口而非全局异常捕获。

**触发条件**：工具重试耗尽、RAG 检索为空或 grade 不通过、step_count/recursion_limit 接近上限、LLM 输出解析失败、路由低置信度。

**输出设计**：返回结构化降级响应，包含 user_message（用户可见）、failure_reason（内部原因）、suggested_action（简化问题/转人工/稍后重试）。不要暴露技术栈错误信息。

**和 retry 边界**：可重试错误（网络超时、限流）先走回边或 retry 节点；不可重试错误（参数非法）或超过 max_retries 才走 fallback。分类统计各触发原因，别让 fallback 变成万能垃圾桶。

**监控**：failure_reason 写入 state 并上报 trace，回流 bad case 到评测集。按原因分桶统计，指导优化方向。

**踩坑**：fallback 消息太技术化吓用户；所有错误都走 fallback 导致 retry 形同虚设；没记录原因无法做归因分析。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="032-retry-mechanism">

<h2 class="question-title"><span class="q-badge ai100-badge">Q32</span><span class="question-text">整体失败重试机制怎么设计（node、RAG 链、tools）？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐⭐ · 标签：LangGraph, 控制流 · 考察点：重试分层</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：分三层：node 内 try-catch + 回边；tool 层超时重试 + 幂等；RAG 链层检索失败走 query rewrite 环。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：副作用怎么幂等？ · 重试监控看什么？</div>
</div>

**优先级**：P0 · 3+ 篇面经

**🗣️ 标准口语答案**

我按三层设计重试。节点层：每个 node 外包 try-except，可重试错误（网络超时、限流）走回边重试，不可重试错误（参数非法）路由到 fallback。工具层：工具调用设超时和最大重试次数，失败结果写入 state 让 agent 节点决定换参数还是放弃。RAG 链层：检索为空时触发 query rewrite 节点，而不是直接让 LLM 幻觉回答。

全局还有 recursion_limit 防止图级死循环，以及熔断策略——连续失败 N 次转人工。监控上每个节点记录 attempt 次数和最终状态，方便排查哪个环节最容易失败。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="033-stuck-agent">

<h2 class="question-title"><span class="q-badge ai100-badge">Q33</span><span class="question-text">如何处理 stuck agent（卡住的 Agent）？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 控制流 · 考察点：可靠性</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：检测：重复 tool call、step_count 不涨、token 爆；处理：强制路由 fallback、interrupt 人工、或 rollback checkpoint。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：怎么线上发现 stuck？ · 能否自动 rollback？</div>
</div>

**优先级**：P1 · 2 篇

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

**表现**：同一工具同一参数反复调用；step_count 持续增长但 state 关键字段（如 retrieved_docs）不变；单 thread 执行时间或 token 消耗远超 P99 基线。

**检测规则**：语义查重——last_tool_call 连续 N 次相同；进展监控——M 轮内关键字段无变化；SLA 超时——单 thread 执行超过设定阈值（如 120s）。

**处理策略**：轻度 stuck 条件边路由 fallback，返回友好提示。中度 stuck 触发 interrupt 挂起，通知运维或让用户介入。重度 stuck 用 get_state_history 找到最近一个「安全」checkpoint，update_state 回滚后 resume。

**线上发现**：LangSmith 或自研 trace 监控节点级耗时和 thread 总时长；对 P99 异常 thread 告警；dashboard 展示 stuck 触发率和原因分布。

**自动 rollback**：技术上可行——找到出错前的 checkpoint_id，fork 新分支重跑。但生产慎用，因为回滚点之后可能已有不可逆副作用。开发环境可随意实验。

**踩坑**：只设超时没有 stuck 语义检测，误杀慢但正常的任务；rollback 不考虑已发生的副作用。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="034-semantic-routing">

<h2 class="question-title"><span class="q-badge ai100-badge">Q34</span><span class="question-text">如何实现语义路由（Semantic Routing）？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 控制流 · 考察点：路由</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：用 LLM 或 embedding 分类器在条件边/路由节点判断意图，映射到不同子图或工具集。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：路由不准怎么办？ · 和 intent node 区别？</div>
</div>

**优先级**：P2 · 1 篇

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

**是什么**：语义路由根据用户输入的语义（而非关键词规则）决定后续走哪条分支。可以用 LLM 分类、embedding 相似度匹配、或专用 fine-tuned 小模型。

**为什么需要**：客服、助手类产品里「查订单」和「投诉退款」需要完全不同的工具集和子流程，入口路由决定了整个图的执行路径。

**实现方式**：专用 router 节点读取 messages，调用分类器，输出 state.route_key（如 "order_query"、"complaint"、"general_qa"）。后续条件边读 route_key 映射到不同子图或工具集。复杂场景可以用子图（Subgraph）封装各分支。

**路由不准怎么办**：低置信度时走澄清节点（interrupt 问用户确认意图）；设置默认安全路径（general_qa）；收集 bad case 回流微调分类器；A/B 测试不同路由策略。

**和 intent node 区别**：intent node 是实现手段，语义路由是设计模式。intent node 输出意图标签，条件边/子图完成实际路由。

**踩坑**：路由节点用 GPT-4 太贵；分类类别过多导致准确率下降；没有低置信兜底导致错误路由连锁失败。
</div>
</details>

</div>

---

<div class="chapter-nav">

<a class="chapter-nav-link" href="../">📑 总览</a>

<a class="chapter-nav-link" href="state">← 📦 LangGraph · 状态管理</a>

<a class="chapter-nav-link chapter-nav-next" href="hitl">⏸️ LangGraph · 持久化与 HITL →</a>

</div>
