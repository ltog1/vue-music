import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  plugins: process.env.NODE_ENV !== 'production' ? [createLogger()] : [],
  state: {
    singer: {}
  },
  getters: {
    singer(state) {
      return state.singer;
    }
  },
  mutations: {
    setSinger(state,singer) {
      state.singer = singer;
    }
  },
  actions: {

  },
  modules: {
  }
})
