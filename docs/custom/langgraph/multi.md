---
custom: true
partTitle: LangGraph 面经题库 · LangGraph · 多 Agent
partColor: #6366f1
---

<div class="part-hero custom-hero chapter-hero" style="--part-color: #6366f1">

# 👥 LangGraph · 多 Agent

<p class="part-desc">LangGraph 面经题库 · 第 5/8 章 · 9 题</p>
<span class="part-round custom-tag">面试问答</span>

</div>

<div class="chapter-nav">

<a class="chapter-nav-link" href="../">📑 总览</a>

<a class="chapter-nav-link" href="hitl">← ⏸️ LangGraph · 持久化与 HITL</a>

<a class="chapter-nav-link chapter-nav-next" href="production">🚀 LangGraph · 工程实践 →</a>

</div>

<div class="question-card ai100-card interview-card compact-card" id="044-multi-agent-design">

<h2 class="question-title"><span class="q-badge ai100-badge">Q44</span><span class="question-text">如何用 LangGraph 实现多 Agent 系统？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 标签：LangGraph, 多Agent · 考察点：多 Agent</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：常见模式：Supervisor 路由、层级子图、Handoff；共享 state 或隔离 state 取决于协作紧密度。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：所有 agent 共享工具吗？ · 和单 Agent 多 tool 区别？</div>
</div>

**优先级**：P1 · 3+ 篇

#### 🗣️ 先用大白话说

**一句话**：多 Agent 不是多个独立程序，而是一张图里多个「角色节点」——有人当调度员，有人当专家，大家通过共享 state 协作。

**打个比方**：像医院分诊台——导诊护士（Supervisor）看完症状决定挂哪个科，各科室医生（Worker Agent）看完病历写回共享病历本（State），导诊再决定下一棒或出院。

#### 📖 面试展开（详细版）

LangGraph 实现多 Agent 的核心思路是：把「不同角色的智能体」建模成图上的不同节点，而不是启动多个独立进程各自为政。最常见的是 Supervisor 模式——中央调度节点读当前 state，用 LLM 决定下一棒交给 researcher、coder 还是 writer，worker 执行完写回 state，再通过固定边回到 supervisor，直到任务完成或达到步数上限。

第二种是子图模式：每个 agent 自己是一张完整的 StateGraph，compile 之后作为父图的一个节点嵌入。父节点函数负责 state 字段映射——把父图的 query 传给子图，把子图的 retrieval_result 写回父图。这种方式适合大型系统模块化维护，RAG 流水线、代码审查环各自独立演进。

第三种是 Handoff（交接）模式：当前 agent 判断「这题该别人管」，写 state.handoff_to 和 context_summary，条件边路由到下一个 agent。这是去中心化调度，适合客服转技能组等场景。

和「单 Agent 多 tool」的本质区别：多 Agent 是不同 prompt、不同模型、不同权限的角色分工，每个 agent 有自己的「人格」和职责边界；单 Agent 多 tool 是一个大脑调不同 API，适合任务阶段差异不大、只是工具种类多的场景。字节面经爱追问「子 agent 能否共享工具」——标准答法是：工具 schema 可以共享只读定义，但调用权限按角色授权，state 命名空间尽量隔离。

工程上还要注意：并行 agent 写同一 state 字段必须配 reducer；supervisor 本身也可能成为瓶颈，需要 step_count 上限和「完成则 FINISH」的 prompt 约束；嵌套层级建议不超过 2-3 层，否则 debug 困难。

#### 💡 核心要点
- Supervisor 决定下一 worker
- 子图作节点模块化
- 通信靠 state channel 或 message

#### 📝 代码/配置示例

