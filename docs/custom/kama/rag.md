---
custom: true
partTitle: 卡码笔记 · RAG
partColor: #06b6d4
---

<div class="part-hero custom-hero chapter-hero" style="--part-color: #06b6d4">

# 🔍 RAG

<p class="part-desc">卡码笔记 · 第 2/6 章 · 20 题</p>
<span class="part-round custom-tag">我的题库</span>

</div>

<div class="chapter-nav">

<a class="chapter-nav-link" href="/custom/kama/">📑 总览</a>

<a class="chapter-nav-link" href="/custom/kama/ai-coding">← 💻 AI 编程</a>

<a class="chapter-nav-link chapter-nav-next" href="/custom/kama/finetune">🎯 模型微调 →</a>

</div>

<div class="question-card custom-card compact-card" id="graphrag_interview-q1">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">1. RAG 检索到了但答不对——传统 RAG 的三个天花板</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 卡码笔记 · 考察点：1. RAG 检索到了但答不对——传统 RAG 的三个天</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：# GraphRAG与LightRAG大厂面试题汇总：从RAG到知识图谱检索 之前写了讲透RAG，把向量检索、混合检索、Rerank、幻觉处理这些讲透了</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

# GraphRAG与LightRAG大厂面试题汇总：从RAG到知识图谱检索 之前写了讲透RAG，把向量检索、混合检索、Rerank、幻觉处理这些讲透了。

 很多录友看完后反馈：传统 RAG 的那些优化手段确实好用，但有一类问题怎么优化都答不好——

 问&quot;某某文档里提到的某个具体技术细节&quot;，RAG 没问题；但问&quot;整个知识库的核心主题是什么&quot;&quot;这几个概念之间有什么关联&quot;，RAG 就开始瞎拼碎片了。

 这不是调参能解决的问题，是传统 RAG 的结构性天花板。

 后来面试官也追上来了：&quot;你们 RAG 检索到了但答不对，怎么办？&quot;&quot;GraphRAG 了解吗？&quot;&quot;LightRAG 和 GraphRAG 区别？&quot;一问一个不吱声。

 传统 RAG 到底卡在哪？GraphRAG 怎么突破的？LightRAG 又是什么？两者怎么选？这篇把 RAG 的下一代演进从头讲透。

 读完这篇，你会搞清楚：传统 RAG 的天花板在哪、GraphRAG 的完整链路怎么跑、GraphRAG 落地踩什么坑、LightRAG 怎么补位、实战场景怎么选。这些搞明白，面试官追问到多深都不怕。

面试官一般这么问：&quot;你们 RAG 系统有没有遇到检索到了但答不对的情况？什么类型的问题答不好？&quot;或者&quot;RAG 检索到了正确信息，但生成的回答还是拼凑感很强，你怎么理解这个问题？&quot;

 

### 一个例子说清楚 RAG 撞墙在哪

 假设你有一个公司内部知识库，里面全是项目文档、技术方案、会议纪要。有人问了一个问题：

 &quot;我们公司所有项目的技术栈趋势是什么？&quot;

 传统 RAG 怎么答？它把问题转成向量，去向量库里找最相似的文本块。找到的是一堆零散的片段：&quot;项目 A 用了 Spring Boot&quot;&quot;项目 B 迁移到了 Go&quot;&quot;项目 C 在试 Rust&quot;……然后把这些片段丢给 LLM 拼一个回答。

 拼出来的是一堆事实的堆砌，不是&quot;趋势&quot;。因为你根本没有一个视角能把所有项目的全貌看清楚，LLM 拿到的就是碎片，它再怎么聪明也只能拼碎片。

 这不是 RAG 的 bug，是向量检索的本质限制。

 

### 传统 RAG 的三个天花板

 ① 碎片化检索——查到的是文本块，不是知识

 传统 RAG 把文档切成 chunk，每个 chunk 独立变成向量。检索的时候，你拿到的是&quot;和问题最相似的文本块&quot;。但很多问题的答案不是一个文本块能覆盖的，它需要把多个文本块里的信息关联起来。

 比如&quot;张三和李四在哪个项目上有合作&quot;，这个信息可能分散在三个文档里——文档 1 提到张三负责项目 X，文档 2 提到李四参与了项目 X，文档 3 提到项目 X 的具体内容。传统 RAG 最多能捞到其中一个，很难同时把三个都捞出来并关联上。

 ② 全局问题瞎答——问&quot;整体&quot;只能拼局部

 像&quot;核心技术主题有哪些&quot;&quot;整体技术路线怎么演变的&quot;这种全局性问题，需要的是对整个知识库的理解，而不是几个相似的文本块。

 上篇讲过 Rerank 和混合检索能提升检索精度，但它们优化的是&quot;找更相似的文本块&quot;，不是&quot;把碎片拼成全貌&quot;。你把 Top-5 变成 Top-20，拿到的还是碎片，只是碎片更多了。

 ③ 跨文档关系断裂——A 和 B 的联系全丢了

 &quot;公司 A 收购了公司 B&quot;在文档 1 里，&quot;公司 B 和公司 C 有合作&quot;在文档 2 里。那公司 A 和公司 C 之间有没有间接关系？传统 RAG 答不了——因为每个 chunk 是独立 embedding 的，chunk 之间没有&quot;关系&quot;这个概念。

 

### 这不是调参能解决的

 讲透RAG讲的混合检索、Rerank、Query 改写，都是在&quot;找更好的文本块&quot;。但有些问题需要的不是更好的文本块，是实体之间的关系和全局的结构性理解。

 这才是 GraphRAG 要解决的问题。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="graphrag_interview-q2">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">2. RAG 的演进：从"找文本"到"找关系"</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 卡码笔记 · 考察点：2. RAG 的演进：从"找文本"到"找关系"</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：面试官会问：&quot;GraphRAG 和传统 RAG 本质区别是什么</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

面试官会问：&quot;GraphRAG 和传统 RAG 本质区别是什么？RAG 这条线是怎么演进过来的？&quot;

 

### 三代 RAG 的演进路线

 要理解 GraphRAG 为什么出现，得先看 RAG 这条线是怎么一步步走过来的。

 Naive RAG——最原始的 RAG：文档切块 → 向量化 → 检索 → 塞给 LLM 生成。问题很多：检索不准、幻觉严重、没有 Rerank。讲透RAG讲的很多优化手段，在 Naive RAG 里都没有。

 Advanced RAG——在讲透RAG里详细讲过的那些优化：混合检索补上关键词匹配的短板、Rerank 做精排提准、Query 改写对付模糊问题、Parent-Child 检索兼顾精度和上下文。这些优化确实把&quot;找文本块&quot;这件事做到了极致。

 GraphRAG——换了一条路：不再只找文本块，而是先建一个知识图谱，把实体和关系都结构化地存下来，检索时走图谱找关系。从&quot;找文本&quot;变成了&quot;找关系&quot;。

 演进逻辑特别清晰：Naive RAG 的问题是&quot;找不准&quot;→ Advanced RAG 把检索策略调到最好 → 但有些问题不是找文本块能解决的 → GraphRAG 换了检索范式。

 

 

### 一句话定位 GraphRAG

 给 RAG 装上知识图谱，让检索从&quot;找文本块&quot;变成&quot;找实体和关系&quot;。

 传统 RAG 检索的是&quot;和问题相似的文本&quot;，GraphRAG 检索的是&quot;和问题相关的实体、关系、社区&quot;。前者是局部匹配，后者是结构化理解。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="graphrag_interview-q3">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">3. GraphRAG 的完整链路：从原始文档到社区摘要</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 卡码笔记 · 考察点：3. GraphRAG 的完整链路：从原始文档到社区摘要</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：面试官会问：&quot;GraphRAG 的索引阶段是怎么工作的</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

面试官会问：&quot;GraphRAG 的索引阶段是怎么工作的？查询阶段有几种方式？&quot;

 

### GraphRAG 是谁做的？

 微软研究院，2024 年 4 月公开，核心团队是 Darren Edge 等人。论文标题叫《From Local to Global: A Graph RAG Approach to Query-Focused Summarization》。开源在 GitHub 上，2024 年底已经在 Azure 上正式商用。

 微软做这个的动机很直接：他们试了很多传统 RAG 的优化，发现全局性问题怎么都答不好。于是换了个思路——与其优化检索策略，不如换一种知识组织方式。

 

