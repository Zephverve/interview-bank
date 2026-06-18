---
part: 5
partTitle: Part 5 · 行为面
partColor: #ec4899
---

<div class="part-hero" style="--part-color: #ec4899">

# Part 5 · 行为面

<p class="part-desc">STAR · 职业规划 · 反问</p>
<span class="part-round">三面/HR</span>

</div>

<div class="part-intro">

## Q8 · 行为面

**题目**：你的三个项目都是独立完成或课题组项目。有没有遇到过和别人的技术方案冲突的情况？你是怎么处理的？

---

> **轮次**：三面/HR · **难度**：⭐⭐⭐ · **考察点**：技术方案冲突处理

**结论句（15 秒）**：DSTG-Net 融合方式争议：跑消融实验+分析原因，采纳导师稳定性担忧加去相关损失，结果更好。

**追问方向**：理论更优但没时间实现怎么办？ · 有没有 Agent 项目的协作例子？

### 回答

"DSTG-Net 融合方式有过争议：我想用自适应加权，导师倾向简单加性融合，担心参数多导致训练不稳。

我没硬顶，做了两件事：**消融实验**对比三种融合——长期预测自适应加权 MPJPE 低约 8%；**分析原因**——GCN 抓局部拓扑、Transformer 抓全局时序，不同关节/时间步贡献天然不同，固定权重不适应。

导师接受自适应方案；我采纳其稳定性担忧，加**去相关损失**约束双流冗余——同时解决稳定性和效果，方案比最初更好。

教训：技术争论用实验说话，同时认真对待对方担忧，往往得出更优解。"

**追问**：如果对方的方案在理论上更优但你时间不够实现，你会怎么办？

"分两步：承认对方方案理论优势；评估投入产出——能提升多少、实现要多久；提出折中——当前版本先上线，更优方案排下一迭代。关键是让对方知道你在排优先级，不是否定想法。"

---

</div>

---



<div class="question-card compact-card" id="q20">

<h2 class="question-title"><span class="q-badge">Q20</span><span class="question-text">如果 leader 给你一个任务，要求两周内做一个你从来没接触过的东西——比如基于 RAG 的实时客服系统——你会怎么推进？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：三面/HR · 难度：⭐⭐⭐ · 考察点：陌生任务两周交付</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：对齐 what→2-3 天 MVP→识别真难点→每天同步进度四步法。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：MVP 砍到什么程度？ · 需求变更怎么办？</div>
</div>

"四步法：

**对齐 what**：半天跟 leader 对齐服务对象、核心指标、交付及格线、参考竞品——防方向跑偏。**极速 MVP**：2–3 天用 FastAPI + LangGraph + Qdrant + Qwen 搭能跑通的基线，验证假设而非追求完美。**识别真难点**：MVP 跑起来后暴露延迟、领域适配、多轮上下文等瓶颈，时间花在刀刃上。**每天同步**：下班前三条消息——今天做了什么、遇到什么、明天计划——短周期项目最大风险是 leader 不知道进度。

来自科研教训：闷头两月才给导师看，方向全错；后来养成'先 MVP 再迭代 + 高频同步'。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q24">

<h2 class="question-title"><span class="q-badge">Q24</span><span class="question-text">你简历里多个项目的时间线有重叠，你是怎么管理时间和精力的？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：HR/三面 · 难度：⭐⭐ · 考察点：多项目时间线管理</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：精力脉冲分配：DSTG 写论文脉冲式、问答主线、GenericAgent 在论文二审后集中；每周一个唯一重点。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：同时被导师和实习追着跑怎么办？ · 哪个项目投入最多？</div>
</div>

"诚实地说，不是所有时间都平等分配的。

算法研究项目的前期实验和后期写论文、改稿，往往是脉冲式的——审稿意见来了集中改一两周，其他时间在等。

科研问答系统是我读研后的主线项目：前期集中搭建，中期优化维护，后期以稳定可用为主。

