---
title: "prompt 结合是怎么做的？"
round: 一面
difficulty: ⭐⭐⭐
tags: [LangGraph, 面经]
point: "Prompt"
source: 牛客 · 阿里淘天
---

**题目**：prompt 结合是怎么做的？

**结论句（15 秒）**：静态 system prompt 管角色边界，动态 prompt 节点按 state 注入检索结果/工具输出/用户上下文，分节点拆分而非一个巨型 prompt。

**追问方向**：和 LangGraph 节点关系？ · 怎么防 prompt 漂移？

### 回答

**优先级**：P1 · 1 篇面经

**📖 核心要点**
- 每节点独立 prompt 模板
- state 字段填充动态段
- 版本化+A/B

**🗣️ 标准口语答案**

阿里淘天原题。在 LangGraph 里 prompt 结合是分机节点：system 段静态放角色和格式约束；动态段从 state 注入——retrieve 节点后 generate 节点 template 填 docs，tool 节点后填 tool_results。

不是一个 5000 字巨型 prompt，而是每个 node 只拿当前步需要的上下文，省 token 也利 debug。版本化存 Git，改 retrieve 的 prompt 不影响 generate。

和图的关系：节点即 prompt 边界，换节点就换 prompt 策略，比 Chain 里一个大 PromptTemplate 清晰。

