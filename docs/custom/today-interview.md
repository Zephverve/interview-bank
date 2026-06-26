---
custom: true
partTitle: 今日面试复盘
partColor: #f97316
---

<div class="part-hero custom-hero" style="--part-color: #f97316">

# 🔥 今日面试复盘

<p class="part-desc">2026-06-17 面试真题 · 共 19 题</p>
<span class="part-round custom-tag">我的题库</span>

</div>

<div class="custom-hint">

📝 **源文件：`custom/today-interview/`** · 新增题目后运行 `npm run prepare` 即可刷新。

</div>

<div class="question-card custom-card compact-card" id="agent-code-production">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">Agent 能跑任意代码，安全风险怎么控？生产环境你敢这么用吗？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐⭐ · 标签：Agent, 安全, 生产 · 考察点：敢不敢上生产</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：实验室 demo 可以用受限 code_run；生产必须容器沙箱 + 无 root + 无密钥 + 无内网，裸 shell 永远不敢上。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和 Code Interpreter 比？ · 最小权限举例？ · 什么场景敢什么场景不敢，怎么划这条线？</div>
</div>

"这个问题大厂面试官必问，因为**代码执行是 Agent 能力的上限，也是安全风险的地板**。我分三层答：怎么控、敢不敢、和成熟产品比差在哪。

**怎么控？不是靠 prompt 写 'don't delete files'。** 我实际会上的四件套：

第一，沙箱隔离。Docker 或 gVisor，一次任务一个临时容器，跑完立刻 destroy。工作目录只读挂载、不允许 mount 宿主机路径。网络 egress 白名单——Agent 可以 pip install 但不能 curl 内网地址。CPU 和内存限额防止 fork bomb。

第二，最小权限。容器内非 root（`USER 1000`），禁止 `chown`、`mount`、`iptables` 等系统调用。Python 执行面限制：ban `os.system`、`subprocess.Popen(shell=True)`、`eval/exec`、直接读 `/proc/self/environ`。工具不暴露裸 shell，而是 `read_file(path)`、`write_file(path, content)`、`run_python(code)` 这种 API，path 传入后先 resolve 再检查是否在允许范围内。

第三，密钥不进环境。secrets 通过工具 API 注入而非环境变量，用完即焚。Agent prompt 里永远看不到明文密钥——它说「调用 send_email 工具」，工具实现里才去读 secret manager。生产数据库连接串同理，Agent 可见的只有沙箱内的临时 schema。

第四，高危操作 human approval。批量删文件、覆盖已有文件、发送邮件、调用收费 API——这些走审批流，Agent 发起请求，人确认后工具才执行。全程 audit log：谁在什么时间让 Agent 做了什么操作，结果是什么。

**敢不敢上生产？不搞一刀切，看三个维度——**

👎 **不敢的情况：** Agent 能摸生产数据库、能访问内网服务、能读宿主机文件系统、用户是不可信的终端用户、没有审批环节的「任意 Python」。这种情况和大模型 demo 里为了炫能力开的 code_run 不是一回事——demo 的 code_run 是在开发者的机器上跑，出事了开发者自己扛；生产是用户的数据、公司的服务器，出事了是安全事故。

👍 **敢的情况：** 内部工具、只读分析、固定 workspace 目录、用户是工程师、操作可回滚。比如让 Agent 在临时容器里跑 pandas 洗数据，结果只回传 artifact 文件，不碰线上服务——我接受，但仍是「带栏杆的 code_run」，不是真给一台裸机。

**和 OpenAI Code Interpreter 类比：** 别被名字误导。Code Interpreter 本质是受限 Python 运行时：无网络访问、无持久化存储、30 秒超时、内存上限、禁止系统调用。他们说这是「code execution」但不是「任意代码执行」。我们的思路类似——给 Agent 的是受限执行面，不是 Turing 完备的 shell。

**如果业务非要强执行能力怎么办？** 不传裸代码给 Agent 去跑，而是推一个 dedicated worker + 临时环境，worker 有严格的 I/O 契约，Agent 只通过 API 驱动它、不能直接进容器。边界划清楚：**Agent 负责决策，worker 负责在笼子里执行，审批负责高危放行。** 三条线上任何一条没到位，我都建议先压住不上。"
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="agent-code-safety">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">怎么保证你的 Agent 运行代码不会影响你、把你的东西都删除了？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐⭐ · 标签：Agent, 安全, 沙箱 · 考察点：代码执行隔离</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：靠沙箱锁目录、工具白名单、删改要确认、全程可审计；不靠 prompt 赌模型自觉，默认它有可能删错。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：code_run 和 Docker 沙箱区别？ · 误删了怎么恢复？ · 工具白名单怎么设计？</div>
</div>

"我的前提很简单——**Agent 能跑代码，你就要默认它有可能删错东西。把安全押在 prompt 上等于没做安全。** 我实际设计过四层防线。

**第一层：执行环境关进笼子里。**

代码只在独立子进程里跑。工作目录写死为 `/tmp/agent_workspace_{task_id}`，`$HOME`、`/etc`、系统目录一概不可见。Python 的 `os.chdir` 被 monkey-patch 禁止跳出工作目录。执行完子进程 kill，工作目录保留一段时间供审计然后清理。

**第二层：工具层白名单，不给裸 shell。**

Agent 看到的是 `read(path)`、`write(path, content)`、`patch(file, diff)`、`run_python(code)` 这种结构化 API，而不是一个 `bash` 工具。path 传入后先 `os.path.realpath()` 展开，再检查是否以安全前缀开头——比如只允许 `/tmp/agent_workspace_{task_id}` 和项目目录两个前缀，其他路径直接拒绝。Python 执行层面也会 AST 扫描禁止：`subprocess`、`os.system`、`shutil.rmtree('/')`、读环境变量、读 `/proc` 等。

**第三层：破坏性操作要人点头。**

区分「安全读操作」和「危险写操作」：
- 安全操作：读文件、列目录、搜索内容 → Agent 自由执行。
- 危险操作：`rm`、`rm -rf`、覆盖已有文件、`mv` 跨目录、批量操作 → 挂起等用户确认。

即使是要删文件，也走 **trash 策略而不是真 rm**。macOS 用 `osascript` 走废纸篓，Linux 走 `gio trash` 或软删除（改名 `.deleted_` 前缀），真出问题了还能恢复。

**第四层：可审计、可熔断、可回滚。**

每一步工具调用带时间戳、输入参数、输出摘要，写 audit log。步数、token、时间任一超限即熔断终止。被 Agent 修改的文件在操作前自动做 snapshot（copy-on-write），出问题了 diff 回来。

**code_run 和 Docker 沙箱的区别要讲清楚——**

code_run 是进程级隔离：同一个 OS、同一个文件系统（虽然限制了工作目录）、同一个网络栈。防护靠 Python 层面的限制和路径白名单。优点是轻量、延迟低；缺点是隔离面不够硬，恶意代码可能利用内核漏洞逃逸。

Docker 沙箱是容器级隔离：独立 namespace、cgroup 资源限制、独立网络栈、可以禁掉所有 capabilities。防护靠内核级别的隔离。缺点是启动开销大（秒级 vs 毫秒级）、镜像体积大。

