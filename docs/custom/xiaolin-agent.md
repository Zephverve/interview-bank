---
custom: true
partTitle: 小林 · Agent 面试题
partColor: #8b5cf6
---

<div class="part-hero custom-hero" style="--part-color: #8b5cf6">

# 🤖 小林 · Agent 面试题

<p class="part-desc">Agent 概念 · 范式 · 记忆 · Multi-Agent · 共 15 题</p>
<span class="part-round custom-tag">我的题库</span>

</div>

<div class="custom-hint">

📝 **本分类源文件**：`custom/xiaolin-agent/` · 新增题目后运行 `npm run prepare` 即可刷新。

</div>

<div class="question-card custom-card compact-card" id="components">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">Agent 的基本架构由哪些核心组件构成？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：Agent, 小林笔记 · 考察点：Agent 的基本架构由哪些核心组件构成？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：我理解 Agent 的基本架构有四个核心组件：LLM、工具、记忆、规划模块</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

我理解 Agent 的基本架构有四个核心组件：LLM、工具、记忆、规划模块。

LLM 是整个系统的大脑，负责理解任务和做决策；工具让 Agent 能跟外部世界交互，搜索、执行代码、调 API 都靠它；记忆让 Agent 在任务执行过程中保持状态，不会「失忆」；规划模块负责把复杂目标拆解成可执行的步骤。

这四个组合在一起，才让 Agent 具备了自主完成任务的能力。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="handcode">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">在工程实践中，为什么有时候选择「手搓」Agent，而不是直接用成熟框架？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：Agent, 小林笔记 · 考察点：在工程实践中，为什么有时候选择「手搓」Agent，而不是直接</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：我的感受是框架用起来快，但有几个实际痛点</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

我的感受是框架用起来快，但有几个实际痛点。

第一是抽象层太多，调试的时候不知道哪步出了问题，得一层层往下扒；第二是版本升级经常有破坏性变更，线上稳定性难保证；第三是框架的通用设计往往和具体业务需求有偏差，定制起来反而更费劲。

手搓的代码完全在自己掌控之内，可观测性好、出问题好排查，也更方便做性能优化。所以我现在的策略是核心逻辑手写，只在边缘功能上用框架的工具。

面试答这道题有几个要点要拿到。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="memcompress">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">Agent 记忆压缩通常有哪些方法？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：Agent, 小林笔记 · 考察点：Agent 记忆压缩通常有哪些方法？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：记忆压缩常见有四种方法：摘要压缩、滑动窗口、重要性过滤、结构化抽取</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

记忆压缩常见有四种方法：摘要压缩、滑动窗口、重要性过滤、结构化抽取。

摘要压缩是把长对话总结成简短摘要；滑动窗口是只保留最近 N 轮对话；重要性过滤是打分筛选，只留重要内容；结构化抽取是把关键信息抽成结构化数据存起来。

我在实际项目里最常用的是摘要压缩和滑动窗口，而且经常组合用，滑动窗口丢弃前先做一次摘要，尽量不丢重要信息。

这道题的坑在于，很多人只知道滑动窗口，回答到这里就停了。面试官想考的是你对「压缩」这件事有没有完整的认识。

回答时要覆盖四种方法，并且能说清楚它们解决的是不同维度的问题：滑动窗口和摘要压缩解决「历史太长怎么截」，前者直接硬截，后者截之前先提炼；重要性过滤解决「内容不等价怎么挑」，打破时间顺序按价值保留；结构化抽取解决「对话文本是不是最佳载体」，换一种信息密度更高的形式存储。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="memory">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">请你介绍一下 AI Agent 的记忆机制，并说明在实际开发中应该如何设计记忆模块？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：Agent, 小林笔记 · 考察点：请你介绍一下 AI Agent 的记忆机制，并说明在实际开发</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Agent 需要记忆才能在多步任务中保持状态、跨任务积累知识</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

Agent 需要记忆才能在多步任务中保持状态、跨任务积累知识。

记忆机制分四层：感知记忆（当前输入的原始内容）、短期记忆（context window 里的对话历史）、长期记忆（存在外部数据库、语义检索召回）、实体记忆（结构化提取的关键事实）。

