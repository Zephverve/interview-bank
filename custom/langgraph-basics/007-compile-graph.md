---
title: "compile 编译图的作用是什么？"
round: 一面
difficulty: ⭐⭐
tags: [LangGraph, 基础]
point: "编译机制"
source: 官方 Graph API
---

**题目**：compile 编译图的作用是什么？

**结论句（15 秒）**：compile 做结构校验、注入 checkpointer/interrupt 配置，产出可复用的 Runnable；生产环境应全局单例编译，不要每请求 compile。

**追问方向**：编译后能改图吗？ · 图迁移怎么做？

### 回答

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

compile 是把「图定义」变成「可运行实例」的步骤。它会检查图结构是否合法（比如有没有够不着的节点），并在编译参数里绑定 checkpointer、interrupt 点、recursion_limit 等运行时配置。编译后得到 LangChain Runnable，可以 invoke、stream、batch。生产里图应该在应用启动时 compile 一次、全局复用——每个 HTTP 请求都 compile 是常见性能坑。

#### 📖 面试展开（详细版）

**① 是什么**

compile 是构建期到运行期的桥梁：StateGraph（声明式定义）→ CompiledGraph（Runnable 实例）。编译时固化图拓扑和运行时配置，运行时不再改结构。

**② 为什么重要**

区分「调过 demo」和「上过线」的细节：生产必须单例 compile；图变更需考虑旧 thread 迁移。百度面经爱追问 checkpoint 与 compile 的关系。

**③ 怎么用 / 执行流程**

启动时：app = graph.compile(checkpointer=saver, interrupt_before=[...]) 编译一次。请求时：app.invoke(input, config) 复用同一 app。图定义变更后需重新 compile，旧 thread 的 state schema 要向后兼容。

**④ 项目例子**

EvoAgent FastAPI 服务在 lifespan 里 compile 一次，注入 PostgresSaver；每个请求只传不同 thread_id，不重复 compile。延迟从 ~200ms 降到个位数 ms。

**⑤ 常见坑**

每请求 compile；compile 后才 add_node（无效，需重新 compile）；state schema 变更无迁移策略导致旧 checkpoint 读失败。

#### 💡 核心要点
- 检查图结构合法性（无孤立节点等）
- 注入 checkpointer、interrupt_before/after
- 编译一次全局复用，避免每请求开销

#### 📝 代码/配置示例

```python
# 应用启动时 compile 一次
app = workflow.compile(
    checkpointer=PostgresSaver.from_conn_string(DB_URL),
    interrupt_before=["human_review"],
)

# 每个请求复用 app，只换 thread_id
config = {"configurable": {"thread_id": session_id}}
```

#### 🔁 追问怎么接

- 「编译后能改图吗」：不能，改定义需重新 compile 新 app
- 「图迁移」：state schema 向后兼容，新增字段给默认值，灰度新旧并行
- 「性能」：强调全局单例，给出延迟对比
