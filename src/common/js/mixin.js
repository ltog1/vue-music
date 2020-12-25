import {mapActions, mapGetters, mapMutations} from "vuex";
import { shuffle } from 'common/js/util'

export const playListMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  watch: {
    playList(newVal) {
      this.$_handlerPlayList(newVal);
    }
  },
  mounted() {
    this.$_handlerPlayList(this.playList);
  },
  activated() {
    this.$_handlerPlayList(this.playList);
  },
  methods: {
    $_handlerPlayList() {
      // 组件引用时必须使用该函数,组件内定义的同名函数会覆盖该函数
      throw new Error('component must implement $_handlerPlayList methods');
    }
  }
}



export const playerMixin = {
  computed: {
    ...mapGetters([
      'mode',
      'playList',
      'currentSong',
      'sequenceList'
    ]),
    $_iconMode() {
      return this.mode === 0 ? 'icon-sequence' : this.mode === 1 ? 'icon-loop' : 'icon-random';
    }
  },
  methods: {
    // 改变播放方式
    $_changeMode() {
      let mode = this.mode === 0 ? 1 : this.mode === 1 ? 2 : 0;
      this.setMode(mode);

      if (mode === 0) { // 顺序播放
        this.resetCurrentIndex(this.sequenceList);
        this.setPlayList(this.sequenceList);
      } else if (mode === 2) {    // 随机播放
        this.randomPlay();
      }
    },
    randomPlay() {
      let list = shuffle(this.playList);

      this.resetCurrentIndex(list);
      this.setPlayList(list);
    },
    resetCurrentIndex(list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id;
      });
      this.setCurrentIndex(index);
    },
    ...mapMutations([
      'setMode',
      'setCurrentIndex',
      'setPlayList'
    ])
  }
}

export const searchMixin = {
  methods: {
    $_blurInput() {
      this.$refs.searchBox.blurInput();
    },
    // 删除某一条搜索历史
    $_deleteOne(item) {
      this.deleteSearchHistory(item);
    },
    // 保存搜索历史
    $_saveSearch() {
      this.saveSearchHistory(this.query);
    },
    $_addQuery(key) {
      this.$refs.searchBox.setQuery(key);
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}