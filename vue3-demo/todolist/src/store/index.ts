import { createStore, createLogger } from 'vuex'
import { TodoItem } from '../common/interface'
import { TodoItemState } from '@/common/const'
// 产生唯一值
import { v4 as uuidv4 } from 'uuid'

// 环境变量
const debug = process.env.NODE_ENV !== 'production'

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
    todos: [] as TodoItem [] // 对todos数组进行约束
  },
  mutations: {
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
  plugins: debug ? [createLogger()] : [] // 调制vuex的日志信息
})