我的策略：**实验室 demo → code_run 够用（轻量快速）；生产环境 → Docker/gVisor 是底线（隔离面够硬）。** 中间有个过渡方案是 Firecracker microVM，启动 < 200ms 但有 VM 级隔离，适合对延迟敏感的生产场景。

**如果已经误删了怎么办？** 三个兜底：被删文件在 trash 里有副本 → 直接恢复；开了快照 → diff 回来；都没有 → audit log 里能知道 Agent 删了什么路径，至少能评估损失、重建数据。所以我们设计的时候，**snapshot 是默认开的，不是可选项。**"
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="agent-infinite-loop">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">怎么防止 Agent 一直运行、死循环、自己浪费 Token？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐⭐ · 标签：Agent, ReAct, 成本控制 · 考察点：循环终止与预算</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：硬上限 + 重复检测 + 无进展熔断三道保险；到线就停、状态可恢复；宁可早停可重试，也不烧 token 空转。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：怎么判断「无进展」？ · 和 LangGraph interrupt 怎么配合？ · 不同死循环模式怎么区分？</div>
</div>

"死循环不是一种，是好几种，每种要不同的机制来兜。我先分类再讲方案。

**第一类：工具调用死循环。** 最典型——Agent 调 search，拿不到结果，继续调 search；或者写代码，跑错，改完再跑，同一个 bug 改十遍。特征是连续 N 轮调用同一个工具、参数高度相似。

**第二类：重新规划循环。** 任务复杂但 Agent 能力不够，它在'分析 → 搜资料 → 发现不够 → 重新分析'之间反复跳，每次想得不一样但都推进不了。

**第三类：思想死循环。** Surface 上看起来在做事，其实内容在重复——来回说同样的话只是换个说法。这个最难检测，因为工具不重复但语义在打转。

针对这三类，我设**三道保险、逐级触发**——

**第一道：硬天花板（对所有类型生效）。**
我设四个硬上限：
- `max_turns`：默认 25 轮，超过强制退出。
- `token_budget`：总 token 消耗预算，比如 32k，耗完就停。
- `step_timeout`：单步执行超时，30 秒没返回就跳过这一步。
- `wall_clock_timeout`：整任务 5 分钟上限，防止用户等到怀疑人生。

到了强制退出怎么做？不是直接甩一句 '任务失败'，而是把**中间结果序列化存下来**——已经写了的文件、检索到的片段、做了一半的分析——告诉用户'我做到了这里，需要继续吗？点击可以续接'。这样烧的 token 不算完全浪费。

**第二道：重复检测（主要打第一类死循环）。**
两个信号：
- 工具名 + 参数签名连续三轮一样 → 判为工具打转，系统注入 '你已连续三次调用同一工具且参数相似，请换一个策略或 ask_user'。
- Embedding 相似度：最近 5 条 assistant 消息的 embedding 两两余弦相似度，如果有连续 3 条相似度 > 0.92，判为语义重复，触发换策略或退出。EvoAgent 里有 max_turns + 空响应计数熔断，我在这基础上加了语义层，不是只看是否空，是看是否在说车轱辘话。

**第三道：无进展熔断（主要打第二、三类死循环）。**

这是最难做的一层——怎么定义'进展'？我没用一个大一统的 score，而是按任务类型挂了几个**可自动检查的状态指标**：

- 文件任务（写代码、生成报告）：文件有没有被 write？文件大小有没有增长？连续 5 步没 write 或文件大小不变 → 无进展。
- 检索任务（科研问答类）：新返回的检索结果和上一轮的 Jaccard 相似度 > 0.85 且没有新 source 出现 → 信息停滞。
- 子任务 checklist：如果任务被拆成了子任务（task_create），每步看标记了多少 complete。连续 3 步没有新 task 被标记完成 → 无进展。
- 结构变化：当前的 plan/结论句和上一步的 plan/结论句，用编辑距离衡量——如果连续几步几乎不变，说明 Agent 在空转而不自知。

这些指标不是非此即彼，是多信号融合。我项目里用一个最简单的加权机制：每个指标触发就给一个 stagnation_score 加分，累计超过阈值（比如连续 5 步 >= 2 分）就触发熔断。

**熔断之后干什么？** 不是一刀切搞死。我设三级降级：
- Level 1：缩小任务范围——'原任务太大，我先帮你做最核心的子任务'。
- Level 2：转 ask_user——'我尝试了 X 次，但 Y 没有进展，你希望我继续还是换方向？'
- Level 3：强制终止，保存状态。

**和 LangGraph interrupt 怎么配合？** interrupt 是 LangGraph 的人机检查点——某个节点执行前可以先挂起，等人审批。我把它插在降级策略的 Layer 2 后面：熔断触发后先 interrupt，把当前状态（包括 stagnation 原因）展示给人，让人决定是继续、回退还是终止。这种'机器判断 + 人确认'的组合比纯自动靠谱。

**成本上**：简单任务用小模型、少开工具；工具结果带 TTL 缓存，别每次都重新爬；产品层展示已用步数和预估剩余，用户随时 cancel。

一句话总结：**不怕 Agent 慢，怕它假装在努力。让假装努力能被机器抓到、抓到之后有优雅的退出路径——这才是生产级 Agent 循环控制。**"
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="context-memory-management">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">长上下文怎么处理？用户的对话历史、检索结果、系统指令都塞进去，context window 满了怎么办？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 标签：上下文, 记忆, LLM, RAG · 考察点：上下文工程</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：不是无限塞，是分层管理——热数据进 prompt、温数据进检索库、冷数据压缩归档；检索结果做去重和重要性排序后再入 context；历史对话滚动摘要而非全量堆。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：128k 上下文能解决所有问题吗？ · 对话摘要怎么做不丢信息？ · streaming 下的 context 怎么管理？</div>
</div>

context 窗口越来越长，我反而觉得管理比以前更关键：注意力会稀释（lost in the middle）、128k 一次调用费用是 4k 的几十倍、推理也更慢。策略是四层分层，不是无限塞。

**热数据进 prompt。** 系统指令压到 200 token 以内；最近 3 轮对话；本轮检索 Top 3-5 chunk 去重后压缩送入。

**温数据进向量库按需检索。** 每 10 轮生成一份关键信息摘要（用户偏好、已确认事实、未完成任务），存 embedding。需要历史时检索 Top 3 摘要塞进 prompt，4k token 摘要能覆盖 50 轮关键信息。

**冷数据存结构化字段。** 用户画像 JSON 存在 profile 里，只在相关场景注入，比如检测到数学问题才注入 LaTeX 偏好。

**归档数据做最终合并。** 30 轮以前压成 50 token 全局摘要，不再全量检索。

对话摘要强制包含三部分：事实确认、否定记录（用户纠偏极易丢）、未完成任务。streaming 下 context 在 generation 启动时快照冻结，新消息等当前生成结束再构建，避免竞态。Context 管理不是省空间，是让模型注意力落在对的 1% 上。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="cost-optimization">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">你的 LLM 应用怎么控制成本？每天几千次调用，token 账单怎么降？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 标签：成本, LLM, 优化, 缓存 · 考察点：省钱</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：模型阶梯路由（小模型先上、搞不定再大模型）、语义缓存防止重复调、prompt 和 context 精简、批处理异步化——四管齐下能把成本压 40%-60%。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：缓存命中率怎么提？ · 什么时候用自部署模型？ · GPT-4o 和 Claude 怎么选？</div>
</div>

