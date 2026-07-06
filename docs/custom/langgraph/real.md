---
custom: true
partTitle: LangGraph 面经题库 · LangGraph · 真实面经
partColor: #6366f1
---

<div class="part-hero custom-hero chapter-hero" style="--part-color: #6366f1">

# 📋 LangGraph · 真实面经

<p class="part-desc">LangGraph 面经题库 · 第 7/8 章 · 12 题</p>
<span class="part-round custom-tag">面试问答</span>

</div>

<div class="chapter-nav">

<a class="chapter-nav-link" href="../">📑 总览</a>

<a class="chapter-nav-link" href="production">← 🚀 LangGraph · 工程实践</a>

<a class="chapter-nav-link chapter-nav-next" href="advanced">🔬 LangGraph · 进阶扩展 →</a>

</div>

<div class="question-card ai100-card interview-card compact-card" id="065-why-not-off-the-shelf">

<h2 class="question-title"><span class="q-badge ai100-badge">Q65</span><span class="question-text">为什么不直接用 Cursor Composer 或公司现成的 Agent 产品？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 面经 · 考察点：自研边界</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：自研是为了数据路径可控、工具权限对齐内部系统、评测指标一致、发版节奏自主；改造现成方案讲清 adapter 四层而非空喊二次开发。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：fork 现成方案风险？ · 什么时候应该用现成的？</div>
</div>

**优先级**：P1 · 1 篇面经

#### 🗣️ 先用大白话说

**一句话**：不是非要证明自己比 Cursor 强，而是核心链路要「数据、权限、评测、发版」四条线都在自己手里。

**打个比方**：Composer 像租精装公寓——拎包入住快，但装修不能动、监控看不到管道；自研 LangGraph 像自建房——前期慢，但水电走向、门禁系统、消防验收全在自己图纸里。

#### 📖 面试展开（详细版）

这道题表面在问「为什么不直接用现成产品」，实际考的是**技术主权边界**和**改造方案的可落地性**。

先说自研/半自研的四个硬理由：① **数据路径可控**——用户 query、检索文档、工具返回结果是否出境、是否落日志，合规团队要审计；② **工具权限对齐 IAM**——内部 ERP/工单/数据库的 ACL 不能指望外部 Agent 产品替你对接；③ **评测指标一致**——业务定义的「回答正确」可能包含引用格式、审批通过率，现成产品的通用指标对不上；④ **发版节奏自主**——外部产品升级可能改 tool schema 或 prompt 策略，你的回归集还没跑完就被迫跟进。

如果基于现成方案改造，必须讲清 **adapter 四层**，否则「二次开发」是空话：协议层（tool schema、context window 格式对齐）、资产层（prompt/skill/评测集迁移）、运行层（灰度、熔断、限流、LangSmith 观测）、组织层（谁维护、版本事故怎么归因、oncall 手册）。

最后补一句选型原则：**非核心、低合规、要快** → 用 Composer/企业 Agent；**核心流程、敏感数据、强审计** → LangGraph 自研。面试官想听的是你知道 trade-off，不是站队。

#### 💡 核心要点
- 协议层/资产层/运行层/组织层
- 别 fork 到死，先 adapter
- 主权和合规是核心

#### 📝 代码/配置示例

```python
# adapter 四层示意：不改 fork，先包一层
class InternalAgentAdapter:
    def __init__(self, vendor_client, iam, metrics):
        self.vendor = vendor_client
        self.iam = iam          # 协议层：工具权限
        self.metrics = metrics  # 运行层：观测

    async def invoke(self, user_id, query):
        tools = self.iam.allowed_tools(user_id)  # 资产层：skill 子集
        result = await self.vendor.run(query, tools=tools)
        self.metrics.record(result)              # 评测指标对齐
        return result
```

#### 🔁 追问怎么接

- **「fork 现成方案有什么风险？」** → 上游 merge 成本、安全补丁滞后、团队只有维护权没有架构权；正确姿势是先 adapter 再接，验证 ROI 后再考虑深度 fork。
- **「什么时候应该用现成的？」** → 内部提效试点、非核心路径、合规要求低、团队缺 Agent 工程经验时；给出时间线：先用现成跑通 MVP，痛点明确后再迁移 LangGraph。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="066-skill-ization">

<h2 class="question-title"><span class="q-badge ai100-badge">Q66</span><span class="question-text">工具链能不能 Skill 化？项目有没有演进价值？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 面经 · 考察点：Skill 化</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Skill 化是把高频任务打法变成可版本、可组合、可测的资产，不是 markdown 换名；演进价值用接入成本、bad case 闭环、新人上手成本量化。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和 MCP 关系？ · 字节 skill 分层怎么答？</div>
</div>

**优先级**：P2 · 1 篇面经

#### 🗣️ 先用大白话说

**一句话**：Skill 化不是把 prompt 存成 markdown 文件，而是把「一类任务的完整打法」变成可版本、可组合、可回归测试的工程资产。

