import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const playMode = {
  sequence: 0,
  loop: 1,
  random: 2
}

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  plugins: process.env.NODE_ENV !== 'production' ? [createLogger()] : [],
  state: {
    singer: {}, // 歌手
    playing: false, // 是否播放
    fullScreen: false,  // 播放器是否全屏
    playList: [], // 播放列表
    sequenceList: [], // 顺序播放列表
    mode: playMode.sequence, // 播放方式(顺序0/循环1/随机2)
    currentIndex: -1
  },
  getters: {
    singer(state) {
      return state.singer;
    },
    playing(state) {
      return state.playing
    },
    fullScreen(state) {
      return state.fullScreen;
    },
    playList(state) {
      return state.playList;
    },
    sequenceList(state) {
      return state.sequenceList;
    },
    mode(state) {
      return state.mode;
    },
    currentIndex(state) {
      return state.currentIndex;
    },
    currentSong(state) {
      return state.playList[state.currentIndex];
    }
  },
  mutations: {
    setSinger(state,singer) {
      state.singer = singer;
    },
    setPlaying(state,flag) {
      state.playing = flag;
    },
    setFullScreen(state,flag) {
      state.fullScreen = flag;
    },
    setPlayList(state,list) {
      state.playList = list;
    },
    setSequenceList(state,list) {
      state.sequenceList = list;
    },
    setMode(state,mode) {
      state.mode = mode;
    },
    setCurrentIndex(state,index) {
      state.currentIndex = index;
    }
  },
  actions: {

  },
  modules: {
  }
})
