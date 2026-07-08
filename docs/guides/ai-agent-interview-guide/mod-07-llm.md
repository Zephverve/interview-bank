---
title: 07 · 大模型基础
titleTemplate: false
pageClass: guides-doc
outline: [2, 3]
aside: true
---

<p class="guide-chapter-badge">07 · 大模型基础</p>

> 大模型基础是 Agent 的「发动机」。Attention 决定看哪里，KV Cache 决定推理快不快，LoRA 决定怎么便宜微调，RLHF/DPO 决定对齐人类偏好。

07 大模型基础（面试八股文）

  面向零基础读者的系统梳理：每个知识点尽量包含「概念解释、原理详解、面试问答、追问
  应对、代码示例（如适用）」。本模块是 LLM / Agent 面试的高频核心，建议结合论文与开
  源实现（如 Hugging Face Transformers、vLLM）对照理解。

#### 1. Transformer 架构

#### 2. 注意力机制详解

#### 3. Tokenization

#### 4. 大模型推理

#### 5. 模型微调

#### 6. 对齐技术

#### 7. 模型量化

#### 8. 推理优化

#### 9. 前沿模型与选型

#### 10. 综合面试题库（20+ 题）

## 1. Transformer 架构

### 1.1 概念解释

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「概念解释」先用生活类比讲清「是什么、解决什么痛点」，再落到技术词。面试官要的是你能让非技术同学也听懂。</p></div>

Transformer 是一种完全基于自注意力（Self-Attention）的神经网络结构，用于序列建模。与
RNN/CNN 不同，它不依赖逐步递归或局部卷积，而是通过注意力在任意两个位置之间直接建立
依赖关系，因而并行度高，且更容易捕捉长距离依赖。
经典论文 Attention Is All You Need 提出了两种用法：

  Encoder：把输入序列编码成一组上下文相关的表示（适合理解、分类、双向信息）。
  Decoder：自回归地生成下一个 token（适合生成）；Decoder 还可通过 Cross-Attention 读
  Encoder 的输出（机器翻译等 Encoder–Decoder 任务）。
纯 Decoder 堆叠（如 GPT 系列）已成为当前大语言模型（LLM）的主流形态。
### 1.2 原理详解

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「原理详解」建议按「输入→处理→输出→边界条件」四步讲。提到组件时顺带说一句失败时怎么办，显得有工程经验。</p></div>

### 1.2.1 Encoder–Decoder 结构

  Encoder（多层堆叠）：每层包含 Self-Attention（双向，每个位置能看到整句）+ FFN。输出
  是一组向量 (H)，编码了源序列信息。
  Decoder（多层堆叠）：每层包含 Masked Self-Attention（只能看到当前位置及之前，保证自
  回归）+ Encoder–Decoder Attention（Cross-Attention）（Query 来自 Decoder，
  Key/Value 来自 Encoder）+ FFN。
  用途：Seq2Seq（翻译、摘要等）。纯 Decoder LLM 往往只有 Decoder 块，用「前缀」当条
  件做生成，不再单独训练 Encoder。
### 1.2.2 Self-Attention 的计算过程（Q、K、V 与缩放点积注意力）

对输入序列的每个位置 (i)，先把隐向量变成三个向量：
   Query (Q)：「我要查什么」
   Key (K)：「我有什么可被匹配的标签」
   Value (V)：「匹配成功后取出什么内容」
实现上：(X \in \mathbb{R}^{n \times d_{model}})，可学习矩阵 (W_Q, W_K, W_V)，则
(Q = XW_Q,\ K = XW_K,\ V = XW_V)。
缩放点积注意力输出：
[ \text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}\right) V ]
其中 (d_k) 为每个头的维度。对第 (i) 个位置，注意力权重是它对各个位置 (j) 的分布，再对 (V)
做加权求和。
### 1.2.3 Multi-Head Attention（MHA）

将 (d_{model}) 拆成 (h) 个头，每个头在 (d_k = d_{model}/h) 维子空间上独立做注意力，最后
Concat 再乘 (W_O) 投回 (d_{model})。
直觉：不同头可以关注不同模式（语法、指代、局部搭配等），表达能力更强。
### 1.2.4 Position Encoding

注意力本身置换不变（打乱 token 顺序若不加位置信息则结果不变），必须注入位置信息。
            方法                                      思路简述
  正弦位置编码                    固定函数，不同维度用不同频率的正弦/余弦；可外推到比训
  （Sinusoidal PE）           练更长的位置（但现代 LLM 仍常用可学习或 RoPE）。
  RoPE（Rotary Position      在 Q、K 上施加与位置相关的旋转，相对位置以旋转角度差体
  Embedding）                现；广泛用于 LLaMA、ChatGLM 等，外推与相对位置性质较
                            好。
  ALiBi（Attention with      不在 embedding 加位置向量，而在注意力 logits 上按距离加
  Linear Biases）            线性负偏置，远处更负，实现简单且对长度外推有一定帮助。
### 1.2.5 Feed-Forward Network（FFN）

每层注意力子层后接一个位置独立的 FFN，通常形式为：
[ \text{FFN}(x) = \text{Activation}(xW_1 + b_1) W_2 + b_2 ]
常见 扩展比 为 4（隐层维度 (4 \times d_{model})），激活函数常用 GELU/SwiGLU（SwiGLU
会用三个矩阵，等价于门控 FFN）。
### 1.2.6 Layer Normalization：Pre-Norm vs Post-Norm

  Post-Norm（原始 Transformer）：(x \leftarrow x + \text{Sublayer}(x))，再在子层输出上做
  Norm。
  Pre-Norm（现代 LLM 常见）：先 Norm 再进子层：(x \leftarrow x + \text{Sublayer}
  (\text{LN}(x)))。
Pre-Norm 通常更稳定、更易训练深层网络；Post-Norm 在理论上与残差更「经典」，但深层时
更难训。
### 1.2.7 Residual Connection（残差连接）

[ x_{l+1} = x_l + \text{Sublayer}(x_l) \quad (\text{或 Pre-Norm 变体}) ]
作用：缓解梯度消失、提供恒等映射捷径，使深层网络可优化。
### 1.3 面试问题（Q）与标准答案（A）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>本节面试题：先给 15 秒结论，再补 1 个例子或数字。下面每题附了扩写与口播参考，建议出声练一遍。</p></div>