demo 阶段不看账单，上了生产 CFO 会看。我按省钱幅度从大到小讲四招。

**模型阶梯路由，省最多。** 分类/格式转换走 4o-mini 或本地 Qwen2.5-7B；摘要翻译走 4o；多步推理和代码走最强模型。规则看 query 长度、是否含代码，再加意图分类器。我们 60% 请求是简单任务，整体 API 成本降了约 55%。

**语义缓存防重复。** Redis 存 embedding，相似度 >0.92 直接返回，延迟 <5ms。key 是 embedding 不是字符串，「AlphaFold3 是什么」和「什么是 AlphaFold3」能命中。TTL 按时效性设，学术问题 7 天，天气 1 小时，命中率 15%-25% 正常。

**prompt 和 context 做减法。** system prompt 从 800 token 砍到 200，效果持平。检索 Top 10 先 rerank 取 Top 5，同模块多版本只送最新，输入 token 砍半。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="error-degradation">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">你的 LLM 应用如果挂了怎么处理？LLM API 超时、返回乱码、向量库崩了——怎么保证用户不看到 500？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 标签：可靠性, 降级, 容错, LLM · 考察点：故障应对</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：三级降级——向量库挂走关键词、LLM 挂走 FAQ、整体挂展示缓存——每一级都有对应的监控和自动切换，降级路径在生产前全测过。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：降级后用户体验差怎么办？ · 什么时候自动重试、什么时候不重试？ · 怎么区分是 LLM 的问题还是你自己代码的问题？</div>
</div>

LLM 应用的错误不是会不会发生，是什么时候发生。我按四类故障讲。

**LLM API 挂了/超时。** 指数退避重试三次，失败开 circuit breaker 10 秒，直接降级：返回检索结果列表加「AI 暂不可用，请查看以上文档」。streaming 中途断开，已产出 token 保留，标注「回复中断，点击重试可继续」。

**向量库挂了。** 降级到 BM25 关键词检索，提示「当前为基础检索模式」。向量库连续 3 次 health check 通过后自动切回。

**输出格式错误/乱码。** 先 json_repair 修复，不行提高 temperature 重试一次，还失败就返回原始文本不走结构化解析。LLM 连续两次 invalid 就降级 ask_user，不是代码 bug。

**自己代码的 bug。** 每环打结构化 log 带 trace_id：LLM 返回正确 JSON 但工具报错是工具 bug；参数不符合 schema 把 violation 塞回 context 让 LLM 自修正。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="evaluation-system">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">你的 LLM 应用怎么评估效果？怎么判断改好了还是改坏了？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 标签：评测, LLM, RAG, 质量 · 考察点：评估方法</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：离线评测保底线、在线指标看体验、人工抽检做校准——三层评估，每层看不同东西，改一次跑一次回归。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：没有 ground truth 怎么评？ · LLM-as-Judge 靠谱吗？ · 线上指标有哪些？</div>
</div>

面试官问这个，其实在看你有没有可复现的效果判断机制，不是「看着还行」。我分三层。

**离线评测，改代码前先跑。** 黄金评测集从生产日志挖，200-500 条真实 query + 标准答案做 seed，badcase 持续回流。六个维度：Recall@5、Precision@5、答案正确性、引用忠实度、拒答合理率、格式遵循率。每次改 prompt/模型/检索策略画雷达图，哪个涨了哪个跌了。

**在线指标，上线后盯。** 效果：点赞率、复制率、追问率，点踩超 10% 拉 case。性能：P50/P95/P99 延迟。成本：每分钟 token 曲线。安全：moderation 触发、空检索率、5xx 错误率。

**人工抽检做校准。** 每天随机抽 30 条人工打分。LLM-as-Judge 有盲区，人工是校准锚——Judge 和人工偏差变大就换 Judge 或调 prompt。没有 ground truth 用多模型交叉验证，偏差大的 case 自动升人工 review。Judge 要比被评模型强一档，要求先输出 reasoning 再打分。

评测基础设施要轻量：一条命令跑完六维度 + 雷达图，CI 里 PR 自动跑，回归掉了 block merge。不跑评测就上线，等同不跑测试就合并。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="finetune-forgetting">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">微调怎么保证灾难性遗忘风险？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 标签：微调, QLoRA, 遗忘 · 考察点：持续学习风险</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：QLoRA 只训 adapter 不动基座、数据掺通用样本、小学习率早停、双验证集盯两头——训完跑回归对比看有没有变傻。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：全参微调 vs LoRA？ · 怎么评估遗忘程度？ · RLHF 阶段会有遗忘吗？</div>
</div>

"灾难性遗忘就是模型在领域任务上变强了，通用能力却突然掉下去——你发现模型能精准回答科研术语了，但让它做个简单的数学推理，开始胡说八道。我实际做 QLoRA 微调时踩过这个坑，总结了一套**别动太多、别训太狠、训完要测**的策略。

**第一，选 QLoRA 而不是全参微调。** 全参微调等于是把模型的所有神经元都拧了一遍，参数偏离 pretrain 分布太远，泛化能力必然受损。QLoRA 的 trick 是基座权重冻住不动，只训额外的低秩 adapter——参数量大概是基座的 0.1% 到 1%。这意味着模型'忘记'的能力上限就被 adapter 容量上限压住了。而且 QLoRA 还做了 4-bit 量化，7B 模型一张 24G 显卡就能跑，资源友好。代价是极限领域能力比全参弱一点，但对我来说**遗忘风险和训练成本比那点能力差距重要得多**。

**第二，数据掺通用样本。** 纯领域数据训出来的模型有个诡异现象——它会用领域术语回答一切问题。你问'今天天气怎么样'，它回'根据 2024 年气象学综述...'。所以我的训练数据是：领域指令大概占 75%-80%，混 15%-20% 通用 QA（OpenAssistant、Dolly 这类开源通用数据），再加 5% 的'拒答'样本（教模型说'我不知道'）。配比不是拍脑袋——我们用不同比例跑了 ablation，80/15/5 这条线的通用能力下降最少而领域能力接近 best。

**第三，训练策略别太猛。** 学习率从基座的 1/10 到 1/100 之间扫，我的经验是 2e-5 附近最稳。大学习率、多 epoch 是遗忘的加速器——Loss 曲线往下走你看着高兴，回头跑通用评测就哭了。我的止损策略：每个 epoch 后不只看验证集 loss，还要跑一组**通用探针集**——10 道数学推理、10 道常识问答、10 道格式遵循——通用探针的准确率或 loss 一旦开始显著恶化，立刻早停。很多时候 epoch 1 就够了，再多就 overfit 到领域分布上了。

**第四，训完系统和基线对比。** 不是看几个 case 说'好像没变笨'。我建一套固定的回归测试：100 道通用 MMLU 子集 + 20 道拒答 + 20 道格式约束。微调前跑一遍记 baseline，微调后同一批问题再跑一遍，逐题对比有没有 regress。还可以做一个路由判断——简单问题走基座回答，复杂领域问题走 adapter，相当于推理时动态选择分支。

