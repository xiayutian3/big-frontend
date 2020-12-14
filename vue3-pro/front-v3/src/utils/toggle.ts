import { ref } from 'vue'

const toggleUtils = (initState: boolean, delay: number) => {
  const on = ref(initState ?? false) // 如果传进来有值，就用初始的值，没有就默认false
  const toggle = (value: boolean) => {
    setTimeout(() => {
      on.value = value ?? !on.value
    }, delay ?? 500)
  }
  return {
    on,
    toggle
  }
}
export default toggleUtils
