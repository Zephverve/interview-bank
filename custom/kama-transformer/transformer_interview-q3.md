---
title: 3. Self-Attention：Transformer 的灵魂
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [Transformer, 卡码笔记]
point: 3. Self-Attention：Transforme
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/transformer_interview.html

> 来源文章：Transformer大厂面试题汇总：应用开发者视角

---

**题目**：3. Self-Attention：Transformer 的灵魂

**结论句（15 秒）**：面试官会问：&quot;Self-Attention 是什么

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官会问：&quot;Self-Attention 是什么？为什么说它是 Transformer 的核心？&quot;

 

### 一句话理解 Self-Attention

 Self-Attention 就是让每个词去看它和其他所有词的关系，然后根据关系远近决定关注多少。

 举个经典例子：&quot;银行&quot;这个词，在&quot;我去银行存钱&quot;和&quot;我在河边的银行散步&quot;里意思完全不同。Self-Attention 做的就是——根据上下文里其他词的信息，动态调整&quot;银行&quot;这个词的表示。

 在&quot;存钱&quot;旁边的&quot;银行&quot;是金融机构，在&quot;河边&quot;旁边的&quot;银行&quot;是河岸。词的意思不是固定的，是由上下文决定的。

 

### Q、K、V 是什么？

 面试官最爱问这个。但别去背公式，说清楚逻辑就行。

 Self-Attention 用三个矩阵把每个 Token 映射成三个向量：

 - Q（Query）：我在找什么？——当前词想知道自己和谁有关系
 - K（Key）：我有什么？——每个词能提供什么信息
 - V（Value）：我的内容是什么？——每个词的实际信息
 拿&quot;我去银行存钱&quot;举例：

 - &quot;银行&quot;的 Q 去问：谁和我有关系？
 - &quot;存钱&quot;的 K 回答：和我有关系！
 - &quot;河边&quot;的 K 回答：和我没关系
 - 然后根据关系远近加权，把&quot;存钱&quot;的 V 拿过来，更新&quot;银行&quot;的表示
 Q 找对象，K 判断匹不匹配，V 提供实际内容。 这就是 Self-Attention 的核心逻辑。

 

 

### 对应用开发的启示

 为什么上下文质量决定了输出质量？

 因为 Self-Attention 的本质就是&quot;根据上下文决定关注什么&quot;。你给模型的上下文里全是噪音，注意力就会分配给不该关注的地方；你给的上下文全是相关信息，注意力就能聚焦到正确的内容上。

 这就解释了为什么：

 - 模糊的 Prompt 效果差：上下文里没有明确的关键信息，注意力被分散到无关内容上
 - 结构化的 Prompt 效果好：清晰的结构让注意力更容易找到关键信息
 - 上下文里塞太多无关代码质量下降：无关信息抢占了注意力，关键信息被稀释
 之前在 Vibe Coding 面试题 里讲过&quot;上下文构建能力&quot;，底层原理就在这——你给的上下文质量直接决定了 Self-Attention 的效果，而 Self-Attention 决定了模型的输出质量。

 面试怎么说：&quot;Self-Attention 的本质是让每个 Token 根据上下文动态调整自己的表示。

 Q 找相关词，K 判断匹配度，V 提供内容。

 这对应用开发的启示是：上下文质量决定注意力分配，注意力分配决定输出质量。所以我特别重视 Prompt 的结构化和上下文的精准性。&quot;