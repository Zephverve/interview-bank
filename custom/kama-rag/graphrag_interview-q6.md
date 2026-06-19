---
title: 6. GraphRAG 和 LightRAG 到底怎么选
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [RAG, 卡码笔记]
point: 6. GraphRAG 和 LightRAG 到底怎么选
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/graphrag_interview.html

> 来源文章：GraphRAG与LightRAG大厂面试题汇总：从RAG到知识图谱检索

---

**题目**：6. GraphRAG 和 LightRAG 到底怎么选

**结论句（15 秒）**：面试官会问：&quot;你们项目用的 GraphRAG 还是 LightRAG

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官会问：&quot;你们项目用的 GraphRAG 还是 LightRAG？为什么？什么场景该用哪个？&quot;

 

### 核心区别

 维度 GraphRAG LightRAG 开发者 微软研究院 港大 HKUDS 知识结构 知识图谱 + Leiden 社区层级 双层图谱（实体层 + 关系层） 全局理解方式 预计算社区摘要 → Map-Reduce 关系层图谱实时检索 索引成本 高（2-5x 源 token） 中（比 GraphRAG 少约 40-60%） 索引耗时 长（百万文档约 3.8 小时） 短（同规模约 2.1 小时） 增量更新 难（需重建社区结构） 易（直接往图里加节点和边） 全局查询质量 强（预计算摘要，完整性好） 中上（实时检索，够用但不如预计算） 本地查询质量 强 强 部署复杂度 高 低 

### 什么场景选 GraphRAG

 - 知识库大且相对稳定——法律档案、研究论文库、历史文档，建一次图用很久
 - 全局洞察是刚需——&quot;所有案件的判决趋势&quot;&quot;跨论文的药物相互作用模式&quot;，这类问题 GraphRAG 的预计算摘要优势明显
 - 预算充足——能接受 10 倍于传统 RAG 的索引成本
 - 更新频率低——周更或月更，增量更新的痛点不大
 典型场景：律所的案件分析系统、药企的文献检索平台、情报分析系统。

 

### 什么场景选 LightRAG

 - 知识库动态更新——新闻聚合、客服知识库、产品文档，每天都有新内容
 - 成本敏感——创业团队或中小规模项目，GraphRAG 的索引成本扛不住
 - 快速上线——想先跑起来看效果，不想花几小时建图
 - 查询类型混合——既有具体问题又有全局问题，但全局问题不需要极致完整
 典型场景：新闻聚合平台的智能问答、客服知识库、研究者的个人论文库。

 

### 总结

 要深度选 GraphRAG，要灵活选 LightRAG。

 GraphRAG 像&quot;先花大价钱修一条高速公路&quot;——前期投入大，但跑起来又快又稳；LightRAG 像&quot;修一条普通公路，随时可以加宽&quot;——前期成本低，增量灵活，但极致性能不如高速公路。

 面试时别只说&quot;我用了 GraphRAG&quot;，要说清楚为什么选它——你的数据规模多大、更新频率多高、查询类型偏什么、预算多少。选型的逻辑比选型本身更重要。