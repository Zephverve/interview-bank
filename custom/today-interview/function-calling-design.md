---
title: Function Calling 工具设计最佳实践
round: 二面
difficulty: ⭐⭐⭐⭐
tags: [Function Calling, Agent, 工具设计]
point: 工具定义
---

**题目**：Agent 的工具（Function Calling）怎么设计才能稳定调用？

**结论句（15 秒）**：每个工具只做一件事、参数少而精、description 包含正例和反例、error 返回结构化而非纯文本——定义好，模型才可能调对。

**追问方向**：工具太多模型选错怎么办？ · 并行调用怎么设计？ · tool call 解析失败怎么兜底？

### 回答

Function Calling 看着简单，生产上模型选错工具、参数乱填、循环调用是日常。我总结五条原则。

**单一职责。** 别搞一个 `search_database` 加 mode 参数，拆成 `search_docs`、`search_code`、`search_tables`。工具名就是分类标签，多一步 mode 推理就多一个出错点。

**description 写正反例。** 说清楚干什么、什么时候用、什么时候不用。用户说「请问你能帮我查一下向量数据库和传统数据库的区别吗」，query 应填「向量数据库 与传统数据库 区别」，去掉礼貌用语。

**参数少而精。** 超过 4 个参数模型就开始丢。能 enum 别 free text，排序依据用 `date/relevance/citations` 三选一比自由发挥准得多。

**错误返回结构化 JSON。** 返回 `error_type`、`suggested_fix`、`retry_possible`，Agent 可以程序化分支：`FILE_NOT_FOUND` 走 list_dir，`PERMISSION_DENIED` 走 ask_user。
