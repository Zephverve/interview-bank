---
title: "configurable 参数怎么传到节点？"
round: 二面
difficulty: ⭐⭐
tags: [LangGraph, 进阶]
point: "配置"
source: GitHub 100 Questions
---

**题目**：configurable 参数怎么传到节点？

**结论句（15 秒）**：invoke 时 config.configurable 传 model_name、temperature 等，节点第二参数 config 读取，支持 A/B 和租户差异。

**追问方向**：和 state 区别？

### 回答

**优先级**：P2 · 1 篇

**📖 核心要点**
- 不进 checkpoint 的运行配置
- 节点 (state, config) 签名
- 适合模型路由和特性开关

**🗣️ 标准口语答案**

configurable 是运行时配置不存 state：invoke(..., config={"configurable": {"model": "gpt-4o", "tenant": "acme"}})。节点函数签名 (state, config)，里读 config["configurable"]["model"] 选 LLM。

适合 A/B 测试 prompt、按租户切模型，不进 checkpoint 避免污染历史。和 state 区别：state 是业务数据跨步持久化，config 是本次运行参数。

