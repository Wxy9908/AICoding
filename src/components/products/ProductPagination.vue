<script setup>
defineOptions({ name: 'ProductPagination' })

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['change-page'])

const handlePrev = () => {
  if (props.currentPage <= 1 || props.loading) return
  emit('change-page', props.currentPage - 1)
}

const handleNext = () => {
  if (props.currentPage >= props.totalPages || props.loading) return
  emit('change-page', props.currentPage + 1)
}

const handleJump = (event) => {
  const page = Number(event.target.value)
  if (Number.isNaN(page) || page < 1 || page > props.totalPages || props.loading) return
  emit('change-page', page)
}
</script>

<template>
  <div class="pagination">
    <button
      type="button"
      class="page-btn"
      :disabled="currentPage <= 1 || loading"
      @click="handlePrev"
    >
      上一页
    </button>

    <span class="page-info">
      第 {{ currentPage }} / {{ totalPages }} 页
    </span>

    <label class="page-jump">
      跳转
      <select
        class="page-select"
        :value="currentPage"
        :disabled="loading"
        @change="handleJump"
      >
        <option v-for="page in totalPages" :key="page" :value="page">
          {{ page }}
        </option>
      </select>
    </label>

    <button
      type="button"
      class="page-btn"
      :disabled="currentPage >= totalPages || loading"
      @click="handleNext"
    >
      下一页
    </button>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem 0;
}

.page-btn {
  padding: 0.4rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-text);
  cursor: pointer;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.9rem;
  color: var(--color-text);
}

.page-jump {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
}

.page-select {
  padding: 0.35rem 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-text);
}
</style>
