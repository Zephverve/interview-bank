---
title: "prompt 结合是怎么做的？"
round: 一面
difficulty: ⭐⭐⭐
tags: [LangGraph, 面经]
point: "Prompt"
source: 牛客 · 阿里淘天
---

**题目**：prompt 结合是怎么做的？

**结论句（15 秒）**：静态 system prompt 管角色边界，动态 prompt 节点按 state 注入检索结果/工具输出/用户上下文，分节点拆分而非一个巨型 prompt。

**追问方向**：和 LangGraph 节点关系？ · 怎么防 prompt 漂移？

### 回答

**优先级**：P1 · 1 篇面经

#### 🗣️ 先用大白话说

**一句话**：LangGraph 里 prompt 不是一个大模板，而是每个节点有自己的 prompt——静态 system 段管角色，动态段从 state 注入当前步需要的上下文。

**打个比方**：像做菜每道工序有自己的「小纸条」——切配看食材清单，炒菜看火候说明，摆盘看出品标准——而不是一张 5000 字的总菜谱从头看到尾。

#### 📖 面试展开（详细版）

阿里淘天一面原题，考察**prompt 工程在图编排里的落地方式**。

**分机节点策略**：
- **静态 system prompt**：角色定义、输出格式约束、安全边界——所有节点共享，Git 版本化管理
- **动态 prompt 段**：从 state 字段填充——`generate` 节点的 template 填 `state["docs"]`；`tool_summary` 节点填 `state["tool_results"]`

**为什么不用巨型 prompt**：
① 省 token——每个 node 只拿当前步需要的上下文，不是 5000 字全塞
② 利 debug——retrieve prompt 改了不影响 generate，可以单独 A/B
③ 利评测——每个节点的 prompt 可以单独回归

**和 LangGraph 节点的关系**：**节点即 prompt 边界**——换节点就换 prompt 策略。retrieve 节点的 prompt 管「怎么写 query」；generate 节点的 prompt 管「怎么基于 docs 回答」；cite_check 节点的 prompt 管「怎么验证引用」。比 Chain 里一个大 PromptTemplate 清晰得多。

**防 prompt 漂移**：Git 版本化 + LangSmith prompt hub；改 prompt 必须跑回归集；线上 A/B 对比新旧 prompt 的成功率和 token 消耗。

#### 💡 核心要点
- 每节点独立 prompt 模板
- state 字段填充动态段
- 版本化+A/B

#### 📝 代码/配置示例

```python
# 每个节点独立 prompt 模板
GENERATE_PROMPT = ChatPromptTemplate.from_messages([
    ("system", SYSTEM_PROMPT),  # 静态，Git 版本化
    ("human", "参考文档：\n{docs}\n\n用户问题：{query}"),  # 动态，从 state 填充
])

def generate_node(state):
    prompt = GENERATE_PROMPT.format(docs=state["docs"], query=state["query"])
    return {"messages": [llm.invoke(prompt)]}
```

#### 🔁 追问怎么接

- **「和 LangGraph 节点关系？」** → 节点即 prompt 边界；每个 node 有自己的 prompt template，从 state 取当前步需要的字段；换节点 = 换 prompt 策略。
- **「怎么防 prompt 漂移？」** → Git 版本化 + 改 prompt 必跑回归集 + LangSmith A/B 对比；禁止线上直接改 prompt 不记录版本。
