---
part: 6
partTitle: Part 6 · 补充题库
partColor: #ef4444
---

<div class="part-hero" style="--part-color: #ef4444">

# Part 6 · 补充题库

<p class="part-desc">评测 · LangGraph · 简历深挖</p>
<span class="part-round">高频追问</span>

</div>

<div class="part-intro">

> 覆盖简历亮点但未单独成题的知识点，以及高频追问

</div>

---



<div class="question-card compact-card" id="q36">

<h2 class="question-title"><span class="q-badge">Q36</span><span class="question-text">你为什么用 Recall@5 而不是 nDCG 或 MRR？黄金集怎么构建的？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 考察点：评测体系设计</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：科研问答核心是「找对段落」；Recall@5 直接衡量 Top-5 是否含答案段；nDCG 更重排序质量，MRR 只看第一个命中——我分阶段用 Recall 驱动召回优化，排序用重排+人工抽检补。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：有没有算 nDCG？ · 120 问怎么标注？ · 端到端怎么评？</div>
</div>

"我选 Recall@5 是因为我们这个场景的第一优先级是**召回**——课题组同学问一个问题，系统能不能在 Top-5 里把真正包含答案的论文段落找出来。如果召回阶段就漏了，后面重排和生成再好也没用。

Recall@5 直接回答这个问题：正确答案有没有出现在前 5 个检索结果里。这对驱动 RAG pipeline 迭代非常直观——加 BM25、加重排、加改写，每一步都能在同一个指标上看跳了多少。

MRR（Mean Reciprocal Rank）更关注**第一个**正确结果排第几。我的场景里用户通常会看多个段落综合理解，不一定只依赖排名第一的片段，所以 MRR 不如 Recall@5 敏感。

nDCG 同时考虑召回和排序质量，理论上更全面，但它需要更细粒度的相关性标注（比如 0/1/2/3 多级相关度）。我早期资源有限，先做了二值标注——'这个段落能不能支撑回答'。Recall@5 够驱动前几个大优化。后期排序靠 Cross-Encoder 重排，生成侧靠 **Faithfulness Guard 通过率** 和 **RAGAs Faithfulness** 补。

120 问黄金集的构建方式：从课题组真实提问里抽 80 问，我补充 40 个覆盖边界 case（跨论文对比、术语缩写、口语化提问）。每题标注 1-3 个'金标准段落'（论文 ID + 段落位置）。评测时只要 Top-5 命中任一金标准段落就算 Recall 成功。

如果现在要升级评测体系，我会在 Recall@5 稳定到 0.85 后加 nDCG@5，再加端到端指标——RAGAs Faithfulness、Answer Relevancy、Guard 通过率、人工 1-5 分、Self-RAG 平均重试轮次。三层指标分别对应检索、排序、生成。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q37">

<h2 class="question-title"><span class="q-badge">Q37</span><span class="question-text">你的 RAG 用 LangGraph 编排，具体有几个节点？条件边怎么设计的？校验失败重试几次？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐⭐ · 考察点：LangGraph 落地细节</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：约 10 个节点：意图路由→改写→HyDE→三路召回→RRF→重排→门控→压缩→生成→Faithfulness Guard→Self-RAG 条件边；失败最多 2 轮 re-retrieve/重生。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：State 里存什么？ · 和裸 FastAPI 链式调用区别？ · 为什么不用 ReAct？</div>
</div>

"我的 LangGraph **Agentic RAG** 图大致 10 个节点（部分可跳过）：

1. **意图路由**——simple / retrieve / compare / chitchat，决定走短链路还是全链路
2. **查询改写**——口语→论文化表述
3. **HyDE（可选）**——门控分低时生成假设文档再检一路
4. **混合检索**——Dense + BM25 + BGE-M3 Sparse，RRF 融合
5. **Cross-Encoder 重排**——batch 推理取 Top-5 子块
6. **质量门控**——top 分低于阈值 → 不生成，直接 Self-RAG re-retrieve
7. **上下文压缩**——父块合并、去重、截断
8. **生成**——微调 Qwen2.5-14B 或 API，带引用格式
9. **Faithfulness Guard**——逐条验引用
10. **Self-RAG 决策**——通过则 END；失败则 `retry_count+1`，检索问题回节点 2/4，生成问题回节点 8

