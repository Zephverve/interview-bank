# 面试题库

> **⚠️ 你现在看到的 README 不是题库！**
>
> **👉 题库网站：[https://zephverve.github.io/interview-bank/](https://zephverve.github.io/interview-bank/)**

---

## 只看到 README？按这个设置（1 分钟）

打开：**[Settings → Pages](https://github.com/Zephverve/interview-bank/settings/pages)**

| 选项 | 必须选 |
|------|--------|
| **Source** | Deploy from a branch |
| **Branch** | `main` |
| **Folder** | **`/site`**（不是 /root！） |

保存后等 1–2 分钟，再访问：https://zephverve.github.io/interview-bank/

选成 `/ (root)` 就只会显示本 README，没有题目。

---

## 网站里有什么

| 入口 | 链接 |
|------|------|
| 首页 | https://zephverve.github.io/interview-bank/ |
| Part 0 开场 | https://zephverve.github.io/interview-bank/parts/part-0 |
| 添加题目 | https://zephverve.github.io/interview-bank/add |
| 我的题库 | https://zephverve.github.io/interview-bank/my |

内置 **40+ 道题**在 Part 0–6，点首页卡片或左侧目录进入。

---

## 本地运行

```bash
npm install
npm run dev
```

## 更新题目

编辑 `data/面试35问-完整合集.md` → `npm run prepare` → `git push`（Actions 会自动更新 `site/`）
