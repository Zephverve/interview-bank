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

#### 🗣️ 先用大白话说

LangGraph 的循环不是靠外面套 while True，而是在图里画一条「回头路」——比如 tool 节点执行完，用 add_edge 连回 agent 节点，形成 ReAct 闭环。每转一圈，state 都会更新，还能被 checkpoint 存下来。条件边 should_continue 就像路口红绿灯：有 tool_calls 就去调工具，没有就 END 结束。这比裸 while 强在：循环边界看得见、每轮状态可持久化、任意轮可以 interrupt 挂起等人审批。

#### 📖 面试展开（详细版）

**是什么**：LangGraph 的循环通过「回边」（back edge）实现——节点 A 执行完后，边可以指回之前的节点 B，形成环。经典 ReAct 模式是 agent_node → 条件边判断 → tool_node → 回边回到 agent_node，直到 LLM 不再发起 tool_calls 才走 END。

**为什么不用 while**：外面套 while True 也能循环，但状态管理、断点恢复、人工介入都靠自己写胶水代码。LangGraph 把每一轮循环当成图的一个 super-step，天然支持 checkpoint 和 interrupt，循环边界画在图上，团队一眼能看懂控制流。

**怎么用**：定义 should_continue 路由函数，读 state 里最后一条 message 有没有 tool_calls；有则返回 "tools" 映射到 tool_node，没有返回 END。tool_node 执行完用 add_edge("tools", "agent") 连回去。多出口循环可以在 mapping 里加 "retry"、"fallback"、"end" 等 key。

**项目例子**：科研问答 Agent 里，Retrieve → Grade → 分数不够就 Rewrite 回 Retrieve，这就是带环的图。如果用 Chain 写，要嵌套多层 if-else 和 try-except；用 LangGraph 一张图表达，每个节点可单独单测。

**踩坑**：只画回边不设退出条件，必然死循环；务必配合 recursion_limit 和业务级 step_count 双保险。另一个坑是 tool_node 回边写错方向，导致跳过 agent 直接无限调工具。

#### 💡 核心要点
- tool_node 执行完回到 agent_node
- 条件边判断有无 tool_calls
- 业务完成标志 + recursion_limit 双保险

#### 📝 代码/配置示例

```python
from langgraph.graph import StateGraph, END

def should_continue(state):
    last = state["messages"][-1]
    if getattr(last, "tool_calls", None):
        return "tools"
    return END

graph = StateGraph(AgentState)
graph.add_node("agent", agent_node)
graph.add_node("tools", tool_node)
graph.add_conditional_edges("agent", should_continue, {"tools": "tools", END: END})
graph.add_edge("tools", "agent")  # 回边形成循环
app = graph.compile()
```

#### 🔁 追问怎么接

**「和 while True 区别？」**——强调三点：图上循环可 checkpoint/interrupt；每轮 state 显式演化；条件边可单测。while 适合脚本，LangGraph 适合要上线的 Agent。

**「多出口循环怎么画？」**——条件边 mapping 里定义多个出口：retry 回上一节点、fallback 降级、end 正常结束。举例说明「检索失败走 rewrite 回 retrieve，重试 3 次后走 fallback」。
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

#### 🗣️ 先用大白话说

Agent 死循环最常见的情况是：工具一直返回空，LLM 不死心反复重试，图就在 agent→tool→agent 之间空转。防法要设三道防线：框架级 recursion_limit 硬上限、state 里 step_count 软路由到 fallback、语义查重发现「同一工具同一参数调了 N 次」直接阻断。关键是不能让用户看到 GraphRecursionError 的 500，要在条件边里优雅降级，比如转人工或提示简化问题。

#### 📖 面试展开（详细版）

**是什么**：死循环指图在环里无限执行，super-step 不断增长直到触发 recursion_limit 或耗尽 token/时间预算。ReAct Agent 里最常见诱因是工具返回空/错误，LLM 换汤不换药地重试。

**为什么危险**：生产环境直接抛 GraphRecursionError 给用户是灾难体验；更隐蔽的是 token 和 API 费用持续燃烧，P99 延迟飙升，监控才发现已经跑了几十轮。

