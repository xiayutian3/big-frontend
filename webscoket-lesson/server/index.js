// ws作为服务端来使用

const WebSocket = require('ws')
const wss = new WebSocket.Server({port:3000})

//监听链接
wss.on('connection',function (ws) { 
  console.log('one client is connected')
  //接受客户端的消息
  ws.on('message',function(msg){
    console.log(msg)
  })
  //主动发送消息给客户端
  ws.send('Message from server')
 })