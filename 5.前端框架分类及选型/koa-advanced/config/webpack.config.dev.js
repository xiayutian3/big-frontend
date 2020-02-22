const webpackMerge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.config.base')

const webpackConfig = webpackMerge(baseWebpackConfig,{
  mode:'development',
  devtool:'eval-source-map',
  stats:{children:false}  //webpack输出配置，对于日志等消息我们不希望传递出来
})
module.exports = webpackConfig