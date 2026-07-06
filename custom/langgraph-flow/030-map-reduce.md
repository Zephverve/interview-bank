---
title: "LangGraph 里 Map-Reduce 工作流怎么实现？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 控制流]
point: "Map-Reduce"
source: GitHub 100 Questions
---

**题目**：LangGraph 里 Map-Reduce 工作流怎么实现？

**结论句（15 秒）**：Map 阶段 Send fan-out 到 worker 节点，Reduce 阶段汇总节点合并结果进 state。

**追问方向**：部分 worker 失败怎么办？ · 适合什么业务？

### 回答

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

Map-Reduce 在 LangGraph 里就是 Send + reducer 的组合拳。splitter 节点把大任务拆成 N 份，Send 给 worker 并行处理，reduce 节点把各 worker 结果合并——可以拼接、投票或再调 LLM 综合。部分 worker 失败时让它返回 error 标志，reduce 决定跳过或重试，别让一颗老鼠屎坏整锅粥。

#### 📖 面试展开（详细版）

**Map 阶段**：splitter 节点将输入拆分为子任务列表，通过 Send API fan-out 到 worker 节点。每个 worker 独立处理一个子任务，写回 state 的对应字段（需 reducer 合并）。

**Reduce 阶段**：专门的 reduce 节点读取所有 worker 输出，做合并——文本拼接、结构化聚合、或再调 LLM 生成综合摘要。

**部分失败处理**：worker 节点 catch 异常，返回 {"results": [{"status": "error", "chunk_id": id}]} 而非抛异常。reduce 节点统计成功率，低于阈值走 fallback 或重试失败的 chunk。

**适合什么业务**：批量文档入库摘要、多源并行检索（向量库+关键词+知识图谱）、大规模 eval 跑批、长文档分段翻译。

**和 Hadoop Map-Reduce 对比**：思想一致（分而治之再汇总），但粒度是 Agent 节点而非机器节点，调度由 LangGraph runtime 管理。

**踩坑**：worker 抛异常导致整图失败；reduce 节点等所有 worker 但某个永远不回；合并时 token 超限要分段 reduce。

#### 💡 核心要点
- fan-out → 并行 worker → fan-in
- 失败 worker 结果标 error 仍进 reduce
- 适合批量文档/多源检索

#### 📝 代码/配置示例

```python
def split_docs(state):
    chunks = chunk_document(state["document"])
    return [Send("summarize_worker", {"chunk": c, "id": i}) for i, c in enumerate(chunks)]

def summarize_worker(state):
    try:
        s = llm_summarize(state["chunk"])
        return {"partial_summaries": [{"id": state["id"], "text": s, "ok": True}]}
    except Exception as e:
        return {"partial_summaries": [{"id": state["id"], "ok": False, "err": str(e)}]}

def reduce_node(state):
    ok = [p for p in state["partial_summaries"] if p["ok"]]
    return {"final_summary": llm_merge(ok)}
```

#### 🔁 追问怎么接

**「部分 worker 失败怎么办？」**——worker 返回 error 标志不抛异常；reduce 统计成功率决定继续/重试/fallback；可 Send 重试失败 chunk。

**「适合什么业务？」**——批量文档处理、多源检索、eval 跑批。不适合强顺序依赖的任务。
