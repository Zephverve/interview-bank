---
custom: true
partTitle: 今日面试复盘
partColor: #f97316
---

<div class="part-hero custom-hero" style="--part-color: #f97316">

# 🔥 今日面试复盘

<p class="part-desc">2026-06-17 面试真题 · 共 11 题</p>
<span class="part-round custom-tag">我的题库</span>

</div>

<div class="custom-hint">

📝 **本分类源文件**：`custom/today-interview/` · 新增题目后运行 `npm run prepare` 即可刷新。

</div>

<div class="question-card custom-card" id="agent-code-production">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span> Agent 任意代码执行的生产风险</h2>

<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐⭐ · 标签：Agent, 安全, 生产 · 考察点：敢不敢上生产</div>

<div class="question-prompt"><strong>题目</strong>：Agent 能跑任意代码，安全风险怎么控？生产环境你敢这么用吗？</div>


<div class="q-conclusion">

💡 **15 秒结论**：实验室敢用受限版；生产默认 Docker/gVisor 沙箱 + 无网络/只读根文件系统 + 审批；任意 code_run 不敢裸跑。

</div>



<div class="q-followups">

🔁 **追问方向**：和 Code Interpreter 产品比？ · 最小权限举例？

</div>


<details class="answer-reveal">
<summary>展开完整回答</summary>

<div class="answer-body">

"**怎么控风险**——五句话版：

1. **隔离**：容器/VM/ WASM，一次一沙箱，跑完销毁
2. **权限**：无 root、无 host mount、网络 egress 白名单
3. **资源**： CPU/内存/时间/token 上限
4. **数据**： secrets 不进 prompt；代码环境读不到 prod DB 明文
5. **治理**： 高危操作 human approval；全链路 audit

**敢不敢上生产**——要分场景，诚实答：

- **敢**：内部工具、只读分析、固定 workspace、用户是工程师、有 rollback
- **不敢裸跑**：面向 C 端、可访问内网、可 exfil 数据、无审批的'任意 Python'

生产常见做法是 **'受限代码执行'** 而非 Turing 完备 shell：只允许 pandas/sql 模板、禁止 subprocess/os、或只用官方 Code Interpreter API。

我的立场：**Agent + code 是能力上限，安全是发布下限**；上线的是'带笼子的 code_run'，不是实验室里为了 demo 方便的 full Python。

如果业务必须要强执行能力，我会推 **Dedicated Worker + 临时环境 + 结果只回传 artifact**，而不是 Agent 直接摸生产机。"

</div>
</details>

</div>

---

<div class="question-card custom-card" id="agent-code-safety">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span> Agent 跑代码如何不删文件</h2>

<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐⭐ · 标签：Agent, 安全, 沙箱 · 考察点：代码执行隔离</div>

<div class="question-prompt"><strong>题目</strong>：怎么保证你的 Agent 运行代码不会影响你、把你的东西都删除了？</div>


<div class="q-conclusion">

💡 **15 秒结论**：最小权限 + 沙箱隔离 + 路径白名单 + 危险操作人工确认，生产默认 deny。

</div>



<div class="q-followups">

🔁 **追问方向**：code_run 和 Docker 沙箱区别？ · 误删了怎么恢复？

</div>


<details class="answer-reveal">
<summary>展开完整回答</summary>

<div class="answer-body">

"Agent 能跑代码，核心不是'相信模型不会乱来'，而是**假设模型一定会犯错**，用工程手段把破坏半径压到最小。

我会分四层做：

**第一层，进程与文件系统隔离**。代码在子进程里跑，工作目录锁死在指定 workspace，禁止访问 `$HOME`、系统目录。文件写操作只允许在 workspace 内，删除用'软删除'或版本快照，不做物理 rm。

**第二层，权限白名单**。不是给 Agent 任意 shell，而是受限 API：`read_file(path)` 必须 resolve 后在白名单内；`write/patch` 同样；`run_python` 禁 `os.system`、`subprocess` 调系统命令，或走 seccomp/AppArmor。

**第三层，人在回路**。批量删除、覆盖、发网请求、读环境变量/密钥等高危动作，Agent 必须 `ask_user` 或走审批队列，未批准不执行。

