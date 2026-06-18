---
title: 大模型应用的提示工程方法论
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [Prompt, LLM, 工程方法]
point: 提示设计
---

**题目**：你怎么做 Prompt Engineering？有方法论吗？

**结论句（15 秒）**：Prompt 不是玄学调参——我用结构化模板、few-shot 示例、加上版本控制评测，改一次测一次，靠指标说话不靠感觉。

**追问方向**：system prompt 和 user prompt 怎么分工？ · prompt 太长怎么优化？ · CoT 什么时候有用什么时候没用？

### 回答

Prompt Engineering 不是玄学调参，是用工程方法控制 LLM 行为。我实际用四步法。

**模板化。** 固定五块：角色定义、上下文、任务描述、约束条件、输出规范。改输出格式只动 Output 模块，不同任务复用同一套 JSON schema template。

**few-shot 精选不堆量。** 3-5 个高质量示例覆盖正常、边界、负面三种 case。用 embedding 动态选和当前 query 最相关的 few-shot，不每次发同一批。

**system 和 user 分工。** System 管「能不能做」——角色、边界、全局规则；User 管「这次做什么」——具体 query 和当前 step。分开才好定位是规则设错还是输入没传对。

**改一次测一次，版本管理。** 每次改完跑回归测试、边界测试、成本测试。prompt 和代码一样 git 管理，commit 写清楚为什么改、预期提什么指标。CoT 适用于多步推理和数值计算，简单事实查询反而想多了；prompt 里写「需要推理请逐步展示，事实查询直接回答」比一刀切效果好。好的 prompt 能版本控制、能跑评测、能说清楚每次改动提了多少分。
