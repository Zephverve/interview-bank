---
title: Hermes Agent 学习笔记 · 第十六~十七章 · MCP 与 RL
pageClass: notes-doc
outline: [2, 3]
aside: true
---

## 第十六章 MCP 集成——万能接口怎么接的

### 16.1 MCP 是什么

**MCP**（Model Context Protocol）是 Anthropic 提出的开放标准，用于把 AI 连接到外部数据源和工具。

用大白话说：MCP 是 AI 世界的 **USB-C 接口**。Hermes 通过 MCP 标准接入文件系统、GitHub、数据库、企业内网工具等，**不需要为每个服务写专用对接代码**。

### 16.2 Hermes 怎么当 MCP 客户端

模块 `tools/mcp_tool.py`，近 2000 行。关键设计：

| 特性 | 怎么做的 |
|:---|:---|
| **独立事件循环** | MCP 是长生命周期的异步操作，但工具调用是同步的。Hermes 用独立的后台事件循环解决这个冲突 |
| **双传输支持** | stdio + HTTP/StreamableHTTP（含 OAuth 2.1 PKCE 认证） |
| **安全机制** | 环境变量严格过滤、凭证自动脱敏 |
| **动态工具发现** | MCP 服务器工具列表变了？`tools/list_changed` 通知自动刷新 |

### 16.3 Hermes 还能当 MCP 服务器

Hermes 不只能连别人的 MCP 服务器，还能让自己变成 MCP 服务器被别人连：
- 暴露 10 个工具，核心是 `messages_read` 和 `messages_send`
- 可被 Claude Code、Cursor、Codex 调用

**对比 GA**：GA 通过 `code_run` 动态安装包和调用 API 来扩展能力，没有原生 MCP 支持。Hermes 的 MCP 是原生一等公民。

### 16.4 如果你跟别人解释

> "MCP 是 AI 世界的 USB-C 接口，标准化的外部工具连接方式。Hermes 既能当 MCP 客户端（连别人的 MCP 服务器，接 GitHub、数据库等），也能当 MCP 服务器（让 Claude Code、Cursor 来连自己）。客户端近 2000 行代码，解决了异步 MCP 和同步工具调用的冲突，支持 stdio 和 HTTP 两种传输方式。"

### 16.5 MCP 实战速查——安装前六问 + 高频 Server

**装任何 MCP Server 前先问自己：**

1. 它是否真的补足内置工具做不到的事？
2. 它是否需要高权限（删除、发送、支付）？
3. 它是否会暴露隐私数据？
4. 它是否能限定目录或只读模式？
5. 它是否会显著增加 Token 开销？
6. 它是否只在某个场景需要？（是则只装到对应 Profile）

**高频 MCP Server 速查表：**

| 分类 | Server | 用途 |
|:---|:---|:---|
| 代码协作 | `server-github` | 搜仓库、看 PR、管 Issue |
| 文件系统 | `server-filesystem` | 访问指定目录（零配置） |
| 数据库 | `server-postgres` | 查数据库 |
| 知识管理 | `server-notion` | 读写 Notion |
| 浏览器 | `server-puppeteer` | 网页自动化和截图 |

**安全建议**：用白名单模式 + 读写分离。比如 GitHub 拆成两个 Server——日常用只读版，需要写 PR 时才开读写版。

---

## 第十七章 RL 训练——Agent 怎么"训练自己"的

> 🎙️ **老师敲黑板**：这一章是 Hermes **独有的杀手锏**，其他 Agent 框架一概没有。为什么？因为 Nous Research 本身就是做模型训练出身的，他们不是"做了个 Agent 然后给它接了个模型"，而是"我们在训练模型，顺手做了个 Agent 框架来生成训练数据"。这就产生了一个其他框架无法复制的**数据飞轮**——Agent 执行任务 → 生成执行轨迹 → 用轨迹数据训练模型 → 模型变强 → Agent 更强 → 生成更高质量的轨迹……一句话：**用得好的人和用得差的人，模型能力会越差越远。** 这让 Hermes 的护城河不是代码，而且数据。

> 这一章是 Hermes **独有的**杀手锏——GA 没有对应功能。

### 17.1 数据飞轮——一个正反馈循环

```
Agent 执行任务
    ↓
生成轨迹数据（完整的对话+工具调用记录）
    ↓
压缩清洗（太长的压缩，质量差的过滤掉）
    ↓
RL 训练（用这些数据训练模型）
    ↓
更强的模型
    ↓
回到起点——更强的 Agent 执行更好的任务，生成更好的数据...
```

这是一个**正反馈循环**：用得越多 → 数据越多 → 模型越强 → Agent 更强 → 数据更好...

### 17.2 四个核心组件

| 组件 | 文件 | 干什么的 |
|:---|:---|:---|
| **批量轨迹生成** | `batch_runner.py` | 多进程并行生成训练数据（ShareGPT 格式） |
| **轨迹压缩** | `trajectory_compressor.py` | 保护头尾、摘要中间，目标压缩到 15K Token |
| **RL 训练环境** | `environments/` | Atropos 框架集成 |
| **训练控制** | `rl_cli.py` + `rl_training_tool.py` | Agent-as-Trainer，Agent 自己管理训练流程 |

### 17.3 批量轨迹怎么生成的

