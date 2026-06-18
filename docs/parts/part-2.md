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
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 考察点：ReAct vs LangGraph 控制权差异</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：ReAct 让 LLM 决策下一步；LangGraph 开发者预定义流程。RAG 用 LangGraph，开放任务用 ReAct，可混合。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：tool call 格式错误怎么处理？ · StateGraph 几个节点？ · 校验失败重试几次？</div>
</div>

"核心区别是**控制权在谁手里**：ReAct 让 LLM 每轮自主选工具；LangGraph StateGraph 由开发者预定义节点和边，LLM 只在特定节点推理。

**ReAct 适合开放任务**——步骤数、关键词、是否换方案都不确定，如'查论文汇总发报告'。**LangGraph 适合流程确定的任务**——我的 RAG：改写→检索→重排→校验，每步可审计、可单独优化，校验失败可走条件分支重试。

两种可混合：StateGraph 外层约束主流程，某节点内嵌 ReAct 处理不确定子任务——大厂 Agent 平台常见做法。"

**追问**：如果在 LangGraph 的某个节点里 LLM 返回了错误格式的 tool call，你怎么处理？

"三层兜底：**retry** 把错误信息回注 LLM 修正，通常 1–2 次成功；**降级** 跳过工具执行，走纯文本生成进下一节点；**人工介入** 触发 ask_user。思路来自 GenericAgent 的 no_tool 机制——行为不符合预期时引擎必须有兜底。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q4">

<h2 class="question-title"><span class="q-badge">Q4</span><span class="question-text">Native Function Calling 和把工具描述拼在 system prompt 里，对模型行为有什么本质影响？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 考察点：Native FC vs 文本协议</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Native 是结构化约束，参数更准、支持 parallel calls；文本协议靠阅读理解，易编造参数。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：不支持 FC 的模型怎么降级？ · Mixin 故障转移怎么做的？</div>
</div>

"本质是**结构化 vs 阅读理解**。

**Native FC**：工具 schema 放 API tools 字段，参数名/类型/必填是结构化约束，参数提取准，支持 parallel tool calls（如同时读两个文件）。**文本协议**：工具描述拼进 system prompt，靠阅读理解推断格式，易编造参数或张冠李戴。

GenericAgent llmcore.py 里 NativeClaudeSession vs ClaudeSession 就是典型对比——对 overtrain 于 tools 字段的模型，文本协议效果明显打折。

不支持 Native FC 时，降级为**严格 Markdown 代码块协议**（工具名 + JSON 参数）+ parser 校验与错误恢复。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q31">

<h2 class="question-title"><span class="q-badge">Q31</span><span class="question-text">如果让你从零设计一个 Agent 的 ReAct 执行循环，你会怎么设计？考虑哪些异常情况？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 考察点：ReAct 循环从零设计</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：带熔断的 while 循环；五类异常：空响应、格式错误、工具超时、循环检测、Token 预算；每轮 checkpoint。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：max_turns 设多少？ · checkpoint 存什么？</div>
</div>

"设计一个**带熔断和 checkpoint 的 while 循环**：每轮 LLM.chat(messages, tools) → 解析 tool calls → handler.dispatch → 结果 append 回 messages。

**五类异常**：
1. **空响应**：连续 3 次退出，控成本
2. **格式错误**：错误信息回注 LLM 自修正，2 次失败降级文本生成
3. **工具超时/异常**：错误作为 tool_result 返回，让 LLM 决定重试/换策略/ask_user
4. **循环检测**：同工具同参数同结果连续 3 轮，注入换策略提示
5. **安全熔断**：max_turns、轮次警告、Token 累计上限

**每轮 checkpoint**：turn 数、messages 摘要、working memory——崩溃后可恢复，这是实验室 vs 生产的本质差距。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q32">

<h2 class="question-title"><span class="q-badge">Q32</span><span class="question-text">如果你要给自己的 Agent 设计工具体系，你会限定多少工具？工具的描述怎么写才能让 LLM 用对？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 考察点：工具体系与 Schema 设计</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：≤10 个最少充分工具；Schema 写何时用/不用、参数范围、嵌入示例用法。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么加 search 工具？ · 工具太多怎么选？</div>
</div>

"遵循 GenericAgent **'最少充分工具集'**——≤10 个，组合覆盖全场景：code_run（能力扩展）、file 三件套、web 双工具、ask_user、search（GenericAgent 缺但我建议加）、memory 读写。

**Schema 写法三原则**：
1. 写**何时用/不用**，而不只写做什么——如'读文件用 file_read，别用 code_run'
2. 参数写**取值范围和默认值**，不只写 type
3. description 里**嵌入示例用法**——如 file_patch 的 old_content 须唯一匹配，比抽象描述更有效"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q33">

<h2 class="question-title"><span class="q-badge">Q33</span><span class="question-text">从零设计一个 Agent 的记忆系统，你会怎么分层？为什么不用向量数据库？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 考察点：记忆系统分层设计</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：L0-L4 分层；Agent 记忆是精准定位不是大海捞针，Token 成本和可解释性优于向量库。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：百万级文档还用分层吗？ · L1 索引怎么维护？</div>
</div>

