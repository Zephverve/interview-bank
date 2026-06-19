---
title: 9. Agent 的记忆系统怎么设计？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [Agent, 卡码笔记]
point: 9. Agent 的记忆系统怎么设计？
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/agent_interview.html

> 来源文章：Agent大厂面试题汇总：ReAct、Function Calling、MCP、RAG高频问题

---

**题目**：9. Agent 的记忆系统怎么设计？

**结论句（15 秒）**：面试官会问：&quot;Agent 怎么实现跨会话记忆

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官会问：&quot;Agent 怎么实现跨会话记忆？&quot;以及&quot;RAG 是 Agent 记忆的一部分吗？&quot;还有&quot;记忆太多放不下上下文窗口怎么办？&quot;

 

### 记忆的两种层次

 

 Agent 的记忆分为两大层：

 上下文窗口（In-Context Memory）——速度最快的短期记忆，存当前对话、任务状态、加载的 Skill、工具调用历史、检索到的长期记忆。但容量有限（通常 128K tokens），超出窗口需压缩或归档。

 外部记忆（External Memory）——分三类：

 存储类型 存什么 特点 例子 向量数据库 用户偏好、历史经验 语义检索，模糊匹配 用户说喜欢吃辣 → 向量化存储，下次推荐餐厅时检索到 关系数据库 结构化事实、用户档案 精确查询，不走语义检索 用户的订单号、账号信息 KV 存储（Redis） 任务状态、中间结果 极快读写，会话级别 当前任务执行到第几步、上一步工具调用的结果 

### 记忆压缩策略

 上下文快满的时候怎么办？三种策略：

 - 滑动窗口——丢弃最旧的消息，保留最近 N 条
 - 摘要压缩——用 LLM 把旧对话总结成一段话，大幅缩减 Token
 - 重要性过滤——只保留关键信息（用户指令、重要结论），丢弃过程细节
 压缩后归档到外部记忆，下次需要时再检索回来。

 class AgentMemory:

    def __init__(self):
        self.working_memory = []      # 当前上下文
        self.vector_store = VectorDB()  # 长期语义记忆
        self.kv_store = Redis()          # 结构化状态

    def add_message(self, message):
        self.working_memory.append(message)

        if self.token_count() &gt; MAX_TOKENS * 0.8:
            self._compress()

    def _compress(self):
        old_messages = self.working_memory[:-20]
        summary = llm.summarize(old_messages)

        self.vector_store.add(summary)
        self.working_memory = [summary_msg] + self.working_memory[-20:]

    def recall(self, query):
        relevant = self.vector_store.search(query, top_k=5)
        return relevant
 1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23

### 记忆的读写时机

 写入记忆：任务完成后保存结果和关键发现、用户提供个人信息时保存偏好、发现新知识时更新知识库、出错了保存失败原因避免重蹈覆辙。

 读取记忆：任务开始时加载用户偏好和历史背景、遇到陌生问题时检索相关历史经验、需要事实核查时检索已知信息。