---
custom: true
partTitle: 卡码笔记 · AI 编程
partColor: #06b6d4
---

<div class="part-hero custom-hero chapter-hero" style="--part-color: #06b6d4">

# 💻 AI 编程

<p class="part-desc">卡码笔记 · 第 1/6 章 · 26 题</p>
<span class="part-round custom-tag">我的题库</span>

</div>

<div class="chapter-nav">

<a class="chapter-nav-link" href="/custom/kama/">📑 总览</a>

<a class="chapter-nav-link chapter-nav-next" href="/custom/kama/rag">🔍 RAG →</a>

</div>

<div class="question-card custom-card compact-card" id="ai_enhanced_development_openspec_superpowers_gstack-一-ai-增强开发和-vibe-coding-的区别是什么">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">一、AI 增强开发和 Vibe Coding 的区别是什么？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：AI编程, 卡码笔记 · 考察点：一、AI 增强开发和 Vibe Coding 的区别是什</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：# AI增强开发三件套：OpenSpec、Superpowers、gstack怎么把 Vibe Coding 拉回工程交付 前面我们聊过 Vibe Coding，讲的是 AI 编程时代，程序员的优势不是比 AI 写得好，而是让 AI 写得更…</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

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
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="ai_enhanced_development_openspec_superpowers_gstack-二-为什么光靠-claude-code-或-codex-还不够">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">二、为什么光靠 Claude Code 或 Codex 还不够？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：AI编程, 卡码笔记 · 考察点：二、为什么光靠 Claude Code 或 Codex</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：面试官可能会追问：“Claude Code 和 Codex 已经很强了，为什么还需要 OpenSpec、Superpowers、gstack 这种东西</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

面试官可能会追问：“Claude Code 和 Codex 已经很强了，为什么还需要 OpenSpec、Superpowers、gstack 这种东西？”

 先承认事实：

 Claude Code 和 Codex 确实很强。

 它们能读代码、改文件、跑测试、处理错误、调用工具，复杂任务也能跑很多步。

 但强模型解决的是“能力问题”，不是“流程问题”。

 一个很强的 Agent，也可能犯这些错误：

 - 需求没澄清就开始写
 - 只实现 happy path
 - 测试写得像证明自己没错
 - 代码 Review 只看表面
 - 浏览器里真实流程没走一遍
 - 上线后没有复盘失败原因
 这些问题不是换一个更大的模型就自动消失。

 因为 Agent 的默认倾向是“尽快完成用户请求”。

 用户说“帮我做个功能”，它就会努力做功能。

 但一个成熟工程师不会立刻开写。

 成熟工程师会先问：

 - 这个需求到底解决谁的问题？
 - 哪些场景必须支持？
 - 哪些边界不能碰？
 - 失败后怎么恢复？
 - 代码改动会影响哪些模块？
 - 怎么证明它真的对？
 AI 增强开发三件套，就是把这些工程动作外化出来。

 

 你可以把它们理解成三层：

 OpenSpec 管“做什么”。

 它把需求变成 proposal、design、tasks、spec delta，让需求变化能被审查。

 Superpowers 管“怎么做”。

 它把澄清需求、设计确认、TDD、子 Agent 执行、代码审查变成 Agent 应该遵守的开发纪律。

 gstack 管“怎么交付”。

 它把产品复盘、工程计划评审、代码 Review、浏览器 QA、发布检查、复盘沉淀串成一个交付流程。

 一句话：

 模型负责生成，三件套负责约束生成。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="ai_enhanced_development_openspec_superpowers_gstack-八-什么时候该用-什么时候别用">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">八、什么时候该用，什么时候别用？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：AI编程, 卡码笔记 · 考察点：八、什么时候该用，什么时候别用？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：如果你只是改一个按钮文案，或者修一个明显的 CSS 问题，没必要先写一堆 spec</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

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
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="claude_code_context_window_interview-七-auto-compact-什么时候触发">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">七、Auto-Compact 什么时候触发？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：AI编程, 卡码笔记 · 考察点：七、Auto-Compact 什么时候触发？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Auto-Compact 的触发逻辑，可以用一句话理解：</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

Auto-Compact 的触发逻辑，可以用一句话理解：

 不是等窗口彻底满了才压，而是在接近上限、还留有摘要空间时提前压。

 为什么要提前？

 因为压缩本身也需要 token。

 如果等上下文真的 100% 塞满，再让模型生成摘要，就可能已经没有足够空间完成压缩。

 所以成熟系统都会预留一段空间给压缩流程。

 Claude Code 里你也可以通过 /context 看当前上下文使用情况，通过 /compact 手动压缩，通过 /clear 清空当前对话历史。

 这三个命令的语义不一样：

 命令 作用 适合场景 /context 查看上下文占用 想知道 token 花在哪 /compact 摘要当前会话并继续 当前任务没做完，还要接着干 /clear 清空聊天历史 已切换任务，不需要旧上下文 

 面试时这里可以加一句：

 Auto-Compact 不是异常恢复机制，而是上下文预算管理机制。

 这句话比&quot;满了就总结&quot;高级很多。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="claude_code_context_window_interview-三-为什么-agent-跑起来分分钟爆窗口">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">三、为什么 Agent 跑起来分分钟爆窗口？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：AI编程, 卡码笔记 · 考察点：三、为什么 Agent 跑起来分分钟爆窗口？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：# Claude Code上下文窗口面试详解：Auto-Compact、上下文压缩与Agent记忆管理  不少读者问我，如何充值Claude会员，我在这里篇单独讲一下：国内Claude充值会员的方法</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

# Claude Code上下文窗口面试详解：Auto-Compact、上下文压缩与Agent记忆管理  不少读者问我，如何充值Claude会员，我在这里篇单独讲一下：国内Claude充值会员的方法

 前面我们已经写过两篇 Claude Code 文章：

 - Claude Code大厂面试题汇总：从 Agent Loop、工具链、系统提示词、安全机制整体拆了一遍
 - Claude Code为什么不用RAG检索代码：重点讲 Grep、Glob、Read、子 Agent 和代码检索的关系
 但还有一个问题，面试官特别爱追问：

 Claude Code 上下文窗口快满了怎么办？Auto-Compact 到底在压什么？为什么压完之后还能继续干活？

 很多同学一听上下文窗口，就回答：&quot;就是模型能记住多少内容。&quot;

 上下文窗口不是记忆。上下文压缩也不是简单&quot;总结一下&quot;。

 如果你做过 Agent，就会知道：上下文管理是 Agent 能不能长时间稳定工作的核心能力。

 今天这篇，我们从最基础的上下文窗口讲起，一步一步讲到 Claude Code 的 Auto-Compact，最后给你一套面试可以直接说的回答框架。

普通聊天为什么不容易爆？

 因为普通聊天主要就是用户问题和模型回答。

 你问一句，模型答一句。内容再多，也通常是线性增长。

 但 Agent 不一样。

 Agent 每一轮都可能调用工具，而工具结果也会进入上下文。

 Claude Code 这种编程 Agent，一次任务里可能会做这些事：

 - 读 package.json
 - 搜索路由入口
 - 读取组件文件
 - 执行测试命令
 - 拿到几百行报错日志
 - 修改文件
 - 再跑测试
 - 再读相关依赖
 - 再对比 diff
 - 再生成下一步计划
 这不是聊天，这是带执行轨迹的工作流。

 

 一个最典型的场景是修 bug。

 你只说了一句话：&quot;帮我修一下登录失败的问题。&quot;

 但 Claude Code 可能要跑很多步：

 - 搜 login
 - 读登录页
 - 读 API 封装
 - 读鉴权中间件
 - 跑测试
 - 看到报错
 - 再读环境变量配置
 - 改代码
 - 再跑测试
 - 再看新报错
 每一步都会产生上下文。

 尤其是三类内容，特别吃 token：

 第一类，大文件内容。

 读一个几百行文件，很容易就是几千 token。

 第二类，命令输出。

 测试日志、构建日志、堆栈报错，一长就是几百行。

 第三类，中间推理轨迹。

 模型每一步的解释、计划、工具调用参数、工具返回结果，都会累计。

 所以面试时要说清楚：Agent 爆上下文，不是因为用户说得多，而是因为工具调用轨迹太重。

 这句话很关键。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="claude_code_context_window_interview-五-业界常见上下文方案-为什么单独用都不够看">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">五、业界常见上下文方案，为什么单独用都不够看？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：AI编程, 卡码笔记 · 考察点：五、业界常见上下文方案，为什么单独用都不够看？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：讲 Claude Code 之前，我们先看业界常见方案</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

讲 Claude Code 之前，我们先看业界常见方案。

 因为面试官很可能追问：&quot;为什么不直接用 RAG？为什么不直接摘要？为什么不直接开大窗口？&quot;

 你要能说出每个方案的边界。

 

 

### 1. 滑动窗口：简单，但容易丢任务背景

 滑动窗口就是先进先出。

 上下文满了，就把最早的内容丢掉。

 这个方案最简单，但对 Agent 很危险。

 因为最早的内容里可能有：

 - 用户最初目标
 - 关键限制条件
 - 为什么选择某个方案
 - 哪些文件不能改
 - 哪些路径已经验证过不通
 这些东西一旦丢掉，Agent 就可能开始乱改。

 所以滑动窗口适合普通聊天，不适合复杂任务执行。

 

### 2. 摘要压缩：能省 token，但容易丢细节

 摘要比直接丢好。

 它会把旧对话压成一段短文本。

 但问题是：普通摘要天然偏叙事，不一定保留可执行状态。

 比如它总结：&quot;我们分析了登录模块，并尝试修复 token 失效问题。&quot;

 这句话看起来没错，但对继续干活帮助不大。

 真正有用的信息应该是：

 - 已确认 auth.ts 里 token 续期逻辑有问题
 - 已修改 refreshToken() 的异常处理
 - login.spec.ts 还剩一个超时用例没过
 - 用户要求不要改接口协议
 所以 Agent 需要的不是作文式摘要，而是任务状态快照。

 

### 3. RAG 检索：适合找资料，不适合保存执行轨迹

 RAG 很适合解决&quot;知识在哪里&quot;的问题。

 比如你问一个函数在哪里定义，或者某个概念在哪篇文档里，它很好用。

 但 Agent 的上下文问题不只是知识检索。

 它还要保存：

 - 当前任务目标
 - 已做过哪些尝试
 - 哪些结论已经验证
 - 哪些错误路径不要再走
 - 当前文件改到了什么状态
 这些是执行轨迹，不是静态知识。

 你把它们丢进向量库再检索，未必能稳定召回关键状态。

 所以 RAG 可以帮 Agent 找代码、找文档，但不能替代任务状态管理。

 

### 4. 长期记忆：适合规则，不适合临时状态

 长期记忆适合放稳定信息：

 - 项目技术栈
 - 编码规范
 - 用户偏好
 - 常用命令
 - 目录结构说明
 但它不适合放临时任务状态。

 比如&quot;刚刚第 7 步测试失败，原因是 mock 数据缺字段&quot;，这种信息放长期记忆就很怪。

 长期记忆解决的是跨会话规则，不是当前会话执行轨迹。

 

