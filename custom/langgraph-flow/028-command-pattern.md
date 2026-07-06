---
title: "Command 模式是什么？resume 怎么用？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 控制流]
point: "Command"
source: GitHub + LangGraph 1.0
---

**题目**：Command 模式是什么？resume 怎么用？

**结论句（15 秒）**：Command 用于 interrupt 后恢复执行，可携带人工输入或强制跳转节点，替代旧 breakpoint API。

**追问方向**：和 update_state 区别？ · 拒绝审批后走哪？

### 回答

**优先级**：P1 · 2 篇

**📖 核心要点**
- interrupt 挂起后 stream(Command(resume=...))
- 可指定 goto 跳转
- LangGraph 1.0 一等公民 API

**🗣️ 标准口语答案**

Command 是 LangGraph 1.0 里控制执行流的 primitive，尤其用于 HITL。interrupt 挂起后，恢复时不是简单 invoke(None)，可以用 Command(resume=value) 把人工输入带回图里，或 Command(goto="node_name") 强制跳转。

和 update_state 区别：update_state 改 checkpoint 里的 state 快照；Command 还表达「从哪继续、往哪走」的执行意图。审批拒绝可以 resume 带 reject 标志，条件边路由到 apology 节点。

面试提到 Command 说明跟过 1.0 变化，不是只背 interrupt_before 老 API。

