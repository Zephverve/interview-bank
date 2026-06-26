---
part: 0
partTitle: Part 0 · 开场准备
partColor: #6366f1
---

<div class="part-hero" style="--part-color: #6366f1">

# Part 0 · 开场准备

<p class="part-desc">项目介绍 · 典型问题</p>
<span class="part-round">开场必背</span>

</div>

<div class="part-intro">

> 面试常见流程：项目介绍 → 技术深挖。以下按面试官追问路径排列。

</div>

---



<div class="section-card">

<h2 class="section-title">项目经历详细介绍 · 面试官提问版</h2>

### 【项目一】垂域科研文献 RAG 问答系统



**回答**：

"这是我读研后的主线 **个人项目**（2024.12 起），服务课题组文献研读，目标是把'问通用大模型'变成'可对话、可溯源'的 Agentic RAG 服务，大概经历了四个阶段。

**第一阶段是需求定义**。跟课题组同学聊了一周，锁定三个高频场景：术语解释、论文检索、实验复述。三者对可靠性的要求不同——术语要准、检索要全、复述要能定位到原文段落。

**第二阶段是基线 RAG**。PDF 解析 → BGE-M3 embedding → Qdrant → Top-5 向量检索 → 拼 prompt 生成。这个纯向量基线 Recall@5 只有 **0.51**，引用经常串论文——模型会把 A 论文的结论安到 B 论文头上。

**第三阶段是 Agentic RAG 升级**。我用 LangGraph 搭了一条多节点流水线：意图路由 → 查询改写 → HyDE → Dense+BM25+Sparse 三路混合召回 → RRF 融合 → Cross-Encoder 重排 → 质量门控 → 上下文压缩 → 生成 → **Faithfulness Guard** → **Self-RAG**。门控或校验失败会自动 re-retrieve 或重生成。对比类问题还会走 Multi-hop 子问分解做跨文献二跳检索。PDF 侧集成了 **MinerU** 做结构化解析（表格/公式/双栏，三级降级），索引用 parent-child 分层切片，Qdrant 支持单篇 PDF 增量 upsert，不用全库重建。Recall@5 最终到 **0.85**。

**第四阶段是微调与工程化**。QLoRA 在 3090 Ti 上微调 Qwen2.5-14B，1.8k 条指令对齐引用格式，loss 到 **0.42**。工程上 FastAPI SSE 流式 + **React** 对话 UI，引用 API 可跳转原文段落；维护 **120** 问黄金集持续评测。"


### 【项目一 · 附录】RAG 从 0 到 1 · 每一步怎么做（详细版）

> **使用说明**：面试说「详细介绍 pipeline」时，按 **离线建库 → 在线问答 → 评测微调 → 工程交付** 四段讲；每段内按序号逐步展开。与代码 `research-qa` 仓库、`rag_graph.py` 节点一致。

**面试官**：不要泛泛而谈，把你 RAG 项目**每一步具体怎么做**讲清楚。

**回答（结构化背诵版）**：

下面我按**数据怎么进库、问题怎么出去**两条线，把每一步的 **输入 → 处理 → 输出 → 为什么** 说清楚。


#### 一、离线建库流水线（上传 PDF → 可检索）

| 步骤 | 做什么 | 具体怎么做 | 输出 |
|------|--------|------------|------|
| **1.1 需求与数据** | 定场景、收论文 | 跟课题组对齐三类问法：术语解释 / 找论文 / 实验复述；PDF 放 `papers/` 或 Web 上传 `uploads/` | 论文文件列表 + 真实提问样例 |
| **1.2 PDF 解析** | 把 PDF 变成「带结构的全文」 | **三级降级**：① **MinerU**（默认）读 `content_list.json`——标题/段落/表格/公式分块，页眉页脚丢弃；② 失败 → **structured**（版面启发式）；③ 再失败 → **basic**（pdfplumber 按页抽文本）。解析结果缓存，同文件不重复跑 MinerU | `[(页码, 章节名, 页文本), ...]` + `parser` 元数据 |
| **1.3 Parent-Child 切片** | 检索用小块、生成用大块 | 按页/节遍历：先切 **父块**（约 1200 token，简历写 2k 是目标窗口）→ 再在父块内切 **子块**（约 400 token，简历口径 512）带 overlap。子块 `parent_id` 指向父块；表格尽量整段进父块不拆碎 | 子块列表（只索引子块）+ 父块字典（只给生成用） |
| **1.4 向量化** | 子块进 embedding | **BGE-M3** 本地推理：每个子块得 **dense 向量** + **sparse  lexical weights**（供 sparse 检索）。中英文论文同一模型 | 向量 + 子块 payload |
| **1.5 写入 Qdrant** | 向量库 | 本地 Qdrant：`paper_chunks` collection，cosine 距离；payload 带 `paper_id/chunk_id/page/section` | 可 ANN 检索的向量点 |
| **1.6 BM25 索引** | 关键词检索 | 子块全文建 **BM25** 语料，落盘 `bm25_corpus.json`，与 Qdrant 同步更新 | 可精确匹配术语的倒排索引 |
| **1.7 单篇增量更新** | 不用全库重建 | 上传一篇 PDF：`upsert_paper_paths(paper_id)` → 解析切片 → **先 delete 该 paper_id 旧向量** → **upsert 新子块向量** → 重建 BM25 + 更新 `parent_chunks.json`。后台线程跑，前端轮询索引状态 | 仅该论文 chunk 变更 |

