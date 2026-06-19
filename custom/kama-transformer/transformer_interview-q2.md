---
title: 2. 为什么所有大模型都绕不开 Transformer？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [Transformer, 卡码笔记]
point: 2. 为什么所有大模型都绕不开 Transformer？
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/transformer_interview.html

> 来源文章：Transformer大厂面试题汇总：应用开发者视角

---

**题目**：2. 为什么所有大模型都绕不开 Transformer？

**结论句（15 秒）**：面试官喜欢问：&quot;为什么 GPT、Claude、Gemini、LLaMA 全都用 Transformer

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官喜欢问：&quot;为什么 GPT、Claude、Gemini、LLaMA 全都用 Transformer？有没有替代方案？&quot;

 这个问题要从 Transformer 之前说起。

 

### Transformer 之前：RNN 和 CNN 的困境

 RNN（循环神经网络） 的致命问题：

 - 梯度消失：序列越长，前面的信息传到后面就越弱。处理 1000 个 Token 的文本，第 1 个 Token 的梯度信号到第 1000 步基本没了。这就是为什么 RNN 记不住长距离依赖
 - 串行计算：RNN 必须一个 Token 一个 Token 地处理，第 2 个 Token 必须等第 1 个处理完。没法并行，训练速度上不去
 CNN（卷积神经网络） 的问题：

 - 局部感受野：CNN 天然只能看到局部窗口内的信息，想看全局就得堆很多层。堆层数又带来训练难度
 - 长距离依赖弱：两个相隔很远的词之间的关系，CNN 很难捕捉到
 

### Transformer 的解法：注意力机制

 Transformer 用注意力机制一步到位解决了这两个问题：

 - 不需要逐步传递信息：每个 Token 直接和所有其他 Token 计算相关性，不需要像 RNN 那样一步步传。第 1 个 Token 和第 1000 个 Token 的关系，一步就能算出来
 - 可以并行计算：所有 Token 的注意力可以同时算，不用串行等待。GPU 最擅长这种大规模并行运算
 一句话：RNN 记不住长距离关系，CNN 看不到全局，Transformer 用注意力一步搞定，还能并行。

 

 

### 有替代方案吗？

 有，但目前都没能替代 Transformer：

 - Mamba（状态空间模型）：推理速度快，长序列有优势，但生成质量和通用性还比不上 Transformer
 - RWKV：结合了 RNN 和 Transformer 的优点，但生态还不成熟
 - 混合架构：部分层用 Transformer，部分层用其他结构，目前还在探索阶段
 面试不用展开太多，关键是说清楚一点：Transformer 在并行计算和全局建模之间找到了最好的平衡，目前还没有架构能在通用性和性能上同时超越它。

 面试怎么说：&quot;Transformer 之前，RNN 有梯度消失和串行计算的问题，CNN 有局部感受野的局限。

 Transformer 的注意力机制让每个 Token 能直接和所有其他 Token 建立关系，而且可以并行计算，这是它取代 RNN 和 CNN 的核心原因。

 目前有 Mamba 等替代方案在探索，但通用性和生态都还差一截。&quot;