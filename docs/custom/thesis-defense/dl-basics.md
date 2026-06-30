---
custom: true
partTitle: 答辩问题 · 食管癌 GTV · 深度学习基础
partColor: #0d9488
---

<div class="part-hero custom-hero chapter-hero" style="--part-color: #0d9488">

# 🏥 深度学习基础

<p class="part-desc">答辩问题 · 食管癌 GTV · 第 4/9 章 · 8 题</p>
<span class="part-round custom-tag">面试问答</span>

</div>

<div class="chapter-nav">

<a class="chapter-nav-link" href="../">📑 总览</a>

<a class="chapter-nav-link" href="gmm">← 🏥 GMM聚类与特征</a>

<a class="chapter-nav-link chapter-nav-next" href="model">🏥 模型架构与策略 →</a>

</div>

<div class="question-card ai100-card interview-card compact-card" id="q01-什么是TP-FP-FN-TN-为什么FN在医学中最危险">

<h2 class="question-title"><span class="q-badge ai100-badge">Q34</span><span class="question-text">什么是TP、FP、FN、TN？为什么FN在医学中最危险？</span></h2>

<details class="answer-reveal answer-dual-reveal">
<summary>展开回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割 · 考察点：深度学习基础</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：TP（真正例）：真实是肿瘤，模型也预测是肿瘤 ✓ 分对了</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

<div class="answer-dual" data-anchor="q01-什么是TP-FP-FN-TN-为什么FN在医学中最危险">
<div class="answer-mode-tabs">
<label class="answer-mode-btn answer-mode-left">
<input type="radio" name="mode-q01-什么是TP-FP-FN-TN-为什么FN在医学中最危险" value="recite" checked>
<span>📖 背诵用 · 通俗版</span>
</label>
<label class="answer-mode-btn answer-mode-right">
<input type="radio" name="mode-q01-什么是TP-FP-FN-TN-为什么FN在医学中最危险" value="interview">
<span>🎯 面试用 · 正式版</span>
</label>
</div>
<div class="answer-mode-panel answer-mode-recite">

T是True（对了），F是False（错了）。P是Positive（预测是肿瘤），N是Negative（预测不是肿瘤）。

TP：真的是肿瘤，模型也说是肿瘤 ✓ 对了
FP：其实不是肿瘤，模型却说是肿瘤 ✗ 误报了
FN：真的是肿瘤，模型却说不是 ✗✗ 漏报了！！！
TN：真的不是肿瘤，模型也说不是 ✓ 对了

放疗里FN最要命——肿瘤在那里，你没画进去，那这一块就不会被照射。后果是什么？肿瘤局部复发，治疗失败。
FP多画了一些正常组织，最多就是副作用大一点，不会致命。

机场安检就是最好的例子：FP是把好人拦下来检查（麻烦但不危险），FN是把炸药放过去了（要命）。
💡 FN=把肿瘤漏了→不照射→复发。FP=多画了点正常组织→副作用大。FN更致命。

</div>
<div class="answer-mode-panel answer-mode-interview">

TP（真正例）：真实是肿瘤，模型也预测是肿瘤 ✓ 分对了

FP（假正例）：真实不是肿瘤，但模型误判为肿瘤 ✗ 误检/虚惊

FN（假负例）：真实是肿瘤，但模型没预测出来 ✗✗ 漏检！

TN（真负例）：真实不是肿瘤，模型也预测不是肿瘤 ✓



FN最危险：放疗中，肿瘤区域没被画进靶区 = 这部分肿瘤不会被照射 = 可能导致局部复发、治疗失败。

FP"只是"多画了些正常组织，会增加辐射副反应，但通常不致命。



通俗类比：机场安检。FP = 把好人拦下来检查（麻烦但安全），FN = 把危险物品放过去（可能出大事）。

</div>
</div>
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q02-为什么要引入位置先验和解剖信息-不让CNN自己学不行吗">

