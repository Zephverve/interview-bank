---
custom: true
pageClass: ai100-doc
partTitle: Agent Interview 100 · RAG
partColor: #6366f1
---

<div class="part-hero custom-hero chapter-hero" style="--part-color: #6366f1">

# 🔍 RAG

<p class="part-desc">Agent Interview 100 · 第 2/11 章 · 9 题</p>
<span class="part-round custom-tag">面试问答</span>

</div>

<div class="chapter-nav">

<a class="chapter-nav-link" href="/custom/ai100/">📑 总览</a>

<a class="chapter-nav-link" href="/custom/ai100/agent-arch">← 🏛️ Agent 架构</a>

<a class="chapter-nav-link chapter-nav-next" href="/custom/ai100/tool-use">🔧 工具使用 →</a>

</div>

<div class="question-card ai100-card interview-card compact-card" id="011-rag-overview-and-pipeline">

<h2 class="question-title"><span class="q-badge ai100-badge">Q11</span><span class="question-text">RAG 概念、Pipeline 与组件总览</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐ · 标签：RAG, AI100 · 考察点：RAG</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：RAG（Retrieval-Augmented Generation，检索增强生成）是一种在 LLM 生成回答之前，先从外部知识库中检索相关文档并注入到 Prompt 中的技术。它主要解决 LLM 的三大核心局限：**知识截止**（训练数据过时）、**幻觉**（编造看似合理的错误信息）、以及**缺乏领域专有知识**。生产级 RAG 系统由三条流水线组成：**Indexing Pipeline**（离线——数据清洗、分块、Embedding、存储到向量数据库）、**Retrieval Pipeline**（在线——查询理解、向量检索、后检索优化如重排序和压缩）、**Generation Pipeline**（在线——上下文组装、Prompt 构建、LLM 生成、输出验证）。RAG 经历了 Naive→Advanced→Modular 三个演进阶段：Naive RAG 是简单的索引-检索-生成链；Advanced RAG 加入预检索（查询改写）与后检索（重排序、压缩）优化；Modular RAG 让每个组件独立可替换、可组合。理解三条流水线的交互方式与 RAG 的演进脉络，是构建高质量 RAG 系统的基础。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误区："RAG 完全解决了幻觉问题" · 误区："RAG 可以替代微调（Fine-tuning）" · 误区："RAG 的重点是 Generation"</div>
</div>

## 详细解析

### LLM 的三大核心局限

#### 1. 知识截止（Knowledge Cutoff）

LLM 的知识在训练完成后就被"冻结"了。当用户询问训练数据截止日期之后的信息时，模型要么承认不知道，要么自信地给出错误答案。LLM 的训练数据往往严重过时，而且当知识出现空白时，它们会进行外推，自信地说出听起来合理但实际错误的陈述。

#### 2. 幻觉（Hallucination）

由于依赖固定参数，LLM 在面对超出训练范围的任务时，经常产生与任务无关的输出或事实不一致的回答。这种现象被称为幻觉（hallucination）或虚构（confabulation），严重损害了 LLM 的可靠性和可信度。

#### 3. 缺乏私有/领域知识

LLM 无法访问企业内部文档、私有数据库或最新的领域知识。即使是最强大的通用模型，也无法回答关于公司内部流程、客户数据或专有技术的问题。

### RAG 如何解决三大局限

| 局限 | RAG 的解决方式 |
|------|--------------|
| 知识截止 | 外部知识库可以随时更新，无需重新训练模型 |
| 幻觉 | 提供"事实锚点"，让 LLM 基于检索到的真实文档生成回答 |
| 缺乏领域知识 | 接入企业私有数据、行业文档、实时数据源 |

额外优势：
- **成本效益**：无需对 LLM 进行昂贵的微调或重新训练
- **来源可溯**：可以在回答中附带引用来源，用户可以验证
- **权限控制**：可以根据用户权限控制可检索的文档范围

### RAG 整体架构

```
离线阶段                          在线阶段
┌──────────────────┐   ┌───────────────────────────────────────┐
│  Indexing        │   │  Retrieval          Generation        │
│  Pipeline        │   │  Pipeline           Pipeline          │
│                  │   │                                       │
│ 数据源 → 清洗    │   │ 用户查询 → 查询理解  → 检索 + 重排序  │
│   → 分块         │   │                        ↓              │
│   → Embedding    │   │               上下文组装 + Prompt 构建 │
│   → 向量数据库   │   │                        ↓              │
│                  │   │                  LLM 生成 → 输出验证   │
└──────────────────┘   └───────────────────────────────────────┘
```

核心流程：
1. **索引（Indexing）**：离线阶段——将文档分块、生成 Embedding、存入向量数据库
2. **检索（Retrieval）**：在线阶段——将用户查询转为向量，从向量库中找到最相关的文档块
3. **生成（Generation）**：将检索到的文档块与原始问题拼接为 Prompt，送入 LLM 生成回答

### 1. Indexing Pipeline（索引流水线）

索引流水线是离线阶段，负责将原始数据转化为可检索的向量索引。

#### 数据摄取与清洗

```python
# 原始数据通常来自多种格式
sources = [
    PDFLoader("report.pdf"),
    WebLoader("https://docs.example.com"),
    DatabaseLoader("postgresql://..."),
    MarkdownLoader("docs/*.md"),
]

# 清洗：去除 HTML 标签、修正编码、标准化格式
for doc in documents:
    doc.content = remove_html_tags(doc.content)
    doc.content = normalize_whitespace(doc.content)
    doc.metadata = extract_metadata(doc)  # 保留元数据（来源、日期、作者）
```

#### 分块（Chunking）

将长文档切分为语义完整的小块，常见策略：
- **固定大小分块**：按 token 数切分，简单但可能破坏语义
- **递归分块**：按段落→句子→词的层次分割，平衡实用性
- **语义分块**：基于 Embedding 相似度在语义断点处分割

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=512,       # 注意：chunk_size 是字符数，不是 token 数
    chunk_overlap=50,     # 相邻块重叠 50 字符，保留上下文连续性
    separators=["\n\n", "\n", "。", " ", ""]
)
chunks = splitter.split_documents(documents)

# 如需按 token 计长，使用 TokenTextSplitter 或 from_tiktoken_encoder：
# from langchain.text_splitter import TokenTextSplitter
# splitter = TokenTextSplitter(chunk_size=512, chunk_overlap=50)
# 或：
# splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
#     chunk_size=512, chunk_overlap=50
# )
```

#### Embedding 与存储

```python
from langchain_openai import OpenAIEmbeddings

embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
vectors = embeddings.embed_documents([chunk.content for chunk in chunks])

# 存入向量数据库（附带元数据，支持后续过滤）
vectorstore.upsert(
    ids=[chunk.id for chunk in chunks],
    embeddings=vectors,
    documents=[chunk.content for chunk in chunks],
    metadatas=[chunk.metadata for chunk in chunks]  # 来源、日期、类别等
)
```

### 2. Retrieval Pipeline（检索流水线）

检索流水线在每次用户查询时实时运行，负责找到最相关的文档块。

#### 预检索优化（Pre-retrieval）

提升检索质量的关键在于优化查询本身：

```python
# 查询改写：让 LLM 重新表述用户问题，提升匹配度
def rewrite_query(original_query: str) -> str:
    return llm.generate(
        f"将以下问题改写为更适合向量检索的形式，"
        f"保持核心语义：\n{original_query}"
    )

# 查询分解：将复杂问题拆分为多个子问题
def decompose_query(query: str) -> list[str]:
    return llm.generate(
        f"将以下复杂问题分解为 2-3 个独立的子问题：\n{query}"
    )

# HyDE：生成假设性回答，用回答而非问题去检索
def hypothetical_document(query: str) -> str:
    return llm.generate(f"为以下问题生成一个假设性回答：\n{query}")
```

#### 向量检索

```python
# 基本语义检索
results = vectorstore.similarity_search(
    query_embedding,
    top_k=20,                              # 先检索较多候选
    filter={"category": "technical_docs"}  # 元数据过滤
)
```

#### 后检索优化（Post-retrieval）

```python
# 重排序：用 Cross-Encoder 对候选结果精排
from sentence_transformers import CrossEncoder

reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
reranked = reranker.rank(query, [r.content for r in results])
top_results = reranked[:5]  # 取 Top 5

