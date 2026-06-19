---
title: 4. Function Call 是什么？底层怎么实现？
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [Agent, 卡码笔记]
point: 4. Function Call 是什么？底层怎么实现？
source: 卡码笔记
sourceUrl: https://notes.kamacoder.com/interview/llm/agent_interview.html

> 来源文章：Agent大厂面试题汇总：ReAct、Function Calling、MCP、RAG高频问题

---

**题目**：4. Function Call 是什么？底层怎么实现？

**结论句（15 秒）**：面试官会问：&quot;Function Call 和普通的 Prompt + 正则解析有什么区别

**追问方向**：结合项目经历举例 · 优缺点与工程取舍

### 回答

面试官会问：&quot;Function Call 和普通的 Prompt + 正则解析有什么区别？&quot;以及&quot;LLM 自己执行 Function Call 吗？&quot;还有&quot;如果同时触发多个 Function Call 怎么处理？&quot;

 

### Function Call 是什么？

 Function Call 是让 LLM 输出结构化的工具调用指令，而非普通文本，再由应用程序实际执行。

 关键认知：LLM 自己并不执行函数！ 它只告诉你&quot;我想调用什么函数、传什么参数&quot;，真正执行的是你的代码。

 

 

### Function Call 四步流程

 Step 1：定义工具——告诉 LLM 有哪些工具可用

 {
  &quot;tools&quot;: [
    {
      &quot;type&quot;: &quot;function&quot;,
      &quot;function&quot;: {
        &quot;name&quot;: &quot;get_weather&quot;,
        &quot;description&quot;: &quot;获取指定城市的实时天气信息&quot;,
        &quot;parameters&quot;: {
          &quot;type&quot;: &quot;object&quot;,
          &quot;properties&quot;: {
            &quot;city&quot;: {
              &quot;type&quot;: &quot;string&quot;,
              &quot;description&quot;: &quot;城市名称，如：北京、上海&quot;
            },
            &quot;date&quot;: {
              &quot;type&quot;: &quot;string&quot;,
              &quot;description&quot;: &quot;日期，格式 YYYY-MM-DD，不填则为今天&quot;
            }
          },
          &quot;required&quot;: [&quot;city&quot;]
        }
      }
    }
  ]
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
23
24
25
Step 2：LLM 判断并生成调用指令——LLM 的输出不是文本，是结构化 JSON

 {
  &quot;tool_calls&quot;: [
    {
      &quot;id&quot;: &quot;call_abc123&quot;,
      &quot;type&quot;: &quot;function&quot;,
      &quot;function&quot;: {
        &quot;name&quot;: &quot;get_weather&quot;,
        &quot;arguments&quot;: &quot;{\&quot;city\&quot;: \&quot;北京\&quot;, \&quot;date\&quot;: \&quot;2025-04-11\&quot;}&quot;
      }
    }
  ]
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
Step 3：你的代码解析执行

 def handle_tool_calls(tool_calls):
    results = []
    for call in tool_calls:
        func_name = call.function.name
        args = json.loads(call.function.arguments)

        if func_name == &quot;get_weather&quot;:
            result = weather_api.get(args[&quot;city&quot;], args.get(&quot;date&quot;))
        elif func_name == &quot;search_calendar&quot;:
            result = calendar_api.search(args[&quot;query&quot;])

        results.append({
            &quot;tool_call_id&quot;: call.id,
            &quot;role&quot;: &quot;tool&quot;,
            &quot;content&quot;: json.dumps(result)
        })
    return results
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
Step 4：把结果传回 LLM，生成最终回答

 messages.append({&quot;role&quot;: &quot;assistant&quot;, &quot;tool_calls&quot;: tool_calls})
messages.extend(tool_results)

final_response = client.chat.completions.create(
    model=&quot;gpt-4o&quot;,
    messages=messages
)
 1
2
3
4
5
6
7

### Parallel Function Call（并行调用）

 GPT-4o 和 Claude 3.5+ 都支持一次返回多个工具调用，可以并行执行：

 {
  &quot;tool_calls&quot;: [
    {&quot;id&quot;: &quot;call_1&quot;, &quot;function&quot;: {&quot;name&quot;: &quot;get_weather&quot;, &quot;arguments&quot;: &quot;{\&quot;city\&quot;:\&quot;北京\&quot;}&quot;}},
    {&quot;id&quot;: &quot;call_2&quot;, &quot;function&quot;: {&quot;name&quot;: &quot;search_calendar&quot;, &quot;arguments&quot;: &quot;{\&quot;date\&quot;:\&quot;明天\&quot;}&quot;}},
    {&quot;id&quot;: &quot;call_3&quot;, &quot;function&quot;: {&quot;name&quot;: &quot;get_traffic&quot;, &quot;arguments&quot;: &quot;{\&quot;route\&quot;:\&quot;上班路线\&quot;}&quot;}}
  ]
}
 1
2
3
4
5
6
7
串行执行：T = T1 + T2 + T3；并行执行：T = max(T1, T2, T3)，延迟大幅降低。

 

### 各厂商格式对比

  OpenAI Anthropic Claude 工具定义 tools + function tools + input_schema 调用输出 tool_calls 数组 tool_use content block 结果传回 role: &quot;tool&quot; role: &quot;user&quot; + tool_result content block 面试核心点：LLM 不执行函数，只输出&quot;我想调用什么&quot;的指令。真正执行的是你的应用程序。这个设计保证了安全性——LLM 无法绕过你的代码直接操作系统。