### 5. 子 Agent 隔离：能分流噪音，但主线还要接得住

 子 Agent 很重要。

 比如让一个子 Agent 去搜索整个代码库，主 Agent 只拿结论。

 这样大量文件读取就不会污染主上下文。

 但子 Agent 也不是万能的。

 因为最终主 Agent 还是要知道：

 - 子 Agent 发现了什么
 - 哪些证据可靠
 - 下一步该怎么做
 所以子 Agent 的价值是隔离探索噪音，不是取消上下文管理。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="claude_code_context_window_interview-八-auto-compact-压什么-留什么-丢什么">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">八、Auto-Compact 压什么、留什么、丢什么？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：AI编程, 卡码笔记 · 考察点：八、Auto-Compact 压什么、留什么、丢什么？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：这是面试最容易被追问的地方</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

这是面试最容易被追问的地方。

 如果你只说&quot;压缩历史对话&quot;，还是太粗。

 要按信息价值分层讲。

 

 

### 1. 优先压工具输出

 工具输出通常体积最大。

 比如：

 - 完整测试日志
 - 大段构建输出
 - 文件读取结果
 - 搜索命中列表
 - 重复报错堆栈
 这些内容不是完全没用，而是原文不一定需要保留。

 更值得保留的是从工具输出里提炼出的状态。

 例如：

 不要保留 300 行测试日志。

 要保留：&quot;auth.spec.ts 中 refresh token 用例失败，原因是 mock 响应缺少 expiresAt 字段。&quot;

 这就是压缩的价值。

 

### 2. 保留用户目标

 用户最初要做什么，一定要保留。

 比如：

 - 修登录失败
 - 不要改接口协议
 - 保持兼容旧版本
 - 只改前端，不动后端
 这些是任务边界。

 丢了，Agent 就容易漂移。

 

### 3. 保留关键决策

 Agent 在执行过程中会做很多判断。

 有些判断是关键决策，必须保留：

 - 为什么选择方案 A，不选方案 B
 - 哪个文件是问题根因
 - 哪条错误路径已经排除
 - 哪个约束不能破坏
 这些信息决定后续方向。

 如果压缩摘要里没有这些，Agent 可能重复走老路。

 

### 4. 保留文件状态

 编程 Agent 必须知道文件改到了哪里。

 至少要保留：

 - 已修改文件列表
 - 每个文件改了什么
 - 尚未验证的改动
 - 还没完成的 TODO
 - 已运行和未运行的测试
 否则压缩后继续对话，Agent 就会像重新接手一个陌生现场。

 

### 5. 丢弃重复和无效过程

 什么可以丢？

 主要是这些：

 - 重复搜索结果
 - 已经被结论覆盖的长日志
 - 无关文件内容
 - 被排除的候选路径细节
 - 中间寒暄和无执行价值的解释
 注意，不是所有失败路径都能丢。

 如果某个失败路径对后续有警示作用，要保留结论：&quot;不要再从 X 模块入手，已验证无关。&quot;

 丢的是原始过程，不是关键结论。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="claude_code_context_window_interview-十-压完之后-claude-code-怎么接续对话">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">十、压完之后，Claude Code 怎么接续对话？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：AI编程, 卡码笔记 · 考察点：十、压完之后，Claude Code 怎么接续对话？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：简单理解，旧的长历史被替换成一段结构化摘要</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

压缩之后发生了什么？

 简单理解，旧的长历史被替换成一段结构化摘要。

 然后新一轮对话继续运行。

 但这里还有几个细节。

 第一，系统提示词不属于普通对话历史，它不会因为 compact 消失。

 第二，项目根的 CLAUDE.md、auto memory 这类启动内容会重新注入。

 第三，路径规则、嵌套目录里的 CLAUDE.md、某些按文件触发的规则，可能要等再次读取对应文件后才重新加载。

 第四，已经调用过的 skill 可能会被重新注入，但会受 token 预算限制。

 这说明什么？

 说明压缩后的接续，不是靠模型&quot;记忆力好&quot;。

 而是靠系统把上下文重新组织成几类内容：

 - 稳定规则：系统提示词、根 CLAUDE.md、memory
 - 当前任务状态：compact 生成的摘要
 - 后续按需加载：文件内容、路径规则、子目录规则、工具结果
 

 所以 Claude Code 压完还能继续，不是因为所有细节都保住了。

 而是因为它保住了继续执行所必需的最小状态。

 这也是上下文压缩的核心取舍：

 不是尽量不丢信息，而是优先不丢会影响下一步行动的信息。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="claude_code_context_window_interview-十一-这道面试题该怎么答">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">十一、这道面试题该怎么答？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：AI编程, 卡码笔记 · 考察点：十一、这道面试题该怎么答？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：现在把前面内容压成面试回答</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

现在把前面内容压成面试回答。

 面试官问：

 &quot;你了解 Claude Code 的上下文窗口和 Auto-Compact 吗？它是怎么做上下文管理的？&quot;

 你可以这样回答：

 &quot;上下文窗口本质上是模型一次推理能看到的 token 空间，不是长期记忆。Claude Code 作为编程 Agent，比普通聊天更容易消耗上下文，因为它不仅有用户消息和模型回复，还会持续累积工具定义、文件读取内容、命令输出、测试日志、diff、错误重试和中间决策。

 真正把窗口撑爆的，往往不是用户说了多少，而是工具调用轨迹太重。

 常见方案比如滑动窗口、摘要、RAG、长期记忆和子 Agent 都有价值，但单独用都不够。滑动窗口容易丢任务背景，普通摘要容易丢约束，RAG 更适合找知识，不适合保存执行轨迹，长期记忆适合稳定规则，不适合当前任务状态，子 Agent 能隔离探索噪音，但主 Agent 仍然需要拿到可执行结论。

 所以 Claude Code 更像是分层做上下文治理。前面先通过 Glob、Grep、Read 精准取上下文，减少无关文件；

 再对工具结果做裁剪，避免日志淹没任务；

 复杂探索交给子 Agent，用独立窗口跑，主 Agent 只接收摘要；

 稳定规则放到 CLAUDE.md 和 memory；最后当上下文接近上限时，由 Auto-Compact 把旧对话和工具轨迹压成结构化任务状态。

 Auto-Compact 不是简单总结聊天记录，而是保留用户目标、约束、关键决策、已修改文件、当前进度、未完成事项和风险，把重复日志、无关搜索、已被结论覆盖的中间过程丢掉。

 压缩后，系统提示词、根 CLAUDE.md、memory 等稳定规则会重新进入上下文，compact 摘要作为当前任务状态，后续文件和规则再按需加载，所以 Agent 能继续执行。核心思想是：保留状态，丢弃噪音。&quot;

 这个回答已经够用了。

 如果想再加分，可以补一句：

 Claude Code 的上下文管理不是为了让模型看见更多，而是为了让模型在每一步都看见更有价值的信息。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="claude_code_context_window_interview-十三-普通开发者怎么用得更稳">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">十三、普通开发者怎么用得更稳？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：AI编程, 卡码笔记 · 考察点：十三、普通开发者怎么用得更稳？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：理解原理之后，使用建议也就很清楚了</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

理解原理之后，使用建议也就很清楚了。

 第一，一次会话只做一个主任务。

 不要在同一个会话里又修 bug、又重构、又加功能、又讨论方案。

 任务越杂，compact 摘要越难保留正确状态。

 第二，稳定规则写进 CLAUDE.md。

 比如技术栈、测试命令、禁止改动范围、代码风格，不要只在聊天里说。

 第三，长日志不要无脑贴。

 能让工具跑就让工具跑，能截关键报错就截关键报错。

 第四，压缩前主动说清楚保留重点。

 如果当前任务复杂，可以手动 /compact focus on ...，明确让它保留某个模块、某个 bug、某个改动方向。

 第五，换任务就 /clear。

 不要让旧任务的上下文污染新任务。

 很多 Agent 漂移，不是模型能力不行，而是上下文太脏。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="claude_code_context_window_interview-十二-面试官可能继续追问什么">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">十二、面试官可能继续追问什么？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：AI编程, 卡码笔记 · 考察点：十二、面试官可能继续追问什么？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：### 追问 1：为什么不直接把上下文窗口做大</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

### 追问 1：为什么不直接把上下文窗口做大？

 窗口变大能缓解问题，但不能解决问题。

 因为上下文越大，成本越高，延迟越高，注意力稀释也更明显。

 Agent 真正需要的是高质量上下文，不是无限长上下文。

 大窗口适合兜底，不能替代上下文治理。

 

### 追问 2：RAG 能不能替代 Auto-Compact？

 不能。

 RAG 解决的是外部知识召回，Auto-Compact 解决的是会话执行状态压缩。

 RAG 适合问&quot;相关代码在哪里&quot;，Auto-Compact 适合保留&quot;当前任务做到哪一步&quot;。

 一个偏检索，一个偏状态延续。

 

### 追问 3：压缩会不会导致幻觉？

 会有风险。

 如果摘要把不确定信息写成确定结论，后续 Agent 就会沿着错误状态继续执行。

 所以压缩摘要里要区分：

 - 已确认事实
 - 推测判断
 - 未验证事项
 - 已排除路径
 好的 compact 摘要必须保留不确定性，不能把所有中间过程都写成结论。

 

### 追问 4：项目规则应该放对话里，还是 CLAUDE.md 里？

 稳定规则放 CLAUDE.md。

 临时任务要求放当前对话。

 如果某条规则跨任务都重要，比如&quot;不要改数据库 schema&quot;，就不应该只靠一次聊天告诉模型，应该写进项目级记忆。

 因为早期对话可能被压缩，但项目根 CLAUDE.md 这类稳定规则会在压缩后重新注入。

 

### 追问 5：如果你自己设计 Agent 的上下文压缩，会怎么做？

 我会分三步。

 第一步，先做上下文预算统计，知道 token 花在哪：系统提示词、工具定义、文件内容、命令输出、历史对话分别占多少。

 第二步，按信息价值压缩：工具原文优先裁剪，任务目标和约束必须保留，文件状态和未完成事项必须保留。

 第三步，用结构化摘要接续任务，而不是自然语言闲聊摘要。摘要里明确写目标、进度、已改文件、关键决策、未完成事项和风险。

 最后再配合子 Agent 隔离大范围探索，避免主上下文被噪音污染。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="claude_code_deep_dive-一-claude-code源码是怎么泄露的-泄露了什么">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">一、Claude Code源码是怎么泄露的？泄露了什么？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：AI编程, 卡码笔记 · 考察点：一、Claude Code源码是怎么泄露的？泄露了什么？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：# Claude Code大厂面试题汇总：源码泄露、Agent Loop、系统提示词全拆解|深度解析Claude Code工作原理  不少读者问我，如何充值Claude会员，我在这里篇单独讲一下：国内Claude充值会员的方法</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

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
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="claude_code_deep_dive-七-23层安全检查怎么防护-权限怎么评估">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">七、23层安全检查怎么防护？权限怎么评估？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：AI编程, 卡码笔记 · 考察点：七、23层安全检查怎么防护？权限怎么评估？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：面试官会问：&quot;AI编程工具最大的安全风险是什么</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

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
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="claude_code_deep_dive-三-8700-token的系统提示词里写了什么">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">三、8700 token的系统提示词里写了什么？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：AI编程, 卡码笔记 · 考察点：三、8700 token的系统提示词里写了什么？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：面试官会问：&quot;Claude Code的系统提示词有多长</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

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
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="claude_code_deep_dive-九-双模型策略怎么分工-成本怎么控制">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">九、双模型策略怎么分工？成本怎么控制？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：AI编程, 卡码笔记 · 考察点：九、双模型策略怎么分工？成本怎么控制？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：面试官会问：&quot;Claude Code为什么用两个模型</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

