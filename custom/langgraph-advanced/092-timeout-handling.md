---
title: "超时处理（Timeout Handling）怎么做？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 进阶]
point: "超时"
source: GitHub 100 Questions
---

**题目**：超时处理（Timeout Handling）怎么做？

**结论句（15 秒）**：asyncio.wait_for 包节点调用；超时写 state 走 fallback；端到端 SLA 在 API 层 cancel task。

**追问方向**：cancel 后 checkpoint 状态？

### 回答

**优先级**：P2 · 1 篇

**📖 核心要点**
- 节点级超时
- 图级 SLA watchdog
- 超时后 checkpoint 可恢复

**🗣️ 标准口语答案**

节点内 asyncio.wait_for(llm.ainvoke(...), timeout=30)，超时捕获写 timeout_error 进 state，条件边 fallback。图级 API 设总 SLA，超时 cancel asyncio task，checkpoint 留最后完成步可续。

告诉用户「处理超时，可继续等待或简化问题」比 504 裸错误好。

