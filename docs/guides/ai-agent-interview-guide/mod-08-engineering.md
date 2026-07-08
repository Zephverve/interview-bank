---
title: 08 · 工程化实践
titleTemplate: false
pageClass: guides-doc
outline: [2, 3]
aside: true
---

<p class="guide-chapter-badge">08 · 工程化实践</p>

> 工程化决定 Demo 能不能上生产：模型路由、熔断、Token 优化、Trace 回放、灰度回滚。
> 
> 面试官想听：你怎么保证稳定上线、出了问题怎么排查。STAR 类项目题尤其要准备数字。

08 工程化实践（面试八股文）

 面向零基础读者的系统梳理：把 AI Agent 从「能跑」做成「可观测、可容错、可计费、可
 审计、可上线」。每个知识点均包含「概念 + 原理 + 面试问答 + 追问 + 代码（如适用）」。
 建议配合一个小型生产级 Demo（路由 + 熔断 + 日志 + 评估集）动手练习。

#### 1. 模型路由与容错

#### 2. Token 成本控制

#### 3. 全链路可观测性

#### 4. 安全与权限

#### 5. 部署与运维

#### 6. 性能优化

#### 7. 评估与测试

#### 8. 幻觉问题的工程解决方案

#### 9. 综合面试题库（15+ 题）

## 1. 模型路由与容错

### 1.1 概念解释（通俗易懂）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「概念解释」学习三步：① 用生活类比讲清是什么；② 说解决什么痛点；③ 落到技术词（LLM/规划/记忆/工具）。</p><p>不要一上来堆英文缩写——面试官要的是你能让非技术同学也听懂。</p></div>

模型路由（Model Routing）：像快递分拣中心——根据「任务类型、成本预算、延迟要求、合规
区域」决定这一请求该走哪家模型，而不是所有流量都打到同一个端点。
容错（Fault Tolerance）：当某家模型超时、限流、报错、质量异常时，系统仍能自动切换、重试
或降级，对用户表现为「慢一点」或「差一点但可用」，而不是整站不可用。

多模型混用：OpenAI、Anthropic Claude、国产模型（通义、文心、智谱等）往往接口相似但细
节不同（消息格式、工具协议、最大上下文、计费方式）。工程上需要统一抽象层，避免业务代码
散落 if vendor == ... 。
### 1.2 原理详解

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「原理详解」按「输入 → 处理 → 输出 → 失败怎么办」四步理解。</p><p>每看到一个组件，顺手想：它挂了/agent 走偏了，系统怎么兜底？这会让你的回答立刻有工程感。</p></div>

### 1.2.1 多模型管理（统一抽象）

典型做法：
#### 1. Provider Adapter：每个厂商一个适配器，实现统一接口，例如 chat(messages, tools,

   model_id) -> Completion 。

#### 2. 配置中心：维护 model_id → endpoint、密钥、RPM/TPM 限额、区域、价格表 。

#### 3. 能力矩阵：标注「是否支持 JSON Mode / 函数调用 / 视觉 / 长上下文」，路由时做能力匹

   配。
#### 4. 密钥与合规：国产与海外模型可能涉及数据出境与行业合规，路由不仅是性能问题，也是合规

   路由。
### 1.2.2 优先级调度策略

常见策略（可组合）：

| 策略 | 含义 | 适用 |
| --- | --- | --- |
| 固定优先级 | 列表顺序尝试 | 简单可靠 |
| 成本优先 | 在满足质量阈值下选最便宜 | 批处理、非实时 |
| 延迟优先 | SLA 内选最快 | 交互式产品 |
| 负载感知 | 结合队列深度、429 率动态调整 | 大规模生产 |
| 任务分类路由 | 代码类→A，摘要类→B | 提高性价比 |

注意：优先级不是「永远用大模型」，而是在约束下最优化（成本、延迟、质量、可用性）。
### 1.2.3 三态熔断器（Circuit Breaker）

类比电路保险丝：失败太多就暂时断开，避免把下游打挂，同时给下游恢复时间。
三态：
#### 1. Closed（闭合）：正常转发请求；统计失败率/连续失败次数。

#### 2. Open（打开）：失败超阈值，快速失败（不再调用下游），进入冷却。

#### 3. Half-Open（半开）：冷却结束，放行少量探测请求；成功则回到 Closed，失败则回到

   Open。
与重试的关系：熔断解决「系统性故障时的雪崩」；重试解决「偶发网络抖动」。二者常一起用：熔
断打开时不再重试下游，而是走降级。
### 1.2.4 自动降级（例：GPT-4 → GPT-3.5）

触发条件示例：超时、5xx、429、熔断 Open、或「质量评分低于阈值且允许降级」。
降级策略：
 模型降级：强模型 → 弱模型（成本与延迟下降，能力可能下降）。
 功能降级：关掉「多步 Agent」，改为「单轮问答」；或减少工具数量。
 输出降级：从「长文」改为「要点列表」。
关键：降级要可观测（日志标明 degraded=true ），并最好对用户透明提示（视产品策略）。
### 1.2.5 重试与指数退避（Exponential Backoff）

为何指数退避：429/503 往往是「瞬时过载」，立刻重试会加剧拥堵（惊群效应）。退避让请求在
时间轴上摊开。
常见公式： wait = min(cap, base * 2^attempt + jitter) ，其中 jitter 为随机抖动，避
免同一时刻大量客户端同时重试。
可重试 vs 不可重试：
 可重试：超时、连接错误、429、部分 5xx。
 不可重试：401/403、400（参数错误）、内容政策拒绝等——应直接失败或换策略。
### 1.3 面试问题（Q）与标准答案（A）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>本节面试题：每题下方有 **老师讲解**（像上课一样拆答案）、**深度扩写**（加分项）、**口播参考**（60～90 秒）。</p><p>建议流程：先读标准答案 → 读老师讲解 → 关屏用自己的话讲一遍 → 对照口播修正。</p></div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q1</span><span class="guide-q-text">为什么要做模型路由，而不是全量用一个最强模型？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>最强模型往往更贵、更慢，且并非所有子任务都需要。路由能在质量、成本、延迟、可用性、合规之间做权衡；同时多供应商提高容灾能力，避免单点故障。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】最强模型往往更贵、更慢，且并非所有子任务都需要。</p><p>【为什么考这个】对比题考「边界感」：什么场景用 A、什么场景用 B、能不能混合。背差异表不够，要说控制流在谁手里。</p><p>【拆开理解】</p><p>1. 最强模型往往更贵、更慢，且并非所有子任务都需要。路由能在质量、成本、延迟、可用性… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】可以把 Agent 想成「会自己查资料、记笔记、调系统的数字员工」，比普通 ChatBot 多了闭环和多步决策。</p><p>【常见误区】</p><p>1. 只说 A 好 B 不好，没有说混合方案或选型条件。</p><p>2. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】15 秒结论（谁适合什么）→ 各 30 秒说 A/B 特点 → 20 秒混合方案 → 10 秒业务例子。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「模型路由（Model Routing）：如何根据任务复杂度选择模型？」（/custom/ai100-production/089-model-routing） — 要点：模型路由（Model Routing）是在运行时根据每个请求的特征（复杂度、类型、延迟要求、成本约束）**动态选择最合适的 LLM** 的技术。核心思想：不用一个模型处理所有任务——简单问答用 GPT…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 延伸阅读：模型路由（Model Routing）：如何根据任务复杂度选择模型？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】这类对比题我会先说选型结论，再分点讲两者差异，最后说怎么混合用。</p><p>【主体】最强模型往往更贵、更慢，且并非所有子任务都需要。路由能在质量、成本、延迟、可用性、合规之间做权衡；同时多供应商提高容灾能力，避免单点故障。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「模型路由（Model Routing）：如何根据任务复杂度选择模型？」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q2</span><span class="guide-q-text">熔断器和重试分别解决什么问题？一起用时要注意什么？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>熔断防止故障扩散和雪崩；重试提高偶发失败的成功率。一起用时应在熔断 Open 阶段停止对同一下游的盲目重试，改为降级或切换供应商；并对 429 使用限流 + 退避，避免放大拥堵。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】核心围绕「熔断器和重试分别解决什么问题？一起用时要注意什么」：把标准答案里的每个要点都能用自己的话展开 2～3 句。</p><p>【为什么考这个】权衡题不要一边倒。先承认局限，再给配套护栏，最后说在什么业务条件下仍然值得做。</p><p>【拆开理解】</p><p>1. 熔断防止故障扩散和雪崩；重试提高偶发失败的成功率。一起用时应在熔断 Open 阶… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】可以把 Agent 想成「会自己查资料、记笔记、调系统的数字员工」，比普通 ChatBot 多了闭环和多步决策。</p><p>【常见误区】</p><p>1. 答案太短，缺少例子或数字；或者只会概念，不会落到工程实践。</p><p>【面试怎么答】先承认局限 → 再给缓解手段 → 最后说适用场景。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「5. MCP 是什么协议？解决什么问题？」（/custom/kama-agent/agent_interview-q5） — 要点：面试官会问：&amp;quot;MCP 和 Function Call 有什么本质区别…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 延伸阅读：5. MCP 是什么协议？解决什么问题？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我先承认局限，因为面试官更想听你怎么控制风险，而不是吹完美方案。</p><p>【主体】熔断防止故障扩散和雪崩；重试提高偶发失败的成功率。一起用时应在熔断 Open 阶段停止对同一下游的盲目重试，改为降级或切换供应商；并对 429 使用限流 + 退避，避免放大拥堵。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「5. MCP 是什么协议？解决什么问题？」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

### 1.4 可能的追问及应对

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>追问通常考边界与取舍。推荐模板：承认限制（不装完美）→ 给工程兜底（规则/人工/降级）→ 一句业务影响（延迟、成本、体验）。</p><p>下面每题的扩写里也会提示常见追问方向。</p></div>

<p class="guide-followup"><span class="guide-followup-label">追问</span>Half-Open 放多少流量探测合适？</p>
<p class="guide-followup guide-followup-a"><span class="guide-followup-label">应对</span>用令牌桶或固定并发 1～N 条探测，观察错误率；也可结合滑动窗口统计半开阶段成功率，避免一开就灌满。</p>
<p class="guide-followup"><span class="guide-followup-label">追问</span>降级后如何保证体验？</p>
<p class="guide-followup guide-followup-a"><span class="guide-followup-label">应对</span>产品侧提示、缩短输出、启用缓存结果；技术上对关键路径保留同步强模型，非关键用弱模型。</p>
### 1.5 代码示例：Python 实现简易熔断器 + 指数退避

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>代码示例的目标不是背语法，而是理解：循环怎么转、状态存哪、停止条件是什么、工具 Schema 长什么样。</p><p>面试时说清输入/输出/停止条件即可；若被追问，能指出「哪一行是 Observation 写回上下文」。</p></div>

