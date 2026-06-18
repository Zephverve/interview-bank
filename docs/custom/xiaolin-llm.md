---
custom: true
partTitle: 小林 · 大模型工程面试题
partColor: #6366f1
---

<div class="part-hero custom-hero" style="--part-color: #6366f1">

# 🧠 小林 · 大模型工程面试题

<p class="part-desc">Transformer · 微调 · 推理 · 部署 · 共 20 题</p>
<span class="part-round custom-tag">我的题库</span>

</div>

<div class="custom-hint">

📝 **本分类源文件**：`custom/xiaolin-llm/` · 新增题目后运行 `npm run prepare` 即可刷新。

</div>

<div class="question-card custom-card compact-card" id="cot">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">什么是 CoT？为啥效果好？它有什么缺点或局限性？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：LLM, 小林笔记 · 考察点：什么是 CoT？为啥效果好？它有什么缺点或局限性？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：CoT 我第一次用是在做一个需要多步逻辑推理的任务，发现只要让模型先分步分析，效果提升就很明显</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

CoT 我第一次用是在做多步逻辑推理任务，让模型先分步分析，效果提升就很明显。本质原因是模型 token-by-token 生成，先组织中间步骤等于给了「草稿纸」，后面生成答案时能利用前面的推理上下文，自然出错就少了。

**两种形式：** Few-shot CoT 在 Prompt 里给几个完整推理示例，效果稳定但 Prompt 长；Zero-shot CoT 加一句「让我们一步步思考」，简单但效果略差。

**局限四点：** token 消耗大，推理链额外几百甚至上千 token，成本和延迟都上去；对简单问题适得其反；推理链本身可能出错，错误沿链路累积传导；对纯记忆类任务没帮助。我的经验是多步推理用 CoT，简单问答直接答；对外产品不一定展示完整 CoT，展示简要理由或核查步骤更合适。

**进阶：** Self-Consistency 多次采样多条推理路径再投票，效果更稳但成本更高。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="decoding_strategies">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">大模型生成文本时的解码策略有哪些？贪心、Beam Search、采样分别什么时候用？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：LLM, 小林笔记 · 考察点：大模型生成文本时的解码策略有哪些？贪心、Beam Searc</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：我理解大模型的解码策略本质上是回答一个问题：模型在每一步输出了一个 vocabulary 大小的概率分布，我们怎么从中选下一个 token</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

我理解大模型的解码策略本质上是回答一个问题：模型在每一步输出了一个 vocabulary 大小的概率分布，我们怎么从中选下一个 token？

主流方案分两大类。

第一类是确定性策略，输入相同输出永远相同。

- 贪心解码（Greedy Decoding）：每一步选概率最高的 token。简单、可复现，但容易重复啰嗦、缺乏多样性
- Beam Search：每一步保留 Top-B 条候选路径（B=4、8 等），最后选总概率最高的整条序列。比贪心更接近全局最优，但对生成式任务有「天然缺陷」
第二类是随机性策略，引入随机性让输出有多样性。

- Temperature 采样：通过缩放概率分布的「锐度」，控制随机性强度。Temperature 越低越确定，越高越发散
- Top-K 采样：每步只从概率最高的 K 个 token 里采样，截断长尾
- Top-P（Nucleus）采样：每步累加概率到 P 为止，从这个「核」里采样，自适应截断
这两大类的核心区别是，确定性策略保证质量但牺牲多样性；随机性策略保证多样性但每次输出不同。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="deployment_frameworks">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">大模型部署有哪些主流方案？vLLM、TGI、llama.cpp、SGLang 实际项目里怎么选？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：LLM, 小林笔记 · 考察点：大模型部署有哪些主流方案？vLLM、TGI、llama.cp</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：我理解大模型部署框架的本质问题是：怎么在固定的硬件上跑得更快、更省显存、支持更多并发用户</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

我理解大模型部署框架的本质问题是：怎么在固定的硬件上跑得更快、更省显存、支持更多并发用户？

主流框架按定位分四类。

