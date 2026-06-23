---
title: Hermes Agent 学习笔记 · 第六章 · 技能系统
pageClass: notes-doc
outline: [2, 3]
aside: true
---

## 第六章 技能系统——Agent 怎么"学会干活"的

### 6.1 从"记事实"到"记方法"

上一章结尾说：记忆能存事实，但存不下方法论。技能（Skills）就是来补这个缺口的。

用人类来类比：
- **记忆**（MEMORY.md）= 陈述性记忆 = 知道"是什么" → "用户用 pnpm"
- **技能**（SKILL.md）= 程序性记忆 = 知道"怎么做" → "部署到 Vercel 的 8 个步骤"

### 6.2 技能比记忆多了什么

| 维度 | MEMORY.md（记忆） | Skills（技能） |
|:---|:---|:---|
| **怎么注入** | 每轮自动放进 system prompt | 需要时才加载，不是每次都塞进去 |
| **容量** | 2,200 字符（全部内容） | 10 万字符/个，数量不限 |
| **结构** | 扁平的事实列表 | 结构化步骤 + 前置条件 + 参考资料 |
| **能执行吗** | 只是参考信息 | Agent 按步骤逐条执行 |
| **加载策略** | 全量冻结快照 | 渐进式：先看目录，需要时再加载全文 |

### 6.3 技能长什么样

每个技能就是一个 `SKILL.md` 文件，放在 `skills/` 目录下：

```
skills/
├── software-development/       # 软件开发类
│   ├── SKILL.md                # ← 这就是技能文件（人和机器都能读）
│   └── templates/              # 附带的模板文件
├── research/                   # 研究类
│   ├── SKILL.md
│   └── prompts/
└── creative/                   # 创意类
    └── SKILL.md
```

一个 SKILL.md 大概长这样：

```markdown
---
name: deploy-to-vercel
category: software-development
description: 部署项目到 Vercel 的完整流程
---

# 部署到 Vercel

## 前置条件
- 项目有 package.json
- Vercel CLI 已安装

## 步骤
1. 检查 package.json 的 build 脚本
2. 运行 vercel login
3. 运行 vercel --prod
4. 检查部署 URL 是否可访问

## 常见问题
- 如果 build 失败，检查 Node 版本
- 如果路由 404，检查 vercel.json 配置
```

Agent 看到这个技能后，就按步骤一步一步执行。

**💡 生动例子——Agent 读菜谱炒菜的全过程**

想象你在厨房，Agent 是厨师。墙上贴着"番茄炒蛋"的菜谱。你喊一句"番茄炒蛋"，接下来是这样的：

```
你："番茄炒蛋！"

Agent 打开菜谱（skill_view("deploy-to-vercel")）：
  步骤1: 检查 package.json 的 build 脚本
    → Agent 打开文件一看，有 "build": "next build"
    → ✅ 通过，进入下一步

  步骤2: 运行 vercel login
    → Agent 执行: vercel login --token $VERCEL_TOKEN
    → 输出: "Logged in successfully"
    → ✅ 通过

  步骤3: 运行 vercel --prod
    → Agent 执行: vercel --prod
    → 输出: "Error: unknown command 'vercel'"
    → ❌ 出错了！

  Agent 没有傻等着：
    → 意识到命令可能过时了
    → 尝试 vercel deploy --prod
    → 输出: "Deploying... Done! URL: https://xxx.vercel.app"
    → ✅ 成功了！

  步骤4: 检查部署 URL 是否可访问
    → curl https://xxx.vercel.app
    → 返回 HTTP 200
    → ✅ 全部完成！

Agent 回复你："部署成功！地址是 https://xxx.vercel.app"
```

**关键在于出错那一步**——普通厨师会喊你："喂老板，菜谱上写的那个命令不管用了！"然后等你来改菜谱。Hermes 厨师会自己试另一个命令，发现管用，就用下去。**然后他还会顺手在菜谱上把旧命令划掉，写上新的。** 下次你再说"番茄炒蛋"，就不会再卡在这一步了。

