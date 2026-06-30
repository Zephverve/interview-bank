---
custom: true
partTitle: 答辩问题 · 食管癌 GTV · 数据预处理
partColor: #0d9488
---

<div class="part-hero custom-hero chapter-hero" style="--part-color: #0d9488">

# 🏥 数据预处理

<p class="part-desc">答辩问题 · 食管癌 GTV · 第 2/9 章 · 14 题</p>
<span class="part-round custom-tag">面试问答</span>

</div>

<div class="chapter-nav">

<a class="chapter-nav-link" href="/custom/thesis-defense/">📑 总览</a>

<a class="chapter-nav-link" href="/custom/thesis-defense/framework">← 🏥 医学背景与整体框架</a>

<a class="chapter-nav-link chapter-nav-next" href="/custom/thesis-defense/gmm">🏥 GMM聚类与特征 →</a>

</div>

<div class="question-card ai100-card interview-card compact-card" id="q01-为什么要做HU值转换-转换公式是什么">

<h2 class="question-title"><span class="q-badge ai100-badge">Q11</span><span class="question-text">为什么要做HU值转换？转换公式是什么？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, HU值与归一化 · 考察点：HU值与归一化</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：CT图像的原始像素值没有物理意义——不同机器的同一组织可能显示不同数值，无法直接比较。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

CT图像的原始像素值没有物理意义——不同机器的同一组织可能显示不同数值，无法直接比较。



HU值（Hounsfield Unit）是医学影像的"国际标准度量衡"：

HU = PixelValue × RescaleSlope + RescaleIntercept



不同组织的标准HU值：水=0 · 空气=-1000 · 脂肪≈-100 · 软组织=20~80 · 骨骼>300



转换后，无论来自哪台机器、哪家医院，相同组织都有相同的HU值。这就像把所有温度计都校准为摄氏度——数据可比了。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q02-为什么空气的HU值是-1000">

<h2 class="question-title"><span class="q-badge ai100-badge">Q12</span><span class="question-text">为什么空气的HU值是-1000？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, HU值与归一化 · 考察点：HU值与归一化</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：HU是以"水"作为基准定义的：水的X射线衰减系数被规定为0 HU。空气几乎不吸收X射线（衰减系数接近0），因此被映射到-1000，这是国际统一标准。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

HU是以"水"作为基准定义的：水的X射线衰减系数被规定为0 HU。空气几乎不吸收X射线（衰减系数接近0），因此被映射到-1000，这是国际统一标准。



可以理解为：水是"0分及格线"，空气是"最低分-1000"。这个统一的基准系让全球不同CT设备的影像可以放在一起比较分析。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q03-为什么裁剪到-300-500-这个范围是怎么确定的">

<h2 class="question-title"><span class="q-badge ai100-badge">Q13</span><span class="question-text">为什么裁剪到(-300, 500)？这个范围是怎么确定的？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, HU值与归一化 · 考察点：HU值与归一化</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：这是软组织窗（Soft Tissue Window），专门用于观察软组织病变（如食管癌）。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

这是软组织窗（Soft Tissue Window），专门用于观察软组织病变（如食管癌）。

不同组织的典型HU范围：空气-1000、肺-800~-500、脂肪-100~-50、软组织20~80、骨骼>300



选择(-300,500)的原因是：

① -300的下界排除了空气和大部分肺组织（它们在-1000~-500），避免无关背景

② 500的上界覆盖了软组织和部分骨骼边缘，但排除了致密骨（3000+）

③ 这个范围恰好以软组织为中心展开，食管和肿瘤的HU特征被最大程度保留



如果不裁剪，-1000到3000的全范围跨度太大，重要软组织（20~80 HU只占1.5%）会被压缩到基本"看不见"。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q04-为什么先裁剪再Min-Max归一化-而不是直接做Z-score">

<h2 class="question-title"><span class="q-badge ai100-badge">Q14</span><span class="question-text">为什么先裁剪再Min-Max归一化，而不是直接做Z-score？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, HU值与归一化 · 考察点：HU值与归一化</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：先裁剪再Min-Max的流程：去除干扰→保留软组织→归一化到统一区间。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

