---
title: "Agent 评测闭环怎么搭建？"
round: 二面
difficulty: ⭐⭐⭐⭐
tags: [LangGraph, 面经]
point: "评测"
source: 牛客 · 百度
---

**题目**：Agent 评测闭环怎么搭建？

**结论句（15 秒）**：离线集分层（简单/长尾/对抗）+ 在线成功率/延迟/token/工具错误率 + 人工抽检 + bad case 自动入库 + 节点级归因。

**追问方向**：准确率还能怎么优化？ · 泄漏到训练怎么防？

### 回答

**优先级**：P1 · 2 篇面经

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

百度面经高频题，考察**有没有线上思维**，不是背评测指标名词。

**离线循环**：
- 黄金集三层：简单（冒烟）、长尾（边界 case）、对抗（prompt 注入/空检索）
- 标注规范：什么算「正确」——答案内容 + 引用格式 + 是否调了正确 tool
- 防泄漏：评测集不进 fine-tune 训练集，用 hold-out set
- **节点级回归**：单独跑 intent 分类准确率、retrieve recall@k、grade 通过率——LangGraph trace 天然支持

**在线循环**：
- 核心指标：任务成功率、P99 延迟、token 消耗、tool 错误率、人工抽检比例
- bad case 自动入库：从 LangSmith trace 提取失败 thread，标注失败 node（如 grade 未通过、tool timeout）
- 周节奏：bad case Review → 优先修高频失败 node → 回归集验证

**优化不只调 prompt**——四层：数据侧（难例挖掘、合成对抗样本）、模型侧（换强模型/蒸馏）、系统侧（结构化输出 + 后处理校验）、RAG 侧（chunk 策略 + rerank）。

LangGraph 的核心优势：**失败可定位到具体 node**，评测从「答案对不对」升级到「哪一步出了问题」。

