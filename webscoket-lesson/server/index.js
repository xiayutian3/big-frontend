// ws作为服务端来使用

const WebSocket = require('ws')
const wss = new WebSocket.Server({port:3000})
wss.on('connection',function (ws) { 
  console.log('one client is connected')
 })