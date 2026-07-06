---
title: "多租户 Agent 怎么设计？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 进阶]
point: "多租户"
source: GitHub 100 Questions
---

**题目**：多租户 Agent 怎么设计？

**结论句（15 秒）**：thread_id 含 tenant_id；checkpointer 表分区；configurable 注入租户配置和工具权限。

**追问方向**：数据隔离怎么做？

### 回答

**优先级**：P2 · 1 篇

**📖 核心要点**
- 命名空间隔离 checkpoint
- 租户级 rate limit 和模型
- 向量库 metadata filter

**🗣️ 标准口语答案**

thread_id 设计为 tenant/user/task 组合，checkpointer 按 tenant 分区存储。configurable 传 tenant_config：可用工具列表、模型、prompt 变体。

检索节点加 metadata filter tenant_id。防止 tenant A 的 thread 加载 tenant B 数据靠网关层校验 config。

