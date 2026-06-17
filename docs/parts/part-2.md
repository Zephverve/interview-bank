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



<div class="question-card" id="q3">

<h2 class="question-title"><span class="q-badge">Q3</span> Agent 架构</h2>

<div class="question-prompt"><strong>题目</strong>：ReAct 和 LangGraph 的 StateGraph 编排有什么区别？什么场景用 ReAct 更好，什么场景用 LangGraph 更好？</div>


<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 考察点：ReAct vs LangGraph 控制权差异</div>


<div class="q-conclusion">

💡 **15 秒结论**：ReAct 让 LLM 决策下一步；LangGraph 开发者预定义流程。RAG 用 LangGraph，开放任务用 ReAct，可混合。

</div>



<div class="q-followups">

🔁 **追问方向**：tool call 格式错误怎么处理？ · StateGraph 几个节点？ · 校验失败重试几次？

</div>


<details class="answer-reveal">
<summary>展开完整回答</summary>

<div class="answer-body">

"核心区别在于**控制权在谁手里**。ReAct 是 LLM 自主决策——每一轮 LLM 看到当前状态，自己决定下一步调用哪个工具。LangGraph 的 StateGraph 是你作为开发者预定义节点和边，LLM 只在特定节点里做推理。

ReAct 适合开放性任务。比如你跟 Agent 说'帮我查一下这个问题的相关论文，汇总成报告发给我'，你不知道 Agent 需要查几次、搜什么关键词、中间会不会遇到死胡同需要换方案——这些 LLM 自己探索更灵活。

LangGraph 适合流程确定的任务。比如我做科研问答的那个 RAG pipeline——查询改写→检索→重排→引用校验——每一步的顺序和逻辑是确定的，不需要 LLM 来'决策'下一步做什么。用 StateGraph 的好处是每一步都可审计、可调试、可以单独优化。

我的项目里其实两种都用到了。RAG 的检索流程用 LangGraph 编排，原因是流程确定且需要引用校验这种条件分支（校验失败→改写 query 重试）。但我也分析了 GenericAgent 的 ReAct 循环，那种场景下任务类型千变万化，不可能预定义所有流程，ReAct 更合适。

理论上两者可以混合——比如在 LangGraph 的某个节点里嵌入一个 ReAct Agent，让它自主完成一个子任务。这其实是大厂 Agent 平台常见的做法，外层用工作流约束主流程，内层用 ReAct 处理不确定性。"

**追问**：如果在 LangGraph 的某个节点里 LLM 返回了错误格式的 tool call，你怎么处理？

"我实际遇到过这个问题。LangGraph 里调用 LLM 用的是 with_structured_output 或者自己 parse JSON，一旦 LLM 返回格式不对就会抛异常。我的处理是三层：第一层加 retry——把错误信息和原始 prompt 一起重新发给 LLM，让它修正格式，通常 1-2 次就能对；第二层降级——如果 retry 失败，把 tool call 降级为普通的文本生成，跳过工具执行直接进入下一个节点；第三层人工介入——如果降级也失败，触发 ask_user 让用户决定下一步。这个设计思路其实是从 GenericAgent 的 no_tool 机制学来的——当 LLM 的行为不符合预期时，引擎需要有兜底逻辑。"

</div>
</details>

</div>

---

<div class="question-card" id="q4">

<h2 class="question-title"><span class="q-badge">Q4</span> Function Calling</h2>

<div class="question-prompt"><strong>题目</strong>：Native Function Calling 和把工具描述拼在 system prompt 里，对模型行为有什么本质影响？</div>


<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 考察点：Native FC vs 文本协议</div>


<div class="q-conclusion">

💡 **15 秒结论**：Native 是结构化约束，参数更准、支持 parallel calls；文本协议靠阅读理解，易编造参数。

</div>



<div class="q-followups">

🔁 **追问方向**：不支持 FC 的模型怎么降级？ · Mixin 故障转移怎么做的？

</div>


<details class="answer-reveal">
<summary>展开完整回答</summary>

<div class="answer-body">

"本质区别是**结构化 vs 阅读理解**。

Native Function Calling 把工具定义以 JSON Schema 格式放在 API 的 tools 字段里，模型在训练阶段被专门优化过这种格式——它知道这个字段里的内容是'我可以调用的函数'，参数名、类型、是否必填都是结构化的约束。所以它的参数提取准确率高，不太会编造不存在的工具名。