面试官会问：&quot;Claude Code为什么用两个模型？全用大模型不行吗？&quot;或者&quot;双模型策略的成本优化效果怎么样？什么操作用小模型，什么操作用大模型？&quot;

 Claude Code不是只用一个模型，而是用两个模型配合工作。这是一个非常聪明的成本优化策略。

 

### 两个模型，两种角色

 

 模型 角色 负责什么 成本 Haiku &quot;直觉&quot; 权限判断、元数据提取、快速分类 ~$0.25/百万输入token Opus/Sonnet &quot;大脑&quot; 代码理解、方案设计、复杂推理 ~$15/百万输入token 价格差60倍。如果所有操作都用Opus，成本会高到不可接受。

 

### Haiku负责的"快决策"

 每次工具调用前，Claude Code需要判断：这个操作需不需要问用户？这是一个高频但简单的决策——不需要理解代码逻辑，只需要匹配规则。

 比如：

 - Read(&quot;config.js&quot;) → 读文件，安全，直接允许
 - Bash(&quot;rm -rf node_modules&quot;) → 删除操作，需要确认
 - Edit(&quot;app.js&quot;, ...) → 编辑文件，看权限模式决定
 这类判断用Haiku就够了，快且便宜。

 

### Opus/Sonnet负责的"慢思考"

 真正需要大模型的场景是：

 - 理解用户的意图——&quot;帮我优化这个函数&quot;到底要优化什么？
 - 分析代码逻辑——这个bug的根因是什么？
 - 设计解决方案——应该怎么重构这段代码？
 - 生成代码——写出正确的、符合项目风格的代码
 这些任务需要深度推理能力，只有大模型能胜任。

 

### 成本控制的实际效果

 通过双模型策略，Claude Code把大量低价值的判断交给Haiku，只在真正需要推理时才用Opus/Sonnet。

 粗略估算：

 - 一次典型的编程任务，可能有20-30次权限检查（Haiku）
 - 但只有5-10次真正的代码推理（Opus/Sonnet）
 - 如果全用Opus，权限检查的成本会占总成本的30-40%
 - 用Haiku做权限检查，这部分成本降到不到1%
 这就是为什么Claude Code能把平均成本控制在$6/天——双模型策略是关键。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="claude_code_deep_dive-二-ai编程工具的底层架构是什么-和普通对话有什么区别">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">二、AI编程工具的底层架构是什么？和普通对话有什么区别？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：AI编程, 卡码笔记 · 考察点：二、AI编程工具的底层架构是什么？和普通对话有什么区别？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：面试官会问：&quot;AI编程工具的底层架构是什么样的</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

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
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="claude_code_deep_dive-五-子agent机制怎么工作-什么场景会启动子agent">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">五、子Agent机制怎么工作？什么场景会启动子Agent？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：AI编程, 卡码笔记 · 考察点：五、子Agent机制怎么工作？什么场景会启动子Agent</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：面试官会问：&quot;Claude Code的子Agent是怎么工作的</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

面试官会问：&quot;Claude Code的子Agent是怎么工作的？什么场景下会启动子Agent？&quot;

 当任务太复杂，一个Agent处理不过来时，Claude Code会启动子Agent——相当于&quot;分身&quot;去处理子任务。

 

### 三种子Agent

 

 类型 模型 能力 适用场景 Explore Haiku（最便宜） 只读（搜索、读文件） 快速探索代码库 Plan 继承父Agent模型 只读 设计实现方案 General-purpose 继承父Agent模型 全部工具 复杂多步骤任务 

### Explore Agent：用最便宜的模型做最多的脏活

 Explore Agent是最常用的子Agent。它的设计非常精妙：

 - 用Haiku模型——成本极低，速度极快
 - 只有只读权限——不能修改任何文件，只能搜索和阅读
 - 内部可以消耗100K+ token——在自己的上下文里大量读文件
 - 返回给父Agent只有1,500-2,000 token的摘要
 这意味着什么？Explore Agent可以读几十个文件、搜索整个代码库，但最终只返回一个精炼的摘要给主Agent。主Agent的上下文窗口不会被大量代码撑爆。

 这是一个非常重要的架构决策：用廉价的子Agent做信息收集，用昂贵的主Agent做决策。

 

### 子Agent的限制

 - 最多1层嵌套——子Agent不能再启动子Agent，防止无限递归
 - 独立上下文——子Agent看不到父Agent的对话历史，必须在prompt里给足信息
 - 结果不可见给用户——子Agent的输出只返回给父Agent，用户看不到中间过程
 

### 并行子Agent

 Claude Code支持同时启动多个子Agent并行工作。比如：

 - 同时让一个Explore Agent搜索前端代码，另一个搜索后端代码
 - 同时让一个Agent跑测试，另一个Agent检查类型
 并行子Agent是Claude Code处理大型任务的关键能力。 一个人干不完的活，分给几个&quot;分身&quot;同时干。

 

### 子Agent的成本考量

 这里有一个很现实的问题：子Agent也要花钱。

 - Explore Agent用Haiku，成本很低（约$0.25/百万输入token）
 - General-purpose Agent用Opus/Sonnet，成本和主Agent一样
 所以Claude Code的策略是：能用Explore解决的问题，绝不用General-purpose。 只有真正需要修改文件或执行复杂操作时，才启动全能力子Agent。

 据统计，Claude Code的平均使用成本约**$6/开发者/天**，月均$100-200。子Agent的合理使用是控制成本的关键。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="claude_code_deep_dive-八-claude-md和记忆系统怎么让ai-认识-项目">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">八、CLAUDE.md和记忆系统怎么让AI「认识」项目？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：AI编程, 卡码笔记 · 考察点：八、CLAUDE.md和记忆系统怎么让AI「认识」项目？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：面试官会问：&quot;CLAUDE.md是干什么的</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

面试官会问：&quot;CLAUDE.md是干什么的？为什么不能放在系统提示词里？&quot;或者&quot;AI的记忆系统怎么设计？记忆和实际代码状态不一致怎么办？&quot;

 每次开启新对话，Claude Code都是一张白纸——它不知道你的项目结构、编码规范、技术栈偏好。CLAUDE.md就是解决这个问题的。

 

### CLAUDE.md：项目级的"说明书"

 CLAUDE.md是一个放在项目根目录的文件，每次对话开始时会自动加载到上下文中。你可以在里面写：

 - 项目架构说明
 - 常用命令（构建、测试、部署）
 - 编码规范和风格要求
 - 技术栈和依赖说明
 - 已知问题和注意事项
 # CLAUDE.md

## 项目概述
这是一个基于Next.js 14的电商平台，使用App Router。

## 常用命令
- npm run dev：启动开发服务器
- npm run test：运行测试
- npm run build：构建生产版本

## 编码规范
- 使用TypeScript strict模式
- 组件使用函数式写法
- 状态管理使用Zustand
- API请求使用React Query
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

### 三层CLAUDE.md

 Claude Code支持三个层级的CLAUDE.md，优先级从高到低：

 层级 位置 作用域 项目级 项目根目录/CLAUDE.md 整个项目 目录级 子目录/CLAUDE.md 该目录下的文件 用户级 ~/.claude/CLAUDE.md 所有项目 目录级CLAUDE.md特别有用。 比如你的前端目录和后端目录有不同的编码规范，可以分别写CLAUDE.md。

 

### 记忆系统：跨对话的持久化

 CLAUDE.md解决了项目级的上下文问题，但还有一类信息是跨项目、跨对话的——比如你的编码偏好、你的角色背景、你之前给过的反馈。

 Claude Code的记忆系统用文件存储这些信息：

 ~/.claude/projects/&lt;project&gt;/memory/
├── MEMORY.md          # 记忆索引
├── user_role.md       # 用户角色信息
├── feedback_style.md  # 用户反馈的工作风格偏好
└── project_context.md # 项目背景信息
 1
2
3
4
5
记忆分四种类型：

 - user：用户的角色、偏好、知识背景
 - feedback：用户对AI行为的纠正和确认
 - project：项目的目标、进度、决策背景
 - reference：外部资源的指针（如&quot;bug追踪在Linear的INGEST项目里&quot;）
 

### 记忆的核心原则："可疑索引，不是可信真相"

 

 这是记忆系统设计中最重要的一点：记忆是索引，不是真相。

 系统提示词里明确写了：

 &quot;Memory records can become stale over time... Before answering the user or building assumptions based solely on information in memory records, verify that the memory is still correct and up-to-date by reading the current state of the files.&quot;

 翻译成人话：AI不能因为记忆里写了&quot;config.js在第50行有路由配置&quot;就直接去改第50行——它必须先读文件确认。 因为上次记忆的时候是第50行，现在可能已经变了。

 这个设计非常务实。记忆帮AI快速定位信息，但最终决策必须基于当前代码的实际状态。

 

### CLAUDE.md的安全边界

 前面提到，CLAUDE.md是作为用户消息注入的，不是系统提示词。这意味着：

 - CLAUDE.md不能覆盖Anthropic的安全规则
 - CLAUDE.md不能让AI执行被deny的操作
 - CLAUDE.md可以自定义编码风格、项目规范、工作流程
 这是一个精心设计的信任边界：项目维护者可以定制AI的行为，但不能突破安全底线。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="claude_code_deep_dive-六-200k上下文窗口怎么管理-压缩机制是什么">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">六、200K上下文窗口怎么管理？压缩机制是什么？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：AI编程, 卡码笔记 · 考察点：六、200K上下文窗口怎么管理？压缩机制是什么？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：面试官会问：&quot;200K的上下文窗口为什么还是不够用</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

面试官会问：&quot;200K的上下文窗口为什么还是不够用？Claude Code怎么处理上下文溢出？&quot;

 Claude Code的上下文窗口是200K token。听起来很大，但在实际编程任务中，消耗速度远超你的想象。

 

### 上下文是怎么被吃掉的

 一个典型的编程任务，上下文消耗大概是这样的：

 内容 Token消耗 系统提示词 ~8,700 用户的问题 ~100-500 读一个文件（500行） ~3,000-5,000 Bash命令输出 ~500-2,000 模型的思考和回复 ~1,000-3,000 每轮工具调用结果 ~1,000-5,000 一个&quot;帮我修这个bug&quot;的任务，可能需要读5-10个文件、执行几次搜索、多次编辑——轻松消耗50K-100K token。复杂任务甚至能把200K吃满。

 

### 三层压缩机制

 

 当上下文接近容量上限（92-95%）时，Claude Code会触发压缩机制。这个机制分三层：

 第一层：工具结果截断

 最先被压缩的是工具调用的结果。比如你读了一个1000行的文件，压缩后可能只保留前100行和后100行，中间用摘要替代。

 第二层：对话历史压缩

 早期的对话轮次会被压缩成摘要。比如你30分钟前让AI读的文件内容，会被压缩成&quot;之前读取了config.js文件，其中包含路由配置&quot;这样的摘要。

 第三层：强制截断

 如果前两层压缩还不够，会强制截断最早的对话内容。这时候模型可能会&quot;忘记&quot;早期的上下文。

 

