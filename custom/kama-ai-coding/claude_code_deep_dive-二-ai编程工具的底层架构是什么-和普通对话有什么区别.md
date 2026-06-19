---
title: 二、AI编程工具的底层架构是什么？和普通对话有什么区别？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [AI编程, 卡码笔记]
point: 二、AI编程工具的底层架构是什么？和普通对话有什么区别？
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/claude_code_deep_dive.html

> 来源文章：Claude Code大厂面试题汇总：源码泄露、Agent Loop、系统提示词全拆解|深度解析Claude Code工作原理

---

**题目**：二、AI编程工具的底层架构是什么？和普通对话有什么区别？

**结论句（15 秒）**：面试官会问：&quot;AI编程工具的底层架构是什么样的

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官会问：&quot;AI编程工具的底层架构是什么样的？和普通ChatGPT对话有什么本质区别？&quot;

 很多人以为AI编程工具很复杂。其实Claude Code的核心架构，就是一个while循环。

 没错，就这么简单。

 

### 核心循环：用户输入 → 模型思考 → 工具调用 → 结果反馈

 Claude Code的工作流程可以用一句话概括：不断循环&quot;思考-行动-观察&quot;，直到任务完成。

 

 用伪代码表示：

 while (true) {
  // 1. 把对话历史 + 系统提示词发给Claude
  response = claude.chat(messages)
  
  // 2. 如果模型返回纯文本，说明任务完成，退出循环
  if (response.type === 'text') {
    display(response.text)
    break
  }
  
  // 3. 如果模型返回工具调用，执行工具
  if (response.type === 'tool_use') {
    // 权限检查
    if (!checkPermission(response.tool)) {
      result = askUserPermission(response.tool)
    }
    // 执行工具
    result = executeTool(response.tool, response.params)
    // 把结果加入对话历史
    messages.push({ role: 'tool', content: result })
  }
}
 1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
这就是Claude Code的全部核心逻辑。 所有的复杂性——工具选择、上下文管理、安全检查——都是在这个循环的各个环节上做文章。

 

### 为什么是while循环，不是单次调用？

 这是AI编程工具和普通ChatGPT对话的本质区别。

 

 普通对话是一问一答：你问一个问题，AI回答一次，结束。

 AI编程工具是多轮自主决策：你说&quot;帮我修这个bug&quot;，AI可能需要：

 - 先读文件，理解代码结构
 - 再搜索相关文件，找到问题根源
 - 编辑代码，修复bug
 - 运行测试，验证修复
 - 发现测试还有问题，继续修
 - 最终确认修复完成，返回结果
 每一步都是循环里的一次迭代。模型自己决定下一步做什么，直到它认为任务完成。

 

### 停止条件

 循环什么时候停？两种情况：

 - 模型返回纯文本——模型认为任务完成了，不再调用工具，直接输出结果
 - 触发安全限制——比如工具调用次数超限、用户手动中断
 这个设计的精妙之处在于：停止条件是模型自己判断的。不是写死的&quot;调用3次工具就停&quot;，而是模型根据任务完成度自主决定。这就是为什么Claude Code有时候能连续执行几十步操作来完成一个复杂任务。

 

### 和ReAct模式的关系

 如果你了解Agent开发，会发现这就是经典的ReAct（Reasoning + Acting）模式：

 - Reasoning：模型思考下一步该做什么
 - Acting：调用工具执行操作
 - Observation：观察工具返回的结果
 - 循环往复
 Claude Code没有发明新东西，它只是把ReAct模式做到了工程化极致。架构不复杂，工程细节才是壁垒。