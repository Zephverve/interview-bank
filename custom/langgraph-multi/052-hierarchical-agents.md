---
title: "层级多 Agent 团队（Hierarchical）怎么设计？"
round: 二面
difficulty: ⭐⭐⭐⭐
tags: [LangGraph, 多Agent]
point: "层级架构"
source: GitHub 100 Questions
---

**题目**：层级多 Agent 团队（Hierarchical）怎么设计？

**结论句（15 秒）**：顶层 supervisor 分大任务，中层组长管专业组，底层 worker 执行；用嵌套子图表达层级。

**追问方向**：和扁平 Supervisor 取舍？ · 通信开销？

### 回答

**优先级**：P2 · 1 篇

**📖 核心要点**
- 三层：总控→组长→执行者
- 每层是子图
- state 逐级汇总

**🗣️ 标准口语答案**

层级模式适合大组织仿真：CEO supervisor 拆战略任务给部门 supervisor，部门再分给研究员/工程师。LangGraph 实现用嵌套子图——父图节点 invoke 子图 supervisor，子图内部再路由 worker。

和扁平 Supervisor 比：层级降低顶层 prompt 复杂度，但增加延迟和 state 传递损耗。选型看任务是否自然分层——软件开发常扁平三角色就够，企业流程仿真才要层级。

