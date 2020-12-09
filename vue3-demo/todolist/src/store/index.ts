import { createStore } from 'vuex'
import { TodoItem } from '../common/interface'
import { TodoItemState } from '@/common/const'
// 产生唯一值
import { v4 as uuidv4 } from 'uuid'

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
    }
  },
  actions: {
  },
  modules: {
  }
})
