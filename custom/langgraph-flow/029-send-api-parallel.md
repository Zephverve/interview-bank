---
title: "Send API 如何实现并行执行？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 控制流]
point: "并行"
source: GitHub Interview Questions
---

**题目**：Send API 如何实现并行执行？

**结论句（15 秒）**：节点返回多个 Send(target, arg) 实现 dynamic fan-out，各 worker 并行跑，结果经 reducer 合并。

**追问方向**：和静态并行边区别？ · 结果冲突怎么处理？

### 回答

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

Send API 解决的是「运行时才知道要并行几份」的问题。一个节点 return [Send("worker", {"item": x}) for x in items]，框架会并行调度多个 worker 节点各自处理。和写死多条并行边不同，任务数量是动态的。结果合并靠 state 上的 reducer 或专门的 reduce 节点汇总。适合批量文档摘要、多源并行检索这类 Map 场景。

#### 📖 面试展开（详细版）

**是什么**：Send 是 LangGraph 的动态 fan-out 原语。节点可以返回一个或多个 Send 对象，每个指定目标节点名称和传入的 state 片段，框架在同一 super-step 并行调度这些 worker。

**为什么需要**：静态并行边要求提前知道分支数量；实际业务里「一篇文档拆几段」「几个数据源并行查」都是运行时决定的，Send 正好解决这个问题。

**怎么用**：splitter 节点读取 items 列表，return [Send("worker", {"chunk": c}) for c in chunks]。worker 节点处理单个 chunk 写回 state。reduce 节点或 reducer 合并所有 worker 输出。

**和静态并行区别**：静态用 add_edge 从同一源节点连多个目标，每次都跑所有分支；Send 动态决定跑几个、每个带什么参数。

**结果冲突**：并行写同一 state 字段必须配 reducer（如 list append 或自定义 merge）。否则后写的覆盖先写的，丢数据。

**项目例子**：编程导航面经里的「多路调用」——检索、工具、规则引擎三路 Send 并行，汇总节点 merge 后交给 generate。

#### 💡 核心要点
- 动态决定并行任务数量
- 每个 Send 指定目标节点和输入
- 汇总靠 reducer 或下游 reduce 节点

#### 📝 代码/配置示例

```python
from langgraph.types import Send

def fan_out(state):
    return [Send("worker", {"chunk": c}) for c in state["chunks"]]

def worker(state):
    summary = summarize(state["chunk"])
    return {"summaries": [summary]}  # reducer 追加

graph.add_node("split", fan_out)
graph.add_node("worker", worker)
graph.add_node("reduce", merge_summaries)
graph.add_conditional_edges("split", fan_out)
```

#### 🔁 追问怎么接

**「和静态并行边区别？」**——静态分支数固定、每次都跑；Send 运行时决定数量和参数。举例「文档段数不固定」。

**「结果冲突怎么处理？」**——state 字段配 Annotated reducer；worker 返回 partial update 由框架合并；reduce 节点做最终汇总。
