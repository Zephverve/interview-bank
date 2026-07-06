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

**📖 核心要点**
- Mermaid/PNG 导出
- stream_mode=values
- 断点单步 invoke

**🗣️ 标准口语答案**

可视化用 compiled graph 的 get_graph().draw_mermaid_png() 或 print_ascii 面试白板画拓扑。调试用 stream_mode="values" 看每步 state，或 LangSmith trace。

单节点调试 mock state 直接调节点函数，不必跑全图。面试带一张自己项目的 Mermaid 图很加分。

