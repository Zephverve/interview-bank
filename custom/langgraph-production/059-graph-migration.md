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

**📖 核心要点**
- 新增 channel 可选
- checkpoint 与 schema 版本绑定
- 不可兼容时冻结旧 thread

**🗣️ 标准口语答案**

ModelEngine 社区题：图变更可能让旧 checkpoint 与新 schema 失配。做法：新增字段给默认值，节点读字段用 .get()；删字段要有迁移脚本把旧 checkpoint 洗一遍；严重不兼容时旧 thread 只允许只读或强制归档，新 thread 用新图。

灰度：graph_version 写 config，路由层选编译实例。LangGraph 文档有 graph migration 指引，面试提到版本化说明考虑过运维。

