---
custom: true
partTitle: 小林 · RAG 面试题
partColor: #0ea5e9
---

<div class="part-hero custom-hero" style="--part-color: #0ea5e9">

# 🔍 小林 · RAG 面试题

<p class="part-desc">RAG 原理 · 切分 · 检索优化 · 落地 · 共 18 题</p>
<span class="part-round custom-tag">我的题库</span>

</div>

<div class="custom-hint">

📝 **本分类源文件**：`custom/xiaolin-rag/` · 新增题目后运行 `npm run prepare` 即可刷新。

</div>

<div class="question-card custom-card compact-card" id="advanced_paradigms">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">了解哪些更复杂的 RAG 范式？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 小林笔记 · 考察点：了解哪些更复杂的 RAG 范式？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：在我的了解里，RAG 的发展经历了三代演进：Naive RAG 是基础的检索加生成；Advanced RAG 在检索前后都加了优化，比如 Query 改写、Rerank、混合检索这些；Modular RAG 是把各个环节做成模块可以任意组合</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

在我的了解里，RAG 的发展经历了三代演进：Naive RAG 是基础的检索加生成；Advanced RAG 在检索前后都加了优化，比如 Query 改写、Rerank、混合检索这些；Modular RAG 是把各个环节做成模块可以任意组合。

在这之上还有几个我觉得值得关注的高级范式。

Self-RAG 是让 LLM 自己来决定要不要检索，以及评估检索质量；CRAG 是检索质量差的时候自动降级到网络搜索；GraphRAG 是微软推的方案，用知识图谱的社区发现和层次摘要来增强全局理解能力；Agentic RAG 是把 RAG 做成 Agent，支持多轮的动态检索。

回到面试官的问题，Advanced RAG 远不是终点，它只是在固定流程上做了检索前后的优化。真正的高级范式是针对朴素 RAG 的三大痛点分别给出了系统性的解法。

Self-RAG 解决「不是所有问题都需要检索」的问题，让 LLM 自主决策；CRAG 解决「检索质量差时怎么办」的问题，自动降级到网络搜索兜底。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="dynamic_update">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">RAG 知识库如何实现动态与持续更新？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 小林笔记 · 考察点：RAG 知识库如何实现动态与持续更新？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：我理解知识库更新的核心挑战是，文档变了，对应的 chunk 和向量都要跟着变，而且要做到增量处理，不能每次全量重建</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

我理解知识库更新的核心挑战是，文档变了，对应的 chunk 和向量都要跟着变，而且要做到增量处理，不能每次全量重建。我们的通用方案是给每个文档算一个内容 hash，通过轮询或者监听数据源变更，检测到文档新增、修改、删除的时候，先清掉旧的向量，再重新切割入库。对于实时性要求比较高的场景，我会用消息队列比如 Kafka 做变更事件驱动，实现秒级的入库。

正确的做法是给每个文档算内容 hash 来检测变更，检测到变化后先把旧文档对应的所有 chunk 删掉，再重新切割入库，也就是「先删后增」。变更感知方面，低频场景用定时轮询就够了，高频场景用 Kafka 或 Webhook 做事件驱动，实现秒级入库。生产环境推荐「事件驱动 + hash 检测 + 先删后增」的组合方案，同时要做好 chunk ID 与文档 ID 的关联设计，这样删除和更新才有据可查。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="embedding">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">在 RAG 中 Embedding 究竟是什么？如何选择和评估一个 Embedding 模型？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 小林笔记 · 考察点：在 RAG 中 Embedding 究竟是什么？如何选择和评</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Embedding 我理解就是把一段文本转成一串数字向量的过程</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

Embedding 我理解就是把一段文本转成一串数字向量的过程。它有一个很关键的特性，就是语义相近的文本，转出来的向量在数学空间里的距离也近。RAG 里的语义检索就是靠这个实现的，不是关键词匹配，而是看两段内容的意思相不相近。

选模型的话，我主要看三个维度：第一是中文支持，中文场景我会优先选 BGE 系列，效果其实比 OpenAI 的模型还要好；第二是向量维度，维度越高精度越好，但存储成本也越大；第三是最大输入长度，这个决定了能处理多长的 chunk。

评估这块我的建议是不要只看通用排行榜，一定要在自己的业务数据上跑召回测试，那个才是真正有参考价值的。