Q：Transformer 和 RNN 相比，核心优势是什么？
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>自注意力在单步内连接任意两位置，并行计算好、长距离依赖路径短（常数层数内）；RNN 顺序计算且长序列梯度路径长。代价是 (O(n^2)) 注意力内存与时间（相对序列长度）。Q：Decoder 里的 Masked Self-Attention 为什么要 mask？</p>
<p>训练时一次看到整句，若不 mask，位置 (i) 会看到「未来」token，造成信息泄漏；mask 保证训练和推理（自回归）一致。</p>
</div></div>
### 1.4 追问应对

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>追问通常考边界与取舍。回答模板：承认限制 → 给出工程兜底（规则/人工/降级）→ 一句业务影响。</p></div>

<p class="guide-followup"><span class="guide-followup-label">追问</span>为什么大模型多是 Decoder-only？</p>
<p class="guide-followup guide-followup-a"><span class="guide-followup-label">应对</span>生成式预训练目标（下一词预测）与架构一致；工程上堆叠简单、扩展性好；Encoder-only（如 BERT）更偏理解，需另做生成适配。</p>
<p class="guide-followup"><span class="guide-followup-label">追问</span>Pre-Norm 和 Post-Norm 训练稳定性差异原因？</p>
<p class="guide-followup guide-followup-a"><span class="guide-followup-label">应对</span>Pre-Norm 让子层输入分布更稳定，梯度在残差路径上更平滑；可提一嘴深层Transformer 实践中 Pre-Norm 更常见。</p>
### 1.5 代码示例：缩放点积注意力（PyTorch 风格伪代码）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>代码示例不是让你背语法，而是说明「循环/状态/Schema 如何落地」。面试时说清输入输出和停止条件即可。</p></div>

```python
  import torch
  import torch.nn.functional as F
  import math

  def scaled_dot_product_attention(Q, K, V, attn_mask=None):
      # Q,K,V: (batch, heads, seq_len, d_k)
      scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(Q.size(-1))
       if attn_mask is not None:
           scores = scores.masked_fill(attn_mask == 0, float("-inf"))

       attn = F.softmax(scores, dim=-1)
       return torch.matmul(attn, V), attn

```

## 2. 注意力机制详解

### 2.1 概念解释

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「概念解释」先用生活类比讲清「是什么、解决什么痛点」，再落到技术词。面试官要的是你能让非技术同学也听懂。</p></div>

注意力本质上是一种软寻址机制：根据 Query 与各个 Key 的相似度得到权重，再对 Value 加权求
和。Self-Attention 中 Q、K、V 都来自同一组输入（不同线性投影）。
### 2.2 原理详解

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「原理详解」建议按「输入→处理→输出→边界条件」四步讲。提到组件时顺带说一句失败时怎么办，显得有工程经验。</p></div>

### 2.2.1 数学公式

[ \text{Attention}(Q,K,V) = \text{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}\right) V ]
（若为多头，则对每个头分别计算再拼接。）
### 2.2.2 为什么要除以 (\sqrt{d_k})

当 (d_k) 较大时，(q \cdot k) 的点积方差约为 (d_k)（假设分量独立零均值单位方差），数值幅度
大，softmax 会进入极陡区域，梯度不稳定。除以 (\sqrt{d_k}) 将方差缩放到约 1，使 softmax
更平滑，训练更稳定。
### 2.2.3 Multi-Head 的作用

  多头 = 多个并行子空间的注意力，每头可学习不同关系。
  单头表达能力有限；多头类似 CNN 多通道，提高表示丰富度。
### 2.2.4 Grouped Query Attention（GQA）

在 MHA 中，每头有独立 K、V。在 MQA 中，所有头共享一套 K、V。
GQA 介于两者之间：多组 Query 共享同一组 K、V（例如 8 个 Q 组对应 2 组 KV），在推理显存
与带宽（KV Cache 更小）和质量之间折中。Llama 3、Mistral 等采用 GQA。

### 2.2.5 Multi-Query Attention（MQA）

所有注意力头共享同一份 K、V，大幅减少 KV Cache 体积与内存带宽需求，推理加速明显；但可
能略损质量，故后来流行 GQA 折中。
### 2.2.6 Flash Attention 原理（核心思想）

标准实现需物化完整 (n \times n) 注意力矩阵，显存占用大。
Flash Attention 利用 GPU SRAM 快、HBM 慢 的层次结构，把 Q、K、V 分块（tiling），在块
上融合矩阵乘、softmax 与对 V 的加权，避免或减少完整 (n \times n) 矩阵写回 HBM；并可配
合 recomputation 在反向时重算以省显存。
要点：IO-aware / 分块 softmax 数值稳定实现、减少 HBM 读写。后续 FlashAttention-2 等进
一步优化并行与工作划分。
### 2.3 面试问题（Q）与标准答案（A）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>本节面试题：先给 15 秒结论，再补 1 个例子或数字。下面每题附了扩写与口播参考，建议出声练一遍。</p></div>

Q：简述 Flash Attention 为什么能快和省显存？
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>通过分块在片上完成注意力计算，减少对慢速全局显存的读写；避免存储完整大注意力矩阵（或显著降低峰值），并融合算子提高吞吐。Q：GQA 相对 MHA 推理上主要省在哪里？</p>
<p>KV Cache 随层缓存的 K、V 体积减小（多组 Query 共享 KV），内存带宽与显存占用下降，decode 阶段受益明显。</p>
</div></div>
### 2.4 追问应对

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>追问通常考边界与取舍。回答模板：承认限制 → 给出工程兜底（规则/人工/降级）→ 一句业务影响。</p></div>

<p class="guide-followup"><span class="guide-followup-label">追问</span>不用 softmax 可以吗？</p>
<p class="guide-followup guide-followup-a"><span class="guide-followup-label">应对</span>注意力需非负且归一的权重；softmax 是最常见选择，也有线性注意力、核方法等变体用于线性复杂度，但各有近似与实现代价。</p>
### 2.5 代码示例：多头形状演示

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>代码示例不是让你背语法，而是说明「循环/状态/Schema 如何落地」。面试时说清输入输出和停止条件即可。</p></div>

```python
  # batch=2, seq=128, heads=8, d_model=512 -> d_k=64
  # Q: (2, 8, 128, 64) #  注意力在最后一维      seq 上  softmax

  #   合并多头: (2, 128, 512) @ W_o

```

## 3. Tokenization

### 3.1 概念解释

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「概念解释」先用生活类比讲清「是什么、解决什么痛点」，再落到技术词。面试官要的是你能让非技术同学也听懂。</p></div>

