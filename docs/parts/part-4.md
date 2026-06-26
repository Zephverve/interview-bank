---
part: 4
partTitle: Part 4 · 行业视野
partColor: #10b981
---

<div class="part-hero" style="--part-color: #10b981">

# Part 4 · 行业视野

<p class="part-desc">竞品对比 · OpenClaw · Hermes</p>
<span class="part-round">二面加分</span>

</div>

<div class="part-intro">

## Q9 · 技术视野

**题目**：最近半年 Agent 领域有哪些让你印象深刻的新进展？如果让你选一个方向深入研究，你会选什么？

---

> **轮次**：二面 · **难度**：⭐⭐⭐ · **考察点**：Agent 领域新进展

**结论句（15 秒）**：MCP 标准化工具生态、Computer Use 改变工具范式、多 Agent 可靠性提升；最想深耕 Agent Evaluation。

**追问方向**：怎么评估 Agent 好坏？ · MCP 和 Function Calling 关系？

### 回答

"我选三个说吧。

第一个是 MCP——Model Context Protocol。Anthropic 把它开源之后，整个 Agent 工具生态开始标准化了。以前每个 Agent 框架都有自己的工具注册方式，MCP 提供了一套统一的 Client-Server 协议，Agent 通过 MCP Client 发现和调用 MCP Server 提供的工具。这有点像当年的 HTTP 对 Web 的意义——标准化意味着互操作性，工具可以跨 Agent 框架复用。

第二个是 Computer Use Agent。从 Anthropic 的 Computer Use 到 OpenAI 的 Operator，Agent 开始能真正操作 GUI 了——不靠 API、不靠 DOM 解析，直接看屏幕截图、移动鼠标、点击按钮。这改变了 Agent 的工具范式——以前你需要给每个应用写 API 适配，现在 Agent 能像人一样操作任何软件。

第三个是多 Agent 协作的可靠性提升。AutoGen 和 CrewAI 之前的问题是 Agent 之间的通信不稳定——一个 Agent 发错消息，整个 pipeline 就崩了。最近半年大家开始关注 Agent 间的协议设计、错误恢复和共识机制。

如果选一个方向深入研究，我会选 Agent 的评估体系——Agent Evaluation。我做过科研问答的 **120 问黄金集 + Recall@5 + RAGAs Faithfulness + Faithfulness Guard**，让我觉得好的 eval 需要三层：自动化指标（延迟、Recall、Guard 通过率）、人工标注（质量评分）、对抗测试（跨论文/表格/口语边界 case）。Agent 评估现在是最缺基础设施的方向。"

---

</div>

---



<div class="question-card compact-card" id="q21">

<h2 class="question-title"><span class="q-badge">Q21</span><span class="question-text">你觉得现在的 Agent 框架最大的局限是什么？三年后 Agent 会是什么样？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 考察点：Agent 框架局限与趋势</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：最大局限是可靠性；三年后垂直可靠 Agent 与 OS 级通用 Agent 分化；MCP 成事实标准。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：online learning 风险？ · Skill 结晶怎么防污染？</div>
</div>

"现在 Agent 框架最大的局限是**可靠性不够**。你用 Agent 写代码、查资料，十次可能有七次做得很好，但总有那么两三次会掉链子——也许是 LLM 调错了工具、也许是执行路径出现了死循环、也许是对用户的意图理解偏差。

这不只是模型能力的问题，是架构问题。我在 **EvoAgent** 里实践过几件事：max_turns + Token 预算熔断、MixinSession 故障切换、**对抗验证 SubAgent** 在交付前挑刺、ask_user 在阻塞时求助人类——比裸 ReAct 稳，但仍然不够。真正的可靠性需要：

1. **自动重试 + 策略切换**：一个工具连续失败两次，自动换策略（RAG 里对应 Self-RAG re-retrieve）
2. **子任务原子性**：像数据库事务一样，一组操作要么全成功要么全回滚
3. **可解释的失败原因**：Agent 失败时不止说 'failed'，要说清楚哪个 step 为什么 failed

三年后我觉得会出现两个方向的分化。一个方向是**垂直领域的可靠 Agent**——在客服、代码审查、数据分析、**科研问答**这些特定场景做到 95%+ 的可靠性。另一个方向是**通用 Agent 的操作系统化**——Agent 像 OS 组件一样随处呼出。

技术上，MCP 会成为 Agent 工具的事实标准。突破可能来自 **online learning / 技能结晶**——EvoAgent 任务后把验证过的路径沉淀为 L3 SOP，好的 Agent 是用出来的，不是只改 prompt 堆出来的。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q26">

