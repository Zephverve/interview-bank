---
layout: home
hero:
  name: 面试题库
  text: 大模型应用工程师 · Agent 方向
  tagline: 内置 40 问 + 网页交互添加 · 结论句 + 完整答案 · 按轮次复习
  actions:
    - theme: brand
      text: 开始刷题 · Part 0
      link: /parts/part-0
    - theme: alt
      text: 我的题库
      link: /my
features:
  - icon: ✏️
    title: 网页添加题目
    details: 表单填写即可保存，支持编辑、删除、标记已掌握，数据存在浏览器本地。
  - icon: 📂
    title: 分 Part 目录
    details: Part 0–6 按面试轮次组织，从开场自我介绍到行为面一网打尽。
  - icon: 💡
    title: 15 秒结论句
    details: 每题先背结论句，再按需展开完整回答，模拟真实面试节奏。
  - icon: 👁
    title: 答案折叠
    details: 默认隐藏完整回答，点击展开自测，适合反复背诵。
---

<div class="home-parts custom-section">

<HomeUserBank />

</div>

<div class="home-parts">

## 内置题库

<p class="section-note">👇 点击下方卡片进入各 Part，每 Part 含多道面试题（题目 + 结论句 + 折叠答案）</p>

<div class="part-grid">


<a class="part-card" href="/parts/part-0" style="--card-accent: #6366f1">
  <span class="part-card-icon">🎯</span>
  <h3>Part 0 · 开场准备</h3>
  <p>自我介绍 · 项目介绍 · 典型问题</p>
  <span class="part-card-round">开场必背</span>
</a>

<a class="part-card" href="/parts/part-1" style="--card-accent: #0ea5e9">
  <span class="part-card-icon">🔍</span>
  <h3>Part 1 · RAG 深挖</h3>
  <p>Embedding · 切片 · 混合检索 · 微调</p>
  <span class="part-card-round">一面核心</span>
</a>

<a class="part-card" href="/parts/part-2" style="--card-accent: #8b5cf6">
  <span class="part-card-icon">🤖</span>
  <h3>Part 2 · Agent 架构</h3>
  <p>ReAct · 工具 · 记忆 · 安全</p>
  <span class="part-card-round">一面/二面</span>
</a>

<a class="part-card" href="/parts/part-3" style="--card-accent: #f59e0b">
  <span class="part-card-icon">🏗️</span>
  <h3>Part 3 · 系统设计</h3>
  <p>架构设计 · 多 Agent · 工程落地</p>
  <span class="part-card-round">二面</span>
</a>

<a class="part-card" href="/parts/part-4" style="--card-accent: #10b981">
  <span class="part-card-icon">🌐</span>
  <h3>Part 4 · 行业视野</h3>
  <p>竞品对比 · OpenClaw · Hermes</p>
  <span class="part-card-round">二面加分</span>
</a>

<a class="part-card" href="/parts/part-5" style="--card-accent: #ec4899">
  <span class="part-card-icon">💬</span>
  <h3>Part 5 · 行为面</h3>
  <p>STAR · 职业规划 · 反问</p>
  <span class="part-card-round">三面/HR</span>
</a>

<a class="part-card" href="/parts/part-6" style="--card-accent: #ef4444">
  <span class="part-card-icon">📌</span>
  <h3>Part 6 · 补充题库</h3>
  <p>评测 · LangGraph · 口径备忘</p>
  <span class="part-card-round">高频追问</span>
</a>

</div>

</div>

<div class="home-parts custom-section">

## 文件题库

<p class="section-note">以下分类来自 <code>custom/</code> 文件夹，适合批量维护</p>

<div class="part-grid">


<a class="part-card custom-part-card" href="/custom/today-interview" style="--card-accent: #f97316">
  <span class="part-card-icon">🔥</span>
  <h3>今日面试复盘</h3>
  <p>2026-06-17 面试真题 · 19 题</p>
  <span class="part-card-round">我的题库</span>
