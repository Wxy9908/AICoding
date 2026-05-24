<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useTodosStore } from '../stores/todos'

defineOptions({
  name: 'TodoList',
})

const todosStore = useTodosStore()
const { filteredTodos, filter } = storeToRefs(todosStore)
const { addTodo, removeTodo, completeTodo, setFilter } = todosStore

const newTitle = ref('')

const filterOptions = [
  { value: 'all', label: '全部', segmentClass: 'all' },
  { value: 'done', label: '已完成', segmentClass: 'done' },
  { value: 'active', label: '未完成', segmentClass: 'pending' },
]

const handleAdd = () => {
  const title = newTitle.value.trim()
  if (!title) {
    return
  }

  addTodo(title)
  newTitle.value = ''
}

const handleComplete = (id) => {
  completeTodo(id)
}

const handleDelete = (id) => {
  removeTodo(id)
}
</script>

<template>
  <div class="todo-panel">
    <div class="todo-filter-bar">
      <div class="filter-segment" role="tablist" aria-label="待办筛选">
        <button
          v-for="option in filterOptions"
          :key="option.value"
          type="button"
          role="tab"
          class="filter-segment__btn"
          :class="[
            `filter-segment__btn--${option.segmentClass}`,
            { 'filter-segment__btn--selected': filter === option.value },
          ]"
          :aria-selected="filter === option.value"
          @click="setFilter(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <form class="todo-form" @submit.prevent="handleAdd">
      <input
        v-model="newTitle"
        type="text"
        class="input"
        placeholder="输入待办标题"
        aria-label="待办标题"
      />
      <button type="submit" class="btn btn--primary">添加</button>
    </form>

    <ul class="todo-list">
      <li v-for="todo in filteredTodos" :key="todo.id" class="todo-item">
        <span class="todo-title">{{ todo.title }}</span>
        <span
          class="status-tag todo-status"
          :class="todo.done ? 'status-tag--success' : 'status-tag--warning'"
        >
          {{ todo.done ? '已完成' : '未完成' }}
        </span>
        <div class="todo-actions">
          <button
            v-if="!todo.done"
            type="button"
            class="btn btn--toggle"
            @click="handleComplete(todo.id)"
          >
            完成
          </button>
          <button type="button" class="btn btn--danger" @click="handleDelete(todo.id)">删除</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.todo-panel {
  margin-top: 1rem;
}

.todo-filter-bar {
  display: flex;
  justify-content: flex-end;
  margin-top: -2.75rem;
  margin-bottom: 1.25rem;
}

.filter-segment {
  display: inline-flex;
  padding: 0.25rem;
  background-color: var(--color-background-mute);
  border-radius: 999px;
  gap: 0.125rem;
}

.filter-segment__btn {
  border: none;
  background: transparent;
  min-width: 4.5rem;
  height: 2rem;
  padding: 0 1rem;
  border-radius: 999px;
  font-size: var(--btn-font-size);
  line-height: 1.2;
  color: var(--color-text);
  cursor: pointer;
  white-space: nowrap;
  transition:
    background-color 0.2s,
    color 0.2s,
    box-shadow 0.2s;
}

.filter-segment__btn--selected.filter-segment__btn--all {
  background-color: var(--color-primary);
  color: var(--color-primary-text);
  box-shadow: 0 1px 3px color-mix(in srgb, var(--color-primary) 25%, transparent);
}

.filter-segment__btn--selected.filter-segment__btn--done {
  background-color: var(--color-success-bg);
  color: var(--color-success);
  box-shadow: 0 1px 3px color-mix(in srgb, var(--color-success) 20%, transparent);
}

.filter-segment__btn--selected.filter-segment__btn--pending {
  background-color: var(--color-warning-bg);
  color: var(--color-warning);
  box-shadow: 0 1px 3px color-mix(in srgb, var(--color-warning) 20%, transparent);
}

.todo-form {
  display: flex;
  gap: 0.625rem;
  margin-bottom: 1rem;
}

.todo-form .input {
  flex: 1;
}

.todo-list {
  --todo-title-col: 12rem;
  --todo-status-col: 4.75rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.todo-item {
  display: grid;
  grid-template-columns: var(--todo-title-col) var(--todo-status-col) 1fr auto;
  align-items: center;
  column-gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border);
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-title {
  color: var(--color-text);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.todo-status {
  justify-self: start;
  white-space: nowrap;
}

.todo-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn--toggle {
  background-color: var(--color-success-bg);
  color: var(--color-success);
  border-color: color-mix(in srgb, var(--color-success) 35%, transparent);
}

.btn--toggle:hover {
  background-color: color-mix(in srgb, var(--color-success-bg) 70%, var(--color-success) 30%);
}
</style>
