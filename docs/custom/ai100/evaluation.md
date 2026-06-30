---
custom: true
pageClass: ai100-doc
partTitle: Agent Interview 100 · 评估
partColor: #6366f1
---

<div class="part-hero custom-hero chapter-hero" style="--part-color: #6366f1">

# 📊 评估

<p class="part-desc">Agent Interview 100 · 第 8/11 章 · 9 题</p>
<span class="part-round custom-tag">面试问答</span>

</div>

<div class="chapter-nav">

<a class="chapter-nav-link" href="../">📑 总览</a>

<a class="chapter-nav-link" href="prompt">← ✍️ 提示工程</a>

<a class="chapter-nav-link chapter-nav-next" href="safety">🛡️ 安全对齐 →</a>

</div>

<div class="question-card ai100-card interview-card compact-card" id="069-evaluation-methodology">

<h2 class="question-title"><span class="q-badge ai100-badge">Q66</span><span class="question-text">评估方法论：从 LLM 评估到 Agent 评估</span></h2>

然而，当评估对象从 LLM 升级为 Agent，评估方法论需要根本性扩展。LLM 评估关注**单次输入输出的质量**，而 Agent 评估关注**多步决策轨迹的整体表现**——不仅看最终结果，还要评估推理过程、工具使用、规划质量和错误恢复能力。核心差异在于：Agent 涉及 LLM + 工具 + 环境的交互链，非确定性更强（同一任务可能有多条正确路径），评估维度也从文本质量扩展到任务完成能力、轨迹效率和行为安全。



<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐ · 标签：评估, AI100 · 考察点：Evaluation</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：LLM 评估分为三大类：(1) **自动指标评估**——用算法计算的确定性指标（如 BLEU、ROUGE、精确匹配），速度快、成本低，但只能衡量表面特征；(2) **人工评估**——由人类标注者评判输出质量，是"金标准"但成本高、难以规模化；(3) **LLM-as-Judge**——用强 LLM 评估其他 LLM 的输出，顶级 Judge（GPT-4o / Claude Opus）与人工评估的 **Cohen's Kappa ≈ 0.78-0.84**，逼近人类-人类一致性（κ≈0.80），是近年主流趋势。⚠️ 注意 percent agreement 容易虚高（κ=0.62 也能 >80% 一致率），学术界（"Judging the Judges" arXiv:2406.12624）建议用 Cohen's Kappa 才是 Judge 可靠性的正确指标。生产环境推荐**混合方案**：自动指标做初筛，LLM-as-Judge 做质量评估，人工评估做最终校准。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误区："BLEU/ROUGE 分数高就说明质量好" · 误区："LLM-as-Judge 完全可以替代人工" · 误区："Agent 评估只看最终结果就够了"</div>
</div>

## 详细解析

### 一、LLM 评估方法全景

```
┌──────────────────────────────────────────────────────┐
│                LLM 评估方法全景                       │
├──────────────────────────────────────────────────────┤
│                                                      │
│  自动指标        LLM-as-Judge       人工评估          │
│  ─────────      ──────────────     ─────────         │
│  BLEU/ROUGE     GPT-4 打分         专家评审          │
│  精确匹配       多维度评估          众包标注          │
│  F1 Score       Pairwise 对比      用户反馈          │
│  Perplexity     Rubric 评分        A/B 测试          │
│                                                      │
│  速度: 最快      速度: 中等         速度: 最慢        │
│  成本: 最低      成本: 中等         成本: 最高        │
│  质量: 有限      质量: 较好         质量: 最好        │
│  规模: 无限      规模: 大           规模: 小          │
└──────────────────────────────────────────────────────┘
```

Sebastian Raschka 将 LLM 评估总结为四种方法：多选基准、人类偏好、自动化 LLM 评估、和编程基准。

### 二、自动指标评估

```python
# 常见自动评估指标

# 1. 精确匹配（Exact Match）
def exact_match(prediction, reference):
    return prediction.strip() == reference.strip()
# 适用：数学题答案、事实性问题、代码输出

# 2. BLEU（机器翻译质量）
from nltk.translate.bleu_score import sentence_bleu
score = sentence_bleu([reference.split()], prediction.split())
# 衡量 n-gram 重叠度，0-1 分

# 3. ROUGE（摘要质量，recall-oriented；与 precision-oriented 的 BLEU 互补）
from rouge_score import rouge_scorer
scorer = rouge_scorer.RougeScorer(['rouge1', 'rougeL'])
scores = scorer.score(reference, prediction)
# ROUGE-1: unigram 召回率（reference 中有多少出现在 prediction）
# ROUGE-L: 最长公共子序列（衡量句子级流畅度）
# 对比 BLEU：BLEU 是 precision-oriented（prediction 中有多少匹配 reference）
# 摘要任务用 ROUGE，翻译任务用 BLEU 是因为这两类任务对漏掉信息 vs 多说信息的容忍度不同

# 4. F1 Score（信息提取）
def token_f1(prediction, reference):
    pred_tokens = set(prediction.split())
    ref_tokens = set(reference.split())
    common = pred_tokens & ref_tokens
    precision = len(common) / len(pred_tokens) if pred_tokens else 0
    recall = len(common) / len(ref_tokens) if ref_tokens else 0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) else 0
    return f1

# 自动指标的局限：
# "北京是中国的首都" vs "中国的首都是北京"
# → 语义完全相同，但 BLEU/ROUGE 可能不是满分
# → 无法评估回答的有用性、创造性、安全性
```

### 三、LLM-as-Judge

```python
async def llm_as_judge(question, answer, reference=None):
    """用 LLM 评估回答质量"""

    # 方式 1：直接评分（Pointwise）
    pointwise_prompt = f"""
    请评估以下回答的质量（1-5分）：

    问题：{question}
    回答：{answer}
    {"参考答案：" + reference if reference else ""}

    评分维度：
    - 准确性 (1-5)：事实是否正确？
    - 完整性 (1-5)：是否全面回答了问题？
    - 有用性 (1-5)：对提问者是否有帮助？
    - 清晰度 (1-5)：表达是否清楚？

    请给出每个维度的分数和简要理由，最后给出总分。
    """

    # 方式 2：对比评分（Pairwise）
    pairwise_prompt = f"""
    问题：{question}

    回答 A：{answer_a}
    回答 B：{answer_b}

    哪个回答更好？请从准确性、完整性和清晰度三个维度比较。
    输出：A 更好 / B 更好 / 差不多
    """

    return await judge_llm.invoke(pointwise_prompt)

# LLM-as-Judge 的已知偏差：
biases = {
    "位置偏差": "倾向于给排在前面的回答更高分",
    "冗长偏差": "倾向于给更长的回答更高分",
    "自我偏好": "GPT-4 作为 Judge 倾向于给 GPT-4 的输出更高分",
    "格式偏差": "倾向于给格式更好看的回答更高分",
}

# 缓解偏差：
# - 交换 A/B 位置做两次评估取平均
# - 使用与被评估模型不同的 Judge 模型
# - 提供明确的评分 Rubric
```

### 四、人工评估

```python
human_evaluation_methods = {
    "专家评审": {
        "方法": "领域专家按预定标准打分",
        "优势": "质量最高，能评估专业领域的细微差别",
        "劣势": "成本高，速度慢，难规模化",
        "适用": "高风险场景（医疗、法律、金融）",
    },
    "众包标注": {
        "方法": "通过 Scale AI、Toloka 等平台招募标注者",
        "优势": "可规模化，成本相对可控",
        "劣势": "标注者质量参差不齐，需要质量控制",
        "适用": "大规模偏好数据收集",
    },
    "用户反馈": {
        "方法": "收集真实用户的点赞/点踩/投诉",
        "优势": "最真实的质量信号",
        "劣势": "反馈稀疏（大部分用户不反馈），有偏差",
        "适用": "生产环境的持续监控",
    },
}
```

### 五、混合评估框架（推荐）

```python
class HybridEvaluator:
    """混合评估：自动指标 + LLM Judge + 人工抽检"""

    async def evaluate(self, test_set):
        results = []

        for example in test_set:
            prediction = await self.model.invoke(example.input)
            scores = {}

            # Layer 1: 自动指标（全量，毫秒级）
            scores["exact_match"] = exact_match(prediction, example.reference)
            scores["f1"] = token_f1(prediction, example.reference)

            # Layer 2: LLM-as-Judge（全量或采样，秒级）
            scores["llm_judge"] = await llm_as_judge(
                example.input, prediction, example.reference
            )

            # Layer 3: 标记需要人工审核的案例
            if scores["llm_judge"]["total"] < 3 or scores["f1"] < 0.5:
                scores["needs_human_review"] = True

            results.append(scores)

        # Layer 3 继续：人工审核低分和边界案例
        flagged = [r for r in results if r.get("needs_human_review")]
        # 送人工审核队列...

        return results
```

### 六、评估指标选择指南

```
┌──────────────────┬─────────────────┬──────────────────┐
│ 任务类型         │ 推荐指标        │ 评估方式          │
├──────────────────┼─────────────────┼──────────────────┤
│ 事实性问答       │ 精确匹配/F1     │ 自动             │
│ 文本摘要         │ ROUGE + LLM     │ 自动 + LLM Judge │
│ 翻译             │ BLEU + 人工     │ 自动 + 人工       │
│ 创意写作         │ 人工 + LLM      │ LLM Judge + 人工  │
│ 对话质量         │ LLM 多维评分     │ LLM Judge        │
│ 代码生成         │ Pass@k          │ 自动（运行测试）  │
│ Agent 任务       │ 任务完成率       │ 自动 + 轨迹评估   │
│ 安全性           │ 拒绝率/攻击成功  │ 自动 + 红队测试   │
└──────────────────┴─────────────────┴──────────────────┘
```

### 七、从 LLM 评估到 Agent 评估——核心差异

LLM 评估的三大方法（自动指标、人工评估、LLM-as-Judge）仍然适用于 Agent，但 Agent 的评估需要根本性扩展。

```
LLM 评估：
  输入 → [LLM] → 输出
  评估：输出的质量（准确、流畅、有用）

Agent 评估：
  任务 → [推理] → [工具调用] → [观察] → [推理] → [工具调用] → ... → 结果
  评估维度：
  ├── 最终结果：任务是否完成？
  ├── 推理质量：每步推理是否合理？
  ├── 工具使用：工具选择是否正确？参数是否正确？
  ├── 效率：用了多少步？花了多少 token？
  ├── 错误恢复：遇到错误是否能恢复？
  └── 安全性：是否有越权操作？
```

```
┌──────────────────┬──────────────────┬──────────────────┐
│ 维度             │ LLM 评估         │ Agent 评估       │
├──────────────────┼──────────────────┼──────────────────┤
│ 评估对象         │ 单次生成          │ 多步决策轨迹     │
│ 评估范围         │ 输出文本质量      │ 任务完成 + 过程  │
│ 确定性           │ 较高              │ 低（多路径可行） │
│ 关键指标         │ 准确率、BLEU      │ 任务完成率、效率 │
│ 工具使用         │ 无                │ 核心评估维度     │
│ 安全性           │ 输出安全          │ 行为安全（操作） │
│ 评估复杂度       │ 低                │ 高               │
│ 基准测试         │ MMLU、GSM8K      │ SWE-bench、GAIA │
└──────────────────┴──────────────────┴──────────────────┘
```

ACL 2025 的 Agent 评估综述提出二维分类法：评估"什么能力"（推理、规划、工具使用等） x "用什么方法"（基准测试、人工评估、LLM Judge 等）。

### 八、Agent 评估的四层模型

```python
agent_evaluation_layers = {
    "Layer 1 - 结果评估（What）": {
        "问题": "Agent 是否完成了任务？",
        "指标": ["任务完成率", "答案准确率", "部分完成度"],
        "方法": "自动化检查最终状态",
        "示例": "SWE-bench: 代码修改后测试是否通过",
    },
    "Layer 2 - 轨迹评估（How）": {
        "问题": "Agent 的决策路径是否合理？",
        "指标": ["步骤合理性", "是否有冗余步骤", "是否走了弯路"],
        "方法": "LLM-as-Judge 或人工评估 Trace",
        "示例": "10 步完成 vs 3 步完成，效率差异巨大",
    },
    "Layer 3 - 工具评估（With What）": {
        "问题": "Agent 是否正确使用了工具？",
        "指标": ["工具选择准确率", "参数正确率", "调用次数"],
        "方法": "与最优工具使用序列对比",
        "示例": "搜索 vs 计算——应该用计算器时却去搜索",
    },
    "Layer 4 - 鲁棒性评估（What If）": {
        "问题": "Agent 面对异常情况如何表现？",
        "指标": ["错误恢复率", "幻觉率", "安全违规率"],
        "方法": "注入故障和对抗样本",
        "示例": "工具返回错误时是否能换策略重试",
    },
}
```

### 九、轨迹评估（Trajectory Evaluation）

```python
class TrajectoryEvaluator:
    """评估 Agent 的完整执行轨迹"""

    async def evaluate_trajectory(self, task, trajectory):
        scores = {}

        # 1. 步骤级评估：每一步是否合理
        step_scores = []
        for i, step in enumerate(trajectory.steps):
            step_score = await self.evaluate_step(
                task=task,
                step=step,
                context=trajectory.steps[:i],  # 前序上下文
            )
            step_scores.append(step_score)
        scores["step_quality"] = np.mean(step_scores)

        # 2. 轨迹效率：是否有冗余步骤
        scores["efficiency"] = self.compute_efficiency(
            actual_steps=len(trajectory.steps),
            optimal_steps=self.get_optimal_length(task),
        )

        # 3. 目标达成度
        scores["goal_achieved"] = await self.check_goal(
            task=task,
            final_state=trajectory.final_state,
        )

        # 4. 错误恢复：遇到错误后的处理
        errors = [s for s in trajectory.steps if s.is_error]
        if errors:
            recovery_rate = sum(1 for e in errors if e.was_recovered) / len(errors)
            scores["error_recovery"] = recovery_rate

        return scores

    async def evaluate_step(self, task, step, context):
        """用 LLM 评估单步决策"""
        return await self.judge_llm.invoke(f"""
        任务：{task}
        已执行步骤：{context}
        当前步骤：{step}

        评估这一步是否合理（1-5分）：
        - 是否推进了任务目标？
        - 工具选择是否正确？
        - 参数是否合理？
        """)
```

### 十、主要 Agent 基准测试

```python
agent_benchmarks = {
    "代码 Agent": {
        "SWE-bench": "修复真实 GitHub Issue（Resolved Rate）",
        "HumanEval": "生成函数代码（Pass@k）",
        "MBPP": "Python 编程任务（Pass@k）",
    },
    "Web Agent": {
        "WebArena": "在真实网站完成复杂任务",
        "Mind2Web": "跨网站的通用网页操作",
        "VisualWebArena": "需要视觉理解的网页任务",
    },
    "通用推理 Agent": {
        "ALFWorld": "文本版家庭环境中的任务执行",
        "WebShop": "模拟电商购物任务",
        "GAIA": "通用 AI 助手评估（需要多工具组合）",
    },
    "工具使用 Agent": {
        "ToolBench": "评估 API 工具的选择和使用",
        "API-Bank": "评估 API 调用的正确性",
        "TaskBench": "多工具组合任务",
    },
}
```

