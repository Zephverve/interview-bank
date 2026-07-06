---
title: "LangGraph vs AutoGen vs CrewAI 怎么选？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 基础]
point: "框架选型"
source: 知乎对比文 + 面经
---

**题目**：LangGraph vs AutoGen vs CrewAI 怎么选？

**结论句（15 秒）**：LangGraph 强在可控、可审计、可恢复，适合严肃生产系统；CrewAI 快速原型；AutoGen 多 Agent 协作实验。

**追问方向**：团队没有图编排经验怎么办？ · 长期维护哪个成本低？

### 回答

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

三个框架哲学不同。LangGraph 把 Agent 当状态机建，显式定义状态、节点、边，可控性和可恢复性最好，适合长链路、要审计、要 HITL 的生产系统，代价是前期设计重。CrewAI 用角色和任务描述快速搭多 Agent，上手快，适合原型。AutoGen 强调 Agent 间对话协作，适合研究实验，生产里行为较难约束。决策树：怕失控、要 checkpoint、链路复杂 → LangGraph；今天要 demo → CrewAI；研究多 Agent 对话 → AutoGen。

#### 📖 面试展开（详细版）

**① 是什么**

LangGraph：显式状态机编排，LangChain 生态。CrewAI：角色（Role）+ 任务（Task）+ Crew 抽象，YAML 式配置多 Agent。AutoGen：对话式多 Agent，GroupChat 驱动协作。

**② 为什么重要**

字节、独角兽面经爱问框架对比，考察广度与深度。不必装全用过，但要讲清哲学差异和选型依据。

**③ 怎么用 / 决策树**

生产长链路 + checkpoint + HITL → LangGraph。快速多 Agent 原型 → CrewAI。研究/实验性对话协作 → AutoGen。团队无图编排经验：先用 CrewAI 验证需求，复杂度上来再迁 LangGraph。

**④ 项目例子**

EvoAgent 选 LangGraph 因为 citation 校验失败要回环、敏感结论要 interrupt，需要可审计的节点级 trace。同团队另一个内部提效 demo 用 CrewAI 三天出原型。

**⑤ 常见坑**

生产系统用 AutoGen 难控行为；复杂链路用 CrewAI 后期难维护；选 LangGraph 但团队无人懂 reducer/checkpoint。

#### 💡 核心要点
- LangGraph：显式状态机，学习曲线陡，链路最稳
- CrewAI：角色+任务快速成型，中等复杂度
- AutoGen：对话式协作表达强，行为更动态难控

#### 📝 代码/配置示例

```python
# LangGraph：显式图
graph.add_node("researcher", research)
graph.add_conditional_edges("supervisor", route, {...})

# CrewAI：角色驱动
# researcher = Agent(role="Researcher", goal="...")
# crew = Crew(agents=[...], tasks=[...])
```

#### 🔁 追问怎么接

- 「团队无经验」：先 CrewAI 验证，再迁 LangGraph；或招/培一个图编排 owner
- 「长期维护」：LangGraph 随复杂度上升优势放大，CrewAI 中等复杂度性价比最高
- 「能否混用」：可以，LangGraph 编排 + 调用 CrewAI 子任务
