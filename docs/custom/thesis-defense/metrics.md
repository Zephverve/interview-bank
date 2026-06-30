---
custom: true
partTitle: 答辩问题 · 食管癌 GTV · 评价指标与训练
partColor: #0d9488
---

<div class="part-hero custom-hero chapter-hero" style="--part-color: #0d9488">

# 🏥 评价指标与训练

<p class="part-desc">答辩问题 · 食管癌 GTV · 第 6/9 章 · 9 题</p>
<span class="part-round custom-tag">面试问答</span>

</div>

<div class="chapter-nav">

<a class="chapter-nav-link" href="../">📑 总览</a>

<a class="chapter-nav-link" href="model">← 🏥 模型架构与策略</a>

<a class="chapter-nav-link chapter-nav-next" href="deploy">🏥 假设不足与部署 →</a>

</div>

<div class="question-card ai100-card interview-card compact-card" id="q01-Dice和IoU有什么区别-Dice为什么更高">

<h2 class="question-title"><span class="q-badge ai100-badge">Q58</span><span class="question-text">Dice和IoU有什么区别？Dice为什么更高？</span></h2>

<details class="answer-reveal answer-dual-reveal">
<summary>展开回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 核心指标 · 考察点：核心指标</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Dice = 2TP/(2TP+FP+FN)  ·  IoU = TP/(TP+FP+FN)</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

<div class="answer-dual" data-anchor="q01-Dice和IoU有什么区别-Dice为什么更高">
<div class="answer-mode-tabs">
<label class="answer-mode-btn answer-mode-left">
<input type="radio" name="mode-q01-Dice和IoU有什么区别-Dice为什么更高" value="recite" checked>
<span>📖 背诵用 · 通俗版</span>
</label>
<label class="answer-mode-btn answer-mode-right">
<input type="radio" name="mode-q01-Dice和IoU有什么区别-Dice为什么更高" value="interview">
<span>🎯 面试用 · 正式版</span>
</label>
</div>
<div class="answer-mode-panel answer-mode-recite">

Dice = 2×重叠面积 / (预测面积+真实面积)
IoU = 重叠面积 / (预测面积+真实面积-重叠面积)

数学上Dice总是≥IoU，因为Dice给重叠区域双倍权重。

医学分割为什么首选Dice？因为肿瘤很小（只占图像的百分之零点几），Dice对小目标变化更敏感——模型进步一点点，Dice就能看出来。IoU在小目标上变动太小，不够灵敏。
💡 Dice=双倍看重叠，小目标更敏感。

</div>
<div class="answer-mode-panel answer-mode-interview">

Dice = 2TP/(2TP+FP+FN)  ·  IoU = TP/(TP+FP+FN)



两者的分子相差一倍——Dice给重叠区域赋了2倍权重。

所以Dice数值始终 ≥ IoU（Dice=0.714, IoU=0.561）。



Dice更常用在医学分割中因为：

① 对小目标更敏感（重叠区域在分母占比更大）

② 变化范围更宽，更容易区分不同模型的性能差异

IoU通常作为辅助指标一起报告。

</div>
</div>
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q02-为什么不用Accuracy">

<h2 class="question-title"><span class="q-badge ai100-badge">Q59</span><span class="question-text">为什么不用Accuracy？</span></h2>

<details class="answer-reveal answer-dual-reveal">
<summary>展开回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 核心指标 · 考察点：核心指标</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：类别极度不平衡：食管癌GTV在胸部CT中通常仅占0.1%~1%的体积。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

<div class="answer-dual" data-anchor="q02-为什么不用Accuracy">
<div class="answer-mode-tabs">
<label class="answer-mode-btn answer-mode-left">
<input type="radio" name="mode-q02-为什么不用Accuracy" value="recite" checked>
<span>📖 背诵用 · 通俗版</span>
</label>
<label class="answer-mode-btn answer-mode-right">
<input type="radio" name="mode-q02-为什么不用Accuracy" value="interview">
<span>🎯 面试用 · 正式版</span>
</label>
</div>
<div class="answer-mode-panel answer-mode-recite">

