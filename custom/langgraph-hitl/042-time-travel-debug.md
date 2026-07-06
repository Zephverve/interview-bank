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

#### 🗣️ 先用大白话说

时间旅行就是 get_state_history(thread_config) 列出该 thread 所有历史 checkpoint，选中某个 checkpoint_id 用 update_state 从该点 fork 新执行分支。开发时特别好用：用户报了 bug，回到出错前一步，改 state 或改路由重跑，看「如果当时走了另一条路」会怎样。LangSmith 可视化每步 state 变化，和时间旅行互补。生产环境回滚要谨慎，涉及已发生的副作用。

#### 📖 面试展开（详细版）

**是什么**：Time Travel 利用 checkpointer 保存的历史 checkpoint，可以查看、回滚、fork 任意 super-step 的执行状态，是从历史点重新执行或修改后重跑的能力。

**怎么用**：app.get_state_history(config) 返回该 thread 所有 checkpoint 列表，每个有 checkpoint_id 和对应 state。选中某个历史点，用 app.update_state(historical_config, new_values) 从该点 fork 新分支，再用 stream/invoke 继续执行。

**开发场景**：复现用户 bug——回到出错前一步，修改 state（如换一个检索结果）重跑；A/B 测试不同路由策略；调试条件边逻辑。

**和 LangSmith 关系**：LangSmith 提供可视化 trace 和时间线，Time Travel 是运行时操作能力。两者互补：LangSmith 看全局，Time Travel 在本地 fork 重跑。

**生产能开吗**：get_state_history 查看可以开（注意权限和脱敏）；随意回滚 fork 生产慎用——回滚点之后可能已有不可逆副作用（已发邮件、已扣款）。开发/预发环境可随意实验。

**踩坑**：生产环境随意 fork 导致副作用重复；history 太多不清理占存储；回滚后不更新代码版本导致行为不一致。

#### 💡 核心要点
- 每个 checkpoint 有 checkpoint_id
- update_state 从旧点 fork 新分支
- 开发利器，生产慎用随意回滚

#### 📝 代码/配置示例

```python
config = {"configurable": {"thread_id": "debug-thread-1"}}

# 查看历史
history = list(app.get_state_history(config))
for i, snap in enumerate(history):
    print(i, snap.config["configurable"]["checkpoint_id"], snap.values.get("current_step"))

# 从第 3 步 fork 新分支
old_config = history[3].config
app.update_state(old_config, {"route_key": "alternative_path"})
for event in app.stream(None, old_config):
    print(event)
```

#### 🔁 追问怎么接

**「和 LangSmith 关系？」**——LangSmith 可视化 trace；Time Travel 是运行时 fork 重跑能力。互补。

**「生产能开吗？」**——查看 history 可以（注意权限）；随意 fork 回滚生产慎用，副作用可能已发生。