**RLHF/DPO 会有遗忘吗？** 会。RLHF 阶段 reward model 只奖励「人类喜欢的回答」，不会惩罚「模型忘了的东西」。所以 DPO 之后通用能力下降是真实存在的。解法类似：偏好对里混入一定比例的通用正确回答 vs 错误回答作为正负样本，不要让模型只学到'讨好'。

**诚实收个尾：没有零遗忘的银弹。** LoRA/QLoRA 是目前性价比最高的折中。如果业务既要强领域又要强通用，两条路：一是定期 refresh 通用数据做多 adapter，推理时按场景切；二是做 adapter merging——训多个专项 adapter 再按权重融合，但融合质量很看手艺。"
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="finetune-vs-faithfulness">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">微调的目的是什么？微调和引用校验的关系是什么？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐⭐ · 标签：微调, RAG, 引用校验 · 考察点：SFT 与 RAG 分工</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：RAG 负责把资料找对，微调负责把话说好、说像人、少 AI 腔；引用校验是生成后的最后一道 guard，微调能减轻它的负担但永远替代不了它。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：只有 RAG 不微调行不行？ · 引用校验通过率怎么从 70% 提到 90%？</div>
</div>

"这道题面试官其实在考察你**有没有把三个环节的分工想清楚**。很多同学把微调当成万金油——幻觉严重了微调一下、引用不对微调一下——这是滥用。我拿科研问答项目的实际数据说。

**先讲我们踩过的坑。** 项目初期只有 RAG + prompt，没有微调。表现是：检索其实把正确段落找到了，但基座模型输出就是不按给定上下文来——它更相信自己 pretrain 时记住的版本。比如检索到的论文是 2024 年 3 月的实验结果，模型偏要输出 2023 年类似实验的数据。另一个毛病是引用格式乱——我们要求的格式是 `[1] 作者等. 标题. 期刊, 年份.`，模型经常自己发明格式或者直接忘了引。

**所以我做 QLoRA 微调，目标非常窄，不是教模型新知识，是教模型「听话」：**
- 基于给定上下文作出的 claim，必须有出处；没出处就别硬编，输出「信息不足」。
- 术语风格收敛到学术写作规范。
- 引用格式稳定输出固定模板。

我训了大概 1800 条指令，这个量不是为了覆盖知识面，而是为了让模型在 100 种不同的引用场景下都学会同一套行为规则。

**微调对引用校验有什么影响？** 引用校验是我的 pipeline 里生成之后的独立模块——拿输出的每一句话，提取它声称的来源，回查原始检索片段做 entailment。微调前引用通过率是 72%，微调后到了 86%。提升来自两个方向：一是格式稳定了，校验器解析引用的成功率从 78% 提到 95%——之前格式乱的时候校验器经常 parse 失败直接 reject；二是模型学会了「没把握就说信息不足」，从根源上减少了需要校验的可疑 claim。

**引用校验通过率怎么进一步提到 90%？** 剩下的 4% 不是微调能解决的——跨文档张冠李戴、长尾知识库覆盖不全、以及 citation 格式对了但 claim 和原文微妙不符。这需要校验器升级：从规则匹配到 NLI model（我们用的是 DeBERTa-v3-base fine-tune 的 entailment 判别），再加一层 LLM-as-judge 处理规则搞不定的歧义 case。

**三者关系我给一句口诀：RAG 管 recall（找到没有），微调管 behavior（说好没有），引用校验管 faithfulness（说得对不对）。**

面试官可能会问：只有 RAG 不微调行不行？我的回答是——看业务对风格和稳定性的要求。如果只是内部用的检索助手，prompt engineering 可能够用；如果要对外输出、要稳定的引用格式、要看起来专业——微调的 ROI 是正的。1800 条指令的训练成本很低，但引用通过率提 14 个百分点，上线 review 的人力成本降了大概一半。

反过来只有微调不 RAG 也不行——知识会过时，幻觉压不住。微调把「怎么说话」调好了，但知识还是得靠 RAG 实时注入。**三者是 pipeline 里的前后衔接，不是二选一的关系。**"
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="function-calling-design">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">Agent 的工具（Function Calling）怎么设计才能稳定调用？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 标签：Function Calling, Agent, 工具设计 · 考察点：工具定义</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：每个工具只做一件事、参数少而精、description 包含正例和反例、error 返回结构化而非纯文本——定义好，模型才可能调对。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：工具太多模型选错怎么办？ · 并行调用怎么设计？ · tool call 解析失败怎么兜底？</div>
</div>

Function Calling 看着简单，生产上模型选错工具、参数乱填、循环调用是日常。我总结五条原则。

**单一职责。** 别搞一个 `search_database` 加 mode 参数，拆成 `search_docs`、`search_code`、`search_tables`。工具名就是分类标签，多一步 mode 推理就多一个出错点。

**description 写正反例。** 说清楚干什么、什么时候用、什么时候不用。用户说「请问你能帮我查一下向量数据库和传统数据库的区别吗」，query 应填「向量数据库 与传统数据库 区别」，去掉礼貌用语。

**参数少而精。** 超过 4 个参数模型就开始丢。能 enum 别 free text，排序依据用 `date/relevance/citations` 三选一比自由发挥准得多。

**错误返回结构化 JSON。** 返回 `error_type`、`suggested_fix`、`retry_possible`，Agent 可以程序化分支：`FILE_NOT_FOUND` 走 list_dir，`PERMISSION_DENIED` 走 ask_user。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="hallucination">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">幻觉是怎么产生的？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 标签：LLM, 幻觉, RAG · 考察点：幻觉机理与治理</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：模型训练目标是 token 续写不是事实校验；知识盲区、上下文缺失、解码策略都会催生幻觉；RAG 加引用校验能大幅降但不能绝。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：哪种幻觉最难治？ · 和 creativity 怎么平衡？</div>
</div>

"我拿我项目里一个真实 bug 开头，面试官一下就能听懂问题在哪。

我们科研问答系统有个 case：用户问'2023 年 AlphaFold3 在蛋白酶设计上的最新进展'，模型答得头头是道，引用也标了。上线前 review 发现——AlphaFold3 的论文 2024 年 5 月才发，这篇论文根本不在我们的知识库里。模型是把 AlphaFold2 的论文片段和'新一代 AlphaFold 可能会...'这种推测性表述拼接起来，自己编了一篇'进展报告'。

这个 case 把幻觉的三种成因全暴露了。我分三层讲——

**第一层：模型本身的设计目标。** 预训练是 next-token prediction，loss 函数不问'这句话是真的吗'，只问'下一个 token 概率最高的词是什么'。模型看到 'AlphaFold' 后面高频跟着 '用于蛋白质结构预测，由 DeepMind 开发'，它就这么继续写下去，不会停下来想'我到底知不知道这件事'。这跟人背课文背串了是一个道理——流畅不代表正确。