### 索引阶段：把文档变成"带社区的知识图谱"

 整个索引阶段分六步：

 第一步：文档切块。和传统 RAG 一样，把原始文档切成文本块（默认约 300 token，带 overlap）。

 第二步：LLM 提取实体和关系。每个文本块送给 LLM，让 LLM 识别出里面的实体（人、组织、地点、事件、概念等）和关系（谁做了什么、谁和谁什么关系）。这一步是整个流程最烧钱的地方——每个文本块都要过一遍 LLM。

 文本块：[&quot;张三加入了项目X，负责后端架构设计&quot;]
        ↓ LLM提取
实体：[张三(人), 项目X(项目)]
关系：[张三 → 负责后端架构设计 → 项目X]
 1
2
3
4
第三步：实体去重与合并。同一个实体在不同文档里可能出现多次，&quot;Apple&quot;和&quot;Apple Inc.&quot;是同一个实体，得合并成一个节点。

 第四步：构建知识图谱。所有实体变成节点，关系变成边。至此，你的文本语料变成了一个结构化的图。

 第五步：Leiden 社区检测。用 Leiden 算法（Louvain 的改进版）对图谱做社区划分，找出紧密连接的实体群。Leiden 会产生层级式的社区结构——底层是小社区（几个紧密关联的实体），上层是社区之社区，最顶层是整个图。

 第六步：生成社区摘要。对每个层级的每个社区，用 LLM 生成一份结构化摘要（community report），描述这个社区里的关键实体、核心关系、主要主题。

 索引阶段最终产出四个东西：实体表、关系表、社区表（含摘要）、文本块的向量索引。

 

### 查询阶段：本地查询 vs 全局查询

 GraphRAG 提供两种查询方式，对应两类完全不同的问题：

 本地查询（Local Search）——答具体问题

 从用户问题里提取关键实体 → 在图谱里找到对应节点 → 沿着边遍历关联的实体、关系、文本块、所在社区的摘要 → 把这些上下文喂给 LLM 生成回答。

 适合问：&quot;张三在项目 X 里负责什么？&quot;——沿着实体&quot;张三&quot;和&quot;项目X&quot;在图上走一圈就能答。

 全局查询（Global Search）——答整体问题

 这是 GraphRAG 的杀手锏，用 Map-Reduce 方式回答全局性问题：

 - Map 阶段：把某个层级所有社区的摘要分成若干组，每组摘要 + 用户问题送给 LLM，让 LLM 生成一个&quot;部分答案&quot;
 - Reduce 阶段：把所有部分答案汇总，再送给 LLM 生成最终的综合回答
 层级可以调：选低层级社区 → 答案更细致；选高层级社区 → 答案更概括。

 适合问：&quot;公司所有项目的技术栈趋势是什么？&quot;——每个社区摘要已经预计算好了局部主题，Map-Reduce 再把它们综合成全局答案。

 

### 用开头讲的例子再走一遍

 回到那个问题：&quot;公司所有项目的技术栈趋势是什么？&quot;

 传统 RAG：检索几个提到技术栈的文本块 → LLM 拼碎片 → 答案是零散事实的堆砌。

 GraphRAG：索引阶段已经把所有项目的技术实体和关系提取到了图谱里，每个社区的摘要已经预计算了局部技术主题 → 全局查询走 Map-Reduce 把所有社区摘要综合 → 答案是有结构、有层次的趋势总结。

 这就是 GraphRAG 的核心价值：它不是在查询时现拼，而是在索引阶段就把全局理解预先算好了。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="graphrag_interview-q4">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">4. GraphRAG 落地踩的三个坑</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 卡码笔记 · 考察点：4. GraphRAG 落地踩的三个坑</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：面试官会问：&quot;GraphRAG 这么好，你们落地遇到什么问题</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

面试官会问：&quot;GraphRAG 这么好，你们落地遇到什么问题？&quot;

 概念漂亮是一回事，落地是另一回事。GraphRAG 真正的难度不在理论，在这些具体的坑里。

 

### 坑一：建图太贵——token 烧钱、索引慢

 索引阶段每个文本块都要过一遍 LLM 提取实体和关系，然后每个社区还要过一遍 LLM 生成摘要。这意味着你原始文档有多少 token，索引阶段的 token 消耗至少是 2-5 倍。

 具体数字：100 万 token 的原始文档，索引阶段可能消耗 200-500 万 token。而且不是钱花完就行的，索引时间也长——百万级文档的索引可能要跑好几个小时。

 对比传统 RAG：只需要 Embedding 一次，几乎不花 LLM token。GraphRAG 的索引成本可能是传统 RAG 的 10 倍以上。

 

### 坑二：增量更新难——新增文档，图要重建吗？

 这是 GraphRAG 最头疼的问题。

 知识库不可能一成不变，每天都有新文档进来。但 GraphRAG 的社区结构是全局性的——新增一批实体和关系进去，整个图的社区边界可能全变了。原来 A 和 B 是同一个社区，加了新实体后可能被拆开；原来 C 和 D 不在一个社区，加了新关系后可能合并。

 这意味着：新增 10% 的文档，可能需要重跑 30-50% 的索引流程（重新做社区检测、重新生成社区摘要）。

 

 微软在 2024 年 10 月推出了 DRIFT 搜索模式（Dynamic Reasoning and Inference with Flexible Traversal），这是本地查询和全局查询之外的第三种查询方式——先用社区摘要做全局预判，再沿着图谱做局部深挖，在成本和深度之间找平衡。

 但这仍然没有解决增量更新的问题——DRIFT 改进的是查询策略，不是索引策略。新增文档后社区结构变了，还是得重建。

 

### 坑三：社区粒度难定——太粗丢细节，太细则爆炸

 Leiden 算法会产生多层级的社区结构，但到底用哪一层做查询，没有万能答案。

 层级太高（社区太大）→ 每个社区涵盖太多实体，摘要太笼统，细节丢光。层级太低（社区太小）→ 社区数量爆炸，Map-Reduce 时要处理几百上千个社区摘要，token 成本飙升，延迟也跟着涨。

 实际操作中，这个层级得根据你的数据量和查询需求反复调试。没有一个公式能直接算出来。

 

### 三个坑的本质

 坑 本质 建图太贵 用 LLM 做结构化提取，成本是 Embedding 的 10 倍+ 增量更新难 社区是全局结构，局部变更会引发全局调整 粒度难定 层级选择是精确性和成本之间的权衡，没有银弹 这三个坑有一个共同根源：GraphRAG 用了&quot;全局预计算&quot;的思路——先花大成本把整个知识库的结构理解预先算好，查询时直接用。这个思路答全局性问题确实强，但代价就是贵、重、不灵活。

 LightRAG 就是从这个矛盾里长出来的。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="graphrag_interview-q5">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">5. LightRAG：更轻、更快、增量友好</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 卡码笔记 · 考察点：5. LightRAG：更轻、更快、增量友好</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：面试官会问：&quot;LightRAG 是什么</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

面试官会问：&quot;LightRAG 是什么？和 GraphRAG 有什么区别？为什么会有 LightRAG？&quot;

 

### LightRAG 为什么会出现

 GraphRAG 的核心矛盾：它的强项（全局预计算）恰恰是它的弱点（成本高、更新难）。

 很多团队看完 GraphRAG 的论文觉得好，一算成本直接劝退。或者建好图了，结果知识库每天都在更新，增量更新跑不起。而且不是所有场景都需要那么强的全局理解能力，很多时候只是想在传统 RAG 基础上加点&quot;关系&quot;能力就够了。

 LightRAG 就是冲着这个矛盾来的：能不能用更轻的方式获得图增强检索的好处，同时还能方便地增量更新？

 LightRAG 由港大数据科学实验室（HKUDS）开发，2024 年 10 月发布，论文标题《LightRAG: A Lightweight Retrieval-Augmented Generation Framework》。

 

