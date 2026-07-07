---
title: 面试八股文 · 总目录
titleTemplate: false
pageClass: guides-doc
outline: [2, 3]
aside: true
---

<p class="guide-chapter-badge">面试八股文 · 总目录</p>

<p class="guide-lead">本目录包含 9 大模块的 AI Agent 面试八股文，覆盖从基础概念到工程实践的完整知识体 系。每个模块包含：概念解释、原理详解、面试问题、标准答案、追问应对、代码示例。合 计 200+ 道面试题。</p>

模块导航

第一部分：核心概念与框架
 序    模块          文件               核心内容           面试题
 号                                                 数
 01   基础概   01-基础概     Agent 定义、组成、分类、与           27 题
      念     念.md       Chain/ChatBot 区别
 02   核心框   02-核心框     ReAct、Plan-and-Execute、    27 题
      架     架.md       Reflexion、LangGraph

第二部分：核心技术

 序    模块         文件                        核心内容               面试题
 号                                                             数
03   RAG 技    03-RAG  技        分块策略、向量数据库、混合检索、重排             24+ 题
     术        术.md             序、GraphRAG
04   工具调      04-工具调           Function Calling、MCP 协议、工具路    17+ 题
     用        用.md             由、安全
05   记忆系      05-记忆系           短期/长期记忆、摘要压缩、记忆检索策             20 题
     统        统.md             略
06   多智能      06-多智能           协作模式、通信机制、冲突解决、主流框             20 题
     体        体.md             架

第三部分：基础与工程
 序     模块             文件                    核心内容               面试
 号                                                             题数
07   大模型基       07-  大模型基        Transformer、Attention、KV     28 题
     础         础.md              Cache、LoRA、RLHF/DPO
08   工程化实       08-  工程化实        模型路由、熔断器、Token 优化、可          29+
     践         践.md              观测性、部署                       题
09   Prompt     09-Prompt  工     CoT、Few-shot、ReAct 模板、       28 题
     工程        程.md              Prompt 注入防御

学习建议

如果你是完全的小白（建议顺序）

  01-基础概念 → 09-Prompt工程 → 03-RAG技术 → 04-工具调用
  → 02-核心框架 → 05-记忆系统 → 06-多智能体
  → 07-大模型基础 → 08-工程化实践

如果你有一定基础（按优先级）
  02-核心框架（ReAct 必考） → 03-RAG技术（高频）
  → 04-工具调用（MCP 热点） → 08-工程化实践（企业级加分）
  → 其余模块查漏补缺

面试前一晚速查
重点复习以下高频考点：
 ReAct 循环（02）
 RAG 完整流程与优化（03）
 MCP vs Function Calling（04）
 记忆系统设计（05）
 多 Agent 协作模式（06）
 三态熔断器（08）
 ReAct Prompt 模板（09）