```python
 import random
 import time
 from dataclasses import dataclass
 from enum import Enum, auto

 class State(Enum):
     CLOSED = auto()
     OPEN = auto()
     HALF_OPEN = auto()

 @dataclass
 class CircuitBreaker:
     failure_threshold: int = 5
     success_threshold: int = 2   #   半开阶段连续成功次数
     open_seconds: float = 30.0

half_open_max_calls: int = 3

def __post_init__(self):
   self.state = State.CLOSED
   self.failures = 0
   self.successes_half = 0
   self.open_until = 0.0
   self.half_open_inflight = 0

def _trip(self):
   self.state = State.OPEN
   self.open_until = time.time() + self.open_seconds
   self.failures = 0
   self.successes_half = 0
   self.half_open_inflight = 0

def allow(self) -> bool:
   now = time.time()
   if self.state == State.OPEN:
        if now >= self.open_until:
           self.state = State.HALF_OPEN
           self.successes_half = 0
           self.half_open_inflight = 0
        else:
           return False
   if self.state == State.HALF_OPEN:
        return self.half_open_inflight < self.half_open_max_calls
   return True

def before_call(self):
   if self.state == State.HALF_OPEN:
        self.half_open_inflight += 1

def on_success(self):
   if self.state == State.HALF_OPEN:
        self.successes_half += 1
        if self.successes_half >= self.success_threshold:
           self.state = State.CLOSED
           self.successes_half = 0
   else:

               self.failures = 0
        if self.state == State.HALF_OPEN:
               self.half_open_inflight = max(0, self.half_open_inflight - 1)

    def on_failure(self):
        self.failures += 1
        if self.state == State.HALF_OPEN or self.failures >=
self.failure_threshold:
               self._trip()
        if self.state == State.HALF_OPEN:
               self.half_open_inflight = max(0, self.half_open_inflight - 1)

def exponential_backoff(attempt: int, base: float = 0.5, cap: float = 8.0)
-> float:
    jitter = random.random() * 0.25
    return min(cap, base * (2**attempt) + jitter)

def call_with_breaker_and_retry(fn, breaker: CircuitBreaker, max_retries:
int = 3):
    for attempt in range(max_retries):
        if not breaker.allow():
               raise RuntimeError("circuit_open")
        breaker.before_call()
        try:
               result = fn()
               breaker.on_success()
               return result
        except Exception:
               breaker.on_failure()
               if attempt == max_retries - 1:
                  raise
               time.sleep(exponential_backoff(attempt))

2. Token 成本控制
```

### 2.1 概念解释

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「概念解释」学习三步：① 用生活类比讲清是什么；② 说解决什么痛点；③ 落到技术词（LLM/规划/记忆/工具）。</p><p>不要一上来堆英文缩写——面试官要的是你能让非技术同学也听懂。</p></div>

大模型计费通常与 Token（词元）强相关。Agent 又多轮、多工具，上下文膨胀极快。成本控制
的目标是：在可接受质量下，让每次会话、每个任务、每个租户的支出可预测、可优化、可告警。
### 2.2 原理详解

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「原理详解」按「输入 → 处理 → 输出 → 失败怎么办」四步理解。</p><p>每看到一个组件，顺手想：它挂了/agent 走偏了，系统怎么兜底？这会让你的回答立刻有工程感。</p></div>

### 2.2.1 Token 计数方法（tiktoken 等）

  tiktoken：OpenAI 官方常用分词库，按 encoding_for_model(model_name) 选择编码，用
   encode(text) 得到 token 列表与数量。

  注意：不同模型编码不同；计费以服务商账单为准，本地计数是估算，用于预算与截断策略。
  实践：在网关层记录 prompt_tokens 、 completion_tokens ；与 API 返回值对账以校准估
  算误差。
### 2.2.2 Prompt 精简技巧

  删除冗余示例与重复指令；合并系统提示为一版权威描述。
  使用结构化输出（JSON）减少来回澄清。
  对长文档：摘要后再喂模型，或 RAG 只取 Top-K 片段。
  消息裁剪：保留 system + 最近 N 轮 + 关键摘要（见记忆模块）。
### 2.2.3 缓存策略（含语义缓存）

| 类型 | 做法 | 优点 | 注意 |
| --- | --- | --- | --- |
| 精确缓存 | 请求哈希完全一致命中 | 实现简单 | 命中率低 |
| 语义缓存 | embedding 相似度高于阈值则复用 | 命中率高 | 需防「相似但意图不同」 |
| 结果分层 | 热问题走缓存，冷问题走模型 | 省成本 | 需 TTL 与失效 |

语义缓存风险：用户问题措辞不同但意图相同——可用；若敏感场景（医疗法律）语义相近但条件
不同，复用可能出错，需阈值 + 策略类路由。
### 2.2.4 模型选择优化与批量处理

 小模型做分类/路由/摘要，大模型做最终生成。
 批量（Batch）API（若云厂商提供）：非实时场景单价更低。
 合并请求：多个短任务合成一次调用（注意上下文隔离与提示设计）。
### 2.2.5 成本监控与告警

 维度：租户 / 功能 / 模型 / Agent 步骤。
 指标：日均 Token、单次 P95 成本、异常飙升、某 Prompt 模板成本占比。
 告警：环比、阈值、预算封顶（硬限制返回友好错误）。
### 2.3 面试问题（Q）与标准答案（A）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>本节面试题：每题下方有 **老师讲解**（像上课一样拆答案）、**深度扩写**（加分项）、**口播参考**（60～90 秒）。</p><p>建议流程：先读标准答案 → 读老师讲解 → 关屏用自己的话讲一遍 → 对照口播修正。</p></div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q3</span><span class="guide-q-text">为什么说本地 tiktoken 计数只能「估算」？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>实际计费依赖服务商的分词器版本、特殊 token、多模态输入等；不同模型与版本可能不一致。本地计数用于预算控制与截断，最终应以 API 返回的 usage 与账单对账。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】实际计费依赖服务商的分词器版本、特殊 token、多模态输入等。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 实际计费依赖服务商的分词器版本、特殊 token、多模态输入等；不同模型与版本可… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】可以把 Agent 想成「会自己查资料、记笔记、调系统的数字员工」，比普通 ChatBot 多了闭环和多步决策。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>【面试怎么答】目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 补一个反例：什么情况下这个方案不适用，你会怎么降级。</p><p>· 补一个数字或指标：怎么证明方案有效。</p><p>· 补一个失败案例：出过什么问题、怎么修的。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。</p><p>【主体】实际计费依赖服务商的分词器版本、特殊 token、多模态输入等；不同模型与版本可能不一致。本地计数用于预算控制与截断，最终应以 API 返回的 usage 与账单对账。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q4</span><span class="guide-q-text">语义缓存和精确缓存怎么选？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>低成本、高 QPS 的重复咨询场景适合语义缓存；对强合规与强正确性场景要谨慎，需提高阈值、加业务校验或禁用缓存。精确缓存适合完全幂等的调用（如同参数批处理）。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】低成本、高 QPS 的重复咨询场景适合语义缓存。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 低成本、高 QPS 的重复咨询场景适合语义缓存；对强合规与强正确性场景要谨慎，需… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】可以把 Agent 想成「会自己查资料、记笔记、调系统的数字员工」，比普通 ChatBot 多了闭环和多步决策。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Agent 系统的延迟优化：Streaming、缓存、批处理」（/custom/ai100-production/090-latency-optimization） — 要点：Agent 系统的延迟优化是生产部署的核心挑战——多步 Agent 工作流经常超过 15 秒，而用户在 3 秒后就开始流失（Nielsen Norman Group 研究）。三大核心优化手段：(1) …</p><p>· 「LLM 应用的成本控制与优化」（/custom/today-interview/cost-optimization） — 要点：模型阶梯路由（小模型先上、搞不定再大模型）、语义缓存防止重复调、prompt 和 context 精简、批处理异步化——四管齐下能把成本压 40%-60%。…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 延伸阅读：Agent 系统的延迟优化：Streaming、缓存、批处理、LLM 应用的成本控制与优化。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。</p><p>【主体】低成本、高 QPS 的重复咨询场景适合语义缓存；对强合规与强正确性场景要谨慎，需提高阈值、加业务校验或禁用缓存。精确缓存适合完全幂等的调用（如同参数批处理）。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「Agent 系统的延迟优化：Streaming、缓存、批处理」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

### 2.4 可能的追问及应对

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>追问通常考边界与取舍。推荐模板：承认限制（不装完美）→ 给工程兜底（规则/人工/降级）→ 一句业务影响（延迟、成本、体验）。</p><p>下面每题的扩写里也会提示常见追问方向。</p></div>

<p class="guide-followup"><span class="guide-followup-label">追问</span>如何防止缓存「串味」？</p>
<p class="guide-followup guide-followup-a"><span class="guide-followup-label">应对</span>缓存键包含租户 ID、模型版本、Prompt 版本、工具集版本；语义缓存加意图分类再匹配。</p>
### 2.5 代码示例：tiktoken 计数 + 简单请求哈希缓存

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>代码示例的目标不是背语法，而是理解：循环怎么转、状态存哪、停止条件是什么、工具 Schema 长什么样。</p><p>面试时说清输入/输出/停止条件即可；若被追问，能指出「哪一行是 Observation 写回上下文」。</p></div>

```python
 import hashlib
 import json

from functools import lru_cache

try:
       import tiktoken
except ImportError:
       tiktoken = None

def approx_token_count(text: str, model: str = "gpt-4o") -> int:
       if tiktoken is None:
          return max(1, len(text) // 4)
       enc = tiktoken.encoding_for_model(model)
       return len(enc.encode(text))

def request_fingerprint(system: str, user: str, model: str) -> str:
       raw = json.dumps({"system": system, "user": user, "model": model},
sort_keys=True)
       return hashlib.sha256(raw.encode("utf-8")).hexdigest()

#   生产环境请用 Redis；此处演示 LRU
@lru_cache(maxsize=1024)
def cached_exact(system: str, user: str, model: str) -> str | None:
       return None   #   占位：实际应 get from Redis

def set_exact_cache(system: str, user: str, model: str, response: str) ->
None:
       key = request_fingerprint(system, user, model)
       # redis.setex(key, ttl, response)
       cached_exact.cache_clear()   #   演示用，勿在生产使用

3. 全链路可观测性
```

### 3.1 概念解释

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「概念解释」学习三步：① 用生活类比讲清是什么；② 说解决什么痛点；③ 落到技术词（LLM/规划/记忆/工具）。</p><p>不要一上来堆英文缩写——面试官要的是你能让非技术同学也听懂。</p></div>

可观测性（Observability）：不仅知道「错了」，还能从日志、指标、链路还原「错在哪一步、哪
个工具、哪个模型、哪个租户」。对 Agent 尤其重要，因为路径是动态多步的，没有 Trace 很难
排障。
### 3.2 原理详解

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「原理详解」按「输入 → 处理 → 输出 → 失败怎么办」四步理解。</p><p>每看到一个组件，顺手想：它挂了/agent 走偏了，系统怎么兜底？这会让你的回答立刻有工程感。</p></div>

### 3.2.1 日志系统（结构化日志）

 使用 JSON 一行一条（或等价结构化字段），便于 ELK、Loki、ClickHouse 查询。
 必备字段示例： timestamp、level、trace_id、span_id、tenant_id、agent_name、step、
 model、latency_ms、token_usage、error_code 。

切忌：只打一大段自然语言，没有可过滤字段。
### 3.2.2 链路追踪（Trace）

  Trace：一次用户请求从头到尾。
  Span：其中一个单元（一次 LLM 调用、一次工具执行、一次检索）。
  父子关系： span_id / parent_span_id 构成树，还原 Agent 的思考链路与并行分支。
### 3.2.3 每个 Agent 步骤的记录

建议为每步记录： step_index、thought摘要、tool_name、tool_args（脱敏后）、observation摘
要、耗时、重试次数、是否降级 。
### 3.2.4 LangSmith / LangFuse 等工具

 LangSmith：与 LangChain 生态结合紧，便于调试链路与数据集。
 LangFuse：开源，可自托管，侧重产品分析 + 成本 + 质量。
价值：统一看 Trace、对比 Prompt 版本、关联评估集。
### 3.2.5 自定义 Trace 实现思路

