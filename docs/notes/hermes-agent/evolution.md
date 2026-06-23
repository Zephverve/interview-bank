---
title: Hermes Agent 学习笔记 · 第七章 · 自进化闭环
pageClass: notes-doc
outline: [2, 3]
aside: true
---

## 第七章 自进化闭环——Agent 怎么"自己教自己"的

> 🎙️ **老师开讲**：这一章是整份笔记里最值钱的一章——Hermes 跟其他所有 Agent 框架最大的区别就在这。前面的记忆和技能都很重要，但它们有个共同的毛病：**被动**。记忆要人写入，技能要人创建，过时了要人维护。如果 Agent 能自己判断"这个经验值得保存"、自己把经验写成技能、用的时候发现过时了自己修——那会怎样？那就是一个**自进化的活系统**，不是一个死工具。咱们现在来看看这个闭环是怎么一步步转起来的。我会用一个完整的例子从头到尾演一遍，看完了你就能拿去跟任何人讲。

这一章是 Hermes **最具区分度**的设计，也是它和大多数 Agent 框架的根本区别。

### 7.1 之前缺什么

前两层（记忆+技能）的缺口：记忆能存事实，技能能存方法论，但两者都是**被动**的——需要有人写入、有人维护。

如果 Agent 自己能判断"这次经验值得保存"并自主创建技能，发现问题自己修呢？这就是自进化闭环。

### 7.2 整个闭环长什么样——五步循环

这是本章的核心，我把每一步都讲清楚：

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  ① 引导               ② 创建              ③ 索引        │
│  system prompt 里     Agent 调用            自动扫描     │
│  告诉 Agent           skill_manage         磁盘上的      │
│  "该存经验了"         创建新技能            SKILL.md     │
│                       写入文件              注入 prompt  │
│                                                          │
│  ④ 执行                       ⑤ 修复                     │
│  skill_view() 加载            skill_manage               │
│  按步骤执行                    action='patch'            │
│                               修复过时内容               │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

这五步形成一个闭环，**每一步都是自动的**。下面逐步拆解。

### 7.3 第①步：怎么让 Agent 知道"该学了"

Agent 不会天生知道该保存经验。这个"自觉"来自 system prompt 里的一段引导文字：

```python
SKILLS_GUIDANCE = (
    "做完一个复杂任务（5次以上工具调用）、修了一个棘手的 bug、"
    "或者发现了一个有用的工作流之后，用 skill_manage 把方法存成技能，"
    "下次就能复用了。\n"
    "用技能的时候如果发现它过时了、不完整、或者有错误，"
    "立刻用 skill_manage(action='patch') 修复——别等别人来修。"
    "不被维护的技能是负债，不是资产。"
)
```

两个触发条件：
- **该创建技能了**：刚做完复杂任务（5+ 工具调用）、修了棘手 bug、发现有用工作流
- **该修复技能了**：用技能时发现过时/不完整/有错误

最后一句是精髓——**"不被维护的技能是负债，不是资产。"** 这句话赋予了 Agent **维护者角色**——不光要学新技能，还得维护旧技能。

**对比 GA**：GA 也有类似机制——"每解决一个新任务，自动将执行路径固化为 Skill"。但 Hermes 更进一步——不光创建，还**主动修复**。

### 7.4 第②步：Agent 怎么创建技能

Agent 决定该存技能了，就调用 `skill_manage(action="create")`。创建过程有**六步验证**：

```
Agent 调用 skill_manage(action="create", name="deploy-to-vercel", content="...")
    ↓
第①步：验证名字格式（不能有特殊字符、不能太长）
    ↓
第②步：验证 YAML frontmatter 完整（必须有 name、description 等字段）
    ↓
第③步：验证内容大小（不能超过 10 万字符）
    ↓
第④步：检查同名技能是否已存在（避免覆盖）
    ↓
第⑤步：原子写入文件（先写临时文件，再替换）
    ↓
第⑥步：安全扫描（扫描注入攻击等威胁）
    ↓
扫描不通过？→ 立刻删除刚创建的文件（回滚）
扫描通过？→ 创建成功 ✅
```

六步层层把关，特别注意第⑥步——安全扫描不通过就回滚删除，确保不会写入被注入的恶意技能。

**📝 代码讲解——六步验证在代码里怎么串起来的**

