---
title: "LangGraph Agent 怎么做评测（Evaluation）？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 进阶]
point: "评测"
source: GitHub 100 Questions
---

**题目**：LangGraph Agent 怎么做评测（Evaluation）？

**结论句（15 秒）**：LangSmith dataset 跑批量 invoke，断言最终答案和中间轨迹（经过哪些节点）；节点级指标单独评。

**追问方向**：非确定性怎么评？

### 回答

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

**一句话**：LangGraph 评测分两级——端到端看最终答案+轨迹，节点级看每个 node 的输入输出；LangSmith 跑批量回归。

**打个比方**：端到端像考最终成绩，节点级像考每科分数——总分高但数学不及格，说明 generate 节点有问题。

#### 📖 面试展开（详细版）

LangGraph Agent 评测考察**是否理解图编排的评测优势**——能评轨迹，不只是评最终答案。

**Level 1：端到端评测**
- 黄金问题集（50-200 条）batch invoke
- 断言最终答案：内容正确性、citation 格式、是否调了正确 tool
- **轨迹断言**（LangGraph 独有优势）：期望经过 `intent → retrieve → grade → generate`，如果走了 `fallback` 则标记失败
- 工具：LangSmith dataset + experiment

**Level 2：节点级评测**
- 单独测每个 node：intent 分类准确率、retrieve recall@k、grade 通过率
- 方法：mock 上游 state，只跑单个 node，对比期望输出
- 好处：定位问题节点，不用等端到端失败才发现

**LangSmith 集成**：
```python
results = evaluate(
    graph.invoke,
    data=dataset,
    evaluators=[answer_correctness, trajectory_match],
)
```

**非确定性处理**：
- LLM-as-judge：用另一个 LLM 评答案质量（1-5 分）
- 结构匹配：不断言 exact text，断言 JSON schema / 关键词 / citation 数量
- 多次采样：同一问题跑 3 次，成功率 > 66% 算 pass

**CI 集成**：夜间跑回归集，节点级 + 端到端，失败自动通知 + block merge。

#### 💡 核心要点
- 端到端+轨迹断言
- 节点级黄金输入输出
- 回归 CI 夜间跑

#### 📝 代码/配置示例

```python
# 轨迹断言
def trajectory_match(run, example):
    expected_nodes = ["retrieve", "grade", "generate"]
    actual_nodes = [s["node"] for s in run.steps]
    return {"score": all(n in actual_nodes for n in expected_nodes)}

# 节点级单测
def test_grade_node():
    state = {"docs": [mock_doc], "query": "test"}
    result = grade_node(state)
    assert result["grade_score"] > 0.7
```

#### 🔁 追问怎么接

- **「非确定性怎么评？」** → LLM-as-judge 评质量；结构匹配（JSON schema/关键词/citation 数）；多次采样取成功率；节点级评测用 mock state 测确定性部分（如 intent 分类）。
