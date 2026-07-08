/** 自动生成 + 可人工润色 */
export default {
  leadTip: "项目问答集用 STAR 讲真实落地：背景→目标→你的动作→量化结果。92 题覆盖架构、RAG、工具、观测、性能、故障处理，建议挑 5 个故事练到能脱稿。",
  sectionTips: {
    "0.6": "读「≤ confidence < 0.85 → 向用户确认意图。」时抓住一个关键词，想想对应到你项目里是哪一块；没有项目就用「假如做客服 Agent」来举例。",
    "0.4": "读「≤ rerank_score < 0.7 → 中等相关，作为补充信息。」时抓住一个关键词，想想对应到你项目里是哪一块；没有项目就用「假如做客服 Agent」来举例。",
  },
  qaList: [
    {
      question: "为什么选择 ReAct 模式而不是 Plan-and-Execute？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：在设计企业级 AI Agent 系统时，需要在 ReAct（Reasoning + Acting）和 Plan- and-Execute 两种主流 Agent 范式之间做出架构决策。业务场景包括客服问答、知识检索、工具调。",
    },
    {
      question: "为什么采用多路检索而不是单一向量检索？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：企业知识库包含大量结构化和非结构化数据，单一向量检索在某些场景下召回率不足。例如，精确的编号查询（如\"工单号 WO-20240315-001\"）在纯语义检索中表现很差。 Task：设计一个兼顾语义理解和精确匹配的检索架构。",
    },
    {
      question: "Agent 编排器是怎么设计的？为什么这样设计？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：系统需要协调多个组件（意图识别、检索、生成、工具调用等）的执行流程，需要一个灵活且可扩展的编排机制。 Task：设计一个能支持多种执行模式（顺序、并行、条件分支）且易于扩展的 Agent 编排器。 Action： ## 。",
    },
    {
      question: "多 Agent 协作和单 Agent 有什么区别？你怎么选择？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：随着业务复杂度增加，单个 Agent 的 Prompt 越来越长，工具数量越来越多，开始出现能力退化和维护困难的问题。 Task：评估是否需要从单 Agent 架构迁移到多 Agent 协作架构，以及如何设计协作机制。 。",
    },
    {
      question: "意图识别模块是怎么实现的？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提缓存、模型路由、批量与流式。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：企业客服场景中，用户意图多样（咨询、投诉、查询订单、操作请求等），且存在大量隐含意图和多意图混合的情况（如\"我的订单怎么还没到，我要退款\"同时包含查询和操作意图）。 Task：设计一个准确率高、可扩展的意图识别模块，能处。",
    },
    {
      question: "为什么选择 Milvus 而不是其他向量数据库？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：项目需要一个向量数据库来存储和检索文档 embedding，候选方案包括 Milvus、 Pinecone、Weaviate、Qdrant、Chroma、FAISS 等。 Task：综合评估各方案的性能、功能、运维成本，。",
    },
    {
      question: "系统的可扩展性是怎么设计的？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：系统需要支持业务快速迭代，包括新增工具、新增知识源、新增 Agent 类型、新增模型等，不能每次都改核心代码。 Task：设计一套可扩展架构，让新功能接入的边际成本趋近于零。 Action： ## 1. 插件化工具系统：。",
    },
    {
      question: "如果让你重新设计这个系统，你会怎么改进？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：系统已经稳定运行一段时间，积累了很多实践经验和教训，有一些当初的设计决策在回头看是可以优化的。 Task：基于实际运行经验，总结需要改进的点，给出具体的优化方案。 Action： ## 1. 评估引入（Evaluatio。",
    },
    {
      question: "你的系统能支持多少并发？怎么评估的？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：系统上线前需要进行压力测试，评估系统的并发处理能力，确保能满足业务高峰期的需求。 Task：设计压测方案，找到系统的性能瓶颈和容量上限。 Action： ## 1. 压测工具和方法：使用 Locust 进行分布式压测，模。",
    },
    {
      question: "为什么要做模型路由？直接用一个模型不行吗？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：系统每月的 LLM API 费用高达数万元，且不同类型的查询对模型能力的需求差异很大。简单查询用 GPT-4 是浪费，复杂推理用小模型又不够。 Task：设计一个智能模型路由机制，在保证回答质量的前提下，显著降低 tok。",
    },
    {
      question: "怎么设计的对话管理和上下文维护？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：企业客服场景中多轮对话非常普遍，需要在多轮交互中维护一致的上下文，同时控制 token 消耗。 Task：设计对话管理系统，在有限的 context window 内高效利用上下文信息。 Action： ## 1. 分层。",
    },
    {
      question: "你的系统支持哪些模型？怎么做模型适配的？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Schema 描述、鉴权与超时重试。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：企业客户有不同的模型偏好：有的要用 OpenAI，有的要用国产模型（如通义千问、文心一言），有的有本地部署需求。 Task：设计统一的模型抽象层，让系统可以无缝切换不同的 LLM 提供商。 Action： ## 1. 统。",
    },
    {
      question: "如何处理长文档输入？上下文窗口不够怎么办？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：企业文档动辄数万字甚至数十万字，远超模型的 context window 限制（如 GPT-4 的 8K/32K/128K）。 Task：设计一套长文档处理方案，在不丢失关键信息的前提下，让系统能处理任意长度的文档。 A。",
    },
    {
      question: "系统的安全架构是怎么设计的？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提最小权限、审计日志与人在回路。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：企业级 AI 系统面临多种安全威胁：Prompt 注入、数据泄露、恶意输入、越权访问等。 Task：建立多层安全防护体系，确保系统的安全性和数据合规性。 Action： ## 1. 输入安全层（Prompt 注入防护）：。",
    },
    {
      question: "你怎么看待 MCP（Model Context Protocol）？在你的系统中是怎么使",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Schema 描述、鉴权与超时重试。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：用的？ Situation： Anthropic 发布了 MCP 协议，提供了一种标准化的方式让 AI 模型与外部工具和数据源交互。需要评估是否在系统中采用 MCP。 Task：评估 MCP 的价值，决定是否以及如何在现有系统中集成 MCP。",
    },
    {
      question: "如何设计 Agent 的错误恢复和重试机制？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：生产环境中 Agent 执行过程会遇到各种错误：LLM API 超时、工具调用失败、检索无结果等。简单的重试可能导致资源浪费或无限循环。 Task：设计一套智能的错误恢复机制，让 Agent 能优雅地处理各种异常情况。 。",
    },
    {
      question: "你的系统支持多租户吗？怎么实现的？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：系统需要同时服务多个企业客户，每个客户有自己的知识库、配置和数据隔离要求。 Task：设计多租户架构，确保数据隔离、配置独立、性能互不影响。 Action： ## 1. 数据隔离策略：知识库隔离：每个租户在 Milvus。",
    },
    {
      question: "你怎么看 Agent 架构的未来发展？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Schema 描述、鉴权与超时重试。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation： AI Agent 技术发展迅速，架构范式在不断演进，需要对未来趋势有前瞻性判断。 Task：分析 Agent 架构的发展趋势，给出有见地的观点。 Action： ## 1. 当前阶段的特点（2024-2025）：以 R。",
    },
    {
      question: "向量数据库是怎么选型的？分块策略是什么？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：企业知识库包含多种格式的文档（PDF、Word、HTML、Markdown），需要建立高效的向量检索系统。文档分块质量直接影响检索效果。 Task：选择合适的向量数据库并设计科学的文档分块策略。 Action： ## 1。",
    },
    {
      question: "ReAct 的 Prompt 是怎么设计的？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Schema 描述、鉴权与超时重试。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation： ReAct 模式的效果严重依赖 Prompt 设计质量。需要让 LLM 严格遵循 Thought → Action → Observation 的循环模式，同时保持灵活性。 Task：设计一套高效且鲁棒的 ReAct 。",
    },
    {
      question: "熔断器是怎么实现的？三个状态是什么？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提缓存、模型路由、批量与流式。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation： LLM API 和外部服务经常出现间歇性故障，如果持续重试会浪费资源并增加延迟。需要一个熔断机制来快速失败和自动恢复。 Task：实现 Circuit Breaker 模式，保护系统在下游服务异常时的稳定性。 Acti。",
    },
    {
      question: "记忆系统的短期和长期记忆是怎么配合的？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation： Agent 需要在单次对话中维护上下文（短期记忆），同时在跨会话中记住用户偏好和历史交互（长期记忆）。 Task：设计分层记忆系统，实现短期和长期记忆的协同工作。 Action： ## 1. 短期记忆（Working 。",
    },
    {
      question: "文档解析支持哪些格式？怎么处理表格和图片？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Schema 描述、鉴权与超时重试。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：企业知识库中的文档格式多样，包括 PDF、Word、Excel、PPT、HTML、 Markdown 等，且包含大量表格和图片。 Task：建立一套全格式文档解析管道，确保各类内容都能被有效提取和索引。 Action： 。",
    },
    {
      question: "重排序是怎么做的？用的什么模型？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：多路检索后得到大量候选 chunk（通常 30-60 个），需要精排后选出最相关的 top-5 给 LLM 生成答案。粗排的向量相似度和 BM25 分数不够精确。 Task：实现高质量的重排序（Reranking）模块，。",
    },
    {
      question: "Function Calling 和 MCP 有什么区别？你怎么选的？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Schema 描述、鉴权与超时重试。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：系统需要让 Agent 调用外部工具。Function Calling（OpenAI 原生支持）和 MCP （Anthropic 提出的开放协议）是两种主流方案。 Task：理解两者的差异，选择适合项目的方案或混合使用。。",
    },
    {
      question: "会话摘要压缩的阈值是多少？怎么确定的？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提分层记忆与写入策略（事实 vs 推断）。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：长对话会导致 context window 超限，需要对历史对话做摘要压缩。但压缩太早会丢失信息，压缩太晚会超出 token 限制。 Task：确定最优的摘要压缩阈值和策略。 Action： ## 1. 阈值设定：触发阈。",
    },
    {
      question: "RRF 融合排序的公式是什么？权重怎么调？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：多路检索（向量 + 关键词 + 知识图谱）各自返回排序结果，需要融合成统一的排序。 Task：实现一个公平、有效的多路结果融合算法。 Action： ## 1. RRF（Reciprocal Rank Fusion）公式。",
    },
    {
      question: "嵌入模型用的什么？维度多少？怎么选的？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：嵌入模型的选择直接影响向量检索质量。需要在效果、速度、成本之间找到平衡。 Task：选择最适合中文企业场景的嵌入模型。 Action： ## 1. 候选模型对比：模型维度中文能力 MTEB 排名速度 BGE-M3 102。",
    },
    {
      question: "Guardrails（护栏）是怎么实现的？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation： Agent 的输出需要多维度的质量和安全把控：格式合规、内容安全、事实准确性、业务合规等。 Task：实现一套可扩展的 Guardrails 框架，确保 Agent 输出的质量和安全。 Action： ## 1. Gu。",
    },
    {
      question: "怎么实现的 Streaming 流式输出？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提步数上限、停止条件与任务清单防迷失。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation： LLM 生成完整回答通常需要 3-10 秒，如果等完全生成后才返回，用户体验很差。需要实现逐 token 的流式输出。 Task：实现端到端的流式输出管道，从 LLM 到前端的全链路流式传输。 Action： ## 1。",
    },
    {
      question: "怎么做的日志和链路追踪？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation： Agent 系统的执行链路复杂（用户输入→意图识别→检索→工具调用→生成），需要完整的可观测性来排查问题。 Task：建立全链路的日志和追踪系统。 Action： ## 1. 日志分级体系： INFO：请求/响应概要、。",
    },
    {
      question: "怎么做的异步并行处理？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation： Agent 执行过程中有很多 I/O 密集型操作（LLM API 调用、数据库查询、外部 API 调用），同步执行会导致大量等待时间。 Task：识别可并行化的操作，用异步编程提升系统吞吐量。 Action： ## 1。",
    },
    {
      question: "知识图谱是怎么构建和使用的？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：纯向量检索难以处理实体关系类查询（如\"张三负责哪些项目\"、\"A 产品和 B 产品有什么关联\"），需要知识图谱补充。 Task：构建领域知识图谱，并与向量检索系统协同工作。 Action： ## 1. 知识图谱构建流程：实。",
    },
    {
      question: "怎么做的 A/B 测试和 Prompt 版本管理？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Schema 描述、鉴权与超时重试。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation： Prompt 的微小改动可能导致输出质量的显著变化，需要科学的方法来管理和评估 Prompt 变更。 Task：建立 Prompt 版本管理和 A/B 测试机制。 Action： ## 1. 版本管理：所有 Promp。",
    },
    {
      question: "Token 计数和费用统计是怎么实现的？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation： LLM API 按 token 计费，需要精确统计每次调用的 token 消耗，用于成本控制和计费。 Task：实现精确的 token 计数和费用统计系统。 Action： ## 1. Token 计数方案：输入 To。",
    },
    {
      question: "怎么做的数据预处理和数据清洗？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：企业文档质量参差不齐：有 OCR 错误、格式混乱、重复内容、过时信息等。低质量数据直接影响检索和生成质量。 Task：建立数据预处理管道，确保入库数据的质量。 Action： ## 1. 数据清洗管道：原始文档→格式转换。",
    },
    {
      question: "Token 成本是怎么控制的？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：系统月均 token 消耗超过 5000 万，API 费用是运营成本的主要组成部分。 Task：在不影响回答质量的前提下，大幅降低 token 成本。 Action： ## 1. 模型路由优化（最大收益）： 60% 简单。",
    },
    {
      question: "延迟优化做了哪些措施？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：系统初期端到端延迟（用户提问到收到回答）平均 6.5 秒，用户体验不佳，目标是降低到 3 秒以内。 Task：全链路延迟优化，将 P50 延迟降到 3 秒以内。 Action： ## 1. 链路分析（各环节耗时）：意图识。",
    },
    {
      question: "缓存策略是什么？命中率多少？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：企业客服场景存在大量重复和相似的问题，每次都调用 LLM 浪费资源。 Task：设计多层缓存策略，提升系统响应速度并降低成本。 Action： ## 1. 多层缓存架构： L1 ——精确匹配缓存（Redis）： Key：。",
    },
    {
      question: "流式输出是怎么实现的？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：（详见技术实现类 Q12，此处补充性能优化视角） Situation：非流式模式下，用户需要等待 LLM 完全生成后才能看到回答，感知延迟长。 Task：实现全链路流式输出，优化用户感知延迟。 Action： ## 1. TTFT（Time。",
    },
    {
      question: "异步处理在哪些地方使用了？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：（详见技术实现类 Q14，此处补充更多场景） Situation：系统中大量 I/O 密集型操作，同步处理会严重限制吞吐量。 Task：全面采用异步编程，提升系统并发处理能力。 Action： ## 1. 实时路径（async/await）。",
    },
    {
      question: "数据库查询是怎么优化的？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：随着数据量增长，部分数据库查询变慢，影响 Agent 工具调用的响应速度。 Task：优化数据库查询性能，确保工具调用延迟在可接受范围内。 Action： ## 1. 向量数据库（Milvus）优化：索引选择：数据量 &。",
    },
    {
      question: "模型推理速度是怎么优化的？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提缓存、模型路由、批量与流式。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：本地部署的模型（用于 embedding、reranking 等）推理速度需要优化。 Task：提升本地模型的推理速度，降低延迟。 Action： ## 1. 模型量化： Embedding 模型（BGE-M3）使用 I。",
    },
    {
      question: "前端渲染性能怎么优化？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提缓存、模型路由、批量与流式。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：前端在展示流式输出和长对话时存在性能问题：频繁 DOM 更新导致卡顿、长对话列表滚动不流畅。 Task：优化前端渲染性能，确保流畅的用户体验。 Action： ## 1. 流式输出渲染优化： Token 缓冲：不是每收到。",
    },
    {
      question: "冷启动问题是怎么解决的？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可补一句你在项目里如何验证该方案有效（指标或案例）。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：系统重启或新实例扩容时存在冷启动问题：模型加载慢、缓存为空、连接池未预热。 Task：减少冷启动对用户的影响。 Action： ## 1. 模型预加载：使用 Kubernetes 的 readinessProbe，模型加。",
    },
    {
      question: "网络传输是怎么优化的？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提缓存、模型路由、批量与流式。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation： LLM API 通常部署在远端（如美西），网络延迟和带宽限制影响系统性能。 Task：优化网络传输环节的延迟和稳定性。 Action： ## 1. API 端点选择：使用 Azure OpenAI 中国区/亚太区端点，。",
    },
    {
      question: "Embedding 计算是怎么优化的？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：知识库初始化需要对大量文档计算 embedding（800 万个 chunk），耗时过长。日常增量更新也需要高效的 embedding 计算。 Task：优化 embedding 计算的吞吐量和效率。 Action： #。",
    },
    {
      question: "怎么做的资源监控和自动扩缩容？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提离线集 + 在线监控 + 人工抽检。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：系统负载随业务高峰期波动很大（如促销期间请求量暴增 5 倍），固定资源配置要么浪费要么不足。 Task：实现基于业务指标的自动扩缩容。 Action： ## 1. 监控指标：基础指标： CPU、内存、网络 I/O。业务指。",
    },
    {
      question: "Agent 死循环怎么检测和防止的？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation： ReAct 模式下，Agent 可能陷入\"思考-行动-观察\"的无限循环。例如检索结果不满意时反复重新检索，或反复调用同一工具但参数不变。 Task：设计检测和防止 Agent 死循环的机制。 Action： ## 1.。",
    },
    {
      question: "模型幻觉怎么控制的？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation： LLM 在没有足够信息时会\"编造\"内容（幻觉），在企业场景中这是严重的问题（如编造不存在的产品功能或价格）。 Task：多层次控制模型幻觉，确保回答基于事实。 Action： ## 1. RAG 基础（最重要）：所有回。",
    },
    {
      question: "模型超时怎么处理？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提缓存、模型路由、批量与流式。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation： LLM API 调用有时会出现超长延迟（> 30s）或直接超时，影响用户体验。 Task：设计模型超时的处理策略，保证用户体验。 Action： ## 1. 超时策略分级：连接超时： 5s（TCP 连接建立）。首 to。",
    },
    {
      question: "检索结果不准确怎么办？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：检索结果不准确是 RAG 系统最常见的问题，表现为：召回的 chunk 与问题无关、关键信息未被召回、排序不准确。 Task：建立检索质量问题的诊断和优化流程。 Action： ## 1. 问题诊断流程：用户反馈→复现查。",
    },
    {
      question: "工具调用失败怎么处理？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation： Agent 调用外部工具（数据库查询、API 调用等）时可能失败：接口不可用、参数错误、权限不足、数据不存在等。 Task：设计工具调用失败的处理策略，保证 Agent 的鲁棒性。 Action： ## 1. 错误分类。",
    },
    {
      question: "多 Agent 之间通信失败怎么处理？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提角色边界、消息协议与冲突仲裁。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：多 Agent 架构中，Agent 之间通过消息传递协作。如果某个 Agent 挂掉或响应超时，会影响整个任务链。 Task：确保多 Agent 系统的容错性和可靠性。 Action： ## 1. 通信超时控制：每个 A。",
    },
    {
      question: "知识库数据不一致怎么处理？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：知识库中可能存在过时信息、矛盾信息（同一主题不同文档说法不一致）、或错误信息。 Task：检测和处理知识库中的数据不一致问题。 Action： ## 1. 时效性管理：每个文档/chunk 标记创建时间和更新时间。检索结。",
    },
    {
      question: "高并发下的限流降级策略是什么？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提离线集 + 在线监控 + 人工抽检。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：突发流量（如营销活动、批量查询）可能导致系统过载，需要保护核心服务不被打垮。 Task：设计分级限流和优雅降级策略。 Action： ## 1. 限流层次： API 网关层：全局限流（总 QPS 上限 500）。租户级限。",
    },
    {
      question: "数据丢失和恢复策略是什么？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可补一句你在项目里如何验证该方案有效（指标或案例）。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：关键数据（对话历史、知识库索引、用户偏好等）的丢失会严重影响服务质量。 Task：建立完善的数据备份和恢复机制。 Action： ## 1. 数据分级：核心数据（RPO=0）：知识库原始文档、用户配置→实时同步备份。重要。",
    },
    {
      question: "模型输出格式异常怎么处理？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提步数上限、停止条件与任务清单防迷失。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation： LLM 有时不按预期格式输出（如应输出 JSON 但输出了纯文本，或 ReAct 格式解析失败）。 Task：建立鲁棒的输出解析和纠正机制。 Action： ## 1. 多层解析策略：严格正则解析→宽松正则解析→ LL。",
    },
    {
      question: "敏感信息泄露怎么防止？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提分层记忆与写入策略（事实 vs 推断）。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation： Agent 在处理用户请求时，可能接触到敏感信息（个人隐私、商业机密），需要防止信息通过 LLM 泄露。 Task：建立敏感信息的全生命周期防护机制。 Action： ## 1. 输入脱敏：使用正则 + NER 模型识。",
    },
    {
      question: "系统容量规划是怎么做的？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提分层记忆与写入策略（事实 vs 推断）。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：需要预估系统未来的资源需求，提前规划容量，避免资源不足或过度浪费。 Task：建立系统容量规划方法论。 Action： ## 1. 容量模型：所需 Pod 数 = 峰值 QPS / (单 Pod QPS × 0.7) #。",
    },
    {
      question: "怎么做的测试？覆盖率多少？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation： AI Agent 系统的测试比传统软件更复杂：LLM 输出不确定、工具调用涉及外部服务、端到端流程长。 Task：建立多层次的测试体系，确保系统质量。 Action： ## 1. 测试金字塔：测试（10%）：完整的用户。",
    },
    {
      question: "怎么做的监控和告警？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation： AI Agent 系统在生产环境中需要全方位监控：不仅是传统的系统指标，还包括 AI 特有的指标（幻觉率、工具调用成功率等）。 Task：建立涵盖系统、业务、AI 三个维度的监控告警体系。 Action： ## 1. 。",
    },
    {
      question: "怎么部署的？CI/CD 是什么流程？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提最小权限、审计日志与人在回路。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：系统需要频繁迭代（每周 1-2 次发版），需要可靠的 CI/CD 流程保障发布质量。 Task：建立自动化的 CI/CD 流水线，确保快速、安全的发布。 Action： ## 1. CI 流水线（代码合入前）：代码提交→。",
    },
    {
      question: "日志系统怎么设计的？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：（详见技术实现类 Q13，此处补充工程视角） Situation： AI Agent 系统的日志需求特殊：不仅要记录请求/响应，还要记录 Agent 的完整推理过程（Thought → Action → Observation 链路）。 T。",
    },
    {
      question: "安全性怎么保证的？（Prompt 注入等）",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Schema 描述、鉴权与超时重试。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：（详见架构类 Q14，此处从工程实践角度补充） Situation： AI Agent 系统面临的安全威胁不断演化，需要持续更新防护策略。 Task：建立安全防护的持续迭代机制。 Action： ## 1. 安全测试常态化：维护一个 Pro。",
    },
    {
      question: "代码质量是怎么保证的？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation： AI Agent 项目涉及多个技术领域（LLM、检索、后端、DevOps），代码质量参差不齐。 Task：建立代码质量保障体系。 Action： ## 1. 代码规范： Python：遵循 PEP 8 + 内部补充规范。",
    },
    {
      question: "文档是怎么维护的？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Schema 描述、鉴权与超时重试。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation： AI Agent 项目知识密集，团队成员需要快速理解系统架构、API 接口、Prompt 模板等。 Task：建立完善的文档体系，降低团队协作和知识传递成本。 Action： ## 1. 文档类型：架构文档：系统架构图。",
    },
    {
      question: "怎么做的版本管理和发布管理？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Schema 描述、鉴权与超时重试。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：系统有多个组件（API、Worker、MCP Server 等），需要协调版本发布。 Task：建立清晰的版本管理和发布策略。 Action： ## 1. 版本命名规范：语义化版本号： MAJOR.MINOR.PATCH。",
    },
    {
      question: "怎么做技术债务管理？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Schema 描述、鉴权与超时重试。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：快速迭代中不可避免地产生技术债务：临时方案、代码坏味道、过时的依赖等。 Task：建立技术债务的识别、记录和偿还机制。 Action： ## 1. 技术债务识别： Code Review 中标记技术债务（ TODO: t。",
    },
    {
      question: "如何做的性能基准测试？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：需要建立性能基准，作为优化的参照和回归检测的标尺。 Task：建立可重复的性能基准测试体系。 Action： ## 1. 基准测试场景：单组件基准：向量检索延迟、LLM 调用延迟、Reranking 延迟。端到端基准：简。",
    },
    {
      question: "怎么做的配置管理？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：系统有大量配置项（模型参数、检索参数、限流阈值、Prompt 模板等），需要灵活管理且支持热更新。 Task：建立统一的配置管理方案。 Action： ## 1. 配置分层：静态配置（代码仓库）：不常变更的配置（数据库连。",
    },
    {
      question: "团队协作和知识共享是怎么做的？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提最小权限、审计日志与人在回路。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation： AI Agent 项目技术栈广（NLP、后端、DevOps、前端），团队成员技能背景各异，需要高效的知识共享。 Task：建立团队协作和知识共享机制。 Action： ## 1. 技术分享：每周一次技术分享（30 分钟。",
    },
    {
      question: "你的系统解决了什么业务问题？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：企业面临大量重复性知识咨询工作，人工客服效率低、一致性差、培训成本高。 Task：设计一个 AI Agent 系统，替代大部分重复性咨询工作，提升服务效率和一致性。 Action： ## 1. 问题分析：客服团队每天处理。",
    },
    {
      question: "用户反馈怎么样？怎么收集和处理的？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation： AI 系统的效果需要持续基于用户反馈优化，但用户不一定愿意主动给反馈。 Task：建立有效的用户反馈收集和处理机制。 Action： ## 1. 反馈收集渠道：显式反馈：每个回答后提供\"有帮助/无帮助\"按钮 + 可选的。",
    },
    {
      question: "你觉得 AI Agent 在企业中的价值是什么？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提离线集 + 在线监控 + 人工抽检。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：面试官考察对 AI Agent 商业价值的理解深度。 Task：从业务视角阐述 AI Agent 的核心价值。 Action： ## 1. 短期价值（降本增效）：重复性工作自动化：客服、数据查询、报告生成等。量化收益：节。",
    },
    {
      question: "和竞品相比你们的优势是什么？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：市场上有很多 AI Agent / RAG 解决方案，需要清晰表达差异化优势。 Task：分析竞争优势，给出有说服力的差异化定位。 Action： ## 1. 竞品分析：通用 AI 平台（如 Coze、Dify）：易用但。",
    },
    {
      question: "下一步的技术规划是什么？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：系统已经稳定运行，需要规划下一阶段的技术演进方向。 Task：制定清晰的技术路线图。 Action： ## 1. 短期（1-3 个月）：引入 Agentic RAG：让 Agent 自主决定检索策略（是否检索、怎么检索、。",
    },
    {
      question: "你在项目中的角色是什么？最大的贡献是什么？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：面试官考察个人在项目中的真实贡献和成长。 Task：清晰表达个人角色和核心贡献。 Action： ## 1. 角色定位：后端技术负责人 / AI 工程师。 ## 2. 核心贡献：架构设计：主导了多路检索融合架构和 Age。",
    },
    {
      question: "项目中遇到的最大挑战是什么？怎么解决的？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：面试官考察面对困难的应对能力和解决问题的思维方式。 Task：分享一个真实且有技术深度的挑战。 Action： ## 1. 挑战描述：系统上线初期，用户满意度只有 68%，远低于 80% 的目标。主要问题是检索不准确和 。",
    },
    {
      question: "这个项目的 ROI 是怎么计算的？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提分层记忆与写入策略（事实 vs 推断）。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：Situation：面试官考察对业务价值的量化能力。 Task：给出清晰的 ROI 计算逻辑。 Action： ## 1. 成本投入：研发成本：6 人 × 6 个月 × 平均月薪 = X 万元。基础设施成本：云服务 + API 费用 = Y。",
    },
    {
      question: "Transformer 的 Self-Attention 怎么计算？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可补一句你在项目里如何验证该方案有效（指标或案例）。",
      oral: "我会按「目标→方案→关键细节→兜底」来说。回答： Self-Attention 的计算过程： ## 1. 线性变换生成 Q、K、V： Q = X · W_Q (Query) K = X · W_K (Key) V = X · W_V (Value) 其中 X 是输入序列的 embedding 矩阵（n × d_model），W_Q、W_K、W_V 是可学习参数矩阵。 ## 2. 计算注意力分数： Attention(Q, K, V) = 。最后加一句上线后怎么观测、怎么发现做得不好。",
    },
    {
      question: "LoRA 的原理是什么？为什么低秩有效？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提缓存、模型路由、批量与流式。",
      oral: "这题我会先给定义：回答： ## 1. LoRA 核心思想：在微调时不修改原始模型的权重 W，而是添加一个低秩分解的增量ΔW。 W' = W + ΔW = W + B · A 其中 W ∈ R^(d×d), B ∈ R^(d×r), A ∈ R^(r×d), r &lt;&lt; d 例如 d=4096, r=8 时，参数量从 4096² = 16M 降到 2×4096×8 = 65K（减少 99.6%）。 ## 2。然后补一句和普通 LLM 单次调用的区别——Agent 有闭环，会根据工具反馈多步决策，不是一次性生成就结束。",
    },
    {
      question: "RAG 和微调怎么选？各自优劣？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "我会按「目标→方案→关键细节→兜底」来说。回答： ## 1. RAG（检索增强生成）：优势：知识可实时更新（改知识库即可，不需要重新训练）。可解释性好（答案有明确的来源引用）。无需 GPU 训练资源。减少幻觉（答案基于检索到的事实）。劣势：受检索质量影响大（检索不到就答不出）。上下文窗口限制（能放入的知识量有限）。推理延迟增加（多了检索环节）。无法改变模型本身的能力（如生成风格）。 ## 2. 微调（Fine-tuning）：优势：内化知。最后加一句上线后怎么观测、怎么发现做得不好。",
    },
    {
      question: "KV Cache 是什么？为什么需要？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可补一句你在项目里如何验证该方案有效（指标或案例）。",
      oral: "这题我会先给定义：回答： ## 1. 问题背景： Transformer 的 Self-Attention 计算中，每个新 token 需要和之前所有 token 计算注意力。自回归生成时，第 N 个 token 的 K、V 与前 N-1 个 token 重复计算。 ## 2. KV Cache 原理：在自回归生成过程中，缓存每一层的 K（Key）和 V（Value）矩阵。生成第 N+1 个 token 时：只需要。然后补一句和普通 LLM 单次调用的区别——Agent 有闭环，会根据工具反馈多步决策，不是一次性生成就结束。",
    },
    {
      question: "RLHF 和 DPO 的区别？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提步数上限、停止条件与任务清单防迷失。",
      oral: "对比题我习惯用「控制流在谁手里」来切入。回答： ## 1. RLHF（Reinforcement Learning from Human Feedback）：流程：SFT →训练 Reward Model → PPO 优化第一步（SFT）：用高质量数据做监督微调。第二步（Reward Model）：收集人类偏好数据（A 回答 vs B 回答，标注哪个更好），训练奖励模型。第三步（PPO）：用 PPO 算法优化策略模型，最大化奖励模型的打。最后补一句两者怎么结合，显得不是非黑即白。",
    },
    {
      question: "Embedding 模型是怎么训练的？对比学习怎么做的？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "对比题我习惯用「控制流在谁手里」来切入。回答： ## 1. 训练目标：让语义相似的文本在向量空间中距离更近，语义不同的文本距离更远。 ## 2. 对比学习（Contrastive Learning）：正样本对（Positive Pair）：语义相近的文本对（如问题-答案、标题-正文）。负样本对（Negative Pair）：语义不相关的文本对。 InfoNCE 损失函数： L = -log(exp(sim(q, k+)/τ) / Σ e。最后补一句两者怎么结合，显得不是非黑即白。",
    },
    {
      question: "向量数据库的索引原理是什么？HNSW 怎么工作的？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "这题我会先给定义：回答： ## 1. 向量检索的核心挑战：暴力搜索（Brute-force）：O(n) 复杂度，数据量大时不可接受。需要近似最近邻搜索（ANN）算法，牺牲一点精度换取大幅的速度提升。 ## 2. 主流索引类型：索引类型原理适用场景 IVF 聚类 + 倒排大数据量、内存充足 HNSW 层次化可导航小世界图高召回要求 DiskANN 基于磁盘的 ANN 超大规模、内存有限 Flat 暴力搜索小数据量、1。然后补一句和普通 LLM 单次调用的区别——Agent 有闭环，会根据工具反馈多步决策，不是一次性生成就结束。",
    },
    {
      question: "Prompt Engineering 有哪些关键技巧？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提步数上限、停止条件与任务清单防迷失。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：回答： ## 1. 结构化 Prompt 设计：明确角色定义（Role）。清晰的任务描述（Task）。输出格式约束（Format）。必要的限制条件（Constraints）。高质量示例（Few-shot Examples）。 ## 2. 关。",
    },
    {
      question: "大模型的 Context Window 限制怎么突破？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Recall@K、引用溯源或 Hybrid 检索。",
      oral: "我会按「目标→方案→关键细节→兜底」来说。回答： ## 1. 当前主流模型的 Context Window：模型 Context Window GPT-4o 128K Claude 3.5 200K Gemini 1.5 Pro 2M Qwen2.5 128K ## 2. 长上下文的挑战： \"Lost in the Middle\"现象：模型对中间位置的信息关注度低。计算成本随序列长度平方增长。即使模型支持长上下文，实际效果在超长文本时也会。最后加一句上线后怎么观测、怎么发现做得不好。",
    },
    {
      question: "LLM 的解码策略有哪些？Temperature 和 Top-p 怎么影响输出？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可补一句你在项目里如何验证该方案有效（指标或案例）。",
      oral: "我会按「目标→方案→关键细节→兜底」来说。回答： ## 1. 贪心解码（Greedy Decoding）：每一步选择概率最高的 token。确定性输出，但容易重复和死板。 ## 2. 采样（Sampling）：按概率分布随机采样下一个 token。引入随机性，输出更多样化。 ## 3. Temperature（温度参数）： P(token_i) = exp(logit_i / T) / Σ exp(logit_j / T) T = 0：等。最后加一句上线后怎么观测、怎么发现做得不好。",
    },
    {
      question: "什么是 Agent 的工具学习（Tool Learning）？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提 Schema 描述、鉴权与超时重试。",
      oral: "关于「什么是 Agent 的工具学习（Tool Learning）」，我的回答是：回答： ## 1. 定义：让 LLM 学会识别何时需要调用外部工具、选择哪个工具、生成正确的参数。 ## 2. 实现方式： Prompt 方式（主流）：在 Prompt 中描述可用工具的名称、功能、参数格式。 LLM 通过 in-context learning 学会调用工具。优点：灵活、无需训练。缺点：受 Prompt 长度限制。 Fine-tuning 方式：使用工具调用的标注数据微调模型。如。如果面试官追问，我会举一个简短场景把流程串起来。",
    },
    {
      question: "什么是 Mixture of Experts（MoE）？为什么重要？",
      expand: "标准答案覆盖了要点；面试时可再补边界条件：可提分层记忆与写入策略（事实 vs 推断）。",
      oral: "这题我用 STAR 讲。Situation 一句话背景，Task 说目标指标，Action 讲 2～3 个关键决策（为什么选这个方案），Result 给数字。核心结论：回答： ## 1. 核心思想：模型包含多个\"专家\"（Expert）网络和一个\"路由器\"（Router）。每次推理时，路由器只激活少数几个专家（如 8 个中选 2 个）。实现了\"大模型容量 + 小模型推理成本\"的目标。 ## 2. 架构细节：。",
    },
  ],
}
