---
title: "成本感知路由（Cost-Aware Routing）怎么实现？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 进阶]
point: "成本"
source: GitHub 100 Questions
---

**题目**：成本感知路由（Cost-Aware Routing）怎么实现？

**结论句（15 秒）**：router 节点根据任务复杂度选模型：简单走 mini，复杂走 4o；state 累计 token 超预算降级。

**追问方向**：字节问百万 token 成本怎么答？

### 回答

**优先级**：P2 · 1 篇

#### 🗣️ 先用大白话说

**一句话**：成本感知路由 = 简单问题用小模型，复杂问题用大模型，超预算强制降级——在 router 节点做决策。

**打个比方**：像打车——短途走路/骑车（mini），长途打专车（4o），月预算花完了就只能走路（模板回复）。

#### 📖 面试展开（详细版）

成本感知路由考察**商业意识和工程优化能力**，字节面经百万 token 成本是经典题。

**实现方式**：

**Step 1：入口 router 判断复杂度**
```python
def router_node(state):
    query = state["query"]
    complexity = classify_complexity(query)  # simple / complex
    return {"complexity": complexity}
```
- 简单：FAQ、格式化、翻译 → GPT-4o-mini
- 复杂：推理、代码生成、多步分析 → GPT-4o
- 判断依据：intent 分类 + query 长度 + 关键词

**Step 2：条件边路由到不同 LLM 节点**
```python
def route_by_complexity(state):
    return "llm_4o" if state["complexity"] == "complex" else "llm_mini"
```

**Step 3：token 预算控制**
- `state["token_spent"]` 累计消耗
- 超 budget → 后续节点强制 mini 或模板回复
- configurable 注入 budget 上限（按 tenant 不同）

**字节百万 token 成本题**：
- 估算：1000 行代码 ≈ 3000 token × $0.03/1K = $0.09/次
- 100 万次/天 = $90K/天 → 优化方向：
  1. 压缩（trim/compress 减 input token）
  2. 缓存（相同 query 命中缓存）
  3. 小模型路由（80% 简单 query 走 mini，成本降 10x）

**监控**：每 tenant 日 token 消耗、模型分布、成本/请求比。

#### 💡 核心要点
- intent+长度估计复杂度
- configurable 模型名
- token_budget 写 state

#### 📝 代码/配置示例

```python
def router_node(state):
    complexity = "complex" if len(state["query"]) > 200 else "simple"
    return {"complexity": complexity, "token_spent": 0}

def route_by_cost(state):
    if state["token_spent"] > TOKEN_BUDGET:
        return "template_fallback"
    return "llm_4o" if state["complexity"] == "complex" else "llm_mini"
```

#### 🔁 追问怎么接

- **「字节问百万 token 成本怎么答？」** → 估算 token 数 × 单价 × 调用量；优化三板斧：压缩（减 input）、缓存（命中重复 query）、小模型路由（80% 简单 query 走 mini）；给出具体数字显得有商业意识。
