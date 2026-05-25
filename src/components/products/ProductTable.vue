<script setup>
import { CATEGORY_EMOJI } from '@/constants/products'

defineOptions({ name: 'ProductTable' })

const props = defineProps({
  products: {
    type: Array,
    required: true,
  },
  selectedIds: {
    type: Array,
    required: true,
  },
  isAllSelected: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['toggle-select', 'toggle-select-all', 'edit', 'toggle-status', 'delete'])

const formatPrice = (price) => price.toFixed(2)

const getCategoryEmoji = (category) => CATEGORY_EMOJI[category] || '📦'

const handleToggleSelectAll = () => {
  emit('toggle-select-all')
}

const handleToggleSelect = (id) => {
  emit('toggle-select', id)
}

const handleEdit = (product) => {
  emit('edit', product)
}

const handleToggleStatus = (product) => {
  emit('toggle-status', product)
}

const handleDelete = (product) => {
  emit('delete', product)
}
</script>

<template>
  <div class="table-wrapper">
    <table class="product-table">
      <thead>
        <tr>
          <th class="col-check">
            <input
              type="checkbox"
              :checked="isAllSelected"
              :disabled="loading || products.length === 0"
              aria-label="全选当前页"
              @change="handleToggleSelectAll"
            />
          </th>
          <th>图片</th>
          <th>名称</th>
          <th>分类</th>
          <th>价格</th>
          <th>库存</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td colspan="8" class="empty-cell">加载中...</td>
        </tr>
        <tr v-else-if="products.length === 0">
          <td colspan="8" class="empty-cell">暂无数据</td>
        </tr>
        <tr v-for="product in products" v-else :key="product.id">
          <td class="col-check">
            <input
              type="checkbox"
              :checked="selectedIds.includes(product.id)"
              :aria-label="`选择 ${product.name}`"
              @change="handleToggleSelect(product.id)"
            />
          </td>
          <td>
            <span class="product-image" :aria-label="product.category">
              {{ getCategoryEmoji(product.category) }}
            </span>
          </td>
          <td>{{ product.name }}</td>
          <td>
            <span class="tag tag-category">{{ product.category }}</span>
          </td>
          <td>¥{{ formatPrice(product.price) }}</td>
          <td>{{ product.stock }}</td>
          <td>
            <span
              class="tag tag-status"
              :class="product.status === '上架' ? 'status-on' : 'status-off'"
            >
              {{ product.status }}
            </span>
          </td>
          <td class="actions">
            <button type="button" class="btn-link" @click="handleEdit(product)">编辑</button>
            <button type="button" class="btn-link" @click="handleToggleStatus(product)">
              {{ product.status === '上架' ? '下架' : '上架' }}
            </button>
            <button type="button" class="btn-link btn-danger" @click="handleDelete(product)">
              删除
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-wrapper {
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: 8px;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.product-table th,
.product-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.product-table th {
  background: var(--color-background-soft);
  font-weight: 600;
  color: var(--color-heading);
}

.product-table tbody tr:last-child td {
  border-bottom: none;
}

.col-check {
  width: 48px;
  text-align: center;
}

.empty-cell {
  text-align: center;
  color: var(--color-text);
  padding: 2rem;
}

.product-image {
  font-size: 1.5rem;
}

.tag {
  display: inline-block;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  font-size: 0.8rem;
}

.tag-category {
  background: var(--color-background-mute);
  color: var(--color-text);
}

.tag-status.status-on {
  background: hsla(160, 60%, 90%, 1);
  color: hsla(160, 100%, 25%, 1);
}

.tag-status.status-off {
  background: hsla(0, 60%, 92%, 1);
  color: hsla(0, 70%, 40%, 1);
}

@media (prefers-color-scheme: dark) {
  .tag-status.status-on {
    background: hsla(160, 40%, 20%, 1);
    color: hsla(160, 70%, 65%, 1);
  }

  .tag-status.status-off {
    background: hsla(0, 40%, 22%, 1);
    color: hsla(0, 70%, 65%, 1);
  }
}

.actions {
  white-space: nowrap;
}

.btn-link {
  background: none;
  border: none;
  padding: 0.2rem 0.4rem;
  color: var(--color-heading);
  cursor: pointer;
  font-size: 0.85rem;
}

.btn-link:hover {
  text-decoration: underline;
}

.btn-danger {
  color: hsla(0, 70%, 45%, 1);
}
</style>
