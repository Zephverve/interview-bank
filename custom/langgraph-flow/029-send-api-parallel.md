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

**📖 核心要点**
- 动态决定并行任务数量
- 每个 Send 指定目标节点和输入
- 汇总靠 reducer 或下游 reduce 节点

**🗣️ 标准口语答案**

Send API 用于 map 阶段动态 fan-out。一个节点可以 return [Send("worker", {"item": x}) for x in items]，框架并行调度多个 worker 节点，各自处理子任务。

和写死多条并行边不同，Send 的任务数运行时决定，适合「一篇文档拆 N 段分别摘要」这类场景。结果合并靠 state reducer 或专门的 reduce 节点收集 worker 输出。

编程导航面经里「多路调用」可以结合 Send 讲——检索·工具·规则多路并行，汇总节点 merge。

