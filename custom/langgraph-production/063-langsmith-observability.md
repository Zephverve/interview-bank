---
title: "LangGraph 与 LangSmith 可观测性怎么集成？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 工程]
point: "可观测"
source: GitHub 100 Questions
---

**题目**：LangGraph 与 LangSmith 可观测性怎么集成？

**结论句（15 秒）**：设 LANGCHAIN_TRACING 环境变量自动 trace 每节点；可看轨迹、评测、对比 prompt 版本。

**追问方向**：不用 LangSmith 怎么自建？ · 成本数据从哪来？

### 回答

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

**一句话**：LangSmith 和 LangGraph 是亲兄弟——开个环境变量，每次运行自动记录每个节点、每次 LLM 调用、每个工具的输入输出和耗时，像给 Agent 装了行车记录仪。

**打个比方**：LangSmith 是「飞行黑匣子」——出问题时回放完整轨迹，看走了哪条路、哪一步慢了、哪一步错了。

#### 📖 面试展开（详细版）

LangSmith 与 LangGraph 同属 LangChain 生态，集成成本极低但价值很大——是生产级 Agent 可观测性的默认方案。

自动 trace：设置环境变量 LANGCHAIN_TRACING_V2=true 和 LANGCHAIN_API_KEY，每次 graph.invoke/astream 自动记录完整 trace——每个节点的输入 state 摘要、输出 partial update、耗时；每次 LLM 调用的 prompt、response、token 数、延迟；每次 tool 调用的参数、返回值、延迟。trace 按 thread_id 组织，可在 LangSmith UI 按图拓扑瀑布图查看。

核心用途：debug——用户投诉「回答不对」时，用 thread_id 拉 trace 看走了哪条边、哪个节点产出异常；prompt 版本对比——同一输入在不同 prompt 版本下的 node 输出 diff；dataset 回归——从线上 trace 采样 good/bad case 入库，定期跑回归评测；成本分析——从 LLM callback 聚合 token 消耗，按 node/用户/时间段统计。

不用 LangSmith 的自建方案：OpenTelemetry 标准——节点入口/出口打 span，属性带 thread_id、node_name、duration_ms；LLM callback 记录 token；导出到 Jaeger/Grafana/Prometheus。成本更高但无 vendor lock-in。

百度面经强调评测闭环：LangSmith 的核心价值是把在线 trace 沉淀成离线评测集的桥梁——线上 bad case → 一键入库 → 离线回归 → prompt 改进 → 上线验证。

#### 💡 核心要点
- 自动记录 node/LLM/tool span
- dataset 回归评测
- 反馈 bad run 到数据集

#### 📝 代码/配置示例

```python
# LangSmith 零代码集成
# export LANGCHAIN_TRACING_V2=true
# export LANGCHAIN_API_KEY=ls-...
# export LANGCHAIN_PROJECT=my-agent-prod

# 自研 OpenTelemetry 方案
from opentelemetry import trace
tracer = trace.get_tracer("langgraph")

def traced_node(state, config):
    with tracer.start_as_current_span("intent_node") as span:
        span.set_attribute("thread_id", config["configurable"]["thread_id"])
        return intent_logic(state)
```

#### 🔁 追问怎么接

- **不用 LangSmith 自建**：OpenTelemetry span per node，导出 Jaeger/Prometheus
- **成本数据从哪来**：LLM callback 聚合 token，按 node/用户/时间段统计
- **加分项**：评测闭环（在线 trace → 离线 dataset → 回归 → 改进）
