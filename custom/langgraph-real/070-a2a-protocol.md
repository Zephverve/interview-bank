---
title: "A2A 多 Agent 协议了解吗？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 面经]
point: "A2A"
source: 牛客 · 百度
---

**题目**：A2A 多 Agent 协议了解吗？

**结论句（15 秒）**：不必装做过分布式 Agent；降维成子图/节点代表远程 agent，外层管信封格式、超时、错误隔离。

**追问方向**：和 MCP 区别？ · 跨进程怎么通信？

### 回答

**优先级**：P2 · 1 篇面经

**📖 核心要点**
- 协议层=消息格式+超时
- LangGraph 子图可封装远程 agent
- 失败隔离不重试整个父图

**🗣️ 标准口语答案**

百度面经提到 A2A。不必装专家，我降维答：多进程协作里的协议与超时——子图或专用节点代表另一个 agent，外层负责请求信封、correlation_id、超时和错误返回，父图 state 只存摘要结果。

和 MCP 区别：MCP 是工具接入协议，A2A 是 agent 间协作协议。LangGraph 本地编排用图，跨服务 agent 用 HTTP/gRPC 包装成 tool 或子图 invoke。

核心是通信契约和失败隔离，不是背协议 RFC。