1. vLLM：当前生产部署里很常见的框架，UC Berkeley 出品。核心创新是 PagedAttention，把 KV Cache 像操作系统虚拟内存一样分页管理，大幅减少碎片，显存利用率能明显提高。配合 Continuous Batching 实现很高的吞吐量，是很多团队部署 LLM API 时会优先评估的方案。

2. SGLang：vLLM 之后的新一代推理框架，LMSYS 出品。核心创新是 RadixAttention，把多请求的共享前缀（如 System Prompt、Few-shot 示例、对话历史）组织成树结构，相同前缀只存一份 KV Cache。在 Agent、多轮对话、批量 Prompt 场景下比 vLLM 显存更省、首 token 延迟更低。

3. TGI（Text Generation Inference）：HuggingFace 出品，与整个 HF 生态深度集成。优点是开箱即用、支持各种 HF Hub 上的模型、企业级 API 接口（鉴权、metrics、健康检查）。但要注意它近两年的增长势头不如 vLLM / SGLang，选它更多是看中 HF 生态和既有系统集成，而不是追求极致性能。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="dpo_vs_ppo">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">大模型的 DPO 和 PPO 的区别是什么？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：LLM, 小林笔记 · 考察点：大模型的 DPO 和 PPO 的区别是什么？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：DPO 和 PPO 都是大模型对齐训练里的方法，都是在 SFT 之后让模型的输出更符合人类期望</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

DPO 和 PPO 都是大模型对齐训练里的方法，都是在 SFT 之后让模型的输出更符合人类期望。

PPO 是强化学习里的一个算法，在大模型里的用法是：先额外训练一个「奖励模型」来给模型的回答打分，然后用 PPO 这个 RL 算法不断调整大模型的参数，让它生成的内容往高分方向走。这套流程需要同时维护好几个模型，工程复杂度高，训练也容易不稳定，所以成本比较大。

DPO 是后来提出的简化方案，它不需要单独训练奖励模型。它直接拿「人类偏好对」数据，就是同一个问题的「好回答」和「差回答」，让模型直接学「应该更像哪个」。更准确地说，DPO 是从带 KL 约束的 RLHF 目标推导出来的一个闭式偏好优化目标，不是说它和任意 PPO 训练过程都完全等价。工程上可以把它理解成把复杂 RL 流程简化成监督学习问题，只需要两个模型，更稳定、更好实现。

简单总结：PPO 是「先训练裁判、再训练选手」，DPO 是「直接拿比赛录像告诉选手哪个动作对哪个动作错」，两者目标一致，但 DPO 省去了裁判这个中间层。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="evaluation_metrics">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">大模型能力评测指标有哪些？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：LLM, 小林笔记 · 考察点：大模型能力评测指标有哪些？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：我对这块的理解是，学术 Benchmark 只能作为参考，真正重要的是在自己业务数据上的表现</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

学术 Benchmark 只能作为参考，真正重要的是在自己业务数据上的表现。

**学术 Benchmark 各测什么：** MMLU / MMLU-Pro 测综合知识，HumanEval / SWE-bench Verified 测代码，GSM8K / MATH / GPQA 测数学和科学推理，MT-Bench / Arena / τ-bench 测对话、偏好和工具调用，LiveBench、Humanity's Last Exam 等更新型评测用来缓解数据污染。看一眼能判断模型能力区间，但不能直接等价成业务效果——预训练数据污染会让 Benchmark 分数虚高。

**业务测试集才是核心。** 从真实用户请求里采样 50-200 条，人工标注期望输出，形成黄金测试集，每次改 Prompt 或换模型都在上面跑一遍。客观任务（分类、抽取、代码）用程序自动验证；主观任务（摘要、问答）用 LLM-as-Judge 评分，人工抽查 10-20% 校准。

**离线 + 线上闭环：** 离线评估帮你快速迭代，线上指标（满意度、任务完成率、会话放弃率）告诉你优化是否真的改善了用户体验。我们项目里就是这套闭环，Benchmark 只作初筛参考。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="finetuning">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">大模型微调的方案有哪些？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：LLM, 小林笔记 · 考察点：大模型微调的方案有哪些？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：我了解微调之后，首先意识到的是：微调不是首选，而是最后手段</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

