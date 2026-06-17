---
title: 如何防止 Agent 死循环浪费 Token
round: 一面/二面
difficulty: ⭐⭐⭐⭐
tags: [Agent, ReAct, 成本控制]
point: 循环终止与预算
---

**题目**：怎么防止 Agent 一直运行、死循环、自己浪费 Token？

**结论句（15 秒）**：硬上限 max_turns/token budget + 重复检测 + 无进展熔断 + 超时 kill。

**追问方向**：怎么判断'无进展'？ · 和 LangGraph 的 interrupt 怎么配合？

### 回答

"ReAct 循环天然有'停不下来'的风险，我会设**多层熔断**：

**硬限制**：`max_turns`（如 20–30）、`max_tokens` 总预算、单步超时、总 wall-clock 超时。到线强制退出并返回'任务未完成，已保存中间状态'。

**重复检测**：连续 N 步调用同一工具且参数相同 → 判定死循环；或 embedding 相似度检测'我在重复思考' → 注入系统提示'换策略或 ask_user'。

**无进展检测**：每 K 步检查 goal 完成度/中间 artifact 是否变化；若 score 不提升，降级策略（换工具、缩小 scope、请求人类）。

**成本控制**：简单任务走小模型+少工具；复杂任务才开 full agent；缓存 tool 结果，避免重复爬同一 URL。

**产品层**：对用户展示'已用步数/预算'，允许随时 cancel；后台 run 必须 idempotent，方便重试而不是无限续跑。

工程上宁可**早停 + 可恢复**，也不要为了'再试一次'烧光 token。"
