---
title: Hermes Agent 学习笔记 · 第九章 · 工具系统
pageClass: notes-doc
outline: [2, 3]
aside: true
---

## 第九章 工具系统——40+ 工具怎么管理和调用的

### 9.1 从 9 个到 40+

你知道 GA 只有 9 个原子工具。Hermes 内置了 **40+ 工具**，覆盖范围广得多：

| 工具类别 | 具体功能 |
|:---|:---|
| **Web** | 搜索（Exa/Parallel/Firecrawl）+ 内容提取 |
| **终端** | 执行命令（6 种后端） |
| **文件** | 读写、模糊匹配 Patch、搜索 |
| **浏览器** | 自动化（导航/截图/点击/输入等 11 个子工具） |
| **视觉** | 图像分析 |
| **图像生成** | AI 图像生成 |
| **TTS** | 文字转语音（Edge TTS 免费 + ElevenLabs + OpenAI） |
| **技能** | 浏览、创建、编辑、自我改进 |
| **记忆** | 持久化跨会话记忆 |
| **会话搜索** | 全文搜索 + LLM 摘要 |
| **子代理** | 隔离子 Agent 并行执行 |
| **定时任务** | Cron 调度 |
| **MCP** | 外部工具发现与集成 |
| **安全** | 命令审批、SSRF 防护、注入检测 |

**对比 GA**：GA 的哲学是"9 个原子工具够了，复杂的靠 code_run 动态创建"。Hermes 的哲学是"内置常用工具，开箱即用"。各有优劣——GA 省 Token（工具描述少），Hermes 省事（不用每次现写）。

### 9.2 工具怎么自动注册的

工具不需要手动注册。每个工具文件在被导入时自动注册自己：

```python
# 比如终端工具文件被导入时，自动执行这段代码：
registry.register(
    name="terminal",           # 工具名字
    toolset="terminal",        # 属于哪个工具集
    schema=TERMINAL_SCHEMA,    # 参数格式定义
    handler=_handle_terminal,  # 实际执行函数
    check_fn=check_terminal_requirements,  # 环境检查函数
    emoji="💻",                # 显示图标
)
```

工具发现过程：
```
系统启动
    ↓
importlib.import_module() 强制导入所有工具文件
    ↓
每个文件导入时自动执行 registry.register()
    ↓
某个工具文件导入失败？→ 跳过它，不影响其他工具加载（容错）
    ↓
所有工具注册完毕，等待 Agent 调用
```

**💡 生动例子——"不用手动注册"是什么意思？**

用人类世界类比一下：

```
【手动注册（大部分框架的做法）】

你新买了一个空气炸锅，需要在物业管理处登记：
  "姓名：空气炸锅，功率：1500W，用途：炸薯条"
如果不登记，物业不知道你有个空气炸锅，你也不能用。

【自动注册（Hermes 的做法）】

你新买了一个空气炸锅，你把它放到厨房。
物业每天早上自动扫描每个房间有什么电器——
"哦，厨房多了一个空气炸锅，功率1500W，已加入可用电器列表。"
你不用去登记，放那儿就行。

```

**📝 代码流程（简化版）：**

```python
# 工具目录结构
# tools/
# ├── terminal.py    ← 这个文件底部有 registry.register(...)
# ├── web_search.py  ← 这个也是
# └── memory.py      ← 这个也是

# 系统启动时
def discover_tools():
    import importlib
    import os

    tool_files = ["tools.terminal", "tools.web_search", "tools.memory"]

    for module_name in tool_files:
        try:
            importlib.import_module(module_name)
            # ↑ 这一行会执行该 .py 文件里的所有代码
            # 包括底部的 registry.register(...) 那一行
            # 所以 "导入即注册"
        except ImportError:
            # 某个工具缺依赖（比如没装 Docker），跳过
            print(f"跳过 {module_name}，缺少依赖")
            continue
```

**为什么这样设计？** 因为 Hermes 的工具多（40+），如果每个都要手动在配置文件里写一行 `enable: terminal`，配置会变得很长、很难维护。自动发现 + 按需加载，开发者加新工具只要写一个 `.py` 文件并放在 `tools/` 目录下就行——其他什么都不用改。

### 9.3 工具集组合系统

工具可以打包成"工具集"，工具集之间还能互相引用：

```python
TOOLSETS = {
    "web":        {"tools": ["web_search", "web_extract"]},
    "terminal":   {"tools": ["terminal", "process"]},
    "debugging":  {"tools": ["terminal", "process"], "includes": ["web", "file"]},
    # debugging 工具集 = 自带的 terminal + process + 引用的 web + file
}
```

这样你启用一个 "debugging" 工具集，就自动获得了终端、进程管理、网页搜索、文件操作四个类别的工具。`resolve_toolset()` 函数带循环检测地递归解析这些引用关系。