微调不是首选，而是最后手段。大多数问题先把 Prompt 写好、加 Few-shot，或用 RAG 接外部知识，基本都能解决。真正需要微调的场景：模型需要特定风格持续输出、学会稳定任务格式、或大幅降本用小模型替代大模型。

**两个正交维度：** 「改哪些参数」（全量微调 / LoRA / QLoRA）和「学什么目标」（SFT / DPO）是独立的，可以任意组合。LoRA 是方法、SFT 是目标——可以用 LoRA 做 SFT，也可以用 LoRA 做 DPO。

**方案选型：** LoRA/QLoRA 最常用，只训练一小部分参数，普通 GPU 就能跑；SFT 让模型从续写模式变成指令回答；有偏好对齐需求用 DPO，比 RLHF 简单、效果也不差。个人开发者 QLoRA + SFT，有点资源 LoRA + SFT + DPO，大厂追顶级用全量微调 + RLHF。选方案看资源约束和实际需求，不是看谁排行榜最高。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="kv_cache_prompt_caching">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">KV Cache 是什么？Prompt Caching 的原理是什么？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：LLM, 小林笔记 · 考察点：KV Cache 是什么？Prompt Caching 的原</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：我理解 KV Cache 和 Prompt Caching 是同一个机制在两个时间尺度上的应用</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

KV Cache 和 Prompt Caching 是同一个机制在两个时间尺度上的应用。

**KV Cache——单次推理内优化。** 自回归生成时，每次新 token 都要对前面所有 token 算 attention，从零开始算总计算量 O(N³)。KV Cache 把前面 token 的 K、V 矩阵缓存在 GPU 显存，新 token 只算自己的 Q、K、V 再跟缓存做 attention，降到 O(N²)。没有 KV Cache，自回归生成基本不可行。

**Prompt Caching——跨请求优化。** 两个请求 Prompt 前缀相同（比如同样的 System Prompt），第一个请求算完的 KV Cache 在 API 服务器保留，第二个请求遇到相同前缀直接复用，只算新增部分。

**价值区别：** KV Cache 让自回归生成可行，是推理基本盘；Prompt Caching 降低 API 成本和延迟，是工程 ROI 优化。Claude 缓存读取价可低至普通输入 10%，OpenAI 等平台也有折扣，具体和命中率、前缀长度有关。理解了 KV Cache，Prompt Caching 几乎是自然推论。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="llm_training">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">大模型是怎么训练出来的？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：LLM, 小林笔记 · 考察点：大模型是怎么训练出来的？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：大模型训练我理解是分三个阶段，每个阶段解决不同层次的问题</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

大模型训练我理解是分三个阶段，每个阶段解决不同层次的问题。我用一个类比来记忆：预训练就像一个人从小到大读了海量的书，积累了语言能力和世界知识，训练目标就是「预测下一个词」，简单但威力巨大；SFT 是给这个博学的人做面试培训，让他学会把知识转化成有问有答的对话形式，而不是一直续写文章；对齐阶段是给他做职业素养培训，用 RLHF 或 DPO 让他的回答方式更符合人类偏好、更安全。三个阶段缺一不可，预训练决定能力天花板，SFT 给格式，对齐给价值观，这是目前所有主流大模型训练的基本框架。

预训练是地基，让模型学会语言和世界知识，训练目标是「预测下一个 token」，看起来简单但威力极大。这一步是最贵的，几百到几千张 GPU 训几个月，烧的是真金白银。

SFT 是格式适配，把「续写机器」改造成「对话机器」。数据格式从连续文本变成（指令，期望回答）对，质量比数量重要，几千条精心标注的数据能赢几十万条粗糙数据。

对齐是价值观训练，让模型「好好说话」。经典路线是 RLHF（奖励模型 + PPO），开源社区也大量使用 DPO、ORPO、KTO 这类更容易落地的偏好优化方法。不同模型会把这些方法组合起来用，这一阶段决定模型上线后用户体验好不好。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="lora">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">请讲一下 LoRA 技术，除了减少参数量，它还有哪些优点？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：LLM, 小林笔记 · 考察点：请讲一下 LoRA 技术，除了减少参数量，它还有哪些优点？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：LoRA 我在项目里用过，省参数这个优点大家都知道，但它还有几个很实用的好处</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

