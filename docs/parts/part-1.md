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
<summary>展开面试回答</summary>
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
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 考察点：分层切片参数选型</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：512 覆盖论文信息单元，2k 覆盖小节论证；试过 256/1024/4k 有对比；法律场景要更小子块更大父块。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：父子块怎么关联？ · overlap 设多少？</div>
</div>

"512 和 2k 不是拍脑袋定的，是做了对比实验的。

子块 512 是检索粒度的选择。科研论文的核心信息单元——比如一段方法描述、一个公式、一个实验结果——通常在 300-500 token 这个量级。用 512 既能覆盖一个完整的信息单元，又不会因为块太大导致检索时混入无关内容。我试过 256 和 1024，256 太碎，一个公式拆成两段，召回不完整；1024 太粗，检索回来的块里 60% 的内容和查询无关。

父块 2k 是为生成服务的。一篇论文的一个小节大概 1500-2000 token，包含了完整的论证逻辑。检索命中子块后，把父块作为上下文喂给 LLM 生成，LLM 有足够的背景信息给出准确的回答。试过 4k 的父块，生成质量没有明显提升，但 Token 消耗翻了一倍。

**和 MinerU 的配合**：集成 MinerU 后，切片边界尽量跟结构化输出对齐——按标题/段落切子块，表格整表进父块，公式块不硬拆。这比纯按 token 滑动窗口切，Recall@5 还能再抬一截，因为检索单元和论文逻辑单元一致。

法律文书检索的话，策略会完全不同。第一，法律文书的关键信息单元更小——一个法条引用可能就 50 token，一个案件事实可能 2000 token。我会用更小的子块（128-256 token）做检索，但用更大的父块（4k-8k）保上下文，因为法律推理需要完整的案件背景。第二，法律文书的结构化程度更高，我会利用文书固有的结构字段（案号、法院、案由、判决结果）做结构化索引，而不是纯靠语义切分。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q1">

<h2 class="question-title"><span class="q-badge">Q1</span><span class="question-text">你的科研问答系统 Recall@5 从 0.51 提升到 0.85，0.51 这个基线是怎么来的？你做了哪些具体改动导致了最大的提升？如果让你现在重新做，你会优先改什么？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐⭐ · 考察点：RAG 优化路径与基线设计</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：基线纯向量 0.51；最大一跳混合检索+重排；Agentic 流水线+MinerU+Faithfulness Guard 推到 0.85；下一步优先扩黄金集与端到端评测。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：每步优化的 ablation 是否独立跑过？ · 120 问黄金集怎么构建的？ · 0.85 是检索指标还是端到端？</div>
</div>

"0.51 是纯 BGE-M3 向量检索 Top-5 的基线——不做改写、不做混合、PDF 解析也较粗糙。它说明科研场景里单靠语义相似度天花板很低。

**第一大跳是混合检索 + 重排**：Dense+BM25+Sparse 三路召回，RRF 融合，Cross-Encoder 重排。BM25 补长尾术语精确命中，这一步单独就能把 Recall@5 从 0.51 拉到 0.63 左右，重排后再到 0.71 附近。

**第二大跳是 Agentic 编排**：LangGraph 里加查询改写、HyDE、质量门控、Multi-hop 子问分解（对比类问题），以及 parent-child 分层切片——子块检索、父块生成。

**第三大跳是 PDF 与校验**：集成 MinerU 结构化解析（双栏/表格/公式），失败 case 里约 30% 曾追溯到解析阶段。生成侧加 Faithfulness Guard 和 Self-RAG——校验或门控失败就 re-retrieve 或重生成，避免'检索对了但生成串线'。

最终 Recall@5 **0.85**，120 问黄金集持续维护。如果重做，我会在 Recall 稳定后加强 **端到端指标**——RAGAs Faithfulness、Faithfulness Guard 通过率、人工质量分——而不只盯检索 Recall。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q13">

<h2 class="question-title"><span class="q-badge">Q13</span><span class="question-text">你的 RAG 系统里提示词是怎么设计的？有没有遇到过 prompt 导致 LLM 行为异常的情况？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 考察点：RAG Prompt 与幻觉防控</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：四段 prompt + Faithfulness Guard 逐条验引用；Self-RAG 决定 re-retrieve 或重生成；长上下文用位置重排。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：Faithfulness Guard 和 RAGAs Faithfulness 区别？ · 校验失败平均几轮？ · Self-RAG 要不要微调？</div>
</div>

