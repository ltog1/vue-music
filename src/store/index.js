import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import { shuffle } from 'common/js/util'
import cache from 'common/js/cache'

Vue.use(Vuex)

const playMode = {
  sequence: 0,
  loop: 1,
  random: 2
}

const findIndex = (list,song) => {
  return list.findIndex(item => {
    return item.id === song.id;
  })
}

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  plugins: process.env.NODE_ENV !== 'production' ? [createLogger()] : [],
  state: {
    singer: {}, // 歌手
    disc: {}, // 歌单信息
    topList: {}, // 排行榜信息
    playing: false, // 是否播放
    fullScreen: false,  // 播放器是否全屏
    playList: [], // 播放列表
    sequenceList: [], // 顺序播放列表
    mode: playMode.sequence, // 播放方式(顺序0/循环1/随机2)
    currentIndex: -1,
    searchHistory: cache.getSearch(),
    playHistory: cache.getPlay(),
    favoriteList: cache.getFavorite()
  },
  getters: {
    singer(state) {
      return state.singer;
    },
    disc(state) {
      return state.disc;
    },
    topList(state) {
      return state.topList;
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
      return state.playList[state.currentIndex] || {};
    },
    searchHistory(state) {
      return state.searchHistory;
    },
    playHistory(state) {
      return state.playHistory;
    },
    favoriteList(state) {
      return state.favoriteList;
    },
  },
  mutations: {
    setSinger(state,singer) {
      state.singer = singer;
    },
    setDisc(state,disc) {
      state.disc = disc;
    },
    setTopList(state,top) {
      state.topList = top;
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
    },
    setSearchHistory(state,history) {
      state.searchHistory = history;
    },
    setPlayHistory(state,history) {
      state.playHistory = history;
    },
    setFavoriteList(state,list) {
      state.favoriteList = list;
    },
  },
  actions: {
    // 点击歌曲 播放
    selectPlay({ commit,state }, { list , index}) {
      if (state.mode === playMode.random) {
        let randomList = shuffle(list);
        commit('setPlayList', randomList);
        index = findIndex(randomList, list[index]);
      } else {
        commit('setPlayList', list);
      }
      commit('setSequenceList', list);
      commit('setCurrentIndex', index);
      commit('setFullScreen', true);
      commit('setPlaying', true);
    },
    // 点击 随机播放
    randomPlay({ commit }, { list }) {
      let randomList = shuffle(list);
      commit('setMode', playMode.random);
      commit('setPlayList', randomList);
      commit('setSequenceList', list);
      commit('setCurrentIndex', 0);
      commit('setPlaying', true);
      commit('setFullScreen', true);
    },
    // 点击 插入歌曲
    insertSong({ commit, state }, song) {
      let playList = state.playList.concat(),
        sequenceList = state.sequenceList.concat(),
        currentIndex = state.currentIndex;

      /***因为播放列表控制着歌曲播放,所以播放列表的currentIndex要因为插入的数组长度变化而随之改变****/
      // 当前歌曲
      let currentSong = playList[currentIndex];
      // 查找播放列表中是否有待插入的歌曲并返回索引
      let fpIndex = findIndex(playList, song);
      // 在播放列表中插入歌曲
      currentIndex++;
      playList.splice(currentIndex, 0, song);
      // 如果播放列表中已经包含这首歌,删除这首歌,重新计算currentIndex
      if (fpIndex > -1) {
        if (currentIndex > fpIndex) { // 如果插入的这首歌在列表中在包含这首歌的后面 例: 插入前[1,2,3,4]  插入后[1,2,3,4,2]  删除后[1,3,4,2]
          playList.splice(fpIndex, 1);
          currentIndex--;
        } else {  // 如果插入的这首歌在列表中包含这首歌的前面  例: 插入前[1,3,4,2] 插入后[1,2,3,4,2]  删除后[1,2,3,4]
          playList.splice(fpIndex + 1, 1);
        }
      }

      /***而顺序播放列表不控制着歌曲播放,所以改变顺序播放列表时currentIndex不用随之改变****/
      // 当前顺序列表要插入的歌曲的索引  (当前播放歌曲索引加1)
      let currentSIndex = findIndex(sequenceList, currentSong) + 1;
      // 查找顺序播放列表中是否有待插入的歌曲并返回索引
      let fsIndex = findIndex(sequenceList, song);
      // 在顺序播放列表插入歌曲
      sequenceList.splice(currentSIndex, 0, song);
      // 如果顺序播放列表中已经包含这首歌,删除这首歌
      if (fsIndex > -1) {
        if (currentSIndex > fsIndex) {
          sequenceList.splice(fpIndex, 1);
        } else {
          sequenceList.splice(fpIndex + 1, 1);
        }
      }

      commit('setPlayList', playList);
      commit('setSequenceList', sequenceList);
      commit('setCurrentIndex', currentIndex);
      commit('setPlaying', true);
      commit('setFullScreen', true);
    },
    saveSearchHistory({ commit }, query) {
      commit('setSearchHistory',cache.saveSearch(query));
    },
    deleteSearchHistory({ commit }, query) {
      commit('setSearchHistory',cache.deleteOne(query));
    },
    clearSearchHistory({ commit }) {
      commit('setSearchHistory',cache.clearSearch());
    },
    savePlayHistory({ commit }, song) {
      commit('setPlayHistory',cache.savePlay(song));
    },
    deletePlaySong({ commit,state }, song) {
      let playList = state.playList.concat();
      let currentIndex = state.currentIndex;
      let index = playList.findIndex(item => {
        return item.id === song.id;
      });

      playList.splice(index,1);
      if (index < currentIndex || currentIndex === playList.length) {
        currentIndex--;
      }
      commit('setPlayList',playList);
      commit('setSequenceList',playList);
      commit('setCurrentIndex',currentIndex);

      if (!playList.length) {
        commit('setPlaying',false);
      } else {
        commit('setPlaying',true);
      }
    },
    clearPlaySong({ commit }) {
      commit('setPlayList', []);
      commit('setSequenceList', []);
      commit('setCurrentIndex', -1);
      commit('setPlaying', false);
    },
    saveFavorite({ commit }, song) {
      commit('setFavoriteList',cache.saveFavorite(song));
    },
    deleteFavorite({ commit }, song) {
      commit('setFavoriteList',cache.deleteFavorite(song));
    }
  },
  modules: {
  }
})