# 上下文压缩：去除检索块中不相关的部分
compressed = llm.generate(
    f"从以下文档中提取与问题 '{query}' 直接相关的信息：\n{chunk}"
)
```

### 3. Generation Pipeline（生成流水线）

将检索结果与用户查询组合，送入 LLM 生成最终回答。

#### 上下文组装与 Prompt 构建

```python
def build_rag_prompt(query: str, contexts: list[str]) -> str:
    context_text = "\n\n---\n\n".join(contexts)
    return f"""基于以下参考文档回答用户问题。
如果文档中没有足够信息，请明确说明。
请在回答中引用相关来源。

参考文档：
{context_text}

用户问题：{query}

回答："""
```

#### 上下文窗口管理

当检索到的文档超出 LLM 的上下文窗口时，需要智能截断：
- 按重排序得分排列，优先保留高分文档
- 对低优先级文档进行摘要压缩
- 确保关键信息出现在上下文的开头和结尾（避免 "Lost in the Middle" 问题）

### 三条流水线的优化关系

| 阶段 | 优化方向 | 关键指标 |
|------|---------|---------|
| Indexing | 分块策略、Embedding 质量、元数据丰富度 | 索引覆盖率 |
| Retrieval | 查询改写、混合检索、重排序 | Recall@k, Precision@k |
| Generation | Prompt 工程、上下文窗口管理、输出验证 | 答案正确率、幻觉率 |

### RAG 的三个演进阶段

| 阶段 | 特点 | 局限 |
|------|------|------|
| **Naive RAG** | 简单的"索引-检索-生成"链 | 检索精度低、上下文不足 |
| **Advanced RAG** | 加入预检索优化（查询改写）和后检索优化（重排序、压缩） | 仍是单次检索 |
| **Modular RAG** | 每个组件独立可替换、可组合 | 系统复杂度高 |

### RAG 的局限性

RAG 并非万能。它自身也存在问题：

1. **不能完全消除幻觉**："RAG 不是直接的解决方案，因为 LLM 仍然可能围绕源材料进行幻觉。" LLM 可能从检索到的文档中断章取义，得出错误结论。

2. **检索质量瓶颈**：
   - 低精确率（Precision）：检索到的文档块与问题不匹配
   - 低召回率（Recall）：未能检索到所有相关文档块
   - 过时信息：知识库本身可能包含过时数据

3. **依赖知识库质量**：知识库中的偏见或错误会直接传导到 LLM 的回答中

## 常见误区 / 面试追问

1. **误区："RAG 完全解决了幻觉问题"** — RAG 降低了幻觉概率，但 LLM 仍可能围绕检索内容进行幻觉，或忽略检索结果而使用自身知识。需要配合 Guardrails 和输出验证。

2. **误区："RAG 可以替代微调（Fine-tuning）"** — RAG 和微调解决不同问题。RAG 解决知识问题（"知道什么"），微调解决能力问题（"怎么做"）。如果需要改变模型的行为风格或推理模式，应该用微调。

3. **误区："RAG 的重点是 Generation"** — 实际上 Retrieval 的质量才是 RAG 效果的决定性因素。检索到的文档不相关，再强的 LLM 也救不回来。优化顺序应该是：Retrieval > Indexing > Generation。

4. **误区："原型能用 = 生产能用"** — 原型和生产系统的差异在于评估和监控能力。生产 RAG 需要 (1) 检索质量监控；(2) 生成质量评估；(3) 成本和延迟追踪。

5. **追问："RAG vs 长上下文窗口——如果模型能处理 100 万 token，还需要 RAG 吗？"** — 需要。(1) 长上下文的"大海捞针"问题——中间的信息容易被忽略；(2) 成本——100 万 token 的推理费用远高于 RAG 检索；(3) 延迟——长上下文增加推理时间。

6. **追问："RAG 的检索精度和 LLM 生成质量哪个更重要？"** — 检索精度。如果检索到的文档不相关，再强的 LLM 也无法生成正确答案。"Garbage in, garbage out" 在 RAG 中尤为适用。

7. **追问："如何评估 RAG Pipeline 的各个环节？"** — Indexing：覆盖率测试（是否所有关键信息都被索引）；Retrieval：Recall@k、MRR、NDCG；Generation：Faithfulness（忠实度）、Relevance（相关性）、Answer Correctness。

8. **追问："向量检索一定比关键词检索好吗？"** — 不一定。精确术语匹配（如产品型号、法律条款编号）时，BM25 等关键词检索可能更好。最佳实践是混合检索（Hybrid Search）。

## 参考资料

- [Retrieval-Augmented Generation (RAG) (Pinecone)](https://www.pinecone.io/learn/retrieval-augmented-generation/)
- [RAG for LLMs (Prompt Engineering Guide)](https://www.promptingguide.ai/research/rag)
- [Retrieval-Augmented Generation for Large Language Models: A Survey (arXiv:2312.10997)](https://arxiv.org/abs/2312.10997)
- [Retrieval Augmented Generation: Keeping LLMs Relevant and Current (Stack Overflow)](https://stackoverflow.blog/2023/10/18/retrieval-augmented-generation-keeping-llms-relevant-and-current/)
- [RAG Hallucination: What Is It and How to Avoid It (K2View)](https://www.k2view.com/blog/rag-hallucination/)
- [RAG 101: Demystifying Retrieval-Augmented Generation Pipelines (NVIDIA)](https://developer.nvidia.com/blog/rag-101-demystifying-retrieval-augmented-generation-pipelines/)
- [Introduction to LLM RAG (Weaviate)](https://weaviate.io/blog/introduction-to-rag)
- [RAG Pipelines Explained (Orq.ai)](https://orq.ai/blog/rag-pipelines)
- [RAG Pipelines in Production (Machine Learning Mastery)](https://machinelearningmastery.com/understanding-rag-part-x-rag-pipelines-in-production/)


> 📎 本题由原 #011（什么是 RAG）与 #012（RAG Pipeline 组件）合并而来（2026-05-23 重构）
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="013-chunking-strategies">

<h2 class="question-title"><span class="q-badge ai100-badge">Q12</span><span class="question-text">文档分块（Chunking）策略有哪些？各有什么优缺点？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐ · 标签：RAG, AI100 · 考察点：RAG</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：主要有三种分块策略：**固定大小分块**（按字符/token 数切分，简单高效但破坏语义）、**递归分块**（按段落→句子→词层次切分，是最推荐的通用默认方案，Recall 85-90%）、**语义分块**（基于 Embedding 相似度在语义断点处切分，Recall 91-92% 但需要额外 Embedding 开销）。核心权衡是：**上下文保留 vs 检索精度**——块越大保留越多上下文但稀释相关性，块越小匹配越精确但丢失上下文。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误区："语义分块一定最好" · 误区："块越小越好" · 追问："overlap 有什么用？设多少合适？"</div>
</div>

## 详细解析

### 为什么分块很重要？

分块不是简单的预处理步骤，它是一个影响整个 RAG 系统性能的**设计决策**。分块策略决定了：
- Embedding 的语义质量（块是否表达完整的概念）
- 检索的精度和召回率（能否找到正确的信息）
- 生成的上下文充分性（LLM 是否有足够信息回答问题）
- Token 使用效率和成本

### 1. 固定大小分块（Fixed-Size Chunking）

**原理：** 按预定的字符数或 token 数均匀切分文本，通常带有重叠（overlap）。

```python
from langchain.text_splitter import CharacterTextSplitter

splitter = CharacterTextSplitter(
    chunk_size=500,      # 每块 500 字符
    chunk_overlap=50,    # 相邻块重叠 50 字符
    separator=""         # 按字符切
)
chunks = splitter.split_text(document)
```

| 优点 | 缺点 |
|------|------|
| 实现最简单，无需 NLP 库 | 完全忽略语义结构 |
| 计算成本最低 | 可能在句子甚至单词中间切断 |
| 块大小均匀，便于索引优化 | 可能混合不相关的主题 |
| 适合快速原型 | 即使有 overlap 也不能保证语义完整 |

**最佳场景：** 同质化数据集（新闻文章、博客等格式统一的内容）、快速原型验证。

### 2. 递归分块（Recursive Chunking）

**原理：** 按层次化分隔符递归切分——先尝试按段落（`\n\n`），如果段落仍然太大就按句子（`\n`），再不行按空格，最后按字符。确保尽可能保持段落和句子的完整性。

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

# 注意：默认 chunk_size 单位是「字符」，不是 token。若需按 token 切，
# 用 RecursiveCharacterTextSplitter.from_tiktoken_encoder(...) 或显式传 length_function。
splitter = RecursiveCharacterTextSplitter(
    chunk_size=512,        # 字符数，中文常按 1.5-2 字符/token 估算
    chunk_overlap=50,
    separators=["\n\n", "\n", "。", "，", " ", ""]
    # 优先级：段落 > 换行 > 句号 > 逗号 > 空格 > 字符
)
chunks = splitter.split_text(document)

# 若需严格按 token：
# splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
#     chunk_size=512, chunk_overlap=50,
# )
```

| 优点 | 缺点 |
|------|------|
| 实用的默认方案 | 仍可能在某些复杂结构处切断 |
| 显著减少句子被截断的概率 | 不处理表格、列表等特殊元素 |
| Chroma 测试：400-512 tokens 时 Recall 85-90% | 不同文档格式需要不同的分隔符集 |
| 计算成本仍然很低 | 不考虑语义相似度 |

**最佳场景：** 通用默认方案。结构化文本（技术文档、报告）、代码文件（配合语言特定分隔符）。