**基线阶段（Recall@5=0.51）**：只做 1.2 basic 解析 + 1.4 dense 单向量 + 1.5 Top-5 检索 + 裸 prompt 生成，没有混合检索、没有 Guard。


#### 二、在线问答流水线（LangGraph · 用户提问 → 带引用答案）

用户通过 **React** 调 `POST /chat`，`stream=true` 走 **SSE**；后端 `build_rag_graph()` 编译后的图如下（**按执行顺序**）：

| 步骤 | 节点名 | 输入 | 处理逻辑 | 输出到 State |
|------|--------|------|----------|--------------|
| **2.1 意图路由** | `classify_intent` | 用户 `query` | 先 **规则**（对比/检索/实验/术语正则），不确定再 **小 LLM** 五分类：`terminology / paper_search / experiment / compare / general`。决定后续 **Top-K、是否 Multi-hop、用哪套 system prompt** | `intent` |
| **2.2 查询改写** | `rewrite_query` | `query` + 近 6 轮 `history` | 中文口语 → **检索问句** + **英文关键词**（论文库多为英文 PDF）。若 `retrieval_retry_count>0`（上次检索太差），改写 prompt 强调「换同义词、更论文化」。无中文且无历史可跳过 | `rewritten_query`, `retrieval_en_keywords` |
| **2.3 HyDE** | `hyde_generate` | 原问 + 改写问句 | 对 **experiment / compare / general** 等意图，LLM 写一段「假设性论文段落」（不要求正确，只要像论文陈述）。**用假设段落再做一路 dense 检索**，缓解「问句 vs 陈述句」向量距离远的问题。不适用的意图直接 `skipped` | `hyde_doc` |
| **2.4 混合检索** | `retrieve` | 改写问句、英文词、HyDE 文 | **分支 A**：`compare` 或跨文献 → **Multi-hop**：LLM 拆 2–3 **子问** → 每个子问独立 `HybridRetriever.retrieve` → 按 chunk_id 去重合并。<br>**分支 B**：普通问 → 单次混合检索：<br>① dense(query)<br>② dense(hyde)（若有）<br>③ BM25(query)<br>④ BM25(英文关键词)<br>⑤ BGE-M3 sparse<br>→ **RRF 融合**（k=60）取 ~40 候选 → **Cross-Encoder 重排** → Top-5~8 子块（意图不同 Top-K 不同） | `hits`, `multihop_queries` |
| **2.5 质量门控** | `grade_retrieval` | `hits` + 问句 | 无结果 → 失败；或 **top rerank 分 < 0.25** 且关键词命中 < 2 → 判定「检索不够」 | `retrieval_grade_passed`, `reason` |
| **2.6 Re-retrieve（条件边）** | `re_retrieve` → 回到 2.2 | 门控失败且 `retrieval_retry_count < 1` | `retrieval_retry_count += 1`，重新改写+HyDE+检索（**Self-RAG 检索侧**）。超过次数则带着弱检索继续往下，生成时 prompt 要求「未找到就说未提及」 | 更新 retry 计数 |
| **2.7 上下文压缩** | `compress_context` | Top 子块 + 问句 | 子块映射到 **父块** 全文；按问句相关性裁剪、去重、截断，避免 5 个父块直接拼爆 context | `compressed_context` |
| **2.8 生成** | `generate` | 父块上下文 + 意图专用 prompt + history | 按意图加载不同 prompt 模板（术语/实验/对比/通用）；要求引用格式 `[paper_id#chunk_id p.N]`。模型：**QLoRA 微调 Qwen2.5-14B** 或 API/Ollama 降级。`retry_count>0` 时追加「必须带引用」强约束 | `answer` |
| **2.9 Faithfulness Guard** | `faithfulness_guard` | `answer` + `hits` | 正则抽引用 → 检查 chunk 是否在 hits 里 → 对引用句与 chunk 做 **embedding 余弦相似度**（阈值 0.42）。无引用且回答过长 → 不通过 | `guard_passed`, `guard_issues` |
| **2.10 Self-RAG（生成侧）** | `self_rag_guard` | 答案 + hits | 额外语义一致性检查（`apply_self_rag`），与 Guard 合并为最终 `guard_passed` | `self_rag_passed` |
| **2.11 重生（条件边）** | `retry` → 回到 2.8 | Guard 失败且 `retry_count < 1` | **只重生成**（不重新检索），`retry_count += 1` | 新 `answer` |
| **2.12 落盘与返回** | `persist_trace` | 全 State | 写 `logs/{trace_id}.json`（每节点耗时、检索列表、Guard 结果），便于复盘 bad case | SSE `done` 事件带 `citations`（父块摘要+页码+score） |

