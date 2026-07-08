---
title: 04 · 工具调用
titleTemplate: false
pageClass: guides-doc
outline: [2, 3]
aside: true
---

<p class="guide-chapter-badge">04 · 工具调用</p>

> 工具是 Agent 的「手和脚」。Function Calling 让模型输出结构化参数；MCP 把工具标准化。
> 
> 安全三板斧：白名单、鉴权、参数校验。工具描述（Schema）写得好不好，直接决定模型会不会选错工具。

04 工具调用（Tool / Function Calling）

  面向初学者的 AI Agent「工具调用」面试八股文：从 Function Calling、Tool 设计，到
  MCP、路由与编排，再到安全与常见实现。
  每个知识点尽量包含：概念解释、原理详解、面试 Q&A、追问应对、Python 代码示例。

#### 1. Function Calling 基础

#### 2. Tool Use / Tool Calling

#### 3. MCP 协议（Model Context Protocol）

#### 4. 工具路由（Tool Routing）

#### 5. 工具编排（Tool Orchestration）

#### 6. 安全性

#### 7. 常见工具实现

#### 8. 综合面试题精选（≥15 题）

## 1. Function Calling 基础

### 1.1 什么是 Function Calling

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>读「什么是 Function Calling」时抓住一个关键词，联想你的项目或「假如做企业客服 Agent」场景。</p><p>想不出项目经历很正常——用假设场景把流程串起来，同样能答得漂亮。</p></div>

概念解释
Function Calling（函数调用）指：大语言模型在生成回复时，不是直接输出最终答案，而是先输
出「要调用哪个外部函数、用什么参数」的结构化指令；宿主程序（你的 Python 服务）真正执行
该函数，再把结果喂回模型，形成多轮对话闭环。这样模型可以查实时数据、算复杂表达式、操作
数据库等，突破「仅靠训练记忆回答」的限制。
原理详解

  从接口角度：多数厂商把「可调用的函数列表」和「用户问题」一起发给模型；模型在概率分
  布上被训练/对齐为：在合适时输出 tool_calls（或等价字段），而不是胡编乱造函数结果。
  从安全角度：模型不直接执行代码，执行权在应用层，便于鉴权、审计、限流。
  与「纯文本里写 call foo(1,2) 」的区别：Function Calling 使用 机器可解析 的 JSON/结
  构化格式，便于框架自动解析与校验。

### 1.2 OpenAI Function Calling 的工作原理

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「OpenAI Function Calling 的工作原理」按「输入 → 处理 → 输出 → 失败怎么办」四步理解。</p><p>每看到一个组件，顺手想：它挂了/agent 走偏了，系统怎么兜底？这会让你的回答立刻有工程感。</p></div>

概念解释
以 OpenAI Chat Completions 为例：你在请求里提供 tools （函数元数据数组）和
 tool_choice （可选，控制是否必须调用工具）；模型返回的 message 里可能带有
 tool_calls ，每一项包含 id 、 function.name 、 function.arguments （JSON 字符串）。
你的代码解析后执行本地函数，再以 role=tool 的消息把结果追加到对话里，再次请求模型生
成面向用户的自然语言答案。
原理详解
#### 1. 首轮： system + user + tools → 模型可能返回 assistant + tool_calls 。

#### 2. 执行：应用根据 name 路由到 Python 函数， arguments 反序列化后调用。

#### 3. 次轮：把每条工具结果作为 tool 消息（带 tool_call_id ）写回，再请求 → 模型综合工

   具输出作答。
#### 4. 并行：若模型一次返回多个 tool_calls ，可并行执行（注意线程安全与副作用）。

#### 5. 流式：流式响应里 tool_calls 可能分片到达，需要增量拼接 arguments 。

面试 Q1：OpenAI 的 Function Calling 大致流程是什么？
标准答案（A）：客户端把工具定义（名称、描述、参数 JSON Schema）随对话发给 API；模型在
需要时返回 tool_calls ；宿主解析并执行真实函数；将结果以 tool 角色消息写回并再次调
用 API；直到模型不再请求工具或达到轮次上限。核心是「模型只负责决策与参数，执行在应用
侧」。
追问应对
   问： tool_choice 有什么用？
   答： auto 由模型决定； none 禁止工具； required 强制至少调用一次；也可指定某个
   function 强制调用。用于调试、合规场景（必须走某工具）或 A/B。

 问：和 RAG 的关系？
 答：RAG 是「检索再生成」；Function Calling 是「模型选择动作」。常组合：检索用工具或向
 量库，生成阶段再决定是否调用计算器/数据库。

### 1.3 函数定义（JSON Schema）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>读「函数定义」时抓住一个关键词，联想你的项目或「假如做企业客服 Agent」场景。</p><p>想不出项目经历很正常——用假设场景把流程串起来，同样能答得漂亮。</p></div>

概念解释
每个可调用函数在 API 里通常描述为： type: function ， function.name （唯一标识），
 function.description （给模型看的自然语言说明）， function.parameters （符合 JSON
Schema 的对象，描述参数类型、是否必填、枚举等）。
原理详解
   JSON Schema 让运行时可以做校验（ jsonschema 库），也让模型有明确字段名与类型提
   示。
   建议： description 写清「何时调用、不何时调用」；对模糊词（如「最近」）在描述里约定
   格式（如 ISO 日期）。
   复杂结构可用 object 、 array 、 enum 、 oneOf 等；但过于复杂的 Schema 可能增加模
   型填错概率，可适当拆分多个小函数。
面试 Q2：为什么用 JSON Schema 描述参数？
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>三方面——（1）跨语言标准，各 SDK 统一；（2）可自动校验，避免脏参数进业务；（3）作为模型「字段说明」，减少胡编参数名。缺点是 Schema 过长会占 token，需要精简描述或工具路由。追问应对问：必填字段怎么表示？答：在 JSON Schema 里用 required: ["a","b"] ，同时 properties 里声明各字段type 。OpenAI 工具格式与 JSON Schema Draft 兼容（具体以厂商文档为准）。</p>
</div></div>
### 1.4 模型如何决定调用哪个函数

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>读「模型如何决定调用哪个函数」时抓住一个关键词，联想你的项目或「假如做企业客服 Agent」场景。</p><p>想不出项目经历很正常——用假设场景把流程串起来，同样能答得漂亮。</p></div>

概念解释
模型并非运行「真正的 if-else 规则引擎」，而是基于训练与对齐后，在看到用户意图 + 工具描述
时，输出概率最高的结构化动作。等价于：在「续写」空间里，工具描述把某些 token 序列（函
数名、JSON 参数）的概率抬高。
原理详解
  描述质量决定区分度：两个工具功能重叠时，模型容易混淆。
  用户表述触发关键词与语义：例如「明天天气」更可能触发 get_weather 。
  系统提示可约束：「涉及计算必须用 calculate 」。
  部分实现会做两阶段：先小模型/分类器选工具，再大模型填参（见「工具路由」）。
面试 Q3：模型选错工具怎么办？
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>工程上（1）优化 description 与示例边界；（2）工具路由缩小候选集；（3）执行前做规则校验或二次确认；（4）对高风险操作要求人类确认；（5）记录 bad case 做 prompt 迭代。不能假设模型 100% 正确。</p>
</div></div>
### 1.5 参数提取与验证

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>读「参数提取与验证」时抓住一个关键词，联想你的项目或「假如做企业客服 Agent」场景。</p><p>想不出项目经历很正常——用假设场景把流程串起来，同样能答得漂亮。</p></div>

概念解释
参数提取：从 tool_calls[].function.arguments 得到 JSON 字符串并 json.loads 。验
证：用 JSON Schema 校验类型、范围、枚举；业务层再校验权限与资源是否存在。
原理详解
   模型可能输出不完整 JSON（流式）或多余字段（若你未禁止）；需在服务端
   additionalProperties: false （若支持）并剥离未知键。

   对数字、日期做规范化（时区）。
   失败策略：返回错误信息给模型「请重试」或降级为只读工具。