**三道防线**：第一，recursion_limit 在 invoke config 里显式设小（如 15-25），这是框架硬上限。第二，state 维护 step_count，每轮 +1，条件边里超过阈值走 fallback 而非硬砍。第三，语义查重：记录 last_tool_call，如果连续 N 次相同参数调同一失败工具，直接路由到 human_fallback。

**项目例子**：RAG Agent 检索一直为空，LLM 反复调 search 工具。我们在 smart_router 里加规则：同一 query 检索 2 次仍为空，走 query_rewrite 节点换关键词；rewrite 2 次还不行，fallback 返回「未找到相关资料，建议换个问法」。

**踩坑**：只依赖 recursion_limit 不设 fallback，用户看到 500；step_count 忘了在节点里递增导致软路由失效；语义查重太严误杀合理重试。

#### 💡 核心要点
- 框架 recursion_limit 默认 1000，应调低
- state 维护 step_count 路由到 fallback
- 比对 last_tool_call 阻断重复撞墙

#### 📝 代码/配置示例

```python
def smart_router(state):
    if state.get("step_count", 0) >= 15:
        return "fallback"
    last = state.get("last_tool_call")
    current = extract_tool_call(state["messages"][-1])
    if last == current and state.get("repeat_count", 0) >= 2:
        return "human_fallback"
    return "continue"

def agent_node(state):
    return {"step_count": state.get("step_count", 0) + 1}

app.invoke(input, config={"recursion_limit": 20})
```

#### 🔁 追问怎么接

**「工具一直返回空怎么办？」**——分层处理：先 query_rewrite 换关键词重检；rewrite 仍失败走 fallback 坦诚告知；记录 failure_reason 进监控。

**「人类如何介入？」**——step_count 超阈值或 repeat_count 触发时，条件边路由到 interrupt 节点挂起，前端展示当前 state 让人工接管或终止。
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

#### 🗣️ 先用大白话说

recursion_limit 是 LangGraph 框架给图执行设的「最大步数」上限，每经过一个 super-step 就计一次，超了抛 GraphRecursionError。默认值 1000 对 Agent 来说太高了，生产一定要显式调小。它和 state 里的 step_count 是互补关系：recursion_limit 是硬天花板，step_count 是业务软路由，可以在触顶前优雅走 fallback。

#### 📖 面试展开（详细版）

**是什么**：recursion_limit 限制图执行的最大 super-step 数。一个 super-step 可能包含一个或多个并行节点的执行。超过限制，框架抛出 GraphRecursionError 终止执行。

**为什么需要**：Agent 天然有循环，没有上限就像 while True 没有 break。这是框架级安全网，防止 bug 或模型异常导致无限消耗。

**怎么配置**：invoke/ainvoke 时传 config={"recursion_limit": 25}；也可以在 compile 时设默认值。建议按业务场景显式配置，不要依赖默认 1000。

**和 step_count 区别**：recursion_limit 是框架硬限制，触顶直接抛异常；step_count 是业务字段，在条件边里判断后路由到 fallback，用户体验更好。两者应配合使用。

**合理值怎么定**：简单问答 5-10 轮；标准 ReAct 10-15 轮；代码生成-运行-修复循环 15-20 轮。要结合 token 预算、单次 LLM 延迟和 P99 SLA 一起调，上线后根据监控数据迭代。

**踩坑**：只设 recursion_limit 不设 fallback，用户看到裸异常；设太小导致正常复杂任务被误杀；不同业务场景共用一个值，要么浪费要么不够。

#### 💡 核心要点
- 默认 1000，生产应显式调小
- invoke 时 config 可覆盖
- 应配合业务 fallback 而非硬砍

#### 📝 代码/配置示例

```python
# invoke 时配置
result = app.invoke(
    {"messages": [HumanMessage("帮我查天气")]},
    config={"recursion_limit": 15, "configurable": {"thread_id": "t-1"}},
)

# compile 时设默认
app = graph.compile(checkpointer=saver, interrupt_before=["execute"])
```

#### 🔁 追问怎么接

**「和 step_count 区别？」**——recursion_limit 是框架兜底抛异常；step_count 是业务可控的软路由。好的实践是 step_count 在 80% 阈值就走 fallback，recursion_limit 作为最后保险。

**「合理值怎么定？」**——给公式：预估平均工具调用轮数 × 1.5 安全系数，结合 token 预算和 P99 延迟监控迭代。
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

#### 🗣️ 先用大白话说

