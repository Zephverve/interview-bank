---
title: "子图（Subgraph）怎么用？"
round: 二面
difficulty: ⭐⭐⭐⭐
tags: [LangGraph, 多Agent]
point: "子图"
source: GitHub + 编程导航面经
---

**题目**：子图（Subgraph）怎么用？

**结论句（15 秒）**：子 StateGraph compile 后作为父图节点，可映射父子 state 字段，实现模块化和大工作流拆分。

**追问方向**：父子 state 怎么映射？ · 嵌套层级建议几层？

### 回答

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

**一句话**：子图就是「图里套图」——把一整段复杂流程（比如 RAG 检索链）单独做成一张小图，compile 后塞进大图当一个节点，像函数调用一样模块化。

**打个比方**：大工厂流水线里，「质检车间」本身也是一条独立流水线——原料进去、检测、分拣、出库，对外只暴露「进料口」和「出料口」。

#### 📖 面试展开（详细版）

子图（Subgraph）是 LangGraph 模块化大工作流的核心手段。做法是：先为子流程（如 RAG 检索链、代码审查环、审批流）单独建一张 StateGraph，定义自己的 State schema 和节点，compile 得到子图 app；然后在父图的某个节点函数里 invoke 这个子图，并做父子 state 字段映射。

映射是关键工程点：父图的 query 字段映射为子图的输入，子图执行完返回的结果映射回父图的 retrieval_result 或 review_output。映射函数写在父节点里，相当于 adapter 层——子图不需要知道父图全貌，父图也不需要了解子图内部细节。这样 RAG 组、Agent 组、审批组可以各自维护子图，联调时只对接输入输出契约。

子图的价值在三方面：模块化（独立测试、独立部署、独立版本）；复用（同一个 RAG 子图可被多个父图节点调用）；降低认知负担（debug 时先定位到哪个子图出问题，再进子图内部排查）。

编程导航面经场景设计题「内部提效系统 AI 改造」很适合套子图——大工作流按功能拆：意图识别子图、RAG 子图、工具调用子图、人工审批子图。嵌套层级建议不超过 2-3 层，超过后 trace 链路太长、state 传递损耗大、出问题难定位。每层子图必须有清晰的输入输出契约文档。

#### 💡 核心要点
- 子图独立测试部署
- 父图通过节点包装 invoke 子图
- 适合 RAG 子流程、审批子流程

#### 📝 代码/配置示例

```python
# 子图：RAG 流水线
rag_builder = StateGraph(RagState)
rag_builder.add_node("retrieve", retrieve_node)
rag_builder.add_node("grade", grade_node)
rag_app = rag_builder.compile()

# 父图：包装子图
def rag_wrapper(state: ParentState) -> dict:
    sub_result = rag_app.invoke({"query": state["user_query"]})
    return {"retrieval_result": sub_result["docs"]}

parent_builder.add_node("rag", rag_wrapper)
```

#### 🔁 追问怎么接

- **父子 state 映射**：父节点函数里做字段转换，子图只暴露最小输入输出
- **嵌套层级**：建议 2-3 层，超过后 trace 太长、debug 困难
- **加分项**：提到子图可独立单测、独立版本发布、团队分工维护
