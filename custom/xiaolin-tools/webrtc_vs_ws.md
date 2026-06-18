---
title: 为什么要用 WebRTC 协议？它和 WebSocket（WS）在 AI 对话流…
round: 一面/二面
difficulty: ⭐⭐⭐
tags: [工具调用, MCP, 小林笔记]
point: 为什么要用 WebRTC 协议？它和 WebSocket（W
source: 小林面试笔记
---

**题目**：为什么要用 WebRTC 协议？它和 WebSocket（WS）在 AI 对话流中的核心差异是什么？

**结论句（15 秒）**：我理解核心原因是 WebSocket 基于 TCP，而 TCP 的可靠性设计在实时语音场景里反而是负担

**追问方向**：结合项目经历举例 · 优缺点与适用场景

### 回答

我理解核心原因是 WebSocket 基于 TCP，而 TCP 的可靠性设计在实时语音场景里反而是负担。

语音可以容忍丢包，但绝对不容忍延迟；一旦网络抖动丢了包，TCP 强制等重传，后续所有音频都得跟着等，延迟一堆积通话就卡。

WebRTC 走的是 UDP，丢包了不等重传，直接用插值算法填补，用一点点音质损失换来稳定的低延迟，延迟能控制在 50 到 150 毫秒。

另外 WebRTC 还内置了回声消除、噪声抑制、自适应码率这些语音处理能力，这些用 WebSocket 都得自己实现。

所以 OpenAI Realtime API 这类实时语音产品选 WebRTC，就是因为 TCP 根本撑不住语音场景的延迟要求。
