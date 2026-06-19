---
title: 三、8700 token的系统提示词里写了什么？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [AI编程, 卡码笔记]
point: 三、8700 token的系统提示词里写了什么？
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/claude_code_deep_dive.html

> 来源文章：Claude Code大厂面试题汇总：源码泄露、Agent Loop、系统提示词全拆解|深度解析Claude Code工作原理

---

**题目**：三、8700 token的系统提示词里写了什么？

**结论句（15 秒）**：面试官会问：&quot;Claude Code的系统提示词有多长

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官会问：&quot;Claude Code的系统提示词有多长？里面写了什么？&quot;

 系统提示词是AI的行为准则。Claude Code的系统提示词约8,700 token，是目前已知最详细的AI编程工具系统提示词。

 

### 8,700 Token的构成

 

 系统提示词不是一整块文本，而是由多个模块拼接而成：

 模块 Token数 作用 系统规则 ~2,900 核心行为准则、安全规则 工具定义 ~3,000 18+工具的参数和使用说明 CLAUDE.md ~1,200 项目级自定义指令 通用规则 ~500 代码风格、输出格式 Git规则 ~300 Git操作的安全规范 技能定义 ~800 可调用的技能列表 

### 关键设计：CLAUDE.md作为用户消息注入

 这里有一个非常有意思的设计决策：CLAUDE.md的内容不是放在系统提示词里，而是作为用户消息注入的。

 为什么？因为系统提示词的优先级最高，如果CLAUDE.md放在系统提示词里，用户的自定义指令就会和Anthropic的安全规则同级，可能被用来绕过安全限制。

 把CLAUDE.md作为用户消息注入，优先级低于系统提示词中的安全规则，但高于普通用户消息。这是一个安全和灵活性的平衡。

 

### 提示词里的"规则嵌套"

 Claude Code的系统提示词有一个特别的设计：安全规则不只写在系统提示词里，还嵌入在每个工具的描述中。

 比如Bash工具的描述里就写了：

 - 不要用cat/head/tail读文件，用Read工具
 - 不要用sed/awk编辑文件，用Edit工具
 - 不要用echo写文件，用Write工具
 这意味着即使模型&quot;忘记&quot;了系统提示词里的规则，在调用工具时还会再看到一遍。双重保险。

 

### 提示词的"语气"设计

 仔细看Claude Code的系统提示词，你会发现它的语气非常具体：

 &quot;Don't add features, refactor, or introduce abstractions beyond what the task requires.&quot;
&quot;Three similar lines is better than a premature abstraction.&quot;
&quot;Default to writing no comments.&quot;

 这不是泛泛的&quot;请写好代码&quot;，而是非常具体的编码哲学。Anthropic把自己的工程文化写进了提示词。 这也是为什么Claude Code写出来的代码风格比较统一——不是模型天生如此，是提示词约束的。