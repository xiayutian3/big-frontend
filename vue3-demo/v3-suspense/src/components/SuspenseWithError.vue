<template>
  <div>
    <slot v-if="error" name="error" :err="error"></slot>
    <!-- 异步组件 -->
    <Suspense v-else>
      <template #default><slot name="default"></slot></template>
      <template #fallback><slot name="fallback"></slot></template>
    </Suspense>
  </div>
</template>

<script lang="ts">
import { defineComponent , onErrorCaptured, ref} from 'vue'

export default defineComponent({
  setup(){
    const error = ref('')

  //捕获异常
  onErrorCaptured((err)=>{
    error.value = err as string
    // false 为 已解决不需要在向上传递错误信息，true向上传递错误信息，控制就会有提示（warn）
    return false
  })
    return {
      error
    }
  }
})
</script>

<style scoped>

</style>