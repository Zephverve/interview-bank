#!/usr/bin/env python3
"""Parse 答辩问题（背诵版）.docx → JSON on stdout."""
import json
import re
import sys
from docx import Document

doc = Document(sys.argv[1])
items = []
current_module = ''
current_q = None


def flush():
    global current_q
    if current_q:
        current_q['answer'] = '\n'.join(current_q.get('answer_lines', [])).strip()
        del current_q['answer_lines']
        items.append(current_q)
    current_q = None


for para in doc.paragraphs:
    t = para.text.strip()
    if not t or t.startswith('━'):
        continue
    m = re.match(r'^([一二三四五六七八])[、．.](.+)$', t)
    if m and len(t) < 40:
        flush()
        current_module = t
        continue
    if t.startswith('▶'):
        flush()
        current_q = {
            'module': current_module,
            'question': t.lstrip('▶').strip(),
            'answer_lines': [],
        }
        continue
    if t.startswith('▸') and current_q:
        current_q['answer_lines'].append(t.lstrip('▸').strip())
        continue
    if current_q:
        current_q['answer_lines'].append(t)

flush()
print(json.dumps(items, ensure_ascii=False))
