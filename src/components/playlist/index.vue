<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" @click="$_changeMode" :class="$_iconMode"></i>
            <span class="text">{{ mode === 0 ? '顺序播放' : mode === 1 ? '循环播放' : '随机播放' }}</span>
            <span class="clear" @click="showConfirm"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <scroll class="list-content" ref="listContent" :data="sequenceList">
          <transition-group  name="list" tag="ul">
            <li class="item" v-for="item in sequenceList" :key="item.id" @click="selectItem(item)">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{ item.name }}</span>
              <span class="like" @click.stop="$_toggleFavorite(item)"><i :class="$_getFavoriteIcon(item)"></i></span>
              <span class="delete" @click.stop="deleteOne(item)"><i class="icon-delete"></i></span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="showAddSong"><i class="icon-add"></i><span class="text">添加歌曲到队列</span></div>
        </div>
        <div class="list-close" @click="hide"><span>关闭</span></div>
      </div>
      <add-song ref="addSong"></add-song>
      <confirm ref="confirm" text="是否清空播放列表" confirmBtnText="清空" @confirm="clearPlay" />
    </div>
  </transition>
</template>

<script>
  import { mapGetters,mapMutations,mapActions} from 'vuex'
  import { playerMixin } from 'common/js/mixin'
  import Confirm from 'base/confirm'
  import Scroll from 'base/scroll'
  import AddSong from 'components/add-song'
  export default {
    name: "index",
    components: {
      Confirm,
      Scroll,
      AddSong
    },
    mixins: [playerMixin],
    data() {
      return {
        showFlag: false,
      };
    },
    computed: {
      ...mapGetters([
        'mode',
        'currentSong',
        'sequenceList',
        'playList',
      ])
    },
    methods: {
      show() {
        this.showFlag = true;
        setTimeout(() => {
          this.$refs.listContent.refresh();
        },20);
      },
      hide() {
        this.showFlag = false;
      },
      showConfirm() {
        this.$refs.confirm.show();
      },
      clearPlay() {
        this.clearPlaySong();
        this.hide();
      },
      selectItem(item) {
        let index = this.playList.findIndex(song => {
          return song.id === item.id;
        })
        this.setCurrentIndex(index);
        this.setPlaying(true);
      },
      getCurrentIcon(item) {
        if (item.id === this.currentSong.id) {
          return 'icon-play';
        }
      },
      deleteOne(item) {
        this.deletePlaySong(item);
        if (!this.playList.length) {
          this.hide();
        }
      },
      showAddSong() {
        this.$refs.addSong.show();
      },
      ...mapMutations([
        'setCurrentIndex',
        'setPlaying'
      ]),
      ...mapActions([
        'clearPlaySong',
        'deletePlaySong'
      ])
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>