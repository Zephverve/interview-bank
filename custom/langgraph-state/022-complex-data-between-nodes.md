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

#### 🗣️ 先用大白话说

百度面经深挖点。表面是 TypedDict 堆字段，实质是状态演化策略：哪些 append-only、哪些 merge、哪些在某条边之后必须清空。做法是把「编排 state」和「领域数据」分开：thread_id 给图用，订单号/用户 id 进 state 业务区；大文档只传 doc_id 列表；必要时拆子图独立 state。避免 giant dict——字段新增要评审「谁写、谁读、用什么 reducer、何时清空」四件事。

#### 📖 面试展开（详细版）

**① 是什么**

复杂数据传递 = 在 state 中管理字段生命周期 + 引用而非值传递 + 编排/领域分离。不是简单堆字段，而是状态演化策略。

**② 为什么重要**

百度二面区分架构能力。字段爆炸的 state 半年无人敢改，是 Agent 项目Technical Debt 的主要来源。

**③ 怎么用 / 策略**

按生命周期分类：append-only（messages）、merge（docs dict）、覆盖（intent）、路由后清空（temp_results）。大对象：OSS + doc_id。领域分离：framework state（messages、routing flags）vs domain state（order_id、user_id）。字段爆炸：拆子图或嵌套 TypedDict 分区。

**④ 项目例子（EvoAgent）**

编排区：messages、current_intent、retry_count。领域区：paper_ids、experiment_config。全文 PDF 从不进 state，rag_node 写 paper_ids，generate_node 按 id 从向量库拉 chunk。子图 citation_check 有独立 CitationState，编译后作为父图节点。

**⑤ 常见坑**

业务模型整个塞进 state channel；嵌套 dict 过深难序列化；新增字段不评审四问（谁写/谁读/reducer/清空）。

#### 💡 核心要点
- 按字段生命周期分类管理
- 领域对象和编排 state 分离
- 避免把业务模型糊进框架 channel

#### 📝 代码/配置示例

```python
class AgentState(TypedDict):
    # 编排区
    messages: Annotated[list, add_messages]
    current_step: str
    # 领域区（引用为主）
    paper_ids: list[str]
    experiment_id: str
    # 临时区（用后清空）
    temp_search_results: Annotated[list, operator.add]
```

#### 🔁 追问怎么接

- 「领域和框架分离」：thread_id 给图，business_id 放 state 业务区
- 「字段爆炸」：拆子图；嵌套分区；外置存储 + ID 引用
- 「子图」：独立 StateGraph compile 后作父图节点
