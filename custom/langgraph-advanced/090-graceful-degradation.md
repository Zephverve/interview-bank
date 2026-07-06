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

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

优雅降级考察**生产环境的容错设计**——用户感知到的是「慢/简/缺」，不是「挂了」。

**多级降级链**（条件边实现）：

**Level 0（主路径）**：GPT-4o + 向量检索 + 完整 RAG 链
↓ 超时/失败
**Level 1（降级 1）**：GPT-4o-mini + 缓存命中（之前问过类似问题）
↓ 失败
**Level 2（降级 2）**：GPT-4o-mini + 关键词搜索（不用向量）
↓ 失败
**Level 3（兜底）**：模板回复 + 人工入口（「暂时无法回答，请转人工客服」）

**实现方式**：
```python
def route_by_health(state):
    if state.get("llm_timeout"):
        return "degraded_llm"  # Level 1
    if state.get("retrieval_empty"):
        return "keyword_search"  # Level 2
    return "primary_path"
```

**和 fallback 的区别**：
- **Degradation**：沿途有备用方案，质量逐步降低但仍有价值
- **Fallback**：终极出口，通常是无 LLM 的模板/人工

**监控**：`state["degradation_level"]` 记录当前级别，统计各级占比——如果 Level 2/3 占比 > 10%，说明主路径有问题需要修。

