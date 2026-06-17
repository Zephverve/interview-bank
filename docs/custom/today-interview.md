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

💡 **15 秒结论**：实验室可用受限 code_run；生产必须容器沙箱加无密钥无内网，任意 Python 不敢裸跑。

</div>



<div class="q-followups">

🔁 **追问方向**：和 Code Interpreter 比？ · 最小权限举例？

</div>


<details class="answer-reveal">
<summary>展开完整回答</summary>

<div class="answer-body">

"我会分**怎么控**和**敢不敢**两部分答，比较诚实。

怎么控？核心是**隔离、限权、可审计**。隔离用 Docker 或 gVisor，一次一环境，跑完销毁；权限上无 root、工作目录只读挂载、网络 egress 白名单；secrets 不进 prompt、代码环境碰不到生产库明文；高危操作 human approval；全程 audit log，CPU、内存、时间、token 都有顶。

敢不敢上生产？**要看场景，不能一刀切**。

敢的情况：内部工具、只读分析、固定 workspace、用户是工程师、有 rollback。比如让 Agent 在临时目录里跑 pandas 洗数据，结果只回传 artifact，不碰线上服务——这种我可以接受，但仍是'带笼子的 code_run'。

不敢的情况：ToC 产品、能访问内网、能读密钥、没有审批的'任意 Python'——这和实验室 demo 为了能力展示开的 code_run 不是一回事。

和 OpenAI Code Interpreter 类产品比，它们也是沙箱+限时+无持久化，不是真给你一台裸 VPS。

所以我的态度是：**Agent 加代码是能力上限，安全是发布下限**。上线的是受限执行面，不是 Turing 完备的 shell。如果业务必须要强执行，我会推 dedicated worker 临时环境，而不是 Agent 直接摸生产机。"

</div>
</details>

</div>

---

<div class="question-card custom-card" id="agent-code-safety">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span> Agent 跑代码如何不删文件</h2>

<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐⭐ · 标签：Agent, 安全, 沙箱 · 考察点：代码执行隔离</div>

<div class="question-prompt"><strong>题目</strong>：怎么保证你的 Agent 运行代码不会影响你、把你的东西都删除了？</div>


<div class="q-conclusion">

💡 **15 秒结论**：我不靠 prompt 赌模型自觉，靠沙箱锁目录、工具白名单、删改要确认、全程可审计。

</div>



<div class="q-followups">

🔁 **追问方向**：code_run 和 Docker 沙箱区别？ · 误删了怎么恢复？

</div>


<details class="answer-reveal">
<summary>展开完整回答</summary>

<div class="answer-body">

"我的前提很简单：Agent 能跑代码，就要默认它**有可能删错东西**，所以不能把安全押在 prompt 上。

具体我会做四件事。第一，**把执行环境关进笼子里**——代码只在独立子进程、固定 workspace 里跑，工作目录写死，不让它随便摸 `$HOME` 或系统盘。真要删文件，也尽量走软删除或快照，别直接 rm 真删。

第二，**工具层做白名单**。我不给 Agent 一个裸 shell，而是 read、write、patch、run_python 这种 API，路径 resolve 之后必须在允许范围内。Python 执行也会限制危险调用，比如随意 subprocess、读环境变量里的密钥。

第三，**高危动作要人点头**。批量删除、覆盖重要文件、发外网请求这类操作，Agent 得走 ask_user 或审批，没批准就不执行。

第四，**能查、能停**。每一步工具调用打 audit log；步数、token 到上限就熔断；用户随时能 cancel。

我分析 GenericAgent 时也注意到，框架子进程隔离是有的，但文件系统级沙箱还可以加强——生产上我会上 Docker 或 gVisor，实验室 demo 可以松一点，上线必须默认 deny。"

</div>
</details>

</div>

---

<div class="question-card custom-card" id="agent-infinite-loop">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span> 如何防止 Agent 死循环浪费 Token</h2>

<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐⭐ · 标签：Agent, ReAct, 成本控制 · 考察点：循环终止与预算</div>

<div class="question-prompt"><strong>题目</strong>：怎么防止 Agent 一直运行、死循环、自己浪费 Token？</div>


<div class="q-conclusion">