Tokenization 把原始文本切成模型可处理的 token 序列；每个 token 对应词表中的 id，再经
embedding 变为向量。切分方式直接影响序列长度、OOV 处理、多语言与符号表现。
### 3.2 原理详解

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「原理详解」建议按「输入→处理→输出→边界条件」四步讲。提到组件时顺带说一句失败时怎么办，显得有工程经验。</p></div>

### 3.2.1 BPE（Byte Pair Encoding）

从字符或字节开始，统计相邻符号对频率，合并最高频对为新符号，迭代直到词表达目标规模。
特点：平衡词级与字符级，可表示未登录词（由子词拼出）；广泛用于 GPT-2、RoBERTa 等。
### 3.2.2 WordPiece（BERT）

与 BPE 类似，但合并准则常基于最大化语言模型似然（选择使训练数据概率提升最大的合并），
而非单纯最高频。
### 3.2.3 SentencePiece

把整句当作输入，不依赖预分词空格；在原始字符串上学习子词（可处理无空格语言如日文）。支
持 BPE 与 Unigram 等算法。Unigram 从大批子词出发，迭代删除使损失最小的词表，适合多语
言。
### 3.2.4 中文 Tokenization 的特殊处理

  中文无天然空格，需在字符、子词、词级之间选择；子词级（字 + 常见片段）较常见。
  字符级：词表大、序列长；子词可压缩长度。
  中英混合、数字、emoji 常统一用 字节级 BPE（如 UTF-8 字节）避免 OOV，但序列可能变
  长。
  实践上多用 SentencePiece + 大词表 或 字节 BPE，并对领域语料再训练词表/适配。
### 3.2.5 Tokenizer 对模型效果的影响

  序列长度：同样文本 token 数少则同样上下文窗口能容纳更多内容。
  稀有词：拆成子词比 UNK 更好。
  噪声：错误分词会导致语义碎片化，影响生成与理解。
  与预训练一致性：微调与推理必须用同一套 tokenizer 与规则。
### 3.3 面试问题（Q）与标准答案（A）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>本节面试题：先给 15 秒结论，再补 1 个例子或数字。下面每题附了扩写与口播参考，建议出声练一遍。</p></div>

Q：BPE 和 WordPiece 主要区别？
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>都是子词合并思路；BPE 常用高频合并，WordPiece 更强调似然提升；具体实现因库而异，面试答「合并准则不同」即可。Q：为什么 LLM 常用子词而不是纯词？</p>
<p>控制词表规模、处理 OOV、开放集词汇；纯词级词表巨大且稀疏。</p>
</div></div>
### 3.4 追问应对

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>追问通常考边界与取舍。回答模板：承认限制 → 给出工程兜底（规则/人工/降级）→ 一句业务影响。</p></div>

<p class="guide-followup"><span class="guide-followup-label">追问</span>字节级 BPE 优缺点？</p>
<p class="guide-followup guide-followup-a"><span class="guide-followup-label">应对</span>词表小、任意字符可表示；缺点是同样文本 token 变长，算力与上下文窗口压力增大。</p>

## 4. 大模型推理

### 4.1 概念解释

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「概念解释」先用生活类比讲清「是什么、解决什么痛点」，再落到技术词。面试官要的是你能让非技术同学也听懂。</p></div>

推理指模型前向计算生成输出。自回归 LM 逐 token 生成，分为 Prefill（处理提示词）与
Decode（逐个生成新 token）。
### 4.2 原理详解

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「原理详解」建议按「输入→处理→输出→边界条件」四步讲。提到组件时顺带说一句失败时怎么办，显得有工程经验。</p></div>

### 4.2.1 Prefill vs Decode

  Prefill：一次性并行计算 prompt 各 token 的表示，得到第一个生成位置的 logits；计算形态
  类似「整段并行注意力」。
  Decode：每步只新增一个 token，但需用历史 KV Cache 避免重复计算过去 token 的 K、
  V；算力小、内存带宽敏感。
### 4.2.2 KV Cache 原理与实现

对每一层、每个注意力头，对已生成（及 prompt）位置缓存 Key 和 Value。
新一步只计算当前 token 的 Q，与缓存的 K、V 做注意力，无需再算历史位置的 K、V。
代价：序列越长、层数越多、模型越大，KV Cache 显存线性增长，是长上下文推理的主要瓶颈之
一。
### 4.2.3 采样策略

  Temperature (T)：logits 除以 (T) 再 softmax。(T>1) 分布更平（更随机），(T&lt;1) 更尖（更确
  定）。
  Top-k：只保留概率最高的 k 个 token，其余置零再归一化，减少长尾胡编。
  Top-p（Nucleus）：按概率从大到小累加，取最小集合使累积概率 (\ge p)，动态截断候选
  集。
### 4.2.4 Beam Search vs Greedy

  Greedy：每步取 argmax，快但易局部最优。
  Beam Search：维护 top-(b) 条部分假设，适合机器翻译、摘要等可度量任务；对开放域对话
  常显得重复、不自然，对话场景更常用采样。
### 4.2.5 推理延迟优化（概览）

量化、算子融合、批处理、KV Cache 压缩/分页、投机解码、模型并行、更好的注意力实现
（FlashAttention）等（见第 8 节）。
### 4.3 面试问题（Q）与标准答案（A）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>本节面试题：先给 15 秒结论，再补 1 个例子或数字。下面每题附了扩写与口播参考，建议出声练一遍。</p></div>

Q：Prefill 和 Decode 哪个更吃算力？哪个更吃带宽？
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>Prefill 并行度高，计算密集；Decode 每步批量小，常内存带宽受限（读大权重与 KVCache）。实际与 batch、实现有关。Q：KV Cache 为什么能加速？</p>
<p>避免对历史 token 重复计算各层 K、V，以空间换时间。</p>
</div></div>
### 4.4 追问应对

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>追问通常考边界与取舍。回答模板：承认限制 → 给出工程兜底（规则/人工/降级）→ 一句业务影响。</p></div>

<p class="guide-followup"><span class="guide-followup-label">追问</span>KV Cache 显存如何估算？</p>
<p class="guide-followup guide-followup-a"><span class="guide-followup-label">应对</span>与层数、头数、每头维度、batch、序列长度、精度（FP16/BF16/INT8）成正比；可答「每层每 token 存 K、V 两份向量，总显存随长度线性增」。</p>
### 4.5 代码示例：简单 Greedy + 温度（概念）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>代码示例不是让你背语法，而是说明「循环/状态/Schema 如何落地」。面试时说清输入输出和停止条件即可。</p></div>

