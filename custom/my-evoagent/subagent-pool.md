---
title: SubagentPool 的作用是什么？
round: 二面
difficulty: ⭐⭐
tags: [evoagent, 面试]
point: SubagentPool 的作用是什么？
---

**题目**：SubagentPool 的作用是什么？

### 回答

三个作用：**隔离、并发控制、生命周期管理**。

"每个 SubAgent 是**独立 `GenericAgent` 实例加独立线程**，这意味着**独立的上下文和独立的 `working`**。这是子任务不会污染主 Agent 上下文的根本原因 —— 不是靠 Prompt 约束，是物理隔离。"

并发控制是指池子设上限，防止一次拉起太多 SubAgent 打爆 API 限流。生命周期管理负责异常回收（卡死、超时、崩溃时清理资源）。
