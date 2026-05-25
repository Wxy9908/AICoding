<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductsStore } from '@/stores/products'
import ProductFilters from '@/components/products/ProductFilters.vue'
import ProductTable from '@/components/products/ProductTable.vue'
import ProductFormModal from '@/components/products/ProductFormModal.vue'
import ProductPagination from '@/components/products/ProductPagination.vue'
import ConfirmDialog from '@/components/products/ConfirmDialog.vue'

defineOptions({ name: 'ProductManageView' })

const store = useProductsStore()
const {
  filters,
  loading,
  paginatedProducts,
  selectedIds,
  selectedCount,
  isAllCurrentPageSelected,
  currentPage,
  totalPages,
} = storeToRefs(store)

const formVisible = ref(false)
const formMode = ref('create')
const editingProduct = ref(null)

const confirmVisible = ref(false)
const deletingProduct = ref(null)

onMounted(() => {
  store.loadProducts()
})

const handleFiltersUpdate = (nextFilters) => {
  filters.value = nextFilters
}

const handleSearch = () => {
  store.applySearch()
}

const handleOpenCreate = () => {
  formMode.value = 'create'
  editingProduct.value = null
  formVisible.value = true
}

const handleEdit = (product) => {
  formMode.value = 'edit'
  editingProduct.value = product
  formVisible.value = true
}

const handleCloseForm = () => {
  formVisible.value = false
  editingProduct.value = null
}

const handleFormSubmit = async (data) => {
  if (formMode.value === 'create') {
    await store.addProduct(data)
  } else if (editingProduct.value) {
    await store.updateProduct(editingProduct.value.id, data)
  }
  handleCloseForm()
}

const handleToggleStatus = (product) => {
  store.toggleProductStatus(product)
}

const handleDelete = (product) => {
  deletingProduct.value = product
  confirmVisible.value = true
}

const handleCancelDelete = () => {
  confirmVisible.value = false
  deletingProduct.value = null
}

const handleConfirmDelete = async () => {
  if (!deletingProduct.value) return
  await store.deleteProduct(deletingProduct.value.id)
  handleCancelDelete()
}

const handleBatchOnShelf = () => {
  store.batchOnShelf()
}

const handleBatchOffShelf = () => {
  store.batchOffShelf()
}
</script>

<template>
  <div class="product-manage">
    <header class="page-header">
      <h1>商品管理</h1>
      <button type="button" class="btn btn-primary" :disabled="loading" @click="handleOpenCreate">
        新增商品
      </button>
    </header>

    <ProductFilters
      :filters="filters"
      :loading="loading"
      @update:filters="handleFiltersUpdate"
      @search="handleSearch"
    />

    <div class="batch-bar">
      <label class="batch-select">
        <input
          type="checkbox"
          :checked="isAllCurrentPageSelected"
          :disabled="loading || paginatedProducts.length === 0"
          @change="store.toggleSelectAll"
        />
        全选（当前页）
      </label>
      <button
        type="button"
        class="btn btn-secondary"
        :disabled="loading || selectedCount === 0"
        @click="handleBatchOnShelf"
      >
        批量上架
      </button>
      <button
        type="button"
        class="btn btn-secondary"
        :disabled="loading || selectedCount === 0"
        @click="handleBatchOffShelf"
      >
        批量下架
      </button>
      <span class="selected-count">已选 {{ selectedCount }} 项</span>
    </div>

    <ProductTable
      :products="paginatedProducts"
      :selected-ids="selectedIds"
      :is-all-selected="isAllCurrentPageSelected"
      :loading="loading"
      @toggle-select="store.toggleSelect"
      @toggle-select-all="store.toggleSelectAll"
      @edit="handleEdit"
      @toggle-status="handleToggleStatus"
      @delete="handleDelete"
    />

    <ProductPagination
      :current-page="currentPage"
      :total-pages="totalPages"
      :loading="loading"
      @change-page="store.setPage"
    />

    <ProductFormModal
      :visible="formVisible"
      :mode="formMode"
      :product="editingProduct"
      :loading="loading"
      @close="handleCloseForm"
      @submit="handleFormSubmit"
    />

    <ConfirmDialog
      :visible="confirmVisible"
      title="删除确认"
      :message="deletingProduct ? `确定删除「${deletingProduct.name}」吗？` : ''"
      confirm-text="删除"
      :loading="loading"
      @confirm="handleConfirmDelete"
      @cancel="handleCancelDelete"
    />
  </div>
</template>

<style scoped>
.product-manage {
  width: 100%;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.page-header h1 {
  font-size: 1.5rem;
  color: var(--color-heading);
}

.batch-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin: 1rem 0;
  padding: 0.75rem 1rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
}

.batch-select {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  cursor: pointer;
}

.selected-count {
  margin-left: auto;
  font-size: 0.9rem;
  color: var(--color-text);
}

.btn {
  padding: 0.45rem 1rem;
  border-radius: 6px;
  border: 1px solid transparent;
  font-size: 0.9rem;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--color-heading);
  color: var(--color-background);
}

.btn-secondary {
  background: var(--color-background);
  border-color: var(--color-border);
  color: var(--color-text);
}
</style>