面试 Q4：如何做参数校验？
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>分层——语法层 json.loads ；结构层 jsonschema.validate ；语义层业务函数（如用户ID 是否存在）；安全层鉴权与输入清洗（见第 6 节）。</p>
</div></div>
### 1.6 完整代码示例（OpenAI API 调用）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>代码示例的目标不是背语法，而是理解：循环怎么转、状态存哪、停止条件是什么、工具 Schema 长什么样。</p><p>面试时说清输入/输出/停止条件即可；若被追问，能指出「哪一行是 Observation 写回上下文」。</p></div>

下面示例使用 OpenAI 官方 Python SDK 风格（需安装 openai ，并设置环境变量
OPENAI_API_KEY ）。为便于阅读，省略生产级重试与日志。

```python
 import json
 from typing import Any

 from jsonschema import validate, ValidationError
 from openai import OpenAI

 #   工具             （
       JSON Schema parameters  ）
 WEATHER_PARAMS = {
      "type": "object",
      "properties": {
                                                    城市名，中文或英文"},
          "city": {"type": "string", "description": "
                                                    日期 YYYY-MM-DD"},
          "date": {"type": "string", "description": "
      },
      "required": ["city"],
      "additionalProperties": False,
 }

 TOOLS = [
      {
          "type": "function",
          "function": {
              "name": "get_weather",
              "description": "查询指定城市在某日期的天气。用户只说「今天」时，请换算为
 具体日期再调用。",
               "parameters": WEATHER_PARAMS,
          },
      }
 ]

 #   假实现：真实项目里对接      HTTP API
 def get_weather(city: str, date: str | None = None) -> dict[str, Any]:
                                                                  晴
     return {"city": city, "date": date or "today", "condition": " ",
 "temp_c": 22}

 def run_tool(name: str, arguments: str) -> str:

     args = json.loads(arguments or "{}")
     validate(instance=args, schema=WEATHER_PARAMS)    #   与 TOOLS 中一致
     if name == "get_weather":
         return json.dumps(get_weather(**args), ensure_ascii=False)
     raise ValueError(f"unknown tool: {name}")

def chat_with_tools(user_message: str) -> str:
      client = OpenAI()
      messages: list[dict[str, Any]] = [
          {"role": "system", "content": "    你是助手，需要数据时调用工具，不要编造天
气。   "},
          {"role": "user", "content": user_message},
     ]

     for _ in range(5): #  防止死循环
         resp = client.chat.completions.create(
             model="gpt-4o-mini",
             messages=messages,
             tools=TOOLS,
             tool_choice="auto",
         )
         msg = resp.choices[0].message
         messages.append(msg.model_dump())

         if not msg.tool_calls:
             return msg.content or ""

         for tc in msg.tool_calls:
             try:
                  result = run_tool(tc.function.name, tc.function.arguments)
             except (json.JSONDecodeError, ValidationError, ValueError) as
e:
                 result = json.dumps({"error": str(e)}, ensure_ascii=False)
             messages.append(
                 {
                     "role": "tool",
                     "tool_call_id": tc.id,
                     "content": result,
                 }

                )
            超过最大工具调用轮次"
     return "

 if __name__ == "__main__":
                           北京明天天气怎么样？"))
     print(chat_with_tools("

追问应对
 问：为什么要循环 for _ in range(5) ？
 答：多轮工具调用（先查列表再查详情）需要多次 API；上限防止逻辑错误导致无限循环。
 问： tool_call_id 作用？
 答：把工具结果与某次 tool_calls 中的条目一一对应，支持并行多个调用。

```

## 2. Tool Use / Tool Calling

### 2.1 Tool 的定义与注册

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>读「Tool 的定义与注册」时抓住一个关键词，联想你的项目或「假如做企业客服 Agent」场景。</p><p>想不出项目经历很正常——用假设场景把流程串起来，同样能答得漂亮。</p></div>

概念解释
在应用内部，「Tool」= 可执行能力单元：名称、描述、参数规范、处理函数。注册指在 Agent 启
动时把工具对象加入注册表（字典或列表），运行时由路由器/模型选择并派发。
原理详解
  注册表常见结构： name -> callable 或 List[BaseTool] 。
  与纯 Function Calling 映射：把同一套元数据转成各厂商 API 需要的 tools 格式（适配
  层）。
面试 Q5：Tool 与业务里的普通 Python 函数有何不同？
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>Tool 多了面向模型的元数据（描述、Schema）和统一执行接口（记录日志、超时、权限）。业务函数关注领域逻辑；Tool 是 Agent 可调度的「外壳」。</p>
</div></div>
### 2.2 工具描述的最佳实践

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>读「工具描述的最佳实践」时抓住一个关键词，联想你的项目或「假如做企业客服 Agent」场景。</p><p>想不出项目经历很正常——用假设场景把流程串起来，同样能答得漂亮。</p></div>

概念解释
         是模型判断是否调用、如何填参的主要依据。应写：功能一句话、何时用、何时不
description
要用、参数含义与格式、返回值语义（若影响后续推理）。
原理详解
 避免两个工具描述语义重叠；重叠时加「优先使用 A 当…，否则 B」。
 对易混参数（如 user_id vs email ）举例说明。
 英文或中文与模型服务语言一致可减少混淆。
追问应对
 问：描述太长怎么办？
 答：分层——核心描述保持短；细节放 parameter.description ；超大工具集用路由先筛选
 （见第 4 节）。

### 2.3 工具参数设计

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>读「工具参数设计」时抓住一个关键词，联想你的项目或「假如做企业客服 Agent」场景。</p><p>想不出项目经历很正常——用假设场景把流程串起来，同样能答得漂亮。</p></div>

概念解释
参数宜少而精、类型明确；能用枚举就不用自由文本；日期时间统一 ISO 8601；避免「万能字符
串」承载多种含义。
原理详解
 多参数强依赖时，可拆成链式多个工具，降低单次 JSON 复杂度。
 对可选参数默认值在 Schema 或文档中写清。

### 2.4 工具返回值处理

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>读「工具返回值处理」时抓住一个关键词，联想你的项目或「假如做企业客服 Agent」场景。</p><p>想不出项目经历很正常——用假设场景把流程串起来，同样能答得漂亮。</p></div>

概念解释
工具返回值会作为 tool 消息内容进入上下文。应稳定、可解析：优先 JSON 字符串；错误用统
一结构 { "error": "..." } ，便于模型纠错。
原理详解
 超大结果需摘要或分页（再提供 fetch_more 工具），避免撑爆上下文。
  二进制内容应转为文本描述或 URL，不要直接塞原始字节。
面试 Q6：工具返回 10MB 日志怎么办？
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>不应直接返回。应（1）截断 + 摘要；（2）写入对象存储返回链接；（3）提供 grep_in_log等缩小工具；（4）向量索引仅检索相关片段。</p>
</div></div>
### 2.5 错误处理与重试

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>读「错误处理与重试」时抓住一个关键词，联想你的项目或「假如做企业客服 Agent」场景。</p><p>想不出项目经历很正常——用假设场景把流程串起来，同样能答得漂亮。</p></div>

概念解释
网络与模型都可能失败。策略包括：可重试错误（429、5xx）指数退避；不可重试（4xx 参数错）
把错误给模型；工具内部超时；熔断防止拖垮依赖。
原理详解
 幂等：重试前确认接口幂等或使用去重键。
 部分成功：多工具并行时，单个子失败可只重试该分支。

### 2.6 LangChain 中的 Tool 定义代码示例

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>代码示例的目标不是背语法，而是理解：循环怎么转、状态存哪、停止条件是什么、工具 Schema 长什么样。</p><p>面试时说清输入/输出/停止条件即可；若被追问，能指出「哪一行是 Observation 写回上下文」。</p></div>

以下使用 LangChain 1.x 风格（ langchain-core 的 @tool ；版本差异请以官方文档为准）。
若你环境版本不同，可改为 StructuredTool.from_function 。
```python
 from typing import Literal

 from langchain_core.tools import tool

 @tool
 def search_product(
     query: str,
     category: Literal["book", "electronics", ""] = "",
 ) -> str:
       在电商站内搜索商品。用户要找商品、比价、看库存时用；不要用于闲聊。
     """

     Args:

           query:搜索关键词
                   可选类目过滤，不知道则留空
           category:
     """
     # 伪实现
     return f"[dummy] results for {query!r} in {category or 'all'}"

 # 注册到 Agent 时通常传入 tools=[search_product]
 # 例如 create_react_agent(llm, tools=[search_product], ...)

追问应对
 问： @tool 和手写 StructuredTool 区别？
 答： @tool 从 docstring 推断描述与参数，开发快；复杂 Schema 或需自定义校验时用
  StructuredTool 更可控。

```

