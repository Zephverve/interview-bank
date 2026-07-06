---
title: "为什么生产环境不能每个请求都 compile 图？"
round: 二面
difficulty: ⭐⭐
tags: [LangGraph, 工程]
point: "性能"
source: CSDN 工程实践
---

**题目**：为什么生产环境不能每个请求都 compile 图？

**结论句（15 秒）**：compile 有结构检查和对象构建开销，应应用启动时一次，请求只 invoke 已编译实例。

**追问方向**：热更新图怎么做？ · 多版本图共存？

### 回答

**优先级**：P1 · 2 篇

**📖 核心要点**
- compile 在 startup 事件
- 请求路径零 compile
- 版本变更灰度新 graph 实例

**🗣️ 标准口语答案**

compile 会做图验证、绑定 checkpointer、构建内部执行计划，毫秒到秒级开销。每请求 compile 在 QPS 高时 CPU 浪费明显，P99 延迟也抖。

正确做法： lifespan 里 compile 存 app.state.graph，路由里直接 invoke。热更新可以加载 graph_v2 实例，按 header 或 tenant 路由到不同版本，旧 thread 用旧图 finish。

