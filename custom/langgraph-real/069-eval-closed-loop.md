---
title: "Agent 评测闭环怎么搭建？"
round: 二面
difficulty: ⭐⭐⭐⭐
tags: [LangGraph, 面经]
point: "评测"
source: 牛客 · 百度
---

**题目**：Agent 评测闭环怎么搭建？

**结论句（15 秒）**：离线集分层（简单/长尾/对抗）+ 在线成功率/延迟/token/工具错误率 + 人工抽检 + bad case 自动入库 + 节点级归因。

**追问方向**：准确率还能怎么优化？ · 泄漏到训练怎么防？

### 回答

**优先级**：P1 · 2 篇面经

#### 🗣️ 先用大白话说

**一句话**：评测不是考试分数，而是「离线回归 + 在线监控 + bad case 回流」的双循环，LangGraph 的优势是失败能定位到具体 node。

**打个比方**：像医院体检——不只看「人还活着吗」（最终答案对不对），还要查「哪个器官出问题」（哪个 node 跌分），然后针对性治疗（修 prompt/换模型/改 chunk）。

#### 📖 面试展开（详细版）

百度面经高频题，考察**有没有线上思维**，不是背评测指标名词。

**离线循环**：
- 黄金集三层：简单（冒烟）、长尾（边界 case）、对抗（prompt 注入/空检索）
- 标注规范：什么算「正确」——答案内容 + 引用格式 + 是否调了正确 tool
- 防泄漏：评测集不进 fine-tune 训练集，用 hold-out set
- **节点级回归**：单独跑 intent 分类准确率、retrieve recall@k、grade 通过率——LangGraph trace 天然支持

**在线循环**：
- 核心指标：任务成功率、P99 延迟、token 消耗、tool 错误率、人工抽检比例
- bad case 自动入库：从 LangSmith trace 提取失败 thread，标注失败 node（如 grade 未通过、tool timeout）
- 周节奏：bad case Review → 优先修高频失败 node → 回归集验证

**优化不只调 prompt**——四层：数据侧（难例挖掘、合成对抗样本）、模型侧（换强模型/蒸馏）、系统侧（结构化输出 + 后处理校验）、RAG 侧（chunk 策略 + rerank）。

LangGraph 的核心优势：**失败可定位到具体 node**，评测从「答案对不对」升级到「哪一步出了问题」。

#### 💡 核心要点
- 离线在线双循环
- 按 node 归因失败
- 难例挖掘和合成

#### 📝 代码/配置示例

```python
# 节点级评测：断言轨迹包含关键 node
def eval_trace(run):
    nodes = [s["node"] for s in run.steps]
    assert "grade" in nodes, "检索结果未做质量评估"
    assert run.final_answer.citations, "缺少引用"

# bad case 自动入库
if run.status == "failed":
    db.insert({"thread_id": run.thread_id, "failed_node": run.last_node})
```

#### 🔁 追问怎么接

- **「准确率还能怎么优化？」** → 四层：数据（难例挖掘/合成）、模型（换强/蒸馏）、系统（结构化输出校验）、RAG（chunk/rerank）；强调先定位失败 node 再优化，不是盲目调 prompt。
- **「泄漏到训练怎么防？」** → 评测集与训练集物理隔离；hold-out set 定期轮换；fine-tune 前检查 doc hash 去重；线上 bad case 入库时标记为 eval-only。
