import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import app from './module/app'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //
    sid: ''
  },
  mutations: {
    //
    setSid (state, value) {
      state.dis = value
    }
  },
  actions: {
    //
  },
  modules: {
    user,
    app
  }
})
