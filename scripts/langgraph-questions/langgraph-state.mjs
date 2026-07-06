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
    analogy: 'State 设计像给团队定「共享文档规范」——谁写哪一栏、能不能改别人写的、什么时候清空草稿，定不好就乱套。',
    plainTalk:
      'State 是 LangGraph 里所有节点共享的「公共笔记本」。设计时要先画业务流程，再决定哪些信息需要跨步骤传递。每条字段都要注明更新方式：messages 只追加不覆盖，current_intent 直接覆盖，临时检索结果用完就清空。原则很简单：只放跨节点共享的数据，不要把数据库连接塞进去；列表字段必须配 reducer；图里只留当前任务需要的，历史和大文档走外部存储。',
    detailAnswer: `**① 是什么**

State 通常用 TypedDict 或 Pydantic 定义，是图内所有节点的输入输出契约。每个字段可绑定 reducer 声明合并语义。节点只返回 partial update，框架合并成完整 state。

**② 为什么重要**

阿里淘天一面原题「节点间状态流转」本质就是 State schema 设计。设计不好，半年后图变成谁也不敢改的黑箱；设计好，新人看 schema 就懂数据怎么流。

**③ 怎么用 / 四步设计法**

第一步，画业务流程，标决策点和回退路径。第二步，定义 TypedDict，每字段注明 append/merge/覆盖/清空策略。第三步，节点写成纯函数，只返回 update。第四步，在特定边之后清空临时字段，防 checkpoint 膨胀。

**④ 项目例子（科研 RAG Agent）**

EvoAgent State 示例：messages（add_messages append-only）、retrieval_docs（append，汇总后清空）、current_intent（覆盖）、quality_score（覆盖）、retry_count（累加）、citation_status（覆盖，审核后清空）。跨会话用户偏好放 PostgreSQL，不进 state。

**⑤ 常见坑**

字段爆炸成 giant dict；不可序列化对象进 state；列表无 reducer 被并发覆盖；什么都塞 state 导致 checkpoint 膨胀。`,
    codeExample: `class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    retrieval_docs: Annotated[list, operator.add]
    current_intent: str  # 默认覆盖
    retry_count: Annotated[int, lambda a, b: a + b]`,
    followupTips: `- 「字段太多」：拆子图独立 state；编排 state 和领域 state 分离\n- 「重构成本」：新增字段向后兼容；删字段要迁移脚本\n- 「团队规范」：每字段写清谁写、谁读、reducer、何时清空`,
    pitfalls: 'giant dict 无人敢改；不可序列化对象进 state；临时字段不清空导致膨胀。',
    oralAnswer: `State 设计四步：画流程 → 定义 TypedDict 并标注每字段更新策略 → 节点只返回 partial update → 临时字段用后清空。原则：只放跨节点共享数据；列表配 reducer；图内只留当前任务必需，历史走外置存储。messages 用 add_messages append-only，current_intent 覆盖写。`,
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
    analogy: 'AgentState 像带版本记录的云文档；全局变量像会议室白板——多人同时改，改完无法回溯，断电就全丢。',
    plainTalk:
      'AgentState 是 LangGraph 里贯穿整个图的数据结构，每个节点读写它，但节点只返回更新片段，由框架按 reducer 合并。不用全局变量有三个硬理由：并发安全（并行节点同时改全局变量结果不可预测）、不可回溯（全局变量改完就丢，State 可进 checkpoint）、无法恢复（执行到一半挂了，全局变量状态没了，AgentState 可从快照原样恢复）。thread_id 是编排会话槽，业务主键如订单号应放 state 字段里。',
    detailAnswer: `**① 是什么**

AgentState 是图级共享状态对象，通常 TypedDict 定义。节点接收完整 state，返回只含变更字段的 dict，框架通过 reducer 合并。每次合并后的 state 可被 checkpointer 序列化。

**② 为什么重要**

某大厂、阿里国际面经 P0 题，区分「写过 demo」和「理解生产需求」。答「用全局 dict 也行」会直接减分。

**③ 怎么用 / 执行流程**

定义 schema → 节点 return {"field": value} → reducer 合并 → 下一节点看到最新 state → checkpoint 可选持久化。多线程部署：每请求独立 thread_id，state 存在 checkpointer 里，不依赖进程内全局变量。

**④ 项目例子**

EvoAgent 用户追问时，同一 thread_id 从 checkpoint 恢复 messages 和 retrieval_docs，继续 generate。若用全局变量，多用户并发请求会互相覆盖，服务重启后状态全丢。

**⑤ 常见坑**

用模块级 global dict 存 state；thread_id 和业务主键混为一谈；state 里放不可序列化对象导致 checkpoint 失败。`,
    codeExample: `# 节点只返回 partial update，不 mutate 全局变量
def rag_node(state: AgentState) -> dict:
    docs = retrieve(state["current_intent"])
    return {"retrieval_docs": docs}  # reducer 合并`,
    followupTips: `- 「多线程部署」：每请求 thread_id 隔离，state 在 checkpointer 不在进程内存\n- 「和 session 区别」：thread_id 给图编排用，业务 id 放 state 字段\n- 「reducer 配置」：列表用 add_messages，标量默认覆盖`,
    pitfalls: '模块级 global dict；多用户共享同一全局 state；混淆 thread_id 和业务主键。',
    oralAnswer: `AgentState 是图级共享状态，节点返回 partial update，框架按 reducer 合并。不用全局变量：并发不安全、无历史快照、无法断点恢复。State 每次更新可进 checkpoint，生产级 Agent 刚需。thread_id 是编排会话槽，业务主键放 state 字段做幂等。`,
  },
  {
    slug: '015-reducer',
    title: 'reducer 是什么？为什么并行节点更新状态时需要 reducer？',
    round: '一面',
    difficulty: '⭐⭐⭐',
    point: 'Reducer',
    priority: 'P0',
    freq: '4+ 篇面经',
    source: '阿里国际面经',
    conclusion:
      'reducer 定义多节点写同一 channel 时的合并语义；无 reducer 则后写覆盖先写，并发时会丢数据。',
    followups: 'add_messages 特别在哪？ · 自定义 reducer 怎么写？',
    keyPoints: [
      'Annotated[List, add] 表示追加而非覆盖',
      '并行分支写同一 key 必须声明合并逻辑',
      'operator.add / 自定义 merge 函数均可',
    ],
    analogy: 'reducer 像合并 Git 分支的规则——告诉系统两个人改了同一文件时，是追加、覆盖还是智能合并。',
    plainTalk:
      'reducer 是挂在 state 字段上的「合并函数」。多个节点在同一 super-step 写同一字段时，框架用 reducer 决定怎么合——默认是覆盖，最后写的赢。并行节点没配 reducer，两个节点同时改 messages 或 tool_results，后执行的直接覆盖先执行的，完全没有警告。这是阿里国际面经最高频踩坑之一。常见写法：messages 用 add_messages，计数器用 lambda a,b: a+b。',
    detailAnswer: `**① 是什么**

reducer 通过 Annotated[Type, reducer_fn] 绑定到 state 字段。节点返回 partial update 时，同一 super-step 内多个写同一 channel 的值，由 reducer_fn(old, new) 合并成最终值。无 Annotated 时默认 last-write-wins。

**② 为什么重要**

LangGraph 支持并行 super-step（Send API、多分支），reducer 是并行一致性的核心。不理解 reducer 就无法解释「为什么我的 messages 少了一半」。

**③ 怎么用 / 执行流程**

定义：messages: Annotated[list, add_messages]。运行时：node_A 返回 {"messages": [msg1]}，node_B 返回 {"messages": [msg2]}，super-step 结束后 reducer 合并为 [..., msg1, msg2] 而非只留 msg2。

**④ 项目例子**

EvoAgent 多源并行检索：两个 retrieve 节点同时返回 retrieval_docs，用 operator.add 追加合并。若默认覆盖，先完成的检索结果被后完成的吃掉，答案缺文献。

**⑤ 常见坑**

列表字段无 reducer；自定义 reducer 非交换律导致合并顺序影响结果；dict 合并浅拷贝丢嵌套数据。`,
    codeExample: `import operator
from typing import Annotated
from langgraph.graph.message import add_messages

class State(TypedDict):
    messages: Annotated[list, add_messages]
    docs: Annotated[list, operator.add]
    count: Annotated[int, lambda old, new: old + new]`,
    followupTips: `- 「add_messages 特别在哪」：按 id 去重、支持 RemoveMessage\n- 「自定义 reducer」：签名 (old, new) -> merged，要可交换或明确顺序\n- 「默认覆盖何时够用」：单写者标量字段如 current_step`,
    pitfalls: '并行写列表无 reducer；以为 reducer 是语法糖而非并发语义契约；dict 浅合并丢数据。',
    oralAnswer: `reducer 定义多节点写同一 channel 的合并语义，通过 Annotated 绑定。无 reducer 则 last-write-wins，并行时会丢数据。messages 用 add_messages 追加，列表用 operator.add。reducer 是团队必须约定的并发写语义，不是语法糖。`,
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
    analogy: 'add_messages 像智能聊天记录——相同消息不重复存，还能撤回某条再发新版，而不是无脑 append。',
    plainTalk:
      'add_messages 是 LangGraph 为对话场景定制的 reducer。相比简单 list append，它能按 message id 智能合并、去重，还支持 RemoveMessage 在图执行中撤回或替换某条消息——适合「人类修改草稿后继续」的场景。MessagesState 是预置 TypedDict，只有 messages 且已配好 add_messages，快速搭聊天 Agent 很省事。生产里消息会膨胀，要在图里加 trim 或 summarization 节点裁剪历史。',
    detailAnswer: `**① 是什么**

add_messages(old_messages, new_messages) 是对话专用 reducer：追加新消息、按 id 去重、支持 RemoveMessage 删除指定消息。MessagesState 是 LangGraph 预置的 TypedDict，仅含 messages 字段且已绑定 add_messages。

**② 为什么重要**

对话 Agent 的 messages 是最常被并行写的 channel，也是 checkpoint 膨胀的主要来源。用对 reducer 是对话轨迹正确性的基础。

**③ 怎么用 / 执行流程**

节点返回 {"messages": [AIMessage(...)]} 或 {"messages": [RemoveMessage(id=...)]}。框架自动合并。消息过多时在 LLM 调用前加 trim_node，保留最近 N 条或摘要 older messages。

**④ 项目例子**

EvoAgent 人工审核 interrupt 后，用户修改 AI 草稿：返回 RemoveMessage 删掉旧 AIMessage，再 append 新版。add_messages 正确处理，简单 append 会留下两条矛盾回答。

**⑤ 常见坑**

无限堆 messages 不裁剪；用 operator.add 代替 add_messages 导致重复消息；RemoveMessage 的 id 不对导致删不掉。`,
    codeExample: `from langgraph.graph.message import add_messages, RemoveMessage
from langchain_core.messages import AIMessage

def revise_draft(state):
    old_id = state["messages"][-1].id
    return {
        "messages": [
            RemoveMessage(id=old_id),
            AIMessage(content="修订后的回答", id="new-1"),
        ]
    }`,
    followupTips: `- 「消息太多」：trim 节点保留最近 N 条；summarization 压缩 older\n- 「和 buffer 关系」：buffer 是概念，add_messages 是 LangGraph 实现\n- 「MessagesState 何时够」：纯聊天无其他 state 字段时`,
    pitfalls: 'messages 无限膨胀；用 operator.add 替代 add_messages；interrupt 修订不用 RemoveMessage。',
    oralAnswer: `add_messages 是对话专用 reducer：按 id 去重合并，支持 RemoveMessage 撤回修订，比 operator.add 更适合对话轨迹。MessagesState 预置 messages + add_messages，快速搭聊天 Agent。生产要加 trim/summarization 节点防膨胀。`,
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
    analogy: 'TypedDict 像轻量标签贴纸上写规格；Pydantic 像带安检门的入库检查——更严但更慢。',
    plainTalk:
      'LangGraph 的 State 可以用 TypedDict 或 Pydantic BaseModel 定义。工程里 TypedDict 更常见，配合 Annotated 声明 reducer，类型提示够用且轻量。Pydantic 适合需要运行时校验的场景，比如防止节点写入非法枚举值。无论哪种，checkpoint 要求 state 可序列化——dict、list、str 没问题，开着的数据库连接、socket 不行。选型建议从最小 schema 起步，边跑边加字段。',
    detailAnswer: `**① 是什么**

TypedDict：静态类型提示 + Annotated reducer，无运行时校验，性能更好。Pydantic BaseModel：运行时校验字段类型和约束，可自动转 dict 序列化，开销略高。

**② 为什么重要**

Schema 是所有节点的契约，选型影响开发体验和 checkpoint 兼容性。面试考的是「知道两种都行，能说出取舍」。

**③ 怎么用 / 选型**

默认 TypedDict + Annotated。需要严格校验（枚举、范围、嵌套模型）时用 Pydantic。嵌套结构优先 plain dict 而非自定义 class，便于 JSON 序列化。

**④ 项目例子**

EvoAgent 用 TypedDict 起步，citation_status 后来需要严格枚举校验（pending/approved/rejected），该字段改用 Pydantic 子模型或 Literal 类型约束。

**⑤ 常见坑**

Pydantic 模型嵌套不可序列化字段；TypedDict 无运行时校验导致节点写入脏数据；一开始 schema 过大后期难 refactor。`,
    codeExample: `# TypedDict：轻量常用
class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    status: str

# Pydantic：运行时校验
class AgentState(BaseModel):
    messages: list = []
    status: Literal["pending", "done"]`,
    followupTips: `- 「序列化限制」：必须 JSON/msgpack 可序列化，连接/模型实例不行\n- 「嵌套对象」：plain dict 或 Pydantic model.model_dump()\n- 「选型」：默认 TypedDict，要严格校验再上 Pydantic`,
    pitfalls: '不可序列化字段进 Pydantic model；schema 一开始就过度设计；混用两种风格无团队规范。',
    oralAnswer: `TypedDict 轻量常用，配合 Annotated 声明 reducer，无运行时校验。Pydantic 提供运行时校验，适合严格约束字段。两者均需可序列化才能 checkpoint。默认 TypedDict 起步，从最小 schema 边跑边加字段。`,
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
    analogy: '状态流转像接力赛传棒——每个选手（节点）只交自己跑完的那段（partial update），裁判（reducer）合并成完整成绩册再传给下一位。',
    plainTalk:
      '阿里淘天一面原题。状态流转是：框架把当前完整 state 传给节点，节点返回只含变更字段的 dict，框架用 reducer 合并，然后根据边定义决定下一个节点。比如 intent_node 写 current_intent → 条件边路由到 rag_node 或 tool_node → rag_node append retrieval_docs → summarize_node 读 docs 生成答案。讲流转时最好画一张图，标出每个节点读写哪些字段。',
    detailAnswer: `**① 是什么**

状态流转公式：S_{t+1} = merge(S_t, node_output)。节点是纯函数：读 state，返回 partial update，不 mutate。合并后完整 state 传给下一节点或条件边路由函数。

**② 为什么重要**

阿里淘天一面核心项目题，结合「怎么保证节点效果」考工程深度。能画流转图 + 标字段策略是加分项。

**③ 怎么用 / 四步设计**

画业务流程 → 定义 schema 和 reducer → 节点纯函数返回 update → 条件边读合并后 state 路由。保证节点效果：独立 IO 契约、路由逻辑单测、线上监控节点耗时和失败率。

**④ 项目例子（EvoAgent）**

用户输入 → intent_node 写 current_intent → 条件边：research 走 rag_node append retrieval_docs → grade_node 写 quality_score → 条件边：不够 rewrite_node 改 query 回 rag_node，够了 generate_node append AIMessage → citation_check_node → interrupt 或 END。

**⑤ 常见坑**

节点内 mutate state；条件边读的是合并前旧 state（实际不会，但要理解时序）；临时字段不清空污染下游。`,
    codeExample: `# S_{t+1} = merge(S_t, node_output)
def intent_node(state: AgentState) -> dict:
    intent = classify(state["messages"][-1].content)
    return {"current_intent": intent}  # 只返回变更

# 条件边读合并后的 state
def route(state) -> str:
    return "rag" if state["current_intent"] == "research" else "chat"`,
    followupTips: `- 「保证节点效果」：IO 契约 + 单测 + 线上监控 + bad case 回流评测\n- 「复杂对象」：传 ID 不传全文；编排 state 和领域 data 分离\n- 「排查节点差」：LangSmith trace 看输入输出 state diff`,
    pitfalls: '节点 mutate state；流转图无文档；临时字段污染下游节点。',
    oralAnswer: `状态流转：框架传完整 state 给节点 → 节点返回 partial update → reducer 合并 → 条件边读合并后 state 路由下一节点。本质是 S_{t+1} = merge(S_t, output)。节点不 mutate state。保证效果：IO 契约、路由单测、节点级监控。`,
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
    analogy: 'State 像快递单——只写单号和摘要，不把整个仓库的货都塞进去。',
    plainTalk:
      'State 只能放 checkpointer 能序列化的东西：基本类型、dict、list、Pydantic 可转 dict 的模型。不能放数据库连接、已加载的 ML 模型、lambda 等不可 pickle 的对象，否则 checkpoint 会炸。工程实践：PDF 和图片放对象存储，state 里只留 doc_id；检索结果放摘要而非全文；API key 绝不进 state，走 config 或密钥服务。state 越小，恢复越快，存储越便宜。',
    detailAnswer: `**① 是什么**

checkpointer 在每个 super-step 后序列化整个 state 存盘（Memory/SQLite/Postgres）。可序列化：str/int/float/bool/list/dict、LangChain Message 对象、Pydantic model_dump()。不可序列化：DB connection、socket、thread lock、lambda、大型 binary blob。

**② 为什么重要**

违反序列化约束会导致 checkpoint 写入失败或恢复崩溃，是生产上线前的硬门槛。也是 checkpoint 膨胀治理的前提。

**③ 怎么用 / 最佳实践**

大对象 → 外部存储 + state 留 ID/URI。敏感信息 → config 或密钥服务，不进 state。图片/PDF → OSS/S3，state 留 doc_id。检索结果 → 摘要 + chunk_id 列表，全文用时再拉。

**④ 项目例子**

EvoAgent 检索 50 篇文献，state 只存 top-5 的 chunk_id 和 200 字摘要，全文从向量库按需加载。checkpoint 从 2MB 降到 20KB，恢复时间从秒级到毫秒级。

**⑤ 常见坑**

把 embedding 向量数组全塞 state；API key 进 state 被 checkpoint 持久化；图片 base64 进 state 导致膨胀。`,
    codeExample: `# 好：只存引用
def rag_node(state) -> dict:
    docs = retriever.invoke(state["query"])
    return {"doc_ids": [d.id for d in docs], "summaries": [d.summary for d in docs]}

# 坏：塞全文和连接
# return {"full_pdfs": [open(f).read()], "db": db_connection}`,
    followupTips: `- 「图片二进制」：放 OSS，state 留 url 或 doc_id\n- 「checkpoint 多大合适」：单 snapshot < 100KB 理想，> 1MB 要治理\n- 「敏感字段」：脱敏或根本不进 state`,
    pitfalls: '大 blob/base64 进 state；DB 连接进 state；API key 被 checkpoint 持久化。',
    oralAnswer: `State 只放可 JSON/msgpack 序列化的数据：基本类型、dict、list、Message。不能放 DB 连接、模型实例、lambda。大对象放外部存储，state 留 ID/URI；检索结果存摘要；敏感信息走 config。state 越小 checkpoint 越快越省。`,
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
    analogy: '并发写同一字段像两个人同时改同一行 Excel——没合并规则就「后写覆盖先写」，Silent data loss。',
    plainTalk:
      '这是 LangGraph 最高频踩坑。两个并行节点写同一字段，默认后者覆盖前者，完全没有警告。解法优先级：第一，给字段配 reducer 改成合并写；第二，重构图让并行分支写不同 key，在下游汇总节点 merge；第三，Send API fan-out 后由 reducer 聚合。阿里国际面经说「判断字段是否被别的节点改过」——工程上更靠谱的是从设计上消灭并发写同一无 reducer 字段，而不是运行时检测。',
    detailAnswer: `**① 是什么**

同一 super-step 内多个节点就绪并行执行，各自返回 partial update。写同一 channel 且无 reducer 时，last-write-wins，先写数据丢失。

**② 为什么重要**

阿里国际面经原题，区分「跑通 demo」和「理解并行语义」。Send API 普及后这题频率还在上升。

**③ 怎么用 / 三种解法**

解法一：Annotated + reducer（列表 append、dict merge、计数累加）。解法二：并行分支写不同 key（docs_source_a、docs_source_b），下游 aggregate_node 合并。解法三：Send fan-out + reducer 聚合 Map-Reduce 结果。

**④ 项目例子**

EvoAgent 多源检索：PubMed 和 arXiv 并行 retrieve，各写 retrieval_docs（operator.add 合并）。若写同一 current_source 标量无 reducer，后完成的源覆盖先完成的，路由逻辑出错。

**⑤ 常见坑**

运行时检测「字段是否被改过」而非设计消除；dict reducer 浅合并；Send 结果未配 reducer。`,
    codeExample: `# 解法一：reducer 合并
class State(TypedDict):
    docs: Annotated[list, operator.add]

# 解法二：不同 key + 汇总节点
class State(TypedDict):
    docs_a: list
    docs_b: list

def aggregate(state) -> dict:
    return {"all_docs": state["docs_a"] + state["docs_b"]}`,
    followupTips: `- 「怎么发现」：stream 观察每步 state；LangSmith trace 看并行 super-step\n- 「Send 后 reduce」：worker 返回同 channel，父图 reducer 聚合\n- 「能否运行时检测」：不推荐，设计消除并发写无 reducer 字段`,
    pitfalls: '并行写无 reducer 字段；依赖运行时检测而非设计；dict 浅合并丢嵌套。',
    oralAnswer: `并发写同一字段默认 last-write-wins 会丢数据。解法：配 reducer 合并写；或并行分支写不同 key 下游汇总；或 Send fan-out 后 reducer 聚合。从设计上消灭无 reducer 并发写，不靠运行时检测。列表用 add/add_messages，dict 用自定义 merge。`,
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
    analogy: 'checkpoint 像游戏存档——只存当前关卡进度，不要把整个游戏世界地图都塞进一个存档位。',
    plainTalk:
      '百度面经区分工程深度的好题。checkpoint 膨胀是因为什么都往 state 塞，每个 super-step 都序列化全量快照。划界原则：图内只留推进当前任务必需的——最近几轮 messages、pending 工具结果、路由标志。跨会话用户偏好、海量历史、知识库内容进 PostgreSQL/向量库，用时检索回填。工程手段：checkpoint TTL、keep_latest 只保留最近 N 个快照、里程碑裁剪、多租户隔离 thread、敏感字段脱敏。',
    detailAnswer: `**① 是什么**

checkpoint 是每个 super-step 后的 state 快照，存于 checkpointer（Memory/SQLite/Postgres）。膨胀 = 单 snapshot 过大 × checkpoint 数量过多，导致存储贵、恢复慢。

**② 为什么重要**

百度 Agent 面经 P0，区分「调过 API」和「考虑过线上跑一年」。主动讲治理策略是二面加分项。

**③ 怎么用 / 划界原则**

图内 state：最近 K 轮 messages、未完成 tool results、路由/审批标志位、当前任务 ID。外置记忆：用户偏好、全量对话历史、知识库内容、大文档。回填模式：用时从外置存储检索，写入 state 临时字段，任务完成后清空。

**④ 项目例子（EvoAgent）**

用户 6 个月对话历史放 PostgreSQL，图内只留当前 thread 最近 10 轮 messages。知识库永远不进 state，rag_node 检索结果存 chunk_id 摘要，generate 后清空 retrieval_docs。checkpoint 配 TTL 30 天 + keep_latest 20。

**⑤ 常见坑**

全量历史进 state；每个 super-step 都存不裁剪；thread_id 无租户隔离；敏感数据未脱敏进 checkpoint。`,
    codeExample: `# 任务完成后压缩 state
def cleanup_node(state) -> dict:
    return {
        "retrieval_docs": [],  # 清空临时字段
        "messages": trim_messages(state["messages"], max=10),
    }

# checkpointer 配置 TTL（Postgres 示例）
# DELETE FROM checkpoints WHERE created_at < NOW() - INTERVAL '30 days'`,
    followupTips: `- 「thread_id 租户隔离」：命名空间 prefix tenant_id + user_id\n- 「keep_latest」：每 thread 只保留最近 N 个 snapshot\n- 「interrupt 与膨胀」：挂起时 state 也要精简，避免挂起态 snapshot 过大`,
    pitfalls: '全量历史进 state；无 TTL/裁剪；挂起态 snapshot 过大；thread 无租户隔离。',
    oralAnswer: `checkpoint 膨胀因 state 过大且 snapshot 过多。图内只留当前任务必需：最近 messages、pending 工具结果、路由标志。外置：用户偏好、全量历史、知识库。工程：TTL、keep_latest 最近 N 个、里程碑裁剪、租户隔离、敏感脱敏。用时检索回填，任务完成清空临时字段。`,
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
    analogy: '传复杂数据像传接力棒上的号码牌——传编号让下一棒自己去取货，而不是扛着整箱货跑。',
    plainTalk:
      '百度面经深挖点。表面是 TypedDict 堆字段，实质是状态演化策略：哪些 append-only、哪些 merge、哪些在某条边之后必须清空。做法是把「编排 state」和「领域数据」分开：thread_id 给图用，订单号/用户 id 进 state 业务区；大文档只传 doc_id 列表；必要时拆子图独立 state。避免 giant dict——字段新增要评审「谁写、谁读、用什么 reducer、何时清空」四件事。',
    detailAnswer: `**① 是什么**

复杂数据传递 = 在 state 中管理字段生命周期 + 引用而非值传递 + 编排/领域分离。不是简单堆字段，而是状态演化策略。

**② 为什么重要**

百度二面区分架构能力。字段爆炸的 state 半年无人敢改，是 Agent 项目Technical Debt 的主要来源。

**③ 怎么用 / 策略**

按生命周期分类：append-only（messages）、merge（docs dict）、覆盖（intent）、路由后清空（temp_results）。大对象：OSS + doc_id。领域分离：framework state（messages、routing flags）vs domain state（order_id、user_id）。字段爆炸：拆子图或嵌套 TypedDict 分区。

**④ 项目例子（EvoAgent）**

编排区：messages、current_intent、retry_count。领域区：paper_ids、experiment_config。全文 PDF 从不进 state，rag_node 写 paper_ids，generate_node 按 id 从向量库拉 chunk。子图 citation_check 有独立 CitationState，编译后作为父图节点。

**⑤ 常见坑**

业务模型整个塞进 state channel；嵌套 dict 过深难序列化；新增字段不评审四问（谁写/谁读/reducer/清空）。`,
    codeExample: `class AgentState(TypedDict):
    # 编排区
    messages: Annotated[list, add_messages]
    current_step: str
    # 领域区（引用为主）
    paper_ids: list[str]
    experiment_id: str
    # 临时区（用后清空）
    temp_search_results: Annotated[list, operator.add]`,
    followupTips: `- 「领域和框架分离」：thread_id 给图，business_id 放 state 业务区\n- 「字段爆炸」：拆子图；嵌套分区；外置存储 + ID 引用\n- 「子图」：独立 StateGraph compile 后作父图节点`,
    pitfalls: 'giant dict；业务模型糊进 channel；大对象传值不传引用；新字段不评审。',
    oralAnswer: `复杂数据传递本质是状态演化策略：append/merge/覆盖/清空分类管理。编排 state 和领域 data 分离；大对象用 ID 引用；必要时子图独立 state。字段新增评审：谁写、谁读、reducer、何时清空。避免 giant dict。`,
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
    analogy: 'State Reduction 像班会收作业——多个同学（节点）同时交片段，班长（reducer）按规则合并成完整记录。',
    plainTalk:
      'State Reduction 是框架把多个节点返回的 partial update 合并成新 state 的过程。每个 channel 可以绑定不同 reducer：messages 追加、计数器累加、dict 合并、标量覆盖。同一 super-step 里多个节点跑完，输出按 reducer 归约一次，再进入下一 super-step。这和 Map-Reduce 思想类似——map 阶段并行产出，reduce 阶段合并。默认 last-write-wins 只适合单写者字段如 current_step。',
    detailAnswer: `**① 是什么**

State Reduction = 在一个 super-step 结束时，将该 step 内所有节点 partial update 按各 channel 的 reducer 合并，得到 S_{t+1}。是 BSP（Bulk Synchronous Parallel）模型的归约阶段。

**② 为什么重要**

理解 Reduction 才能解释并行执行的一致性保证，也是 Send API / Map-Reduce 模式的基础概念。

**③ 怎么用 / 执行流程**

super-step 开始 → 就绪节点并行执行 → 各返回 partial update → 按 channel reducer 归约 → super-step 结束 → 下一 super-step。每个 channel 独立 reducer，互不影响。

**④ 项目例子（EvoAgent Map-Reduce）**

map：Send API 向 10 篇 paper 各发 Send("analyze", {"paper_id": id})。reduce：analyze 节点返回 {"findings": [summary]}，findings channel 用 operator.add 归约成完整列表，再进 synthesize_node。

**⑤ 常见坑**

以为归约是全局一个函数（实际 per-channel）；忽略归约顺序对非交换 reducer 的影响；默认覆盖用于多写者字段。`,
    codeExample: `# 每个 channel 独立 reducer
class State(TypedDict):
    messages: Annotated[list, add_messages]      # 追加
    findings: Annotated[list, operator.add]       # 追加
    step: str                                      # 覆盖（单写者）
    score: Annotated[float, max]                   # 取 max`,
    followupTips: `- 「和 Map-Reduce」：Send fan-out = map，reducer 合并 = reduce\n- 「默认覆盖何时够」：单写者标量如 current_step、status\n- 「归约时机」：super-step 结束后统一归约，非逐节点`,
    pitfalls: '多写者字段用默认覆盖；非交换 reducer 忽略顺序；混淆 per-channel 和全局归约。',
    oralAnswer: `State Reduction 是 super-step 内多个 partial update 按各 channel reducer 合并成新 state 的过程。每 channel 独立 reducer：messages 追加、标量覆盖、dict 合并。并行 super-step 结束后统一归约。类似 Map-Reduce。默认 last-write-wins 仅适合单写者字段。`,
  },
]