💡 **15 秒结论**：硬上限 max_turns 和 token 预算，加重复调用检测和无进展熔断，到线就停、状态可恢复。

</div>



<div class="q-followups">

🔁 **追问方向**：怎么判断'无进展'？ · 和 LangGraph interrupt 怎么配合？

</div>


<details class="answer-reveal">
<summary>展开完整回答</summary>

<div class="answer-body">

"ReAct 循环最大的坑就是'看起来在干活，其实在空转'。我一般会设**三道保险**。

第一道是**硬天花板**。比如 max_turns 设 20 到 30，总 token 预算、单步超时、整任务 wall-clock 超时都设好。到了就强制退出，告诉用户'任务没做完，但中间结果我帮你存了'，而不是让它一直烧。

第二道是**重复检测**。如果连续好几轮调同一个工具、参数几乎一样，我就判定它在打转，系统注入提示让它换策略或者直接 ask_user。GenericAgent 原版也有类似设计——连续空响应几次就退出，我会在这个基础上再加 embedding 相似度，看是不是在重复同一句话。

第三道是**无进展熔断**。每隔几步看一下目标有没有推进——比如文件有没有写出来、检索结果有没有更新。如果 score 一直不动，就降级：缩小任务范围，或者让人介入。

成本上，简单任务用小模型、少开工具；工具结果能缓存就不重复爬。产品层给用户看到已用步数，随时能 cancel。

我的原则是：**宁可早停、可重试，也不要为了'再试一次'把 token 烧光**。"

</div>
</details>

</div>

---

<div class="question-card custom-card" id="finetune-forgetting">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span> 微调如何避免灾难性遗忘</h2>

<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 标签：微调, QLoRA, 遗忘 · 考察点：持续学习风险</div>

<div class="question-prompt"><strong>题目</strong>：微调怎么保证灾难性遗忘风险？</div>


<div class="q-conclusion">

💡 **15 秒结论**：LoRA 只训 adapter、混通用数据、小学习率早停，训完用双验证集看领域和通用能力。

</div>



<div class="q-followups">

🔁 **追问方向**：全参微调 vs LoRA？ · 怎么评估遗忘？

</div>


<details class="answer-reveal">
<summary>展开完整回答</summary>

<div class="answer-body">

"灾难性遗忘就是模型在新任务上变强了，通用能力突然掉下去。我实际做 QLoRA 时主要靠**别动太多参数、别训太狠、训完要测**。

第一，我用的是 **QLoRA**，基座权重冻住，只动 adapter，本身就把遗忘面压小了。全参微调我基本不会在资源有限的情况下上。

第二，**数据要掺通用样本**。领域指令大概占八成，我会混一成到两成通用问答，防止模型只会一种说话方式。

第三，**训练别太猛**。学习率小一点，epoch 少一点，验证集不只看领域 loss，还看一组通用探针——比如简单推理、格式遵循、拒答——通用集 loss 往上走就停。

第四，**训完做回归对比**。同一批问题问微调前后，看有没有明显变傻。推理时也可以保留'走 base 还是走 adapter'的路由，简单问题不强行走 LoRA。

我会跟面试官诚实说：**没有零遗忘的银弹**，LoRA 是性价比最高的折中。如果业务既要强领域又要强通用，可能要定期 refresh 数据，或者多 adapter 按场景切换。"

</div>
</details>

</div>

---

<div class="question-card custom-card" id="finetune-vs-faithfulness">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span> 微调目的与引用校验的关系</h2>

<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐⭐ · 标签：微调, RAG, 引用校验 · 考察点：SFT 与 RAG 分工</div>

<div class="question-prompt"><strong>题目</strong>：微调的目的是什么？微调和引用校验的关系是什么？</div>


<div class="q-conclusion">

💡 **15 秒结论**：RAG 负责找对资料，微调负责说对话、少 AI 腔；引用校验是生成后兜底，微调减轻但替代不了它。

</div>



<div class="q-followups">

🔁 **追问方向**：只有 RAG 不微调行不行？ · 引用校验通过率怎么提升？

</div>


<details class="answer-reveal">
<summary>展开完整回答</summary>

<div class="answer-body">

