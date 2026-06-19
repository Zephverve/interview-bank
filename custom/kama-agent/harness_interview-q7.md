---
title: 7. 大厂真实面试追问汇总
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [Agent, 卡码笔记]
point: 7. 大厂真实面试追问汇总
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/harness_interview.html

> 来源文章：Harness Engineering大厂面试题汇总：从Prompt到Context到Harness

---

**题目**：7. 大厂真实面试追问汇总

**结论句（15 秒）**：以下是各大厂在 Harness Engineering 方向的真实追问，整理汇总

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

以下是各大厂在 Harness Engineering 方向的真实追问，整理汇总。

 

### 概念理解类

 Q：Harness Engineering 和 MLOps 有什么区别？

 MLOps 侧重模型训练、部署、版本管理的工程化流程；Harness Engineering 侧重模型上线后的运行环境设计——工具、约束、评估、恢复。MLOps 是&quot;怎么把模型搞上线&quot;，Harness 是&quot;上线后怎么让它跑得稳&quot;。两者互补，MLOps 偏训练侧，Harness 偏运行侧。

 Q：Agent = Model + Harness 这个等式你怎么理解？

 除了模型本身之外，几乎所有决定 Agent 能不能稳定交付的东西都属于 Harness——工具、上下文文件、记忆系统、评估机制、约束规则、恢复策略。换模型提升的是天花板，搭 Harness 提升的是落地能力。在模型迭代速度放缓的今天，Harness 这部分的提升空间可能比你想象的大得多。

 Q：Context Engineering 和 RAG 是什么关系？

 RAG 是 Context Engineering 的一种具体实现技术——它解决&quot;召回&quot;这一步（从大量文档中找出最相关的）。Context Engineering 还包括压缩（摘要提炼）和组装（按顺序排布），RAG 只管了第一步。

 

### 技术深挖类

 Q：Agent 跑久了上下文腐化怎么办？

 三步：先做上下文压缩（摘要提炼历史对话，腾出空间），如果压缩还不够（模型带着&quot;疲惫感&quot;），做 Context Reset（整个上下文窗口丢掉，换干净的，状态从文件系统恢复），关键是状态必须外化到文件而不是留在上下文窗口里。

 Q：AGENTS.md 越写越长效果变差怎么办？

 改成渐进式披露：主文件只保留核心索引（OpenAI 建议约 100 行），详细规则拆到子文档，Agent 按需加载。这和 Anthropic 的 Agent Skills 是同一思路——不一开始塞所有信息，而是需要时才动态注入。

 Q：Hermes Agent 的学习闭环具体怎么工作？

 Agent 执行完一个复杂任务后，自动从经验中提取模式生成一个 skill 文件（存在 ~/.hermes/skills/），下次遇到类似任务时搜索已有 skill 直接复用，同时在使用中不断改进 skill。这和 Mitchell Hashimoto 说的&quot;复利效应&quot;一脉相承——每次犯错都沉到环境里，环境越来越强，Agent 越来越稳。

 

### 生产实战类

 Q：你们 Agent 的技术债怎么管理？

 技术债不能攒着集中还。两种做法：一是把工程师的经验写成 Golden Principles（黄金原则）沉进仓库，让 Agent 按规则写代码；二是让后台 Agent 定期自动扫描仓库找偏离，开修复 PR，人类快速审核合并。每天自动还一点，比攒到周五集中清效果好得多。

 Q：怎么给非技术人员解释 Harness Engineering 的价值？

 &quot;LLM 就像高速公路上的自动驾驶——能跑很快，但如果不装刹车、不装安全气囊、不装仪表盘，你敢坐吗？Harness Engineering 就是给 AI 装刹车和安全气囊。没有它，AI 越强大越危险。&quot;