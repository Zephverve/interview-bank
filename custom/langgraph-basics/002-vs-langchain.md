---
title: "LangChain 和 LangGraph 有什么区别？"
round: 一面
difficulty: ⭐⭐⭐
tags: [LangGraph, 基础]
point: "框架对比"
source: 牛客 · 阿里淘天/某大厂
sourceUrl: https://www.nowcoder.com/feed/main/detail/edbf58731d884f8f9e094a9b2eda0cf9
---

**题目**：LangChain 和 LangGraph 有什么区别？

**结论句（15 秒）**：LangChain 是线性 DAG 流水线，适合固定步骤 RAG；LangGraph 是图状态机，支持循环、条件分支、显式 State 和 checkpoint，适合复杂 Agent。

**追问方向**：什么场景必须用 LangGraph？ · 和纯 while 循环比优势？ · 能否混用？

### 回答

**优先级**：P0 · 6+ 篇面经

#### 🗣️ 先用大白话说

LangChain 擅长把「检索、拼 prompt、调模型」串成一条直线，适合标准化 RAG 和单次问答。LangGraph 在 LangChain 之上，把流程画成有向图，节点之间共享 State，边可以是条件跳转，还能走回边形成循环。最大的差别有三：控制流（能不能绕圈）、状态管理（有没有显式 schema 和 reducer）、生产特性（checkpoint 和 interrupt）。选型不看热度，看任务是否需要重试、回溯或人工审批。

#### 📖 面试展开（详细版）

**① 是什么**

LangChain 核心是 Chain 和 LCEL（LangChain Expression Language），用管道把 retriever、prompt template、LLM 串起来，本质是单向 DAG。LangGraph 是编排层，把流程建成 StateGraph：Node 是计算单元，Edge 是路由，State 是显式 schema，每步可 checkpoint。

**② 为什么重要**

阿里、字节、百度 Agent 岗一面几乎必问这题，考察你是否理解「什么时候该上图」。答不好会显得只会调 API、不懂工程取舍。面试官想听的是：你能根据业务特征选型，而不是追框架热度。

**③ 怎么用 / 执行流程**

LangChain 典型：retriever | prompt | llm 管道，一次 invoke 走完。LangGraph 典型：定义 State → add_node/add_edge → compile → 多次 super-step 循环直到 END。两者可混用：编排用 LangGraph，底层 retriever、message、tool 仍用 langchain_core 组件。

**④ 项目例子**

科研 RAG Agent 用 LangGraph：Retrieve → Grade → Rewrite 回 Retrieve → Generate → Citation check，不通过再回 Generate。这种带环流程用 Chain 要写大量嵌套 try-except 和手动状态变量；用 Graph 一张图可审计，每个 node 可单测。固定「检索→生成→格式化」三步则 Chain 二十行搞定。

**⑤ 常见坑**

有循环/审批/持久化需求却坚持用 Chain 套 while；反过来，固定线性三步硬上 LangGraph 增加团队学习成本；以为两者互斥——实际工程里常混用。

#### 💡 核心要点
- LangChain：无状态/外部管记忆，A→B→C 单向
- LangGraph：显式 State + reducer，可回边形成循环
- LangGraph 独有：interrupt、checkpointer、thread_id 会话隔离

#### 📝 代码/配置示例

```python
# LangChain：线性管道
chain = retriever | prompt | llm
result = chain.invoke({"question": q})

# LangGraph：带环图
graph.add_conditional_edges("grade", route, {"rewrite": "rewrite", "generate": "generate"})
graph.add_edge("rewrite", "retrieve")  # 回边
```

#### 🔁 追问怎么接

- 「必须用 LangGraph」：循环、HITL、多 Agent 协作，占一个就该上
- 「和 while 循环比」：LangGraph 有 reducer、checkpoint、可观测，while 只是裸循环
- 「能否混用」：能，编排 Graph + 组件 Chain 是常见实践
- 「缺点」：学习曲线陡、简单场景更重