```python
  import torch
  import torch.nn.functional as F

  def sample_next_token(logits, temperature=1.0, top_k=50):
      logits = logits / temperature
      if top_k > 0:
          v, _ = torch.topk(logits, min(top_k, logits.size(-1)))
          logits[logits < v[:, [-1]]] = float("-inf")
      probs = F.softmax(logits, dim=-1)
      return torch.multinomial(probs, num_samples=1)

```

## 5. 模型微调

### 5.1 概念解释

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「概念解释」先用生活类比讲清「是什么、解决什么痛点」，再落到技术词。面试官要的是你能让非技术同学也听懂。</p></div>

微调在预训练模型上用下游数据继续训练，使模型适配任务或领域。全量微调更新全部参数；**参
数高效微调（PEFT）**只训练少量附加参数或低秩增量，降低显存与存储。
### 5.2 原理详解

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「原理详解」建议按「输入→处理→输出→边界条件」四步讲。提到组件时顺带说一句失败时怎么办，显得有工程经验。</p></div>

### 5.2.1 全量微调（Full Fine-tuning）

更新 (\theta) 的全部分量。效果最好潜力大，但需要大显存、易过拟合小数据，部署时每任务一
份完整权重。
### 5.2.2 LoRA（Low-Rank Adaptation）

对某线性层 (W \in \mathbb{R}^{d \times k})，冻结 (W)，训练低秩分解：
[ W' = W + BA,\quad B \in \mathbb{R}^{d \times r},\ A \in \mathbb{R}^{r \times k},\ r \ll
\min(d,k) ]
直觉：大矩阵更新往往低秩即可近似任务有效子空间。训练只存 (A,B)，推理可合并 (W' = W +
BA) 或保持分开。
### 5.2.3 QLoRA

在 4-bit 量化的基座权重（如 NF4）上叠加 LoRA，用 paged optimizer 等技巧减少显存峰值。
使单卡微调大模型成为可能。
### 5.2.4 Adapter Tuning

在 Transformer 层中插入小瓶颈层（如 down-project → 激活 → up-project），只训练 adapter
参数。
### 5.2.5 Prefix Tuning

在输入前可学习的前缀向量（虚拟 token），不改变原词表 embedding，通过前缀影响注意力。
### 5.2.6 P-Tuning v2

将 prompt tokens 扩展到每一层的可学习前缀，而不仅是输入层，提升小模型与难任务表现。
### 5.2.7 SFT（Supervised Fine-Tuning）流程（典型）

#### 1. 数据：高质量指令–回答对（可含思维链、拒答、工具格式）。

#### 2. 格式：Chat 模板（system/user/assistant）与 tokenizer 对齐。

#### 3. 训练：交叉熵损失，通常只监督 assistant 段 token。

#### 4. 评估：验证集 loss、人工/模型裁判、任务基准。

## 5. 对齐：常与 DPO/RLHF 等衔接。

### 5.3 面试问题（Q）与标准答案（A）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>本节面试题：先给 15 秒结论，再补 1 个例子或数字。下面每题附了扩写与口播参考，建议出声练一遍。</p></div>

Q：LoRA 秩 r 怎么选？
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>经验值 8–64 常见；越大容量越大但易过拟合、显存略增；需验证集折中。Q：QLoRA 和 LoRA 主要差在哪？</p>
<p>基座权重 4-bit 量化 + LoRA；大幅降低显存，略有精度损失风险，需配合 NF4 与调参。</p>
</div></div>
### 5.4 追问应对

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>追问通常考边界与取舍。回答模板：承认限制 → 给出工程兜底（规则/人工/降级）→ 一句业务影响。</p></div>

<p class="guide-followup"><span class="guide-followup-label">追问</span>LoRA 一般接在哪些层？</p>
<p class="guide-followup guide-followup-a"><span class="guide-followup-label">应对</span>常对 Attention 的 q,v（及有时 k,o）和/或 FFN 注入；实践有默认配置（如 r、alpha、target_modules）。</p>
### 5.5 代码示例：LoRA 形式（数学）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>代码示例不是让你背语法，而是说明「循环/状态/Schema 如何落地」。面试时说清输入输出和停止条件即可。</p></div>

                                                          text
 #   前向：h = W x + (B A) x = (W + B A) x
 #   训练参数：B (d×r), A (r×k)，远小于 W (d×k) 当 r 小时

## 6. 对齐技术

### 6.1 概念解释

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「概念解释」先用生活类比讲清「是什么、解决什么痛点」，再落到技术词。面试官要的是你能让非技术同学也听懂。</p></div>

对齐指使模型行为符合人类意图与安全规范。RLHF 用人类偏好训练奖励模型再用强化学习；
DPO 等直接用偏好数据优化策略，无需显式奖励模型与 RL 循环。
### 6.2 原理详解

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「原理详解」建议按「输入→处理→输出→边界条件」四步讲。提到组件时顺带说一句失败时怎么办，显得有工程经验。</p></div>

### 6.2.1 RLHF 完整流程（经典三阶段）

#### 1. SFT：监督微调，学会基本指令跟随与格式。

#### 2. 奖励模型（RM）：对人类标注的「好坏排序」数据，训练 (r(x,y)) 给回答打分。

#### 3. 强化学习：以 RM 为奖励信号，用 PPO 等算法更新策略 (\pi_\theta)，并常加 KL 惩罚 约束

   与参考模型 (\pi_{\text{ref}})（常为 SFT 模型）不要偏离太远。
### 6.2.2 PPO 在 RLHF 中的应用

PPO（Proximal Policy Optimization） 通过 clipped surrogate objective 限制策略更新幅度，
训练稳定。RLHF 中：
  策略：当前 LM。
  奖励：RM 分数 + KL 项。
  价值函数：常需 critic 估计优势函数。
挑战：训练链路长、调参难、奖励黑客（reward hacking）。
### 6.2.3 DPO（Direct Preference Optimization）

从偏好对 ((y_w, y_l)) 出发，推导出仅用策略与参考模型、无需显式 RM 的分类式损失，直接优化
策略满足偏好。简化工程、去掉 RL 采样环，但数据质量要求高。
### 6.2.4 GRPO（Group Relative Policy Optimization）

DeepSeek 等工作中强调：对同一 prompt 一组输出内做相对奖励归一化，减 critic、适应组内比
较，适合特定训练基础设施与算法设计。
### 6.2.5 KTO（Kahneman-Tversky Optimization）

从二元反馈（好/坏）出发，用前景理论风格损失做对齐，不必成对偏好，数据收集更灵活。
### 6.2.6 RLHF vs DPO 对比

