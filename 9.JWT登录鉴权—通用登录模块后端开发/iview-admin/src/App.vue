<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
// import communityRoutes from '@/router/community'
// // import _import from '@/libs/_import'
// import { resetRouter } from '@/router'
// // // import { getRoutesName, filterRoutes, localRead } from '@/libs/util'
// import routes from '@/router/routers'

export default {
  name: 'App',
  created () {
    // 用户刷新（路由的持久化）
    // const roles = this.$store.state.user?.access || []
    // if (roles.includes('super_admin')) {
    // // 说明是超级管理用户
    //   resetRouter()
    //   // const newRoutes = communityRoutes
    //   // this.$router.addRoutes(newRoutes)
    //   // // 设置store中的outer规则
    //   this.$store.commit('setRouters', communityRoutes.concat(routes))
    // }

    // // 用户登录成功之后，获取菜单数据
    // const routesData = localRead('routes')
    // const routesName = getRoutesName(routesData)
    // const newRoutes = filterRoutes(communityRoutes, routesName)
    // // const newRoutes = communityRoutes.filter((item) => routesName.includes(item.name))
    // // 动态设置路由
    // // addRoutes
    // newRoutes.map((item) => {
    //   if (typeof item.component === 'string') {
    //     item.component = _import(item.component)
    //   }
    //   if (item.children && item.children.length > 0) {
    //     item.children.map((i) => {
    //       if (typeof i.component === 'string') {
    //         i.component = _import(i.component)
    //       }
    //     })
    //   }
    // })
    // resetRouter()
    // this.$router.addRoutes(newRoutes)
    // // 设置store中的router规则
    // this.$store.commit('setRouters', newRoutes.concat(routes))
  }

}
</script>

<style lang="less">
.size{
  width: 100%;
  height: 100%;
}
html,body{
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}
</style>