实际设计时要解决三个核心问题：存什么、怎么存、什么时候取出来用，根据信息类型选合适的存储方式，再搭配主动检索和按需检索两种策略使用。

回答 Agent 记忆机制这道题，先把四层分类说清楚：感知记忆是当次调用的原始输入，最短暂；短期记忆是 context window 里的 messages，维持任务状态；长期记忆是存在向量或关系数据库里、跨任务持久化的内容；实体记忆是从对话中提炼出来的结构化事实，信息密度最高。

说完分类，再答三个工程核心问题：存什么（只存对下次任务有价值的内容，过滤噪音）、怎么存（语义内容用向量数据库，结构化偏好用关系数据库，混合存储是主流）、什么时候取（任务开始前主动检索加载背景，执行中按需检索特定知识）。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="memory_storage">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">Agent 的长短期记忆系统怎么做的？记忆是怎么存的？粒度是多少？怎么用的？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：Agent, 小林笔记 · 考察点：Agent 的长短期记忆系统怎么做的？记忆是怎么存的？粒度是</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：短期记忆就是 context window 里的对话历史，存当前任务的中间状态，任务结束就清掉；长期记忆用向量数据库存，把信息 embedding 后写入，用的时候做语义检索拿回来注入 prompt</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

我理解记忆系统分两层。

短期记忆就是 context window 里的对话历史，存当前任务的中间状态，任务结束就清掉；长期记忆用向量数据库存，把信息 embedding 后写入，用的时候做语义检索拿回来注入 prompt。

粒度上我通常按「一次完整交互」或「一个关键事件」为单位存，太细碎检索噪音大，太粗糙又丢失细节，这个需要根据业务实际调整。

这道题最容易踩的雷有三个，对照开头的对话回想一下。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="multiagent">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">什么是 Multi-Agent？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：Agent, 小林笔记 · 考察点：什么是 Multi-Agent？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：多智能体系统（Multi-Agent）就是多个 Agent 协作完成任务，每个 Agent 各有分工，有的负责搜索、有的负责写代码、有的负责做评审</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

多智能体系统（Multi-Agent）就是多个 Agent 协作完成任务，每个 Agent 各有分工，有的负责搜索、有的负责写代码、有的负责做评审。

我理解单个 Agent 主要受两个限制：一是 context 窗口大小，复杂任务信息量一多就撑爆了；二是单点能力，什么都让一个 Agent 做，每件事都是泛才。

Multi-Agent 通过专业分工和并行执行，能处理更复杂、更长流程的任务，这是我在实际项目里选择多智能体方案的核心原因。

这道题的核心在于能不能说清楚「为什么需要 Multi-Agent」，而不是泛泛地说「多个 AI 一起工作效率更高」。

面试官最想听到的是两个具体的技术驱动因素：第一是 context window 的硬上限，单个 Agent 处理复杂任务时信息量一旦超出窗口，就开始「遗忘」，这是结构性的限制，不是努力优化能绕过去的；第二是专业度问题，让一个 Agent 身兼数职，每件事都做得不够专注，分工之后每个 Agent 的 context 是干净的，只装自己那块的信息，专业能力也更强。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="patterns">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什么？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：Agent, 小林笔记 · 考察点：了解哪些其他的 Agent 设计范式？Agent 和 Wor</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：我理解 Agent 和 Workflow 最核心的区别是「谁来决定下一步」</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

我理解 Agent 和 Workflow 最核心的区别是「谁来决定下一步」。Workflow 是我提前把流程写死的，每一步怎么走都是固定的，确定性高、好控制；Agent 是让 LLM 自己决定下一步做什么，灵活但不可控。

常见的设计范式除了纯 Agent 之外，还有 ReAct、Plan-and-Execute、Reflection 这几种。

我在实际工程里用得最多的反而是把两者混用，固定流程的部分用 Workflow，需要灵活决策的节点嵌入 Agent 能力，这样既保住了整体可控，又有局部的灵活性。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="planning">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">如何赋予 LLM 规划能力？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：Agent, 小林笔记 · 考察点：如何赋予 LLM 规划能力？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：给 LLM 加规划能力主要靠这几种思路</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

