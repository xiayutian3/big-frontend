import { computed, reactive, ref } from 'vue'
// import { computed, ref, watch, watchEffect,reactive } from 'vue'
// 可以解决作用域的问题
export const utils = () => {
  const counter = ref(0)
  let num = 2
  // const total = ref(0)
  const lists = ref([
    {
      id: 1,
      text: 'zhang san'
    },
    {
      id: 2,
      text: 'li si'
    }
  ])

  // reactive具有递归嵌套，深响应
  const state = reactive({
    lists: [
      {
        id: 1,
        text: 'zhang san'
      },
      {
        id: 2,
        text: 'li si'
      }
    ]
  })

  const add = () => {
    counter.value++
    // total.value = num * counter.value
  }
  const minusEventHandler = () => {
    counter.value--
  }

  const modify = () => {
    num = 3
    console.log(' ~ num', num)
  }

  const setFun = () => {
    state.lists[0].text = 'changed'

    lists.value[0].text = 'hello'
  }

  // // 监听器(数组可以监听多个)
  // watch([counter, total], (newval, oldval) => {
  //   console.log('oldval', oldval)
  //   console.log('newval', newval)
  // })
  // watchEffect(() => {
  //   const total = counter.value * 2
  //   console.log('total', total)
  // }, {
  //   flush: 'pre',
  //   onTrack: (e) => {
  //     console.log(e)
  //   }
  // })

  // 计算属性
  return {
    total: computed(() => counter.value * num),
    modify,
    counter,
    add,
    minusEventHandler,
    state,
    lists,
    setFun
  }
}
