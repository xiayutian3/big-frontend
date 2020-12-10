import { TodoItemState } from '@/common/const'
import store from '@/store'

export const utils = () => {
  const clear = (type: TodoItemState) => {
    store.commit('clear', type)
  }
  return {
    clear,
    TodoItemState
  }
}
