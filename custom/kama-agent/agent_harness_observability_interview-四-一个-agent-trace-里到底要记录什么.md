---
title: 四、一个 Agent Trace 里到底要记录什么？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [Agent, 卡码笔记]
point: 四、一个 Agent Trace 里到底要记录什么？
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/agent_harness_observability_interview.html

> 来源文章：Agent Harness 可观测性：生产级 AI 项目必须补上的一课

---

**题目**：四、一个 Agent Trace 里到底要记录什么？

**结论句（15 秒）**：面试官可能会这么问：&quot;如果让你设计 Agent Trace，你会记录哪些字段

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官可能会这么问：&quot;如果让你设计 Agent Trace，你会记录哪些字段？&quot;

 这个问题很实战。

 不要只说&quot;记录输入输出&quot;。

 一个真正可用的 Agent Trace，至少要分两层：任务级 Trace 和 步骤级 Step。

 任务级 Trace 记录这次任务的全局信息：

 - trace_id：一次任务的唯一 ID
 - user_goal：用户原始目标
 - normalized_goal：系统改写后的目标
 - agent_version：Agent 版本
 - model_version：模型版本
 - policy_version：工具权限、成本预算、审批策略版本
 - start_time / end_time：任务开始结束时间
 - final_status：成功、失败、降级、人工接管
 - total_tokens / total_cost：总消耗
 - final_eval：最终评估结果
 步骤级 Step 记录每一步发生了什么：

 - step_id：第几步
 - step_type：规划、工具调用、观察、总结、评估
 - current_goal：当前步骤服务哪个子目标
 - context_refs：本步使用了哪些上下文来源
 - model_input_summary：输入摘要
 - model_output_summary：输出摘要
 - tool_name：调用了哪个工具
 - tool_args：工具参数
 - tool_result_summary：工具返回摘要
 - state_before / state_after：状态变化
 - latency_ms：耗时
 - tokens：Token 消耗
 - risk_level：风险等级
 - eval_result：本步是否合理
 

 这里面有几个字段特别重要。

 第一个是 context_refs。

 因为很多 Agent 错误，不是模型突然变差，而是上下文给错了、给多了、给旧了。

 你必须知道本步推理到底用了哪些文档、哪些历史消息、哪些记忆。

 第二个是 state_before 和 state_after。

 Agent 是会改变环境的。它可能写文件、改数据库、创建工单、发邮件。

 如果没有状态差异记录，出事后你不知道它到底动了什么。

 第三个是 eval_result。

 不要等最终答案出来才评估。

 长链路任务里，中间步骤就要评估。

 因为越早发现偏差，修复成本越低。

 面试时可以这么说：

 我会把 Agent Trace 设计成任务级和步骤级两层。任务级记录原始目标、版本、状态、总成本和最终评估；步骤级记录每一步的计划、上下文来源、模型输出、工具调用、状态差异、成本和局部评估。这样失败后既能看全局链路，也能定位到具体哪一步开始出问题。