---
title: "子图（Subgraph）怎么用？"
round: 二面
difficulty: ⭐⭐⭐⭐
tags: [LangGraph, 多Agent]
point: "子图"
source: GitHub + 编程导航面经
---

**题目**：子图（Subgraph）怎么用？

**结论句（15 秒）**：子 StateGraph compile 后作为父图节点，可映射父子 state 字段，实现模块化和大工作流拆分。

**追问方向**：父子 state 怎么映射？ · 嵌套层级建议几层？

### 回答

**优先级**：P1 · 2 篇

**📖 核心要点**
- 子图独立测试部署
- 父图通过节点包装 invoke 子图
- 适合 RAG 子流程、审批子流程

**🗣️ 标准口语答案**

子图是把完整 StateGraph compile 后当父图一个 node。父节点函数里 invoke 子图，做 state 字段映射——父的 query 映射到子图输入，子图输出映射回父的 retrieval_result。

价值是模块化：RAG 流水线、代码审查环各自子图，团队分工维护。编程导航面经场景设计题可套「大工作流拆子图」。

嵌套建议不超过 2-3 层，否则 debug 困难。每层子图要有清晰输入输出契约。