**打个比方**：没有 Skill 化时，每个需求都是厨师临场发挥；Skill 化后，高频菜有标准菜谱（流程）、固定厨具（工具子集）、品控表（回归用例），新厨师照做也能出稳定品质。

#### 📖 面试展开（详细版）

Skill 化的核心是**把 tacit knowledge（隐性经验）变成 explicit asset（显式资产）**，在 LangGraph 语境下具体落地为三层：

① **入口收敛**——把几十个零散 tool 收敛成 3-5 个稳定入口（如 `search_docs`、`submit_ticket`、`generate_report`），LLM 只在稳定接口上选择，减少 hallucinate tool name 的概率。② **流程边界写清楚**——每个 skill 对应图里的一条子路径或子图，明确输入 state 字段、输出字段、失败 fallback，配 10-20 条回归用例。③ **版本化与组合**——skill v1.2 改了 retrieve 策略不影响 generate skill，可以 A/B。

演进价值必须**量化**，否则是空话：新数据源接入改几处代码？（理想：只改 adapter 节点）线上 bad case 有没有自动入库 + 每周复盘？新人接手要不要读 5000 行 prompt？（理想：读 skill 文档 + 跑回归集即可）。

和 MCP 的关系：MCP 是**工具接入协议**（怎么连外部服务），Skill 是**任务编排资产**（怎么组合工具完成一类任务），两者正交——MCP 提供 tool，Skill 定义图路径。字节 skill 分层可接：静态库 + 动态匹配 + 沉淀机制，LangGraph 里用路由节点选 skill 子集。

#### 💡 核心要点
- 入口收敛稳定工具
- 流程边界+回归用例
- 新数据源改几处可量化

#### 📝 代码/配置示例

```python
# Skill 化：路由节点选 tool 子集 + 子图
SKILL_REGISTRY = {
    "research": {"tools": [search_paper, fetch_citation], "subgraph": research_graph},
    "ticket":   {"tools": [create_ticket, query_status],   "subgraph": ticket_graph},
}

def route_skill(state):
    skill = classify_intent(state["query"])
    return skill  # 条件边 → 对应子图入口
```

#### 🔁 追问怎么接

- **「和 MCP 关系？」** → MCP 管工具怎么连（协议层），Skill 管任务怎么打（编排层）；一个 MCP server 可以被多个 skill 复用。
- **「字节 skill 分层怎么答？」** → 静态 skill 库（版本化 prompt+tool 子集）+ 动态匹配（路由节点按 intent 选 skill）+ 沉淀机制（bad case 触发 skill 迭代）；LangGraph 里每个 skill 可以是 compile 好的子图。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="067-vector-db-system-design">

<h2 class="question-title"><span class="q-badge ai100-badge">Q67</span><span class="question-text">系统设计：数据怎么落到向量数据库？（LangGraph 方案）</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 标签：LangGraph, 面经 · 考察点：系统设计</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：ETL 节点→embedding 节点→写入节点串成子图，条件边处理格式分支，checkpoint 支持断点重试，Guardrails 校验入库数据。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：多路召回怎么接？ · 增量更新？</div>
</div>

**优先级**：P0 · 2 篇面经

#### 🗣️ 先用大白话说

**一句话**：把「数据落向量库」建模成一条 ETL 子图，每个步骤是一个 node，失败从 checkpoint 断点续跑，不重复已成功批次。

**打个比方**：像工厂流水线——原料入口分三条线（PDF/网页/结构化），每条线经过切分→向量化→装箱入库，任何一站停电（失败）从上一站成品接着干，不用从头再来。

#### 📖 面试展开（详细版）

这是二面系统设计题，考察**能否把 ETL 流程用图编排讲清楚**，而不是背 Qdrant API。

**State 设计**：`source_type`、`raw_content`、`chunks[]`、`embeddings[]`、`batch_id`、`progress`（已处理条数）、`errors[]`。

**节点拓扑**：
1. **router 节点**——识别 PDF/网页/CSV，条件边分流到不同 parse 节点
2. **parse 节点**——输出统一格式的 text + metadata
3. **chunk 节点**——写 `chunks` 列表，记录 chunk_id 和 offset
4. **embed 节点**——批量调 embedding API，可用 Send API 并行 fan-out
5. **upsert 节点**——写 Qdrant，更新 `progress`
6. **guardrails 节点**——校验 PII、文件大小、格式，不通过走 reject 分支

**断点重试**：compile 时绑 PostgresSaver；embed 完成但 upsert 失败时，checkpoint 里已有 embeddings，resume 直接从 upsert 续，不重复调 embedding（省钱省时间）。

**与 RAG 解耦**：入库子图和问答子图分开——入库图产出索引，问答图走 retrieve→grade→generate，共享 vector store 但不共享 state。

**增量更新**：state 里记 `doc_version`，upsert 用 doc_id 做幂等键，新版本走 update 节点而非全量重跑。

#### 💡 核心要点
- parse → chunk → embed → upsert 各为 node
- 失败重试不回滚已成功批次
- 元数据过滤与多租户

