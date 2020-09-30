import { escapeHtml } from '@/utils/escapeHtml'
import store from '@/store'
// 转义文章详情评论内容(自定义组件)
export default {
  richtext: {
    bind: function (el, binding, vnode) {
      // console.log('el', el)
      // console.log('binding', binding)
      // console.log('vnode', vnode)
      el.innerHTML = escapeHtml(binding.value)
    },
    update: function (el, binding, vnode) {
      // console.log('el', el)
      // console.log('binding', binding)
      // console.log('vnode', vnode)
      el.innerHTML = escapeHtml(binding.value)
    }
  },
  // <!-- method1: vuex -> userInfo -> roles -> includes admin -->
  // <!-- method2: 组件级权限控制 richtext ,就是做一个自定义指令，v-hasRole，像v-richtext 一样 -->
  hasRole: {
    // 做用户权限判断，进行相应的内容显示
    inserted: function (el, binding, vnode) {
      const roles = store.state.userInfo.roles || ['user']
      if (!roles.includes(binding.value)) {
        el.parentNode.removeChild(el)
      }
    }
  },
  hasPermission: {
    // 按钮级别的操作权限
    inserted: function (el, binding, vnode) {
      // console.log('binding', binding.value) // ["get", "delete"]
      // console.log('vnode', vnode.context) // 路由meta上面["get", "add", "delete"]
      const types = vnode.context.$route.meta.types
      const values = binding.value
      let flag = true
      for (const v of values) {
        if (!types.includes(v)) {
          flag = false
        }
      }
      // 只有所有的操作都包含，才显示el，不然不显示
      if (!flag) {
        el.parentNode.removeChild(el)
      }
    }
  }
}
