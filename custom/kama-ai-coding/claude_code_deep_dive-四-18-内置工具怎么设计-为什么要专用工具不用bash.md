---
title: 四、18+内置工具怎么设计？为什么要专用工具不用Bash？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [AI编程, 卡码笔记]
point: 四、18+内置工具怎么设计？为什么要专用工具不用Bash
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/claude_code_deep_dive.html

> 来源文章：Claude Code大厂面试题汇总：源码泄露、Agent Loop、系统提示词全拆解|深度解析Claude Code工作原理

---

**题目**：四、18+内置工具怎么设计？为什么要专用工具不用Bash？

**结论句（15 秒）**：面试官会问：&quot;Claude Code有哪些内置工具

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官会问：&quot;Claude Code有哪些内置工具？为什么要设计专用工具而不是全用Bash？&quot;

 模型再聪明，没有工具就只能说话。Claude Code的18+内置工具，就是它的手和脚——让它能真正操作你的代码。

 

### 工具全景图

 

 按功能分类：

 文件操作类

 工具 功能 关键特点 Read 读取文件 支持图片、PDF、Jupyter Notebook Write 写入文件 完整覆盖，适合新建文件 Edit 编辑文件 精确替换，只发送diff Glob 文件搜索 按模式匹配文件路径 Grep 内容搜索 在文件内容中搜索关键词 执行类

 工具 功能 关键特点 Bash 执行Shell命令 支持超时、后台运行 NotebookEdit 编辑Jupyter 操作notebook的cell 网络类

 工具 功能 关键特点 WebFetch 抓取网页 自动HTML转Markdown WebSearch 搜索网络 获取实时信息 Agent类

 工具 功能 关键特点 Agent 启动子Agent 并行处理复杂任务 Skill 调用技能 执行预定义的工作流 交互类

 工具 功能 关键特点 AskUserQuestion 向用户提问 多选/单选/自由输入 TodoWrite 任务管理 创建和跟踪任务列表 

### 工具设计的核心原则

 原则一：专用工具优先于通用命令

 Claude Code的系统提示词里明确写了：

 &quot;Prefer dedicated tools over Bash when one fits (Read, Edit, Write) — reserve Bash for shell-only operations.&quot;

 为什么不直接用cat读文件、用sed改文件？因为专用工具有更好的错误处理、权限控制和用户体验。用户能看到&quot;Claude正在编辑文件&quot;，而不是看到一堆shell命令。

 原则二：Edit工具只发送diff

 这是一个很聪明的设计。Edit工具不是重写整个文件，而是指定old_string和new_string，只替换匹配的部分。

 好处：

 - 节省Token——不需要在上下文里放整个文件内容
 - 减少冲突——只改需要改的部分
 - 便于审查——用户一眼看到改了什么
 坏处：

 - old_string必须唯一匹配——如果文件里有重复内容，需要提供更多上下文来定位
 原则三：工具描述即规则

 每个工具的description字段里都嵌入了使用规则。比如Bash工具的描述长达几百字，包含：

 - 什么时候该用Bash，什么时候不该用
 - 怎么处理长时间运行的命令
 - Git操作的安全规范
 - 多命令并行的最佳实践
 模型每次想调用工具时，都会重新看到这些规则。 这比只在系统提示词里写一次要可靠得多。

 

### Bash工具：最强大也最危险

 Bash是Claude Code里最强大的工具——理论上它能执行任何shell命令。但也正因如此，它的限制最多：

 - 默认2分钟超时——防止无限循环
 - 不支持交互式命令——不能用vim、不能用git rebase -i
 - 长时间命令要后台运行——dev server、watch模式不能阻塞
 - 权限检查最严格——rm -rf、git push --force都需要用户确认
 这个设计体现了一个核心理念：给AI足够的能力，但用规则约束它的行为边界。