### 压缩带来的问题

 压缩不是免费的，它会导致信息丢失。最常见的问题：

 - 忘记早期的修改——你让AI改了文件A，后来又改了很多文件，回头发现AI忘了文件A的修改内容
 - 重复读取文件——AI忘了之前读过某个文件，又读一遍，浪费token
 - 丢失用户指令——你在对话开头说的&quot;不要改这个文件&quot;，可能在压缩后被丢掉
 

### 实际使用建议

 理解了上下文管理机制，你就知道怎么更高效地使用Claude Code：

 - 一次对话只做一件事——不要在一个对话里又修bug又加功能又重构，上下文会爆
 - 关键指令放在最近的消息里——不要指望AI记住你30分钟前说的话
 - 复杂任务用CLAUDE.md——把项目规则写在CLAUDE.md里，每次对话都会加载，不会被压缩掉
 - 善用子Agent——让Explore Agent去读文件，主Agent的上下文就不会被大量代码占满
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="claude_code_deep_dive-十-从claude-code能学到什么对开发者有用的">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">十、从Claude Code能学到什么对开发者有用的？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：AI编程, 卡码笔记 · 考察点：十、从Claude Code能学到什么对开发者有用的？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：面试官会问：&quot;从Claude Code的架构设计中，你觉得对开发AI应用有什么启示</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

面试官会问：&quot;从Claude Code的架构设计中，你觉得对开发AI应用有什么启示？&quot;或者&quot;如果让你从零设计一个AI编程工具，你会怎么设计？&quot;

 拆解完Claude Code的架构，最后聊聊对我们开发者的启示。不管你是用AI编程工具，还是自己开发AI应用，这些设计思路都值得借鉴。

 

### 启示一：Agent架构没有魔法，就是while循环

 很多人觉得Agent很神秘。看完Claude Code的源码你会发现，核心就是一个while循环+工具调用。没有复杂的状态机，没有花哨的架构模式。

 如果你在做Agent开发，不要过度设计。先把最简单的循环跑起来，再逐步加规则、加工具、加安全检查。简单的架构+丰富的规则，比复杂的架构+稀疏的规则更可靠。

 

### 启示二：提示词工程是真正的产品壁垒

 Claude Code的512,000行代码里，真正决定产品体验的不是代码逻辑，而是那8,700 token的系统提示词。

 - 什么时候该问用户，什么时候自己决定
 - 什么样的代码风格是好的
 - 什么操作是危险的
 - 怎么平衡自主性和安全性
 这些&quot;软规则&quot;才是AI产品的核心竞争力。 代码可以抄，提示词的调优经验抄不走。

 

### 启示三：安全不是功能，是架构

 Claude Code的安全机制不是一个独立的模块，而是渗透在系统的每一层：系统提示词、工具描述、权限模型、Hooks、双模型检查。

 如果你在开发AI应用，安全必须从架构层面考虑，不能事后补。 一个没有权限控制的AI Agent，就像一个有root权限的实习生——能力很强，但随时可能闯祸。

 

### 启示四：上下文管理决定了AI的"智商上限"

 很多人抱怨AI&quot;变笨了&quot;&quot;忘记了之前说的话&quot;。现在你知道原因了——上下文窗口被压缩了，信息丢失了。

 理解这个机制后，你可以：

 - 把重要信息写在CLAUDE.md里（不会被压缩）
 - 一次对话只做一件事（减少上下文消耗）
 - 关键指令放在最近的消息里（最后被压缩）
 不是AI笨，是你没有在它的认知范围内给够信息。

 

### 启示五：双模型策略是AI应用的标配

 不是所有任务都需要最强的模型。Claude Code用Haiku做权限检查、用Opus做代码推理，成本降了几十倍。

 如果你在开发AI应用，想想哪些环节可以用小模型：

 - 意图分类 → 小模型
 - 内容过滤 → 小模型
 - 格式校验 → 小模型
 - 核心推理 → 大模型
 大模型做决策，小模型做执行——这是成本和效果的最优解。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="claude_code_deep_dive-四-18-内置工具怎么设计-为什么要专用工具不用bash">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">四、18+内置工具怎么设计？为什么要专用工具不用Bash？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：AI编程, 卡码笔记 · 考察点：四、18+内置工具怎么设计？为什么要专用工具不用Bash</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：面试官会问：&quot;Claude Code有哪些内置工具</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

面试官会问：&quot;Claude Code有哪些内置工具？为什么要设计专用工具而不是全用Bash？&quot;

 模型再聪明，没有工具就只能说话。Claude Code的18+内置工具，就是它的手和脚——让它能真正操作你的代码。

 

### 工具全景图

 

 按功能分类：

 文件操作类

 工具 功能 关键特点 Read 读取文件 支持图片、PDF、Jupyter Notebook Write 写入文件 完整覆盖，适合新建文件 Edit 编辑文件 精确替换，只发送diff Glob 文件搜索 按模式匹配文件路径 Grep 内容搜索 在文件内容中搜索关键词 执行类

 工具 功能 关键特点 Bash 执行Shell命令 支持超时、后台运行 NotebookEdit 编辑Jupyter 操作notebook的cell 网络类

 工具 功能 关键特点 WebFetch 抓取网页 自动HTML转Markdown WebSearch 搜索网络 获取实时信息 Agent类

 工具 功能 关键特点 Agent 启动子Agent 并行处理复杂任务 Skill 调用技能 执行预定义的工作流 交互类

 工具 功能 关键特点 AskUserQuestion 向用户提问 多选/单选/自由输入 TodoWrite 任务管理 创建和跟踪任务列表 

### 工具设计的核心原则

 原则一：专用工具优先于通用命令

 Claude Code的系统提示词里明确写了：

 &quot;Prefer dedicated tools over Bash when one fits (Read, Edit, Write) — reserve Bash for shell-only operations.&quot;

 为什么不直接用cat读文件、用sed改文件？因为专用工具有更好的错误处理、权限控制和用户体验。用户能看到&quot;Claude正在编辑文件&quot;，而不是看到一堆shell命令。

 原则二：Edit工具只发送diff

 这是一个很聪明的设计。Edit工具不是重写整个文件，而是指定old_string和new_string，只替换匹配的部分。

 好处：

 - 节省Token——不需要在上下文里放整个文件内容
 - 减少冲突——只改需要改的部分
 - 便于审查——用户一眼看到改了什么
 坏处：

 - old_string必须唯一匹配——如果文件里有重复内容，需要提供更多上下文来定位
 原则三：工具描述即规则

 每个工具的description字段里都嵌入了使用规则。比如Bash工具的描述长达几百字，包含：

 - 什么时候该用Bash，什么时候不该用
 - 怎么处理长时间运行的命令
 - Git操作的安全规范
 - 多命令并行的最佳实践
 模型每次想调用工具时，都会重新看到这些规则。 这比只在系统提示词里写一次要可靠得多。

 

### Bash工具：最强大也最危险

 Bash是Claude Code里最强大的工具——理论上它能执行任何shell命令。但也正因如此，它的限制最多：

 - 默认2分钟超时——防止无限循环
 - 不支持交互式命令——不能用vim、不能用git rebase -i
 - 长时间命令要后台运行——dev server、watch模式不能阻塞
 - 权限检查最严格——rm -rf、git push --force都需要用户确认
 这个设计体现了一个核心理念：给AI足够的能力，但用规则约束它的行为边界。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="claude_code_grep_rag_interview">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">目录</span></h2>

# Claude Code为什么不用RAG检索代码？Grep、Glob、Read与代码检索设计哲学  最近知识星球  (opens new window)有录友问了一个很容易被面试官拿来深挖的问题：

 &quot;为什么 Claude Code 不用 RAG 检索代码，而是直接用 grep？&quot;

 这个问题听起来像工具选型，其实不是。

 它问的是：你到底懂不懂代码检索和普通知识库检索的区别。

 很多录友一听检索，脑子里就自动冒出 RAG、Embedding、向量数据库、Top-K、Rerank。

 这套东西当然重要。

 之前写 RAG大厂面试题汇总 的时候，卡哥也讲过，RAG 是大模型应用开发绕不开的基础能力。

 但注意，RAG 很强，不等于所有检索都该用 RAG。

 尤其是代码检索。

 代码不是一篇篇静态文档，代码是每天都在变的、强结构化的、需要精确定位的工程对象。

 你找 getUserById，要的就是这个函数，不是&quot;语义上差不多的用户查询函数&quot;。

 你找 LoginController，要的是这个文件、这个类、这几行调用链，不是一堆和登录相关的片段。

 所以 Claude Code 这种编程 Agent，没有把核心检索路径押在传统 RAG 上，而是把最朴素的工具做到了极致：

 Glob 找文件，Grep 搜内容，Read 读上下文，再让模型多轮判断下一步。

 看起来土。

 但这恰恰是工程判断。

 这篇文章，我们从代码检索的本质开始讲，一层层拆：

 - 代码检索到底在解决什么问题
 - 为什么传统 RAG 放到代码里会别扭
 - Claude Code 的 Grep、Glob、Read 为什么不是简单 shell 命令
 - 多轮 Agent 检索为什么比一次性 Top-K 更适合写代码
 - 子 Agent 为什么能解决上下文污染
 - grep 也不是银弹，什么场景仍然该用 RAG 或混合检索
 - 面试里怎么回答，才能答出架构感
 认真看完，面试官再问这题，你别只说&quot;因为 grep 快&quot;。


## 目录





<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：AI编程, 卡码笔记 · 考察点：Claude Code为什么不用RAG检索代码？Grep</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：- Anthropic Claude Code Settings，工具列表里包含 Glob、Grep、Read、Task 等工具：https://docs.anthropic.com/en/docs/claude-code/settings</div>
</div>

- 先说结论：这不是 grep 赢了 RAG
 - 代码检索和文档检索，根本不是一类问题
 - RAG 检索代码的四个硬伤
 - Claude Code 为什么把检索拆成三件套
 - Grep 不是简单 grep，而是受控的代码搜索工具
 - Glob 和 Read 解决的是&quot;文件入口&quot;和&quot;上下文边界&quot;
 - 真正关键的是多轮循环，不是某个工具
 - 子 Agent：把探索过程隔离出去
 - grep 方案也有边界，什么时候 RAG 仍然有价值
 - 面试怎么答
 不少读者问我，如何充值Claude会员，我在这里篇单独讲一下：国内Claude充值会员的方法


## 一、先说结论：这不是 grep 赢了 RAG

**题目**：一、先说结论：这不是 grep 赢了 RAG



### 回答

