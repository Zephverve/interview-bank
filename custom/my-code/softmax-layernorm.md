---
title: 手写 softmax（数值稳定版）+ LayerNorm
round: 一面/二面
difficulty: ⭐⭐⭐⭐
tags: [code, 面试]
point: 手写 softmax（数值稳定版）+ LayerNorm
---

**题目**：手写 softmax（数值稳定版）+ LayerNorm

### 回答

**题目**：写一个数值稳定的 softmax；写一个 LayerNorm。

**考察点**：
- **softmax 数值稳定**：先减去最大值 `x - max(x)` 再取 exp，防止 `exp(1000)` 溢出。要主动说出这一点。
- **LayerNorm**：沿**最后一维**算 mean 和 var，可学习的 gamma/beta，加 eps 防除零。要能说出和 BatchNorm 的区别（LayerNorm 沿特征维、与 batch 大小无关、适合变长序列）。

---

## 3.6.2 了解思路即可

| 题目 | 你要掌握到什么程度 |
|---|---|
| **Multi-Head Attention** | **只背 shape 变换流程**：QKV 投影 → split heads（reshape + transpose）→ `QK^T/√d_k` → mask → softmax → 加权 V → concat → 输出投影。能讲清每一步的维度变化即可。**应用岗一般不要求手写** |
| **LoRA 层** | 讲清原理：`ΔW = BA`，A 高斯初始化、**B 零初始化（保证训练起点 ΔW=0）**，r/alpha 的作用，为什么省显存 |
| **BM25** | 记住公式（IDF、k1≈1.2、b≈0.75、文档长度归一化），现场可推 |
| **编辑距离** | DP 二维数组，能优化到一维滚动 |
| **asyncio 并发限流** | `asyncio.Semaphore` + `asyncio.gather` 的模板 |
| **KV-Cache** | 讲清 prefill vs decode 两阶段，为什么显存会爆 |

## 3.6.3 可以放弃

- FlashAttention / PagedAttention 的手写实现
- 多线程 GIL 底层机制
- 复杂动态规划

**遇到这些题说明对方在按纯算法岗面你，如实说明你的方向定位即可，不要硬撑。**
