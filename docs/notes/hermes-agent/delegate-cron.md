---
title: Hermes Agent 学习笔记 · 第十四~十五章 · 委派与定时
pageClass: notes-doc
outline: [2, 3]
aside: true
---

## 第十四章 子 Agent 委派——怎么"分身"干活的

### 14.1 核心理念

> 父 Agent 的上下文窗口只看到委派调用和摘要结果，**永远不会看到**子 Agent 的中间工具调用或推理过程。

就像你把一个子任务交给同事——你不需要知道他中间查了多少资料、试了多少次，你只要他的最终结果。

### 14.2 子 Agent 不是随便跑的——严格安全约束

| 约束 | 限制 | 为什么 |
|:---|:---|:---|
| **工具限制** | 禁止 delegate_task（不能递归）、禁止 clarify（不能交互）、禁止 memory（不能写共享记忆）、禁止 send_message（不能跨平台发消息） | 防止子 Agent 失控 |
| **深度限制** | 最多 2 层 | 子 Agent 不能再生子 Agent 的子 Agent |
| **并发限制** | 最多 3 个同时运行 | 资源控制 |
| **迭代限制** | 每个子 Agent 最多 50 轮 | 防止子 Agent 无限转圈 |
| **工具集交集** | 子 Agent 的工具集 = 请求的工具集 ∩ 父 Agent 工具集 | 子 Agent 不能比父 Agent 权限大 |

### 14.3 怎么执行的

```
父 Agent 决定要委派子任务
    ↓
_build_child_agent() 在主线程构建子 Agent
    ↓
单个任务 → 当前线程运行
多个任务 → ThreadPoolExecutor 并行（最多 3 个 worker）
    ↓
子 Agent 独立执行，有自己的上下文窗口
    ↓
执行完毕，返回摘要结果给父 Agent
    ↓
父 Agent 只看到摘要，不看到子 Agent 的中间过程
```

子 Agent 还支持独立的凭证路由——可以给子 Agent 用更便宜/更快的模型。

**💡 生动例子——子 Agent 到底"看不到"什么**

场景：你说"分析一下 React 和 Vue 的生态对比，再顺便帮我看看最近的 AI Agent 框架趋势"。父 Agent 决定开两个子 Agent 并行干：

```
父Agent（你看到的）：
  "好的，我同时查两个方向，稍等"

子Agent-A（React vs Vue）：
  看不见→ 飞到 GitHub 看 star 数
  看不见→ 飞到 npm 看下载量
  看不见→ 飞到 Stack Overflow 看问题数
  看不见→ 用 web_search 搜了 5 篇文章
  看不见→ 汇总成对比表
  → 返回摘要："React 生态更大，star 220K vs 205K，
     npm 下载量约 2 倍差距，但 Vue 在中文社区占比更高"

子Agent-B（AI Agent 趋势）：
  看不见→ 搜了 8 篇最新论文
  看不见→ 抓取了 GitHub 上 5 个框架的 README
  看不见→ 发现 Hermes 最近更新了 RL 训练模块
  看不见→ 发现 LangChain 发了新版本
  → 返回摘要："目前主流 Agent 框架有 Hermes、LangChain、
     AutoGPT 等，Hermes 是唯一有自进化+RL训练的"

父Agent 只收到两段摘要，拼成最终回复给你。
```

**为什么父 Agent 看不到中间过程？** 两个原因：
1. **Token 控制**：如果父 Agent 看到子 Agent 每次搜索的原始结果（可能几万字），上下文直接爆了
2. **安全隔离**：子 Agent 搜到有害内容？只要不写进摘要，父 Agent 永远不知道

**对比 GA**：GA 也有子 Agent 编排——Conductor 子 Agent 编排（派发、监督、自动清理并行子 Agent）。Hermes 的实现更注重隔离和安全约束。

### 14.4 如果你跟别人解释

> "父 Agent 把子任务委派给子 Agent，子 Agent 独立执行，父 Agent 只看到最终结果摘要。子 Agent 有严格限制——不能递归（不能再生子 Agent）、最多 2 层深度、最多 3 个并发、每个最多 50 轮、工具集不能超过父 Agent。这样既实现了并行，又防止失控。"

---

## 第十五章 定时任务——Agent 怎么"自己定时"干活的

### 15.1 怎么存怎么调度

| 项目 | 怎么做的 |
|:---|:---|
| **数据存哪** | `~/.hermes/cron/` 目录，JSON 文件 |
| **支持哪些调度类型** | 周期性间隔、Cron 表达式、一次性定点 |
| **怎么触发** | `tick()` 函数每 60 秒调用一次，检查有没有到时间的任务 |
| **文件锁** | 跨平台（Unix 用 fcntl.flock，Windows 用 msvcrt.locking） |
| **执行语义** | "至多一次"——先推进 next_run_at 时间，再执行任务（防止重复执行） |

### 15.2 [SILENT] 机制——"没事别烦我"

这个设计特别贴心。每个定时任务的提示词里自动注入一段"静默指引"：

```
Agent 执行定时任务
    ↓
检查完情况后判断：
    "有事要报告吗？"
    ├── 有事 → 正常发通知给用户
    └── 没事 → 回复 [SILENT]
                ↓
              系统看到 [SILENT] → 不发通知给用户
              但执行输出仍保存到 ~/.hermes/cron/output/ 供审计
```

