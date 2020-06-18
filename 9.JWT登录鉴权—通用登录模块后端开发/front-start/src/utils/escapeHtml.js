// 表情链接
import faces from '@/assets/js/face'

const escapeHtml = (val = '') => {
  if (!val) return ''
  // 替换表情
  let result = val
  // 以空格face[一个或多个非字母数字]   /g全局匹配
  let face = /\sface\[\W{1,}\]/g
  if (face.test(result)) {
    // 匹配到的结果返回成一个数组  [" face[偷笑]", " face[左哼哼]"]
    let group = result.match(face)
    // 拿到表情的链接
    group.map(item => {
      const key = item.match(/\[\S+\]/g)[0]
      result = result.replace(item, `<img src="${faces[key]}">`)
    })
  }
  // 图片替换
  const img = /img\[\S+\]/g
  if (img.test(result)) {
    const group = result.match(img)
    group.map(item => {
      result = result.replace(item, `<img src="${item.substr(4, item.length - 5)}">`)
    })
  }
  // 链接替换  a(链接)[标题]
  let link = /\sa\(\S+\]/g
  if (link.test(result)) {
    const group = result.match(link)
    // (任意内容)
    const title = /\((.+)\)/
    const linkName = /\[(.+)\]/
    group.map(item => {
      // 这是用括号（）匹配出来的 ：所以选第二个  ['[http://baidu]','http://baidu']
      const nameGroup = item.match(linkName)
      // console.log('escapeHtml -> nameGroup', nameGroup)
      let name = ''
      if (nameGroup.length > 0) {
        name = nameGroup[1]
      }
      const linkGroup = item.match(title)
      // console.log('escapeHtml -> linkGroup', linkGroup)
      let url = ''
      if (linkGroup.length > 0) {
        url = linkGroup[1]
      }
      result = result.replace(item, `<a href="${url}">${name}</a>`)
    })
  }
  // 引用替换
  result = result.replace(/\[quote\]/g, '<div class="layui-elem-quote">')
  result = result.replace(/\[\/quote\]/g, '</div>')
  // 代码块替换
  // hr替换
  return result
}
export {
  escapeHtml
}
