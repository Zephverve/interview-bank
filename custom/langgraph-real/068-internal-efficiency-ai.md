---
title: "系统设计：内部提效系统怎么做 AI 改造？"
round: 二面
difficulty: ⭐⭐⭐⭐
tags: [LangGraph, 面经]
point: "系统设计"
source: 编程导航面经
---

**题目**：系统设计：内部提效系统怎么做 AI 改造？

**结论句（15 秒）**：拆功能点→每点 AI 实现方式→需求文档/方案生成 Agent→套 LangGraph 做审批流和工具编排。

**追问方向**：不熟悉业务系统怎么办？ · 如何分期落地？

### 回答

**优先级**：P1 · 1 篇面经

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

编程导航二面经典场景题，考察**系统设计思路**而非特定业务知识。

**第一步：拆功能点**（现场问清或合理假设）——例如内部项目管理系统：① 需求文档撰写 ② 会议纪要结构化 ③ 工单分类路由 ④ 进度报告生成 ⑤ 跨部门审批。

**第二步：每点说 AI 实现方式**——① LLM 生成 PRD 草稿 ② ASR+LLM 提取 action items ③ 意图分类模型路由工单 ④ RAG 拉历史数据生成周报 ⑤ 方案类操作需 HITL。

**第三步：LangGraph 承载**——State 字段：`task_type`、`draft`、`approval_status`、`tool_results`。拓扑：intent 分类 → 条件边到不同子图。写方案类：draft 节点 → interrupt 等审批 → publish 节点调内部 API。查数据类：tool 节点调 REST API → summarize 节点。

**分期落地**（体现工程成熟度）：Phase 1 单点高频场景用 Workflow 快速验证；Phase 2 需要审批/回溯/多分支上 LangGraph；Phase 3 建评测闭环 + bad case 回流。

**不熟悉系统的模板答法**：「我会先问三个问题——核心用户是谁、最高频的三个操作是什么、有没有审批节点——然后按上面的框架套，具体 tool schema 接入时再对齐。」