**第二层：上下文问题，这是 RAG 场景里最头疼的。** 常见三类：
- 检索**漏了**：应该召回 A/B/C 三篇，只召回了 A。模型用参数里残存的过时信息补 B 和 C 的内容，补出来的全是编的。
- 检索**打架**：A 论文说方法 X 效果好，B 论文说方法 X 不行。模型不是分析谁更有道理，而是混在一起输出'方法 X 在多数情况下有效，但部分实验表明...'——把两个矛盾的结论拼成一句看似辩证的话，实则不知所云。
- **Lost in the middle**：context 一长，中间的段落注意力权重掉下去，模型就只吃头和尾，中间的关键事实直接丢了。

**第三层：解码策略推波助澜。** temperature 一高，模型倾向于选择不那么确定的 token，这本身不是坏事——但配合 prompt 里'请详细说明''请全面分析'这类指令，模型就主动填细节。没依据也填，因为它被训练成'不能只说不知道'。

**最难治的幻觉**，我的体会是**跨文档张冠李戴**。A 的实验条件 + B 的数值结果 + C 的结论，一句话里三个事实来自三篇论文，单个引用校验都过不去、但拼起来又看不出来——因为我们验证的时候是一句一句验，交叉拼装式的幻觉逃过了粒度。

**和 creativity 怎么平衡？** 看任务。写代码、创意写作，可以给它空间；事实密集型任务——医疗、法律、科研——我会把 temperature 压到 0.1，强制要求逐句 cite，生成后再过引用校验。本质上不是压 creativity，而是给 factual 任务默认走保守模式，creative 任务手动开 high-temp。

**治理的实际情况**：RAG 召回从 BM25 换到 hybrid + rerank 之后，幻觉率从大概 18% 降到了 9%；加引用校验又降到 4.5% 左右；剩下的是最难啃的——跨文档拼装、长尾知识、模型'不知道但硬编'。我的态度是：**承认幻觉不可能消灭，按业务容忍度设阈值，低置信度走拒答或 ask_user，别让用户以为'AI 说的都是对的'。**"

**追问话术（面试官深挖时）**：
- 「幻觉和 creativity 本质是一个硬币的两面——学会什么时候展现哪一面，靠的是任务路由和校验链路，不是改 temperature。」
- 「我们测过一个反直觉的发现：prompt 里写 'don't make things up' 对减少幻觉的帮助远小于'必须每句话标注出处，无出处就写 [信息不足]'——强行要求格式比善意提醒有效得多。」
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="langgraph-vs-langchain">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">LangGraph 和 LangChain 有什么区别？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 标签：LangGraph, LangChain, 编排 · 考察点：框架选型</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：LangChain 是组件库加链式拼接，适合一条线走到底的 RAG；LangGraph 是有状态图执行引擎，适合带循环、分支、人工审批点的 Agent 流程。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：什么场景必须用 LangGraph？ · 和纯 while 循环比优势在哪？ · LangGraph 的坑有哪些？</div>
</div>

"我两个都在项目里用过，体感差异特别明显。

**LangChain 本质上是一个「LLM 应用的乐高箱」。** 它给你 LCEL（LangChain Expression Language）用 `|` 管道把 retriever、prompt、LLM、output parser 串成一条链，代码写起来确实比裸调 API 干净很多。适合的需求是「上下文塞进去 → 答案吐出来」这种 DAG 型任务。

问题出在一旦你的流程不是一条直线——你要 loop、回退、分支、暂停等人审批——用 Chain 写就开始绕。要么在 Chain 外面套 while 循环，要么在 prompt 里靠 LLM 自己决定下一步，这两种方式测试和调试都痛苦。

**LangGraph 解决的就是「不是一条线」的流程。** 它把任务建模成有向图：每个 node 是一个步骤，edge 是转移条件（可以是 LLM 判断、规则、甚至函数返回值）。State 是显式的 schema，每一步都能 checkpoint 到外部存储，所以你可以随时暂停、恢复、回退。我的科研问答里有一个典型的 Graph 流程：Retrieve → Grade documents → 不够好就 Rewrite query 回到 Retrieve → 够了就 Generate → Citation check → 不通过就回到 Generate。这种带环的流程用 Chain 得写一堆 try-except 嵌套，用 Graph 画张图就讲清楚了，测试也可以按 node 独立测。

**什么时候必须用 LangGraph？** 我的判断不是「流程复杂就上」，而是看三个标志：
- 有没有**循环依赖**？Retrieve → Judge → Rewrite → Retrieve 这种。
- 要不要**持久化中间状态**？任务跑了 5 步用户关了，明天打开能继续而不是从头来过。
- 要不要**人机协同中断点**？某个关键步骤执行前挂起等人审批，人点了「继续」再往下走。

三个都没有——一个单 Agent 加 while ReAct 循环就够了，上 LangGraph 反而增加学习成本。但凡沾一个，LangGraph 的优势就很明显。

**和纯 while 循环比，LangGraph 好在三个工程维度：**
- **可恢复性**：while 循环崩了就没了，LangGraph 每一步有 checkpoint，崩溃后可以从最后一个完成的 node 重放。
- **可观测性**：node 之间显式传 state，debug 时直接看 state 快照，不用在 while 循环里打 log 猜走到哪了。
- **可测试性**：每个 node 是独立函数，mock 上游 state 直接测，不依赖整个链条跑通。

**LangGraph 的坑我也分享一下，别让面试官觉得你盲目吹：**
- State schema 设计一开始容易太粗或太细，重构成本高。建议从最小 schema 起步，边用边加字段。
- Node 粒度要平衡——太细了 overhead 大（每个 node 都是一次 LLM call），太粗了失去可见性。
- 条件路由的 prompt 容易不 stable，导致流程走错分支。要加 fallback 和超时兜底。

**我的实际用法是组合——** 编排用 LangGraph，底层组件用 langchain_core 的 retriever、message 类型、prompt template 这些，不绑死 `langchain` 全家桶。工具装饰器用 function calling 原生的，不额外套一层 LangChain tool abstraction。这样既享受了图编排的灵活性，又没被框架绑架。"
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="multi-agent">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">多 Agent 是什么？有什么好处？你怎么理解？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 标签：Agent, 多Agent, 架构 · 考察点：协作模式与适用边界</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：多 Agent 是有明确角色分工和工具边界的协作体，不是多个聊天框并行；复杂长链路值得上，简单问答上反而是过度设计。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和单 Agent 多工具比何时需要多 Agent？ · 怎么避免 Agent 互相扯皮？</div>
</div>

"我先说一个我实际遇到的场景，再说好处和边界——这样比背定义有用得多。

**真实场景：科研论文综述生成。** 用户给一个研究主题，期望输出一份带引用的小综述。如果用一个 Agent 做，流程是：理解主题 → 检索 → 读论文 → 写初稿 → 查引用 → 改稿 → 输出。问题在哪？同一套 prompt 既要读论文又要写论文还要查引用，prompt 又长又容易顾此失彼，7 步里只要一步卡住整个流程就断。

拆成多 Agent 之后：
- **Retriever Agent**：只负责把检索词变着花样搜、去重、按质量排序，输出结构化论文列表。
- **Reader Agent**：逐篇读摘要和关键段，输出结构化笔记（方法、结论、局限）。
- **Writer Agent**：拿笔记写初稿，按 section 组织，每句标注出处。
- **Citation Checker**：逐句回查原文，标出「引用了但找不到出处」的句子上报。

