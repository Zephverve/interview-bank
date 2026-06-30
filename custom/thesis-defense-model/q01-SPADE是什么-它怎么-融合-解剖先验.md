---
title: SPADE是什么？它怎么"融合"解剖先验？
round: 答辩/硕士
difficulty: ⭐⭐⭐
tags: [答辩, 食管癌, GTV分割, SPADE]
point: SPADE
---

**题目**：SPADE是什么？它怎么"融合"解剖先验？

**结论句（15 秒）**：SPADE = Spatially-Adaptive Normalization（空间自适应归一化）。

**追问方向**：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？

### 回答

SPADE = Spatially-Adaptive Normalization（空间自适应归一化）。



普通BatchNorm的工作方式：每通道统一做标准化，再乘γ加β——γ和β是固定参数，所有位置一视同仁。



SPADE的不同：γ和β不是固定的，而是根据输入的"条件图"（解剖先验图），为每个空间位置(x,y,z)生成不同的γ(x,y,z)和β(x,y,z)。公式：

SPADE(F|c) = InstanceNorm(F) ⊙ (1 + γ(c)) + β(c)



条件图c包含：Z轴位置 + 中心线距离 + 边界距离（三通道）。



效果：网络知道"这里是胸上段，紧邻气管，要加强气管-食管边界的特征"；"这里离中心线很远，已到肺野，降低关注度"。



类比：BatchNorm是全屋中央空调（统一温度），SPADE是给每个座位装了独立出风口，根据座位位置（靠窗、中间、门口）自动调节温度。
