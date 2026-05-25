# Agent 流水线 · 本项目

| 角色 | 规则 | STATUS |
|------|------|:------:|
| 需求拆解 | `requirements-analyst.mdc` | ✅ 读写 |
| Prompt 审 | `prompt-reviewer.mdc` | 👁 |
| 实现 | `implementer.mdc` | 👁 |

**路径**

| 用途 | 路径 |
|------|------|
| STATUS | `src/AI_coding/STATUS.md` |
| 迭代目录 | `src/AI_coding/iteration-01/` |
| 模板 | `docs/agent/*.template.md` |

**开对话**

```markdown
@src/AI_coding/STATUS.md

角色：[需求拆解 / Prompt审 / 实现]
本步任务：（一句话）
定稿 Prompt：（路径，或「无」）
```