"Prompt 仍是四段：角色定义 → 父块上下文 → 用户问题 → 输出约束（信息不足就说不知道）。

但光靠 prompt 挡不住**跨论文混淆**。我在 LangGraph 生成后加了 **Faithfulness Guard**——用 LLM-as-judge 或规则+小模型，检查每条带引用的陈述是否被父块支撑；不通过则写入 `validation_errors` 进 State。

**Self-RAG** 在这里不是论文里的专用微调模型，而是我实现的**决策分支**：Guard 失败后判断根因——检索分低 / 候选不相关 → 回到改写+HyDE+混合检索（re-retrieve）；上下文够但生成串线 → 只重生成，最多 2 轮。这和卡码/小林面经里说的「检索门控 + 生成后核查」是同一思路。

长上下文仍用位置重排：最相关父块放 prompt 前部和尾部，减轻中间注意力衰减。

面经里常问 Faithfulness——我区分两层：**RAGAs Faithfulness** 是离线评测指标；**Faithfulness Guard** 是在线拦截，失败就触发 Self-RAG 回路，不让幻觉答案直接给用户。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q2">

<h2 class="question-title"><span class="q-badge">Q2</span><span class="question-text">你用 QLoRA 微调 Qwen2.5-14B，loss 收敛到 0.42。为什么选 QLoRA 而不是 full fine-tuning 或 LoRA？训练过程中遇到过什么坑？怎么判断模型没有过拟合？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐⭐ · 考察点：QLoRA 选型与过拟合判断</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：3090 24GB 只能 QLoRA；最大坑是数据质量，1.8k 真实数据后 loss 0.42；用验证集+人工抽检+引用通过率防过拟合。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：LoRA rank 多少？ · 负样本怎么构造？ · 微调后 RAG 还有必要吗？</div>
</div>

"选 QLoRA 最直接的原因是显存。我在实验室用的 RTX 3090 Ti 只有 24GB，Qwen2.5-14B 做 full fine-tuning 估计需要 4×A100，我根本没这个条件。QLoRA 通过 4-bit 量化把模型参数压缩，再加上 LoRA 的 adapter 只训练一小部分参数，让我在单卡上就能跑起来。

那为什么不用普通 LoRA？LoRA 本身也省显存，但 14B 模型即使用 LoRA，bf16 加载也要 28GB 左右，3090 还是放不下。4-bit 量化之后模型本体大概 8-9GB，加上 LoRA adapter 和训练中的中间激活，总共 16-18GB，刚好能在 24GB 显存里跑。

训练中最大的坑是数据质量问题。我最开始用 ChatGPT 自动生成了大概 500 条问答对就去训练了，结果模型学会了'AI腔'——每句话开头都是'根据论文...'，格式千篇一律。后来我手工筛选了课题组的真实提问，又补充了引用格式校验的负样本，把数据扩到 1.8k 条，loss 才从 0.68 降到 0.42，输出风格也自然多了。

过拟合的判断我主要看三点。第一是验证集 loss，训练过程中我单独留了 200 条做验证，loss 从 0.55 降到 0.50 就不动了，训练集还在降，差距在拉大，那大概在这个点我就停了。第二是人工抽检——我让课题组同学随机提 20 个问题，看模型的引用是否真的指向了正确的论文段落。第三是 **Faithfulness Guard 通过率 + RAGAs Faithfulness**——如果离线 Faithfulness 或 Guard 通过率开始下降，说明模型可能在「编造引用」，这是我们场景最怕的过拟合表现。微调主要对齐引用格式和拒答行为，Guard 负责在线兜底。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q19">

<h2 class="question-title"><span class="q-badge">Q19</span><span class="question-text">QLoRA 的 4-bit 量化具体是什么原理？为什么量化后模型精度没有显著下降？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐⭐ · 考察点：QLoRA/NF4 原理</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：NF4 非均匀量化匹配权重正态分布；双重量化压缩 scale factor；16-bit LoRA adapter 补偿精度损失。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和 GPTQ 区别？ · 4-bit 推理和 4-bit 训练区别？</div>
</div>

