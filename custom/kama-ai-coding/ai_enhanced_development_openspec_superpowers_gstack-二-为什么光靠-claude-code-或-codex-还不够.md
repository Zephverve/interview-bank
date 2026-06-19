---
title: 二、为什么光靠 Claude Code 或 Codex 还不够？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [AI编程, 卡码笔记]
point: 二、为什么光靠 Claude Code 或 Codex 
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/ai_enhanced_development_openspec_superpowers_gstack.html

> 来源文章：AI增强开发三件套：OpenSpec、Superpowers、gstack怎么把 Vibe Coding 拉回工程交付

---

**题目**：二、为什么光靠 Claude Code 或 Codex 还不够？

**结论句（15 秒）**：面试官可能会追问：“Claude Code 和 Codex 已经很强了，为什么还需要 OpenSpec、Superpowers、gstack 这种东西

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官可能会追问：“Claude Code 和 Codex 已经很强了，为什么还需要 OpenSpec、Superpowers、gstack 这种东西？”

 先承认事实：

 Claude Code 和 Codex 确实很强。

 它们能读代码、改文件、跑测试、处理错误、调用工具，复杂任务也能跑很多步。

 但强模型解决的是“能力问题”，不是“流程问题”。

 一个很强的 Agent，也可能犯这些错误：

 - 需求没澄清就开始写
 - 只实现 happy path
 - 测试写得像证明自己没错
 - 代码 Review 只看表面
 - 浏览器里真实流程没走一遍
 - 上线后没有复盘失败原因
 这些问题不是换一个更大的模型就自动消失。

 因为 Agent 的默认倾向是“尽快完成用户请求”。

 用户说“帮我做个功能”，它就会努力做功能。

 但一个成熟工程师不会立刻开写。

 成熟工程师会先问：

 - 这个需求到底解决谁的问题？
 - 哪些场景必须支持？
 - 哪些边界不能碰？
 - 失败后怎么恢复？
 - 代码改动会影响哪些模块？
 - 怎么证明它真的对？
 AI 增强开发三件套，就是把这些工程动作外化出来。

 

 你可以把它们理解成三层：

 OpenSpec 管“做什么”。

 它把需求变成 proposal、design、tasks、spec delta，让需求变化能被审查。

 Superpowers 管“怎么做”。

 它把澄清需求、设计确认、TDD、子 Agent 执行、代码审查变成 Agent 应该遵守的开发纪律。

 gstack 管“怎么交付”。

 它把产品复盘、工程计划评审、代码 Review、浏览器 QA、发布检查、复盘沉淀串成一个交付流程。

 一句话：

 模型负责生成，三件套负责约束生成。