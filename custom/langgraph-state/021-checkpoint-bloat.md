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

#### 🗣️ 先用大白话说

百度面经区分工程深度的好题。checkpoint 膨胀是因为什么都往 state 塞，每个 super-step 都序列化全量快照。划界原则：图内只留推进当前任务必需的——最近几轮 messages、pending 工具结果、路由标志。跨会话用户偏好、海量历史、知识库内容进 PostgreSQL/向量库，用时检索回填。工程手段：checkpoint TTL、keep_latest 只保留最近 N 个快照、里程碑裁剪、多租户隔离 thread、敏感字段脱敏。

#### 📖 面试展开（详细版）

**① 是什么**

checkpoint 是每个 super-step 后的 state 快照，存于 checkpointer（Memory/SQLite/Postgres）。膨胀 = 单 snapshot 过大 × checkpoint 数量过多，导致存储贵、恢复慢。

**② 为什么重要**

百度 Agent 面经 P0，区分「调过 API」和「考虑过线上跑一年」。主动讲治理策略是二面加分项。

**③ 怎么用 / 划界原则**

图内 state：最近 K 轮 messages、未完成 tool results、路由/审批标志位、当前任务 ID。外置记忆：用户偏好、全量对话历史、知识库内容、大文档。回填模式：用时从外置存储检索，写入 state 临时字段，任务完成后清空。

**④ 项目例子（EvoAgent）**

用户 6 个月对话历史放 PostgreSQL，图内只留当前 thread 最近 10 轮 messages。知识库永远不进 state，rag_node 检索结果存 chunk_id 摘要，generate 后清空 retrieval_docs。checkpoint 配 TTL 30 天 + keep_latest 20。

**⑤ 常见坑**

全量历史进 state；每个 super-step 都存不裁剪；thread_id 无租户隔离；敏感数据未脱敏进 checkpoint。

#### 💡 核心要点
- 图内：最近几轮对话、未完成工具结果、路由标志
- 外置：用户偏好、海量历史、可检索知识
- 工程：TTL、只保留最近 N 个 checkpoint

#### 📝 代码/配置示例

```python
# 任务完成后压缩 state
def cleanup_node(state) -> dict:
    return {
        "retrieval_docs": [],  # 清空临时字段
        "messages": trim_messages(state["messages"], max=10),
    }

# checkpointer 配置 TTL（Postgres 示例）
# DELETE FROM checkpoints WHERE created_at < NOW() - INTERVAL '30 days'
```

#### 🔁 追问怎么接

- 「thread_id 租户隔离」：命名空间 prefix tenant_id + user_id
- 「keep_latest」：每 thread 只保留最近 N 个 snapshot
- 「interrupt 与膨胀」：挂起时 state 也要精简，避免挂起态 snapshot 过大
