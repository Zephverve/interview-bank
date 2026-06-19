---
title: 6. 和 Prompt/Context Engineering 到底什么关系？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [Agent, 卡码笔记]
point: 6. 和 Prompt/Context Engineer
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/harness_interview.html

> 来源文章：Harness Engineering大厂面试题汇总：从Prompt到Context到Harness

---

**题目**：6. 和 Prompt/Context Engineering 到底什么关系？

**结论句（15 秒）**：面试官会问：&quot;这三个 Engineering 是替代关系吗

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官会问：&quot;这三个 Engineering 是替代关系吗？我都要学吗？&quot;

 

### 不是替代，是包含

 三者根本不是替代关系，而是包含关系：

 - Prompt 是对&quot;指令&quot;的工程化
 - Context 是对&quot;输入环境&quot;的工程化
 - Harness 是对&quot;整个运行系统&quot;的工程化
 边界一层比一层大。Prompt 是 Context 的一部分，Context 是 Harness 的一部分。 当你做 Harness 的时候，里面一定包含 Context 工程，Context 工程里又一定包含 Prompt 工程。

 

### 四层递进

 如果你把 Hermes Agent 的学习闭环也加进来，可以看成四层递进：

 层次 解决什么 一句话 Prompt Engineering 怎么说 让模型听懂你想干啥 Context Engineering 给什么信息 让模型知道该用什么 Harness Engineering 能干什么 让模型持续做对 Learning Loop 会不会变强 让模型越干越强 

### 面试核心点

 面试时别说&quot;我三个都会&quot;，要说出理解层次：先说清三者是包含关系不是替代关系，再强调 Harness 是站在更大系统视角把前面两个包进去了，最后点出真正的分水岭——当任务还是单轮对话时 Prompt 就够，需要外部知识时 Context 关键，但进入&quot;长链路、可执行、低容错&quot;的真实场景，Harness 几乎是不可避免的。