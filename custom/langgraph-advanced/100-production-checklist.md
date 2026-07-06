---
title: "LangGraph 生产上线 Checklist 有哪些？"
round: 二面
difficulty: ⭐⭐⭐⭐
tags: [LangGraph, 进阶]
point: "上线清单"
source: GitHub Production Guide + 面经汇总
---

**题目**：LangGraph 生产上线 Checklist 有哪些？

**结论句（15 秒）**：编译单例、PG checkpoint、幂等、HITL、限流、监控、评测集、降级、schema 版本、secrets 管理、文档化 state 约定。

**追问方向**：上线前最后一项检查什么？

### 回答

**优先级**：P1 · 2 篇

**🗣️ 标准口语答案**

上线 Agent 图时，我会把可观测性和失败路径放在和主流程同一优先级。

生产上线 Checklist 是**二面收尾题**，考察能否把分散工程点串成体系。

**12 项 Checklist**：

- 应用启动时 compile 一次，全局复用
- 绝不 per-request compile

- 生产不用 MemorySaver
- 配 TTL 防膨胀

- thread_id 含 tenant_id
- 网关层校验

- 副作用 tool 配幂等键
- resume 前先查业务库

- 写操作 interrupt_before 审批
- audit log 记录

- 防死循环
- 超限走 fallback 不是 500

**⑦ 节点级 trace**
- LangSmith / 自研 trace
- 每 node 耗时、token、失败率

**⑧ 黄金集回归**
- 上线前跑离线评测集
- 节点级 + 端到端

**⑨ 输入输出 Guardrails**
- 入口 sanitize
- 出口内容过滤

**⑩ API 限流**
- 网关 QPS 限制
- 节点内 token bucket

**⑪ 降级链**
- 主路径 → 备用 → 模板
- 用户总有响应

**⑫ graph/schema 版本**
- 多版本共存
- 新 thread 新版、旧 thread 旧版 finish

**上线前最后一项**：用生产流量 shadow 跑新版本，对比 trace/失败率/token，确认无退化才切流量。

**state 约定文档化**：reducer 规则、字段含义、生命周期写进 wiki，oncall 能看懂。

