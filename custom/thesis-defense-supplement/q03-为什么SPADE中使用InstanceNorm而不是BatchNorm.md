---
title: 为什么SPADE中使用InstanceNorm而不是BatchNorm？
round: 答辩/硕士
difficulty: ⭐⭐⭐
tags: [答辩, 食管癌, GTV分割, 补充]
point: 补充
---

**题目**：为什么SPADE中使用InstanceNorm而不是BatchNorm？

**结论句（15 秒）**：这是一个有意为之的技术选择：

**追问方向**：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？

### 背诵回答

3D医学图像训练时一次只能放2到4个样本进GPU（因为显存不够）。BatchNorm在这么小的批次上做跨样本统计会非常不稳定。

InstanceNorm是在单个样本内部做的归一化——不管你batch多大，统计都是准的。
而且SPADE的设计就是IN→去"风格差异"、留"结构"→再用位置信息定制外观。IN和SPADE是天生的一对。
💡 小batch下IN比BN统计更稳，SPADE原装配置。

### 回答

这是一个有意为之的技术选择：



BatchNorm：对一个batch内所有样本的同一通道做标准化 → 依赖batch size，小batch时统计不稳定

InstanceNorm：对单个样本的每个通道独立标准化 → 不依赖batch size，更适合小batch训练



论文选择InstanceNorm的理由：

① 3D医学图像分割通常batch size很小（2-4），BatchNorm的统计估计不稳定

② InstanceNorm消除了"外观风格"差异（不同CT机器的整体亮度/对比度差异）→ 保留了结构信息 → SPADE再根据位置条件"定制"外观

③ 在图像风格迁移/条件生成（如SPADE原论文）中，InstanceNorm是标准组件，能更好地与条件调制配合



简单理解：InstanceNorm"去掉每张图的风格差异"，SPADE再根据空间位置"加上个性化的风格调整"。BatchNorm的"跨样本平均"反而会模糊图片间的个体差异。