### 核心原理：双层检索图谱

 LightRAG 不搞社区检测那一套，它建的是一个双层图谱：

 底层：实体层图谱

 - 节点 = 实体（人、组织、概念等）
 - 边 = 实体之间的直接关系
 - 每个节点存：实体名称、类型、描述、来源文本块
 这一层管具体查询——&quot;张三在项目 X 里做什么&quot;这种问题，在实体层图谱上找&quot;张三&quot;节点，沿着边走就能拿到相关上下文。

 上层：关系层图谱

 - 节点 = 关键关系/交互（不是实体本身）
 - 边 = 关系之间的连接（因果、时序、主题关联）
 这一层管全局查询——&quot;技术栈趋势是什么&quot;这种问题，关系层图谱已经把跨实体的模式捕捉到了，不需要预计算社区摘要。

 两层图谱都带有向量嵌入，检索时走&quot;图遍历 + 向量相似度&quot;的混合方式。

 

 

### 四种查询模式

 LightRAG 提供四种查询模式，按需选：

 模式 怎么查 适合什么问题 Naive 纯向量检索（和传统 RAG 一样） 简单事实查询 Local 在实体层图谱找实体 → 遍历邻居 → 生成回答 具体问题（&quot;张三做什么&quot;） Global 在关系层图谱找主题模式 → 生成回答 全局问题（&quot;核心趋势&quot;） Hybrid Local + Global 合并 兼顾细节和全局 

### 增量插入：LightRAG 的杀手锏

 这是 LightRAG 和 GraphRAG 最大的区别。

 GraphRAG 增量更新：新文档进来 → 可能要重新做社区检测 → 重新生成社区摘要 → 大量 LLM 调用 → 成本高、耗时长。

 LightRAG 增量插入：新文档进来 → LLM 提取实体和关系 → 和已有图谱做实体去重匹配 → 新实体加节点，已有实体合并描述 → 新关系加边 → 只更新受影响的向量嵌入 → 完事。

 关键区别：LightRAG 没有社区结构，所以不需要重跑聚类算法。图谱只是往里加节点和边，局部更新就行。增量插入的复杂度是 O(局部变更)，不是 O(整个图谱)。

 实体去重怎么做？三层匹配：名称精确匹配 → 名称模糊匹配 + 描述向量相似度 → 模糊时 LLM 辅助判断。匹配上了就合并，没匹配上就新增。

 

### 用开篇的例子再走一遍

 &quot;公司所有项目的技术栈趋势是什么？&quot;

 LightRAG：在关系层图谱上检索，找到和&quot;技术栈&quot;相关的高层关系节点 → 这些节点已经跨实体地捕捉了项目间的技术关联模式 → 生成回答。

 和 GraphRAG 的区别：GraphRAG 是预计算好的社区摘要做 Map-Reduce，LightRAG 是在关系层图谱上实时检索。GraphRAG 的全局答案通常更完整（毕竟是预计算好的），但 LightRAG 的增量更新成本低得多，而且大部分场景下回答质量也够用。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="graphrag_interview-q6">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">6. GraphRAG 和 LightRAG 到底怎么选</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 卡码笔记 · 考察点：6. GraphRAG 和 LightRAG 到底怎么选</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：面试官会问：&quot;你们项目用的 GraphRAG 还是 LightRAG</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

面试官会问：&quot;你们项目用的 GraphRAG 还是 LightRAG？为什么？什么场景该用哪个？&quot;

 

### 核心区别

 维度 GraphRAG LightRAG 开发者 微软研究院 港大 HKUDS 知识结构 知识图谱 + Leiden 社区层级 双层图谱（实体层 + 关系层） 全局理解方式 预计算社区摘要 → Map-Reduce 关系层图谱实时检索 索引成本 高（2-5x 源 token） 中（比 GraphRAG 少约 40-60%） 索引耗时 长（百万文档约 3.8 小时） 短（同规模约 2.1 小时） 增量更新 难（需重建社区结构） 易（直接往图里加节点和边） 全局查询质量 强（预计算摘要，完整性好） 中上（实时检索，够用但不如预计算） 本地查询质量 强 强 部署复杂度 高 低 

### 什么场景选 GraphRAG

 - 知识库大且相对稳定——法律档案、研究论文库、历史文档，建一次图用很久
 - 全局洞察是刚需——&quot;所有案件的判决趋势&quot;&quot;跨论文的药物相互作用模式&quot;，这类问题 GraphRAG 的预计算摘要优势明显
 - 预算充足——能接受 10 倍于传统 RAG 的索引成本
 - 更新频率低——周更或月更，增量更新的痛点不大
 典型场景：律所的案件分析系统、药企的文献检索平台、情报分析系统。

 

### 什么场景选 LightRAG

 - 知识库动态更新——新闻聚合、客服知识库、产品文档，每天都有新内容
 - 成本敏感——创业团队或中小规模项目，GraphRAG 的索引成本扛不住
 - 快速上线——想先跑起来看效果，不想花几小时建图
 - 查询类型混合——既有具体问题又有全局问题，但全局问题不需要极致完整
 典型场景：新闻聚合平台的智能问答、客服知识库、研究者的个人论文库。

 

### 总结

 要深度选 GraphRAG，要灵活选 LightRAG。

 GraphRAG 像&quot;先花大价钱修一条高速公路&quot;——前期投入大，但跑起来又快又稳；LightRAG 像&quot;修一条普通公路，随时可以加宽&quot;——前期成本低，增量灵活，但极致性能不如高速公路。

 面试时别只说&quot;我用了 GraphRAG&quot;，要说清楚为什么选它——你的数据规模多大、更新频率多高、查询类型偏什么、预算多少。选型的逻辑比选型本身更重要。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="graphrag_interview-q7">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">7. 大厂真实面试追问汇总</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 卡码笔记 · 考察点：7. 大厂真实面试追问汇总</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：以下是各大厂在 GraphRAG / LightRAG 方向的真实追问，整理汇总</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

以下是各大厂在 GraphRAG / LightRAG 方向的真实追问，整理汇总。

 

### 概念理解类

 Q：GraphRAG 和知识图谱问答（KGQA）有什么区别？

 KGQA 是直接在已有知识图谱上做问答，图谱是事先人工或半人工构建的。GraphRAG 的图谱是自动从文本中提取的，不需要预先建好图谱。另外 GraphRAG 还保留了原始文本块，图谱和文本协同检索，不只是靠图谱。这是它比纯 KGQA 更鲁棒的地方。

 Q：为什么 GraphRAG 用 Leiden 不用 Louvain？

 Louvain 有一个已知问题：可能产生&quot;内部不连通&quot;的社区——社区里的节点并不全连通。Leiden 是 Louvain 的改进版，保证社区内部一定连通。对于知识图谱这种节点连接不均匀的图，这个保证很重要。

 Q：传统 RAG 加上知识图谱就是 GraphRAG 吗？

 不完全是。加一个知识图谱做辅助检索确实能提升效果，但 GraphRAG 的核心创新不在&quot;有图谱&quot;，而在社区摘要的预计算。如果只是建个图谱做实体检索，没有社区层级和预计算摘要，全局性问题还是答不好。GraphRAG = 知识图谱 + 社区层级 + 预计算摘要 + Map-Reduce 查询，四个缺一不可。

 

### 技术深挖类

 Q：GraphRAG 的实体提取准确率不够怎么办？

 三个方向：一是优化提取 Prompt，给 LLM 提供领域术语表和实体类型定义；二是后处理过滤，用规则或二次 LLM 调用清洗低置信度的实体和关系；三是引入 NER 模型做初筛，再用 LLM 做精细提取。实际项目中，纯靠 LLM 提取的准确率在 70-80%，加上后处理能到 85%+。

 Q：LightRAG 的增量插入会不会导致图谱越来越乱？

 会。随着不断插入新实体和关系，图谱可能变得稀疏或冗余。LightRAG 的去重机制能防住大部分重复节点，但长期运行后还是需要定期做一次图谱清洗——合并冗余节点、修剪低权重的边、删除孤立的实体。这和数据库需要定期维护是一个道理。

 Q：GraphRAG 的 Map-Reduce 查询 token 消耗大不大？

 大。全局查询要把所有相关社区的摘要都过一遍 LLM，社区数量多的话 token 消耗很高。优化方式：选择更高层级的社区（数量更少、每个更概括），或者先对社区摘要做一次筛选，只把和问题相关的送进 Map 阶段。

 

