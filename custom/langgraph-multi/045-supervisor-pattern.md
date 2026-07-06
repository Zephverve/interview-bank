---
title: "Supervisor 模式怎么实现？"
round: 二面
difficulty: ⭐⭐⭐⭐
tags: [LangGraph, 多Agent]
point: "Supervisor"
source: GitHub Premium Questions
---

**题目**：Supervisor 模式怎么实现？

**结论句（15 秒）**：中央 supervisor 节点用 LLM 选下一 worker，条件边路由，worker 完成后回 supervisor 形成星型拓扑。

**追问方向**：supervisor 本身会不会成为瓶颈？ · 死循环怎么防？

### 回答

**优先级**：P1 · 3+ 篇

#### 🗣️ 先用大白话说

**一句话**：Supervisor 就是「包工头」——中央节点看全局进度，决定下一棒派哪个专家，专家干完回来汇报，包工头再派下一棒，直到收工。

**打个比方**：像项目经理站白板中间，左边研究员、右边工程师、对面文案——PM 看完进度说「今天先做调研」，调研完回 PM 说「数据齐了」，PM 再说「工程师写代码」。

#### 📖 面试展开（详细版）

Supervisor 模式是 LangGraph 多 Agent 里最经典、面试最高频的拓扑。实现分四步：第一，定义 TeamState，至少包含 messages（对话历史）和 next（路由字段）；第二，写 supervisor 节点——读当前 state，用 LLM prompt 列出可选成员（researcher/coder/writer/FINISH），返回 next 字段；第三，用 add_conditional_edges 从 supervisor 按 next 值映射到各 worker 或 END；第四，每个 worker 执行完通过固定边回到 supervisor，形成星型闭环。

拓扑结构是「星型」：supervisor 居中做唯一调度决策点，所有 worker 是辐条，没有 worker 之间直接通信——信息都经 supervisor 汇总。好处是控制流清晰、易 debug；代价是 supervisor 本身可能成为瓶颈（所有决策都过它）和延迟来源（多一轮 LLM 调用）。

防死循环三道防线：prompt 里明确约束「任务完成必须返回 FINISH」；state 里维护 step_count，supervisor 每次 +1，超过阈值强制 FINISH；compile 时设 recursion_limit 作为框架级兜底。worker 节点应只改自己负责的 state 区域——researcher 写 retrieval_docs，coder 写 code_draft，避免互相覆盖。

LangGraph 生态有 langgraph-supervisor 预构建库可快速搭建，但面试手写路由逻辑更能体现理解——重点讲清 state 字段、条件边映射、以及 worker 回边的设计。

#### 💡 核心要点
- members 列表 + route 函数
- worker 只改自己负责的 state 区
- supervisor 看汇总结果决策

#### 📝 代码/配置示例

```python
def route_supervisor(state: TeamState) -> str:
    return state["next"]  # "researcher" | "coder" | "writer" | "FINISH"

builder.add_conditional_edges("supervisor", route_supervisor, {
    "researcher": "researcher",
    "coder": "coder",
    "writer": "writer",
    "FINISH": END,
})
for worker in ["researcher", "coder", "writer"]:
    builder.add_edge(worker, "supervisor")
```

#### 🔁 追问怎么接

- **supervisor 瓶颈**：承认存在，用 step_count 限制轮次、worker 自报告完成状态、复杂任务拆子图降低 supervisor 决策频率
- **死循环怎么防**：prompt 约束 FINISH + step_count 计数 + recursion_limit 框架兜底
- **加分项**：对比 langgraph-supervisor 预构建 vs 手写，说明手写更能控制路由逻辑