```python
from langgraph.graph import StateGraph, START, END
from typing import TypedDict, Literal

class TeamState(TypedDict):
    messages: list
    next: str

def supervisor(state: TeamState) -> dict:
    # LLM 根据 messages 决定下一专家
    return {"next": "researcher"}  # or "coder" / "FINISH"

def researcher(state: TeamState) -> dict:
    return {"messages": [{"role": "assistant", "content": "检索结果..."}]}

builder = StateGraph(TeamState)
builder.add_node("supervisor", supervisor)
builder.add_node("researcher", researcher)
builder.add_conditional_edges("supervisor", lambda s: s["next"], {
    "researcher": "researcher", "FINISH": END
})
builder.add_edge("researcher", "supervisor")
builder.add_edge(START, "supervisor")
app = builder.compile()
```

#### 🔁 追问怎么接

- **共享工具吗**：工具定义可共享 schema，调用权限按角色分——researcher 不能调 delete_database
- **和单 Agent 多 tool 区别**：多 Agent 是角色分工（不同 prompt/模型/权限），单 Agent 是多 API 调用
- **加分项**：提到子图模块化、handoff 去中心化、以及 state 命名空间隔离策略
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="045-supervisor-pattern">

<h2 class="question-title"><span class="q-badge ai100-badge">Q45</span><span class="question-text">Supervisor 模式怎么实现？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 标签：LangGraph, 多Agent · 考察点：Supervisor</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：中央 supervisor 节点用 LLM 选下一 worker，条件边路由，worker 完成后回 supervisor 形成星型拓扑。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：supervisor 本身会不会成为瓶颈？ · 死循环怎么防？</div>
</div>

**优先级**：P1 · 3+ 篇

#### 🗣️ 先用大白话说

**一句话**：Supervisor 就是「包工头」——中央节点看全局进度，决定下一棒派哪个专家，专家干完回来汇报，包工头再派下一棒，直到收工。

**打个比方**：像项目经理站白板中间，左边研究员、右边工程师、对面文案——PM 看完进度说「今天先做调研」，调研完回 PM 说「数据齐了」，PM 再说「工程师写代码」。

#### 📖 面试展开（详细版）

Supervisor 模式是 LangGraph 多 Agent 里最经典、面试最高频的拓扑。实现分四步：第一，定义 TeamState，至少包含 messages（对话历史）和 next（路由字段）；第二，写 supervisor 节点——读当前 state，用 LLM prompt 列出可选成员（researcher/coder/writer/FINISH），返回 next 字段；第三，用 add_conditional_edges 从 supervisor 按 next 值映射到各 worker 或 END；第四，每个 worker 执行完通过固定边回到 supervisor，形成星型闭环。

拓扑结构是「星型」：supervisor 居中做唯一调度决策点，所有 worker 是辐条，没有 worker 之间直接通信——信息都经 supervisor 汇总。好处是控制流清晰、易 debug；代价是 supervisor 本身可能成为瓶颈（所有决策都过它）和延迟来源（多一轮 LLM 调用）。

防死循环三道防线：prompt 里明确约束「任务完成必须返回 FINISH」；state 里维护 step_count，supervisor 每次 +1，超过阈值强制 FINISH；compile 时设 recursion_limit 作为框架级兜底。worker 节点应只改自己负责的 state 区域——researcher 写 retrieval_docs，coder 写 code_draft，避免互相覆盖。

LangGraph 生态有 langgraph-supervisor 预构建库可快速搭建，但面试手写路由逻辑更能体现理解——重点讲清 state 字段、条件边映射、以及 worker 回边的设计。

#### 💡 核心要点
- members 列表 + route 函数
- worker 只改自己负责的 state 区
- supervisor 看汇总结果决策

#### 📝 代码/配置示例

```python
def route_supervisor(state: TeamState) -> str:
    return state["next"]  # "researcher" | "coder" | "writer" | "FINISH"

builder.add_conditional_edges("supervisor", route_supervisor, {
    "researcher": "researcher",
    "coder": "coder",
    "writer": "writer",
    "FINISH": END,
})
for worker in ["researcher", "coder", "writer"]:
    builder.add_edge(worker, "supervisor")
```

#### 🔁 追问怎么接

