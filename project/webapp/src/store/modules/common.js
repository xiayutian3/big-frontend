
// websocket配置

// 引入websocket
import WebSocketClient from '@/utils/websocket'
import {
  INIT_WEBSOCKET
} from '@/store/mutation-types'
export default {
  state: {
    ws: null // websoxket客户端
  },
  mutations: {
    [INIT_WEBSOCKET] (state, config) {
      state.ws = new WebSocketClient(config)
      state.ws.init()
    }
  }
}