回答要讲清三点。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="embedding_algos">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">Embedding 有哪几种算法你了解过吗？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 小林笔记 · 考察点：Embedding 有哪几种算法你了解过吗？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Embedding 算法大致经历了三代演进</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

Embedding 算法大致经历了三代演进。

第一代是静态词向量，以 Word2Vec 和 GloVe 为代表，把每个词映射成固定向量，但同一个词不管上下文是什么，向量永远不变，处理不了多义词。

第二代是以 BERT 为代表的上下文相关向量，同一个词在不同语境下有不同的向量，表达能力大幅提升，但 BERT 本身输出的是 token 级别的向量，两个句子要比较相似度就必须拼在一起跑，百万条文档就要跑百万次，检索速度完全不可接受。

第三代是以 SBERT、SimCSE、BGE 为代表的句子级对比学习 Embedding，专门为「两段文本有多相似」这个任务优化，能提前把所有文档向量算好存起来，查询时只需算一次，是 RAG 场景的标配。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="evaluation">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">怎么量化你的 RAG 效果？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 小林笔记 · 考察点：怎么量化你的 RAG 效果？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：我评估 RAG 效果是分两层来看的</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

我评估 RAG 效果是分两层来看的。

检索层看该召回的有没有召回到，我用 Hit@K 和 MRR 来衡量。生成层看答案对不对、有没有幻觉、和问题相不相关，我主要用 RAGAs 框架，里面的 Faithfulness、Answer Relevancy 和 Context Recall 这三个指标是最核心的。

我的建议是一定要在自己的业务数据上跑，不能只看通用排行榜，那个不能代表你的场景。

另外线上指标，就是用户的点踩率、追问率、转人工率这些，才是最终的衡量标准，离线指标只是辅助。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="graph_db">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">在什么场景下，你会选择使用图数据库来增强传统的向量检索？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 小林笔记 · 考察点：在什么场景下，你会选择使用图数据库来增强传统的向量检索？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：我的判断是，当业务问题涉及多个实体之间的关联推理的时候，就需要考虑引入图数据库来增强</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

我的判断是，当业务问题涉及多个实体之间的关联推理的时候，就需要考虑引入图数据库来增强。

向量检索有一个根本的局限，它只能做单跳检索，找和问题直接相关的文档，没办法沿着实体之间的关系链做推理。比如你问公司 A 的投资方和公司 B 有什么交集，单纯向量检索就很难处理了，因为答案不在某一段文档里，而是藏在多个节点之间的关系上。

这时候图数据库就能发挥作用，沿着关系边一跳一跳地把关联信息收集回来。我接触过的典型场景有企业关系分析、医疗知识图谱、代码依赖关系查询、供应链溯源这些。

回到面试官追问的「多检索几次能不能拼出答案」，答案是不能。

向量检索是「单跳」的，每次只能找和问题直接相关的内容，它没有实体和关系的概念，根本不知道该往哪个方向跳。图数据库的核心价值就在于它能沿着关系边做多跳遍历，把向量检索够不到的关联信息收集回来。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="hallucination">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">如何规避 RAG 系统中大模型的幻觉？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 小林笔记 · 考察点：如何规避 RAG 系统中大模型的幻觉？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：我遇到过的 RAG 幻觉主要有两类</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

我遇到过的 RAG 幻觉主要有两类。第一类是检索没有召回到相关内容，LLM 没有可用的上下文，靠自身知识在编造答案。第二类是检索内容召回了但 LLM 没有严格遵循，在文档内容的基础上加了自己的推断。我用来规避幻觉的策略主要有四个方向：第一是 Prompt 强约束，明确告知 LLM 只能根据提供的资料回答，资料里没有的就说不知道；第二是检索质量门控，Rerank 分数低于阈值就直接拒答，不让 LLM 在低质量上下文上硬撑；第三是生成后引用核查，每个关键的声明都要在 chunk 里找到来源依据；第四是结构化输出强制溯源，让 LLM 输出 JSON，每条结论必须附上来源编号。其中 Prompt 强约束加检索质量门控是我觉得成本最低、收效最快的组合，生产系统上线前这两个必须做。

回到面试官的追问，「检索做好了就不会幻觉」这个想法是错的。RAG 里的幻觉有两个来源：检索层没召回到内容，LLM 靠自身知识编造；以及检索到了但 LLM 超发挥，在资料基础上加了自己的推断。

