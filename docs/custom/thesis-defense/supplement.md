---
custom: true
partTitle: 答辩问题 · 食管癌 GTV · 补充问题
partColor: #0d9488
---

<div class="part-hero custom-hero chapter-hero" style="--part-color: #0d9488">

# 🏥 补充问题

<p class="part-desc">答辩问题 · 食管癌 GTV · 第 9/9 章 · 5 题</p>
<span class="part-round custom-tag">面试问答</span>

</div>

<div class="chapter-nav">

<a class="chapter-nav-link" href="../">📑 总览</a>

<a class="chapter-nav-link" href="innovation">← 🏥 创新点与展望</a>

</div>

<div class="question-card ai100-card interview-card compact-card" id="q01-论文中做了哪些消融实验-你觉得还应该补充哪些">

<h2 class="question-title"><span class="q-badge ai100-badge">Q78</span><span class="question-text">论文中做了哪些消融实验？你觉得还应该补充哪些？</span></h2>

<details class="answer-reveal answer-dual-reveal">
<summary>展开回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 补充 · 考察点：补充</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：论文的消融实验（Ablation Study）主要包括：</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

<div class="answer-dual" data-anchor="q01-论文中做了哪些消融实验-你觉得还应该补充哪些">
<div class="answer-mode-tabs">
<label class="answer-mode-btn answer-mode-left">
<input type="radio" name="mode-q01-论文中做了哪些消融实验-你觉得还应该补充哪些" value="recite" checked>
<span>📖 背诵用 · 通俗版</span>
</label>
<label class="answer-mode-btn answer-mode-right">
<input type="radio" name="mode-q01-论文中做了哪些消融实验-你觉得还应该补充哪些" value="interview">
<span>🎯 面试用 · 正式版</span>
</label>
</div>
<div class="answer-mode-panel answer-mode-recite">

明确做了三组：①阈值τ从0.5到0.95的逐级对比；②Dice+BCE和Focal-Tversky的对比；③四种策略A/B/C/D的对比。

该补但没做的：去掉SPADE看效果降多少、去掉解剖先验看哪个最重要、Gate去掉改成平均融合、专家数试1/2/3/4个。
没做是因为竞赛时间不够——但这些问题答辩时评审会问，提前准备好解释。
💡 做了三类消融，还有五类可以补做。

</div>
<div class="answer-mode-panel answer-mode-interview">

论文的消融实验（Ablation Study）主要包括：



明确做的：

① 后处理阈值τ消融：τ从0.50→0.90→0.95的逐阶段对比，验证了高阈值对Precision的提升作用

② 损失函数消融：Dice+BCE基线→Focal-Tversky微调的对比，展示了两阶段训练的收益

③ 四种策略对比：A/B/C/D本质上是"分型信息利用方式"的消融——统一vs分离vs条件vs集成



建议补充的消融实验（提升论文严谨性）：

① SPADE消融：去掉SPADE改为简单拼接 → 量化SPADE的独立贡献

② 解剖先验通道消融：分别去掉Z轴/中心线/边界距离图 → 看哪个先验最重要

③ Gate消融：去掉门控直接平均融合 vs 可学习融合 → 证明Gate的学习价值

④ MoE专家数消融：1专家(统一) vs 2专家 vs 3专家 vs 4专家 → 验证"三"是否最优

⑤ 数据量消融：用不同比例训练数据(20%/50%/80%/100%)训练 → 绘制学习曲线



竞赛的时间限制使得无法做完整消融，但以上是评审可能会追问的。建议答辩时诚实说明已做/未做的消融。

</div>
</div>
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q02-论文的数据预处理代码是怎么组织的-训练-推理流程是怎样的">

<h2 class="question-title"><span class="q-badge ai100-badge">Q79</span><span class="question-text">论文的数据预处理代码是怎么组织的？训练-推理流程是怎样的？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 补充 · 考察点：补充</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：从论文描述可以推断代码组织如下：</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

从论文描述可以推断代码组织如下：



