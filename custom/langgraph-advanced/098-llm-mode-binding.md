---
title: "LangGraph 能否实现确定性 Workflow 而非 Agent？"
round: 一面
difficulty: ⭐⭐
tags: [LangGraph, 进阶]
point: "Workflow 模式"
source: Agent 架构 15 问
---

**题目**：LangGraph 能否实现确定性 Workflow 而非 Agent？

**结论句（15 秒）**：可以，全部用普通边固定路由、条件边用规则函数不调 LLM，就是确定性 Workflow，仍享受 checkpoint 能力。

**追问方向**：和 Airflow 区别？

### 回答

**优先级**：P1 · 2 篇

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

这道题考察**对 LangGraph 定位的理解**——它不只是 Agent 框架，也是 Workflow 引擎。

**确定性 Workflow 实现**：
- 全部用 `add_edge` 固定跳转（A → B → C → D）
- 条件边路由函数读 state 标量做 if-else，**不调 LLM**
```python
def route_by_status(state):
    if state["status"] == "approved":
        return "publish"
    elif state["status"] == "rejected":
        return "notify_rejection"
    return "wait"
```
- 部分节点调 LLM（如 generate 步骤），部分节点是纯函数（如 format、send_email）

**仍享受 LangGraph 能力**：
- checkpoint：步骤间断点续跑
- interrupt：HITL 审批
- stream：逐步推送进度
- 子图：模块化

**和 Airflow 的区别**：

| | LangGraph | Airflow |
|---|---|---|
| 定位 | 含 LLM 步骤的 AI 流水线 | 通用数据 ETL 调度 |
| 重量 | 轻，嵌入式 | 重，独立调度系统 |
| LLM 集成 | 原生 | 需要额外包装 |
| 适合 | retrieve→LLM→format | 大数据 ETL、定时批处理 |

**实际用法**：很多团队用 LangGraph 管「含 LLM 步骤」的工作流（如内容审核：上传→LLM 审核→人工审批→发布），纯数据 ETL 仍用 Airflow。

