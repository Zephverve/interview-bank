---
title: "节点级监控怎么做？"
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 工程]
point: "监控"
source: 牛客 · 阿里淘天
---

**题目**：节点级监控怎么做？

**结论句（15 秒）**：trace_id 贯穿、每节点记录耗时/输入输出摘要/错误类型，LangSmith 或自研看板按 node 聚合。

**追问方向**：和整体 Agent 监控区别？ · 告警阈值怎么定？

### 回答

**优先级**：P0 · 2+ 篇面经

#### 🗣️ 先用大白话说

**一句话**：节点级监控 = 给图里每个节点装一个「黑匣子」——记录谁、耗时多少、输入输出摘要、有没有报错，出问题时能定位到具体哪个节点而不是只知道「整体超时」。

**打个比方**：端到端监控像只看「快递总时长」；节点级监控像看「揽收→分拣→运输→派送」每个环节各花了多久，哪一环慢了清清楚楚。

#### 📖 面试展开（详细版）

阿里淘天面经原题「如何做监控」，以及百度面经强调的评测闭环，都指向节点级可观测性。实现分三层：

trace 贯穿：每次 invoke 生成 trace_id 写入 config.configurable，所有节点和 LLM/tool 调用共享同一 trace_id。用户投诉或告警触发时，用 trace_id 拉完整执行轨迹。

节点 span 记录：每个节点入口/出口打 span（LangSmith 自动记录，或 OpenTelemetry 自研），属性包含：node_name、duration_ms、state 关键字段摘要（如 intent 值、retrieval_docs 数量，不是全量 state）、是否异常、attempt 次数（重试场景）、token 消耗。LangSmith 按图结构自动展示节点拓扑和耗时瀑布图；自研方案导出 Prometheus 指标，Grafana 按 node 聚合。

和整体 Agent 监控的核心区别：端到端只知道「回答超时 30s」，节点级能定位「retrieve_node P99 25s、generate_node P99 3s」——问题在检索不在生成。这是生产排障的关键能力。

告警阈值：单节点失败率环比突增（如今日 5% vs 昨日 1%）；P99 延迟超 SLA；token 消耗突增（可能 prompt 膨胀或死循环）；attempt 次数异常（重试风暴）。告警触发后自动采样 bad case 入库离线评测集，形成监控→评测→改进闭环。

#### 💡 核心要点
- OpenTelemetry/LangSmith span per node
- 记录 attempt 次数
- 失败率突增告警

#### 📝 代码/配置示例

```python
# LangSmith 自动 trace（设环境变量即可）
# LANGCHAIN_TRACING_V2=true
# LANGCHAIN_PROJECT=my-agent

# 自研：节点入口打 span
def monitored_node(state, config):
    trace_id = config["configurable"].get("trace_id")
    start = time.time()
    try:
        result = actual_node_logic(state)
        log_span(trace_id, "intent_node", time.time()-start, ok=True)
        return result
    except Exception as e:
        log_span(trace_id, "intent_node", time.time()-start, ok=False, error=str(e))
        raise
```

#### 🔁 追问怎么接

- **和整体监控区别**：节点级定位具体慢/失败的 node，端到端只知道总超时
- **告警阈值**：单节点失败率环比、P99 延迟、token 突增、attempt 异常
- **加分项**：监控→bad case 入库→离线评测→改进闭环
