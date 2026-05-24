import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const INITIAL_TODOS = [
  { id: 1, title: '学习 Vue 3 基础', done: true },
  { id: 2, title: '完成 Todo 列表页面', done: false },
  { id: 3, title: '准备 AI Coding 面试', done: false },
]

export const useTodosStore = defineStore('todos', () => {
  const todos = ref([...INITIAL_TODOS])
  const filter = ref('all')

  const filteredTodos = computed(() => {
    if (filter.value === 'done') {
      return todos.value.filter((todo) => todo.done)
    }
    if (filter.value === 'active') {
      return todos.value.filter((todo) => !todo.done)
    }
    return todos.value
  })

  const getNextId = () => {
    if (todos.value.length === 0) {
      return 1
    }
    return Math.max(...todos.value.map((todo) => todo.id)) + 1
  }

  const addTodo = (title) => {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      return
    }

    todos.value.unshift({
      id: getNextId(),
      title: trimmedTitle,
      done: false,
    })
  }

  const removeTodo = (id) => {
    todos.value = todos.value.filter((todo) => todo.id !== id)
  }

  const completeTodo = (id) => {
    const todo = todos.value.find((item) => item.id === id)
    if (!todo || todo.done) {
      return
    }
    todo.done = true
  }

  const setFilter = (value) => {
    filter.value = value
  }

  return {
    todos,
    filter,
    filteredTodos,
    addTodo,
    removeTodo,
    completeTodo,
    setFilter,
  }
})