```
准备一批 prompt（任务描述）
    ↓
multiprocessing.Pool 真正多进程并行
    ↓
每个 prompt 随机采样不同的工具集
    （保证训练数据多样性——不是每个任务都用一样的工具）
    ↓
Agent 执行任务，记录完整轨迹
    ↓
质量过滤：
    - 没有推理过程的样本直接丢弃
    - 检测过滤模型幻觉产生的无效工具名
    ↓
支持断点续传（扫描已生成的文件比对第一条消息）
    ↓
输出 ShareGPT 格式轨迹文件
```

### 17.4 轨迹怎么压缩的

训练数据太长模型学不动，得压缩：

```python
CompressionConfig:
    target_max_tokens = 15250        # 目标压缩到 15K Token
    summary_target_tokens = 750      # 摘要部分目标 750 Token
    protect_first_system = True      # 第一条 system 消息保护
    protect_first_human = True       # 第一条 human 消息保护
    protect_first_gpt = True         # 第一条 AI 回复保护
    protect_first_tool = True        # 第一条工具消息保护
    protect_last_n_turns = 4         # 最后 4 轮保护
    summarization_model = "gemini-3-flash"  # 用小模型做摘要（省钱）
```

策略就是：**头尾保护，中间摘要**。

**💡 生动例子——数据飞轮怎么转起来的**（完整故事）

假设你让 Hermes 部署了 100 次项目。这些部署过程被记录成 100 份轨迹文件，每份都是完整的"对话+工具调用"记录。

```
第1步：收集数据
  100 份部署轨迹文件，像这样：
  
  trajectory_001.json:
  {"messages": [
    {"role": "user", "content": "帮我部署这个项目"},
    {"role": "assistant", "content": null, "tool_calls": [
      {"name": "terminal", "arguments": {"command": "ls"}}
    ]},
    {"role": "tool", "content": "package.json  src/  README.md"},
    {"role": "assistant", "content": null, "tool_calls": [
      {"name": "terminal", "arguments": {"command": "vercel --prod"}}
    ]},
    {"role": "tool", "content": "Deployed to https://proj.vercel.app"},
    {"role": "assistant", "content": "部署成功！地址是 https://..."}
  ]}

第2步：压缩清洗
  - 丢掉无聊的 ls/cd/pwd 操作（没有推理过程，直接用工具 → 过滤）
  - 丢掉模型幻觉调用的无效工具名
  - 保留合理的部署流程（这100份轨迹有90份步骤一致 → 高质量数据）
  - 压缩到 15K Token（太长模型学不动）

第3步：RL 训练
  用 Atropos 框架把 90 份高质量轨迹喂给模型
  → 模型学会"部署项目"的标准流程
  → 下次执行部署时成功率从 70% 提升到 95%

第4步：正反馈
  Agent 变强了 → 部署成功率更高了 → 产生更高质量的轨迹 → 再训练 → 更强
```

**为什么这能形成"护城河"？** 

普通 Agent 框架：Agent 水平 = 模型的原始水平（固定不变）
Hermes Agent：Agent 水平 = 模型原始水平 + 自身使用数据训练（持续增长）

就像健身——普通人是"买一副哑铃，肌肉固定"，Hermes 是"每天举哑铃，肌肉越来越大"。而且这个增长是**你独有的**——你的 Agent 学的是你的工作习惯、你的项目特点、你的工具偏好。别人的 Hermes 不能直接用你的经验。

### 17.5 Atropos RL 训练环境

| 环境 | 用途 |
|:---|:---|
| `HermesAgentBaseEnv` | 抽象基类，定义接口 |
| `AgenticOPDEnv` | On-Policy Distillation（最前沿的技术） |
| `TerminalTestEnv` | 终端任务验证 |
| `HermesSweEnv` | SWE-bench 风格训练 |
| `WebResearchEnv` | 多步 Web 研究训练 |

### 17.6 AgenticOPDEnv——最前沿的技术

On-Policy Distillation（在线策略蒸馏）：
- Agent 执行工具调用后的事后信息（错误堆栈、测试结果）
- 构建"增强 prompt"，用 VLLM 的 `prompt_logprobs` 评分
- 提供**逐 Token 的密集训练信号**（不是只在轨迹末尾给一个分数，而是每个 Token 都有信号）

### 17.7 为什么竞品很难复制

三个壁垒：
1. **工具系统完整**：产品级工具系统生成真实多样化的工具调用轨迹（不是模拟的）
2. **端到端管道**：从轨迹生成到压缩到训练到环境的完整数据管道
3. **垂直集成**：同时拥有 Atropos（RL 环境）和 Tinker（RL 训练器），首次把 Agent 框架和 RL 训练完全打通

**对比 GA**：GA 完全没有这个维度。GA 的进化发生在运行时（技能积累）。Hermes 的进化不仅发生在运行时，还能通过 RL 训练反馈到模型本身——这是"模型训练者"出身带来的独特优势。

### 17.8 如果你跟别人解释

> "Hermes 独有一个 RL 训练系统：Agent 执行任务时生成轨迹数据 → 压缩清洗 → 用 Atropos 框架做 RL 训练 → 模型变强 → Agent 变强 → 生成更好的数据。这是个正反馈循环——数据飞轮。最前沿的技术叫 On-Policy Distillation，能给每个 Token 都提供密集训练信号。这是其他 Agent 框架都没有的，因为 Nous Research 本身就是做模型训练出身的。"

---
