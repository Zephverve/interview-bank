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

📝 **本分类源文件**：`custom/today-interview/` · 新增题目后运行 `npm run prepare` 即可刷新。

</div>

<div class="question-card custom-card compact-card" id="agent-code-production">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">Agent 能跑任意代码，安全风险怎么控？生产环境你敢这么用吗？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐⭐ · 标签：Agent, 安全, 生产 · 考察点：敢不敢上生产</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：实验室 demo 可以用受限 code_run；生产必须容器沙箱 + 无 root + 无密钥 + 无内网，裸 shell 永远不敢上。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和 Code Interpreter 比？ · 最小权限举例？ · 什么场景敢什么场景不敢，怎么划这条线？</div>
</div>

代码执行是 Agent 能力的上限，也是安全风险的地板。

**怎么控，四件套。** 沙箱隔离——Docker/gVisor，一任务一容器，跑完销毁，网络 egress 白名单。最小权限——非 root，禁裸 shell，只暴露 `read_file`、`write_file`、`run_python`，路径白名单校验。密钥经 secret manager 注入，prompt 看不到明文。高危操作走审批，全程 audit log。

**敢不敢上生产，看场景。** 不敢：能摸生产库、访问内网、用户不可信、无审批的任意 Python——demo 出事自己扛，生产出事是安全事故。敢：内部工具、只读分析、固定 workspace、可回滚——临时容器跑 pandas 洗数据，只回传 artifact。

**和 Code Interpreter 比，** 它是受限 Python 运行时：无网络、无持久化、超时内存上限。我们给受限执行面，不是 Turing 完备 shell。真要强执行能力，推 dedicated worker，Agent 通过 API 驱动。决策、执行、审批三条线任何一条没到位，我都建议先不上。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="agent-code-safety">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">怎么保证你的 Agent 运行代码不会影响你、把你的东西都删除了？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐⭐ · 标签：Agent, 安全, 沙箱 · 考察点：代码执行隔离</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：靠沙箱锁目录、工具白名单、删改要确认、全程可审计；不靠 prompt 赌模型自觉，默认它有可能删错。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：code_run 和 Docker 沙箱区别？ · 误删了怎么恢复？ · 工具白名单怎么设计？</div>
</div>

我的前提是：Agent 能跑代码，就默认它有可能删错东西，安全不能押在 prompt 上。我设计过四层防线。

**第一层，执行环境隔离。** 代码只在独立子进程跑，工作目录锁在 `/tmp/agent_workspace_{task_id}`，系统目录不可见，禁止 `os.chdir` 跳出。跑完 kill 子进程，目录保留一段时间供审计后清理。

**第二层，工具白名单。** 不给裸 bash，只暴露 `read`、`write`、`patch`、`run_python` 结构化 API。路径先 `realpath` 再校验前缀，AST 扫描禁 `subprocess`、`os.system`、`shutil.rmtree` 等危险调用。

**第三层，破坏性操作要确认。** 读操作自由执行；删改、覆盖、跨目录移动挂起等用户点头。删文件走 trash 策略，不走真 rm，出问题还能恢复。

**第四层，可审计可回滚。** 每步工具调用写 audit log，步数/token/时间超限熔断。修改前自动 snapshot，出问题 diff 回来。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="agent-infinite-loop">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">怎么防止 Agent 一直运行、死循环、自己浪费 Token？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐⭐ · 标签：Agent, ReAct, 成本控制 · 考察点：循环终止与预算</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：硬上限 + 重复检测 + 无进展熔断三道保险；到线就停、状态可恢复；宁可早停可重试，也不烧 token 空转。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：怎么判断「无进展」？ · 和 LangGraph interrupt 怎么配合？ · 不同死循环模式怎么区分？</div>
</div>

死循环不止一种，我按三类分别兜。工具调用死循环：同一个 search 反复调、同一个 bug 改十遍。重新规划循环：分析→搜资料→发现不够→重新分析，每轮想法不同但不推进。思想死循环：工具不重复但语义在打转，最难抓。

**第一道，硬天花板。** `max_turns` 默认 25、`token_budget` 32k、单步 30 秒超时、整任务 5 分钟墙钟上限。到线不是甩「失败」，而是序列化中间结果——已写文件、检索片段、半成品分析——让用户续接。

**第二道，重复检测。** 工具名+参数签名连续三轮一样，注入提示换策略或 ask_user。最近 5 条 assistant 消息 embedding 两两相似度连续 3 条 >0.92，判语义重复。不只看空响应，还看是不是在说车轱辘话。

