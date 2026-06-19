---
title: 三、记忆机制对比：各自怎么管理状态？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [Agent, 卡码笔记]
point: 三、记忆机制对比：各自怎么管理状态？
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/agent_framework_comparison.html

> 来源文章：OpenClaw、Hermes Agent、Claude Code三框架横评：面试必懂的对比

---

**题目**：三、记忆机制对比：各自怎么管理状态？

**结论句（15 秒）**：面试官会问：&quot;这三个框架的记忆系统分别怎么实现的

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

这是面试最核心的考点。面试官会问：&quot;这三个框架的记忆系统分别怎么实现的？有什么区别？&quot;

 

### OpenClaw：文件注入 + 本地持久化

 OpenClaw的记忆靠三个文件：

 - AGENTS.md——项目级规范和上下文，每次对话都注入
 - SOUL.md——Agent的&quot;灵魂&quot;，定义角色、性格、说话风格
 - TOOLS.md——可用工具的说明和规则
 每次对话开始，这三个文件的内容直接塞进System Prompt。对话过程中的中间结果，写到本地文件系统持久化。

 问题在于：OpenClaw没有跨会话记忆。每次对话都是&quot;新手&quot;，不会记住上次聊了什么、做过什么。AGENTS.md是你手动写的规则，不是Agent自己学到的经验。

 

### Hermes Agent：分层记忆 + 用户建模 + 跨会话搜索

 Hermes的记忆是三个框架里最深的，分了好几层：

 第一层：持久化记忆——对话历史和执行结果存到本地，下次启动可以加载。

 第二层：用户建模（Honcho）——Hermes内置了一个方言式用户建模系统，会主动学习和记录用户的偏好、习惯、工作方式。不是简单的&quot;记住你上次说了什么&quot;，而是&quot;理解你是哪种类型的人&quot;。

 第三层：跨会话搜索（FTS5）——用SQLite的FTS5全文搜索引擎，在历史对话中检索相关片段。你问&quot;上次那个部署脚本怎么写的&quot;，Hermes能从过去的会话里搜出来。

 第四层：自我督促——Hermes会主动提醒自己&quot;这个用户上次不喜欢长回复&quot;、&quot;这个项目用TypeScript&quot;。相当于Agent自己给自己写备忘录。

 最关键的是，Hermes的记忆不只是&quot;记住&quot;，还能转化为技能——执行完一个复杂任务，自动从经验中提取模式生成一个skill文件，存在~/.hermes/skills/，下次遇到类似任务直接复用。

 

### Claude Code：CLAUDE.md + .claude/目录 + 外化状态

 Claude Code的记忆系统有三个层次：

 第一层：CLAUDE.md（项目知识）——放在项目根目录，定义项目规范、技术栈、代码风格。每次对话都注入，但不是放在System Prompt里，而是作为用户消息注入——优先级低于安全规则，但高于普通用户消息。这是Anthropic做的一个安全设计。

 CLAUDE.md还有层级结构：根目录的CLAUDE.md全局生效，子目录的CLAUDE.md只在进入该目录时注入。这样不同模块可以有不同的规范。

 

 第二层：.claude/目录（会话状态）——Agent的中间状态、任务进度、分析结论都外化到文件系统。这就是Harness Engineering里说的&quot;状态外化&quot;——不在上下文窗口里存状态，而是写到文件里。

 好处是：即使Context Reset（整个上下文窗口丢掉换新的），从文件里一读就知道&quot;现在到哪一步了&quot;。

 第三层：记忆文件系统——Claude Code支持在~/.claude/目录下存放跨项目的长期记忆，比如用户偏好、常用命令模式。

 

### 记忆机制对比表

 维度 OpenClaw Hermes Agent Claude Code 工作记忆 AGENTS.md/SOUL.md/TOOLS.md注入 AGENTS.md + 动态加载 CLAUDE.md作为用户消息注入 短期记忆 本地文件持久化 对话历史 + FTS5搜索 .claude/目录 + 会话状态文件 长期记忆 无 Honcho用户建模 + 跨会话搜索 ~/.claude/目录 + 分层CLAUDE.md 经验积累 无（每次都是新手） 学习闭环：执行→总结→生成skill 无自动积累，靠人维护CLAUDE.md 跨会话 不支持 支持（FTS5 + Honcho） 支持（文件系统外化） 记忆检索 无 FTS5全文搜索 + 语义匹配 文件读取（Read工具） 

 

### 面试答法

 先说分层：三个框架都有工作记忆（规则注入），但在短期和长期记忆上差异很大。

 OpenClaw最简单——只靠文件注入，没有跨会话记忆，每次都是&quot;新手&quot;。

 Hermes最深——有用户建模、跨会话搜索、学习闭环，能从经验中自动生成技能，越用越强。

 Claude Code最工程化——靠文件系统外化状态，CLAUDE.md分层注入，不做自动学习但做安全隔离。关键设计是CLAUDE.md作为用户消息注入而非System Prompt，防止安全规则被覆盖。