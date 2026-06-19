---
title: 九、双模型策略怎么分工？成本怎么控制？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [AI编程, 卡码笔记]
point: 九、双模型策略怎么分工？成本怎么控制？
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/claude_code_deep_dive.html

> 来源文章：Claude Code大厂面试题汇总：源码泄露、Agent Loop、系统提示词全拆解|深度解析Claude Code工作原理

---

**题目**：九、双模型策略怎么分工？成本怎么控制？

**结论句（15 秒）**：面试官会问：&quot;Claude Code为什么用两个模型

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官会问：&quot;Claude Code为什么用两个模型？全用大模型不行吗？&quot;或者&quot;双模型策略的成本优化效果怎么样？什么操作用小模型，什么操作用大模型？&quot;

 Claude Code不是只用一个模型，而是用两个模型配合工作。这是一个非常聪明的成本优化策略。

 

### 两个模型，两种角色

 

 模型 角色 负责什么 成本 Haiku &quot;直觉&quot; 权限判断、元数据提取、快速分类 ~$0.25/百万输入token Opus/Sonnet &quot;大脑&quot; 代码理解、方案设计、复杂推理 ~$15/百万输入token 价格差60倍。如果所有操作都用Opus，成本会高到不可接受。

 

### Haiku负责的"快决策"

 每次工具调用前，Claude Code需要判断：这个操作需不需要问用户？这是一个高频但简单的决策——不需要理解代码逻辑，只需要匹配规则。

 比如：

 - Read(&quot;config.js&quot;) → 读文件，安全，直接允许
 - Bash(&quot;rm -rf node_modules&quot;) → 删除操作，需要确认
 - Edit(&quot;app.js&quot;, ...) → 编辑文件，看权限模式决定
 这类判断用Haiku就够了，快且便宜。

 

### Opus/Sonnet负责的"慢思考"

 真正需要大模型的场景是：

 - 理解用户的意图——&quot;帮我优化这个函数&quot;到底要优化什么？
 - 分析代码逻辑——这个bug的根因是什么？
 - 设计解决方案——应该怎么重构这段代码？
 - 生成代码——写出正确的、符合项目风格的代码
 这些任务需要深度推理能力，只有大模型能胜任。

 

### 成本控制的实际效果

 通过双模型策略，Claude Code把大量低价值的判断交给Haiku，只在真正需要推理时才用Opus/Sonnet。

 粗略估算：

 - 一次典型的编程任务，可能有20-30次权限检查（Haiku）
 - 但只有5-10次真正的代码推理（Opus/Sonnet）
 - 如果全用Opus，权限检查的成本会占总成本的30-40%
 - 用Haiku做权限检查，这部分成本降到不到1%
 这就是为什么Claude Code能把平均成本控制在$6/天——双模型策略是关键。