## 3. MCP 协议（Model Context Protocol）

### 3.1 MCP 是什么

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>读「MCP 是什么」时抓住一个关键词，联想你的项目或「假如做企业客服 Agent」场景。</p><p>想不出项目经历很正常——用假设场景把流程串起来，同样能答得漂亮。</p></div>

概念解释
MCP（Model Context Protocol）是由 Anthropic 推动的开放标准，用于在 AI 应用（Host） 与
外部数据源/工具（MCP Server） 之间建立统一、可插拔的通信方式。可理解为「AI 侧的 USB-
C」：一次实现 Server，多个客户端（Claude Desktop、IDE、自研 Agent）可复用。
原理详解
  协议定义了能力发现、资源读取、工具调用、提示模板等消息格式与生命周期。
  目标：把「每个产品各写一套插件」变成「标准协议 + 多实现」。

### 3.2 核心组件：Client、Server、Transport

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>读「核心组件：Client、Server、Transport」时抓住一个关键词，联想你的项目或「假如做企业客服 Agent」场景。</p><p>想不出项目经历很正常——用假设场景把流程串起来，同样能答得漂亮。</p></div>

概念解释

  MCP Server：暴露工具/资源/提示的实现进程（如连接 GitHub、数据库）。
  MCP Client：运行在 Host 内，与 Server 建立会话，转发模型侧请求与结果。
  Transport：传输层，常见 stdio（子进程标准输入输出）、HTTP/SSE 等。
原理详解
  stdio 适合本地子进程；HTTP 适合远程服务。
  Client 负责能力协商、把 Server 工具映射为模型可用的工具列表（与 Function Calling 衔
  接）。
面试 Q7：MCP 里 Client 和你在 OpenAI 里写的「执行工具的 Python 代码」是什么关系？
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>OpenAI 场景下你手写 run_tool ；MCP 下 Client 把远端/子进程 Server 的工具列表拉平，调用时按协议发 RPC，结果再转成 tool 消息。你仍要写 Host 逻辑，但工具实现可独立进程、独立语言。</p>
</div></div>
### 3.3 MCP vs Function Calling 的区别

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>读「MCP vs Function Calling 的区别」时抓住一个关键词，联想你的项目或「假如做企业客服 Agent」场景。</p><p>想不出项目经历很正常——用假设场景把流程串起来，同样能答得漂亮。</p></div>

| 维度 | Function Calling | MCP |
| --- | --- | --- |
| 层级 | 多为「单次 API 能力」：模型输出调用指令 | 系统级协议：如何发现与调用工具、资源 |
| 实现位 | 通常在应用进程内函数 | 常在独立Server，可远程置 |
| 复用 | 每个应用复制粘贴集成 | 标准 Server 多 Host 复用 |

 关系      互补：Host 常把 MCP 工具转成 FC 的
         tools 定义给模型
标准答案：Function Calling 解决「模型怎么表达调用」；MCP 解决「工具能力怎么暴露与连
接」。二者常一起出现：模型侧用 FC，工具侧来自 MCP。

### 3.4 MCP 的优势

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>读「MCP 的优势」时抓住一个关键词，联想你的项目或「假如做企业客服 Agent」场景。</p><p>想不出项目经历很正常——用假设场景把流程串起来，同样能答得漂亮。</p></div>

概念解释
 标准化：消息与能力模型统一，降低集成成本。
 可复用：同一 MCP Server 给桌面、IDE、Agent 用。
 生态：社区可共享 Server 实现；企业可内网部署私有 Server。
 隔离：工具崩溃不拖垮主进程（进程边界）。

### 3.5 MCP Server 的实现示例

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>代码示例的目标不是背语法，而是理解：循环怎么转、状态存哪、停止条件是什么、工具 Schema 长什么样。</p><p>面试时说清输入/输出/停止条件即可；若被追问，能指出「哪一行是 Observation 写回上下文」。</p></div>

以下为示意代码：真实项目请使用官方 mcp Python 包（ pip install mcp ），并以最新文档为
准。下面用常见「FastMCP」风格说明结构。
```python
 #   需要: pip install mcp
 #   以下为概念示例，包名与 API 请以官方文档为准
 try:
     from mcp.server.fastmcp import FastMCP
 except ImportError:
     FastMCP = None #     环境未安装时仅作结构说明

 if FastMCP:
     mcp = FastMCP("demo")

        @mcp.tool()
        def add(a: int, b: int) -> int:
            """ 返回两个整数之和。     """
            return a + b

        #   通常以 `mcp.run(transport="stdio")` 由 Host 拉起子进程

若未使用 FastMCP，也可用手写 Server + stdio，核心是：声明工具列表、处理 tools/call
类请求、返回结构化内容。面试中讲清「进程边界 + JSON-RPC 风格消息」即可得分。
追问应对

 问：MCP 和 OpenAPI 网关区别？
 答：OpenAPI 面向通用 HTTP 客户端；MCP 面向 AI Host 与模型工具循环，带会话、资源、
 提示等 AI 原生语义。

```

### 3.6 MCP 在企业级应用中的价值

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>读「MCP 在企业级应用中的价值」时抓住一个关键词，联想你的项目或「假如做企业客服 Agent」场景。</p><p>想不出项目经历很正常——用假设场景把流程串起来，同样能答得漂亮。</p></div>

概念解释
  治理：工具集中在 MCP Server，便于审计、版本与权限。
  复用：数据中台、工单、内部 Wiki 各做一个 Server，多产品接入。
  安全边界：敏感系统只对内网 Server 开放，模型不直连数据库。
  合规：在 Server 侧落日志与审批，比散落在每个 Agent 代码里更可控。
面试 Q8：企业为什么愿意接 MCP 而不是每个业务线自己写 Function？
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>降低重复建设、统一安全与观测、加快试点（换模型不换工具链）、利于平台组与业务组分工。</p>
</div></div>
## 4. 工具路由（Tool Routing）

### 4.1 当工具数量多时如何高效选择

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>读「当工具数量多时如何高效选择」时抓住一个关键词，联想你的项目或「假如做企业客服 Agent」场景。</p><p>想不出项目经历很正常——用假设场景把流程串起来，同样能答得漂亮。</p></div>

概念解释
工具过多时，一次性把所有 description 塞进上下文会：费 token、干扰模型、增加误选。解
决思路是先缩小候选集再让大模型填参，或用小模型专门做路由。
原理详解
 典型阈值：几十到上百个工具就要开始考虑路由（视模型与描述长度而定）。
 方法：向量检索、分类/意图模型、层级目录（先选类再选工具）、规则前缀（用户以 /db 开
 头走数据库类）。

### 4.2 基于向量检索的工具路由

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>读「基于向量检索的工具路由」时抓住一个关键词，联想你的项目或「假如做企业客服 Agent」场景。</p><p>想不出项目经历很正常——用假设场景把流程串起来，同样能答得漂亮。</p></div>

概念解释
离线：把每个工具的 name + description + 关键词 做成 embedding，存向量库。在线：用户
问题 embedding，Top-K 相似工具作为本轮唯一候选，再交给 LLM。
原理详解
 优点：实现快、可跨语种模糊匹配。
 缺点：极依赖描述质量；边界 case 需加规则或混合检索（关键词 + 向量）。

### 4.3 基于分类模型的工具路由

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>读「基于分类模型的工具路由」时抓住一个关键词，联想你的项目或「假如做企业客服 Agent」场景。</p><p>想不出项目经历很正常——用假设场景把流程串起来，同样能答得漂亮。</p></div>

概念解释
训练或提示一个轻量分类器（BERT、小 LLM、或结构化输出），输入用户句，输出工具 ID 或工
具组 ID。比全量工具更省、更稳。
原理详解
 数据：历史日志标注「正确工具」可finetune。
 与向量路由混合：分类器粗分 + 向量细分。

