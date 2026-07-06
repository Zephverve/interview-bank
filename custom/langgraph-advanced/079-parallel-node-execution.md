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

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

并行执行是 LangGraph **性能优化的关键手段**，考察对 super-step 模型的理解。

**方式一：静态并行（fan-out）**
- 从同一前驱 `add_edge` 到多个无依赖的后继节点
- 框架在同一 super-step 自动并行执行这些节点
- 例如：retrieve 完成后同时跑 `grade_node` 和 `summarize_node`

**方式二：动态并行（Send API）**
- 一个节点返回多个 `Send` 对象，每个指向不同 worker 节点
- 适合批量处理：10 个文档 → 10 个 Send → 10 个 embed worker 并行
- Map-Reduce 模式：map 阶段 Send 分发，reduce 阶段汇总

**reducer 合并**：并行节点如果写同一 state channel（如 `results[]`），必须配 reducer（如 `operator.add`）合并，否则后执行的覆盖先执行的。

**super-step 同步点**：同一 super-step 的所有并行节点完成后，才进入下一个 super-step。这是 LangGraph 的 BSP（Bulk Synchronous Parallel）模型。

**注意事项**：IO 密集节点用 async def + ainvoke；LLM 并发受 rate limit 约束，不是无脑越多越好；并行节点的 state 写入冲突靠 reducer 解决。

