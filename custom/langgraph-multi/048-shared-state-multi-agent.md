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

**🗣️ 标准口语答案**

我先说结论，再展开原因。

这是字节 Agent 二面的经典原题：「能不能所有子 agent 共享工具和 state？」标准答法不是简单的「能」或「不能」，而是按协作紧密度分层设计。

State 层面：紧耦合协作（Supervisor 模式下的研究团队）应共享 messages 和 task_brief——所有人看同一份任务描述和对话历史，supervisor 才能做全局决策。但各 agent 应有私有 scratchpad channel——比如 coder_scratchpad、writer_scratchpad，用不同 prefix 隔离，避免 writer 覆盖 coder 的中间变量。松耦合协作（Handoff 模式）则只传 context_summary，不全量共享 messages。

工具层面：工具定义（schema、描述）可以共享只读——所有 agent 知道有哪些工具可用。但调用权限必须按角色授权——researcher 能调 search_web 但不能调 delete_database；coder 能调 execute_code 但不能调 send_email。这是安全边界，不是技术限制。

并发写冲突的解法和单图一样：并行 agent 写同一 state 字段必须配 reducer。messages 用 add_messages append-only；汇总结果用自定义 merge 函数。没 reducer 的后写覆盖前写，在多 agent 并行场景下同样会发生。

选型原则：协作越紧密，共享越多；协作越松散，隔离越多。面试时主动提「字节追问共享工具」的背景，说明考虑过权限和安全边界，是加分项。

