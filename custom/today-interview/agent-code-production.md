---
title: Agent 任意代码执行的生产风险
round: 二面
difficulty: ⭐⭐⭐⭐⭐
tags: [Agent, 安全, 生产]
point: 敢不敢上生产
---

**题目**：Agent 能跑任意代码，安全风险怎么控？生产环境你敢这么用吗？

**结论句（15 秒）**：实验室 demo 可以用受限 code_run；生产必须容器沙箱 + 无 root + 无密钥 + 无内网，裸 shell 永远不敢上。

**追问方向**：和 Code Interpreter 比？ · 最小权限举例？ · 什么场景敢什么场景不敢，怎么划这条线？

### 回答

"这个问题大厂面试官必问，因为**代码执行是 Agent 能力的上限，也是安全风险的地板**。我分三层答：怎么控、敢不敢、和成熟产品比差在哪。

**怎么控？不是靠 prompt 写 'don't delete files'。** 我实际会上的四件套：

第一，沙箱隔离。Docker 或 gVisor，一次任务一个临时容器，跑完立刻 destroy。工作目录只读挂载、不允许 mount 宿主机路径。网络 egress 白名单——Agent 可以 pip install 但不能 curl 内网地址。CPU 和内存限额防止 fork bomb。

第二，最小权限。容器内非 root（`USER 1000`），禁止 `chown`、`mount`、`iptables` 等系统调用。Python 执行面限制：ban `os.system`、`subprocess.Popen(shell=True)`、`eval/exec`、直接读 `/proc/self/environ`。工具不暴露裸 shell，而是 `read_file(path)`、`write_file(path, content)`、`run_python(code)` 这种 API，path 传入后先 resolve 再检查是否在允许范围内。

第三，密钥不进环境。secrets 通过工具 API 注入而非环境变量，用完即焚。Agent prompt 里永远看不到明文密钥——它说「调用 send_email 工具」，工具实现里才去读 secret manager。生产数据库连接串同理，Agent 可见的只有沙箱内的临时 schema。

第四，高危操作 human approval。批量删文件、覆盖已有文件、发送邮件、调用收费 API——这些走审批流，Agent 发起请求，人确认后工具才执行。全程 audit log：谁在什么时间让 Agent 做了什么操作，结果是什么。

**敢不敢上生产？不搞一刀切，看三个维度——**

👎 **不敢的情况：** Agent 能摸生产数据库、能访问内网服务、能读宿主机文件系统、用户是不可信的终端用户、没有审批环节的「任意 Python」。这种情况和大模型 demo 里为了炫能力开的 code_run 不是一回事——demo 的 code_run 是在开发者的机器上跑，出事了开发者自己扛；生产是用户的数据、公司的服务器，出事了是安全事故。

👍 **敢的情况：** 内部工具、只读分析、固定 workspace 目录、用户是工程师、操作可回滚。比如让 Agent 在临时容器里跑 pandas 洗数据，结果只回传 artifact 文件，不碰线上服务——我接受，但仍是「带栏杆的 code_run」，不是真给一台裸机。

**和 OpenAI Code Interpreter 类比：** 别被名字误导。Code Interpreter 本质是受限 Python 运行时：无网络访问、无持久化存储、30 秒超时、内存上限、禁止系统调用。他们说这是「code execution」但不是「任意代码执行」。我们的思路类似——给 Agent 的是受限执行面，不是 Turing 完备的 shell。

**如果业务非要强执行能力怎么办？** 不传裸代码给 Agent 去跑，而是推一个 dedicated worker + 临时环境，worker 有严格的 I/O 契约，Agent 只通过 API 驱动它、不能直接进容器。边界划清楚：**Agent 负责决策，worker 负责在笼子里执行，审批负责高危放行。** 三条线上任何一条没到位，我都建议先压住不上。"