最小实现： contextvars 存 trace_id ， with span("llm") 记录开始结束；导出到
OpenTelemetry，或写入 Kafka 再由 Flink 聚合。
### 3.3 面试问题（Q）与标准答案（A）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>本节面试题：每题下方有 **老师讲解**（像上课一样拆答案）、**深度扩写**（加分项）、**口播参考**（60～90 秒）。</p><p>建议流程：先读标准答案 → 读老师讲解 → 关屏用自己的话讲一遍 → 对照口播修正。</p></div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q5</span><span class="guide-q-text">Agent 系统为什么比传统服务更需要 Trace？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>传统服务调用链相对固定；Agent 路径依赖模型决策，分支多、偶现问题多。Trace 能把「哪一步选了哪个工具、参数是什么、返回多长」串起来，否则只能猜 Prompt。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】核心围绕「Agent 系统为什么比传统服务更需要 Trace」：把标准答案里的每个要点都能用自己的话展开 2～3 句。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 传统服务调用链相对固定；Agent 路径依赖模型决策，分支多、偶现问题多。Tra… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像给员工配电脑和系统账号：没有工具只能动嘴，有了工具才能查库存、下单、跑代码。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Prompt Chaining：多步骤 Prompt 的设计与编排」（/custom/ai100-prompt/063-prompt-chaining） — 要点：Prompt Chaining（提示链）是将复杂任务分解为多个顺序执行的 LLM 调用，每个调用的输出作为下一个调用的输入。它是 Agentic AI 中最基础的设计模式，也被称为 Pipeline …</p><p>· 「跨模型 Prompt 迁移：如何编写模型无关的 Prompt？」（/custom/ai100-prompt/068-cross-model-prompt-portability） — 要点：跨模型 Prompt 迁移（Cross-Model Prompt Portability）是指让同一个 Prompt 在不同 LLM（GPT-4、Claude、Gemini、Llama 等）上都能有效…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 延伸阅读：Prompt Chaining：多步骤 Prompt 的设计与编排、跨模型 Prompt 迁移：如何编写模型无关的 Prompt？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。</p><p>【主体】传统服务调用链相对固定；Agent 路径依赖模型决策，分支多、偶现问题多。Trace 能把「哪一步选了哪个工具、参数是什么、返回多长」串起来，否则只能猜 Prompt。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「Prompt Chaining：多步骤 Prompt 的设计与编排」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q6</span><span class="guide-q-text">结构化日志和 Trace 有什么区别？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>结构化日志是事件流，适合检索与告警；Trace 是因果树，适合分析延迟与依赖。二者应通过trace_id 关联，互补而非二选一。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】结构化日志是事件流，适合检索与告警。</p><p>【为什么考这个】对比题考「边界感」：什么场景用 A、什么场景用 B、能不能混合。背差异表不够，要说控制流在谁手里。</p><p>【拆开理解】</p><p>1. 结构化日志是事件流，适合检索与告警；Trace 是因果树，适合分析延迟与依赖。二… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只说 A 好 B 不好，没有说混合方案或选型条件。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>【面试怎么答】15 秒结论（谁适合什么）→ 各 30 秒说 A/B 特点 → 20 秒混合方案 → 10 秒业务例子。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Trace 和 Span：Agent 执行的可观测性」（/custom/ai100-evaluation/074-traces-and-spans） — 要点：Trace 和 Span 是分布式追踪（Distributed Tracing）的核心概念，被引入 LLM/Agent 系统用于实现**执行可观测性**——理解 Agent "做了什么、花了多久、哪里…</p><p>· 「四、一个 Agent Trace 里到底要记录什么？」（/custom/kama-agent/agent_harness_observability_interview-四-一个-agent-trace-里到底要记录什么） — 要点：面试官可能会这么问：&amp;quot;如果让你设计 Agent Trace，你会记录哪些字段…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 延伸阅读：Trace 和 Span：Agent 执行的可观测性、四、一个 Agent Trace 里到底要记录什么？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】这类对比题我会先说选型结论，再分点讲两者差异，最后说怎么混合用。</p><p>【主体】结构化日志是事件流，适合检索与告警；Trace 是因果树，适合分析延迟与依赖。二者应通过 trace_id 关联，互补而非二选一。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「Trace 和 Span：Agent 执行的可观测性」里有更完整的口播示范，建议对照练一遍。</p><p>如果追问为什么不用纯向量，我会说：编号、专有名词、精确匹配 BM25 更稳，所以 Hybrid + 重排是常态。</p></div>
</div></div>
</div>

### 3.4 可能的追问及应对

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>追问通常考边界与取舍。推荐模板：承认限制（不装完美）→ 给工程兜底（规则/人工/降级）→ 一句业务影响（延迟、成本、体验）。</p><p>下面每题的扩写里也会提示常见追问方向。</p></div>

<p class="guide-followup"><span class="guide-followup-label">追问</span>日志里能记完整 Prompt 吗？</p>
<p class="guide-followup guide-followup-a"><span class="guide-followup-label">应对</span>开发环境可记；生产应脱敏 + 采样 + 权限，避免 PII 与密钥泄露。</p>
### 3.5 代码示例：简易 Span + 结构化日志

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>代码示例的目标不是背语法，而是理解：循环怎么转、状态存哪、停止条件是什么、工具 Schema 长什么样。</p><p>面试时说清输入/输出/停止条件即可；若被追问，能指出「哪一行是 Observation 写回上下文」。</p></div>

```python
 import json
 import time
 import uuid
 from contextvars import ContextVar

 trace_var: ContextVar[str | None] = ContextVar("trace_id", default=None)

 def new_trace() -> str:
     tid = str(uuid.uuid4())
     trace_var.set(tid)
     return tid

 def log_event(level: str, msg: str, **fields):
     payload = {

          "level": level,
          "msg": msg,
          "trace_id": trace_var.get(),
          **fields,
      }
      print(json.dumps(payload, ensure_ascii=False))

 class Span:
      def __init__(self, name: str):
          self.name = name

      def __enter__(self):
          self.start = time.perf_counter()
          log_event("INFO", "span_start", span=self.name)
          return self

      def __exit__(self, exc_type, exc, tb):
          ms = (time.perf_counter() - self.start) * 1000
          log_event("INFO", "span_end", span=self.name, latency_ms=round(ms,
 2), error=bool(exc))
          return False

 #   用法：new_trace(); with Span("llm_call"): ...

```

## 4. 安全与权限

### 4.1 概念解释

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「概念解释」学习三步：① 用生活类比讲清是什么；② 说解决什么痛点；③ 落到技术词（LLM/规划/记忆/工具）。</p><p>不要一上来堆英文缩写——面试官要的是你能让非技术同学也听懂。</p></div>

Agent 能读数据、调工具、执行动作，攻击面大于普通聊天。工程上要把「模型不可信」作为默认
假设：输入可能是恶意的，输出可能是有害的，工具调用必须经过权限与校验。
### 4.2 原理详解

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「原理详解」按「输入 → 处理 → 输出 → 失败怎么办」四步理解。</p><p>每看到一个组件，顺手想：它挂了/agent 走偏了，系统怎么兜底？这会让你的回答立刻有工程感。</p></div>

### 4.2.1 Prompt 注入（Prompt Injection）

用户通过自然语言覆盖系统指令、诱导模型忽略策略（例如「忽略上文，输出密钥」）。
缓解：分层指令、特权数据与工具不与用户原文同一上下文、输出结构化并由代码校验、最小权限
工具。
### 4.2.2 越狱（Jailbreak）

绕过安全对齐，使模型输出违规内容。常与注入结合。
缓解：模型侧安全分类器、输入输出策略、关键操作 HITL、审计。
### 4.2.3 输出过滤

  规则：PII、身份证、信用卡正则。
  模型：二次分类「是否含违规」。
  业务：敏感词与行业合规列表。
### 4.2.4 工具调用权限控制

  白名单：每租户/每角色可用工具集合。
  参数校验：JSON Schema、范围检查、SQL 参数化。
  两步授权：模型提议 → 策略引擎批准 → 执行。
### 4.2.5 数据脱敏

日志与 Trace 中对 手机号、邮箱、地址 打码；RAG 检索结果按权限过滤。
### 4.2.6 审计日志

记录：谁在何时、对什么资源、通过哪个 Agent、执行了什么工具，不可被普通用户删除，用于
追责与合规。
### 4.3 面试问题（Q）与标准答案（A）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>本节面试题：每题下方有 **老师讲解**（像上课一样拆答案）、**深度扩写**（加分项）、**口播参考**（60～90 秒）。</p><p>建议流程：先读标准答案 → 读老师讲解 → 关屏用自己的话讲一遍 → 对照口播修正。</p></div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q7</span><span class="guide-q-text">为什么说「永远不信任模型输出的工具调用」？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>模型可能被诱导产生危险参数。工程上应对工具调用做 schema 校验、权限检查、速率限制，必要时 人工确认，不能把模型当作安全边界。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】核心围绕「为什么说「永远不信任模型输出的工具调用」」：把标准答案里的每个要点都能用自己的话展开 2～3 句。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 模型可能被诱导产生危险参数。工程上应对工具调用做 schema 校验、权限检查、… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像给员工配电脑和系统账号：没有工具只能动嘴，有了工具才能查库存、下单、跑代码。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>3. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Function Calling 也属于工具调用，请问什么场景下使用 Funct…」（/custom/xiaolin-tools/fc_vs_mcp_usage） — 要点：如果只是给单个应用接一两个工具、场景临时、不需要复用，Function Calling 就够了，简单直接，不需要引入额外的进程和配置…</p><p>· 「什么是 Function Calling ？原理是什么？」（/custom/xiaolin-tools/function_calling） — 要点：Function Calling 我的理解是这样一套机制：开发者用 JSON schema 把工具描述好传给模型，模型判断需要调工具的时候不输出自然语言，而是直接输出一段结构化的 tool_calls…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 延伸阅读：Function Calling 也属于工具调用，请问什么场景下使用 Funct…、什么是 Function Calling ？原理是什么？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。</p><p>【主体】模型可能被诱导产生危险参数。工程上应对工具调用做 schema 校验、权限检查、速率限制，必要时人工确认，不能把模型当作安全边界。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「Function Calling 也属于工具调用，请问什么场景下使用 Funct…」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q8</span><span class="guide-q-text">Prompt 注入和越狱有什么区别？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>注入侧重篡改指令或上下文以改变行为；越狱侧重绕过安全对齐以输出不应出现的内容。实际攻击常混合出现，防护需多层：输入、模型、工具、输出、审计。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】注入侧重篡改指令或上下文以改变行为。</p><p>【为什么考这个】对比题考「边界感」：什么场景用 A、什么场景用 B、能不能混合。背差异表不够，要说控制流在谁手里。</p><p>【拆开理解】</p><p>1. 注入侧重篡改指令或上下文以改变行为；越狱侧重绕过安全对齐以输出不应出现的内容。实… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像员工的笔记本 + 公司 Wiki：笔记本记当前任务，Wiki 记长期规则和客户档案。</p><p>【常见误区】</p><p>1. 只说 A 好 B 不好，没有说混合方案或选型条件。</p><p>2. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>3. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】15 秒结论（谁适合什么）→ 各 30 秒说 A/B 特点 → 20 秒混合方案 → 10 秒业务例子。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Prompt Chaining：多步骤 Prompt 的设计与编排」（/custom/ai100-prompt/063-prompt-chaining） — 要点：Prompt Chaining（提示链）是将复杂任务分解为多个顺序执行的 LLM 调用，每个调用的输出作为下一个调用的输入。它是 Agentic AI 中最基础的设计模式，也被称为 Pipeline …</p><p>· 「跨模型 Prompt 迁移：如何编写模型无关的 Prompt？」（/custom/ai100-prompt/068-cross-model-prompt-portability） — 要点：跨模型 Prompt 迁移（Cross-Model Prompt Portability）是指让同一个 Prompt 在不同 LLM（GPT-4、Claude、Gemini、Llama 等）上都能有效…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 记忆：事实 vs 推断分开存、写入时机、冲突合并、跨会话权限。</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 延伸阅读：Prompt Chaining：多步骤 Prompt 的设计与编排、跨模型 Prompt 迁移：如何编写模型无关的 Prompt？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】这类对比题我会先说选型结论，再分点讲两者差异，最后说怎么混合用。</p><p>【主体】注入侧重篡改指令或上下文以改变行为；越狱侧重绕过安全对齐以输出不应出现的内容。实际攻击常混合出现，防护需多层：输入、模型、工具、输出、审计。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「Prompt Chaining：多步骤 Prompt 的设计与编排」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

