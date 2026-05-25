# 开新对话 · 交接模板

复制到 Cursor 新对话，按需删改。

---

## 需求拆解

```markdown
@src/AI_coding/STATUS.md
@src/AI_coding/iteration-XX/REQUIREMENTS.md

角色：需求拆解
本步任务：把 REQUIREMENTS 拆成可写 Prompt 的结构
定稿 Prompt：无
请只做：输出分析，不写 Prompt、不改代码
```

## Prompt 审

```markdown
@src/AI_coding/STATUS.md
@src/AI_coding/iteration-XX/prompt.md

角色：Prompt 审
本步任务：审阅 Prompt 是否可交给实现
定稿 Prompt：草稿
请只做：通过/需改 + 清单，不改代码
```

## 实现

```markdown
@src/AI_coding/STATUS.md
@src/AI_coding/iteration-XX/prompt.md

角色：实现
本步任务：（一句话）
定稿 Prompt：src/AI_coding/iteration-XX/prompt.md（prompt_status: 已定稿）
请只做：按 Prompt 白名单改代码
```

## 用户（验收后更新 STATUS）

```markdown
@src/AI_coding/STATUS.md

本步：验收通过，更新代码现状与 prompt_status
```
