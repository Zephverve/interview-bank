---
title: "说说你们 AI Agent 项目 LangGraph 怎么搭的？"
round: 一面/二面
difficulty: ⭐⭐⭐⭐
tags: [LangGraph, 面经]
point: "项目架构"
source: 编程导航面经
---

**题目**：说说你们 AI Agent 项目 LangGraph 怎么搭的？

**结论句（15 秒）**：定义 state schema → 纯函数节点 → 条件边编排 → compile 注入 checkpointer → FastAPI 暴露 stream → LangSmith 监控。

**追问方向**：最强节点是哪个？ · 重构过什么？

### 回答

**优先级**：P0 · 2 篇面经

**📖 核心要点**
- 五步法可背诵
- 结合自己项目替换节点名
- 强调可测试和可恢复

**🗣️ 标准口语答案**

编程导航一面原题。我按五步法答：第一定义 AgentState，messages、intent、docs、retry_count 各字段 reducer 约定；第二每个能力一个纯函数节点，retrieve、grade、rewrite、generate、cite_check；第三条件边连接，grade 不过回 rewrite，cite 不过回 generate；第四 compile 绑 PostgresSaver 和 interrupt 审批点；第五 FastAPI astream 暴露 SSE，LangSmith 看节点 trace。

【替换点】说成你自己科研问答或简历项目：意图三路、质量门控、引用校验环。准备每节点一个 data point，比如 grade 阈值多少、rewrite 最多几次。

