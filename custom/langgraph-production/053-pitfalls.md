---
title: "LangGraph 踩过什么坑？"
round: 一面
difficulty: ⭐⭐⭐
tags: [LangGraph, 工程]
point: "踩坑"
source: 牛客 · 某大厂/阿里国际
---

**题目**：LangGraph 踩过什么坑？

**结论句（15 秒）**：高频坑：并发覆盖 state、没配 reducer、死循环、每请求 compile、checkpoint 膨胀、条件路由不稳定。

**追问方向**：怎么监控发现？ · 哪个坑印象最深？

### 回答

**优先级**：P0 · 4+ 篇面经

#### 🗣️ 先用大白话说

**一句话**：LangGraph 最常踩的坑就五类——并发写 state 互相覆盖、没 reducer、死循环、每请求 compile 图、checkpoint 越存越大。能讲出「怎么发现、怎么修」比背概念加分十倍。

**打个比方**：像学开车——不是知道「不能闯红灯」就行，得讲出「哪次差点闯、怎么刹住的、后来装了什么提醒」。

#### 📖 面试展开（详细版）

这是牛客某大厂/阿里国际面经的高频原题，面试官要的不是概念背诵，而是真实工程踩坑经历和闭环修复。

第一个坑：并发节点覆盖 state 同一字段。LangGraph 节点可能并行执行，两个节点同时改 state 里同一个字段，后执行的直接把先执行的覆盖，完全没有警告。这是阿里国际面经里最高频的踩坑。修复：给列表类字段配 Annotated reducer，messages 用 add_messages，从「覆盖写」改成「合并写」。发现方式：stream_mode='values' 观察每步 state，发现某字段值突然变少或消失。

第二个坑：ReAct 死循环。工具一直返回空结果，模型无限重试。修复：recursion_limit 设框架级上限；should_continue 条件边里加 step_count 计数；业务层检测重复 tool call 模式。超过 N 轮路由到 fallback 节点而非继续循环。

第三个坑：每 HTTP 请求 compile 图。compile 会做结构检查、绑定 checkpointer、构建执行计划，毫秒到秒级开销。QPS 高时 CPU 浪费明显，P99 延迟抖动。修复：应用启动时 compile 一次存全局单例，请求路径只 invoke。

第四个坑：checkpoint 膨胀。一开始什么都往 state 里塞——跨会话历史、海量检索结果、用户偏好——导致 checkpoint 体积巨大、恢复变慢。修复：图内只留当前任务推进必需的状态，跨会话历史和知识库走外置存储，配 TTL 和里程碑裁剪。

第五个坑：LLM 条件路由不稳定。intent 分类偶尔飘，导致该走 RAG 的走了直答。修复：加规则 fallback（关键词匹配兜底）、confidence 阈值、路由结果日志监控。

#### 💡 核心要点
- 状态覆盖最常见
- recursion_limit 要配业务 fallback
- 生产禁止重复 compile

#### 📝 代码/配置示例

```python
# 坑1修复：配 reducer
from typing import Annotated
from langgraph.graph.message import add_messages

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]  # 合并写，不是覆盖

# 坑3修复：启动时 compile
app = builder.compile(checkpointer=pg_saver)  # 全局单例

# 坑2修复：防死循环
app = builder.compile(checkpointer=pg_saver)
config = {"recursion_limit": 25}
```

#### 🔁 追问怎么接

- **怎么监控发现**：stream 看 state 变化、LangSmith trace 定位节点、P99 延迟突增告警
- **哪个坑印象最深**：选并发覆盖或 checkpoint 膨胀，讲清发现→定位→修复闭环
- **加分项**：每个坑配「怎么发现」的方式，体现真实工程感