四个 Agent 各只有一个 prompt、各只开自己的工具。Retriever 搜不到怎么办？不是硬编答案，而是返回 `{"status": "insufficient_sources"}`，Writer 收到就输出「该方向文献较少」而不是编一段。这就是多 Agent 第一个好处——**职责单一才能做好，prompt 短了准确率才上得去。**

**好处我从踩坑里总结出四个：**

一是**专精**。不同 Agent 可以用不同的模型——Retriever 用轻量小模型省成本，Writer 用最强模型保质量，Citation Checker 甚至可以用规则引擎不需要 LLM。这和单体 Agent 所有步骤都消费大模型 token 完全是两笔账。

二是**解耦可维护**。改 Writer 的写作风格不会碰坏 Retriever 的检索逻辑。我们上线后用户反馈'引用格式不对'，我只调了 Citation Checker 的验证规则和一版 prompt，其他三个 Agent 一行没动。

三是**并行加速**。Retriever 在搜论文的时候，Reader 可以先读缓存的已有笔记；多个 Reader 可以同时读不同论文。多 Agent 架构天然支持子任务并行。

四是**可审计**。每段文本知道是谁生成的、每处引用知道是谁校验的。出了问题能说清是 Retrieval 层面没找到、Reader 层面没读懂、还是 Writer 层面编的——而不是'黑盒输出的锅'。

**但我不会什么都上多 Agent。我的判断标准是两条：**

一、任务有没有**稳定的子任务边界**？论文综述有检索 → 阅读 → 写作 → 校验，接口清晰。但一个「帮我查下北京明天天气」的问答，拆成谁查天气谁写回复？过度设计了。

二、子任务之间有**独立的失败模式**吗？检索失败不等于写作失败，检索可以重试，但写作已经拿到了检索结果就不该回到起点——这种需要独立重试策略的场景，多 Agent 才有价值。共享重试策略的单体就够了。

**最多人问的风险——Agent 互相扯皮。** 我吃过这个亏。最早的设计是 Writer 觉得 Reader 笔记不够详细，就让 Reader 重读；Reader 重读后还是差不多的笔记，Writer 再催——两边 ping-pong。

后来我加了两条硬规则：
- **消息结构化为 JSON Schema**，每个 Agent 的输出必须 conform 固定格式。不会出现 Writer 说'再详细点'这种模糊指令，而是要求 `{"require_fields": ["sample_size", "p_value"], "source_id": "paper_042"}`。
- **Orchestrator 有最终决定权。** 不是 Agent 之间投票，也不是谁嗓门大听谁的。Orchestrator 设好每个子任务的超时和最大重试次数，Writer 要求 Reader 重读超过 2 次，Orchestrator 直接终止循环，标记该论文为'信息不完整'继续往下走。
- 所有消息带统一的 trace_id，方便回溯到底哪一环节、哪个 Agent 的决策导致了最终问题。

**一句话：多 Agent 的价值不是'多'，是'每个 Agent 只做它能做好的一件事'。如果你没法把一个任务拆成这样的独立单元，那别拆——一个 Agent 加好工具就够。**"

**追问话术（面试官追问多 Agent 开销时）**：
- 「多 Agent 多出来的 token 开销主要花在 Agent 间消息传递上。但单体 Agent 处理长链路时的重试成本和对上下文窗口的浪费通常更高——我们在综述生成上对比过，多 Agent 方案总 token 消耗反而低了约 18%，因为每个 Agent 的 prompt 短、context 干净、失败后只重试自己的子任务。」
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="political-content">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">如果用户提出一些政治方面的问题，我应该怎么处理？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面/HR · 难度：⭐⭐⭐ · 标签：安全, 合规, 内容审核 · 考察点：拒答与边界</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：不是靠 prompt 写一句「不许聊」，而是输入分类 → 输出审核 → 产品边界三层兜底，敏感原文不入普通日志。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误杀正常问题怎么办？ · 输入分类怎么做？ · 产品和研发怎么分工？</div>
</div>

"这个问题我会从**三个真实场景**切入讲，而不是背规则。

**第一个场景：纯越狱试探。** 比如用户直接问敏感事件、让你站队、让你生成特定观点。这类处理最简单但也最底层的防线：输入侧做**敏感词加分类模型**双路拦截。敏感词是确定性规则，命中直接拒答；分类模型我用 DistilBERT 或小参数量模型做 fine-tune，把 query 分成 normal/political/offensive/ambiguous 四类，前两类直接拒、ambiguous 降级处理。这块的准召我们实际测下来 F1 能到 92% 左右，剩下 8% 靠输出侧兜底。

**第二个场景：打着研究旗号刨根问底。** 比如「帮我分析 XX 事件的各方立场」「XX 政策对经济的影响你怎么看」。这类不是关键词能拦的，要靠**意图层判断**——prompt 里不做开放讨论、不假装中立分析，system 层面把角色定死在「专业工作助手」而非「讨论伙伴」。碰到灰色地带走 ask_user 还是直接拒，由产品定边界、研发实现规则引擎。

**第三个场景：正常业务被误杀。** 比如做政务大数据、政策咨询、法律文书，用户的问题里天然有政府部门名称、政策条款编号。这里不能用简单关键词匹配，得靠分类模型的上下文理解。误杀了怎么办？产品侧给申诉入口，日志里标明「误杀 — 用户主动反馈 — 已豁免」，并且**误杀和真命中走不同的日志表**——真命中的只记类别和次数，原文不入库，避免合规风险；误杀的存原始 query 方便做 badcase 回流和模型迭代。

**输出侧**我也会过第二道关。生成结果是 RAG 召回的片段拼接出来的吗？是不是引用了不该引用的源？输出 moderation 检查的不是关键词而是**断言**——模型有没有在输出里表达立场、做出超越知识范围的判断。检出就替换成统一拒答模板，而不是删掉敏感句假装没说过，那反而更危险。

**产品和研发怎么分工？** 产品负责：定义服务范围（写进用户协议）、制定拒答话术和申诉机制、决定哪些场景需要 human review。研发负责：敏感词库维护、分类模型训练迭代、输入输出 moderation pipeline、日志分级存储策略、定期红队测试。

最后，如果面试官追问「你怎么看 XX」，我会说：我不在本次面试中展开讨论，但我可以聊我的处理框架——**区分事实检索和观点输出、区分信息整理和立场表达、区分工程问题和政策问题**，这三条线画清楚，产品就不会出事。"

**追问话术（面试官追到边界时）**：
- 「宁可误拒也不误放。误拒可以申诉恢复，误放的代价承受不起。」
- 「不是技术决定什么不能说，是产品边界决定，技术保证这个边界被严格执行。」
- 「如果业务本身有合规资质需要讨论特定话题，走人工审核通道，不过 Agent 自动回复。」
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="prompt-engineering">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">你怎么做 Prompt Engineering？有方法论吗？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：Prompt, LLM, 工程方法 · 考察点：提示设计</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Prompt 不是玄学调参——我用结构化模板、few-shot 示例、加上版本控制评测，改一次测一次，靠指标说话不靠感觉。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：system prompt 和 user prompt 怎么分工？ · prompt 太长怎么优化？ · CoT 什么时候有用什么时候没用？</div>
</div>

