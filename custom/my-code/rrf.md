---
title: 手写 RRF（Reciprocal Rank Fusion）
round: 一面/二面
difficulty: ⭐⭐
tags: [code, 面试]
point: 手写 RRF（Reciprocal Rank Fusion）
---

**题目**：手写 RRF（Reciprocal Rank Fusion）

### 回答

**题目**：给你多路检索结果（每路是一个有序的文档 ID 列表），写函数融合排序。

**考察点**：
- 公式：`score(d) = Σ_i 1 / (k + rank_i(d))`，k 常取 60。
- **rank 从 1 开始**（不是 0，写错就全错）。
- 文档只出现在部分路里怎么办（只在出现过的路里累加，不能当 rank=∞ 直接算 0 以外的值）。
- 合并去重、按 score 降序输出。

**这题你一定要准备**，因为你项目里用了 RRF，面试官很可能说"那你写一下"。
