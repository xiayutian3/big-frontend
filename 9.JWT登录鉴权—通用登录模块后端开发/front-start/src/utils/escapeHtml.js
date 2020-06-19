// 表情链接
import faces from '@/assets/js/face'
// innerText和textContent的区别
// 设置标签中的文本内容,应该使用textContent属性,谷歌,火狐支持,IE8不支持
// 设置标签中的文本内容,应该使用innerText属性,谷歌,火狐,IE8都支持
// 如果这个属性在浏览器中不支持,那么这个属性的类型是undefined
// 判断这个属性的类型 是不是undefined,就知道浏览器是否支持
const htmlEncode = (html) => {
  let temp = document.createElement('div')
  temp.textContent !== undefined ? (temp.textContent = html) : (temp.innerText = html)
  const output = temp.innerHTML // 如果有html标签，返回出来就包含有html标签的内容，
  temp = null
  return output
}

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
  // 链接替换 \s表示空格  a(链接)[标题]
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
  // 例子如下：
  //   [pre]
  // hllow
  // [/pre]
  const code = /(\[\/?pre(.+?)[^\]]*\])|\[[^\]]*\]/g // | 竖线是或的关系
  if (code.test(result)) {
    const group = result.match(code)
    group.map((item) => {
      result = result.replace(item, htmlEncode(item))
    })
    result = result.replace(/\[pre\]/g, '<pre>')
    result = result.replace(/\[\/pre\]/g, '</pre>')
  }
  // hr替换
  result = result.replace(/\[hr\]/g, '<hr>')
  // 回车换行的替换
  // 正则表达式里面/r匹配换行，/n匹配回车
  result = result.replace(/\r\n/g, '<br>')
  result = result.replace(/\n/g, '<br>')

  return result
}
export {
  escapeHtml
}
