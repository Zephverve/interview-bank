---
title: "LangChain 和 LangGraph 有什么区别？"
round: 一面
difficulty: ⭐⭐⭐
tags: [LangGraph, 基础]
point: "框架对比"
source: 牛客 · 阿里淘天/某大厂
sourceUrl: https://www.nowcoder.com/feed/main/detail/edbf58731d884f8f9e094a9b2eda0cf9
---

**题目**：LangChain 和 LangGraph 有什么区别？

**结论句（15 秒）**：LangChain 是线性 DAG 流水线，适合固定步骤 RAG；LangGraph 是图状态机，支持循环、条件分支、显式 State 和 checkpoint，适合复杂 Agent。

**追问方向**：什么场景必须用 LangGraph？ · 和纯 while 循环比优势？ · 能否混用？

### 回答

**优先级**：P0 · 6+ 篇面经

**🗣️ 标准口语答案**

我会先把它们定位说清楚：LangChain 的核心是 Chain 和 LCEL，本质是单向流水线，A 到 B 到 C，适合标准化 RAG、单次问答这类确定性流程。LangGraph 是在 LangChain 生态上的编排层，把 Agent 工作流建模成有向图，每个节点读写共享 State，边可以是条件边，还支持回边形成循环。

最大的差异有三点：第一是控制流，LangGraph 原生支持循环和条件跳转，比如代码生成→运行→报错→修改代码这种 ReAct 闭环，在 LangChain 里写起来很别扭；第二是状态管理，LangGraph 有显式 State 和 reducer，节点之间自动合并更新，LangChain 要么无状态要么自己管记忆；第三是生产特性，LangGraph 有 checkpoint 和 interrupt，能做断点续跑和人工审批，这是做严肃 Agent 系统的关键。

我的选型原则是：如果流程是固定的三四步，用 LangChain Workflow 就够了；一旦出现循环、多 Agent 协作、或者需要中途挂起等人工输入，就上 LangGraph。【替换点：可以举一个你项目里的具体场景，比如审批流或重试流】