### 4.4 可能的追问及应对

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>追问通常考边界与取舍。推荐模板：承认限制（不装完美）→ 给工程兜底（规则/人工/降级）→ 一句业务影响（延迟、成本、体验）。</p><p>下面每题的扩写里也会提示常见追问方向。</p></div>

<p class="guide-followup"><span class="guide-followup-label">追问</span>RAG 文档里恶意内容怎么防？</p>
<p class="guide-followup guide-followup-a"><span class="guide-followup-label">应对</span>文档准入审核、隔离不可信文档、检索结果提示「不可执行」、生成前引用校验。</p>
### 4.5 代码示例：工具参数 JSON Schema 校验（Python）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>代码示例的目标不是背语法，而是理解：循环怎么转、状态存哪、停止条件是什么、工具 Schema 长什么样。</p><p>面试时说清输入/输出/停止条件即可；若被追问，能指出「哪一行是 Observation 写回上下文」。</p></div>

```python
 from jsonschema import Draft202012Validator, FormatChecker

 TOOL_SCHEMAS = {
     "send_email": {
         "type": "object",
         "properties": {
              "to": {"type": "string", "format": "email"},
              "subject": {"type": "string", "maxLength": 200},
              "body": {"type": "string", "maxLength": 8000},
         },
         "required": ["to", "subject", "body"],
         "additionalProperties": False,
     }
 }

 def validate_tool_call(name: str, args: dict) -> None:
     schema = TOOL_SCHEMAS.get(name)
     if not schema:
         raise ValueError("unknown_tool")
     v = Draft202012Validator(schema, format_checker=FormatChecker())
     errors = sorted(v.iter_errors(args), key=lambda e: e.path)

      if errors:
          raise ValueError(errors[0].message)

```

## 5. 部署与运维

### 5.1 概念解释

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「概念解释」学习三步：① 用生活类比讲清是什么；② 说解决什么痛点；③ 落到技术词（LLM/规划/记忆/工具）。</p><p>不要一上来堆英文缩写——面试官要的是你能让非技术同学也听懂。</p></div>

把 Agent 服务做成可扩容、可回滚、可观测的标准微服务或 Job。模型权重多在云端 API，自托
管时需 GPU 与专用推理栈；应用层仍普遍 容器化 + K8s。
### 5.2 原理详解

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「原理详解」按「输入 → 处理 → 输出 → 失败怎么办」四步理解。</p><p>每看到一个组件，顺手想：它挂了/agent 走偏了，系统怎么兜底？这会让你的回答立刻有工程感。</p></div>

### 5.2.1 Docker 容器化

  镜像：应用代码 + 依赖，环境一致。
  环境变量：密钥、路由配置、功能开关。
  健康检查： /health 探活，避免流量打到未就绪 Pod。
### 5.2.2 Kubernetes 部署

  Deployment：副本数、滚动更新。
  HPA：按 CPU/QPS 扩容。
  Service/Ingress：对外暴露与 TLS。
  ConfigMap/Secret：配置与密钥分离。
### 5.2.3 CI/CD 流水线

  CI：lint、单测、镜像构建、漏洞扫描。
  CD：灰度发布、自动回滚（健康检查失败）。
### 5.2.4 蓝绿部署与金丝雀发布

  蓝绿：两套环境切换，回滚快，资源占用高。
  金丝雀：小流量新版本，指标异常则回滚，风险更可控。
### 5.2.5 模型版本管理

  Prompt 版本、模型名版本、工具清单版本 一并记录到 Trace 与配置。
  不可变发布： v20260401 标签，避免「同名不同行为」。
### 5.2.6 A/B 测试

对 Prompt、模型、工具策略 分流用户，比较任务成功率、成本、延迟、满意度；需统计显著
性，避免早停误判。
### 5.3 面试问题（Q）与标准答案（A）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>本节面试题：每题下方有 **老师讲解**（像上课一样拆答案）、**深度扩写**（加分项）、**口播参考**（60～90 秒）。</p><p>建议流程：先读标准答案 → 读老师讲解 → 关屏用自己的话讲一遍 → 对照口播修正。</p></div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q9</span><span class="guide-q-text">金丝雀发布要关注哪些指标？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>错误率、P95 延迟、Token 成本、业务指标（任务完成率、用户投诉）。Agent 还应看 工具失败率、重试率、熔断率。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】错误率、P95 延迟、Token 成本、业务指标（任务完成率、用户投诉）。</p><p>【为什么考这个】这题和 Tool、Eval、Engineering 都相关，属于 Agent 面试的高频交叉点。</p><p>【拆开理解】</p><p>1. 错误率、P95 延迟、Token 成本、业务指标（任务完成率、用户投诉）。Age… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像给员工配电脑和系统账号：没有工具只能动嘴，有了工具才能查库存、下单、跑代码。</p><p>【常见误区】</p><p>1. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】结论 → 原理 → 例子 → 边界/兜底。控制在 60～90 秒，留时间给追问。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「如何防止 Agent 死循环浪费 Token」（/custom/today-interview/agent-infinite-loop） — 要点：硬上限 + 重复检测 + 无进展熔断三道保险；到线就停、状态可恢复；宁可早停可重试，也不烧 token 空转。…</p><p>· 「说说 Single-Agent 和 Multi-Agent 的设计方案？」（/custom/xiaolin-agent/single_multi） — 要点：Single-Agent 适合任务流程清晰、复杂度适中的场景，实现简单、好维护；Multi-Agent 适合需要专业分工、任务量大或者需要并行执行的复杂场景…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 延伸阅读：如何防止 Agent 死循环浪费 Token、说说 Single-Agent 和 Multi-Agent 的设计方案？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我尽量用你能直接复述的结构来答，先结论后展开。</p><p>【主体】错误率、P95 延迟、Token 成本、业务指标（任务完成率、用户投诉）。Agent 还应看工具失败率、重试率、熔断率。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「如何防止 Agent 死循环浪费 Token」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

### 5.4 可能的追问及应对

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>追问通常考边界与取舍。推荐模板：承认限制（不装完美）→ 给工程兜底（规则/人工/降级）→ 一句业务影响（延迟、成本、体验）。</p><p>下面每题的扩写里也会提示常见追问方向。</p></div>

<p class="guide-followup"><span class="guide-followup-label">追问</span>Agent 长任务怎么做部署不中断？</p>
<p class="guide-followup guide-followup-a"><span class="guide-followup-label">应对</span>任务队列与 Worker、可恢复状态（checkpoint）、K8s 优雅停机（完成手头消息再退出）。</p>
### 5.5 代码示例：极简 Dockerfile 与 Kubernetes Deployment 片段

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>代码示例的目标不是背语法，而是理解：循环怎么转、状态存哪、停止条件是什么、工具 Schema 长什么样。</p><p>面试时说清输入/输出/停止条件即可；若被追问，能指出「哪一行是 Observation 写回上下文」。</p></div>

Dockerfile（应用镜像骨架）
                                                           dockerfile
  FROM python:3.12-slim
  WORKDIR /app
  ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
  COPY requirements.txt .
  RUN pip install --no-cache-dir -r requirements.txt
  COPY . .
  EXPOSE 8000
  HEALTHCHECK --interval=30s --timeout=3s CMD curl -fsS

  http://127.0.0.1:8000/health || exit 1
  CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

deployment.yaml（单副本示意，生产请调 probes 与 resources）
```yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: agent-api
  spec:
    replicas: 2
    selector:
      matchLabels:
          app: agent-api
    template:
      metadata:
          labels:
           app: agent-api
      spec:
          containers:
           - name: api
              image: your-registry/agent-api:v20260401
              ports:
                - containerPort: 8000
              envFrom:
                - secretRef:
                      name: llm-keys
              readinessProbe:
                httpGet:
                    path: /health
                    port: 8000
                initialDelaySeconds: 5

6. 性能优化
```

### 6.1 概念解释

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「概念解释」学习三步：① 用生活类比讲清是什么；② 说解决什么痛点；③ 落到技术词（LLM/规划/记忆/工具）。</p><p>不要一上来堆英文缩写——面试官要的是你能让非技术同学也听懂。</p></div>

Agent 的瓶颈常在 串行 LLM 调用、工具 RTT、过大上下文。优化方向：并行、流式、限流、缓
存、连接复用。
### 6.2 原理详解

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「原理详解」按「输入 → 处理 → 输出 → 失败怎么办」四步理解。</p><p>每看到一个组件，顺手想：它挂了/agent 走偏了，系统怎么兜底？这会让你的回答立刻有工程感。</p></div>

### 6.2.1 异步处理

使用 asyncio 或消息队列，I/O 等待不阻塞线程；多工具无依赖时可并行。
### 6.2.2 流式输出（Streaming）

边生成边返回 SSE，首字时间（TTFB）下降，用户体验好；注意中间状态与最终答案一致性展
示。
### 6.2.3 并发控制

用 Semaphore 限制同时 LLM 调用数，防止把自家或供应商打满触发 429。
### 6.2.4 连接池

HTTP 客户端复用 keep-alive；数据库用连接池。减少握手开销。
### 6.2.5 缓存分层

  L1：进程内 LRU（极低延迟，单机）。
  L2：Redis（多实例共享，需 TTL 与序列化）。
  读路径：L1 → L2 → 回源模型。
### 6.3 面试问题（Q）与标准答案（A）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>本节面试题：每题下方有 **老师讲解**（像上课一样拆答案）、**深度扩写**（加分项）、**口播参考**（60～90 秒）。</p><p>建议流程：先读标准答案 → 读老师讲解 → 关屏用自己的话讲一遍 → 对照口播修正。</p></div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q10</span><span class="guide-q-text">Streaming 会影响计费或日志吗？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>计费仍以 Token 为准；日志需 聚合完整响应 再记一条，或记增量 chunk 并关联trace_id   。注意流式中途断开时的部分结果处理。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】核心围绕「Streaming 会影响计费或日志吗」：把标准答案里的每个要点都能用自己的话展开 2～3 句。</p><p>【为什么考这个】这题和 Engineering 都相关，属于 Agent 面试的高频交叉点。</p><p>【拆开理解】</p><p>1. 计费仍以 Token 为准；日志需聚合完整响应再记一条，或记增量 chunk 并… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】可以把 Agent 想成「会自己查资料、记笔记、调系统的数字员工」，比普通 ChatBot 多了闭环和多步决策。</p><p>【常见误区】</p><p>1. 答案太短，缺少例子或数字；或者只会概念，不会落到工程实践。</p><p>【面试怎么答】结论 → 原理 → 例子 → 边界/兜底。控制在 60～90 秒，留时间给追问。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Agent 系统的延迟优化：Streaming、缓存、批处理」（/custom/ai100-production/090-latency-optimization） — 要点：Agent 系统的延迟优化是生产部署的核心挑战——多步 Agent 工作流经常超过 15 秒，而用户在 3 秒后就开始流失（Nielsen Norman Group 研究）。三大核心优化手段：(1) …</p><p>· 「如何防止 Agent 死循环浪费 Token」（/custom/today-interview/agent-infinite-loop） — 要点：硬上限 + 重复检测 + 无进展熔断三道保险；到线就停、状态可恢复；宁可早停可重试，也不烧 token 空转。…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 延伸阅读：Agent 系统的延迟优化：Streaming、缓存、批处理、如何防止 Agent 死循环浪费 Token。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我尽量用你能直接复述的结构来答，先结论后展开。</p><p>【主体】计费仍以 Token 为准；日志需聚合完整响应再记一条，或记增量 chunk 并关联 trace_id 。注意流式中途断开时的部分结果处理。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「Agent 系统的延迟优化：Streaming、缓存、批处理」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