先把结论放前面：

 Claude Code 不用传统 RAG 作为代码检索主路径，不是因为 RAG 落后，而是因为代码检索更需要实时性、精确性、可解释性和多轮决策。

 这四个词，就是这道题的核心。

 RAG 的典型思路是：

 先把代码切块，做 Embedding，写进向量库。用户提问时，再把 Query 也向量化，召回语义相似的 Top-K 片段，塞给模型。

 这套方案适合什么？

 适合知识库问答、产品文档、FAQ、政策条文、客服资料。

 因为这些内容有几个特点：

 - 文档相对稳定
 - 用户问题偏语义匹配
 - 目标通常是&quot;找到相关材料&quot;
 - 答案可以由多个文档片段综合出来
 但代码检索经常是另一种形态：

 - 文件刚改完，下一秒就要读到最新内容
 - 函数名、类名、变量名必须精确匹配
 - 调用链不能被切碎
 - 搜索过程要能根据结果不断改方向
 - 错了要能知道是哪一步搜错了
 所以这不是&quot;grep 技术含量比 RAG 高&quot;。

 不是。

 grep 本身很普通。

 真正厉害的是：Claude Code 把 grep 放进了 Agent 的多轮工具调用循环里，让模型像程序员一样边搜、边读、边判断、边修正。

 如果只看工具，grep 很老。

 如果看系统，grep + Agent Loop 就不老了。

 它不是一个搜索框。

 它是一个会自己改搜索策略的代码侦查流程。


## 二、代码检索和文档检索，根本不是一类问题

**题目**：二、代码检索和文档检索，根本不是一类问题



### 回答

很多人把代码库当成&quot;一堆文本&quot;。

 这就是第一层误解。

 代码当然是文本，但它不是普通文本。

 一篇产品文档里，某句话断在两段之间，可能还凑合能读。

 代码不行。

 一个 if 的条件在上面，分支在下面，你只召回下面那几行，模型根本不知道为什么走到这里。

 一个函数只看函数体，不看它的类型定义、调用方、配置文件、路由入口，也很容易改错。

 代码检索至少有四类目标。

 第一类，找符号。

 比如找 getUserById、UserService、AuthMiddleware。

 这类问题不需要语义相似。

 要的就是字面命中。

 面试里你可以直接说：代码里大量检索任务是 symbol lookup，不是 semantic search。

 第二类，找入口。

 比如&quot;登录逻辑在哪&quot;。

 这时你可能不知道具体函数名，但你会先搜 login、auth、token、passport，再看命中的文件。

 这是关键词探索，不是一次向量召回就结束。

 第三类，找关系。

 比如&quot;这个字段从接口进来以后，在哪里校验、在哪里入库、哪里返回给前端&quot;。

 这就不是找一个片段，而是找一条路径。

 你要沿着 controller、service、dao、model、schema 一路读下去。

 第四类，找变化。

 比如&quot;刚才改了支付状态，为什么测试挂了&quot;。

 这时最重要的是最新文件内容、git diff、最近修改的文件。

 RAG 索引如果没更新，召回的就是旧代码。

 旧代码拿来修新 bug，这不是帮忙，是添乱。

 所以代码检索的核心不是&quot;找相似内容&quot;，而是：

 在一个不断变化的结构化工程里，快速定位当前任务真正需要的最小上下文。

 这句话很重要。

 最小上下文，不是越多越好。

 很多录友用 AI 写代码效果差，就是喜欢把一堆无关文件塞给模型。

 模型看得越多，注意力越散。

 你以为是在补充信息，其实是在制造噪声。


## 三、RAG 检索代码的四个硬伤

**题目**：三、RAG 检索代码的四个硬伤



### 回答

RAG 能不能检索代码？

 能。

 但如果你把传统文档 RAG 直接搬到代码库，问题会非常明显。

 

### 1. Chunk 很容易破坏代码结构

 RAG 的第一步是切块。

 文档切块主要考虑语义段落。

 代码切块就麻烦了。

 按固定行数切，函数会被切断。

 按函数切，类上下文可能丢了。

 按类切，文件又可能太大。

 按 AST 切，语言多了以后工程复杂度直接上来。

 更要命的是，代码片段不是孤立的。

 一个函数的意义，往往来自：

 - 参数类型
 - 返回类型
 - 调用方
 - 被调用函数
 - 配置项
 - 数据库 schema
 - 测试用例
 传统 RAG 召回一个函数片段，看起来相关，但上下文可能是残的。

 模型基于残缺上下文改代码，幻觉概率就上来了。

 

### 2. 向量相似不等于代码正确

 向量检索擅长找&quot;意思相近&quot;。

 但代码场景经常要找&quot;名字相同&quot;。

 你让系统找 validateToken，向量库可能召回：

 - verifyToken
 - decodeToken
 - refreshToken
 - validateSession
 这些语义都很像。

 但你要改的是 validateToken。

 别的函数再像，也不是目标。

 这就是代码场景里最典型的问题：

 语义相似是优势，但精确匹配是底线。

 

 没有底线，召回越多越乱。

 

### 3. 索引滞后会伤害实时开发

 知识库 RAG 可以每天更新一次。

 代码不行。

 你让 Claude Code 改一个文件，它刚写完，下一步就要读这个文件验证。

 如果走 RAG，就有一个尴尬问题：

 索引更新了吗？

 没更新，查到旧代码。

 更新，谁来决定哪些 chunk 失效？跨文件引用怎么同步？刚改了函数签名，调用方 chunk 要不要重算？

 这些都能做。

 但代价很大。

 而 grep 和 Read 是现读磁盘。

 文件是什么样，它看到的就是什么样。

 这里没有缓存一致性问题。

 

 

### 4. Top-K 是一次性下注，Agent 需要边走边看

 传统 RAG 的核心流程是一次召回：

 用户问问题，系统召回 Top-K，模型基于 Top-K 回答。

 如果 Top-K 召回错了，后面就全歪。

 代码开发不是这样。

 程序员找问题，一般是这样的：

 先搜一个关键词。

 没搜到，换个词。

 搜到太多，缩小目录。

 看到一个文件，发现它调用另一个函数。

 再跟过去看。

 看到测试报错，再回头查实现。

 这是一串动态决策。

 不是一次性把材料发完。

 RAG 更像发试卷，Agent 检索更像现场排查。

 写代码需要的是后者。


## 四、Claude Code 为什么把检索拆成三件套

**题目**：四、Claude Code 为什么把检索拆成三件套



### 回答

Anthropic 官方文档里列出的 Claude Code 工具，能看到 Glob、Grep、Read、Task 这些工具。

 其中 Glob 是按模式找文件，Grep 是搜文件内容，Read 是读取文件，Task 是跑子 Agent 处理复杂多步任务。

 这几个工具合起来，就是 Claude Code 代码理解的底层动作。

 为什么不直接开放一个万能 Bash，让模型自己跑 grep、find、cat？

 因为产品级 Agent 不能这么粗。

 Claude Code 把这几个动作拆成专用工具，至少有三层考虑。

 第一，权限边界清楚。

 Grep 和 Read 是只读工具。

 Write、Edit 是会改文件的工具。

 这种边界对安全非常关键。

 如果都塞进 Bash，模型到底只是搜索，还是顺手执行了危险命令，就不好控制。

 第二，返回结果可控。

 普通 shell 输出是纯文本。

 工具可以控制输出结构，比如文件路径、行号、匹配内容、截断策略。

 这对模型很重要。

 模型不是人眼看终端，它需要干净、稳定、可预测的观察结果。

 第三，提示词可以教模型怎么用。

 工具不是 API 那么简单。

 工具描述会进入模型上下文，告诉模型什么时候用、参数怎么填、什么情况不要用。

 也就是说，工具定义本身就是 Agent 行为的一部分。

 所以别把 Grep 理解成&quot;包装了一下 grep 命令&quot;。

 更准确的说法是：

 Grep 是一个带权限、带输出约束、带使用规范的代码搜索能力。

 这才是工程化。


## 五、Grep 不是简单 grep，而是受控的代码搜索工具

**题目**：五、Grep 不是简单 grep，而是受控的代码搜索工具



### 回答

面试官如果继续追问：

 &quot;既然有 Bash，为什么还要单独做 Grep 工具？&quot;

 你可以从四个角度答。

 

### 1. 搜索是高频动作，必须产品化

 编程 Agent 每完成一个任务，可能会搜索很多次。

 找文件、找函数、找错误信息、找测试、找配置。

 如果每次都让模型自由拼 shell 命令，风险和噪声都会增加。

 把高频动作做成专用工具，就是把最常用的路径铺平。

 

### 2. grep 的确定性适合代码符号

 代码里很多东西，就是字面符号。

 函数名、类名、变量名、路由路径、错误码、配置 key。

 这些东西用正则和关键词搜，效果非常好。

 比如：

 rg &quot;getUserById&quot;
rg &quot;POST /login&quot;
rg &quot;JWT_SECRET&quot;
rg &quot;ORDER_STATUS_PAID&quot;
 1
2
3
4
这种任务，向量检索没有优势。

 你要的是确定命中，不是语义相似。

 

### 3. grep 结果天然可解释

 grep 命中了哪一行，一眼就能看出来。

 模型也能继续基于这个结果推理：

 &quot;这个文件命中了 login，我需要 Read 它附近 80 行。&quot;

 &quot;命中太多了，我要限定到 src/server 目录。&quot;

 &quot;这个关键词没搜到，我换成 signin。&quot;

 RAG 的 Top-K 召回则比较黑盒。

 你很难解释为什么这五个 chunk 排在前面。

 一旦答错，排查也麻烦：

 是 Embedding 不行？

 是 chunk 切错？

 是 Top-K 太小？

 是 Rerank 误排？

 是生成阶段没看？

 链路长了，定位问题就难。

 

### 4. grep 可以和目录约束组合

 真实代码搜索里，&quot;在哪搜&quot;和&quot;搜什么&quot;同样重要。

 你不会每次都全仓库搜。

 你会先判断：

 - 前端逻辑去 src/pages、src/components
 - 后端逻辑去 server、api、controller
 - 测试去 __tests__、tests
 - 配置去 .env、config
 Grep 和 Glob 配合，就能让模型逐步缩小范围。

 这比一次 Top-K 更像真实开发。


## 六、Glob 和 Read 解决的是"文件入口"和"上下文边界"

**题目**：六、Glob 和 Read 解决的是"文件入口"和"上下文边界"



### 回答

只讲 grep 还不够。

 Claude Code 不是只靠 grep。

 它靠的是三件套。

 

### Glob：先找可能相关的文件

 Glob 解决的是文件入口问题。

 有时候你不知道内容关键词，只知道文件形态。

 比如：

 - 找所有路由文件：**/*route*.ts
 - 找所有测试文件：**/*.test.ts
 - 找所有 Vue 组件：**/*.vue
 - 找所有配置文件：**/*config*
 这类检索用向量库很别扭。

 因为你不是在问语义，你就是在找文件名模式。

 文件名本身就是工程约定。

 项目越规范，Glob 越好用。

 

### Read：只读需要的上下文

 Read 解决的是上下文边界问题。

 很多人让 AI 读文件，一上来就整文件塞进去。

 这很浪费。

 真正合理的方式是：

 先 Grep 命中行号。

 再 Read 命中行附近几十行。

 如果发现需要函数定义，再扩大一点。

 如果发现调用另一个文件，再跳过去读。

 这叫按需读取。

 代码理解不是把仓库倒进模型，而是把模型需要的证据逐步拿出来。

 这个思路非常重要。

 面试里你说出来，面试官基本能听出你真的用过 AI 编程工具，而不是只背概念。

 

