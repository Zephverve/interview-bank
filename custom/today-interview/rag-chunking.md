---
title: RAG 文档切分最佳实践
round: 一面/二面
difficulty: ⭐⭐⭐⭐
tags: [RAG, Chunking, 数据处理]
point: 切分策略
---

**题目**：RAG 系统中文档切分怎么做？有哪些坑？

**结论句（15 秒）**：看文档类型选策略——结构化用语义分块、非结构化用滑动窗口加 overlap、表格另存 metadata；切太小丢上下文、切太大损失精度，256-512 token 是常见起点。

**追问方向**：语义分块怎么做？ · 表格怎么处理？ · chunk 大小怎么调？

### 回答

文档切分是 RAG 第一脚刹车，切坏了后面检索再好也救不回来。我科研问答踩过三个坑。

**坑一，一刀切不分文档类型。** 论文、网页、Markdown、PPT 格式完全不同，统一 `chunk_size=512` 会把 PDF 表格切碎。论文按 section 切，表格整表独立 chunk；Markdown 按标题层级；QA 按 pair；代码按 AST 函数/类边界。

**坑二，chunk_size 拍脑袋。** 先看 embedding 模型有效窗口，text-embedding-3-small 和 bge-large 都是 512 token。通用 256-512 + overlap 10%-20%；论文 512-1024；代码按完整函数不硬截。用评测集遍历 128/256/512/768/1024 看 Recall@5，我们论文最优 384、技术文档 256。

**坑三，overlap 设了就完事。** overlap 太大相邻 chunk 高度重复，下游 LLM 困惑。我按标点断句，宁可 chunk 稍大也不在句中砍断；非砍不可时保证 overlap 覆盖完整句子。
