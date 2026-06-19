---
title: 五、上下文管理对比：窗口满了怎么办？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [Agent, 卡码笔记]
point: 五、上下文管理对比：窗口满了怎么办？
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/agent_framework_comparison.html

> 来源文章：OpenClaw、Hermes Agent、Claude Code三框架横评：面试必懂的对比

---

**题目**：五、上下文管理对比：窗口满了怎么办？

**结论句（15 秒）**：面试官会问：&quot;这三个框架怎么管理上下文窗口

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官会问：&quot;这三个框架怎么管理上下文窗口？窗口满了怎么办？&quot;

 

### OpenClaw：文件注入 + 动态裁剪

 OpenClaw的上下文管理比较简单：每次对话开始，把AGENTS.md、SOUL.md、TOOLS.md的内容注入，然后对话历史逐步累积。

 窗口快满的时候，OpenClaw的策略是动态裁剪——按时间顺序把最早的对话内容裁掉，保留最近的。这和大多数聊天应用的&quot;滑动窗口&quot;一样，简单粗暴但没有更精细的策略。

 OpenAI在做Codex时踩过一个坑：早期把AGENTS.md写成百科全书，内容越来越长，模型注意力被严重稀释。后来改成&quot;目录页&quot;模式——主文件只保留约100行核心索引，详细内容拆到子文档，Agent按需加载。这就是渐进式披露（Progressive Disclosure）。

 

### Hermes Agent：just-in-time retrieval + 分层注入

 Hermes的上下文管理更精细，核心是just-in-time retrieval——不是一开始就把所有信息塞进去，而是Agent边干活边按需抓取。

 分层注入策略：

 - 始终注入：AGENTS.md核心规则、当前任务目标
 - 按需加载：技能详情、历史会话片段、工具说明
 - 动态替换：根据当前步骤，把不再需要的上下文替换成新的
 Hermes还用FTS5做上下文检索——不是把所有历史对话都塞进窗口，而是根据当前任务搜索最相关的片段，只把相关片段注入。

 

### Claude Code：200K窗口 + 三层压缩 + Context Reset

 Claude Code的上下文管理是三个框架里最工程化的，分三层：

 第一层：对话历史管理

 200K Token的上下文窗口，按优先级排列：

 - System Prompt（~8,700 Token，不可压缩）
 - 对话历史（最近N轮完整保留）
 - 工具返回结果（大文件自动截断）
 第二层：自动压缩

 当上下文接近窗口上限时，Claude Code自动触发压缩：

 - 早期对话压缩成摘要
 - 工具返回的大文件只保留关键片段
 - 子Agent的执行结果只保留摘要，不保留完整过程
 第三层：Context Reset

 这是Anthropic在Harness Engineering里提出的关键方案——当压缩都不够时，直接把整个上下文窗口丢掉，换一个干净的。

 听起来很暴力，但逻辑是：状态已经外化到文件系统了，新窗口从文件里一读就知道&quot;现在到哪一步&quot;。这比在腐化的上下文里硬撑要好得多。

 就像遇到内存泄漏时的做法——不拼命优化内存，直接重启进程，从磁盘恢复状态。重启胜过修补。

 

 

### 上下文管理对比表

 维度 OpenClaw Hermes Agent Claude Code 上下文窗口 依赖底层模型 依赖底层模型 200K Token 满窗口策略 动态裁剪（滑动窗口） just-in-time检索 三层压缩 + Context Reset 规则文件策略 全量注入 渐进式披露 CLAUDE.md分层 + 按目录注入 历史对话管理 裁剪旧内容 FTS5检索相关片段 摘要压缩 子Agent上下文 不支持 并行子Agent共享 子Agent独立窗口，结果摘要返回 

 

### 面试答法

 先说核心矛盾：上下文窗口是稀缺资源，三个框架都在解决&quot;有限窗口里放什么&quot;的问题。

 OpenClaw最简单——滑动窗口裁剪旧内容。Hermes更精细——just-in-time按需加载，只把相关的片段注入。Claude Code最工程化——三层压缩机制，实在不行就Context Reset整个换新窗口，状态从文件系统恢复。

 Context Reset是面试加分点：说清楚&quot;重启胜过修补&quot;的思路，状态外化到文件是前提条件，否则Reset就真的失忆了。