"四层设计，对齐 GenericAgent L0-L4：

**L0 元规则**：记忆创建/更新/检索/淘汰的'宪法'。**L1 极简索引**（<50 行）：关键词→记忆文件映射，每次任务先读，Token 消耗极低。**L2 结构化事实**：按领域分文件，标注验证时间。**L3 可执行技能**：SOP + Python 脚本，code_run 调用。**L4 对话归档**：跨会话摘要。

**不用向量库三点**：Agent 记忆是**精准定位**非大海捞针；L1 索引 ~500 token vs 向量候选 5k token，成本差 10 倍；文件记忆**可追溯**——出错能查读了哪个文件，向量检索是黑盒。

向量检索适合百万级文档语义搜索；Agent 记忆知道要找什么，只是记不清在哪。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q34">

<h2 class="question-title"><span class="q-badge">Q34</span><span class="question-text">GenericAgent 用 display_queue 解耦了核心层和前端。如果要你支持 WebSocket 推送、SSE 流式、以及 Android/iOS 移动端，这个事件总线怎么设计？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 考察点：多端事件总线升级</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Redis/Kafka 管道+协议适配器+前端 SDK；协议无关、离线重放、双向命令通道。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：SSE vs WebSocket 选型？ · ask_user 移动端怎么交互？</div>
</div>

"display_queue 思想通用，但 Python Queue 仅单进程。升级三层架构：

**底层消息管道**：Redis Pub/Sub 或 Kafka——Agent 产出 next/done/error/ask_user 事件，唯一写入点。**中层协议适配器**：WebSocket 直推、SSE 格式化为 `data: {json}`、移动端走 FCM/APNs。**上层前端 SDK**：封装连接/重连/心跳，暴露 onMessage。

**四个关键决策**：协议无关（核心不知前端协议）；离线持久化与重放；双向命令通道（ask_user/取消任务）；适配器层自适应流式频率（移动网络合并推送）。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q35">

<h2 class="question-title"><span class="q-badge">Q35</span><span class="question-text">Agent 在生产环境最怕什么？你从 GenericAgent 的分析中学到了哪些安全设计，有什么不足？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 考察点：生产安全三怕</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：怕做错/停不下来/花太多钱；改进 pre-flight、动态 max_turns、per-session Token budget、审计日志。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：审计日志存多久？ · 动态阈值怎么估复杂度？</div>
</div>

"生产最怕三件事：**做错事、停不下来、花太多钱**。

**防做错**：子进程隔离 + file_patch 唯一匹配；不足是缺 pre-flight——删文件前应展示'将删除 a.txt, b.log'预演，高风险操作沙箱试跑后用户确认。**防停不下来**：max_turns + 轮次警告；不足是阈值全局固定——我会按任务复杂度动态设（简单 30 轮、复杂 120 轮）。**防花太多钱**：缺 per-session Token budget——超 50K 先警告再 ask_user 确认。

另外，每次 tool call / LLM 推理应记 **append-only 审计日志**——不为 debug，为回答'Agent 为什么发了那封邮件'。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q14">

<h2 class="question-title"><span class="q-badge">Q14</span><span class="question-text">如果你要给 Agent 设计第 10 个工具，你会增加什么？为什么？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 考察点：Agent 工具扩展设计</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：加 human_confirmation：风险分级、预演展示、超时默认拒绝，解决生产信任问题。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和 ask_user 区别？ · critical 操作怎么定义？</div>
</div>

"加 **human_confirmation**——高风险操作前强制暂停请求确认，比 ask_user 更结构化。

**四点设计**：风险分级（critical 自动触发）；预演展示（'将删除 3 个文件：…'）；超时默认**拒绝**；可选'10 分钟内同类不再询问'。

Agent 从 Demo 到生产，最大障碍是**信任**——不是能力不够，是怕删文件/发邮件做错。实现上在 Handler 加 do_human_confirm 状态机：等待确认→超时拒绝 / 收到确认→执行。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q15">

<h2 class="question-title"><span class="q-badge">Q15</span><span class="question-text">你的 code_run 工具允许 Agent 执行任意 Python 代码。你怎么防止 Agent 执行危险操作？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 考察点：code_run 安全</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：现有子进程+超时+安全头；扩展 AST 静态分析、文件沙箱、执行回滚三层。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：chroot vs 容器？ · 怎么防 prompt injection 诱导删文件？</div>
</div>

"GenericAgent code_run 已有子进程隔离、60s 超时、code_run_header.py 安全头、手动中断。我会再加三层：

**AST 静态分析**：执行前检查 os.system/shutil.rmtree 等，按风险等级允许/警告/阻断。**文件系统沙箱**：chroot/容器限定 workspace，header 已有雏形但可更彻底。**执行回滚**：文件操作前快照，异常一键恢复。

原则不是禁止危险操作，而是**给自由 + 保证止损**——类比数据库事务 rollback。"


---
</div>
</details>

</div>
