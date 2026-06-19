---
title: 八、什么时候该用，什么时候别用？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [AI编程, 卡码笔记]
point: 八、什么时候该用，什么时候别用？
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/ai_enhanced_development_openspec_superpowers_gstack.html

> 来源文章：AI增强开发三件套：OpenSpec、Superpowers、gstack怎么把 Vibe Coding 拉回工程交付

---

**题目**：八、什么时候该用，什么时候别用？

**结论句（15 秒）**：如果你只是改一个按钮文案，或者修一个明显的 CSS 问题，没必要先写一堆 spec

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

三件套不是银弹。

 所有流程都有成本。

 如果你只是改一个按钮文案，或者修一个明显的 CSS 问题，没必要先写一堆 spec。

 但如果是下面这些场景，就很适合：

 - 支付、订单、会员、权限这类核心业务
 - 一次改动跨前端、后端、数据库、任务队列
 - 需求边界多，失败场景多
 - 新人或 Agent 不熟悉项目上下文
 - 需要团队 Review 需求变化，而不只是 Review 代码
 - 上线后出错代价很高
 

 可以用一个判断标准：

 如果错误只影响局部样式，可以轻流程。

 如果错误会影响钱、权限、数据一致性、用户主流程，就上规格和交付闭环。

 面试最后可以这样收：

 AI 增强开发不是反对 Vibe Coding 的速度，而是给速度加边界。OpenSpec 让需求可审查，Superpowers 让开发有纪律，gstack 让交付有闭环。真正成熟的 AI 编程，不是让 Agent 写得更多，而是让 Agent 在正确约束下写得更可靠。

 这就是 AI 编程时代程序员的新优势。

 不是和 AI 比谁敲代码快。

 是你能不能把 AI 管成一个靠谱的工程队友。