先裁剪再Min-Max的流程：去除干扰→保留软组织→归一化到统一区间。



不用Z-score的原因：Z-score（减均值除标准差）会改变HU值的绝对数值关系。-1000（空气）和300+（骨骼）的"物理距离"会被Z-score扭曲。而HU值本身具有明确的临床含义，Min-Max归一化虽然简单，但保留了不同组织间灰度的相对顺序和间距。



对于具有物理含义的数值（HU值、温度、血压），保留其原始相对关系通常比标准化更重要。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q05-为什么训练集中取每个病例自己的min-max做归一化-而不是统一用-300-5">

<h2 class="question-title"><span class="q-badge ai100-badge">Q15</span><span class="question-text">为什么训练集中取每个病例自己的min/max做归一化，而不是统一用(-300,500)？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, HU值与归一化 · 考察点：HU值与归一化</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：因为经过HU裁剪后，不同病例的(-300,500)窗口内，实际灰度分布仍有差异（如有的病例内肿瘤周围脂肪多、有的少）。用每个病例自己的min/max做归一化，相当于"自适配"，让每例数据都充分利用[0,1]的完整动态范围。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

因为经过HU裁剪后，不同病例的(-300,500)窗口内，实际灰度分布仍有差异（如有的病例内肿瘤周围脂肪多、有的少）。用每个病例自己的min/max做归一化，相当于"自适配"，让每例数据都充分利用[0,1]的完整动态范围。



如果统一映射(-300,500)，大部分体素会被挤在中间段，灰度对比度不够。这是一种"在统一预处理框架内保留个体适应性"的做法。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q06-为什么要重采样-目标间距为什么选-2-5-1-0-1-0-mm">

<h2 class="question-title"><span class="q-badge ai100-badge">Q16</span><span class="question-text">为什么要重采样？目标间距为什么选(2.5, 1.0, 1.0) mm？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 重采样与插值 · 考察点：重采样与插值</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：不同患者CT扫描参数差异大：层厚从1mm到5mm，面内像素间距0.7~1.2mm不等。如果不统一，模型学到的"1cm肿瘤"在不同病例中可能占2层也可能占10层——空间尺度混乱。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

不同患者CT扫描参数差异大：层厚从1mm到5mm，面内像素间距0.7~1.2mm不等。如果不统一，模型学到的"1cm肿瘤"在不同病例中可能占2层也可能占10层——空间尺度混乱。



选择(2.5, 1.0, 1.0)mm的依据：

• 临床匹配：食管癌放疗CT典型层厚2.5mm，与多数数据接近

• Z方向比XY方向粗：CT本身Z方向分辨率就低于面内，强行插密到1mm反而引入虚假信息

• GPU显存约束：更密=更大输入=更大显存占用

• 实验验证：往返Dice均值0.9973 → 证明这个间距不会导致显著信息损失
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q07-为什么Mask用最近邻插值-CT用三线性插值">

<h2 class="question-title"><span class="q-badge ai100-badge">Q17</span><span class="question-text">为什么Mask用最近邻插值，CT用三线性插值？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 重采样与插值 · 考察点：重采样与插值</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Mask是分类标签（只有0和1），三线性插值会算出0.3、0.7这种"半肿瘤半背景"的中间值——这在物理上不存在。最近邻插值是"直接拿最近原始体素的标签"，保证输出永远是0或1，边界清晰。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

Mask是分类标签（只有0和1），三线性插值会算出0.3、0.7这种"半肿瘤半背景"的中间值——这在物理上不存在。最近邻插值是"直接拿最近原始体素的标签"，保证输出永远是0或1，边界清晰。



CT灰度是连续的（153.7这种值完全合理），三线性插值对周围8个体素做加权平均，保持空间平滑，不会出现锯齿。



简单记忆：离散数据用硬插值、连续数据用平滑插值。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q08-重采样会不会改变肿瘤形状-论文有验证吗">