```python
# tools/skill_manager_tool.py 中创建技能的简化流程

def create_skill(name, content):
    """Agent 创建的技能要过六道安检"""

    # 第①步：名字检查
    if not re.match(r'^[a-z0-9\-_]+$', name):
        return Error("技能名只能包含小写字母、数字、短横、下划线")

    # 第②步：格式检查
    if not has_valid_frontmatter(content):
        return Error("技能缺少必需的 YAML frontmatter (name, description)")

    # 第③步：大小检查
    if len(content) > 100_000:
        return Error(f"技能太大 ({len(content)} 字符)，上限 100,000 字符")

    # 第④步：重名检查
    skill_path = f"~/.hermes/skills/{name}/SKILL.md"
    if os.path.exists(skill_path):
        return Error(f"技能 '{name}' 已存在，不允许覆盖")

    # 第⑤步：原子写入
    os.makedirs(os.path.dirname(skill_path), exist_ok=True)
    tmp_path = skill_path + ".tmp"
    with open(tmp_path, "w") as f:
        f.write(content)

    # 第⑥步：安全扫描
    threats = scan_for_threats(content)
    if threats:
        os.remove(tmp_path)  # ← 回滚！删除刚写的临时文件
        return Error(f"安全扫描不通过: {[t['type'] for t in threats]}")

    # 全部通过 → 原子替换正式文件
    os.replace(tmp_path, skill_path)
    return Success(f"技能 '{name}' 创建成功！")
```

**💡 生动类比**：这就像制造疫苗的质控流程——先查名字（这个病毒叫啥）、查配方（成分对不对）、查剂量（不会超标吧）、查重复（这个编号没被用过吧）、装管（先装试管）、最后做安全检测（不会打进去反而中毒吧）。六道关卡，任何一道不过就打回重做。最后一步安全检测不通过还把装好的试管扔掉（回滚删除），确保不会有不合格产品进入系统。

### 7.5 第③步：技能怎么被自动发现

技能创建后**不需要"注册"**。系统会自动扫描磁盘上所有 SKILL.md 文件，生成索引注入 system prompt。

具体过程：
```
prompt_builder 组装 system prompt 时
    ↓
调用 build_skills_system_prompt()
    ↓
扫描 skills/、~/.hermes/skills/、.hermes/skills/ 三个目录
    ↓
读取每个 SKILL.md 的 frontmatter（name + description）
    ↓
生成索引列表注入 system prompt
    ↓
两层缓存加速：内存 LRU 缓存 + 磁盘快照
```

还支持条件激活——有些技能只在特定工具集可用时才出现（比如需要 Docker 的技能，没装 Docker 就不显示）。

### 7.6 第④步：Agent 怎么使用技能

Agent 在 system prompt 里看到技能目录后，判断当前任务需要某个技能：

```
Agent 判断"这个任务需要 deploy-to-vercel 技能"
    ↓
调用 skill_view("deploy-to-vercel")
    ↓
四重安全检查：
  1. 平台兼容性检查（这个技能在我的系统上能用吗？）
  2. 信任目录检查（这个技能来自可信来源吗？）
  3. 注入检测（内容有没有被篡改？）
  4. 禁用状态检查（这个技能被用户手动禁用了吗？）
    ↓
全部通过 → 返回完整的 SKILL.md 内容
    ↓
Agent 按步骤一步一步执行
```

### 7.7 第⑤步：发现问题怎么自动修复（最关键的一环）

这是闭环中**最关键**的一步，也是 Hermes 和其他 Agent 框架最大的区别。

场景：Agent 在执行"部署到 Vercel"技能时，发现技能里写的命令 `vercel deploy` 已经不管用了，现在应该用 `vercel --prod`。

普通 Agent：执行失败，报错，你手动去改技能文件。
Hermes Agent：**立刻自己修**。

```
Agent 执行技能时发现问题
    ↓
立刻调用 skill_manage(action="patch", name="deploy-to-vercel",
                       old_string="vercel deploy", new_string="vercel --prod")
    ↓
系统读取当前 SKILL.md 内容
    ↓
用模糊匹配找到"vercel deploy"这段文字
    ↓
替换成"vercel --prod"
    ↓
原子写入（先临时文件，再替换）
    ↓
安全扫描
    ↓
扫描不通过？→ 回滚到原始内容
扫描通过？→ 修复成功 ✅
    ↓
Agent 继续用修好的技能执行任务
```

**这里有个关键设计——模糊匹配。**

Agent 输出的文字缩进可能和原文件不完全一致。如果用精确匹配，经常找不到要改的那段。Hermes 用了一个叫 `fuzzy_find_and_replace` 的函数，能容忍空白差异和缩进变化，大幅提高 Agent 自主修补的成功率。

