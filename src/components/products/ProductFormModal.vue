<script setup>
import { ref, watch, computed } from 'vue'
import { CATEGORIES, STATUSES } from '@/constants/products'

defineOptions({ name: 'ProductFormModal' })

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  mode: {
    type: String,
    required: true,
    validator: (value) => ['create', 'edit'].includes(value),
  },
  product: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'submit'])

const form = ref(createEmptyForm())
const errors = ref({})

const title = computed(() => (props.mode === 'create' ? '新增商品' : '编辑商品'))

function createEmptyForm() {
  return {
    name: '',
    price: '',
    stock: '',
    category: '手机',
    status: '上架',
  }
}

const resetForm = () => {
  if (props.mode === 'edit' && props.product) {
    form.value = {
      name: props.product.name,
      price: String(props.product.price),
      stock: String(props.product.stock),
      category: props.product.category,
      status: props.product.status,
    }
  } else {
    form.value = createEmptyForm()
  }
  errors.value = {}
}

watch(
  () => [props.visible, props.mode, props.product],
  ([visible]) => {
    if (visible) {
      resetForm()
    }
  },
)

const validatePrice = (value) => {
  const num = Number(value)
  if (Number.isNaN(num) || num <= 0) return '价格必须大于 0'
  if (!/^\d+(\.\d{1,2})?$/.test(String(value).trim())) return '价格最多两位小数'
  return ''
}

const validateStock = (value) => {
  const num = Number(value)
  if (!Number.isInteger(num) || num < 0) return '库存必须为非负整数'
  return ''
}

const validate = () => {
  const nextErrors = {}
  const name = form.value.name.trim()

  if (name.length < 2 || name.length > 20) {
    nextErrors.name = '名称长度为 2–20 个字符'
  }

  const priceError = validatePrice(form.value.price)
  if (priceError) nextErrors.price = priceError

  const stockError = validateStock(form.value.stock)
  if (stockError) nextErrors.stock = stockError

  if (!CATEGORIES.includes(form.value.category)) {
    nextErrors.category = '请选择有效分类'
  }

  if (!STATUSES.includes(form.value.status)) {
    nextErrors.status = '请选择有效状态'
  }

  // 保存时状态与库存冲突拦截
  const stockNum = Number(form.value.stock)
  if (form.value.status === '下架' && stockNum > 0) {
    nextErrors.status = `库存为 ${stockNum} 的商品不能下架，请先调整库存`
  }
  if (form.value.status === '上架' && stockNum === 0) {
    nextErrors.status = '库存为 0 的商品不能上架，请先补充库存'
  }

  errors.value = nextErrors
  return Object.keys(nextErrors).length === 0
}

const handleClose = () => {
  emit('close')
}

const handleSubmit = () => {
  if (!validate()) return

  emit('submit', {
    name: form.value.name.trim(),
    price: Number(form.value.price),
    stock: Number(form.value.stock),
    category: form.value.category,
    status: form.value.status,
  })
}

const handleBackdropClick = (event) => {
  if (event.target === event.currentTarget) {
    handleClose()
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-backdrop" @click="handleBackdropClick">
      <div class="modal" role="dialog" aria-modal="true" :aria-label="title">
        <header class="modal-header">
          <h2>{{ title }}</h2>
          <button type="button" class="btn-close" aria-label="关闭" @click="handleClose">×</button>
        </header>

        <form class="modal-body" @submit.prevent="handleSubmit">
          <label class="form-field">
            <span>商品名称</span>
            <input v-model="form.name" type="text" class="form-input" :disabled="loading" />
            <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
          </label>

          <label class="form-field">
            <span>价格</span>
            <input v-model="form.price" type="number" step="0.01" class="form-input" :disabled="loading" />
            <span v-if="errors.price" class="field-error">{{ errors.price }}</span>
          </label>

          <label class="form-field">
            <span>库存</span>
            <input v-model="form.stock" type="number" step="1" class="form-input" :disabled="loading" />
            <span v-if="errors.stock" class="field-error">{{ errors.stock }}</span>
          </label>

          <label class="form-field">
            <span>分类</span>
            <select v-model="form.category" class="form-input" :disabled="loading">
              <option v-for="item in CATEGORIES" :key="item" :value="item">{{ item }}</option>
            </select>
            <span v-if="errors.category" class="field-error">{{ errors.category }}</span>
          </label>

          <label class="form-field">
            <span>状态</span>
            <select v-model="form.status" class="form-input" :disabled="loading">
              <option v-for="item in STATUSES" :key="item" :value="item">{{ item }}</option>
            </select>
            <span v-if="errors.status" class="field-error">{{ errors.status }}</span>
          </label>

          <footer class="modal-footer">
            <button type="button" class="btn btn-secondary" :disabled="loading" @click="handleClose">
              取消
            </button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? '提交中...' : '确定' }}
            </button>
          </footer>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal {
  width: 100%;
  max-width: 440px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--color-border);
}

.modal-header h2 {
  font-size: 1.1rem;
  color: var(--color-heading);
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  color: var(--color-text);
}

.modal-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.9rem;
}

.form-input {
  padding: 0.5rem 0.65rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-text);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-border-hover);
}

.field-error {
  font-size: 0.8rem;
  color: hsla(0, 70%, 45%, 1);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 0.5rem;
}

.btn {
  padding: 0.45rem 1.1rem;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 0.9rem;
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
  background: var(--color-background-soft);
  border-color: var(--color-border);
  color: var(--color-text);
}
</style>