**💡 生动例子——"我要调试一个线上 bug"**

某天你说："帮我查一下为什么用户登录后跳转失败了。"

```
Agent 判断：这是一个调试任务 → 需要 debugging 工具集
Agent 调用：enable_toolset("debugging")
    ↓
resolve_toolset("debugging") 开始解析：

  第1轮：debugging 自己的 tools → [terminal, process]
  第2轮：debugging 引用了 "web" → resolve_toolset("web")
            web 自己的 tools → [web_search, web_extract]
  第3轮：debugging 引用了 "file" → resolve_toolset("file")
            file 自己的 tools → [file_read, file_write, file_search]

  最终结果：Agent 一次性获得了 7 个工具：
    terminal, process, web_search, web_extract,
    file_read, file_write, file_search

  循环检测器：如果发现 A 引用 B 又引用 A → 拒绝加载，报错
```

**📝 递归解析代码（简化版）：**

```python
def resolve_toolset(name, visited=None):
    """递归解析工具集，返回所有工具。带循环引用检测。"""
    if visited is None:
        visited = set()

    if name in visited:
        # 循环引用！比如 A 引用 B，B 又引用 A
        raise ValueError(f"循环引用检测: {name}")
    visited.add(name)

    toolset = TOOLSETS[name]
    tools = list(toolset.get("tools", []))

    # 递归解析 includes
    for included in toolset.get("includes", []):
        tools.extend(resolve_toolset(included, visited.copy()))

    return tools
```

**📝 AST 预扫描——一个精妙的性能优化**

工具发现时，注册表不会盲目 `import` 所有 `.py` 文件——因为有些辅助模块 import 时可能触发网络请求或依赖检查。它先用 Python 的 `ast.parse()` 静态分析代码：

```python
# 简化版的 AST 预扫描逻辑
import ast

def is_tool_module(filepath):
    """判断一个 .py 文件是不是工具模块——不执行它，只分析语法树"""
    with open(filepath) as f:
        tree = ast.parse(f.read())

    for node in ast.walk(tree):
        # 找顶层函数调用：registry.register(...)
        if isinstance(node, ast.Call):
            if (isinstance(node.func, ast.Attribute) and
                isinstance(node.func.value, ast.Name) and
                node.func.value.id == "registry" and
                node.func.attr == "register"):
                return True  # 找到了！这是个工具模块
    return False
```

**效果**：只有确认了是工具模块的文件才会被 import，避免了副作用。60+ 个工具文件，启动依然飞快。

### 9.4 并行执行——保守但务实

Hermes 支持同时执行多个工具调用，但策略很**保守**：

```
Agent 一次请求中调用了 3 个工具
    ↓
检查每个工具是否在白名单里（_PARALLEL_SAFE_TOOLS）
    ↓
检查这些工具操作的文件路径有没有重叠
    （比如两个工具都写同一个文件 → 不能并行）
    ↓
白名单 + 路径不重叠 → 并行执行（最多 8 个线程）
否则 → 串行执行
    ↓
结果按原始顺序返回（不管谁先执行完）
```

**设计哲学**：保守但务实——宁可串行慢一点，也不要并行出错。未知工具一律串行。

### 9.5 如果你跟别人解释

> "Hermes 有 40+ 内置工具，分 Web、终端、文件、浏览器等类别。工具不用手动注册——每个工具文件导入时自动调用 registry.register() 注册自己。工具可以打包成工具集，工具集之间还能互相引用。并行执行很保守——只有白名单里的工具且路径不重叠时才并行，否则一律串行。"

### 9.6 安全审批四级体系（面试必问）

工具不是全开全关的——Hermes 给每个工具分配了审批等级：

| 等级 | 典型工具 | 审批方式 |
|:---|:---|:---|
| 🟢 **安全** | read_file, web_search, list_directory | 无需审批 |
| 🟡 **低风险** | write_file, edit_file, memory_write | 首次审批，可记住 |
| 🟠 **中风险** | execute_python, delegate_task | 每次审批 |
| 🔴 **高风险** | execute_shell, kill_process | 强制审批，无法跳过 |

**自定义审批策略：**

```yaml
# ~/.hermes/config.yaml
tools:
  approval:
    per_tool:
      write_file:
        strategy: "remember"    # 首次确认，后续记住
      execute_shell:
        strategy: "prompt"      # 每次都确认
    command_blacklist:
      - "rm -rf /"
```

```bash
hermes approval reset  # 撤销所有已记住的审批（换项目时常用）
```

**💡 实用原则**：新手可以先 `hermes tools disable execute_shell` 关掉最危险的，等熟悉了再逐步开放。

---
