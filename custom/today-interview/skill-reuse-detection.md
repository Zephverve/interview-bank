---
title: 保存 Skill 后如何检测同类任务并复用
round: 二面
difficulty: ⭐⭐⭐⭐
tags: [Agent, Skill, 记忆]
point: 任务相似度与 SOP 复用
---

**题目**：在保存一个 skill 后，怎么能再有一个任务可以检测到两类任务是同一类，然后复用这个 skill？

**结论句（15 秒）**：任务 embedding 聚类 + 意图标签 + 成功 SOP 索引；新任务先检索 L3 skill 再决定复用或新建。

**追问方向**：和向量记忆比？ · skill 过时怎么办？

### 回答

"这是 **Agent 长期记忆 / Skill Library** 问题。我的设计思路：

**1. Skill 存什么**
- 不是整段 chat log，而是结构化 **SOP**：触发条件、步骤、工具序列、注意事项、成功判据
- 存 L3 层（GenericAgent 式分层记忆）

**2. 新任务来时怎么匹配**
- **意图分类**：先 LLM/小模型打 task type tag（'PDF 批处理''邮件发送''数据分析'）
- **语义检索**：对 task description 做 embedding，在 skill 库 Top-K
- **规则补充**：关键词、文件类型、工具链指纹（上次用了哪些 tool）

**3. 复用策略**
- 相似度 > 阈值 → 加载 SOP，Agent 按步骤执行，必要时局部改写
- 介于灰区 → '检测到类似 skill X，是否复用？'
- 低于阈值 → 从零探索，成功后 **start_long_term_update** 固化新 skill

**4. 防误判**
- 执行后验证 success criteria；失败则降权该 skill 匹配分
- 定期合并重复 skill、归档过时 SOP

本质：**把'做过的事'变成可检索的程序，而不是靠模型每次重新摸索**。"
