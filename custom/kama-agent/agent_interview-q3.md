---
title: 3. Agent 有哪些工作模式？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [Agent, 卡码笔记]
point: 3. Agent 有哪些工作模式？
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/agent_interview.html

> 来源文章：Agent大厂面试题汇总：ReAct、Function Calling、MCP、RAG高频问题

---

**题目**：3. Agent 有哪些工作模式？

**结论句（15 秒）**：面试官会问：&quot;你了解 ReAct 吗

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官会问：&quot;你了解 ReAct 吗？除了 ReAct 还有哪些 Agent 工作模式？各自的优缺点是什么？&quot;以及&quot;如果 Agent 陷入了死循环怎么办？&quot;

 Agent 有四种主流工作模式，先看总览，再逐一细读。

 

 

### 模式一：ReAct（推理 + 行动）

 最经典的 Agent 工作模式，几乎所有主流框架（LangChain、LangGraph）的默认选择。

 ReAct 的核心是一个三步循环：Thought（思考）→ Action（行动）→ Observation（观察）→ 回到 Thought 继续思考，直到任务完成。

 实际跑起来长这样：

 Thought: 用户想查北京明天天气，我需要调用天气工具
Action: get_weather(city=&quot;北京&quot;, date=&quot;明天&quot;)
Observation: {&quot;city&quot;:&quot;北京&quot;,&quot;date&quot;:&quot;2025-04-11&quot;,&quot;weather&quot;:&quot;中雨&quot;,&quot;temp&quot;:&quot;14-20°C&quot;}

Thought: 天气查到了，是中雨。用户还没说要不要取消日程，我应该告诉他结果
Action: 结束，生成最终回答
Final Answer: 明天北京有中雨，气温14-20°C，建议带伞。
 1
2
3
4
5
6
7
优点：透明可审计（每步思考看得见）、灵活适应（观察结果后可调整）、通用性强。

 缺点：Token 消耗大（每步都要完整推理）、可能死循环（工具反复失败时卡住）、延迟高（每次 Action 都要等 LLM 响应）。

 

#### 如何防止 ReAct 死循环？← 面试高频追问

 这是面试必考题，三个方法要能脱口而出：

 - 最大步数限制——通常设 15 步，超过就强制终止
 - 重复动作检测——连续 3 次调用同一个工具且参数相同，直接退出循环
 - 超时控制——整个任务设置最大执行时间
 class ReActAgent:
    def run(self, task, max_steps=15):
        steps = 0
        seen_actions = []

        while steps &lt; max_steps:
            thought, action = self.llm_think(task, history)

            if steps &gt;= max_steps:
                return &quot;达到最大步数限制，任务终止&quot;

            if action in seen_actions[-3:]:  # 连续3次相同动作
                return self.llm_summarize(&quot;工具持续失败，基于已有信息给出答案&quot;)

            seen_actions.append(action)
            observation = self.execute(action)
            steps += 1
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

### 模式二：Plan-and-Execute（先规划再执行）

 ReAct 的问题是每一步都要重新思考全局，Token 消耗太大。Plan-and-Execute 的思路是：先把计划想清楚，再按计划逐步执行，省去每步的重复推理。

 两阶段工作：第一阶段，Planner LLM 一次性生成完整计划（比如&quot;搜集竞品列表 → 逐个分析功能 → 对比价格策略 → 分析用户评价 → 生成对比报告&quot;）；第二阶段，Executor 按计划逐步执行，每步只需完成当前任务，不用重新思考全局。

 

 Token 消耗对比：ReAct 每步都思考全局，消耗 100%；Plan-and-Execute 规划一次执行省力，消耗约 20%。

 但有个问题：执行过程中发现计划不合理怎么办？比如计划了 5 个竞品，结果搜出来 50 个。解决方案是加入重新规划检查点——执行完某步后检查，如果发现和预期偏差大，触发重新规划，更新后续步骤。

 

### 模式三：Reflection（自我反思）

 Reflection 的思路是：让一个 Agent 生成，另一个 Agent 审查，循环迭代直到质量达标。

 

 用代码 Review 类比最容易理解：Writer Agent 生成代码 → Reviewer Agent 发现问题（安全漏洞、性能问题）→ Writer Agent 修改 → Reviewer Agent 确认通过 → 最终输出。

 适用场景：代码生成、法律文书、学术论文、创意写作——这些场景对输出质量要求高，值得多花 Token 反复打磨。

 面试加分：Reflection 也可以用于自我校正幻觉。当 Agent 发现自己给出的事实存疑时，可以触发&quot;验证反思&quot;，调用搜索工具去核实，而不是盲目输出。这个点说出来，面试官会觉得你理解得比较深。

 

### 模式四：Multi-Agent（多智能体协作）

 

 多个专业 Agent 协作完成复杂任务：Orchestrator（协调 Agent）负责理解需求、分配任务、汇总结果，下面挂 Research Agent（搜集资料、分析数据）、Coder Agent（写代码、跑测试）、Reviewer Agent（代码审查、安全检查）等。

 主流框架对比：

 框架 特点 LangGraph 图结构编排，状态机模型，精细控制 CrewAI 角色化 Agent，任务分工，上手简单 OpenAI SDK 官方推出，handoff 机制，工具调用原生支持 AutoGen 微软出品，对话式多 Agent，研究型友好 Anthropic 的提醒，面试时要提到：不要过早引入 Multi-Agent。一个强大的单 Agent 往往比多个简单 Agent 协作更稳定、更省钱。只有任务明确需要并行处理或专业分工时，才引入多 Agent。盲目上多 Agent，调试地狱等着你。