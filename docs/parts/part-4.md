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

"三个进展：

**MCP**：Anthropic 开源后工具生态标准化——Client-Server 协议让工具跨框架复用，类似 HTTP 对 Web 的意义。**Computer Use**：Agent 直接看屏幕截图操作 GUI，不靠 API/DOM——工具范式从'写适配'变成'像人一样操作'。**多 Agent 可靠性**：AutoGen/CrewAI 早期通信不稳，近半年聚焦协议设计、错误恢复和共识机制。

若选一个深耕方向：**Agent Evaluation**。大家都能搭 Agent，但怎么判断好坏？LLM 自评有偏差。我的 120 问黄金集体会——自动化指标（延迟/成功率）+ 人工标注 + 对抗测试，三层 eval 是最缺基础设施的方向。"

---

</div>

---



<div class="question-card compact-card" id="q21">

<h2 class="question-title"><span class="q-badge">Q21</span><span class="question-text">你觉得现在的 Agent 框架最大的局限是什么？三年后 Agent 会是什么样？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 考察点：Agent 框架局限与趋势</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：最大局限是可靠性；三年后垂直可靠 Agent 与 OS 级通用 Agent 分化；MCP 成事实标准。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：online learning 风险？ · Skill 结晶怎么防污染？</div>
</div>

"最大局限是**可靠性不够**——十次七八次很好，但两三次调错工具、死循环或误解意图。不全是模型问题，是架构假设每步都成功，错误恢复弱。

真正可靠需要：**自动重试+策略切换**（同工具连失败两次换路）；**子任务原子性**（全成功或全回滚）；**可解释失败**（哪步为何失败）。

三年后两方向分化：**垂直可靠 Agent**（客服/代码审查 95%+ 可替代初级人力）；**通用 Agent OS 化**（像文件管理器一样随处呼出）。MCP 或成工具事实标准；突破可能在 online learning——运行中收集反馈调策略，呼应 GenericAgent Skill 结晶：好 Agent 是用出来的。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q26">

<h2 class="question-title"><span class="q-badge">Q26</span><span class="question-text">OpenClaw 是 2026 年很火的开源 Agent 框架，GitHub 14 万星。你怎么看它和 GenericAgent 的设计差异？OpenClaw 的 Gateway 模式有什么优势？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 考察点：OpenClaw vs GenericAgent</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：OpenClaw 是 Gateway 触达层，GenericAgent 是完整执行系统；工具体系平台化 vs 原子化。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：Gateway 模式瓶颈？ · 为什么 OpenClaw 火？</div>
</div>

"定位差异：**OpenClaw 是 Agent Gateway**（触达层），**GenericAgent 是完整执行系统**。

**架构重心**：OpenClaw 核心在 Gateway——WhatsApp/Discord 等消息进 LLM 再返回，价值是'一处部署、多端接入'；GenericAgent 重心在 ReAct 执行、工具沙箱、记忆，多端只是 display_queue 副产品。**工具体系**：OpenClaw 平台化集成 50+ 第三方服务（MCP）；GenericAgent 9 原子工具 + code_run 动态扩展——给'创造工具能力'而非'现成工具'。**部署**：OpenClaw Docker 一行部署面向非开发者；GenericAgent 偏开发者定制。

两者互补——Gateway 解决触达，执行引擎解决自主完成任务；未来可能 Gateway + 执行引擎分工独立演进。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q27">

<h2 class="question-title"><span class="q-badge">Q27</span><span class="question-text">OpenClaw 的多租户隔离是怎么做的？如果要你设计一个支持 100 个用户同时使用的 Agent 平台，你会参考 OpenClaw 的哪些设计？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 考察点：OpenClaw 多租户</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Session/workspace/Gateway 路由三层隔离；参考声明式配置和 per-user quota；Gateway 前加消息队列。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：100 人并发 Gateway 单点？ · workspace 权限模型？</div>
</div>

