const webpackMerge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.config.base')
//js代码压缩
const TerserPlugin = require('terser-webpack-plugin')

const webpackConfig = webpackMerge(baseWebpackConfig,{
  mode:'production',
  stats:{children:false,warnings:false},//webpack输出配置，对于日志等消息我们不希望传递出来
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions:{
          warnings:false,
          compress:{
            warnings:false,
            //是否注释console.log
            drop_console:false,
            dead_code:true,
            drop_debugger:true
          },
          output:{
            comments:false,
            beautify:false
          },
          mangle:true
        },
        parallel:true,  //开启多进程压缩
        sourceMap:false  //关掉代码映射
      })
    ],
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 3,
          enforce:true
        }
      }
    }
  }
})
module.exports = webpackConfig
