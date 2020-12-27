<template>
  <div class="music-list">
    <div class="back" @click="back"><i class="icon-back"></i></div>
    <h1 class="title" ref="title">{{ title }}</h1>
    <div class="bg-image" :style="`background-image: url(${bgImage})`" ref="bgImage">
      <div class="play-wrapper" ref="play" v-if="songs.length">
        <div class="play" @click="randomClick">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter"></div>
    </div>

    <div class="bg-layer" ref="bgLayer"></div>
    <scroll class="list"
            ref="list"
            :data="songs"
            :listenScroll="listenScroll"
            :probeType="probeType"
            @scroll="ListScroll">
      <div class="song-list-wrapper"><song-list :rank="rank" :songs="songs" @selectItem="selectItem" /></div>
      <loading v-if="!songs.length"/>
    </scroll>

  </div>
</template>

<script>
  import SongList from 'base/song-list/index'
  import Scroll from 'base/scroll/index'
  import Loading from 'base/loading/index'
  import { mapActions } from 'vuex'
  import { playListMixin } from 'common/js/mixin'
  export default {
    name: "index",
    components: {
      SongList,
      Scroll,
      Loading
    },
    mixins: [playListMixin],
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default() {
          return [];
        }
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      this.bgImageHieght = this.$refs.bgImage.clientHeight;
      this.titleHieght = this.$refs.title.clientHeight;
      this.maxTransformY = -(this.bgImageHieght - this.titleHieght);
      this.$refs.list.$el.style.top = `${this.bgImageHieght}px`;
    },
    created() {
      this.listenScroll = true; // 传递给scroll组件,是否派发滚动事件
      this.probeType = 3; // 传递给scroll组件,派发滚动事件
    },
    methods: {
      $_handlerPlayList(playlist) {
        const bottom = playlist.length ? '60px' : '';
        this.$refs.list.$el.style.bottom = bottom;
        this.$refs.list.refresh();
      },
      back() {
        this.$router.back();
      },
      ListScroll(po) {
        let zIndex = 0, height = 0, scale = 1, paddingTop = '70%', display = 'block',
            translateY = Math.max(po.y, this.maxTransformY),
            percent = Math.abs(po.y / this.bgImageHieght);
        if (translateY > 0) {
          scale += percent;
          zIndex = 10;
        }

        if (translateY <= this.maxTransformY) {
          zIndex = 10;
          height = this.titleHieght;
          paddingTop = 0;
          display = 'none';
        }
        this.$refs.bgImage.style.zIndex = zIndex;
        this.$refs.bgImage.style.height = `${height}px`;
        this.$refs.bgImage.style.paddingTop = `${paddingTop}`;
        this.$refs.bgImage.style.transform = `scale(${scale})`;
        this.$refs.bgLayer.style.transform = `translate3d(0,${translateY}px,0)`;
        this.$refs.play.style.display = display;
      },
      randomClick() {
        this.randomPlay({ list: this.songs });
      },
      async selectItem(item,index) {
        this.selectPlay({
          list: this.songs,
          index
        });
      },
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ]),
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
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
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
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
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: absolute
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>