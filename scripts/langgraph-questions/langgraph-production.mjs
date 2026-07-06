/** LangGraph · 工程实践 */
export default [
  {
    slug: '053-pitfalls',
    title: 'LangGraph 踩过什么坑？',
    round: '一面',
    difficulty: '⭐⭐⭐',
    point: '踩坑',
    priority: 'P0',
    freq: '4+ 篇面经',
    source: '牛客 · 某大厂/阿里国际',
    conclusion: '高频坑：并发覆盖 state、没配 reducer、死循环、每请求 compile、checkpoint 膨胀、条件路由不稳定。',
    followups: '怎么监控发现？ · 哪个坑印象最深？',
    keyPoints: ['状态覆盖最常见', 'recursion_limit 要配业务 fallback', '生产禁止重复 compile'],
    oralAnswer: `牛客原题。我踩过：第一，并行节点覆盖同一 state 字段，后写吞前写，配 reducer 才解；第二，ReAct 无限重试，加 step_count 和重复 tool call 检测；第三，每 HTTP 请求 compile 图导致延迟高，改全局单例；第四，什么都塞 state 导致 checkpoint 巨大，划界外置记忆；第五，LLM 条件路由飘，加规则 fallback。

每个坑我会说怎么发现——stream 看 state、LangSmith trace、监控 P99 延迟。面试官要的是真实工程感，不是背概念。`,
  },
  {
    slug: '054-node-quality',
    title: '如何保证某个节点的效果？',
    round: '一面',
    difficulty: '⭐⭐⭐',
    point: '节点质量',
    priority: 'P0',
    freq: '3+ 篇面经',
    source: '牛客 · 阿里淘天',
    conclusion: '节点输入输出契约 + 单元测试 + 离线评测集 + 线上节点级成功率/延迟监控 + bad case 回流。',
    followups: '节点效果不好怎么排查？ · prompt 怎么迭代？',
    keyPoints: ['mock 上游 state 单测节点', '黄金集测该节点输出', '监控按 node 名聚合'],
    oralAnswer: `阿里淘天原题。保证节点效果四件事：定义清晰 IO 契约，输入哪些 state 字段、输出哪些更新；mock state 单测节点函数，不依赖整图跑通；为该节点建离线评测集，比如 intent 节点测分类准确率；线上 LangSmith 按 node 聚合成功率、耗时、token。

效果不好先查是输入 state 脏了、prompt 漂移、还是下游 reducer 合并错了。迭代 prompt 要版本化，A/B 对比节点输出再全量发布。`,
  },
  {
    slug: '055-node-monitoring',
    title: '节点级监控怎么做？',
    round: '一面/二面',
    difficulty: '⭐⭐⭐',
    point: '监控',
    priority: 'P0',
    freq: '2+ 篇面经',
    source: '牛客 · 阿里淘天',
    conclusion: 'trace_id 贯穿、每节点记录耗时/输入输出摘要/错误类型，LangSmith 或自研看板按 node 聚合。',
    followups: '和整体 Agent 监控区别？ · 告警阈值怎么定？',
    keyPoints: ['OpenTelemetry/LangSmith span per node', '记录 attempt 次数', '失败率突增告警'],
    oralAnswer: `阿里问「如何做监控」。我答：每次 invoke 生成 trace_id 写 config，每个节点入口打 span：node_name、duration_ms、state 关键字段摘要、是否异常。LangSmith 自动按图结构展示，或导出 Prometheus 指标。

和整体监控区别：节点级能定位是检索慢还是生成慢，而不是只知道端到端超时。告警看单节点失败率环比、P99 延迟、token 突增。

百度面经也强调评测闭环——监控要和离线集联动，线上 bad case 自动入库。`,
  },
  {
    slug: '056-testing-agents',
    title: '怎么测试 LangGraph Agent？',
    round: '二面',
    difficulty: '⭐⭐⭐',
    point: '测试',
    priority: 'P1',
    freq: '2 篇',
    source: 'GitHub 100 Questions',
    conclusion: '三层：节点单测 mock state；子图集成测；端到端黄金集 + mock LLM/tool 固定输出。',
    followups: '怎么 mock 非确定性 LLM？ · CI 怎么跑？',
    keyPoints: ['节点函数纯函数化最好测', 'mock tools 固定返回', 'snapshot 测 state 演化'],
    oralAnswer: `测试策略分层。单元：每个 node 函数传 mock state，断言返回的 partial update。集成：compile 图但 mock LLM 和 tools 固定响应，测条件边走向是否符合预期。E2E：黄金问题集，记录 state 轨迹 snapshot 对比。

非确定性 LLM 用 recorded responses 或 contract test——只断言结构不断言原文。CI 跑单元+集成，E2E 夜间跑省成本。`,
  },
  {
    slug: '057-deployment',
    title: 'LangGraph 生产环境怎么部署？',
    round: '二面',
    difficulty: '⭐⭐⭐',
    point: '部署',
    priority: 'P1',
    freq: '2 篇',
    source: 'GitHub + 工程实践',
    conclusion: 'FastAPI 暴露 invoke/stream；图全局 compile 单例；Postgres checkpointer；worker 队列处理长任务。',
    followups: 'LangGraph Platform 了解吗？ · 多副本 state 怎么存？',
    keyPoints: ['无状态 API + 有状态 checkpointer', '水平扩展靠共享 Postgres', 'stream 用 SSE/WebSocket'],
    oralAnswer: `部署模式：应用启动 compile 图存全局；FastAPI 路由 POST /chat 调 ainvoke 或 astream，config 带 thread_id；checkpointer 用 Postgres 多副本共享；长任务丢 Celery worker。

别把图编译进 serverless 冷启动——太慢。secrets 走环境变量不进 state。可选 LangGraph Platform 托管，自研就是 Docker + K8s + 共享 PG。

高德/编程导航面经强调 Guardrails 输入输出安全要部署层配合，不只是图内节点。`,
  },
  {
    slug: '058-no-recompile-per-request',
    title: '为什么生产环境不能每个请求都 compile 图？',
    round: '二面',
    difficulty: '⭐⭐',
    point: '性能',
    priority: 'P1',
    freq: '2 篇',
    source: 'CSDN 工程实践',
    conclusion: 'compile 有结构检查和对象构建开销，应应用启动时一次，请求只 invoke 已编译实例。',
    followups: '热更新图怎么做？ · 多版本图共存？',
    keyPoints: ['compile 在 startup 事件', '请求路径零 compile', '版本变更灰度新 graph 实例'],
    oralAnswer: `compile 会做图验证、绑定 checkpointer、构建内部执行计划，毫秒到秒级开销。每请求 compile 在 QPS 高时 CPU 浪费明显，P99 延迟也抖。

正确做法： lifespan 里 compile 存 app.state.graph，路由里直接 invoke。热更新可以加载 graph_v2 实例，按 header 或 tenant 路由到不同版本，旧 thread 用旧图 finish。`,
  },
  {
    slug: '059-graph-migration',
    title: '图定义变更后旧 thread 怎么办？',
    round: '二面',
    difficulty: '⭐⭐⭐',
    point: '迁移',
    priority: 'P1',
    freq: '2 篇',
    source: 'ModelEngine + GitHub',
    conclusion: 'state schema 向后兼容；新字段默认值；删字段写迁移；灰度期间按 thread 版本路由到对应图。',
    followups: '会不会毒化既有 thread？ · 官方迁移指引？',
    keyPoints: ['新增 channel 可选', 'checkpoint 与 schema 版本绑定', '不可兼容时冻结旧 thread'],
    oralAnswer: `ModelEngine 社区题：图变更可能让旧 checkpoint 与新 schema 失配。做法：新增字段给默认值，节点读字段用 .get()；删字段要有迁移脚本把旧 checkpoint 洗一遍；严重不兼容时旧 thread 只允许只读或强制归档，新 thread 用新图。

灰度：graph_version 写 config，路由层选编译实例。LangGraph 文档有 graph migration 指引，面试提到版本化说明考虑过运维。`,
  },
  {
    slug: '060-langgraph-rag',
    title: 'LangGraph 里怎么集成 RAG？',
    round: '一面/二面',
    difficulty: '⭐⭐⭐',
    point: 'RAG 集成',
    priority: 'P1',
    freq: '3+ 篇面经',
    conclusion: 'RAG 作为 retrieve/grade/generate 节点嵌入图，质量门控不通过走 rewrite 环，比线性 RAG Chain 更可控。',
    followups: 'CRAG/Self-RAG 怎么画？ · 和科研问答项目怎么讲？',
    keyPoints: ['retrieve → grade → 分支', '不够好 rewrite query 回 retrieve', 'cite_check 再环'],
    oralAnswer: `RAG 不是 LangGraph 外挂，而是图中的节点链：retrieve_node 调向量库写 retrieval_docs；grade_node LLM 评判相关性；条件边不够则 rewrite_query_node 回到 retrieve，够了则 generate_node；可选 cite_check 不通过回 generate。

比线性 Chain 强在：检索失败能改写重试，生成能据引用校验回流。科研问答项目就是这套——意图路由 + 质量门控 + 引用校验环，面试最好画 state 字段和边。

阿里淘天面经捆绑问 RAG 分块、重叠，可接在 retrieve 节点实现细节后讲。`,
  },
  {
    slug: '061-crag-self-rag-adaptive',
    title: 'Corrective RAG / Self-RAG / Adaptive RAG 怎么用 LangGraph 实现？',
    round: '二面',
    difficulty: '⭐⭐⭐⭐',
    point: '高级 RAG',
    priority: 'P2',
    freq: '1 篇',
    source: 'GitHub 100 Questions',
    conclusion: 'CRAG：grade 后不好则 web_search 补检索；Self-RAG：生成带自评 token 条件回流；Adaptive：入口 router 选 RAG 策略。',
    followups: '和科研问答 grade_retrieval 关系？',
    keyPoints: ['每种是不同条件边拓扑', 'Self-RAG 多 generate+critique 环', 'Adaptive 多一路由节点'],
    oralAnswer: `三种都是图拓扑差异。CRAG：grade 节点判相关低 → 条件边到 web_search 节点补资料 → 再 merge 回 context → generate。Self-RAG：generate 输出含 is_supported 自评，不支持则回 retrieve 或 rewrite。Adaptive：入口 router 根据问题类型选 vector RAG、不用 RAG 直答、或 SQL 路径。

科研问答的 grade_retrieval + rewrite 就是 CRAG 思想。讲清楚「论文里的算法 = 图上的节点和边」，面试官会认为你真做过。`,
  },
  {
    slug: '062-context-compression',
    title: 'LangGraph 里上下文压缩怎么做？',
    round: '一面',
    difficulty: '⭐⭐⭐',
    point: '上下文',
    priority: 'P1',
    freq: '3+ 篇面经',
    source: '牛客 · 某大厂/字节',
    conclusion: '在图中加 trim/summarize 节点，进 LLM 前裁剪 messages；可多层：工具结果摘要、滚动摘要、长期记忆检索回填。',
    followups: '压缩过度怎么发现？ · 字节三层压缩怎么答？',
    keyPoints: ['独立 compression 节点', '保留 system+最近 k 轮+摘要', '压缩触发条件写 state token 估计'],
    oralAnswer: `某大厂面经「上下文压缩方式」。在 LangGraph 里压缩是显式节点：before_llm 节点估算 token，超阈值则 summarize 旧 messages 写 summary 字段，trim messages 只留最近几轮+摘要。

字节追问三层压缩——可答：工具输出摘要层、对话滚动摘要层、长期记忆检索层，每层不同触发条件和保留策略，不一致因为信息密度不同。

压缩过度看评测集答案质量跌、或用户追问「你忘了刚才说的」——监控 summary 丢失实体数。`,
  },
  {
    slug: '063-langsmith-observability',
    title: 'LangGraph 与 LangSmith 可观测性怎么集成？',
    round: '二面',
    difficulty: '⭐⭐⭐',
    point: '可观测',
    priority: 'P1',
    freq: '2 篇',
    source: 'GitHub 100 Questions',
    conclusion: '设 LANGCHAIN_TRACING 环境变量自动 trace 每节点；可看轨迹、评测、对比 prompt 版本。',
    followups: '不用 LangSmith 怎么自建？ · 成本数据从哪来？',
    keyPoints: ['自动记录 node/LLM/tool span', 'dataset 回归评测', '反馈 bad run 到数据集'],
    oralAnswer: `LangSmith 和 LangGraph 同属生态，开 tracing 后每次 invoke 自动记录节点输入输出、LLM 调用、tool 延迟。用于 debug 走错哪条边、对比 prompt 版本、跑 dataset 回归。

不用 LangSmith 可 OpenTelemetry 自研：节点入口出口打 span，属性带 thread_id、node_name。成本从 LLM callback 聚合 token。

百度面经强调评测闭环——LangSmith 是把在线 trace 沉淀成离线评测集的桥梁。`,
  },
  {
    slug: '064-production-ready',
    title: '如何构建生产级（Production-Ready）LangGraph Agent？',
    round: '二面',
    difficulty: '⭐⭐⭐⭐',
    point: '生产级',
    priority: 'P1',
    freq: '2 篇',
    source: 'GitHub Production Guide',
    conclusion: '清单：全局 compile、Postgres checkpoint、HITL 高危操作、分层重试、节点监控、评测集、限流熔断、schema 版本化。',
    followups: '和生产 demo 最大差别？ · 第一优先级做什么？',
    keyPoints: ['可恢复 > 可观测 > 可评测', '幂等和 HITL 缺一不可', '别跳过 Workflow 验证阶段'],
    oralAnswer: `生产级 checklist：图启动单例 compile；Postgres checkpointer + thread 隔离；高危节点 interrupt；tool 幂等；recursion_limit + fallback；节点级 trace 和告警；离线黄金集+在线抽检；输入输出 Guardrails；限流熔断；state schema 版本管理。

GitMMQ 生产指南核心观点：LangGraph 价值是把黑盒循环变成可审计状态机。推荐路径：先用简单 agent 验证业务，遇到状态/循环/审批痛点再迁 LangGraph，配 LangSmith 评测。

和 demo 最大差别：考虑了崩溃恢复、幂等、监控、bad case 闭环，而不是 invoke 能跑通就行。`,
  },
]
