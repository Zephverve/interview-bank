---
part: 2
partTitle: Part 2 · Agent 架构
partColor: #8b5cf6
---

<div class="part-hero" style="--part-color: #8b5cf6">

# Part 2 · Agent 架构

<p class="part-desc">ReAct · 工具 · 记忆 · 安全</p>
<span class="part-round">一面/二面</span>

</div>

<div class="part-intro">

> 从架构对比到从零设计，再到工具与安全

</div>

---



<div class="question-card compact-card" id="q3">

<h2 class="question-title"><span class="q-badge">Q3</span><span class="question-text">ReAct 和 LangGraph 的 StateGraph 编排有什么区别？什么场景用 ReAct 更好，什么场景用 LangGraph 更好？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 考察点：ReAct vs LangGraph 控制权差异</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：ReAct 让 LLM 决策下一步；LangGraph 开发者预定义流程。RAG 用 LangGraph，开放任务用 ReAct，可混合。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：tool call 格式错误怎么处理？ · StateGraph 几个节点？ · 校验失败重试几次？</div>
</div>

"核心区别在于**控制权在谁手里**。ReAct 是 LLM 自主决策——每一轮 LLM 看到当前状态，自己决定下一步调用哪个工具。LangGraph 的 StateGraph 是你作为开发者预定义节点和边，LLM 只在特定节点里做推理。

ReAct 适合开放性任务。比如你跟 Agent 说'帮我查一下这个问题的相关论文，汇总成报告发给我'，你不知道 Agent 需要查几次、搜什么关键词、中间会不会遇到死胡同需要换方案——这些 LLM 自己探索更灵活。

LangGraph 适合流程确定的任务。比如我的 Agentic RAG——意图路由→改写→（可选 HyDE）→混合检索→门控→压缩→生成→Faithfulness Guard→Self-RAG 条件边——主链路顺序是业务定的，LLM 不负责「下一步检还是生」。用 StateGraph 的好处是每一步可审计、可单独测、条件边显式。

我的项目里两种都用到了。科研 RAG 用 LangGraph 做 Agentic 流水线——意图路由、质量门控、Faithfulness Guard 这些分支是预定义的。**EvoAgent** 里开放任务走 ReAct + 四阶段 SOP，繁重步骤委托 SubAgent，适合任务类型不确定的场景。

理论上两者可以混合——LangGraph 外层约束主流程，某个节点里嵌入 EvoAgent 的 ReAct 子循环处理不确定性。我的 Conductor 编排层就是这么干的。

**追问**：如果在 LangGraph 的某个节点里 LLM 返回了错误格式的 tool call，你怎么处理？

"我实际遇到过这个问题。LangGraph 里调用 LLM 用的是 with_structured_output 或者自己 parse JSON，一旦 LLM 返回格式不对就会抛异常。我的处理是三层：第一层加 retry——把错误信息和原始 prompt 一起重新发给 LLM，让它修正格式，通常 1-2 次就能对；第二层降级——如果 retry 失败，把 tool call 降级为普通的文本生成，跳过工具执行直接进入下一个节点；第三层人工介入——如果降级也失败，触发 ask_user 让用户决定下一步。EvoAgent 里我在 MixinSession 层也做了类似兜底——主 Provider 格式异常时切换备用后端或降级为文本协议。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q4">

<h2 class="question-title"><span class="q-badge">Q4</span><span class="question-text">Native Function Calling 和把工具描述拼在 system prompt 里，对模型行为有什么本质影响？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 考察点：Native FC vs 文本协议</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Native 是结构化约束，参数更准、支持 parallel calls；文本协议靠阅读理解，易编造参数。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：不支持 FC 的模型怎么降级？ · Mixin 故障转移怎么做的？</div>
</div>

"本质区别是**结构化 vs 阅读理解**。

Native Function Calling 把工具定义以 JSON Schema 格式放在 API 的 tools 字段里，模型在训练阶段被专门优化过这种格式——它知道这个字段里的内容是'我可以调用的函数'，参数名、类型、是否必填都是结构化的约束。所以它的参数提取准确率高，不太会编造不存在的工具名。

文本协议是把工具描述拼在 system prompt 里，比如'你可以使用以下工具：file_read(path, start, count)'——这本质上依赖模型的阅读理解能力。模型需要从自然语言里推断工具名、参数和调用格式。问题在于，模型可能会'读出'不存在的参数，或者把一个工具的用法套到另一个工具上。

我在 **EvoAgent** 的 Provider 抽象层里同时实现了 Native Function Calling 和文本协议兜底：**MixinSession** 优先走 API `tools` 字段，失败或模型不支持时自动切到 prompt 内嵌 schema——主 Provider 挂了还能切备用后端，这和我在 RAG 侧「多模型调度」是同一套思路。Native 参数更准、支持 parallel tool calls；文本协议兼容性更广。