| 维度 | RLHF | DPO |
| --- | --- | --- |
| 奖励模型 | 需要 | 不需要显式 RM |
| 训练复杂度 | 高（RL + 参考模型） | 相对较低 |
| 稳定性 | 依赖 PPO 调参 | 通常更简洁 |
| 数据 | 排序/打分 | 偏好对 |

### 6.3 面试问题（Q）与标准答案（A）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>本节面试题：先给 15 秒结论，再补 1 个例子或数字。下面每题附了扩写与口播参考，建议出声练一遍。</p></div>

Q：RLHF 为什么要 KL 惩罚？
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>防止策略为刷高 RM 分数而产生分布外投机行为（reward hacking），保持语言质量与多样性。Q：DPO 相对 RLHF 的主要工程优势？</p>
<p>无需单独训练 RM 与 RL 采样循环，静态数据上直接优化，pipeline 更简单。</p>
</div></div>
### 6.4 追问应对

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>追问通常考边界与取舍。回答模板：承认限制 → 给出工程兜底（规则/人工/降级）→ 一句业务影响。</p></div>

<p class="guide-followup"><span class="guide-followup-label">追问</span>偏好数据噪声大怎么办？</p>
<p class="guide-followup guide-followup-a"><span class="guide-followup-label">应对</span>数据清洗、多裁判一致性、对比学习过滤、鲁棒损失与正则；工业界常强调标注指南与质检。</p>

## 7. 模型量化

### 7.1 概念解释

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「概念解释」先用生活类比讲清「是什么、解决什么痛点」，再落到技术词。面试官要的是你能让非技术同学也听懂。</p></div>

量化把浮点权重/激活用低比特整数近似，减少显存与带宽，加速推理。训练后量化（PTQ）常
见；QAT（量化感知训练）精度更好但成本高。
### 7.2 原理详解

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「原理详解」建议按「输入→处理→输出→边界条件」四步讲。提到组件时顺带说一句失败时怎么办，显得有工程经验。</p></div>

### 7.2.1 INT8 / INT4

  INT8：每权重 8 bit，常配合 per-tensor 或 per-channel scale/zero-point。
  INT4：4 bit，容量减半，精度风险更高，常与 group-wise 缩放配合。
### 7.2.2 GPTQ

逐列（或块）量化权重，用 Hessian 相关信息最小化量化误差，适合 GPU 上 PTQ，广泛用于开
源 LLM 的 4-bit 权重。

### 7.2.3 AWQ（Activation-aware Weight Quantization）

强调保留对 激活幅度大 的「显著」权重通道，按激活统计决定保护权重，小模型推理上常与硬件
内核结合。
### 7.2.4 GGUF / GGML

文件格式与生态（llama.cpp 等），便于 CPU/多端部署与多种量化类型（Q4_K、Q5_K 等），不
是单一算法名，而是推理栈与格式代表。
### 7.2.5 量化对性能的影响

  正面：显存降、吞吐升、边缘部署可行。
  负面：perplexity 上升、复杂推理/代码任务可能掉点；KV Cache 量化可进一步省显存但需小
  心误差累积。
### 7.3 面试问题（Q）与标准答案（A）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>本节面试题：先给 15 秒结论，再补 1 个例子或数字。下面每题附了扩写与口播参考，建议出声练一遍。</p></div>

Q：INT4 比 INT8 主要风险是什么？
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>表示粒度更粗，误差更大；需 group-wise 缩放、混合精度或与更高比特关键层结合。Q：GPTQ 大致在优化什么？</p>
<p>给定量化约束，最小化权重重构误差（常利用二阶近似信息），逐块贪心求解。</p>
</div></div>
## 8. 推理优化

### 8.1 概念解释

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「概念解释」先用生活类比讲清「是什么、解决什么痛点」，再落到技术词。面试官要的是你能让非技术同学也听懂。</p></div>

大模型推理瓶颈来自 算力、显存带宽、KV Cache、批调度 等，工程上从模型分片、内核、缓存
管理、批处理、投机解码等多方面优化。
### 8.2 原理详解

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「原理详解」建议按「输入→处理→输出→边界条件」四步讲。提到组件时顺带说一句失败时怎么办，显得有工程经验。</p></div>

### 8.2.1 模型并行

 张量并行（TP）：单层内矩阵分块到多 GPU（如列切分 (A)、行切分 (B)），需 all-reduce 通
 信。
 流水线并行（PP）：不同层放在不同 GPU，micro-batch 流水，减少气泡。
大集群还可 数据并行 + TP + PP 组合。
### 8.2.2 KV Cache 优化：PagedAttention / vLLM

PagedAttention 将 KV Cache 存成非连续块（类似 OS 分页），按请求动态分配，减少 padding
浪费，提高 batch 利用率，是 vLLM 的核心思想之一。
### 8.2.3 Continuous Batching（动态批处理）

请求长度不一，传统静态 batch 浪费严重；连续批处理在迭代中动态增删请求，提高 GPU 利用
率。
### 8.2.4 Speculative Decoding（投机采样）

用小模型（draft）多步预测，大模型（target）并行验证；接受则一次前进多 token，降低每
token 延迟（理想情况），需 draft 与 target 兼容。
### 8.2.5 MoE（Mixture of Experts）

每层含多个 FFN 专家，门控只对少数专家计算（如 top-2），总参数大但每 token 激活参数少，
提高容量与效率比；挑战是 负载均衡与通信（如 DeepSeek-MoE、Mixtral）。
### 8.3 面试问题（Q）与标准答案（A）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>本节面试题：先给 15 秒结论，再补 1 个例子或数字。下面每题附了扩写与口播参考，建议出声练一遍。</p></div>

Q：vLLM 的 PagedAttention 解决什么问题？
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>KV Cache 显存碎片化与浪费（变长序列），通过分页块管理与复用提高吞吐。Q：MoE 为什么「参数多算力少」？</p>
<p>每 token 只激活部分专家，计算量随激活专家数增长，而总参数量包含所有专家。</p>
</div></div>
## 9. 前沿模型与选型

### 9.1 概念解释

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「概念解释」先用生活类比讲清「是什么、解决什么痛点」，再落到技术词。面试官要的是你能让非技术同学也听懂。</p></div>

闭源（API）与开源（可自托管）在能力、成本、合规、迭代速度上权衡；各系列有长上下文、多
模态、代码、价格等差异。
### 9.2 原理详解

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「原理详解」建议按「输入→处理→输出→边界条件」四步讲。提到组件时顺带说一句失败时怎么办，显得有工程经验。</p></div>