- **supervisor 瓶颈**：承认存在，用 step_count 限制轮次、worker 自报告完成状态、复杂任务拆子图降低 supervisor 决策频率
- **死循环怎么防**：prompt 约束 FINISH + step_count 计数 + recursion_limit 框架兜底
- **加分项**：对比 langgraph-supervisor 预构建 vs 手写，说明手写更能控制路由逻辑
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="046-subgraph">

<h2 class="question-title"><span class="q-badge ai100-badge">Q46</span><span class="question-text">子图（Subgraph）怎么用？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 标签：LangGraph, 多Agent · 考察点：子图</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：子 StateGraph compile 后作为父图节点，可映射父子 state 字段，实现模块化和大工作流拆分。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：父子 state 怎么映射？ · 嵌套层级建议几层？</div>
</div>

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

**一句话**：子图就是「图里套图」——把一整段复杂流程（比如 RAG 检索链）单独做成一张小图，compile 后塞进大图当一个节点，像函数调用一样模块化。

**打个比方**：大工厂流水线里，「质检车间」本身也是一条独立流水线——原料进去、检测、分拣、出库，对外只暴露「进料口」和「出料口」。

#### 📖 面试展开（详细版）

子图（Subgraph）是 LangGraph 模块化大工作流的核心手段。做法是：先为子流程（如 RAG 检索链、代码审查环、审批流）单独建一张 StateGraph，定义自己的 State schema 和节点，compile 得到子图 app；然后在父图的某个节点函数里 invoke 这个子图，并做父子 state 字段映射。

映射是关键工程点：父图的 query 字段映射为子图的输入，子图执行完返回的结果映射回父图的 retrieval_result 或 review_output。映射函数写在父节点里，相当于 adapter 层——子图不需要知道父图全貌，父图也不需要了解子图内部细节。这样 RAG 组、Agent 组、审批组可以各自维护子图，联调时只对接输入输出契约。

子图的价值在三方面：模块化（独立测试、独立部署、独立版本）；复用（同一个 RAG 子图可被多个父图节点调用）；降低认知负担（debug 时先定位到哪个子图出问题，再进子图内部排查）。

编程导航面经场景设计题「内部提效系统 AI 改造」很适合套子图——大工作流按功能拆：意图识别子图、RAG 子图、工具调用子图、人工审批子图。嵌套层级建议不超过 2-3 层，超过后 trace 链路太长、state 传递损耗大、出问题难定位。每层子图必须有清晰的输入输出契约文档。

#### 💡 核心要点
- 子图独立测试部署
- 父图通过节点包装 invoke 子图
- 适合 RAG 子流程、审批子流程

#### 📝 代码/配置示例

```python
# 子图：RAG 流水线
rag_builder = StateGraph(RagState)
rag_builder.add_node("retrieve", retrieve_node)
rag_builder.add_node("grade", grade_node)
rag_app = rag_builder.compile()

# 父图：包装子图
def rag_wrapper(state: ParentState) -> dict:
    sub_result = rag_app.invoke({"query": state["user_query"]})
    return {"retrieval_result": sub_result["docs"]}

parent_builder.add_node("rag", rag_wrapper)
```

#### 🔁 追问怎么接

- **父子 state 映射**：父节点函数里做字段转换，子图只暴露最小输入输出
- **嵌套层级**：建议 2-3 层，超过后 trace 太长、debug 困难
- **加分项**：提到子图可独立单测、独立版本发布、团队分工维护
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="047-agent-handoff">

<h2 class="question-title"><span class="q-badge ai100-badge">Q47</span><span class="question-text">Agent Handoff（交接）怎么实现？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 多Agent · 考察点：Handoff</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：一个 agent 节点结束时写 state.handoff_to，条件边路由到下一 agent，并传递上下文摘要。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和 Supervisor 区别？ · 上下文怎么精简传递？</div>
</div>

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

**一句话**：Handoff 是 agent 自己决定「这题不归我管，转给同事」——写清楚交给谁、附带摘要，条件边自动路由过去。

