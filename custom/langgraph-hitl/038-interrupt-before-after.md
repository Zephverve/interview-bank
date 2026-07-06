---
title: "interrupt_before 和 interrupt_after 的区别？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, HITL]
point: "中断点"
source: CSDN 高频题
---

**题目**：interrupt_before 和 interrupt_after 的区别？

**结论句（15 秒）**：before：操作发生前拦截（转账、删库）；after：产出后审阅打回（生成报告、写代码）。

**追问方向**：能否运行时动态设 interrupt？ · 和 breakpoint 废弃 API？

### 回答

**优先级**：P1 · 2 篇

#### 🗣️ 先用大白话说

interrupt_before 在节点执行「之前」暂停，适合高危操作——还没删库、还没转账，人先看 plan 再决定让不让执行。interrupt_after 在节点跑「完之后」暂停，适合生成类——报告写完了人改几句再继续。选哪个取决于风险在时间线的哪一侧。LangGraph 1.0 的 interrupt() 函数更灵活，可以运行时按 state 条件动态决定要不要暂停。

#### 📖 面试展开（详细版）

**interrupt_before**：在指定节点执行前挂起。节点内的逻辑还没跑，state 里是前置节点产出的结果。适合「防患于未然」场景——转账、删库、批量发邮件等不可逆操作，人先看计划再批准执行。

**interrupt_after**：在指定节点执行完后挂起。节点逻辑已跑完，结果已在 state 里。适合「审阅打回」场景——报告生成、代码草稿、营销文案，人修改后再继续下游。

**选择原则**：风险在操作前 → before（Guardrails）；风险在产出质量 → after（Review）。金融审批、权限变更用 before；内容创作、方案生成用 after。

**动态 interrupt**：LangGraph 1.0 推荐在节点内用 interrupt(payload)，按运行时条件决定是否暂停（如金额超阈值才 interrupt），比编译时写死列表更灵活。

**和 breakpoint 废弃 API**：旧 breakpoint 语义模糊，1.0 用 interrupt/Command 统一替代。面试提到说明跟过新版本。

**踩坑**：before 和 after 选错导致该审的没审到；编译时写死列表无法应对动态条件；interrupt 后没设计拒绝路径。

#### 💡 核心要点
- before = Guardrails
- after = Review
- compile 时或动态配置

#### 📝 代码/配置示例

```python
# 编译时静态配置
app = graph.compile(
    checkpointer=saver,
    interrupt_before=["transfer_money", "delete_records"],
    interrupt_after=["generate_report", "draft_email"],
)

# 节点内动态 interrupt（1.0 推荐）
def transfer_node(state):
    if state["amount"] > 5000:
        interrupt({"amount": state["amount"], "to": state["recipient"]})
    return do_transfer(state)
```

#### 🔁 追问怎么接

**「能否运行时动态设？」**——可以，节点内 interrupt() 按 state 条件动态暂停，比编译时列表灵活。举例金额阈值。

**「和 breakpoint 废弃 API？」**——1.0 用 interrupt/Command 替代，语义更清晰。提到说明跟过新版本。
