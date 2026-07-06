---
title: "图定义变更后旧 thread 怎么办？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 工程]
point: "迁移"
source: ModelEngine + GitHub
---

**题目**：图定义变更后旧 thread 怎么办？

**结论句（15 秒）**：state schema 向后兼容；新字段默认值；删字段写迁移；灰度期间按 thread 版本路由到对应图。

**追问方向**：会不会毒化既有 thread？ · 官方迁移指引？

### 回答

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

**一句话**：改图就像改数据库 schema——新字段给默认值，删字段写迁移脚本，大改不兼容就让旧 thread 归档、新 thread 用新图。

**打个比方**：App 升级后旧用户数据还要能读——新增字段默认空、删字段先迁移再删，大版本不兼容就「旧账号只读、新账号新体验」。

#### 📖 面试展开（详细版）

ModelEngine 社区和 GitHub 面经都考过这题：图定义变更后，旧 thread 的 checkpoint 可能与新 schema 失配。这是生产运维的真实问题，不是理论题。

向后兼容变更（安全）：新增 state 字段——给默认值，节点读字段用 state.get("new_field", default)，旧 checkpoint 缺这个字段也能跑。删除 state 字段——先写迁移脚本把旧 checkpoint 里该字段洗掉或归档，再发新版图。修改 reducer 语义——最危险，等价于改合并逻辑，需要充分测试。

不可兼容变更（需策略）：state schema 大改、节点 rename、边拓扑重构——旧 checkpoint 无法在新图里正确恢复。策略：旧 thread 只允许只读查看历史（archive 模式），不允许 resume；新 thread 用新图；或写专门的 migration 函数把旧 checkpoint 转换为新 schema。

灰度方案：graph_version 写入 config 或 thread metadata，路由层按版本选择对应 compile 实例。graph_v1 和 graph_v2 并存，旧 thread 自动路由到 v1 finish，新 thread 路由到 v2。全量切换后下线 v1 实例。

LangGraph 官方文档有 graph migration 指引。面试提到「版本化图定义 + 灰度 + 不可兼容时冻结旧 thread」，说明考虑过运维而非只写 demo。

#### 💡 核心要点
- 新增 channel 可选
- checkpoint 与 schema 版本绑定
- 不可兼容时冻结旧 thread

#### 📝 代码/配置示例

```python
# 向后兼容：新字段用 .get()
def new_node(state: AgentState) -> dict:
    retry_count = state.get("retry_count", 0)  # 旧 checkpoint 无此字段
    return {"retry_count": retry_count + 1}

# 灰度：按版本路由
GRAPHS = {"v1": graph_v1, "v2": graph_v2}
def get_graph(config):
    version = config.get("graph_version", "v2")
    return GRAPHS[version]
```

#### 🔁 追问怎么接

- **会不会毒化既有 thread**：向后兼容变更不会；不可兼容变更需冻结旧 thread 或写 migration
- **官方迁移指引**：LangGraph 文档有 graph migration 章节
- **加分项**：版本化图定义、灰度路由、不可兼容时 archive 旧 thread
