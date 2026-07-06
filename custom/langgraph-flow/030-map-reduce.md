---
title: "LangGraph 里 Map-Reduce 工作流怎么实现？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 控制流]
point: "Map-Reduce"
source: GitHub 100 Questions
---

**题目**：LangGraph 里 Map-Reduce 工作流怎么实现？

**结论句（15 秒）**：Map 阶段 Send fan-out 到 worker 节点，Reduce 阶段汇总节点合并结果进 state。

**追问方向**：部分 worker 失败怎么办？ · 适合什么业务？

### 回答

**优先级**：P1 · 2 篇

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

**Map 阶段**：splitter 节点将输入拆分为子任务列表，通过 Send API fan-out 到 worker 节点。每个 worker 独立处理一个子任务，写回 state 的对应字段（需 reducer 合并）。

**Reduce 阶段**：专门的 reduce 节点读取所有 worker 输出，做合并——文本拼接、结构化聚合、或再调 LLM 生成综合摘要。

**部分失败处理**：worker 节点 catch 异常，返回 {"results": [{"status": "error", "chunk_id": id}]} 而非抛异常。reduce 节点统计成功率，低于阈值走 fallback 或重试失败的 chunk。

**适合什么业务**：批量文档入库摘要、多源并行检索（向量库+关键词+知识图谱）、大规模 eval 跑批、长文档分段翻译。

**和 Hadoop Map-Reduce 对比**：思想一致（分而治之再汇总），但粒度是 Agent 节点而非机器节点，调度由 LangGraph runtime 管理。

**踩坑**：worker 抛异常导致整图失败；reduce 节点等所有 worker 但某个永远不回；合并时 token 超限要分段 reduce。

