---
title: Hermes Agent 学习笔记
pageClass: notes-doc
outline: [2, 3]
aside: true
---

# Hermes Agent（爱马仕 Agent）学习笔记——通俗详解版

> **写给已经学过 GenericAgent 的你**
>
> 你已经知道 Agent 是怎么回事了——会调工具、有记忆、能自己转圈圈干活。这份笔记不跟你讲虚的，每一段都掰开了揉碎了，告诉你"这玩意儿具体是怎么做到的"。看完之后，别人问你"Hermes Agent 怎么实现的记忆？"，你能直接给他讲明白。

## 章节目录

- [前导课](./prelude.md)
- [第一~三章 · 入门](./basics.md)（这玩意儿到底是个啥 · 谁造的，什么来头 · 一句话讲清核心思想）
- [第四章 · 整体架构](./architecture.md)
- [第五章 · 记忆系统](./memory.md)
- [第六章 · 技能系统](./skills.md)
- [第七章 · 自进化闭环](./evolution.md)
- [第八章 · 上下文压缩](./context.md)
- [第九章 · 工具系统](./tools.md)
- [第十章 · 模型无关](./models.md)
- [第十一~十二章 · 运行与接入](./runtime.md)（六大执行后端——代码到底 · 20+ 消息平台——怎么）
- [第十三章 · 主循环](./loop.md)
- [第十四~十五章 · 委派与定时](./delegate-cron.md)（子 Agent 委派—— · 定时任务——Agent ）
- [第十六~十七章 · MCP 与 RL](./mcp-rl.md)（MCP 集成——万能接口 · RL 训练——Agent）
- [第十八~十九章 · 安全与部署](./security-deploy.md)（安全——怎么防止被搞坏的 · 安装部署——怎么装上跑起）
- [第二十~二十一章 · 对比与讲解](./compare-summary.md)（Hermes vs Ge · 学完之后怎么跟别人讲）
- [第二十二~二十四章 · 面试题](./interview-core.md)（面试高频题——基础概念篇 · 面试高频题——架构与原理 · 面试高频题——对比与选型）
- [第二十五~二十六章 · 设计与话术](./interview-practice.md)（场景设计题——"如果让你 · 面试实战话术——怎么在面）
- [第二十七章 · 进阶与附录](./advanced.md)（实战进阶——Profil · 附录：术语速查）

<p class="section-note">左侧边栏可快速跳转；小章节已合并，长章节独立成页。</p>
