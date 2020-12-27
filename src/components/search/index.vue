<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box @query="onQueryChange" ref="searchBox" />
    </div>
    <div class="shortcut-wrapper" v-show="!query" ref="shortcutWra">
      <scroll class="shortcut" :data="shortcut"  ref="scroll">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul><li class="item" v-for="item in hotKey" :key="item.n" @click="$_addQuery(item.k)">{{ item.k }}</li></ul>
          </div>

          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm"><i class="icon-clear"></i></span>
            </h1>
            <search-history-list :history="searchHistory" @deleteOne="$_deleteOne" @select="$_addQuery" />
          </div>
        </div>
      </scroll>
    </div>

    <div class="search-result" ref="searchResult" v-show="query">
      <search-list ref="searchList" :query="query" @selectItem="$_saveSearch" @beforeScrollStart="$_blurInput" />
    </div>
    <confirm ref="confirm" text="是否清空所有搜索记录" confirmBtnText="清空" @confirm="clearSearch" />
    <router-view></router-view>
  </div>
</template>

<script>
  import SearchBox from 'base/search-box'
  import SearchList from 'components/search-list'
  import SearchHistoryList from 'base/searchHistory-list'
  import Scroll from 'base/scroll'
  import Confirm from 'base/confirm'
  import { getHotKet } from 'api/search'
  import { playListMixin,searchMixin } from 'common/js/mixin'
  import { mapGetters,mapActions } from 'vuex'

  export default {
    name: "index",
    components: {
      SearchBox,
      SearchList,
      SearchHistoryList,
      Scroll,
      Confirm
    },
    mixins: [playListMixin,searchMixin],
    data() {
      return {
        hotKey: [],  // 热门搜索
        query: ''
      };
    },
    computed: {
      ...mapGetters([
        'searchHistory'
      ]),
      shortcut() {
        return this.hotKey.concat(this.searchHistory)
      },
    },
    created() {
      this.getHotKet();
    },
    methods: {
      getHotKet() {
        getHotKet().then(res => {
          this.hotKey = res.slice(0, 10);
        })
      },
      $_handlerPlayList(playlist) {
        const bottom = playlist.length ? '60px' : '';
        this.$refs.shortcutWra.style.bottom = bottom;
        this.$refs.searchResult.style.bottom = bottom;
        this.$refs.scroll.refresh();
        this.$refs.searchList.refresh();
      },
      // 搜索框的值改变时
      onQueryChange(query) {
        this.query = query;

        if (!this.query) {
          setTimeout(() => {
            this.$refs.scroll.refresh();
          },20);
        }
      },
      showConfirm() {
        this.$refs.confirm.show();
      },
      clearSearch() {
        this.clearSearchHistory();
      },
      ...mapActions([
        'clearSearchHistory',
      ])
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>