预处理阶段（一次性，生成NIfTI后重用）：

① DICOM排序 → ② HU转换+裁剪+归一化 → ③ 重采样(CT三线性/Mask最近邻) → ④ 生成解剖先验图(Z轴/中心线/边界距离) → ⑤ 导出NIfTI + 特征表



训练阶段（nnU-Net自动管理大部分流程）：

① 读取NIfTI数据 → ② Tumor BBox裁剪 → ③ 每epoch随机采样4个patch → ④ 数据增强(实时) → ⑤ 前向传播(编码器→SPADE调制→Gate路由→MoE融合) → ⑥ 计算组合Loss → ⑦ 反向传播 → ⑧ 验证集评估



推理阶段（测试集）：

① 读取测试CT(NIfTI) → ② Body BBox确定搜索范围 → ③ 滑窗推理(32×128×128 patch, 50%重叠) → ④ 高斯加权融合 → ⑤ τ=0.95二值化 → ⑥ 最大连通域+形态学开运算 → ⑦ 输出GTV Mask + 计算物理特征



工具栈(推断)：Python(SimpleITK/PyDicom/Nibabel)做预处理 + nnU-Net v2(PyTorch)做训练 + NumPy/Scipy做后处理
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q03-为什么SPADE中使用InstanceNorm而不是BatchNorm">

<h2 class="question-title"><span class="q-badge ai100-badge">Q80</span><span class="question-text">为什么SPADE中使用InstanceNorm而不是BatchNorm？</span></h2>

<details class="answer-reveal answer-dual-reveal">
<summary>展开回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 补充 · 考察点：补充</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：这是一个有意为之的技术选择：</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

<div class="answer-dual" data-anchor="q03-为什么SPADE中使用InstanceNorm而不是BatchNorm">
<div class="answer-mode-tabs">
<label class="answer-mode-btn answer-mode-left">
<input type="radio" name="mode-q03-为什么SPADE中使用InstanceNorm而不是BatchNorm" value="recite" checked>
<span>📖 背诵用 · 通俗版</span>
</label>
<label class="answer-mode-btn answer-mode-right">
<input type="radio" name="mode-q03-为什么SPADE中使用InstanceNorm而不是BatchNorm" value="interview">
<span>🎯 面试用 · 正式版</span>
</label>
</div>
<div class="answer-mode-panel answer-mode-recite">

3D医学图像训练时一次只能放2到4个样本进GPU（因为显存不够）。BatchNorm在这么小的批次上做跨样本统计会非常不稳定。

InstanceNorm是在单个样本内部做的归一化——不管你batch多大，统计都是准的。
而且SPADE的设计就是IN→去"风格差异"、留"结构"→再用位置信息定制外观。IN和SPADE是天生的一对。
💡 小batch下IN比BN统计更稳，SPADE原装配置。

</div>
<div class="answer-mode-panel answer-mode-interview">

这是一个有意为之的技术选择：



BatchNorm：对一个batch内所有样本的同一通道做标准化 → 依赖batch size，小batch时统计不稳定

InstanceNorm：对单个样本的每个通道独立标准化 → 不依赖batch size，更适合小batch训练



论文选择InstanceNorm的理由：

① 3D医学图像分割通常batch size很小（2-4），BatchNorm的统计估计不稳定

② InstanceNorm消除了"外观风格"差异（不同CT机器的整体亮度/对比度差异）→ 保留了结构信息 → SPADE再根据位置条件"定制"外观

③ 在图像风格迁移/条件生成（如SPADE原论文）中，InstanceNorm是标准组件，能更好地与条件调制配合



简单理解：InstanceNorm"去掉每张图的风格差异"，SPADE再根据空间位置"加上个性化的风格调整"。BatchNorm的"跨样本平均"反而会模糊图片间的个体差异。

</div>
</div>
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q04-论文的GTV特征向量构建时-为什么质心Z用的是物理坐标而不是体素索引">

<h2 class="question-title"><span class="q-badge ai100-badge">Q81</span><span class="question-text">论文的GTV特征向量构建时，为什么质心Z用的是物理坐标而不是体素索引？</span></h2>