**打个比方**：前台客服接到技术问题，不会等经理派活，直接说「我帮您转技术组」，同时写一张交接便签给技术员，不用把整通电话录音拷过去。

#### 📖 面试展开（详细版）

Agent Handoff（交接）是一种去中心化的多 Agent 协作模式。与 Supervisor 的中央调度不同，Handoff 让当前 agent 自己判断「这个问题该谁处理」，然后在 state 里写 handoff_to 字段（目标 agent 名）和 context_summary（结构化摘要），条件边根据 handoff_to 路由到下一个 agent 的入口节点。

实现步骤：在 State schema 里定义 handoff_to: str 和 context_summary: dict；当前 agent 节点在判断需要转交时，返回 {"handoff_to": "billing_agent", "context_summary": {"issue": "...", "user_id": "..."}}；add_conditional_edges 从当前 agent 按 handoff_to 映射到各 agent 或继续自身处理；接收方 agent 从 context_summary 起步，不必重读发送方的全量 messages。

上下文传递是 Handoff 的核心工程挑战。错误做法是把整个 messages 列表拷贝给下一个 agent——token 爆炸、噪音多、关键信息淹没。正确做法是发送方生成结构化 summary：问题类型、已尝试方案、关键实体、用户诉求。接收方 agent 的 prompt 以 summary 为起点，必要时再按需检索补充信息。

和 Supervisor 的选型：Handoff 适合一线 agent 最清楚该转谁的场景（客服转技能组、编码 agent 转测试 agent）；Supervisor 适合需要全局视角协调多个专家的复杂任务。OpenAI Swarm 框架的 handoff 思想与此同源。

#### 💡 核心要点
- 显式 handoff 字段
- 传递 summary 而非全量 messages
- OpenAI Swarm 同类思想

#### 📝 代码/配置示例

```python
class HandoffState(TypedDict):
    messages: list
    handoff_to: str
    context_summary: dict

def triage_agent(state: HandoffState) -> dict:
    # 判断需要转交
    return {
        "handoff_to": "billing_agent",
        "context_summary": {"issue": "退款", "order_id": "123"},
    }

builder.add_conditional_edges("triage", lambda s: s["handoff_to"], {
    "billing_agent": "billing_agent",
    "tech_agent": "tech_agent",
    "none": END,
})
```

#### 🔁 追问怎么接

- **和 Supervisor 区别**：Handoff 去中心化（agent 自决转交），Supervisor 中央调度（包工头派活）
- **上下文精简**：传 structured summary，不传全量 messages；控制 token 预算
- **加分项**：提到 OpenAI Swarm 同类思想、客服转技能组场景
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="048-shared-state-multi-agent">

<h2 class="question-title"><span class="q-badge ai100-badge">Q48</span><span class="question-text">多 Agent 之间共享 state 还是隔离？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 多Agent · 考察点：共享状态</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：紧协作共享 messages/任务板；松耦合用 handoff 摘要或独立 channel；绝不无脑共享全部工具权限。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么字节追问共享工具？ · 冲突怎么解？</div>
</div>

**优先级**：P1 · 2 篇面经

#### 🗣️ 先用大白话说

**一句话**：不是「全共享」或「全隔离」二选一——任务描述和最终结果大家看同一份，各 agent 的草稿和中间变量各自隔离，工具按角色授权。

**打个比方**：项目组共享一份需求文档和最终交付物，但每个工程师有自己的本地草稿文件夹，而且测试同学没有生产库删除权限。

#### 📖 面试展开（详细版）

这是字节 Agent 二面的经典原题：「能不能所有子 agent 共享工具和 state？」标准答法不是简单的「能」或「不能」，而是按协作紧密度分层设计。