<h2 class="question-title"><span class="q-badge ai100-badge">Q18</span><span class="question-text">重采样会不会改变肿瘤形状？论文有验证吗？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 重采样与插值 · 考察点：重采样与插值</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：论文做了严格的"往返验证"：原始Mask → 重采样到(2.5,1.0,1.0)mm → 再插值回原始网格 → 计算Dice。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

论文做了严格的"往返验证"：原始Mask → 重采样到(2.5,1.0,1.0)mm → 再插值回原始网格 → 计算Dice。



结果：平均Dice 0.9973 · 中位数0.9976 · 最差也有0.9881



结论：重采样对肿瘤形状的改变微乎其微——相当于照片做了极轻微的缩放处理，肿瘤整体轮廓几乎不变。这个实验很重要，因为它证明了"用重采样后的Mask训练模型是安全的"。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q09-DICOM排序具体怎么做-ImagePositionPatient是什么">

<h2 class="question-title"><span class="q-badge ai100-badge">Q19</span><span class="question-text">DICOM排序具体怎么做？ImagePositionPatient是什么？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 重采样与插值 · 考察点：重采样与插值</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：每个DICOM文件都包含一个ImagePositionPatient标签，记录该切片在患者三维空间中的物理坐标（单位：mm）。第三个分量对应人体头脚方向（Z轴）。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

每个DICOM文件都包含一个ImagePositionPatient标签，记录该切片在患者三维空间中的物理坐标（单位：mm）。第三个分量对应人体头脚方向（Z轴）。



排序流程：

① 读取每张CT切片的ImagePositionPatient[2]（Z坐标）

② 按Z坐标升序排列所有切片

③ 相邻切片之间的Z差值 = 层厚



如果DICOM文件在文件夹中存储顺序本身就是错的（比如按文件名排序而非空间位置），直接读出的"第1张切片"可能对应患者胸腔中部而非最上方——产生错位的三维数据。所以DICOM排序是数据预处理的第零步，也是最容易被忽视但后果最严重的一步。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q10-体廓框和肿瘤框分别有什么用-外扩40mm是拍脑袋定的吗">

<h2 class="question-title"><span class="q-badge ai100-badge">Q20</span><span class="question-text">体廓框和肿瘤框分别有什么用？外扩40mm是拍脑袋定的吗？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 质控与数据管理 · 考察点：质控与数据管理</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：体廓框（Body BBox）：框出整个人体区域，用于测试集推理——因为不知道肿瘤在哪，需要搜索整个身体。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

体廓框（Body BBox）：框出整个人体区域，用于测试集推理——因为不知道肿瘤在哪，需要搜索整个身体。



肿瘤框（Tumor BBox）：以GTV质心为中心、外扩40mm的局部区域。训练时只给模型看这个区域：

· 大幅减少无关背景（肺、骨骼、皮肤被裁掉）

· 减小输入体积，节约GPU显存

· 使模型专注于"找肿瘤"而非"识别人体"



40mm不是拍脑袋定的：食管癌GTV典型直径2-5cm，纵向跨度约8cm。40mm外扩后，区域范围约80mm×80mm×120mm，足够包含肿瘤完整形态和必要的解剖上下文（食管周围气管、心脏等），又不会纳入太多无关区域。这个值来自临床经验：食管周围约40mm范围内通常能覆盖CT上可见的全部关键解剖结构。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q11-HB0018为什么被排除训练-排除1例影响大吗">

<h2 class="question-title"><span class="q-badge ai100-badge">Q21</span><span class="question-text">HB0018为什么被排除训练？排除1例影响大吗？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 质控与数据管理 · 考察点：质控与数据管理</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：HB0018因"质控警告"被排除在模型训练之外（但在问题一的统计分析中仍然参与，共105例）。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

HB0018因"质控警告"被排除在模型训练之外（但在问题一的统计分析中仍然参与，共105例）。

可能的警告原因：RTSTRUCT标签异常（如栅格化Dice偏低、轮廓退化等）。



