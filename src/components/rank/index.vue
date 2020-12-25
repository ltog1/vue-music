<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" :data="ranks" ref="scroll">
      <ul>
        <li class="item" v-for="item in ranks" :key="item.id" @click="selectItem(item)">
          <div class="icon"><img width="100" height="100" v-lazy="item.picUrl"></div>
          <ul class="songlist">
            <li class="song" v-for="(song,index) in item.songList" :key="index">
              <span>{{ index + 1}}、</span>
              <span>{{ song.songname }}--{{ song.singername }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <loading v-if="!ranks.length" />
    <router-view></router-view>
  </div>
</template>

<script>
  import { getTopList } from 'api/rank'
  import { playListMixin } from 'common/js/mixin'
  import { mapMutations } from 'vuex'
  import Scroll from 'base/scroll/index'
  import Loading from 'base/loading/index'

  export default {
    name: "index",
    components: {
      Scroll,
      Loading
    },
    mixins: [playListMixin],
    data() {
      return {
        ranks: []
      };
    },
    created() {
      this.getRanks();
    },
    methods: {
      $_handlerPlayList(playlist) {
        const bottom = playlist.length ? '60px' : '';
        this.$refs.rank.style.bottom = bottom;
        this.$refs.scroll.refresh();
      },
      getRanks() {
        getTopList().then(res => {
          this.ranks = res;
        });
      },
      selectItem(item) {
        this.$router.push({ path: `/rank/${item.id}` });
        this.setTopList({
          id: item.id,
          name: item.topTitle
        });
      },
      ...mapMutations([
        'setTopList'
      ])
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
</style>