普通边是「A 做完一定去 B」的固定跳转，适合流水线步骤。条件边是动态的：每次执行都跑一个路由函数，读当前 state 决定下一跳去哪。Agent 的核心决策——要不要调工具、检索质量够不够、要不要人工审批——全在条件边上。路由函数最好写成纯函数方便单测，复杂逻辑可以拆成独立 router 节点。

#### 📖 面试展开（详细版）

**普通边（add_edge）**：确定性跳转，源节点执行完必然进入目标节点。适合固定流水线，如 retrieve → generate → format。

**条件边（add_conditional_edges）**：动态路由，签名是 add_conditional_edges(source, path_fn, mapping)。path_fn 接收 state，返回字符串 key；框架查 mapping 找下一节点。可以映射到 END 结束执行。

**为什么 Agent 离不开条件边**：Agent 的「决策」本质是「根据当前状态选择下一步行动」。有没有 tool_calls、检索分数够不够、用户意图是查询还是投诉——这些都是运行时才能知道的，必须用条件边。

**路由函数能调 LLM 吗**：可以，但建议把 LLM 分类逻辑拆成独立 router 节点，条件边只做简单查表。这样 router 节点可单独测试，路由函数保持纯函数。

**多条件映射**：mapping 里定义多个出口，如 {"retry": "retrieve", "fallback": "fallback", "continue": "generate", END: END}。path_fn 返回对应 key。

**踩坑**：在路由函数里写副作用（发请求、改数据库）；路由函数过于复杂难以测试；mapping 漏了 path_fn 可能返回的 key 导致运行时错误。

#### 💡 核心要点
- add_edge 确定性
- add_conditional_edges 动态
- 路由函数应纯、可单测

#### 📝 代码/配置示例

```python
def route_after_grade(state):
    score = state.get("grade_score", 0)
    if score >= 0.7:
        return "generate"
    if state.get("rewrite_count", 0) >= 2:
        return "fallback"
    return "rewrite"

graph.add_conditional_edges(
    "grade",
    route_after_grade,
    {"generate": "generate", "rewrite": "rewrite", "fallback": "fallback"},
)
graph.add_edge("retrieve", "grade")  # 普通边：固定跳转
```

#### 🔁 追问怎么接

**「路由函数能调 LLM 吗？」**——可以但建议拆成 router 节点，条件边只做查 state 里的 route_key。强调可测试性和关注点分离。

**「多条件映射怎么写？」**——展示 mapping 字典多个 key，说明 path_fn 返回逻辑；提及 END 作为特殊出口。
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

#### 🗣️ 先用大白话说

Command 是 LangGraph 1.0 里控制执行流的「遥控器」，专门用于 interrupt 之后恢复执行。人工审批通过后，不是简单 invoke(None)，而是用 Command(resume=审批结果) 把人的输入带回图里继续跑。也可以 Command(goto="某节点") 强制跳转，比如审批拒绝直接跳到道歉节点。面试提到 Command 说明你跟过 1.0 变化，不是只背 interrupt_before 老 API。

#### 📖 面试展开（详细版）

**是什么**：Command 是 LangGraph 1.0 引入的执行控制原语，用于表达「从 interrupt 点如何继续」的意图。可以携带 resume 值（人工输入）、指定 goto 目标节点、或组合使用。

**为什么取代 breakpoint**：旧 breakpoint API 语义不够清晰，Command 把「恢复」「跳转」「更新」统一成一等公民，和 interrupt() 函数配合更自然。

**resume 怎么用**：图在 interrupt 点挂起后，checkpoint 已保存当前 state。应用层展示中间结果，用户操作后调用 app.stream(Command(resume=user_input), config) 或 astream 继续执行。resume 的值会传回 interrupt 调用处。

**和 update_state 区别**：update_state 只改 checkpoint 里的 state 快照，不表达执行意图；Command 同时表达「从哪继续、往哪走、带什么输入」。审批拒绝场景可以 Command(resume={"approved": False}) 让条件边路由到 apology 节点。

**项目例子**：生成 SQL 后 interrupt 让人审核，人改了 SQL 用 Command(resume=modified_sql) 继续；人拒绝用 Command(goto="apology") 直接跳转。

**踩坑**：resume 后 pending 边可能重跑节点，涉及副作用要幂等；混淆 Command 和 update_state 导致状态改了但执行流不对。

