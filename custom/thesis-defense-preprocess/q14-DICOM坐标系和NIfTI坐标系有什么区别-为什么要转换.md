---
title: DICOM坐标系和NIfTI坐标系有什么区别？为什么要转换？
round: 答辩/硕士
difficulty: ⭐⭐⭐
tags: [答辩, 食管癌, GTV分割, 坐标系与转换]
point: 坐标系与转换
---

**题目**：DICOM坐标系和NIfTI坐标系有什么区别？为什么要转换？

**结论句（15 秒）**：DICOM使用LPS坐标系（Left-Posterior-Superior），即：病人左侧为X正方向，后方为Y正方向，头侧为Z正方向。

**追问方向**：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？

### 回答

DICOM使用LPS坐标系（Left-Posterior-Superior），即：病人左侧为X正方向，后方为Y正方向，头侧为Z正方向。



NIfTI使用RAS坐标系（Right-Anterior-Superior），X方向与DICOM相反。



在重采样和导出NIfTI时，需要正确进行坐标变换。论文中所有坐标计算（体积、上下界、质心）都是基于患者物理坐标系（mm），而非体素索引，这样无需担心坐标系的左右翻转问题——直接使用ImagePositionPatient和体素间距转换即可。



这就是为什么论文特别强调"DicomZ轴"——用的是物理坐标而非体素索引，避免坐标系混淆。