#### 📝 代码/配置示例

```python
class IngestState(TypedDict):
    source_type: str
    chunks: Annotated[list, operator.add]
    batch_id: str
    progress: int

def route_source(state):
    return {"pdf": "parse_pdf", "web": "parse_web"}[state["source_type"]]

# embed 完 upsert 失败 → checkpoint resume 从 upsert 续
graph = builder.compile(checkpointer=PostgresSaver(...))
```

#### 🔁 追问怎么接

- **「多路召回怎么接？」** → 入库完成后，问答子图 retrieve 节点并行查 vector + keyword + graph，Send API fan-out，reducer 合并多路结果到 `docs[]`。
- **「增量更新？」** → upsert 节点用 doc_id 幂等键；state 记 version，变更文档只 re-embed 变更 chunk，checkpoint 支持单文档断点续跑。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="068-internal-efficiency-ai">

<h2 class="question-title"><span class="q-badge ai100-badge">Q68</span><span class="question-text">系统设计：内部提效系统怎么做 AI 改造？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 标签：LangGraph, 面经 · 考察点：系统设计</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：拆功能点→每点 AI 实现方式→需求文档/方案生成 Agent→套 LangGraph 做审批流和工具编排。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：不熟悉业务系统怎么办？ · 如何分期落地？</div>
</div>

**优先级**：P1 · 1 篇面经

#### 🗣️ 先用大白话说

**一句话**：不熟悉具体系统没关系——先拆功能点，每个点说 AI 怎么辅助，再用 LangGraph 套审批流和工具编排，面试官看的是思路不是业务细节。

**打个比方**：像给陌生公司做 IT 咨询——不需要用过他们的 ERP，但要能问清「谁填什么表单、谁审批、数据从哪来」，然后画一张改造蓝图。

#### 📖 面试展开（详细版）

编程导航二面经典场景题，考察**系统设计思路**而非特定业务知识。

**第一步：拆功能点**（现场问清或合理假设）——例如内部项目管理系统：① 需求文档撰写 ② 会议纪要结构化 ③ 工单分类路由 ④ 进度报告生成 ⑤ 跨部门审批。

**第二步：每点说 AI 实现方式**——① LLM 生成 PRD 草稿 ② ASR+LLM 提取 action items ③ 意图分类模型路由工单 ④ RAG 拉历史数据生成周报 ⑤ 方案类操作需 HITL。

**第三步：LangGraph 承载**——State 字段：`task_type`、`draft`、`approval_status`、`tool_results`。拓扑：intent 分类 → 条件边到不同子图。写方案类：draft 节点 → interrupt 等审批 → publish 节点调内部 API。查数据类：tool 节点调 REST API → summarize 节点。

**分期落地**（体现工程成熟度）：Phase 1 单点高频场景用 Workflow 快速验证；Phase 2 需要审批/回溯/多分支上 LangGraph；Phase 3 建评测闭环 + bad case 回流。

**不熟悉系统的模板答法**：「我会先问三个问题——核心用户是谁、最高频的三个操作是什么、有没有审批节点——然后按上面的框架套，具体 tool schema 接入时再对齐。」

#### 💡 核心要点
- 先拆功能点再谈模型
- HITL 审批写方案类操作
- 模板化应对不熟悉系统

#### 📝 代码/配置示例

```python
class TaskState(TypedDict):
    task_type: str
    draft: str
    approval_status: str  # pending | approved | rejected

builder.add_node("draft", generate_draft)
builder.add_node("publish", publish_to_internal_api)
builder.add_edge("draft", "publish")  # interrupt_before=["publish"]

graph = builder.compile(
    checkpointer=PostgresSaver(...),
    interrupt_before=["publish"],
)
```

#### 🔁 追问怎么接

- **「不熟悉业务系统怎么办？」** → 主动问三个问题（用户/高频操作/审批节点），用通用模板套；强调 tool 层 adapter 隔离业务细节，图编排层不依赖具体系统。
- **「如何分期落地？」** → Phase 1 Workflow MVP 验证价值 → Phase 2 LangGraph 加 HITL/回溯 → Phase 3 评测闭环；每阶段有明确退出指标（成功率/人工介入率）。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="069-eval-closed-loop">

<h2 class="question-title"><span class="q-badge ai100-badge">Q69</span><span class="question-text">Agent 评测闭环怎么搭建？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 标签：LangGraph, 面经 · 考察点：评测</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：离线集分层（简单/长尾/对抗）+ 在线成功率/延迟/token/工具错误率 + 人工抽检 + bad case 自动入库 + 节点级归因。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：准确率还能怎么优化？ · 泄漏到训练怎么防？</div>
</div>

**优先级**：P1 · 2 篇面经

#### 🗣️ 先用大白话说

**一句话**：评测不是考试分数，而是「离线回归 + 在线监控 + bad case 回流」的双循环，LangGraph 的优势是失败能定位到具体 node。

