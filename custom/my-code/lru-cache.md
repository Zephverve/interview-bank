---
title: LRU 缓存
round: 一面/二面
difficulty: ⭐⭐
tags: [code, 面试]
point: LRU 缓存
---

**题目**：LRU 缓存

### 回答

**题目**：设计 LRU 缓存，get 和 put 都是 O(1)。

**考察点**：哈希表 + 双向链表。**用 Python 的话要知道 `OrderedDict` 或者 `dict` 的插入序可以做简化实现**，但面试官通常想看你手写双向链表。直接背模板。
