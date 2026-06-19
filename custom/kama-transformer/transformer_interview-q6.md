---
title: 6. Encoder vs Decoder vs Decoder-Only：三大架构…
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [Transformer, 卡码笔记]
point: 6. Encoder vs Decoder vs Dec
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/transformer_interview.html

> 来源文章：Transformer大厂面试题汇总：应用开发者视角

---

**题目**：6. Encoder vs Decoder vs Decoder-Only：三大架构怎么选？

**结论句（15 秒）**：面试官会问：&quot;GPT、BERT、T5 的架构有什么区别

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官会问：&quot;GPT、BERT、T5 的架构有什么区别？为什么现在大模型都用 Decoder-Only？&quot;

 这是 Transformer 架构最重要的分支，直接决定了模型能干什么、怎么用。

 

### 三大架构对比

 维度 Encoder-Only Encoder-Decoder Decoder-Only 代表模型 BERT T5、BART GPT、Claude、LLaMA 注意力方式 双向注意力 Encoder 双向 + Decoder 单向 单向注意力（因果注意力） 能看到什么 整个输入 Encoder 看全部，Decoder 只看前面 只看前面的 Token 擅长什么 理解、分类、抽取 翻译、摘要、转换 生成、对话、推理 生成能力 弱 强 最强 

 

### Encoder-Only：BERT 的路线

 BERT 用双向注意力，每个 Token 可以看到前面和后面所有的 Token。

 好处：理解能力强，做分类、实体识别、语义相似度这些任务效果很好。

 坏处：不能用来生成。因为生成必须是&quot;看前面的词，预测下一个词&quot;，双向注意力等于偷看了答案。

 BERT 在 2018 年很火，但后来大模型转向生成式，Encoder-Only 就不是主流了。

 

### Encoder-Decoder：T5 的路线

 Encoder 用双向注意力理解输入，Decoder 用单向注意力生成输出。

 典型的&quot;理解了再写&quot;模式，适合翻译、摘要这类输入和输出明确分离的任务。

 Google 的 T5 和 PaLM（部分版本）用这个架构。

 

### Decoder-Only：GPT 的路线

 只用单向注意力，每个 Token 只能看到前面的 Token，预测下一个 Token。

 这就是自回归生成：看前面的词，预测下一个词，再看前面的词（包括刚预测的），再预测下一个……一步步生成下去。

 

 为什么现在大模型都用 Decoder-Only？

 三个原因：

 ① Scaling 效果最好

 同样的参数量和数据量，Decoder-Only 在扩大规模时收益最大。GPT 系列从 1.17 亿参数到 1.8 万亿参数，效果持续提升。这不是偶然——Decoder-Only 的架构更简单统一，规模越大优势越明显。

 ② 生成和理解都能做

 虽然 Decoder-Only 天然是生成式的，但通过 Prompt 设计，它也能做理解任务。反过来，Encoder-Only 就做不了生成。一专多能 &gt; 只能做一样。

 ③ 训练更高效

 Decoder-Only 每个位置的预测目标都是&quot;下一个 Token&quot;，训练目标统一。Encoder-Decoder 需要同时训练理解和生成两个部分，协调成本更高。

 

### 对应用开发的启示

 为什么大模型都是&quot;你给它一段文字，它接着往下写&quot;的模式？

 因为 Decoder-Only 的本质就是&quot;给定前面的内容，预测下一个 Token&quot;。你发一段 Prompt，模型就是在&quot;续写&quot;。对话、代码生成、问答，本质上都是续写。

 这就解释了：

 - 为什么 Prompt 的最后一句特别重要：模型是接着你最后一句话往下写的，最后一句话的方向决定了生成方向
 - 为什么 Few-shot 有效：给几个示例，模型就会&quot;续写&quot;出类似格式的内容
 - 为什么 System Prompt 要放在最前面：最先出现的内容对整个生成过程都有影响，System Prompt 在开头相当于给&quot;续写&quot;定了基调
 面试怎么说：&quot;现在主流大模型都用 Decoder-Only，因为它 Scaling 效果最好、生成和理解都能做、训练更高效。这对应用开发的启示是：大模型的本质就是'续写'，Prompt 的结构和位置直接影响生成质量。System Prompt 放开头定基调，关键指令放结尾定方向，中间放上下文。&quot;