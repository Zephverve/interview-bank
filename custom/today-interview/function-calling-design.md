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

"Function Calling 看着简单——写个 JSON schema 就完事了——但生产上模型选错工具、参数乱填、循环调用同一个工具三次是日常。我踩过坑后总结了一套设计原则。

**原则一：单一职责，一个工具只做一件事。**

❌ 错误示范：一个 `search_database` 工具，传个 `mode` 参数决定是搜文档、搜代码还是搜表格。
✅ 正确做法：拆成 `search_docs`、`search_code`、`search_tables` 三个独立工具。

为什么？模型的 tool selection 本质是多分类——工具名+描述就是类别标签。你把三个功能塞进一个工具，模型要额外推理 mode 参数该填什么，多了一步推理就多一个出错点。工具名本身就是最直接的 signal。

**原则二：description 写正反例，不写废话。**

❌ 差：`"Search for documents in the knowledge base."`
✅ 好：

```json
{
  "description": "根据语义查询检索知识库中的文档。适用于：用户问'XX是什么''XX怎么做'等事实查询。不适用于：需要统计/计算的问题（用 calculator 工具）、需要读取具体文件内容（用 read_file 工具）。参数 query 用用户问题的核心语义，去掉礼貌用语。例如用户说'请问你能帮我查一下向量数据库和传统数据库的区别吗'→ query 应填 '向量数据库 与传统数据库 区别'"
}
```

description 里写清楚三件事：干什么、什么时候用、什么时候不用。后两条比第一条更重要——模型的问题不是不知道怎么调，是不知道**该不该调**。

**原则三：参数少而精，必填项用 enum 不用 free text。**

工具参数超过 4 个，模型就开始丢参数或乱填。如果确实需要多个参数，标清楚哪些是 optional、哪些是 required。enum 类型优于 string——模型在 3 个选项中选比自由发挥准得多。

```json
{
  "parameters": {
    "sort_by": {
      "type": "string",
      "enum": ["date", "relevance", "citations"],
      "description": "排序依据。date=最新优先；relevance=语义相关度优先；citations=引用次数优先。默认 relevance。"
    }
  }
}
```

**原则四：错误返回结构化为 JSON，附修改建议。**

工具执行失败，不要返回 `"Error: file not found"` 这种自然语言。返回结构化错误：

```json
{
  "success": false,
  "error_type": "FILE_NOT_FOUND",
  "message": "文件 /path/to/report.pdf 不存在",
  "suggested_fix": "请检查路径。当前工作目录下可用的 PDF 文件有：[list]。是否改用 list_files 列出所有文件？",
  "retry_possible": true
}
```

为什么？因为 Agent 拿到错误后要做下一步决策——结构化错误让它可以程序化地提取 `error_type` 走不同分支。`FILE_NOT_FOUND` → 尝试 list_dir 再重试；`PERMISSION_DENIED` → 直接 ask_user。

**原则五：并行友好设计。**

两个工具之间无数据依赖 → 标为 `parallelizable: true`，Agent 可以一次发出多个 tool call。比如同时搜论文和搜代码是独立的。但如果 tool B 依赖 tool A 的输出作参数，就不能并行——在 description 里注明 'requires output from <tool_a> as input'。

**追问：工具太多怎么防止模型选错？**

设工具分组。不是把所有工具都暴露给模型——当前 step 的 context 决定只需要哪几个。比如 Agent 在 '分析数据' step，只暴露 `run_python`、`read_file` 和 `search_docs`，不暴露 `send_email`、`create_pr`。工具数量控制在 5-10 个以内，模型的选择准确率最高。

**追问：tool call 解析失败怎么办？**

两种情况：
- JSON 格式错误（模型输出了不完整的 JSON、多了个 trailing comma）：用 json_repair 这类库自动修复，修复失败就重试，prompt 加一句'输出严格合法的 JSON 不要加注释'。
- 参数不在 schema 范围内（enum 值是没定义的）：把 schema 验证错误信息塞进下一轮 context，让模型自修正。最多允许一次 self-correction，再错就 fallback 到 ask_user。

**最后：做工具定义不是一次性工作。看生产日志——哪个工具被调错了、哪个参数经常填不对、哪个工具从来没被调用过——那是你的迭代方向。**"
