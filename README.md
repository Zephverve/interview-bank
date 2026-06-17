# 面试题库

> **⚠️ 本页是 GitHub 项目说明，不是题库本身。**
>
> **👉 打开面试题库网站：[https://zephverve.github.io/interview-bank/](https://zephverve.github.io/interview-bank/)**

---

## 网站里有什么

| 入口 | 内容 |
|------|------|
| [首页](https://zephverve.github.io/interview-bank/) | Part 0–6 卡片，点击进入各章节 |
| [Part 0](https://zephverve.github.io/interview-bank/parts/part-0) | 开场自我介绍、项目介绍 |
| [Part 1–6](https://zephverve.github.io/interview-bank/parts/part-1) | RAG / Agent / 系统设计 / 行为面等 **40+ 道题** |
| [添加题目](https://zephverve.github.io/interview-bank/add) | 网页表单，本地保存 |
| [我的题库](https://zephverve.github.io/interview-bank/my) | 自己添加的题目 |

内置题目在 **Part 0 → Part 6**，点侧边栏或首页卡片即可查看，每题含结论句 + 折叠答案。

---

## 打不开网站？

1. 打开仓库 [Settings → Pages](https://github.com/Zephverve/interview-bank/settings/pages)
2. **Source** 选 **Deploy from a branch**
3. **Branch** 选 **gh-pages** / **/ (root)**
4. 保存后等 1–2 分钟，再访问上面的链接

若 `gh-pages` 分支不存在，到 [Actions](https://github.com/Zephverve/interview-bank/actions) 手动运行一次 **Deploy to GitHub Pages**。

---

## 本地运行

```bash
npm install
npm run dev
```

浏览器打开 http://localhost:5173

## 更新内置题目

编辑 `data/面试35问-完整合集.md`，然后：

```bash
npm run prepare
git add . && git commit -m "update questions" && git push
```

推送后 Actions 会自动更新线上网站。

## 自己添加题目

无需改代码，打开网站的 **「添加题目」** 页面，在表单里填写即可（保存在浏览器本地）。

---

<details>
<summary>开发者：首次部署到 GitHub Pages</summary>

```bash
git remote add origin git@github.com:<用户名>/interview-bank.git
git push -u origin main
```

Settings → Pages → **gh-pages** 分支 → Save。

</details>