### 三件套的标准路径

 举个例子。

 用户说：&quot;登录接口加一个验证码校验。&quot;

 Claude Code 大概率不是直接写代码。

 它会先探索：

 - 用 Glob 找路由和登录相关文件，比如 **/*auth*、**/*login*
 - 用 Grep 搜 login、signin、token、password
 - 用 Read 读取命中文件附近逻辑
 - 发现登录调用了 AuthService
 - 再 Grep AuthService
 - Read service 实现
 - 找到测试文件
 - 修改代码
 - 跑测试或读取测试逻辑验证
 你看，这不是一次检索。

 这是一个不断收敛的链路。

 每一步都在问：

 &quot;我现在知道了什么？下一步最该看哪里？&quot;

 这就是 Agent。


## 七、真正关键的是多轮循环，不是某个工具

**题目**：七、真正关键的是多轮循环，不是某个工具



### 回答

如果只说 Claude Code 用 grep，所以不用 RAG，这个答案还不够。

 真正核心是：

 Claude Code 的检索发生在 Agent Loop 里。

 之前写 Claude Code大厂面试题汇总 的时候讲过，Claude Code 的底层形态就是多轮循环：

 模型思考下一步，调用工具，拿到工具结果，再继续判断。

 代码检索放进这个循环以后，就变成了动态搜索。

 动态搜索和 RAG 的差别很大。

 

### RAG 是一次性给材料

 典型 RAG 是：

 用户问题 → 向量召回 Top-K → 拼 Prompt → 模型回答。

 它的问题是，召回阶段一旦选错，模型没有机会修正检索策略。

 当然，Agentic RAG 可以多轮检索。

 但传统 RAG 面试里大家讲的那套，核心还是&quot;先召回，再生成&quot;。

 

### Agent 检索是边看边改方向

 Agent 检索是：

 用户问题 → 模型决定先搜什么 → 工具返回结果 → 模型看结果 → 决定下一步读哪里或换什么关键词。

 这更接近人类程序员的工作方式。

 比如搜 login 结果太多。

 模型会缩小目录。

 搜 captcha 没结果。

 模型会试 verifyCode、smsCode、validateCode。

 读到 AuthService.login()，发现调用了 issueToken()。

 模型会继续跟进去。

 读到测试用例，发现已有登录测试。

 模型会优先修改测试覆盖。

 这就是多轮循环的价值：

 工具结果不是答案，而是下一轮决策的证据。

 这句话可以直接放进面试回答。


## 八、子 Agent：把探索过程隔离出去

**题目**：八、子 Agent：把探索过程隔离出去



### 回答

还有一个面试官很爱追问的点：

 &quot;如果让主 Agent 一直 Grep、Read，上下文不会爆吗？&quot;

 会。

 所以 Claude Code 还有 Task 工具，也就是让子 Agent 去处理复杂、多步的探索任务。

 Anthropic 官方文档也明确讲了 subagents 的价值：子 Agent 有独立的上下文窗口，可以避免污染主对话，并且能限制工具权限。

 这点非常关键。

 

### 什么叫上下文污染

 你让 Agent 调研一个项目的鉴权流程。

 它可能要：

 - 搜 auth
 - 搜 login
 - 搜 jwt
 - 搜 middleware
 - 读路由
 - 读 service
 - 读配置
 - 读测试
 - 读拦截器
 中间会产生大量搜索结果和文件片段。

 这些信息有用吗？

 对探索过程有用。

 对最终写代码不一定都有用。

 如果全塞进主 Agent 上下文，主 Agent 后面真正要修改代码时，注意力就会被一堆中间过程占满。

 这就是上下文污染。

 

### 子 Agent 怎么解决

 主 Agent 可以派一个探索型子 Agent：

 &quot;你去调研登录链路，给我返回关键文件、核心流程、修改点。&quot;

 子 Agent 在自己的上下文里随便 Grep、Read。

 它可以看很多文件，做很多中间判断。

 最后只把压缩后的结论返回给主 Agent。

 主 Agent 不需要记住所有 grep 输出。

 它只需要知道：

 - 登录入口在哪个文件
 - 验证逻辑在哪个函数
 - token 在哪里生成
 - 测试应该改哪里
 - 需要注意什么边界
 这就是上下文治理。

 子 Agent 的价值不是&quot;更聪明&quot;，而是把探索过程和执行上下文隔离开。

 这比&quot;多开几个 Agent 并行干活&quot;更本质。

 并行只是收益之一。

 隔离才是核心。

 

### 子 Agent 也要控制权限

 生产级 Agent 里，子 Agent 不能随便拥有所有工具。

 探索型子 Agent 最好只给只读工具。

 比如 Glob、Grep、Read。

 它负责调研，不负责改代码。

 主 Agent 拿到结论后，再决定是否 Edit。

 这个设计能降低误操作风险。

 面试里可以这么说：

 复杂探索用子 Agent，简单定向搜索用 Grep/Glob/Read。子 Agent 最好限制为只读工具，把上下文污染和权限风险都隔离出去。

 这就是很工程化的回答。


## 九、grep 方案也有边界，什么时候 RAG 仍然有价值

**题目**：九、grep 方案也有边界，什么时候 RAG 仍然有价值



### 回答

写到这里，录友别误会。

 不是说 RAG 没用。

 更不是说做代码检索就只能 grep。

 技术选型最忌讳站队，应该看场景。

 Claude Code 的选择适合它的主战场：

 本地或单仓代码库、实时开发、精确修改、需要多轮探索。

 但下面这些场景，RAG 或混合检索仍然有价值。

 

### 1. 超大规模跨仓库检索

 如果是公司级代码搜索，几十个仓库、几亿行代码。

 只靠 grep 不一定合适。

 这时候需要索引。

 但注意，索引不一定就是纯向量。

 更常见的是：

 - 关键词倒排索引
 - 符号索引
 - AST 索引
 - 调用图索引
 - 向量索引
 组合起来用。

 代码检索最强的形态，往往不是纯 RAG，而是混合检索。

 

### 2. 模糊需求探索

 用户问：

 &quot;找一下项目里和权限收敛相关的逻辑。&quot;

 &quot;有没有类似限流熔断的实现？&quot;

 &quot;哪里处理了用户风险等级？&quot;

 这类问题不一定有明确关键词。

 向量检索可以帮你找到语义相近的代码和文档。

 然后再用 grep 精确追踪。

 所以比较好的路径是：

 语义检索做发现，grep 做确认，Read 做证据。

 这个说法比&quot;RAG 不行&quot;高级得多。

 

### 3. 代码加文档的综合问答

 很多企业内部问题，不只在代码里。

 还在设计文档、接口文档、ADR、Wiki、故障复盘里。

 比如：

 &quot;为什么订单状态这里要分成 PAID 和 CONFIRMED？&quot;

 答案可能不在代码里，而在历史设计文档里。

 这种场景 RAG 很适合。

 因为它检索的是知识背景，不是当前文件的精确修改点。

 

### 4. 长期记忆和团队知识沉淀

 Claude Code 读当前代码库很强。

 但如果你要做的是团队级知识助手，长期积累：

 - 常见故障原因
 - 历史架构决策
 - 代码规范
 - 业务词表
 - 工程实践经验
 那 RAG 仍然很重要。

 grep 只能搜当前文件。

 RAG 可以承载长期知识。

 所以最终答案应该是：

 代码实时修改主路径用 grep/Glob/Read，跨仓语义发现和知识背景用 RAG 或混合检索。

 这才是成熟架构师的判断。


## 十、面试怎么答

**题目**：十、面试怎么答



### 回答

最后我们把这道题收回来。

 面试官问：

 &quot;为什么 Claude Code 不用 RAG 检索代码，而是直接用 grep？&quot;

 不要上来就说：

 &quot;因为 grep 快。&quot;

 太简单了。

 你可以分三层答。

 

### 第一层：代码检索不是普通文档检索

 可以这么说：

 &quot;代码检索和知识库文档检索不一样。文档 RAG 更关注语义相关，但代码检索经常是符号定位、文件入口、调用链追踪和最新内容读取。比如我找一个函数名或配置 key，精确匹配比语义相似更重要。&quot;

 这一层回答的是场景差异。

 

### 第二层：传统 RAG 在代码场景有结构性问题

 接着说：

 &quot;如果把传统 RAG 直接用到代码库，会遇到几个问题。第一，chunking 容易破坏函数、类、调用链这些结构。第二，向量召回是近似匹配，容易把相似函数召回来，但代码修改要的是准确目标。第三，代码每天都在变，索引容易滞后。第四，Top-K 是一次性召回，写代码更需要根据搜索结果不断调整方向。&quot;

 这一层回答的是 RAG 的短板。

 

### 第三层：Claude Code 的关键不是 grep，而是 Agent Loop

 最后升维：

 &quot;Claude Code 的设计不是简单用 grep 替代 RAG，而是把 Grep、Glob、Read 放进 Agent Loop 里。模型先搜，再读，再根据结果决定下一步。这种多轮检索更像程序员现场排查问题。复杂探索还可以交给子 Agent，在独立上下文里搜索和总结，避免污染主 Agent 上下文。&quot;

 这一层回答的是 Agent 设计哲学。

 如果想再加一句，可以这样收尾：

 &quot;所以这不是 grep 和 RAG 谁高级的问题，而是主路径选型。实时、精确、可解释的代码修改，grep/Read 更合适；跨仓语义发现、代码加文档的知识问答，RAG 或混合检索仍然有价值。&quot;

 这套回答就完整了。


## 高频追问

**题目**：高频追问



### 回答

### 追问1：那 grep 搜不到语义怎么办？

 答：

 &quot;grep 不擅长纯语义搜索，所以 Claude Code 这类工具通常会通过多轮关键词改写、文件结构探索、调用链阅读来弥补。如果是跨仓库的模糊语义发现，我会引入混合检索，用向量召回做发现，用 grep 和 Read 做确认。&quot;

 关键词是：向量做发现，grep 做确认。

 

### 追问2：为什么不用 AST 索引？

 答：

 &quot;AST 索引对代码结构理解很有价值，尤其适合符号跳转、引用查找、调用关系分析。但它的工程成本更高，多语言支持复杂，实时更新也麻烦。Claude Code 的核心场景是快速适配任意项目，所以用通用的文件模式搜索和内容搜索作为基础能力，更轻量。理想情况下，AST 索引可以作为增强能力，不一定替代 Grep。&quot;

 这回答比较稳。

 不要把 AST 贬低，它很有用。

 但要讲清楚成本和适用范围。

 

### 追问3：RAG 能不能做增量更新？

 答：

 &quot;能做，但增量更新本身就是复杂工程。代码改动会影响 chunk、符号引用、调用链和测试上下文，单纯替换某个向量不一定够。对于实时编码场景，现读磁盘天然避免索引一致性问题。对于公司级知识库或跨仓检索，再做增量索引是合理的。&quot;

 

### 追问4：子 Agent 为什么能减少上下文污染？

 答：

 &quot;因为子 Agent 有独立上下文。它可以在自己的上下文里做大量 Grep 和 Read，最后只把压缩后的结论返回给主 Agent。主 Agent 不需要承载所有中间搜索结果，后续修改代码时注意力更集中。&quot;

 

### 追问5：一句话总结 Claude Code 的设计哲学？

 答：

 &quot;把确定性工具交给模型，把检索决策权还给模型，让模型在多轮工具反馈中逐步逼近答案。&quot;

 这句话就够狠。