**第四层，可观测与止损**。全量 audit log（谁、何时、改了什么）；异常 token/步数熔断；一键 kill runaway 进程；定期备份 workspace。

所以答案是：**不靠 prompt 约束，靠沙箱 + 权限 + 审批 + 审计**。实验室 demo 可以宽松，上线必须默认 deny。"

</div>
</details>

</div>

---

<div class="question-card custom-card" id="agent-infinite-loop">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span> 如何防止 Agent 死循环浪费 Token</h2>

<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐⭐ · 标签：Agent, ReAct, 成本控制 · 考察点：循环终止与预算</div>

<div class="question-prompt"><strong>题目</strong>：怎么防止 Agent 一直运行、死循环、自己浪费 Token？</div>


<div class="q-conclusion">

💡 **15 秒结论**：硬上限 max_turns/token budget + 重复检测 + 无进展熔断 + 超时 kill。

</div>



<div class="q-followups">

🔁 **追问方向**：怎么判断'无进展'？ · 和 LangGraph 的 interrupt 怎么配合？

</div>


<details class="answer-reveal">
<summary>展开完整回答</summary>

<div class="answer-body">

"ReAct 循环天然有'停不下来'的风险，我会设**多层熔断**：

**硬限制**：`max_turns`（如 20–30）、`max_tokens` 总预算、单步超时、总 wall-clock 超时。到线强制退出并返回'任务未完成，已保存中间状态'。

**重复检测**：连续 N 步调用同一工具且参数相同 → 判定死循环；或 embedding 相似度检测'我在重复思考' → 注入系统提示'换策略或 ask_user'。

**无进展检测**：每 K 步检查 goal 完成度/中间 artifact 是否变化；若 score 不提升，降级策略（换工具、缩小 scope、请求人类）。

**成本控制**：简单任务走小模型+少工具；复杂任务才开 full agent；缓存 tool 结果，避免重复爬同一 URL。

**产品层**：对用户展示'已用步数/预算'，允许随时 cancel；后台 run 必须 idempotent，方便重试而不是无限续跑。

工程上宁可**早停 + 可恢复**，也不要为了'再试一次'烧光 token。"

</div>
</details>

</div>

---

<div class="question-card custom-card" id="finetune-forgetting">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span> 微调如何避免灾难性遗忘</h2>

<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 标签：微调, QLoRA, 遗忘 · 考察点：持续学习风险</div>

<div class="question-prompt"><strong>题目</strong>：微调怎么保证灾难性遗忘风险？</div>


<div class="q-conclusion">

💡 **15 秒结论**：小学习率 + LoRA 只训 adapter + 混入通用/旧任务数据 + 训后评测集回归。

</div>



<div class="q-followups">

🔁 **追问方向**：全参微调 vs LoRA？ · 怎么评估遗忘？

</div>


<details class="answer-reveal">
<summary>展开完整回答</summary>

<div class="answer-body">

"灾难性遗忘是'专精新任务，通用能力掉 cliff'。我的做法：

**1. 参数高效微调（PEFT）**：QLoRA 只动 adapter，基座权重冻结，遗忘面小。

**2. 数据配比**：领域数据外混 10–20% 通用指令（MMLU 风格 QA、日常对话），防止风格/能力偏科。

**3. 训练策略**：小 lr、少 epoch、早停看**双验证集**——领域集 + 通用集，通用集涨 loss 就停。

**4. 训后回归**：固定一组'通用能力探针'（简单推理、格式遵循、拒答）+ 领域黄金集，对比微调前后。

**5. 推理时可切换**：保留 base model 路由——简单问答走 base，强领域格式走 LoRA adapter。

面试里要诚实：**没有银弹**，LoRA 是工程上性价比最高的折中；若业务要求强领域+强通用，可能要 periodic refresh 或 MoE/多 adapter 切换。"

</div>
</details>

</div>

---

<div class="question-card custom-card" id="finetune-vs-faithfulness">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span> 微调目的与引用校验的关系</h2>

<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐⭐ · 标签：微调, RAG, 引用校验 · 考察点：SFT 与 RAG 分工</div>

<div class="question-prompt"><strong>题目</strong>：微调的目的是什么？微调和引用校验的关系是什么？</div>


<div class="q-conclusion">

