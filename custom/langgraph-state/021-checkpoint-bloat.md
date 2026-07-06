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

**📖 核心要点**
- 图内：最近几轮对话、未完成工具结果、路由标志
- 外置：用户偏好、海量历史、可检索知识
- 工程：TTL、只保留最近 N 个 checkpoint

**🗣️ 标准口语答案**

百度面经里这是区分工程深度的好题。checkpoint 膨胀是因为什么都往 state 塞，每个 super-step 都序列化全量快照。

划界原则：图内只留推进当前任务必需的——最近几轮 messages、pending 工具结果、路由标志位。跨会话用户偏好、海量对话历史、知识库内容进 PostgreSQL/向量库，用时检索回填 state，而不是无限堆积。

工程手段包括：checkpoint TTL；keep_latest 只保留每 thread 最近 N 个快照；里程碑裁剪——任务完成后压缩 state；多租户命名空间隔离 thread；敏感字段脱敏。说出来对方就知道你考虑过线上跑一年后的状态。