LoRA 我在项目里用过，省参数大家都知道，但还有几个容易被低估的实用好处。

**推理零开销：** 训练完 LoRA 的 A、B 小矩阵可以直接合并回原始权重，推理阶段和原始模型一样快。Adapter 每层多过一个小网络，长模型上延迟累积可观。

**部署灵活：** 7B 基础模型约 14GB，每套 LoRA 只有几十 MB，可以同时维护客服、代码、翻译几套 LoRA，按请求类型热切换，不需要每个场景各跑一个完整模型。

**其他优势：** 原始权重全程冻结，灾难性遗忘风险更低，相当于在原有知识旁打补丁；可训练参数少，对学习率不那么敏感；多个 LoRA 还可以加权混合，把指令遵循和代码 LoRA 合并，不用重新训练就能融合两种能力。工业界常见「一个基底 + 多套 LoRA」部署，比每个任务各跑一个全量模型省一个数量级成本。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="mha_mqa_gqa_flash_attention">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">多头注意力（MHA）有哪些局限？MQA、GQA、Flash Attention 怎么解决？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：LLM, 小林笔记 · 考察点：多头注意力（MHA）有哪些局限？MQA、GQA、Flash</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：我理解 MHA 有三个核心痛点</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

我理解 MHA 有三个核心痛点。

第一是「显存爆炸」。推理时每个 head 都要为序列里所有 token 保存自己的 K 和 V 矩阵，这就是 KV Cache。头数越多、序列越长，显存占用越夸张。一个 7B 模型跑 32K 上下文，光 KV Cache 就能吃掉十几 GB。

第二是「访存慢」。Attention 计算里 softmax 那步要把整个 N×N 的注意力矩阵搬来搬去，频繁读写 GPU 显存，瓶颈不在算力而在「内存带宽」。

第三是「N² 复杂度」。注意力分数矩阵是 N×N 的，序列翻倍计算量翻 4 倍，长上下文极其昂贵。

工业界对应了三类优化。MQA 让所有 head 共享一份 K/V，显存压到 1/H，但表达力损失明显。GQA 是折中方案：把 H 个 head 分成 G 组，每组共享一份 K/V，效果接近 MHA 但显存接近 MQA，Llama 2 70B、Llama 3、Qwen 2/3 的不少主力模型都用这个思路。Flash Attention 是另一条思路，不改变 MHA 的结构，而是从计算实现层面把 N×N 的注意力矩阵切成小块、用 GPU 片上缓存做在线 softmax，避免反复读写大矩阵，显存从 O(N²) 降到 O(N)，速度还更快。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="model_selection">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">对比使用过哪些主流大模型？你们项目中最终选用了哪个模型？为什么？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：LLM, 小林笔记 · 考察点：对比使用过哪些主流大模型？你们项目中最终选用了哪个模型？为什</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：在项目选型阶段，我会先把模型分成两类：一类是国内可落地的生产候选，比如 DeepSeek、Qwen、豆包这类模型；另一类是海外能力标杆，比如 GPT-5.5 / o 系列、Claude Sonnet / Opus 系列，用来做能力上限参照</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

在项目选型阶段，我会先把模型分成两类：一类是国内可落地的生产候选，比如 DeepSeek、Qwen、豆包这类模型；另一类是海外能力标杆，比如 GPT-5.5 / o 系列、Claude Sonnet / Opus 系列，用来做能力上限参照。

如果是面向国内企业用户的 Agentic RAG 系统，我倾向于把国内模型作为主链路候选，海外模型只做离线评测或非敏感场景兜底。原因不是海外模型不好，而是企业项目里合规、网络稳定性、成本预算、售后支持这些约束会直接决定方案能不能上线。

最终落地时，我不会死磕一个模型，而是用 Model Routing（模型路由）：格式要求严格、Tool Use 多的节点优先选指令遵循和结构化输出稳定的模型；高频推理、数据清洗、摘要归纳这类节点优先选性价比高的模型；特别难的问题再路由给能力更强但更贵的模型。选模型从来不是看谁跑分最高，而是看谁最契合业务的合规、成本、延迟与能力特征。