💡 **15 秒结论**：RAG 解决'找对资料'，微调解决'怎么说对'；引用校验是生成后 guard，微调从风格上减少乱引用。

</div>



<div class="q-followups">

🔁 **追问方向**：只有 RAG 不微调行不行？ · 引用校验 86% 怎么提升？

</div>


<details class="answer-reveal">
<summary>展开完整回答</summary>

<div class="answer-body">

"**微调（这里指 SFT/LoRA）的目的**在我项目里主要是三点：
1. **输出风格**：更像'基于文献回答'，少 AI 腔、少胡编
2. **任务格式**：强制引用格式、拒答模板（信息不足时说'无法从原文确认'）
3. **领域术语**：论文场景的专业表达

**RAG 负责 fact 从哪来，微调负责 model 怎么组织 language 和 behavior**——两者正交。

**引用校验（Faithfulness Guard）** 是生成后的**规则/模型检查**：拿 claim 回查检索片段，不匹配则重写或拒答。它是**安全网**，不能替代检索质量。

**关系**：
- 只有 RAG、不微调 → 常出现'找到了但乱组织、乱归因'
- 只有微调、不 RAG → 知识过时、幻觉
- 微调 + RAG + 引用校验 → 微调降低'乱引用'概率，校验兜底剩余 10–15%

所以：微调是**行为对齐**，引用校验是**事实对齐**，Pipeline 里 RAG 在前、生成在中、校验在后。"

</div>
</details>

</div>

---

<div class="question-card custom-card" id="hallucination">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span> 幻觉是怎么产生的</h2>

<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 标签：LLM, 幻觉, RAG · 考察点：幻觉机理与治理</div>

<div class="question-prompt"><strong>题目</strong>：幻觉是怎么产生的？</div>


<div class="q-conclusion">

💡 **15 秒结论**：训练目标学'像人说话'非'说真话'；上下文不足/冲突时模型仍补全；RAG+校验+拒答降低但无法归零。

</div>



<div class="q-followups">

🔁 **追问方向**：哪种幻觉最难治？ · 和 creativity 怎么平衡？

</div>


<details class="answer-reveal">
<summary>展开完整回答</summary>

<div class="answer-body">

"幻觉不是单一 bug，是几层原因叠加：

**1. 训练目标**：LM 最大化 next-token 概率，学的是** plausible 续写**，不是 grounded truth。没见过的组合也会'编圆'。

**2. 知识边界**： parametric knowledge 过时、错误、混合；被问到细节时仍倾向给完整答案而非'不知道'。

**3. 上下文问题（RAG 场景）**：检索漏/错 → 模型用 parametric 知识补洞；检索多且冲突 → 归因混乱；context 太长 → lost in the middle。

**4. 解码与 prompt**：temperature 高更'创造'也更 hallucinate；要求'详细回答'会逼模型填细节。

**5. 任务错配**：让模型做精确引用/数值，却只用生成式 head 没有校验环节。

**治理**：检索质量 → 强制 cite → 引用校验 → 低置信拒答 → 人审高风险场景。要承认**无法 100% 消除**，只能按业务容忍度设阈值。"

</div>
</details>

</div>

---

<div class="question-card custom-card" id="langgraph-vs-langchain">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span> LangGraph 和 LangChain 有什么区别</h2>

<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 标签：LangGraph, LangChain, 编排 · 考察点：框架选型</div>

<div class="question-prompt"><strong>题目</strong>：LangGraph 和 LangChain 有什么区别？</div>


<div class="q-conclusion">

💡 **15 秒结论**：LangChain 是组件库+链式调用；LangGraph 是有状态图编排，适合 Agent 循环、分支、人机协同。

</div>



<div class="q-followups">

🔁 **追问方向**：什么场景必须用 LangGraph？ · 和纯 ReAct while 循环比？

</div>


<details class="answer-reveal">
<summary>展开完整回答</summary>

<div class="answer-body">

"**LangChain** 早期是'把 LLM、Prompt、Retriever、Tool 串成 Chain'，偏**线性 DAG**；LCEL 后表达式组合更灵活，但复杂 Agent 循环、状态持久化仍别扭。

**LangGraph** 是**基于图的状态机**：
- **节点** = 函数（retrieve、generate、validate…）
- **边** = 固定或条件路由
- **State** = 跨节点共享、可 checkpoint、可 human-in-the-loop interrupt

