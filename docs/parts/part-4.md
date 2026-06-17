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

如果选一个方向深入研究，我会选 Agent 的评估体系——也就是 Agent Evaluation。现在大家都能搭 Agent，但怎么判断一个 Agent 做得好不好？LLM-based evaluation 虽然流行，但 LLM 自己给自己的输出打分有严重偏差。我做过科研问答的评测体系，120 问黄金集加定量指标的方式让我觉得一个好的 eval framework 需要三层：自动化指标（延迟、成功率）、人工标注（质量评分）、对抗测试（故意输入边界 case）。Agent 评估现在是最缺基础设施的方向。"

---

</div>

---



<div class="question-card" id="q21">

<h2 class="question-title"><span class="q-badge">Q21</span> 技术视野</h2>

<div class="question-prompt"><strong>题目</strong>：你觉得现在的 Agent 框架最大的局限是什么？三年后 Agent 会是什么样？</div>


<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 考察点：Agent 框架局限与趋势</div>


<div class="q-conclusion">

💡 **15 秒结论**：最大局限是可靠性；三年后垂直可靠 Agent 与 OS 级通用 Agent 分化；MCP 成事实标准。

</div>



<div class="q-followups">

🔁 **追问方向**：online learning 风险？ · Skill 结晶怎么防污染？

</div>


<details class="answer-reveal">
<summary>展开完整回答</summary>

<div class="answer-body">

"现在 Agent 框架最大的局限是**可靠性不够**。你用 Agent 写代码、查资料，十次可能有七次做得很好，但总有那么两三次会掉链子——也许是 LLM 调错了工具、也许是执行路径出现了死循环、也许是对用户的意图理解偏差。

这不只是模型能力的问题，是架构问题。现在的 Agent 框架都假设每一步调用都会成功——ReAct 循环没有足够强的错误恢复机制。我分析 GenericAgent 的时候注意到它用 max_turns 和 turn 计数来防死循环、用 ask_user 在阻塞时求助人类——这已经比很多框架好了，但仍然不够。真正的可靠性需要：

1. **自动重试 + 策略切换**：一个工具连续失败两次，自动换策略
2. **子任务原子性**：像数据库事务一样，一组操作要么全成功要么全回滚
3. **可解释的失败原因**：Agent 失败时不止说 'failed'，要说清楚哪个 step 为什么 failed

三年后我觉得会出现两个方向的分化。一个方向是**垂直领域的可靠 Agent**——在客服、代码审查、数据分析这些特定场景做到 95%+ 的可靠性，可以替代初级人力。另一个方向是**通用 Agent 的操作系统化**——Agent 不再是一个应用，而是操作系统的一部分，像现在的文件管理器一样，你能在任何应用里呼出 Agent 帮你操作。

技术上，我认为 MCP 会成为 Agent 工具的事实标准，Function Calling 的协议层会稳定下来。但真正的突破可能来自 Agent 的 online learning——Agent 在运行中自动收集反馈并调整策略，而不是依赖开发者手动更新 prompt。这回到了 GenericAgent 的 Skill 结晶的理念——好的 Agent 不是设计出来的，是用出来的。"

</div>
</details>

</div>

---

<div class="question-card" id="q26">

<h2 class="question-title"><span class="q-badge">Q26</span> OpenClaw 对比</h2>

<div class="question-prompt"><strong>题目</strong>：OpenClaw 是 2026 年很火的开源 Agent 框架，GitHub 14 万星。你怎么看它和 GenericAgent 的设计差异？OpenClaw 的 Gateway 模式有什么优势？</div>


<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 考察点：OpenClaw vs GenericAgent</div>


<div class="q-conclusion">

💡 **15 秒结论**：OpenClaw 是 Gateway 触达层，GenericAgent 是完整执行系统；工具体系平台化 vs 原子化。

</div>



<div class="q-followups">

🔁 **追问方向**：Gateway 模式瓶颈？ · 为什么 OpenClaw 火？

</div>


<details class="answer-reveal">
<summary>展开完整回答</summary>

<div class="answer-body">

"OpenClaw 和 GenericAgent 最大的设计差异是定位。OpenClaw 定位是 **Agent Gateway**——它是一个连接大模型和各种通信平台的中间层。GenericAgent 更像一个**完整的 Agent 系统**——它包含了执行引擎、工具实现、记忆、前端接入的全链路。

具体差异有三点。

**第一是架构重心**。OpenClaw 的核心是 Gateway——用户通过 WhatsApp、Discord、Telegram 发一条消息，Gateway 接收后调用 LLM，把结果返回。它的价值在于'一处部署、多端接入'的体验统一。GenericAgent 的重心在 Agent 的自主执行能力——ReAct 循环、工具设计、代码执行沙箱——多端接入只是它 display_queue 的副产品。