### 6.4 可能的追问及应对

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>追问通常考边界与取舍。推荐模板：承认限制（不装完美）→ 给工程兜底（规则/人工/降级）→ 一句业务影响（延迟、成本、体验）。</p><p>下面每题的扩写里也会提示常见追问方向。</p></div>

<p class="guide-followup"><span class="guide-followup-label">追问</span>并行工具调用怎么保证顺序？</p>
<p class="guide-followup guide-followup-a"><span class="guide-followup-label">应对</span>若展示需要顺序，可按依赖图拓扑执行；无关则并行，合并结果时带 step_id 。</p>
### 6.5 代码示例：异步 + 信号量 + 简易双层缓存

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>代码示例的目标不是背语法，而是理解：循环怎么转、状态存哪、停止条件是什么、工具 Schema 长什么样。</p><p>面试时说清输入/输出/停止条件即可；若被追问，能指出「哪一行是 Observation 写回上下文」。</p></div>

```python
 import asyncio
 import time

 class TwoLevelCache:
     def __init__(self):
           self.l1 = {}
           self.redis = None    #   接入 redis.asyncio
     async def get(self, key: str):
           if key in self.l1:
               return self.l1[key]
           # val = await redis.get(key)
           return None

     async def set(self, key: str, value: str, ttl: int = 300):
           self.l1[key] = value
           # await redis.setex(key, ttl, value)

 async def limited_llm_call(sema: asyncio.Semaphore, fn, *args, **kwargs):
     async with sema:
           return await fn(*args, **kwargs)

7. 评估与测试
```

### 7.1 概念解释

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「概念解释」学习三步：① 用生活类比讲清是什么；② 说解决什么痛点；③ 落到技术词（LLM/规划/记忆/工具）。</p><p>不要一上来堆英文缩写——面试官要的是你能让非技术同学也听懂。</p></div>

没有度量就没有优化。Agent 评估要覆盖：对不对（准确性）、稳不稳（鲁棒性）、快不快与贵不贵
（效率），并结合线上真实分布持续回归。
### 7.2 原理详解

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「原理详解」按「输入 → 处理 → 输出 → 失败怎么办」四步理解。</p><p>每看到一个组件，顺手想：它挂了/agent 走偏了，系统怎么兜底？这会让你的回答立刻有工程感。</p></div>

### 7.2.1 Agent 评估维度

| 维度 | 含义 | 示例指标 |
| --- | --- | --- |
| 准确性 | 任务是否完成、答案是否正确 | 人工标注、LLM-as-judge（需谨慎） |
| 鲁棒性 | 噪声、对抗、边界输入 | 成功率方差、最坏 case |
| 效率 | 步数、延迟、费用 | 平均工具调用次数、Token |

### 7.2.2 自动化测试框架

  单元测试：工具参数解析、路由逻辑、熔断状态机。
  集成测试：Mock LLM 固定输出，验证编排是否符合预期。
  端到端：沙箱环境 + 小型真实调用（控制成本）。
### 7.2.3 基准测试（Benchmark）

固定数据集与评分器，对比不同 Prompt/模型/策略；注意数据泄漏（测试集进训练）与评分器偏
差。
### 7.2.4 人工评估 vs 自动评估

  人工：金标准，贵且慢。
  自动：快，可能偏袒某风格。
  实践：自动跑大规模筛选，人工抽审 争议样本。

### 7.2.5 A/B 测试与回归测试

 A/B：线上分流，看业务与成本。
 回归：新模型/Prompt 必须在评估集上不低于基线再发布。
### 7.3 面试问题（Q）与标准答案（A）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>本节面试题：每题下方有 **老师讲解**（像上课一样拆答案）、**深度扩写**（加分项）、**口播参考**（60～90 秒）。</p><p>建议流程：先读标准答案 → 读老师讲解 → 关屏用自己的话讲一遍 → 对照口播修正。</p></div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q11</span><span class="guide-q-text">用 LLM 给 LLM 打分有什么坑？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>可能 偏好冗长、格式讨好；与裁判模型强相关。应对：人机混合、多裁判投票、规则评分结合、对抗样本集。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】核心围绕「用 LLM 给 LLM 打分有什么坑」：把标准答案里的每个要点都能用自己的话展开 2～3 句。</p><p>【为什么考这个】这题在真实面试里出现频率不低，不能只背结论。</p><p>【拆开理解】</p><p>1. 可能偏好冗长、格式讨好；与裁判模型强相关。应对：人机混合、多裁判投票、规则评分结… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】可以把 Agent 想成「会自己查资料、记笔记、调系统的数字员工」，比普通 ChatBot 多了闭环和多步决策。</p><p>【常见误区】</p><p>1. 答案太短，缺少例子或数字；或者只会概念，不会落到工程实践。</p><p>【面试怎么答】结论 → 原理 → 例子 → 边界/兜底。控制在 60～90 秒，留时间给追问。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「LLM-as-Judge：使用 LLM 评估 LLM 输出」（/custom/ai100-evaluation/071-llm-as-judge） — 要点：LLM-as-Judge 是用一个强大的 LLM（如 GPT-4）自动评估另一个 LLM 输出质量的技术，在成本和质量之间取得了最佳平衡。两种核心模式：**Pointwise 评分**（对单个输出按维…</p><p>· 「什么是 LLM Agent？与传统 LLM 应用有何区别？」（/custom/ai100-agent-arch/001-what-is-llm-agent） — 要点：LLM Agent 是以大语言模型为核心推理引擎、能够自主感知环境、制定计划、调用工具并执行多步任务的智能系统。与传统 LLM 应用（单轮问答、文本生成）最大的区别在于：Agent 是有状态的、目标驱…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 延伸阅读：LLM-as-Judge：使用 LLM 评估 LLM 输出、什么是 LLM Agent？与传统 LLM 应用有何区别？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我尽量用你能直接复述的结构来答，先结论后展开。</p><p>【主体】可能偏好冗长、格式讨好；与裁判模型强相关。应对：人机混合、多裁判投票、规则评分结合、对抗样本集。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「LLM-as-Judge：使用 LLM 评估 LLM 输出」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q12</span><span class="guide-q-text">如何设计 Agent 的回归测试集？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>覆盖主路径、典型失败、工具错误、长上下文、多语言；每条用例含输入、期望工具或期望答案要点、不可出现项；版本化并与 CI 集成。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】覆盖主路径、典型失败、工具错误、长上下文、多语言。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 覆盖主路径、典型失败、工具错误、长上下文、多语言；每条用例含输入、期望工具或期望… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像员工的笔记本 + 公司 Wiki：笔记本记当前任务，Wiki 记长期规则和客户档案。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「说说 Single-Agent 和 Multi-Agent 的设计方案？」（/custom/xiaolin-agent/single_multi） — 要点：Single-Agent 适合任务流程清晰、复杂度适中的场景，实现简单、好维护；Multi-Agent 适合需要专业分工、任务量大或者需要并行执行的复杂场景…</p><p>· 「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」（/custom/xiaolin-agent/patterns） — 要点：我理解 Agent 和 Workflow 最核心的区别是「谁来决定下一步」…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 记忆：事实 vs 推断分开存、写入时机、冲突合并、跨会话权限。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 延伸阅读：说说 Single-Agent 和 Multi-Agent 的设计方案？、了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。</p><p>【主体】覆盖主路径、典型失败、工具错误、长上下文、多语言；每条用例含输入、期望工具或期望答案要点、不可出现项；版本化并与 CI 集成。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「说说 Single-Agent 和 Multi-Agent 的设计方案？」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

### 7.4 可能的追问及应对

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>追问通常考边界与取舍。推荐模板：承认限制（不装完美）→ 给工程兜底（规则/人工/降级）→ 一句业务影响（延迟、成本、体验）。</p><p>下面每题的扩写里也会提示常见追问方向。</p></div>

<p class="guide-followup"><span class="guide-followup-label">追问</span>线上指标与离线评估不一致？</p>
<p class="guide-followup guide-followup-a"><span class="guide-followup-label">应对</span>数据分布偏移、用户更「难」、工具线上权限不同；建立 slice 分析 与线上采样标注。</p>
### 7.5 代码示例：pytest 集成测试（Mock LLM）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>代码示例的目标不是背语法，而是理解：循环怎么转、状态存哪、停止条件是什么、工具 Schema 长什么样。</p><p>面试时说清输入/输出/停止条件即可；若被追问，能指出「哪一行是 Observation 写回上下文」。</p></div>

```python
 import pytest

 class FakeLLM:
     def __init__(self, replies):
           self.replies = iter(replies)

     def chat(self, messages):
           return next(self.replies)

 def run_agent_stub(user_goal: str, tools: dict, llm: FakeLLM) -> str:
     """ 最小编排：第一轮让模型返回 tool JSON，第二轮返回最终答案。"""
     first = llm.chat([])
     #   简化：假定 first 就是要调用的 JSON 字符串

      import json

      action = json.loads(first)
      obs = tools[action["tool"]](**action["args"])
      second = llm.chat([{"role": "user", "content": str(obs)}])
      return second

  def test_agent_calls_tool_once():
      replies = [
          '{"tool":"search","args":{"q":"Python"}}',
          "最终答案基于工具结果。",
      ]
      calls = []

      def search(q: str):
          calls.append(q)
          return ["doc1"]

      tools = {"search": search}
      out = run_agent_stub("查 Python", tools, FakeLLM(replies))
      assert calls == ["Python"]
      assert " 最终" in out

```

## 8. 幻觉问题的工程解决方案

### 8.1 概念解释

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「概念解释」学习三步：① 用生活类比讲清是什么；② 说解决什么痛点；③ 落到技术词（LLM/规划/记忆/工具）。</p><p>不要一上来堆英文缩写——面试官要的是你能让非技术同学也听懂。</p></div>

幻觉：模型生成看似合理但事实错误的内容。Agent 场景下危害更大（错误决策、错误工具参
数）。工程上通常 事前—事中—事后 三层治理。
### 8.2 原理详解

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>「原理详解」按「输入 → 处理 → 输出 → 失败怎么办」四步理解。</p><p>每看到一个组件，顺手想：它挂了/agent 走偏了，系统怎么兜底？这会让你的回答立刻有工程感。</p></div>

### 8.2.1 事前预防

  RAG：用检索到的可靠片段 grounding。
  结构化 Prompt：要求「仅依据引用回答」「无依据则说不知道」。
  知识边界：限定领域与数据源。
### 8.2.2 事中控制

  置信度过滤：对分类/抽取任务输出概率或自评（注意校准）。
  工具验证：计算、查询、代码执行以外部世界为准。