#### 💡 核心要点
- interrupt 挂起后 stream(Command(resume=...))
- 可指定 goto 跳转
- LangGraph 1.0 一等公民 API

#### 📝 代码/配置示例

```python
from langgraph.types import Command

# 节点内动态 interrupt
def execute_node(state):
    plan = state["plan"]
    approval = interrupt({"action": "execute", "plan": plan})
    if not approval.get("approved"):
        return Command(goto="apology")
    return run_plan(approval["modified_plan"])

# 应用层恢复
for event in app.stream(Command(resume={"approved": True}), config):
    handle(event)
```

#### 🔁 追问怎么接

**「和 update_state 区别？」**——update_state 改快照；Command 改快照 + 表达执行意图（resume/goto）。审批改数据用 update_state，审批后继续/跳转用 Command。

**「拒绝审批后走哪？」**——Command(resume={"approved": False}) 或 Command(goto="apology")，条件边读标志位路由。强调拒绝也是正常业务路径，不是异常。
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

#### 🗣️ 先用大白话说

Send API 解决的是「运行时才知道要并行几份」的问题。一个节点 return [Send("worker", {"item": x}) for x in items]，框架会并行调度多个 worker 节点各自处理。和写死多条并行边不同，任务数量是动态的。结果合并靠 state 上的 reducer 或专门的 reduce 节点汇总。适合批量文档摘要、多源并行检索这类 Map 场景。

#### 📖 面试展开（详细版）

**是什么**：Send 是 LangGraph 的动态 fan-out 原语。节点可以返回一个或多个 Send 对象，每个指定目标节点名称和传入的 state 片段，框架在同一 super-step 并行调度这些 worker。

**为什么需要**：静态并行边要求提前知道分支数量；实际业务里「一篇文档拆几段」「几个数据源并行查」都是运行时决定的，Send 正好解决这个问题。

**怎么用**：splitter 节点读取 items 列表，return [Send("worker", {"chunk": c}) for c in chunks]。worker 节点处理单个 chunk 写回 state。reduce 节点或 reducer 合并所有 worker 输出。

**和静态并行区别**：静态用 add_edge 从同一源节点连多个目标，每次都跑所有分支；Send 动态决定跑几个、每个带什么参数。

**结果冲突**：并行写同一 state 字段必须配 reducer（如 list append 或自定义 merge）。否则后写的覆盖先写的，丢数据。

**项目例子**：编程导航面经里的「多路调用」——检索、工具、规则引擎三路 Send 并行，汇总节点 merge 后交给 generate。

#### 💡 核心要点
- 动态决定并行任务数量
- 每个 Send 指定目标节点和输入
- 汇总靠 reducer 或下游 reduce 节点

#### 📝 代码/配置示例

```python
from langgraph.types import Send

def fan_out(state):
    return [Send("worker", {"chunk": c}) for c in state["chunks"]]

def worker(state):
    summary = summarize(state["chunk"])
    return {"summaries": [summary]}  # reducer 追加

graph.add_node("split", fan_out)
graph.add_node("worker", worker)
graph.add_node("reduce", merge_summaries)
graph.add_conditional_edges("split", fan_out)
```

#### 🔁 追问怎么接

**「和静态并行边区别？」**——静态分支数固定、每次都跑；Send 运行时决定数量和参数。举例「文档段数不固定」。

**「结果冲突怎么处理？」**——state 字段配 Annotated reducer；worker 返回 partial update 由框架合并；reduce 节点做最终汇总。
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

#### 🗣️ 先用大白话说

Map-Reduce 在 LangGraph 里就是 Send + reducer 的组合拳。splitter 节点把大任务拆成 N 份，Send 给 worker 并行处理，reduce 节点把各 worker 结果合并——可以拼接、投票或再调 LLM 综合。部分 worker 失败时让它返回 error 标志，reduce 决定跳过或重试，别让一颗老鼠屎坏整锅粥。

#### 📖 面试展开（详细版）

**Map 阶段**：splitter 节点将输入拆分为子任务列表，通过 Send API fan-out 到 worker 节点。每个 worker 独立处理一个子任务，写回 state 的对应字段（需 reducer 合并）。

