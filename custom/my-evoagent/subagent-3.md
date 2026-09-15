---
title: 运行时怎么干预正在跑的 SubAgent？
round: 二面
difficulty: ⭐⭐⭐
tags: [evoagent, 面试]
point: 运行时怎么干预正在跑的 SubAgent？
---

**题目**：运行时怎么干预正在跑的 SubAgent？

### 回答

**关键点：不重启 SubAgent，而是往它的 working memory 里注入 `key_info`。**

"Conductor 发现某个 SubAgent 走偏了，通过 `POST /subagent/{id}` 带 action=keyinfo，把新的上下文指令写进它的 `handler.working['key_info']`。SubAgent 在**下一轮 ReAct 循环**时，anchor prompt 会自动把 `key_info` 注入进去，它就看到了新指令。"

**为什么这么做而不是重启 SubAgent？**

"重启意味着丢掉已经完成的工作 —— 一个跑了几十轮的子任务，重启的成本可能比走偏的损失还大。注入 key_info 是**增量修正**，已经完成的部分保留，后续执行按新指令走。"

**为什么不打断当前回合？**

"注入发生在工具调用边界，不打断正在进行的原子操作。如果 `code_run` 正在执行、文件写到一半，这时候注入会导致状态不一致。宁可晚一轮生效，也不能让 SubAgent 处在不一致的中间状态。"
