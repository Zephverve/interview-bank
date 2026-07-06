---
title: "Supervisor 模式怎么实现？"
round: 二面
difficulty: ⭐⭐⭐⭐
tags: [LangGraph, 多Agent]
point: "Supervisor"
source: GitHub Premium Questions
---

**题目**：Supervisor 模式怎么实现？

**结论句（15 秒）**：中央 supervisor 节点用 LLM 选下一 worker，条件边路由，worker 完成后回 supervisor 形成星型拓扑。

**追问方向**：supervisor 本身会不会成为瓶颈？ · 死循环怎么防？

### 回答

**优先级**：P1 · 3+ 篇

**📖 核心要点**
- members 列表 + route 函数
- worker 只改自己负责的 state 区
- supervisor 看汇总结果决策

**🗣️ 标准口语答案**

实现步骤：定义含 messages 和 next_agent 的 state；supervisor 节点 prompt「根据当前任务选下一专家」，返回 next 字段；add_conditional_edges 从 supervisor 映射到各 worker；每个 worker 边回 supervisor。

星型拓扑：supervisor 居中，researcher/coder/writer 是辐条。防死循环靠 supervisor prompt 约束「完成则返回 FINISH」和 step_count 上限。

可用 langgraph-supervisor 预构建或手写，面试手写路由逻辑更能体现理解。

