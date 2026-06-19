---
title: 11. Agentic RAG 是什么？和普通 RAG 有什么区别？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [RAG, 卡码笔记]
point: 11. Agentic RAG 是什么？和普通 RAG 
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/rag_interview.html

> 来源文章：RAG大厂面试题汇总：向量检索、混合检索、Rerank、幻觉处理高频问题

---

**题目**：11. Agentic RAG 是什么？和普通 RAG 有什么区别？

**结论句（15 秒）**：面试官会问：&quot;你了解 Agentic RAG 吗

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官会问：&quot;你了解 Agentic RAG 吗？它和普通 RAG 有什么区别？&quot;

 

### 普通 RAG 的局限

 普通 RAG 是固定流程：用户问 → 检索一次 → 生成回答。如果第一次检索结果不好，它不会自己纠正，直接硬生成。就像一个不会反思的人，说错就错到底。

 

### Agentic RAG：让 RAG 自己决定怎么检索

 Agentic RAG 把 Agent 的规划能力引入 RAG——LLM 自己判断：需要检索哪些数据源？检索结果够不够？不够就换个角度再检索。

  普通 RAG Agentic RAG 检索次数 固定 1 次 动态，LLM 决定 检索策略 固定 pipeline LLM 自主选择 结果不满意 直接生成 换策略重新检索 复杂问题 容易答偏 可以拆解子问题分步检索 Token 消耗 低 高（多次推理） 

 

### Agentic RAG 的工作流程

 用户问题 → Agent 规划：这个问题需要检索什么？
         → 第一次检索 → 结果不够？
         → Agent 判断：换个 query 再检索
         → 第二次检索 → 结果够了？
         → Agent 判断：够了，生成回答
 1
2
3
4
5
面试核心点：Agentic RAG 适合复杂知识问答场景（法律、医疗、金融），简单问答用普通 RAG 就够了，别过度设计。能说出这个判断，面试官就知道你有工程判断力。

 还有一类问题普通 RAG 和 Agentic RAG 都吃力：实体之间的复杂关联、多跳推理、全局关系归纳。这种场景要把检索从向量切到知识图谱，具体见 GraphRAG 与 LightRAG 大厂面试题汇总。