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

"我会设计一个四层架构。

**第一层是接入层**——运营同学通过企业微信或者飞书 Bot 发消息，消息进入任务队列。这里用 **inbox 事件总线**（和 EvoAgent Conductor 同思路），和前端解耦。

**第二层是 Agent 核心层**——用 ReAct 循环驱动。LLM 拿到用户指令后，自主规划步骤。比如'拉上周销售数据'这个任务的执行路径可能是：先调用数据库查询工具查销售表 → 拿到结果后调用数据汇总工具按地区分组 → 再调用邮件工具发送。每一步的结果会成为下一步的输入。

**第三层是工具层**——这是设计的关键。我会把工具分成三类：数据工具（SQL 查询、数据汇总、图表生成）、通信工具（发邮件、发消息）、系统工具（文件读写）。每个工具需要注册 schema 描述自己的能力，Agent 通过 Function Calling 调用。

**第四层是安全和监控层**。安全方面：SQL 查询必须走只读账号，DELETE/DROP 等操作需要二次确认；对外发送（邮件、消息）在正式发送前先展示预览，让用户确认。监控方面：每次工具调用都记录日志，包括耗时、是否成功、Token 消耗。

架构上的几个关键设计决策：

1. **SQL 怎么处理**——我不会把原始 SQL 拼接交给 LLM。LLM 负责把自然语言转成查询意图，然后走一个'查询模板引擎'——比如运营说'上周销售数据按地区汇总'，LLM 输出 `{table: sales, date_range: last_week, group_by: region}`，引擎再根据这个结构化意图生成经过校验的 SQL。

2. **多轮对话**——运营可能第一轮说'拉销售数据'，看完之后说'再加一个按产品分类的维度'。这要求 Agent 记住上下文，我用 working memory 来存当前任务的中间状态，而不是每次都从头执行。

3. **并发处理**——如果 50 个人同时用，我不用 50 个 LLM 实例。任务队列 + 线程池，LLM API 调用做 rate limit 和排队。高优先级的简单任务（比如查一个数字）可以先用小模型快速响应，复杂任务才用大模型。

其实这个设计借鉴了 **EvoAgent Conductor** 的思路——ReAct 调度、工具注册分发、inbox 事件与前端解耦；运营场景换成企业微信/飞书 Bot 接入同一套编排层即可。

---

</div>

---



<div class="question-card compact-card" id="q6">

<h2 class="question-title"><span class="q-badge">Q6</span><span class="question-text">你简历提到对比了分层记忆和向量检索。假设现在有一个客服 Agent，需要记住每个客户的历史对话。你会用分层记忆还是向量检索？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 考察点：客服记忆分层 vs 向量</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：分层记忆为主（精确匹配+SOP），向量检索为辅（相似投诉兜底）；加时效性与只追加不删除。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和 EvoAgent L0-L4 怎么映射？ · 记忆更新策略？</div>
</div>

"我会用**分层记忆为主、向量检索为辅**的混合方案。

客服场景有很强的结构化特征：客户有固定身份（姓名、手机号、会员等级），对话有固定流程（进线→识别问题→解答→满意度评价），常见问题有标准 SOP。这种场景下分层记忆更合适：

- **L1 索引**记录客户 ID → 这个客户的相关记忆存在哪里
- **L2 事实**存结构化信息：客户档案、最近订单、上次投诉内容、偏好渠道
- **L3 SOP** 存标准处理流程：'退货流程''换货流程''投诉升级流程'，Agent 识别问题类型后直接加载对应 SOP
- **L4 归档**存历史对话摘要，按客户 ID 和时间组织

为什么主要用分层而不是向量检索？因为客服场景的查询通常是**精确匹配**而非语义匹配。'客户张三的订单号是多少'——这个不需要语义搜索，直接按客户 ID 查 L2 就行。向量检索的特点是'找到语义相似的内容'，在客服场景的优势场景是'这个客户之前抱怨过类似的问题吗'——这时候可以走向量检索来找相似语义的对话。

所以我不会完全放弃向量检索，而是把它作为 L2 的一个补充索引——当精确匹配找不到时，用向量检索做兜底。

相比 **EvoAgent** 的 L0-L4，客服 Agent 还要加 **时效性维度**——昨天对话权重高于三个月前。L1 索引加时间权重。

