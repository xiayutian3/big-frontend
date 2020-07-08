// ws作为服务端来使用

const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 3000 })

// 另一种统计人数
let num = 0

//监听链接
wss.on('connection', function (ws) {
  console.log('one client is connected')
  //接受客户端的消息
  ws.on('message', function (msg) {
    let msgObj = JSON.parse(msg)
    //获取进入聊天室的人的名字，绑定再ws上
    if (msgObj.event === 'enter') {
      ws.name = msgObj.message
      num++
    }
    // console.log("msg", msg)
    //主动发送消息给客户端
    // ws.send("server:" + msg)

    //统计聊天室的人数（也可以）
    // msgObj.num = wss.clients.size

    // //广播消息
    // wss.clients.forEach(client => {
    //   // 判断非自己的客户端（并且发送者是连接着的） ws 代表当前客户端 
    //   if (ws !== client && client.readyState === WebSocket.OPEN) {
    //     //返回msgObj给上名字，材质到是哪个人说的这句话
    //     msgObj.name = ws.name
    //     client.send(JSON.stringify(msgObj))
    //   }
    // })

    //广播消息
    //为了拿到进入聊天室的人数 ， 广播消息(去除 判断非自己的客户端条件) 因为传那么给客户端了，客户端可以自己判断
    wss.clients.forEach(client => {
      // （并且发送者是连接着的） ws 代表当前客户端 
      if (client.readyState === WebSocket.OPEN) {
        //返回msgObj给上名字，材质到是哪个人说的这句话
        msgObj.name = ws.name
        msgObj.num = num
        client.send(JSON.stringify(msgObj))
      }
    })
  })
  //当ws客户端断开链接的时候
  ws.on('close',function(){
    //在线人数
    if(ws.name){
      num--
    }
    let msgObj = {}
    ///广播消息
    wss.clients.forEach(client => {
      // （并且发送者是连接着的） ws 代表当前客户端 
      if (client.readyState === WebSocket.OPEN) {
        //返回msgObj给上名字，材质到是哪个人说的这句话
        msgObj.name = ws.name
        msgObj.num = num
        msgObj.event = 'out'
        client.send(JSON.stringify(msgObj))
      }
    })
  })




  // //主动发送消息给客户端
  // ws.send('Message from server')
})