**打个比方**：像医院体检——不只看「人还活着吗」（最终答案对不对），还要查「哪个器官出问题」（哪个 node 跌分），然后针对性治疗（修 prompt/换模型/改 chunk）。

#### 📖 面试展开（详细版）

百度面经高频题，考察**有没有线上思维**，不是背评测指标名词。

**离线循环**：
- 黄金集三层：简单（冒烟）、长尾（边界 case）、对抗（prompt 注入/空检索）
- 标注规范：什么算「正确」——答案内容 + 引用格式 + 是否调了正确 tool
- 防泄漏：评测集不进 fine-tune 训练集，用 hold-out set
- **节点级回归**：单独跑 intent 分类准确率、retrieve recall@k、grade 通过率——LangGraph trace 天然支持

**在线循环**：
- 核心指标：任务成功率、P99 延迟、token 消耗、tool 错误率、人工抽检比例
- bad case 自动入库：从 LangSmith trace 提取失败 thread，标注失败 node（如 grade 未通过、tool timeout）
- 周节奏：bad case Review → 优先修高频失败 node → 回归集验证

**优化不只调 prompt**——四层：数据侧（难例挖掘、合成对抗样本）、模型侧（换强模型/蒸馏）、系统侧（结构化输出 + 后处理校验）、RAG 侧（chunk 策略 + rerank）。

LangGraph 的核心优势：**失败可定位到具体 node**，评测从「答案对不对」升级到「哪一步出了问题」。

#### 💡 核心要点
- 离线在线双循环
- 按 node 归因失败
- 难例挖掘和合成

#### 📝 代码/配置示例

```python
# 节点级评测：断言轨迹包含关键 node
def eval_trace(run):
    nodes = [s["node"] for s in run.steps]
    assert "grade" in nodes, "检索结果未做质量评估"
    assert run.final_answer.citations, "缺少引用"

# bad case 自动入库
if run.status == "failed":
    db.insert({"thread_id": run.thread_id, "failed_node": run.last_node})
```

#### 🔁 追问怎么接

- **「准确率还能怎么优化？」** → 四层：数据（难例挖掘/合成）、模型（换强/蒸馏）、系统（结构化输出校验）、RAG（chunk/rerank）；强调先定位失败 node 再优化，不是盲目调 prompt。
- **「泄漏到训练怎么防？」** → 评测集与训练集物理隔离；hold-out set 定期轮换；fine-tune 前检查 doc hash 去重；线上 bad case 入库时标记为 eval-only。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="070-a2a-protocol">

<h2 class="question-title"><span class="q-badge ai100-badge">Q70</span><span class="question-text">A2A 多 Agent 协议了解吗？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 面经 · 考察点：A2A</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：不必装做过分布式 Agent；降维成子图/节点代表远程 agent，外层管信封格式、超时、错误隔离。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和 MCP 区别？ · 跨进程怎么通信？</div>
</div>

**优先级**：P2 · 1 篇面经

#### 🗣️ 先用大白话说

**一句话**：A2A 是 Agent 之间协作的「通信协议」，面试不必装专家——降维成「子图代表远程 Agent，外层管信封、超时、错误隔离」即可。

**打个比方**：A2A 像公司跨部门协作的公文格式——不管里面什么内容，信封上要写「发给谁、什么事、什么时候要回复」，收不到回复有超时处理，一个部门挂了不影响其他部门。

#### 📖 面试展开（详细版）

百度面经 P2 题，考察**知识边界**——知道概念、能降维到 LangGraph 工程实践即可，不必背 RFC。

**A2A（Agent-to-Agent）是什么**：Google 等推的多 Agent 协作协议，定义 agent 之间怎么发现、怎么发任务、怎么返回结果。核心要素：Agent Card（能力描述）、Task（任务信封）、Message（消息格式）、Artifact（产出物）。

**降维答法**（面试推荐）：
- 本地编排：LangGraph 子图就是一个「agent」，父图通过 invoke 子图与之协作
- 跨进程：专用节点封装 HTTP/gRPC 调用远程 agent，外层管 correlation_id、timeout、retry
- 父图 state 只存**摘要结果**，不存远程 agent 的完整中间状态

**和 MCP 的区别**：
- MCP = **工具接入协议**（LLM 怎么调 calculator、database）
- A2A = **Agent 协作协议**（Agent A 怎么委托任务给 Agent B）
- 两者正交：MCP 提供 tool，A2A 提供 agent 间委托

**工程要点**：超时设置（远程 agent 不能无限等）、错误隔离（远程失败不崩整个父图，写 error 进 state 走 fallback）、幂等（correlation_id 防重复委托）。

#### 💡 核心要点
- 协议层=消息格式+超时
- LangGraph 子图可封装远程 agent
- 失败隔离不重试整个父图

#### 📝 代码/配置示例

```python
# 远程 agent 封装为 LangGraph 节点
async def remote_researcher_node(state, config):
    resp = await httpx.post(
        "https://research-agent.internal/run",
        json={"task": state["query"], "correlation_id": config["run_id"]},
        timeout=30.0,
    )
    if resp.status_code != 200:
        return {"research_error": resp.text, "research_summary": None}
    return {"research_summary": resp.json()["summary"]}
```