「在 prompt 里加一句请根据资料回答」也远远不够，你需要一整套系统的防控策略：Prompt 强约束压制生成层幻觉，检索质量门控在检索失败时直接拒答，生成后引用核查做二次校验，结构化输出强制溯源让每条结论都有据可查。成本最低、收效最快的是 Prompt 约束加检索门控的组合，生产系统上线前这两个必须做。记住核心原则：治幻觉，先治检索。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="hardest_parts">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">在实际落地中，你觉得 RAG 最难的地方是哪里？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 小林笔记 · 考察点：在实际落地中，你觉得 RAG 最难的地方是哪里？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：我觉得 RAG 最难的不是把它跑起来，一个基础的 Demo 一两天就能搭起来，难的是把它调好</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

我觉得 RAG 最难的不是把它跑起来，一个基础的 Demo 一两天就能搭起来，难的是把它调好。工程上最让我头疼的有三块。

第一是文档预处理，原始数据的格式五花八门，PDF 里面的表格、图片、嵌套的格式，处理不好就是一堆乱码进了知识库，进去的是垃圾出来的也是垃圾。

第二是检索质量的调优，向量召回不准是整个系统效果的天花板，但问题来源很多，Chunking、Embedding、Query 改写，任何一个环节出问题都会影响结果，排查起来很费劲。

第三是效果评估，答案对不对很难系统性地衡量，不知道是哪个环节出了问题，优化就变成了瞎猜。

回到面试官的问题，RAG 落地最难的不是单点技术选型，而是整个链路上每个环节都可能成为瓶颈，而且环环相扣。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="multi_retrieval">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">什么是多路召回？具体怎么做？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 小林笔记 · 考察点：什么是多路召回？具体怎么做？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：多路召回就是同时用多种不同的检索方式去捞候选内容，然后合并排序，而不是只靠单一的向量检索</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

多路召回就是同时用多种不同的检索方式去捞候选内容，然后合并排序，而不是只靠单一的向量检索。我理解核心出发点是向量检索和关键词检索各有盲区，向量检索擅长语义相似，但对精确词语比如产品型号、缩写、数字效果比较差；BM25 关键词检索正好相反，精确匹配强，但不理解语义。我在项目里常用的组合是向量检索加 BM25 混合检索，再加上多 Query 扩展，也就是把用户问题改写成多个版本分别检索。多路的结果用 RRF 算法融合，最后送进 Rerank 精排。

多路召回的思路很简单：既然没有任何一种检索方式是全能的，那就同时走多条路，向量检索管语义，BM25 管精确词，多 Query 扩展管表述差异，三路结果用 RRF 融合，互为补充，覆盖面远比单路广。

面试时把「为什么单路不够」和「多路怎么组合、怎么融合」这两条线讲清楚，就到位了。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="online_workflow">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">你使用 RAG 给大模型一个输入，系统是怎样的工作流程？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 小林笔记 · 考察点：你使用 RAG 给大模型一个输入，系统是怎样的工作流程？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：当你把一个问题输入给 RAG 系统，它不会直接丢给大模型，而是先经历一套「检索 -> 整理 -> 生成」的流水线</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

当你把一个问题输入给 RAG 系统，它不会直接丢给大模型，而是先经历一套「检索 -> 整理 -> 生成」的流水线。

具体来说：系统先对问题做预处理（改写成更适合检索的形式），然后把问题向量化，去向量库里找最相关的文档片段，再经过精排筛掉噪音，最后把筛选出来的片段和问题一起拼成 Prompt 交给大模型，大模型基于这些「参考资料」生成最终答案。

整个流程的核心目标只有一个：让大模型在回答时有真实的知识作为依据，而不是凭空发挥。

正确回答要按顺序把六个步骤讲清楚。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="query_rewrite">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">如何润色用户的 Query（Query Rewrite）？目的是什么？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 小林笔记 · 考察点：如何润色用户的 Query（Query Rewrite）？目</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：我用 Query Rewrite 主要是为了弥补用户提问方式和知识库文档表述之间的语义鸿沟</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

我用 Query Rewrite 主要是为了弥补用户提问方式和知识库文档表述之间的语义鸿沟。用户的问题往往口语化、模糊、带缩写，而文档写的是正式书面语，向量相似度天然偏低，导致该召回的内容没被召回。

我接触过的方法主要有四种：第一是直接改写，让 LLM 把口语化的问题转成更精准的表述；第二是 Query 扩展，补充相关关键词；第三是 HyDE，让 LLM 先生成一个假设答案，然后用答案的向量去检索；第四是 Step-back Prompting，把具体问题往上抽象一层，检索更通用的背景知识。

