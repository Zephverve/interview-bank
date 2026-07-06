---
title: "上下文感知记忆压缩（Context-Aware Memory Compression）？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 进阶]
point: "记忆压缩"
source: GitHub 100 Questions
---

**题目**：上下文感知记忆压缩（Context-Aware Memory Compression）？

**结论句（15 秒）**：按当前任务意图选择性保留相关历史，无关轮次压缩进 summary 或归档外置记忆。

**追问方向**：和字节动态长期记忆？

### 回答

**优先级**：P2 · 1 篇

#### 🗣️ 先用大白话说

**一句话**：不是无脑删旧消息，而是根据当前意图选择性保留相关历史——聊订单保留订单轮次，闲聊压缩掉。

**打个比方**：像整理笔记本——不是把旧页全撕了，而是当前写数学就只留数学相关页，语文笔记归档到文件夹。

#### 📖 面试展开（详细版）

上下文感知记忆压缩是**比简单 trim 更智能的策略**，字节面经长期记忆考点。

**核心思想**：不是按时间截断（「保留最近 k 轮」），而是按**相关性**选择性保留。

**实现方式**：
1. **compress 节点**读取 `current_intent`（当前任务意图）
2. 遍历历史 messages，计算每条与 current_intent 的相关性
3. 相关的保留，无关的 summarize 到 `state["summary"]` 或归档
4. intent 变化时（从「查订单」切到「写报告」）触发重新压缩

**示例**：
- 当前 intent = 「查询订单 12345 状态」
- 保留：涉及订单 12345 的对话轮次
- 压缩：之前聊天气、问公司地址的轮次 → summarize

**长期记忆外置**：
- 压缩后的摘要 + 关键事实 → 写入 mem0 / PostgreSQL / 向量库
- retrieve 节点按 current_intent 回填相关记忆
- 图内 state 只留当前任务必需的上下文

**和字节动态长期记忆的关系**：
- 字节考点：动态召回 + 选择性保留 + 沉淀机制
- LangGraph 实现：compress 节点（选择性压缩）+ retrieve 节点（按意图回填）+ 外置存储（长期记忆）
- 图内管「当前任务上下文」，图外管「跨会话记忆」

#### 💡 核心要点
- intent 变化触发重摘要
- 相关轮次保留
- 外置 mem0/向量存长期

#### 📝 代码/配置示例

```python
def compress_node(state):
    intent = state["current_intent"]
    relevant, irrelevant = [], []
    for msg in state["messages"]:
        if is_relevant(msg, intent):
            relevant.append(msg)
        else:
            irrelevant.append(msg)
    summary = llm.invoke(f"摘要以下对话：{irrelevant}")
    return {"messages": relevant, "archived_summary": summary}
```

#### 🔁 追问怎么接

- **「和字节动态长期记忆？」** → 同一思想：compress 节点按 intent 选择性压缩 + retrieve 节点按 intent 回填 + 外置 mem0/Postgres 存长期记忆；字节考动态召回，LangGraph 考节点实现。
