---
custom: true
partTitle: 3D 激光感知
partColor: #14b8a6
---

<div class="part-hero custom-hero" style="--part-color: #14b8a6">

# 📡 3D 激光感知

<p class="part-desc">LiDAR · 点云 · 目标检测 · 共 1 题</p>
<span class="part-round custom-tag">我的题库</span>

</div>

<div class="custom-hint">

📝 **源文件：`custom/3d-lidar/`** · 新增题目后运行 `npm run prepare` 即可刷新。

</div>

<div class="question-card custom-card compact-card" id="lidar-vs-camera">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">激光雷达点云和图像相比，有哪些优缺点？你在项目中是怎么用的？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐⭐ · 标签：3D感知, 点云, LiDAR · 考察点：传感器原理</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：LiDAR 优点是绝对深度、不受光照影响；缺点是稀疏、贵、语义弱；融合方案通常是 LiDAR 做几何、Camera 做语义。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：多传感器融合怎么做标定？ · 点云稀疏怎么补？</div>
</div>

"LiDAR 的核心优势是**精确的三维几何信息**——每个点都有真实的 xyz 坐标和反射强度，不依赖光照，夜间和逆光也能稳定工作。缺点是点云**稀疏**（64 线雷达垂直分辨率有限）、**无语义**（不知道这个点是车还是墙）、**成本高**。

图像的优势是**语义丰富、分辨率高、成本低**，但深度是估计出来的，远距离和弱纹理区域不可靠。

在实际项目里，我通常采用**优势互补的融合策略**：

1. **LiDAR 负责几何**——地面分割、障碍物检测、距离估计
2. **Camera 负责语义**——交通牌识别、车道线、目标分类
3. **融合层**——用标定矩阵把点云投影到图像平面，或用 BEV 空间统一表示

如果是纯 LiDAR 方案，我会先做**地面滤除**（RANSAC 或高度阈值），再聚类得到目标候选，最后分类器做识别。"
</div>
</details>

</div>
