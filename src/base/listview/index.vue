<template>
  <scroll class="listview"
          :data="data"
          :listenScroll="listenScroll"
          :probeType="probeType"
          ref="scroll"
          @scroll="listviewScroll">
    <ul>
      <li v-for="(item,key) in data" :key="key" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{ key }}</h2>
        <ul>
          <li v-for="singer in item" :key="singer.id" class="list-group-item" @click="selectItem(singer)">
            <img class="avatar" v-lazy="singer.icon">
            <span class="name">{{ singer.name }}</span>
          </li>
        </ul>
      </li>
    </ul>

    <div class="list-shortcut">
      <ul ref="shortcutList" @touchstart.stop.prevent="alphabetTouchStart" @touchmove.stop.prevent="alphabetTouchMove">
        <li class="item"
          v-for="(item,key,index) in data"
          :key="key"
          :data-index="index"
          :class="{'current': currentIndex === index}"
        >{{ key === '热门' ? '热' : key }}</li>
      </ul>
    </div>

    <div class="list-fixed" ref="fixedTitle" v-if="fixedShow">
      <div class="fixed-title">{{ fixedText }}</div>
    </div>

    <loading v-if="!Object.keys(data).length"/>
  </scroll>
</template>

<script>
  import Scroll from 'base/scroll/index'
  import Loading from 'base/loading/index'
  import { getDataAttr } from 'common/js/dom'

  const fixedHeight = 30;

  export default {
    name: "index",
    components: {
      Scroll,
      Loading
    },
    props: {
      data: {
        type: Object,
        default: null
      }
    },
    computed: {
      fixedText() {
        let arr = [];
        for (let key in this.data) {
          arr.push(key);
        }
        return arr[this.currentIndex];
      }
    },
    watch: {
      diffY(newDiffY) {
        newDiffY += 10;

        let move = (newDiffY > 0 && newDiffY <= fixedHeight) ? newDiffY - fixedHeight : 0;
        if (this.move === move) {
          return;
        }
        this.move = move;
        this.$refs.fixedTitle.style.transform = `translate3d(0,${move}px,0)`;
      }
    },
    data() {
      return {
        currentIndex: 0,
        fixedShow: true,
        diffY: 0
      };
    },
    updated() {
      this.calculateHeight();
    },
    created() {
      // 此处数据不需要实时监听,因此不必定义在data函数里
      this.touch = {
        itemHeight: 0,
        startY: 0,

        dataLength: 0
      }
      this.listenScroll = true; // 传递给scroll组件,是否派发滚动事件
      this.probeType = 3; // 传递给scroll组件,派发滚动事件
      this.listHeight = [];
    },
    methods: {
      selectItem(singer) {
        this.$emit('select',singer);
      },
      alphabetTouchStart(e) {
        const index = +getDataAttr(e.target,'index'), // 获取自定义属性
          shortcutList = this.$refs.shortcutList;
        this.scrollToElement(this.$refs.listGroup,index);

        let touch = this.touch;
        this.currentIndex = index;
        touch.itemHeight = shortcutList.children[0].clientHeight ? shortcutList.children[0].clientHeight : 0;
        touch.startY = shortcutList.getBoundingClientRect().y;
        touch.dataLength = Object.keys(this.data).length;
      },
      alphabetTouchMove(e) {
        if (this.timer) {
          clearTimeout(this.timer);
        }

        this.timer = setTimeout(() => {
          let touch = this.touch;
          const clientY = e.touches[0].clientY;
          const index = Math.floor((clientY - touch.startY) / touch.itemHeight);
          if (index >= 0 && index < touch.dataLength) {
            this.currentIndex = index;
            this.scrollToElement(this.$refs.listGroup,index);
          }
        },6);
      },
      // 计算每个字母对应歌手区域的高度,累加高度
      calculateHeight() {
        let list = this.$refs.listGroup,
            arr = [], height = 0;

        arr[0] = height;
        for (let i = 0; i < list.length; i++) {
          const item = list[i];
          height += item.clientHeight;
          arr.push(height);
        }
        this.listHeight = arr;
      },
      // 滚动滚动条,与右侧字母双向联动,高亮显示
      listviewScroll(pos) {
        let y = pos.y;

        // 滚动到顶部,大于0时
        if (y > 0) {
          this.fixedShow = false;
          return;
        }
        this.fixedShow = true;

        // 在中间滚动
        y = Math.floor(Math.abs(y - 10));
        for (let i = 0,length = this.listHeight.length; i < length; i++) {
          const item1 = this.listHeight[i];
          const item2 = this.listHeight[i + 1];
          if (y >= item1 && y < item2) {
            this.diffY = item2 - y;
            this.currentIndex = i;
            return;
          }
        }
      },
      scrollToElement(el,index) {
        const element = el[index];
        this.$refs.scroll.scrollToElement(element,300);
      },
      refresh() {
        this.$refs.scroll.refresh();
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>