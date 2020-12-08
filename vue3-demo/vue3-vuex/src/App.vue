<template>
  <div>
    <h3>counter</h3>
    <h2>{{ count }}</h2>
    <button type="button" @click="inFun">+1</button>
    <button type="button" @click="deFun">-1</button>
  </div>
</template>

<script>
//推荐使用这种，在哪里都可以获取store对象
import store from '@/store'
// 须在setup中调用才能获取store对象
// import { useStore } from "vuex";
// let store1 = useStore()
// console.log(store1)  // undefind  须在setup中调用useStore()才能获取store对象
import { INCREMENT, DECREMENT } from "@/store/mutations-type";
import { computed, reactive } from 'vue';
export default {
  name: "App",
  setup() {
    // const store = useStore();
    console.log(" ~ store", store);
    const inFun = () => {
      store.commit(INCREMENT);
    };
    const deFun = () => {
      store.commit(DECREMENT);
    }; 
    //第一种
    // return {
    //   count: computed(()=>store.state.count),  //变成响应式
    //   inFun,
    //   deFun,
    // };
    //第二种
      return reactive({
      count:computed(()=>store.state.count),  //变成响应式
      inFun,
      deFun,
    });
  },
};
</script>

<style>
</style>
