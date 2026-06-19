---
title: 三、Agent 可观测性和普通日志有什么区别？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [Agent, 卡码笔记]
point: 三、Agent 可观测性和普通日志有什么区别？
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/agent_harness_observability_interview.html

> 来源文章：Agent Harness 可观测性：生产级 AI 项目必须补上的一课

---

**题目**：三、Agent 可观测性和普通日志有什么区别？

**结论句（15 秒）**：面试官可能会这么问：&quot;你们不是已经有日志、监控、链路追踪了吗

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官可能会这么问：&quot;你们不是已经有日志、监控、链路追踪了吗？为什么 Agent 还要单独做可观测性？&quot;

 这个问题很容易答错。

 很多人会说：&quot;我们把 Agent 输入输出打到日志里。&quot;

 这不够。

 普通日志主要记录的是：

 - 接口什么时候被调用
 - 请求参数是什么
 - 返回状态码是什么
 - 服务耗时多少
 - 有没有异常堆栈
 这些对传统后端系统很有用。

 但 Agent 的问题往往不是接口 500。

 Agent 最常见的问题是：

 - 它为什么选择这个工具？
 - 它为什么忽略了某段关键上下文？
 - 它为什么跑到另一个子任务去了？
 - 它为什么把工具返回结果理解错了？
 - 它为什么重复规划了 5 次？
 这些问题，普通日志回答不了。

 因为普通日志记录的是发生了什么。

 而 Agent 可观测性还要解释：它为什么这么做。

 

 举个例子。

 用户让 Agent：&quot;分析最近 7 天订单异常原因。&quot;

 普通日志可能只看到：

 POST /agent/run 200

 call search_orders success

 call query_refund_rate success

 LLM response success

 看起来都成功。

 但最终结论错了。

 为什么错？

 普通日志看不出来。

 Agent Trace 应该能看到：

 - 原始目标是&quot;订单异常原因&quot;
 - Agent 第一步把目标改写成了&quot;退款率异常&quot;
 - 检索时只查了退款数据，没查支付失败数据
 - 工具返回里有&quot;支付通道超时&quot;，但模型没有纳入结论
 - 最终回答只归因到退款策略
 这样你才能定位：问题不是工具失败，而是目标改写偏了 + 证据选择偏了。

 这就是 Agent 可观测性和普通日志的差异。

 普通日志适合看系统有没有挂。

 Agent Trace 适合看任务有没有做对。

 面试里可以这么答：

 传统日志关注服务状态，Agent 可观测性关注执行意图和决策过程。Agent 出问题时，HTTP 状态码可能全是 200，但任务已经偏了。所以生产级 Agent 需要结构化 Trace，把 Plan、Action、Observation、State Diff、Context Source 和 Eval Result 串起来，而不是只打输入输出日志。