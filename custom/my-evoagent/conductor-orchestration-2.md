---
title: Conductor 和 RAG 系统怎么联动？
round: 二面
difficulty: ⭐⭐
tags: [evoagent, 面试]
point: Conductor 和 RAG 系统怎么联动？
---

**题目**：Conductor 和 RAG 系统怎么联动？

### 回答

"SubAgent 有一个 `search` 工具，可以直接调科研问答的 API。简单文献问题 Conductor 可以直接路由到 RAG 短链路，复杂多工具任务才走 EvoAgent 全循环 —— 这是我刻意的设计，**不是所有请求都值得走重链路**。"
