---
title: 5. Positional Encoding：为什么位置信息这么重要？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [Transformer, 卡码笔记]
point: 5. Positional Encoding：为什么位置
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/transformer_interview.html

> 来源文章：Transformer大厂面试题汇总：应用开发者视角

---

**题目**：5. Positional Encoding：为什么位置信息这么重要？

**结论句（15 秒）**：面试官会问：&quot;Transformer 为什么需要位置编码

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官会问：&quot;Transformer 为什么需要位置编码？没有位置编码会怎样？&quot;

 

### Transformer 天生没有顺序感

 这是很多人不知道的一个关键点：Self-Attention 本身是完全不看顺序的。

 把&quot;猫吃鱼&quot;和&quot;鱼吃猫&quot;丢给 Self-Attention，没有位置编码的话，它的处理结果是一样的。因为注意力只看&quot;哪些词之间有关系&quot;，不看&quot;谁在前面谁在后面&quot;。

 但顺序对语言太重要了。&quot;狗咬人&quot;和&quot;人咬狗&quot;，词一样，意思完全相反。

 所以 Transformer 必须通过 Positional Encoding 把位置信息硬加进去，告诉模型&quot;这个词在第几个位置&quot;。

 

### 位置编码怎么加的？

 早期 Transformer 用的是正弦/余弦函数来编码位置，每个位置有一个独特的向量。现在的模型大多用可学习的位置编码——直接让模型在训练中学出每个位置该用什么向量。

 具体公式面试不用背，说清楚逻辑就行：位置编码就是给每个 Token 打上一个&quot;位置标签&quot;，让模型知道这个词在句子的哪个位置。

 

### 对应用开发的启示

 为什么长上下文后面模型会&quot;忘记&quot;前面的内容？

 位置编码有一个隐含的问题：模型在训练时见过的位置范围是有限的。

 如果一个模型训练时最长只见过 4096 个 Token 的文本，那它对第 5000 个位置的位置编码就没有学过。虽然可以通过外推（extrapolation）来处理更长的位置，但效果会下降。

 这就解释了：

 - 为什么上下文窗口有硬上限：超出训练时见过的位置范围，位置编码就不可靠了
 - 为什么超长上下文质量会下降：即使模型声称支持 200K 上下文，后半部分的注意力质量也不如前半部分
 - 为什么重要信息要放在 Prompt 开头或结尾：模型对中间位置的信息关注度天然较低，这是所谓的&quot;中间迷失&quot;（Lost in the Middle）问题
 

 关于上下文窗口的管理，之前在 Claude Code 深度解析 里有详细讲 200K 窗口的管理策略，录友们可以翻翻。

 面试怎么说：&quot;Transformer 的 Self-Attention 本身没有顺序感，位置编码是硬加进去的。这意味着模型对位置的处理能力受限于训练时见过的位置范围。超长上下文质量下降、中间位置信息容易被忽略，都和位置编码有关。所以我在实际开发中会注意把关键信息放在上下文的开头或结尾，而不是塞在中间。&quot;