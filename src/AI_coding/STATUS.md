# AI Coding 工作状态（Agent 同步用）

> **单一事实来源**：三个 Agent 换对话前读此文件。  
> **更新权限**：见 [§ 更新权限](#更新权限) · 全局规则 `.cursor/rules/agent-protocol.mdc`

---

## 当前阶段

| 项 | 值 |
|----|-----|
| Phase | **Phase 2 半独立期** |
| 练习 | 练习 4 ✅ 已验收 · 复盘 [`practice 4/review.md`](./practice%204/review.md) |
| 上次完成 | 练习 4 — Mock 登录 + user store + 路由守卫（2026-05-22） |
| 当前 Agent 建议 | **教练** — 练 5 骨架；或 **你** — 写 `practice 5/prompt.md` |

---

## 代码现状（简要）

- **鉴权**：`stores/user.js`；`/login`；`AppHeader` 退出；`App.vue` header 白名单
- **守卫**：`/todos` `requiresAuth`；`beforeEach` 读 `isLoggedIn`；`/home` `/about` 公开
- **Todo**：`stores/todos.js` + `TodoList`（练 3 功能完整）
- **路由**：`/` → `/login`；`/home` `/about` `/login` `/todos`
- **未做（练 5）**：Todo **localStorage** 持久化

---

## 本步任务（练习 5 占位）

| 项 | 值 |
|----|-----|
| 目标 | Todo 列表 localStorage 持久化，刷新不丢失 |
| 预计 Prompt 数 | **1**（你主导） |
| 涉及文件（预估） | `stores/todos.js`；可能抽 `utils/storage` |
| prompt 路径 | `src/AI_coding/practice 5/prompt.md`（待建） |
| prompt_status | `未开始` |

---

## 有效约束（Prompt 必引用）

- todo `{ id, title, done }`；user 练 4 已定（练 5 登录持久化可选，默认仍内存）
- 复用 design tokens / `components.css`
- Prompt：**需求 → 数据边界 → 文件 → 约束与范围 → 验收**
- 默认 1 个功能 Prompt

---

## 更新权限

| 事件 | 谁更新 STATUS | 更新哪些字段 |
|------|---------------|--------------|
| 开始新练习 | **教练** 或 **用户** | 当前阶段、本步任务、prompt_status→未开始 |
| Prompt 写好待审 | **用户** | prompt_status→草稿（可选） |
| Prompt 审阅通过 | **用户**定稿文件；**教练**或**用户** | prompt_status→**已定稿** |
| 实现 Agent 交差 | **实现 Agent 不写** | — |
| 用户验收通过 | **用户** 或 **教练** | 代码现状、上次完成、prompt_status→未开始 |
| 练习复盘结束 | **教练** | 当前阶段、下一步、本步任务；写 `review.md` |

### 冲突预防

1. **实现 Agent / Prompt 审阅 Agent 不得修改本文件**
2. 同一时刻只有一个 Agent 角色在「写」STATUS（教练或用户）
3. `prompt_status` 非 `已定稿` 时，**实现 Agent 不得改 `src/**`**
4. 详细权限以 `.cursor/rules/agent-protocol.mdc` 为准

---

## Agent 交接模板（复制到新对话）

```markdown
@src/AI_coding/STATUS.md

角色：[教练 / Prompt审 / 实现]
本步任务：（一句话）
定稿 Prompt：（路径，或「无」）
请只做：（带练 / 审Prompt / 写代码）
```

---

*最后更新：练习 4 用户验收 + 理解验收通过 · 复盘 review.md*