**第二是工具体系**。OpenClaw 的工具体系更'平台化'——它集成了 50+ 第三方服务，通过 MCP 或类似协议发现和调用。这降低了用户的使用门槛——你不需要写代码，配置一下就能用。GenericAgent 的工具是原子化的——9 个基础工具，通过 code_run 动态扩展。它给你的是'创造工具的能力'而不是'现成的工具'。

**第三是部署模式**。OpenClaw 强调 Docker 一行命令部署，目标是让非开发者也能用。GenericAgent 更偏开发者的定制化——你需要写 mykey.py 配置、理解 ReAct 循环逻辑、可能还需要自己加工具。

如果从架构演进角度看，两者其实有互补性。OpenClaw 的 Gateway 模式解决了'Agent 怎么触达用户'的问题，GenericAgent 解决了'Agent 怎么自主完成任务'的问题。未来可能会出现'OpenClaw 做 Gateway + GenericAgent 做执行引擎'的组合方案。这也是我对 Agent 架构未来发展的判断——分工会越来越细，Gateway、执行引擎、工具注册中心会各自独立发展。"

</div>
</details>

</div>

---

<div class="question-card" id="q27">

<h2 class="question-title"><span class="q-badge">Q27</span> OpenClaw 深度</h2>

<div class="question-prompt"><strong>题目</strong>：OpenClaw 的多租户隔离是怎么做的？如果要你设计一个支持 100 个用户同时使用的 Agent 平台，你会参考 OpenClaw 的哪些设计？</div>


<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 考察点：OpenClaw 多租户</div>


<div class="q-conclusion">

💡 **15 秒结论**：Session/workspace/Gateway 路由三层隔离；参考声明式配置和 per-user quota；Gateway 前加消息队列。

</div>



<div class="q-followups">

🔁 **追问方向**：100 人并发 Gateway 单点？ · workspace 权限模型？

</div>


<details class="answer-reveal">
<summary>展开完整回答</summary>

<div class="answer-body">

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

<div class="question-card" id="q28">

<h2 class="question-title"><span class="q-badge">Q28</span> OpenClaw + GenericAgent 融合</h2>

<div class="question-prompt"><strong>题目</strong>：如果你要把 OpenClaw 的 Gateway 和 GenericAgent 的执行引擎融合成一个系统，你会怎么设计？</div>


<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 考察点：OpenClaw+GenericAgent 融合</div>


<div class="q-conclusion">

💡 **15 秒结论**：Gateway→调度层→执行引擎三层；松耦合、共享记忆、意图识别智能路由降延迟。

</div>



<div class="q-followups">

🔁 **追问方向**：调度层怎么识别简单/复杂任务？ · display_queue 怎么跨进程？

</div>


<details class="answer-reveal">
<summary>展开完整回答</summary>

<div class="answer-body">

"我会设计一个三层融合架构。

**最上层是 OpenClaw 的 Gateway**——负责多端接入。用户通过 WhatsApp、飞书、Web 等任何平台发消息，Gateway 统一接收，做身份验证、消息格式化、路由分发。

**中间层是新加的调度层**。Gateway 收到的消息进入调度队列，调度器根据任务类型决定：简单问答（'今天天气怎么样'）直接调 LLM 返回；复杂任务（'帮我查论文、做分析、发邮件'）分发到 GenericAgent 的执行引擎。

**最下层是 GenericAgent 的执行引擎 + 工具层**。执行引擎跑 ReAct 循环，调用工具完成任务。执行结果通过 display_queue 返回调度层，再通过 Gateway 推回用户。

这个设计的三个关键点。

第一，**Gateway 和执行引擎是松耦合的**。Gateway 不关心 Agent 怎么执行，Agent 不关心消息从哪来。调度层通过 display_queue 做协议中转——这和 GenericAgent 现有的前后端解耦设计完全一致。

第二，**共享记忆系统**。Gateway 层需要知道'这个用户是谁'，执行引擎需要知道'这个任务的上次结果是什么'。我会用统一的分层记忆——L1 索引存用户身份映射，L2 存用户偏好和配置，L3 存任务 SOP。Gateway 和执行引擎共享同一个记忆存储，但读写权限分开。

第三，**Gateway 可以做智能路由**。不是所有消息都需要启动一个完整的 Agent 执行循环。Gateway 可以先走一个轻量级的意图识别模型——如果是简单问答，直接调 LLM 返回（延迟 < 1s）；如果是复杂任务，才启动执行引擎。这大大降低了平均延迟和 Token 消耗。

这个架构本质上就是把 OpenClaw 的'消息触达'能力和 GenericAgent 的'自主执行'能力解耦之后重新组合——两者都没有改任何一行代码，只是在中间加了调度层。"

</div>
</details>

</div>

---

<div class="question-card" id="q29">

<h2 class="question-title"><span class="q-badge">Q29</span> Hermes Agent 对比</h2>

<div class="question-prompt"><strong>题目</strong>：Hermes Agent 是 2026 年初另一个很火的开源 Agent 框架，主打自我进化和持久记忆。你怎么看它和 GenericAgent 的异同？如果你要在一个 Agent 框架里同时实现两者的优势，你会怎么做？</div>


