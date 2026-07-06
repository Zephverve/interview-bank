---
title: "每个节点之间的状态流转是什么样的？"
round: 一面
difficulty: ⭐⭐⭐
tags: [LangGraph, 状态]
point: "状态流转"
source: 牛客 · 阿里淘天
---

**题目**：每个节点之间的状态流转是什么样的？

**结论句（15 秒）**：节点读当前 state → 返回 partial update → reducer 合并 → 条件边决定下一节点；本质是 S_{t+1} = merge(S_t, node_output)。

**追问方向**：怎么保证节点效果？ · 复杂对象怎么传？

### 回答

**优先级**：P0 · 3+ 篇面经

**🗣️ 标准口语答案**

我设计状态流转的习惯是四步。第一步，画业务流程图，标出每个决策点和可能的回退路径。第二步，定义 State schema，给每个字段注明更新策略——messages 是 append-only，current_intent 是覆盖写，temp_search_results 在某条边之后清空。第三步，每个节点写成纯函数，输入 state 返回 partial update，不在节点里做副作用。第四步，用条件边连接，路由函数只读 state 返回下一个节点名。

以【替换点：你的项目】为例，流程是：用户输入 → 意图识别节点 → 条件路由到 RAG 检索或工具调用 → 结果汇总 → 可选的人工审核 → 输出。意图识别写 current_intent，检索节点 append retrieval_context，审核节点可能触发 interrupt。

保证节点效果的做法是：每个节点有独立的输入输出契约、单元测试覆盖路由逻辑、线上监控节点级耗时和失败率，bad case 回流到评测集。

