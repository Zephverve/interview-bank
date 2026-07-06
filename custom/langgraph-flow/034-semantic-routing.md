---
title: "如何实现语义路由（Semantic Routing）？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 控制流]
point: "路由"
source: GitHub 100 Questions
---

**题目**：如何实现语义路由（Semantic Routing）？

**结论句（15 秒）**：用 LLM 或 embedding 分类器在条件边/路由节点判断意图，映射到不同子图或工具集。

**追问方向**：路由不准怎么办？ · 和 intent node 区别？

### 回答

**优先级**：P2 · 1 篇

#### 🗣️ 先用大白话说

语义路由就是在图入口用 LLM 或 embedding 分类用户意图，然后条件边根据分类结果跳到不同分支。实现上单独建 router 节点，输出 state 里的 route_key，条件边查表跳转。为省 token 可用小模型或 embedding+阈值。路由不稳时加澄清节点 interrupt 问用户，或低置信走安全默认路径。蚂蚁面经里的 LangGraph 路由设计是同类题。

#### 📖 面试展开（详细版）

**是什么**：语义路由根据用户输入的语义（而非关键词规则）决定后续走哪条分支。可以用 LLM 分类、embedding 相似度匹配、或专用 fine-tuned 小模型。

**为什么需要**：客服、助手类产品里「查订单」和「投诉退款」需要完全不同的工具集和子流程，入口路由决定了整个图的执行路径。

**实现方式**：专用 router 节点读取 messages，调用分类器，输出 state.route_key（如 "order_query"、"complaint"、"general_qa"）。后续条件边读 route_key 映射到不同子图或工具集。复杂场景可以用子图（Subgraph）封装各分支。

**路由不准怎么办**：低置信度时走澄清节点（interrupt 问用户确认意图）；设置默认安全路径（general_qa）；收集 bad case 回流微调分类器；A/B 测试不同路由策略。

**和 intent node 区别**：intent node 是实现手段，语义路由是设计模式。intent node 输出意图标签，条件边/子图完成实际路由。

**踩坑**：路由节点用 GPT-4 太贵；分类类别过多导致准确率下降；没有低置信兜底导致错误路由连锁失败。

#### 💡 核心要点
- 专用 router 节点输出 next_route
- 可小模型分类降本
- 低置信走澄清或默认路径

#### 📝 代码/配置示例

```python
def router_node(state):
    intent = classify_intent(state["messages"][-1].content)  # LLM or embedding
    return {"route_key": intent.label, "route_confidence": intent.score}

def route_by_intent(state):
    if state.get("route_confidence", 0) < 0.6:
        return "clarify"
    return state["route_key"]

graph.add_node("router", router_node)
graph.add_conditional_edges(
    "router",
    route_by_intent,
    {"order_query": "order_subgraph", "complaint": "complaint_flow", "clarify": "clarify", "general_qa": "rag"},
)
```

#### 🔁 追问怎么接

**「路由不准怎么办？」**——低置信走澄清 interrupt；默认安全路径；bad case 回流评测集迭代分类器。

**「和 intent node 区别？」**——intent node 是产出 route_key 的节点；语义路由是用这个 key 做分支的整体设计模式。
