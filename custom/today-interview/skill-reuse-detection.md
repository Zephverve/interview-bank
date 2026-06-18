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

核心是让 Agent 积累可复用的成功路径，而不是每次都从零摸索。我分三块说。

**第一，Skill 存什么。** 不存整段对话 embedding，存结构化 SOP：trigger_intent 做粗筛、task_description 做精排、steps 是执行步骤、success_criteria 是验收标准。比如 PDF 合并 skill，步骤是列文件、确认、跑 pypdf、写输出，参数用 `{output_dir}` 这类模板变量，加载时按当前任务填充。

**第二，两层匹配。** 新任务进来先打意图标签，比如 pdf_processing、data_analysis，把候选从几百个压到十几个。再对 task_description 和用户 query 做 embedding 精排：相似度 ≥0.88 直接复用；0.72–0.88 弹确认；低于 0.72 走探索流程，成功后固化新 skill。纯 embedding 的问题是短 query 容易误召回，两层检索兼顾速度和准确率。
