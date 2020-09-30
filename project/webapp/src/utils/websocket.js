import store from '@/store'

// 客户端的websocket
class WebSocketClient {
  constructor (config = {}) {
    // 默认配置
    const defautConfig = {
      url: '127.0.0.1', // IP地址
      port: '3001', // 端口号
      protocol: 'ws', // 协议
      timeInterval: 5 * 1000 // 心跳检测时间间隔
    }
    // 最终配置
    const finalConfig = { ...defautConfig, ...config }
    // websocket客户端
    this.ws = {}
    this.port = finalConfig.port // 端口号
    this.url = finalConfig.url // IP地址
    this.protocol = finalConfig.protocol // 协议
    this.handle = null // 心跳检测定时器
    this.timeInterval = finalConfig.timeInterval // 心跳检测时间间隔
  }

  // 初始化websocket方法
  init () {
    this.ws = new WebSocket(`${this.protocol}://${this.url}:${this.port}`)
    this.ws.onopen = () => this.onOpen()
    this.ws.onmessage = (msg) => this.onMessage(msg) // 这样一来，onMessage函数this指向 WebSocketClient实例
    this.ws.onclose = () => this.onClose() // 箭头函数使this指向 WebSocketClient实例
    this.ws.onerror = () => this.onError() // 箭头函数使this指向 WebSocketClient实例
  }

  // 发送消息
  send (msg) {
    // this 指向 WebSocketClient 类
    this.ws.send(msg)
  }

  onOpen () {
    // this 指向websocket实例(在没使用箭头函数之前)
    // 发起鉴权请求(直接给令牌，拿着令牌去连接服务器)
    this.send(JSON.stringify({
      event: 'auth',
      // jwt token
      // 自己生成的  const restoken = jwt.sign({ name: 'imooc' }, 'secret');
      message: 'Bearer ' + store.state.token
    }))
    // 主动发起checkserve（心跳检测）(不然服务端重启后就没有了心跳检测)
    this.checkServer()
  }

  // 接受到消息的时候
  onMessage (event) {
    // console.log('message' + this.ws.readyState)
    // 把消息放到列表里
    // 接收服务端发送过来的消息
    var obj = JSON.parse(event.data)

    switch (obj.event) {
      // 鉴权失败的情况处理
      case 'noauth':
        // 鉴权失败
        // 路由跳转到 /login  重新获取token等，然后再重新this.ws.send 鉴权
        break
      case 'heartbeat':
        // 客户端检查服务器端，心跳，有请求回来就，清空定时器，没有就断开重新连接websocket服务器
        // 时间是 服务端返回心跳的一次时长timeInterval + t0(请求消耗的时间（500-1000ms）)
        this.checkServer()
        // 心跳检测
        this.ws.send(JSON.stringify({
          event: 'heartbeat',
          message: 'pong'
        }))
        break
      default:
        // 不给自己推送消息，由客户端判断
        // if (obj.name !== this.name) {
        //   // 接受正常的聊天
        //   this.lists.push(obj.name + ':' + obj.message)
        // }

        // 更新消息(更新vuex)
        store.dispatch(obj.event, obj)
        break
    }
  }

  onClose () {
    // console.log('close' + this.ws.readyState)
    // console.log('已关闭websocket')
    // 主动断开websocket连接
    this.ws.close()
  }

  onError () {
    // console.log('error' + this.ws.readyState)
    // console.log('websocket连接失败')
    // 连接出错误,失败 的时候发起 重连
    setTimeout(() => {
      this.init()
    }, 1000)
  }

  // 心跳检测，重连 服务器
  checkServer () {
    // 清空定时器
    clearTimeout(this.handle)
    this.handle = setTimeout(() => {
      // 关闭，重新连接 websocket
      this.onClose()
      setTimeout(() => {
        this.init()
      }, 1000) // 断开连接后，1s 再重新连接
    }, this.timeInterval + 500) // 收到服务端的请求时间（时间是 服务端返回心跳的一次时长timeInterval + t0(请求消耗的时间（500-1000ms）)）
  }
}

export default WebSocketClient
