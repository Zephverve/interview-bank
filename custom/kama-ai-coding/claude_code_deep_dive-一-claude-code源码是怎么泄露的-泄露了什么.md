---
title: 一、Claude Code源码是怎么泄露的？泄露了什么？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [AI编程, 卡码笔记]
point: 一、Claude Code源码是怎么泄露的？泄露了什么？
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/claude_code_deep_dive.html

> 来源文章：Claude Code大厂面试题汇总：源码泄露、Agent Loop、系统提示词全拆解|深度解析Claude Code工作原理

---

**题目**：一、Claude Code源码是怎么泄露的？泄露了什么？

**结论句（15 秒）**：# Claude Code大厂面试题汇总：源码泄露、Agent Loop、系统提示词全拆解|深度解析Claude Code工作原理  不少读者问我，如何充值Claude会员，我在这里篇单独讲一下：国内Claude充值会员的方法

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

# Claude Code大厂面试题汇总：源码泄露、Agent Loop、系统提示词全拆解|深度解析Claude Code工作原理  不少读者问我，如何充值Claude会员，我在这里篇单独讲一下：国内Claude充值会员的方法

 录友们好，今天写一篇硬核长文。

 现在编程agent已经融入到我们的日常编码工作里了，但你有没有想过：这些工具底层到底是怎么工作的？

 大部分人只会用，不知道原理。用得好的时候觉得AI无所不能，用得差的时候觉得AI是智障。根本原因是你不理解它的工作机制。

 今天这篇文章，卡哥带你从底层拆解Claude Code的完整工作原理。为什么选Claude Code？

 因为2026年3月31日发生了一件事——Anthropic不小心把Claude Code的完整源码泄露了。512,000行TypeScript代码，包括系统提示词、工具定义、安全规则，全部公开。

 这是AI编程工具领域第一次有产品级源码完整泄露。卡哥学习了GitHub上 learn-claude-code：https://github.com/shareAI-lab/learn-claude-code 这个仓库的整理分析，结合自己的理解，写成这篇万字解析。

 读完这篇，你会理解所有AI编程工具的底层逻辑——因为它们的架构大同小异。

面试官一般这么问：&quot;你了解过Claude Code的源码泄露事件吗？从中学到了什么？&quot;

 2026年3月31日，有人发现Claude Code的npm包（v2.1.88）体积异常——59.8MB，比正常版本大了10倍。

 原因很简单：Anthropic的工程师在发布时忘记排除source map文件。Source map是什么？就是编译后的代码到源码的映射文件，有了它就能完整还原TypeScript源码。

 泄露的内容包括：

 - 完整的系统提示词——约8,700 token，包含所有行为规则
 - 18+内置工具的完整定义——每个工具的参数、描述、使用规则
 - 安全检查机制——23层顺序检查的完整逻辑
 - 子Agent架构——Explore、Plan、General-purpose三种子Agent的设计
 - 上下文管理策略——200K窗口的三层压缩机制
 - 权限系统——deny &gt; ask &gt; allow的评估顺序
 Anthropic在几小时内修复了这个问题，但源码已经被社区完整保存。

 这次泄露让我们第一次看到了一个产品级AI编程工具的完整内部结构。 接下来，我们一层一层拆。