因为肿瘤在整张CT里太小了——只占约0.1%到1%的面积，剩下99%全是背景。

如果模型"偷懒"，把整个CT的每一个像素都预测为背景（不是肿瘤），它的准确率可以高达99%以上——看起来完美，但其实一个肿瘤都没找出来。

这就是"不平衡数据上的准确率陷阱"。Dice只看肿瘤区域的重叠，不受海量背景像素的影响，所以才是医学分割的真指标。
💡 全判背景=99%准确率但毫无用处。Dice不看背景，只看正事。

</div>
<div class="answer-mode-panel answer-mode-interview">

类别极度不平衡：食管癌GTV在胸部CT中通常仅占0.1%~1%的体积。



如果模型"偷懒"全部预测为背景，Accuracy = (全部体素-肿瘤体素)/全部体素 ≈ 99%+ ——看起来完美，但毫无用处。



这就是著名的"Accuracy悖论"：在不平衡数据上，高Accuracy ≠ 好模型。

Dice只关心预测区域和真实区域的重叠（对前景加权），天然不受类别不平衡影响。

</div>
</div>
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q03-过勾体积比-漏勾体积比和RVD分别代表什么临床风险">

<h2 class="question-title"><span class="q-badge ai100-badge">Q60</span><span class="question-text">过勾体积比、漏勾体积比和RVD分别代表什么临床风险？</span></h2>

<details class="answer-reveal answer-dual-reveal">
<summary>展开回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 核心指标 · 考察点：核心指标</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：R_over（过勾体积比 = FP/Pred）：模型的预测中有多少比例是"多画的"。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

<div class="answer-dual" data-anchor="q03-过勾体积比-漏勾体积比和RVD分别代表什么临床风险">
<div class="answer-mode-tabs">
<label class="answer-mode-btn answer-mode-left">
<input type="radio" name="mode-q03-过勾体积比-漏勾体积比和RVD分别代表什么临床风险" value="recite" checked>
<span>📖 背诵用 · 通俗版</span>
</label>
<label class="answer-mode-btn answer-mode-right">
<input type="radio" name="mode-q03-过勾体积比-漏勾体积比和RVD分别代表什么临床风险" value="interview">
<span>🎯 面试用 · 正式版</span>
</label>
</div>
<div class="answer-mode-panel answer-mode-recite">

过勾比 = 你多画了多少——把正常组织当肿瘤了。后果是病人多受了辐射，副作用增加。
漏勾比 = 你漏了多少——真正的肿瘤没画进去。后果是这部分肿瘤不会被照射→可能复发。
RVD = 你画的体积整体偏大还是偏小——只看总数不看位置。

临床严重程度排序：漏勾（致命）> 过勾（有害但不致命）> RVD（参考指标）。

好消息是：我们策略C的漏勾比是0.186——四个方案里最低的，也就是说C漏的最少。
💡 漏勾（复发风险）>过勾（副作用）>RVD（仅供参考）。C漏勾比最低=0.186。

</div>
<div class="answer-mode-panel answer-mode-interview">

R_over（过勾体积比 = FP/Pred）：模型的预测中有多少比例是"多画的"。

→ 临床风险：正常组织被错误纳入靶区 → 辐射副反应增加。论文C的R_over=0.353，即预测中有35.3%是假阳性。



R_under（漏勾体积比 = FN/GT）：真实肿瘤中有多少比例被"漏掉了"。

→ 临床风险：肿瘤区域未被照射 → 局部复发、治疗失败。C的R_under=0.186，漏掉18.6%的真实肿瘤体积。



RVD（相对体积偏差 = (|Pred|-|GT|)/|GT|）：整体偏大还是偏小？

→ RVD=+0.293：预测体积偏大约29%。RVD只看体积不对应位置——可能"体积刚好但位置全错"，必须和Dice等联合判断。



