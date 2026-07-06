---
title: "Send API 如何实现并行执行？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 控制流]
point: "并行"
source: GitHub Interview Questions
---

**题目**：Send API 如何实现并行执行？

**结论句（15 秒）**：节点返回多个 Send(target, arg) 实现 dynamic fan-out，各 worker 并行跑，结果经 reducer 合并。

**追问方向**：和静态并行边区别？ · 结果冲突怎么处理？

### 回答

**优先级**：P1 · 2 篇

**🗣️ 标准口语答案**

Send API 用于动态 fan-out：一个节点可以返回多个 Send 对象，每个指向不同 worker 节点并行处理，结果通过 reducer 合并回 state。适合批量文档处理、多源检索等场景。Map-Reduce 模式就是 map 阶段 Send 分发，reduce 阶段汇总。