<h2 class="question-title"><span class="q-badge ai100-badge">Q35</span><span class="question-text">为什么要引入位置先验和解剖信息？不让CNN自己学不行吗？</span></h2>

<details class="answer-reveal answer-dual-reveal">
<summary>展开回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割 · 考察点：深度学习基础</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：医生勾画肿瘤时，不是只盯着CT灰度。医生还知道：食管在胸腔中间、沿头脚方向走、上段靠近气管、中段靠近心脏、下段靠近胃……</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

<div class="answer-dual" data-anchor="q02-为什么要引入位置先验和解剖信息-不让CNN自己学不行吗">
<div class="answer-mode-tabs">
<label class="answer-mode-btn answer-mode-left">
<input type="radio" name="mode-q02-为什么要引入位置先验和解剖信息-不让CNN自己学不行吗" value="recite" checked>
<span>📖 背诵用 · 通俗版</span>
</label>
<label class="answer-mode-btn answer-mode-right">
<input type="radio" name="mode-q02-为什么要引入位置先验和解剖信息-不让CNN自己学不行吗" value="interview">
<span>🎯 面试用 · 正式版</span>
</label>
</div>
<div class="answer-mode-panel answer-mode-recite">

理论上行，但我们的数据只有105例——太少了，模型根本学不会人体的完整解剖结构。

医生画肿瘤的时候不是只看CT灰度的。医生脑子里有大量知识：食道在胸腔正中间、上段挨着气管、中段挨着心脏、下段挨着胃。这些知识医生在学校和临床中学了很多年。

普通的深度学习模型——它只会从像素灰度里找规律。它不知道"这个像素是人体第几层"、"离中心线多远"。

我们做的就是把医生脑子里的这些知识，转化成模型能理解的"地图"：Z轴位置图告诉它"你在多高"、中心线距离图告诉它"你离中心多远"、边界距离图告诉它"你离体表多远"。

有了这张地图，105例就够用了——因为模型不是在从零开始学解剖，而是在"已知人体构造"的前提下学找肿瘤。
💡 给模型发一张人体的GPS地图，别让它闭着眼摸黑找。

</div>
<div class="answer-mode-panel answer-mode-interview">

医生勾画肿瘤时，不是只盯着CT灰度。医生还知道：食管在胸腔中间、沿头脚方向走、上段靠近气管、中段靠近心脏、下段靠近胃……



普通CNN只看灰度 → 不知道"这个像素在人体哪个位置"。



引入先验信息，相当于告诉网络：

· 位置先验（Z轴相对位置图）→ "你现在看的是人体上三分之一" → 回答"肿瘤在哪"

· 解剖信息（中心线距离、边界距离）→ "这里离人体中心5cm，离体表边缘8cm" → 回答"肿瘤周围有什么"



理论上CNN可以通过大量数据学到空间规律，但只有105例——太少。直接把医生已知的知识"喂"给网络，相当于给一个学生发了重点笔记，他可以少走很多弯路。实验证明：加入解剖先验后Dice从约0.60提升到0.71。

</div>
</div>
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q03-什么是编码器-编码器到底-编-了什么">

<h2 class="question-title"><span class="q-badge ai100-badge">Q36</span><span class="question-text">什么是编码器？编码器到底"编"了什么？</span></h2>

<details class="answer-reveal answer-dual-reveal">
<summary>展开回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割 · 考察点：深度学习基础</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：编码器（Encoder）是U-Net的前半部分，负责从CT图像中逐层提取越来越抽象的特征。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

<div class="answer-dual" data-anchor="q03-什么是编码器-编码器到底-编-了什么">
<div class="answer-mode-tabs">
<label class="answer-mode-btn answer-mode-left">
<input type="radio" name="mode-q03-什么是编码器-编码器到底-编-了什么" value="recite" checked>
<span>📖 背诵用 · 通俗版</span>
</label>
<label class="answer-mode-btn answer-mode-right">
<input type="radio" name="mode-q03-什么是编码器-编码器到底-编-了什么" value="interview">
<span>🎯 面试用 · 正式版</span>
</label>
</div>
<div class="answer-mode-panel answer-mode-recite">

