---
title: 五、子Agent机制怎么工作？什么场景会启动子Agent？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [AI编程, 卡码笔记]
point: 五、子Agent机制怎么工作？什么场景会启动子Agent
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/claude_code_deep_dive.html

> 来源文章：Claude Code大厂面试题汇总：源码泄露、Agent Loop、系统提示词全拆解|深度解析Claude Code工作原理

---

**题目**：五、子Agent机制怎么工作？什么场景会启动子Agent？

**结论句（15 秒）**：面试官会问：&quot;Claude Code的子Agent是怎么工作的

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官会问：&quot;Claude Code的子Agent是怎么工作的？什么场景下会启动子Agent？&quot;

 当任务太复杂，一个Agent处理不过来时，Claude Code会启动子Agent——相当于&quot;分身&quot;去处理子任务。

 

### 三种子Agent

 

 类型 模型 能力 适用场景 Explore Haiku（最便宜） 只读（搜索、读文件） 快速探索代码库 Plan 继承父Agent模型 只读 设计实现方案 General-purpose 继承父Agent模型 全部工具 复杂多步骤任务 

### Explore Agent：用最便宜的模型做最多的脏活

 Explore Agent是最常用的子Agent。它的设计非常精妙：

 - 用Haiku模型——成本极低，速度极快
 - 只有只读权限——不能修改任何文件，只能搜索和阅读
 - 内部可以消耗100K+ token——在自己的上下文里大量读文件
 - 返回给父Agent只有1,500-2,000 token的摘要
 这意味着什么？Explore Agent可以读几十个文件、搜索整个代码库，但最终只返回一个精炼的摘要给主Agent。主Agent的上下文窗口不会被大量代码撑爆。

 这是一个非常重要的架构决策：用廉价的子Agent做信息收集，用昂贵的主Agent做决策。

 

### 子Agent的限制

 - 最多1层嵌套——子Agent不能再启动子Agent，防止无限递归
 - 独立上下文——子Agent看不到父Agent的对话历史，必须在prompt里给足信息
 - 结果不可见给用户——子Agent的输出只返回给父Agent，用户看不到中间过程
 

### 并行子Agent

 Claude Code支持同时启动多个子Agent并行工作。比如：

 - 同时让一个Explore Agent搜索前端代码，另一个搜索后端代码
 - 同时让一个Agent跑测试，另一个Agent检查类型
 并行子Agent是Claude Code处理大型任务的关键能力。 一个人干不完的活，分给几个&quot;分身&quot;同时干。

 

### 子Agent的成本考量

 这里有一个很现实的问题：子Agent也要花钱。

 - Explore Agent用Haiku，成本很低（约$0.25/百万输入token）
 - General-purpose Agent用Opus/Sonnet，成本和主Agent一样
 所以Claude Code的策略是：能用Explore解决的问题，绝不用General-purpose。 只有真正需要修改文件或执行复杂操作时，才启动全能力子Agent。

 据统计，Claude Code的平均使用成本约**$6/开发者/天**，月均$100-200。子Agent的合理使用是控制成本的关键。