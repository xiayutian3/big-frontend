import { ref } from 'vue'
// 可以解决作用域的问题
export const utils = () => {
  const counter = ref(0)
  const add = () => {
    counter.value++
  }
  const minusEventHandler = () => {
    counter.value--
  }
  return {
    counter,
    add,
    minusEventHandler
  }
}
