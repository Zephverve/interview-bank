---
title: "Graceful Degradation 优雅降级怎么实现？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 进阶]
point: "降级"
source: GitHub 100 Questions
---

**题目**：Graceful Degradation 优雅降级怎么实现？

**结论句（15 秒）**：主路径失败条件边走备用模型/简化检索/模板回答，保证用户总有结构化响应。

**追问方向**：和 fallback 区别？

### 回答

**优先级**：P2 · 1 篇

**📖 核心要点**
- 多级降级链
- LLM 失败换小模型
- 检索失败换关键词搜索

**🗣️ 标准口语答案**

降级是分级：首选 GPT-4o+向量检索；超时走 GPT-4o-mini+缓存；再失败走模板回复+人工入口。条件边实现多级路由，每级是不同节点链。

fallback 是终极出口；degradation 是沿途有备用方案。state 记 degradation_level 供监控统计各级占比。

