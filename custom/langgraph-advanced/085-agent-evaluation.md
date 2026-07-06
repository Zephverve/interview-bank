---
title: "LangGraph Agent 怎么做评测（Evaluation）？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 进阶]
point: "评测"
source: GitHub 100 Questions
---

**题目**：LangGraph Agent 怎么做评测（Evaluation）？

**结论句（15 秒）**：LangSmith dataset 跑批量 invoke，断言最终答案和中间轨迹（经过哪些节点）；节点级指标单独评。

**追问方向**：非确定性怎么评？

### 回答

**优先级**：P1 · 2 篇

**📖 核心要点**
- 端到端+轨迹断言
- 节点级黄金输入输出
- 回归 CI 夜间跑

**🗣️ 标准口语答案**

评测分两级。端到端：黄金问题集 batch invoke，比最终答案和 citation 格式；高级断言期望轨迹包含 grade→rewrite 等节点序列。节点级：单独测 intent 分类准确率、retrieve recall。

LangSmith experiment 记录每版图变化。非确定性用 LLM-as-judge 或结构匹配。和百度面经评测闭环结合答更完整。