"结合我科研问答项目的经验，**微调解决的不是'知识从哪来'，而是'怎么说'**。

RAG 把相关段落检索到了，基座模型还是可能两个毛病：一是说话太'AI 腔'，二是明明检索对了，引用格式乱、该拒答时不拒答。所以我用 QLoRA 训了大概 1.8k 条指令，核心是让模型习惯'基于给定上下文作答'、术语更专业、该说信息不足就说信息不足。

**引用校验**是另一条线——它是生成**之后**的一道 guard。我会拿模型写出的 claim 回查检索片段，对不上就重写或拒答。我们项目里这一步把引用通过率从大概 72% 提到了 86%，但还有漏网之鱼，说明不能单靠微调。

**关系**可以这样记：RAG 管 recall，微调管 behavior，引用校验管 faithfulness。只有 RAG 不微调，经常'找到了但讲不对'；只有微调不 RAG，知识过时、幻觉压不住。三者是 pipeline 里前后衔接的关系，不是互相替代。

如果面试官追问值不值得微调，我会说：看业务对**风格和格式**有多挑剔。要求不高可以先用 prompt；要上生产、要稳定引用格式，微调加校验更靠谱。"

</div>
</details>

</div>

---

<div class="question-card custom-card" id="hallucination">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span> 幻觉是怎么产生的</h2>

<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 标签：LLM, 幻觉, RAG · 考察点：幻觉机理与治理</div>

<div class="question-prompt"><strong>题目</strong>：幻觉是怎么产生的？</div>


<div class="q-conclusion">

💡 **15 秒结论**：模型学的是像人说话不是保证真；上下文不够或冲突时仍硬补全；RAG 加校验加拒答能降不能绝。

</div>



<div class="q-followups">

🔁 **追问方向**：哪种幻觉最难治？ · 和 creativity 怎么平衡？

</div>


<details class="answer-reveal">
<summary>展开完整回答</summary>

<div class="answer-body">

"我一般会从**模型本身、上下文、解码方式**三层来讲。

模型训练目标是预测下一个 token，学的是**像真的一样流畅**，不是'这句话必须有出处'。所以遇到知识盲区，它往往宁愿编一段听起来合理的，也不说不知道——这是幻觉的根源之一。

在 RAG 场景里又多了几种。检索**漏了**，模型会用参数里过时或错误的知识补洞；检索**多了且互相打架**，就容易张冠李戴，把 A 论文的结论安到 B 论文头上——我自己项目里就踩过这个坑。context 太长还会有 lost in the middle，中间段落用不上。

解码上 temperature 高、prompt 里要求'尽量详细'，都会逼模型填细节，没依据也填。

所以我的治理思路是：**先把检索做好**，再 prompt 里强制 cite，生成后做引用校验，置信度低就拒答。要承认**没法 100% 消灭**，只能按业务容忍度设阈值——医疗、法律就要更保守，内部助手可以稍松。"

</div>
</details>

</div>

---

<div class="question-card custom-card" id="langgraph-vs-langchain">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span> LangGraph 和 LangChain 有什么区别</h2>

<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 标签：LangGraph, LangChain, 编排 · 考察点：框架选型</div>

<div class="question-prompt"><strong>题目</strong>：LangGraph 和 LangChain 有什么区别？</div>


<div class="q-conclusion">

💡 **15 秒结论**：LangChain 偏组件和链式拼接；LangGraph 是有状态图，适合带环路的 Agent 和多步审批。

</div>



<div class="q-followups">

🔁 **追问方向**：什么场景必须用 LangGraph？ · 和纯 while 循环比？

</div>


<details class="answer-reveal">
<summary>展开完整回答</summary>

<div class="answer-body">

"我两个都用过，体感上 **LangChain 更像零件库**，LCEL 把 retriever、prompt、LLM、tool 串起来，适合'一条线走到底'的 RAG；一旦你要**循环、回退、分支**，用 Chain 写就开始绕。

**LangGraph** 是有状态的图：每个节点是一个步骤，边可以是条件路由，状态 schema 显式定义，还能 checkpoint、interrupt 让人审批。我科研问答里检索不对就回退改写、生成完还要引用校验，不通过再重生成——这种**带环**的流程，用 Graph 一眼能看懂，测试也好拆。

