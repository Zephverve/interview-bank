#!/usr/bin/env python3
"""将 AI Agent 面试全攻略 PDF 转为完整 Markdown 章节（不省略内容）。"""
from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PDF = ROOT / "guides" / "ai-agent-interview-guide-zh.pdf"
OUT_DIR = ROOT / "guides" / "ai-agent-interview-guide"

CHAPTERS = [
    {
        "slug": "intro",
        "sidebar": "00 · 从零到 Offer",
        "file": "intro.md",
        "marker": "AI Agent 面试全攻略 -- 从零到 Offer",
    },
    {
        "slug": "interview-toc",
        "sidebar": "面试八股文 · 总目录",
        "file": "interview-toc.md",
        "marker": "AI Agent 面试八股文 -- 总目录",
    },
    {
        "slug": "mod-01-basics",
        "sidebar": "01 · Agent 基础概念",
        "file": "mod-01-basics.md",
        "marker": "01 AI Agent 基础概念（面试八股文）",
    },
    {
        "slug": "mod-02-frameworks",
        "sidebar": "02 · 核心框架",
        "file": "mod-02-frameworks.md",
        "marker": "02 核心框架（AI Agent 面试八股文 · 模块二）",
    },
    {
        "slug": "mod-03-rag",
        "sidebar": "03 · RAG 技术",
        "file": "mod-03-rag.md",
        "marker": "03 RAG 技术（面试八股文 · 模块三）",
    },
    {
        "slug": "mod-04-tools",
        "sidebar": "04 · 工具调用",
        "file": "mod-04-tools.md",
        "marker": "04 工具调用（Tool / Function Calling）",
    },
    {
        "slug": "mod-05-memory",
        "sidebar": "05 · 记忆系统",
        "file": "mod-05-memory.md",
        "marker": "05 记忆系统（Memory）",
    },
    {
        "slug": "mod-06-multi-agent",
        "sidebar": "06 · 多智能体",
        "file": "mod-06-multi-agent.md",
        "marker": "06 多智能体系统（Multi-Agent Systems）",
    },
    {
        "slug": "mod-07-llm",
        "sidebar": "07 · 大模型基础",
        "file": "mod-07-llm.md",
        "marker": "07 大模型基础（面试八股文）",
    },
    {
        "slug": "mod-08-engineering",
        "sidebar": "08 · 工程化实践",
        "file": "mod-08-engineering.md",
        "marker": "08 工程化实践（面试八股文）",
    },
    {
        "slug": "mod-09-prompt",
        "sidebar": "09 · Prompt 工程",
        "file": "mod-09-prompt.md",
        "marker": "09 Prompt 工程（Prompt Engineering）",
    },
    {
        "slug": "hiring-analysis",
        "sidebar": "企业招聘需求分析",
        "file": "hiring-analysis.md",
        "marker": "2026 年 AI Agent 企业招聘需求分析",
    },
    {
        "slug": "opensource-notes",
        "sidebar": "开源项目学习笔记",
        "file": "opensource-notes.md",
        "marker": "开源项目学习笔记",
    },
    {
        "slug": "resume-guide",
        "sidebar": "简历撰写指南",
        "file": "resume-guide.md",
        "marker": "AI Agent 项目简历撰写指南（小白向 · 详细版）",
    },
    {
        "slug": "star-guide",
        "sidebar": "STAR 面试稿指南",
        "file": "star-guide.md",
        "marker": "STAR 面试稿准备指南（小白版）",
    },
    {
        "slug": "project-qa",
        "sidebar": "项目面试问答集",
        "file": "project-qa.md",
        "marker": "企业级 AI Agent 项目面试问答集",
    },
]

FOOTER_RE = re.compile(r"^\s*\d+\s+「小番薯资料铺」\s*$")
SECTION_RE = re.compile(r"^(\d+(?:\.\d+)+)\s+(.+?)\s*$")
TOP_SECTION_RE = re.compile(r"^(\d+)\.\s+(.+?)\s*$")
CODE_LANG_RE = re.compile(r"^\s*(python|bash|java|go|sql|json|yaml|typescript|javascript)\s*$", re.I)
Q_RE = re.compile(r"^Q(\d+)[:：]")
A_RE = re.compile(r"^A[:：]")


def extract_pdf_text(pdf: Path) -> str:
    result = subprocess.run(
        ["pdftotext", "-layout", str(pdf), "-"],
        capture_output=True,
        check=True,
    )
    return result.stdout.decode("utf-8", errors="replace")


def find_marker_pos(text: str, marker: str) -> int:
    idx = text.find(f"\f{marker}")
    if idx != -1:
        return idx + 1
    idx = text.find(marker)
    if idx == -1:
        raise ValueError(f"找不到章节标记: {marker}")
    return idx


