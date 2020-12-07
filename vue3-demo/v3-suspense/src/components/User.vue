<template>
  <div>
    {{msgRef}}
  </div>
</template>

<script lang="ts">
import { defineComponent,ref } from 'vue'

export default defineComponent({

  // setup（）在组件创建的时候早就执行了，所以里边的异步方法的内容没法显示，需要使用suspense来展示
  async setup () {
    // eslint-disable-next-line no-unused-vars
    const promise:Promise<string> = new Promise((resolve,reject)=>{
      setTimeout(()=>{
        // resolve('success message!')

        reject('error')
      },2000)
    })
    const msg = await promise
    console.log('setup -> ',msg)

    // 转换成响应式
    const msgRef = ref('')
    msgRef.value = msg
    return {
      msgRef
    }
  }
})
</script>

<style scoped>

</style>