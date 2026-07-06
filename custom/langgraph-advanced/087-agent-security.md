---
title: "LangGraph Agent 安全怎么保障？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 进阶]
point: "安全"
source: GitHub 100 Questions
---

**题目**：LangGraph Agent 安全怎么保障？

**结论句（15 秒）**：输入 Guardrails 节点、工具权限白名单、HITL 高危操作、输出过滤、secret 不进 state。

**追问方向**：提示注入怎么防？

### 回答

**优先级**：P2 · 1 篇

#### 🗣️ 先用大白话说

**一句话**：Agent 安全分五层——输入过滤、工具白名单、HITL 审批、输出过滤、secret 不进 state。

**打个比方**：像机场安检——入口安检（输入过滤）、登机口验票（工具权限）、危险品需额外审批（HITL）、出口检查（输出过滤）、机密文件不进普通行李（secret 隔离）。

#### 📖 面试展开（详细版）

Agent 安全是**生产上线的硬性要求**，考察多层防御思维。

**五层安全架构**：

**Layer 1：输入 Guardrails 节点**（图入口）
- 检测 prompt 注入（「忽略上面所有指令」）
- 检测 PII（身份证、手机号）→ 脱敏或拒绝
- 检测恶意 payload（超长输入、特殊字符 flood）
- 工具：NeMo Guardrails、自研 regex + LLM classifier

**Layer 2：工具权限白名单**
- 每个 user/role 只能调白名单内的 tool
- validate 节点校验参数范围
- 高危 tool（delete、transfer）额外 policy 检查

**Layer 3：HITL 高危操作**
- 写操作（发邮件、下单、删数据）→ interrupt 等人工审批
- compile 时 `interrupt_before=["publish", "delete"]`
- 审批记录进 audit log

**Layer 4：输出内容过滤**
- 输出节点检查：敏感信息泄露、有害内容、格式合规
- 不通过 → 重写或返回安全默认回复

**Layer 5：Secret 管理**
- API key、DB password 走 config/secrets manager
- **绝不进 state/checkpoint**——否则持久化后泄露

**提示注入防御**：system prompt 边界清晰 + 检索内容用 user 角色注入（不当 system）+ tool 结果不直接拼进 system prompt。

#### 💡 核心要点
- 入口 sanitize 节点
- tool 按角色授权
- interrupt 敏感写操作

#### 📝 代码/配置示例

```python
def sanitize_node(state):
    user_input = state["messages"][-1].content
    if detect_injection(user_input):
        return {"blocked": True, "reason": "prompt_injection"}
    if detect_pii(user_input):
        return {"messages": [redact_pii(state["messages"][-1])]}
    return {}

graph = builder.compile(
    interrupt_before=["delete", "publish"],
    checkpointer=PostgresSaver(...),
)
```

#### 🔁 追问怎么接

- **「提示注入怎么防？」** → system 边界清晰 + 检索内容用 user 角色注入 + tool 结果不当 system + 输入 Guardrails 节点检测注入模式 + 输出过滤敏感信息。