### 场景设计类

 Q：设计一个法律文档检索系统，GraphRAG 和 LightRAG 你选哪个？

 选 GraphRAG。理由：法律文档库通常规模大但更新频率低（法规变动不频繁），全局性问题多（&quot;近五年合同纠纷案件的判决趋势&quot;），而且预算通常充足。法律场景对答案完整性要求高，GraphRAG 的预计算社区摘要优势明显。

 Q：设计一个新闻聚合平台的智能问答，你选哪个？

 选 LightRAG。理由：新闻每分钟都在更新，增量插入是刚需；用户查询既有具体的（&quot;某某事件的最新进展&quot;）也有偏全局的（&quot;本周科技行业的热点话题&quot;），LightRAG 的四种查询模式都能覆盖；而且新闻平台通常对成本敏感，LightRAG 的索引成本只有 GraphRAG 的一半左右。

 Q：如果预算有限但又有全局查询需求，怎么办？

 三种思路：一是用 LightRAG 的 Hybrid 模式，大部分场景够用；二是传统 RAG + 简单图谱辅助（不加社区摘要，只在实体检索时走图谱），成本可控、效果有提升；三是用 GraphRAG 但只在核心数据子集上建图，非核心数据走传统 RAG，混合架构。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="rag_hardest_parts_interview">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">目录</span></h2>

# RAG落地最难的地方在哪？文档预处理、召回质量、生成忠实度 如果大家简历上有RAG的项目，或者 【专业技能】上写了RAG相关内容。

 面试官很可能就会问你：&quot;在实际落地中，你觉得 RAG 最难的地方是哪里？&quot;

 这个问题其实很考察候选人的实战经历，也是可以作为面试官判断你是不是就只简单背一背八股，做个demo项目。

 面对这个问题，有的录友会答&quot;幻觉&quot;，有的答&quot;分块策略&quot;，有的答&quot;Embedding 选型&quot;。

 这些都不算错，但还是差点意思。

 RAG 最难的不是某一个环节，是三个环节都有坑，而且上游的坑会级联放大。

 文档预处理没做好 → 召回搜不到对的文档 → 召回混入噪声 → 生成被带偏产生幻觉。

 很多人只盯着召回调优，却忽略了文档预处理才是源头。

 这篇文章，我们把 RAG 落地的三大难点拆开讲：文档预处理（最容易被低估）、召回质量（最难调）、生成忠实度（最容易被忽视），每个难点讲清楚为什么难、难在哪、怎么解。


## 目录





<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 卡码笔记 · 考察点：RAG落地最难的地方在哪？文档预处理、召回质量、生成忠实</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：面试官问 RAG 落地最难的地方，不要只说&quot;召回不准&quot;或&quot;模型幻觉&quot;，要展示从全链路视角的系统性理解</div>
</div>

- 三个难点，级联放大
 - 文档预处理：最容易被低估的难点
- 解析：格式复杂，解析就是大坑
 - 清洗：噪声不除，后患无穷
 - 增量更新：知识库不是一锤子买卖

 - 召回质量：最难调的难点
- 语义鸿沟：用户问法和文档写法对不上
 - 分块策略：切太碎丢上下文，切太大引入噪声
 - 精度 vs 召回率：多召回还是少召回

 - 生成忠实度：最容易被忽视的难点
- 召回对了但模型不忠实
 - Lost in the Middle：关键信息被淹没
 - 上下文利用不充分

 - 面试怎么答


## 一、三个难点，级联放大

**题目**：一、三个难点，级联放大



### 回答

先看 RAG 的完整链路（向量检索、Rerank、Chunk 这些基础概念如果还不熟，建议先看 RAG 大厂面试题汇总）：用户提问 → 检索相关文档 → 把文档和问题一起丢给大模型 → 大模型生成回答。

 这个链路看似简单，实际每个环节都有坑：

 

 文档预处理是源头。文档解析不清、清洗不干净，后面的召回和生成都是在&quot;脏数据&quot;上工作。垃圾进，垃圾出。

 召回质量是中枢。召回错了，后面全白费——生成模型再强也救不回来。但&quot;搜不准&quot;比&quot;搜不到&quot;更可怕：不相关文档混进来，反而会把生成带偏。

 生成忠实度是出口。即使召回对了，模型也可能不忠实于检索到的文档，自己编造信息，或者忽略了最关键的那段文档。

 这三个难点不是独立的，上游的坑会级联放大。文档没清干净 → 召回搜出垃圾 → 垃圾文档混入上下文 → 模型被噪声带偏 → 输出幻觉。

 所以调 RAG，不能只盯一个环节，得从源头开始，逐层保障。


## 二、文档预处理：最容易被低估的难点

**题目**：二、文档预处理：最容易被低估的难点



### 回答

很多人聊 RAG，直接从 Embedding 和检索开始聊，好像文档天然就是干净的结构化文本。但真实场景里，文档预处理才是最耗时间、最容易被低估的环节。

 做过 RAG 落地的都知道：80% 的工期花在数据上，20% 花在模型和检索上。

 

### 解析：格式复杂，解析就是大坑

 企业的知识库不是干净的 Markdown 文本，而是 PDF、Word、扫描件、PPT、Excel、图片混在一起。

 一个典型的 PDF 文档，里面可能包含：多层嵌套表格、分栏排版、页眉页脚、内嵌图片、扫描的图片版文字。通用解析工具处理这些，出来的结果经常是乱的——表格被打散成零散的文本行，分栏内容交错在一起，页眉页脚混入正文。

 解析做不好，后面的召回就变成了在乱码里找答案。

 

 实际解法：

 - 表格处理：用专门的表格解析工具（如 Camelot、pdfplumber），把表格提取为结构化数据（HTML/Markdown 表格），不要和正文混在一起
 - 扫描件：OCR 是必须的，但 OCR 本身也有错误率，需要后处理纠错
 - 多格式统一：不管源文档是什么格式，最终都要归一化为统一的中间格式（如 Markdown），方便后续处理
 

### 清洗：噪声不除，后患无穷

 解析完的文档不是直接能用的，里面有很多噪声：

 - 页眉页脚（&quot;第3页 共15页&quot;、&quot;公司内部资料 请勿外传&quot;）
 - 导航栏和目录（从网页抓取的文档尤其严重）
 - 重复内容（同一份文档的多个版本）
 - 格式残留（残缺的 HTML 标签、乱码字符）
 这些噪声不清洗，就会变成召回时的干扰项。你搜&quot;退货流程&quot;，召回来一段&quot;公司内部资料 请勿外传&quot;，这段噪声占用了上下文窗口，挤掉了真正有用的文档。

 实际解法：

 - 规则过滤：用正则匹配常见的噪声模式（页码、版权声明、导航链接），直接过滤
 - 去重：对文档做去重（SimHash、MinHash），避免重复内容占据检索空间
 - 质量打分：对每个文档块做质量打分（长度、完整性、可读性），低分的不入库
 

### 增量更新：知识库不是一锤子买卖

 上线初期，你花了两周把文档预处理干净、入库，以为搞定了。但知识库是活的——产品规则变了、价格调整了、新功能上线了，文档每天都在变。

 增量更新要解决三个问题：哪些文档变了？变了的部分怎么更新？旧的版本怎么处理？

 - 哪些变了：用文档的元数据（更新时间、版本号）做变更检测，或者对文档内容做哈希比对
 - 变了怎么更新：不能全量重建（太慢），要做增量更新——只重新处理变更的部分，替换向量库中对应的向量
 - 旧版本怎么处理：有些场景需要保留历史版本（如合同变更追溯），有些可以直接覆盖
 这一步做不好，知识库就会逐渐&quot;腐烂&quot;——召回的文档是过时的，生成的回答也是错的。


## 三、召回质量：最难调的难点

**题目**：三、召回质量：最难调的难点



### 回答

文档预处理做好之后，接下来是召回。这一步是 RAG 的中枢——召回错了，后面全白费。

 召回难，不是&quot;搜不到&quot;，而是&quot;搜不准&quot;。向量检索是基于语义相似度的，但语义相似不等于任务相关。

 

