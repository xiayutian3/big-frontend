<template>
  <div class="container">
    <div>
      <Logo />
      <h1 class="title">
        nuxt-demo
      </h1>
      <div class="links">
        <a
          href="https://nuxtjs.org/"
          target="_blank"
          rel="noopener noreferrer"
          class="button--green"
        >
          Documentation
        </a>
        <a
          href="https://github.com/nuxt/nuxt.js"
          0
          target="_blank"
          rel="noopener noreferrer"
          class="button--grey"
        >
          GitHub
        </a>
      </div>
      <!-- userAgent: {{ userAgent }} -->
      <div>{{ posts }}</div>
    </div>
  </div>
</template>

<script>
// nuxt axios错误拦截函数
// import Errorhandle from '~/plugins/axios'
export default {
  // nuxt axios错误拦截函数
  // asyncData({ $axios, redirect }) {
  //   Errorhandle($axios, redirect)
  // },

  // 查看 nuxt内置的axios，vuex的store
  // asyncData({ $axios, store }) {
  //   // vuex的store
  //   console.log('Data -> store', store)
  //   // axios请求
  //   console.log('Data -> axios', $axios)
  // },

  // 查看上下文对象
  // asyncData(content) {
  //   console.log('Data -> content', content)
  // },

  // 数据预取
  // asyncData({ req }) {
  //   return {
  //     userAgent: req
  //       ? req.headers['user-agent']
  //       : typeof navigator !== 'undefined'
  //       ? navigator.userAgent
  //       : 'No user agent (generated)',
  //   }
  // },

  // 数据预取
  async asyncData({ $axios }) {
    // 第一种方法  $axios.get
    // const result = await $axios.get('http://localhost:8080/posts')
    // console.log('Data -> result', result)
    // return {
    //   posts: result.data,
    // }

    // 第二种方法  $axios.$get
    const result = await $axios.$get('http://localhost:8080/posts')
    return {
      posts: result,
    }
  },
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
