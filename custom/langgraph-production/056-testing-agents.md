---
title: "怎么测试 LangGraph Agent？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 工程]
point: "测试"
source: GitHub 100 Questions
---

**题目**：怎么测试 LangGraph Agent？

**结论句（15 秒）**：三层：节点单测 mock state；子图集成测；端到端黄金集 + mock LLM/tool 固定输出。

**追问方向**：怎么 mock 非确定性 LLM？ · CI 怎么跑？

### 回答

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

**一句话**：测 Agent 分三层——先测每个节点函数（最便宜），再测图的路由走向（mock LLM），最后端到端黄金集（最贵放夜间跑）。LLM 非确定性用「录播回复」或「只断言结构」解决。

**打个比方**：测汽车：先测每个零件（节点单测），再测组装后各系统联动（集成测），最后上路跑（E2E）——不会每改一个螺丝就上路跑一圈。

#### 📖 面试展开（详细版）

LangGraph Agent 测试的核心优势是「图结构可分层测」——不必每次改 prompt 都跑完整 E2E。我习惯三层策略：

单元测试（节点级）：每个 node 函数是纯函数，传 mock state 断言返回的 partial update。不依赖 compile、不调用真实 LLM。intent_node 测分类准确性；should_continue 条件函数测路由逻辑。成本最低，CI 每次 commit 都跑。

集成测试（图级）：compile 图，但 mock LLM 和 tools 返回固定响应。测条件边走向是否符合预期——「mock LLM 返回 tool_call → 应路由到 tool_node → 再回 agent_node」。snapshot 对比 state 演化轨迹。CI 每次 commit 跑，成本可控。

E2E 测试（端到端）：黄金问题集（50-100 条），用 recorded LLM responses（录播模式）或 contract test（只断言输出结构、不断言原文）。对比 state 轨迹 snapshot 或最终 answer 质量指标。夜间 CI 跑，成本较高。

mock 非确定性 LLM 的两种策略：recorded responses——首次运行录下 LLM 输出，后续 replay；contract test——断言「回答包含引用来源」「intent 字段存在」等结构约束，不断言具体措辞。CI 策略：单元+集成每次 PR 跑，E2E 夜间或 pre-release 跑。

#### 💡 核心要点
- 节点函数纯函数化最好测
- mock tools 固定返回
- snapshot 测 state 演化

#### 📝 代码/配置示例

```python
# 单元：节点单测
def test_should_continue():
    assert should_continue({"step_count": 5, "messages": []}) == "continue"
    assert should_continue({"step_count": 25, "messages": []}) == "fallback"

# 集成：mock LLM 测路由
@pytest.fixture
def mock_llm(monkeypatch):
    monkeypatch.setattr("llm.invoke", lambda x: AIMessage(content="", tool_calls=[...]))

def test_react_loop(mock_llm):
    result = app.invoke({"messages": [HumanMessage("查天气")]})
    assert "get_weather" in str(result)
```

#### 🔁 追问怎么接

- **mock 非确定性 LLM**：recorded responses 录播 replay，或 contract test 只断言结构
- **CI 怎么跑**：单元+集成每次 PR，E2E 夜间/pre-release
- **加分项**：三层分离、snapshot 测 state 演化、条件边路由可单测
