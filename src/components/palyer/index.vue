<template>
  <div class="player" v-show="playList.length">
    <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background"><img width="100%" height="100%" :src="currentSong.image"></div>
        <div class="top">
          <div class="back" @click="back"><i class="icon-back"></i></div>
          <h1 class="title">{{ currentSong.name }}</h1>
          <h2 class="subtitle">{{ currentSong.singer }}</h2>
        </div>
        <div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper">
              <div class="cd" ref="middleImageWrapper">
                <img class="image" ref="middleImage" :src="currentSong.image" :class="{'play': playing}">
              </div>
            </div>
            <div class="playing-lyric-wrapper"><div class="playing-lyric">{{ playingLyric }}</div></div>
          </div>

          <scroll class="middle-r" :data="currentLyric && currentLyric.lines" ref="lyricList">
            <div class="lyric-wrapper">
              <div class="currentLyric" v-if="currentLyric">
                <p class="text"
                   ref="lyricLine"
                   v-for="(line,index) in currentLyric.lines"
                   :key="index"
                   :class="{'current': currentLineNum === index}">{{ line.txt }}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>

          <div class="progress-wrapper">
            <span class="time time-l">{{ tocoundown(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <progress-bar
                :currentPercent="currentPercent"
                :duration="currentSong.duration"
                @progressChangeing="progressChangeing"
                @progressChange="progressChange">
              </progress-bar>
            </div>
            <span class="time time-r">{{ tocoundown(currentSong.duration) }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left"><i @click="$_changeMode" :class="$_iconMode"></i></div>
            <div class="icon i-left"><i class="icon-prev" @click="prev"></i></div>
            <div class="icon i-center">
              <i :class="[ playing ? 'icon-pause': 'icon-play' ]" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right"><i class="icon-next" @click="next"></i></div>
            <div class="icon i-right" @click="$_toggleFavorite(currentSong)"><i :class="$_getFavoriteIcon(currentSong)"></i></div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <div class="imgWrapper" ref="miniImageWraper">
            <img ref="miniImage" width="40" height="40px" :src="currentSong.image" :class="{'play': playing}">
          </div>
        </div>
        <div class="text">
          <h2 class="name">{{ currentSong.name }}</h2>
          <p class="desc">{{ currentSong.singer }}</p>
        </div>
        <div class="control">
          <progress-circle :diameter="diameter" :currentPercent="currentPercent">
            <i :class="[ playing ? 'icon-pause-mini': 'icon-play-mini' ]" class="icon-mini" @click.stop="togglePlaying"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlaylist"><i class="icon-playlist"></i></div>
      </div>
    </transition>
    <play-list ref="playlist" />
    <audio ref="audio" :src="currentSong.url" @ended="ended" @canplay="canplay" @error="error" @timeupdate="timeupdate"></audio>
  </div>
</template>

<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  import { playerMixin } from 'common/js/mixin'
  import Scroll from 'base/scroll/index'
  import ProgressBar from 'base/progress-bar/index'
  import ProgressCircle from 'base/progress-circle/index'
  import PlayList from 'components/playlist/index'
  import Lyric from 'lyric-parser'
  export default {
    name: "index",
    components: {
      Scroll,
      ProgressBar,
      ProgressCircle,
      PlayList
    },
    mixins: [playerMixin],
    data() {
      return {
        songReady: false,
        currentTime: 0,
        diameter: 32, // 小播放cd按钮直径
        currentLyric: null, // 歌词
        currentLineNum: 0, // 当前歌词高亮的行数
        currentShow: 'cd', // 大播放cd和歌词列表的切换显示
        playingLyric: '', // 大播放cd歌词
      };
    },
    computed: {
      ...mapGetters([
        'fullScreen',
        'playList',
        'currentSong',
        'playing',
        'currentIndex',
        'mode'
      ]),
      // 当前播放时长和总时长的比例
      currentPercent() {
        return this.currentTime / this.currentSong.duration;
      }
    },
    watch: {
      currentSong(newSong,oldSong) {
        if (!newSong.id) {
          this.$refs.audio.pause();
          return ;
        }
        if (newSong.id === oldSong.id) {
          return ;
        }

        if (this.currentLyric) {
          this.currentLyric.stop();
          this.currentLineNum = 0;
          this.currentLyric = null;
          this.playingLyric = '';
        }

        this.songReady = false;
        this.$nextTick(() => {
          this.$refs.audio.play();
          this.getLyric();
        });
      }
    },
    created() {
      this.touch = {
        startX: 0,
        startY: 0,
        moveX: 0,
        percent: 0,
        start: false
      }
    },
    methods: {
      // 获取歌词
      getLyric() {
        if (this.currentSong.id) {
          this.currentSong.getLyric().then(lyric => {
            this.currentLyric = new Lyric(lyric,this.handleLyric);
            if (this.playing) {
              this.currentLyric.play();
            }
          }).catch(() => { // 获取不到歌词时
            this.currentLineNum = 0;
            this.currentLyric = null;
            this.playingLyric = '';
          })
        }
      },
      // 歌词变化时的函数
      handleLyric({ lineNum,txt }) {
        this.currentLineNum = lineNum;
        this.playingLyric = txt;

        // 让歌词高亮始终显示在正中间, (滚动条向上滚动)
        if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5];
          if (lineEl) {
            this.$refs.lyricList.scrollToElement(lineEl, 1000);
          }
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000);
        }
      },
      middleTouchStart(e) {
        this.touch.start = true;
        this.touch.startX = e.touches[0].pageX;
        this.touch.startY = e.touches[0].pageY;
      },
      middleTouchMove(e) {
        if (!this.touch.start) {
          return;
        }

        const deltaX = e.touches[0].pageX - this.touch.startX,
          deltaY = e.touches[0].pageY - this.touch.startY,
          clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        // 如果纵向滚动大于横向滚动 或 当前在cd页且滚动大于0时, 不做操作
        if (Math.abs(deltaY) > Math.abs(deltaX) || deltaX >= 0 && this.currentShow === 'cd') {
          return;
        }

        let left = this.currentShow === 'cd' ? 0 : -clientWidth,
          moveX = Math.min(Math.max(-clientWidth, left += deltaX), 0);

        this.touch.moveX = moveX;
        this.touch.percent = Math.abs(moveX / clientWidth);
        this.$refs.middleL.style.opacity = 1 - this.touch.percent;
        this.$refs.lyricList.$el.style.transform = `translate3d(${moveX}px,0,0)`;
      },
      middleTouchEnd() {
        this.touch.start = false;

        const width = document.documentElement.clientWidth || document.body.clientWidth || window.innerWidth;

        let moveX, opacity;
        if (this.currentShow === 'cd') {  // 从右向左滑动
          if (this.touch.percent >= 0.4) {
            moveX = -width;
            opacity = 0
            this.currentShow = 'lyric';
          } else {
            moveX = 0;
            opacity = 1;
          }
        } else {  // 从左向右滑动
          if (1 - this.touch.percent >= 0.2) {
            moveX = 0;
            opacity = 1;
            this.currentShow = 'cd';
          } else {
            moveX = -width;
            opacity = 0;
            this.currentShow = 'lyric';
          }
        }
        this.touch.percent = 0;
        this.$refs.middleL.style.opacity = opacity;
        this.$refs.lyricList.$el.style.transform = `translate3d(${moveX}px,0,0)`;
      },
      // 动画入场
      enter() {
        const {moveX, moveY, scale} = this.getPosAndScale();

        let keyframes = [
          {
            transform: `translate3d(${moveX}px,${moveY}px,0) scale(${scale})`,
          },
          {
            transform: `translate3d(0,0,0) scale(1.1)`,
          },
          {
            transform: `translate3d(0,0,0) scale(1)`,
          }
        ]
        this.animate = this.$refs.middleImageWrapper.animate(keyframes, {
          duration: 400,
          easing: 'linear'
        });
      },
      // 动画入场之后
      afterEnter() {
        this.animate = '';
      },
      // 动画离开
      leave() {
        const {moveX, moveY, scale} = this.getPosAndScale();

        let keyframes = [
          {
            transform: `translate3d(0,0,0) scale(1)`,
          },
          {
            transform: `translate3d(${moveX}px,${moveY}px,0) scale(${scale})`,
          }
        ]
        this.animate = this.$refs.middleImageWrapper.animate(keyframes, {
          duration: 350,
          easing: 'linear'
        });
      },
      // 离开之后
      afterLeave() {
        this.animate = '';
      },
      // 计算大播放cd和小播放cd的偏移量
      getPosAndScale() {
        let middleImageWrapper = this.$refs.middleImageWrapper,
          middleImageWrapperWidth = middleImageWrapper.clientHeight,
          paddingLeft = 20,
          paddingBottom = 30,
          miniImageWidth = 40,
          miniImageX = paddingLeft + miniImageWidth / 2;

        let moveX = -(middleImageWrapper.getBoundingClientRect().left + middleImageWrapperWidth / 2 - miniImageX),
          moveY = window.innerHeight - middleImageWrapper.getBoundingClientRect().top - middleImageWrapper.clientHeight / 2 - paddingBottom,
          scale = miniImageWidth / middleImageWrapperWidth;

        return {moveX, moveY, scale};
      },
      // 计算内层Image的transform旋转, 并同步到外层容器
      syncWrapperTransform(wrapper, inner) {
        let innerTransform = window.getComputedStyle(inner, null).transform,
          wrapperTransform = window.getComputedStyle(wrapper, null).transform,
          newWrapperTransform = wrapperTransform === 'none' ? innerTransform : wrapperTransform.concat(' ', innerTransform);
        wrapper.style.transform = `${newWrapperTransform}`;
      },
      prev() {
        if (!this.songReady) {
          return;
        }

        let index = this.currentIndex - 1;
        if (index < 0) {
          index = this.playList.length - 1;
        }
        this.setCurrentIndex(index);
        this.setPlaying(true);
      },
      next() {
        if (!this.songReady) {
          return;
        }

        let index = this.currentIndex + 1;
        if (index >= this.playList.length) {
          index = 0;
        }
        this.setCurrentIndex(index);
        this.setPlaying(true);
      },
      togglePlaying() {
        if (!this.songReady) {
          return;
        }

        this.setPlaying(!this.playing);

        if (this.currentLyric) {
          this.currentLyric.togglePlay();
        }

        const audio = this.$refs.audio;
        if (this.playing) {
          audio.play();
        } else {
          audio.pause();
          if (this.fullScreen) {
            this.syncWrapperTransform(this.$refs.middleImageWrapper, this.$refs.middleImage);
          } else {
            this.syncWrapperTransform(this.$refs.miniImageWraper, this.$refs.miniImage);
          }
        }
      },
      showPlaylist() {
        this.$refs.playlist.show();
      },
      // 播放完毕
      ended() {
        let mode = this.mode,
            audio = this.$refs.audio;
        if (mode === 1 || this.playList.length === 1) { // 循环播放
          audio.currentTime = 0;
          audio.play();
          if (this.currentLyric) {
            this.currentLyric.play();
          }
        } else {
          this.next();
        }
      },
      // 歌曲已经加载好,可以开始播放触发
      canplay() {
        this.songReady = true;
        this.savePlayHistory(this.currentSong);
      },
      // 歌曲加载失败
      error() {
        this.songReady = true;
      },
      // 进度条拖动时
      progressChangeing(current) {
        this.currentTime = current;

        // 拖动进度条时歌曲和歌词播放暂停
        if (this.currentLyric) {
          this.currentLyric.seek(current * 1000);
          this.currentLyric.stop();
        }
      },
      // 点击进度条
      progressChange(current) {
        this.$refs.audio.currentTime = current;
        if (this.currentLyric) {
          this.currentLyric.seek(current * 1000);
        }

        // 当歌曲暂停时,点击进度条让歌曲和歌词播放
        if (!this.playing) {
          this.togglePlaying();
          this.currentLyric.togglePlay();
        }
      },
      timeupdate() {
        this.currentTime = this.$refs.audio.currentTime;
      },
      back() {
        this.setFullScreen(false);
      },
      open() {
        this.setFullScreen(true);
      },
      tocoundown(countdown) {
        let str = '';
        if (countdown > 0) {
          let minute = this.toTwo(Math.floor(countdown / 60 % 60)),
            seconds = this.toTwo(Math.floor(countdown % 60));
          str = `${minute}:${seconds}`;
        } else {
          str = '00:00';
        }
        return str;
      },
      toTwo(value) {
        return (value >= 10 ? '' : '0') + value;
      },
      ...mapMutations([
        'setFullScreen',
        'setPlaying',
        'setCurrentIndex',
      ]),
      ...mapActions([
        'savePlayHistory'
      ])
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          transition-duration .5s
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            box-sizing: border-box
            height: 100%
            .cd
              width: 100%
              height: 100%
              border-radius: 50%
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                box-sizing: border-box
                border-radius: 50%
                border: 10px solid rgba(255, 255, 255, 0.1)
              .play
                animation: rotate 20s linear infinite
          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          transition-duration .5s
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
            .pure-music
              padding-top: 50%
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium

      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
            height 30px
            margin 0 10px
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme

      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0

        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)

    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        height: 40px
        padding: 0 10px 0 20px
        .imgWrapper
          height: 100%
          width: 100%
          img
            border-radius: 50%
            &.play
              animation: rotate 10s linear infinite
            &.pause
              animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: .5px
          top: .5px

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>