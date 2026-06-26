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

nDCG 同时考虑召回和排序质量，理论上更全面，但它需要更细粒度的相关性标注（比如 0/1/2/3 多级相关度）。我早期资源有限，先做了二值标注——'这个段落能不能支撑回答'。Recall@5 够驱动前几个大优化。后期排序主要靠 Cross-Encoder 重排和引用校验通过率来补。

120 问黄金集的构建方式：从课题组真实提问里抽 80 问，我补充 40 个覆盖边界 case（跨论文、术语缩写、口语化提问）。每题标注 1-3 个'金标准段落'（论文 ID + 段落位置）。评测时只要 Top-5 命中任一金标准段落就算 Recall 成功。

如果现在要升级评测体系，我会在 Recall@5 稳定后加 nDCG@5 看排序质量，再加端到端指标——引用校验通过率、人工 1-5 分质量评分、平均校验轮次（简历里写的 1.3 轮）。三层指标分别对应检索、排序、生成。"
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

"**EvoAgent 是我个人项目**，从架构到代码自己设计和实现，不是分析别人的 GenericAgent。

核心模块我写的包括：L0-L4 记忆读写与任务后技能沉淀、探索-规划-执行-验证 SOP、SubAgent 委托与对抗验证、Conductor（WebSocket + inbox + SubagentPool）、MixinSession 多 Provider 故障切换、上下文压缩。

**和 RAG 的精力分配**：研一研二主线是科研 RAG（Agentic 流水线、120 问黄金集、MinerU）；EvoAgent 是 2026 年集中迭代，把面试里常被问的 Agent 能力（记忆、多 Agent、进化）落成可 demo 的框架。

面试 Agent 岗时：**RAG 讲深度（Q1、Q37、Q41–Q45）**，EvoAgent 讲广度和工程完整性（Q31–Q35、本题）。论文方向简历上有，Agent 面试不主动展开，被问到再说算法功底。

和 Hermes 区别：同是分层记忆+技能结晶，EvoAgent 更轻，强调 **对抗验证 SubAgent** 和 **Conductor 编排**，没有社区 Skill 市场。"


> 📌 共 **44 问**（原 35 问 + Q36–Q40 + RAG 专项 Q41–Q45）。面试中可根据实际情况调整细节和数字。
</div>
</details>

</div>