接下来讲清主流大模型的定位。国内候选重点看 DeepSeek 的推理和性价比、Qwen 的中文和工具调用、豆包的工程生态和并发能力；海外标杆重点看 GPT-5.5 / o 系列、Claude Sonnet / Opus 系列在复杂推理、代码、长文本上的能力。能讲出每家模型的「特长」而不只是「排名」，会让面试官知道你真的用过对比过。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="moe">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">MoE 混合专家模型是什么？DeepSeek V3、Qwen 为什么用 MoE？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：LLM, 小林笔记 · 考察点：MoE 混合专家模型是什么？DeepSeek V3、Qwen</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：我理解 MoE（Mixture of Experts，混合专家模型）的核心思想是把传统 Transformer 中的 FFN（前馈网络）层替换成 N 个并行的「专家网络」，再加一个 Router 来决定每个 token 进哪个专家</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

我理解 MoE（Mixture of Experts，混合专家模型）的核心思想是把传统 Transformer 中的 FFN（前馈网络）层替换成 N 个并行的「专家网络」，再加一个 Router 来决定每个 token 进哪个专家。

核心设计哲学是「总参数大，但激活参数小」。比如 DeepSeek V3 总参数 671B，但每个 token 推理时只激活 37B（约 1/18）。这样能用「总参数 671B 的知识量」+「激活参数 37B 的推理成本」，达到 Dense 模型做不到的「学得多 + 跑得快」。

具体看 MoE 三个核心组件。

1. 多个专家（Experts）：把 Transformer 每层的 FFN 复制 N 份（典型 N=8、64、256），每份就是一个独立的「专家」，在训练中各自学到不同的「擅长方向」（语言、代码、数学、知识等）

2. Router（路由器）：每个 token 进到 MoE 层时，Router 算一个「专家偏好分数」，决定这个 token 该去哪个专家。最常见的是 Top-K 路由（K=1 或 K=2），DeepSeek V3 是 Top-8 + 1 个共享专家
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="position_encoding">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">大模型的位置编码是干什么用的？sin/cos、RoPE、ALiBi 有什么区别？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：LLM, 小林笔记 · 考察点：大模型的位置编码是干什么用的？sin/cos、RoPE、AL</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：我理解位置编码要解决的问题，本质上是 Self-Attention 的「位置盲」缺陷</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

位置编码解决 Self-Attention 的「位置盲」缺陷。Attention 计算是对称的，「我打你」和「你打我」注意力分数一样，必须显式注入位置信息。

**sin/cos 绝对位置编码（原始 Transformer）：** 给每个位置算固定 sin/cos 值加到 embedding 上。简单、不需训练参数；但绝对位置太死板，训练长度之外（比如训 2K 推 4K）效果断崖。

**RoPE（旋转位置编码）：** 不「加」位置信息，而是「旋转」Q 和 K 向量，位置越靠后旋转角度越大，点积自然带上相对距离信息。长上下文外推强，配合 NTK、YaRN 等技巧可推更长。Llama、Qwen、DeepSeek 等主流模型都用 RoPE。

**ALiBi：** 直接在注意力分数加距离惩罚，离得越远扣分越多。零可学习参数、长上下文外推天然好，但表达力弱于 RoPE。MPT、BLOOM 用过，没成主流。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="post_training">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">SFT 之后还有哪些 Post-Training？RLHF、DPO、GRPO、拒绝采样什么关系？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：LLM, 小林笔记 · 考察点：SFT 之后还有哪些 Post-Training？RLHF、</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：我理解 Post-Training 是个上位概念，指的是 SFT 之后所有继续提升模型质量的训练阶段</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

我理解 Post-Training 是个上位概念，指的是 SFT 之后所有继续提升模型质量的训练阶段。它不是一个单一方法，而是一族方法的总称。

SFT 让模型学会「按指令格式回答」，但 SFT 后的模型还有两个问题没解决。第一，回答可能有害、不符合人类价值观；第二，同一个问题的多种合格回答里，模型不知道哪个更受人类欢迎。这就是 Post-Training 要补的课。

