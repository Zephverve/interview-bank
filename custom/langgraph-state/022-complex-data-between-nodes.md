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

**📖 核心要点**
- 按字段生命周期分类管理
- 领域对象和编排 state 分离
- 避免把业务模型糊进框架 channel

**🗣️ 标准口语答案**

百度面经深挖点。表面是 TypedDict 一路堆字段，实质是状态演化策略：哪些 append-only、哪些 merge、哪些在某条边之后必须清空。

我的做法是把「编排 state」和「领域数据」分开：thread_id 给图用，订单号、用户 id 进 state 的业务区；大文档只传 doc_id 列表，不传全文；中间结构化结果用嵌套 dict 但控制深度，必要时拆成子图独立 state。

避免 giant dict——半年没人敢改。字段新增要评审「谁写、谁读、用什么 reducer、何时清空」四件事。