**第三道，无进展熔断。** 按任务类型挂指标：写代码看文件有没有增长；检索看 Jaccard 相似度是否停滞；子任务 checklist 看有没有新 complete；plan 编辑距离是否连续不变。多信号加权，stagnation_score 超阈值就熔断，三级降级：缩小范围→ask_user→强制终止保存状态。和 LangGraph interrupt 配合，熔断后挂起让人决定继续还是终止。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="context-memory-management">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">长上下文怎么处理？用户的对话历史、检索结果、系统指令都塞进去，context window 满了怎么办？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
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
<summary>展开答案</summary>
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
<summary>展开答案</summary>
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
<summary>展开答案</summary>
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
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 标签：微调, QLoRA, 遗忘 · 考察点：持续学习风险</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：QLoRA 只训 adapter 不动基座、数据掺通用样本、小学习率早停、双验证集盯两头——训完跑回归对比看有没有变傻。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：全参微调 vs LoRA？ · 怎么评估遗忘程度？ · RLHF 阶段会有遗忘吗？</div>
</div>

灾难性遗忘就是领域变强了，通用能力突然掉下去——能精准答科研术语，简单数学推理开始胡说。我实际做 QLoRA 时踩过坑，总结「别动太多、别训太狠、训完要测」。

**选 QLoRA 不选全参。** 基座冻住只训低秩 adapter，参数量约 0.1%-1%，遗忘上限被 adapter 容量压住。7B 一张 24G 显卡能跑，极限领域能力比全参弱一点，但遗忘风险和成本更重要。

**数据掺通用样本。** 纯领域数据会用术语答一切，问天气回「根据气象学综述…」。配比约 80% 领域 + 15% 通用 QA + 5% 拒答样本，ablation 验证这条线通用下降最少。

**训练别太猛。** 学习率 2e-5 附近，每个 epoch 后跑通用探针集（数学推理、常识问答、格式遵循），探针恶化立刻早停。很多时候 epoch 1 就够。

**训完和基线对比。** 100 道 MMLU 子集 + 拒答 + 格式约束，微调前后逐题对比有没有 regress。RLHF/DPO 也会遗忘，偏好对里混入通用正确/错误样本，别让模型只学讨好。

没有零遗忘银弹，QLoRA 是目前性价比最高的折中。既要强领域又要强通用，可以多 adapter 按场景切换，或 adapter merging，但融合质量很看手艺。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="finetune-vs-faithfulness">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">微调的目的是什么？微调和引用校验的关系是什么？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐⭐ · 标签：微调, RAG, 引用校验 · 考察点：SFT 与 RAG 分工</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：RAG 负责把资料找对，微调负责把话说好、说像人、少 AI 腔；引用校验是生成后的最后一道 guard，微调能减轻它的负担但永远替代不了它。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：只有 RAG 不微调行不行？ · 引用校验通过率怎么从 70% 提到 90%？</div>
</div>

这道题考察你有没有把三个环节分工想清楚。很多同学把微调当万金油，幻觉严重了微调一下——这是滥用。

**我们初期的坑。** 只有 RAG + prompt，检索其实找到了正确段落，但基座模型不按上下文来，更信 pretrain 里的版本。引用格式也乱，校验器 parse 失败直接 reject。

**微调目标很窄，不是教新知识，是教「听话」。** QLoRA 训 1800 条：基于上下文 claim 必须有出处，没出处说「信息不足」；术语风格收敛学术规范；引用格式稳定。微调前引用通过率 72%，后到 86%——格式稳定让校验器解析成功率从 78% 提到 95%，模型也学会没把握就拒答。

**引用校验是生成后独立模块。** 逐句提取 claim 回查检索片段做 entailment。剩下 4% 靠 NLI model（DeBERTa entailment）加 LLM-as-judge 处理歧义 case，不是微调能解决的跨文档张冠李戴。

口诀：RAG 管 recall，微调管 behavior，引用校验管 faithfulness。只有 RAG 不微调看业务——内部检索助手 prompt 可能够；对外要稳定引用格式微调 ROI 正。只有微调不 RAG 也不行，知识会过时。三者是 pipeline 前后衔接，不是二选一。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="function-calling-design">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">Agent 的工具（Function Calling）怎么设计才能稳定调用？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
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
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 标签：LLM, 幻觉, RAG · 考察点：幻觉机理与治理</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：模型训练目标是 token 续写不是事实校验；知识盲区、上下文缺失、解码策略都会催生幻觉；RAG 加引用校验能大幅降但不能绝。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：哪种幻觉最难治？ · 和 creativity 怎么平衡？</div>
</div>

