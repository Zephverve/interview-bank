# 复习指南

<div class="guide-banner">

按 **Part 0 → 6** 顺序背诵；每题先讲「结论句（15 秒）」，再按需展开完整回答。

</div>

## 按轮次速查

| 轮次 | 覆盖范围 |
|------|----------|
| **一面** | Part 0 全 + Part 1 全 + Q3/Q4/Q7 + Q40 |
| **二面** | Part 2 + Part 3 + Part 4 选 2–3 题 |
| **HR/三面** | Part 5 全 + Part 0 自我介绍动机段 |

## 使用技巧

1. **第一遍**：通读结论句，建立框架
2. **第二遍**：折叠答案，自己先说一遍，再展开对照
3. **第三遍**：按轮次模拟，一面只练 Part 0+1，二面加 Part 2+3
4. **考前**：重点看 Part 6 口径备忘，避免表述打架

---

<h2 id="网页添加">✏️ 网页交互添加（推荐）</h2>

<div class="guide-banner custom-guide">

点击导航栏 **「添加题目」** 或右下角 **+** 按钮，在表单里填写即可。题目自动保存在浏览器本地，刷新不丢失。

</div>

| 功能 | 说明 |
|------|------|
| 添加 / 编辑 | 表单填写题目、结论句、完整答案 |
| 分类管理 | 支持新建分类（后端、算法等） |
| 标记已掌握 | 复习过的题目标记，过滤已掌握 |
| 搜索 | 在我的题库页按关键词搜索 |
| 导出备份 | 导出 JSON，换设备可导入 |
| 复制 Markdown | 一键复制为 md 格式 |

<h2 id="文件题库">📁 文件方式添加（可选）</h2>

### 当前自定义分类

- `custom/today-interview/` — 今日面试复盘（11 题）
- `custom/3d-lidar/` — 3D 激光感知（1 题）

### 方法一：命令行快速添加（推荐）

```bash
cd interview-bank

# 新建一题：分类名 + 题目标题
npm run new-question -- 3d-lidar "PointNet 如何处理点云无序性"

# 编辑生成的文件，填写结论句和答案
# 然后刷新
npm run prepare
```

### 方法二：手动创建文件

1. 在 `custom/` 下新建分类文件夹，例如 `custom/3d-lidar/`
2. （可选）创建 `_category.yaml` 设置分类名称和颜色
3. 复制 `custom/_template.md` 为新文件，例如 `pointnet-order.md`
4. 填写 frontmatter 和答案内容
5. 运行 `npm run prepare`

### 单题文件格式

```markdown
---
title: PointNet 如何处理点云无序性
round: 一面
difficulty: ⭐⭐⭐
tags: [点云, 3D]
point: PointNet 原理
---

**题目**：PointNet 如何处理点云的无序性？

**结论句（15 秒）**：用共享 MLP + 对称聚合函数（max pooling）保证置换不变性。

**追问方向**：PointNet++ 做了什么改进？

### 回答

你的完整回答写在这里……
```

### 一文件多题格式

同一文件里用 `##` 标题分隔多道题，格式与内置题库相同：

```markdown
---
title: 3D 感知合集
---

## 点云分割

**题目**：……
### 回答
……

## 目标检测

**题目**：……
### 回答
……
```

### 分类配置 _category.yaml

```yaml
title: 3D 激光感知
icon: 📡
color: "#14b8a6"
desc: LiDAR · 点云 · 分割
order: 1
```
