---
title: "LangGraph 与 LangSmith 可观测性怎么集成？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 工程]
point: "可观测"
source: GitHub 100 Questions
---

**题目**：LangGraph 与 LangSmith 可观测性怎么集成？

**结论句（15 秒）**：设 LANGCHAIN_TRACING 环境变量自动 trace 每节点；可看轨迹、评测、对比 prompt 版本。

**追问方向**：不用 LangSmith 怎么自建？ · 成本数据从哪来？

### 回答

**优先级**：P1 · 2 篇

**📖 核心要点**
- 自动记录 node/LLM/tool span
- dataset 回归评测
- 反馈 bad run 到数据集

**🗣️ 标准口语答案**

LangSmith 和 LangGraph 同属生态，开 tracing 后每次 invoke 自动记录节点输入输出、LLM 调用、tool 延迟。用于 debug 走错哪条边、对比 prompt 版本、跑 dataset 回归。

不用 LangSmith 可 OpenTelemetry 自研：节点入口出口打 span，属性带 thread_id、node_name。成本从 LLM callback 聚合 token。

百度面经强调评测闭环——LangSmith 是把在线 trace 沉淀成离线评测集的桥梁。

