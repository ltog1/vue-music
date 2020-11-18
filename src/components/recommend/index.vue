<template>
  <div class="recommend">
    <scroll ref="scroll" class="recommend-content" :data="descList">
      <div>
        <div class="slider-wrapper" v-if="sliders.length">
          <slider>
            <div v-for="item in sliders" :key="item.id">
              <a :href="item.linkUrl"><img :src="item.picUrl" @load="refreshScroll"></a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li class="item" v-for="(item,index) in descList" :key="index">
              <div class="icon"><img v-lazy="item.imgurl"></div>
              <div class="text">
                <h2 class="name">{{ item.creator.name }}</h2>
                <p class="desc">{{ item.dissname }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <loading v-if="!descList.length" />
    </scroll>
  </div>
</template>

<script>
  import { getRecommend,getDiscList } from 'api/recommend'
  import Slider from 'base/slider/index'
  import Scroll from 'base/scroll/index'
  import loading from 'base/loading/index'

  export default {
    name: "index",
    components: {
      Slider,
      Scroll,
      loading
    },
    data() {
      return {
        sliders: [], // 轮播图数据
        descList: [], // 歌单列表数据
      };
    },
    created() {
      this.getRecommend();
      this.getDescList();
    },
    methods: {
      getRecommend() {
        getRecommend().then(res => {
          this.sliders = res;
        });
      },
      getDescList() {
        getDiscList().then(res => {
          this.descList = res.list;
        });
      },
      // 当幻灯片图片加载出来之后再更新滚动条
      refreshScroll() {
        if (!this.checkload) {
          this.$refs.scroll.refresh();
          this.checkload = true;
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
            img
              width 60px
              height 60px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
</style>