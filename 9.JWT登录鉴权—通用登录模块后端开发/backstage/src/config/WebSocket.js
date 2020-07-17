// node 端集成websocket服务
import WebSocket from 'ws'
import { getJWTPayload } from '../common/Utils'
import Comments from '@/model/Comments'

class WebSocketServer {
  constructor (config = {}) {
    // 默认的配置
    const defaultConfig = {
      port: 3001, // 端口号
      timeInterval: 5 * 1000, // 心跳检测的时间
      isAuth: true // 是否需要认证
    }
    // 最终配置
    const finalConfig = { ...defaultConfig, ...config }
    this.wss = {} // websocket服务端应用
    this.timeInterval = finalConfig.timeInterval // 心跳检测时间
    this.isAuth = finalConfig.isAuth // 是否需要认证
    this.port = finalConfig.port // 端口号
    // 给websocket传递一些官方的选项配置
    this.options = config.options || {}
  }

  // 初始化websocket服务
  init () {
    // 传递端口、官方的配置选项
    this.wss = new WebSocket.Server({ port: this.port, ...this.options })

    // 心跳检测
    this.heartbeat()

    // 连接信息
    this.wss.on('connection', (ws) => {
      // 连接成功
      ws.isAlive = true

      // 接受到消息
      ws.on('message', (msg) => this.onMessage(ws, msg))
      // 断开连接的时候
      ws.on('close', () => this.onClose(ws))
    })
  }

  // 收到消息
  onMessage (ws, msg) {
    // 用户鉴权 -> token -> _id
    // 心跳检测
    // 消息发送
    const msgObj = JSON.parse(msg)
    // 事件对象
    const events = {
      // 认证
      auth: async () => {
        try {
          // 取用户的id
          const obj = await getJWTPayload(msgObj.message)
          if (obj) {
            ws.isAuth = true
            ws._id = obj._id
            const num = await Comments.getTotal(obj._id)
            // websocket连接成功发送 未读的消息总数
            ws.send(JSON.stringify({
              event: 'message',
              message: num
            }))
            // ws.send('auth is ok')
            // ws.send(JSON.stringify({
            //   event: 'auth',
            //   message: 'auth is ok'
            // }))
          }
        } catch (error) {
          ws.send(JSON.stringify({
            event: 'noauth',
            message: 'please auth again'
          }))
        }
      },
      // 心跳检测
      heartbeat: () => {
        if (msgObj.message === 'pong') {
          ws.isAlive = true
        }
      },
      // 发送消息
      message: () => {
        // 鉴权拦截
        if (!ws.isAuth && this.isAuth) {
          return
        }
        // 消息广播（clients连接的所有客户端）
        this.wss.clients.forEach(client => {
          // 判断状态是连接着的 ws 代表当前客户端 ，往当前连接的客户端 推消息
          if (client.readyState === WebSocket.OPEN && client._id === ws._id) {
            client.send(msg)
          }
        })
      }
    }
    events[msgObj.event]()
  }

  // 点对点的消息发送
  send (uid, msg) {
    this.wss.clients.forEach(client => {
      // 判断状态是连接着的 ws 代表当前客户端 ，往当前连接的客户端 推消息
      if (client.readyState === WebSocket.OPEN && client._id === uid) {
        client.send(msg)
      }
    })
  }

  // 广播消息 -> 推送系统消息（应用场景）
  broadcast (msg) {
    this.wss.clients.forEach(client => {
      // 判断状态是连接着的 ws 代表当前客户端 ，
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg)
      }
    })
  }

  // 关闭连接
  onClose (ws) {

  }

  // 心跳检测
  heartbeat () {
    clearInterval(this.interval)
    // 心跳检测定时器
    this.interval = setInterval(() => {
      this.wss.clients.forEach(ws => {
        if (!ws.isAlive) {
          // ws库自带的方法terminate，（服务器主动关闭）关闭websocket连接
          return ws.terminate()
        }
        // 主动发送心跳检测请求
        // 当客户端返回了消息之后，主动设置flag为在线
        // isAlive连接正常的标识
        ws.isAlive = false
        ws.send(JSON.stringify({
          event: 'heartbeat',
          message: 'ping'
        }))
      })
    }, this.timeInterval)
  }
}

export default WebSocketServer