#### 🔁 追问怎么接

- **「和 MCP 区别？」** → MCP 是 tool 层协议（怎么连外部服务），A2A 是 agent 层协议（怎么委托任务）；一个 MCP server 可以被 agent 内部使用，A2A 是 agent 之间的协作。
- **「跨进程怎么通信？」** → HTTP/gRPC 包装远程 agent 为 LangGraph 节点或 tool；外层管 correlation_id、timeout、错误返回；父图 state 只存摘要，完整 trace 在 LangSmith 关联。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="071-project-storytelling">

<h2 class="question-title"><span class="q-badge ai100-badge">Q71</span><span class="question-text">Agent 项目面试怎么讲？（LangGraph 表述顺序）</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 标签：LangGraph, 面经 · 考察点：项目表达</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：先业务因果链（输入输出、失败落哪），再提 LangGraph 承载；禁止开场三十秒报技术栈朗诵。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：用户一句话进来第一个写日志在哪？ · 为什么不用 XX 框架？</div>
</div>

**优先级**：P0 · 3+ 篇面经

#### 🗣️ 先用大白话说

**一句话**：项目介绍先讲「用户一句话进来系统怎么运转」，最后才提 LangGraph——框架是承载工具，不是开场白。

**打个比方**：介绍一家餐厅，先说「客人点菜→后厨做什么→怎么上菜→出了问题怎么办」，而不是开场报「我们用了德国烤箱、日本刀、法国调料」。

#### 📖 面试展开（详细版）

阿里/百度面经 P0 题，考察**项目表达逻辑**，比技术细节更重要。

**错误开场**（30 秒报技术栈）：
「我们的项目用了 LangGraph + LangChain + Qdrant + GPT-4o...」
→ 面试官追问「用户一句话进来，第一个写日志的代码在哪？」→ 卡壳。

**正确顺序**（因果链 → 取舍 → 框架）：
1. **业务问题**：解决什么痛点？（如：科研人员问论文，需要引用溯源）
2. **输入输出边界**：用户输入什么？系统输出什么？（query → 带引用的答案）
3. **因果链**：谁把自然语言变可执行步骤？（intent 节点）→ 谁检索？（retrieve 节点）→ 谁生成？（generate 节点）→ 谁校验？（cite_check 节点）
4. **失败落哪**：检索为空走 rewrite；引用不对回 generate；超限走 fallback
5. **为什么 LangGraph**：因为有环（grade 不过回 rewrite）、要 checkpoint（长任务断点续跑）
6. **真实难点 + data point**：checkpoint 从 50MB 降到 2MB（外置历史）；路由准确率从 78% 提到 91%（加 few-shot）

**准备清单**：每个节点一个 data point、一个失败 case、一个优化前后对比。让面试官听到**取舍**，不是背选型。

#### 💡 核心要点
- 问题→边界→因果链→取舍→框架
- LangGraph 是承载不是开场
- 准备真实难点和 data point

#### 🔁 追问怎么接

- **「用户一句话进来第一个写日志在哪？」** → 答 API 网关/中间件层（request_id 生成），不是 LangGraph 节点里；体现你理解全链路，不只会图编排。
- **「为什么不用 XX 框架？」** → 先承认 XX 的优点，再说你的场景有环/要 HITL/要 checkpoint 所以选 LangGraph；避免贬低其他框架。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="072-langgraph-project-setup">

<h2 class="question-title"><span class="q-badge ai100-badge">Q72</span><span class="question-text">说说你们 AI Agent 项目 LangGraph 怎么搭的？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐⭐ · 标签：LangGraph, 面经 · 考察点：项目架构</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：定义 state schema → 纯函数节点 → 条件边编排 → compile 注入 checkpointer → FastAPI 暴露 stream → LangSmith 监控。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：最强节点是哪个？ · 重构过什么？</div>
</div>

**优先级**：P0 · 2 篇面经

#### 🗣️ 先用大白话说

**一句话**：搭 LangGraph 项目有固定五步法——定义 State → 写纯函数节点 → 条件边连接 → compile 绑 checkpointer → API 层暴露 stream。

**打个比方**：像搭乐高——先定底板规格（State schema），再拼每个模块（node），用卡扣决定连接方式（条件边），最后装电池（checkpointer）和遥控器（FastAPI stream）。

#### 📖 面试展开（详细版）

编程导航一面/二面 P0 原题，**五步法**必须能脱稿背诵，再结合自己项目替换节点名。

**Step 1：定义 AgentState**
```
class AgentState(TypedDict):
    messages: Annotated[list, add_messages]  # append-only
    intent: str                              # 覆盖写
    docs: list                               # 覆盖写
    retry_count: int                         # 覆盖写
```
每个字段注明 reducer 策略，列表用 `add_messages`，标量直接覆盖。

