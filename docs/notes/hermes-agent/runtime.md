---
title: Hermes Agent 学习笔记 · 第十一~十二章 · 运行与接入
pageClass: notes-doc
outline: [2, 3]
aside: true
---

## 第十一章 六大执行后端——代码到底在哪台机器上跑的

### 11.1 六种地方可以跑

| 后端 | 适用场景 | 特点 |
|:---|:---|:---|
| **Local** | 本地开发调试 | 默认，不需要额外配置 |
| **Docker** | 容器隔离生产环境 | 需要装 Docker |
| **SSH** | 远程服务器执行 | 配置 SSH 密钥和目标主机 |
| **Daytona** | 无服务器持久化 | 空闲时休眠，5 美元/月的 VPS 就能跑 |
| **Singularity** | HPC 高性能计算集群 | 需要 Singularity 环境 |
| **Modal** | 无服务器 GPU/云 | 空闲时休眠，近零成本 |

### 11.2 为什么需要这么多后端

Hermes 的设计目标是"**随处运行，不仅限于你的笔记本电脑**"。

你可以这样用：
- 在一台 5 美元/月的 VPS 上运行 Hermes
- 通过 Telegram 跟它对话，不需要自己 SSH 登录那台机器
- 它不依赖于你的笔记本开不开机

Daytona 和 Modal 提供无服务器持久化——你的环境在空闲时休眠，成本几乎为零。需要时自动唤醒，按需付费。

### 11.3 怎么切换后端

```bash
# 命令行切换
hermes config set backend docker

# 或者改配置文件 ~/.hermes/config.yaml
backend: docker
```

**对比 GA**：GA 主要在本地跑，通过 ADB 控制手机。Hermes 的执行后端更丰富，特别是云原生支持是 GA 没有的。

### 11.4 如果你跟别人解释

> "Hermes 可以在 6 种地方执行代码：本地、Docker、SSH 远程服务器、Daytona（无服务器）、Singularity（HPC 集群）、Modal（无服务器 GPU）。一行命令切换。好处是你的 Agent 可以跑在 5 美元/月的云服务器上，通过 Telegram 跟它对话，不依赖你的笔记本。"

---

## 第十二章 20+ 消息平台——怎么接通所有聊天软件的

### 12.1 支持哪些平台

| 类别 | 平台 |
|:---|:---|
| **即时通讯** | Telegram、Discord、Slack、WhatsApp、Signal、Matrix |
| **企业协作** | 钉钉、飞书、企业微信、Teams、Google Chat |
| **中国平台** | 微信、QQ、元宝 |
| **邮件/短信** | Email、SMS |
| **智能家居** | Home Assistant |
| **苹果生态** | BlueBubbles (iMessage) |
| **通用** | Webhook、API Server、CLI 命令行 |

### 12.2 怎么做到同时接这么多平台——统一网关架构

所有平台通过**一个 Gateway 进程**统一管理：

```
                    ┌─────────────────┐
                    │  Hermes Gateway  │
                    │   （一个进程）    │
                    └───────┬─────────┘
                            │
           ┌────────────────┼────────────────┐
           │                │                │
    ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐
    │  Telegram   │  │  Discord    │  │  飞书       │
    │  适配器     │  │  适配器     │  │  适配器     │
    └─────────────┘  └─────────────┘  └─────────────┘
    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
    │  WhatsApp   │  │  Slack      │  │  ...        │
    │  适配器     │  │  适配器     │  │             │
    └─────────────┘  └─────────────┘  └─────────────┘
```

每个平台有一个"适配器"（Adapter），所有适配器继承同一个抽象类 `BasePlatformAdapter`，实现四个统一接口：
- `connect()`：连接平台
- `disconnect()`：断开连接
- `send()`：发消息
- `get_chat_info()`：获取聊天信息

不管消息来自 Telegram 还是飞书，适配器都把它转成统一的 `MessageEvent` 格式。后面的处理逻辑完全一样——不需要为每个平台写一套处理代码。

**📝 代码讲解——适配器模式长什么样**