### 9.2.1 DeepSeek 系列特点（概括）

  强调工程与训练效率（如公开技术报告中的架构与训练细节）、长思维链与推理场景、开源权重
  降低使用门槛；具体能力随版本迭代需以官方 benchmark 为准。
  部分版本采用 MoE 等提高参数效率。
### 9.2.2 GPT-4o / Claude / Gemini 对比（面试话术）

  维度                                可答要点
 生态      OpenAI / Anthropic / Google 各自 API、工具链、多模态进度不同。
 多模      GPT-4o 强调语音图像端到端；Gemini 原生多模态与谷歌生态；Claude 长文与代
 态       码体验常被提及。
 定位      面试答「需看具体版本与评测任务」；商业上关注价格、速率限制、合规区域。
避免编造具体 benchmark 数字，强调任务相关评测与 A/B。
### 9.2.3 开源 vs 闭源选型

  开源：数据自主、可微调、离线可部署；需自备算力与运维。
  闭源：上手快、持续升级；依赖供应商、成本与合规需评估。
  混合：敏感数据本地开源模型，通用能力调用 API。
### 9.3 面试问题（Q）与标准答案（A）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>本节面试题：先给 15 秒结论，再补 1 个例子或数字。下面每题附了扩写与口播参考，建议出声练一遍。</p></div>

