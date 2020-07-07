// ws作为客户端使用
const WebSocket = require('ws')
const ws = new WebSocket('ws://127.0.0.1:3000')

ws.on('open',function(){
  console.log('client is connected to server')
  ws.send('client say hello to server!!')
  ws.on('message',function(event){
  console.log("event", event)
  })
})