</a>

<a class="part-card custom-part-card" href="/custom/3d-lidar" style="--card-accent: #14b8a6">
  <span class="part-card-icon">📡</span>
  <h3>3D 激光感知</h3>
  <p>LiDAR · 点云 · 目标检测 · 1 题</p>
  <span class="part-card-round">我的题库</span>
</a>

<a class="part-card custom-part-card" href="/custom/xiaolin-agent" style="--card-accent: #8b5cf6">
  <span class="part-card-icon">🤖</span>
  <h3>小林 · Agent 面试题</h3>
  <p>Agent 概念 · 范式 · 记忆 · Multi-Agent · 16 题</p>
  <span class="part-card-round">我的题库</span>
</a>

<a class="part-card custom-part-card" href="/custom/xiaolin-rag" style="--card-accent: #0ea5e9">
  <span class="part-card-icon">🔍</span>
  <h3>小林 · RAG 面试题</h3>
  <p>RAG 原理 · 切分 · 检索优化 · 落地 · 20 题</p>
  <span class="part-card-round">我的题库</span>
</a>

<a class="part-card custom-part-card" href="/custom/xiaolin-tools" style="--card-accent: #f59e0b">
  <span class="part-card-icon">🔧</span>
  <h3>小林 · 工具调用面试题</h3>
  <p>Function Calling · MCP · Skill · A2A · 16 题</p>
  <span class="part-card-round">我的题库</span>
</a>

<a class="part-card custom-part-card" href="/custom/xiaolin-llm" style="--card-accent: #6366f1">
  <span class="part-card-icon">🧠</span>
  <h3>小林 · 大模型工程面试题</h3>
  <p>Transformer · 微调 · 推理 · 部署 · 22 题</p>
  <span class="part-card-round">我的题库</span>
</a>

<a class="part-card custom-part-card" href="/custom/kama-ai-coding" style="--card-accent: #06b6d4">
  <span class="part-card-icon">💻</span>
  <h3>卡码 · AI 编程</h3>
  <p>Vibe Coding · Claude Code · 上下文工程 · 26 题</p>
  <span class="part-card-round">我的题库</span>
</a>

<a class="part-card custom-part-card" href="/custom/kama-rag" style="--card-accent: #0ea5e9">
  <span class="part-card-icon">🔍</span>
  <h3>卡码 · RAG</h3>
  <p>RAG 汇总 · 落地难点 · GraphRAG · 20 题</p>
  <span class="part-card-round">我的题库</span>
</a>

<a class="part-card custom-part-card" href="/custom/kama-finetune" style="--card-accent: #f97316">
  <span class="part-card-icon">🎯</span>
  <h3>卡码 · 模型微调</h3>
  <p>SFT · RLHF · DPO · 微调取舍 · 1 题</p>
  <span class="part-card-round">我的题库</span>
</a>

<a class="part-card custom-part-card" href="/custom/kama-agent" style="--card-accent: #8b5cf6">
  <span class="part-card-icon">🤖</span>
  <h3>卡码 · Agent</h3>
  <p>Agent · Harness · 多Agent · Skill · 41 题</p>
  <span class="part-card-round">我的题库</span>
</a>

<a class="part-card custom-part-card" href="/custom/kama-transformer" style="--card-accent: #6366f1">
  <span class="part-card-icon">🧠</span>
  <h3>卡码 · Transformer</h3>
  <p>Self-Attention · 架构 · 复杂度 · 8 题</p>
  <span class="part-card-round">我的题库</span>
</a>

<a class="part-card custom-part-card" href="/custom/kama-real" style="--card-accent: #ec4899">
  <span class="part-card-icon">📋</span>
  <h3>卡码 · 真实面经</h3>
  <p>字节等大厂真实面试题 · 1 题</p>
  <span class="part-card-round">我的题库</span>
</a>

</div>

</div>
