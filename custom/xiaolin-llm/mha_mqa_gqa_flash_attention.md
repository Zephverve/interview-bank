---
title: 多头注意力（MHA）有哪些局限？MQA、GQA、Flash Attention …
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [LLM, 小林笔记]
point: 多头注意力（MHA）有哪些局限？MQA、GQA、Flash 
source: 小林面试笔记
---

**题目**：多头注意力（MHA）有哪些局限？MQA、GQA、Flash Attention 怎么解决？

**结论句（15 秒）**：我理解 MHA 有三个核心痛点

**追问方向**：结合项目经历举例 · 优缺点与适用场景

### 回答

我理解 MHA 有三个核心痛点。

第一是「显存爆炸」。推理时每个 head 都要为序列里所有 token 保存自己的 K 和 V 矩阵，这就是 KV Cache。头数越多、序列越长，显存占用越夸张。一个 7B 模型跑 32K 上下文，光 KV Cache 就能吃掉十几 GB。

第二是「访存慢」。Attention 计算里 softmax 那步要把整个 N×N 的注意力矩阵搬来搬去，频繁读写 GPU 显存，瓶颈不在算力而在「内存带宽」。

第三是「N² 复杂度」。注意力分数矩阵是 N×N 的，序列翻倍计算量翻 4 倍，长上下文极其昂贵。

工业界对应了三类优化。MQA 让所有 head 共享一份 K/V，显存压到 1/H，但表达力损失明显。GQA 是折中方案：把 H 个 head 分成 G 组，每组共享一份 K/V，效果接近 MHA 但显存接近 MQA，Llama 2 70B、Llama 3、Qwen 2/3 的不少主力模型都用这个思路。Flash Attention 是另一条思路，不改变 MHA 的结构，而是从计算实现层面把 N×N 的注意力矩阵切成小块、用 GPU 片上缓存做在线 softmax，避免反复读写大矩阵，显存从 O(N²) 降到 O(N)，速度还更快。