文本协议是把工具描述拼在 system prompt 里，比如'你可以使用以下工具：file_read(path, start, count)'——这本质上依赖模型的阅读理解能力。模型需要从自然语言里推断工具名、参数和调用格式。问题在于，模型可能会'读出'不存在的参数，或者把一个工具的用法套到另一个工具上。

我在分析 GenericAgent 的 llmcore.py 时看到了一个很好的例子：代码里区分了 NativeClaudeSession 和 ClaudeSession 两种模式。Native 模式走 API 的 tools 字段，非 Native 模式把 tool schema 塞进 system prompt。作者在注释里写了——对于被 API tool 字段 overtrain 的模型（比如 Claude Opus/Sonnet），非 Native 模式的效果会很明显地打折。

一个具体的差异是 parallel tool calls。Native 模式下 LLM 可以一次返回多个 tool call——比如同时读两个文件。文本协议下很难实现这一点，因为你需要定义复杂的文本格式来区分'多个调用'和'一个调用里的多行参数'。

如果一个模型不支持 Native Function Calling，我的降级方案是：用严格定义的 Markdown 格式作为工具调用协议，比如用代码块标记工具名和 JSON 参数，然后加一个 parser 来做格式校验和错误恢复。"

</div>
</details>

</div>

---

<div class="question-card" id="q31">

<h2 class="question-title"><span class="q-badge">Q31</span> GenericAgent 深度设计 — 你怎么设计 ReAct 循环</h2>

<div class="question-prompt"><strong>题目</strong>：如果让你从零设计一个 Agent 的 ReAct 执行循环，你会怎么设计？考虑哪些异常情况？</div>


<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 考察点：ReAct 循环从零设计</div>


<div class="q-conclusion">

💡 **15 秒结论**：带熔断的 while 循环；五类异常：空响应、格式错误、工具超时、循环检测、Token 预算；每轮 checkpoint。

</div>



<div class="q-followups">

🔁 **追问方向**：max_turns 设多少？ · checkpoint 存什么？

</div>


<details class="answer-reveal">
<summary>展开完整回答</summary>

<div class="answer-body">

"我会设计一个带安全熔断和状态管理的 ReAct 循环。

**核心循环结构**：

```
messages = [system_prompt, user_input]
while turn < max_turns:
    response = llm.chat(messages, tools)
    if no tool calls:
        if 连续空响应 >= 3: break
        if 任务完成声明: 验证 → break or continue
    for each tool_call:
        outcome = handler.dispatch(tool_name, args)
        if outcome.应该退出: break
    messages.append(tool_results)
    turn++
```

**五个异常处理**：

1. **LLM 无响应**——连续 3 次空响应就退出，而不是无限重试。成本控制。

2. **格式错误**——LLM 返回的 tool call JSON 格式不对。解析失败时把错误信息注回 messages，让 LLM 自己修正。2 次修正不成功则降级为文本生成。

3. **工具执行超时/异常**——每个工具有独立的 timeout。异常不崩溃整个循环，而是把错误信息作为 tool_result 返回给 LLM，让它决定：重试？换策略？求助用户？

4. **循环检测**——如果 LLM 连续 3 轮调用同一个工具且参数相同、结果相同，说明陷入循环。注入一个'你似乎陷入了重复操作，请换一个策略'的提示。

5. **安全熔断**——max_turns 硬上限（比如 80）、每 N 轮警告、Token 累计消耗上限。三条线保护成本和稳定性。

**状态管理**：每轮结束保存 checkpoint——当前 turn 数、messages 摘要、working memory。如果 Agent 在执行一个长任务的过程中崩溃，重启后能从 checkpoint 恢复而不是从头开始。这是实验室环境和生产环境的本质区别。"

</div>
</details>

</div>

---

<div class="question-card" id="q32">

<h2 class="question-title"><span class="q-badge">Q32</span> GenericAgent 深度设计 — 你怎么设计工具体系</h2>

<div class="question-prompt"><strong>题目</strong>：如果你要给自己的 Agent 设计工具体系，你会限定多少工具？工具的描述怎么写才能让 LLM 用对？</div>


<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 考察点：工具体系与 Schema 设计</div>


<div class="q-conclusion">

💡 **15 秒结论**：≤10 个最少充分工具；Schema 写何时用/不用、参数范围、嵌入示例用法。

</div>



<div class="q-followups">

🔁 **追问方向**：为什么加 search 工具？ · 工具太多怎么选？

</div>


<details class="answer-reveal">
<summary>展开完整回答</summary>

<div class="answer-body">

