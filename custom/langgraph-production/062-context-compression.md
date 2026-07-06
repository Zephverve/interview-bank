---
title: "LangGraph 里上下文压缩怎么做？"
round: 一面
difficulty: ⭐⭐⭐
tags: [LangGraph, 工程]
point: "上下文"
source: 牛客 · 某大厂/字节
---

**题目**：LangGraph 里上下文压缩怎么做？

**结论句（15 秒）**：在图中加 trim/summarize 节点，进 LLM 前裁剪 messages；可多层：工具结果摘要、滚动摘要、长期记忆检索回填。

**追问方向**：压缩过度怎么发现？ · 字节三层压缩怎么答？

### 回答

**优先级**：P1 · 3+ 篇面经

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

某大厂和字节面经都考「上下文压缩方式及优劣」，在 LangGraph 里压缩是显式节点而非隐式 hack，这是关键差异。

基础压缩节点：before_llm_node 在每次调 LLM 前执行——估算当前 messages 的 token 数（写 state.estimated_tokens），超过阈值则触发压缩：用 summarize 模型把旧 messages 压缩成 state.conversation_summary，trim messages 只保留 system prompt + 最近 k 轮对话 + summary。压缩后 estimated_tokens 重新估算，仍超标则进一步 trim k 值。

字节追问的「三层压缩」答法：第一层，工具输出摘要——tool_node 返回的大段 JSON/日志在写入 messages 前先经 summarize_tool_output 节点压缩，因为工具输出信息密度低、冗余多；第二层，对话滚动摘要——多轮对话后 before_llm 节点把旧 messages 压缩成 summary，保留最近 k 轮；第三层，长期记忆——跨会话的用户偏好和历史不在 messages 里，存在外置向量库，需要时 retrieve 回填。三层触发条件和保留策略不同，因为信息密度不同。

压缩过度的发现方式：离线评测集 answer 质量指标下降（尤其需要长上下文记忆的问题）；线上用户追问「你忘了刚才说的」；监控 summary 中关键实体（人名、订单号）丢失数量。压缩策略需要可配置——k 值、阈值、summary 模型选型都可以 A/B 测试。

