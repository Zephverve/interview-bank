---
title: 1. LLM 和 Agent 有什么区别？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [Agent, 卡码笔记]
point: 1. LLM 和 Agent 有什么区别？
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/agent_interview.html

> 来源文章：Agent大厂面试题汇总：ReAct、Function Calling、MCP、RAG高频问题

---

**题目**：1. LLM 和 Agent 有什么区别？

**结论句（15 秒）**：# Agent大厂面试题汇总：ReAct、Function Calling、MCP、RAG高频问题  现在无论是什么岗位，都要求了解一些AI，Agent相关的内容

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

# Agent大厂面试题汇总：ReAct、Function Calling、MCP、RAG高频问题  现在无论是什么岗位，都要求了解一些AI，Agent相关的内容。

 从25年开始，知识星球  (opens new window)里就有录友开始反馈，很多岗位要求有agent经验，而且在面试的过程中会主动问你是否了解agent。

 今年26年，如果想找开发类的工作，基本了解agent已经成为标配了。

 不少录友对于agent的学习，就是在网上，或者问问ai，了解一些概念而已，但面试官，一追问底层原理就露馅。

 **Function Call 到底怎么实现的？MCP 解决什么问题？A2A 和 MCP 什么关系？**这些搞不清楚，面试官一深挖就原形毕露。

 这篇文章把 Agent 面试从底层到实战全部讲透，认真看完，面试不再怕被追问。

面试官一般这么问：&quot;你们项目里用的是 LLM 直接调用还是 Agent？为什么这么选？&quot;或者&quot;Agent 比 LLM 多了什么？如果让你从零设计一个 Agent，你会怎么做？&quot;

 

### LLM 是什么？

 LLM（大语言模型）本质上就是一个条件概率模型，给它一段输入 token，它预测下一个 token 最可能是什么：

 P(token_n | token_1, token_2, ..., token_{n-1})
 1
你可以把它当成一个无状态的函数：输入 Prompt，输出文本。每次调用都是独立的，没有记忆，没有状态，对外部世界一无所知。

 

### LLM 的四大天花板

 这四条，面试的时候一定要能展开说，不能只背关键词：

 ① 只会说不会做——它能告诉你&quot;你可以去天气 App 查一下&quot;，但它自己不会去查。

 ② 没有记忆——上下文窗口一满就&quot;失忆&quot;，跨会话什么都没留下。

 ③ 知识截止——训练数据有截止日期，昨天发生的事它不知道。

 ④ 不会规划——你让它&quot;做一份竞品分析&quot;，它只会线性回答，不会自己拆解成&quot;先搜集资料、再逐个分析、再对比价格&quot;这样的步骤。

 

### Agent 是什么？

 一句话：Agent = LLM + 工具 + 记忆 + 规划，在循环中自主完成目标。

 

### 一个例子说清楚本质区别

 任务：帮我查一下明天北京的天气，如果下雨就取消我日历里的跑步计划。

 角色 实际行为 LLM &quot;您可以打开天气 App 查询北京明天天气，如果降雨概率超过 60% 建议取消户外运动，可以在日历 App 中删除该日程...&quot; Agent 1. 调用天气 API → 明天北京中雨 2. 调用日历 API → 找到明天7:00跑步计划 3. 调用日历 API → 删除该计划 4. 回复：&quot;明天北京有雨，已为您取消跑步计划。&quot; LLM 告诉你怎么做，Agent 直接帮你做完。 这就是本质区别。

 

 

### 面试加分点：Agent 的完整四模块

 Agent 由四个模块组合而成：**LLM（大脑）**负责理解意图、推理判断；规划模块负责任务拆解、步骤排序；记忆模块负责短期上下文与长期知识存储；工具模块负责调用外部 API、数据库、代码执行器等，是 Agent 的&quot;手和脚&quot;。

 面试时别只说&quot;Agent 就是 LLM 加工具&quot;，要展开讲这四个模块各自的作用，以及它们怎么在循环中协作。