```python
# gateway/platforms/base.py 中的抽象接口

class BasePlatformAdapter(ABC):
    """所有平台适配器必须实现这4个方法"""

    @abstractmethod
    async def connect(self):
        """建立连接（飞书用 websocket，Telegram 用 long polling）"""
        pass

    @abstractmethod
    async def disconnect(self):
        """断开连接"""
        pass

    @abstractmethod
    async def send(self, chat_id: str, content: str):
        """发消息到指定聊天"""
        pass

    @abstractmethod
    async def get_chat_info(self, chat_id: str) -> dict:
        """获取聊天信息（群名、成员等）"""
        pass


# 飞书适配器（feishu.py）
class FeishuAdapter(BasePlatformAdapter):
    async def connect(self):
        # 飞书用 websocket 长连接
        self.ws = await websockets.connect("wss://open.feishu.cn/...")

    async def send(self, chat_id, content):
        # 飞书的发消息 API
        await self.client.im.message.create({
            "receive_id": chat_id,
            "msg_type": "text",
            "content": json.dumps({"text": content})
        })


# Telegram 适配器（telegram.py）
class TelegramAdapter(BasePlatformAdapter):
    async def connect(self):
        # Telegram 用长轮询
        self.bot = await Bot(token=TELEGRAM_TOKEN)

    async def send(self, chat_id, content):
        # Telegram 的发消息 API
        await self.bot.send_message(chat_id=chat_id, text=content)
```

**两种 API 格式完全不同，但都转成了同一件事：发消息。** Gateway 核心只调 `adapter.send(chat_id, message)`，不管后面是飞书还是 Telegram。

**💡 生动类比**：国际旅行时你需要转接头——中国的三脚插头插不进欧洲的两孔插座。适配器就是那个转接头——Gateway 是"插座端"（统一接口），飞书/Telegram/Slack 是"各国的墙"，适配器就是中间的转接头。你换一个国家只需要换一个转接头（写一个新的适配器类），不需要重新装修房子（改 Gateway 核心逻辑）。

### 12.3 网关有哪些贴心设计

| 设计 | 怎么做的 |
|:---|:---|
| **非阻塞处理** | 收到消息后立刻返回，在后台异步处理。不会因为处理慢导致消息积压 |
| **会话级中断** | 你发新消息时，自动中断 Agent 正在干的上一件事 |
| **照片连发合并** | 你连发 3 张照片不会触发 3 次处理，会合并成一条多图消息 |
| **智能消息分块** | 回复太长时按平台限制分割，但保持代码块完整（不会把一段代码从中间截断） |
| **富媒体路由** | 自动处理 TTS 音频、Markdown 图片、本地文件路径 |
| **UTF-16 安全截断** | 各平台有字数限制，但 emoji 和中文在 UTF-16 编码下占不同长度。Gateway 用二分搜索算法精确截断，保证不会把一个字符切两半 |
| **SSRF 防护** | Agent 下载用户发的图片 URL 时，防止被恶意重定向到内网地址（如 `http://169.254.169.254/` 云元数据） |

### 12.4 飞书怎么接入（举个例子）

```bash
# 第1步：在飞书开放平台创建应用，开启 Bot 能力
# 拿到 App ID 和 App Secret

# 第2步：写配置
vim ~/.hermes/.env
```

写入：
```bash
FEISHU_APP_ID=cli_xxx              # 你的飞书APPID
FEISHU_APP_SECRET=your_secret      # 你的飞书APPSECRET
FEISHU_DOMAIN=feishu               # 用飞书中国版
FEISHU_CONNECTION_MODE=websocket   # 推荐用 websocket，不需要公网 webhook
FEISHU_GROUP_POLICY=allowlist      # 群里不是谁都能用
FEISHU_ALLOWED_USERS=ou_your_open_id  # 只允许指定用户调用
```

```bash
# 第3步：启动网关
hermes gateway

# 第4步：私聊机器人发条消息，能回复就成功了
```

### 12.5 接入后能用自然语言创建定时任务

```bash
# 每天早 8 点总结昨日邮件，发到 Telegram
hermes schedule "每天早上 8 点，汇总我的邮件并发送到 Telegram"

# 查看已配置的任务
hermes schedule list

# 删除任务
hermes schedule remove <task-id>
```

### 12.6 如果你跟别人解释

> "Hermes 通过一个统一的 Gateway 进程管理所有平台。每个平台有一个适配器，适配器把不同平台的消息格式统一成 MessageEvent。所以不管消息来自 Telegram 还是飞书，后面的处理逻辑都一样。适配器只要实现 connect/disconnect/send/get_chat_info 四个接口就行。网关还有贴心设计——照片连发合并、智能消息分块不截断代码块、会话级中断等。"

---
