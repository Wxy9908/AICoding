<script setup>
defineOptions({ name: 'ProductFilters' })

const props = defineProps({
  filters: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['search', 'update:filters'])

const handleKeywordInput = (event) => {
  emit('update:filters', { ...props.filters, keyword: event.target.value })
}

const handleStatusChange = (event) => {
  emit('update:filters', { ...props.filters, status: event.target.value })
}

const handleCategoryChange = (event) => {
  emit('update:filters', { ...props.filters, category: event.target.value })
}

const handleSearch = () => {
  emit('search')
}
</script>

<template>
  <div class="product-filters">
    <label class="filter-item">
      <span class="filter-label">商品名称</span>
      <input
        type="text"
        class="filter-input"
        placeholder="模糊搜索"
        :value="filters.keyword"
        :disabled="loading"
        @input="handleKeywordInput"
        @keyup.enter="handleSearch"
      />
    </label>

    <label class="filter-item">
      <span class="filter-label">状态</span>
      <select
        class="filter-select"
        :value="filters.status"
        :disabled="loading"
        @change="handleStatusChange"
      >
        <option value="">全部</option>
        <option value="上架">上架</option>
        <option value="下架">下架</option>
      </select>
    </label>

    <label class="filter-item">
      <span class="filter-label">分类</span>
      <select
        class="filter-select"
        :value="filters.category"
        :disabled="loading"
        @change="handleCategoryChange"
      >
        <option value="">全部</option>
        <option value="手机">手机</option>
        <option value="电脑">电脑</option>
        <option value="配件">配件</option>
      </select>
    </label>

    <button type="button" class="btn btn-primary" :disabled="loading" @click="handleSearch">
      搜索
    </button>
  </div>
</template>

<style scoped>
.product-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 1rem;
  padding: 1rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.filter-label {
  font-size: 0.85rem;
  color: var(--color-text);
}

.filter-input,
.filter-select {
  min-width: 160px;
  padding: 0.45rem 0.65rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 0.9rem;
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: var(--color-border-hover);
}

.btn {
  padding: 0.45rem 1.25rem;
  border: 1px solid transparent;
  border-radius: 6px;
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
</style>
