// 禁止滚动，传递过来的元素（本身不能滑动的元素），包括它的子节点，滑动后（特别是微信浏览器），就不能传递到body上，从而阻止body的滑动
// （比如说上下滑动底部导航，头部导航，不应该滑动的元素，不能让它传递滑动事件到body上，禁止他的默认行为）
export const forbidScroll = (elem) => {
  let flag = false

  elem.addEventListener('touchstart', (evt) => {
    if (elem.contains(evt.target)) {
      flag = true
    } else {
      flag = false
    }
  })
  elem.addEventListener('touchmove', (evt) => {
    evt.prop = flag
  })
}

const handler = (evt) => {
  if (evt.prop) {
    evt.preventDefault()
  }
}

// 添加了passive:false   ，evt.preventDefault()才会生效
// 为了避免多次body上添加 touchmove，每次都做一次清除
document.body.removeEventListener('touchmove', handler, { passive: false })
document.body.addEventListener('touchmove', handler, { passive: false })