"QLoRA 用的是 NF4（NormalFloat4）数据类型加双重量化。

NF4 是专门为正态分布数据设计的一种 4-bit 量化格式。普通均匀量化（比如把 fp16 的值线性映射到 0-15）在 LLM 权重上效果不好，因为 LLM 的权重分布接近正态分布——大部分值集中在 0 附近，少数值很大。用均匀量化，0 附近的很多细节都会被抹掉。

NF4 的解法是把量化区间在 0 附近分得更密，在两极分得更疏——本质上是一个非均匀量化。它把一个 4-bit 的 16 个值按照正态分布的分位数来分配，低频的大值精度稍差，高频的中间值精度更高。

双重量化是 QLoRA 的另一个关键创新。4-bit 量化后每个权重块需要一个 32-bit 的 scale factor。这些 scale factor 本身也占显存。双重量化就是对 scale factor 再做一次 8-bit 量化——相当于'量化的量化'。这省了大概 0.5GB 显存，在 14B 模型上刚好是能不能在 24GB 卡上跑出来的区别。

精度没显著下降有两个原因。第一，NF4 在设计上就和 LLM 权重的实际分布匹配得很好——信息损失主要集中在长尾的大值上，而这些大值本来就不太影响推理结果。第二，LoRA adapter 在 16-bit 下训练，微调过程中 adapter 学习去补偿量化带来的精度损失。这就是 QLoRA 比单独做 4-bit 量化然后 full fine-tuning 效果好的原因——adapter 帮你"补回来"了。

为什么量化后微调的模型比不量化直接 full fine-tuning 效果差一点？因为你量化的时候已经丢失了一部分信息的精细结构，adapter 只能近似补偿。但在大多数应用场景下，QLoRA 能用 1/4 的显存换来 95% 的效果，这个 trade-off 是非常划算的。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q7">

<h2 class="question-title"><span class="q-badge">Q7</span><span class="question-text">你的问答系统 P95 延迟从 3.1s 压到 1.2s。具体瓶颈在哪里？批处理重排和连接池分别贡献了多少？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐⭐ · 考察点：P95 延迟拆解与优化</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：瓶颈是 Cross-Encoder 逐条推理；批处理重排、连接池、意图路由短链路；Agentic 全链路（HyDE/re-retrieve）比裸 pipeline 慢，用 streaming + 缓存换体验。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：streaming 和缓存怎么设计？ · Agentic 节点怎么控延迟？</div>
</div>

"原始的 3.1s 延迟分布大概是这样的：向量检索 200-300ms，BM25 大概 100ms，这两个还 ok。最大头是 Cross-Encoder 重排，占了将近 2s。因为我当时是每次对单个 query-document pair 调用一次 Cross-Encoder 模型，一个查询要重排 20 个候选，就是 20 次独立的模型调用。

批处理重排的优化是：把 20 个 query-document pair 打包成一个 batch，一次推理全部计算完。因为 Cross-Encoder 模型在 batch 推理时可以复用矩阵运算，20 个 pair 的 batch 推理时间大概 400-500ms，比 20 次单独调用省了约 1.5s。这是最大的单次优化。

连接池优化贡献了大概 0.3-0.4s。之前每次调 Qdrant、调 Cross-Encoder 服务、调 LLM 生成都要重新建立 HTTP 连接，三次握手的时间加起大概 300-400ms。用了连接池之后这部分降到几十 ms。

剩下的优化来自 LLM 推理端：简单问走意图路由**短链路**（跳过 HyDE/Multi-hop），复杂问才走全 Agentic 图；本地 Ollama 小模型处理术语解释类，微调 Qwen2.5-14B 处理需要引用的复述类。

**Agentic 的代价要诚实说**：HyDE、re-retrieve、Faithfulness Guard 会拉高 P95——全链路可能比裸 pipeline 多 0.5–1s。我的策略是**按意图分流**，120 问里约 60% 简单问不走重链路；前端 **FastAPI SSE** 流式先出字，用户体感比等完整 JSON 好。