### 4.4 工具分组与层级

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>读「工具分组与层级」时抓住一个关键词，联想你的项目或「假如做企业客服 Agent」场景。</p><p>想不出项目经历很正常——用假设场景把流程串起来，同样能答得漂亮。</p></div>

概念解释
按域分组： database_* 、 hr_* 、 crm_* 。第一轮只暴露组级 meta-tool（如
list_hr_tools ），或让模型先选组再选具体工具。

原理详解
  层级过深会增加对话轮次，需在「token 节省」与「轮次增加」间权衡。

### 4.5 代码示例（向量路由示意）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>代码示例的目标不是背语法，而是理解：循环怎么转、状态存哪、停止条件是什么、工具 Schema 长什么样。</p><p>面试时说清输入/输出/停止条件即可；若被追问，能指出「哪一行是 Observation 写回上下文」。</p></div>

```python
from dataclasses import dataclass

#   需要: pip install numpy openai
import numpy as np
from openai import OpenAI

@dataclass
class ToolSpec:
    name: str
    description: str

def embed_texts(client: OpenAI, model: str, texts: list[str]) ->
np.ndarray:
    resp = client.embeddings.create(model=model, input=texts)
    vecs = [np.array(d.embedding, dtype=np.float32) for d in resp.data]
    mat = np.stack(vecs, axis=0)
     norms = np.linalg.norm(mat, axis=1, keepdims=True) + 1e-8
     return mat / norms

def route_tools(
     query: str,
     tools: list[ToolSpec],
     client: OpenAI,
     embed_model: str = "text-embedding-3-small",
     top_k: int = 3,
) -> list[ToolSpec]:
    corpus = [f"{t.name}\n{t.description}" for t in tools]
    doc_emb = embed_texts(client, embed_model, corpus)
    q_emb = embed_texts(client, embed_model, [query])[0]
     scores = doc_emb @ q_emb
     idx = np.argsort(-scores)[:top_k]
     return [tools[i] for i in idx]

#   使用：仅把 route_tools 返回的子集塞进 chat.completions 的 tools 参数

面试 Q9：向量路由选出来的工具不对怎么兜底？
A：Top-K 调大、混合关键词打分、加一层 LLM「是否适用」二分类、允许用户澄清、保留「通
用搜索」工具作后备。

```

## 5. 工具编排（Tool Orchestration）

### 5.1 串行工具调用

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>读「串行工具调用」时抓住一个关键词，联想你的项目或「假如做企业客服 Agent」场景。</p><p>想不出项目经历很正常——用假设场景把流程串起来，同样能答得漂亮。</p></div>

概念解释
后一步依赖前一步输出，例如：先 lookup_user_id 再 get_orders(user_id) 。实现上必须
等前一个 tool 消息返回后再发起下一轮模型请求（或在同轮若模型一次输出多个有依赖的调
用，需谨慎，通常仍按顺序执行）。
原理详解
 在图工作流里体现为有向边；LangGraph、Temporal 等可显式建模。

### 5.2 并行工具调用

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>读「并行工具调用」时抓住一个关键词，联想你的项目或「假如做企业客服 Agent」场景。</p><p>想不出项目经历很正常——用假设场景把流程串起来，同样能答得漂亮。</p></div>

概念解释
无相互依赖的多个查询（查天气 + 查股价）可并行 HTTP，缩短延迟。OpenAI 可能在一次
assistant 消息返回多个 tool_calls 。

原理详解
  注意速率限制与连接池；写操作并行可能导致竞态，需业务锁或串行。

### 5.3 工具链（Tool Chain）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>读「工具链」时抓住一个关键词，联想你的项目或「假如做企业客服 Agent」场景。</p><p>想不出项目经历很正常——用假设场景把流程串起来，同样能答得漂亮。</p></div>

概念解释
把多个工具按固定或动态顺序组合成复合流程，如「检索 → 摘要 → 存储」。可以是代码写死的
Pipeline，也可以是 LLM 每步决定下一步（ReAct / Agent）。

原理详解
 静态链：适合稳定 SOP；动态链：适合开放域任务，但要防循环与成本失控。

### 5.4 条件工具调用

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>读「条件工具调用」时抓住一个关键词，联想你的项目或「假如做企业客服 Agent」场景。</p><p>想不出项目经历很正常——用假设场景把流程串起来，同样能答得漂亮。</p></div>

概念解释
根据中间结果分支：仅当 risk_score > 0.8 才调用 human_review 。可用规则引擎、小模型
分类、或让主模型输出结构化「分支字段」（需校验）。

### 5.5 工具调用的依赖管理

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>读「工具调用的依赖管理」时抓住一个关键词，联想你的项目或「假如做企业客服 Agent」场景。</p><p>想不出项目经历很正常——用假设场景把流程串起来，同样能答得漂亮。</p></div>

概念解释
显式维护 DAG：节点是工具调用，边是数据依赖。调度器拓扑排序执行；检测环；失败时重试或
补偿。
原理详解
  对长事务用 Saga 或幂等重试；对 AI 步骤用「检查点」持久化状态。
面试 Q10：并行与串行如何取舍？
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>读多且无依赖并行；有写冲突、强一致、或后一步参数必须来自上一步精确字段时串行；可并行读再串行写（Quorum 读/写视业务而定）。</p>
</div></div>
### 5.6 代码示例（简单编排：先路由再并行）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>代码示例的目标不是背语法，而是理解：循环怎么转、状态存哪、停止条件是什么、工具 Schema 长什么样。</p><p>面试时说清输入/输出/停止条件即可；若被追问，能指出「哪一行是 Observation 写回上下文」。</p></div>

```python
 import concurrent.futures
 import json
 from typing import Any, Callable

 ToolFn = Callable[..., Any]

def safe_call(name: str, fn: ToolFn, kwargs: dict[str, Any]) -> dict[str,
Any]:
    try:
        return {"tool": name, "ok": True, "result": fn(**kwargs)}
    except Exception as e:
        return {"tool": name, "ok": False, "error": str(e)}

def run_parallel_tools(
    calls: list[tuple[str, ToolFn, dict[str, Any]]],
) -> list[dict[str, Any]]:
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:
        futs = [ex.submit(safe_call, n, f, k) for n, f, k in calls]
        return [f.result() for f in futs]

#例：先串行拿      user_id ，再并行查订单与积分（伪函数）
def lookup_user_id(email: str) -> str:
    return "u_123"

def fetch_orders(uid: str) -> list:
    return [{"id": 1}]

def fetch_points(uid: str) -> int:
    return 42

def orchestrate(user_email: str) -> str:
    uid = lookup_user_id(user_email)
    second = run_parallel_tools(
        [
            ("orders", fetch_orders, {"uid": uid}),
            ("points", fetch_points, {"uid": uid}),
        ]
    )
    return json.dumps(second, ensure_ascii=False)

6. 安全性
```

### 6.1 工具调用的权限控制

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>读「工具调用的权限控制」时抓住一个关键词，联想你的项目或「假如做企业客服 Agent」场景。</p><p>想不出项目经历很正常——用假设场景把流程串起来，同样能答得漂亮。</p></div>

概念解释
模型本身没有用户身份，必须在服务端把「当前会话用户」与角色/权限绑定，执行工具前检查：
是否可读该表、是否可操作该租户。
原理详解
 禁止把服务账号密钥交给模型侧推理环境。
 使用用户 OAuth token 或后端代持且按最小权限。

### 6.2 输入验证与清洗

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>读「输入验证与清洗」时抓住一个关键词，联想你的项目或「假如做企业客服 Agent」场景。</p><p>想不出项目经历很正常——用假设场景把流程串起来，同样能答得漂亮。</p></div>

概念解释
防 Prompt 注入 诱导工具执行越权参数；防 SQL 注入、路径穿越（ ../../etc/passwd ）。对所
有进入工具的字符串做白名单、参数化查询、chroot/沙箱。

### 6.3 敏感操作确认

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>读「敏感操作确认」时抓住一个关键词，联想你的项目或「假如做企业客服 Agent」场景。</p><p>想不出项目经历很正常——用假设场景把流程串起来，同样能答得漂亮。</p></div>

