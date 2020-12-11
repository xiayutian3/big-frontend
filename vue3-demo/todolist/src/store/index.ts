import { createStore, createLogger, Store } from 'vuex'
import { TodoItem } from '../common/interface'
import { TodoItemState } from '@/common/const'
// 产生唯一值
import { v4 as uuidv4 } from 'uuid'
import { storage } from '@/common/utils'

// 环境变量
const debug = process.env.NODE_ENV !== 'production'

// savePlugin(store中的todos变化就保存到本地)

const savePlugin = (store: Store<{ todos: TodoItem[]; item: TodoItem }>) => { // savePlugin 开始的时候会执行一次
  // console.log('todos save')
  // 初始提交（方法一）
  // store.commit('init', storage.get())

  // 初始提交（方法2）
  store.state.todos = storage.get()

  store.subscribe((mutation, state) => {
    // console.log('mutation', mutation)
    // console.log('state', state)
    storage.set(state.todos)
  })
}

// // 枚举类型
// enum TodoItemState {
//   ALL, OPEN, DONE, DELETE
// }
// // 接口约束
// interface TodoItem{
//   id: string;
//   text: string;
//   state: TodoItemState;
// }

export default createStore({
  state: {
    todos: [] as TodoItem [], // 对todos数组进行约束
    item: {} as TodoItem // 编辑时候，对应数组的每一项
  },
  mutations: {
    init (state, todos) {
      state.todos = todos
    },
    add (state, value) {
      state.todos.push({
        id: uuidv4(),
        text: value,
        state: TodoItemState.OPEN
      })
    },
    // 选中/取消
    check (state, id) {
      const index = state.todos.findIndex(item => item.id === id)
      state.todos[index].state = state.todos[index].state === TodoItemState.DONE ? TodoItemState.OPEN : TodoItemState.DONE
    },
    remove (state, id) {
      const index = state.todos.findIndex(item => item.id === id)
      state.todos[index].state = TodoItemState.DELETE
    },
    clear (state, type: TodoItemState) {
      const arr = state.todos.filter(item => item.state !== type)
      state.todos = arr
    },
    saveEditItem (state, item: TodoItem) {
      state.item = item
    },
    update (state, newItem: TodoItem) {
      const index = state.todos.findIndex(item => item.id === newItem.id)
      state.todos[index] = newItem
    }

  },
  actions: {
  },
  getters: {
    dones: (state) => state.todos.filter(item => item.state === TodoItemState.DONE),
    deletes: (state) => state.todos.filter(item => item.state === TodoItemState.DELETE),
    opens: (state) => state.todos.filter(item => item.state === TodoItemState.OPEN)
  },
  modules: {
  },
  plugins: debug ? [createLogger(), savePlugin] : [savePlugin] // 调制vuex的日志信息
})
