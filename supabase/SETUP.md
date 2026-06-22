# 云登录配置（Supabase）

配置完成后，用户可在「我的题库」用 **邮箱** 或 **GitHub** 登录，题目自动跨设备同步。

## 1. 创建 Supabase 项目

1. 打开 [supabase.com](https://supabase.com) 注册并新建项目
2. 进入 **Project Settings → API**，复制：
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`

## 2. 建表

在 Supabase **SQL Editor** 中执行 [`schema.sql`](./schema.sql)。

## 3. 开启 GitHub 登录（可选）

1. **Authentication → Providers → GitHub** 打开开关
2. 在 GitHub 创建 OAuth App：
   - Homepage URL: `https://zephverve.github.io/interview-bank/`
   - Callback URL: `https://<你的项目ID>.supabase.co/auth/v1/callback`
3. 把 Client ID / Secret 填回 Supabase

## 4. 邮箱注册（可选）

**Authentication → Providers → Email** 中：
- 开发阶段可关闭 **Confirm email**，注册后可直接登录
- 生产环境建议开启邮件验证

## 5. 配置 GitHub Actions

在仓库 **Settings → Secrets and variables → Actions** 添加：

| Secret | 值 |
|--------|-----|
| `VITE_SUPABASE_URL` | Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | anon public key |

推送 `main` 后重新部署，线上即可出现登录入口。

## 6. 本地开发

```bash
cp docs/.env.example docs/.env.local
# 填入 URL 和 anon key
npm run dev
```

`.env.local` 已在 `.gitignore` 中，不会提交。

## 安全说明

- `anon` key 可以放在前端，靠 **Row Level Security** 保证用户只能读写自己的 `user_banks` 行
- 不要把 `service_role` key 写进前端或 GitHub