"OpenClaw 三层隔离：**Session**（独立 message history/context）；**Workspace**（`data/user_{id}/` 文件隔离）；**Gateway 路由**（身份验证与权限路由）。

100 人平台我会参考两点：**声明式 YAML 配置**——多端接入不改代码；**per-user token budget + rate limit**——某用户死循环不耗尽他人配额。

不照搬之处：Gateway 高并发是单点瓶颈——前面加 Redis Stream 解耦'接收'与'处理'，Gateway 只负责接入和响应。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q28">

<h2 class="question-title"><span class="q-badge">Q28</span><span class="question-text">如果你要把 OpenClaw 的 Gateway 和 GenericAgent 的执行引擎融合成一个系统，你会怎么设计？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 考察点：OpenClaw+GenericAgent 融合</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Gateway→调度层→执行引擎三层；松耦合、共享记忆、意图识别智能路由降延迟。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：调度层怎么识别简单/复杂任务？ · display_queue 怎么跨进程？</div>
</div>

"三层融合：**OpenClaw Gateway**（多端接入、鉴权、格式化）→ **调度层**（简单问答直调 LLM；复杂任务分发 GenericAgent ReAct 引擎）→ **执行引擎+工具层**（display_queue 回传结果经 Gateway 推送）。

**三个关键**：Gateway 与引擎松耦合，调度层做协议中转；**共享分层记忆**——L1 用户身份、L2 偏好、L3 任务 SOP，读写权限分开；Gateway **意图识别路由**——简单问 <1s 直返，复杂任务才启动完整 Agent，降平均延迟和 Token 消耗。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q29">

<h2 class="question-title"><span class="q-badge">Q29</span><span class="question-text">Hermes Agent 是 2026 年初另一个很火的开源 Agent 框架，主打自我进化和持久记忆。你怎么看它和 GenericAgent 的异同？如果你要在一个 Agent 框架里同时实现两者的优势，你会怎么做？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 考察点：Hermes vs GenericAgent</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：共识：自主执行+分层记忆+技能结晶；Hermes 更用户友好/主动记忆，GenericAgent 更极简/谨慎更新。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：插件市场 vs code_run？ · 主动记忆误判怎么办？</div>
</div>

"两者共识：自主执行、分层记忆、技能结晶（Hermes skill crystallization ≈ GenericAgent L3 SOP）、文本索引优于纯向量。

**差异**：Hermes 更用户友好——Skill 像 App Store 可浏览安装；GenericAgent 更极简——9 原子工具 + code_run 自造工具。Hermes 记忆**主动**从对话提取；GenericAgent **被动**——显式 start_long_term_update 且只记代码验证过的事实，更谨慎。

融合方案：GenericAgent 精简执行引擎做核心 + Hermes 主动记忆收集 + OpenClaw Gateway 触达——Gateway 触达、引擎行动、记忆记住。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q30">

<h2 class="question-title"><span class="q-badge">Q30</span><span class="question-text">Hermes Agent 的核心卖点是'自我进化'——用的时间越长、能力越强。这个机制你是怎么理解的？在你自己的 Agent 项目里，有没有类似的进化机制？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 考察点：自我进化机制</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：成功路径固化为 Skill/SOP；关键是如何过滤一次性路径——频率阈值 vs 显式触发+代码验证。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：记忆污染案例？ · 三层过滤阈值怎么定？</div>
</div>

"自我进化本质是**成功路径固化为 Skill/SOP**——第一次从零摸索，第二次 L1 索引命中直接复用。GenericAgent 的 start_long_term_update → L3 SOP 结晶与 Hermes 同思路。

**关键挑战**：如何判断路径可复用而非一次性？Hermes 可能用频率+相似度阈值（≥3 次且路径相似才固化）；GenericAgent 更保守——显式触发且只记代码验证事实。我认同后者：**记忆准确比全面更重要**。

自研会用三层过滤：任务成功才记；路径有结构化模式才记；同类任务出现 ≥2 次才固化。"


---
</div>
</details>

</div>
