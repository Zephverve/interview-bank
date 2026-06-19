---
title: 12. 大厂真实面试追问汇总
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [Agent, 卡码笔记]
point: 12. 大厂真实面试追问汇总
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/agent_interview.html

> 来源文章：Agent大厂面试题汇总：ReAct、Function Calling、MCP、RAG高频问题

---

**题目**：12. 大厂真实面试追问汇总

**结论句（15 秒）**：以下是各大厂在 Agent 方向的真实追问，整理汇总

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

以下是各大厂在 Agent 方向的真实追问，整理汇总。

 

### 系统设计类

 Q：设计一个企业级 Agent 系统，需要考虑哪些点？

 必答五个要点：

 - 工具管理层——MCP Server 统一管理，工具权限分级（只读/读写/管理员），工具调用审计日志
 - 记忆与状态——短期对话上下文管理（滑动窗口/摘要压缩），长期向量数据库（用户偏好/历史经验），会话 Redis（任务状态/中间结果）
 - 可靠性保障——最大步数限制防死循环，工具调用超时控制，关键操作人工审批，失败重试 + 熔断机制
 - 可观测性——完整的 Trace（思考链 + 工具调用 + 结果），Token 消耗监控控制成本，错误分类统计
 - 安全——Prompt Injection 防御，最小权限原则，数据脱敏
 Q：Agent 的 Token 消耗很大，怎么优化成本？

 优化策略从易到难排：

 - 工具选择优化——只给 Agent 它真正需要的工具（减少工具描述 Token），按任务类型动态加载工具子集
 - 模式选择——简单任务用 Workflow 代替 Agent（节省4倍 Token），Plan-and-Execute 代替 ReAct（节省规划 Token）
 - 上下文压缩——摘要压缩历史对话，中间结果只保留关键信息
 - 模型路由——简单子任务用小模型（如 GPT-4o-mini），复杂推理才用大模型（如 GPT-4o / Claude 3.5）
 - 缓存——工具调用结果缓存（相同参数直接返回），Prompt 缓存（Anthropic 支持 Prompt Cache）
 

### 原理深挖类

 Q：为什么说 Function Call 是 Agent 的基石？

 因为没有 Function Call，Agent 只能生成文字，无法操作外部世界。Function Call 解决了两个核心问题：什么时候调用（LLM 自动判断，无需规则引擎）和传什么参数（从自然语言自动提取结构化参数）。Agent 的循环本质上是&quot;Function Call 的循环编排&quot;。

 Q：MCP 基于什么协议实现的？

 传输层：本地用 stdio（标准输入输出），远程用 HTTP + SSE（支持流式）。消息格式基于 JSON-RPC 2.0 规范。

 Q：Skills 和 Few-shot 有什么区别？

 Few-shot 教格式，Skills 教方法论。Few-shot 给 LLM 几个输入输出示例让它模仿格式，Skills 给 Agent 完整的工作流程、规范和标准。Skills 通常包含：身份定位 + 工作流程 + 注意事项 + 输出规范。

 

### 工程实践类

 Q：你们生产环境的 Agent 踩过什么坑？

 常见的五个坑：

 - 死循环：工具持续失败 Agent 反复重试 → 解法：最大步数 + 相同动作检测
 - 幻觉工具调用：LLM 调用了一个根本不存在的工具 → 解法：严格校验工具名，未知工具直接报错而非猜测
 - 上下文污染：历史对话影响当前判断 → 解法：合理截断上下文 + 任务重置机制
 - Token 爆炸：某个工具返回了超大数据（如整个数据库） → 解法：工具输出截断 + 分页策略
 - Prompt Injection：外部数据包含恶意指令 → 解法：数据/指令分离，外部内容放在明确的数据区域
 这五个坑里，任务漂移和工具调用幻觉是最难缠的，单独展开见 Agent 漂移与幻觉怎么解 和 Agent 系统如何约束大模型幻觉。