<details class="answer-reveal answer-dual-reveal">
<summary>展开回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 补充 · 考察点：补充</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：因为不同患者的扫描范围不同：有的CT从脖子到腹腔（Z范围约-1000~0mm），有的只扫胸部（-800~-400mm）。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

<div class="answer-dual" data-anchor="q04-论文的GTV特征向量构建时-为什么质心Z用的是物理坐标而不是体素索引">
<div class="answer-mode-tabs">
<label class="answer-mode-btn answer-mode-left">
<input type="radio" name="mode-q04-论文的GTV特征向量构建时-为什么质心Z用的是物理坐标而不是体素索引" value="recite" checked>
<span>📖 背诵用 · 通俗版</span>
</label>
<label class="answer-mode-btn answer-mode-right">
<input type="radio" name="mode-q04-论文的GTV特征向量构建时-为什么质心Z用的是物理坐标而不是体素索引" value="interview">
<span>🎯 面试用 · 正式版</span>
</label>
</div>
<div class="answer-mode-panel answer-mode-recite">

层号是"在CT里的第几层"——这个值没有任何物理意义。因为不同病人扫描范围不同，同是胸中段，大范围CT可能在150层，小范围CT在80层。

物理坐标是解剖位置（毫米），不受扫描范围影响。不管扫了多少层，胸中段食管的物理位置始终在大约-500mm附近。

简单说：物理坐标是"世界的经纬度"，层号只是"照片的第几张"。
💡 物理坐标=经纬度，层号=照片编号。经纬度才有跨人比较的意义。

</div>
<div class="answer-mode-panel answer-mode-interview">

因为不同患者的扫描范围不同：有的CT从脖子到腹腔（Z范围约-1000~0mm），有的只扫胸部（-800~-400mm）。



如果使用体素索引（第几层）：同一个胸中段肿瘤，在"大范围扫描"CT中可能在第150层，在"小范围扫描"CT中可能在80层→不具备可比性。



物理坐标（DicomZ，单位mm）的优势：它是基于患者解剖位置的绝对坐标，不受扫描范围影响。例如，胸中段食管癌的质心Z坐标大约在-500mm附近，无论CT扫描了多少层。



这就是为什么论文强调使用"DicomZ轴"而非"体素Z索引"——前者是测量工具，后者只是数字编号。

</div>
</div>
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q05-如果让你给评审讲清楚-这个模型到底做了什么-你会怎么画流程图">

<h2 class="question-title"><span class="q-badge ai100-badge">Q82</span><span class="question-text">如果让你给评审讲清楚"这个模型到底做了什么"，你会怎么画流程图？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 补充 · 考察点：补充</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：从输入到输出的五步流程：</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

从输入到输出的五步流程：



第一步：CT图像进入

└→ 预处理为统一格式的NIfTI (2.5×1.0×1.0mm, HU裁剪, Min-Max归一化)



第二步：编码器提取特征

└→ 共享编码器(3D CNN, 4层下采样) → 瓶颈层语义特征向量



第三步：解剖先验注入(并行于编码器)

└→ 在线生成三张解剖先验图(Z轴位置/中心线距离/边界距离) → SPADE模块逐层调制特征



第四步：MoE专家决策

└→ Gate从瓶颈特征中判断位置 → 输出三个权重(w_U, w_M, w_L)

└→ 三个专家解码器各自预测 → 加权融合: Output = w_U×U + w_M×M + w_L×L



第五步：后处理输出

└→ τ=0.95 二值化 → 保留最大连通域 → 形态学开运算 → 最终的GTV二值Mask



通俗版：CT进去→提取特征→查地图知位置→三位专家会诊→清洗结果→GTV出来。
</div>
</details>

</div>

---

<div class="chapter-nav">

<a class="chapter-nav-link" href="../">📑 总览</a>

<a class="chapter-nav-link" href="innovation">← 🏥 创新点与展望</a>

</div>
