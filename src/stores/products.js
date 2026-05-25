import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { productsApi } from '@/api/productsApi'
import { PAGE_SIZE } from '@/constants/products'

export const useProductsStore = defineStore('products', () => {
  const products = ref([])
  const loading = ref(false)
  const filters = ref({ keyword: '', status: '', category: '' })
  const appliedFilters = ref({ keyword: '', status: '', category: '' })
  const currentPage = ref(1)
  const selectedIds = ref([])

  const filteredProducts = computed(() => {
    let list = products.value
    const { keyword, status, category } = appliedFilters.value
    const trimmed = keyword.trim()
    if (trimmed) {
      list = list.filter((item) => item.name.includes(trimmed))
    }
    if (status) {
      list = list.filter((item) => item.status === status)
    }
    if (category) {
      list = list.filter((item) => item.category === category)
    }
    return list
  })

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredProducts.value.length / PAGE_SIZE)),
  )

  const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * PAGE_SIZE
    return filteredProducts.value.slice(start, start + PAGE_SIZE)
  })

  const selectedCount = computed(() => selectedIds.value.length)

  const isAllCurrentPageSelected = computed(() => {
    const pageIds = paginatedProducts.value.map((item) => item.id)
    if (pageIds.length === 0) return false
    return pageIds.every((id) => selectedIds.value.includes(id))
  })

  // 总页数减少时回退到最后一页
  watch(totalPages, (total) => {
    if (currentPage.value > total) {
      currentPage.value = total
    }
  })

  const clearSelection = () => {
    selectedIds.value = []
  }

  const loadProducts = async () => {
    loading.value = true
    try {
      products.value = await productsApi.getAll()
    } finally {
      loading.value = false
    }
  }

  const applySearch = () => {
    appliedFilters.value = { ...filters.value }
    currentPage.value = 1
    clearSelection()
  }

  const setPage = (page) => {
    currentPage.value = page
    clearSelection()
  }

  const toggleSelect = (id) => {
    const index = selectedIds.value.indexOf(id)
    if (index === -1) {
      selectedIds.value.push(id)
      return
    }
    selectedIds.value.splice(index, 1)
  }

  const toggleSelectAll = () => {
    const pageIds = paginatedProducts.value.map((item) => item.id)
    if (isAllCurrentPageSelected.value) {
      selectedIds.value = selectedIds.value.filter((id) => !pageIds.includes(id))
      return
    }
    const merged = new Set([...selectedIds.value, ...pageIds])
    selectedIds.value = [...merged]
  }

  const addProduct = async (data) => {
    loading.value = true
    try {
      await productsApi.create(data)
      products.value = await productsApi.getAll()
      currentPage.value = 1
      clearSelection()
    } finally {
      loading.value = false
    }
  }

  const updateProduct = async (id, data) => {
    loading.value = true
    try {
      await productsApi.update(id, data)
      products.value = await productsApi.getAll()
    } finally {
      loading.value = false
    }
  }

  const deleteProduct = async (id) => {
    loading.value = true
    try {
      products.value = await productsApi.remove(id)
      if (currentPage.value > totalPages.value) {
        currentPage.value = totalPages.value
      }
      clearSelection()
    } finally {
      loading.value = false
    }
  }

  /** 单条切换上下架；stock 与状态冲突时拦截并提示 */
  const toggleProductStatus = async (product) => {
    if (product.status === '上架') {
      if (product.stock > 0) {
        window.alert(`库存为 ${product.stock} 的商品不能下架，请先调整库存`)
        return false
      }
      loading.value = true
      try {
        await productsApi.update(product.id, { status: '下架' })
        products.value = await productsApi.getAll()
      } finally {
        loading.value = false
      }
      return true
    }

    if (product.stock === 0) {
      window.alert('库存为 0 的商品不能上架，请先补充库存')
      return false
    }

    loading.value = true
    try {
      await productsApi.update(product.id, { status: '上架' })
      products.value = await productsApi.getAll()
    } finally {
      loading.value = false
    }
    return true
  }

  /** 批量上架：任一 stock === 0 整批失败 */
  const batchOnShelf = async () => {
    if (selectedIds.value.length === 0) return

    const selected = products.value.filter((item) => selectedIds.value.includes(item.id))
    const blocked = selected.find((item) => item.stock === 0)
    if (blocked) {
      window.alert(`${blocked.name} 商品库存为 0，无法批量上架`)
      return false
    }

    loading.value = true
    try {
      const list = await productsApi.getAll()
      const updated = list.map((item) =>
        selectedIds.value.includes(item.id) ? { ...item, status: '上架' } : item,
      )
      products.value = await productsApi.saveAll(updated)
      clearSelection()
    } finally {
      loading.value = false
    }
    return true
  }

  /** 批量下架：任一 stock > 0 整批失败 */
  const batchOffShelf = async () => {
    if (selectedIds.value.length === 0) return

    const selected = products.value.filter((item) => selectedIds.value.includes(item.id))
    const blocked = selected.find((item) => item.stock > 0)
    if (blocked) {
      window.alert(`${blocked.name} 商品库存不为 0，无法批量下架`)
      return false
    }

    loading.value = true
    try {
      const list = await productsApi.getAll()
      const updated = list.map((item) =>
        selectedIds.value.includes(item.id) ? { ...item, status: '下架' } : item,
      )
      products.value = await productsApi.saveAll(updated)
      clearSelection()
    } finally {
      loading.value = false
    }
    return true
  }

  return {
    products,
    loading,
    filters,
    appliedFilters,
    currentPage,
    selectedIds,
    pageSize: PAGE_SIZE,
    filteredProducts,
    totalPages,
    paginatedProducts,
    selectedCount,
    isAllCurrentPageSelected,
    loadProducts,
    applySearch,
    setPage,
    clearSelection,
    toggleSelect,
    toggleSelectAll,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    batchOnShelf,
    batchOffShelf,
  }
})
