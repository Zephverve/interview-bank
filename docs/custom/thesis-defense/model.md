---
custom: true
partTitle: 答辩问题 · 食管癌 GTV · 模型架构与策略
partColor: #0d9488
---

<div class="part-hero custom-hero chapter-hero" style="--part-color: #0d9488">

# 🏥 模型架构与策略

<p class="part-desc">答辩问题 · 食管癌 GTV · 第 5/9 章 · 16 题</p>
<span class="part-round custom-tag">面试问答</span>

</div>

<div class="chapter-nav">

<a class="chapter-nav-link" href="../">📑 总览</a>

<a class="chapter-nav-link" href="dl-basics">← 🏥 深度学习基础</a>

<a class="chapter-nav-link chapter-nav-next" href="metrics">🏥 评价指标与训练 →</a>

</div>

<div class="question-card ai100-card interview-card compact-card" id="q01-SPADE是什么-它怎么-融合-解剖先验">

<h2 class="question-title"><span class="q-badge ai100-badge">Q42</span><span class="question-text">SPADE是什么？它怎么"融合"解剖先验？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, SPADE · 考察点：SPADE</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：SPADE = Spatially-Adaptive Normalization（空间自适应归一化）。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

SPADE = Spatially-Adaptive Normalization（空间自适应归一化）。



普通BatchNorm的工作方式：每通道统一做标准化，再乘γ加β——γ和β是固定参数，所有位置一视同仁。



SPADE的不同：γ和β不是固定的，而是根据输入的"条件图"（解剖先验图），为每个空间位置(x,y,z)生成不同的γ(x,y,z)和β(x,y,z)。公式：

SPADE(F|c) = InstanceNorm(F) ⊙ (1 + γ(c)) + β(c)



条件图c包含：Z轴位置 + 中心线距离 + 边界距离（三通道）。



效果：网络知道"这里是胸上段，紧邻气管，要加强气管-食管边界的特征"；"这里离中心线很远，已到肺野，降低关注度"。



类比：BatchNorm是全屋中央空调（统一温度），SPADE是给每个座位装了独立出风口，根据座位位置（靠窗、中间、门口）自动调节温度。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q02-为什么SPADE要配置在网络多个位置-而不只在输入端">

<h2 class="question-title"><span class="q-badge ai100-badge">Q43</span><span class="question-text">为什么SPADE要配置在网络多个位置，而不只在输入端？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, SPADE · 考察点：SPADE</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：条件信息如果在输入端简单拼接，经过多层卷积和下采样后，位置信号会被逐步"稀释"——到网络深处时，模型可能已经"忘记"了这个像素在哪。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

条件信息如果在输入端简单拼接，经过多层卷积和下采样后，位置信号会被逐步"稀释"——到网络深处时，模型可能已经"忘记"了这个像素在哪。



SPADE的配置策略：编码器首层 + 三个下采样层 + 瓶颈层 + 三个解码器上采样层 = 约9-10个SPADE块。



每一层SPADE都在该层的特征空间里"重申"一遍空间位置——从浅层纹理到深层语义，全程受解剖先验约束。



类比：给人指路不是只在起点说一句"往北走"，而是在每个路口都提醒一次"继续往北"。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q03-MoE是什么-为什么在这篇论文中用MoE而不是三个独立模型">

<h2 class="question-title"><span class="q-badge ai100-badge">Q44</span><span class="question-text">MoE是什么？为什么在这篇论文中用MoE而不是三个独立模型？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, MoE · 考察点：MoE</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：MoE（Mixture of Experts，混合专家）：</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

MoE（Mixture of Experts，混合专家）：

· 共享编码器 → 105例全部用于学习通用食管癌特征

· 三个专家解码器（高位/中位/低位）→ 各自学习对应解剖段的专属分割模式

· 门控网络（Gate）→ 根据深层特征，自动判断：U专家权重w₁=0.05, M专家权重w₂=0.70, L专家权重w₃=0.25

· 最终输出 = w₁×Output_U + w₂×Output_M + w₃×Output_L



相比三个独立模型：

① 共享参数：编码器只用一套，参数量减少约1/3

② 防止过拟合：颈段7例不足以训练一个完整nnU-Net，但足够让高位专家"微调"其解码特征

③ 软路由：跨段病例（如胸中段胸下段）可以被中位和低位专家共同处理，而不是硬性"归队"



类比：三位专科医生共用一套CT设备（共享编码器），但各人有自己的阅片思路（独立解码器）。遇到疑难杂症时还可以会诊（多专家融合）。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q04-门控网络-Gate-的具体结构是怎样的">

<h2 class="question-title"><span class="q-badge ai100-badge">Q45</span><span class="question-text">门控网络（Gate）的具体结构是怎样的？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, MoE · 考察点：MoE</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Gate位于共享编码器瓶颈层之后：</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