State 层面：紧耦合协作（Supervisor 模式下的研究团队）应共享 messages 和 task_brief——所有人看同一份任务描述和对话历史，supervisor 才能做全局决策。但各 agent 应有私有 scratchpad channel——比如 coder_scratchpad、writer_scratchpad，用不同 prefix 隔离，避免 writer 覆盖 coder 的中间变量。松耦合协作（Handoff 模式）则只传 context_summary，不全量共享 messages。

工具层面：工具定义（schema、描述）可以共享只读——所有 agent 知道有哪些工具可用。但调用权限必须按角色授权——researcher 能调 search_web 但不能调 delete_database；coder 能调 execute_code 但不能调 send_email。这是安全边界，不是技术限制。

并发写冲突的解法和单图一样：并行 agent 写同一 state 字段必须配 reducer。messages 用 add_messages append-only；汇总结果用自定义 merge 函数。没 reducer 的后写覆盖前写，在多 agent 并行场景下同样会发生。

选型原则：协作越紧密，共享越多；协作越松散，隔离越多。面试时主动提「字节追问共享工具」的背景，说明考虑过权限和安全边界，是加分项。

#### 💡 核心要点
- 共享：统一任务描述、汇总结果
- 隔离：各 agent 私有 scratchpad
- 工具按角色授权

#### 📝 代码/配置示例

```python
class TeamState(TypedDict):
    messages: Annotated[list, add_messages]  # 共享
    task_brief: str                            # 共享
    coder_scratchpad: str                      # coder 私有
    writer_scratchpad: str                      # writer 私有

# 工具按角色授权
CODER_TOOLS = [execute_code, read_file]
RESEARCHER_TOOLS = [search_web, read_paper]
```

#### 🔁 追问怎么接

- **为什么字节追问共享工具**：考察安全边界意识——不是技术能不能，而是该不该
- **冲突怎么解**：并行写同一字段配 reducer；私有 scratchpad 隔离中间变量
- **加分项**：分层设计（共享 task_brief + 隔离 scratchpad + 工具按角色授权）
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="049-plan-and-execute">

<h2 class="question-title"><span class="q-badge ai100-badge">Q49</span><span class="question-text">Plan-and-Execute 模式怎么用 LangGraph 实现？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 标签：LangGraph, 多Agent · 考察点：规划执行</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：planner 节点生成步骤列表，executor 逐步执行，replanner 根据结果动态调整计划，条件边控制循环。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和 ReAct 区别？ · 计划存在哪？</div>
</div>

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

**一句话**：先让 AI 列一张任务清单（Plan），再逐步执行（Execute），执行中发现计划不对就改计划（Replan）——像项目经理先排期再干活，而不是边干边想。

**打个比方**：装修前先出施工图纸和工序表，工人按表施工，发现墙面有问题就回去改图纸，而不是每刷一面墙才决定下一面刷什么颜色。

#### 📖 面试展开（详细版）

Plan-and-Execute 是 LangGraph 中适合「步骤清晰的长任务」的编排模式，与 ReAct 的「每步现想」形成对比。实现需要三个核心节点：planner、executor、replanner。

planner 节点：读用户目标和当前 state，用 LLM 生成 structured plan——一个步骤列表，每步包含 description、tool、status（pending/done/failed）。写入 state.steps。prompt 要求输出结构化 JSON，便于后续解析。

executor 节点：从 state.steps 取第一个 status=pending 的步骤，调用对应工具执行，执行完更新该步 status 为 done 或 failed，结果写入 state.step_results。条件边判断：还有 pending 步骤则继续 executor；有 failed 步骤则路由到 replanner；全部 done 则 END。

replanner 节点：读 failed 步骤和已有结果，重新生成或调整 state.steps——可能跳过失败步骤、换工具、拆分子步骤。这是 Plan-and-Execute 相比固定 Workflow 的灵活之处。

和 ReAct 的核心区别：ReAct 每轮「思考→行动→观察→再思考」，没有全局计划，适合探索性任务；Plan-and-Execute 先全局规划再逐步执行，适合步骤可预期但可能中途调整的长任务（写报告、做调研、多步数据处理）。计划存在 state.steps 里，每步带 status 字段，checkpoint 可恢复中断的计划执行。

