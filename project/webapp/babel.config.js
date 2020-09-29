module.exports = {
  presets: [
    // 现在好多浏览器已经支持了es6原生语法了，preset已经够用了, modules: false 不去转义es6语法。
    // vue cli 集成webpack已经帮我们处理好了，语法转义问题，就不需要在使用babel转义了
    ['@vue/cli-plugin-babel/preset', { modules: false }]
    // ['es2015', { modules: false }]
  ],
  plugins: [['component',
    {
      libraryName: 'mint-ui',
      style: true
    }
  ]]
}
