---
title: 一、AI 增强开发和 Vibe Coding 的区别是什么？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [AI编程, 卡码笔记]
point: 一、AI 增强开发和 Vibe Coding 的区别是什
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/ai_enhanced_development_openspec_superpowers_gstack.html

> 来源文章：AI增强开发三件套：OpenSpec、Superpowers、gstack怎么把 Vibe Coding 拉回工程交付

---

**题目**：一、AI 增强开发和 Vibe Coding 的区别是什么？

**结论句（15 秒）**：# AI增强开发三件套：OpenSpec、Superpowers、gstack怎么把 Vibe Coding 拉回工程交付 前面我们聊过 Vibe Coding，讲的是 AI 编程时代，程序员的优势不是比 AI 写得好，而是让 AI 写得更…

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

# AI增强开发三件套：OpenSpec、Superpowers、gstack怎么把 Vibe Coding 拉回工程交付 前面我们聊过 Vibe Coding，讲的是 AI 编程时代，程序员的优势不是比 AI 写得好，而是让 AI 写得更对、更稳、更可控。

 后面又聊过 Claude Code 深度解析，把 Agent Loop、工具调用、上下文管理、安全机制都拆了一遍。

 再往前走一步，问题就来了：

 工具越来越强，但为什么很多人用 AI 写代码，还是越写越乱？

 不是模型不够强。

 而是你把 AI 当成了一个“更快的打字员”，没有给它工程约束。

 产品说：“加一个会员续费功能。”

 很多录友直接丢给 Claude Code 或 Codex：“帮我实现会员续费。”

 AI 很快就开始写代码。

 接口有了，页面有了，数据库字段也有了。

 但你回头一看：

 - 续费失败怎么处理，没想清楚
 - 优惠券和续费能不能叠加，没写
 - 幂等性没保证
 - 回调失败没有补偿
 - 测试只覆盖了成功路径
 - 最后上线前也没人认真 Review
 这不是 AI 的问题。

 这是你把一个模糊需求，直接丢进了一个能写代码的 Agent。

 AI 增强开发的核心，不是让 AI 更快开写，而是让 AI 在正确的规格、正确的流程、正确的交付闭环里写。

 今天这篇文章，我们讲 AI 增强开发的三件套：

 - OpenSpec：把模糊需求变成可审查规格
 - Superpowers：让 Agent 按工程纪律开发
 - gstack：把 Review、QA、Ship、Retro 补成交付闭环
 这三件套不是让你“装更多插件”。

 它真正解决的是一个问题：

 怎么把 Vibe Coding 拉回工程交付。

面试官可能会这么问：“你怎么看 AI 增强开发？它和 Vibe Coding 有什么区别？”

 这个问题现在很常见。

 很多人回答得太虚：“AI 增强开发就是用 AI 提高效率。”

 这句话没错，但太浅了。

 真正的区别不是“有没有用 AI”，而是你有没有把 AI 纳入工程流程。

 Vibe Coding 的典型模式是：

 需求一句话，AI 直接写。

 写完能跑，直接 Accept。

 报错了，再把报错粘给 AI。

 这个过程看起来很快，但它有一个致命问题：

 需求、设计、验证、交付，全靠聊天过程临时维持。

 一旦上下文变长，或者换一个窗口，或者中间改过几次方向，Agent 很容易忘掉最初的约束。

 AI 增强开发不一样。

 它不是把 AI 放在流程外面随便问，而是把 AI 放进流程里面：

 - 先把需求写成规格
 - 再把规格拆成设计和任务
 - 开发时按测试和计划执行
 - 交付前做 Review 和 QA
 - 失败样本沉淀成下一轮规则
 

 所以面试时可以这样答：

 Vibe Coding 是把 AI 当成一次性代码生成器，AI 增强开发是把 AI 放进工程闭环。前者关注“能不能写出来”，后者关注“需求是否清楚、实现是否符合规格、测试是否覆盖边界、上线是否可控”。

 这句话一定要记住。

 面试官问这个问题，不是在问你会不会用工具。

 他是在问你：你用 AI 写代码，是不是还保留工程判断力。