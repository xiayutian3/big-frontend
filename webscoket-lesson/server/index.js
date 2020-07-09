// ws作为服务端来使用
const http = require('http');//鉴权，使用（从http协议升级到ws协议，session（cookie）鉴权），在这里我们用的是jwt来验证，实现了自定义验证
const WebSocket = require('ws')
const wss = new WebSocket.Server({ noServer: true  })
const server = http.createServer();
//鉴权
const jwt = require('jsonwebtoken');

// 另一种统计人数
// let num = 0

//多聊天室的功能
//roomid -》 对应相同的roomid进行广播消息
let group = {}  //记录每个房间的在线人数

//监听链接
wss.on('connection', function (ws) {
  console.log('one client is connected')
  //接受客户端的消息
  ws.on('message', function (msg) {
    let msgObj = JSON.parse(msg)
    //获取进入聊天室的人的名字，绑定再ws上
    if (msgObj.event === 'enter') {
      ws.name = msgObj.message
      ws.roomid = msgObj.roomid
      //对应每个房间人数的计数
      if(typeof group[ws.roomid] === 'undefined'){
        group[ws.roomid] = 1
      }else{
        group[ws.roomid]++
      }
    }

    //鉴权判断
    if(msgObj.event === 'auth'){
      jwt.verify(msgObj.message,'secret',(err,decode)=>{
        if(err){
          //websocket返回前台鉴权失败的消息
          console.log('auth err')
          return
        }else{
          //鉴权通过
          console.log(decode)
          ws.isAuth = true
          return
        }
      })
    }
    //拦截非鉴权的请求
    if(!ws.isAuth){
      ws.send(JSON.stringify({
        event:'noauth',
        message:'please auth again'
      }))
      return
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
      // （并且发送者是连接着的） ws 代表当前客户端 ,roomid相同的聊天室，才进行广播
      if (client.readyState === WebSocket.OPEN && client.roomid === ws.roomid) {
        //返回msgObj给上名字，材质到是哪个人说的这句话
        msgObj.name = ws.name
        msgObj.num = group[ws.roomid]
        client.send(JSON.stringify(msgObj))
      }
    })
  })
  //当ws客户端断开链接的时候
  ws.on('close',function(){
    //在线人数
    if(ws.name){
      group[ws.roomid]--
    }
    let msgObj = {}
    ///广播消息
    wss.clients.forEach(client => {
      // （并且发送者是连接着的） ws 代表当前客户端  ,roomid相同的聊天室，才进行广播
      if (client.readyState === WebSocket.OPEN && client.roomid === ws.roomid) {
        //返回msgObj给上名字，材质到是哪个人说的这句话
        msgObj.name = ws.name
        msgObj.num = group[ws.roomid]
        msgObj.event = 'out'
        client.send(JSON.stringify(msgObj))
      }
    })
  })




  // //主动发送消息给客户端
  // ws.send('Message from server')
})



//服务端鉴权express express-session（ 对应node端的客户端鉴权），因为是前后端分离，这个不过多深入
// https://www.npmjs.com/package/ws  从这里可以跳到下面的连接，也可以直接打开下面的连接
// 可以参考 https://github.com/websockets/ws/tree/d09daaf67c282e301eeebe21797215ddffd819c5/examples/express-session-parse

server.on('upgrade', function upgrade(request, socket, head) {
  console.log("upgrade -> request", request.headers)
  // This function is not defined on purpose. Implement it with your own logic.
  // authenticate(request, (err, client) => {
  //   if (err || !client) {
  //     socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
  //     socket.destroy();
  //     return;
  //   }
 
    wss.handleUpgrade(request, socket, head, function done(ws) {
      //鉴权后必须要通过升级后的 （http协议升级到ws协议）服务 发送回来websocket消息
      wss.emit('connection', ws, request);
    });
  // });
});
 
server.listen(3000);