**📝 代码讲解——模糊匹配到底怎么做的**

这个函数解决一个很实际的问题：LLM 输出文本时，经常搞不清楚缩进。Agent 想说"把文件里的第3步改成 xxx"，但输出的 old_string 可能多一个空格或少一个换行。精确匹配就找不到了。

看看简化后的实现思路：

```python
# tools/fuzzy_match.py 的简化逻辑

def fuzzy_find_and_replace(file_content, old_string, new_string):
    """
    在 file_content 中找到 old_string 的位置，替换为 new_string。
    容忍空白字符（空格、Tab、换行）的差异。
    """

    # 第1步：把双方都 "规范化"——去掉首尾空白，中间多个空格合并成一个
    def normalize(text):
        import re
        text = text.strip()                    # 去首尾空白
        text = re.sub(r'[ \t]+', ' ', text)    # 多个空格/Tab合并成一个空格
        text = re.sub(r'\n{2,}', '\n', text)   # 多个换行合并成两个
        return text

    # 第2步：把文件内容按行拆开
    lines = file_content.split('\n')

    # 第3步：对每一行进行规范化后匹配
    old_norm = normalize(old_string)

    for i in range(len(lines)):
        # 从第 i 行开始，取和 old_string 相同行数的内容
        candidate_lines = lines[i:i + len(old_string.split('\n'))]
        candidate = '\n'.join(candidate_lines)
        candidate_norm = normalize(candidate)

        if old_norm == candidate_norm:
            # 找到了！用原始行号做精确替换
            # 但保留原文件的行级结构，只替换内容
            lines[i:i + len(old_string.split('\n'))] = new_string.split('\n')
            return '\n'.join(lines)

    # 找不到 → 精确匹配也试一次（保底）
    if old_string in file_content:
        return file_content.replace(old_string, new_string, 1)

    # 都找不到 → 返回 None，上层会报错
    return None
```

**为什么这个很关键？** 想象一下——Agent 辛辛苦苦发现了一个 bug，兴致勃勃地去修文件，结果因为"多了一个空格"匹配失败……那这个"自动修复"就没意义了。模糊匹配让 Agent 修补的成功率从"偶尔能用"提高到"基本都能用"。

**💡 生动类比**：就好像你在 Word 里搜索"vercel deploy"，Word 默认是精确匹配——你输入少一个空格，它就告诉你"找不到"。模糊匹配相当于"模糊搜索"——你写"vercel  deploy"（两个空格），它也能找到"vercel deploy"（一个空格）。

### 7.8 闭环的完整性——每一步都不需要人

| 节点 | 干了什么 | 谁触发的 | 需要人吗 |
|:---|:---|:---|:---:|
| ① 引导 | 告诉 Agent "该存经验了" | 代码里写死的提示词 | ❌ |
| ② 创建 | 把经验写成 SKILL.md | Agent 自己判断 | ❌ |
| ③ 索引 | 扫描磁盘生成目录 | 系统自动 | ❌ |
| ④ 执行 | 加载技能按步骤干活 | Agent 自己匹配 | ❌ |
| ⑤ 修复 | 发现问题立即修补 | Agent 遇到问题时 | ❌ |

**每一步都是自动的。Agent 在解决你问题的同时，顺便改进了自己。**

### 7.9 和记忆层的配合

闭环不是孤立运作的，它和记忆层有双向互动：

```
记忆 → 技能：
  发现反复出现的模式 → 提升为正式技能
  （"用户老让我部署到 Vercel" → 创建"部署到 Vercel"技能）

技能 → 记忆：
  执行技能时学到新事实 → 写入 MEMORY.md
  （执行部署技能时发现 Vercel CLI 更新了 → 记下版本号）

历史搜索 → 技能：
  搜索历史发现反复解决类似问题 → 触发创建技能
  （搜索发现已经帮用户部署了 5 次类似项目 → 创建技能）
```

### 7.10 如果你跟别人解释

> "Hermes 的自进化闭环就是五步：第一步，system prompt 里有段话告诉 Agent'做完复杂任务要存技能'；第二步，Agent 自己判断该存了就调用 skill_manage 创建 SKILL.md；第三步，系统自动扫描磁盘把技能目录注入 prompt；第四步，Agent 需要时调用 skill_view 加载技能执行；第五步，执行时发现技能过时了，立刻调用 patch 修复。五步全是自动的，不需要人干预，不需要微调模型。"

---
