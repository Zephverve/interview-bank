---
title: "图版本管理与回滚怎么做？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 进阶]
point: "版本管理"
source: GitHub 100 Questions
---

**题目**：图版本管理与回滚怎么做？

**结论句（15 秒）**：graph_version 绑编译实例；新 thread 用新版；旧 thread 用旧版 finish；shadow mode 对比新旧轨迹。

**追问方向**：schema 版本一起管吗？

### 回答

**优先级**：P2 · 1 篇

#### 🗣️ 先用大白话说

**一句话**：图版本管理 = 多实例共存 + 路由层选版本 + 新 thread 用新版、旧 thread 用旧版 finish。

**打个比方**：像手机系统升级——新买家用新系统（新 thread → v2），老用户可以选择不升级直到当前任务完成（旧 thread → v1 finish）。

#### 📖 面试展开（详细版）

图版本管理是**生产迭代的必答题**，考察零停机升级思维。

**核心原则：进行中的 thread 不能 mid-flight 迁移**

**部署架构**：
```python
graphs = {
    "v1": compile_v1(checkpointer),
    "v2": compile_v2(checkpointer),
}

def get_graph(config):
    version = config["configurable"].get("graph_version", "v2")
    return graphs[version]
```

**路由策略**：
- **新 thread** → 最新版本（v2）
- **已有 thread** → 创建时的版本（v1 finish，不迁移）
- 路由层（API gateway）根据 thread_id 查版本，或 config 显式指定

**Shadow Mode（灰度验证）**：
- 同一份输入同时跑 v1（返回用户）和 v2（不返回，只记录）
- 对比 trace、答案质量、token 消耗、延迟
- v2 指标全面优于 v1 才切流量

**回滚流程**：
1. 流量切回 v1（路由层改默认版本）
2. 停止新开 v2 thread
3. 已有 v2 thread 让其 finish 或强制迁移（需评估风险）

**schema 版本一起管**：
- state schema 变更必须向后兼容（新增字段给默认值）
- graph_version 和 schema_version 绑定发布
- 不兼容变更 → 新 graph_version + 迁移脚本

#### 💡 核心要点
- 多实例共存
- 路由层选版本
- 回滚=切流量+停新 thread

#### 📝 代码/配置示例

```python
# 多版本共存
graphs = {"v1": graph_v1, "v2": graph_v2}

@app.post("/chat")
async def chat(req):
    version = get_thread_version(req.thread_id) or "v2"
    graph = graphs[version]
    return await graph.ainvoke(req.input, config)
```

#### 🔁 追问怎么接

- **「schema 版本一起管吗？」** → 是，graph_version 和 schema_version 绑定发布；新增字段给默认值（向后兼容）；不兼容变更需要新 graph_version + 迁移脚本；旧 thread 的 checkpoint schema 不能 break。