编码器就是网络的前半段，它的工作是从CT图像里一层一层地提取特征。

第一层：看到边缘、纹理、灰度变化——"这里有个明显的亮度变化"
第二层：看到小的形状——"这里有块圆形的区域"
第三层：看到器官的大致轮廓——"这应该是食管周围的组织"
最深处（瓶颈）：看到整张图的含义——"这是一个胸中段的食管癌"

越深越抽象，从"像素"变成了"语义"。我们所有的病人都共享这一个编码器——105例的经验全部汇聚在一个编码器里，不浪费。
💡 编码器=特征浓缩器，从像素到语义，越来越抽象。

</div>
<div class="answer-mode-panel answer-mode-interview">

编码器（Encoder）是U-Net的前半部分，负责从CT图像中逐层提取越来越抽象的特征。



第1层：看到边缘、灰度梯度、纹理 → "这里有亮度变化"

第2层：看到局部形状、小结构 → "这是一个圆形区域"

第3层：看到器官轮廓、组织边界 → "这可能是食管区域"

第4层（瓶颈）：看到全局语义 → "这是一个中位食管癌病例"



编码器的输出是一个"语义浓缩"——空间分辨率降低了16倍，但每个特征通道都编码了丰富的抽象信息。共享编码器的意义：所有病例都用同一个编码器提取特征，105例的特征学习经验被"汇集"在一起，不会浪费。

</div>
</div>
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q04-什么是跳跃连接-为什么U-Net必须有它">

<h2 class="question-title"><span class="q-badge ai100-badge">Q37</span><span class="question-text">什么是跳跃连接？为什么U-Net必须有它？</span></h2>

<details class="answer-reveal answer-dual-reveal">
<summary>展开回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割 · 考察点：深度学习基础</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：跳跃连接（Skip Connection）是U-Net的标志性设计：编码器第i层的特征图，直接"抄近路"传给解码器对应层。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

<div class="answer-dual" data-anchor="q04-什么是跳跃连接-为什么U-Net必须有它">
<div class="answer-mode-tabs">
<label class="answer-mode-btn answer-mode-left">
<input type="radio" name="mode-q04-什么是跳跃连接-为什么U-Net必须有它" value="recite" checked>
<span>📖 背诵用 · 通俗版</span>
</label>
<label class="answer-mode-btn answer-mode-right">
<input type="radio" name="mode-q04-什么是跳跃连接-为什么U-Net必须有它" value="interview">
<span>🎯 面试用 · 正式版</span>
</label>
</div>
<div class="answer-mode-panel answer-mode-recite">

编码器在"浓缩"特征的时候，图片越变越小，细节（比如肿瘤的精确边界）就丢失了。

跳跃连接就是把编码器早期保留的"高分辨率细节"，直接抄一条近路传给解码器。解码器拿到这些细节，就能恢复出精确的边界。

没有跳跃连接：解码器只能从模糊的抽象特征里"脑补"出边界→模糊的轮廓
有跳跃连接：解码器拿到了原始的边界细节→清晰的轮廓

好比你在纸上画一个人：先画轮廓草稿（编码器），再细化五官（解码器）。跳跃连接就是你一直拿着最初的草稿参考着画，不会画走形。
💡 跳跃连接=给解码器"递小抄"，让它别忘了编码器早期看到的细节。

</div>
<div class="answer-mode-panel answer-mode-interview">

跳跃连接（Skip Connection）是U-Net的标志性设计：编码器第i层的特征图，直接"抄近路"传给解码器对应层。



编码器下采样时，每降一级就丢失一部分空间细节（边缘、纹理、轮廓变模糊）。

