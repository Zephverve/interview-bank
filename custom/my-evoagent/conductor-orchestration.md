---
title: Conductor 多 Agent 编排具体怎么实现的？
round: 二面
difficulty: ⭐⭐⭐⭐
tags: [evoagent, 面试]
point: Conductor 多 Agent 编排具体怎么实现的？
---

**题目**：Conductor 多 Agent 编排具体怎么实现的？

### 回答

**先讲设计原则**（这一句是核心）：

"**Conductor 是总管，它绝不自己执行工具**。它只做四件事：分析、派遣、验收、对用户回复。原因是总管的上下文要保持'调度视角' —— 如果它自己也去 `code_run`、`file_read`，上下文会被执行细节污染，就没法专注做调度判断了。"

**八步流程**（要能顺着说下来）：

| 步骤 | 事件 | 处理 |
|---|---|---|
| **唤醒** | inbox 收到 `user_msg` / `subagent_done` / `im_signal` | **0.3s debounce 合并事件** —— 避免短时间内多个事件触发多次调度 |
| **拼 prompt** | `_build_prompt(events)` | 注入当前 subagent 运行数、未读消息数 |
| **派主 Agent** | `agent.put_task(prompt, source="conductor")` | 主 Agent 决定：给用户发消息，还是开 SubAgent |
| **开 SubAgent** | `SubagentPool.start_subagent(prompt)` | **新建独立 `GenericAgent()` 实例 + 独立线程** |
| **监控输出** | `monitor_display_queue` | 流式更新卡片；完成时通知 Conductor |
| **key_info 注入** | `POST /subagent/{id}` action=keyinfo | 写入 `handler.working['key_info']`，**不重启 SubAgent** |
| **前端推送** | `schedule_broadcast` | WebSocket 推 chat / subagents / log，跨线程用 `run_coroutine_threadsafe` |
| **人机审批** | `POST /approval` | 危险任务先推前端待批，用户同意才变成 SubAgent prompt |

**为什么用 inbox 事件队列而不是直接调用？**

"核心是**并发控制和可审计性**。多个 SubAgent 完成事件可能同时到达，直接处理会有竞态。队列把并发变成串行消费，天然无竞态。另外所有事件统一进队列，**有序、可回放** —— 调试多 Agent 问题时，回放事件序列比重跑一遍高效得多。0.3s 的 debounce 是为了合并短时间内的事件，避免总管的判断被拆碎。"
