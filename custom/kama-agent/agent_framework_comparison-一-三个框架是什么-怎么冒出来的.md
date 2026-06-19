---
title: 一、三个框架是什么？怎么冒出来的？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [Agent, 卡码笔记]
point: 一、三个框架是什么？怎么冒出来的？
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/agent_framework_comparison.html

> 来源文章：OpenClaw、Hermes Agent、Claude Code三框架横评：面试必懂的对比

---

**题目**：一、三个框架是什么？怎么冒出来的？

**结论句（15 秒）**：# OpenClaw、Hermes Agent、Claude Code三框架横评：面试必懂的对比  现在大厂面Agent开发岗，面试官动不动就问：&quot;你了解哪些Agent框架

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

# OpenClaw、Hermes Agent、Claude Code三框架横评：面试必懂的对比  现在大厂面Agent开发岗，面试官动不动就问：&quot;你了解哪些Agent框架？它们的记忆机制、工具调用、上下文管理有什么不同？&quot;

 不少录友能说出OpenClaw、Hermes Agent、Claude Code这三个名字，但一追问就露馅——只知道名字，不知道里面怎么干的，更说不清楚三者之间到底差在哪。

 字节agent开发岗的面试里，就有录友被问到&quot;这三个框架的记忆系统怎么实现的&quot;、&quot;Claude Code的Hook是怎么实现的&quot;这种深挖题。

 这篇文章把三个框架从底层架构到核心机制全部对比讲透，认真看完，面试官再追问你就不怕了。

 三者的定位一句话区分：OpenClaw是全平台个人助手，Hermes Agent是自进化Agent，Claude Code是产品级编程Agent。它们都是Harness Engineering的具体实现，但各自走了不同的路。

 关于Harness Engineering的完整拆解，可以看这篇Harness面试文章。关于Claude Code的万字深度解析，可以看这篇Claude Code拆解。本文聚焦在三者对比，不重复展开细节。

面试官会问：&quot;你了解OpenClaw、Hermes Agent、Claude Code吗？它们分别是什么？&quot;

 

### OpenClaw：全平台个人助手

 OpenClaw是一个开源的个人AI助手，吉祥物是一只太空龙虾叫Molty，所以圈子里叫它&quot;小龙虾&quot;。

 核心定位是消息优先、本地优先——一个网关进程打通25+消息平台（WhatsApp、Telegram、Slack、Discord、微信、QQ、飞书……），你的AI助手无处不在。

 OpenClaw最早由独立开发者社区打造，后来被OpenAI收购纳入旗下。它不是OpenAI内部团队从零写的，而是先有社区产品，再被大厂收编——这个出身决定了它的基因是开源、开放、社区驱动。

 技术栈是TypeScript，跑在本地，隐私优先。

 

### Hermes Agent：自进化Agent

 Hermes Agent是Nous Research出品的自进化Agent，标语是&quot;The agent that grows with you&quot;（和你一起成长的Agent）。

 它做了一个非常关键的升级：从&quot;工具执行系统&quot;→&quot;自进化系统&quot;。内置了学习闭环（Learning Loop），会从经验中生成新技能，下次直接复用。

 技术栈是Python，核心差异化是学习闭环。

 

### Claude Code：产品级编程Agent

 Claude Code是Anthropic官方推出的AI编程助手，和Cursor、Windsurf是同类产品，但它是目前唯一一个完整源码被泄露过的——2026年3月31日，Anthropic不小心把512,000行TypeScript代码全部公开了。

 这次泄露让我们第一次看到了一个产品级AI编程工具的完整内部结构。系统提示词、工具定义、安全规则、子Agent架构、上下文管理策略，全部一览无余。

 技术栈是TypeScript，定位是编程场景的专用Agent。

 

### 一句话区分

 框架 一句话定位 核心差异化 OpenClaw 全平台个人助手 消息覆盖最广，本地隐私 Hermes Agent 自进化Agent 学习闭环，越用越强 Claude Code 产品级编程Agent 工程化极致，安全最完善