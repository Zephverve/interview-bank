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

#### 🗣️ 先用大白话说

**一句话**：生产上线 12 项 checklist——编译单例、PG checkpoint、幂等、HITL、限流、监控、评测、降级、版本、secrets、文档化 state 约定。

**打个比方**：像飞机起飞检查清单——12 项全绿才放行；漏一项可能不是立即坠机，但会在某个恶劣条件下暴露。

#### 📖 面试展开（详细版）

生产上线 Checklist 是**二面收尾题**，考察能否把分散工程点串成体系。

**12 项 Checklist**：

**① 图全局 compile 单例**
- 应用启动时 compile 一次，全局复用
- 绝不 per-request compile

**② Postgres checkpointer**
- 生产不用 MemorySaver
- 配 TTL 防膨胀

**③ thread 租户隔离**
- thread_id 含 tenant_id
- 网关层校验

**④ tool 幂等**
- 副作用 tool 配幂等键
- resume 前先查业务库

**⑤ 高危 interrupt**
- 写操作 interrupt_before 审批
- audit log 记录

**⑥ recursion_limit + fallback**
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

#### 💡 核心要点
- 12 项 checklist
- 先跑 shadow traffic
- state 约定写进 wiki

#### 📝 代码/配置示例

```python
# 生产 compile 单例
graph = None
def get_graph():
    global graph
    if graph is None:
        graph = builder.compile(
            checkpointer=PostgresSaver.from_conn_string(DB_URL),
            interrupt_before=["publish"],
        )
    return graph

# 上线前 shadow
async def shadow_test(prod_input):
    v1_result = await graph_v1.ainvoke(prod_input)
    v2_result = await graph_v2.ainvoke(prod_input)  # 不返回用户
    compare_traces(v1_result, v2_result)
```

#### 🔁 追问怎么接

- **「上线前最后一项检查什么？」** → shadow traffic：用生产真实输入跑新版本，对比 trace/节点失败率/token 消耗/答案质量，确认无退化才切流量；同时确认 state reducer 约定已文档化，oncall 能看懂。