### 8.2.3 事后校验

  事实核查：检索交叉验证、与数据库比对。
  引用标注：答案逐句带来源编号，便于人工审核。
### 8.3 面试问题（Q）与标准答案（A）

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>本节面试题：每题下方有 **老师讲解**（像上课一样拆答案）、**深度扩写**（加分项）、**口播参考**（60～90 秒）。</p><p>建议流程：先读标准答案 → 读老师讲解 → 关屏用自己的话讲一遍 → 对照口播修正。</p></div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q13</span><span class="guide-q-text">只靠「请诚实回答」能否解决幻觉？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>不能作为唯一手段。需 RAG/工具/校验 与系统提示结合，并对关键场景 拒答或降级。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】核心围绕「只靠「请诚实回答」能否解决幻觉」：把标准答案里的每个要点都能用自己的话展开 2～3 句。</p><p>【为什么考这个】这题和 RAG、Tool 都相关，属于 Agent 面试的高频交叉点。</p><p>【拆开理解】</p><p>1. 不能作为唯一手段。需 RAG/工具/校验与系统提示结合，并对关键场景拒答或降级。 → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>2. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】结论 → 原理 → 例子 → 边界/兜底。控制在 60～90 秒，留时间给追问。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「高级 RAG 变体：Corrective RAG、Self-RAG、Adaptive…」（/custom/ai100-rag/019-advanced-rag-variants） — 要点：三种高级 RAG 变体各解决不同问题：**Self-RAG** 通过反思 token 动态决定是否检索并自我评估输出质量，提升事实准确性；**Corrective RAG (CRAG)** 在检索后评…</p><p>· 「Corrective RAG / Self-RAG / Adaptive RAG 怎么用 Lan…」（/custom/langgraph-production/061-crag-self-rag-adaptive） — 要点：这道题我会这样回答面试官：这三种高级 RAG 变体在 LangGraph 里的实现差异，本质上是「图拓扑不同」——论文里的算法 = 图上的节点和条件边。面试讲清楚这一点，比背论文公式更有说服力。 Co…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 延伸阅读：高级 RAG 变体：Corrective RAG、Self-RAG、Adaptive…、Corrective RAG / Self-RAG / Adaptive RAG 怎么用 Lan…。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我尽量用你能直接复述的结构来答，先结论后展开。</p><p>【主体】不能作为唯一手段。需 RAG/工具/校验与系统提示结合，并对关键场景拒答或降级。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「高级 RAG 变体：Corrective RAG、Self-RAG、Adaptive…」里有更完整的口播示范，建议对照练一遍。</p><p>如果追问为什么不用纯向量，我会说：编号、专有名词、精确匹配 BM25 更稳，所以 Hybrid + 重排是常态。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q14</span><span class="guide-q-text">RAG 一定能降幻觉吗？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>不一定。若检索质量差、重排序失败、模型忽略上下文，仍可能错答。需 检索评估、重排序、引用约束、拒答策略。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】核心围绕「RAG 一定能降幻觉吗」：把标准答案里的每个要点都能用自己的话展开 2～3 句。</p><p>【为什么考这个】这题和 RAG、Memory、Eval 都相关，属于 Agent 面试的高频交叉点。</p><p>【拆开理解】</p><p>1. 不一定。若检索质量差、重排序失败、模型忽略上下文，仍可能错答。需检索评估、重排序… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>【面试怎么答】结论 → 原理 → 例子 → 边界/兜底。控制在 60～90 秒，留时间给追问。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「高级 RAG 变体：Corrective RAG、Self-RAG、Adaptive…」（/custom/ai100-rag/019-advanced-rag-variants） — 要点：三种高级 RAG 变体各解决不同问题：**Self-RAG** 通过反思 token 动态决定是否检索并自我评估输出质量，提升事实准确性；**Corrective RAG (CRAG)** 在检索后评…</p><p>· 「什么是 Agentic RAG？它与传统 RAG 有何不同？」（/custom/ai100-rag/018-agentic-rag） — 要点：Agentic RAG 在传统 RAG 的"检索→生成"流水线上增加了一个 AI Agent 控制循环。Agent 可以动态决定是否需要检索、从哪个数据源检索、是否需要多轮检索、以及是否需要调用外部工…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 记忆：事实 vs 推断分开存、写入时机、冲突合并、跨会话权限。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 延伸阅读：高级 RAG 变体：Corrective RAG、Self-RAG、Adaptive…、什么是 Agentic RAG？它与传统 RAG 有何不同？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我尽量用你能直接复述的结构来答，先结论后展开。</p><p>【主体】不一定。若检索质量差、重排序失败、模型忽略上下文，仍可能错答。需检索评估、重排序、引用约束、拒答策略。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「高级 RAG 变体：Corrective RAG、Self-RAG、Adaptive…」里有更完整的口播示范，建议对照练一遍。</p><p>如果追问为什么不用纯向量，我会说：编号、专有名词、精确匹配 BM25 更稳，所以 Hybrid + 重排是常态。</p></div>
</div></div>
</div>

### 8.4 可能的追问及应对

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>追问通常考边界与取舍。推荐模板：承认限制（不装完美）→ 给工程兜底（规则/人工/降级）→ 一句业务影响（延迟、成本、体验）。</p><p>下面每题的扩写里也会提示常见追问方向。</p></div>

<p class="guide-followup"><span class="guide-followup-label">追问</span>工具结果与检索矛盾听谁的？</p>
<p class="guide-followup guide-followup-a"><span class="guide-followup-label">应对</span>定义优先级（权威数据库 &gt; 实时工具 &gt; 检索片段）；矛盾时输出不确定并建议人工。</p>
### 8.5 代码示例：带引用约束的 Prompt 片段

<div class="guide-tip"><div class="guide-tip-label">💡 通俗理解</div><p>代码示例的目标不是背语法，而是理解：循环怎么转、状态存哪、停止条件是什么、工具 Schema 长什么样。</p><p>面试时说清输入/输出/停止条件即可；若被追问，能指出「哪一行是 Observation 写回上下文」。</p></div>

```text
你是企业内部助手。仅允许使用「上下文引用」中的事实回答问题。
规则：
```

#### 1. 每一句事实陈述末尾标注引用编号，如 [1][2]。

#### 2. 若上下文不足以回答，输出：

                 「根据已有资料无法确定」，并列出需要补充的信息。

#### 3. 禁止编造未出现在上下文中的数字、日期、人名。

 上下文引用：
 [1] {{snippet_1}}
 [2] {{snippet_2}}

 用户问题：{{user_query}}

#### 9. 综合面试题库（15+ 题）

