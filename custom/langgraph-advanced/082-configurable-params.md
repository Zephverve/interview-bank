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

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

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