**State 字段**：`intent`, `rewritten_query`, `hyde_doc`, `candidates`, `reranked_docs`, `parent_chunks`, `answer`, `citations`, `guard_passed`, `retry_count`, `failure_reason`。

**条件边**：`retry_count >= 2` → 降级拒答或返回「信息不足」+ 已检索片段供用户自查。

选 LangGraph 而非 ReAct：步骤顺序业务已定，不需要 LLM 决定「下一步检索还是生成」——ReAct 有跳过 Guard 的风险。面经里 Modular RAG / LangGraph Workflow 也是同一思路：流程确定用图，开放任务用 Agent。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q38">

<h2 class="question-title"><span class="q-badge">Q38</span><span class="question-text">你的 RAG 系统有哪些做失败了或效果不好的地方？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/三面 · 难度：⭐⭐⭐ · 考察点：真实性与复盘能力</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：已改善：MinerU+增量索引+Guard 回路；仍难：表格/公式问答、开放域比较、14% 边界幻觉；诚实复盘比只背 0.85 更可信。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：MinerU 够用了吗？ · 86% 引用够上线吗？ · 下一步优化什么？</div>
</div>

"有三个印象深刻的失败或仍在优化的点。

**第一，PDF 解析已换 MinerU，但不是银弹**。双栏和正文解析好多了，但**复杂表格、多行公式**仍有单元格错位，对比类问题如果关键数字在表里，Guard 会判「引用无法支撑」。下一步是表格转 Markdown 的结构化后处理 + 表格专用 chunk。

**第二，Faithfulness Guard 不能 100%**。早期单节点校验约 86% 通过，现在整条链路有 re-retrieve，但**模型强行编造引用格式**仍偶发。靠微调负样本 + Guard 压了一部分，没完全消灭。课题组场景我选择**宁可拒答也不瞎编**。

**第三，纯向量 0.51 时代的跨论文混淆**。教训是失败要先定位环节——是解析、召回还是生成。后来 Multi-hop + 分论文分组检索专门治 compare 题。

**没做的**：端到端 RLHF/DPO 引用对齐，标注成本太高；工业界可能改轻量 reranker 微调而不是继续堆 14B SFT。

诚实说这些，比只讲 0.51→0.85 更让面试官相信你真的做过 Agentic RAG，而不是背数字。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q40">

<h2 class="question-title"><span class="q-badge">Q40</span><span class="question-text">EvoAgent 是你从零写的还是基于开源？和 RAG 项目怎么分配精力？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐⭐ · 考察点：项目真实性（高频追问）</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：EvoAgent 是个人项目独立设计实现：分层记忆、四阶段 SOP、Conductor、MixinSession、自我进化；主线精力在 RAG，Agent 框架证明工程深度。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：代码量多大？ · 和 Hermes 区别？ · 为什么两个项目都做 Agent？</div>
</div>

"**EvoAgent 是我个人项目**，在 GenericAgent 式轻量架构上独立迭代：分层记忆、四阶段 SOP、Conductor、MixinSession、对抗验证 SubAgent。代码目录 `GenericAgent-main`，核心 `agent_loop.py` + `ga.py` + `frontends/conductor.py`。

核心模块我写的包括：L0-L4 记忆读写与任务后技能沉淀、探索-规划-执行-验证 SOP、SubAgent 委托与对抗验证、Conductor（WebSocket + inbox + SubagentPool）、MixinSession 多 Provider 故障切换、上下文压缩。

**和 RAG 的精力分配**：研一研二主线是科研 RAG（Agentic 流水线、120 问黄金集、MinerU）；EvoAgent 是 2026 年集中迭代，把面试里常被问的 Agent 能力（记忆、多 Agent、进化）落成可 demo 的框架。

面试 Agent 岗时：**RAG 讲深度（Q1、Q37、Q41–Q46、Part0 附录）**，EvoAgent 讲广度（Q31–Q35、Q47、Part0 附录、本题）。

和 Hermes 区别：同是分层记忆+技能结晶，EvoAgent 更轻，强调 **对抗验证 SubAgent** 和 **Conductor 编排**，没有社区 Skill 市场。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q46">

