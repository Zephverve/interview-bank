---
title: 了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [Agent, 小林笔记]
point: 了解哪些其他的 Agent 设计范式？Agent 和 Wor
source: 小林面试笔记
---

**题目**：了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什么？

**结论句（15 秒）**：我理解 Agent 和 Workflow 最核心的区别是「谁来决定下一步」

**追问方向**：结合项目经历举例 · 优缺点与适用场景

### 回答

我理解 Agent 和 Workflow 最核心的区别是「谁来决定下一步」。Workflow 是我提前把流程写死的，每一步怎么走都是固定的，确定性高、好控制；Agent 是让 LLM 自己决定下一步做什么，灵活但不可控。

常见的设计范式除了纯 Agent 之外，还有 ReAct、Plan-and-Execute、Reflection 这几种。

我在实际工程里用得最多的反而是把两者混用，固定流程的部分用 Workflow，需要灵活决策的节点嵌入 Agent 能力，这样既保住了整体可控，又有局部的灵活性。
