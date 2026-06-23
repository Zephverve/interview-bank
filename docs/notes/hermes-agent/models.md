---
title: Hermes Agent 学习笔记 · 第十章 · 模型无关
pageClass: notes-doc
outline: [2, 3]
aside: true
---

## 第十章 模型无关——怎么做到不绑定任何一个 AI 的

### 10.1 支持 18+ 家，200+ 模型

Hermes 不绑定任何一个模型厂商。通过 `hermes model` 命令一键切换，无代码改动：

| 厂商 | 怎么配 |
|:---|:---|
| Nous Portal（官方推荐） | OAuth 登录 |
| OpenAI Codex | 设备代码认证 |
| Anthropic Claude | API 密钥或 Claude Code 认证 |
| OpenRouter（接 200+ 模型） | API 密钥 |
| DeepSeek | API 密钥 |
| 通义千问 | API 密钥 |
| Kimi/月之暗面 | API 密钥 |
| MiniMax | API 密钥 |
| GitHub Copilot | OAuth |
| 任意 OpenAI 兼容端点 | Base URL + API 密钥 |

### 10.2 不想花钱？本地推理也行

- **Ollama**：最简单的本地模型方案
- **vLLM**：高性能推理引擎
- **llama.cpp**：轻量级 CPU 推理

### 10.3 不同 API 格式怎么统一处理

不同模型厂商的 API 格式不一样，Hermes 用统一层适配：

```
Agent 发出请求
    ↓
根据当前用的模型判断 API 格式：
    ├── OpenAI Responses API → 用 codex_responses 模式处理
    ├── Anthropic Messages API → 用 anthropic_messages 模式处理
    └── 其他 → 用标准 Chat Completions 模式处理
    ↓
_build_assistant_message() 统一转成内部标准格式
    ↓
后续处理全部一样，不管外面是哪种 API
```

### 10.4 智能路由——该省省该花花

不是每次对话都需要用最贵的模型。Hermes 有智能路由：

```
用户发来一条消息
    ↓
检查几个"复杂性"规则：
    - 消息长不长？
    - 有没有代码？
    - 需不需要多步推理？
    - 需不需要调工具？
    ↓
任何一个规则触发 → 用主力模型（贵但强）
全部不触发 → 用廉价模型（便宜够用）
    ↓
保守设计：宁可多用贵模型，不愿低质量回复
    ↓
成本可降低 30-50%
```

**📝 代码讲解——智能路由是怎么判断的**

这套逻辑在每个模型提供商（Provider）里都有实现，简化后长这样：

```python
# providers/base_provider.py 中的智能路由逻辑

def select_model(self, messages, available_tools):
    """根据消息复杂度选择模型"""

    # 规则1：消息长不长？
    total_chars = sum(len(m["content"]) for m in messages)
    is_long = total_chars > 5000

    # 规则2：有没有代码？
    has_code = any("```" in m["content"] for m in messages)

    # 规则3：需不需要多步推理？（检查用户的问句关键词）
    reasoning_keywords = ["为什么", "分析", "对比", "设计", "架构"]
    needs_reasoning = any(
        kw in messages[-1]["content"] for kw in reasoning_keywords
    )

    # 规则4：需不需要调工具？（检查有没有工具可用）
    needs_tools = len(available_tools) > 0 and not self._is_trivial(messages[-1])

    # 决策：任何一个规则触发 → 用贵模型
    if is_long or has_code or needs_reasoning or needs_tools:
        return self.premium_model   # 比如 claude-sonnet
    else:
        return self.cheap_model     # 比如 gemini-flash
```

**💡 生动例子——什么问题时走哪条路：**

```
你："你好"
  → 7个字，无代码，无推理，无工具
  → 4个规则全不触发 → 走便宜模型 → 省 70%

你："帮我分析一下微服务和单体架构的优缺点，给具体数据"
  → 30个字，无代码但关键词"分析""对比""架构"全中
  → 规则3触发 → 走贵模型 → 保证分析质量

