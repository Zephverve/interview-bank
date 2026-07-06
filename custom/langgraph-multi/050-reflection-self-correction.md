---
title: "Reflection / Self-Correction 反思循环怎么实现？"
round: 二面
difficulty: ⭐⭐⭐⭐
tags: [LangGraph, 多Agent]
point: "反思"
source: GitHub Premium Questions
---

**题目**：Reflection / Self-Correction 反思循环怎么实现？

**结论句（15 秒）**：generate 节点产出 → critic 节点评审 → 条件边不满意则回 generate，满意则 END；类似 Reflexion 架构。

**追问方向**：反思会不会无限循环？ · critic 用什么模型？

### 回答

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

**一句话**：AI 写完先别交卷——让另一个「评审员」看一遍，不行就打回去重写，满意了才输出。LangGraph 用回边把这个「写→审→改」循环画成图。

**打个比方**：像论文导师改学生草稿——学生写一版，导师批注，学生按批注改，改到导师点头为止，最多改三轮。

#### 📖 面试展开（详细版）

Reflection / Self-Correction 是 LangGraph 中实现「生成→评审→改进」闭环的经典模式，对应 Reflexion 论文架构。核心是两个节点 + 一条回边：generator（draft_node）和 critic（reflect_node）。

generator 节点：读 state 里的任务描述和（如有）上一轮 critique，生成初稿或改进稿，写入 state.draft 或 state.answer。

critic 节点：读 generator 产出，用独立 prompt 或更强模型评审，输出结构化评判——pass/fail 或 1-10 分数 + 文字 critique，写入 state.critique 和 state.reflection_count（+1）。

条件边：critic 之后判断——pass 则 END 输出最终答案；fail 且 reflection_count < max_reflections 则回边到 generator（带上 critique 作为改进指引）；fail 且超过 max_reflections 则路由到 fallback 节点，避免无限循环。

max_reflections 是必配的防循环参数，通常设 2-3 轮。代码生成场景 critic 可以跑测试用例而非纯 LLM 评审——测试全过则 pass，有失败则把错误信息作为 critique 传回 generator，比 LLM 自评更可靠。

LangGraph 的价值在于：这种环被显式画在图上，每轮 critique 和 draft 都进 checkpoint，可追溯、可 debug、可单测每个节点的 IO 契约。

#### 💡 核心要点
- generator-critic 回边
- critic 输出 score 或 pass/fail
- 限制 max_reflections

#### 📝 代码/配置示例

```python
class ReflectState(TypedDict):
    task: str
    draft: str
    critique: str
    reflection_count: int

def draft_node(state: ReflectState) -> dict:
    prompt = state["task"]
    if state.get("critique"):
        prompt += f"
改进建议：{state['critique']}"
    return {"draft": llm.invoke(prompt)}

def reflect_node(state: ReflectState) -> dict:
    critique = critic_llm.invoke(f"评审：{state['draft']}")
    return {"critique": critique, "reflection_count": state["reflection_count"] + 1}

def should_continue(state: ReflectState) -> str:
    if "PASS" in state["critique"]: return "end"
    if state["reflection_count"] >= 3: return "fallback"
    return "revise"
```

#### 🔁 追问怎么接

- **无限循环**：max_reflections 限制 + 超过走 fallback
- **critic 用什么模型**：可用更强模型做评审；代码场景用测试用例比 LLM 自评更可靠
- **加分项**：提到 Reflexion 架构、checkpoint 可追溯每轮 critique