**Reduce 阶段**：专门的 reduce 节点读取所有 worker 输出，做合并——文本拼接、结构化聚合、或再调 LLM 生成综合摘要。

**部分失败处理**：worker 节点 catch 异常，返回 {"results": [{"status": "error", "chunk_id": id}]} 而非抛异常。reduce 节点统计成功率，低于阈值走 fallback 或重试失败的 chunk。

**适合什么业务**：批量文档入库摘要、多源并行检索（向量库+关键词+知识图谱）、大规模 eval 跑批、长文档分段翻译。

**和 Hadoop Map-Reduce 对比**：思想一致（分而治之再汇总），但粒度是 Agent 节点而非机器节点，调度由 LangGraph runtime 管理。

**踩坑**：worker 抛异常导致整图失败；reduce 节点等所有 worker 但某个永远不回；合并时 token 超限要分段 reduce。

#### 💡 核心要点
- fan-out → 并行 worker → fan-in
- 失败 worker 结果标 error 仍进 reduce
- 适合批量文档/多源检索

#### 📝 代码/配置示例

```python
def split_docs(state):
    chunks = chunk_document(state["document"])
    return [Send("summarize_worker", {"chunk": c, "id": i}) for i, c in enumerate(chunks)]

def summarize_worker(state):
    try:
        s = llm_summarize(state["chunk"])
        return {"partial_summaries": [{"id": state["id"], "text": s, "ok": True}]}
    except Exception as e:
        return {"partial_summaries": [{"id": state["id"], "ok": False, "err": str(e)}]}

def reduce_node(state):
    ok = [p for p in state["partial_summaries"] if p["ok"]]
    return {"final_summary": llm_merge(ok)}
```

#### 🔁 追问怎么接

**「部分 worker 失败怎么办？」**——worker 返回 error 标志不抛异常；reduce 统计成功率决定继续/重试/fallback；可 Send 重试失败 chunk。

**「适合什么业务？」**——批量文档处理、多源检索、eval 跑批。不适合强顺序依赖的任务。
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

#### 🗣️ 先用大白话说

fallback 不是 catch-all 异常处理，而是图里一个正经的「降级出口」节点。当重试耗尽、检索质量不达标、step_count 超限等条件满足时，条件边路由到 fallback，返回用户能看懂的话——「建议简化问题」或「已转人工」——同时把 failure_reason 写进 state 供监控。和 retry 的边界是：可重试的先回环，确认没救了才 fallback。

#### 📖 面试展开（详细版）

**是什么**：fallback 是图中的一个专用节点，负责在无法正常完成任务时返回降级响应，是条件边的一个出口而非全局异常捕获。

**触发条件**：工具重试耗尽、RAG 检索为空或 grade 不通过、step_count/recursion_limit 接近上限、LLM 输出解析失败、路由低置信度。

**输出设计**：返回结构化降级响应，包含 user_message（用户可见）、failure_reason（内部原因）、suggested_action（简化问题/转人工/稍后重试）。不要暴露技术栈错误信息。

**和 retry 边界**：可重试错误（网络超时、限流）先走回边或 retry 节点；不可重试错误（参数非法）或超过 max_retries 才走 fallback。分类统计各触发原因，别让 fallback 变成万能垃圾桶。

**监控**：failure_reason 写入 state 并上报 trace，回流 bad case 到评测集。按原因分桶统计，指导优化方向。

**踩坑**：fallback 消息太技术化吓用户；所有错误都走 fallback 导致 retry 形同虚设；没记录原因无法做归因分析。

#### 💡 核心要点
- 触发：重试耗尽、检索为空、recursion 达阈值
- 输出结构化降级响应
- 记录原因进 state 供监控

#### 📝 代码/配置示例

```python
def route_on_error(state):
    if state.get("retry_count", 0) < 3 and state.get("last_error") == "timeout":
        return "retry"
    return "fallback"

def fallback_node(state):
    reason = state.get("failure_reason", "unknown")
    messages = {
        "retrieval_empty": "未找到相关资料，建议换个问法或补充关键词。",
        "step_limit": "这个问题比较复杂，已为您转接人工客服。",
    }
    return {
        "messages": [AIMessage(messages.get(reason, "暂时无法完成，请稍后重试。"))],
        "status": "degraded",
    }
```

#### 🔁 追问怎么接

