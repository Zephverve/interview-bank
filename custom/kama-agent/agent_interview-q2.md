---
title: 2. Agent 和 Workflow 有什么区别？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [Agent, 卡码笔记]
point: 2. Agent 和 Workflow 有什么区别？
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/agent_interview.html

> 来源文章：Agent大厂面试题汇总：ReAct、Function Calling、MCP、RAG高频问题

---

**题目**：2. Agent 和 Workflow 有什么区别？

**结论句（15 秒）**：面试官会追问：&quot;你说你用了 Agent，为什么不用 Workflow

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官会追问：&quot;你说你用了 Agent，为什么不用 Workflow？Workflow 在哪些场景更合适？&quot;或者&quot;如何判断一个任务该用 Agent 还是 Workflow？&quot;

 

### 核心区别：谁在控制流程？

 这两者最核心的分歧只有一点：Workflow 的控制权在代码手里，Agent 的控制权在 LLM 手里。

 

 

### Workflow 详解

 Workflow 就是把流程提前写死在代码里，LLM 只是其中某些节点的处理器。

 拿退款处理举例：接收申请 → LLM 提取信息 → 查询订单数据库 → LLM 判断是否符合政策 → 是则执行退款、否则生成拒绝邮件 → 发送通知。每个 if/else 分支、每个步骤的顺序，都是开发者预先定义的。 LLM 只是流程中的一个&quot;智能节点&quot;，它不决定下一步做什么。

 

### Agent 详解

 Agent 接收到目标，自主规划执行路径。

 同样拿退款举例：用户说&quot;处理这个退款&quot;，Agent 自己思考——&quot;我需要先了解申请内容&quot;，于是调用 read_ticket()；&quot;发现是高价值订单，需要查特殊政策&quot;，于是调用 search_policy_doc()；&quot;政策允许，但需要主管审批&quot;，于是调用 create_approval_request()。

 每一步都是 LLM 自己决定的，不在代码里写死。 这意味着同一个 Agent，面对不同的退款申请，可能会走完全不同的路径。

 

### 量化对比

 维度 Workflow Agent 控制者 代码/开发者 LLM Token 消耗 低（约1x） 高（约4-8x） 可预测性 高 低 灵活性 低 高 适合任务 固定流程 开放式目标 调试难度 容易 困难 典型场景 订单处理/报表 研究分析/客服 

### 实际生产中：混合架构最常见

 别把 Workflow 和 Agent 对立起来。大多数生产系统是 Workflow + Agent 的混合架构——Workflow 提供稳定骨架，Agent 负责处理异常和复杂情况。

 比如智能客服系统：简单问题走 Workflow 直接回答，复杂问题启动 Agent 自主分析决策，投诉工单直接升级人工。这样既保证了基础场景的稳定可控，又能在复杂场景发挥 Agent 的灵活性。

 面试答法：先说清楚 Workflow 和 Agent 的区别，再强调混合架构才是生产落地的正确姿势。能说出这个，面试官就知道你做过实际项目。