---
title: 二、架构对比：底层设计思路有什么不同？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [Agent, 卡码笔记]
point: 二、架构对比：底层设计思路有什么不同？
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/agent_framework_comparison.html

> 来源文章：OpenClaw、Hermes Agent、Claude Code三框架横评：面试必懂的对比

---

**题目**：二、架构对比：底层设计思路有什么不同？

**结论句（15 秒）**：面试官会问：&quot;这三个框架的底层架构有什么区别

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官会问：&quot;这三个框架的底层架构有什么区别？&quot;

 

### Agent Loop的实现方式

 三个框架的核心都是一个循环：接收任务→思考→执行→观察→继续或结束。但循环的&quot;编排方式&quot;不同。

 OpenClaw：单Agent线性循环

 OpenClaw是最简单的结构——一个Agent跑一个循环，你给它消息，它调工具，返回结果。没有子Agent，没有复杂编排，就是&quot;输入→工具调用→输出&quot;的线性流程。

 简单，但意味着复杂任务要么靠Prompt拆，要么靠外部系统调度。

 Hermes Agent：单Agent + 子Agent并行委派

 Hermes在单Agent循环的基础上，加了子Agent并行委派能力——主Agent可以把子任务派给子Agent并行执行，结果汇总后主Agent继续决策。

 更关键的是，Hermes在循环里嵌了一个学习闭环：

 执行任务 → 总结经验 → 生成skill → 存入记忆 → 下次复用
 1
这让Hermes不是简单的&quot;跑完就忘&quot;，而是越跑越强。

 

 Claude Code：while循环 + 三种子Agent

 Claude Code的核心就是一个while循环——不断&quot;思考→行动→观察&quot;，直到模型自己判断任务完成。伪代码就几行：

 while (true) {
  response = claude.chat(messages)
  if (response.type === 'text') break    // 模型认为任务完成
  if (response.type === 'tool_use') {
    result = executeTool(response.tool, response.params)
    messages.push(result)                 // 结果加入下一轮
  }
}
 1
2
3
4
5
6
7
8
但它在这个简单循环上做了三种子Agent扩展：Explore（搜索探索）、Plan（规划拆解）、General-purpose（通用执行）。子Agent是独立上下文窗口，跑完把结果摘要返回主Agent，不污染主窗口。

 

### 架构对比表

 维度 OpenClaw Hermes Agent Claude Code 核心循环 单Agent线性 单Agent + 子Agent并行 while循环 + 三种子Agent 编排方式 线性执行 可并行委派 串行为主，子Agent独立上下文 学习能力 无 学习闭环 无（但靠CLAUDE.md积累项目知识） 复杂任务处理 靠Prompt拆解 子Agent并行 子Agent隔离执行 语言 TypeScript Python TypeScript 

 

### 面试答法

 先说共性：三个框架核心都是ReAct循环。再说差异：OpenClaw是线性执行，适合单任务场景；Hermes加了并行委派和学习闭环，适合需要积累经验的长期任务；Claude Code用子Agent隔离复杂任务，每个子Agent有独立上下文窗口，不会互相污染。