医学上通常更关注R_under（漏勾）> R_over（过勾） > RVD（体积），因为漏勾的后果最严重。

</div>
</div>
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q04-HD95和ASD分别衡量什么-27-4mm的HD95在临床上可接受吗">

<h2 class="question-title"><span class="q-badge ai100-badge">Q61</span><span class="question-text">HD95和ASD分别衡量什么？27.4mm的HD95在临床上可接受吗？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 核心指标 · 考察点：核心指标</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：HD95（95% Hausdorff Distance）：去掉最极端的5%距离后，预测表面到真实表面的最大距离。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

HD95（95% Hausdorff Distance）：去掉最极端的5%距离后，预测表面到真实表面的最大距离。

→ 衡量"最坏情况"——边界偏差最大的地方有多离谱。C的HD95 = 27.4mm。



ASD（Average Surface Distance）：预测表面到真实表面的平均距离。

→ 衡量"平均表现"——整体边界贴合得怎么样。C的ASD = 6.16mm。



27.4mm的HD95在临床上的含义：在CT的2.5mm层厚下约11层切片的范围——说明在最差的位置，模型的边界比金标准差了约11层。这不算优秀（理想<15mm），但对于一个小样本105例的竞赛项目，已属于可接受范围。



ASD=6.16mm（约2-3层切片误差）则相对理想，说明"平均而言"边界贴合得不错。HD95和ASD的差距大，反映了少数极端困难病例拉高了最坏情况——这是GTV分割的固有难点（边界模糊+组织灰度相近）。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q05-Bootstrap方法是什么-为什么用它估计置信区间">

<h2 class="question-title"><span class="q-badge ai100-badge">Q62</span><span class="question-text">Bootstrap方法是什么？为什么用它估计置信区间？</span></h2>

<details class="answer-reveal answer-dual-reveal">
<summary>展开回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 核心指标 · 考察点：核心指标</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Bootstrap是一种"不依赖正态假设"的统计方法：</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

<div class="answer-dual" data-anchor="q05-Bootstrap方法是什么-为什么用它估计置信区间">
<div class="answer-mode-tabs">
<label class="answer-mode-btn answer-mode-left">
<input type="radio" name="mode-q05-Bootstrap方法是什么-为什么用它估计置信区间" value="recite" checked>
<span>📖 背诵用 · 通俗版</span>
</label>
<label class="answer-mode-btn answer-mode-right">
<input type="radio" name="mode-q05-Bootstrap方法是什么-为什么用它估计置信区间" value="interview">
<span>🎯 面试用 · 正式版</span>
</label>
</div>
<div class="answer-mode-panel answer-mode-recite">

传统统计学在估计"真实值范围"的时候，通常假设数据服从正态分布（像钟形曲线一样对称）。

但我们的肿瘤体积根本不服从正态分布——均值43216、中位数32805、标准差36866几乎等于均值。这是什么意思？数据严重右偏，少数几个超大肿瘤把均值拉高了。

Bootstrap的做法很聪明：不假设任何分布。它从105个数据中有放回地随机抽105个（有人会被抽中多次，有人可能一次都不被抽中），计算中位数。重复这个过程2000次，就得到了2000个可能的中位数，然后取第2.5%小和第97.5%大的作为95%置信区间。

这就像你拿一副扑克牌，反复洗牌抽牌2000次，看中位数稳定在什么范围——不需要预设它是什么分布。
💡 Bootstrap=重抽样2000次算分布→不需要正态假设。适合偏态数据。

</div>
<div class="answer-mode-panel answer-mode-interview">

Bootstrap是一种"不依赖正态假设"的统计方法：



① 从105例数据中，有放回地随机抽取105例（有些可能被抽多次，有些没被抽到）

② 计算这个"重采样数据集"的体积中位数

③ 重复2000次 → 得到2000个中位数的分布

④ 取2.5%和97.5%分位数作为95%置信区间



