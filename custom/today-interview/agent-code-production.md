---
title: Agent 任意代码执行的生产风险
round: 二面
difficulty: ⭐⭐⭐⭐⭐
tags: [Agent, 安全, 生产]
point: 敢不敢上生产
---

**题目**：Agent 能跑任意代码，安全风险怎么控？生产环境你敢这么用吗？

**结论句（15 秒）**：实验室可用受限 code_run；生产必须容器沙箱加无密钥无内网，任意 Python 不敢裸跑。

**追问方向**：和 Code Interpreter 比？ · 最小权限举例？

### 回答

"我会分**怎么控**和**敢不敢**两部分答，比较诚实。

怎么控？核心是**隔离、限权、可审计**。隔离用 Docker 或 gVisor，一次一环境，跑完销毁；权限上无 root、工作目录只读挂载、网络 egress 白名单；secrets 不进 prompt、代码环境碰不到生产库明文；高危操作 human approval；全程 audit log，CPU、内存、时间、token 都有顶。

敢不敢上生产？**要看场景，不能一刀切**。

敢的情况：内部工具、只读分析、固定 workspace、用户是工程师、有 rollback。比如让 Agent 在临时目录里跑 pandas 洗数据，结果只回传 artifact，不碰线上服务——这种我可以接受，但仍是'带笼子的 code_run'。

不敢的情况：ToC 产品、能访问内网、能读密钥、没有审批的'任意 Python'——这和实验室 demo 为了能力展示开的 code_run 不是一回事。

和 OpenAI Code Interpreter 类产品比，它们也是沙箱+限时+无持久化，不是真给你一台裸 VPS。

所以我的态度是：**Agent 加代码是能力上限，安全是发布下限**。上线的是受限执行面，不是 Turing 完备的 shell。如果业务必须要强执行，我会推 dedicated worker 临时环境，而不是 Agent 直接摸生产机。"
