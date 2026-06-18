---
part: 1
partTitle: Part 1 · RAG 深挖
partColor: #0ea5e9
---

<div class="part-hero" style="--part-color: #0ea5e9">

# Part 1 · RAG 深挖

<p class="part-desc">Embedding · 切片 · 混合检索 · 微调</p>
<span class="part-round">一面核心</span>

</div>

<div class="part-intro">

> 追问路径：Embedding 选型 → 切片策略 → 召回提升 → Prompt/校验 → 微调 → 原理深度 → 延迟优化

</div>

---



<div class="question-card compact-card" id="q12">

<h2 class="question-title"><span class="q-badge">Q12</span><span class="question-text">为什么选 BGE-M3 做 embedding 而不是其他模型？你评估过哪些候选？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 考察点：Embedding 模型选型</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：BGE-M3：dense+sparse、中文好、多语言；对比 text2vec/GTE-Qwen2 用 120 问黄金集 Recall@5。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么不用 OpenAI embedding？ · sparse 和 BM25 怎么配合？</div>
</div>

"选 BGE-M3 的核心原因是它同时支持稠密检索和稀疏检索，而且中文效果好。

我当时评估了三个候选：text2vec-large-chinese、BGE-M3 和 GTE-Qwen2。评估方式是用我的 120 问黄金集跑纯向量检索，看 Recall@5。

text2vec 的问题是模型太老，在科研术语上的语义区分度不够。比如'GCN'和'GAT'在它的向量空间里距离很近，很多时候检索回来的结果是混在一起的。BGE-M3 因为训练数据更新、模型更大，在这种专业术语上的区分度好很多。

GTE-Qwen2 在 Recall 上和 BGE-M3 差不多，但它不支持稀疏检索（Sparse Embedding）。我的方案里 BM25 做关键词检索，BGE-M3 的 Sparse Embedding 可以作为 BM25 的替代或补充——这让我的混合检索有两个可选方案。

最终选 BGE-M3 还有一个工程考虑：它原生支持多语言。我的论文库有中文也有英文，不需要分别部署两个 embedding 模型。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q11">

<h2 class="question-title"><span class="q-badge">Q11</span><span class="question-text">你的分层切片是子块 512 + 父块 2k token。为什么选 512 和 2k 这两个数字？如果换一个场景，比如法律文书检索，切片策略会怎么变？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 考察点：分层切片参数选型</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：512 覆盖论文信息单元，2k 覆盖小节论证；试过 256/1024/4k 有对比；法律场景要更小子块更大父块。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：父子块怎么关联？ · overlap 设多少？</div>
</div>

"512 和 2k 不是拍脑袋定的，是做了对比实验的。

子块 512 是检索粒度的选择。科研论文的核心信息单元——比如一段方法描述、一个公式、一个实验结果——通常在 300-500 token 这个量级。用 512 既能覆盖一个完整的信息单元，又不会因为块太大导致检索时混入无关内容。我试过 256 和 1024，256 太碎，一个公式拆成两段，召回不完整；1024 太粗，检索回来的块里 60% 的内容和查询无关。

父块 2k 是为生成服务的。一篇论文的一个小节大概 1500-2000 token，包含了完整的论证逻辑。检索命中子块后，把父块作为上下文喂给 LLM 生成，LLM 有足够的背景信息给出准确的回答。试过 4k 的父块，生成质量没有明显提升，但 Token 消耗翻了一倍。

法律文书检索的话，策略会完全不同。第一，法律文书的关键信息单元更小——一个法条引用可能就 50 token，一个案件事实可能 2000 token。我会用更小的子块（128-256 token）做检索，但用更大的父块（4k-8k）保上下文，因为法律推理需要完整的案件背景。第二，法律文书的结构化程度更高，我会利用文书固有的结构字段（案号、法院、案由、判决结果）做结构化索引，而不是纯靠语义切分。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q1">

<h2 class="question-title"><span class="q-badge">Q1</span><span class="question-text">你的科研问答系统 Recall@5 从 0.51 提升到 0.78，0.51 这个基线是怎么来的？你做了哪些具体改动导致了最大的提升？如果让你现在重新做，你会优先改什么？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐⭐ · 考察点：RAG 优化路径与基线设计</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：基线纯向量 0.51；最大一跳 BM25 混合到 0.63，重排到 0.71，改写+分层切片补 0.07；重做会优先改 PDF 解析。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：每步优化的 ablation 是否独立跑过？ · 120 问黄金集怎么构建的？ · 0.78 是检索指标还是端到端？</div>
</div>

"0.51 来自纯向量基线：BGE-M3 入 Qdrant，查询不改写，Top-5 召回。说明仅靠语义相似度，科研术语场景天花板很低。

**最大一跳是 BM25 混合检索**——长尾术语如'邻接矩阵归一化'，BM25 精确命中，Recall 0.51→0.63。**第二步 Cross-Encoder 重排**，BGE-Reranker 把 Top-5 质量拉上来，到 0.71。**第三步查询改写 + 分层切片**各贡献约 0.07——口语化 query 对齐论文表述，子块精检、父块保上下文。