**关键差异**：

| | LangChain Chain | LangGraph |
|--|----------------|-----------|
| 控制流 |  mostly 线性 | 循环、分支、并行 |
| 状态 | 隐式传参 | 显式 State schema |
| 持久化 | 需自己搞 | 内置 checkpoint |
| 适用 | 简单 RAG 一条链 | 多步 Agent、审批、Retry |

我科研问答里用 LangGraph：查询改写 → 检索 → 重排 → 生成 → **引用校验** → 不通过则回退改写，这种'带环'的流程 Chain 很难写清楚，Graph 一眼能看懂、好测。

**理解**：LangChain 是**零件**，LangGraph 是**产线控制**；可以只用 LangGraph + 少量 langchain_core 组件。"

</div>
</details>

</div>

---

<div class="question-card custom-card" id="multi-agent">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span> 多 Agent 是什么、好处与理解</h2>

<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 标签：Agent, 多Agent, 架构 · 考察点：协作模式与适用边界</div>

<div class="question-prompt"><strong>题目</strong>：多 Agent 是什么？有什么好处？你怎么理解？</div>


<div class="q-conclusion">

💡 **15 秒结论**：多 Agent 是分工协作的多角色系统；好处是专精+并行+可审计；适合复杂流程，简单任务单 Agent 更好。

</div>



<div class="q-followups">

🔁 **追问方向**：和单 Agent 多工具比何时需要多 Agent？ · 怎么避免 Agent 互相扯皮？

</div>


<details class="answer-reveal">
<summary>展开完整回答</summary>

<div class="answer-body">

"**多 Agent** 不是'多个 ChatGPT 聊天'，而是**多个有明确角色、目标、工具边界的自主体**，通过消息/共享状态/编排器协作完成一个任务。

常见模式：
- **Orchestrator-Worker**：主管拆任务，工人执行（写代码、查资料、审结果）
- **Pipeline**：检索 Agent → 分析 Agent → 写作 Agent
- **Debate/Critic**：生成 + 批评 + 修订，提高质量

**好处**：
1. **专精**：每个 Agent prompt、工具集、模型可不同（小模型路由，大模型生成）
2. **并行**：独立子任务同时跑，降延迟
3. **可维护**：改一个角色不影响全局
4. **可审计**：每步谁做的清晰，方便 debug 和合规

**我的理解**：多 Agent 是**组织问题**，不是模型问题。任务有清晰分工、接口稳定、需要人机检查点时才上；否则单 Agent + 好工具 + LangGraph 状态机更简单、更省 token。

**风险**：通信开销大、责任链模糊、错误传播。要用共享 schema（结构化消息）、统一 trace id、明确'谁有最终决定权'。"

</div>
</details>

</div>

---

<div class="question-card custom-card" id="political-content">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span> 用户问政治敏感问题怎么处理</h2>

<div class="q-meta"><strong>轮次</strong>：二面/HR · 难度：⭐⭐⭐ · 标签：安全, 合规, 内容审核 · 考察点：拒答与边界</div>

<div class="question-prompt"><strong>题目</strong>：如果用户提出一些政治方面的问题，我应该怎么处理？</div>


<div class="q-conclusion">

💡 **15 秒结论**：产品层明确边界：礼貌拒答+引导回业务；技术层关键词+分类器+输出审核；不编造、不站队。

</div>



<div class="q-followups">

🔁 **追问方向**：误杀正常问题怎么办？ · 日志怎么留？

</div>


<details class="answer-reveal">
<summary>展开完整回答</summary>

<div class="answer-body">

"分**产品策略**和**技术实现**两层说。

**产品层**：
- 服务定位是'科研/业务助手'，用户协议写清**不讨论政治、不站队、不提供敏感建议**
- 标准话术：礼貌说明超出服务范围，邀请回到专业问题

**技术层**：
1. **输入侧**：敏感词 + 轻量分类器（政治/违规/正常），高风险直接拒答，灰区可降级为'摘要事实性公开信息'或拒答（按合规要求）
2. **Prompt 层**：system 明确'拒绝政治讨论，不评价领导人/政策/冲突立场'
3. **输出侧**：生成后再过 moderation API，命中则替换为拒答模板
4. **审计**：拒答原因打标，方便调误杀；不记录敏感内容原文到普通日志

