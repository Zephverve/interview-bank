---
title: "对话历史在图里怎么做裁剪（Message Trimming）？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 进阶]
point: "消息裁剪"
source: GitHub 100 Questions
---

**题目**：对话历史在图里怎么做裁剪（Message Trimming）？

**结论句（15 秒）**：专用 trim 节点在进 LLM 前按 token 预算保留 system+最近 k 轮+可选 summary。

**追问方向**：和 checkpoint 冲突吗？

### 回答

**优先级**：P1 · 2 篇

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

Message Trimming 是**控制 token 成本和上下文窗口的关键手段**，字节/阿里面经高频。

**实现方式：专用 trim 节点**
- 放在 agent/LLM 节点**之前**
- 估算 `state["messages"]` 的 token 数
- 超预算时：保留 system prompt + 最近 k 轮对话
- 旧消息处理：summarize 到 `state["summary"]` 或 RemoveMessage 删除

**Trim 策略**：
1. **保留 system**：第一条 system message 永远保留
2. **保留最近 k 轮**：用户+助手各 k 条
3. **摘要旧消息**：旧对话 LLM summarize 后写入 `state["summary"]`，generate 节点 template 注入
4. **RemoveMessage**：LangGraph 提供的消息删除机制，从 messages 列表移除指定消息

**和 checkpoint 的关系**：
- 裁剪后 checkpoint 存的是**裁剪后** state——这是有意的设计，控制 checkpoint 体积
- 如果需要完整历史，外置到 PostgreSQL/Redis，trim 节点只影响送进 LLM 的上下文

**和压缩节点串联**：先 compress（summarize 旧消息）→ 再 trim（按 token 硬截断），双保险。

