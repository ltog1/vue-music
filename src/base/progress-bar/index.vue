<template>
  <div class="progress-bar" ref="progressBar" @click="progressBarClick">
    <div class="progress" ref="progress"></div>
    <div class="progress-btn" ref="progressBtn"
         @touchstart.prevent="progressTouchStart"
         @touchmove.prevent="progressTouchMove"
         @touchend="progressTouchEnd">
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    props: {
      // 当前播放时间和总时长的比例
      currentPercent: {
        type: Number,
        default: 0
      },
      // 总时长
      duration: {
        type: Number,
        default: 0
      }
    },
    watch: {
      currentPercent(newPercent) {
        if (this.touch.touchMoveing || newPercent <= 0) {
          return ;
        }

        let progressBarWidth = this.$refs.progressBar.clientWidth,
          currentWidth = Math.floor(newPercent * progressBarWidth);
        this.$refs.progress.style.width = `${currentWidth}px`;
        this.$refs.progressBtn.style.transform = `translate3d(${currentWidth}px,0,0)`;
      }
    },
    data() {
      return {

      };
    },
    created() {
      this.touch = {
        startX: 0,
        progressBarWidth: 0,
        moveX: 0,
        current: 0,
        touchMoveing: false
      };
    },
    methods: {
      progressTouchStart(e) {
        const touch = this.touch;
        touch.startX = e.touches[0].pageX - touch.moveX;
        touch.progressBarWidth = this.$refs.progressBar.clientWidth;
      },
      progressTouchMove(e) {
        const touch = this.touch;

        let moveX = Math.max(0, Math.floor(e.touches[0].pageX - touch.startX));
        touch.moveX = Math.min(moveX, touch.progressBarWidth);

        touch.touchMoveing = true;
        touch.current = touch.moveX / touch.progressBarWidth * this.duration;
        this.$refs.progressBtn.style.transform = `translate3d(${touch.moveX}px,0,0)`;
        this.$refs.progress.style.width = `${touch.moveX}px`;
        this.$emit('progressChangeing',touch.current);
      },
      progressTouchEnd() {
        this.touch.touchMoveing = false;
        this.$emit('progressChange',this.touch.current);
      },
      progressBarClick(e) {
        const rect = e.target.getBoundingClientRect(),
              touch = this.touch;
        touch.current = ((e.pageX - rect.left) / this.$refs.progressBar.clientWidth) * this.duration;
        this.$emit('progressChange',touch.current);
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .progress-bar
    position: relative
    top: 13px
    height: 4px
    background: rgba(0, 0, 0, 0.3)
    .progress
      position: absolute
      height: 100%
      background: $color-theme
    .progress-btn
      position: absolute
      left -8px
      top -6px
      width 16px
      height 16px
      box-sizing: border-box
      border: 3px solid $color-text
      border-radius: 50%
      background: $color-theme
</style>