Prompt Engineering 不是玄学调参，是用工程方法控制 LLM 行为。我实际用四步法。

**模板化。** 固定五块：角色定义、上下文、任务描述、约束条件、输出规范。改输出格式只动 Output 模块，不同任务复用同一套 JSON schema template。

**few-shot 精选不堆量。** 3-5 个高质量示例覆盖正常、边界、负面三种 case。用 embedding 动态选和当前 query 最相关的 few-shot，不每次发同一批。

**system 和 user 分工。** System 管「能不能做」——角色、边界、全局规则；User 管「这次做什么」——具体 query 和当前 step。分开才好定位是规则设错还是输入没传对。

**改一次测一次，版本管理。** 每次改完跑回归测试、边界测试、成本测试。prompt 和代码一样 git 管理，commit 写清楚为什么改、预期提什么指标。CoT 适用于多步推理和数值计算，简单事实查询反而想多了；prompt 里写「需要推理请逐步展示，事实查询直接回答」比一刀切效果好。好的 prompt 能版本控制、能跑评测、能说清楚每次改动提了多少分。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="rag-chunking">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">RAG 系统中文档切分怎么做？有哪些坑？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐⭐ · 标签：RAG, Chunking, 数据处理 · 考察点：切分策略</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：看文档类型选策略——结构化用语义分块、非结构化用滑动窗口加 overlap、表格另存 metadata；切太小丢上下文、切太大损失精度，256-512 token 是常见起点。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：语义分块怎么做？ · 表格怎么处理？ · chunk 大小怎么调？</div>
</div>

文档切分是 RAG 第一脚刹车，切坏了后面检索再好也救不回来。我科研问答踩过三个坑。

**坑一，一刀切不分文档类型。** 论文、网页、Markdown、PPT 格式完全不同，统一 `chunk_size=512` 会把 PDF 表格切碎。论文按 section 切，表格整表独立 chunk；Markdown 按标题层级；QA 按 pair；代码按 AST 函数/类边界。

**坑二，chunk_size 拍脑袋。** 先看 embedding 模型有效窗口，text-embedding-3-small 和 bge-large 都是 512 token。通用 256-512 + overlap 10%-20%；论文 512-1024；代码按完整函数不硬截。用评测集遍历 128/256/512/768/1024 看 Recall@5，我们论文最优 384、技术文档 256。

**坑三，overlap 设了就完事。** overlap 太大相邻 chunk 高度重复，下游 LLM 困惑。我按标点断句，宁可 chunk 稍大也不在句中砍断；非砍不可时保证 overlap 覆盖完整句子。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="rag-production-checklist">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">简历 RAG 项目上线前，需要考虑什么？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 标签：RAG, 上线, 工程 · 考察点：生产 checklist</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：先拿评测集证明质量、再保 P95 和成本、然后鉴权限流监控索引更新——实验室 demo 和上线之间差的就是这五件事。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：先做哪三项？ · 和实验室最大差距在哪？ · 什么时候判断「可以上了」？</div>
</div>

"我科研问答从 demo 到真正对外能用，花了两个月。这中间填的坑比写 demo 多得多。我说五件事，每件都是实际踩过的。

**第一，评测集——没有数据就没资格说「能上线」。**

我坚持不用「跑几个 case 看着还行」当上线标准。必须有一套黄金评测集，至少覆盖这些维度：
- Recall@K：检索能不能把该用的段落找回来。
- 引用正确率：claim 和出处对得上吗？有没有编造的引用？
- 拒答率：该说「信息不足」的时候有没有硬编？
- 边界 case 专项：跨文档场景、术语缩写歧义、否定查询（「不是 XX 的 YY 是什么」）、超长上下文 lost in the middle。
- 时效性：新入库文档的召回有没有及时生效。

评测集不是一次性的，是活的——badcase 回流持续补充新 case。我上线前跑这堆指标画了张雷达图，哪个维度不足一眼能看见。

**第二，性能——用户等不了 3 秒。**

我们的 P95 延迟从 3.2 秒压到 1.2 秒，排查下来瓶颈不是 LLM，是 rerank 和 embedding 的串行调用。解法：
- 连接池复用，不要每次请求都建新连接。
- 批处理：多 query 的 embedding 一次请求发完；rerank 支持 batch score。
- 异步：embedding 和 BM25 检索并行，不是先等一个再等另一个。
- 索引预热，尤其是冷启动的加载时间要测。

成本上要做并发压测，知道 QPS 到多少的时候 token 消耗和费用扛不住，提前设好限流阈值。别上线第一周就收到云厂商账单吓一跳。

**第三，可靠性——挂了一个组件别整站 500。**

向量库挂了怎么办？LLM API 超时怎么办？要三级降级：
- 向量库挂 → 退到纯 BM25 关键词检索。
- LLM 超时或不可用 → 返回检索结果列表 + 「AI 暂不可用，以上是搜索到的相关文档」。
- 整体不可用 → 固定 FAQ 兜底，别给用户看 nginx 502。

每一级降级都要有对应的监控告警，而且降级本身也要测——很多人上线前只测正常路径，第一次碰到降级就是在生产事故现场。

**第四，安全——不是可选项。**

ToB 场景尤其要重视：
- 鉴权和租户隔离——A 公司的用户不能搜到 B 公司的文档。向量库里加 tenant_id 过滤，不是靠 prompt 隔离。
- 文档级权限——有些文档全公司可见、有些只部门可见、有些是机密。检索时按用户身份动态过滤。
- 防 prompt 注入——用户输入里夹带恶意指令是 classic attack。简单做法是 query 重写时清洗，复杂做法是 LLM firewall 做意图判断。
- 敏感信息脱敏——生成结果里如果包含了原文中的手机号、身份证号，输出前要过正则脱敏。安全是一个 pipeline 不是一步操作。

**第五，运维——上线只是开始。**

- 监控大盘：QPS、P50/P95/P99 延迟、错误率、空检索率（用户问了但什么也没搜到的比例）、token 消耗趋势。
- 索引要能增量更新、能回滚——新文档入库不能等全量重建，索引出问题了能一键切回上一版本。
- 反馈收集：用户点「有用/无用」的按钮比什么都重要，坏 case 自动回流评测集。
- A/B 实验框架：prompt 改了、检索策略改了，先上 5% 流量看指标再全量推。

**如果面试官问「先做哪三项」，我会说：评测集 + 引用校验链路 + 监控告警。** 这三件做完了，你才有底气说「能上」，上了之后才知道往哪改。

**什么时候判断「可以上了」？** 我自己的标准：引用正确率 > 85%、拒答率不到 10%（该拒的时候拒了）、P95 < 2 秒、压测到目标 QPS 的两倍不崩、降级路径全测过一轮。这五条都过了，我就敢推上线。

