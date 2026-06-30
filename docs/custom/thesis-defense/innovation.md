---
custom: true
partTitle: 答辩问题 · 食管癌 GTV · 创新点与展望
partColor: #0d9488
---

<div class="part-hero custom-hero chapter-hero" style="--part-color: #0d9488">

# 🏥 创新点与展望

<p class="part-desc">答辩问题 · 食管癌 GTV · 第 8/9 章 · 6 题</p>
<span class="part-round custom-tag">面试问答</span>

</div>

<div class="chapter-nav">

<a class="chapter-nav-link" href="/custom/thesis-defense/">📑 总览</a>

<a class="chapter-nav-link" href="/custom/thesis-defense/deploy">← 🏥 假设不足与部署</a>

<a class="chapter-nav-link chapter-nav-next" href="/custom/thesis-defense/supplement">🏥 补充问题 →</a>

</div>

<div class="question-card ai100-card interview-card compact-card" id="q01-论文最大的创新点是什么-请逐项说明价值">

<h2 class="question-title"><span class="q-badge ai100-badge">Q72</span><span class="question-text">论文最大的创新点是什么？请逐项说明价值。</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 创新点 · 考察点：创新点</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：三个层次创新，形成闭环：</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

三个层次创新，形成闭环：



创新① GMM数据驱动聚类代替直接使用临床六分型

· 价值：不盲从现有分类体系，从数据中发现更自然的分组结构

· 可推广性：任何"有人工分类但数据可能有更优分组"的场景均可借鉴



创新② SPADE在多层网络中注入解剖先验

· 价值：跳出"输入端堆叠条件"的常规做法，实现条件"全程参与"特征调制

· 可推广性：适用于"有条件信息对任务有帮助"的所有场景（年龄/性别/基因分型等）



创新③ MoE实现统一模型和分型模型的最优折中

· 价值：解决"统一忽略差异 vs 分离样本不足"这对核心矛盾

· 可推广性：适用于所有"需同时处理整体共性和局部差异"的分类/分割任务



三者不是孤立的：GMM提供分型依据 → SPADE注入解剖信息 → MoE实现专家协作 → 完整闭环。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q02-如果样本增加十倍-1000例-模型怎么改进">

<h2 class="question-title"><span class="q-badge ai100-badge">Q73</span><span class="question-text">如果样本增加十倍（1000例+），模型怎么改进？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 未来展望 · 考察点：未来展望</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：105→1000例，很多当前约束都会放宽：</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

105→1000例，很多当前约束都会放宽：



架构：引入Transformer/Hybrid（SwinUNETR等） → 发挥注意力机制的全局优势

先验：加入真实食管中心线分割和OAR自动分割结果作为额外先验通道

分型：可回到更细的分型（五类或六类），MoE专家数可适度增加

预训练：利用大量无标注CT做自监督预训练 → 再用标注数据微调

不确定性估计：输出"置信度热力图"→ 帮助医生判断哪些区域需要复核



核心框架（GMM→先验→SPADE→MoE）的设计思想在大数据下仍然有价值，只是可以做得更精细。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q03-这个框架能否迁移到其他肿瘤类型">

<h2 class="question-title"><span class="q-badge ai100-badge">Q74</span><span class="question-text">这个框架能否迁移到其他肿瘤类型？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 未来展望 · 考察点：未来展望</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：可以，而且是论文方法的通用性体现：</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

可以，而且是论文方法的通用性体现：



肺癌：肺有上叶/中叶/下叶分段 → SPADE+MoE可直接应用，解剖先验需改成肺裂/支气管树信息

肝癌：Couinaud 8段 → MoE可扩展到更多专家，先验需加入门静脉/肝静脉走行

宫颈癌：沿子宫纵轴分布 → 类似食管的分段逻辑



核心迁移要素：

① DICOM→NIfTI预处理流程 → 完全通用

② GMM聚类分析肿瘤分布 → 通用

③ 构建解剖先验图 → 需根据目标器官重新设计

