---
title: Hermes Agent 学习笔记 · 第二十七章 · 进阶与附录
pageClass: notes-doc
outline: [2, 3]
aside: true
---

## 第二十七章 实战进阶——Profiles、可视化与多 Agent 协同

> 前面的章节覆盖了 L1-L8。这一章快速串讲 L9-L12——这几个模块不会单独写一整章，但面试和实战中很可能会问到。

### 27.1 Profiles——一个 Hermes，多个分身

**Profile = 一套独立的 Agent 运行环境**。每个 Profile 有自己的配置、记忆、技能、会话、定时任务。

```bash
# 创建日常用 Profile（克隆默认配置）
hermes profile create daily --clone

# 创建开发用 Profile
hermes profile create dev --clone

# 切换到日常模式
hermes profile use daily

# 临时用开发模式
hermes -p dev chat
```

**实用性举例**：
- `daily` Profile：只开基础工具，token 消耗少
- `dev` Profile：全开 terminal、git、github、文件系统
- `writing` Profile：专门做写作任务，另配一套 SOUL.md 和 Skill

**⚠️ 注意**：Profile 隔离的是 Hermes 状态（配置、记忆、技能），**不是**操作系统权限。不要把它当成安全沙箱。

**💡 原则**：任务边界越清晰，越适合拆成独立 Profile。但不要为了"看起来很 Agent 团队"而拆太多，3-5 个够用。

### 27.2 可视化和可观测——三个必会命令

```bash
hermes status          # 快速概览：模型、Gateway、Cron 状态
hermes doctor          # 深度诊断：发现问题并建议修复
hermes doctor --fix    # 自动修复已知问题
hermes logs            # 最近 50 行日志
hermes logs --follow   # 实时跟踪
hermes logs errors     # 只看错误
hermes logs gateway    # Gateway 日志（飞书收不到消息先查这个）
```

**每次升级后必须跑 `hermes doctor`**，确保配置兼容。

### 27.3 多 Agent 协同——未来方向

把 Hermes 从"一个助手"升级到"一个团队"的思路：

```
多个独立 Profile + 明确分工 + 共享目录 + 定时任务 + 人工确认
```

例如：`radar-agent` 每天搜集新闻 → 输出到共享目录 → `writing-agent` 每周读这些输出生成周报 → 通过飞书推送给你。关键动作（安装工具、修改配置、发对外消息）仍需人工确认。

---

## 附录：术语速查

| 术语 | 大白话解释 |
|:---|:---|
| **Agent** | 会自己调工具干活的 AI 程序 |
| **ReAct** | "想一步→做一步→看结果→再想"的循环模式 |
| **Skill** | Agent 的"肌肉记忆"，存"怎么做" |
| **MEMORY.md** | Agent 的工作笔记本，存事实 |
| **USER.md** | Agent 对你的人物画像 |
| **FTS5** | SQLite 自带的全文搜索引擎 |
| **Honcho** | Plastic Labs 的外部用户建模引擎，Hermes 可选装 |
| **MCP** | AI 世界的 USB-C 接口 |
| **Atropos** | Nous Research 的 RL 训练环境框架 |
| **agentskills.io** | 技能开放标准，跨框架可移植 |
| **Daytona** | 无服务器平台，空闲休眠 |
| **Modal** | 无服务器 GPU 云，按需付费 |
| **Frozen Snapshot** | 冻结快照，会话期间记忆不变（保护缓存） |
| **OPD** | On-Policy Distillation，前沿 RL 训练技术 |
| **SOUL.md** | Agent 的人格定义文件 |

---

> **最后一句**：学 Agent 框架就像学武功——GA 是内功心法（精简、核心、透彻），Hermes 是外功招式（全面、实用、工业级）。两者都练，方能内外兼修。
>
> 祝你学习愉快！🚀