### 语义鸿沟：用户问法和文档写法对不上

 用户问&quot;怎么退款&quot;，文档写的是&quot;售后退货流程指引&quot;——语义相近但字面不匹配，通用 Embedding 可能匹配不上。

 用户问&quot;账号被锁了怎么办&quot;，文档里没有&quot;账号被锁&quot;，写的是&quot;登录异常处理方案&quot;——模型得理解&quot;账号被锁&quot;和&quot;登录异常&quot;是一回事。

 

 这种鸿沟在专业领域更严重。医疗场景里，患者说&quot;胸口闷&quot;，病历写&quot;胸闷待查&quot;；法律场景里，当事人说&quot;被辞退了&quot;，法条写&quot;劳动合同解除&quot;——不是同一个词，但是同一件事。

 实际解法：

 - Query 改写/扩展：用大模型把用户的口语化提问改写为更规范的查询，或者扩展为多个查询维度。比如&quot;怎么退款&quot; → [&quot;退款流程&quot;, &quot;售后退货&quot;, &quot;退款申请&quot;]
 - HyDE（Hypothetical Document Embedding）：先让大模型生成一个&quot;假设性回答&quot;，用这个回答的 Embedding 去检索。假设性回答和真实文档的语义更接近，比直接用短 Query 检索效果好
 - 混合检索：关键词检索（BM25）擅长精确匹配，语义检索（Embedding）擅长语义匹配，两者结合覆盖更全
 

### 分块策略：切太碎丢上下文，切太大引入噪声

 文档不能整篇存入向量库，需要分块（Chunking）。但分块大小是个两难：

 

 切太碎的典型问题：一份合同里，第3段定义了&quot;违约行为&quot;，第4段说&quot;根据上述定义，以下行为属于违约&quot;。如果恰好在第3段和第4段之间切开，第4块变成&quot;以下行为属于违约&quot;，召回了也看不懂。

 切太大的典型问题：一整页产品文档，只有中间两行是用户问题的答案，但整页都被召回了。无关内容占据上下文窗口，挤掉了其他相关文档的位置。

 实际解法：

 - 语义分块：不按固定字数切，而是按语义边界切——用模型判断哪里是段落/主题的自然分割点
 - 父子文档：小块做召回（精准定位），大块做生成（保留上下文）。召回时命中小块，生成时把小块对应的父文档整段喂给模型
 - 重叠切分：相邻块之间保留一定重叠（如10%），避免关键信息正好在切点处断裂
 

### 精度 vs 召回率：多召回还是少召回

 Top-K 参数的选取是个经典取舍：

 - K 太小（如 K=3）：可能漏掉关键文档，回答不完整
 - K 太大（如 K=10）：噪声文档混进来，反而带偏生成，还浪费上下文窗口
 

 更关键的是，这个&quot;甜蜜点&quot;不是固定的，不同类型的问题需要不同的 K 值。简单事实型问题（&quot;公司地址在哪&quot;）K=3 就够了，复杂分析型问题（&quot;分析去年营收下滑原因&quot;）可能需要 K=10 以上。

 实际解法：

 - Rerank 二次排序：先用较大 K 值（如 K=20）粗召回，再用 Cross-Encoder 做精准排序，取 Top-N（如 N=5）。粗召回保证不漏，Rerank 保证精度
 - 动态 K 值：根据问题类型动态调整 K 值——简单问题用小 K，复杂问题用大 K。问题分类可以用规则或轻量模型判断
 混合检索 + Rerank 是目前工业界的标配方案，效果比单独用关键词或语义检索都好。

 但如果知识本身是图状的——实体之间多跳关联、需要全局归纳，向量召回再怎么调也会碰天花板，这时候得换知识图谱检索的思路，见 GraphRAG 与 LightRAG 大厂面试题汇总。


## 四、生成忠实度：最容易被忽视的难点

**题目**：四、生成忠实度：最容易被忽视的难点



### 回答

文档预处理做好了，召回也对了，是不是就稳了？不是。召回对了但模型不忠实，是 RAG 里最隐蔽的问题。

 

### 召回对了但模型不忠实

 模型拿到了正确的文档，但生成的回答里有文档没提到的内容——这就是 RAG 场景下的幻觉。

 比如文档写的是&quot;退货需在7天内申请，且商品未拆封&quot;，模型回答&quot;退货需在7天内申请&quot;——这还OK。但有的模型会接着说&quot;超过7天也可以联系客服协商处理&quot;——文档里根本没这句话，模型自己&quot;补&quot;的。

 这种幻觉最危险，因为它和正确信息混在一起，用户很难分辨。 RAG 只是幻觉的一个来源，Agent 系统里还有工具调用、多轮上下文等更多触发点，系统性的幻觉约束思路见 Agent 系统如何约束大模型幻觉。

 实际解法：

 - Prompt 强约束：在系统提示词中明确要求&quot;只根据提供的文档内容回答，文档中没有的信息不要编造，不确定时回答'文档中未提及'&quot;。这一条看起来简单，但实际效果立竿见影
 - 引用溯源：要求模型在回答中标注信息来源，比如&quot;根据文档A，退货需在7天内申请&quot;。模型要编造内容时，找不到对应的文档引用，就编不下去了
 - 后处理校验：生成回答后，用一个轻量模型或规则引擎，把回答和原始文档做交叉比对，检测回答中是否包含文档未提及的声明，发现幻觉就打回重新生成
 - 拒绝回答机制：当模型对回答的置信度不够时，宁可说&quot;根据已有文档无法回答&quot;，也不要硬编。可以通过调整 temperature（降低随机性）或在 Prompt 中设置拒绝条件来实现
 

### Lost in the Middle：关键信息被淹没

 Transformer大厂面试题汇总 里讲过 &quot;Lost in the Middle&quot; 现象：大模型对上下文中间位置的信息关注度最低。

 RAG 场景里，检索到的多篇文档拼接后塞进 Prompt，关键信息可能恰好落在中间位置。模型&quot;看到了&quot;但&quot;没注意到&quot;，生成时忽略了最重要的那段文档。

 

 实际解法：

 - 文档排序：把最相关的文档放在上下文的首尾位置（开头和结尾），不相关的放中间。或者只用最相关的2-3篇，不要贪多
 - Rerank 后取 Top-N：通过 Rerank 精选最相关的文档，减少塞入上下文的文档数量，降低&quot;中间位置&quot;的干扰
 

### 上下文利用不充分

 给了模型5段相关文档，但模型只用了2段——另外3段明明也相关，但模型没有利用。

 这在多维度问题上尤其明显。比如用户问&quot;产品X和产品Y的区别&quot;，检索到了产品X的文档和产品Y的文档，但模型只看了产品X的，对产品Y的信息一笔带过，导致对比不完整。

 实际解法：

 - Prompt 约束：在 Prompt 中明确要求&quot;必须基于所有提供的文档回答，不要遗漏&quot;
 - 分解回答：对于复杂问题，把问题拆成子问题，每个子问题单独检索+生成，最后合并。这样每个子问题只需要处理少量文档，利用率更高
 - 引用溯源：要求模型在回答时标注信息来源（如&quot;根据文档A，...&quot;），迫使模型逐条参考文档，而不是凭印象生成


## 五、面试怎么答

**题目**：五、面试怎么答



### 回答

面试官问 RAG 落地最难的地方，不要只说&quot;召回不准&quot;或&quot;模型幻觉&quot;，要展示从全链路视角的系统性理解。

 参考回答思路：

 &quot;RAG 落地最难的不是某一个环节，是三个环节都有坑，而且级联放大。

 最容易被低估的是文档预处理。很多团队上来就调 Embedding 和检索，但文档没清干净、表格解析乱了、知识库没更新，后面的召回和生成都是在脏数据上工作。我做过一个项目，80% 的工期花在数据上，20% 花在模型和检索上。

 最难调的是召回质量。核心难点是用户问法和文档写法之间的语义鸿沟，以及分块策略的两难——切太碎丢上下文，切太大引入噪声。我的解法是混合检索加 Rerank，粗召回保证不漏，二次排序保证精度。

 最容易被忽视的是生成忠实度。召回对了但模型不忠实，幻觉和正确信息混在一起，用户很难分辨。还有 Lost in the Middle 问题——关键文档落在上下文中间，模型注意力不够。解法是文档排序优化和引用溯源。

 这三个问题的共同点是：都是工程问题，不是算法问题。调模型参数解决不了，得在链路的每个环节做约束和保障。&quot;

 这个回答从全链路视角讲，先说级联关系，再逐个拆解，最后点出&quot;工程问题不是算法问题&quot;，比只背&quot;混合检索效果好&quot;高一档。