给 LLM 加规划能力主要靠这几种思路。

- CoT 是让 LLM 把推理步骤写出来，线性地一步步推导到答案；

- ToT 是让它同时探索多条推理路径，选最优的继续深入；

- GoT 是图结构推理，推理节点可以复用和合并，适合更复杂的任务。

工程上我用 CoT 最多，因为实现成本最低，就是改个 prompt；ToT 效果更好但调用次数多，成本大概是 3 到 5 倍；GoT 目前还比较学术，生产环境我没见过有人真正落地用的。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="react">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">Agent 推理模式有哪些？ReAct 是啥？具体是怎么实现的？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：Agent, 小林笔记 · 考察点：Agent 推理模式有哪些？ReAct 是啥？具体是怎么实现</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Agent 的推理模式我用过几种</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

Agent 的推理模式我用过几种。

最基础的是直接输出答案，没有中间推理；CoT 是让 LLM 先把推理过程写出来再给答案，准确率更高；ReAct 是在 CoT 基础上加了「行动」，让 LLM 交替输出思考和工具调用，每次行动后再根据结果继续思考，形成一个循环。

我觉得 ReAct 是目前 Agent 用得最广的模式，因为它推理过程可见，又能动态利用外部工具，两个优点都有。

回答 ReAct 相关问题，最容易踩的坑就是开头说的那个误区：以为模型自己在「循环」。

面试官最想听到的核心点是两个：第一，ReAct 的本质是「思考 -> 行动 -> 观察」的循环，推理过程显式化，又能动态调用外部工具，解决了 CoT 只能纯文字推理的局限；第二，这个循环是由你的代码框架驱动的，模型每次只输出 Thought + Action，你的代码负责解析、执行工具、把 Observation 填回历史，再把完整历史传给模型进入下一轮。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="reflection">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">讲讲 Agent 的反思机制？为什么要用反思？具体怎么实现？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：Agent, 小林笔记 · 考察点：讲讲 Agent 的反思机制？为什么要用反思？具体怎么实现？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：反思机制我的理解是：让 Agent 在完成一个步骤或整个任务后，自我评估输出质量，判断有没有问题，不达标就重试或调整策略</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

反思机制我的理解是：让 Agent 在完成一个步骤或整个任务后，自我评估输出质量，判断有没有问题，不达标就重试或调整策略。

用反思的原因是 LLM 第一次输出不一定是最优的，加一轮自我检查能显著提升质量，相当于人写完东西自己再看一遍。

代价是多至少一次 LLM 调用，token 消耗和延迟都会增加，所以我在工程里通常只在质量要求高的关键节点启用反思，不是每步都做。

答好这道题有几个要点。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="single_multi">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">说说 Single-Agent 和 Multi-Agent 的设计方案？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：Agent, 小林笔记 · 考察点：说说 Single-Agent 和 Multi-Agent</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Single-Agent 适合任务流程清晰、复杂度适中的场景，实现简单、好维护；Multi-Agent 适合需要专业分工、任务量大或者需要并行执行的复杂场景</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

Single-Agent 适合任务流程清晰、复杂度适中的场景，实现简单、好维护；Multi-Agent 适合需要专业分工、任务量大或者需要并行执行的复杂场景。

Multi-Agent 架构上主要有两种拓扑：中心化的 Orchestrator 模式，由一个主 Agent 统一调度各个 Worker；去中心化的 Peer-to-Peer 模式，Agent 之间直接通信。

我在工程里用中心化用得更多，因为好控制、好调试，出问题链路清晰。

这道题最容易犯的错误有三个，对应开头对话里踩的三个雷。

第一，选型标准不能只说「任务复杂就用 Multi-Agent」，要说出具体的三类场景：context 要撑爆了、需要不同专业分工、有子任务可以并行，不属于这三类就用 Single-Agent，盲目引入 Multi-Agent 只会增加系统复杂度，带不来对应收益。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="tasksplit">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">复杂任务怎么做的任务拆分？为什么要拆分？效果如何提升？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：Agent, 小林笔记 · 考察点：复杂任务怎么做的任务拆分？为什么要拆分？效果如何提升？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：我理解任务拆分的原因是 LLM 一次性处理太复杂的任务很容易出错，把大任务拆成小步骤，每步聚焦一件事，准确率会明显提升</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

