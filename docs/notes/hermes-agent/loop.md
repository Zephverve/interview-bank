---
title: Hermes Agent 学习笔记 · 第十三章 · 主循环
pageClass: notes-doc
outline: [2, 3]
aside: true
---

## 第十三章 主循环——Agent 一圈一圈转的具体过程

> 🎙️ **老师开讲**：前面讲了记忆系统、技能系统、自进化闭环——这些东西不是一个一个被"调用"的，它们全部被编织在一个大的循环里面。这个循环就是 Agent 的"心跳"——你给它一个任务，它就一圈一圈地转：想一下 → 调个工具 → 看结果 → 再想 → 再调工具……直到任务完成。你在 GA 里已经见过 ReAct 循环了，但 Hermes 的这个循环有 2300 行代码，比 GA 的 100 行多了几十倍的工程细节。咱们走进去看看，每一圈都发生了什么。

### 13.1 循环长什么样

你在 GA 里已经学过 Agent Loop 的核心——Think → Act → Observe 循环。Hermes 的主循环也是 ReAct 模式，但工程实现复杂得多。

核心方法叫 `run_conversation()`，约 2300 行，实现了一个 `while` 循环：

```
开始循环
    ↓
┌→ 1. 检查有没有中断信号（用户发新消息了？）
│      ↓
│   2. 消耗迭代预算（用了几次了？快到上限了吗？）
│      ↓
│   3. 组装 API 消息（system prompt + 历史消息 + 上下文注入）
│      ↓
│   4. 流式调用大模型 API
│      ↓
│   5. 看模型返回了什么：
│      ├── 返回了工具调用 → 执行工具 → 把结果加入消息 → 回到 ↑
│      └── 返回了直接回复 → 结束循环
│
└── （循环直到模型直接回复或预算耗尽）
```

**对比 GA**：GA 的 `agent_loop.py` 只有约 100 行，非常精简。Hermes 的 `run_conversation()` 有 2300 行——多了中断处理、预算管理、消息精细组装、工具验证自愈、Fallback 逻辑等工业级特性。

**📝 伪代码讲解——2300 行的循环骨架长什么样**

把 2300 行简化成一段伪代码，你就知道主循环在干什么了。注意，这不是真实代码，是把核心逻辑抽出来让你快速理解的：

```python
def run_conversation(user_message):
    """Agent 收到一条用户消息后，开始循环"""

    # === 第0步：初始化 ===
    messages = []                    # 所有要发给模型的消息历史
    budget = 90                      # 最多 90 次循环
    interruption_flag = threading.Event()  # 中断信号

    messages.append(user_message)

    # === 开始循环 ===
    for iteration in range(budget):

        # 第1步：检查中断（用户发了新消息？）
        if interruption_flag.is_set():
            print("[被用户打断了，停下当前任务]")
            break

        # 第2步：检查预算
        if iteration >= 0.9 * budget:
            messages.append("[紧急警告: 只剩最后几次机会，立即收尾]")
        elif iteration >= 0.7 * budget:
            messages.append("[温和提醒: 你用了不少轮了，尽快完成]")

        # 第3步：组装消息（记忆快照 + 技能索引 + 历史对话）
        system_prompt = assemble_system_prompt(
            frozen_memory_snapshot,  # 冻结快照
            skills_index,            # 技能目录
            honcho_context           # 用户画像
        )

        # 第4步：调模型 API
        response = call_llm(system_prompt + messages)

        # 第5步：看返回了什么
        if response.is_text():
            # 模型直接回复了 → 任务完成！
            return response.text

        elif response.is_tool_call():
            # 模型想调一个工具
            tool_call = response.tool_call

            # 5a: 自愈——工具名修正
            tool_call.name = fix_tool_name(tool_call.name)  # web-search → web_search

            # 5b: 执行工具
            result = execute_tool(tool_call)

            # 5c: 把工具结果加回消息历史（下一轮模型能看到）
            messages.append({
                "role": "tool",
                "tool_name": tool_call.name,
                "result": result
            })

            # 5d: 回到循环开头，模型基于新信息继续推理
            continue

    # 预算耗尽，强制输出
    return "任务超时，以下是已完成的部分..."
```

**对比一下你已学的 GA：**

```python
# GA 的 agent_loop.py 核心（简化）
while True:
    response = llm.chat(messages, tools)
    if response.is_final:
        return response
    else:
        result = execute_tool(response)
        messages.append(result)
```

**核心区别**：GA 的循环是"纯循环"，Hermes 的循环是"带管家"——每次循环都要检查中断、算预算、跟压缩器协调、处理工具调用的各种异常情况。多出来的 2200 行代码就是这些"管家工作"。

**💡 生动类比**：GA 的循环像是一个人在跑步机上跑——只要跑就完事了。Hermes 的循环像是在跑步机上跑，但有教练在旁边盯着——"你已经跑了 7 公里了，该降温了""前面有人按了停止键，停下来""你的心率太高了，放慢速度"——多了很多"教练管理"。

### 13.2 怎么防止 Agent 原地转圈

两重保护：

**第一重：迭代次数限制**
- 默认最多 90 次 API 调用
- 到 70% 时温和提醒"你用了很多轮了"
- 到 90% 时紧急警告"快到上限了"
- 到 100% 时强制停止

**第二重：迭代预算管理器**
- 一个线程安全的计数器
- 每次 API 调用消耗 1 次
- 但 `execute_code`（执行代码）类型的调用会**退还**次数——因为代码执行不算"思考"，不应该消耗思考预算

### 13.3 每次调用 API 前消息怎么组装

```
1. 注入 Honcho 用户上下文（首轮嵌系统提示，后续附加到用户消息）
    ↓
2. 推理连续性处理（多轮推理模型的特殊处理）
    ↓
3. 清洗内部字段（去掉不需要发给 API 的字段）
    ↓
4. 组装 system prompt：
   SOUL.md（Agent 身份）+ 工具指导 + 上下文文件 + 插件上下文
    ↓
5. 发给 API
```

### 13.4 模型输出的工具调用不靠谱怎么办

LLM 输出的工具调用不总是对的。Hermes 有多重验证和自愈：

| 问题 | 怎么处理 |
|:---|:---|
| 工具名写错了（比如 `web-search` 写成 `web_search`） | 自动修复 |
| 不存在的工具名 | 注入错误消息让模型自己改，3 次失败后放弃 |
| JSON 参数格式不对 | 空字符串自动转成 `{}`，3 次失败后注入错误结果 |
| 重复调用同一个工具 | 去重 |
| 一次调了多个子 Agent | 只保留一个 |

### 13.5 如果模型最后一轮不输出文字怎么办

有时候模型调完工具后，最后一轮只返回工具调用不返回文字。Hermes 有 Fallback 逻辑：
- 模型同时输出文字和工具调用时，缓存文字
- 后续空回复时，用缓存作为最终回复

### 13.6 如果你跟别人解释

> "Hermes 的主循环就是一个 while 循环：检查中断→消耗预算→组装消息→调 API→看返回的是工具调用还是直接回复。工具调用就执行后继续循环，直接回复就结束。防转圈有两重保护——最多 90 次 API 调用 + 线程安全预算管理器。模型输出的工具调用不靠谱？有自动修复机制——工具名错了自动改、JSON 格式不对自动补。"

---
