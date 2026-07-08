---
title: 项目面试问答集
titleTemplate: false
pageClass: guides-doc
outline: [2, 3]
aside: true
---

<p class="guide-chapter-badge">项目面试问答集</p>

> 92 道项目题全部用 STAR：Situation 背景 → Task 目标 → Action 你的决策 → Result 数字。
> 
> 题号每类从 Q1 重新开始，但讲解按出现顺序匹配。建议挑架构/RAG/故障各 1～2 题练到脱稿；老师讲解会帮你拆每段该怎么讲、数字怎么记。

企业级 AI Agent 项目面试问答集

  本文档包含企业级 AI Agent 项目可能被面试官问到的所有核心问题及 STAR 法回答。 全部
  内容基于真实项目经验，可直接用于面试准备。

 第一类：架构设计类问题（18题）
 第二类：技术实现类问题（18题）
 第三类：性能优化类问题（12题）
 第四类：故障处理类问题（12题）
 第五类：工程质量类问题（12题）
 第六类：业务理解类问题（8题）
 第七类：基础知识追问（12题）
总计：92 题

第一类：架构设计类问题

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q1</span><span class="guide-q-text">为什么选择 ReAct 模式而不是 Plan-and-Execute？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：在设计企业级 AI Agent 系统时，需要在 ReAct（Reasoning + Acting）和 Plan-and-Execute 两种主流 Agent 范式之间做出架构决策。业务场景包括客服问答、知识检索、工具调用等多种任务类型。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：选择一种既能满足实时交互需求，又能处理复杂多步任务的 Agent 架构范式。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 对比分析两种范式：</strong></p>
<p>ReAct：思考-行动-观察的循环模式，每一步都基于当前观察做出决策，具有强交互性和动态适应能力。Plan-and-Execute：先制定完整计划，再按步骤执行，适合任务结构明确、步骤可预见的场景。</p>
<p class="guide-a-step"><strong>2. 基于业务场景评估：</strong></p>
<p>企业客服场景中，用户意图经常在对话中变化（如从查订单变成要退款），ReAct 能实时调整策略。Plan-and-Execute 在计划阶段就需要确定所有步骤，一旦中间步骤失败，整个计划需要重做。ReAct 的流式特性天然支持"边思考边输出"，用户体验更好。</p>
<p class="guide-a-step"><strong>3. 技术可行性评估：</strong></p>
<p>ReAct 的 Prompt 模板更灵活，可以通过 few-shot 快速调整行为。ReAct 与 Function Calling 天然兼容，每次思考后可以调用工具。通过设置最大迭代次数（max_iterations=10）和超时机制，可有效防止死循环。</p>
<p class="guide-a-step"><strong>4. 混合方案设计：</strong></p>
<p>实际落地中采用 ReAct 为主、Plan 为辅的混合方案。简单查询（单步任务）：直接走 ReAct 单次循环。复杂任务（多步骤）：先用 LLM 生成粗粒度 Plan，每个步骤内部用 ReAct 执行。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：系统平均响应时间从纯 Plan-and-Execute 的 8s 降低到 ReAct 模式的 3.2s（简单任务直接缩短为单步）。任务完成率从 78% 提升到 91%，因为 ReAct 能根据中间结果动态调整策略。用户满意度提升 15%，因为流式输出让用户感知到更快的响应。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】对比题考「边界感」：什么场景用 A、什么场景用 B、能不能混合。背差异表不够，要说控制流在谁手里。</p><p>【拆开理解】</p><p>1. Situation：在设计企业级 AI Agent 系统时，需要在 ReAct（… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：选择一种既能满足实时交互需求，又能处理复杂多步任务的 Agent 架构… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 对比分析两种范式： ReAct：思考-行动-观察的循环模式，每一步都基于当… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. Plan-and-Execute：先制定完整计划，再按步骤执行，适合任务结构明确… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 2. 基于业务场景评估：企业客服场景中，用户意图经常在对话中变化（如从查订单变成… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像侦探办案：先推理（Thought），再行动查线索（Action），看结果（Observation），循环直到破案。</p><p>【常见误区】</p><p>1. 只说 A 好 B 不好，没有说混合方案或选型条件。</p><p>2. 把 ReAct 说成「想一步做一步」但说不清 Observation 从哪来、何时停止。</p><p>3. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>4. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Agent 架构模式详解：ReAct、Plan-and-Execute、LATS、P…」（/custom/ai100-agent-arch/003-agent-architecture-patterns） — 要点：主流 Agent 架构模式各有侧重：**ReAct** 交替推理与行动，灵活且可解释性强，但 token 消耗高；**Plan-and-Execute** 先规划后执行，高效但适应性低；**LATS*…</p><p>· 「ReAct、Plan-and-Execute、Reflection 三种范式有什…」（/custom/xiaolin-agent/three_patterns） — 要点：我理解这三者是 Agent 开发里最主流的三种设计范式，核心区别在于「决策和执行的关系」…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 架构：步数上限、停止条件、死循环检测、Plan+ReAct 混合、画拓扑图。</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：Agent 架构模式详解：ReAct、Plan-and-Execute、LATS、P…、ReAct、Plan-and-Execute、Reflection 三种范式有什…。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：说清要优化的目标指标</p><p>Action：我重点做了三件事——Situation：在设计企业级 AI Agent 系统时，需要在 ReAct（Reasoning + Acting）和 Plan- and-Execute 两种主流 Agent 范式之间做出架构决策。业务场景包括客服问答、知识检索、工具调用等多种任务类型；Task：选择一种既能满足实时交互需求，又能处理复杂多步任务的 Agent 架构范式；Action： ##</p><p>Result：系统平均响应时间从纯 Plan-and-Execute 的 8s 降低到 ReAct 模式的 3.2s（简单任务直接缩短为单步）。任务完成率从 78% 提升到 91%，因为 ReAct 能根据中间结果动态调整策略。用户满意度提升 15%，因为流式输出让用户感知到更快的响应。</p><p>你也可以补充：本站题库「Agent 架构模式详解：ReAct、Plan-and-Execute、LATS、P…」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q2</span><span class="guide-q-text">为什么采用多路检索而不是单一向量检索？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：企业知识库包含大量结构化和非结构化数据，单一向量检索在某些场景下召回率不足。例如，精确的编号查询（如"工单号 WO-20240315-001"）在纯语义检索中表现很差。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：设计一个兼顾语义理解和精确匹配的检索架构，提升知识检索的准确率和召回率。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 多路检索架构设计：</strong></p>
<p>向量检索（语义通道）： 使用 Milvus 存储文档向量，基于 embedding 相似度做语义召回，top_k=20。关键词检索（精确通道）： 使用 Elasticsearch 做 BM25 检索，处理精确查询、编号匹配等场景，top_k=20。知识图谱检索（关系通道）： 针对实体关系类问题（如"张三负责哪些项目"），从 Neo4j 中检索实体关系。</p>
<p class="guide-a-step"><strong>2. 结果融合策略：</strong></p>
<p>采用 RRF（Reciprocal Rank Fusion）算法融合多路结果。公式： RRF_score = Σ 1/(k + rank_i) ，其中 k=60 是平滑常数。每路检索结果独立排序后，通过 RRF 算法统一排名。</p>
<p class="guide-a-step"><strong>3. 查询路由策略：</strong></p>
<p>意图识别模块判断查询类型，动态激活不同检索通道。精确查询（含编号、代码等）→ 优先走关键词通道。概念性问题（"什么是微服务"）→ 优先走向量通道。关系查询（"谁负责某项目"）→ 启用知识图谱通道。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：整体检索准确率（Precision@5）从单一向量检索的 72% 提升到多路融合的 89%。召回率（Recall@20）从 65% 提升到 93%。精确编号类查询的命中率从 30% 提升到 98%。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】对比题考「边界感」：什么场景用 A、什么场景用 B、能不能混合。背差异表不够，要说控制流在谁手里。</p><p>【拆开理解】</p><p>1. Situation：企业知识库包含大量结构化和非结构化数据，单一向量检索在某些场… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：设计一个兼顾语义理解和精确匹配的检索架构，提升知识检索的准确率和召回率 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 多路检索架构设计：向量检索（语义通道）：使用 Milvus 存储文档向量，… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 结果融合策略：采用 RRF（Reciprocal Rank Fusion）… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 3. 查询路由策略：意图识别模块判断查询类型，动态激活不同检索通道。精确查询（含… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只说 A 好 B 不好，没有说混合方案或选型条件。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「长期记忆存储介质选型：向量 / 结构化 / 图谱」（/custom/ai100-memory/046-long-term-memory-storage） — 要点：Agent 长期记忆有三种主要存储介质，各擅其长：(1) **向量记忆**（Embedding + 向量数据库）擅长**语义相似度检索**，基于"意思相近"找到相关记忆，适合非结构化文本和模糊查询；(…</p><p>· 「任务分解（Task Decomposition）的基本方法」（/custom/ai100-planning/050-task-decomposition） — 要点：任务分解是将复杂目标拆分为更小、可执行的子任务的过程，是 Agent 规划能力的基础。主要方法包括：**LLM 驱动分解**（用 Prompt 让 LLM 自行拆分任务，最灵活但可能不稳定）、**程序…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：长期记忆存储介质选型：向量 / 结构化 / 图谱、任务分解（Task Decomposition）的基本方法。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：企业知识库包含大量结构化和非结构化数据，单一向量检索在某些场景下召回率不足。例如，精确的编号查询（如"工单号 WO-20240315-001"）在纯语义检索中表现很差。</p><p>Task：设计一个兼顾语义理解和精确匹配的检索架构，提升知识检索的准确率和召回率。</p><p>Action：我重点做了三件事——Situation：企业知识库包含大量结构化和非结构化数据，单一向量检索在某些场景下召回率不足。例如，精确的编号查询（如"工单号 WO-20240315-001"）在纯语义检索中表现很差；Task：设计一个兼顾语义理解和精确匹配的检索架构，提升知识检索的准确率和召回率；Action： ##</p><p>Result：整体检索准确率（Precision@5）从单一向量检索的 72% 提升到多路融合的 89%。召回率（Recall@20）从 65% 提升到 93%。精确编号类查询的命中率从 30% 提升到 98%。</p><p>你也可以补充：本站题库「长期记忆存储介质选型：向量 / 结构化 / 图谱」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q3</span><span class="guide-q-text">Agent 编排器是怎么设计的？为什么这样设计？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：系统需要协调多个组件（意图识别、检索、生成、工具调用等）的执行流程，需要一个灵活且可扩展的编排机制。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：设计一个能支持多种执行模式（顺序、并行、条件分支）且易于扩展的 Agent 编排器。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 核心架构 —— 状态机 + 事件驱动：</strong></p>
<p>用户输入 → 意图识别 → 路由决策 → 执行计划 → 工具/检索调用 → 结果整合 → 响应生成定义了 7 个核心状态： INIT → INTENT_PARSED → PLANNED → EXECUTING → TOOL_CALLED→ SYNTHESIZING → COMPLETED每个状态转换由事件触发，通过状态转换表控制流程。</p>
<p class="guide-a-step"><strong>2. 编排器核心组件：</strong></p>
<p>AgentOrchestrator（总编排器）： 管理整体流程，维护执行上下文。TaskPlanner（任务规划器）： 将复杂任务分解为子任务 DAG（有向无环图）。ToolDispatcher（工具分发器）： 根据 Function Calling 结果调用对应工具。ContextManager（上下文管理器）： 维护对话历史、工具调用结果等上下文信息。</p>
<p class="guide-a-step"><strong>3. 设计决策的考量：</strong></p>
<p>为什么用状态机？ 可枚举所有合法状态转换，便于 debug 和异常处理，比纯 LLM 链式调用更可控。为什么用事件驱动？ 解耦各组件，支持异步执行和并行工具调用，提升系统吞吐量。为什么用 DAG 而非线性队列？ 支持并行子任务（如同时查数据库和调 API），减少总执行时间。</p>
<p class="guide-a-step"><strong>4. 可扩展性设计：</strong></p>
<p>新增工具只需实现 BaseTool 接口并注册到 ToolRegistry 。新增 Agent 类型只需定义新的状态转换规则。通过配置文件管理流程编排，无需修改核心代码。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：支持了 12 种不同的业务流程编排，每种只需配置不覅改代码。新工具接入时间从原来的 2 天缩短到 2 小时（标准化接口）。并行工具调用使复杂任务执行时间缩短 40%。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation：系统需要协调多个组件（意图识别、检索、生成、工具调用等）的执… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：设计一个能支持多种执行模式（顺序、并行、条件分支）且易于扩展的 Age… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 核心架构——状态机 + 事件驱动：用户输入→意图识别→路由决策→执行计划→… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 编排器核心组件： AgentOrchestrator（总编排器）：管理整体… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. TaskPlanner（任务规划器）：将复杂任务分解为子任务 DAG（有向无环图… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像装修：先出施工图（Plan），再按步骤施工（Execute）；中途发现问题可以改图纸（Replan）。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>3. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Function Calling 工具设计最佳实践」（/custom/today-interview/function-calling-design） — 要点：每个工具只做一件事、参数少而精、description 包含正例和反例、error 返回结构化而非纯文本——定义好，模型才可能调对。…</p><p>· 「如何设计一个分层 Agent 架构（Orchestrator / Worker 模式…」（/custom/ai100-agent-arch/005-layered-agent-architecture） — 要点：分层 Agent 架构（Orchestrator-Worker 模式）是一种将复杂任务分解为"指挥"和"执行"两个层次的设计模式。Orchestrator（编排器）负责理解目标、分解任务、分配工作、综…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 架构：步数上限、停止条件、死循环检测、Plan+ReAct 混合、画拓扑图。</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 记忆：事实 vs 推断分开存、写入时机、冲突合并、跨会话权限。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：Function Calling 工具设计最佳实践、如何设计一个分层 Agent 架构（Orchestrator / Worker 模式…。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：系统需要协调多个组件（意图识别、检索、生成、工具调用等）的执行流程，需要一个灵活且可扩展的编排机制。</p><p>Task：说清要优化的目标指标</p><p>Action：我重点做了三件事——Situation：系统需要协调多个组件（意图识别、检索、生成、工具调用等）的执行流程，需要一个灵活且可扩展的编排机制；Task：设计一个能支持多种执行模式（顺序、并行、条件分支）且易于扩展的 Agent 编排器；Action： ##</p><p>Result：支持了 12 种不同的业务流程编排，每种只需配置不覅改代码。新工具接入时间从原来的 2 天缩短到 2 小时（标准化接口）。并行工具调用使复杂任务执行时间缩短 40%。</p><p>你也可以补充：本站题库「Function Calling 工具设计最佳实践」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q4</span><span class="guide-q-text">多 Agent 协作和单 Agent 有什么区别？你怎么选择？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：随着业务复杂度增加，单个 Agent 的 Prompt 越来越长，工具数量越来越多，开始出现能力退化和维护困难的问题。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：评估是否需要从单 Agent 架构迁移到多 Agent 协作架构，以及如何设计协作机制。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 单 Agent 的瓶颈分析：</strong></p>
<p>单 Agent 的系统 Prompt 超过 4000 tokens 后，指令遵循能力明显下降。工具数量超过 15 个时，LLM 选择工具的准确率从 95% 下降到 78%。所有逻辑耦合在一个 Prompt 中，修改一个功能可能影响其他功能。</p>
<p class="guide-a-step"><strong>2. 多 Agent 架构设计：</strong></p>
<p>Supervisor Agent（主管 Agent）： 负责意图识别和任务路由，不直接执行任务。RAG Agent（检索 Agent）： 专注于知识检索和答案生成。Tool Agent（工具 Agent）： 专注于外部 API 调用和数据处理。Summary Agent（摘要 Agent）： 专注于长文本摘要和对话总结。</p>
<p class="guide-a-step"><strong>3. 协作机制：</strong></p>
<p>通信方式： Agent 之间通过结构化消息传递（JSON Schema 定义），避免自然语言传递导致的信息损失。执行策略： Supervisor 判断任务类型后，将任务分派给专业 Agent；支持顺序执行和并行执行。结果汇总： 由 Supervisor Agent 整合各子 Agent 结果，生成最终回答。</p>
<p class="guide-a-step"><strong>4. 选择标准：</strong></p>
<p>工具数 ≤ 8 且业务逻辑简单 → 单 Agent。工具数 &gt; 8 或需要专业分工 → 多 Agent。有跨域协作需求（如同时查知识库和调外部 API）→ 多 Agent。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：迁移到多 Agent 后，工具选择准确率回升到 96%。每个 Agent 的 Prompt 控制在 2000 tokens 以内，维护性大幅提升。新增业务场景只需新增专业 Agent，不影响现有功能。系统整体任务完成率从 85% 提升到 93%。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】对比题考「边界感」：什么场景用 A、什么场景用 B、能不能混合。背差异表不够，要说控制流在谁手里。</p><p>【拆开理解】</p><p>1. Situation：随着业务复杂度增加，单个 Agent 的 Prompt 越来… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：评估是否需要从单 Agent 架构迁移到多 Agent 协作架构，以及… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 单 Agent 的瓶颈分析：单 Agent 的系统 Prompt 超过 4… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 多 Agent 架构设计： Supervisor Agent（主管 Age… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. RAG Agent（检索 Agent）：专注于知识检索和答案生成 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只说 A 好 B 不好，没有说混合方案或选型条件。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>3. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「1. LLM 和 Agent 有什么区别？」（/custom/kama-agent/agent_interview-q1） — 要点：# Agent大厂面试题汇总：ReAct、Function Calling、MCP、RAG高频问题现在无论是什么岗位，都要求了解一些AI，Agent相关的内容…</p><p>· 「跨模型 Prompt 迁移：如何编写模型无关的 Prompt？」（/custom/ai100-prompt/068-cross-model-prompt-portability） — 要点：跨模型 Prompt 迁移（Cross-Model Prompt Portability）是指让同一个 Prompt 在不同 LLM（GPT-4、Claude、Gemini、Llama 等）上都能有效…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：1. LLM 和 Agent 有什么区别？、跨模型 Prompt 迁移：如何编写模型无关的 Prompt？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：说清要优化的目标指标</p><p>Action：我重点做了三件事——Situation：随着业务复杂度增加，单个 Agent 的 Prompt 越来越长，工具数量越来越多，开始出现能力退化和维护困难的问题；Task：评估是否需要从单 Agent 架构迁移到多 Agent 协作架构，以及如何设计协作机制；Action： ##</p><p>Result：迁移到多 Agent 后，工具选择准确率回升到 96%。每个 Agent 的 Prompt 控制在 2000 tokens 以内，维护性大幅提升。新增业务场景只需新增专业 Agent，不影响现有功能。系统整体任务完成率从 85% 提升到 93%。</p><p>你也可以补充：本站题库「1. LLM 和 Agent 有什么区别？」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q5</span><span class="guide-q-text">意图识别模块是怎么实现的？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：企业客服场景中，用户意图多样（咨询、投诉、查询订单、操作请求等），且存在大量隐含意图和多意图混合的情况（如"我的订单怎么还没到，我要退款"同时包含查询和操作意图）。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：设计一个准确率高、可扩展的意图识别模块，能处理多意图和隐含意图。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 两阶段意图识别架构：</strong></p>
<p>第一阶段 —— 粗分类（基于规则 + 小模型）：正则匹配高频模式（如订单号格式 [A-Z]{2}-\d{8}-\d{3} ）。FastText 轻量分类器做初步意图分类（延迟 &amp;lt; 5ms）。覆盖 80% 的常见查询，快速响应。第二阶段 —— 精细分类（基于 LLM）：对第一阶段无法确定的复杂查询，调用 LLM 进行意图分析。</p>
</div></div>
</div>

```text
    使用结构化 Prompt，输出标准 JSON： {"intents": [{"type": "...",
 "confidence": 0.9, "entities": {...}}]}

 支持多意图识别和实体提取。
```

#### 2. 意图体系设计（三级分类）：

   L1:   咨询/操作/投诉/闲聊
   L2:   产品咨询/技术咨询/订单查询/退款申请/...
   L3:   具体产品线/具体操作类型/...

#### 3. 置信度阈值策略：

     confidence ≥ 0.85 → 直接执行。

<div class="guide-qa">
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation：企业客服场景中，用户意图多样（咨询、投诉、查询订单、操作请求… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：设计一个准确率高、可扩展的意图识别模块，能处理多意图和隐含意图 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 两阶段意图识别架构：第一阶段——粗分类（基于规则 + 小模型）：正则匹配高… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. FastText 轻量分类器做初步意图分类（延迟 &amp;lt → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 5ms）。覆盖 80% 的常见查询，快速响应。第二阶段——精细分类（基于 LLM… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】可以把 Agent 想成「会自己查资料、记笔记、调系统的数字员工」，比普通 ChatBot 多了闭环和多步决策。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Prompt Chaining：多步骤 Prompt 的设计与编排」（/custom/ai100-prompt/063-prompt-chaining） — 要点：Prompt Chaining（提示链）是将复杂任务分解为多个顺序执行的 LLM 调用，每个调用的输出作为下一个调用的输入。它是 Agentic AI 中最基础的设计模式，也被称为 Pipeline …</p><p>· 「跨模型 Prompt 迁移：如何编写模型无关的 Prompt？」（/custom/ai100-prompt/068-cross-model-prompt-portability） — 要点：跨模型 Prompt 迁移（Cross-Model Prompt Portability）是指让同一个 Prompt 在不同 LLM（GPT-4、Claude、Gemini、Llama 等）上都能有效…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：Prompt Chaining：多步骤 Prompt 的设计与编排、跨模型 Prompt 迁移：如何编写模型无关的 Prompt？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：企业客服场景中，用户意图多样（咨询、投诉、查询订单、操作请求等），且存在大量隐含意图和多意图混合的情况（如"我的订单怎么还没到，我要退款"同时包含查询和操作意图）。</p><p>Task：设计一个准确率高、可扩展的意图识别模块，能处理多意图和隐含意图。</p><p>Action：我重点做了三件事——Situation：企业客服场景中，用户意图多样（咨询、投诉、查询订单、操作请求等），且存在大量隐含意图和多意图混合的情况（如"我的订单怎么还没到，我要退款"同时包含查询和操作意图）；Task：设计一个准确率高、可扩展的意图识别模块，能处理多意图和隐含意图；Action： ##</p><p>Result：给量化结果，如延迟降 X%、准确率升 Y%</p><p>你也可以补充：本站题库「Prompt Chaining：多步骤 Prompt 的设计与编排」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

### 0.6 ≤ confidence < 0.85 → 向用户确认意图。

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>读「≤ confidence &lt; 0.85 → 向用户确认意图。」时抓住一个关键词，联想你的项目或「假如做企业客服 Agent」场景。</p><p>想不出项目经历很正常——用假设场景把流程串起来，同样能答得漂亮。</p></div>

     confidence &lt; 0.6 → 追问澄清。
Result：
   意图识别准确率达到 94%（测试集 5000 条标注数据）。
   多意图识别 F1-score 达到 0.89。
   第一阶段处理了 80% 查询，LLM 调用量减少 80%，节省了大量 token 成本。

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q6</span><span class="guide-q-text">为什么选择 Milvus 而不是其他向量数据库？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：项目需要一个向量数据库来存储和检索文档 embedding，候选方案包括 Milvus、Pinecone、Weaviate、Qdrant、Chroma、FAISS 等。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：综合评估各方案的性能、功能、运维成本，选择最适合企业级场景的向量数据库。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 排除不适合的方案：</strong></p>
<p>FAISS： 单机库，不支持分布式，无法满足高可用和数据持久化需求。Chroma： 定位轻量级，不适合大规模生产环境。Pinecone： 全托管方案，数据出境合规问题（数据必须存在海外）。</p>
<p class="guide-a-step"><strong>2. 深度对比 Milvus vs Weaviate vs Qdrant：</strong></p>
<p>性能： Milvus 在 1000 万级向量上 QPS 达到 2000+，Qdrant 约 1500，Weaviate 约1200。扩展性： Milvus 原生支持分布式部署（计算存储分离），可水平扩展。Qdrant 的分布式能力相对较弱。索引类型： Milvus 支持 IVF_FLAT、IVF_SQ8、HNSW、DiskANN 等多种索引，可根据数据规模选择最优方案。混合搜索： Milvus 2.x 支持标量过滤 + 向量搜索的混合查询，满足"按部门+语义"的业务需求。生态： Milvus 有 LangChain、LlamaIndex 等主流框架的官方集成。社区： Milvus 是 LF AI &amp; Data 基金会毕业项目，社区活跃，长期维护有保障。</p>
<p class="guide-a-step"><strong>3. POC 验证（基于 200 万文档的真实数据）：</strong></p>
<p>建立测试基准，对比查询延迟、召回率、资源占用。Milvus：P99 延迟 45ms，召回率 98.2%，内存占用 16GB。Qdrant：P99 延迟 62ms，召回率 97.8%，内存占用 14GB。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：最终选择 Milvus，部署了 3 节点集群。线上稳定运行 8 个月，P99 延迟稳定在 50ms 以内。数据量从 200 万增长到 800 万文档，通过水平扩展平滑支撑。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】对比题考「边界感」：什么场景用 A、什么场景用 B、能不能混合。背差异表不够，要说控制流在谁手里。</p><p>【拆开理解】</p><p>1. Situation：项目需要一个向量数据库来存储和检索文档 embedding，… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：综合评估各方案的性能、功能、运维成本，选择最适合企业级场景的向量数据库 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 排除不适合的方案： FAISS：单机库，不支持分布式，无法满足高可用和数据… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. Chroma：定位轻量级，不适合大规模生产环境 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. Pinecone：全托管方案，数据出境合规问题（数据必须存在海外） → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只说 A 好 B 不好，没有说混合方案或选型条件。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>3. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「向量数据库选型：Pinecone vs Weaviate vs Chroma vs …」（/custom/ai100-rag/014-vector-database-comparison） — 要点：**Pinecone** 是全托管方案，适合无运维团队的企业；**Weaviate** 提供混合检索和模块化设计，开源灵活；**Milvus** 专为十亿级向量规模设计，需要数据工程能力；**Chro…</p><p>· 「4. 向量数据库怎么选？Milvus、FAISS、Qdrant 各自适合什么场景？」（/custom/kama-rag/rag_interview-q4） — 要点：面试官会问：&amp;quot;你们项目用的什么向量数据库…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：向量数据库选型：Pinecone vs Weaviate vs Chroma vs …、4. 向量数据库怎么选？Milvus、FAISS、Qdrant 各自适合什么场景？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：综合评估各方案的性能、功能、运维成本，选择最适合企业级场景的向量数据库。</p><p>Action：我重点做了三件事——Situation：项目需要一个向量数据库来存储和检索文档 embedding，候选方案包括 Milvus、 Pinecone、Weaviate、Qdrant、Chroma、FAISS 等；Task：综合评估各方案的性能、功能、运维成本，选择最适合企业级场景的向量数据库；Action： ##</p><p>Result：最终选择 Milvus，部署了 3 节点集群。线上稳定运行 8 个月，P99 延迟稳定在 50ms 以内。数据量从 200 万增长到 800 万文档，通过水平扩展平滑支撑。</p><p>你也可以补充：本站题库「向量数据库选型：Pinecone vs Weaviate vs Chroma vs …」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q7</span><span class="guide-q-text">系统的可扩展性是怎么设计的？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：系统需要支持业务快速迭代，包括新增工具、新增知识源、新增 Agent 类型、新增模型等，不能每次都改核心代码。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：设计一套可扩展架构，让新功能接入的边际成本趋近于零。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 插件化工具系统：</strong></p>
</div></div>
</div>

```python
   class BaseTool(ABC):
       @abstractmethod
       def name(self) -> str: ...
       @abstractmethod
       def description(self) -> str: ...
       @abstractmethod
       def parameters_schema(self) -> dict: ...

       @abstractmethod
       async def execute(self, **kwargs) -> ToolResult: ...

    所有工具继承 BaseTool ，通过 ToolRegistry 自动注册。
    工具描述自动生成 Function Calling 的 JSON Schema。
2. 可配置的检索管道：
    检索管道通过 YAML 配置文件定义：
                                                                 yaml
   retrieval_pipeline:
     - name: vector_search
       engine: milvus
       top_k: 20
       weight: 0.6
     - name: keyword_search
       engine: elasticsearch
       top_k: 20
       weight: 0.4
   reranker:
     model: bge-reranker-v2-m3
     top_k: 5

     新增检索通道只需添加配置项和实现对应引擎接口。
3. 模型抽象层：
     统一的 LLMProvider 接口，支持 OpenAI、Anthropic、本地模型等。
     通过配置切换模型，不修改业务代码。
4. 事件总线：
     核心流程通过事件总线解耦。
     新增功能可以通过监听事件来扩展，不侵入主流程。
Result：
   新工具接入：平均 2 小时（实现接口 + 写配置）。

 新检索通道接入：半天。
 切换底层模型：改一行配置，零代码改动。
 系统在 6 个月内新增了 8 个工具、3 个检索通道，核心代码零修改。

```

<div class="guide-qa">
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation：系统需要支持业务快速迭代，包括新增工具、新增知识源、新增 A… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：设计一套可扩展架构，让新功能接入的边际成本趋近于零 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 插件化工具系统： ```python class BaseTool(ABC… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 可配置的检索管道：检索管道通过 YAML 配置文件定义： yaml ret… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 0.6 - name: keyword_search engine: elast… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>3. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Function Calling 工具设计最佳实践」（/custom/today-interview/function-calling-design） — 要点：每个工具只做一件事、参数少而精、description 包含正例和反例、error 返回结构化而非纯文本——定义好，模型才可能调对。…</p><p>· 「4. Function Call 是什么？底层怎么实现？」（/custom/kama-agent/agent_interview-q4） — 要点：面试官会问：&amp;quot;Function Call 和普通的 Prompt + 正则解析有什么区别…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：Function Calling 工具设计最佳实践、4. Function Call 是什么？底层怎么实现？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：设计一套可扩展架构，让新功能接入的边际成本趋近于零。</p><p>Action：我重点做了三件事——Situation：系统需要支持业务快速迭代，包括新增工具、新增知识源、新增 Agent 类型、新增模型等，不能每次都改核心代码；Task：设计一套可扩展架构，让新功能接入的边际成本趋近于零；Action： ##</p><p>Result：... 所有工具继承 BaseTool ，通过 ToolRegistry 自动注册。工具描述自动生成 Function Calling 的 JSON Schema。 2. 可配置的检索管道：检索管道通过 YAML 配置文件定义： yaml retrieval_pipeline: - name: ve</p><p>你也可以补充：本站题库「Function Calling 工具设计最佳实践」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q8</span><span class="guide-q-text">如果让你重新设计这个系统，你会怎么改进？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：系统已经稳定运行一段时间，积累了很多实践经验和教训，有一些当初的设计决策在回头看是可以优化的。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：基于实际运行经验，总结需要改进的点，给出具体的优化方案。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 评估引入（Evaluation-Driven Development）：</strong></p>
<p>当初测试主要靠手动验证，应该从项目开始就建立自动化评估体系。改进：引入 RAGAS、DeepEval 等框架，建立 CI 流水线中的自动评估。每次提交自动跑评估集（500+ case），防止回归。</p>
<p class="guide-a-step"><strong>2. 可观测性增强：</strong></p>
<p>当初的日志系统是后补的，trace 不够完整。改进：从第一行代码就接入 LangSmith / LangFuse，实现全链路 trace。每个 Agent 步骤都有 span，可以在 dashboard 上看到完整的推理链路。</p>
<p class="guide-a-step"><strong>3. Streaming 优先架构：</strong></p>
<p>当初是先实现同步接口，后来改成流式，改造成本很高。改进：从设计阶段就以 SSE/WebSocket 流式为默认通信方式。</p>
<p class="guide-a-step"><strong>4. 更细粒度的模型路由：</strong></p>
<p>当初只有简单/复杂两档路由。改进：根据任务类型（分类/生成/推理/摘要）、输入长度、质量要求，做更细粒度的模型选择。</p>
<p class="guide-a-step"><strong>5. Agent 记忆系统重构：</strong></p>
<p>当初的记忆系统比较粗糙，只是简单的窗口截断。改进：实现分层记忆（工作记忆 + 情景记忆 + 语义记忆），引入记忆索引和检索机制。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：这些改进方案已经在新版本中逐步实施，形成了团队的最佳实践文档。这个反思过程本身也体现了持续优化的工程思维。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation：系统已经稳定运行一段时间，积累了很多实践经验和教训，有一些当… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：基于实际运行经验，总结需要改进的点，给出具体的优化方案 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 评估引入（Evaluation-Driven Development）：当… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 可观测性增强：当初的日志系统是后补的，trace 不够完整。改进：从第一行… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 3. Streaming 优先架构：当初是先实现同步接口，后来改成流式，改造成本… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」（/custom/xiaolin-agent/patterns） — 要点：我理解 Agent 和 Workflow 最核心的区别是「谁来决定下一步」…</p><p>· 「说说 Single-Agent 和 Multi-Agent 的设计方案？」（/custom/xiaolin-agent/single_multi） — 要点：Single-Agent 适合任务流程清晰、复杂度适中的场景，实现简单、好维护；Multi-Agent 适合需要专业分工、任务量大或者需要并行执行的复杂场景…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 记忆：事实 vs 推断分开存、写入时机、冲突合并、跨会话权限。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…、说说 Single-Agent 和 Multi-Agent 的设计方案？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：系统已经稳定运行一段时间，积累了很多实践经验和教训，有一些当初的设计决策在回头看是可以优化的。</p><p>Task：基于实际运行经验，总结需要改进的点，给出具体的优化方案。</p><p>Action：我重点做了三件事——Situation：系统已经稳定运行一段时间，积累了很多实践经验和教训，有一些当初的设计决策在回头看是可以优化的；Task：基于实际运行经验，总结需要改进的点，给出具体的优化方案；Action： ##</p><p>Result：这些改进方案已经在新版本中逐步实施，形成了团队的最佳实践文档。这个反思过程本身也体现了持续优化的工程思维。</p><p>你也可以补充：本站题库「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q9</span><span class="guide-q-text">你的系统能支持多少并发？怎么评估的？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：系统上线前需要进行压力测试，评估系统的并发处理能力，确保能满足业务高峰期的需求。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：设计压测方案，找到系统的性能瓶颈和容量上限。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 压测工具和方法：</strong></p>
<p>使用 Locust 进行分布式压测，模拟真实用户行为。压测场景：简单问答（单轮）、多轮对话、RAG 检索问答、工具调用。按比例混合：简单问答 40%、RAG 30%、多轮对话 20%、工具调用 10%。</p>
<p class="guide-a-step"><strong>2. 系统配置（压测环境）：</strong></p>
<p>API 服务：4 个 Pod，每个 4C8G。Milvus：3 节点集群，每节点 8C32G。Redis：3 节点 Sentinel 集群。LLM：使用云端 API（GPT-4 级别），QPS 限制 200。</p>
<p class="guide-a-step"><strong>3. 压测结果：</strong></p>
<p>50 并发：P99 延迟 2.8s，QPS 48，错误率 0%。100 并发：P99 延迟 4.2s，QPS 85，错误率 0.1%。200 并发：P99 延迟 8.5s，QPS 120，错误率 2.3%。300 并发：P99 延迟 15s+，QPS 110（开始下降），错误率 8.7%。</p>
<p class="guide-a-step"><strong>4. 瓶颈分析：</strong></p>
<p>主要瓶颈在 LLM API 的 QPS 限制和延迟。Milvus 检索在 200 并发下仍然很轻松（延迟 &amp;lt; 80ms）。通过模型路由（简单查询走小模型）可以有效缓解 LLM 瓶颈。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：系统安全容量上限定为 150 并发（P99 &amp;lt; 5s，错误率 &amp;lt; 0.5%）。日常业务高峰约 80 并发，有充足余量。制定了弹性扩缩容策略：并发超过 120 时自动扩容 API Pod。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation：系统上线前需要进行压力测试，评估系统的并发处理能力，确保能满… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：设计压测方案，找到系统的性能瓶颈和容量上限 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 压测工具和方法：使用 Locust 进行分布式压测，模拟真实用户行为。压测… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 系统配置（压测环境）： API 服务：4 个 Pod，每个 4C8G → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. Milvus：3 节点集群，每节点 8C32G → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>3. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>4. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「LLM-as-Judge：使用 LLM 评估 LLM 输出」（/custom/ai100-evaluation/071-llm-as-judge） — 要点：LLM-as-Judge 是用一个强大的 LLM（如 GPT-4）自动评估另一个 LLM 输出质量的技术，在成本和质量之间取得了最佳平衡。两种核心模式：**Pointwise 评分**（对单个输出按维…</p><p>· 「4. 向量数据库怎么选？Milvus、FAISS、Qdrant 各自适合什么场景？」（/custom/kama-rag/rag_interview-q4） — 要点：面试官会问：&amp;quot;你们项目用的什么向量数据库…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：LLM-as-Judge：使用 LLM 评估 LLM 输出、4. 向量数据库怎么选？Milvus、FAISS、Qdrant 各自适合什么场景？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：系统上线前需要进行压力测试，评估系统的并发处理能力，确保能满足业务高峰期的需求。</p><p>Task：设计压测方案，找到系统的性能瓶颈和容量上限。</p><p>Action：我重点做了三件事——Situation：系统上线前需要进行压力测试，评估系统的并发处理能力，确保能满足业务高峰期的需求；Task：设计压测方案，找到系统的性能瓶颈和容量上限；Action： ##</p><p>Result：系统安全容量上限定为 150 并发（P99 &amp;lt; 5s，错误率 &amp;lt; 0.5%）。日常业务高峰约 80 并发，有充足余量。制定了弹性扩缩容策略：并发超过 120 时自动扩容 API Pod。</p><p>你也可以补充：本站题库「LLM-as-Judge：使用 LLM 评估 LLM 输出」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q10</span><span class="guide-q-text">为什么要做模型路由？直接用一个模型不行吗？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：系统每月的 LLM API 费用高达数万元，且不同类型的查询对模型能力的需求差异很大。简单查询用 GPT-4 是浪费，复杂推理用小模型又不够。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：设计一个智能模型路由机制，在保证回答质量的前提下，显著降低 token 成本。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 分析查询分布：</strong></p>
<p>统计发现 60% 的查询是简单问答（事实检索、FAQ），小模型即可胜任。25% 是中等复杂度（需要多步推理或知识综合）。15% 是高复杂度（需要强推理、复杂指令遵循）。</p>
<p class="guide-a-step"><strong>2. 路由策略设计：</strong></p>
<p>路由判断维度：</p>
</div></div>
</div>

```text
├── 任务复杂度：简单检索 / 多步推理 / 复杂生成
├── 上下文长度：短文本 / 长文本
├── 质量要求：普通回答 / 高精度回答
└── 用户等级：普通用户 / VIP 用户
```

#### 3. 模型矩阵：

    轻量模型（GPT-4o-mini / Claude 3 Haiku）： 简单问答、意图分类、实体提取。

     标准模型（GPT-4o / Claude 3.5 Sonnet）： 中等复杂度推理、RAG 答案生成。
     强力模型（GPT-4 / Claude 3 Opus）： 复杂推理、长文本分析、关键业务决策。
#### 4. 路由器实现：

     轻量级分类器（基于规则 + FastText）判断查询复杂度，延迟 &lt; 3ms。
     动态降级机制：强力模型超时或报错时，自动降级到标准模型。
Result：
   月均 token 成本降低 62%（从 5 万降到 1.9 万）。
   回答质量几乎无损（用户满意度仅下降 1.2%）。
   系统整体延迟降低 35%（小模型响应更快）。

<div class="guide-qa">
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation：系统每月的 LLM API 费用高达数万元，且不同类型的查询… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：设计一个智能模型路由机制，在保证回答质量的前提下，显著降低 token… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 分析查询分布：统计发现 60% 的查询是简单问答（事实检索、FAQ），小模… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 25% 是中等复杂度（需要多步推理或知识综合） → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 15% 是高复杂度（需要强推理、复杂指令遵循） → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Reasoning 模型（o1/o3/DeepSeek-R1）vs 标准模型：架构差…」（/custom/ai100-planning/055-reasoning-models） — 要点：Reasoning 模型（又称 Large Reasoning Models, LRMs）与标准 LLM 的核心区别是**测试时计算扩展（Test-Time Compute Scaling）**：标准…</p><p>· 「LLM-as-Judge：使用 LLM 评估 LLM 输出」（/custom/ai100-evaluation/071-llm-as-judge） — 要点：LLM-as-Judge 是用一个强大的 LLM（如 GPT-4）自动评估另一个 LLM 输出质量的技术，在成本和质量之间取得了最佳平衡。两种核心模式：**Pointwise 评分**（对单个输出按维…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 记忆：事实 vs 推断分开存、写入时机、冲突合并、跨会话权限。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：Reasoning 模型（o1/o3/DeepSeek-R1）vs 标准模型：架构差…、LLM-as-Judge：使用 LLM 评估 LLM 输出。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：设计一个智能模型路由机制，在保证回答质量的前提下，显著降低 token 成本。</p><p>Action：我重点做了三件事——Situation：系统每月的 LLM API 费用高达数万元，且不同类型的查询对模型能力的需求差异很大。简单查询用 GPT-4 是浪费，复杂推理用小模型又不够；Task：设计一个智能模型路由机制，在保证回答质量的前提下，显著降低 token 成本；Action： ##</p><p>Result：月均 token 成本降低 62%（从 5 万降到 1.9 万）。回答质量几乎无损（用户满意度仅下降 1.2%）。系统整体延迟降低 35%（小模型响应更快）。</p><p>你也可以补充：本站题库「Reasoning 模型（o1/o3/DeepSeek-R1）vs 标准模型：架构差…」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q11</span><span class="guide-q-text">怎么设计的对话管理和上下文维护？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：企业客服场景中多轮对话非常普遍，需要在多轮交互中维护一致的上下文，同时控制token 消耗。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：设计对话管理系统，在有限的 context window 内高效利用上下文信息。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 分层上下文管理：</strong></p>
<p>系统层： System Prompt（固定，约 800 tokens），定义 Agent 角色和行为规范。会话层： 对话历史（动态，滑动窗口），最近 N 轮对话。检索层： RAG 检索到的知识上下文（动态，按相关性排序）。工具层： 工具调用结果（临时，用完即清）。</p>
<p class="guide-a-step"><strong>2. 窗口管理策略：</strong></p>
<p>维护最近 10 轮对话的完整记录。超过 10 轮时，前面的对话自动摘要压缩。摘要保留关键信息：用户意图、关键决策、未解决的问题。</p>
<p class="guide-a-step"><strong>3. Token 预算分配：</strong></p>
<p>假设总 context window 为 8K tokens：System Prompt：800 tokens（10%）对话历史 + 摘要：2400 tokens（30%）检索上下文：3200 tokens（40%）预留输出：1600 tokens（20%）</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：多轮对话的上下文一致性从 76% 提升到 94%（基于人工评估）。token 消耗控制在预算内，无超限导致的截断问题。支持最长 50 轮对话不丢失关键上下文。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation：企业客服场景中多轮对话非常普遍，需要在多轮交互中维护一致的上… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：设计对话管理系统，在有限的 context window 内高效利用上… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 分层上下文管理：系统层： System Prompt（固定，约 800 t… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 窗口管理策略：维护最近 10 轮对话的完整记录。超过 10 轮时，前面的对… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 3. Token 预算分配：假设总 context window 为 8K to… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>3. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「System Prompt 设计的核心原则」（/custom/ai100-prompt/059-system-prompt-principles） — 要点：System Prompt 是 LLM 应用的"宪法"——定义模型的身份、行为边界和输出规范，是模型看到用户输入之前的指令框架。核心设计原则包括：(1) **角色定义**——明确模型是谁、擅长什么、不…</p><p>· 「Prompt Chaining：多步骤 Prompt 的设计与编排」（/custom/ai100-prompt/063-prompt-chaining） — 要点：Prompt Chaining（提示链）是将复杂任务分解为多个顺序执行的 LLM 调用，每个调用的输出作为下一个调用的输入。它是 Agentic AI 中最基础的设计模式，也被称为 Pipeline …</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 记忆：事实 vs 推断分开存、写入时机、冲突合并、跨会话权限。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：System Prompt 设计的核心原则、Prompt Chaining：多步骤 Prompt 的设计与编排。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：设计对话管理系统，在有限的 context window 内高效利用上下文信息。</p><p>Action：我重点做了三件事——Situation：企业客服场景中多轮对话非常普遍，需要在多轮交互中维护一致的上下文，同时控制 token 消耗；Task：设计对话管理系统，在有限的 context window 内高效利用上下文信息；Action： ##</p><p>Result：多轮对话的上下文一致性从 76% 提升到 94%（基于人工评估）。 token 消耗控制在预算内，无超限导致的截断问题。支持最长 50 轮对话不丢失关键上下文。</p><p>你也可以补充：本站题库「System Prompt 设计的核心原则」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q12</span><span class="guide-q-text">你的系统支持哪些模型？怎么做模型适配的？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：企业客户有不同的模型偏好：有的要用 OpenAI，有的要用国产模型（如通义千问、文心一言），有的有本地部署需求。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：设计统一的模型抽象层，让系统可以无缝切换不同的 LLM 提供商。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 统一接口抽象：</strong></p>
</div></div>
</div>

```python
   class LLMProvider(ABC):
       async def chat(self, messages, **kwargs) -> LLMResponse: ...
       async def stream_chat(self, messages, **kwargs) ->
   AsyncIterator[str]: ...
       def count_tokens(self, text) -> int: ...
       def get_model_info(self) -> ModelInfo: ...

```

#### 2. 适配器模式实现：

   OpenAIProvider ：适配 OpenAI / Azure OpenAI API。
   AnthropicProvider ：适配 Claude 系列。

   QwenProvider ：适配通义千问（兼容 OpenAI 格式）。

    LocalProvider   ：适配 vLLM / Ollama 部署的本地模型。
#### 3. 差异化处理：

     Function Calling 格式：OpenAI 用 tools 字段，Claude 用 tool_use ，统一抽象后业
     务无感知。
     Token 计算：不同模型的 tokenizer 不同，每个 Provider 实现自己的 count_tokens 。
     流式响应：不同 API 的 SSE 格式略有差异，在 Provider 层统一处理。
Result：
   支持 6 种模型提供商，切换只需改配置。
   新模型适配：平均 1 天完成（实现 Provider + 测试）。
   多个客户使用不同模型，同一套业务代码。

<div class="guide-qa">
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation：企业客户有不同的模型偏好：有的要用 OpenAI，有的要用国… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：设计统一的模型抽象层，让系统可以无缝切换不同的 LLM 提供商 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 统一接口抽象： ```python class LLMProvider(A… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 适配器模式实现： OpenAIProvider ：适配 OpenAI / … → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. AnthropicProvider ：适配 Claude 系列 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像给员工配电脑和系统账号：没有工具只能动嘴，有了工具才能查库存、下单、跑代码。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「OpenAI Assistants API vs Anthropic Claude …」（/custom/ai100-frameworks/099-assistants-api-vs-claude-sdk） — 要点：OpenAI 和 Anthropic 分别推出了官方 Agent 开发方案，代表了两种不同的设计哲学。**OpenAI Agents SDK**（2025-03 发布，**底层基于新的 Respons…</p><p>· 「Function Calling 工具设计最佳实践」（/custom/today-interview/function-calling-design） — 要点：每个工具只做一件事、参数少而精、description 包含正例和反例、error 返回结构化而非纯文本——定义好，模型才可能调对。…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：OpenAI Assistants API vs Anthropic Claude …、Function Calling 工具设计最佳实践。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：企业客户有不同的模型偏好：有的要用 OpenAI，有的要用国产模型（如通义千问、文心一言），有的有本地部署需求。</p><p>Task：设计统一的模型抽象层，让系统可以无缝切换不同的 LLM 提供商。</p><p>Action：我重点做了三件事——Situation：企业客户有不同的模型偏好：有的要用 OpenAI，有的要用国产模型（如通义千问、文心一言），有的有本地部署需求；Task：设计统一的模型抽象层，让系统可以无缝切换不同的 LLM 提供商；Action： ##</p><p>Result：支持 6 种模型提供商，切换只需改配置。新模型适配：平均 1 天完成（实现 Provider + 测试）。多个客户使用不同模型，同一套业务代码。</p><p>你也可以补充：本站题库「OpenAI Assistants API vs Anthropic Claude …」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q13</span><span class="guide-q-text">如何处理长文档输入？上下文窗口不够怎么办？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：企业文档动辄数万字甚至数十万字，远超模型的 context window 限制（如 GPT-4的 8K/32K/128K）。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：设计一套长文档处理方案，在不丢失关键信息的前提下，让系统能处理任意长度的文档。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 分块策略（Chunking）：</strong></p>
<p>基于语义的分块（不是简单按固定长度切分）：先按章节/段落自然分割。每个 chunk 大小目标 512 tokens，允许 ±20% 浮动。相邻 chunk 有 10% 的重叠，避免语义断裂。递归分块：先按 \n\n 分，不够再按 \n 分，再按句号分。</p>
<p class="guide-a-step"><strong>2. Map-Reduce 策略（超长文档总结）：</strong></p>
<p>Map 阶段：对每个 chunk 独立做摘要。Reduce 阶段：对所有 chunk 摘要再做综合总结。适用于"总结这份 100 页的报告"类需求。</p>
<p class="guide-a-step"><strong>3. Refine 策略（需要细节的场景）：</strong></p>
<p>逐 chunk 处理，每次将上一步结果和当前 chunk 一起输入。适用于"找到文档中所有提到的风险点"类需求。</p>
<p class="guide-a-step"><strong>4. 智能截断（实时问答场景）：</strong></p>
<p>RAG 检索后，只取最相关的 top-5 chunk 放入 context。通过 reranker 精排，确保最相关的内容在前面。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：支持处理最长 50 万字的文档。Map-Reduce 总结准确率达到 88%（与人工总结对比）。实时问答场景的检索-生成延迟控制在 3s 以内。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation：企业文档动辄数万字甚至数十万字，远超模型的 context … → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：设计一套长文档处理方案，在不丢失关键信息的前提下，让系统能处理任意长度… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 分块策略（Chunking）：基于语义的分块（不是简单按固定长度切分）：先… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. Map-Reduce 策略（超长文档总结）： Map 阶段：对每个 chu… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. Reduce 阶段：对所有 chunk 摘要再做综合总结。适用于"总结这份 10… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「RAG 文档切分最佳实践」（/custom/today-interview/rag-chunking） — 要点：看文档类型选策略——结构化用语义分块、非结构化用滑动窗口加 overlap、表格另存 metadata；切太小丢上下文、切太大损失精度，256-512 token 是常见起点。…</p><p>· 「RAG 中的文档是怎么存的？粒度是多大？详细说说文档切割（Chunking）策略…」（/custom/xiaolin-rag/chunking） — 要点：文档不能直接存进向量库，必须先切成小块也就是 chunk，每个 chunk 分别向量化之后存成一条记录…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 记忆：事实 vs 推断分开存、写入时机、冲突合并、跨会话权限。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：RAG 文档切分最佳实践、RAG 中的文档是怎么存的？粒度是多大？详细说说文档切割（Chunking）策略…。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：设计一套长文档处理方案，在不丢失关键信息的前提下，让系统能处理任意长度的文档。</p><p>Action：我重点做了三件事——Situation：企业文档动辄数万字甚至数十万字，远超模型的 context window 限制（如 GPT-4 的 8K/32K/128K）；Task：设计一套长文档处理方案，在不丢失关键信息的前提下，让系统能处理任意长度的文档；Action： ##</p><p>Result：支持处理最长 50 万字的文档。 Map-Reduce 总结准确率达到 88%（与人工总结对比）。实时问答场景的检索-生成延迟控制在 3s 以内。</p><p>你也可以补充：本站题库「RAG 文档切分最佳实践」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q14</span><span class="guide-q-text">系统的安全架构是怎么设计的？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：企业级 AI 系统面临多种安全威胁：Prompt 注入、数据泄露、恶意输入、越权访问等。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：建立多层安全防护体系，确保系统的安全性和数据合规性。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 输入安全层（Prompt 注入防护）：</strong></p>
<p>输入预处理：特殊字符转义、长度限制（单次输入 ≤ 2000 字符）。注入检测模型：训练了一个轻量级分类器，识别常见注入模式（如"忽略之前的指令"、"你现在是..."等）。角色隔离：用户输入和系统指令严格分离（不拼接在同一个 message 中）。</p>
<p class="guide-a-step"><strong>2. 数据安全层：</strong></p>
<p>敏感信息脱敏：PII（个人身份信息）在输入 LLM 前自动脱敏，输出后还原。知识库权限控制：不同角色可访问不同的知识分区（基于 RBAC）。日志脱敏：对话日志中的敏感信息自动打码。</p>
<p class="guide-a-step"><strong>3. 输出安全层：</strong></p>
<p>输出内容审核：调用内容安全 API 检查输出是否包含违规内容。置信度阈值：低置信度回答添加免责声明。答案溯源：每个回答标注引用的知识来源，便于验证。</p>
<p class="guide-a-step"><strong>4. 系统安全层：</strong></p>
<p>API 鉴权：JWT + API Key 双重认证。速率限制：每用户每分钟最多 20 次请求。审计日志：所有操作可追溯。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：Prompt 注入防护拦截率 97%（基于 1000 个攻击样本测试）。零数据泄露事故。通过了公司内部安全团队的渗透测试。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation：企业级 AI 系统面临多种安全威胁：Prompt 注入、数据… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：建立多层安全防护体系，确保系统的安全性和数据合规性 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 输入安全层（Prompt 注入防护）：输入预处理：特殊字符转义、长度限制（… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 数据安全层：敏感信息脱敏：PII（个人身份信息）在输入 LLM 前自动脱敏… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 3. 输出安全层：输出内容审核：调用内容安全 API 检查输出是否包含违规内容。… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】可以把 Agent 想成「会自己查资料、记笔记、调系统的数字员工」，比普通 ChatBot 多了闭环和多步决策。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Prompt Chaining：多步骤 Prompt 的设计与编排」（/custom/ai100-prompt/063-prompt-chaining） — 要点：Prompt Chaining（提示链）是将复杂任务分解为多个顺序执行的 LLM 调用，每个调用的输出作为下一个调用的输入。它是 Agentic AI 中最基础的设计模式，也被称为 Pipeline …</p><p>· 「跨模型 Prompt 迁移：如何编写模型无关的 Prompt？」（/custom/ai100-prompt/068-cross-model-prompt-portability） — 要点：跨模型 Prompt 迁移（Cross-Model Prompt Portability）是指让同一个 Prompt 在不同 LLM（GPT-4、Claude、Gemini、Llama 等）上都能有效…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：Prompt Chaining：多步骤 Prompt 的设计与编排、跨模型 Prompt 迁移：如何编写模型无关的 Prompt？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：建立多层安全防护体系，确保系统的安全性和数据合规性。</p><p>Action：我重点做了三件事——Situation：企业级 AI 系统面临多种安全威胁：Prompt 注入、数据泄露、恶意输入、越权访问等；Task：建立多层安全防护体系，确保系统的安全性和数据合规性；Action： ##</p><p>Result：Prompt 注入防护拦截率 97%（基于 1000 个攻击样本测试）。零数据泄露事故。通过了公司内部安全团队的渗透测试。</p><p>你也可以补充：本站题库「Prompt Chaining：多步骤 Prompt 的设计与编排」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q15</span><span class="guide-q-text">你怎么看待 MCP（Model Context Protocol）？在你的系统中是怎么使</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>用的？</p>
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：Anthropic 发布了 MCP 协议，提供了一种标准化的方式让 AI 模型与外部工具和数据源交互。需要评估是否在系统中采用 MCP。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：评估 MCP 的价值，决定是否以及如何在现有系统中集成 MCP。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. MCP 核心价值分析：</strong></p>
<p>标准化接口： 定义了 tools、resources、prompts 三大原语，统一了不同工具的接入方式。双向通信： 基于 JSON-RPC 2.0，支持服务端主动推送通知。传输灵活： 支持 stdio（本地进程）和 SSE（远程服务）两种传输方式。</p>
<p class="guide-a-step"><strong>2. 与 Function Calling 的对比：</strong></p>
<p>Function Calling 是模型厂商的私有协议，每个厂商格式不同。MCP 是开放协议，理论上可以跨模型、跨客户端复用工具。MCP 更适合构建工具生态，Function Calling 更适合简单集成。</p>
<p class="guide-a-step"><strong>3. 在系统中的应用：</strong></p>
<p>将现有工具封装为 MCP Server，对外提供标准化接口。数据库查询、API 调用、文件操作等工具都通过 MCP Server 暴露。内部 Agent 调用工具时，通过 MCP Client 发起请求。</p>
<p class="guide-a-step"><strong>4. 落地挑战和解决：</strong></p>
<p>MCP 生态还在早期，部分工具的 MCP 封装需要自己开发。安全审核：每个 MCP Server 的权限需要严格控制。性能开销：MCP 协议的序列化/反序列化有额外开销（约 5ms），可接受。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：工具接入标准化后，新工具的平均接入时间从 2 天缩短到 4 小时。工具可以在不同项目之间复用，减少重复开发。为后续接入社区 MCP 工具生态奠定基础。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 用的？ Situation： Anthropic 发布了 MCP 协议，提供了一… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：评估 MCP 的价值，决定是否以及如何在现有系统中集成 MCP → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. MCP 核心价值分析：标准化接口：定义了 tools、resources、… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2.0，支持服务端主动推送通知。传输灵活：支持 stdio（本地进程）和 SSE… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 2. 与 Function Calling 的对比： Function Call… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像给员工配电脑和系统账号：没有工具只能动嘴，有了工具才能查库存、下单、跑代码。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>3. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Function Calling 工具设计最佳实践」（/custom/today-interview/function-calling-design） — 要点：每个工具只做一件事、参数少而精、description 包含正例和反例、error 返回结构化而非纯文本——定义好，模型才可能调对。…</p><p>· 「MCP（Model Context Protocol）是什么？它如何标准化工具集成？」（/custom/ai100-tool-use/027-model-context-protocol） — 要点：MCP（Model Context Protocol）是 Anthropic 于 2024 年 11 月推出的开放标准，用于标准化 AI 系统与外部工具、数据源的集成方式。类比"AI 界的 USB-C…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：Function Calling 工具设计最佳实践、MCP（Model Context Protocol）是什么？它如何标准化工具集成？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：评估 MCP 的价值，决定是否以及如何在现有系统中集成 MCP。</p><p>Action：我重点做了三件事——用的？ Situation： Anthropic 发布了 MCP 协议，提供了一种标准化的方式让 AI 模型与外部工具和数据源交互。需要评估是否在系统中采用 MCP；Task：评估 MCP 的价值，决定是否以及如何在现有系统中集成 MCP；Action： ##</p><p>Result：工具接入标准化后，新工具的平均接入时间从 2 天缩短到 4 小时。工具可以在不同项目之间复用，减少重复开发。为后续接入社区 MCP 工具生态奠定基础。</p><p>你也可以补充：本站题库「Function Calling 工具设计最佳实践」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q16</span><span class="guide-q-text">如何设计 Agent 的错误恢复和重试机制？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：生产环境中 Agent 执行过程会遇到各种错误：LLM API 超时、工具调用失败、检索无结果等。简单的重试可能导致资源浪费或无限循环。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：设计一套智能的错误恢复机制，让 Agent 能优雅地处理各种异常情况。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 分层错误处理：</strong></p>
<p>可恢复错误（Retryable）： 网络超时、API 限流 → 指数退避重试（最多 3 次）。可降级错误（Degradable）： 主模型不可用 → 切换到备用模型。不可恢复错误（Fatal）： 权限不足、参数错误 → 向用户报告错误原因。</p>
<p class="guide-a-step"><strong>2. 指数退避重试：</strong></p>
<p>retry_delay = base_delay * (2 ^ attempt) + random_jitterbase_delay = 1s, max_delay = 30s, max_attempts = 3</p>
<p class="guide-a-step"><strong>3. Agent 级别的自愈：</strong></p>
<p>工具调用失败时，Agent 会收到错误信息，由 LLM 决定下一步：换一种方式调用工具（修改参数）。尝试使用替代工具。告知用户无法完成并解释原因。</p>
<p class="guide-a-step"><strong>4. 断点续传：</strong></p>
<p>复杂任务的中间状态持久化到 Redis。系统崩溃后可以从最近的检查点恢复执行。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：因 API 超时导致的用户可见错误从 5% 降低到 0.3%。模型降级机制确保了 99.5% 的可用性。断点续传避免了复杂任务的重复执行，节省了约 15% 的 token 成本。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation：生产环境中 Agent 执行过程会遇到各种错误：LLM AP… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：设计一套智能的错误恢复机制，让 Agent 能优雅地处理各种异常情况 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 分层错误处理：可恢复错误（Retryable）：网络超时、API 限流→指… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 指数退避重试： retry_delay = base_delay * (2… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 3. Agent 级别的自愈：工具调用失败时，Agent 会收到错误信息，由 L… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>3. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>4. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」（/custom/xiaolin-agent/patterns） — 要点：我理解 Agent 和 Workflow 最核心的区别是「谁来决定下一步」…</p><p>· 「说说 Single-Agent 和 Multi-Agent 的设计方案？」（/custom/xiaolin-agent/single_multi） — 要点：Single-Agent 适合任务流程清晰、复杂度适中的场景，实现简单、好维护；Multi-Agent 适合需要专业分工、任务量大或者需要并行执行的复杂场景…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…、说说 Single-Agent 和 Multi-Agent 的设计方案？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：说清要优化的目标指标</p><p>Action：我重点做了三件事——Situation：生产环境中 Agent 执行过程会遇到各种错误：LLM API 超时、工具调用失败、检索无结果等。简单的重试可能导致资源浪费或无限循环；Task：设计一套智能的错误恢复机制，让 Agent 能优雅地处理各种异常情况；Action： ##</p><p>Result：因 API 超时导致的用户可见错误从 5% 降低到 0.3%。模型降级机制确保了 99.5% 的可用性。断点续传避免了复杂任务的重复执行，节省了约 15% 的 token 成本。</p><p>你也可以补充：本站题库「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q17</span><span class="guide-q-text">你的系统支持多租户吗？怎么实现的？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：系统需要同时服务多个企业客户，每个客户有自己的知识库、配置和数据隔离要求。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：设计多租户架构，确保数据隔离、配置独立、性能互不影响。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 数据隔离策略：</strong></p>
<p>知识库隔离： 每个租户在 Milvus 中使用独立的 Collection（分区方案在数据量大时性能不好）。对话数据隔离： 每个租户的对话记录存储在独立的数据库 schema 中。缓存隔离： Redis 中使用 tenant_id: 作为 key 前缀。</p>
<p class="guide-a-step"><strong>2. 配置独立：</strong></p>
<p>每个租户可以自定义：System Prompt、工具集合、模型选择、检索策略。配置存储在数据库中，支持热更新（无需重启服务）。</p>
<p class="guide-a-step"><strong>3. 资源限制：</strong></p>
<p>每个租户有独立的 QPS 限制和 token 配额。使用 Redis 令牌桶算法实现限流。超出配额时返回 429 Too Many Requests。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：支持了 20+ 企业客户同时使用。零数据泄露事故（严格的 tenant_id 过滤）。单个客户的异常不会影响其他客户（资源隔离）。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation：系统需要同时服务多个企业客户，每个客户有自己的知识库、配置和… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：设计多租户架构，确保数据隔离、配置独立、性能互不影响 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 数据隔离策略：知识库隔离：每个租户在 Milvus 中使用独立的 Coll… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 配置独立：每个租户可以自定义：System Prompt、工具集合、模型选… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 3. 资源限制：每个租户有独立的 QPS 限制和 token 配额。使用 Red… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>3. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「System Prompt 设计的核心原则」（/custom/ai100-prompt/059-system-prompt-principles） — 要点：System Prompt 是 LLM 应用的"宪法"——定义模型的身份、行为边界和输出规范，是模型看到用户输入之前的指令框架。核心设计原则包括：(1) **角色定义**——明确模型是谁、擅长什么、不…</p><p>· 「Prompt Chaining：多步骤 Prompt 的设计与编排」（/custom/ai100-prompt/063-prompt-chaining） — 要点：Prompt Chaining（提示链）是将复杂任务分解为多个顺序执行的 LLM 调用，每个调用的输出作为下一个调用的输入。它是 Agentic AI 中最基础的设计模式，也被称为 Pipeline …</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：System Prompt 设计的核心原则、Prompt Chaining：多步骤 Prompt 的设计与编排。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：系统需要同时服务多个企业客户，每个客户有自己的知识库、配置和数据隔离要求。</p><p>Task：设计多租户架构，确保数据隔离、配置独立、性能互不影响。</p><p>Action：我重点做了三件事——Situation：系统需要同时服务多个企业客户，每个客户有自己的知识库、配置和数据隔离要求；Task：设计多租户架构，确保数据隔离、配置独立、性能互不影响；Action： ##</p><p>Result：支持了 20+ 企业客户同时使用。零数据泄露事故（严格的 tenant_id 过滤）。单个客户的异常不会影响其他客户（资源隔离）。</p><p>你也可以补充：本站题库「System Prompt 设计的核心原则」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q18</span><span class="guide-q-text">你怎么看 Agent 架构的未来发展？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：AI Agent 技术发展迅速，架构范式在不断演进，需要对未来趋势有前瞻性判断。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：分析 Agent 架构的发展趋势，给出有见地的观点。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 当前阶段的特点（2024-2025）：</strong></p>
<p>以 ReAct、Plan-and-Execute 为主的单 Agent 架构成熟。多 Agent 协作开始落地但尚不成熟。工具生态（MCP、Function Calling）快速发展。</p>
<p class="guide-a-step"><strong>2. 近期趋势（2025-2026）：</strong></p>
<p>Agent 工作流 + 自主决策的混合： 关键路径用确定性工作流，非关键路径让 Agent 自主决策。长期记忆的突破： 从简单的向量存储到结构化的长期记忆系统。多模态 Agent： 不仅处理文本，还能理解和生成图像、代码、数据分析。</p>
<p class="guide-a-step"><strong>3. 中期展望（2026-2028）：</strong></p>
<p>Agent-to-Agent 协议标准化： 类似 MCP 但面向 Agent 间通信。自我进化的 Agent： Agent 能从历史执行经验中学习和优化。端到端的 Agent 开发平台： 从开发、测试、部署到监控的全生命周期平台。</p>
<p class="guide-a-step"><strong>4. 我的核心观点：</strong></p>
<p>Agent 的核心价值不是替代人，而是做信息和工具之间的桥梁。确定性和灵活性的平衡是 Agent 架构的核心挑战。可观测性和可控性是企业级 Agent 落地的关键。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：这些观点不仅是对技术趋势的判断，也指导了我们的技术选型和架构演进方向。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation： AI Agent 技术发展迅速，架构范式在不断演进，需要对… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：分析 Agent 架构的发展趋势，给出有见地的观点 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 当前阶段的特点（2024-2025）：以 ReAct、Plan-and-E… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 近期趋势（2025-2026）： Agent 工作流 + 自主决策的混合：… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 3. 中期展望（2026-2028）： Agent-to-Agent 协议标准化… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像侦探办案：先推理（Thought），再行动查线索（Action），看结果（Observation），循环直到破案。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 把 ReAct 说成「想一步做一步」但说不清 Observation 从哪来、何时停止。</p><p>3. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>4. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Agent 架构模式详解：ReAct、Plan-and-Execute、LATS、P…」（/custom/ai100-agent-arch/003-agent-architecture-patterns） — 要点：主流 Agent 架构模式各有侧重：**ReAct** 交替推理与行动，灵活且可解释性强，但 token 消耗高；**Plan-and-Execute** 先规划后执行，高效但适应性低；**LATS*…</p><p>· 「ReAct、Plan-and-Execute、Reflection 三种范式有什…」（/custom/xiaolin-agent/three_patterns） — 要点：我理解这三者是 Agent 开发里最主流的三种设计范式，核心区别在于「决策和执行的关系」…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 架构：步数上限、停止条件、死循环检测、Plan+ReAct 混合、画拓扑图。</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 记忆：事实 vs 推断分开存、写入时机、冲突合并、跨会话权限。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：Agent 架构模式详解：ReAct、Plan-and-Execute、LATS、P…、ReAct、Plan-and-Execute、Reflection 三种范式有什…。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：说清要优化的目标指标</p><p>Action：我重点做了三件事——Situation： AI Agent 技术发展迅速，架构范式在不断演进，需要对未来趋势有前瞻性判断；Task：分析 Agent 架构的发展趋势，给出有见地的观点；Action： ##</p><p>Result：这些观点不仅是对技术趋势的判断，也指导了我们的技术选型和架构演进方向。</p><p>你也可以补充：本站题库「Agent 架构模式详解：ReAct、Plan-and-Execute、LATS、P…」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

第二类：技术实现类问题

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q1</span><span class="guide-q-text">向量数据库是怎么选型的？分块策略是什么？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：企业知识库包含多种格式的文档（PDF、Word、HTML、Markdown），需要建立高效的向量检索系统。文档分块质量直接影响检索效果。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：选择合适的向量数据库并设计科学的文档分块策略。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 向量数据库选型（详见架构类 Q6）： 最终选择 Milvus。</strong></p>
<p class="guide-a-step"><strong>2. 分块策略设计：</strong></p>
<p>递归字符分块（默认策略）：分隔符优先级： \n\n → \n → 。 → ， → 空格chunk_size = 512 tokens，chunk_overlap = 50 tokens（约 10%）语义分块（高质量场景）：先计算每个句子的 embedding。相邻句子的余弦相似度低于阈值 0.7 时，视为语义断点。在语义断点处切分，保证每个 chunk 语义完整。结构化分块（特殊文档）：Markdown：按标题层级分块（ # 、 ## 、 ### ）。代码文档：按函数/类分块。表格：整表作为一个 chunk，附加上下文描述。</p>
<p class="guide-a-step"><strong>3. 分块元数据管理：</strong></p>
<p>每个 chunk 存储元数据：文档ID、标题、章节路径、页码、分块位置。检索时可利用元数据做过滤（如"只查某个文档的内容"）。</p>
<p class="guide-a-step"><strong>4. 分块质量评估：</strong></p>
<p>自建评估集，对比不同分块策略的检索命中率。定期抽样检查分块质量，调整参数。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：语义分块比固定长度分块的检索准确率提升 12%。结构化分块在技术文档场景下准确率提升 18%。分块参数经过 3 轮调优后趋于稳定。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】定义题考你能不能「用类比 + 结构」讲清楚，而不是堆术语。面试官想确认你真的理解，而不是背过。</p><p>【拆开理解】</p><p>1. Situation：企业知识库包含多种格式的文档（PDF、Word、HTML、M… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：选择合适的向量数据库并设计科学的文档分块策略 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 向量数据库选型（详见架构类 Q6）：最终选择 Milvus → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 分块策略设计：递归字符分块（默认策略）：分隔符优先级： \n\n → \n… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 0.7 时，视为语义断点。在语义断点处切分，保证每个 chunk 语义完整。结构… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只背一句定义，没有说「和普通 LLM 单次调用差在哪」。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「4. 向量数据库怎么选？Milvus、FAISS、Qdrant 各自适合什么场景？」（/custom/kama-rag/rag_interview-q4） — 要点：面试官会问：&amp;quot;你们项目用的什么向量数据库…</p><p>· 「LLM-as-Judge：使用 LLM 评估 LLM 输出」（/custom/ai100-evaluation/071-llm-as-judge） — 要点：LLM-as-Judge 是用一个强大的 LLM（如 GPT-4）自动评估另一个 LLM 输出质量的技术，在成本和质量之间取得了最佳平衡。两种核心模式：**Pointwise 评分**（对单个输出按维…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 记忆：事实 vs 推断分开存、写入时机、冲突合并、跨会话权限。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：4. 向量数据库怎么选？Milvus、FAISS、Qdrant 各自适合什么场景？、LLM-as-Judge：使用 LLM 评估 LLM 输出。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：选择合适的向量数据库并设计科学的文档分块策略。</p><p>Action：我重点做了三件事——Situation：企业知识库包含多种格式的文档（PDF、Word、HTML、Markdown），需要建立高效的向量检索系统。文档分块质量直接影响检索效果；Task：选择合适的向量数据库并设计科学的文档分块策略；Action： ##</p><p>Result：语义分块比固定长度分块的检索准确率提升 12%。结构化分块在技术文档场景下准确率提升 18%。分块参数经过 3 轮调优后趋于稳定。</p><p>你也可以补充：本站题库「4. 向量数据库怎么选？Milvus、FAISS、Qdrant 各自适合什么场景？」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q2</span><span class="guide-q-text">ReAct 的 Prompt 是怎么设计的？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：ReAct 模式的效果严重依赖 Prompt 设计质量。需要让 LLM 严格遵循 Thought →Action → Observation 的循环模式，同时保持灵活性。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：设计一套高效且鲁棒的 ReAct Prompt 模板。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. Prompt 结构设计：</strong></p>
<p>[System Prompt]你是一个企业级 助手。请严格按照以下格式回答问题：AIThought: 分析用户问题，决定下一步行动</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：选择要调用的工具Action Input: 工具的输入参数（JSON格式）Observation: 工具返回的结果... （可以重复多次 Thought/Action/Observation）Thought: 综合所有信息，给出最终答案Final Answer: 最终回答可用工具：搜索知识库 - 参数: {"query": "搜索内容"}</p>
<p class="guide-a-step"><strong>1. search_knowledge:</strong></p>
<p class="guide-a-step"><strong>2. query_database:查询数据库 - 参数: {"sql": "SQL语句"}</strong></p>
<p>...重要规则：- 每次只调用一个工具- 如果不需要工具，直接给出 Final Answer- 最多进行5轮工具调用</p>
<p class="guide-a-step"><strong>2. 关键设计原则：</strong></p>
<p>格式约束严格： 使用明确的关键词（Thought/Action/Observation/Final Answer）做解析锚点。工具描述精确： 每个工具的描述包含"什么时候用"和"参数格式"，减少错用。安全兜底： 设置最大迭代次数，防止无限循环。Few-shot 示例： 在 System Prompt 中提供 2-3 个高质量示例，覆盖单步和多步场景。</p>
<p class="guide-a-step"><strong>3. Prompt 版本管理：</strong></p>
<p>所有 Prompt 模板版本化管理（Git），每次修改有 changelog。A/B 测试不同版本的 Prompt，基于评估指标选择最优版本。</p>
<p class="guide-a-step"><strong>4. 常见问题处理：</strong></p>
<p>LLM 有时会跳过 Thought 直接给 Action → 在解析时检查并补充默认 Thought。LLM 有时输出格式不标准 → 正则解析 + LLM 重新格式化兜底。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：Prompt 遵循率从初始版本的 78% 提升到优化后的 96%。工具选择准确率 95%。经过 5 个版本迭代，形成了稳定的 Prompt 模板。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation： ReAct 模式的效果严重依赖 Prompt 设计质量。需… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：设计一套高效且鲁棒的 ReAct Prompt 模板 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. Prompt 结构设计： [System Prompt] 你是一个企业级助… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 1. search_knowledge: ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 2. query_database:查询数据库 - 参数: {"sql": "S… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像侦探办案：先推理（Thought），再行动查线索（Action），看结果（Observation），循环直到破案。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 把 ReAct 说成「想一步做一步」但说不清 Observation 从哪来、何时停止。</p><p>3. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>4. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「System Prompt 设计的核心原则」（/custom/ai100-prompt/059-system-prompt-principles） — 要点：System Prompt 是 LLM 应用的"宪法"——定义模型的身份、行为边界和输出规范，是模型看到用户输入之前的指令框架。核心设计原则包括：(1) **角色定义**——明确模型是谁、擅长什么、不…</p><p>· 「Prompt Chaining：多步骤 Prompt 的设计与编排」（/custom/ai100-prompt/063-prompt-chaining） — 要点：Prompt Chaining（提示链）是将复杂任务分解为多个顺序执行的 LLM 调用，每个调用的输出作为下一个调用的输入。它是 Agentic AI 中最基础的设计模式，也被称为 Pipeline …</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 架构：步数上限、停止条件、死循环检测、Plan+ReAct 混合、画拓扑图。</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：System Prompt 设计的核心原则、Prompt Chaining：多步骤 Prompt 的设计与编排。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：说清要优化的目标指标</p><p>Action：我重点做了三件事——Situation： ReAct 模式的效果严重依赖 Prompt 设计质量。需要让 LLM 严格遵循 Thought → Action → Observation 的循环模式，同时保持灵活性；Task：设计一套高效且鲁棒的 ReAct Prompt 模板；Action： ##</p><p>Result：Prompt 遵循率从初始版本的 78% 提升到优化后的 96%。工具选择准确率 95%。经过 5 个版本迭代，形成了稳定的 Prompt 模板。</p><p>你也可以补充：本站题库「System Prompt 设计的核心原则」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q3</span><span class="guide-q-text">熔断器是怎么实现的？三个状态是什么？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：LLM API 和外部服务经常出现间歇性故障，如果持续重试会浪费资源并增加延迟。需要一个熔断机制来快速失败和自动恢复。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：实现 Circuit Breaker 模式，保护系统在下游服务异常时的稳定性。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 三个核心状态：</strong></p>
<p>CLOSED（闭合/正常）： 请求正常通过，记录失败率。OPEN（断开/熔断）： 所有请求直接失败（返回降级响应），不再调用下游。HALF_OPEN（半开/探测）： 允许少量探测请求通过，检测下游是否恢复。</p>
<p class="guide-a-step"><strong>2. 状态转换规则：</strong></p>
<p>CLOSED → OPEN：最近 内失败率超过 50%（至少 10 次请求）60sOPEN → HALF_OPEN：熔断 后自动进入半开状态30s：连续 次探测成功 → 恢复正常HALF_OPEN → CLOSED      3HALF_OPEN → OPEN：任何一次探测失败 → 重新熔断</p>
<p class="guide-a-step"><strong>3. 实现细节：</strong></p>
</div></div>
</div>

```python
   class CircuitBreaker:
       def __init__(self, failure_threshold=0.5, recovery_timeout=30,
                    min_requests=10, probe_success_threshold=3):
           self.state = State.CLOSED
           self.failure_count = 0
           self.success_count = 0
           self.last_failure_time = None

           self.probe_success_count = 0
           self._window = deque(maxlen=100)     #   滑动窗口
       async def call(self, func, *args, **kwargs):
           if self.state == State.OPEN:
               if time.time() - self.last_failure_time >
   self.recovery_timeout:
                   self.state = State.HALF_OPEN
                  else:
                      raise CircuitOpenError("Circuit is open")

           try:
                  result = await func(*args, **kwargs)
               self._on_success()
               return result
           except Exception as e:
               self._on_failure()
               raise

```

#### 4. 降级策略：

     熔断时返回缓存的结果（如果有）。
     切换到备用服务（如主模型熔断后切换到备用模型）。
     返回兜底话术（"系统繁忙，请稍后重试"）。
Result：
   下游服务故障时，系统响应时间从 30s（超时等待）降低到 100ms（快速失败）。
   自动恢复机制确保下游恢复后 30s 内自动恢复正常。
   级联故障发生率降低 90%。

<div class="guide-qa">
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】定义题考你能不能「用类比 + 结构」讲清楚，而不是堆术语。面试官想确认你真的理解，而不是背过。</p><p>【拆开理解】</p><p>1. Situation： LLM API 和外部服务经常出现间歇性故障，如果持续重试… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：实现 Circuit Breaker 模式，保护系统在下游服务异常时的… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 三个核心状态： CLOSED（闭合/正常）：请求正常通过，记录失败率 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. OPEN（断开/熔断）：所有请求直接失败（返回降级响应），不再调用下游 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. HALF_OPEN（半开/探测）：允许少量探测请求通过，检测下游是否恢复 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】可以把 Agent 想成「会自己查资料、记笔记、调系统的数字员工」，比普通 ChatBot 多了闭环和多步决策。</p><p>【常见误区】</p><p>1. 只背一句定义，没有说「和普通 LLM 单次调用差在哪」。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「LLM-as-Judge：使用 LLM 评估 LLM 输出」（/custom/ai100-evaluation/071-llm-as-judge） — 要点：LLM-as-Judge 是用一个强大的 LLM（如 GPT-4）自动评估另一个 LLM 输出质量的技术，在成本和质量之间取得了最佳平衡。两种核心模式：**Pointwise 评分**（对单个输出按维…</p><p>· 「LangGraph 里的状态 State 怎么设计？」（/custom/langgraph-state/013-state-design） — 要点：我先说结论，再展开原因。 State 通常用 TypedDict 或 Pydantic 定义，是图内所有节点的输入输出契约。每个字段可绑定 reducer 声明合并语义。节点只返回 partial u…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：LLM-as-Judge：使用 LLM 评估 LLM 输出、LangGraph 里的状态 State 怎么设计？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：LLM API 和外部服务经常出现间歇性故障，如果持续重试会浪费资源并增加延迟。需要一个熔断机制来快速失败和自动恢复。</p><p>Task：说清要优化的目标指标</p><p>Action：我重点做了三件事——Situation： LLM API 和外部服务经常出现间歇性故障，如果持续重试会浪费资源并增加延迟。需要一个熔断机制来快速失败和自动恢复；Task：实现 Circuit Breaker 模式，保护系统在下游服务异常时的稳定性；Action： ##</p><p>Result：下游服务故障时，系统响应时间从 30s（超时等待）降低到 100ms（快速失败）。自动恢复机制确保下游恢复后 30s 内自动恢复正常。级联故障发生率降低 90%。</p><p>你也可以补充：本站题库「LLM-as-Judge：使用 LLM 评估 LLM 输出」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q4</span><span class="guide-q-text">记忆系统的短期和长期记忆是怎么配合的？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：Agent 需要在单次对话中维护上下文（短期记忆），同时在跨会话中记住用户偏好和历史交互（长期记忆）。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：设计分层记忆系统，实现短期和长期记忆的协同工作。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 短期记忆（Working Memory）：</strong></p>
<p>存储位置：内存（进程内 + Redis 备份）。内容：当前会话的对话历史、中间推理结果、工具调用结果。管理策略：滑动窗口：保留最近 10 轮完整对话。超出窗口的对话自动摘要压缩。会话结束后 30 分钟过期清理。</p>
<p class="guide-a-step"><strong>2. 长期记忆（Long-term Memory）：</strong></p>
<p>存储位置：PostgreSQL（结构化信息）+ Milvus（语义检索）。内容：用户画像： 偏好、常用术语、业务领域。历史摘要： 过往会话的关键信息摘要。FAQ 记忆： 用户高频问的问题和答案对。更新策略：会话结束时，提取关键信息更新用户画像。每日批量处理，对历史对话做摘要归档。</p>
<p class="guide-a-step"><strong>3. 短期 → 长期记忆的转化：</strong></p>
<p>会话结束时，LLM 自动提取本次对话的关键信息：用户提到的新偏好。解决的问题和方案。未解决的问题。提取结果写入长期记忆。</p>
<p class="guide-a-step"><strong>4. 长期 → 短期记忆的召回：</strong></p>
<p>新会话开始时，根据用户 ID 加载用户画像。根据当前话题，从长期记忆中检索相关历史信息。将召回的信息注入到当前会话的 context 中。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：跨会话上下文一致性从 30% 提升到 78%。用户偏好记忆准确率 85%（基于 200 个测试 case）。长期记忆占用控制在每用户 50MB 以内。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation： Agent 需要在单次对话中维护上下文（短期记忆），同时在… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：设计分层记忆系统，实现短期和长期记忆的协同工作 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 短期记忆（Working Memory）：存储位置：内存（进程内 + Re… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 长期记忆（Long-term Memory）：存储位置：PostgreSQ… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. FAQ 记忆：用户高频问的问题和答案对。更新策略：会话结束时，提取关键信息更新用… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>3. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>4. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Agent 记忆的类型：短期记忆、长期记忆、工作记忆」（/custom/ai100-memory/040-memory-types） — 要点：LLM Agent 的记忆系统借鉴认知科学，分为三种核心类型：**短期记忆（Short-Term Memory）**——当前会话的对话历史，存在于 LLM 的上下文窗口中，会话结束即丢失；**长期记忆…</p><p>· 「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」（/custom/xiaolin-agent/patterns） — 要点：我理解 Agent 和 Workflow 最核心的区别是「谁来决定下一步」…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 记忆：事实 vs 推断分开存、写入时机、冲突合并、跨会话权限。</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：Agent 记忆的类型：短期记忆、长期记忆、工作记忆、了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：设计分层记忆系统，实现短期和长期记忆的协同工作。</p><p>Action：我重点做了三件事——Situation： Agent 需要在单次对话中维护上下文（短期记忆），同时在跨会话中记住用户偏好和历史交互（长期记忆）；Task：设计分层记忆系统，实现短期和长期记忆的协同工作；Action： ##</p><p>Result：跨会话上下文一致性从 30% 提升到 78%。用户偏好记忆准确率 85%（基于 200 个测试 case）。长期记忆占用控制在每用户 50MB 以内。</p><p>你也可以补充：本站题库「Agent 记忆的类型：短期记忆、长期记忆、工作记忆」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q5</span><span class="guide-q-text">文档解析支持哪些格式？怎么处理表格和图片？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：企业知识库中的文档格式多样，包括 PDF、Word、Excel、PPT、HTML、Markdown 等，且包含大量表格和图片。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：建立一套全格式文档解析管道，确保各类内容都能被有效提取和索引。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 支持的文档格式和解析工具：</strong></p>
<p>| 格式 | 解析工具 | 特殊处理 || --- | --- | --- || PDF | PyMuPDF + pdfplumber | 版面分析区分正文/表格/图片 |Word       python-docx             保留标题层级结构Excel      openpyxl                每个 sheet 独立处理| PPT | python-pptx | 幻灯片逐页提取文本 || --- | --- | --- || HTML | BeautifulSoup | 清洗标签，保留结构 |Markdown   markdown-it             保留标题层级</p>
<p class="guide-a-step"><strong>2. 表格处理策略：</strong></p>
<p>简单表格（&amp;lt; 10行10列）： 转为 Markdown 表格格式，整表作为一个 chunk。复杂表格（大型数据表）： 转为结构化描述文本（"表格共 X 行 Y 列，列名分别是..."），并生成自然语言摘要。合并单元格： 通过 pdfplumber 的表格检测算法处理单元格合并情况。表格上下文： 每个表格 chunk 附加所在章节的标题和前后段落，增强语义理解。</p>
<p class="guide-a-step"><strong>3. 图片处理策略：</strong></p>
<p>OCR 提取： 使用 PaddleOCR 提取图片中的文字。图片描述： 对非文字图片（流程图、架构图等），使用多模态模型（GPT-4V）生成图片描述。图片索引： 图片描述文本作为 chunk 索引到向量库，同时保存图片 URL 用于溯源展示。</p>
<p class="guide-a-step"><strong>4. 解析质量保证：</strong></p>
<p>建立解析质量评估集（100 份文档的标准解析结果）。每次更新解析逻辑后，自动跑评估集对比。人工抽检：每周随机抽查 20 份文档的解析结果。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：支持 6 种主流文档格式，覆盖 98% 的企业文档。表格信息提取准确率 91%（基于 500 个表格的评估）。图片 OCR 识别准确率 94%。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation：企业知识库中的文档格式多样，包括 PDF、Word、Exce… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：建立一套全格式文档解析管道，确保各类内容都能被有效提取和索引 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 支持的文档格式和解析工具：格式解析工具特殊处理 PDF PyMuPDF +… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 表格处理策略：简单表格（&amp;lt → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 10行10列）：转为 Markdown 表格格式，整表作为一个 chunk。复杂… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>3. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「LLM-as-Judge：使用 LLM 评估 LLM 输出」（/custom/ai100-evaluation/071-llm-as-judge） — 要点：LLM-as-Judge 是用一个强大的 LLM（如 GPT-4）自动评估另一个 LLM 输出质量的技术，在成本和质量之间取得了最佳平衡。两种核心模式：**Pointwise 评分**（对单个输出按维…</p><p>· 「任务分解（Task Decomposition）的基本方法」（/custom/ai100-planning/050-task-decomposition） — 要点：任务分解是将复杂目标拆分为更小、可执行的子任务的过程，是 Agent 规划能力的基础。主要方法包括：**LLM 驱动分解**（用 Prompt 让 LLM 自行拆分任务，最灵活但可能不稳定）、**程序…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 记忆：事实 vs 推断分开存、写入时机、冲突合并、跨会话权限。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：LLM-as-Judge：使用 LLM 评估 LLM 输出、任务分解（Task Decomposition）的基本方法。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：建立一套全格式文档解析管道，确保各类内容都能被有效提取和索引。</p><p>Action：我重点做了三件事——Situation：企业知识库中的文档格式多样，包括 PDF、Word、Excel、PPT、HTML、 Markdown 等，且包含大量表格和图片；Task：建立一套全格式文档解析管道，确保各类内容都能被有效提取和索引；Action： ##</p><p>Result：支持 6 种主流文档格式，覆盖 98% 的企业文档。表格信息提取准确率 91%（基于 500 个表格的评估）。图片 OCR 识别准确率 94%。</p><p>你也可以补充：本站题库「LLM-as-Judge：使用 LLM 评估 LLM 输出」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q6</span><span class="guide-q-text">重排序是怎么做的？用的什么模型？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：多路检索后得到大量候选 chunk（通常 30-60 个），需要精排后选出最相关的 top-5给 LLM 生成答案。粗排的向量相似度和 BM25 分数不够精确。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：实现高质量的重排序（Reranking）模块，提升最终检索精度。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. Reranker 模型选择：</strong></p>
<p>对比了三个主流 reranker：BGE-Reranker-v2-M3（最终选择）： 支持中英文，精度高，模型大小适中（568MB）。Cohere Rerank： 效果好但需要调 API，增加延迟和成本。Cross-encoder/ms-marco-MiniLM-L-12-v2： 英文效果好，中文不行。</p>
<p class="guide-a-step"><strong>2. 重排序流程：</strong></p>
<p>多路检索结果（~40条）→ 去重 → Reranker 打分 → 按分数排序 → 取 Top-5Reranker 输入： (query, chunk) pair，输出相关性分数 [0, 1]。去重策略：基于 chunk 内容的 MinHash 去重（相似度 &gt; 0.9 视为重复）。</p>
<p class="guide-a-step"><strong>3. 性能优化：</strong></p>
<p>Reranker 模型部署在 GPU 服务器上（T4 显卡），batch 推理。40 条候选的 rerank 耗时约 120ms（batch_size=40, GPU）。对于实时性要求极高的场景，可跳过 rerank 直接取 top-5。</p>
<p class="guide-a-step"><strong>4. 分数阈值策略：</strong></p>
<p>rerank_score ≥ 0.7 → 高相关，直接使用。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation：多路检索后得到大量候选 chunk（通常 30-60 个），… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：实现高质量的重排序（Reranking）模块，提升最终检索精度 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. Reranker 模型选择：对比了三个主流 reranker： BGE-R… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. Cohere Rerank：效果好但需要调 API，增加延迟和成本 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. Cross-encoder/ms-marco-MiniLM-L-12-v2：英文… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Re-ranking 的原理与实现：Cross-Encoder vs Bi-Enco…」（/custom/ai100-rag/017-reranking-strategies） — 要点：Bi-Encoder 将查询和文档独立编码为向量，速度快但精度有限，用于第一阶段的大规模检索（Retrieval）。Cross-Encoder 将查询和文档拼接后联合编码，精度高但速度慢，用于第二阶段…</p><p>· 「LLM-as-Judge：使用 LLM 评估 LLM 输出」（/custom/ai100-evaluation/071-llm-as-judge） — 要点：LLM-as-Judge 是用一个强大的 LLM（如 GPT-4）自动评估另一个 LLM 输出质量的技术，在成本和质量之间取得了最佳平衡。两种核心模式：**Pointwise 评分**（对单个输出按维…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：Re-ranking 的原理与实现：Cross-Encoder vs Bi-Enco…、LLM-as-Judge：使用 LLM 评估 LLM 输出。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：说清要优化的目标指标</p><p>Action：我重点做了三件事——Situation：多路检索后得到大量候选 chunk（通常 30-60 个），需要精排后选出最相关的 top-5 给 LLM 生成答案。粗排的向量相似度和 BM25 分数不够精确；Task：实现高质量的重排序（Reranking）模块，提升最终检索精度；Action： ##</p><p>Result：给量化结果，如延迟降 X%、准确率升 Y%</p><p>你也可以补充：本站题库「Re-ranking 的原理与实现：Cross-Encoder vs Bi-Enco…」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

### 0.4 ≤ rerank_score < 0.7 → 中等相关，作为补充信息。

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>读「≤ rerank_score &lt; 0.7 → 中等相关，作为补充信息。」时抓住一个关键词，联想你的项目或「假如做企业客服 Agent」场景。</p><p>想不出项目经历很正常——用假设场景把流程串起来，同样能答得漂亮。</p></div>

     rerank_score &lt; 0.4 → 低相关，丢弃。
     如果所有 chunk 分数 &lt; 0.4 → 触发"知识库中没有找到相关信息"的回复。
Result：
   重排序后 Precision@5 从 78% 提升到 92%。
   NDCG@5 从 0.72 提升到 0.89。
   Rerank 延迟 120ms，在整体 3s 响应时间中占比可接受。

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q7</span><span class="guide-q-text">Function Calling 和 MCP 有什么区别？你怎么选的？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：系统需要让 Agent 调用外部工具。Function Calling（OpenAI 原生支持）和 MCP（Anthropic 提出的开放协议）是两种主流方案。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：理解两者的差异，选择适合项目的方案或混合使用。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. Function Calling 特点：</strong></p>
<p>定义在模型侧： 工具定义作为 API 请求的一部分发送给模型。模型原生支持： GPT-4、Claude 等都内置支持，工具选择由模型完成。简单直接： 适合快速接入少量工具。耦合模型： 不同模型的 Function Calling 格式有差异。</p>
<p class="guide-a-step"><strong>2. MCP 特点：</strong></p>
<p>独立于模型： 工具通过 MCP Server 独立运行，通过标准协议通信。生态复用： 一个 MCP Server 可以被任何 MCP Client 使用。双向通信： 支持服务端推送通知和进度更新。资源抽象： 除了工具（tools），还有资源（resources）和提示（prompts）原语。权限控制： 协议层面支持能力协商和权限控制。</p>
<p class="guide-a-step"><strong>3. 对比表：</strong></p>
<p>| 维度 | Function Calling | MCP || --- | --- | --- || 标准化 | 各模型厂商私有 | 开放协议 || 复用性 | 需要适配不同模型 | 跨模型复用 || 部署模式 | 集成在应用内 | 独立服务 || 适用场景 | 简单集成 | 复杂工具生态 || 生态成熟度 | 成熟 | 快速发展中 |</p>
<p class="guide-a-step"><strong>4. 项目选择 —— 混合方案：</strong></p>
<p>内部简单工具（如数据库查询、文本处理）： 使用 Function Calling，因为实现简单，无需额外部署。外部复杂服务（如第三方 API、需要独立运行的工具）： 封装为 MCP Server。底层统一： 在编排器层面做了统一抽象，业务代码不感知具体是 FC 还是 MCP。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：Function Calling 覆盖了 70% 的工具调用场景（简单高效）。MCP 覆盖了 30% 的复杂工具场景（标准化、可复用）。统一抽象层使得切换方案对业务代码零影响。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】对比题考「边界感」：什么场景用 A、什么场景用 B、能不能混合。背差异表不够，要说控制流在谁手里。</p><p>【拆开理解】</p><p>1. Situation：系统需要让 Agent 调用外部工具。Function Ca… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：理解两者的差异，选择适合项目的方案或混合使用 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. Function Calling 特点：定义在模型侧：工具定义作为 API… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. MCP 特点：独立于模型：工具通过 MCP Server 独立运行，通过标… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 3. 对比表：维度 Function Calling MCP 标准化各模型厂商私… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像给员工配电脑和系统账号：没有工具只能动嘴，有了工具才能查库存、下单、跑代码。</p><p>【常见误区】</p><p>1. 只说 A 好 B 不好，没有说混合方案或选型条件。</p><p>2. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>3. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「MCP 和 Function Calling 有什么区别？有没有实际跑过 MCP…」（/custom/xiaolin-tools/mcp_vs_fc） — 要点：我理解这两者不是竞争关系，解决的不是同一层面的问题…</p><p>· 「Function Calling 工具设计最佳实践」（/custom/today-interview/function-calling-design） — 要点：每个工具只做一件事、参数少而精、description 包含正例和反例、error 返回结构化而非纯文本——定义好，模型才可能调对。…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：MCP 和 Function Calling 有什么区别？有没有实际跑过 MCP…、Function Calling 工具设计最佳实践。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：理解两者的差异，选择适合项目的方案或混合使用。</p><p>Action：我重点做了三件事——Situation：系统需要让 Agent 调用外部工具。Function Calling（OpenAI 原生支持）和 MCP （Anthropic 提出的开放协议）是两种主流方案；Task：理解两者的差异，选择适合项目的方案或混合使用；Action： ##</p><p>Result：Function Calling 覆盖了 70% 的工具调用场景（简单高效）。 MCP 覆盖了 30% 的复杂工具场景（标准化、可复用）。统一抽象层使得切换方案对业务代码零影响。</p><p>你也可以补充：本站题库「MCP 和 Function Calling 有什么区别？有没有实际跑过 MCP…」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q8</span><span class="guide-q-text">会话摘要压缩的阈值是多少？怎么确定的？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：长对话会导致 context window 超限，需要对历史对话做摘要压缩。但压缩太早会丢失信息，压缩太晚会超出 token 限制。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：确定最优的摘要压缩阈值和策略。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 阈值设定：</strong></p>
<p>触发阈值： 当对话历史占用超过 context window 的 40% 时触发压缩。以 8K context 为例：对话历史超过 3200 tokens 时开始压缩。保留窗口： 最近 3 轮对话始终保留原文，不压缩。</p>
<p class="guide-a-step"><strong>2. 阈值确定过程：</strong></p>
<p>实验了三个阈值：30%、40%、50%。30%：压缩太频繁，信息损失明显，回答质量下降 8%。40%：平衡点，信息保留度和 token 效率最优。50%：在长对话（&gt;15 轮）时 context 容易超限。</p>
<p class="guide-a-step"><strong>3. 摘要策略：</strong></p>
<p>请将以下对话历史压缩为简洁的摘要，保留以下关键信息：Prompt:</p>
<p class="guide-a-step"><strong>1. 用户的核心诉求</strong></p>
<p class="guide-a-step"><strong>2. 已确认的关键信息（如订单号、用户名等）</strong></p>
<p class="guide-a-step"><strong>3. 已完成的操作和结果</strong></p>
<p class="guide-a-step"><strong>4. 待解决的问题</strong></p>
<p>对话历史：{history}摘要后通常可以将 3000 tokens 的对话压缩到 500-800 tokens。压缩比约 4:1 到 6:1。</p>
<p class="guide-a-step"><strong>4. 增量摘要（渐进式压缩）：</strong></p>
<p>不是一次性压缩所有历史，而是每次只压缩最旧的 3-5 轮。新的摘要与旧的摘要合并，形成递进式摘要。避免单次压缩大量内容导致的信息损失。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：40% 阈值下，支持最长 50 轮对话不丢失关键上下文。摘要后的对话理解准确率为 91%（对比完整历史的 96%）。Token 节省约 60%（长对话场景）。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation：长对话会导致 context window 超限，需要对历史… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：确定最优的摘要压缩阈值和策略 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 阈值设定：触发阈值：当对话历史占用超过 context window 的 … → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 阈值确定过程：实验了三个阈值：30%、40%、50% → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 30%：压缩太频繁，信息损失明显，回答质量下降 8% → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像员工的笔记本 + 公司 Wiki：笔记本记当前任务，Wiki 记长期规则和客户档案。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Prompt Chaining：多步骤 Prompt 的设计与编排」（/custom/ai100-prompt/063-prompt-chaining） — 要点：Prompt Chaining（提示链）是将复杂任务分解为多个顺序执行的 LLM 调用，每个调用的输出作为下一个调用的输入。它是 Agentic AI 中最基础的设计模式，也被称为 Pipeline …</p><p>· 「跨模型 Prompt 迁移：如何编写模型无关的 Prompt？」（/custom/ai100-prompt/068-cross-model-prompt-portability） — 要点：跨模型 Prompt 迁移（Cross-Model Prompt Portability）是指让同一个 Prompt 在不同 LLM（GPT-4、Claude、Gemini、Llama 等）上都能有效…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 记忆：事实 vs 推断分开存、写入时机、冲突合并、跨会话权限。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：Prompt Chaining：多步骤 Prompt 的设计与编排、跨模型 Prompt 迁移：如何编写模型无关的 Prompt？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：确定最优的摘要压缩阈值和策略。</p><p>Action：我重点做了三件事——Situation：长对话会导致 context window 超限，需要对历史对话做摘要压缩。但压缩太早会丢失信息，压缩太晚会超出 token 限制；Task：确定最优的摘要压缩阈值和策略；Action： ##</p><p>Result：40% 阈值下，支持最长 50 轮对话不丢失关键上下文。摘要后的对话理解准确率为 91%（对比完整历史的 96%）。 Token 节省约 60%（长对话场景）。</p><p>你也可以补充：本站题库「Prompt Chaining：多步骤 Prompt 的设计与编排」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q9</span><span class="guide-q-text">RRF 融合排序的公式是什么？权重怎么调？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：多路检索（向量 + 关键词 + 知识图谱）各自返回排序结果，需要融合成统一的排序。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：实现一个公平、有效的多路结果融合算法。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. RRF（Reciprocal Rank Fusion）公式：</strong></p>
<p>RRF_score(d) = Σ(i=1 to n) 1 / (k + rank_i(d))d   ：文档n ：检索通道数量rank_i(d) ：文档 d 在第 i 个通道中的排名（从 1 开始）k ：平滑常数（默认 60）</p>
<p class="guide-a-step"><strong>2. 为什么用 RRF 而不是加权分数融合？</strong></p>
<p>不同检索通道的分数量纲不同（向量用余弦相似度 0-1，BM25 分数范围不固定）。RRF 只看排名，不看绝对分数，天然解决了量纲不一致的问题。理论和实践都证明 RRF 效果优于简单的分数加权。</p>
<p class="guide-a-step"><strong>3. 加权 RRF（Weighted RRF）：</strong></p>
<p>WRRF_score(d) = Σ(i=1 to n) w_i / (k + rank_i(d))不同通道可以设置权重 w_i ，反映不同通道的置信度。默认权重：向量 0.6、关键词 0.3、知识图谱 0.1。</p>
<p class="guide-a-step"><strong>4. 权重调优方法：</strong></p>
<p>建立标注评估集（500 条 query + 标准答案）。使用网格搜索遍历权重组合：向量：[0.4, 0.5, 0.6, 0.7]关键词：[0.2, 0.3, 0.4]知识图谱：[0.05, 0.1, 0.15]以 NDCG@5 为优化目标，找最优权重组合。</p>
<p class="guide-a-step"><strong>5. k 值调优：</strong></p>
<p>k 越大，排名差异的影响越小（倾向于平均化）。k 越小，高排名文档的优势越明显。实验发现 k=60 是较优选择（经典值，Microsoft 论文推荐）。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：加权 RRF 比等权 RRF 的 NDCG@5 提升 3.2%。最优权重组合：向量 0.6、关键词 0.3、知识图谱 0.1。比纯向量检索的 Precision@5 提升 17%。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】定义题考你能不能「用类比 + 结构」讲清楚，而不是堆术语。面试官想确认你真的理解，而不是背过。</p><p>【拆开理解】</p><p>1. Situation：多路检索（向量 + 关键词 + 知识图谱）各自返回排序结果，… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：实现一个公平、有效的多路结果融合算法 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. RRF（Reciprocal Rank Fusion）公式： RRF_sc… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 为什么用 RRF 而不是加权分数融合？不同检索通道的分数量纲不同（向量用余… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. RRF 只看排名，不看绝对分数，天然解决了量纲不一致的问题。理论和实践都证明 R… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只背一句定义，没有说「和普通 LLM 单次调用差在哪」。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「损失函数三部分的权重（1.0, 0.2, 0.15）是怎么来的？」（/custom/thesis-defense-model/q13-损失函数三部分的权重-1-0-0-2-0-15-是怎么来的） — 要点：总Loss = L_fused + 0.2·L_cls + 0.15·L_expert…</p><p>· 「LLM-as-Judge：使用 LLM 评估 LLM 输出」（/custom/ai100-evaluation/071-llm-as-judge） — 要点：LLM-as-Judge 是用一个强大的 LLM（如 GPT-4）自动评估另一个 LLM 输出质量的技术，在成本和质量之间取得了最佳平衡。两种核心模式：**Pointwise 评分**（对单个输出按维…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：损失函数三部分的权重（1.0, 0.2, 0.15）是怎么来的？、LLM-as-Judge：使用 LLM 评估 LLM 输出。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：多路检索（向量 + 关键词 + 知识图谱）各自返回排序结果，需要融合成统一的排序。</p><p>Task：实现一个公平、有效的多路结果融合算法。</p><p>Action：我重点做了三件事——Situation：多路检索（向量 + 关键词 + 知识图谱）各自返回排序结果，需要融合成统一的排序；Task：实现一个公平、有效的多路结果融合算法；Action： ##</p><p>Result：加权 RRF 比等权 RRF 的 NDCG@5 提升 3.2%。最优权重组合：向量 0.6、关键词 0.3、知识图谱 0.1。比纯向量检索的 Precision@5 提升 17%。</p><p>你也可以补充：本站题库「损失函数三部分的权重（1.0, 0.2, 0.15）是怎么来的？」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q10</span><span class="guide-q-text">嵌入模型用的什么？维度多少？怎么选的？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：嵌入模型的选择直接影响向量检索质量。需要在效果、速度、成本之间找到平衡。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：选择最适合中文企业场景的嵌入模型。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 候选模型对比：</strong></p>
<p>| 模型 | 维度 | 中文能力 | MTEB 排名 | 速度 || --- | --- | --- | --- | --- || BGE-M3 | 1024 | 优秀 | 前5 | 中 |text-embedding-3-large   3072         良好     前3        快（API）BGE-large-zh             1024         优秀     前 10      中m3e-large                1024         优秀     前 15      中Cohere embed-v3          1024         良好     前5        快（API）</p>
<p class="guide-a-step"><strong>2. 评估维度：</strong></p>
<p>中文效果： 使用内部评估集（300 条中文 query-doc pair），计算 Recall@10。多语言支持： 部分文档是英文，需要跨语言检索能力。部署成本： 本地部署 vs API 调用的成本对比。维度和存储： 维度越高存储越大，检索越慢。</p>
<p class="guide-a-step"><strong>3. 最终选择 —— BGE-M3：</strong></p>
<p>中文检索 Recall@10 最高（94.3%）。原生支持中英日韩多语言和跨语言检索。支持稠密向量（dense）、稀疏向量（sparse）、多向量（ColBERT）三种表示。1024 维在效果和效率间取得平衡。可以本地部署，无数据出境风险。</p>
<p class="guide-a-step"><strong>4. 部署方案：</strong></p>
<p>使用 ONNX Runtime 加速推理。GPU 部署（T4）：单条 embedding 延迟 15ms，batch 1000 条约 3s。预计算 + 增量更新：新文档入库时实时计算 embedding。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：中文检索 Recall@10 达到 94.3%，比 text-embedding-3-large 高 2.1%。嵌入维度 1024，单条向量占 4KB，800 万文档的索引大小约 32GB。本地部署避免了 API 调用成本和延迟。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation：嵌入模型的选择直接影响向量检索质量。需要在效果、速度、成本之… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：选择最适合中文企业场景的嵌入模型 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 候选模型对比：模型维度中文能力 MTEB 排名速度 BGE-M3 1024… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 评估维度：中文效果：使用内部评估集（300 条中文 query-doc p… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 3. 最终选择—— BGE-M3：中文检索 Recall@10 最高（94.3%… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「LLM-as-Judge：使用 LLM 评估 LLM 输出」（/custom/ai100-evaluation/071-llm-as-judge） — 要点：LLM-as-Judge 是用一个强大的 LLM（如 GPT-4）自动评估另一个 LLM 输出质量的技术，在成本和质量之间取得了最佳平衡。两种核心模式：**Pointwise 评分**（对单个输出按维…</p><p>· 「任务分解（Task Decomposition）的基本方法」（/custom/ai100-planning/050-task-decomposition） — 要点：任务分解是将复杂目标拆分为更小、可执行的子任务的过程，是 Agent 规划能力的基础。主要方法包括：**LLM 驱动分解**（用 Prompt 让 LLM 自行拆分任务，最灵活但可能不稳定）、**程序…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：LLM-as-Judge：使用 LLM 评估 LLM 输出、任务分解（Task Decomposition）的基本方法。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：嵌入模型的选择直接影响向量检索质量。需要在效果、速度、成本之间找到平衡。</p><p>Task：选择最适合中文企业场景的嵌入模型。</p><p>Action：我重点做了三件事——Situation：嵌入模型的选择直接影响向量检索质量。需要在效果、速度、成本之间找到平衡；Task：选择最适合中文企业场景的嵌入模型；Action： ##</p><p>Result：中文检索 Recall@10 达到 94.3%，比 text-embedding-3-large 高 2.1%。嵌入维度 1024，单条向量占 4KB，800 万文档的索引大小约 32GB。本地部署避免了 API 调用成本和延迟。</p><p>你也可以补充：本站题库「LLM-as-Judge：使用 LLM 评估 LLM 输出」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q11</span><span class="guide-q-text">Guardrails（护栏）是怎么实现的？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：Agent 的输出需要多维度的质量和安全把控：格式合规、内容安全、事实准确性、业务合规等。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：实现一套可扩展的 Guardrails 框架，确保 Agent 输出的质量和安全。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. Guardrails 架构（输入侧 + 输出侧）：</strong></p>
<p>用户输入 → [输入 Guardrails] → Agent 处理 → [输出 Guardrails] → 最终响应</p>
<p class="guide-a-step"><strong>2. 输入侧 Guardrails：</strong></p>
<p>Prompt 注入检测： 基于规则 + 分类器检测注入攻击（详见架构类 Q14）。敏感信息检测： 正则匹配身份证号、手机号等 PII。长度限制： 单次输入 ≤ 2000 字符。话题过滤： 拒绝与业务无关的话题（如政治、暴力等）。</p>
<p class="guide-a-step"><strong>3. 输出侧 Guardrails：</strong></p>
<p>格式检查： 检查输出是否符合预期格式（JSON Schema 验证等）。内容安全： 调用内容审核 API 过滤违规内容。事实核查： 检查输出中引用的事实是否与检索到的 chunk 一致。幻觉检测： 对比输出和 context，标记可能的幻觉内容。</p>
<p class="guide-a-step"><strong>4. 可扩展设计：</strong></p>
</div></div>
</div>

```python
   class BaseGuardrail(ABC):
       @abstractmethod
       async def check(self, content: str, context: dict) ->

    GuardrailResult: ...

    class GuardrailPipeline:
        def __init__(self, guardrails: List[BaseGuardrail]):
            self.guardrails = guardrails

        async def run(self, content, context):
            for guardrail in self.guardrails:
                result = await guardrail.check(content, context)
                if not result.passed:
                    return result #   快速失败
            return GuardrailResult(passed=True)

Result：
  Prompt 注入拦截率 97%。
  输出内容安全合规率 99.8%。
  幻觉检测覆盖率 85%（仍有改进空间）。

```

<div class="guide-qa">
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation： Agent 的输出需要多维度的质量和安全把控：格式合规、内… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：实现一套可扩展的 Guardrails 框架，确保 Agent 输出的… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. Guardrails 架构（输入侧 + 输出侧）：用户输入→ [输入 Gu… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 输入侧 Guardrails： Prompt 注入检测：基于规则 + 分类… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 3. 输出侧 Guardrails：格式检查：检查输出是否符合预期格式（JSON… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>3. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>4. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Prompt Chaining：多步骤 Prompt 的设计与编排」（/custom/ai100-prompt/063-prompt-chaining） — 要点：Prompt Chaining（提示链）是将复杂任务分解为多个顺序执行的 LLM 调用，每个调用的输出作为下一个调用的输入。它是 Agentic AI 中最基础的设计模式，也被称为 Pipeline …</p><p>· 「跨模型 Prompt 迁移：如何编写模型无关的 Prompt？」（/custom/ai100-prompt/068-cross-model-prompt-portability） — 要点：跨模型 Prompt 迁移（Cross-Model Prompt Portability）是指让同一个 Prompt 在不同 LLM（GPT-4、Claude、Gemini、Llama 等）上都能有效…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：Prompt Chaining：多步骤 Prompt 的设计与编排、跨模型 Prompt 迁移：如何编写模型无关的 Prompt？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：说清要优化的目标指标</p><p>Action：我重点做了三件事——Situation： Agent 的输出需要多维度的质量和安全把控：格式合规、内容安全、事实准确性、业务合规等；Task：实现一套可扩展的 Guardrails 框架，确保 Agent 输出的质量和安全；Action： ##</p><p>Result：... class GuardrailPipeline: def __init__(self, guardrails: List[BaseGuardrail]): self.guardrails = guardrails async def run(self, content, context):</p><p>你也可以补充：本站题库「Prompt Chaining：多步骤 Prompt 的设计与编排」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q12</span><span class="guide-q-text">怎么实现的 Streaming 流式输出？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：LLM 生成完整回答通常需要 3-10 秒，如果等完全生成后才返回，用户体验很差。需要实现逐 token 的流式输出。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：实现端到端的流式输出管道，从 LLM 到前端的全链路流式传输。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 整体架构：</strong></p>
<p>LLM API (SSE) → Backend (  异步生成器) → API Gateway (SSE/WebSocket) →Frontend (EventSource)</p>
<p class="guide-a-step"><strong>2. 后端实现（Python FastAPI）：</strong></p>
</div></div>
</div>

```python

   @app.post("/chat/stream")
   async def chat_stream(request: ChatRequest):
       async def generate():
           async for chunk in agent.stream_chat(request.messages):
               data = json.dumps({"content": chunk, "type": "token"})
               yield f"data: {data}\n\n"
           yield f"data: {json.dumps({'type': 'done'})}\n\n"

       return StreamingResponse(
           generate(),
           media_type="text/event-stream",
           headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
       )

```

#### 3. 关键技术点：

     禁用缓冲： Nginx 设置 X-Accel-Buffering: no ，防止代理层缓冲 SSE。
     心跳保活： 每 15 秒发送一个心跳事件，防止连接超时。
     错误处理： 流式过程中出错时发送 error 事件，前端展示错误信息。
     取消机制： 用户关闭页面时，后端检测到连接断开，取消 LLM API 调用。
#### 4. ReAct 模式下的流式处理：

     Thought 阶段：不输出给用户（内部推理过程）。
     Action 阶段：输出 "正在查询..." 等状态提示。
     Final Answer 阶段：逐 token 流式输出给用户。
     通过解析 token 流，区分不同阶段。
Result：
   首 token 延迟（TTFT）从非流式的 3s 降低到 500ms。
   用户感知的响应速度提升 5x。
   流式连接稳定性 99.9%（心跳保活 + 自动重连）。

<div class="guide-qa">
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation： LLM 生成完整回答通常需要 3-10 秒，如果等完全生成… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：实现端到端的流式输出管道，从 LLM 到前端的全链路流式传输 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 整体架构： LLM API (SSE) → Backend ( 异步生成器… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 后端实现（Python FastAPI）： ```python @app.… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 3. 关键技术点：禁用缓冲： Nginx 设置 X-Accel-Bufferin… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像侦探办案：先推理（Thought），再行动查线索（Action），看结果（Observation），循环直到破案。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 把 ReAct 说成「想一步做一步」但说不清 Observation 从哪来、何时停止。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「推理策略详解：Chain-of-Thought 与 Tree-of-Thought」（/custom/ai100-planning/049-cot-and-tot） — 要点：Chain-of-Thought (CoT) 和 Tree-of-Thought (ToT) 是两种主流的 LLM 推理策略。**CoT 是线性推理**——通过引导模型"一步步思考"而非直接给出答案，…</p><p>· 「LLM-as-Judge：使用 LLM 评估 LLM 输出」（/custom/ai100-evaluation/071-llm-as-judge） — 要点：LLM-as-Judge 是用一个强大的 LLM（如 GPT-4）自动评估另一个 LLM 输出质量的技术，在成本和质量之间取得了最佳平衡。两种核心模式：**Pointwise 评分**（对单个输出按维…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 架构：步数上限、停止条件、死循环检测、Plan+ReAct 混合、画拓扑图。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：推理策略详解：Chain-of-Thought 与 Tree-of-Thought、LLM-as-Judge：使用 LLM 评估 LLM 输出。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：实现端到端的流式输出管道，从 LLM 到前端的全链路流式传输。</p><p>Action：我重点做了三件事——Situation： LLM 生成完整回答通常需要 3-10 秒，如果等完全生成后才返回，用户体验很差。需要实现逐 token 的流式输出；Task：实现端到端的流式输出管道，从 LLM 到前端的全链路流式传输；Action： ##</p><p>Result：首 token 延迟（TTFT）从非流式的 3s 降低到 500ms。用户感知的响应速度提升 5x。流式连接稳定性 99.9%（心跳保活 + 自动重连）。</p><p>你也可以补充：本站题库「推理策略详解：Chain-of-Thought 与 Tree-of-Thought」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q13</span><span class="guide-q-text">怎么做的日志和链路追踪？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：Agent 系统的执行链路复杂（用户输入 → 意图识别 → 检索 → 工具调用 → 生成），需要完整的可观测性来排查问题。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：建立全链路的日志和追踪系统。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 日志分级体系：</strong></p>
<p>INFO： 请求/响应概要、Agent 状态转换。DEBUG： 详细的中间过程（Prompt 内容、检索结果、工具调用参数）。WARN： 降级事件、重试事件、低置信度回答。ERROR： 异常、超时、工具调用失败。</p>
<p class="guide-a-step"><strong>2. 结构化日志格式：</strong></p>
</div></div>
</div>

```json
   {
       "trace_id": "abc-123",
       "span_id": "span-456",
       "timestamp": "2024-03-15T10:30:00Z",
       "service": "agent-orchestrator",
       "event": "tool_call",
       "tool_name": "search_knowledge",
       "latency_ms": 245,
       "status": "success",
       "metadata": {"query": "...", "result_count": 5}
   }

```

#### 3. 链路追踪（基于 OpenTelemetry）：

    每个请求分配唯一 trace_id 。
    Agent 执行的每个阶段创建独立的 span ：

       trace_id: abc-123

```text
   ├── span: intent_recognition (50ms)
   ├── span: retrieval (250ms)
   │   ├── span: vector_search (120ms)

 │   └── span: keyword_search (100ms)
 ├── span: reranking (130ms)
 ├── span: llm_generation (2500ms)
 └── span: response_formatting (20ms)
```

#### 4. 可视化和告警：

     日志收集：Fluentd → Elasticsearch → Kibana。
     链路追踪可视化：Jaeger。
     告警规则：P99 延迟 > 10s、错误率 > 1%、LLM 幻觉率 > 5% 时触发告警。
Result：
   问题定位时间从平均 2 小时缩短到 15 分钟。
   全链路 trace 覆盖率 100%。
   通过日志分析发现并优化了 3 个性能瓶颈。

<div class="guide-qa">
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation： Agent 系统的执行链路复杂（用户输入→意图识别→检索→… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：建立全链路的日志和追踪系统 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 日志分级体系： INFO：请求/响应概要、Agent 状态转换 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. DEBUG：详细的中间过程（Prompt 内容、检索结果、工具调用参数） → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. WARN：降级事件、重试事件、低置信度回答 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>3. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Prompt Chaining：多步骤 Prompt 的设计与编排」（/custom/ai100-prompt/063-prompt-chaining） — 要点：Prompt Chaining（提示链）是将复杂任务分解为多个顺序执行的 LLM 调用，每个调用的输出作为下一个调用的输入。它是 Agentic AI 中最基础的设计模式，也被称为 Pipeline …</p><p>· 「跨模型 Prompt 迁移：如何编写模型无关的 Prompt？」（/custom/ai100-prompt/068-cross-model-prompt-portability） — 要点：跨模型 Prompt 迁移（Cross-Model Prompt Portability）是指让同一个 Prompt 在不同 LLM（GPT-4、Claude、Gemini、Llama 等）上都能有效…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：Prompt Chaining：多步骤 Prompt 的设计与编排、跨模型 Prompt 迁移：如何编写模型无关的 Prompt？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：建立全链路的日志和追踪系统。</p><p>Action：我重点做了三件事——Situation： Agent 系统的执行链路复杂（用户输入→意图识别→检索→工具调用→生成），需要完整的可观测性来排查问题；Task：建立全链路的日志和追踪系统；Action： ##</p><p>Result：问题定位时间从平均 2 小时缩短到 15 分钟。全链路 trace 覆盖率 100%。通过日志分析发现并优化了 3 个性能瓶颈。</p><p>你也可以补充：本站题库「Prompt Chaining：多步骤 Prompt 的设计与编排」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q14</span><span class="guide-q-text">怎么做的异步并行处理？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：Agent 执行过程中有很多 I/O 密集型操作（LLM API 调用、数据库查询、外部 API调用），同步执行会导致大量等待时间。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：识别可并行化的操作，用异步编程提升系统吞吐量。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 异步框架选择：</strong></p>
<p>基于 Python asyncio + FastAPI。所有 I/O 操作使用 async/await。使用 httpx.AsyncClient 替代 requests 做 HTTP 调用。</p>
<p class="guide-a-step"><strong>2. 并行化场景：</strong></p>
<p>多路检索并行： 向量检索、关键词检索、知识图谱查询同时发起。</p>
</div></div>
</div>

```python

    results = await asyncio.gather(
        vector_search(query),
        keyword_search(query),
        kg_search(query)
    )

     多工具并行调用： 当 Agent 需要调用多个独立工具时，并行执行。
     批量 embedding 计算： 文档入库时批量并行计算 embedding。
3. 并发控制：
     使用 asyncio.Semaphore 控制最大并发数。
     LLM API 调用并发限制为 50（受 API 限流限制）。
     数据库连接池大小 20（避免打爆数据库）。
4. 异步队列处理：
     非实时任务（如文档索引、日志分析）通过 Celery 异步任务队列处理。
     避免阻塞实时请求的处理。
Result：
   多路检索并行后，检索总延迟从 500ms（串行）降低到 200ms（并行）。
   系统整体 QPS 提升 2.5 倍。
   文档批量入库速度提升 4 倍。

```

<div class="guide-qa">
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation： Agent 执行过程中有很多 I/O 密集型操作（LLM … → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：识别可并行化的操作，用异步编程提升系统吞吐量 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 异步框架选择：基于 Python asyncio + FastAPI。所有… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 并行化场景：多路检索并行：向量检索、关键词检索、知识图谱查询同时发起 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. ```python results = await asyncio.gather… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>3. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」（/custom/xiaolin-agent/patterns） — 要点：我理解 Agent 和 Workflow 最核心的区别是「谁来决定下一步」…</p><p>· 「说说 Single-Agent 和 Multi-Agent 的设计方案？」（/custom/xiaolin-agent/single_multi） — 要点：Single-Agent 适合任务流程清晰、复杂度适中的场景，实现简单、好维护；Multi-Agent 适合需要专业分工、任务量大或者需要并行执行的复杂场景…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…、说说 Single-Agent 和 Multi-Agent 的设计方案？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：识别可并行化的操作，用异步编程提升系统吞吐量。</p><p>Action：我重点做了三件事——Situation： Agent 执行过程中有很多 I/O 密集型操作（LLM API 调用、数据库查询、外部 API 调用），同步执行会导致大量等待时间；Task：识别可并行化的操作，用异步编程提升系统吞吐量；Action： ##</p><p>Result：多路检索并行后，检索总延迟从 500ms（串行）降低到 200ms（并行）。系统整体 QPS 提升 2.5 倍。文档批量入库速度提升 4 倍。 ```</p><p>你也可以补充：本站题库「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q15</span><span class="guide-q-text">知识图谱是怎么构建和使用的？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：纯向量检索难以处理实体关系类查询（如"张三负责哪些项目"、"A 产品和 B 产品有什么关联"），需要知识图谱补充。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：构建领域知识图谱，并与向量检索系统协同工作。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 知识图谱构建流程：</strong></p>
<p>实体抽取： 使用 LLM 从文档中抽取实体（人名、产品、部门、项目等）。关系抽取： 使用 LLM 识别实体间关系（负责、属于、依赖等）。Schema 设计：节点类型：Person, Product, Department, Project, Document关系类型：MANAGES, BELONGS_TO, DEPENDS_ON, AUTHORED, RELATED_TO存储： Neo4j 图数据库。</p>
<p class="guide-a-step"><strong>2. 自动化构建管道：</strong></p>
<p>文档 → 分段 → LLM 实体抽取 → LLM 关系抽取 → 去重合并 → 写入 Neo4j使用 Prompt 模板约束输出格式。人工审核：抽取结果的置信度 &amp;lt; 0.8 时进入审核队列。</p>
<p class="guide-a-step"><strong>3. 查询集成：</strong></p>
<p>意图识别模块判断是否需要图谱查询。生成 Cypher 查询语句：cypherMATCH (p:Person)-[:MANAGES]-&gt;(proj:Project)WHERE p.name = '张三 'RETURN proj.name, proj.status图谱查询结果与向量检索结果融合后送入 LLM。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：知识图谱包含 5 万个实体、12 万条关系。实体关系类查询的准确率从纯向量检索的 45% 提升到 87%。知识图谱月均查询量约 2000 次。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation：纯向量检索难以处理实体关系类查询（如"张三负责哪些项目"、"… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：构建领域知识图谱，并与向量检索系统协同工作 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 知识图谱构建流程：实体抽取：使用 LLM 从文档中抽取实体（人名、产品、部… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. Schema 设计：节点类型：Person, Product, Departme… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 2. 自动化构建管道：文档→分段→ LLM 实体抽取→ LLM 关系抽取→去重合… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>3. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Prompt Chaining：多步骤 Prompt 的设计与编排」（/custom/ai100-prompt/063-prompt-chaining） — 要点：Prompt Chaining（提示链）是将复杂任务分解为多个顺序执行的 LLM 调用，每个调用的输出作为下一个调用的输入。它是 Agentic AI 中最基础的设计模式，也被称为 Pipeline …</p><p>· 「跨模型 Prompt 迁移：如何编写模型无关的 Prompt？」（/custom/ai100-prompt/068-cross-model-prompt-portability） — 要点：跨模型 Prompt 迁移（Cross-Model Prompt Portability）是指让同一个 Prompt 在不同 LLM（GPT-4、Claude、Gemini、Llama 等）上都能有效…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：Prompt Chaining：多步骤 Prompt 的设计与编排、跨模型 Prompt 迁移：如何编写模型无关的 Prompt？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：纯向量检索难以处理实体关系类查询（如"张三负责哪些项目"、"A 产品和 B 产品有什么关联"），需要知识图谱补充。</p><p>Task：构建领域知识图谱，并与向量检索系统协同工作。</p><p>Action：我重点做了三件事——Situation：纯向量检索难以处理实体关系类查询（如"张三负责哪些项目"、"A 产品和 B 产品有什么关联"），需要知识图谱补充；Task：构建领域知识图谱，并与向量检索系统协同工作；Action： ##</p><p>Result：知识图谱包含 5 万个实体、12 万条关系。实体关系类查询的准确率从纯向量检索的 45% 提升到 87%。知识图谱月均查询量约 2000 次。</p><p>你也可以补充：本站题库「Prompt Chaining：多步骤 Prompt 的设计与编排」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q16</span><span class="guide-q-text">怎么做的 A/B 测试和 Prompt 版本管理？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：Prompt 的微小改动可能导致输出质量的显著变化，需要科学的方法来管理和评估Prompt 变更。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：建立 Prompt 版本管理和 A/B 测试机制。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 版本管理：</strong></p>
<p>所有 Prompt 模板存储在数据库中（不硬编码）。每个模板有版本号、创建时间、变更说明。支持按百分比灰度发布（如新版本只对 10% 的流量生效）。</p>
<p class="guide-a-step"><strong>2. A/B 测试框架：</strong></p>
<p>请求进来时，根据用户 ID hash 分配实验组。同时记录两个版本的回答和用户反馈。每个实验持续 7 天或累计 1000 次对话后出结论。</p>
<p class="guide-a-step"><strong>3. 评估指标：</strong></p>
<p>自动化指标： 回答相关性（BERTScore）、格式遵循率、工具调用准确率。人工评估： 随机抽取 100 条对话，3 位评估者打分（1-5 分）。业务指标： 用户满意度评分、问题解决率、平均对话轮次。</p>
<p class="guide-a-step"><strong>4. 决策标准：</strong></p>
<p>新版本在所有指标上至少不低于旧版本。核心指标（回答相关性）提升 ≥ 2%，才接受新版本。统计显著性：p-value &amp;lt; 0.05。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：通过 A/B 测试发现了 3 个看似改进实际退步的 Prompt 修改。Prompt 迭代周期从"凭感觉改"变为"数据驱动改"。系统回答质量在 6 个月内稳步提升 18%。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation： Prompt 的微小改动可能导致输出质量的显著变化，需要科… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：建立 Prompt 版本管理和 A/B 测试机制 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 版本管理：所有 Prompt 模板存储在数据库中（不硬编码）。每个模板有版… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. A/B 测试框架：请求进来时，根据用户 ID hash 分配实验组。同时记… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 3. 评估指标：自动化指标：回答相关性（BERTScore）、格式遵循率、工具调… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像给员工配电脑和系统账号：没有工具只能动嘴，有了工具才能查库存、下单、跑代码。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Prompt Chaining：多步骤 Prompt 的设计与编排」（/custom/ai100-prompt/063-prompt-chaining） — 要点：Prompt Chaining（提示链）是将复杂任务分解为多个顺序执行的 LLM 调用，每个调用的输出作为下一个调用的输入。它是 Agentic AI 中最基础的设计模式，也被称为 Pipeline …</p><p>· 「跨模型 Prompt 迁移：如何编写模型无关的 Prompt？」（/custom/ai100-prompt/068-cross-model-prompt-portability） — 要点：跨模型 Prompt 迁移（Cross-Model Prompt Portability）是指让同一个 Prompt 在不同 LLM（GPT-4、Claude、Gemini、Llama 等）上都能有效…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：Prompt Chaining：多步骤 Prompt 的设计与编排、跨模型 Prompt 迁移：如何编写模型无关的 Prompt？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：说清要优化的目标指标</p><p>Action：我重点做了三件事——Situation： Prompt 的微小改动可能导致输出质量的显著变化，需要科学的方法来管理和评估 Prompt 变更；Task：建立 Prompt 版本管理和 A/B 测试机制；Action： ##</p><p>Result：通过 A/B 测试发现了 3 个看似改进实际退步的 Prompt 修改。 Prompt 迭代周期从"凭感觉改"变为"数据驱动改"。系统回答质量在 6 个月内稳步提升 18%。</p><p>你也可以补充：本站题库「Prompt Chaining：多步骤 Prompt 的设计与编排」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q17</span><span class="guide-q-text">Token 计数和费用统计是怎么实现的？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：LLM API 按 token 计费，需要精确统计每次调用的 token 消耗，用于成本控制和计费。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：实现精确的 token 计数和费用统计系统。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. Token 计数方案：</strong></p>
<p>输入 Token： 使用对应模型的 tokenizer 在客户端预计算。OpenAI：使用 tiktoken 库。Claude：使用 Anthropic 的 token counter API。本地模型：使用 HuggingFace tokenizer。输出 Token： 从 API 响应的 usage 字段获取（最准确）。</p>
<p class="guide-a-step"><strong>2. 费用计算：</strong></p>
</div></div>
</div>

```python
   cost = (input_tokens * input_price + output_tokens * output_price) /
   1000
   # GPT-4o: input $2.5/1M, output $10/1M
   # GPT-4o-mini: input $0.15/1M, output $0.6/1M

```

#### 3. 统计维度：

     按租户统计：每个客户的 token 消耗和费用。
     按功能统计：意图识别、RAG 生成、摘要等各模块的消耗。
     按模型统计：不同模型的使用量和费用占比。
     按时间统计：日/周/月的消耗趋势。
#### 4. 预算告警：

     每个租户设置月度 token 预算。
     消耗达到 80% 时提醒，100% 时限制（或降级到小模型）。
Result：

 Token 计数误差控制在 2% 以内。
 月度成本报告自动生成，精确到每个功能模块。
 通过分析发现"会话摘要"模块是 token 消耗大户（占 25%），优化后降低了 40%。

<div class="guide-qa">
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation： LLM API 按 token 计费，需要精确统计每次调用… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：实现精确的 token 计数和费用统计系统 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. Token 计数方案：输入 Token：使用对应模型的 tokenizer… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. OpenAI：使用 tiktoken 库 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. Claude：使用 Anthropic 的 token counter API。… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「OpenAI Assistants API vs Anthropic Claude …」（/custom/ai100-frameworks/099-assistants-api-vs-claude-sdk） — 要点：OpenAI 和 Anthropic 分别推出了官方 Agent 开发方案，代表了两种不同的设计哲学。**OpenAI Agents SDK**（2025-03 发布，**底层基于新的 Respons…</p><p>· 「LLM-as-Judge：使用 LLM 评估 LLM 输出」（/custom/ai100-evaluation/071-llm-as-judge） — 要点：LLM-as-Judge 是用一个强大的 LLM（如 GPT-4）自动评估另一个 LLM 输出质量的技术，在成本和质量之间取得了最佳平衡。两种核心模式：**Pointwise 评分**（对单个输出按维…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 记忆：事实 vs 推断分开存、写入时机、冲突合并、跨会话权限。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：OpenAI Assistants API vs Anthropic Claude …、LLM-as-Judge：使用 LLM 评估 LLM 输出。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：实现精确的 token 计数和费用统计系统。</p><p>Action：我重点做了三件事——Situation： LLM API 按 token 计费，需要精确统计每次调用的 token 消耗，用于成本控制和计费；Task：实现精确的 token 计数和费用统计系统；Action： ##</p><p>Result：Token 计数误差控制在 2% 以内。月度成本报告自动生成，精确到每个功能模块。通过分析发现"会话摘要"模块是 token 消耗大户（占 25%），优化后降低了 40%。</p><p>你也可以补充：本站题库「OpenAI Assistants API vs Anthropic Claude …」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q18</span><span class="guide-q-text">怎么做的数据预处理和数据清洗？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：企业文档质量参差不齐：有 OCR 错误、格式混乱、重复内容、过时信息等。低质量数据直接影响检索和生成质量。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：建立数据预处理管道，确保入库数据的质量。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 数据清洗管道：</strong></p>
<p>原始文档 → 格式转换 → 文本提取 → 清洗 → 去重 → 质量评估 → 分块 → 入库</p>
<p class="guide-a-step"><strong>2. 清洗规则：</strong></p>
<p>去除噪音： 页眉页脚、水印文字、无意义空白。格式标准化： 统一编码（UTF-8）、统一标点（全角/半角）。OCR 纠错： 基于语言模型的拼写纠错（如"己术"→"技术"）。敏感信息脱敏： 手机号、身份证号等自动打码。</p>
<p class="guide-a-step"><strong>3. 去重策略：</strong></p>
<p>完全重复： MD5 hash 去重。近似重复： MinHash + LSH 算法，Jaccard 相似度 &gt; 0.85 视为重复。跨版本去重： 同一文档的不同版本，只保留最新版本。</p>
<p class="guide-a-step"><strong>4. 质量评估打分：</strong></p>
<p>文本长度（太短的 chunk 信息量不足）。语义完整性（句子是否完整）。信息密度（关键词密度、实体密度）。分数低于阈值的 chunk 标记为低质量，不参与检索。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：数据清洗后，检索准确率提升 8%。去重减少了 15% 的存储空间。低质量 chunk 过滤后，LLM 生成的幻觉率降低 12%。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation：企业文档质量参差不齐：有 OCR 错误、格式混乱、重复内容、… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：建立数据预处理管道，确保入库数据的质量 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 数据清洗管道：原始文档→格式转换→文本提取→清洗→去重→质量评估→分块→入… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 清洗规则：去除噪音：页眉页脚、水印文字、无意义空白。格式标准化：统一编码（… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. OCR 纠错：基于语言模型的拼写纠错（如"己术"→"技术"）。敏感信息脱敏：手机… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「LLM-as-Judge：使用 LLM 评估 LLM 输出」（/custom/ai100-evaluation/071-llm-as-judge） — 要点：LLM-as-Judge 是用一个强大的 LLM（如 GPT-4）自动评估另一个 LLM 输出质量的技术，在成本和质量之间取得了最佳平衡。两种核心模式：**Pointwise 评分**（对单个输出按维…</p><p>· 「评估方法论：从 LLM 评估到 Agent 评估」（/custom/ai100-evaluation/069-evaluation-methodology） — 要点：LLM 评估分为三大类：(1) **自动指标评估**——用算法计算的确定性指标（如 BLEU、ROUGE、精确匹配），速度快、成本低，但只能衡量表面特征；(2) **人工评估**——由人类标注者评判输…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：LLM-as-Judge：使用 LLM 评估 LLM 输出、评估方法论：从 LLM 评估到 Agent 评估。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：企业文档质量参差不齐：有 OCR 错误、格式混乱、重复内容、过时信息等。低质量数据直接影响检索和生成质量。</p><p>Task：建立数据预处理管道，确保入库数据的质量。</p><p>Action：我重点做了三件事——Situation：企业文档质量参差不齐：有 OCR 错误、格式混乱、重复内容、过时信息等。低质量数据直接影响检索和生成质量；Task：建立数据预处理管道，确保入库数据的质量；Action： ##</p><p>Result：数据清洗后，检索准确率提升 8%。去重减少了 15% 的存储空间。低质量 chunk 过滤后，LLM 生成的幻觉率降低 12%。</p><p>你也可以补充：本站题库「LLM-as-Judge：使用 LLM 评估 LLM 输出」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

第三类：性能优化类问题

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q1</span><span class="guide-q-text">Token 成本是怎么控制的？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：系统月均 token 消耗超过 5000 万，API 费用是运营成本的主要组成部分。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：在不影响回答质量的前提下，大幅降低 token 成本。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 模型路由优化（最大收益）：</strong></p>
<p>60% 简单查询路由到 GPT-4o-mini（成本仅为 GPT-4o 的 1/17）。只有 15% 复杂查询才用 GPT-4o。成本降低 62%。</p>
<p class="guide-a-step"><strong>2. Prompt 精简：</strong></p>
<p>System Prompt 从 1500 tokens 精简到 800 tokens（去除冗余描述）。工具描述只在需要时动态注入，不是每次都带全部工具。节省 20% 的输入 token。</p>
<p class="guide-a-step"><strong>3. 上下文优化：</strong></p>
<p>检索结果从 top-10 减到 top-5（经过 rerank 后 top-5 已足够）。对话历史及时摘要压缩。减少 30% 的 context token。</p>
<p class="guide-a-step"><strong>4. 缓存策略：</strong></p>
<p>语义缓存：相似问题命中缓存直接返回，跳过 LLM 调用。FAQ 缓存：高频问题预计算答案。缓存命中率约 15%。</p>
<p class="guide-a-step"><strong>5. 输出控制：</strong></p>
<p>设置 max_tokens 限制（一般回答 512，详细回答 1024）。避免 LLM 生成冗长的无用内容。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：月均 token 成本从 5 万降到 1.9 万（降低 62%）。回答质量几乎无损（用户满意度仅下降 1.2%）。建立了 token 预算管理和告警机制。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation：系统月均 token 消耗超过 5000 万，API 费用是… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：在不影响回答质量的前提下，大幅降低 token 成本 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 模型路由优化（最大收益）： 60% 简单查询路由到 GPT-4o-mini… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. Prompt 精简： System Prompt 从 1500 token… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 3. 上下文优化：检索结果从 top-10 减到 top-5（经过 rerank… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>3. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>4. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「System Prompt 设计的核心原则」（/custom/ai100-prompt/059-system-prompt-principles） — 要点：System Prompt 是 LLM 应用的"宪法"——定义模型的身份、行为边界和输出规范，是模型看到用户输入之前的指令框架。核心设计原则包括：(1) **角色定义**——明确模型是谁、擅长什么、不…</p><p>· 「Prompt Chaining：多步骤 Prompt 的设计与编排」（/custom/ai100-prompt/063-prompt-chaining） — 要点：Prompt Chaining（提示链）是将复杂任务分解为多个顺序执行的 LLM 调用，每个调用的输出作为下一个调用的输入。它是 Agentic AI 中最基础的设计模式，也被称为 Pipeline …</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 记忆：事实 vs 推断分开存、写入时机、冲突合并、跨会话权限。</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：System Prompt 设计的核心原则、Prompt Chaining：多步骤 Prompt 的设计与编排。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：在不影响回答质量的前提下，大幅降低 token 成本。</p><p>Action：我重点做了三件事——Situation：系统月均 token 消耗超过 5000 万，API 费用是运营成本的主要组成部分；Task：在不影响回答质量的前提下，大幅降低 token 成本；Action： ##</p><p>Result：月均 token 成本从 5 万降到 1.9 万（降低 62%）。回答质量几乎无损（用户满意度仅下降 1.2%）。建立了 token 预算管理和告警机制。</p><p>你也可以补充：本站题库「System Prompt 设计的核心原则」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q2</span><span class="guide-q-text">延迟优化做了哪些措施？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：系统初期端到端延迟（用户提问到收到回答）平均 6.5 秒，用户体验不佳，目标是降低到 3 秒以内。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：全链路延迟优化，将 P50 延迟降到 3 秒以内。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 链路分析（各环节耗时）：</strong></p>
<p>意图识别：300ms检索（串行）：500ms → 并行后 200msReranking：130msLLM 生成（主要瓶颈）：4500ms → 优化后 2500ms后处理：100ms总计：5530ms → 3130ms</p>
<p class="guide-a-step"><strong>2. 优化措施：</strong></p>
<p>检索并行化： 多路检索从串行改为并行（-300ms）。模型路由： 简单查询走快速模型（延迟 800ms vs 3000ms）。流式输出： TTFT 500ms，用户感知到的等待时间大幅缩短。预加载： 意图识别和检索并行执行（检索不需要等意图确定后再开始，可以先用原始 query检索）。连接池复用： HTTP 长连接、数据库连接池，减少连接建立时间（-50ms）。结果缓存： 语义缓存命中时直接返回（延迟 &amp;lt; 100ms）。</p>
<p class="guide-a-step"><strong>3. LLM 调用优化：</strong></p>
<p>Prompt 精简减少输入 token，LLM 处理时间缩短。使用 max_tokens 限制输出长度。选择低延迟的 API 端点（如 Azure 中国区）。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：P50 延迟从 6.5s 降低到 2.8s。P99 延迟从 15s 降低到 5.2s。流式输出的 TTFT 为 500ms，用户满意度提升 22%。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】这题和 RAG、Engineering、Prompt 都相关，属于 Agent 面试的高频交叉点。</p><p>【拆开理解】</p><p>1. Situation：系统初期端到端延迟（用户提问到收到回答）平均 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. 6.5 秒，用户体验不佳，目标是降低到 3 秒以内 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Task：全链路延迟优化，将 P50 延迟降到 3 秒以内 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 1. 链路分析（各环节耗时）：意图识别：300ms 检索（串行）：500ms →… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 2. 优化措施：检索并行化：多路检索从串行改为并行（-300ms）。模型路由：简… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Prompt Chaining：多步骤 Prompt 的设计与编排」（/custom/ai100-prompt/063-prompt-chaining） — 要点：Prompt Chaining（提示链）是将复杂任务分解为多个顺序执行的 LLM 调用，每个调用的输出作为下一个调用的输入。它是 Agentic AI 中最基础的设计模式，也被称为 Pipeline …</p><p>· 「跨模型 Prompt 迁移：如何编写模型无关的 Prompt？」（/custom/ai100-prompt/068-cross-model-prompt-portability） — 要点：跨模型 Prompt 迁移（Cross-Model Prompt Portability）是指让同一个 Prompt 在不同 LLM（GPT-4、Claude、Gemini、Llama 等）上都能有效…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：Prompt Chaining：多步骤 Prompt 的设计与编排、跨模型 Prompt 迁移：如何编写模型无关的 Prompt？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：系统初期端到端延迟（用户提问到收到回答）平均 6.5 秒，用户体验不佳，目标是降低到 3 秒以内。</p><p>Task：全链路延迟优化，将 P50 延迟降到 3 秒以内。</p><p>Action：我重点做了三件事——Situation：系统初期端到端延迟（用户提问到收到回答）平均；6.5 秒，用户体验不佳，目标是降低到 3 秒以内；Task：全链路延迟优化，将 P50 延迟降到 3 秒以内</p><p>Result：P50 延迟从 6.5s 降低到 2.8s。 P99 延迟从 15s 降低到 5.2s。流式输出的 TTFT 为 500ms，用户满意度提升 22%。</p><p>你也可以补充：本站题库「Prompt Chaining：多步骤 Prompt 的设计与编排」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q3</span><span class="guide-q-text">缓存策略是什么？命中率多少？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：企业客服场景存在大量重复和相似的问题，每次都调用 LLM 浪费资源。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：设计多层缓存策略，提升系统响应速度并降低成本。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 多层缓存架构：</strong></p>
<p>L1 —— 精确匹配缓存（Redis）：Key：query 文本的 MD5 hash。适用场景：完全相同的问题。TTL：24 小时。命中率：约 8%。L2 —— 语义相似缓存（Redis + Milvus）：对 query 计算 embedding，在缓存向量库中检索。相似度 &gt; 0.95 时视为命中，直接返回缓存的回答。TTL：12 小时。命中率：约 7%。L3 —— FAQ 知识缓存（预计算）：对 Top-200 高频问题预计算标准答案。通过意图匹配命中 FAQ。长期有效（手动更新）。命中率：约 5%。</p>
<p class="guide-a-step"><strong>2. 缓存更新策略：</strong></p>
<p>被动失效： TTL 过期自动失效。主动失效： 知识库更新时，清除相关问题的缓存。预热策略： 系统启动时预加载 FAQ 缓存和高频问题缓存。</p>
<p class="guide-a-step"><strong>3. 缓存一致性：</strong></p>
<p>知识库文档更新时，触发缓存清理事件。使用事件总线通知缓存模块刷新。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：总缓存命中率约 20%（L1 8% + L2 7% + L3 5%）。缓存命中时延迟 &amp;lt; 100ms（对比 LLM 调用的 3s）。节省约 20% 的 LLM API 调用成本。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】定义题考你能不能「用类比 + 结构」讲清楚，而不是堆术语。面试官想确认你真的理解，而不是背过。</p><p>【拆开理解】</p><p>1. Situation：企业客服场景存在大量重复和相似的问题，每次都调用 LLM 浪… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：设计多层缓存策略，提升系统响应速度并降低成本 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 多层缓存架构： L1 ——精确匹配缓存（Redis）： Key：query… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. TTL：24 小时。命中率：约 8% → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. L2 ——语义相似缓存（Redis + Milvus）：对 query 计算 e… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只背一句定义，没有说「和普通 LLM 单次调用差在哪」。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「LLM-as-Judge：使用 LLM 评估 LLM 输出」（/custom/ai100-evaluation/071-llm-as-judge） — 要点：LLM-as-Judge 是用一个强大的 LLM（如 GPT-4）自动评估另一个 LLM 输出质量的技术，在成本和质量之间取得了最佳平衡。两种核心模式：**Pointwise 评分**（对单个输出按维…</p><p>· 「LLM 应用的成本控制与优化」（/custom/today-interview/cost-optimization） — 要点：模型阶梯路由（小模型先上、搞不定再大模型）、语义缓存防止重复调、prompt 和 context 精简、批处理异步化——四管齐下能把成本压 40%-60%。…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：LLM-as-Judge：使用 LLM 评估 LLM 输出、LLM 应用的成本控制与优化。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：企业客服场景存在大量重复和相似的问题，每次都调用 LLM 浪费资源。</p><p>Task：设计多层缓存策略，提升系统响应速度并降低成本。</p><p>Action：我重点做了三件事——Situation：企业客服场景存在大量重复和相似的问题，每次都调用 LLM 浪费资源；Task：设计多层缓存策略，提升系统响应速度并降低成本；Action： ##</p><p>Result：总缓存命中率约 20%（L1 8% + L2 7% + L3 5%）。缓存命中时延迟 &amp;lt; 100ms（对比 LLM 调用的 3s）。节省约 20% 的 LLM API 调用成本。</p><p>你也可以补充：本站题库「LLM-as-Judge：使用 LLM 评估 LLM 输出」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q4</span><span class="guide-q-text">流式输出是怎么实现的？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>（详见技术实现类 Q12，此处补充性能优化视角）</p>
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：非流式模式下，用户需要等待 LLM 完全生成后才能看到回答，感知延迟长。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：实现全链路流式输出，优化用户感知延迟。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. TTFT（Time To First Token）优化：</strong></p>
<p>目标：TTFT &amp;lt; 500ms。意图识别 + 检索在 LLM 开始生成前完成。LLM 的第一个 token 通常在 200-500ms 内返回。</p>
<p class="guide-a-step"><strong>2. TBT（Time Between Tokens）优化：</strong></p>
<p>选择输出速度快的模型（GPT-4o-mini 的 TBT 约 10ms/token）。避免后端缓冲累积 token 再发送。</p>
<p class="guide-a-step"><strong>3. 流式中的工具调用处理：</strong></p>
<p>检测到 Action 开始时，发送状态消息"正在查询..."。工具执行完成后，继续流式输出 Final Answer。前端展示 loading 动画和工具调用状态。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：TTFT P50 = 450ms，P99 = 800ms。用户感知的响应速度提升 5x。用户满意度提升 22%。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. （详见技术实现类 Q12，此处补充性能优化视角） Situation：非流式模式… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：实现全链路流式输出，优化用户感知延迟 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. TTFT（Time To First Token）优化：目标：TTFT &amp;… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 500ms。意图识别 + 检索在 LLM 开始生成前完成 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. LLM 的第一个 token 通常在 200-500ms 内返回 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>3. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「LLM-as-Judge：使用 LLM 评估 LLM 输出」（/custom/ai100-evaluation/071-llm-as-judge） — 要点：LLM-as-Judge 是用一个强大的 LLM（如 GPT-4）自动评估另一个 LLM 输出质量的技术，在成本和质量之间取得了最佳平衡。两种核心模式：**Pointwise 评分**（对单个输出按维…</p><p>· 「3. AI 编程工具的 Token 成本怎么控制？」（/custom/kama-ai-coding/vibe_coding_interview-q3） — 要点：这个问题面试官越来越爱问，因为这是团队用 AI 编程最实际的问题…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：LLM-as-Judge：使用 LLM 评估 LLM 输出、3. AI 编程工具的 Token 成本怎么控制？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：非流式模式下，用户需要等待 LLM 完全生成后才能看到回答，感知延迟长。</p><p>Task：实现全链路流式输出，优化用户感知延迟。</p><p>Action：我重点做了三件事——（详见技术实现类 Q12，此处补充性能优化视角） Situation：非流式模式下，用户需要等待 LLM 完全生成后才能看到回答，感知延迟长；Task：实现全链路流式输出，优化用户感知延迟；Action： ##</p><p>Result：TTFT P50 = 450ms，P99 = 800ms。用户感知的响应速度提升 5x。用户满意度提升 22%。</p><p>你也可以补充：本站题库「LLM-as-Judge：使用 LLM 评估 LLM 输出」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q5</span><span class="guide-q-text">异步处理在哪些地方使用了？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>（详见技术实现类 Q14，此处补充更多场景）</p>
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：系统中大量 I/O 密集型操作，同步处理会严重限制吞吐量。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：全面采用异步编程，提升系统并发处理能力。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 实时路径（async/await）：</strong></p>
<p>LLM API 调用向量数据库检索Elasticsearch 查询用户请求处理（FastAPI 全异步）</p>
<p class="guide-a-step"><strong>2. 准实时路径（异步任务队列）：</strong></p>
<p>对话记录入库用户行为日志写入实时告警推送</p>
<p class="guide-a-step"><strong>3. 离线路径（Celery 任务队列）：</strong></p>
<p>文档解析和索引构建知识图谱更新对话历史摘要归档报表生成</p>
<p class="guide-a-step"><strong>4. 并行编排：</strong></p>
</div></div>
</div>

```python
   async def process_query(query):
       intent_task = asyncio.create_task(identify_intent(query))
       retrieval_task = asyncio.create_task(retrieve_documents(query))
       intent, docs = await asyncio.gather(intent_task, retrieval_task)
       return await generate_answer(intent, docs, query)

Result：
  系统 QPS 从 30 提升到 85（2.8 倍）。
  文档索引速度提升 4 倍。
  内存使用率更平稳（避免了同步阻塞导致的内存堆积）。

```

<div class="guide-qa">
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】这题和 RAG、Eval 都相关，属于 Agent 面试的高频交叉点。</p><p>【拆开理解】</p><p>1. （详见技术实现类 Q14，此处补充更多场景） Situation：系统中大量 I… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：全面采用异步编程，提升系统并发处理能力 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 实时路径（async/await）： LLM API 调用向量数据库检索 … → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 准实时路径（异步任务队列）：对话记录入库用户行为日志写入实时告警推送 ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 3. 离线路径（Celery 任务队列）：文档解析和索引构建知识图谱更新对话历史… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「LLM-as-Judge：使用 LLM 评估 LLM 输出」（/custom/ai100-evaluation/071-llm-as-judge） — 要点：LLM-as-Judge 是用一个强大的 LLM（如 GPT-4）自动评估另一个 LLM 输出质量的技术，在成本和质量之间取得了最佳平衡。两种核心模式：**Pointwise 评分**（对单个输出按维…</p><p>· 「任务分解（Task Decomposition）的基本方法」（/custom/ai100-planning/050-task-decomposition） — 要点：任务分解是将复杂目标拆分为更小、可执行的子任务的过程，是 Agent 规划能力的基础。主要方法包括：**LLM 驱动分解**（用 Prompt 让 LLM 自行拆分任务，最灵活但可能不稳定）、**程序…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：LLM-as-Judge：使用 LLM 评估 LLM 输出、任务分解（Task Decomposition）的基本方法。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：系统中大量 I/O 密集型操作，同步处理会严重限制吞吐量。</p><p>Task：全面采用异步编程，提升系统并发处理能力。</p><p>Action：我重点做了三件事——（详见技术实现类 Q14，此处补充更多场景） Situation：系统中大量 I/O 密集型操作，同步处理会严重限制吞吐量；Task：全面采用异步编程，提升系统并发处理能力；Action： ##</p><p>Result：系统 QPS 从 30 提升到 85（2.8 倍）。文档索引速度提升 4 倍。内存使用率更平稳（避免了同步阻塞导致的内存堆积）。 ```</p><p>你也可以补充：本站题库「LLM-as-Judge：使用 LLM 评估 LLM 输出」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q6</span><span class="guide-q-text">数据库查询是怎么优化的？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：随着数据量增长，部分数据库查询变慢，影响 Agent 工具调用的响应速度。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：优化数据库查询性能，确保工具调用延迟在可接受范围内。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 向量数据库（Milvus）优化：</strong></p>
<p>索引选择：数据量 &amp;lt; 100 万用 HNSW（延迟低），&gt; 100 万用 IVF_SQ8（内存占用小）。HNSW 参数调优： M=16, efConstruction=200, ef=128 。Collection 按租户分，避免跨租户查询。</p>
<p class="guide-a-step"><strong>2. 关系型数据库（PostgreSQL）优化：</strong></p>
<p>为高频查询添加组合索引。使用 EXPLAIN ANALYZE 分析慢查询。对话历史表按月分区（partition）。连接池配置：min=5, max=20, max_idle=300s。</p>
<p class="guide-a-step"><strong>3. Redis 优化：</strong></p>
<p>数据结构选择：缓存用 String，会话状态用 Hash，排行用 Sorted Set。Key 设计规范： {service}:{tenant}:{type}:{id} 。热 key 探测和打散。</p>
<p class="guide-a-step"><strong>4. 查询模式优化：</strong></p>
<p>避免 N+1 查询（批量查询替代循环查询）。使用预编译语句（PreparedStatement），减少 SQL 解析开销。只查询需要的字段，避免 SELECT *。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：向量检索 P99 延迟稳定在 50ms 以内。SQL 慢查询数量从日均 200 降到 5。Redis 缓存命中率 95%，读延迟 &amp;lt; 1ms。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation：随着数据量增长，部分数据库查询变慢，影响 Agent 工具调… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：优化数据库查询性能，确保工具调用延迟在可接受范围内 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 向量数据库（Milvus）优化：索引选择：数据量 &amp;lt → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 100 万用 HNSW（延迟低），&gt; 100 万用 IVF_SQ8（内存占用小） → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. HNSW 参数调优： M=16, efConstruction=200, ef=… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>3. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」（/custom/xiaolin-agent/patterns） — 要点：我理解 Agent 和 Workflow 最核心的区别是「谁来决定下一步」…</p><p>· 「说说 Single-Agent 和 Multi-Agent 的设计方案？」（/custom/xiaolin-agent/single_multi） — 要点：Single-Agent 适合任务流程清晰、复杂度适中的场景，实现简单、好维护；Multi-Agent 适合需要专业分工、任务量大或者需要并行执行的复杂场景…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…、说说 Single-Agent 和 Multi-Agent 的设计方案？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：优化数据库查询性能，确保工具调用延迟在可接受范围内。</p><p>Action：我重点做了三件事——Situation：随着数据量增长，部分数据库查询变慢，影响 Agent 工具调用的响应速度；Task：优化数据库查询性能，确保工具调用延迟在可接受范围内；Action： ##</p><p>Result：向量检索 P99 延迟稳定在 50ms 以内。 SQL 慢查询数量从日均 200 降到 5。 Redis 缓存命中率 95%，读延迟 &amp;lt; 1ms。</p><p>你也可以补充：本站题库「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q7</span><span class="guide-q-text">模型推理速度是怎么优化的？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：本地部署的模型（用于 embedding、reranking 等）推理速度需要优化。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：提升本地模型的推理速度，降低延迟。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 模型量化：</strong></p>
<p>Embedding 模型（BGE-M3）使用 INT8 量化。精度损失 &amp;lt; 0.5%，推理速度提升 40%。</p>
<p class="guide-a-step"><strong>2. 推理引擎优化：</strong></p>
<p>使用 ONNX Runtime 替代 PyTorch 推理（速度提升 30%）。启用 CUDA 加速和 TensorRT 优化。</p>
<p class="guide-a-step"><strong>3. 批处理（Batching）：</strong></p>
<p>Embedding 计算支持批量输入（batch_size=64）。Reranking 支持批量推理（一次性对 40 个候选打分）。使用动态批处理（Dynamic Batching）：收集短时间内的请求合并处理。</p>
<p class="guide-a-step"><strong>4. 模型预加载：</strong></p>
<p>服务启动时预加载模型到 GPU 显存。避免首次请求的冷启动延迟。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：Embedding 计算延迟：单条 15ms → 批量 1000 条 3s（均摊 3ms/条）。Reranking 延迟：40 条候选 120ms（batch 推理）。GPU 利用率从 30% 提升到 75%。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation：本地部署的模型（用于 embedding、reranking… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：提升本地模型的推理速度，降低延迟 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 模型量化： Embedding 模型（BGE-M3）使用 INT8 量化。… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 0.5%，推理速度提升 40% → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 2. 推理引擎优化：使用 ONNX Runtime 替代 PyTorch 推理（… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「任务分解（Task Decomposition）的基本方法」（/custom/ai100-planning/050-task-decomposition） — 要点：任务分解是将复杂目标拆分为更小、可执行的子任务的过程，是 Agent 规划能力的基础。主要方法包括：**LLM 驱动分解**（用 Prompt 让 LLM 自行拆分任务，最灵活但可能不稳定）、**程序…</p><p>· 「Re-ranking 的原理与实现：Cross-Encoder vs Bi-Enco…」（/custom/ai100-rag/017-reranking-strategies） — 要点：Bi-Encoder 将查询和文档独立编码为向量，速度快但精度有限，用于第一阶段的大规模检索（Retrieval）。Cross-Encoder 将查询和文档拼接后联合编码，精度高但速度慢，用于第二阶段…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：任务分解（Task Decomposition）的基本方法、Re-ranking 的原理与实现：Cross-Encoder vs Bi-Enco…。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：本地部署的模型（用于 embedding、reranking 等）推理速度需要优化。</p><p>Task：提升本地模型的推理速度，降低延迟。</p><p>Action：我重点做了三件事——Situation：本地部署的模型（用于 embedding、reranking 等）推理速度需要优化；Task：提升本地模型的推理速度，降低延迟；Action： ##</p><p>Result：Embedding 计算延迟：单条 15ms →批量 1000 条 3s（均摊 3ms/条）。 Reranking 延迟：40 条候选 120ms（batch 推理）。 GPU 利用率从 30% 提升到 75%。</p><p>你也可以补充：本站题库「任务分解（Task Decomposition）的基本方法」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q8</span><span class="guide-q-text">前端渲染性能怎么优化？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：前端在展示流式输出和长对话时存在性能问题：频繁 DOM 更新导致卡顿、长对话列表滚动不流畅。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：优化前端渲染性能，确保流畅的用户体验。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 流式输出渲染优化：</strong></p>
<p>Token 缓冲：不是每收到一个 token 就更新 DOM，而是累积 50ms 的 token 后批量更新。使用 requestAnimationFrame 控制更新频率。Markdown 渐进式渲染：部分渲染已接收的内容，不等待完整文本。</p>
<p class="guide-a-step"><strong>2. 长对话列表优化：</strong></p>
<p>虚拟滚动：只渲染可视区域内的消息气泡。分页加载：历史消息按需加载，不一次性渲染。</p>
<p class="guide-a-step"><strong>3. 内存管理：</strong></p>
<p>及时清理 EventSource 连接。使用 WeakRef 管理消息对象引用。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：流式输出时 FPS 从 30 提升到 60（无卡顿）。100+ 轮对话列表滚动流畅。页面内存占用降低 40%。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation：前端在展示流式输出和长对话时存在性能问题：频繁 DOM 更新… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：优化前端渲染性能，确保流畅的用户体验 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 流式输出渲染优化： Token 缓冲：不是每收到一个 token 就更新 … → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. Markdown 渐进式渲染：部分渲染已接收的内容，不等待完整文本 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 2. 长对话列表优化：虚拟滚动：只渲染可视区域内的消息气泡。分页加载：历史消息按… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】可以把 Agent 想成「会自己查资料、记笔记、调系统的数字员工」，比普通 ChatBot 多了闭环和多步决策。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「3. AI 编程工具的 Token 成本怎么控制？」（/custom/kama-ai-coding/vibe_coding_interview-q3） — 要点：这个问题面试官越来越爱问，因为这是团队用 AI 编程最实际的问题…</p><p>· 「LLM-as-Judge：使用 LLM 评估 LLM 输出」（/custom/ai100-evaluation/071-llm-as-judge） — 要点：LLM-as-Judge 是用一个强大的 LLM（如 GPT-4）自动评估另一个 LLM 输出质量的技术，在成本和质量之间取得了最佳平衡。两种核心模式：**Pointwise 评分**（对单个输出按维…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：3. AI 编程工具的 Token 成本怎么控制？、LLM-as-Judge：使用 LLM 评估 LLM 输出。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：前端在展示流式输出和长对话时存在性能问题：频繁 DOM 更新导致卡顿、长对话列表滚动不流畅。</p><p>Task：优化前端渲染性能，确保流畅的用户体验。</p><p>Action：我重点做了三件事——Situation：前端在展示流式输出和长对话时存在性能问题：频繁 DOM 更新导致卡顿、长对话列表滚动不流畅；Task：优化前端渲染性能，确保流畅的用户体验；Action： ##</p><p>Result：流式输出时 FPS 从 30 提升到 60（无卡顿）。 100+ 轮对话列表滚动流畅。页面内存占用降低 40%。</p><p>你也可以补充：本站题库「3. AI 编程工具的 Token 成本怎么控制？」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q9</span><span class="guide-q-text">冷启动问题是怎么解决的？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：系统重启或新实例扩容时存在冷启动问题：模型加载慢、缓存为空、连接池未预热。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：减少冷启动对用户的影响。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 模型预加载：</strong></p>
<p>使用 Kubernetes 的 readinessProbe，模型加载完成后才接收流量。模型文件使用共享存储（NFS/OSS），避免每次从网络下载。预加载时间：约 30s（embedding 模型 + reranker 模型）。</p>
<p class="guide-a-step"><strong>2. 缓存预热：</strong></p>
<p>服务启动时自动加载 FAQ 缓存和热门问题缓存。从其他健康实例同步缓存数据（peer 预热）。预热完成前使用降级策略（跳过缓存直接查询）。</p>
<p class="guide-a-step"><strong>3. 连接池预建：</strong></p>
<p>服务启动时立即创建最小数量的数据库连接。Redis 连接预建并做 PING 检查。</p>
<p class="guide-a-step"><strong>4. 流量预热：</strong></p>
<p>新实例启动后，负载均衡器先分配少量流量（权重渐增）。避免大量冷请求同时打到新实例。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：冷启动时间从 120s 降低到 45s。冷启动期间的请求成功率从 70% 提升到 98%。缓存预热后命中率快速回升到正常水平。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation：系统重启或新实例扩容时存在冷启动问题：模型加载慢、缓存为空、… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：减少冷启动对用户的影响 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 模型预加载：使用 Kubernetes 的 readinessProbe，… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 缓存预热：服务启动时自动加载 FAQ 缓存和热门问题缓存。从其他健康实例同… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 3. 连接池预建：服务启动时立即创建最小数量的数据库连接 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「任务分解（Task Decomposition）的基本方法」（/custom/ai100-planning/050-task-decomposition） — 要点：任务分解是将复杂目标拆分为更小、可执行的子任务的过程，是 Agent 规划能力的基础。主要方法包括：**LLM 驱动分解**（用 Prompt 让 LLM 自行拆分任务，最灵活但可能不稳定）、**程序…</p><p>· 「LLM-as-Judge：使用 LLM 评估 LLM 输出」（/custom/ai100-evaluation/071-llm-as-judge） — 要点：LLM-as-Judge 是用一个强大的 LLM（如 GPT-4）自动评估另一个 LLM 输出质量的技术，在成本和质量之间取得了最佳平衡。两种核心模式：**Pointwise 评分**（对单个输出按维…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：任务分解（Task Decomposition）的基本方法、LLM-as-Judge：使用 LLM 评估 LLM 输出。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：系统重启或新实例扩容时存在冷启动问题：模型加载慢、缓存为空、连接池未预热。</p><p>Task：减少冷启动对用户的影响。</p><p>Action：我重点做了三件事——Situation：系统重启或新实例扩容时存在冷启动问题：模型加载慢、缓存为空、连接池未预热；Task：减少冷启动对用户的影响；Action： ##</p><p>Result：冷启动时间从 120s 降低到 45s。冷启动期间的请求成功率从 70% 提升到 98%。缓存预热后命中率快速回升到正常水平。</p><p>你也可以补充：本站题库「任务分解（Task Decomposition）的基本方法」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q10</span><span class="guide-q-text">网络传输是怎么优化的？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：LLM API 通常部署在远端（如美西），网络延迟和带宽限制影响系统性能。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：优化网络传输环节的延迟和稳定性。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. API 端点选择：</strong></p>
<p>使用 Azure OpenAI 中国区/亚太区端点，减少跨洋延迟。跨区域延迟从 200ms（美西）降到 40ms（亚太）。</p>
<p class="guide-a-step"><strong>2. 连接优化：</strong></p>
<p>HTTP/2 多路复用，减少连接建立开销。连接池复用，避免频繁 TLS 握手。Keep-Alive 超时设置 120s。</p>
<p class="guide-a-step"><strong>3. 数据压缩：</strong></p>
<p>请求/响应启用 gzip 压缩。Prompt 中去除不必要的空格和换行，减少传输体积。</p>
<p class="guide-a-step"><strong>4. 多线路容灾：</strong></p>
<p>配置多个 API 端点（主备）。主端点超时 3s 后自动切换到备用端点。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：API 网络延迟从 200ms 降到 40ms。网络相关的超时错误降低 80%。多线路容灾确保 99.9% 的可用性。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation： LLM API 通常部署在远端（如美西），网络延迟和带宽限… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：优化网络传输环节的延迟和稳定性 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. API 端点选择：使用 Azure OpenAI 中国区/亚太区端点，减少… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 连接优化： HTTP/2 多路复用，减少连接建立开销。连接池复用，避免频繁… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. Keep-Alive 超时设置 120s → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】可以把 Agent 想成「会自己查资料、记笔记、调系统的数字员工」，比普通 ChatBot 多了闭环和多步决策。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Prompt Chaining：多步骤 Prompt 的设计与编排」（/custom/ai100-prompt/063-prompt-chaining） — 要点：Prompt Chaining（提示链）是将复杂任务分解为多个顺序执行的 LLM 调用，每个调用的输出作为下一个调用的输入。它是 Agentic AI 中最基础的设计模式，也被称为 Pipeline …</p><p>· 「跨模型 Prompt 迁移：如何编写模型无关的 Prompt？」（/custom/ai100-prompt/068-cross-model-prompt-portability） — 要点：跨模型 Prompt 迁移（Cross-Model Prompt Portability）是指让同一个 Prompt 在不同 LLM（GPT-4、Claude、Gemini、Llama 等）上都能有效…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：Prompt Chaining：多步骤 Prompt 的设计与编排、跨模型 Prompt 迁移：如何编写模型无关的 Prompt？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：LLM API 通常部署在远端（如美西），网络延迟和带宽限制影响系统性能。</p><p>Task：优化网络传输环节的延迟和稳定性。</p><p>Action：我重点做了三件事——Situation： LLM API 通常部署在远端（如美西），网络延迟和带宽限制影响系统性能；Task：优化网络传输环节的延迟和稳定性；Action： ##</p><p>Result：API 网络延迟从 200ms 降到 40ms。网络相关的超时错误降低 80%。多线路容灾确保 99.9% 的可用性。</p><p>你也可以补充：本站题库「Prompt Chaining：多步骤 Prompt 的设计与编排」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q11</span><span class="guide-q-text">Embedding 计算是怎么优化的？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：知识库初始化需要对大量文档计算 embedding（800 万个 chunk），耗时过长。日常增量更新也需要高效的 embedding 计算。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：优化 embedding 计算的吞吐量和效率。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 批量计算优化：</strong></p>
<p>batch_size=256，GPU 利用率最大化。使用 DataLoader 预加载数据，避免 GPU 等待 CPU 数据处理。</p>
<p class="guide-a-step"><strong>2. 增量更新策略：</strong></p>
<p>文档变更检测：对比 MD5 hash，只对变更的文档重新计算 embedding。新增文档实时计算并入库，不需要全量重建。</p>
<p class="guide-a-step"><strong>3. 多 GPU 并行：</strong></p>
<p>使用 DataParallel 在多张 GPU 上并行计算。4 张 T4 GPU 并行，吞吐量提升 3.6 倍。</p>
<p class="guide-a-step"><strong>4. 维度压缩（可选）：</strong></p>
<p>对于存储和检索速度敏感的场景，使用 PCA 将 1024 维降到 512 维。召回率仅下降 1.2%，存储减少 50%。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：800 万 chunk 的全量 embedding 计算：从 48 小时降到 12 小时。日常增量更新：1000 条新文档的 embedding 计算 &amp;lt; 30s。GPU 利用率稳定在 80%+。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation：知识库初始化需要对大量文档计算 embedding（800 … → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：优化 embedding 计算的吞吐量和效率 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 批量计算优化： batch_size=256，GPU 利用率最大化。使用 … → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 增量更新策略：文档变更检测：对比 MD5 hash，只对变更的文档重新计算… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 3. 多 GPU 并行：使用 DataParallel 在多张 GPU 上并行计… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「任务分解（Task Decomposition）的基本方法」（/custom/ai100-planning/050-task-decomposition） — 要点：任务分解是将复杂目标拆分为更小、可执行的子任务的过程，是 Agent 规划能力的基础。主要方法包括：**LLM 驱动分解**（用 Prompt 让 LLM 自行拆分任务，最灵活但可能不稳定）、**程序…</p><p>· 「Embedding 模型选择与微调策略」（/custom/ai100-rag/015-embedding-model-selection） — 要点：Embedding 模型的选择直接决定 RAG 检索质量。2025-2026 年的格局：**Voyage AI voyage-3-large** 与 **Cohere embed-v4** 在 MTE…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：任务分解（Task Decomposition）的基本方法、Embedding 模型选择与微调策略。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：知识库初始化需要对大量文档计算 embedding（800 万个 chunk），耗时过长。日常增量更新也需要高效的 embedding 计算。</p><p>Task：优化 embedding 计算的吞吐量和效率。</p><p>Action：我重点做了三件事——Situation：知识库初始化需要对大量文档计算 embedding（800 万个 chunk），耗时过长。日常增量更新也需要高效的 embedding 计算；Task：优化 embedding 计算的吞吐量和效率；Action： ##</p><p>Result：800 万 chunk 的全量 embedding 计算：从 48 小时降到 12 小时。日常增量更新：1000 条新文档的 embedding 计算 &amp;lt; 30s。 GPU 利用率稳定在 80%+。</p><p>你也可以补充：本站题库「任务分解（Task Decomposition）的基本方法」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q12</span><span class="guide-q-text">怎么做的资源监控和自动扩缩容？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：系统负载随业务高峰期波动很大（如促销期间请求量暴增 5 倍），固定资源配置要么浪费要么不足。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：实现基于业务指标的自动扩缩容。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 监控指标：</strong></p>
<p>基础指标： CPU、内存、网络 I/O。业务指标： QPS、P99 延迟、错误率、LLM API 并发数。自定义指标： 队列积压数、缓存命中率。</p>
<p class="guide-a-step"><strong>2. HPA（水平 Pod 自动扩缩容）：</strong></p>
</div></div>
</div>

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
spec:
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Pods
      pods:
        metric:
          name: requests_per_second
        target:
          type: AverageValue
          averageValue: "50"
```

     QPS > 50/Pod 时扩容。
     QPS < 20/Pod 持续 5 分钟时缩容。
#### 3. 预测性扩容：

     基于历史数据预测高峰时段，提前扩容。
     促销等已知高峰事件手动预扩容。
Result：
   高峰期自动扩容到 8 个 Pod，低谷期缩容到 2 个 Pod。
   资源成本降低 35%（对比固定 8 Pod 配置）。
   高峰期 P99 延迟始终保持 < 5s。

<div class="guide-qa">
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation：系统负载随业务高峰期波动很大（如促销期间请求量暴增 5 倍）… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：实现基于业务指标的自动扩缩容 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 监控指标：基础指标： CPU、内存、网络 I/O。业务指标： QPS、P9… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. HPA（水平 Pod 自动扩缩容）： ```yaml apiVersion… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. QPS &lt; 20/Pod 持续 5 分钟时缩容 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】可以把 Agent 想成「会自己查资料、记笔记、调系统的数字员工」，比普通 ChatBot 多了闭环和多步决策。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「LLM-as-Judge：使用 LLM 评估 LLM 输出」（/custom/ai100-evaluation/071-llm-as-judge） — 要点：LLM-as-Judge 是用一个强大的 LLM（如 GPT-4）自动评估另一个 LLM 输出质量的技术，在成本和质量之间取得了最佳平衡。两种核心模式：**Pointwise 评分**（对单个输出按维…</p><p>· 「LLM 应用的成本控制与优化」（/custom/today-interview/cost-optimization） — 要点：模型阶梯路由（小模型先上、搞不定再大模型）、语义缓存防止重复调、prompt 和 context 精简、批处理异步化——四管齐下能把成本压 40%-60%。…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：LLM-as-Judge：使用 LLM 评估 LLM 输出、LLM 应用的成本控制与优化。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：系统负载随业务高峰期波动很大（如促销期间请求量暴增 5 倍），固定资源配置要么浪费要么不足。</p><p>Task：实现基于业务指标的自动扩缩容。</p><p>Action：我重点做了三件事——Situation：系统负载随业务高峰期波动很大（如促销期间请求量暴增 5 倍），固定资源配置要么浪费要么不足；Task：实现基于业务指标的自动扩缩容；Action： ##</p><p>Result：高峰期自动扩容到 8 个 Pod，低谷期缩容到 2 个 Pod。资源成本降低 35%（对比固定 8 Pod 配置）。高峰期 P99 延迟始终保持 &lt; 5s。</p><p>你也可以补充：本站题库「LLM-as-Judge：使用 LLM 评估 LLM 输出」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

第四类：故障处理类问题

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q1</span><span class="guide-q-text">Agent 死循环怎么检测和防止的？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：ReAct 模式下，Agent 可能陷入"思考-行动-观察"的无限循环。例如检索结果不满意时反复重新检索，或反复调用同一工具但参数不变。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：设计检测和防止 Agent 死循环的机制。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 硬性限制：</strong></p>
<p>最大迭代次数： max_iterations = 10 ，超过强制结束。最大执行时间： max_execution_time = 60s ，超时强制结束。最大 token 消耗：单次请求总 token ≤ 30000。</p>
<p class="guide-a-step"><strong>2. 智能检测：</strong></p>
<p>重复动作检测： 连续 2 次调用相同工具且参数相同（或高度相似），判定为循环。进度检测： 每 3 轮迭代后检查是否有实质性进展（新信息、状态变化）。回路检测： 状态机检测是否回到之前的状态。</p>
<p class="guide-a-step"><strong>3. 处理策略：</strong></p>
<p>检测到循环后，在下一次 Thought 的 Prompt 中注入提示：注意：你已经执行了相同的操作，请尝试不同的方法或直接给出最终回答。如果注入提示后仍然循环 → 强制进入 Final Answer 阶段。强制结束时，基于已有信息生成最好的回答，并标注"信息可能不完整"。</p>
<p class="guide-a-step"><strong>4. 根因分析和预防：</strong></p>
<p>所有死循环事件记录日志，定期分析根因。常见根因：工具描述不清导致选错工具、Prompt 指令矛盾、检索结果质量差。针对性优化 Prompt 和工具描述。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：死循环发生率从初始的 3% 降低到 0.2%。99.8% 的请求在 5 轮迭代内完成。死循环导致的用户投诉降低 95%。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation： ReAct 模式下，Agent 可能陷入"思考-行动-观察… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：设计检测和防止 Agent 死循环的机制 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 硬性限制：最大迭代次数： max_iterations = 10 ，超过强… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 智能检测：重复动作检测：连续 2 次调用相同工具且参数相同（或高度相似），… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 3. 处理策略：检测到循环后，在下一次 Thought 的 Prompt 中注入… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像侦探办案：先推理（Thought），再行动查线索（Action），看结果（Observation），循环直到破案。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 把 ReAct 说成「想一步做一步」但说不清 Observation 从哪来、何时停止。</p><p>3. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>4. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>5. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Agent 架构模式详解：ReAct、Plan-and-Execute、LATS、P…」（/custom/ai100-agent-arch/003-agent-architecture-patterns） — 要点：主流 Agent 架构模式各有侧重：**ReAct** 交替推理与行动，灵活且可解释性强，但 token 消耗高；**Plan-and-Execute** 先规划后执行，高效但适应性低；**LATS*…</p><p>· 「Prompt Chaining：多步骤 Prompt 的设计与编排」（/custom/ai100-prompt/063-prompt-chaining） — 要点：Prompt Chaining（提示链）是将复杂任务分解为多个顺序执行的 LLM 调用，每个调用的输出作为下一个调用的输入。它是 Agentic AI 中最基础的设计模式，也被称为 Pipeline …</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 架构：步数上限、停止条件、死循环检测、Plan+ReAct 混合、画拓扑图。</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：Agent 架构模式详解：ReAct、Plan-and-Execute、LATS、P…、Prompt Chaining：多步骤 Prompt 的设计与编排。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：说清要优化的目标指标</p><p>Action：我重点做了三件事——Situation： ReAct 模式下，Agent 可能陷入"思考-行动-观察"的无限循环。例如检索结果不满意时反复重新检索，或反复调用同一工具但参数不变；Task：设计检测和防止 Agent 死循环的机制；Action： ##</p><p>Result：死循环发生率从初始的 3% 降低到 0.2%。 99.8% 的请求在 5 轮迭代内完成。死循环导致的用户投诉降低 95%。</p><p>你也可以补充：本站题库「Agent 架构模式详解：ReAct、Plan-and-Execute、LATS、P…」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q2</span><span class="guide-q-text">模型幻觉怎么控制的？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：LLM 在没有足够信息时会"编造"内容（幻觉），在企业场景中这是严重的问题（如编造不存在的产品功能或价格）。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：多层次控制模型幻觉，确保回答基于事实。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. RAG 基础（最重要）：</strong></p>
<p>所有回答都基于检索到的知识片段，要求 LLM 只使用提供的上下文信息。Prompt 中明确声明："只根据以下参考信息回答，如果信息不足，请明确说明无法回答。"</p>
<p class="guide-a-step"><strong>2. 引用机制：</strong></p>
<p>要求 LLM 在回答中标注引用来源： [参考1] 、 [参考2] 。后处理检查引用是否真实存在于检索结果中。没有引用的事实性陈述标记为"待验证"。</p>
<p class="guide-a-step"><strong>3. 幻觉检测（输出侧）：</strong></p>
<p>NLI（自然语言推断）检查： 检查回答中的每个关键陈述是否能从 context 中推断出来。关键实体核验： 提取回答中的数字、日期、名称等关键实体，与 context 对比。自我一致性检查： 让 LLM 对同一问题生成 3 次回答，如果答案不一致，标记为低置信度。</p>
<p class="guide-a-step"><strong>4. 降级策略：</strong></p>
<p>检索结果相关性低（rerank score &amp;lt; 0.4）→ 回复"知识库中暂无相关信息"。检测到可能的幻觉 → 在回答中添加提示"该信息仅供参考，建议核实"。</p>
<p class="guide-a-step"><strong>5. 温度控制：</strong></p>
<p>事实性回答场景 temperature=0（确定性最高）。创意性场景 temperature=0.7。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：幻觉率从无防控的 18% 降低到 3%。关键业务场景（报价、合同条款等）的幻觉率 &amp;lt; 0.5%。用户对回答准确性的信任度提升 35%。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation： LLM 在没有足够信息时会"编造"内容（幻觉），在企业场景… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：多层次控制模型幻觉，确保回答基于事实 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. RAG 基础（最重要）：所有回答都基于检索到的知识片段，要求 LLM 只使… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. Prompt 中明确声明："只根据以下参考信息回答，如果信息不足，请明确说明无法… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 2. 引用机制：要求 LLM 在回答中标注引用来源： [参考1] 、 [参考2]… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Prompt Chaining：多步骤 Prompt 的设计与编排」（/custom/ai100-prompt/063-prompt-chaining） — 要点：Prompt Chaining（提示链）是将复杂任务分解为多个顺序执行的 LLM 调用，每个调用的输出作为下一个调用的输入。它是 Agentic AI 中最基础的设计模式，也被称为 Pipeline …</p><p>· 「跨模型 Prompt 迁移：如何编写模型无关的 Prompt？」（/custom/ai100-prompt/068-cross-model-prompt-portability） — 要点：跨模型 Prompt 迁移（Cross-Model Prompt Portability）是指让同一个 Prompt 在不同 LLM（GPT-4、Claude、Gemini、Llama 等）上都能有效…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 记忆：事实 vs 推断分开存、写入时机、冲突合并、跨会话权限。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：Prompt Chaining：多步骤 Prompt 的设计与编排、跨模型 Prompt 迁移：如何编写模型无关的 Prompt？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：LLM 在没有足够信息时会"编造"内容（幻觉），在企业场景中这是严重的问题（如编造不存在的产品功能或价格）。</p><p>Task：多层次控制模型幻觉，确保回答基于事实。</p><p>Action：我重点做了三件事——Situation： LLM 在没有足够信息时会"编造"内容（幻觉），在企业场景中这是严重的问题（如编造不存在的产品功能或价格）；Task：多层次控制模型幻觉，确保回答基于事实；Action： ##</p><p>Result：幻觉率从无防控的 18% 降低到 3%。关键业务场景（报价、合同条款等）的幻觉率 &amp;lt; 0.5%。用户对回答准确性的信任度提升 35%。</p><p>你也可以补充：本站题库「Prompt Chaining：多步骤 Prompt 的设计与编排」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q3</span><span class="guide-q-text">模型超时怎么处理？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：LLM API 调用有时会出现超长延迟（&gt; 30s）或直接超时，影响用户体验。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：设计模型超时的处理策略，保证用户体验。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 超时策略分级：</strong></p>
<p>连接超时： 5s（TCP 连接建立）。首 token 超时： 10s（等待第一个 token 返回）。总超时： 60s（整个请求的最长时间）。</p>
<p class="guide-a-step"><strong>2. 超时处理流程：</strong></p>
<p>首次调用超时 → 自动重试（切换备用端点，最多1次）→ 重试超时 → 降级到备用模型→ 备用模型也超时 → 返回兜底话术</p>
<p class="guide-a-step"><strong>3. 降级矩阵：</strong></p>
<p>主模型             备用模型              兜底GPT-4o           GPT-4o-mini          缓存/话术Claude 3.5       GPT-4o-mini          缓存/话术本地模型             GPT-4o-mini          缓存/话术</p>
<p class="guide-a-step"><strong>4. 用户侧处理：</strong></p>
<p>流式模式下：超时前如果已有部分输出，告知用户"回答可能不完整"。非流式模式：返回"处理时间较长，正在努力处理中..."，并提供重试按钮。记录超时请求，后台异步完成后主动推送结果。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：用户可见的超时错误从 5% 降低到 0.5%。降级后的回答质量虽然有所下降，但 85% 的用户仍然接受。模型不可用时的系统可用性从 0% 提升到 95%（降级兜底）。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation： LLM API 调用有时会出现超长延迟（&gt; 30s）或直接… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：设计模型超时的处理策略，保证用户体验 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 超时策略分级：连接超时： 5s（TCP 连接建立）。首 token 超时：… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 超时处理流程：首次调用超时→自动重试（切换备用端点，最多1次）→重试超时→… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 3. 降级矩阵：主模型备用模型兜底 GPT-4o GPT-4o-mini 缓存/… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】可以把 Agent 想成「会自己查资料、记笔记、调系统的数字员工」，比普通 ChatBot 多了闭环和多步决策。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「LLM-as-Judge：使用 LLM 评估 LLM 输出」（/custom/ai100-evaluation/071-llm-as-judge） — 要点：LLM-as-Judge 是用一个强大的 LLM（如 GPT-4）自动评估另一个 LLM 输出质量的技术，在成本和质量之间取得了最佳平衡。两种核心模式：**Pointwise 评分**（对单个输出按维…</p><p>· 「OpenAI Assistants API vs Anthropic Claude …」（/custom/ai100-frameworks/099-assistants-api-vs-claude-sdk） — 要点：OpenAI 和 Anthropic 分别推出了官方 Agent 开发方案，代表了两种不同的设计哲学。**OpenAI Agents SDK**（2025-03 发布，**底层基于新的 Respons…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：LLM-as-Judge：使用 LLM 评估 LLM 输出、OpenAI Assistants API vs Anthropic Claude …。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：LLM API 调用有时会出现超长延迟（&gt; 30s）或直接超时，影响用户体验。</p><p>Task：设计模型超时的处理策略，保证用户体验。</p><p>Action：我重点做了三件事——Situation： LLM API 调用有时会出现超长延迟（&gt; 30s）或直接超时，影响用户体验；Task：设计模型超时的处理策略，保证用户体验；Action： ##</p><p>Result：用户可见的超时错误从 5% 降低到 0.5%。降级后的回答质量虽然有所下降，但 85% 的用户仍然接受。模型不可用时的系统可用性从 0% 提升到 95%（降级兜底）。</p><p>你也可以补充：本站题库「LLM-as-Judge：使用 LLM 评估 LLM 输出」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q4</span><span class="guide-q-text">检索结果不准确怎么办？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：检索结果不准确是 RAG 系统最常见的问题，表现为：召回的 chunk 与问题无关、关键信息未被召回、排序不准确。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：建立检索质量问题的诊断和优化流程。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 问题诊断流程：</strong></p>
<p>用户反馈 → 复现查询 → 查看检索结果 → 定位问题环节</p>
</div></div>
</div>

```text
├── 分块问题：关键信息被切断 → 优化分块策略
├── Embedding 质量：语义表示不准 → 评估/更换模型
├── 检索参数：top_k 太小 → 调整参数
├── 数据质量：源文档有误 → 数据清洗
└── 查询理解：用户表述模糊 → query 重写
```

#### 2. Query 重写（Query Rewriting）：

     使用 LLM 将用户的口语化查询重写为更精确的检索查询。
     示例："这个东西怎么退" → "退货退款流程和规则"
     多查询扩展：将一个模糊查询扩展为多个精确子查询，分别检索后融合。
#### 3. HyDE（Hypothetical Document Embedding）：

     让 LLM 生成一个"假设的理想回答"。
     对假设回答计算 embedding 来检索（而不是直接用 query 的 embedding）。
     在专业领域查询中效果提升显著。
#### 4. 检索后处理：

     Reranker 精排（详见技术实现 Q6）。
     上下文扩展：检索到的 chunk 自动扩展前后相邻 chunk，补充上下文。
#### 5. 持续优化闭环：

     每周分析"回答不满意"的反馈，追溯检索环节的问题。
     定期更新评估集，跟踪检索质量指标。
Result：
   Query 重写使检索准确率提升 15%。
   HyDE 在专业术语查询场景提升 22%。
   检索相关的用户投诉减少 60%。

<div class="guide-qa">
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation：检索结果不准确是 RAG 系统最常见的问题，表现为：召回的 … → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：建立检索质量问题的诊断和优化流程 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 问题诊断流程：用户反馈→复现查询→查看检索结果→定位问题环节├──分块问题… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. Query 重写（Query Rewriting）：使用 LLM 将用户的… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 3. HyDE（Hypothetical Document Embedding）… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「LLM-as-Judge：使用 LLM 评估 LLM 输出」（/custom/ai100-evaluation/071-llm-as-judge） — 要点：LLM-as-Judge 是用一个强大的 LLM（如 GPT-4）自动评估另一个 LLM 输出质量的技术，在成本和质量之间取得了最佳平衡。两种核心模式：**Pointwise 评分**（对单个输出按维…</p><p>· 「如何润色用户的 Query（Query Rewrite）？目的是什么？」（/custom/xiaolin-rag/query_rewrite） — 要点：我用 Query Rewrite 主要是为了弥补用户提问方式和知识库文档表述之间的语义鸿沟…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 记忆：事实 vs 推断分开存、写入时机、冲突合并、跨会话权限。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：LLM-as-Judge：使用 LLM 评估 LLM 输出、如何润色用户的 Query（Query Rewrite）？目的是什么？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：检索结果不准确是 RAG 系统最常见的问题，表现为：召回的 chunk 与问题无关、关键信息未被召回、排序不准确。</p><p>Task：建立检索质量问题的诊断和优化流程。</p><p>Action：我重点做了三件事——Situation：检索结果不准确是 RAG 系统最常见的问题，表现为：召回的 chunk 与问题无关、关键信息未被召回、排序不准确；Task：建立检索质量问题的诊断和优化流程；Action： ##</p><p>Result：Query 重写使检索准确率提升 15%。 HyDE 在专业术语查询场景提升 22%。检索相关的用户投诉减少 60%。</p><p>你也可以补充：本站题库「LLM-as-Judge：使用 LLM 评估 LLM 输出」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q5</span><span class="guide-q-text">工具调用失败怎么处理？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：Agent 调用外部工具（数据库查询、API 调用等）时可能失败：接口不可用、参数错误、权限不足、数据不存在等。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：设计工具调用失败的处理策略，保证 Agent 的鲁棒性。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 错误分类和处理：</strong></p>
<p>| 错误类型 | 示例 | 处理策略 || --- | --- | --- || 临时错误 | 网络超时、限流 | 重试（最多 2 次） || 参数错误 | SQL 语法错误 | 告知 Agent，让其修正参数 || 权限错误 | 无访问权限 | 告知用户，建议联系管理员 || 数据不存在 | 查无此订单 | 告知用户，建议核实信息 || 系统错误 | 服务不可用 | 降级处理 |</p>
<p class="guide-a-step"><strong>2. Agent 自愈机制：</strong></p>
<p>工具调用失败后，错误信息返回给 Agent 的 Observation。Agent 基于错误信息决定下一步：修改参数重新调用（如修正 SQL 语法）。尝试替代工具（如 API 不可用，改为查数据库）。直接告知用户（如数据确实不存在）。</p>
<p class="guide-a-step"><strong>3. 错误信息标准化：</strong></p>
</div></div>
</div>

```python
   class ToolError:
       error_type: str    #
   TIMEOUT/PARAM_ERROR/AUTH_ERROR/NOT_FOUND/SYSTEM_ERROR
       message: str       #   人可读的错误描述
       retryable: bool    #   是否可重试
       suggestion: str    #   建议的处理方式
```

#### 4. 兜底机制：

     工具调用连续失败 3 次 → 跳过该工具，基于已有信息回答。
     所有工具都不可用 → 返回知识库检索的纯 RAG 回答。
Result：
   工具调用的端到端成功率从 92% 提升到 98%。
   Agent 自主修正参数的成功率 78%。
   工具不可用时的用户体验保持在可接受水平（有降级回答）。

<div class="guide-qa">
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation： Agent 调用外部工具（数据库查询、API 调用等）时可… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：设计工具调用失败的处理策略，保证 Agent 的鲁棒性 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 错误分类和处理：错误类型示例处理策略临时错误网络超时、限流重试（最多 2 … → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. Agent 自愈机制：工具调用失败后，错误信息返回给 Agent 的 Ob… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. Agent 基于错误信息决定下一步：修改参数重新调用（如修正 SQL 语法）。尝… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>3. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>4. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Tool Use 的常见模式：API 调用、数据库查询、代码执行」（/custom/ai100-tool-use/023-common-tool-patterns） — 要点：LLM 工具使用有三大类模式：**数据访问**（API 调用获取外部数据、SQL 查询数据库、向量检索知识库）、**计算与代码执行**（在沙箱中运行代码进行数据处理、计算或可视化）、**写操作与动作执…</p><p>· 「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」（/custom/xiaolin-agent/patterns） — 要点：我理解 Agent 和 Workflow 最核心的区别是「谁来决定下一步」…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：Tool Use 的常见模式：API 调用、数据库查询、代码执行、了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：说清要优化的目标指标</p><p>Action：我重点做了三件事——Situation： Agent 调用外部工具（数据库查询、API 调用等）时可能失败：接口不可用、参数错误、权限不足、数据不存在等；Task：设计工具调用失败的处理策略，保证 Agent 的鲁棒性；Action： ##</p><p>Result：工具调用的端到端成功率从 92% 提升到 98%。 Agent 自主修正参数的成功率 78%。工具不可用时的用户体验保持在可接受水平（有降级回答）。</p><p>你也可以补充：本站题库「Tool Use 的常见模式：API 调用、数据库查询、代码执行」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q6</span><span class="guide-q-text">多 Agent 之间通信失败怎么处理？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：多 Agent 架构中，Agent 之间通过消息传递协作。如果某个 Agent 挂掉或响应超时，会影响整个任务链。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：确保多 Agent 系统的容错性和可靠性。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 通信超时控制：</strong></p>
<p>每个 Agent 调用设置超时：30s（默认），复杂任务 60s。超时后 Supervisor Agent 决定是否重试或跳过。</p>
<p class="guide-a-step"><strong>2. Agent 健康检查：</strong></p>
<p>每 10s 发送一次健康检查请求。连续 3 次健康检查失败 → 标记 Agent 为不可用。不可用的 Agent 不再接收新任务。</p>
<p class="guide-a-step"><strong>3. 任务重新分配：</strong></p>
<p>Agent 失败后，任务重新分配给同类型的备份 Agent。如果没有备份 Agent → 由 Supervisor Agent 尝试直接处理（降级）。</p>
<p class="guide-a-step"><strong>4. 消息持久化：</strong></p>
<p>Agent 间的消息通过 Redis Stream 传递（有持久化）。即使消费者 Agent 重启，未处理的消息不会丢失。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：单个 Agent 故障不影响整体系统可用性。任务重新分配延迟 &amp;lt; 5s。系统整体可用性 99.5%。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation：多 Agent 架构中，Agent 之间通过消息传递协作。如… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：确保多 Agent 系统的容错性和可靠性 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 通信超时控制：每个 Agent 调用设置超时：30s（默认），复杂任务 6… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. Agent 健康检查：每 10s 发送一次健康检查请求。连续 3 次健康检… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 3. 任务重新分配： Agent 失败后，任务重新分配给同类型的备份 Agent… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像项目组：Researcher 查资料、Writer 写稿、Reviewer 挑错——分工清楚比一个人包办更稳。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」（/custom/xiaolin-agent/patterns） — 要点：我理解 Agent 和 Workflow 最核心的区别是「谁来决定下一步」…</p><p>· 「说说 Single-Agent 和 Multi-Agent 的设计方案？」（/custom/xiaolin-agent/single_multi） — 要点：Single-Agent 适合任务流程清晰、复杂度适中的场景，实现简单、好维护；Multi-Agent 适合需要专业分工、任务量大或者需要并行执行的复杂场景…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…、说说 Single-Agent 和 Multi-Agent 的设计方案？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：说清要优化的目标指标</p><p>Action：我重点做了三件事——Situation：多 Agent 架构中，Agent 之间通过消息传递协作。如果某个 Agent 挂掉或响应超时，会影响整个任务链；Task：确保多 Agent 系统的容错性和可靠性；Action： ##</p><p>Result：单个 Agent 故障不影响整体系统可用性。任务重新分配延迟 &amp;lt; 5s。系统整体可用性 99.5%。</p><p>你也可以补充：本站题库「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q7</span><span class="guide-q-text">知识库数据不一致怎么处理？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：知识库中可能存在过时信息、矛盾信息（同一主题不同文档说法不一致）、或错误信息。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：检测和处理知识库中的数据不一致问题。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 时效性管理：</strong></p>
<p>每个文档/chunk 标记创建时间和更新时间。检索结果中，近期文档的排序权重更高。超过设定期限（如 1 年）的文档标记为"可能过时"。</p>
<p class="guide-a-step"><strong>2. 矛盾检测：</strong></p>
<p>当检索到多个相关 chunk 时，检查它们是否包含矛盾信息。检测方法：使用 NLI 模型判断两个文本片段是否矛盾。发现矛盾时：优先使用更新的文档，并在回答中说明存在不同说法。</p>
<p class="guide-a-step"><strong>3. 数据质量巡检：</strong></p>
<p>每周自动巡检：检查文档的可用性（链接是否有效、格式是否正常）。每月人工审核：随机抽查 50 份文档，验证内容准确性。</p>
<p class="guide-a-step"><strong>4. 用户反馈闭环：</strong></p>
<p>用户标记"回答错误"时，自动触发人工审核。审核结果反馈到知识库（修正或标注）。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：过时信息的误导率降低 70%。矛盾信息的检测覆盖率 80%。知识库数据质量评分从 3.6 提升到 4.2（满分 5 分）。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation：知识库中可能存在过时信息、矛盾信息（同一主题不同文档说法不一… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：检测和处理知识库中的数据不一致问题 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 时效性管理：每个文档/chunk 标记创建时间和更新时间。检索结果中，近期… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 矛盾检测：当检索到多个相关 chunk 时，检查它们是否包含矛盾信息。检测… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 3. 数据质量巡检：每周自动巡检：检查文档的可用性（链接是否有效、格式是否正常）… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「任务分解（Task Decomposition）的基本方法」（/custom/ai100-planning/050-task-decomposition） — 要点：任务分解是将复杂目标拆分为更小、可执行的子任务的过程，是 Agent 规划能力的基础。主要方法包括：**LLM 驱动分解**（用 Prompt 让 LLM 自行拆分任务，最灵活但可能不稳定）、**程序…</p><p>· 「LLM-as-Judge：使用 LLM 评估 LLM 输出」（/custom/ai100-evaluation/071-llm-as-judge） — 要点：LLM-as-Judge 是用一个强大的 LLM（如 GPT-4）自动评估另一个 LLM 输出质量的技术，在成本和质量之间取得了最佳平衡。两种核心模式：**Pointwise 评分**（对单个输出按维…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：任务分解（Task Decomposition）的基本方法、LLM-as-Judge：使用 LLM 评估 LLM 输出。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：知识库中可能存在过时信息、矛盾信息（同一主题不同文档说法不一致）、或错误信息。</p><p>Task：检测和处理知识库中的数据不一致问题。</p><p>Action：我重点做了三件事——Situation：知识库中可能存在过时信息、矛盾信息（同一主题不同文档说法不一致）、或错误信息；Task：检测和处理知识库中的数据不一致问题；Action： ##</p><p>Result：过时信息的误导率降低 70%。矛盾信息的检测覆盖率 80%。知识库数据质量评分从 3.6 提升到 4.2（满分 5 分）。</p><p>你也可以补充：本站题库「任务分解（Task Decomposition）的基本方法」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q8</span><span class="guide-q-text">高并发下的限流降级策略是什么？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：突发流量（如营销活动、批量查询）可能导致系统过载，需要保护核心服务不被打垮。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：设计分级限流和优雅降级策略。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 限流层次：</strong></p>
<p>API 网关层： 全局限流（总 QPS 上限 500）。租户级限流： 每个租户有独立的 QPS 配额（如 50 QPS）。用户级限流： 每个用户每分钟最多 20 次请求。</p>
<p class="guide-a-step"><strong>2. 限流算法：</strong></p>
<p>使用 Redis + 令牌桶算法（Token Bucket）。支持突发流量（桶容量 = 2倍的 QPS 配额）。</p>
<p class="guide-a-step"><strong>3. 降级策略（分四个等级）：</strong></p>
<p>L0（正常）：所有功能正常运行L1（轻微）：关闭非核心功能（如推荐、个性化）L2（中度）：模型降级（复杂查询也走快速模型）L3（严重）：只返回缓存和FAQ回答，不调用LLM</p>
<p class="guide-a-step"><strong>4. 自动降级触发条件：</strong></p>
<p>QPS &gt; 阈值的 80% → L1。LLM API 错误率 &gt; 10% → L2。系统 CPU &gt; 90% 或内存 &gt; 85% → L3。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：在 5 倍突发流量下，核心功能仍然可用。降级响应延迟 &amp;lt; 200ms（缓存/FAQ）。零系统崩溃事故。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】定义题考你能不能「用类比 + 结构」讲清楚，而不是堆术语。面试官想确认你真的理解，而不是背过。</p><p>【拆开理解】</p><p>1. Situation：突发流量（如营销活动、批量查询）可能导致系统过载，需要保护核… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：设计分级限流和优雅降级策略 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 限流层次： API 网关层：全局限流（总 QPS 上限 500）。租户级限… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 限流算法：使用 Redis + 令牌桶算法（Token Bucket）。支… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 3. 降级策略（分四个等级）： L0（正常）：所有功能正常运行 L1（轻微）：关… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】可以把 Agent 想成「会自己查资料、记笔记、调系统的数字员工」，比普通 ChatBot 多了闭环和多步决策。</p><p>【常见误区】</p><p>1. 只背一句定义，没有说「和普通 LLM 单次调用差在哪」。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「LLM-as-Judge：使用 LLM 评估 LLM 输出」（/custom/ai100-evaluation/071-llm-as-judge） — 要点：LLM-as-Judge 是用一个强大的 LLM（如 GPT-4）自动评估另一个 LLM 输出质量的技术，在成本和质量之间取得了最佳平衡。两种核心模式：**Pointwise 评分**（对单个输出按维…</p><p>· 「3. AI 编程工具的 Token 成本怎么控制？」（/custom/kama-ai-coding/vibe_coding_interview-q3） — 要点：这个问题面试官越来越爱问，因为这是团队用 AI 编程最实际的问题…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：LLM-as-Judge：使用 LLM 评估 LLM 输出、3. AI 编程工具的 Token 成本怎么控制？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：突发流量（如营销活动、批量查询）可能导致系统过载，需要保护核心服务不被打垮。</p><p>Task：设计分级限流和优雅降级策略。</p><p>Action：我重点做了三件事——Situation：突发流量（如营销活动、批量查询）可能导致系统过载，需要保护核心服务不被打垮；Task：设计分级限流和优雅降级策略；Action： ##</p><p>Result：在 5 倍突发流量下，核心功能仍然可用。降级响应延迟 &amp;lt; 200ms（缓存/FAQ）。零系统崩溃事故。</p><p>你也可以补充：本站题库「LLM-as-Judge：使用 LLM 评估 LLM 输出」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q9</span><span class="guide-q-text">数据丢失和恢复策略是什么？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：关键数据（对话历史、知识库索引、用户偏好等）的丢失会严重影响服务质量。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：建立完善的数据备份和恢复机制。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 数据分级：</strong></p>
<p>核心数据（RPO=0）： 知识库原始文档、用户配置 → 实时同步备份。重要数据（RPO&amp;lt;1h）： 对话历史、向量索引 → 每小时增量备份。可重建数据（RPO&amp;lt;24h）： 缓存数据、统计报表 → 每日备份。</p>
<p class="guide-a-step"><strong>2. 备份策略：</strong></p>
<p>PostgreSQL：流式复制（主从同步）+ 每日全量备份 + WAL 归档。Milvus：定期 snapshot + 原始文档可重建索引。Redis：RDB 快照（每小时）+ AOF 持久化。</p>
<p class="guide-a-step"><strong>3. 恢复演练：</strong></p>
<p>每季度做一次灾难恢复演练。模拟场景：数据库主节点故障、向量库数据损坏、Redis 全部清空。记录恢复时间（RTO），确保满足 SLA 要求。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：核心数据零丢失（RPO=0，主从同步）。数据库故障恢复时间 &amp;lt; 5 分钟（主从切换）。向量库重建时间：约 6 小时（从原始文档重新计算 embedding）。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】定义题考你能不能「用类比 + 结构」讲清楚，而不是堆术语。面试官想确认你真的理解，而不是背过。</p><p>【拆开理解】</p><p>1. Situation：关键数据（对话历史、知识库索引、用户偏好等）的丢失会严重影响… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：建立完善的数据备份和恢复机制 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 数据分级：核心数据（RPO=0）：知识库原始文档、用户配置→实时同步备份。… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 备份策略： PostgreSQL：流式复制（主从同步）+ 每日全量备份 +… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. Milvus：定期 snapshot + 原始文档可重建索引 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只背一句定义，没有说「和普通 LLM 单次调用差在哪」。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「任务分解（Task Decomposition）的基本方法」（/custom/ai100-planning/050-task-decomposition） — 要点：任务分解是将复杂目标拆分为更小、可执行的子任务的过程，是 Agent 规划能力的基础。主要方法包括：**LLM 驱动分解**（用 Prompt 让 LLM 自行拆分任务，最灵活但可能不稳定）、**程序…</p><p>· 「4. 向量数据库怎么选？Milvus、FAISS、Qdrant 各自适合什么场景？」（/custom/kama-rag/rag_interview-q4） — 要点：面试官会问：&amp;quot;你们项目用的什么向量数据库…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：任务分解（Task Decomposition）的基本方法、4. 向量数据库怎么选？Milvus、FAISS、Qdrant 各自适合什么场景？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：关键数据（对话历史、知识库索引、用户偏好等）的丢失会严重影响服务质量。</p><p>Task：建立完善的数据备份和恢复机制。</p><p>Action：我重点做了三件事——Situation：关键数据（对话历史、知识库索引、用户偏好等）的丢失会严重影响服务质量；Task：建立完善的数据备份和恢复机制；Action： ##</p><p>Result：核心数据零丢失（RPO=0，主从同步）。数据库故障恢复时间 &amp;lt; 5 分钟（主从切换）。向量库重建时间：约 6 小时（从原始文档重新计算 embedding）。</p><p>你也可以补充：本站题库「任务分解（Task Decomposition）的基本方法」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q10</span><span class="guide-q-text">模型输出格式异常怎么处理？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：LLM 有时不按预期格式输出（如应输出 JSON 但输出了纯文本，或 ReAct 格式解析失败）。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：建立鲁棒的输出解析和纠正机制。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 多层解析策略：</strong></p>
<p>严格正则解析 → 宽松正则解析 → LLM 重格式化 → 降级处理</p>
<p class="guide-a-step"><strong>2. 具体实现：</strong></p>
<p>第一层（严格正则）： 标准格式匹配（如 Thought:(.*)Action:(.*) ）。第二层（宽松正则）： 忽略大小写、多余空格等微小差异。第三层（LLM 修复）： 用轻量模型将非标格式输出修复为标准格式。第四层（降级）： 将整个输出作为 Final Answer 直接返回。</p>
<p class="guide-a-step"><strong>3. 预防措施：</strong></p>
<p>在 Prompt 中强调格式要求，提供明确示例。使用 OpenAI 的 response_format（JSON mode）强制 JSON 输出。对于 Claude，使用 tool_use 模式替代纯文本 Prompt 来获取结构化输出。</p>
<p class="guide-a-step"><strong>4. 监控告警：</strong></p>
<p>记录每次解析失败的事件和原因。格式遵循率 &amp;lt; 90% 时触发告警，检查 Prompt 是否需要优化。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：格式解析成功率从 82% 提升到 98%。LLM 修复层兜底了约 5% 的解析失败。用户感知的格式异常从 8% 降低到 0.5%。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation： LLM 有时不按预期格式输出（如应输出 JSON 但输出了… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：建立鲁棒的输出解析和纠正机制 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 多层解析策略：严格正则解析→宽松正则解析→ LLM 重格式化→降级处理 #… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 具体实现：第一层（严格正则）：标准格式匹配（如 Thought:(.*)A… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 3. 预防措施：在 Prompt 中强调格式要求，提供明确示例。使用 OpenA… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像侦探办案：先推理（Thought），再行动查线索（Action），看结果（Observation），循环直到破案。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 把 ReAct 说成「想一步做一步」但说不清 Observation 从哪来、何时停止。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「结构化输出（Structured Output）：如何让 LLM 返回 JSON/X…」（/custom/ai100-prompt/061-structured-output） — 要点：结构化输出是让 LLM 返回机器可解析格式（JSON、XML 等）而非自由文本的技术，是 Agent 系统和数据管道的基础能力。主要实现方法有四种：(1) **Prompt 指令**——在 Promp…</p><p>· 「Prompt Chaining：多步骤 Prompt 的设计与编排」（/custom/ai100-prompt/063-prompt-chaining） — 要点：Prompt Chaining（提示链）是将复杂任务分解为多个顺序执行的 LLM 调用，每个调用的输出作为下一个调用的输入。它是 Agentic AI 中最基础的设计模式，也被称为 Pipeline …</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 架构：步数上限、停止条件、死循环检测、Plan+ReAct 混合、画拓扑图。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：结构化输出（Structured Output）：如何让 LLM 返回 JSON/X…、Prompt Chaining：多步骤 Prompt 的设计与编排。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：建立鲁棒的输出解析和纠正机制。</p><p>Action：我重点做了三件事——Situation： LLM 有时不按预期格式输出（如应输出 JSON 但输出了纯文本，或 ReAct 格式解析失败）；Task：建立鲁棒的输出解析和纠正机制；Action： ##</p><p>Result：格式解析成功率从 82% 提升到 98%。 LLM 修复层兜底了约 5% 的解析失败。用户感知的格式异常从 8% 降低到 0.5%。</p><p>你也可以补充：本站题库「结构化输出（Structured Output）：如何让 LLM 返回 JSON/X…」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q11</span><span class="guide-q-text">敏感信息泄露怎么防止？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：Agent 在处理用户请求时，可能接触到敏感信息（个人隐私、商业机密），需要防止信息通过 LLM 泄露。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：建立敏感信息的全生命周期防护机制。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 输入脱敏：</strong></p>
<p>使用正则 + NER 模型识别敏感信息：手机号、身份证号、银行卡号、邮箱、地址等。替换为占位符： [手机号_1] 、 [身份证号_1] 。脱敏映射表存储在临时内存中（会话结束后清除）。</p>
<p class="guide-a-step"><strong>2. 输出还原：</strong></p>
<p>LLM 回答中的占位符在返回前还原为原始值。只还原用户有权查看的信息。</p>
<p class="guide-a-step"><strong>3. LLM 不可信原则：</strong></p>
<p>假设 LLM 可能记忆训练数据中的信息 → 敏感数据绝不发送给 LLM。系统间通信使用加密传输（TLS 1.3）。</p>
<p class="guide-a-step"><strong>4. 日志安全：</strong></p>
<p>对话日志中的敏感信息自动脱敏后再存储。日志访问权限严格控制（最小权限原则）。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：敏感信息防护覆盖率 99.5%。零信息泄露事故。通过了等保三级评审。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation： Agent 在处理用户请求时，可能接触到敏感信息（个人隐私… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：建立敏感信息的全生命周期防护机制 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 输入脱敏：使用正则 + NER 模型识别敏感信息：手机号、身份证号、银行卡… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 输出还原： LLM 回答中的占位符在返回前还原为原始值。只还原用户有权查看… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 3. LLM 不可信原则：假设 LLM 可能记忆训练数据中的信息→敏感数据绝不发… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像员工的笔记本 + 公司 Wiki：笔记本记当前任务，Wiki 记长期规则和客户档案。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」（/custom/xiaolin-agent/patterns） — 要点：我理解 Agent 和 Workflow 最核心的区别是「谁来决定下一步」…</p><p>· 「说说 Single-Agent 和 Multi-Agent 的设计方案？」（/custom/xiaolin-agent/single_multi） — 要点：Single-Agent 适合任务流程清晰、复杂度适中的场景，实现简单、好维护；Multi-Agent 适合需要专业分工、任务量大或者需要并行执行的复杂场景…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 记忆：事实 vs 推断分开存、写入时机、冲突合并、跨会话权限。</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…、说说 Single-Agent 和 Multi-Agent 的设计方案？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：建立敏感信息的全生命周期防护机制。</p><p>Action：我重点做了三件事——Situation： Agent 在处理用户请求时，可能接触到敏感信息（个人隐私、商业机密），需要防止信息通过 LLM 泄露；Task：建立敏感信息的全生命周期防护机制；Action： ##</p><p>Result：敏感信息防护覆盖率 99.5%。零信息泄露事故。通过了等保三级评审。</p><p>你也可以补充：本站题库「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q12</span><span class="guide-q-text">系统容量规划是怎么做的？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：需要预估系统未来的资源需求，提前规划容量，避免资源不足或过度浪费。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：建立系统容量规划方法论。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 容量模型：</strong></p>
<p>所需 Pod 数 = 峰值 QPS / (单 Pod QPS × 0.7)# 0.7 是安全系数，留 30% 余量</p>
<p class="guide-a-step"><strong>2. 关键资源评估：</strong></p>
<p>API Pod： 每 Pod 处理 25 QPS，峰值 200 QPS → 需要 12 Pod（冗余）。Milvus： 1000 万向量约需 48GB 内存，3 节点每节点 16GB。Redis： 缓存约 10GB，会话状态约 5GB → 16GB 集群。PostgreSQL： 对话记录约 500GB/年 → 提前规划存储扩展。</p>
<p class="guide-a-step"><strong>3. 增长预测：</strong></p>
<p>基于历史数据线性回归，预测未来 3-6 个月的增长。每季度评审一次容量规划，调整资源配置。</p>
<p class="guide-a-step"><strong>4. 成本优化：</strong></p>
<p>使用预留实例降低云服务成本（降低 30-40%）。非高峰时段自动缩容节省资源。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：系统在业务增长 300% 时平滑扩容，无服务中断。资源利用率保持在 60-80%（既不浪费也有余量）。月度基础设施成本控制在预算范围内。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation：需要预估系统未来的资源需求，提前规划容量，避免资源不足或过度… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：建立系统容量规划方法论 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 容量模型：所需 Pod 数 = 峰值 QPS / (单 Pod QPS × → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 0.7 是安全系数，留 30% 余量 ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 2. 关键资源评估： API Pod：每 Pod 处理 25 QPS，峰值 20… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>3. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「LLM-as-Judge：使用 LLM 评估 LLM 输出」（/custom/ai100-evaluation/071-llm-as-judge） — 要点：LLM-as-Judge 是用一个强大的 LLM（如 GPT-4）自动评估另一个 LLM 输出质量的技术，在成本和质量之间取得了最佳平衡。两种核心模式：**Pointwise 评分**（对单个输出按维…</p><p>· 「4. 向量数据库怎么选？Milvus、FAISS、Qdrant 各自适合什么场景？」（/custom/kama-rag/rag_interview-q4） — 要点：面试官会问：&amp;quot;你们项目用的什么向量数据库…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：LLM-as-Judge：使用 LLM 评估 LLM 输出、4. 向量数据库怎么选？Milvus、FAISS、Qdrant 各自适合什么场景？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：需要预估系统未来的资源需求，提前规划容量，避免资源不足或过度浪费。</p><p>Task：建立系统容量规划方法论。</p><p>Action：我重点做了三件事——Situation：需要预估系统未来的资源需求，提前规划容量，避免资源不足或过度浪费；Task：建立系统容量规划方法论；Action： ##</p><p>Result：系统在业务增长 300% 时平滑扩容，无服务中断。资源利用率保持在 60-80%（既不浪费也有余量）。月度基础设施成本控制在预算范围内。</p><p>你也可以补充：本站题库「LLM-as-Judge：使用 LLM 评估 LLM 输出」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

第五类：工程质量类问题

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q1</span><span class="guide-q-text">怎么做的测试？覆盖率多少？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：AI Agent 系统的测试比传统软件更复杂：LLM 输出不确定、工具调用涉及外部服务、端到端流程长。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：建立多层次的测试体系，确保系统质量。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 测试金字塔：</strong></p>
<p>测试（10%）：完整的用户交互流程E2E集成测试（30%）：组件间的交互测试单元测试（60%）：单个函数/类的测试</p>
<p class="guide-a-step"><strong>2. 单元测试（覆盖率 85%）：</strong></p>
<p>工具函数、数据处理、格式解析等确定性逻辑。Mock LLM 调用，使用固定的输入输出对测试。框架：pytest + pytest-asyncio。</p>
<p class="guide-a-step"><strong>3. 集成测试：</strong></p>
<p>检索管道测试：给定 query，验证检索结果的相关性。工具调用测试：验证 Function Calling 的参数传递和结果解析。使用 testcontainers 启动 Milvus、Redis 等依赖服务。</p>
<p class="guide-a-step"><strong>4. 评估测试（AI 特有）：</strong></p>
<p>建立评估数据集（500+ 条标注的 query-answer 对）。自动化指标评估：检索：Recall@10、Precision@5、NDCG@5生成：BERTScore、ROUGE-L、人工评分端到端：任务完成率、用户满意度使用 RAGAS 框架做 RAG 管道评估。在 CI 中每次提交自动跑评估，防止回归。</p>
<p class="guide-a-step"><strong>5. 压力测试：</strong></p>
<p>每月一次全面压测（详见架构类 Q9）。每次重大变更后做回归压测。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：单元测试覆盖率 85%，核心模块 95%。评估测试在 CI 中 100% 自动化运行。上线后的严重 bug 数量降低 70%。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation： AI Agent 系统的测试比传统软件更复杂：LLM 输出… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：建立多层次的测试体系，确保系统质量 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 测试金字塔：测试（10%）：完整的用户交互流程 E2E 集成测试（30%）… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 单元测试（覆盖率 85%）：工具函数、数据处理、格式解析等确定性逻辑 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. Mock LLM 调用，使用固定的输入输出对测试。框架：pytest + pyt… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>3. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Function Calling 工具设计最佳实践」（/custom/today-interview/function-calling-design） — 要点：每个工具只做一件事、参数少而精、description 包含正例和反例、error 返回结构化而非纯文本——定义好，模型才可能调对。…</p><p>· 「4. Function Call 是什么？底层怎么实现？」（/custom/kama-agent/agent_interview-q4） — 要点：面试官会问：&amp;quot;Function Call 和普通的 Prompt + 正则解析有什么区别…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：Function Calling 工具设计最佳实践、4. Function Call 是什么？底层怎么实现？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：建立多层次的测试体系，确保系统质量。</p><p>Action：我重点做了三件事——Situation： AI Agent 系统的测试比传统软件更复杂：LLM 输出不确定、工具调用涉及外部服务、端到端流程长；Task：建立多层次的测试体系，确保系统质量；Action： ##</p><p>Result：单元测试覆盖率 85%，核心模块 95%。评估测试在 CI 中 100% 自动化运行。上线后的严重 bug 数量降低 70%。</p><p>你也可以补充：本站题库「Function Calling 工具设计最佳实践」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q2</span><span class="guide-q-text">怎么做的监控和告警？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：AI Agent 系统在生产环境中需要全方位监控：不仅是传统的系统指标，还包括 AI 特有的指标（幻觉率、工具调用成功率等）。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：建立涵盖系统、业务、AI 三个维度的监控告警体系。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 监控维度：</strong></p>
<p>系统层：CPU、内存、磁盘、网络 I/O。Pod 状态、容器重启次数。数据库连接数、查询延迟。业务层：QPS、P50/P95/P99 延迟。错误率、超时率。用户活跃数、对话轮次分布。AI 层（特有）：LLM 调用延迟和成功率。Token 消耗趋势。检索命中率和 rerank 分数分布。幻觉率（基于 NLI 检测）。Agent 迭代次数分布（检测死循环趋势）。工具调用成功率和延迟。</p>
<p class="guide-a-step"><strong>2. 监控工具栈：</strong></p>
<p>指标收集：Prometheus可视化：Grafana（定制了 AI Agent 专属 Dashboard）日志：ELK Stack（Elasticsearch + Logstash + Kibana）链路追踪：JaegerAI 追踪：LangFuse（记录每次 LLM 调用的输入输出）</p>
<p class="guide-a-step"><strong>3. 告警规则：</strong></p>
<p>| 指标 | 告警阈值 | 级别 | 通知方式 || --- | --- | --- | --- || P99 延迟 | &gt; 10s | P1 | 电话 + 钉钉 || 错误率 | &gt; 5% | P1 | 电话 + 钉钉 || 幻觉率 | &gt; 5% | P2 | 钉钉 |Token 日消耗          &gt; 200万         P3        邮件检索命中率              &amp;lt; 70%          P2        钉钉</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：问题发现时间从"用户投诉后"提前到"问题发生后 3 分钟"。监控覆盖率 100%（所有核心链路都有指标）。月均误报率 &amp;lt; 5%（告警阈值经过多次调优）。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation： AI Agent 系统在生产环境中需要全方位监控：不仅是传… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：建立涵盖系统、业务、AI 三个维度的监控告警体系 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 监控维度：系统层： CPU、内存、磁盘、网络 I/O → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. Pod 状态、容器重启次数。数据库连接数、查询延迟。业务层： QPS、P50/P… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. AI 层（特有）： LLM 调用延迟和成功率 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>3. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「如何防止 Agent 死循环浪费 Token」（/custom/today-interview/agent-infinite-loop） — 要点：硬上限 + 重复检测 + 无进展熔断三道保险；到线就停、状态可恢复；宁可早停可重试，也不烧 token 空转。…</p><p>· 「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」（/custom/xiaolin-agent/patterns） — 要点：我理解 Agent 和 Workflow 最核心的区别是「谁来决定下一步」…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：如何防止 Agent 死循环浪费 Token、了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：说清要优化的目标指标</p><p>Action：我重点做了三件事——Situation： AI Agent 系统在生产环境中需要全方位监控：不仅是传统的系统指标，还包括 AI 特有的指标（幻觉率、工具调用成功率等）；Task：建立涵盖系统、业务、AI 三个维度的监控告警体系；Action： ##</p><p>Result：问题发现时间从"用户投诉后"提前到"问题发生后 3 分钟"。监控覆盖率 100%（所有核心链路都有指标）。月均误报率 &amp;lt; 5%（告警阈值经过多次调优）。</p><p>你也可以补充：本站题库「如何防止 Agent 死循环浪费 Token」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q3</span><span class="guide-q-text">怎么部署的？CI/CD 是什么流程？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：系统需要频繁迭代（每周 1-2 次发版），需要可靠的 CI/CD 流程保障发布质量。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：建立自动化的 CI/CD 流水线，确保快速、安全的发布。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. CI 流水线（代码合入前）：</strong></p>
<p>代码提交 → 代码扫描（lint + type check）→ 单元测试 → 集成测试→ AI 评估测试 → 安全扫描 → 构建 Docker 镜像 → 推送镜像仓库全部通过后才允许合入主分支。CI 时间目标：&amp;lt; 15 分钟。</p>
<p class="guide-a-step"><strong>2. CD 流水线（发布流程）：</strong></p>
<p>主分支合入 → 自动部署到 Staging → 冒烟测试 → 人工验证→ 灰度发布（10% → 50% → 100%）→ 全量部署灰度发布使用 Kubernetes 的金丝雀部署策略。每个阶段观察 30 分钟，无异常后进入下一阶段。</p>
<p class="guide-a-step"><strong>3. 回滚机制：</strong></p>
<p>保留最近 5 个版本的 Docker 镜像。一键回滚： kubectl rollout undo deployment/agent-api 。灰度期间发现问题自动回滚。</p>
<p class="guide-a-step"><strong>4. 环境管理：</strong></p>
<p>Dev → Staging → Production 三个环境。使用 Helm Chart 管理 Kubernetes 部署配置。环境配置通过 ConfigMap 和 Secret 管理。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：发布频率从月到周。发布成功率 98%（2% 的发布在灰度阶段被回滚）。回滚时间 &amp;lt; 3 分钟。零因发布导致的线上事故。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】定义题考你能不能「用类比 + 结构」讲清楚，而不是堆术语。面试官想确认你真的理解，而不是背过。</p><p>【拆开理解】</p><p>1. Situation：系统需要频繁迭代（每周 1-2 次发版），需要可靠的 CI/… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：建立自动化的 CI/CD 流水线，确保快速、安全的发布 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. CI 流水线（代码合入前）：代码提交→代码扫描（lint + type c… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. CI 时间目标：&amp;lt → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 2. CD 流水线（发布流程）：主分支合入→自动部署到 Staging →冒烟测… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像侦探办案：先推理（Thought），再行动查线索（Action），看结果（Observation），循环直到破案。</p><p>【常见误区】</p><p>1. 只背一句定义，没有说「和普通 LLM 单次调用差在哪」。</p><p>2. 把 ReAct 说成「想一步做一步」但说不清 Observation 从哪来、何时停止。</p><p>3. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「LLM-as-Judge：使用 LLM 评估 LLM 输出」（/custom/ai100-evaluation/071-llm-as-judge） — 要点：LLM-as-Judge 是用一个强大的 LLM（如 GPT-4）自动评估另一个 LLM 输出质量的技术，在成本和质量之间取得了最佳平衡。两种核心模式：**Pointwise 评分**（对单个输出按维…</p><p>· 「任务分解（Task Decomposition）的基本方法」（/custom/ai100-planning/050-task-decomposition） — 要点：任务分解是将复杂目标拆分为更小、可执行的子任务的过程，是 Agent 规划能力的基础。主要方法包括：**LLM 驱动分解**（用 Prompt 让 LLM 自行拆分任务，最灵活但可能不稳定）、**程序…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 架构：步数上限、停止条件、死循环检测、Plan+ReAct 混合、画拓扑图。</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：LLM-as-Judge：使用 LLM 评估 LLM 输出、任务分解（Task Decomposition）的基本方法。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：系统需要频繁迭代（每周 1-2 次发版），需要可靠的 CI/CD 流程保障发布质量。</p><p>Task：建立自动化的 CI/CD 流水线，确保快速、安全的发布。</p><p>Action：我重点做了三件事——Situation：系统需要频繁迭代（每周 1-2 次发版），需要可靠的 CI/CD 流程保障发布质量；Task：建立自动化的 CI/CD 流水线，确保快速、安全的发布；Action： ##</p><p>Result：发布频率从月到周。发布成功率 98%（2% 的发布在灰度阶段被回滚）。回滚时间 &amp;lt; 3 分钟。零因发布导致的线上事故。</p><p>你也可以补充：本站题库「LLM-as-Judge：使用 LLM 评估 LLM 输出」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q4</span><span class="guide-q-text">日志系统怎么设计的？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>（详见技术实现类 Q13，此处补充工程视角）</p>
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：AI Agent 系统的日志需求特殊：不仅要记录请求/响应，还要记录 Agent 的完整推理过程（Thought → Action → Observation 链路）。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：设计满足调试、审计、分析多重需求的日志系统。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 日志分类：</strong></p>
<p>请求日志： 每个用户请求的概要信息。推理日志： Agent 的完整推理链（包含 Prompt 和 LLM 输出）。工具日志： 工具调用的参数和返回值。审计日志： 安全相关的操作（登录、权限变更等）。</p>
<p class="guide-a-step"><strong>2. 日志存储策略：</strong></p>
<p>热数据（7天）：Elasticsearch，支持全文检索。温数据（30天）：压缩后存储在对象存储。冷数据（1年）：归档到低成本存储。</p>
<p class="guide-a-step"><strong>3. 推理日志的特殊处理：</strong></p>
<p>推理日志可能包含大量 Prompt 文本，每条可达数 KB。生产环境默认只记录摘要版本（去掉 Prompt 全文）。需要时可以动态开启详细日志（用于调试）。</p>
<p class="guide-a-step"><strong>4. 隐私保护：</strong></p>
<p>所有日志经过脱敏处理后再存储。推理日志中用户的原始输入做 PII 脱敏。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：日志系统支撑了 100% 的问题排查需求。日志存储成本通过分层策略降低 60%。日志查询延迟：热数据 &amp;lt; 1s，温数据 &amp;lt; 10s。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. （详见技术实现类 Q13，此处补充工程视角） Situation： AI Age… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：设计满足调试、审计、分析多重需求的日志系统 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 日志分类：请求日志：每个用户请求的概要信息。推理日志： Agent 的完整… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 日志存储策略：热数据（7天）：Elasticsearch，支持全文检索。温… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 3. 推理日志的特殊处理：推理日志可能包含大量 Prompt 文本，每条可达数 … → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>3. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>4. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Prompt Chaining：多步骤 Prompt 的设计与编排」（/custom/ai100-prompt/063-prompt-chaining） — 要点：Prompt Chaining（提示链）是将复杂任务分解为多个顺序执行的 LLM 调用，每个调用的输出作为下一个调用的输入。它是 Agentic AI 中最基础的设计模式，也被称为 Pipeline …</p><p>· 「跨模型 Prompt 迁移：如何编写模型无关的 Prompt？」（/custom/ai100-prompt/068-cross-model-prompt-portability） — 要点：跨模型 Prompt 迁移（Cross-Model Prompt Portability）是指让同一个 Prompt 在不同 LLM（GPT-4、Claude、Gemini、Llama 等）上都能有效…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：Prompt Chaining：多步骤 Prompt 的设计与编排、跨模型 Prompt 迁移：如何编写模型无关的 Prompt？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：设计满足调试、审计、分析多重需求的日志系统。</p><p>Action：我重点做了三件事——（详见技术实现类 Q13，此处补充工程视角） Situation： AI Agent 系统的日志需求特殊：不仅要记录请求/响应，还要记录 Agent 的完整推理过程（Thought → Action → Observation 链路）；Task：设计满足调试、审计、分析多重需求的日志系统；Action： ##</p><p>Result：日志系统支撑了 100% 的问题排查需求。日志存储成本通过分层策略降低 60%。日志查询延迟：热数据 &amp;lt; 1s，温数据 &amp;lt; 10s。</p><p>你也可以补充：本站题库「Prompt Chaining：多步骤 Prompt 的设计与编排」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q5</span><span class="guide-q-text">安全性怎么保证的？（Prompt 注入等）</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>（详见架构类 Q14，此处从工程实践角度补充）</p>
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：AI Agent 系统面临的安全威胁不断演化，需要持续更新防护策略。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：建立安全防护的持续迭代机制。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 安全测试常态化：</strong></p>
<p>维护一个 Prompt 注入攻击样本库（500+ 样本），定期更新。每次发版前跑安全测试，确保不引入新的漏洞。每季度做一次红蓝对抗（安全团队模拟攻击）。</p>
<p class="guide-a-step"><strong>2. 安全更新流程：</strong></p>
<p>关注 OWASP LLM Top 10 等安全指南的更新。监控社区报告的新型攻击模式。新攻击模式发现后 48 小时内更新防护规则。</p>
<p class="guide-a-step"><strong>3. 安全编码规范：</strong></p>
<p>用户输入永远不信任，必须经过清洗和校验。System Prompt 和用户输入严格分离（使用不同的 message role）。工具调用的参数必须做白名单验证。</p>
<p class="guide-a-step"><strong>4. 应急响应：</strong></p>
<p>制定安全事件应急预案。发现 Prompt 注入绕过时，可以在 10 分钟内紧急上线新的拦截规则（通过配置热更新）。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：无安全事件（0 次成功的注入攻击）。安全规则更新平均时间 &amp;lt; 4 小时。通过了外部安全审计。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. （详见架构类 Q14，此处从工程实践角度补充） Situation： AI Ag… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：建立安全防护的持续迭代机制 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 安全测试常态化：维护一个 Prompt 注入攻击样本库（500+ 样本），… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 安全更新流程：关注 OWASP LLM Top 10 等安全指南的更新。监… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 3. 安全编码规范：用户输入永远不信任，必须经过清洗和校验 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像给员工配电脑和系统账号：没有工具只能动嘴，有了工具才能查库存、下单、跑代码。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>3. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「System Prompt 设计的核心原则」（/custom/ai100-prompt/059-system-prompt-principles） — 要点：System Prompt 是 LLM 应用的"宪法"——定义模型的身份、行为边界和输出规范，是模型看到用户输入之前的指令框架。核心设计原则包括：(1) **角色定义**——明确模型是谁、擅长什么、不…</p><p>· 「Prompt Chaining：多步骤 Prompt 的设计与编排」（/custom/ai100-prompt/063-prompt-chaining） — 要点：Prompt Chaining（提示链）是将复杂任务分解为多个顺序执行的 LLM 调用，每个调用的输出作为下一个调用的输入。它是 Agentic AI 中最基础的设计模式，也被称为 Pipeline …</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：System Prompt 设计的核心原则、Prompt Chaining：多步骤 Prompt 的设计与编排。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：建立安全防护的持续迭代机制。</p><p>Action：我重点做了三件事——（详见架构类 Q14，此处从工程实践角度补充） Situation： AI Agent 系统面临的安全威胁不断演化，需要持续更新防护策略；Task：建立安全防护的持续迭代机制；Action： ##</p><p>Result：无安全事件（0 次成功的注入攻击）。安全规则更新平均时间 &amp;lt; 4 小时。通过了外部安全审计。</p><p>你也可以补充：本站题库「System Prompt 设计的核心原则」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q6</span><span class="guide-q-text">代码质量是怎么保证的？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：AI Agent 项目涉及多个技术领域（LLM、检索、后端、DevOps），代码质量参差不齐。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：建立代码质量保障体系。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 代码规范：</strong></p>
<p>Python：遵循 PEP 8 + 内部补充规范。类型注解：所有函数参数和返回值必须有类型注解。使用 ruff（linter + formatter）统一代码风格。</p>
<p class="guide-a-step"><strong>2. 代码审查：</strong></p>
<p>所有 PR 必须至少 1 人 review。核心模块（编排器、安全模块）的 PR 需要 2 人 review。Review 重点：逻辑正确性、异常处理、性能影响、安全性。</p>
<p class="guide-a-step"><strong>3. 静态分析：</strong></p>
<p>mypy 类型检查（strict 模式）。bandit 安全扫描。圈复杂度限制（单函数 ≤ 10）。</p>
<p class="guide-a-step"><strong>4. 架构守护：</strong></p>
<p>模块依赖关系检查，防止循环依赖。接口版本管理，防止破坏性变更。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：代码审查覆盖率 100%。类型检查覆盖率 90%。线上 bug 密度降低 50%。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation： AI Agent 项目涉及多个技术领域（LLM、检索、后端… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：建立代码质量保障体系 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 代码规范： Python：遵循 PEP 8 + 内部补充规范。类型注解：所… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 代码审查：所有 PR 必须至少 1 人 review。核心模块（编排器、安… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. Review 重点：逻辑正确性、异常处理、性能影响、安全性 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>3. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」（/custom/xiaolin-agent/patterns） — 要点：我理解 Agent 和 Workflow 最核心的区别是「谁来决定下一步」…</p><p>· 「说说 Single-Agent 和 Multi-Agent 的设计方案？」（/custom/xiaolin-agent/single_multi） — 要点：Single-Agent 适合任务流程清晰、复杂度适中的场景，实现简单、好维护；Multi-Agent 适合需要专业分工、任务量大或者需要并行执行的复杂场景…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…、说说 Single-Agent 和 Multi-Agent 的设计方案？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：建立代码质量保障体系。</p><p>Action：我重点做了三件事——Situation： AI Agent 项目涉及多个技术领域（LLM、检索、后端、DevOps），代码质量参差不齐；Task：建立代码质量保障体系；Action： ##</p><p>Result：代码审查覆盖率 100%。类型检查覆盖率 90%。线上 bug 密度降低 50%。</p><p>你也可以补充：本站题库「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q7</span><span class="guide-q-text">文档是怎么维护的？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：AI Agent 项目知识密集，团队成员需要快速理解系统架构、API 接口、Prompt 模板等。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：建立完善的文档体系，降低团队协作和知识传递成本。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 文档类型：</strong></p>
<p>架构文档： 系统架构图、模块设计文档、技术决策记录（ADR）。API 文档： 自动生成（FastAPI 自带 Swagger）。运维手册： 部署指南、故障排查手册、应急预案。Prompt 文档： 所有 Prompt 模板的说明、版本历史、设计思路。</p>
<p class="guide-a-step"><strong>2. 文档即代码：</strong></p>
<p>文档和代码同仓库管理，随代码一起 review。ADR（Architecture Decision Records）记录每次重要的技术决策。</p>
<p class="guide-a-step"><strong>3. 自动化生成：</strong></p>
<p>API 文档：FastAPI 自动生成 OpenAPI Schema。类型文档：从类型注解自动生成 SDK 文档。监控文档：Dashboard 配置自动导出。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：新成员上手时间从 2 周缩短到 3 天。文档更新和代码提交同步率 &gt; 80%。ADR 积累了 30+ 份技术决策记录。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation： AI Agent 项目知识密集，团队成员需要快速理解系统架… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：建立完善的文档体系，降低团队协作和知识传递成本 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 文档类型：架构文档：系统架构图、模块设计文档、技术决策记录（ADR） → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. API 文档：自动生成（FastAPI 自带 Swagger）。运维手册：部署指… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. Prompt 文档：所有 Prompt 模板的说明、版本历史、设计思路 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像给员工配电脑和系统账号：没有工具只能动嘴，有了工具才能查库存、下单、跑代码。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Prompt Chaining：多步骤 Prompt 的设计与编排」（/custom/ai100-prompt/063-prompt-chaining） — 要点：Prompt Chaining（提示链）是将复杂任务分解为多个顺序执行的 LLM 调用，每个调用的输出作为下一个调用的输入。它是 Agentic AI 中最基础的设计模式，也被称为 Pipeline …</p><p>· 「跨模型 Prompt 迁移：如何编写模型无关的 Prompt？」（/custom/ai100-prompt/068-cross-model-prompt-portability） — 要点：跨模型 Prompt 迁移（Cross-Model Prompt Portability）是指让同一个 Prompt 在不同 LLM（GPT-4、Claude、Gemini、Llama 等）上都能有效…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：Prompt Chaining：多步骤 Prompt 的设计与编排、跨模型 Prompt 迁移：如何编写模型无关的 Prompt？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：建立完善的文档体系，降低团队协作和知识传递成本。</p><p>Action：我重点做了三件事——Situation： AI Agent 项目知识密集，团队成员需要快速理解系统架构、API 接口、Prompt 模板等；Task：建立完善的文档体系，降低团队协作和知识传递成本；Action： ##</p><p>Result：新成员上手时间从 2 周缩短到 3 天。文档更新和代码提交同步率 &gt; 80%。 ADR 积累了 30+ 份技术决策记录。</p><p>你也可以补充：本站题库「Prompt Chaining：多步骤 Prompt 的设计与编排」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q8</span><span class="guide-q-text">怎么做的版本管理和发布管理？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：系统有多个组件（API、Worker、MCP Server 等），需要协调版本发布。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：建立清晰的版本管理和发布策略。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 版本命名规范：</strong></p>
<p>语义化版本号： MAJOR.MINOR.PATCHMAJOR：不兼容的 API 变更MINOR：新功能（向后兼容）PATCH：Bug 修复</p>
<p class="guide-a-step"><strong>2. 分支策略：</strong></p>
<p>main ：生产分支，始终可发布。develop ：开发分支，集成最新功能。feature/* ：功能分支，完成后合入 develop。hotfix/* ：紧急修复，直接合入 main。</p>
<p class="guide-a-step"><strong>3. 发布流程：</strong></p>
<p>develop   冻结 → 创建 release 分支 → 集成测试 → 修复 bug→ 合入 main → 打 tag → 部署</p>
<p class="guide-a-step"><strong>4. 变更日志（Changelog）：</strong></p>
<p>每次发版自动从 commit message 生成 changelog。分类：Features、Bug Fixes、Performance、Breaking Changes。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：发版节奏：每周一次定期发版，紧急修复随时发。版本回溯清晰，任何版本都能快速复现。零因版本混乱导致的事故。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation：系统有多个组件（API、Worker、MCP Server … → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：建立清晰的版本管理和发布策略 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 版本命名规范：语义化版本号： MAJOR.MINOR.PATCH MAJO… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 分支策略： main ：生产分支，始终可发布 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. develop ：开发分支，集成最新功能 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像给员工配电脑和系统账号：没有工具只能动嘴，有了工具才能查库存、下单、跑代码。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「如何设计一个分层 Agent 架构（Orchestrator / Worker 模式…」（/custom/ai100-agent-arch/005-layered-agent-architecture） — 要点：分层 Agent 架构（Orchestrator-Worker 模式）是一种将复杂任务分解为"指挥"和"执行"两个层次的设计模式。Orchestrator（编排器）负责理解目标、分解任务、分配工作、综…</p><p>· 「任务分解（Task Decomposition）的基本方法」（/custom/ai100-planning/050-task-decomposition） — 要点：任务分解是将复杂目标拆分为更小、可执行的子任务的过程，是 Agent 规划能力的基础。主要方法包括：**LLM 驱动分解**（用 Prompt 让 LLM 自行拆分任务，最灵活但可能不稳定）、**程序…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：如何设计一个分层 Agent 架构（Orchestrator / Worker 模式…、任务分解（Task Decomposition）的基本方法。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：系统有多个组件（API、Worker、MCP Server 等），需要协调版本发布。</p><p>Task：建立清晰的版本管理和发布策略。</p><p>Action：我重点做了三件事——Situation：系统有多个组件（API、Worker、MCP Server 等），需要协调版本发布；Task：建立清晰的版本管理和发布策略；Action： ##</p><p>Result：发版节奏：每周一次定期发版，紧急修复随时发。版本回溯清晰，任何版本都能快速复现。零因版本混乱导致的事故。</p><p>你也可以补充：本站题库「如何设计一个分层 Agent 架构（Orchestrator / Worker 模式…」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q9</span><span class="guide-q-text">怎么做技术债务管理？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：快速迭代中不可避免地产生技术债务：临时方案、代码坏味道、过时的依赖等。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：建立技术债务的识别、记录和偿还机制。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 技术债务识别：</strong></p>
<p>Code Review 中标记技术债务（ TODO: tech-debt 注释）。每次 Sprint 回顾时收集技术债务。静态分析工具自动检测代码坏味道。</p>
<p class="guide-a-step"><strong>2. 分级管理：</strong></p>
<p>P0（紧急）： 影响稳定性或安全性 → 下个 Sprint 必须解决。P1（重要）： 影响可维护性或性能 → 1 个月内解决。P2（一般）： 代码风格、小优化 → 机会主义偿还。</p>
<p class="guide-a-step"><strong>3. 偿还策略：</strong></p>
<p>每个 Sprint 预留 20% 的工时用于偿还技术债务。大型重构制定专项计划。"童子军规则"：碰到的小债务随手修。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：技术债务积压量控制在可管理范围内。系统可维护性评分持续 &gt; 7 分（满分 10 分）。无因技术债务导致的严重事故。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation：快速迭代中不可避免地产生技术债务：临时方案、代码坏味道、过时… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：建立技术债务的识别、记录和偿还机制 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 技术债务识别： Code Review 中标记技术债务（ TODO: te… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 分级管理： P0（紧急）：影响稳定性或安全性→下个 Sprint 必须解决 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. P1（重要）：影响可维护性或性能→ 1 个月内解决 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像给员工配电脑和系统账号：没有工具只能动嘴，有了工具才能查库存、下单、跑代码。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>3. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「代码 Review 题：找出这段 Agent 代码中的设计问题并修复」（/custom/ai100-production/107-agent-code-review） — 要点：Agent 代码的 Review 与普通业务代码有本质区别，因为 Agent 运行在一个**自主循环（Autonomous Loop）**中，每一轮迭代都涉及 **LLM 调用**和**外部工具执行*…</p><p>· 「主流 Coding Agent Harness 横评：Claude Code / C…」（/custom/ai100-frameworks/110-coding-agent-harness-comparison） — 要点：2026 年 Coding Agent Harness 已从"单一 CLI 工具"演化为多层架构产业。Claude Code（Anthropic）、Cursor（Cursor Inc.）、Aider（…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：代码 Review 题：找出这段 Agent 代码中的设计问题并修复、主流 Coding Agent Harness 横评：Claude Code / C…。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：快速迭代中不可避免地产生技术债务：临时方案、代码坏味道、过时的依赖等。</p><p>Task：建立技术债务的识别、记录和偿还机制。</p><p>Action：我重点做了三件事——Situation：快速迭代中不可避免地产生技术债务：临时方案、代码坏味道、过时的依赖等；Task：建立技术债务的识别、记录和偿还机制；Action： ##</p><p>Result：技术债务积压量控制在可管理范围内。系统可维护性评分持续 &gt; 7 分（满分 10 分）。无因技术债务导致的严重事故。</p><p>你也可以补充：本站题库「代码 Review 题：找出这段 Agent 代码中的设计问题并修复」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q10</span><span class="guide-q-text">如何做的性能基准测试？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：需要建立性能基准，作为优化的参照和回归检测的标尺。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：建立可重复的性能基准测试体系。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 基准测试场景：</strong></p>
<p>单组件基准： 向量检索延迟、LLM 调用延迟、Reranking 延迟。端到端基准： 简单问答延迟、RAG 问答延迟、工具调用延迟。压力基准： 最大 QPS、最大并发数。</p>
<p class="guide-a-step"><strong>2. 基准测试工具：</strong></p>
<p>自研基准测试脚本（Python pytest-benchmark）。压力测试：Locust。结果存储和对比：自建 Dashboard。</p>
<p class="guide-a-step"><strong>3. 基准测试执行：</strong></p>
<p>每次重大变更前后各跑一次。结果存入数据库，支持历史对比。设置性能回归阈值：延迟增加 &gt; 10% 触发告警。</p>
<p class="guide-a-step"><strong>4. 基准数据集：</strong></p>
<p>固定的 100 条测试 query（覆盖各种类型）。每次基准测试使用相同的数据集，确保可比性。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：建立了完整的性能基线数据。检测出了 2 次因代码变更导致的性能回归。性能优化有了量化的参照标准。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation：需要建立性能基准，作为优化的参照和回归检测的标尺 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：建立可重复的性能基准测试体系 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 基准测试场景：单组件基准：向量检索延迟、LLM 调用延迟、Rerankin… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 基准测试工具：自研基准测试脚本（Python pytest-benchma… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 3. 基准测试执行：每次重大变更前后各跑一次。结果存入数据库，支持历史对比。设置… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>3. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「LLM-as-Judge：使用 LLM 评估 LLM 输出」（/custom/ai100-evaluation/071-llm-as-judge） — 要点：LLM-as-Judge 是用一个强大的 LLM（如 GPT-4）自动评估另一个 LLM 输出质量的技术，在成本和质量之间取得了最佳平衡。两种核心模式：**Pointwise 评分**（对单个输出按维…</p><p>· 「Re-ranking 的原理与实现：Cross-Encoder vs Bi-Enco…」（/custom/ai100-rag/017-reranking-strategies） — 要点：Bi-Encoder 将查询和文档独立编码为向量，速度快但精度有限，用于第一阶段的大规模检索（Retrieval）。Cross-Encoder 将查询和文档拼接后联合编码，精度高但速度慢，用于第二阶段…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：LLM-as-Judge：使用 LLM 评估 LLM 输出、Re-ranking 的原理与实现：Cross-Encoder vs Bi-Enco…。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：需要建立性能基准，作为优化的参照和回归检测的标尺。</p><p>Task：建立可重复的性能基准测试体系。</p><p>Action：我重点做了三件事——Situation：需要建立性能基准，作为优化的参照和回归检测的标尺；Task：建立可重复的性能基准测试体系；Action： ##</p><p>Result：建立了完整的性能基线数据。检测出了 2 次因代码变更导致的性能回归。性能优化有了量化的参照标准。</p><p>你也可以补充：本站题库「LLM-as-Judge：使用 LLM 评估 LLM 输出」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q11</span><span class="guide-q-text">怎么做的配置管理？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：系统有大量配置项（模型参数、检索参数、限流阈值、Prompt 模板等），需要灵活管理且支持热更新。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：建立统一的配置管理方案。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 配置分层：</strong></p>
<p>静态配置（代码仓库）： 不常变更的配置（数据库连接参数等）。动态配置（配置中心）： 需要热更新的配置（Prompt 模板、模型参数等）。敏感配置（Secret）： API Key、数据库密码等，使用 Vault 或 K8s Secret。</p>
<p class="guide-a-step"><strong>2. 配置中心方案：</strong></p>
<p>使用 Nacos / Apollo 作为配置中心。配置变更实时推送到应用（watch 机制）。配置变更有审计日志，支持回滚。</p>
<p class="guide-a-step"><strong>3. 环境管理：</strong></p>
<p>不同环境（dev/staging/prod）使用不同的配置集。生产环境配置变更需要审批流程。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：Prompt 模板更新可以在不重启服务的情况下生效。配置变更平均生效时间 &amp;lt; 5s。零因配置错误导致的生产事故。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation：系统有大量配置项（模型参数、检索参数、限流阈值、Prompt… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：建立统一的配置管理方案 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 配置分层：静态配置（代码仓库）：不常变更的配置（数据库连接参数等）。动态配… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 配置中心方案：使用 Nacos / Apollo 作为配置中心。配置变更实… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 3. 环境管理：不同环境（dev/staging/prod）使用不同的配置集。生… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>3. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Prompt Chaining：多步骤 Prompt 的设计与编排」（/custom/ai100-prompt/063-prompt-chaining） — 要点：Prompt Chaining（提示链）是将复杂任务分解为多个顺序执行的 LLM 调用，每个调用的输出作为下一个调用的输入。它是 Agentic AI 中最基础的设计模式，也被称为 Pipeline …</p><p>· 「跨模型 Prompt 迁移：如何编写模型无关的 Prompt？」（/custom/ai100-prompt/068-cross-model-prompt-portability） — 要点：跨模型 Prompt 迁移（Cross-Model Prompt Portability）是指让同一个 Prompt 在不同 LLM（GPT-4、Claude、Gemini、Llama 等）上都能有效…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：Prompt Chaining：多步骤 Prompt 的设计与编排、跨模型 Prompt 迁移：如何编写模型无关的 Prompt？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：建立统一的配置管理方案。</p><p>Action：我重点做了三件事——Situation：系统有大量配置项（模型参数、检索参数、限流阈值、Prompt 模板等），需要灵活管理且支持热更新；Task：建立统一的配置管理方案；Action： ##</p><p>Result：Prompt 模板更新可以在不重启服务的情况下生效。配置变更平均生效时间 &amp;lt; 5s。零因配置错误导致的生产事故。</p><p>你也可以补充：本站题库「Prompt Chaining：多步骤 Prompt 的设计与编排」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q12</span><span class="guide-q-text">团队协作和知识共享是怎么做的？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：AI Agent 项目技术栈广（NLP、后端、DevOps、前端），团队成员技能背景各异，需要高效的知识共享。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：建立团队协作和知识共享机制。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 技术分享：</strong></p>
<p>每周一次技术分享（30 分钟），轮流主讲。主题涵盖：新技术调研、踩坑经验、最佳实践。分享内容沉淀为文档。</p>
<p class="guide-a-step"><strong>2. 结对编程：</strong></p>
<p>复杂功能开发采用结对编程（尤其是 Prompt 设计和安全模块）。新成员 On-boarding 时与导师结对。</p>
<p class="guide-a-step"><strong>3. 知识库建设：</strong></p>
<p>内部 Wiki 记录所有技术决策、排障经验、操作手册。FAQ 频繁更新，降低重复沟通成本。</p>
<p class="guide-a-step"><strong>4. Code Review 文化：</strong></p>
<p>Review 不仅检查代码质量，也是知识传递的过程。鼓励详细的 Review 评论，解释"为什么"而不只是"是什么"。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：团队知识孤岛现象消除。新成员上手效率提升 60%。团队技术水平整体提升。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation： AI Agent 项目技术栈广（NLP、后端、DevOps… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：建立团队协作和知识共享机制 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 技术分享：每周一次技术分享（30 分钟），轮流主讲。主题涵盖：新技术调研、… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 结对编程：复杂功能开发采用结对编程（尤其是 Prompt 设计和安全模块）… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 3. 知识库建设：内部 Wiki 记录所有技术决策、排障经验、操作手册 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像项目组：Researcher 查资料、Writer 写稿、Reviewer 挑错——分工清楚比一个人包办更稳。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Prompt Chaining：多步骤 Prompt 的设计与编排」（/custom/ai100-prompt/063-prompt-chaining） — 要点：Prompt Chaining（提示链）是将复杂任务分解为多个顺序执行的 LLM 调用，每个调用的输出作为下一个调用的输入。它是 Agentic AI 中最基础的设计模式，也被称为 Pipeline …</p><p>· 「跨模型 Prompt 迁移：如何编写模型无关的 Prompt？」（/custom/ai100-prompt/068-cross-model-prompt-portability） — 要点：跨模型 Prompt 迁移（Cross-Model Prompt Portability）是指让同一个 Prompt 在不同 LLM（GPT-4、Claude、Gemini、Llama 等）上都能有效…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：Prompt Chaining：多步骤 Prompt 的设计与编排、跨模型 Prompt 迁移：如何编写模型无关的 Prompt？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：建立团队协作和知识共享机制。</p><p>Action：我重点做了三件事——Situation： AI Agent 项目技术栈广（NLP、后端、DevOps、前端），团队成员技能背景各异，需要高效的知识共享；Task：建立团队协作和知识共享机制；Action： ##</p><p>Result：团队知识孤岛现象消除。新成员上手效率提升 60%。团队技术水平整体提升。</p><p>你也可以补充：本站题库「Prompt Chaining：多步骤 Prompt 的设计与编排」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

第六类：业务理解类问题

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q1</span><span class="guide-q-text">你的系统解决了什么业务问题？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：企业面临大量重复性知识咨询工作，人工客服效率低、一致性差、培训成本高。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：设计一个 AI Agent 系统，替代大部分重复性咨询工作，提升服务效率和一致性。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 问题分析：</strong></p>
<p>客服团队每天处理 2000+ 咨询，其中 70% 是重复性问题。新客服培训周期 3 个月，流失率高。不同客服回答同一问题可能不一致，引发客户投诉。高峰期排队等待时间长达 10 分钟。</p>
<p class="guide-a-step"><strong>2. 解决方案：</strong></p>
<p>构建基于 RAG 的智能问答系统，自动回答常见问题。复杂问题自动转人工，并提供上下文摘要减少客户重复描述。7×24 小时在线，无排队等待。</p>
<p class="guide-a-step"><strong>3. 核心价值：</strong></p>
<p>效率提升： AI 处理 65% 的咨询，人工只需处理 35% 的复杂问题。一致性保障： 同一问题的回答标准化，基于知识库统一输出。成本降低： 减少 40% 的客服人力需求。体验提升： 响应时间从分钟级降到秒级。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：日均处理 1300+ 条咨询（无人工干预）。客户满意度从 72% 提升到 88%。人力成本降低 40%。平均响应时间从 5 分钟降到 8 秒。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】权衡题不要一边倒。先承认局限，再给配套护栏，最后说在什么业务条件下仍然值得做。</p><p>【拆开理解】</p><p>1. Situation：企业面临大量重复性知识咨询工作，人工客服效率低、一致性差、培… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：设计一个 AI Agent 系统，替代大部分重复性咨询工作，提升服务效… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 问题分析：客服团队每天处理 2000+ 咨询，其中 70% 是重复性问题。… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 解决方案：构建基于 RAG 的智能问答系统，自动回答常见问题。复杂问题自动… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 7×24 小时在线，无排队等待 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」（/custom/xiaolin-agent/patterns） — 要点：我理解 Agent 和 Workflow 最核心的区别是「谁来决定下一步」…</p><p>· 「说说 Single-Agent 和 Multi-Agent 的设计方案？」（/custom/xiaolin-agent/single_multi） — 要点：Single-Agent 适合任务流程清晰、复杂度适中的场景，实现简单、好维护；Multi-Agent 适合需要专业分工、任务量大或者需要并行执行的复杂场景…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 记忆：事实 vs 推断分开存、写入时机、冲突合并、跨会话权限。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…、说说 Single-Agent 和 Multi-Agent 的设计方案？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：企业面临大量重复性知识咨询工作，人工客服效率低、一致性差、培训成本高。</p><p>Task：说清要优化的目标指标</p><p>Action：我重点做了三件事——Situation：企业面临大量重复性知识咨询工作，人工客服效率低、一致性差、培训成本高；Task：设计一个 AI Agent 系统，替代大部分重复性咨询工作，提升服务效率和一致性；Action： ##</p><p>Result：日均处理 1300+ 条咨询（无人工干预）。客户满意度从 72% 提升到 88%。人力成本降低 40%。平均响应时间从 5 分钟降到 8 秒。</p><p>你也可以补充：本站题库「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q2</span><span class="guide-q-text">用户反馈怎么样？怎么收集和处理的？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：AI 系统的效果需要持续基于用户反馈优化，但用户不一定愿意主动给反馈。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：建立有效的用户反馈收集和处理机制。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 反馈收集渠道：</strong></p>
<p>显式反馈： 每个回答后提供"有帮助/无帮助"按钮 + 可选的文字反馈。隐式反馈：用户重复提问（说明上一次回答不满意）。用户转人工（AI 未能解决问题）。对话轮次过多（可能在反复沟通而未解决）。定期调研： 每月向活跃用户发送满意度问卷。</p>
<p class="guide-a-step"><strong>2. 反馈处理流程：</strong></p>
<p>用户反馈 → 自动分类（满意/不满意/建议）→ 不满意反馈人工审核→ 根因分析（检索问题/生成问题/知识缺失/其他）→   制定优化措施 → 更新知识库/优化Prompt → 验证效果</p>
<p class="guide-a-step"><strong>3. 数据驱动的优化：</strong></p>
<p>每周分析不满意反馈 Top 10 问题类型。跟踪优化后的指标变化。建立"问题-优化-效果"的闭环。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：显式反馈收集率 15%（行业平均 5%）。基于反馈的优化使满意度从 82% 提升到 88%。平均反馈处理周期 3 天。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation： AI 系统的效果需要持续基于用户反馈优化，但用户不一定愿意… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：建立有效的用户反馈收集和处理机制 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 反馈收集渠道：显式反馈：每个回答后提供"有帮助/无帮助"按钮 + 可选的文… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 反馈处理流程：用户反馈→自动分类（满意/不满意/建议）→不满意反馈人工审核… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 3. 数据驱动的优化：每周分析不满意反馈 Top 10 问题类型。跟踪优化后的指… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Prompt Chaining：多步骤 Prompt 的设计与编排」（/custom/ai100-prompt/063-prompt-chaining） — 要点：Prompt Chaining（提示链）是将复杂任务分解为多个顺序执行的 LLM 调用，每个调用的输出作为下一个调用的输入。它是 Agentic AI 中最基础的设计模式，也被称为 Pipeline …</p><p>· 「跨模型 Prompt 迁移：如何编写模型无关的 Prompt？」（/custom/ai100-prompt/068-cross-model-prompt-portability） — 要点：跨模型 Prompt 迁移（Cross-Model Prompt Portability）是指让同一个 Prompt 在不同 LLM（GPT-4、Claude、Gemini、Llama 等）上都能有效…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：Prompt Chaining：多步骤 Prompt 的设计与编排、跨模型 Prompt 迁移：如何编写模型无关的 Prompt？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：AI 系统的效果需要持续基于用户反馈优化，但用户不一定愿意主动给反馈。</p><p>Task：建立有效的用户反馈收集和处理机制。</p><p>Action：我重点做了三件事——Situation： AI 系统的效果需要持续基于用户反馈优化，但用户不一定愿意主动给反馈；Task：建立有效的用户反馈收集和处理机制；Action： ##</p><p>Result：显式反馈收集率 15%（行业平均 5%）。基于反馈的优化使满意度从 82% 提升到 88%。平均反馈处理周期 3 天。</p><p>你也可以补充：本站题库「Prompt Chaining：多步骤 Prompt 的设计与编排」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q3</span><span class="guide-q-text">你觉得 AI Agent 在企业中的价值是什么？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：面试官考察对 AI Agent 商业价值的理解深度。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：从业务视角阐述 AI Agent 的核心价值。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 短期价值（降本增效）：</strong></p>
<p>重复性工作自动化： 客服、数据查询、报告生成等。量化收益： 节省人力 = AI处理量 × 人工单次成本。典型 ROI：6 个月回本。</p>
<p class="guide-a-step"><strong>2. 中期价值（能力增强）：</strong></p>
<p>知识民主化： 让每个员工都能"查到"和"用到"企业积累的知识。决策辅助： 基于数据和知识，为业务决策提供建议。服务标准化： 确保服务质量的一致性。</p>
<p class="guide-a-step"><strong>3. 长期价值（业务创新）：</strong></p>
<p>智能工作流： AI Agent 作为工作流中的智能节点，打通信息孤岛。个性化服务： 基于用户画像提供定制化的服务和推荐。自我进化： 从数据和反馈中持续学习和优化。</p>
<p class="guide-a-step"><strong>4. 关键成功因素：</strong></p>
<p>不是为了用 AI 而用 AI，必须解决真实的业务痛点。人机协作而非完全替代：AI 处理简单重复，人处理复杂创意。持续投入评估和优化，AI 系统不是一次性项目。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：这个理解帮助团队始终围绕业务价值做技术决策，避免了"技术炫技"的陷阱。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】定义题考你能不能「用类比 + 结构」讲清楚，而不是堆术语。面试官想确认你真的理解，而不是背过。</p><p>【拆开理解】</p><p>1. Situation：面试官考察对 AI Agent 商业价值的理解深度 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：从业务视角阐述 AI Agent 的核心价值 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 短期价值（降本增效）：重复性工作自动化：客服、数据查询、报告生成等。量化收… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 中期价值（能力增强）：知识民主化：让每个员工都能"查到"和"用到"企业积累… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 3. 长期价值（业务创新）：智能工作流： AI Agent 作为工作流中的智能节… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像项目组：Researcher 查资料、Writer 写稿、Reviewer 挑错——分工清楚比一个人包办更稳。</p><p>【常见误区】</p><p>1. 只背一句定义，没有说「和普通 LLM 单次调用差在哪」。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」（/custom/xiaolin-agent/patterns） — 要点：我理解 Agent 和 Workflow 最核心的区别是「谁来决定下一步」…</p><p>· 「说说 Single-Agent 和 Multi-Agent 的设计方案？」（/custom/xiaolin-agent/single_multi） — 要点：Single-Agent 适合任务流程清晰、复杂度适中的场景，实现简单、好维护；Multi-Agent 适合需要专业分工、任务量大或者需要并行执行的复杂场景…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…、说说 Single-Agent 和 Multi-Agent 的设计方案？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：说清要优化的目标指标</p><p>Action：我重点做了三件事——Situation：面试官考察对 AI Agent 商业价值的理解深度；Task：从业务视角阐述 AI Agent 的核心价值；Action： ##</p><p>Result：这个理解帮助团队始终围绕业务价值做技术决策，避免了"技术炫技"的陷阱。</p><p>你也可以补充：本站题库「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q4</span><span class="guide-q-text">和竞品相比你们的优势是什么？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：市场上有很多 AI Agent / RAG 解决方案，需要清晰表达差异化优势。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：分析竞争优势，给出有说服力的差异化定位。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 竞品分析：</strong></p>
<p>通用 AI 平台（如 Coze、Dify）： 易用但缺乏深度定制能力，无法满足企业级安全和合规需求。大厂方案（如百度、阿里的企业AI）： 功能全但部署不灵活，通常需要用厂商的全家桶。开源方案（如 LangChain + 自搭）： 灵活但需要大量工程投入，缺乏生产级运维支持。</p>
<p class="guide-a-step"><strong>2. 我们的差异化优势：</strong></p>
<p>深度定制： 完全基于客户的数据和业务场景定制，而非通用模板。多路检索： 向量 + 关键词 + 知识图谱的三路融合，检索准确率高于单一检索方案。企业级工程质量： 完善的监控、安全、运维体系，不只是 Demo 能跑。可私有化部署： 支持完全部署在客户自己的基础设施上，满足数据安全要求。持续优化服务： 提供持续的效果优化服务，不是交付后就不管。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：技术 POC 竞标中胜率 70%（核心优势：检索准确率和私有化部署）。客户续费率 85%（核心优势：持续优化服务）。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】定义题考你能不能「用类比 + 结构」讲清楚，而不是堆术语。面试官想确认你真的理解，而不是背过。</p><p>【拆开理解】</p><p>1. Situation：市场上有很多 AI Agent / RAG 解决方案，需要清… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：分析竞争优势，给出有说服力的差异化定位 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 竞品分析：通用 AI 平台（如 Coze、Dify）：易用但缺乏深度定制能… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 我们的差异化优势：深度定制：完全基于客户的数据和业务场景定制，而非通用模板… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. Result：技术 POC 竞标中胜率 70%（核心优势：检索准确率和私有化部署… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只背一句定义，没有说「和普通 LLM 单次调用差在哪」。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>3. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」（/custom/xiaolin-agent/patterns） — 要点：我理解 Agent 和 Workflow 最核心的区别是「谁来决定下一步」…</p><p>· 「说说 Single-Agent 和 Multi-Agent 的设计方案？」（/custom/xiaolin-agent/single_multi） — 要点：Single-Agent 适合任务流程清晰、复杂度适中的场景，实现简单、好维护；Multi-Agent 适合需要专业分工、任务量大或者需要并行执行的复杂场景…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…、说说 Single-Agent 和 Multi-Agent 的设计方案？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：分析竞争优势，给出有说服力的差异化定位。</p><p>Action：我重点做了三件事——Situation：市场上有很多 AI Agent / RAG 解决方案，需要清晰表达差异化优势；Task：分析竞争优势，给出有说服力的差异化定位；Action： ##</p><p>Result：技术 POC 竞标中胜率 70%（核心优势：检索准确率和私有化部署）。客户续费率 85%（核心优势：持续优化服务）。</p><p>你也可以补充：本站题库「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q5</span><span class="guide-q-text">下一步的技术规划是什么？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：系统已经稳定运行，需要规划下一阶段的技术演进方向。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：制定清晰的技术路线图。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 短期（1-3 个月）：</strong></p>
<p>引入 Agentic RAG：让 Agent 自主决定检索策略（是否检索、怎么检索、检索几次）。接入多模态能力：支持图片输入和图片生成。完善评估体系：引入 RAGAS 自动化评估，CI 集成。</p>
<p class="guide-a-step"><strong>2. 中期（3-6 个月）：</strong></p>
<p>多 Agent 协作优化：引入更复杂的协作模式（如辩论式、投票式）。长期记忆系统重构：从简单的 KV 存储到分层记忆（工作记忆 + 情景记忆 + 语义记忆）。MCP 生态对接：接入社区的 MCP 工具服务。</p>
<p class="guide-a-step"><strong>3. 长期（6-12 个月）：</strong></p>
<p>自我进化能力：Agent 能从历史交互中自动优化 Prompt 和检索策略。垂直领域小模型训练：针对高频场景微调专用小模型，降低成本。Agent 工作流平台：可视化编排 Agent 工作流，降低配置门槛。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：技术路线图已获得管理层认可。短期目标有 80% 在按计划推进。路线图每季度 review 和调整。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】定义题考你能不能「用类比 + 结构」讲清楚，而不是堆术语。面试官想确认你真的理解，而不是背过。</p><p>【拆开理解】</p><p>1. Situation：系统已经稳定运行，需要规划下一阶段的技术演进方向 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：制定清晰的技术路线图 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 短期（1-3 个月）：引入 Agentic RAG：让 Agent 自主决… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 中期（3-6 个月）：多 Agent 协作优化：引入更复杂的协作模式（如辩… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. MCP 生态对接：接入社区的 MCP 工具服务 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只背一句定义，没有说「和普通 LLM 单次调用差在哪」。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>3. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Agent 记忆的类型：短期记忆、长期记忆、工作记忆」（/custom/ai100-memory/040-memory-types） — 要点：LLM Agent 的记忆系统借鉴认知科学，分为三种核心类型：**短期记忆（Short-Term Memory）**——当前会话的对话历史，存在于 LLM 的上下文窗口中，会话结束即丢失；**长期记忆…</p><p>· 「Prompt Chaining：多步骤 Prompt 的设计与编排」（/custom/ai100-prompt/063-prompt-chaining） — 要点：Prompt Chaining（提示链）是将复杂任务分解为多个顺序执行的 LLM 调用，每个调用的输出作为下一个调用的输入。它是 Agentic AI 中最基础的设计模式，也被称为 Pipeline …</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 记忆：事实 vs 推断分开存、写入时机、冲突合并、跨会话权限。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：Agent 记忆的类型：短期记忆、长期记忆、工作记忆、Prompt Chaining：多步骤 Prompt 的设计与编排。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：系统已经稳定运行，需要规划下一阶段的技术演进方向。</p><p>Task：制定清晰的技术路线图。</p><p>Action：我重点做了三件事——Situation：系统已经稳定运行，需要规划下一阶段的技术演进方向；Task：制定清晰的技术路线图；Action： ##</p><p>Result：技术路线图已获得管理层认可。短期目标有 80% 在按计划推进。路线图每季度 review 和调整。</p><p>你也可以补充：本站题库「Agent 记忆的类型：短期记忆、长期记忆、工作记忆」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q6</span><span class="guide-q-text">你在项目中的角色是什么？最大的贡献是什么？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：面试官考察个人在项目中的真实贡献和成长。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：清晰表达个人角色和核心贡献。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 角色定位： 后端技术负责人 / AI 工程师。</strong></p>
<p class="guide-a-step"><strong>2. 核心贡献：</strong></p>
<p>架构设计： 主导了多路检索融合架构和 Agent 编排器的设计。核心模块开发： 实现了 ReAct 引擎、检索管道、熔断器、模型路由等核心模块。性能优化： 主导了全链路延迟优化，将 P50 从 6.5s 降到 2.8s。工程体系建设： 建立了 CI/CD 流水线、监控告警体系、评估测试框架。</p>
<p class="guide-a-step"><strong>3. 技术决策： 推动了从单 Agent 到多 Agent 的架构演进，解决了工具数量增长导致的准确率下</strong></p>
<p>降问题。</p>
<p class="guide-a-step"><strong>4. 个人成长： 从"能用 LangChain 写 Demo"到"能设计和落地企业级 AI Agent 系统"。</strong></p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：系统稳定服务 20+ 企业客户。团队从 3 人发展到 8 人。个人从 IC 成长为技术负责人。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】定义题考你能不能「用类比 + 结构」讲清楚，而不是堆术语。面试官想确认你真的理解，而不是背过。</p><p>【拆开理解】</p><p>1. Situation：面试官考察个人在项目中的真实贡献和成长 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：清晰表达个人角色和核心贡献 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 角色定位：后端技术负责人 / AI 工程师 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 核心贡献：架构设计：主导了多路检索融合架构和 Agent 编排器的设计。核… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 2.8s。工程体系建设：建立了 CI/CD 流水线、监控告警体系、评估测试框架 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像侦探办案：先推理（Thought），再行动查线索（Action），看结果（Observation），循环直到破案。</p><p>【常见误区】</p><p>1. 只背一句定义，没有说「和普通 LLM 单次调用差在哪」。</p><p>2. 把 ReAct 说成「想一步做一步」但说不清 Observation 从哪来、何时停止。</p><p>3. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>4. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Agent 架构模式详解：ReAct、Plan-and-Execute、LATS、P…」（/custom/ai100-agent-arch/003-agent-architecture-patterns） — 要点：主流 Agent 架构模式各有侧重：**ReAct** 交替推理与行动，灵活且可解释性强，但 token 消耗高；**Plan-and-Execute** 先规划后执行，高效但适应性低；**LATS*…</p><p>· 「如何防止 Agent 死循环浪费 Token」（/custom/today-interview/agent-infinite-loop） — 要点：硬上限 + 重复检测 + 无进展熔断三道保险；到线就停、状态可恢复；宁可早停可重试，也不烧 token 空转。…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 架构：步数上限、停止条件、死循环检测、Plan+ReAct 混合、画拓扑图。</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：Agent 架构模式详解：ReAct、Plan-and-Execute、LATS、P…、如何防止 Agent 死循环浪费 Token。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：面试官考察个人在项目中的真实贡献和成长。</p><p>Task：清晰表达个人角色和核心贡献。</p><p>Action：我重点做了三件事——Situation：面试官考察个人在项目中的真实贡献和成长；Task：清晰表达个人角色和核心贡献；Action： ##</p><p>Result：系统稳定服务 20+ 企业客户。团队从 3 人发展到 8 人。个人从 IC 成长为技术负责人。</p><p>你也可以补充：本站题库「Agent 架构模式详解：ReAct、Plan-and-Execute、LATS、P…」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q7</span><span class="guide-q-text">项目中遇到的最大挑战是什么？怎么解决的？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：面试官考察面对困难的应对能力和解决问题的思维方式。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：分享一个真实且有技术深度的挑战。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 挑战描述： 系统上线初期，用户满意度只有 68%，远低于 80% 的目标。主要问题是检索不准</strong></p>
<p>确和 LLM 幻觉。</p>
<p class="guide-a-step"><strong>2. 问题拆解：</strong></p>
<p>抽样分析 200 条不满意反馈，分类如下：检索问题（45%）：关键信息未被检索到。幻觉问题（30%）：LLM 编造了不存在的信息。理解偏差（15%）：AI 误解了用户意图。其他（10%）：格式问题、延迟等。</p>
<p class="guide-a-step"><strong>3. 逐个击破：</strong></p>
<p>检索问题 → 引入多路检索 + reranker，检索准确率提升 17%。幻觉问题 → 多层幻觉防控（引用机制 + NLI 检查 + temperature=0），幻觉率从 18% 降到3%。理解偏差 → 优化意图识别（两阶段分类 + 置信度阈值），准确率提升到 94%。</p>
<p class="guide-a-step"><strong>4. 方法论： 不是凭感觉优化，而是"数据驱动 + 逐个击破"。</strong></p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：用户满意度从 68% 提升到 88%，超出目标。形成了一套可复用的 RAG 系统优化方法论。团队建立了"问题分析 → 根因定位 → 量化改进"的工作习惯。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】定义题考你能不能「用类比 + 结构」讲清楚，而不是堆术语。面试官想确认你真的理解，而不是背过。</p><p>【拆开理解】</p><p>1. Situation：面试官考察面对困难的应对能力和解决问题的思维方式 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：分享一个真实且有技术深度的挑战 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 挑战描述：系统上线初期，用户满意度只有 68%，远低于 80% 的目标。主… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 问题拆解：抽样分析 200 条不满意反馈，分类如下：检索问题（45%）：关… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 3. 逐个击破：检索问题→引入多路检索 + reranker，检索准确率提升 1… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只背一句定义，没有说「和普通 LLM 单次调用差在哪」。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「1. RAG 是什么？为什么需要 RAG？」（/custom/kama-rag/rag_interview-q1） — 要点：# RAG大厂面试题汇总：向量检索、混合检索、Rerank、幻觉处理高频问题今年知识星球 (opens new window)里，录友反馈最多的面试变化就是：RAG 成了必考项…</p><p>· 「LLM-as-Judge：使用 LLM 评估 LLM 输出」（/custom/ai100-evaluation/071-llm-as-judge） — 要点：LLM-as-Judge 是用一个强大的 LLM（如 GPT-4）自动评估另一个 LLM 输出质量的技术，在成本和质量之间取得了最佳平衡。两种核心模式：**Pointwise 评分**（对单个输出按维…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：1. RAG 是什么？为什么需要 RAG？、LLM-as-Judge：使用 LLM 评估 LLM 输出。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：面试官考察面对困难的应对能力和解决问题的思维方式。</p><p>Task：分享一个真实且有技术深度的挑战。</p><p>Action：我重点做了三件事——Situation：面试官考察面对困难的应对能力和解决问题的思维方式；Task：分享一个真实且有技术深度的挑战；Action： ##</p><p>Result：用户满意度从 68% 提升到 88%，超出目标。形成了一套可复用的 RAG 系统优化方法论。团队建立了"问题分析→根因定位→量化改进"的工作习惯。</p><p>你也可以补充：本站题库「1. RAG 是什么？为什么需要 RAG？」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q8</span><span class="guide-q-text">这个项目的 ROI 是怎么计算的？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p class="guide-star-line"><span class="guide-star-tag">Situation</span>：面试官考察对业务价值的量化能力。</p>
<p class="guide-star-line"><span class="guide-star-tag">Task</span>：给出清晰的 ROI 计算逻辑。</p>
<p class="guide-star-line"><span class="guide-star-tag">Action</span>：</p>
<p class="guide-a-step"><strong>1. 成本投入：</strong></p>
<p>研发成本：6 人 × 6 个月 × 平均月薪 = X 万元。基础设施成本：云服务 + API 费用 = Y 万元/月。运维成本：1 人 × 月薪 = Z 万元/月。</p>
<p class="guide-a-step"><strong>2. 收益计算：</strong></p>
<p>直接节省： AI 替代 40% 客服人力 = N 人 × 月薪 = A 万元/月。效率提升： 人工客服效率提升 30%（AI 提供上下文辅助）= B 万元/月。收入增长： 客户满意度提升带来的续费率提升 = C 万元/月。</p>
<p class="guide-a-step"><strong>3. ROI 公式：</strong></p>
<p>年化收益 - 年化成本) / 年化成本 × 100%ROI = (典型值：6 个月回本，年化 ROI 约 200%。</p>
<p class="guide-star-line"><span class="guide-star-tag">Result</span>：项目在第 7 个月实现回本。年化 ROI 约 180%。成功说服管理层持续投入 AI Agent 项目。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. Situation：面试官考察对业务价值的量化能力 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Task：给出清晰的 ROI 计算逻辑 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Action： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1. 成本投入：研发成本：6 人 × 6 个月 × 平均月薪 = X 万元。基础… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 2. 收益计算：直接节省： AI 替代 40% 客服人力 = N 人 × 月薪 … → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 3. ROI 公式：年化收益 - 年化成本) / 年化成本 × 100% ROI… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像员工的笔记本 + 公司 Wiki：笔记本记当前任务，Wiki 记长期规则和客户档案。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」（/custom/xiaolin-agent/patterns） — 要点：我理解 Agent 和 Workflow 最核心的区别是「谁来决定下一步」…</p><p>· 「说说 Single-Agent 和 Multi-Agent 的设计方案？」（/custom/xiaolin-agent/single_multi） — 要点：Single-Agent 适合任务流程清晰、复杂度适中的场景，实现简单、好维护；Multi-Agent 适合需要专业分工、任务量大或者需要并行执行的复杂场景…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 记忆：事实 vs 推断分开存、写入时机、冲突合并、跨会话权限。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…、说说 Single-Agent 和 Multi-Agent 的设计方案？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：面试官考察对业务价值的量化能力。</p><p>Task：给出清晰的 ROI 计算逻辑。</p><p>Action：我重点做了三件事——Situation：面试官考察对业务价值的量化能力；Task：给出清晰的 ROI 计算逻辑；Action： ##</p><p>Result：项目在第 7 个月实现回本。年化 ROI 约 180%。成功说服管理层持续投入 AI Agent 项目。</p><p>你也可以补充：本站题库「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

第七类：基础知识追问

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q1</span><span class="guide-q-text">Transformer 的 Self-Attention 怎么计算？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>回答：Self-Attention 的计算过程：</p>
<p class="guide-a-step"><strong>1. 线性变换生成 Q、K、V：</strong></p>
<p>Q = X · W_Q   (Query)K = X · W_K   (Key)V = X · W_V   (Value)其中 X 是输入序列的 embedding 矩阵（n × d_model），W_Q、W_K、W_V 是可学习参数矩阵。</p>
<p class="guide-a-step"><strong>2. 计算注意力分数：</strong></p>
<p>Attention(Q, K, V) = softmax(Q · K^T / √d_k) · VQ · K^T   ：计算每个 token 对其他所有 token 的相关性分数（n × n 矩阵）。√d_k ：缩放因子，防止点积值过大导致 softmax 梯度消失。d_k = d_model /num_heads。softmax ：归一化为概率分布。最终与 V 相乘，得到加权后的输出。</p>
<p class="guide-a-step"><strong>3. Multi-Head Attention：</strong></p>
<p>MultiHead(Q, K, V) = Concat(head_1, ..., head_h) · W_Ohead_i = Attention(Q · W_Qi, K · W_Ki, V · W_Vi)多个 Head 并行计算，每个 Head 关注不同的语义子空间。最后拼接并通过线性变换。</p>
<p class="guide-a-step"><strong>4. 计算复杂度： O(n²·d)，其中 n 是序列长度，d 是维度。这也是长序列处理的瓶颈。</strong></p>
<p class="guide-a-step"><strong>5. 为什么 Self-Attention 有效？</strong></p>
<p>能直接建模任意两个位置之间的依赖关系（对比 RNN 的顺序传播）。计算可并行（对比 RNN 的串行计算）。通过 Multi-Head 机制捕捉多种语义关系。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】回答： Self-Attention 的计算过程： ## 1. 线性变换生成 Q、K、V： Q = X · W_Q (Query) K = X · W_K (Key) V = X · W_V (Value) 其中 X 是输入序列的 embedding 矩阵（n × d_model），W_Q、W_K、W_V 是可学习参数矩阵。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 回答： Self-Attention 的计算过程： ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. 1. 线性变换生成 Q、K、V： Q = X · W_Q (Query) K =… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. 2. 计算注意力分数： Attention(Q, K, V) = softmax… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. softmax ：归一化为概率分布。最终与 V 相乘，得到加权后的输出 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 3. Multi-Head Attention： MultiHead(Q, K,… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 4. 计算复杂度： O(n²·d)，其中 n 是序列长度，d 是维度。这也是长序… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>【面试怎么答】目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「3. Self-Attention：Transformer 的灵魂」（/custom/kama-transformer/transformer_interview-q3） — 要点：面试官会问：&amp;quot;Self-Attention 是什么…</p><p>· 「4. Multi-Head Attention：为什么要多个头？」（/custom/kama-transformer/transformer_interview-q4） — 要点：面试官会问：&amp;quot;Multi-Head Attention 和 Self-Attention 什么关系…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：3. Self-Attention：Transformer 的灵魂、4. Multi-Head Attention：为什么要多个头？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。</p><p>【主体】回答： Self-Attention 的计算过程： ## 1. 线性变换生成 Q、K、V： Q = X · W_Q (Query) K = X · W_K (Key) V = X · W_V (Value) 其中 X 是输入序列的 embedding 矩阵（n × d_model），W_Q、W_K、W_V 是可学习参数矩阵。 ## 2. 计算注意力分数： Attention(Q, K, V) = softmax(Q · K^T / √d_k) · V Q · K^T ：计算每个 token 对其他所有 token 的相关性分数（n × n 矩阵）。√d_k ：缩放因子，防止点积值过大导致 softmax 梯度消失。d_k = d_model / num_heads。 softmax ：归一化为概率分布。最终与 V 相乘，得到加权后的输出。 ## 3.…</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「3. Self-Attention：Transformer 的灵魂」里有更完整的口播示范，建议对照练一遍。</p><p>如果追问为什么不用纯向量，我会说：编号、专有名词、精确匹配 BM25 更稳，所以 Hybrid + 重排是常态。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q2</span><span class="guide-q-text">LoRA 的原理是什么？为什么低秩有效？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>回答：</p>
<p class="guide-a-step"><strong>1. LoRA 核心思想：</strong></p>
<p>在微调时不修改原始模型的权重 W，而是添加一个低秩分解的增量 ΔW。W' = W + ΔW = W + B · A其中  W ∈ R^(d×d), B ∈ R^(d×r), A ∈ R^(r×d), r &amp;lt;&amp;lt; d例如 d=4096, r=8 时，参数量从 4096² = 16M 降到 2×4096×8 = 65K（减少 99.6%）。</p>
<p class="guide-a-step"><strong>2. 为什么低秩有效？</strong></p>
<p>内在维度假说（Intrinsic Dimensionality）： 预训练模型在微调时，参数变化实际上存在于一个低维子空间中。实验表明，大模型微调的权重变化矩阵的有效秩远小于其原始维度。类比：一个 4096 维的参数空间，微调时真正需要变化的方向可能只有几个。</p>
<p class="guide-a-step"><strong>3. LoRA 实现细节：</strong></p>
<p>A 矩阵用高斯初始化，B 矩阵初始化为零（保证训练开始时 ΔW=0）。只在 Attention 的 Q、V 投影矩阵上应用 LoRA（实践中效果最好）。推理时可以将 ΔW 合并到 W 中，不增加推理开销。</p>
<p class="guide-a-step"><strong>4. 与其他方法对比：</strong></p>
<p>全量微调： 效果最好，但需要大量显存和计算资源。Prompt Tuning： 参数量更少，但效果不如 LoRA。Adapter： 增加推理延迟，LoRA 合并后零额外延迟。</p>
<p class="guide-a-step"><strong>5. QLoRA： 结合量化（4-bit）和 LoRA，进一步降低显存需求，使得在消费级 GPU 上微调大模</strong></p>
<p>型成为可能。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】回答： ## 1. LoRA 核心思想：在微调时不修改原始模型的权重 W，而是添加一个低秩分解的增量ΔW。</p><p>【为什么考这个】定义题考你能不能「用类比 + 结构」讲清楚，而不是堆术语。面试官想确认你真的理解，而不是背过。</p><p>【拆开理解】</p><p>1. 1. LoRA 核心思想：在微调时不修改原始模型的权重 W，而是添加一个低秩分解… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. W' = W + ΔW = W + B · A 其中 W ∈ R^(d×d), … → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. d 例如 d=4096, r=8 时，参数量从 4096² = 16M 降到 2… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 2. 为什么低秩有效？内在维度假说（Intrinsic Dimensionali… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 3. LoRA 实现细节： A 矩阵用高斯初始化，B 矩阵初始化为零（保证训练开… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 4. 与其他方法对比：全量微调：效果最好，但需要大量显存和计算资源 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】可以把 Agent 想成「会自己查资料、记笔记、调系统的数字员工」，比普通 ChatBot 多了闭环和多步决策。</p><p>【常见误区】</p><p>1. 只背一句定义，没有说「和普通 LLM 单次调用差在哪」。</p><p>【面试怎么答】15 秒定义 → 30 秒展开组件/流程 → 15 秒举例 → 10 秒和 ChatBot/Chain 的区别。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Prompt Chaining：多步骤 Prompt 的设计与编排」（/custom/ai100-prompt/063-prompt-chaining） — 要点：Prompt Chaining（提示链）是将复杂任务分解为多个顺序执行的 LLM 调用，每个调用的输出作为下一个调用的输入。它是 Agentic AI 中最基础的设计模式，也被称为 Pipeline …</p><p>· 「跨模型 Prompt 迁移：如何编写模型无关的 Prompt？」（/custom/ai100-prompt/068-cross-model-prompt-portability） — 要点：跨模型 Prompt 迁移（Cross-Model Prompt Portability）是指让同一个 Prompt 在不同 LLM（GPT-4、Claude、Gemini、Llama 等）上都能有效…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：Prompt Chaining：多步骤 Prompt 的设计与编排、跨模型 Prompt 迁移：如何编写模型无关的 Prompt？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我先给一个清晰定义，再用类比帮你建立直觉，最后说和生产的关系。</p><p>【主体】回答： ## 1. LoRA 核心思想：在微调时不修改原始模型的权重 W，而是添加一个低秩分解的增量ΔW。 W' = W + ΔW = W + B · A 其中 W ∈ R^(d×d), B ∈ R^(d×r), A ∈ R^(r×d), r &amp;lt;&amp;lt; d 例如 d=4096, r=8 时，参数量从 4096² = 16M 降到 2×4096×8 = 65K（减少 99.6%）。 ## 2. 为什么低秩有效？内在维度假说（Intrinsic Dimensionality）：预训练模型在微调时，参数变化实际上存在于一个低维子空间中。实验表明，大模型微调的权重变化矩阵的有效秩远小于其原始维度。类比：一个 4096 维的参数空间，微调时真正需要变化的方向可能只有几个。 ## 3. LoRA 实现细节： A 矩阵用高斯初始化，B 矩阵初始化为零（保证…</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「Prompt Chaining：多步骤 Prompt 的设计与编排」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q3</span><span class="guide-q-text">RAG 和微调怎么选？各自优劣？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>回答：</p>
<p class="guide-a-step"><strong>1. RAG（检索增强生成）：</strong></p>
<p>优势：知识可实时更新（改知识库即可，不需要重新训练）。可解释性好（答案有明确的来源引用）。无需 GPU 训练资源。减少幻觉（答案基于检索到的事实）。劣势：受检索质量影响大（检索不到就答不出）。上下文窗口限制（能放入的知识量有限）。推理延迟增加（多了检索环节）。无法改变模型本身的能力（如生成风格）。</p>
<p class="guide-a-step"><strong>2. 微调（Fine-tuning）：</strong></p>
<p>优势：内化知识，不依赖外部检索。可以改变模型的行为和风格。推理时无额外延迟。对于特定任务可以达到更高精度。劣势：知识更新需要重新训练。需要高质量标注数据。训练需要 GPU 资源。可能导致灾难性遗忘。</p>
<p class="guide-a-step"><strong>3. 选择策略：</strong></p>
<p>| 场景 | 推荐方案 | 原因 || --- | --- | --- || 知识频繁更新 | RAG | 改知识库即可 || 需要引用来源 | RAG | 天然支持溯源 || 特定领域术语/风格 | 微调 | 内化领域知识 |数据量小（&amp;lt; 1000 条）               RAG             微调数据不足| 需要模型能力提升 | 微调 | RAG 不改变模型 || --- | --- | --- || 最佳实践 | RAG + 微调 | 互补 |</p>
<p class="guide-a-step"><strong>4. 实际项目中的做法：</strong></p>
<p>主体方案用 RAG：知识库问答、文档检索。辅以微调：使用 LoRA 微调让模型更好地遵循指令格式、生成风格更专业。效果叠加：微调后的模型 + RAG，比纯 RAG 效果更好。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】回答： ## 1. RAG（检索增强生成）：优势：知识可实时更新（改知识库即可，不需要重新训练）。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 1. RAG（检索增强生成）：优势：知识可实时更新（改知识库即可，不需要重新训练… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. 2. 微调（Fine-tuning）：优势：内化知识，不依赖外部检索。可以改变模… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. 3. 选择策略：场景推荐方案原因知识频繁更新 RAG 改知识库即可需要引用来源 … → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 1000 条） RAG 微调数据不足需要模型能力提升微调 RAG 不改变模型最佳… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 4. 实际项目中的做法：主体方案用 RAG：知识库问答、文档检索。辅以微调：使用… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>【面试怎么答】目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「高级 RAG 变体：Corrective RAG、Self-RAG、Adaptive…」（/custom/ai100-rag/019-advanced-rag-variants） — 要点：三种高级 RAG 变体各解决不同问题：**Self-RAG** 通过反思 token 动态决定是否检索并自我评估输出质量，提升事实准确性；**Corrective RAG (CRAG)** 在检索后评…</p><p>· 「1. RAG 检索到了但答不对——传统 RAG 的三个天花板」（/custom/kama-rag/graphrag_interview-q1） — 要点：# GraphRAG与LightRAG大厂面试题汇总：从RAG到知识图谱检索之前写了讲透RAG，把向量检索、混合检索、Rerank、幻觉处理这些讲透了…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 记忆：事实 vs 推断分开存、写入时机、冲突合并、跨会话权限。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 5 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：高级 RAG 变体：Corrective RAG、Self-RAG、Adaptive…、1. RAG 检索到了但答不对——传统 RAG 的三个天花板。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。</p><p>【主体】回答： ## 1. RAG（检索增强生成）：优势：知识可实时更新（改知识库即可，不需要重新训练）。可解释性好（答案有明确的来源引用）。无需 GPU 训练资源。减少幻觉（答案基于检索到的事实）。劣势：受检索质量影响大（检索不到就答不出）。上下文窗口限制（能放入的知识量有限）。推理延迟增加（多了检索环节）。无法改变模型本身的能力（如生成风格）。 ## 2. 微调（Fine-tuning）：优势：内化知识，不依赖外部检索。可以改变模型的行为和风格。推理时无额外延迟。对于特定任务可以达到更高精度。劣势：知识更新需要重新训练。需要高质量标注数据。训练需要 GPU 资源。可能导致灾难性遗忘。 ## 3. 选择策略：场景推荐方案原因知识频繁更新 RAG 改知识库即可需要引用来源 RAG 天然支持溯源特定领域术语/风格微调内化领域知识数据量小（&amp;lt; 1000 条…</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「高级 RAG 变体：Corrective RAG、Self-RAG、Adaptive…」里有更完整的口播示范，建议对照练一遍。</p><p>如果追问为什么不用纯向量，我会说：编号、专有名词、精确匹配 BM25 更稳，所以 Hybrid + 重排是常态。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q4</span><span class="guide-q-text">KV Cache 是什么？为什么需要？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>回答：</p>
<p class="guide-a-step"><strong>1. 问题背景：</strong></p>
<p>Transformer 的 Self-Attention 计算中，每个新 token 需要和之前所有 token 计算注意力。自回归生成时，第 N 个 token 的 K、V 与前 N-1 个 token 重复计算。</p>
<p class="guide-a-step"><strong>2. KV Cache 原理：</strong></p>
<p>在自回归生成过程中，缓存每一层的 K（Key）和 V（Value）矩阵。生成第 N+1 个 token 时：只需要计算新 token 的 Q、K、V。使用缓存的 K、V 与新的 Q 计算注意力。将新的 K、V 追加到缓存中。避免了重复计算前 N 个 token 的 K 和 V。</p>
<p class="guide-a-step"><strong>3. 计算复杂度对比：</strong></p>
<p>不使用 KV Cache：生成 n 个 token 的总计算量 ∝ n³使用 KV Cache：生成 n 个 token 的总计算量 ∝ n²</p>
<p class="guide-a-step"><strong>4. 内存开销：</strong></p>
<p>KV Cache 大小 = 2 × num_layers × num_heads × seq_len × head_dim × batch_size ×dtype_size例如 GPT-4 级别模型，128K context 的 KV Cache 可达数十 GB。这也是大模型推理需要大量显存的原因之一。</p>
<p class="guide-a-step"><strong>5. 优化技术：</strong></p>
<p>GQA（Grouped Query Attention）： 多个 Q Head 共享同一组 K、V，减少 KV Cache 大小。MQA（Multi-Query Attention）： 所有 Q Head 共享同一组 K、V。PagedAttention（vLLM）： 将 KV Cache 分页管理，减少内存碎片。KV Cache 量化： 将 FP16 的 KV Cache 量化为 INT8，减少一半内存。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】回答： ## 1. 问题背景： Transformer 的 Self-Attention 计算中，每个新 token 需要和之前所有 token 计算注意力。</p><p>【为什么考这个】定义题考你能不能「用类比 + 结构」讲清楚，而不是堆术语。面试官想确认你真的理解，而不是背过。</p><p>【拆开理解】</p><p>1. 1. 问题背景： Transformer 的 Self-Attention 计算… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. 2. KV Cache 原理：在自回归生成过程中，缓存每一层的 K（Key）和 … → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. 3. 计算复杂度对比：不使用 KV Cache：生成 n 个 token 的总计… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 4. 内存开销： KV Cache 大小 = 2 × num_layers × … → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 5. 优化技术： GQA（Grouped Query Attention）：多个… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. MQA（Multi-Query Attention）：所有 Q Head 共享同… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】可以把 Agent 想成「会自己查资料、记笔记、调系统的数字员工」，比普通 ChatBot 多了闭环和多步决策。</p><p>【常见误区】</p><p>1. 只背一句定义，没有说「和普通 LLM 单次调用差在哪」。</p><p>【面试怎么答】15 秒定义 → 30 秒展开组件/流程 → 15 秒举例 → 10 秒和 ChatBot/Chain 的区别。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「3. Self-Attention：Transformer 的灵魂」（/custom/kama-transformer/transformer_interview-q3） — 要点：面试官会问：&amp;quot;Self-Attention 是什么…</p><p>· 「4. Multi-Head Attention：为什么要多个头？」（/custom/kama-transformer/transformer_interview-q4） — 要点：面试官会问：&amp;quot;Multi-Head Attention 和 Self-Attention 什么关系…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：3. Self-Attention：Transformer 的灵魂、4. Multi-Head Attention：为什么要多个头？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我先给一个清晰定义，再用类比帮你建立直觉，最后说和生产的关系。</p><p>【主体】回答： ## 1. 问题背景： Transformer 的 Self-Attention 计算中，每个新 token 需要和之前所有 token 计算注意力。自回归生成时，第 N 个 token 的 K、V 与前 N-1 个 token 重复计算。 ## 2. KV Cache 原理：在自回归生成过程中，缓存每一层的 K（Key）和 V（Value）矩阵。生成第 N+1 个 token 时：只需要计算新 token 的 Q、K、V。使用缓存的 K、V 与新的 Q 计算注意力。将新的 K、V 追加到缓存中。避免了重复计算前 N 个 token 的 K 和 V。 ## 3. 计算复杂度对比：不使用 KV Cache：生成 n 个 token 的总计算量∝ n³ 使用 KV Cache：生成 n 个 token 的总计算量∝ n² ## 4. 内存开销： …</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「3. Self-Attention：Transformer 的灵魂」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q5</span><span class="guide-q-text">RLHF 和 DPO 的区别？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>回答：</p>
<p class="guide-a-step"><strong>1. RLHF（Reinforcement Learning from Human Feedback）：</strong></p>
<p>流程：SFT → 训练 Reward Model → PPO 优化第一步（SFT）： 用高质量数据做监督微调。第二步（Reward Model）： 收集人类偏好数据（A 回答 vs B 回答，标注哪个更好），训练奖励模型。第三步（PPO）： 用 PPO 算法优化策略模型，最大化奖励模型的打分。优点： 效果好，是 ChatGPT 等模型使用的方法。缺点： 流程复杂（需要训练两个模型）、PPO 训练不稳定、超参数敏感。</p>
<p class="guide-a-step"><strong>2. DPO（Direct Preference Optimization）：</strong></p>
<p>流程：SFT → 直接从偏好数据优化核心思想：跳过 Reward Model，直接从偏好数据优化策略模型。数学上证明了 DPO 的目标函数等价于 RLHF 的最优解。损失函数：L_DPO = -log σ(β(log π(y_w|x)/π_ref(y_w|x) - log π(y_l|x)/π_ref(y_l|x)))y_w：偏好回答（win），y_l：不偏好回答（lose）π_ref：参考模型（SFT 模型）优点： 简单（只需训练一个模型）、稳定、超参少。缺点： 依赖高质量的偏好数据对。</p>
<p class="guide-a-step"><strong>3. 对比表：</strong></p>
<p>| 维度 | RLHF | DPO || --- | --- | --- || 训练步骤 | 3步 | 2步 || 需要 Reward Model | 是 | 否 || --- | --- | --- || 训练稳定性 | 较低（PPO 敏感） | 较高 || 数据需求 | 需要偏好数据 | 需要偏好数据 || 效果 | 略好（理论上限更高） | 接近 RLHF || 工程复杂度 | 高 | 低 || 推理开销 | 无额外开销 | 无额外开销 |</p>
<p class="guide-a-step"><strong>4. 实际选择： 大多数场景下推荐 DPO，因为工程实现简单、效果接近。RLHF 在追求极致效果且</strong></p>
<p>有充足工程资源时考虑。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】回答： ## 1. RLHF（Reinforcement Learning from Human Feedback）：流程：SFT →训练 Reward Model → PPO 优化第一步（SFT）：用高质量数据做监督微调。</p><p>【为什么考这个】对比题考「边界感」：什么场景用 A、什么场景用 B、能不能混合。背差异表不够，要说控制流在谁手里。</p><p>【拆开理解】</p><p>1. 1. RLHF（Reinforcement Learning from Huma… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. 2. DPO（Direct Preference Optimization）：流… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. 3. 对比表：维度 RLHF DPO 训练步骤 3步 2步需要 Reward M… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 4. 实际选择：大多数场景下推荐 DPO，因为工程实现简单、效果接近。RLHF … → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】可以把 Agent 想成「会自己查资料、记笔记、调系统的数字员工」，比普通 ChatBot 多了闭环和多步决策。</p><p>【常见误区】</p><p>1. 只说 A 好 B 不好，没有说混合方案或选型条件。</p><p>【面试怎么答】15 秒结论（谁适合什么）→ 各 30 秒说 A/B 特点 → 20 秒混合方案 → 10 秒业务例子。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「大模型微调面试怎么答？SFT、RLHF、DPO、PPO 到底还有没有必要？」（/custom/kama-finetune/finetuning_sft_rlhf_interview） — 要点：- 先说结论：微调没有消失，只是价值变了…</p><p>· 「SFT 之后还有哪些 Post-Training？RLHF、DPO、GRPO、拒…」（/custom/xiaolin-llm/post_training） — 要点：我理解 Post-Training 是个上位概念，指的是 SFT 之后所有继续提升模型质量的训练阶段…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 本题 4 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：大模型微调面试怎么答？SFT、RLHF、DPO、PPO 到底还有没有必要？、SFT 之后还有哪些 Post-Training？RLHF、DPO、GRPO、拒…。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】这类对比题我会先说选型结论，再分点讲两者差异，最后说怎么混合用。</p><p>【主体】回答： ## 1. RLHF（Reinforcement Learning from Human Feedback）：流程：SFT →训练 Reward Model → PPO 优化第一步（SFT）：用高质量数据做监督微调。第二步（Reward Model）：收集人类偏好数据（A 回答 vs B 回答，标注哪个更好），训练奖励模型。第三步（PPO）：用 PPO 算法优化策略模型，最大化奖励模型的打分。优点：效果好，是 ChatGPT 等模型使用的方法。缺点：流程复杂（需要训练两个模型）、PPO 训练不稳定、超参数敏感。 ## 2. DPO（Direct Preference Optimization）：流程：SFT →直接从偏好数据优化核心思想：跳过 Reward Model，直接从偏好数据优化策略模型。数学上证明了 DPO 的目标函数等价于 RLH…</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「大模型微调面试怎么答？SFT、RLHF、DPO、PPO 到底还有没有必要？」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q6</span><span class="guide-q-text">Embedding 模型是怎么训练的？对比学习怎么做的？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>回答：</p>
<p class="guide-a-step"><strong>1. 训练目标： 让语义相似的文本在向量空间中距离更近，语义不同的文本距离更远。</strong></p>
<p class="guide-a-step"><strong>2. 对比学习（Contrastive Learning）：</strong></p>
<p>正样本对（Positive Pair）： 语义相近的文本对（如问题-答案、标题-正文）。负样本对（Negative Pair）： 语义不相关的文本对。InfoNCE 损失函数：L = -log(exp(sim(q, k+)/τ) / Σ exp(sim(q, ki)/τ))sim：余弦相似度τ：温度参数（控制分布的锐度）k+：正样本，ki：所有样本（包含 in-batch 负样本）</p>
<p class="guide-a-step"><strong>3. 负样本策略：</strong></p>
<p>In-batch Negatives： 同一 batch 内其他样本的正样本作为当前样本的负样本。Hard Negatives： 挖掘语义相近但答案不同的样本（更有挑战性的负样本）。Hard negative mining 对效果提升非常关键。</p>
<p class="guide-a-step"><strong>4. 训练数据来源：</strong></p>
<p>搜索日志中的 query-doc 点击对。NLI 数据集（蕴含关系作为正样本）。人工标注的相似句对。数据增强：回译、同义替换等。</p>
<p class="guide-a-step"><strong>5. BGE 系列的训练策略：</strong></p>
<p>预训练：RetroMAE（基于 masked auto-encoding）。微调：大规模对比学习 + hard negative mining。指令微调：让 embedding 模型能理解 query 前的指令（如"为这个查询检索相关段落："）。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】回答： ## 1. 训练目标：让语义相似的文本在向量空间中距离更近，语义不同的文本距离更远。</p><p>【为什么考这个】对比题考「边界感」：什么场景用 A、什么场景用 B、能不能混合。背差异表不够，要说控制流在谁手里。</p><p>【拆开理解】</p><p>1. 1. 训练目标：让语义相似的文本在向量空间中距离更近，语义不同的文本距离更远 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. 2. 对比学习（Contrastive Learning）：正样本对（Posit… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. InfoNCE 损失函数： L = -log(exp(sim(q, k+)/τ)… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 3. 负样本策略： In-batch Negatives：同一 batch 内其… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. Hard Negatives：挖掘语义相近但答案不同的样本（更有挑战性的负样本） → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. Hard negative mining 对效果提升非常关键 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只说 A 好 B 不好，没有说混合方案或选型条件。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>【面试怎么答】15 秒结论（谁适合什么）→ 各 30 秒说 A/B 特点 → 20 秒混合方案 → 10 秒业务例子。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Embedding 模型选择与微调策略」（/custom/ai100-rag/015-embedding-model-selection） — 要点：Embedding 模型的选择直接决定 RAG 检索质量。2025-2026 年的格局：**Voyage AI voyage-3-large** 与 **Cohere embed-v4** 在 MTE…</p><p>· 「8. Embedding 模型怎么选？中文场景选什么？」（/custom/kama-rag/rag_interview-q8） — 要点：面试官会问：&amp;quot;你们用的什么 Embedding 模型…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：Embedding 模型选择与微调策略、8. Embedding 模型怎么选？中文场景选什么？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】这类对比题我会先说选型结论，再分点讲两者差异，最后说怎么混合用。</p><p>【主体】回答： ## 1. 训练目标：让语义相似的文本在向量空间中距离更近，语义不同的文本距离更远。 ## 2. 对比学习（Contrastive Learning）：正样本对（Positive Pair）：语义相近的文本对（如问题-答案、标题-正文）。负样本对（Negative Pair）：语义不相关的文本对。 InfoNCE 损失函数： L = -log(exp(sim(q, k+)/τ) / Σ exp(sim(q, ki)/τ)) sim：余弦相似度τ：温度参数（控制分布的锐度） k+：正样本，ki：所有样本（包含 in-batch 负样本） ## 3. 负样本策略： In-batch Negatives：同一 batch 内其他样本的正样本作为当前样本的负样本。 Hard Negatives：挖掘语义相近但答案不同的样本（更有挑战性的负样本）。 H…</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「Embedding 模型选择与微调策略」里有更完整的口播示范，建议对照练一遍。</p><p>如果追问为什么不用纯向量，我会说：编号、专有名词、精确匹配 BM25 更稳，所以 Hybrid + 重排是常态。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q7</span><span class="guide-q-text">向量数据库的索引原理是什么？HNSW 怎么工作的？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>回答：</p>
<p class="guide-a-step"><strong>1. 向量检索的核心挑战：</strong></p>
<p>暴力搜索（Brute-force）：O(n) 复杂度，数据量大时不可接受。需要近似最近邻搜索（ANN）算法，牺牲一点精度换取大幅的速度提升。</p>
<p class="guide-a-step"><strong>2. 主流索引类型：</strong></p>
<p>| 索引类型 | 原理 | 适用场景 || --- | --- | --- || IVF | 聚类 + 倒排 | 大数据量、内存充足 || HNSW | 层次化可导航小世界图 | 高召回要求 |DiskANN     基于磁盘的 ANN               超大规模、内存有限Flat        暴力搜索                    小数据量、100%召回</p>
<p class="guide-a-step"><strong>3. HNSW（Hierarchical Navigable Small World）工作原理：</strong></p>
<p>构建阶段：多层图结构，底层包含所有节点，高层只包含少量节点。插入新节点时，随机决定它出现在哪些层（指数衰减概率）。在每一层，新节点与最近的 M 个邻居建立边。搜索阶段：从最高层的入口点开始搜索。在每层中贪心地向目标方向移动。逐层下降，到底层后精确搜索最近邻。关键参数：M：每个节点的最大邻居数（影响精度和内存）。efConstruction：构建时的搜索宽度（影响构建质量和速度）。ef：搜索时的搜索宽度（影响搜索精度和速度）。</p>
<p class="guide-a-step"><strong>4. HNSW 的优劣：</strong></p>
<p>优点： 高召回率（99%+），搜索速度快（O(log n)），支持增量插入。缺点： 内存占用大（需要存储图结构），构建速度较慢。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】回答： ## 1. 向量检索的核心挑战：暴力搜索（Brute-force）：O(n) 复杂度，数据量大时不可接受。</p><p>【为什么考这个】定义题考你能不能「用类比 + 结构」讲清楚，而不是堆术语。面试官想确认你真的理解，而不是背过。</p><p>【拆开理解】</p><p>1. 1. 向量检索的核心挑战：暴力搜索（Brute-force）：O(n) 复杂度，… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. 2. 主流索引类型：索引类型原理适用场景 IVF 聚类 + 倒排大数据量、内存充… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. 3. HNSW（Hierarchical Navigable Small Wor… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. efConstruction：构建时的搜索宽度（影响构建质量和速度） → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. ef：搜索时的搜索宽度（影响搜索精度和速度） → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 4. HNSW 的优劣：优点：高召回率（99%+），搜索速度快（O(log n)… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只背一句定义，没有说「和普通 LLM 单次调用差在哪」。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>【面试怎么答】15 秒定义 → 30 秒展开组件/流程 → 15 秒举例 → 10 秒和 ChatBot/Chain 的区别。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Agent 编排模式：Hub-Spoke、Pipeline、Hierarchical」（/custom/ai100-multi-agent/033-orchestration-patterns） — 要点：多 Agent 编排模式决定了 Agent 之间的控制流和协作结构。三种核心模式：**Pipeline（顺序流水线）**——Agent 按预定顺序链式执行，前一个的输出是后一个的输入，适合线性处理流程…</p><p>· 「层级多 Agent 团队（Hierarchical）怎么设计？」（/custom/langgraph-multi/052-hierarchical-agents） — 要点：多 Agent 编排我最常见的是 Supervisor 模式，复杂场景再拆子图。层级多 Agent（Hierarchical）模式适合「任务自然分层」的大型协作场景，与扁平 Supervisor 形成…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：Agent 编排模式：Hub-Spoke、Pipeline、Hierarchical、层级多 Agent 团队（Hierarchical）怎么设计？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我先给一个清晰定义，再用类比帮你建立直觉，最后说和生产的关系。</p><p>【主体】回答： ## 1. 向量检索的核心挑战：暴力搜索（Brute-force）：O(n) 复杂度，数据量大时不可接受。需要近似最近邻搜索（ANN）算法，牺牲一点精度换取大幅的速度提升。 ## 2. 主流索引类型：索引类型原理适用场景 IVF 聚类 + 倒排大数据量、内存充足 HNSW 层次化可导航小世界图高召回要求 DiskANN 基于磁盘的 ANN 超大规模、内存有限 Flat 暴力搜索小数据量、100%召回 ## 3. HNSW（Hierarchical Navigable Small World）工作原理：构建阶段：多层图结构，底层包含所有节点，高层只包含少量节点。插入新节点时，随机决定它出现在哪些层（指数衰减概率）。在每一层，新节点与最近的 M 个邻居建立边。搜索阶段：从最高层的入口点开始搜索。在每层中贪心地向目标方向移动。逐层下降，到底层后精确…</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「Agent 编排模式：Hub-Spoke、Pipeline、Hierarchical」里有更完整的口播示范，建议对照练一遍。</p><p>如果追问为什么不用纯向量，我会说：编号、专有名词、精确匹配 BM25 更稳，所以 Hybrid + 重排是常态。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q8</span><span class="guide-q-text">Prompt Engineering 有哪些关键技巧？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>回答：</p>
<p class="guide-a-step"><strong>1. 结构化 Prompt 设计：</strong></p>
<p>明确角色定义（Role）。清晰的任务描述（Task）。输出格式约束（Format）。必要的限制条件（Constraints）。高质量示例（Few-shot Examples）。</p>
<p class="guide-a-step"><strong>2. 关键技巧：</strong></p>
<p>Chain of Thought（CoT）： 引导模型逐步推理。请一步一步分析这个问题：</p>
<p class="guide-a-step"><strong>1. 首先...</strong></p>
<p class="guide-a-step"><strong>2. 然后...</strong></p>
<p class="guide-a-step"><strong>3. 最终...</strong></p>
<p>Few-shot Learning： 提供 2-3 个高质量示例。示例1：输入：XXX输出：YYY示例2：输入：AAA输出：BBB现在请处理：输入：CCC角色扮演： "你是一个拥有 10 年经验的企业架构师"。否定指令： "不要编造信息" 比 "请确保准确" 更有效。输出锚定： 在 Prompt 末尾给出输出的开头，引导格式：请以JSON格式输出：{"result":</p>
<p class="guide-a-step"><strong>3. 高级技巧：</strong></p>
<p>Self-consistency： 多次采样后投票，提高结果可靠性。ReAct Prompting： Thought-Action-Observation 循环。Instruction Hierarchy： 系统指令 &gt; 用户指令，防止 Prompt 注入。</p>
<p class="guide-a-step"><strong>4. 常见陷阱：</strong></p>
<p>Prompt 过长导致注意力分散。矛盾的指令导致模型困惑。缺少格式示例导致输出不可解析。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】这题和 ReAct、Safety、Prompt 都相关，属于 Agent 面试的高频交叉点。</p><p>【拆开理解】</p><p>1. 1. 结构化 Prompt 设计：明确角色定义（Role）。清晰的任务描述（Ta… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. 2. 关键技巧： Chain of Thought（CoT）：引导模型逐步推理。… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. 1. 首先... ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 2. 然后... ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 3. 最终... Few-shot Learning：提供 2-3 个高质量示例… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 3. 高级技巧： Self-consistency：多次采样后投票，提高结果可靠… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像侦探办案：先推理（Thought），再行动查线索（Action），看结果（Observation），循环直到破案。</p><p>【常见误区】</p><p>1. 把 ReAct 说成「想一步做一步」但说不清 Observation 从哪来、何时停止。</p><p>2. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「推理策略详解：Chain-of-Thought 与 Tree-of-Thought」（/custom/ai100-planning/049-cot-and-tot） — 要点：Chain-of-Thought (CoT) 和 Tree-of-Thought (ToT) 是两种主流的 LLM 推理策略。**CoT 是线性推理**——通过引导模型"一步步思考"而非直接给出答案，…</p><p>· 「Prompt Chaining：多步骤 Prompt 的设计与编排」（/custom/ai100-prompt/063-prompt-chaining） — 要点：Prompt Chaining（提示链）是将复杂任务分解为多个顺序执行的 LLM 调用，每个调用的输出作为下一个调用的输入。它是 Agentic AI 中最基础的设计模式，也被称为 Pipeline …</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 架构：步数上限、停止条件、死循环检测、Plan+ReAct 混合、画拓扑图。</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：推理策略详解：Chain-of-Thought 与 Tree-of-Thought、Prompt Chaining：多步骤 Prompt 的设计与编排。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：说清要优化的目标指标</p><p>Action：我重点做了三件事——1. 结构化 Prompt 设计：明确角色定义（Role）。清晰的任务描述（Task）。输出格式约束（Format）。必要的限制条件（Constraints）。高质量示例（Few-shot Examples）；2. 关键技巧： Chain of Thought（CoT）：引导模型逐步推理。请一步一步分析这个问题： ##；1. 首先... ##</p><p>Result：给量化结果，如延迟降 X%、准确率升 Y%</p><p>你也可以补充：本站题库「推理策略详解：Chain-of-Thought 与 Tree-of-Thought」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q9</span><span class="guide-q-text">大模型的 Context Window 限制怎么突破？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>回答：</p>
<p class="guide-a-step"><strong>1. 当前主流模型的 Context Window：</strong></p>
<p>模型                      Context WindowGPT-4o                         128KClaude 3.5                     200KGemini 1.5 Pro                 2MQwen2.5                        128K</p>
<p class="guide-a-step"><strong>2. 长上下文的挑战：</strong></p>
<p>"Lost in the Middle"现象：模型对中间位置的信息关注度低。计算成本随序列长度平方增长。即使模型支持长上下文，实际效果在超长文本时也会下降。</p>
<p class="guide-a-step"><strong>3. 突破方法：</strong></p>
<p>RAG（最推荐）： 不把所有信息放入 context，只检索最相关的部分。Map-Reduce： 分段处理后汇总（详见架构类 Q13）。滑动窗口 + 摘要： 保留最近窗口的完整内容，历史内容用摘要替代。Recursive Summarization： 递归摘要长文本。</p>
<p class="guide-a-step"><strong>4. 工程实践中的策略：</strong></p>
<p>优先使用 RAG，只将最相关的 5 个 chunk 放入 context。长文档分析时使用 Map-Reduce。多轮对话使用滑动窗口 + 摘要压缩。尽量将关键信息放在 context 的开头和结尾（利用 primacy/recency bias）。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】回答： ## 1. 当前主流模型的 Context Window：模型 Context Window GPT-4o 128K Claude 3.5 200K Gemini 1.5 Pro 2M Qwen2.5 128K ## 2. 长上下文的挑战： "Lost in the Middle"现象：模型对中间位置的信息关注度低。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 1. 当前主流模型的 Context Window：模型 Context Win… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. 3.5 200K Gemini → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. 1.5 Pro 2M Qwen2.5 128K ## → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 2. 长上下文的挑战： "Lost in the Middle"现象：模型对中间… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 3. 突破方法： RAG（最推荐）：不把所有信息放入 context，只检索最相… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. Map-Reduce：分段处理后汇总（详见架构类 Q13）。滑动窗口 + 摘要：… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>【面试怎么答】目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「大模型的 RAG 主要用来解决什么问题？」（/custom/xiaolin-rag/rag_problems） — 要点：RAG 主要解决三个问题…</p><p>· 「主流 Coding Agent Harness 横评：Claude Code / C…」（/custom/ai100-frameworks/110-coding-agent-harness-comparison） — 要点：2026 年 Coding Agent Harness 已从"单一 CLI 工具"演化为多层架构产业。Claude Code（Anthropic）、Cursor（Cursor Inc.）、Aider（…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 记忆：事实 vs 推断分开存、写入时机、冲突合并、跨会话权限。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：大模型的 RAG 主要用来解决什么问题？、主流 Coding Agent Harness 横评：Claude Code / C…。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。</p><p>【主体】回答： ## 1. 当前主流模型的 Context Window：模型 Context Window GPT-4o 128K Claude 3.5 200K Gemini 1.5 Pro 2M Qwen2.5 128K ## 2. 长上下文的挑战： "Lost in the Middle"现象：模型对中间位置的信息关注度低。计算成本随序列长度平方增长。即使模型支持长上下文，实际效果在超长文本时也会下降。 ## 3. 突破方法： RAG（最推荐）：不把所有信息放入 context，只检索最相关的部分。 Map-Reduce：分段处理后汇总（详见架构类 Q13）。滑动窗口 + 摘要：保留最近窗口的完整内容，历史内容用摘要替代。 Recursive Summarization：递归摘要长文本。 ## 4. 工程实践中的策略：优先使用 RAG，只将最相关的 …</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「大模型的 RAG 主要用来解决什么问题？」里有更完整的口播示范，建议对照练一遍。</p><p>如果追问为什么不用纯向量，我会说：编号、专有名词、精确匹配 BM25 更稳，所以 Hybrid + 重排是常态。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q10</span><span class="guide-q-text">LLM 的解码策略有哪些？Temperature 和 Top-p 怎么影响输出？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>回答：</p>
<p class="guide-a-step"><strong>1. 贪心解码（Greedy Decoding）：</strong></p>
<p>每一步选择概率最高的 token。确定性输出，但容易重复和死板。</p>
<p class="guide-a-step"><strong>2. 采样（Sampling）：</strong></p>
<p>按概率分布随机采样下一个 token。引入随机性，输出更多样化。</p>
<p class="guide-a-step"><strong>3. Temperature（温度参数）：</strong></p>
<p>P(token_i) = exp(logit_i / T) / Σ exp(logit_j / T)T = 0：等同于贪心解码，完全确定性。T = 1：标准分布，正常采样。T &gt; 1：分布更平坦，低概率 token 被选择的概率增大 → 更随机。T &amp;lt; 1：分布更尖锐，高概率 token 更容易被选择 → 更确定。建议： 事实性任务 T=0，创意任务 T=0.7-1.0。</p>
<p class="guide-a-step"><strong>4. Top-p（Nucleus Sampling）：</strong></p>
<p>只从概率总和达到 p 的最小 token 集合中采样。例如 top_p=0.9：只考虑概率累计到 90% 的 tokens。自适应地控制候选集大小（对比 top-k 固定大小）。</p>
<p class="guide-a-step"><strong>5. Top-k：</strong></p>
<p>只从概率最高的 k 个 token 中采样。简单有效，但 k 的最优值因场景而异。</p>
<p class="guide-a-step"><strong>6. 组合使用：</strong></p>
<p>实际应用中通常组合使用： temperature=0.7, top_p=0.9 。先用 temperature 调整分布，再用 top-p 截断。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】回答： ## 1. 贪心解码（Greedy Decoding）：每一步选择概率最高的 token。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 1. 贪心解码（Greedy Decoding）：每一步选择概率最高的 toke… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. 2. 采样（Sampling）：按概率分布随机采样下一个 token。引入随机性… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. 3. Temperature（温度参数）： P(token_i) = exp(l… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. T = 1：标准分布，正常采样 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. T &gt; 1：分布更平坦，低概率 token 被选择的概率增大→更随机 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 1：分布更尖锐，高概率 token 更容易被选择→更确定。建议：事实性任务 T=… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】可以把 Agent 想成「会自己查资料、记笔记、调系统的数字员工」，比普通 ChatBot 多了闭环和多步决策。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>【面试怎么答】目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「LLM-as-Judge：使用 LLM 评估 LLM 输出」（/custom/ai100-evaluation/071-llm-as-judge） — 要点：LLM-as-Judge 是用一个强大的 LLM（如 GPT-4）自动评估另一个 LLM 输出质量的技术，在成本和质量之间取得了最佳平衡。两种核心模式：**Pointwise 评分**（对单个输出按维…</p><p>· 「文档分块（Chunking）策略有哪些？各有什么优缺点？」（/custom/ai100-rag/013-chunking-strategies） — 要点：主要有三种分块策略：**固定大小分块**（按字符/token 数切分，简单高效但破坏语义）、**递归分块**（按段落→句子→词层次切分，是最推荐的通用默认方案，Recall 85-90%）、**语义分…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：LLM-as-Judge：使用 LLM 评估 LLM 输出、文档分块（Chunking）策略有哪些？各有什么优缺点？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。</p><p>【主体】回答： ## 1. 贪心解码（Greedy Decoding）：每一步选择概率最高的 token。确定性输出，但容易重复和死板。 ## 2. 采样（Sampling）：按概率分布随机采样下一个 token。引入随机性，输出更多样化。 ## 3. Temperature（温度参数）： P(token_i) = exp(logit_i / T) / Σ exp(logit_j / T) T = 0：等同于贪心解码，完全确定性。 T = 1：标准分布，正常采样。 T &gt; 1：分布更平坦，低概率 token 被选择的概率增大→更随机。 T &amp;lt; 1：分布更尖锐，高概率 token 更容易被选择→更确定。建议：事实性任务 T=0，创意任务 T=0.7-1.0。 ## 4. Top-p（Nucleus Sampling）：只从概率总和达到 p 的最小 tok…</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「LLM-as-Judge：使用 LLM 评估 LLM 输出」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q11</span><span class="guide-q-text">什么是 Agent 的工具学习（Tool Learning）？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>回答：</p>
<p class="guide-a-step"><strong>1. 定义： 让 LLM 学会识别何时需要调用外部工具、选择哪个工具、生成正确的参数。</strong></p>
<p class="guide-a-step"><strong>2. 实现方式：</strong></p>
<p>Prompt 方式（主流）：在 Prompt 中描述可用工具的名称、功能、参数格式。LLM 通过 in-context learning 学会调用工具。优点：灵活、无需训练。缺点：受 Prompt 长度限制。Fine-tuning 方式：使用工具调用的标注数据微调模型。如 Gorilla、ToolLLM 等工作。优点：更准确。缺点：需要训练数据。Function Calling（API 级别）：OpenAI、Anthropic 等厂商在 API 层面支持工具调用。模型经过专门训练以支持 function calling。优点：最可靠。缺点：依赖特定厂商。</p>
<p class="guide-a-step"><strong>3. 挑战：</strong></p>
<p>工具选择准确性：工具数量多时容易选错。参数生成：需要正确理解参数的语义和格式。多工具协同：需要理解工具间的依赖关系。错误恢复：工具调用失败后的重试和替代策略。</p>
<p class="guide-a-step"><strong>4. 最佳实践：</strong></p>
<p>工具描述要精确且简洁。提供调用示例（few-shot）。限制单次可选工具数量（建议 ≤ 8）。实现工具调用的输入校验和错误处理。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】回答： ## 1. 定义：让 LLM 学会识别何时需要调用外部工具、选择哪个工具、生成正确的参数。</p><p>【为什么考这个】这题和 Tool、Prompt 都相关，属于 Agent 面试的高频交叉点。</p><p>【拆开理解】</p><p>1. 1. 定义：让 LLM 学会识别何时需要调用外部工具、选择哪个工具、生成正确的参… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. 2. 实现方式： Prompt 方式（主流）：在 Prompt 中描述可用工具的… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. LLM 通过 in-context learning 学会调用工具。优点：灵活、… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. Fine-tuning 方式：使用工具调用的标注数据微调模型。如 Gorilla… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. Function Calling（API 级别）： OpenAI、Anthrop… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 3. 挑战：工具选择准确性：工具数量多时容易选错。参数生成：需要正确理解参数的语… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像给员工配电脑和系统账号：没有工具只能动嘴，有了工具才能查库存、下单、跑代码。</p><p>【常见误区】</p><p>1. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】结论 → 原理 → 例子 → 边界/兜底。控制在 60～90 秒，留时间给追问。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Function Calling 工具设计最佳实践」（/custom/today-interview/function-calling-design） — 要点：每个工具只做一件事、参数少而精、description 包含正例和反例、error 返回结构化而非纯文本——定义好，模型才可能调对。…</p><p>· 「4. Function Call 是什么？底层怎么实现？」（/custom/kama-agent/agent_interview-q4） — 要点：面试官会问：&amp;quot;Function Call 和普通的 Prompt + 正则解析有什么区别…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：Function Calling 工具设计最佳实践、4. Function Call 是什么？底层怎么实现？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我尽量用你能直接复述的结构来答，先结论后展开。</p><p>【主体】回答： ## 1. 定义：让 LLM 学会识别何时需要调用外部工具、选择哪个工具、生成正确的参数。 ## 2. 实现方式： Prompt 方式（主流）：在 Prompt 中描述可用工具的名称、功能、参数格式。 LLM 通过 in-context learning 学会调用工具。优点：灵活、无需训练。缺点：受 Prompt 长度限制。 Fine-tuning 方式：使用工具调用的标注数据微调模型。如 Gorilla、ToolLLM 等工作。优点：更准确。缺点：需要训练数据。 Function Calling（API 级别）： OpenAI、Anthropic 等厂商在 API 层面支持工具调用。模型经过专门训练以支持 function calling。优点：最可靠。缺点：依赖特定厂商。 ## 3. 挑战：工具选择准确性：工具数量多时容易选错。参数生成：…</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「Function Calling 工具设计最佳实践」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q12</span><span class="guide-q-text">什么是 Mixture of Experts（MoE）？为什么重要？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>回答：</p>
<p class="guide-a-step"><strong>1. 核心思想：</strong></p>
<p>模型包含多个"专家"（Expert）网络和一个"路由器"（Router）。每次推理时，路由器只激活少数几个专家（如 8 个中选 2 个）。实现了"大模型容量 + 小模型推理成本"的目标。</p>
<p class="guide-a-step"><strong>2. 架构细节：</strong></p>
<p>输入 → Router → 选择 Top-K Expert → 加权合并输出每个 Expert 是一个独立的 FFN（前馈网络）。Router 是一个轻量级线性层，输出每个 Expert 的激活概率。通常每次激活 2 个 Expert（如 Mixtral 8x7B）。</p>
<p class="guide-a-step"><strong>3. 为什么重要？</strong></p>
<p>参数效率： Mixtral 8x7B 总参数 47B，但每次推理只激活约 13B 参数。推理速度： 与 13B 模型相当的推理速度，但效果接近 70B 模型。训练效率： 可以更高效地扩展模型规模。</p>
<p class="guide-a-step"><strong>4. 代表模型：</strong></p>
<p>Mixtral 8x7B / 8x22B（Mistral AI）Switch Transformer（Google）GPT-4 被推测也是 MoE 架构</p>
<p class="guide-a-step"><strong>5. 挑战：</strong></p>
<p>负载均衡：如何保证每个 Expert 被均匀使用（避免某些 Expert 过载、某些闲置）。通信开销：分布式训练中 Expert 可能分布在不同 GPU 上。路由策略：Router 的训练和稳定性。</p>
<p class="guide-a-step"><strong>6. 对 Agent 系统的影响：</strong></p>
<p>MoE 模型在推理效率和效果之间取得了好的平衡。适合作为 Agent 的基础模型（推理速度快、能力强）。模型路由（选择不同能力的模型）和 MoE 的 Expert 路由（模型内部）是不同层面的路由。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】这题用 STAR 讲故事：背景要短、动作要有决策理由、结果要有数字。下面按段落帮你拆。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 1. 核心思想：模型包含多个"专家"（Expert）网络和一个"路由器"（Rou… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. 2. 架构细节：输入→ Router →选择 Top-K Expert →加权合… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Router 是一个轻量级线性层，输出每个 Expert 的激活概率。通常每次激… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. 3. 为什么重要？参数效率： Mixtral 8x7B 总参数 47B，但每次推… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. 4. 代表模型： Mixtral 8x7B / 8x22B（Mistral AI… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>6. 5. 挑战：负载均衡：如何保证每个 Expert 被均匀使用（避免某些 Expe… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像侦探办案：先推理（Thought），再行动查线索（Action），看结果（Observation），循环直到破案。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 把 ReAct 说成「想一步做一步」但说不清 Observation 从哪来、何时停止。</p><p>3. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】口播结构（约 90 秒）：</p><p>① Situation：1 句业务背景（谁、什么系统、什么痛点）。</p><p>② Task：你的目标指标（延迟、准确率、成本、完成率）。</p><p>③ Action：2～3 个关键决策，每个说「为什么选它而不是别的」。</p><p>④ Result：至少 2 个数字（前后对比或百分比提升）。</p><p>⑤ 收尾：如果重来会怎么改进——显得你有复盘习惯。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」（/custom/xiaolin-agent/patterns） — 要点：我理解 Agent 和 Workflow 最核心的区别是「谁来决定下一步」…</p><p>· 「说说 Single-Agent 和 Multi-Agent 的设计方案？」（/custom/xiaolin-agent/single_multi） — 要点：Single-Agent 适合任务流程清晰、复杂度适中的场景，实现简单、好维护；Multi-Agent 适合需要专业分工、任务量大或者需要并行执行的复杂场景…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 架构：步数上限、停止条件、死循环检测、Plan+ReAct 混合、画拓扑图。</p><p>· 记忆：事实 vs 推断分开存、写入时机、冲突合并、跨会话权限。</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 6 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…、说说 Single-Agent 和 Multi-Agent 的设计方案？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>面试官好，这题我按 STAR 来答。</p><p>Situation：先交代业务背景和系统规模</p><p>Task：说清要优化的目标指标</p><p>Action：我重点做了三件事——1. 核心思想：模型包含多个"专家"（Expert）网络和一个"路由器"（Router）。每次推理时，路由器只激活少数几个专家（如 8 个中选 2 个）。实现了"大模型容量 + 小模型推理成本"的目标；2. 架构细节：输入→ Router →选择 Top-K Expert →加权合并输出每个 Expert 是一个独立的 FFN（前馈网络）；Router 是一个轻量级线性层，输出每个 Expert 的激活概率。通常每次激活 2 个 Expert（如 Mixtral 8x7B）</p><p>Result：给量化结果，如延迟降 X%、准确率升 Y%</p><p>你也可以补充：本站题库「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」里有更完整的口播示范，建议对照练一遍。</p><p>附录：面试技巧</p><p>回答 STAR 法则要点</p></div>
<p class="guide-a-step"><strong>1. Situation（情境）： 简洁描述背景和挑战，让面试官理解上下文。</strong></p>
<p class="guide-a-step"><strong>2. Task（任务）： 明确你需要解决的具体问题。</strong></p>
<p class="guide-a-step"><strong>3. Action（行动）： 重点！详细描述你的分析过程、技术选择和实现方案。多说"我"而不是"我</strong></p>
<p>们"。</p>
<p class="guide-a-step"><strong>4. Result（结果）： 用数据量化成果。没有具体数字时，描述定性的改善。</strong></p>
<p>常见追问应对"为什么不用 XXX 方案？" → 说明你评估过，给出具体的对比理由。"如果数据量增长 10 倍呢？" → 描述水平扩展策略和架构演进路线。"你遇到过什么坑？" → 真实分享踩坑经历和解决方案，展示学习能力。"这个指标怎么测的？" → 描述评估方法、数据集、统计方法。核心竞争力总结</p>
<p class="guide-a-step"><strong>1. 系统思维： 不只是会调 API，而是能设计完整的企业级架构。</strong></p>
<p class="guide-a-step"><strong>2. 工程能力： 不只是 Demo 能跑，而是生产级质量（监控、安全、容错）。</strong></p>
<p class="guide-a-step"><strong>3. 数据驱动： 所有决策都有数据支撑，所有优化都可量化验证。</strong></p>
<p class="guide-a-step"><strong>4. 业务理解： 技术决策以业务价值为导向，不是为了技术而技术。</strong></p>
<p class="guide-a-step"><strong>5. 持续优化： 建立了评估-反馈-优化的持续改进闭环。</strong></p>
<p>本文档总计 92 个问题，涵盖架构设计、技术实现、性能优化、故障处理、工程质量、业务理解、基础知识七大类。 每个回答都力求技术深度和实用性，可直接用于面试准备。 建议结合自己的实际项目经验，适当调整具体的数据和细节。</p>
</div></div>
</div>