<h2 class="question-title"><span class="q-badge">Q26</span><span class="question-text">OpenClaw 是 2026 年很火的开源 Agent 框架，GitHub 14 万星。你怎么看它和 EvoAgent 的设计差异？OpenClaw 的 Gateway 模式有什么优势？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 考察点：OpenClaw vs EvoAgent</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：OpenClaw 是 Gateway 触达层，EvoAgent 是轻量执行+进化系统；OpenClaw 平台化工具体系，EvoAgent 原子工具+SubAgent+对抗验证。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：Gateway 模式瓶颈？ · 为什么 OpenClaw 火？</div>
</div>

"OpenClaw 和 EvoAgent 最大的设计差异是**定位**。OpenClaw 是 **Agent Gateway**——连接大模型和各种通信平台。EvoAgent 是我做的**完整但轻量的执行系统**——ReAct+四阶段 SOP、L0-L4 记忆、Conductor 编排、任务后技能结晶。

**架构重心**：OpenClaw 核心价值是'一处部署、多端接入'（WhatsApp/Discord/Telegram）。EvoAgent 重心在**自主执行与可靠交付**——SubAgent 委托、对抗验证、MixinSession 容错；多端接入靠 Conductor 的 WebSocket/SSE，不是主卖点。

**工具体系**：OpenClaw 平台化，集成大量第三方服务 via MCP。EvoAgent **最少充分工具集**（≤10 个原子工具）+ code_run 动态扩展，复杂检索可接我的 RAG 管线作 `search` 后端。

**部署**：OpenClaw 强调 Docker 一行部署给非开发者。EvoAgent 偏开发者二次开发——配置 Provider、扩展工具、挂 Conductor。

互补性很明显：OpenClaw 解决'怎么触达用户'，EvoAgent 解决'怎么可靠做完任务'。未来可以是 **OpenClaw Gateway + EvoAgent 执行引擎 + 垂域 RAG 知识库** 的组合——Gateway、执行引擎、知识层分工越来越细。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q27">

<h2 class="question-title"><span class="q-badge">Q27</span><span class="question-text">OpenClaw 的多租户隔离是怎么做的？如果要你设计一个支持 100 个用户同时使用的 Agent 平台，你会参考 OpenClaw 的哪些设计？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 考察点：OpenClaw 多租户</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Session/workspace/Gateway 路由三层隔离；参考声明式配置和 per-user quota；Gateway 前加消息队列。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：100 人并发 Gateway 单点？ · workspace 权限模型？</div>
</div>

"OpenClaw 的多租户隔离主要通过三层实现。

**第一层是 Session 级别隔离**。每个用户的对话是一个独立的 session，有独立的 message history 和 context。不同 session 之间的 LLM 调用完全独立，不存在跨 session 的信息泄露。

**第二层是 workspace 隔离**。如果 Agent 需要文件操作，每个用户有自己的 workspace 目录，类似于 `data/user_{id}/` 的结构。这保证了文件级别的隔离。

**第三层是 Gateway 的路由隔离**。不同平台的用户通过不同的 Gateway route 接入，Gateway 负责做身份验证和权限路由。

如果要设计一个 100 人使用的 Agent 平台，我会参考 OpenClaw 的两点设计。

第一点是它的**声明式配置管理**。OpenClaw 用 YAML 配置文件管理所有接入平台、模型、工具，而不是硬编码。100 个用户意味着 100 种潜在的个性化需求——有人用 Telegram、有人用飞书、有人用 Web。声明式配置让你可以不改代码，只改配置就完成接入。

第二点是它的**资源调度策略**。OpenClaw 对每个 session 有独立的 token budget 和 rate limit——这对多租户场景至关重要。如果某个用户触发了 Agent 的死循环，不能用光其他用户的配额。我在设计我的平台时会加一个严格的 per-user quota 系统。

但我不会完全照搬 OpenClaw 的设计。它的 Gateway 模式在高并发下有一个瓶颈——Gateway 本身是单点。如果 100 个用户同时发消息，Gateway 需要做负载均衡。我会在 Gateway 前面加一个消息队列（比如 Redis Stream），把'接收消息'和'处理消息'解耦——异步处理，Gateway 只负责接收和响应。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q28">

<h2 class="question-title"><span class="q-badge">Q28</span><span class="question-text">如果你要把 OpenClaw 的 Gateway 和 EvoAgent 的执行引擎融合成一个系统，你会怎么设计？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 考察点：OpenClaw+EvoAgent 融合</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Gateway→调度层→EvoAgent 执行引擎三层；松耦合、共享 L0-L4 记忆、意图路由降延迟；科研问答走 RAG 短链路。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：调度层怎么识别简单/复杂任务？ · Conductor inbox 怎么跨进程？</div>
</div>

"我会设计一个三层融合架构。

**最上层是 OpenClaw 的 Gateway**——多端接入、鉴权、消息格式化。

