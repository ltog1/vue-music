<template>
  <div class="progress-circle">
    <svg :width="diameter" :height="diameter" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-bar"
              r="50" cx="50" cy="50"
              fill="transparent"
              stroke-width="8"
              :stroke-dasharray="dashArray"
              :stroke-dashoffset="dashoffset">
      </circle>
    </svg>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "index",
    props: {
      // 直径
      diameter: {
        type: Number,
        default: 32
      },
      currentPercent: {
        type: Number,
        default: 0
      }
    },
    computed: {
      dashoffset() {
        return (1 - this.currentPercent) * this.dashArray
      }
    },
    data() {
      return {
        dashArray: 100 * Math.PI
      };
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .progress-circle
    position: relative
    .progress-bar
      transform: scale(0.9) rotate(-90deg)
      stroke: $color-theme
      stroke-width: 8px
      transform-origin: center
</style>