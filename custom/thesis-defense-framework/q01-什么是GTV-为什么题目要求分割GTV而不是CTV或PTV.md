---
title: 什么是GTV？为什么题目要求分割GTV而不是CTV或PTV？
round: 答辩/硕士
difficulty: ⭐⭐⭐
tags: [答辩, 食管癌, GTV分割, 临床基础]
point: 临床基础
---

**题目**：什么是GTV？为什么题目要求分割GTV而不是CTV或PTV？

**结论句（15 秒）**：GTV（Gross Tumor Volume）即"肉眼可见肿瘤体积"，是医生根据CT、MRI等影像直接勾画出的原发病灶区域。

**追问方向**：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？

### 回答

GTV（Gross Tumor Volume）即"肉眼可见肿瘤体积"，是医生根据CT、MRI等影像直接勾画出的原发病灶区域。



放疗靶区设计遵循三级扩展流程：

① GTV — 影像上能看到的肿瘤（最核心）

② CTV（Clinical Target Volume）— 在GTV基础上外扩，覆盖亚临床病灶

③ PTV（Planning Target Volume）— 在CTV基础上再外扩，补偿摆位误差和器官运动



GTV是所有靶区设计的根基——就像盖楼需要先确定地基位置。如果GTV画错了，后续CTV和PTV无论怎么扩展都是错的。而且CTV中包含"CT上看不到"的亚临床病灶，深度学习无法从影像中学习"不存在的信息"。因此，自动勾画研究的逻辑是：先搞定GTV，再通过几何扩展规则生成CTV和PTV。