口语化表达用直接改写，文体差异用 HyDE，问题太具体用 Step-back，角度单一用多 Query 扩展。

面试中回答这道题，关键是把「为什么要做 Query Rewrite」和「四种方法各自解决什么问题」讲清楚，让面试官看到你不是只会一种改写方式，而是理解了不同场景需要不同策略。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="rag_problems">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">大模型的 RAG 主要用来解决什么问题？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 小林笔记 · 考察点：大模型的 RAG 主要用来解决什么问题？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：第一是知识时效性，LLM 训练完知识就固定了，训练截止日期之后发生的事它一无所知；第二是私有知识覆盖，公司内部文档、行业专有数据根本没有机会进训练集，LLM 对这些内容是空白的；第三是幻觉问题，没有知识依据时 LLM 容易「自己发挥」编出一</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

RAG 主要解决三个问题。

第一是知识时效性，LLM 训练完知识就固定了，训练截止日期之后发生的事它一无所知；第二是私有知识覆盖，公司内部文档、行业专有数据根本没有机会进训练集，LLM 对这些内容是空白的；第三是幻觉问题，没有知识依据时 LLM 容易「自己发挥」编出一个听起来合理但实际错误的答案，给了它参考资料之后幻觉就少很多。

这三个问题的根源都是同一件事，知识被固化在了模型参数里。RAG 的解法是把知识存到外部，用的时候实时检索注入，彻底绕开了参数里的知识限制。

面试官问这个问题，想听到的是你对 LLM 局限性的系统理解。你需要讲清楚三个问题：知识时效性（训练数据有截止日期）、私有知识缺失（企业内部数据没进过训练集）、幻觉（没有依据时模型会编答案）。这三个问题的根源是同一件事：知识被冻在了模型参数里。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="rag_vs_finetune">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">相比直接微调 LLM，RAG 解决了什么问题？微调和 RAG 各自的优劣势是什么？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 小林笔记 · 考察点：相比直接微调 LLM，RAG 解决了什么问题？微调和 RAG</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：我的理解是这两个东西解决的不是同一层面的问题，不是谁替代谁的关系</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

我的理解是这两个东西解决的不是同一层面的问题，不是谁替代谁的关系。

微调是把新知识直接烧进模型参数里，适合改变模型的行为风格或者培养深度的专业能力；RAG 是在推理的时候实时检索注入知识，适合知识需要频繁更新、或者需要有溯源的场景。

如果非要让我选一个，知识库类的问答系统我会首选 RAG，成本低而且可以随时更新。如果是要让模型学会特定的输出格式或者行业语气，那微调更合适。

实际上这两个方案也可以组合用，先微调再套 RAG。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="retrieval_opt">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">RAG 检索优化策略有哪些？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 小林笔记 · 考察点：RAG 检索优化策略有哪些？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：我理解 RAG 的检索优化可以从四个层次来看：索引层决定知识怎么存，查询层决定问题怎么转换，召回层决定从哪些路径去找，重排序层决定最终哪些内容进入 prompt</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

我理解 RAG 的检索优化可以从四个层次来看：索引层决定知识怎么存，查询层决定问题怎么转换，召回层决定从哪些路径去找，重排序层决定最终哪些内容进入 prompt。

每一层都有对应的优化手段，我的经验是单独优化一个层次往往效果有限，线上系统我会组合来用，先靠索引优化和多路召回来保证覆盖率，再用 Rerank 保证精度，如果用户提问质量比较差，再额外加上查询优化。

面试时不要只罗列优化手段，而是要把这四层的逻辑关系讲清楚：每一层解决什么问题、为什么需要它、怎么和其他层配合。

最后给出一套典型组合方案（Parent-Child 索引 + 多路召回 + Rerank），面试官就能看到你是有实战经验的。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="retrieval_types">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">请你介绍一下向量检索和关键词检索的区别？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 小林笔记 · 考察点：请你介绍一下向量检索和关键词检索的区别？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：关键词检索（BM25 这类）靠的是词频统计，看查询词在文档里出现了多少次，擅长精确命中；向量检索靠的是语义空间里的距离，能理解「换了种表达方式的同一个意思」，擅长模糊语义匹配</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