"我会参考 GenericAgent 的'最少充分工具集'原则——不超过 10 个，但保证组合能覆盖所有场景。

**选这 10 个的原因**：

- `code_run`：能力扩展入口。通过它可以动态安装包、调 API、处理数据
- `file_read` / `file_write` / `file_patch`：文件操作三件套
- `web_scan` / `web_execute_js`：网页交互
- `ask_user`：人机协作
- `search`：外部信息检索（GenericAgent 没有这个，但我觉得 Agent 需要）
- `memory_query` / `memory_update`：记忆的读写封装

**工具 Schema 怎么写**——这是我的核心观点。

第一，描述要写'什么时候用、什么时候不用'，而不只是'做什么'。比如 code_run 的描述里要加：'当你需要计算、数据处理、API 调用时用；当只是要读取文件内容时不要用——用 file_read。' 这种负面用例的约束是防止 LLM 滥用工具的关键。

第二，参数里要写'取值范围和默认值'，而不是只写类型。比如 timeout 不写 'type: integer'，而是 'timeout: 超时秒数，范围 1-300，默认 60。简单操作用 10，复杂计算用 120'。

第三，每个工具的 description 里要嵌入一个示例用法。比如 file_patch 的描述里的示例：'把文件中 "print(hello)" 替换为 "print(world)"。注意：old_content 必须足够长以确保在文件中唯一匹配。' 这个示例比任何抽象描述都有效——LLM 能学会这种模式。"

</div>
</details>

</div>

---

<div class="question-card" id="q33">

<h2 class="question-title"><span class="q-badge">Q33</span> GenericAgent 深度设计 — 你怎么做记忆系统</h2>

<div class="question-prompt"><strong>题目</strong>：从零设计一个 Agent 的记忆系统，你会怎么分层？为什么不用向量数据库？</div>


<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 考察点：记忆系统分层设计</div>


<div class="q-conclusion">

💡 **15 秒结论**：L0-L4 分层；Agent 记忆是精准定位不是大海捞针，Token 成本和可解释性优于向量库。

</div>



<div class="q-followups">

🔁 **追问方向**：百万级文档还用分层吗？ · L1 索引怎么维护？

</div>


<details class="answer-reveal">
<summary>展开完整回答</summary>

<div class="answer-body">

"我会设计四层，和 GenericAgent 的 L0-L4 思路一致但有一些扩展。

**L0 · 元规则**：定义记忆怎么被创建、更新、检索、淘汰。这是记忆系统的'宪法'——不存数据，只存规则。例如'记忆更新只追加不删除'、'L1 索引每积累 5 条新条目后自动重排序'。

**L1 · 极简索引（< 50 行）**：场景关键词 → 具体记忆文件的映射。这是整个系统的心脏——Agent 每次执行任务时先读 L1，< 50 行的索引让 Token 消耗几乎为零。每行格式像 '股票查询 → L2#finance.md + L3#stock_sop.md'。

**L2 · 结构化事实（文件存储）**：经过验证的环境事实。按领域分文件——debug.md、env.md、user_prefs.md。每个事实标注验证时间和方式。

**L3 · 可执行技能（SOP + 脚本）**：任务执行路径。分两部分——SOP 文件描述'怎么做'，Python 脚本提供'可执行资产'。Agent 通过 code_run 调用脚本。

**L4 · 对话归档**：近期对话摘要，支持跨会话回忆。

**为什么不用向量数据库**——

三个原因。第一，精确匹配优于语义相似。Agent 的任务通常是'调用上次成功的那个 API'——这不是语义搜索，是精确匹配。向量检索返回一堆'语义相似但不精确'的结果，反而不如直接读 L1 索引命中。

第二，Token 成本。向量检索需要把候选片段都塞进 prompt，5 个候选各 1k token 就是 5k token。L1 索引 50 行只有约 500 token——成本差 10 倍。

第三，可解释性。如果 Agent 做错了，你要能追溯——'它读了哪个记忆文件？那个文件里写了什么？'分层文件记忆天然可追溯——去 `memory/L2/env.md` 看就知道了。向量检索是黑盒——你不知道为什么返回了这个片段。

向量检索适合的是'大海捞针'型搜索——在百万级文档中找语义匹配。Agent 记忆是'精准定位'型——你知道要找什么，只是记不清在哪。后者不需要向量检索。"

</div>
</details>

</div>

---

<div class="question-card" id="q34">

<h2 class="question-title"><span class="q-badge">Q34</span> GenericAgent 深度设计 — 多前端解耦</h2>

