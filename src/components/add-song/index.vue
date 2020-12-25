<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide"><i class="icon-close"></i></div>
      </div>
      <div class="search-box-wrapper"><search-box ref="searchBox" placeholder="搜索歌曲" @query="onQueryChange" /></div>
      <div class="shortcut" v-show="!query">
        <switch-tab :switches="switches" :currentIndex="currentIndex" @switchItem="switchItem" />
        <div class="list-wrapper">
          <scroll class="list-scroll" ref="songList" :data="playHistory" v-if="currentIndex === 0">
            <div class="list-inner"><song-list :songs="playHistory" @selectItem="selectSong" /></div>
          </scroll>

          <scroll class="list-scroll" ref="searchHistoryList" :data="searchHistory" v-else>
            <div class="list-inner"><search-history-list :history="searchHistory" @select="$_addQuery" @deleteOne="$_deleteOne" /></div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <search-list ref="searchList"
                     :query="query"
                     :showSinger="showSinger"
                     @selectItem="selectSearchList"
                     @beforeScrollStart="$_blurInput" />
      </div>

      <transition name="drop">
        <div class="top-tip" v-show="topTipShow">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
  import SearchBox from 'base/search-box'
  import SongList from 'base/song-list'
  import SwitchTab from 'base/switch-tab'
  import SearchList from 'components/search-list'
  import Scroll from 'base/scroll'
  import SearchHistoryList from 'base/searchHistory-list'
  import { searchMixin } from 'common/js/mixin'
  import { Song } from 'common/js/song'
  import { mapGetters, mapActions } from 'vuex'
  import qs from 'qs'
  export default {
    name: "index",
    components: {
      SearchBox,
      SongList,
      SwitchTab,
      Scroll,
      SearchList,
      SearchHistoryList
    },
    mixins: [searchMixin],
    data() {
      return {
        showFlag: false,
        topTipShow: false,
        showSinger: false,
        query: '',
        currentIndex: 0,
        timer: null,
        switches: ['最近播放', '搜索历史']
      };
    },
    computed: {
      ...mapGetters([
        'playHistory',
        'searchHistory'
      ])
    },
    watch: {
      topTipShow(newTopTip) {
        if (newTopTip) {
          setTimeout(() => {
            this.topTipShow = false;
          },2000);
        }
      }
    },
    methods: {
      show() {
        this.showFlag = true;
        if (this.timer) {
          clearInterval(this.timer);
        }
        this.timer = setTimeout(() => {
          this.$refs.songList.refresh();
        },20);
      },
      hide() {
        this.showFlag = false;
      },
      onQueryChange(query) {
        this.query = query;

        if (!this.query && this.currentIndex === 1) {
          setTimeout(() => {
            this.$refs.searchHistoryList.refresh();
          },20);
        }
      },
      switchItem(index) {
        this.currentIndex = index;
      },
      // 点击选择歌曲
      selectSong(song,index) {
        if (index === 0) {
          return ;
        }
        this.topTipShow = true;
        this.insertSong(new Song(song));
      },
      // 点击选择搜索列表
      selectSearchList(item) {
        this.topTipShow = true;
        this.$_saveSearch();
      },
      ...mapActions([
        'insertSong'
      ])
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .top-tip
      position: fixed
      top: 0
      width: 100%
      z-index: 500
      background: $color-dialog-background
      text-align center
      padding 18px 0
      &.drop-enter-active, &.drop-leave-active
        transition all .3s
      &.drop-enter, &.drop-leave-to
        transform: translate3d(0, -100%, 0)
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>