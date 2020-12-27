<template>
  <scroll class="suggest"
          ref="suggest"
          :data="songs"
          :pullup="pullup"
          :beforeScroll="beforeScroll"
          @scrollToEnd="scrollToEnd"
          @beforeScrollStart="beforeScrollStart">
    <ul class="suggest-list" ref="suggestList">
      <li class="suggest-item" v-for="(item,index) in songs" :key="index" @click="selectItem(item)">
        <div class="icon"><i :class="[item.type ? 'icon-mine' : 'icon-music']"></i></div>
        <div class="name"><p class="text">{{ getName(item) }}</p></div>
      </li>
      <loading class="loading" v-if="!noMore" title="" />
    </ul>
    <div class="no-result-wrapper" v-if="noMore && !songs.length"><no-result /></div>
  </scroll>
</template>

<script>
  import { search } from 'api/search'
  import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
  import { mapMutations,mapActions } from 'vuex'
  import Scroll from 'base/scroll'
  import Loading from 'base/loading'
  import singer from 'common/js/singer'
  import NoResult from 'base/no-result'


  const perpage = 20;

  export default {
    name: "index",
    props: {
      showSinger: {
        type: Boolean,
        default: true
      },
      query: {
        type: String,
        default: ''
      }
    },
    components: {
      Scroll,
      Loading,
      NoResult
    },
    data() {
      return {
        page: 1,
        songs: [],
        noMore: false
      };
    },
    watch: {
      query(newQuery) {
        if (!newQuery) {
          this.songs = [];
          return ;
        }
        this.page = 1;
        this.noMore = false;
        this.$refs.suggest.scrollTo(0, 0);
        this.search()
      }
    },
    created() {
      this.pullup = true;
      this.beforeScroll = true;
    },
    methods: {
      // 获取搜索列表
      search() {
        if (this.noMore) {
          return ;
        }

        search(this.query, this.page, perpage, this.showSinger).then(res => {
          this.checkMore(res);

          this.genResult(res).then(songs => {
            if (this.page > 1) {
              this.songs = this.songs.concat(songs);
            } else {
              this.songs = songs;
            }
          });
        });
      },
      checkMore(data) {
        const song = data.song;
        if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
          this.noMore = true;
        }
      },
      // 序列化搜索列表
      genResult(data) {
        let result = [];
        if (data.zhida && data.zhida.singerid && this.page === 1) {
          result.push(Object.assign(data.zhida, { type: 'singer' }));
        }

        return processSongsUrl(this.normalizeSongs(data.song.list)).then(songs => {
          result = result.concat(songs);
          return result;
        })
      },
      normalizeSongs(list) {
        let result = [];
        list.forEach(musicData => {
          if (isValidMusic(musicData)) {
            result.push(new createSong(musicData));
          }
        });
        return result;
      },
      getName(item) {
        if (item.type) {
          return item.singername;
        } else {
          return `${item.name}-${item.singer}`;
        }
      },
      // 滚动到底部
      scrollToEnd() {
        if (this.noMore) {
          return;
        }

        this.page++;
        this.search();
      },
      beforeScrollStart() {
        this.$emit('beforeScrollStart');
      },
      refresh() {
        this.$refs.suggest.refresh();
      },
      selectItem(item) {
        // 跳转歌手
        if (item.type) {
          this.setSinger(new singer({
            id: item.singermid,
            name: item.singername,
          }));
          this.$router.push({ path: `/search/${item.singermid}` });
        } else {  // 跳转歌曲
          this.insertSong(item);
        }
        this.$emit('selectItem',item);
      },
      ...mapMutations([
        'setSinger',
      ]),
      ...mapActions([
        'insertSong',
      ])
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
        &:last-of-type
         padding-bottom: 10px
      .loading
        position relative
        top 12px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>