排除1例（104/105=99%保留率）对统计结论影响极小，但能保证训练数据"干净度"。在医学AI中，"错误标签比没有标签危害更大"——一个错误的GTV标注会"教坏"模型。这体现了严谨的数据态度：宁可少用一个可疑数据，也不用全部数据冒风险。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q12-RTSTRUCT栅格化一致性验证为什么要做">

<h2 class="question-title"><span class="q-badge ai100-badge">Q22</span><span class="question-text">RTSTRUCT栅格化一致性验证为什么要做？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 质控与数据管理 · 考察点：质控与数据管理</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：RTSTRUCT存储的是医生画的二维轮廓坐标，需要转换为像素级三维Mask（这个过程叫"栅格化"）。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

RTSTRUCT存储的是医生画的二维轮廓坐标，需要转换为像素级三维Mask（这个过程叫"栅格化"）。



论文用了两种方法——自动工具栅格化和自定义轮廓填充——然后比较Dice。



为什么做？因为如果两种方法的结果差异很大，说明原始RTSTRUCT数据有问题（轮廓退化、坐标错位等）。

中位数Dice 0.958说明两种方法高度一致 → 标签数据质量可靠。

34例min Dice < 0.95的被标记为"需复核"，2例完全失败 → 改用自定义填充。这一步验证是"防患于未然"——如果跳过直接训练，低质量标签会持续拉低模型上限。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q13-NIfTI是什么-为什么不直接用DICOM训练">

<h2 class="question-title"><span class="q-badge ai100-badge">Q23</span><span class="question-text">NIfTI是什么？为什么不直接用DICOM训练？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 质控与数据管理 · 考察点：质控与数据管理</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：DICOM是一个庞大的医学影像标准：一个CT扫描包含数百个独立的DICOM文件，每个文件记录一层切片——读取慢、管理烦。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

DICOM是一个庞大的医学影像标准：一个CT扫描包含数百个独立的DICOM文件，每个文件记录一层切片——读取慢、管理烦。



NIfTI（.nii.gz）是把整个三维CT打包成一个文件，内部包含：全部切片数据 + 三维坐标信息 + 体素间距 + 原点位置。



类比：DICOM像一箱散装拼图块（需要自己拼），NIfTI像已拼好装裱的画框（拿来就能用）。这也是所有深度学习医学影像框架（nnU-Net、MONAI等）首选NIfTI的原因——效率高、内存开销小、与数据加载器天然兼容。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q14-DICOM坐标系和NIfTI坐标系有什么区别-为什么要转换">

<h2 class="question-title"><span class="q-badge ai100-badge">Q24</span><span class="question-text">DICOM坐标系和NIfTI坐标系有什么区别？为什么要转换？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 坐标系与转换 · 考察点：坐标系与转换</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：DICOM使用LPS坐标系（Left-Posterior-Superior），即：病人左侧为X正方向，后方为Y正方向，头侧为Z正方向。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

DICOM使用LPS坐标系（Left-Posterior-Superior），即：病人左侧为X正方向，后方为Y正方向，头侧为Z正方向。



NIfTI使用RAS坐标系（Right-Anterior-Superior），X方向与DICOM相反。



在重采样和导出NIfTI时，需要正确进行坐标变换。论文中所有坐标计算（体积、上下界、质心）都是基于患者物理坐标系（mm），而非体素索引，这样无需担心坐标系的左右翻转问题——直接使用ImagePositionPatient和体素间距转换即可。



这就是为什么论文特别强调"DicomZ轴"——用的是物理坐标而非体素索引，避免坐标系混淆。
</div>
</details>

</div>

---

<div class="chapter-nav">

<a class="chapter-nav-link" href="/custom/thesis-defense/">📑 总览</a>

<a class="chapter-nav-link" href="/custom/thesis-defense/framework">← 🏥 医学背景与整体框架</a>

<a class="chapter-nav-link chapter-nav-next" href="/custom/thesis-defense/gmm">🏥 GMM聚类与特征 →</a>

</div>