我拿科研问答里的真实 bug 举例。用户问 AlphaFold3 在蛋白酶设计上的进展，模型答得头头是道还带引用，但 AlphaFold3 论文 2024 年 5 月才发，知识库里根本没有——模型把 AlphaFold2 片段和推测拼成一篇「进展报告」。

**成因三层。** 第一层，模型设计目标：预训练是 next-token prediction，loss 不问真假只问概率，流畅不等于正确。第二层，上下文问题（RAG 最头疼）：检索漏了用参数里过时信息补；检索打架把矛盾结论拼成一句；context 一长中间段落被忽略，lost in the middle。第三层，解码推波助澜：temperature 高加「请详细说明」，模型倾向填细节，没依据也填。

最难治的是跨文档张冠李戴：A 的实验条件 + B 的数值 + C 的结论，单句引用校验都过不去。治理上 hybrid + rerank 把幻觉率从 18% 降到 9%，加引用校验到 4.5%。承认幻觉消不灭，按业务容忍度设阈值，低置信度拒答或 ask_user。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="langgraph-vs-langchain">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">LangGraph 和 LangChain 有什么区别？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 标签：LangGraph, LangChain, 编排 · 考察点：框架选型</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：LangChain 是组件库加链式拼接，适合一条线走到底的 RAG；LangGraph 是有状态图执行引擎，适合带循环、分支、人工审批点的 Agent 流程。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：什么场景必须用 LangGraph？ · 和纯 while 循环比优势在哪？ · LangGraph 的坑有哪些？</div>
</div>

我两个都在项目里用过，体感差异很明显。

**LangChain 是 LLM 应用的乐高箱。** LCEL 用管道把 retriever、prompt、LLM、parser 串成链，适合「上下文塞进去→答案吐出来」的 DAG 任务。一旦要 loop、回退、分支、暂停等人审批，Chain 外面套 while 或靠 LLM 自己决定下一步，测试调试都痛苦。

**LangGraph 解决「不是一条线」的流程。** 任务建模成有向图，node 是步骤，edge 是转移条件，State 显式 schema，每步 checkpoint 可暂停恢复。科研问答典型流程：Retrieve → Grade → 不够好 Rewrite 回 Retrieve → Generate → Citation check → 不通过回 Generate。用 Chain 得嵌套 try-except，用 Graph 画张图就清楚，还能按 node 独立测。

**什么时候用 LangGraph？** 看三个标志：有没有循环依赖；要不要持久化中间状态（用户关了明天继续）；要不要人机协同中断点。三个都没有，单 Agent + while ReAct 够用。比纯 while 好在可恢复、可观测（看 state 快照）、可测试（mock 上游 state 测单个 node）。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="multi-agent">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">多 Agent 是什么？有什么好处？你怎么理解？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 标签：Agent, 多Agent, 架构 · 考察点：协作模式与适用边界</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：多 Agent 是有明确角色分工和工具边界的协作体，不是多个聊天框并行；复杂长链路值得上，简单问答上反而是过度设计。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和单 Agent 多工具比何时需要多 Agent？ · 怎么避免 Agent 互相扯皮？</div>
</div>

多 Agent 是有明确角色分工和工具边界的协作体，不是多个聊天框并行。

我拿科研论文综述生成举例。单 Agent 同时检索、读论文、写初稿、查引用，prompt 又长又容易顾此失彼。拆成 Retriever、Reader、Writer、Citation Checker 四个角色：各自 prompt 短、工具边界清晰，Retriever 搜不到返回 `insufficient_sources`，Writer 如实说文献不足而不是硬编。

**好处四点：** 专精——Retriever 用小模型，Writer 用强模型；解耦——改引用格式只动 Checker；并行——多个 Reader 同时读不同论文；可审计——出问题能定位到具体环节。

**什么时候不上：** 没有稳定子任务边界就别拆，「查北京天气」拆两个 Agent 是过度设计；子任务没有独立失败模式，共享重试的单体 Agent 够用。

**防扯皮：** 消息走 JSON Schema，Orchestrator 有最终决定权，重试超两次标记「信息不完整」继续走，所有消息带 trace_id。

多 Agent 的价值不是「多」，是每个 Agent 只做一件事。拆不出独立单元，一个 Agent 加好工具就够。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="political-content">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">如果用户提出一些政治方面的问题，我应该怎么处理？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面/HR · 难度：⭐⭐⭐ · 标签：安全, 合规, 内容审核 · 考察点：拒答与边界</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：不是靠 prompt 写一句「不许聊」，而是输入分类 → 输出审核 → 产品边界三层兜底，敏感原文不入普通日志。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误杀正常问题怎么办？ · 输入分类怎么做？ · 产品和研发怎么分工？</div>
</div>