## 最后

**题目**：最后



### 回答

这道题表面问的是：

 &quot;Claude Code 为什么不用 RAG？&quot;

 实际问的是：

 你能不能根据任务特点做检索架构选型。

 RAG 很重要，但不要把 RAG 当万能钥匙。

 代码检索最怕的不是&quot;搜不到很多相关内容&quot;。

 最怕的是搜到一堆看起来相关、实际上不能改的内容。

 AI 编程工具的核心，不是把整个仓库喂给模型。

 而是让模型像一个靠谱工程师一样：

 先找入口，再看证据，再跟调用链，再动手改。

 别迷信复杂架构。

 能用简单工具解决的问题，先把简单工具用到极致。

 这也是工程能力。


## 参考资料

**题目**：参考资料



### 回答

- Anthropic Claude Code Settings，工具列表里包含 Glob、Grep、Read、Task 等工具：https://docs.anthropic.com/en/docs/claude-code/settings
 - Anthropic Claude Code Subagents，子 Agent 独立上下文和工具权限说明：https://docs.anthropic.com/en/docs/claude-code/sub-agents

---
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="vibe_coding_interview-q1">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">1. Vibe Coding 到底是什么？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：AI编程, 卡码笔记 · 考察点：1. Vibe Coding 到底是什么？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：# Vibe Coding大厂面试题汇总：AI编程时代你的优势到底在哪 现在大厂面试官最喜欢问一个灵魂问题：在 vibe coding 盛行以及基模越来越强的当今，你觉得你的优势是什么</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

# Vibe Coding大厂面试题汇总：AI编程时代你的优势到底在哪 现在大厂面试官最喜欢问一个灵魂问题：在 vibe coding 盛行以及基模越来越强的当今，你觉得你的优势是什么？

 我估计很多录友都不知道怎么回答。

 或者说，之前的回答思路已经不够用了。

 为什么这么说？

 因为之前的套路是说&quot;AI 做不了复杂业务逻辑&quot;&quot;AI 写不了安全代码&quot;&quot;AI 处理不了并发&quot;——但说实话，2026 年了，AI 这些都写得挺好。

 Claude Code 能写出带完整异常处理的微服务调用，Codex 能处理复杂的状态机逻辑，Cursor 能一次改十几个文件还不乱。

 继续说&quot;AI 做不了这个&quot;，面试官只会觉得你脱离实际。

 那你的优势到底在哪？这篇文章重新回答这个问题，并且聚焦面试官真正关心的实操问题——Token 成本怎么控制、AI 代码怎么管、效果怎么评估。

2025 年 2 月 Andrej Karpathy 提出这个词的时候，定义很明确：不审查、不理解、直接 Accept AI 生成的代码。

 维度 Vibe Coding AI 辅助编程 代码生成 AI 生成 AI 生成 代码审查 不看，直接 Accept 逐行审查 报错处理 粘贴给 AI 分析根因再决定 对代码负责 不负责 完全负责 面试官问你是不是 Vibe Coding，其实是在问一个问题：你对你 Accept 的代码负不负责？

 这个定义不用多展开，重点是下面两个问题。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="vibe_coding_interview-q2">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">2. AI 越来越强，你的优势到底是什么？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：AI编程, 卡码笔记 · 考察点：2. AI 越来越强，你的优势到底是什么？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：先承认一个事实：AI 现在确实写得好</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

先承认一个事实：AI 现在确实写得好。

 复杂业务逻辑？给它足够的上下文，它能写出符合你公司规则的结算代码。

 安全代码？告诉它要注意什么，它能写出带输入校验和权限检查的代码。

 跨模块调用？把接口文档喂给它，它能生成正确的调用链路。

 性能优化？让它关注性能，它能帮你找出 N+1 查询和内存泄漏。

 所以如果你的回答还是&quot;AI 做不了 XX&quot;，面试官一句话就能怼回来：&quot;你给够上下文了吗？&quot;

 那你的优势到底在哪？不是&quot;AI 做不了什么&quot;，而是&quot;AI 做什么都需要你先做对什么&quot;。

 

### 优势一：问题定义能力

 AI 能解决你定义好的问题，但定义问题本身就是最难的部分。

 产品经理说&quot;加个退款功能&quot;——这不是需求，这是一句话。真正的需求定义要回答：

 - 部分退款怎么处理？
 - 退款和优惠券的互斥规则是什么？
 - 多次退款的幂等性怎么保证？
 - 退款超时了怎么自动关闭？
 这些问题的答案，AI 不知道，产品经理也没说清楚。是你把一句话变成了可执行的规格，AI 才能写出正确的代码。

 反过来，如果你自己都没想清楚，AI 写出来的代码一定也是模糊的——你给它一句话，它给你一个&quot;看起来像那么回事&quot;的接口，跑是能跑，但业务逻辑经不起推敲。

 面试怎么说：&quot;AI 很强，但它需要精确的问题定义。我的优势在于能把模糊的需求拆解成清晰的技术规格——边界条件、异常处理、业务规则，这些 AI 不会主动问你，但不说清楚代码一定写不对。&quot;

 

### 优势二：上下文构建能力

 AI 的输出质量，直接取决于你给的上下文质量。

 同样的需求，两种人用 AI：

 - A 直接说&quot;写一个退款接口&quot; → AI 凭想象写，大概率不符合你的业务
 - B 给了完整的业务规则、数据库表结构、上下游接口文档 → AI 写出来的代码基本能直接用
 差距在哪？不是 AI 的能力差距，是喂给 AI 的上下文质量的差距。

 上下文构建能力包括：

 - 知道给什么：哪些信息是 AI 必须知道的，哪些是噪音
 - 知道不给什么：塞 10 万行无关代码进上下文，既浪费 Token 又干扰模型
 - 知道怎么组织：先给背景再给需求，和反过来，AI 的生成质量完全不同
 这也是为什么同一个 AI 工具，高手用和新人用效果差 10 倍。不是工具不同，是输入不同。

 关于怎么科学地构建上下文，之前写过一篇 Claude Code 深度解析，里面有专门讲 200K 上下文窗口的管理策略，录友们可以翻翻。

 面试怎么说：&quot;同样用 Claude Code，不同人产出质量差很多。差别在于上下文构建——我给 AI 的 Prompt 包含完整的业务规则、相关代码片段和边界条件，而不是一句话就让它写。AI 的上限是由你的输入质量决定的。&quot;

 

### 优势三：结果验证能力

 代码跑起来了 ≠ 代码对了。

 AI 生成的代码经常&quot;看着对、跑得通、但语义是错的&quot;。比如：

 - 退款接口返回成功，但实际是退到了错误的账户
 - 权限校验通过了，但用的是错误的角色
 - 数据处理完成了，但精度丢失了两位小数
 这些 bug 跑测试不一定能发现，因为测试是按你的预期写的，而你的预期可能和业务需求有偏差。

 验证能力不是&quot;跑一下看有没有报错&quot;，而是：

 - 业务语义验证：这段代码的行为是否符合业务意图
 - 边界验证：极端情况下的行为是否符合预期
 - 回归验证：这次改动有没有影响其他功能
 特别要注意 AI 的&quot;合理但错误&quot;代码——逻辑通顺、能跑通、但语义和业务需求不一致。这种代码最容易通过 Code Review，因为看起来真的很合理。

 面试怎么说：&quot;AI 生成的代码我会重点验证业务语义，不是看能不能跑通，而是看行为是否符合业务意图。比如退款接口我会验证退款金额、退款对象、幂等性，这些是测试覆盖不到的，必须人工理解。&quot;

 

### 优势四：技术决策能力

 AI 能列出方案 A 和方案 B 的 pros/cons，但拍板选哪个是你决定的。

 技术决策包括：

 - 选型决策：用 Redis 还是 Memcached？用 gRPC 还是 REST？AI 能分析，但你的业务场景只有你知道
 - 架构决策：拆微服务还是单体优先？同步还是异步？短期快还是长期稳？
 - 成本决策：花 3 天重构还是花 3 个月重构？用贵的模型还是便宜的模型？
 AI 的建议是通用的，你的决策是具体的。通用建议和具体场景之间，永远需要人来做判断。

 举个实际例子：AI 会告诉你&quot;高并发场景用缓存&quot;，但不会告诉你你们团队的缓存之前出过两次线上事故，这次要用就得多加一层降级。这个判断只能你做。

 面试怎么说：&quot;AI 能帮我分析方案，但最终的选型决策是我做的。因为决策要考虑的不仅是技术因素，还有团队现状、业务阶段、历史教训——这些 AI 不知道，也不应该由 AI 决定。&quot;

 

### 优势五：成本控制能力

 这一条在面试里越来越重要，因为AI 编程不是免费的。

 一次 Claude Code 的交互，可能消耗 5 万到 20 万 Token。一个项目跑下来，Token 费用可能比工程师工资还高。

 成本控制能力包括：

 - 知道什么时候用大模型，什么时候用小模型
 - 知道怎么组织上下文才能省 Token
 - 知道怎么写 Prompt 才能减少来回次数
 - 知道哪些任务让 AI 做更贵，自己做更便宜
 这一点很重要，放在本篇下一节单独说。

 

### 五大优势总结

 一句话：AI 的输出质量取决于你的输入质量——定义问题、构建上下文、验证结果、做决策、控成本，这五件事 AI 替代不了你。

 不是&quot;AI 做不了&quot;，是&quot;AI 做什么都需要你先做对&quot;。

 这两种说法看起来差不多，但逻辑完全不同：

 - &quot;AI 做不了&quot;的潜台词是：等 AI 也能做了，你就没优势了
 - &quot;AI 需要你&quot;的潜台词是：只要 AI 还需要人来驱动，你的优势就在
 前者是防守型思路，越守越窄。后者是驱动型思路，越用越强。
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="vibe_coding_interview-q3">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">3. AI 编程工具的 Token 成本怎么控制？</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：AI编程, 卡码笔记 · 考察点：3. AI 编程工具的 Token 成本怎么控制？</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：这个问题面试官越来越爱问，因为这是团队用 AI 编程最实际的问题</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

这个问题面试官越来越爱问，因为这是团队用 AI 编程最实际的问题。

 不控制成本，一个月 Token 账单可能比工程师工资还高。控制得太狠，AI 产出质量又下降。关键是在成本和质量之间找到平衡点。

 

### 策略一：模型路由——什么活用什么模型

 不是所有代码都需要最强的模型来写。根据任务复杂度路由到不同模型：

 任务类型 推荐模型级别 原因 代码补全、简单修改 小模型 速度快、成本低、够用 函数实现、Bug 修复 中模型 平衡成本和质量 架构设计、复杂重构、代码审查 大模型 需要深度推理 代码解释、文档生成 小模型 不需要强推理 成本差距有多大？ 大模型的输出价格是小模型的近 20 倍。如果一个 70% 的任务能用小模型解决，整体成本能降 60% 以上。

 

 当然，模型路由不是让你手动选。Claude Code 内部已经在做这件事——简单补全走轻量模型，复杂推理走主力模型。Claude Code 深度解析 里有讲它的双模型策略。

 但面试官想听的不是&quot;工具自动做了&quot;，而是你理解为什么这么做。

 面试怎么说：&quot;我们团队做了模型路由策略——简单补全用小模型，复杂任务才用大模型。70% 的日常编码任务其实不需要最强模型，这样整体 Token 成本能降 60% 以上。&quot;

 