<div class="question-prompt"><strong>题目</strong>：GenericAgent 用 display_queue 解耦了核心层和前端。如果要你支持 WebSocket 推送、SSE 流式、以及 Android/iOS 移动端，这个事件总线怎么设计？</div>


<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 考察点：多端事件总线升级</div>


<div class="q-conclusion">

💡 **15 秒结论**：Redis/Kafka 管道+协议适配器+前端 SDK；协议无关、离线重放、双向命令通道。

</div>



<div class="q-followups">

🔁 **追问方向**：SSE vs WebSocket 选型？ · ask_user 移动端怎么交互？

</div>


<details class="answer-reveal">
<summary>展开完整回答</summary>

<div class="answer-body">

"display_queue 的思想是通用的，但 Python Queue 只适用于单进程。要支持多端、多协议、跨设备，需要升级。

**我会设计一个三层事件分发架构**：

**底层是消息管道**：Redis Pub/Sub 或 Kafka topic。Agent 执行引擎产出事件（next chunk、done、error、ask_user 中断），发布到对应用户的 channel。这是唯一的写入点。

**中层是协议适配器**：每种前端协议一个适配器。WebSocket 适配器订阅 Redis channel，收到 next 事件就推送给前端；SSE 适配器把事件格式化为 `data: {json}\n\n`；移动端适配器走 Firebase Cloud Messaging 或 APNs。

**上层是前端 SDK**：Web 端、iOS、Android 各一个轻量 SDK，封装连接管理、重连、心跳。SDK 对上层暴露一个简单的 `onMessage(callback)` 接口。

**关键设计决策**：

1. **协议无关**：核心层永远不知道前端用什么协议——它只往管道里发事件。这是我分析 GenericAgent 学到的核心洞察。

2. **离线消息**：如果移动端用户断网了，Agent 还在执行——事件不能丢。消息管道需要支持持久化和离线重放。用户重新上线时，SDK 从上次消费位点继续拉。

3. **双向通道**：display_queue 是单向的（Agent → 前端）。但移动端还需要上行通道——用户发新消息、ask_user 确认、取消任务。这需要一个独立的'命令通道'——WebSocket 的上行帧、HTTP POST、MQTT 都行。

4. **自适应流式**：WebSocket 下每 30 字符推一次很流畅，但移动网络不稳定时可以考虑降低推送频率或者合并推送。适配器层负责做这种自适应。"

</div>
</details>

</div>

---

<div class="question-card" id="q35">

<h2 class="question-title"><span class="q-badge">Q35</span> GenericAgent 深度设计 — 安全与容错</h2>

<div class="question-prompt"><strong>题目</strong>：Agent 在生产环境最怕什么？你从 GenericAgent 的分析中学到了哪些安全设计，有什么不足？</div>


<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 考察点：生产安全三怕</div>


<div class="q-conclusion">

💡 **15 秒结论**：怕做错/停不下来/花太多钱；改进 pre-flight、动态 max_turns、per-session Token budget、审计日志。

</div>



<div class="q-followups">

🔁 **追问方向**：审计日志存多久？ · 动态阈值怎么估复杂度？

</div>


<details class="answer-reveal">
<summary>展开完整回答</summary>

<div class="answer-body">

"Agent 在生产环境最怕三件事：**做错事**、**停不下来**、**花太多钱**。

GenericAgent 对这三个问题都有应对，但都有改进空间。

**防做错事**：code_run 用了子进程隔离，file_patch 要求唯一匹配防止幻觉修改。但不足在于缺少操作前的风险预演——Agent 在删除文件之前没有'如果执行，会删除以下文件...'的预演。我会加一个 pre-flight check，高风险操作先在沙箱试运行，输出预期结果，用户确认后再真正执行。

**防停不下来**：max_turns + 每 N 轮警告 + 空响应计数。但不足在于这些阈值是全局固定的，不分任务复杂度。简单任务 80 轮太多，复杂任务 80 轮不够。我会做一个动态阈值——根据任务描述预估复杂度（比如关键字匹配 '分析/报告/搜索多个'），简单任务 30 轮上限，复杂任务 120 轮。

**防花太多钱**：GenericAgent 没有 Token 预算控制。Agent 可能在长循环中消耗几千元的 API 费用。我会加一个 per-session Token budget——比如单次任务最多 50K token。超过预算时先警告，再超就强制 ask_user 确认是否继续。成本可控是 Agent 从 demo 走向生产的前提。