打个比方：LangChain 像把工序排成流水线；LangGraph 像车间调度系统，哪步不合格可以退回上一工位。

是不是必须用 LangGraph？我的标准是：有没有**循环依赖**、要不要**持久化中间状态**、要不要**人机协同**。都没有的话，一个 while ReAct 循环加好工具也能跑。都有的话，我会选 LangGraph，维护成本更低。

现在我的习惯是 LangGraph 做编排，底层组件用 langchain_core 的 retriever、message 这些，不绑死全家桶。"

</div>
</details>

</div>

---

<div class="question-card custom-card" id="multi-agent">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span> 多 Agent 是什么、好处与理解</h2>

<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 标签：Agent, 多Agent, 架构 · 考察点：协作模式与适用边界</div>

<div class="question-prompt"><strong>题目</strong>：多 Agent 是什么？有什么好处？你怎么理解？</div>


<div class="q-conclusion">

💡 **15 秒结论**：多 Agent 是有分工的多角色协作，不是多个聊天框；适合复杂流程，简单任务单 Agent 更省。

</div>



<div class="q-followups">

🔁 **追问方向**：和单 Agent 多工具比何时需要多 Agent？ · 怎么避免 Agent 互相扯皮？

</div>


<details class="answer-reveal">
<summary>展开完整回答</summary>

<div class="answer-body">

"我理解的**多 Agent**，不是开好几个 ChatGPT 窗口聊天，而是**每个体有明确角色、工具边界和产出**，再通过编排器或共享状态一起完成任务。

比较常见的几种：一种是主管拆、工人干，比如一个负责检索、一个写代码、一个做 review；一种是流水线，检索 Agent 把结果交给分析 Agent 再交给写作 Agent；还有一种是生成加批评，写完再有人挑毛病改一版。

**好处**我体会主要有四个。一是**专精**——检索用小模型、生成用大模型，各干擅长的。二是**并行**——互不依赖的子任务可以同时跑，省时间。三是**好维护**——改一个角色的 prompt 不会把整个系统搅乱。四是**好审计**——出了问题能看清楚是哪一步、哪个 Agent 干的，合规也好交代。

但我不觉得什么都该上多 Agent。我的判断标准是：任务有没有**稳定分工**、接口清不清楚、要不要人机检查点。如果只是'查资料然后回答'，单 Agent 加好工具、用 LangGraph 管状态就够了，更简单也省 token。

**风险**也要讲清楚：Agent 之间通信有开销，容易扯皮、互相甩锅。所以消息最好结构化，trace id 统一，并且要说清楚**谁有最终决定权**——通常是 orchestrator，不是大家投票。"

</div>
</details>

</div>

---

<div class="question-card custom-card" id="political-content">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span> 用户问政治敏感问题怎么处理</h2>

<div class="q-meta"><strong>轮次</strong>：二面/HR · 难度：⭐⭐⭐ · 标签：安全, 合规, 内容审核 · 考察点：拒答与边界</div>

<div class="question-prompt"><strong>题目</strong>：如果用户提出一些政治方面的问题，我应该怎么处理？</div>


<div class="q-conclusion">

💡 **15 秒结论**：产品定边界礼貌拒答；输入输出双层审核；不编造不站队，引导回业务问题。

</div>



<div class="q-followups">

🔁 **追问方向**：误杀正常问题怎么办？ · 日志怎么留？

</div>


<details class="answer-reveal">
<summary>展开完整回答</summary>

<div class="answer-body">

"这类问题我会**产品策略和技术手段分开说**，避免只讲'我们 prompt 里写了不许聊政治'。

产品上，助手定位要清楚——比如科研问答、业务助手——用户协议里写明白**不讨论政治、不站队、不给敏感建议**。碰到这类提问，统一话术：礼貌说明超出服务范围，邀请回到专业问题。不跟用户辩论，也不假装中立分析。

技术上三层。输入侧做敏感分类，明显违规直接拒答，灰色地带可以降级处理，按合规要求来。Prompt 里 system 写死边界。输出侧再过一遍 moderation，命中就替换成拒答模板。

