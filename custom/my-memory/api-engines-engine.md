---
title: API 为什么用 `/v1/engines/{engine}` 这种路径参数的形式？
round: 二面
difficulty: ⭐⭐
tags: [memory, 面试]
point: API 为什么用 `/v1/engines/{engine}
---

**题目**：API 为什么用 `/v1/engines/{engine}` 这种路径参数的形式？

### 回答

为了让**上层调用方零成本切换引擎**。同一个请求体，只改 URL 里的 engine 名字，就能拿到另一个引擎的结果。评测流程能跑起来就是靠这个 —— 我用同一份 LoCoMo 数据集，循环改 engine 名，就能自动跑出四条曲线，不需要为每个引擎写一套调用代码。

如果做成 `/v1/graphiti/memories`、`/v1/mem0/memories` 这样的独立接口，上层就要维护四个客户端，评测脚本也要写四份。路径参数把这个成本消掉了。
