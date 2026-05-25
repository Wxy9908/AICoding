<script setup>
defineOptions({ name: 'ConfirmDialog' })

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: '确认',
  },
  message: {
    type: String,
    default: '',
  },
  confirmText: {
    type: String,
    default: '确定',
  },
  cancelText: {
    type: String,
    default: '取消',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['confirm', 'cancel'])

const handleCancel = () => {
  emit('cancel')
}

const handleConfirm = () => {
  emit('confirm')
}

const handleBackdropClick = (event) => {
  if (event.target === event.currentTarget) {
    handleCancel()
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="dialog-backdrop" @click="handleBackdropClick">
      <div class="dialog" role="alertdialog" aria-modal="true" :aria-label="title">
        <header class="dialog-header">
          <h2>{{ title }}</h2>
        </header>
        <p class="dialog-message">{{ message }}</p>
        <footer class="dialog-footer">
          <button type="button" class="btn btn-secondary" :disabled="loading" @click="handleCancel">
            {{ cancelText }}
          </button>
          <button type="button" class="btn btn-danger" :disabled="loading" @click="handleConfirm">
            {{ loading ? '处理中...' : confirmText }}
          </button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.dialog-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  padding: 1rem;
}

.dialog {
  width: 100%;
  max-width: 400px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 1.25rem;
}

.dialog-header h2 {
  font-size: 1.05rem;
  color: var(--color-heading);
  margin-bottom: 0.75rem;
}

.dialog-message {
  font-size: 0.95rem;
  color: var(--color-text);
  margin-bottom: 1.25rem;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
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

.btn-secondary {
  background: var(--color-background-soft);
  border-color: var(--color-border);
  color: var(--color-text);
}

.btn-danger {
  background: hsla(0, 70%, 45%, 1);
  color: var(--color-background);
}
</style>
