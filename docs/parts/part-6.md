---
part: 6
partTitle: Part 6 · 补充题库
partColor: #ef4444
---

<div class="part-hero" style="--part-color: #ef4444">

# Part 6 · 补充题库

<p class="part-desc">评测 · LangGraph · 口径备忘</p>
<span class="part-round">高频追问</span>

</div>

<div class="part-intro">

> 覆盖简历亮点但未单独成题的知识点，以及高频追问

</div>

---



<div class="question-card compact-card" id="q36">

<h2 class="question-title"><span class="q-badge">Q36</span><span class="question-text">你为什么用 Recall@5 而不是 nDCG 或 MRR？黄金集怎么构建的？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 考察点：评测体系设计</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：科研问答核心是「找对段落」；Recall@5 直接衡量 Top-5 是否含答案段；nDCG 更重排序质量，MRR 只看第一个命中——我分阶段用 Recall 驱动召回优化，排序用重排+人工抽检补。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：有没有算 nDCG？ · 120 问怎么标注？ · 端到端怎么评？</div>
</div>

"选 Recall@5 因第一优先级是**召回**——Top-5 里有没有含答案的段落；召回漏了，重排生成再好也没用。

**MRR** 只看第一个命中，我们场景用户常看多段综合理解。**nDCG** 更全面但需多级相关度标注，早期资源有限先做二值标注（段落能否支撑回答），Recall@5 够驱动 BM25/重排/改写迭代。

120 问黄金集：真实提问 80 + 边界 case 40（跨论文/缩写/口语化），每题标注 1–3 金标准段落。升级体系会加 nDCG@5 和端到端指标——引用通过率、人工评分、平均校验轮次。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q37">

<h2 class="question-title"><span class="q-badge">Q37</span><span class="question-text">你的 RAG 用 LangGraph 编排，具体有几个节点？条件边怎么设计的？校验失败重试几次？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐⭐ · 考察点：LangGraph 落地细节</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：主链路 5 节点：查询改写→混合检索→重排→生成→引用校验；校验失败走条件边回到改写或生成，最多 2 轮重试，避免死循环。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：State 里存什么？ · 和裸 FastAPI 链式调用区别？ · 为什么不用 ReAct？</div>
</div>

"StateGraph **5 节点 + 2 条件分支**：

1. **查询改写** → 2. **混合检索**（dense+BM25，候选 50–80）→ 3. **Cross-Encoder 重排**（batch，Top-5+父块）→ 4. **答案生成** → 5. **引用校验**（反查原文，输出 validation_passed）

**条件边**：校验通过→END；失败且 retry_count<2→回改写或重生成（检索不对改 query，生成胡说重生成）；≥2 次→降级输出「信息不足」。retry_count 上限 2 控制延迟——每轮多 1–2s。

选 LangGraph 因 pipeline 步骤确定，分支可审计可单测；ReAct 会让 LLM 有跳过校验的风险。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q38">

<h2 class="question-title"><span class="q-badge">Q38</span><span class="question-text">你的 RAG 系统有哪些做失败了或效果不好的地方？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/三面 · 难度：⭐⭐⭐ · 考察点：真实性与复盘能力</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：三块没做好：PDF 双栏/公式解析、14% 引用校验仍失败、纯向量时代跨论文混淆；说明瓶颈往往在数据而非模型。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么没换 MinerU？ · 86% 够上线吗？ · 如果重来第一步改什么？</div>
</div>

"三块没做好：

**PDF 解析**：双栏/表格/公式丢失，~30% 失败 case 根在解析；MinerU 一直在 backlog。**引用校验 86%** 意味着 14% 仍失败——解析丢信息或 LLM 编造引用格式。**早期纯向量 0.51** 跨论文混淆严重，根因在召回混多篇，调生成模型救不了。

**没做**端到端 RLHF/DPO——1.8k SFT 已是标注成本极限。工业路线可能 RAG + 轻量 reranker 微调而非继续堆 SFT。

