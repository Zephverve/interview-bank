---
title: "节点之间传复杂数据怎么处理？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 状态]
point: "数据传递"
source: 牛客 · 百度
---

**题目**：节点之间传复杂数据怎么处理？

**结论句（15 秒）**：本质是状态演化策略：区分 append-only、merge、路由后清空；大对象用 ID 引用，避免 giant dict。

**追问方向**：领域模型和框架状态怎么分离？ · TypedDict 字段爆炸怎么办？

### 回答

**优先级**：P1 · 2 篇面经

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

复杂数据传递 = 在 state 中管理字段生命周期 + 引用而非值传递 + 编排/领域分离。不是简单堆字段，而是状态演化策略。

百度二面区分架构能力。字段爆炸的 state 半年无人敢改，是 Agent 项目Technical Debt 的主要来源。

按生命周期分类：append-only（messages）、merge（docs dict）、覆盖（intent）、路由后清空（temp_results）。大对象：OSS + doc_id。领域分离：framework state（messages、routing flags）vs domain state（order_id、user_id）。字段爆炸：拆子图或嵌套 TypedDict 分区。

编排区：messages、current_intent、retry_count。领域区：paper_ids、experiment_config。全文 PDF 从不进 state，rag_node 写 paper_ids，generate_node 按 id 从向量库拉 chunk。子图 citation_check 有独立 CitationState，编译后作为父图节点。

业务模型整个塞进 state channel；嵌套 dict 过深难序列化；新增字段不评审四问（谁写/谁读/reducer/清空）。