我从三个真实场景切入，不靠背规则。

**场景一，纯越狱试探。** 用户直接问敏感事件、让你站队。输入侧敏感词加分类模型双路拦截：词表命中直接拒答；DistilBERT 等小模型把 query 分成 normal/political/offensive/ambiguous，前两类拒、ambiguous 降级。我们实测 F1 约 92%，剩下 8% 靠输出侧兜底。

**场景二，打着研究旗号刨根问底。** 「分析 XX 事件各方立场」这类靠意图判断，system 定死在「专业工作助手」而非讨论伙伴，灰色地带走 ask_user 或直接拒，边界由产品定、研发实现规则引擎。

**场景三，正常业务被误杀。** 政务大数据、政策咨询里天然有部门名称和政策编号，不能靠关键词。误杀走申诉入口，真命中和误杀分表存储——真命中只记类别次数，原文不入库；误杀存 query 做 badcase 回流。

**输出侧第二道关。** 检查模型有没有表达立场、做超越知识范围的判断，检出就替换成统一拒答模板，不是删敏感句假装没说过。产品定服务范围和话术，研发做 moderation pipeline、日志分级、定期红队。不是技术决定什么不能说，是产品边界决定，技术保证严格执行。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="prompt-engineering">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">你怎么做 Prompt Engineering？有方法论吗？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
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
<summary>展开答案</summary>
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
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 标签：RAG, 上线, 工程 · 考察点：生产 checklist</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：先拿评测集证明质量、再保 P95 和成本、然后鉴权限流监控索引更新——实验室 demo 和上线之间差的就是这五件事。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：先做哪三项？ · 和实验室最大差距在哪？ · 什么时候判断「可以上了」？</div>
</div>

科研问答从 demo 到对外能用花了两个月，填的坑比写 demo 多。我说五件事，每件都踩过。

**评测集。** 不用「跑几个 case 看着还行」当标准。黄金评测集覆盖 Recall@K、引用正确率、拒答率、边界 case（跨文档、缩写歧义、否定查询、lost in the middle）、时效性。badcase 持续回流，上线前画雷达图看短板。

**性能。** P95 从 3.2 秒压到 1.2 秒，瓶颈是 rerank 和 embedding 串行。连接池复用、embedding/rerank 批处理、BM25 和向量检索并行、索引预热。压测到目标 QPS 两倍，提前设限流。

**可靠性。** 三级降级：向量库挂退 BM25；LLM 超时返回检索列表；整体挂 FAQ 兜底。每级有监控告警，降级路径上线前必测。

**安全。** 租户隔离靠 tenant_id 过滤不是 prompt；文档级权限按用户身份动态过滤；防 prompt 注入；输出脱敏手机号身份证。

**运维。** 监控 QPS、延迟、空检索率、token 趋势；索引增量更新可回滚；用户反馈回流评测集；A/B 框架先 5% 流量验证。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="skill-reuse-detection">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">在保存一个 skill 后，怎么能再有一个任务可以检测到两类任务是同一类，然后复用这个 skill？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：二面 · 难度：⭐⭐⭐⭐ · 标签：Agent, Skill, 记忆 · 考察点：任务相似度与 SOP 复用</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：任务进来先打意图标签跑粗筛、再语义检索做精准匹配；相似度高直接加载 SOP 执行；执行后验证成败，决定留存还是降权。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和纯向量记忆比？ · skill 过时怎么办？ · 误匹配怎么防？</div>
</div>

核心是让 Agent 积累可复用的成功路径，而不是每次都从零摸索。我分三块说。

**第一，Skill 存什么。** 不存整段对话 embedding，存结构化 SOP：trigger_intent 做粗筛、task_description 做精排、steps 是执行步骤、success_criteria 是验收标准。比如 PDF 合并 skill，步骤是列文件、确认、跑 pypdf、写输出，参数用 `{output_dir}` 这类模板变量，加载时按当前任务填充。

**第二，两层匹配。** 新任务进来先打意图标签，比如 pdf_processing、data_analysis，把候选从几百个压到十几个。再对 task_description 和用户 query 做 embedding 精排：相似度 ≥0.88 直接复用；0.72–0.88 弹确认；低于 0.72 走探索流程，成功后固化新 skill。纯 embedding 的问题是短 query 容易误召回，两层检索兼顾速度和准确率。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="vector-database-selection">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">向量数据库怎么选？FAISS、Milvus、Pinecone、pgvector 有什么区别？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
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