### 6.4 技能从哪来——三个来源

| 来源 | 放哪 | 谁创建 |
|:---|:---|:---|
| **内置技能** | `skills/` 目录 | Hermes 官方预置的（20+ 类别） |
| **用户技能** | `~/.hermes/skills/` | 用户自己写的，或 Agent 自动创建的 |
| **项目技能** | `.hermes/skills/` | 项目级别的，团队共享 |

### 6.5 怎么省 Token——渐进式加载

这是个很关键的设计。你想啊，如果每次对话都把所有技能的完整内容塞进 system prompt，Token 开销会爆炸——装 100 个技能可能就几十万 Token 了。

Hermes 的做法是**三层加载**，我给你画清楚：

```
第一层：system prompt 里只放技能目录（索引）
    │
    │  每个技能只放名字+一句话描述，约 20 个 Token
    │  100 个技能也只增加 ~2000 Token
    │
    ▼
Agent 看到目录，判断"这个任务需要用 deploy-to-vercel 技能"
    │
    ▼
第二层：调用 skill_view("deploy-to-vercel") 加载完整内容
    │
    │  这时候才把上面那个完整的 SKILL.md 读进来
    │
    ▼
第三层：Agent 按 SKILL.md 里的步骤一步一步执行
```

**📝 代码讲解——三层加载在 system prompt 里到底串成什么样的**

你知道了"三层加载"的概念（目录→加载全文→执行），来看看在代码里这三层是怎么串起来的：

```python
# agent/prompt_builder.py 中组装 system prompt 的简化逻辑

def build_system_prompt():
    prompt = ""

    # === 第一层：技能目录（极简，100个技能 ~2000 Token） ===
    prompt += "## 可用技能\n"
    prompt += "以下是你已经学会的技能，需要时调用 skill_view 查看详情：\n"

    # 扫描磁盘上所有 SKILL.md 的 frontmatter
    for skill_path in scan_skill_files(["skills/", "~/.hermes/skills/"]):
        frontmatter = parse_yaml_frontmatter(skill_path)
        prompt += f"- **{frontmatter['name']}**: {frontmatter['description']}\n"

    # Agent 看到的可能是：
    # - **deploy-to-vercel**: 部署项目到 Vercel 的完整流程
    # - **fix-cors-error**: 诊断和修复 CORS 跨域错误
    # - **setup-monorepo**: 用 pnpm workspace 搭建 monorepo
    # - ...（100个技能也才 2000 多 Token）

    # === 第二层：不在这，由 Agent 主动调用 ===
    # Agent 看到目录后，判断需要 deploy-to-vercel 技能
    # → 调用 skill_view("deploy-to-vercel")
    # → skill_view 函数从磁盘读取完整文件，返回全部内容
    # → 作为工具返回值注入下一轮的消息

    # === 第三层：技能完整内容在工具返回值里 ===
    # Agent 收到完整的 SKILL.md 后，把步骤提取出来
    # 然后用 terminal 工具一条一条执行

    return prompt
```

**这个设计省了多少 Token？** 假设有 100 个技能，每个技能平均 2000 字。如果全量注入 → 20 万 Token → 贵死。三层加载 → 目录 2000 Token + 用到哪个加载哪个（2000 Token）→ 总共 4000 Token → 省了 98%。

**💡 生动类比**：就像 Netflix 的首页——你看到的是每部剧的封面和一行简介（目录），你不会一次性把所有剧集的完整视频加载到内存里。只有当你点开一部剧（skill_view），才开始加载正片。Hermes 的渐进式加载就是 AI 版的 Netflix 首页设计。

**对比 GA**：GA 的记忆系统也有类似设计——L1 Insight Index 是极简索引层，用于快速路由。理念一样：先看目录，再翻正文。

### 6.6 开放标准——agentskills.io