Gate位于共享编码器瓶颈层之后：



① 瓶颈特征图（尺寸如8×16×16×256）→ 全局平均池化 → 256维特征向量

② 全连接层（256→64）→ ReLU → 全连接层（64→3）→ Softmax

③ 输出三个权重：(w_U, w_M, w_L)，三者之和=1



Gate的训练目标（L_cls）：让Gate学会从深层特征中判断当前病例属于哪个解剖区域。

与策略B的随机森林Router相比，Gate的优势在于：它能"看到"CT图像内容（纹理、形态、器官关系），而非仅依赖几个几何数字——所以路由更准确。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q05-为什么MoE的三个专家对应的是临床归并的三类-而不是GMM的三簇">

<h2 class="question-title"><span class="q-badge ai100-badge">Q46</span><span class="question-text">为什么MoE的三个专家对应的是临床归并的三类，而不是GMM的三簇？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, MoE · 考察点：MoE</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：这是一个设计选择：</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

这是一个设计选择：



GMM三簇是基于"体积-跨度-质心Z"统计特征的聚类 → 反映数据驱动分组

临床归并三类是基于解剖位置的合并 → 反映医学知识分组



论文倾向于临床归并作为专家划分依据，原因是：

① 临床归并有明确的医学解释（高位=颈段+胸上段+交叉段），容易与医生沟通

② GMM聚类是"无监督"的——不同数据批次可能产生略微不同的聚类结果，而临床分类是稳定不变的

③ GMM的聚类结果主要作为"参考信息"通过解剖先验图注入网络，而非直接用作路由标签



在实践中两者是互补关系：GMM验证了"三分"的合理性 → 临床归并实现了"三分" → 解剖先验图承载了GMM的发现。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q06-策略A为什么表现最差-根本原因是什么">

<h2 class="question-title"><span class="q-badge ai100-badge">Q47</span><span class="question-text">策略A为什么表现最差？根本原因是什么？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 四种策略对比 · 考察点：四种策略对比</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：策略A：为三个解剖簇分别训练独立的nnU-Net → 推理时直接调用对应模型。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

策略A：为三个解剖簇分别训练独立的nnU-Net → 推理时直接调用对应模型。



验证集结果：Dice 0.540（最低）· Precision 0.485（最低）· RVD +0.46（体积偏大46%）



根本原因有三：

① 分簇后样本过少：高位簇仅7-15例训练3D nnU-Net几乎不可能不严重过拟合

② 无知识共享：三个模型完全独立，从零开始学习底层特征，大量数据资源浪费

③ 硬路由无兜底：推理完全依赖已知分型标签——但对测试集来说分型也是未知的！



策略A的Dice标准差0.047看起来不大，但这是"稳定地差"——所有病例都在0.50左右徘徊。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q07-策略B的Recall高达0-787-为什么反而是个大问题">

<h2 class="question-title"><span class="q-badge ai100-badge">Q48</span><span class="question-text">策略B的Recall高达0.787，为什么反而是个大问题？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 四种策略对比 · 考察点：四种策略对比</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：策略B是"先分型（Router）→ 再调用对应专家分割"——本质上是一个串行级联系统。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

策略B是"先分型（Router）→ 再调用对应专家分割"——本质上是一个串行级联系统。



为什么Recall高但Precision低（0.462，四策略最低）？



原因：Router准确率仅约40%，路由错误时调用了不匹配的专家——该专家在自己的训练区域没见过这种位置的肿瘤，倾向于"不确定的地方全画上" → 大面积过分割。



证据：

· RVD = +0.86 → 预测体积接近真实的2倍

· HD95 = 45.02mm → 几乎把附近器官也画进去了

· Dice标准差0.125 → 不同病例之间悬殊（有的还行，有的极差）



这就像医生"宁可多画不能漏画" → Recall高但毫无临床意义，因为过大的靶区会让患者承受不必要辐射。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q08-策略C具体好在哪里-逐指标分析一下">

<h2 class="question-title"><span class="q-badge ai100-badge">Q49</span><span class="question-text">策略C具体好在哪里？逐指标分析一下。</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 四种策略对比 · 考察点：四种策略对比</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：策略C的验证集全指标（均值±标准差）：</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

策略C的验证集全指标（均值±标准差）：



Dice: 0.714±0.082 → 区域重叠度，四策略最高

IoU: 0.561±0.095 → 更严格的重叠，四策略最高

Precision: 0.647±0.110 → 过分割控制，仅次于D（但D的Recall很差）

Recall: 0.814 → 金标准覆盖率，最高

R_over: 0.353 → 误检比例，低于A/B

R_under: 0.186 → 漏检比例，四策略最低（最少漏画！）

