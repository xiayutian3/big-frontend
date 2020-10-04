const path = require('path')
const resolve = dir => path.join(__dirname, dir)
module.exports = {
  chainWebpack: config => {
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .test(/\.svg$/)
      .include.add(resolve('./src/assets/icons')) // 包含的路径
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader') // 名字也叫svg-sprite-loader
      .options({ // 传递 symbolId  用于新增
        symbolId: 'icon-[name]' // 去掉svg这个图片加载不出来
      })
      // .tap(options => { // 只能修改它的选项...不能用于新增
      //   // console.log('options', options)
      //   options.symbolId = 'icon-[name]'
      //   return options
      // })
    config.module // 其他地方引用svg的处理用images，排除 src/assets/icons 的svg处理，因为已经交给svg-sprite-loader处理了
      .rule('images')
      .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/) // 添加svg
      .exclude.add(resolve('./src/assets/icons')) // 不包含的路径
  },
  css: { // 全局引入sass 的变量
    loaderOptions: {
      sass: {
        // 这里的选项会传递给 sass-loader
        prependData: '@import "@/assets/styles/_variables.scss";'
      }
    }
  }
}