**实验室到生产的最大差距是什么？** 不是技术有多难，是**工程习惯**。实验室里你关心「效果好不好」，生产上你更关心「坏了怎么办」「慢了怎么办」「被攻击了怎么办」。从 demo 到上线，差的就是这三问的答案。"
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="skill-reuse-detection">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">在保存一个 skill 后，怎么能再有一个任务可以检测到两类任务是同一类，然后复用这个 skill？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 标签：Agent, Skill, 记忆 · 考察点：任务相似度与 SOP 复用</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：任务进来先打意图标签跑粗筛、再语义检索做精准匹配；相似度高直接加载 SOP 执行；执行后验证成败，决定留存还是降权。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和纯向量记忆比？ · skill 过时怎么办？ · 误匹配怎么防？</div>
</div>

"这个问题本质是**怎么让 Agent 积累经验而不是每次都从零摸索**。我分三步讲：SOP 长什么样、怎么匹配、怎么防止匹配错。

**第一步：SOP 长什么样。**

不是把整段对话存成 embedding。我们存的是一份**结构化程序**，字段大概是：

```yaml
skill_id: "pdf-batch-merge"
trigger_intent: ["pdf", "merge", "batch", "combine"]
task_description: "把多个 PDF 文件合并为一个，输出到指定目录"
preconditions: ["输入路径下有多个 PDF", "输出目录可写"]
steps:
  - step: 1
    action: "list_files"
    params: { pattern: "*.pdf", recursive: false }
  - step: 2
    action: "ask_user"
    params: { question: "确认合并以下 {file_count} 个文件？" }
  - step: 3
    action: "run_python"
    params: { library: "pypdf", script_template: "merge_pdfs.py" }
  - step: 4
    action: "write_file"
    params: { path: "{output_dir}/merged.pdf" }
success_criteria:
  - "output file exists and size > 0"
  - "output page count == sum(input page counts)"
tools_used: ["list_files", "ask_user", "run_python", "write_file"]
avg_turns: 5
success_rate: 0.94
last_used: "2026-06-15"
```

关键设计：**trigger_intent 和 task_description 是两层检索用的，steps 是执行的依据，success_criteria 是执行后验证的标准。**

**第二步：怎么匹配——两层检索引擎。**

新任务进来，用户说「帮我把这几个 PDF 合成一个」。不直接跑语义检索，先过一层**意图标签**。

Layer 1：意图标签粗筛。用小模型（比如 fine-tune 过的 T5-small 或者直接用 LLM 做 few-shot 分类）把任务打到预定义的意图类别上：`pdf_processing / data_analysis / email / file_organization / web_scraping` 等。这一步 O(n) 扫所有 skill 的 trigger_intent 字段，命中同类的 skill 进入候选池。标签分类的延迟大约 50ms，缓存热标签更快。如果同类 skill 只有 1 个，直接命中；如果有多个，进第二层。

Layer 2：语义相似度精排。对 task_description 和用户 query 分别做 embedding（我用 text-embedding-3-small 或本地的 bge-large），算余弦相似度。设两个阈值：
- `SIM_HIGH = 0.88`：直接加载 SOP，不需要问用户，参数自动替换。
- `SIM_LOW = 0.72`：弹确认——「检测到类似 skill (pdf-batch-merge, 成功执行 47 次)，是否按此方案处理？」用户说可以就复用。
- 低于 0.72：不匹配现有 skill，进入 from-scratch 探索流程，探索成功后 long_term_update 固化新 skill。

**为什么是两层而不是纯 embedding？** 因为纯 embedding 检索有两个坑：一是 query 短的时候语义信息不够，容易召回不相关的 skill（比如 '处理这个文件' 能 match 上 pdf、excel、image 各种 skill）；二是 skill 数量上来之后 all-pair 语义比较延迟太高。意图标签一层相当于一个粗排的倒排索引，把候选集从几百个压缩到十几个，精排量直接降一个数量级。

**第三步：执行后验证，防误匹配。**

这是最容易被忽略但最关键的一步。skill 加载执行完了，Agent 跑 success_criteria 里的检查。以 PDF 合并为例：输出文件存在吗？页数对不对？通过了就记 success，这个 skill 的 success_rate 涨一点。

没通过怎么办？**不是删 skill，是降权。** 这次匹配标记为 fail，skill 的 confidence 下调，类似 ELO 机制。一个 skill 连续失败 3 次，自动归档，不再被推荐。

**额外几个工程细节：**

- **Skill 版本管理**：skill 的 steps 每次优化存储新版本，旧版本保留但不激活。这样如果新版本翻车还能回滚。执行记录里带 skill_version 字段，出问题能说清是哪个版本导致的。
- **参数热替换**：SOP 里的 params 不是写死的，而是带模板变量——`{output_dir}`、`{file_count}`——加载时用当前任务 context 填充。这样同一个 skill 处理「合并 A/B/C 三个 PDF」和「合并 D/E 两个 PDF」都能复用。
- **定期合并**：后台 cron 跑 skill 库去重——两个 skill 的 steps 序列编辑距离 < 2 且 trigger_intent 高度重叠，自动合并，保留 success_rate 高的那个的 meta。
- **时效检测**：有些 skill 的工具调用方式会过时。比如 `pypdf` 升级了 API，skill 里写的老调用方式会失败。执行失败后 Agent 尝试修复并更新 skill，如果修不了就标记 deprecated。

**和纯向量记忆比：** 向量记忆存的是对话片段，检索出来你还得再让 LLM「读懂这段历史」，本质上还是推理不是复用。skill 是存**已验证的执行流程图**，load 之后直接拿步骤走，不需要再推理「上次怎么做的」。一个是图书馆查资料，一个是拿 SOP 照做——效率和确定性差一个量级。

**最后一句总结：让 Agent 积累的不是记忆片段，是可验证的成功路径。新的同类任务来了，先问「以前做成过吗」，做成了加权重、做砸了降权重——靠这套信用机制而不是盲信语义相似度。**"
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="vector-database-selection">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">向量数据库怎么选？FAISS、Milvus、Pinecone、pgvector 有什么区别？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 标签：向量数据库, RAG, 架构选型 · 考察点：存储选型</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：看阶段和数据量——原型用 FAISS 零运维；中小规模加 pgvector 存量复用；上了百万向量上 Milvus；受不了运维买 Pinecone——没有银弹，看团队的 infra 能力和延迟要求。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：什么时候不用向量数据库？ · 索引类型怎么选？ · 精度和速度的取舍？</div>
</div>

我帮面试官画一条决策树：规模决定架构，不是功能列表决定。

**原型/小规模（<10 万向量）→ FAISS 或 Chroma。** 本地库零运维，延迟微秒级，缺点单机、增量写入要重建索引。适合验证和个人项目。

**中小规模（10 万–100 万）+ 已有 PG → pgvector。** 向量和业务 metadata 同一事务，一个 SQL 搞定向量检索 + 过滤 + JOIN。百万以内还行，过了延迟和召回率开始吃紧。

**大规模（>100 万）→ Milvus / Qdrant / Weaviate。** 分布式 ANN，IVF+PQ 十亿向量毫秒级返回。精度要求高用 HNSW 或 FLAT，省内存用 IVF_PQ。Milvus 部署重，Qdrant 单机开箱但分布式不如 Milvus 成熟。

**不想管运维 → Pinecone / Zilliz Cloud。** 全托管但贵，适合 infra 弱但要快速上线。
</div>
</details>

</div>