你："这段代码 bug 在哪？[附100行代码]"
  → 超5000字，有代码
  → 规则1+规则2触发 → 走贵模型

你："帮我搜索最新 AI 论文"
  → 需要调 web_search 工具
  → 规则4触发 → 走贵模型
```

**核心原则**：保守设计——宁可多用贵模型，不愿低质量回复。毕竟省几毛钱但是回复不能用，反而浪费更多。

### 10.5 提示缓存优化

用 Claude 模型时，Hermes 优化了提示缓存——在三个关键位置设置缓存断点，节约约 75% 的输入 Token 成本。

### 10.6 未知模型怎么办

| 模型状态 | 处理方式 |
|:---|:---|
| 已知模型 | 硬编码了上下文窗口大小、最大输出、支不支持视觉/工具 |
| 未知模型 | **上下文探测**——逐渐增长测试消息，观察什么时候报 `context_length_exceeded` 错误 |

**如果你跟别人解释**：

> "Hermes 支持 18+ 家模型厂商，用 `hermes model` 一键切换。不同厂商 API 格式不同，Hermes 用统一适配层转成内部标准格式。还有智能路由——简单问题用便宜模型，复杂问题用贵模型，省 30-50%。用 Claude 时还优化了提示缓存，省 75% 输入 Token。"

### 10.7 实战——Token 省钱的五大技巧（面试加分项）

Token = 钱 + 速度。长上下文不仅贵，而且模型在长文本中容易"迷失在中间"（Lost in the Middle）。Hermes 提供了一套完整的 Token 精简手段：

**技巧 1：Profile 隔离——不同场景用不同配置**

```bash
# 日常聊天只用基础工具
hermes profile create daily --clone
# 开发时才启用全部工具
hermes profile create dev --clone
hermes profile use daily    # 日常默认省 Token
hermes -p dev chat          # 需要时临时切开发配置
```

**技巧 2：精简工具集——关掉不用的**

```bash
hermes tools list                     # 看看开了哪些工具
hermes tools disable execute_shell     # 关掉高危又耗 Token 的
hermes tools disable kill_process
```

**技巧 3：控制文件读取范围**

```
❌ "帮我看看日志里有什么错误"       # Agent 可能读整个几十 MB 的日志
✅ "查看 app.log 最后 200 行，找出所有 ERROR 并归类"
```

**技巧 4：Prompt 里加输出约束**

```
总字数控制在 1200 字以内
只输出报告正文，不要重复我的指令
每条新闻最多 3 句话摘要
如果信息不足，先列出缺口，不要展开猜测
```

**技巧 5：定期清理旧会话**

```bash
hermes sessions list                  # 看有多少旧会话
hermes sessions prune --older-than 30 # 删掉 30 天前的
hermes sessions export backup.jsonl   # 先备份再删
```

**压缩配置详解：**

```yaml
# ~/.hermes/config.yaml
compression:
  enabled: true              # 开启自动压缩
  threshold: 0.50            # 上下文用到 50% 时触发
  target_ratio: 0.20         # 压缩后保留 20% 给尾部近期内容
  protect_last_n: 20         # 至少保护最近 20 条消息
```

**Token 问题速查表（面试好用）：**

| 问题 | 怎么优化 |
|:---|:---|
| 对话太长 | `/compress` 或自动压缩 |
| 不知道 Token 花在哪 | `hermes insights --days 7` |
| 工具 schema 太多 | 精简工具，Profile 隔离 |
| Agent 跑飞不停 | 调低 `agent.max_turns`（默认 90） |
| 文件太大 | 明确读取范围 + 限制行数 |
| Skill 太多 | 常驻不超过 5 个 |
| Cron 输出太长 | 固定报告模板 + 字数限制 |

**💡 核心思想**：Token 优化的本质不是"抠门"，而是**让 Agent 的注意力聚焦在真正重要的事情上**。上下文越小，模型回答越精准。

---
