---
title: Dice和IoU有什么区别？Dice为什么更高？
round: 答辩/硕士
difficulty: ⭐⭐⭐
tags: [答辩, 食管癌, GTV分割, 核心指标]
point: 核心指标
---

**题目**：Dice和IoU有什么区别？Dice为什么更高？

**结论句（15 秒）**：Dice = 2TP/(2TP+FP+FN)  ·  IoU = TP/(TP+FP+FN)

**追问方向**：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？

### 回答

Dice = 2TP/(2TP+FP+FN)  ·  IoU = TP/(TP+FP+FN)



两者的分子相差一倍——Dice给重叠区域赋了2倍权重。

所以Dice数值始终 ≥ IoU（Dice=0.714, IoU=0.561）。



Dice更常用在医学分割中因为：

① 对小目标更敏感（重叠区域在分母占比更大）

② 变化范围更宽，更容易区分不同模型的性能差异

IoU通常作为辅助指标一起报告。