**Step 2：纯函数节点**——每个能力一个 node：`retrieve`、`grade`、`rewrite`、`generate`、`cite_check`。节点只做一件事，输入 state 返回 partial update，副作用放 tool 节点。

**Step 3：条件边编排**——`grade` 不过 → `rewrite` → 回 `retrieve`；`cite_check` 不过 → 回 `generate`；超过 retry 上限 → `fallback`。

**Step 4：compile 注入**——`PostgresSaver` 做 checkpoint；`interrupt_before=["publish"]` 做 HITL 审批。

**Step 5：API 层**——FastAPI `astream` 暴露 SSE；LangSmith 看节点级 trace 和 token 消耗。

**替换点**：说成自己的科研问答/简历项目，每个节点准备一个 data point（grade 阈值 0.7、rewrite 最多 3 次、P99 延迟 2.3s）。

#### 💡 核心要点
- 五步法可背诵
- 结合自己项目替换节点名
- 强调可测试和可恢复

#### 📝 代码/配置示例

```python
builder = StateGraph(AgentState)
builder.add_node("retrieve", retrieve_node)
builder.add_node("grade", grade_node)
builder.add_conditional_edges("grade", route_after_grade)
builder.set_entry_point("retrieve")

graph = builder.compile(
    checkpointer=PostgresSaver.from_conn_string(DB_URL),
    interrupt_before=["publish"],
)

# FastAPI 暴露
@app.post("/chat")
async def chat(req: ChatRequest):
    async for event in graph.astream(input, config={"thread_id": req.session_id}):
        yield sse_event(event)
```

#### 🔁 追问怎么接

- **「最强节点是哪个？」** → 选有技术深度的节点（如 grade 或 cite_check），讲设计理由 + 评测指标 + 优化过程；避免说「都重要」。
- **「重构过什么？」** → 准备一个真实重构 story：如「最初 messages 没配 reducer 被覆盖，后来改成 add_messages + 外置历史」；体现踩坑和迭代。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="073-prompt-combination">

<h2 class="question-title"><span class="q-badge ai100-badge">Q73</span><span class="question-text">prompt 结合是怎么做的？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 标签：LangGraph, 面经 · 考察点：Prompt</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：静态 system prompt 管角色边界，动态 prompt 节点按 state 注入检索结果/工具输出/用户上下文，分节点拆分而非一个巨型 prompt。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和 LangGraph 节点关系？ · 怎么防 prompt 漂移？</div>
</div>

**优先级**：P1 · 1 篇面经

#### 🗣️ 先用大白话说

**一句话**：LangGraph 里 prompt 不是一个大模板，而是每个节点有自己的 prompt——静态 system 段管角色，动态段从 state 注入当前步需要的上下文。

**打个比方**：像做菜每道工序有自己的「小纸条」——切配看食材清单，炒菜看火候说明，摆盘看出品标准——而不是一张 5000 字的总菜谱从头看到尾。

#### 📖 面试展开（详细版）

阿里淘天一面原题，考察**prompt 工程在图编排里的落地方式**。

**分机节点策略**：
- **静态 system prompt**：角色定义、输出格式约束、安全边界——所有节点共享，Git 版本化管理
- **动态 prompt 段**：从 state 字段填充——`generate` 节点的 template 填 `state["docs"]`；`tool_summary` 节点填 `state["tool_results"]`

**为什么不用巨型 prompt**：
① 省 token——每个 node 只拿当前步需要的上下文，不是 5000 字全塞
② 利 debug——retrieve prompt 改了不影响 generate，可以单独 A/B
③ 利评测——每个节点的 prompt 可以单独回归

**和 LangGraph 节点的关系**：**节点即 prompt 边界**——换节点就换 prompt 策略。retrieve 节点的 prompt 管「怎么写 query」；generate 节点的 prompt 管「怎么基于 docs 回答」；cite_check 节点的 prompt 管「怎么验证引用」。比 Chain 里一个大 PromptTemplate 清晰得多。

**防 prompt 漂移**：Git 版本化 + LangSmith prompt hub；改 prompt 必须跑回归集；线上 A/B 对比新旧 prompt 的成功率和 token 消耗。

#### 💡 核心要点
- 每节点独立 prompt 模板
- state 字段填充动态段
- 版本化+A/B

#### 📝 代码/配置示例

```python
# 每个节点独立 prompt 模板
GENERATE_PROMPT = ChatPromptTemplate.from_messages([
    ("system", SYSTEM_PROMPT),  # 静态，Git 版本化
    ("human", "参考文档：\n{docs}\n\n用户问题：{query}"),  # 动态，从 state 填充
])

def generate_node(state):
    prompt = GENERATE_PROMPT.format(docs=state["docs"], query=state["query"])
    return {"messages": [llm.invoke(prompt)]}
```

#### 🔁 追问怎么接