### 策略二：上下文管理——别把整个代码库塞进去

 上下文窗口是 Token 消耗的大头。

 很多人用 Claude Code 的时候，习惯把整个项目目录打开，让它自己找文件。结果每次交互，模型都要读取大量无关代码，Token 消耗直接翻几倍。

 正确的做法：

 - 只给相关的代码：修改用户模块，就不要把支付模块的代码也塞进去
 - 用摘要代替全文：不需要把 500 行的配置文件全给 AI，给关键部分就行
 - 按需加载：先让 AI 看接口定义，需要实现细节时再给具体代码
 - 定期清理上下文：长时间对话会积累大量历史 Token，该开新会话就开新会话
 实际效果：只给相关代码 vs 给整个项目，Token 消耗可能差 3-5 倍。

 还有一个容易忽略的点：AI 读到的无关代码越多，生成质量反而越差。因为无关信息会干扰模型的注意力，让它关注到不该关注的地方。所以上下文管理不只是省钱，也是在提升质量。

 

 面试怎么说：&quot;我会主动管理上下文，只给 AI 相关的代码片段而不是整个项目。修改用户模块就只给用户模块的代码和它依赖的接口定义。这样做 Token 消耗能降 3-5 倍，而且 AI 生成质量反而更好——因为无关信息少了，模型不容易被干扰。&quot;

 

### 策略三：Prompt 优化——一次说清楚，别来回改

 来回改是最浪费 Token 的。

 模糊的 Prompt → AI 生成不符合预期 → 再改 Prompt → 再生成 → 还是不对 → 再改……

 一次说清楚，直接省掉 3-4 轮交互。

 怎么写好 Prompt：

 - 说清楚目标：不是&quot;写个接口&quot;，是&quot;写一个 REST 接口，接收退款请求，参数包括订单号和退款金额，需要幂等校验&quot;
 - 说清楚约束：性能要求、安全要求、代码规范
 - 说清楚上下文：相关的数据库表结构、上下游接口
 - 给示例：一个具体的输入输出示例，比 100 字描述更有效
 成本对比：一次精确 Prompt 可能 500 Token，四轮模糊 Prompt 可能 12000 Token——差 24 倍。这还没算时间的浪费。

 

 之前写过一篇 Harness Engineering 面试题，核心观点就是 AI 编程的重心正在从 Prompt Engineering 转向 Context Engineering——不是你怎么说，是你给什么信息。录友们可以连着看。

 

### 策略四：缓存和复用

 相似的问题，不要让 AI 从零生成。

 - Prompt 缓存：相同的 Prompt 前缀，API 层面可以缓存，省掉重复计算的 Token。Anthropic 的 API 已经原生支持了 Prompt Caching，相同前缀的输入可以打到 90% 的缓存命中率
 - 代码模板：常见的 CRUD 接口、表单验证，维护一套模板，AI 只需要填差异部分
 - 会话复用：同一类任务的 Claude Code 会话，可以复用之前的上下文，不要每次从零开始
 面试怎么说：&quot;我们团队维护了一套代码模板，AI 只需要根据具体需求填充差异部分，而不是每次从零生成。配合 Prompt Caching，相似任务的 Token 消耗能降低 50% 以上。&quot;

 

### 策略五：评估——哪些任务让 AI 做更贵

 不是所有任务都适合让 AI 做。

 有些任务你自己写 10 分钟搞定，让 AI 写要花 20 分钟来回改 Prompt + 审查代码，Token 费用还不少。这种情况下，直接自己写才是最优解。

 适合让 AI 做的：

 - 重复性高、模式固定的代码（CRUD、样板代码）
 - 你知道要什么但手写太慢的代码
 - 需要快速探索多种方案的场景
 - 不熟悉的语言或框架的入门代码
 不适合让 AI 做的：

 - 改一行配置就能解决的小修改
 - 你已经非常熟悉的代码区域，手写比解释更快
 - 需要深度理解业务上下文的决策型代码
 - 已经有精确模板、复制粘贴比生成更快的情况
 举个日常开发的例子：线上报了一个 NullPointerException，你翻日志定位到是 OrderService.java 第 127 行，user.getAddress() 没做空判断。你加一行 if (user.getAddress() != null) 10 秒搞定。

 但如果你交给 AI？

 很多录友是这样的，具体哪里报错也不看，上来就粘贴报错信息给AI，让AI去修复。

 等AI读报错信息，再去读文件，又要分析上下文，再生成修复代码，AI还有自己的一套校验机制。

 这一套流程下来，至少10k token就花出去了。 文件如果大一点，就是几十k token

 然后你还得审查它是不是改对了地方、有没有多改别的。

 前后 3 分钟，Token 消耗可能几万。10 秒的手工活，变成了 3 分钟的 AI 交互，还更贵。

 这就是&quot;让 AI 做更贵&quot;的典型场景：你已经知道问题在哪、怎么改，这时候直接改就是最优解。

 

### Token 成本控制总结

 策略 核心思路 预期效果 模型路由 简单任务用小模型 成本降 60%+ 上下文管理 只给相关代码 消耗降 3-5 倍 Prompt 优化 一次说清楚 往返次数降 3-4 倍 缓存复用 不从零开始 消耗降 50%+ 任务评估 不该用 AI 的就别用 视场景
</div>
</details>

</div>

---

<div class="question-card custom-card compact-card" id="vibe_coding_interview-q4">

<h2 class="question-title"><span class="q-badge custom-badge">✦</span><span class="question-text">4. 面试高频问题汇总</span></h2>

<details class="answer-reveal">
<summary>展开面试回答</summary>
<div class="answer-body">
<div class="answer-extras">
<div class="q-meta"><strong>轮次</strong>：一面/二面 · 难度：⭐⭐⭐ · 标签：AI编程, 卡码笔记 · 考察点：4. 面试高频问题汇总</div>
<div class="q-conclusion">💡 <strong>15 秒结论</strong>：Q：AI 越来越强，你的优势是什么</div>
<div class="q-followups">🔁 <strong>追问方向</strong>：结合项目经历举例 · 优缺点与工程取舍</div>
</div>

### 场景类

 Q：AI 越来越强，你的优势是什么？

 差的回答：&quot;AI 做不了复杂业务逻辑和安全代码。&quot;

 好的回答：&quot;AI 确实越来越强，很多之前说 AI 做不了的场景现在都做得不错。但 AI 的输出质量直接取决于人的输入质量——定义问题、构建上下文、验证结果、做决策、控成本，这五件事 AI 替代不了我。我的优势不是比 AI 写得好，是让 AI 写得更好。&quot;

 Q：你负责的项目里，哪些让 AI 写，哪些自己写？

 判断标准不是&quot;AI 做得了还是做不了&quot;，而是**&quot;这段代码出 bug 的代价有多大&quot;和&quot;让 AI 写和手写哪个综合成本更低&quot;**。

 代价大、AI 写更贵的：自己写或 AI 写但严格审查。代价小、AI 写更便宜的：让 AI 加速。

 Q：你怎么审查 AI 生成的代码？

 重点查三样：业务语义（代码行为是否符合业务意图）、安全风险（输入校验、权限控制、敏感数据）、工程性（性能、可维护性、规范一致性）。

 特别注意 AI 的&quot;合理但错误&quot;代码——逻辑通顺、能跑通、但语义和业务需求不一致。这种代码最容易漏过 Review。

 Q：AI 生成的代码出了线上 bug，你怎么处理？

 三步走：先止血，再定因，最后补流程。

 止血：回滚或降级，先让线上恢复，不管是不是 AI 写的代码，处理方式一样。

 定因：看监控确认影响范围，看日志追踪调用链路，定位到具体的问题代码。如果是 AI 生成的代码，还要想清楚审查的时候为什么没拦住——是安全没审到，还是边界条件没覆盖，还是业务语义理解有偏差。

 补流程：补充测试用例、加强审查重点、甚至调整哪些场景允许 AI 生成。一个 bug 不可怕，同类 bug 再出一次才可怕。

 Q：AI 写的代码上线出问题了，让 AI 修，结果 AI 也修不好，你怎么兜底？

 这个问题很刁钻，但确实会发生。AI 自己写的代码，自己修不好——可能是因为它对线上环境没有感知，也可能是因为问题根因涉及多个模块的交互，AI 的上下文窗口里装不下全局信息。

 兜底的关键是你不能等 AI 来救你，你得自己能接手：

 - 先止血：不管 AI 能不能修，先回滚到上一个稳定版本，线上用户等不了
 - 自己排查：看日志、看监控、看链路追踪，定位根因。这时候你之前审查 AI 代码积累的理解就派上用场了——如果你审查的时候理解了逻辑，排查速度会快很多；如果你审查的时候是&quot;看着没问题就过了&quot;，那排查起来跟看别人的代码没区别
 - 修复上线：自己改代码，走正常的测试和发布流程
 - 复盘：为什么 AI 修不好？是上下文不够，还是问题超出它的能力范围？这次复盘的结论，决定下次类似问题还要不要交给 AI
 说到底，AI 修不了的时候，你得能修。这是底线。

 

### 工程落地类

 Q：AI 编程工具的 Token 成本怎么控制？

 五个策略：模型路由（70% 任务用小模型）、上下文管理（只给相关代码）、Prompt 优化（一次说清楚）、缓存复用（维护模板 + Prompt Caching）、任务评估（不该用 AI 的就别用）。核心是在成本和质量之间找平衡，不是越便宜越好，也不是越贵越好。

 Q：你们团队怎么管理 AI 生成的代码？

 四件事：代码归属（谁 Accept 谁负责）、审查流程（AI 代码走和人工代码一样的 Review）、监控指标（追踪 AI 代码的 Bug 率和漏洞率）、持续优化（根据数据调整 AI 使用策略）。

 Q：用 AI 写代码，怎么保证不泄露公司代码？

 很多公司，还没有自己的私有化Agent，那么业务开发就面临代码安全问题。

 AI 编程工具都有代码上传的行为——你的代码会发送到模型的服务端做推理，虽然厂商说不会用来训练，但合规部门不一定买账。

 实际操作：

 - 敏感代码不上传：核心算法、密钥管理、交易策略这些代码，不在 AI 工具里打开，更不让 AI 生成和审查
 - 用企业版而非个人版：企业版有数据隔离协议，代码不会被用于训练，合规风险小得多
 - 配置 .gitignore 和 .claudeignore：把敏感目录和文件排除在 AI 的访问范围之外，防止工具自动读取不该读的代码
 - 团队统一规范：哪些项目可以用 AI、哪些不能，写进开发规范，新人入职就知道边界
 面试怎么说：&quot;我们区分了敏感项目和非敏感项目，敏感项目不用 AI 工具，非敏感项目用企业版。同时配置了 .claudeignore 排除敏感文件，确保 AI 不会读到不该读的代码。&quot;
</div>
</details>

</div>

---

<div class="chapter-nav">

<a class="chapter-nav-link" href="/custom/kama/">📑 总览</a>

<a class="chapter-nav-link chapter-nav-next" href="/custom/kama/rag">🔍 RAG →</a>

</div>
