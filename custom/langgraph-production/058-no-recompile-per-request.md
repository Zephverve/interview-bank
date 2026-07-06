---
title: "为什么生产环境不能每个请求都 compile 图？"
round: 二面
difficulty: ⭐⭐
tags: [LangGraph, 工程]
point: "性能"
source: CSDN 工程实践
---

**题目**：为什么生产环境不能每个请求都 compile 图？

**结论句（15 秒）**：compile 有结构检查和对象构建开销，应应用启动时一次，请求只 invoke 已编译实例。

**追问方向**：热更新图怎么做？ · 多版本图共存？

### 回答

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

**一句话**：compile 图就像「编译代码」——启动时做一次，请求时只「运行」已编译好的实例。每请求 compile 等于每次访问网站都重新 npm build 一遍。

**打个比方**：compile 是「把菜谱定稿并培训厨师」，invoke 是「按定稿菜谱做菜」。不会每个客人点菜都重新写菜谱、重新培训厨师。

#### 📖 面试展开（详细版）

这是 CSDN 工程实践类面经的常考题，考察对 LangGraph 生命周期的理解。compile() 不是轻量操作——它做这些事：图结构验证（孤立节点检查、边完整性）；绑定 checkpointer 和 interrupt 配置；构建内部执行计划和节点调度表；创建 CompiledGraph 对象。整体开销从毫秒到秒级，取决于图复杂度。

每请求 compile 的问题：QPS 100 时每秒 compile 100 次，CPU 大量浪费在重复的结构检查上；P99 延迟抖动——compile 时间不稳定；无法享受编译后的内部优化缓存。在 serverless（Lambda/Cloud Functions）冷启动场景下尤其致命——compile 可能占冷启动时间的大头。

正确做法：应用 lifespan/startup 事件里 compile 一次，存 app.state.graph 或模块级全局变量。请求路由里直接 app.state.graph.ainvoke(input, config)，零 compile 开销。FastAPI 用 @asynccontextmanager lifespan；Flask 用 before_first_request（已废弃）或应用工厂模式。

热更新和多版本：加载 graph_v2 实例与 v1 并存，按 request header、tenant_id 或 thread 创建时间路由到对应版本。旧 thread 用旧图 finish，新 thread 用新图。灰度期间新旧并行，全量切换后下线旧实例。

#### 💡 核心要点
- compile 在 startup 事件
- 请求路径零 compile
- 版本变更灰度新 graph 实例

#### 📝 代码/配置示例

```python
# 错误：每请求 compile
@app.post("/chat")
async def chat_bad(req):
    app = builder.compile()  # 每次都 compile！
    return await app.ainvoke(...)

# 正确：启动时 compile 一次
app.state.graph = builder.compile(checkpointer=pg_saver)

@app.post("/chat")
async def chat_good(req):
    return await app.state.graph.ainvoke(...)
```

#### 🔁 追问怎么接

- **热更新图**：加载新 graph 实例，按 header/tenant 路由，旧 thread 用旧图 finish
- **多版本共存**：graph_v1 和 graph_v2 并存，灰度期间新旧并行
- **加分项**：量化 compile 开销（毫秒到秒级）、serverless 冷启动场景
