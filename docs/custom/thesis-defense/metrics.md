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

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 核心指标 · 考察点：核心指标</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Dice = 2TP/(2TP+FP+FN)  ·  IoU = TP/(TP+FP+FN)</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

Dice = 2TP/(2TP+FP+FN)  ·  IoU = TP/(TP+FP+FN)



两者的分子相差一倍——Dice给重叠区域赋了2倍权重。

所以Dice数值始终 ≥ IoU（Dice=0.714, IoU=0.561）。



Dice更常用在医学分割中因为：

① 对小目标更敏感（重叠区域在分母占比更大）

② 变化范围更宽，更容易区分不同模型的性能差异

IoU通常作为辅助指标一起报告。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q02-为什么不用Accuracy">

<h2 class="question-title"><span class="q-badge ai100-badge">Q59</span><span class="question-text">为什么不用Accuracy？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 核心指标 · 考察点：核心指标</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：类别极度不平衡：食管癌GTV在胸部CT中通常仅占0.1%~1%的体积。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

类别极度不平衡：食管癌GTV在胸部CT中通常仅占0.1%~1%的体积。



如果模型"偷懒"全部预测为背景，Accuracy = (全部体素-肿瘤体素)/全部体素 ≈ 99%+ ——看起来完美，但毫无用处。



这就是著名的"Accuracy悖论"：在不平衡数据上，高Accuracy ≠ 好模型。

Dice只关心预测区域和真实区域的重叠（对前景加权），天然不受类别不平衡影响。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q03-过勾体积比-漏勾体积比和RVD分别代表什么临床风险">

<h2 class="question-title"><span class="q-badge ai100-badge">Q60</span><span class="question-text">过勾体积比、漏勾体积比和RVD分别代表什么临床风险？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 核心指标 · 考察点：核心指标</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：R_over（过勾体积比 = FP/Pred）：模型的预测中有多少比例是"多画的"。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

R_over（过勾体积比 = FP/Pred）：模型的预测中有多少比例是"多画的"。

→ 临床风险：正常组织被错误纳入靶区 → 辐射副反应增加。论文C的R_over=0.353，即预测中有35.3%是假阳性。



R_under（漏勾体积比 = FN/GT）：真实肿瘤中有多少比例被"漏掉了"。

→ 临床风险：肿瘤区域未被照射 → 局部复发、治疗失败。C的R_under=0.186，漏掉18.6%的真实肿瘤体积。



RVD（相对体积偏差 = (|Pred|-|GT|)/|GT|）：整体偏大还是偏小？

→ RVD=+0.293：预测体积偏大约29%。RVD只看体积不对应位置——可能"体积刚好但位置全错"，必须和Dice等联合判断。



医学上通常更关注R_under（漏勾）> R_over（过勾） > RVD（体积），因为漏勾的后果最严重。
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

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 核心指标 · 考察点：核心指标</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Bootstrap是一种"不依赖正态假设"的统计方法：</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

Bootstrap是一种"不依赖正态假设"的统计方法：



① 从105例数据中，有放回地随机抽取105例（有些可能被抽多次，有些没被抽到）

② 计算这个"重采样数据集"的体积中位数

③ 重复2000次 → 得到2000个中位数的分布

④ 取2.5%和97.5%分位数作为95%置信区间



为什么不用正态置信区间？GTV体积分布高度右偏（均值43216 > 中位数32805，标准差36866接近均值），不服从正态分布。传统t检验的正态假设不成立。Bootstrap不需要任何分布假设，特别适合这种偏态小样本医学数据。



2000次采样已经充分稳定——理论上1000次以上Bootstrap分布基本收敛。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q06-Patch-size-32-128-128-是怎么确定的">

<h2 class="question-title"><span class="q-badge ai100-badge">Q63</span><span class="question-text">Patch size (32,128,128) 是怎么确定的？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 训练配置 · 考察点：训练配置</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Z=32层：在2.5mm层厚下覆盖约8cm → 大多数GTV纵向跨度2-12cm，32层能覆盖大部分，GPU显存也可接受</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

Z=32层：在2.5mm层厚下覆盖约8cm → 大多数GTV纵向跨度2-12cm，32层能覆盖大部分，GPU显存也可接受

Y/X=128×128：在1.0mm面内间距下覆盖12.8cm×12.8cm → 足够包含肿瘤 + 食管周围上下文 + 一定范围肺组织



这个尺寸是"信息完整性"和"计算可行性"的平衡：

· 太小（如16,64,64）→ 看不到完整的纵向结构

· 太大（如64,256,256）→ GPU显存爆掉

· 32×128×128在典型GPU（16GB显存）上batch_size=2-4可以稳定训练



滑窗重叠50%：确保相邻patch之间的过渡平滑，减少窗口边界的预测不连续。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q07-后处理为什么选τ-0-95而不是常规的0-5">

<h2 class="question-title"><span class="q-badge ai100-badge">Q64</span><span class="question-text">后处理为什么选τ=0.95而不是常规的0.5？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 训练配置 · 考察点：训练配置</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：传统二值化用0.5（概率≥50%就是肿瘤），但论文的消融实验发现0.95更优：</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

传统二值化用0.5（概率≥50%就是肿瘤），但论文的消融实验发现0.95更优：



τ从0.5→0.90→0.95：

· Precision: 0.476 → 0.647（大幅↑）

· RVD: +0.983 → +0.293（过分割显著抑制）

· Dice: 0.604 → 0.714（↑）

· Recall: 0.871 → 0.814（↓有所牺牲但可控）



原因：食管癌GTV的边界非常模糊（肿瘤与正常软组织HU值相近），模型在真实边界附近的预测置信度通常在0.5-0.9之间。低阈值会把这些"不确定区"全判为肿瘤→严重过分割。0.95只保留模型"非常有信心"的区域→虚假预测大幅减少。



这是一个"用少量Recall换大幅Precision提升"的有意识权衡，在放疗中值得做。
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