**推荐参数：** 400-512 tokens，10-20% overlap。

### 3. 语义分块（Semantic Chunking）

**原理：** 先对每个句子生成 Embedding，计算相邻句子的余弦相似度，在相似度急剧下降的地方切分——即在"主题转换点"分块。

```python
from langchain_experimental.text_splitter import SemanticChunker
from langchain_openai import OpenAIEmbeddings

splitter = SemanticChunker(
    embeddings=OpenAIEmbeddings(),
    breakpoint_threshold_type="percentile",
    breakpoint_threshold_amount=95  # 相似度低于 95 分位数时切分
)
chunks = splitter.split_text(document)
```

| 优点 | 缺点 |
|------|------|
| 最高的检索召回率（91-92%） | 需要对每个句子生成 Embedding |
| 保持主题连续性和语义完整性 | 计算成本高（API 调用或本地推理） |
| 块大小自适应内容 | 处理速度比固定/递归慢 |
| 适合叙述性文档 | 块大小不均匀，可能影响索引优化 |

**最佳场景：** 准确率优先的场景、叙述性/研究性文档、预算允许额外计算开销时。

### 其他分块策略

#### 4. 文档结构分块（Structure-Aware）

利用文档自身的结构（标题、章节、HTML 标签）作为分块边界：

```python
# Markdown 文档按标题分块
from langchain.text_splitter import MarkdownHeaderTextSplitter

splitter = MarkdownHeaderTextSplitter(
    headers_to_split_on=[
        ("#", "h1"), ("##", "h2"), ("###", "h3")
    ]
)
```

#### 5. 小块检索 + 大块上下文（Parent-Child / Small-to-Big）

用小块做精确检索，返回时提供包含小块的大块作为上下文：

```python
# 检索时用小块（200 tokens）匹配精确
# 返回时给 LLM 提供大块（2000 tokens）保留上下文
small_chunks = split(doc, chunk_size=200)
large_chunks = split(doc, chunk_size=2000)
# 建立 small → large 的映射关系
```

### 核心权衡

```
小块（100-200 tokens）              大块（1000-2000 tokens）
├── 检索精度高                      ├── 上下文信息丰富
├── Embedding 语义集中              ├── 保持段落完整性
├── 但可能丢失上下文                ├── 但稀释 Embedding 相关性
└── 需要更多块 → 更多存储           └── 可能包含无关信息
```

**经验法则：** 400-512 tokens 是大多数场景的最佳起点。

### 关键问题："是否需要分块？"

一个常被忽略的问题：当文档本身就很小、聚焦、且直接匹配用户问题时，分块反而可能损害检索精度。评估是否需要分块，而不是默认总要分块。

## 常见误区 / 面试追问

1. **误区："语义分块一定最好"** — Chroma 的测试数据显示，递归分块（85-90% Recall）和语义分块（91-92% Recall）仅差 2-3%，但语义分块的计算成本显著更高。大多数场景递归分块就够了。

2. **误区："块越小越好"** — 太小的块会丢失上下文，导致 LLM 无法理解信息的含义。需要在精度和上下文之间找平衡。

3. **追问："overlap 有什么用？设多少合适？"** — Overlap 确保分块边界处的信息不会丢失。通常设置为 chunk_size 的 10-20%（如 512 tokens 的块用 50-100 tokens overlap）。

4. **追问："如何选择最佳的 chunk_size？"** — 没有通用最优值。应该在你的数据集上实验——用检索评估指标（Recall@k、MRR）比较不同 chunk_size 的效果。通常从 512 tokens 开始调。

## 参考资料

