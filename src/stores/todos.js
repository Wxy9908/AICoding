import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'app-todos'

const INITIAL_TODOS = [
  { id: 1, title: '学习 Vue 3 基础', done: true },
  { id: 2, title: '完成 Todo 列表页面', done: false },
  { id: 3, title: '准备 AI Coding 面试', done: false },
]

const isValidTodo = (item) => {
  return (
    item &&
    typeof item === 'object' &&
    typeof item.id === 'number' &&
    typeof item.title === 'string' &&
    typeof item.done === 'boolean'
  )
}

const isValidTodos = (items) => {
  return Array.isArray(items) && items.length > 0 && items.every(isValidTodo)
}

// 启动时从 localStorage 恢复；无数据或非法数据则回退 INITIAL_TODOS
const loadTodosFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return [...INITIAL_TODOS]
    }

    const parsed = JSON.parse(raw)
    if (!isValidTodos(parsed)) {
      console.warn('[todos] app-todos 数据格式无效，已回退初始数据')
      return [...INITIAL_TODOS]
    }

    return parsed
  } catch (error) {
    console.warn('[todos] app-todos 解析失败，已回退初始数据', error)
    return [...INITIAL_TODOS]
  }
}

const saveTodosToStorage = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export const useTodosStore = defineStore('todos', () => {
  const todos = ref(loadTodosFromStorage())
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

  const persistTodos = () => {
    saveTodosToStorage(todos.value)
  }

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
    persistTodos()
  }

  const removeTodo = (id) => {
    todos.value = todos.value.filter((todo) => todo.id !== id)
    persistTodos()
  }

  const completeTodo = (id) => {
    const todo = todos.value.find((item) => item.id === id)
    if (!todo || todo.done) {
      return
    }
    todo.done = true
    persistTodos()
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
