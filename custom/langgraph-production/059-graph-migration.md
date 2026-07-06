---
title: "图定义变更后旧 thread 怎么办？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 工程]
point: "迁移"
source: ModelEngine + GitHub
---

**题目**：图定义变更后旧 thread 怎么办？

**结论句（15 秒）**：state schema 向后兼容；新字段默认值；删字段写迁移；灰度期间按 thread 版本路由到对应图。

**追问方向**：会不会毒化既有 thread？ · 官方迁移指引？

### 回答

**优先级**：P1 · 2 篇

**🗣️ 标准口语答案**

LangGraph 支持在启用 checkpointer 时迁移图定义。关键是 state schema 向后兼容——新增字段给默认值，删除字段要有迁移脚本。生产上建议版本化图定义，灰度期间新旧图并行，按 thread_id 路由到对应版本。

