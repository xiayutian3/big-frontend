// ws作为服务端来使用

// const http = require('http');//鉴权，使用（从http协议升级到ws协议，session（cookie）鉴权），在这里我们用的是jwt来验证，实现了自定义验证
// const server = http.createServer();
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 3000 })
//引入redis
const { setValue, getValue, existKey } = require('./config/RedisConfig')
// //测试redis的使用
// const run = async ()=>{
//   setValue('imooc','hello')
//   const result = await getValue('imooc')
//   console.log("run -> result", result)
// }
// run()

//鉴权
// const jwt = require('jsonwebtoken');


//心跳检测时间
let timeInterval = 30000

//用于roomid的prefix
let prefix = 'prefix-'

// 另一种统计人数
// let num = 0

//多聊天室的功能
//roomid -》 对应相同的roomid进行广播消息
let group = {}  //记录每个房间的在线人数

//监听链接
wss.on('connection', function (ws) {
  //初始的心跳连接状态
  ws.isAlive = true

  console.log('one client is connected')
  //接受客户端的消息
  ws.on('message', async function (msg) {
    let msgObj = JSON.parse(msg)
    let roomid = prefix + (msgObj.roomid ? msgObj.roomid : ws.roomid)
    //获取进入聊天室的人的名字，绑定再ws上
    if (msgObj.event === 'enter') {
      //做消息缓存
      //当用户进入之后，需要判断用户的房间是或否存在
      //如果用户的房间不存在，则再redis中创建房间号，用于保存房间内用户的信息
      //主要是用于统计房间里的人数，用于后面进行消息发送
      ws.name = msgObj.message
      ws.roomid = msgObj.roomid
      ws.uid = msgObj.uid
      //判断redis中是否有对应的roomid的键值
      const result = await existKey(roomid)
      if (result === 0) {
        //初始化一个房间数据(roomid 不存在)
        setValue(roomid, ws.uid)
      } else {
        //已经存在该房间的缓存数据
        const arrStr = await getValue(roomid)
        let arr = arrStr.split(',')
        if (arr.indexOf(ws.uid) === -1) {
          //说明进来的用户，之前不存在这个房间
          setValue(roomid, arrStr + ',' + ws.uid)
        }
      }

      //对应每个房间人数的计数
      if (typeof group[ws.roomid] === 'undefined') {
        group[ws.roomid] = 1
      } else {
        group[ws.roomid]++
      }
    }

    //开发消息缓存功能用不上鉴权，所以注释掉了

    // //鉴权判断
    // if (msgObj.event === 'auth') {
    //   jwt.verify(msgObj.message, 'secret', (err, decode) => {
    //     if (err) {
    //       //websocket返回前台鉴权失败的消息
    //       ws.send(JSON.stringify({
    //         event: 'noauth',
    //         message: 'please auth again'
    //       }))
    //       console.log('auth err')
    //       return
    //     } else {
    //       //鉴权通过
    //       // console.log(decode)
    //       ws.isAuth = true
    //       return
    //     }
    //   })
    //   return
    // }
    // //拦截非鉴权的请求
    // if (!ws.isAuth) {
    //   return
    // }

    //心跳检测(来自客户端的请求)
    if (msgObj.event === 'heartbeat' && msgObj.message === 'pong') {
      //连接正常的标识
      ws.isAlive = true
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
    //离线消息缓存，获取房间里的所有的用户信息
    const arrStr = await getValue(roomid)
    let users = arrStr.split(',')

    //为了拿到进入聊天室的人数 ， 广播消息(去除 判断非自己的客户端条件) 因为传那么给客户端了，客户端可以自己判断
    wss.clients.forEach(async client => {
      // （并且发送者是连接着的） ws 代表当前客户端 ,roomid相同的聊天室，才进行广播
      if (client.readyState === WebSocket.OPEN && client.roomid === ws.roomid) {
        //返回msgObj给上名字，材质到是哪个人说的这句话
        msgObj.name = ws.name
        msgObj.num = group[ws.roomid]
        client.send(JSON.stringify(msgObj))

        //排除已经发送了消息的客户端 -> （在线的客户端，实时接受信息）
        if (users.indexOf(client.uid) !== -1) {
          users.splice(users.indexOf(client.uid), 1)
        }
        //消息缓存信息：取redis中的该用户uid数据
        let result = await existKey(ws.uid)
        if (result !== 0) {
          //存在未发送的离线数据
          let tmpArr = await getValue(ws.uid)
          let tmpObj = JSON.parse(tmpArr)
          let uid = ws.uid
          if (tmpObj.length > 0) {
            let i = []
            //遍历该用户的离线缓存数据
            //判断用户的房间id是否与当前一致
            tmpObj.forEach(item => {
              if (item.roomid === client.roomid && uid === client.uid) {
                client.send(JSON.stringify(item))
                i.push(item)
              }
            })
            //删除已经发送的缓存消息数据
            if (i.length > 0) {
              i.forEach(item => {
                tmpObj.splice(item, 1)
              })
            }
            //再次保存没有发送出去的消息数据
            setValue(ws.uid, JSON.stringify(tmpObj))
          }
        }
      }
    })

    //断开了与服务端连接的用户的id ，并且其他的客户端发送了消息
    if (users.length > 0 && msgObj.event === 'message') {
      users.forEach(async function (item) {
        //判断用户是否存在离线消息
        const result = await existKey(item)
        if (result !== 0) {
          //说明已经存在其他房间该用户的离线消息数据
          let userData = await getValue(item)
          let msgs = JSON.parse(userData)
          msgs.push({
            roomid: ws.roomid,
            ...msgObj
          })
          setValue(item, JSON.stringify(msgs))
        } else {
          //说明先前这个用户一直在线，并且无离线消息数据，就直接发送新产生的数据
          setValue(item, JSON.stringify([{
            roomid: ws.roomid,
            // msg: msgObj.message,
            // name: msgObj.name
            ...msgObj
          }]))
        }
      })

    }
  })
  //当ws客户端断开链接的时候
  ws.on('close', function () {
    //在线人数
    if (ws.name) {
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

// server.on('upgrade', function upgrade(request, socket, head) {
//   console.log("upgrade -> request", request.headers)
//   // This function is not defined on purpose. Implement it with your own logic.
//   // authenticate(request, (err, client) => {
//   //   if (err || !client) {
//   //     socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
//   //     socket.destroy();
//   //     return;
//   //   }

//   wss.handleUpgrade(request, socket, head, function done(ws) {
//     //鉴权后必须要通过升级后的 （http协议升级到ws协议）服务 发送回来websocket消息
//     wss.emit('connection', ws, request);
//   });
//   // });
// });

// server.listen(3000);


// 心跳检测定时器
setInterval(() => {

  wss.clients.forEach(ws => {
    if (!ws.isAlive && ws.roomid) {
      //客户端断开，离开 对应的房间的人数 减减
      group[ws.roomid]--
      //删除对应客户端的 roomid  不然客户端一直不回，服务器一直进入这段代码， ws.roomid 会变成负数
      delete ws.roomid
      // ws库自带的方法terminate，（服务器主动关闭）关闭websocket连接
      return ws.terminate()
    }
    //主动发送心跳检测请求
    //当客户端返回了消息之后，主动设置flag为在线
    //isAlive连接正常的标识
    ws.isAlive = false
    ws.send(JSON.stringify({
      event: 'heartbeat',
      message: 'ping',
      num: group[ws.roomid]
    }))
  })

}, timeInterval)