// node端的客户端鉴权

const WebSocket = require('ws')
// node端的客户端 可以使用自定义的header进行鉴权,而浏览器端的不行 ，因为浏览器端的websocket（WebSocket(url[, protocols])），第二个参数是protocols类型
//详情 https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket
const ws = new WebSocket('ws://127.0.0.1:3000',{
  headers:{
    token:'123'
  }
})