**SSE 流式**：检索链路（2.1–2.7）先跑完 → `stream_generate` 边生成边推 token → 生成结束后跑 2.9–2.12，最后推 `citations/guard_passed/trace_id`。


#### 三、评测与微调（怎么证明 0.51→0.85）

| 步骤 | 做什么 | 怎么做 |
|------|--------|--------|
| **3.1 黄金集** | 120 问 | 课题组真实问 80 + 自造边界 40（跨论文、缩写、口语）；每问标 1–3 个金标准段落（paper_id + 位置） |
| **3.2 检索指标** | Recall@5 | Top-5 子块命中任一 gold 段落即成功；每加 BM25/重排/改写/HyDE/Multi-hop 单独跑消融 |
| **3.3 端到端指标** | 生成质量 | RAGAs Faithfulness、Guard 通过率、人工 1–5 分；不只盯 Recall |
| **3.4 QLoRA** | 引用格式对齐 | 1.8k 条：真实问 + 负样本（故意给错 chunk 训练拒答）；3090 Ti 4-bit + LoRA，验证集 loss 早停，最终 loss **0.42** |

**优化路径数字（面试背）**：纯向量 **0.51** → +混合+重排 **~0.63→0.71** → +Agentic+MinerU+Guard **0.85**。


#### 四、工程交付（课题组怎么用）

| 模块 | 实现 |
|------|------|
| **API** | FastAPI：`/chat` SSE、`/papers` 上传触发增量索引、`/papers/{id}/cite` 引用跳转原文 |
| **前端** | React 对话 UI，流式打字，侧栏文献列表，点击引用跳段落 |
| **异步任务** | 索引 `running/done/error` 状态；问答时若索引在跑返回 503 |
| **缓存** | 语义缓存高频问（可选）；MinerU 解析结果 JSON 缓存 |


**15 秒总述（开场用）**：

「离线：MinerU 解析 → parent-child 切片 → BGE-M3 向量 + BM25 进 Qdrant，单篇 upsert。在线：LangGraph 十二步——意图、改写、HyDE、三路混合检索+RRF+重排、门控、压缩、生成、Faithfulness Guard、Self-RAG 条件重检/重生。120 问黄金集 Recall@5 0.51 到 0.85，QLoRA 对齐引用，FastAPI SSE + React 可溯源。」

**常见追问速答**：

- **重排为什么 batch？** 20 次单条 Cross-Encoder ~2s，batch 一次 ~400ms，P95 从 3.1s 到 1.2s 的最大单项优化。
- **为什么子块检索、父块生成？** 子块语义聚焦提高 Recall；父块保留完整论证减少生成断章取义。
- **Guard 和微调分工？** 微调学格式和拒答习惯；Guard 在线验真，失败触发 Self-RAG 回路。

（更细的单点题见 Part 1 **Q11/Q12/Q1/Q37/Q41–Q45**）


### 【项目二】EvoAgent：可自我进化的 AI Agent 框架

**面试官**：详细介绍这个 Agent 框架，它的架构是怎么设计的？

**回答**：

