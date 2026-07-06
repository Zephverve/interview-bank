/** LangGraph · 控制流 */
export default [
  {
    slug: '024-implement-cycle',
    title: 'LangGraph 怎么实现循环？',
    round: '一面',
    difficulty: '⭐⭐⭐',
    point: '循环',
    priority: 'P0',
    freq: '3+ 篇',
    source: 'CSDN 高频题',
    conclusion: '通过回边 add_edge("tool", "agent") 形成 ReAct 闭环，条件边 should_continue 决定是否继续或 END。',
    followups: '和 while True 区别？ · 多出口循环怎么画？',
    keyPoints: ['tool_node 执行完回到 agent_node', '条件边判断有无 tool_calls', '业务完成标志 + recursion_limit 双保险'],
    oralAnswer: `循环靠回边实现。经典 ReAct：agent_node 调 LLM，条件边 should_continue 检查最后 message 有没有 tool_calls——有则去 tool_node，没有则 END。tool_node 执行完 add_edge 回到 agent_node，形成环。

这和外面套 while 的区别是：循环边界显式画在图上，每轮 state 可 checkpoint，任意轮可 interrupt。多出口循环可以条件边返回不同下一跳，比如重试回 tool、失败走 fallback、成功 END。

面试要能手写 should_continue 伪代码，并说明为什么需要 step_count 或 recursion_limit 防止无限转。`,
  },
  {
    slug: '025-avoid-infinite-loop',
    title: 'LangGraph 怎么避免死循环？',
    round: '一面',
    difficulty: '⭐⭐⭐',
    point: '死循环',
    priority: 'P0',
    freq: '3+ 篇',
    source: 'CSDN + 牛客',
    conclusion: 'recursion_limit + state 内 step_count + 语义级查重（如重复 tool call）+ 平滑 fallback 而非抛 500。',
    followups: '工具一直返回空怎么办？ · 人类如何介入终止？',
    keyPoints: ['框架 recursion_limit 默认 1000，应调低', 'state 维护 step_count 路由到 fallback', '比对 last_tool_call 阻断重复撞墙'],
    oralAnswer: `防死循环我设三道防线。第一，recursion_limit 按业务调，比如 ReAct 最多 15 轮，超限抛 GraphRecursionError——但生产别让用户看 500，要在条件边里用 step_count 平滑路由到 fallback 节点。

第二，语义查重：维护 last_tool_call，如果 LLM 用一模一样参数再调失败工具，直接阻断转人工。第三，工具返回空或错误时，限制同一工具连续调用次数，超过走 query_rewrite 或 END。

CSDN 高频题强调：单纯依赖 recursion_limit 用户体验差；在 smart_router 里引到 human_fallback，用户看到的是「这个问题较难，正在转人工」。`,
  },
  {
    slug: '026-recursion-limit',
    title: 'recursion_limit 是什么？怎么配置？',
    round: '一面',
    difficulty: '⭐⭐',
    point: '递归限制',
    priority: 'P1',
    freq: '2 篇',
    source: 'GitHub 100 Questions',
    conclusion: '限制图 super-step 最大次数，超限抛 GraphRecursionError；可在 compile 或 invoke 时设置。',
    followups: '和 step_count 区别？ · 合理值怎么定？',
    keyPoints: ['默认 1000，生产应显式调小', 'invoke 时 config 可覆盖', '应配合业务 fallback 而非硬砍'],
    oralAnswer: `recursion_limit 限制图执行的最大 super-step 数，防止 Agent 无限循环。默认很高（1000），实际 invoke 时建议显式传，比如 {"recursion_limit": 25}。

它和 state 里自维护的 step_count 互补：recursion_limit 是框架硬上限，step_count 是业务软路由，可以在到达上限前优雅 fallback。

定值看业务：简单问答 5-10 轮，代码修复循环 15-20 轮。要结合 token 预算和 P99 延迟一起调。`,
  },
  {
    slug: '027-conditional-vs-normal-edge',
    title: '条件边和普通边的区别？',
    round: '一面',
    difficulty: '⭐⭐',
    point: '边类型',
    priority: 'P0',
    freq: '3+ 篇',
    source: 'GitHub + CSDN',
    conclusion: '普通边固定跳转；条件边每次执行路由函数，根据 state 动态选下一节点，是 Agent 决策核心。',
    followups: '路由函数能调 LLM 吗？ · 多条件映射怎么写？',
    keyPoints: ['add_edge 确定性', 'add_conditional_edges 动态', '路由函数应纯、可单测'],
    oralAnswer: `普通边是确定性跳转，A 完一定去 B，适合固定流水线。条件边是动态路由，add_conditional_edges(source, path_fn, mapping) 里 path_fn 读 state 返回字符串 key，查 mapping 找下一节点。

Agent 的核心决策都在条件边——有没有 tool_calls、检索质量够不够、要不要人工审批。路由函数可以是规则，也可以内部调 LLM 做分类，但最好保持可单测，复杂逻辑拆成独立节点。

多个出口就在 mapping 里多几个 key，比如 "retry"、"fallback"、"end"。`,
  },
  {
    slug: '028-command-pattern',
    title: 'Command 模式是什么？resume 怎么用？',
    round: '二面',
    difficulty: '⭐⭐⭐',
    point: 'Command',
    priority: 'P1',
    freq: '2 篇',
    source: 'GitHub + LangGraph 1.0',
    conclusion: 'Command 用于 interrupt 后恢复执行，可携带人工输入或强制跳转节点，替代旧 breakpoint API。',
    followups: '和 update_state 区别？ · 拒绝审批后走哪？',
    keyPoints: ['interrupt 挂起后 stream(Command(resume=...))', '可指定 goto 跳转', 'LangGraph 1.0 一等公民 API'],
    oralAnswer: `Command 是 LangGraph 1.0 里控制执行流的 primitive，尤其用于 HITL。interrupt 挂起后，恢复时不是简单 invoke(None)，可以用 Command(resume=value) 把人工输入带回图里，或 Command(goto="node_name") 强制跳转。

和 update_state 区别：update_state 改 checkpoint 里的 state 快照；Command 还表达「从哪继续、往哪走」的执行意图。审批拒绝可以 resume 带 reject 标志，条件边路由到 apology 节点。

面试提到 Command 说明跟过 1.0 变化，不是只背 interrupt_before 老 API。`,
  },
  {
    slug: '029-send-api-parallel',
    title: 'Send API 如何实现并行执行？',
    round: '二面',
    difficulty: '⭐⭐⭐',
    point: '并行',
    priority: 'P1',
    freq: '2 篇',
    source: 'GitHub Interview Questions',
    conclusion: '节点返回多个 Send(target, arg) 实现 dynamic fan-out，各 worker 并行跑，结果经 reducer 合并。',
    followups: '和静态并行边区别？ · 结果冲突怎么处理？',
    keyPoints: ['动态决定并行任务数量', '每个 Send 指定目标节点和输入', '汇总靠 reducer 或下游 reduce 节点'],
    oralAnswer: `Send API 用于 map 阶段动态 fan-out。一个节点可以 return [Send("worker", {"item": x}) for x in items]，框架并行调度多个 worker 节点，各自处理子任务。

和写死多条并行边不同，Send 的任务数运行时决定，适合「一篇文档拆 N 段分别摘要」这类场景。结果合并靠 state reducer 或专门的 reduce 节点收集 worker 输出。

编程导航面经里「多路调用」可以结合 Send 讲——检索·工具·规则多路并行，汇总节点 merge。`,
  },
  {
    slug: '030-map-reduce',
    title: 'LangGraph 里 Map-Reduce 工作流怎么实现？',
    round: '二面',
    difficulty: '⭐⭐⭐',
    point: 'Map-Reduce',
    priority: 'P1',
    freq: '2 篇',
    source: 'GitHub 100 Questions',
    conclusion: 'Map 阶段 Send fan-out 到 worker 节点，Reduce 阶段汇总节点合并结果进 state。',
    followups: '部分 worker 失败怎么办？ · 适合什么业务？',
    keyPoints: ['fan-out → 并行 worker → fan-in', '失败 worker 结果标 error 仍进 reduce', '适合批量文档/多源检索'],
    oralAnswer: `Map-Reduce 在 LangGraph 里就是 Send + reducer。splitter 节点把任务拆成 N 份，Send 到 worker 节点并行处理，reduce 节点读 state 里各 worker 结果做合并——可以是拼接摘要、投票、或再调 LLM 综合。

部分失败时 worker 返回 error 标志，reduce 节点决定跳过或重试，不要一颗老鼠屎坏整锅。适合批量入库、多源检索、大规模 eval 等可并行化任务。

和 Hadoop Map-Reduce 思想一致，但粒度是 Agent 节点而非机器节点。`,
  },
  {
    slug: '031-fallback-node',
    title: 'fallback 节点怎么设计和实现？',
    round: '一面/二面',
    difficulty: '⭐⭐⭐',
    point: '降级',
    priority: 'P1',
    freq: '3+ 篇面经',
    source: '牛客 · 某大厂',
    conclusion: '条件边在失败/超限/低置信时路由到 fallback，返回友好提示或转人工，避免抛裸异常。',
    followups: 'fallback 和 retry 边界？ · 用户看到什么？',
    keyPoints: ['触发：重试耗尽、检索为空、recursion 达阈值', '输出结构化降级响应', '记录原因进 state 供监控'],
    oralAnswer: `某大厂面经原题「fallback 怎么做」。fallback 是条件边的一个出口，触发条件包括：工具重试耗尽、检索质量门控不通过、step_count 超限、LLM 输出解析失败。

fallback 节点不继续折腾，而是返回用户可理解的响应——「暂时无法完成，建议简化问题」或「已转人工客服」，同时把 failure_reason 写入 state 供监控和 bad case 入库。

和 retry 边界：可重试错误先回环，不可重试或超过 N 次才 fallback。别让 fallback 变成万能垃圾桶，要分类统计触发原因。`,
  },
  {
    slug: '032-retry-mechanism',
    title: '整体失败重试机制怎么设计（node、RAG 链、tools）？',
    round: '一面/二面',
    difficulty: '⭐⭐⭐⭐',
    point: '重试分层',
    priority: 'P0',
    freq: '3+ 篇面经',
    source: '牛客 · 某大厂/阿里国际',
    conclusion: '分三层：node 内 try-catch + 回边；tool 层超时重试 + 幂等；RAG 层检索失败走 query rewrite 环。',
    followups: '副作用怎么幂等？ · 重试监控看什么？',
    keyPoints: ['可重试 vs 不可重试错误分类', '外部副作用配幂等键', '全局熔断：连续失败转人工'],
    oralAnswer: `牛客原题，我按三层答。Node 层：每个节点外包 try-catch，网络超时、限流等可重试错误走条件边回上一节点或专用 retry 节点；参数非法直接 fallback。

Tool 层：设超时和 max_retries，失败结果写入 state 让 agent 决定换参还是放弃；扣款、发邮件类副作用必须幂等键，重试不能 duplicate。

RAG 链层：检索为空或 grade 不通过，走 rewrite_query 节点回到 retrieve，而不是让 LLM 硬编。全局加连续失败计数，超阈值熔断转人工。每层记录 attempt 和最终状态进 trace。`,
  },
  {
    slug: '033-stuck-agent',
    title: '如何处理 stuck agent（卡住的 Agent）？',
    round: '二面',
    difficulty: '⭐⭐⭐',
    point: '可靠性',
    priority: 'P1',
    freq: '2 篇',
    source: 'GitHub 100 Questions',
    conclusion: '检测：重复 tool call、step_count 不涨、token 爆；处理：强制路由 fallback、interrupt 人工、或 rollback checkpoint。',
    followups: '怎么线上发现 stuck？ · 能否自动 rollback？',
    keyPoints: ['语义查重检测重复动作', '监控 step 耗时异常', 'get_state_history 回滚到安全点'],
    oralAnswer: `stuck 表现：同一工具同参数反复调、step_count 涨但无进展、单 thread 耗时或 token 异常高。

检测靠三类规则：last_tool_call 重复、N 轮内 state 关键字段不变、超过 SLA 时间。处理上优先条件边引到 fallback；严重情况 interrupt 挂起让人工看 state；LangGraph 支持 get_state_history 回滚到之前 checkpoint 再 resume。

线上用 LangSmith 或自研 trace 看节点级耗时，对 P99 异常的 thread 告警。`,
  },
  {
    slug: '034-semantic-routing',
    title: '如何实现语义路由（Semantic Routing）？',
    round: '二面',
    difficulty: '⭐⭐⭐',
    point: '路由',
    priority: 'P2',
    freq: '1 篇',
    source: 'GitHub 100 Questions',
    conclusion: '用 LLM 或 embedding 分类器在条件边/路由节点判断意图，映射到不同子图或工具集。',
    followups: '路由不准怎么办？ · 和 intent node 区别？',
    keyPoints: ['专用 router 节点输出 next_route', '可小模型分类降本', '低置信走澄清或默认路径'],
    oralAnswer: `语义路由是在图入口或中间用 LLM/embedding 分类用户意图，条件边根据分类结果跳到不同分支——客服里「查订单」和「投诉」走不同子流程。

实现上单独 router 节点，输入 messages，输出 state 里的 route_key；条件边读 route_key 映射。为省 token 可用小模型或 embedding+阈值。

路由不稳时加澄清节点 interrupt 问用户，或低置信走安全默认路径。蚂蚁面经里 LangGraph 路由设计是同类题。`,
  },
]
