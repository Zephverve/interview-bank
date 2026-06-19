---
title: 7. Function Call、MCP、Skills 三者区别与协作？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [Agent, 卡码笔记]
point: 7. Function Call、MCP、Skills 
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/agent_interview.html

> 来源文章：Agent大厂面试题汇总：ReAct、Function Calling、MCP、RAG高频问题

---

**题目**：7. Function Call、MCP、Skills 三者区别与协作？

**结论句（15 秒）**：面试官会问：&quot;这三个东西我感觉都是让 Agent 能干更多事，能用一个统一的比喻讲清楚吗

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官会问：&quot;这三个东西我感觉都是让 Agent 能干更多事，能用一个统一的比喻讲清楚吗？&quot;

 用&quot;新员工入职&quot;来类比：Function Call 是打电话的基础能力，MCP 是公司统一的通讯录和电话系统，Skills 是岗位培训手册。

 

 

### 技术层面的三维对比

  Function Call MCP Skills 解决的问题 LLM 如何调用函数 工具集成标准化 领域知识编码 运行位置 你的应用程序 外部 MCP Server Agent 上下文窗口 技术本质 API 协议 通信标准 提示词扩展 外部调用 有 有 无 标准化程度 各厂商不统一 开放统一标准 无统一标准 何时生效 LLM 调用时 工具被调用时 注入上下文时 一句话总结：Skills 决定「怎么想」→ MCP 决定「用什么」→ Function Call 决定「怎么调」。

 

### 三者协作的完整流程

 用户说&quot;帮我审查 agent.py 这个文件&quot;，完整流程是这样的：

 - Skills 匹配：检测到&quot;审查&quot;关键词 → 加载 Code_Review Skill → &quot;好，我知道审查要关注安全/性能/质量三个维度&quot;
 - Agent 规划（受 Skill 指导）：&quot;我需要先读文件，再用 linter 检查&quot;
 - MCP 工具发现：发现有 filesystem MCP Server 和 linter MCP Server
 - Function Call 执行：生成调用指令 read_file(&quot;agent.py&quot;) → MCP Client 转发给 filesystem Server → 获取文件内容
 - 再次 Function Call：run_linter(&quot;agent.py&quot;) → 获取 lint 结果
 - LLM 综合分析（按 Skill 规范）：输出标准格式的代码审查报告