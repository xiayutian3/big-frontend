<template>
<div>
  <!-- <div v-if="error">
    {{error}}
  </div> -->
  <!-- 异步组件 -->
  <!-- <Suspense v-else>
    <template #default> <User/></template>
    <template #fallback>loading</template>
  </Suspense> -->


<SuspenseWithError>
  <template #error="{err}">{{err}}</template> 
  <template #default><User/></template> 
  <template #fallback>loading</template> 
</SuspenseWithError>

</div>
</template>

<script lang="ts">
import { defineComponent} from 'vue';
// import { defineComponent, onErrorCaptured, ref } from 'vue';
import User from '@/components/User.vue'
import SuspenseWithError from '@/components/SuspenseWithError.vue'

export default defineComponent({
  name: 'App',
  components:{
    User,
    SuspenseWithError
  },
  // setup(){
  //   const error = ref('')

  // //捕获异常
  // onErrorCaptured((err)=>{
  //   console.log('setup',err)
  //   error.value = err as string
  //   return true
  // })
  //   return {
  //     error
  //   }
  // }
});
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
