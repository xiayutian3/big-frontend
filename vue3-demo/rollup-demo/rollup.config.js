// rollup.config.js（已支持es规范 import export，可直接使用）


//压缩代码插件
import { terser } from "rollup-plugin-terser";

//执行单个命令

// export default {
//   input:'src/main.js',
//   output:{
//     file:'distall/bundle.js',
//     format:'cjs'
//   }
// }

// 执行多个命令用数组形式
// export default [
//   {
//     input: 'src/main.js',
//     output: {
//       file: 'distall/bundle.js',
//       format: 'cjs'
//     }
//   },
//   {
//     input: 'src/main.js',
//     output: {
//       file: 'distall/bundle-es.js',
//       format: 'es'
//     },
//     plugins: [terser()]
//   }
// ]


// 执行多个命令用数组形式（另一种写法）  共用配置文件
export default {
    input: 'src/main.js',
    output: [   //输出多个不同类型的文件用数组
      {
        file: 'distall/bundle.js',
        format: 'cjs'
      },
      {
        file: 'distall/bundle-es.js',
        format: 'es'
      }
    ],
    plugins: [terser()]   //rollup顺序引用，顺序执行，而webpack是顺序引用，逆序执行
  }