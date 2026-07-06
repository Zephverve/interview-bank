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

#### 🗣️ 先用大白话说

**一句话**：优雅降级是「主路径不行走备用路径，备用还不行走兜底」——用户总能拿到结构化响应，不是 500 错误。

**打个比方**：像GPS导航——首选高速（GPT-4o+向量检索），高速堵了走国道（mini+缓存），国道也堵了给你文字指引（模板回复），总比说「找不到路」强。

#### 📖 面试展开（详细版）

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

#### 💡 核心要点
- 多级降级链
- LLM 失败换小模型
- 检索失败换关键词搜索

#### 📝 代码/配置示例

```python
def route_after_primary(state):
    if state.get("llm_timeout"):
        return "degraded_llm"
    if state.get("retrieval_empty"):
        return "keyword_fallback"
    return END

# 监控
state["degradation_level"] = 0  # primary
state["degradation_level"] = 1  # degraded_llm
state["degradation_level"] = 2  # keyword_fallback
```

#### 🔁 追问怎么接

- **「和 fallback 区别？」** → degradation 是沿途多级备用（质量逐步降但仍有价值）；fallback 是终极出口（模板/人工）；degradation 是「尽量服务」，fallback 是「不服务了但给个交代」。
