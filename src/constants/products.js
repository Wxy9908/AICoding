/** 商品管理常量：枚举、初始数据、分页与持久化 key */

export const STORAGE_KEY = 'product-admin-data'

export const PAGE_SIZE = 5

export const CATEGORIES = ['手机', '电脑', '配件']

export const STATUSES = ['上架', '下架']

export const INITIAL_PRODUCTS = [
  { id: 1, name: 'iPhone 15', price: 5999, stock: 10, category: '手机', status: '上架' },
  { id: 2, name: '华为 Mate60', price: 6499, stock: 0, category: '手机', status: '下架' },
  { id: 3, name: 'MacBook Air', price: 8999, stock: 3, category: '电脑', status: '上架' },
  { id: 4, name: '无线蓝牙耳机', price: 399, stock: 120, category: '配件', status: '上架' },
  { id: 5, name: '机械键盘', price: 499, stock: 2, category: '配件', status: '下架' },
]

/** 分类对应的展示 emoji（表格图片列模拟） */
export const CATEGORY_EMOJI = {
  手机: '📱',
  电脑: '💻',
  配件: '🎧',
}
