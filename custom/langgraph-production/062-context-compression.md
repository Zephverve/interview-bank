---
title: "LangGraph 里上下文压缩怎么做？"
round: 一面
difficulty: ⭐⭐⭐
tags: [LangGraph, 工程]
point: "上下文"
source: 牛客 · 某大厂/字节
---

**题目**：LangGraph 里上下文压缩怎么做？

**结论句（15 秒）**：在图中加 trim/summarize 节点，进 LLM 前裁剪 messages；可多层：工具结果摘要、滚动摘要、长期记忆检索回填。

**追问方向**：压缩过度怎么发现？ · 字节三层压缩怎么答？

### 回答

**优先级**：P1 · 3+ 篇面经

**📖 核心要点**
- 独立 compression 节点
- 保留 system+最近 k 轮+摘要
- 压缩触发条件写 state token 估计

**🗣️ 标准口语答案**

某大厂面经「上下文压缩方式」。在 LangGraph 里压缩是显式节点：before_llm 节点估算 token，超阈值则 summarize 旧 messages 写 summary 字段，trim messages 只留最近几轮+摘要。

字节追问三层压缩——可答：工具输出摘要层、对话滚动摘要层、长期记忆检索层，每层不同触发条件和保留策略，不一致因为信息密度不同。

压缩过度看评测集答案质量跌、或用户追问「你忘了刚才说的」——监控 summary 丢失实体数。

