<template>
<div>
  <teleport v-if="toggle" to="#end-of-body" :disabled="!toggle">hello teleport to end of body</teleport>
  <div>this is header</div>
  <button type="button" @click="handleClick">点击切换</button>
</div>
</template>

<script>
import {ref} from 'vue'
export default {
  name: 'App',
  setup(){
      const toggle = ref(false)
      const handleClick = ()=>{
        toggle.value = !toggle.value
      }
    return{
      toggle,
      handleClick
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