---
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="rag_interview-q1">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">1. RAG 是什么？为什么需要 RAG？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 卡码笔记 · 考察点：1. RAG 是什么？为什么需要 RAG？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：# RAG大厂面试题汇总：向量检索、混合检索、Rerank、幻觉处理高频问题 今年知识星球  (opens new window)里，录友反馈最多的面试变化就是：RAG 成了必考项</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

# RAG大厂面试题汇总：向量检索、混合检索、Rerank、幻觉处理高频问题 今年知识星球  (opens new window)里，录友反馈最多的面试变化就是：RAG 成了必考项。

 不管你投的是大模型应用开发、LLM 工程、还是 AI 后端，面试官都会问：&quot;你做过 RAG 吗？检索策略怎么设计的？&quot;

 但很多录友对 RAG 的理解，就停留在&quot;用 LangChain 跑通了 pipeline&quot;这一步。面试官一追问底层原理就露馅。

 向量检索和关键词检索什么区别？混合检索为什么比纯向量好？Rerank 到底解决什么问题？Chunk 怎么切才能不丢信息？幻觉怎么处理？ 这些搞不清楚，面试官深挖两轮就原形毕露。

 这篇文章把 RAG 面试从基础到进阶全部讲透，认真看完，面试不再怕被追问。

面试官一般这么问：&quot;为什么不让 LLM 直接回答，非要用 RAG？&quot;或者&quot;LLM 的知识截止问题你怎么解决？&quot;

 

### LLM 的三大知识缺陷

 ① 知识截止——训练数据有截止日期，昨天发生的事它不知道。你问它&quot;2026年3月发布的 XX 框架有什么特性&quot;，它要么瞎编要么说不知道。

 ② 私有数据无法触达——公司的内部文档、客户数据、业务规则，这些 LLM 从来没见过，直接问就是胡说。

 ③ 容易幻觉——当 LLM 不确定但又想回答时，它会编造看似合理但完全错误的信息。这个问题在没有外部知识验证时尤其严重。

 

### RAG 的核心思路

 RAG（Retrieval-Augmented Generation，检索增强生成）的本质就一句话：在 LLM 生成回答之前，先从外部知识库检索相关信息，把检索结果塞进 Prompt，让 LLM 基于事实回答。

 没有 RAG：用户问题 → LLM → 回答（可能幻觉）

 有 RAG：用户问题 → 检索相关知识 → [问题 + 检索结果] → LLM → 回答（基于事实）

 面试核心点：RAG 不是替代 LLM，是给 LLM 补充外部知识。LLM 负责理解和生成，RAG 负责提供事实依据。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="rag_interview-q10">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">10. RAG 检索效果不好怎么优化？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 卡码笔记 · 考察点：10. RAG 检索效果不好怎么优化？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：面试官会问：&quot;你们 RAG 项目的检索准确率是多少</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

面试官会问：&quot;你们 RAG 项目的检索准确率是多少？效果不好的时候你怎么优化的？&quot;

 这是考察工程经验的关键题。没有标准答案，但优化思路要说清楚。

 

### 优化思路：从链路的每一步找问题

 文档处理阶段——PDF 表格提取准确率够不够？图片里的文字有没有 OCR？不同格式（PDF/Word/Markdown）分别做了什么适配？

 Chunk 阶段——chunk_size 合不合理？有没有针对不同文档类型调参？overlap 设的多少？

 检索阶段——纯向量还是混合检索？Top-K 设多少？有没有加 Rerank？

 生成阶段——Prompt 怎么写的？幻觉怎么处理的？

 

### 四种高级优化策略

 ① Query 改写——用户的问题可能表述不清或太短，先用 LLM 改写成更适合检索的 query。

 原始问题：怎么调优？
改写后：RAG 系统中向量检索准确率低，有哪些优化方法？
 1
2
② 多路召回——同一问题用多种方式检索：原问题检索、改写问题检索、提取关键词检索、拆分子问题检索，最后合并结果。

 ③ Parent-Child 检索——检索时用小 chunk（精确匹配），返回时用大 chunk（保留上下文）。具体做法：小 chunk 存向量索引用于检索，每个小 chunk 关联一个父 chunk，检索命中后返回父 chunk 的完整内容。

 ④ 上下文窗口扩展——检索到一个 chunk 后，把它前后的 chunk 也带上，保证上下文完整。

 面试加分：能说出你实际用过的优化策略和量化效果。比如&quot;加了 Rerank 后 Top-5 召回率从 71% 提到 89%&quot;&quot;混合检索比纯向量检索在专业术语场景下准确率提升了 25%&quot;。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="rag_interview-q11">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">11. Agentic RAG 是什么？和普通 RAG 有什么区别？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 卡码笔记 · 考察点：11. Agentic RAG 是什么？和普通 RAG</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：面试官会问：&quot;你了解 Agentic RAG 吗</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

面试官会问：&quot;你了解 Agentic RAG 吗？它和普通 RAG 有什么区别？&quot;

 

### 普通 RAG 的局限

 普通 RAG 是固定流程：用户问 → 检索一次 → 生成回答。如果第一次检索结果不好，它不会自己纠正，直接硬生成。就像一个不会反思的人，说错就错到底。

 

### Agentic RAG：让 RAG 自己决定怎么检索

 Agentic RAG 把 Agent 的规划能力引入 RAG——LLM 自己判断：需要检索哪些数据源？检索结果够不够？不够就换个角度再检索。

  普通 RAG Agentic RAG 检索次数 固定 1 次 动态，LLM 决定 检索策略 固定 pipeline LLM 自主选择 结果不满意 直接生成 换策略重新检索 复杂问题 容易答偏 可以拆解子问题分步检索 Token 消耗 低 高（多次推理） 

 

### Agentic RAG 的工作流程

 用户问题 → Agent 规划：这个问题需要检索什么？
         → 第一次检索 → 结果不够？
         → Agent 判断：换个 query 再检索
         → 第二次检索 → 结果够了？
         → Agent 判断：够了，生成回答
 1
2
3
4
5
面试核心点：Agentic RAG 适合复杂知识问答场景（法律、医疗、金融），简单问答用普通 RAG 就够了，别过度设计。能说出这个判断，面试官就知道你有工程判断力。

 还有一类问题普通 RAG 和 Agentic RAG 都吃力：实体之间的复杂关联、多跳推理、全局关系归纳。这种场景要把检索从向量切到知识图谱，具体见 GraphRAG 与 LightRAG 大厂面试题汇总。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="rag_interview-q12">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">12. 大厂真实面试追问汇总</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 卡码笔记 · 考察点：12. 大厂真实面试追问汇总</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：以下是各大厂在 RAG 方向的真实追问，整理汇总</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

以下是各大厂在 RAG 方向的真实追问，整理汇总。

 

### 检索策略类

 Q：你们的混合检索权重怎么调的？向量检索和 BM25 各占多少？

 两种常见做法：一是手动调权重（向量 0.7 + BM25 0.3），在验证集上试出最佳比例；二是用 RRF 合并，不设权重，靠排名融合，更稳健。生产环境推荐 RRF，因为不同 query 的最佳权重差异很大，固定权重不一定好。

 Q：Top-K 设多少？设大了设小了各有什么问题？

 设小了（K=3）：可能漏掉相关文档，召回不够。设大了（K=20）：太多无关信息干扰 LLM，增加幻觉风险和 Token 消耗。通常 K=5-10 是比较好的平衡点，加了 Rerank 之后可以先用 K=20 检索再 Rerank 取 Top-5。

 Q：如果用户的问题很模糊，检索效果差，怎么办？

 Query 改写：用 LLM 把模糊问题改写成更具体的检索 query。多路召回：同时用原始 query、改写 query、提取关键词分别检索再合并。追问确认：如果太模糊，Agent 可以先追问用户澄清需求。

 

### 工程落地类

 Q：RAG 系统的端到端延迟怎么优化？

 优化链路：vLLM 部署推理服务（减少 LLM 推理延迟）、KV Cache 复用（相似问题不重复计算）、流式输出（用户不用等全部生成完）、Prompt 压缩（减少 Token 数降低延迟）、HNSW 索引优化（向量检索延迟压到 50ms 以下）。

 Q：文档更新了，向量索引怎么更新？

 三种策略：全量重建（简单但慢，适合日级更新）、增量更新（只重新 embed 变更的文档，适合实时更新）、双写（新文档同时写旧索引和新索引，切换时零停机）。

 Q：RAG 的 Token 成本怎么控制？

 Prompt 压缩：裁剪检索结果中的冗余内容、上下文窗口管理：只保留当前问题相关的历史、模型路由：简单问题用小模型，复杂问题才用大模型、缓存：相同或相似问题的检索结果缓存复用。

 

