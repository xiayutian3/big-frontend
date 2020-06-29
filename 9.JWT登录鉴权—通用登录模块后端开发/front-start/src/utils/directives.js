import { escapeHtml } from '@/utils/escapeHtml'
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
  }
}