- [Best Chunking Strategies for RAG in 2026 (Firecrawl)](https://www.firecrawl.dev/blog/best-chunking-strategies-rag)
- [Chunking Strategies for RAG (Weaviate)](https://weaviate.io/blog/chunking-strategies-for-rag)
- [Breaking Up Is Hard to Do: Chunking in RAG Applications (Stack Overflow)](https://stackoverflow.blog/2024/12/27/breaking-up-is-hard-to-do-chunking-in-rag-applications/)
- [Chunking Strategies for RAG: Best Practices (Unstructured)](https://unstructured.io/blog/chunking-for-rag-best-practices)
- [The Ultimate Guide to Chunking Strategies (Databricks)](https://community.databricks.com/t5/technical-blog/the-ultimate-guide-to-chunking-strategies-for-rag-applications/ba-p/113089)
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="014-vector-database-comparison">

<h2 class="question-title"><span class="q-badge ai100-badge">Q13</span><span class="question-text">向量数据库选型：Pinecone vs Weaviate vs Chroma vs Milvus</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, AI100 · 考察点：RAG</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：**Pinecone** 是全托管方案，适合无运维团队的企业；**Weaviate** 提供混合检索和模块化设计，开源灵活；**Milvus** 专为十亿级向量规模设计，需要数据工程能力；**Chroma** 轻量级开发者友好，适合原型和中小型应用；**Qdrant**（额外推荐）用 Rust 编写，性价比最高。选择的核心不在于原始 Benchmark，而在于 Recall@k、尾延迟、元数据过滤能力和运维成本。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误区："选 Benchmark 最快的就对了" · 误区："一定需要专用向量数据库" · 追问："如何做向量数据库迁移？"</div>
</div>

## 详细解析

### 选型对比矩阵

| 维度 | Pinecone | Weaviate | Milvus | Chroma | Qdrant |
|------|----------|----------|--------|--------|--------|
| **类型** | 全托管 SaaS | 开源 + 云 | 开源 + 云(Zilliz) | 开源 | 开源 + 云 |
| **语言** | - (API only) | Go | Go/C++ | Python | Rust |
| **最大规模** | 数十亿 | 数千万 | 数十亿 | 数百万 | 数亿 |
| **查询延迟** | <50ms | ~100ms | 低延迟领先 | ~20ms(100K) | ~50ms |
| **混合检索** | 支持 | 原生支持 | 支持 | 基础 | 支持 |
| **免费层** | 有限 | 14天试用 | 社区版免费 | 完全免费 | 1GB 永久免费 |
| **起步价** | Serverless 按用量计费（Free tier 起，Standard ~$50/月起） | $25/月 | 自托管免费 | 免费 | $25/月 |
| **适合团队** | 无 Ops 团队 | 中型团队 | 大型工程团队 | 个人/小团队 | 预算敏感团队 |

### Pinecone — 全托管，企业级

**核心优势：**
- 零运维：自动扩缩容、自动更新、自动备份
- 查询延迟业界领先（<50ms）
- 企业级安全和合规（SOC 2、GDPR）

**核心劣势：**
- 专有平台，存在供应商锁定风险
- 成本随规模增长较快（规模化后可能超过 $500/月）
- 无法自托管，数据必须上传到 Pinecone 云

**适用场景：** 商业 AI SaaS 产品、无基础设施团队的企业、需要快速上线且预算充足的项目。

### Weaviate — 混合检索 + 模块化

**核心优势：**
- 原生混合检索（向量检索 + BM25 关键词检索）
- 模块化架构：可插拔预训练模型和自定义模块
- 内置向量化模块，可直接传入原始文本
- 丰富的过滤和聚合能力

**核心劣势：**
- 超过 5000 万向量后需要仔细规划容量
- 免费试用仅 14 天
- 内存消耗相对较高

**适用场景：** 需要混合检索的项目（如电商搜索）、多模态数据（文本+图像）、中型企业。

### Milvus — 十亿级规模

**核心优势：**
- 专为海量数据设计（支持十亿级向量）
- GPU 加速、分布式查询、高效索引
- 支持多种索引方式（IVF、HNSW、PQ 等）
- 云托管版（Zilliz Cloud）在低延迟 Benchmark 中领先

**核心劣势：**
- 运维复杂度高，需要数据工程团队
- 学习曲线陡峭
- 小规模使用有过度设计之嫌

**适用场景：** 数据量极大（亿级向量）、有专业数据工程团队、需要 GPU 加速的场景。

### Chroma — 轻量级原型利器

**核心优势：**
- 完全开源免费
- 安装简单（`pip install chromadb`），几行代码即可使用
- 适合快速原型和中小型应用
- Python 原生，与 LangChain/LlamaIndex 深度集成

**核心劣势：**
- 不适合十亿级向量或企业多租户场景
- 生产部署需要额外基础设施
- 功能相对基础，高级过滤能力有限

**适用场景：** 原型验证、个人项目、小型内部工具、学习和实验。

### Qdrant — 性价比之王

**核心优势：**
- Rust 编写，性能优异且内存效率高
- 最好的免费层：1GB 向量存储永久免费
- 强大的元数据过滤能力
- ACID 事务支持

**核心劣势：**
- 社区规模相对较小
- 企业级功能仍在发展中

**适用场景：** 预算敏感的初创公司、需要高性能且不想支付高额费用的团队。

### 决策框架

```python
def choose_vector_db(requirements: dict) -> str:
    if requirements["no_ops_team"] and requirements["budget"] == "flexible":
        return "Pinecone"  # 全托管，无运维负担

    if requirements["scale"] > 1_000_000_000:  # 十亿级
        return "Milvus"    # 唯一真正的十亿级选手

    if requirements["hybrid_search"] and requirements["multimodal"]:
        return "Weaviate"  # 混合检索 + 多模态

    if requirements["stage"] == "prototype":
        return "Chroma"    # 最快的入门方式

    if requirements["budget"] == "tight":
        return "Qdrant"    # 性价比最高

    return "Qdrant"        # 综合默认推荐
```

### 重要洞察

> "大多数 RAG 失败是自己造成的，不是数据库造成的。"

向量数据库的选择很重要，但它通常不是 RAG 系统的瓶颈。更常见的问题是：分块策略不当、Embedding 模型质量差、缺乏重排序、Prompt 设计不佳。在优化数据库之前，先确保这些环节没有问题。

评估数据库时关注：
1. **Recall@k**：检索到的 Top-K 中有多少是真正相关的
2. **尾延迟（P99）**：最坏情况下的查询时间
3. **元数据过滤能力**：能否高效地按属性过滤
4. **运维成本**：包括人力成本和基础设施成本

## 常见误区 / 面试追问

1. **误区："选 Benchmark 最快的就对了"** — Benchmark 通常在理想条件下测试。实际生产中，元数据过滤、并发查询、数据更新频率等因素更重要。应该用自己的数据和查询模式做测试。

2. **误区："一定需要专用向量数据库"** — 对于小规模应用（<10 万向量），pgvector（PostgreSQL 扩展）可能就够了，不需要引入额外的基础设施。

3. **追问："如何做向量数据库迁移？"** — 关键是 Embedding 模型保持一致。只要用同一个 Embedding 模型重新生成向量，就可以在不同数据库间迁移。但如果换了 Embedding 模型，所有向量必须重新生成。

4. **追问："FAISS 算向量数据库吗？"** — FAISS 是向量检索库，不是数据库。它不提供持久化存储、CRUD 操作、分布式部署等数据库功能。适合嵌入到应用中做内存中检索。

## 参考资料

- [Vector Database Comparison 2025 (LiquidMetal AI)](https://liquidmetal.ai/casesAndBlogs/vector-comparison/)
- [Best Vector Databases in 2026 (Firecrawl)](https://www.firecrawl.dev/blog/best-vector-databases)
- [Top 9 Vector Databases as of March 2026 (Shakudo)](https://www.shakudo.io/blog/top-9-vector-databases)
- [How Do I Choose Between Pinecone, Weaviate, Milvus? (Milvus)](https://milvus.io/ai-quick-reference/how-do-i-choose-between-pinecone-weaviate-milvus-and-other-vector-databases)
- [Best Vector Databases for RAG 2025 (Latenode)](https://latenode.com/blog/ai-frameworks-technical-infrastructure/vector-databases-embeddings/best-vector-databases-for-rag-complete-2025-comparison-guide)
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="015-embedding-model-selection">

<h2 class="question-title"><span class="q-badge ai100-badge">Q14</span><span class="question-text">Embedding 模型选择与微调策略</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, AI100 · 考察点：RAG</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Embedding 模型的选择直接决定 RAG 检索质量。2025-2026 年的格局：**Voyage AI voyage-3-large** 与 **Cohere embed-v4** 在 MTEB Benchmark 上排名相近，分别在性价比与多语言/多模态场景占优（具体名次取决于子任务）；**OpenAI text-embedding-3-large** 是最均衡的生产默认选择。开源方面 **BGE-M3** 和 **Qwen3 Embedding** 表现出色。微调可带来 10-30% 的领域特定提升，但需要注意重新索引的成本。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误区："选 MTEB 排名第一的就对了" · 误区："维度越高越好" · 追问："如果换了 Embedding 模型怎么办？"</div>
</div>

## 详细解析

### Embedding 模型的作用

Embedding 模型将文本转化为高维向量，使得语义相似的文本在向量空间中距离更近。在 RAG 中，它用于两个环节：
1. **索引时**：将文档块转为向量存入向量数据库
2. **查询时**：将用户问题转为向量，与文档向量做相似度匹配

**关键约束：** 索引和查询必须使用**同一个** Embedding 模型，否则向量空间不一致，检索完全失效。

### 主流商业模型对比

| 模型 | 维度 | MTEB 表现 | 价格($/M tokens) | 特色 |
|------|------|-----------|-------------------|------|
| **Voyage AI voyage-3-large** | 1024 | 综合前列 | $0.06 | 性价比最高，多领域领先 |
| **OpenAI text-embedding-3-large** | 3072(可缩) | 前列 | $0.13 | 最均衡，支持维度缩减 |
| **Cohere embed-v4** | 1536 | 多语言/多模态前列 | ~$0.10 | 100+ 语言，多模态 |
| **OpenAI text-embedding-3-small** | 1536 | 中上 | $0.02 | 最便宜，适合成本敏感场景 |

#### Voyage AI — 性价比之王

Voyage AI 的 voyage-3-large 在多项 MTEB 子任务上超越 OpenAI text-embedding-3-large 与 Cohere embed-v3（具体提升幅度因数据集而异）。1024 维 Embedding 比 OpenAI 的 3072 维节省约 3 倍存储空间，价格仅为 OpenAI 的一半。

特别值得注意：Voyage 提供领域特化模型（截至 2026-05 的最新版）：
- `voyage-law-3`：法律领域（案例检索精度大幅领先通用模型）
- `voyage-code-3`：代码搜索
- `voyage-finance-2`：金融领域（v3 尚未发布）

#### OpenAI text-embedding-3-large — 最均衡的默认选择

Agentset 的评测显示它在更多的直接对比中胜出，是最稳定的生产选择。独特优势：支持通过 `dimensions` 参数缩减维度（3072→1536→256），在精度和存储间灵活权衡。

```python
from openai import OpenAI
client = OpenAI()

# 全维度：最高精度
full = client.embeddings.create(
    model="text-embedding-3-large",
    input="查询文本"
)  # 3072 维

# 缩减维度：节省存储，轻微精度损失
compact = client.embeddings.create(
    model="text-embedding-3-large",
    input="查询文本",
    dimensions=1024  # 从 3072 缩减到 1024
)
```

#### Cohere embed-v4 — 多语言多模态之王

在 MTEB 多语言子任务上排名前列，支持 100+ 语言的跨语言检索，能在同一语义空间中嵌入文本和图像。支持 128K token 的超长输入。

### 主流开源模型

| 模型 | 维度 | 许可证 | 特色 |
|------|------|--------|------|
| **BAAI/bge-m3** | 1024 | MIT | 多语言，自托管首选 |
| **Qwen3 Embedding (4B/8B)** | 可变 | Apache 2.0 | 最新 SOTA，32K 上下文 |
| **Jina Embeddings v3** | 1024 | Apache 2.0 | 多语言，任务特定适配 |
| **all-MiniLM-L6-v2** | 384 | Apache 2.0 | 极轻量，MVP 首选 |

**选择开源模型的理由：**
- 数据隐私：不需要将文档发送到第三方 API
- 成本控制：大量数据时自托管更经济
- 离线部署：无网络环境
- 完全可控：可以微调和定制

### 微调策略

领域特定微调可带来 **10-30%** 的检索质量提升。

#### 何时需要微调？

```
通用 Embedding 在你的数据上效果如何？
├── 满意 → 不需要微调
└── 不满意 → 分析原因
    ├── 数据质量问题 → 先优化数据，不是模型
    ├── 领域术语不理解 → 微调
    └── 检索逻辑需要定制 → 微调
```

#### 微调方法

```python
# 1. 准备训练数据：(query, positive_doc, negative_doc) 三元组
training_data = [
    {
        "query": "RLHF 的奖励模型如何训练？",
        "positive": "奖励模型通过人类偏好标注数据训练...",
        "negative": "强化学习是一种机器学习方法..."
    },
    # ... 至少 1000 个样本
]

# 2. 使用对比学习进行微调
from sentence_transformers import SentenceTransformer, losses

model = SentenceTransformer("BAAI/bge-base-en-v1.5")
train_loss = losses.TripletLoss(model)
model.fit(
    train_objectives=[(train_dataloader, train_loss)],
    epochs=3
)
```

#### 微调的关键注意事项

1. **必须重新索引**：微调改变了 Embedding 空间，所有已索引的向量都需要重新生成。这是不可忽略的成本。
2. **数据量要求**：至少 1000 个标注样本，理想情况 5000-10000 个
3. **评估闭环**：用 Recall@k、MRR 等指标对比微调前后的效果
4. **基础模型选择**：选与你的领域最接近的基础模型微调，效果更好

### 选型决策框架

```python
def choose_embedding_model(requirements: dict) -> str:
    if requirements["stage"] == "mvp":
        return "all-MiniLM-L6-v2"        # 免费、快、够用

    if requirements["multilingual"]:
        return "cohere-embed-v4"          # 100+ 语言

    if requirements["privacy_critical"]:
        return "bge-m3 (self-hosted)"     # MIT 许可，完全可控

    if requirements["budget"] == "tight":
        return "voyage-3-large"           # 最高性价比

    if requirements["domain_specific"]:
        if requirements["domain"] in ["legal", "code", "finance"]:
            return f"voyage-{domain}-2"   # 领域特化模型
        else:
            return "fine-tune bge-m3"     # 自定义微调

    return "openai-text-embedding-3-large"  # 最均衡的默认选择
```

### 关键原则

> "在你的数据上做 Benchmark——通用分数不一定适用于你的领域。"

> "价格更高的模型不一定准确率更高。最佳模型是在准确率和成本之间取得最好平衡的模型。"

## 常见误区 / 面试追问

1. **误区："选 MTEB 排名第一的就对了"** — MTEB 是通用基准，你的领域数据分布可能完全不同。必须在自己的数据集上评估。

2. **误区："维度越高越好"** — 3072 维比 1024 维精度更高，但存储 3 倍、检索更慢。很多场景下 1024 维甚至 768 维就足够了。OpenAI 的维度缩减功能正是为此设计。

3. **追问："如果换了 Embedding 模型怎么办？"** — 必须重新索引所有文档。索引和查询必须使用完全相同的模型。这是换模型的最大成本。

4. **追问："Embedding 和 LLM 需要来自同一家吗？"** — 不需要。Embedding 模型和 LLM 是独立组件。可以用 Voyage 的 Embedding + Anthropic 的 Claude 生成，完全没问题。

## 参考资料

- [Best Embedding Models 2025: MTEB Scores & Leaderboard (Ailog)](https://app.ailog.fr/en/blog/guides/choosing-embedding-models)
- [Top Embedding Models 2026: Complete Guide (ArtSmart)](https://artsmart.ai/blog/top-embedding-models-in-2025/)
- [Embedding Models Comparison 2026: OpenAI vs Cohere vs Voyage vs BGE (Reintech)](https://reintech.io/blog/embedding-models-comparison-2026-openai-cohere-voyage-bge)
- [9 Best Embedding Models for RAG (ZenML)](https://www.zenml.io/blog/best-embedding-models-for-rag)
- [Embedding Model Leaderboard (Agentset)](https://agentset.ai/embeddings)
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="016-hybrid-retrieval">

<h2 class="question-title"><span class="q-badge ai100-badge">Q15</span><span class="question-text">混合检索：如何结合语义检索和关键词检索？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, AI100 · 考察点：RAG</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：混合检索（Hybrid Search）并行运行向量语义检索和 BM25 关键词检索，然后通过融合算法（如 Reciprocal Rank Fusion, RRF）将两组结果合并为统一排序列表。语义检索擅长理解意图和同义词匹配，关键词检索擅长精确术语匹配（产品编号、专有名词）。两者互补，实际生产中通常再加一层 Cross-Encoder 重排序形成"两阶段检索"架构。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误区："语义检索总是比关键词检索好" · 误区："RRF 的 k=60 需要调参" · 追问："如何设置 BM25 和向量检索的权重比？"</div>
</div>

## 详细解析

### 为什么需要混合检索？

纯语义检索的致命弱点：Embedding 模型只能理解其训练数据覆盖的语义。对于以下场景，语义检索可能完全失效：

- **产品编号/SKU**：如 "TS-01"、"iPhone 16 Pro Max"
- **专有术语**：新产品名、公司内部代号
- **精确匹配**：法律条款编号、API 端点路径
- **Out-of-domain 数据**：Embedding 模型训练集未覆盖的领域

这些场景下关键词检索（BM25）更可靠，因为它做的是精确的词汇匹配。

反过来，纯关键词检索无法理解语义相似性（如"汽车"和"轿车"、"bug"和"defect"），这正是语义检索的强项。

### 混合检索的工作流程

```
用户查询
    ├──→ [BM25 关键词检索] → 排序列表 A（按 BM25 分数排序）
    │
    └──→ [向量语义检索]   → 排序列表 B（按余弦相似度排序）
                                    │
                           [融合算法 (RRF)]
                                    │
                              统一排序列表
                                    │
                           [Cross-Encoder 重排序]（可选）
                                    │
                              最终 Top-K 结果
```

### 分数不可比问题

直接合并两组结果的核心挑战：**分数尺度完全不同**。

- BM25 分数：可能是 12.4（无上界，受词频和文档分布影响）
- 余弦相似度：0.85（范围 0-1）

这两个数值无法直接比较！解决方案有两种。

### 融合方法 1：Reciprocal Rank Fusion (RRF)

RRF 是最广泛使用的融合方法，核心思想是**只看排名，不看分数**：

```python
def reciprocal_rank_fusion(ranked_lists: list[list], k: int = 60) -> list:
    """
    RRF 公式（Cormack et al. 2009）：score(d) = sum(1 / (rank_i + k)) for each list i
    论文原始公式 rank 从 1 开始；下面代码用 enumerate 起始为 1 与论文对齐。
    k=60 是论文推荐的常数，用于平滑排名差异。
    """
    scores = {}
    for ranked_list in ranked_lists:
        for rank, doc_id in enumerate(ranked_list, start=1):
            if doc_id not in scores:
                scores[doc_id] = 0
            scores[doc_id] += 1 / (rank + k)

    # 按融合分数降序排列
    return sorted(scores.items(), key=lambda x: x[1], reverse=True)

# 示例
bm25_results = ["doc_A", "doc_C", "doc_B", "doc_D"]  # BM25 排序
vector_results = ["doc_B", "doc_A", "doc_D", "doc_E"]  # 向量排序

# doc_A: 1/(1+60) + 1/(2+60) = 0.0164 + 0.0161 = 0.0325 (两个列表都排前列)
# doc_B: 1/(3+60) + 1/(1+60) = 0.0159 + 0.0164 = 0.0323
# 同时出现在两个列表中的文档自然排名靠前
```

**RRF 优势：**
- 无需归一化：纯基于排名位置，不关心原始分数
- 无需调参：k=60 开箱即用
- 高效可扩展：适合大规模分片索引

### 融合方法 2：线性组合（Weighted Scoring）

```python
def weighted_fusion(bm25_scores, vector_scores, alpha=0.5):
    """
    先归一化两组分数到 [0,1]，再加权求和
    alpha: 向量检索的权重（1-alpha: BM25 的权重）
    """
    norm_bm25 = min_max_normalize(bm25_scores)
    norm_vector = min_max_normalize(vector_scores)

    combined = {}
    for doc_id in set(norm_bm25) | set(norm_vector):
        combined[doc_id] = (
            alpha * norm_vector.get(doc_id, 0) +
            (1 - alpha) * norm_bm25.get(doc_id, 0)
        )
    return sorted(combined.items(), key=lambda x: x[1], reverse=True)
```

线性组合经过仔细调参后可能优于 RRF，但对数据集敏感，需要实验。

### 两阶段架构（生产最佳实践）

```python
# 第 1 阶段：混合检索（RRF 融合，取 Top 100）
bm25_results = bm25_retriever.search(query, top_k=100)
vector_results = vector_retriever.search(query, top_k=100)
candidates = reciprocal_rank_fusion([bm25_results, vector_results])[:100]

# 第 2 阶段：Cross-Encoder 精排（取 Top 5 送入 LLM）
reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
reranked = reranker.rank(query, [doc.content for doc in candidates])
final_context = reranked[:5]
```

RRF 擅长合并列表但缺乏深层语义理解；Cross-Encoder 擅长精确的 query-document 关系评估但计算昂贵。两阶段结合取长补短。

### 主流平台支持

| 平台 | 混合检索支持 |
|------|------------|
| **Weaviate** | 原生支持，并行执行向量+BM25，内置 RRF |
| **Elasticsearch** | 内置 RRF 和线性组合两种融合方法 |
| **Redis** | Query Engine 在单次查询中组合向量和全文检索 |
| **Google Vertex AI** | 通过 RRF 合并 token 检索和语义检索 |
| **Pinecone** | 支持稀疏+稠密混合检索 |

## 常见误区 / 面试追问

1. **误区："语义检索总是比关键词检索好"** — 对精确术语（编号、代码、专有名词），BM25 通常更准确。混合检索的价值正在于让两者互补。

2. **误区："RRF 的 k=60 需要调参"** — k=60 是论文验证过的鲁棒默认值，大多数场景下无需调整。除非有极端需求，否则保持默认即可。

3. **追问："如何设置 BM25 和向量检索的权重比？"** — 如果用 RRF 则不需要设权重。如果用线性组合，默认 50/50 开始，然后根据评估指标（Recall@k）在你的数据集上调优。术语密集的领域（法律、医学）可能偏向 BM25。

4. **追问："稀疏向量（Sparse Embedding）和 BM25 有什么区别？"** — 传统 BM25 基于词频统计。稀疏向量（如 SPLADE）用学习到的稀疏表示，保留了关键词匹配的精确性同时具有一定的语义理解能力，是 BM25 的升级版。

## 参考资料

- [Hybrid Search Explained (Weaviate)](https://weaviate.io/blog/hybrid-search-explained)
- [A Comprehensive Hybrid Search Guide (Elastic)](https://www.elastic.co/what-is/hybrid-search)
- [Optimizing RAG with Hybrid Search & Reranking (Superlinked)](https://superlinked.com/vectorhub/articles/optimizing-rag-with-hybrid-search-reranking)
- [Advanced RAG: Understanding Reciprocal Rank Fusion (Guillaume Laforge)](https://glaforge.dev/posts/2026/02/10/advanced-rag-understanding-reciprocal-rank-fusion-in-hybrid-search/)
- [Hybrid Search Explained (Redis)](https://redis.io/blog/hybrid-search-explained/)
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="017-reranking-strategies">

<h2 class="question-title"><span class="q-badge ai100-badge">Q16</span><span class="question-text">Re-ranking 的原理与实现：Cross-Encoder vs Bi-Encoder</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, AI100 · 考察点：RAG</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Bi-Encoder 将查询和文档独立编码为向量，速度快但精度有限，用于第一阶段的大规模检索（Retrieval）。Cross-Encoder 将查询和文档拼接后联合编码，精度高但速度慢，用于第二阶段的精排（Reranking）。生产 RAG 系统的标准架构是"Bi-Encoder 检索 Top-100 → Cross-Encoder 重排 Top-5"，这种两阶段流水线在效率和精度间取得最佳平衡。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误区："Bi-Encoder 精度低是因为模型小" · 误区："直接用 Cross-Encoder 做全量检索更好" · 追问："Top-K 的 K 设多少？"</div>
</div>

## 详细解析

### 为什么需要重排序？

第一阶段检索（Bi-Encoder）从百万级文档中快速找出 Top-K 候选，但存在精度损失：

- Bi-Encoder 必须将文档的所有可能含义压缩进单一向量，信息不可避免地丢失
- Bi-Encoder 编码文档时没有查询的上下文信息（因为查询还未到达）
- 结果排序可能不够精确

重排序用更精确的模型对候选结果重新打分，确保送入 LLM 的上下文是最相关的。

### Bi-Encoder vs Cross-Encoder

```
Bi-Encoder（独立编码）:
  Query  → [Encoder] → q_vector ─┐
                                  ├── cosine_similarity → score
  Doc    → [Encoder] → d_vector ─┘

  文档向量可以预计算并缓存

Cross-Encoder（联合编码）:
  [Query + Doc] → [Transformer] → score (0~1)

  每对 query-doc 都需要完整的推理
```

| 维度 | Bi-Encoder | Cross-Encoder |
|------|-----------|---------------|
| **编码方式** | Query 和 Doc 独立编码 | Query 和 Doc 拼接后联合编码 |
| **精度** | 中等 | 高（查询感知的文档表示） |
| **速度** | 极快（文档向量预计算） | 极慢（每对需完整推理） |
| **可扩展性** | 10 万文档只需编码 10 万次 | 10 万文档需编码 10 万对！ |
| **用途** | 第一阶段：召回候选 | 第二阶段：精确重排 |
| **预计算** | 可以 | 不可以 |

### 可扩展性的本质差异

假设数据库有 100,000 个文档：
- **Bi-Encoder**：编码 100,000 个文档（一次性，可离线）+ 编码 1 个查询 = 100,001 次
- **Cross-Encoder**：编码 100,000 对 (query, doc) = 100,000 次（每次查询都要）

即便用小型 Cross-Encoder（如 ms-marco-MiniLM）在 V100 GPU 上对 100,000 个文档逐对打分，单次查询也需数分钟到数十分钟（取决于 batch size 与硬件），完全无法在交互式 RAG 中接受。

这就是为什么 Cross-Encoder 只能用于重排少量候选（通常 20-100 个）。

### 两阶段检索流水线（标准架构）

```python
from sentence_transformers import SentenceTransformer, CrossEncoder

# 第 1 阶段：Bi-Encoder 召回 Top-100
bi_encoder = SentenceTransformer("all-MiniLM-L6-v2")
query_embedding = bi_encoder.encode(query)
candidates = vector_db.search(query_embedding, top_k=100)

# 第 2 阶段：Cross-Encoder 重排 → Top-5
cross_encoder = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
pairs = [(query, doc.content) for doc in candidates]
scores = cross_encoder.predict(pairs)

# 按重排分数排序，取 Top-5
reranked = sorted(
    zip(candidates, scores),
    key=lambda x: x[1],
    reverse=True
)[:5]

# 将 Top-5 送入 LLM 生成回答
context = "\n\n".join([doc.content for doc, score in reranked])
```

### 重排序的实际效果

重排序阶段对高质量 RAG 是**不可妥协的**——LLM 的输出质量直接取决于上下文的质量。没有重排序的 RAG 系统通常会将不够相关的文档送入 LLM，导致回答偏离主题或包含无关信息。

### 常用重排序方案

| 方案 | 类型 | 特点 |
|------|------|------|
| `cross-encoder/ms-marco-MiniLM-L-6-v2` | 开源 | 轻量级，速度快 |
| Cohere Rerank API | 商业 API | 高质量，开箱即用 |
| Jina AI Rerank | 商业 API | 性价比高 |
| `bge-reranker-v2-m3` | 开源 | 多语言支持 |
| ColBERT | 开源 | 晚期交互模型，精度接近 Cross-Encoder，速度更快 |

#### 选择重排序模型

推荐使用 MTEB Leaderboard 的 Reranking 排行榜选择模型。Average 列是综合质量的良好代理指标。

### 框架集成

```python
# LangChain 集成
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import CrossEncoderReranker
from langchain_community.cross_encoders import HuggingFaceCrossEncoder

model = HuggingFaceCrossEncoder(model_name="cross-encoder/ms-marco-MiniLM-L-6-v2")
compressor = CrossEncoderReranker(model=model, top_n=5)
retriever = ContextualCompressionRetriever(
    base_compressor=compressor,
    base_retriever=vector_retriever  # 第一阶段检索器
)

# Cohere Rerank API
import cohere
co = cohere.Client("API_KEY")
reranked = co.rerank(
    model="rerank-v3.5",  # Cohere 2024-12 发布的多语言新版，可替代 rerank-english-v3.0
    query=query,
    documents=[doc.content for doc in candidates],
    top_n=5
)
```

### 进阶：ColBERT（晚期交互模型）

ColBERT 是 Bi-Encoder 和 Cross-Encoder 的折中方案：

- 像 Bi-Encoder 一样独立编码 Query 和 Doc
- 但保留 token 级别的向量（不压缩为单一向量）
- 检索时做 token 级别的细粒度交互

```
Bi-Encoder:    doc → [single vector]     → dot product
Cross-Encoder: [query + doc] → [score]   → full attention
ColBERT:       doc → [token vectors]     → late interaction (MaxSim)
```

ColBERT 的精度接近 Cross-Encoder，速度接近 Bi-Encoder，是一个有前景的方向。

## 常见误区 / 面试追问

1. **误区："Bi-Encoder 精度低是因为模型小"** — 精度差异是架构本质决定的。Bi-Encoder 编码文档时没有查询上下文，无论模型多大，信息压缩的损失都存在。

2. **误区："直接用 Cross-Encoder 做全量检索更好"** — 计算上不可行。10 万文档 × 单次查询 = 10 万次推理，延迟不可接受。

3. **追问："Top-K 的 K 设多少？"** — 第一阶段：检索 50-100 个候选（K 太小会漏掉相关文档，太大会拖慢重排）。第二阶段：重排后取 3-10 个送入 LLM（取决于上下文窗口大小）。

4. **追问："Cross-Encoder 对长文档有什么问题？"** — 很多模型截断输入到 token 窗口长度（如 512 tokens），可能切掉文档最相关的部分。解决方案：先分块再重排，或使用支持长上下文的重排模型。

## 参考资料

- [Rerankers and Two-Stage Retrieval (Pinecone)](https://www.pinecone.io/learn/series/rag/rerankers/)
- [Bi-Encoder vs Cross-Encoder in IR and RAG (VeloDB)](https://www.velodb.io/glossary/bi-encoder-vs-cross-encoder)
- [Cross Encoder Reranker (LangChain)](https://python.langchain.com/docs/integrations/document_transformers/cross_encoder_reranker/)
- [Semantic Reranking (Elastic)](https://www.elastic.co/docs/solutions/search/ranking/semantic-reranking)
- [Beyond Simple Embeddings: Bi-Encoders and Cross-Encoders (WaterCrawl)](https://watercrawl.dev/blog/Beyond-Simple-Embeddings)
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="018-agentic-rag">

<h2 class="question-title"><span class="q-badge ai100-badge">Q17</span><span class="question-text">什么是 Agentic RAG？它与传统 RAG 有何不同？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：RAG, AI100 · 考察点：RAG</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Agentic RAG 在传统 RAG 的"检索→生成"流水线上增加了一个 AI Agent 控制循环。Agent 可以动态决定是否需要检索、从哪个数据源检索、是否需要多轮检索、以及是否需要调用外部工具（API、数据库、计算器）。核心区别：传统 RAG 是"单次检索、一发即忘"的流水线；Agentic RAG 是"多轮迭代、自主决策"的控制循环。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误区："Agentic RAG 总是比传统 RAG 好" · 误区："Agentic RAG 就是 RAG + LangChain Agent" · 追问："Agentic RAG 的可靠性如何保证？"</div>
</div>

## 详细解析

### 传统 RAG 的局限

传统 RAG 是一条线性流水线：查询→检索→生成。关键限制：

1. **单数据源**：只从一个向量库中检索，无法跨多个知识源
2. **一次检索（One-shot）**：只检索一次，如果结果不够好没有纠错机制
3. **无工具使用**：只能检索静态文本，无法调用 API、执行 SQL 或做计算
4. **无推理**：不会判断检索结果的质量，也不会调整检索策略

### Agentic RAG 的核心升级

Agentic RAG 不是简单的 RAG 改进版，而是**在 RAG 上增加了控制循环**。这个循环可以：

```
传统 RAG:   Query → Retrieve → Generate → Answer（线性流水线）

Agentic RAG: Query → Agent 决策 ←──────────────────────┐
                     ├→ 需要检索？→ 从哪检索？→ 结果够好吗？ ─┘
                     ├→ 需要工具？→ 调用 API/SQL/计算器
                     ├→ 需要分解？→ 拆成子问题分别处理
                     └→ 信息够了  → 生成最终回答
```

### 三种核心 Agent 类型

#### 1. 路由 Agent（Routing Agent）

最简单的 Agentic RAG 形式——Agent 分析查询后决定从哪个数据源检索。

```python
class RoutingAgent:
    def __init__(self):
        self.retrievers = {
            "technical_docs": vector_store_a,
            "customer_data": sql_database,
            "real_time_info": web_search,
        }

    def route(self, query: str) -> str:
        # LLM 分析查询，决定最佳数据源
        decision = llm.generate(
            f"用户问题：{query}\n"
            f"可用数据源：{list(self.retrievers.keys())}\n"
            f"选择最合适的数据源。"
        )
        return self.retrievers[decision].search(query)
```

**适用场景：** 多知识源系统（如客服系统同时有产品文档、订单数据库、FAQ）。

#### 2. 工具使用 Agent（Tool Use Agent）

在标准 RAG 基础上集成外部工具，能获取实时数据或执行计算。

```python
tools = [
    {"name": "vector_search", "desc": "搜索内部文档"},
    {"name": "web_search", "desc": "搜索互联网最新信息"},
    {"name": "sql_query", "desc": "查询数据库获取结构化数据"},
    {"name": "calculator", "desc": "执行数学计算"},
]

# Agent 决定使用哪些工具，按什么顺序
# 例如：先搜索文档获取定价规则，再查数据库获取客户数据，再计算折扣
```

#### 3. ReAct Agent（多步推理 + 状态保持）

结合路由、查询规划和工具使用，处理需要多步推理的复杂查询。

```python
# 复杂查询："比较我们公司和竞争对手的市场份额，预测明年趋势"
# Agent 的执行轨迹：
# Thought 1: 需要先获取我们公司的市场数据
# Action 1: sql_query("SELECT market_share FROM reports WHERE year=2025")
# Observation 1: 市场份额 23.5%
# Thought 2: 需要获取竞争对手数据
# Action 2: web_search("competitor X market share 2025")
# Observation 2: 竞争对手 X 市场份额 31.2%
# Thought 3: 需要找到行业趋势分析
# Action 3: vector_search("AI market growth prediction 2026")
# Observation 3: 分析师预计增长 45.8%
# Thought 4: 现在信息够了，可以综合分析
# Final Answer: ...
```

### 查询分解 Agent

处理复杂的多跳查询——将一个问题拆成多个独立子问题，分别检索后综合回答。

```python
class QueryDecomposer:
    def decompose(self, complex_query: str) -> list[str]:
        return llm.generate(
            f"将以下复杂问题分解为 2-4 个独立的子问题：\n{complex_query}"
        )

# 示例：
# 原始查询："我们的 RAG 系统延迟比竞品高，成本也更高，怎么优化？"
# 分解为：
# 1. "RAG 系统延迟优化有哪些方法？"
# 2. "RAG 系统成本优化策略有哪些？"
# 3. "竞品的典型延迟和成本指标是什么？"
# 分别检索后综合生成优化方案
```

### 务实策略：渐进式 Agentic RAG

Agent 带来灵活性，但也引入了延迟、成本和不可预测性。推荐的务实做法：

```python
def smart_rag(query: str) -> str:
    # 默认使用经典 RAG（快、便宜、可预测）
    result = classic_rag(query)

    # 检测失败信号
    if (result.confidence < 0.5 or
        result.has_contradiction or
        result.missing_citations):
        # 触发 Agentic RAG 二次处理
        result = agentic_rag(query)

    return result
```

大多数查询用经典 RAG 即可高效处理，仅在检测到失败信号时启用 Agentic RAG 做二次检索和验证。

### 对比总结

| 维度 | 传统 RAG | Agentic RAG |
|------|---------|-------------|
| 数据源 | 单个向量库 | 多源（向量库+数据库+API+Web） |
| 检索次数 | 1 次 | 多次（迭代优化） |
| 决策 | 固定流程 | LLM 自主决策 |
| 工具使用 | 无 | 支持（API、SQL、计算器等） |
| 纠错能力 | 无 | 有（检测+重试+验证） |
| 延迟 | 低 | 较高 |
| 成本 | 低 | 较高 |
| 可预测性 | 高 | 中 |

## 常见误区 / 面试追问

1. **误区："Agentic RAG 总是比传统 RAG 好"** — Agent 引入了延迟、成本和不可预测性。简单查询用传统 RAG 更快更可靠。不要因为 Agentic 听起来更先进就盲目采用。

2. **误区："Agentic RAG 就是 RAG + LangChain Agent"** — Agentic RAG 是一种架构模式，不绑定特定框架。核心是在 RAG 流水线中引入动态决策和控制循环。

3. **追问："Agentic RAG 的可靠性如何保证？"** — (1) 设置最大迭代次数防止无限循环；(2) 工具调用加超时和降级；(3) 对检索结果做质量检查（如 Corrective RAG 的评估器）；(4) 关键场景加 Human-in-the-Loop。

4. **追问："多 Agent RAG 是什么？"** — 多个专业化 Agent 协作：一个主 Agent 协调信息检索，多个子 Agent 各自负责不同数据源。例如：一个 Agent 查内部文档，一个 Agent 查数据库，主 Agent 综合结果。

## 参考资料

- [Traditional RAG vs. Agentic RAG (NVIDIA)](https://developer.nvidia.com/blog/traditional-rag-vs-agentic-rag-why-ai-agents-need-dynamic-knowledge-to-get-smarter/)
- [What Is Agentic RAG? (IBM)](https://www.ibm.com/think/topics/agentic-rag)
- [What Is Agentic RAG? From LLM RAG to AI Agents (Weaviate)](https://weaviate.io/blog/what-is-agentic-rag)
- [Agentic RAG vs Classic RAG: From Pipeline to Control Loop (TDS)](https://towardsdatascience.com/agentic-rag-vs-classic-rag-from-a-pipeline-to-a-control-loop/)
- [Agentic RAG: A Guide to Building Autonomous AI Systems (n8n)](https://blog.n8n.io/agentic-rag/)
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="019-advanced-rag-variants">

<h2 class="question-title"><span class="q-badge ai100-badge">Q18</span><span class="question-text">高级 RAG 变体：Corrective RAG、Self-RAG、Adaptive RAG</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐⭐ · 标签：RAG, AI100 · 考察点：RAG</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：三种高级 RAG 变体各解决不同问题：**Self-RAG** 通过反思 token 动态决定是否检索并自我评估输出质量，提升事实准确性；**Corrective RAG (CRAG)** 在检索后评估文档质量，对低质量结果触发 Web 搜索补救；**Adaptive RAG** 用分类器分析查询复杂度，动态路由到最合适的检索策略。三者可以组合使用，构成多层防御的高可靠 RAG 系统。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误区："这些变体互相替代" · 误区："Self-RAG 可以用任何 LLM" · 追问："GraphRAG 属于哪个类别？"</div>
</div>

## 详细解析

### 1. Self-RAG（自我反思 RAG）

**核心思想：** 训练 LLM 生成特殊的"反思 token"来自我管理检索和输出质量。

#### 工作流程

```
Query → LLM 判断是否需要检索？
              ├── 不需要 → 直接生成（简单问题，如常识）
              └── 需要   → 检索文档
                          → 生成回答
                          → [反思 token] 评估：
                              ├── 检索结果是否相关？（Relevance）
                              ├── 回答是否基于检索内容？（Support）
                              └── 回答是否有用？（Utility）
                          → 如果不满意 → 重新检索或修改回答
```

#### 两种特殊 Token

- **Reflection Token（反思 token）**：决定是否需要检索
- **Critique Token（批评 token）**：评估检索结果和生成内容的质量

```python
class SelfRAG:
    def answer(self, query: str) -> str:
        # 1. 决定是否需要检索
        need_retrieval = self.llm.predict_retrieval_need(query)

        if not need_retrieval:
            return self.llm.generate(query)

        # 2. 检索并生成
        docs = self.retriever.search(query)
        response = self.llm.generate_with_context(query, docs)

        # 3. 自我批评
        relevance_score = self.llm.critique_relevance(docs, query)
        support_score = self.llm.critique_support(response, docs)
        utility_score = self.llm.critique_utility(response, query)

        # 4. 如果质量不够，迭代改进
        if min(relevance_score, support_score, utility_score) < THRESHOLD:
            return self.retry_with_refined_query(query)

        return response
```

**关键优势：** 根据 Asai et al. (2023) 论文（ICLR 2024 Oral）在 Open-domain QA、推理和事实验证等六类任务上的实验，Self-RAG（7B/13B）显著优于 ChatGPT 和 retrieval-augmented Llama2-chat，事实性指标在多个任务上取得 SOTA。在医疗、法律、金融等高精度需求场景尤为有价值。

**局限：** 需要用特殊 token 对模型进行微调，不能直接用于现有 API 模型。

### 2. Corrective RAG (CRAG)

**核心思想：** 在检索之后、生成之前，加入一个轻量级评估器来评估文档质量，并在质量不足时启用 Web 搜索作为补救。

#### 工作流程

```
Query → 检索文档
         ↓
    [检索评估器] ← 对每个文档打分
         │
    ┌────┼────────────┐
    │    │             │
  相关   模糊         不相关
    │    │             │
  直接   知识精炼 +     Web 搜索
  使用   Web 搜索       获取新文档
    │    │             │
    └────┼────────────┘
         ↓
    生成最终回答
```

```python
class CorrectiveRAG:
    def answer(self, query: str) -> str:
        # 1. 标准检索
        docs = self.retriever.search(query)

        # 2. 评估检索质量
        evaluations = []
        for doc in docs:
            score = self.evaluator.grade(query, doc)
            evaluations.append((doc, score))

        # 3. 根据评估结果分类处理
        relevant_docs = [d for d, s in evaluations if s == "relevant"]
        ambiguous_docs = [d for d, s in evaluations if s == "ambiguous"]

        if not relevant_docs:
            # 所有文档都不相关 → Web 搜索补救
            web_results = self.web_search(query)
            context = web_results
        elif ambiguous_docs:
            # 部分模糊 → 知识精炼 + Web 补充
            refined = self.knowledge_refine(relevant_docs)
            web_supplement = self.web_search(query)
            context = refined + web_supplement
        else:
            # 文档质量好 → 直接使用
            context = relevant_docs

        # 4. 生成回答
        return self.llm.generate(query, context)
```

**关键优势：** 轻量级——评估器可以是小模型（甚至规则引擎），不需要微调主 LLM。Web 搜索兜底确保即使知识库不完善也能给出有用回答。

**适用场景：** 法律研究、学术写作、政策分析——准确性至关重要且允许稍高延迟的场景。

### 3. Adaptive RAG

**核心思想：** 在检索之前，用分类器分析查询复杂度，然后动态选择最合适的检索策略。

#### 工作流程

```
Query → [查询复杂度分类器]
              │
    ┌─────────┼─────────┐
    │         │         │
  简单       中等       复杂
    │         │         │
  不检索    标准 RAG   多跳检索
  (LLM      (单次     + Self-RAG
  直接答)   检索+生成)  + 验证)
```

```python
class AdaptiveRAG:
    def answer(self, query: str) -> str:
        # 1. 分析查询复杂度
        complexity = self.classifier.predict(query)

        if complexity == "simple":
            # 常识问题 → 不需要检索
            return self.llm.generate(query)

        elif complexity == "moderate":
            # 标准问题 → 单次 RAG
            docs = self.retriever.search(query)
            return self.llm.generate(query, docs)

        elif complexity == "complex":
            # 复杂多跳问题 → 多轮检索 + 验证
            sub_queries = self.decompose(query)
            all_docs = []
            for sq in sub_queries:
                docs = self.retriever.search(sq)
                # 用 CRAG 的评估器验证质量
                verified = self.evaluator.filter(sq, docs)
                all_docs.extend(verified)
            return self.llm.generate(query, all_docs)
```

**关键优势：** 通过避免对简单问题过度检索来优化效率和成本。复杂问题得到更深入的处理。

**适用场景：** 查询复杂度差异大的系统（客服、通用助手）——简单 FAQ 不需要检索，复杂分析需要多轮检索。

### 三者对比

| 维度 | Self-RAG | Corrective RAG | Adaptive RAG |
|------|---------|----------------|--------------|
| **核心关注** | 输出质量自我评估 | 检索结果质量纠正 | 查询复杂度适配 |
| **决策时机** | 检索前+生成后 | 检索后+生成前 | 检索前 |
| **纠错机制** | 反思 token + 重试 | 评估器 + Web 搜索 | 路由到合适策略 |
| **模型要求** | 需要微调 | 轻量级评估器 | 分类器 |
| **额外成本** | 中（多轮生成） | 低-中（评估+Web） | 低（分类器） |
| **最佳场景** | 高精度需求 | 知识库不完善时 | 混合复杂度查询 |

### 组合使用：多层防御

三种变体可以组合构成更强大的系统：

```python
class CombinedAdvancedRAG:
    def answer(self, query: str) -> str:
        # Layer 1: Adaptive RAG — 路由到合适策略
        complexity = self.classifier.predict(query)

        if complexity == "simple":
            return self.llm.generate(query)

        # Layer 2: 标准检索
        docs = self.retriever.search(query)

        # Layer 3: Corrective RAG — 评估并纠正检索质量
        verified_docs = self.evaluator.filter_and_correct(query, docs)

        # Layer 4: Self-RAG — 生成并自我评估
        response = self.self_rag.generate_with_critique(query, verified_docs)

        return response
```

## 常见误区 / 面试追问

1. **误区："这些变体互相替代"** — 它们解决不同环节的问题，完全可以组合使用。Adaptive RAG 做前端路由，CRAG 做检索质量控制，Self-RAG 做输出质量保证。

2. **误区："Self-RAG 可以用任何 LLM"** — 原始 Self-RAG 需要用反思 token 微调模型。不过，可以通过 Prompt Engineering 模拟类似效果（让 LLM 在 Prompt 中评估自己的输出），但效果不如原版。

3. **追问："GraphRAG 属于哪个类别？"** — GraphRAG 是另一种独立变体，它用知识图谱代替（或补充）向量检索。适合实体关系密集的场景（如组织架构、产品关系网络）。与上述三种变体正交，可以并行使用。

4. **追问："实际生产中最常用的是哪种？"** — Corrective RAG 因为实现简单（不需要微调）且效果显著而最常被采用。Adaptive RAG 在成本敏感场景也很流行。Self-RAG 因为需要微调，更多出现在研究中。

## 参考资料

- [Advanced RAG: Comparing GraphRAG, Corrective RAG, and Self-RAG (Towards AI)](https://pub.towardsai.net/advanced-rag-comparing-graphrag-corrective-rag-and-self-rag-00491de494e4)
- [14 Types of RAG (Meilisearch)](https://www.meilisearch.com/blog/rag-types)
- [Adaptive RAG Tutorial (LangGraph)](https://langchain-ai.github.io/langgraph/tutorials/rag/langgraph_adaptive_rag/)
- [RAG vs Self-RAG vs Agentic RAG (Medium)](https://medium.com/ai-agent-insider/rag-vs-self-rag-vs-agentic-rag-which-one-is-right-for-you-3d233ef42cac)
- [Beyond Vanilla RAG: 7 Modern RAG Architectures (DEV Community)](https://dev.to/naresh_007/beyond-vanilla-rag-the-7-modern-rag-architectures-every-ai-engineer-must-know-4l0c)
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="020-rag-evaluation-metrics">

<h2 class="question-title"><span class="q-badge ai100-badge">Q19</span><span class="question-text">RAG 评估指标体系：原理、计算与实战</span></h2>

**结论句（15 秒）**：



### 回答

</div>

---

<div class="chapter-nav">

<a class="chapter-nav-link" href="/custom/ai100/">📑 总览</a>

<a class="chapter-nav-link" href="/custom/ai100/agent-arch">← 🏛️ Agent 架构</a>

<a class="chapter-nav-link chapter-nav-next" href="/custom/ai100/tool-use">🔧 工具使用 →</a>

</div>
