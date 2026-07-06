---
title: "条件边和普通边的区别？"
round: 一面
difficulty: ⭐⭐
tags: [LangGraph, 控制流]
point: "边类型"
source: GitHub + CSDN
---

**题目**：条件边和普通边的区别？

**结论句（15 秒）**：普通边固定跳转；条件边每次执行路由函数，根据 state 动态选下一节点，是 Agent 决策核心。

**追问方向**：路由函数能调 LLM 吗？ · 多条件映射怎么写？

### 回答

**优先级**：P0 · 3+ 篇

**🗣️ 标准口语答案**

我会先把定位说清楚：

**普通边（add_edge）**：确定性跳转，源节点执行完必然进入目标节点。适合固定流水线，如 retrieve → generate → format。

**条件边（add_conditional_edges）**：动态路由，签名是 add_conditional_edges(source, path_fn, mapping)。path_fn 接收 state，返回字符串 key；框架查 mapping 找下一节点。可以映射到 END 结束执行。

**为什么 Agent 离不开条件边**：Agent 的「决策」本质是「根据当前状态选择下一步行动」。有没有 tool_calls、检索分数够不够、用户意图是查询还是投诉——这些都是运行时才能知道的，必须用条件边。

**路由函数能调 LLM 吗**：可以，但建议把 LLM 分类逻辑拆成独立 router 节点，条件边只做简单查表。这样 router 节点可单独测试，路由函数保持纯函数。

**多条件映射**：mapping 里定义多个出口，如 {"retry": "retrieve", "fallback": "fallback", "continue": "generate", END: END}。path_fn 返回对应 key。

**踩坑**：在路由函数里写副作用（发请求、改数据库）；路由函数过于复杂难以测试；mapping 漏了 path_fn 可能返回的 key 导致运行时错误。