def split_chapters(text: str) -> list[tuple[dict, str]]:
    positions = []
    for ch in CHAPTERS:
        positions.append((ch, find_marker_pos(text, ch["marker"])))
    positions.sort(key=lambda x: x[1])

    chunks: list[tuple[dict, str]] = []
    for i, (ch, start) in enumerate(positions):
        end = positions[i + 1][1] if i + 1 < len(positions) else len(text)
        chunks.append((ch, text[start:end]))
    return chunks


def clean_line(line: str) -> str | None:
    line = line.replace("\u200b", "").replace("\f", "").rstrip()
    if not line.strip():
        return ""
    if FOOTER_RE.match(line):
        return None
    if line.strip() in {"目录", "Table of Contents"}:
        return None
    return line


def escape_angle_brackets(line: str) -> str:
    """避免 VitePress 将 < 解析为 HTML；保留全文比较符号语义。"""
    return line.replace("<", "&lt;")


def is_trailing_code_lang(line: str) -> tuple[str, str] | None:
    """pdftotext -layout 常把 python/bash 放在行尾。"""
    m = re.match(r"^(.+?)\s{2,}(python|bash|java|go|sql|json|yaml|typescript|javascript)\s*$", line, re.I)
    if m:
        return m.group(1).strip(), m.group(2).lower()
    return None


def convert_to_markdown(title: str, raw: str) -> str:
    lines = raw.split("\n")
    out: list[str] = [f"# {title.replace(' -- ', ' — ')}", ""]
    in_code = False
    code_lang = ""

    i = 0
    while i < len(lines):
        line = lines[i]
        cleaned = clean_line(line)
        if cleaned is None:
            i += 1
            continue

        stripped = cleaned.strip()

        trailing = None if in_code else is_trailing_code_lang(cleaned)
        if trailing:
            prefix, code_lang = trailing
            if prefix:
                out.append(escape_angle_brackets(prefix))
            in_code = True
            out.append(f"```{code_lang}")
            i += 1
            continue

        if not in_code and CODE_LANG_RE.match(stripped):
            code_lang = stripped.lower()
            in_code = True
            out.append(f"```{code_lang}")
            i += 1
            continue

        if in_code:
            if stripped == "" and i + 1 < len(lines):
                nxt = clean_line(lines[i + 1])
                if nxt and (
                    SECTION_RE.match(nxt.strip())
                    or TOP_SECTION_RE.match(nxt.strip())
                    or Q_RE.match(nxt.strip())
                    or (nxt.strip().endswith("​") and len(nxt.strip()) < 80)
                ):
                    out.append("```")
                    out.append("")
                    in_code = False
                    continue
            out.append(cleaned)
            i += 1
            continue

        if stripped.endswith("​") and len(stripped) < 100 and not stripped.startswith("Q"):
            heading = stripped.replace("​", "").strip()
            if heading and heading != title.replace(" -- ", " — "):
                if re.match(r"^\d+\.\d+", heading):
                    out.append(f"### {heading}")
                elif re.match(r"^\d+\.", heading):
                    out.append(f"## {heading}")
                else:
                    out.append(f"## {heading}")
                out.append("")
                i += 1
                continue

        m = SECTION_RE.match(stripped)
        if m:
            out.append(f"### {m.group(1)} {m.group(2)}")
            out.append("")
            i += 1
            continue

        m = TOP_SECTION_RE.match(stripped)
        if m and len(m.group(2)) < 80:
            out.append(f"## {m.group(1)}. {m.group(2)}")
            out.append("")
            i += 1
            continue

        if Q_RE.match(stripped):
            out.append(f"**{stripped}**")
            i += 1
            continue

        if A_RE.match(stripped):
            out.append(f"**{stripped[:2]}**{stripped[2:]}")
            i += 1
            continue

        out.append(escape_angle_brackets(cleaned))
        i += 1

    if in_code:
        out.append("```")

    body = "\n".join(out)
    body = re.sub(r"\n{3,}", "\n\n", body)
    return body.strip() + "\n"


def main() -> int:
    if not PDF.exists():
        print(f"❌ PDF 不存在: {PDF}", file=sys.stderr)
        return 1

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    text = extract_pdf_text(PDF)
    chunks = split_chapters(text)

    total_chars = 0
    for ch, raw in chunks:
        title = ch["marker"].split("（")[0].strip()
        md = convert_to_markdown(title, raw)
        dest = OUT_DIR / ch["file"]
        dest.write_text(md, encoding="utf-8")
        total_chars += len(md)
        print(f"✓ {ch['file']} — {len(md):,} 字")

    print(f"\n✅ 共 {len(chunks)} 章，合计 {total_chars:,} 字 → {OUT_DIR.relative_to(ROOT)}/")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
