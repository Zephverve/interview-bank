---
title: 十、压完之后，Claude Code 怎么接续对话？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [AI编程, 卡码笔记]
point: 十、压完之后，Claude Code 怎么接续对话？
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/claude_code_context_window_interview.html

> 来源文章：Claude Code上下文窗口面试详解：Auto-Compact、上下文压缩与Agent记忆管理

---

**题目**：十、压完之后，Claude Code 怎么接续对话？

**结论句（15 秒）**：简单理解，旧的长历史被替换成一段结构化摘要

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

压缩之后发生了什么？

 简单理解，旧的长历史被替换成一段结构化摘要。

 然后新一轮对话继续运行。

 但这里还有几个细节。

 第一，系统提示词不属于普通对话历史，它不会因为 compact 消失。

 第二，项目根的 CLAUDE.md、auto memory 这类启动内容会重新注入。

 第三，路径规则、嵌套目录里的 CLAUDE.md、某些按文件触发的规则，可能要等再次读取对应文件后才重新加载。

 第四，已经调用过的 skill 可能会被重新注入，但会受 token 预算限制。

 这说明什么？

 说明压缩后的接续，不是靠模型&quot;记忆力好&quot;。

 而是靠系统把上下文重新组织成几类内容：

 - 稳定规则：系统提示词、根 CLAUDE.md、memory
 - 当前任务状态：compact 生成的摘要
 - 后续按需加载：文件内容、路径规则、子目录规则、工具结果
 

 所以 Claude Code 压完还能继续，不是因为所有细节都保住了。

 而是因为它保住了继续执行所必需的最小状态。

 这也是上下文压缩的核心取舍：

 不是尽量不丢信息，而是优先不丢会影响下一步行动的信息。