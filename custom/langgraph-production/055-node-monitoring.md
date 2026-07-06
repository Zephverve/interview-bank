---
title: "节点级监控怎么做？"
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 工程]
point: "监控"
source: 牛客 · 阿里淘天
---

**题目**：节点级监控怎么做？

**结论句（15 秒）**：trace_id 贯穿、每节点记录耗时/输入输出摘要/错误类型，LangSmith 或自研看板按 node 聚合。

**追问方向**：和整体 Agent 监控区别？ · 告警阈值怎么定？

### 回答

**优先级**：P0 · 2+ 篇面经

**🗣️ 标准口语答案**

上线 Agent 图时，我会把可观测性和失败路径放在和主流程同一优先级。

阿里淘天面经原题「如何做监控」，以及百度面经强调的评测闭环，都指向节点级可观测性。实现分三层：

trace 贯穿：每次 invoke 生成 trace_id 写入 config.configurable，所有节点和 LLM/tool 调用共享同一 trace_id。用户投诉或告警触发时，用 trace_id 拉完整执行轨迹。

节点 span 记录：每个节点入口/出口打 span（LangSmith 自动记录，或 OpenTelemetry 自研），属性包含：node_name、duration_ms、state 关键字段摘要（如 intent 值、retrieval_docs 数量，不是全量 state）、是否异常、attempt 次数（重试场景）、token 消耗。LangSmith 按图结构自动展示节点拓扑和耗时瀑布图；自研方案导出 Prometheus 指标，Grafana 按 node 聚合。

和整体 Agent 监控的核心区别：端到端只知道「回答超时 30s」，节点级能定位「retrieve_node P99 25s、generate_node P99 3s」——问题在检索不在生成。这是生产排障的关键能力。

告警阈值：单节点失败率环比突增（如今日 5% vs 昨日 1%）；P99 延迟超 SLA；token 消耗突增（可能 prompt 膨胀或死循环）；attempt 次数异常（重试风暴）。告警触发后自动采样 bad case 入库离线评测集，形成监控→评测→改进闭环。