**「fallback 和 retry 边界？」**——可重试（超时/限流）先 retry；不可重试（参数非法）或次数耗尽才 fallback。给具体分类表。

**「用户看到什么？」**——友好中文提示 + 建议动作，绝不暴露 stack trace。举例两种场景的文案。
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

#### 🗣️ 先用大白话说

牛客高频题，建议按三层答。Node 层用 try-catch 区分可重试/不可重试错误，可重试走回边。Tool 层设超时和 max_retries，有副作用的操作必须配幂等键。RAG 链层检索为空不走幻觉，而是走 query_rewrite 换关键词重检。全局加连续失败熔断，超阈值转人工，每层记录 attempt 次数进 trace。

#### 📖 面试展开（详细版）

**Node 层**：每个节点外包 try-catch，将错误分类。可重试错误（网络超时、429 限流、临时 5xx）通过条件边路由到 retry 节点或回上一节点；不可重试错误（参数非法、401 鉴权失败）直接走 fallback。节点内维护 retry_count 字段。

**Tool 层**：工具调用设超时（如 30s）和 max_retries（如 3 次），指数退避。失败结果写入 state（tool_error、last_tool_call），让 agent 节点读错误决定换参数还是放弃。涉及外部副作用（发邮件、扣款、下单）必须用 idempotency_key，重试不会 duplicate 操作。

**RAG 链层**：检索为空或 grade 分数低，不走 LLM 硬编答案，而是路由到 rewrite_query 节点改写查询后回到 retrieve，形成环。rewrite 次数有上限，超过走 fallback 坦诚告知。

**全局熔断**：state 维护 consecutive_failures 计数，超过 N 次转人工 interrupt 或 fallback。防止单 thread 无限消耗资源。

**监控**：每层记录 attempt 次数、错误类型、最终状态进 LangSmith/自研 trace。按节点统计失败率，指导优化。

**踩坑**：重试副作用操作导致重复扣款；不区分可重试/不可重试浪费配额；RAG 检索失败让 LLM 幻觉回答。

#### 💡 核心要点
- 可重试 vs 不可重试错误分类
- 外部副作用配幂等键
- 全局熔断：连续失败转人工

#### 📝 代码/配置示例

```python
def retrieve_node(state):
    try:
        docs = retriever.invoke(state["query"])
        if not docs:
            return {"retrieval_ok": False, "retry_count": state.get("retry_count", 0) + 1}
        return {"docs": docs, "retrieval_ok": True}
    except TimeoutError:
        return {"last_error": "timeout", "retry_count": state.get("retry_count", 0) + 1}

def route_after_retrieve(state):
    if state.get("retrieval_ok"):
        return "generate"
    if state.get("retry_count", 0) < 2:
        return "rewrite_query"
    return "fallback"
```

#### 🔁 追问怎么接

**「副作用怎么幂等？」**——工具层 idempotency_key = 业务主键；state 维护 executed_actions 列表；恢复前先查外部系统状态。

**「重试监控看什么？」**——每节点 attempt 分布、失败类型 TopN、retry 后成功率、熔断触发次数。
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

#### 🗣️ 先用大白话说

stuck agent 就是图还在跑，但没有实质进展——同一工具同参数反复调、step_count 涨但关键字段不变、单 thread 耗时或 token 异常高。检测靠语义查重、进展监控、SLA 超时三条规则。处理上优先条件边引 fallback；严重的 interrupt 让人工看 state；LangGraph 支持 get_state_history 回滚到之前 checkpoint 再 resume。

#### 📖 面试展开（详细版）

**表现**：同一工具同一参数反复调用；step_count 持续增长但 state 关键字段（如 retrieved_docs）不变；单 thread 执行时间或 token 消耗远超 P99 基线。

**检测规则**：语义查重——last_tool_call 连续 N 次相同；进展监控——M 轮内关键字段无变化；SLA 超时——单 thread 执行超过设定阈值（如 120s）。

**处理策略**：轻度 stuck 条件边路由 fallback，返回友好提示。中度 stuck 触发 interrupt 挂起，通知运维或让用户介入。重度 stuck 用 get_state_history 找到最近一个「安全」checkpoint，update_state 回滚后 resume。

**线上发现**：LangSmith 或自研 trace 监控节点级耗时和 thread 总时长；对 P99 异常 thread 告警；dashboard 展示 stuck 触发率和原因分布。