我理解任务拆分的原因是 LLM 一次性处理太复杂的任务很容易出错，把大任务拆成小步骤，每步聚焦一件事，准确率会明显提升。

拆分方式主要有两种：一种是静态拆分，提前把步骤写死；另一种是动态拆分，让 LLM 自己根据目标规划步骤，更灵活但也更难控制。

拆完之后步骤之间可能有依赖关系，我的经验是把能并行的步骤并发跑，端到端延迟可以降很多，有时能降 40% 到 60%。

回答任务拆分这道题，要答出三个层次才完整。

第一层是「为什么拆」：LLM 的 context window 有上限，任务越大中间状态越多、越容易出错，而且拆开后每步可以独立验证和重试。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="three_patterns">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">ReAct、Plan-and-Execute、Reflection 三种范式有什么核心区别？实际项目中该如何选型？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：Agent, 小林笔记 · 考察点：ReAct、Plan-and-Execute、Reflect</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：我理解这三者是 Agent 开发里最主流的三种设计范式，核心区别在于「决策和执行的关系」</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

我理解这三者是 Agent 开发里最主流的三种设计范式，核心区别在于「决策和执行的关系」。

ReAct 是边想边干，走一步看一步，单步迭代实时调整，灵活度最高；Plan-and-Execute 是先想全再干，先定完整计划再分步执行，适合长流程复杂任务，不容易跑偏；Reflection 不是独立的完整流程，而是给前两者加的「检查修正 buff」，用来提升输出质量。

实际选型就看三个维度：任务复杂度、流程确定性、输出质量要求，新手入门首选 ReAct，复杂任务用 Plan-and-Execute，高要求场景再加 Reflection。

回答这道题最关键的一步，是先把 Reflection 的定位说清楚：它不是一套独立流程，而是可以叠加在 ReAct 或 Plan-and-Execute 之上的「质量增强 buff」，这一点很多人会搞错。

说完定位，再按维度对比三者的核心区别：ReAct 边想边干、灵活度最高但长任务容易跑偏；Plan-and-Execute 先规划再执行、结构清晰但灵活度不足；Reflection 专门解决输出质量问题，代价是增加 token 消耗和延迟。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="whatisagent">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">什么是 Agent？与大模型有什么本质不同？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：Agent, 小林笔记 · 考察点：什么是 Agent？与大模型有什么本质不同？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：我理解 Agent 本质上是一个能自主完成目标的 AI 系统，跟传统 AI 最核心的区别在于「自主性」和「能行动」</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

Agent 是能自主完成目标的 AI 系统，和单次 LLM 调用的本质区别是三点：**自主规划、能行动、闭环执行**。

普通 LLM 被动问答、知识冻结、不能操作外部环境；Agent 会把复杂目标拆成多步，通过 Tool 与记忆跟世界交互，每步结果反馈指导下一步。要记住：模型只负责决策，工具由代码执行。

面试常见误区是把它说成「大模型加插件」——工具调用只是能力之一，核心是自主决策和多步闭环。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="workflow_tools">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">Workflow，Agent，Tools 这三个的概念和区别介绍一下？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：Agent, 小林笔记 · 考察点：Workflow，Agent，Tools 这三个的概念和区别</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：我理解这三个概念是粒度从小到大的三层结构</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

我理解这三个概念是粒度从小到大的三层结构。

Tools 是最小的能力单元，就是封装好的可调用函数，比如搜索、执行代码、发邮件，它只负责「执行」，本身没有任何决策能力。

Agent 是一个完整的决策系统，内部用 LLM 做大脑，自己判断什么时候调哪个 Tool、要不要继续、什么时候结束，是主动的。

Workflow 是更上层的编排框架，把 Agent、LLM、Tools 组织成一条确定性流程，每个节点做什么、按什么顺序流转都是开发者事先写死的。

三者最核心的区别就一句话：Tools 不做决策只执行，Agent 自己做决策，Workflow 是开发者替所有节点把决策提前写好。
</div>
</details>

</div>
