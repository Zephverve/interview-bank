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

**结论句（15 秒）**：RAG 检索方案争议：跑 120 问黄金集消融对比纯向量 vs 混合检索，用数据说服，同时回应稳定性担忧。

**追问方向**：理论更优但没时间实现怎么办？ · 有没有 Agent 项目的协作例子？

### 回答

"在科研问答项目里遇到过。当时我在设计检索方案，我倾向于 BM25 + 向量混合检索——因为课题组提问里专业术语很多，纯向量在长尾词上召回很差。但同组同学觉得应该先用纯向量把链路跑通，理由是'混合检索会增加索引复杂度和调试成本，MVP 阶段不值得'。

我没有直接否定，而是做了两件事。第一，用 120 问黄金集跑消融：纯向量 Recall@5 只有 0.51，加 BM25 后跳到 0.63 左右，长尾术语类问题改善最明显。第二，我分析了为什么混合在这里有效——向量负责语义泛化，BM25 负责精确命中术语，两者互补而不是重复。

最终大家接受了混合检索方案。我也听了对方关于复杂度的担忧，所以第一版 BM25 用轻量实现、索引和向量分开维护，后面再统一优化。这个经历让我学到：技术争论最好的解决方式不是'谁说得对'，而是'用实验结果说话，同时认真对待对方的担忧'。"

**追问**：如果对方的方案在理论上更优但你时间不够实现，你会怎么办？

"我会分两步。第一步，承认对方方案在理论上的优势，这在技术上是对的。第二步，评估投入产出比——跟对方聊清楚：你的方案理论上能提升多少？实现需要多少时间？然后提出一个折中方案，比如先在当前版本上线，把更优方案作为下个迭代的目标。关键是要让对方知道你没有否定他的想法，只是优先级排序的问题。"

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

"我分四步走。

第一步，**先搞清 what 而不是 how**。我不会一上来就开始写代码或者读论文。我会跟 leader 对齐：这个系统服务谁？核心指标是什么？两周后交付到什么程度算及格？有没有可以参考的竞品或内部系统？这一步花半天，但能防止方向跑偏。

第二步，**极速 MVP**。用我已有的技术积累快速搭一个能跑通的基线——FastAPI + LangGraph 编排 + Qdrant + Qwen 模型，最多 2-3 天。这个 MVP 不一定好用，但它让我有了一个可以验证假设的最小系统。

第三步，**识别真正的难点**。MVP 跑起来之后，真正的技术挑战才会暴露——比如实时性的延迟问题、客服话术的领域适配、多轮对话的上下文管理。我会把时间花在解决这些真正的难点上，而不是花在'把系统做得更完整'上。

第四步，**每天同步进度**。两周的短周期项目，最大的风险不是技术难度，而是 leader 不知道你在做什么。我每天下班前给 leader 发一条消息：今天做了什么、遇到了什么困难、明天计划做什么、需要什么协助。三条，三十秒能看完。

这个方法论其实来自我科研项目的教训。读研第一个项目我就是闷头搞了两个月才给导师看，结果方向都不对。后来我就养成了'先出 MVP 再迭代'加'高频同步'的习惯。"
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
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：精力脉冲分配：问答系统为主线、GenericAgent 分析在主线稳定后集中推进；每周一个唯一重点。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：同时被导师和实习追着跑怎么办？ · 哪个项目投入最多？</div>
</div>

"诚实地说，不是所有时间都平等分配的。

科研问答系统是我读研后的主线项目：前期集中搭建，中期优化维护，后期以稳定可用为主。

Agent 框架分析项目通常放在主线项目相对稳定之后再集中推进。多个项目在时间上的确有重叠，但每个阶段的精力分配是清晰的——我习惯一段时间只 focus 一个重点。

这个时间管理习惯其实是被项目节奏逼出来的。如果不主动切分优先级，就会被所有事情同时追着跑。我现在的方法是在每周一列一个'本周唯一重点'，其他事情都围绕它安排。"
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

"我的优先级是转正。选择投大厂实习而不是继续在实验室做研究，本身就是经过思考的。

我读研期间做了两个核心项目——应用工程（科研问答系统）和架构分析（GenericAgent）。做完之后我清楚了自己的倾向：我喜欢把技术落地成实际能用的系统，而不是只在实验室里做 demo。工程训练给我打下了很好的方法论基础，但我更想在大厂的工程环境里成长——真实的用户流量、生产级的系统要求、和不同角色的同事协作，这些是实验室给不了的。

如果转正顺利，我希望在前两年把 Agent 工程能力打磨扎实——不只是会搭 demo，而是能负责一个子系统从设计到上线的全链路。再往后，看团队需要——如果团队要做 Agent 评估体系或者多 Agent 协作，我有兴趣深耕。

我不排除以后回学术界读博的可能性，但那会更偏 Agent 系统设计方向而非纯算法方向。但现在这个阶段，我想先把手弄脏。"
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

"基础还在，但确实不太写 C++ 了。打竞赛那几年主要练的是数据结构和算法的基本功——动态规划、图论、贪心、搜索——这些东西和语言关系不大。

现在转到 Python 做 AI，本质上是效率选择。Python 在 AI 生态里的库太全了——PyTorch、LangGraph、FastAPI——你用 C++ 搭同样的东西开发效率至少慢 3 倍。但 C++ 的训练让我在需要性能优化的时候有信心往下挖——比如你 Top-K 检索如果要在 GPU 上跑，底层就是 CUDA/C++ 的实现，我能理解那层逻辑。

举个例子，我的 RAG 系统里连接池优化省了一部分延迟，背后的原理其实是 TCP 三次握手——这是我在网络课上学到的，和具体用什么语言无关。算法竞赛练的是'看到一个问题，快速想到数据结构和算法解法'这个能力，这个在 AI 领域同样重要——比如设计一个高效的 recall@k 评估脚本，你本质上是做了个 N×M 的相似度矩阵计算和排序，这就是算法功底在发挥作用。"
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

"最大的短板是缺少线上生产环境的经验。

我的项目都是在实验室环境跑的——Qdrant 部署在实验室 NAS 上，FastAPI 单机服务，用户就是课题组几个人。这和真正的线上环境差距很大，我没处理过这些问题：高并发下的 LLM API rate limit 怎么管理？Agent 执行到一半服务宕机了怎么恢复？线上用户的 query 分布和实验数据完全不同怎么办？

但我一直在有意识地补这个短板。FastAPI 加连接池、异步索引重建、P95 延迟优化——这些都是我在实验室环境里尽可能模拟生产场景做的工程优化。我分析 GenericAgent 的代码时，也特别关注了 Mixin 故障转移和指数退避重试这些生产级的容错设计。

如果入职，我最期待的就是接触真实的用户流量和运维场景，把实验室验证过的方案推到线上。我知道前两个月肯定会踩很多坑，但我觉得这恰恰是实习最有价值的部分。"

**追问**：如果你入职后发现团队用的技术栈和你会的完全不同，你怎么办？

"这个我很坦然。我本科学的是传统 CS——数据结构、操作系统、网络，研究生才切入 AI。Qwen2.5、LangGraph、FastAPI 这些全是自学的。技术栈切换对我来说不是障碍，我更看重'为什么用这个技术栈'——是团队的历史原因？是性能要求？还是生态成熟度？搞清楚了这些，上手新工具就是时间问题。"

---
</div>
</details>

</div>
