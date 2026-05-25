## 背景

**商品管理后台**的完整前端模块

## 需求

- 实现完整的前端功能，使用 Mock 接口模拟数据交互，并保证刷新后数据持久化（localStorage）

- 新增页面路由`/products`，商品管理页，页面设计：
  | 顶部 | 标题 +「新增商品」按钮（打开弹窗） |
  | 筛选栏 | 商品名称（模糊搜索）、状态下拉（全部/上架/下架）、分类下拉（全部/手机/电脑/配件）+ 搜索按钮 |
  | 批量操作栏 | 全选（当前页）、批量上架、批量下架、展示已选数量 |
  | 数据表格 | 商品图片（模拟）、名称、分类、价格、库存、状态、操作（编辑/上下架/删除） |
  | 底部分页 | 上一页/下一页/页码跳转，**每页固定 5 条** |
  - 管理页支持：**列表 + 分页**：每页 5 条；页码切换；数据变更后重算总页数。
  - **筛选**：名称模糊 + 状态 + 分类，可组合；点「搜索」生效并重置到第 1 页。
  - **新增/编辑弹窗**：共用组件；字段校验（名称 2–20、价格 >0 两位小数、库存非负整数、分类/状态枚举）；新增 id 自增/时间戳，插列表顶部。
  - **批量上下架**：当前页多选；批量下架任一有库存则**整批失败**并提示「XXX 商品库存不为 0，无法批量下架」；批量上架任一 `stock === 0` 则**整批失败**并提示「XXX 商品库存为 0，无法批量上架」；完成后清空选中。
  - 列表数据支持：**单条上下架**：动态显示上架/下架按钮；下架时 `stock > 0` 警告「库存为 X 的商品不能下架，请先调整库存」；上架时 `stock === 0` 警告「库存为 0 的商品不能上架，请先补充库存」。
  - **删除**：确认框后从列表移除（软删除 = 本地删除即可）。

- 新增pinia状态管理，商品列表、筛选条件、分页、选中项、loading（配合mock接口使用），等集中管理
- 新增mock api层,productsApi.js，需要localStorage CRUD + 延迟 Promise

- 持久化时机：每次增删改后 setItem 整表数组；首次无数据则写入初始 mock

## 数据边界

- 新增商品相关字段：{
  id: number // 唯一，新增时 Date.now() 或 max(id)+1
  name: string // 2–20 字符
  price: number // > 0，最多两位小数
  stock: number // >= 0 整数
  category: '手机' | '电脑' | '配件'
  status: '上架' | '下架'
  }

- 默认展示数据INITIAL_PRODUCTS：[
  { "id": 1, "name": "iPhone 15", "price": 5999, "stock": 10, "category": "手机", "status": "上架" },
  { "id": 2, "name": "华为 Mate60", "price": 6499, "stock": 0, "category": "手机", "status": "下架" },
  { "id": 3, "name": "MacBook Air", "price": 8999, "stock": 3, "category": "电脑", "status": "上架" },
  { "id": 4, "name": "无线蓝牙耳机", "price": 399, "stock": 120, "category": "配件", "status": "上架" },
  { "id": 5, "name": "机械键盘", "price": 499, "stock": 2, "category": "配件", "status": "下架" }
  ]

- 新增筛选字段：
  {
  keyword: string // 名称模糊，trim 后匹配
  status: '' | '上架' | '下架' // 空 = 全部
  category: '' | '手机' | '电脑' | '配件'
  }

- 列表数据新增分页信息：
  - `pageSize = 5`（固定）
  - `currentPage` 从 1 开始；筛选/搜索/删除导致总页数减少时，若当前页超出范围则回退到最后一页。

- 使用localStorage存储商品列表数据，key为`product-admin-data`

## 相关页面

- 新增：`src/views/ProductManageView.vue`
- 新增：`src/components/products/ProductFilters.vue`、`ProductTable.vue`、`ProductFormModal.vue`、`ProductPagination.vue`、`ConfirmDialog.vue`
- 新增：`src/stores/products.js`、`src/api/productsApi.js`、`src/constants/products.js`
- 修改：`src/router/index.js`，`src/App.vue`，`src/assets/main.css`
- 删除：`src/stores/counter.js`

## 边界与范围

### 必须做

- 样式优先复用 `src/assets/base.css` 语义变量（如 `--color-border`、`--color-text`），状态绿/红用 scoped 类，避免散落 hex
- 路由 `/products`；Mock + localStorage 持久化；Pinia 集中管理列表/筛选/分页/选中
- 列表、筛选、分页（5 条/页）、新增/编辑弹窗、单条/批量上下架、删除确认
- 库存 > 0 不可下架：单条操作、批量下架（整批失败）、**编辑保存为下架**
- 库存为 0 不可上架：单条操作、批量上架（整批失败）、**编辑保存为上架**
- 代码开发时加入必要注释
- 修改默认路由，/ 重定向到 /products
- 修改App.vue, 去掉 logo + Home/About 导航，改为简洁 RouterView 壳
- 修改main.css,#app 去双栏 grid，改为单栏后台布局（如 max-width: 1200px）

- 批量上架: 选中集中任一 `stock === 0` → 整批失败，不改任何选中项状态；提示第一个 `stock === 0` 的商品名「XXX 商品库存为 0，无法批量上架」
- 批量下架: 选中集中任一 `stock > 0` → 整批失败，不改任何选中项状态；提示第一个 `stock > 0` 的商品名「XXX 商品库存不为 0，无法批量下架」

### 不做

- 真实 API、登录鉴权、图片上传
- 新增 npm 依赖 / UI 库（原生 HTML + scoped CSS）

## 验收清单

- pnpm dev 可启动
- 控制台无报错信息
- 首次进入 ≥5 条初始 mock；刷新后数据仍在
- 名称模糊 + 状态 + 分类组合筛选；点搜索回到第 1 页
- 每页 5 条；翻页后全选清空
- 新增校验通过出现在列表顶部；编辑回填正确
- stock>0 单条下架：警告「库存为 X 的商品不能下架，请先调整库存」
- stock===0 单条上架：警告「库存为 0 的商品不能上架，请先补充库存」
- 编辑保存为下架且 stock>0：表单错误，不提交
- 编辑保存为上架且 stock===0：表单错误，不提交
- 批量下架含 stock>0：整批失败，提示「XXX 商品库存不为 0，无法批量下架」
- 批量上架含 stock===0：整批失败，提示「XXX 商品库存为 0，无法批量上架」
- 删除需确认；确认后移除并持久化
- 上架绿 / 下架红 / 分类圆角标签可见
- 批量上架成功，选中清空
- 全选仅作用于当前页；单选与全选 checkbox 联动正确
