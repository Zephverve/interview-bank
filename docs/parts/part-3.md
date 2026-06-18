---
part: 3
partTitle: Part 3 · 系统设计
partColor: #f59e0b
---

<div class="part-hero" style="--part-color: #f59e0b">

# Part 3 · 系统设计

<p class="part-desc">架构设计 · 多 Agent · 工程落地</p>
<span class="part-round">二面</span>

</div>

<div class="part-intro">

## Q5 · 系统设计

**题目**：假设你要给公司的运营团队做一个 Agent——他们用自然语言描述需求（如"帮我把上周的销售数据拉出来，按地区汇总，发邮件给张总"），Agent 自动执行。请你设计这个系统的架构。

---

> **轮次**：二面 · **难度**：⭐⭐⭐⭐ · **考察点**：运营 Agent 系统设计

**结论句（15 秒）**：四层：接入层→ReAct 核心→工具层（数据/通信/系统）→安全监控；SQL 走意图模板而非裸拼接。

**追问方向**：50 人并发怎么限流？ · 多轮对话状态存哪？

### 回答

"四层架构：

**接入层**：企微/飞书 Bot → 任务队列，display_queue 解耦。**Agent 核心**：ReAct 驱动——如'拉上周销售按地区汇总发邮件'，LLM 自主规划查库→汇总→发信。**工具层**：数据（SQL/汇总/图表）、通信（邮件/消息）、系统（文件），Function Calling 注册 schema。**安全监控**：SQL 只读账号 + 删改二次确认；外发先预览；全链路日志（耗时/成功/Token）。

**三个关键决策**：SQL 不裸拼接——LLM 输出结构化意图 `{table, date_range, group_by}`，模板引擎生成校验 SQL；多轮用 working memory 存中间状态；50 人并发用任务队列 + rate limit，简单问小模型、复杂问大模型。"

---

</div>

---



<div class="question-card compact-card" id="q6">

<h2 class="question-title"><span class="q-badge">Q6</span><span class="question-text">你简历提到对比了分层记忆和向量检索。假设现在有一个客服 Agent，需要记住每个客户的历史对话。你会用分层记忆还是向量检索？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 考察点：客服记忆分层 vs 向量</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：分层记忆为主（精确匹配+SOP），向量检索为辅（相似投诉兜底）；加时效性与只追加不删除。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和 GenericAgent L0-L4 怎么映射？ · 记忆更新策略？</div>
</div>

"**分层记忆为主、向量检索为辅**。

客服场景结构化强——客户 ID、订单、SOP 流程。**L1** 客户 ID→记忆路径；**L2** 档案/订单/投诉；**L3** 退货/换货/升级 SOP；**L4** 历史对话摘要。'张三订单号多少'是精确匹配，直接查 L2，不需向量。

向量检索作**兜底**——'之前抱怨过类似问题吗'这类语义相似查询。相比 GenericAgent，客服需加**时效性**——近期对话权重更高。更新策略**只追加不删除**，新记录 active、旧记录 historical，防记忆污染。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q16">

<h2 class="question-title"><span class="q-badge">Q16</span><span class="question-text">如果让你设计一个多 Agent 协作系统——比如一个 Agent 负责查资料，一个 Agent 负责写作，一个 Agent 负责审核——它们之间怎么通信？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 考察点：多 Agent 通信</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：消息队列管任务分发，共享状态管进度；Agent 不直连，审核 Agent 有 veto，状态持久化 Redis。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和 CrewAI 区别？ · 死信怎么处理？</div>
</div>

"**消息队列 + 共享状态**双通道。

**消息队列**管'谁做什么'：各 Agent 订阅 channel，协调 Agent 发布任务，发布-订阅模式（类似 GenericAgent Agent BBS，生产用 Redis/RabbitMQ）。**共享状态**管'做到哪了'：Redis 存 task_id、research/writing/review 各阶段 status 和 result。

**三个关键决策**：Agent 间不直连，全经队列+状态间接协作；**审核 Agent 有 veto**——事实错误可打回重写；状态持久化，长任务中断可恢复。思路类似 LangGraph StateGraph，只是把单 Agent 节点换成多 Agent。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q22">

<h2 class="question-title"><span class="q-badge">Q22</span><span class="question-text">你的 Agent 在执行一个长任务中途，用户突然改了需求——比如原本是'帮我查 A、B、C 三只股票的行情'，Agent 查到一半用户说'等等，加一个 D'。你怎么设计系统支持这种动态变更？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 考察点：长任务中途改需求</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：中断注入+状态快照+局部重规划；关键操作标不可中断，类比 OS 进程调度。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和 LangGraph 动态图关系？ · intervene 机制细节？</div>
</div>

"核心是**任务中断与状态迁移**，分三部分：

**中断注入**：display_queue 兼作上下行通道，用户新指令后门注入——GenericAgent `_intervene` 文件机制同理，turn_end_callback 消费。**状态快照**：每轮存已完成步骤、中间结果、待执行项于 working memory；改需求时对比新旧，复用 A/B 查询结果、追加 D。**局部重规划**：不重启全任务，LangGraph 动态插节点，ReAct 则下轮注入新 system message。

**约束**：关键操作标'不可中断'——如银行转账须完成或回滚后才接受新指令。类比 OS 协作式调度：中断→保存现场→处理信号→恢复。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q17">

<h2 class="question-title"><span class="q-badge">Q17</span><span class="question-text">你的 RAG 系统部署在实验室 NAS 上。如果要部署到阿里云/腾讯云，架构会有什么变化？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 考察点：实验室到云上架构变化</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Qdrant 托管、推理上云/API、FastAPI 容器化/Serverless、加网关鉴权；月成本约 800-1200。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：冷启动怎么解决？ · VPC 网络延迟？</div>
</div>

"上云四块变化：

**Qdrant**：自部署 docker → 云向量检索/Milvus 托管，注意同 VPC 降延迟。**推理**：3090 本地 → 云 GPU 按需或 GGUF+Ollama 小实例，权衡 QPS 与冷启动。**FastAPI**：单机 → 容器/Serverless，需预置实例或快照抗冷启动。**网关鉴权**：实验室无鉴权 → 生产必加 API 网关、限流、Key 管理与计费。

成本粗估：日 100 次问答、T4 跑微调模型，月 ~800–1200 元；SaaS 向量库 +200–300 元。比纯 GPT-4 API 约省 2/3。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q23">

<h2 class="question-title"><span class="q-badge">Q23</span><span class="question-text">如果公司让你估算搭建一个内部 Agent 平台（100 人使用、每天 500 次调用）的月度成本，你会怎么算？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 考察点：Agent 平台成本估算</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：100人/500次/天：纯 SaaS 约 ¥2000/月，自建推理约 ¥8000/月；MVP 阶段建议纯 SaaS。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：Token 分层调度省多少？ · 人力维护怎么估？</div>
</div>

"按五项粗算（100 人、500 次/天）：

**LLM API**：每次 ~3.5k token，DeepSeek 分层调度月 ~300–500 元；全 GPT-4o 约 10–15 倍。**向量库**：10 万文档自部署 Qdrant ~100–200 元，托管 ~300–500 元。**推理**：T4 按需 ~2500–3600 元，空闲关停可减半。**基础设施**：网关/日志/监控 ~200–400 元。**运维人力**：~0.2 人月 ≈ 3000–5000 元。

总计 **¥2000（纯 SaaS）~ ¥8000（自建推理）**。MVP 阶段建议纯 SaaS 验证价值，用量上来再考虑自建——科研项目的教训是不要在 MVP 过度投基础设施。"


---
</div>
</details>

</div>
