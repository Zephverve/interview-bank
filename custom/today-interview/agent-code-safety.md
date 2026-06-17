---
title: Agent 跑代码如何不删文件
round: 一面/二面
difficulty: ⭐⭐⭐⭐
tags: [Agent, 安全, 沙箱]
point: 代码执行隔离
---

**题目**：怎么保证你的 Agent 运行代码不会影响你、把你的东西都删除了？

**结论句（15 秒）**：最小权限 + 沙箱隔离 + 路径白名单 + 危险操作人工确认，生产默认 deny。

**追问方向**：code_run 和 Docker 沙箱区别？ · 误删了怎么恢复？

### 回答

"Agent 能跑代码，核心不是'相信模型不会乱来'，而是**假设模型一定会犯错**，用工程手段把破坏半径压到最小。

我会分四层做：

**第一层，进程与文件系统隔离**。代码在子进程里跑，工作目录锁死在指定 workspace，禁止访问 `$HOME`、系统目录。文件写操作只允许在 workspace 内，删除用'软删除'或版本快照，不做物理 rm。

**第二层，权限白名单**。不是给 Agent 任意 shell，而是受限 API：`read_file(path)` 必须 resolve 后在白名单内；`write/patch` 同样；`run_python` 禁 `os.system`、`subprocess` 调系统命令，或走 seccomp/AppArmor。

**第三层，人在回路**。批量删除、覆盖、发网请求、读环境变量/密钥等高危动作，Agent 必须 `ask_user` 或走审批队列，未批准不执行。

**第四层，可观测与止损**。全量 audit log（谁、何时、改了什么）；异常 token/步数熔断；一键 kill runaway 进程；定期备份 workspace。

所以答案是：**不靠 prompt 约束，靠沙箱 + 权限 + 审批 + 审计**。实验室 demo 可以宽松，上线必须默认 deny。"