- **「和 LangGraph 节点关系？」** → 节点即 prompt 边界；每个 node 有自己的 prompt template，从 state 取当前步需要的字段；换节点 = 换 prompt 策略。
- **「怎么防 prompt 漂移？」** → Git 版本化 + 改 prompt 必跑回归集 + LangSmith A/B 对比；禁止线上直接改 prompt 不记录版本。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="074-react-pattern">

<h2 class="question-title"><span class="q-badge ai100-badge">Q74</span><span class="question-text">如何用 LangGraph 实现 ReAct 模式？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 标签：LangGraph, 面经 · 考察点：ReAct</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：agent 节点调 LLM → 条件边看 tool_calls → tool 节点执行 → 回边 agent，直到无 tool_calls 走 END。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和 create_react_agent 区别？ · 为什么要手写图？</div>
</div>

**优先级**：P0 · 3+ 篇

#### 🗣️ 先用大白话说

**一句话**：ReAct 就是「想→做→看→再想」的环——agent 节点调 LLM，有 tool_calls 就去 tool 节点执行，执行完回 agent，直到 LLM 不再调工具。

**打个比方**：像侦探破案——推理（Thought）→ 去现场调查（Action）→ 看调查结果（Observation）→ 再推理，直到破案（END）。

#### 📖 面试展开（详细版）

ReAct 是 LangGraph 最经典的环，**一面 P0 必考**，必须能在 30 秒内画完拓扑。

**三环结构**：
1. **agent_node**：LLM 绑定 tools，输入 messages，输出 AIMessage（可能含 tool_calls）
2. **should_continue**（条件边）：检查最后一条 message 有没有 tool_calls → 有则去 tool_node，没有则 END
3. **tool_node**：执行 tool_calls，返回 ToolMessage，add_edge 回 agent_node

**State**：`messages: Annotated[list, add_messages]`——agent 和 tool 节点都往 messages 追加。

**手写图 vs create_react_agent**：
- `create_react_agent` 是开箱即用，底层仍是图
- **手写图的优势**：可以在环里插节点——tool 后加 sanitize（过滤敏感信息）、agent 前加 compress（压缩历史）、失败走 fallback 节点
- 面试讲手写证明你**理解环怎么运转**，不是只会调 API

**防死循环**：`recursion_limit=25`；条件边里加 iteration 计数器；业务层限制 tool 调用次数。

**面试准备**：白板画三张图——state 字段、三个节点、条件边 + 回边，30 秒完成。

#### 💡 核心要点
- 经典三环
- 可插 grade/fallback 节点
- 手写图为精细控制

#### 📝 代码/配置示例

```python
def agent_node(state):
    response = llm.bind_tools(tools).invoke(state["messages"])
    return {"messages": [response]}

def should_continue(state):
    last = state["messages"][-1]
    return "tools" if last.tool_calls else END

builder.add_node("agent", agent_node)
builder.add_node("tools", ToolNode(tools))
builder.add_conditional_edges("agent", should_continue)
builder.add_edge("tools", "agent")  # 回边形成环
```

#### 🔁 追问怎么接

- **「和 create_react_agent 区别？」** → 功能等价，但手写图能插 sanitize/compress/fallback 节点，精细控制每一步；create_react_agent 适合快速原型。
- **「为什么要手写图？」** → 生产环境需要在环里加质量门控（sanitize）、上下文压缩（compress）、失败降级（fallback），开箱即用满足不了；手写证明理解原理。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="075-tool-error-handling">

<h2 class="question-title"><span class="q-badge ai100-badge">Q75</span><span class="question-text">图中工具执行出错怎么处理？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 面经 · 考察点：工具错误</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：tool 节点 try-catch 写 error 进 state，agent 节点读 error 决定重试/换参/fallback，绝不让异常穿透崩图。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：超时和限流区别？ · 错误信息给 LLM 看什么？</div>
</div>

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

**一句话**：tool 出错不能崩图——捕获异常写成结构化 error 进 state，让 agent 节点决定重试、换参数还是走 fallback。

**打个比方**：像快递配送——包裹破损（tool 失败）不能整个物流系统停摆，而是记录问题、换一家快递重发或通知用户自取（fallback）。

#### 📖 面试展开（详细版）

工具错误处理是**生产级 Agent 的刚需**，考察你有没有线上思维。

**核心原则：绝不让异常穿透崩图**。tool 节点内部 try-catch，失败时返回结构化 ToolMessage 进 messages/state，而不是 raise Exception。

**错误分类**：
- **可重试**：网络超时、429 限流、503 服务不可用 → agent 节点决定换参数重试或等 backoff
- **不可重试**：401 鉴权失败、400 参数校验失败、404 资源不存在 → 直接走 fallback，不浪费 token

**给 LLM 的错误信息**：
- 结构化：`{"error": "timeout", "tool": "search_api", "retry_after": 5}`
- **脱敏**：不要塞完整 stack trace 或内部 URL，LLM 不需要也不该看到

**两层 retry 别重复**：
- tool 层：`max_retries=3`（网络层重试）
- 图层：条件边判断 error 类型决定是否回 agent 重试（业务层决策）
- 两层协调，避免 3×3=9 次无效重试浪费 token

