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

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

compile 是构建期到运行期的桥梁：StateGraph（声明式定义）→ CompiledGraph（Runnable 实例）。编译时固化图拓扑和运行时配置，运行时不再改结构。

区分「调过 demo」和「上过线」的细节：生产必须单例 compile；图变更需考虑旧 thread 迁移。百度面经爱追问 checkpoint 与 compile 的关系。

启动时：app = graph.compile(checkpointer=saver, interrupt_before=[...]) 编译一次。请求时：app.invoke(input, config) 复用同一 app。图定义变更后需重新 compile，旧 thread 的 state schema 要向后兼容。

EvoAgent FastAPI 服务在 lifespan 里 compile 一次，注入 PostgresSaver；每个请求只传不同 thread_id，不重复 compile。延迟从 ~200ms 降到个位数 ms。

每请求 compile；compile 后才 add_node（无效，需重新 compile）；state schema 变更无迁移策略导致旧 checkpoint 读失败。