比如你设了"每天检查服务器状态"——如果一切正常，Agent 就不烦你；只有出问题了才发通知。

### 15.3 每个定时任务怎么执行的

每个 Cron 任务会创建一个**完全独立的 AIAgent 实例**——不会干扰你正在进行的对话。同时禁用 `cronjob`、`messaging`、`clarify` 等工具，防止定时任务意外发消息或阻塞等待用户输入。

**📝 代码讲解——Cron 调度的核心逻辑**（简化版）

```python
# cron/scheduler.py 中的定时检查逻辑

class CronScheduler:
    def __init__(self):
        self.jobs = []           # 所有任务
        self.check_interval = 60 # 每 60 秒检查一次

    def tick(self):
        """主循环，每 60 秒被调用一次"""
        now = datetime.now()

        for job in self.jobs:
            if job.next_run_at <= now:
                # 时间到了，先推进时间再执行（防止重复执行）
                job.next_run_at = self._calculate_next(job)
                self._save(job)

                # 在新线程中执行，不阻塞主循环
                threading.Thread(target=self._execute, args=(job,)).start()

    def _execute(self, job):
        """执行一个 Cron 任务"""
        # 1. 创建全新的 Agent 实例（不共享任何状态）
        agent = AIAgent()
        # 2. 只加载必需的记忆和技能
        agent.load_memory(frozen=True)
        # 3. 禁用危险工具
        agent.disable_tools(["cronjob", "messaging", "clarify"])
        # 4. 执行
        response = agent.run(job.prompt)
        # 5. [SILENT] 检查
        if "[SILENT]" in response:
            return  # 不发通知
        # 6. 通过消息平台发通知
        gateway.send(job.notify_channel, response)
```

**💡 生动例子——“每天早上检查服务器”**

```
08:00 定时触发
08:00 Cron 创建了一个独立的 Agent 实例（不是正在跟你聊天的那个）
08:00 Agent 用 SSH 连上服务器，执行:
       df -h → 磁盘用了 45%，正常
       free -m → 内存用了 60%，正常
       systemctl status nginx → 运行中
08:01 Agent 判断：一切正常，没什么要报告的
08:01 Agent 回复：[SILENT]
08:01 系统看到 [SILENT]，不给你发通知
      但输出保存到 ~/.hermes/cron/output/2026-06-22-0800.log

---第2天---

08:00 定时触发
08:00 独立 Agent 实例检查
08:00 df -h → 磁盘用了 97%！
08:01 Agent 判断：磁盘快满了，需要通知用户
08:01 Agent 通过飞书给你发消息：
       "⚠️ 服务器磁盘使用率 97%，建议清理。
        最大的目录是 /var/log (45G) 和 /tmp (12G)。
        需要我帮你清理吗？"
```

这就是 [SILENT] 的妙处——**只在你需要关心的时候出现**。不刷存在感。

### 15.4 两个能直接用的 Cron 实战例子

**例子 1：AI 新闻日报**（每天早 9 点搜集 AI 新闻，推送到飞书）

```bash
hermes cron create "0 9 * * *" \
  "搜索最近 24 小时内最重要的 AI 新闻。优先读取官方博客、
  arXiv、OpenAI、Anthropic、Google DeepMind、Meta AI、
  Hugging Face、TechCrunch、The Verge。
  不要打开需要登录、反爬、广告墙或加载很慢的网站；
  如果某个网页超过 20 秒无法读取，跳过它，不要重试。
  每条新闻输出：标题、来源、3句话摘要、对行业的影响。
  最后给出今日最值得关注的 3 个趋势。
  总字数控制在 1200 字以内。
  额外将完整报告保存为 Markdown 到 ~/hermes-lab/reports/
  文件名 ai-daily-report-YYYY-MM-DD.md" \
  --name "ai-daily-report" \
  --deliver "lark" \
  --workdir "~/hermes-lab/reports"
```

**例子 2：每周系统清理审查**（每周一早 10 点检查哪些 Skill/MCP 该清理了）

```bash
hermes cron create "0 10 * * 1" \
  "检查我的 MCP Server 列表和 Skill 列表，分析：
  1. 哪些 MCP Server 过去 30 天没有被调用过
  2. 哪些 Skill 和当前工作流不相关
  3. 哪些 MCP Server 的 allowed_tools 设置过于宽松
  给出清理建议，但不要自动删除任何东西。" \
  --name "weekly-cleanup-review" \
  --deliver "lark"
```

**💡 Cron 安全原则**：Cron 只负责"发现和建议"，不负责"擅自改变系统"。安装工具、修改配置、删除文件、发送对外消息——这些操作**必须人工确认**。

### 15.5 如果你跟别人解释

> "Hermes 的定时任务存在 ~/.hermes/cron/ 目录里，JSON 格式。每 60 秒检查一次有没有到时间的任务。最贴心的设计是 [SILENT] 机制——Agent 判断'没事可报'时回复 [SILENT]，不发通知。只有出问题才烦你。每个定时任务创建独立的 Agent 实例，不干扰正在进行的对话。"

---
