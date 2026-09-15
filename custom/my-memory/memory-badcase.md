---
title: 这个项目有没有踩过坑？
round: 二面
difficulty: ⭐⭐⭐⭐
tags: [memory, 面试]
point: 这个项目有没有踩过坑？
---

**题目**：这个项目有没有踩过坑？

### 回答

有，而且这个坑挺典型：**底层 SDK 的异常被"吞"掉了。**

**现象**：接 Qdrant 的时候，接口报错，但前端和日志里只看到一个 `ResponseHandlingException`，没有原因、没有细节 —— 就像车坏了但仪表盘只亮一句"出错了"，完全不知道是轮胎还是发动机。

**定位过程**：一层层往下扒，发现真正的根因藏在异常对象的 `source` 属性里。Qdrant 的 `ResponseHandlingException` 把底层错误**嵌套在属性里**，而不是用 Python 标准的 `raise ... from ...` 链。所以我一开始用 `str(exc)` 拿到的是空字符串 —— 因为异常类名才是唯一可读的信息。

**根因**：**跨 SDK 的异常形态不一致**。有的库用 `__cause__`（标准链），有的库把原异常塞进自定义属性（`source`），有的直接只留一个类名。我原来假设"异常总能被 str() 读出来"是错的。

**修法**：写了一个递归展开函数 `_format_exception_chain`，**同时沿着两条路径找根因** —— 先看 `source` 属性，再看 `__cause__`；递归深度限制 4 层防循环：

```python
def _format_exception_chain(exc, *, depth: int = 0) -> str:
    if depth > 4:
        return type(exc).__name__
    text = str(exc).strip()
    label = f"{type(exc).__name__}: {text}" if text else type(exc).__name__
    nested = getattr(exc, "source", None)          # 非标准路径
    if isinstance(nested, BaseException):
        return f"{label} <- {_format_exception_chain(nested, depth=depth+1)}"
    if exc.__cause__ is not None:                   # 标准路径
        return f"{label} <- {_format_exception_chain(exc.__cause__, depth=depth+1)}"
    return label
```

然后用 `EngineError` 统一包装，把 `[引擎名] 消息: 展开后的异常链` 一起抛出去。现在同样的错误，日志里能直接看到 `[qdrant] search failed: ResponseHandlingException <- ConnectionError: ...`，一眼定位。

**后续影响**：这件事改变了我的一个习惯 —— **接入任何第三方库的第一步，先看它的异常长什么样**。异常可读性和功能完整性一样重要，因为线上排查的成本远高于写这段包装代码的成本。
