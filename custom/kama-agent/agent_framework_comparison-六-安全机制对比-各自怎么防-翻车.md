---
title: 六、安全机制对比：各自怎么防"翻车"？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [Agent, 卡码笔记]
point: 六、安全机制对比：各自怎么防"翻车"？
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/agent_framework_comparison.html

> 来源文章：OpenClaw、Hermes Agent、Claude Code三框架横评：面试必懂的对比

---

**题目**：六、安全机制对比：各自怎么防"翻车"？

**结论句（15 秒）**：面试官会问：&quot;这三个框架怎么保证安全

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官会问：&quot;这三个框架怎么保证安全？Agent不会乱来吗？&quot;

 

### OpenClaw：沙箱隔离

 OpenClaw的安全主要靠执行环境隔离——工具跑在Docker容器或SSH远程机器里，不直接操作宿主系统。即使Agent执行了危险命令，影响范围也限制在沙箱内。

 但OpenClaw没有细粒度的权限控制——要么在沙箱里全都能做，要么不在沙箱里啥都做不了。缺少&quot;这个可以读但那个不能写&quot;的精细度。

 

### Hermes Agent：约束与恢复层

 Hermes的安全体现在Harness的第六层——约束与恢复：

 - 约束：定义Agent不能做什么，硬编码到代码或linter里，不靠Prompt
 - 校验：每步输出前后做自动检查，格式、内容、权限
 - 恢复：失败有预案——API限流就等一会重试，token快耗光就保存进度
 Hermes还支持定时任务（cron），可以设定期检查和自修复任务。

 

### Claude Code：23层安全检查 + Hook机制

 Claude Code的安全是三个框架里最完善的，分两套体系：

 第一套：23层顺序安全检查

 每次工具调用前，都要过23层检查——从权限评估到内容审查到敏感信息过滤。核心逻辑是deny &gt; ask &gt; allow的权限分级：

 - 先查deny列表——在deny里的操作直接拒绝
 - 再查allow列表——在allow里的操作直接放行
 - 都不在的默认ask——弹窗问用户
 权限可以按工具+路径+参数粒度配置。比如&quot;允许读src/目录的文件，但写src/目录要确认，删除任何文件都拒绝&quot;。

 第二套：Hook机制（面试加分点）

 Hook是Claude Code里一个非常重要的安全机制，面试官特别喜欢问。

 Hook的本质是在工具调用的前后插入自定义逻辑。它的工作方式：

 用户输入 → Hook Pre-processing → 模型推理 → 工具调用 → Hook Post-processing → 返回结果
 1
具体来说，Hook支持四种事件：

 - PreToolUse：工具执行前触发——可以拦截、修改参数、记录日志
 - PostToolUse：工具执行后触发——可以检查结果、追加操作、过滤敏感信息
 - Notification：通知事件——Agent向用户发送消息时触发
 - Stop：停止事件——Agent循环结束时触发
 配置写在.claude/settings.json里，比如：

 {
  &quot;hooks&quot;: {
    &quot;PreToolUse&quot;: [
      {
        &quot;matcher&quot;: &quot;Bash&quot;,
        &quot;command&quot;: &quot;check-dangerous-cmd.sh&quot;
      }
    ],
    &quot;PostToolUse&quot;: [
      {
        &quot;matcher&quot;: &quot;Write&quot;,
        &quot;command&quot;: &quot;scan-secrets.sh&quot;
      }
    ]
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
这段配置的意思是：每次调用Bash工具前，先跑check-dangerous-cmd.sh检查命令是否危险；每次Write工具执行后，跑scan-secrets.sh扫描有没有写入敏感信息。

 

 Hook为什么重要？ 因为它把安全规则从&quot;写在Prompt里靠模型自觉遵守&quot;变成了&quot;硬编码到执行层强制执行&quot;。模型想绕过Prompt里的规则是有可能的，但绕不过Hook——Hook在代码层面拦截，模型看不到也改不了。

 

### 安全机制对比表

 维度 OpenClaw Hermes Agent Claude Code 核心策略 沙箱隔离 约束与恢复层 23层检查 + Hook 权限粒度 沙箱级（全有或全无） 工具白名单 工具 + 路径 + 参数级 规则执行方式 环境隔离 代码硬编码 deny &gt; ask &gt; allow + Hook 事后审计 基础日志 自我督促 + LLM摘要 Hook PostToolUse + 审计日志 敏感信息防护 沙箱隔离 校验层 23层内容审查 + Hook扫描 自定义安全逻辑 无 linter规则 Hook脚本 

 

### 面试答法

 先说思路差异：OpenClaw靠隔离（沙箱），Hermes靠约束（代码硬编码），Claude Code靠分层检查+Hook。

 Hook是加分点——说清楚Hook在工具调用前后插入自定义逻辑，把安全规则从&quot;靠Prompt&quot;变成&quot;靠代码强制执行&quot;。模型可能绕过Prompt里的规则，但绕不过Hook。