**原则**：不编造、不预测、不带情绪；**宁可拒答也不乱答**。ToB 场景还要对齐客户合规清单和地区法规。

如果面试官问'具体某事件'，回答框架即可，不展开站队内容。"

</div>
</details>

</div>

---

<div class="question-card custom-card" id="rag-production-checklist">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span> 简历 RAG 项目上线前要考虑什么</h2>

<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 标签：RAG, 上线, 工程 · 考察点：生产 checklist</div>

<div class="question-prompt"><strong>题目</strong>：简历 RAG 项目上线前，需要考虑什么？</div>


<div class="q-conclusion">

💡 **15 秒结论**：质量（评测集+引用率）、性能（P95+成本）、可靠（限流降级）、安全（鉴权+注入）、运维（监控+索引更新）。

</div>



<div class="q-followups">

🔁 **追问方向**：先做哪三项？ · 和实验室 demo 最大差距？

</div>


<details class="answer-reveal">
<summary>展开完整回答</summary>

<div class="answer-body">

"我会按 **质量 / 性能 / 可靠 / 安全 / 运维** 五块 checklist：

**质量**
- 黄金评测集 + 线上抽样标注；Recall、引用准确率、拒答率
- 边界 case：跨文档、术语缩写、空检索

**性能与成本**
- P95/P99 延迟；embedding/rerank/LLM 各段耗时
- 缓存（相同 query）、批处理、连接池；模型分层（小模型路由）

**可靠性**
- 超时、重试、熔断；LLM/向量库不可用时的降级（仅 BM25/固定 FAQ）
- 限流、队列、并发控制

**安全**
- 鉴权、租户隔离；Prompt 注入、越权读文档
- 敏感信息脱敏；审计日志

**运维**
- 监控：QPS、错误率、token 消耗、检索空结果率
- 索引增量更新、版本回滚；A/B 与 feature flag

**产品**
- 反馈按钮、坏 case 回流；免责声明（AI 仅供参考）

实验室到上线的最大 gap 是：**没有评测就没有上线标准，没有监控就没有迭代依据**。"

</div>
</details>

</div>

---

<div class="question-card custom-card" id="skill-reuse-detection">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span> 保存 Skill 后如何检测同类任务并复用</h2>

<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 标签：Agent, Skill, 记忆 · 考察点：任务相似度与 SOP 复用</div>

<div class="question-prompt"><strong>题目</strong>：在保存一个 skill 后，怎么能再有一个任务可以检测到两类任务是同一类，然后复用这个 skill？</div>


<div class="q-conclusion">

💡 **15 秒结论**：任务 embedding 聚类 + 意图标签 + 成功 SOP 索引；新任务先检索 L3 skill 再决定复用或新建。

</div>



<div class="q-followups">

🔁 **追问方向**：和向量记忆比？ · skill 过时怎么办？

</div>


<details class="answer-reveal">
<summary>展开完整回答</summary>

<div class="answer-body">

"这是 **Agent 长期记忆 / Skill Library** 问题。我的设计思路：

**1. Skill 存什么**
- 不是整段 chat log，而是结构化 **SOP**：触发条件、步骤、工具序列、注意事项、成功判据
- 存 L3 层（GenericAgent 式分层记忆）

**2. 新任务来时怎么匹配**
- **意图分类**：先 LLM/小模型打 task type tag（'PDF 批处理''邮件发送''数据分析'）
- **语义检索**：对 task description 做 embedding，在 skill 库 Top-K
- **规则补充**：关键词、文件类型、工具链指纹（上次用了哪些 tool）

**3. 复用策略**
- 相似度 > 阈值 → 加载 SOP，Agent 按步骤执行，必要时局部改写
- 介于灰区 → '检测到类似 skill X，是否复用？'
- 低于阈值 → 从零探索，成功后 **start_long_term_update** 固化新 skill

**4. 防误判**
- 执行后验证 success criteria；失败则降权该 skill 匹配分
- 定期合并重复 skill、归档过时 SOP

本质：**把'做过的事'变成可检索的程序，而不是靠模型每次重新摸索**。"

</div>
</details>

</div>
