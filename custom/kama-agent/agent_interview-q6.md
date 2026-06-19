---
title: 6. Skills 是什么？和 Prompt 有什么区别？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [Agent, 卡码笔记]
point: 6. Skills 是什么？和 Prompt 有什么区别
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/agent_interview.html

> 来源文章：Agent大厂面试题汇总：ReAct、Function Calling、MCP、RAG高频问题

---

**题目**：6. Skills 是什么？和 Prompt 有什么区别？

**结论句（15 秒）**：面试官会问：&quot;Skills 和 System Prompt 有什么区别

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官会问：&quot;Skills 和 System Prompt 有什么区别？你会怎么设计一个 Skill？&quot;

 

### Skills 解决什么问题？

 给 Agent 一堆工具（MCP）还不够，它还需要知道：遇到代码审查，该用什么标准？写 SQL 查询时，DBA 的最佳实践是什么？回复客户时，品牌的语气要求是什么？

 这些领域专家经验，就是 Skills 要编码的东西。

 

### Skills vs System Prompt

  System Prompt Skills 作用范围 全局，一直生效 按需激活，场景触发 内容 通用行为规范 特定领域专业指导 激活方式 每次都加载 匹配场景才加载 可维护性 随功能增多变复杂 模块化，各自独立 典型内容 &quot;你是一个助手...&quot; 代码审查流程/标准 

### 一个完整的 Skill 文件示例

 ---
name: Senior_Code_Reviewer
description: 当用户要求进行代码审查时激活此技能
triggers:
  - &quot;帮我 review 代码&quot;
  - &quot;code review&quot;
  - &quot;检查这段代码&quot;
allowed-tools:
  - read_file
  - search_codebase
  - run_linter
---

# 角色定位
你是有 10 年经验的资深后端架构师，对代码质量有极高要求。

# 审查维度（必须全部覆盖）

## 1. 安全性（最高优先级）
- SQL 注入风险
- 越权访问漏洞
- 敏感信息硬编码（密码/密钥）
- 反序列化安全

## 2. 性能
- N+1 查询问题（for 循环里查数据库）
- 未释放的资源（IO流/数据库连接）
- 不必要的重复计算
- 缓存策略是否合理

## 3. 代码质量
- 单一职责原则
- 方法长度不超过 50 行
- 命名是否准确表意
- 注释是否必要且准确

# 输出格式
必须输出 Markdown 格式报告，包含：
1. 总体评分（1-10分）
2. 严重问题（必须修复）
3. 建议优化（非强制）
4. 每个问题必须附代码示例（原始代码 vs 修复后代码）

# 语气要求
专业、直接，不废话。发现问题就直说，别用&quot;可能&quot;&quot;也许&quot;这类模糊表达。
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
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
注意这个 Skill 文件的结构：身份定位 + 工作流程 + 注意事项 + 输出规范。这比简单给几个 Few-shot 示例强得多——Few-shot 教的是格式，Skills 教的是方法论。

 

### Skills 的激活机制

 用户输入 → Agent 扫描所有可用 Skills → 匹配 triggers 关键词 / 语义相似度超过阈值 → 匹配到则将 Skill 内容注入上下文，按 Skill 指导执行；没匹配到则使用通用能力。