主流的 Post-Training 方法有五大类。

RLHF（Reinforcement Learning from Human Feedback） 是最经典的方案。流程是先用人类对回答的排名训练一个奖励模型，再用 PPO 算法让大模型生成的回答尽量得高分。同时维护一个参考模型用 KL 散度约束，防止主模型「钻空子」。优点是效果上限高，缺点是流程复杂、要同时维护 4 个模型、训练不稳定。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="quantization">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">大模型量化是什么？INT8/INT4/AWQ/GPTQ 怎么选？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：LLM, 小林笔记 · 考察点：大模型量化是什么？INT8/INT4/AWQ/GPTQ 怎么</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：我理解量化（Quantization）的本质是把模型参数从「高精度浮点数」（FP32 或 FP16）映射到「低精度整数」（INT8 或 INT4），用更少的比特表示同样的信息</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

我理解量化（Quantization）的本质是把模型参数从「高精度浮点数」（FP32 或 FP16）映射到「低精度整数」（INT8 或 INT4），用更少的比特表示同样的信息。

核心收益是显存和速度。一个 7B 模型 FP16 占 14GB，INT4 量化后只剩 4GB，显存压到 1/3.5；同时 INT4 计算比 FP16 快、访存压力也小，推理速度提升 2-4 倍。

主流量化方案分两个维度。

精度维度：FP16 -> INT8 -> INT4 -> 更激进的 NF4 / FP8 等。位数越少越省，但精度损失越大。INT4 是当前的甜蜜点，效果接近 FP16，体积只有 1/4。

算法维度：
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="scaling_law_emergence">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">什么是 Scaling Law？大模型的「涌现能力」是怎么回事？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：LLM, 小林笔记 · 考察点：什么是 Scaling Law？大模型的「涌现能力」是怎么回</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：我理解 Scaling Law（缩放定律）讲的是大模型的损失值如何随模型规模、训练数据量、训练算力这三个量变化的可预测关系</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

我理解 Scaling Law（缩放定律）讲的是大模型的损失值如何随模型规模、训练数据量、训练算力这三个量变化的可预测关系。OpenAI 在 2020 年提出，DeepMind 在 2022 年的 Chinchilla 论文里精修。

核心发现是三个。

第一，损失值随这三个量按幂律下降（loss ∝ N^-α，N 是规模）。意思是规模翻倍，损失值按可预测的比例下降，没有「饱和点」。

第二，参数和数据要按一定比例配。Chinchilla 给的最优比例是 1:20（每个参数配 20 tokens）。GPT-3 175B 用 300B tokens 是「严重欠训」，比例只有 1:1.7；DeepMind 训了一个 70B 模型配 1.4T tokens（1:20），反而超过了 GPT-3 和自家更大的 280B Gopher。

第三，Llama 3 这类后续模型用了远高于 1:20 的训练 token，效果继续提升。更准确地说，Chinchilla 的 1:20 是「固定训练算力下的 compute-optimal 配比」，不是「数据再多就一定没用」的上限。后来的小模型大量喂数据，很多时候是在用更多训练计算换更低的推理成本。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="temperature_top_p_top_k">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">大模型的参数：温度值、Top-P、Top-K 分别是什么？各个场景下的最佳设置是什么？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：LLM, 小林笔记 · 考察点：大模型的参数：温度值、Top-P、Top-K 分别是什么？各</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：我调这几个参数的经验是，Temperature 是最关键的，另外两个基本不用动</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

我调这几个参数的经验是，Temperature 是最关键的，另外两个基本不用动。

Temperature 控制输出的随机性，越低越稳定可复现，越高越发散有创意；Top-P 是从累积概率达到 P 的候选词里采样，比 Top-K 更灵活自适应；Top-K 是固定从概率最高的 K 个词里选。

实践下来，代码生成或者精确问答我会把 Temperature 调到 0~0.2，创意写作调到 0.8~1.2，日常对话 0.5~0.7 就够了。Top-P 和 Top-K 保持默认就好，同时调多个参数反而互相干扰。

