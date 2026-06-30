---
title: Focal-Tversky Loss为什么比Dice Loss更适合这个任务？
round: 答辩/硕士
difficulty: ⭐⭐⭐
tags: [答辩, 食管癌, GTV分割, 损失函数与训练策略]
point: 损失函数与训练策略
---

**题目**：Focal-Tversky Loss为什么比Dice Loss更适合这个任务？

**结论句（15 秒）**：Tversky指数改进了Dice：可以独立调节FP和FN的惩罚力度。

**追问方向**：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？

### 回答

Tversky指数改进了Dice：可以独立调节FP和FN的惩罚力度。

Tversky = TP / (TP + α·FN + β·FP)



论文设置：α=0.25（FN惩罚小，允许少量漏检）· β=0.75（FP惩罚大，强烈抑制过分割）



医学含义：在食管癌放疗中，过勾（把正常组织照了）的临床风险通常大于少量漏勾（可通过PTV扩展补充）。所以β=0.75>>α=0.25的设定是有明确临床导向的。



Focal-Tversky额外增加了焦点指数γ=0.75：Focal-Tversky = (1-Tversky)^γ

作用：容易分的区域Loss已经小→指数进一步缩小；难分的边界→Loss保持→模型更多聚焦于困难区域。
