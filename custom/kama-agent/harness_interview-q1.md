---
title: 1. Harness Engineering 是什么？从哪冒出来的？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [Agent, 卡码笔记]
point: 1. Harness Engineering 是什么？从
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/harness_interview.html

> 来源文章：Harness Engineering大厂面试题汇总：从Prompt到Context到Harness

---

**题目**：1. Harness Engineering 是什么？从哪冒出来的？

**结论句（15 秒）**：# Harness Engineering大厂面试题汇总：从Prompt到Context到Harness 卡哥昨天在代码随想录B站  (opens new window)直播在讲Harness Engineering，直播非常火爆：

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

# Harness Engineering大厂面试题汇总：从Prompt到Context到Harness 卡哥昨天在代码随想录B站  (opens new window)直播在讲Harness Engineering，直播非常火爆：

 

 （不开玩笑了，此图来此 GPTImages 2.0）

 但这篇确实来讲讲Harness Engineering。

 最近知识星球  (opens new window)里，录友反馈最多的面试新词就是：Harness Engineering。

 现在ai迭代速度太快。很多人刚整明白 Prompt Engineering，又来一个 Context Engineering，还没消化完，Harness Engineering 又上了热搜。

 甚至有录友面试直接被问到&quot;你怎么理解 Harness 工程&quot;，当场愣住。

 Harness 到底是啥？跟 Prompt Engineering、Context Engineering 什么关系？Hermes Agent 和 OpenClaw 又是什么？ 搞不清楚这些，面试官一深挖就原形毕露。

 这篇文章把 Harness Engineering 从来龙去脉到实战落地全部讲透，认真看完，面试不再怕被追问。

面试官一般这么问：&quot;你听说过 Harness Engineering 吗？&quot;或者&quot;Agent = Model + Harness，你怎么理解这个等式？&quot;

 

### 先搞清楚：Harness 是什么？

 Harness 这个词直译叫**&quot;马具&quot;，或者&quot;缰绳&quot;**。

 想象一下骑马：马本身有强大的力量，能跑能跳能驮东西。但如果没有缰绳和马具，这股力量就是失控的——马可能往悬崖上跑，可能甩你下来，可能跑去吃草不回来了。

 马具的作用，就是让这股力量为你所用。

 AI 系统也一样。LLM 很强，Agent 很能干，但如果没有一套东西把它们&quot;拴住&quot;、监测住、约束住，它们就是脱缰的野马——可能跑偏、可能幻觉、可能越权、可能悄悄变差。

 Harness Engineering 就是给 AI 系统装上缰绳的工程学科。

 

### 这个词是谁先喊出来的？

 很多人跟风聊 Harness Engineering，但压根不知道它最早是谁提的。搞清楚来源，你就明白为什么它这次真的能火，而不是又一个换皮概念。

 2026 年 2 月 5 号，Mitchell Hashimoto（HashiCorp 联合创始人，Vagrant、Terraform 的作者）发了一篇博客，叫《My AI Adoption Journey》。他把接纳 AI 的过程拆成 6 步，第 5 步的名字就叫**&quot;Engineer the Harness&quot;**。

 他的定义特别简洁：

 每次当你发现 Agent 犯了一个错误，就花点时间去工程化一个解决方案，让它永远不会再犯同样的错误。

 你品品这个思路。绝大多数人遇到 Agent 犯错，骂两句手动改掉，祈祷下次别再犯。但 Mitchell 不是这么干的——他每次 Agent 犯错，都会停下来问自己：我能不能把这个错误永久性地修到环境里，让它下次在结构上就不可能再犯？

 可能是给 AGENTS.md 加一条规则，可能是加一个 linter，可能是补一个自动化测试，也可能是搞一个 Git Hook。关键是：这个修补必须沉淀到环境里，而不是留在人脑子里。

 这套做法是复利的。每次 Agent 犯错，环境就变强一点；环境变强一点，Agent 下次就更少犯错；犯错变少，你改进的速度就更快。时间一长，你的 Harness 越来越坚固，Agent 在你这个项目里越跑越稳。

 博客发出来一周后，OpenAI 紧接着发了一篇官方博客，标题就叫《Harness engineering: leveraging Codex in an agent-first world》。讲的是他们内部一个小团队，从一个空仓库出发，用 5 个月时间靠 Agent 写出了 100 万行代码、合并了 1500 个 PR，全程没人手动写过一行代码。

 这个词的路径很清晰：基础设施圈的老法师先喊出来 → OpenAI 几天后发文背书 → 一周内整个 AI 圈刷屏。 这种出身决定了它不会像很多 AI 新词一样&quot;炒一波就凉&quot;，它更像是在真实工程土壤里长出来的东西。

 

### 一个核心等式

 圈子里流传着一个特别简洁的等式：

 Agent = Model + Harness

 翻译成人话：在一个 AI Agent 系统里，除了模型本身之外，几乎所有决定它能不能稳定交付的东西，都属于 Harness。

 你也可以反过来推：Harness = Agent − Model

 这个公式把 Harness 的边界划得清清楚楚。

 

 

### 面试核心点

 别把 Harness Engineering 理解成某个具体工具或产品。面试官问的是方法论——你怎么设计一整套运行环境，让模型持续做对。Mitchell Hashimoto 的定义和 OpenAI 的实践，面试时要能说出来，这是概念来源。