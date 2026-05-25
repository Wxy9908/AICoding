# AI Agent 工作状态（单一事实来源）

> 更新权限：**需求拆解 Agent**（本步任务）· **用户**（定稿/验收/代码现状）· Prompt 审 / 实现只读

---

## 项目配置

| 项 | 值 |
|----|-----|
| 项目名 | new_work |
| 技术栈 | Vue 3 + Vite + Pinia + Vue Router |
| 设计规范 | `src/assets/base.css` tokens + `src/assets/main.css` |

---

## 当前阶段

| 项 | 值 |
|----|-----|
| 阶段 | **迭代 1 · 商品管理后台** |
| 任务 | 用户撰写 `prompt.md` → Prompt 审 → 定稿 → 实现 |
| 上次完成 | 需求拆解（考核题目 [124.220.100.224](http://124.220.100.224/)） |
| 当前 Agent 建议 | **用户** 根据 analysis 撰写 Prompt |

---

## 代码现状（简要）

- **脚手架**：Home / About 两页；Pinia `counter` 示例 store
- **路由**：`/`、`/about`（`src/router/index.js`）
- **样式**：Vue 默认 `base.css` + `main.css`（`#app` 双栏 grid）
- **依赖**：无 UI 组件库（Element Plus 等未安装）
- **未做**：商品管理模块、Mock API、localStorage 持久化

---

## 本步任务

| 项 | 值 |
|----|-----|
| 目标 | 实现商品管理后台（列表/筛选/分页/CRUD/批量上下架/库存校验） |
| 需求 | `src/AI_coding/iteration-01/REQUIREMENTS.md` |
| 分析 | `src/AI_coding/iteration-01/analysis.md` |
| 定稿 Prompt | `src/AI_coding/iteration-01/prompt.md` |
| prompt_status | `未开始` |
| 白名单（预估） | `src/router/index.js`、`src/App.vue`、`src/assets/main.css`、`src/views/ProductManageView.vue`、`src/components/products/*`（Filters/Table/FormModal/Pagination/ConfirmDialog）、`src/stores/products.js`、`src/api/productsApi.js`、`src/constants/products.js`；可选删 `src/stores/counter.js` |

---

## 有效约束（Prompt 必引用）

- App 结构以脚手架为起点；新增路由/页面按 Prompt 白名单
- 样式优先复用 `base.css` 语义变量，避免硬编码色值
- Mock + localStorage 持久化；库存 > 0 不可下架（单条/批量/编辑保存）
- 分页固定每页 5 条；全选仅当前页，翻页重置
- 原生 UI 实现（不新增 npm 依赖）——除非 Prompt 明确引入 UI 库

---

## Agent 交接模板

```markdown
@src/AI_coding/STATUS.md

角色：[需求拆解 / Prompt审 / 实现]
本步任务：（一句话）
定稿 Prompt：（路径，或「无」）
请只做：（拆需求 / 审Prompt / 写代码）
```

---

*最后更新：2026-05-25 · 迭代 1 需求拆解完成（商品管理后台考核题）*