Agent 框架分析项目通常放在主线项目相对稳定之后再集中推进。多个项目在时间上的确有重叠，但每个阶段的精力分配是清晰的——我习惯一段时间只 focus 一个重点。

这个时间管理习惯其实是被研究生的节奏逼出来的。导师的课题、自己的项目、论文投稿——如果你不主动切分优先级，就会被所有事情同时追着跑。我现在的方法是在每周一列一个'本周唯一重点'，其他事情都围绕它安排。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q25">

<h2 class="question-title"><span class="q-badge">Q25</span><span class="question-text">实习结束之后，你的规划是什么？想转正吗？还是继续做科研？还是有其他打算？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：HR · 难度：⭐⭐ · 考察点：职业规划与转正意向</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：优先转正；喜欢落地系统而非追 SOTA；前两年打磨 Agent 工程全链路。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：还考虑读博吗？ · 期望团队方向？</div>
</div>

"**优先转正**。投大厂实习而非纯科研，是经过思考的——三个项目做完，我更想把技术落地成可用系统，而非追 SOTA 数字。科研训练给了方法论，但真实流量、生产要求和跨角色协作是实验室给不了的。

转正后前两年打磨 Agent **全链路工程**——不止 demo，能负责子系统设计到上线。再往后看团队需要，Agent 评估或多 Agent 协作有兴趣深耕。不排除以后读博，但偏 Agent 系统设计而非纯算法；现阶段想先把手弄脏。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q18">

<h2 class="question-title"><span class="q-badge">Q18</span><span class="question-text">你参加过算法竞赛，但近期项目主要是 Python。你的 C++ 和算法基础还在吗？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面 · 难度：⭐⭐ · 考察点：算法/C++ 基础是否保留</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：算法竞赛练的是 DS/算法思维，语言无关；Python 是 AI 生态效率选择，性能优化时能理解底层。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：最近写过 C++ 吗？ · 手撕题还练吗？</div>
</div>

"基础还在。竞赛练的是 DS/算法思维，和语言无关——DP、图论、贪心在 AI 里同样用得上，比如 recall@k 评估本质是相似度矩阵+排序。

转 Python 是**效率选择**——PyTorch/LangGraph/FastAPI 生态全，同功能 C++ 开发慢约 3 倍。但 C++ 底子让我在性能优化时有信心往下挖——连接池省延迟背后是 TCP 三次握手，Top-K 检索底层是 CUDA/C++。

算法竞赛给的是'看到问题快速想到解法'的能力，这在 Agent/RAG 系统设计里同样关键。"
</div>
</details>

</div>

---

<div class="question-card compact-card" id="q10">

<h2 class="question-title"><span class="q-badge">Q10</span><span class="question-text">面试官可能会问——「你觉得自己在 Agent 方向最大的短板是什么？」</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：收尾/反问 · 难度：⭐⭐ · 考察点：短板与学习能力</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：短板是缺线上生产经验；已在实验室模拟连接池、延迟优化，关注生产级容错设计。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：技术栈完全不同怎么办？ · 入职前两个月计划？</div>
</div>

"最大短板是**缺线上生产经验**——实验室 NAS + 单机 FastAPI，用户就课题组几人。没处理过高并发 rate limit、Agent 中途宕机恢复、线上 query 分布漂移。

但有意识在补：连接池、异步索引、P95 优化模拟生产；分析 GenericAgent 时关注 Mixin 故障转移和指数退避。入职最期待接触真实流量和运维——前两个月踩坑恰恰是实习最有价值的部分。"

**追问**：如果你入职后发现团队用的技术栈和你会的完全不同，你怎么办？

"很坦然。本科传统 CS，研究生才切 AI——Qwen、LangGraph、FastAPI 全是自学。技术栈切换不是障碍，我更关心**为什么选这个栈**——历史原因、性能要求还是生态成熟度？搞清楚这些，上手新工具是时间问题。"

---
</div>
</details>

</div>
