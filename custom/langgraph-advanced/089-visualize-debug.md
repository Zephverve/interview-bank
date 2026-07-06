---
title: "怎么可视化和调试 LangGraph？"
round: 一面
difficulty: ⭐⭐
tags: [LangGraph, 进阶]
point: "可视化"
source: GitHub 100 Questions
---

**题目**：怎么可视化和调试 LangGraph？

**结论句（15 秒）**：app.get_graph().draw_mermaid_png() 导出图；stream values 模式看 state；LangSmith 看轨迹。

**追问方向**：给面试官画过图吗？

### 回答

**优先级**：P2 · 1 篇

**🗣️ 标准口语答案**

这道题我会这样回答面试官：

可视化和调试是**开发效率的关键**，也是面试加分项。

**可视化方法**：
1. `graph.get_graph().draw_mermaid_png()` → 导出 PNG 图片
2. `graph.get_graph().print_ascii()` → 终端打印 ASCII 图
3. Mermaid 语法 → 放文档/README/面试 PPT

**调试方法**：

**方法 1：stream_mode="values"**
```python
for step in graph.stream(input, stream_mode="values"):
    print(step)  # 每步完整 state
```
- 看到每步 state 怎么变化
- 定位哪一步出了问题

**方法 2：LangSmith trace**
- 自动记录每步 node 输入输出、耗时、token
- 线上 bad case 回溯
- 对比不同版本的 trace

**方法 3：单节点调试**
```python
mock_state = {"messages": [...], "docs": [...]}
result = grade_node(mock_state)  # 直接调，不跑全图
```
- 快速验证单个节点逻辑
- 单元测试的基础

**面试加分**：带一张自己项目的 Mermaid 图，30 秒画完 ReAct 环或 RAG 流程，比纯口述强十倍。

