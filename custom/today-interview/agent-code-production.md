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

代码执行是 Agent 能力的上限，也是安全风险的地板。

**怎么控，四件套。** 沙箱隔离——Docker/gVisor，一任务一容器，跑完销毁，网络 egress 白名单。最小权限——非 root，禁裸 shell，只暴露 `read_file`、`write_file`、`run_python`，路径白名单校验。密钥经 secret manager 注入，prompt 看不到明文。高危操作走审批，全程 audit log。

**敢不敢上生产，看场景。** 不敢：能摸生产库、访问内网、用户不可信、无审批的任意 Python——demo 出事自己扛，生产出事是安全事故。敢：内部工具、只读分析、固定 workspace、可回滚——临时容器跑 pandas 洗数据，只回传 artifact。

**和 Code Interpreter 比，** 它是受限 Python 运行时：无网络、无持久化、超时内存上限。我们给受限执行面，不是 Turing 完备 shell。真要强执行能力，推 dedicated worker，Agent 通过 API 驱动。决策、执行、审批三条线任何一条没到位，我都建议先不上。
