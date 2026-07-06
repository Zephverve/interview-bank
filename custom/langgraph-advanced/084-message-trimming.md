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

#### 🗣️ 先用大白话说

**一句话**：在 agent 节点前加 trim 节点，按 token 预算保留 system + 最近 k 轮，旧的 summarize 或删除，控制送进 LLM 的上下文大小。

**打个比方**：像整理桌面——只留当前任务需要的文件（最近 k 轮），旧文件归档到文件夹（summary 字段）或扔掉（RemoveMessage）。

#### 📖 面试展开（详细版）

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

#### 💡 核心要点
- trim 作为独立节点
- RemoveMessage 删旧消息
- 摘要进 state.summary 字段

#### 📝 代码/配置示例

```python
def trim_node(state):
    messages = state["messages"]
    token_count = count_tokens(messages)
    if token_count <= MAX_TOKENS:
        return {}
    # 保留 system + 最近 k 轮
    trimmed = [messages[0]] + messages[-(K_ROUNDS * 2):]
    return {"messages": trimmed, "trimmed": True}

builder.add_edge("trim", "agent")  # trim 在 agent 前
```

#### 🔁 追问怎么接

- **「和 checkpoint 冲突吗？」** → 不冲突，裁剪后 checkpoint 存裁剪后的 state 是有意设计；完整历史外置存储，trim 只影响送进 LLM 的上下文；resume 时从裁剪后的 state 继续，不会恢复已删消息。
