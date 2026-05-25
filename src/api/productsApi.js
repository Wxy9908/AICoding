import { STORAGE_KEY, INITIAL_PRODUCTS } from '@/constants/products'

const MOCK_DELAY = 300

const delay = (ms = MOCK_DELAY) => new Promise((resolve) => setTimeout(resolve, ms))

/** Mock API：localStorage 持久化 + 延迟 Promise */
export const productsApi = {
  async getAll() {
    await delay()
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS))
    return [...INITIAL_PRODUCTS]
  },

  async saveAll(products) {
    await delay()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
    return products
  },

  async create(product) {
    const list = await this.getAll()
    const maxId = list.reduce((max, item) => Math.max(max, item.id), 0)
    const newProduct = {
      ...product,
      id: Date.now() > maxId ? Date.now() : maxId + 1,
    }
    const updated = [newProduct, ...list]
    await this.saveAll(updated)
    return newProduct
  },

  async update(id, data) {
    const list = await this.getAll()
    const index = list.findIndex((item) => item.id === id)
    if (index === -1) {
      throw new Error('商品不存在')
    }
    list[index] = { ...list[index], ...data }
    await this.saveAll(list)
    return list[index]
  },

  async remove(id) {
    const list = await this.getAll()
    const updated = list.filter((item) => item.id !== id)
    await this.saveAll(updated)
    return updated
  },
}
