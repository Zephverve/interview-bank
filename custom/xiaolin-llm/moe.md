---
title: MoE 混合专家模型是什么？DeepSeek V3、Qwen 为什么用 MoE？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [LLM, 小林笔记]
point: MoE 混合专家模型是什么？DeepSeek V3、Qwen
source: 小林面试笔记
---

**题目**：MoE 混合专家模型是什么？DeepSeek V3、Qwen 为什么用 MoE？

**结论句（15 秒）**：我理解 MoE（Mixture of Experts，混合专家模型）的核心思想是把传统 Transformer 中的 FFN（前馈网络）层替换成 N 个并行的「专家网络」，再加一个 Router 来决定每个 token 进哪个专家

**追问方向**：结合项目经历举例 · 优缺点与适用场景

### 回答

我理解 MoE（Mixture of Experts，混合专家模型）的核心思想是把传统 Transformer 中的 FFN（前馈网络）层替换成 N 个并行的「专家网络」，再加一个 Router 来决定每个 token 进哪个专家。

核心设计哲学是「总参数大，但激活参数小」。比如 DeepSeek V3 总参数 671B，但每个 token 推理时只激活 37B（约 1/18）。这样能用「总参数 671B 的知识量」+「激活参数 37B 的推理成本」，达到 Dense 模型做不到的「学得多 + 跑得快」。

具体看 MoE 三个核心组件。

1. 多个专家（Experts）：把 Transformer 每层的 FFN 复制 N 份（典型 N=8、64、256），每份就是一个独立的「专家」，在训练中各自学到不同的「擅长方向」（语言、代码、数学、知识等）

2. Router（路由器）：每个 token 进到 MoE 层时，Router 算一个「专家偏好分数」，决定这个 token 该去哪个专家。最常见的是 Top-K 路由（K=1 或 K=2），DeepSeek V3 是 Top-8 + 1 个共享专家