<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 考察点：Hermes vs GenericAgent</div>


<div class="q-conclusion">

💡 **15 秒结论**：共识：自主执行+分层记忆+技能结晶；Hermes 更用户友好/主动记忆，GenericAgent 更极简/谨慎更新。

</div>



<div class="q-followups">

🔁 **追问方向**：插件市场 vs code_run？ · 主动记忆误判怎么办？

</div>


<details class="answer-reveal">
<summary>展开完整回答</summary>

<div class="answer-body">

"Hermes 和 GenericAgent 有惊人的相似性，但也有本质差异。

**相似之处**：两者都强调 Agent 的自主执行能力（不是套壳聊天）、都有持久记忆系统、都有自我进化机制（Hermes 叫 skill crystallization，GenericAgent 叫 L3 SOP 结晶）、都采用分层记忆而非向量检索。这说明 2026 年 Agent 社区对'好的 Agent 应该是怎样的'已经有了共识。

**差异在于设计哲学**。

Hermes 更'用户友好'——它的技能系统像一个 App Store，你可以浏览、安装、分享其他用户的 Skill。GenericAgent 更'极简'——它只给你 9 个原子工具和 code_run，相信 Agent 自己会创造工具。

Hermes 的记忆系统更'主动'——它会自动从对话中提取信息更新记忆，有一定的自主整理能力。GenericAgent 的记忆更新是'被动'的——Agent 需要显式调用 start_long_term_update 才会触发记忆更新，而且只记'被代码验证过的信息'。这是一种更谨慎的设计——宁可少记、不记错。

Hermes 的社区生态更成熟——60K GitHub 星，有插件市场、有社区贡献的 Skill 和工具。GenericAgent 更像一个'教学级'的框架——代码量小、设计清晰、适合学习和二次开发。

如果要融合两者的优势，我会这样做：用 GenericAgent 的精简执行引擎做为核心（因为越精简越可靠），加上 Hermes 的主动记忆收集机制（自动从对话中提取 facts），再加上 OpenClaw 的 Gateway 做多端接入。三者的组合：Gateway 解决'触达'、执行引擎解决'行动'、主动记忆解决'记住'。这让我想起一句话——好的系统不是把什么都塞进去，而是把三件各自擅长的事组合起来。"

</div>
</details>

</div>

---

<div class="question-card" id="q30">

<h2 class="question-title"><span class="q-badge">Q30</span> Hermes 自我进化</h2>

<div class="question-prompt"><strong>题目</strong>：Hermes Agent 的核心卖点是'自我进化'——用的时间越长、能力越强。这个机制你是怎么理解的？在你自己的 Agent 项目里，有没有类似的进化机制？</div>


<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 考察点：自我进化机制</div>


<div class="q-conclusion">

💡 **15 秒结论**：成功路径固化为 Skill/SOP；关键是如何过滤一次性路径——频率阈值 vs 显式触发+代码验证。

</div>



<div class="q-followups">

🔁 **追问方向**：记忆污染案例？ · 三层过滤阈值怎么定？

</div>


<details class="answer-reveal">
<summary>展开完整回答</summary>

<div class="answer-body">

"Hermes 的自我进化机制本质上就是 GenericAgent 里 Skill 结晶的一个更成熟的版本。

它的工作原理大概是：用户完成一个任务 → Hermes 分析这个任务的执行路径 → 如果这是一个新的、可复用的模式 → 自动提取为一个 Skill → 存入技能库 → 下次同类任务直接调用。

这解决了 Agent 的一个核心矛盾——开发者不可能预置所有场景的工具和流程，但 Agent 每次从零摸索又太慢。自我进化就是'第一次从零学会、第二次自动复用'。

我在分析 GenericAgent 的时候也看到了完全相同的思路——Agent 完成任务后调用 start_long_term_update，把执行路径固化为 L3 SOP 文件，下次同类任务通过 L1 索引定位到 SOP 直接执行。

但这里面有一个很关键的工程挑战——**怎么判断一个执行路径是可复用的、而不是一次性的**？如果 Agent 把每次执行的路径都存成 Skill，记忆库会充满低质量的重复内容。

Hermes 的做法可能是加了一个频率阈值——如果某个任务模式出现了 3 次以上，且每次执行路径相似度超过阈值，才固化为 Skill。GenericAgent 的做法更保守——它要求 Agent 显式判断'这次经历有价值'才触发记忆更新，而且只记被代码验证过的事实。我个人更认同后者的设计——记忆不是越多越好，准确比全面更重要。

如果我要在自己的 Agent 里实现进化机制，我会用三层过滤：第一层，任务是否成功完成（失败的不记）；第二层，执行路径是否有结构化的模式（碎片的不记）；第三层，同类任务是否出现过 2 次以上（单次的不记）。三层过滤之后再固化。"


---

</div>
</details>

</div>