诚实讲失败，比只背 0.51→0.78 更能证明真做过系统。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q39">

<h2 class="question-title"><span class="q-badge">Q39</span><span class="question-text">DSTG-Net 里 GCN 和 Transformer 双流怎么融合？为什么用自适应加权而不是简单相加？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面（算法岗） · 难度：⭐⭐⭐⭐ · 考察点：简历算法项目深度</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：GCN 抓局部关节拓扑，Transformer 抓全局时序；自适应加权因不同关节/时间步两流贡献不同；加去相关损失防冗余和训练不稳。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：MPJPE 多少？ · 和 ST-GCN 区别？ · 消融实验怎么做？</div>
</div>

"DSTG-Net **双流架构**：GCN 分支做骨架图时空卷积（局部拓扑）；Transformer 分支把关节序列 token 化做 self-attention（长程时序）。

融合用**时空自适应加权** α·F_gcn + (1-α)·F_transformer——每时间步每关节一个 α，非全局固定。短期预测 GCN 贡献大，长期 Transformer 长程建模优势明显；消融长期 MPJPE 低约 8%。

导师担心训练不稳，我加**去相关损失**约束双流互相关接近零——既稳又准。Human3.6M/CMU-MoCap/3DPW 验证，3DPW 短期 MPJPE 降 22.22%。和 Agent 岗的关联：RAG 里 dense+BM25 混合、这里 GCN+Transformer 融合，都是'多路信息怎么加权'的工程思维。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q40">

<h2 class="question-title"><span class="q-badge">Q40</span><span class="question-text">GenericAgent 是你从零搭建的还是基于开源项目？你具体写了哪些代码？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐⭐ · 考察点：项目真实性（高频追问）</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：基于开源 ReAct Agent 框架深度二次开发：我负责 SiliconFlow/DeepSeek 接入、全链路跑通、生产级设计分析；叙事统一为「适配+分析+改进方案」而非含糊说「搭建」。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：改了哪几个文件？ · 和原版 diff？ · 如果没开源你能从零写 ReAct 吗？</div>
</div>

"分三层诚实回答：

**来源**：基于开源 ReAct 框架——执行引擎、9 工具、display_queue、分层记忆是原有；我不是从零发明 ReAct，是做深度二次开发。

**我具体做的**：① SiliconFlow/DeepSeek API 适配 + 5 类 Session 对接；② 全链路跑通 CLI/Web；③ 架构分析——接入层/引擎/工具/记忆四层，Native FC vs 文本协议、code_run 安全边界。

**改进设计**（部分未全落地）：human_confirmation（Q14）、code_run 三层安全（Q15）、display_queue→Redis 多端（Q34）。统一口径：**API 适配 + 全链路验证 + 架构分析与改进设计**，不说含糊的'从零搭建'。

追问源码细节，我能逐行讲 ReAct 循环——Q31 就是我的设计答案。"
</div>
</details>

</div>

---

<div class="memo-card">

## 📌 GenericAgent 口径备忘（非面试题，背诵前必读）

面试中统一用以下表述，避免「搭建」和「分析」口径打架：

| 场景 | 推荐说法 |
|------|----------|
| 自我介绍（30 秒） | 「基于 ReAct 开源框架做深度二次开发，完成 SiliconFlow 接入和全链路跑通，并系统分析了 LLM 接入层与分层记忆设计」 |
| 追问「你写的代码」 | 「API 适配与错误处理、配置与部署跑通；架构分析与改进方案设计」 |
| 追问「原创性」 | 「ReAct 循环和工具层是框架原有；我的价值在适配、验证、分析和可落地的改进设计」 |
| 不要说 | 「我从零搭建了一套 Agent 框架」（除非面试官明确问设计能力且你切到 Q31） |

---


---

> 📌 共 40 问（原 35 问 + 新增 5 问）+ 开场话术 + GenericAgent 口径备忘。长答案已按口述标准精简（结论先行 + 3–5 要点）；Q11/Q12 等原本简洁的题保持原样。

</div>
