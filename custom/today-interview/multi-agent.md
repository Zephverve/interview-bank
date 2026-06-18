---
title: 多 Agent 是什么、好处与理解
round: 二面
difficulty: ⭐⭐⭐⭐
tags: [Agent, 多Agent, 架构]
point: 协作模式与适用边界
---

**题目**：多 Agent 是什么？有什么好处？你怎么理解？

**结论句（15 秒）**：多 Agent 是有明确角色分工和工具边界的协作体，不是多个聊天框并行；复杂长链路值得上，简单问答上反而是过度设计。

**追问方向**：和单 Agent 多工具比何时需要多 Agent？ · 怎么避免 Agent 互相扯皮？

### 回答

多 Agent 是有明确角色分工和工具边界的协作体，不是多个聊天框并行。

我拿科研论文综述生成举例。单 Agent 同时检索、读论文、写初稿、查引用，prompt 又长又容易顾此失彼。拆成 Retriever、Reader、Writer、Citation Checker 四个角色：各自 prompt 短、工具边界清晰，Retriever 搜不到返回 `insufficient_sources`，Writer 如实说文献不足而不是硬编。

**好处四点：** 专精——Retriever 用小模型，Writer 用强模型；解耦——改引用格式只动 Checker；并行——多个 Reader 同时读不同论文；可审计——出问题能定位到具体环节。

**什么时候不上：** 没有稳定子任务边界就别拆，「查北京天气」拆两个 Agent 是过度设计；子任务没有独立失败模式，共享重试的单体 Agent 够用。

**防扯皮：** 消息走 JSON Schema，Orchestrator 有最终决定权，重试超两次标记「信息不完整」继续走，所有消息带 trace_id。

多 Agent 的价值不是「多」，是每个 Agent 只做一件事。拆不出独立单元，一个 Agent 加好工具就够。
