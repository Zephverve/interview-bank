---
title: 5. Hermes Agent vs OpenClaw：两种 Harness 实现
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [Agent, 卡码笔记]
point: 5. Hermes Agent vs OpenClaw：
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/harness_interview.html

> 来源文章：Harness Engineering大厂面试题汇总：从Prompt到Context到Harness

---

**题目**：5. Hermes Agent vs OpenClaw：两种 Harness 实现

**结论句（15 秒）**：面试官会问：&quot;你了解 Hermes Agent 和 OpenClaw 吗

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官会问：&quot;你了解 Hermes Agent 和 OpenClaw 吗？它们和 Harness Engineering 什么关系？&quot;

 

### 先定性：Harness 是方法论，Hermes 和 OpenClaw 是实现

 Harness Engineering 是&quot;方法论 / 架构思想&quot;，Hermes Agent 和 OpenClaw 是&quot;基于这种思想的两种具体实现&quot;。

           ┌────────────────────┐
          │ Harness Engineering │  ← 方法论（抽象层）
          └─────────┬──────────┘
                    │
     ┌──────────────┼──────────────┐
     │              │              │
 Hermes Agent   Claude Code     OpenClaw
 （实现A）       （实现B）       （实现C）
 1
2
3
4
5
6
7
8
面试时先把这个结构说出来，面试官就知道你分得清&quot;思想&quot;和&quot;产品&quot;。

 

 

### OpenClaw（小龙虾）

 OpenClaw 是一个开源的个人 AI 助手，你可以在自己的设备上运行。吉祥物是一只太空龙虾叫 Molty，所以圈子里叫它&quot;小龙虾&quot;。

 它的核心定位是消息优先、本地优先——一个网关进程打通 25+ 消息平台（WhatsApp、Telegram、Slack、Discord、微信、QQ、飞书……），你的 AI 助手无处不在。

 OpenClaw 的 Harness 特点：

 能力 实现方式 上下文管理 AGENTS.md / SOUL.md / TOOLS.md 注入 工具系统 MCP 协议 + ClawHub 技能市场 执行编排 单 Agent 循环 记忆与状态 本地文件持久化 评估与观测 基础日志 约束与恢复 沙盒后端（Docker/SSH） OpenClaw 是个成熟的个人助手——消息全平台覆盖、本地隐私优先、技能市场丰富。但它的 Harness 本质上是一个工具执行系统：你给 prompt、给 tools，它调工具、返回结果。

 

### Hermes Agent（爱马仕）

 Hermes Agent 是 Nous Research 出品的自进化 Agent，标语是&quot;The agent that grows with you&quot;（和你一起成长的 Agent）。

 Hermes 做了一个非常关键的升级：从&quot;工具执行系统&quot; → &quot;自进化系统&quot;。

 它和 OpenClaw 最大的区别，就是内置了一个学习闭环（Learning Loop）：

 

 执行任务 → 总结经验 → 生成 skill → 存入记忆 → 下次复用
 1
Hermes 的 Harness 特点：

 能力 实现方式 上下文管理 AGENTS.md + 动态加载 工具系统 MCP + 自生成技能（~/.hermes/skills/） 执行编排 单 Agent + 子 Agent 并行委派 记忆与状态 持久化记忆 + Honcho 方言式用户建模 + FTS5 会话搜索 评估与观测 自我督促 + LLM 摘要跨会话回忆 约束与恢复 6 种终端后端 + 定时任务（cron） 

### 核心对比：谁强在哪？

 维度 OpenClaw Hermes Agent 定位 个人 AI 助手 自进化 Agent 语言 TypeScript Python 消息平台 25+（覆盖最广） 6 个（CLI/Telegram/Discord/Slack/WhatsApp/Signal） 技能来源 ClawHub 市场（社区贡献） 自主生成 + agentskills.io 标准 记忆系统 基础持久化 深度：用户建模 + 跨会话搜索 + 自我督促 学习能力 无（每次都是&quot;新手&quot;） 有（从经验中创建技能，越用越强） 研究能力 无 批量轨迹生成 + RL 训练环境 迁移友好度 — 内置 hermes claw migrate 从 OpenClaw 导入 一句话总结区别：

 OpenClaw 让模型能干活——全平台接入，工具齐全，但每次都是&quot;新手&quot;。

 Hermes Agent 让模型越干越强——它会记住做过的事、生成新技能、下次直接复用，是 Harness + Learning Loop 的结合体。

 

### 面试答法

 面试时先说清楚 Harness 是方法论、Hermes 和 OpenClaw 是实现。然后对比两者：OpenClaw 是&quot;工具执行系统&quot;，消息覆盖广；Hermes 是&quot;自进化系统&quot;，核心差异化是学习闭环。