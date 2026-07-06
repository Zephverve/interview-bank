---
title: "LangGraph 里 Map-Reduce 工作流怎么实现？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 控制流]
point: "Map-Reduce"
source: GitHub 100 Questions
---

**题目**：LangGraph 里 Map-Reduce 工作流怎么实现？

**结论句（15 秒）**：Map 阶段 Send fan-out 到 worker 节点，Reduce 阶段汇总节点合并结果进 state。

**追问方向**：部分 worker 失败怎么办？ · 适合什么业务？

### 回答

**优先级**：P1 · 2 篇

**📖 核心要点**
- fan-out → 并行 worker → fan-in
- 失败 worker 结果标 error 仍进 reduce
- 适合批量文档/多源检索

**🗣️ 标准口语答案**

Map-Reduce 在 LangGraph 里就是 Send + reducer。splitter 节点把任务拆成 N 份，Send 到 worker 节点并行处理，reduce 节点读 state 里各 worker 结果做合并——可以是拼接摘要、投票、或再调 LLM 综合。

部分失败时 worker 返回 error 标志，reduce 节点决定跳过或重试，不要一颗老鼠屎坏整锅。适合批量入库、多源检索、大规模 eval 等可并行化任务。

和 Hadoop Map-Reduce 思想一致，但粒度是 Agent 节点而非机器节点。

