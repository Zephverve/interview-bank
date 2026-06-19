---
title: 4. Multi-Head Attention：为什么要多个头？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [Transformer, 卡码笔记]
point: 4. Multi-Head Attention：为什么要
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/transformer_interview.html

> 来源文章：Transformer大厂面试题汇总：应用开发者视角

---

**题目**：4. Multi-Head Attention：为什么要多个头？

**结论句（15 秒）**：面试官会问：&quot;Multi-Head Attention 和 Self-Attention 什么关系

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官会问：&quot;Multi-Head Attention 和 Self-Attention 什么关系？为什么要多个头？一个头不够吗？&quot;

 

### 一个头的局限

 单头注意力只有一个 QKV 变换，只能学一种关系模式。

 但语言里的关系是多样的：

 - 语法关系：&quot;他吃饭&quot;——&quot;他&quot;和&quot;吃饭&quot;是主谓关系
 - 指代关系：&quot;小明说他很开心&quot;——&quot;他&quot;指代&quot;小明&quot;
 - 语义关系：&quot;苹果发布了新手机&quot;——&quot;苹果&quot;是公司不是水果
 一个注意力头很难同时捕捉这么多种关系。

 

### 多头的解法

 Multi-Head Attention 就是把 QKV 复制多份，每份独立算注意力，每份学不同的关系模式。

 8 个头就像 8 个&quot;视角&quot;：

 - 第 1 个头关注语法结构
 - 第 2 个头关注指代关系
 - 第 3 个头关注语义相近的词
 - 第 4 个头关注位置相邻的词
 - ……
 最后把 8 个头的结果拼起来，综合判断。

 

 不是说模型被手动设计了这些分工，而是在训练过程中，不同的头自然学会了关注不同的关系模式。

 

### 对应用开发的启示

 为什么 Prompt 结构化比大段文字效果好？

 因为多头注意力在处理结构化信息时效率更高。

 一段结构清晰的 Prompt：

 目标：写一个退款接口
参数：订单号、退款金额
约束：幂等校验、部分退款上限50%
上下文：orders表结构如下...
 1
2
3
4
每个注意力头可以快速定位到自己关注的部分——语法头看结构，语义头看关键词，指代头看参数对应关系。

 一段大段文字的 Prompt：

 我需要你帮我写一个退款接口，参数有订单号和退款金额，要注意幂等校验，部分退款不能超过50%，orders表的结构是这样的...
 1
信息密度一样，但多头注意力在处理第二种格式时需要额外的计算来提取结构，效率更低。

 结构化不是给人类看的，是给多头注意力看的。

 面试怎么说：&quot;Multi-Head Attention 让不同的头关注不同类型的关系——语法、语义、指代等。

 这解释了为什么结构化的 Prompt 效果更好：每个头可以快速定位到相关部分，注意力分配更高效。

 我在实际开发中会刻意用结构化格式写 Prompt，就是为了让多头注意力更容易处理。&quot;