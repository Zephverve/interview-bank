---
title: "如何处理并发节点写同一 state 字段？"
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 状态]
point: "并发冲突"
source: 阿里国际面经
---

**题目**：如何处理并发节点写同一 state 字段？

**结论句（15 秒）**：为字段配置 reducer 做合并写；或拆 channel 避免并行写同一 key；绝不做无保护的覆盖写。

**追问方向**：怎么发现覆盖问题？ · Send 并行后怎么 reduce？

### 回答

**优先级**：P0 · 4+ 篇面经

#### 🗣️ 先用大白话说

这是 LangGraph 最高频踩坑。两个并行节点写同一字段，默认后者覆盖前者，完全没有警告。解法优先级：第一，给字段配 reducer 改成合并写；第二，重构图让并行分支写不同 key，在下游汇总节点 merge；第三，Send API fan-out 后由 reducer 聚合。阿里国际面经说「判断字段是否被别的节点改过」——工程上更靠谱的是从设计上消灭并发写同一无 reducer 字段，而不是运行时检测。

#### 📖 面试展开（详细版）

**① 是什么**

同一 super-step 内多个节点就绪并行执行，各自返回 partial update。写同一 channel 且无 reducer 时，last-write-wins，先写数据丢失。

**② 为什么重要**

阿里国际面经原题，区分「跑通 demo」和「理解并行语义」。Send API 普及后这题频率还在上升。

**③ 怎么用 / 三种解法**

解法一：Annotated + reducer（列表 append、dict merge、计数累加）。解法二：并行分支写不同 key（docs_source_a、docs_source_b），下游 aggregate_node 合并。解法三：Send fan-out + reducer 聚合 Map-Reduce 结果。

**④ 项目例子**

EvoAgent 多源检索：PubMed 和 arXiv 并行 retrieve，各写 retrieval_docs（operator.add 合并）。若写同一 current_source 标量无 reducer，后完成的源覆盖先完成的，路由逻辑出错。

**⑤ 常见坑**

运行时检测「字段是否被改过」而非设计消除；dict reducer 浅合并；Send 结果未配 reducer。

#### 💡 核心要点
- 列表用 add / add_messages 追加
- 字典用自定义 merge
- 并行分支写不同 key 再汇总节点合并

#### 📝 代码/配置示例

```python
# 解法一：reducer 合并
class State(TypedDict):
    docs: Annotated[list, operator.add]

# 解法二：不同 key + 汇总节点
class State(TypedDict):
    docs_a: list
    docs_b: list

def aggregate(state) -> dict:
    return {"all_docs": state["docs_a"] + state["docs_b"]}
```

#### 🔁 追问怎么接

- 「怎么发现」：stream 观察每步 state；LangSmith trace 看并行 super-step
- 「Send 后 reduce」：worker 返回同 channel，父图 reducer 聚合
- 「能否运行时检测」：不推荐，设计消除并发写无 reducer 字段