Q：选开源 70B 还是闭源 API？
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>看隐私、延迟、成本、定制需求与团队运维能力；高合规本地优先，快速验证可用 API。</p>
<p class="guide-a-step"><strong>10. 综合面试题库（20+ 题）</strong></p>
<p>下列题目均附标准答案要点，可与前文章节交叉复习。</p>
</div></div>
<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q1</span><span class="guide-q-text">写出缩放点积注意力的公式，并解释 (\sqrt{d_k})。</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>(\text{softmax}(QK^\top/\sqrt{d_k})V)。除 (\sqrt{d_k}) 使点积方差稳定在约 1，避免softmax 饱和与梯度问题。</p>
<div class="guide-expand"><span class="guide-expand-label">扩写</span><p>标准答案覆盖了要点；面试时可再补边界条件：可补一句你在项目里如何验证该方案有效（指标或案例）。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播</span><p>关于「写出缩放点积注意力的公式，并解释 (\sqrt{d_k})。」，我的回答是：(\text{softmax}(QK^\top/\sqrt{d_k})V)。除 (\sqrt{d_k}) 使点积方差稳定在约 1，避免 softmax 饱和与梯度问题。。如果面试官追问，我会举一个简短场景把流程串起来。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q2</span><span class="guide-q-text">多头注意力为什么比单头好？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>多子空间并行关注不同依赖关系，表达力更强，类似多通道特征。</p>
<div class="guide-expand"><span class="guide-expand-label">扩写</span><p>标准答案覆盖了要点；面试时可再补边界条件：可补一句你在项目里如何验证该方案有效（指标或案例）。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播</span><p>我会按「目标→方案→关键细节→兜底」来说。多子空间并行关注不同依赖关系，表达力更强，类似多通道特征。。最后加一句上线后怎么观测、怎么发现做得不好。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q3</span><span class="guide-q-text">Encoder 和 Decoder 的自注意力有何不同？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>Encoder 一般为双向；Decoder 用 causal mask 保证自回归；Seq2Seq 中 Decoder 还有Cross-Attention 读 Encoder。</p>
<div class="guide-expand"><span class="guide-expand-label">扩写</span><p>标准答案覆盖了要点；面试时可再补边界条件：可补一句你在项目里如何验证该方案有效（指标或案例）。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播</span><p>关于「Encoder 和 Decoder 的自注意力有何不同」，我的回答是：Encoder 一般为双向；Decoder 用 causal mask 保证自回归；Seq2Seq 中 Decoder 还有 Cross-Attention 读 Encoder。。如果面试官追问，我会举一个简短场景把流程串起来。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q4</span><span class="guide-q-text">RoPE 与正弦绝对位置编码各有什么特点？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>RoPE 通过旋转编码相对位置，常用于 Decoder LLM；正弦为固定绝对位置，可外推性讨论较多但现代架构更常选 RoPE/ALiBi。</p>
<div class="guide-expand"><span class="guide-expand-label">扩写</span><p>标准答案覆盖了要点；面试时可再补边界条件：可补一句你在项目里如何验证该方案有效（指标或案例）。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播</span><p>关于「RoPE 与正弦绝对位置编码各有什么特点」，我的回答是：RoPE 通过旋转编码相对位置，常用于 Decoder LLM；正弦为固定绝对位置，可外推性讨论较多但现代架构更常选 RoPE/ALiBi。。如果面试官追问，我会举一个简短场景把流程串起来。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q5</span><span class="guide-q-text">Pre-Norm 和 Post-Norm 区别？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>Pre-Norm：LN 在子层前；Post-Norm：LN 在子层后。深层网络 Pre-Norm 通常更稳定。</p>
<div class="guide-expand"><span class="guide-expand-label">扩写</span><p>标准答案覆盖了要点；面试时可再补边界条件：可补一句你在项目里如何验证该方案有效（指标或案例）。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播</span><p>对比题我习惯用「控制流在谁手里」来切入。Pre-Norm：LN 在子层前；Post-Norm：LN 在子层后。深层网络 Pre-Norm 通常更稳定。。最后补一句两者怎么结合，显得不是非黑即白。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q6</span><span class="guide-q-text">解释 MQA 与 GQA 的动机。</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>减少 KV Cache 与带宽；MQA 共享全部 KV，GQA 分组共享以平衡质量。</p>
<div class="guide-expand"><span class="guide-expand-label">扩写</span><p>标准答案覆盖了要点；面试时可再补边界条件：可补一句你在项目里如何验证该方案有效（指标或案例）。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播</span><p>关于「解释 MQA 与 GQA 的动机。」，我的回答是：减少 KV Cache 与带宽；MQA 共享全部 KV，GQA 分组共享以平衡质量。。如果面试官追问，我会举一个简短场景把流程串起来。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q7</span><span class="guide-q-text">Flash Attention 核心优化思想？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>分块、减少 HBM 访问、融合算子；降低注意力显存峰值并提速。</p>
<div class="guide-expand"><span class="guide-expand-label">扩写</span><p>标准答案覆盖了要点；面试时可再补边界条件：可补一句你在项目里如何验证该方案有效（指标或案例）。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播</span><p>关于「Flash Attention 核心优化思想」，我的回答是：分块、减少 HBM 访问、融合算子；降低注意力显存峰值并提速。。如果面试官追问，我会举一个简短场景把流程串起来。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q8</span><span class="guide-q-text">BPE 如何构建词表？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>从基础符号迭代合并最高频相邻对（或类似准则），直到目标规模。</p>
<div class="guide-expand"><span class="guide-expand-label">扩写</span><p>标准答案覆盖了要点；面试时可再补边界条件：可补一句你在项目里如何验证该方案有效（指标或案例）。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播</span><p>我会按「目标→方案→关键细节→兜底」来说。从基础符号迭代合并最高频相邻对（或类似准则），直到目标规模。。最后加一句上线后怎么观测、怎么发现做得不好。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q9</span><span class="guide-q-text">SentencePiece 适合中文的原因？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>不依赖空格分词，可学习子词；适合无空格语言与多语言统一。</p>
<div class="guide-expand"><span class="guide-expand-label">扩写</span><p>标准答案覆盖了要点；面试时可再补边界条件：可补一句你在项目里如何验证该方案有效（指标或案例）。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播</span><p>关于「SentencePiece 适合中文的原因」，我的回答是：不依赖空格分词，可学习子词；适合无空格语言与多语言统一。。如果面试官追问，我会举一个简短场景把流程串起来。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q10</span><span class="guide-q-text">Tokenizer 不一致会导致什么问题？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>id 错位、性能异常；微调与推理必须与基座一致。</p>
<div class="guide-expand"><span class="guide-expand-label">扩写</span><p>标准答案覆盖了要点；面试时可再补边界条件：可提缓存、模型路由、批量与流式。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播</span><p>关于「Tokenizer 不一致会导致什么问题」，我的回答是：id 错位、性能异常；微调与推理必须与基座一致。。如果面试官追问，我会举一个简短场景把流程串起来。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q11</span><span class="guide-q-text">Prefill 和 Decode 阶段特点？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>Prefill 并行处理 prompt；Decode 逐步生成，常受带宽与 KV Cache 影响。</p>
<div class="guide-expand"><span class="guide-expand-label">扩写</span><p>标准答案覆盖了要点；面试时可再补边界条件：可补一句你在项目里如何验证该方案有效（指标或案例）。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播</span><p>关于「Prefill 和 Decode 阶段特点」，我的回答是：Prefill 并行处理 prompt；Decode 逐步生成，常受带宽与 KV Cache 影响。。如果面试官追问，我会举一个简短场景把流程串起来。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q12</span><span class="guide-q-text">KV Cache 是什么？为什么能加速？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>缓存历史 K、V；避免重复计算过去 token 的注意力键值。</p>
<div class="guide-expand"><span class="guide-expand-label">扩写</span><p>标准答案覆盖了要点；面试时可再补边界条件：可补一句你在项目里如何验证该方案有效（指标或案例）。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播</span><p>这题我会先给定义：缓存历史 K、V；避免重复计算过去 token 的注意力键值。。然后补一句和普通 LLM 单次调用的区别——Agent 有闭环，会根据工具反馈多步决策，不是一次性生成就结束。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q13</span><span class="guide-q-text">Temperature、Top-k、Top-p 各影响什么？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>随机性/确定性；截断长尾候选；动态 nucleus 截断。</p>
<div class="guide-expand"><span class="guide-expand-label">扩写</span><p>标准答案覆盖了要点；面试时可再补边界条件：可补一句你在项目里如何验证该方案有效（指标或案例）。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播</span><p>关于「Temperature、Top-k、Top-p 各影响什么」，我的回答是：随机性/确定性；截断长尾候选；动态 nucleus 截断。。如果面试官追问，我会举一个简短场景把流程串起来。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q14</span><span class="guide-q-text">对话生成为什么少用 Beam Search？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>易重复、不自然；开放域更常用采样类方法。</p>
<div class="guide-expand"><span class="guide-expand-label">扩写</span><p>标准答案覆盖了要点；面试时可再补边界条件：可补一句你在项目里如何验证该方案有效（指标或案例）。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播</span><p>我会按「目标→方案→关键细节→兜底」来说。易重复、不自然；开放域更常用采样类方法。。最后加一句上线后怎么观测、怎么发现做得不好。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q15</span><span class="guide-q-text">LoRA 的低秩假设直觉？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>任务适配更新近似落在低秩子空间，用 (BA) 参数高效逼近。</p>
<div class="guide-expand"><span class="guide-expand-label">扩写</span><p>标准答案覆盖了要点；面试时可再补边界条件：可补一句你在项目里如何验证该方案有效（指标或案例）。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播</span><p>关于「LoRA 的低秩假设直觉」，我的回答是：任务适配更新近似落在低秩子空间，用 (BA) 参数高效逼近。。如果面试官追问，我会举一个简短场景把流程串起来。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q16</span><span class="guide-q-text">QLoRA 为什么省显存？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>基座 4-bit 存权重 + LoRA 训练少量参数；降低显存占用。</p>
<div class="guide-expand"><span class="guide-expand-label">扩写</span><p>标准答案覆盖了要点；面试时可再补边界条件：可补一句你在项目里如何验证该方案有效（指标或案例）。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播</span><p>我会按「目标→方案→关键细节→兜底」来说。基座 4-bit 存权重 + LoRA 训练少量参数；降低显存占用。。最后加一句上线后怎么观测、怎么发现做得不好。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q17</span><span class="guide-q-text">SFT 损失通常怎么算？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>常对 assistant token 做交叉熵，忽略 user 与 mask。</p>
<div class="guide-expand"><span class="guide-expand-label">扩写</span><p>标准答案覆盖了要点；面试时可再补边界条件：可补一句你在项目里如何验证该方案有效（指标或案例）。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播</span><p>我会按「目标→方案→关键细节→兜底」来说。常对 assistant token 做交叉熵，忽略 user 与 mask。。最后加一句上线后怎么观测、怎么发现做得不好。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q18</span><span class="guide-q-text">RLHF 三阶段是什么？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>SFT → 奖励模型 → PPO（带 KL）强化学习。</p>
<div class="guide-expand"><span class="guide-expand-label">扩写</span><p>标准答案覆盖了要点；面试时可再补边界条件：可补一句你在项目里如何验证该方案有效（指标或案例）。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播</span><p>这题我会先给定义：SFT →奖励模型→ PPO（带 KL）强化学习。。然后补一句和普通 LLM 单次调用的区别——Agent 有闭环，会根据工具反馈多步决策，不是一次性生成就结束。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q19</span><span class="guide-q-text">DPO 相对 RLHF 最大简化是什么？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>不显式训练奖励模型与 RL 循环，用偏好直接优化策略。</p>
<div class="guide-expand"><span class="guide-expand-label">扩写</span><p>标准答案覆盖了要点；面试时可再补边界条件：可提步数上限、停止条件与任务清单防迷失。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播</span><p>这题我会先给定义：不显式训练奖励模型与 RL 循环，用偏好直接优化策略。。然后补一句和普通 LLM 单次调用的区别——Agent 有闭环，会根据工具反馈多步决策，不是一次性生成就结束。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q20</span><span class="guide-q-text">PPO 中 KL 惩罚目的？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>限制偏离参考策略，减轻 reward hacking 与模式崩塌。</p>
<div class="guide-expand"><span class="guide-expand-label">扩写</span><p>标准答案覆盖了要点；面试时可再补边界条件：可补一句你在项目里如何验证该方案有效（指标或案例）。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播</span><p>关于「PPO 中 KL 惩罚目的」，我的回答是：限制偏离参考策略，减轻 reward hacking 与模式崩塌。。如果面试官追问，我会举一个简短场景把流程串起来。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q21</span><span class="guide-q-text">INT4 量化主要风险？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>精度损失；需分组缩放、混合精度或算法（GPTQ/AWQ）缓解。</p>
<div class="guide-expand"><span class="guide-expand-label">扩写</span><p>标准答案覆盖了要点；面试时可再补边界条件：可补一句你在项目里如何验证该方案有效（指标或案例）。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播</span><p>我会先承认限制，再给工程解法。精度损失；需分组缩放、混合精度或算法（GPTQ/AWQ）缓解。。强调不是不能用，而是要知道在什么场景用、配套哪些护栏。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q22</span><span class="guide-q-text">GPTQ 大致做什么？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>训练后量化权重，按层/块最小化误差，常用 Hessian 近似。</p>
<div class="guide-expand"><span class="guide-expand-label">扩写</span><p>标准答案覆盖了要点；面试时可再补边界条件：可补一句你在项目里如何验证该方案有效（指标或案例）。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播</span><p>关于「GPTQ 大致做什么」，我的回答是：训练后量化权重，按层/块最小化误差，常用 Hessian 近似。。如果面试官追问，我会举一个简短场景把流程串起来。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q23</span><span class="guide-q-text">张量并行与流水线并行区别？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>TP 切分单层张量；PP 切分不同层到不同设备。</p>
<div class="guide-expand"><span class="guide-expand-label">扩写</span><p>标准答案覆盖了要点；面试时可再补边界条件：可补一句你在项目里如何验证该方案有效（指标或案例）。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播</span><p>对比题我习惯用「控制流在谁手里」来切入。TP 切分单层张量；PP 切分不同层到不同设备。。最后补一句两者怎么结合，显得不是非黑即白。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q24</span><span class="guide-q-text">PagedAttention 解决什么？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>KV Cache 变长导致的浪费与碎片化，提高批处理效率。</p>
<div class="guide-expand"><span class="guide-expand-label">扩写</span><p>标准答案覆盖了要点；面试时可再补边界条件：可补一句你在项目里如何验证该方案有效（指标或案例）。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播</span><p>关于「PagedAttention 解决什么」，我的回答是：KV Cache 变长导致的浪费与碎片化，提高批处理效率。。如果面试官追问，我会举一个简短场景把流程串起来。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q25</span><span class="guide-q-text">投机解码如何加速？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>小模型提议多 token，大模型并行验证，减少串行步数。</p>
<div class="guide-expand"><span class="guide-expand-label">扩写</span><p>标准答案覆盖了要点；面试时可再补边界条件：可补一句你在项目里如何验证该方案有效（指标或案例）。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播</span><p>我会按「目标→方案→关键细节→兜底」来说。小模型提议多 token，大模型并行验证，减少串行步数。。最后加一句上线后怎么观测、怎么发现做得不好。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q26</span><span class="guide-q-text">MoE 训练难点？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>负载均衡、通信、路由稳定性；避免专家坍塌。</p>
<div class="guide-expand"><span class="guide-expand-label">扩写</span><p>标准答案覆盖了要点；面试时可再补边界条件：可提缓存、模型路由、批量与流式。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播</span><p>关于「MoE 训练难点」，我的回答是：负载均衡、通信、路由稳定性；避免专家坍塌。。如果面试官追问，我会举一个简短场景把流程串起来。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q27</span><span class="guide-q-text">开源模型相对闭源 API 的核心优势场景？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>数据不出域、可深度定制、长期成本可控（有算力前提）。</p>
<div class="guide-expand"><span class="guide-expand-label">扩写</span><p>标准答案覆盖了要点；面试时可再补边界条件：可提缓存、模型路由、批量与流式。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播</span><p>关于「开源模型相对闭源 API 的核心优势场景」，我的回答是：数据不出域、可深度定制、长期成本可控（有算力前提）。。如果面试官追问，我会举一个简短场景把流程串起来。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q28</span><span class="guide-q-text">GRPO / KTO 你了解到什么程度？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>诚实答：GRPO 强调组内相对优化、可与特定 RL 基础设施配合；KTO 用二元反馈与前景式损失；细节以论文与最新报告为准，面试可说明「用于改进 RLHF 复杂管线或数据形态」。</p>
<div class="guide-expand"><span class="guide-expand-label">扩写</span><p>标准答案覆盖了要点；面试时可再补边界条件：可补一句你在项目里如何验证该方案有效（指标或案例）。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播</span><p>关于「GRPO / KTO 你了解到什么程度」，我的回答是：诚实答：GRPO 强调组内相对优化、可与特定 RL 基础设施配合；KTO 用二元反馈与前景式损失；细节以论文与最新报告为准，面试可说明「用于改进 RLHF 复杂管线或数据形态」。附录：速查公式与术语符号/术语含义 (d_{model}) 模型隐藏维度 (d_k) 每头 Key/Query 维度 KV Cache 缓存每步 K、V 以加速自回归 PEFT 参数高效微调总称（LoRA、Adapter 。如果面试官追问，我会举一个简短场景把流程串起来。</p></div>
<p>附录：速查公式与术语符号/术语                      含义(d_{model})     模型隐藏维度(d_k)           每头 Key/Query 维度KV Cache        缓存每步 K、V 以加速自回归PEFT            参数高效微调总称（LoRA、Adapter 等）PTQ             训练后量化TP / PP         张量并行 / 流水线并行文档版本：与「面试八股文」系列一致，可按岗位深度补充论文与源码阅读笔记。</p>
</div></div>
</div>
