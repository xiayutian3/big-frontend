<template>
  <div>
    {{title}}
    <hr>
    {{x}}---{{y}}
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue'
// import { defineComponent, reactive, ref, watchEffect } from 'vue'

const utils = () => {
  const stateAll = reactive({
    x: 0,
    y: 0
  })
  return toRefs(stateAll)
}
export default defineComponent({
  setup () {
    // let title = 'hello vue3'
    const title = ref('hello vue3')
    // console.log(' title', title)

    // ref reactive 的使用,都可以定义响应式
    const isShow = ref(false)

    const state = reactive({
      isShow: false
    })
    // 修改值
    // isShow.value = true
    // state.isShow = true

    // watchEffect(() => {
    //   console.log(' state', state.isShow)
    //   console.log('isShow', isShow.value)
    // })

    const { x, y } = utils()

    setTimeout(() => {
      title.value = 'vue3'
      // console.log(title)

      // isShow.value = true
      // state.isShow = true

      x.value = 1
      y.value = 4
      console.log(x, y)
    }, 1000)

    return {
      title,
      isShow,
      state,
      x,
      y
    }
  }
})
</script>

<style scoped>

</style>