如果还要压到 500ms 端到端，瓶颈在 LLM 生成。检索+重排+门控已压到几百 ms 级；再压只能靠缓存高频问（黄金集里约 30 问）或更小生成模型。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q41">

<h2 class="question-title"><span class="q-badge">Q41</span><span class="question-text">你的系统是 Agentic RAG 还是传统 Pipeline RAG？区别是什么？什么时候不该上 Agentic？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 考察点：Agentic RAG 概念与工程取舍（卡码/小林高频）</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：传统 RAG 固定「检一次→生成」；Agentic RAG 用 LangGraph 多节点+条件边，能改写、HyDE、门控、re-retrieve、Faithfulness Guard；简单问答别过度设计。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：和 ReAct Agent 套 RAG 一样吗？ · Token 成本怎么控？</div>
</div>

"传统 Naive RAG 是固定 pipeline：解析→切片→检索一次→生成。我的基线 0.51 就是这种。

**Agentic RAG** 把 RAG 嵌进 LangGraph：LLM/规则在运行时决定——要不要 HyDE、检索结果够不够、要不要 Multi-hop 子问、Guard 失败是重检还是重生。卡码面经里总结得很准：普通 RAG 检索次数固定 1 次，Agentic 是动态的。

我的实现是**半 Agentic**——主链路节点是确定的（不是 ReAct 让模型乱选工具），但 **Self-RAG 条件边** 负责「检索不够就再检」。这比纯 ReAct 套 RAG 更可控，也比裸 pipeline 多一层幻觉防护。

**什么时候不该上**：术语解释、单篇论文内定位——一次检索就够，Agentic 只会加延迟和 Token。课题组 120 问里大概 60% 是这种简单问，我意图路由节点会走短链路跳过 HyDE 和 Multi-hop。

面经常问「是不是噱头」——我的回答是：看失败模式。如果错误主要是「检错/检漏」，Agentic 的 re-retrieve 有价值；如果只是生成风格问题，微调+Guard 就够了。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q42">

<h2 class="question-title"><span class="q-badge">Q42</span><span class="question-text">你在流水线里加了 HyDE，它解决什么问题？和查询改写有什么区别？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 考察点：HyDE 原理与落地（小林 RAG 面经高频）</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：问题与论文「文体不同」——HyDE 先让 LLM 写假设答案，用答案向量检索；改写是润色问句；科研场景对口语化/术语问法有效。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：假设答案错了怎么办？ · 和 Multi-Query 怎么配合？</div>
</div>

"用户问「这篇咋做的」和论文里「本文提出了一种…」在向量空间里距离很远——这是 HyDE 要解决的**文体差异**，小林面经里叫「问句 vs 陈述句」。

**查询改写**：把口语变成更完整的问句，仍用**问题向量**检索。

**HyDE**：LLM 先生成一段「假设性答案段落」（不要求正确，只要像论文），用这段的 embedding 去检索。假设答案和真实 chunk 都是陈述体，命中率往往更高。

我在 LangGraph 里 HyDE 不是每问都开——意图路由后，对「方法/实验复述」类且改写后检索分仍低的问题才触发。成本是多 1 次 LLM 调用，所以和门控联动：第一次检索 top1 分低于阈值才走 HyDE 补检。

面经提醒：HyDE 假设方向错了会把检索带偏，所以我只在**领域明确（科研论文库）** 用，且保留原始 query 检索作双路融合，不单独依赖 HyDE 结果。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q43">

<h2 class="question-title"><span class="q-badge">Q43</span><span class="question-text">Faithfulness Guard 和 Self-RAG 在你系统里分别做什么？和 CRAG、RAGAs 指标什么关系？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐⭐ · 考察点：生成层幻觉防控（AI100 RAG 评估 + 小林面经）</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Guard=生成后逐条验真；Self-RAG=失败后决策 re-retrieve 或重生；CRAG 是检索太差换外部源，我用 re-retrieve 知识库；评测用 RAGAs Faithfulness 离线盯。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：Guard 用 LLM 还是规则？ · 最多重试几轮？</div>
</div>

"几个概念容易混，我按**在线链路**和**离线评测**分开说。