**自动 rollback**：技术上可行——找到出错前的 checkpoint_id，fork 新分支重跑。但生产慎用，因为回滚点之后可能已有不可逆副作用。开发环境可随意实验。

**踩坑**：只设超时没有 stuck 语义检测，误杀慢但正常的任务；rollback 不考虑已发生的副作用。

#### 💡 核心要点
- 语义查重检测重复动作
- 监控 step 耗时异常
- get_state_history 回滚到安全点

#### 📝 代码/配置示例

```python
def detect_stuck(state):
    if state.get("repeat_count", 0) >= 3:
        return "stuck_fallback"
    if state.get("elapsed_sec", 0) > 120:
        return "timeout_fallback"
    return "continue"

# 回滚到安全 checkpoint
history = app.get_state_history(config)
safe_cp = [c for c in history if c.values.get("phase") == "pre_execute"][0]
app.update_state(safe_cp.config, {"plan": revised_plan})
```

#### 🔁 追问怎么接

**「怎么线上发现？」**——LangSmith trace + 单 thread 耗时告警 + repeat_count 指标。举例 dashboard 看哪些节点最容易 stuck。

**「能否自动 rollback？」**——开发环境可以；生产要检查副作用是否已发生，有副作用只能 forward fix 不能简单回滚。
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

#### 🗣️ 先用大白话说

语义路由就是在图入口用 LLM 或 embedding 分类用户意图，然后条件边根据分类结果跳到不同分支。实现上单独建 router 节点，输出 state 里的 route_key，条件边查表跳转。为省 token 可用小模型或 embedding+阈值。路由不稳时加澄清节点 interrupt 问用户，或低置信走安全默认路径。蚂蚁面经里的 LangGraph 路由设计是同类题。

#### 📖 面试展开（详细版）

**是什么**：语义路由根据用户输入的语义（而非关键词规则）决定后续走哪条分支。可以用 LLM 分类、embedding 相似度匹配、或专用 fine-tuned 小模型。

**为什么需要**：客服、助手类产品里「查订单」和「投诉退款」需要完全不同的工具集和子流程，入口路由决定了整个图的执行路径。

**实现方式**：专用 router 节点读取 messages，调用分类器，输出 state.route_key（如 "order_query"、"complaint"、"general_qa"）。后续条件边读 route_key 映射到不同子图或工具集。复杂场景可以用子图（Subgraph）封装各分支。

**路由不准怎么办**：低置信度时走澄清节点（interrupt 问用户确认意图）；设置默认安全路径（general_qa）；收集 bad case 回流微调分类器；A/B 测试不同路由策略。

**和 intent node 区别**：intent node 是实现手段，语义路由是设计模式。intent node 输出意图标签，条件边/子图完成实际路由。

**踩坑**：路由节点用 GPT-4 太贵；分类类别过多导致准确率下降；没有低置信兜底导致错误路由连锁失败。

#### 💡 核心要点
- 专用 router 节点输出 next_route
- 可小模型分类降本
- 低置信走澄清或默认路径

#### 📝 代码/配置示例

```python
def router_node(state):
    intent = classify_intent(state["messages"][-1].content)  # LLM or embedding
    return {"route_key": intent.label, "route_confidence": intent.score}

def route_by_intent(state):
    if state.get("route_confidence", 0) < 0.6:
        return "clarify"
    return state["route_key"]

graph.add_node("router", router_node)
graph.add_conditional_edges(
    "router",
    route_by_intent,
    {"order_query": "order_subgraph", "complaint": "complaint_flow", "clarify": "clarify", "general_qa": "rag"},
)
```

#### 🔁 追问怎么接

**「路由不准怎么办？」**——低置信走澄清 interrupt；默认安全路径；bad case 回流评测集迭代分类器。

**「和 intent node 区别？」**——intent node 是产出 route_key 的节点；语义路由是用这个 key 做分支的整体设计模式。
</div>
</details>

</div>

---

<div class="chapter-nav">

<a class="chapter-nav-link" href="../">📑 总览</a>

<a class="chapter-nav-link" href="state">← 📦 LangGraph · 状态管理</a>

<a class="chapter-nav-link chapter-nav-next" href="hitl">⏸️ LangGraph · 持久化与 HITL →</a>

</div>
