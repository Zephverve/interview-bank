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

#### 🗣️ 先用大白话说

**一句话**：不熟悉具体系统没关系——先拆功能点，每个点说 AI 怎么辅助，再用 LangGraph 套审批流和工具编排，面试官看的是思路不是业务细节。

**打个比方**：像给陌生公司做 IT 咨询——不需要用过他们的 ERP，但要能问清「谁填什么表单、谁审批、数据从哪来」，然后画一张改造蓝图。

#### 📖 面试展开（详细版）

编程导航二面经典场景题，考察**系统设计思路**而非特定业务知识。

**第一步：拆功能点**（现场问清或合理假设）——例如内部项目管理系统：① 需求文档撰写 ② 会议纪要结构化 ③ 工单分类路由 ④ 进度报告生成 ⑤ 跨部门审批。

**第二步：每点说 AI 实现方式**——① LLM 生成 PRD 草稿 ② ASR+LLM 提取 action items ③ 意图分类模型路由工单 ④ RAG 拉历史数据生成周报 ⑤ 方案类操作需 HITL。

**第三步：LangGraph 承载**——State 字段：`task_type`、`draft`、`approval_status`、`tool_results`。拓扑：intent 分类 → 条件边到不同子图。写方案类：draft 节点 → interrupt 等审批 → publish 节点调内部 API。查数据类：tool 节点调 REST API → summarize 节点。

**分期落地**（体现工程成熟度）：Phase 1 单点高频场景用 Workflow 快速验证；Phase 2 需要审批/回溯/多分支上 LangGraph；Phase 3 建评测闭环 + bad case 回流。

**不熟悉系统的模板答法**：「我会先问三个问题——核心用户是谁、最高频的三个操作是什么、有没有审批节点——然后按上面的框架套，具体 tool schema 接入时再对齐。」

#### 💡 核心要点
- 先拆功能点再谈模型
- HITL 审批写方案类操作
- 模板化应对不熟悉系统

#### 📝 代码/配置示例

```python
class TaskState(TypedDict):
    task_type: str
    draft: str
    approval_status: str  # pending | approved | rejected

builder.add_node("draft", generate_draft)
builder.add_node("publish", publish_to_internal_api)
builder.add_edge("draft", "publish")  # interrupt_before=["publish"]

graph = builder.compile(
    checkpointer=PostgresSaver(...),
    interrupt_before=["publish"],
)
```

#### 🔁 追问怎么接

- **「不熟悉业务系统怎么办？」** → 主动问三个问题（用户/高频操作/审批节点），用通用模板套；强调 tool 层 adapter 隔离业务细节，图编排层不依赖具体系统。
- **「如何分期落地？」** → Phase 1 Workflow MVP 验证价值 → Phase 2 LangGraph 加 HITL/回溯 → Phase 3 评测闭环；每阶段有明确退出指标（成功率/人工介入率）。
