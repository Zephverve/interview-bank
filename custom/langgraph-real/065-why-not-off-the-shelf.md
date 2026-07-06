---
title: "为什么不直接用 Cursor Composer 或公司现成的 Agent 产品？"
round: 二面
difficulty: ⭐⭐⭐
tags: [LangGraph, 面经]
point: "自研边界"
source: 牛客 · 百度 Agent
sourceUrl: https://www.nowcoder.com/discuss/880841659733311488
---

**题目**：为什么不直接用 Cursor Composer 或公司现成的 Agent 产品？

**结论句（15 秒）**：自研是为了数据路径可控、工具权限对齐内部系统、评测指标一致、发版节奏自主；改造现成方案讲清 adapter 四层而非空喊二次开发。

**追问方向**：fork 现成方案风险？ · 什么时候应该用现成的？

### 回答

**优先级**：P1 · 1 篇面经

#### 🗣️ 先用大白话说

**一句话**：不是非要证明自己比 Cursor 强，而是核心链路要「数据、权限、评测、发版」四条线都在自己手里。

**打个比方**：Composer 像租精装公寓——拎包入住快，但装修不能动、监控看不到管道；自研 LangGraph 像自建房——前期慢，但水电走向、门禁系统、消防验收全在自己图纸里。

#### 📖 面试展开（详细版）

这道题表面在问「为什么不直接用现成产品」，实际考的是**技术主权边界**和**改造方案的可落地性**。

先说自研/半自研的四个硬理由：① **数据路径可控**——用户 query、检索文档、工具返回结果是否出境、是否落日志，合规团队要审计；② **工具权限对齐 IAM**——内部 ERP/工单/数据库的 ACL 不能指望外部 Agent 产品替你对接；③ **评测指标一致**——业务定义的「回答正确」可能包含引用格式、审批通过率，现成产品的通用指标对不上；④ **发版节奏自主**——外部产品升级可能改 tool schema 或 prompt 策略，你的回归集还没跑完就被迫跟进。

如果基于现成方案改造，必须讲清 **adapter 四层**，否则「二次开发」是空话：协议层（tool schema、context window 格式对齐）、资产层（prompt/skill/评测集迁移）、运行层（灰度、熔断、限流、LangSmith 观测）、组织层（谁维护、版本事故怎么归因、oncall 手册）。

最后补一句选型原则：**非核心、低合规、要快** → 用 Composer/企业 Agent；**核心流程、敏感数据、强审计** → LangGraph 自研。面试官想听的是你知道 trade-off，不是站队。

#### 💡 核心要点
- 协议层/资产层/运行层/组织层
- 别 fork 到死，先 adapter
- 主权和合规是核心

#### 📝 代码/配置示例

```python
# adapter 四层示意：不改 fork，先包一层
class InternalAgentAdapter:
    def __init__(self, vendor_client, iam, metrics):
        self.vendor = vendor_client
        self.iam = iam          # 协议层：工具权限
        self.metrics = metrics  # 运行层：观测

    async def invoke(self, user_id, query):
        tools = self.iam.allowed_tools(user_id)  # 资产层：skill 子集
        result = await self.vendor.run(query, tools=tools)
        self.metrics.record(result)              # 评测指标对齐
        return result
```

#### 🔁 追问怎么接

- **「fork 现成方案有什么风险？」** → 上游 merge 成本、安全补丁滞后、团队只有维护权没有架构权；正确姿势是先 adapter 再接，验证 ROI 后再考虑深度 fork。
- **「什么时候应该用现成的？」** → 内部提效试点、非核心路径、合规要求低、团队缺 Agent 工程经验时；给出时间线：先用现成跑通 MVP，痛点明确后再迁移 LangGraph。
