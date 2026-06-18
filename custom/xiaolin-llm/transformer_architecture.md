---
title: 讲讲 Transformer 架构基本原理？Encoder 和 Decoder …
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [LLM, 小林笔记]
point: 讲讲 Transformer 架构基本原理？Encoder 
source: 小林面试笔记
---

**题目**：讲讲 Transformer 架构基本原理？Encoder 和 Decoder 是什么？

**结论句（15 秒）**：我理解 Transformer 最核心的创新是 Self-Attention，让每个 token 都能直接和序列里任意其他位置建立联系，一次性并行计算，彻底解决了 RNN 顺序计算慢、长距离信息衰减的两个老问题

**追问方向**：结合项目经历举例 · 优缺点与适用场景

### 回答

Transformer 最核心的创新是 Self-Attention：每个 token 通过 Q、K、V 三个线性投影，用 Q 和所有 K 做点积算注意力分数，按分数加权聚合 V。除以 √d_k 防止点积过大让 softmax 变 one-hot 导致梯度消失。一次性并行计算，解决了 RNN 顺序计算慢、长距离梯度消失两个老问题。

**Encoder vs Decoder：** Encoder 双向，每个词能同时看前后文，适合理解类任务（BERT）；Decoder 单向，只能看前面的词，适合生成类任务（GPT）。现代大模型（GPT、Claude、Qwen）都选 Decoder-only，因为「预测下一个 token」训练目标极其统一，可以直接在海量无标注文本上做自监督学习，规模越大涌现能力越强。

**补充一点：** FFN 层储存了大量事实知识，可以理解为模型的「记忆仓库」。目标统一 + 数据规模 + 涌现，这三者组合让 Decoder-only 在大模型时代完胜。
