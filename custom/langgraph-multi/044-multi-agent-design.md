---
title: "如何用 LangGraph 实现多 Agent 系统？"
round: 二面
difficulty: ⭐⭐⭐⭐
tags: [LangGraph, 多Agent]
point: "多 Agent"
source: GitHub + 字节面经
---

**题目**：如何用 LangGraph 实现多 Agent 系统？

**结论句（15 秒）**：常见模式：Supervisor 路由、层级子图、Handoff；共享 state 或隔离 state 取决于协作紧密度。

**追问方向**：所有 agent 共享工具吗？ · 和单 Agent 多 tool 区别？

### 回答

**优先级**：P1 · 3+ 篇

**📖 核心要点**
- Supervisor 决定下一 worker
- 子图作节点模块化
- 通信靠 state channel 或 message

**🗣️ 标准口语答案**

多 Agent 在 LangGraph 里仍是图，只是节点换成不同角色的 agent。最常见 Supervisor 模式：supervisor 节点读 state，LLM 决定下一棒 researcher/coder/writer，worker 完回 supervisor 直到 done。

复杂系统用子图——每个 agent 是独立 StateGraph compile 后塞进父图当节点。字节二面追问「子 agent 能否共享工具」——我答工具定义可共享，但 state 命名空间隔离，避免互相污染消息历史。

和单 Agent 多 tool 区别：多 Agent 是不同 prompt/模型/权限的角色分工，适合任务阶段差异大；单 Agent 多 tool 适合统一大脑调不同 API。

