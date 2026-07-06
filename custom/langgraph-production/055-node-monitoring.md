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

**📖 核心要点**
- OpenTelemetry/LangSmith span per node
- 记录 attempt 次数
- 失败率突增告警

**🗣️ 标准口语答案**

阿里问「如何做监控」。我答：每次 invoke 生成 trace_id 写 config，每个节点入口打 span：node_name、duration_ms、state 关键字段摘要、是否异常。LangSmith 自动按图结构展示，或导出 Prometheus 指标。

和整体监控区别：节点级能定位是检索慢还是生成慢，而不是只知道端到端超时。告警看单节点失败率环比、P99 延迟、token 突增。

百度面经也强调评测闭环——监控要和离线集联动，线上 bad case 自动入库。

