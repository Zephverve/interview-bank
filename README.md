# 面试题库 · VitePress

支持 **网页交互添加题目** + 内置 Part 0–6 题库。

在线访问（部署后）：`https://<你的用户名>.github.io/interview-bank/`

## 本地运行

```bash
npm install
npm run dev
```

## 部署到 GitHub Pages

### 1. 创建 GitHub 仓库

在 GitHub 新建仓库，例如 `interview-bank`（Public）。

### 2. 推送代码

```bash
git init
git add .
git commit -m "feat: interview bank vitepress site"
git branch -M main
git remote add origin https://github.com/<用户名>/interview-bank.git
git push -u origin main
```

### 3. 开启 Pages

仓库 **Settings → Pages → Build and deployment**：

| 选项 | 值 |
|------|-----|
| Source | **Deploy from a branch** |
| Branch | **gh-pages** / **/ (root)** |

首次 push 后 Actions 会自动创建 `gh-pages` 分支；若下拉没有，等 Actions 跑完再刷新。

**若之前报 404**：不要用 GitHub Actions 作为 Source，改用上表设置，然后 **Actions → Re-run jobs**。

推送后约 1–2 分钟可访问。

### 仓库名与访问地址

| 仓库名 | 站点地址 |
|--------|----------|
| `interview-bank` | `https://<用户名>.github.io/interview-bank/` |
| `<用户名>.github.io` | `https://<用户名>.github.io/` |

## 交互功能

| 页面 | 功能 |
|------|------|
| `/add` | 表单添加/编辑题目 |
| `/my` | 浏览、搜索、标记已掌握 |

题目保存在浏览器 localStorage，换设备请用「导出备份」。

## 更新内置题库

编辑 `data/面试35问-完整合集.md`，然后 `npm run prepare`。