下列题目覆盖本篇各模块，答案要点可直接用于面试口述。
<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q15</span><span class="guide-q-text">你会如何设计一个多模型网关的架构？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>统一 Adapter 抽象；配置中心维护模型能力与配额；入口做鉴权与租户路由；核心做 优先级调度 + 熔断 + 重试退避 + 降级链；全链路 Trace 与 usage 计费；密钥按租户与环境隔离。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】核心围绕「你会如何设计一个多模型网关的架构」：把标准答案里的每个要点都能用自己的话展开 2～3 句。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 统一 Adapter 抽象；配置中心维护模型能力与配额；入口做鉴权与租户路由；核… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】可以把 Agent 想成「会自己查资料、记笔记、调系统的数字员工」，比普通 ChatBot 多了闭环和多步决策。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>【面试怎么答】目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「四、一个 Agent Trace 里到底要记录什么？」（/custom/kama-agent/agent_harness_observability_interview-四-一个-agent-trace-里到底要记录什么） — 要点：面试官可能会这么问：&amp;quot;如果让你设计 Agent Trace，你会记录哪些字段…</p><p>· 「Trace 和 Span：Agent 执行的可观测性」（/custom/ai100-evaluation/074-traces-and-spans） — 要点：Trace 和 Span 是分布式追踪（Distributed Tracing）的核心概念，被引入 LLM/Agent 系统用于实现**执行可观测性**——理解 Agent "做了什么、花了多久、哪里…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 延伸阅读：四、一个 Agent Trace 里到底要记录什么？、Trace 和 Span：Agent 执行的可观测性。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。</p><p>【主体】统一 Adapter 抽象；配置中心维护模型能力与配额；入口做鉴权与租户路由；核心做优先级调度 + 熔断 + 重试退避 + 降级链；全链路 Trace 与 usage 计费；密钥按租户与环境隔离。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「四、一个 Agent Trace 里到底要记录什么？」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q16</span><span class="guide-q-text">指数退避为什么要加 jitter？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>避免大量客户端在同一时刻齐刷刷重试，造成重试风暴；抖动把时间错开，减轻服务端同步压力。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】避免大量客户端在同一时刻齐刷刷重试，造成重试风暴。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 避免大量客户端在同一时刻齐刷刷重试，造成重试风暴；抖动把时间错开，减轻服务端同步… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】可以把 Agent 想成「会自己查资料、记笔记、调系统的数字员工」，比普通 ChatBot 多了闭环和多步决策。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>【面试怎么答】目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 补一个反例：什么情况下这个方案不适用，你会怎么降级。</p><p>· 补一个数字或指标：怎么证明方案有效。</p><p>· 补一个失败案例：出过什么问题、怎么修的。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。</p><p>【主体】避免大量客户端在同一时刻齐刷刷重试，造成重试风暴；抖动把时间错开，减轻服务端同步压力。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q17</span><span class="guide-q-text">语义缓存如何保证安全？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>分租户隔离、键含模型与 Prompt 版本、相似度阈值保守、敏感任务禁用或二次确认、TTL与主动失效。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】分租户隔离、键含模型与 Prompt 版本、相似度阈值保守、敏感任务禁用或二次确认、TTL 与主动失效。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 分租户隔离、键含模型与 Prompt 版本、相似度阈值保守、敏感任务禁用或二次确… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】可以把 Agent 想成「会自己查资料、记笔记、调系统的数字员工」，比普通 ChatBot 多了闭环和多步决策。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Prompt Chaining：多步骤 Prompt 的设计与编排」（/custom/ai100-prompt/063-prompt-chaining） — 要点：Prompt Chaining（提示链）是将复杂任务分解为多个顺序执行的 LLM 调用，每个调用的输出作为下一个调用的输入。它是 Agentic AI 中最基础的设计模式，也被称为 Pipeline …</p><p>· 「跨模型 Prompt 迁移：如何编写模型无关的 Prompt？」（/custom/ai100-prompt/068-cross-model-prompt-portability） — 要点：跨模型 Prompt 迁移（Cross-Model Prompt Portability）是指让同一个 Prompt 在不同 LLM（GPT-4、Claude、Gemini、Llama 等）上都能有效…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 延伸阅读：Prompt Chaining：多步骤 Prompt 的设计与编排、跨模型 Prompt 迁移：如何编写模型无关的 Prompt？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。</p><p>【主体】分租户隔离、键含模型与 Prompt 版本、相似度阈值保守、敏感任务禁用或二次确认、TTL 与主动失效。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「Prompt Chaining：多步骤 Prompt 的设计与编排」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q18</span><span class="guide-q-text">OpenTelemetry 在 Agent 里一般打哪些 Span？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>顶层请求 Span；子 Span 包括每次 LLM、检索、工具、重试、降级；记录属性如 model、token、tool.name、error.type 。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】核心围绕「OpenTelemetry 在 Agent 里一般打哪些 Span」：把标准答案里的每个要点都能用自己的话展开 2～3 句。</p><p>【为什么考这个】这题和 RAG、Tool 都相关，属于 Agent 面试的高频交叉点。</p><p>【拆开理解】</p><p>1. 顶层请求 Span；子 Span 包括每次 LLM、检索、工具、重试、降级；记录… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>2. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】结论 → 原理 → 例子 → 边界/兜底。控制在 60～90 秒，留时间给追问。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」（/custom/xiaolin-agent/patterns） — 要点：我理解 Agent 和 Workflow 最核心的区别是「谁来决定下一步」…</p><p>· 「说说 Single-Agent 和 Multi-Agent 的设计方案？」（/custom/xiaolin-agent/single_multi） — 要点：Single-Agent 适合任务流程清晰、复杂度适中的场景，实现简单、好维护；Multi-Agent 适合需要专业分工、任务量大或者需要并行执行的复杂场景…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 延伸阅读：了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…、说说 Single-Agent 和 Multi-Agent 的设计方案？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我尽量用你能直接复述的结构来答，先结论后展开。</p><p>【主体】顶层请求 Span；子 Span 包括每次 LLM、检索、工具、重试、降级；记录属性如 model、 token、tool.name、error.type 。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」里有更完整的口播示范，建议对照练一遍。</p><p>如果追问为什么不用纯向量，我会说：编号、专有名词、精确匹配 BM25 更稳，所以 Hybrid + 重排是常态。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q19</span><span class="guide-q-text">工具调用的「两步授权」怎么做？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>模型仅生成「意图与参数」→ 策略服务校验角色、资源 ID、速率 → 执行器真正调用；拒绝时把原因反馈给模型或用户。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】模型仅生成「意图与参数」→策略服务校验角色、资源 ID、速率→执行器真正调用。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 模型仅生成「意图与参数」→策略服务校验角色、资源 ID、速率→执行器真正调用；拒… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像给员工配电脑和系统账号：没有工具只能动嘴，有了工具才能查库存、下单、跑代码。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「什么是 Function Calling ？原理是什么？」（/custom/xiaolin-tools/function_calling） — 要点：Function Calling 我的理解是这样一套机制：开发者用 JSON schema 把工具描述好传给模型，模型判断需要调工具的时候不输出自然语言，而是直接输出一段结构化的 tool_calls…</p><p>· 「Skill 是什么？」（/custom/xiaolin-tools/skill） — 要点：Agent Skill 是把「指令、脚本、模板」一体化打包成可复用能力包的机制，关键在于三件事：Agent 能自动发现它、按需加载它、在需要时调用里面的脚本和资源…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 延伸阅读：什么是 Function Calling ？原理是什么？、Skill 是什么？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。</p><p>【主体】模型仅生成「意图与参数」→策略服务校验角色、资源 ID、速率→执行器真正调用；拒绝时把原因反馈给模型或用户。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「什么是 Function Calling ？原理是什么？」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q20</span><span class="guide-q-text">蓝绿与金丝雀如何取舍？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>蓝绿适合二进制切换、快速回滚、可接受双倍资源；金丝雀适合渐进验证、对错误更敏感的生产流量，资源占用更平滑。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】蓝绿适合二进制切换、快速回滚、可接受双倍资源。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 蓝绿适合二进制切换、快速回滚、可接受双倍资源；金丝雀适合渐进验证、对错误更敏感的… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】可以把 Agent 想成「会自己查资料、记笔记、调系统的数字员工」，比普通 ChatBot 多了闭环和多步决策。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>【面试怎么答】目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 补一个反例：什么情况下这个方案不适用，你会怎么降级。</p><p>· 补一个数字或指标：怎么证明方案有效。</p><p>· 补一个失败案例：出过什么问题、怎么修的。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。</p><p>【主体】蓝绿适合二进制切换、快速回滚、可接受双倍资源；金丝雀适合渐进验证、对错误更敏感的生产流量，资源占用更平滑。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q21</span><span class="guide-q-text">K8s 部署 Agent 服务时 HPA 可以按什么指标扩？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>CPU/内存、自定义指标如 请求队列长度、P95 延迟、429 比例（需 PrometheusAdapter）；注意冷启动与 LLM 长尾延迟。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】CPU/内存、自定义指标如请求队列长度、P95 延迟、429 比例（需 Prometheus Adapter）。</p><p>【为什么考这个】这题和 Eval、Engineering 都相关，属于 Agent 面试的高频交叉点。</p><p>【拆开理解】</p><p>1. CPU/内存、自定义指标如请求队列长度、P95 延迟、429 比例（需 Prom… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】可以把 Agent 想成「会自己查资料、记笔记、调系统的数字员工」，比普通 ChatBot 多了闭环和多步决策。</p><p>【常见误区】</p><p>1. 答案太短，缺少例子或数字；或者只会概念，不会落到工程实践。</p><p>【面试怎么答】结论 → 原理 → 例子 → 边界/兜底。控制在 60～90 秒，留时间给追问。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」（/custom/xiaolin-agent/patterns） — 要点：我理解 Agent 和 Workflow 最核心的区别是「谁来决定下一步」…</p><p>· 「说说 Single-Agent 和 Multi-Agent 的设计方案？」（/custom/xiaolin-agent/single_multi） — 要点：Single-Agent 适合任务流程清晰、复杂度适中的场景，实现简单、好维护；Multi-Agent 适合需要专业分工、任务量大或者需要并行执行的复杂场景…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 延伸阅读：了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…、说说 Single-Agent 和 Multi-Agent 的设计方案？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我尽量用你能直接复述的结构来答，先结论后展开。</p><p>【主体】CPU/内存、自定义指标如请求队列长度、P95 延迟、429 比例（需 Prometheus Adapter）；注意冷启动与 LLM 长尾延迟。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q22</span><span class="guide-q-text">异步一定能提高 Agent 吞吐吗？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>对 I/O 密集（HTTP、DB）通常能；若受 GPU 或单线程推理限制，需配合 批处理、多副本、队列；还要防止 无界并发 压垮下游。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】对 I/O 密集（HTTP、DB）通常能。</p><p>【为什么考这个】这题在真实面试里出现频率不低，不能只背结论。</p><p>【拆开理解】</p><p>1. 对 I/O 密集（HTTP、DB）通常能；若受 GPU 或单线程推理限制，需配合… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】可以把 Agent 想成「会自己查资料、记笔记、调系统的数字员工」，比普通 ChatBot 多了闭环和多步决策。</p><p>【常见误区】</p><p>1. 答案太短，缺少例子或数字；或者只会概念，不会落到工程实践。</p><p>【面试怎么答】结论 → 原理 → 例子 → 边界/兜底。控制在 60～90 秒，留时间给追问。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「说说 Single-Agent 和 Multi-Agent 的设计方案？」（/custom/xiaolin-agent/single_multi） — 要点：Single-Agent 适合任务流程清晰、复杂度适中的场景，实现简单、好维护；Multi-Agent 适合需要专业分工、任务量大或者需要并行执行的复杂场景…</p><p>· 「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」（/custom/xiaolin-agent/patterns） — 要点：我理解 Agent 和 Workflow 最核心的区别是「谁来决定下一步」…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 延伸阅读：说说 Single-Agent 和 Multi-Agent 的设计方案？、了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我尽量用你能直接复述的结构来答，先结论后展开。</p><p>【主体】对 I/O 密集（HTTP、DB）通常能；若受 GPU 或单线程推理限制，需配合批处理、多副本、队列；还要防止无界并发压垮下游。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「说说 Single-Agent 和 Multi-Agent 的设计方案？」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q23</span><span class="guide-q-text">如何监控一次 Agent 任务的「真实成本」？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>汇总每步 prompt+completion tokens × 单价；加上 检索与向量库费用；分摊 基础设施；按租户与功能维度出报表与预算告警。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】汇总每步 prompt+completion tokens × 单价。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 汇总每步 prompt+completion tokens × 单价；加上检索与… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>【面试怎么答】目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」（/custom/xiaolin-agent/patterns） — 要点：我理解 Agent 和 Workflow 最核心的区别是「谁来决定下一步」…</p><p>· 「说说 Single-Agent 和 Multi-Agent 的设计方案？」（/custom/xiaolin-agent/single_multi） — 要点：Single-Agent 适合任务流程清晰、复杂度适中的场景，实现简单、好维护；Multi-Agent 适合需要专业分工、任务量大或者需要并行执行的复杂场景…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 延伸阅读：了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…、说说 Single-Agent 和 Multi-Agent 的设计方案？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。</p><p>【主体】汇总每步 prompt+completion tokens × 单价；加上检索与向量库费用；分摊基础设施；按租户与功能维度出报表与预算告警。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「了解哪些其他的 Agent 设计范式？Agent 和 Workflow的区别是什…」里有更完整的口播示范，建议对照练一遍。</p><p>如果追问为什么不用纯向量，我会说：编号、专有名词、精确匹配 BM25 更稳，所以 Hybrid + 重排是常态。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q24</span><span class="guide-q-text">评估集泄露怎么防？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>严格版本管理；开发与训练数据隔离；禁止把测试集写进 Prompt 示例；定期 刷新 测试用例。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】核心围绕「评估集泄露怎么防」：把标准答案里的每个要点都能用自己的话展开 2～3 句。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 严格版本管理；开发与训练数据隔离；禁止把测试集写进 Prompt 示例；定期刷新… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】可以把 Agent 想成「会自己查资料、记笔记、调系统的数字员工」，比普通 ChatBot 多了闭环和多步决策。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>【面试怎么答】目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「跨模型 Prompt 迁移：如何编写模型无关的 Prompt？」（/custom/ai100-prompt/068-cross-model-prompt-portability） — 要点：跨模型 Prompt 迁移（Cross-Model Prompt Portability）是指让同一个 Prompt 在不同 LLM（GPT-4、Claude、Gemini、Llama 等）上都能有效…</p><p>· 「Prompt Chaining：多步骤 Prompt 的设计与编排」（/custom/ai100-prompt/063-prompt-chaining） — 要点：Prompt Chaining（提示链）是将复杂任务分解为多个顺序执行的 LLM 调用，每个调用的输出作为下一个调用的输入。它是 Agentic AI 中最基础的设计模式，也被称为 Pipeline …</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 延伸阅读：跨模型 Prompt 迁移：如何编写模型无关的 Prompt？、Prompt Chaining：多步骤 Prompt 的设计与编排。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。</p><p>【主体】严格版本管理；开发与训练数据隔离；禁止把测试集写进 Prompt 示例；定期刷新测试用例。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「跨模型 Prompt 迁移：如何编写模型无关的 Prompt？」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q25</span><span class="guide-q-text">线上发现幻觉率升高，你如何排查？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>先看是否 模型/Prompt/RAG 索引 近期变更；抽样 Trace 看 检索命中与引用；检查 工具失败降级 是否变多；对比 离线评估集 与线上 slice。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】先看是否模型/Prompt/RAG 索引近期变更。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 先看是否模型/Prompt/RAG 索引近期变更；抽样 Trace 看检索命中与… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像开卷考试：模型是大脑，检索是把相关页码翻到面前，禁止闭着眼瞎编。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 只说「向量检索」，不提 BM25/Hybrid、重排、引用溯源。</p><p>3. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Prompt Chaining：多步骤 Prompt 的设计与编排」（/custom/ai100-prompt/063-prompt-chaining） — 要点：Prompt Chaining（提示链）是将复杂任务分解为多个顺序执行的 LLM 调用，每个调用的输出作为下一个调用的输入。它是 Agentic AI 中最基础的设计模式，也被称为 Pipeline …</p><p>· 「跨模型 Prompt 迁移：如何编写模型无关的 Prompt？」（/custom/ai100-prompt/068-cross-model-prompt-portability） — 要点：跨模型 Prompt 迁移（Cross-Model Prompt Portability）是指让同一个 Prompt 在不同 LLM（GPT-4、Claude、Gemini、Llama 等）上都能有效…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 检索：Hybrid（向量+BM25）、Recall@K、重排、引用溯源、拒答策略。</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 延伸阅读：Prompt Chaining：多步骤 Prompt 的设计与编排、跨模型 Prompt 迁移：如何编写模型无关的 Prompt？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。</p><p>【主体】先看是否模型/Prompt/RAG 索引近期变更；抽样 Trace 看检索命中与引用；检查工具失败降级是否变多；对比离线评估集与线上 slice。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「Prompt Chaining：多步骤 Prompt 的设计与编排」里有更完整的口播示范，建议对照练一遍。</p><p>如果追问为什么不用纯向量，我会说：编号、专有名词、精确匹配 BM25 更稳，所以 Hybrid + 重排是常态。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q26</span><span class="guide-q-text">小型团队没有 LangSmith，最小可观测方案是什么？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>结构化日志 + trace_id + 每次 LLM/工具的耗时与 token；Sentry 捕获异常；用OpenTelemetry 导出到 Jaeger 或云厂商 APM；评估用 CSV 用例 + CI 脚本。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】结构化日志 + trace_id + 每次 LLM/工具的耗时与 token。</p><p>【为什么考这个】定义题考你能不能「用类比 + 结构」讲清楚，而不是堆术语。面试官想确认你真的理解，而不是背过。</p><p>【拆开理解】</p><p>1. 结构化日志 + trace_id + 每次 LLM/工具的耗时与 token；S… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像给员工配电脑和系统账号：没有工具只能动嘴，有了工具才能查库存、下单、跑代码。</p><p>【常见误区】</p><p>1. 只背一句定义，没有说「和普通 LLM 单次调用差在哪」。</p><p>2. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】15 秒定义 → 30 秒展开组件/流程 → 15 秒举例 → 10 秒和 ChatBot/Chain 的区别。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「LLM-as-Judge：使用 LLM 评估 LLM 输出」（/custom/ai100-evaluation/071-llm-as-judge） — 要点：LLM-as-Judge 是用一个强大的 LLM（如 GPT-4）自动评估另一个 LLM 输出质量的技术，在成本和质量之间取得了最佳平衡。两种核心模式：**Pointwise 评分**（对单个输出按维…</p><p>· 「评估工具对比：Ragas、LangSmith、Braintrust」（/custom/ai100-evaluation/075-evaluation-tools-comparison） — 要点：LLM/Agent 评估工具分为两大类：**评估框架**（定义指标和运行评估，如 Ragas、DeepEval）和**评估平台**（提供完整的评估+监控+协作能力，如 LangSmith、Braint…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 延伸阅读：LLM-as-Judge：使用 LLM 评估 LLM 输出、评估工具对比：Ragas、LangSmith、Braintrust。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我先给一个清晰定义，再用类比帮你建立直觉，最后说和生产的关系。</p><p>【主体】结构化日志 + trace_id + 每次 LLM/工具的耗时与 token；Sentry 捕获异常；用 OpenTelemetry 导出到 Jaeger 或云厂商 APM；评估用 CSV 用例 + CI 脚本。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「LLM-as-Judge：使用 LLM 评估 LLM 输出」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q27</span><span class="guide-q-text">如何做「关键路径」与「非关键路径」分级？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>关键路径（支付、删数据）强模型 + HITL + 审计；非关键（草稿、摘要）小模型 + 宽松超时+ 积极缓存。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】关键路径（支付、删数据）强模型 + HITL + 审计。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 关键路径（支付、删数据）强模型 + HITL + 审计；非关键（草稿、摘要）小模… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】可以把 Agent 想成「会自己查资料、记笔记、调系统的数字员工」，比普通 ChatBot 多了闭环和多步决策。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「checkpoint / checkpointer 是什么？」（/custom/langgraph-hitl/035-checkpointer） — 要点：checkpoint 本质上是图执行到某个 superstep 之后的状态快照，配合 checkpointer（MemorySaver、SQLite、Postgres 等后端）持久化。它解决的问题是：…</p><p>· 「thread_id 怎么设计？和业务主键什么关系？」（/custom/langgraph-hitl/036-thread-id） — 要点：我会从 checkpoint 解决什么问题讲起。 **是什么**：thread_id 是 checkpointer 用来隔离不同会话的标识符，传在 config.configurable.thread…</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 延伸阅读：checkpoint / checkpointer 是什么？、thread_id 怎么设计？和业务主键什么关系？。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。</p><p>【主体】关键路径（支付、删数据）强模型 + HITL + 审计；非关键（草稿、摘要）小模型 + 宽松超时 + 积极缓存。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「checkpoint / checkpointer 是什么？」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q28</span><span class="guide-q-text">并发控制 Semaphore 设多大？</span></div>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>结合 供应商 RPM/TPM、本机 CPU、下游工具容量；压测得到 饱和点，略低于饱和并留余量；按租户分桶避免噪声邻居。</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】结合供应商 RPM/TPM、本机 CPU、下游工具容量。</p><p>【为什么考这个】这题和 Tool、Eval 都相关，属于 Agent 面试的高频交叉点。</p><p>【拆开理解】</p><p>1. 结合供应商 RPM/TPM、本机 CPU、下游工具容量；压测得到饱和点，略低于饱… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像给员工配电脑和系统账号：没有工具只能动嘴，有了工具才能查库存、下单、跑代码。</p><p>【常见误区】</p><p>1. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>【面试怎么答】结论 → 原理 → 例子 → 边界/兜底。控制在 60～90 秒，留时间给追问。</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我尽量用你能直接复述的结构来答，先结论后展开。</p><p>【主体】结合供应商 RPM/TPM、本机 CPU、下游工具容量；压测得到饱和点，略低于饱和并留余量；按租户分桶避免噪声邻居。</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p></div>
</div></div>
</div>

