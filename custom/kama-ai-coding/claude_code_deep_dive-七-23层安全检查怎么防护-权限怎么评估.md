---
title: 七、23层安全检查怎么防护？权限怎么评估？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [AI编程, 卡码笔记]
point: 七、23层安全检查怎么防护？权限怎么评估？
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/claude_code_deep_dive.html

> 来源文章：Claude Code大厂面试题汇总：源码泄露、Agent Loop、系统提示词全拆解|深度解析Claude Code工作原理

---

**题目**：七、23层安全检查怎么防护？权限怎么评估？

**结论句（15 秒）**：面试官会问：&quot;AI编程工具最大的安全风险是什么

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官会问：&quot;AI编程工具最大的安全风险是什么？Claude Code怎么防止AI执行危险操作？&quot;或者&quot;Claude Code的权限模型是怎么设计的？deny、ask、allow的优先级怎么排？&quot;

 AI编程工具最大的风险是什么？它能执行任意shell命令。

 想象一下：你让AI&quot;清理一下临时文件&quot;，它执行了rm -rf /。或者你让它&quot;推送代码&quot;，它git push --force覆盖了同事的提交。

 Claude Code用一套23层的安全检查机制来防止这类事故。

 

### 权限模型：deny > ask > allow

 

 Claude Code的权限评估遵循严格的优先级：

 - deny（拒绝）——最高优先级，匹配到就直接拒绝，不问用户
 - ask（询问）——中间优先级，匹配到就弹窗问用户是否允许
 - allow（允许）——最低优先级，匹配到就直接执行
 这个顺序很重要：deny永远优先于allow。 即使你在配置里allow了某个操作，如果有deny规则匹配，还是会被拒绝。

 

### 四种权限模式

 模式 说明 适用场景 default 大部分操作需要确认 日常使用 acceptEdits 文件编辑自动允许，其他需确认 信任AI的代码修改 plan 只允许只读操作 让AI分析但不修改 bypassPermissions 全部自动允许 完全信任（危险） 

### 安全规则嵌入在哪里

 Claude Code的安全规则不是集中在一个地方，而是分散嵌入在系统的各个层面：

 

 第一层：系统提示词

 &quot;Be careful not to introduce security vulnerabilities such as 
command injection, XSS, SQL injection...&quot;
 1
2
第二层：工具描述

 Bash工具描述里：
&quot;Never skip hooks (--no-verify) or bypass signing&quot;
&quot;Before running destructive operations, consider safer alternatives&quot;
 1
2
3
第三层：Git专用规则

 &quot;NEVER run force push to main/master&quot;
&quot;NEVER update the git config&quot;
&quot;Always create NEW commits rather than amending&quot;
 1
2
3
第四层：Hooks机制

 用户可以配置Hooks——在工具调用前后执行自定义脚本。比如：

 - PreToolUse：在工具执行前检查，可以拦截危险操作
 - PostToolUse：在工具执行后检查，可以回滚错误操作
 - Stop：在AI完成回复后执行，可以做最终检查
 

### "测量两次，切割一次"

 系统提示词里有一句话特别值得注意：

 &quot;measure twice, cut once&quot;（测量两次，切割一次）

 这是Claude Code安全设计的核心哲学：宁可多确认一次，也不要执行一个不可逆的操作。

 具体体现在：

 - 删除文件前要确认
 - force push前要确认
 - 修改CI/CD配置前要确认
 - 发送消息到外部服务前要确认
 所有难以撤销的操作，都需要用户明确同意。

 

### 双模型安全检查

 这里有一个很巧妙的设计：Claude Code用两个模型做安全检查。

 - Haiku（小模型）：做快速的权限判断——这个操作需不需要问用户？
 - Opus/Sonnet（大模型）：做复杂的安全推理——这个操作有没有潜在风险？
 为什么不全用大模型？因为权限检查是高频操作，每次工具调用都要检查。用Haiku做初筛，成本低、速度快；只有需要复杂判断时才用大模型。这就是下一章要讲的双模型策略。