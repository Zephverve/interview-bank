# 面试题库

**👉 在线地址：https://zephverve.github.io/interview-bank/**

---

## 第一次使用：开启 GitHub Pages（必做）

看到 *"There isn't a GitHub Pages site here"* 说明 **还没开启 Pages**。

### 步骤

1. 打开 https://github.com/Zephverve/interview-bank/settings/pages
2. **Build and deployment → Source** 选 **GitHub Actions**（推荐）
3. 保存后，打开 https://github.com/Zephverve/interview-bank/actions
4. 点 **Deploy to GitHub Pages** → **Run workflow** 手动运行一次
5. 等约 2 分钟，访问 https://zephverve.github.io/interview-bank/

### 备选方案（不用 GitHub Actions）

Settings → Pages → Source 选 **Deploy from a branch** → Branch: `main` → Folder: **`/site`**

---

## 网站功能

| 页面 | 说明 |
|------|------|
| 首页 Part 卡片 | 内置 40+ 道题 |
| `/add` | 网页添加题目 |
| `/my` | 我的题库 |

## 本地运行

```bash
npm install
npm run dev
```

打开 http://localhost:5173

## 更新题目

编辑 `data/面试35问-完整合集.md` → `npm run prepare` → `git push`