④ SPADE+MoE架构 → 通用，仅需调整专家数量和解剖先验通道数



对任何"沿自然解剖轴分布、不同区段有不同特性"的肿瘤都适用。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q04-做这个题目遇到的最大困难是什么-怎么解决的">

<h2 class="question-title"><span class="q-badge ai100-badge">Q75</span><span class="question-text">做这个题目遇到的最大困难是什么？怎么解决的？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 团队与反思 · 考察点：团队与反思</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：典型困难及解决：</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

典型困难及解决：



困难1：数据格式混乱（DICOM排序反了、ROI命名不统一、RTSTRUCT轮廓退化……）

→ 解决：建立严格的质控流程，双路径栅格化验证，标记需复核病例，排除HB0018



困难2：样本少、六分型不均衡

→ 解决：GMM自动聚类发现三簇天然结构 → 三专家MoE → 共享编码器 + 两阶段微调



困难3：模型过分割严重

→ 解决：Focal-Tversky Loss (β=0.75强抑制FP) + τ=0.95高阈值后处理



困难4：如何将解剖先验有效注入网络

→ 解决：三层解剖先验图 + SPADE多层调制（而非仅输入端拼接）



这些困难本质上都源于"小样本医学AI"——每解决一个，论文质量就提升一个层次。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q05-如果重新做一遍-你会改变什么">

<h2 class="question-title"><span class="q-badge ai100-badge">Q76</span><span class="question-text">如果重新做一遍，你会改变什么？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 团队与反思 · 考察点：团队与反思</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：几点反思性改进：</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

几点反思性改进：



① 加入交叉验证：K折交叉验证能提供更稳健的性能评估

② 做完整的消融实验：逐一去掉SPADE/Gate/解剖先验/Focal-Tversky，量化每个模块贡献

③ 验证多模态数据：如CT+PET-CT融合是否能显著提升分割精度

④ 增加可解释性分析：Grad-CAM可视化 → 证明模型确实在"看"食管区域

⑤ 更精细的解剖先验：尝试用统计形状模型或自动食管分割获取更精确的先验

⑥ 更全面的策略对比：增加策略E（如不同MoE配置、不同SPADE位置等变体）



但竞赛有时间限制，在有限时间内完成从数据到模型的完整链路已属不易。以上更多是"理想情况下的扩展"。
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="q06-你觉得你们论文最大的亮点是什么-如果用一句话向非专业人士介绍">

<h2 class="question-title"><span class="q-badge ai100-badge">Q77</span><span class="question-text">你觉得你们论文最大的亮点是什么？如果用一句话向非专业人士介绍？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：答辩/硕士 · 难度：⭐⭐⭐ · 标签：答辩, 食管癌, GTV分割, 团队与反思 · 考察点：团队与反思</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：学术角度：在105例小样本条件下，用数据驱动的聚类+解剖先验增强+混合专家架构，实现了食管癌GTV自动分割的"统分最优折中"，在不遗漏和不误画之间取得了最佳平衡。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：为什么这样设计？ · 临床意义是什么？ · 有没有消融/验证支撑？</div>
</div>

学术角度：在105例小样本条件下，用数据驱动的聚类+解剖先验增强+混合专家架构，实现了食管癌GTV自动分割的"统分最优折中"，在不遗漏和不误画之间取得了最佳平衡。



通俗一句话：给AI装上了"医生的眼睛"——不是让模型闭着眼从CT灰度里瞎找肿瘤，而是给了它一张人体解剖地图（先验），再让三位不同位置的"专科医生"（专家）一起会诊。
</div>
</details>

</div>

---

<div class="chapter-nav">

<a class="chapter-nav-link" href="/custom/thesis-defense/">📑 总览</a>

<a class="chapter-nav-link" href="/custom/thesis-defense/deploy">← 🏥 假设不足与部署</a>

<a class="chapter-nav-link chapter-nav-next" href="/custom/thesis-defense/supplement">🏥 补充问题 →</a>

</div>
