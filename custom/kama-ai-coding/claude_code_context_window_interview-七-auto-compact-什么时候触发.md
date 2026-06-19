---
title: 七、Auto-Compact 什么时候触发？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [AI编程, 卡码笔记]
point: 七、Auto-Compact 什么时候触发？
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/claude_code_context_window_interview.html

> 来源文章：Claude Code上下文窗口面试详解：Auto-Compact、上下文压缩与Agent记忆管理

---

**题目**：七、Auto-Compact 什么时候触发？

**结论句（15 秒）**：Auto-Compact 的触发逻辑，可以用一句话理解：

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

Auto-Compact 的触发逻辑，可以用一句话理解：

 不是等窗口彻底满了才压，而是在接近上限、还留有摘要空间时提前压。

 为什么要提前？

 因为压缩本身也需要 token。

 如果等上下文真的 100% 塞满，再让模型生成摘要，就可能已经没有足够空间完成压缩。

 所以成熟系统都会预留一段空间给压缩流程。

 Claude Code 里你也可以通过 /context 看当前上下文使用情况，通过 /compact 手动压缩，通过 /clear 清空当前对话历史。

 这三个命令的语义不一样：

 命令 作用 适合场景 /context 查看上下文占用 想知道 token 花在哪 /compact 摘要当前会话并继续 当前任务没做完，还要接着干 /clear 清空聊天历史 已切换任务，不需要旧上下文 

 面试时这里可以加一句：

 Auto-Compact 不是异常恢复机制，而是上下文预算管理机制。

 这句话比&quot;满了就总结&quot;高级很多。