---
title: 大模型的位置编码是干什么用的？sin/cos、RoPE、ALiBi 有什么区别？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [LLM, 小林笔记]
point: 大模型的位置编码是干什么用的？sin/cos、RoPE、AL
source: 小林面试笔记
---

**题目**：大模型的位置编码是干什么用的？sin/cos、RoPE、ALiBi 有什么区别？

**结论句（15 秒）**：我理解位置编码要解决的问题，本质上是 Self-Attention 的「位置盲」缺陷

**追问方向**：结合项目经历举例 · 优缺点与适用场景

### 回答

位置编码解决 Self-Attention 的「位置盲」缺陷。Attention 计算是对称的，「我打你」和「你打我」注意力分数一样，必须显式注入位置信息。

**sin/cos 绝对位置编码（原始 Transformer）：** 给每个位置算固定 sin/cos 值加到 embedding 上。简单、不需训练参数；但绝对位置太死板，训练长度之外（比如训 2K 推 4K）效果断崖。

**RoPE（旋转位置编码）：** 不「加」位置信息，而是「旋转」Q 和 K 向量，位置越靠后旋转角度越大，点积自然带上相对距离信息。长上下文外推强，配合 NTK、YaRN 等技巧可推更长。Llama、Qwen、DeepSeek 等主流模型都用 RoPE。

**ALiBi：** 直接在注意力分数加距离惩罚，离得越远扣分越多。零可学习参数、长上下文外推天然好，但表达力弱于 RoPE。MPT、BLOOM 用过，没成主流。