RVD: +0.293 → 体积偏大约29%，在可接受范围

HD95: 27.41mm → 边界最坏误差，最优

ASD: 6.16mm → 平均边界误差，最优



C的核心竞争力：在所有指标上都相对最优，且标准差小（稳定性高），尤其在"不遗漏（Recall最高/漏勾比最低）"和"不误画（Precision高/过勾比低）"之间取得了最佳平衡。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q09-策略D和策略C的核心区别是什么-为什么D不如C">

<h2 class="question-title"><span class="q-badge ai100-badge">Q50</span><span class="question-text">策略D和策略C的核心区别是什么？为什么D不如C？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 四种策略对比 · 考察点：四种策略对比</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：策略D也用了全局+专家的集成思路，但与C有本质差异：</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

策略D也用了全局+专家的集成思路，但与C有本质差异：



策略D：5套独立nnU-Net（1全局+3专家+Router）→ 随机森林Router（仅看几何特征）→ 固定融合权重 → 工程复杂

策略C：1套共享网络（共享Encoder+3Expert Decoder+SPADE+Gate）→ Gate自动路由（看CT内容）→ 可学习融合权重 → 端到端



为什么D不如C：

① D的Router准确率仅38% → Gate从深层特征学习，路由更准

② D的融合权重固定（0.35/0.65或0.55/0.45）→ C的MoE权重是学习出来的，可自适应

③ D训练5套模型 → 工程成本高，参数冗余大 → C只有1套共享编码器，参数效率远高于D

④ 结论：D在思路上有兜底机制，确实比A/B好，但"笨重"的设计拖了后腿。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q10-如果Router准确率提升到80-策略B能否超越策略C">

<h2 class="question-title"><span class="q-badge ai100-badge">Q51</span><span class="question-text">如果Router准确率提升到80%，策略B能否超越策略C？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 四种策略对比 · 考察点：四种策略对比</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：不能。论文的补充实验表明：即使使用金标准分型路由（Router 100%正确），B的Dice也仅约0.63，仍低于C的0.714。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

不能。论文的补充实验表明：即使使用金标准分型路由（Router 100%正确），B的Dice也仅约0.63，仍低于C的0.714。



根本原因不在于"路由不准"，而在于架构本身：

B是"硬路由 + 单专家输出"——即使Router完美，一个跨段病例被分配给"胸中段专家"，该专家无法完美处理病灶的"胸下段部分"。



C是"软路由 + 三专家融合"——同一个病例，三个专家一起参与预测，Gate自动给胸中段专家权重0.6、胸下段专家0.4——实现平滑过渡。



所以B的效率天花板就是单专家上线，而C的MoE可以突破这个天花板。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q11-为什么要设计组合损失函数-而不是用单一Dice-Loss">

<h2 class="question-title"><span class="q-badge ai100-badge">Q52</span><span class="question-text">为什么要设计组合损失函数，而不是用单一Dice Loss？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 损失函数与训练策略 · 考察点：损失函数与训练策略</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：损失函数 = 模型的"评分标准"——网络不知道什么是"好分割"，它只会沿损失减小的方向调整参数。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

损失函数 = 模型的"评分标准"——网络不知道什么是"好分割"，它只会沿损失减小的方向调整参数。



只用Dice Loss：对类别不平衡鲁棒（医学图像肿瘤占比极小），但不稳定——当预测和真实完全不重叠时，Dice=0，梯度为零，模型"卡住"。



只用CE Loss：梯度稳定、逐体素优化细致，但会被大量背景体素"淹没"——模型学会"全预测为背景"也能拿到不错的Loss。



论文的组合：CE Loss（稳定训练、像素级精细优化）+ Dice Loss（关注重叠区域、应对类别不平衡）。



第二阶段再引入Focal-Tversky：进一步关注困难样本和抑制假阳性——这是"更高阶的评分标准"。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q12-Focal-Tversky-Loss为什么比Dice-Loss更适合这个任务">

<h2 class="question-title"><span class="q-badge ai100-badge">Q53</span><span class="question-text">Focal-Tversky Loss为什么比Dice Loss更适合这个任务？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 损失函数与训练策略 · 考察点：损失函数与训练策略</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Tversky指数改进了Dice：可以独立调节FP和FN的惩罚力度。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

Tversky指数改进了Dice：可以独立调节FP和FN的惩罚力度。

Tversky = TP / (TP + α·FN + β·FP)



论文设置：α=0.25（FN惩罚小，允许少量漏检）· β=0.75（FP惩罚大，强烈抑制过分割）



医学含义：在食管癌放疗中，过勾（把正常组织照了）的临床风险通常大于少量漏勾（可通过PTV扩展补充）。所以β=0.75>>α=0.25的设定是有明确临床导向的。



