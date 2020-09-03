const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserJSPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const webpack = require('webpack')
const path = require('path')

// console.log(path.resolve())  // F:\study\big-frontend\webpack4
// console.log(path.join(__dirname,'./dist')) // F:\study\big-frontend\webpack4\dist


module.exports = {
  mode:'production',
  entry:'./src/index.js',
  output:{
    //path.join() 拼接路径
    //__dirname 当前文件的绝对路径
    filename:'bundle.js',
    path:path.join(__dirname,'./dist')
  },
  devServer: {
    hot: true
  },
  module:{
    rules:[
      {
        test:/\.css$/,
        use:['style-loader','css-loader']
      },
      {
        //安装node-sass sass-loader
        // test:/\.(scss|sass)$/,
        // use:['style-loader','css-loader','sass-loader']

        //style-loader就不需要了 换成MiniCssExtractPlugin.loader，官网就是这么配置得
        test:/\.(scss|sass)$/,
        use:[MiniCssExtractPlugin.loader,'css-loader','sass-loader']
      },
      {
        test:/\.js$/,  
        loader:'babel-loader'   //转化es6语法成es5
      }
    ]
  },
  optimization: {
    minimizer: [
      new TerserJSPlugin({}),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename:'index.html',
      template:'template.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from:path.join(__dirname,'src/assets'),
        to:'assets'
      }
    ]),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
}