### 十一、生产环境 Agent 评估框架

```python
class ProductionAgentEvaluator:
    """生产环境中的 Agent 评估"""

    def __init__(self):
        self.metrics = {
            # 核心指标
            "task_success_rate": "任务完成率",
            "avg_steps": "平均步骤数",
            "avg_latency": "平均延迟",
            "avg_cost": "平均成本",

            # 质量指标
            "trajectory_quality": "轨迹质量（LLM Judge）",
            "tool_accuracy": "工具使用准确率",
            "hallucination_rate": "幻觉率",

            # 安全指标
            "safety_violation_rate": "安全违规率",
            "unauthorized_action_rate": "越权操作率",
        }

    async def run_eval_suite(self, agent, test_cases):
        results = []
        for case in test_cases:
            # 执行并记录完整轨迹
            trajectory = await agent.execute_with_trace(case.task)

            # 多维评估
            eval_result = {
                "task_success": self.check_success(trajectory, case.expected),
                "steps": len(trajectory.steps),
                "cost": trajectory.total_cost,
                "latency": trajectory.total_time,
                "trajectory_score": await self.judge_trajectory(trajectory),
                "tool_accuracy": self.check_tool_usage(trajectory),
                "safety": self.check_safety(trajectory),
            }
            results.append(eval_result)

        return self.aggregate(results)
```

## 常见误区 / 面试追问

1. **误区："BLEU/ROUGE 分数高就说明质量好"** — 这些指标只衡量表面词汇重叠，无法评估语义正确性、逻辑合理性和实用性。两个语义相同但措辞不同的回答可能得到很不同的 BLEU 分数。LLM 时代这些传统指标的参考价值有限。

2. **误区："LLM-as-Judge 完全可以替代人工"** — LLM Judge 有系统性偏差（冗长偏好、位置偏差、自我偏好），且在专业领域（医学、法律）的判断可能不可靠。生产中应该定期用人工评估校准 LLM Judge 的准确性。

3. **误区："Agent 评估只看最终结果就够了"** — 最终结果正确但过程不合理的 Agent 同样有问题——可能走了弯路浪费资源，可能碰巧得到正确结果但推理错误（不可靠），可能使用了不安全的操作。轨迹评估和结果评估同等重要。

4. **误区："用 LLM 基准测试就能评估 Agent"** — LLM 基准（如 MMLU）测试的是知识和推理能力，无法反映 Agent 的工具使用、规划和错误恢复能力。Agent 需要专用基准（如 SWE-bench、WebArena、GAIA）。

5. **追问："如何提高 LLM-as-Judge 的可靠性？"** — (1) 提供详细的评分 Rubric（标准）而非让 Judge 自由打分；(2) 交换位置做两次评估取平均（消除位置偏差）；(3) 用多个 Judge 模型投票；(4) 定期用人工标注校准。

6. **追问："评估数据集从哪里来？"** — 三个来源：(1) 从生产日志中采样真实问题；(2) 人工构造边界案例和对抗样本；(3) 使用公开基准（MMLU、GSM8K 等）。最佳实践是三者结合——公开基准评估通用能力，私有数据集评估业务场景。

7. **追问："如何评估 Agent 的效率？"** — 三个维度：(1) 步骤效率——完成任务用了多少步（vs 最优步数）；(2) 成本效率——消耗了多少 token/金钱；(3) 时间效率——端到端延迟。权衡是：更多步骤可能提升准确率但增加成本。

8. **追问："Agent 评估的最大难点是什么？"** — 非确定性。同一任务可能有多条正确路径，无法用固定的"标准答案"对比。解决方案：(1) 评估最终状态而非中间步骤；(2) 用 LLM Judge 评估轨迹的合理性；(3) 多次运行取统计指标。

## 参考资料

