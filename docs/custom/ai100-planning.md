---
custom: true
partTitle: AI100 · 规划与推理
partColor: #f59e0b
---

<div class="part-hero custom-hero" style="--part-color: #f59e0b">

# 🧩 AI100 · 规划与推理

<p class="part-desc">CoT · ToT · Plan-and-Solve · RL · 共 9 题</p>
<span class="part-round custom-tag">我的题库</span>

</div>

<div class="custom-hint">

📝 **本分类源文件**：`custom/ai100-planning/` · 新增题目后运行 `npm run prepare` 即可刷新。

</div>

<div class="question-card compact-card" id="049-cot-and-tot-1">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">详细解析</span></h2>

### 一、Chain-of-Thought (CoT)

#### CoT 的工作原理

```
标准 Prompting（直接回答）：
Q: 小明有 5 个苹果，给了小红 2 个，又买了 3 个，现在有几个？
A: 6

CoT Prompting（逐步推理）：
Q: 小明有 5 个苹果，给了小红 2 个，又买了 3 个，现在有几个？
A: 让我一步步分析：
   1. 小明初始有 5 个苹果
   2. 给了小红 2 个：5 - 2 = 3
   3. 又买了 3 个：3 + 3 = 6
   所以小明现在有 6 个苹果。
```

看似结果一样，但在更复杂的问题上，有中间步骤的推理会大幅减少错误。

#### Few-shot CoT

在 prompt 中提供带推理步骤的示例：

```python
few_shot_cot_prompt = """
问题：一个商店有 15 箱苹果，每箱 20 个。卖掉了 120 个，还剩多少？
推理：
1. 总共有 15 × 20 = 300 个苹果
2. 卖掉了 120 个
3. 剩余 300 - 120 = 180 个
答案：180 个

问题：一辆车以 60km/h 的速度行驶了 2.5 小时，然后以 80km/h 行驶了 1.5 小时。总距离是多少？
推理：
1. 第一段距离：60 × 2.5 = 150 km
2. 第二段距离：80 × 1.5 = 120 km
3. 总距离：150 + 120 = 270 km
答案：270 km

问题：{user_question}
推理：
"""
```

#### Zero-shot CoT

不需要示例，只需在 prompt 末尾加一句话：

```python
# Zero-shot CoT：最简单的形式
prompt = f"""
{user_question}

Let's think step by step.
"""

# 变体
prompts = [
    f"{question}\nLet's think step by step.",
    f"{question}\nLet's work this out in a step by step way to be sure we have the right answer.",
    f"{question}\n请一步步分析这个问题。",
]
```

Kojima et al. (2022) 发现这个简单的添加将 MultiArith 准确率从 17.7% 提升到 78.7%。

#### 为什么 CoT 有效？

```python
reasons_cot_works = {
    "问题分解": (
        "复杂问题被拆分为更小的子问题，"
        "每个子问题对 LLM 来说更容易处理"
    ),
    "更多推理计算": (
        "生成中间步骤 = 更多的 token = 更多的计算。"
        "模型获得了更多'思考时间'来处理信息"
    ),
    "减少跳跃式错误": (
        "直接给答案容易跳过关键逻辑步骤，"
        "CoT 强制模型不跳步"
    ),
    "自我纠正机会": (
        "中间步骤产生的错误可能在后续步骤中被发现和修正"
    ),
    "透明性与可调试性": (
        "推理过程可见 → 可以定位错误发生在哪一步"
    ),
}
```

#### CoT 在 Agent 系统中的应用

```python
# ReAct 模式就是 CoT 的 Agent 化应用
react_prompt = """
用户问题：{question}

请按以下格式推理和行动：

Thought: 我需要思考下一步做什么
Action: 使用工具 [工具名]
Action Input: 工具输入参数
Observation: 工具返回结果
... (可以重复多次)
Thought: 我现在有了足够的信息来回答
Final Answer: 最终答案
"""

# CoT 让 Agent 的决策过程可解释
# 每个 Thought 步骤都展示了 Agent 为什么选择这个工具
```

#### CoT 的变体与扩展

```
CoT (Chain-of-Thought)
 ├── Few-shot CoT：提供示例
 ├── Zero-shot CoT："Let's think step by step"
 ├── Self-Consistency：多次采样 + 多数投票
 │    (同一问题生成多条推理链，取最常见答案)
 ├── Tree-of-Thought (ToT)：探索多条推理路径
 │    (每步生成多个候选，评估后选择最优)
 ├── Graph-of-Thought (GoT)：非线性推理图
 └── Auto-CoT：自动生成推理示例
```

#### Self-Consistency：CoT 的增强版

```python
async def self_consistency(question, num_samples=5):
    """多次采样 + 多数投票"""
    answers = []
    for _ in range(num_samples):
        # 每次独立生成一条推理链（temperature > 0）
        response = await llm.invoke(
            f"{question}\nLet's think step by step.",
            temperature=0.7
        )
        answer = extract_final_answer(response)
        answers.append(answer)

    # 多数投票
    most_common = Counter(answers).most_common(1)[0][0]
    return most_common
```

#### CoT 的局限性

| 局限 | 说明 |
|------|------|
| 模型规模要求 | Wei et al. 2022 原论文中 CoT 在 PaLM 540B 等大模型上才出现质变；但 2025-2026 蒸馏技术已极大下放门槛：DeepSeek-R1 完整开源了 **1.5B / 7B / 8B / 14B / 32B / 70B** 六个 SKU 的蒸馏推理模型，1.5B 也能跑出可观的 CoT；"100B+ 门槛"在 2026 已不再适用，但**未经蒸馏的小模型**仍易产生错误推理链 |
| 成本增加 | 中间步骤消耗更多 output token |
| 推理链质量不保证 | 模型可能生成"看似合理实则错误"的推理步骤 |
| 不适合所有任务 | 简单任务加 CoT 反而增加不必要的复杂度 |
| 可被攻击 | 对抗样本可以诱导错误的推理链 |

### 二、Tree-of-Thought (ToT)

#### CoT 与 ToT 的核心区别

```
Chain-of-Thought (线性)：
  思路 A → 步骤 1 → 步骤 2 → 步骤 3 → 答案
  （一条路走到底，不回头）

Tree-of-Thought (树形)：
  问题
  ├── 思路 A → 评估: 0.8 → 继续探索
  │   ├── A1 → 评估: 0.9 → ★ 最优
  │   └── A2 → 评估: 0.3 → 剪枝 ✂
  ├── 思路 B → 评估: 0.5 → 继续探索
  │   └── B1 → 评估: 0.2 → 剪枝 ✂
  └── 思路 C → 评估: 0.1 → 剪枝 ✂
```

#### ToT 的工作原理

```python
class TreeOfThoughts:
    """ToT 的核心实现：生成、评估、搜索"""

    async def solve(self, problem, max_depth=3, breadth=3):
        # 初始化根节点
        root = ThoughtNode(state=problem, depth=0)

        if self.search_strategy == "BFS":
            return await self.bfs(root, max_depth, breadth)
        else:
            return await self.dfs(root, max_depth, breadth)

    async def bfs(self, root, max_depth, breadth):
        """广度优先搜索：每层保留最优的 k 个节点"""
        current_level = [root]

        for depth in range(max_depth):
            candidates = []
            for node in current_level:
                # 1. 生成：每个节点生成多个候选思路
                thoughts = await self.generate_thoughts(node, n=breadth)
                # 2. 评估：对每个思路打分
                for thought in thoughts:
                    score = await self.evaluate(thought)
                    thought.score = score
                    candidates.append(thought)

            # 3. 选择：保留得分最高的 k 个
            current_level = sorted(candidates, key=lambda x: x.score, reverse=True)[:breadth]

        return current_level[0]  # 返回最优方案

    async def evaluate(self, thought):
        """用 LLM 评估当前思路的可行性"""
        response = await self.llm.invoke(f"""
        评估以下问题解决思路的可行性（1-10分）：
        问题：{thought.root_problem}
        当前思路：{thought.reasoning_path}

        评分标准：
        - 逻辑是否正确？
        - 是否有可能达到最终答案？
        - 是否存在明显矛盾？
        """)
        return float(response)
```

#### 两种搜索策略对比

```python
# BFS（广度优先）：适合解空间较浅但较宽的问题
# - Game of 24：每步可选的运算组合多
# - 创意写作：需要比较多种风格方向

# DFS（深度优先）：适合解空间较深的问题
# - 数独求解：需要深入推导
# - 代码调试：需要沿一条思路深入追踪
# - 支持回溯：发现死路可以退回上一步

bfs_config = {"breadth": 5, "depth": 2}   # 宽搜索，浅深度
dfs_config = {"breadth": 2, "depth": 5}   # 窄搜索，深探索
```

#### 实际应用中的 ToT 简化版

```python
# 生产环境中的 ToT 通常不需要完整实现
# 用 Prompt 模拟即可

tot_prompt = """
问题：{problem}

请用以下方式推理：
1. 生成 3 种不同的解题思路
2. 对每种思路评估可行性（1-10分）
3. 选择最佳思路，展开详细推理
4. 如果遇到矛盾，回到步骤1尝试其他方向

思路 1：
"""

# 这种 "Prompt-based ToT" 比完整 ToT 便宜很多
# 虽然效果不如算法级 ToT，但对大多数场景够用
```

### 三、对比分析与选择指南

#### 关键性能对比

```
任务：Game of 24（用四个数字通过加减乘除得到 24）
┌────────────────────┬───────────┬──────────┐
│ 方法               │ 成功率    │ LLM 调用  │
├────────────────────┼───────────┼──────────┤
│ Standard (IO)      │ 7.3%      │ 1        │
│ CoT                │ 4.0%      │ 1        │  ← CoT 的线性推理在需要回溯搜索的问题上反而成为限制
│ CoT + SC (k=100)   │ 9.0%      │ 100      │
│ ToT (BFS, b=5)     │ 74.0%     │ ~O(b^d)  │
└────────────────────┴───────────┴──────────┘

任务：创意写作（Coherent Passage）
┌────────────────────┬───────────┐
│ 方法               │ 一致性分   │
├────────────────────┼───────────┤
│ Standard (IO)      │ 6.19      │
│ CoT                │ 6.93      │
│ ToT                │ 7.56      │
└────────────────────┴───────────┘
```

#### 何时选择哪种？

```python
decision_guide = {
    "使用 CoT": [
        "数学计算：有明确的解题步骤（算术、代数）",
        "逻辑推理：前提 → 结论的线性推导",
        "信息提取：从文本中逐步提取关键信息",
        "Agent 的工具选择决策（ReAct 的 Thought 步骤）",
        "代码调试（逐步分析错误原因）",
        "成本敏感：每次只需 1 次 LLM 调用",
        "实时应用：需要低延迟响应",
    ],
    "使用 ToT": [
        "组合优化：如 Game of 24、数独",
        "创意任务：需要探索多种方案的写作、设计",
        "规划问题：需要比较不同路径的决策",
        "约束满足：多个约束需要同时满足",
        "准确率优先：愿意用更多计算换取更好结果",
    ],
    "使用 CoT + Self-Consistency": [
        "需要比 CoT 更好的准确率",
        "但 ToT 的成本太高",
        "问题有明确的最终答案（可以投票）",
    ],
    "不需要 CoT/ToT": [
        "简单的事实查询",
        "翻译和改写",
        "情感分析等分类任务",
        "小模型（<10B 参数，除非经过蒸馏训练）",
    ],
}
```

#### 方法谱系总结

```
简单 ←─────────────────────────────────→ 复杂
成本低                                    成本高

IO → Zero-shot CoT → Few-shot CoT → Self-Consistency → ToT → GoT
 │         │               │              │              │     │
 │    "逐步思考"      提供示例       多次采样+投票    树搜索  图搜索
 │                                                     │
 │                                              包含评估+回溯
 1次调用    1次             1次           k次        O(b^d)次
```

</div>

---

<div class="question-card compact-card" id="049-cot-and-tot-2">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">常见误区 / 面试追问</span></h2>

1. **误区："CoT 只是让模型输出更长"** — CoT 的核心不是长度，而是结构化的中间推理步骤。重要的是推理的质量而非数量。一条简洁但正确的推理链比冗长但偏题的推理更有效。

2. **误区："Zero-shot CoT 总是有效的"** — 只在足够大的模型上有效。小模型使用 CoT 反而会因为生成错误的推理链而降低准确率。另外，对于简单任务，CoT 增加成本但不提升质量。

3. **误区："ToT 总是比 CoT 好"** — 在简单任务上 ToT 不仅成本高，甚至可能因为过度思考而降低准确率。CoT 在 GSM8K 等标准数学推理上已经足够好。ToT 的优势主要体现在需要全局搜索和回溯的问题上。

4. **误区："ToT 就是多次调用 CoT"** — ToT 的关键不是"多次"，而是"结构化搜索"——包括生成候选、评估打分、剪枝和回溯。Self-Consistency 也是多次调用但没有搜索结构。

5. **追问："CoT 和 Reasoning Models（o1/o3/R1）是什么关系？"** — Reasoning Models 将 CoT 内化到了模型的推理过程中（internal chain-of-thought），不需要用户显式提示。模型自动生成"思考 token"，然后再输出答案。本质上是 CoT 的模型级实现。同样，Reasoning Model 也将类似 ToT 的搜索和回溯内化到模型内部——ToT 是外部搜索（在 API 层面实现），Reasoning Model 是内部搜索（在模型训练层面实现）。

