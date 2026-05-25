# 需求拆解 · 商品管理后台（迭代 1）

> 原始需求：`REQUIREMENTS.md`（来源 [考核题目](http://124.220.100.224/)）  
> 代码基线：Vue 3 + Vite + Pinia + Vue Router 脚手架，无 UI 库、无业务模块

---

## 需求摘要

在现有 Vue 3 项目中实现**单页商品管理后台**：列表 + 筛选 + 分页（5 条/页）+ 新增/编辑弹窗 + 单条/批量上下架 + 删除；数据经 Mock API（Promise + setTimeout）读写 **localStorage**，刷新后持久化；核心业规为**库存 > 0 不可下架**（单条、批量、编辑保存均须拦截）。

---

## 必须做

1. **路由与页面**：至少一个商品管理页，承载完整布局（标题、筛选、批量栏、表格、分页）。
2. **Pinia 状态管理**：商品列表、筛选条件、分页、选中项、loading（可选）等集中管理。
3. **Mock API 层**：`localStorage` 持久化；异步 Promise 模拟 CRUD；首次无数据时注入 5 条初始 mock。
4. **列表 + 分页**：每页 5 条；页码切换；数据变更后重算总页数。
5. **筛选**：名称模糊 + 状态 + 分类，可组合；点「搜索」生效并重置到第 1 页。
6. **新增/编辑弹窗**：共用组件；字段校验（名称 2–20、价格 >0 两位小数、库存非负整数、分类/状态枚举）；新增 id 自增/时间戳，插列表顶部。
7. **单条上下架**：动态显示上架/下架按钮；下架时 `stock > 0` 警告「库存为 X 的商品不能下架，请先调整库存」。
8. **批量上下架**：当前页多选；批量下架任一有库存则**整批失败**并提示「XXX 商品库存不为 0，无法批量下架」；完成后清空选中。
9. **删除**：确认框后从列表移除（软删除 = 本地删除即可）。
10. **UI 细节**：状态标签（上架绿/下架红）、分类浅色圆角标签；全选仅当前页，翻页重置全选，单选联动全选。
11. **编辑保存时的下架校验**：若表单状态改为「下架」且库存 > 0，应拦截（与 3.3、3.5 一致）。

---

## 不做

- 真实后端接口、登录鉴权、多页面后台框架。
- 商品图片实际上传（表格内用 emoji/占位图模拟即可）。
- 加分项中的 loading / 响应式 / AI 注释（除非 Prompt 明确要求）。
- 引入 UI 库（除非 Prompt 明确允许并列入白名单依赖）。
- 保留脚手架 Home/About 演示内容（可改路由默认页，非必须保留）。

---

## 不明确（我的假设）

| # | 问题 | 假设（实现时可按 Prompt 调整） |
|---|------|--------------------------------|
| 1 | 路由路径未指定 | 使用 `/products` 为默认首页，或 `/` 直接渲染商品管理页 |
| 2 | 未安装 Element Plus 等 UI 库 | **原生 HTML + scoped CSS** 实现表格/弹窗/分页，避免新增依赖（与 package.json 现状一致） |
| 3 | 表格「图片」列 | 按分类映射 emoji 或固定占位，不入表单字段 |
| 4 | 批量下架失败提示多个违规商品 | 提示**第一个**库存 > 0 的商品名（文档示例为单条 XXX）；若需列举全部，Prompt 可补充 |
| 5 | `App.vue` 现有 logo + 双栏 grid 布局 | 简化为后台单栏布局，移除脚手架导航或仅保留商品页入口 |
| 6 | 编辑时库存为 0 但当前状态为上架 | 允许；仅「改为下架」且 stock > 0 时拦截 |
| 7 | localStorage key | 使用固定 key，如 `product-admin-data` |

---

## 涉及文件

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/router/index.js` | 修改 | 新增商品管理路由，设默认入口 |
| `src/App.vue` | 修改 | 简化为 `RouterView` 容器，去掉脚手架 header |
| `src/assets/main.css` | 修改 | 调整 `#app` 布局为后台全宽（去 grid 双栏） |
| `src/views/ProductManageView.vue` | 新增 | 页面容器：标题、筛选、批量栏、表格、分页 |
| `src/components/products/ProductFilters.vue` | 新增 | 搜索框 + 状态下拉 + 分类下拉 + 搜索按钮 |
| `src/components/products/ProductTable.vue` | 新增 | 表格、复选框、操作列、状态/分类标签 |
| `src/components/products/ProductFormModal.vue` | 新增 | 新增/编辑共用弹窗 + 字段校验 |
| `src/components/products/ProductPagination.vue` | 新增 | 上一页/下一页/页码 |
| `src/components/products/ConfirmDialog.vue` | 新增 | 删除确认（可与 alert 合并，视 Prompt 粒度） |
| `src/stores/products.js` | 新增 | Pinia：列表、筛选、分页、选中、actions |
| `src/api/productsApi.js` | 新增 | localStorage CRUD + 延迟 Promise |
| `src/constants/products.js` | 新增 | 分类/状态枚举、初始 mock、每页条数 |
| `src/stores/counter.js` | 删除或保留 | 脚手架示例，Prompt 可声明删除 |

**预估白名单（约 12 个文件）**：上表除 `counter.js` 可选删除外均为核心。

---

## 数据边界

### 商品实体

```ts
{
  id: number          // 唯一，新增时 Date.now() 或 max(id)+1
  name: string        // 2–20 字符
  price: number       // > 0，最多两位小数
  stock: number       // >= 0 整数
  category: '手机' | '电脑' | '配件'
  status: '上架' | '下架'
}
```

### 筛选条件（前端过滤或 API 层过滤均可）

```ts
{
  keyword: string     // 名称模糊，trim 后匹配
  status: '' | '上架' | '下架'   // 空 = 全部
  category: '' | '手机' | '电脑' | '配件'
}
```

### 分页

- `pageSize = 5`（固定）
- `currentPage` 从 1 开始；筛选/搜索/删除导致总页数减少时，若当前页超出范围则回退到最后一页。

### localStorage

- 读写整表数组；每次 mutation 后 `setItem`。
- 无数据时写入 REQUIREMENTS 中的 5 条初始数据。

### 业务规则汇总

| 场景 | 规则 |
|------|------|
| 单条下架 | `stock > 0` → 警告，不改状态 |
| 批量下架 | 选中集中任一 `stock > 0` → 整批失败，不改任何选中项状态 |
| 批量上架 | 无库存校验，全部改为上架 |
| 单条上架 | 直接上架 |
| 编辑保存为下架 | `stock > 0` → 表单级错误，不提交 |
| 删除 | 确认后从数组移除并持久化 |

---

## 建议 Prompt 拆步

| 步 | 内容 | 验收 |
|----|------|------|
| 1 | 常量 + `productsApi`（mock + localStorage + 初始数据）+ Pinia store 骨架 | 刷新后数据仍在；devtools 可见 store |
| 2 | 路由 + `ProductManageView` 布局 + `ProductTable` 静态渲染 | 访问路由可见 5 条 mock |
| 3 | `ProductFilters` + 搜索逻辑 + `ProductPagination` | 组合筛选正确；每页 5 条；翻页正确 |
| 4 | `ProductFormModal` 新增/编辑 + 表单校验 | 新增置顶；编辑回填；非法输入有字段级错误 |
| 5 | 单条/批量上下架 + 库存校验 + 删除确认 | 有库存下架被拦截；批量失败提示；删除后列表更新 |
| 6 | 全选联动 + 状态/分类标签样式 + `App.vue`/`main.css` 布局收尾 | 翻页全选重置；标签颜色符合要求 |

也可合并为 **2 步 Prompt**：`(1) 数据层 + 列表页壳` `(2) 交互与业规`，适合 40 分钟考核节奏。

---

## 验收清单

- [ ] 首次进入展示 ≥5 条商品，含 REQUIREMENTS 初始数据字段
- [ ] 刷新页面数据不丢失
- [ ] 名称模糊 + 状态 + 分类组合筛选，搜索后回到第 1 页
- [ ] 分页每页 5 条，上一页/下一页/页码可用
- [ ] 新增商品校验通过后出现于列表顶部
- [ ] 编辑回填正确，保存后列表更新
- [ ] 库存 > 0 时单条下架弹出指定文案警告
- [ ] 批量下架：选中含 stock > 0 时整批失败并有商品名提示
- [ ] 批量上架成功，选中清空
- [ ] 删除需确认，确认后行消失且持久化
- [ ] 全选仅当前页；换页后全选取消
- [ ] 上架绿标签、下架红标签、分类圆角标签可见

---

## 与现有代码衔接

| 现状 | 衔接方式 |
|------|----------|
| `src/router/index.js` 仅 `/`、`/about` | 新增 `/products`（或替换 `/`），About 可保留或移除 |
| `App.vue` 含 logo + Home/About 导航 | 改为简洁后台壳，避免与商品页布局冲突 |
| `main.css` 中 `#app` 双栏 grid | 改为单栏、`max-width` 放宽（如 1200px） |
| Pinia 已挂载，仅有 `counter.js` | 新增 `products` store，counter 可删 |
| 无 `api/` 目录 | 新建 `src/api/productsApi.js` 作为唯一数据入口 |
| 无 UI 库依赖 | Prompt 应明确「原生实现，不新增 npm 依赖」或指定引入 Element Plus |

### 范围风险

1. **App 布局改造** 若不在白名单会导致商品页样式挤压——须纳入 `App.vue` + `main.css`。
2. **编辑表单下架校验** 文档分散在 3.3/3.5，易漏实现——Prompt 须写死。
3. **批量下架「整批失败」** 与「部分成功」不同，需明确不可部分更新。
4. **选中状态与分页**：换页须清空 `selectedIds`，否则易误操作其他页商品。

### 与 STATUS 约束对齐

- 新增路由/页面按 Prompt 白名单执行。
- 样式复用 `base.css` 语义变量（`--color-border`、`--color-text` 等），状态绿/红可用 CSS 变量或 scoped 类，避免散落硬编码 hex。
