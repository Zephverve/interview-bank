---
title: "时间旅行调试（Time Travel）是什么？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, HITL]
point: "调试"
source: GitHub 100 Questions
---

**题目**：时间旅行调试（Time Travel）是什么？

**结论句（15 秒）**：通过 get_state_history 查看历史 checkpoint，可回滚到任意 super-step 重新 fork 执行，便于复现 bug。

**追问方向**：和 LangSmith 关系？ · 生产能开吗？

### 回答

**优先级**：P2 · 1 篇

**📖 核心要点**
- 每个 checkpoint 有 checkpoint_id
- update_state 从旧点 fork 新分支
- 开发利器，生产慎用随意回滚

**🗣️ 标准口语答案**

时间旅行指 get_state_history(thread_config) 列出该 thread 所有历史 checkpoint，可以选中某个 checkpoint_id 用 update_state 从该点 fork 新执行分支，复现「如果当时走了另一条路」的行为。

开发调试神器：用户报 bug 时回到出错前一步，改 state 或改路由重跑。LangSmith 可视化每步 state 变化，和时间旅行互补。

生产环境回滚要谨慎，涉及已发生的副作用；开发环境可随意实验。

