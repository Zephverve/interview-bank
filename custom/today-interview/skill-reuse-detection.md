---
title: 保存 Skill 后如何检测同类任务并复用
round: 二面
difficulty: ⭐⭐⭐⭐
tags: [Agent, Skill, 记忆]
point: 任务相似度与 SOP 复用
---

**题目**：在保存一个 skill 后，怎么能再有一个任务可以检测到两类任务是同一类，然后复用这个 skill？

**结论句（15 秒）**：任务进来先打意图标签跑粗筛、再语义检索做精准匹配；相似度高直接加载 SOP 执行；执行后验证成败，决定留存还是降权。

**追问方向**：和纯向量记忆比？ · skill 过时怎么办？ · 误匹配怎么防？

### 回答

"这个问题本质是**怎么让 Agent 积累经验而不是每次都从零摸索**。我分三步讲：SOP 长什么样、怎么匹配、怎么防止匹配错。

**第一步：SOP 长什么样。**

不是把整段对话存成 embedding。我们存的是一份**结构化程序**，字段大概是：

```yaml
skill_id: "pdf-batch-merge"
trigger_intent: ["pdf", "merge", "batch", "combine"]
task_description: "把多个 PDF 文件合并为一个，输出到指定目录"
preconditions: ["输入路径下有多个 PDF", "输出目录可写"]
steps:
  - step: 1
    action: "list_files"
    params: { pattern: "*.pdf", recursive: false }
  - step: 2
    action: "ask_user"
    params: { question: "确认合并以下 {file_count} 个文件？" }
  - step: 3
    action: "run_python"
    params: { library: "pypdf", script_template: "merge_pdfs.py" }
  - step: 4
    action: "write_file"
    params: { path: "{output_dir}/merged.pdf" }
success_criteria:
  - "output file exists and size > 0"
  - "output page count == sum(input page counts)"
tools_used: ["list_files", "ask_user", "run_python", "write_file"]
avg_turns: 5
success_rate: 0.94
last_used: "2026-06-15"
```

关键设计：**trigger_intent 和 task_description 是两层检索用的，steps 是执行的依据，success_criteria 是执行后验证的标准。**

**第二步：怎么匹配——两层检索引擎。**

新任务进来，用户说「帮我把这几个 PDF 合成一个」。不直接跑语义检索，先过一层**意图标签**。

Layer 1：意图标签粗筛。用小模型（比如 fine-tune 过的 T5-small 或者直接用 LLM 做 few-shot 分类）把任务打到预定义的意图类别上：`pdf_processing / data_analysis / email / file_organization / web_scraping` 等。这一步 O(n) 扫所有 skill 的 trigger_intent 字段，命中同类的 skill 进入候选池。标签分类的延迟大约 50ms，缓存热标签更快。如果同类 skill 只有 1 个，直接命中；如果有多个，进第二层。

Layer 2：语义相似度精排。对 task_description 和用户 query 分别做 embedding（我用 text-embedding-3-small 或本地的 bge-large），算余弦相似度。设两个阈值：
- `SIM_HIGH = 0.88`：直接加载 SOP，不需要问用户，参数自动替换。
- `SIM_LOW = 0.72`：弹确认——「检测到类似 skill (pdf-batch-merge, 成功执行 47 次)，是否按此方案处理？」用户说可以就复用。
- 低于 0.72：不匹配现有 skill，进入 from-scratch 探索流程，探索成功后 long_term_update 固化新 skill。

**为什么是两层而不是纯 embedding？** 因为纯 embedding 检索有两个坑：一是 query 短的时候语义信息不够，容易召回不相关的 skill（比如 '处理这个文件' 能 match 上 pdf、excel、image 各种 skill）；二是 skill 数量上来之后 all-pair 语义比较延迟太高。意图标签一层相当于一个粗排的倒排索引，把候选集从几百个压缩到十几个，精排量直接降一个数量级。

**第三步：执行后验证，防误匹配。**

这是最容易被忽略但最关键的一步。skill 加载执行完了，Agent 跑 success_criteria 里的检查。以 PDF 合并为例：输出文件存在吗？页数对不对？通过了就记 success，这个 skill 的 success_rate 涨一点。

没通过怎么办？**不是删 skill，是降权。** 这次匹配标记为 fail，skill 的 confidence 下调，类似 ELO 机制。一个 skill 连续失败 3 次，自动归档，不再被推荐。

**额外几个工程细节：**

- **Skill 版本管理**：skill 的 steps 每次优化存储新版本，旧版本保留但不激活。这样如果新版本翻车还能回滚。执行记录里带 skill_version 字段，出问题能说清是哪个版本导致的。
- **参数热替换**：SOP 里的 params 不是写死的，而是带模板变量——`{output_dir}`、`{file_count}`——加载时用当前任务 context 填充。这样同一个 skill 处理「合并 A/B/C 三个 PDF」和「合并 D/E 两个 PDF」都能复用。
- **定期合并**：后台 cron 跑 skill 库去重——两个 skill 的 steps 序列编辑距离 < 2 且 trigger_intent 高度重叠，自动合并，保留 success_rate 高的那个的 meta。
- **时效检测**：有些 skill 的工具调用方式会过时。比如 `pypdf` 升级了 API，skill 里写的老调用方式会失败。执行失败后 Agent 尝试修复并更新 skill，如果修不了就标记 deprecated。

**和纯向量记忆比：** 向量记忆存的是对话片段，检索出来你还得再让 LLM「读懂这段历史」，本质上还是推理不是复用。skill 是存**已验证的执行流程图**，load 之后直接拿步骤走，不需要再推理「上次怎么做的」。一个是图书馆查资料，一个是拿 SOP 照做——效率和确定性差一个量级。

**最后一句总结：让 Agent 积累的不是记忆片段，是可验证的成功路径。新的同类任务来了，先问「以前做成过吗」，做成了加权重、做砸了降权重——靠这套信用机制而不是盲信语义相似度。**"