为什么不用正态置信区间？GTV体积分布高度右偏（均值43216 > 中位数32805，标准差36866接近均值），不服从正态分布。传统t检验的正态假设不成立。Bootstrap不需要任何分布假设，特别适合这种偏态小样本医学数据。



2000次采样已经充分稳定——理论上1000次以上Bootstrap分布基本收敛。

</div>
</div>
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q06-Patch-size-32-128-128-是怎么确定的">

<h2 class="question-title"><span class="q-badge ai100-badge">Q63</span><span class="question-text">Patch size (32,128,128) 是怎么确定的？</span></h2>

<details class="answer-reveal answer-dual-reveal">
<summary>展开回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 训练配置 · 考察点：训练配置</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Z=32层：在2.5mm层厚下覆盖约8cm → 大多数GTV纵向跨度2-12cm，32层能覆盖大部分，GPU显存也可接受</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

<div class="answer-dual" data-anchor="q06-Patch-size-32-128-128-是怎么确定的">
<div class="answer-mode-tabs">
<label class="answer-mode-btn answer-mode-left">
<input type="radio" name="mode-q06-Patch-size-32-128-128-是怎么确定的" value="recite" checked>
<span>📖 背诵用 · 通俗版</span>
</label>
<label class="answer-mode-btn answer-mode-right">
<input type="radio" name="mode-q06-Patch-size-32-128-128-是怎么确定的" value="interview">
<span>🎯 面试用 · 正式版</span>
</label>
</div>
<div class="answer-mode-panel answer-mode-recite">

GPU显存是有限的大小的，你不能把整个CT一次性塞进去（那要几十GB显存）。所以切成小块来训练——这就是Patch。

Z方向32层：在2.5mm层厚下覆盖约8厘米——大部分食管癌肿瘤的纵向长度在2到12厘米，8厘米够覆盖大部分。
XY方向128×128：在1.0mm像素间距下覆盖约12.8厘米见方——够包肿瘤和周围解剖结构。

这是"看得全"和"塞得下"之间的最佳平衡。
💡 8cm×12.8cm×12.8cm。刚好够包肿瘤+周围组织，显存也塞得下。

</div>
<div class="answer-mode-panel answer-mode-interview">

Z=32层：在2.5mm层厚下覆盖约8cm → 大多数GTV纵向跨度2-12cm，32层能覆盖大部分，GPU显存也可接受

Y/X=128×128：在1.0mm面内间距下覆盖12.8cm×12.8cm → 足够包含肿瘤 + 食管周围上下文 + 一定范围肺组织



这个尺寸是"信息完整性"和"计算可行性"的平衡：

· 太小（如16,64,64）→ 看不到完整的纵向结构

· 太大（如64,256,256）→ GPU显存爆掉

· 32×128×128在典型GPU（16GB显存）上batch_size=2-4可以稳定训练



滑窗重叠50%：确保相邻patch之间的过渡平滑，减少窗口边界的预测不连续。

</div>
</div>
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q07-后处理为什么选τ-0-95而不是常规的0-5">

<h2 class="question-title"><span class="q-badge ai100-badge">Q64</span><span class="question-text">后处理为什么选τ=0.95而不是常规的0.5？</span></h2>

<details class="answer-reveal answer-dual-reveal">
<summary>展开回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 训练配置 · 考察点：训练配置</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：传统二值化用0.5（概率≥50%就是肿瘤），但论文的消融实验发现0.95更优：</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

<div class="answer-dual" data-anchor="q07-后处理为什么选τ-0-95而不是常规的0-5">
<div class="answer-mode-tabs">
<label class="answer-mode-btn answer-mode-left">
<input type="radio" name="mode-q07-后处理为什么选τ-0-95而不是常规的0-5" value="recite" checked>
<span>📖 背诵用 · 通俗版</span>
</label>
<label class="answer-mode-btn answer-mode-right">
<input type="radio" name="mode-q07-后处理为什么选τ-0-95而不是常规的0-5" value="interview">
<span>🎯 面试用 · 正式版</span>
</label>
</div>
<div class="answer-mode-panel answer-mode-recite">

