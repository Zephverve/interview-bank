/** LangGraph · 状态管理 */
export default [
  {
    slug: '013-state-design',
    title: 'LangGraph 里的状态 State 怎么设计？',
    round: '一面/二面',
    difficulty: '⭐⭐⭐',
    point: 'State 设计',
    priority: 'P0',
    freq: '4+ 篇面经',
    source: '牛客 · 阿里淘天',
    conclusion:
      '从业务流程出发定义 TypedDict，标注每字段更新策略（append/merge/覆盖/清空），图内只放当前任务必需数据。',
    followups: '字段太多怎么办？ · 重构 state 成本高吗？',
    keyPoints: [
      '只放跨节点共享的数据，工具局部变量不进 state',
      'messages 用 add_messages append-only',
      '临时字段在特定边之后清空，防 checkpoint 膨胀',
    ],
    oralAnswer: `State 设计我习惯四步。先画业务流程，标出决策点和回退路径。再定义 TypedDict，给每个字段注明更新策略：messages 是 append-only，current_intent 覆盖写，temp_search_results 在汇总后清空。

原则有三：只放跨节点共享的，不要把数据库连接、HTTP client 这类不可序列化对象塞进去；列表类字段必须配 reducer，否则并发节点会覆盖；图里只留当前任务推进必需的，跨会话历史和知识库走外置存储。

阿里面经爱问「节点间状态流转」——本质就是这份 schema 约定。团队里没人写 reducer 语义，半年后图会变成谁也不敢动的黑箱，所以我会把 state 演化策略写进 README 或代码注释。`,
  },
  {
    slug: '014-agentstate-vs-global',
    title: 'AgentState 的作用是什么？为什么不用全局变量？',
    round: '一面',
    difficulty: '⭐⭐⭐',
    point: 'AgentState',
    priority: 'P0',
    freq: '4+ 篇面经',
    source: '牛客 · 某大厂/阿里国际',
    conclusion:
      'AgentState 是图级共享状态，支持 reducer 合并和 checkpoint 序列化；全局变量并发不安全、无历史、无法断点恢复。',
    followups: '多线程部署怎么办？ · state 和 session 区别？',
    keyPoints: [
      '贯穿 graph 的共享对象，节点返回 partial update',
      '全局变量并发写不可预测，且无快照',
      'AgentState 可 checkpoint 恢复，支持条件恢复',
    ],
    oralAnswer: `AgentState 是 LangGraph 里贯穿整个图的数据结构，每个节点读写它，但节点只返回更新片段，由框架按 reducer 合并。

不用全局变量原因很实在。第一，并发安全——节点可能并行执行，两个节点同时改全局变量，结果不可预测；State 的 reducer 定义了合并语义。第二，不可回溯——全局变量改完就丢了，State 每次更新可进 checkpoint，方便 debug 和重放。第三，无法恢复——图执行到一半挂了，全局变量状态没了，AgentState 可从序列化快照原样恢复。

这和「session」也不同：thread_id 是编排会话槽，业务主键如订单号应放 state 字段里，恢复时用业务键做幂等，别把领域模型和框架状态糊在一个大 dict。`,
  },
  {
    slug: '015-reducer',
    title: 'reducer 是什么？为什么并行节点更新状态时需要 reducer？',
    round: '一面',
    difficulty: '⭐⭐⭐',
    point: 'Reducer',
    priority: 'P0',
    freq: '4+ 篇面经',
    conclusion:
      'reducer 定义多节点写同一 channel 时的合并语义；无 reducer 则后写覆盖先写，并发时会丢数据。',
    followups: 'add_messages 特别在哪？ · 自定义 reducer 怎么写？',
    keyPoints: [
      'Annotated[List, add] 表示追加而非覆盖',
      '并行分支写同一 key 必须声明合并逻辑',
      'operator.add / 自定义 merge 函数均可',
    ],
    oralAnswer: `reducer 是挂在 state 字段上的合并函数。节点返回 partial update 时，如果多个节点在同一 super-step 写同一字段，框架用 reducer 决定怎么合——默认是覆盖，最后写的赢。

并行节点场景下，如果没 reducer，两个节点同时改 messages 或 tool_results，后执行的直接覆盖先执行的，完全没有警告。这是阿里国际面经里最高频的踩坑之一。

常见写法：messages 用 Annotated[list, add_messages]，工具结果用自定义 merge dict。面试要说清 reducer 不是语法糖，是在约束「并发写同一字段时语义是什么」——团队得写这份约定，否则图不可维护。`,
  },
  {
    slug: '016-add-messages',
    title: 'add_messages 和 MessagesState 有什么特别之处？',
    round: '一面',
    difficulty: '⭐⭐',
    point: '消息通道',
    priority: 'P1',
    freq: '2 篇',
    source: 'ModelEngine 社区',
    conclusion:
      'add_messages 智能合并消息列表，支持去重和 RemoveMessage 撤回，比 operator.add 更适合对话轨迹。',
    followups: '消息太多怎么裁剪？ · 和 conversation buffer 关系？',
    keyPoints: [
      '内置 reducer，按 message id 去重合并',
      '支持 RemoveMessage 做撤回/修订',
      'MessagesState 是预置的 messages-only schema',
    ],
    oralAnswer: `add_messages 是 LangGraph 为对话场景定制的 reducer。相比简单 list append，它能按 message id 智能合并、去重，还支持 RemoveMessage 在图执行中撤回或替换某条消息，适合「人类修改草稿后继续」这类场景。

MessagesState 则是预置的 TypedDict，只有 messages 一个 channel 且已配好 add_messages，快速搭聊天 Agent 很省事。

生产里消息会膨胀，所以要在图里加 trim 节点或 summarization 节点，在进 LLM 前裁剪历史，而不是无限往 state 里堆。这和 checkpoint 膨胀是同一类问题。`,
  },
  {
    slug: '017-typeddict-vs-pydantic',
    title: 'State 用 TypedDict 还是 Pydantic 定义？',
    round: '一面',
    difficulty: '⭐⭐',
    point: 'Schema 定义',
    priority: 'P2',
    freq: '1 篇',
    source: '官方文档',
    conclusion:
      '两者均可；TypedDict 更轻量常用，Pydantic 提供运行时校验，适合对 state 输入输出要严格验证的场景。',
    followups: '序列化有什么限制？ · 嵌套对象怎么处理？',
    keyPoints: [
      'State schema 是所有节点的输入输出契约',
      '必须可 JSON 序列化才能 checkpoint',
      'Pydantic 校验更严，TypedDict 性能更好',
    ],
    oralAnswer: `LangGraph 的 State 可以是 TypedDict 或 Pydantic BaseModel。工程里 TypedDict 更常见，配合 Annotated 声明 reducer，类型提示够用且轻量。Pydantic 适合需要运行时校验的场景，比如防止节点写入非法枚举值。

无论哪种，checkpoint 要求 state 可序列化——dict、list、str、int 没问题，开着的 DB 连接、socket 不行。嵌套结构用 plain dict 比自定义 class 省事。

选型我会从最小 schema 起步，边跑边加字段，避免一开始过度设计导致后期重构痛苦。`,
  },
  {
    slug: '018-state-flow-between-nodes',
    title: '每个节点之间的状态流转是什么样的？',
    round: '一面',
    difficulty: '⭐⭐⭐',
    point: '状态流转',
    priority: 'P0',
    freq: '3+ 篇面经',
    source: '牛客 · 阿里淘天',
    conclusion:
      '节点读当前 state → 返回 partial update → reducer 合并 → 条件边决定下一节点；本质是 S_{t+1} = merge(S_t, node_output)。',
    followups: '怎么保证节点效果？ · 复杂对象怎么传？',
    keyPoints: [
      '节点不 mutate state，只返回 dict',
      '合并后整条 state 传给下一节点',
      '条件边读合并后的 state 做路由',
    ],
    oralAnswer: `阿里淘天一面原题。状态流转是：框架把当前完整 state 传给节点函数，节点返回一个只含变更字段的 dict，框架用 reducer 合并进全局 state，然后根据边定义决定下一个节点。

比如流程是 intent_node → 写 current_intent → 条件边读 intent 路由到 rag_node 或 tool_node → rag_node append retrieval_docs → summarize_node 读 docs 生成答案。每一步下一节点看到的都是合并后的最新 state。

复杂数据表面是 TypedDict 堆字段，实质是状态演化策略——哪些 append、哪些 merge、哪些在路由后清空。讲流转时最好画一张图，标出每个节点读写哪些字段。`,
  },
  {
    slug: '019-state-serialization',
    title: 'State 里能放什么？有哪些序列化限制？',
    round: '一面',
    difficulty: '⭐⭐',
    point: '序列化',
    priority: 'P1',
    freq: '2 篇',
    source: 'CSDN + 工程实践',
    conclusion:
      '只放可 JSON/msgpack 序列化的数据；不可放 DB 连接、模型实例；大对象放引用 ID，用时再取。',
    followups: '图片二进制怎么处理？ · checkpoint 存多大合适？',
    keyPoints: [
      'checkpoint 需要序列化整个 state',
      '放 ID/URI 代替大 blob',
      '敏感字段要脱敏或加密',
    ],
    oralAnswer: `State 只能放 checkpointer 能序列化的东西：基本类型、dict、list、Pydantic 可转 dict 的模型。不能放数据库连接、已加载的 ML 模型、lambda 这类不可 pickle 的对象——否则 checkpoint 会炸。

工程实践：PDF 内容、图片放对象存储，state 里只留 doc_id 或 chunk_id；检索结果放摘要而非全文，全文用时再拉。敏感信息如 API key 绝不进 state，走 config 或密钥服务。

这也是 checkpoint 膨胀治理的一部分——state 越小，恢复越快，存储越便宜。`,
  },
  {
    slug: '020-concurrent-write',
    title: '如何处理并发节点写同一 state 字段？',
    round: '一面/二面',
    difficulty: '⭐⭐⭐',
    point: '并发冲突',
    priority: 'P0',
    freq: '4+ 篇面经',
    source: '阿里国际面经',
    conclusion:
      '为字段配置 reducer 做合并写；或拆 channel 避免并行写同一 key；绝不做无保护的覆盖写。',
    followups: '怎么发现覆盖问题？ · Send 并行后怎么 reduce？',
    keyPoints: [
      '列表用 add / add_messages 追加',
      '字典用自定义 merge',
      '并行分支写不同 key 再汇总节点合并',
    ],
    oralAnswer: `这是 LangGraph 最高频踩坑。两个并行节点写同一字段，默认后者覆盖前者。解法优先级：第一，给字段配 reducer，改成合并写；第二，重构图让并行分支写不同 key，在下游汇总节点一次性 merge；第三，如果业务允许，用 Send API fan-out 后由 reducer 聚合结果。

阿里国际面经的原话是「判断字段是否已被别的节点改过」——工程上更靠谱的是从设计上消灭并发写同一无 reducer 字段，而不是运行时检测。

发现这类问题靠 stream 观察每步 state 变化，或 LangSmith trace 看并行 super-step 的写入顺序。`,
  },
  {
    slug: '021-checkpoint-bloat',
    title: 'checkpoint 膨胀怎么防止？图内 state 和外置记忆怎么划界？',
    round: '二面',
    difficulty: '⭐⭐⭐⭐',
    point: 'checkpoint 治理',
    priority: 'P0',
    freq: '3+ 篇面经',
    source: '牛客 · 百度 Agent',
    sourceUrl: 'https://www.nowcoder.com/discuss/880841659733311488',
    conclusion:
      '图内只留当前任务必需字段；历史/知识/偏好进外部库；配 TTL、里程碑裁剪、敏感字段脱敏。',
    followups: 'thread_id 和租户隔离？ · keep_latest 策略了解吗？',
    keyPoints: [
      '图内：最近几轮对话、未完成工具结果、路由标志',
      '外置：用户偏好、海量历史、可检索知识',
      '工程：TTL、只保留最近 N 个 checkpoint',
    ],
    oralAnswer: `百度面经里这是区分工程深度的好题。checkpoint 膨胀是因为什么都往 state 塞，每个 super-step 都序列化全量快照。

划界原则：图内只留推进当前任务必需的——最近几轮 messages、pending 工具结果、路由标志位。跨会话用户偏好、海量对话历史、知识库内容进 PostgreSQL/向量库，用时检索回填 state，而不是无限堆积。

工程手段包括：checkpoint TTL；keep_latest 只保留每 thread 最近 N 个快照；里程碑裁剪——任务完成后压缩 state；多租户命名空间隔离 thread；敏感字段脱敏。说出来对方就知道你考虑过线上跑一年后的状态。`,
  },
  {
    slug: '022-complex-data-between-nodes',
    title: '节点之间传复杂数据怎么处理？',
    round: '二面',
    difficulty: '⭐⭐⭐',
    point: '数据传递',
    priority: 'P1',
    freq: '2 篇面经',
    source: '牛客 · 百度',
    conclusion:
      '本质是状态演化策略：区分 append-only、merge、路由后清空；大对象用 ID 引用，避免 giant dict。',
    followups: '领域模型和框架状态怎么分离？ · TypedDict 字段爆炸怎么办？',
    keyPoints: [
      '按字段生命周期分类管理',
      '领域对象和编排 state 分离',
      '避免把业务模型糊进框架 channel',
    ],
    oralAnswer: `百度面经深挖点。表面是 TypedDict 一路堆字段，实质是状态演化策略：哪些 append-only、哪些 merge、哪些在某条边之后必须清空。

我的做法是把「编排 state」和「领域数据」分开：thread_id 给图用，订单号、用户 id 进 state 的业务区；大文档只传 doc_id 列表，不传全文；中间结构化结果用嵌套 dict 但控制深度，必要时拆成子图独立 state。

避免 giant dict——半年没人敢改。字段新增要评审「谁写、谁读、用什么 reducer、何时清空」四件事。`,
  },
  {
    slug: '023-state-reduction-pattern',
    title: 'State Reduction（状态归约）模式怎么理解？',
    round: '一面',
    difficulty: '⭐⭐',
    point: '归约模式',
    priority: 'P1',
    freq: '2 篇',
    source: 'GitHub Interview Questions',
    conclusion:
      '多个节点 partial update 通过 reducer 归约为新 state；是 LangGraph 并行一致性的核心机制。',
    followups: '和 Map-Reduce 关系？ · 默认覆盖行为何时够用？',
    keyPoints: [
      '每个 channel 可有独立 reducer',
      '无 Annotated 时默认 last-write-wins',
      '并行 super-step 结束后统一归约',
    ],
    oralAnswer: `State Reduction 指框架把多个节点返回的 partial update 合并成新 state 的过程。每个 channel 可以绑定不同 reducer：messages 追加、计数器累加、dict 合并、标量覆盖。

理解这个模式才能解释并行执行：同一 super-step 里多个节点跑完，它们的输出按 reducer 归约一次，再进入下一 super-step。这和 Map-Reduce 思想类似——map 阶段并行产出，reduce 阶段合并。

默认 last-write-wins 只适合单写者字段，比如 current_step。任何可能被并行写的字段都必须显式 reducer。`,
  },
]