#### 💡 核心要点
- plan 存 state.steps
- executor 每次消费一步
- 失败时 replanner 改计划

#### 📝 代码/配置示例

```python
class PlanState(TypedDict):
    goal: str
    steps: list  # [{description, tool, status: "pending"|"done"|"failed"}]
    step_results: list

def planner(state: PlanState) -> dict:
    plan = llm.invoke(f"为以下目标制定步骤清单：{state['goal']}")
    return {"steps": parse_steps(plan)}

def executor(state: PlanState) -> dict:
    step = next(s for s in state["steps"] if s["status"] == "pending")
    result = run_tool(step["tool"])
    step["status"] = "done"
    return {"steps": state["steps"], "step_results": state["step_results"] + [result]}
```

#### 🔁 追问怎么接

- **和 ReAct 区别**：ReAct 每步现想（探索性），Plan-and-Execute 先规划再执行（步骤可预期）
- **计划存在哪**：state.steps，每步带 status 字段，checkpoint 可恢复
- **加分项**：提到 replanner 动态调整、失败步骤处理策略
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="050-reflection-self-correction">

<h2 class="question-title"><span class="q-badge ai100-badge">Q50</span><span class="question-text">Reflection / Self-Correction 反思循环怎么实现？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 标签：LangGraph, 多Agent · 考察点：反思</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：generate 节点产出 → critic 节点评审 → 条件边不满意则回 generate，满意则 END；类似 Reflexion 架构。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：反思会不会无限循环？ · critic 用什么模型？</div>
</div>

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

**一句话**：AI 写完先别交卷——让另一个「评审员」看一遍，不行就打回去重写，满意了才输出。LangGraph 用回边把这个「写→审→改」循环画成图。

**打个比方**：像论文导师改学生草稿——学生写一版，导师批注，学生按批注改，改到导师点头为止，最多改三轮。

#### 📖 面试展开（详细版）

Reflection / Self-Correction 是 LangGraph 中实现「生成→评审→改进」闭环的经典模式，对应 Reflexion 论文架构。核心是两个节点 + 一条回边：generator（draft_node）和 critic（reflect_node）。

generator 节点：读 state 里的任务描述和（如有）上一轮 critique，生成初稿或改进稿，写入 state.draft 或 state.answer。

critic 节点：读 generator 产出，用独立 prompt 或更强模型评审，输出结构化评判——pass/fail 或 1-10 分数 + 文字 critique，写入 state.critique 和 state.reflection_count（+1）。

条件边：critic 之后判断——pass 则 END 输出最终答案；fail 且 reflection_count < max_reflections 则回边到 generator（带上 critique 作为改进指引）；fail 且超过 max_reflections 则路由到 fallback 节点，避免无限循环。

max_reflections 是必配的防循环参数，通常设 2-3 轮。代码生成场景 critic 可以跑测试用例而非纯 LLM 评审——测试全过则 pass，有失败则把错误信息作为 critique 传回 generator，比 LLM 自评更可靠。

LangGraph 的价值在于：这种环被显式画在图上，每轮 critique 和 draft 都进 checkpoint，可追溯、可 debug、可单测每个节点的 IO 契约。

#### 💡 核心要点
- generator-critic 回边
- critic 输出 score 或 pass/fail
- 限制 max_reflections

#### 📝 代码/配置示例

```python
class ReflectState(TypedDict):
    task: str
    draft: str
    critique: str
    reflection_count: int

def draft_node(state: ReflectState) -> dict:
    prompt = state["task"]
    if state.get("critique"):
        prompt += f"
改进建议：{state['critique']}"
    return {"draft": llm.invoke(prompt)}

def reflect_node(state: ReflectState) -> dict:
    critique = critic_llm.invoke(f"评审：{state['draft']}")
    return {"critique": critique, "reflection_count": state["reflection_count"] + 1}

def should_continue(state: ReflectState) -> str:
    if "PASS" in state["critique"]: return "end"
    if state["reflection_count"] >= 3: return "fallback"
    return "revise"
```

