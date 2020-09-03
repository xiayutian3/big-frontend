
// 获取元素到达页面顶部的距离
const getElementY = (elem) => {
  // 滚动条滚动的距离+ 元素距离页面可视区的距离
  return window.pageYOffset + document.querySelector(elem).getBoundingClientRect().top
}

/**
 * 滚动到指定的元素
 * @param {string} elem  DOM元素
 * @param {Number} duration 滚动动画执行的时间
 * @param {Number} offset 滚动的偏移量（正好是头部导航的高度）
 */
const scrollToElm = (elem, duration, offset) => {
  // 初始位置
  // 滚动条y轴的位置（正值）
  const startingY = window.pageYOffset
  // 获取元素到达页面顶部的距离（正值）
  const elementY = getElementY(elem)
  // 需要取滚动的距离
  const diff = elementY - startingY + offset
  // 如果 diff 为0
  if (!diff) return
  // 动画类型（  easeInOutCubic）
  const easing = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  let start
  window.requestAnimationFrame(function step (timestamp) {
    // timestamp 是系统产生的时间，它表示requestAnimationFrame() 开始去执行回调函数的时刻。
    if (!start) start = timestamp
    // 计算时间的差值，根据差值计算偏移量（时间差time会越变越大）
    const time = timestamp - start
    // 取两个间的最小值（拿到每次滚动的一个百分比，距离）
    let percent = Math.min(time / duration, 1)
    // 滚动动效
    percent = easing(percent)
    // 每次滚动的距离，第一个参数 0 是x轴，第二个参数是y轴（）
    window.scrollTo(0, startingY + diff * percent)
    // 随这滚动事件慢慢增大，当超过 过渡的时间 的时候，滚动停止
    if (time < duration) {
      window.requestAnimationFrame(step)
    }
  })
}

export {
  scrollToElm
}