"这是我自己设计并实现的一个轻量级 Agent 框架，核心创新是让 Agent **每次任务后自动提炼经验、沉淀为可复用技能**，用得越久越强。我按五层来讲。

**第一层是多 LLM Provider 抽象**。统一 Anthropic/OpenAI 及兼容接口，**MixinSession** 做多后端自动故障切换，配合 Prompt Cache 和 SSE 流式解析——上层业务不用关心具体 vendor。

**第二层是 Agent 执行引擎**。不是裸 ReAct 乱转，我设计了 **「探索—规划—执行—验证」四阶段 SOP**。繁重操作委托 **SubAgent** 执行，主 Agent 上下文保持干净；任务完成后强制启动独立 SubAgent 做 **对抗性验证**，专门挑毛病，防确认偏误。

**第三层是分层记忆 L0-L4**。Agent 每次任务后自动提取已验证事实和操作经验，**增量局部更新**长期记忆，下次任务自动加载——这和单纯向量检索不一样，是精准定位 + 可解释的文件化记忆。

**第四层是 Conductor 多 Agent 编排**。基于 FastAPI + WebSocket 实现指挥中心：inbox 事件队列、SubagentPool、输出监控，支持运行时注入 key_info 干预子 Agent。

**第五层是上下文压缩**。对老消息里过长的思考链和工具输出做首尾截断，超窗口时从最早消息逐条删除；早期对话折叠成单行摘要，保留脉络、控制长周期任务 Token 增长。

和 Hermes 这类框架比，EvoAgent 更轻、更强调 **任务后技能结晶 + 对抗验证** 这条自我进化闭环。"


### 项目经历 · 遇到的问题与解决方案

> **使用提示**：三个案例各约 1 分钟，主题分别是引用质量、数据质量、Agent 安全——与 Part 1 Q13、Q2、Q15 可交叉引用。

**面试官**：在这些项目中，你遇到过什么让你印象深刻的问题？怎么解决的？

**回答**：

"我挑三个印象深刻的说。

**第一个是 RAG 系统里的'跨论文信息混淆'问题**。大概做到 RAG pipeline 的第二个迭代时，我发现 LLM 经常把不同论文的信息混在一起——比如用户问'A 论文用了什么激活函数'，检索返回了 A 和 B 两篇论文的片段，LLM 有时候会把 B 论文的内容安到 A 论文头上。这个问题很隐蔽，因为单独看回答内容是对的，只是引用错了。

我试了几个方案。最初在 prompt 里加'请基于提供的论文回答'没有用——LLM 还是会混淆。后来在 LangGraph 里加了 **Faithfulness Guard** 节点：生成后逐条核对引用是否能在父块原文中找到支撑；失败则走 **Self-RAG** 分支——判断是检索不够还是生成胡说，前者 re-retrieve（换 query 或加 HyDE），后者只重生成。配合 MinerU 改善 PDF 解析后，引用可追溯性明显提升。早期单节点校验通过率大约 72%→86%，现在整条 Agentic 链路端到端更稳，但表格/公式类问题仍有边界 case。

**第二个是微调数据质量的坑**。我一开始用 ChatGPT 自动生成了 500 条 QA 对就去微调了，loss 降到 0.68 就下不去了，而且输出风格很差——每句话都是'根据论文...'开头。后来我发现自动生成的数据有两个问题：一是问题和真实用户提问差距很大——真实用户不会问'请详细阐述...'这种完整句式；二是答案太'标准'了，没有实际的引用细节。

我重新构建了数据集——从课题组的聊天记录和真实提问里挖了 300 条，手动标注，然后再用 GPT 做了数据增强扩到 1.8k。同时加了 200 条'错误引用'的负样本——故意给不匹配的论文片段，训练模型在这种情况下说'信息不足'而不是瞎编。这个改动让 loss 从 0.68 降到了 0.42，输出风格也明显自然了。

**第三个是 EvoAgent 里 SubAgent 对抗验证踩过的坑**。早期主 Agent 自己验证自己的输出，很容易'确认偏误'——明明引用错了还自圆其说。我的改法是执行完成后强制拉起独立 SubAgent，只负责挑刺：对照工具输出和最终结论是否一致、有没有跳过关键步骤。这一步增加了延迟，但显著减少了'看起来对其实错'的情况。共性原则还是：**Agent 工程最难的不是做对，而是做错时能发现、能恢复、能审计。**


---

</div>