讲作用维度时可以这样组织：Temperature 控制「分布的松紧」（缩放概率分布的尖锐度），Top-K 是「固定截断」（只保留前 K 个词），Top-P 是「自适应截断」（按累积概率截断到 P）。三者从不同维度控制采样的随机性。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="tokenizer">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">什么是大模型项目的分词器？原理是什么？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：LLM, 小林笔记 · 考察点：什么是大模型项目的分词器？原理是什么？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：我觉得面试被问到 Tokenizer，最重要的是先说清楚「为什么需要它」，模型只能处理整数，不认识字符串，Tokenizer 就是把文字转成数字 ID 序列的桥梁</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

模型只能处理整数，Tokenizer 就是把文字转成数字 ID 序列的桥梁。

**为什么用子词分词：** 字符级太碎（序列长、语义少），词级 OOV 严重、词汇表爆炸，BPE 取中间折中——控制词汇表大小又能处理新词。常见实现还有 SentencePiece / Unigram、WordPiece。

**BPE 原理三步：** 初始化基础词汇表 → 反复合并最高频相邻 pair → 直到词汇表达到预设大小。比如 `lowest123` 被切成 low + est + 1 + 2 + 3，没有 OOV。

**工程影响：** API 按 token 计费不是按字数，1000 汉字大约 1000-1500 tokens，具体比例和模型 tokenizer 强相关。估算成本、管理上下文窗口、避免截断，都要用真实 tokenizer 来算，不能凭感觉估。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="transformer_architecture">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">讲讲 Transformer 架构基本原理？Encoder 和 Decoder 是什么？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：LLM, 小林笔记 · 考察点：讲讲 Transformer 架构基本原理？Encoder</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：我理解 Transformer 最核心的创新是 Self-Attention，让每个 token 都能直接和序列里任意其他位置建立联系，一次性并行计算，彻底解决了 RNN 顺序计算慢、长距离信息衰减的两个老问题</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

Transformer 最核心的创新是 Self-Attention：每个 token 通过 Q、K、V 三个线性投影，用 Q 和所有 K 做点积算注意力分数，按分数加权聚合 V。除以 √d_k 防止点积过大让 softmax 变 one-hot 导致梯度消失。一次性并行计算，解决了 RNN 顺序计算慢、长距离梯度消失两个老问题。

**Encoder vs Decoder：** Encoder 双向，每个词能同时看前后文，适合理解类任务（BERT）；Decoder 单向，只能看前面的词，适合生成类任务（GPT）。现代大模型（GPT、Claude、Qwen）都选 Decoder-only，因为「预测下一个 token」训练目标极其统一，可以直接在海量无标注文本上做自监督学习，规模越大涌现能力越强。

**补充一点：** FFN 层储存了大量事实知识，可以理解为模型的「记忆仓库」。目标统一 + 数据规模 + 涌现，这三者组合让 Decoder-only 在大模型时代完胜。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="what_is_llm">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">什么是大语言模型？和传统 NLP 模型有什么区别？</span></h2>

<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：LLM, 小林笔记 · 考察点：什么是大语言模型？和传统 NLP 模型有什么区别？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：我理解大语言模型的本质，是一个用海量语料预训练、参数到百亿千亿规模、自回归生成文本的统一模型</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与适用场景</div>
</div>

我理解大语言模型的本质，是一个用海量语料预训练、参数到百亿千亿规模、自回归生成文本的统一模型。

它和传统 NLP 模型最根本的区别有三点。

第一，传统 NLP 是「一任务一模型」，分词、命名实体识别、情感分析、问答各训各的，每个模型只会干自己那点事；LLM 是「一个模型干所有事」，因为它在预训练阶段学的是「预测下一个 token」这件最通用的事，下游任务用 Prompt 表达就行，不用再分别训练。

第二，传统 NLP 模型是判别式的，吃一段文本输出一个标签或概率；LLM 是生成式的，吃一段文本输出更多文本，理解和生成在同一个模型里完成。

第三，也是最神奇的一点，规模到了一定程度，LLM 会「涌现」出训练目标里没有显式教过的能力，比如多步推理、上下文学习、跨语言迁移，这种「量变到质变」的现象在传统 NLP 模型上是看不到的。
</div>
</details>

</div>
