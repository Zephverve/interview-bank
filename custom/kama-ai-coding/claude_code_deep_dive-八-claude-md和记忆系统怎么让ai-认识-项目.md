---
title: 八、CLAUDE.md和记忆系统怎么让AI「认识」项目？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [AI编程, 卡码笔记]
point: 八、CLAUDE.md和记忆系统怎么让AI「认识」项目？
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/claude_code_deep_dive.html

> 来源文章：Claude Code大厂面试题汇总：源码泄露、Agent Loop、系统提示词全拆解|深度解析Claude Code工作原理

---

**题目**：八、CLAUDE.md和记忆系统怎么让AI「认识」项目？

**结论句（15 秒）**：面试官会问：&quot;CLAUDE.md是干什么的

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官会问：&quot;CLAUDE.md是干什么的？为什么不能放在系统提示词里？&quot;或者&quot;AI的记忆系统怎么设计？记忆和实际代码状态不一致怎么办？&quot;

 每次开启新对话，Claude Code都是一张白纸——它不知道你的项目结构、编码规范、技术栈偏好。CLAUDE.md就是解决这个问题的。

 

### CLAUDE.md：项目级的"说明书"

 CLAUDE.md是一个放在项目根目录的文件，每次对话开始时会自动加载到上下文中。你可以在里面写：

 - 项目架构说明
 - 常用命令（构建、测试、部署）
 - 编码规范和风格要求
 - 技术栈和依赖说明
 - 已知问题和注意事项
 # CLAUDE.md

## 项目概述
这是一个基于Next.js 14的电商平台，使用App Router。

## 常用命令
- npm run dev：启动开发服务器
- npm run test：运行测试
- npm run build：构建生产版本

## 编码规范
- 使用TypeScript strict模式
- 组件使用函数式写法
- 状态管理使用Zustand
- API请求使用React Query
 1
2
3
4
5
6
7
8
9
10
11
12
13
14
15

### 三层CLAUDE.md

 Claude Code支持三个层级的CLAUDE.md，优先级从高到低：

 层级 位置 作用域 项目级 项目根目录/CLAUDE.md 整个项目 目录级 子目录/CLAUDE.md 该目录下的文件 用户级 ~/.claude/CLAUDE.md 所有项目 目录级CLAUDE.md特别有用。 比如你的前端目录和后端目录有不同的编码规范，可以分别写CLAUDE.md。

 

### 记忆系统：跨对话的持久化

 CLAUDE.md解决了项目级的上下文问题，但还有一类信息是跨项目、跨对话的——比如你的编码偏好、你的角色背景、你之前给过的反馈。

 Claude Code的记忆系统用文件存储这些信息：

 ~/.claude/projects/&lt;project&gt;/memory/
├── MEMORY.md          # 记忆索引
├── user_role.md       # 用户角色信息
├── feedback_style.md  # 用户反馈的工作风格偏好
└── project_context.md # 项目背景信息
 1
2
3
4
5
记忆分四种类型：

 - user：用户的角色、偏好、知识背景
 - feedback：用户对AI行为的纠正和确认
 - project：项目的目标、进度、决策背景
 - reference：外部资源的指针（如&quot;bug追踪在Linear的INGEST项目里&quot;）
 

### 记忆的核心原则："可疑索引，不是可信真相"

 

 这是记忆系统设计中最重要的一点：记忆是索引，不是真相。

 系统提示词里明确写了：

 &quot;Memory records can become stale over time... Before answering the user or building assumptions based solely on information in memory records, verify that the memory is still correct and up-to-date by reading the current state of the files.&quot;

 翻译成人话：AI不能因为记忆里写了&quot;config.js在第50行有路由配置&quot;就直接去改第50行——它必须先读文件确认。 因为上次记忆的时候是第50行，现在可能已经变了。

 这个设计非常务实。记忆帮AI快速定位信息，但最终决策必须基于当前代码的实际状态。

 

### CLAUDE.md的安全边界

 前面提到，CLAUDE.md是作为用户消息注入的，不是系统提示词。这意味着：

 - CLAUDE.md不能覆盖Anthropic的安全规则
 - CLAUDE.md不能让AI执行被deny的操作
 - CLAUDE.md可以自定义编码风格、项目规范、工作流程
 这是一个精心设计的信任边界：项目维护者可以定制AI的行为，但不能突破安全底线。