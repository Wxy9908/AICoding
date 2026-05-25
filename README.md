# new_work

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Compile and Minify for Production

```sh
pnpm build
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

### commit type

- feat: 新功能
- fix：修补bug
- docs：文档补充
- style：格式（不影响代码运行的变动）
- refactor：重构（既不是新增功能，也不是修改bug的代码变动）
- test：增加测试
- chore：构建过程或辅助工具的变动

# Agent 流水线 · 通用模板

可复制到**任意项目**，建立 **三角色做事 Agent + 用户** 协作流。

---

## 1. 安装（5 分钟）

### 1.1 复制文件

```text
agent-workflow-template/
  .cursor/rules/          →  你的项目/.cursor/rules/
  docs/agent/             →  你的项目/docs/agent/
```

共 **4 个规则文件**：`agent-protocol.mdc` + 3 个角色 `.mdc`（无 Coach）。

### 1.2 配置路径（必做）

打开 `.cursor/rules/agent-protocol.mdc`，修改 **项目配置**：

| 占位符            | 含义            | 示例                   |
| ----------------- | --------------- | ---------------------- |
| `{{AGENT_ROOT}}`  | 任务/状态文档根 | `docs/agent`           |
| `{{STATUS_FILE}}` | 状态单一来源    | `docs/agent/STATUS.md` |
| `{{SOURCE_GLOB}}` | 业务代码根      | `src/**`               |

各角色 `.mdc` 内 `@{{STATUS_FILE}}` 一并替换。

### 1.3 初始化 STATUS

```bash
cp docs/agent/STATUS.template.md docs/agent/STATUS.md
```

填项目名、技术栈、代码现状。

### 1.4 验证

```markdown
@docs/agent/STATUS.md
@.cursor/rules/agent-protocol.mdc

角色：需求拆解
请说明三角色分工与用户职责。
```

---

## 2. 三角色流水线

```text
┌─────────────┐
│ 原始需求     │  REQUIREMENTS / PRD / 一句话
└──────┬──────┘
       ▼
┌─────────────┐     可选；长 PRD 推荐
│ 需求拆解     │
└──────┬──────┘
       ▼
┌─────────────┐     用户撰写（10～20 行）
│  prompt.md  │ ──► Prompt 审 ──► 定稿
└──────┬──────┘
       ▼
┌─────────────┐
│  实现 Agent  │
└──────┬──────┘
       ▼
┌─────────────┐
│  用户验收    │  → 更新 STATUS / review
└─────────────┘
```

---

## 3. 目录建议

```text
docs/agent/
  STATUS.md
  iteration-01/
    REQUIREMENTS.md
    analysis.md
    prompt.md
    review.md
```

---

## 4. Prompt 规范

```markdown
## 背景

## 需求

## 数据边界

## 相关文件

## 保留

## 约束与范围

## 验收标准
```

---

## 5. 何时用哪个 Agent

| 场景                    | Agent                          |
| ----------------------- | ------------------------------ |
| 长 PRD、新任务 Step 1   | 需求拆解（**建/更新 STATUS**） |
| Prompt 草稿写完         | Prompt 审                      |
| `prompt_status: 已定稿` | 实现                           |
| 发题、定稿、验收、复盘  | **用户**                       |

---

## 6. 文件清单

| 文件                             | 用途        |
| -------------------------------- | ----------- |
| `agent-protocol.mdc`             | 全局协议    |
| `requirements-analyst.mdc`       | 需求拆解    |
| `prompt-reviewer.mdc`            | Prompt 审   |
| `implementer.mdc`                | 实现        |
| `docs/agent/STATUS.template.md`  | STATUS 模板 |
| `docs/agent/PROMPT.template.md`  | Prompt 模板 |
| `docs/agent/HANDOFF.template.md` | 开对话模板  |

---

## 7. 定制检查清单

- [ ] 已替换 `{{STATUS_FILE}}` / `{{AGENT_ROOT}}`
- [ ] `implementer.mdc` globs 匹配源码后缀
- [ ] 团队共识：用户定稿 Prompt、用户更新 STATUS
