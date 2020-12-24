<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form :loading="loading" @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">欢迎来社区</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
import { getroutes } from '@/api/admin'
import communityRoutes from '@/router/community'
import _import from '@/libs/_import'
import { resetRouter } from '@/router'
import { getRoutesName, filterRoutes, localSave } from '@/libs/util'
import routes from '@/router/routers'
export default {
  components: {
    LoginForm
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit (options) {
      this.loading = true
      this.handleLogin(options).then(res => {
        this.loading = false
        if (res.code === 200) {
          const roles = res.data.roles
          if (roles.includes('super_admin')) {
            // 说明是超级管理员

            // 重置路由
            // resetRouter()
            const newRoutes = communityRoutes
            console.log('newRoutes', newRoutes)
            // 添加新的路由规则
            this.$router.addRoutes(newRoutes)

            // 设置store中的routes规则
            this.$store.commit('setRouters', newRoutes.concat(routes))
            this.$router.push({
              name: this.$config.homeName
            })
            // console.log('所有的路由', this.$router)
            return
          }
          // 用户登录成功，获取菜单数据
          getroutes().then(res => {
            // 动态设置路由
            // addRoutes api
            if (res.code === 200) {
              const routesData = res.data
              console.log(' routesData', routesData)
              // 储存路由数据
              localSave('routes', res.data)

              const routesName = getRoutesName(routesData)
              // 从所有的路由中过滤出 这个用户所拥有的路由 filterRoutes
              // const newRoutes = communityRoutes.filter(item => routesName.includes(item.name))
              let newRoutes = filterRoutes(communityRoutes, routesName)
              // 添加 () => import(...)
              newRoutes = newRoutes.map(item => {
                if (typeof item.component === 'string') {
                  item.component = _import(item.component)
                }
                if (item.children && item.children.length > 0) {
                  item.children.map(i => {
                    if (typeof i.component === 'string') {
                      i.component = _import(i.component)
                    }
                  })
                }
              })
              // 动态路由设置部分*****************
              // 重置路由
              resetRouter()
              // 添加新的路由规则
              this.$router.addRoutes(newRoutes)

              // 设置store中的routes规则
              this.$store.commit('setRouters', newRoutes.concat(routes))
              this.$router.push({
                name: this.$config.homeName
              })
              //* ************ */ 动态路由设置部分****
            }
          })
        } else {
          this.$Message.error(res.msg)
        }
      })
    }
  }
}
</script>

<style>

</style>
