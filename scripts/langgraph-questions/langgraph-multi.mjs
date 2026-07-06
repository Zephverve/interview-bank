/** LangGraph · 多 Agent */
export default [
  {
    slug: '044-multi-agent-design',
    title: '如何用 LangGraph 实现多 Agent 系统？',
    round: '二面',
    difficulty: '⭐⭐⭐⭐',
    point: '多 Agent',
    priority: 'P1',
    freq: '3+ 篇',
    source: 'GitHub + 字节面经',
    conclusion: '常见模式：Supervisor 路由、层级子图、Handoff；共享 state 或隔离 state 取决于协作紧密度。',
    followups: '所有 agent 共享工具吗？ · 和单 Agent 多 tool 区别？',
    keyPoints: ['Supervisor 决定下一 worker', '子图作节点模块化', '通信靠 state channel 或 message'],
    oralAnswer: `多 Agent 在 LangGraph 里仍是图，只是节点换成不同角色的 agent。最常见 Supervisor 模式：supervisor 节点读 state，LLM 决定下一棒 researcher/coder/writer，worker 完回 supervisor 直到 done。

复杂系统用子图——每个 agent 是独立 StateGraph compile 后塞进父图当节点。字节二面追问「子 agent 能否共享工具」——我答工具定义可共享，但 state 命名空间隔离，避免互相污染消息历史。

和单 Agent 多 tool 区别：多 Agent 是不同 prompt/模型/权限的角色分工，适合任务阶段差异大；单 Agent 多 tool 适合统一大脑调不同 API。`,
  },
  {
    slug: '045-supervisor-pattern',
    title: 'Supervisor 模式怎么实现？',
    round: '二面',
    difficulty: '⭐⭐⭐⭐',
    point: 'Supervisor',
    priority: 'P1',
    freq: '3+ 篇',
    source: 'GitHub Premium Questions',
    conclusion: '中央 supervisor 节点用 LLM 选下一 worker，条件边路由，worker 完成后回 supervisor 形成星型拓扑。',
    followups: 'supervisor 本身会不会成为瓶颈？ · 死循环怎么防？',
    keyPoints: ['members 列表 + route 函数', 'worker 只改自己负责的 state 区', 'supervisor 看汇总结果决策'],
    oralAnswer: `实现步骤：定义含 messages 和 next_agent 的 state；supervisor 节点 prompt「根据当前任务选下一专家」，返回 next 字段；add_conditional_edges 从 supervisor 映射到各 worker；每个 worker 边回 supervisor。

星型拓扑：supervisor 居中，researcher/coder/writer 是辐条。防死循环靠 supervisor prompt 约束「完成则返回 FINISH」和 step_count 上限。

可用 langgraph-supervisor 预构建或手写，面试手写路由逻辑更能体现理解。`,
  },
  {
    slug: '046-subgraph',
    title: '子图（Subgraph）怎么用？',
    round: '二面',
    difficulty: '⭐⭐⭐⭐',
    point: '子图',
    priority: 'P1',
    freq: '2 篇',
    source: 'GitHub + 编程导航面经',
    conclusion: '子 StateGraph compile 后作为父图节点，可映射父子 state 字段，实现模块化和大工作流拆分。',
    followups: '父子 state 怎么映射？ · 嵌套层级建议几层？',
    keyPoints: ['子图独立测试部署', '父图通过节点包装 invoke 子图', '适合 RAG 子流程、审批子流程'],
    oralAnswer: `子图是把完整 StateGraph compile 后当父图一个 node。父节点函数里 invoke 子图，做 state 字段映射——父的 query 映射到子图输入，子图输出映射回父的 retrieval_result。

价值是模块化：RAG 流水线、代码审查环各自子图，团队分工维护。编程导航面经场景设计题可套「大工作流拆子图」。

嵌套建议不超过 2-3 层，否则 debug 困难。每层子图要有清晰输入输出契约。`,
  },
  {
    slug: '047-agent-handoff',
    title: 'Agent Handoff（交接）怎么实现？',
    round: '二面',
    difficulty: '⭐⭐⭐',
    point: 'Handoff',
    priority: 'P1',
    freq: '2 篇',
    source: 'GitHub Interview Questions',
    conclusion: '一个 agent 节点结束时写 state.handoff_to，条件边路由到下一 agent，并传递上下文摘要。',
    followups: '和 Supervisor 区别？ · 上下文怎么精简传递？',
    keyPoints: ['显式 handoff 字段', '传递 summary 而非全量 messages', 'OpenAI Swarm 同类思想'],
    oralAnswer: `Handoff 是 agent A 认为「这题该 B 管」时，写 state.handoff_to="billing_agent" 并附 context_summary，条件边路由到 B 的入口节点。B 从 summary 起步，不必重读 A 的全量历史。

和 Supervisor 区别：Handoff 是去中心化，A 自己决定交给谁；Supervisor 是中央调度。上下文传递用结构化 summary 控 token，别把整个 messages 拷过去。

适合客服转技能组、编码 agent 转测试 agent 等场景。`,
  },
  {
    slug: '048-shared-state-multi-agent',
    title: '多 Agent 之间共享 state 还是隔离？',
    round: '二面',
    difficulty: '⭐⭐⭐',
    point: '共享状态',
    priority: 'P1',
    freq: '2 篇面经',
    source: '字节 Agent 二面',
    conclusion: '紧协作共享 messages/任务板；松耦合用 handoff 摘要或独立 channel；绝不无脑共享全部工具权限。',
    followups: '为什么字节追问共享工具？ · 冲突怎么解？',
    keyPoints: ['共享：统一任务描述、汇总结果', '隔离：各 agent 私有 scratchpad', '工具按角色授权'],
    oralAnswer: `字节原题「能不能所有子 agent 共享工具」。我答：工具定义可共享只读 schema，但调用权限按角色分——researcher 不能调 delete_database。

State 上：messages 和 task_brief 共享；各 agent 可有私有 scratchpad channel 用不同 prefix，避免 writer 改 coder 的中间变量。紧耦合协作共享多，松耦合 handoff 传摘要。

并行写同一 channel 必须 reducer，否则和单图并发踩坑一样。`,
  },
  {
    slug: '049-plan-and-execute',
    title: 'Plan-and-Execute 模式怎么用 LangGraph 实现？',
    round: '二面',
    difficulty: '⭐⭐⭐⭐',
    point: '规划执行',
    priority: 'P1',
    freq: '2 篇',
    source: 'GitHub 100 Questions',
    conclusion: 'planner 节点生成步骤列表，executor 逐步执行，replanner 根据结果动态调整计划，条件边控制循环。',
    followups: '和 ReAct 区别？ · 计划存在哪？',
    keyPoints: ['plan 存 state.steps', 'executor 每次消费一步', '失败时 replanner 改计划'],
    oralAnswer: `Plan-and-Execute 分三节点：planner 根据目标生成 structured plan 写入 state.steps；executor 取当前 step 执行工具；执行完条件边判断——还有步骤则继续 executor，失败则 replanner 改 plan，全完成则 END。

和 ReAct 区别：ReAct 每步现想，Plan-and-Execute 先列清单再执行，适合步骤清晰的长任务，但计划可能跟不上变化所以要 replanner。

计划用 list[dict] 存 state，每步标 status: pending/done/failed。`,
  },
  {
    slug: '050-reflection-self-correction',
    title: 'Reflection / Self-Correction 反思循环怎么实现？',
    round: '二面',
    difficulty: '⭐⭐⭐⭐',
    point: '反思',
    priority: 'P1',
    freq: '2 篇',
    source: 'GitHub Premium Questions',
    conclusion: 'generate 节点产出 → critic 节点评审 → 条件边不满意则回 generate，满意则 END；类似 Reflexion 架构。',
    followups: '反思会不会无限循环？ · critic 用什么模型？',
    keyPoints: ['generator-critic 回边', 'critic 输出 score 或 pass/fail', '限制 max_reflections'],
    oralAnswer: `反思环：draft_node 生成答案 → reflect_node 用另一 prompt 或更强模型评审，写 critique 进 state → 条件边看 pass 与否，不通过带 critique 回 draft_node 重写，通过则 END。

控制 max_reflections 防循环。代码生成场景 critic 可跑测试用例，比纯 LLM 评更可靠。

LangGraph 价值是把这种环画清楚，每轮 critique 都进 checkpoint 可追溯。`,
  },
  {
    slug: '051-langgraph-routing-design',
    title: 'LangGraph 路由是如何设计的？为什么要用它？',
    round: '一面',
    difficulty: '⭐⭐⭐',
    point: '路由设计',
    priority: 'P0',
    freq: '2 篇面经',
    source: '牛客 · 蚂蚁',
    conclusion: '本质是状态机：全局 state + intent 节点 + 条件边到 RAG/工具/直接回答；用图是为显式分支和可测试路由。',
    followups: 'GraphRAG 为什么用？ · 评估怎么做？',
    keyPoints: ['意图识别写 route_key', '条件边映射多下游', '比 if-else 链可观测'],
    oralAnswer: `蚂蚁面经原题。我答：路由本质是状态机——定义 AgentState 含 intent、docs、answer；intent_node 分类用户问题；条件边按 intent 到 vector_retrieve、graph_retrieve 或 direct_llm。

为什么用 LangGraph：科研场景需要「检索→评判→不够好改写 query 再检索」的环，if-else 难维护；图编排让每条分支可单测，bad case 能定位到哪个 node。

追问 GraphRAG 时答：专业领域关键词隐含关系场景效果好，缺点是离线构图慢——和路由设计是配套的。`,
  },
  {
    slug: '052-hierarchical-agents',
    title: '层级多 Agent 团队（Hierarchical）怎么设计？',
    round: '二面',
    difficulty: '⭐⭐⭐⭐',
    point: '层级架构',
    priority: 'P2',
    freq: '1 篇',
    source: 'GitHub 100 Questions',
    conclusion: '顶层 supervisor 分大任务，中层组长管专业组，底层 worker 执行；用嵌套子图表达层级。',
    followups: '和扁平 Supervisor 取舍？ · 通信开销？',
    keyPoints: ['三层：总控→组长→执行者', '每层是子图', 'state 逐级汇总'],
    oralAnswer: `层级模式适合大组织仿真：CEO supervisor 拆战略任务给部门 supervisor，部门再分给研究员/工程师。LangGraph 实现用嵌套子图——父图节点 invoke 子图 supervisor，子图内部再路由 worker。

和扁平 Supervisor 比：层级降低顶层 prompt 复杂度，但增加延迟和 state 传递损耗。选型看任务是否自然分层——软件开发常扁平三角色就够，企业流程仿真才要层级。`,
  },
]
