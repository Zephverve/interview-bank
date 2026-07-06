---
title: "LangGraph 如何实现 Human-in-the-loop？"
round: 一面/二面
difficulty: ⭐⭐⭐⭐
tags: [LangGraph, HITL]
point: "HITL"
source: CSDN + 百度 + GitHub
---

**题目**：LangGraph 如何实现 Human-in-the-loop？

**结论句（15 秒）**：checkpointer + interrupt_before/after 或 interrupt() 挂起，人工审批后 Command/stream(None) 恢复，可用 update_state 纠偏。

**追问方向**：审批拒绝怎么走？ · 外部副作用幂等？

### 回答

**优先级**：P0 · 3+ 篇面经

**📖 核心要点**
- interrupt 是生产级 Agent 分水岭
- interrupt_before 防高危操作
- update_state 可改 state 或强制跳转

**🗣️ 标准口语答案**

HITL 靠 checkpointer 存快照 + interrupt 挂起。编译时 interrupt_before=["execute"] 或节点内 interrupt({...}) 暂停，把控制权交还应用层，前端展示中间结果等人操作。

人工批准后 stream(None, config) 或 Command(resume=...) 继续；也可 update_state 改错 SQL 再恢复。interrupt_before 是防患于未然，interrupt_after 是审阅打回。

百度面经会追问：恢复时 pending 边是否重跑、发邮件扣款有没有幂等键。这是区分玩具和生产的分水岭。

