---
title: 四个引擎的能力不一样，接口怎么做到统一？
round: 二面
difficulty: ⭐⭐⭐⭐
tags: [memory, 面试]
point: 四个引擎的能力不一样，接口怎么做到统一？
---

**题目**：四个引擎的能力不一样，接口怎么做到统一？

### 回答

这是个真问题。Graphiti 支持时序知识图谱查询，Mem0 根本不支持这个概念，硬要统一接口，要么是让 Mem0 返回假数据，要么是接口设计得过于抽象而丧失表达力。

**我的做法：不做大而全的统一抽象，只定一个最小协议 + 统一错误体系。**

核心抽象就一个文件（`core/base.py`），而且只有**一个方法**：

```python
@runtime_checkable
class BaseMemoryEngine(Protocol):
    """所有引擎适配器须满足的最小协议，第二阶段将进一步扩展。"""

    async def ensure_ready(self) -> None:
        """幂等初始化——可安全重复调用。"""
        ...
```

**为什么只定一个 `ensure_ready()`？** 这是我设计时的一个明确取舍：**四个引擎的资源模型本来就不一样** —— Graphiti 是「图谱 graph」、LightRAG 是「工作区 workspace」、Mem0 是「用户 user_id」、Hindsight 是「记忆库 bank」。强行抽象出一套统一的增删改查，要么丢信息、要么变成四不像。所以我只统一三件事：

1. **生命周期** —— `ensure_ready()` 幂等初始化，上层不用关心各引擎的启动顺序差异；
2. **错误语义** —— 统一错误体系，底层 SDK 的差异在 Adapter 内部被抹平；
3. **HTTP 路由** —— `/v1/engines/{engine}/...`，同一个请求体只改路径参数就能切换引擎。

**具体能力各自暴露**，不硬塞进同一套方法名。Graphiti 是 `/graphs/{name}/episodes` + `/export`，Mem0 是 `/memories` + `/memories/search`，Hindsight 是 `/banks/{bank_id}` + `/retain` + `/recall` —— 它们**长什么样就是什么样**，我没有为了「看起来统一」去改名。

**关于错误体系**（这是我下过功夫的地方，最能体现工程判断）：不能把底层 SDK 异常直接抛给上层，否则前端只能看到一个空类名。我做了 `EngineError` 包装：

```python
class EngineError(MemoryRuntimeError):
    def __init__(self, engine: str, message: str, cause: Exception | None = None):
        detail = f"[{engine}] {message}"
        if cause is not None:
            detail = f"{detail}: {_format_exception_chain(cause)}"
        ...
```

其中 `_format_exception_chain` 会**递归展开嵌套异常**（最多 4 层）。这是被真实问题逼出来的：Qdrant 报错时真正的根因藏在 `ResponseHandlingException.source` 里，不展开的话 UI 上只看到 `ResponseHandlingException` 这个空壳，排查要从头再来；展开之后能直接看到「Qdrant 连接失败 ← 底层 socket 错误」的完整链路。

**面试追问怎么接**：

- 「这叫统一封装？接口都不一样」→ **对，我刻意没做成大而全的统一**。四个引擎的资源模型（graph / workspace / user / bank）本质不同，硬统一只能做成最低公约数。我的统一收敛在**生命周期、错误语义、路由规范**三点，能力各自暴露 —— 这是取舍，不是没做。
- 「上层怎么知道某引擎支持什么？」→ 目前靠**路由和 Swagger 文档**（每个引擎挂自己的路由）。**这是我这段实习的一个欠缺**：更工程化的做法是给 Protocol 加 capability 声明，让上层能在运行时探测。`base.py` 里我留了注释「第二阶段将进一步扩展」，指的就是这个方向。
