---
title: "图版本管理与回滚怎么做？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 进阶]
point: "版本管理"
source: GitHub 100 Questions
---

**题目**：图版本管理与回滚怎么做？

**结论句（15 秒）**：graph_version 绑编译实例；新 thread 用新版；旧 thread 用旧版 finish；shadow mode 对比新旧轨迹。

**追问方向**：schema 版本一起管吗？

### 回答

**优先级**：P2 · 1 篇

**📖 核心要点**
- 多实例共存
- 路由层选版本
- 回滚=切流量+停新 thread

**🗣️ 标准口语答案**

部署多 graph 实例 v1 v2，config 或 header 带 graph_version 路由。新会话用 v2，进行中的 v1 thread 用 v1 实例 finish，避免 mid-flight 迁移。

Shadow mode：同输入跑 v2 不返回用户，对比 trace 和答案。回滚是流量切回 v1+停开 v2 thread。schema 版本跟 graph 版本一起走。