更新策略：联系方式变更等用追加，新记录 active、旧记录 historical，和 EvoAgent「只追加不删除」一致。
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q16">

<h2 class="question-title"><span class="q-badge">Q16</span><span class="question-text">如果让你设计一个多 Agent 协作系统——比如一个 Agent 负责查资料，一个 Agent 负责写作，一个 Agent 负责审核——它们之间怎么通信？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 考察点：多 Agent 通信</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：消息队列管任务分发，共享状态管进度；Agent 不直连，审核 Agent 有 veto，状态持久化 Redis。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和 CrewAI 区别？ · 死信怎么处理？</div>
</div>

"我会用消息队列 + 共享状态的双通道方案。

**消息队列解决'谁做什么'**：每个 Agent 订阅 channel，协调 Agent 发布任务——这和 **EvoAgent Conductor** 的 inbox + SubagentPool 是同一思路，生产环境可换成 Redis Pub/Sub。

**共享状态解决'做到哪了'**：跨 Agent 的 working memory，格式像：

```json
{
  "task_id": "report-001",
  "status": "in_progress",
  "research": {"status": "done", "result": "查到了 5 篇相关论文"},
  "writing": {"status": "in_progress", "progress": "已完成引言和方法部分"},
  "review": {"status": "pending"}
}
```

关键设计决策：

1. **Agent 之间不直接通信**——全部通过消息队列和共享状态间接协作，避免耦合。这和微服务里的 service mesh 思路一致。

2. **审核 Agent 有 veto 权**——如果审核 Agent 发现写作 Agent 的输出包含事实错误，它可以拒绝通过，要求写作 Agent 重写并补充引用。这个 veto 机制是质量保障的核心。

3. **状态持久化**——共享状态存 Redis，Agent 重启后能从上次中断的地方继续。在实际场景中 Agent 任务可能要跑几十分钟，持久化是必须的。

这个设计的核心思路其实来自 LangGraph 的 StateGraph——状态是所有 Agent 共享的、Graph 定义了 Agent 的执行顺序，只是把单 Agent 的节点换成了多 Agent。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q22">

<h2 class="question-title"><span class="q-badge">Q22</span><span class="question-text">你的 Agent 在执行一个长任务中途，用户突然改了需求——比如原本是'帮我查 A、B、C 三只股票的行情'，Agent 查到一半用户说'等等，加一个 D'。你怎么设计系统支持这种动态变更？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 考察点：长任务中途改需求</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：中断注入+状态快照+局部重规划；关键操作标不可中断，类比 OS 进程调度。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和 LangGraph 动态图关系？ · intervene 机制细节？</div>
</div>

"这是 Agent 工程里一个被严重低估的难题——**任务中断与状态迁移**。

我的设计分三个部分：

**第一，中断接受机制**。EvoAgent Conductor 的 inbox 支持运行时 **key_info 注入**——用户改需求时不重启 Agent，Conductor 把新指令推给 SubAgent 或主循环。RAG 侧如果接 Agent 工具，也可以用同一套 Conductor 做长任务编排。

**第二，任务状态快照**。Agent 在每轮循环结束时自动保存当前状态——已经完成了哪些步骤、中间结果是什么、还有哪些步骤待执行。这个状态是一个 JSON 对象存在 working memory 里。用户改需求时，Agent 对比新旧需求，识别出哪些已完成的工作可以复用（A、B 的查询结果），哪些需要新增（D 的查询）。

**第三，局部重规划**。不需要重启整个任务，只需要在已执行步骤的终点追加新步骤。用 LangGraph 的话来说，就是动态往 StateGraph 里插一个新节点。用 ReAct 的话，就是把新指令作为新的 system message 在下一轮注入。

实现上的关键约束：这个动态变更不能破坏执行原子性。比如 Agent 正在调用一个银行转账 API，这时候用户改需求——转账操作必须完成或回滚之后才能接受新指令。我需要在工具层加一个'不可中断'标记，关键操作完成后才检查变更请求。

这个设计和操作系统的进程调度非常像——中断信号到达→保存现场→处理信号→恢复执行。Agent 的任务调度本质上是用户态线程的协作式调度。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q17">

