---
title: "并行节点执行（Parallel Node Execution）怎么实现？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 进阶]
point: "并行执行"
source: GitHub 100 Questions
---

**题目**：并行节点执行（Parallel Node Execution）怎么实现？

**结论句（15 秒）**：同一 super-step 多个无依赖节点自动并行；或 Send API fan-out；结果靠 reducer 合并。

**追问方向**：异步 ainvoke 注意什么？

### 回答

**优先级**：P1 · 2 篇

**📖 核心要点**
- add_edge 扇出到多节点
- super-step 同步点
- ainvoke 提升 IO 密集

**🗣️ 标准口语答案**

两种并行：静态——从同一前驱 add_edge 到多个后继，框架在同一 super-step 并行跑；动态——Send API 按运行时数据 fan-out。

并行后必须 reducer 合并写同一 channel 的结果。IO 密集节点用 async 定义，图用 ainvoke。注意并行不是无脑越多越好，LLM 并发受 rate limit 约束。