Focal-Tversky额外增加了焦点指数γ=0.75：Focal-Tversky = (1-Tversky)^γ

作用：容易分的区域Loss已经小→指数进一步缩小；难分的边界→Loss保持→模型更多聚焦于困难区域。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q13-损失函数三部分的权重-1-0-0-2-0-15-是怎么来的">

<h2 class="question-title"><span class="q-badge ai100-badge">Q54</span><span class="question-text">损失函数三部分的权重（1.0, 0.2, 0.15）是怎么来的？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 损失函数与训练策略 · 考察点：损失函数与训练策略</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：总Loss = L_fused + 0.2·L_cls + 0.15·L_expert</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

总Loss = L_fused + 0.2·L_cls + 0.15·L_expert



L_fused（权重1.0）：对最终MoE融合输出的Dice+BCE → 主优化目标，权重最重

L_cls（权重0.2）：对Gate分类的交叉熵 → 辅助任务，帮Gate学会正确路由。权重低是为了防止"Gate太关注分类而忘了分割"

L_expert（权重0.15）：对各专家单独输出的Dice+BCE → 确保每个专家确实具备其专属区域的分割能力，而非"偷懒"全靠融合



这些权重基于经验设定，不是通过网格搜索得到的（3D分割的网格搜索计算成本太高）。核心设计逻辑：主目标主导（1.0），辅助目标只起"引导"而非"主导"作用（0.2和0.15）。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q14-什么是两阶段微调-为什么不全部一起训练">

<h2 class="question-title"><span class="q-badge ai100-badge">Q55</span><span class="question-text">什么是两阶段微调？为什么不全部一起训练？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 损失函数与训练策略 · 考察点：损失函数与训练策略</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：两阶段微调：</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

两阶段微调：

第一阶段（Dice+BCE）：基于预训练nnU-Net权重，冻结编码器 → 只训练新增的SPADE模块、MoE解码器和Gate。目的是让新模块先"站稳"，再用全部参数一起微调。



第二阶段（Focal-Tversky）：解冻全部参数 → 加入Focal-Tversky Loss精细调优 → 特别抑制假阳性。



为什么不能一上来全部训练？新增模块是随机初始化的，初始梯度会非常大——如果编码器也跟着调整，预训练学到的优秀特征会被"冲散"——这叫灾难性遗忘（Catastrophic Forgetting）。



类比：请经验丰富的医生（预训练编码器）来新医院，同时配备新诊疗系统（新增模块）。不会第一天就要求他按新系统看诊——先让他熟悉新系统（第一阶段），再根据系统优化流程（第二阶段）。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q15-训练用了什么优化器-学习率怎么设置">

<h2 class="question-title"><span class="q-badge ai100-badge">Q56</span><span class="question-text">训练用了什么优化器？学习率怎么设置？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 损失函数与训练策略 · 考察点：损失函数与训练策略</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：nnU-Net默认使用SGD + Nesterov动量（momentum=0.99），配合多项式学习率衰减策略。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

nnU-Net默认使用SGD + Nesterov动量（momentum=0.99），配合多项式学习率衰减策略。



初始学习率：通常为0.01（随batch size线性缩放）

学习率衰减：每个epoch后衰减，最终降至接近0

权重衰减（L2正则化）：3e-5



nnU-Net的优化策略是经过大量实验验证的默认配置，对于小样本医学数据特别稳定。论文的两阶段微调中，第一阶段可能使用更低的学习率（如1e-4），第二阶段学习率更小以精细调优。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q16-有哪些数据增强操作-为什么选这些">

<h2 class="question-title"><span class="q-badge ai100-badge">Q57</span><span class="question-text">有哪些数据增强操作？为什么选这些？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 损失函数与训练策略 · 考察点：损失函数与训练策略</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：训练阶段对每个3D Patch动态应用：</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

训练阶段对每个3D Patch动态应用：



空间增强：Y/X轴随机翻转 + 平面90°随机旋转 → 方向鲁棒性

灰度增强：随机缩放/平移 + 高斯噪声 + Gamma变换 → 模拟不同CT机器差异

Z轴特殊处理：低概率Z轴翻转 + 同步修正Z轴先验图 → 防止学到"头上脚下"的偏见

Patch平移扰动：质心±(4,12,12)体素随机偏移 → 增强位置鲁棒性



验证/测试阶段：不增强 → 保证评估在"真实条件"下进行。
</div>
</details>

</div>

---

<div class="chapter-nav">

<a class="chapter-nav-link" href="../">📑 总览</a>

<a class="chapter-nav-link" href="dl-basics">← 🏥 深度学习基础</a>

<a class="chapter-nav-link chapter-nav-next" href="metrics">🏥 评价指标与训练 →</a>

</div>