概念解释
删除、转账、对外发邮件等，需 人在回路（HITL） 或二次令牌；或把工具设计为「创建草稿」而
非「直接发送」。

### 6.4 调用频率限制

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>读「调用频率限制」时抓住一个关键词，联想你的项目或「假如做企业客服 Agent」场景。</p><p>想不出项目经历很正常——用假设场景把流程串起来，同样能答得漂亮。</p></div>

概念解释
按用户/IP/工具维度 rate limit，防刷与成本失控；指数退避应对 429。

### 6.5 审计日志

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>读「审计日志」时抓住一个关键词，联想你的项目或「假如做企业客服 Agent」场景。</p><p>想不出项目经历很正常——用假设场景把流程串起来，同样能答得漂亮。</p></div>

概念解释
记录：时间、用户、工具名、参数摘要、结果状态、模型请求 ID。用于合规与事后追溯。
面试 Q11：如何防止模型通过工具泄露敏感数据？
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>最小权限、结果脱敏（掩码）、行级权限、禁止把密钥放进工具返回值、敏感字段仅后端可见且不出现在模型上下文。</p>
</div></div>
## 7. 常见工具实现

### 7.1 搜索工具（Web Search）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>读「搜索工具」时抓住一个关键词，联想你的项目或「假如做企业客服 Agent」场景。</p><p>想不出项目经历很正常——用假设场景把流程串起来，同样能答得漂亮。</p></div>

概念解释
封装搜索引擎 API（Bing、SerpAPI、自建爬虫需合规）。返回摘要与链接，避免整页 HTML 直接
进入上下文。
Python 示意
```python
 import os
 import urllib.parse
 import urllib.request

 def web_search(query: str, max_results: int = 5) -> list[dict]:
     """ 占位：真实环境使用官方搜索         API并处理分页。     """
     q = urllib.parse.quote(query)
     url = f"https://duckduckgo.com/html/?q={q}" # 示例仅作结构说明，生产请用合
 规 API
     req = urllib.request.Request(url, headers={"User-Agent":
 "AgentBot/1.0"})
     with urllib.request.urlopen(req, timeout=10) as resp:
         html = resp.read(200_000)

     return [{"title": "stub", "snippet":
 html[:200].decode(errors="ignore"), "url": url}]

```

### 7.2 数据库查询工具

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>读「数据库查询工具」时抓住一个关键词，联想你的项目或「假如做企业客服 Agent」场景。</p><p>想不出项目经历很正常——用假设场景把流程串起来，同样能答得漂亮。</p></div>

概念解释
永远参数化查询，禁止字符串拼接 SQL。最好只允许只读账号 + 白名单表 + 行级权限。
```python
 def query_user_orders(conn, user_id: str, limit: int = 20) -> list:
     sql = "SELECT id, amount, created_at FROM orders WHERE user_id = %s
 ORDER BY created_at DESC LIMIT %s"
     with conn.cursor() as cur:
         cur.execute(sql, (user_id, limit))
         return list(cur.fetchall())

```

### 7.3 API 调用工具

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>读「API 调用工具」时抓住一个关键词，联想你的项目或「假如做企业客服 Agent」场景。</p><p>想不出项目经历很正常——用假设场景把流程串起来，同样能答得漂亮。</p></div>

概念解释
对内部 REST 封装： GET/POST 、超时、重试、鉴权头从服务端保险柜取，不让模型看见
token。

### 7.4 代码执行工具

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>代码示例的目标不是背语法，而是理解：循环怎么转、状态存哪、停止条件是什么、工具 Schema 长什么样。</p><p>面试时说清输入/输出/停止条件即可；若被追问，能指出「哪一行是 Observation 写回上下文」。</p></div>

概念解释
高风险：必须在沙箱（Docker、gVisor、WASM）中执行，限制 CPU/内存/网络，禁用危险模
块；默认应关闭或仅对内网。

### 7.5 文件操作工具

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>读「文件操作工具」时抓住一个关键词，联想你的项目或「假如做企业客服 Agent」场景。</p><p>想不出项目经历很正常——用假设场景把流程串起来，同样能答得漂亮。</p></div>

概念解释
限制根目录（chroot 或路径规范化），禁止任意路径；写操作需备份或 diff；大文件分块读。
```python
 import os

 SANDBOX_ROOT = "/var/agent_sandbox"

 def safe_read_file(path: str, max_bytes: int = 50_000) -> str:
     full = os.path.realpath(os.path.join(SANDBOX_ROOT, path))
     if not full.startswith(os.path.realpath(SANDBOX_ROOT) + os.sep):
         raise PermissionError("path escapes sandbox")
     with open(full, "rb") as f:
         return f.read(max_bytes).decode("utf-8", errors="replace")

```

### 7.6 计算器工具

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>读「计算器工具」时抓住一个关键词，联想你的项目或「假如做企业客服 Agent」场景。</p><p>想不出项目经历很正常——用假设场景把流程串起来，同样能答得漂亮。</p></div>

概念解释
对数学表达式用 AST 解析或 numexpr ，禁止 eval 任意字符串，以防代码执行。
```python
 import ast
 import operator

 _ALLOWED = {
     ast.Add: operator.add,
     ast.Sub: operator.sub,
     ast.Mult: operator.mul,
     ast.Div: operator.truediv,
     ast.USub: operator.neg,
     ast.Pow: operator.pow,
 }

 def eval_expr(node: ast.AST) -> float:

     if isinstance(node, ast.Constant) and isinstance(node.value, (int,
 float)):
          return float(node.value)
     if isinstance(node, ast.BinOp) and type(node.op) in _ALLOWED:
         return _ALLOWED[type(node.op)](eval_expr(node.left),
 eval_expr(node.right))
     if isinstance(node, ast.UnaryOp) and type(node.op) in _ALLOWED:
         return _ALLOWED[type(node.op)](eval_expr(node.operand))
     raise ValueError("unsupported expression")

 def calculator(expr: str) -> float:
     tree = ast.parse(expr, mode="eval")
     return eval_expr(tree.body)

```