<h2 class="question-title"><span class="q-badge">Q46</span><span class="question-text">把你的 RAG 项目从上传 PDF 到返回答案，**每一步**具体怎么做？不要只说模块名，要说清输入输出和为什么。</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐⭐ · 考察点：项目真实性 · 能否讲清完整 pipeline（与 Part 0 附录同一套答案）</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：离线七步建库（MinerU→切片→BGE-M3→Qdrant+BM25→增量 upsert）；在线 LangGraph 十二节点（意图→改写→HyDE→混合检索→门控→压缩→生成→Guard→Self-RAG）；120 问评测 + QLoRA；FastAPI SSE + React。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：某一步删掉指标掉多少？ · State 里有哪些字段？ · 和 Part 0 附录有何区别？</div>
</div>

"这道题我按 **Part 0【项目一附录】RAG 从 0 到 1 逐步详解** 来讲，和代码 `rag_graph.py` 节点一一对应。面试时建议面试官先听 **15 秒总述**，再按他兴趣展开某一段。

**离线（7 步）**：

1. 收 PDF（课题组目录或 Web 上传）
2. **MinerU 解析**（失败降级 structured → basic）→ 带章节/表格/公式的页文本
3. **Parent-child 切片**（子块检索、父块生成，子块带 `parent_id`）
4. **BGE-M3** embed 子块（dense + sparse weights）
5. **Qdrant** upsert 向量 + payload
6. **BM25** 建库并落盘
7. **单篇增量**：delete 旧 `paper_id` 向量 → upsert 新 chunk → 重建 BM25，不全库 re-embed

**在线（LangGraph 主链路）**：

`classify_intent` → `rewrite_query`（中文问句+英文关键词）→ `hyde_generate`（可选假设文档向量）→ `retrieve`（Dense+BM25+Sparse→RRF→Cross-Encoder；compare 走 Multi-hop 子问）→ `grade_retrieval`（分数/关键词门控）→ 不够则 `re_retrieve` 回改写（最多 1 次）→ `compress_context`（父块合并裁剪）→ `generate`（意图模板 + 微调/API）→ `faithfulness_guard`（引用格式+语义相似度）→ `self_rag_guard` → 失败则 `retry` 重生（最多 1 次）→ `persist_trace` 写日志 → 返回 citations。

**SSE**：检索先跑完，生成流式推 token，Guard 在流结束后跑，最后推 citation 列表。

**为什么这样拆**：检索错误生成救不了，所以门控在生成前；生成幻觉靠 Guard+微调负样本；对比类一次检索会混论文，所以 Multi-hop；口语问和论文文体不同，所以改写+HyDE。

完整表格版在 **Part 0 项目一附录**，背那一节即可应对「逐步深挖」；本题是同一内容的口播入口。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q47">

<h2 class="question-title"><span class="q-badge">Q47</span><span class="question-text">EvoAgent 从用户发消息到任务完成、记忆沉淀，**每一步**怎么做？和 LangGraph RAG 有什么区别？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐⭐ · 考察点：Agent 项目真实性 · ReAct + Conductor + 记忆（与 Part 0 附录同一套答案）</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：MixinSession → task_queue → agent_runner_loop ReAct；L0–L4 文件记忆 + key_info；Conductor inbox 派 SubAgent；任务后 start_long_term_update；开放任务 EvoAgent，固定问答走 RAG 图。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：SubAgent 和主 Agent 区别？ · 为什么 Conductor 不执行？ · 代码在哪个目录？</div>
</div>

"按 **Part 0【项目二附录】EvoAgent 从 0 到 1 逐步详解** 讲，代码在 `GenericAgent-main`（EvoAgent 实现基座）。

**启动**：`mykey.py` → `MixinSession` → 9 工具 Schema → system 注入 L1/L2。

**单任务**：`put_task` → `GenericAgentHandler` → 每轮 LLM+tools → `do_*` → anchor prompt 注入 WORKING MEMORY → 四阶段 SOP（探索读记忆、plan.md 规划、code_run 执行、验证 SubAgent）。

**Conductor**：inbox 唤醒 → 主 Agent 调度 → SubagentPool 新建独立 `GenericAgent` → WebSocket 监控 → `key_info` 注入。

**进化**：`start_long_term_update` 按 L0 增量 patch L2/L3。

**vs RAG**：RAG 是固定 LangGraph；EvoAgent 是开放 ReAct。完整表格见 Part 0 附录。"


> 📌 共 **46 问**（原 35 问 + Q36–Q40 + RAG Q41–Q46 + EvoAgent Q47 + Part 0 双项目逐步附录）。面试中可根据实际情况调整细节和数字。
</div>
</details>

</div>
