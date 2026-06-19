---
title: 7. Chunk 怎么切？切大了切小了各有什么问题？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [RAG, 卡码笔记]
point: 7. Chunk 怎么切？切大了切小了各有什么问题？
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/rag_interview.html

> 来源文章：RAG大厂面试题汇总：向量检索、混合检索、Rerank、幻觉处理高频问题

---

**题目**：7. Chunk 怎么切？切大了切小了各有什么问题？

**结论句（15 秒）**：面试官会问：&quot;你们 Chunk 策略怎么设计的

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

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