跳跃连接把编码器早期保留的高分辨率细节，直接输送给解码器——告诉解码器"别忘了之前看到的边缘！"



没有跳跃连接 → 解码器只能从高度抽象的特征中"脑补"细节 → 边界模糊、锯齿严重

有跳跃连接 → 解码器可以精确恢复肿瘤的轮廓边界



类比：你画素描时先打草稿（编码器），再细化细节（解码器）。跳跃连接就是你一直拿着最初的草稿参考着画，不会画走形。

</div>
</div>
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q05-什么是3D卷积-和2D卷积有什么区别">

<h2 class="question-title"><span class="q-badge ai100-badge">Q38</span><span class="question-text">什么是3D卷积？和2D卷积有什么区别？</span></h2>

<details class="answer-reveal answer-dual-reveal">
<summary>展开回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割 · 考察点：深度学习基础</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：2D卷积：卷积核在高×宽方向上滑动，只看当前这一张切片。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

<div class="answer-dual" data-anchor="q05-什么是3D卷积-和2D卷积有什么区别">
<div class="answer-mode-tabs">
<label class="answer-mode-btn answer-mode-left">
<input type="radio" name="mode-q05-什么是3D卷积-和2D卷积有什么区别" value="recite" checked>
<span>📖 背诵用 · 通俗版</span>
</label>
<label class="answer-mode-btn answer-mode-right">
<input type="radio" name="mode-q05-什么是3D卷积-和2D卷积有什么区别" value="interview">
<span>🎯 面试用 · 正式版</span>
</label>
</div>
<div class="answer-mode-panel answer-mode-recite">

2D卷积只看一层切片——就像你只看一张照片。
3D卷积同时看上下好几层切片——就像你把一个物体拿在手里旋转着看。

CT是三维的，肿瘤也是三维的。2D卷积处理CT是一层一层来，切断了层与层之间的联系。3D卷积可以利用"这一层和上下两层肿瘤的位置是连续的"这个信息。

就好比医生看CT不是只看一张切片，而是在脑子里把几十张切片叠起来看——3D卷积就是这个"叠起来看"的数学实现。
💡 3D=S0 上下几层一起看，利用纵向连续性。2D只看一层。

</div>
<div class="answer-mode-panel answer-mode-interview">

2D卷积：卷积核在高×宽方向上滑动，只看当前这一张切片。

3D卷积：卷积核在宽×高×深三个方向上滑动，同时看相邻多层切片。



CT是三维数据，食管癌GTV也是三维结构。如果用2D：

· 无法利用层间连续性（相邻切片上肿瘤通常是连续的）

· Z方向定位不准

· 体积估计容易出现跳跃



3D卷积天然适合医学影像——就像医生看CT不是只看一张切片，而是在脑子里把几十张"叠"成三维。

</div>
</div>
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q06-Sigmoid函数在分割模型中起什么作用">

<h2 class="question-title"><span class="q-badge ai100-badge">Q39</span><span class="question-text">Sigmoid函数在分割模型中起什么作用？</span></h2>

<details class="answer-reveal answer-dual-reveal">
<summary>展开回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割 · 考察点：深度学习基础</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Sigmoid: σ(x) = 1/(1+e^(-x))，把任意实数压缩到(0,1)之间。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

<div class="answer-dual" data-anchor="q06-Sigmoid函数在分割模型中起什么作用">
<div class="answer-mode-tabs">
<label class="answer-mode-btn answer-mode-left">
<input type="radio" name="mode-q06-Sigmoid函数在分割模型中起什么作用" value="recite" checked>
<span>📖 背诵用 · 通俗版</span>
</label>
<label class="answer-mode-btn answer-mode-right">
<input type="radio" name="mode-q06-Sigmoid函数在分割模型中起什么作用" value="interview">
<span>🎯 面试用 · 正式版</span>
</label>
</div>
<div class="answer-mode-panel answer-mode-recite">

