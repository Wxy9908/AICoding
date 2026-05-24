# AI Coding 工作状态（Agent 同步用）

> **单一事实来源**：三个 Agent 换对话前读此文件。  
> **更新权限**：见 [§ 更新权限](#更新权限) · 全局规则 `.cursor/rules/agent-protocol.mdc`

---

## 当前阶段

| 项 | 值 |
|----|-----|
| Phase | **Phase 2 半独立期**（练 4–5 已完成，可 **Phase 2 通关自评** 或进 Phase 3） |
| 练习 | 练习 5 ✅ 已验收 · 复盘 [`practice 5/review.md`](./practice%205/review.md) |
| 上次完成 | 练习 5 — Todo localStorage 持久化（2026-05-22） |
| 当前 Agent 建议 | **教练** — Phase 2 通关自评；或启动 **练习 6** 模拟面试 |

---

## 代码现状（简要）

- **鉴权**：user store（内存）+ `/todos` 守卫
- **Todo**：`stores/todos.js` — Pinia + 筛选 + 增删完成 + **`app-todos` localStorage**
- **hydration**：启动 `loadTodosFromStorage()`；action 后 `persistTodos()`
- **filter**：不持久化，刷新回 `all`

---

## 本步任务（Phase 2 通关 / 练习 6 占位）

| 项 | 值 |
|----|-----|
| 选项 A | **Phase 2 通关自评**（练 4–5 复盘 + 45min 目标回顾） |
| 选项 B | **练习 6** — Phase 3 限时模拟面试（完整需求 + 45–60min 独立） |
| prompt 路径 | `src/AI_coding/practice 6/`（待建） |
| prompt_status | `未开始` |

---

## 有效约束（来自复盘，Prompt 必引用）

- todo `{ id, title, done }`；持久化 key `app-todos`
- user 登录默认仍内存（除非需求另定）
- Prompt 顺序：**需求 → 数据边界 → 文件 → 约束与范围 → 验收**
- 默认 1 个功能 Prompt；样式约束可合并

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

角色：[教练 / 需求拆解 / Prompt审 / 实现]
本步任务：（一句话）
定稿 Prompt：（路径，或「无」）
请只做：（带练 / 拆需求 / 审Prompt / 写代码）
```

---

*最后更新：练习 5 用户验收通过 · review.md 已写*
