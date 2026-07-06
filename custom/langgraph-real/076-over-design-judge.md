---
title: "怎么判断用 LangGraph 是不是过度设计？"
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 面经]
point: "过度设计"
source: 牛客 · 百度/阿里
---

**题目**：怎么判断用 LangGraph 是不是过度设计？

**结论句（15 秒）**：看条件边是否映射真实分支、checkpoint 有无生命周期、团队能否维护 state 约定；线性三步必是过度。

**追问方向**：重构回 Workflow 过吗？ · 如何向老板解释成本？

### 回答

**优先级**：P0 · 3+ 篇面经

#### 🗣️ 先用大白话说

**一句话**：过度设计不是道德问题，是可量化问题——三条条件边对应三个真实业务分支吗？checkpoint 有 TTL 吗？新人能看懂 state 吗？

**打个比方**：用大吊车搬一张桌子是过度设计——不是吊车不好，是任务不需要。线性三步流程用 LangGraph 就像用大吊车搬桌子。

#### 📖 面试展开（详细版）

百度/阿里 P0 连问题，考察**技术判断力和诚实度**——敢不敢说「我可能用重了」。

**量化三问**（全答「否」→ 可能过度）：
1. **每条条件边对应真实业务分支吗？**——如果图里有 5 条条件边但只有 2 个真实分支，另外 3 个是「以防万一」，那就是过度
2. **checkpoint 里存的东西有 TTL 和划界吗？**——如果 state 越来越大、没人管清理策略，说明没想清楚持久化需求
3. **半年后新人能看懂 state 演化吗？**——如果 state 字段命名混乱、reducer 约定没文档，维护成本会指数增长

**明确过度场景**：线性「检索 → 生成 → 格式化」三步，无环、无 HITL、无断点续跑需求 → 用 LCEL Workflow 二十行搞定，上 LangGraph 是过度。

**复杂度跟什么走**：业务分支数 × 恢复需求 × 团队规模。不是跟框架热度走。

**向老板解释成本**：用图省的是**分支胶水代码**和**故障恢复成本**，不是代码行数。如果算下来：维护图的时间 > 写 if-else 的时间 + 故障手动恢复的时间，就退回 Workflow。诚实比坚持用框架加分。

#### 💡 核心要点
- 量化三问
- 线性三步用 Chain
- 复杂度跟业务分支数走

#### 📝 代码/配置示例

```python
# 过度：线性三步硬上图
builder.add_node("retrieve", retrieve)
builder.add_node("generate", generate)
builder.add_node("format", format)
builder.add_edge("retrieve", "generate")
builder.add_edge("generate", "format")
# → 用 LCEL 更简洁

# 合理：有环 + HITL
builder.add_conditional_edges("grade", lambda s: "rewrite" if s["score"] < 0.7 else "generate")
builder.compile(interrupt_before=["publish"])
```

#### 🔁 追问怎么接

- **「重构回 Workflow 过吗？」** → 如果有，讲真实 story（「最初上图后发现只有线性三步，维护 State 约定成本 > 收益，退回 LCEL」）；如果没有，说「我会定期用三问自检」。
- **「如何向老板解释成本？」** → 用图省的是分支胶水 + 故障恢复，不是行数；给出量化：「HITL 审批流如果用 if-else 要写 200 行胶水，用 LangGraph interrupt 20 行搞定」。