**中间层是调度层**。简单问答（术语解释、单轮 FAQ）→ 直接调 **Agentic RAG 短链路** 或轻量 LLM（延迟 < 1s）；复杂任务（多步调研、写报告、跨工具编排）→ 分发到 **EvoAgent** 的 Conductor + ReAct/SOP 循环。

**最下层是 EvoAgent 执行引擎 + 工具层**。繁重步骤 SubAgent、交付前对抗验证；`search` 工具后端接我的 Qdrant+RAG 管线；结果经 Conductor inbox 回调度层，再经 Gateway 推用户。

三个关键点：

1. **松耦合**——Gateway 不知道 Agent 怎么执行；EvoAgent 不知道消息从 Telegram 还是飞书来。调度层做协议中转，和 EvoAgent「核心只发 inbox 事件」一致。

2. **共享分层记忆**——L1 用户身份映射、L2 偏好、L3 任务 SOP；Gateway 读 L1/L2，执行引擎读写 L2/L3/L4，权限分开。

3. **智能路由降成本**——不是每条消息都启动完整 Agent。意图识别后，60% 课题组式简单问走 RAG，只有多工具长任务才拉起 EvoAgent 全链路。

本质是把 OpenClaw 的触达、EvoAgent 的执行、垂域 RAG 的知识层拆开再组合——我在两个个人项目里已经把执行层和知识层分别做完了，中间只差挂 Gateway。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q29">

<h2 class="question-title"><span class="q-badge">Q29</span><span class="question-text">Hermes Agent 是 2026 年初另一个很火的开源 Agent 框架，主打自我进化和持久记忆。你怎么看它和 EvoAgent 的异同？如果你要在一个 Agent 框架里同时实现两者的优势，你会怎么做？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 考察点：Hermes vs EvoAgent</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：共识：自主执行+分层记忆+技能结晶；Hermes 更用户友好/主动记忆/插件市场，EvoAgent 更轻+对抗验证+谨慎记忆更新。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：插件市场 vs code_run？ · 主动记忆误判怎么办？</div>
</div>

"Hermes 和 EvoAgent 有惊人的相似性，但也有本质差异。

**相似之处**：都强调自主执行、都有分层记忆、都有任务后技能结晶（Hermes 叫 skill crystallization，EvoAgent 沉淀 L3 SOP）、都优先可解释的文件化记忆而非纯向量检索。

**差异在于设计哲学**。

Hermes 更**用户友好**——Skill 像 App Store。EvoAgent 更**极简**——≤10 原子工具 + code_run + SubAgent 组合。

Hermes 记忆更**主动**——自动从对话抽 facts。EvoAgent **被动且谨慎**——任务后增量更新，**SubAgent 验证过**的事实才进长期记忆。

Hermes 社区生态成熟（插件市场、60K star）。EvoAgent 是个人项目，代码可控，适合 demo 和二次开发。

融合思路：EvoAgent 执行引擎 + 对抗验证做底座，选择性借鉴 Hermes 主动 fact 抽取（进 L2 前仍验证），Gateway 用 OpenClaw。我自己的 EvoAgent 已走'谨慎结晶'路线，是有意取舍。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q30">

<h2 class="question-title"><span class="q-badge">Q30</span><span class="question-text">Hermes Agent 的核心卖点是'自我进化'——用的时间越长、能力越强。这个机制你是怎么理解的？在你自己的 Agent 项目里，有没有类似的进化机制？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 考察点：自我进化机制</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：成功路径固化为 L3 SOP；EvoAgent 用对抗验证+三层过滤防污染；Hermes 可能用频率阈值。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：记忆污染案例？ · 三层过滤阈值怎么定？</div>
</div>

"Hermes 的自我进化：任务完成 → 分析执行路径 → 可复用模式 → 固化为 Skill → 下次直接调用。解决的是'开发者无法预置所有场景，但 Agent 每次从零又太慢'。

**EvoAgent 里我实现了同类机制**：任务后从 L0 working memory 提取**已验证事实**和**操作经验**，增量更新 L2/L3——成功路径结晶为 L3 SOP，L1 索引下次同类任务直接定位。

关键工程问题：**怎么避免把一次性路径存成 Skill**？我在 EvoAgent 用三层过滤：

1. 任务是否成功且通过 **对抗验证 SubAgent**（失败的不记）
2. 路径是否有结构化模式（碎片步骤不记）
3. 同类任务是否重复出现 ≥2 次（单次偶发不记）

Hermes 可能用频率阈值（3 次以上 + 路径相似度）。我更认同 **显式触发 + 代码/SubAgent 验证**——记忆不是越多越好，准确比全面更重要。这和 RAG 里 Faithfulness Guard '宁可拒答不瞎编'是同一套产品哲学。"


---
</div>
</details>

</div>