**fallback 设计**：连续 tool 失败 N 次 → 路由到 fallback 节点 → 返回「暂时无法查询，请稍后重试」+ 人工入口。

#### 💡 核心要点
- 结构化 ToolMessage error
- 可重试错误分类
- 敏感错误信息脱敏

#### 📝 代码/配置示例

```python
def tool_node(state):
    try:
        result = execute_tool(state["tool_call"])
        return {"messages": [ToolMessage(content=result, tool_call_id=...)]}
    except TimeoutError:
        return {"messages": [ToolMessage(content='{"error":"timeout"}', status="error")]}
    except AuthError:
        return {"tool_fatal_error": True}  # 条件边 → fallback

def route_after_tool(state):
    if state.get("tool_fatal_error"):
        return "fallback"
    last = state["messages"][-1]
    if last.status == "error":
        return "agent"  # 让 LLM 决定下一步
    return "agent"
```

#### 🔁 追问怎么接

- **「超时和限流区别？」** → 超时是请求没返回（retry 同样请求）；限流是 429（等 retry_after 再试或换 endpoint）；处理策略不同，限流需要 backoff。
- **「错误信息给 LLM 看什么？」** → 结构化 JSON（error type + tool name + retry_after），脱敏（无 stack trace/内部 URL）；LLM 需要知道「什么错了」来决定下一步，但不需要调试信息。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="076-over-design-judge">

<h2 class="question-title"><span class="q-badge ai100-badge">Q76</span><span class="question-text">怎么判断用 LangGraph 是不是过度设计？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：LangGraph, 面经 · 考察点：过度设计</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：看条件边是否映射真实分支、checkpoint 有无生命周期、团队能否维护 state 约定；线性三步必是过度。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：重构回 Workflow 过吗？ · 如何向老板解释成本？</div>
</div>

**优先级**：P0 · 3+ 篇面经

#### 🗣️ 先用大白话说

**一句话**：过度设计不是道德问题，是可量化问题——三条条件边对应三个真实业务分支吗？checkpoint 有 TTL 吗？新人能看懂 state 吗？

**打个比方**：用大吊车搬一张桌子是过度设计——不是吊车不好，是任务不需要。线性三步流程用 LangGraph 就像用大吊车搬桌子。

#### 📖 面试展开（详细版）

百度/阿里 P0 连问题，考察**技术判断力和诚实度**——敢不敢说「我可能用重了」。

**量化三问**（全答「否」→ 可能过度）：
1. **每条条件边对应真实业务分支吗？**——如果图里有 5 条条件边但只有 2 个真实分支，另外 3 个是「以防万一」，那就是过度
2. **checkpoint 里存的东西有 TTL 和划界吗？**——如果 state 越来越大、没人管清理策略，说明没想清楚持久化需求
3. **半年后新人能看懂 state 演化吗？**——如果 state 字段命名混乱、reducer 约定没文档，维护成本会指数增长

**明确过度场景**：线性「检索 → 生成 → 格式化」三步，无环、无 HITL、无断点续跑需求 → 用 LCEL Workflow 二十行搞定，上 LangGraph 是过度。

**复杂度跟什么走**：业务分支数 × 恢复需求 × 团队规模。不是跟框架热度走。

**向老板解释成本**：用图省的是**分支胶水代码**和**故障恢复成本**，不是代码行数。如果算下来：维护图的时间 > 写 if-else 的时间 + 故障手动恢复的时间，就退回 Workflow。诚实比坚持用框架加分。

#### 💡 核心要点
- 量化三问
- 线性三步用 Chain
- 复杂度跟业务分支数走

#### 📝 代码/配置示例

```python
# 过度：线性三步硬上图
builder.add_node("retrieve", retrieve)
builder.add_node("generate", generate)
builder.add_node("format", format)
builder.add_edge("retrieve", "generate")
builder.add_edge("generate", "format")
# → 用 LCEL 更简洁

# 合理：有环 + HITL
builder.add_conditional_edges("grade", lambda s: "rewrite" if s["score"] < 0.7 else "generate")
builder.compile(interrupt_before=["publish"])
```

#### 🔁 追问怎么接

- **「重构回 Workflow 过吗？」** → 如果有，讲真实 story（「最初上图后发现只有线性三步，维护 State 约定成本 > 收益，退回 LCEL」）；如果没有，说「我会定期用三问自检」。
- **「如何向老板解释成本？」** → 用图省的是分支胶水 + 故障恢复，不是行数；给出量化：「HITL 审批流如果用 if-else 要写 200 行胶水，用 LangGraph interrupt 20 行搞定」。
</div>
</details>

</div>

---

<div class="chapter-nav">

<a class="chapter-nav-link" href="../">📑 总览</a>

<a class="chapter-nav-link" href="production">← 🚀 LangGraph · 工程实践</a>

<a class="chapter-nav-link chapter-nav-next" href="advanced">🔬 LangGraph · 进阶扩展 →</a>

</div>
