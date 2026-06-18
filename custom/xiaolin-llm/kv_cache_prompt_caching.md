---
title: KV Cache 是什么？Prompt Caching 的原理是什么？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [LLM, 小林笔记]
point: KV Cache 是什么？Prompt Caching 的原
source: 小林面试笔记
---

**题目**：KV Cache 是什么？Prompt Caching 的原理是什么？

**结论句（15 秒）**：我理解 KV Cache 和 Prompt Caching 是同一个机制在两个时间尺度上的应用

**追问方向**：结合项目经历举例 · 优缺点与适用场景

### 回答

KV Cache 和 Prompt Caching 是同一个机制在两个时间尺度上的应用。

**KV Cache——单次推理内优化。** 自回归生成时，每次新 token 都要对前面所有 token 算 attention，从零开始算总计算量 O(N³)。KV Cache 把前面 token 的 K、V 矩阵缓存在 GPU 显存，新 token 只算自己的 Q、K、V 再跟缓存做 attention，降到 O(N²)。没有 KV Cache，自回归生成基本不可行。

**Prompt Caching——跨请求优化。** 两个请求 Prompt 前缀相同（比如同样的 System Prompt），第一个请求算完的 KV Cache 在 API 服务器保留，第二个请求遇到相同前缀直接复用，只算新增部分。

**价值区别：** KV Cache 让自回归生成可行，是推理基本盘；Prompt Caching 降低 API 成本和延迟，是工程 ROI 优化。Claude 缓存读取价可低至普通输入 10%，OpenAI 等平台也有折扣，具体和命中率、前缀长度有关。理解了 KV Cache，Prompt Caching 几乎是自然推论。