### 场景设计类

 Q：设计一个面向 10 万用户的 RAG 知识库系统，你会怎么设计？

 从五个维度展开：数据层（文档解析→Chunk→Embedding→向量库 + ES 双写）、检索层（混合检索 + Rerank，Top-20 检索 + Top-5 精排）、生成层（vLLM 部署 + Prompt 模板 + 幻觉约束）、工程层（Redis 缓存热点查询、异步处理文档更新、监控检索准确率和幻觉率）、安全层（文档权限隔离、Prompt Injection 防御、敏感信息过滤）。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="rag_interview-q2">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">2. RAG 的完整链路是怎样的？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 卡码笔记 · 考察点：2. RAG 的完整链路是怎样的？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：面试官会问：&quot;你说你做过 RAG 项目，能完整讲一下从用户提问到最终回答的链路吗</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

面试官会问：&quot;你说你做过 RAG 项目，能完整讲一下从用户提问到最终回答的链路吗？&quot;

 这是基础中的基础，但很多人讲不清楚。

 

### RAG 七步链路

 

 Query → 文档处理 → Chunking → Embedding → 检索 → Rerank → 生成

 每一步做什么：

 步骤 做什么 关键决策 文档处理 解析 PDF/Word/Markdown，提取文本 PDF 表格怎么处理？OCR 要不要？ Chunking 把长文档切成小块 切多大？overlap 多少？按语义切还是固定长度？ Embedding 把文本块转成向量 用什么模型？维度多少？中文还是英文？ 检索 根据用户问题检索最相关的文本块 纯向量还是混合检索？Top-K 设多少？ Rerank 对检索结果重排序 用什么 Rerank 模型？重排后再取 Top-N 生成 把检索结果 + 问题喂给 LLM 生成回答 Prompt 怎么写？幻觉怎么约束？ 面试答法：不要只背这七个步骤，要说清楚每一步的关键决策点。面试官想听的不是&quot;我用了 Milvus&quot;，而是&quot;我为什么选 Milvus 不选 FAISS，检索延迟要求多少，为什么 Top-K 设 5 不是 10&quot;。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="rag_interview-q3">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">3. 向量检索的原理是什么？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 卡码笔记 · 考察点：3. 向量检索的原理是什么？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：面试官会问：&quot;向量检索和关键词检索有什么区别</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

面试官会问：&quot;向量检索和关键词检索有什么区别？&quot;以及&quot;Embedding 的原理是什么？为什么语义相似的文本向量距离近？&quot;

 

### 向量检索的本质

 把文本转换成高维空间中的点，语义相似的文本在这个空间里距离近。检索就是找离问题向量最近的几个文档向量。

 举个例子：

 &quot;如何优化数据库查询&quot; → [0.12, -0.34, 0.56, ...]  ← 这些向量在空间中距离很近
&quot;数据库性能调优方法&quot; → [0.11, -0.32, 0.55, ...]
&quot;今天天气不错&quot;       → [-0.45, 0.78, -0.23, ...]  ← 和上面距离远
 1
2
3

### 相似度计算

 最常用的是余弦相似度，计算两个向量的夹角余弦值：

 cos(A, B) = (A · B) / (|A| × |B|)
 1
值域 [-1, 1]，越大越相似。1 表示方向完全相同，0 表示无关，-1 表示方向相反。

 为什么不用欧氏距离？ 因为向量的模长受文本长度影响，长文本的向量模长大，但语义不一定更相关。余弦相似度只看方向不看长度，对语义检索更合适。

 

### ANN 检索（近似最近邻）

 文档量大了（百万级以上），逐个计算相似度太慢。ANN 的思路是：不要求找到绝对最近的，找到足够近的就行，换速度。

 主流 ANN 算法：

 算法 原理 特点 HNSW 多层跳表图，从上层粗搜到下层精搜 查询快，内存占用大，Milvus 默认 IVF 先聚类，只搜最近的几个簇 可控精度，适合超大规模 PQ（乘积量化） 压缩向量维度，降低内存 内存省，精度有损 面试加分：能说出 HNSW 的核心参数 ef_construction（建图时搜索宽度，越大图质量越高但建图越慢）和 M（每个节点的邻居数，越大图越密但内存越大），面试官就知道你真调过。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="rag_interview-q4">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">4. 向量数据库怎么选？Milvus、FAISS、Qdrant 各自适合什么场景？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 卡码笔记 · 考察点：4. 向量数据库怎么选？Milvus、FAISS、Qdr</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：面试官会问：&quot;你们项目用的什么向量数据库</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

面试官会问：&quot;你们项目用的什么向量数据库？为什么选它？&quot;

 

### 三者对比

  FAISS Milvus Qdrant 类型 库（Library） 数据库（Database） 数据库（Database） 部署方式 嵌入应用进程 独立服务，支持分布式 独立服务，轻量级 持久化 需自己实现 原生支持 原生支持 适合规模 百万级以下 亿级 千万级 运维成本 低（无额外服务） 中（需部署集群） 低（单节点起步） 生产环境 适合原型验证 适合大规模生产 适合中小规模生产 面试答法：先说你的选型理由，再提你知道其他方案的优缺点。比如：&quot;我们选 Milvus，因为生产环境需要多副本部署和持久化，FAISS 不支持分布式，Qdrant 当时生态还不够成熟。如果是做 Demo 我会用 FAISS，快。&quot;
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="rag_interview-q5">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">5. 纯向量检索有什么问题？为什么需要混合检索？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 卡码笔记 · 考察点：5. 纯向量检索有什么问题？为什么需要混合检索？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：面试官会问：&quot;你们项目用的纯向量检索还是混合检索</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

面试官会问：&quot;你们项目用的纯向量检索还是混合检索？为什么？&quot;这是 RAG 面试的高频考点。

 

### 纯向量检索的三个致命问题

 ① 精确匹配不行——用户搜&quot;RFC 7231&quot;，向量检索可能返回&quot;HTTP 协议规范&quot;这种语义相关但没提到 RFC 7231 的文档。因为它靠语义相似度，不是精确匹配。

 ② 专业术语召回差——&quot;K8s 的 HPA 怎么配置&quot;，向量检索可能找的是&quot;Kubernetes 自动扩缩容&quot;，而真正包含 HPA 配置细节的文档反而排不上。专业术语的向量表示和口语描述的向量表示距离可能很远。

 ③ 专有名词遗漏——产品名、人名、缩写这些，向量检索容易丢失。

 

### 混合检索 = 向量检索 + 关键词检索

 混合检索同时跑两路：

 - 向量检索：抓语义相关的文档（&quot;数据库优化&quot;和&quot;SQL 调优&quot;能匹配上）
 - 关键词检索（BM25）：抓精确匹配的文档（&quot;RFC 7231&quot;能精确命中）
 两路结果合并，取长补短。

 

 

### 合并策略：RRF（Reciprocal Rank Fusion）

 最常用的合并方法，公式很简单：

 RRF_score(d) = Σ 1 / (k + rank_i(d))
 1
k 通常设 60，rank_i(d) 是文档 d 在第 i 路检索中的排名。排名越靠前，贡献分数越高。

 def rrf_merge(vector_results, bm25_results, k=60):
    scores = {}
    for rank, doc in enumerate(vector_results):
        scores[doc.id] = scores.get(doc.id, 0) + 1 / (k + rank + 1)
    for rank, doc in enumerate(bm25_results):
        scores[doc.id] = scores.get(doc.id, 0) + 1 / (k + rank + 1)
    return sorted(scores.items(), key=lambda x: x[1], reverse=True)
 1
2
3
4
5
6
7
面试核心点：能说清楚纯向量检索的三个问题，以及混合检索为什么能解决，合并策略用 RRF。这就是面试官想听的深度。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="rag_interview-q6">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">6. Rerank 是什么？为什么检索之后还要重排序？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 卡码笔记 · 考察点：6. Rerank 是什么？为什么检索之后还要重排序？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：面试官会问：&quot;你已经用混合检索了，为什么还要 Rerank</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

