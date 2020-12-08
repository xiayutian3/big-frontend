<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" /> -->
    <router-view></router-view>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
// import router from "@/router";

export default {
  name: "Home",
  components: {
    // HelloWorld,
  },
  mounted() {
    // vue2 this.$router.push

    //vue3
    // const result = router.resolve({
    //   name:'not-found',
    //       params:{
    //         pathMatch:['not','found']   //两者的结果不一样
    //         // pathMatch:'not/found'             //两者的结果不一样
    //       }
    // }).href
    // console.log("result", result)

    //命名视图路由
    // router.push({
    //   name:'not-found',
    //   params:{
    //     // pathMatch:['not','found']
    //      pathMatch:'not/found'
    //   }
    // })

    //链接路由
    // router.push("/not/found/url");


    // vue3特性 -》 命名路由 -》即不会推送no-found -》也不会跳到首页 ，而是抛出错误异常
    // router.push({name:'homeee'})
  },
};
</script>