常规做法是概率大于0.5就判为肿瘤。但我们发现0.95效果更好：

阈值0.5→0.95的变化：精确率从0.476飙升到0.647、体积偏差从+98%降到+29%、Dice从0.60涨到0.71。牺牲了少量召回率（0.87→0.81）。

为什么0.95更好？因为食管癌肿瘤和正常软组织在CT上灰度非常接近——模型在边界附近的预测概率通常在0.5~0.9之间，说明它自己也不确定。
低阈值会把这些"不确定区域"全判为肿瘤→严重过分割。0.95只保留模型"非常有信心"的区域→假阳性大幅减少。

这是一个有意识的选择：牺牲一点点边缘覆盖，换取大幅减少虚假预测——放疗中值得。
💡 0.95=只有"非常有把握"才算肿瘤。牺牲少许召回换大幅精确率。

</div>
<div class="answer-mode-panel answer-mode-interview">

传统二值化用0.5（概率≥50%就是肿瘤），但论文的消融实验发现0.95更优：



τ从0.5→0.90→0.95：

· Precision: 0.476 → 0.647（大幅↑）

· RVD: +0.983 → +0.293（过分割显著抑制）

· Dice: 0.604 → 0.714（↑）

· Recall: 0.871 → 0.814（↓有所牺牲但可控）



原因：食管癌GTV的边界非常模糊（肿瘤与正常软组织HU值相近），模型在真实边界附近的预测置信度通常在0.5-0.9之间。低阈值会把这些"不确定区"全判为肿瘤→严重过分割。0.95只保留模型"非常有信心"的区域→虚假预测大幅减少。



这是一个"用少量Recall换大幅Precision提升"的有意识权衡，在放疗中值得做。

</div>
</div>
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q08-验证集20例是怎么划分的-为什么不K折交叉验证">

<h2 class="question-title"><span class="q-badge ai100-badge">Q65</span><span class="question-text">验证集20例是怎么划分的？为什么不K折交叉验证？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 训练配置 · 考察点：训练配置</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：采用Holdout划分：约70%训练、15%验证、15%测试，按临床六分型分层抽样保证各分型比例一致。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

采用Holdout划分：约70%训练、15%验证、15%测试，按临床六分型分层抽样保证各分型比例一致。



不用K折交叉验证的原因：

① 3D医学分割训练一次需数小时，5折×4策略=20次训练，计算成本太高

② 竞赛提供了独立测试集（问题三的18例），相当于外部验证

③ 竞赛场景追求效率，Holdout + 充分验证已经能满足需求



局限：Holdout的验证集采样偏差可能影响结论，20例上±0.1的标准差仍有一定不确定性。如果未来有更多资源，5折交叉验证可以提供更稳健的性能估计。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q09-策略C的验证集20例中排除了HB0014-为什么">

<h2 class="question-title"><span class="q-badge ai100-badge">Q66</span><span class="question-text">策略C的验证集20例中排除了HB0014，为什么？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 训练配置 · 考察点：训练配置</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：HB0014可能因为特定原因不在策略C的评测中（论文提到验证集n=20，排除HB0014，病例相同）。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

HB0014可能因为特定原因不在策略C的评测中（论文提到验证集n=20，排除HB0014，病例相同）。



可能原因：

· 路径或格式不匹配（所有策略统一排除以保证公平对比）

· 该病例可能在预处理阶段被标记为质控异常



关键点：四种策略在"完全相同的20例"上比较——这是公平的。无论HB0014被谁排除，对比口径是一致的。不同策略之间Dice差0.1-0.2的差异不能归因于病例选择的偏差。
</div>
</details>

</div>

---

<div class="chapter-nav">

<a class="chapter-nav-link" href="../">📑 总览</a>

<a class="chapter-nav-link" href="model">← 🏥 模型架构与策略</a>

<a class="chapter-nav-link chapter-nav-next" href="deploy">🏥 假设不足与部署 →</a>

</div>