模型最后面输出的是一堆任意实数，可能是-3、0、5.2……这些数字没法直接解释成"是不是肿瘤"。

Sigmoid是一个数学函数，它干的事很简单：把任何实数压缩到0到1之间。
输入是很大的正数（比如5）→输出约等于0.99——非常可能是肿瘤
输入是很大的负数（比如-5）→输出约等于0.01——非常不可能
输入是0→输出0.5——不确定

所以Sigmoid的作用就是：把网络的原始输出翻译成"概率"。配合一个阈值（比如0.95），就能做出二值判断。
💡 Sigmoid=概率翻译器。大正→接近1，大负→接近0。

</div>
<div class="answer-mode-panel answer-mode-interview">

Sigmoid: σ(x) = 1/(1+e^(-x))，把任意实数压缩到(0,1)之间。



网络最后一层输出的是logits（可以是任意实数：-3、0、5.2），没有概率含义。

Sigmoid之后：

· x = +5 → 输出≈0.993 → 几乎肯定是肿瘤

· x = -5 → 输出≈0.007 → 几乎肯定是背景

· x = 0 → 输出=0.5 → 完全不确定



最终的概率图上每个像素值都代表"属于肿瘤的概率"。配合阈值τ（论文用0.95）即可生成二值分割结果。

</div>
</div>
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q07-什么是下采样-上采样-为什么U-Net是U型的">

<h2 class="question-title"><span class="q-badge ai100-badge">Q40</span><span class="question-text">什么是下采样？上采样？为什么U-Net是U型的？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割 · 考察点：深度学习基础</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：下采样（缩小特征图）：像从"贴着画看笔触"→"站远看全貌"。扩大感受野 → 看到更大范围的上下文。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

下采样（缩小特征图）：像从"贴着画看笔触"→"站远看全貌"。扩大感受野 → 看到更大范围的上下文。

上采样（放大特征图）：像从"模糊缩略图"→"高清大图"。恢复空间分辨率 → 能精确定位每个像素。



U-Net的U型：

左半边（编码器）逐层缩小 → 从纹理→形状→语义，越来越"懂"这幅图

右半边（解码器）逐层放大 → 从语义→形状→像素，恢复精细的分割边界

中间（跳跃连接）→ 用编码器的细节"补全"解码器的模糊



没有下采样→看不到整体结构。没有上采样→无法做像素级分割。两者缺一不可。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q08-nnU-Net的-自我配置-具体做了什么-为什么选它">

<h2 class="question-title"><span class="q-badge ai100-badge">Q41</span><span class="question-text">nnU-Net的"自我配置"具体做了什么？为什么选它？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割 · 考察点：深度学习基础</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：nnU-Net（no-new-Net）的设计哲学：不要发明新架构，而是把数据预处理、训练和后处理的每个环节都自动化。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

nnU-Net（no-new-Net）的设计哲学：不要发明新架构，而是把数据预处理、训练和后处理的每个环节都自动化。



自动配置的内容：

① 根据数据中位数体素间距，自动选择目标重采样间距

② 根据数据集大小和GPU显存，自动选择网络深度、patch大小、batch size

③ 自动设计数据增强策略（旋转、翻转、缩放、噪声等）

④ 自动进行后处理优化



为什么选它：在数十个国际医学分割竞赛中，nnU-Net仅靠配置优化（不改变U-Net架构本身）就取得SOTA。对于105例小样本，自动配置避免了人工调参的过拟合风险，是最安全高效的选择。
</div>
</details>

</div>

---

<div class="chapter-nav">

<a class="chapter-nav-link" href="../">📑 总览</a>

<a class="chapter-nav-link" href="gmm">← 🏥 GMM聚类与特征</a>

<a class="chapter-nav-link chapter-nav-next" href="model">🏥 模型架构与策略 →</a>

</div>
