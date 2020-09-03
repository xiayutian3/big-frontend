// Socket.io还需配合express来使用
const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.get('/',function(req,res){
  //返回当前文件夹下的index。html
  res.sendFile(__dirname+'/index.html')
})

//scoket连接
io.on('connection',function(socket){
  console.log('a socket is connected!')
  //服务端 接受 
  socket.on('chatEvent',function(msg){
    console.log('msg from client:' + msg)
    // 发送消息(这样只能是单一发送 1-1交流)
    // socket.send('server says:' + msg)
    
    //要广播出去才能做到多人聊天的功能
    socket.broadcast.emit('ServerMsg',msg)
  })
})


http.listen(3000,function(){
  console.log('server is running on:3000')
})