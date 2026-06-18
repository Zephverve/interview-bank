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

我的前提是：Agent 能跑代码，就默认它有可能删错东西，安全不能押在 prompt 上。我设计过四层防线。

**第一层，执行环境隔离。** 代码只在独立子进程跑，工作目录锁在 `/tmp/agent_workspace_{task_id}`，系统目录不可见，禁止 `os.chdir` 跳出。跑完 kill 子进程，目录保留一段时间供审计后清理。

**第二层，工具白名单。** 不给裸 bash，只暴露 `read`、`write`、`patch`、`run_python` 结构化 API。路径先 `realpath` 再校验前缀，AST 扫描禁 `subprocess`、`os.system`、`shutil.rmtree` 等危险调用。

**第三层，破坏性操作要确认。** 读操作自由执行；删改、覆盖、跨目录移动挂起等用户点头。删文件走 trash 策略，不走真 rm，出问题还能恢复。

**第四层，可审计可回滚。** 每步工具调用写 audit log，步数/token/时间超限熔断。修改前自动 snapshot，出问题 diff 回来。
