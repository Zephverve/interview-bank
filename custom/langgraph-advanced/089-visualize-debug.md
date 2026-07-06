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

#### 🗣️ 先用大白话说

**一句话**：可视化用 draw_mermaid_png 导出图结构；调试用 stream_mode="values" 看每步 state 变化；LangSmith 看完整轨迹。

**打个比方**：可视化像看地图（图结构），调试像看行车记录仪（每步 state 变化），LangSmith 像黑匣子（完整轨迹回放）。

#### 📖 面试展开（详细版）

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

#### 💡 核心要点
- Mermaid/PNG 导出
- stream_mode=values
- 断点单步 invoke

#### 📝 代码/配置示例

```python
# 可视化
png_bytes = graph.get_graph().draw_mermaid_png()
with open("graph.png", "wb") as f:
    f.write(png_bytes)

# 调试：逐步看 state
for event in graph.stream(input, stream_mode="values"):
    print(f"Step: {event}")

# 单节点调试
result = grade_node({"docs": mock_docs, "query": "test"})
```

#### 🔁 追问怎么接

- **「给面试官画过图吗？」** → 准备一张自己项目的 Mermaid 图（PNG 或手绘）；面试时 30 秒画完核心拓扑（3-5 个节点 + 条件边）；重点展示环（ReAct）或回边（grade→rewrite）。
