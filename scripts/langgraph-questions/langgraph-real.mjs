/** LangGraph · 真实面经题 */
export default [
  {
    slug: '065-why-not-off-the-shelf',
    title: '为什么不直接用 Cursor Composer 或公司现成的 Agent 产品？',
    round: '二面',
    difficulty: '⭐⭐⭐',
    point: '自研边界',
    priority: 'P1',
    freq: '1 篇面经',
    source: '牛客 · 百度 Agent',
    sourceUrl: 'https://www.nowcoder.com/discuss/880841659733311488',
    conclusion: '自研是为了数据路径可控、工具权限对齐内部系统、评测指标一致、发版节奏自主；改造现成方案讲清 adapter 四层而非空喊二次开发。',
    followups: 'fork 现成方案风险？ · 什么时候应该用现成的？',
    keyPoints: ['协议层/资产层/运行层/组织层', '别 fork 到死，先 adapter', '主权和合规是核心'],
    oralAnswer: `百度面经原题，听起来抬杠，实际考边界。自研或半自研不是为了证明比 Cursor 强，而是数据路径可控、工具权限跟内部 IAM 对齐、评测指标跟业务定义一致、排期回滚不绑外部发版。

基于现成方案改造要说四层：协议层工具 schema 和上下文对齐；资产层 prompt/skill/评测集迁移；运行层灰度熔断限流观测；组织层谁维护版本事故怎么归因。加一句「先 adapter 再接，别 fork 到死」比空喊二次开发具体。

什么时候用现成的：内部提效、非核心路径、合规要求不高时，Composer/企业 Agent 产品更快。核心业务流程、敏感数据、要强审计再上 LangGraph 自研。`,
  },
  {
    slug: '066-skill-ization',
    title: '工具链能不能 Skill 化？项目有没有演进价值？',
    round: '二面',
    difficulty: '⭐⭐⭐',
    point: 'Skill 化',
    priority: 'P2',
    freq: '1 篇面经',
    source: '牛客 · 百度',
    conclusion: 'Skill 化是把高频任务打法变成可版本、可组合、可测的资产，不是 markdown 换名；演进价值用接入成本、bad case 闭环、新人上手成本量化。',
    followups: '和 MCP 关系？ · 字节 skill 分层怎么答？',
    keyPoints: ['入口收敛稳定工具', '流程边界+回归用例', '新数据源改几处可量化'],
    oralAnswer: `百度面经连环题。Skill 化我理解是把高频任务打法变成可版本、可组合、可测的资产：入口收敛到少量稳定工具，流程和边界写清楚，配回归用例，不是把 prompt 存个 md 就叫 skill。

演进价值别用空话：新数据源接进来改几处、线上 bad case 有没有入库闭环、新人接手要不要读五千行 prompt——能讲成本和收益。

字节面经 skill 分层可接：静态 skill 库 + 动态匹配 + 沉淀机制，LangGraph 里 skill 选择可以是路由节点或 tool 子集，和 Skill 化是同一思想。`,
  },
  {
    slug: '067-vector-db-system-design',
    title: '系统设计：数据怎么落到向量数据库？（LangGraph 方案）',
    round: '二面',
    difficulty: '⭐⭐⭐⭐',
    point: '系统设计',
    priority: 'P0',
    freq: '2 篇面经',
    source: '编程导航 · AI Agent 面经',
    sourceUrl: 'https://www.codefather.cn/post/2067118684236795905',
    conclusion: 'ETL 节点→embedding 节点→写入节点串成子图，条件边处理格式分支，checkpoint 支持断点重试，Guardrails 校验入库数据。',
    followups: '多路召回怎么接？ · 增量更新？',
    keyPoints: ['parse → chunk → embed → upsert 各为 node', '失败重试不回滚已成功批次', '元数据过滤与多租户'],
    oralAnswer: `编程导航二面场景题，我答 LangGraph + 条件边：入口 router 识别 PDF/网页/结构化数据走路不同 parse 节点；chunk_node 写 chunk 列表；embed_node 批量调 embedding；upsert_node 写 Qdrant，state 记 batch_id 和进度。

断点重试靠 checkpoint——embed 完 upsert 失败从 upsert 续，不重复 embed。多路调用可 Send 并行 embed。Guardrails 节点校验 PII、文件大小、格式。

接 RAG 检索时另一子图 retrieve→grade，入库和问答解耦。讲的时候边画 state 字段边讲条件边，比只背向量库 API 强。`,
  },
  {
    slug: '068-internal-efficiency-ai',
    title: '系统设计：内部提效系统怎么做 AI 改造？',
    round: '二面',
    difficulty: '⭐⭐⭐⭐',
    point: '系统设计',
    priority: 'P1',
    freq: '1 篇面经',
    source: '编程导航面经',
    conclusion: '拆功能点→每点 AI 实现方式→需求文档/方案生成 Agent→套 LangGraph 做审批流和工具编排。',
    followups: '不熟悉业务系统怎么办？ · 如何分期落地？',
    keyPoints: ['先拆功能点再谈模型', 'HITL 审批写方案类操作', '模板化应对不熟悉系统'],
    oralAnswer: `编程导航面经：不熟悉某内部软件，我现场问清核心功能，拆功能点——每个点说 AI 怎么辅助：自动生成需求文档、会议纪要结构化、工单分类路由。

然后套 LangGraph：intent 分类→不同处理子图，写方案类走 draft→interrupt 审批→publish；查数据类走 tool 调内部 API。state 设计 task_type、draft、approval_status。

分期落地：第一期单点高频场景 Workflow；第二期要审批和回溯上 LangGraph；第三期评测闭环。不会的业务用模板答——拆功能、画 state、说工具，面试官看思路不考你真用过那软件。`,
  },
  {
    slug: '069-eval-closed-loop',
    title: 'Agent 评测闭环怎么搭建？',
    round: '二面',
    difficulty: '⭐⭐⭐⭐',
    point: '评测',
    priority: 'P1',
    freq: '2 篇面经',
    source: '牛客 · 百度',
    conclusion: '离线集分层（简单/长尾/对抗）+ 在线成功率/延迟/token/工具错误率 + 人工抽检 + bad case 自动入库 + 节点级归因。',
    followups: '准确率还能怎么优化？ · 泄漏到训练怎么防？',
    keyPoints: ['离线在线双循环', '按 node 归因失败', '难例挖掘和合成'],
    oralAnswer: `百度面经评测串。离线：黄金集分简单/长尾/对抗，标注规范，防泄漏进训练；按 node 跑回归看哪步跌分。在线：成功率、P99 延迟、token、工具错误率、人工抽检比例。

bad case 从 trace 自动入库，标失败 node，下周优先修。优化不只调 prompt：数据侧难例挖掘，模型侧换强模型/蒸馏，系统侧结构化输出和后处理校验，RAG 侧 chunk 和 rerank。

LangGraph 优势是失败可定位到具体 node，评测不是只看最终答案。`,
  },
  {
    slug: '070-a2a-protocol',
    title: 'A2A 多 Agent 协议了解吗？',
    round: '二面',
    difficulty: '⭐⭐⭐',
    point: 'A2A',
    priority: 'P2',
    freq: '1 篇面经',
    source: '牛客 · 百度',
    conclusion: '不必装做过分布式 Agent；降维成子图/节点代表远程 agent，外层管信封格式、超时、错误隔离。',
    followups: '和 MCP 区别？ · 跨进程怎么通信？',
    keyPoints: ['协议层=消息格式+超时', 'LangGraph 子图可封装远程 agent', '失败隔离不重试整个父图'],
    oralAnswer: `百度面经提到 A2A。不必装专家，我降维答：多进程协作里的协议与超时——子图或专用节点代表另一个 agent，外层负责请求信封、correlation_id、超时和错误返回，父图 state 只存摘要结果。

和 MCP 区别：MCP 是工具接入协议，A2A 是 agent 间协作协议。LangGraph 本地编排用图，跨服务 agent 用 HTTP/gRPC 包装成 tool 或子图 invoke。

核心是通信契约和失败隔离，不是背协议 RFC。`,
  },
  {
    slug: '071-project-storytelling',
    title: 'Agent 项目面试怎么讲？（LangGraph 表述顺序）',
    round: '一面',
    difficulty: '⭐⭐⭐',
    point: '项目表达',
    priority: 'P0',
    freq: '3+ 篇面经',
    source: '牛客 · 百度/阿里',
    conclusion: '先业务因果链（输入输出、失败落哪），再提 LangGraph 承载；禁止开场三十秒报技术栈朗诵。',
    followups: '用户一句话进来第一个写日志在哪？ · 为什么不用 XX 框架？',
    keyPoints: ['问题→边界→因果链→取舍→框架', 'LangGraph 是承载不是开场', '准备真实难点和 data point'],
    oralAnswer: `百度面经项目怎么讲：我踩过坑是开场三十秒报 LangGraph、LangChain、向量库，面试官问「用户一句话进来第一个写日志在哪」就卡了。

正确顺序：业务解决什么问题→输入输出边界→谁把自然语言变可执行步骤→谁调工具谁汇总→失败状态落哪→再提用 LangGraph 承载这条链。然后讲一个真实难点和 data point，比如 checkpoint 膨胀怎么治、路由不准怎么 fallback。

阿里淘天是直接项目拷打，同样要先因果链再技术。让面试官听到你做过取舍，不是背选型。`,
  },
  {
    slug: '072-langgraph-project-setup',
    title: '说说你们 AI Agent 项目 LangGraph 怎么搭的？',
    round: '一面/二面',
    difficulty: '⭐⭐⭐⭐',
    point: '项目架构',
    priority: 'P0',
    freq: '2 篇面经',
    source: '编程导航面经',
    conclusion: '定义 state schema → 纯函数节点 → 条件边编排 → compile 注入 checkpointer → FastAPI 暴露 stream → LangSmith 监控。',
    followups: '最强节点是哪个？ · 重构过什么？',
    keyPoints: ['五步法可背诵', '结合自己项目替换节点名', '强调可测试和可恢复'],
    oralAnswer: `编程导航一面原题。我按五步法答：第一定义 AgentState，messages、intent、docs、retry_count 各字段 reducer 约定；第二每个能力一个纯函数节点，retrieve、grade、rewrite、generate、cite_check；第三条件边连接，grade 不过回 rewrite，cite 不过回 generate；第四 compile 绑 PostgresSaver 和 interrupt 审批点；第五 FastAPI astream 暴露 SSE，LangSmith 看节点 trace。

【替换点】说成你自己科研问答或简历项目：意图三路、质量门控、引用校验环。准备每节点一个 data point，比如 grade 阈值多少、rewrite 最多几次。`,
  },
  {
    slug: '073-prompt-combination',
    title: 'prompt 结合是怎么做的？',
    round: '一面',
    difficulty: '⭐⭐⭐',
    point: 'Prompt',
    priority: 'P1',
    freq: '1 篇面经',
    source: '牛客 · 阿里淘天',
    conclusion: '静态 system prompt 管角色边界，动态 prompt 节点按 state 注入检索结果/工具输出/用户上下文，分节点拆分而非一个巨型 prompt。',
    followups: '和 LangGraph 节点关系？ · 怎么防 prompt 漂移？',
    keyPoints: ['每节点独立 prompt 模板', 'state 字段填充动态段', '版本化+A/B'],
    oralAnswer: `阿里淘天原题。在 LangGraph 里 prompt 结合是分机节点：system 段静态放角色和格式约束；动态段从 state 注入——retrieve 节点后 generate 节点 template 填 docs，tool 节点后填 tool_results。

不是一个 5000 字巨型 prompt，而是每个 node 只拿当前步需要的上下文，省 token 也利 debug。版本化存 Git，改 retrieve 的 prompt 不影响 generate。

和图的关系：节点即 prompt 边界，换节点就换 prompt 策略，比 Chain 里一个大 PromptTemplate 清晰。`,
  },
  {
    slug: '074-react-pattern',
    title: '如何用 LangGraph 实现 ReAct 模式？',
    round: '一面',
    difficulty: '⭐⭐⭐',
    point: 'ReAct',
    priority: 'P0',
    freq: '3+ 篇',
    source: 'CSDN + GitHub',
    conclusion: 'agent 节点调 LLM → 条件边看 tool_calls → tool 节点执行 → 回边 agent，直到无 tool_calls 走 END。',
    followups: '和 create_react_agent 区别？ · 为什么要手写图？',
    keyPoints: ['经典三环', '可插 grade/fallback 节点', '手写图为精细控制'],
    oralAnswer: `ReAct 是 LangGraph 最经典环：agent_node LLM 带 tools 绑定；should_continue 有 tool_calls 去 tool_node，没有 END；tool_node 执行完 add_edge 回 agent_node。

手写图比 create_react_agent 好处是能插节点——tool 后加 sanitize、agent 前加 compress、失败走 fallback。LangChain 1.0 create_agent 底层仍是图，但面试讲手写证明你理解环怎么运转。

准备画三张图：state 字段、节点、条件边，30 秒画完 ReAct 环。`,
  },
  {
    slug: '075-tool-error-handling',
    title: '图中工具执行出错怎么处理？',
    round: '一面/二面',
    difficulty: '⭐⭐⭐',
    point: '工具错误',
    priority: 'P1',
    freq: '2 篇',
    source: 'GitHub Premium Questions',
    conclusion: 'tool 节点 try-catch 写 error 进 state，agent 节点读 error 决定重试/换参/fallback，绝不让异常穿透崩图。',
    followups: '超时和限流区别？ · 错误信息给 LLM 看什么？',
    keyPoints: ['结构化 ToolMessage error', '可重试错误分类', '敏感错误信息脱敏'],
    oralAnswer: `tool 节点捕获异常，返回 ToolMessage(content="Error: timeout", status="error") 进 messages，不抛到图外。agent 节点看到 error 决定换参数重试或走 fallback。

可重试：网络超时、429；不可重试：401、参数校验失败。给 LLM 的错误信息要结构化但脱敏，别把 stack trace 全塞进去。

结合 retry 机制：tool 层 max_retries，图层条件边，两层别重复重试浪费 token。`,
  },
  {
    slug: '076-over-design-judge',
    title: '怎么判断用 LangGraph 是不是过度设计？',
    round: '一面/二面',
    difficulty: '⭐⭐⭐',
    point: '过度设计',
    priority: 'P0',
    freq: '3+ 篇面经',
    source: '牛客 · 百度/阿里',
    conclusion: '看条件边是否映射真实分支、checkpoint 有无生命周期、团队能否维护 state 约定；线性三步必是过度。',
    followups: '重构回 Workflow 过吗？ · 如何向老板解释成本？',
    keyPoints: ['量化三问', '线性三步用 Chain', '复杂度跟业务分支数走'],
    oralAnswer: `百度阿里连问题。判断过度设计三问：每条条件边对应真实业务分支吗？checkpoint 里东西有 TTL 和划界吗？半年后新人能看懂 state 演化吗？全是否就可能用重了。

线性「检索→生成→格式化」还上 LangGraph，就是过度。复杂度应跟业务分支数和恢复需求走，不是跟框架热度走。

向老板解释：用图省的是分支胶水和故障恢复成本，不是行数；若算出来维护图比写 if-else 贵，就退回 Workflow。`,
  },
]