关键词检索（BM25 这类）靠的是词频统计，看查询词在文档里出现了多少次，擅长精确命中；向量检索靠的是语义空间里的距离，能理解「换了种表达方式的同一个意思」，擅长模糊语义匹配。两者各有盲区：BM25 遇到同义词就没辙，向量检索遇到专有名词、产品型号这类精确词就容易漏。所以 RAG 系统里通常两路都跑，向量检索捕获语义相关的内容，BM25 精准命中关键词，再用 RRF 算法把两路结果合并，这样覆盖面比单路宽很多。

关键词检索（BM25）靠词频统计，精确匹配强但同义词没辙；向量检索靠语义空间距离，语义理解强但精确词容易漏。

正确的做法不是二选一，而是混合检索，两路并行召回，用 RRF 融合排序，取长补短。

面试中回答这道题，关键是把两种检索方式的原理、各自的盲区、以及为什么需要混合检索这条主线讲清楚，而不是简单地说「向量检索更好」。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="semantic_cuts">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">怎么规避语义被切割掉的问题？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 小林笔记 · 考察点：怎么规避语义被切割掉的问题？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：我的思路是从两个方向来规避这个问题</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

我的思路是从两个方向来规避这个问题。第一个方向是切的时候就不要在语义中间截断，用重叠切割和语义边界切割来保证每个 chunk 内容是完整的，也就是按句子、段落这些自然的边界来切。

第二个方向是切完之后用检索策略把上下文补回来，核心方案是句子窗口检索，命中一个句子就把周围几句一起返回给 LLM；另外还有父子切割，小块检索命中、大块内容输出。

还有一个我觉得比较有价值的方案，是 Anthropic 提出的 Contextual Retrieval，在做 Embedding 之前先让大模型看着整篇文档为每个 chunk 生成一段背景说明，把这段背景和 chunk 拼在一起再向量化，从根本上解决孤立 chunk 没头没尾的问题。

面试官想听的是你对问题本质的理解和多种方案的掌握。先说清问题：chunk 被单独拿出来后失去语境，语义被拆散导致检索召回不到。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="vectordb_practice">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">讲讲你用的向量数据库？数据量级是多大？性能如何？遇到过性能瓶颈吗？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 小林笔记 · 考察点：讲讲你用的向量数据库？数据量级是多大？性能如何？遇到过性能瓶</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：我们生产环境用的是 Milvus，数据量级在百万条向量左右，每条是 1024 维，用 HNSW 索引，单次查询的延迟在 20 到 50 毫秒</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

我们生产环境用的是 Milvus，数据量级在百万条向量左右，每条是 1024 维，用 HNSW 索引，单次查询的延迟在 20 到 50 毫秒。选 Milvus 主要是因为它支持分布式部署和读写分离，适合数据量大、并发高的场景。

我遇到过两个比较典型的瓶颈。

第一个是内存压力，百万级的 1024 维向量光原始数据就要好几个 GB，后来我们开启了标量量化 SQ8，把 float32 压成 int8，内存直接降到原来的四分之一。

第二个是大批量写入的时候会触发后台 Segment 合并，影响查询延迟，我们的解法是把批量写入改到业务低峰期，分批小批次写入。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="whatisrag">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">什么是 RAG？详细描述一个完整 RAG 系统的详细工作流程？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 小林笔记 · 考察点：什么是 RAG？详细描述一个完整 RAG 系统的详细工作流程</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：RAG 全称是 Retrieval-Augmented Generation，就是检索增强生成</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

RAG 全称是 Retrieval-Augmented Generation，就是检索增强生成。我理解它解决的核心问题是，LLM 的知识在训练完之后就固定了，遇到私有数据或者最新的信息它就答不上来。RAG 的做法是在生成答案之前，先去外部知识库里检索相关内容，然后把检索结果和用户的问题一起交给 LLM，让它基于这些上下文来回答。本质上就是给 LLM 开了一个开卷考试的口子，不用再靠死记硬背了。

然后面试官一定会追问「完整工作流程」。这时候你要按离线和在线两个阶段来讲。离线阶段：文档加载 → 切割（Chunking）→ 向量化（Embedding）→ 入库，这一步只做一次。在线阶段：Query 改写 → 向量检索（粗排）→ Rerank（精排）→ 拼接 prompt → LLM 生成，每次用户提问都要跑一遍。每个环节干什么、为什么需要，都要能说清楚。

最后，如果能再补一句 RAG 的核心价值，知识可热更新、答案可溯源，面试官基本就没什么好追问的了。
</div>
</details>

</div>
