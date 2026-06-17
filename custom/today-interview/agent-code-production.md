---
title: Agent 任意代码执行的生产风险
round: 二面
difficulty: ⭐⭐⭐⭐⭐
tags: [Agent, 安全, 生产]
point: 敢不敢上生产
---

**题目**：Agent 能跑任意代码，安全风险怎么控？生产环境你敢这么用吗？

**结论句（15 秒）**：实验室敢用受限版；生产默认 Docker/gVisor 沙箱 + 无网络/只读根文件系统 + 审批；任意 code_run 不敢裸跑。

**追问方向**：和 Code Interpreter 产品比？ · 最小权限举例？

### 回答

"**怎么控风险**——五句话版：

1. **隔离**：容器/VM/ WASM，一次一沙箱，跑完销毁
2. **权限**：无 root、无 host mount、网络 egress 白名单
3. **资源**： CPU/内存/时间/token 上限
4. **数据**： secrets 不进 prompt；代码环境读不到 prod DB 明文
5. **治理**： 高危操作 human approval；全链路 audit

**敢不敢上生产**——要分场景，诚实答：

- **敢**：内部工具、只读分析、固定 workspace、用户是工程师、有 rollback
- **不敢裸跑**：面向 C 端、可访问内网、可 exfil 数据、无审批的'任意 Python'

生产常见做法是 **'受限代码执行'** 而非 Turing 完备 shell：只允许 pandas/sql 模板、禁止 subprocess/os、或只用官方 Code Interpreter API。

我的立场：**Agent + code 是能力上限，安全是发布下限**；上线的是'带笼子的 code_run'，不是实验室里为了 demo 方便的 full Python。

如果业务必须要强执行能力，我会推 **Dedicated Worker + 临时环境 + 结果只回传 artifact**，而不是 Agent 直接摸生产机。"
