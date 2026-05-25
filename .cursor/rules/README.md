# Agent 流水线 · 本项目配置

> 通用可复制版本见 [`agent-workflow-template/`](../../agent-workflow-template/README.md)

## 三角色（做事 Agent）

| 角色 | 规则 | 一句话 |
|------|------|--------|
| 需求拆解 | `requirements-analyst.mdc` | 拆需求 + **读/建/写 STATUS** + `analysis.md` |
| Prompt 审 | `prompt-reviewer.mdc` | 点评 Prompt，不写代码 |
| 实现 | `implementer.mdc` | 按**定稿** Prompt 改 `src/**` |

**用户**：定稿 Prompt、验收、更新代码现状 / review。

全局协议：`agent-protocol.mdc`（`alwaysApply: true`）

## 标准流水线

```
需求 → [需求拆解]（更新 STATUS）→ 你写 prompt → [Prompt审] → 定稿
    → [实现] → 你验收 → 你更新 STATUS 代码现状
```

## STATUS 谁写

| 字段 | 需求拆解 | 用户 |
|------|:--------:|:----:|
| 本步任务 / Agent 建议 | ✅ | ✅ |
| prompt_status 未开始/草稿 | ✅ | ✅ |
| prompt_status 已定稿 | ❌ | ✅ |
| 验收后代码现状 | ❌ | ✅ |

## 开对话模板

```markdown
@src/AI_coding/STATUS.md
@src/AI_coding/practice N/REQUIREMENTS.md

角色：需求拆解
本步任务：（一句话）
请：读/更新 STATUS，输出 analysis，不写 Prompt、不改代码
```
