---
title: "configurable 参数怎么传到节点？"
round: 二面
difficulty: ⭐⭐
tags: [LangGraph, 进阶]
point: "配置"
source: GitHub 100 Questions
---

**题目**：configurable 参数怎么传到节点？

**结论句（15 秒）**：invoke 时 config.configurable 传 model_name、temperature 等，节点第二参数 config 读取，支持 A/B 和租户差异。

**追问方向**：和 state 区别？

### 回答

**优先级**：P2 · 1 篇

#### 🗣️ 先用大白话说

**一句话**：configurable 是「本次运行的配置」——模型名、温度、租户 ID——通过 invoke 传入，节点从 config 参数读取，不进 checkpoint。

**打个比方**：state 是病人的病历（要存档），configurable 是今天用哪个科室的医生（临时指定，不需要写进病历）。

#### 📖 面试展开（详细版）

configurable 是 LangGraph **运行时配置的标准机制**，考察对 state vs config 划界的理解。

**用法**：
```python
result = graph.invoke(
    input_state,
    config={"configurable": {"model": "gpt-4o", "tenant": "acme", "temperature": 0.7}}
)
```

**节点读取**：
```python
def llm_node(state, config):
    model_name = config["configurable"]["model"]
    llm = get_llm(model_name)
    return {"messages": [llm.invoke(state["messages"])]}
```

**典型场景**：
- **A/B 测试**：同一图，config 传不同 model/prompt 版本，对比效果
- **租户差异**：tenant A 用 GPT-4o，tenant B 用 GPT-4o-mini
- **特性开关**：`config["configurable"]["enable_rerank"]` 控制是否走 rerank 节点

**和 state 的核心区别**：
| | state | configurable |
|---|---|---|
| 持久化 | 进 checkpoint | 不进 checkpoint |
| 生命周期 | 跨 step 演化 | 单次 invoke |
| 内容 | 业务数据 | 运行参数 |
| 用途 | 任务推进 | 模型路由/特性开关 |

**最佳实践**：configurable 放「运行环境参数」，state 放「业务数据」；不要把 model_name 写进 state，否则 checkpoint 会污染历史。

#### 💡 核心要点
- 不进 checkpoint 的运行配置
- 节点 (state, config) 签名
- 适合模型路由和特性开关

#### 📝 代码/配置示例

```python
def llm_node(state, config):
    cfg = config.get("configurable", {})
    model = cfg.get("model", "gpt-4o-mini")
    llm = ChatOpenAI(model=model, temperature=cfg.get("temperature", 0))
    return {"messages": [llm.invoke(state["messages"])]}

# 调用
graph.invoke(state, config={"configurable": {"model": "gpt-4o", "tenant": "acme"}})
```

#### 🔁 追问怎么接

- **「和 state 区别？」** → state 是业务数据、跨 step 持久化、进 checkpoint；configurable 是运行参数、单次 invoke、不进 checkpoint；model_name/tenant_id 放 configurable，query/docs 放 state。
