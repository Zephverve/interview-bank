---
title: "State Reduction（状态归约）模式怎么理解？"
round: 一面
difficulty: ⭐⭐
tags: [LangGraph, 状态]
point: "归约模式"
source: GitHub Interview Questions
---

**题目**：State Reduction（状态归约）模式怎么理解？

**结论句（15 秒）**：多个节点 partial update 通过 reducer 归约为新 state；是 LangGraph 并行一致性的核心机制。

**追问方向**：和 Map-Reduce 关系？ · 默认覆盖行为何时够用？

### 回答

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

State Reduction 是框架把多个节点返回的 partial update 合并成新 state 的过程。每个 channel 可以绑定不同 reducer：messages 追加、计数器累加、dict 合并、标量覆盖。同一 super-step 里多个节点跑完，输出按 reducer 归约一次，再进入下一 super-step。这和 Map-Reduce 思想类似——map 阶段并行产出，reduce 阶段合并。默认 last-write-wins 只适合单写者字段如 current_step。

#### 📖 面试展开（详细版）

**① 是什么**

State Reduction = 在一个 super-step 结束时，将该 step 内所有节点 partial update 按各 channel 的 reducer 合并，得到 S_{t+1}。是 BSP（Bulk Synchronous Parallel）模型的归约阶段。

**② 为什么重要**

理解 Reduction 才能解释并行执行的一致性保证，也是 Send API / Map-Reduce 模式的基础概念。

**③ 怎么用 / 执行流程**

super-step 开始 → 就绪节点并行执行 → 各返回 partial update → 按 channel reducer 归约 → super-step 结束 → 下一 super-step。每个 channel 独立 reducer，互不影响。

**④ 项目例子（EvoAgent Map-Reduce）**

map：Send API 向 10 篇 paper 各发 Send("analyze", {"paper_id": id})。reduce：analyze 节点返回 {"findings": [summary]}，findings channel 用 operator.add 归约成完整列表，再进 synthesize_node。

**⑤ 常见坑**

以为归约是全局一个函数（实际 per-channel）；忽略归约顺序对非交换 reducer 的影响；默认覆盖用于多写者字段。

#### 💡 核心要点
- 每个 channel 可有独立 reducer
- 无 Annotated 时默认 last-write-wins
- 并行 super-step 结束后统一归约

#### 📝 代码/配置示例

```python
# 每个 channel 独立 reducer
class State(TypedDict):
    messages: Annotated[list, add_messages]      # 追加
    findings: Annotated[list, operator.add]       # 追加
    step: str                                      # 覆盖（单写者）
    score: Annotated[float, max]                   # 取 max
```

#### 🔁 追问怎么接

- 「和 Map-Reduce」：Send fan-out = map，reducer 合并 = reduce
- 「默认覆盖何时够」：单写者标量如 current_step、status
- 「归约时机」：super-step 结束后统一归约，非逐节点
