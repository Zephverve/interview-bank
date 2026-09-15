---
title: Query Rewrite 算不算 Agentic？
round: 二面
difficulty: ⭐⭐
tags: [rag, 面试]
point: Query Rewrite 算不算 Agentic？
---

**题目**：Query Rewrite 算不算 Agentic？

### 回答

**边界比较模糊，我给出自己的判断标准：看有没有"基于中间结果的决策"**。

固定执行一次改写，不算 Agentic —— 那只是流水线里的一个固定步骤，控制流是写死的。

根据改写后的检索结果**决定是否再改写、要不要换检索策略**，这才算。核心是**控制流由模型的判断驱动**，而不是写死的执行顺序。

按这个标准，我的系统里**质量门控触发的 re-retrieve 是 Agentic 的部分**（因为它是基于检索结果的判断），而查询改写本身不是。
