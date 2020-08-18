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
      let roles = store.state.userInfo.roles || ['user']
      if (!roles.includes(binding.value)) {
        el.parentNode.removeChild(el)
      }
    }
  }
}
