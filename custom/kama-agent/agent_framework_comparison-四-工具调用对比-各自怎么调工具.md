---
title: 四、工具调用对比：各自怎么调工具？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [Agent, 卡码笔记]
point: 四、工具调用对比：各自怎么调工具？
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/agent_framework_comparison.html

> 来源文章：OpenClaw、Hermes Agent、Claude Code三框架横评：面试必懂的对比

---

**题目**：四、工具调用对比：各自怎么调工具？

**结论句（15 秒）**：面试官会问：&quot;这三个框架的工具调用机制有什么不同

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官会问：&quot;这三个框架的工具调用机制有什么不同？&quot;

 

### OpenClaw：MCP协议 + ClawHub技能市场

 OpenClaw的工具系统基于MCP协议，所有工具都通过MCP标准化接口接入。

 它还有一个ClawHub技能市场——社区贡献的工具和技能包，装上就能用。这就像手机上的App Store，技能生态丰富是OpenClaw的一大优势。

 执行环境方面，OpenClaw用Docker沙箱或SSH后端来隔离工具执行——工具跑在沙箱里，不会直接操作宿主系统。

 

### Hermes Agent：MCP + 自生成技能

 Hermes也用MCP协议，但在工具系统上做了两个升级：

 第一，技能可以自动生成——不是只靠社区贡献，Agent执行完任务后能自己总结出一套技能，存在~/.hermes/skills/，遵循agentskills.io标准。下次遇到类似任务，搜索已有技能直接复用。

 第二，工具白名单机制——不是所有MCP工具都给Agent用，而是根据任务动态决定哪些工具可用。减少Agent&quot;选错工具&quot;的概率。

 Hermes还支持6种终端后端（本地、Docker、SSH、K8s等），适应不同部署环境。

 

### Claude Code：18+内置工具 + 权限分级

 Claude Code没有用MCP协议（虽然支持MCP Server接入），它走的是专用内置工具路线——18+工具全部在代码里定义，每个工具有严格的参数Schema和使用规则。

 工具分五大类：文件操作（Read/Write/Edit/Glob/Grep）、执行（Bash/NotebookEdit）、网络（WebFetch/WebSearch）、Agent（Agent/Skill）、交互（AskUserQuestion/TodoWrite）。

 最关键的设计是权限分级：

 deny &gt; ask &gt; allow
 1
每个工具调用前，先查权限表：

 - deny：直接拒绝，不执行
 - ask：弹窗问用户，用户确认才执行
 - allow：直接执行
 而且权限可以按工具+路径粒度配置——比如&quot;允许读src/目录，但写src/目录要ask&quot;。

 Claude Code还做了一个设计：专用工具优先于通用命令。系统提示词里明确写了&quot;Prefer dedicated tools over Bash&quot;——能用Read就读文件，别用cat；能用Edit就改文件，别用sed。因为专用工具有更好的错误处理和权限控制。

 

### 工具调用对比表

 维度 OpenClaw Hermes Agent Claude Code 工具协议 MCP MCP 内置定义 + MCP Server支持 工具来源 ClawHub社区市场 自动生成 + agentskills.io标准 18+内置工具 执行隔离 Docker/SSH沙箱 6种终端后端 本地直接执行 + 权限分级 权限控制 沙箱隔离 工具白名单 deny &gt; ask &gt; allow三级 工具选择策略 Prompt驱动 动态白名单 工具描述即规则 + 专用工具优先 技能复用 社区市场下载 自动生成 + 社区标准 Skill调用预定义工作流 

 

### 面试答法

 先说共性：三者都支持MCP协议接入外部工具。再说差异：OpenClaw靠ClawHub社区生态，工具多但Agent容易选错；Hermes加了技能自动生成和动态白名单，减少选错概率；Claude Code走专用工具路线，每个工具都有严格定义和权限控制，工具描述里就嵌了使用规则，相当于双重保险。