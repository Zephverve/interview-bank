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

#### 🗣️ 先用大白话说

**一句话**：A2A 是 Agent 之间协作的「通信协议」，面试不必装专家——降维成「子图代表远程 Agent，外层管信封、超时、错误隔离」即可。

**打个比方**：A2A 像公司跨部门协作的公文格式——不管里面什么内容，信封上要写「发给谁、什么事、什么时候要回复」，收不到回复有超时处理，一个部门挂了不影响其他部门。

#### 📖 面试展开（详细版）

百度面经 P2 题，考察**知识边界**——知道概念、能降维到 LangGraph 工程实践即可，不必背 RFC。

**A2A（Agent-to-Agent）是什么**：Google 等推的多 Agent 协作协议，定义 agent 之间怎么发现、怎么发任务、怎么返回结果。核心要素：Agent Card（能力描述）、Task（任务信封）、Message（消息格式）、Artifact（产出物）。

**降维答法**（面试推荐）：
- 本地编排：LangGraph 子图就是一个「agent」，父图通过 invoke 子图与之协作
- 跨进程：专用节点封装 HTTP/gRPC 调用远程 agent，外层管 correlation_id、timeout、retry
- 父图 state 只存**摘要结果**，不存远程 agent 的完整中间状态

**和 MCP 的区别**：
- MCP = **工具接入协议**（LLM 怎么调 calculator、database）
- A2A = **Agent 协作协议**（Agent A 怎么委托任务给 Agent B）
- 两者正交：MCP 提供 tool，A2A 提供 agent 间委托

**工程要点**：超时设置（远程 agent 不能无限等）、错误隔离（远程失败不崩整个父图，写 error 进 state 走 fallback）、幂等（correlation_id 防重复委托）。

#### 💡 核心要点
- 协议层=消息格式+超时
- LangGraph 子图可封装远程 agent
- 失败隔离不重试整个父图

#### 📝 代码/配置示例

```python
# 远程 agent 封装为 LangGraph 节点
async def remote_researcher_node(state, config):
    resp = await httpx.post(
        "https://research-agent.internal/run",
        json={"task": state["query"], "correlation_id": config["run_id"]},
        timeout=30.0,
    )
    if resp.status_code != 200:
        return {"research_error": resp.text, "research_summary": None}
    return {"research_summary": resp.json()["summary"]}
```

#### 🔁 追问怎么接

- **「和 MCP 区别？」** → MCP 是 tool 层协议（怎么连外部服务），A2A 是 agent 层协议（怎么委托任务）；一个 MCP server 可以被 agent 内部使用，A2A 是 agent 之间的协作。
- **「跨进程怎么通信？」** → HTTP/gRPC 包装远程 agent 为 LangGraph 节点或 tool；外层管 correlation_id、timeout、错误返回；父图 state 只存摘要，完整 trace 在 LangSmith 关联。