Hermes 的技能遵循一个叫 agentskills.io 的开放标准。这意味着什么？**技能是跨框架可移植的**。你在 Hermes 里创建的技能，拿到 Claude Code、Cursor、GitHub Copilot 里也能用。这不是封闭生态，是开放标准。已经有 11+ 工具采纳了这个标准。

### 6.7 技能解决了什么，还缺什么

**解决了**：Agent 能把复杂工作流编码成可复用的操作指令。第二次遇到相同任务，直接加载技能执行，不用从头摸索。

**还没解决**：到这里为止，技能需要**人类手动创建和维护**。如果 Agent 在用技能时发现过时了（API 变了、命令语法改了），它束手无策。更根本的问题——**谁来决定什么时候该创建新技能？谁来发现技能需要修复？**

→ **这就是自进化闭环要解决的问题**

### 6.8 如果你跟别人解释

> "技能就是 SKILL.md 文件，存的是'怎么做'而不是'是什么'。省 Token 的办法是渐进式加载——system prompt 里只放目录（每个技能一句话），Agent 需要哪个就调用 skill_view 加载完整的，然后按步骤执行。技能遵循开放标准 agentskills.io，在 Hermes 里写的技能拿到 Claude Code 也能用。"

### 6.9 社区五大王牌 Skill + 生命周期管理（实战补充）

**五大社区明星 Skill（安装即用）：**

| Skill | 星标 | 解决什么问题 |
|:---|:---|:---|
| **gstack** | 85K ⭐ | Agent 如何高质量做事的高效工作流栈 |
| **gbrain** | 11K ⭐ | Agent 如何长期记住并召回上下文 |
| **hermes-webui** | 4.6K ⭐ | 轻量化 Web 可视化控制台 |
| **self-evolution** | 2.4K ⭐ | 自进化核心模块 |
| **awesome-hermes** | 1.9K ⭐ | Hermes 全生态项目合集导航 |

安装方式：
```bash
hermes skills search <keyword>     # 先搜索
hermes skills inspect <skill-id>   # 查看内容（关键！安装前必须看）
hermes skills install <skill-id>   # 确认安全后再装
hermes skills install gstack gbrain awesome-hermes  # 批量装
```

**安装前五问（每个 Skill 都要过一遍）：**

1. 它是否服务我的长期目标？
2. 它是否能减少重复劳动？
3. 它是否和已有 Skill 重复？
4. 它是否需要危险权限？
5. 它适合常驻，还是只适合临时启用？

**每周清理三问：**

1. 过去 7 天实际用了哪些 Skill？没用的考虑禁用
2. 有没有两个 Skill 做的事重叠？合并
3. 有没有 Skill 输出质量下降？更新或重写

**💡 核心原则：常驻 Skill 不超过 5 个。20 行可用的 Skill 比 200 行没人用的有价值得多。**

### 6.10 给你一个画瓢的葫芦——从零写一个 Skill 的完整步骤

前面讲了"Skill 是什么"，下面给你一个能直接照抄的完整流程：

```bash
# Step 1：创建目录
mkdir -p ~/.hermes/skills

# Step 2：写 Skill 文件
```

```yaml
# ~/.hermes/skills/article-summarizer/SKILL.md
---
name: article-summarizer
description: 把长文章压缩成结构化摘要卡片
---

# Article Summarizer

## 什么时候用
当用户提供一篇长文章，需要生成结构化摘要时使用。

## 输出格式
### 一句话总结（50字以内）
### 核心观点（3-5个要点，每个一句话）
### 和我的关系（结合 USER.md 判断这篇文章对我的价值）
### 下一步（值得深读？沉淀为 Memory？触发某个 Skill？）
```

```bash
# Step 3：安装
hermes skills install ~/.hermes/skills/article-summarizer/SKILL.md

# Step 4：验证
hermes skills list  # 确认装上了
```

**核心原则：先跑起来，再逐步加维度。20 行的可用 Skill 比 200 行但没人用的有价值得多。**

---
