---
title: 大模型部署有哪些主流方案？vLLM、TGI、llama.cpp、SGLang 实…
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [LLM, 小林笔记]
point: 大模型部署有哪些主流方案？vLLM、TGI、llama.cp
source: 小林面试笔记
---

**题目**：大模型部署有哪些主流方案？vLLM、TGI、llama.cpp、SGLang 实际项目里怎么选？

**结论句（15 秒）**：我理解大模型部署框架的本质问题是：怎么在固定的硬件上跑得更快、更省显存、支持更多并发用户

**追问方向**：结合项目经历举例 · 优缺点与适用场景

### 回答

我理解大模型部署框架的本质问题是：怎么在固定的硬件上跑得更快、更省显存、支持更多并发用户？

主流框架按定位分四类。

1. vLLM：当前生产部署里很常见的框架，UC Berkeley 出品。核心创新是 PagedAttention，把 KV Cache 像操作系统虚拟内存一样分页管理，大幅减少碎片，显存利用率能明显提高。配合 Continuous Batching 实现很高的吞吐量，是很多团队部署 LLM API 时会优先评估的方案。

2. SGLang：vLLM 之后的新一代推理框架，LMSYS 出品。核心创新是 RadixAttention，把多请求的共享前缀（如 System Prompt、Few-shot 示例、对话历史）组织成树结构，相同前缀只存一份 KV Cache。在 Agent、多轮对话、批量 Prompt 场景下比 vLLM 显存更省、首 token 延迟更低。

3. TGI（Text Generation Inference）：HuggingFace 出品，与整个 HF 生态深度集成。优点是开箱即用、支持各种 HF Hub 上的模型、企业级 API 接口（鉴权、metrics、健康检查）。但要注意它近两年的增长势头不如 vLLM / SGLang，选它更多是看中 HF 生态和既有系统集成，而不是追求极致性能。
