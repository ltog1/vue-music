<!--
 * @Author: your name
 * @Date: 2020-12-26 18:11:47
 * @LastEditTime: 2020-12-27 17:51:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-music\music\src\components\user-center\index.vue
-->
<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back"><i class="icon-back"></i></div>
      <div class="switches-wrapper">
        <switch-tab :switches="switches" :currentIndex="currentIndex" @switchItem="switchTab"></switch-tab>
      </div>
      <div class="play-btn" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWra">
        <scroll class="list-scroll" ref="favoriteList" :data="favoriteList" v-if="currentIndex === 0">
          <div class="list-inner"><song-list :songs="favoriteList" @selectItem="selectSong" /></div>
        </scroll>
        
        <scroll class="list-scroll" ref="playList" :data="playHistory" v-else>
          <div class="list-inner"><song-list :songs="playHistory" @selectItem="selectSong" /></div>
        </scroll>
      </div>

      <div class="no-result-wrapper" v-show="noResult">
        <no-result :title="noResultDesc" />
      </div>
    </div>
  </transition>
</template>

<script>
  import SwitchTab from 'base/switch-tab'
  import NoResult from 'base/no-result'
  import SongList from 'base/song-list'
  import Scroll from 'base/scroll'
  import { Song } from 'common/js/song'
  import { playListMixin } from 'common/js/mixin'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    name: "index",
    components: {
      SwitchTab,
      NoResult,
      SongList,
      Scroll
    },
    mixins: [playListMixin],
    data () {
      return {
        switches: ['我喜欢的', '最近听的'],
        currentIndex: 0,
        noResultDesc: '暂无收藏歌曲'
      }
    },
    computed: {
      ...mapGetters([
        'playHistory',
        'favoriteList'
      ]),
      noResult() {
        if (this.currentIndex === 0) {
          return !this.favoriteList.length;
        } else {
          return !this.playHistory.length;
        }
      }
    },
    methods: {
      $_handlerPlayList(playlist) {
        const bottom = playlist.length ? '60px' : '';
        this.$refs.listWra.style.bottom = bottom;
        if (this.currentIndex === 0) {
          this.$refs.favoriteList.refresh();
        } else {
          this.$refs.playList.refresh(); 
        }
      },
      back() {
        this.$router.back();
      },
      switchTab(index) {
        this.currentIndex = index;
      },
      random() {
        let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory;
        if (!list.length) {
          return ;
        }
        this.randomPlay({ list });
      },
      selectSong(song,index) {
        this.insertSong(new Song(song));
      },
      ...mapActions([
        'insertSong',
        'randomPlay'
      ])
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .user-center
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .switches-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-text-l
      color: $color-text-l
      border-radius: 100px
      font-size: 0
      .icon-play
        display: inline-block
        vertical-align: middle
        margin-right: 6px
        font-size: $font-size-medium-x
      .text
        display: inline-block
        vertical-align: middle
        font-size: $font-size-small
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>