重做会**优先改 PDF 解析**：pdfplumber 对双栏/表格/公式不稳，不少失败 case 根在解析丢信息。换 MinerU/Marker 预计还能提 3–5 个点。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q13">

<h2 class="question-title"><span class="q-badge">Q13</span><span class="question-text">你的 RAG 系统里提示词是怎么设计的？有没有遇到过 prompt 导致 LLM 行为异常的情况？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 考察点：RAG Prompt 与幻觉防控</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：四段 prompt；跨论文混淆用强制引用标注+校验节点，通过率 72%→86%；长上下文用位置重排。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：校验失败平均几轮通过？ · 引用校验具体怎么做？</div>
</div>

"Prompt 分四段：**角色定义**（科研助手 + 引用格式）→ **检索父块上下文** → **用户问题** → **输出约束**（信息不足须明说，禁止编造）。

**跨论文混淆**是最大坑：检索混 A/B 两篇，LLM 张冠李戴。解法是在 prompt 强制每句标注 [论文标题]，配合 LangGraph 校验节点反查原文，通过率 72%→86%。

**长上下文衰减**：5 父块约 10k token，我把相关度最高的片段放在**开头和末尾**，利用位置权重偏差。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q2">

<h2 class="question-title"><span class="q-badge">Q2</span><span class="question-text">你用 QLoRA 微调 Qwen2.5-14B，loss 收敛到 0.42。为什么选 QLoRA 而不是 full fine-tuning 或 LoRA？训练过程中遇到过什么坑？怎么判断模型没有过拟合？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐⭐ · 考察点：QLoRA 选型与过拟合判断</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：3090 24GB 只能 QLoRA；最大坑是数据质量，1.8k 真实数据后 loss 0.42；用验证集+人工抽检+引用通过率防过拟合。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：LoRA rank 多少？ · 负样本怎么构造？ · 微调后 RAG 还有必要吗？</div>
</div>

"**选 QLoRA 因显存**：3090 24GB，14B full FT 不现实；4-bit 量化 + LoRA adapter，单卡 16–18GB 可训。普通 LoRA 仍要 ~28GB 加载 bf16，放不下。

**最大坑是数据质量**：500 条 GPT 伪数据，loss 卡 0.68、'AI 腔'。改真实提问 300 条 + 增强至 1.8k，加 200 条错误引用负样本，loss 0.42。

**过拟合判断三点**：验证集 loss 与训练集差距拉大即停；人工抽检 20 问引用是否指向正确段落；引用校验通过率下降说明在'编造引用'——本场景最危险的过拟合形态。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q19">

<h2 class="question-title"><span class="q-badge">Q19</span><span class="question-text">QLoRA 的 4-bit 量化具体是什么原理？为什么量化后模型精度没有显著下降？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐⭐ · 考察点：QLoRA/NF4 原理</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：NF4 非均匀量化匹配权重正态分布；双重量化压缩 scale factor；16-bit LoRA adapter 补偿精度损失。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和 GPTQ 区别？ · 4-bit 推理和 4-bit 训练区别？</div>
</div>

"QLoRA 核心是 **NF4 + 双重量化 + 16-bit LoRA adapter**。

**NF4**：针对权重近似正态分布设计——0 附近量化更密、长尾更疏，比均匀 4-bit 保留更多有效信息。**双重量化**：对 scale factor 再做 8-bit 量化，14B 模型省约 0.5GB 显存，决定 24GB 卡能否跑通。

**精度没显著下降**：NF4 与 LLM 权重分布匹配，损失主要在长尾大值；LoRA 在 16-bit 训练，adapter 补偿量化误差。trade-off 是用约 1/4 显存换 ~95% 效果——实验室场景很划算。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q7">

<h2 class="question-title"><span class="q-badge">Q7</span><span class="question-text">你的问答系统 P95 延迟从 3.1s 压到 1.2s。具体瓶颈在哪里？批处理重排和连接池分别贡献了多少？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐⭐ · 考察点：P95 延迟拆解与优化</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：瓶颈是 Cross-Encoder 逐条推理约 2s；批处理重排省 ~1.5s，连接池省 ~0.3s，模型分层调度再省一点。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：streaming 和缓存怎么设计？ · 检索部分还能压多少？</div>
</div>

"3.1s 分布：向量检索 ~250ms、BM25 ~100ms 可接受；**瓶颈是 Cross-Encoder 重排 ~2s**——20 个 query-doc pair 逐条推理。

**批处理重排**（最大优化）：20 pair 打包 batch 一次推理 ~400–500ms，省 ~1.5s。**连接池**：Qdrant/重排/LLM 复用 HTTP 连接，省 ~0.3s。**模型分层调度**：简单问走 Ollama 小模型，复杂问走微调 Qwen2.5-14B，再省 ~0.1–0.2s。

再压到 500ms，瓶颈转到 LLM 生成。检索已压到 500ms 内；策略换 streaming 降感知延迟，或缓存黄金集高频问（命中端到端 ~100ms）。"


---
</div>
</details>

</div>