<h2 class="question-title"><span class="q-badge">Q17</span><span class="question-text">你的 RAG 系统部署在实验室 NAS 上。如果要部署到阿里云/腾讯云，架构会有什么变化？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 考察点：实验室到云上架构变化</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Qdrant 托管、推理上云/API、FastAPI 容器化/Serverless、加网关鉴权；月成本约 800-1200。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：冷启动怎么解决？ · VPC 网络延迟？</div>
</div>

"变化主要在四个方面。

**第一，Qdrant 从自部署到云服务**。实验室 NAS 上我是 docker run 一个 Qdrant 实例，数据持久化在本地。上云之后，用阿里云的向量检索服务或者腾讯云 Milvus 托管版，免运维。但要注意网络延迟——检索请求从云函数发到向量数据库，如果不在同一个 VPC 里会多几十 ms 的延迟。

**第二，模型推理从本地到 API/云端**。现在微调后的 Qwen2.5-14B 跑在实验室的 3090 上，推理速度受限于单卡。上云有两种选择：要么把微调后的模型部署到云 GPU 实例上（按需付费，但冷启动慢），要么直接把微调模型转为 GGUF 格式用 Ollama 跑在小 GPU 实例上。选哪个取决于 QPS 和成本约束。

**第三，FastAPI 从单机到 Serverless**。现在 FastAPI 是单进程跑在 NAS 的 Python 环境里。上云后适合用函数计算或者容器服务——用户请求来的时候拉起实例，没有请求的时候缩容到零。但有个坑：LLM 推理有冷启动延迟，需要配预置实例或者用存储快照加速启动。

**第四，增加了 API 网关和鉴权层**。实验室环境 **React** 前端直连 FastAPI SSE。生产环境需要 API 网关做路由、限流、鉴权。

成本估算：按每天 100 次问答，每次平均 3k token 输入 + 500 token 输出、微调模型跑在 T4 GPU 上的话，一个月大概 800-1200 元。如果用 SaaS 向量数据库而不是自建，再加 200-300 元。和用 GPT-4 API 的纯托管方案比，自部署微调模型的成本大概是 1/3。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q23">

<h2 class="question-title"><span class="q-badge">Q23</span><span class="question-text">如果公司让你估算搭建一个内部 Agent 平台（100 人使用、每天 500 次调用）的月度成本，你会怎么算？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐ · 考察点：Agent 平台成本估算</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：100人/500次/天：纯 SaaS 约 ¥2000/月，自建推理约 ¥8000/月；MVP 阶段建议纯 SaaS。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：Token 分层调度省多少？ · 人力维护怎么估？</div>
</div>

"我会按五分项算。

**LLM API 成本**：每天 500 次调用，按每次平均 3k token 输入 + 500 token 输出。如果用 DeepSeek V3（SiliconFlow），大概每百万 token ¥1-2，一个月就是 500×30×3500/1M×2 ≈ ¥105。如果用 GPT-4o，价格大概是 10-15 倍，¥1000-1500。我会建议高频简单任务用 DeepSeek，低频复杂任务用 GPT-4o，分层调度。估算月成本 ¥300-500。

**向量数据库**：100 人的文档量级大概 10 万文档、每个 512 token，总向量约 50M 维度。用 Qdrant 自部署在一台 2C4G 的云服务器上，¥100-200/月。如果数据集更大或 QPS 更高，用云厂商的托管向量数据库服务，¥300-500/月。

**推理服务**：如果用了微调模型，需要一台 GPU 服务器。T4 按量付费大概 ¥3-5/小时，一个月 720 小时 ≈ ¥2500-3600。但如果并发不高，可以做成按需启动——GPU 服务器只在有请求时拉起，空闲时自动关闭，成本降一半到 ¥1200-1800。

**基础设施**：API 网关 + 日志 + 监控 + 存储，¥200-400/月。

**人力维护**：不算研发人力，日常运维大概 0.2 人月，折算 ¥3000-5000。

总计区间：¥2000（纯 SaaS 全部用第三方 API，零自建）到 ¥8000（自建微调推理服务）。从 100 人公司的预算来看，纯 SaaS 方案在成本上是完全可接受的。

对 Leader 汇报时我会强调：第一年建议纯 SaaS，先验证 Agent 在内部的实际价值。当使用频率和复杂度确实上去了，再考虑自建推理服务。不要在 MVP 阶段过度投资基础设施——这是我做科研项目学到的教训。"


---
</div>
</details>

</div>