#### 8. 综合面试题精选（≥15 题）

  下列题目覆盖前文各模块，便于系统复习。背诵时建议理解「为什么」，而非死记句子。

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q1</span><span class="guide-q-text">Function Calling 和「让模型输出 JSON」有什么本质区别？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>Function Calling 是厂商提供的结构化工具调用通道（字段名、类型、与对话轮次绑定）；纯JSON 输出依赖 prompt 约束，解析脆弱、易混入闲聊文本。FC 更利于多轮 tool 消息与并行调用ID 对齐。实践中也可结合：FC 负责调度，JSON 负责业务负载。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】Function Calling 是厂商提供的结构化工具调用通道（字段名、类型、与对话轮次绑定）。</p><p>【为什么考这个】对比题考「边界感」：什么场景用 A、什么场景用 B、能不能混合。背差异表不够，要说控制流在谁手里。</p><p>【拆开理解】</p><p>1. Function Calling 是厂商提供的结构化工具调用通道（字段名、类型、… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像给员工配电脑和系统账号：没有工具只能动嘴，有了工具才能查库存、下单、跑代码。</p><p>【常见误区】</p><p>1. 只说 A 好 B 不好，没有说混合方案或选型条件。</p><p>2. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】15 秒结论（谁适合什么）→ 各 30 秒说 A/B 特点 → 20 秒混合方案 → 10 秒业务例子。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Function Calling 工具设计最佳实践」（/custom/today-interview/function-calling-design） — 要点：每个工具只做一件事、参数少而精、description 包含正例和反例、error 返回结构化而非纯文本——定义好，模型才可能调对。…</p><p>· 「大模型的 Function Call 能力是怎么训练出来的？」（/custom/xiaolin-tools/fc_training） — 要点：Function Call 的能力主要靠两个训练阶段来培养，这两个阶段解决的是不同的问题…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 延伸阅读：Function Calling 工具设计最佳实践、大模型的 Function Call 能力是怎么训练出来的？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】这类对比题我会先说选型结论，再分点讲两者差异，最后说怎么混合用。</p><p>【主体】Function Calling 是厂商提供的结构化工具调用通道（字段名、类型、与对话轮次绑定）；纯 JSON 输出依赖 prompt 约束，解析脆弱、易混入闲聊文本。FC 更利于多轮 tool 消息与并行调用 ID 对齐。实践中也可结合：FC 负责调度，JSON 负责业务负载。追问：若模型不支持 FC 怎么办？——可用 JSON mode / 约束解码 / 后处理抽取；或用小模型做「动作分类」。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「Function Calling 工具设计最佳实践」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<p class="guide-followup"><span class="guide-followup-label">追问</span>若模型不支持 FC 怎么办？——可用 JSON mode / 约束解码 / 后处理抽取；或用小模型做「动作分类」。</p>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q2</span><span class="guide-q-text">描述 OpenAI 兼容接口里 tool_calls 与 tool 消息的对应关系。</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>每条 assistant.tool_calls[] 有唯一 id ；执行后每条结果作为一条 role=tool 消息，且必须带相同 tool_call_id ，保证多并行调用时不错配。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】每条 assistant.tool_calls[] 有唯一 id 。</p><p>【为什么考这个】这题在真实面试里出现频率不低，不能只背结论。</p><p>【拆开理解】</p><p>1. 每条 assistant.tool_calls[] 有唯一 id ；执行后每条结… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】可以把 Agent 想成「会自己查资料、记笔记、调系统的数字员工」，比普通 ChatBot 多了闭环和多步决策。</p><p>【常见误区】</p><p>1. 答案太短，缺少例子或数字；或者只会概念，不会落到工程实践。</p><p>【面试怎么答】结论 → 原理 → 例子 → 边界/兜底。控制在 60～90 秒，留时间给追问。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「OpenAI Assistants API vs Anthropic Claude …」（/custom/ai100-frameworks/099-assistants-api-vs-claude-sdk） — 要点：OpenAI 和 Anthropic 分别推出了官方 Agent 开发方案，代表了两种不同的设计哲学。**OpenAI Agents SDK**（2025-03 发布，**底层基于新的 Respons…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 延伸阅读：OpenAI Assistants API vs Anthropic Claude …。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我尽量用你能直接复述的结构来答，先结论后展开。</p><p>【主体】每条 assistant.tool_calls[] 有唯一 id ；执行后每条结果作为一条 role=tool 消息，且必须带相同 tool_call_id ，保证多并行调用时不错配。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「OpenAI Assistants API vs Anthropic Claude …」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q3</span><span class="guide-q-text">为什么工具 description 比函数名更重要？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>模型主要依据自然语言描述区分相似工具；函数名更多是给程序路由用。描述应写清边界与反例。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】模型主要依据自然语言描述区分相似工具。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 模型主要依据自然语言描述区分相似工具；函数名更多是给程序路由用。描述应写清边界与… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像给员工配电脑和系统账号：没有工具只能动嘴，有了工具才能查库存、下单、跑代码。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。</p><p>【主体】模型主要依据自然语言描述区分相似工具；函数名更多是给程序路由用。描述应写清边界与反例。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q4</span><span class="guide-q-text">如何设计 JSON Schema 降低模型填错概率？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>减少可选参数模糊性；用 enum ；在 description 给示例；避免深层嵌套；必要时分拆多个函数。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】核心围绕「如何设计 JSON Schema 降低模型填错概率」：把标准答案里的每个要点都能用自己的话展开 2～3 句。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 减少可选参数模糊性；用 enum ；在 description 给示例；避免深层… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像给员工配电脑和系统账号：没有工具只能动嘴，有了工具才能查库存、下单、跑代码。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「如何设计 Agent 间的任务分配与协调？」（/custom/ai100-multi-agent/034-task-allocation-coordination） — 要点：多 Agent 任务分配与协调的核心挑战是：如何将复杂任务拆分为子任务、分配给合适的 Agent、并确保它们协同工作产出正确结果。主要策略包括：**集中式规划-分散执行**（中央规划器分解任务，Age…</p><p>· 「结构化输出（Structured Output）：如何让 LLM 返回 JSON/X…」（/custom/ai100-prompt/061-structured-output） — 要点：结构化输出是让 LLM 返回机器可解析格式（JSON、XML 等）而非自由文本的技术，是 Agent 系统和数据管道的基础能力。主要实现方法有四种：(1) **Prompt 指令**——在 Promp…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 延伸阅读：如何设计 Agent 间的任务分配与协调？、结构化输出（Structured Output）：如何让 LLM 返回 JSON/X…。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。</p><p>【主体】减少可选参数模糊性；用 enum ；在 description 给示例；避免深层嵌套；必要时分拆多个函数。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「如何设计 Agent 间的任务分配与协调？」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q5</span><span class="guide-q-text">LangChain Tool 的 docstring 为什么要写「何时不要用」？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>减少误触发（false positive），尤其在工具功能重叠时，这是线上质量关键。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】减少误触发（false positive），尤其在工具功能重叠时，这是线上质量关键。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 减少误触发（false positive），尤其在工具功能重叠时，这是线上质量关… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像给员工配电脑和系统账号：没有工具只能动嘴，有了工具才能查库存、下单、跑代码。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「LangGraph 和 LangChain 有什么区别」（/custom/today-interview/langgraph-vs-langchain） — 要点：LangChain 是组件库加链式拼接，适合一条线走到底的 RAG；LangGraph 是有状态图执行引擎，适合带循环、分支、人工审批点的 Agent 流程。…</p><p>· 「如何为 LLM 定义和描述工具（Tool Schema）？」（/custom/ai100-tool-use/022-tool-schema-design） — 要点：工具 Schema 使用 JSON Schema 格式定义三要素：**名称**（唯一标识符）、**描述**（告诉 LLM 何时以及如何使用此工具）、**参数**（输入的类型、约束、是否必填）。描述是最…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 延伸阅读：LangGraph 和 LangChain 有什么区别、如何为 LLM 定义和描述工具（Tool Schema）？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。</p><p>【主体】减少误触发（false positive），尤其在工具功能重叠时，这是线上质量关键。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「LangGraph 和 LangChain 有什么区别」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q6</span><span class="guide-q-text">MCP 解决的主要痛点是什么？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>工具集成碎片化、重复建设、难以跨产品复用；MCP 提供标准边界（Server）与传输，使工具像外设一样即插即用（在生态支持前提下）。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】工具集成碎片化、重复建设、难以跨产品复用。</p><p>【为什么考这个】定义题考你能不能「用类比 + 结构」讲清楚，而不是堆术语。面试官想确认你真的理解，而不是背过。</p><p>【拆开理解】</p><p>1. 工具集成碎片化、重复建设、难以跨产品复用；MCP 提供标准边界（Server）与… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像给员工配电脑和系统账号：没有工具只能动嘴，有了工具才能查库存、下单、跑代码。</p><p>【常见误区】</p><p>1. 只背一句定义，没有说「和普通 LLM 单次调用差在哪」。</p><p>2. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】15 秒定义 → 30 秒展开组件/流程 → 15 秒举例 → 10 秒和 ChatBot/Chain 的区别。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「MCP（Model Context Protocol）是什么？它如何标准化工具集成？」（/custom/ai100-tool-use/027-model-context-protocol） — 要点：MCP（Model Context Protocol）是 Anthropic 于 2024 年 11 月推出的开放标准，用于标准化 AI 系统与外部工具、数据源的集成方式。类比"AI 界的 USB-C…</p><p>· 「什么是 MCP（模型上下文协议）？讲讲它的核心内容？」（/custom/xiaolin-tools/what_is_mcp） — 要点：MCP 是 Anthropic 在 2024 年底推出的开放协议，我理解它主要解决的是「模型接工具太碎片化」的问题…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 延伸阅读：MCP（Model Context Protocol）是什么？它如何标准化工具集成？、什么是 MCP（模型上下文协议）？讲讲它的核心内容？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我先给一个清晰定义，再用类比帮你建立直觉，最后说和生产的关系。</p><p>【主体】工具集成碎片化、重复建设、难以跨产品复用；MCP 提供标准边界（Server）与传输，使工具像外设一样即插即用（在生态支持前提下）。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「MCP（Model Context Protocol）是什么？它如何标准化工具集成？」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q7</span><span class="guide-q-text">MCP 与 Function Calling 是替代关系吗？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>不是。FC 是模型侧表达；MCP 是工具侧集成。Host 常将 MCP 工具列表映射为 FC 的tools 。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】核心围绕「MCP 与 Function Calling 是替代关系吗」：把标准答案里的每个要点都能用自己的话展开 2～3 句。</p><p>【为什么考这个】这题和 Tool 都相关，属于 Agent 面试的高频交叉点。</p><p>【拆开理解】</p><p>1. 不是。FC 是模型侧表达；MCP 是工具侧集成。Host 常将 MCP 工具列表… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像给员工配电脑和系统账号：没有工具只能动嘴，有了工具才能查库存、下单、跑代码。</p><p>【常见误区】</p><p>1. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】结论 → 原理 → 例子 → 边界/兜底。控制在 60～90 秒，留时间给追问。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Function Calling 工具设计最佳实践」（/custom/today-interview/function-calling-design） — 要点：每个工具只做一件事、参数少而精、description 包含正例和反例、error 返回结构化而非纯文本——定义好，模型才可能调对。…</p><p>· 「什么是 Function Calling？它是如何工作的？」（/custom/ai100-tool-use/021-function-calling-basics） — 要点：Function Calling（也叫 Tool Use）是让 LLM 能够调用外部函数/API 的能力。关键理解：LLM 本身不执行任何工具，它只是生成结构化的 JSON 输出，指定要调用哪个函数以…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 延伸阅读：Function Calling 工具设计最佳实践、什么是 Function Calling？它是如何工作的？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我尽量用你能直接复述的结构来答，先结论后展开。</p><p>【主体】不是。FC 是模型侧表达；MCP 是工具侧集成。Host 常将 MCP 工具列表映射为 FC 的 tools 。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「Function Calling 工具设计最佳实践」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q8</span><span class="guide-q-text">工具路由什么时候必须上？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>当工具数量导致上下文膨胀、误选率上升或延迟/成本明显增加时；具体阈值依赖模型与描述长度，常见从几十起考虑。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】当工具数量导致上下文膨胀、误选率上升或延迟/成本明显增加时。</p><p>【为什么考这个】这题和 Memory、Tool、Engineering 都相关，属于 Agent 面试的高频交叉点。</p><p>【拆开理解】</p><p>1. 当工具数量导致上下文膨胀、误选率上升或延迟/成本明显增加时；具体阈值依赖模型与描… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像员工的笔记本 + 公司 Wiki：笔记本记当前任务，Wiki 记长期规则和客户档案。</p><p>【常见误区】</p><p>1. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】结论 → 原理 → 例子 → 边界/兜底。控制在 60～90 秒，留时间给追问。</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 记忆：事实 vs 推断分开存、写入时机、冲突合并、跨会话权限。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我尽量用你能直接复述的结构来答，先结论后展开。</p><p>【主体】当工具数量导致上下文膨胀、误选率上升或延迟/成本明显增加时；具体阈值依赖模型与描述长度，常见从几十起考虑。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q9</span><span class="guide-q-text">向量路由的缺陷与改进？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>缺陷：描述不佳则 embedding 不准；OOV 专有名词弱。改进：混合检索、同义词表、用户域特征、日志驱动迭代描述、加轻量分类器。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】缺陷：描述不佳则 embedding 不准。</p><p>【为什么考这个】这题和 RAG、Engineering 都相关，属于 Agent 面试的高频交叉点。</p><p>【拆开理解】</p><p>1. 缺陷：描述不佳则 embedding 不准；OOV 专有名词弱。改进：混合检索、… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>【面试怎么答】结论 → 原理 → 例子 → 边界/兜底。控制在 60～90 秒，留时间给追问。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「混合检索：如何结合语义检索和关键词检索？」（/custom/ai100-rag/016-hybrid-retrieval） — 要点：混合检索（Hybrid Search）并行运行向量语义检索和 BM25 关键词检索，然后通过融合算法（如 Reciprocal Rank Fusion, RRF）将两组结果合并为统一排序列表。语义检索…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 延伸阅读：混合检索：如何结合语义检索和关键词检索？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我尽量用你能直接复述的结构来答，先结论后展开。</p><p>【主体】缺陷：描述不佳则 embedding 不准；OOV 专有名词弱。改进：混合检索、同义词表、用户域特征、日志驱动迭代描述、加轻量分类器。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「混合检索：如何结合语义检索和关键词检索？」里有更完整的口播示范，建议对照练一遍。</p><p>如果追问为什么不用纯向量，我会说：编号、专有名词、精确匹配 BM25 更稳，所以 Hybrid + 重排是常态。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q10</span><span class="guide-q-text">并行工具调用要注意什么？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>幂等性、后端并发限制、数据竞争（写操作）、结果合并顺序、部分失败重试策略。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】幂等性、后端并发限制、数据竞争（写操作）、结果合并顺序、部分失败重试策略。</p><p>【为什么考这个】这题和 Tool 都相关，属于 Agent 面试的高频交叉点。</p><p>【拆开理解】</p><p>1. 幂等性、后端并发限制、数据竞争（写操作）、结果合并顺序、部分失败重试策略。 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像给员工配电脑和系统账号：没有工具只能动嘴，有了工具才能查库存、下单、跑代码。</p><p>【常见误区】</p><p>1. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】结论 → 原理 → 例子 → 边界/兜底。控制在 60～90 秒，留时间给追问。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「并行工具调用 vs 顺序工具调用的设计考量」（/custom/ai100-tool-use/028-parallel-vs-sequential-tools） — 要点：并行工具调用允许 LLM 同时请求多个无依赖关系的工具执行，将总延迟从所有调用时间之和降低到最长单次调用时间。顺序调用则适用于工具间存在数据依赖的场景——后一个工具需要前一个的输出作为输入。生产环境通…</p><p>· 「Tool Use 的常见模式：API 调用、数据库查询、代码执行」（/custom/ai100-tool-use/023-common-tool-patterns） — 要点：LLM 工具使用有三大类模式：**数据访问**（API 调用获取外部数据、SQL 查询数据库、向量检索知识库）、**计算与代码执行**（在沙箱中运行代码进行数据处理、计算或可视化）、**写操作与动作执…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 延伸阅读：并行工具调用 vs 顺序工具调用的设计考量、Tool Use 的常见模式：API 调用、数据库查询、代码执行。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我尽量用你能直接复述的结构来答，先结论后展开。</p><p>【主体】幂等性、后端并发限制、数据竞争（写操作）、结果合并顺序、部分失败重试策略。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「并行工具调用 vs 顺序工具调用的设计考量」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q11</span><span class="guide-q-text">什么是工具编排中的「依赖 DAG」？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>把工具调用当节点，数据依赖当边；拓扑排序执行，避免环与竞态，便于失败重试与可视化监控。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】核心围绕「什么是工具编排中的「依赖 DAG」」：把标准答案里的每个要点都能用自己的话展开 2～3 句。</p><p>【为什么考这个】这题和 Tool 都相关，属于 Agent 面试的高频交叉点。</p><p>【拆开理解】</p><p>1. 把工具调用当节点，数据依赖当边；拓扑排序执行，避免环与竞态，便于失败重试与可视化… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像给员工配电脑和系统账号：没有工具只能动嘴，有了工具才能查库存、下单、跑代码。</p><p>【常见误区】</p><p>1. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】结论 → 原理 → 例子 → 边界/兜底。控制在 60～90 秒，留时间给追问。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「什么是 A2A 协议？它和 MCP 协议的区别是什么？」（/custom/xiaolin-tools/a2a_protocol） — 要点：A2A 是 Google 发布的开放协议，专门解决多个 AI Agent 之间怎么互相通信协作的问题…</p><p>· 「什么是 Function Calling ？原理是什么？」（/custom/xiaolin-tools/function_calling） — 要点：Function Calling 我的理解是这样一套机制：开发者用 JSON schema 把工具描述好传给模型，模型判断需要调工具的时候不输出自然语言，而是直接输出一段结构化的 tool_calls…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 延伸阅读：什么是 A2A 协议？它和 MCP 协议的区别是什么？、什么是 Function Calling ？原理是什么？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我尽量用你能直接复述的结构来答，先结论后展开。</p><p>【主体】把工具调用当节点，数据依赖当边；拓扑排序执行，避免环与竞态，便于失败重试与可视化监控。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「什么是 A2A 协议？它和 MCP 协议的区别是什么？」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q12</span><span class="guide-q-text">敏感操作为什么推荐「两阶段提交」式工具设计？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>第一阶段生成草稿/待确认对象，第二阶段在用户确认后再真正执行，降低模型误触发损失。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】第一阶段生成草稿/待确认对象，第二阶段在用户确认后再真正执行，降低模型误触发损失。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 第一阶段生成草稿/待确认对象，第二阶段在用户确认后再真正执行，降低模型误触发损失… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像给员工配电脑和系统账号：没有工具只能动嘴，有了工具才能查库存、下单、跑代码。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Function Calling 工具设计最佳实践」（/custom/today-interview/function-calling-design） — 要点：每个工具只做一件事、参数少而精、description 包含正例和反例、error 返回结构化而非纯文本——定义好，模型才可能调对。…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 延伸阅读：Function Calling 工具设计最佳实践。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。</p><p>【主体】第一阶段生成草稿/待确认对象，第二阶段在用户确认后再真正执行，降低模型误触发损失。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「Function Calling 工具设计最佳实践」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q13</span><span class="guide-q-text">工具返回为什么要尽量结构化（JSON）？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>便于模型解析下一步推理、便于程序校验与日志；纯自然语言易产生歧义。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】便于模型解析下一步推理、便于程序校验与日志。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 便于模型解析下一步推理、便于程序校验与日志；纯自然语言易产生歧义。 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像给员工配电脑和系统账号：没有工具只能动嘴，有了工具才能查库存、下单、跑代码。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「结构化输出（Structured Output）：如何让 LLM 返回 JSON/X…」（/custom/ai100-prompt/061-structured-output） — 要点：结构化输出是让 LLM 返回机器可解析格式（JSON、XML 等）而非自由文本的技术，是 Agent 系统和数据管道的基础能力。主要实现方法有四种：(1) **Prompt 指令**——在 Promp…</p><p>· 「Reasoning 模型（o1/o3/DeepSeek-R1）vs 标准模型：架构差…」（/custom/ai100-planning/055-reasoning-models） — 要点：Reasoning 模型（又称 Large Reasoning Models, LRMs）与标准 LLM 的核心区别是**测试时计算扩展（Test-Time Compute Scaling）**：标准…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 延伸阅读：结构化输出（Structured Output）：如何让 LLM 返回 JSON/X…、Reasoning 模型（o1/o3/DeepSeek-R1）vs 标准模型：架构差…。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。</p><p>【主体】便于模型解析下一步推理、便于程序校验与日志；纯自然语言易产生歧义。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「结构化输出（Structured Output）：如何让 LLM 返回 JSON/X…」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q14</span><span class="guide-q-text">如何做工具调用的权限控制？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>会话绑定真实用户身份；服务端校验租户与角色；最小权限；敏感操作 HITL；不把长期密钥暴露给模型上下文。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】核心围绕「如何做工具调用的权限控制」：把标准答案里的每个要点都能用自己的话展开 2～3 句。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 会话绑定真实用户身份；服务端校验租户与角色；最小权限；敏感操作 HITL；不把长… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像员工的笔记本 + 公司 Wiki：笔记本记当前任务，Wiki 记长期规则和客户档案。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>3. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「checkpoint / checkpointer 是什么？」（/custom/langgraph-hitl/035-checkpointer） — 要点：checkpoint 本质上是图执行到某个 superstep 之后的状态快照，配合 checkpointer（MemorySaver、SQLite、Postgres 等后端）持久化。它解决的问题是：…</p><p>· 「thread_id 怎么设计？和业务主键什么关系？」（/custom/langgraph-hitl/036-thread-id） — 要点：我会从 checkpoint 解决什么问题讲起。 **是什么**：thread_id 是 checkpointer 用来隔离不同会话的标识符，传在 config.configurable.thread…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 记忆：事实 vs 推断分开存、写入时机、冲突合并、跨会话权限。</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 延伸阅读：checkpoint / checkpointer 是什么？、thread_id 怎么设计？和业务主键什么关系？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。</p><p>【主体】会话绑定真实用户身份；服务端校验租户与角色；最小权限；敏感操作 HITL；不把长期密钥暴露给模型上下文。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「checkpoint / checkpointer 是什么？」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q15</span><span class="guide-q-text">代码执行工具如何做到基本安全？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>沙箱隔离、资源与网络限制、禁用危险模块、超时、只读默认、审计；生产慎用。Q16（加一）：审计日志至少记哪些字段？</p>
<p>时间、trace/request id、用户/租户、工具名、参数摘要（脱敏）、结果状态、耗时、模型版本；合规场景保留策略与不可篡改存储视要求而定。Q17（加一）：Calculator 为什么禁止 eval ？</p>
<p>eval 可执行任意 Python，等同于远程代码执行；应使用 AST 白名单或安全数学库。小结Function Calling：模型产出结构化调用意图，应用在本地执行并回传，是 Agent 的「手」。Tool 工程：描述、Schema、返回值与错误模式与路由同样重要。MCP：标准化工具与上下文连接，利于复用与治理。路由与编排：解决规模与依赖问题；安全贯穿权限、输入、确认、限流与审计。建议结合自家业务画一张「用户请求 → 路由 → 工具 → 依赖 → 回传模型」的时序图，面试时能用白板讲清楚，比背诵定义更有说服力。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】沙箱隔离、资源与网络限制、禁用危险模块、超时、只读默认、审计。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 沙箱隔离、资源与网络限制、禁用危险模块、超时、只读默认、审计；生产慎用 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>2. Q16（加一）：审计日志至少记哪些字段？ **A：**时间、trace/requ… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>3. Q17（加一）：Calculator 为什么禁止 eval ？ **A：** e… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>4. Tool 工程：描述、Schema、返回值与错误模式与路由同样重要 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>5. MCP：标准化工具与上下文连接，利于复用与治理。路由与编排：解决规模与依赖问题；… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像员工的笔记本 + 公司 Wiki：笔记本记当前任务，Wiki 记长期规则和客户档案。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>3. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Function Calling 工具设计最佳实践」（/custom/today-interview/function-calling-design） — 要点：每个工具只做一件事、参数少而精、description 包含正例和反例、error 返回结构化而非纯文本——定义好，模型才可能调对。…</p><p>· 「7. Function Call、MCP、Skills 三者区别与协作？」（/custom/kama-agent/agent_interview-q7） — 要点：面试官会问：&amp;quot;这三个东西我感觉都是让 Agent 能干更多事，能用一个统一的比喻讲清楚吗…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 记忆：事实 vs 推断分开存、写入时机、冲突合并、跨会话权限。</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 本题 5 个要点，建议每点各准备一个 15 秒小例子。</p><p>· 延伸阅读：Function Calling 工具设计最佳实践、7. Function Call、MCP、Skills 三者区别与协作？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。</p><p>【主体】沙箱隔离、资源与网络限制、禁用危险模块、超时、只读默认、审计；生产慎用。 Q16（加一）：审计日志至少记哪些字段？ **A：**时间、trace/request id、用户/租户、工具名、参数摘要（脱敏）、结果状态、耗时、模型版本；合规场景保留策略与不可篡改存储视要求而定。 Q17（加一）：Calculator 为什么禁止 eval ？ **A：** eval 可执行任意 Python，等同于远程代码执行；应使用 AST 白名单或安全数学库。小结 Function Calling：模型产出结构化调用意图，应用在本地执行并回传，是 Agent 的「手」。 Tool 工程：描述、Schema、返回值与错误模式与路由同样重要。 MCP：标准化工具与上下文连接，利于复用与治理。路由与编排：解决规模与依赖问题；安全贯穿权限、输入、确认、限流与审计。建议结合自家…</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「Function Calling 工具设计最佳实践」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>