#### 🔁 追问怎么接

- **无限循环**：max_reflections 限制 + 超过走 fallback
- **critic 用什么模型**：可用更强模型做评审；代码场景用测试用例比 LLM 自评更可靠
- **加分项**：提到 Reflexion 架构、checkpoint 可追溯每轮 critique
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="051-langgraph-routing-design">

<h2 class="question-title"><span class="q-badge ai100-badge">Q51</span><span class="question-text">LangGraph 路由是如何设计的？为什么要用它？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 标签：LangGraph, 多Agent · 考察点：路由设计</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：本质是状态机：全局 state + intent 节点 + 条件边到 RAG/工具/直接回答；用图是为显式分支和可测试路由。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：GraphRAG 为什么用？ · 评估怎么做？</div>
</div>

**优先级**：P0 · 2 篇面经

#### 🗣️ 先用大白话说

**一句话**：路由就是「用户问题进来，先识别意图，再决定走哪条路」——向量检索、知识图谱检索、还是直接回答。LangGraph 用条件边把这条路画成图，比 if-else 链清晰可测。

**打个比方**：像快递分拣中心——先扫描包裹看目的地（意图识别），再分到不同传送带（条件边到 RAG/工具/直答），而不是一个工人凭记忆决定往哪扔。

#### 📖 面试展开（详细版）

这是蚂蚁一面面经的原题，考察的是「路由设计的工程思维」而非单纯 API 调用。路由本质是状态机：定义 AgentState 包含 intent（意图）、docs（检索结果）、answer（最终回答）等字段；intent_node 用 LLM 或分类模型识别用户问题类型，写入 state.intent；add_conditional_edges 按 intent 值路由到不同下游——vector_retrieve（向量检索）、graph_retrieve（GraphRAG 检索）、direct_llm（直接回答）、tool_call（工具调用）等。

为什么用 LangGraph 而不是 if-else 链？三个原因：第一，科研/专业场景需要「检索→评判→不够好改写 query 再检索」的环，if-else 嵌套 try-except 难维护；第二，图编排让每条分支可独立单测——mock state 测 intent_node 输出、测条件边走向，bad case 能定位到哪个 node 而非「不知道哪段 if 出了问题」；第三，checkpoint 让路由决策可追溯——用户投诉「为什么没走 RAG」时可以 replay 看 intent_node 当时的输出。

GraphRAG 作为路由下游之一，适合专业领域关键词隐含关系强的场景（如科研问答、医疗知识），优点是关系推理比纯向量检索准，缺点是离线构图慢、更新成本高——和路由设计是配套的，不是替代关系。评估方面：路由准确率用离线黄金集测 intent 分类；端到端用证据溯源（回答是否有检索支撑）而非单纯 Recall@k。

设计习惯：route_key 字段命名清晰；条件边映射函数是纯函数（只读 state 返回节点名），便于单测；每个路由分支有独立的 fallback 策略。

#### 💡 核心要点
- 意图识别写 route_key
- 条件边映射多下游
- 比 if-else 链可观测

#### 📝 代码/配置示例

```python
class RouteState(TypedDict):
    query: str
    intent: str
    docs: list
    answer: str

def intent_node(state: RouteState) -> dict:
    intent = classify_intent(state["query"])  # "vector_rag"|"graph_rag"|"direct"
    return {"intent": intent}

builder.add_conditional_edges("intent", lambda s: s["intent"], {
    "vector_rag": "vector_retrieve",
    "graph_rag": "graph_retrieve",
    "direct": "direct_llm",
})
```

#### 🔁 追问怎么接

