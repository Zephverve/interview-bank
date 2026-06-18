---
title: Agent 跑代码如何不删文件
round: 一面/二面
difficulty: ⭐⭐⭐⭐
tags: [Agent, 安全, 沙箱]
point: 代码执行隔离
---

**题目**：怎么保证你的 Agent 运行代码不会影响你、把你的东西都删除了？

**结论句（15 秒）**：靠沙箱锁目录、工具白名单、删改要确认、全程可审计；不靠 prompt 赌模型自觉，默认它有可能删错。

**追问方向**：code_run 和 Docker 沙箱区别？ · 误删了怎么恢复？ · 工具白名单怎么设计？

### 回答

"我的前提很简单——**Agent 能跑代码，你就要默认它有可能删错东西。把安全押在 prompt 上等于没做安全。** 我实际设计过四层防线。

**第一层：执行环境关进笼子里。**

代码只在独立子进程里跑。工作目录写死为 `/tmp/agent_workspace_{task_id}`，`$HOME`、`/etc`、系统目录一概不可见。Python 的 `os.chdir` 被 monkey-patch 禁止跳出工作目录。执行完子进程 kill，工作目录保留一段时间供审计然后清理。

**第二层：工具层白名单，不给裸 shell。**

Agent 看到的是 `read(path)`、`write(path, content)`、`patch(file, diff)`、`run_python(code)` 这种结构化 API，而不是一个 `bash` 工具。path 传入后先 `os.path.realpath()` 展开，再检查是否以安全前缀开头——比如只允许 `/tmp/agent_workspace_{task_id}` 和项目目录两个前缀，其他路径直接拒绝。Python 执行层面也会 AST 扫描禁止：`subprocess`、`os.system`、`shutil.rmtree('/')`、读环境变量、读 `/proc` 等。

**第三层：破坏性操作要人点头。**

区分「安全读操作」和「危险写操作」：
- 安全操作：读文件、列目录、搜索内容 → Agent 自由执行。
- 危险操作：`rm`、`rm -rf`、覆盖已有文件、`mv` 跨目录、批量操作 → 挂起等用户确认。

即使是要删文件，也走 **trash 策略而不是真 rm**。macOS 用 `osascript` 走废纸篓，Linux 走 `gio trash` 或软删除（改名 `.deleted_` 前缀），真出问题了还能恢复。

**第四层：可审计、可熔断、可回滚。**

每一步工具调用带时间戳、输入参数、输出摘要，写 audit log。步数、token、时间任一超限即熔断终止。被 Agent 修改的文件在操作前自动做 snapshot（copy-on-write），出问题了 diff 回来。

**code_run 和 Docker 沙箱的区别要讲清楚——**

code_run 是进程级隔离：同一个 OS、同一个文件系统（虽然限制了工作目录）、同一个网络栈。防护靠 Python 层面的限制和路径白名单。优点是轻量、延迟低；缺点是隔离面不够硬，恶意代码可能利用内核漏洞逃逸。

Docker 沙箱是容器级隔离：独立 namespace、cgroup 资源限制、独立网络栈、可以禁掉所有 capabilities。防护靠内核级别的隔离。缺点是启动开销大（秒级 vs 毫秒级）、镜像体积大。

我的策略：**实验室 demo → code_run 够用（轻量快速）；生产环境 → Docker/gVisor 是底线（隔离面够硬）。** 中间有个过渡方案是 Firecracker microVM，启动 < 200ms 但有 VM 级隔离，适合对延迟敏感的生产场景。

**如果已经误删了怎么办？** 三个兜底：被删文件在 trash 里有副本 → 直接恢复；开了快照 → diff 回来；都没有 → audit log 里能知道 Agent 删了什么路径，至少能评估损失、重建数据。所以我们设计的时候，**snapshot 是默认开的，不是可选项。**"
