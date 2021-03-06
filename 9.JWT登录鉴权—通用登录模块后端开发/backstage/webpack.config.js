const path = require('path')
// 排除对node_modules文件夹，webpack就不去处理node_modules文件夹了
const nodeExcternals = require('webpack-node-externals')
// 清除目录插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

// 获取文件路径
function getPath (url) {
  return path.join(__dirname, url)
}

// debugger
const webpackconfig = {
  // node环境
  target: 'node',
  mode: 'development',
  entry: {
    server: getPath('./src/index.js')
  },
  output: {
    filename: '[name].bundle.js',
    path: getPath('./dist')
  },
  devtool: 'eval-source-map', // 将 SourceMap 嵌入到每个模块中
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader'
        },
        // loader:'babel-loader',   //也可以这样
        // use:[{                      //还可以这样
        //   loader:'babel-loader'
        // }],
        // 排除node_modules目录
        exclude: [getPath('/node_modules')]
      }
    ]
  },
  // 不要遵循/打包这些模块，而是在运行时从环境中请求他们
  externals: [nodeExcternals()],
  plugins: [
    new CleanWebpackPlugin()
  ],
  // 调试工具
  node: {
    // Polyfills and mocks to run Node.js-
    // environment code in non-Node environments.
    console: true, // boolean | "mock"
    global: true, // boolean | "mock"
    process: true, // boolean
    __filename: true, // boolean | "mock"
    __dirname: true, // boolean | "mock"
    Buffer: true, // boolean | "mock"
    setImmediate: true // boolean | "mock" | "empty"
  }
}
// 调试webpack配置
// console.log(webpackconfig)

module.exports = webpackconfig
