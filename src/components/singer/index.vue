<template>
  <div class="singer">
    <list-view :data="singer" @select="select"/>
    <router-view></router-view>
  </div>
</template>

<script>
  import { getSingerList } from 'api/singer'
  import ListView from 'base/listview/index'
  import { mapMutations } from 'vuex'
  export default {
    name: "index",
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
              map['热门'].push({
                id: item.Fsinger_mid,
                name: item.Fsinger_name,
                icon: `https://y.gtimg.cn/music/photo_new/T001R150x150M000${item.Fsinger_mid}.jpg?max_age=2592000`
              });
            }

            if (en === item.Findex) {
              map[en].push({
                id: item.Fsinger_mid,
                name: item.Fsinger_name,
                icon: `https://y.gtimg.cn/music/photo_new/T001R150x150M000${item.Fsinger_mid}.jpg?max_age=2592000`
              });
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