另外，GenericAgent 有一个我没在代码里看到但我觉得至关重要的设计——**执行日志的不可篡改性**。Agent 的每一次 tool call、每一次 LLM 推理、每一次结果，都应该记录在 append-only 的日志里。不是为了 debug——是为了审计。以后有人问'Agent 为什么发了那封邮件'，你需要能回溯完整路径。"

</div>
</details>

</div>

---

<div class="question-card" id="q14">

<h2 class="question-title"><span class="q-badge">Q14</span> Agent 工具设计</h2>

<div class="question-prompt"><strong>题目</strong>：如果你要给 Agent 设计第 10 个工具，你会增加什么？为什么？</div>


<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 考察点：Agent 工具扩展设计</div>


<div class="q-conclusion">

💡 **15 秒结论**：加 human_confirmation：风险分级、预演展示、超时默认拒绝，解决生产信任问题。

</div>



<div class="q-followups">

🔁 **追问方向**：和 ask_user 区别？ · critical 操作怎么定义？

</div>


<details class="answer-reveal">
<summary>展开完整回答</summary>

<div class="answer-body">

"我会加一个 **human_confirmation** 工具——在 Agent 执行高风险操作前，强制暂停并请求人类确认。

现在 GenericAgent 有 ask_user 工具，但它只是'向用户提问然后等待回答'，不够结构化。human_confirmation 的区别在于：

1. **风险分级**：每个工具调用可以被标注风险等级（low/medium/high/critical），critical 级别的操作自动触发 human_confirmation
2. **预演展示**：在请求确认前，Agent 会展示'如果执行，会发生什么'的预演——比如'即将删除 temp 目录下的 3 个文件：a.txt, b.log, c.tmp'
3. **超时策略**：如果用户在 N 秒内不回应，默认拒绝（而非默认通过），安全性优先
4. **记忆化**：用户可以选择'对这个操作类型，未来 10 分钟内不再询问'

为什么加这个而不是其他更酷的工具？因为 Agent 从'Demo'走向'生产'，最大的障碍不是能力不够，而是**信任不够**。你不敢让 Agent 自己删文件、发邮件、下单——不是做不了，是怕做错。human_confirmation 解决的就是这个信任问题。

实现上不复杂：在 GenericAgentHandler 里加一个 do_human_confirm 方法，配合新的 tool schema，核心逻辑就是一个状态机——等待确认 → 超时 → 拒绝，或者等待确认 → 收到确认 → 执行。"

</div>
</details>

</div>

---

<div class="question-card" id="q15">

<h2 class="question-title"><span class="q-badge">Q15</span> Agent 安全</h2>

<div class="question-prompt"><strong>题目</strong>：你的 code_run 工具允许 Agent 执行任意 Python 代码。你怎么防止 Agent 执行危险操作？</div>


<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 考察点：code_run 安全</div>


<div class="q-conclusion">

💡 **15 秒结论**：现有子进程+超时+安全头；扩展 AST 静态分析、文件沙箱、执行回滚三层。

</div>



<div class="q-followups">

🔁 **追问方向**：chroot vs 容器？ · 怎么防 prompt injection 诱导删文件？

</div>


<details class="answer-reveal">
<summary>展开完整回答</summary>

<div class="answer-body">

"这个问题 GenericAgent 的 code_run 已经做了一些防护，我从分析中学到并可以扩展。

现有的防护：子进程隔离（subprocess 而非 exec）、超时保护（60s）、安全头注入（code_run_header.py 限制文件访问范围）、用户手动中断。

我认为还应该加三层：

**第一层：代码静态分析**。在执行前用 AST 解析检查代码中是否有危险调用——`os.system`、`subprocess.Popen`、`shutil.rmtree`、`__import__`。不是完全禁止，而是根据风险等级决定是允许、警告还是阻断。

**第二层：文件系统沙箱**。在子进程里用 chroot 或者容器限制文件系统访问范围。Agent 只能读写的目录限定在 workspace 内，不能触碰系统文件或个人文件。这个 GenericAgent 的代码里 assets/code_run_header.py 已经在做，但可以更彻底。

**第三层：执行回滚**。对于文件操作类的代码执行，在执行前做文件快照。如果执行结果异常（比如误删了关键文件），可以一键回滚。这个对于让用户敢用 Agent 非常关键。

核心设计原则是：不是'禁止 Agent 做危险的事'，而是'给 Agent 操作的自由，但保证做错了能止损'。类比数据库的事务机制——你可以大胆执行，因为 rollback 是你的安全网。"


---

</div>
</details>

</div>