面试官会问：&quot;你已经用混合检索了，为什么还要 Rerank？检索结果不够好吗？&quot;

 

### 检索和 Rerank 的区别

 检索是粗筛——从百万文档里快速捞出 Top-20，速度快但精度有限。用向量相似度或 BM25 打分，这种打分是近似的，不一定反映真实相关性。

 Rerank 是精排——对 Top-20 重新计算相关性分数，用更精确的模型（通常是 Cross-Encoder）逐个打分，把真正最相关的排到前面。

 

### 为什么检索的打分不够准？

 向量检索用的是 Bi-Encoder：问题和文档分别编码成向量，再算相似度。问题和文档在编码时互不知道对方的存在，所以只能算&quot;大概相关&quot;。

 Rerank 用的是 Cross-Encoder：把问题和文档拼在一起送进模型，模型可以同时看到双方内容，做更精确的相关性判断。代价是慢——Cross-Encoder 不能预计算，每个 (问题, 文档) 对都要过一遍模型，所以只能对少量候选做精排。

 

 

### Rerank 的效果

 实际项目中，Rerank 带来的提升很明显：

 指标 检索后（无 Rerank） Rerank 后 Top-5 召回率 71% 89% Top-3 准确率 65% 84% 

### 常用 Rerank 模型

 模型 特点 BGE-Reranker (bge-reranker-v2-m3) 中文效果好，开源免费 Cohere Rerank API 调用，效果好，英文为主 bce-reranker-base_v1 中文场景，轻量级 面试答法：&quot;检索是粗筛快捞，Rerank 是精排提准。检索用 Bi-Encoder 快但粗，Rerank 用 Cross-Encoder 慢但准。先用检索从百万级捞 Top-20，再用 Rerank 精排取 Top-5，这是生产环境的标配流程。&quot;
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="rag_interview-q7">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">7. Chunk 怎么切？切大了切小了各有什么问题？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 卡码笔记 · 考察点：7. Chunk 怎么切？切大了切小了各有什么问题？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：面试官会问：&quot;你们 Chunk 策略怎么设计的</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

面试官会问：&quot;你们 Chunk 策略怎么设计的？chunk size 设的多少？为什么？&quot;

 这是面试官判断你&quot;是跑过 Demo 还是真做过 RAG&quot;的关键题。

 

### 切大了什么问题？

 信息稀释——一个 chunk 里塞了太多内容，检索时真正相关的那部分被其他无关内容淹没，导致相似度分数降低，排名靠后。

 

### 切小了什么问题？

 上下文丢失——一个完整的论述被切成碎片，检索出来的是断章取义的片段，LLM 拿到后无法理解完整含义，生成质量下降。

 

### 三种主流 Chunk 策略

 ① 固定长度切分——最简单，每 512 token 切一块。优点是简单，缺点是不管语义边界，可能把一句话切两半。

 ② 递归切分——按段落→句子→字符的优先级递归切分，尽量在自然边界处切断。这是生产环境最常用的方案。

 from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=200,  # 相邻 chunk 重叠 200 字符
    separators=[&quot;\n\n&quot;, &quot;\n&quot;, &quot;。&quot;, &quot;！&quot;, &quot;？&quot;, &quot;；&quot;, &quot;，&quot;, &quot; &quot;, &quot;&quot;]
)
 1
2
3
4
5
6
7
③ 语义切分——用 Embedding 计算相邻句子的语义相似度，在语义断点处切分。理论上最好，但计算量大，生产环境用得少。

 

### overlap 的作用

 相邻 chunk 之间重叠一部分文字，避免关键信息正好在切割点上被截断。overlap 通常设 chunk_size 的 10%-20%。

 

### 不同文档类型分别怎么处理？

 文档类型 处理策略 Markdown 按标题层级切分，保留标题层级信息 PDF 先解析表格和图片，再按段落切分 代码 按函数/类切分，保留完整代码块 FAQ 每个问答对作为一个 chunk，不要拆开 面试核心点：能说清楚 chunk 大小的权衡（大→信息稀释，小→上下文丢失），以及 overlap 的作用。最好能举出你实际调参的经历，比如&quot;chunk_size 从 1000 降到 500，召回率提升了 15%&quot;。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="rag_interview-q8">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">8. Embedding 模型怎么选？中文场景选什么？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 卡码笔记 · 考察点：8. Embedding 模型怎么选？中文场景选什么？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：面试官会问：&quot;你们用的什么 Embedding 模型</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

面试官会问：&quot;你们用的什么 Embedding 模型？为什么选它？和 OpenAI 的 ada-002 对比过吗？&quot;

 

### 选型维度

 选 Embedding 模型看三个维度：语言支持、向量维度、检索效果（MTEB 排名）。

 

### 中文场景主流模型

 模型 维度 特点 bge-large-zh-v1.5 1024 中文效果最好，开源，本地部署 bge-m3 1024 多语言，支持稠密+稀疏+多向量三种检索 text-embedding-3-large (OpenAI) 3072 效果好，但 API 调用有成本，中文不如 bge text-embedding-3-small (OpenAI) 1536 便宜，效果够用，英文场景首选 

### 维度越高越好吗？

 不是。维度高→表达能力强但存储和检索成本也高。1024 维是当前性价比最好的选择，3072 维的检索效果提升有限但存储翻 3 倍。

 面试答法：&quot;中文场景选 bge-large-zh，因为 MTEB 中文榜单排名靠前，而且开源可以本地部署，不用走 API。如果是英文场景或对延迟不敏感，OpenAI 的 embedding 更方便。&quot;
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="rag_interview-q9">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">9. RAG 的幻觉怎么处理？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, 卡码笔记 · 考察点：9. RAG 的幻觉怎么处理？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：面试官会问：&quot;RAG 检索到了正确信息，LLM 还是编造了不存在的内容，怎么办</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

面试官会问：&quot;RAG 检索到了正确信息，LLM 还是编造了不存在的内容，怎么办？&quot;

 幻觉是 RAG 项目最大的工程挑战，面试官必问（它本质是检索召回和生成忠实度的级联问题，更深一层的拆解见 RAG 落地最难的地方在哪）。

 

### 幻觉的两种类型

 ① 内在幻觉——检索结果里有正确信息，但 LLM 生成的内容和检索结果矛盾。比如检索说&quot;准确率 91%&quot;，LLM 说&quot;准确率 95%&quot;。

 ② 外在幻觉——LLM 生成了检索结果里根本没有的内容。检索只提到了 A，LLM 自己编了 B。

 

### 六种幻觉处理策略

 1、Prompt 约束——在 Prompt 里明确要求&quot;只能基于检索结果回答，检索结果没有的信息不要编造&quot;。

 2、输出自校验——LLM 生成回答后，再用一次 LLM 检查：回答的每一条是否都能在检索结果中找到依据？找不到的标注为&quot;未验证&quot;。

 VERIFICATION_PROMPT = &quot;&quot;&quot;
请检查以下回答是否每一条都能在参考资料中找到依据。
对于每条声明，标注：✅ 有依据 / ❌ 无依据 / ⚠️ 部分依据

回答：{answer}
参考资料：{context}
&quot;&quot;&quot;
 1
2
3
4
5
6
7
3、引用标注——要求 LLM 在回答时标注每条信息的来源 chunk，方便人工核查。

 4、温度调低——temperature 设 0.1-0.3，降低 LLM 的随机性，减少&quot;编造&quot;的倾向。

 5、检索结果和生成结果的对齐——生成回答后，把回答和检索结果做相似度对比，如果回答中有大段内容和所有检索结果都不相关，大概率是幻觉。

 6、兜底回答——当检索结果的相似度都低于阈值时，直接回答&quot;未找到相关信息&quot;，而不是让 LLM 硬编。

 面试核心点：不要只说&quot;用了 Prompt 约束&quot;，要说出你用了几种策略组合，以及效果如何。比如&quot;Prompt 约束 + 输出自校验 + 温度调低，幻觉率从 30% 降到了 12%&quot;。
</div>
</details>

</div>

---

<div class="chapter-nav">

<a class="chapter-nav-link" href="/custom/kama/">📑 总览</a>

<a class="chapter-nav-link" href="/custom/kama/ai-coding">← 💻 AI 编程</a>

<a class="chapter-nav-link chapter-nav-next" href="/custom/kama/finetune">🎯 模型微调 →</a>

</div>