- [Understanding the 4 Main Approaches to LLM Evaluation (Sebastian Raschka)](https://magazine.sebastianraschka.com/p/llm-evaluation-4-approaches)
- [LLM Evaluation Metrics: The Ultimate Guide (Confident AI)](https://www.confident-ai.com/blog/llm-evaluation-metrics-everything-you-need-for-llm-evaluation)
- [LLM Evaluation: Benchmarks vs. Human Judgment (Medium)](https://medium.com/@lmpo/llm-evaluation-benchmarks-vs-human-judgment-f1cdd16098c0)
- [LLM Evaluation Metrics and Methods, Explained Simply (Evidently AI)](https://www.evidentlyai.com/llm-guide/llm-evaluation-metrics)
- [An Analysis of Automated, Human, and LLM-Based Approaches (arXiv)](https://arxiv.org/pdf/2406.03339)
- [Agent Evaluation vs Model Evaluation: What's the Difference (Maxim)](https://www.getmaxim.ai/articles/agent-evaluation-vs-model-evaluation-whats-the-difference-and-why-it-matters/)
- [Evaluation and Benchmarking of LLM Agents: A Survey (ACL 2025)](https://arxiv.org/html/2507.21504v1)
- [LLM Agent Evaluation: Assessing Tool Use, Task Completion (Confident AI)](https://www.confident-ai.com/blog/llm-agent-evaluation-complete-guide)
- [The Complete Guide to LLM & AI Agent Evaluation in 2026 (Adaline)](https://www.adaline.ai/blog/complete-guide-llm-ai-agent-evaluation-2026)
- [Understanding How AI Agent Trajectories Guide Agent Evaluation (Objectways)](https://objectways.com/blog/understanding-how-ai-agent-trajectories-guide-agent-evaluation/)
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="071-llm-as-judge">

<h2 class="question-title"><span class="q-badge ai100-badge">Q67</span><span class="question-text">LLM-as-Judge：使用 LLM 评估 LLM 输出</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：评估, AI100 · 考察点：Evaluation</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：LLM-as-Judge 是用一个强大的 LLM（如 GPT-4）自动评估另一个 LLM 输出质量的技术，在成本和质量之间取得了最佳平衡。两种核心模式：**Pointwise 评分**（对单个输出按维度打分，如 1-5 分）和 **Pairwise 对比**（比较两个输出哪个更好）。**衡量 Judge 可靠性的正确指标是 Cohen's Kappa（κ）**——顶级 Judge（GPT-4o / Claude Opus）的 κ ≈ 0.78-0.84，逼近人类-人类一致性（κ ≈ 0.80）。⚠️ **常见误区**：很多文章引用"Judge 与人类一致率 80%+"看似很高，但 raw percent agreement 容易虚高（κ=0.62 也能 >80% 一致率），学术界（"Judging the Judges" arXiv:2406.12624）明确指出应优先报告 Kappa。已知系统性偏差：**位置偏差**（倾向于给排在前面的答案更高分）、**冗长偏差**（偏好更长的回答）、**自我偏好**（GPT-4 Judge 偏好 GPT-4 的输出）。缓解策略包括：交换位置多次评估、提供详细的评分 Rubric、使用多个 Judge 投票、定期用人工标注校准。2025 年的新趋势是 **Agent-as-Judge**——用 Agent 代替单纯的 LLM 做评估，Agent 可以执行代码验证、搜索事实等操作来辅助判断。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误区："LLM Judge 的评分就是客观事实" · 误区："Pairwise 比 Pointwise 总是更好" · 追问："如何选择 Judge 模型？"</div>
</div>

## 详细解析

### 两种核心评估模式

```python
# 模式 1：Pointwise 评分（直接打分）
async def pointwise_judge(question, answer, rubric=None):
    prompt = f"""
    请评估以下回答的质量。

    问题：{question}
    回答：{answer}

    评分标准（Rubric）：
    {rubric or '''
    5分：完全正确、完整、清晰
    4分：基本正确，有小瑕疵
    3分：部分正确，有明显遗漏
    2分：大部分不正确或不相关
    1分：完全错误或无关
    '''}

    请先分析回答的优缺点，然后给出分数。
    输出 JSON：{{"analysis": "...", "score": 1-5}}
    """
    return await judge_llm.invoke(prompt)

# 模式 2：Pairwise 对比（两两比较）
async def pairwise_judge(question, answer_a, answer_b):
    prompt = f"""
    比较以下两个回答，判断哪个更好。

    问题：{question}
    回答 A：{answer_a}
    回答 B：{answer_b}

    比较维度：准确性、完整性、清晰度、实用性。
    输出：A更好 / B更好 / 差不多，并说明理由。
    """
    return await judge_llm.invoke(prompt)
```

### LLM Judge 的已知偏差

```python
known_biases = {
    "位置偏差 (Position Bias)": {
        "现象": "Pairwise 中倾向于给排在前面的答案更高分",
        "缓解": "交换 A/B 位置做两次评估，取平均或一致性结果",
    },
    "冗长偏差 (Verbosity Bias)": {
        "现象": "倾向于给更长、更详细的回答更高分",
        "缓解": "在 Rubric 中明确'简洁也是优点'",
    },
    "自我偏好 (Self-Preference)": {
        "现象": "GPT-4 做 Judge 时偏好 GPT-4 生成的内容",
        "缓解": "用与被评估模型不同家族的模型做 Judge",
    },
    "格式偏差 (Format Bias)": {
        "现象": "偏好格式更好（如有列表、标题）的回答",
        "缓解": "在评估时统一格式，或在 Rubric 中降低格式权重",
    },
    "锚定效应 (Anchoring)": {
        "现象": "提供参考答案时 Judge 被参考答案锚定",
        "缓解": "不提供参考答案做 reference-free 评估",
    },
}
```

### 构建可靠的 LLM Judge 系统

```python
class ReliableLLMJudge:
    """带偏差缓解的 LLM 评估系统"""

    async def evaluate(self, question, answer, rubric):
        scores = []

        # 策略 1：多次评估取平均（减少随机性）
        for _ in range(3):
            score = await self.pointwise_judge(question, answer, rubric)
            scores.append(score)
        avg_score = np.mean(scores)

        # 策略 2：多 Judge 投票（减少单模型偏差）
        judges = ["gpt-4o", "claude-sonnet-4-5", "gemini-pro"]
        multi_scores = []
        for judge in judges:
            s = await self.judge_with_model(judge, question, answer, rubric)
            multi_scores.append(s)
        consensus = np.median(multi_scores)

        return {
            "single_judge_avg": avg_score,
            "multi_judge_consensus": consensus,
            "agreement": self.compute_agreement(multi_scores),
        }

    async def pairwise_debiased(self, question, answer_a, answer_b):
        """消除位置偏差的 Pairwise 评估"""
        # 正序评估
        result_1 = await self.pairwise_judge(question, answer_a, answer_b)
        # 交换位置再评估
        result_2 = await self.pairwise_judge(question, answer_b, answer_a)

        if result_1 == "A" and result_2 == "B":
            return "A更好"  # 两次都选了同一个答案
        elif result_1 == "B" and result_2 == "A":
            return "B更好"
        else:
            return "不确定"  # 结果不一致，可能真的差不多
```

### 评分 Rubric 的设计

```python
# 好的 Rubric 是 LLM Judge 可靠性的关键
rubric_example = """
评估维度及标准：

1. 事实准确性 (0-3分)
   3: 所有事实完全正确
   2: 大部分正确，有 1-2 处小错误
   1: 有多处事实错误
   0: 大部分内容不准确

2. 完整性 (0-3分)
   3: 全面覆盖问题的所有方面
   2: 覆盖了主要方面，遗漏了次要点
   1: 只回答了部分问题
   0: 严重遗漏关键内容

3. 清晰度 (0-2分)
   2: 结构清晰，逻辑连贯
   1: 基本可读但组织可改进
   0: 混乱难懂

4. 实用性 (0-2分)
   2: 包含可操作的建议或代码
   1: 提供了方向但缺少细节
   0: 纯理论无实用价值

总分 = 准确性 + 完整性 + 清晰度 + 实用性（满分 10）
"""

# 具体的 Rubric 比模糊的"评估质量"可靠得多
```

### Agent-as-Judge（前沿趋势）

```python
class AgentJudge:
    """用 Agent 替代纯 LLM 做评估——可以调用工具验证"""

    async def evaluate(self, question, answer):
        # Agent 不仅用推理评判，还可以执行验证动作

        # 1. 事实核查：搜索验证关键声明
        claims = await self.extract_claims(answer)
        fact_checks = []
        for claim in claims:
            evidence = await self.web_search(claim)
            is_true = await self.verify(claim, evidence)
            fact_checks.append({"claim": claim, "verified": is_true})

        # 2. 代码验证：运行代码检查正确性
        code_blocks = self.extract_code(answer)
        for code in code_blocks:
            result = await self.execute_code(code)
            # 检查是否能运行、输出是否正确

        # 3. 综合评分
        return await self.synthesize_score(fact_checks, code_results)
```

## 常见误区 / 面试追问

1. **误区："LLM Judge 的评分就是客观事实"** — LLM Judge 的评分包含系统性偏差，不应被视为绝对真理。它是"有偏差的专家意见"，需要用人工标注定期校准。**衡量 Judge 可靠性必须用 Cohen's Kappa**（消除随机一致性），而非 raw percent agreement——后者非常容易虚高（κ=0.62 即可对应 >80% percent agreement，但实际可靠性远低于看起来）。基准参考：人类-人类 κ ≈ 0.80，顶级 LLM Judge κ ≈ 0.78-0.84（"Judging the Judges", arXiv:2406.12624）。

2. **误区："Pairwise 比 Pointwise 总是更好"** — Pairwise 在主观评估（风格、偏好）上更稳定，但对于有明确标准的评估（事实正确性），Pointwise + 详细 Rubric 更高效。且 ACL 2025 研究表明 Pairwise 实际上会放大偏差。

3. **追问："如何选择 Judge 模型？"** — 原则：(1) Judge 应比被评估模型更强；(2) Judge 应与被评估模型来自不同家族（减少自我偏好）；(3) 对于关键评估用多个 Judge 投票。常见选择：GPT-4o 评估 Claude 输出，反之亦然。

4. **追问："LLM Judge 的成本如何控制？"** — (1) 对大规模评估采样而非全量评估；(2) 先用便宜模型做初筛，只对边界案例用强 Judge；(3) 缓存相同输入的评估结果。通常 LLM Judge 成本是人工评估的 1/10。

## 参考资料

- [LLM-as-a-Judge Simply Explained (Confident AI)](https://www.confident-ai.com/blog/why-llm-as-a-judge-is-the-best-llm-evaluation-method)
- [LLM-as-a-Judge: A Complete Guide (Evidently AI)](https://www.evidentlyai.com/llm-guide/llm-as-a-judge)
- [Comprehensive Guide to LLM-as-a-Judge Evaluation (Galileo AI)](https://galileo.ai/blog/llm-as-a-judge-guide-evaluation)
- [The Rise of Agent-as-a-Judge Evaluation for LLMs (arXiv)](https://arxiv.org/html/2508.02994v1)
- [LLM As a Judge: Tutorial and Best Practices (Patronus AI)](https://www.patronus.ai/llm-testing/llm-as-a-judge)
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="072-agent-benchmarks">

<h2 class="question-title"><span class="q-badge ai100-badge">Q68</span><span class="question-text">Agent Benchmark：如何设计端到端的 Agent 测试？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：评估, AI100 · 考察点：Evaluation</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Agent Benchmark 是用于端到端评估 AI Agent 在真实或模拟环境中完成任务能力的标准化测试。与传统 LLM 基准（如 MMLU 测知识）不同，Agent Benchmark 评估的是**完整的任务执行过程**——包括规划、工具使用、多步推理和错误恢复。代表性基准包括：**SWE-bench**（修复真实 GitHub Issue，代码 Agent 标杆）、**WebArena**（在真实网站完成复杂操作）、**GAIA**（通用助手的多步推理和工具组合任务）、**OSWorld**（操作系统级别的计算机使用任务）。设计 Agent Benchmark 的关键原则：(1) 使用真实任务而非人造题目；(2) 评估过程而非仅评估结果；(3) 包含多种难度层次；(4) 防止数据泄露和过拟合。当前面临的挑战：基准饱和（模型快速刷榜）、可游戏性（针对基准优化而非真实能力提升）。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误区："在基准上得分高就说明 Agent 好用" · 误区："一个基准就够了" · 追问："如何防止 Agent 针对基准过拟合？"</div>
</div>

## 详细解析

### 主要 Agent 基准全景

```
Agent 基准分类：
│
├── 代码 Agent
│   ├── SWE-bench：修复真实 GitHub Issue（最权威）
│   ├── SWE-bench Verified：人工验证的高质量子集
│   ├── Multi-SWE-bench：多语言扩展
│   └── HumanEval / MBPP：函数级代码生成
│
├── Web Agent
│   ├── WebArena：真实网站交互任务
│   ├── VisualWebArena：需要视觉理解的网页任务
│   └── Mind2Web：跨网站通用操作
│
├── 通用 Agent
│   ├── GAIA：多步推理 + 多工具组合
│   ├── ALFWorld：文本家庭环境任务
│   └── WebShop：模拟电商购物
│
├── 计算机使用
│   ├── OSWorld：操作系统级任务
│   └── Computer Use benchmarks
│
├── 工具使用
│   ├── ToolBench：API 工具选择和使用
│   ├── API-Bank：API 调用正确性
│   └── TaskBench：多工具组合
│
└── Memory（长期记忆）
    ├── LoCoMo：超长多模态对话的持久记忆（35 sessions / 9K tokens）
    ├── LongMemEval：500 题，5 大记忆能力（含知识更新与 abstention）
    ├── MemoryBank / DialSim / PerLTQA：早期记忆基准
    └── BEAM（1M/10M）：超长上下文 + 大规模事实检索
```

### SWE-bench 详解

```python
# SWE-bench：代码 Agent 的标杆基准
swe_bench = {
    "任务": "给定一个真实的 GitHub Issue，修改代码库使相关测试通过",
    "来源": "12 个流行 Python 开源项目（Django 占比 ~37%，存在领域倾斜）",
    "规模": "2294 个 Issue 主集 + 多个家族变体",
    "家族变体": {
        "SWE-bench Verified": "500 题，OpenAI 联合 Anthropic 等人工验证子集",
        "SWE-bench Lite": "300 题，研究入门用",
        "SWE-bench Multimodal": "517 题，含 UI 截图（防纯文本作弊）",
        "SWE-bench Pro": "2026 抗污染版本，人工严格审查",
        "SWE-bench Live": "持续收集最新 Issue（不在训练集）",
        "Multi-SWE-bench": "扩展到 Go/Rust/TypeScript/Java 等 7 语言",
    },
    "评估": "自动化——运行项目测试套件",
    "难度": "非常高——需要理解大型代码库、定位 bug、编写修复",

    "评估指标": {
        "Resolved Rate": "成功修复的 Issue 比例",
        "当前 SOTA (2026-05)": (
            "≥90%（Claude Mythos Preview 93.9%, "
            "Claude Opus 4.7 87.6%, Claude Sonnet 4.5 80.9%）"
        ),
    },

    "为什么重要": [
        "使用真实世界的软件工程任务",
        "需要理解数千行代码的上下文",
        "修复必须通过真实的测试套件",
        "无法靠记忆训练数据作弊",
    ],
}
```

**⚠️ 2026 重要演进：SWE-bench Verified 已被官方判定"严重污染"**

```
OpenAI 2026-02 公开声明（详见 SWE-bench Pro 发布说明）：
- SWE-bench Verified "increasingly contaminated"
- 最难的 59.4% 子集存在测试缺陷（fail-to-pass 不严格、隐式依赖）
- OpenAI 已停止单独报告 SWE-bench Verified 成绩

抗污染替代基准：
├── SWE-bench Pro：人工严格审查，去除可游戏化任务（推荐主用）
├── SWE-bench Live：持续从最新 GitHub Issue 收集（永远不在训练集）
├── SWE-bench Multimodal：含 UI 截图，纯文本 Agent 无法作弊
└── Multi-SWE-bench：扩展到 Go/Rust/TypeScript 等 7 种语言

面试要点：
- 若候选人引用"SOTA 72%"或更低数字，说明知识停留在 2024
- 若候选人能说出"Verified 已污染、应看 SWE-bench Pro/Live"
  则在 2026 评测话题上属于一线水位
```

### GAIA 基准详解

```python
gaia_benchmark = {
    "任务": "回答需要多步推理和工具组合的复杂问题",
    "出处": "Meta-FAIR + HuggingFace + AutoGPT, NeurIPS 2024",
    "规模": "466 题（公开 165 题 dev + 301 题 private test）",
    "特点": "答案是确定性的（精确匹配评测，不需 LLM Judge）",

    "三个难度等级": {
        "Level 1": "约 5 步推理 + 1 个工具调用（146 题）",
        "Level 2": "5-10 步推理 + 多工具组合（245 题）",
        "Level 3": "最多约 50 步 + 复杂工具链 + 长上下文（75 题）",
    },

    "示例问题": (
        "'找到 2024 年诺贝尔物理学奖获得者的本科毕业院校，"
        "这所院校的现任校长是谁？'"
        "→ 需要：搜索→提取→再搜索→提取"
    ),

    "人机差距（原论文，2024）": {
        "人类志愿者": "92% 准确率",
        "GPT-4 + plugins": "15% 准确率",
        "启示": "GAIA 设计目标是'对人简单、对 Agent 极难'，差距 6x",
    },

    "2026 进展": (
        "Open Deep Research 类 Agent（OpenAI Deep Research、"
        "Manus、GPT Researcher 等）在 Level 1 已超 70%，"
        "Level 3 仍普遍 <40%——多步规划仍是瓶颈"
    ),
}
```

### Memory 专项基准：LoCoMo & LongMemEval

通用 Agent 基准（SWE-bench、GAIA）几乎不评估**跨会话记忆**能力。设计带 memory 的 Agent 时，必须使用记忆专项基准。

```python
# LoCoMo（Maharana et al., 2024，CMU + Snap Research）
locomo = {
    "对话规模": "50 段对话，每段 19-35 sessions / ~300 turns / 9K-26K tokens（非固定 9K）",
    "QA 规模": "约 1500-2000 个问答对",
    "5 类任务": {
        "single-hop":  "841 题——单步事实检索",
        "multi-hop":   "282 题——跨 session 串联多个事实",
        "open-domain": "96 题——结合外部世界知识",
        "temporal":    "321 题——时间顺序/优先级推理",
        "adversarial": "对抗性问题——抗误导/干扰",
    },
    "特色": "persona-grounded + 多模态对话",
    "局限": "话题偏个人闲聊（persona-grounded），缺乏 task-oriented 场景",
}

# LongMemEval（Wu et al., 2024，ICLR 2025）
longmemeval = {
    "QA 规模": "500 题人工构造（LongMemEval_S 标准集）",
    "context 长度": "4K~115K tokens（LongMemEval_S 标准集）",
    "context 扩展": "LongMemEval-M 可达 1.5M tokens / 500 sessions（M = Medium）",
    "6 大核心记忆能力": {
        "Single-Session-User":       "单 session 内用户事实提取",
        "Single-Session-Assistant":  "单 session 内助手输出的引用",
        "Multi-Session Reasoning":   "跨多个 session 的推理（30 题）",
        "Temporal Reasoning":        "时间相关推理（133 题）",
        "Knowledge Updates":         "用新信息覆盖旧信息（78 题）⭐ LoCoMo 缺失项",
        "Abstention":                "识别不可回答的问题，不要瞎编",
    },
    "为什么比 LoCoMo 难": "测的是 human-assistant 对话，更贴近真实使用",
    "残酷的事实": [
        "long-context LLM 直接喂全文，准确率掉 30%-60%",
        "商用系统在简化场景下也只有 30%-70% 准确率",
    ],
}
```

**典型评估流水线**（ReMe、Mem0、MemMachine 等都遵循）：

```
Stage 1：Memory Ingestion（摄入）
  历史 sessions 逐条进入 Agent → 提取事实/关系 → 写入向量库或图库

Stage 2：Memory Retrieval & QA（检索+回答）
  评测问题 → 检索 top-k 记忆 → LLM 生成答案 → LLM-as-Judge 评分
  
评分模型：gpt-4o-2024-08-06，与人类专家一致性 >97%
```

**2025 SOTA 参考**（用于面试时给出量化对比）：

| 系统 | LoCoMo | LongMemEval_S | 备注 |
|------|--------|---------------|------|
| Full-context LLM 直接喂 | 基线 | 基线 | 准确率掉 30-55% |
| LoCoMo-RAG / 向量基线 | 中 | 中 | 多会话场景明显劣化 |
| Mem0（2025 新算法） | **91.6** | **93.4** | 平均 <7K token/检索 |
| ENGRAM-R | — | +21.8pp | token 减 95.5% |
| MemMachine v0.2 | SOTA | 93.0 | 6 维优化消融 |

### 设计 Agent Benchmark 的原则

```python
benchmark_design_principles = {
    "真实性": {
        "原则": "使用真实任务而非人造题目",
        "方法": "从生产日志、GitHub Issue、真实网站中采集",
        "反例": "人工构造的'玩具问题'不能反映真实复杂度",
    },
    "可验证性": {
        "原则": "评估结果必须可自动化验证",
        "方法": "定义明确的成功标准（测试通过、精确匹配等）",
        "挑战": "开放式任务的评估需要 LLM Judge",
    },
    "防泄露": {
        "原则": "防止基准数据出现在训练集中",
        "方法": [
            "动态基准（定期更新题目）",
            "使用私有测试集",
            "基于时间的切分（只用模型训练后的数据）",
        ],
    },
    "多维度": {
        "原则": "评估多种能力，不只是最终结果",
        "维度": ["推理质量", "工具使用", "效率", "安全性"],
    },
    "抗游戏性": {
        "原则": "防止针对基准优化而非真实能力提升",
        "方法": "大规模多样化的测试集 + 动态更新",
    },
}
```

### 自定义 Agent 评估套件

```python
class CustomAgentBenchmark:
    """为自己的 Agent 设计评估套件"""

    def __init__(self):
        self.test_cases = []

    def add_test(self, task, expected_result, difficulty, category,
                 required_tools=None, max_steps=None):
        self.test_cases.append({
            "task": task,
            "expected": expected_result,
            "difficulty": difficulty,      # easy/medium/hard
            "category": category,          # coding/search/analysis
            "required_tools": required_tools,
            "max_steps": max_steps,
        })

    async def run(self, agent):
        results = []
        for case in self.test_cases:
            trajectory = await agent.execute_with_trace(case["task"])

            result = {
                "task_success": self.check_result(
                    trajectory.final_output, case["expected"]
                ),
                "steps_used": len(trajectory.steps),
                "tools_used": [s.tool for s in trajectory.steps if s.tool],
                "cost": trajectory.total_cost,
                "latency": trajectory.total_time,
                "correct_tools": self.check_tools(
                    trajectory, case["required_tools"]
                ),
            }
            results.append(result)

        return self.aggregate_results(results)

    def generate_report(self, results):
        """按维度和难度分组的评估报告"""
        return {
            "overall_success_rate": np.mean([r["task_success"] for r in results]),
            "by_difficulty": self.group_by("difficulty", results),
            "by_category": self.group_by("category", results),
            "avg_cost": np.mean([r["cost"] for r in results]),
            "avg_steps": np.mean([r["steps_used"] for r in results]),
        }
```

### 基准测试的挑战

```python
current_challenges = {
    "数据泄露": "基准题目可能出现在 LLM 的训练数据中",
    "基准饱和": "模型快速刷满分，基准失去区分能力",
    "过拟合基准": "针对基准优化 ≠ 真实能力提升",
    "评估成本": "端到端 Agent 测试需要真实环境，成本高",
    "非确定性": "Agent 每次运行路径不同，评估结果有方差",
}

# SWE-MERA 的解决方案：动态基准
swe_mera = {
    "创新": "持续从最新 GitHub Issue 中自动收集测试用例",
    "优势": "永远不会被训练数据污染",
    "挑战": "质量控制——自动收集的题目可能质量不一",
}
```

## 常见误区 / 面试追问

1. **误区："在基准上得分高就说明 Agent 好用"** — 基准测试是受控环境，生产场景更复杂（网络问题、意外输入、安全攻击等）。SWE-bench 上 70% 的模型在实际开发中可能远达不到这个表现。基准是必要但不充分的。

2. **误区："一个基准就够了"** — 不同基准测试不同能力。代码能力强（SWE-bench 高分）不代表网页操作好（WebArena）。需要根据 Agent 的实际使用场景选择或组合多个基准。

3. **追问："如何防止 Agent 针对基准过拟合？"** — (1) 使用动态更新的基准（如 SWE-MERA）；(2) 保留私有测试集不公开；(3) 评估时加入从未见过的新类型任务；(4) 关注轨迹质量而非仅结果。

4. **追问："小团队如何设计自己的 Agent 评估？"** — 从生产日志中采样 50-100 个典型任务，定义明确的成功标准（可自动验证的优先），标注难度和类别。每次 Agent 更新后运行这个测试套件作为回归测试。不需要从头建造大规模基准。

5. **追问："如何设计 Memory Benchmark？"** — 直接复用 LongMemEval（500 题，5 类能力）+ LoCoMo（多会话长对话）就能覆盖大部分场景。如果业务自建，要重点覆盖 4 个维度：(1) **Multi-session reasoning**——跨会话串联事实；(2) **Temporal reasoning**——时间顺序、"上次/最近"等时间约束；(3) **Knowledge update**——用户改了偏好后能否覆盖旧记忆而不并存（LoCoMo 缺这块，LongMemEval 加上的）；(4) **Abstention**——记忆里没有的事不要瞎编。评估流水线两阶段：摄入（写入记忆系统）+ 检索 QA（LLM-as-Judge 打分，与人类一致性可达 97%+）。

6. **追问："为什么 long-context LLM 直接喂全部历史不行？"** — LongMemEval 实测，把全部对话直接塞进 long-context 模型，准确率比带 memory 系统**掉 30%-60%**。原因有三：(1) **lost in the middle**——超过几万 token 后中间部分信息丢失；(2) **干扰信息**——大量无关历史稀释了相关信号；(3) **knowledge update 失效**——模型很难在长序列中识别"后面的信息覆盖前面的"。这就是为什么需要专门的记忆架构（提取+检索+rerank）而不是无脑加大 context。

## 参考资料

- [Agent Evaluation: Metrics, Benchmarks and Safety Standards](https://mbrenndoerfer.com/writing/agent-evaluation-metrics-benchmarks-safety)
- [AI Agent Benchmark Compendium (Phil Schmid, GitHub)](https://github.com/philschmid/ai-agent-benchmark-compendium)
- [SWE-bench Leaderboards](https://www.swebench.com/)
- [AI Agent Benchmarks are Broken (Daniel Kang)](https://medium.com/@danieldkang/ai-agent-benchmarks-are-broken-c1fedc9ea071)
- [SWE-MERA: A Dynamic Benchmark for Evaluating LLMs (arXiv)](https://arxiv.org/html/2507.11059v1)
- [LoCoMo: Evaluating Very Long-Term Conversational Memory (Snap Research)](https://snap-research.github.io/locomo/)
- [LongMemEval: Benchmarking Chat Assistants on Long-Term Memory (arXiv 2410.10813)](https://arxiv.org/pdf/2410.10813)
- [Mem0: Production-Ready Long-Term Memory (arXiv 2504.19413)](https://arxiv.org/abs/2504.19413)
- [Benchmarking Mem0 token-efficient memory algorithm](https://mem0.ai/research)
- [MemMachine v0.2 on LoCoMo](https://memmachine.ai/blog/2025/12/memmachine-v0.2-delivers-top-scores-and-efficiency-on-locomo-benchmark/)
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="073-regression-testing">

<h2 class="question-title"><span class="q-badge ai100-badge">Q69</span><span class="question-text">回归测试：如何检测 Agent 性能退化？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：评估, AI100 · 考察点：Evaluation</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：LLM/Agent 回归测试是在每次变更（Prompt 修改、模型升级、代码更新）后自动运行测试套件，检测性能是否退化的工程实践。与传统软件回归测试的关键区别：LLM 输出是**非确定性**的——同一输入可能产生不同输出，不能用简单的"输出相等"判断。核心方法：(1) **Golden Dataset**——维护一组标注好的输入-期望输出对，每次变更后自动评估；(2) **质量指标监控**——追踪准确率、延迟、成本等指标的变化趋势；(3) **LLM-as-Judge 自动评分**——用 LLM 对比变更前后的输出质量；(4) **CI/CD 集成**——在部署管道中自动运行回归测试，不通过则阻止部署。Braintrust、LangSmith 等工具提供了开箱即用的回归测试集成。关键原则：**每次 Prompt 或模型变更都必须有回归测试保障**。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误区："LLM 输出不确定，没法做回归测试" · 误区："回归测试只需要在大更新时做" · 追问："Golden Dataset 多大合适？"</div>
</div>

## 详细解析

### 为什么 LLM 需要回归测试？

```
导致性能退化的变更类型：

1. Prompt 修改
   修改了 System Prompt 的一个词 → 安全护栏失效
   添加了新规则 → 与旧规则冲突导致输出混乱

2. 模型升级
   API 提供商更新了模型版本 → 行为微妙变化
   GPT-4-0613 → GPT-4-turbo → 某些任务准确率下降

3. 工具/环境变更
   API 返回格式变化 → Agent 解析失败
   新增工具 → 干扰了原有的工具选择策略

4. 数据变更
   RAG 索引更新 → 检索结果变化 → 回答质量变化
   Few-shot 示例修改 → 输出风格/质量变化
```

### 回归测试框架

```python
class LLMRegressionTester:
    """LLM/Agent 回归测试框架"""

    def __init__(self, golden_dataset, metrics, threshold):
        self.dataset = golden_dataset   # 标注好的测试集
        self.metrics = metrics          # 评估指标
        self.threshold = threshold      # 退化阈值

    async def run_regression(self, current_version, baseline_version=None):
        """运行回归测试，对比当前版本与基线"""

        # 1. 在测试集上运行当前版本
        current_results = []
        for case in self.dataset:
            output = await current_version.invoke(case.input)
            scores = await self.evaluate(case, output)
            current_results.append(scores)

        # 2. 加载基线结果（或运行基线版本）
        if baseline_version:
            baseline_results = await self.run_baseline(baseline_version)
        else:
            baseline_results = self.load_baseline()

        # 3. 对比
        comparison = self.compare(current_results, baseline_results)

        # 4. 判断是否退化
        regressions = []
        for metric_name, delta in comparison.items():
            if delta < -self.threshold[metric_name]:
                regressions.append({
                    "metric": metric_name,
                    "baseline": baseline_results[metric_name],
                    "current": current_results[metric_name],
                    "delta": delta,
                })

        return {
            "passed": len(regressions) == 0,
            "regressions": regressions,
            "details": comparison,
        }

    async def evaluate(self, case, output):
        """多维度评估单个测试用例"""
        scores = {}

        # 精确匹配（如果有标准答案）
        if case.expected_output:
            scores["exact_match"] = output.strip() == case.expected_output.strip()

        # LLM Judge 评分
        scores["quality"] = await self.llm_judge(case.input, output, case.rubric)

        # 格式合规性
        if case.expected_format:
            scores["format_valid"] = self.check_format(output, case.expected_format)

        return scores
```

### Golden Dataset 的设计

```python
class GoldenDataset:
    """维护回归测试的黄金数据集"""

    def __init__(self):
        self.cases = []

    def add_case(self, input_text, expected_output=None,
                 rubric=None, category=None, priority="normal"):
        self.cases.append({
            "input": input_text,
            "expected_output": expected_output,
            "rubric": rubric,             # LLM Judge 评分标准
            "category": category,          # 分类（便于按类分析）
            "priority": priority,          # critical/normal/low
            "created_at": datetime.now(),
        })

    # 数据集应该覆盖：
    coverage = {
        "核心功能": "Agent 的主要使用场景（占 50%）",
        "边界情况": "极端输入、特殊字符、长文本（占 20%）",
        "安全测试": "Prompt Injection、敏感话题（占 15%）",
        "格式测试": "输出格式一致性（占 10%）",
        "性能基准": "延迟和成本的基准用例（占 5%）",
    }
```

### CI/CD 集成

```python
# GitHub Actions 集成示例
ci_cd_config = """
# .github/workflows/llm-regression.yml
name: LLM Regression Test

on:
  pull_request:
    paths:
      - 'prompts/**'        # Prompt 文件变更触发
      - 'config/model.yaml'  # 模型配置变更触发
      - 'src/agent/**'       # Agent 代码变更触发

jobs:
  regression-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run regression tests
        run: python -m pytest tests/regression/ -v
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}

      - name: Check quality threshold
        run: |
          python scripts/check_regression.py \\
            --baseline results/baseline.json \\
            --current results/current.json \\
            --threshold 0.05  # 允许最多 5% 的退化
"""

# 关键：Prompt 变更和代码变更一样需要通过 CI
```

### 非确定性输出的处理

```python
class NonDeterministicTester:
    """处理 LLM 输出的非确定性"""

    async def robust_test(self, case, n_runs=5):
        """多次运行取统计结果"""
        scores = []
        for _ in range(n_runs):
            output = await self.agent.invoke(case.input)
            score = await self.evaluate(case, output)
            scores.append(score)

        return {
            "mean": np.mean(scores),
            "std": np.std(scores),
            "min": np.min(scores),
            "max": np.max(scores),
            "pass_rate": sum(1 for s in scores if s >= case.threshold) / n_runs,
        }

    def compare_distributions(self, baseline_scores, current_scores):
        """用统计检验比较两个版本的得分分布"""
        from scipy.stats import mannwhitneyu

        stat, p_value = mannwhitneyu(baseline_scores, current_scores)
        return {
            "significant_difference": p_value < 0.05,
            "p_value": p_value,
            "baseline_mean": np.mean(baseline_scores),
            "current_mean": np.mean(current_scores),
        }
```

### 监控仪表盘

```
回归测试监控看板：

┌─────────────────────────────────────────────┐
│ Agent v2.3 回归测试报告                      │
├─────────────────────────────────────────────┤
│ 总体通过率：94% (47/50)     vs 基线: 96%    │
│                                             │
│ ⚠ 退化的指标：                              │
│   - 代码生成准确率：72% → 68% (-4%)         │
│   - 平均延迟：2.1s → 2.8s (+33%)           │
│                                             │
│ ✓ 改进的指标：                              │
│   - 对话质量评分：4.2 → 4.5 (+7%)          │
│   - 工具选择准确率：88% → 91% (+3%)        │
│                                             │
│ 建议：检查代码生成 Prompt 的变更            │
└─────────────────────────────────────────────┘
```

## 常见误区 / 面试追问

1. **误区："LLM 输出不确定，没法做回归测试"** — 非确定性不是不能测试的理由。用多次运行取统计指标（均值、方差、通过率），用 LLM-as-Judge 评估语义质量而非精确匹配，用统计检验判断是否有显著退化。

2. **误区："回归测试只需要在大更新时做"** — Prompt 的微小修改也可能导致显著的行为变化。最佳实践是将回归测试集成到 CI/CD，每次 Prompt 或配置变更都自动触发。这在初期投入大，但长期节省大量排错时间。

3. **追问："Golden Dataset 多大合适？"** — 取决于 Agent 的复杂度。建议最少 50 个测试用例覆盖核心场景，理想情况 200-500 个。每个用例应标注优先级——高优先级的用例（如安全相关）必须 100% 通过。

4. **追问："如何维护 Golden Dataset 的时效性？"** — (1) 从生产中发现的 bug 转化为测试用例（增长策略）；(2) 定期审查和淘汰过时的用例；(3) 随着功能迭代补充新场景的用例。Golden Dataset 应该是活的，随产品演进。

## 参考资料

- [LLM Evaluation: A Practical Guide (Braintrust)](https://www.braintrust.dev/articles/llm-evaluation-guide)
- [Automated Prompt Regression Testing with LLM-as-a-Judge and CI/CD (Traceloop)](https://www.traceloop.com/blog/automated-prompt-regression-testing-with-llm-as-a-judge-and-ci-cd)
- [Prompt Versioning, Testing, and CI/CD (Medium)](https://medium.com/@mrhotfix/prompt-versioning-testing-and-ci-cd-why-your-llm-system-is-more-fragile-than-you-think-000441e57f61)
- [ReCatcher: Towards LLMs Regression Testing for Code Generation (arXiv)](https://arxiv.org/html/2507.19390v1)
- [LLM Testing: A Complete Guide (Comet)](https://www.comet.com/site/blog/llm-testing/)
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="074-traces-and-spans">

<h2 class="question-title"><span class="q-badge ai100-badge">Q70</span><span class="question-text">Trace 和 Span：Agent 执行的可观测性</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：评估, AI100 · 考察点：Evaluation</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Trace 和 Span 是分布式追踪（Distributed Tracing）的核心概念，被引入 LLM/Agent 系统用于实现**执行可观测性**——理解 Agent "做了什么、花了多久、哪里出了问题"。**Trace** 代表一次完整的 Agent 执行（从接收任务到返回结果），**Span** 代表 Trace 中的一个操作单元（如一次 LLM 调用、一次工具调用、一次检索）。Span 之间有父子关系，形成树形结构，清晰展示 Agent 的决策链。**OpenTelemetry (OTel)** 是 LLM 可观测性的主流方向——OTel GenAI Special Interest Group 维护的 **Semantic Conventions for Generative AI** 截至 2026-05 仍处于 **Development 阶段（尚未 Stable）**，定义了 GenAI 相关的语义约定（`gen_ai.system`、`gen_ai.request.model` 等属性）。主流工具（Langfuse、LangSmith 2026-01 起 end-to-end native OTel、Arize Phoenix）都已支持，但 API 名字可能在 GA 前微调，生产接入建议固定到具体语义版本。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误区："有日志就不需要 Trace" · 误区："Trace 只在出问题时有用" · 追问："如何控制 Trace 数据的存储成本？"</div>
</div>

## 详细解析

### Trace 和 Span 的结构

```
一次 Agent 执行的 Trace：

Trace: "帮我分析竞品A的定价策略"（总耗时 8.2s）
│
├── Span: LLM 调用 - 理解任务（1.2s）
│   ├── 属性: model=gpt-4o, tokens_in=150, tokens_out=80
│   └── 输出: "需要搜索竞品A的定价信息"
│
├── Span: 工具调用 - web_search（2.5s）
│   ├── 属性: tool=web_search, query="竞品A pricing strategy"
│   └── 输出: [搜索结果 5 条]
│
├── Span: LLM 调用 - 分析结果（3.1s）
│   ├── 属性: model=gpt-4o, tokens_in=2500, tokens_out=500
│   └── 输出: "竞品A采用阶梯定价..."
│
└── Span: LLM 调用 - 生成报告（1.4s）
    ├── 属性: model=gpt-4o, tokens_in=800, tokens_out=300
    └── 输出: 最终分析报告
```

### OpenTelemetry 集成

```python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

# 初始化 OTel
provider = TracerProvider()
provider.add_span_processor(
    BatchSpanProcessor(OTLPSpanExporter(endpoint="http://collector:4318"))
)
trace.set_tracer_provider(provider)
tracer = trace.get_tracer("agent-service")

class ObservableAgent:
    """带完整可观测性的 Agent"""

    async def execute(self, task: str):
        # 创建 Trace（顶层 Span）
        with tracer.start_as_current_span("agent_execution") as root_span:
            root_span.set_attribute("task", task)
            root_span.set_attribute("agent.name", "research-agent")

            # Step 1: 规划
            plan = await self.plan(task)

            # Step 2: 执行每个步骤
            results = []
            for step in plan.steps:
                result = await self.execute_step(step)
                results.append(result)

            # 记录总体指标
            root_span.set_attribute("total_steps", len(results))
            root_span.set_attribute("task_success", True)

            return self.synthesize(results)

    async def plan(self, task):
        with tracer.start_as_current_span("llm_call") as span:
            span.set_attribute("gen_ai.system", "openai")
            span.set_attribute("gen_ai.request.model", "gpt-4o")
            span.set_attribute("gen_ai.operation.name", "planning")

            response = await self.llm.invoke(task)

            # 记录 token 使用
            span.set_attribute("gen_ai.usage.input_tokens", response.usage.prompt_tokens)
            span.set_attribute("gen_ai.usage.output_tokens", response.usage.completion_tokens)

            return response

    async def execute_step(self, step):
        with tracer.start_as_current_span("agent_step") as span:
            span.set_attribute("step.name", step.name)

            if step.requires_tool:
                # 工具调用子 Span
                with tracer.start_as_current_span("tool_call") as tool_span:
                    tool_span.set_attribute("tool.name", step.tool_name)
                    tool_span.set_attribute("tool.input", str(step.tool_params))

                    result = await self.call_tool(step.tool_name, step.tool_params)

                    tool_span.set_attribute("tool.output_size", len(str(result)))
                    if result.error:
                        tool_span.set_status(trace.Status(trace.StatusCode.ERROR))
                        tool_span.record_exception(result.error)

                    return result
```

### GenAI 语义约定（OTel 标准）

```python
# OTel 为 GenAI 定义的标准属性
otel_genai_attributes = {
    # 系统信息
    "gen_ai.system": "openai / anthropic / google",
    "gen_ai.request.model": "gpt-4o / claude-sonnet-4-5",

    # 请求参数
    "gen_ai.request.temperature": 0.7,
    "gen_ai.request.max_tokens": 4096,
    "gen_ai.request.top_p": 1.0,

    # 使用统计
    "gen_ai.usage.input_tokens": 150,
    "gen_ai.usage.output_tokens": 300,

    # Agent 特定
    "gen_ai.agent.name": "research-agent",
    "gen_ai.agent.step": "planning",

    # 工具调用
    "gen_ai.tool.name": "web_search",
    "gen_ai.tool.call_id": "call_abc123",
}
```

### 可观测性的三大支柱在 Agent 中的应用

```python
observability_pillars = {
    "Traces（追踪）": {
        "作用": "追踪 Agent 的完整执行路径",
        "回答": "Agent 做了什么？每步花了多久？",
        "工具": "Jaeger, Zipkin, Langfuse, LangSmith",
    },
    "Metrics（指标）": {
        "作用": "量化 Agent 的性能和健康状态",
        "关键指标": [
            "请求延迟（P50/P95/P99）",
            "Token 消耗量",
            "工具调用成功率",
            "任务完成率",
            "每次请求的成本",
        ],
        "工具": "Prometheus, Datadog, Grafana",
    },
    "Logs（日志）": {
        "作用": "记录详细的事件和错误",
        "内容": "LLM 的输入输出、工具参数和返回值、错误堆栈",
        "工具": "ELK Stack, CloudWatch",
    },
}
```

### 实际调试场景

```python
# 场景：Agent 在某个任务上失败了，如何用 Trace 定位问题？

debug_workflow = """
1. 找到失败的 Trace
   → 根据 request_id 或 error 状态筛选

2. 查看 Span 树结构
   → 定位哪个 Span 出错（红色标记）

3. 检查出错 Span 的详情
   → LLM 调用：看输入 Prompt 和输出
   → 工具调用：看参数和返回值
   → 错误信息：看异常类型和堆栈

4. 分析上下文
   → 前序 Span 的输出是否正常
   → 传递给出错 Span 的输入是否合理

5. 复现和修复
   → 用相同的输入参数重放
   → 修复后重新运行验证
"""
```

### 主流工具对比

```
┌──────────────┬────────────┬────────────┬────────────┐
│ 工具         │ 开源/商业  │ OTel 支持  │ 特色       │
├──────────────┼────────────┼────────────┼────────────┤
│ Langfuse     │ 开源       │ ✓          │ 最流行的开源│
│ LangSmith    │ 商业       │ 部分       │ LangChain  │
│ Arize Phoenix│ 开源       │ ✓          │ ML + LLM   │
│ Traceloop    │ 开源       │ ✓ 原生     │ OTel 原生  │
│ Datadog      │ 商业       │ ✓          │ 企业级     │
│ Arthur AI    │ 商业       │ ✓          │ Agent 专注 │
└──────────────┴────────────┴────────────┴────────────┘
```

## 常见误区 / 面试追问

1. **误区："有日志就不需要 Trace"** — 日志是离散的事件记录，Trace 是结构化的因果链。日志告诉你"发生了什么"，Trace 告诉你"为什么发生"以及"事件之间的关系"。在多步 Agent 中，没有 Trace 几乎无法定位问题。

2. **误区："Trace 只在出问题时有用"** — Trace 在日常监控中同样重要：发现性能瓶颈（哪个 Span 最慢）、优化成本（哪个 LLM 调用 token 消耗最多）、理解用户行为（Agent 通常走什么路径）。

3. **追问："如何控制 Trace 数据的存储成本？"** — (1) 采样——不是每个请求都记录完整 Trace（如 10% 采样率）；(2) 按需详细度——正常请求只记录关键 Span，错误请求记录全部细节；(3) 数据保留策略——Trace 数据保留 7-30 天。

4. **追问："OpenTelemetry 的优势是什么？"** — 供应商无关性。用 OTel 标准化的数据可以发送到任何后端（Jaeger、Datadog、Langfuse）。换监控工具不需要改代码，只改 exporter 配置。这避免了供应商锁定。

## 参考资料

- [AI Agent Observability - Evolving Standards (OpenTelemetry Blog)](https://opentelemetry.io/blog/2025/ai-agent-observability/)
- [How to Trace AI Agent Execution Flows Using OpenTelemetry (OneUptime)](https://oneuptime.com/blog/post/2026-02-06-trace-ai-agent-execution-flows-opentelemetry/view)
- [The AI Engineer's Guide to LLM Observability with OpenTelemetry (Agenta)](https://agenta.ai/blog/the-ai-engineer-s-guide-to-llm-observability-with-opentelemetry)
- [Best Practices for Building Agents: Observability and Tracing (Arthur AI)](https://www.arthur.ai/blog/best-practices-for-building-agents-part-1-observability-and-tracing)
- [The Role of OpenTelemetry in LLM Observability (Arize AI)](https://arize.com/blog/the-role-of-opentelemetry-in-llm-observability/)
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="075-evaluation-tools-comparison">

<h2 class="question-title"><span class="q-badge ai100-badge">Q71</span><span class="question-text">评估工具对比：Ragas、LangSmith、Braintrust</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：评估, AI100 · 考察点：Evaluation</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：LLM/Agent 评估工具分为两大类：**评估框架**（定义指标和运行评估，如 Ragas、DeepEval）和**评估平台**（提供完整的评估+监控+协作能力，如 LangSmith、Braintrust、Langfuse）。**Ragas** 专注于 RAG 评估，提供 Faithfulness、Answer Relevancy、Context Precision 等 RAG 专用指标；**LangSmith** 是 LangChain 生态的全栈平台，强在 Trace + 评估 + Playground 一体化；**Braintrust** 专注于评估和 Prompt 迭代，强在 A/B 测试和在线评估；**Langfuse** 是最流行的开源替代方案，支持 OTel 和多种框架。选择原则：RAG 专项评估 → Ragas；LangChain 生态 → LangSmith；框架无关 + 开源 → Langfuse；专业评估工作流 → Braintrust。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误区："选一个工具就够了" · 误区："商业平台一定比开源好" · 追问："这些工具如何处理数据隐私？"</div>
</div>

## 详细解析

### 工具全景分类

```
LLM 评估生态：
│
├── 评估框架（定义指标、运行评估）
│   ├── Ragas：RAG 专用评估
│   ├── DeepEval：通用 LLM 评估（开源）
│   ├── Promptfoo：Prompt 对比测试
│   └── Giskard：安全和偏差测试
│
├── 评估平台（评估 + 监控 + 协作）
│   ├── LangSmith：LangChain 全栈平台
│   ├── Braintrust：专业评估和迭代
│   ├── Langfuse：开源可观测性平台
│   ├── Arize Phoenix：ML/LLM 观测平台
│   └── Maxim AI：Agent 评估专注
│
└── 通用观测（可扩展到 LLM）
    ├── Datadog LLM Observability
    ├── New Relic AI Monitoring
    └── Grafana + OpenTelemetry
```

### Ragas：RAG 评估专家

```python
from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_precision,
    context_recall,
)

# Ragas 的 RAG 专用指标
ragas_metrics = {
    "Faithfulness": {
        "含义": "回答是否基于检索到的上下文（非幻觉）",
        "计算": "提取回答中的声明 → 检查每个声明是否被上下文支持",
        "范围": "0-1，越高越好",
    },
    "Answer Relevancy": {
        "含义": "回答与问题的相关程度",
        "计算": "从回答反向生成问题 → 比较生成问题与原问题的相似度",
        "范围": "0-1",
    },
    "Context Precision": {
        "含义": "检索到的上下文中有多少是相关的",
        "计算": "在检索结果中，相关段落的排名越高分越高",
        "范围": "0-1",
    },
    "Context Recall": {
        "含义": "相关信息是否都被检索到了",
        "计算": "参考答案中的信息是否都能在检索上下文中找到",
        "范围": "0-1",
    },
}

# 使用示例
result = evaluate(
    dataset=eval_dataset,
    metrics=[faithfulness, answer_relevancy, context_precision],
    llm=ChatOpenAI(model="gpt-4o"),
)
print(result)  # {'faithfulness': 0.85, 'answer_relevancy': 0.92, ...}
```

### LangSmith：LangChain 全栈平台

```python
from langsmith import Client
from langsmith.evaluation import evaluate

client = Client()

# LangSmith 的核心能力
langsmith_features = {
    "Tracing": "自动追踪 LangChain/LangGraph 的每步执行",
    "Datasets": "创建和管理评估数据集",
    "Evaluators": "内置和自定义评估器",
    "Playground": "在线调试和测试 Prompt",
    "Monitoring": "生产环境的实时监控",
    "Annotation": "人工标注和反馈收集",
}

# 运行评估
def correctness_evaluator(run, example):
    """自定义评估器"""
    prediction = run.outputs["output"]
    reference = example.outputs["answer"]
    # 用 LLM 评估正确性
    score = llm_judge(prediction, reference)
    return {"score": score, "key": "correctness"}

results = evaluate(
    target=my_agent,
    data="my-eval-dataset",
    evaluators=[correctness_evaluator],
)
```

### Braintrust：专业评估和迭代

```python
import braintrust

# Braintrust 的核心能力
braintrust_features = {
    "Eval Framework": "声明式评估框架，简洁易用",
    "Online Evals": "生产流量的实时评估",
    "Prompt Playground": "Prompt 在线编辑和对比",
    "A/B Testing": "内置的 Prompt A/B 测试",
    "Logging": "自动记录所有 LLM 调用",
}

# 运行评估
@braintrust.traced
def my_task(input):
    return agent.invoke(input)

experiment = braintrust.Eval(
    "my-agent-eval",
    data=lambda: [
        {"input": "什么是 RAG？", "expected": "检索增强生成..."},
        # ...
    ],
    task=my_task,
    scores=[
        braintrust.Score.factuality,  # 内置评分器
        braintrust.Score.relevance,
    ],
)
```

### Langfuse：开源可观测性

```python
from langfuse import Langfuse

langfuse = Langfuse()

# Langfuse 的核心能力
langfuse_features = {
    "开源": "完全开源，可自部署",
    "OTel 兼容": "支持 OpenTelemetry 标准",
    "框架无关": "支持 LangChain、LlamaIndex、OpenAI SDK 等",
    "Tracing": "完整的 Trace/Span 追踪",
    "Evaluations": "在线和离线评估",
    "Cost Tracking": "自动追踪 LLM 成本",
    "Prompt Management": "Prompt 版本管理",
}

# 使用示例
trace = langfuse.trace(name="agent-task")
span = trace.span(name="llm-call", input=prompt)
# ... LLM 调用 ...
span.end(output=response, metadata={"model": "gpt-4o"})

# 评估
trace.score(name="quality", value=0.85, comment="回答准确完整")
```

### 工具对比总结

```
┌──────────────┬──────────┬──────────┬──────────┬──────────┐
│ 维度         │ Ragas    │ LangSmith│ Braintrust│ Langfuse │
├──────────────┼──────────┼──────────┼──────────┼──────────┤
│ 类型         │ 评估框架 │ 全栈平台 │ 评估平台 │ 观测平台 │
│ 开源         │ ✓        │ ✗ 商业   │ ✗ 商业   │ ✓        │
│ RAG 评估     │ ★★★★★  │ ★★★     │ ★★★     │ ★★      │
│ Agent 评估   │ ★★      │ ★★★★   │ ★★★★   │ ★★★    │
│ Tracing      │ ✗        │ ★★★★★ │ ★★★     │ ★★★★  │
│ A/B 测试     │ ✗        │ ★★★     │ ★★★★★ │ ★★      │
│ Prompt 管理  │ ✗        │ ★★★★   │ ★★★★   │ ★★★    │
│ OTel 支持    │ ✗        │ ✓ (2026-01)│ 部分    │ ✓        │
│ 框架依赖     │ 无       │ LangChain│ 无       │ 无       │
│ 自部署       │ N/A      │ ✗        │ ✗        │ ✓        │
│ 定价         │ 免费     │ $$$      │ $$       │ 免费/$$  │
└──────────────┴──────────┴──────────┴──────────┴──────────┘
```

### 选择决策树

```
你的场景是什么？
│
├── 主要做 RAG → Ragas（指标最全）+ Langfuse（追踪）
│
├── 使用 LangChain/LangGraph → LangSmith（最佳集成）
│
├── 需要开源 + 自部署 → Langfuse
│
├── 需要专业的 Prompt A/B 测试 → Braintrust
│
├── 需要企业级 + 已有 Datadog → Datadog LLM Observability
│
└── 预算有限 + 快速开始 → Langfuse（开源）+ DeepEval（评估）
```

## 常见误区 / 面试追问

1. **误区："选一个工具就够了"** — 评估框架（Ragas）和评估平台（LangSmith/Langfuse）是互补的。Ragas 定义 RAG 评估的指标，LangSmith/Langfuse 提供运行评估和追踪的基础设施。生产系统通常需要两者结合。

2. **误区："商业平台一定比开源好"** — Langfuse 作为开源方案在很多场景下已足够好，且可以自部署保证数据安全。商业平台的优势在于企业级支持、更丰富的 UI 和更好的协作功能。

3. **追问："这些工具如何处理数据隐私？"** — 评估工具会记录 LLM 的输入输出，可能包含敏感数据。解决方案：(1) 自部署 Langfuse 保证数据不出组织；(2) 配置 PII 脱敏规则；(3) 只在开发环境记录完整数据，生产环境只记录指标。

4. **追问："如何从零开始搭建评估体系？"** — 三步走：(1) 先用 Langfuse/LangSmith 加 Tracing，了解 Agent 的行为；(2) 构建 Golden Dataset 并用 DeepEval/Ragas 定义指标；(3) 集成到 CI/CD 实现自动化回归测试。

## 参考资料

- [Best LLM Evaluation Tools: 7 Platforms for 2026 (Rhesis AI)](https://rhesis.ai/post/best-llm-evaluation-testing-tools)
- [Comparing LLM Evaluation Platforms: Top Frameworks (Arize AI)](https://arize.com/llm-evaluation-platforms-top-frameworks/)
- [LangWatch vs LangSmith vs Braintrust vs Langfuse (LangWatch)](https://langwatch.ai/blog/langwatch-vs-langsmith-vs-braintrust-vs-langfuse-choosing-the-best-llm-evaluation-monitoring-tool-in-2025)
- [The 5 Best RAG Evaluation Tools (Braintrust)](https://www.braintrust.dev/articles/best-rag-evaluation-tools)
- [Top LLM Observability Platforms 2025 (Agenta)](https://agenta.ai/blog/top-llm-observability-platforms)
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="076-static-benchmark-trap">

<h2 class="question-title"><span class="q-badge ai100-badge">Q72</span><span class="question-text">静态 Benchmark 的陷阱：为什么 95% 准确率在生产中会失效？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐⭐ · 标签：评估, AI100 · 考察点：Evaluation</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：静态 Benchmark 的核心陷阱是**高分 ≠ 高能力**——模型在固定测试集上的高准确率可能源于数据泄露（训练集包含测试题）、过拟合基准（针对基准优化而非真实能力提升）、以及**分布偏移**（基准的任务分布与生产环境不同）。2025 年业界观察到"**大脱钩**（The Great Decoupling）"现象：MMLU 80%+ 的分数对预测生产表现几乎没有意义，某些模型在真正新颖的问题上得分下降 20-30%。缓解策略包括：(1) **动态基准**（如 LiveCodeBench、SWE-MERA 持续更新题目）；(2) **领域专属评估**（用自己的数据构建 eval）；(3) **持续评估**（将评估嵌入生产流量）；(4) **多维度评估**（结合安全性、延迟、成本等非准确率指标）。最终原则：**任何单一数字都不能代表模型在你的场景中的表现——必须用你自己的数据测试**。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误区："排行榜第一就是最好的模型" · 误区："基准分数高就可以直接上线" · 追问："如何构建不会被污染的评估？"</div>
</div>

## 详细解析

### 静态 Benchmark 失效的四大原因

```
为什么 Benchmark 95% ≠ 生产 95%？

1. 数据泄露（Data Contamination）
   训练数据包含了基准测试的题目
   → 模型在"记忆"答案，不是在"推理"
   → LiveCodeBench 发现：部分模型在训练截止日期前的题目上
     准确率比之后的题目高 20-30%

2. 分布偏移（Distribution Shift）
   基准的任务类型和难度分布 ≠ 生产环境
   → MMLU 测学术知识 ≠ 用户的真实问题
   → HumanEval 测独立函数 ≠ 修改大型代码库

3. 评估粒度不足
   基准只看最终结果（对/错），不看过程
   → 模型可能用错误的推理得到正确答案
   → 或者在 95% 的简单题上全对，但 5% 的关键场景全错

4. 基准饱和（Benchmark Saturation）
   顶尖模型都在 90%+，失去区分能力
   → MMLU: GPT-4o 88%, Claude 87%, Gemini 86%
   → 2-3% 的差距在统计上可能不显著
```

### "大脱钩" 现象

```python
# 2025 年观察到的 Benchmark vs 生产表现脱钩

great_decoupling = {
    "现象": "公开排行榜失去了对生产用例的预测能力",
    "证据": [
        "MMLU 80%+ 对生产表现无预测力",
        "模型在真正新颖问题上下降 20-30%",
        "基准得分相近的模型在实际任务中表现差异巨大",
    ],
    "根因": "静态基准测的是'过去的能力'，不是'未来的泛化'",
    "影响": "企业不能再依靠公开排行榜选模型",
}

# Humanity's Last Exam (HLE) 的尝试
hle = {
    "目标": "设计模型'不可能'通过的学术基准",
    "设计": "由领域专家出的极难题目（2700+ 题）",
    "发布初期 (2025-01)": "当前最强模型 < 10% 准确率",
    "2026-05 SOTA": "Gemini 3.1 Pro Preview ~44.7%（Artificial Analysis 数据）",
    "1 年内增长": "10% → 44%+，约 4 倍",
    "局限": "仍然是静态的——印证'基准饱和速度远超预期'，是反面教材",
}
```

### LLM-as-Judge 的稳定性陷阱

```python
# "稳定性陷阱"——Judge 看似一致实则不稳定

stability_trap = {
    "现象": "LLM Judge 的高一致性掩盖了推理不稳定",
    "研究发现": {
        "表面一致性": "多次运行的判决一致率很高",
        "推理不稳定": "判决相同但推理理由完全不同",
        "准确率波动": "相同配置下准确率波动可达 15%",
    },
    "最危险的失败模式": (
        "Trapped Judge——Judge 编造证据来支持已给出的判决，"
        "给出看似合理的'通过'评估，跳过了人工审核"
    ),
    "缓解": [
        "不只看判决结果，还要检查推理链",
        "多次运行取统计结果",
        "定期用人工标注校准 Judge",
    ],
}
```

### 动态基准：解决数据泄露

```python
# 动态基准的设计理念

dynamic_benchmarks = {
    "LiveCodeBench": {
        "方法": "从 LeetCode/Codeforces 持续收集新题",
        "更新频率": "每月更新",
        "优势": "题目发布时间晚于模型训练截止日期",
        "发现": "部分模型在新题上准确率下降 30%",
    },
    "SWE-MERA": {
        "方法": "从最新 GitHub Issue 自动收集测试用例",
        "优势": "永远不会被训练数据污染",
        "挑战": "自动收集的题目质量参差不齐",
    },
    "Chatbot Arena": {
        "方法": "用户实时投票对比两个模型的回答",
        "优势": "反映真实用户偏好，动态 ELO 评分",
        "局限": "偏向对话场景，不覆盖复杂 Agent 任务",
    },
}
```

### 正确的评估策略

```python
class ProductionEvalStrategy:
    """从静态基准走向生产级评估的策略"""

    def __init__(self):
        self.layers = {
            "Layer 1: 公开基准（门槛筛选）": {
                "作用": "快速淘汰明显不合格的模型",
                "注意": "不用于最终决策，只用于初筛",
                "示例": "MMLU < 70% 的模型直接排除",
            },
            "Layer 2: 领域专属评估（核心）": {
                "作用": "用你自己的数据测试模型",
                "方法": [
                    "从生产日志中采样 200-500 个典型任务",
                    "标注期望结果和评分标准",
                    "定义领域特定的评估指标",
                ],
                "关键": "这是选模型的真正依据",
            },
            "Layer 3: 在线评估（验证）": {
                "作用": "在真实流量中持续监控",
                "方法": [
                    "A/B 测试新旧模型",
                    "LLM-as-Judge 自动评分生产流量",
                    "用户反馈收集（显式 + 隐式）",
                ],
            },
            "Layer 4: 安全与合规测试": {
                "作用": "确保模型满足非功能性要求",
                "维度": ["延迟 P95", "成本/请求", "安全护栏通过率", "PII 泄露率"],
            },
        }

    def evaluate_model(self, model, domain_dataset):
        """四层评估流程"""
        # Layer 1: 公开基准快速筛选
        if not self.passes_public_benchmarks(model):
            return "REJECTED: 公开基准不达标"

        # Layer 2: 领域评估（核心决策依据）
        domain_scores = self.run_domain_eval(model, domain_dataset)
        if domain_scores["overall"] < self.threshold:
            return "REJECTED: 领域评估不达标"

        # Layer 3: 小流量在线测试
        online_result = self.run_ab_test(model, traffic_pct=5)

        # Layer 4: 安全合规
        safety_result = self.run_safety_eval(model)

        return {
            "domain_scores": domain_scores,
            "online_metrics": online_result,
            "safety": safety_result,
            "recommendation": self.make_decision(domain_scores, online_result, safety_result),
        }
```

### 常见陷阱速查表

```
┌────────────────────────┬──────────────────────────────┐
│ 陷阱                   │ 缓解策略                     │
├────────────────────────┼──────────────────────────────┤
│ 数据泄露导致虚高分数   │ 使用动态基准 + 时间切分      │
│ 基准分布 ≠ 生产分布   │ 构建领域专属测试集           │
│ 只看准确率忽略其他维度 │ 加入延迟、成本、安全等指标   │
│ 一次评估永久有效       │ 持续评估 + 定期更新测试集    │
│ 相信单一排行榜         │ 多基准交叉验证 + 自有评估    │
│ LLM Judge 自动化偏差   │ 人工校准 + 多 Judge 投票     │
│ 基准饱和失去区分力     │ 设计更难的任务或细分维度     │
└────────────────────────┴──────────────────────────────┘
```

## 常见误区 / 面试追问

1. **误区："排行榜第一就是最好的模型"** — 排行榜反映的是在特定基准上的得分，不是在你的业务场景中的表现。不同模型在不同领域有不同优势。选模型的唯一可靠方式是用你自己的数据测试。

2. **误区："基准分数高就可以直接上线"** — 生产环境有基准测试没有的复杂性：网络超时、恶意输入、长尾分布、安全攻击。基准测试是必要但远不充分的——还需要在线评估、安全测试和灰度发布。

3. **追问："如何构建不会被污染的评估？"** — (1) 使用内部业务数据构建私有测试集，不公开发布；(2) 定期从最新生产日志中补充新用例；(3) 使用动态基准（LiveCodeBench、SWE-MERA）作为补充；(4) 关注模型在训练截止日期之后的数据上的表现。

4. **追问："如何平衡评估的全面性和成本？"** — 分层策略：公开基准免费快速初筛 → 领域评估（200-500 用例，LLM Judge 自动化）→ 小流量在线测试（5% 流量 A/B）。大部分成本在领域评估层，但这是投资回报率最高的环节。

## 参考资料

- [2025 Year in Review for LLM Evaluation: When the Scorecard Broke (Goodeye Labs)](https://www.goodeyelabs.com/insights/llm-evaluation-2025-review)
- [Avoiding Common Pitfalls in LLM Evaluation (HoneyHive)](https://www.honeyhive.ai/post/avoiding-common-pitfalls-in-llm-evaluation)
- [The Stability Trap: Evaluating the Reliability of LLM-Based Instruction Adherence Auditing (arXiv)](https://arxiv.org/html/2601.11783)
- [Beyond Synthetic Benchmarks: Evaluating LLM Performance on Real-World Code (arXiv)](https://arxiv.org/html/2510.26130v1)
- [LLM Evaluation Benchmarks and Safety Datasets for 2025 (Responsible AI Labs)](https://responsibleailabs.ai/knowledge-hub/articles/llm-evaluation-benchmarks-2025)
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="077-continuous-evaluation-pipeline">

<h2 class="question-title"><span class="q-badge ai100-badge">Q73</span><span class="question-text">如何构建持续评估（Continuous Evaluation）流水线？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐⭐ · 标签：评估, AI100 · 考察点：Evaluation</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：持续评估流水线是将 LLM/Agent 评估从"一次性测试"升级为"持续运行的质量保障系统"的工程实践。核心理念：**评估不是发布前的关卡，而是贯穿整个生命周期的闭环**。流水线包含三个阶段：(1) **开发期评估**——在 CI/CD 中运行回归测试，Prompt 或模型变更触发自动评估；(2) **上线期评估**——灰度发布 + A/B 测试 + 实时质量监控；(3) **运行期评估**——对生产流量持续抽样评估，检测性能漂移（drift），自动告警。关键组件包括：Golden Dataset 定期更新、LLM-as-Judge 自动评分、用户反馈闭环、成本和延迟监控、熔断机制（Circuit Breaker）。工具链：CI/CD（GitHub Actions）+ 评估框架（DeepEval/Ragas）+ 观测平台（Langfuse/Braintrust）+ 告警（PagerDuty/Slack）。采用结构化评估的团队报告准确率提升 35-40%、迭代速度提升 5-10x。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误区："评估一次就够了，模型又没变" · 误区："在线评估太贵了" · 追问："如何处理评估指标之间的冲突？"</div>
</div>

## 详细解析

### 持续评估 vs 一次性评估

```
一次性评估的问题：
├── 评估一次后就"永远有效"的假设是错误的
├── 模型 API 版本更新 → 行为悄悄变化
├── 用户行为演化 → 原有测试集不再代表真实场景
├── Prompt 小修改 → 可能引入意想不到的退化
└── 数据变更（RAG 索引更新）→ 回答质量漂移

持续评估的理念：
├── 评估是 always-on 的，不是 one-shot 的
├── 每次变更自动触发评估（CI/CD 集成）
├── 生产流量持续被抽样评估（在线评估）
├── 指标趋势可视化 + 自动告警
└── 用户反馈回流到评估数据集（闭环）
```

### 三阶段流水线架构

```python
class ContinuousEvalPipeline:
    """持续评估流水线的三阶段架构"""

    # 阶段 1：开发期评估（CI/CD 集成）
    dev_stage = {
        "触发条件": [
            "Prompt 文件变更（prompts/**）",
            "模型配置变更（config/model.yaml）",
            "Agent 代码变更（src/agent/**）",
            "RAG 索引更新",
        ],
        "评估内容": {
            "回归测试": "在 Golden Dataset 上运行，对比基线",
            "安全测试": "Prompt Injection、越权操作等",
            "格式测试": "输出格式是否符合预期",
        },
        "阻塞条件": "关键指标低于阈值 → 阻止 PR 合并",
        "工具": "GitHub Actions + DeepEval/Ragas",
    }

    # 阶段 2：上线期评估（灰度发布）
    release_stage = {
        "流程": [
            "1. 新版本部署到 Canary 环境（5% 流量）",
            "2. 自动对比 Canary vs Production 的质量指标",
            "3. 如果质量达标 → 逐步扩大流量（25% → 50% → 100%）",
            "4. 如果质量退化 → 自动回滚",
        ],
        "关键指标": [
            "回答质量评分（LLM Judge）",
            "用户满意度（反馈率）",
            "延迟 P95",
            "成本/请求",
        ],
        "工具": "Feature Flags + A/B 测试框架",
    }

    # 阶段 3：运行期评估（持续监控）
    production_stage = {
        "抽样评估": "对 10% 的生产请求进行 LLM Judge 评分",
        "漂移检测": "监控指标趋势，检测渐进退化",
        "用户反馈": "收集显式反馈（👍👎）和隐式信号（重试率）",
        "熔断机制": "质量分 < 阈值 or 成本 > 预算 → 自动降级",
        "工具": "Langfuse/Braintrust + Prometheus + PagerDuty",
    }
```

### CI/CD 集成实现

```yaml
# .github/workflows/llm-continuous-eval.yml
name: LLM Continuous Evaluation

on:
  pull_request:
    paths:
      - 'prompts/**'
      - 'config/model.yaml'
      - 'src/agent/**'
  schedule:
    - cron: '0 2 * * *'  # 每天凌晨 2 点定时运行

jobs:
  regression-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run core regression tests
        run: |
          python -m pytest tests/eval/regression/ \
            --golden-dataset data/golden_v3.json \
            --baseline results/baseline.json \
            --output results/current.json

      - name: Run safety tests
        run: |
          python -m pytest tests/eval/safety/ \
            --injection-dataset data/injection_tests.json

      - name: Compare with baseline
        run: |
          python scripts/compare_eval.py \
            --baseline results/baseline.json \
            --current results/current.json \
            --max-regression 0.05 \
            --critical-metrics accuracy,safety_pass_rate

      - name: Post results to PR
        if: github.event_name == 'pull_request'
        run: |
          python scripts/post_eval_comment.py \
            --results results/current.json \
            --pr ${{ github.event.pull_request.number }}
```

### 在线评估系统

```python
class OnlineEvaluator:
    """生产流量的持续在线评估"""

    def __init__(self, sample_rate=0.1, judge_model="gpt-4o"):
        self.sample_rate = sample_rate
        self.judge = LLMJudge(model=judge_model)
        self.metrics_store = MetricsStore()

    async def evaluate_request(self, request, response, metadata):
        """对单个请求进行在线评估"""
        # 按采样率决定是否评估
        if random.random() > self.sample_rate:
            return

        # LLM Judge 自动评分
        scores = await self.judge.evaluate(
            question=request.input,
            answer=response.output,
            rubric=self.get_rubric(request.category),
        )

        # 记录指标
        self.metrics_store.record({
            "timestamp": datetime.now(),
            "request_id": request.id,
            "category": request.category,
            "quality_score": scores["quality"],
            "relevance_score": scores["relevance"],
            "safety_score": scores["safety"],
            "latency_ms": metadata["latency_ms"],
            "cost_usd": metadata["cost"],
            "model": metadata["model"],
        })

    def detect_drift(self, window_hours=24):
        """检测质量漂移"""
        current = self.metrics_store.get_recent(hours=window_hours)
        baseline = self.metrics_store.get_baseline()

        for metric in ["quality_score", "relevance_score"]:
            current_mean = np.mean(current[metric])
            baseline_mean = baseline[metric]
            drift = (current_mean - baseline_mean) / baseline_mean

            if drift < -0.1:  # 退化超过 10%
                self.alert(
                    level="critical",
                    message=f"{metric} 下降 {abs(drift)*100:.1f}%",
                )

    def circuit_breaker(self, recent_scores):
        """熔断机制——质量过低时自动降级"""
        avg_quality = np.mean(recent_scores[-100:])
        if avg_quality < 0.5:  # 最近 100 个请求质量过低
            self.switch_to_fallback()
            self.alert(level="critical", message="触发熔断，已切换到降级模式")
```

### 用户反馈闭环

```python
class FeedbackLoop:
    """将用户反馈转化为评估数据"""

    def collect_feedback(self, request_id, feedback_type, value):
        """收集两类反馈"""
        # 显式反馈：用户点击 👍👎、评分、投诉
        # 隐式反馈：重试率、编辑率、会话放弃率

        self.store.save({
            "request_id": request_id,
            "type": feedback_type,   # explicit / implicit
            "value": value,
            "timestamp": datetime.now(),
        })

    def update_golden_dataset(self):
        """定期将用户反馈转化为新的测试用例"""
        # 1. 找出负面反馈的请求
        negative = self.store.query(
            feedback_type="explicit",
            value="negative",
            last_days=30,
        )

        # 2. 人工审核后加入 Golden Dataset
        for case in negative:
            if self.human_review(case):
                self.golden_dataset.add(
                    input=case.request_input,
                    expected=case.corrected_output,  # 人工修正的期望输出
                    category=case.category,
                    source="user_feedback",
                )

    # 闭环：用户反馈 → 新测试用例 → CI 检测 → 修复 → 用户体验提升
```

### 监控仪表盘设计

```
┌──────────────────────────────────────────────────┐
│ Agent 持续评估仪表盘                              │
├──────────────────────────────────────────────────┤
│                                                  │
│ 📊 质量趋势（近 7 天）                           │
│ Quality: ████████████████░░ 4.2/5 (↓0.1)       │
│ Safety:  ██████████████████ 98.5%  (→)          │
│ Latency: ████████████████░░ P95=2.3s (↑0.2s)   │
│                                                  │
│ 🔔 告警                                         │
│ ⚠ 代码生成质量下降 8%（最近 24h）               │
│ ⚠ 成本/请求上升 15%（模型切换导致）              │
│                                                  │
│ 📈 按类别分析                                    │
│ 问答:   4.5/5  ████████████████████             │
│ 代码:   3.8/5  ██████████████░░░░░░  ← 关注    │
│ 分析:   4.3/5  █████████████████░░░             │
│                                                  │
│ 🔄 CI/CD 评估记录                               │
│ PR #234: ✅ 通过（quality=4.3, safety=99%）     │
│ PR #233: ❌ 失败（quality=3.1 < 阈值 3.5）     │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 实施路线图

```
Month 1: 基础设施
├── 接入 Langfuse/LangSmith，所有请求记录 Trace
├── 定义核心评估指标（质量、安全、延迟、成本）
└── 构建初始 Golden Dataset（50-100 条）

Month 2: CI/CD 集成
├── 回归测试集成到 GitHub Actions
├── Prompt 变更触发自动评估
└── PR 中自动 post 评估报告

Month 3: 在线评估
├── 部署 LLM Judge 对生产流量抽样评估
├── 搭建监控仪表盘
├── 配置告警规则
└── 用户反馈收集机制

Month 4-6: 闭环优化
├── 用户反馈 → Golden Dataset 更新
├── 漂移检测 + 自动熔断
├── A/B 测试框架
└── 定期评估审查会议
```

## 常见误区 / 面试追问

1. **误区："评估一次就够了，模型又没变"** — 即使不主动更换模型，API 提供商也可能更新版本（如 GPT-4 的 0613 → turbo 迁移）。RAG 索引更新、用户行为变化都会导致质量漂移。持续评估是发现这些隐性退化的唯一方式。

2. **误区："在线评估太贵了"** — 抽样评估 10% 的请求，用 GPT-4o-mini 做 Judge（成本约 $0.001/评估），1 万请求/天只需约 $1/天。相比质量问题导致的用户流失，这个成本微不足道。

3. **追问："如何处理评估指标之间的冲突？"** — 例如质量提升但成本翻倍。建议：(1) 定义各指标的优先级和阈值；(2) 用加权综合得分（如 quality×0.5 + cost×0.2 + latency×0.2 + safety×0.1）；(3) 设置硬性底线（如安全分 < 95% 一票否决）。

4. **追问："小团队如何低成本起步？"** — 最小可行方案：(1) 用 Langfuse（免费开源）记录所有请求；(2) 维护 50 条 Golden Dataset，用 pytest 在 CI 中跑；(3) 生产环境收集 👍👎 反馈。这三步花一周就能搭好，之后逐步迭代。

## 参考资料

- [LLMOps for AI Agents: Monitoring, Testing & Iteration in Production (OneReach)](https://onereach.ai/blog/llmops-for-ai-agents-in-production/)
- [What 1,200 Production Deployments Reveal About LLMOps in 2025 (ZenML)](https://www.zenml.io/blog/what-1200-production-deployments-reveal-about-llmops-in-2025)
- [Building an LLM Evaluation Framework: Best Practices (Datadog)](https://www.datadoghq.com/blog/llm-evaluation-framework-best-practices/)
- [Agent Evaluation in 2025: Complete Guide (Orq.ai)](https://orq.ai/blog/agent-evaluation)
- [5 Best Tools for Monitoring LLM Applications in 2026 (Braintrust)](https://www.braintrust.dev/articles/best-llm-monitoring-tools-2026)
</div>
</details>

</div>

---

<div class="question-card ai100-card interview-card compact-card" id="111-eval-harness-design">

<h2 class="question-title"><span class="q-badge ai100-badge">Q74</span><span class="question-text">Eval Harness 设计与生态选型：lm-evaluation-harness / Inspect AI / HELM / METR</span></h2>

主流 Harness 形成"三足鼎立 + METR 范式"格局：**lm-evaluation-harness**（EleutherAI，HF Open LLM Leaderboard 后端，model eval 标杆）专注单轮 logprob/生成；**Inspect AI**（UK AISI，2024-05 开源）凭借 Docker/k8s/Proxmox sandbox + 200+ inspect_evals 成为 Agent eval 王者，**METR 在 2026-01 完成从自研 Vivaria 到 Inspect 的迁移**标志生态收敛；**HELM**（Stanford CRFM）坚持 7 维度全景评测；**METR Time Horizon** 提供"50% 成功率任务时长每 7 个月翻一番"的可外推度量。Agent Eval 与 Model Eval 在评估对象、统计设计、ground truth 假设上根本不同——前者必须多 trial、关注轨迹、容忍多条有效路径。2026 业界共识：**先固定 production harness 再换模型测**，把 sandbox 类型、资源配额、scaffold 版本写入 eval 报告。

**Cheat Sheet**：
- **Harness 四原语**：Task Loader（加载样本+组装 prompt）→ Solver（如何作答）→ Sandbox（隔离工具执行）→ Scorer（如何判分）
- **lm-eval-harness**：YAML 任务定义、100+ providers、HF Open LLM Leaderboard 后端 → **model eval 标杆**
- **Inspect AI**：dataset→Task→Solver→Scorer、Docker/k8s/Proxmox sandbox、Agent Bridge 接 Claude Code/Codex CLI → **agent eval 事实标准**
- **HELM**：7 metrics（accuracy/calibration/robustness/fairness/bias/toxicity/efficiency）、2025-03 Capabilities 用 mean score 取代 mean win rate
- **METR**：Time Horizon 范式（50% time horizon 每 7 个月翻倍）+ MALT 数据集（reward hacking/sandbagging 行为样本）
- **Contamination 危机**：SWE-bench Verified 2026-02 OpenAI 官宣污染、59.4% 最难题测试有缺陷 → 转向 SWE-bench Pro/Live



<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：评估, AI100 · 考察点：Evaluation</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：**Eval Harness（评测引擎）≠ Benchmark（数据集）**。Benchmark 是题库与评分标准（SWE-bench、GAIA、τ²-bench），Eval Harness 是"考场"——由 **Task Loader + Sandbox + Scorer + 日志** 四原语组成的运行时框架。Inspect AI 把这套架构显式拆为 `dataset → Task → Solver → Scorer` 四个独立组件，让"同 Benchmark 在不同 Harness 跑出 20+ 分差距"成为必然而非 bug。</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：误区："Eval Harness 和 Benchmark 是一回事" · 误区："SWE-bench 80% 就是 SOTA" · 误区："Inspect AI 是 UK 政府的玩具，主流不会用"</div>
</div>

## 详细解析

### Harness vs Benchmark：必须先理清的三层架构

"benchmark"在日常对话中常被混用，但 Inspect AI 的设计明确把评测拆为四个独立原语：

```
Benchmark（题库 + 评分标准）
    │
    ▼
┌─────────────────────────────────────────────┐
│              Eval Harness（考场）            │
│                                             │
│  ┌──────────────┐    ┌──────────────────┐  │
│  │ Task Loader  │───►│ Solver           │  │
│  │ (加载样本)    │    │ (如何让模型作答)  │  │
│  │ + prompt组装 │    │ (ReAct/MultiAgent)│  │
│  └──────────────┘    └────────┬─────────┘  │
│                               │             │
│                               ▼             │
│                      ┌────────────────┐    │
│                      │ Sandbox        │    │
│                      │ (Docker/k8s/   │    │
│                      │  Proxmox/Local)│    │
│                      └────────┬───────┘    │
│                               │             │
│                               ▼             │
│                      ┌────────────────┐    │
│                      │ Scorer         │    │
│                      │ (精确匹配/单元 │    │
│                      │  测试/LLM Judge│    │
│                      │  /DB diff)     │    │
│                      └────────────────┘    │
└─────────────────────────────────────────────┘
```

| 组件 | 职责 | 代表实现 |
|------|------|---------|
| **Task Loader** | 从数据集加载样本、组装 prompt、few-shot 注入 | lm-eval-harness 的 YAML（doc_to_text/doc_to_target/filters） |
| **Solver** | 让模型作答的 scaffold（ReAct/multi-turn critique） | Inspect AI 的 `generate → prompt → ReAct → multi_turn` 链式组合 |
| **Sandbox** | 隔离的代码执行/工具调用环境 | Docker（主流）/ k8s（大规模）/ Proxmox VM（高风险）/ Daytona/Modal/EC2 |
| **Scorer** | 评分逻辑：精确匹配、单元测试、LLM Judge、DB 状态比对 | SWE-bench fail→pass 套件、τ²-bench DB diff、`model_graded_qa` 多 judge 投票 |

**关键洞见**："Solver 负责怎么答、Scorer 负责怎么判分、Sandbox 是 Solver 调用工具时的隔离层"——这种显式分离让"同 SWE-bench Verified 不同 harness 跑出不同分数"既是必然也是合理。Anthropic Terminal-Bench 2.0 在同模型、同任务、仅变更 pod 资源预算下实测 **5.8% 任务因 pod/infrastructure 错误失败，p<0.01**。

### lm-evaluation-harness：model eval 行业标杆

**EleutherAI lm-evaluation-harness**（2021 开源）是 LLM 评测的 de-facto 标准，**Hugging Face Open LLM Leaderboard 的后端就是它**。

```yaml
# 典型任务定义（mmlu_abstract_algebra.yaml）
task: mmlu_abstract_algebra
dataset_path: hails/mmlu_no_train
dataset_name: abstract_algebra
output_type: multiple_choice
doc_to_text: "{{question.strip()}}\nA. {{choices[0]}}\nB. {{choices[1]}}\nC. {{choices[2]}}\nD. {{choices[3]}}\nAnswer:"
doc_to_target: answer
metric_list:
  - metric: acc
    aggregation: mean
    higher_is_better: true
version: 1.0
```

```bash
# 单条命令评测任意 provider
lm_eval --model hf --model_args pretrained=meta-llama/Llama-3-70B \
        --tasks mmlu,gsm8k,humaneval \
        --batch_size auto \
        --use_cache cache/ \
        --log_samples --output_path results/
```

**核心特性**：
- **60+ 标准学术 benchmark**，数百个子任务变体
- **统一后端**：HF transformers / vLLM / SGLang / NVIDIA NeMo / OpenAI / Anthropic / LiteLLM **100+ providers**
- **YAML 任务定义**：`doc_to_text` / `doc_to_target` / `filters` / `metric_list` 解耦，任意人都能在不写 Python 的情况下贡献新任务
- **输出类型**：`generate_until` / `loglikelihood` / `loglikelihood_rolling` / `multiple_choice`，对应不同评分语义
- **可复现性机制**：`--use_cache` 跳过已评样本、`--log_samples` 保留完整响应、`--check_integrity` 校验任务数据、任务 version 字段防止 silent breaking change

**局限**：核心定位是 **model eval**（单轮 logprob/生成 + 评分），对 Agent 场景（多轮工具调用、sandbox、轨迹）支持薄弱——这正是 2025 年 Inspect AI 崛起的根本原因。

### Inspect AI：Agent 时代的 Harness 王者

UK AI Security Institute (AISI) 于 2024-05 开源 Inspect AI，2025-2026 已成 Agent 评测领域事实标准。**METR 在 2026-01 Time Horizon 1.1 发布时完成从自研 Vivaria 到 Inspect 的迁移**是行业最强信号。

```python
# Inspect AI 的核心抽象：dataset → Task → Solver → Scorer
from inspect_ai import Task, task, eval
from inspect_ai.dataset import Sample
from inspect_ai.solver import generate, system_message, use_tools
from inspect_ai.scorer import includes, model_graded_qa
from inspect_ai.tool import bash, python

@task
def swe_bench_lite():
    return Task(
        dataset=swe_bench_dataset(),
        solver=[
            system_message("You are an expert software engineer..."),
            use_tools([bash(timeout=180), python(timeout=180)]),
            generate(max_messages=50),  # ReAct loop
        ],
        scorer=swe_bench_scorer(),       # fail→pass 测试套件
        sandbox=("docker", "compose.yaml"),  # 每 sample 独立 sandbox
    )

# 单条命令在任意模型上跑
# inspect eval swe_bench_lite.py --model anthropic/claude-opus-4-7
```

**架构特性**：

| 维度 | 实现 |
|------|------|
| **Solver 库** | ReAct / Multi-Agent / Human Agent / **Agent Bridge**（可桥接 LangChain、OpenAI Agents SDK、Pydantic AI、Claude Code、Codex CLI） |
| **Sandbox** | 内置 `docker`/`local`，扩展支持 `k8s` / `proxmox` / `daytona` / `modal` / `ec2`，每 sample 独立实例避免交叉污染 |
| **Scorer** | 可访问 sandbox 文件/命令验证最终状态，支持 `model_graded_qa` 多 judge 投票 |
| **inspect_evals 仓库** | 社区贡献的 GAIA / SWE-bench / Cybench / GDM CTF / SciCode 等 **200+ agent benchmark**，50+ 贡献者 |
| **资源管理** | `max_sandboxes = 2 × cpu_count`、`max_subprocesses = cpu_count`、`max_samples = max_connections + 1`——反映了 **sandbox 是 Agent eval 的并发瓶颈** |

**METR 为什么弃 Vivaria 投 Inspect**：
- Vivaria 是 TS+React+PostgreSQL 全栈系统但闭塞
- Inspect 是开源标准、社区 200+ 评测、跨机构互通
- 2026-01 METR Time Horizon 1.1 数据全部用 Inspect 重新跑过，**验证了 7 个月翻倍趋势在迁移后仍成立**

### HELM：多维度评估的传统

Stanford CRFM 2022 提出 **HELM（Holistic Evaluation of Language Models）**，是"holistic"评估的奠基者，2025 年继续主导多维度评估议程。

**经典 HELM 的 7 大度量**（每个 scenario 同时测）：

| 维度 | 含义 |
|------|------|
| Accuracy | 准确率 |
| Calibration | 置信度校准 |
| Robustness | 对扰动的鲁棒性 |
| Fairness | 跨群体公平性 |
| Bias | 偏差 |
| Toxicity | 毒性 |
| Efficiency | token/时延/成本 |

**HELM Capabilities（2025-03 更新）** 引入 5 大能力切面：MMLU-Pro / GPQA / IFEval / WildBench / Omni-MATH，每个 scenario 下采样 1000 实例保持一致性。**排序用 mean score 取代 mean win rate**（win rate 对小幅波动太敏感）。

**HELM 的可复现性铁律**：
- 公开所有 raw inputs 和 model outputs（不只是分数）
- Module 化 toolkit 支持扩展新 scenario/model/metric
- W3C 风格的开放规范——任何研究者都能重跑

**HELM 系列扩展**：HEIM（Text-to-Image）/ MedHELM（医疗）/ HELMET（long-context）/ SEA-HELM（东南亚语言）。

### METR Time Horizon：超越准确率的进步度量

**METR（Model Evaluation & Threat Research）** 是 Beth Barnes 创立的非营利评测机构，OpenAI o3/o4-mini/GPT-5.1-Codex-Max、Anthropic Claude 系统卡片中的能力评估都由 METR 出手。

**Time Horizon 范式**（2025-03 突破性论文）：
- **度量方式**：找出 AI agent 能以 ≥50% 成功率独立完成的任务时长（用人类完成中位时间标定）
- **核心发现**：**过去 6 年，50% time horizon 每 7 个月翻一番**（约 196 天）
- **外推**：2030 年左右模型能独立完成 1 个月（167 工时）任务
- **数据集**：169 个 task，覆盖 HCAST、RE-Bench、SWE-Bench Verified

**实测数据**（GPT-5.1-Codex-Max，2025-11）：
- 50% time horizon ≈ **2 小时 40 分钟**（CI: 75min - 5h50min）
- 80% time horizon ≈ 30 分钟
- 沿着 7 个月翻倍轨迹

**为什么这个范式重要**：
1. **天然抗 contamination**：任务时长是连续度量，模型背题不会让"30 分钟任务变成 5 小时任务"
2. **抗 saturation**：MMLU、SWE-bench 都会饱和（>95% 后失去区分度），Time Horizon 是 unbounded 度量
3. **可外推**：连续指数趋势给 capability forecast 提供量化依据

**MALT 数据集（2025-10）** 是 METR 的另一贡献：手动审核的 agent 行为轨迹，包含 reward hacking / sandbagging / evaluation awareness 等"威胁评测完整性"的行为样本——为"agent 知道自己在被评测时会装傻"这种 meta-eval 问题提供数据基础。

### Sandbox 工程权衡矩阵

Sandbox 同时承担两个职责：(1) **安全**——隔离 Agent 可能产生的恶意操作；(2) **可复现性**——固定环境消除"我机器能跑你机器不行"。

| Sandbox 类型 | 隔离强度 | 启动成本 | 适用场景 |
|------------|---------|---------|---------|
| `local` | 无 | 0 | 信任的题目（纯算术、文本生成） |
| `docker` | 进程级 | ~1s | 主流：代码执行、shell 工具（SWE-bench、Terminal-Bench） |
| `k8s` | 进程级 + 资源调度 | ~5-30s | 大规模并行（WebArena 多服务 compose） |
| `proxmox` / VM | 内核级 | 分钟级 | 高风险评测（Cyber CTF、sandbox-escape benchmark） |

**WebArena 的可复现性设计**是教科书级范例：5 个 Docker 服务（电商/CMS/GitLab/论坛/地图）打包 AMI，用户拉取镜像后可完全 reset 到初始状态；2025 ServiceNow 推出 **WebArena-Verified**：镜像体积压缩 92%、删除 LLM-as-judge 改为确定性评分、提供 258 题 Hard 子集降低评测成本。

**反面教材**：2025 年 Zhu et al. 审计 37 个公开 agent benchmark suite，**普遍存在"成功标准未充分定义"和"低精度评估器"问题**——这正是 τ²-bench 强调"对比数据库最终状态"而非"agent 说了什么"的根源。

### Agent Eval vs Model Eval 的根本差异

| 维度 | Model Eval | Agent Eval |
|------|-----------|------------|
| **评估对象** | 单 prompt → 单 response | 多轮 workflow + 工具 + 环境 |
| **关注点** | 输出质量（正确性、流畅度） | 任务完成 + 推理链 + 工具使用 + 错误恢复 |
| **评分对象** | 最终答案 | 轨迹（trajectory） + 最终状态 |
| **非确定性来源** | 仅采样温度 | 采样 + 工具执行 + 环境响应 + 时序 |
| **Ground truth** | 参考答案（单一） | **多条有效轨迹同时存在** |
| **统计设计** | 单次足够（high pass@1） | 必须多 trial（pass@k 与 pass^k 双侧） |
| **典型基准** | MMLU / GSM8K / HumanEval | SWE-bench / GAIA / τ²-bench / WebArena |

**Anthropic 推荐的四个独立评估维度**（详见 077 持续评估流水线）：
1. **Outcomes**——最终环境状态（"DB 里是否真有这条预订记录"，不是"agent 说了什么"）
2. **Transcripts**——完整轨迹（turn 数、token 用量、行为 rubric）
3. **Tool Calls**——特定工具是否按合适参数调用；但**别过度规定调用顺序**——"grade what agent produced, not the path it took"
4. **Cost & Latency**——`n_total_tokens` / `time_to_first_token` 与正确性并列报告

**轨迹评估的现实困难**（arXiv 2510.02837）：Trajectory-opaque eval（只看终态）**漏掉 44% 的安全违规和 13% 的鲁棒性失败**。解法：hybrid pipeline = outcome check + trajectory check + tool sequence check 联合判定。

### Contamination 危机与 Leaderboard 信任崩塌

**2025-2026 SWE-bench Verified 污染审计**（OpenAI 2026-02 主导）：
- 测试的所有 frontier 模型（GPT-5.2、Claude Opus 4.5、Gemini 3 Flash）都能**逐字复现某些 Verified 任务的 gold patch**
- **59.4% 的最难未解题** 被发现测试用例有缺陷
- 部分模型在"只给文件结构、不给 issue 描述"时仍能识别要修改的正确文件——强烈暗示训练集见过仓库结构
- **OpenAI 官方宣布停报 SWE-bench Verified**，转向 SWE-bench Pro

**Scale AI SWE-bench Pro 的应对**：1865 个多语言任务、严格 contamination 控制 → **Verified 上 80%+ 的模型在 Pro 上只能拿 46-57%**，22pp 的 scaffold-induced 差距。

**2025 contamination 检测技术**：

| 方法 | 原理 | 局限 |
|------|------|------|
| Watermarking（arXiv 2502.17259） | 用 Llama-3 instruct 重写题目嵌入红/绿 list 水印，5% 污染即在 p<10⁻³ 显著性下检出 | 只能检出"重写后被训练"的情形 |
| Question variant testing | 生成变体题，检查模型在变体上是否退化 | reformulated 题就足以提升原题分数，相关性不强 |
| Loss-based detection | 比较 train/test 上的 loss 分布 | 在 LRM（推理模型）上失效——RL stage 会掩盖 SFT 阶段污染（arXiv 2510.02386） |

**实操建议**：
- 公开 benchmark 用于初筛，不作为最终决策
- 必须有"训练截止日期之后"的私有评测集
- 关注**动态 benchmark**（SWE-MERA 持续从最新 GitHub Issue 收题、LiveCodeBench 每月更新）

### 选型决策树

```
你的场景是什么？
│
├── 学术 LLM benchmark（单轮 logprob/生成）
│   → lm-evaluation-harness
│   → HF Open LLM Leaderboard 后端，60+ 任务、100+ providers
│
├── Agent 多轮 + sandbox + 工具
│   → Inspect AI（事实标准）
│   → 200+ inspect_evals、可桥接所有主流 Agent SDK
│
├── 多维度全景（含 bias/toxicity/efficiency）
│   → HELM（Stanford CRFM）
│   → 7 metrics + 2025-03 Capabilities 5 切面
│
├── Pre-deployment safety eval / 能力外推
│   → METR 范式 + Inspect
│   → Time Horizon + MALT dataset
│
└── 商业评测平台（trace + UI + 协作）
    → 见 075（Ragas / LangSmith / Braintrust / Langfuse）
```

## 常见误区 / 面试追问

1. **误区："Eval Harness 和 Benchmark 是一回事"** — 这是 Agent 评测领域最大的概念混淆。Benchmark = 题库 + 评分标准（SWE-bench Verified、GAIA），Harness = 运行时框架（Inspect AI、lm-eval-harness）。**同 benchmark 在不同 harness 上跑出 20+ 分差距是工程常态而非 bug**——这是 Inspect AI 显式拆四原语的根本原因。

2. **误区："SWE-bench 80% 就是 SOTA"** — 2026-02 后这个说法已经过时。OpenAI 官方宣布 SWE-bench Verified contamination 严重（59.4% 最难题测试有缺陷），转向 SWE-bench Pro。Verified 上 80%+ 的模型在 Pro 上只能拿 46-57%。引用 SOTA 时必须问"哪个 harness / 哪个版本 / 是否私有 holdout"。

3. **误区："Inspect AI 是 UK 政府的玩具，主流不会用"** — 完全错误。**METR 在 2026-01 Time Horizon 1.1 发布时弃用自研 Vivaria 全面迁移到 Inspect**，标志生态收敛。200+ inspect_evals、50+ 贡献者、Agent Bridge 接 Claude Code/Codex CLI——它已是 Agent eval 事实标准。

4. **追问："为什么 lm-eval-harness 对 Agent 评测无能为力？"** — 它的核心抽象是"单轮 logprob/生成 → 匹配"，没有 sandbox 概念、没有 multi-turn solver、没有轨迹 scorer。Agent 需要的"调用 bash → 看输出 → 决定下一步"这种闭环只能由 Inspect AI 的 Solver 链或 Anthropic Harbor 这类专用 harness 提供。lm-eval-harness 即使加 OpenAI provider 也只是"包了一层 API 调用"，缺所有 Agent 必需原语。

5. **追问："如何设计一个 provider-agnostic 的 harness 给团队选模型？"** —
   - **第 1 层**：先固定 production harness（Inspect AI Task 定义），只让模型变化
   - **第 2 层**：sandbox 类型 / 资源配额 / scaffold 版本 / retry 策略 **写入 eval 报告**，这些都是结果的一部分
   - **第 3 层**：报告 pass@1（多 trial 估计）+ pass@k（乐观上界）+ pass^k（悲观下界）刻画完整能力边界
   - **第 4 层**：capability eval（目标低 pass 率，"待爬的山"）和 regression eval（目标 ≈100%，防退步）分离

6. **追问："Sandbox 类型怎么选？"** —
   - **代码生成 + shell 命令**：Docker（启动 ~1s，主流）
   - **大规模并行（>100 sample 同时跑）**：k8s（资源调度）
   - **高风险评测（Cyber CTF、sandbox escape）**：Proxmox / VM（内核级隔离）
   - **纯文本生成**：local 即可（信任题目）
   - 关键准则：Inspect AI 默认 `max_sandboxes = 2 × cpu_count`，sandbox 是 Agent eval 真正的并发瓶颈

7. **追问："如何应对 Benchmark Contamination？"** —
   - **不依赖单一公开 benchmark**：必须有"训练截止日期之后"的私有 holdout
   - **动态 benchmark**：SWE-MERA（持续从 GitHub Issue 收题）、LiveCodeBench（每月更新）
   - **Time Horizon 范式**：天然抗污染（任务时长是连续度量）
   - **Watermarking 检测**：arXiv 2502.17259，5% 污染即可在 p<10⁻³ 显著性下检出
   - 警惕信号：模型在"只给文件结构、不给 issue 描述"时仍能定位正确文件——说明训练集见过仓库结构

## 参考资料

- [EleutherAI lm-evaluation-harness（GitHub）](https://github.com/EleutherAI/lm-evaluation-harness) — 行业 model eval 标杆，HF Open LLM Leaderboard 后端
- [Inspect AI 官方站（UK AISI）](https://inspect.aisi.org.uk/) — 2025-2026 agent eval 事实标准
- [Inspect AI Sandboxing 指南](https://inspect.aisi.org.uk/sandboxing.html) — Docker/k8s/Proxmox 三套 sandbox 战略
- [Inspect Evals 仓库](https://github.com/UKGovernmentBEIS/inspect_evals) — 200+ 社区贡献评测
- [HELM 仓库（Stanford CRFM）](https://github.com/stanford-crfm/helm) — Holistic Evaluation 框架
- [HELM Capabilities 2025-03 更新](https://crfm.stanford.edu/2025/03/20/helm-capabilities.html) — mean score 取代 mean win rate
- [METR — Measuring AI Ability to Complete Long Tasks（2025-03）](https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/) — Time Horizon 范式提出
- [METR Time Horizon 1.1（2026-01）](https://metr.org/blog/2026-1-29-time-horizon-1-1/) — Inspect 迁移后复现
- [Demystifying Evals for AI Agents — Anthropic](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) — 四维度评分、capability vs regression
- [Agent Benchmarks Measure the Harness, Not the Model（Focused Labs）](https://focused.io/lab/agent-benchmarks-measure-the-harness) — Terminal-Bench 2.0 实证 5.8pp 差距
- [SWE-bench Pro Leaderboard（2026）](https://www.morphllm.com/swe-bench-pro) — Scale AI 抗污染基准
- [Detecting Benchmark Contamination Through Watermarking（arXiv 2502.17259）](https://arxiv.org/abs/2502.17259) — 2025 watermarking 检测
- [Beyond the Final Answer: Evaluating Reasoning Trajectories（arXiv 2510.02837）](https://arxiv.org/pdf/2510.02837) — Trajectory-opaque eval 漏 44% 安全违规
</div>
</details>

</div>

---

<div class="chapter-nav">

<a class="chapter-nav-link" href="../">📑 总览</a>

<a class="chapter-nav-link" href="prompt">← ✍️ 提示工程</a>

<a class="chapter-nav-link chapter-nav-next" href="safety">🛡️ 安全对齐 →</a>

</div>
