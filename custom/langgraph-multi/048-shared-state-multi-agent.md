---
title: "多 Agent 之间共享 state 还是隔离？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 多Agent]
point: "共享状态"
source: 字节 Agent 二面
---

**题目**：多 Agent 之间共享 state 还是隔离？

**结论句（15 秒）**：紧协作共享 messages/任务板；松耦合用 handoff 摘要或独立 channel；绝不无脑共享全部工具权限。

**追问方向**：为什么字节追问共享工具？ · 冲突怎么解？

### 回答

**优先级**：P1 · 2 篇面经

**📖 核心要点**
- 共享：统一任务描述、汇总结果
- 隔离：各 agent 私有 scratchpad
- 工具按角色授权

**🗣️ 标准口语答案**

字节原题「能不能所有子 agent 共享工具」。我答：工具定义可共享只读 schema，但调用权限按角色分——researcher 不能调 delete_database。

State 上：messages 和 task_brief 共享；各 agent 可有私有 scratchpad channel 用不同 prefix，避免 writer 改 coder 的中间变量。紧耦合协作共享多，松耦合 handoff 传摘要。

并行写同一 channel 必须 reducer，否则和单图并发踩坑一样。

