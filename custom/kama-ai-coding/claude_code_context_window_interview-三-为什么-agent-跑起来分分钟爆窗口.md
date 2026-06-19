---
title: 三、为什么 Agent 跑起来分分钟爆窗口？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [AI编程, 卡码笔记]
point: 三、为什么 Agent 跑起来分分钟爆窗口？
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/claude_code_context_window_interview.html

> 来源文章：Claude Code上下文窗口面试详解：Auto-Compact、上下文压缩与Agent记忆管理

---

**题目**：三、为什么 Agent 跑起来分分钟爆窗口？

**结论句（15 秒）**：# Claude Code上下文窗口面试详解：Auto-Compact、上下文压缩与Agent记忆管理  不少读者问我，如何充值Claude会员，我在这里篇单独讲一下：国内Claude充值会员的方法

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

# Claude Code上下文窗口面试详解：Auto-Compact、上下文压缩与Agent记忆管理  不少读者问我，如何充值Claude会员，我在这里篇单独讲一下：国内Claude充值会员的方法

 前面我们已经写过两篇 Claude Code 文章：

 - Claude Code大厂面试题汇总：从 Agent Loop、工具链、系统提示词、安全机制整体拆了一遍
 - Claude Code为什么不用RAG检索代码：重点讲 Grep、Glob、Read、子 Agent 和代码检索的关系
 但还有一个问题，面试官特别爱追问：

 Claude Code 上下文窗口快满了怎么办？Auto-Compact 到底在压什么？为什么压完之后还能继续干活？

 很多同学一听上下文窗口，就回答：&quot;就是模型能记住多少内容。&quot;

 上下文窗口不是记忆。上下文压缩也不是简单&quot;总结一下&quot;。

 如果你做过 Agent，就会知道：上下文管理是 Agent 能不能长时间稳定工作的核心能力。

 今天这篇，我们从最基础的上下文窗口讲起，一步一步讲到 Claude Code 的 Auto-Compact，最后给你一套面试可以直接说的回答框架。

普通聊天为什么不容易爆？

 因为普通聊天主要就是用户问题和模型回答。

 你问一句，模型答一句。内容再多，也通常是线性增长。

 但 Agent 不一样。

 Agent 每一轮都可能调用工具，而工具结果也会进入上下文。

 Claude Code 这种编程 Agent，一次任务里可能会做这些事：

 - 读 package.json
 - 搜索路由入口
 - 读取组件文件
 - 执行测试命令
 - 拿到几百行报错日志
 - 修改文件
 - 再跑测试
 - 再读相关依赖
 - 再对比 diff
 - 再生成下一步计划
 这不是聊天，这是带执行轨迹的工作流。

 

 一个最典型的场景是修 bug。

 你只说了一句话：&quot;帮我修一下登录失败的问题。&quot;

 但 Claude Code 可能要跑很多步：

 - 搜 login
 - 读登录页
 - 读 API 封装
 - 读鉴权中间件
 - 跑测试
 - 看到报错
 - 再读环境变量配置
 - 改代码
 - 再跑测试
 - 再看新报错
 每一步都会产生上下文。

 尤其是三类内容，特别吃 token：

 第一类，大文件内容。

 读一个几百行文件，很容易就是几千 token。

 第二类，命令输出。

 测试日志、构建日志、堆栈报错，一长就是几百行。

 第三类，中间推理轨迹。

 模型每一步的解释、计划、工具调用参数、工具返回结果，都会累计。

 所以面试时要说清楚：Agent 爆上下文，不是因为用户说得多，而是因为工具调用轨迹太重。

 这句话很关键。