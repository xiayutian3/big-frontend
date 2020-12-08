import { createStore ,createLogger} from 'vuex'
import {INCREMENT,DECREMENT} from './mutations-type'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  state: {
    count:0
  },
  mutations: {
    [INCREMENT](state){
      state.count ++
    },
    [DECREMENT](state){
      state.count --
    }
  },
  actions: {
  },
  modules: {
  },
  plugins:debug?[createLogger()]:[] //创建日志
})
