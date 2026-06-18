---
part: 0
partTitle: Part 0 · 开场准备
partColor: #6366f1
---

<div class="part-hero" style="--part-color: #6366f1">

# Part 0 · 开场准备

<p class="part-desc">自我介绍 · 项目介绍 · 典型问题</p>
<span class="part-round">开场必背</span>

</div>

<div class="part-intro">

> 面试真实顺序：自我介绍 → 项目介绍 → 技术深挖。以下三节按面试官开场流程排列。

</div>

---



<div class="section-card">

<h2 class="section-title">面试开场 · 自我介绍</h2>

> **使用提示**：控制在 1.5 分钟内；讲完停顿，等面试官选「哪个项目展开」。




<details class="answer-reveal">
<summary>展开答案</summary>
<div class="answer-body">
"面试官好，我是软件工程相关硕士在读，方向是大模型应用与 Agent/RAG。

过去一年多三个项目：**科研问答系统**——QLoRA 微调 Qwen2.5-14B + LangGraph RAG + FastAPI 部署，全链路自建，Recall@5 从 0.51 到 0.78，P95 1.2s。**GenericAgent 框架**——基于 ReAct 深度二次开发，9 原子工具、5 类 Session 接入层、L0-L4 分层记忆；我完成 SiliconFlow/DeepSeek 适配，并分析 Native FC vs 文本协议、Mixin 故障转移。**GCN-Transformer 人体运动预测**，投 Pattern Recognition 二审。

投岗是想把 Agent 从实验室推到生产——有系统搭建和优化经验，希望在真实场景积累工程能力。"
</div>
</details>

</div>

---

<div class="section-card">

<h2 class="section-title">项目经历详细介绍 · 面试官提问版</h2>

### 【项目一】垂域科研问答系统



**回答**：

"主线项目，分四阶段。

**需求**：跟课题组聊一周，锁定术语解释、论文检索、实验复述三类场景，可靠性要求各异。**基线**：PDF→BGE-M3→Qdrant→Top-5 向量检索→GPT 生成，Recall@5 仅 0.51，常跨论文混淆。**优化四步**：BM25 混合检索；Cross-Encoder 重排；分层切片（子 512/父 2k）；LangGraph 查询改写，Recall 到 0.78。**微调**：1.8k 指令 QLoRA，训练引用作答风格。**工程化**：FastAPI 流式 + Qdrant on NAS，连接池/批处理重排，P95 3.1s→1.2s，120 问黄金集持续评测。"


### 【项目二】GenericAgent 自主 Agent 框架

**面试官**：详细介绍这个 Agent 框架，它的架构是怎么设计的？

**回答**：

"基于 ReAct 的自主 Agent，约 3K 行 Python，四层架构。

**接入层**：display_queue 解耦，CLI/TUI/Streamlit/IM 等十多种前端共用 next/done 协议。**执行引擎**：~100 行 ReAct 循环，max_turns、轮次警告、连续空响应熔断。**工具层**：9 原子工具——核心是 code_run（图灵完备扩展）、file_patch（old_content 唯一匹配防幻觉）、web_scan。**LLM 层**：5 类 Session——Native FC、文本协议兜底、Mixin 故障转移。

**记忆**：L0-L4 分层文本索引，精准定位优于向量检索。**自我进化**：任务完成后 start_long_term_update 结晶 L3 SOP，同类任务直接复用。"


### 项目经历 · 遇到的问题与解决方案

> **使用提示**：三个案例各约 1 分钟，主题分别是引用质量、数据质量、Agent 安全——与 Part 1 Q13、Q2、Q15 可交叉引用。

**面试官**：在这些项目中，你遇到过什么让你印象深刻的问题？怎么解决的？

**回答**：

"三个典型问题。

**跨论文混淆**：检索混多篇，LLM 张冠李戴。纯 prompt 无效；加**强制引用标注 + LangGraph 校验节点**反查原文，通过率 72%→86%。余下 14% 根因在 PDF 解析丢引用信息。

**微调数据坑**：500 条 GPT 伪数据，loss 卡 0.68、'AI 腔'。改真实提问 300 条 + 增强至 1.8k，加 200 条错误引用负样本，loss 0.42。

**code_run 安全**：框架用子进程/超时/安全头止损，但缺文件系统级沙箱。我会加 workspace 级 chroot/容器隔离。

共性原则：难点不是只做对，而是**做错可感知、可恢复、不破坏**。"


---

</div>