一个具体的差异是 parallel tool calls。Native 模式下 LLM 可以一次返回多个 tool call——比如同时读两个文件。文本协议下很难实现这一点，因为你需要定义复杂的文本格式来区分'多个调用'和'一个调用里的多行参数'。

如果一个模型不支持 Native Function Calling，我的降级方案是：用严格定义的 Markdown 格式作为工具调用协议，比如用代码块标记工具名和 JSON 参数，然后加一个 parser 来做格式校验和错误恢复。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q31">

<h2 class="question-title"><span class="q-badge">Q31</span><span class="question-text">EvoAgent 的执行循环是怎么设计的？和纯 ReAct 有什么区别？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 考察点：ReAct 循环从零设计</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：ReAct 内核 + 探索/规划/执行/验证四阶段 SOP；繁重步骤 SubAgent 委托；完成后对抗验证 SubAgent；带熔断与上下文压缩。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：SubAgent 和主 Agent 怎么传上下文？ · 对抗验证失败怎么办？</div>
</div>

"EvoAgent 不是裸 while 循环让 LLM 自由发挥，而是 **ReAct 内核 + 四阶段 SOP**：

1. **探索**——理解任务、读记忆 L1/L2、决定要不要拆 SubAgent
2. **规划**——列出步骤和工具链，写入 working memory
3. **执行**——ReAct 调工具；重操作（大批量代码、长网页抓取）交给 SubAgent，主上下文只收摘要
4. **验证**——独立 SubAgent 对抗性审查：结论是否被工具输出支撑、有无跳步

**异常处理**五类：空响应连续 3 次退出、tool JSON 格式错误 retry 后降级、工具超时把错误注回 messages、同参同工具循环检测、max_turns + Token 预算熔断。

**上下文压缩**单独一层：老消息的思考链和 tool output 首尾截断，超窗删最早消息，早期对话折成单行摘要——长任务不靠无限堆 history。

这和纯 ReAct 的区别是：**阶段边界 + 验证关 + SubAgent 分工**，减少'一路狂奔到最后才发现错了'。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q32">

<h2 class="question-title"><span class="q-badge">Q32</span><span class="question-text">EvoAgent 的工具体系怎么设计？工具描述怎么写 LLM 才用对？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 考察点：工具体系与 Schema 设计</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：≤10 个最少充分工具；Schema 写何时用/不用、参数范围、嵌入示例用法。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么加 search 工具？ · 工具太多怎么选？</div>
</div>

"EvoAgent 遵循 **最少充分工具集**——核心原子工具控制在 10 个以内，复杂能力通过 code_run 或 SubAgent 组合出来。

**我在 EvoAgent 里落地的工具族**：

- `file_read` / `file_write` / `file_patch`：工作区文件操作，patch 要求 old_content 唯一匹配
- `code_run`：沙箱子进程执行，带 timeout 和安全头
- `web_scan` / `web_execute_js`：浏览器/CDP 交互
- `search`：外部检索（RAG 或 web）
- `ask_user` / `human_confirmation`：人机协作与高风险确认
- `memory_query` / `memory_update` / `skill_save`：读写 L0-L4 记忆，**任务成功后沉淀技能**
- `spawn_subagent`：委托子任务，Conductor 分配 SubagentPool

**Schema 写法三原则**：写清何时用/何时不用；参数给范围和默认值；description 里嵌一个真实调用示例。负面约束（'不要用 code_run 读文件'）和正面示例同样重要。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q33">

<h2 class="question-title"><span class="q-badge">Q33</span><span class="question-text">EvoAgent 的 L0-L4 记忆系统怎么设计？任务后如何自动沉淀技能？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 考察点：记忆系统分层设计</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：L0-L4 分层；Agent 记忆是精准定位不是大海捞针，Token 成本和可解释性优于向量库。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：百万级文档还用分层吗？ · L1 索引怎么维护？</div>
</div>

"这是 **EvoAgent 的核心差异化**，我在项目里完整实现了 L0-L4：

**L0 元规则**——记忆怎么创建、更新、淘汰的'宪法'，只追加不删除。

**L1 极简索引（<50 行）**——场景关键词 → L2/L3 文件路径。每次任务先读 L1，Token 成本极低。

**L2 结构化事实**——经工具验证的环境事实，按领域分文件，标注验证时间。

**L3 可执行技能**——SOP + 可选脚本。Agent 任务成功后通过 `skill_save` / memory_update **自动提炼**已验证路径，下次同类任务 L1 直达 L3，不再从零摸索——这就是'自我进化'。

**L4 对话归档**——早期对话压缩成摘要行，配合上下文压缩模块控制 Token。

**为什么不用向量库做 Agent 记忆**：Agent 记忆是精准定位（'上次成功的 API 调用方式'），不是百万文档语义搜索。分层文件可追溯、可编辑、可 diff；向量检索黑盒且贵。

和 Hermes 的 Skill 结晶类似，但 EvoAgent 更强调 **只记经 SubAgent 验证过的事实**，宁可少记不误记。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q34">

