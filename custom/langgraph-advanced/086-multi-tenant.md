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

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

多租户设计是**B 端 Agent 产品的必答题**，考察数据隔离和配置隔离。

**Layer 1：thread_id 命名空间**
- 格式：`{tenant_id}/{user_id}/{task_id}`
- 保证 tenant A 的 thread 不会加载 tenant B 的 checkpoint
- 网关层校验：请求里的 tenant_id 和用户身份匹配

**Layer 2：checkpointer 分区**
- Postgres checkpointer 按 tenant_id 分区或加 tenant_id 列
- 查询 thread 列表时 WHERE tenant_id = ?
- TTL 策略可以 tenant 级别不同（免费 tenant 7 天，付费 90 天）

**Layer 3：configurable 注入租户配置**
```python
config = {"configurable": {
    "tenant_id": "acme",
    "allowed_tools": ["search", "summarize"],  # 不含 delete
    "model": "gpt-4o-mini",  # 免费 tenant 用小模型
    "prompt_variant": "acme_v2",
}}
```

**数据隔离**：
- 向量库：检索节点加 `metadata filter: tenant_id = acme`
- 业务 DB：所有查询带 tenant_id WHERE 条件
- 工具权限：tenant A 不能调 tenant B 的内部 API

**租户级 rate limit 和模型**：免费 tenant 限 10 req/day + mini 模型；付费 tenant 1000 req/day + 4o 模型。

