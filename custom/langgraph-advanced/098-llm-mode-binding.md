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

**📖 核心要点**
- 固定边=工作流
- 条件边可纯规则
- checkpoint 是优势

**🗣️ 标准口语答案**

可以。全部 add_edge 固定跳转，条件边路由函数读 state 标量做 if-else 不调 LLM，就是确定性 Workflow，仍有 checkpoint、stream、HITL。

和 Airflow 比：LangGraph 更轻、和 LLM 节点混排自然，适合 AI 流水线；重 ETL 还是 Airflow。很多团队用 LangGraph 管「含 LLM 步骤」的工作流，纯数据用传统调度。