日志只记'拒答原因和类别'，**敏感原文不进普通日志**，方便后面调误杀。

如果面试官追问具体事件，我会坚持**只讲处理框架，不展开站队内容**。核心原则就一句：**宁可拒答，也不乱答**。"

</div>
</details>

</div>

---

<div class="question-card custom-card" id="rag-production-checklist">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span> 简历 RAG 项目上线前要考虑什么</h2>

<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 标签：RAG, 上线, 工程 · 考察点：生产 checklist</div>

<div class="question-prompt"><strong>题目</strong>：简历 RAG 项目上线前，需要考虑什么？</div>


<div class="q-conclusion">

💡 **15 秒结论**：先有用评测集证明质量，再保 P95 和成本，然后鉴权限流监控索引更新，实验室 demo 和上线差一截。

</div>



<div class="q-followups">

🔁 **追问方向**：先做哪三项？ · 和实验室最大差距？

</div>


<details class="answer-reveal">
<summary>展开完整回答</summary>

<div class="answer-body">

"我科研问答从 demo 到能给别人用，体会最深的是：**没有评测就没有上线标准，没有监控就没有迭代依据**。

质量上，我会坚持有一套黄金评测集，看 Recall、引用对不对、该拒答时拒没拒，还要专门测跨文档、术语缩写这类边界 case。没跑过这些数据，我不建议对外说'能上线'。

性能上，我们压过 P95 从 3 秒多到 1.2 秒，靠的是连接池、批处理重排、异步索引——上线前得知道瓶颈在哪一段，LLM、embedding 还是 rerank，成本能不能扛住并发。

可靠性要有超时、重试、熔断。向量库或 LLM 挂了怎么办？至少能降级到 BM25 或固定 FAQ，不能整站 500。

安全不能省：鉴权、租户隔离、文档权限、防 prompt 注入。ToB 还要考虑敏感信息脱敏和审计。

运维侧监控 QPS、错误率、空检索率、token 消耗；索引要能增量更新、能回滚；最好留反馈入口，坏 case 能回流。

如果面试官问'最先做哪三件'，我会说：**评测集、引用校验链路、监控告警**——这三件做了，才知道能不能上、上了之后怎么改。"

</div>
</details>

</div>

---

<div class="question-card custom-card" id="skill-reuse-detection">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span> 保存 Skill 后如何检测同类任务并复用</h2>

<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 标签：Agent, Skill, 记忆 · 考察点：任务相似度与 SOP 复用</div>

<div class="question-prompt"><strong>题目</strong>：在保存一个 skill 后，怎么能再有一个任务可以检测到两类任务是同一类，然后复用这个 skill？</div>


<div class="q-conclusion">

💡 **15 秒结论**：把成功经验固化成 SOP 存 L3；新任务先打意图标签再语义检索 skill，相似就复用，不行再探索。

</div>



<div class="q-followups">

🔁 **追问方向**：和向量记忆比？ · skill 过时怎么办？

</div>


<details class="answer-reveal">
<summary>展开完整回答</summary>

<div class="answer-body">

"这个问题我在看 GenericAgent 分层记忆时想过——关键不是把整段对话存起来，而是把**成功的执行路径提炼成 SOP**：什么情况下触发、分几步、用哪些工具、怎么判断做完。

新任务进来，我会做**两层匹配**。一层是意图标签，用小模型或规则先粗分，比如'批处理 PDF''发邮件''跑数据分析'。另一层是语义检索，对任务描述做 embedding，在 skill 库里找 Top-K 相似的。

相似度够高，就直接加载 SOP，Agent 按步骤走，局部参数改一改就行。灰色地带可以 ask_user：'检测到类似 skill，要复用吗？' 明显不像，就从头探索，成功后走 long_term_update 固化新 skill。

和纯向量记忆比，skill 是**结构化程序**，不是聊天记录；检索准、可编辑、可版本管理。

防误判要靠**执行后验证**——按 SOP 跑完检查 success criteria，失败了就把这次匹配降权。还要定期合并重复 skill、归档过时的。

一句话：**让 Agent 别每次都从零摸索，而是先查'以前成功过没有'**。"

</div>
</details>

</div>
