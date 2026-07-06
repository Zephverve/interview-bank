---
title: "compile 编译图的作用是什么？"
round: 一面
difficulty: ⭐⭐
tags: [LangGraph, 基础]
point: "编译机制"
source: 官方 Graph API
---

**题目**：compile 编译图的作用是什么？

**结论句（15 秒）**：compile 做结构校验、注入 checkpointer/interrupt 配置，产出可复用的 Runnable；生产环境应全局单例编译，不要每请求 compile。

**追问方向**：编译后能改图吗？ · 图迁移怎么做？

### 回答

**优先级**：P1 · 2 篇

**📖 核心要点**
- 检查图结构合法性（无孤立节点等）
- 注入 checkpointer、interrupt_before/after
- 编译一次全局复用，避免每请求开销

**🗣️ 标准口语答案**

compile 是把图定义变成可运行实例的步骤。它会做基本结构检查，比如有没有 unreachable 节点，然后在编译参数里绑定 checkpointer、interrupt 点、recursion_limit 等运行时配置。

编译后得到的是 LangChain Runnable，可以 invoke、stream、batch。生产实践里图应该在应用启动时 compile 一次，全局单例复用。每来一个 HTTP 请求就 compile 是常见性能坑，延迟会明显上去。

图定义变更后，启用 checkpointer 的 thread 可能需要迁移策略——state schema 向后兼容、新增字段给默认值、灰度期间新旧图并行。

