---
title: "LangGraph 踩过什么坑？"
round: 一面
difficulty: ⭐⭐⭐
tags: [LangGraph, 工程]
point: "踩坑"
source: 牛客 · 某大厂/阿里国际
---

**题目**：LangGraph 踩过什么坑？

**结论句（15 秒）**：高频坑：并发覆盖 state、没配 reducer、死循环、每请求 compile、checkpoint 膨胀、条件路由不稳定。

**追问方向**：怎么监控发现？ · 哪个坑印象最深？

### 回答

**优先级**：P0 · 4+ 篇面经

**🗣️ 标准口语答案**

我踩过最疼的一个坑是状态管理。LangGraph 里每个节点都能读写共享 state，但有些节点是并发执行的。有一次两个节点同时修改 state 里同一个字段，后执行的直接把先执行的覆盖了，完全没有警告。后来我们给列表类字段配了 Annotated reducer，比如 messages 用 add_messages，从「覆盖写」改成「合并写」。

第二个坑是死循环。ReAct Agent 如果工具一直返回空结果，模型可能无限重试。我们加了 recursion_limit 和自定义的 should_continue 条件，超过 N 轮就路由到 fallback 节点。

第三个坑是生产环境重复编译图。compile 应该在应用启动时做一次，全局单例复用，而不是每个请求都 compile，否则延迟会很高。

第四个坑和 checkpoint 有关：一开始什么都往 state 里塞，导致 checkpoint 体积膨胀、恢复变慢。后来我们把跨会话的历史和知识库检索结果外置，图里只留当前任务推进必需的状态。【替换点：换成你真实踩过的坑】

