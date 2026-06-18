---
title: SFT 之后还有哪些 Post-Training？RLHF、DPO、GRPO、拒…
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [LLM, 小林笔记]
point: SFT 之后还有哪些 Post-Training？RLHF、
source: 小林面试笔记
---

**题目**：SFT 之后还有哪些 Post-Training？RLHF、DPO、GRPO、拒绝采样什么关系？

**结论句（15 秒）**：我理解 Post-Training 是个上位概念，指的是 SFT 之后所有继续提升模型质量的训练阶段

**追问方向**：结合项目经历举例 · 优缺点与适用场景

### 回答

我理解 Post-Training 是个上位概念，指的是 SFT 之后所有继续提升模型质量的训练阶段。它不是一个单一方法，而是一族方法的总称。

SFT 让模型学会「按指令格式回答」，但 SFT 后的模型还有两个问题没解决。第一，回答可能有害、不符合人类价值观；第二，同一个问题的多种合格回答里，模型不知道哪个更受人类欢迎。这就是 Post-Training 要补的课。

主流的 Post-Training 方法有五大类。

RLHF（Reinforcement Learning from Human Feedback） 是最经典的方案。流程是先用人类对回答的排名训练一个奖励模型，再用 PPO 算法让大模型生成的回答尽量得高分。同时维护一个参考模型用 KL 散度约束，防止主模型「钻空子」。优点是效果上限高，缺点是流程复杂、要同时维护 4 个模型、训练不稳定。