<h2 class="question-title"><span class="q-badge">Q34</span><span class="question-text">EvoAgent 的 Conductor 怎么实现多 Agent 编排和多端推送（WebSocket/SSE）？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 考察点：多端事件总线升级</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Redis/Kafka 管道+协议适配器+前端 SDK；协议无关、离线重放、双向命令通道。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：SSE vs WebSocket 选型？ · ask_user 移动端怎么交互？</div>
</div>

"EvoAgent 用 **Conductor 指挥中心** 替代单进程 display_queue，我在 FastAPI + WebSocket 上实现了：

**inbox 事件队列**——主 Agent、SubAgent、前端都往 inbox 投递事件（tool_start、chunk、done、verify_fail）。单一写入点，便于审计。

**SubagentPool**——按任务类型 spawn SubAgent，池化复用，执行完回收。主 Agent 只收 SubAgent 的结构化摘要，不被长 tool output 撑爆上下文。

**输出监控 + key_info 注入**——Conductor 可运行时往 SubAgent 注入 key_info（'用户改需求了''优先用方案 B'），不用重启整条链路。

**多端协议**：Web 走 WebSocket 双向（下行流式 chunk + 上行 ask_user 确认）；RAG 问答走 **SSE** 只读流式。核心层只发 inbox 事件，协议适配在 Conductor 边缘——事件总线与前端解耦，换 React 页面或 CLI 不用动执行引擎。

离线/移动端若要上线，我会把 inbox 持久化到 Redis，SDK 按 session_id 消费位点重放——这是 Q34 里设计的自然延伸。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q35">

<h2 class="question-title"><span class="q-badge">Q35</span><span class="question-text">EvoAgent 在生产环境怎么防做错、停不下来、花太多钱？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 考察点：生产安全三怕</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：怕做错/停不下来/花太多钱；改进 pre-flight、动态 max_turns、per-session Token budget、审计日志。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：审计日志存多久？ · 动态阈值怎么估复杂度？</div>
</div>

"Agent 生产三怕：**做错、停不下来、花太多钱**。EvoAgent 里的应对：

**防做错**：code_run 子进程 + 工作区沙箱；file_patch 唯一匹配；**对抗验证 SubAgent** 在交付前强制审查；高风险操作用 human_confirmation 预演。不足是还没做 pre-flight 批量删除预演——在 backlog。

**防停不下来**：max_turns + 同工具循环检测 + 空响应熔断；SubAgent 单独计时，避免主 Agent 被拖死。计划按任务复杂度动态调 max_turns。

**防花太多钱**：上下文压缩（截断思考链、折叠早期对话）+ MixinSession 故障切换避免反复 retry 烧钱；下一步加 per-session Token budget，超预算 ask_user。

**审计**：inbox 事件 append-only 日志——每次 tool call、每次验证结论可回溯。MixinSession 切换 Provider 也记日志，方便排查'为什么这次回答风格变了'。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q14">

<h2 class="question-title"><span class="q-badge">Q14</span><span class="question-text">如果你要给 Agent 设计第 10 个工具，你会增加什么？为什么？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 考察点：Agent 工具扩展设计</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：加 human_confirmation：风险分级、预演展示、超时默认拒绝，解决生产信任问题。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和 ask_user 区别？ · critical 操作怎么定义？</div>
</div>

"我会在 **EvoAgent** 里加 **human_confirmation** 工具——高风险操作前强制暂停并请求人类确认。

和 ask_user 的区别：ask_user 是开放式提问；human_confirmation 是结构化确认，带风险分级和预演。

1. **风险分级**：low/medium/high/critical，critical 自动触发确认
2. **预演展示**：'即将删除 temp 下 3 个文件：…'
3. **超时默认拒绝**，安全性优先
4. **可选记忆**：某类操作 10 分钟内不再询问

Agent 从 Demo 走向生产，最大障碍是信任。EvoAgent 通过 Conductor WebSocket 上行收确认，状态机：等待 → 超时拒绝 / 确认 → 执行。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q15">

<h2 class="question-title"><span class="q-badge">Q15</span><span class="question-text">你的 code_run 工具允许 Agent 执行任意 Python 代码。你怎么防止 Agent 执行危险操作？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 考察点：code_run 安全</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：现有子进程+超时+安全头；扩展 AST 静态分析、文件沙箱、执行回滚三层。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：chroot vs 容器？ · 怎么防 prompt injection 诱导删文件？</div>
</div>

"**EvoAgent** 的 code_run 已有子进程隔离、60s 超时、工作区安全头。我还设计了三层扩展：

**AST 静态分析**：执行前检查 os.system、subprocess 等危险调用，按风险允许/警告/阻断。

**文件系统沙箱**：cwd 限定 workspace，计划容器级隔离。

**执行回滚**：文件类操作前快照，异常可回滚。

原则：不是禁止危险操作，而是**做错了能止损**。SubAgent 跑 code_run、主 Agent 只收摘要，进一步缩小爆炸半径。"


---
</div>
</details>

</div>