6. **追问："Self-Consistency 比 CoT 好多少？"** — Self-Consistency 通过多次采样 + 投票显著提升准确率，特别是在数学推理上。但代价是成本增加 N 倍（N 次 LLM 调用）。适合准确率要求高且成本不敏感的场景。

7. **追问："Graph-of-Thought 比 ToT 好在哪里？"** — GoT 允许非线性推理——不同推理分支可以合并、交叉引用。比如"思路 A 的结论可以帮助思路 B"。但实现复杂度更高，实际应用较少。

</div>

---

<div class="question-card compact-card" id="049-cot-and-tot-3">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">参考资料</span></h2>

- [Chain-of-Thought Prompting Elicits Reasoning in Large Language Models (arXiv, Wei et al.)](https://arxiv.org/abs/2201.11903)
- [Tree of Thoughts: Deliberate Problem Solving with LLMs (arXiv, Yao et al.)](https://arxiv.org/pdf/2305.10601)
- [What is Chain of Thought Prompting? (IBM)](https://www.ibm.com/think/topics/chain-of-thoughts)
- [What is Tree Of Thoughts Prompting? (IBM)](https://www.ibm.com/think/topics/tree-of-thoughts)
- [Chain-of-Thought Prompting (Prompt Engineering Guide)](https://www.promptingguide.ai/techniques/cot)
- [Tree of Thoughts (ToT) - Prompt Engineering Guide](https://www.promptingguide.ai/techniques/tot)
- [Chain-of-Thought Prompting: Step-by-Step Reasoning with LLMs (DataCamp)](https://www.datacamp.com/tutorial/chain-of-thought-prompting)
- [Chain-of-Thought Prompting Guide (PromptHub)](https://www.prompthub.us/blog/chain-of-thought-prompting-guide)
- [Something-of-Thought in LLM Prompting: An Overview (Towards Data Science)](https://towardsdatascience.com/something-of-thought-in-llm-prompting-an-overview-of-structured-llm-reasoning-70302752b390/)
- [Demystifying Chains, Trees, and Graphs of Thoughts (arXiv)](https://arxiv.org/html/2401.14295v3)

</div>

---

<div class="question-card compact-card" id="050-task-decomposition-1">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">详细解析</span></h2>

### 为什么需要任务分解？

```
LLM 擅长：聚焦、范围明确的任务
LLM 不擅长：模糊、多步骤、长依赖链的复杂任务

复杂任务："帮我做一份竞品分析报告"
  ↓ 分解
子任务 1: 确定要分析的竞品列表
子任务 2: 收集每个竞品的产品特性
子任务 3: 收集市场数据和定价信息
子任务 4: 对比分析优劣势
子任务 5: 生成报告和可视化图表
```

### 方法 1：LLM 驱动分解

```python
async def llm_decompose(task: str) -> list[dict]:
    prompt = f"""
    将以下任务分解为可独立执行的子任务列表。

    任务：{task}

    要求：
    1. 每个子任务应该足够小，可以用一次 LLM 调用或一次工具调用完成
    2. 明确标注子任务间的依赖关系
    3. 标注每个子任务需要的工具

    输出 JSON 格式：
    [
        {{"id": 1, "task": "...", "depends_on": [], "tools": ["search"]}},
        {{"id": 2, "task": "...", "depends_on": [1], "tools": ["analyze"]}}
    ]
    """
    return await llm.invoke(prompt, response_format="json")

# 示例输出
subtasks = [
    {"id": 1, "task": "搜索竞品列表", "depends_on": [], "tools": ["web_search"]},
    {"id": 2, "task": "收集竞品A的数据", "depends_on": [1], "tools": ["web_search"]},
    {"id": 3, "task": "收集竞品B的数据", "depends_on": [1], "tools": ["web_search"]},
    {"id": 4, "task": "对比分析", "depends_on": [2, 3], "tools": []},
    {"id": 5, "task": "生成报告", "depends_on": [4], "tools": ["write_file"]},
]
# 注意：2 和 3 可以并行执行（都只依赖 1）
```

### 方法 2：程序化分解

```python
# 预定义的分解模板——确定性、可靠
class ReportGenerationPipeline:
    """程序化分解：代码定义固定步骤"""

    steps = [
        {"name": "data_collection", "agent": "researcher", "parallel": True},
        {"name": "data_analysis", "agent": "analyst", "parallel": False},
        {"name": "draft_writing", "agent": "writer", "parallel": False},
        {"name": "review", "agent": "reviewer", "parallel": False},
    ]

    async def execute(self, task):
        context = {"task": task}
        for step in self.steps:
            agent = self.get_agent(step["agent"])
            context[step["name"]] = await agent.execute(context)
        return context
```

### 方法 3：层级分解（HTN）

```python
class HierarchicalDecomposition:
    """递归分解：直到每个子任务可直接执行"""

    async def decompose(self, task, depth=0, max_depth=3):
        if depth >= max_depth:
            return [task]  # 达到最大深度，不再分解

        # 判断任务是否足够简单可以直接执行
        if await self.is_primitive(task):
            return [task]

        # 分解为子任务
        subtasks = await self.llm_decompose(task)

        # 递归分解每个子任务
        all_tasks = []
        for subtask in subtasks:
            decomposed = await self.decompose(subtask, depth + 1)
            all_tasks.extend(decomposed)

        return all_tasks

    async def is_primitive(self, task):
        """判断任务是否可以用一次工具调用完成"""
        response = await self.llm.invoke(
            f"这个任务能否用一次搜索/代码执行/API调用完成？"
            f"任务：{task}\n回答 yes 或 no"
        )
        return response.strip().lower() == "yes"
```

### 方法 4：自适应分解（ADaPT）

```python
class ADaPT:
    """As-Needed Decomposition and Planning with LLMs"""

    async def solve(self, task):
        # 先尝试直接执行
        result = await self.attempt(task)

        if result.success:
            return result
        else:
            # 执行失败 → 分解后重试
            subtasks = await self.decompose(task)
            results = []
            for subtask in subtasks:
                # 递归：每个子任务也先尝试直接执行
                sub_result = await self.solve(subtask)
                results.append(sub_result)
            return self.aggregate(results)

    async def attempt(self, task):
        """尝试直接用 LLM 执行任务"""
        try:
            result = await self.llm.invoke(task)
            if self.validate(result):
                return Success(result)
            else:
                return Failure("输出质量不达标")
        except Exception as e:
            return Failure(str(e))
```

**ADaPT 的优势：** 只在必要时分解，避免过度分解。在 ALFWorld 上提升 28.3%，WebShop 提升 27%，TextCraft 提升 33%。

### 子任务表示方式

```python
# 方式 1：线性序列（最简单）
linear = ["搜索", "分析", "写作", "审核"]

# 方式 2：DAG（有向无环图，支持并行）
dag = {
    "搜索A": {"depends_on": []},
    "搜索B": {"depends_on": []},       # 与搜索A并行
    "分析": {"depends_on": ["搜索A", "搜索B"]},  # 等两个搜索完成
    "报告": {"depends_on": ["分析"]},
}

# 方式 3：树形层级
tree = {
    "竞品分析": {
        "数据收集": {
            "搜索竞品A": {},
            "搜索竞品B": {},
        },
        "分析对比": {},
        "生成报告": {},
    }
}
```

### 分解粒度的权衡

```
太粗（少步骤）：
  "做一份完整的竞品分析报告"
  → LLM 无法一次完成，输出质量差

太细（多步骤）：
  "搜索关键词'竞品A产品特性'"
  "提取搜索结果第一条的标题"
  "提取搜索结果第一条的内容"
  → 100 个微步骤，协调开销巨大

适中：
  "收集竞品A的核心产品特性和定价"
  → 一次搜索 + 一次分析可完成
```

### 方法选择指南

| 方法 | 适用场景 | 可靠性 | 灵活性 |
|------|---------|--------|--------|
| LLM 驱动 | 未知/多变的任务 | 中 | 最高 |
| 程序化 | 固定流程的业务逻辑 | 最高 | 最低 |
| 层级(HTN) | 复杂但有结构的任务 | 高 | 中 |
| ADaPT | 复杂度不确定的任务 | 高 | 高 |
| TDAG | 多 Agent + 动态环境 | 中 | 高 |

</div>

---

<div class="question-card compact-card" id="050-task-decomposition-2">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">常见误区 / 面试追问</span></h2>

1. **误区："LLM 分解总是最好的"** — LLM 分解灵活但不稳定，可能产生逻辑错误或遗漏关键步骤。对于成熟的业务流程，程序化分解更可靠。最佳实践是混合：程序化定义主流程，LLM 处理需要判断力的子步骤。

2. **误区："分解越细越好"** — 过度分解增加 LLM 调用次数和协调复杂度。研究指出，小模型+精细分解可能损失大模型整体推理产生的创造性洞见。找到合适的粒度是关键。

3. **追问："如何验证分解结果的质量？"** — 检查三个方面：(1) 完整性——子任务是否覆盖了原始目标的所有方面；(2) 独立性——子任务间是否有不必要的耦合；(3) 可执行性——每个子任务是否足够具体可以执行。

4. **追问："任务分解和 Agent 编排的关系？"** — 分解产生子任务图（DAG），编排决定执行策略（顺序/并行/条件）。分解是"做什么"，编排是"怎么做"。LangGraph 等框架将两者统一：分解结果直接映射为图的节点和边。

</div>

---

<div class="question-card compact-card" id="050-task-decomposition-3">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">参考资料</span></h2>

- [LLM Agent Task Decomposition Strategies (APXML)](https://apxml.com/courses/agentic-llm-memory-architectures/chapter-4-complex-planning-tool-integration/task-decomposition-strategies)
- [ADaPT: As-Needed Decomposition and Planning with LLMs (Allen AI)](https://allenai.github.io/adaptllm/)
- [How Task Decomposition Makes AI More Affordable (Amazon Science)](https://www.amazon.science/blog/how-task-decomposition-and-smaller-llms-can-make-ai-more-affordable)
- [Systematic Decomposition of Complex LLM Tasks (arXiv)](https://arxiv.org/html/2510.07772v1)
- [Task Decomposition for Coding Agents (MGX)](https://mgx.dev/insights/task-decomposition-for-coding-agents-architectures-advancements-and-future-directions/a95f933f2c6541fc9e1fb352b429da15)

</div>

---

<div class="question-card compact-card" id="052-plan-and-solve-replanning-1">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">详细解析</span></h2>

### 一、从 Zero-shot CoT 到 Plan-and-Solve

```
Zero-shot CoT：
  Prompt: "问题... Let's think step by step."
  问题：
  1. 可能遗漏关键步骤
  2. 可能出现计算错误
  3. 模型自由发挥，推理质量不稳定

Plan-and-Solve (PS)：
  Prompt: "问题... Let's first understand the problem and
           devise a plan to solve it. Then, let's carry out
           the plan and solve the problem step by step."
  改进：
  1. 明确要求先"理解问题"
  2. 明确要求"制定计划"
  3. 然后按计划执行
```

### 二、PS vs PS+ 的 Prompt 模板

```python
# 基础 PS Prompt
ps_prompt = """
{question}

Let's first understand the problem and devise a plan to solve it.
Then, let's carry out the plan and solve the problem step by step.
"""

# 增强版 PS+ Prompt（加入更详细的指令）
ps_plus_prompt = """
{question}

Let's first understand the problem, extract relevant variables
and their corresponding numerals, and devise a plan to solve it.
Then, let's carry out the plan, calculate intermediate results
(pay attention to correct numerical calculation and commonsense),
and solve the problem step by step.
"""

# PS+ 的三个关键增强：
# 1. "extract relevant variables" → 防止遗漏关键信息
# 2. "calculate intermediate results" → 强制记录中间结果
# 3. "pay attention to correct numerical calculation" → 减少计算错误
```

### 三、基准测试结果

```
数学推理基准（text-davinci-003，PS 原论文 Table 4）：
┌─────────────────┬──────────┬──────────┬──────────┐
│ 方法            │ GSM8K    │ SVAMP    │ MultiArith│
├─────────────────┼──────────┼──────────┼──────────┤
│ Zero-shot       │ 17.7     │ 65.4     │ 22.7     │
│ Zero-shot CoT   │ 56.4     │ 74.3     │ 78.7     │
│ Plan-and-Solve  │ 58.2     │ 77.8     │ 87.2     │
│ PS+             │ 59.3     │ 79.2     │ 91.8     │
│ Few-shot CoT    │ 58.4     │ 79.4     │ 93.6     │
└─────────────────┴──────────┴──────────┴──────────┘

注意：
- 数字以 Wang et al. 2023 PS Prompting 原论文 Table 4 为准（text-davinci-003 / Zero-shot CoT 对照）。
- 不同复现/不同 base model 数字会有抖动，但 Few-shot CoT 在 MultiArith 上保持 ~93%，
  PS+ 接近 92%，远高于早期勘误中常见的"83.8%"。
- PS+ 几乎追平 Few-shot CoT，但**不需要提供任何示例**！
```

### 四、Plan-and-Execute Agent 架构

Plan-and-Solve 在 Agent 系统中演化为 Plan-and-Execute 架构，将规划与执行分离为独立模块：

```python
class PlanAndExecuteAgent:
    """Plan-and-Solve 在 Agent 系统中的扩展"""

    def __init__(self, planner_llm, executor_llm, tools):
        self.planner = planner_llm   # 规划用的 LLM（可用更强模型）
        self.executor = executor_llm  # 执行用的 LLM（可用更便宜模型）
        self.tools = tools

    async def run(self, task: str):
        # 阶段 1：规划
        plan = await self.plan(task)

        # 阶段 2：逐步执行
        results = []
        for i, step in enumerate(plan.steps):
            result = await self.execute_step(step, results)
            results.append(result)

            # 阶段 3：检查是否需要重规划
            if result.needs_replan:
                plan = await self.replan(task, plan, results, i)

        # 阶段 4：汇总
        return await self.synthesize(task, results)

    async def plan(self, task):
        prompt = f"""
        任务：{task}

        请制定一个详细的执行计划：
        1. 分析任务目标和约束
        2. 列出完成任务所需的步骤
        3. 标注每步需要的工具
        4. 标注步骤间的依赖关系

        输出格式：
        Step 1: [描述] | 工具: [工具名] | 依赖: []
        Step 2: [描述] | 工具: [工具名] | 依赖: [Step 1]
        """
        return await self.planner.invoke(prompt)

    async def execute_step(self, step, previous_results):
        prompt = f"""
        当前步骤：{step.description}
        可用工具：{step.tool}
        前序步骤结果：{previous_results}

        请执行这一步并返回结果。
        """
        return await self.executor.invoke(prompt)
```

### 五、与 ReAct 的对比

```
ReAct（思考 → 行动 → 观察 循环）：
  ✓ 灵活，根据每步结果动态决策
  ✗ 没有全局视角，容易陷入局部循环
  ✗ 短视——只看下一步，不看全局

Plan-and-Execute：
  ✓ 先有全局计划，再逐步执行
  ✓ 计划明确了总步数和依赖关系
  ✓ 支持对计划的提前审核
  ✗ 初始计划可能不完美
  ✗ 需要重规划机制应对意外

混合方案（LangGraph 推荐）：
  Plan-and-Execute 负责全局计划
  + 每个子步骤用 ReAct 模式执行
  = 全局规划 + 局部灵活性
```

### 六、LangGraph 中的 Plan-and-Execute

```python
import operator
from typing import Annotated
from langgraph.graph import StateGraph

class PlanExecuteState(TypedDict):
    task: str
    plan: list[str]
    current_step: int
    results: Annotated[list[str], operator.add]  # Reducer：自动追加而非覆盖
    final_answer: str

def planner(state):
    """生成执行计划"""
    plan = llm.invoke(f"为任务制定计划: {state['task']}")
    return {"plan": plan.steps}

def executor(state):
    """执行当前步骤"""
    step = state["plan"][state["current_step"]]
    result = react_agent.invoke(step)  # 每步用 ReAct
    return {
        "results": [result],  # Reducer 会自动追加到列表
        "current_step": state["current_step"] + 1
    }

def should_continue(state):
    if state["current_step"] >= len(state["plan"]):
        return "synthesize"
    return "executor"

# 构建图
graph = StateGraph(PlanExecuteState)
graph.add_node("planner", planner)
graph.add_node("executor", executor)
graph.add_node("synthesize", synthesize)
graph.add_edge("planner", "executor")
graph.add_conditional_edges("executor", should_continue)
```

### 七、为什么需要动态重规划？

静态计划无法应对执行中的意外，当步骤失败或前提假设被推翻时，Agent 需要动态调整：

```
初始计划：
  Step 1: 搜索竞品A的数据 ✅ 完成
  Step 2: 搜索竞品B的数据 ❌ API 超时，未获取到
  Step 3: 对比分析 A 和 B   → 依赖 Step 2，无法执行
  Step 4: 生成报告

不重规划 → Agent 卡死或跳过关键步骤
重规划后：
  Step 2': 换用备用数据源搜索竞品B
  Step 3: 对比分析（保持不变）
  Step 4: 生成报告（保持不变）
```

### 八、重规划的触发条件

```python
class ReplanTrigger:
    """检测何时需要重规划"""

    def should_replan(self, state) -> bool:
        # 触发条件 1：步骤执行失败
        if state.last_step_failed:
            return True

        # 触发条件 2：结果与预期严重偏离
        if state.deviation_score > self.threshold:
            return True

        # 触发条件 3：发现新信息改变了前提假设
        if state.assumptions_invalidated:
            return True

        # 触发条件 4：已执行步骤超过预期，可能陷入循环
        if state.steps_executed > state.expected_steps * 1.5:
            return True

        # 触发条件 5：用户干预请求修改目标
        if state.user_intervention:
            return True

        return False
```

### 九、重规划策略

#### 策略 1：反应式重规划

步骤失败时立即触发，保留已完成进度，重新规划剩余部分：

```python
class ReactiveReplanner:
    """步骤失败时立即重规划"""

    async def execute_plan(self, plan, task, max_retries=3):
        if max_retries <= 0:
            raise RuntimeError("超过最大重规划次数，终止执行")

        results = []
        for i, step in enumerate(plan.steps):
            result = await self.execute_step(step)

            if result.failed:
                # 重规划：保留已完成步骤，重新规划剩余部分
                new_plan = await self.replan(
                    original_task=task,
                    completed_steps=results,
                    failed_step=step,
                    failure_reason=result.error,
                    remaining_steps=plan.steps[i+1:]
                )
                # 递归执行新计划，递减重试次数
                return await self.execute_plan(new_plan, task, max_retries - 1)

            results.append(result)
        return results

    async def replan(self, original_task, completed_steps,
                     failed_step, failure_reason, remaining_steps):
        prompt = f"""
        原始任务：{original_task}

        已完成的步骤和结果：
        {self.format_results(completed_steps)}

        失败的步骤：{failed_step}
        失败原因：{failure_reason}

        原剩余计划：{remaining_steps}

        请根据失败原因重新规划剩余步骤。
        要求：
        1. 不要重复已完成的步骤
        2. 尝试用不同方式完成失败的步骤
        3. 调整后续步骤以适应变化
        """
        return await self.planner_llm.invoke(prompt)
```

#### 策略 2：周期性重规划

每执行 N 步后主动评估计划有效性，无需等待失败：

```python
class PeriodicReplanner:
    """每 N 步重新评估和调整计划"""

    async def execute_with_checkpoints(self, plan, task):
        results = []
        checkpoint_interval = 3  # 每 3 步检查一次

        for i, step in enumerate(plan.steps):
            result = await self.execute_step(step)
            results.append(result)

            # 每 N 步检查是否需要调整计划
            if (i + 1) % checkpoint_interval == 0:
                assessment = await self.assess_progress(
                    task=task,
                    plan=plan,
                    completed=results,
                    remaining=plan.steps[i+1:]
                )
                if assessment.needs_adjustment:
                    plan = await self.adjust_plan(
                        task, results, assessment.suggestions
                    )

        return results

    async def assess_progress(self, task, plan, completed, remaining):
        """评估当前进度是否符合预期"""
        prompt = f"""
        任务目标：{task}
        已完成步骤及结果：{completed}
        剩余计划：{remaining}

        评估：
        1. 当前进度是否朝目标方向推进？
        2. 已获取的信息是否改变了后续步骤的必要性？
        3. 是否有更高效的方式完成剩余任务？
        """
        return await self.llm.invoke(prompt)
```

#### 策略 3：ALAS 事务性规划

每个步骤作为原子事务执行，失败可回滚和重试：

```python
class TransactionalPlanner:
    """ALAS: 每个步骤作为原子事务执行"""

    async def execute_step_transactional(self, step, context):
        """事务性执行：成功提交，失败回滚"""
        checkpoint = self.save_state()  # 保存当前状态

        try:
            result = await self.execute(step)

            if self.validate(result):
                self.commit(result)   # 提交变更
                return result
            else:
                self.rollback(checkpoint)  # 验证失败，回滚
                return await self.retry_with_alternative(step)

        except Exception as e:
            self.rollback(checkpoint)      # 异常回滚

            if self.retries_left(step) > 0:
                return await self.retry(step)  # 重试
            else:
                return await self.replan_from_here(step, e)  # 重规划
```

### 十、DuSAR 双策略框架

DuSAR 结合全局规划与局部适应，在长时域任务上表现优异：

```python
class DuSAR:
    """双策略自适应推理框架"""

    async def solve(self, task):
        # 策略 1：子目标导向（全局规划）
        subgoals = await self.decompose_to_subgoals(task)

        for subgoal in subgoals:
            # 策略 2：经验驱动（局部适应）
            # 从历史执行中学习类似子目标的最佳策略
            strategy = self.experience_bank.get_best_strategy(subgoal)

            if strategy:
                result = await self.execute_with_strategy(subgoal, strategy)
            else:
                result = await self.explore_new_strategy(subgoal)

            # 动态调整：根据结果更新后续子目标
            if result.changes_context:
                subgoals = await self.redecompose(
                    task, completed=result, remaining=subgoals
                )

            # 更新经验库
            self.experience_bank.record(subgoal, result)
```

### 十一、重规划的关键设计原则

```python
replanning_principles = {
    "最小变更": (
        "重规划应尽量保留原计划中仍然有效的部分，"
        "只修改必须改变的步骤。避免全部推翻重来"
    ),
    "上下文传递": (
        "重规划时必须传递已完成步骤的结果和失败原因，"
        "让 LLM 理解当前状态，不要从零开始"
    ),
    "防止无限循环": (
        "设置最大重规划次数（如 3 次），"
        "超过后报告失败而非无限重试"
    ),
    "失败记忆": (
        "记住之前失败的方案，避免重规划时"
        "再次生成相同的失败计划"
    ),
    "降级策略": (
        "多次重规划失败后，应有降级方案："
        "简化目标、请求人类帮助、部分完成"
    ),
}
```

### 十二、实际系统中的重规划架构

```
┌──────────────┐
│   Planner    │ ← 初始计划
└──────┬───────┘
       ▼
┌──────────────┐     ┌──────────────┐
│  Executor    │────▶│   Monitor    │
│ (执行步骤)   │     │ (监控偏差)   │
└──────┬───────┘     └──────┬───────┘
       │                    │
       ▼                    ▼
  成功 → 继续          偏差检测 → 触发重规划
                            │
                    ┌───────▼────────┐
                    │   Replanner    │
                    │ (生成新计划)   │
                    └───────┬────────┘
                            │
                    反馈到 Executor 继续执行
```

### 适用场景总结

| 场景 | 推荐方案 | 原因 |
|------|---------|------|
| 简单问答 | 直接回答 | 规划是多余的 |
| 数学推理 | PS+ | 减少遗漏和计算错误 |
| 多步任务 | Plan-and-Execute | 需要全局视角 |
| 动态环境 | Plan + ReAct + Replanning | 全局计划 + 局部灵活 + 动态调整 |
| 高可靠性 | Plan + 人工审核 | 计划可被人类审核和修改 |
| 长时域复杂任务 | DuSAR / ALAS | 需要经验积累和事务性保障 |

</div>

---

<div class="question-card compact-card" id="052-plan-and-solve-replanning-2">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">常见误区 / 面试追问</span></h2>

1. **误区："Plan-and-Solve 就是 Chain-of-Thought 的变体"** — PS 不仅是让模型"逐步思考"，而是明确将过程分为"规划"和"执行"两个独立阶段。CoT 是一次性生成推理链，PS 是先生成计划再按计划执行。

2. **误区："计划一旦制定就不应该改变"** — 好的 Plan-and-Execute 系统必须支持重规划（Replanning）。执行过程中可能遇到意外情况（工具失败、信息不符合预期），需要动态调整计划。

3. **误区："每次失败都应该重规划"** — 不是所有失败都需要重规划。瞬时错误（网络超时）用重试就行，只有结构性问题（方案不可行、前提假设变化）才需要重规划。过于频繁的重规划浪费计算资源且可能引入新问题。

4. **误区："重规划 = 重新从头开始规划"** — 好的重规划是增量修改——保留已完成的进度和仍然有效的步骤，只修改必须改变的部分。全部推翻重来是最后手段。

5. **追问："PS+ 为什么不需要 Few-shot 示例就能接近 Few-shot CoT？"** — 因为 PS+ 的详细指令（提取变量、计算中间结果、注意计算正确性）本质上将 Few-shot 示例中隐含的推理策略显式化了。指令替代了示例的作用。

6. **追问："Plan-and-Execute 架构中，Planner 和 Executor 应该用同一个模型吗？"** — 不一定。常见做法是 Planner 用更强的模型（如 Claude Opus）保证计划质量，Executor 用更快更便宜的模型（如 Claude Haiku）降低成本。这种异构模型配置是生产中的最佳实践。

7. **追问："如何防止重规划陷入循环？"** — 三层防御：(1) 记录失败的计划，新计划不能重复；(2) 设置最大重规划次数上限；(3) 每次重规划必须与前次不同——可以用 LLM 自评判断新计划是否实质性不同。

8. **追问："重规划的成本如何控制？"** — 只在必要时重规划（而非每步都重规划）；重规划只传递摘要而非完整历史（控制 token 用量）；Planner 可以用较小模型做快速重规划，只在关键决策点用大模型。

</div>

---

<div class="question-card compact-card" id="052-plan-and-solve-replanning-3">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">参考资料</span></h2>

- [Plan-and-Solve Prompting: Improving Zero-Shot Chain-of-Thought (ACL 2023)](https://arxiv.org/abs/2305.04091)
- [Plan-and-Solve Prompting (Learn Prompting)](https://learnprompting.org/docs/advanced/decomposition/plan_and_solve)
- [Plan-and-Solve Plus (PS+) Framework (PromptEngineering.org)](https://promptengineering.org/plan-and-solve-plus-ps-a-prompting-framework-for-enhanced-llm-reasoning/)
- [Plan & Solve Agent Pattern (Agent Patterns)](https://agent-patterns.readthedocs.io/en/stable/patterns/plan-and-solve.html)
- [Planning for Agents (LangChain Blog)](https://blog.langchain.com/planning-for-agents/)
- [DuSAR: A Co-Adaptive Dual-Strategy Framework for LLM-Based Planning (arXiv)](https://arxiv.org/html/2512.08366v1)
- [ALAS: Transactional and Dynamic Multi-Agent LLM Planning (arXiv)](https://arxiv.org/html/2511.03094v1)
- [Dynamic Planning in LLM Agents: From ReAct to Tree-of-Thoughts](https://tao-hpu.medium.com/dynamic-planning-in-llm-agents-from-react-to-tree-of-thoughts-a3464a8b114e)
- [LLM Dynamic Planner (LLM-DP) (Emergent Mind)](https://www.emergentmind.com/topics/llm-dynamic-planner-llm-dp)
- [5 Recovery Strategies for Multi-Agent LLM Failures (Newline)](https://www.newline.co/@zaoyang/5-recovery-strategies-for-multi-agent-llm-failures--673fe4c4)

</div>

---

<div class="question-card compact-card" id="053-llm-planning-limitations-1">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">详细解析</span></h2>

### LLM 规划的核心局限

```python
planning_limitations = {
    "约束满足": {
        "问题": "LLM 难以同时满足多个约束条件",
        "示例": "安排5人会议，每人有不同的空闲时间段 → LLM 经常忽略部分约束",
        "原因": "自回归生成逐 token 产生，无法全局优化",
    },
    "长程规划退化": {
        "问题": "步骤越多，计划质量越差",
        "示例": "10 步计划的可行率远低于 3 步计划",
        "原因": "每步的小错误会累积放大",
    },
    "世界模型缺失": {
        "问题": "LLM 无法准确模拟动作的后果",
        "示例": "移动积木 A 到 B 上 → LLM 可能忘记 A 原来下面的积木会暴露出来",
        "原因": "LLM 是语言模型，不是物理/逻辑模拟器",
    },
    "幻觉与虚构": {
        "问题": "生成看似合理但不可执行的步骤",
        "示例": "计划中引用不存在的 API、使用不可用的工具",
        "原因": "LLM 优化的是语言流畅度，不是计划可行性",
    },
    "回溯能力缺失（经典 LLM）": {
        "问题": "标准自回归 LLM 无法回头修改已生成的步骤",
        "示例": "发现第 3 步需要第 1 步的不同输出时，无法物理改写第 1 步",
        "原因": "单向生成架构的根本限制——已写出的 token 进入 KV-cache 即不可修改",
        "重要例外": (
            "Reasoning Models（o1/o3、DeepSeek-R1、Claude extended thinking 等）"
            "通过 RL 训练涌现出**功能性回溯**——在思考链内部说"
            "'wait, let me reconsider...' 并重新走一条推理路径。"
            "本质仍是顺序生成，但语义层面已能模拟回溯效果。"
            "参见 055-reasoning-models.md 的 Aha moment 部分。"
        ),
    },
}
```

### 实证数据：LLM 规划的真实表现

```
Blocksworld 规划任务（2024 基准测试）：
┌──────────────────────┬────────────┬─────────────┐
│ 方法                 │ 可行率     │ 最优率       │
├──────────────────────┼────────────┼─────────────┤
│ GPT-4 直接规划       │ ~35%       │ ~15%        │
│ GPT-4 + CoT          │ ~42%       │ ~20%        │
│ GPT-4 + Self-Verify  │ ~55%       │ ~30%        │
│ LLM-Modulo (外部验证)│ ~82%       │ ~65%        │
│ 传统规划器 (PDDL)    │ 100%       │ 100%        │
└──────────────────────┴────────────┴─────────────┘

结论：LLM 单独做规划远不如传统规划器可靠
     但 LLM + 外部验证可以显著提升
```

### 缓解方案 1：LLM-Modulo 框架

```python
class LLMModuloPlanner:
    """LLM 生成 + 外部验证器检查"""

    async def plan(self, task, max_attempts=5):
        for attempt in range(max_attempts):
            # 1. LLM 生成候选计划
            candidate = await self.llm.generate_plan(
                task=task,
                feedback=self.previous_feedback if attempt > 0 else None
            )

            # 2. 外部验证器检查
            validation = await self.verify(candidate)

            if validation.is_valid:
                return candidate
            else:
                # 3. 将验证反馈回传给 LLM
                self.previous_feedback = validation.errors
                # "步骤 3 违反了约束 X：..."

        return None  # 所有尝试都失败

    async def verify(self, plan):
        """多层验证"""
        errors = []

        # 语法验证：步骤格式是否正确
        errors += self.syntax_check(plan)

        # 约束验证：是否满足所有约束
        errors += self.constraint_check(plan)

        # 可执行性验证：每个动作是否可执行
        errors += await self.executability_check(plan)

        # 模拟验证：在模拟环境中执行
        errors += await self.simulation_check(plan)

        return ValidationResult(is_valid=len(errors) == 0, errors=errors)
```

### 缓解方案 2：混合规划架构

```python
class HybridPlanner:
    """LLM 处理灵活部分 + 传统算法处理确定性部分"""

    async def plan(self, task):
        # 1. LLM 负责高层目标分解（擅长理解自然语言需求）
        high_level_goals = await self.llm.decompose(task)

        # 2. 传统规划器负责具体步骤排列（擅长约束满足）
        for goal in high_level_goals:
            if goal.is_structured:
                # 调度、排列组合等 → 用确定性算法
                goal.plan = self.classical_planner.solve(goal)
            else:
                # 创意、判断等 → 用 LLM
                goal.plan = await self.llm.plan_steps(goal)

        return self.merge_plans(high_level_goals)
```

### 缓解方案 3：Plan-Verify-Correct 循环

```python
class PlanVerifyCorrect:
    """生成 → 验证 → 纠正 的迭代循环"""

    async def solve(self, task):
        plan = await self.generate_initial_plan(task)

        for iteration in range(self.max_iterations):
            # 验证
            issues = await self.llm.verify_plan(
                plan=plan,
                prompt="""
                审查以下计划，检查：
                1. 是否有遗漏的步骤？
                2. 步骤顺序是否正确？
                3. 是否有不可执行的步骤？
                4. 是否满足所有约束？
                列出发现的问题。
                """
            )

            if not issues:
                break  # 验证通过

            # 纠正
            plan = await self.llm.correct_plan(
                plan=plan, issues=issues,
                prompt="根据以下问题修正计划：..."
            )

        return plan
```

### 缓解方案 4：分层规划降低复杂度

```
完整任务（LLM 难以一次性规划）
│
├── 抽象层（LLM 擅长）：高层目标和策略
│   "先收集数据，再分析，最后生成报告"
│
├── 中间层（LLM + 约束）：具体子任务
│   "搜索竞品A → 提取定价 → 搜索竞品B → 提取定价"
│
└── 执行层（工具/代码）：原子操作
    "调用 search_api('竞品A 定价')"

每一层只处理 3-5 个步骤 → 在 LLM 的能力范围内
```

### 关键研究发现

```python
key_findings = {
    "Kambhampati 2024": (
        "LLMs cannot plan but can help planning. "
        "LLM-Modulo 框架让 LLM 作为候选生成器，"
        "外部验证器保证正确性"
    ),
    "Valmeekam et al. 2023": (
        "在 Blocksworld 上，GPT-4 直接生成的计划 "
        "仅有约 35% 可行，远低于人们的预期"
    ),
    "DeepPlanning 2026": (
        "隐含约束比显式约束更难被 LLM 检测到。"
        "环境中未明确说明的限制是 LLM 规划的最大盲区"
    ),
    "PlanGenLLMs Survey": (
        "LLM 在需要精确状态追踪的规划任务上表现最差，"
        "但在需要常识推理的规划任务上有独特优势"
    ),
}
```

</div>

---

<div class="question-card compact-card" id="053-llm-planning-limitations-2">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">常见误区 / 面试追问</span></h2>

1. **误区："用更大的模型就能解决规划问题"** — 规划能力的局限是自回归架构的根本问题，不是模型大小的问题。更大的模型可以改善但无法根本解决约束满足和状态追踪的弱点。正确做法是用外部工具补偿 LLM 的结构性弱点。

2. **误区："LLM 不能规划 = LLM 在规划中没用"** — 恰恰相反。LLM 在规划中的角色是：理解自然语言需求、生成候选方案、提供常识知识。它不擅长的是精确约束满足和状态追踪——这些交给传统算法或验证器。

3. **追问："如何判断一个规划任务是否适合 LLM？"** — 两个维度：(1) 约束的数量和复杂度——少约束适合 LLM，多约束需要验证器；(2) 步骤数——3-5 步 LLM 可以直接处理，10+ 步需要分层规划或外部辅助。

4. **追问："LLM-Modulo 框架的验证器从哪来？"** — 取决于领域：代码规划用单元测试和类型检查；数学规划用符号计算验证；现实世界规划用模拟器；通用场景用另一个 LLM 做交叉验证（效果有限但成本低）。

</div>

---

<div class="question-card compact-card" id="053-llm-planning-limitations-3">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">参考资料</span></h2>

- [LLMs Can't Plan, But Can Help Planning in LLM-Modulo Frameworks (arXiv, Kambhampati)](https://arxiv.org/html/2402.01817v2)
- [PlanGenLLMs: A Survey of LLM Planning Capabilities (ACL 2025)](https://aclanthology.org/2025.acl-long.958.pdf)
- [DeepPlanning: Benchmark Exposing Limits of LLM Planning](https://co-r-e.com/method/deepplanning-benchmark-llm-20260128)
- [Planning for Agents (LangChain Blog)](https://blog.langchain.com/planning-for-agents/)
- [LLM Planner Agent: Adaptive Modular Planning (Emergent Mind)](https://www.emergentmind.com/topics/llm-planner-agent)

</div>

---

<div class="question-card compact-card" id="055-reasoning-models-1">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">详细解析</span></h2>

### 标准模型 vs Reasoning 模型

```
标准 LLM（如 GPT-4、Claude Sonnet）：
  输入 → [模型] → 直接输出答案
  ・固定计算量：不管问题难易，计算量大致相同
  ・不会"想"：逐 token 生成，无内部推理过程

Reasoning Model（如 o1/o3、DeepSeek-R1）：
  输入 → [模型思考链...可能数千 token] → 最终输出答案
  ・自适应计算量：难题想得更久，简单题想得快
  ・内部 CoT：模型自主生成推理步骤
  ・可以回溯：发现错误可以纠正推理方向
```

### 训练方法的核心差异

```python
training_comparison = {
    "标准 LLM": {
        "预训练": "Next token prediction on large corpus",
        "微调": "SFT (Supervised Fine-Tuning) on instruction data",
        "对齐": "RLHF (基于人类偏好的 RL)",
        "推理能力来源": "预训练数据中隐含的推理模式",
    },
    "Reasoning Model": {
        "预训练": "Same as standard LLM",
        "关键创新": "大规模 RL 训练推理能力",
        "RL 奖励信号": "答案正确性（而非人类偏好）",
        "推理能力来源": "RL 中自主发现的推理策略",
    },
}

# DeepSeek-R1 的训练流程
deepseek_r1_pipeline = [
    "1. 基座模型（DeepSeek-V3）",
    "2. Cold Start SFT：用少量高质量 CoT 数据微调",
    "3. 大规模 RL：用 GRPO 算法训练",
    "   - 奖励：答案是否正确（数学/代码可自动验证）",
    "   - 模型自主学习：何时思考、思考多久、如何回溯",
    "4. Rejection Sampling + SFT：用 RL 模型生成的好推理做 SFT",
    "5. 第二轮 RL：进一步对齐",
]
```

### 关键研究发现：R1-Zero 的涌现行为

```python
# DeepSeek-R1-Zero：纯 RL（不用任何 SFT）训练的惊人发现
emergent_behaviors = {
    "自发长思考": "模型自主学会生成长推理链，无需人工示范",
    "Aha moment": "模型学会在推理中说'等一下，让我重新检查'",
    "自我纠正": "发现错误后回溯到更早的推理步骤",
    "多角度验证": "用不同方法验证同一结论",
    "思考时间自适应": "简单问题思考少，难题思考多",
}
# 这些行为都是 RL 过程中自然涌现的，没有人工设计
```

### 基准测试对比

```
数学推理（AIME 2024）：
┌──────────────────┬──────────┬─────────┐
│ 模型             │ 准确率   │ 类型     │
├──────────────────┼──────────┼─────────┤
│ GPT-4            │ ~30%     │ 标准     │
│ Claude Sonnet    │ ~35%     │ 标准     │
│ DeepSeek-R1      │ 79.8%    │ 推理     │
│ o1               │ 83.3%    │ 推理     │
│ o3               │ 96.7%    │ 推理     │
└──────────────────┴──────────┴─────────┘

编程（Codeforces Rating）：
┌─────────────────────────────────┬──────────┐
│ 模型                            │ Rating   │
├─────────────────────────────────┼──────────┤
│ GPT-4                           │ ~1200    │
│ DeepSeek-R1-Distill-Qwen-32B    │ ~1500    │
│ o1                              │ ~1800    │
│ DeepSeek-R1（满血 671B）         │ ~2029    │
│ o3                              │ ~2700    │
└─────────────────────────────────┴──────────┘

注：1500 是 DeepSeek-R1 蒸馏小模型的水平，**满血 DeepSeek-R1 实际 ~2029**（与原论文对应）。
   常见误传把蒸馏版数字按到满血版上，会显著低估 R1 的真实编程能力。

ARC-AGI（抽象推理）：
  GPT-4: ~5%  →  o3: 87.5%（高计算配置下，标准配置约 75.7%；突破性提升）
```

### Test-Time Compute Scaling

```python
# Reasoning 模型的核心范式转变：
# 传统：提升性能 = 更大模型 + 更多训练数据（训练时扩展）
# 新范式：提升性能 = 允许模型思考更久（推理时扩展）

scaling_paradigms = {
    "Train-Time Scaling": {
        "方法": "增加参数量和训练数据",
        "代表": "GPT-3 → GPT-4（模型更大）",
        "局限": "边际收益递减（Scaling Law 放缓）",
    },
    "Test-Time Scaling": {
        "方法": "增加推理时的计算量（更长的思考链）",
        "代表": "o1 → o3（思考更久而非模型更大）",
        "优势": "按需分配——简单题少想，难题多想",
        "实现": "RL 训练模型学会自适应分配思考时间",
    },
}
```

### 使用场景指南

```python
use_reasoning_model = [
    "数学竞赛和复杂计算",
    "算法和编程竞赛题",
    "科学推理和逻辑证明",
    "复杂的多步推理任务",
    "需要高准确率且不在乎延迟的场景",
]

use_standard_model = [
    "简单问答和信息检索",
    "创意写作和内容生成",
    "翻译和文本改写",
    "实时对话（延迟敏感）",
    "Agent 的常规工具选择决策",
    "成本敏感的批量处理",
]

# Agent 系统中的混合策略
hybrid_strategy = """
Agent Router：
  简单任务 → 标准模型（快速、便宜）
  复杂推理 → Reasoning 模型（准确、慢）

关键决策点（如规划、关键判断）→ Reasoning 模型
常规执行步骤（如信息检索、格式化）→ 标准模型
"""
```

### 成本与延迟对比

```
成本对比（每百万 token，大约值）：
┌──────────────────┬──────────┬──────────┐
│ 模型             │ 输入     │ 输出      │
├──────────────────┼──────────┼──────────┤
│ GPT-4o           │ $2.50    │ $10.00   │
│ o3-mini          │ $1.10    │ $4.40    │
│ o3               │ $10.00   │ $40.00   │
│ DeepSeek-R1      │ $0.55    │ $2.19    │
└──────────────────┴──────────┴──────────┘

注意：价格为截至 2025 年初的近似值，请参考各厂商最新定价
注意：Reasoning 模型的"思考 token"也计入输出费用
一道复杂数学题可能产生 5000-20000 思考 token

延迟对比：
  标准模型：1-5 秒
  Reasoning 模型：10-120 秒（取决于问题复杂度）
```

### 2025-2026 Reasoning 模型生态演进

```python
# 主流 Reasoning 模型谱系（按 2026-05 时间线）
reasoning_models_2025_2026 = {
    "OpenAI o 系列": {
        "o1 / o1-pro":    "2024-09 / 12 闭源 RL CoT，开启 test-time compute scaling",
        "o3 / o3-mini":   "2025-01 推理 + 工具调用，ARC-AGI 87.5%",
        "o3-pro / o4":    "2025-09 / 2026-Q1 进一步扩 test-time scaling",
        "GPT-5 / 5.3":    "2026-Q1+ 推理 + 通用合一，但仍可显式开 'thinking' 模式",
    },
    "Anthropic Claude (extended thinking)": {
        "Sonnet 3.7":     "2025-02 首个支持 extended thinking 的 Claude，budget_tokens 控制思考深度",
        "Sonnet 4 / 4.5": "2025-05 / 09 改进 thinking + 工具交错，引入 interleaved thinking",
        "Opus 4 / 4.5":   "2025-05 / 09 推理 + Agent 长任务",
        "Sonnet 4.6 / Opus 4.6": "2025-Q4 1M context + server-side compaction，长思考链稳定性大幅提升",
        "Opus 4.7 / Mythos": "2026-05 SWE-bench Verified 87.6% / 93.9%（含 thinking）",
    },
    "DeepSeek 系列": {
        "R1 / R1-Zero":   "2025-01 纯 GRPO RL 开源旗舰，Aha moment 涌现",
        "R1-蒸馏 7B/14B/32B/70B": "蒸馏到小模型，1.5B 也能跑出可观推理能力",
        "V3.x / R2":      "2025-2026 持续迭代，强化 agent 任务",
    },
    "Google Gemini": {
        "2.5 Pro Thinking": "2025-Q2 引入 'Deep Think' 模式，AIME / HLE 显著提升",
        "3.0 / 3.1 Thinking": "2026-Q1-Q2 多模态 + 推理融合，HLE SOTA 4x.x%",
    },
    "xAI Grok": {
        "Grok 3 Reasoning / Grok 3 Heavy": "2025-Q1 推理模式 + 多 agent 重思考",
        "Grok 4":                          "2025-2026 推理 + 工具",
    },
    "Qwen / 其他": {
        "QwQ-32B-Preview":  "阿里 2024-11 开源 reasoning，长 CoT 风格独特",
        "Qwen3-Thinking":   "2025-Q2 Qwen3 系列内置 thinking",
        "Mistral / Moonshot Kimi K2 / GLM-4-Reasoning": "2025-2026 各家陆续推出",
    },
}

# 设计模式归纳
design_axes = {
    "RL 信号":     "可验证奖励（数学/代码）已成共识；偏好/Judge 奖励作补充",
    "思考预算":     "从'固定开关'演化为 budget_tokens / minimum_thinking_tokens 可控",
    "Interleaved": "思考与工具调用交错（Claude / OpenAI Responses 都已支持）",
    "Thinking 可见性": "OpenAI 默认隐藏 raw CoT，Anthropic / DeepSeek 默认可见，影响安全/可审计权衡",
    "成本范式":     "thinking token 计费独立，预算控制成生产关键参数",
}
```

### Reasoning 模型在 Agent 中的应用

```python
class ReasoningAwareAgent:
    """根据任务复杂度动态选择模型"""

    async def process(self, task):
        complexity = await self.assess_complexity(task)

        if complexity == "simple":
            return await self.standard_model.invoke(task)
        elif complexity == "complex_reasoning":
            return await self.reasoning_model.invoke(task)
        else:
            # 混合：用 reasoning model 做规划
            # 用 standard model 做执行
            plan = await self.reasoning_model.invoke(
                f"为以下任务制定详细计划：{task}"
            )
            results = []
            for step in plan.steps:
                result = await self.standard_model.invoke(step)
                results.append(result)
            return self.synthesize(results)
```

</div>

---

<div class="question-card compact-card" id="055-reasoning-models-2">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">常见误区 / 面试追问</span></h2>

1. **误区："Reasoning 模型就是加了 CoT 的普通模型"** — 根本区别在于训练方式。普通模型 + CoT Prompt 是外部引导，推理链质量取决于 Prompt；Reasoning 模型通过 RL 内化了推理能力，自主决定何时思考、思考多久、如何回溯。R1-Zero 证明这些能力可以从纯 RL 中涌现。

2. **误区："Reasoning 模型在所有任务上都更好"** — 在简单任务上 Reasoning 模型的额外思考是浪费——增加延迟和成本但不提升质量。对于对话、创意写作等不需要严格推理的任务，标准模型可能更合适。

3. **追问："DeepSeek-R1 如何用开源模型实现接近 o1 的效果？"** — 两个关键：(1) 大规模 RL 训练（GRPO 算法）用答案正确性作为奖励信号；(2) 蒸馏——用 R1 大模型生成的推理数据训练小模型（如 Qwen-32B），小模型也能获得推理能力。

4. **追问："未来 Agent 系统会全面使用 Reasoning 模型吗？"** — 更可能是混合架构：Reasoning 模型用于关键决策点（规划、复杂判断），标准模型用于常规执行。模型路由（Model Routing）将成为 Agent 系统的核心组件。

</div>

---

<div class="question-card compact-card" id="055-reasoning-models-3">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">参考资料</span></h2>

- [Demystifying Reasoning Models (Cameron R. Wolfe, Deep Learning Focus)](https://cameronrwolfe.substack.com/p/demystifying-reasoning-models)
- [Inside Reasoning Models: OpenAI o3 And DeepSeek R1 (Adaline Labs)](https://labs.adaline.ai/p/inside-reasoning-models-openai-o3)
- [Categories of Inference-Time Scaling (Sebastian Raschka)](https://magazine.sebastianraschka.com/p/categories-of-inference-time-scaling)
- [A Survey on Large Reasoning Models with Self-Play Deep RL (ACM)](https://dl.acm.org/doi/full/10.1145/3784013.3784042)
- [DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via RL (DeepSeek)](https://arxiv.org/abs/2501.12948)

</div>

---

<div class="question-card compact-card" id="056-mcts-in-agent-planning-1">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">详细解析</span></h2>

### MCTS 的四步循环

```
        根节点（初始状态）
           │
    ┌──────┼──────┐
    │      │      │
   A(3/5) B(1/4) C(2/3)    ← 选择：UCB1 选 C（胜率高+访问少）
                  │
              ┌───┼───┐
              │       │
            C1(new) C2(new)  ← 扩展：生成新子节点
              │
          [模拟到终局]        ← 模拟：LLM 评估结果
              │
          反向传播 ↑↑↑        ← 更新路径上所有节点的统计

四步循环：
1. Selection（选择）：从根节点用 UCB1 策略向下选择
2. Expansion（扩展）：在叶节点生成新的子节点
3. Simulation（模拟）：评估新节点的价值
4. Backpropagation（反向传播）：更新路径上所有节点的统计值
```

### MCTS 在 LLM Agent 中的实现

```python
import math

class MCTSNode:
    def __init__(self, state, parent=None):
        self.state = state          # 当前推理状态
        self.parent = parent
        self.children = []
        self.visits = 0
        self.value = 0.0

    def ucb1(self, exploration_weight=1.414):
        """UCB1：平衡探索与利用"""
        if self.visits == 0:
            return float('inf')  # 未访问的节点优先
        exploitation = self.value / self.visits
        exploration = exploration_weight * math.sqrt(
            math.log(self.parent.visits) / self.visits
        )
        return exploitation + exploration

class LLM_MCTS:
    """将 MCTS 与 LLM 结合的规划器"""

    def __init__(self, llm, num_iterations=50):
        self.llm = llm
        self.num_iterations = num_iterations

    async def search(self, problem):
        root = MCTSNode(state=problem)

        for _ in range(self.num_iterations):
            # 1. 选择：沿 UCB1 最高的路径向下
            node = self.select(root)

            # 2. 扩展：用 LLM 生成可能的下一步
            child = await self.expand(node)

            # 3. 模拟：用 LLM 评估这条路径的价值
            value = await self.simulate(child)

            # 4. 反向传播：更新路径上的统计值
            self.backpropagate(child, value)

        # 返回访问次数最多的子节点（最稳健的选择）
        return max(root.children, key=lambda c: c.visits)

    def select(self, node):
        while node.children:
            node = max(node.children, key=lambda c: c.ucb1())
        return node

    async def expand(self, node):
        """用 LLM 生成多个候选动作"""
        actions = await self.llm.invoke(f"""
        当前状态：{node.state}
        请生成 3 个可能的下一步行动。
        """)
        for action in actions:
            child = MCTSNode(
                state=self.apply_action(node.state, action),
                parent=node
            )
            node.children.append(child)
        return node.children[0]  # 返回第一个新节点用于模拟

    async def simulate(self, node):
        """用 LLM 评估当前路径的价值（0-1）"""
        evaluation = await self.llm.invoke(f"""
        评估以下推理路径达到最终目标的可能性（0-1分）：
        路径：{self.get_path(node)}
        目标：{self.goal}
        """)
        return float(evaluation)

    def backpropagate(self, node, value):
        while node:
            node.visits += 1
            node.value += value
            node = node.parent
```

### LATS 框架：MCTS + LLM Agent

```python
class LATS:
    """Language Agent Tree Search (ICML 2024)"""

    def __init__(self, llm, environment, n_samples=5, depth=7):
        self.llm = llm
        self.env = environment
        self.n_samples = n_samples
        self.depth = depth

    async def solve(self, task):
        root = LATSNode(observation=task)

        for iteration in range(self.n_samples):
            node = self.select(root)

            # LATS 的关键创新：LLM 同时充当多个角色（决策、生成、评估、反思）
            # Self-Reflection 是 LATS 的核心创新之一，不应视为"额外"

            # 角色 1：Action Generator（生成候选动作）
            actions = await self.generate_actions(node)

            # 角色 2：Environment Simulator（模拟执行结果）
            for action in actions:
                observation = await self.env.step(action)
                child = LATSNode(observation=observation, action=action)
                node.add_child(child)

            # 角色 3：Value Function（评估状态价值）
            for child in node.children:
                value = await self.evaluate_state(child)
                child.value = value

            # 角色 4：Self-Reflection（核心创新——从失败中学习并指导后续搜索）
            if self.is_terminal_failure(node):
                reflection = await self.reflect_on_failure(node)
                # 反思被存储，影响后续搜索
                self.reflections.append(reflection)

            self.backpropagate(node)

        return self.get_best_trajectory(root)
```

### LATS 的性能对比

```
HumanEval 编程任务（GPT-4）：
┌──────────────────────┬──────────┐
│ 方法                 │ Pass@1   │
├──────────────────────┼──────────┤
│ 直接生成             │ 82.0%    │
│ CoT                  │ 83.5%    │
│ Reflexion            │ 91.0%    │
│ ToT (DFS)            │ 89.0%    │
│ LATS (MCTS)          │ 94.4%    │
└──────────────────────┴──────────┘

WebShop（网页导航任务）：
  ReAct: 40%  →  LATS: 75% (提升 87.5%)
```

### MCTS vs 其他搜索策略

```python
comparison = {
    "Greedy (CoT)": {
        "搜索方式": "单路径，无回溯",
        "优势": "最快、最便宜",
        "劣势": "容易卡在局部最优",
        "LLM 调用": "1 次",
    },
    "BFS (ToT)": {
        "搜索方式": "逐层扩展所有候选",
        "优势": "保证找到最浅的解",
        "劣势": "内存消耗大，不适合深搜索",
        "LLM 调用": "O(b^d)",
    },
    "DFS (ToT)": {
        "搜索方式": "深入探索一条路，失败回溯",
        "优势": "内存高效",
        "劣势": "可能陷入无解的深分支",
        "LLM 调用": "O(b*d)",
    },
    "MCTS (LATS)": {
        "搜索方式": "UCB1 引导的自适应搜索",
        "优势": "探索-利用平衡，渐进最优",
        "劣势": "需要大量迭代，成本最高",
        "LLM 调用": "O(N * b)，N=迭代次数",
    },
}
```

### 实际应用中的成本-效果权衡

```python
# MCTS 的成本很高——每次迭代都需要多次 LLM 调用
# 实际使用时需要策略性地控制搜索空间

cost_optimization = {
    "减少迭代次数": "从 50 降到 10-20，牺牲少量质量换取大幅降低成本",
    "缩小分支因子": "每步生成 2-3 个候选而非 5-10 个",
    "用小模型做模拟": "扩展用大模型，模拟评估用小模型",
    "早期终止": "找到足够好的方案就停止，不追求最优",
    "缓存重复状态": "相同状态不重复评估",
}
```

</div>

---

<div class="question-card compact-card" id="056-mcts-in-agent-planning-2">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">常见误区 / 面试追问</span></h2>

1. **误区："MCTS 只适合棋类游戏"** — MCTS 是通用的搜索框架。LATS 证明它在编程、网页导航、推理等 Agent 任务上都有效。关键是需要定义好"状态"、"动作"和"价值函数"——LLM 可以同时充当这三者。

2. **误区："MCTS 保证找到最优解"** — MCTS 是近似算法，理论上无限迭代才收敛到最优。实际中迭代次数有限，只能找到"足够好"的方案。但相比贪心搜索，MCTS 通过探索-利用平衡显著降低了陷入局部最优的风险。

3. **追问："LATS 和 Reflexion 有什么区别？"** — Reflexion 是从失败中学习并重试（线性），LATS 是在搜索树中探索多条路径并利用反思信息引导搜索（树形）。LATS 包含了 Reflexion 的自我反思能力，但搜索策略更系统化。

4. **追问："MCTS 在生产 Agent 系统中实用吗？"** — 对于高价值、允许高延迟的任务（如代码生成、复杂分析）非常实用。对于实时对话等低延迟场景，MCTS 的成本太高。生产中常用简化版——减少迭代次数、缩小搜索空间。

</div>

---

<div class="question-card compact-card" id="056-mcts-in-agent-planning-3">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">参考资料</span></h2>

- [Language Agent Tree Search (LATS) - ICML 2024 (arXiv)](https://arxiv.org/abs/2310.04406)
- [LATS Official Implementation (GitHub)](https://github.com/lapisrocks/LanguageAgentTreeSearch)
- [ReST-MCTS*: LLM Self-Training via Process Reward Guided Tree Search (NeurIPS 2024)](https://proceedings.neurips.cc/paper_files/paper/2024/file/76ec4dc30e9faaf0e4b6093eaa377218-Paper-Conference.pdf)
- [DSG-MCTS: Dynamic Strategy-Guided MCTS for LLM Reasoning (EMNLP 2025)](https://aclanthology.org/2025.emnlp-main.532.pdf)
- [ThoughtSculpt: Reasoning with MCTS (Prompt Engineering Guide)](https://www.promptingguide.ai/research/thoughtsculpt)

</div>

---

<div class="question-card compact-card" id="057-reasoning-quality-evaluation-1">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">详细解析</span></h2>

### 推理评估的层次模型

```
Level 4: 任务完成度
  "Agent 是否完成了用户的请求？"
  │
Level 3: 推理路径质量
  "推理过程是否高效、合理？"
  │
Level 2: 工具使用合理性
  "是否选择了正确的工具？参数是否正确？"
  │
Level 1: 单步推理正确性
  "每一步推理是否逻辑正确？"

全面评估需要覆盖所有 4 个层次
```

### 评估维度详解

```python
reasoning_evaluation_dimensions = {
    "逻辑正确性": {
        "定义": "每步推理是否遵循逻辑规则",
        "检查项": [
            "前提是否支持结论",
            "是否存在逻辑谬误",
            "数学计算是否正确",
        ],
        "评估方法": "Process Reward Model / 人工标注",
    },
    "忠实性 (Faithfulness)": {
        "定义": "推理链是否真实反映模型的实际决策过程",
        "问题": "模型可能先得出答案再编造推理过程（事后合理化）",
        "检查方法": "修改推理链的关键步骤，看是否改变最终答案",
        "前沿": "OpenAI 的 CoT Monitorability 研究",
    },
    "完整性": {
        "定义": "是否覆盖了所有必要的推理步骤",
        "问题": "跳步推理可能隐藏错误",
        "检查项": ["是否有遗漏的关键信息", "是否考虑了边界情况"],
    },
    "效率": {
        "定义": "是否用最少的步骤和工具调用达到目标",
        "指标": ["步骤数", "工具调用次数", "token 消耗量"],
    },
    "鲁棒性": {
        "定义": "面对干扰信息是否保持正确推理",
        "测试方法": "在问题中加入无关信息，看是否被误导",
    },
}
```

### 评估方法 1：Process Reward Model (PRM)

```python
class ProcessRewardModel:
    """对推理过程的每一步打分"""

    def evaluate_reasoning(self, problem, reasoning_steps):
        """
        PRM vs ORM (Outcome Reward Model):
        - ORM: 只看最终答案是否正确 → 无法定位错误在哪一步
        - PRM: 对每一步打分 → 精确定位第一个出错的步骤
        """
        step_scores = []
        for i, step in enumerate(reasoning_steps):
            score = self.prm_model.score(
                problem=problem,
                previous_steps=reasoning_steps[:i],
                current_step=step
            )
            step_scores.append({
                "step": i + 1,
                "content": step,
                "score": score,  # 0-1, 越高越正确
                "is_correct": score > 0.5,
            })
        return step_scores

    # 示例输出
    # Step 1: "总共有 15 × 20 = 300 个苹果" → score: 0.95 ✓
    # Step 2: "卖掉了 120 个"               → score: 0.90 ✓
    # Step 3: "剩余 300 + 120 = 420 个"     → score: 0.05 ✗ (应该是减法)
```

### 评估方法 2：LLM-as-Judge

```python
async def llm_judge_reasoning(problem, agent_reasoning, reference=None):
    """用 LLM 评估推理质量"""
    prompt = f"""
    请评估以下 Agent 的推理过程质量。

    问题：{problem}
    Agent 的推理过程：{agent_reasoning}
    {"参考答案：" + reference if reference else ""}

    请从以下维度评分（1-5分）：

    1. 逻辑正确性：每步推理是否逻辑自洽？
    2. 完整性：是否覆盖了所有关键步骤？
    3. 效率：是否存在不必要的冗余步骤？
    4. 工具使用：是否选择了正确的工具和参数？
    5. 最终结论：最终答案是否正确？

    对每个维度给出分数和理由。
    """
    return await judge_llm.invoke(prompt)

# 注意 LLM-as-Judge 的局限：
# - 位置偏差：倾向于给排在前面的答案更高分
# - 冗长偏差：倾向于给更长的回答更高分
# - 自我偏好：倾向于给与自己风格相似的回答更高分
```

### 评估方法 3：Agent 专用基准

```python
agent_benchmarks = {
    # 编程推理
    "HumanEval": {
        "任务": "根据描述生成 Python 函数",
        "指标": "Pass@k（k 次尝试内至少一次通过测试）",
        "评估": "自动化（运行测试用例）",
    },
    "SWE-bench": {
        "任务": "修复真实 GitHub Issue",
        "指标": "Resolved Rate（成功修复的比例）",
        "评估": "自动化（运行项目测试套件）",
    },
    # 网页交互推理
    "WebArena": {
        "任务": "在真实网站上完成复杂任务",
        "指标": "Task Success Rate",
        "评估": "自动化（检查最终页面状态）",
    },
    # 数学推理
    "MATH / GSM8K": {
        "任务": "解决数学问题",
        "指标": "Accuracy（答案准确率）",
        "评估": "自动化（精确匹配答案）",
    },
    # 通用推理
    "ARC-AGI": {
        "任务": "抽象推理和模式识别",
        "指标": "Accuracy",
        "评估": "自动化（精确匹配输出网格）",
    },
}
```

### 多维评估框架

```python
class AgentReasoningEvaluator:
    """综合评估 Agent 推理质量"""

    async def evaluate(self, task, agent_trajectory):
        scores = {}

        # 维度 1：任务完成度（结果评估）
        scores["task_completion"] = await self.check_task_result(
            task, agent_trajectory.final_output
        )

        # 维度 2：推理正确性（过程评估）
        scores["reasoning_correctness"] = await self.evaluate_steps(
            agent_trajectory.thought_steps
        )

        # 维度 3：工具使用质量
        scores["tool_usage"] = self.evaluate_tool_calls(
            agent_trajectory.tool_calls,
            expected_tools=task.available_tools
        )

        # 维度 4：效率
        scores["efficiency"] = {
            "steps": len(agent_trajectory.steps),
            "tool_calls": len(agent_trajectory.tool_calls),
            "tokens_used": agent_trajectory.total_tokens,
            "time_taken": agent_trajectory.duration,
        }

        # 维度 5：安全性
        scores["safety"] = self.check_safety(
            agent_trajectory.all_actions
        )

        return scores
```

### Trace-based 评估（生产环境）

```python
# 生产环境中通过 Trace 评估推理质量
trace_evaluation = {
    "Trace 结构": {
        "Span": "每个推理步骤/工具调用是一个 Span",
        "属性": "输入、输出、延迟、token 消耗",
        "父子关系": "追踪推理的层次结构",
    },
    "自动评估规则": [
        "推理步骤数 > 阈值 → 可能陷入循环",
        "工具调用失败率 > 30% → 工具选择策略有问题",
        "同一工具连续调用 > 3 次 → 可能在重试无效操作",
        "总 token 消耗异常 → 推理效率低",
    ],
    "工具": ["Langfuse", "LangSmith", "Arize Phoenix"],
}
```

</div>

---

<div class="question-card compact-card" id="057-reasoning-quality-evaluation-2">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">常见误区 / 面试追问</span></h2>

1. **误区："答案正确就说明推理正确"** — 模型可能因为错误的推理偶然得到正确答案（right answer, wrong reason）。只评估结果会高估模型的推理能力。PRM 等过程评估方法能发现这类问题。

2. **误区："推理链越长越好"** — 冗长的推理链可能包含大量无关信息，增加出错概率。好的推理应该是简洁、高效、每步都有信息增量的。

3. **追问："如何评估推理的忠实性（Faithfulness）？"** — 核心方法：修改推理链中的关键步骤（如改变中间计算结果），如果最终答案不变，说明模型没有真正依赖这些推理步骤——推理链是"装饰性"的而非功能性的。OpenAI 的 CoT Monitorability 研究正在系统性地探索这个问题。

4. **追问："过程评估（PRM）和结果评估（ORM）哪个更好？"** — PRM 更适合训练和调试（能定位错误步骤），ORM 更适合大规模自动评估（实现简单）。理想方案是两者结合：ORM 做初筛，PRM 对有争议的案例做深入分析。

</div>

---

<div class="question-card compact-card" id="057-reasoning-quality-evaluation-3">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">参考资料</span></h2>

- [Evaluation and Benchmarking of LLM Agents: A Survey (ACL 2025)](https://arxiv.org/html/2507.21504v1)
- [How to Evaluate LLM Agents: Complete Guide (Medium)](https://medium.com/@dilawar.yadav/how-to-evaluate-llm-agents-complete-guide-to-metrics-methods-and-tools-77cca94cde33)
- [LLM Agent Evaluation: Assessing Tool Use, Task Completion (Confident AI)](https://www.confident-ai.com/blog/llm-agent-evaluation-complete-guide)
- [Evaluating Chain-of-Thought Monitorability (OpenAI)](https://openai.com/index/evaluating-chain-of-thought-monitorability/)
- [Evaluating LLM-based Agents: Metrics, Benchmarks, and Best Practices](https://samiranama.com/posts/Evaluating-LLM-based-Agents-Metrics,-Benchmarks,-and-Best-Practices/)

</div>

---

<div class="question-card compact-card" id="058-causal-reasoning-1">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">详细解析</span></h2>

### Pearl 的因果阶梯与 LLM 能力

```
因果阶梯（Ladder of Causation）：

Level 3: 反事实（Counterfactual）
  "如果昨天没下雨，路面会干吗？"
  → 需要想象一个没有发生的世界
  → LLM 能力：最弱，容易产生幻觉

Level 2: 干预（Intervention）
  "如果我浇水，植物会长好吗？"
  → 需要预测行动的后果
  → LLM 能力：中等，有常识但不精确

Level 1: 关联（Association）
  "看到湿地面，是否下过雨？"
  → 基于观察数据的模式匹配
  → LLM 能力：最强，这是语言模型的本职

Agent 决策主要需要 Level 2（干预）能力：
"如果我执行这个工具调用，会产生什么后果？"
```

### LLM 因果推理的局限

```python
# 实验证据：LLM 在因果推理上的表现

causal_reasoning_performance = {
    "因果发现（从数据中发现因果关系）": {
        "GPT-4 表现": "在简单场景下接近人类",
        "局限": "变量数 > 5 时准确率急剧下降",
    },
    "因果推断（给定因果图做推断）": {
        "GPT-4 表现": "在文本描述的因果关系上较好",
        "局限": "无法做精确的数值因果推断（如 ATE 计算）",
    },
    "反事实推理": {
        "GPT-4 表现": "简单反事实可以，复杂的容易出错",
        "局限": "容易混淆相关性和因果性",
    },
}

# 典型错误示例
example_failure = """
问题：冰淇淋销量增加时，溺水人数也增加。
      增加冰淇淋销量会导致更多溺水吗？

LLM 常见错误回答：是的，可能因为...（编造理由）
正确答案：不会。两者都是由"气温升高"这个共因造成的。
         这是典型的混淆变量（confounding）问题。
"""
```

### 因果 Agent 框架

```python
class CausalAgent:
    """集成因果推理能力的 Agent"""

    def __init__(self, llm, causal_tools):
        self.llm = llm
        self.tools = {
            "causal_discovery": CausalDiscoveryTool(),  # 从数据发现因果关系
            "causal_inference": CausalInferenceTool(),   # 因果效应估计
            "counterfactual": CounterfactualTool(),      # 反事实分析
            "graph_builder": CausalGraphBuilder(),       # 构建因果图
        }

    async def make_decision(self, question, data):
        # 步骤 1：LLM 理解问题，提取变量
        variables = await self.llm.extract_variables(question)

        # 步骤 2：用因果发现工具构建因果图
        causal_graph = await self.tools["causal_discovery"].discover(
            data=data, variables=variables
        )
        # 例如：气温 → 冰淇淋销量, 气温 → 溺水人数

        # 步骤 3：用因果推断工具估计干预效果
        effect = await self.tools["causal_inference"].estimate(
            graph=causal_graph,
            treatment="冰淇淋销量",
            outcome="溺水人数",
            data=data
        )
        # 结果：控制气温后，冰淇淋对溺水的因果效应 ≈ 0

        # 步骤 4：LLM 综合因果分析结果给出最终回答
        answer = await self.llm.synthesize(
            question=question,
            causal_graph=causal_graph,
            causal_effect=effect
        )
        return answer
```

### 因果推理在 Agent 规划中的应用

```python
class CausalPlanner:
    """用因果模型增强 Agent 的规划能力"""

    async def plan_with_causality(self, task, world_model):
        # 1. 生成候选计划
        candidates = await self.generate_plans(task)

        # 2. 用因果模型验证每个计划
        valid_plans = []
        for plan in candidates:
            # 模拟干预效果
            is_valid = True
            for step in plan.steps:
                # 问因果模型：执行这步会产生什么后果？
                effects = world_model.do(step.action)

                # 检查后果是否包含不期望的副作用
                if self.has_negative_side_effects(effects):
                    is_valid = False
                    break

                # 检查后果是否推进目标
                if not self.advances_goal(effects, task.goal):
                    is_valid = False
                    break

            if is_valid:
                valid_plans.append(plan)

        # 3. 选择因果路径最清晰的计划
        return self.select_best(valid_plans)

    def has_negative_side_effects(self, effects):
        """因果模型可以预测干预的副作用"""
        # 例如：删除一个文件 → 因果模型知道依赖这个文件的服务会崩溃
        return any(e.is_negative for e in effects.side_effects)
```

### 因果推理 vs 相关性推理的对比

```
场景：Agent 需要决定是否推荐用户升级套餐

相关性推理（LLM 默认）：
  "升级套餐的用户满意度更高 → 推荐升级"
  问题：可能是本来就满意的用户更愿意升级（选择偏差）

因果推理（因果模型增强）：
  "控制用户基线满意度后，升级套餐的因果效应 = +5%"
  "但对已经不满意的用户，升级不会改善满意度"
  结论：只推荐给特定类型的用户

因果推理让 Agent 的决策从"看起来对"变成"真正对"
```

### 前沿研究方向

```python
frontier_research = {
    "Causal Agent (2024)": {
        "论文": "Causal Agent based on Large Language Model",
        "贡献": "将因果发现、推断、反事实工具化，让 LLM 通过工具调用获得因果推理能力",
    },
    "Causal-aware LLMs (IJCAI 2025)": {
        "贡献": "将因果知识注入 LLM 训练过程，提升策略学习能力",
        "方法": "因果图引导的强化学习",
    },
    "Causal AI + RAG (2026 趋势)": {
        "理念": "因果推理 + CoT + RAG 融合",
        "目标": "从生成看似合理的输出到生成决策级别的输出",
    },
    "MRAgent (2025)": {
        "任务": "自动化孟德尔随机化因果推断",
        "方法": "LLM Agent 自主扫描文献、发现因果假设、执行统计验证",
    },
}
```

### 实际应用场景

```
因果推理在 Agent 中的价值场景：

1. 医疗决策：
   "这个药物是否真的有效？"
   → 需要区分药物效果 vs 安慰剂效应 vs 自然恢复

2. 商业策略：
   "打折是否真的增加了利润？"
   → 需要控制季节性因素和竞争对手行为

3. 故障诊断：
   "服务器 A 宕机是否是因为数据库 B 过载？"
   → 需要追踪因果链：B过载 → 查询超时 → A 的请求堆积 → A 宕机

4. A/B 测试分析：
   "新功能是否提升了用户留存？"
   → 因果推断（而非简单的均值对比）考虑混淆变量
```

</div>

---

<div class="question-card compact-card" id="058-causal-reasoning-2">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">常见误区 / 面试追问</span></h2>

1. **误区："LLM 的常识推理就是因果推理"** — LLM 的"常识"来自训练数据中的统计模式（相关性），不是真正的因果理解。LLM 可能知道"下雨→路滑"，但这是从文本中学到的共现模式，不是从物理因果关系推导出来的。差异在极端情况下显现。

2. **误区："因果推理太学术了，Agent 不需要"** — 在 Agent 做出有后果的决策时（推荐、诊断、规划），因果推理直接影响决策质量。一个理解因果关系的 Agent 不会犯"冰淇淋导致溺水"类的错误，而这类错误在现实业务中可能代价巨大。

3. **追问："如何让 LLM Agent 获得因果推理能力？"** — 三种路径：(1) 工具增强——给 Agent 因果发现和推断的工具（如 DoWhy、CausalNex）；(2) Prompt 增强——在 Prompt 中显式要求考虑混淆变量和因果方向；(3) 训练增强——用因果数据微调模型（如 Causal-aware LLMs）。

4. **追问："因果推理和 ReAct 模式的关系？"** — ReAct 的 Thought 步骤可以融入因果推理——Agent 在决策前先思考"如果我执行这个动作，因果链是什么？有哪些潜在的混淆因素？"这比直接选择工具更慎重，但增加了推理步骤和延迟。

</div>

---

<div class="question-card compact-card" id="058-causal-reasoning-3">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">参考资料</span></h2>

- [Causal Agent based on Large Language Model (arXiv)](https://arxiv.org/html/2408.06849v2)
- [Causal-aware LLMs: Enhancing Policy Learning (IJCAI 2025)](https://www.ijcai.org/proceedings/2025/0478.pdf)
- [Judea Pearl on LLMs, Causal Reasoning, and the Future of AI (CausalAI)](https://causalai.causalens.com/resources/blog/judea-pearl-on-the-future-of-ai-llms-and-need-for-causal-reasoning/)
- [Evaluating Causal Reasoning Capabilities of LLMs (MDPI Electronics)](https://www.mdpi.com/2079-9292/13/23/4584)
- [Causality in Agentic AI (Medium)](https://medium.com/@slhebner/causality-in-agentic-ai-1d9b8b852b34)

</div>

---

<div class="question-card compact-card" id="103-agentic-rl-grpo-1">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">详细解析</span></h2>

### Agentic-RL vs 传统 RLHF

```
传统 RLHF（对齐人类偏好）：
┌──────────┐    ┌──────────────┐    ┌──────────────┐
│  Prompt   │ →  │  LLM 生成     │ →  │ 人类标注偏好   │
└──────────┘    │  两个回答      │    │ A > B         │
                └──────────────┘    └──────┬───────┘
                                          ↓
                                   ┌──────────────┐
                                   │ Reward Model  │
                                   │ 学习偏好打分   │
                                   └──────┬───────┘
                                          ↓
                                   ┌──────────────┐
                                   │ PPO 优化策略   │
                                   │ 目标：讨人喜欢  │
                                   └──────────────┘

Agentic-RL（训练任务执行能力）：
┌──────────┐    ┌──────────────┐    ┌──────────────────┐
│ 任务指令   │ →  │  Agent 执行    │ →  │ 环境反馈 / 规则   │
└──────────┘    │  工具调用序列   │    │ 自动计算奖励      │
                └──────────────┘    └──────┬───────────┘
                                          ↓
                                   ┌──────────────────┐
                                   │ GRPO / PPO 优化    │
                                   │ 目标：完成任务      │
                                   └──────────────────┘
```

```python
# 两种 RL 范式的对比
rl_paradigms = {
    "传统 RLHF": {
        "目标": "对齐人类偏好（helpful, harmless, honest）",
        "奖励来源": "人类标注 → Reward Model 打分",
        "训练信号": "回答 A 比回答 B 更好",
        "典型场景": "聊天、创意写作、安全对齐",
    },
    "Agentic-RL": {
        "目标": "提升任务执行能力（工具调用、规划、推理）",
        "奖励来源": "任务环境自动评估（可验证奖励）",
        "训练信号": "任务是否完成、执行效率、步骤正确性",
        "典型场景": "Agent 工具调用、代码生成、多步推理",
    },
}
```

### 完整训练流程

```
Agentic-RL 训练 Pipeline：

阶段 1: SFT 冷启动
┌─────────────────────────────────────────────────┐
│  收集少量高质量 Agent 轨迹（人工标注或专家模型生成）  │
│  → 监督微调，让模型学会基本的工具调用格式和流程       │
│  → 输出：会调用工具但策略粗糙的基座 Agent            │
└─────────────────────────┬───────────────────────┘
                          ↓
阶段 2: 奖励函数定义
┌─────────────────────────────────────────────────┐
│  设计多维度奖励信号（规则 + 模型混合）：              │
│  ├─ 任务完成度：最终结果是否正确（0/1 或连续分）      │
│  ├─ 工具使用准确率：调用了正确的工具和参数            │
│  ├─ 步骤简洁性：用更少步骤完成任务                   │
│  └─ 格式遵循度：输出符合预期的结构化格式             │
└─────────────────────────┬───────────────────────┘
                          ↓
阶段 3: GRPO / PPO 策略优化
┌─────────────────────────────────────────────────┐
│  对同一 prompt 采样 G 个完整 Agent 轨迹              │
│  → 用奖励函数为每条轨迹打分                         │
│  → 计算组内相对 advantage（GRPO）                    │
│  → 更新策略，提升高奖励轨迹的概率                    │
│  → 迭代直到收敛                                    │
└─────────────────────────┬───────────────────────┘
                          ↓
阶段 4（可选）: 拒绝采样 + 二次 SFT
┌─────────────────────────────────────────────────┐
│  用 RL 模型生成大量轨迹，筛选高奖励的作为新 SFT 数据  │
│  → 进一步蒸馏 RL 学到的策略到监督学习中               │
└─────────────────────────────────────────────────┘
```

### GRPO vs PPO：核心算法差异

```
PPO（Proximal Policy Optimization）：
┌──────────┐   ┌──────────┐   ┌──────────────┐
│ Actor    │ → │ 生成响应  │ → │ Critic Model │
│ (策略网络)│   │          │   │ 估计 V(s)    │
└──────────┘   └──────────┘   └──────┬───────┘
                                     ↓
                              Advantage = R - V(s)
                              (需要额外训练一个 Critic)
                                     ↓
                              ┌──────────────┐
                              │ PPO Clipping  │
                              │ 更新 Actor    │
                              └──────────────┘

GRPO（Group Relative Policy Optimization）：
┌──────────┐   ┌───────────────────┐
│ Policy   │ → │ 同一 prompt 采样   │
│ (策略网络)│   │ G 个响应           │
└──────────┘   └────────┬──────────┘
                        ↓
               ┌────────────────────┐
               │ 每个响应计算奖励 r_i │
               │ r_1, r_2, ..., r_G │
               └────────┬──────────┘
                        ↓
               ┌────────────────────────────┐
               │ 组内标准化：                 │
               │ Â_i = (r_i - mean) / std   │
               │ → 不需要 Critic Model！      │
               └────────┬──────────────────┘
                        ↓
               ┌────────────────────┐
               │ 带 KL 惩罚的策略更新 │
               │ 更新 Policy         │
               └────────────────────┘
```

```python
import torch
import torch.nn.functional as F

class GRPOTrainer:
    """简化版 GRPO 训练循环"""

    def __init__(self, policy_model, ref_model, reward_fn,
                 group_size=8, kl_coeff=0.05, clip_eps=0.2, lr=1e-6):
        self.policy = policy_model       # 当前策略（要训练的 Agent）
        self.ref = ref_model             # 参考策略（SFT 后冻结的模型）
        self.reward_fn = reward_fn       # 奖励函数
        self.G = group_size              # 每组采样数量
        self.kl_coeff = kl_coeff         # KL 散度惩罚系数
        self.clip_eps = clip_eps         # PPO-style 裁剪范围
        self.optimizer = torch.optim.Adam(self.policy.parameters(), lr=lr)

    def compute_group_advantage(self, rewards: torch.Tensor) -> torch.Tensor:
        """
        GRPO 的核心：组内相对排名计算 advantage
        不需要 Critic Model，直接用组内统计量归一化
        """
        # rewards: shape (G,)，G 个响应的奖励值
        mean = rewards.mean()
        std = rewards.std() + 1e-8   # 避免除零
        advantages = (rewards - mean) / std  # 组内标准化
        return advantages

    def grpo_loss(self, prompt_tokens, response_tokens_group,
                  advantages, old_logprobs):
        """
        计算 GRPO 策略梯度损失
        """
        total_loss = 0.0
        for i in range(self.G):
            # 计算当前策略下的 log 概率
            new_logprob = self.policy.log_prob(
                prompt_tokens, response_tokens_group[i]
            )
            # 计算参考策略下的 log 概率（用于 KL 惩罚）
            with torch.no_grad():
                ref_logprob = self.ref.log_prob(
                    prompt_tokens, response_tokens_group[i]
                )

            # 重要性采样比率
            ratio = torch.exp(new_logprob - old_logprobs[i])

            # PPO-style 裁剪
            clipped_ratio = torch.clamp(ratio, 1 - self.clip_eps, 1 + self.clip_eps)
            policy_loss = -torch.min(
                ratio * advantages[i],
                clipped_ratio * advantages[i]
            )

            # KL 散度惩罚（K3 unbiased estimator）：防止策略偏离参考模型太远
            # 原论文 DeepSeekMath (arXiv:2402.03300) 使用的是 K3 无偏估计：
            #   KL ≈ exp(r-n) - (r-n) - 1，其中 r = ref_logprob, n = new_logprob
            # 这个估计始终 ≥ 0，期望值等于真 KL 散度，方差低于线性差分。
            log_ratio = ref_logprob - new_logprob
            kl_penalty = self.kl_coeff * (torch.exp(log_ratio) - log_ratio - 1)

            total_loss += (policy_loss + kl_penalty).mean()

        return total_loss / self.G

    def train_step(self, prompts_batch):
        """单步 GRPO 训练"""
        batch_loss = 0.0

        for prompt in prompts_batch:
            # Step 1: 对同一 prompt 采样 G 个完整轨迹
            responses = []
            old_logprobs = []
            for _ in range(self.G):
                with torch.no_grad():
                    response, logprob = self.policy.sample(prompt)
                    responses.append(response)
                    old_logprobs.append(logprob)

            # Step 2: 计算每个响应的奖励
            rewards = torch.tensor([
                self.reward_fn(prompt, resp) for resp in responses
            ])

            # Step 3: 组内相对排名 → advantage（GRPO 核心）
            advantages = self.compute_group_advantage(rewards)

            # Step 4: 计算 GRPO 损失并更新
            loss = self.grpo_loss(prompt, responses, advantages, old_logprobs)
            batch_loss += loss

        # 反向传播与参数更新
        self.optimizer.zero_grad()
        batch_loss.backward()
        self.optimizer.step()

        return batch_loss.item()
```

### GRPO vs PPO 对比表

```
┌─────────────────┬──────────────────────┬──────────────────────┐
│ 维度             │ PPO                  │ GRPO                 │
├─────────────────┼──────────────────────┼──────────────────────┤
│ Critic Model    │ 需要（额外训练开销大） │ 不需要（节省 ~50% 显存）│
│ Advantage 计算  │ A = R - V(s)         │ A = (r-mean)/std     │
│                 │ 依赖 Value Function  │ 依赖组内相对排名       │
│ 采样方式         │ 每个 prompt 1 个响应  │ 每个 prompt G 个响应  │
│ 训练稳定性       │ 依赖 Critic 质量     │ 依赖组大小 G         │
│ 显存占用         │ Actor + Critic       │ 仅 Policy + Ref      │
│ 代表应用         │ ChatGPT/InstructGPT  │ DeepSeek-R1          │
│ 适合场景         │ 通用 RLHF            │ 可验证奖励的任务       │
└─────────────────┴──────────────────────┴──────────────────────┘
```

### 奖励函数设计：Agentic-RL 的核心难点

```python
def compute_agent_reward(prompt, trajectory, max_steps=20):
    """
    Agent 任务的多维度奖励函数
    trajectory: Agent 执行的完整轨迹（思考 + 工具调用 + 结果）
    """
    # 维度 1：任务完成度（权重最高，可验证任务直接判正误）
    completion = 1.0 if trajectory.final_answer == get_ground_truth(prompt) \
                 else partial_match_score(trajectory.final_answer, prompt)

    # 维度 2：工具使用准确率（调用了正确的工具和参数）
    tool_calls = trajectory.get_tool_calls()
    tool_acc = sum(tc.is_valid() for tc in tool_calls) / max(len(tool_calls), 1)

    # 维度 3：步骤简洁性（用更少步骤完成 → 更高奖励）
    efficiency = max(0, 1.0 - len(trajectory.steps) / max_steps)

    # 维度 4：格式遵循度（输出符合 JSON / 函数调用格式等）
    format_score = max(0, 1.0 - 0.2 * trajectory.count_format_violations())

    # 加权求和——任务完成度占主导，避免 reward hacking
    return 0.50 * completion + 0.20 * tool_acc + 0.15 * efficiency + 0.15 * format_score
```

### DeepSeek-R1 训练范式：Agentic-RL 的成功案例

```python
# DeepSeek-R1 五阶段训练流程
# Step 1 → 基座模型 DeepSeek-V3 (671B MoE)
# Step 2 → Cold Start SFT：数千条高质量长 CoT 数据，教模型"开始思考"
# Step 3 → 大规模 GRPO（核心阶段）
# Step 4 → Rejection Sampling + SFT（蒸馏 RL 策略）
# Step 5 → 第二轮 RL（加入 helpfulness / safety 奖励）

r1_grpo_config = {
    "group_size": 64,              # 每个 prompt 采样 64 个响应
    "sampling_temperature": 1.0,
    "kl_coefficient": 0.05,
    "clip_range": 0.2,
    "max_response_length": 32768,  # 支持超长推理链
    "reward_design": {
        "数学": "答案与 ground truth 精确匹配",
        "代码": "通过编译器 / 测试用例验证",
        "格式": "正则匹配 <think>...</think> 标签",
    },
}

# GRPO 训练中涌现的关键行为（无人工设计，纯 RL 自发习得）
emergent_behaviors = [
    "自发长思考链——模型自主学会生成数千 token 的推理过程",
    "Aha moment——模型学会说 'Wait, let me reconsider...' 并自我纠错",
    "多角度验证——用不同方法交叉检验同一结论",
    "思考时间自适应——简单题想得少，难题想得多",
]
```

### GRPO 之后：2025-2026 后续算法演进

GRPO 不是终点。2025 开始陆续出现一批"GRPO 后续"，主要解决 GRPO 在长 trajectory、稀疏奖励、训练稳定性上的痛点：

```python
post_grpo_algorithms = {
    "DAPO (ByteDance, 2025)": {
        "全称": "Dynamic Sampling Policy Optimization",
        "改进点": (
            "1. Clip-Higher：放宽正向 ratio 的裁剪上界，缓解 entropy collapse；"
            "2. Dynamic Sampling：剔除组内全对/全错样本（advantage 全 0 无梯度）；"
            "3. Token-level loss：长序列按 token 而非 sequence 平均；"
            "4. Overlong-shaping：长输出软惩罚而非硬截断"
        ),
        "效果": "AIME 2024 使用 Qwen2.5-32B 在 50% steps 内超过 R1-Zero",
        "开源": "ByteDance 公开了完整训练栈（含数据 + 代码）",
    },
    "GSPO (Qwen Team, 2025)": {
        "全称": "Group Sequence Policy Optimization",
        "改进点": "把 ratio/clipping 从 token 级别上升到 sequence 级别，解决长 CoT 训练不稳",
        "应用": "Qwen3 系列推理模型训练",
    },
    "REINFORCE++/RLOO 改进": {
        "思路": "把 GRPO 退化为更简单的 REINFORCE + baseline 估计",
        "代表": "RLOO（Removed-One-Out baseline）、Reinforce++（NousResearch）",
    },
    "VAPO / Loop-GRPO / DR-GRPO": {
        "方向": "Value-augmented、loop-aware、debiased GRPO 等多个支线",
        "共识": "GRPO 是 2025 后训练范式的事实基线，但需要针对具体任务大量改良",
    },
}
```

关键观察：**2026 工业界训练推理/Agent 模型时已经很少直接用 paper-version GRPO**，几乎都跑在 DAPO/GSPO 这一代改良算法上。面试中如果只能说出 "GRPO = DeepSeek-R1"，会显得知识停在 2025-01。

### 从 RLHF 到 Agentic-RL 的演进路线

```
┌─────────────┐   ┌──────────────┐   ┌──────────────────┐
│ RLHF        │ → │ RLAIF        │ → │ Agentic-RL       │
│ (2022-2023)  │   │ (2023-2024)  │   │ (2024-2025+)     │
├─────────────┤   ├──────────────┤   ├──────────────────┤
│ 人类偏好对齐  │   │ AI 反馈对齐   │   │ 任务环境反馈      │
│ 对话质量      │   │ 规模化标注    │   │ 工具调用 + 规划   │
│ PPO          │   │ PPO/DPO      │   │ GRPO / REINFORCE │
│ ChatGPT      │   │ Claude       │   │ DeepSeek-R1      │
│ 通用对话      │   │ 通用对话      │   │ Agent / 推理      │
└─────────────┘   └──────────────┘   └──────────────────┘
```

</div>

---

<div class="question-card compact-card" id="103-agentic-rl-grpo-2">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">常见误区 / 面试追问</span></h2>

1. **误区："RLHF 和 Agentic-RL 是一回事"** — 两者都用强化学习优化 LLM，但目标截然不同。RLHF 优化的是人类偏好（"这个回答好不好"），依赖人类标注训练 Reward Model；Agentic-RL 优化的是任务执行能力（"任务完成了没有"），奖励信号来自环境的可验证反馈（代码是否通过测试、答案是否正确）。这导致 Agentic-RL 可以大规模自动化生成训练信号，不受人类标注瓶颈限制。

2. **误区："RL 训练 Agent 不需要 SFT 冷启动"** — DeepSeek 的实验（R1-Zero）表明，纯 RL 训练虽然能涌现推理能力，但存在两个严重问题：(1) 输出可读性差，常混合多种语言；(2) 训练初期的探索效率极低，模型可能长时间在无意义的行为空间中徘徊。Cold Start SFT 用少量高质量数据给模型一个"起跑点"，显著提升了训练效率和最终输出质量。

3. **追问："如何设计 Agent 任务的奖励函数？"** — 核心原则是"可验证 + 多维度"。对于可验证任务（数学、代码），直接用答案正确性作为主奖励信号；对于不可验证任务（开放式规划），需要 LLM-as-Judge 或人类评估。多维度设计很关键：除任务完成度外，还应奖励工具使用的准确性、执行效率（更少步骤）和格式规范性。权重分配上，任务完成度应占 50% 以上，避免模型学会"格式正确但不解决问题"的 reward hacking 行为。

4. **追问："Agentic-RL 的训练数据如何采集？"** — 分阶段采集。SFT 阶段需要少量高质量 Agent 轨迹（专家标注或强模型生成，通常几千到几万条）。RL 阶段的核心优势是数据可以自动生成：设定任务 prompt → Agent 自由探索 → 环境自动打分。关键挑战是任务分布的多样性——需要覆盖不同难度、不同工具组合、不同领域的任务，否则模型只会在训练分布内表现好。实践中常用课程学习（Curriculum Learning），从简单任务开始逐步增加难度。

</div>

---

<div class="question-card compact-card" id="103-agentic-rl-grpo-3">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">参考资料</span></h2>

- [DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via RL (DeepSeek)](https://arxiv.org/abs/2501.12948)
- [DeepSeekMath: Pushing the Limits of Mathematical Reasoning (GRPO 算法原始论文)](https://arxiv.org/abs/2402.03300)
- [Demystifying Reasoning Models (Cameron R. Wolfe)](https://cameronrwolfe.substack.com/p/demystifying-reasoning-models)
- [Search, Verify, and Feedback: Towards Next Generation Post-training Paradigm of Foundation Models (arXiv)](https://arxiv.org/abs/2411.11504)
- [Agent Q: Advanced Reasoning and Learning for Autonomous AI Agents (arXiv)](https://arxiv.org/abs/2408.07199)

</div>