- **GraphRAG 为什么用**：专业领域关系推理强，适合科研/医疗；缺点是离线构图慢
- **评估怎么做**：路由准确率用黄金集测 intent；端到端用证据溯源而非 Recall@k
- **加分项**：对比 if-else 链的可维护性、每条分支可单测、bad case 可定位到 node
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="052-hierarchical-agents">

<h2 class="question-title"><span class="q-badge ai100-badge">Q52</span><span class="question-text">层级多 Agent 团队（Hierarchical）怎么设计？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 标签：LangGraph, 多Agent · 考察点：层级架构</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：顶层 supervisor 分大任务，中层组长管专业组，底层 worker 执行；用嵌套子图表达层级。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和扁平 Supervisor 取舍？ · 通信开销？</div>
</div>

**优先级**：P2 · 1 篇

#### 🗣️ 先用大白话说

**一句话**：层级 Agent 像公司组织架构——CEO 分大任务给部门经理，经理再分给员工，每层用子图表达，state 逐级汇总。

**打个比方**：不是一个大项目经理直接管 20 个工程师，而是 CEO → 部门总监 → 组长 → 执行者，每层只关注自己的层级，降低顶层决策复杂度。

#### 📖 面试展开（详细版）

层级多 Agent（Hierarchical）模式适合「任务自然分层」的大型协作场景，与扁平 Supervisor 形成对比。典型三层结构：顶层 supervisor（CEO/总控）拆战略任务给中层 supervisor（部门组长/专业组），中层再路由给底层 worker（研究员/工程师/执行者）。

LangGraph 实现用嵌套子图：顶层是一张 StateGraph，其中「部门节点」本身是 compile 后的子图 supervisor；子图内部再有自己的 worker 节点和条件边。父节点函数 invoke 子图时做 state 映射——顶层 task 分解为子任务传给中层，中层执行结果汇总回顶层 state。

state 逐级汇总：顶层 state 只保留 task_brief 和各部门汇总结果；中层 state 保留部门任务和 worker 产出；底层 worker 有自己的 scratchpad。避免所有信息都堆在顶层 state 导致 checkpoint 膨胀和 prompt 过长。

和扁平 Supervisor 的取舍：层级模式降低顶层 prompt 复杂度（CEO 不需要了解每个工程师的细节），适合企业流程仿真、大型调研项目等多层级决策场景。但增加延迟（多一层 LLM 调用）和 state 传递损耗（映射可能丢信息）。扁平 Supervisor 适合角色清晰的三人小团队（researcher/coder/writer），软件开发场景通常扁平就够。

嵌套建议不超过 2-3 层，每层子图有清晰 IO 契约。通信开销通过 context_summary 而非全量 messages 传递来控制。

#### 💡 核心要点
- 三层：总控→组长→执行者
- 每层是子图
- state 逐级汇总

#### 📝 代码/配置示例

```python
# 中层：部门子图
dept_builder = StateGraph(DeptState)
dept_builder.add_node("dept_supervisor", dept_supervisor)
dept_builder.add_node("worker", worker_node)
dept_app = dept_builder.compile()

# 顶层：CEO 调度部门
def dept_wrapper(state: TopState) -> dict:
    sub = dept_app.invoke({"task": state["sub_tasks"][state["current_dept"]]})
    return {"dept_results": state["dept_results"] + [sub["output"]]}
```

#### 🔁 追问怎么接

- **和扁平 Supervisor 取舍**：层级适合大组织仿真/多层级决策；扁平适合三人小团队
- **通信开销**：用 summary 传递、控制嵌套层数、每层子图 IO 契约清晰
- **加分项**：提到 state 逐级汇总、顶层 prompt 复杂度降低、嵌套不超过 2-3 层
</div>
</details>

</div>

---

<div class="chapter-nav">

<a class="chapter-nav-link" href="../">📑 总览</a>

<a class="chapter-nav-link" href="hitl">← ⏸️ LangGraph · 持久化与 HITL</a>

<a class="chapter-nav-link chapter-nav-next" href="production">🚀 LangGraph · 工程实践 →</a>

</div>
