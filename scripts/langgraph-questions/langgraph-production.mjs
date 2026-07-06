/** LangGraph · 工程实践 */
export default [
  {
    slug: '053-pitfalls',
    title: 'LangGraph 踩过什么坑？',
    round: '一面',
    difficulty: '⭐⭐⭐',
    point: '踩坑',
    priority: 'P0',
    freq: '4+ 篇面经',
    source: '牛客 · 某大厂/阿里国际',
    conclusion: '高频坑：并发覆盖 state、没配 reducer、死循环、每请求 compile、checkpoint 膨胀、条件路由不稳定。',
    followups: '怎么监控发现？ · 哪个坑印象最深？',
    keyPoints: ['状态覆盖最常见', 'recursion_limit 要配业务 fallback', '生产禁止重复 compile'],
    oralAnswer: `牛客原题。我踩过：第一，并行节点覆盖同一 state 字段，后写吞前写，配 reducer 才解；第二，ReAct 无限重试，加 step_count 和重复 tool call 检测；第三，每 HTTP 请求 compile 图导致延迟高，改全局单例；第四，什么都塞 state 导致 checkpoint 巨大，划界外置记忆；第五，LLM 条件路由飘，加规则 fallback。

每个坑我会说怎么发现——stream 看 state、LangSmith trace、监控 P99 延迟。面试官要的是真实工程感，不是背概念。`,
    plainTalk:
      '**一句话**：LangGraph 最常踩的坑就五类——并发写 state 互相覆盖、没 reducer、死循环、每请求 compile 图、checkpoint 越存越大。能讲出「怎么发现、怎么修」比背概念加分十倍。\n\n**打个比方**：像学开车——不是知道「不能闯红灯」就行，得讲出「哪次差点闯、怎么刹住的、后来装了什么提醒」。',
    detailAnswer: `这是牛客某大厂/阿里国际面经的高频原题，面试官要的不是概念背诵，而是真实工程踩坑经历和闭环修复。

第一个坑：并发节点覆盖 state 同一字段。LangGraph 节点可能并行执行，两个节点同时改 state 里同一个字段，后执行的直接把先执行的覆盖，完全没有警告。这是阿里国际面经里最高频的踩坑。修复：给列表类字段配 Annotated reducer，messages 用 add_messages，从「覆盖写」改成「合并写」。发现方式：stream_mode='values' 观察每步 state，发现某字段值突然变少或消失。

第二个坑：ReAct 死循环。工具一直返回空结果，模型无限重试。修复：recursion_limit 设框架级上限；should_continue 条件边里加 step_count 计数；业务层检测重复 tool call 模式。超过 N 轮路由到 fallback 节点而非继续循环。

第三个坑：每 HTTP 请求 compile 图。compile 会做结构检查、绑定 checkpointer、构建执行计划，毫秒到秒级开销。QPS 高时 CPU 浪费明显，P99 延迟抖动。修复：应用启动时 compile 一次存全局单例，请求路径只 invoke。

第四个坑：checkpoint 膨胀。一开始什么都往 state 里塞——跨会话历史、海量检索结果、用户偏好——导致 checkpoint 体积巨大、恢复变慢。修复：图内只留当前任务推进必需的状态，跨会话历史和知识库走外置存储，配 TTL 和里程碑裁剪。

第五个坑：LLM 条件路由不稳定。intent 分类偶尔飘，导致该走 RAG 的走了直答。修复：加规则 fallback（关键词匹配兜底）、confidence 阈值、路由结果日志监控。`,
    codeExample: `# 坑1修复：配 reducer
from typing import Annotated
from langgraph.graph.message import add_messages

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]  # 合并写，不是覆盖

# 坑3修复：启动时 compile
app = builder.compile(checkpointer=pg_saver)  # 全局单例

# 坑2修复：防死循环
app = builder.compile(checkpointer=pg_saver)
config = {"recursion_limit": 25}`,
    followupTips: `- **怎么监控发现**：stream 看 state 变化、LangSmith trace 定位节点、P99 延迟突增告警\n- **哪个坑印象最深**：选并发覆盖或 checkpoint 膨胀，讲清发现→定位→修复闭环\n- **加分项**：每个坑配「怎么发现」的方式，体现真实工程感`,
    pitfalls:
      '只背坑名不讲修复方案；只说「配 reducer」不说具体哪个字段；没提发现方式（stream/LangSmith/监控）显得像背题。',
  },
  {
    slug: '054-node-quality',
    title: '如何保证某个节点的效果？',
    round: '一面',
    difficulty: '⭐⭐⭐',
    point: '节点质量',
    priority: 'P0',
    freq: '3+ 篇面经',
    source: '牛客 · 阿里淘天',
    conclusion: '节点输入输出契约 + 单元测试 + 离线评测集 + 线上节点级成功率/延迟监控 + bad case 回流。',
    followups: '节点效果不好怎么排查？ · prompt 怎么迭代？',
    keyPoints: ['mock 上游 state 单测节点', '黄金集测该节点输出', '监控按 node 名聚合'],
    oralAnswer: `阿里淘天原题。保证节点效果四件事：定义清晰 IO 契约，输入哪些 state 字段、输出哪些更新；mock state 单测节点函数，不依赖整图跑通；为该节点建离线评测集，比如 intent 节点测分类准确率；线上 LangSmith 按 node 聚合成功率、耗时、token。

效果不好先查是输入 state 脏了、prompt 漂移、还是下游 reducer 合并错了。迭代 prompt 要版本化，A/B 对比节点输出再全量发布。`,
    plainTalk:
      '**一句话**：保证节点效果 = 先定清楚「进什么、出什么」，再单测、再离线评测、再线上监控，bad case 回流改进——像给流水线每个工位做质检。\n\n**打个比方**：工厂每个工位有检验标准（IO 契约）、抽检流程（单测）、批量质检报告（离线评测）、实时合格率大屏（线上监控），不合格品回流改进。',
    detailAnswer: `阿里淘天一面原题，考察的是「节点级质量保障体系」而非「调 prompt 碰运气」。我习惯四件事闭环：

第一，定义清晰 IO 契约。每个节点文档化：读哪些 state 字段、写哪些 partial update、字段更新策略（append/覆盖/merge）。intent_node 读 query 写 intent；retrieve_node 读 intent 写 retrieval_docs。契约写在代码注释或 README，团队共识「这个节点负责什么、不负责什么」。

第二，mock state 单测节点函数。节点函数是纯函数（输入 state 返回 partial update），不依赖整图 compile 和 LLM 真实调用。传 mock state 断言返回的 update 结构和字段值。intent_node 测「给定 query X，intent 应为 vector_rag」。这步成本最低、收益最高。

第三，离线评测集。为该节点建黄金集——intent 节点 100 条标注 query→intent 映射，retrieve 节点测 Recall@k。定期跑回归，prompt 改动前后对比指标。比端到端测更精准定位问题节点。

第四，线上节点级监控。LangSmith 或自研按 node_name 聚合：成功率、P99 耗时、token 消耗、错误类型分布。bad case 自动入库回流评测集。

效果不好排查顺序：输入 state 是否被上游污染 → prompt 是否漂移（版本对比）→ reducer 合并是否丢数据 → 下游是否误读该节点输出。prompt 迭代必须版本化，A/B 对比节点输出指标再全量发布。`,
    codeExample: `# 节点 IO 契约 + 单测
def intent_node(state: AgentState) -> dict:
    """读: query | 写: intent (覆盖)"""
    intent = classify(state["query"])
    return {"intent": intent}

def test_intent_node():
    result = intent_node({"query": "论文检索方法", "messages": []})
    assert result["intent"] == "vector_rag"`,
    followupTips: `- **效果不好怎么排查**：输入 state 脏 → prompt 漂移 → reducer 合并错 → 下游误读\n- **prompt 怎么迭代**：版本化、A/B 对比节点指标、再全量发布\n- **加分项**：四层闭环（契约→单测→评测集→监控）、bad case 回流`,
    pitfalls:
      '只依赖端到端测试不拆节点单测；prompt 改动无版本记录无法回滚；监控只有整体成功率无法定位到具体节点。',
  },
  {
    slug: '055-node-monitoring',
    title: '节点级监控怎么做？',
    round: '一面/二面',
    difficulty: '⭐⭐⭐',
    point: '监控',
    priority: 'P0',
    freq: '2+ 篇面经',
    source: '牛客 · 阿里淘天',
    conclusion: 'trace_id 贯穿、每节点记录耗时/输入输出摘要/错误类型，LangSmith 或自研看板按 node 聚合。',
    followups: '和整体 Agent 监控区别？ · 告警阈值怎么定？',
    keyPoints: ['OpenTelemetry/LangSmith span per node', '记录 attempt 次数', '失败率突增告警'],
    oralAnswer: `阿里问「如何做监控」。我答：每次 invoke 生成 trace_id 写 config，每个节点入口打 span：node_name、duration_ms、state 关键字段摘要、是否异常。LangSmith 自动按图结构展示，或导出 Prometheus 指标。

和整体监控区别：节点级能定位是检索慢还是生成慢，而不是只知道端到端超时。告警看单节点失败率环比、P99 延迟、token 突增。

百度面经也强调评测闭环——监控要和离线集联动，线上 bad case 自动入库。`,
    plainTalk:
      '**一句话**：节点级监控 = 给图里每个节点装一个「黑匣子」——记录谁、耗时多少、输入输出摘要、有没有报错，出问题时能定位到具体哪个节点而不是只知道「整体超时」。\n\n**打个比方**：端到端监控像只看「快递总时长」；节点级监控像看「揽收→分拣→运输→派送」每个环节各花了多久，哪一环慢了清清楚楚。',
    detailAnswer: `阿里淘天面经原题「如何做监控」，以及百度面经强调的评测闭环，都指向节点级可观测性。实现分三层：

trace 贯穿：每次 invoke 生成 trace_id 写入 config.configurable，所有节点和 LLM/tool 调用共享同一 trace_id。用户投诉或告警触发时，用 trace_id 拉完整执行轨迹。

节点 span 记录：每个节点入口/出口打 span（LangSmith 自动记录，或 OpenTelemetry 自研），属性包含：node_name、duration_ms、state 关键字段摘要（如 intent 值、retrieval_docs 数量，不是全量 state）、是否异常、attempt 次数（重试场景）、token 消耗。LangSmith 按图结构自动展示节点拓扑和耗时瀑布图；自研方案导出 Prometheus 指标，Grafana 按 node 聚合。

和整体 Agent 监控的核心区别：端到端只知道「回答超时 30s」，节点级能定位「retrieve_node P99 25s、generate_node P99 3s」——问题在检索不在生成。这是生产排障的关键能力。

告警阈值：单节点失败率环比突增（如今日 5% vs 昨日 1%）；P99 延迟超 SLA；token 消耗突增（可能 prompt 膨胀或死循环）；attempt 次数异常（重试风暴）。告警触发后自动采样 bad case 入库离线评测集，形成监控→评测→改进闭环。`,
    codeExample: `# LangSmith 自动 trace（设环境变量即可）
# LANGCHAIN_TRACING_V2=true
# LANGCHAIN_PROJECT=my-agent

# 自研：节点入口打 span
def monitored_node(state, config):
    trace_id = config["configurable"].get("trace_id")
    start = time.time()
    try:
        result = actual_node_logic(state)
        log_span(trace_id, "intent_node", time.time()-start, ok=True)
        return result
    except Exception as e:
        log_span(trace_id, "intent_node", time.time()-start, ok=False, error=str(e))
        raise`,
    followupTips: `- **和整体监控区别**：节点级定位具体慢/失败的 node，端到端只知道总超时\n- **告警阈值**：单节点失败率环比、P99 延迟、token 突增、attempt 异常\n- **加分项**：监控→bad case 入库→离线评测→改进闭环`,
    pitfalls:
      '只记端到端耗时无法定位瓶颈；state 全量记录导致日志爆炸和敏感信息泄露；没关联 trace_id 导致多请求日志混淆。',
  },
  {
    slug: '056-testing-agents',
    title: '怎么测试 LangGraph Agent？',
    round: '二面',
    difficulty: '⭐⭐⭐',
    point: '测试',
    priority: 'P1',
    freq: '2 篇',
    source: 'GitHub 100 Questions',
    conclusion: '三层：节点单测 mock state；子图集成测；端到端黄金集 + mock LLM/tool 固定输出。',
    followups: '怎么 mock 非确定性 LLM？ · CI 怎么跑？',
    keyPoints: ['节点函数纯函数化最好测', 'mock tools 固定返回', 'snapshot 测 state 演化'],
    oralAnswer: `测试策略分层。单元：每个 node 函数传 mock state，断言返回的 partial update。集成：compile 图但 mock LLM 和 tools 固定响应，测条件边走向是否符合预期。E2E：黄金问题集，记录 state 轨迹 snapshot 对比。

非确定性 LLM 用 recorded responses 或 contract test——只断言结构不断言原文。CI 跑单元+集成，E2E 夜间跑省成本。`,
    plainTalk:
      '**一句话**：测 Agent 分三层——先测每个节点函数（最便宜），再测图的路由走向（mock LLM），最后端到端黄金集（最贵放夜间跑）。LLM 非确定性用「录播回复」或「只断言结构」解决。\n\n**打个比方**：测汽车：先测每个零件（节点单测），再测组装后各系统联动（集成测），最后上路跑（E2E）——不会每改一个螺丝就上路跑一圈。',
    detailAnswer: `LangGraph Agent 测试的核心优势是「图结构可分层测」——不必每次改 prompt 都跑完整 E2E。我习惯三层策略：

单元测试（节点级）：每个 node 函数是纯函数，传 mock state 断言返回的 partial update。不依赖 compile、不调用真实 LLM。intent_node 测分类准确性；should_continue 条件函数测路由逻辑。成本最低，CI 每次 commit 都跑。

集成测试（图级）：compile 图，但 mock LLM 和 tools 返回固定响应。测条件边走向是否符合预期——「mock LLM 返回 tool_call → 应路由到 tool_node → 再回 agent_node」。snapshot 对比 state 演化轨迹。CI 每次 commit 跑，成本可控。

E2E 测试（端到端）：黄金问题集（50-100 条），用 recorded LLM responses（录播模式）或 contract test（只断言输出结构、不断言原文）。对比 state 轨迹 snapshot 或最终 answer 质量指标。夜间 CI 跑，成本较高。

mock 非确定性 LLM 的两种策略：recorded responses——首次运行录下 LLM 输出，后续 replay；contract test——断言「回答包含引用来源」「intent 字段存在」等结构约束，不断言具体措辞。CI 策略：单元+集成每次 PR 跑，E2E 夜间或 pre-release 跑。`,
    codeExample: `# 单元：节点单测
def test_should_continue():
    assert should_continue({"step_count": 5, "messages": []}) == "continue"
    assert should_continue({"step_count": 25, "messages": []}) == "fallback"

# 集成：mock LLM 测路由
@pytest.fixture
def mock_llm(monkeypatch):
    monkeypatch.setattr("llm.invoke", lambda x: AIMessage(content="", tool_calls=[...]))

def test_react_loop(mock_llm):
    result = app.invoke({"messages": [HumanMessage("查天气")]})
    assert "get_weather" in str(result)`,
    followupTips: `- **mock 非确定性 LLM**：recorded responses 录播 replay，或 contract test 只断言结构\n- **CI 怎么跑**：单元+集成每次 PR，E2E 夜间/pre-release\n- **加分项**：三层分离、snapshot 测 state 演化、条件边路由可单测`,
    pitfalls:
      '只跑 E2E 导致反馈慢、成本高；mock LLM 返回和真实差异太大导致集成测通过但线上失败；节点函数有副作用（直接调 API）导致无法单测。',
  },
  {
    slug: '057-deployment',
    title: 'LangGraph 生产环境怎么部署？',
    round: '二面',
    difficulty: '⭐⭐⭐',
    point: '部署',
    priority: 'P1',
    freq: '2 篇',
    source: 'GitHub + 工程实践',
    conclusion: 'FastAPI 暴露 invoke/stream；图全局 compile 单例；Postgres checkpointer；worker 队列处理长任务。',
    followups: 'LangGraph Platform 了解吗？ · 多副本 state 怎么存？',
    keyPoints: ['无状态 API + 有状态 checkpointer', '水平扩展靠共享 Postgres', 'stream 用 SSE/WebSocket'],
    oralAnswer: `部署模式：应用启动 compile 图存全局；FastAPI 路由 POST /chat 调 ainvoke 或 astream，config 带 thread_id；checkpointer 用 Postgres 多副本共享；长任务丢 Celery worker。

别把图编译进 serverless 冷启动——太慢。secrets 走环境变量不进 state。可选 LangGraph Platform 托管，自研就是 Docker + K8s + 共享 PG。

高德/编程导航面经强调 Guardrails 输入输出安全要部署层配合，不只是图内节点。`,
    plainTalk:
      '**一句话**：生产部署 = API 层无状态（多副本随便扩）+ checkpointer 有状态（Postgres 共享）+ 图启动时 compile 一次 + 长任务丢队列。\n\n**打个比方**：餐厅前台（API）可以开很多个收银台，但订单记录（checkpoint）存在中央数据库里，哪个收银台都能查到同一桌的点菜历史。',
    detailAnswer: `LangGraph 生产部署的核心架构是「无状态 API + 有状态 checkpointer」，实现水平扩展。

应用层：FastAPI/Flask 暴露 REST 或 WebSocket 接口。应用启动时（lifespan/startup 事件）compile 图存 app.state.graph 全局单例，请求路径只 invoke/astream，绝不 compile。POST /chat 接收 user_message + thread_id，调用 app.astream(input, config) 流式返回；config 带 thread_id 实现会话隔离。

checkpointer 层：开发用 MemorySaver，生产用 PostgresSaver（或 Redis）。多个 API 副本共享同一个 Postgres checkpointer 实例——任何副本都能加载任意 thread_id 的历史 checkpoint，实现无会话粘滞的负载均衡。thread_id 由客户端或 API 层生成，与业务主键分离。

长任务处理：超过 30s 的 Agent 任务不应阻塞 HTTP 连接。模式：API 接收请求后立即返回 task_id，任务丢 Celery/RQ worker 异步执行，结果写 checkpointer；客户端轮询或 WebSocket 推送进度。worker 同样共享 Postgres checkpointer。

其他生产要点：secrets（API key）走环境变量，不进 state（checkpoint 会序列化 state）；stream 用 SSE 或 WebSocket；Guardrails 输入输出安全在部署层（API gateway）和图内节点双层配合；可选 LangGraph Platform 托管，自研方案是 Docker + K8s + 共享 PG + LangSmith trace。`,
    codeExample: `# FastAPI 生产部署骨架
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app):
    app.state.graph = builder.compile(checkpointer=PostgresSaver(conn_string))
    yield

@app.post("/chat")
async def chat(req: ChatRequest):
    config = {"configurable": {"thread_id": req.thread_id}}
    async for event in app.state.graph.astream(
        {"messages": [HumanMessage(req.message)]}, config
    ):
        yield sse_event(event)`,
    followupTips: `- **LangGraph Platform**：官方托管方案，自研是 Docker+K8s+共享 PG\n- **多副本 state**：Postgres checkpointer 共享，API 无状态随便扩\n- **加分项**：长任务异步队列、secrets 不进 state、Guardrails 双层配合`,
    pitfalls:
      'serverless 冷启动 compile 图导致首请求秒级延迟；checkpointer 用 MemorySaver 导致多副本会话不共享；secrets 写入 state 被 checkpoint 持久化泄露。',
  },
  {
    slug: '058-no-recompile-per-request',
    title: '为什么生产环境不能每个请求都 compile 图？',
    round: '二面',
    difficulty: '⭐⭐',
    point: '性能',
    priority: 'P1',
    freq: '2 篇',
    source: 'CSDN 工程实践',
    conclusion: 'compile 有结构检查和对象构建开销，应应用启动时一次，请求只 invoke 已编译实例。',
    followups: '热更新图怎么做？ · 多版本图共存？',
    keyPoints: ['compile 在 startup 事件', '请求路径零 compile', '版本变更灰度新 graph 实例'],
    oralAnswer: `compile 会做图验证、绑定 checkpointer、构建内部执行计划，毫秒到秒级开销。每请求 compile 在 QPS 高时 CPU 浪费明显，P99 延迟也抖。

正确做法： lifespan 里 compile 存 app.state.graph，路由里直接 invoke。热更新可以加载 graph_v2 实例，按 header 或 tenant 路由到不同版本，旧 thread 用旧图 finish。`,
    plainTalk:
      '**一句话**：compile 图就像「编译代码」——启动时做一次，请求时只「运行」已编译好的实例。每请求 compile 等于每次访问网站都重新 npm build 一遍。\n\n**打个比方**：compile 是「把菜谱定稿并培训厨师」，invoke 是「按定稿菜谱做菜」。不会每个客人点菜都重新写菜谱、重新培训厨师。',
    detailAnswer: `这是 CSDN 工程实践类面经的常考题，考察对 LangGraph 生命周期的理解。compile() 不是轻量操作——它做这些事：图结构验证（孤立节点检查、边完整性）；绑定 checkpointer 和 interrupt 配置；构建内部执行计划和节点调度表；创建 CompiledGraph 对象。整体开销从毫秒到秒级，取决于图复杂度。

每请求 compile 的问题：QPS 100 时每秒 compile 100 次，CPU 大量浪费在重复的结构检查上；P99 延迟抖动——compile 时间不稳定；无法享受编译后的内部优化缓存。在 serverless（Lambda/Cloud Functions）冷启动场景下尤其致命——compile 可能占冷启动时间的大头。

正确做法：应用 lifespan/startup 事件里 compile 一次，存 app.state.graph 或模块级全局变量。请求路由里直接 app.state.graph.ainvoke(input, config)，零 compile 开销。FastAPI 用 @asynccontextmanager lifespan；Flask 用 before_first_request（已废弃）或应用工厂模式。

热更新和多版本：加载 graph_v2 实例与 v1 并存，按 request header、tenant_id 或 thread 创建时间路由到对应版本。旧 thread 用旧图 finish，新 thread 用新图。灰度期间新旧并行，全量切换后下线旧实例。`,
    codeExample: `# 错误：每请求 compile
@app.post("/chat")
async def chat_bad(req):
    app = builder.compile()  # 每次都 compile！
    return await app.ainvoke(...)

# 正确：启动时 compile 一次
app.state.graph = builder.compile(checkpointer=pg_saver)

@app.post("/chat")
async def chat_good(req):
    return await app.state.graph.ainvoke(...)`,
    followupTips: `- **热更新图**：加载新 graph 实例，按 header/tenant 路由，旧 thread 用旧图 finish\n- **多版本共存**：graph_v1 和 graph_v2 并存，灰度期间新旧并行\n- **加分项**：量化 compile 开销（毫秒到秒级）、serverless 冷启动场景`,
    pitfalls:
      '在 serverless 里每请求 compile 导致冷启动秒级延迟；热更新时强制所有 thread 切新图导致旧 checkpoint 不兼容；compile 时传入请求级 config 导致无法全局单例。',
  },
  {
    slug: '059-graph-migration',
    title: '图定义变更后旧 thread 怎么办？',
    round: '二面',
    difficulty: '⭐⭐⭐',
    point: '迁移',
    priority: 'P1',
    freq: '2 篇',
    source: 'ModelEngine + GitHub',
    conclusion: 'state schema 向后兼容；新字段默认值；删字段写迁移；灰度期间按 thread 版本路由到对应图。',
    followups: '会不会毒化既有 thread？ · 官方迁移指引？',
    keyPoints: ['新增 channel 可选', 'checkpoint 与 schema 版本绑定', '不可兼容时冻结旧 thread'],
    oralAnswer: `ModelEngine 社区题：图变更可能让旧 checkpoint 与新 schema 失配。做法：新增字段给默认值，节点读字段用 .get()；删字段要有迁移脚本把旧 checkpoint 洗一遍；严重不兼容时旧 thread 只允许只读或强制归档，新 thread 用新图。

灰度：graph_version 写 config，路由层选编译实例。LangGraph 文档有 graph migration 指引，面试提到版本化说明考虑过运维。`,
    plainTalk:
      '**一句话**：改图就像改数据库 schema——新字段给默认值，删字段写迁移脚本，大改不兼容就让旧 thread 归档、新 thread 用新图。\n\n**打个比方**：App 升级后旧用户数据还要能读——新增字段默认空、删字段先迁移再删，大版本不兼容就「旧账号只读、新账号新体验」。',
    detailAnswer: `ModelEngine 社区和 GitHub 面经都考过这题：图定义变更后，旧 thread 的 checkpoint 可能与新 schema 失配。这是生产运维的真实问题，不是理论题。

向后兼容变更（安全）：新增 state 字段——给默认值，节点读字段用 state.get("new_field", default)，旧 checkpoint 缺这个字段也能跑。删除 state 字段——先写迁移脚本把旧 checkpoint 里该字段洗掉或归档，再发新版图。修改 reducer 语义——最危险，等价于改合并逻辑，需要充分测试。

不可兼容变更（需策略）：state schema 大改、节点 rename、边拓扑重构——旧 checkpoint 无法在新图里正确恢复。策略：旧 thread 只允许只读查看历史（archive 模式），不允许 resume；新 thread 用新图；或写专门的 migration 函数把旧 checkpoint 转换为新 schema。

灰度方案：graph_version 写入 config 或 thread metadata，路由层按版本选择对应 compile 实例。graph_v1 和 graph_v2 并存，旧 thread 自动路由到 v1 finish，新 thread 路由到 v2。全量切换后下线 v1 实例。

LangGraph 官方文档有 graph migration 指引。面试提到「版本化图定义 + 灰度 + 不可兼容时冻结旧 thread」，说明考虑过运维而非只写 demo。`,
    codeExample: `# 向后兼容：新字段用 .get()
def new_node(state: AgentState) -> dict:
    retry_count = state.get("retry_count", 0)  # 旧 checkpoint 无此字段
    return {"retry_count": retry_count + 1}

# 灰度：按版本路由
GRAPHS = {"v1": graph_v1, "v2": graph_v2}
def get_graph(config):
    version = config.get("graph_version", "v2")
    return GRAPHS[version]`,
    followupTips: `- **会不会毒化既有 thread**：向后兼容变更不会；不可兼容变更需冻结旧 thread 或写 migration\n- **官方迁移指引**：LangGraph 文档有 graph migration 章节\n- **加分项**：版本化图定义、灰度路由、不可兼容时 archive 旧 thread`,
    pitfalls:
      '删字段不迁移直接发版导致旧 checkpoint 反序列化失败；修改 reducer 语义未充分测试导致 state 合并行为变化；强制所有旧 thread 切新图导致恢复失败。',
  },
  {
    slug: '060-langgraph-rag',
    title: 'LangGraph 里怎么集成 RAG？',
    round: '一面/二面',
    difficulty: '⭐⭐⭐',
    point: 'RAG 集成',
    priority: 'P1',
    freq: '3+ 篇面经',
    source: '牛客 · 阿里淘天',
    conclusion: 'RAG 作为 retrieve/grade/generate 节点嵌入图，质量门控不通过走 rewrite 环，比线性 RAG Chain 更可控。',
    followups: 'CRAG/Self-RAG 怎么画？ · 和科研问答项目怎么讲？',
    keyPoints: ['retrieve → grade → 分支', '不够好 rewrite query 回 retrieve', 'cite_check 再环'],
    oralAnswer: `RAG 不是 LangGraph 外挂，而是图中的节点链：retrieve_node 调向量库写 retrieval_docs；grade_node LLM 评判相关性；条件边不够则 rewrite_query_node 回到 retrieve，够了则 generate_node；可选 cite_check 不通过回 generate。

比线性 Chain 强在：检索失败能改写重试，生成能据引用校验回流。科研问答项目就是这套——意图路由 + 质量门控 + 引用校验环，面试最好画 state 字段和边。

阿里淘天面经捆绑问 RAG 分块、重叠，可接在 retrieve 节点实现细节后讲。`,
    plainTalk:
      '**一句话**：RAG 在 LangGraph 里不是外挂插件，而是「检索→评判→不够好就改写重查→生成→校验引用」的节点链，每个环节是一条边，不够好可以回退重试。\n\n**打个比方**：线性 RAG Chain 像单行道——检索完只能往前生成；LangGraph RAG 像环岛——检索不满意可以绕回去换关键词再检索。',
    detailAnswer: `RAG 与 LangGraph 的集成是 Agent 岗面经最高频的捆绑考点（阿里淘天、某大厂、编程导航均有）。核心思路：RAG 不是 LangGraph 的外挂插件，而是嵌入图内的节点链，每个环节是一个 node，环节之间的质量门控是条件边。

标准 RAG 图拓扑：retrieve_node 调向量库/混合检索，结果写入 state.retrieval_docs；grade_node 用 LLM 评判检索结果与 query 的相关性，写入 state.grade_score；条件边——score 低于阈值则路由到 rewrite_query_node（改写 query 写回 state.query）再回到 retrieve_node 形成环；score 够高则路由到 generate_node 基于 retrieval_docs 生成 answer；可选 cite_check_node 校验 answer 是否有 retrieval_docs 支撑，不通过则回 generate_node 重写。

比线性 RAG Chain 的核心优势：检索失败能改写 query 重试（而非带着空结果让 LLM 幻觉）；生成质量不够能据引用校验回流；每个节点可独立单测和监控；checkpoint 让「检索→评判→改写→再检索」的完整轨迹可追溯。

科研问答项目讲法：意图路由（intent_node 决定走向量 RAG 还是 GraphRAG）+ 质量门控（grade + rewrite 环）+ 引用校验（cite_check 环）。面试最好画 state 字段（query、retrieval_docs、grade_score、answer）和边。阿里淘天捆绑问的 RAG 分块、重叠、embedding 选型，可接在 retrieve_node 实现细节后讲。`,
    codeExample: `builder.add_node("retrieve", retrieve_node)
builder.add_node("grade", grade_node)
builder.add_node("rewrite", rewrite_query_node)
builder.add_node("generate", generate_node)

builder.add_edge("retrieve", "grade")
builder.add_conditional_edges("grade", lambda s: "rewrite" if s["grade_score"] < 0.7 else "generate", {
    "rewrite": "rewrite", "generate": "generate"
})
builder.add_edge("rewrite", "retrieve")  # 回边形成环
builder.add_edge("generate", END)`,
    followupTips: `- **CRAG/Self-RAG 怎么画**：CRAG 加 web_search 补检索；Self-RAG 生成带自评 token 回流\n- **科研问答怎么讲**：意图路由 + grade/rewrite 环 + cite_check 环，画 state 和边\n- **加分项**：对比线性 Chain 优势、每节点可单测、阿里淘天 RAG 分块可接 retrieve 细节`,
    pitfalls:
      'grade 阈值设太高导致永远 rewrite 死循环——需 max_retry 上限；retrieve 结果全量塞 state 导致 checkpoint 膨胀；generate 不做 cite_check 导致幻觉回答。',
  },
  {
    slug: '061-crag-self-rag-adaptive',
    title: 'Corrective RAG / Self-RAG / Adaptive RAG 怎么用 LangGraph 实现？',
    round: '二面',
    difficulty: '⭐⭐⭐⭐',
    point: '高级 RAG',
    priority: 'P2',
    freq: '1 篇',
    source: 'GitHub 100 Questions',
    conclusion: 'CRAG：grade 后不好则 web_search 补检索；Self-RAG：生成带自评 token 条件回流；Adaptive：入口 router 选 RAG 策略。',
    followups: '和科研问答 grade_retrieval 关系？',
    keyPoints: ['每种是不同条件边拓扑', 'Self-RAG 多 generate+critique 环', 'Adaptive 多一路由节点'],
    oralAnswer: `三种都是图拓扑差异。CRAG：grade 节点判相关低 → 条件边到 web_search 节点补资料 → 再 merge 回 context → generate。Self-RAG：generate 输出含 is_supported 自评，不支持则回 retrieve 或 rewrite。Adaptive：入口 router 根据问题类型选 vector RAG、不用 RAG 直答、或 SQL 路径。

科研问答的 grade_retrieval + rewrite 就是 CRAG 思想。讲清楚「论文里的算法 = 图上的节点和边」，面试官会认为你真做过。`,
    plainTalk:
      '**一句话**：CRAG、Self-RAG、Adaptive RAG 不是三个框架，而是三种「图拓扑」——区别只在于节点和条件边怎么连，论文算法 = 图上的 node + edge。\n\n**打个比方**：三种 RAG 像三种导航策略——CRAG 是「本地地图不够就上网查」；Self-RAG 是「到了目的地自己评价路线对不对」；Adaptive 是「出发前先决定开车、地铁还是步行」。',
    detailAnswer: `这三种高级 RAG 变体在 LangGraph 里的实现差异，本质上是「图拓扑不同」——论文里的算法 = 图上的节点和条件边。面试讲清楚这一点，比背论文公式更有说服力。

Corrective RAG (CRAG)：在标准 RAG 的 grade 节点之后，如果相关度低，条件边不是简单 rewrite query，而是路由到 web_search 节点补充外部资料，再通过 merge_context 节点把 web 结果和原有 retrieval_docs 合并，然后 generate。拓扑：retrieve → grade → [低分] → web_search → merge → generate。科研问答项目的 grade_retrieval + rewrite 就是 CRAG 的简化版。

Self-RAG：generate 节点输出 answer 的同时输出自评 token（is_supported、is_relevant 等），critique 节点解析自评结果，条件边——不支持则回 retrieve 或 rewrite；支持但不够相关则回 generate 重写；全通过则 END。比 CRAG 多了「生成后自评」的环节，形成 generate → critique → [不通过] → retrieve/rewrite 的内环。

Adaptive RAG：入口多一个 router 节点，根据问题类型（事实问答/推理/闲聊/结构化查询）选择不同 RAG 策略——vector RAG 路径、GraphRAG 路径、直答（不用 RAG）、SQL 查询路径。每种策略是图上的一个分支，router 是入口条件边。适合问题类型差异大的综合问答系统。

三种模式可以组合：Adaptive 选策略 → CRAG 质量门控 → Self-RAG 生成自评。`,
    codeExample: `# CRAG：grade 低分走 web_search 补检索
builder.add_conditional_edges("grade", lambda s: "web" if s["score"] < 0.5 else "generate", {
    "web": "web_search", "generate": "generate"
})
builder.add_edge("web_search", "merge_context")
builder.add_edge("merge_context", "generate")

# Adaptive：入口 router 选策略
builder.add_conditional_edges("router", lambda s: s["strategy"], {
    "vector_rag": "retrieve", "direct": "generate", "sql": "sql_query"
})`,
    followupTips: `- **和科研问答 grade_retrieval 关系**：就是 CRAG 思想——grade 不够好就改写/补充再检索\n- **加分项**：「论文算法 = 图上的 node + edge」；三种模式可组合\n- **区分点**：CRAG 补外部资料、Self-RAG 生成后自评、Adaptive 入口选策略`,
    pitfalls:
      'CRAG web_search 结果不 merge 直接覆盖 retrieval_docs 丢原有上下文；Self-RAG 自评 token 解析不稳定导致误回流；Adaptive router 分类不准导致策略选错。',
  },
  {
    slug: '062-context-compression',
    title: 'LangGraph 里上下文压缩怎么做？',
    round: '一面',
    difficulty: '⭐⭐⭐',
    point: '上下文',
    priority: 'P1',
    freq: '3+ 篇面经',
    source: '牛客 · 某大厂/字节',
    conclusion: '在图中加 trim/summarize 节点，进 LLM 前裁剪 messages；可多层：工具结果摘要、滚动摘要、长期记忆检索回填。',
    followups: '压缩过度怎么发现？ · 字节三层压缩怎么答？',
    keyPoints: ['独立 compression 节点', '保留 system+最近 k 轮+摘要', '压缩触发条件写 state token 估计'],
    oralAnswer: `某大厂面经「上下文压缩方式」。在 LangGraph 里压缩是显式节点：before_llm 节点估算 token，超阈值则 summarize 旧 messages 写 summary 字段，trim messages 只留最近几轮+摘要。

字节追问三层压缩——可答：工具输出摘要层、对话滚动摘要层、长期记忆检索层，每层不同触发条件和保留策略，不一致因为信息密度不同。

压缩过度看评测集答案质量跌、或用户追问「你忘了刚才说的」——监控 summary 丢失实体数。`,
    plainTalk:
      '**一句话**：上下文压缩在 LangGraph 里是显式节点——进 LLM 前检查 token 是否超标，超标就把旧对话摘要、只留最近几轮，像给聊天记录做「精简版」。\n\n**打个比方**：开会记录太长，秘书出一份「会议纪要」代替原始逐字稿，但保留最近几轮原话——LLM 看摘要+最近对话，而不是从头读到尾。',
    detailAnswer: `某大厂和字节面经都考「上下文压缩方式及优劣」，在 LangGraph 里压缩是显式节点而非隐式 hack，这是关键差异。

基础压缩节点：before_llm_node 在每次调 LLM 前执行——估算当前 messages 的 token 数（写 state.estimated_tokens），超过阈值则触发压缩：用 summarize 模型把旧 messages 压缩成 state.conversation_summary，trim messages 只保留 system prompt + 最近 k 轮对话 + summary。压缩后 estimated_tokens 重新估算，仍超标则进一步 trim k 值。

字节追问的「三层压缩」答法：第一层，工具输出摘要——tool_node 返回的大段 JSON/日志在写入 messages 前先经 summarize_tool_output 节点压缩，因为工具输出信息密度低、冗余多；第二层，对话滚动摘要——多轮对话后 before_llm 节点把旧 messages 压缩成 summary，保留最近 k 轮；第三层，长期记忆——跨会话的用户偏好和历史不在 messages 里，存在外置向量库，需要时 retrieve 回填。三层触发条件和保留策略不同，因为信息密度不同。

压缩过度的发现方式：离线评测集 answer 质量指标下降（尤其需要长上下文记忆的问题）；线上用户追问「你忘了刚才说的」；监控 summary 中关键实体（人名、订单号）丢失数量。压缩策略需要可配置——k 值、阈值、summary 模型选型都可以 A/B 测试。`,
    codeExample: `def compress_node(state: AgentState) -> dict:
    tokens = estimate_tokens(state["messages"])
    if tokens < 4000:
        return {}  # 不压缩
    summary = summarize(state["messages"][:-6])  # 摘要旧消息
    trimmed = [state["messages"][0]] + state["messages"][-6:]  # system + 最近6条
    return {"messages": trimmed, "conversation_summary": summary}

builder.add_node("compress", compress_node)
builder.add_edge("compress", "agent")  # 进 LLM 前压缩`,
    followupTips: `- **压缩过度怎么发现**：评测集质量跌、用户说「你忘了」、监控 summary 丢实体\n- **字节三层压缩**：工具输出摘要 / 对话滚动摘要 / 长期记忆检索，各层触发条件不同\n- **加分项**：压缩是显式节点可单测、策略可 A/B、不是隐式 hack`,
    pitfalls:
      '压缩时把 system prompt 也 trim 掉导致行为漂移；summary 丢失关键实体（订单号、错误码）导致后续节点无法工作；所有层用同一阈值导致工具输出未压缩但对话已压缩的不一致。',
  },
  {
    slug: '063-langsmith-observability',
    title: 'LangGraph 与 LangSmith 可观测性怎么集成？',
    round: '二面',
    difficulty: '⭐⭐⭐',
    point: '可观测',
    priority: 'P1',
    freq: '2 篇',
    source: 'GitHub 100 Questions',
    conclusion: '设 LANGCHAIN_TRACING 环境变量自动 trace 每节点；可看轨迹、评测、对比 prompt 版本。',
    followups: '不用 LangSmith 怎么自建？ · 成本数据从哪来？',
    keyPoints: ['自动记录 node/LLM/tool span', 'dataset 回归评测', '反馈 bad run 到数据集'],
    oralAnswer: `LangSmith 和 LangGraph 同属生态，开 tracing 后每次 invoke 自动记录节点输入输出、LLM 调用、tool 延迟。用于 debug 走错哪条边、对比 prompt 版本、跑 dataset 回归。

不用 LangSmith 可 OpenTelemetry 自研：节点入口出口打 span，属性带 thread_id、node_name。成本从 LLM callback 聚合 token。

百度面经强调评测闭环——LangSmith 是把在线 trace 沉淀成离线评测集的桥梁。`,
    plainTalk:
      '**一句话**：LangSmith 和 LangGraph 是亲兄弟——开个环境变量，每次运行自动记录每个节点、每次 LLM 调用、每个工具的输入输出和耗时，像给 Agent 装了行车记录仪。\n\n**打个比方**：LangSmith 是「飞行黑匣子」——出问题时回放完整轨迹，看走了哪条路、哪一步慢了、哪一步错了。',
    detailAnswer: `LangSmith 与 LangGraph 同属 LangChain 生态，集成成本极低但价值很大——是生产级 Agent 可观测性的默认方案。

自动 trace：设置环境变量 LANGCHAIN_TRACING_V2=true 和 LANGCHAIN_API_KEY，每次 graph.invoke/astream 自动记录完整 trace——每个节点的输入 state 摘要、输出 partial update、耗时；每次 LLM 调用的 prompt、response、token 数、延迟；每次 tool 调用的参数、返回值、延迟。trace 按 thread_id 组织，可在 LangSmith UI 按图拓扑瀑布图查看。

核心用途：debug——用户投诉「回答不对」时，用 thread_id 拉 trace 看走了哪条边、哪个节点产出异常；prompt 版本对比——同一输入在不同 prompt 版本下的 node 输出 diff；dataset 回归——从线上 trace 采样 good/bad case 入库，定期跑回归评测；成本分析——从 LLM callback 聚合 token 消耗，按 node/用户/时间段统计。

不用 LangSmith 的自建方案：OpenTelemetry 标准——节点入口/出口打 span，属性带 thread_id、node_name、duration_ms；LLM callback 记录 token；导出到 Jaeger/Grafana/Prometheus。成本更高但无 vendor lock-in。

百度面经强调评测闭环：LangSmith 的核心价值是把在线 trace 沉淀成离线评测集的桥梁——线上 bad case → 一键入库 → 离线回归 → prompt 改进 → 上线验证。`,
    codeExample: `# LangSmith 零代码集成
# export LANGCHAIN_TRACING_V2=true
# export LANGCHAIN_API_KEY=ls-...
# export LANGCHAIN_PROJECT=my-agent-prod

# 自研 OpenTelemetry 方案
from opentelemetry import trace
tracer = trace.get_tracer("langgraph")

def traced_node(state, config):
    with tracer.start_as_current_span("intent_node") as span:
        span.set_attribute("thread_id", config["configurable"]["thread_id"])
        return intent_logic(state)`,
    followupTips: `- **不用 LangSmith 自建**：OpenTelemetry span per node，导出 Jaeger/Prometheus\n- **成本数据从哪来**：LLM callback 聚合 token，按 node/用户/时间段统计\n- **加分项**：评测闭环（在线 trace → 离线 dataset → 回归 → 改进）`,
    pitfalls:
      'trace 记录全量 state 导致敏感信息泄露和存储爆炸；只开 trace 不做 dataset 回归导致 bad case 沉淀不下来；没关联 thread_id 导致多用户 trace 混淆。',
  },
  {
    slug: '064-production-ready',
    title: '如何构建生产级（Production-Ready）LangGraph Agent？',
    round: '二面',
    difficulty: '⭐⭐⭐⭐',
    point: '生产级',
    priority: 'P1',
    freq: '2 篇',
    source: 'GitHub Production Guide',
    conclusion: '清单：全局 compile、Postgres checkpoint、HITL 高危操作、分层重试、节点监控、评测集、限流熔断、schema 版本化。',
    followups: '和生产 demo 最大差别？ · 第一优先级做什么？',
    keyPoints: ['可恢复 > 可观测 > 可评测', '幂等和 HITL 缺一不可', '别跳过 Workflow 验证阶段'],
    oralAnswer: `生产级 checklist：图启动单例 compile；Postgres checkpointer + thread 隔离；高危节点 interrupt；tool 幂等；recursion_limit + fallback；节点级 trace 和告警；离线黄金集+在线抽检；输入输出 Guardrails；限流熔断；state schema 版本管理。

GitMMQ 生产指南核心观点：LangGraph 价值是把黑盒循环变成可审计状态机。推荐路径：先用简单 agent 验证业务，遇到状态/循环/审批痛点再迁 LangGraph，配 LangSmith 评测。

和 demo 最大差别：考虑了崩溃恢复、幂等、监控、bad case 闭环，而不是 invoke 能跑通就行。`,
    plainTalk:
      '**一句话**：生产级 Agent = demo 能跑通 + 崩溃能恢复 + 操作有幂等 + 全程可监控 + bad case 能回流改进。缺任何一条都是玩具。\n\n**打个比方**：demo 是「实验室里跑通一次实验」；生产级是「工厂 24 小时运转——机器坏了能修、次品能检出、工艺能迭代」。',
    detailAnswer: `GitHub Production Guide 和多家面经（百度、阿里、编程导航）共同指向的生产级 checklist，按优先级排列：

第一优先级——可恢复：应用启动时 compile 图全局单例；Postgres checkpointer 多副本共享；thread_id 会话隔离；recursion_limit + fallback 防死循环；state schema 版本管理 + 图迁移策略。这是「崩溃后不能丢状态」的底线。

第二优先级——可观测：LangSmith 或 OpenTelemetry 节点级 trace；按 node 聚合成功率、P99 延迟、token 消耗；告警阈值（失败率环比、延迟突增）；trace_id 贯穿。这是「出问题能定位」的能力。

第三优先级——可评测：离线黄金集定期回归；线上 bad case 自动入库；prompt 版本化 A/B 对比；节点级离线评测（不只端到端）。这是「持续改进」的闭环。

第四优先级——安全与韧性：高危操作（发邮件、扣款、删数据）interrupt 人工审批；tool 调用幂等键；输入输出 Guardrails（部署层 + 图内双层）；限流熔断（连续失败 N 次转人工）；secrets 不进 state。

GitMMQ 生产指南核心观点：LangGraph 价值是把黑盒循环变成可审计状态机。推荐路径：先用简单 Workflow/Chain 验证业务需求，遇到状态管理/循环/审批痛点再迁 LangGraph——不要为了炫技提前上图编排。

和 demo 的最大差别：demo 是 invoke 能跑通；生产级考虑了崩溃恢复、幂等、监控、bad case 闭环、schema 版本化。面试按「可恢复 > 可观测 > 可评测 > 安全韧性」顺序讲，体现工程优先级感。`,
    codeExample: `# 生产级 checklist 骨架
# 1. 启动时 compile + Postgres checkpointer
app.state.graph = builder.compile(
    checkpointer=PostgresSaver(DB_URL),
    interrupt_before=["execute_action"],
)

# 2. 请求带 thread_id + trace
config = {
    "configurable": {"thread_id": req.thread_id},
    "recursion_limit": 25,
}

# 3. 流式 + 监控
async for event in app.state.graph.astream(input, config):
    yield event  # LangSmith 自动 trace`,
    followupTips: `- **和生产 demo 最大差别**：demo 能跑通；生产级有恢复、幂等、监控、评测闭环\n- **第一优先级做什么**：可恢复（Postgres checkpoint + thread 隔离 + fallback）\n- **加分项**：GitMMQ 推荐路径「先 Workflow 验证再迁 LangGraph」、按优先级排序`,
    analogy: '生产级 = 实验室原型 vs 工厂 24 小时运转——机器坏了能修、次品能检出、工艺能迭代。',
    pitfalls:
      '跳过 Workflow 验证阶段直接用 LangGraph 导致过度设计；有 checkpoint 但没 interrupt 导致高危操作无审批；有 trace 但没 dataset 回归导致 bad case 沉淀不下来。',
  },
]
