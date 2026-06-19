---
title: 11. RAG 和 Agent 是什么关系？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [Agent, 卡码笔记]
point: 11. RAG 和 Agent 是什么关系？
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/agent_interview.html

> 来源文章：Agent大厂面试题汇总：ReAct、Function Calling、MCP、RAG高频问题

---

**题目**：11. RAG 和 Agent 是什么关系？

**结论句（15 秒）**：面试官会问：&quot;RAG 和 Agent 有什么区别

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官会问：&quot;RAG 和 Agent 有什么区别？什么时候用 RAG，什么时候用 Agent？&quot;

 

### RAG 是什么？

 RAG（检索增强生成）是一种给 LLM 补充外部知识的技术：用户问题 → 向量检索找到相关文档片段 → 把文档片段塞进 Prompt → LLM 基于检索到的内容回答。

 

### RAG vs Agent

  RAG Agent 目的 补充知识 完成任务 流程 固定（检索→生成） 动态（思考→行动） 工具使用 仅检索工具 任意工具 自主性 无 有 适合场景 知识问答/文档查询 复杂任务/多步操作 

### RAG 是 Agent 的一个工具

 别把 RAG 和 Agent 对立起来。Agent 把 RAG 当作工具之一：

 - 当 Agent 判断需要知识时 → 调用 RAG 检索工具
 - 当 Agent 判断需要操作时 → 调用 API/数据库工具
 - 当 Agent 判断需要计算时 → 调用代码执行工具
 RAG 是 Agent 工具箱里的&quot;知识查询器&quot;。 面试时说出这个关系，比单纯对比两者的区别要有深度得多。RAG 本身的检索策略、混合检索、Rerank、幻觉处理是另一大块高频考点，单独展开见 RAG 大厂面试题汇总。

 

### Agentic RAG：进阶玩法

 还有一种模式叫 Agentic RAG——把 RAG 本身做成一个 Agent。普通 RAG 是固定流程：检索一次就完事；Agentic RAG 是 Agent 自己判断检索策略：需要检索哪些数据源？检索结果够不够？不够就换个角度再检索。这种方式对复杂知识问答场景效果很好。