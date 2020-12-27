<template>
  <div class="singer" ref="singer">
    <list-view :data="singer" @select="select" ref="listView"/>
    <router-view></router-view>
  </div>
</template>

<script>
  import { getSingerList } from 'api/singer'
  import ListView from 'base/listview/index'
  import { mapMutations } from 'vuex'
  import { playListMixin } from 'common/js/mixin'
  import singer from 'common/js/singer'

  export default {
    name: "index",
    mixins: [playListMixin],
    components: {
      ListView
    },
    data() {
      return {
        singer: {}
      };
    },
    created() {
      this.getSingerList();
    },
    methods: {
      $_handlerPlayList(playlist) {
        const bottom = playlist.length ? '60px' : '';
        this.$refs.singer.style.bottom = bottom;
        this.$refs.listView.refresh();
      },
      // 获取歌手列表
      getSingerList() {
        getSingerList().then(res => {
          this.singer = this.normalizeSinger(res.list);
        })
      },
      // 序列表歌手列表数据
      normalizeSinger(list) {
        let map = {
          '热门': []
        };
        for (let i = 0; i < 26; i++) {
          const en = String.fromCharCode(65 + i);
          map[en] = [];
          for (let j = 0,length = list.length; j < length; j++) {
            const item = list[j];

            if (i === 0 && j <= 9) {
              map['热门'].push(new singer({
                id: item.Fsinger_mid,
                name: item.Fsinger_name
              }));
            }

            if (en === item.Findex) {
              map[en].push(new singer({
                id: item.Fsinger_mid,
                name: item.Fsinger_name
              }));
            }
          }
        }
        return map;
      },
      // 点击歌手跳转歌手详情页
      select(singer) {
        this.$router.push({ path: `/singer/${singer.id}` });
        this.setSinger(singer);
      },
      ...mapMutations([
        'setSinger'
      ])
    }
  }
</script>

<style scoped lang="stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>