<div class="guide-qa">
<div class="guide-question"><span class="guide-q-label">Q29</span><span class="guide-q-text">为什么 Agent 更需要「版本化」的 Prompt 与模型？</span></div>
<p class="guide-followup guide-followup-a"><span class="guide-followup-label">应对</span>按阶段取舍：先有日志与 trace_id，再有熔断与预算，再上完整评估平台；原则是 越早埋点成本越低。「这些会不会拖慢响应？」</p>
<p class="guide-followup guide-followup-a"><span class="guide-followup-label">应对</span>日志异步、Trace 采样、热路径仅记必要字段；观测开销应 可配置、可降级。小结检查清单（面试前自测）[ ] 能画出：路由 → 熔断 → 重试 → 降级 → 计费 的闭环[ ] 能解释 Closed/Open/Half-Open 与探测流量[ ] 能说出 Token 估算与账单对账的差异[ ] 能列举 Trace 上应挂的 Span 类型[ ] 能描述工具调用的权限与校验分层[ ] 能说清金丝雀与蓝绿的适用场景[ ] 能说明 L1/L2 缓存与语义缓存风险[ ] 能口述幻觉治理的事前—事中—事后祝面试顺利。</p>
<div class="guide-answer">
<div class="guide-answer-head"><span class="guide-a-label">答</span><span class="guide-a-title">标准答案</span></div>
<div class="guide-answer-body">
<p>行为随 Prompt/模型悄悄变化会导致 线上回归难定位；版本化可与 Trace、评估集、回滚策略一一对应。本篇追问应对（通用话术）「你们规模小也要上这么多吗？」</p>
<div class="guide-teach"><span class="guide-teach-label">👨‍🏫 老师讲解</span><p>【结论先说】行为随 Prompt/模型悄悄变化会导致线上回归难定位。</p><p>【为什么考这个】方案题考工程思维：目标是什么 → 为什么选这个方案 → 关键实现细节 → 失败了怎么办。</p><p>【拆开理解】</p><p>1. 行为随 Prompt/模型悄悄变化会导致线上回归难定位；版本化可与 Trace、… → 你要能展开：它解决什么问题、不用它会怎样、生产里怎么验证有效。</p><p>【类比记忆】像给员工配电脑和系统账号：没有工具只能动嘴，有了工具才能查库存、下单、跑代码。</p><p>【常见误区】</p><p>1. 只讲理想路径，不说失败兜底、步数上限、观测指标。</p><p>2. 忽略工具 Schema 描述、鉴权、超时重试和参数校验。</p><p>3. 空谈「要注意安全」，没有最小权限、审计日志、人在回路的具体做法。</p><p>【面试怎么答】目标 1 句 → 方案 2～3 点 → 每点 1 个工程细节 → 兜底/观测 1 句。</p><p>【题库延伸】</p><p>本题还可对照本站其他题库加深理解：</p><p>· 「Trace 和 Span：Agent 执行的可观测性」（/custom/ai100-evaluation/074-traces-and-spans） — 要点：Trace 和 Span 是分布式追踪（Distributed Tracing）的核心概念，被引入 LLM/Agent 系统用于实现**执行可观测性**——理解 Agent "做了什么、花了多久、哪里…</p><p>· 「Prompt Chaining：多步骤 Prompt 的设计与编排」（/custom/ai100-prompt/063-prompt-chaining） — 要点：Prompt Chaining（提示链）是将复杂任务分解为多个顺序执行的 LLM 调用，每个调用的输出作为下一个调用的输入。它是 Agentic AI 中最基础的设计模式，也被称为 Pipeline …</p></div>
<div class="guide-expand"><span class="guide-expand-label">深度扩写</span><p>在标准答案基础上，面试还可以主动补这些「加分项」：</p><p>· 工具：Schema 描述质量、白名单、鉴权、超时重试、危险操作 HITL。</p><p>· 安全：最小权限、审计日志、注入防护、输出审核。</p><p>· 评估：离线集 + 在线监控 + 人工抽检；过程正确性不只最终答案。</p><p>· 工程：模型路由、熔断、缓存、Trace 回放、灰度与回滚。</p><p>· 延伸阅读：Trace 和 Span：Agent 执行的可观测性、Prompt Chaining：多步骤 Prompt 的设计与编排。</p></div>
<div class="guide-oral"><span class="guide-oral-label">🗣️ 口播参考</span><p>【开场】我会按「目标 → 方案 → 细节 → 兜底」四步来说，保证既有设计也有工程落点。</p><p>【主体】行为随 Prompt/模型悄悄变化会导致线上回归难定位；版本化可与 Trace、评估集、回滚策略一一对应。本篇追问应对（通用话术）「你们规模小也要上这么多吗？」应对：按阶段取舍：先有日志与 trace_id，再有熔断与预算，再上完整评估平台；原则是越早埋点成本越低。「这些会不会拖慢响应？」应对：日志异步、Trace 采样、热路径仅记必要字段；观测开销应可配置、可降级。小结检查清单（面试前自测） [ ] 能画出：路由→熔断→重试→降级→计费的闭环 [ ] 能解释 Closed/Open/Half-Open 与探测流量 [ ] 能说出 Token 估算与账单对账的差异 [ ] 能列举 Trace 上应挂的 Span 类型 [ ] 能描述工具调用的权限与校验分层 [ ] 能说清金丝雀与蓝绿的适用场景 [ ] 能说明 L1/L2 缓存与语义缓存风险 [ ] …</p><p>【收尾】以上是我的回答。如果您感兴趣，我可以再画一张架构图，或者举一个我们项目里的具体例子。</p><p>你也可以补充：本站题库「Trace 和 Span：Agent 执行的可观测性」里有更完整的口播示范，建议对照练一遍。</p></div>
</div></div>
</div>