**Faithfulness Guard（我的实现）**：生成完成后，对答案中带引用的句子做核查——chunk 里是否真有这句话/能否支撑结论。不通过则标记 `guard_failed`，不直接返回用户。类似小林说的「生成后引用核查」，也对应 RAGAs 里 **Faithfulness** 指标的生产版。

**Self-RAG（我的实现）**：不是一定要训 Self-RAG 专用模型（面经也说了可以工程化）。Guard 或**质量门控**失败后，用规则+小模型判断：检索候选分数低 → **re-retrieve**（改写/HyDE/加 BM25 权重）；上下文够但生成乱写 → **regenerate** only。最多 2 轮，和 Q37 的 `retry_count` 一致。

**CRAG**：检索质量极差时换外部数据源（如联网）。我的知识库是封闭论文库，做法是 **re-retrieve + 拒答**，没有接 Web search，但思路同属「检索不行别硬生成」。

**RAGAs**：离线跑 Faithfulness、Answer Relevancy、Context Recall——我用来验证 Guard 上线后指标是否真提升，而不是只靠 Recall@5。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q44">

<h2 class="question-title"><span class="q-badge">Q44</span><span class="question-text">你为什么用 MinerU？集成时遇到什么坑？Qdrant 增量更新怎么做？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐⭐ · 考察点：文档解析与索引工程（简历亮点）</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：双栏/表格/公式用 MinerU 结构化+三级降级；parent-child 切片；单篇 PDF upsert/delete，不全库重建；早期 pdfplumber 约 30% 失败在解析。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：MinerU 慢怎么办？ · 和 Marker 对比？</div>
</div>

"早期用 pdfplumber 剔页眉页脚，双栏论文左右栏拼成一行，表格变乱码——我统计过约 **30%** 检索失败能追溯到解析。后来集成 **MinerU** 做结构化输出（标题/段落/表格/公式），并做**三级降级**：MinerU 失败 → 简化版解析 → 纯文本兜底，保证流水线不挂。

**切片**：MinerU 给出的结构边界用于 parent-child——子块约 512 token 做检索，父块约 2k 给生成，表格尽量整表进父块避免拆碎。

**增量索引**：每上传一篇 PDF，只对该 `doc_id` 在 Qdrant 里 **upsert 新向量 + delete 旧 version**，不触发全库重建。课题组经常只更新一篇综述，全量 re-embed 在 3090 上要等几十分钟，增量是刚需。卡码面经里「增量更新」也是高频点。

**坑**：MinerU 耗时长，我做成异步任务+状态回调，前端 React 显示解析进度；解析结果缓存到本地 JSON，同文档不重复跑 MinerU。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q45">

<h2 class="question-title"><span class="q-badge">Q45</span><span class="question-text">「比较 A 和 B 两篇论文的方法」这类问题你怎么做？为什么不能一次检索搞定？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐⭐ · 考察点：多跳检索与查询分解（Agentic RAG 场景题）</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：对比类走 Multi-hop：LLM 拆子问→分别检索→合并上下文再生成；一次检索容易只覆盖一篇或混论文；意图路由识别 compare 意图才触发。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：子问拆几个？ · 和 Agentic RAG 循环区别？</div>
</div>

"这是我在意图路由里单独的一类——**compare / 跨文献**。

用户问「A 和 B 在损失函数上有什么不同」，一次检索的 query 往往偏向其中一篇，Top-5 里两篇占比失衡，生成时就会混论文——这正是我 Part 0 里说的跨论文混淆根因之一。

**Multi-hop 做法**：

1. 意图识别为 compare 后，LLM 拆 2–4 个子问（A 的损失函数？B 的损失函数？各自优化目标？）
2. 每个子问独立走混合检索+重排，结果按论文 ID 分组
3. 上下文压缩节点合并去重，再进生成
4. Faithfulness Guard 要求对比结论两侧都有引用

这和通用 Agentic RAG「Agent 自己决定检索几次」不同——我的子问拆分是**模板+LLM 辅助**，次数有上限，避免 Token 爆炸。

面经里类似考法：「多跳推理怎么设计」——核心是**先拆再合**，别指望一个 embedding 向量同时对准两篇论文的同一维度。"


---
</div>
</details>

</div>
