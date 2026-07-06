---
title: "checkpoint 膨胀怎么防止？图内 state 和外置记忆怎么划界？"
round: 二面
difficulty: ⭐⭐⭐⭐
tags: [LangGraph, 状态]
point: "checkpoint 治理"
source: 牛客 · 百度 Agent
sourceUrl: https://www.nowcoder.com/discuss/880841659733311488
---

**题目**：checkpoint 膨胀怎么防止？图内 state 和外置记忆怎么划界？

**结论句（15 秒）**：图内只留当前任务必需字段；历史/知识/偏好进外部库；配 TTL、里程碑裁剪、敏感字段脱敏。

**追问方向**：thread_id 和租户隔离？ · keep_latest 策略了解吗？

### 回答

**优先级**：P0 · 3+ 篇面经

**🗣️ 标准口语答案**

我会从 checkpoint 解决什么问题讲起。

checkpoint 是每个 super-step 后的 state 快照，存于 checkpointer（Memory/SQLite/Postgres）。膨胀 = 单 snapshot 过大 × checkpoint 数量过多，导致存储贵、恢复慢。

百度 Agent 面经 P0，区分「调过 API」和「考虑过线上跑一年」。主动讲治理策略是二面加分项。

图内 state：最近 K 轮 messages、未完成 tool results、路由/审批标志位、当前任务 ID。外置记忆：用户偏好、全量对话历史、知识库内容、大文档。回填模式：用时从外置存储检索，写入 state 临时字段，任务完成后清空。

用户 6 个月对话历史放 PostgreSQL，图内只留当前 thread 最近 10 轮 messages。知识库永远不进 state，rag_node 检索结果存 chunk_id 摘要，generate 后清空 retrieval_docs。checkpoint 配 TTL 30 天 + keep_latest 20。

全量历史进 state；每个 super-step 都存不裁剪；thread_id 无租户隔离；敏感数据未脱敏进 checkpoint。

